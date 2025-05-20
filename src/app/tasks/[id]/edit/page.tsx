import { Navigation } from "@/components/Navigation";
import { TaskForm } from "@/components/tasks/TaskForm";

export const metadata = {
  title: "タスク編集 | LifeOps",
  description: "タスクの詳細を編集します",
};

export default function EditTaskPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">タスク編集</h1>
          <p className="mt-2 text-gray-600">タスクの詳細を編集してください。</p>
        </div>
        <TaskForm taskId={params.id} />
      </main>
    </div>
  );
}
