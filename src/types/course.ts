export type CourseStatus =
  | "not_started"
  | "planning"
  | "recording"
  | "published";

export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  price: number;
  genre: string;
  release_date: string | null;
  modules: Module[];
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  modules: {
    title: string;
    description: string;
    order: number;
  }[];
  created_at: string;
  updated_at: string;
}
