"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { JournalEntry } from "@/types/journal";
import { TagSelector } from "@/components/tags/TagSelector";

interface JournalFormProps {
  entryId?: string;
}

export function JournalForm({ entryId }: JournalFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<Partial<JournalEntry>>({
    content: "",
    mood: 3,
    tags: [],
  });

  useEffect(() => {
    if (entryId) {
      fetchEntry();
    }
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (entryId) {
        // エントリーの更新
        const { error: entryError } = await supabase
          .from("journal_entries")
          .update({
            content: entry.content,
            mood: entry.mood,
            updated_at: new Date().toISOString(),
          })
          .eq("id", entryId);

        if (entryError) throw entryError;

        // タグの更新
        const { error: tagError } = await supabase
          .from("journal_tags")
          .delete()
          .eq("journal_id", entryId);

        if (tagError) throw tagError;

        if (entry.tags && entry.tags.length > 0) {
          const { error: insertTagError } = await supabase
            .from("journal_tags")
            .insert(
              entry.tags.map((tagId) => ({
                journal_id: entryId,
                tag_id: tagId,
              }))
            );

          if (insertTagError) throw insertTagError;
        }
      } else {
        // エントリーの作成
        const { data: newEntry, error: entryError } = await supabase
          .from("journal_entries")
          .insert([
            {
              content: entry.content,
              mood: entry.mood,
            },
          ])
          .select()
          .single();

        if (entryError) throw entryError;

        // タグの作成
        if (newEntry && entry.tags && entry.tags.length > 0) {
          const { error: tagError } = await supabase
            .from("journal_tags")
            .insert(
              entry.tags.map((tagId) => ({
                journal_id: newEntry.id,
                tag_id: tagId,
              }))
            );

          if (tagError) throw tagError;
        }
      }

      router.push("/journal");
      router.refresh();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("ジャーナルの保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-gray-700"
        >
          今日の気分
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setEntry({ ...entry, mood: value })}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
                entry.mood === value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={entry.content}
          onChange={(e) => setEntry({ ...entry, content: e.target.value })}
          rows={8}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <TagSelector
        selectedTags={entry.tags || []}
        onChange={(tags) => setEntry({ ...entry, tags })}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
