import Link from "next/link";
import { SAMPLE_PROJECTS, STATUS_COLORS, CONSTRUCTION_FLOW_STEPS } from "@/lib/constants";
import { getDashboardSummary, checkReadyStatus, getMaterialStatus } from "@/lib/automation";

const cell = { padding: "4px 8px", fontSize: 11, borderBottom: "1px solid #f0f0f0" } as const;
const hcell = { ...cell, fontWeight: 600, background: "#f9fafb", color: "#6b7280" } as const;
const section = { background: "white", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 10 } as const;
const shead = { padding: "6px 10px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 11, fontWeight: 700, color: "#6b7280" } as const;

export default function Dashboard() {
  const projects = SAMPLE_PROJECTS;
  const summary = getDashboardSummary(projects, "2026-04-02");

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>⚡ ダッシュボード</div>
        <Link href="/projects/new" style={{ background: "#059669", color: "white", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>新規登録</Link>
      </div>

      {/* 上段2列 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {/* サマリー */}
        <div style={section}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ecfdf5" }}>
                <th style={{ ...hcell, color: "#065f46" }}>状況</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>工事前</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>Ready</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>施工中</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>工事後</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>警告</th>
                <th style={{ ...hcell, color: "#065f46", textAlign: "center" }}>計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cell}>件数</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#d97706" }}>{summary.byPhase.pre}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#65a30d" }}>{summary.readyCount}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#059669" }}>{summary.byPhase.active}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#7c3aed" }}>{summary.byPhase.post}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: summary.alertCount > 0 ? "#dc2626" : "#d1d5db" }}>{summary.alertCount}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{summary.totalActive}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* フロー */}
        <div style={section}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <th key={s.step} style={{ ...hcell, textAlign: "center", fontSize: 10, padding: "4px 2px" }}>{s.step}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {CONSTRUCTION_FLOW_STEPS.map((s) => (
                  <td key={s.step} style={{ ...cell, textAlign: "center", fontSize: 10, padding: "4px 2px", lineHeight: 1.2 }}>{s.label}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* アラート */}
      {summary.alerts.length > 0 && (
        <div style={{ ...section, background: "#fef2f2", border: "1px solid #fecaca" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>案件</th>
                <th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>アラート</th>
                <th style={{ ...hcell, background: "rgba(254,202,202,0.4)", color: "#991b1b" }}>期限</th>
              </tr>
            </thead>
            <tbody>
              {summary.alerts.map((a, i) => (
                <tr key={i}>
                  <td style={{ ...cell, borderColor: "#fecaca" }}><Link href={`/projects/${a.projectId}`} style={{ color: "#b91c1c", fontWeight: 600 }}>{a.projectName}</Link></td>
                  <td style={{ ...cell, borderColor: "#fecaca", color: "#dc2626" }}>{a.message}</td>
                  <td style={{ ...cell, borderColor: "#fecaca", color: "#ef4444" }}>{a.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 案件一覧 */}
      <div style={section}>
        <div style={shead}>案件一覧（{projects.length}件）</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "補助金", "案件名", "充電器", "台", "施工会社", "着工", "ステータス", "Ready", "資材"].map((h) => (
                  <th key={h} style={{ ...hcell, textAlign: h === "台" || h === "Ready" || h === "資材" ? "center" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const ready = checkReadyStatus(p);
                const mat = getMaterialStatus(p);
                const dim = p.status === "キャンセル" || p.status === "延期";
                return (
                  <tr key={p.id} style={{ opacity: dim ? 0.4 : 1 }}>
                    <td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{p.caseId}</td>
                    <td style={{ ...cell, color: "#6b7280" }}>{p.subsidyType}</td>
                    <td style={cell}>
                      <Link href={`/projects/${p.id}`} style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>{p.name}</Link>
                    </td>
                    <td style={{ ...cell, color: "#4b5563" }}>{p.chargerCategory}</td>
                    <td style={{ ...cell, textAlign: "center" }}>{p.quantity}</td>
                    <td style={{ ...cell, color: "#4b5563" }}>{p.contractor}</td>
                    <td style={{ ...cell, color: "#9ca3af" }}>{p.startDate || "-"}</td>
                    <td style={cell}>
                      <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td style={{ ...cell, textAlign: "center", color: ready.status === "Ready" ? "#16a34a" : "#f87171", fontWeight: 600 }}>
                      {ready.status === "Ready" ? "✓" : p.status === "請求済み" || p.status === "検収完了" ? "-" : ready.items.filter(i => !i.ok).length}
                    </td>
                    <td style={{ ...cell, textAlign: "center", color: mat.allConfirmed ? "#16a34a" : !p.startDate ? "#d1d5db" : "#f59e0b", fontWeight: 600 }}>
                      {mat.allConfirmed ? "✓" : !p.startDate ? "-" : "!"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 下段3列 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {/* 検収 */}
        <div style={section}>
          <div style={shead}>検収締め</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { d: "毎月20日", r: "図面提出＋承認依頼", c: "#dc2626" },
                { d: "毎月25日", r: "承認→請求確定", c: "#dc2626" },
                { d: "月初2営業日", r: "請求書PDF送付", c: "#d97706" },
                { d: "完工後3営業日", r: "完了報告書", c: "#d97706" },
              ].map((r) => (
                <tr key={r.d}><td style={{ ...cell, fontWeight: 700, color: r.c, whiteSpace: "nowrap" }}>{r.d}</td><td style={cell}>{r.r}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ツール */}
        <div style={section}>
          <div style={shead}>外部ツール</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { n: "Kizuku", u: "工事連絡・写真・報告書・安全書類" },
                { n: "Toyokumo", u: "現調フォーム・進捗KPI・図面提出" },
                { n: "進捗シート", u: "工程表・充電器手配・Ready判定" },
              ].map((t) => (
                <tr key={t.n}><td style={{ ...cell, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>{t.n}</td><td style={cell}>{t.u}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 充電器 */}
        <div style={section}>
          <div style={shead}>充電器種別</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={{ ...hcell, textAlign: "left" }}>種別</th><th style={{ ...hcell, textAlign: "center" }}>件</th><th style={{ ...hcell, textAlign: "center" }}>台</th></tr></thead>
            <tbody>
              {["3kWコンセント", "6kW普通充電器", "50kW急速充電器", "90kW急速充電器"].map((cat) => {
                const c = projects.filter((p) => p.chargerCategory === cat).length;
                const q = projects.filter((p) => p.chargerCategory === cat).reduce((s, p) => s + p.quantity, 0);
                return c > 0 ? <tr key={cat}><td style={cell}>{cat}</td><td style={{ ...cell, textAlign: "center" }}>{c}</td><td style={{ ...cell, textAlign: "center", fontWeight: 600 }}>{q}</td></tr> : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
