"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Milestone } from "@/types/milestone";

interface MilestoneFormProps {
  milestoneId?: string;
}

export function MilestoneForm({ milestoneId }: MilestoneFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [milestone, setMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    target_date: new Date().toISOString().split("T")[0],
    status: "not_started",
    priority: "medium",
  });

  useEffect(() => {
    if (milestoneId) {
      fetchMilestone();
    }
  }, [milestoneId]);

  const fetchMilestone = async () => {
    try {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("id", milestoneId)
        .single();

      if (error) throw error;
      if (data) {
        setMilestone({
          ...data,
          target_date: new Date(data.target_date).toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Error fetching milestone:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (milestoneId) {
        const { error } = await supabase
          .from("milestones")
          .update(milestone)
          .eq("id", milestoneId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("milestones").insert([milestone]);
        if (error) throw error;
      }

      router.push("/milestones");
      router.refresh();
    } catch (error) {
      console.error("Error saving milestone:", error);
      alert("マイルストーンの保存に失敗しました。");
    } finally {
      setLoading(false);
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
          value={milestone.title}
          onChange={(e) =>
            setMilestone({ ...milestone, title: e.target.value })
          }
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
          value={milestone.description}
          onChange={(e) =>
            setMilestone({ ...milestone, description: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="target_date"
          className="block text-sm font-medium text-gray-700"
        >
          目標日
        </label>
        <input
          type="date"
          id="target_date"
          value={milestone.target_date}
          onChange={(e) =>
            setMilestone({ ...milestone, target_date: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            ステータス
          </label>
          <select
            id="status"
            value={milestone.status}
            onChange={(e) =>
              setMilestone({
                ...milestone,
                status: e.target.value as Milestone["status"],
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
          >
            <option value="not_started">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            優先度
          </label>
          <select
            id="priority"
            value={milestone.priority}
            onChange={(e) =>
              setMilestone({
                ...milestone,
                priority: e.target.value as Milestone["priority"],
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
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
