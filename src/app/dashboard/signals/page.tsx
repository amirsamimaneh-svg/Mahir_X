"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignals, type AISignal } from "@/contexts/signal-context";
import Link from "next/link";

/* ── Static market scan signals ── */
const MARKET_SIGNALS = [
  {
    asset: "BTC/USDT", type: "LONG" as const, entry: "$66,800", sl: "$65,200", tp: "$69,000", tp2: "$72,000",
    conf: 87, timeframe: "4H", tag: "High Confidence", category: "swing",
    agent: "Technical + On-Chain", time: "2h ago", rr: "2.8",
    summary: "Strong bullish momentum confirmed by whale accumulation and RSI divergence on 4H.",
  },
  {
    asset: "SOL/USDT", type: "LONG" as const, entry: "$174", sl: "$168", tp: "$185", tp2: "$198",
    conf: 82, timeframe: "1D", tag: "Swing", category: "swing",
    agent: "Technical + Sentiment", time: "4h ago", rr: "2.1",
    summary: "Breakout from 3-week consolidation. DeFi TVL up 18% on Solana ecosystem.",
  },
  {
    asset: "BNB/USDT", type: "SHORT" as const, entry: "$618", sl: "$625", tp: "$605", tp2: "$595",
    conf: 74, timeframe: "1H", tag: "Scalping", category: "scalp",
    agent: "Technical", time: "6h ago", rr: "1.9",
    summary: "Bearish engulfing on 1H with declining volume. Rejection at key resistance $622.",
  },
  {
    asset: "ETH/USDT", type: "LONG" as const, entry: "$3,480", sl: "$3,380", tp: "$3,650", tp2: "$3,850",
    conf: 79, timeframe: "4H", tag: "Low Risk", category: "swing",
    agent: "Multi-Agent", time: "8h ago", rr: "1.7",
    summary: "Spot ETF inflows surging. On-chain activity at 6-month high.",
  },
  {
    asset: "AVAX/USDT", type: "LONG" as const, entry: "$38.50", sl: "$36.80", tp: "$42.00", tp2: "$46.00",
    conf: 85, timeframe: "1D", tag: "High Confidence", category: "swing",
    agent: "Multi-Agent", time: "1h ago", rr: "2.6",
    summary: "Avalanche subnet expansion + technical breakout from 6-week falling wedge.",
  },
];

type FilterTag = "ALL" | "High Confidence" | "Low Risk" | "Scalping" | "Swing";
const FILTERS: FilterTag[] = ["ALL", "High Confidence", "Low Risk", "Scalping", "Swing"];

