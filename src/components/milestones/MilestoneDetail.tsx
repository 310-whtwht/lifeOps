"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Milestone } from "@/types/milestone";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface MilestoneDetailProps {
  milestoneId: string;
}

export function MilestoneDetail({ milestoneId }: MilestoneDetailProps) {
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchMilestone();
  }, [milestoneId]);

  const fetchMilestone = async () => {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("id", milestoneId)
        .single();

      if (error) throw error;
      setMilestone(data);
    } catch (error) {
      console.error("Error fetching milestone:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このマイルストーンを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", milestoneId);
      if (error) throw error;
      router.push("/milestones");
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

  if (!milestone) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">マイルストーンが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {milestone.title}
              </h3>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {milestone.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(milestone.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap mb-4">
              {milestone.description}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">目標日</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {new Date(milestone.target_date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">進捗</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {milestone.progress}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              href={`/milestones/${milestone.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
              title="編集"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900"
              title="削除"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
