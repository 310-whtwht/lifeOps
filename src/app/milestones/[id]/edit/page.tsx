import { Navigation } from "@/components/Navigation";
import { MilestoneForm } from "@/components/milestones/MilestoneForm";

export const metadata = {
  title: "マイルストーン編集 | LifeOps",
  description: "マイルストーンの詳細を編集します",
};

export default function EditMilestonePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            マイルストーン編集
          </h1>
          <p className="mt-2 text-gray-600">
            マイルストーンの詳細を編集してください。
          </p>
        </div>
        <MilestoneForm milestoneId={params.id} />
      </main>
    </div>
  );
}
