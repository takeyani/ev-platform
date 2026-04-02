import Link from "next/link";
import {
  SAMPLE_PROJECTS,
  STATUS_COLORS,
  CONSTRUCTION_FLOW_STEPS,
  INSPECTION_REQUIREMENTS,
  type ProjectStatus,
} from "@/lib/constants";
import { getDashboardSummary, checkReadyStatus, getMaterialStatus } from "@/lib/automation";

export default function Dashboard() {
  const projects = SAMPLE_PROJECTS;
  const summary = getDashboardSummary(projects, "2026-04-02");

  const phaseCards = [
    { label: "工事前", value: summary.byPhase.pre, color: "bg-amber-500", text: "text-amber-700" },
    { label: "着工Ready", value: summary.readyCount, color: "bg-lime-500", text: "text-lime-700" },
    { label: "施工中", value: summary.byPhase.active, color: "bg-emerald-500", text: "text-emerald-700" },
    { label: "工事後", value: summary.byPhase.post, color: "bg-purple-500", text: "text-purple-700" },
    { label: "アラート", value: summary.alertCount, color: summary.alertCount > 0 ? "bg-red-500" : "bg-gray-300", text: summary.alertCount > 0 ? "text-red-700" : "text-gray-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-gray-500 mt-1">Terra Charge EV充電器施工管理</p>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-5 gap-4">
        {phaseCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* アラートパネル */}
      {summary.alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h2 className="text-sm font-bold text-red-800 mb-2">期限アラート ({summary.alerts.length}件)</h2>
          <div className="space-y-1">
            {summary.alerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${a.level === "danger" ? "text-red-700" : "text-amber-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.level === "danger" ? "bg-red-500" : "bg-amber-500"}`} />
                <Link href={`/projects/${a.projectId}`} className="hover:underline font-medium">{a.projectName}</Link>
                <span className="text-gray-500">-</span>
                <span>{a.message}</span>
                <span className="text-xs text-gray-400 ml-auto">{a.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工事全体フロー */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-3">工事全体フロー</h2>
        <div className="flex items-start gap-1 overflow-x-auto pb-1">
          {CONSTRUCTION_FLOW_STEPS.map((item, i) => (
            <div key={item.step} className="flex items-center gap-1 flex-shrink-0">
              <div className="text-center min-w-[72px]">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mx-auto">{item.step}</div>
                <p className="text-[10px] font-medium text-gray-900 mt-1 leading-tight">{item.label}</p>
                <p className="text-[8px] text-gray-400 leading-tight">{item.sub}</p>
              </div>
              {i < CONSTRUCTION_FLOW_STEPS.length - 1 && <span className="text-gray-300 text-xs mt-[-12px]">&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 案件テーブル + 資材/Ready自動判定 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="font-bold">案件一覧</h2>
          <Link href="/projects/new" className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-sm font-medium">新規登録</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600">ID</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">補助金</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">案件名</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">充電器</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">台数</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">施工会社</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">着工予定</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">ステータス</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">Ready</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">資材</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                const mat = getMaterialStatus(p);
                return (
                  <tr key={p.id} className={`hover:bg-gray-50 ${p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}`}>
                    <td className="px-3 py-2 font-mono text-gray-400">{p.caseId}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{p.subsidyType}</td>
                    <td className="px-3 py-2">
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">{p.name}</Link>
                      <div className="text-[10px] text-gray-400">{p.prefecture} {p.applicationCategory}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{p.chargerCategory}</td>
                    <td className="px-3 py-2 text-gray-700 text-center">{p.quantity}</td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{p.contractor}</td>
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{p.startDate || "-"}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {ready.status === "Ready" ? (
                        <span className="text-green-600 font-bold">&#10003;</span>
                      ) : p.status === "請求済み" || p.status === "検収完了" ? (
                        <span className="text-gray-300">-</span>
                      ) : (
                        <span className="text-red-400 text-[10px]">{ready.items.filter(i => !i.ok).length}件不足</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {mat.allConfirmed ? (
                        <span className="text-green-600 font-bold">&#10003;</span>
                      ) : !p.startDate ? (
                        <span className="text-gray-300">-</span>
                      ) : (
                        <span className="text-amber-500 text-[10px]">未完</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 下部パネル */}
      <div className="grid grid-cols-3 gap-4">
        {/* 検収リマインダー */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 mb-3">検収締め</h3>
          <div className="space-y-2 text-xs">
            {[
              { label: "毎月20日", desc: "図面提出＋報告書承認依頼", color: "text-red-500" },
              { label: "毎月25日", desc: "承認完了→請求対象確定", color: "text-red-500" },
              { label: "月初2営業日", desc: "請求書PDF送付", color: "text-amber-500" },
              { label: "完工後3営業日", desc: "完了報告書提出", color: "text-amber-500" },
            ].map((r) => (
              <div key={r.label} className="flex gap-2">
                <span className={`font-bold ${r.color} w-20 flex-shrink-0`}>{r.label}</span>
                <span className="text-gray-600">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 外部ツール */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 mb-3">外部ツール</h3>
          <div className="space-y-2">
            {[
              { name: "Kizuku", desc: "工事連絡・写真・報告書・安全書類", bg: "bg-blue-50", text: "text-blue-700" },
              { name: "Toyokumo", desc: "現調フォーム・進捗KPI・図面提出", bg: "bg-teal-50", text: "text-teal-700" },
              { name: "進捗シート", desc: "工程表・充電器手配・Ready判定", bg: "bg-green-50", text: "text-green-700" },
            ].map((t) => (
              <div key={t.name} className={`flex items-center gap-2 p-2 rounded-lg ${t.bg}`}>
                <span className={`text-xs font-bold ${t.text}`}>{t.name}</span>
                <span className="text-[10px] text-gray-500">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 充電器種別集計 */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 mb-3">充電器種別</h3>
          <div className="space-y-1.5">
            {["3kWコンセント", "6kW普通充電器", "50kW急速充電器", "90kW急速充電器", "120kW急速充電器", "150kW急速充電器"].map((cat) => {
              const count = projects.filter((p) => p.chargerCategory === cat).length;
              const qty = projects.filter((p) => p.chargerCategory === cat).reduce((s, p) => s + p.quantity, 0);
              if (count === 0) return null;
              return (
                <div key={cat} className="flex justify-between text-xs">
                  <span className="text-gray-700">{cat}</span>
                  <span className="text-gray-500">{count}件 / {qty}台</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
