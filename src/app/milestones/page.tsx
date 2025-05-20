import { MilestoneList } from "@/components/milestones/MilestoneList";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "マイルストーン | LifeOps",
  description: "マイルストーンの管理",
};

export default function MilestonesPage() {
  return (
    <PageLayout
      title="マイルストーン"
      description="マイルストーンの管理と進捗を確認しましょう"
    >
      <MilestoneList />
    </PageLayout>
  );
}
