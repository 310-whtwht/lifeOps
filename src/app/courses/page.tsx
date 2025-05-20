import { CourseList } from "@/components/courses/CourseList";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "コース | LifeOps",
  description: "学習コースの管理",
};

export default function CoursesPage() {
  return (
    <PageLayout
      title="コース"
      description="学習コースの管理と進捗を確認しましょう"
    >
      <CourseList />
    </PageLayout>
  );
}
