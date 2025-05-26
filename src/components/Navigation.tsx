"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  FlagIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  TagIcon,
  AcademicCapIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const navigation = [
  {
    name: "ダッシュボード",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "コース",
    href: "/courses",
    icon: AcademicCapIcon,
  },
  {
    name: "戦略ドキュメント",
    href: "/strategy",
    icon: BookOpenIcon,
  },
  {
    name: "講座管理",
    href: "/courses",
    icon: BookOpenIcon,
  },
  {
    name: "マイルストーン",
    href: "/milestones",
    icon: FlagIcon,
  },
  {
    name: "KPI",
    href: "/kpi",
    icon: ChartBarIcon,
  },
  {
    name: "KDI",
    href: "/tasks",
    icon: ChartBarIcon,
  },
  {
    name: "週間リソースプランナー",
    href: "/weekly-plan",
    icon: CalendarIcon,
  },
  {
    name: "ジャーナル",
    href: "/journal",
    icon: PencilSquareIcon,
  },
  {
    name: "タグ管理",
    href: "/tags",
    icon: TagIcon,
  },
  {
    name: "設定",
    href: "/settings",
    icon: Cog6ToothIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                LifeOps
              </Link>
            </div>
            {/* PC用ナビ */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 flex-nowrap">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="mr-1 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          {/* モバイル用ハンバーガー */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="メニューを開く"
            >
              {/* ハンバーガーアイコン */}
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
        {/* モバイルメニュー */}
        <div
          className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen
              ? "max-h-screen opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="mr-2 h-5 w-5 inline" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
