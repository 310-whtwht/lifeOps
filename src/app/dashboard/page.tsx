"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { KpiProgress } from "@/components/dashboard/KpiProgress";
import { HabitCheck } from "@/components/dashboard/HabitCheck";
import { TodoList } from "@/components/dashboard/TodoList";

export default function DashboardPage() {
  const [kgi, setKgi] = useState("");
  const [vps, setVps] = useState("");
  const [isEditingKgi, setIsEditingKgi] = useState(false);
  const [isEditingVps, setIsEditingVps] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchMetaInfo();
  }, []);

  const fetchMetaInfo = async () => {
    try {
      const { data: kgiData, error: kgiError } = await supabase
        .from("meta_info")
        .select("*")
        .eq("key", "kgi")
        .single();

      const { data: vpsData, error: vpsError } = await supabase
        .from("meta_info")
        .select("*")
        .eq("key", "vps")
        .single();

      if (kgiError && kgiError.code !== "PGRST116") throw kgiError;
      if (vpsError && vpsError.code !== "PGRST116") throw vpsError;

      if (kgiData) setKgi(kgiData.value);
      if (vpsData) setVps(vpsData.value);
    } catch (error) {
      console.error("Error fetching meta info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKgi = async () => {
    try {
      // 既存のKGIレコードをすべて削除
      const { error: deleteError } = await supabase
        .from("meta_info")
        .delete()
        .eq("key", "kgi");

      if (deleteError) throw deleteError;

      // 新しいKGIレコードを作成
      const { error: insertError } = await supabase.from("meta_info").insert({
        key: "kgi",
        value: kgi,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setIsEditingKgi(false);
    } catch (error) {
      console.error("Error saving KGI:", error);
      alert("KGIの保存に失敗しました。");
    }
  };

  const handleSaveVps = async () => {
    try {
      // 既存のVPSレコードをすべて削除
      const { error: deleteError } = await supabase
        .from("meta_info")
        .delete()
        .eq("key", "vps");

      if (deleteError) throw deleteError;

      // 新しいVPSレコードを作成
      const { error: insertError } = await supabase.from("meta_info").insert({
        key: "vps",
        value: vps,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setIsEditingVps(false);
    } catch (error) {
      console.error("Error saving VPS:", error);
      alert("VPSの保存に失敗しました。");
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6">
        {/* KGIセクション */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">人生KGI</h2>
            {!isEditingKgi ? (
              <button
                onClick={() => setIsEditingKgi(true)}
                className="text-gray-400 hover:text-gray-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveKgi}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingKgi(false);
                    fetchMetaInfo(); // 編集をキャンセルして元の値に戻す
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {isEditingKgi ? (
            <textarea
              value={kgi}
              onChange={(e) => setKgi(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="あなたの人生KGIを入力してください..."
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {kgi || "KGIが設定されていません"}
            </p>
          )}
        </div>

        {/* VPSセクション */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              バリューポジションステートメント
            </h2>
            {!isEditingVps ? (
              <button
                onClick={() => setIsEditingVps(true)}
                className="text-gray-400 hover:text-gray-500"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveVps}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingVps(false);
                    fetchMetaInfo(); // 編集をキャンセルして元の値に戻す
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
          {isEditingVps ? (
            <textarea
              value={vps}
              onChange={(e) => setVps(e.target.value)}
              className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="あなたのバリューポジションステートメントを入力してください..."
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {vps || "VPSが設定されていません"}
            </p>
          )}
        </div>

        {/* KPI進捗セクション */}
        <KpiProgress />

        {/* 習慣チェックセクション */}
        <HabitCheck />

        {/* TodoListセクション */}
        <TodoList />
      </div>
    </div>
  );
}
