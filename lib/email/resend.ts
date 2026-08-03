import { Resend } from "resend";

// Lazily created on first actual use, not at import time — same reasoning
// as lib/db and lib/storage/r2: importing this module before RESEND_API_KEY
// exists must never throw, only actually sending an email should.
let cached: Resend | undefined;

function getResendClient(): Resend {
  if (cached) return cached;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. See .env.example.");
  }

  cached = new Resend(apiKey);
  return cached;
}

// Applications go to both Samantha and Craig; general contact inquiries
// go to Samantha only.
const APPLICATION_NOTIFICATION_RECIPIENTS = [
  "samantha@cmbeach.com",
  "craig@cmbeach.com",
];
const CONTACT_NOTIFICATION_RECIPIENTS = ["samantha@cmbeach.com"];

export type ApplicationNotification = {
  name: string;
  phone: string;
  email: string;
  position: string;
  yearsExperience: string;
  availability: string;
  hasLicense: boolean;
  hasCdl: boolean;
  resumeDownloadUrl: string;
};

export async function sendApplicationNotification(
  application: ApplicationNotification,
) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not set. See .env.example.");
  }

  const resend = getResendClient();

  const lines = [
    `New job application from the website.`,
    ``,
    `Name: ${application.name}`,
    `Phone: ${application.phone}`,
    `Email: ${application.email}`,
    `Position: ${application.position}`,
    `Years of experience: ${application.yearsExperience}`,
    `Availability: ${application.availability}`,
    `Valid driver's license: ${application.hasLicense ? "Yes" : "No"}`,
    `CDL: ${application.hasCdl ? "Yes" : "No"}`,
    ``,
    `Resume: ${application.resumeDownloadUrl}`,
    `(This link expires in 7 days — the application record in the database`,
    `still has the file; a fresh link can be generated any time.)`,
  ];

  await resend.emails.send({
    from,
    to: APPLICATION_NOTIFICATION_RECIPIENTS,
    replyTo: application.email,
    subject: `New application: ${application.name} — ${application.position}`,
    text: lines.join("\n"),
  });
}

export type ContactNotification = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  message: string;
};

export async function sendContactNotification(contact: ContactNotification) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not set. See .env.example.");
  }

  const resend = getResendClient();

  const lines = [
    `New contact form submission from the website.`,
    ``,
    `Name: ${contact.name}`,
    `Phone: ${contact.phone}`,
    `Email: ${contact.email}`,
    `Project type: ${contact.projectType}`,
    ``,
    `Message:`,
    contact.message,
  ];

  await resend.emails.send({
    from,
    to: CONTACT_NOTIFICATION_RECIPIENTS,
    replyTo: contact.email,
    subject: `New contact form message from ${contact.name}`,
    text: lines.join("\n"),
  });
}
