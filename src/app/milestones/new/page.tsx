import { MilestoneForm } from "@/components/milestones/MilestoneForm";

export const metadata = {
  title: "新規マイルストーン作成 | LifeOps",
  description: "新しいマイルストーンを作成します",
};

export default function NewMilestonePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            新規マイルストーン作成
          </h1>
          <p className="mt-2 text-gray-600">
            新しいマイルストーンの詳細を入力してください。
          </p>
        </div>
        <MilestoneForm />
      </main>
    </div>
  );
}
