"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { HexColorPicker } from "react-colorful";

const BASE_COLORS = [
  { name: "白", value: "#ffffff" },
  { name: "グレー", value: "#f3f4f6" },
  { name: "ベージュ", value: "#fef3c7" },
  { name: "ライトブルー", value: "#dbeafe" },
  { name: "ライトグリーン", value: "#dcfce7" },
  { name: "ピンク", value: "#fce7f3" },
  { name: "パープル", value: "#f3e8ff" },
  { name: "オレンジ", value: "#ffedd5" },
  { name: "レッド", value: "#fee2e2" },
  { name: "スカイブルー", value: "#e0f2fe" },
];

// 背景色を適用する関数
const applyBackgroundColor = (color: string) => {
  document.documentElement.style.setProperty("--app-background-color", color);
  localStorage.setItem("background-color", color);
};

export function AppearanceSettings() {
  const [backgroundColor, setBackgroundColor] = useState(() => {
    // 初期値をローカルストレージから取得
    return localStorage.getItem("background-color") || "#ffffff";
  });
  const [loading, setLoading] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const supabase = createClientComponentClient();

  // 初期ロード時に背景色を設定
  useEffect(() => {
    applyBackgroundColor(backgroundColor);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("background_color")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setBackgroundColor(data.background_color);
        applyBackgroundColor(data.background_color);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = async (color: string) => {
    setBackgroundColor(color);
    setShowColorPicker(false);

    try {
      const { error } = await supabase.from("app_settings").upsert({
        background_color: color,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // 背景色を適用
      applyBackgroundColor(color);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("設定の保存に失敗しました。");
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
      <div>
        <h3 className="text-lg font-medium text-gray-900">背景色</h3>
        <p className="mt-1 text-sm text-gray-500">
          アプリの背景色を選択してください
        </p>

        {/* ベースカラー */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            ベースカラー
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {BASE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-12 h-12 rounded-full border-2 transition-transform ${
                  backgroundColor === color.value
                    ? "border-indigo-600 scale-110"
                    : "border-gray-200 hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* カスタムカラー */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            カスタムカラー
          </h4>
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors"
              style={{ backgroundColor: backgroundColor }}
            />
            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-lg">
                <HexColorPicker
                  color={backgroundColor}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* 現在の色コード */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            現在の色: <span className="font-mono">{backgroundColor}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
