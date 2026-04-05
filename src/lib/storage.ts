import { supabase } from "./supabase";

export type FileInfo = {
  name: string;
  path: string;
  size: number;
  url: string;
  createdAt: string;
};

/** ファイルアップロード */
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  return getFileUrl(bucket, path);
}

/** ファイルURL取得 */
export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** ファイル一覧取得 */
export async function listFiles(bucket: string, folder: string): Promise<FileInfo[]> {
  const { data, error } = await supabase.storage.from(bucket).list(folder, { sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return (data || [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      path: `${folder}/${f.name}`,
      size: f.metadata?.size || 0,
      url: getFileUrl(bucket, `${folder}/${f.name}`),
      createdAt: f.created_at || "",
    }));
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
