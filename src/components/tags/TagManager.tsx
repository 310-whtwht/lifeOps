"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tag } from "@/types/tag";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export function TagManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6B7280");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      const { error } = await supabase.from("tags").insert([
        {
          name: newTagName.trim(),
          color: newTagColor,
        },
      ]);

      if (error) throw error;
      setNewTagName("");
      setNewTagColor("#6B7280");
      await fetchTags();
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("タグの作成に失敗しました。");
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      const { error } = await supabase
        .from("tags")
        .update({
          name: editingTag.name.trim(),
          color: editingTag.color,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTag.id);

      if (error) throw error;
      setEditingTag(null);
      await fetchTags();
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("タグの更新に失敗しました。");
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm("このタグを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
      await fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("タグの削除に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">タグの作成</h2>
        <form onSubmit={handleCreateTag} className="space-y-4">
          <div>
            <label
              htmlFor="tagName"
              className="block text-sm font-medium text-gray-700"
            >
              タグ名
            </label>
            <input
              type="text"
              id="tagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tagColor"
              className="block text-sm font-medium text-gray-700"
            >
              色
            </label>
            <input
              type="color"
              id="tagColor"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            タグを作成
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">タグ一覧</h2>
        <div className="space-y-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {editingTag?.id === tag.id ? (
                <form onSubmit={handleUpdateTag} className="flex-1 space-y-4">
                  <div>
                    <input
                      type="text"
                      value={editingTag.name}
                      onChange={(e) =>
                        setEditingTag({ ...editingTag, name: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="color"
                      value={editingTag.color}
                      onChange={(e) =>
                        setEditingTag({ ...editingTag, color: e.target.value })
                      }
                      className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTag(null)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-gray-900">{tag.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 