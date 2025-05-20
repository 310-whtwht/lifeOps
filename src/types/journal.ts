export interface Journal {
  id: string;
  title: string;
  content: string;
  mood: "great" | "good" | "neutral" | "bad" | "terrible";
  tags: string[];
  created_at: string;
  updated_at: string;
}
