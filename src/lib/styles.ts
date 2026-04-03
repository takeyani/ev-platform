import type { CSSProperties } from "react";

// 共通テーブルセル
export const cell: CSSProperties = { padding: "4px 8px", fontSize: 11, borderBottom: "1px solid #f0f0f0", verticalAlign: "top" };
export const hcell: CSSProperties = { ...cell, fontWeight: 600, background: "#f9fafb", color: "#6b7280" };
export const hcellG: CSSProperties = { ...hcell, background: "#ecfdf5", color: "#065f46" };

// セクション
export const section: CSSProperties = { background: "white", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 10 };
export const shead: CSSProperties = { padding: "6px 10px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 11, fontWeight: 700, color: "#6b7280" };

// テーブル
export const table: CSSProperties = { width: "100%", borderCollapse: "collapse" };

// ページタイトル
export const pageTitle: CSSProperties = { fontSize: 15, fontWeight: 700, color: "#1f2937", marginBottom: 10 };

// リンク
export const link: CSSProperties = { color: "#059669", fontWeight: 600, textDecoration: "none" };

// バッジ風
export const badge = (bg: string, color: string): CSSProperties => ({
  display: "inline-block", padding: "1px 6px", borderRadius: 9999, fontSize: 10, fontWeight: 600, background: bg, color,
});

// 2列グリッド
export const grid2: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
export const grid3: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 };

// ステータスバッジ色（インライン用）
export const statusStyle: Record<string, { bg: string; color: string }> = {
  "交付決定待ち": { bg: "#f3f4f6", color: "#374151" },
  "交付決定済み": { bg: "#dbeafe", color: "#1e40af" },
  "施工発注済み": { bg: "#e0e7ff", color: "#3730a3" },
  "日程調整中": { bg: "#fef3c7", color: "#92400e" },
  "着工前会議完了": { bg: "#ccfbf1", color: "#115e59" },
  "安全書類提出済み": { bg: "#cffafe", color: "#155e75" },
  "着工Ready": { bg: "#ecfccb", color: "#3f6212" },
  "施工中": { bg: "#d1fae5", color: "#065f46" },
  "完了報告待ち": { bg: "#ffedd5", color: "#9a3412" },
  "報告書確認中": { bg: "#ede9fe", color: "#5b21b6" },
  "検収完了": { bg: "#dcfce7", color: "#166534" },
  "請求済み": { bg: "#f3f4f6", color: "#4b5563" },
  "キャンセル": { bg: "#fee2e2", color: "#b91c1c" },
  "延期": { bg: "#fef9c3", color: "#854d0e" },
};

export function statusBadge(status: string): CSSProperties {
  const s = statusStyle[status] || { bg: "#f3f4f6", color: "#6b7280" };
  return badge(s.bg, s.color);
}
