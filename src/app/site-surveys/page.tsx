import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS } from "@/lib/constants";

export default function SiteSurveysPage() {
  // 現調ステータスはpreConstructionMeetingDateの有無で簡易判定
  const projects = SAMPLE_PROJECTS.filter((p) => p.status !== "キャンセル" && p.status !== "延期");
  const surveyed = projects.filter((p) => p.preConstructionMeetingDate);
  const pending = projects.filter((p) => !p.preConstructionMeetingDate && p.status !== "請求済み" && p.status !== "検収完了");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">現場調査</h1>
        <p className="text-sm text-gray-500">Terra Charge 現地調査規則【第6版】に基づく現場調査管理</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs text-gray-500">調査待ち</p>
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs text-gray-500">調査済み（着工前会議完了）</p>
          <p className="text-2xl font-bold text-emerald-600">{surveyed.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs text-gray-500">全案件</p>
          <p className="text-2xl font-bold text-gray-600">{projects.length}</p>
        </div>
      </div>

      {/* R8現調フロー */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">現場調査フロー（R8年度 Toyokumo連携）</h2>
        <div className="space-y-3">
          {[
            { step: "1", label: "Toyokumo kViewerで案件選択", desc: "R8Nev現地調査ページから案件IDで検索・選択" },
            { step: "2", label: "現調日時を入力", desc: "FormBridgeで現調日時を回答・送信" },
            { step: "3", label: "現地訪問・調査実施", desc: "駐車場レイアウト・電源設備・配管経路・石綿調査" },
            { step: "4", label: "写真撮影", desc: "電源盤全体・ブレーカ容量・配線ルート・コア抜き箇所・駐車場全景" },
            { step: "5", label: "現調報告書作成・提出", desc: "Kizuku報告書機能で作成→承認依頼" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">{item.step}</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 現調対象の撮影ポイント */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">現場調査 撮影ポイント</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            "電源元主幹ブレーカのR相T相電流",
            "電源盤全体写真・盤名",
            "スマートメーター接写",
            "主幹ブレーカ容量・RT相電流値",
            "分岐ブレーカ用途の名称・仕様接写",
            "配線ルート",
            "コア抜き箇所",
            "架空距離（3kW: 0m / 6kW: +15m程度）",
            "埋設配管（架空と同じ）",
            "看板（不特定多数者利用の商業施設のみ）",
            "駐車場写真を個別と全体",
            "ポール式の場合、基礎設置床面",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5 text-xs">
              <span className="w-3 h-3 rounded border border-gray-300 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 案件別テーブル */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">案件別 現調状況</h2></div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">案件</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">都道府県</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">充電器種別</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">ステータス</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">着工前会議日</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">現調会社</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                  <div className="text-[10px] text-gray-400">{p.caseId} / {p.subsidyType}</div>
                </td>
                <td className="px-4 py-2 text-gray-500">{p.prefecture}</td>
                <td className="px-4 py-2 text-gray-700">{p.chargerCategory}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-4 py-2">
                  {p.preConstructionMeetingDate ? (
                    <span className="text-green-600">{p.preConstructionMeetingDate}</span>
                  ) : (
                    <span className="text-gray-300">未実施</span>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-500">{p.contractor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toyokumo連携ガイド */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-teal-800 mb-2">Toyokumo連携（R8現調フロー）</h3>
        <div className="grid grid-cols-3 gap-4 text-xs text-teal-700">
          <div>
            <p className="font-medium">kViewer</p>
            <p>R8Nev現地調査ページで案件を検索・選択</p>
          </div>
          <div>
            <p className="font-medium">FormBridge</p>
            <p>現調日時の入力・回答送信</p>
          </div>
          <div>
            <p className="font-medium">Kizuku報告書</p>
            <p>現調報告書の承認依頼を提出</p>
          </div>
        </div>
      </div>
    </div>
  );
}
