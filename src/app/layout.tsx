"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserProfile, signOut, getRoleLabel, type UserProfile } from "@/lib/auth";
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  useEffect(() => { getUserProfile().then(setProfile).catch(() => {}); }, []);

  return (
    <html lang="ja">
      <head>
        <title>EV充電器施工管理</title>
        <meta name="description" content="Terra Charge EV充電器設置工事の業務管理システム" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="text-gray-900" style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfeff, #f0f9ff)", backgroundAttachment: "fixed" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* モバイルヘッダー */}
          <div className="mobile-header">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="メニュー" style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>☰</button>
            <span style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>⚡ EV Platform</span>
          </div>
          {/* オーバーレイ */}
          {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}
          {/* 左サイドバー */}
          <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} style={{ background: "linear-gradient(180deg, #064e3b, #065f46, #047857)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>⚡ EV Platform</div>
              <div style={{ color: "rgba(167,243,208,0.6)", fontSize: 10 }}>充電器施工管理</div>
            </div>
            <nav role="navigation" aria-label="メインナビゲーション" style={{ flex: 1, padding: "6px 8px" }}>
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
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
            <div style={{ padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              {profile ? (
                <div>
                  <div style={{ fontSize: 9, color: "rgba(167,243,208,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.displayName || profile.email}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: 8, color: "rgba(167,243,208,0.4)", background: "rgba(255,255,255,0.08)", padding: "1px 4px", borderRadius: 3 }}>{getRoleLabel(profile.role)}</span>
                    <button onClick={async () => { await signOut(); setProfile(null); }} aria-label="ログアウト" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(167,243,208,0.5)", fontSize: 9, borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}>ログアウト</button>
                  </div>
                </div>
              ) : (
                <Link href="/login" style={{ display: "block", textAlign: "center", fontSize: 10, color: "rgba(167,243,208,0.5)", textDecoration: "none" }}>ログイン</Link>
              )}
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
