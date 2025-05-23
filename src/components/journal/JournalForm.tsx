"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Journal } from "@/types/journal";
import { TagSelector } from "@/components/tags/TagSelector";

interface JournalFormProps {
  entryId?: string;
}

export function JournalForm({ entryId }: JournalFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<Partial<Journal>>({
    title: "",
    content: "",
    mood: "neutral",
    tags: [],
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (entryId) {
      fetchEntry();
    }
  }, [entryId]);

  const fetchEntry = async () => {
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("id", entryId)
        .single();

      if (error) throw error;
      if (data) {
        setEntry({
          ...data,
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Error fetching journal:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (entryId) {
        // エントリーの更新
        const { error: entryError } = await supabase
          .from("journals")
          .update({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags,
            date: entry.date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", entryId);

        if (entryError) throw entryError;
      } else {
        // エントリーの作成
        const { error: entryError } = await supabase.from("journals").insert({
          title:
            entry.title ||
            (entry.date
              ? new Date(entry.date).toLocaleDateString("ja-JP")
              : new Date().toLocaleDateString("ja-JP")),
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags || [],
          date: entry.date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (entryError) throw entryError;
      }

      router.push("/journal");
      router.refresh();
    } catch (error) {
      console.error("Error saving journal:", error);
      alert("ジャーナルの保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          日付
        </label>
        <input
          type="date"
          id="date"
          value={entry.date}
          onChange={(e) => setEntry({ ...entry, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="タイトルを入力してください"
          required
        />
      </div>

      <div>
        <label
          htmlFor="mood"
          className="block text-sm font-medium text-gray-700"
        >
          今日の気分
        </label>
        <div className="mt-1 flex items-center space-x-4">
          {["terrible", "bad", "neutral", "good", "great"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setEntry({ ...entry, mood: value as Journal["mood"] })
              }
              className={`w-20 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                entry.mood === value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {value === "terrible"
                ? "最悪"
                : value === "bad"
                ? "悪い"
                : value === "neutral"
                ? "普通"
                : value === "good"
                ? "良い"
                : "素晴らしい"}
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
