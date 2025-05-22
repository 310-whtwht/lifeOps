"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CheckIcon } from "@heroicons/react/24/outline";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export function HabitCheck() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "英語学習（30分）", completed: false },
    { id: "2", name: "筋トレ／身体づくり（30分）", completed: false },
  ]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("habit_checks")
        .select("english_study, exercise")
        .eq("date", today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const updatedHabits = habits.map((habit) => ({
          ...habit,
          completed: habit.id === "1" ? data.english_study : data.exercise,
        }));
        setHabits(updatedHabits);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const newValue = !habit.completed;
      const habitKey = habitId === "1" ? "english_study" : "exercise";

      // 既存のチェックを取得
      const { data: existingCheck } = await supabase
        .from("habit_checks")
        .select("id")
        .eq("date", today)
        .maybeSingle();

      if (existingCheck) {
        // 既存のチェックを更新
        const { error } = await supabase
          .from("habit_checks")
          .update({
            [habitKey]: newValue,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingCheck.id);

        if (error) throw error;
      } else {
        // 新しいチェックを作成
        const { error } = await supabase.from("habit_checks").insert({
          date: today,
          english_study: habitId === "1" ? newValue : false,
          exercise: habitId === "2" ? newValue : false,
        });

        if (error) throw error;
      }

      setHabits(
        habits.map((h) =>
          h.id === habitId ? { ...h, completed: newValue } : h
        )
      );
    } catch (error) {
      console.error("Error toggling habit:", error);
      alert("習慣チェックの更新に失敗しました。");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">習慣トラッカー</h2>
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-gray-700">{habit.name}</span>
            <button
              onClick={() => toggleHabit(habit.id)}
              className={`p-2 rounded-full ${
                habit.completed
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
