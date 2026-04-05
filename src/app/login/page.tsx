"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth";
import { section, shead, pageTitle } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess("確認メールを送信しました。メール内のリンクをクリックしてください。");
      } else {
        await signIn(email, password);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "認証に失敗しました");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ width: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>⚡</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>EV Platform</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>充電器施工管理システム</div>
        </div>

        <div style={section}>
          <div style={shead}>{isSignUp ? "新規登録" : "ログイン"}</div>
          <form onSubmit={handleSubmit} style={{ padding: 12 }}>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 4, padding: "6px 8px", fontSize: 11, color: "#b91c1c", marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 4, padding: "6px 8px", fontSize: 11, color: "#166534", marginBottom: 8 }}>{success}</div>}

            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 2 }}>メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 2 }}>パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
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

        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "#9ca3af" }}>
          ※認証なしで利用する場合は<a href="/" style={{ color: "#059669" }}>こちら</a>
        </div>
      </div>
    </div>
  );
}
