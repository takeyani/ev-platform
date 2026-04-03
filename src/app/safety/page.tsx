"use client";
import Link from "next/link";
import { SAFETY_DOCUMENTS } from "@/lib/constants";
import { getSafetyDocStatus } from "@/lib/automation";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, section, shead, table, pageTitle, link, statusBadge, badge } from "@/lib/styles";

export default function SafetyPage() {
  const { projects, loading } = useProjects();
  const active = projects.filter((p) => !["キャンセル", "延期", "請求済み"].includes(p.status));
  const annual = SAFETY_DOCUMENTS.filter((d) => !d.perProject);
  const perProj = SAFETY_DOCUMENTS.filter((d) => d.perProject);
  if (loading) return <div style={pageTitle}>🦺 安全書類管理<br/><span style={{ fontSize: 11, color: "#9ca3af" }}>読み込み中...</span></div>;
  return (
    <div>
      <div style={pageTitle}>🦺 安全書類管理（全{SAFETY_DOCUMENTS.length}種類）</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><div style={shead}>年度毎（{annual.length}種）</div><table style={table}><thead><tr><th style={hcell}>ID</th><th style={hcell}>書類名</th><th style={hcell}>頻度</th><th style={hcell}>要否</th></tr></thead><tbody>{annual.map((d) => <tr key={d.id}><td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{d.id}</td><td style={cell}>{d.name}</td><td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{d.frequency}</td><td style={cell}><span style={badge(d.required === "必須" ? "#fee2e2" : "#f3f4f6", d.required === "必須" ? "#b91c1c" : "#6b7280")}>{d.required}</span></td></tr>)}</tbody></table></div>
        <div style={section}><div style={shead}>工事毎（{perProj.length}種）</div><table style={table}><thead><tr><th style={hcell}>ID</th><th style={hcell}>書類名</th><th style={hcell}>頻度</th><th style={hcell}>要否</th></tr></thead><tbody>{perProj.map((d) => <tr key={d.id}><td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{d.id}</td><td style={cell}>{d.name}</td><td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{d.frequency}</td><td style={cell}><span style={badge(d.required === "必須" ? "#fee2e2" : "#f3f4f6", d.required === "必須" ? "#b91c1c" : "#6b7280")}>{d.required}</span></td></tr>)}</tbody></table></div>
      </div>
      <div style={section}><div style={shead}>案件別 提出状況</div><table style={table}><thead><tr><th style={hcell}>案件</th><th style={hcell}>ステータス</th><th style={hcell}>着工予定</th><th style={hcell}>提出日</th><th style={hcell}>提出率</th></tr></thead><tbody>{active.map((p) => { const docs = getSafetyDocStatus(p); const sub = docs.filter((d) => d.submitted).length; return <tr key={p.id}><td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{ fontSize: 9, color: "#9ca3af" }}>{p.caseId}</div></td><td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td><td style={cell}>{p.startDate || "-"}</td><td style={cell}>{p.safetyDocSubmitDate ? <span style={{ color: "#16a34a" }}>{p.safetyDocSubmitDate}</span> : <span style={{ color: "#f87171" }}>未提出</span>}</td><td style={cell}>{p.safetyDocSubmitDate ? `${sub}/${SAFETY_DOCUMENTS.length}` : "0"}</td></tr>;})}</tbody></table></div>
    </div>
  );
}
