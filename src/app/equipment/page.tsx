import { CHARGER_MANUFACTURERS, CHARGER_CATEGORIES, CUBICLE_SPECS, SAMPLE_PROJECTS } from "@/lib/constants";

export default function EquipmentPage() {
  const chargerSummary = CHARGER_CATEGORIES.map((cat) => {
    const ps = SAMPLE_PROJECTS.filter((p) => p.chargerCategory === cat.label);
    return { ...cat, count: ps.length, qty: ps.reduce((s, p) => s + p.quantity, 0) };
  }).filter((c) => c.count > 0);

  const mfrSummary = CHARGER_MANUFACTURERS.map((m) => {
    const ps = SAMPLE_PROJECTS.filter((p) => p.chargerManufacturer === m.label);
    return { ...m, count: ps.length, qty: ps.reduce((s, p) => s + p.quantity, 0) };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">充電器管理</h1>
        <p className="text-sm text-gray-500">{CHARGER_MANUFACTURERS.length}メーカー・{CHARGER_CATEGORIES.length}カテゴリ</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {chargerSummary.map((c) => (
          <div key={c.value} className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500">{c.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-700">{c.qty}</span>
              <span className="text-xs text-gray-400">台 / {c.count}案件</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">メーカー別一覧</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">メーカー</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">対応モデル</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">案件数</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">総台数</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mfrSummary.map((m) => (
              <tr key={m.value} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.label}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {m.models.map((model) => <span key={model} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{model}</span>)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{m.count}</td>
                <td className="px-4 py-3 text-center font-medium">{m.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">キュービクル仕様</h2>
        <div className="grid grid-cols-2 gap-4">
          {CUBICLE_SPECS.map((cb) => (
            <div key={cb.manufacturer} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{cb.manufacturer}</h3>
              <div className="flex gap-1 flex-wrap">
                {cb.capacities.map((c) => <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{c}</span>)}
                {cb.vctOptions.map((v) => <span key={v} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{v}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-800 mb-2">デバイスID管理</h3>
        <div className="grid grid-cols-2 gap-4 text-xs text-blue-700">
          <div>
            <p className="font-medium mb-1">新モデル（QR貼付済み）</p>
            <ul className="list-disc pl-4 space-y-0.5"><li>共有シートでデバイスID確認</li><li>梱包箱と照合、取違え厳禁</li></ul>
          </div>
          <div>
            <p className="font-medium mb-1">23年モデル（現場貼付）</p>
            <ul className="list-disc pl-4 space-y-0.5"><li>QRシールは別送</li><li>設置場所指示書に従い整合性確認</li><li>貼り直し厳禁</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}
