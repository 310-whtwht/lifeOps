import { TodoList } from "@/components/dashboard/TodoList";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "タスク | LifeOps",
  description: "タスクの管理",
};

export default function TasksPage() {
  return (
    <PageLayout title="タスク" description="タスクの管理と進捗を確認しましょう">
      <TodoList />
    </PageLayout>
  );
}
