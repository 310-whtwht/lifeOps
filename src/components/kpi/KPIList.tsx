"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KPI } from "@/types/kpi";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const periodLabels: Record<KPI["period"], string> = {
  daily: "日次",
  weekly: "週次",
  monthly: "月次",
  yearly: "年次",
};

export function KPIList() {
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from("kpis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKPIs(data || []);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このKPIを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("kpis")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchKPIs();
    } catch (error) {
      console.error("Error deleting KPI:", error);
      alert("KPIの削除に失敗しました。");
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">KPI一覧</h2>
          <Link
            href="/kpi/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規KPI
          </Link>
        </div>

        {kpis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">KPIがありません</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="bg-white border rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {kpi.title}
                    </h3>
                    <p className="text-sm text-gray-500">{kpi.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/kpi/${kpi.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(kpi.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      {kpi.current_value} / {kpi.target_value} {kpi.unit}
                    </span>
                    <span>{periodLabels[kpi.period]}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          kpi.current_value,
                          kpi.target_value
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  進捗率:{" "}
                  {calculateProgress(kpi.current_value, kpi.target_value)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
