export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
