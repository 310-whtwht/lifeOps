"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { ja } from "date-fns/locale";

interface DailyPlan {
  date: string;
  activities: string;
  hours: number;
}

interface WeeklySprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    week_start_date: string;
    week_end_date: string;
    total_hours: number;
    daily_plans: DailyPlan[];
  }) => void;
}

export function WeeklySprintModal({
  isOpen,
  onClose,
  onSubmit,
}: WeeklySprintModalProps) {
  const [totalHours, setTotalHours] = useState(16);
  const [weekDates, setWeekDates] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);

  useEffect(() => {
    const today = new Date();
    const start = startOfWeek(today, { locale: ja });
    const end = endOfWeek(today, { locale: ja });
    setWeekDates({ start, end });

    // 初期の日次計画を作成
    const plans: DailyPlan[] = [];
    let currentDate = start;
    while (currentDate <= end) {
      plans.push({
        date: format(currentDate, "yyyy-MM-dd"),
        activities: "",
        hours: 0,
      });
      currentDate = addDays(currentDate, 1);
    }
    setDailyPlans(plans);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekDates) return;

    onSubmit({
      week_start_date: format(weekDates.start, "yyyy-MM-dd"),
      week_end_date: format(weekDates.end, "yyyy-MM-dd"),
      total_hours: totalHours,
      daily_plans: dailyPlans,
    });
  };

  const handleDailyPlanChange = (
    index: number,
    field: keyof DailyPlan,
    value: string | number
  ) => {
    const newPlans = [...dailyPlans];
    newPlans[index] = {
      ...newPlans[index],
      [field]: value,
    };
    setDailyPlans(newPlans);
  };

  if (!weekDates) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>週間スプリントの作成</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>期間</Label>
              <div className="text-sm">
                {format(weekDates.start, "yyyy年M月d日", { locale: ja })} -{" "}
                {format(weekDates.end, "yyyy年M月d日", { locale: ja })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-hours">週間目標時間（時間）</Label>
              <Input
                id="total-hours"
                type="number"
                min="1"
                max="168"
                value={totalHours}
                onChange={(e) => setTotalHours(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4">
              <Label>日次計画</Label>
              <div className="space-y-4">
                {dailyPlans.map((plan, index) => (
                  <div key={plan.date} className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">
                        {format(new Date(plan.date), "M月d日 (EEEE)", {
                          locale: ja,
                        })}
                      </Label>
                    </div>
                    <div>
                      <Input
                        placeholder="予定"
                        value={plan.activities}
                        onChange={(e) =>
                          handleDailyPlanChange(
                            index,
                            "activities",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min="0"
                        max="24"
                        placeholder="時間"
                        value={plan.hours}
                        onChange={(e) =>
                          handleDailyPlanChange(
                            index,
                            "hours",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">作成</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
