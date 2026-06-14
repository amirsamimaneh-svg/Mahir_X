"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with basic market data and limited AI signals.",
    cta: "Start Free",
    ctaVariant: "ghost",
    features: [
      "5 AI signals per day",
      "Basic market overview",
      "BTC & ETH analysis",
      "Community signals",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    desc: "Full AI analysis, unlimited signals, and advanced tools.",
    cta: "Start Pro — Free 7-day Trial",
    ctaVariant: "neon",
    features: [
      "Unlimited AI signals",
      "Multi-agent AI analysis",
      "100+ cryptocurrencies",
      "Backtesting engine",
      "AI prompt engine",
      "Portfolio tracker",
      "Basic whale alerts",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$149",
    period: "/ month",
    desc: "The complete trading intelligence ecosystem.",
    cta: "Go Premium",
    ctaVariant: "brand",
    features: [
      "Everything in Pro",
      "Advanced whale tracking",
      "Copy trading system",
      "Strategy marketplace",
      "No-code strategy builder",
      "AI trading journal",
      "Scenario simulator",
      "Full API access",
      "Dedicated AI advisor",
    ],
    popular: false,
  },
];

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="section-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge badge-brand" style={{ marginBottom: 20 }}>Pricing</span>
          <h2 className="font-display" style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text)", marginBottom: 16,
          }}>
            Start free. Scale when ready.
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--text2)" }}>
            No credit card required. Cancel anytime.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: p.popular
                  ? "linear-gradient(135deg, rgba(123,92,246,0.12), rgba(0,255,204,0.05))"
                  : "var(--surface)",
                border: `1px solid ${p.popular ? "var(--brand)" : "var(--border)"}`,
                borderRadius: 20, padding: 28, position: "relative",
                boxShadow: p.popular ? "var(--shadow-brand)" : "var(--shadow-sm)",
              }}
            >
              {p.popular && (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, var(--brand), var(--neon))",
                  color: "#070B14", fontSize: 11, fontWeight: 800,
                  padding: "4px 16px", borderRadius: 100,
                  letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>Most Popular</div>
              )}

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text2)", marginBottom: 10 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
                  <span className="font-display" style={{
                    fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em",
                    color: p.popular ? "var(--neon)" : "var(--text)",
                  }}>{p.price}</span>
                  <span style={{ fontSize: 15, color: "var(--text3)" }}>{p.period}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.55 }}>{p.desc}</p>
              </div>

              <a
                href="/dashboard"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "100%", marginBottom: 24,
                  ...(p.ctaVariant === "neon"
                    ? { background: "var(--neon)", color: "#070B14", fontWeight: 700, fontSize: 14, padding: "11px 20px", borderRadius: 12, border: "none", textDecoration: "none", boxShadow: "var(--shadow-neon)" }
                    : p.ctaVariant === "brand"
                    ? { background: "var(--brand)", color: "#fff", fontWeight: 600, fontSize: 14, padding: "11px 20px", borderRadius: 12, border: "none", textDecoration: "none", boxShadow: "var(--shadow-brand)" }
                    : { background: "transparent", color: "var(--text)", fontWeight: 600, fontSize: 14, padding: "11px 20px", borderRadius: 12, border: "1.5px solid var(--border2)", textDecoration: "none" }),
                }}
              >{p.cta}</a>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--neon)", flexShrink: 0, marginTop: 1 }}><CheckIcon /></span>
                    <span style={{ fontSize: 14, color: "var(--text2)" }}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
