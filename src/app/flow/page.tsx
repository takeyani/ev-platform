import { CONSTRUCTION_FLOW_STEPS, SAFETY_DOCUMENTS, DRAWING_TYPES, PRE_CONSTRUCTION_MEETING_ITEMS, PHOTO_CHECK_ITEMS } from "@/lib/constants";
import { cell, hcell, hcellG, section, shead, table, pageTitle, grid2 } from "@/lib/styles";

const flowDetails: Record<number, { who: string; what: string; deadline: string; tools: string }> = {
  1: { who: "テラ＆補助金団体", what: "補助金交付決定確認、充電器送付情報確認", deadline: "-", tools: "進捗シート" },
  2: { who: "テラ営業→お客様", what: "交付決定連絡、日程調整開始（先行連絡禁止）", deadline: "交付決定次第", tools: "メール/電話" },
  3: { who: "テラ→協力会社", what: "施工発注（メール+発注書添付）", deadline: "正式発注後に日程調整", tools: "メール" },
  4: { who: "案件担当/協力会社", what: "着工前会議・施工日程の調整", deadline: "-", tools: "進捗シート" },
  5: { who: "三者間", what: "着工前会議（現地/Web/電話）、議事録作成必須", deadline: "議事録: 会議後2営業日以内", tools: "Kizuku" },
  6: { who: "協力会社→Kizuku", what: "安全書類14種を提出（Excel/PDF）", deadline: "着工1週間前まで", tools: "Kizuku" },
  7: { who: "テラ&協力会社", what: "充電器発送、QRシール管理、電材確保、産廃手配", deadline: "送付先:1ヶ月前 / 資材:1週間前", tools: "進捗シート" },
  8: { who: "テラ&協力会社", what: "全項目充足で自動Ready判定→テラ確認", deadline: "全項目充足時", tools: "進捗シート(自動)" },
  9: { who: "協力会社/テラ確認", what: "毎日:開始連絡・写真・終了連絡、変更時:工事中断", deadline: "応答20分なし→電話", tools: "Kizuku/電話" },
  10: { who: "協力会社→Kizuku", what: "完了報告書+写真チェックシート+完成図面4種", deadline: "完工後3営業日以内", tools: "Kizuku" },
  11: { who: "テラ→協力会社", what: "報告書精査→承認/差戻→請求書PDF送付", deadline: "20日承認依頼→25日承認→月初2営業日請求", tools: "Kizuku/メール" },
};

export default function FlowPage() {
  return (
    <div>
      <div style={pageTitle}>🔄 業務フロー詳細（11ステップ）</div>

      {/* 全体フロー */}
      <div style={section}>
        <div style={shead}>工事全体フロー</div>
        <table style={table}>
          <thead><tr><th style={hcellG}>No</th><th style={hcellG}>ステップ</th><th style={hcellG}>担当</th><th style={hcellG}>実施内容</th><th style={hcellG}>期限</th><th style={hcellG}>ツール</th></tr></thead>
          <tbody>{CONSTRUCTION_FLOW_STEPS.map((s) => {
            const d = flowDetails[s.step];
            return (<tr key={s.step}>
              <td style={{ ...cell, textAlign: "center", fontWeight: 700, color: "#059669" }}>{s.step}</td>
              <td style={{ ...cell, fontWeight: 600 }}>{s.label}</td>
              <td style={{ ...cell, color: "#6b7280", fontSize: 10 }}>{d?.who}</td>
              <td style={cell}>{d?.what}</td>
              <td style={{ ...cell, color: "#dc2626", fontSize: 10 }}>{d?.deadline}</td>
              <td style={{ ...cell, color: "#2563eb", fontSize: 10 }}>{d?.tools}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>

      {/* 期限ルール */}
      <div style={grid2}>
        <div style={section}>
          <div style={shead}>期限ルール一覧</div>
          <table style={table}>
            <thead><tr><th style={hcell}>ルール</th><th style={hcell}>期限</th><th style={hcell}>Step</th></tr></thead>
            <tbody>{[
              { rule: "材料送付先入力", deadline: "工事1ヶ月前", step: "7" },
              { rule: "全資材確保", deadline: "着工1週間前", step: "7" },
              { rule: "安全書類提出", deadline: "着工1週間前", step: "6" },
              { rule: "着工前議事録提出", deadline: "会議後2営業日以内", step: "5" },
              { rule: "完了報告書提出", deadline: "完工後3営業日以内", step: "10" },
              { rule: "図面提出＋承認依頼", deadline: "毎月20日", step: "11" },
              { rule: "承認完了", deadline: "毎月25日", step: "11" },
              { rule: "請求書PDF送付", deadline: "月初2営業日以内", step: "11" },
            ].map((r) => (
              <tr key={r.rule}><td style={cell}>{r.rule}</td><td style={{ ...cell, color: "#dc2626", fontWeight: 600 }}>{r.deadline}</td><td style={{ ...cell, textAlign: "center" }}>{r.step}</td></tr>
            ))}</tbody>
          </table>
        </div>

        {/* 着工前会議チェック */}
        <div style={section}>
          <div style={shead}>着工前会議 議事録項目（Step 5）</div>
          <table style={table}>
            <thead><tr><th style={hcell}>カテゴリ</th><th style={hcell}>確認項目</th></tr></thead>
            <tbody>{PRE_CONSTRUCTION_MEETING_ITEMS.map((cat) => (
              <tr key={cat.category}>
                <td style={{ ...cell, fontWeight: 600, verticalAlign: "top" }}>{cat.category}</td>
                <td style={cell}>{cat.items.map((item) => <div key={item} style={{ fontSize: 10 }}>☐ {item}</div>)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {/* 写真チェック */}
      <div style={section}>
        <div style={shead}>写真撮影チェックシート（Step 10）</div>
        <table style={table}>
          <tbody>
            <tr>
              {[0, 1].map((col) => (
                <td key={col} style={{ ...cell, verticalAlign: "top", width: "50%" }}>
                  {PHOTO_CHECK_ITEMS.slice(col * 8, col * 8 + 8).map((item, i) => (
                    <div key={i} style={{ fontSize: 10, padding: "1px 0" }}>☐ {item}</div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
