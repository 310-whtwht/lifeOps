"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KPI } from "@/types/kpi";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

const periodLabels: Record<KPI["period"], string> = {
  daily: "日次",
  weekly: "週次",
  monthly: "月次",
  yearly: "年次",
};

interface KpiDetailProps {
  kpiId: string;
}

export function KpiDetail({ kpiId }: KpiDetailProps) {
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchKpi();
  }, [kpiId]);

  const fetchKpi = async () => {
    try {
      const { data, error } = await supabase
        .from("kpis")
        .select("*")
        .eq("id", kpiId)
        .single();

      if (error) throw error;
      setKpi(data);
    } catch (error) {
      console.error("Error fetching KPI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このKPIを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("kpis")
        .delete()
        .eq("id", kpiId);
      if (error) throw error;
      router.push("/kpi");
    } catch (error) {
      console.error("Error deleting KPI:", error);
      alert("KPIの削除に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!kpi) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">KPIが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {kpi.title}
              </h3>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {periodLabels[kpi.period]}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(kpi.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap mb-4">
              {kpi.description}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">目標値</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {kpi.target_value} {kpi.unit}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">現在値</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {kpi.current_value} {kpi.unit}
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              href={`/kpi/${kpi.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
              title="編集"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900"
              title="削除"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
