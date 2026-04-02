import { type Project, type ProjectStatus, SAFETY_DOCUMENTS } from "./constants";

// ============================================================
// 自動化ロジック - Terra Charge 業務ルールに基づく
// ============================================================

// --- 日付ユーティリティ ---

/** 今日の日付文字列 (YYYY-MM-DD) */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 日付文字列をDateに変換 */
function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** 2つの日付間の日数差 */
function daysBetween(a: string, b: string): number {
  const da = toDate(a);
  const db = toDate(b);
  if (!da || !db) return Infinity;
  return Math.floor((db.getTime() - da.getTime()) / 86400000);
}

/** 営業日を加算（土日のみスキップ、祝日未対応） */
export function addBusinessDays(dateStr: string, days: number): string {
  const d = toDate(dateStr);
  if (!d) return "";
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d.toISOString().slice(0, 10);
}

// --- 着工Ready自動判定 ---

export type ReadyCheckItem = {
  label: string;
  ok: boolean;
};

/** 着工Ready判定: 全必須項目の充足チェック */
export function checkReadyStatus(p: Project): { status: "Ready" | "Not Ready"; items: ReadyCheckItem[] } {
  const items: ReadyCheckItem[] = [
    { label: "着工予定日", ok: !!p.startDate },
    { label: "完工予定日", ok: !!p.endDate },
    { label: "現場担当者氏名", ok: !!p.siteManagerName },
    { label: "現場担当者電話番号", ok: !!p.siteManagerPhone },
    { label: "産廃回収有無", ok: p.wasteDisposal === "有" || p.wasteDisposal === "無" },
    { label: "安全書類提出", ok: !!p.safetyDocSubmitDate },
    { label: "充電器納品確認", ok: !!p.chargerDeliveryConfirmDate },
    { label: "電材確保確認", ok: !!p.materialConfirmDate },
    { label: "着工前会議完了", ok: !!p.preConstructionMeetingDate },
  ];

  // 産廃「有」の場合は追加チェック
  if (p.wasteDisposal === "有") {
    items.push(
      { label: "産廃荷姿", ok: !!p.wasteDescription },
      { label: "産廃回収希望日", ok: !!p.wastePickupDate },
      { label: "産廃回収希望時間", ok: !!p.wastePickupTime },
    );
  }

  const status = items.every((i) => i.ok) ? "Ready" : "Not Ready";
  return { status, items };
}

// --- 期限アラート ---

export type Alert = {
  level: "danger" | "warning" | "info";
  message: string;
  projectId: string;
  projectName: string;
  dueDate: string;
};

/** 期限アラートを生成 */
export function getDeadlineAlerts(p: Project, refDate?: string): Alert[] {
  const ref = refDate || today();
  const alerts: Alert[] = [];
  const base = { projectId: p.id, projectName: p.name };

  // 1. 安全書類: 着工1週間前までに提出
  if (p.startDate && !p.safetyDocSubmitDate) {
    const daysToStart = daysBetween(ref, p.startDate);
    if (daysToStart <= 7 && daysToStart > 0) {
      alerts.push({ ...base, level: "danger", message: "安全書類未提出（着工1週間前）", dueDate: p.startDate });
    } else if (daysToStart <= 14 && daysToStart > 7) {
      alerts.push({ ...base, level: "warning", message: "安全書類提出期限が近づいています", dueDate: p.startDate });
    }
  }

  // 2. 資材: 着工1週間前までに全確保
  if (p.startDate && !p.materialConfirmDate) {
    const daysToStart = daysBetween(ref, p.startDate);
    if (daysToStart <= 7 && daysToStart > 0) {
      alerts.push({ ...base, level: "danger", message: "電材未確保（着工1週間前）", dueDate: p.startDate });
    }
  }

  // 3. 充電器納品: 着工1週間前までに確認
  if (p.startDate && !p.chargerDeliveryConfirmDate) {
    const daysToStart = daysBetween(ref, p.startDate);
    if (daysToStart <= 7 && daysToStart > 0) {
      alerts.push({ ...base, level: "danger", message: "充電器納品未確認（着工1週間前）", dueDate: p.startDate });
    }
  }

  // 4. 完了報告: 完工後3営業日以内
  if (p.actualEndDate && !p.completionReportDate) {
    const deadline = addBusinessDays(p.actualEndDate, 3);
    const daysLeft = daysBetween(ref, deadline);
    if (daysLeft <= 0) {
      alerts.push({ ...base, level: "danger", message: "完了報告書提出期限超過", dueDate: deadline });
    } else if (daysLeft <= 2) {
      alerts.push({ ...base, level: "warning", message: `完了報告書提出期限まであと${daysLeft}日`, dueDate: deadline });
    }
  }

  // 5. 着工前議事録: 会議後2営業日以内
  if (p.preConstructionMeetingDate && p.status === "着工前会議完了") {
    // 議事録提出チェック（簡易: safetyDocSubmitDateがなければ未提出扱い）
    const deadline = addBusinessDays(p.preConstructionMeetingDate, 2);
    if (daysBetween(ref, deadline) < 0) {
      alerts.push({ ...base, level: "warning", message: "着工前議事録の提出期限超過の可能性", dueDate: deadline });
    }
  }

  return alerts;
}

// --- 資材確認状況 ---

export type MaterialStatus = {
  charger: { requested: boolean; confirmed: boolean };
  signboard: { requested: boolean; confirmed: boolean };
  material: { confirmed: boolean };
  allConfirmed: boolean;
};

