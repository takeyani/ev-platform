import { supabase } from "./supabase";
import type { ProjectStatus, SubsidyType, ReadyStatus, WasteDisposal, ReportStatus } from "./constants";
import { getUserProfile } from "./auth";

/** 案件への書き込み権限チェック（contractorは自社案件のみ） */
async function assertWriteAccess(projectId: string) {
  const profile = await getUserProfile();
  if (!profile) throw new Error("認証が必要です");
  if (["admin", "terra_case"].includes(profile.role)) return;
  if (profile.role === "contractor") {
    const { data, error } = await supabase.from("projects").select("contractor").eq("id", projectId).single();
    if (error || !data) throw new Error("案件が見つかりません");
    if (data.contractor !== profile.company) throw new Error("この案件を編集する権限がありません");
    return;
  }
  throw new Error("編集権限がありません");
}

export type ProjectRow = {
  id: string; case_id: string; nev_id: string; subsidy_type: string; name: string;
  location: string; prefecture: string; application_category: string; construction_area: string;
  charger_category: string; charger_manufacturer: string; charger_model: string; quantity: number;
  sales_department: string; case_manager: string; seko_manager: string; construction_manager: string;
  contractor: string; order_date: string | null; pre_construction_meeting_date: string | null;
  pre_construction_meeting_time: string; safety_doc_submit_date: string | null;
  charger_delivery_request_date: string | null; signboard_delivery_request_date: string | null;
  charger_delivery_confirm_date: string | null; signboard_delivery_confirm_date: string | null;
  material_confirm_date: string | null; start_date: string | null; end_date: string | null;
  power_reception_date: string | null; blackout_date: string | null; blackout_time: string;
  ready_status: string; ready_confirm_date: string | null; site_manager_name: string;
  site_manager_phone: string; waste_disposal: string; waste_description: string;
  waste_pickup_date: string | null; waste_pickup_time: string; actual_start_date: string | null;
  actual_end_date: string | null; completion_report_date: string | null; report_status: string;
  report_approval_date: string | null; status: string; subsidy: string; notes: string;
  created_at: string; updated_at: string;
};

function toSnake(s: string): string {
  return s.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function toProject(r: ProjectRow) {
  return {
    id: r.id, caseId: r.case_id, nevId: r.nev_id, subsidyType: r.subsidy_type as SubsidyType,
    name: r.name, location: r.location, prefecture: r.prefecture,
    applicationCategory: r.application_category, constructionArea: r.construction_area,
    chargerCategory: r.charger_category, chargerManufacturer: r.charger_manufacturer,
    chargerModel: r.charger_model, quantity: r.quantity,
    salesDepartment: r.sales_department, caseManager: r.case_manager,
    sekoManager: r.seko_manager, constructionManager: r.construction_manager,
    contractor: r.contractor, orderDate: r.order_date || "",
    preConstructionMeetingDate: r.pre_construction_meeting_date || "",
    preConstructionMeetingTime: r.pre_construction_meeting_time,
    safetyDocSubmitDate: r.safety_doc_submit_date || "",
    chargerDeliveryRequestDate: r.charger_delivery_request_date || "",
    signboardDeliveryRequestDate: r.signboard_delivery_request_date || "",
    chargerDeliveryConfirmDate: r.charger_delivery_confirm_date || "",
    signboardDeliveryConfirmDate: r.signboard_delivery_confirm_date || "",
    materialConfirmDate: r.material_confirm_date || "",
    startDate: r.start_date || "", endDate: r.end_date || "",
    powerReceptionDate: r.power_reception_date || "",
    blackoutDate: r.blackout_date || "", blackoutTime: r.blackout_time,
    readyStatus: (r.ready_status || "") as ReadyStatus,
    readyConfirmDate: r.ready_confirm_date || "",
    siteManagerName: r.site_manager_name, siteManagerPhone: r.site_manager_phone,
    wasteDisposal: (r.waste_disposal || "") as WasteDisposal,
    wasteDescription: r.waste_description,
    wastePickupDate: r.waste_pickup_date || "",
    wastePickupTime: r.waste_pickup_time,
    actualStartDate: r.actual_start_date || "",
    actualEndDate: r.actual_end_date || "",
    completionReportDate: r.completion_report_date || "",
    reportStatus: (r.report_status || "") as ReportStatus,
    reportApprovalDate: r.report_approval_date || "",
    status: r.status as ProjectStatus, subsidy: r.subsidy, notes: r.notes,
    updatedAt: r.updated_at?.slice(0, 10) || "",
  };
}

export async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(toProject);
}

export async function fetchProject(id: string) {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error) throw error;
  return toProject(data as ProjectRow);
}

export async function createProject(fields: Record<string, any>) {
  const row: Record<string, any> = {
    case_id: fields.caseId || fields.case_id || "",
    nev_id: fields.nevId || "",
    subsidy_type: fields.subsidyType || "R8 Nev",
    name: fields.name || "",
    location: fields.location || "",
    prefecture: fields.prefecture || "",
    application_category: fields.applicationCategory || "",
    construction_area: fields.constructionArea || "",
    charger_category: fields.chargerCategory || "",
    charger_manufacturer: fields.chargerManufacturer || "",
    charger_model: fields.chargerModel || "",
    quantity: Number(fields.quantity) || 1,
    sales_department: fields.salesDepartment || "",
    case_manager: fields.caseManager || "",
    seko_manager: fields.sekoManager || "",
    construction_manager: fields.constructionManager || "",
    contractor: fields.contractor || "",
    status: "交付決定待ち",
    notes: fields.notes || "",
    subsidy: "",
    order_date: null, pre_construction_meeting_date: null, pre_construction_meeting_time: "",
    safety_doc_submit_date: null, charger_delivery_request_date: null,
    signboard_delivery_request_date: null, charger_delivery_confirm_date: null,
    signboard_delivery_confirm_date: null, material_confirm_date: null,
    start_date: null, end_date: null, power_reception_date: null,
    blackout_date: null, blackout_time: "",
    ready_status: "", ready_confirm_date: null,
    site_manager_name: "", site_manager_phone: "",
    waste_disposal: "", waste_description: "", waste_pickup_date: null, waste_pickup_time: "",
    actual_start_date: null, actual_end_date: null,
    completion_report_date: null, report_status: "", report_approval_date: null,
  };
  const profile = await getUserProfile();
  if (!profile) throw new Error("認証が必要です");
  if (!["admin", "terra_case"].includes(profile.role)) throw new Error("案件作成権限がありません");
  const { data, error } = await supabase.from("projects").insert(row).select().single();
  if (error) {
    if (error.code === "23505") throw new Error("この案件IDは既に使用されています");
    console.error("[createProject]", error);
    throw new Error("保存に失敗しました");
  }
  return toProject(data as ProjectRow);
}

/** camelCase/snake_case両対応でDBに保存 */
export async function updateProject(id: string, fields: Record<string, any>) {
  await assertWriteAccess(id);
  const dbFields: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    const snakeKey = key.includes("_") ? key : toSnake(key);
    dbFields[snakeKey] = value;
  }
  dbFields.updated_at = new Date().toISOString();
  const { error } = await supabase.from("projects").update(dbFields).eq("id", id);
  if (error) {
    console.error("[updateProject]", error);
    throw new Error("更新に失敗しました");
  }
}

export async function deleteProject(id: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") throw new Error("削除権限がありません");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("[deleteProject]", error);
    throw new Error("削除に失敗しました");
  }
}
