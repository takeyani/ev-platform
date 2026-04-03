import { supabase } from "./supabase";

// DB用の型（snake_case）
export type ProjectRow = {
  id: string;
  case_id: string;
  nev_id: string;
  subsidy_type: string;
  name: string;
  location: string;
  prefecture: string;
  application_category: string;
  construction_area: string;
  charger_category: string;
  charger_manufacturer: string;
  charger_model: string;
  quantity: number;
  sales_department: string;
  case_manager: string;
  seko_manager: string;
  construction_manager: string;
  contractor: string;
  order_date: string | null;
  pre_construction_meeting_date: string | null;
  pre_construction_meeting_time: string;
  safety_doc_submit_date: string | null;
  charger_delivery_request_date: string | null;
  signboard_delivery_request_date: string | null;
  charger_delivery_confirm_date: string | null;
  signboard_delivery_confirm_date: string | null;
  material_confirm_date: string | null;
  start_date: string | null;
  end_date: string | null;
  power_reception_date: string | null;
  blackout_date: string | null;
  blackout_time: string;
  ready_status: string;
  ready_confirm_date: string | null;
  site_manager_name: string;
  site_manager_phone: string;
  waste_disposal: string;
  waste_description: string;
  waste_pickup_date: string | null;
  waste_pickup_time: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  completion_report_date: string | null;
  report_status: string;
  report_approval_date: string | null;
  status: string;
  subsidy: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

// snake_case → camelCase変換
export function toProject(r: ProjectRow) {
  return {
    id: r.id,
    caseId: r.case_id,
    nevId: r.nev_id,
    subsidyType: r.subsidy_type as any,
    name: r.name,
    location: r.location,
    prefecture: r.prefecture,
    applicationCategory: r.application_category,
    constructionArea: r.construction_area,
    chargerCategory: r.charger_category,
    chargerManufacturer: r.charger_manufacturer,
    chargerModel: r.charger_model,
    quantity: r.quantity,
    salesDepartment: r.sales_department,
    caseManager: r.case_manager,
    sekoManager: r.seko_manager,
    constructionManager: r.construction_manager,
    contractor: r.contractor,
    orderDate: r.order_date || "",
    preConstructionMeetingDate: r.pre_construction_meeting_date || "",
    preConstructionMeetingTime: r.pre_construction_meeting_time,
    safetyDocSubmitDate: r.safety_doc_submit_date || "",
    chargerDeliveryRequestDate: r.charger_delivery_request_date || "",
    signboardDeliveryRequestDate: r.signboard_delivery_request_date || "",
    chargerDeliveryConfirmDate: r.charger_delivery_confirm_date || "",
    signboardDeliveryConfirmDate: r.signboard_delivery_confirm_date || "",
    materialConfirmDate: r.material_confirm_date || "",
    startDate: r.start_date || "",
    endDate: r.end_date || "",
    powerReceptionDate: r.power_reception_date || "",
    blackoutDate: r.blackout_date || "",
    blackoutTime: r.blackout_time,
    readyStatus: (r.ready_status || "") as any,
    readyConfirmDate: r.ready_confirm_date || "",
    siteManagerName: r.site_manager_name,
    siteManagerPhone: r.site_manager_phone,
    wasteDisposal: (r.waste_disposal || "") as any,
    wasteDescription: r.waste_description,
    wastePickupDate: r.waste_pickup_date || "",
    wastePickupTime: r.waste_pickup_time,
    actualStartDate: r.actual_start_date || "",
    actualEndDate: r.actual_end_date || "",
    completionReportDate: r.completion_report_date || "",
    reportStatus: (r.report_status || "") as any,
    reportApprovalDate: r.report_approval_date || "",
    status: r.status as any,
    subsidy: r.subsidy,
    notes: r.notes,
    updatedAt: r.updated_at?.slice(0, 10) || "",
  };
}

// CRUD操作
export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProjectRow[]).map(toProject);
}

export async function fetchProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return toProject(data as ProjectRow);
}

export async function createProject(fields: Record<string, any>) {
  const row: Record<string, any> = {
    case_id: fields.caseId || fields.case_id,
    nev_id: fields.nevId || "",
    subsidy_type: fields.subsidyType || "R8 Nev",
    name: fields.name,
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
    construction_manager: fields.constructionManager || "",
    contractor: fields.contractor || "",
    status: "交付決定待ち",
    notes: fields.notes || "",
  };
  const { data, error } = await supabase.from("projects").insert(row).select().single();
  if (error) throw error;
  return toProject(data as ProjectRow);
}

export async function updateProject(id: string, fields: Record<string, any>) {
  const { error } = await supabase
    .from("projects")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
