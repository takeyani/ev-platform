"use client";
import { useState, useEffect } from "react";
import { uploadFile, listFiles, deleteFile, formatSize, type FileInfo } from "@/lib/storage";
import { cell, hcell, section, shead, table } from "@/lib/styles";

type Props = {
  bucket: "drawings" | "documents" | "photos";
  folder: string; // e.g. "T05010" (案件ID)
  label: string;
  accept?: string;
};

export default function FileUploader({ bucket, folder, label, accept }: Props) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  function load() {
    listFiles(bucket, folder).then(setFiles).catch(() => {});
  }
  useEffect(load, [bucket, folder]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg("");
    try {
      const path = `${folder}/${Date.now()}_${file.name}`;
      await uploadFile(bucket, path, file);
      setMsg(`✅ ${file.name} をアップロードしました`);
      load();
    } catch (err: any) { setMsg(`❌ ${err.message}`); }
    finally { setUploading(false); e.target.value = ""; }
  }

  async function handleDelete(path: string, name: string) {
    if (!confirm(`${name} を削除しますか？`)) return;
    try { await deleteFile(bucket, path); load(); } catch {}
  }

  return (
    <div style={section}>
      <div style={{ ...shead, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{label}（{files.length}件）</span>
        <label style={{ background: uploading ? "#9ca3af" : "#059669", color: "white", padding: "2px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: uploading ? "default" : "pointer" }}>
          {uploading ? "送信中..." : "アップロード"}
          <input type="file" accept={accept} onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
        </label>
      </div>
      {msg && <div style={{ padding: "4px 10px", fontSize: 10, color: msg.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{msg}</div>}
      {files.length > 0 ? (
        <table style={table}>
          <thead><tr><th style={hcell}>ファイル名</th><th style={hcell}>サイズ</th><th style={hcell}>日時</th><th style={{ ...hcell, textAlign: "center" }}>操作</th></tr></thead>
          <tbody>{files.map((f) => (
            <tr key={f.path}>
              <td style={cell}><a href={f.url} target="_blank" rel="noopener" style={{ color: "#059669", fontWeight: 600, textDecoration: "none", fontSize: 11 }}>{f.name}</a></td>
              <td style={{ ...cell, color: "#9ca3af" }}>{formatSize(f.size)}</td>
              <td style={{ ...cell, color: "#9ca3af", fontSize: 10 }}>{f.createdAt?.slice(0, 10)}</td>
              <td style={{ ...cell, textAlign: "center" }}><button onClick={() => handleDelete(f.path, f.name)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 10 }}>削除</button></td>
            </tr>
          ))}</tbody>
        </table>
      ) : (
        <div style={{ padding: "12px 10px", fontSize: 11, color: "#9ca3af", textAlign: "center" }}>ファイルなし</div>
      )}
    </div>
  );
}
