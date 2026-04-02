import Link from "next/link";
import { SAFETY_DOCUMENTS, SAMPLE_PROJECTS, STATUS_COLORS } from "@/lib/constants";
import { getSafetyDocStatus } from "@/lib/automation";

export default function SafetyPage() {
  const activeProjects = SAMPLE_PROJECTS.filter(
    (p) => p.status !== "キャンセル" && p.status !== "延期" && p.status !== "請求済み"
  );
  const annualDocs = SAFETY_DOCUMENTS.filter((d) => !d.perProject);
  const projectDocs = SAFETY_DOCUMENTS.filter((d) => d.perProject);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">安全書類管理</h1>
        <p className="text-sm text-gray-500">全{SAFETY_DOCUMENTS.length}種類（着工1週間前までにKizukuへ提出）</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">年度毎提出（{annualDocs.length}種類）</h2>
        <div className="space-y-2">
          {annualDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400 w-8">{doc.id}</span>
                <span className="text-sm font-medium">{doc.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{doc.frequency}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${doc.required === "必須" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>{doc.required}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">工事毎提出（{projectDocs.length}種類）</h2>
        <div className="space-y-2">
          {projectDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-400 w-8">{doc.id}</span>
                <span className="text-sm font-medium">{doc.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{doc.frequency}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${doc.required === "必須" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>{doc.required}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-bold">案件別 提出状況</h2></div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">案件</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">ステータス</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">着工予定</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">提出日</th>
              <th className="text-center px-4 py-2 font-medium text-gray-600">提出率</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {activeProjects.map((p) => {
              const docs = getSafetyDocStatus(p);
              const submitted = docs.filter((d) => d.submitted).length;
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link href={`/projects/${p.id}`} className="text-emerald-600 hover:underline font-medium">{p.name}</Link>
                    <div className="text-[10px] text-gray-400">{p.caseId}</div>
                  </td>
                  <td className="px-4 py-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-2 text-gray-500">{p.startDate || "-"}</td>
                  <td className="px-4 py-2">{p.safetyDocSubmitDate ? <span className="text-green-600">{p.safetyDocSubmitDate}</span> : <span className="text-red-400">未提出</span>}</td>
                  <td className="px-4 py-2 text-center">{p.safetyDocSubmitDate ? <span className="text-green-600">{submitted}/{SAFETY_DOCUMENTS.length}</span> : <span className="text-gray-300">0</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-amber-800 mb-2">提出ルール</h3>
        <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
          <li>着工1週間前までにKizukuへ提出（Excel/PDF可）</li>
          <li>KYシートは各社様の様式も可</li>
          <li>新規入場者には工事要領書の読み合わせを行うこと</li>
          <li>外国人・高齢者・年少者は単独作業・危険作業禁止</li>
        </ul>
      </div>
    </div>
  );
}
