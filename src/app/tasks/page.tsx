"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Task,
  TaskCategory,
  TaskPriority,
  TaskFrequency,
  Todo,
} from "@/types/task";
import {
  PlusIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TodoForm } from "@/components/tasks/TodoForm";

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

const priorityColors: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const frequencyLabels: Record<TaskFrequency, string> = {
  daily: "毎日",
  weekly: "毎週",
  once: "一度限り",
};

type SortField = "due_date" | "priority" | "created_at";
type SortOrder = "asc" | "desc";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isBulkActionMode, setIsBulkActionMode] = useState(false);

  // フィルター状態
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | "all">(
    "all"
  );
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  );
  const [frequencyFilter, setFrequencyFilter] = useState<TaskFrequency | "all">(
    "all"
  );
  const [completionFilter, setCompletionFilter] = useState<
    "all" | "completed" | "incomplete"
  >("all");
  const [dueDateFilter, setDueDateFilter] = useState<
    "all" | "today" | "week" | "overdue"
  >("all");

  // ソート状態
  const [sortField, setSortField] = useState<SortField>("due_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTasks();
    fetchTodos();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleTodoComplete = async (todoId: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", todoId);

      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  const handleBulkComplete = async () => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .in("id", selectedTaskIds);

      if (error) throw error;
      await fetchTasks();
      setSelectedTaskIds([]);
      setIsBulkActionMode(false);
    } catch (error) {
      console.error("Error completing tasks:", error);
      alert("タスクの一括完了に失敗しました。");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm("選択したタスクを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .in("id", selectedTaskIds);

      if (error) throw error;
      await fetchTasks();
      setSelectedTaskIds([]);
      setIsBulkActionMode(false);
    } catch (error) {
      console.error("Error deleting tasks:", error);
      alert("タスクの一括削除に失敗しました。");
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleBulkActionMode = () => {
    setIsBulkActionMode(!isBulkActionMode);
    setSelectedTaskIds([]);
  };

  const filteredTasks = tasks.filter((task) => {
    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesDescription) return false;
    }

    // 既存のフィルター条件
    if (categoryFilter !== "all" && task.category !== categoryFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (frequencyFilter !== "all" && task.frequency !== frequencyFilter) return false;
    if (completionFilter === "completed" && !task.is_completed) return false;
    if (completionFilter === "incomplete" && task.is_completed) return false;
    
    if (dueDateFilter !== "all" && task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const weekLater = new Date();
      weekLater.setDate(today.getDate() + 7);
      
      switch (dueDateFilter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          return dueDate <= weekLater;
        case "overdue":
          return dueDate < today && !task.is_completed;
        default:
          return true;
      }
    }
    
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "due_date":
        if (!a.due_date) comparison = 1;
        else if (!b.due_date) comparison = -1;
        else
          comparison =
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        break;
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "created_at":
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">タスク管理</h1>
        <div className="space-x-3">
          {isBulkActionMode ? (
            <>
              <button
                onClick={handleBulkComplete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                選択を完了
              </button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                選択を削除
              </button>
              <button
                onClick={toggleBulkActionMode}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleBulkActionMode}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                一括操作
              </button>
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setIsTaskFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                KDI追加
              </button>
              <button
                onClick={() => {
                  setSelectedTodo(null);
                  setIsTodoFormOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                ToDo追加
              </button>
            </>
          )}
        </div>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タスクを検索..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* フィルターとソート */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as TaskCategory | "all")
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              {Object.keys(categoryLabels).map((cat) => (
                <option key={cat} value={cat as TaskCategory}>
                  {categoryLabels[cat as TaskCategory]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as TaskPriority | "all")
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              {Object.keys(priorityLabels).map((pri) => (
                <option key={pri} value={pri as TaskPriority}>
                  {priorityLabels[pri as TaskPriority]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              頻度
            </label>
            <select
              value={frequencyFilter}
              onChange={(e) =>
                setFrequencyFilter(e.target.value as TaskFrequency | "all")
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              {Object.keys(frequencyLabels).map((freq) => (
                <option key={freq} value={freq as TaskFrequency}>
                  {frequencyLabels[freq as TaskFrequency]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              完了状態
            </label>
            <select
              value={completionFilter}
              onChange={(e) =>
                setCompletionFilter(e.target.value as
                  | "all"
                  | "completed"
                  | "incomplete")
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              <option value="completed">完了済み</option>
              <option value="incomplete">未完了</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              期限
            </label>
            <select
              value={dueDateFilter}
              onChange={(e) =>
                setDueDateFilter(e.target.value as
                  | "all"
                  | "today"
                  | "week"
                  | "overdue")
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">すべて</option>
              <option value="today">今日</option>
              <option value="week">今週</option>
              <option value="overdue">期限切れ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              並び替え
            </label>
            <div className="flex space-x-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="due_date">期限</option>
                <option value="priority">優先度</option>
                <option value="created_at">作成日</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KDIセクション */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          KDI（重要実行指標）
        </h2>
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <input
                  type={isBulkActionMode ? "checkbox" : "checkbox"}
                  checked={isBulkActionMode ? selectedTaskIds.includes(task.id) : task.is_completed}
                  onChange={() =>
                    isBulkActionMode
                      ? toggleTaskSelection(task.id)
                      : handleTaskComplete(task.id)
                  }
                  className={`h-4 w-4 ${
                    isBulkActionMode
                      ? "text-indigo-600 focus:ring-indigo-500"
                      : "text-indigo-600 focus:ring-indigo-500"
                  } border-gray-300 rounded`}
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {task.title}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {categoryLabels[task.category]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {frequencyLabels[task.frequency]}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-500">
                        期限: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!isBulkActionMode && (
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskFormOpen(true);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ToDoセクション */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          ToDo（一時タスク）
        </h2>
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => handleTodoComplete(todo.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {todo.title}
                  </h3>
                  {todo.due_date && (
                    <span className="text-xs text-gray-500">
                      期限: {new Date(todo.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTodo(todo);
                  setIsTodoFormOpen(true);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* フォームモーダル */}
      {isTaskFormOpen && (
        <TaskForm
          task={selectedTask}
          isOpen={true}
          onClose={() => {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
          }}
          onSave={() => {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
            fetchTasks();
          }}
        />
      )}

      {isTodoFormOpen && (
        <TodoForm
          todo={selectedTodo}
          isOpen={true}
          onClose={() => {
            setIsTodoFormOpen(false);
            setSelectedTodo(null);
          }}
          onSave={() => {
            setIsTodoFormOpen(false);
            setSelectedTodo(null);
            fetchTodos();
          }}
        />
      )}
    </div>
  );
}
