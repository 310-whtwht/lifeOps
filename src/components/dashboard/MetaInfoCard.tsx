"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type MetaInfoCardProps = {
  type: "kgi" | "vps";
  title: string;
  initialValue: string;
};

export function MetaInfoCard({ type, title, initialValue }: MetaInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = async () => {
    const { error } = await supabase
      .from("meta_info")
      .upsert({ key: type, value });

    if (!error) {
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-500"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-600"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setValue(initialValue);
                  setIsEditing(false);
                }}
                className="text-red-500 hover:text-red-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        ) : (
          <p className="mt-2 text-sm text-gray-500">{value}</p>
        )}
      </div>
    </div>
  );
}
