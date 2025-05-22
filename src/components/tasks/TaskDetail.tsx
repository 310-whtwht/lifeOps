"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Task } from "@/types/task";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TagList } from "@/components/tags/TagList";

interface TaskDetailProps {
  taskId: string;
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          task_tags (
            tag_id
          )
        `
        )
        .eq("id", taskId)
        .single();

      if (error) throw error;
      if (data) {
        setTask({
          ...data,
          tags: data.task_tags.map((tt: { tag_id: string }) => tt.tag_id),
        });
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このタスクを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);
      if (error) throw error;
      router.push("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("タスクの削除に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">タスクが見つかりません</p>
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
                {task.title}
              </h3>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {task.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(task.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap mb-4">
              {task.description}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">期限</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "未設定"}
              </p>
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">タグ</p>
                <TagList tagIds={task.tags} />
              </div>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              href={`/tasks/${task.id}/edit`}
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
