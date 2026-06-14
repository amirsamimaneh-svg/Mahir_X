"use client";

import { motion } from "framer-motion";

const TICKER = [
  { symbol: "BTC", price: "$67,432", change: "+2.4%", bull: true },
  { symbol: "ETH", price: "$3,521", change: "+1.8%", bull: true },
  { symbol: "SOL", price: "$178.5", change: "+5.2%", bull: true },
  { symbol: "BNB", price: "$612", change: "-0.8%", bull: false },
  { symbol: "XRP", price: "$0.622", change: "+3.1%", bull: true },
  { symbol: "ADA", price: "$0.489", change: "-1.2%", bull: false },
  { symbol: "AVAX", price: "$38.7", change: "+4.6%", bull: true },
  { symbol: "DOT", price: "$8.12", change: "+2.9%", bull: true },
  { symbol: "LINK", price: "$14.3", change: "+6.1%", bull: true },
  { symbol: "MATIC", price: "$0.91", change: "-2.3%", bull: false },
];

const tickerItems = [...TICKER, ...TICKER];

export function Hero() {
  return (
    <section style={{
      paddingTop: "clamp(120px, 18vw, 180px)",
      paddingBottom: "clamp(60px, 10vw, 120px)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glows */}
      <div style={{
        position: "absolute", top: "5%", left: "10%",
        width: "clamp(300px, 50vw, 600px)", height: "clamp(300px, 50vw, 600px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(123, 92, 246, 0.2), transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
        animation: "glow-pulse 6s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "5%",
        width: "clamp(200px, 40vw, 500px)", height: "clamp(200px, 40vw, 500px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0, 255, 204, 0.12), transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
        animation: "glow-pulse 8s ease-in-out infinite reverse",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Live badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="badge" style={{ marginBottom: 32, display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon)", animation: "pulse-neon 2s ease-in-out infinite", flexShrink: 0 }} />
            AI-Powered Crypto Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display"
          style={{
            fontSize: "clamp(42px, 8vw, 100px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.035em",
            color: "var(--text)", marginBottom: 24, maxWidth: "14ch",
          }}
        >
          Trade Smarter{" "}
          <span style={{
            background: "linear-gradient(135deg, #A78BFA 0%, #00FFCC 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>with AI.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text2)",
            lineHeight: 1.7, maxWidth: "52ch", marginBottom: 40,
          }}
        >
          Multi-agent AI analysis, real-time signals, whale tracking, and personalized insights — all in one platform that adapts to your trading style.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}
        >
          <a href="/dashboard" className="btn-neon" style={{ fontSize: 16, padding: "14px 30px" }}>
            Get Started Free →
          </a>
          <a href="#features" className="btn-ghost" style={{ fontSize: 16, padding: "14px 30px" }}>
            Explore Features
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: "flex", gap: "clamp(28px, 6vw, 72px)", flexWrap: "wrap",
            justifyContent: "center", marginBottom: 80,
            paddingTop: 40, borderTop: "1px solid var(--border)",
            width: "100%", maxWidth: 640,
          }}
        >
          {[
            { value: "10M+", label: "Signals Generated" },
            { value: "50K+", label: "Active Traders" },
            { value: "94%",  label: "Signal Accuracy" },
            { value: "<50ms", label: "Latency" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="font-display neon-text" style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Live Ticker */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
          style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", overflow: "hidden", position: "relative" }}
        >
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 100,
            background: "linear-gradient(to right, var(--bg), transparent)", zIndex: 2, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 100,
            background: "linear-gradient(to left, var(--bg), transparent)", zIndex: 2, pointerEvents: "none",
          }} />
          <div style={{
            display: "flex", width: "max-content",
            animation: "ticker-scroll 35s linear infinite",
          }}>
            {tickerItems.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRight: "1px solid var(--border)", flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{t.symbol}</span>
                <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>{t.price}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.bull ? "var(--bull)" : "var(--bear)" }}>{t.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
