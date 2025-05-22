"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Tag } from "@/types/tag";

interface TagListProps {
  tagIds: string[];
}

export function TagList({ tagIds }: TagListProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (tagIds.length > 0) {
      fetchTags();
    } else {
      setLoading(false);
    }
  }, [tagIds]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .in("id", tagIds);

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-6">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          <span
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
        </span>
      ))}
    </div>
  );
}
