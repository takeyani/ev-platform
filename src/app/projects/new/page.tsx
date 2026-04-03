import Link from "next/link";
import { CHARGER_CATEGORIES, CHARGER_MANUFACTURERS, SUBSIDY_TYPES, APPLICATION_CATEGORIES, CONSTRUCTION_AREAS } from "@/lib/constants";
import { section, shead, pageTitle } from "@/lib/styles";

const label: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "#374151", padding: "6px 8px", verticalAlign: "top", width: "30%" };
const inputCell: React.CSSProperties = { padding: "4px 8px" };
const input: React.CSSProperties = { width: "100%", padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12 };
const select: React.CSSProperties = { ...input };

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/projects" style={{ fontSize: 11, color: "#059669", textDecoration: "none" }}>&larr; 案件一覧</Link>
      <div style={{ ...pageTitle, marginTop: 6 }}>📋 新規案件登録</div>

      <form>
        <div style={section}>
          <div style={shead}>基本情報</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={label}>案件ID *</td><td style={inputCell}><input name="caseId" required style={input} placeholder="T05010" /></td>
                  <td style={label}>NevID</td><td style={inputCell}><input name="nevId" style={input} placeholder="205697" /></td></tr>
              <tr><td style={label}>補助金区分 *</td><td style={inputCell}><select name="subsidyType" style={select}><option value="">選択</option>{SUBSIDY_TYPES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  <td style={label}>申請区分</td><td style={inputCell}><select name="appCat" style={select}><option value="">選択</option>{APPLICATION_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></td></tr>
              <tr><td style={label}>案件名 *</td><td colSpan={3} style={inputCell}><input name="name" required style={input} placeholder="○○マンション EV充電器設置" /></td></tr>
              <tr><td style={label}>都道府県 *</td><td style={inputCell}><input name="pref" required style={input} placeholder="東京" /></td>
                  <td style={label}>住所 *</td><td style={inputCell}><input name="location" required style={input} placeholder="東京都港区芝浦3-1-1" /></td></tr>
            </tbody>
          </table>
        </div>

        <div style={section}>
          <div style={shead}>充電器情報</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={label}>充電器種別 *</td><td style={inputCell}><select name="chargerCat" style={select}><option value="">選択</option>{CHARGER_CATEGORIES.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}</select></td>
                  <td style={label}>メーカー</td><td style={inputCell}><select name="mfr" style={select}><option value="">選択</option>{CHARGER_MANUFACTURERS.map((m) => <option key={m.value} value={m.label}>{m.label}</option>)}</select></td></tr>
              <tr><td style={label}>設置台数 *</td><td style={inputCell}><input name="qty" type="number" min={1} defaultValue={1} style={{ ...input, width: 80 }} /></td>
                  <td style={label}>施工エリア</td><td style={inputCell}><select name="area" style={select}><option value="">選択</option>{CONSTRUCTION_AREAS.map((a) => <option key={a}>{a}</option>)}</select></td></tr>
            </tbody>
          </table>
        </div>

        <div style={section}>
          <div style={shead}>担当者・施工会社</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td style={label}>営業担当部署</td><td style={inputCell}><input name="salesDept" style={input} /></td>
                  <td style={label}>案件担当</td><td style={inputCell}><input name="caseMgr" style={input} /></td></tr>
              <tr><td style={label}>施工管理</td><td style={inputCell}><input name="constMgr" style={input} /></td>
                  <td style={label}>施工会社</td><td style={inputCell}><input name="contractor" style={input} /></td></tr>
            </tbody>
          </table>
        </div>

        <div style={section}>
          <div style={shead}>備考</div>
          <div style={{ padding: 8 }}><textarea name="notes" rows={2} style={{ ...input, resize: "vertical" }} /></div>
        </div>

        <button type="submit" style={{ background: "#059669", color: "white", padding: "6px 20px", borderRadius: 4, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", marginTop: 4 }}>案件を登録</button>
      </form>
    </div>
  );
}
