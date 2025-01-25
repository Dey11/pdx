import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

import DownloadBtn from "./download-btn";

const RecentMaterials = async () => {
  const session = await auth();
  const materials = await prisma.material.findMany({
    where: {
      userId: session?.user!.id,
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="mt-5 flex flex-col gap-y-3">
      {materials.map((material, index) => {
        return (
          <div className="flex items-center justify-between gap-1" key={index}>
            <div className="text-sm">
              <p className="line-clamp-2">{material.title}</p>
              <p className="text-xs text-muted-foreground">
                {material.createdAt.toDateString()}
              </p>
            </div>
            <DownloadBtn materialId={material.id} />
          </div>
        );
      })}
    </div>
  );
};

export default RecentMaterials;
