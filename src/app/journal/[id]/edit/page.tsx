import { JournalForm } from "@/components/journal/JournalForm";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "ジャーナル編集 | LifeOps",
  description: "ジャーナルの詳細を編集します",
};

export default function EditJournalPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <PageLayout
      title="ジャーナル編集"
      description="ジャーナルの詳細を編集します"
    >
      <JournalForm journalId={params.id} />
    </PageLayout>
  );
}
