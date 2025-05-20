"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "ダッシュボード", href: "/dashboard" },
  { name: "講座管理", href: "/courses" },
  { name: "タスク管理", href: "/tasks" },
  { name: "KPIトラッカー", href: "/kpi" },
  { name: "マイルストーン", href: "/milestones" },
  { name: "戦略ドキュメント", href: "/strategy" },
  { name: "ジャーナル", href: "/journal" },
  { name: "設定", href: "/settings" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                MyPJ
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
