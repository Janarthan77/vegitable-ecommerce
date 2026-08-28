import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'vegetable-shop-images';
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-vegetables.r2.dev';

const isCloudflareConfigured = Boolean(
  accountId &&
  accessKeyId &&
  secretAccessKey &&
  accountId !== 'your_cloudflare_account_id'
);

let s3Client: S3Client | null = null;

if (isCloudflareConfigured) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
  });
}

/**
 * Uploads a file buffer directly to Cloudflare R2 and returns the public CDN URL.
 * Only this URL will be stored in the database!
 */
export async function uploadToCloudflare(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<string> {
  const extension = path.extname(originalFilename) || '.webp';
  const cleanBase = path.basename(originalFilename, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueKey = `vegetables/${Date.now()}_${cleanBase}${extension}`;

  if (s3Client && isCloudflareConfigured) {
    // Direct Cloudflare R2 Upload
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Return the clean public Cloudflare CDN URL to store in Database
    const cleanPublicBase = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
    return `${cleanPublicBase}/${uniqueKey}`;
  }

  // Graceful fallback for local development before Cloudflare credentials are added:
  // Saves file to static uploads folder and returns local static URL or Cloudflare mock URL
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'vegetables');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localFilePath = path.join(uploadsDir, `${Date.now()}_${cleanBase}${extension}`);
  fs.writeFileSync(localFilePath, fileBuffer);

  const localRelativeUrl = `/uploads/vegetables/${path.basename(localFilePath)}`;
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}${localRelativeUrl}`;
}
