"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CHARGER_CATEGORIES, CHARGER_MANUFACTURERS, SUBSIDY_TYPES, APPLICATION_CATEGORIES, CONSTRUCTION_AREAS, PROJECT_TYPE_DETAILS } from "@/lib/constants";
import { createProject } from "@/lib/db";
import { invalidateProjectsCache } from "@/lib/useProjects";
import { section, shead, pageTitle } from "@/lib/styles";

const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", padding: "6px 8px", verticalAlign: "top", width: "22%" };
const inputCell: React.CSSProperties = { padding: "4px 8px" };
const input: React.CSSProperties = { width: "100%", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12 };
const select: React.CSSProperties = { ...input };

type Mode = "minimal" | "full";

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("full");
  const [selectedCategory, setSelectedCategory] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    // バリデーション
    const qty = Number(fd.get("qty"));
    if (!qty || qty < 1) { setError("設置台数は1以上で入力してください"); setSaving(false); return; }

    const startDate = fd.get("startDate") as string;
    const endDate = fd.get("endDate") as string;
    if (startDate && endDate && startDate > endDate) {
      setError("着工予定日は完工予定日より前である必要があります"); setSaving(false); return;
    }

    const wasteDisposal = fd.get("wasteDisposal") as string;
    const wasteDescription = fd.get("wasteDescription") as string;
    if (wasteDisposal === "有" && !wasteDescription?.trim()) {
      setError("産廃「有」の場合は荷姿/量/中身を入力してください"); setSaving(false); return;
    }

    const phone = (fd.get("siteManagerPhone") as string || "").replace(/[\s-]/g, "");
    if (phone && !/^\d{10,11}$/.test(phone)) {
      setError("現場担当電話の形式が不正です（10〜11桁の数字）"); setSaving(false); return;
    }

    try {
      invalidateProjectsCache();
      await createProject({
        // 基本情報
        caseId: fd.get("caseId"),
        nevId: fd.get("nevId"),
        subsidyType: fd.get("subsidyType"),
        name: fd.get("name"),
        prefecture: fd.get("pref"),
        location: fd.get("location"),
        applicationCategory: fd.get("appCat"),
        // 充電器
        constructionArea: fd.get("area"),
        chargerCategory: fd.get("chargerCat"),
        chargerManufacturer: fd.get("mfr"),
        chargerModel: fd.get("chargerModel"),
        quantity: qty,
        sekoManager: fd.get("sekoMgr"),
        // 担当者・施工会社
        salesDepartment: fd.get("salesDept"),
        caseManager: fd.get("caseMgr"),
        constructionManager: fd.get("constMgr"),
        contractor: fd.get("contractor"),
        // 日程（任意）
        orderDate: fd.get("orderDate"),
        preConstructionMeetingDate: fd.get("preConstructionMeetingDate"),
        preConstructionMeetingTime: fd.get("preConstructionMeetingTime"),
        safetyDocSubmitDate: fd.get("safetyDocSubmitDate"),
        chargerDeliveryRequestDate: fd.get("chargerDeliveryRequestDate"),
        signboardDeliveryRequestDate: fd.get("signboardDeliveryRequestDate"),
        startDate: fd.get("startDate"),
        endDate: fd.get("endDate"),
        powerReceptionDate: fd.get("powerReceptionDate"),
        blackoutDate: fd.get("blackoutDate"),
        blackoutTime: fd.get("blackoutTime"),
        // 現場担当（任意）
        siteManagerName: fd.get("siteManagerName"),
        siteManagerPhone: fd.get("siteManagerPhone"),
        // 産廃（任意）
        wasteDisposal: fd.get("wasteDisposal"),
        wasteDescription: fd.get("wasteDescription"),
        wastePickupDate: fd.get("wastePickupDate"),
        wastePickupTime: fd.get("wastePickupTime"),
        // 補足
        subsidy: fd.get("subsidy"),
        notes: fd.get("notes"),
      });
      router.push("/projects");
    } catch (err: any) {
      setError(err.message || "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  const showFull = mode === "full";

  return (
    <div>
      <Link href="/projects" style={{ fontSize: 11, color: "#059669", textDecoration: "none" }}>&larr; 案件一覧</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, marginBottom: 8 }}>
        <div style={{ ...pageTitle, marginBottom: 0 }}>📋 新規案件登録</div>
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={() => setMode("minimal")} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: "pointer", border: mode === "minimal" ? "1px solid #059669" : "1px solid #d1d5db", background: mode === "minimal" ? "#059669" : "white", color: mode === "minimal" ? "white" : "#4b5563" }}>最低限のみ</button>
          <button type="button" onClick={() => setMode("full")} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 500, cursor: "pointer", border: mode === "full" ? "1px solid #059669" : "1px solid #d1d5db", background: mode === "full" ? "#059669" : "white", color: mode === "full" ? "white" : "#4b5563" }}>フル入力</button>
        </div>
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* === 基本情報（常時表示） === */}
        <div style={section}>
          <div style={shead}>基本情報</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={labelStyle}>案件ID *</td><td style={inputCell}><input name="caseId" required style={input} placeholder="T05010" /></td>
                  <td style={labelStyle}>NevID</td><td style={inputCell}><input name="nevId" style={input} placeholder="205697" /></td></tr>
              <tr><td style={labelStyle}>補助金区分 *</td><td style={inputCell}><select name="subsidyType" required style={select}><option value="">選択</option>{SUBSIDY_TYPES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td style={labelStyle}>申請区分</td><td style={inputCell}><select name="appCat" style={select} onChange={(e) => setSelectedCategory(e.target.value)}><option value="">選択</option>{APPLICATION_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></td></tr>
              {(() => { const info = PROJECT_TYPE_DETAILS.find(t => t.type === selectedCategory); return info ? (
                <tr><td colSpan={4} style={{ padding: "0 8px 6px" }}>
                  <div style={{ background: "#f0fdf4", borderRadius: 4, padding: "6px 10px", fontSize: 10, color: "#374151", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 600, color: "#059669" }}>{info.type}</span>: {info.target}<br/>
                    充電器: {info.chargers} / 費用: {info.cost}
                  </div>
                </td></tr>
              ) : null; })()}
              <tr><td style={labelStyle}>案件名 *</td><td colSpan={3} style={inputCell}><input name="name" required style={input} placeholder="○○マンション EV充電器設置" /></td></tr>
              <tr><td style={labelStyle}>都道府県 *</td><td style={inputCell}><input name="pref" required style={input} placeholder="東京" /></td>
                  <td style={labelStyle}>住所 *</td><td style={inputCell}><input name="location" required style={input} placeholder="東京都港区芝浦3-1-1" /></td></tr>
            </tbody>
          </table>
        </div>

        {/* === 充電器情報（常時表示） === */}
        <div style={section}>
          <div style={shead}>充電器情報</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={labelStyle}>充電器種別 *</td><td style={inputCell}><select name="chargerCat" required style={select}><option value="">選択</option>{CHARGER_CATEGORIES.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}</select></td>
                  <td style={labelStyle}>メーカー</td><td style={inputCell}><select name="mfr" style={select}><option value="">選択</option>{CHARGER_MANUFACTURERS.map((m) => <option key={m.value} value={m.label}>{m.label}</option>)}</select></td></tr>
              <tr><td style={labelStyle}>型番</td><td style={inputCell}><input name="chargerModel" style={input} placeholder="EVPT-2G60J-F-L5" /></td>
                  <td style={labelStyle}>設置台数 *</td><td style={inputCell}><input name="qty" type="number" min={1} defaultValue={1} style={{ ...input, width: 80 }} /></td></tr>
              <tr><td style={labelStyle}>施工エリア</td><td style={inputCell}><select name="area" style={select}><option value="">選択</option>{CONSTRUCTION_AREAS.map((a) => <option key={a}>{a}</option>)}</select></td>
                  <td style={labelStyle}>Seko担当</td><td style={inputCell}><input name="sekoMgr" style={input} /></td></tr>
            </tbody>
          </table>
        </div>

        {/* === 担当者・施工会社（常時表示） === */}
        <div style={section}>
          <div style={shead}>担当者・施工会社</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={labelStyle}>営業担当部署</td><td style={inputCell}><input name="salesDept" style={input} /></td>
                  <td style={labelStyle}>案件担当</td><td style={inputCell}><input name="caseMgr" style={input} /></td></tr>
              <tr><td style={labelStyle}>施工管理</td><td style={inputCell}><input name="constMgr" style={input} /></td>
                  <td style={labelStyle}>施工会社</td><td style={inputCell}><input name="contractor" style={input} /></td></tr>
            </tbody>
          </table>
        </div>

        {/* === 以下フル入力モード時のみ === */}
        {showFull && (
          <>
            <div style={section}>
              <div style={shead}>📅 日程管理（任意・現場調査後に入力可）</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={labelStyle}>発注日</td><td style={inputCell}><input name="orderDate" type="date" style={input} /></td>
                      <td style={labelStyle}>安全書類提出予定</td><td style={inputCell}><input name="safetyDocSubmitDate" type="date" style={input} /></td></tr>
                  <tr><td style={labelStyle}>着工前会議日</td><td style={inputCell}><input name="preConstructionMeetingDate" type="date" style={input} /></td>
                      <td style={labelStyle}>会議時間</td><td style={inputCell}><input name="preConstructionMeetingTime" style={input} placeholder="10:00" /></td></tr>
                  <tr><td style={labelStyle}>充電器配送依頼日</td><td style={inputCell}><input name="chargerDeliveryRequestDate" type="date" style={input} /></td>
                      <td style={labelStyle}>看板配送依頼日</td><td style={inputCell}><input name="signboardDeliveryRequestDate" type="date" style={input} /></td></tr>
                  <tr><td style={labelStyle}>着工予定日</td><td style={inputCell}><input name="startDate" type="date" style={input} /></td>
                      <td style={labelStyle}>完工予定日</td><td style={inputCell}><input name="endDate" type="date" style={input} /></td></tr>
                  <tr><td style={labelStyle}>電力受電日</td><td style={inputCell}><input name="powerReceptionDate" type="date" style={input} /></td>
                      <td style={labelStyle}>停電日</td><td style={inputCell}><input name="blackoutDate" type="date" style={input} /></td></tr>
                  <tr><td style={labelStyle}>停電時間帯</td><td colSpan={3} style={inputCell}><input name="blackoutTime" style={input} placeholder="09:00-12:00" /></td></tr>
                </tbody>
              </table>
            </div>

            <div style={section}>
              <div style={shead}>👷 現場担当（任意）</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={labelStyle}>現場担当者名</td><td style={inputCell}><input name="siteManagerName" style={input} placeholder="山田太郎" /></td>
                      <td style={labelStyle}>電話番号</td><td style={inputCell}><input name="siteManagerPhone" style={input} placeholder="090-1234-5678" /></td></tr>
                </tbody>
              </table>
            </div>

            <div style={section}>
              <div style={shead}>🗑 産廃（任意）</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={labelStyle}>産廃</td><td style={inputCell}><select name="wasteDisposal" style={select}><option value="">選択</option><option value="有">有</option><option value="無">無</option></select></td>
                      <td style={labelStyle}>荷姿/量/中身</td><td style={inputCell}><input name="wasteDescription" style={input} placeholder="土嚢10袋(段ボール,電気線)" /></td></tr>
                  <tr><td style={labelStyle}>回収予定日</td><td style={inputCell}><input name="wastePickupDate" type="date" style={input} /></td>
                      <td style={labelStyle}>回収時間</td><td style={inputCell}><input name="wastePickupTime" style={input} placeholder="14:00" /></td></tr>
                </tbody>
              </table>
            </div>

            <div style={section}>
              <div style={shead}>💰 補助金・補足</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={labelStyle}>補助金額・特記</td><td colSpan={3} style={inputCell}><input name="subsidy" style={input} placeholder="100万円" /></td></tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={section}>
          <div style={shead}>備考</div>
          <div style={{ padding: 8 }}><textarea name="notes" rows={3} style={{ ...input, resize: "vertical" }} placeholder="現場調査のメモ、特記事項など" /></div>
        </div>

        <button type="submit" disabled={saving} style={{ background: saving ? "#9ca3af" : "#059669", color: "white", padding: "8px 24px", borderRadius: 4, fontSize: 13, fontWeight: 600, border: "none", cursor: saving ? "default" : "pointer", marginTop: 4 }}>
          {saving ? "保存中..." : "案件を登録"}
        </button>
      </form>
    </div>
  );
}
