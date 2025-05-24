"use client";

import dynamic from "next/dynamic";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { PageLayout } from "@/components/layouts/PageLayout";

function SettingsPageComponent() {
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

export default dynamic(() => Promise.resolve(SettingsPageComponent), {
  ssr: false,
});
