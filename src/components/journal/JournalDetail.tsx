"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { JournalEntry } from "@/types/journal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TagList } from "@/components/tags/TagList";

interface JournalDetailProps {
  entryId: string;
}

export function JournalDetail({ entryId }: JournalDetailProps) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchEntry();
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select(
          `
          *,
          journal_tags (
            tag_id
          )
        `
        )
        .eq("id", entryId)
        .single();

      if (error) throw error;
      if (data) {
        setEntry({
          ...data,
          tags: data.journal_tags.map((jt: { tag_id: string }) => jt.tag_id),
        });
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このエントリーを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", entryId);
      if (error) throw error;
      router.push("/journal");
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      alert("エントリーの削除に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">エントリーが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                気分: {entry.mood}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(entry.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap mb-4">
              {entry.content}
            </div>
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">タグ</p>
                <TagList tagIds={entry.tags} />
              </div>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              href={`/journal/${entry.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
              title="編集"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900"
              title="削除"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
