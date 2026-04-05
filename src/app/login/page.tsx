"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";
import { section, shead } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        setSuccess("確認メールを送信しました。メール内のリンクをクリックしてください。");
      } else {
        await signIn(email, password);
        router.push("/");
      }
    } catch (err: any) { setError(err.message || "認証に失敗しました"); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 28 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>EV Platform</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>充電器施工管理システム</div>
        </div>

        <div style={section}>
          <div style={shead}>{isSignUp ? "新規登録" : "ログイン"}</div>
          <form onSubmit={handleSubmit} style={{ padding: 12 }}>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "6px 8px", fontSize: 11, color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "6px 8px", fontSize: 11, color: "#166534", marginBottom: 8 }}>{success}</div>}

            {isSignUp && (
              <div style={{ marginBottom: 8 }}>
                <label htmlFor="displayName" style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 2 }}>表示名</label>
                <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }} placeholder="山田太郎" />
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <label htmlFor="email" style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 2 }}>メールアドレス</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="password" style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 2 }}>パスワード</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#9ca3af" : "#059669", color: "white", border: "none", borderRadius: 4, padding: "8px", fontSize: 12, fontWeight: 600, cursor: loading ? "default" : "pointer" }}>
              {loading ? "処理中..." : isSignUp ? "登録" : "ログイン"}
            </button>

            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
                style={{ background: "none", border: "none", color: "#059669", fontSize: 11, cursor: "pointer" }}>
                {isSignUp ? "アカウントをお持ちの方はログイン" : "新規登録はこちら"}
              </button>
            </div>
          </form>
        </div>

        {/* ロール説明 */}
        <div style={{ ...section, marginTop: 10 }}>
          <div style={shead}>ロール権限</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                { role: "管理者", desc: "全操作、ユーザー管理、マスタ編集、案件削除", color: "#dc2626" },
                { role: "テラ案件担当", desc: "自担当案件の全操作、検収承認", color: "#2563eb" },
                { role: "テラ施工管理", desc: "図面確認、技術相談、完了報告精査", color: "#7c3aed" },
                { role: "協力会社", desc: "自社担当案件の閲覧、書類提出、報告書", color: "#059669" },
                { role: "メーカー", desc: "自社充電器の案件閲覧、仕様書のみ", color: "#d97706" },
              ].map((r) => (
                <tr key={r.role}>
                  <td style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, color: r.color, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>{r.role}</td>
                  <td style={{ padding: "4px 8px", fontSize: 11, color: "#6b7280", borderBottom: "1px solid #f0f0f0" }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#9ca3af" }}>
          ※認証なしで利用する場合は<a href="/" style={{ color: "#059669" }}>こちら</a>
          <br/>※新規登録後のロール変更は管理者に依頼してください
        </div>
      </div>
    </div>
  );
}
