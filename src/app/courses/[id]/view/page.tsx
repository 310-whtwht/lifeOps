import { Navigation } from "@/components/shared/Navigation";
import { CourseDetail } from "@/components/courses/CourseDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "講座詳細 | LifeOps",
  description: "講座の詳細情報を確認できます。",
};

export default function CourseViewPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              講座詳細
            </h1>
          </div>
        </div>

        <div className="mt-8">
          <CourseDetail courseId={params.id} />
        </div>
      </main>
    </div>
  );
}
