import Link from "next/link";
import { notFound } from "next/navigation";
import { SAMPLE_PROJECTS, CONSTRUCTION_FLOW_STEPS, SAFETY_DOCUMENTS } from "@/lib/constants";
import { cell, hcell, hcellG, section, shead, table, pageTitle, link, statusBadge, badge } from "@/lib/styles";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const p = SAMPLE_PROJECTS.find((p) => p.id === id);
  if (!p) notFound();

  const statusToStep: Record<string, number> = {
    "交付決定待ち": 0, "交付決定済み": 1, "施工発注済み": 3, "日程調整中": 4,
    "着工前会議完了": 5, "安全書類提出済み": 6, "着工Ready": 8, "施工中": 9,
    "完了報告待ち": 10, "報告書確認中": 10, "検収完了": 11, "請求済み": 11,
  };
  const currentStep = statusToStep[p.status] ?? 0;

  const infoRows = [
    ["充電器種別", p.chargerCategory], ["メーカー/型番", `${p.chargerManufacturer} ${p.chargerModel}`],
    ["設置台数", `${p.quantity}台`], ["施工会社", p.contractor], ["補助金", p.subsidyType],
    ["申請区分", p.applicationCategory], ["施工エリア", p.constructionArea],
    ["案件担当", p.caseManager], ["施工管理", p.constructionManager],
  ];
  const schedRows = [
    ["発注日", p.orderDate], ["着工前会議", p.preConstructionMeetingDate ? `${p.preConstructionMeetingDate} ${p.preConstructionMeetingTime}` : ""],
    ["安全書類提出", p.safetyDocSubmitDate], ["着工予定日", p.startDate], ["完工予定日", p.endDate],
    ["電力受電日", p.powerReceptionDate], ["停電日", p.blackoutDate ? `${p.blackoutDate} ${p.blackoutTime}` : ""],
  ];
  const matRows = [
    ["充電器納入希望", p.chargerDeliveryRequestDate], ["充電器納品確認", p.chargerDeliveryConfirmDate],
    ["看板納品確認", p.signboardDeliveryConfirmDate], ["電材確保確認", p.materialConfirmDate],
  ];

  return (
    <div>
      <Link href="/projects" style={{ fontSize: 11, color: "#059669", textDecoration: "none" }}>&larr; 案件一覧</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "6px 0 10px" }}>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.caseId} | {p.subsidyType}</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>{p.location}</div>
        </div>
        <span style={statusBadge(p.status)}>{p.status}</span>
      </div>

      {/* フロー進捗 */}
      <div style={section}>
        <div style={shead}>工事フロー進捗</div>
        <table style={table}>
          <tbody><tr>
            {CONSTRUCTION_FLOW_STEPS.map((s) => (
              <td key={s.step} style={{ ...cell, textAlign: "center", fontSize: 10, padding: "4px 2px",
                background: s.step <= currentStep ? "#ecfdf5" : "transparent",
                fontWeight: s.step === currentStep ? 700 : 400,
                color: s.step <= currentStep ? "#059669" : "#d1d5db",
              }}>{s.label}</td>
            ))}
          </tr></tbody>
        </table>
      </div>

      {/* 3列: 案件情報 / 日程 / 資材・完了 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}>
          <div style={shead}>案件情報</div>
          <table style={table}><tbody>
            {infoRows.map(([k, v]) => <tr key={k}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{k}</td><td style={{ ...cell, fontWeight: 500 }}>{v || "-"}</td></tr>)}
            {p.notes && <tr><td style={{ ...cell, color: "#6b7280" }}>備考</td><td style={cell}>{p.notes}</td></tr>}
          </tbody></table>
        </div>
        <div style={section}>
          <div style={shead}>日程管理</div>
          <table style={table}><tbody>
            {schedRows.map(([k, v]) => <tr key={k}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{k}</td><td style={{ ...cell, color: v ? "#1f2937" : "#f87171", fontWeight: v ? 500 : 400 }}>{v || "未定"}</td></tr>)}
            <tr><td style={{ ...cell, color: "#6b7280" }}>着工Ready</td><td style={{ ...cell, fontWeight: 700, color: p.readyStatus === "Ready" ? "#16a34a" : "#d1d5db" }}>{p.readyStatus || "未確認"} {p.readyConfirmDate && `(${p.readyConfirmDate})`}</td></tr>
          </tbody></table>
        </div>
        <div style={section}>
          <div style={shead}>資材・完了報告</div>
          <table style={table}><tbody>
            {matRows.map(([k, v]) => <tr key={k}><td style={{ ...cell, color: "#6b7280" }}>{k}</td><td style={{ ...cell, color: v ? "#1f2937" : "#f87171" }}>{v || "未確認"}</td></tr>)}
            <tr><td style={{ ...cell, color: "#6b7280" }}>産廃</td><td style={cell}>{p.wasteDisposal || "-"} {p.wasteDescription && `(${p.wasteDescription})`}</td></tr>
            <tr><td style={{ ...cell, color: "#6b7280" }}>実完工日</td><td style={cell}>{p.actualEndDate || "-"}</td></tr>
            <tr><td style={{ ...cell, color: "#6b7280" }}>報告書</td><td style={{ ...cell, fontWeight: 600, color: p.reportStatus === "承認済み" ? "#16a34a" : p.reportStatus === "差戻" ? "#dc2626" : "#6b7280" }}>{p.reportStatus || "未作成"}</td></tr>
          </tbody></table>
        </div>
      </div>

      {/* 安全書類 */}
      <div style={section}>
        <div style={shead}>安全書類提出状況</div>
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
    </div>
  );
}

export function generateStaticParams() {
  return SAMPLE_PROJECTS.map((p) => ({ id: p.id }));
}
