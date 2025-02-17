import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GeneratingMessage({
  generatingMaterialId,
}: {
  generatingMaterialId: string;
}) {
  const [progress, setProgress] = useState({ completed: 0, total: 1 });
  const [isComplete, setIsComplete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollProgress = async () => {
      try {
        const response = await fetch(
          `/api/theory/progress/${generatingMaterialId}`
        );
        const data = await response.json();
        setProgress({ completed: data.completedParts, total: data.totalParts });

        if (data.completedParts >= data.totalParts) {
          setIsComplete(true);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    interval = setInterval(pollProgress, 5000);
    // Initial poll
    pollProgress();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [generatingMaterialId]);

  const progressPercentage = Math.round(
    (progress.completed / progress.total) * 100
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const response = await fetch(
        `/api/theory/download/${generatingMaterialId}`
      );
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
    <div className="h-[60dvh]">
      <Card className="mx-auto max-w-[870px] space-y-4 p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-2xl font-semibold">
            Generating your study material
          </div>
          <div className="text-muted-foreground">
            This usually takes anywhere between 1-5 minutes...
          </div>

          <div className="w-full max-w-[600px] space-y-2">
            <Progress
              value={progressPercentage}
              className="h-2 bg-brand-bg"
              indicatorClassName="bg-brand-green"
            />
            <div className="text-sm text-muted-foreground">
              {progressPercentage}% complete
            </div>
          </div>

          {isComplete && (
            <div>
              <Button
                variant={"glowy"}
                className="mt-4 bg-brand-yellow text-brand-bg hover:bg-brand-yellow/90"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download your material"}
              </Button>
              {downloadError && (
                <div className="text-sm text-red-500">{downloadError}</div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
