"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DRAWING_TYPES, DRAWING_PREFIXES, SAMPLE_PROJECTS, STATUS_COLORS, INSTALLATION_PATTERNS } from "@/lib/constants";

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
          {/* 図面種別×ライフサイクル */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-bold mb-4">図面種別（4種 × 3段階）</h2>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 font-medium text-gray-600">図面種別</th>
                  {Object.entries(DRAWING_PREFIXES).map(([key, prefix]) => (
                    <th key={key} className="text-center py-2 font-medium text-gray-600">{prefix || "申請時"}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {DRAWING_TYPES.map((dt) => (
                  <tr key={dt}>
                    <td className="py-2 text-gray-900">{dt}</td>
                    {Object.entries(DRAWING_PREFIXES).map(([key, prefix]) => (
                      <td key={key} className="py-2 text-center text-xs text-gray-500">{prefix}{dt}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-3">対応CAD: DWG, DXF, JWW, TFS | ファイル名: 案件名_図面名称_データ加工日</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 断面図テンプレート + 設置パターン */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-bold mb-4">断面図テンプレート</h2>
              <div className="space-y-2">
                {[
                  { type: "3kWコンセント", patterns: ["アンカー", "ケミカルアンカー", "基礎", "壁面"] },
                  { type: "6kW 日東工業", patterns: ["アンカー", "ASアンカー", "ケミカルアンカー", "基礎(@500)", "基礎(@600)", "壁面"] },
                  { type: "6kW 河村電器", patterns: ["ASアンカー", "アンカー", "基礎", "壁面"] },
                  { type: "急速充電器 QB基礎", patterns: ["共通", "150kVA VCTあり", "150kVA VCTなし"] },
                ].map((t) => (
                  <div key={t.type} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">{t.type}</p>
                    <div className="flex flex-wrap gap-1">
                      {t.patterns.map((p) => (
                        <span key={p} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 図面チェックリスト */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-bold mb-4">図面チェックリスト</h2>
              <div className="space-y-2">
                {[
                  "充電器設置位置が正しいか",
                  "ケーブル長が充電スペースに届くか",
                  "断面図の基礎寸法が正しいか（R8: H400）",
                  "案内板の種別・サイズが正しいか",
                  "配線ルートに障害物がないか",
                  "電気系統図のブレーカ容量が正しいか",
                  "縮尺・寸法線が記載されているか",
                  "図面枠フォーマットが正しいか",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-gray-50">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 案件別図面提出状況 */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b"><h2 className="font-bold">案件別 図面状況</h2></div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">案件</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">充電器</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">ステータス</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">見取図</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">平面図</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">配線ルート</th>
                  <th className="text-center px-4 py-2 font-medium text-gray-600">電気系統</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLE_PROJECTS.filter((p) => p.status !== "キャンセル" && p.status !== "延期").map((p) => {
                  const hasDrawings = p.reportStatus === "承認済み" || p.reportStatus === "提出済み";
                  const inProgress = ["施工中", "着工Ready", "安全書類提出済み"].includes(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                        <div className="text-[10px] text-gray-400">{p.caseId}</div>
                      </td>
                      <td className="px-4 py-2 text-gray-700">{p.chargerCategory}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      {DRAWING_TYPES.map((dt) => (
                        <td key={dt} className="px-4 py-2 text-center">
                          {hasDrawings ? <span className="text-green-600">&#10003;</span> : inProgress ? <span className="text-blue-500">作成中</span> : <span className="text-gray-300">-</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
