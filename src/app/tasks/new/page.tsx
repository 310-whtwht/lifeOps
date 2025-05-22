"use client";

import { Navigation } from "@/components/Navigation";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useState } from "react";

export default function NewTaskPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規タスク作成</h1>
          <p className="mt-2 text-gray-600">
            新しいタスクの詳細を入力してください。
          </p>
        </div>
        <TaskForm
          task={null}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSave={() => {
            setIsOpen(false);
            window.location.href = "/tasks";
          }}
        />
      </main>
    </div>
  );
}
