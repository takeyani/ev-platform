import { SAFETY_DOCUMENTS, DRAWING_TYPES, DRAWING_PREFIXES, CHARGER_MANUFACTURERS } from "@/lib/constants";
import { cell, hcell, section, shead, table, pageTitle, badge, grid2 } from "@/lib/styles";

export default function DocumentsPage() {
  return (
    <div>
      <div style={pageTitle}>📄 書類管理</div>

      <div style={grid2}>
        {/* 安全書類 */}
        <div style={section}>
          <div style={shead}>安全書類（{SAFETY_DOCUMENTS.length}種類）</div>
          <table style={table}>
            <thead><tr><th style={hcell}>ID</th><th style={hcell}>書類名</th><th style={hcell}>頻度</th><th style={hcell}>要否</th></tr></thead>
            <tbody>{SAFETY_DOCUMENTS.map((d) => (
              <tr key={d.id}>
                <td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{d.id}</td>
                <td style={cell}>{d.name}</td>
                <td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{d.frequency}</td>
                <td style={cell}><span style={badge(d.required === "必須" ? "#fee2e2" : "#f3f4f6", d.required === "必須" ? "#b91c1c" : "#6b7280")}>{d.required}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        {/* 図面種別 */}
        <div style={section}>
          <div style={shead}>図面種別（4種 × 3段階）</div>
          <table style={table}>
            <thead><tr><th style={hcell}>図面</th>{Object.entries(DRAWING_PREFIXES).map(([k, v]) => <th key={k} style={{ ...hcell, textAlign: "center" }}>{v || "申請時"}</th>)}</tr></thead>
            <tbody>{DRAWING_TYPES.map((dt) => (
              <tr key={dt}><td style={cell}>{dt}</td>{Object.entries(DRAWING_PREFIXES).map(([k, v]) => <td key={k} style={{ ...cell, textAlign: "center", color: "#6b7280" }}>{v}{dt}</td>)}</tr>
            ))}</tbody>
          </table>
          <div style={{ padding: "4px 8px", fontSize: 9, color: "#9ca3af" }}>対応CAD: DWG, DXF, JWW, TFS</div>
        </div>
      </div>

      {/* 施工規則 */}
      <div style={section}>
        <div style={shead}>施工関連規則・要領</div>
        <table style={table}>
          <thead><tr><th style={hcell}>区分</th><th style={hcell}>書類名</th></tr></thead>
          <tbody>{[
            { type: "工事規則", name: "Terra Charge工事要領【第2.1版】" },
            { type: "急速充電器", name: "Terra Charge急速工事要領【第0.2版】" },
            { type: "工事規則", name: "Terra Charge 工事規則" },
            { type: "完了報告", name: "工事完了報告規則" },
            { type: "現場調査", name: "現地調査規則【第6版】" },
            { type: "標準仕様", name: "EV充電設備新設工事 標準仕様書Ver1" },
            { type: "図面", name: "図面作成マニュアル（2026/3/26改訂）" },
            { type: "図面", name: "図面チェックリスト（2026/2/26改訂）" },
          ].map((d) => (
            <tr key={d.name}><td style={{ ...cell, color: "#2563eb", fontWeight: 600 }}>{d.type}</td><td style={cell}>{d.name}</td></tr>
          ))}</tbody>
        </table>
      </div>

      {/* メーカー仕様書 */}
      <div style={section}>
        <div style={shead}>充電器仕様書・断面図</div>
        <table style={table}>
          <thead><tr><th style={hcell}>メーカー</th><th style={hcell}>対応モデル</th><th style={hcell}>資料</th></tr></thead>
          <tbody>{CHARGER_MANUFACTURERS.map((m) => (
            <tr key={m.value}>
              <td style={{ ...cell, fontWeight: 600 }}>{m.label}</td>
              <td style={cell}>{m.models.join(", ")}</td>
              <td style={cell}><span style={badge("#ecfdf5", "#059669")}>仕様書</span> <span style={badge("#eff6ff", "#2563eb")}>断面図</span> <span style={badge("#f5f3ff", "#7c3aed")}>CAD</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