const TAG_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  "High Confidence": { bg: "rgba(0,200,150,0.12)", border: "rgba(0,200,150,0.3)", color: "var(--bull)" },
  "Low Risk":        { bg: "rgba(0,194,255,0.1)",  border: "rgba(0,194,255,0.25)", color: "var(--accent)" },
  "Scalping":        { bg: "rgba(108,92,231,0.12)", border: "rgba(108,92,231,0.3)", color: "var(--brand-light)" },
  "Swing":           { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)", color: "#F59E0B" },
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/* ── AI Signal card (from chat) ── */
function AISignalCard({ sig, index }: { sig: AISignal; index: number }) {
  const isLong = sig.type === "LONG";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: "var(--surface)",
        border: `1.5px solid ${isLong ? "rgba(0,200,150,0.35)" : "rgba(255,77,79,0.35)"}`,
        borderRadius: 14, padding: "18px 20px",
        boxShadow: `0 0 0 1px ${isLong ? "rgba(0,200,150,0.06)" : "rgba(255,77,79,0.06)"}`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* "AI" glow strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: isLong
          ? "linear-gradient(90deg, transparent, var(--bull), transparent)"
          : "linear-gradient(90deg, transparent, var(--bear), transparent)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{sig.asset}</span>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
              background: isLong ? "var(--bull-dim)" : "var(--bear-dim)",
              color: isLong ? "var(--bull)" : "var(--bear)",
              border: `1px solid ${isLong ? "rgba(0,200,150,0.3)" : "rgba(255,77,79,0.3)"}`,
            }}>{sig.type}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
              background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "var(--brand-light)",
              letterSpacing: "0.04em",
            }}>🤖 AI Chat</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>{timeAgo(sig.timestamp)}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 22, fontWeight: 900,
            color: sig.confidence >= 80 ? "var(--bull)" : sig.confidence >= 65 ? "var(--accent)" : "var(--text2)",
          }}>{sig.confidence}%</div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>confidence</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div style={{ height: 3, background: "var(--surface3)", borderRadius: 2, overflow: "hidden", marginBottom: 14 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${sig.confidence}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: index * 0.06 }}
          style={{
            height: "100%", borderRadius: 2,
            background: sig.confidence >= 80
              ? "linear-gradient(90deg, var(--bull), #00E5B0)"
              : "linear-gradient(90deg, var(--brand), var(--accent))",
          }}
        />
      </div>

      {/* Levels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Entry", value: sig.entry, color: "var(--text)" },
          { label: "Stop",  value: sig.sl,    color: "var(--bear)" },
          { label: "TP",    value: sig.tp,    color: "var(--bull)" },
        ].map(item => (
          <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 9, padding: "8px 10px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {sig.summary && (
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.55 }}>{sig.summary}</p>
      )}
    </motion.div>
  );
}

/* ── Market scan signal card ── */
function MarketCard({ s, i }: { s: typeof MARKET_SIGNALS[0]; i: number }) {
  const tagStyle = TAG_COLORS[s.tag] ?? { bg: "var(--surface3)", border: "var(--border2)", color: "var(--text3)" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
        padding: "18px 20px", transition: "border-color 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{s.asset}</span>
            <span style={{
              fontSize: 10, fontWeight: 800, padding: "3px 7px", borderRadius: 6,
              background: s.type === "LONG" ? "var(--bull-dim)" : "var(--bear-dim)",
              color: s.type === "LONG" ? "var(--bull)" : "var(--bear)",
            }}>{s.type}</span>
            <span style={{ fontSize: 10, padding: "3px 6px", borderRadius: 5, background: "var(--surface3)", color: "var(--text3)", fontWeight: 600 }}>{s.timeframe}</span>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100,
            background: tagStyle.bg, border: `1px solid ${tagStyle.border}`, color: tagStyle.color, textTransform: "uppercase",
          }}>{s.tag}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: s.conf >= 82 ? "var(--bull)" : "var(--accent)" }}>{s.conf}%</div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>confidence</div>
        </div>
      </div>

      <div style={{ height: 3, background: "var(--surface3)", borderRadius: 2, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ height: "100%", width: `${s.conf}%`, background: s.conf >= 82 ? "var(--bull)" : "linear-gradient(90deg, var(--brand), var(--accent))", borderRadius: 2 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Entry", value: s.entry, color: "var(--text)" },
          { label: "Stop",  value: s.sl,    color: "var(--bear)" },
          { label: "TP1",   value: s.tp,    color: "var(--bull)" },
          { label: "TP2",   value: s.tp2,   color: "var(--bull)" },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.55, marginBottom: 12 }}>{s.summary}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: 11, color: "var(--brand-light)", fontWeight: 600 }}>{s.agent}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>R/R {s.rr}x</span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{s.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignalsPage() {
  const [filter, setFilter]     = useState<FilterTag>("ALL");
  const [tab, setTab]           = useState<"ai" | "market">("ai");
  const { signals, markAllRead } = useSignals();

  /* Mark read when viewing */
  const handleTabChange = (t: "ai" | "market") => {
    setTab(t);
    if (t === "ai") markAllRead();
  };

  const filtered = filter === "ALL"
    ? MARKET_SIGNALS
    : filter === "High Confidence" ? MARKET_SIGNALS.filter(s => s.conf >= 82)
    : filter === "Low Risk"        ? MARKET_SIGNALS.filter(s => s.tag === "Low Risk")
    : filter === "Scalping"        ? MARKET_SIGNALS.filter(s => s.category === "scalp")
    : MARKET_SIGNALS.filter(s => s.category === "swing");

  return (
    <div style={{ padding: "24px 28px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Signals</h1>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
              background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.3)", color: "var(--bull)",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>● LIVE</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>AI-generated trade setups · Updated in real-time</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        <button onClick={() => handleTabChange("ai")} style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
          color: tab === "ai" ? "var(--text)" : "var(--text3)",
          borderBottom: tab === "ai" ? "2px solid var(--brand)" : "2px solid transparent",
          transition: "all 0.15s",
        }}>
          🤖 AI Chat Signals
          {signals.length > 0 && (
            <span style={{
              minWidth: 18, height: 18, borderRadius: 100, background: "var(--brand)",
              color: "#fff", fontSize: 10, fontWeight: 800,
              display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
            }}>{signals.length}</span>
          )}
        </button>
        <button onClick={() => handleTabChange("market")} style={{
          padding: "9px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
          color: tab === "market" ? "var(--text)" : "var(--text3)",
          borderBottom: tab === "market" ? "2px solid var(--brand)" : "2px solid transparent",
          transition: "all 0.15s",
        }}>
          📡 Market Scan
        </button>
      </div>

      {/* ── AI Chat Signals tab ── */}
      <AnimatePresence mode="wait">
        {tab === "ai" && (
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {signals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No AI signals yet</div>
                <p style={{ fontSize: 13, color: "var(--text3)", maxWidth: "36ch", margin: "0 auto 24px", lineHeight: 1.6 }}>
                  Go to AI Chat and ask for a trade setup. When the AI detects Entry / Stop Loss / Take Profit levels, it automatically saves the signal here and sends you a notification.
                </p>
                <Link href="/dashboard/ai" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 24px", borderRadius: 11, background: "var(--brand)", color: "#fff",
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(108,92,231,0.4)",
                }}>
                  Open AI Chat →
                </Link>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: "var(--text3)" }}>{signals.length} signal{signals.length !== 1 ? "s" : ""} saved from AI Chat</p>
                  <Link href="/dashboard/ai" style={{
                    padding: "7px 14px", borderRadius: 9, background: "var(--brand)", color: "#fff",
                    fontSize: 12, fontWeight: 700, textDecoration: "none",
                  }}>+ New Analysis →</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                  {signals.map((sig, i) => (
                    <AISignalCard key={sig.id} sig={sig} index={i} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ── Market Scan tab ── */}
        {tab === "market" && (
          <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {FILTERS.map(f => {
                const tc = f !== "ALL" ? TAG_COLORS[f] : null;
                const active = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: "7px 16px", borderRadius: 100, border: "1.5px solid", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.02em",
                    borderColor: active ? (tc?.border ?? "var(--brand)") : "var(--border)",
                    background: active ? (tc?.bg ?? "rgba(108,92,231,0.14)") : "transparent",
                    color: active ? (tc?.color ?? "var(--brand-light)") : "var(--text3)",
                  }}>{f}</button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {filtered.map((s, i) => <MarketCard key={`${s.asset}-${i}`} s={s} i={i} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p style={{ marginTop: 28, fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
        ⚠️ AI-generated signals for educational purposes only. Not financial advice. Always manage your risk.
      </p>
    </div>
  );
}
