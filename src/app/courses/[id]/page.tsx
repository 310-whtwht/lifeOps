// src/app/courses/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course, CourseStatus } from "@/types/course";
import { CourseForm } from "@/components/courses/CourseForm";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const statusLabels: Record<CourseStatus, string> = {
  not_started: "未着手",
  planning: "構成中",
  recording: "収録中",
  published: "公開済",
};

const statusColors: Record<CourseStatus, string> = {
  not_started: "bg-gray-100 text-gray-800",
  planning: "bg-blue-100 text-blue-800",
  recording: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
};

export default function CoursePage() {
  // 動的ルートのパラメータをフック経由で取得
  const params = useParams();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleDelete = async () => {
    if (!confirm("この講座を削除してもよろしいですか？")) return;

    try {
      const { error: modulesError } = await supabase
        .from("modules")
        .delete()
        .eq("course_id", id);

      if (modulesError) throw modulesError;

      const { error: courseError } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

      if (courseError) throw courseError;

      router.push("/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("講座の削除に失敗しました。");
    }
  };

  const handleDuplicate = async () => {
    if (!course) return;

    try {
      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert({
          title: `${course.title} (コピー)`,
          description: course.description,
          status: "not_started",
          price: course.price,
          genre: course.genre,
          release_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (courseError) throw courseError;
      if (!newCourse) throw new Error("Failed to create course");

      if (course.modules.length > 0) {
        const modules = course.modules.map((module) => ({
          course_id: newCourse.id,
          title: module.title,
          description: module.description,
          order: module.order,
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: modulesError } = await supabase
          .from("modules")
          .insert(modules);

        if (modulesError) throw modulesError;
      }

      router.push(`/courses/${newCourse.id}`);
    } catch (error) {
      console.error("Error duplicating course:", error);
      alert("講座の複製に失敗しました。");
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

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <CourseForm
          course={course}
          onSave={() => {
            setIsEditing(false);
            fetchCourse();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {course.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {course.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[course.status]
              }`}
            >
              {statusLabels[course.status]}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">価格</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.price.toLocaleString()}円
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">ジャンル</dt>
              <dd className="mt-1 text-sm text-gray-900">{course.genre}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">リリース日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {course.release_date
                  ? new Date(course.release_date).toLocaleDateString()
                  : "未設定"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">モジュール</h4>
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-gray-50 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">
                      {index + 1}. {module.title}
                    </h5>
                    <p className="mt-1 text-sm text-gray-500">
                      {module.description}
                    </p>
                  </div>
                  {module.is_completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      完了
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-end space-x-3">
            <Link
              href={`/courses/${course.id}/preview`}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              プレビュー
            </Link>
            <button
              type="button"
              onClick={handleDuplicate}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              複製
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              削除
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              編集
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
