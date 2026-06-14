"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { services } from "@/lib/data";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

const icons = [
  <svg key="pkg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>,
  <svg key="zap" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>,
  <svg key="target" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>,
];

const serviceKeys = [1, 2, 3] as const;

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { lang } = useLanguage();

  return (
    <section id="services" ref={ref} className="section-pad">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16, textAlign: "center" }}>
          <span className="badge">{t.services.badge[lang]}</span>
        </motion.div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display"
            style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 12, whiteSpace: "pre-line" }}
          >
            {t.services.h2[lang]}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 16, color: "var(--text2)", maxWidth: "52ch", lineHeight: 1.65, margin: "0 auto" }}
          >
            {t.services.p[lang]}
          </motion.p>
        </div>

        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="card" style={{ padding: "32px 28px" }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 14, marginBottom: 20, background: "color-mix(in srgb, var(--brand) 12%, transparent)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icons[i]}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{t.services.items[serviceKeys[i]].title[lang]}</h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", fontFamily: "'Space Grotesk', sans-serif" }}>{s.num}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.65 }}>{t.services.items[serviceKeys[i]].desc[lang]}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 720px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
