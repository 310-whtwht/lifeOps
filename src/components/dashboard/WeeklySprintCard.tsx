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

function WeeklySprintCardComponent() {
  const [habitPlans, setHabitPlans] = useState<HabitPlan[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalHours = habitPlans.reduce((sum, plan) => sum + plan.hours, 0);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">習慣リソースプランナー</h2>
        <a
          href="/weekly-plan"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          編集
        </a>
      </div>

      {habitPlans.length > 0 ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              週間合計時間: {totalHours}時間
            </p>
          </div>

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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DAYS_OF_WEEK.map((day, index) => {
                  const plan = habitPlans.find((p) => p.day_of_week === index);
                  return (
                    <tr key={day}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan?.activities || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {plan?.hours ? `${plan.hours}時間` : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          習慣プランが設定されていません。
          <br />
          「編集」ボタンをクリックして設定してください。
        </div>
      )}
    </div>
  );
}

export const WeeklySprintCard = dynamic(() => Promise.resolve(WeeklySprintCardComponent), {
  ssr: false,
});
