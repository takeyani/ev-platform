import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS, CONSTRUCTION_FLOW_STEPS } from "@/lib/constants";
import { checkReadyStatus, getMaterialStatus, getDeadlineAlerts } from "@/lib/automation";

export default function ConstructionPage() {
  const activeProjects = SAMPLE_PROJECTS.filter(
    (p) => !["キャンセル", "延期", "請求済み", "交付決定待ち"].includes(p.status)
  );
  const inProgress = activeProjects.filter((p) => p.status === "施工中");
  const ready = activeProjects.filter((p) => p.status === "着工Ready");
  const preSafety = activeProjects.filter((p) => ["施工発注済み", "日程調整中", "着工前会議完了", "安全書類提出済み"].includes(p.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">施工管理</h1>
        <p className="text-sm text-gray-500">工事要領に基づく施工進捗管理</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "工事前準備", value: preSafety.length, color: "text-amber-600" },
          { label: "着工Ready", value: ready.length, color: "text-lime-600" },
          { label: "施工中", value: inProgress.length, color: "text-emerald-600" },
          { label: "全アクティブ", value: activeProjects.length, color: "text-gray-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 施工中案件 */}
      {inProgress.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-emerald-50"><h2 className="font-bold text-emerald-800">施工中案件</h2></div>
          <div className="divide-y">
            {inProgress.map((p) => {
              const alerts = getDeadlineAlerts(p, "2026-04-02");
              return (
                <div key={p.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                      <div className="text-xs text-gray-400 mt-0.5">{p.caseId} | {p.contractor} | {p.chargerCategory} x{p.quantity}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div>着工: {p.actualStartDate || p.startDate}</div>
                      <div>完工予定: {p.endDate}</div>
                    </div>
                  </div>
                  {alerts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {alerts.map((a, i) => (
                        <div key={i} className={`text-xs ${a.level === "danger" ? "text-red-600" : "text-amber-600"}`}>⚠ {a.message}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 着工Ready案件 */}
      {ready.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-lime-50"><h2 className="font-bold text-lime-800">着工Ready案件</h2></div>
          <div className="divide-y">
            {ready.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                  <div className="text-xs text-gray-400">{p.caseId} | {p.contractor} | 着工: {p.startDate}</div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Ready {p.readyConfirmDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工事前準備案件 - Ready判定 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">工事前準備 - 着工Ready判定</h2></div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">案件</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">ステータス</th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">Ready判定</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">不足項目</th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">資材</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {preSafety.map((p) => {
              const readyCheck = checkReadyStatus(p);
              const mat = getMaterialStatus(p);
              const missing = readyCheck.items.filter((i) => !i.ok);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                    <div className="text-[10px] text-gray-400">{p.caseId}</div>
                  </td>
                  <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-2 text-center">
                    {readyCheck.status === "Ready" ? (
                      <span className="text-green-600 font-bold">Ready</span>
                    ) : (
                      <span className="text-red-500">{missing.length}件不足</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {missing.map((m) => <span key={m.label} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{m.label}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {mat.allConfirmed ? <span className="text-green-600 font-bold">&#10003;</span> : <span className="text-amber-500">未完</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Kizuku連携ガイド */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-blue-800 mb-2">工事中の連絡（Kizuku）</h3>
        <div className="grid grid-cols-3 gap-4 text-xs text-blue-700">
          <div><p className="font-medium">1. 作業開始連絡</p><p>当日の作業内容をKizukuで連絡</p></div>
          <div><p className="font-medium">2. 工事写真提出</p><p>適宜Kizukuにアップロード</p></div>
          <div><p className="font-medium">3. 終了連絡</p><p>目安時間＋終了時にKizukuで連絡</p></div>
        </div>
        <p className="text-[10px] text-blue-500 mt-2">※20分以上応答がない場合は案件担当へ電話 / 変更発生時は直ちにテラへ連絡し工事中断</p>
      </div>
    </div>
  );
}
