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
      <body className="text-gray-900" style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfeff, #f0f9ff)", backgroundAttachment: "fixed" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* 左サイドバー: 常時表示 */}
          <aside style={{ width: 200, minWidth: 200, background: "linear-gradient(180deg, #064e3b, #065f46, #047857)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflow: "auto" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>⚡ EV Platform</div>
              <div style={{ color: "rgba(167,243,208,0.6)", fontSize: 10 }}>充電器施工管理</div>
            </div>
            <nav style={{ flex: 1, padding: "6px 8px" }}>
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "7px 10px", marginBottom: 1, borderRadius: 6,
                      fontSize: 12, fontWeight: 500, textDecoration: "none",
                      color: active ? "white" : "rgba(236,253,245,0.65)",
                      background: active ? "rgba(52,211,153,0.2)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 9, color: "rgba(167,243,208,0.35)", textAlign: "center" }}>
              Terra Charge
            </div>
          </aside>

          {/* 右メインコンテンツ */}
          <main style={{ flex: 1, padding: 16, minWidth: 0, overflow: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
