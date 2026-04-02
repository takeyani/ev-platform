import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS } from "@/lib/constants";
import { checkReadyStatus, getMaterialStatus } from "@/lib/automation";

export default function SchedulePage() {
  const projects = SAMPLE_PROJECTS.filter((p) => p.status !== "キャンセル" && p.status !== "延期");

  // 月別集計（簡易ガントチャート用）
  const months = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
  const monthLabels = ["2月", "3月", "4月", "5月", "6月"];

  function isInMonth(date: string, month: string): boolean {
    return date?.startsWith(month) || false;
  }
  function isSpanning(start: string, end: string, month: string): boolean {
    if (!start || !end) return false;
    return start <= month + "-31" && end >= month + "-01";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">スケジュール</h1>
        <p className="text-sm text-gray-500">R8年度 工事工程管理</p>
      </div>

      {/* 補助金スケジュール */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-bold text-sm mb-3">R8年度 NeV補助金 想定スケジュール</h2>
        <div className="flex gap-2">
          {[
            { period: "4-6月", label: "交付申請・決定", color: "bg-blue-100 text-blue-700" },
            { period: "6-9月", label: "施工期間（1回目）", color: "bg-emerald-100 text-emerald-700" },
            { period: "9-10月", label: "実績報告", color: "bg-purple-100 text-purple-700" },
            { period: "10-12月", label: "施工期間（2回目）", color: "bg-emerald-100 text-emerald-700" },
            { period: "1-2月", label: "実績報告（最終）", color: "bg-orange-100 text-orange-700" },
          ].map((s) => (
            <div key={s.period} className={`flex-1 rounded-lg p-3 ${s.color}`}>
              <p className="text-xs font-bold">{s.period}</p>
              <p className="text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 工程表 */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">工事工程表</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600 w-48 sticky left-0 bg-gray-50">案件</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600 w-20">ステータス</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600 w-12">Ready</th>
                {monthLabels.map((m) => (
                  <th key={m} className="text-center px-3 py-2 font-medium text-gray-600 w-20">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sticky left-0 bg-white">
                      <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                      <div className="text-[10px] text-gray-400">{p.caseId} | {p.contractor}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {ready.status === "Ready" ? <span className="text-green-600 font-bold">&#10003;</span> : <span className="text-gray-300">-</span>}
                    </td>
                    {months.map((month) => {
                      const hasStart = isInMonth(p.startDate, month) || isInMonth(p.actualStartDate, month);
                      const hasEnd = isInMonth(p.endDate, month) || isInMonth(p.actualEndDate, month);
                      const spanning = isSpanning(p.startDate || p.actualStartDate, p.endDate || p.actualEndDate, month);
                      const hasBlackout = isInMonth(p.blackoutDate, month);
                      const hasPower = isInMonth(p.powerReceptionDate, month);

                      return (
                        <td key={month} className="px-1 py-2">
                          <div className="flex gap-0.5 justify-center">
                            {spanning && <div className="h-3 flex-1 rounded bg-emerald-400 max-w-[60px]" title="工事期間" />}
                            {hasBlackout && <div className="w-3 h-3 rounded bg-red-400" title="停電日" />}
                            {hasPower && <div className="w-3 h-3 rounded bg-yellow-400" title="受電日" />}
                            {!spanning && !hasBlackout && !hasPower && <span className="text-gray-200">-</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t bg-gray-50 flex gap-4 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-emerald-400 inline-block" />工事期間</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400 inline-block" />停電日</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" />電力受電日</span>
        </div>
      </div>

      {/* 日程詳細テーブル */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">日程詳細</h2></div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">案件</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">着工前会議</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">安全書類</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">着工予定</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">完工予定</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">停電</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">受電</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">資材</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((p) => {
              const mat = getMaterialStatus(p);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-gray-500">{p.preConstructionMeetingDate || "-"}</td>
                  <td className="px-3 py-2">{p.safetyDocSubmitDate ? <span className="text-green-600">{p.safetyDocSubmitDate}</span> : <span className="text-red-400">未提出</span>}</td>
                  <td className="px-3 py-2 text-gray-700 font-medium">{p.startDate || "-"}</td>
                  <td className="px-3 py-2 text-gray-500">{p.endDate || "-"}</td>
                  <td className="px-3 py-2 text-gray-500">{p.blackoutDate ? `${p.blackoutDate} ${p.blackoutTime}` : "-"}</td>
                  <td className="px-3 py-2 text-gray-500">{p.powerReceptionDate || "-"}</td>
                  <td className="px-3 py-2 text-center">{mat.allConfirmed ? <span className="text-green-600">&#10003;</span> : <span className="text-amber-500">未完</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
