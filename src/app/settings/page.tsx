import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { PageLayout } from "@/components/layouts/PageLayout";

export const metadata = {
  title: "設定 | LifeOps",
  description: "アプリケーションの設定",
};

export default function SettingsPage() {
  return (
    <PageLayout title="設定" description="アプリケーションの設定を管理します">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <AppearanceSettings />
        </div>
      </div>
    </PageLayout>
  );
}
