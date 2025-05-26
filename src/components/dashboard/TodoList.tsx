"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  due_date?: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // 今日の日付
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 7日後の日付
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  oneWeekLater.setHours(23, 59, 59, 999);

  // 1週間以内のタスクと期限切れのタスクをフィルタ
  const todosThisWeek = todos.filter((todo) => {
    if (!todo.due_date) return false;
    const due = new Date(todo.due_date);
    due.setHours(0, 0, 0, 0);
    // due_dateが1週間後以前（期限切れも含む）
    return due <= oneWeekLater;
  });

  // 期限切れかどうかを判定する関数
  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        今週の注力タスク
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          {todosThisWeek.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="flex flex-col">
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : todo.due_date && isOverdue(todo.due_date)
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.title}
                  </span>
                  {todo.due_date && (
                    <span
                      className={`text-xs ${
                        isOverdue(todo.due_date)
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      期限: {formatDate(todo.due_date)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
