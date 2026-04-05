import { supabase } from "./supabase";

export type UserRole = "admin" | "terra_case" | "terra_const" | "contractor" | "manufacturer";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  company: string;
  phone: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "管理者",
  terra_case: "テラ案件担当",
  terra_const: "テラ施工管理",
  contractor: "協力会社",
  manufacturer: "メーカー",
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}

export function canEdit(role: UserRole): boolean {
  return ["admin", "terra_case", "terra_const"].includes(role);
}

export function canDelete(role: UserRole): boolean {
  return role === "admin";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}

export function canUploadFiles(role: UserRole): boolean {
  return ["admin", "terra_case", "terra_const", "contractor"].includes(role);
}

export function canViewAllProjects(role: UserRole): boolean {
  return ["admin", "terra_case", "terra_const"].includes(role);
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { display_name: displayName || "" } },
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    // user_profilesテーブルが無い場合のフォールバック
    return { id: user.id, email: user.email || "", displayName: "", role: "contractor", company: "", phone: "" };
  }

  return {
    id: data.id,
    email: data.email,
    displayName: data.display_name,
    role: data.role as UserRole,
    company: data.company,
    phone: data.phone,
  };
}

export async function updateUserProfile(id: string, fields: Partial<{ display_name: string; role: string; company: string; phone: string }>) {
  const { error } = await supabase.from("user_profiles").update(fields).eq("id", id);
  if (error) throw error;
}

export async function listUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase.from("user_profiles").select("*").order("created_at");
  if (error) return [];
  return (data || []).map((d: any) => ({
    id: d.id, email: d.email, displayName: d.display_name,
    role: d.role, company: d.company, phone: d.phone,
  }));
}
