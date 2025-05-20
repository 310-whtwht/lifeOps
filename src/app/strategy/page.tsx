import { StrategyDocument } from "@/components/strategy/StrategyDocument";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "戦略ドキュメント | LifeOps",
  description: "戦略の振り返りと計画",
};

export default function StrategyPage() {
  return (
    <PageLayout
      title="戦略ドキュメント"
      description="戦略の振り返りと計画を管理します"
    >
      <StrategyDocument />
    </PageLayout>
  );
}
