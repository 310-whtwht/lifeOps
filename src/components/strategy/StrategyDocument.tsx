"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Strategy, StrategyReview } from "@/types/strategy";

export function StrategyDocument() {
  const [kgi, setKGI] = useState<Strategy[]>([]);
  const [kpi, setKPI] = useState<Strategy[]>([]);
  const [kdi, setKDI] = useState<Strategy[]>([]);
  const [blockers, setBlockers] = useState<Strategy[]>([]);
  const [nextStrategy, setNextStrategy] = useState<Strategy[]>([]);
  const [reviews, setReviews] = useState<StrategyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const { data: strategies, error: strategiesError } = await supabase
        .from("strategies")
        .select("*")
        .order("created_at", { ascending: false });

      if (strategiesError) throw strategiesError;

      const { data: strategyReviews, error: reviewsError } = await supabase
        .from("strategy_reviews")
        .select("*")
        .order("date", { ascending: false });

      if (reviewsError) throw reviewsError;

      if (strategies) {
        setKGI(strategies.filter((s) => s.category === "kgi"));
        setKPI(strategies.filter((s) => s.category === "kpi"));
        setKDI(strategies.filter((s) => s.category === "kdi"));
        setBlockers(strategies.filter((s) => s.category === "blocker"));
        setNextStrategy(
          strategies.filter((s) => s.category === "next_strategy")
        );
      }

      if (strategyReviews) {
        setReviews(strategyReviews);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
    } finally {
      setLoading(false);
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
    <div className="space-y-8">
      {/* 人生KGI */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 人生KGIの再確認
        </h2>
        <div className="prose max-w-none">
          {kgi.map((item) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 現在のKPI */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📈 現在のKPIの振り返り
        </h2>
        <div className="prose max-w-none">
          {kpi.map((item) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 戦術レベル（KDI） */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 戦術レベル（KDI）の評価
        </h2>
        <div className="prose max-w-none">
          {kdi.map((item) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ブロッカー・課題 */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🚧 ブロッカー・課題メモ
        </h2>
        <div className="prose max-w-none">
          {blockers.map((item) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 次期の修正戦略 */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ♻️ 次期に向けての修正戦略
        </h2>
        <div className="prose max-w-none">
          {nextStrategy.map((item) => (
            <div key={item.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="mt-2 text-gray-600 whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 戦略レビュー履歴 */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔁 戦略レビュー履歴
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  概要
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  次の戦術方針
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.summary}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.next_strategy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
