import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Course } from "@/types/course";

export const coursesMetadata: Metadata = {
  title: "講座一覧 | LifeOps",
  description: "講座の管理と進捗を確認しましょう",
};

export const newCourseMetadata: Metadata = {
  title: "新規講座作成 | LifeOps",
  description: "新しい講座を作成しましょう",
};

export const courseDetailMetadata: Metadata = {
  title: "講座詳細 | LifeOps",
  description: "講座の詳細情報と進捗を確認しましょう",
};

export const coursePreviewMetadata: Metadata = {
  title: "講座プレビュー | LifeOps",
  description: "講座のプレビューを確認しましょう",
};

async function fetchCourse(id: string): Promise<Course> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  // モジュール情報を取得
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .order("order", { ascending: true });

  if (modulesError) {
    throw modulesError;
  }

  return {
    ...data,
    modules: modules || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const course = await fetchCourse(params.id);
    return {
      title: `${course.title} | LifeOps`,
      description: course.description,
    };
  } catch {
    return courseDetailMetadata;
  }
}
