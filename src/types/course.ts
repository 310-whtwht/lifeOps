export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
  user_id: string;
}
