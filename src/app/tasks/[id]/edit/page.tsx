// src/app/tasks/[id]/edit/page.tsx

"use client";

import { TaskForm } from "@/components/tasks/TaskForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Task } from "@/types/task";

export default function EditTaskPage() {
  // 動的ルートのパラメータをフック経由で取得
  const params = useParams();
  const id = params?.id as string;

  const [isOpen, setIsOpen] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const supabase = createClientComponentClient();

  const fetchTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setTask(data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!task) {
    return <div>タスクを読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">タスク編集</h1>
        <div className="mt-8 max-w-3xl">
          <TaskForm
            task={task}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSave={() => {
              setIsOpen(false);
              window.location.href = "/tasks";
            }}
          />
        </div>
      </div>
    </div>
  );
}
