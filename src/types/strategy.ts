export interface Strategy {
  id: string;
  title: string;
  content: string;
  category: "kgi" | "kpi" | "kdi" | "blocker" | "next_strategy" | "review";
  created_at: string;
  updated_at: string;
}

export interface StrategyReview {
  id: string;
  date: string;
  summary: string;
  next_strategy: string;
  created_at: string;
  updated_at: string;
}
