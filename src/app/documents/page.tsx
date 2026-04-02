import { SAFETY_DOCUMENTS, DRAWING_TYPES, DRAWING_PREFIXES, CHARGER_MANUFACTURERS } from "@/lib/constants";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">書類管理</h1>
        <p className="text-sm text-gray-500">施工関連書類・安全書類・図面テンプレート</p>
      </div>

      {/* 安全書類 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">安全書類一覧（{SAFETY_DOCUMENTS.length}種類）</h2>
        <div className="grid grid-cols-2 gap-2">
          {SAFETY_DOCUMENTS.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">{doc.id}</span>
                <span className="text-sm">{doc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{doc.frequency}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${doc.required === "必須" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>{doc.required}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 図面種別 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">図面種別（4種類 × 3段階）</h2>
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
        <p className="text-xs text-gray-400 mt-3">対応CADフォーマット: DWG, DXF, JWW, TFS</p>
      </div>

      {/* 施工関連書類 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">施工関連規則・要領</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Terra Charge工事要領【第2.1版】", type: "工事規則" },
            { name: "Terra Charge急速工事要領【第0.2版】", type: "急速充電器" },
            { name: "Terra Charge 工事規則", type: "工事規則" },
            { name: "工事完了報告規則", type: "完了報告" },
            { name: "現地調査規則【第6版】", type: "現場調査" },
            { name: "EV充電設備新設工事 標準仕様書Ver1", type: "標準仕様" },
            { name: "図面作成マニュアル（2026/3/26改訂）", type: "図面" },
            { name: "図面チェックリスト（2026/2/26改訂）", type: "図面" },
          ].map((doc) => (
            <div key={doc.name} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{doc.type}</span>
              <span className="text-sm text-gray-700">{doc.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* メーカー別仕様書 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">充電器仕様書・断面図</h2>
        <div className="grid grid-cols-3 gap-3">
          {CHARGER_MANUFACTURERS.map((m) => (
            <div key={m.value} className="border rounded-lg p-3">
              <h3 className="font-medium text-sm mb-1">{m.label}</h3>
              <div className="flex flex-wrap gap-1">
                {m.models.map((model) => (
                  <span key={model} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{model}</span>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">仕様書</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">断面図</span>
                <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">CAD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アプリマニュアル */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">外部ツールマニュアル</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Kizuku スターターガイド", desc: "工事管理アプリの基本操作" },
            { name: "Kizuku 協力会社アカウント追加", desc: "アカウント追加手順" },
            { name: "Toyokumo 導入マニュアル", desc: "フォーム・ワークフロー管理" },
            { name: "TerraCharge アプリ 立ち上げ試験", desc: "6kW / 3kW / 急速 各マニュアル" },
            { name: "LED表示マニュアル", desc: "充電器LED状態表示" },
            { name: "Toyokumo 図面提出マニュアル", desc: "R8図面フロー" },
          ].map((m) => (
            <div key={m.name} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
