"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language";

const candles = [
  { o: 60, c: 75, h: 80, l: 55, bull: true },
  { o: 75, c: 70, h: 82, l: 65, bull: false },
  { o: 70, c: 85, h: 90, l: 68, bull: true },
  { o: 85, c: 78, h: 92, l: 74, bull: false },
  { o: 78, c: 95, h: 98, l: 76, bull: true },
  { o: 95, c: 88, h: 100, l: 84, bull: false },
  { o: 88, c: 105, h: 110, l: 86, bull: true },
  { o: 105, c: 115, h: 118, l: 102, bull: true },
  { o: 115, c: 108, h: 120, l: 104, bull: false },
  { o: 108, c: 125, h: 130, l: 106, bull: true },
  { o: 125, c: 118, h: 132, l: 115, bull: false },
  { o: 118, c: 138, h: 142, l: 116, bull: true },
  { o: 138, c: 145, h: 150, l: 134, bull: true },
  { o: 145, c: 135, h: 152, l: 130, bull: false },
  { o: 135, c: 155, h: 160, l: 132, bull: true },
];

const W = 520, H = 180, PAD = 10;
const minV = 55, maxV = 160, range = maxV - minV;

function toY(v: number) { return H - PAD - ((v - minV) / range) * (H - PAD * 2); }

const linePoints = candles.map((c, i) => {
  const x = PAD + i * ((W - PAD * 2) / (candles.length - 1));
  const y = toY((c.o + c.c) / 2);
  return `${x},${y}`;
}).join(" ");

const SIGNALS = [
  { type: "BUY",  coin: "BTC/USDT", price: "$67,432", tp: "$71,200", sl: "$65,800", conf: 94 },
  { type: "SELL", coin: "ETH/USDT", price: "$3,521",  tp: "$3,200",  sl: "$3,650",  conf: 87 },
  { type: "BUY",  coin: "SOL/USDT", price: "$178.5",  tp: "$195",    sl: "$168",    conf: 91 },
];

export function ChartPreview() {
  const { lang } = useLanguage();

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Terminal Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px",
            background: "var(--surface2)",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "monospace" }}>
              MahirX Terminal — BTC/USDT — 1H
            </span>
            <span className="badge" style={{ fontSize: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--bull)", animation: "pulse-dot 2s ease-in-out infinite" }} />
              {lang === "fa" ? "زنده" : "LIVE"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 0 }}>
            {/* Chart Area */}
            <div style={{ padding: 20, borderRight: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", fontFamily: "monospace" }}>$67,432</span>
                  <span style={{ fontSize: 13, color: "var(--bull)", fontWeight: 700, marginLeft: 10 }}>▲ +2.4%</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["1m","5m","15m","1H","4H","1D"].map(tf => (
                    <button key={tf} style={{
                      padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: tf === "1H" ? "var(--brand)" : "var(--surface3)",
                      color: tf === "1H" ? "#fff" : "var(--text3)",
                      border: "none", cursor: "pointer",
                    }}>{tf}</button>
                  ))}
                </div>
              </div>

              {/* SVG Chart */}
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }}>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(r => (
                  <line key={r} x1={PAD} y1={toY(minV + range * r)} x2={W - PAD} y2={toY(minV + range * r)}
                    stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                ))}

                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="var(--brand-light)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Candles */}
                {candles.map((c, i) => {
                  const cw = (W - PAD * 2) / candles.length;
                  const x = PAD + i * cw + cw * 0.2;
                  const cWidth = cw * 0.6;
                  const top = toY(Math.max(c.o, c.c));
                  const bot = toY(Math.min(c.o, c.c));
                  const ch = Math.max(bot - top, 2);
                  const color = c.bull ? "var(--bull)" : "var(--bear)";
                  const midX = x + cWidth / 2;
                  return (
                    <g key={i}>
                      <line x1={midX} y1={toY(c.h)} x2={midX} y2={toY(c.l)} stroke={color} strokeWidth="1.5" />
                      <rect x={x} y={top} width={cWidth} height={ch} fill={color} rx="1" />
                    </g>
                  );
                })}

                {/* Signal arrow */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <polygon
                    points={`${W - PAD - 20},${toY(155)} ${W - PAD - 30},${toY(148)} ${W - PAD - 10},${toY(148)}`}
                    fill="var(--bull)"
                  />
                  <text x={W - PAD - 20} y={toY(143)} textAnchor="middle" fill="var(--bull)" fontSize="10" fontWeight="700">
                    {lang === "fa" ? "خرید" : "BUY"}
                  </text>
                </motion.g>
              </svg>
            </div>

            {/* Signal Panel */}
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                {lang === "fa" ? "سیگنال‌های زنده" : "Live Signals"}
              </div>

              {SIGNALS.map((sig, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  style={{
                    background: "var(--surface2)",
                    border: `1px solid ${sig.type === "BUY" ? "rgba(0,200,150,0.25)" : "rgba(255,77,79,0.25)"}`,
                    borderRadius: 10, padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{sig.coin}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                      background: sig.type === "BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                      color: sig.type === "BUY" ? "var(--bull)" : "var(--bear)",
                      border: `1px solid ${sig.type === "BUY" ? "rgba(0,200,150,0.3)" : "rgba(255,77,79,0.3)"}`,
                    }}>
                      {sig.type === "BUY" ? (lang === "fa" ? "خرید" : "BUY") : (lang === "fa" ? "فروش" : "SELL")}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text2)", display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--text3)" }}>{lang === "fa" ? "ورود" : "Entry"}</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{sig.price}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--bull)" }}>TP</span>
                      <span style={{ fontWeight: 600, color: "var(--bull)" }}>{sig.tp}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--bear)" }}>SL</span>
                      <span style={{ fontWeight: 600, color: "var(--bear)" }}>{sig.sl}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "var(--text3)" }}>{lang === "fa" ? "اطمینان AI" : "AI Confidence"}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--brand-light)" }}>{sig.conf}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${sig.conf}%`, background: "linear-gradient(90deg, var(--brand), var(--accent))" }} />
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
                  {[
                    { v: "94%", l: lang === "fa" ? "دقت" : "Accuracy" },
                    { v: "50K+", l: lang === "fa" ? "تریدر" : "Traders" },
                    { v: "<50ms", l: lang === "fa" ? "تأخیر" : "Latency" },
                  ].map(s => (
                    <div key={s.l}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--neon)", fontFamily: "monospace" }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
