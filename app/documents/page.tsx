import DocumentManager from "../components/DocumentManager";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

export default async function DocumentsPage() {
  const data = await getActiveCarData();
  const session = await auth();

  if (!data?.activeCarId) {
    return (
      <ResponsiveLayout cars={[]} activeCarId={null} catalogCars={data?.catalogCars || []} userEmail={session?.user?.email || "Usuario"}>
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">Selecciona un vehículo para gestionar sus documentos.</p>
        </div>
      </ResponsiveLayout>
    );
  }

  const documents = await prisma.carDocument.findMany({
    where: { userCarId: data.activeCarId },
    orderBy: { createdAt: "desc" }
  });

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    select: { plan: true }
  });

  return (
    <ResponsiveLayout 
      cars={data?.cars || []} 
      activeCarId={data?.activeCarId} 
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <div className="p-8">
        <DocumentManager 
          documents={documents as any} 
          activeCarId={data.activeCarId} 
          userPlan={user?.plan || "STANDARD"}
        />
      </div>
    </ResponsiveLayout>
  );
}
