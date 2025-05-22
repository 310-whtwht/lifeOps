export interface Milestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  created_at: string;
  updated_at: string;
}
