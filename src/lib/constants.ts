// ============================================================
// Terra Charge EV充電器施工管理 - マスターデータ定義
// 実際の業務フロー・規則に基づく
// ============================================================

// --- 工事全体フロー（11ステップ） ---
export const CONSTRUCTION_FLOW_STEPS = [
  { step: 1, label: "交付決定確認", sub: "補助金団体→テラ", responsible: "テラ" },
  { step: 2, label: "お客様連絡", sub: "交付決定・日程調整開始", responsible: "テラ営業" },
  { step: 3, label: "施工発注", sub: "メール(発注書添付)", responsible: "テラ→協力会社" },
  { step: 4, label: "日程調整", sub: "着工前会議・施工日", responsible: "案件毎に確認" },
  { step: 5, label: "着工前会議", sub: "現地/Web/電話 議事録必須", responsible: "三者間" },
  { step: 6, label: "安全書類", sub: "着工1週間前まで", responsible: "協力会社→Kizuku" },
  { step: 7, label: "充電器発送", sub: "資材確保・産廃手配", responsible: "テラ&協力会社" },
  { step: 8, label: "着工Ready", sub: "準備完了確認", responsible: "テラ&協力会社" },
  { step: 9, label: "工事実施", sub: "Kizuku/電話で連絡", responsible: "協力会社" },
  { step: 10, label: "完了報告", sub: "完工後3営業日以内", responsible: "協力会社" },
  { step: 11, label: "検収・請求", sub: "報告書承認→請求", responsible: "テラ" },
] as const;

