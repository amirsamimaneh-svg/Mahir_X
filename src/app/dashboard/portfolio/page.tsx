"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const holdings = [
  { asset: "BTC",  name: "Bitcoin",   amount: 0.485,  avgPrice: 58200, currentPrice: 66842, allocation: 41.3 },
  { asset: "ETH",  name: "Ethereum",  amount: 3.20,   avgPrice: 2940,  currentPrice: 3481,  allocation: 28.4 },
  { asset: "SOL",  name: "Solana",    amount: 42.5,   avgPrice: 142,   currentPrice: 174.2, allocation: 18.9 },
  { asset: "LINK", name: "Chainlink", amount: 380,    avgPrice: 11.8,  currentPrice: 14.1,  allocation: 6.8 },
  { asset: "AVAX", name: "Avalanche", amount: 62,     avgPrice: 31.5,  currentPrice: 38.5,  allocation: 4.6 },
];

const trades = [
  { date: "Jun 12", asset: "BTC",  type: "BUY",  size: 0.05, price: "$65,200", pnl: "+$182", pnlPct: "+5.6%", status: "CLOSED" },
  { date: "Jun 10", asset: "SOL",  type: "BUY",  size: 8,    price: "$162",    pnl: "+$98",  pnlPct: "+7.5%", status: "CLOSED" },
  { date: "Jun 9",  asset: "BNB",  type: "SHORT",size: 2,    price: "$624",    pnl: "+$36",  pnlPct: "+2.9%", status: "CLOSED" },
  { date: "Jun 7",  asset: "ETH",  type: "BUY",  size: 0.5,  price: "$3,310",  pnl: "-$45",  pnlPct: "-2.7%", status: "CLOSED" },
  { date: "Jun 5",  asset: "LINK", type: "BUY",  size: 100,  price: "$13.40",  pnl: "+$70",  pnlPct: "+5.2%", status: "CLOSED" },
];

/* Deterministic sparkline */
function Sparkline({ seed, color, positive }: { seed: number; color: string; positive: boolean }) {
  const pts = Array.from({ length: 14 }, (_, i) => {
    const v = 50 + Math.sin(i * (seed * 0.7 + 1.1)) * 18 + Math.cos(i * (seed * 0.4 + 0.3)) * 12;
    return Math.max(5, Math.min(95, v));
  });
  const w = 80, h = 36;
  const xStep = w / (pts.length - 1);
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i * xStep).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`).join(" ");
  const fill = pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i * xStep).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`).join(" ")
    + ` L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sg-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${seed})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioPage() {
  const [tab, setTab] = useState<"holdings" | "history">("holdings");

  const totalValue   = holdings.reduce((s, h) => s + h.amount * h.currentPrice, 0);
  const totalCost    = holdings.reduce((s, h) => s + h.amount * h.avgPrice, 0);
  const totalPnL     = totalValue - totalCost;
  const totalPnLPct  = (totalPnL / totalCost) * 100;

  return (
    <div style={{ padding: "24px 28px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Portfolio</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>AI-tracked positions and performance</p>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Value",  value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "Portfolio", color: "var(--text)", accent: "var(--accent)" },
          { label: "Total P&L",    value: `+$${totalPnL.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: `+${totalPnLPct.toFixed(1)}%`, color: "var(--bull)", accent: "var(--bull)" },
          { label: "Today's P&L",  value: "+$842", sub: "+1.3%", color: "var(--bull)", accent: "var(--bull)" },
          { label: "Win Rate",     value: "74%",   sub: "21/28 trades", color: "var(--text)", accent: "var(--brand-light)" },
          { label: "Best Trade",   value: "+$724", sub: "BTC Jun 3",  color: "var(--bull)", accent: "var(--bull)" },
          { label: "Active Pos.",  value: "5",     sub: `$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, color: "var(--text)", accent: "var(--accent)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}
          >
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, letterSpacing: "-0.02em", marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: stat.accent, fontWeight: 600 }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        {(["holdings", "history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
            color: tab === t ? "var(--text)" : "var(--text3)",
            borderBottom: tab === t ? "2px solid var(--brand)" : "2px solid transparent",
            textTransform: "capitalize", transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* ── Holdings tab ── */}
      {tab === "holdings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {holdings.map((h, i) => {
            const value  = h.amount * h.currentPrice;
            const pnl    = (h.currentPrice - h.avgPrice) * h.amount;
            const pnlPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
            const pos    = pnl >= 0;
            return (
              <motion.div
                key={h.asset}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
                  padding: "16px 20px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                }}
              >
                {/* Asset info */}
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{h.asset}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{h.name}</div>
                </div>

                {/* Sparkline */}
                <Sparkline seed={i + 1} color={pos ? "var(--bull)" : "var(--bear)"} positive={pos} />

                {/* Amount + Price */}
                <div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>Holdings</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{h.amount} {h.asset}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>@ ${h.avgPrice.toLocaleString()}</div>
                </div>

                {/* Current value */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>Value</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                </div>

                {/* P&L */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: pos ? "var(--bull)" : "var(--bear)" }}>
                    {pos ? "+" : ""}${Math.abs(pnl).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: pos ? "var(--bull)" : "var(--bear)" }}>
                    {pos ? "+" : ""}{pnlPct.toFixed(1)}%
                  </div>
                </div>

                {/* Allocation bar */}
                <div style={{ minWidth: 80, textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{h.allocation}%</div>
                  <div style={{ height: 4, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${h.allocation}%`, background: "linear-gradient(90deg, var(--brand), var(--accent))", borderRadius: 2 }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── History tab ── */}
      {tab === "history" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                {["Date", "Asset", "Type", "Size", "Price", "P&L", "Status"].map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td style={{ color: "var(--text3)" }}>{t.date}</td>
                  <td style={{ fontWeight: 700, color: "var(--text)" }}>{t.asset}</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: t.type === "BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                      color: t.type === "BUY" ? "var(--bull)" : "var(--bear)",
                    }}>{t.type}</span>
                  </td>
                  <td style={{ color: "var(--text2)" }}>{t.size}</td>
                  <td style={{ fontWeight: 600, color: "var(--text)" }}>{t.price}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: t.pnl.startsWith("+") ? "var(--bull)" : "var(--bear)" }}>{t.pnl}</span>
                    <span style={{ fontSize: 11, color: t.pnlPct.startsWith("+") ? "var(--bull)" : "var(--bear)", marginLeft: 5 }}>({t.pnlPct})</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{t.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── AI Feedback ── */}
      <div style={{
        marginTop: 24, padding: "18px 20px", borderRadius: 14,
        background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.3)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-light)", marginBottom: 8 }}>🤖 AI Portfolio Feedback</div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>
          Strong portfolio composition. BTC and ETH form a stable base (70%). Consider trimming SOL position after +22% run —
          DCA strategy aligns with your Swing Trader profile. Win rate of 74% is excellent; keep stop-losses tight on the BNB position.
        </p>
      </div>
    </div>
  );
}
