import { CHARGER_MANUFACTURERS, CHARGER_CATEGORIES, CUBICLE_SPECS, SAMPLE_PROJECTS } from "@/lib/constants";
import { cell, hcell, section, shead, table, pageTitle, grid2, badge } from "@/lib/styles";

export default function EquipmentPage() {
  const cats = CHARGER_CATEGORIES.map((c) => {
    const ps = SAMPLE_PROJECTS.filter((p) => p.chargerCategory === c.label);
    return { ...c, count: ps.length, qty: ps.reduce((s, p) => s + p.quantity, 0) };
  }).filter((c) => c.count > 0);

  return (
    <div>
      <div style={pageTitle}>⚡ 充電器管理（{CHARGER_MANUFACTURERS.length}メーカー）</div>

      <div style={grid2}>
        {/* 種別集計 */}
        <div style={section}>
          <div style={shead}>充電器種別</div>
          <table style={table}>
            <thead><tr><th style={hcell}>種別</th><th style={{ ...hcell, textAlign: "center" }}>案件</th><th style={{ ...hcell, textAlign: "center" }}>台数</th></tr></thead>
            <tbody>{cats.map((c) => (
              <tr key={c.value}><td style={cell}>{c.label}</td><td style={{ ...cell, textAlign: "center" }}>{c.count}</td><td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{c.qty}</td></tr>
            ))}</tbody>
          </table>
        </div>

        {/* キュービクル */}
        <div style={section}>
          <div style={shead}>キュービクル</div>
          <table style={table}>
            <thead><tr><th style={hcell}>メーカー</th><th style={hcell}>容量</th><th style={hcell}>VCT</th></tr></thead>
            <tbody>{CUBICLE_SPECS.map((cb) => (
              <tr key={cb.manufacturer}><td style={{ ...cell, fontWeight: 600 }}>{cb.manufacturer}</td><td style={cell}>{cb.capacities.join(" / ")}</td><td style={cell}>{cb.vctOptions.join(" / ") || "-"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* メーカー一覧 */}
      <div style={section}>
        <div style={shead}>メーカー別 充電器一覧</div>
        <table style={table}>
          <thead><tr><th style={hcell}>メーカー</th><th style={hcell}>対応モデル</th><th style={{ ...hcell, textAlign: "center" }}>案件</th><th style={{ ...hcell, textAlign: "center" }}>台数</th></tr></thead>
          <tbody>{CHARGER_MANUFACTURERS.map((m) => {
            const ps = SAMPLE_PROJECTS.filter((p) => p.chargerManufacturer === m.label);
            return (<tr key={m.value}>
              <td style={{ ...cell, fontWeight: 600 }}>{m.label}</td>
              <td style={cell}>{m.models.map((model) => <span key={model} style={{ ...badge("#f3f4f6", "#4b5563"), marginRight: 3 }}>{model}</span>)}</td>
              <td style={{ ...cell, textAlign: "center" }}>{ps.length}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: 600 }}>{ps.reduce((s, p) => s + p.quantity, 0)}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>

      {/* デバイスID */}
      <div style={{ ...section, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ ...shead, background: "rgba(191,219,254,0.3)", color: "#1e40af" }}>デバイスID管理</div>
        <table style={table}>
          <thead><tr><th style={{ ...hcell, borderColor: "#bfdbfe", background: "transparent", color: "#1e40af" }}>モデル</th><th style={{ ...hcell, borderColor: "#bfdbfe", background: "transparent", color: "#1e40af" }}>QRシール</th><th style={{ ...hcell, borderColor: "#bfdbfe", background: "transparent", color: "#1e40af" }}>注意事項</th></tr></thead>
          <tbody>
            <tr><td style={{ ...cell, borderColor: "#bfdbfe" }}>新モデル</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>貼付済み</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>共有シートでデバイスID確認、取違え厳禁</td></tr>
            <tr><td style={{ ...cell, borderColor: "#bfdbfe" }}>23年モデル</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>現場貼付</td><td style={{ ...cell, borderColor: "#bfdbfe" }}>別送、設置場所指示書で整合性確認、貼り直し厳禁</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
