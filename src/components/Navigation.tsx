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
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "ダッシュボード",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "戦略ドキュメント",
    href: "/strategy",
    icon: BookOpenIcon,
  },
  {
    name: "KPI",
    href: "/kpi",
    icon: ChartBarIcon,
  },
  {
    name: "マイルストーン",
    href: "/milestones",
    icon: FlagIcon,
  },
  {
    name: "ジャーナル",
    href: "/journal",
    icon: PencilSquareIcon,
  },
  {
    name: "設定",
    href: "/settings",
    icon: Cog6ToothIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                LifeOps
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
