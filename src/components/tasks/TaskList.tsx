"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Task } from "@/types/task";
import Link from "next/link";
import { TagList } from "@/components/tags/TagList";
import { TagSelector } from "@/components/tags/TagSelector";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTasks();
  }, [selectedTags]);

  const fetchTasks = async () => {
    try {
      let query = supabase
        .from("tasks")
        .select(
          `
          *,
          task_tags (
            tag_id
          )
        `
        )
        .order("created_at", { ascending: false });

      if (selectedTags.length > 0) {
        query = query.contains("task_tags.tag_id", selectedTags);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) {
        setTasks(
          data.map((task) => ({
            ...task,
            tags: task.task_tags.map((tt: { tag_id: string }) => tt.tag_id),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          タグで絞り込み
        </h2>
        <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
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
                  {task.due_date && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">期限</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {new Date(task.due_date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        タグ
                      </p>
                      <TagList tagIds={task.tags} />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
