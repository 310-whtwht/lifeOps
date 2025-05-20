import { JournalForm } from "@/components/journal/JournalForm";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "新規ジャーナル作成 | LifeOps",
  description: "新しいジャーナルを作成します",
};

export default function NewJournalPage() {
  return (
    <PageLayout
      title="新規ジャーナル作成"
      description="新しいジャーナルを作成します"
    >
      <JournalForm />
    </PageLayout>
  );
}
