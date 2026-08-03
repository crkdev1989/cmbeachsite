"use server";

import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { sendContactNotification } from "@/lib/email/resend";

const PROJECT_TYPES = [
  "Mass Grading",
  "Fine Grading",
  "Site Utilities",
  "Demolition",
  "Clean Up",
  "Snow Removal",
  "Other",
] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];
function isProjectType(value: string): value is ProjectType {
  return (PROJECT_TYPES as readonly string[]).includes(value);
}

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real users never see or fill this field (see ContactForm).
  // A bot that blindly fills every input trips it — pretend success so it
  // doesn't learn the field is a trap, but skip saving/emailing entirely.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return { status: "success" };
  }

  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const projectType = formData.get("projectType");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof phone !== "string" ||
    !phone.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof projectType !== "string" ||
    !isProjectType(projectType) ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return { status: "error", message: "Please fill in all fields." };
  }

  const trimmed = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  try {
    await db.insert(contactSubmissions).values({
      name: trimmed.name,
      phone: trimmed.phone,
      email: trimmed.email,
      projectType,
      message: trimmed.message,
    });
  } catch (error) {
    console.error("Failed to save contact submission:", error);
    return {
      status: "error",
      message: "Something went wrong submitting your message. Please try again.",
    };
  }

  // The submission is safely stored at this point — an email hiccup below
  // shouldn't make the sender think their message wasn't received.
  try {
    await sendContactNotification({
      name: trimmed.name,
      phone: trimmed.phone,
      email: trimmed.email,
      projectType,
      message: trimmed.message,
    });
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }

  return { status: "success" };
}
