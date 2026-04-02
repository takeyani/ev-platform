export default function SiteSurveysPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">現場調査</h1>
      <p className="text-sm text-gray-500">Terra Charge 現地調査規則に基づく現場調査の管理</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">調査待ち</p>
          <p className="text-2xl font-bold text-amber-600">8</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">調査済み</p>
          <p className="text-2xl font-bold text-emerald-600">42</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">要再調査</p>
          <p className="text-2xl font-bold text-red-600">2</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">現場調査フロー（R8年度）</h2>
        <div className="space-y-3">
          {[
            { step: "1", label: "案件情報確認", desc: "施工場所・充電器種別・設置台数の確認" },
            { step: "2", label: "現地訪問", desc: "駐車場レイアウト・電源設備・配管経路の確認" },
            { step: "3", label: "写真撮影", desc: "重要ポイントチェックリストに基づく撮影" },
            { step: "4", label: "報告書作成", desc: "現地調査報告書フォーマットへの記入" },
            { step: "5", label: "報告書提出", desc: "KIZUKU経由でTerra Chargeへ提出" },
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">案件名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">調査日</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">調査員</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">写真枚数</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">○○マンション</td>
              <td className="px-4 py-3 text-gray-700">2026/03/20</td>
              <td className="px-4 py-3 text-gray-700">田中太郎</td>
              <td className="px-4 py-3"><span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">完了</span></td>
              <td className="px-4 py-3 text-gray-700">32枚</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">△△商業施設</td>
              <td className="px-4 py-3 text-gray-700">2026/03/25</td>
              <td className="px-4 py-3 text-gray-700">佐藤花子</td>
              <td className="px-4 py-3"><span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">完了</span></td>
              <td className="px-4 py-3 text-gray-700">28枚</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
