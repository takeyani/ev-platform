"use client";
import Link from "next/link";
import { INSPECTION_REQUIREMENTS, DRAWING_TYPES } from "@/lib/constants";
import { getMonthlyInspectionSummary } from "@/lib/automation";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function ReportsPage() {
  const { projects, loading } = useProjects();
  const now = new Date();
  const summary = getMonthlyInspectionSummary(projects, now.getFullYear(), now.getMonth() + 1);
  const reportProjects = projects.filter((p) => !["キャンセル", "延期", "交付決定待ち", "交付決定済み"].includes(p.status));
  if (loading) return <div style={pageTitle}>✅ 完了報告<br/><span style={{ fontSize: 11, color: "#9ca3af" }}>読み込み中...</span></div>;
  return (
    <div>
      <div style={pageTitle}>✅ 完了報告・検収管理</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><div style={shead}>月次検収サマリー</div><table style={table}><thead><tr><th style={hcellG}>対象</th><th style={hcellG}>未提出</th><th style={hcellG}>承認待</th><th style={hcellG}>差戻</th><th style={hcellG}>請求可</th></tr></thead><tbody><tr>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{summary.totalProjects}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#dc2626" }}>{summary.notSubmitted}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#2563eb" }}>{summary.pendingApproval}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#ea580c" }}>{summary.rejected}</td>
          <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#16a34a" }}>{summary.invoiceReady}</td>
        </tr></tbody></table></div>
        <div style={section}><div style={shead}>完了報告フロー</div><table style={table}><thead><tr>{["工事完了", "写真撮影", "完成図面", "報告書提出", "テラ検収", "請求送付"].map((s) => <th key={s} style={{ ...hcell, textAlign: "center", fontSize: 10 }}>{s}</th>)}</tr></thead><tbody><tr>{["鍵引渡し", "チェックシート", "4種類", "Kizuku承認依頼", "承認/差戻", "月初2営業日"].map((s) => <td key={s} style={{ ...cell, textAlign: "center", fontSize: 9, color: "#6b7280" }}>{s}</td>)}</tr></tbody></table></div>
      </div>
      <div style={section}><div style={shead}>案件別 報告状況</div><table style={table}><thead><tr><th style={hcell}>案件</th><th style={hcell}>状態</th><th style={hcell}>完工日</th><th style={hcell}>報告書提出</th><th style={hcell}>報告書状態</th><th style={hcell}>承認日</th></tr></thead><tbody>{reportProjects.map((p) => <tr key={p.id}>
        <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{ fontSize: 9, color: "#9ca3af" }}>{p.caseId}</div></td>
        <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
        <td style={cell}>{p.actualEndDate || "-"}</td>
        <td style={cell}>{p.completionReportDate ? <span style={{ color: "#2563eb" }}>{p.completionReportDate}</span> : p.actualEndDate ? <span style={{ color: "#f87171" }}>未提出</span> : "-"}</td>
        <td style={{ ...cell, fontWeight: 600, color: p.reportStatus === "承認済み" ? "#16a34a" : p.reportStatus === "差戻" ? "#dc2626" : p.reportStatus === "提出済み" ? "#2563eb" : "#d1d5db" }}>{p.reportStatus || "-"}</td>
        <td style={cell}>{p.reportApprovalDate || "-"}</td>
      </tr>)}</tbody></table></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={section}><div style={shead}>検収必要書類</div><table style={table}><tbody>{INSPECTION_REQUIREMENTS.documents.map((d) => <tr key={d}><td style={cell}>☐ {d}</td></tr>)}</tbody></table></div>
        <div style={section}><div style={shead}>完成図面（4種類）</div><table style={table}><tbody>{DRAWING_TYPES.map((d) => <tr key={d}><td style={cell}>☐ 完成{d}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
}
