"use client";

import { TaskForm } from "@/components/tasks/TaskForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function EditTaskPage({ params }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [task, setTask] = useState(null);
  const supabase = createClientComponentClient();

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", params.id)
      .single();
    setTask(data);
  }, [params.id, supabase]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
