"use client";

import { motion } from "framer-motion";

const transfers = [
  { from: "0x3f5C...8a2B", to: "Binance", asset: "BTC",  amount: "1,842",  usd: "$123.1M", time: "4m ago",  type: "exchange_in",  signal: "BEARISH" },
  { from: "Coinbase",       to: "0x7E1D...3c9F", asset: "ETH",  amount: "28,400", usd: "$98.8M",  time: "12m ago", type: "exchange_out", signal: "BULLISH" },
  { from: "0x9Ab2...1D7E", to: "0xF43A...88C1", asset: "SOL",  amount: "820K",   usd: "$142.7M", time: "18m ago", type: "wallet_move",  signal: "NEUTRAL" },
  { from: "Binance",        to: "0x2C8b...4E6A", asset: "BTC",  amount: "654",    usd: "$43.7M",  time: "31m ago", type: "exchange_out", signal: "BULLISH" },
  { from: "0x5F1A...7D2C", to: "Kraken",        asset: "ETH",  amount: "11,200", usd: "$39.0M",  time: "45m ago", type: "exchange_in",  signal: "BEARISH" },
  { from: "0xA3C9...2B8E", to: "0x6F5D...1A3B", asset: "BTC",  amount: "290",    usd: "$19.4M",  time: "1h ago",  type: "wallet_move",  signal: "NEUTRAL" },
];

const SIGNAL_STYLE: Record<string, { color: string; bg: string }> = {
  BULLISH: { color: "var(--bull)", bg: "var(--bull-dim)" },
  BEARISH: { color: "var(--bear)", bg: "var(--bear-dim)" },
  NEUTRAL: { color: "var(--text3)", bg: "rgba(74,85,104,0.15)" },
};

export default function WhalesPage() {
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Whale Tracker</h1>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
            background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.3)", color: "var(--bull)",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>● LIVE</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>On-chain large transfers · Threshold: $10M+</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "24h Volume",    value: "$2.8B",  color: "var(--text)" },
          { label: "Bullish Moves", value: "14",     color: "var(--bull)" },
          { label: "Bearish Moves", value: "9",      color: "var(--bear)" },
          { label: "Net Flow",      value: "+$182M", color: "var(--bull)" },
        ].map((s, i) => (
          <motion.div
            key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}
          >
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Transfer table */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Recent Large Transfers</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>Auto-refreshing · AI-classified</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                {["Asset", "Amount", "USD Value", "From", "To", "AI Signal", "Time"].map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfers.map((t, i) => {
                const sig = SIGNAL_STYLE[t.signal];
                return (
                  <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ fontWeight: 800, color: "var(--text)" }}>{t.asset}</td>
                    <td style={{ fontWeight: 700, color: "var(--text)" }}>{t.amount}</td>
                    <td style={{ color: "var(--accent)", fontWeight: 700 }}>{t.usd}</td>
                    <td style={{ fontSize: 11, color: "var(--text2)", fontFamily: "monospace" }}>{t.from}</td>
                    <td style={{ fontSize: 11, color: "var(--text2)", fontFamily: "monospace" }}>{t.to}</td>
                    <td>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                        background: sig.bg, color: sig.color, letterSpacing: "0.04em",
                      }}>{t.signal}</span>
                    </td>
                    <td style={{ color: "var(--text3)" }}>{t.time}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
