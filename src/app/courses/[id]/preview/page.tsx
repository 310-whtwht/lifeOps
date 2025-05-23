// src/app/courses/[id]/preview/page.tsx

"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course } from "@/types/course";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function CoursePreviewPage() {
  // 動的ルートのパラメータをフック経由で取得
  const params = useParams();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (id) fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", id)
        .order("order", { ascending: true });

      if (modulesError) throw modulesError;

      setCourse({
        ...data,
        modules: modules || [],
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">プレビュー</h1>
          <Link
            href={`/courses/${course.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            編集に戻る
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
            <p className="mt-2 text-gray-600">{course.description}</p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ジャンル</h3>
                <p className="mt-1 text-sm text-gray-900">{course.genre}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">価格</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {course.price.toLocaleString()}円
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                カリキュラム
              </h3>
              <div className="mt-4 space-y-4">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-gray-50 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                          <span className="text-sm font-medium text-indigo-600">
                            {index + 1}
                          </span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {module.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                購入する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
