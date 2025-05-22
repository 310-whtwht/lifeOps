"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course, CourseStatus, Module } from "@/types/course";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CourseFormProps {
  course?: Course;
  onSave: () => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    status: "not_started",
    price: 0,
    genre: "",
    release_date: null,
    modules: [],
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (course) {
        // 既存の講座を更新
        const { error: courseError } = await supabase
          .from("courses")
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            price: formData.price,
            genre: formData.genre,
            release_date: formData.release_date,
            updated_at: new Date().toISOString(),
          })
          .eq("id", course.id);

        if (courseError) throw courseError;

        // 既存のモジュールを削除
        const { error: deleteError } = await supabase
          .from("modules")
          .delete()
          .eq("course_id", course.id);

        if (deleteError) throw deleteError;
      } else {
        // 新規講座を作成
        const { data: newCourse, error: courseError } = await supabase
          .from("courses")
          .insert({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            price: formData.price,
            genre: formData.genre,
            release_date: formData.release_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (courseError) throw courseError;
        if (!newCourse) throw new Error("Failed to create course");

        course = newCourse;
      }

      // モジュールを保存
      if (formData.modules && formData.modules.length > 0) {
        const modules = formData.modules.map((module, index) => ({
          course_id: course!.id,
          title: module.title,
          description: module.description,
          order: index,
          is_completed: module.is_completed,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: modulesError } = await supabase
          .from("modules")
          .insert(modules);

        if (modulesError) throw modulesError;
      }

      onSave();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("講座の保存に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
        {
          id: "",
          course_id: course?.id || "",
          title: "",
          description: "",
          order: prev.modules?.length || 0,
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }));
  };

  const removeModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules?.map((module, i) =>
        i === index ? { ...module, [field]: value } : module
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            ステータス
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as CourseStatus,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="not_started">未着手</option>
            <option value="planning">構成中</option>
            <option value="recording">収録中</option>
            <option value="published">公開済</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            価格（円）
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-medium text-gray-700"
          >
            ジャンル
          </label>
          <input
            type="text"
            id="genre"
            value={formData.genre}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, genre: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="release_date"
            className="block text-sm font-medium text-gray-700"
          >
            リリース日
          </label>
          <input
            type="date"
            id="release_date"
            value={formData.release_date || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                release_date: e.target.value || null,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">モジュール</h3>
          <button
            type="button"
            onClick={addModule}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            モジュールを追加
          </button>
        </div>

        <div className="space-y-4">
          {formData.modules?.map((module, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-md space-y-4"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-900">
                  モジュール {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeModule(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label
                  htmlFor={`module-title-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  タイトル
                </label>
                <input
                  type="text"
                  id={`module-title-${index}`}
                  value={module.title}
                  onChange={(e) =>
                    updateModule(index, "title", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={`module-description-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  説明
                </label>
                <textarea
                  id={`module-description-${index}`}
                  value={module.description}
                  onChange={(e) =>
                    updateModule(index, "description", e.target.value)
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`module-completed-${index}`}
                  checked={module.is_completed}
                  onChange={(e) =>
                    updateModule(index, "is_completed", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`module-completed-${index}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  完了
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
