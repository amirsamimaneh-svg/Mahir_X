"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("رمزهای عبور یکسان نیستند / Passwords don't match");
      return;
    }
    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد / Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = register(form.name, form.email, form.password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "خطا در ثبت‌نام");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/auth/login"), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, var(--brand) 0%, var(--neon) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 20, color: "#070B14",
            }}>X</div>
            <span style={{ fontWeight: 700, fontSize: 20, color: "var(--text)" }}>
              Mahir<span style={{ color: "var(--neon)" }}>X</span>
            </span>
          </Link>
          <div style={{ marginTop: 16, fontSize: 22, fontWeight: 700, color: "var(--text)" }}>ثبت‌نام / Sign Up</div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 6 }}>
            اولین کاربر به عنوان ادمین ثبت می‌شود
          </div>
        </div>

        {done ? (
          <div style={{
            background: "var(--bull-dim)", border: "1px solid rgba(0,200,150,0.3)",
            borderRadius: 12, padding: 20, textAlign: "center", color: "var(--bull)",
          }}>
            ✅ ثبت‌نام موفق! در حال انتقال به صفحه ورود...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 14,
          }}>
            {error && (
              <div style={{
                background: "var(--bear-dim)", border: "1px solid rgba(255,77,79,0.3)",
                borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--bear)",
              }}>{error}</div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>
                نام / Name
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="نام شما"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>
                ایمیل / Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>
                رمز عبور / Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="حداقل ۶ کاراکتر"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 6 }}>
                تکرار رمز / Confirm Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="رمز را تکرار کنید"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-neon" disabled={loading} style={{ justifyContent: "center", marginTop: 4 }}>
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام / Register"}
            </button>

            <div style={{ textAlign: "center", fontSize: 13, color: "var(--text3)" }}>
              حساب دارید؟{" "}
              <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                ورود / Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
