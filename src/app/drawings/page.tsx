"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const DrawingEditor = dynamic(() => import("@/components/DrawingEditor"), { ssr: false });
const CrossSectionViewer = dynamic(() => import("@/components/CrossSectionViewer"), { ssr: false });
const AutoDrawingGenerator = dynamic(() => import("@/components/AutoDrawingGenerator"), { ssr: false });

const tabs = [
  { id: "auto", label: "自動生成", icon: "🤖" },
  { id: "editor", label: "配置図エディタ", icon: "📐" },
  { id: "section", label: "断面図ビューア", icon: "📏" },
  { id: "manage", label: "図面管理", icon: "📋" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function DrawingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("auto");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">図面管理</h1>
        <p className="text-sm text-gray-500 mt-1">EV補助金申請用図面の自動生成・作成・チェック・提出管理</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auto Generate */}
      {activeTab === "auto" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-emerald-800">自動図面生成</h3>
            <p className="text-xs text-emerald-700 mt-1">
              駐車場の台数・充電器種別・レイアウトを指定するだけで、配置図を自動生成します。
              生成後にPNG画像としてダウンロード可能です。
            </p>
          </div>
          <AutoDrawingGenerator />
        </div>
      )}

      {/* Manual Editor */}
      {activeTab === "editor" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-blue-800">配置図エディタ</h3>
            <p className="text-xs text-blue-700 mt-1">
              充電器・キュービクル・案内板・駐車区画をドラッグ&ドロップで自由に配置できます。
              要素の選択→回転・リサイズ・削除が可能です。
            </p>
          </div>
          <DrawingEditor />
        </div>
      )}

      {/* Cross Section */}
      {activeTab === "section" && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-indigo-800">断面図ビューア</h3>
            <p className="text-xs text-indigo-700 mt-1">
              充電器種別ごとの基礎断面図をリアルタイムで描画表示します。
              砕石・コンクリート・根入れの各層と寸法を確認できます。
            </p>
          </div>
          <CrossSectionViewer />
        </div>
      )}

      {/* Management */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">図面作成チェックリスト</h2>
              <div className="space-y-2">
                {[
                  { item: "配置図（充電器設置位置）", checked: true },
                  { item: "断面図（充電器基礎）", checked: true },
                  { item: "案内板配置図", checked: false },
                  { item: "電気系統図", checked: false },
                  { item: "配管経路図", checked: false },
                  { item: "バリアフリー対応確認", checked: false },
                ].map((c) => (
                  <label key={c.item} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-gray-50">
                    <input type="checkbox" defaultChecked={c.checked} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className={c.checked ? "text-gray-400 line-through" : "text-gray-900"}>{c.item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">充電器断面図テンプレート</h2>
              <div className="space-y-2">
                {[
                  { type: "3kWコンセント", formats: "PDF / CAD" },
                  { type: "6kW普通充電器（日東工業）", formats: "PDF / CAD" },
                  { type: "6kW普通充電器（河村電器）", formats: "PDF / CAD" },
                  { type: "急速充電器 QB基礎", formats: "PDF / CAD" },
                ].map((t) => (
                  <div key={t.type} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-900">{t.type}</span>
                    <span className="text-xs text-gray-500">{t.formats}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-bold">図面提出状況</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">案件名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">図面種類</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">作成者</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">提出日</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">○○マンション</td>
                  <td className="px-4 py-3 text-gray-700">配置図・断面図</td>
                  <td className="px-4 py-3 text-gray-700">山田設計</td>
                  <td className="px-4 py-3"><span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">承認済み</span></td>
                  <td className="px-4 py-3 text-gray-500">2026/03/15</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">△△商業施設</td>
                  <td className="px-4 py-3 text-gray-700">配置図・電気系統図</td>
                  <td className="px-4 py-3 text-gray-700">自動生成</td>
                  <td className="px-4 py-3"><span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">レビュー中</span></td>
                  <td className="px-4 py-3 text-gray-500">2026/03/28</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
