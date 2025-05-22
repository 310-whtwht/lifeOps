import { TagManager } from "@/components/tags/TagManager";

export default function TagsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">タグ管理</h1>
      <TagManager />
    </div>
  );
}
