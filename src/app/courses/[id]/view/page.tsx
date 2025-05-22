import { Navigation } from "@/components/shared/Navigation";
import { CourseDetail } from "@/components/courses/CourseDetail";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "講座詳細 | LifeOps",
  description: "講座の詳細情報を確認できます。",
};

export default async function ViewCoursePage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">講座詳細</h1>
        <div className="mt-8 max-w-3xl">
          <CourseDetail courseId={resolvedParams.id} />
        </div>
      </div>
    </div>
  );
}
