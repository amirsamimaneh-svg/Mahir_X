"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { projects, allCategories } from "@/lib/data";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

function Modal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  const { lang } = useLanguage();
  const pd = t.work.projects[project.id as keyof typeof t.work.projects];
  const m = t.work.modal;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--surface)", borderRadius: 24, padding: 36, maxWidth: 580, width: "100%", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ height: 200, borderRadius: 16, marginBottom: 24, background: `linear-gradient(135deg, ${project.color}22, ${project.color}11)`, border: `1px solid ${project.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: project.color }}>
          {project.title[0]}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${project.color}15`, color: project.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{tag}</span>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 8 }}>
          {lang === "fa" ? t.work.cats[project.category as keyof typeof t.work.cats]?.fa : project.category}
        </div>
        <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{pd?.title || project.title}</h3>
        <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, marginBottom: 24 }}>{pd?.desc[lang] || project.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          {[[m.client[lang], project.client], [m.year[lang], project.year], [m.role[lang], project.role]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text3)", marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{v}</div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ marginTop: 24, width: "100%", padding: "12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--text2)", fontFamily: "inherit", transition: "background 0.2s" }}>
          {m.close[lang]}
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const { lang } = useLanguage();

  const filtered = activeCategory === "All" ? projects : projects.filter(p => p.category === activeCategory);

  const catLabel = (cat: string) => {
    if (cat === "All") return t.work.all[lang];
    return lang === "fa" ? (t.work.cats[cat as keyof typeof t.work.cats]?.fa || cat) : cat;
  };

  return (
    <section id="work" ref={ref} className="section-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16, textAlign: "center" }}>
          <span className="badge">{t.work.badge[lang]}</span>
        </motion.div>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display"
            style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 12 }}
          >
            {projects.length}+ {t.work.h2[lang]}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 16, color: "var(--text2)", maxWidth: "52ch", lineHeight: 1.65, margin: "0 auto" }}
          >
            {t.work.p[lang]}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36, justifyContent: "center" }}
        >
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: "7px 16px", borderRadius: 100, border: "1.5px solid",
              borderColor: activeCategory === cat ? "var(--brand)" : "var(--border)",
              background: activeCategory === cat ? "var(--brand)" : "transparent",
              color: activeCategory === cat ? "#fff" : "var(--text2)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {catLabel(cat)}
            </button>
          ))}
        </motion.div>

        <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const pd = t.work.projects[p.id as keyof typeof t.work.projects];
              return (
                <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="card" onClick={() => setSelected(p)} style={{ cursor: "pointer", padding: 0, overflow: "hidden" }}
                >
                  <div style={{ height: 180, borderRadius: "19px 19px 0 0", background: `linear-gradient(135deg, ${p.color}25, ${p.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: p.color, position: "relative" }}>
                    {p.title[0]}
                    <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: `${p.color}20`, color: p.color, letterSpacing: "0.06em" }}>{p.year}</span>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: p.color, marginBottom: 8 }}>
                      {catLabel(p.category)}
                    </div>
                    <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{pd?.title || p.title}</h3>
                    <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>{pd?.desc[lang] || p.description}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "var(--bg2)", color: "var(--text3)", border: "1px solid var(--border)", fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{`
        @media (max-width: 980px) { .work-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 720px) { .work-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
