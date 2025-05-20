"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Journal } from "@/types/journal";

interface JournalFormProps {
  journalId?: string;
}

export function JournalForm({ journalId }: JournalFormProps) {
  const [loading, setLoading] = useState(false);
  const [journal, setJournal] = useState<Partial<Journal>>({
    title: "",
    content: "",
    mood: "neutral",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (journalId) {
      fetchJournal();
    }
  }, [journalId]);

  const fetchJournal = async () => {
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("id", journalId)
        .single();

      if (error) throw error;
      if (data) {
        setJournal(data);
      }
    } catch (error) {
      console.error("Error fetching journal:", error);
      alert("ジャーナルの取得に失敗しました。");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (journalId) {
        const { error } = await supabase
          .from("journals")
          .update(journal)
          .eq("id", journalId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("journals").insert([journal]);
        if (error) throw error;
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

  const handleAddTag = () => {
    if (newTag && !journal.tags?.includes(newTag)) {
      setJournal({
        ...journal,
        tags: [...(journal.tags || []), newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setJournal({
      ...journal,
      tags: journal.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <div>
          <input
            type="text"
            id="title"
            value={journal.title}
            onChange={(e) =>
              setJournal({ ...journal, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="タイトルを入力してください"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label
              htmlFor="mood"
              className="block text-sm font-medium text-gray-700"
            >
              今日の気分
            </label>
            <select
              id="mood"
              value={journal.mood}
              onChange={(e) =>
                setJournal({
                  ...journal,
                  mood: e.target.value as Journal["mood"],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="great">素晴らしい</option>
              <option value="good">良い</option>
              <option value="neutral">普通</option>
              <option value="bad">悪い</option>
              <option value="terrible">最悪</option>
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              タグ
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="新しいタグを入力"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                追加
              </button>
            </div>
          </div>
        </div>

        <div>
          <textarea
            id="content"
            rows={10}
            value={journal.content}
            onChange={(e) =>
              setJournal({ ...journal, content: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="今日の振り返りを記入してください"
            required
          />
        </div>

        {journal.tags && journal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {journal.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                >
                  <span className="sr-only">削除</span>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </form>
  );
} 