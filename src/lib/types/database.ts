export type Course = {
  id: string;
  title: string;
  status: "not_started" | "planning" | "recording" | "published";
  price_range: string;
  genre: string;
  release_date: string;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  order: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  category: "course" | "habit" | "operation";
  due_date: string;
  priority: "high" | "medium" | "low";
  estimated_hours: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type Todo = {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type KpiRecord = {
  id: string;
  month: string;
  revenue: number;
  disposable_income: number;
  course_sales: number;
  working_hours: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type KpiMilestone = {
  id: string;
  quarter: string;
  disposable_income_target: number;
  course_count_target: number;
  subscription_count_target: number;
  working_hours_target: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type StrategyLog = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type HabitCheck = {
  id: string;
  date: string;
  english_study: boolean;
  exercise: boolean;
  created_at: string;
  updated_at: string;
};

export type MetaInfo = {
  id: string;
  key: "kgi" | "vps";
  value: string;
  created_at: string;
  updated_at: string;
};

export type AchievementLog = {
  id: string;
  date: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type MoodLog = {
  id: string;
  date: string;
  mood: number;
  health: number;
  created_at: string;
  updated_at: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};
