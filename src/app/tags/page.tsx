import { TagManager } from "@/components/tags/TagManager";
import { TagStats } from "@/components/tags/TagStats";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">タグ管理</h1>
      </div>
      <TagManager />
      <TagStats />
    </div>
  );
}
