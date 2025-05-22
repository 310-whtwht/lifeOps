"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Milestone } from "@/types/milestone";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const statusLabels: Record<Milestone["status"], string> = {
  not_started: "未開始",
  in_progress: "進行中",
  completed: "完了",
};

export function MilestoneList() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このマイルストーンを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      alert("マイルストーンの削除に失敗しました。");
    }
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
          <h2 className="text-xl font-semibold text-gray-900">
            マイルストーン一覧
          </h2>
          <Link
            href="/milestones/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規マイルストーン
          </Link>
        </div>

        {milestones.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">マイルストーンがありません</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white border rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {milestone.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/milestones/${milestone.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(milestone.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{statusLabels[milestone.status]}</span>
                    <span>
                      {new Date(milestone.target_date).toLocaleDateString(
                        "ja-JP",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${milestone.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  進捗率: {milestone.progress}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
