"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KPI } from "@/types/kpi";

interface KPIFormProps {
  kpiId?: string;
}

export function KPIForm({ kpiId }: KPIFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [kpi, setKPI] = useState<Partial<KPI>>({
    title: "",
    description: "",
    target_value: 0,
    current_value: 0,
    unit: "",
    period: "monthly",
  });

  useEffect(() => {
    if (kpiId) {
      fetchKPI();
    }
  }, [kpiId]);

  const fetchKPI = async () => {
    try {
      const { data, error } = await supabase
        .from("kpis")
        .select("*")
        .eq("id", kpiId)
        .single();

      if (error) throw error;
      if (data) setKPI(data);
    } catch (error) {
      console.error("Error fetching KPI:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (kpiId) {
        const { error } = await supabase
          .from("kpis")
          .update(kpi)
          .eq("id", kpiId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("kpis").insert([kpi]);
        if (error) throw error;
      }

      router.push("/kpi");
      router.refresh();
    } catch (error) {
      console.error("Error saving KPI:", error);
      alert("KPIの保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "target_value" | "current_value"
  ) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setKPI({ ...kpi, [field]: numValue });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={kpi.title}
          onChange={(e) => setKPI({ ...kpi, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <textarea
          id="description"
          value={kpi.description}
          onChange={(e) => setKPI({ ...kpi, description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="target_value"
            className="block text-sm font-medium text-gray-700"
          >
            目標値
          </label>
          <input
            type="number"
            id="target_value"
            value={kpi.target_value || ""}
            onChange={(e) => handleNumberChange(e, "target_value")}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="current_value"
            className="block text-sm font-medium text-gray-700"
          >
            現在値
          </label>
          <input
            type="number"
            id="current_value"
            value={kpi.current_value || ""}
            onChange={(e) => handleNumberChange(e, "current_value")}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700"
          >
            単位
          </label>
          <input
            type="text"
            id="unit"
            value={kpi.unit}
            onChange={(e) => setKPI({ ...kpi, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700"
          >
            期間
          </label>
          <select
            id="period"
            value={kpi.period}
            onChange={(e) =>
              setKPI({ ...kpi, period: e.target.value as KPI["period"] })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
          >
            <option value="daily">日次</option>
            <option value="weekly">週次</option>
            <option value="monthly">月次</option>
            <option value="yearly">年次</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
