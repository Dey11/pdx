import dotenv from "dotenv";
import fs from "fs";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { BUCKET_NAME } from "./constants";
import { PDFDocument } from "pdf-lib";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { R2Object } from "./zod/schema";

dotenv.config();

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function listObjectAndMerge(
  Bucket: string,
  materialId: string,
  type: string
) {
  try {
    const res = await S3.send(
      new ListObjectsV2Command({
        Bucket,
        Prefix: `${type}/topics/${materialId}/`,
      })
    );
    const arr = res.Contents?.map((item) => item.Key);
    arr?.sort();
    const arr2 =
      arr?.map((item) => {
        return {
        Key: item as string,
        Bucket: BUCKET_NAME,
        };
      }) ?? [];
    const outputKey = await mergePdfsFromR2(arr2, BUCKET_NAME, type);
    return outputKey;
  } catch (err) {
    console.error(err);
  }
}

export async function uploadPdfToR2(
  filePath: string,
  bucket: string,
  key: string,
  metadata: Record<string, string> = {}
): Promise<void> {
  try {
    const pdfContent = fs.readFileSync(filePath);

    // Ensure all metadata values are strings
    const stringMetadata: Record<string, string> = {};
    for (const [key, value] of Object.entries(metadata)) {
      stringMetadata[key] = String(value);
    }

    await S3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: pdfContent,
        ContentType: "application/pdf",
        ContentEncoding: "inline",
        CacheControl: "max-age=3600",
        Metadata: stringMetadata,
      })
    );

    // Clean up the temp file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Failed to upload PDF to R2:", error);
    throw new Error("R2 upload failed");
  }
}

export async function mergePdfsFromR2(
  objects: R2Object[],
  outputBucket: string,
  type: string
): Promise<string> {
  try {
    // Create temp directory
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Download and merge PDFs
    const mergedPdf = await PDFDocument.create();
    for (const obj of objects) {
      // Get presigned URL
      const getCommand = new GetObjectCommand({
        Bucket: obj.Bucket,
        Key: obj.Key,
      });
      const url = await getSignedUrl(S3, getCommand, { expiresIn: 3600 });

      // Download PDF
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Copy pages
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(tempDir, `merged-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, mergedPdfBytes);

    // Upload to R2
    const outputKey = `merged/${type}/${Date.now()}.pdf`;
    await S3.send(
      new PutObjectCommand({
        Bucket: outputBucket,
        Key: outputKey,
        Body: mergedPdfBytes,
        ContentType: "application/pdf",
      })
    );

    fs.unlinkSync(outputPath);

    return outputKey;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw new Error("Failed to merge PDFs");
  }
}
