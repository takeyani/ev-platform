import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "EV充電器施工管理プラットフォーム",
  description: "Terra Charge EV充電器設置工事の業務管理システム",
};

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
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-white border-r flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-lg font-bold text-emerald-700">EV Platform</h1>
              <p className="text-xs text-gray-500 mt-1">充電器施工管理システム</p>
            </div>
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
