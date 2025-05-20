"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Journal } from "@/types/journal";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const moodLabels: Record<Journal["mood"], string> = {
  great: "素晴らしい",
  good: "良い",
  neutral: "普通",
  bad: "悪い",
  terrible: "最悪",
};

const moodColors: Record<Journal["mood"], string> = {
  great: "bg-green-100 text-green-800",
  good: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800",
  bad: "bg-yellow-100 text-yellow-800",
  terrible: "bg-red-100 text-red-800",
};

export function JournalList() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このジャーナルを削除してもよろしいですか？")) return;

    try {
      const { error } = await supabase
        .from("journals")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchJournals();
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("ジャーナルの削除に失敗しました。");
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">ジャーナル</h2>
          <Link
            href="/journal/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            新規ジャーナル
          </Link>
        </div>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">ジャーナルがありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {journals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {journal.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          moodColors[journal.mood]
                        }`}
                      >
                        {moodLabels[journal.mood]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(journal.created_at).toLocaleDateString(
                        "ja-JP",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "long",
                        }
                      )}
                    </p>
                    <div className="prose max-w-none text-gray-600 whitespace-pre-wrap mb-4">
                      {journal.content}
                    </div>
                    {journal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {journal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/journal/${journal.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="編集"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(journal.id)}
                      className="text-red-600 hover:text-red-900"
                      title="削除"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
