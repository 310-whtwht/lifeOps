"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { PlusIcon } from "@heroicons/react/24/outline";

type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
};

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTodos(data);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title: newTodo.trim() }]);

    if (!error) {
      setNewTodo("");
      fetchTodos();
    }
  };

  const handleToggleTodo = async (id: string, is_completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_completed: !is_completed })
      .eq("id", id);

    if (!error) {
      fetchTodos();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいタスクを入力"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-sm text-gray-500">タスクがありません</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => handleToggleTodo(todo.id, todo.is_completed)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  className={`text-sm ${
                    todo.is_completed
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
