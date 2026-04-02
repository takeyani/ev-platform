"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "📊" },
  { href: "/flow", label: "業務フロー", icon: "🔄" },
  { href: "/projects", label: "案件管理", icon: "📋" },
  { href: "/site-surveys", label: "現場調査", icon: "🔍" },
  { href: "/drawings", label: "図面管理", icon: "📐" },
  { href: "/construction", label: "施工管理", icon: "🔧" },
  { href: "/equipment", label: "充電器管理", icon: "⚡" },
  { href: "/documents", label: "書類管理", icon: "📄" },
  { href: "/schedule", label: "スケジュール", icon: "📅" },
  { href: "/safety", label: "安全管理", icon: "🦺" },
  { href: "/reports", label: "完了報告", icon: "✅" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="ja">
      <head>
        <title>EV充電器施工管理</title>
        <meta name="description" content="Terra Charge EV充電器設置工事の業務管理システム" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        {/* モバイルヘッダー */}
        <header className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-emerald-700">EV Platform</h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="メニュー"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* モバイルメニューオーバーレイ */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
        )}

        <div className="flex min-h-screen">
          {/* サイドバー: PC常時表示 / モバイルスライドイン */}
          <aside className={`
            fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r flex flex-col
            transition-transform duration-200
            lg:translate-x-0
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="p-4 border-b hidden lg:block">
              <h1 className="text-lg font-bold text-emerald-700">EV Platform</h1>
              <p className="text-xs text-gray-500 mt-1">充電器施工管理システム</p>
            </div>
            <div className="p-4 border-b lg:hidden flex items-center justify-between">
              <h1 className="text-base font-bold text-emerald-700">メニュー</h1>
              <button onClick={() => setMenuOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
