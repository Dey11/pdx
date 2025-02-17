import DownloadBtn from "@/components/dashboard/download-btn";
import { H2 } from "@/components/typography/h2";
import { H3 } from "@/components/typography/h3";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const HistoryPage = async () => {
  const session = await auth();
  const materials = await prisma.material.findMany({
    where: {
      userId: session?.user!.id,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto min-h-[70dvh] max-w-[1400px] p-5">
      <section className="mt-10">
        <H2 className="text-brand-yellow">All Study Materials</H2>

        <div className="mt-5 flex flex-col gap-y-3 overflow-y-auto">
          {materials.length === 0 && <H3 className="">No materials found</H3>}
          {materials.map((material, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border bg-brand-bg p-5"
            >
              <div className="text-sm">
                <p className="line-clamp-2">{material.title}</p>
                <p className="text-xs text-muted-foreground">
                  {material.createdAt.toDateString()}
                </p>
              </div>
              <DownloadBtn materialId={material.id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
