import { JournalList } from "@/components/journal/JournalList";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "ジャーナル | LifeOps",
  description: "日々の振り返りと記録",
};

export default function JournalPage() {
  return (
    <PageLayout
      title="ジャーナル"
      description="日々の振り返りと記録を残しましょう"
    >
      <JournalList />
    </PageLayout>
  );
}
