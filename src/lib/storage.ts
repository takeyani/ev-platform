import { supabase } from "./supabase";

export type FileInfo = {
  name: string;
  path: string;
  size: number;
  url: string;
  createdAt: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME: Record<string, string[]> = {
  drawings: ["application/pdf", "image/png", "image/jpeg", "image/jpg", "application/octet-stream"],
  documents: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  photos: ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"],
};

/** パストラバーサル防止のためファイルパスをサニタイズ */
function sanitizePath(path: string): string {
  return path.replace(/\.\./g, "").replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+/, "");
}

/** ファイルアップロード（バリデーション付き） */
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`ファイルサイズが上限を超えています（最大10MB、現在 ${(file.size / 1024 / 1024).toFixed(1)}MB）`);
  }
  const allowed = ALLOWED_MIME[bucket];
  if (allowed && file.type && !allowed.includes(file.type)) {
    throw new Error(`このバケットでは ${file.type} は許可されていません`);
  }
  const safePath = sanitizePath(path);
  const { error } = await supabase.storage.from(bucket).upload(safePath, file, { upsert: true });
  if (error) throw error;
  return getFileUrl(bucket, safePath);
}

/** ファイルURL取得（後方互換 - publicUrl） */
export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** 署名付きURL取得（プライベートバケット用、有効期限1時間） */
export async function getSignedUrl(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

/** ファイル一覧取得（署名付きURL付き） */
export async function listFiles(bucket: string, folder: string): Promise<FileInfo[]> {
  const safeFolder = folder.replace(/\.\./g, "").replace(/\\/g, "/");
  const { data, error } = await supabase.storage.from(bucket).list(safeFolder, { sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  const files = (data || []).filter((f) => f.name !== ".emptyFolderPlaceholder");
  return Promise.all(
    files.map(async (f) => ({
      name: f.name,
      path: `${safeFolder}/${f.name}`,
      size: f.metadata?.size || 0,
      url: await getSignedUrl(bucket, `${safeFolder}/${f.name}`).catch(() => ""),
      createdAt: f.created_at || "",
    }))
  );
}

/** ファイル削除 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

/** ファイルサイズ表示用 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
