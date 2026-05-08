import DocumentManager from "../../components/DocumentManager";
import { getActiveCarData } from "../../../lib/get-active-car";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { getSignedUrl } from "../../../lib/supabase";

export default async function DocumentsPage() {
  const data = await getActiveCarData();
  const session = await auth();

  if (!data?.activeCarId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Selecciona un vehículo para gestionar sus documentos.</p>
      </div>
    );
  }

  const rawDocuments = await prisma.carDocument.findMany({
    where: { userCarId: data.activeCarId },
    orderBy: { createdAt: "desc" }
  });

  // Procesamos los documentos para generar Signed URLs
  const documents = await Promise.all(rawDocuments.map(async (doc) => {
    let urls: string[] = [];
    try {
      const paths = JSON.parse(doc.imageUrl || "[]");
      if (Array.isArray(paths)) {
        const signedUrls = await Promise.all(paths.map(path => getSignedUrl(path)));
        urls = signedUrls.filter((url): url is string => url !== null);
      } else if (typeof paths === 'string' && paths.startsWith('data:image')) {
        // Fallback para datos antiguos en Base64 (migración incremental)
        urls = [paths];
      }
    } catch (e) {
      // Fallback por si no es JSON válido
      if (doc.imageUrl?.startsWith('data:image')) {
        urls = [doc.imageUrl];
      }
    }

    return {
      ...doc,
      displayUrls: urls.filter(Boolean) as string[]
    };
  }));

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    select: { plan: true }
  });

  return (
    <div className="p-8">
      <DocumentManager 
        documents={documents as any} 
        activeCarId={data.activeCarId} 
        userPlan={user?.plan || "STANDARD"}
      />
    </div>
  );
}