export function getMaterialStatus(p: Project): MaterialStatus {
  const charger = {
    requested: !!p.chargerDeliveryRequestDate,
    confirmed: !!p.chargerDeliveryConfirmDate,
  };
  const signboard = {
    requested: !!p.signboardDeliveryRequestDate,
    confirmed: !!p.signboardDeliveryConfirmDate,
  };
  const material = { confirmed: !!p.materialConfirmDate };
  return {
    charger,
    signboard,
    material,
    allConfirmed: charger.confirmed && material.confirmed,
  };
}

// --- ステータス自動遷移候補 ---

/** 現在の状態から次に遷移すべきステータスを提案 */
export function suggestNextStatus(p: Project): ProjectStatus | null {
  switch (p.status) {
    case "交付決定待ち":
      return null; // 外部トリガー（補助金団体）
    case "交付決定済み":
      if (p.orderDate) return "施工発注済み";
      return null;
    case "施工発注済み":
      if (p.preConstructionMeetingDate) return "日程調整中";
      return null;
    case "日程調整中":
      if (p.preConstructionMeetingDate) return "着工前会議完了";
      return null;
    case "着工前会議完了":
      if (p.safetyDocSubmitDate) return "安全書類提出済み";
      return null;
    case "安全書類提出済み": {
      const ready = checkReadyStatus(p);
      if (ready.status === "Ready") return "着工Ready";
      return null;
    }
    case "着工Ready":
      if (p.actualStartDate) return "施工中";
      return null;
    case "施工中":
      if (p.actualEndDate) return "完了報告待ち";
      return null;
    case "完了報告待ち":
      if (p.completionReportDate) return "報告書確認中";
      return null;
    case "報告書確認中":
      if (p.reportStatus === "承認済み") return "検収完了";
      return null;
    case "検収完了":
      return "請求済み"; // 請求書送付で遷移
    default:
      return null;
  }
}

// --- 月次検収集計 ---

export type InspectionSummary = {
  totalProjects: number;
  pendingApproval: number;  // 承認依頼済み・未承認
  approved: number;         // 承認済み（請求対象）
  rejected: number;         // 差戻
  notSubmitted: number;     // 未提出
  invoiceReady: number;     // 請求可能
};

export function getMonthlyInspectionSummary(projects: Project[], year: number, month: number): InspectionSummary {
  // 対象: 当月に完了報告書が提出された案件
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const relevant = projects.filter((p) =>
    p.completionReportDate?.startsWith(monthStr) ||
    p.reportApprovalDate?.startsWith(monthStr) ||
    (p.actualEndDate && p.status !== "請求済み" && p.status !== "キャンセル")
  );

  return {
    totalProjects: relevant.length,
    pendingApproval: relevant.filter((p) => p.reportStatus === "提出済み").length,
    approved: relevant.filter((p) => p.reportStatus === "承認済み").length,
    rejected: relevant.filter((p) => p.reportStatus === "差戻").length,
    notSubmitted: relevant.filter((p) => !p.reportStatus || p.reportStatus === "未作成").length,
    invoiceReady: relevant.filter((p) => p.reportStatus === "承認済み" && p.status !== "請求済み").length,
  };
}

// --- 安全書類提出状況チェック ---

export type SafetyDocStatus = {
  id: string;
  name: string;
  required: string;
  frequency: string;
  submitted: boolean;
  perProject: boolean;
};

export function getSafetyDocStatus(p: Project): SafetyDocStatus[] {
  // 簡易実装: safetyDocSubmitDateがあれば全書類提出済みとみなす
  // 実際にはDB上で個別管理が必要
  const hasSubmission = !!p.safetyDocSubmitDate;
  return SAFETY_DOCUMENTS.map((doc) => ({
    ...doc,
    submitted: hasSubmission && (doc.required === "必須" ? true : false),
  }));
}

// --- ダッシュボード用サマリー ---

export type DashboardSummary = {
  totalActive: number;
  byPhase: { pre: number; active: number; post: number; hold: number };
  readyCount: number;
  alertCount: number;
  alerts: Alert[];
  materialPending: number;
  inspectionPending: number;
};

export function getDashboardSummary(projects: Project[], refDate?: string): DashboardSummary {
  const active = projects.filter((p) => p.status !== "キャンセル" && p.status !== "延期" && p.status !== "請求済み");
  const preStatuses: ProjectStatus[] = ["交付決定待ち", "交付決定済み", "施工発注済み", "日程調整中", "着工前会議完了", "安全書類提出済み", "着工Ready"];
  const postStatuses: ProjectStatus[] = ["完了報告待ち", "報告書確認中", "検収完了"];

  const allAlerts = projects.flatMap((p) => getDeadlineAlerts(p, refDate));

  return {
    totalActive: active.length,
    byPhase: {
      pre: active.filter((p) => preStatuses.includes(p.status)).length,
      active: active.filter((p) => p.status === "施工中").length,
      post: active.filter((p) => postStatuses.includes(p.status)).length,
      hold: projects.filter((p) => p.status === "キャンセル" || p.status === "延期").length,
    },
    readyCount: active.filter((p) => p.readyStatus === "Ready" || checkReadyStatus(p).status === "Ready").length,
    alertCount: allAlerts.length,
    alerts: allAlerts.sort((a, b) => (a.level === "danger" ? -1 : 1)),
    materialPending: active.filter((p) => !getMaterialStatus(p).allConfirmed && p.startDate).length,
    inspectionPending: projects.filter((p) => p.reportStatus === "提出済み" || p.status === "報告書確認中").length,
  };
}
