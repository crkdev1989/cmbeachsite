import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// All of this is lazily created on first actual use, not at import time.
// Importing this module (e.g. transitively, before R2 env vars exist)
// must never throw — only calling one of the exported functions should.
let cachedClient: S3Client | undefined;
let cachedBucket: string | undefined;

function getClient(): { client: S3Client; bucket: string } {
  if (cachedClient && cachedBucket) {
    return { client: cachedClient, bucket: cachedBucket };
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "R2 storage is not configured. See .env.example for R2_* variables.",
    );
  }

  // Plain S3 SDK v3 client pointed at R2's S3-compatible endpoint. Swapping
  // to any other S3-compatible provider (self-hosted MinIO, AWS S3, etc.)
  // later is just a matter of changing the endpoint/credential env vars —
  // no code using this client needs to change.
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  cachedBucket = bucketName;

  return { client: cachedClient, bucket: cachedBucket };
}

/**
 * Returns a time-limited URL the client can PUT a file to directly,
 * so uploads don't have to proxy through a Next.js server route.
 */
export function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 600,
) {
  const { client, bucket } = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export function deleteObject(key: string) {
  const { client, bucket } = getClient();
  return client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/**
 * Uploads a file directly from a Next.js server (Server Action / API
 * route), for cases where routing through the server is simpler than a
 * presigned-PUT-from-browser flow (e.g. avoids needing CORS configured on
 * the bucket for a single small file like a resume upload).
 */
export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
) {
  const { client, bucket } = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}

/**
 * Returns a time-limited URL to download a private object. Use this for
 * anything containing personal information (e.g. resumes) instead of
 * getPublicUrl, so files aren't permanently world-readable.
 */
export function getPresignedDownloadUrl(key: string, expiresInSeconds = 604800) {
  const { client, bucket } = getClient();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Builds the public URL for an object, assuming the bucket is served via
 * a public R2.dev URL or a custom domain configured in R2_PUBLIC_URL.
 */
export function getPublicUrl(key: string) {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) {
    throw new Error("R2_PUBLIC_URL is not set. See .env.example.");
  }
  return `${base.replace(/\/$/, "")}/${key}`;
}

/**
 * Reverses getPublicUrl — recovers the R2 object key from a URL that was
 * built from it, so a stored gallery media URL can be turned back into a
 * key for deletion.
 */
export function getKeyFromPublicUrl(url: string) {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) {
    throw new Error("R2_PUBLIC_URL is not set. See .env.example.");
  }
  const prefix = `${base.replace(/\/$/, "")}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : url;
}

/**
 * Downloads an object's full contents into memory. Used for server-side
 * post-processing (e.g. HEIC-to-JPEG conversion) where the file needs to
 * be read back after an initial direct-to-R2 upload.
 */
export async function downloadObject(key: string): Promise<Buffer> {
  const { client, bucket } = getClient();
  const result = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );
  const byteArray = await result.Body?.transformToByteArray();
  if (!byteArray) {
    throw new Error(`R2 object not found or empty: ${key}`);
  }
  return Buffer.from(byteArray);
}
