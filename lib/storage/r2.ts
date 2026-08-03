import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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
