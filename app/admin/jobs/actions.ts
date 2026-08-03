"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import convert from "heic-convert";
import { db } from "@/lib/db";
import { jobs, media } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { isJobCategory } from "@/lib/constants";
import {
  getPresignedUploadUrl,
  getPublicUrl,
  getKeyFromPublicUrl,
  uploadObject,
  downloadObject,
  deleteObject,
} from "@/lib/storage/r2";

export type JobFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type MediaItem = typeof media.$inferSelect;

function readJobFields(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const location = formData.get("location");
  const jobDate = formData.get("jobDate");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof category !== "string" ||
    !isJobCategory(category) ||
    typeof jobDate !== "string" ||
    !jobDate.trim()
  ) {
    return null;
  }

  return {
    title: title.trim(),
    description:
      typeof description === "string" && description.trim()
        ? description.trim()
        : null,
    category,
    location:
      typeof location === "string" && location.trim()
        ? location.trim()
        : null,
    jobDate: jobDate.trim(),
  };
}

export async function createJob(
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  const user = await requireAdmin();

  const fields = readJobFields(formData);
  if (!fields) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  let newJobId: string;
  try {
    const [created] = await db
      .insert(jobs)
      .values({ ...fields, createdBy: user.id })
      .returning({ id: jobs.id });
    newJobId = created.id;
  } catch (error) {
    console.error("Failed to create job:", error);
    return {
      status: "error",
      message: "Something went wrong creating the job. Please try again.",
    };
  }

  revalidatePath("/admin");
  redirect(`/admin/jobs/${newJobId}`);
}

export async function updateJob(
  jobId: string,
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireAdmin();

  const fields = readJobFields(formData);
  if (!fields) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  try {
    await db.update(jobs).set(fields).where(eq(jobs.id, jobId));
  } catch (error) {
    console.error("Failed to update job:", error);
    return {
      status: "error",
      message: "Something went wrong saving the job. Please try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/jobs/${jobId}`);
  return { status: "success" };
}

export async function deleteJob(jobId: string) {
  await requireAdmin();

  const jobMedia = await db
    .select({ storageUrl: media.storageUrl })
    .from(media)
    .where(eq(media.jobId, jobId));

  await Promise.all(
    jobMedia.map(async (item) => {
      try {
        await deleteObject(getKeyFromPublicUrl(item.storageUrl));
      } catch (error) {
        // Don't let one stuck R2 object block deleting the rest — log and
        // keep going, the DB rows (and the job) still get cleaned up below.
        console.error("Failed to delete R2 object during job delete:", error);
      }
    }),
  );

  // media rows cascade-delete via the jobs FK.
  await db.delete(jobs).where(eq(jobs.id, jobId));

  revalidatePath("/admin");
  redirect("/admin");
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif"];
const VIDEO_EXTENSIONS = [".mp4", ".mov"];
const HEIC_EXTENSIONS = [".heic", ".heif"];

function inferMediaType(
  filename: string,
  contentType: string,
): "photo" | "video" | null {
  const lower = filename.toLowerCase();
  const isImage =
    contentType.startsWith("image/") ||
    IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const isVideo =
    contentType.startsWith("video/") ||
    VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));

  if (isImage) return "photo";
  if (isVideo) return "video";
  return null;
}

function isHeic(filename: string, contentType: string) {
  const lower = filename.toLowerCase();
  return (
    contentType === "image/heic" ||
    contentType === "image/heif" ||
    HEIC_EXTENSIONS.some((ext) => lower.endsWith(ext))
  );
}

// Some browsers report an empty file.type for .heic/.mov. The Content-Type
// used to sign the presigned URL and the one sent in the browser's PUT
// request must match exactly, so we resolve it once here and hand the
// resolved value back to the client to use for both.
function resolveContentType(filename: string, providedType: string): string {
  if (providedType) return providedType;
  const lower = filename.toLowerCase();
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".heif")) return "image/heif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".mov")) return "video/quicktime";
  if (lower.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}

export type UploadUrlResult =
  | { ok: true; key: string; uploadUrl: string; contentType: string }
  | { ok: false; message: string };

/**
 * Step 1 of uploading a file: get a presigned URL the browser can PUT the
 * file to directly, bypassing this server entirely for the file bytes.
 * Necessary because video files routinely exceed what a Server Action's
 * request body can carry.
 */
