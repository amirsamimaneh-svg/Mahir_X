"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

const valueKeys = ["craft", "partner", "speed"] as const;
const valueIcons = [
  <svg key="craft" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>,
  <svg key="partner" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
  <svg key="speed" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>,
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { lang } = useLanguage();

  return (
    <section id="about" ref={ref} className="section-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "center" }} className="about-grid">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16 }}>
              <span className="badge">{t.about.badge[lang]}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display"
              style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 20, color: "var(--text)" }}
            >
              {t.about.h2[lang]}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.7, marginBottom: 36 }}
            >
              {t.about.p[lang]}
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {valueKeys.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: lang === "fa" ? 20 : -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  style={{ display: "flex", gap: 16 }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "color-mix(in srgb, var(--brand) 12%, transparent)",
                    color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {valueIcons[i]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: "var(--text)" }}>{t.about.values[key].title[lang]}</div>
                    <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{t.about.values[key].desc[lang]}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              borderRadius: 24,
              background: "linear-gradient(135deg, color-mix(in srgb, #5B2DD4 15%, var(--surface)), color-mix(in srgb, #D89AB0 10%, var(--surface)))",
              border: "1px solid var(--border)", aspectRatio: "4/3",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative",
            }}
          >
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(60px, 12vw, 140px)", fontWeight: 700, color: "var(--brand)", opacity: 0.2, userSelect: "none" }}>M</div>
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "var(--surface)", borderRadius: 16, padding: "16px 20px", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4 }}>{lang === "fa" ? "تمرکز فعلی" : "Current focus"}</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{lang === "fa" ? "ساخت برای مرحله Series A و فراتر از آن" : "Building for Series A & beyond"}</div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@media (max-width: 980px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
