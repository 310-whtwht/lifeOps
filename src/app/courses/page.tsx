"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course, CourseStatus } from "@/types/course";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // モジュール情報を取得
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("*");

      if (modulesError) throw modulesError;

      // モジュール情報を講座に紐付け
      const coursesWithModules = data.map((course) => ({
        ...course,
        modules: modules?.filter((module) => module.course_id === course.id) || [],
      }));

      setCourses(coursesWithModules);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">講座一覧</h1>
        <Link
          href="/courses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          新規作成
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {course.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[course.status]}`}
                >
                  {statusLabels[course.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {course.description}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {course.price.toLocaleString()}円
                </div>
                <div className="text-sm text-gray-500">
                  {course.modules.length}モジュール
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            講座がありません
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            新しい講座を作成してください。
          </p>
          <div className="mt-6">
            <Link
              href="/courses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              新規作成
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
