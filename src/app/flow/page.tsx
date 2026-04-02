import {
  CONSTRUCTION_FLOW_STEPS,
  SAFETY_DOCUMENTS,
  DRAWING_TYPES,
  INSPECTION_REQUIREMENTS,
  PRE_CONSTRUCTION_MEETING_ITEMS,
  PHOTO_CHECK_ITEMS,
} from "@/lib/constants";

export default function FlowPage() {
  // フロー詳細データ
  const flowDetails: Record<number, { who: string; what: string[]; deadline: string; tools: string; docs: string[] }> = {
    1: {
      who: "テラ＆補助金団体",
      what: ["補助金団体からの交付決定を確認", "充電器送付情報確認（送付先住所・納入希望日）"],
      deadline: "-",
      tools: "進捗共有シート",
      docs: [],
    },
    2: {
      who: "テラ営業 → お客様",
      what: ["交付決定連絡", "日程調整開始の連絡", "※正式発注前の先行連絡は禁止"],
      deadline: "交付決定次第、順次",
      tools: "メール / 電話",
      docs: [],
    },
    3: {
      who: "テラ → 協力会社",
      what: ["正式な施工発注（メール+発注書添付）", "協力会社は施工受注"],
      deadline: "正式発注後に日程調整開始",
      tools: "メール（発注書PDF）",
      docs: ["発注書"],
    },
    4: {
      who: "案件担当 / 協力会社",
      what: ["着工前会議日程の調整", "施工日程の調整", "テラ調整 or 協力会社調整（案件毎に確認）"],
      deadline: "-",
      tools: "進捗共有シート",
      docs: [],
    },
    5: {
      who: "お客様 × テラ × 協力会社",
      what: [
        "必ずお客様と実施（現地 / Web / 電話）",
        "テラ参加必要案件は三者間調整",
        "議事録作成必須",
        "工事概要・工程説明",
        "停電日・主技立会・電力申請の確認",
        "車両移動・工事告知・ポスティング",
        "石綿調査（レベル1/2/3）",
        "入館方法・緊急連絡先確認",
        "エレベーター・宅配ボックス影響確認",
      ],
      deadline: "議事録: 会議後2営業日以内にKizukuへ提出",
      tools: "Kizuku（議事録提出）",
      docs: ["着工前議事録"],
    },
    6: {
      who: "協力会社 → Kizuku",
      what: [
        "14種類の安全書類を提出",
        "年度毎書類（5種）: 許可証、登録証、安全衛生誓約書、施工体制台帳、再下請負通知書",
        "工事毎書類（9種）: 着工前確認、下請業者編成表、作業員名簿、資格者証、緊急連絡票、KYシート等",
      ],
      deadline: "着工1週間前まで",
      tools: "Kizuku（Excel/PDF提出）",
      docs: SAFETY_DOCUMENTS.map((d) => `${d.id} ${d.name}`),
    },
    7: {
      who: "テラ（充電器発送）/ 協力会社（資材確保）",
      what: [
        "充電器の送付先・納入希望日を進捗シートに入力",
        "充電器型式・台数の確認",
        "電材/案内板/基礎工事等の材料確保",
        "QRシール管理（新モデル: 貼付済み / 23年モデル: 現場貼付）",
        "産廃回収手配（テラが手配）",
      ],
      deadline: "送付先入力: 工事1ヶ月前 / 全資材確保: 着工1週間前",
      tools: "進捗共有シート",
      docs: [],
    },
    8: {
      who: "テラ ＆ 協力会社",
      what: [
        "全入力項目の完了を自動判定",
        "テラ確認で「着工Ready」確定",
        "チェック項目: 着工/完工予定日、現場担当者、産廃情報、安全書類、充電器納品、電材確保",
      ],
      deadline: "全項目充足で自動Ready判定",
      tools: "進捗共有シート（自動判定列）",
      docs: [],
    },
    9: {
      who: "協力会社（施工）/ テラ（確認）",
      what: [
        "毎日: 作業開始連絡・作業内容報告",
        "毎日: 工事写真の適宜提出",
        "毎日: 工事終了の目安時間連絡・終了連絡",
        "変更発生時: 直ちにテラへ連絡 → 補助金確認まで工事中断",
        "お客様に充電器・分電盤の鍵を引渡し（3kWは不要）",
      ],
      deadline: "Kizuku応答なし20分以上→案件担当へ電話",
      tools: "Kizuku（トーク・写真）/ 電話",
      docs: [],
    },
    10: {
      who: "協力会社 → Kizuku",
      what: [
        "工事完了報告書をKizukuで作成",
        "写真撮影チェックシートの全項目を提出",
        "完成図面4種の提出（変更があれば変更図面も）",
        "報告書の「承認依頼」をクリック",
      ],
      deadline: "完工後3営業日以内",
      tools: "Kizuku（報告書機能）",
      docs: ["工事完了報告書", "写真撮影チェックシート", ...DRAWING_TYPES.map((d) => `完成${d}`), "安全書類"],
    },
    11: {
      who: "テラ（検収）→ 協力会社（請求）",
      what: [
        "テラが報告書を精査（営業・補助金・施工管理の3観点）",
        "基準クリアで承認 / 不備あれば差戻",
        "承認後、協力会社が請求書PDFを送付",
        "現調費/図面費と工事費は分けて発行",
      ],
      deadline: "毎月20日: 承認依頼 → 25日: 承認 → 月初2営業日: 請求書",
      tools: "Kizuku（承認）/ メール（請求書PDF）",
      docs: ["請求書PDF"],
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">業務フロー詳細</h1>
        <p className="text-sm text-gray-500 mt-1">Terra Charge EV充電器施工管理 - 工事全体フロー（11ステップ）</p>
      </div>

      {/* フロー概要 */}
      <div className="bg-white rounded-xl border p-5 shadow-sm">
        <h2 className="font-bold text-sm mb-4">全体フロー概要</h2>
        <div className="flex items-start gap-1 overflow-x-auto pb-2">
          {CONSTRUCTION_FLOW_STEPS.map((step, i) => (
            <div key={step.step} className="flex items-center gap-1 flex-shrink-0">
              <div className="text-center min-w-[80px]">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold mx-auto">{step.step}</div>
                <p className="text-xs font-medium text-gray-900 mt-1">{step.label}</p>
                <p className="text-[9px] text-gray-400">{step.sub}</p>
                <p className="text-[9px] text-emerald-600 font-medium">{step.responsible}</p>
              </div>
              {i < CONSTRUCTION_FLOW_STEPS.length - 1 && <span className="text-emerald-300 text-lg mt-[-8px]">&rarr;</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 各ステップ詳細 */}
      {CONSTRUCTION_FLOW_STEPS.map((step) => {
        const detail = flowDetails[step.step];
        if (!detail) return null;

        const phaseColor = step.step <= 3 ? "border-blue-300 bg-blue-50"
          : step.step <= 8 ? "border-amber-300 bg-amber-50"
          : step.step <= 10 ? "border-emerald-300 bg-emerald-50"
          : "border-purple-300 bg-purple-50";

        const phaseLabel = step.step <= 3 ? "工事前（発注）"
          : step.step <= 8 ? "工事前（準備）"
          : step.step <= 10 ? "工事中〜完了"
          : "検収・請求";

        return (
          <div key={step.step} className={`rounded-xl border-2 ${phaseColor} overflow-hidden`}>
            {/* ヘッダー */}
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-500 text-emerald-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{step.label}</h2>
                  <span className="text-xs bg-white/80 text-gray-500 px-2 py-0.5 rounded">{phaseLabel}</span>
                </div>
                <p className="text-sm text-gray-600">{step.sub}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p className="font-medium">{detail.who}</p>
              </div>
            </div>

            {/* 詳細 */}
            <div className="px-6 pb-5 grid grid-cols-3 gap-4">
              {/* 実施内容 */}
              <div className="col-span-2 bg-white rounded-lg p-4">
                <h3 className="text-xs font-bold text-gray-500 mb-2">実施内容</h3>
                <ul className="space-y-1">
                  {detail.what.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#8226;</span>
                      <span className={`text-gray-700 ${item.startsWith("※") ? "text-red-600 font-medium" : ""}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* メタ情報 */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <h3 className="text-xs font-bold text-gray-500 mb-1">期限・タイミング</h3>
                  <p className="text-sm text-gray-700">{detail.deadline}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <h3 className="text-xs font-bold text-gray-500 mb-1">使用ツール</h3>
                  <p className="text-sm text-gray-700">{detail.tools}</p>
                </div>
                {detail.docs.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <h3 className="text-xs font-bold text-gray-500 mb-1">必要書類</h3>
                    <div className="space-y-0.5">
                      {detail.docs.slice(0, 6).map((doc) => (
                        <p key={doc} className="text-xs text-gray-600">{doc}</p>
                      ))}
                      {detail.docs.length > 6 && (
                        <p className="text-xs text-gray-400">...他{detail.docs.length - 6}件</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* 期限ルール一覧 */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">期限ルール一覧</h2>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2 font-medium text-gray-600">ルール</th>
              <th className="text-left py-2 font-medium text-gray-600">期限</th>
              <th className="text-left py-2 font-medium text-gray-600">ステップ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { rule: "材料送付先入力", deadline: "工事1ヶ月前", step: "Step 7" },
              { rule: "全資材確保", deadline: "着工1週間前", step: "Step 7" },
              { rule: "安全書類提出（Kizuku）", deadline: "着工1週間前", step: "Step 6" },
              { rule: "着工前議事録提出", deadline: "会議後2営業日以内", step: "Step 5" },
              { rule: "完了報告書提出", deadline: "完工後3営業日以内", step: "Step 10" },
              { rule: "図面提出＋報告書承認依頼", deadline: "毎月20日", step: "Step 11" },
              { rule: "承認完了（請求対象確定）", deadline: "毎月25日", step: "Step 11" },
              { rule: "請求書PDF送付", deadline: "月初2営業日以内", step: "Step 11" },
            ].map((r) => (
              <tr key={r.rule}>
                <td className="py-2 text-gray-900">{r.rule}</td>
                <td className="py-2 text-red-600 font-medium">{r.deadline}</td>
                <td className="py-2 text-gray-500">{r.step}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 着工前会議チェックリスト */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">着工前会議 議事録項目（Step 5）</h2>
        <div className="grid grid-cols-2 gap-4">
          {PRE_CONSTRUCTION_MEETING_ITEMS.map((cat) => (
            <div key={cat.category} className="border rounded-lg p-4">
              <h3 className="font-medium text-sm text-gray-900 mb-2">{cat.category}</h3>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded border border-gray-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 写真チェックシート */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-bold mb-4">写真撮影チェックシート（Step 10）</h2>
        <div className="grid grid-cols-2 gap-2">
          {PHOTO_CHECK_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5 text-xs">
              <span className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
