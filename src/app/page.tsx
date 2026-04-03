"use client";
import Link from "next/link";
import { CONSTRUCTION_FLOW_STEPS } from "@/lib/constants";
import { getDashboardSummary, checkReadyStatus, getMaterialStatus } from "@/lib/automation";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function Dashboard() {
  const { projects, dbMode, loading } = useProjects();
  const summary = getDashboardSummary(projects);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ ...pageTitle, marginBottom: 0 }}>
          ⚡ ダッシュボード
          {dbMode && <span style={{ fontSize: 9, color: "#16a34a", marginLeft: 6 }}>● DB</span>}
        </div>
        <Link href="/projects/new" style={{ background: "#059669", color: "white", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>新規登録</Link>
      </div>

      {loading ? <div style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>読み込み中...</div> : (<>
      {/* 上段2列 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}>
          <table style={table}>
            <thead><tr>
              <th style={hcellG}>状況</th><th style={{ ...hcellG, textAlign: "center" }}>工事前</th><th style={{ ...hcellG, textAlign: "center" }}>Ready</th><th style={{ ...hcellG, textAlign: "center" }}>施工中</th><th style={{ ...hcellG, textAlign: "center" }}>工事後</th><th style={{ ...hcellG, textAlign: "center" }}>警告</th><th style={{ ...hcellG, textAlign: "center" }}>計</th>
            </tr></thead>
            <tbody><tr>
              <td style={cell}>件数</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#d97706" }}>{summary.byPhase.pre}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#65a30d" }}>{summary.readyCount}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#059669" }}>{summary.byPhase.active}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#7c3aed" }}>{summary.byPhase.post}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: summary.alertCount > 0 ? "#dc2626" : "#d1d5db" }}>{summary.alertCount}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{summary.totalActive}</td>
            </tr></tbody>
          </table>
        </div>
        <div style={section}>
          <table style={table}>
            <thead><tr>{CONSTRUCTION_FLOW_STEPS.map((s) => <th key={s.step} style={{ ...hcell, textAlign: "center", fontSize: 10, padding: "4px 2px" }}>{s.step}</th>)}</tr></thead>
            <tbody><tr>{CONSTRUCTION_FLOW_STEPS.map((s) => <td key={s.step} style={{ ...cell, textAlign: "center", fontSize: 10, padding: "4px 2px" }}>{s.label}</td>)}</tr></tbody>
          </table>
        </div>
      </div>

      {summary.alerts.length > 0 && (
        <div style={{ ...section, background: "#fef2f2", border: "1px solid #fecaca" }}>
          <table style={table}>
            <thead><tr><th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>案件</th><th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>アラート</th><th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>期限</th></tr></thead>
            <tbody>{summary.alerts.map((a, i) => (
              <tr key={i}><td style={{ ...cell, borderColor: "#fecaca" }}><Link href={`/projects/${a.projectId}`} style={{ color: "#b91c1c", fontWeight: 600, textDecoration: "none" }}>{a.projectName}</Link></td><td style={{ ...cell, borderColor: "#fecaca", color: "#dc2626" }}>{a.message}</td><td style={{ ...cell, borderColor: "#fecaca", color: "#ef4444" }}>{a.dueDate}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}

      <div style={section}>
        <div style={{ ...shead, display: "flex", justifyContent: "space-between" }}><span>案件一覧（{projects.length}件）</span><Link href="/projects" style={{ fontSize: 10, color: "#059669", textDecoration: "none" }}>全件 →</Link></div>
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead><tr>{["ID", "補助金", "案件名", "充電器", "台", "施工会社", "着工", "状態", "Ready", "資材"].map((h) => <th key={h} style={{ ...hcell, textAlign: h === "台" || h === "Ready" || h === "資材" ? "center" : "left" }}>{h}</th>)}</tr></thead>
            <tbody>{projects.map((p) => {
              const ready = checkReadyStatus(p);
              const mat = getMaterialStatus(p);
              return (<tr key={p.id} style={{ opacity: p.status === "キャンセル" || p.status === "延期" ? 0.4 : 1 }}>
                <td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{p.caseId}</td>
                <td style={{ ...cell, color: "#6b7280" }}>{p.subsidyType}</td>
                <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link></td>
                <td style={{ ...cell, color: "#4b5563" }}>{p.chargerCategory}</td>
                <td style={{ ...cell, textAlign: "center" }}>{p.quantity}</td>
                <td style={{ ...cell, color: "#4b5563" }}>{p.contractor}</td>
                <td style={{ ...cell, color: "#9ca3af" }}>{p.startDate || "-"}</td>
                <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 600, color: ready.status === "Ready" ? "#16a34a" : "#f87171" }}>{ready.status === "Ready" ? "✓" : ready.items.filter(i => !i.ok).length || "-"}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 600, color: mat.allConfirmed ? "#16a34a" : !p.startDate ? "#d1d5db" : "#f59e0b" }}>{mat.allConfirmed ? "✓" : !p.startDate ? "-" : "!"}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={section}><div style={shead}>検収締め</div><table style={table}><tbody>
          {[{d:"毎月20日",r:"図面提出＋承認依頼",c:"#dc2626"},{d:"毎月25日",r:"承認→請求確定",c:"#dc2626"},{d:"月初2営業日",r:"請求書PDF送付",c:"#d97706"},{d:"完工後3営業日",r:"完了報告書",c:"#d97706"}].map((r)=><tr key={r.d}><td style={{...cell,fontWeight:700,color:r.c,whiteSpace:"nowrap"}}>{r.d}</td><td style={cell}>{r.r}</td></tr>)}
        </tbody></table></div>
        <div style={section}><div style={shead}>外部ツール</div><table style={table}><tbody>
          {[{n:"Kizuku",u:"工事連絡・写真・報告書"},{n:"Toyokumo",u:"現調フォーム・図面提出"},{n:"進捗シート",u:"工程表・Ready判定"}].map((t)=><tr key={t.n}><td style={{...cell,fontWeight:700,color:"#059669",whiteSpace:"nowrap"}}>{t.n}</td><td style={cell}>{t.u}</td></tr>)}
        </tbody></table></div>
        <div style={section}><div style={shead}>充電器種別</div><table style={table}><thead><tr><th style={{...hcell,textAlign:"left"}}>種別</th><th style={{...hcell,textAlign:"center"}}>件</th><th style={{...hcell,textAlign:"center"}}>台</th></tr></thead><tbody>
          {["3kWコンセント","6kW普通充電器","50kW急速充電器","90kW急速充電器"].map((cat)=>{const c=projects.filter(p=>p.chargerCategory===cat).length;const q=projects.filter(p=>p.chargerCategory===cat).reduce((s,p)=>s+p.quantity,0);return c>0?<tr key={cat}><td style={cell}>{cat}</td><td style={{...cell,textAlign:"center"}}>{c}</td><td style={{...cell,textAlign:"center",fontWeight:600}}>{q}</td></tr>:null})}
        </tbody></table></div>
      </div>
      </>)}
    </div>
  );
}
