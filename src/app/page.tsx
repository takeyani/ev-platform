import Link from "next/link";
import {
  SAMPLE_PROJECTS,
  STATUS_COLORS,
  CONSTRUCTION_FLOW_STEPS,
} from "@/lib/constants";
import { getDashboardSummary, checkReadyStatus, getMaterialStatus } from "@/lib/automation";

export default function Dashboard() {
  const projects = SAMPLE_PROJECTS;
  const summary = getDashboardSummary(projects, "2026-04-02");

  const phaseCards = [
    { label: "工事前", value: summary.byPhase.pre, color: "bg-amber-500", text: "text-amber-700" },
    { label: "Ready", value: summary.readyCount, color: "bg-lime-500", text: "text-lime-700" },
    { label: "施工中", value: summary.byPhase.active, color: "bg-emerald-500", text: "text-emerald-700" },
    { label: "工事後", value: summary.byPhase.post, color: "bg-purple-500", text: "text-purple-700" },
    { label: "アラート", value: summary.alertCount, color: summary.alertCount > 0 ? "bg-red-500" : "bg-gray-300", text: summary.alertCount > 0 ? "text-red-700" : "text-gray-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* EVヒーローバナー */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-600 p-5 sm:p-7">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            <circle cx="700" cy="100" r="120" fill="white" />
            <circle cx="650" cy="50" r="60" fill="white" />
            <rect x="50" y="140" width="200" height="8" rx="4" fill="white" />
            <rect x="50" y="160" width="140" height="8" rx="4" fill="white" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">ダッシュボード</h1>
          </div>
          <p className="text-emerald-200/80 text-xs sm:text-sm">
            Terra Charge EV充電器施工管理 &mdash; すべての人とEVにエネルギーを。
          </p>
        </div>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
        {phaseCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-3 sm:p-4 shadow-sm">
            <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${s.color}`} />
              <p className={`text-lg sm:text-2xl font-bold ${s.text}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* アラートパネル */}
      {summary.alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
          <h2 className="text-xs sm:text-sm font-bold text-red-800 mb-2">期限アラート ({summary.alerts.length}件)</h2>
          <div className="space-y-1.5">
            {summary.alerts.map((a, i) => (
              <div key={i} className={`text-xs sm:text-sm ${a.level === "danger" ? "text-red-700" : "text-amber-700"}`}>
                <div className="flex items-start gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${a.level === "danger" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div className="min-w-0">
                    <Link href={`/projects/${a.projectId}`} className="hover:underline font-medium">{a.projectName}</Link>
                    <span className="text-gray-500 mx-1">-</span>
                    <span>{a.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工事フロー（横スクロール対応） */}
      <div className="bg-white rounded-xl border p-3 sm:p-5 shadow-sm overflow-x-auto">
        <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-3">工事全体フロー</h2>
        <div className="flex items-start gap-1 min-w-[700px] pb-1">
          {CONSTRUCTION_FLOW_STEPS.map((item, i) => (
            <div key={item.step} className="flex items-center gap-1 flex-shrink-0">
              <div className="text-center w-[62px]">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] sm:text-xs font-bold mx-auto">{item.step}</div>
                <p className="text-[9px] sm:text-[10px] font-medium text-gray-900 mt-1 leading-tight">{item.label}</p>
              </div>
              {i < CONSTRUCTION_FLOW_STEPS.length - 1 && <span className="text-gray-300 text-[10px]">&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* モバイル: カード表示 / PC: テーブル表示 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b">
          <h2 className="font-bold text-sm sm:text-base">案件一覧</h2>
          <Link href="/projects/new" className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-xs sm:text-sm font-medium">新規登録</Link>
        </div>

        {/* PC: テーブル */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">案件ID</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">補助金</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500">案件名</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">充電器</th>
                <th className="text-center px-3 py-2.5 font-medium text-gray-500">台数</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">施工会社</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">着工予定</th>
                <th className="text-left px-3 py-2.5 font-medium text-gray-500">ステータス</th>
                <th className="text-center px-3 py-2.5 font-medium text-gray-500">Ready</th>
                <th className="text-center px-3 py-2.5 font-medium text-gray-500">資材</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                const mat = getMaterialStatus(p);
                return (
                  <tr key={p.id} className={`hover:bg-gray-50 ${p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}`}>
                    <td className="px-3 py-2.5 font-mono text-gray-400">{p.caseId}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{p.subsidyType}</td>
                    <td className="px-3 py-2.5">
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:text-emerald-800 font-medium">{p.name}</Link>
                      <div className="text-[10px] text-gray-400">{p.prefecture} {p.applicationCategory}</div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{p.chargerCategory}</td>
                    <td className="px-3 py-2.5 text-gray-700 text-center">{p.quantity}</td>
                    <td className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{p.contractor}</td>
                    <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{p.startDate || "-"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {ready.status === "Ready" ? (
                        <span className="text-green-600 font-bold">&#10003;</span>
                      ) : p.status === "請求済み" || p.status === "検収完了" ? (
                        <span className="text-gray-300">-</span>
                      ) : (
                        <span className="text-red-400 text-[10px]">{ready.items.filter(i => !i.ok).length}不足</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {mat.allConfirmed ? <span className="text-green-600 font-bold">&#10003;</span>
                        : !p.startDate ? <span className="text-gray-300">-</span>
                        : <span className="text-amber-500 text-[10px]">未完</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* モバイル: カードリスト */}
        <div className="md:hidden divide-y">
          {projects.map((p) => {
            const ready = checkReadyStatus(p);
            const mat = getMaterialStatus(p);
            return (
              <div key={p.id} className={`p-3 ${p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/projects/${p.id}`} className="text-emerald-600 font-medium text-sm hover:underline block truncate">{p.name}</Link>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.caseId} | {p.subsidyType} | {p.prefecture}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-600">
                  <span>{p.chargerCategory} x{p.quantity}</span>
                  <span>{p.contractor}</span>
                  <span>着工: {p.startDate || "未定"}</span>
                </div>
                <div className="flex gap-3 mt-1.5 text-[10px]">
                  <span>Ready: {ready.status === "Ready" ? <span className="text-green-600 font-bold">OK</span> : <span className="text-red-400">{ready.items.filter(i => !i.ok).length}不足</span>}</span>
                  <span>資材: {mat.allConfirmed ? <span className="text-green-600 font-bold">OK</span> : <span className="text-amber-500">未完</span>}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 下部パネル: モバイル1列 / PC3列 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm">
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-3">検収締め</h3>
          <div className="space-y-2 text-[11px] sm:text-xs">
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

        <div className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm">
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-3">外部ツール</h3>
          <div className="space-y-2">
            {[
              { name: "Kizuku", desc: "工事連絡・写真・報告書", bg: "bg-blue-50", text: "text-blue-700" },
              { name: "Toyokumo", desc: "現調フォーム・図面提出", bg: "bg-teal-50", text: "text-teal-700" },
              { name: "進捗シート", desc: "工程表・Ready判定", bg: "bg-green-50", text: "text-green-700" },
            ].map((t) => (
              <div key={t.name} className={`flex items-center gap-2 p-2 rounded-lg ${t.bg}`}>
                <span className={`text-xs font-bold ${t.text} w-16 flex-shrink-0`}>{t.name}</span>
                <span className="text-[10px] text-gray-500">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 sm:p-5 shadow-sm">
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-3">充電器種別</h3>
          <div className="space-y-1.5">
            {["3kWコンセント", "6kW普通充電器", "50kW急速充電器", "90kW急速充電器"].map((cat) => {
              const count = projects.filter((p) => p.chargerCategory === cat).length;
              const qty = projects.filter((p) => p.chargerCategory === cat).reduce((s, p) => s + p.quantity, 0);
              if (count === 0) return null;
              return (
                <div key={cat} className="flex justify-between text-[11px] sm:text-xs">
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