// --- プロジェクトステータス（実業務に準拠） ---
export const PROJECT_STATUSES = [
  "交付決定待ち",
  "交付決定済み",
  "施工発注済み",
  "日程調整中",
  "着工前会議完了",
  "安全書類提出済み",
  "着工Ready",
  "施工中",
  "完了報告待ち",
  "報告書確認中",
  "検収完了",
  "請求済み",
  "キャンセル",
  "延期",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// ステータス色はsrc/lib/styles.tsのstatusStyle/statusBadge()を使用

export const STATUS_GROUPS: Record<string, ProjectStatus[]> = {
  "全て": [...PROJECT_STATUSES],
  "工事前": ["交付決定待ち", "交付決定済み", "施工発注済み", "日程調整中", "着工前会議完了", "安全書類提出済み", "着工Ready"],
  "工事中": ["施工中"],
  "工事後": ["完了報告待ち", "報告書確認中", "検収完了", "請求済み"],
  "保留": ["キャンセル", "延期"],
};

// --- 補助金区分 ---
export const SUBSIDY_TYPES = [
  "R8 Nev",
  "R7 Nev",
  "R6 Nev 追加",
  "東京都",
  "自治体",
  "補助金無し",
  "キャンセル",
] as const;

export type SubsidyType = (typeof SUBSIDY_TYPES)[number];

// --- 申請区分 ---
export const APPLICATION_CATEGORIES = [
  "目的地充電",
  "基礎充電",
  "経路充電",
] as const;

// --- 充電器種別（実際の出力カテゴリ） ---
export const CHARGER_CATEGORIES = [
  { value: "3kw", label: "3kWコンセント" },
  { value: "6kw", label: "6kW普通充電器" },
  { value: "50kw", label: "50kW急速充電器" },
  { value: "90kw", label: "90kW急速充電器" },
  { value: "120kw", label: "120kW急速充電器" },
  { value: "150kw", label: "150kW急速充電器" },
  { value: "180kw", label: "180kW急速充電器" },
] as const;

// --- 充電器メーカー（実際の取扱メーカー） ---
export const CHARGER_MANUFACTURERS = [
  { value: "nitto", label: "日東工業", models: ["EVP-2G60J", "EVPT-2G60J", "EVPTC2G60J"] },
  { value: "kawamura", label: "河村電器産業", models: ["EVコンポα ECMT3-6X-5"] },
  { value: "daihen", label: "ダイヘン", models: ["DQC050LD", "DQC050M", "DQC120", "DQC180"] },
  { value: "nichicon", label: "ニチコン", models: ["NQC-TC504P", "NQD-UCX04P"] },
  { value: "shindengen", label: "新電元工業", models: ["SDQC2F50", "SDQC2F90", "SDQC2F90M", "SDQC2F150"] },
  { value: "noex", label: "NOEX", models: ["NXEV-0001 (TC 2024)"] },
  { value: "zerova", label: "Zerova", models: ["AW32 6kW", "AW32 9.6kW"] },
] as const;

// --- キュービクル ---
export const CUBICLE_SPECS = [
  { manufacturer: "河村電器産業", capacities: ["100kVA", "150kVA", "200kVA"], vctOptions: ["VCTあり", "VCTなし"] },
  { manufacturer: "日本電機産業", capacities: ["要確認"], vctOptions: [] },
] as const;

// --- 安全書類一覧（14種類） ---
export const SAFETY_DOCUMENTS = [
  { id: "A-1", name: "一般建設業許可証明書", required: "適宜", frequency: "年度毎", perProject: false },
  { id: "A-2", name: "登録電気工事業者登録証", required: "必須", frequency: "年度毎", perProject: false },
  { id: "B-1", name: "安全衛生誓約書", required: "必須", frequency: "年度毎/下請毎", perProject: false },
  { id: "B-2", name: "施工体制台帳", required: "必須", frequency: "年度毎", perProject: false },
  { id: "B-3", name: "再下請負通知書", required: "必須", frequency: "年度毎/下請毎", perProject: false },
  { id: "C-1", name: "工事提出資料・着工前確認事項", required: "必須", frequency: "工事毎", perProject: true },
  { id: "C-2", name: "下請負業者編成表", required: "必須", frequency: "工事毎", perProject: true },
  { id: "C-3", name: "作業員名簿", required: "必須", frequency: "工事毎/下請毎", perProject: true },
  { id: "C-4", name: "資格者証・免許・技能講習修了証台紙", required: "必須", frequency: "工事毎/作業員毎", perProject: true },
  { id: "C-5", name: "緊急時連絡票", required: "必須", frequency: "工事毎", perProject: true },
  { id: "D-1", name: "外国人届出書", required: "適宜", frequency: "工事毎/作業員毎", perProject: true },
  { id: "D-2", name: "高齢者就労報告書", required: "適宜", frequency: "工事毎/作業員毎", perProject: true },
  { id: "D-3", name: "年少者就労報告書", required: "適宜", frequency: "工事毎/作業員毎", perProject: true },
  { id: "E-1", name: "KY(危険予知活動表)シート", required: "必須", frequency: "工事毎/作業日毎", perProject: true },
] as const;

// --- 図面種別（4種 + 変更・完成） ---
export const DRAWING_TYPES = [
  "設置場所見取図",
  "平面図",
  "配線ルート図",
  "電気系統図",
] as const;

export const DRAWING_PREFIXES = {
  application: "", // 申請時
  change: "変更",  // 変更時
  completion: "完成", // 完工時
} as const;

// --- 断面図設置パターン ---
export const INSTALLATION_PATTERNS = [
  "アンカー",
  "ASアンカー",
  "ケミカルアンカー",
  "基礎(@500)",
  "基礎(@600)",
  "壁面",
] as const;

// --- 施工エリア ---
export const CONSTRUCTION_AREAS = [
  "東日本",
  "西日本",
] as const;

// --- 管轄部署 ---
export const DEPARTMENTS = [
  "急速 / 目的",
  "基礎 / 法人",
  "基礎 / 集合",
] as const;

// --- 着工前会議 議事録項目 ---
export const PRE_CONSTRUCTION_MEETING_ITEMS = [
  { category: "工事概要・内容説明", items: ["工程の説明", "着工日・完了日・予備日", "工事可能時間(音出し時間)", "停電日の有無", "主任技術者立会有無", "電力申請有無(受電日)"] },
  { category: "仮設計画の説明", items: ["各工事(基礎・配管・本体設置)毎の作業エリアと区画"] },
  { category: "車両移動・工事告知", items: ["車両移動の有無・方法", "工事告知時期と周知方法(掲示板・ポスティング)", "石綿作業有無・資格者確認"] },
  { category: "当日/緊急連絡先", items: ["緊急連絡先(営業日外・夜間等)"] },
  { category: "その他打合せ事項", items: ["駐車場工事期間中の車両移動", "荷物の移動・片付け", "入館方法(当日立会・連絡先)", "停電範囲・停電時の注意事項", "エレベーター稼働確認/宅配ボックス影響確認"] },
] as const;

// --- 施工関連規則・要領 ---
export const CONSTRUCTION_REGULATIONS = [
  { type: "工事規則", name: "Terra Charge工事要領【第2.1版】" },
  { type: "急速充電器", name: "Terra Charge急速工事要領【第0.2版】" },
  { type: "工事規則", name: "Terra Charge 工事規則" },
  { type: "完了報告", name: "工事完了報告規則" },
  { type: "現場調査", name: "現地調査規則【第6版】" },
  { type: "標準仕様", name: "EV充電設備新設工事 標準仕様書Ver1" },
  { type: "図面", name: "図面作成マニュアル（2026/3/26改訂）" },
  { type: "図面", name: "図面チェックリスト（2026/2/26改訂）" },
] as const;

// --- 写真チェックシート項目 ---
export const PHOTO_CHECK_ITEMS = [
  "正面対象車室全台分写真",
  "配置図No充電器設置場所写真",
  "新設充電器 電圧測定",
  "新設 回路 絶縁抵抗測定",
  "基礎工事箇所写真",
  "電源盤全体写真・盤名",
  "スマートメーター接写",
  "主幹ブレーカ容量・RT相電流値",
  "分岐ブレーカ用途の名称・仕様接写",
  "配線ルート",
  "コア抜き箇所",
  "架空(3kW1台なら0m/3kW2台目以降もしくは6kW充電器なら一台辺り+15m程度)",
  "埋設配管(架空と同じ)",
  "看板(不特定多数者利用の商業施設のみ)",
  "駐車場写真を個別と全体",
  "ポール式充電器などの基礎工事の場合、基礎設置床面",
] as const;

// --- 検収条件 ---
export const INSPECTION_REQUIREMENTS = {
  documents: ["工事完了報告書", "写真撮影チェックシート", "完成図面", "安全書類"],
  deadline: "毎月20日までに図面提出と報告書の承認依頼→25日までに承認",
  invoiceDeadline: "月初2営業日以内にPDFデータで送付",
  invoiceEmail: "seko-invoice@terra-charge.co.jp",
  completionReportDeadline: "完工後3営業日以内",
} as const;

// --- 産廃業者 ---
export const WASTE_DISPOSAL_COMPANY = {
  name: "株式会社テルスター",
  tel: "03-5829-8880",
  fax: "03-5829-8881",
} as const;

// --- プロジェクトデータ型（進捗シート全カラム対応） ---
export type Project = {
  // 基本情報
  id: string;
  caseId: string;         // 案件ID (英字1+数字4桁, e.g. "T05010")
  nevId: string;          // NevID
  subsidyType: SubsidyType;
  name: string;           // 案件名（補助金の名前）
  location: string;       // 住所
  prefecture: string;     // 都道府県
  applicationCategory: string; // 申請区分 (目的地充電/基礎充電/経路充電)
  constructionArea: string; // 施工エリア (東日本/西日本)

  // 充電器情報
  chargerCategory: string;   // 充電器種別
  chargerManufacturer: string;
  chargerModel: string;
  quantity: number;

  // 担当者
  salesDepartment: string;  // 営業担当部署
  caseManager: string;      // 案件担当
  sekoManager: string;      // Seko担
  constructionManager: string; // 施工管理

  // 施工会社
  contractor: string;       // 施工会社名

  // 日程管理
  orderDate: string;        // 発注日
  preConstructionMeetingDate: string; // 着工前会議予定日
  preConstructionMeetingTime: string; // 着工前会議予定時間
  safetyDocSubmitDate: string;        // 安全書類提出日
  chargerDeliveryRequestDate: string; // 充電器納入希望日
  signboardDeliveryRequestDate: string; // 看板納入希望日
  chargerDeliveryConfirmDate: string; // 充電器納品確認日
  signboardDeliveryConfirmDate: string; // 看板納品確認日
  materialConfirmDate: string;        // 電材確保確認日
  startDate: string;        // 着工予定日
  endDate: string;          // 完工予定日
  powerReceptionDate: string; // 電力受電日
  blackoutDate: string;     // 停電日
  blackoutTime: string;     // 停電時間

  // 着工Ready
  readyStatus: "Ready" | "Not Ready" | "";
  readyConfirmDate: string;

  // 現場担当
  siteManagerName: string;
  siteManagerPhone: string;

  // 産廃
  wasteDisposal: "有" | "無" | "";
  wasteDescription: string;   // 荷姿/量/中身
  wastePickupDate: string;
  wastePickupTime: string;

  // 完了報告
  actualStartDate: string;
  actualEndDate: string;
  completionReportDate: string;
  reportStatus: "未作成" | "提出済み" | "差戻" | "承認済み" | "";
  reportApprovalDate: string;

  // ステータス
  status: ProjectStatus;
  subsidy: string;
  notes: string;
  updatedAt: string;
};

// --- サンプルデータ（実業務フォーマット準拠） ---
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1", caseId: "T05010", nevId: "205697", subsidyType: "R8 Nev",
    name: "○○マンション EV充電器設置", location: "東京都港区芝浦3-1-1", prefecture: "東京",
    applicationCategory: "基礎充電", constructionArea: "東日本",
    chargerCategory: "6kW普通充電器", chargerManufacturer: "日東工業", chargerModel: "EVPT-2G60J-F-L5", quantity: 5,
    salesDepartment: "A", caseManager: "植崎", sekoManager: "松本", constructionManager: "田中",
    contractor: "テラEV充電器工事(株)",
    orderDate: "2026-03-15", preConstructionMeetingDate: "2026-03-25", preConstructionMeetingTime: "13:00",
    safetyDocSubmitDate: "2026-03-28", chargerDeliveryRequestDate: "2026-03-20",
    signboardDeliveryRequestDate: "2026-03-20", chargerDeliveryConfirmDate: "2026-03-22",
    signboardDeliveryConfirmDate: "2026-03-22", materialConfirmDate: "2026-03-23",
    startDate: "2026-04-01", endDate: "2026-04-05",
    powerReceptionDate: "", blackoutDate: "", blackoutTime: "",
    readyStatus: "Ready", readyConfirmDate: "2026-03-29",
    siteManagerName: "山田太郎", siteManagerPhone: "090-1234-5678",
    wasteDisposal: "有", wasteDescription: "土嚢10袋(段ボール,電気線)", wastePickupDate: "2026-04-05", wastePickupTime: "11:00",
    actualStartDate: "2026-04-01", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "施工中", subsidy: "NeV", notes: "管理組合承認済み", updatedAt: "2026-04-01",
  },
  {
    id: "2", caseId: "E04038", nevId: "208123", subsidyType: "R8 Nev",
    name: "△△商業施設 急速充電器設置", location: "大阪府大阪市北区梅田1-2-3", prefecture: "大阪",
    applicationCategory: "目的地充電", constructionArea: "西日本",
    chargerCategory: "50kW急速充電器", chargerManufacturer: "新電元工業", chargerModel: "SDQC2F50XT3200", quantity: 2,
    salesDepartment: "B", caseManager: "佐藤", sekoManager: "鈴木", constructionManager: "高橋",
    contractor: "(株)関西テック",
    orderDate: "2026-03-20", preConstructionMeetingDate: "2026-04-05", preConstructionMeetingTime: "10:00",
    safetyDocSubmitDate: "", chargerDeliveryRequestDate: "2026-04-01",
    signboardDeliveryRequestDate: "2026-04-01", chargerDeliveryConfirmDate: "",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "",
    startDate: "2026-04-15", endDate: "2026-04-25",
    powerReceptionDate: "2026-04-20", blackoutDate: "2026-04-18", blackoutTime: "22:00-25:00",
    readyStatus: "", readyConfirmDate: "",
    siteManagerName: "", siteManagerPhone: "",
    wasteDisposal: "", wasteDescription: "", wastePickupDate: "", wastePickupTime: "",
    actualStartDate: "", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "日程調整中", subsidy: "NeV", notes: "キュービクル設置あり(150kVA)", updatedAt: "2026-03-27",
  },
  {
    id: "3", caseId: "T04521", nevId: "206789", subsidyType: "R8 Nev",
    name: "□□駐車場 3kWコンセント設置", location: "名古屋市中区栄4-5-6", prefecture: "愛知",
    applicationCategory: "目的地充電", constructionArea: "東日本",
    chargerCategory: "3kWコンセント", chargerManufacturer: "NOEX", chargerModel: "NXEV-0001 (TC 2024)", quantity: 10,
    salesDepartment: "A", caseManager: "田中", sekoManager: "松本", constructionManager: "鈴木",
    contractor: "中部電工(株)",
    orderDate: "2026-03-10", preConstructionMeetingDate: "2026-04-10", preConstructionMeetingTime: "14:00",
    safetyDocSubmitDate: "", chargerDeliveryRequestDate: "2026-04-15",
    signboardDeliveryRequestDate: "", chargerDeliveryConfirmDate: "",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "",
    startDate: "2026-05-01", endDate: "2026-05-08",
    powerReceptionDate: "", blackoutDate: "", blackoutTime: "",
    readyStatus: "", readyConfirmDate: "",
    siteManagerName: "", siteManagerPhone: "",
    wasteDisposal: "", wasteDescription: "", wastePickupDate: "", wastePickupTime: "",
    actualStartDate: "", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "施工発注済み", subsidy: "NeV", notes: "コンセント型10口", updatedAt: "2026-03-25",
  },
  {
    id: "4", caseId: "E03987", nevId: "207456", subsidyType: "R8 Nev",
    name: "◇◇オフィスビル EV充電設備", location: "福岡市博多区博多駅前2-3-4", prefecture: "福岡",
    applicationCategory: "基礎充電", constructionArea: "西日本",
    chargerCategory: "6kW普通充電器", chargerManufacturer: "河村電器産業", chargerModel: "EVコンポα ECMT3-6X-5", quantity: 8,
    salesDepartment: "C", caseManager: "山本", sekoManager: "中村", constructionManager: "小林",
    contractor: "九州電設(株)",
    orderDate: "", preConstructionMeetingDate: "", preConstructionMeetingTime: "",
    safetyDocSubmitDate: "", chargerDeliveryRequestDate: "",
    signboardDeliveryRequestDate: "", chargerDeliveryConfirmDate: "",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "",
    startDate: "2026-05-15", endDate: "2026-05-28",
    powerReceptionDate: "", blackoutDate: "", blackoutTime: "",
    readyStatus: "", readyConfirmDate: "",
    siteManagerName: "", siteManagerPhone: "",
    wasteDisposal: "", wasteDescription: "", wastePickupDate: "", wastePickupTime: "",
    actualStartDate: "", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "交付決定済み", subsidy: "NeV", notes: "地下駐車場", updatedAt: "2026-03-24",
  },
  {
    id: "5", caseId: "E04102", nevId: "209012", subsidyType: "自治体",
    name: "☆☆ホテル 急速充電器導入", location: "京都市下京区四条通7-8-9", prefecture: "京都",
    applicationCategory: "目的地充電", constructionArea: "西日本",
    chargerCategory: "90kW急速充電器", chargerManufacturer: "新電元工業", chargerModel: "SDQC2F90XT4415", quantity: 1,
    salesDepartment: "B", caseManager: "加藤", sekoManager: "松本", constructionManager: "高橋",
    contractor: "関西テック(株)",
    orderDate: "2026-03-18", preConstructionMeetingDate: "2026-04-08", preConstructionMeetingTime: "15:00",
    safetyDocSubmitDate: "2026-04-10", chargerDeliveryRequestDate: "2026-04-05",
    signboardDeliveryRequestDate: "2026-04-05", chargerDeliveryConfirmDate: "2026-04-07",
    signboardDeliveryConfirmDate: "2026-04-07", materialConfirmDate: "2026-04-09",
    startDate: "2026-04-20", endDate: "2026-05-05",
    powerReceptionDate: "2026-04-25", blackoutDate: "2026-04-22", blackoutTime: "23:00-02:00",
    readyStatus: "Ready", readyConfirmDate: "2026-04-12",
    siteManagerName: "鈴木次郎", siteManagerPhone: "080-9876-5432",
    wasteDisposal: "有", wasteDescription: "フレコン2袋(土砂・鉄くず)", wastePickupDate: "2026-05-05", wastePickupTime: "10:00",
    actualStartDate: "", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "着工Ready", subsidy: "自治体", notes: "ホテル正面玄関横 停電工事あり", updatedAt: "2026-04-12",
  },
  {
    id: "6", caseId: "T04890", nevId: "210345", subsidyType: "R8 Nev",
    name: "▽▽スーパー EV充電スタンド", location: "札幌市中央区南1条西10-11", prefecture: "北海道",
    applicationCategory: "目的地充電", constructionArea: "東日本",
    chargerCategory: "50kW急速充電器", chargerManufacturer: "ダイヘン", chargerModel: "DQC050M", quantity: 2,
    salesDepartment: "A", caseManager: "渡辺", sekoManager: "佐々木", constructionManager: "伊藤",
    contractor: "北海道電工(株)",
    orderDate: "", preConstructionMeetingDate: "", preConstructionMeetingTime: "",
    safetyDocSubmitDate: "", chargerDeliveryRequestDate: "",
    signboardDeliveryRequestDate: "", chargerDeliveryConfirmDate: "",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "",
    startDate: "", endDate: "",
    powerReceptionDate: "", blackoutDate: "", blackoutTime: "",
    readyStatus: "", readyConfirmDate: "",
    siteManagerName: "", siteManagerPhone: "",
    wasteDisposal: "", wasteDescription: "", wastePickupDate: "", wastePickupTime: "",
    actualStartDate: "", actualEndDate: "", completionReportDate: "", reportStatus: "", reportApprovalDate: "",
    status: "交付決定待ち", subsidy: "NeV", notes: "駐車場入口付近 北海道のため特殊仕様要確認", updatedAt: "2026-03-20",
  },
  {
    id: "7", caseId: "T03456", nevId: "204567", subsidyType: "R7 Nev",
    name: "◎◎分譲マンション 充電設備", location: "横浜市西区みなとみらい5-6-7", prefecture: "神奈川",
    applicationCategory: "基礎充電", constructionArea: "東日本",
    chargerCategory: "6kW普通充電器", chargerManufacturer: "日東工業", chargerModel: "EVPT-2G60J-W-L7", quantity: 12,
    salesDepartment: "C", caseManager: "斎藤", sekoManager: "松本", constructionManager: "田中",
    contractor: "関東電設(株)",
    orderDate: "2026-01-20", preConstructionMeetingDate: "2026-02-01", preConstructionMeetingTime: "10:00",
    safetyDocSubmitDate: "2026-02-03", chargerDeliveryRequestDate: "2026-01-25",
    signboardDeliveryRequestDate: "", chargerDeliveryConfirmDate: "2026-01-28",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "2026-01-30",
    startDate: "2026-02-10", endDate: "2026-02-28",
    powerReceptionDate: "", blackoutDate: "2026-02-15", blackoutTime: "10:00-15:00",
    readyStatus: "Ready", readyConfirmDate: "2026-02-05",
    siteManagerName: "佐藤三郎", siteManagerPhone: "070-1111-2222",
    wasteDisposal: "有", wasteDescription: "土嚢5袋(梱包材、部材の端切れ)", wastePickupDate: "2026-02-28", wastePickupTime: "14:00",
    actualStartDate: "2026-02-10", actualEndDate: "2026-02-28",
    completionReportDate: "2026-03-02", reportStatus: "承認済み", reportApprovalDate: "2026-03-05",
    status: "請求済み", subsidy: "NeV", notes: "", updatedAt: "2026-03-10",
  },
  {
    id: "8", caseId: "E04567", nevId: "208901", subsidyType: "自治体",
    name: "★★病院 EV充電器設置", location: "神戸市中央区港島中町8-9-10", prefecture: "兵庫",
    applicationCategory: "目的地充電", constructionArea: "西日本",
    chargerCategory: "6kW普通充電器", chargerManufacturer: "河村電器産業", chargerModel: "EVコンポα ECMT3-6X-5", quantity: 4,
    salesDepartment: "B", caseManager: "伊藤", sekoManager: "中村", constructionManager: "小林",
    contractor: "兵庫電気(株)",
    orderDate: "2026-02-15", preConstructionMeetingDate: "2026-02-20", preConstructionMeetingTime: "11:00",
    safetyDocSubmitDate: "2026-02-22", chargerDeliveryRequestDate: "2026-02-18",
    signboardDeliveryRequestDate: "", chargerDeliveryConfirmDate: "2026-02-20",
    signboardDeliveryConfirmDate: "", materialConfirmDate: "2026-02-21",
    startDate: "2026-03-01", endDate: "2026-03-15",
    powerReceptionDate: "", blackoutDate: "", blackoutTime: "",
    readyStatus: "Ready", readyConfirmDate: "2026-02-25",
    siteManagerName: "高橋四郎", siteManagerPhone: "080-3333-4444",
    wasteDisposal: "無", wasteDescription: "", wastePickupDate: "", wastePickupTime: "",
    actualStartDate: "2026-03-01", actualEndDate: "2026-03-15",
    completionReportDate: "2026-03-18", reportStatus: "提出済み", reportApprovalDate: "",
    status: "報告書確認中", subsidy: "自治体", notes: "職員駐車場", updatedAt: "2026-03-18",
  },
];
