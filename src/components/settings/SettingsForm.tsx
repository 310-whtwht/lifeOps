"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Settings {
  theme: "light" | "dark" | "system";
  language: "ja" | "en";
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    kpiUpdates: boolean;
  };
  profile: {
    name: string;
    email: string;
    timezone: string;
  };
}

export function SettingsForm() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    language: "ja",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      kpiUpdates: true,
    },
    profile: {
      name: "",
      email: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        settings,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      alert("設定を保存しました");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("設定の保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* プロフィール設定 */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">プロフィール</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              名前
            </label>
            <input
              type="text"
              id="name"
              value={settings.profile.name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, name: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="お名前を入力してください"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={settings.profile.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="メールアドレスを入力してください"
            />
          </div>
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700"
            >
              タイムゾーン
            </label>
            <input
              type="text"
              id="timezone"
              value={settings.profile.timezone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, timezone: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="タイムゾーンを入力してください（例：Asia/Tokyo）"
            />
          </div>
        </div>
      </div>

      {/* テーマ設定 */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">テーマ</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700"
            >
              テーマ
            </label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: e.target.value as Settings["theme"],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="system">システム設定に従う</option>
            </select>
          </div>
        </div>
      </div>

      {/* 言語設定 */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">言語</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              言語
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  language: e.target.value as Settings["language"],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* 通知設定 */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">通知設定</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email-notifications"
              checked={settings.notifications.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    email: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="email-notifications"
              className="ml-2 block text-sm text-gray-900"
            >
              メール通知
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push-notifications"
              checked={settings.notifications.push}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    push: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="push-notifications"
              className="ml-2 block text-sm text-gray-900"
            >
              プッシュ通知
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="task-reminders"
              checked={settings.notifications.taskReminders}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    taskReminders: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="task-reminders"
              className="ml-2 block text-sm text-gray-900"
            >
              タスクリマインダー
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="kpi-updates"
              checked={settings.notifications.kpiUpdates}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    kpiUpdates: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="kpi-updates"
              className="ml-2 block text-sm text-gray-900"
            >
              KPI更新通知
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "保存中..." : "設定を保存"}
        </button>
      </div>
    </form>
  );
}
