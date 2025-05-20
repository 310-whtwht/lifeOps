import { KPIList } from "@/components/kpi/KPIList";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "KPI | LifeOps",
  description: "KPIの管理と分析",
};

export default function KPIPage() {
  return (
    <PageLayout title="KPI" description="KPIの管理と分析を行いましょう">
      <KPIList />
    </PageLayout>
  );
}
