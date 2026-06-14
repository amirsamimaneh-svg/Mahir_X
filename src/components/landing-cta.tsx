"use client";

import { motion } from "framer-motion";

export function LandingCTA() {
  return (
    <section className="section-pad">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(123, 92, 246, 0.12) 0%, rgba(0, 255, 204, 0.06) 100%)",
            border: "1px solid var(--border2)",
            borderRadius: 28,
            padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)",
            position: "relative", overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: "-20%", left: "25%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123, 92, 246, 0.18), transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }} />

          <span className="badge" style={{ marginBottom: 24, display: "inline-flex", position: "relative" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon)", flexShrink: 0 }} />
            Start Today — No Credit Card Required
          </span>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(32px, 5.5vw, 68px)", fontWeight: 800,
              lineHeight: 1.05, letterSpacing: "-0.035em",
              color: "var(--text)", marginBottom: 20, position: "relative",
            }}
          >
            Ready to trade{" "}
            <span style={{
              background: "linear-gradient(135deg, #A78BFA 0%, #00FFCC 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>smarter?</span>
          </h2>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text2)",
            maxWidth: "44ch", margin: "0 auto 40px", lineHeight: 1.65, position: "relative",
          }}>
            Join 50,000+ traders using Mahir X to gain an AI-powered edge in crypto markets.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <a href="/dashboard" className="btn-neon" style={{ fontSize: 16, padding: "14px 32px" }}>
              Get Started Free →
            </a>
            <a href="#features" className="btn-ghost" style={{ fontSize: 16, padding: "14px 32px" }}>
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
