import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS, CONSTRUCTION_FLOW_STEPS } from "@/lib/constants";
import { getDashboardSummary, checkReadyStatus, getMaterialStatus } from "@/lib/automation";

export default function Dashboard() {
  const projects = SAMPLE_PROJECTS;
  const summary = getDashboardSummary(projects, "2026-04-02");

  return (
    <div className="space-y-2 lg:space-y-3">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm lg:text-base font-bold text-gray-800 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          EV充電器施工管理 ダッシュボード
        </h1>
        <Link href="/projects/new" className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[11px] font-medium hover:bg-emerald-700">新規登録</Link>
      </div>

      {/* 上段: サマリー + フロー を横並び */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
        {/* サマリー */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-emerald-50 border-b">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium text-emerald-700">状況</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">工事前</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">Ready</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">施工中</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">工事後</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">警告</th>
                <th className="px-2 py-1.5 text-center font-medium text-emerald-700">計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1.5 font-medium text-gray-600">件数</td>
                <td className="px-2 py-1.5 text-center font-bold text-amber-600">{summary.byPhase.pre}</td>
                <td className="px-2 py-1.5 text-center font-bold text-lime-600">{summary.readyCount}</td>
                <td className="px-2 py-1.5 text-center font-bold text-emerald-600">{summary.byPhase.active}</td>
                <td className="px-2 py-1.5 text-center font-bold text-purple-600">{summary.byPhase.post}</td>
                <td className="px-2 py-1.5 text-center font-bold">{summary.alertCount > 0 ? <span className="text-red-600">{summary.alertCount}</span> : <span className="text-gray-300">0</span>}</td>
                <td className="px-2 py-1.5 text-center font-bold text-gray-800">{summary.totalActive}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* フロー（1行テーブル） */}
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <th key={s.step} className="px-1 py-1.5 text-center font-medium text-gray-400 w-[9%]">{s.step}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <td key={s.step} className="px-0.5 py-1 text-center text-gray-700 font-medium leading-tight">{s.label}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* アラート（あれば、コンパクト） */}
      {summary.alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-red-100/60 border-b border-red-200">
              <tr>
                <th className="text-left px-2 py-1 font-medium text-red-700">案件</th>
                <th className="text-left px-2 py-1 font-medium text-red-700">アラート</th>
                <th className="text-left px-2 py-1 font-medium text-red-700">期限</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {summary.alerts.map((a, i) => (
                <tr key={i}>
                  <td className="px-2 py-1"><Link href={`/projects/${a.projectId}`} className="text-red-700 hover:underline font-medium">{a.projectName}</Link></td>
                  <td className="px-2 py-1 text-red-600">{a.message}</td>
                  <td className="px-2 py-1 text-red-500">{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* メイン: 案件テーブル（PCではコンパクト行） */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-2 py-1.5 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-600">案件一覧（{projects.length}件）</span>
          <Link href="/projects" className="text-[10px] text-emerald-600 hover:underline">全件表示 &rarr;</Link>
        </div>
        {/* PC */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">ID</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">補助金</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">案件名</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">充電器</th>
                <th className="text-center px-2 py-1.5 font-medium text-gray-400">台</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">施工会社</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">着工</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">状態</th>
                <th className="text-center px-2 py-1.5 font-medium text-gray-400">Ready</th>
                <th className="text-center px-2 py-1.5 font-medium text-gray-400">資材</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                const mat = getMaterialStatus(p);
                return (
                  <tr key={p.id} className={p.status === "キャンセル" || p.status === "延期" ? "opacity-40" : ""}>
                    <td className="px-2 py-1 font-mono text-gray-400">{p.caseId}</td>
                    <td className="px-2 py-1 text-gray-500">{p.subsidyType}</td>
                    <td className="px-2 py-1"><Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link></td>
                    <td className="px-2 py-1 text-gray-600">{p.chargerCategory}</td>
                    <td className="px-2 py-1 text-center">{p.quantity}</td>
                    <td className="px-2 py-1 text-gray-600">{p.contractor}</td>
                    <td className="px-2 py-1 text-gray-500">{p.startDate || "-"}</td>
                    <td className="px-2 py-1"><span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="px-2 py-1 text-center">{ready.status === "Ready" ? <span className="text-green-600">&#10003;</span> : p.status === "請求済み" || p.status === "検収完了" ? "-" : <span className="text-red-400">{ready.items.filter(i => !i.ok).length}</span>}</td>
                    <td className="px-2 py-1 text-center">{mat.allConfirmed ? <span className="text-green-600">&#10003;</span> : !p.startDate ? "-" : <span className="text-amber-500">!</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* モバイル */}
        <div className="md:hidden overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">案件</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">充電器</th>
                <th className="text-left px-2 py-1.5 font-medium text-gray-400">状態</th>
                <th className="text-center px-2 py-1.5 font-medium text-gray-400">R</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                return (
                  <tr key={p.id}>
                    <td className="px-2 py-1.5"><Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link><div className="text-[9px] text-gray-400">{p.caseId}</div></td>
                    <td className="px-2 py-1.5 text-gray-600">{p.chargerCategory} x{p.quantity}</td>
                    <td className="px-2 py-1.5"><span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="px-2 py-1.5 text-center">{ready.status === "Ready" ? <span className="text-green-600">&#10003;</span> : <span className="text-red-400">{ready.items.filter(i => !i.ok).length}</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 下段: 3列テーブル（超コンパクト） */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-2 py-1 border-b bg-gray-50"><span className="text-[10px] font-bold text-gray-500">検収締め</span></div>
          <table className="w-full text-[10px]">
            <tbody className="divide-y">
              {[
                { d: "毎月20日", r: "図面提出＋承認依頼", c: "text-red-600" },
                { d: "毎月25日", r: "承認→請求対象確定", c: "text-red-600" },
                { d: "月初2営業日", r: "請求書PDF送付", c: "text-amber-600" },
                { d: "完工後3営業日", r: "完了報告書提出", c: "text-amber-600" },
              ].map((r) => (
                <tr key={r.d}><td className={`px-2 py-1 font-bold ${r.c} whitespace-nowrap`}>{r.d}</td><td className="px-2 py-1 text-gray-600">{r.r}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-2 py-1 border-b bg-gray-50"><span className="text-[10px] font-bold text-gray-500">外部ツール</span></div>
          <table className="w-full text-[10px]">
            <tbody className="divide-y">
              {[
                { n: "Kizuku", u: "工事連絡・写真・報告書・安全書類" },
                { n: "Toyokumo", u: "現調フォーム・進捗KPI・図面提出" },
                { n: "進捗シート", u: "工程表・充電器手配・Ready判定" },
              ].map((t) => (
                <tr key={t.n}><td className="px-2 py-1 font-bold text-emerald-700 whitespace-nowrap">{t.n}</td><td className="px-2 py-1 text-gray-600">{t.u}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-2 py-1 border-b bg-gray-50"><span className="text-[10px] font-bold text-gray-500">充電器種別</span></div>
          <table className="w-full text-[10px]">
            <thead className="border-b"><tr><th className="text-left px-2 py-1 text-gray-400 font-medium">種別</th><th className="text-center px-2 py-1 text-gray-400 font-medium">件</th><th className="text-center px-2 py-1 text-gray-400 font-medium">台</th></tr></thead>
            <tbody className="divide-y">
              {["3kWコンセント", "6kW普通充電器", "50kW急速充電器", "90kW急速充電器"].map((cat) => {
                const c = projects.filter((p) => p.chargerCategory === cat).length;
                const q = projects.filter((p) => p.chargerCategory === cat).reduce((s, p) => s + p.quantity, 0);
                return c > 0 ? <tr key={cat}><td className="px-2 py-1 text-gray-700">{cat}</td><td className="px-2 py-1 text-center">{c}</td><td className="px-2 py-1 text-center font-medium">{q}</td></tr> : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
