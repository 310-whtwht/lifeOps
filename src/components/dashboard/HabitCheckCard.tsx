"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";

type HabitCheckCardProps = {
  title: string;
  habitKey: "english_study" | "exercise";
};

export function HabitCheckCard({ title, habitKey }: HabitCheckCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const fetchHabitCheck = async () => {
      const { data, error } = await supabase
        .from("habit_checks")
        .select("*")
        .eq("date", today)
        .single();

      if (!error && data) {
        setIsChecked(data[habitKey]);
      }
    };

    fetchHabitCheck();
  }, [today, habitKey]);

  const handleCheck = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    const { error } = await supabase.from("habit_checks").upsert({
      date: today,
      [habitKey]: newValue,
    });

    if (error) {
      setIsChecked(!newValue); // エラー時は元の状態に戻す
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheck}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
