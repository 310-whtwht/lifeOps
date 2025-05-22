"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tag } from "@/types/tag";
import { TagList } from "./TagList";
import { TagEditModal } from "./TagEditModal";
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface TagStats {
  tag: Tag;
  taskCount: number;
  journalCount: number;
  totalCount: number;
}

type SortField = "name" | "taskCount" | "journalCount" | "totalCount";
type SortOrder = "asc" | "desc";

export function TagStats() {
  const [stats, setStats] = useState<TagStats[]>([]);
  const [filteredStats, setFilteredStats] = useState<TagStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("totalCount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTagStats();
  }, []);

  useEffect(() => {
    let filtered = stats;

    // 検索フィルタリング
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((stat) =>
        stat.tag.name.toLowerCase().includes(query)
      );
    }

    // 並び替え
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.tag.name.localeCompare(b.tag.name);
          break;
        case "taskCount":
          comparison = a.taskCount - b.taskCount;
          break;
        case "journalCount":
          comparison = a.journalCount - b.journalCount;
          break;
        case "totalCount":
          comparison = a.totalCount - b.totalCount;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredStats(filtered);
  }, [searchQuery, stats, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = () => {
    if (selectedTags.size === filteredStats.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(filteredStats.map((stat) => stat.tag.id)));
    }
  };

  const handleSelectTag = (tagId: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagId)) {
      newSelected.delete(tagId);
    } else {
      newSelected.add(tagId);
    }
    setSelectedTags(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`${selectedTags.size}個のタグを削除してもよろしいですか？`)) {
      return;
    }

    try {
      // タグの関連付けを削除
      await supabase
        .from("task_tags")
        .delete()
        .in("tag_id", Array.from(selectedTags));

      await supabase
        .from("journal_tags")
        .delete()
        .in("tag_id", Array.from(selectedTags));

      // タグを削除
      const { error } = await supabase
        .from("tags")
        .delete()
        .in("id", Array.from(selectedTags));

      if (error) throw error;

      // 選択をクリア
      setSelectedTags(new Set());
      // タグ一覧を更新
      await fetchTagStats();
    } catch (error) {
      console.error("Error deleting tags:", error);
      alert("タグの削除に失敗しました。");
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
  };

  const handleCloseEditModal = () => {
    setEditingTag(null);
  };

  const handleSaveTag = async () => {
    await fetchTagStats();
  };

  const fetchTagStats = async () => {
    try {
      // タグ一覧を取得
      const { data: tags, error: tagsError } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (tagsError) throw tagsError;

      // タスクのタグ使用数を取得
      const { data: taskTags, error: taskTagsError } = await supabase
        .from("task_tags")
        .select("tag_id");

      if (taskTagsError) throw taskTagsError;

      // ジャーナルのタグ使用数を取得
      const {
        data: journalTags,
        error: journalTagsError,
      } = await supabase.from("journal_tags").select("tag_id");

      if (journalTagsError) throw journalTagsError;

      // 統計情報を計算
      const tagStats = tags.map((tag) => {
        const taskCount = taskTags.filter((tt) => tt.tag_id === tag.id).length;
        const journalCount = journalTags.filter((jt) => jt.tag_id === tag.id)
          .length;
        return {
          tag,
          taskCount,
          journalCount,
          totalCount: taskCount + journalCount,
        };
      });

      setStats(tagStats);
    } catch (error) {
      console.error("Error fetching tag stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-700"
    >
      <span>{label}</span>
      {sortField === field &&
        (sortOrder === "asc" ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        ))}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">タグの使用状況</h2>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タグ名で検索..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">並び替え:</span>
            <SortButton field="name" label="名前" />
            <SortButton field="taskCount" label="タスク数" />
            <SortButton field="journalCount" label="ジャーナル数" />
            <SortButton field="totalCount" label="合計" />
          </div>
          {selectedTags.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {selectedTags.size}個のタグを削除
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={selectedTags.size === filteredStats.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-500">
              {selectedTags.size}個のタグを選択中
            </span>
          </div>

          {filteredStats.map((stat) => (
            <div
              key={stat.tag.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedTags.has(stat.tag.id)}
                  onChange={() => handleSelectTag(stat.tag.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {stat.tag.name}
                    </span>
                    <TagList tagIds={[stat.tag.id]} />
                    <button
                      onClick={() => handleEditTag(stat.tag)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>タスク: {stat.taskCount}件</span>
                    <span>ジャーナル: {stat.journalCount}件</span>
                    <span>合計: {stat.totalCount}件</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{
                      width: `${(stat.totalCount /
                        Math.max(...stats.map((s) => s.totalCount))) *
                        100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {filteredStats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              タグが見つかりませんでした
            </div>
          )}
        </div>
      </div>

      {editingTag && (
        <TagEditModal
          tag={editingTag}
          isOpen={true}
          onClose={handleCloseEditModal}
          onSave={handleSaveTag}
        />
      )}
    </div>
  );
}
