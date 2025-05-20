"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PageLayout } from "@/components/layouts/PageLayout";
import { supabase } from "@/lib/supabase/client";

export function DashboardClient() {
  const [metaInfo, setMetaInfo] = useState({
    kgi: "週4h労働で可処分200万円・創作中心の人生",
    vps: "クリエイターのための効率的な収益化戦略",
  });

  useEffect(() => {
    const fetchMetaInfo = async () => {
      try {
        const { data, error } = await supabase.from("meta_info").select("*");

        if (error) throw error;
        if (data) {
          const info = data.reduce(
            (acc, item) => {
              acc[item.key] = item.value;
              return acc;
            },
            {} as Record<string, string>
          );

          setMetaInfo((prev) => ({ ...prev, ...info }));
        }
      } catch (error) {
        console.error("Error fetching meta info:", error);
      }
    };

    fetchMetaInfo();
  }, []);

  return (
    <PageLayout
      title="ダッシュボード"
      description="あなたの目標と進捗を確認しましょう"
    >
      <Dashboard metaInfo={metaInfo} />
    </PageLayout>
  );
}
