"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

interface HabitPlan {
  id: string;
  day_of_week: number;
  activities: string;
  hours: number;
}

const DAYS_OF_WEEK = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function WeeklyPlanPageComponent() {
  const [habitPlans, setHabitPlans] = useState<HabitPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<HabitPlan | null>(null);

  useEffect(() => {
    fetchHabitPlans();
  }, []);

  const fetchHabitPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("habit_plans")
        .select("*")
        .order("day_of_week");

      if (error) throw error;

      setHabitPlans(data || []);
    } catch (error) {
      console.error("Error fetching habit plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (plan: HabitPlan) => {
    try {
      const { error } = await supabase
        .from("habit_plans")
        .upsert({
          ...plan,
          id: plan.id || undefined,
        });

      if (error) throw error;

      await fetchHabitPlans();
      setEditingPlan(null);
    } catch (error) {
      console.error("Error saving habit plan:", error);
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">習慣リソースプランナー</h1>
          <p className="text-gray-600 mb-6">
            毎週の習慣的な時間配分を管理します。
            <br />
            曜日ごとに予定と時間を設定してください。
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    曜日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    予定
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間配分
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DAYS_OF_WEEK.map((day, index) => {
                  const plan = habitPlans.find((p) => p.day_of_week === index);
                  const isEditing = editingPlan?.day_of_week === index;

                  return (
                    <tr key={day}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editingPlan.activities}
                            onChange={(e) =>
                              setEditingPlan({
                                ...editingPlan,
                                activities: e.target.value,
                              })
                            }
                          />
                        ) : (
                          plan?.activities || "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="24"
                            className="w-20 px-2 py-1 border rounded"
                            value={editingPlan.hours}
                            onChange={(e) =>
                              setEditingPlan({
                                ...editingPlan,
                                hours: Number(e.target.value),
                              })
                            }
                          />
                        ) : (
                          plan?.hours ? `${plan.hours}時間` : "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleSavePlan(editingPlan)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingPlan(null)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setEditingPlan(
                                plan || {
                                  id: "",
                                  day_of_week: index,
                                  activities: "",
                                  hours: 0,
                                }
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            編集
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(WeeklyPlanPageComponent), {
  ssr: false,
});
