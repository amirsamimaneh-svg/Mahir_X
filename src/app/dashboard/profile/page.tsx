"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TRADING_STYLES = [
  { id: "scalper",     label: "Scalper",      desc: "Minutes to hours. High frequency, small targets.", icon: "⚡" },
  { id: "day",         label: "Day Trader",   desc: "Within the day. Closes all positions by EOD.",    icon: "☀️" },
  { id: "swing",       label: "Swing Trader", desc: "Days to weeks. Rides medium-term trends.",         icon: "🌊" },
  { id: "investor",    label: "Investor",     desc: "Weeks to months. Fundamentals-driven holds.",      icon: "💎" },
];

const RISK_LEVELS = [
  { id: "conservative", label: "Conservative", desc: "≤1% per trade. Capital preservation first.",   color: "var(--bull)"   },
  { id: "moderate",     label: "Moderate",     desc: "1–2% per trade. Balanced growth approach.",    color: "var(--accent)" },
  { id: "aggressive",   label: "Aggressive",   desc: "2–5% per trade. High growth, higher risk.",    color: "var(--bear)"   },
];

const ASSETS = ["BTC", "ETH", "SOL", "BNB", "ADA", "AVAX", "LINK", "DOT", "MATIC", "ARB", "OP", "DOGE"];
const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];

export default function ProfilePage() {
  const [style, setStyle]         = useState("swing");
  const [risk, setRisk]           = useState("moderate");
  const [favAssets, setFavAssets] = useState<string[]>(["BTC", "ETH", "SOL"]);
  const [favTfs, setFavTfs]       = useState<string[]>(["4H", "1D"]);
  const [saved, setSaved]         = useState(false);

  function toggleAsset(a: string) {
    setFavAssets(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }
  function toggleTf(tf: string) {
    setFavTfs(prev => prev.includes(tf) ? prev.filter(x => x !== tf) : [...prev, tf]);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 780 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Profile & AI Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Personalize the AI to match your trading style and risk tolerance</p>
      </div>

      {/* ── Avatar section ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--brand), var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#fff",
        }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>Amir Samimaneh</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>amirsamimaneh@gmail.com</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100,
              background: "var(--brand-glow)", border: "1px solid rgba(108,92,231,0.3)", color: "var(--brand-light)",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>Free Plan</span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100,
              background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.2)", color: "var(--bull)",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>3/5 AI analyses</span>
          </div>
        </div>
        <a href="/#pricing" style={{
          padding: "9px 18px", borderRadius: 10, background: "var(--brand)", color: "#fff",
          fontSize: 13, fontWeight: 700, textDecoration: "none", flexShrink: 0,
        }}>Upgrade →</a>
      </div>

      {/* ── Trading Style ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Trading Style</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>The AI tailors entry timing, position sizing, and analysis depth to your style.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
          {TRADING_STYLES.map(ts => {
            const active = style === ts.id;
            return (
              <motion.button
                key={ts.id} onClick={() => setStyle(ts.id)} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px 14px", borderRadius: 12, border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
                  background: active ? "rgba(108,92,231,0.12)" : "var(--surface2)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{ts.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: active ? "var(--brand-light)" : "var(--text)", marginBottom: 4 }}>{ts.label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{ts.desc}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Risk Level ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Risk Tolerance</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>Controls stop-loss tightness, leverage suggestions, and position size recommendations.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {RISK_LEVELS.map(rl => {
            const active = risk === rl.id;
            return (
              <motion.button
                key={rl.id} onClick={() => setRisk(rl.id)} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px", borderRadius: 12,
                  border: `1.5px solid ${active ? rl.color : "var(--border)"}`,
                  background: active ? `color-mix(in srgb, ${rl.color} 10%, transparent)` : "var(--surface2)",
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s",
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  {[1, 2, 3].map(n => {
                    const filled = rl.id === "conservative" ? 1 : rl.id === "moderate" ? 2 : 3;
                    return <div key={n} style={{ width: 8, height: 18, borderRadius: 3, background: n <= filled ? rl.color : "var(--border2)" }} />;
                  })}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: active ? rl.color : "var(--text)", marginBottom: 3 }}>{rl.label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5 }}>{rl.desc}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Favorite Assets ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Favorite Assets</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>AI will prioritize signals and analysis for these assets.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ASSETS.map(a => {
            const active = favAssets.includes(a);
            return (
              <button key={a} onClick={() => toggleAsset(a)} style={{
                padding: "7px 14px", borderRadius: 9, border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
                background: active ? "rgba(108,92,231,0.14)" : "var(--surface2)",
                color: active ? "var(--brand-light)" : "var(--text3)",
                fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}>{a}</button>
            );
          })}
        </div>
      </div>

      {/* ── Preferred Timeframes ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Preferred Timeframes</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>The AI focuses chart analysis on these timeframes first.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TIMEFRAMES.map(tf => {
            const active = favTfs.includes(tf);
            return (
              <button key={tf} onClick={() => toggleTf(tf)} style={{
                padding: "7px 18px", borderRadius: 9, border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
                background: active ? "rgba(0,194,255,0.1)" : "var(--surface2)",
                color: active ? "var(--accent)" : "var(--text3)",
                fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              }}>{tf}</button>
            );
          })}
        </div>
      </div>

      {/* ── Save button ── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <motion.button
          onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{
            padding: "12px 32px", borderRadius: 11, border: "none",
            background: saved ? "var(--bull)" : "var(--brand)",
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            transition: "background 0.3s", boxShadow: "0 4px 20px rgba(108,92,231,0.4)",
          }}
        >
          {saved ? "✓ Saved!" : "Save Profile"}
        </motion.button>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>
          AI will use: <strong style={{ color: "var(--brand-light)" }}>
            {TRADING_STYLES.find(s => s.id === style)?.label}
          </strong> · <strong style={{ color: RISK_LEVELS.find(r => r.id === risk)?.color }}>
            {RISK_LEVELS.find(r => r.id === risk)?.label}
          </strong>
        </span>
      </div>
    </div>
  );
}
