export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskCategory = "course" | "habit" | "operation" | "other";

export type TaskPriority = "high" | "medium" | "low";

export type TaskFrequency = "daily" | "weekly" | "once";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  frequency: TaskFrequency;
  estimated_hours: number;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  tags: string[];
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
