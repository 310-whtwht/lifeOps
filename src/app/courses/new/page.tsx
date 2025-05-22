"use client";

import { CourseForm } from "@/components/courses/CourseForm";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        新規講座作成
      </h1>
      <CourseForm
        onSave={() => router.push("/courses")}
        onCancel={() => router.push("/courses")}
      />
    </div>
  );
}
