import { Navigation } from "@/components/Navigation";
import { KPIForm } from "@/components/kpi/KPIForm";

export const metadata = {
  title: "KPI編集 | LifeOps",
  description: "KPIの詳細を編集します",
};

export default function EditKPIPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KPI編集</h1>
          <p className="mt-2 text-gray-600">KPIの詳細を編集してください。</p>
        </div>
        <KPIForm kpiId={params.id} />
      </main>
    </div>
  );
}
