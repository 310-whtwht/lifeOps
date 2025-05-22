"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { KgiInfo, VpsInfo } from "@/types/meta";

interface MetaEditModalProps {
  type: "kgi" | "vps";
  initialData: KgiInfo | VpsInfo;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function MetaEditModal({
  type,
  initialData,
  isOpen,
  onClose,
  onSave,
}: MetaEditModalProps) {
  const [kgiData, setKgiData] = useState<KgiInfo>({
    target_income: 200,
    target_work_hours: 4,
    target_course_sales: 0,
    target_subscription: 0,
    updated_at: new Date().toISOString(),
  });
  const [vpsData, setVpsData] = useState<VpsInfo>({
    statement: "",
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (type === "kgi") {
      setKgiData(initialData as KgiInfo);
    } else {
      setVpsData(initialData as VpsInfo);
    }
  }, [type, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = type === "kgi" ? kgiData : vpsData;
      const { error } = await supabase.from("meta_info").upsert({
        key: type,
        value: JSON.stringify(data),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating meta info:", error);
      alert("更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {type === "kgi" ? "人生KGIの編集" : "VPSの編集"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === "kgi" ? (
            <>
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
                  value={kgiData.target_income}
                  onChange={(e) =>
                    setKgiData({
                      ...kgiData,
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
                  value={kgiData.target_work_hours}
                  onChange={(e) =>
                    setKgiData({
                      ...kgiData,
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
                  value={kgiData.target_course_sales}
                  onChange={(e) =>
                    setKgiData({
                      ...kgiData,
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
                  value={kgiData.target_subscription}
                  onChange={(e) =>
                    setKgiData({
                      ...kgiData,
                      target_subscription: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="statement"
                className="block text-sm font-medium text-gray-700"
              >
                バリューポジションステートメント
              </label>
              <textarea
                id="statement"
                value={vpsData.statement}
                onChange={(e) =>
                  setVpsData({ ...vpsData, statement: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          )}

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
