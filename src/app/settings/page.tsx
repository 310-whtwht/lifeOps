import { SettingsForm } from "@/components/settings/SettingsForm";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "設定 | LifeOps",
  description: "アプリケーションの設定",
};

export default function SettingsPage() {
  return (
    <PageLayout title="設定" description="アプリケーションの設定を管理します">
      <SettingsForm />
    </PageLayout>
  );
}
