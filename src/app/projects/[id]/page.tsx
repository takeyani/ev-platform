"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CONSTRUCTION_FLOW_STEPS, SAFETY_DOCUMENTS, SAMPLE_PROJECTS, PROJECT_STATUSES } from "@/lib/constants";
import type { Project } from "@/lib/constants";
import { fetchProject, updateProject, deleteProject } from "@/lib/db";
import { invalidateProjectsCache } from "@/lib/useProjects";
import { suggestNextStatus } from "@/lib/automation";
import { getUserProfile, canEdit, canDelete, canUploadFiles, type UserProfile } from "@/lib/auth";
import { cell, hcell, section, shead, table, pageTitle, statusBadge, badge } from "@/lib/styles";
import FileUploader from "@/components/FileUploader";

const btn = (bg: string, color: string = "white"): React.CSSProperties => ({
  background: bg, color, border: "none", borderRadius: 4, padding: "4px 12px",
  fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block",
});

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  function load() {
    setLoading(true);
    fetchProject(id)
      .then(setP)
      .catch(() => { const fb = SAMPLE_PROJECTS.find((x) => x.id === id); if (fb) setP(fb); })
      .finally(() => setLoading(false));
  }
  useEffect(load, [id]);
  useEffect(() => { getUserProfile().then(setProfile).catch(() => {}); }, []);

  async function changeStatus(newStatus: string) {
    if (!p) return;
    setSaving(true); setMsg("");
    try {
      await updateProject(p.id, { status: newStatus });
      invalidateProjectsCache();
      setP({ ...p, status: newStatus as Project["status"] });
      setMsg(`✅ ${newStatus} に更新しました`);
      setTimeout(() => setMsg(""), 3000);
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function saveField(dbField: string, value: string) {
    if (!p) return;
    setSaving(true);
    try {
      await updateProject(p.id, { [dbField]: value || null });
      invalidateProjectsCache();
      load(); // reload from DB
      setMsg("✅ 保存しました"); setTimeout(() => setMsg(""), 2000);
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!p || !confirm(`「${p.name}」を削除しますか？この操作は取り消せません。`)) return;
    try {
      await deleteProject(p.id);
      invalidateProjectsCache();
      router.push("/projects");
    } catch (e: any) { setMsg(`❌ ${e.message}`); }
  }

  if (loading) return <div style={pageTitle}>読み込み中...</div>;
  if (!p) return <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>案件が見つかりません</div><Link href="/projects" style={{ color: "#059669" }}>← 案件一覧に戻る</Link></div>;

  const editable = !profile || canEdit(profile.role);
  const uploadable = !profile || canUploadFiles(profile.role);
  const statusToStep: Record<string, number> = { "交付決定待ち": 0, "交付決定済み": 1, "施工発注済み": 3, "日程調整中": 4, "着工前会議完了": 5, "安全書類提出済み": 6, "着工Ready": 8, "施工中": 9, "完了報告待ち": 10, "報告書確認中": 10, "検収完了": 11, "請求済み": 11 };
  const currentStep = statusToStep[p.status] ?? 0;
  const nextStatus = suggestNextStatus(p);

  const fieldStyle: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 3, padding: "1px 4px", fontSize: 11, width: "100%" };
  const dateField = (label: string, value: string, dbField: string) => (
    <tr key={label}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{label}</td><td style={cell}>
      {editable ? <input type="date" defaultValue={value || ""} onBlur={(e) => saveField(dbField, e.target.value)}
        style={{ ...fieldStyle, color: value ? "#1f2937" : "#f87171" }} /> : <span style={{ fontSize: 11 }}>{value || "-"}</span>}
    </td></tr>
  );
  const textField = (label: string, value: string, dbField: string, placeholder?: string) => (
    <tr key={label}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{label}</td><td style={cell}>
      {editable ? <input type="text" defaultValue={value || ""} onBlur={(e) => saveField(dbField, e.target.value)} placeholder={placeholder}
        style={{ ...fieldStyle, color: value ? "#1f2937" : "#9ca3af" }} /> : <span style={{ fontSize: 11 }}>{value || "-"}</span>}
    </td></tr>
  );

  return (
    <div>
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Link href="/projects" style={btn("#e5e7eb", "#374151")}>← 案件一覧</Link>
        <Link href="/drawings" style={btn("#eff6ff", "#2563eb")}>📐 図面管理</Link>
        <Link href="/safety" style={btn("#fef3c7", "#92400e")}>🦺 安全書類</Link>
        <Link href="/reports" style={btn("#f0fdf4", "#166534")}>✅ 完了報告</Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div><div style={{ fontSize: 10, color: "#9ca3af" }}>{p.caseId} | {p.subsidyType} | {p.constructionArea}</div><div style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{p.location}</div></div>
        <div style={{ textAlign: "right" }}>
          <span style={statusBadge(p.status)}>{p.status}</span>
          {msg && <div style={{ fontSize: 10, marginTop: 4, color: msg.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{msg}</div>}
        </div>
      </div>

      {/* ステータス変更バー */}
      {editable && (
        <div style={{ ...section, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>ステータス変更:</span>
            {nextStatus && <button onClick={() => changeStatus(nextStatus)} disabled={saving} style={btn("#059669")}>→ {nextStatus}（推奨）</button>}
            <select onChange={(e) => { if (e.target.value) changeStatus(e.target.value); e.target.value = ""; }} style={{ fontSize: 11, border: "1px solid #bfdbfe", borderRadius: 4, padding: "3px 6px" }}>
              <option value="">手動選択...</option>
              {PROJECT_STATUSES.filter(s => s !== p.status).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {(!profile || canDelete(profile.role)) && (
              <button onClick={handleDelete} style={{ ...btn("#dc2626"), marginLeft: "auto" }}>🗑 案件削除</button>
            )}
          </div>
        </div>
      )}

      {/* フロー進捗 */}
      <div style={section}><table style={table}><tbody><tr>
        {CONSTRUCTION_FLOW_STEPS.map((s) => <td key={s.step} style={{ ...cell, textAlign: "center", fontSize: 10, padding: "4px 2px", background: s.step <= currentStep ? "#ecfdf5" : "transparent", fontWeight: s.step === currentStep ? 700 : 400, color: s.step <= currentStep ? "#059669" : "#d1d5db" }}>{s.label}</td>)}
      </tr></tbody></table></div>

      {/* 3列: 案件情報 / 日程 / 資材 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={section}><div style={shead}>案件情報</div><table style={table}><tbody>
          {[["充電器", p.chargerCategory], ["メーカー", `${p.chargerManufacturer} ${p.chargerModel}`], ["台数", `${p.quantity}台`], ["施工会社", p.contractor], ["補助金", p.subsidyType], ["申請区分", p.applicationCategory], ["案件担当", p.caseManager], ["施工管理", p.constructionManager]].map(([k, v]) => <tr key={k}><td style={{ ...cell, color: "#6b7280", width: "40%" }}>{k}</td><td style={{ ...cell, fontWeight: 500 }}>{v || "-"}</td></tr>)}
          {p.notes && <tr><td style={{ ...cell, color: "#6b7280" }}>備考</td><td style={cell}>{p.notes}</td></tr>}
        </tbody></table></div>

        <div style={section}><div style={shead}>📅 日程管理（日付をクリックして編集）</div><table style={table}><tbody>
          {dateField("発注日", p.orderDate, "order_date")}
          {dateField("着工前会議", p.preConstructionMeetingDate, "pre_construction_meeting_date")}
          {textField("会議時間", p.preConstructionMeetingTime, "pre_construction_meeting_time", "10:00")}
          {dateField("安全書類提出", p.safetyDocSubmitDate, "safety_doc_submit_date")}
          {dateField("着工予定日", p.startDate, "start_date")}
          {dateField("完工予定日", p.endDate, "end_date")}
          {dateField("電力受電日", p.powerReceptionDate, "power_reception_date")}
          {dateField("停電日", p.blackoutDate, "blackout_date")}
          {textField("停電時間帯", p.blackoutTime, "blackout_time", "09:00-12:00")}
          {dateField("Ready確認日", p.readyConfirmDate, "ready_confirm_date")}
          <tr><td style={{ ...cell, color: "#6b7280" }}>Ready</td><td style={{ ...cell, fontWeight: 700, color: p.readyStatus === "Ready" ? "#16a34a" : "#d1d5db" }}>{p.readyStatus || "未確認"}</td></tr>
        </tbody></table></div>

        <div style={section}><div style={shead}>📦 資材・完了報告</div><table style={table}><tbody>
          {dateField("充電器配送依頼", p.chargerDeliveryRequestDate, "charger_delivery_request_date")}
          {dateField("看板配送依頼", p.signboardDeliveryRequestDate, "signboard_delivery_request_date")}
          {dateField("充電器納品確認", p.chargerDeliveryConfirmDate, "charger_delivery_confirm_date")}
          {dateField("看板納品確認", p.signboardDeliveryConfirmDate, "signboard_delivery_confirm_date")}
          {dateField("電材確保確認", p.materialConfirmDate, "material_confirm_date")}
          {dateField("実着工日", p.actualStartDate, "actual_start_date")}
          {dateField("実完工日", p.actualEndDate, "actual_end_date")}
          <tr><td style={{ ...cell, color: "#6b7280" }}>産廃</td><td style={cell}>{p.wasteDisposal || "-"} {p.wasteDescription && `(${p.wasteDescription})`}</td></tr>
          {dateField("産廃回収日", p.wastePickupDate, "waste_pickup_date")}
          {textField("産廃回収時間", p.wastePickupTime, "waste_pickup_time", "14:00")}
          {dateField("完了報告日", p.completionReportDate, "completion_report_date")}
          {dateField("報告書承認日", p.reportApprovalDate, "report_approval_date")}
          <tr><td style={{ ...cell, color: "#6b7280" }}>報告書</td><td style={{ ...cell, fontWeight: 600, color: p.reportStatus === "承認済み" ? "#16a34a" : "#6b7280" }}>{p.reportStatus || "未作成"}</td></tr>
        </tbody></table></div>
      </div>

      {/* ファイルアップロード 3列 */}
      {uploadable && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <FileUploader bucket="drawings" folder={p.caseId} label="📐 図面ファイル" accept=".pdf,.png,.jpg,.dwg,.dxf" />
          <FileUploader bucket="documents" folder={p.caseId} label="📄 安全書類" accept=".pdf,.xlsx,.xls,.doc,.docx" />
          <FileUploader bucket="photos" folder={p.caseId} label="📷 工事写真" accept=".jpg,.jpeg,.png,.heic" />
        </div>
      )}

      {/* 安全書類チェック */}
      <div style={section}><div style={shead}>🦺 安全書類チェック（{SAFETY_DOCUMENTS.length}種類）— <Link href="/safety" style={{ color: "#059669", textDecoration: "none", fontSize: 10 }}>安全書類管理ページへ →</Link></div><table style={table}><thead><tr><th style={hcell}>ID</th><th style={hcell}>書類名</th><th style={hcell}>頻度</th><th style={hcell}>要否</th></tr></thead><tbody>{SAFETY_DOCUMENTS.map((d) => <tr key={d.id}><td style={{ ...cell, fontFamily: "monospace", color: "#9ca3af" }}>{d.id}</td><td style={cell}>{d.name}</td><td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{d.frequency}</td><td style={cell}><span style={badge(d.required === "必須" ? "#fee2e2" : "#f3f4f6", d.required === "必須" ? "#b91c1c" : "#6b7280")}>{d.required}</span></td></tr>)}</tbody></table></div>
    </div>
  );
}
