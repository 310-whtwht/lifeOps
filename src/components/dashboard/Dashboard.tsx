"use client";

import { MetaInfoCard } from "./MetaInfoCard";
import { HabitCheckCard } from "./HabitCheckCard";
import { TodoList } from "./TodoList";

interface DashboardProps {
  metaInfo: {
    kgi: string;
    vps: string;
  };
}

export function Dashboard({ metaInfo }: DashboardProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetaInfoCard type="kgi" title="人生KGI" initialValue={metaInfo.kgi} />
        <MetaInfoCard
          type="vps"
          title="バリューポジションステートメント"
          initialValue={metaInfo.vps}
        />
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">今月のKPI</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">目標 vs 実績</p>
              {/* KPIグラフをここに追加予定 */}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">習慣チェック</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <HabitCheckCard title="英語学習" habitKey="english_study" />
          <HabitCheckCard title="筋トレ" habitKey="exercise" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">ToDoタスク</h2>
        <div className="mt-4">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
