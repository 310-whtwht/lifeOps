export interface KPI {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  created_at: string;
  updated_at: string;
}
