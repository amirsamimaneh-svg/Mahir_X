"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

type Field = "name" | "email" | "subject" | "message";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { lang } = useLanguage();
  const tc = t.contact;

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) e.name = tc.form.errName[lang];
    if (!form.email.trim()) e.email = tc.form.errEmail[lang];
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = tc.form.errInvalid[lang];
    if (!form.message.trim()) e.message = tc.form.errMsg[lang];
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  const channels = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
      label: tc.channels.email.label[lang],
      value: tc.channels.email.value,
      href: "mailto:hello@mahir.studio",
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 8 8l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 23 18z" /></svg>,
      label: tc.channels.phone.label[lang],
      value: tc.channels.phone.value,
      href: "tel:+15550842210",
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
      label: tc.channels.studio.label[lang],
      value: typeof tc.channels.studio.value === "string" ? tc.channels.studio.value : tc.channels.studio.value[lang],
      href: "#",
    },
  ];

  return (
    <section id="contact" ref={ref} className="section-pad">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16, textAlign: "center" }}>
          <span className="badge">{tc.badge[lang]}</span>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }} className="contact-grid">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display"
              style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 16 }}
            >
              {tc.h2[lang]}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.7, marginBottom: 36 }}
            >
              {tc.p[lang]}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
              {channels.map((c) => (
                <a key={c.label} href={c.href} style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)", transition: "border-color 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.transform = lang === "fa" ? "translateX(-4px)" : "translateX(4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "color-mix(in srgb, var(--brand) 10%, transparent)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text3)", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text3)", marginBottom: 12 }}>{tc.follow[lang]}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["X", "in", "ig", "be"].map(s => (
                  <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--text3)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                  >{s}</a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: "32px 28px", boxShadow: "var(--shadow-sm)" }}
          >
            {success ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  style={{ width: 64, height: 64, borderRadius: "50%", background: "#34c98a20", border: "2px solid #34c98a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}
                >✓</motion.div>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{tc.success.title[lang]}</h3>
                <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.6 }}>{tc.success.p[lang]}</p>
                <button onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  style={{ marginTop: 20, background: "none", border: "none", color: "var(--brand)", fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}
                >
                  {tc.success.again[lang]}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{tc.form.title[lang]}</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {(["name", "email"] as Field[]).map(field => (
                    <div key={field}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5, color: "var(--text2)", textTransform: "capitalize" }}>
                        {field === "name" ? tc.form.name[lang] : tc.form.email[lang]} *
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        placeholder={field === "name" ? tc.form.namePh[lang] : tc.form.emailPh[lang]}
                        value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className={`input-field${errors[field] ? " error" : ""}`}
                        dir={lang === "fa" ? "rtl" : "ltr"}
                      />
                      {errors[field] && <div style={{ fontSize: 11, color: "#e53e3e", marginTop: 3 }}>{errors[field]}</div>}
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5, color: "var(--text2)" }}>{tc.form.subject[lang]}</label>
                  <input type="text" placeholder={tc.form.subjectPh[lang]} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field" dir={lang === "fa" ? "rtl" : "ltr"} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5, color: "var(--text2)" }}>{tc.form.message[lang]} *</label>
                  <textarea rows={5} placeholder={tc.form.messagePh[lang]} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`input-field${errors.message ? " error" : ""}`} style={{ resize: "none" }} dir={lang === "fa" ? "rtl" : "ltr"} />
                  {errors.message && <div style={{ fontSize: 11, color: "#e53e3e", marginTop: 3 }}>{errors.message}</div>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center", marginTop: 4 }}>
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                  ) : tc.form.send[lang]}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <style>{`@media (max-width: 980px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
