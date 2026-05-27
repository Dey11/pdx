import { PDFDocument } from "pdf-lib";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import { S3 } from "../object-storage";

interface R2Object {
  Key: string;
  Bucket: string;
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

    // Generate presigned URL for merged PDF
    const getCommand = new GetObjectCommand({
      Bucket: outputBucket,
      Key: outputKey,
    });
    const mergedUrl = await getSignedUrl(S3, getCommand, { expiresIn: 3600 });

    // Clean up temp files
    fs.unlinkSync(outputPath);

    return mergedUrl;
  } catch (error) {
    console.error("Error merging PDFs:", error);
    throw new Error("Failed to merge PDFs");
  }
}
