"use client";
import { useState } from "react";
import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_GROUPS, type ProjectStatus } from "@/lib/constants";
import { cell, hcell, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("全て");
  const filtered = SAMPLE_PROJECTS.filter((p) => {
    if (filter === "全て") return true;
    return STATUS_GROUPS[filter]?.includes(p.status);
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={pageTitle}>📋 案件管理（{filtered.length}件）</div>
        <Link href="/projects/new" style={{ background: "#059669", color: "white", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>新規登録</Link>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {Object.keys(STATUS_GROUPS).map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 500, cursor: "pointer",
            border: filter === f ? "1px solid #059669" : "1px solid #d1d5db",
            background: filter === f ? "#059669" : "white",
            color: filter === f ? "white" : "#4b5563",
          }}>{f}</button>
        ))}
      </div>
      <div style={section}>
        <table style={table}>
          <thead>
            <tr>
              {["ID", "補助金", "案件名", "充電器", "台", "施工会社", "着工", "完工", "ステータス"].map((h) => (
                <th key={h} style={{ ...hcell, textAlign: h === "台" ? "center" : "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{p.caseId}</td>
                <td style={{ ...cell, color: "#6b7280" }}>{p.subsidyType}</td>
                <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{ fontSize: 9, color: "#9ca3af" }}>{p.prefecture} {p.applicationCategory}</div></td>
                <td style={{ ...cell, color: "#4b5563" }}>{p.chargerCategory}<div style={{ fontSize: 9, color: "#9ca3af" }}>{p.chargerManufacturer}</div></td>
                <td style={{ ...cell, textAlign: "center" }}>{p.quantity}</td>
                <td style={{ ...cell, color: "#4b5563" }}>{p.contractor}</td>
                <td style={{ ...cell, color: "#9ca3af" }}>{p.startDate || "-"}</td>
                <td style={{ ...cell, color: "#9ca3af" }}>{p.endDate || "-"}</td>
                <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} style={{ ...cell, textAlign: "center", color: "#9ca3af", padding: 20 }}>該当なし</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
