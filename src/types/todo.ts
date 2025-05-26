export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
