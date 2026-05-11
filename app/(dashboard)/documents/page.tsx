import DocumentManager from "../../components/DocumentManager";
import { getActiveCarData } from "../../../lib/get-active-car";
import { createClient } from "../../../lib/supabase/server";
import { getSignedUrl } from "../../../lib/supabase";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser) {
    redirect("/login");
  }

  const data = await getActiveCarData();

  if (!data?.activeCarId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Selecciona un vehículo para gestionar sus documentos.</p>
      </div>
    );
  }

  // Consulta directa a Supabase en lugar de Prisma
  const { data: rawDocuments, error: docsError } = await supabase
    .from('CarDocument')
    .select('*')
    .eq('userCarId', data.activeCarId)
    .order('createdAt', { ascending: false });

  if (docsError) {
    console.error("Error cargando documentos:", docsError);
  }

  // Procesamos los documentos para generar Signed URLs
  const documents = await Promise.all((rawDocuments || []).map(async (doc) => {
    let urls: string[] = [];
    try {
      const paths = JSON.parse(doc.imageUrl || "[]");
      if (Array.isArray(paths)) {
        const results = await Promise.all(paths.map(path => getSignedUrl(path)));
        const validUrls: string[] = [];
        results.forEach(r => {
          if (typeof r === 'string') validUrls.push(r);
        });
        urls = validUrls;
      } else if (typeof paths === 'string' && paths.startsWith('data:image')) {
        urls = [paths];
      }
    } catch (e) {
      if (doc.imageUrl?.startsWith('data:image')) {
        urls = [doc.imageUrl];
      }
    }

    return {
      ...doc,
      displayUrls: urls.filter(Boolean) as string[]
    };
  }));

  return (
    <div className="p-8">
      <DocumentManager 
        documents={documents as any} 
        activeCarId={data.activeCarId} 
        userPlan={data.user?.plan || "STANDARD"}
      />
    </div>
  );
}
