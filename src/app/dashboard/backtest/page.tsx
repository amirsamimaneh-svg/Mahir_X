"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BacktestPage() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function runBacktest() {
    setRunning(true);
    setDone(false);
    setTimeout(() => { setRunning(false); setDone(true); }, 2200);
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Backtesting</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Test your strategy against historical data with AI analysis</p>
      </div>

      {/* Config */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[
            { label: "Asset", value: "BTC/USDT" },
            { label: "Timeframe", value: "4H" },
            { label: "Period", value: "Jan 2024 – Jun 2026" },
            { label: "Initial Capital", value: "$10,000" },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{f.label}</div>
              <div style={{
                padding: "9px 13px", borderRadius: 9, background: "var(--surface2)",
                border: "1.5px solid var(--border)", color: "var(--text)", fontSize: 13, fontWeight: 600,
              }}>{f.value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={runBacktest}
          disabled={running}
          style={{
            width: "100%", padding: "12px", borderRadius: 11, border: "none",
            background: running ? "var(--surface3)" : "var(--brand)",
            color: running ? "var(--text3)" : "#fff",
            fontSize: 14, fontWeight: 700, cursor: running ? "default" : "pointer",
            boxShadow: running ? "none" : "0 4px 16px rgba(108,92,231,0.4)",
            transition: "all 0.2s",
          }}
        >
          {running ? "⏳ Running Backtest…" : "▶ Run Backtest"}
        </button>
      </div>

      {/* Results */}
      {done && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Total Return",  value: "+68.4%",  color: "var(--bull)" },
              { label: "Win Rate",      value: "64%",     color: "var(--text)" },
              { label: "Max Drawdown",  value: "-14.2%",  color: "var(--bear)" },
              { label: "Sharpe Ratio",  value: "1.84",    color: "var(--accent)" },
              { label: "Total Trades",  value: "147",     color: "var(--text)" },
              { label: "Avg R/R",       value: "2.3×",    color: "var(--bull)" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, letterSpacing: "-0.02em" }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 20px", background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.3)", borderRadius: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-light)", marginBottom: 8 }}>🤖 AI Analysis</div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>
              Solid strategy with consistent returns. The 64% win rate combined with 2.3× R/R gives strong expectancy.
              Consider tightening entry conditions during low-volatility periods (ATR {"<"} 0.5%) — 38% of losses occurred then.
              Adding a volume filter could push win rate to ~71%.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
