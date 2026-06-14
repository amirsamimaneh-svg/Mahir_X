"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { team } from "@/lib/data";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

const memberKeys = ["ar", "sc", "jp", "ml"] as const;

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { lang } = useLanguage();

  return (
    <section id="team" ref={ref} className="section-pad">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16, textAlign: "center" }}>
          <span className="badge">{t.team.badge[lang]}</span>
        </motion.div>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display"
            style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.15, color: "var(--text)", marginBottom: 12, whiteSpace: "pre-line" }}
          >
            {t.team.h2[lang]}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 16, color: "var(--text2)", maxWidth: "52ch", lineHeight: 1.65, margin: "0 auto" }}
          >
            {t.team.p[lang]}
          </motion.p>
        </div>

        <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card" style={{ textAlign: "center", padding: "32px 24px" }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 16, margin: "0 auto 16px",
                background: "linear-gradient(135deg, var(--bg2), var(--surface2))",
                border: "2px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "var(--brand)",
              }}>
                {member.initials}
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, color: "var(--text)" }}>{t.team.members[memberKeys[i]].name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 12, opacity: 0.85 }}>
                {t.team.members[memberKeys[i]].role[lang]}
              </div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{t.team.members[memberKeys[i]].bio[lang]}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {["X", "in", "be"].map((s) => (
                  <a key={s} href="#" style={{
                    width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "var(--text3)", textDecoration: "none", transition: "color 0.2s, border-color 0.2s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                  >{s}</a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) { .team-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 720px) { .team-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
