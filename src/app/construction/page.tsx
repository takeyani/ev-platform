import Link from "next/link";
import { SAMPLE_PROJECTS } from "@/lib/constants";
import { checkReadyStatus, getMaterialStatus, getDeadlineAlerts } from "@/lib/automation";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge } from "@/lib/styles";

export default function ConstructionPage() {
  const all = SAMPLE_PROJECTS.filter((p) => !["キャンセル", "延期", "請求済み", "交付決定待ち"].includes(p.status));
  const inProgress = all.filter((p) => p.status === "施工中");
  const ready = all.filter((p) => p.status === "着工Ready");
  const prep = all.filter((p) => ["施工発注済み", "日程調整中", "着工前会議完了", "安全書類提出済み", "交付決定済み"].includes(p.status));

  return (
    <div>
      <div style={pageTitle}>🔧 施工管理</div>

      {/* サマリー */}
      <div style={section}>
        <table style={table}>
          <thead><tr>
            <th style={hcellG}>準備中</th><th style={hcellG}>着工Ready</th><th style={hcellG}>施工中</th><th style={hcellG}>合計</th>
          </tr></thead>
          <tbody><tr>
            <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#d97706" }}>{prep.length}</td>
            <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#65a30d" }}>{ready.length}</td>
            <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#059669" }}>{inProgress.length}</td>
            <td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{all.length}</td>
          </tr></tbody>
        </table>
      </div>

      {/* 施工中 */}
      {inProgress.length > 0 && (
        <div style={section}>
          <div style={{ ...shead, background: "#ecfdf5", color: "#065f46" }}>施工中案件</div>
          <table style={table}>
            <thead><tr><th style={hcell}>案件</th><th style={hcell}>充電器</th><th style={hcell}>施工会社</th><th style={hcell}>着工日</th><th style={hcell}>完工予定</th><th style={hcell}>アラート</th></tr></thead>
            <tbody>{inProgress.map((p) => {
              const alerts = getDeadlineAlerts(p, "2026-04-03");
              return (<tr key={p.id}>
                <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{ fontSize: 9, color: "#9ca3af" }}>{p.caseId}</div></td>
                <td style={cell}>{p.chargerCategory} x{p.quantity}</td>
                <td style={cell}>{p.contractor}</td>
                <td style={cell}>{p.actualStartDate || p.startDate}</td>
                <td style={cell}>{p.endDate}</td>
                <td style={cell}>{alerts.length > 0 ? <span style={{ color: "#dc2626" }}>{alerts[0].message}</span> : <span style={{ color: "#d1d5db" }}>-</span>}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      )}

      {/* 準備中 - Ready判定 */}
      <div style={section}>
        <div style={shead}>工事前準備 - 着工Ready判定</div>
        <table style={table}>
          <thead><tr><th style={hcell}>案件</th><th style={hcell}>ステータス</th><th style={hcell}>Ready</th><th style={hcell}>不足項目</th><th style={hcell}>資材</th></tr></thead>
          <tbody>{[...ready, ...prep].map((p) => {
            const rc = checkReadyStatus(p);
            const mat = getMaterialStatus(p);
            return (<tr key={p.id}>
              <td style={cell}><Link href={`/projects/${p.id}`} style={link}>{p.name}</Link><div style={{ fontSize: 9, color: "#9ca3af" }}>{p.caseId}</div></td>
              <td style={cell}><span style={statusBadge(p.status)}>{p.status}</span></td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: rc.status === "Ready" ? "#16a34a" : "#dc2626" }}>{rc.status === "Ready" ? "✓" : `${rc.items.filter(i => !i.ok).length}不足`}</td>
              <td style={{ ...cell, fontSize: 10 }}>{rc.items.filter(i => !i.ok).map(i => i.label).join(", ") || "-"}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: mat.allConfirmed ? "#16a34a" : "#f59e0b" }}>{mat.allConfirmed ? "✓" : "!"}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>

      {/* Kizukuガイド */}
      <div style={{ ...section, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ ...shead, background: "rgba(191,219,254,0.3)", color: "#1e40af" }}>工事中の連絡（Kizuku）</div>
        <table style={table}>
          <tbody>
            <tr><td style={{ ...cell, fontWeight: 700, color: "#1d4ed8", borderColor: "#bfdbfe" }}>1. 作業開始</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>当日の作業内容をKizukuで連絡</td></tr>
            <tr><td style={{ ...cell, fontWeight: 700, color: "#1d4ed8", borderColor: "#bfdbfe" }}>2. 写真提出</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>適宜Kizukuにアップロード</td></tr>
            <tr><td style={{ ...cell, fontWeight: 700, color: "#1d4ed8", borderColor: "#bfdbfe" }}>3. 終了連絡</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>目安時間＋終了時にKizukuで連絡</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
