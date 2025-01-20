import { Card } from "@/components/ui/card";

export function GeneratingMessage() {
  return (
    <div className="h-[60dvh]">
      <Card className="mx-auto max-w-[870px] space-y-4 p-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-2xl font-semibold">
            Generating your study material
          </div>
          <div className="text-muted-foreground">
            This usually takes anywhere between 5-10 minutes...
          </div>

          <div>Updates will appear here</div>
        </div>
      </Card>
    </div>
  );
}
