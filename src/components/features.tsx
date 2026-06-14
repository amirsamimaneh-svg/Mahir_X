"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🤖",
    title: "Multi-Agent AI System",
    desc: "5 specialized agents analyze technical, fundamental, on-chain, sentiment, and macro data simultaneously. A Consensus Engine combines them into one clear signal with confidence score.",
    badge: "Core",
  },
  {
    icon: "⚡",
    title: "Real-Time Signals",
    desc: "Sub-50ms signal generation with entry zone, stop-loss, take-profit, and risk level. Filter by timeframe, risk tolerance, and asset class.",
    badge: "Live",
  },
  {
    icon: "🐋",
    title: "Whale Tracker",
    desc: "Monitor large wallet movements and exchange flows in real time. Get instant alerts when significant capital moves on-chain — before the market reacts.",
    badge: "On-Chain",
  },
  {
    icon: "🧠",
    title: "AI Prompt Engine",
    desc: 'Ask anything: "Best altcoins for swing trading" or "Analyze BTC for 24h". Get structured analysis with entry zones, SL/TP, and scenario breakdowns.',
    badge: "AI Chat",
  },
  {
    icon: "📊",
    title: "Personalized Intelligence",
    desc: "The AI learns your trading style — scalper, day trader, swing trader, or investor — and adapts signals to your risk profile with personalized warnings.",
    badge: "Adaptive",
  },
  {
    icon: "🔄",
    title: "Backtesting Engine",
    desc: "Test any strategy on historical data. See ROI, win rate, max drawdown, and full trade history charts before risking real capital.",
    badge: "Strategy",
  },
];

export function Features() {
  return (
    <section id="features" className="section-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-brand" style={{ marginBottom: 20 }}>Platform Features</span>
          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.03em",
            color: "var(--text)", marginBottom: 16,
          }}>
            Everything you need to{" "}
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #00FFCC 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>win.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--text2)", maxWidth: "50ch", margin: "0 auto" }}>
            From real-time market data to AI-powered insights, Mahir X gives you every edge in crypto trading.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "var(--surface2)", border: "1px solid var(--border2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                }}>{f.icon}</div>
                <span className="badge" style={{ fontSize: 10 }}>{f.badge}</span>
              </div>
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 4 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
