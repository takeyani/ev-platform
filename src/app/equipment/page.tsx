"use client";
import { CHARGER_MANUFACTURERS, CHARGER_CATEGORIES, CUBICLE_SPECS, PROJECT_TYPE_DETAILS } from "@/lib/constants";
import { useProjects } from "@/lib/useProjects";
import { cell, hcell, section, shead, table, pageTitle, badge } from "@/lib/styles";

export default function EquipmentPage() {
  const { projects, loading } = useProjects();
  const cats = CHARGER_CATEGORIES.map((c) => { const ps = projects.filter((p) => p.chargerCategory === c.label); return { ...c, count: ps.length, qty: ps.reduce((s, p) => s + p.quantity, 0) }; }).filter((c) => c.count > 0);
  if (loading) return <div style={pageTitle}>⚡ 充電器管理<br/><span style={{ fontSize: 11, color: "#9ca3af" }}>読み込み中...</span></div>;
  return (
    <div>
      <div style={pageTitle}>⚡ 充電器管理（{CHARGER_MANUFACTURERS.length}メーカー）</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><div style={shead}>充電器種別</div><table style={table}><thead><tr><th style={hcell}>種別</th><th style={{ ...hcell, textAlign: "center" }}>案件</th><th style={{ ...hcell, textAlign: "center" }}>台数</th></tr></thead><tbody>{cats.map((c) => <tr key={c.value}><td style={cell}>{c.label}</td><td style={{ ...cell, textAlign: "center" }}>{c.count}</td><td style={{ ...cell, textAlign: "center", fontWeight: 700 }}>{c.qty}</td></tr>)}</tbody></table></div>
        <div style={section}><div style={shead}>キュービクル</div><table style={table}><thead><tr><th style={hcell}>メーカー</th><th style={hcell}>容量</th><th style={hcell}>VCT</th></tr></thead><tbody>{CUBICLE_SPECS.map((cb) => <tr key={cb.manufacturer}><td style={{ ...cell, fontWeight: 600 }}>{cb.manufacturer}</td><td style={cell}>{cb.capacities.join(" / ")}</td><td style={cell}>{cb.vctOptions.join(" / ") || "-"}</td></tr>)}</tbody></table></div>
      </div>
      <div style={section}>
        <div style={shead}>案件種別と対象充電器</div>
        <table style={table}>
          <thead><tr><th style={hcell}>種別</th><th style={hcell}>対象充電器</th><th style={hcell}>設置方法</th><th style={hcell}>費用負担</th></tr></thead>
          <tbody>{PROJECT_TYPE_DETAILS.map((t) => (
            <tr key={t.type}>
              <td style={{ ...cell, fontWeight: 700, color: "#059669", whiteSpace: "nowrap" }}>{t.type}</td>
              <td style={cell}>{t.chargers}</td>
              <td style={{ ...cell, fontSize: 10, color: "#6b7280" }}>{t.installation}</td>
              <td style={{ ...cell, fontSize: 10 }}>{t.cost}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={section}><div style={shead}>メーカー別一覧</div><table style={table}><thead><tr><th style={hcell}>メーカー</th><th style={hcell}>対応モデル</th><th style={{ ...hcell, textAlign: "center" }}>案件</th><th style={{ ...hcell, textAlign: "center" }}>台数</th></tr></thead><tbody>{CHARGER_MANUFACTURERS.map((m) => { const ps = projects.filter((p) => p.chargerManufacturer === m.label); return <tr key={m.value}><td style={{ ...cell, fontWeight: 600 }}>{m.label}</td><td style={cell}>{m.models.map((model) => <span key={model} style={{ ...badge("#f3f4f6", "#4b5563"), marginRight: 3 }}>{model}</span>)}</td><td style={{ ...cell, textAlign: "center" }}>{ps.length}</td><td style={{ ...cell, textAlign: "center", fontWeight: 600 }}>{ps.reduce((s, p) => s + p.quantity, 0)}</td></tr>;})}</tbody></table></div>
    </div>
  );
}
