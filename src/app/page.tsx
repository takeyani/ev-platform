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

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* タイトル行（コンパクト） */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <h1 className="text-lg sm:text-xl font-bold leading-tight">ダッシュボード</h1>
            <p className="text-[10px] sm:text-xs text-gray-400">Terra Charge EV充電器施工管理</p>
          </div>
        </div>
        <Link href="/projects/new" className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-xs sm:text-sm font-medium">新規登録</Link>
      </div>

      {/* サマリーテーブル（カードではなくテーブル） */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 border-b border-emerald-100">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-emerald-800 text-xs">項目</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">工事前</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">Ready</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">施工中</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">工事後</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">アラート</th>
              <th className="text-center px-4 py-2 font-medium text-emerald-800 text-xs">合計</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-700 text-xs">案件数</td>
              <td className="px-4 py-2.5 text-center text-amber-700 font-bold">{summary.byPhase.pre}</td>
              <td className="px-4 py-2.5 text-center text-lime-700 font-bold">{summary.readyCount}</td>
              <td className="px-4 py-2.5 text-center text-emerald-700 font-bold">{summary.byPhase.active}</td>
              <td className="px-4 py-2.5 text-center text-purple-700 font-bold">{summary.byPhase.post}</td>
              <td className="px-4 py-2.5 text-center font-bold">
                {summary.alertCount > 0 ? <span className="text-red-600">{summary.alertCount}</span> : <span className="text-gray-400">0</span>}
              </td>
              <td className="px-4 py-2.5 text-center text-gray-900 font-bold">{summary.totalActive}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* アラート（あれば） */}
      {summary.alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-red-100/50 border-b border-red-200">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-red-800">案件</th>
                <th className="text-left px-4 py-2 font-medium text-red-800">アラート内容</th>
                <th className="text-left px-4 py-2 font-medium text-red-800">期限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {summary.alerts.map((a, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <Link href={`/projects/${a.projectId}`} className="text-red-700 hover:underline font-medium">{a.projectName}</Link>
                  </td>
                  <td className="px-4 py-2 text-red-600">{a.message}</td>
                  <td className="px-4 py-2 text-red-500">{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 工事フロー（コンパクトテーブル） */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-gray-50">
          <h2 className="text-xs font-bold text-gray-700">工事全体フロー（11ステップ）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b">
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <th key={s.step} className="px-1.5 py-2 text-center font-medium text-gray-500 min-w-[64px]">{s.step}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <td key={s.step} className="px-1.5 py-2 text-center">
                    <div className="font-medium text-gray-800">{s.label}</div>
                    <div className="text-[9px] text-gray-400 leading-tight">{s.sub}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 案件一覧テーブル */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-gray-50">
          <h2 className="text-xs font-bold text-gray-700">案件一覧（{projects.length}件）</h2>
        </div>

        {/* PC: テーブル */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-500">ID</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">補助金</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">案件名</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">充電器</th>
                <th className="text-center px-3 py-2 font-medium text-gray-500">台数</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">施工会社</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">着工予定</th>
                <th className="text-left px-3 py-2 font-medium text-gray-500">ステータス</th>
                <th className="text-center px-3 py-2 font-medium text-gray-500">Ready</th>
                <th className="text-center px-3 py-2 font-medium text-gray-500">資材</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                const mat = getMaterialStatus(p);
                return (
                  <tr key={p.id} className={p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}>
                    <td className="px-3 py-2 font-mono text-gray-400">{p.caseId}</td>
                    <td className="px-3 py-2">{p.subsidyType}</td>
                    <td className="px-3 py-2">
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                      <div className="text-[10px] text-gray-400">{p.prefecture} {p.applicationCategory}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{p.chargerCategory}</td>
                    <td className="px-3 py-2 text-center">{p.quantity}</td>
                    <td className="px-3 py-2 text-gray-700">{p.contractor}</td>
                    <td className="px-3 py-2 text-gray-500">{p.startDate || "-"}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {ready.status === "Ready" ? <span className="text-green-600 font-bold">&#10003;</span>
                        : p.status === "請求済み" || p.status === "検収完了" ? <span className="text-gray-300">-</span>
                        : <span className="text-red-400">{ready.items.filter(i => !i.ok).length}不足</span>}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {mat.allConfirmed ? <span className="text-green-600 font-bold">&#10003;</span>
                        : !p.startDate ? <span className="text-gray-300">-</span>
                        : <span className="text-amber-500">未完</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* モバイル: テーブル（コンパクト） */}
        <div className="md:hidden overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-2 py-2 font-medium text-gray-500">案件</th>
                <th className="text-left px-2 py-2 font-medium text-gray-500">充電器</th>
                <th className="text-left px-2 py-2 font-medium text-gray-500">状態</th>
                <th className="text-center px-2 py-2 font-medium text-gray-500">Ready</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                return (
                  <tr key={p.id} className={p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}>
                    <td className="px-2 py-2">
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                      <div className="text-[9px] text-gray-400">{p.caseId} | {p.contractor}</div>
                    </td>
                    <td className="px-2 py-2 text-gray-600">{p.chargerCategory}<br/><span className="text-gray-400">x{p.quantity}</span></td>
                    <td className="px-2 py-2">
                      <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {ready.status === "Ready" ? <span className="text-green-600 font-bold">&#10003;</span> : <span className="text-red-400">{ready.items.filter(i => !i.ok).length}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 下部: 検収・ツール・充電器をテーブルで */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 検収締めテーブル */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-700">検収締めルール</h3></div>
          <table className="w-full text-[11px] sm:text-xs">
            <tbody className="divide-y">
              {[
                { date: "毎月20日", rule: "図面提出＋報告書承認依頼", level: "danger" },
                { date: "毎月25日", rule: "承認完了→請求対象確定", level: "danger" },
                { date: "月初2営業日", rule: "請求書PDF送付", level: "warn" },
                { date: "完工後3営業日", rule: "完了報告書提出", level: "warn" },
              ].map((r) => (
                <tr key={r.date}>
                  <td className={`px-3 py-2 font-bold whitespace-nowrap ${r.level === "danger" ? "text-red-600" : "text-amber-600"}`}>{r.date}</td>
                  <td className="px-3 py-2 text-gray-600">{r.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 外部ツールテーブル */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-700">外部ツール連携</h3></div>
          <table className="w-full text-[11px] sm:text-xs">
            <tbody className="divide-y">
              {[
                { name: "Kizuku", use: "工事連絡・写真・報告書・安全書類提出" },
                { name: "Toyokumo", use: "現調フォーム・進捗KPI・図面提出" },
                { name: "進捗シート", use: "工程表・充電器手配・着工Ready判定" },
              ].map((t) => (
                <tr key={t.name}>
                  <td className="px-3 py-2 font-bold text-emerald-700 whitespace-nowrap">{t.name}</td>
                  <td className="px-3 py-2 text-gray-600">{t.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 充電器種別テーブル */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-gray-50"><h3 className="text-xs font-bold text-gray-700">充電器種別</h3></div>
          <table className="w-full text-[11px] sm:text-xs">
            <thead className="border-b">
              <tr>
                <th className="text-left px-3 py-1.5 font-medium text-gray-500">種別</th>
                <th className="text-center px-3 py-1.5 font-medium text-gray-500">案件</th>
                <th className="text-center px-3 py-1.5 font-medium text-gray-500">台数</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {["3kWコンセント", "6kW普通充電器", "50kW急速充電器", "90kW急速充電器"].map((cat) => {
                const count = projects.filter((p) => p.chargerCategory === cat).length;
                const qty = projects.filter((p) => p.chargerCategory === cat).reduce((s, p) => s + p.quantity, 0);
                if (count === 0) return null;
                return (
                  <tr key={cat}>
                    <td className="px-3 py-2 text-gray-700">{cat}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{count}</td>
                    <td className="px-3 py-2 text-center font-medium text-gray-900">{qty}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
