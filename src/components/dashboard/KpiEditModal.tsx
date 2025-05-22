"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { KpiRecord, KpiMilestone } from "@/types/meta";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface KpiEditModalProps {
  record: KpiRecord | null;
  milestone: KpiMilestone | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function KpiEditModal({
  record,
  milestone,
  isOpen,
  onClose,
  onSave,
}: KpiEditModalProps) {
  const [recordData, setRecordData] = useState<KpiRecord>({
    id: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    income: 0,
    work_hours: 0,
    course_sales: 0,
    subscription: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [milestoneData, setMilestoneData] = useState<KpiMilestone>({
    id: "",
    quarter: Math.floor(new Date().getMonth() / 3) + 1,
    year: new Date().getFullYear(),
    target_income: 0,
    target_work_hours: 0,
    target_course_sales: 0,
    target_subscription: 0,
    notes: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (record) {
      setRecordData(record);
    }
    if (milestone) {
      setMilestoneData(milestone);
    }
  }, [record, milestone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // KPI実績の更新
      if (record) {
        const { error: recordError } = await supabase
          .from("kpi_records")
          .update({
            income: recordData.income,
            work_hours: recordData.work_hours,
            course_sales: recordData.course_sales,
            subscription: recordData.subscription,
            updated_at: new Date().toISOString(),
          })
          .eq("id", record.id);

        if (recordError) throw recordError;
      } else {
        const { error: recordError } = await supabase
          .from("kpi_records")
          .insert({
            year: recordData.year,
            month: recordData.month,
            income: recordData.income,
            work_hours: recordData.work_hours,
            course_sales: recordData.course_sales,
            subscription: recordData.subscription,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (recordError) throw recordError;
      }

      // マイルストーンの更新
      if (milestone) {
        const { error: milestoneError } = await supabase
          .from("kpi_milestones")
          .update({
            target_income: milestoneData.target_income,
            target_work_hours: milestoneData.target_work_hours,
            target_course_sales: milestoneData.target_course_sales,
            target_subscription: milestoneData.target_subscription,
            notes: milestoneData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", milestone.id);

        if (milestoneError) throw milestoneError;
      } else {
        const { error: milestoneError } = await supabase
          .from("kpi_milestones")
          .insert({
            quarter: milestoneData.quarter,
            year: milestoneData.year,
            target_income: milestoneData.target_income,
            target_work_hours: milestoneData.target_work_hours,
            target_course_sales: milestoneData.target_course_sales,
            target_subscription: milestoneData.target_subscription,
            notes: milestoneData.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (milestoneError) throw milestoneError;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating KPI:", error);
      alert("KPIの更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">KPIの編集</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 実績セクション */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              今月の実績
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="income"
                  className="block text-sm font-medium text-gray-700"
                >
                  可処分所得（万円）
                </label>
                <input
                  type="number"
                  id="income"
                  value={recordData.income}
                  onChange={(e) =>
                    setRecordData({
                      ...recordData,
                      income: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="work_hours"
                  className="block text-sm font-medium text-gray-700"
                >
                  週間労働時間
                </label>
                <input
                  type="number"
                  id="work_hours"
                  value={recordData.work_hours}
                  onChange={(e) =>
                    setRecordData({
                      ...recordData,
                      work_hours: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="course_sales"
                  className="block text-sm font-medium text-gray-700"
                >
                  講座販売数
                </label>
                <input
                  type="number"
                  id="course_sales"
                  value={recordData.course_sales}
                  onChange={(e) =>
                    setRecordData({
                      ...recordData,
                      course_sales: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subscription"
                  className="block text-sm font-medium text-gray-700"
                >
                  サブスク数
                </label>
                <input
                  type="number"
                  id="subscription"
                  value={recordData.subscription}
                  onChange={(e) =>
                    setRecordData({
                      ...recordData,
                      subscription: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* マイルストーンセクション */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              四半期目標
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="target_income"
                  className="block text-sm font-medium text-gray-700"
                >
                  目標可処分所得（万円）
                </label>
                <input
                  type="number"
                  id="target_income"
                  value={milestoneData.target_income}
                  onChange={(e) =>
                    setMilestoneData({
                      ...milestoneData,
                      target_income: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="target_work_hours"
                  className="block text-sm font-medium text-gray-700"
                >
                  目標週間労働時間
                </label>
                <input
                  type="number"
                  id="target_work_hours"
                  value={milestoneData.target_work_hours}
                  onChange={(e) =>
                    setMilestoneData({
                      ...milestoneData,
                      target_work_hours: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="target_course_sales"
                  className="block text-sm font-medium text-gray-700"
                >
                  目標講座販売数
                </label>
                <input
                  type="number"
                  id="target_course_sales"
                  value={milestoneData.target_course_sales}
                  onChange={(e) =>
                    setMilestoneData({
                      ...milestoneData,
                      target_course_sales: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="target_subscription"
                  className="block text-sm font-medium text-gray-700"
                >
                  目標サブスク数
                </label>
                <input
                  type="number"
                  id="target_subscription"
                  value={milestoneData.target_subscription}
                  onChange={(e) =>
                    setMilestoneData({
                      ...milestoneData,
                      target_subscription: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                備考
              </label>
              <textarea
                id="notes"
                value={milestoneData.notes}
                onChange={(e) =>
                  setMilestoneData({
                    ...milestoneData,
                    notes: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
