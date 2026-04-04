"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CONSTRUCTION_FLOW_STEPS, SAFETY_DOCUMENTS, SAMPLE_PROJECTS, PROJECT_STATUSES } from "@/lib/constants";
import type { Project } from "@/lib/constants";
import { fetchProject, updateProject } from "@/lib/db";
import { suggestNextStatus } from "@/lib/automation";
import { cell, hcell, section, shead, table, pageTitle, statusBadge, badge } from "@/lib/styles";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function load() {
    setLoading(true);
    fetchProject(id)
      .then(setP)
      .catch(() => { const fb = SAMPLE_PROJECTS.find((x) => x.id === id); if (fb) setP(fb); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [id]);

  async function changeStatus(newStatus: string) {
    if (!p) return;
    setSaving(true); setMsg("");
    try {
      await updateProject(p.id, { status: newStatus });
      setP({ ...p, status: newStatus as any });
      setMsg(`✅ ${newStatus} に更新`);
      setTimeout(() => setMsg(""), 3000);
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function updateField(field: string, value: string) {
    if (!p) return;
    setSaving(true); setMsg("");
    try {
      await updateProject(p.id, { [field]: value || null });
      setP({ ...p, [field.replace(/_([a-z])/g, (_, c) => c.toUpperCase())]: value } as any);
      setMsg("✅ 更新しました");
      setTimeout(() => setMsg(""), 2000);
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    finally { setSaving(false); }
  }

  if (loading) return <div style={pageTitle}>読み込み中...</div>;
  if (!p) return <div style={pageTitle}>案件が見つかりません</div>;

  const statusToStep: Record<string, number> = { "交付決定待ち": 0, "交付決定済み": 1, "施工発注済み": 3, "日程調整中": 4, "着工前会議完了": 5, "安全書類提出済み": 6, "着工Ready": 8, "施工中": 9, "完了報告待ち": 10, "報告書確認中": 10, "検収完了": 11, "請求済み": 11 };
  const currentStep = statusToStep[p.status] ?? 0;
  const nextStatus = suggestNextStatus(p);

  const infoRows = [["充電器種別", p.chargerCategory], ["メーカー/型番", `${p.chargerManufacturer} ${p.chargerModel}`], ["設置台数", `${p.quantity}台`], ["施工会社", p.contractor], ["補助金", p.subsidyType], ["申請区分", p.applicationCategory], ["案件担当", p.caseManager], ["施工管理", p.constructionManager]];
  const schedRows = [["発注日", p.orderDate, "order_date"], ["着工前会議", p.preConstructionMeetingDate, "pre_construction_meeting_date"], ["安全書類提出", p.safetyDocSubmitDate, "safety_doc_submit_date"], ["着工予定日", p.startDate, "start_date"], ["完工予定日", p.endDate, "end_date"], ["電力受電日", p.powerReceptionDate, "power_reception_date"]];
  const matRows = [["充電器納品確認", p.chargerDeliveryConfirmDate, "charger_delivery_confirm_date"], ["電材確保確認", p.materialConfirmDate, "material_confirm_date"]];

  return (
    <div>
      <Link href="/projects" style={{ fontSize: 11, color: "#059669", textDecoration: "none" }}>&larr; 案件一覧</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", margin: "6px 0 8px" }}>
        <div><div style={{ fontSize: 10, color: "#9ca3af" }}>{p.caseId} | {p.subsidyType}</div><div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{p.location}</div></div>
        <div style={{ textAlign: "right" }}>
          <span style={statusBadge(p.status)}>{p.status}</span>
          {msg && <div style={{ fontSize: 10, marginTop: 4, color: msg.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{msg}</div>}
        </div>
      </div>

      {/* ステータス変更 */}
      <div style={{ ...section, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>ステータス変更:</span>
          {nextStatus && (
            <button onClick={() => changeStatus(nextStatus)} disabled={saving} style={{ background: "#059669", color: "white", border: "none", borderRadius: 4, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              → {nextStatus}（推奨）
            </button>
          )}
          <select onChange={(e) => { if (e.target.value) changeStatus(e.target.value); e.target.value = ""; }} style={{ fontSize: 11, border: "1px solid #bfdbfe", borderRadius: 4, padding: "2px 6px" }}>
            <option value="">手動選択...</option>
            {PROJECT_STATUSES.filter(s => s !== p.status).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* フロー進捗 */}
      <div style={section}><table style={table}><tbody><tr>
        {CONSTRUCTION_FLOW_STEPS.map((s) => <td key={s.step} style={{ ...cell, textAlign: "center", fontSize: 10, padding: "4px 2px", background: s.step <= currentStep ? "#ecfdf5" : "transparent", fontWeight: s.step === currentStep ? 700 : 400, color: s.step <= currentStep ? "#059669" : "#d1d5db" }}>{s.label}</td>)}
      </tr></tbody></table></div>

      {/* 3列 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><div style={shead}>案件情報</div><table style={table}><tbody>
          {infoRows.map(([k, v]) => <tr key={k}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{k}</td><td style={{ ...cell, fontWeight: 500 }}>{v || "-"}</td></tr>)}
          {p.notes && <tr><td style={{ ...cell, color: "#6b7280" }}>備考</td><td style={cell}>{p.notes}</td></tr>}
        </tbody></table></div>

        <div style={section}><div style={shead}>日程管理（クリックで編集）</div><table style={table}><tbody>
          {schedRows.map(([k, v, field]) => <tr key={k}>
            <td style={{ ...cell, color: "#6b7280", width: "40%" }}>{k}</td>
            <td style={cell}>
              <input type="date" defaultValue={v || ""} onBlur={(e) => updateField(field, e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 3, padding: "1px 4px", fontSize: 11, width: "100%", color: v ? "#1f2937" : "#f87171" }} />
            </td>
          </tr>)}
          <tr><td style={{ ...cell, color: "#6b7280" }}>着工Ready</td><td style={{ ...cell, fontWeight: 700, color: p.readyStatus === "Ready" ? "#16a34a" : "#d1d5db" }}>{p.readyStatus || "未確認"}</td></tr>
        </tbody></table></div>

        <div style={section}><div style={shead}>資材・完了報告</div><table style={table}><tbody>
          {matRows.map(([k, v, field]) => <tr key={k}>
            <td style={{ ...cell, color: "#6b7280" }}>{k}</td>
            <td style={cell}>
              <input type="date" defaultValue={v || ""} onBlur={(e) => updateField(field, e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 3, padding: "1px 4px", fontSize: 11, width: "100%", color: v ? "#1f2937" : "#f87171" }} />
            </td>
          </tr>)}
          <tr><td style={{ ...cell, color: "#6b7280" }}>産廃</td><td style={cell}>{p.wasteDisposal || "-"} {p.wasteDescription && `(${p.wasteDescription})`}</td></tr>
          <tr><td style={{ ...cell, color: "#6b7280" }}>報告書</td><td style={{ ...cell, fontWeight: 600, color: p.reportStatus === "承認済み" ? "#16a34a" : "#6b7280" }}>{p.reportStatus || "未作成"}</td></tr>
        </tbody></table></div>
      </div>

      {/* 安全書類 */}
      <div style={section}><div style={shead}>安全書類</div><table style={table}><thead><tr><th style={hcell}>ID</th><th style={hcell}>書類名</th><th style={hcell}>頻度</th><th style={hcell}>要否</th></tr></thead><tbody>{SAFETY_DOCUMENTS.map((d) => <tr key={d.id}><td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{d.id}</td><td style={cell}>{d.name}</td><td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{d.frequency}</td><td style={cell}><span style={badge(d.required === "必須" ? "#fee2e2" : "#f3f4f6", d.required === "必須" ? "#b91c1c" : "#6b7280")}>{d.required}</span></td></tr>)}</tbody></table></div>
    </div>
  );
}
