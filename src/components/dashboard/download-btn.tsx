"use client";

import { useState } from "react";

import { Button } from "../ui/button";

const DownloadBtn = ({ materialId }: { materialId: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const response = await fetch(`/api/generation/download/${materialId}`);
      if (!response.ok) throw new Error("Failed to get download URL");
      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadError("Failed to download material");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button className="" variant={"outline"} onClick={handleDownload}>
      Download
    </Button>
  );
};

export default DownloadBtn;
