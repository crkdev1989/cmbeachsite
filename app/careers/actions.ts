"use server";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { uploadObject, getPresignedDownloadUrl } from "@/lib/storage/r2";
import { sendApplicationNotification } from "@/lib/email/resend";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;

const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

const POSITIONS = [
  "Utility",
  "Mass Grading",
  "Fine Grading",
  "Demolition",
  "Equipment Operator",
  "General Labor",
  "Other",
] as const;
type Position = (typeof POSITIONS)[number];
function isPosition(value: string): value is Position {
  return (POSITIONS as readonly string[]).includes(value);
}

const AVAILABILITY = ["Full-time", "Part-time", "Seasonal"] as const;
type Availability = (typeof AVAILABILITY)[number];
function isAvailability(value: string): value is Availability {
  return (AVAILABILITY as readonly string[]).includes(value);
}

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function hasValidResumeExtension(filename: string) {
  const lower = filename.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function submitApplication(
  _prevState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const position = formData.get("position");
  const yearsExperience = formData.get("yearsExperience");
  const experienceDescription = formData.get("experienceDescription");
  const hasLicenseRaw = formData.get("hasLicense");
  const hasCdlRaw = formData.get("hasCdl");
  const availability = formData.get("availability");
  const notes = formData.get("notes");
  const resume = formData.get("resume");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof position !== "string" ||
    !isPosition(position) ||
    typeof yearsExperience !== "string" ||
    !yearsExperience.trim() ||
    typeof experienceDescription !== "string" ||
    !experienceDescription.trim() ||
    (hasLicenseRaw !== "Yes" && hasLicenseRaw !== "No") ||
    (hasCdlRaw !== "Yes" && hasCdlRaw !== "No") ||
    typeof availability !== "string" ||
    !isAvailability(availability)
  ) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  if (!(resume instanceof File) || resume.size === 0) {
    return { status: "error", message: "Please attach your resume." };
  }

  if (resume.size > MAX_RESUME_BYTES) {
    return { status: "error", message: "Resume must be under 10MB." };
  }

  const typeOk = ALLOWED_RESUME_TYPES.has(resume.type);
  const extensionOk = hasValidResumeExtension(resume.name);
  if (!typeOk && !extensionOk) {
    return {
      status: "error",
      message: "Resume must be a PDF or Word document (.pdf, .doc, .docx).",
    };
  }

  let resumeKey: string;
  try {
    const buffer = Buffer.from(await resume.arrayBuffer());
    resumeKey = `applications/${randomUUID()}-${resume.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    await uploadObject(
      resumeKey,
      buffer,
      resume.type || "application/octet-stream",
    );
  } catch (error) {
    console.error("Resume upload failed:", error);
    return {
      status: "error",
      message: "Something went wrong uploading your resume. Please try again.",
    };
  }

  const hasLicense = hasLicenseRaw === "Yes";
  const hasCdl = hasCdlRaw === "Yes";

  try {
    await db.insert(applications).values({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      position,
      yearsExperience: yearsExperience.trim(),
      experienceDescription: experienceDescription.trim(),
      hasLicense,
      hasCdl,
      availability,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      resumeUrl: resumeKey,
    });
  } catch (error) {
    console.error("Failed to save application:", error);
    return {
      status: "error",
      message: "Something went wrong saving your application. Please try again.",
    };
  }

  // The application is safely stored at this point regardless of what
  // happens next — a notification-email hiccup shouldn't make the
  // applicant think their submission was lost.
  try {
    const resumeDownloadUrl = await getPresignedDownloadUrl(resumeKey);
    await sendApplicationNotification({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      position,
      yearsExperience: yearsExperience.trim(),
      availability,
      hasLicense,
      hasCdl,
      resumeDownloadUrl,
    });
  } catch (error) {
    console.error("Failed to send application notification email:", error);
  }

  return { status: "success" };
}
