import { Navigation } from "@/components/Navigation";
import { TaskForm } from "@/components/tasks/TaskForm";

export const metadata = {
  title: "新規タスク作成 | LifeOps",
  description: "新しいタスクを作成します",
};

export default function NewTaskPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規タスク作成</h1>
          <p className="mt-2 text-gray-600">
            新しいタスクの詳細を入力してください。
          </p>
        </div>
        <TaskForm />
      </main>
    </div>
  );
}
