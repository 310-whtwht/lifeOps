"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KpiRecord, KpiMilestone } from "@/types/meta";
import { PencilIcon } from "@heroicons/react/24/outline";
import { KpiEditModal } from "./KpiEditModal";

interface KpiItem {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
}

export function KpiProgress() {
  const [kpiItems, setKpiItems] = useState<KpiItem[]>([
    {
      id: "1",
      name: "可処分所得",
      target: 900000,
      current: 0,
      unit: "円/月",
    },
    {
      id: "2",
      name: "講座販売数",
      target: 20,
      current: 0,
      unit: "本/月",
    },
    {
      id: "3",
      name: "プレミアム講座販売数",
      target: 3,
      current: 0,
      unit: "本/月",
    },
    {
      id: "4",
      name: "サブスク会員数",
      target: 50,
      current: 0,
      unit: "人",
    },
    {
      id: "5",
      name: "制作中講座",
      target: 1,
      current: 0,
      unit: "本",
    },
    {
      id: "6",
      name: "新作公開",
      target: 1,
      current: 0,
      unit: "本/月",
    },
    {
      id: "7",
      name: "週稼働時間",
      target: 16,
      current: 0,
      unit: "時間",
    },
  ]);

  const [currentRecord, setCurrentRecord] = useState<KpiRecord | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<KpiMilestone | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchKpiData();
    fetchKpiProgress();
  }, []);

  const fetchKpiData = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const quarter = Math.floor((month - 1) / 3) + 1;

      // 今月のKPI実績を取得
      const { data: recordData, error: recordError } = await supabase
        .from("kpi_records")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .single();

      // 今四半期のマイルストーンを取得
      const { data: milestoneData, error: milestoneError } = await supabase
        .from("kpi_milestones")
        .select("*")
        .eq("year", year)
        .eq("quarter", quarter)
        .single();

      if (recordError && recordError.code !== "PGRST116") throw recordError;
      if (milestoneError && milestoneError.code !== "PGRST116")
        throw milestoneError;

      setCurrentRecord(recordData);
      setCurrentMilestone(milestoneData);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKpiProgress = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const { data, error } = await supabase
        .from("kpi_records")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        const updatedItems = kpiItems.map((item) => {
          let current = 0;
          switch (item.id) {
            case "1":
              current = data.income || 0;
              break;
            case "2":
              current = data.course_sales || 0;
              break;
            case "3":
              current = data.premium_course_sales || 0;
              break;
            case "4":
              current = data.subscription_count || 0;
              break;
            case "5":
              current = data.courses_in_progress || 0;
              break;
            case "6":
              current = data.new_releases || 0;
              break;
            case "7":
              current = data.work_hours || 0;
              break;
          }
          return { ...item, current };
        });
        setKpiItems(updatedItems);
      }
    } catch (error) {
      console.error("Error fetching KPI progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">今月のKPI進捗</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-gray-400 hover:text-gray-500"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {kpiItems.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
                <span className="text-sm text-gray-500">
                  {item.current} / {item.target} {item.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      (item.current / item.target) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <KpiEditModal
        record={currentRecord}
        milestone={currentMilestone}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={fetchKpiData}
      />
    </>
  );
}
