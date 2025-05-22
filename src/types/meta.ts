export interface MetaInfo {
  id: string;
  key: "kgi" | "vps";
  value: string;
  updated_at: string;
}

export interface KgiInfo {
  target_income: number; // 目標可処分所得（万円）
  target_work_hours: number; // 目標週間労働時間
  target_course_sales: number; // 目標講座販売数
  target_subscription: number; // 目標サブスク数
  updated_at: string;
}

export interface VpsInfo {
  statement: string; // バリューポジションステートメント
  updated_at: string;
}

export interface HabitCheck {
  id: string;
  date: string;
  english_study: boolean;
  workout: boolean;
  created_at: string;
  updated_at: string;
}

export interface KpiRecord {
  id: string;
  year: number;
  month: number;
  income: number; // 可処分所得（万円）
  work_hours: number; // 週間労働時間
  course_sales: number; // 講座販売数
  subscription: number; // サブスク数
  created_at: string;
  updated_at: string;
}

export interface KpiMilestone {
  id: string;
  quarter: number; // 1-4
  year: number;
  target_income: number; // 目標可処分所得（万円）
  target_work_hours: number; // 目標週間労働時間
  target_course_sales: number; // 目標講座販売数
  target_subscription: number; // 目標サブスク数
  notes: string;
  created_at: string;
  updated_at: string;
}
