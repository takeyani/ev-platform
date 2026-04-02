import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS, INSPECTION_REQUIREMENTS, DRAWING_TYPES } from "@/lib/constants";
import { getMonthlyInspectionSummary } from "@/lib/automation";

export default function ReportsPage() {
  const summary = getMonthlyInspectionSummary(SAMPLE_PROJECTS, 2026, 4);
  const reportProjects = SAMPLE_PROJECTS.filter(
    (p) => p.status !== "キャンセル" && p.status !== "延期" && p.status !== "交付決定待ち" && p.status !== "交付決定済み"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">完了報告・検収管理</h1>
        <p className="text-sm text-gray-500">{INSPECTION_REQUIREMENTS.deadline}</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "対象案件", value: summary.totalProjects, color: "text-gray-700" },
          { label: "未提出", value: summary.notSubmitted, color: "text-red-600" },
          { label: "承認待ち", value: summary.pendingApproval, color: "text-blue-600" },
          { label: "差戻", value: summary.rejected, color: "text-orange-600" },
          { label: "請求可能", value: summary.invoiceReady, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-bold text-sm mb-3">完了報告〜請求フロー</h2>
        <div className="flex items-center gap-3">
          {[
            { step: "1", label: "工事完了", sub: "鍵引渡し" },
            { step: "2", label: "写真撮影", sub: "チェックシート" },
            { step: "3", label: "完成図面", sub: "4種類" },
            { step: "4", label: "報告書提出", sub: "Kizuku承認依頼" },
            { step: "5", label: "テラ検収", sub: "承認/差戻" },
            { step: "6", label: "請求書送付", sub: "月初2営業日" },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mx-auto">{item.step}</div>
                <p className="text-[10px] font-medium mt-1">{item.label}</p>
                <p className="text-[8px] text-gray-400">{item.sub}</p>
              </div>
              {i < 5 && <span className="text-gray-300 text-sm">&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">案件別 報告状況</h2></div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">案件</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">ステータス</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">完工日</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">報告書提出</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">状態</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">承認日</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reportProjects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                  <div className="text-[10px] text-gray-400">{p.caseId}</div>
                </td>
                <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                <td className="px-4 py-2 text-gray-500">{p.actualEndDate || "-"}</td>
                <td className="px-4 py-2">{p.completionReportDate ? <span className="text-blue-600">{p.completionReportDate}</span> : p.actualEndDate ? <span className="text-red-400">未提出</span> : <span className="text-gray-300">-</span>}</td>
                <td className="px-4 py-2">
                  <span className={p.reportStatus === "承認済み" ? "text-green-600 font-medium" : p.reportStatus === "差戻" ? "text-red-600" : p.reportStatus === "提出済み" ? "text-blue-600" : "text-gray-300"}>
                    {p.reportStatus || "-"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">{p.reportApprovalDate || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-3">検収必要書類</h3>
          <ul className="space-y-2">{INSPECTION_REQUIREMENTS.documents.map((d) => <li key={d} className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded border-2 border-gray-300" />{d}</li>)}</ul>
        </div>
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-3">完成図面（4種類）</h3>
          <ul className="space-y-2">{DRAWING_TYPES.map((dt) => <li key={dt} className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded border-2 border-gray-300" />完成{dt}</li>)}</ul>
          <p className="text-xs text-gray-400 mt-3">ファイル名: 案件名_図面名称_データ加工日</p>
        </div>
      </div>
    </div>
  );
}
