import { Navigation } from "@/components/shared/Navigation";
import { CourseForm } from "@/components/courses/CourseForm";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">講座編集</h1>
        <div className="mt-8 max-w-3xl">
          <CourseForm courseId={params.id} />
        </div>
      </div>
    </div>
  );
}
