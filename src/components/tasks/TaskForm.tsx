"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Task, TaskCategory, TaskPriority, TaskFrequency } from "@/types/task";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TaskFormProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const categories: TaskCategory[] = ["course", "habit", "operation", "other"];
const priorities: TaskPriority[] = ["high", "medium", "low"];
const frequencies: TaskFrequency[] = ["daily", "weekly", "once"];

const categoryLabels: Record<TaskCategory, string> = {
  course: "講座制作",
  habit: "習慣",
  operation: "運用",
  other: "その他",
};

const priorityLabels: Record<TaskPriority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const frequencyLabels: Record<TaskFrequency, string> = {
  daily: "毎日",
  weekly: "毎週",
  once: "一度限り",
};

export function TaskForm({ task, isOpen, onClose, onSave }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState<TaskCategory>(task?.category || "other");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [frequency, setFrequency] = useState<TaskFrequency>(task?.frequency || "once");
  const [estimatedHours, setEstimatedHours] = useState(task?.estimated_hours || 1);
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        category,
        priority,
        frequency,
        estimated_hours: estimatedHours,
        due_date: dueDate || null,
        updated_at: new Date().toISOString(),
      };

      if (task) {
        // 更新
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id);

        if (error) throw error;
      } else {
        // 新規作成
        const { error } = await supabase.from("tasks").insert({
          ...taskData,
          is_completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("タスクの保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {task ? "タスクを編集" : "新規タスク"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                カテゴリ
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
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
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {priorityLabels[pri]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700"
              >
                頻度
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {frequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {frequencyLabels[freq]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="estimatedHours"
                className="block text-sm font-medium text-gray-700"
              >
                所要時間（時間）
              </label>
              <input
                type="number"
                id="estimatedHours"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                min="0.5"
                step="0.5"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                期限
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
