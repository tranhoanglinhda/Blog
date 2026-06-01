"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, Logo, primaryBtn, btnGhost, inputStyle } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { isFirebaseEnabled } from "@/lib/firebase";

export default function LoginView() {
  const router = useRouter();
  const { ready, user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && user) router.replace("/admin4869"); }, [ready, user, router]);

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      await signIn(email.trim(), pw);
      router.replace("/admin4869");
    } catch (e: unknown) {
      setErr("Email hoặc mật khẩu không đúng.");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-grid" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--paper)" }}>
      <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <div style={{ width: "min(360px, 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 36 }}>
            <Logo size={34} />
            <span style={{ fontFamily: "var(--serif)", fontSize: 21, fontWeight: 600 }}>Blog Của Bông</span>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 30 }}>Chào mừng trở lại</h1>
          <p className="meta" style={{ fontSize: 15, marginBottom: 30 }}>Đăng nhập để viết và quản lý bài.</p>

          <label style={{ display: "block", marginBottom: 18 }}>
            <span style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="email@vidu.com" style={inputStyle} className="fr" />
          </label>
          <label style={{ display: "block", marginBottom: 18 }}>
            <span style={{ display: "block", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 7 }}>Mật khẩu</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" style={inputStyle} className="fr" />
          </label>

          {err && <p style={{ margin: "0 0 14px", color: "var(--accent)", fontFamily: "var(--sans)", fontSize: 13.5 }}>{err}</p>}

          <button onClick={submit} disabled={busy} className="fr" style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 8, opacity: busy ? 0.7 : 1 }}>{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button>

          {!isFirebaseEnabled && (
            <p className="meta" style={{ fontSize: 12.5, marginTop: 14, lineHeight: 1.5 }}>
              Chế độ thử nghiệm: chưa cấu hình Firebase nên nhập email/mật khẩu bất kỳ là vào được. Cấu hình Firebase Auth để bảo vệ thật (xem README).
            </p>
          )}

          <Link href="/" className="fr" style={{ ...btnGhost, marginTop: 20, color: "var(--accent-ink)" }}><Icon name="arrowL" size={14} /> Về trang blog</Link>
        </div>
      </div>
      <div className="auth-quote" style={{ position: "relative", background: "linear-gradient(150deg, oklch(0.72 0.1 28), oklch(0.5 0.11 18))", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 70% at 70% 20%, rgba(255,255,255,0.3), transparent 50%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 52, color: "#fff" }}>
          <Icon name="quote" size={40} style={{ opacity: 0.5, marginBottom: 18 }} fill="rgba(255,255,255,0.9)" />
          <p style={{ margin: 0, fontFamily: "var(--serif)", fontSize: 28, lineHeight: 1.35, fontStyle: "italic" }}>“Viết là cách mình giữ lại những điều dễ quên.”</p>
          <p style={{ margin: "20px 0 0", fontFamily: "var(--sans)", fontSize: 14, opacity: 0.8 }}>Trang quản trị · Blog Của Bông</p>
        </div>
      </div>
    </div>
  );
}
