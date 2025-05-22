import { Navigation } from "@/components/shared/Navigation";
import { KpiDetail } from "@/components/kpi/KpiDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ViewKpiPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">KPI詳細</h1>
        <div className="mt-8 max-w-3xl">
          <KpiDetail kpiId={resolvedParams.id} />
        </div>
      </div>
    </div>
  );
}
