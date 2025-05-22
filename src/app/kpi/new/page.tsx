import { KPIForm } from "@/components/kpi/KPIForm";

export const metadata = {
  title: "新規KPI作成 | LifeOps",
  description: "新しいKPIを作成します",
};

export default function NewKPIPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規KPI作成</h1>
          <p className="mt-2 text-gray-600">
            新しいKPIの詳細を入力してください。
          </p>
        </div>
        <KPIForm />
      </main>
    </div>
  );
}
