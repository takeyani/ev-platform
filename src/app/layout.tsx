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

// EV充電プラグのSVGアイコン
function EvChargeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="16" height="24" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="8" y="4" width="16" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="14" r="2" fill="currentColor" />
      <circle cx="19" cy="14" r="2" fill="currentColor" />
      <rect x="14" y="20" width="4" height="4" rx="1" fill="currentColor" />
      <path d="M16 0V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 0V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 0V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
      <body className="text-gray-900">
        {/* モバイルヘッダー */}
        <header className="lg:hidden sticky top-0 z-50 bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EvChargeIcon className="w-6 h-6 text-emerald-300" />
            <h1 className="text-base font-bold">EV Platform</h1>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-emerald-700"
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
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMenuOpen(false)} />
        )}

        <div className="flex min-h-screen">
          {/* サイドバー: ダークグリーンEVテーマ */}
          <aside className={`
            fixed lg:sticky top-0 left-0 z-50 h-screen w-52 sidebar-gradient flex flex-col
            transition-transform duration-200
            lg:translate-x-0
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            {/* PC: ロゴヘッダー */}
            <div className="p-5 border-b border-emerald-600/30 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <EvChargeIcon className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white">EV Platform</h1>
                  <p className="text-[10px] text-emerald-300/70">充電器施工管理システム</p>
                </div>
              </div>
            </div>
            {/* モバイル: メニューヘッダー */}
            <div className="p-4 border-b border-emerald-600/30 lg:hidden flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EvChargeIcon className="w-5 h-5 text-emerald-300" />
                <h1 className="text-base font-bold text-white">メニュー</h1>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-1 rounded hover:bg-emerald-700 text-emerald-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* ナビゲーション */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-emerald-400/20 text-white"
                        : "text-emerald-100/70 hover:bg-emerald-400/10 hover:text-white"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {/* フッター */}
            <div className="p-4 border-t border-emerald-600/30 hidden lg:block">
              <p className="text-[10px] text-emerald-400/50 text-center">Terra Charge</p>
              <p className="text-[9px] text-emerald-400/30 text-center mt-0.5">すべての人とEVにエネルギーを。</p>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-5">{children}</main>
        </div>
      </body>
    </html>
  );
}