export async function requestMediaUploadUrl(
  jobId: string,
  filename: string,
  contentType: string,
): Promise<UploadUrlResult> {
  await requireAdmin();

  const resolvedType = resolveContentType(filename, contentType);
  const type = inferMediaType(filename, resolvedType);
  if (!type) {
    return {
      ok: false,
      message: `${filename}: only images (jpg, png, heic) and video (mp4, mov) are supported.`,
    };
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `jobs/${jobId}/${randomUUID()}-${safeName}`;

  try {
    const uploadUrl = await getPresignedUploadUrl(key, resolvedType);
    return { ok: true, key, uploadUrl, contentType: resolvedType };
  } catch (error) {
    console.error("Failed to create presigned upload URL:", error);
    return {
      ok: false,
      message: "Storage isn't configured yet — uploads can't be saved.",
    };
  }
}

export type FinalizeMediaResult =
  | { ok: true; media: typeof media.$inferSelect }
  | { ok: false; message: string };

/**
 * Step 2: called once the browser has finished PUTting the file straight
 * to R2. Converts HEIC to JPEG if needed, then records the media row.
 */
export async function finalizeMediaUpload(
  jobId: string,
  key: string,
  filename: string,
  contentType: string,
): Promise<FinalizeMediaResult> {
  const user = await requireAdmin();

  const type = inferMediaType(filename, contentType);
  if (!type) {
    await deleteObject(key).catch(() => {});
    return { ok: false, message: `${filename}: unsupported file type.` };
  }

  let finalKey = key;

  if (type === "photo" && isHeic(filename, contentType)) {
    try {
      const original = await downloadObject(key);
      const converted = await convert({
        buffer: original,
        format: "JPEG",
        quality: 0.9,
      });
      finalKey = key.replace(/\.(heic|heif)$/i, ".jpg");
      await uploadObject(finalKey, converted, "image/jpeg");
      await deleteObject(key);
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      await deleteObject(key).catch(() => {});
      return {
        ok: false,
        message: `${filename}: this HEIC photo couldn't be converted. Please export it as JPEG and try again.`,
      };
    }
  }

  const existing = await db
    .select({ displayOrder: media.displayOrder })
    .from(media)
    .where(eq(media.jobId, jobId))
    .orderBy(asc(media.displayOrder));
  const nextOrder =
    existing.length > 0
      ? existing[existing.length - 1].displayOrder + 1
      : 0;

  try {
    const [inserted] = await db
      .insert(media)
      .values({
        jobId,
        type,
        storageUrl: getPublicUrl(finalKey),
        displayOrder: nextOrder,
        uploadedBy: user.id,
      })
      .returning();

    revalidatePath(`/admin/jobs/${jobId}`);
    return { ok: true, media: inserted };
  } catch (error) {
    console.error("Failed to save media row:", error);
    await deleteObject(finalKey).catch(() => {});
    return {
      ok: false,
      message: `${filename}: uploaded but couldn't be saved. Please try again.`,
    };
  }
}

export async function updateMediaCaption(mediaId: string, caption: string) {
  await requireAdmin();
  const [updated] = await db
    .update(media)
    .set({ caption: caption.trim() || null })
    .where(eq(media.id, mediaId))
    .returning({ jobId: media.jobId });
  if (updated) {
    revalidatePath(`/admin/jobs/${updated.jobId}`);
  }
}

export async function deleteMedia(mediaId: string) {
  await requireAdmin();

  const [item] = await db
    .select()
    .from(media)
    .where(eq(media.id, mediaId))
    .limit(1);
  if (!item) return;

  try {
    await deleteObject(getKeyFromPublicUrl(item.storageUrl));
  } catch (error) {
    console.error("Failed to delete R2 object:", error);
  }

  await db.delete(media).where(eq(media.id, mediaId));
  revalidatePath(`/admin/jobs/${item.jobId}`);
}

export async function moveMedia(
  jobId: string,
  mediaId: string,
  direction: "up" | "down",
) {
  await requireAdmin();

  const items = await db
    .select()
    .from(media)
    .where(eq(media.jobId, jobId))
    .orderBy(asc(media.displayOrder));

  const index = items.findIndex((item) => item.id === mediaId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const a = items[index];
  const b = items[swapIndex];

  await db
    .update(media)
    .set({ displayOrder: b.displayOrder })
    .where(eq(media.id, a.id));
  await db
    .update(media)
    .set({ displayOrder: a.displayOrder })
    .where(eq(media.id, b.id));

  revalidatePath(`/admin/jobs/${jobId}`);
}
