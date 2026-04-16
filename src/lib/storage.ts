import { supabase } from "./supabase";

export type FileInfo = {
  name: string;
  path: string;
  size: number;
  url: string;
  createdAt: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** 許可する拡張子（MIMEは偽装可能なので拡張子も検証） */
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  drawings: [".pdf", ".png", ".jpg", ".jpeg", ".dwg", ".dxf"],
  documents: [".pdf", ".xlsx", ".xls", ".doc", ".docx"],
  photos: [".jpg", ".jpeg", ".png", ".heic", ".heif"],
};

/** パストラバーサル防止のためファイルパスをサニタイズ */
function sanitizePath(path: string): string {
  return path.replace(/\.\./g, "").replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+/, "");
}

/** ファイル名をサニタイズ（危険な文字を除去） */
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._\u3000-\u9FFF\uF900-\uFAFF-]/g, "_");
}

/** ファイルアップロード（バリデーション付き） */
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`ファイルサイズが上限を超えています（最大10MB、現在 ${(file.size / 1024 / 1024).toFixed(1)}MB）`);
  }
  // 拡張子チェック（MIMEは偽装可能なので拡張子を優先）
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const allowed = ALLOWED_EXTENSIONS[bucket];
  if (allowed && !allowed.includes(ext)) {
    throw new Error(`このバケットでは ${ext} ファイルは許可されていません（許可: ${allowed.join(", ")}）`);
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

/** 署名付きURL取得（プライベートバケット用、有効期限30分） */
export async function getSignedUrl(bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 1800);
  if (error) throw error;
  return data.signedUrl;
}

/** ファイル一覧取得（署名付きURL付き） */
export async function listFiles(bucket: string, folder: string): Promise<FileInfo[]> {
  const safeFolder = sanitizePath(folder);
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
  const { error } = await supabase.storage.from(bucket).remove([sanitizePath(path)]);
  if (error) throw error;
}

/** ファイルサイズ表示用 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** sanitizeFileName をエクスポート（FileUploader用） */
export { sanitizeFileName };
