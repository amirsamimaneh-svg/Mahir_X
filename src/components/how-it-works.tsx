"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Connect Your Data",
    desc: "Link your exchange accounts or browse anonymously. Mahir X automatically pulls real-time market data, on-chain metrics, and sentiment signals from across the web.",
  },
  {
    num: "02",
    title: "AI Analyzes Everything",
    desc: "5 specialized agents work in parallel — technical, fundamental, on-chain, sentiment, and macro. The Consensus Engine weighs each agent and delivers one clear, actionable signal.",
  },
  {
    num: "03",
    title: "Trade with Confidence",
    desc: "Receive structured signals with entry zone, SL, TP, and confidence score. Track your performance, learn from the AI journal, and refine your strategy over time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 20 }}>How It Works</span>
          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)",
          }}>
            Three steps to smarter trading.
          </h2>
        </div>

        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {/* Vertical connector line */}
          <div style={{
            position: "absolute", left: 27, top: 54, bottom: 54,
            width: 2,
            background: "linear-gradient(to bottom, var(--brand), var(--neon))",
            opacity: 0.25,
          }} />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{ display: "flex", gap: 24, paddingBlock: 32 }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, var(--brand), var(--neon))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: "#070B14",
                boxShadow: "var(--shadow-neon)", zIndex: 1, position: "relative",
              }}>{s.num}</div>
              <div style={{ paddingTop: 10 }}>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
