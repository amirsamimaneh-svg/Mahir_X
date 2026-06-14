"use client";

import { motion } from "framer-motion";

/* ── Deterministic chart data (no hydration mismatch) ── */
function genCandles(count: number) {
  let price = 67200;
  return Array.from({ length: count }, (_, i) => {
    const r1 = Math.abs(Math.sin(i * 7.531 + 1.2));
    const r2 = Math.abs(Math.sin(i * 3.141 + 0.7));
    const r3 = Math.abs(Math.sin(i * 5.273 + 2.1));
    const change = (r1 - 0.46) * 900;
    const open = price;
    price += change;
    const close = price;
    const wickUp = r2 * 350;
    const wickDn = r3 * 280;
    return {
      open, close,
      high: Math.max(open, close) + wickUp,
      low:  Math.min(open, close) - wickDn,
      vol: 0.25 + r1 * 0.75,
    };
  });
}

const CANDLES = genCandles(40);
const ALL_PRICES = CANDLES.flatMap(c => [c.high, c.low]);
const PRICE_MIN = Math.min(...ALL_PRICES);
const PRICE_MAX = Math.max(...ALL_PRICES);
const PRICE_RANGE = PRICE_MAX - PRICE_MIN;

const W = 640, H = 200, VOL_H = 36;
const CANDLE_W = W / CANDLES.length;
const BODY_W = CANDLE_W * 0.55;

function px(price: number) { return H - ((price - PRICE_MIN) / PRICE_RANGE) * (H - 16) - 4; }

function CandlestickChart() {
  const last = CANDLES[CANDLES.length - 1];
  const first = CANDLES[0];
  const trend = last.close > first.open;

  const maLine = CANDLES.map((_, i) => {
    const slice = CANDLES.slice(Math.max(0, i - 9), i + 1);
    const avg = slice.reduce((s, c) => s + (c.open + c.close) / 2, 0) / slice.length;
    return { x: i * CANDLE_W + CANDLE_W / 2, y: px(avg) };
  });
  const maPath = maLine.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const maxVol = Math.max(...CANDLES.map(c => c.vol));

  return (
    <div style={{ background: "var(--surface)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
      {/* Chart header */}
      <div style={{ padding: "12px 16px 10px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["1m", "5m", "15m", "1H", "4H", "1D"].map((tf, i) => (
            <button key={tf} style={{
              padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer",
              background: i === 4 ? "var(--brand)" : "transparent",
              color: i === 4 ? "#fff" : "var(--text3)",
              fontSize: 11, fontWeight: 600, transition: "all 0.15s",
            }}>{tf}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {["MA", "RSI", "MACD", "BB"].map(ind => (
            <span key={ind} style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", cursor: "pointer", padding: "2px 6px", borderRadius: 4, border: "1px solid var(--border)" }}>{ind}</span>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ padding: "0 8px 0", position: "relative" }}>
        {/* Y-axis price labels */}
        <div style={{ position: "absolute", right: 10, top: 0, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none", zIndex: 2 }}>
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <span key={t} style={{ fontSize: 9, color: "var(--text3)", fontFamily: "monospace" }}>
              {(PRICE_MIN + PRICE_RANGE * (1 - t)).toFixed(0)}
            </span>
          ))}
        </div>

        <svg viewBox={`0 0 ${W} ${H + VOL_H}`} style={{ width: "100%", display: "block" }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(t => (
            <line key={t} x1={0} y1={H * t} x2={W} y2={H * t} stroke="var(--border)" strokeWidth={0.8} />
          ))}

          {/* Moving average */}
          <path d={maPath} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />

          {/* Candlesticks */}
          {CANDLES.map((c, i) => {
            const bull = c.close >= c.open;
            const x = i * CANDLE_W + CANDLE_W / 2;
            const bodyTop = px(Math.max(c.open, c.close));
            const bodyBot = px(Math.min(c.open, c.close));
            const bodyH = Math.max(1, bodyBot - bodyTop);
            const color = bull ? "var(--bull)" : "var(--bear)";
            return (
              <g key={i}>
                {/* Wick */}
                <line x1={x} y1={px(c.high)} x2={x} y2={px(c.low)} stroke={color} strokeWidth={1} />
                {/* Body */}
                <rect x={x - BODY_W / 2} y={bodyTop} width={BODY_W} height={bodyH}
                  fill={bull ? color : color} opacity={bull ? 0.85 : 0.75} rx={1} />
              </g>
            );
          })}

          {/* Volume bars */}
          {CANDLES.map((c, i) => {
            const bull = c.close >= c.open;
            const barH = (c.vol / maxVol) * (VOL_H - 4);
            return (
              <rect key={i}
                x={i * CANDLE_W + 1} y={H + VOL_H - barH}
                width={CANDLE_W - 2} height={barH}
                fill={bull ? "var(--bull)" : "var(--bear)"}
                opacity={0.35} rx={1}
              />
            );
          })}

          {/* Vol divider */}
          <line x1={0} y1={H} x2={W} y2={H} stroke="var(--border)" strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}

/* ── Market cards ── */
const MARKETS = [
  { symbol: "BTC", name: "Bitcoin",  price: "$67,432", change: "+2.41%", bull: true,  vol: "$42.1B" },
  { symbol: "ETH", name: "Ethereum", price: "$3,521",  change: "+1.83%", bull: true,  vol: "$18.4B" },
  { symbol: "SOL", name: "Solana",   price: "$178.50", change: "+5.27%", bull: true,  vol: "$6.2B" },
  { symbol: "BNB", name: "BNB",      price: "$612.00", change: "-0.82%", bull: false, vol: "$3.8B" },
];

/* ── AI Insight panel ── */
const AI_INSIGHT = {
  trend: "BULLISH", conf: 87, signal: "LONG",
  entry: "$66,800 – $67,200", sl: "$65,100", tp: "$70,400",
  agents: ["Technical ✅", "On-Chain ✅", "Sentiment ✅", "Macro ✅", "Fundamental ⚠️"],
};

/* ── Live signals in right panel ── */
const LIVE_SIGNALS = [
  { asset: "BTC/USDT", type: "LONG",  conf: 87, time: "2m ago" },
  { asset: "SOL/USDT", type: "LONG",  conf: 82, time: "18m ago" },
  { asset: "ETH/USDT", type: "LONG",  conf: 79, time: "45m ago" },
  { asset: "BNB/USDT", type: "SHORT", conf: 74, time: "1h ago" },
];

function MiniSparkline({ bull }: { bull: boolean }) {
  const pts = [0.6, 0.5, 0.65, 0.55, 0.7, 0.6, 0.75, bull ? 0.85 : 0.45];
  const path = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 60} ${(1 - y) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 60 24" style={{ width: 60, height: 24 }}>
      <path d={path} fill="none" stroke={bull ? "var(--bull)" : "var(--bear)"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Top Asset Bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0,
        overflowX: "auto",
      }}>
        {MARKETS.map((m, i) => (
          <div key={m.symbol} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 18px", cursor: "pointer",
            borderRight: "1px solid var(--border)",
            borderBottom: i === 0 ? "2px solid var(--brand)" : "2px solid transparent",
            background: i === 0 ? "rgba(108,92,231,0.06)" : "transparent",
            transition: "all 0.15s", flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{m.symbol}/USDT</div>
              <div style={{ fontSize: 11, color: m.bull ? "var(--bull)" : "var(--bear)", fontWeight: 700, marginTop: 1 }}>
                {m.price} <span style={{ opacity: 0.8 }}>{m.change}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", padding: "0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--bull)", fontWeight: 700 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--bull)", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
            LIVE
          </div>
        </div>
      </div>

      {/* ── Main Terminal ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Center: Chart + Market ── */}
        <div style={{ flex: 1, minWidth: 0, overflow: "auto", padding: "16px" }}>
          {/* Chart */}
          <CandlestickChart />

          {/* Market Overview */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginTop: 14 }}>
            {MARKETS.map((m, i) => (
              <motion.div
                key={m.symbol}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{m.symbol}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{m.name}</div>
                  </div>
                  <MiniSparkline bull={m.bull} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 4 }}>{m.price}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: m.bull ? "var(--bull)" : "var(--bear)" }}>{m.change}</span>
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>Vol {m.vol}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="dash-right-panel">

          {/* AI Insight */}
          <div style={{ padding: "14px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Insight — BTC/USDT</span>
            </div>

            {/* Trend badge */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "var(--bull-dim)", border: "1px solid rgba(0,200,150,0.2)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 12,
            }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>TREND</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--bull)", letterSpacing: "0.02em" }}>{AI_INSIGHT.trend}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>SIGNAL</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--bull)" }}>{AI_INSIGHT.signal}</div>
              </div>
            </div>

            {/* Confidence */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Confidence</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--bull)" }}>{AI_INSIGHT.conf}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${AI_INSIGHT.conf}%`, background: "var(--bull)" }} />
              </div>
            </div>

            {/* Trade levels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "Entry",  value: AI_INSIGHT.entry, color: "var(--text)" },
                { label: "Signal", value: AI_INSIGHT.signal, color: "var(--bull)" },
                { label: "Stop Loss", value: AI_INSIGHT.sl, color: "var(--bear)" },
                { label: "Take Profit", value: AI_INSIGHT.tp, color: "var(--bull)" },
              ].map(item => (
                <div key={item.label} style={{ background: "var(--surface2)", borderRadius: 8, padding: "9px 10px" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Agent votes */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {AI_INSIGHT.agents.map(a => (
                <span key={a} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, background: "var(--surface2)", color: "var(--text2)" }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Live Signals list */}
          <div style={{ padding: "14px", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Signals</span>
              <a href="/dashboard/signals" style={{ fontSize: 11, color: "var(--brand-light)", textDecoration: "none", fontWeight: 600 }}>All →</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {LIVE_SIGNALS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", background: "var(--surface2)",
                    borderRadius: 9, border: "1px solid var(--border)",
                    cursor: "pointer", transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = "var(--border2)")}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{s.asset}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.time}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: s.type === "LONG" ? "var(--bull-dim)" : "var(--bear-dim)",
                      color: s.type === "LONG" ? "var(--bull)" : "var(--bear)",
                    }}>{s.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.conf > 80 ? "var(--bull)" : "var(--accent)" }}>{s.conf}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dash-right-panel {
          width: 268px; flex-shrink: 0;
          border-left: 1px solid var(--border);
          background: var(--surface);
          display: flex; flex-direction: column;
          overflow: auto;
        }
        @media (max-width: 1024px) { .dash-right-panel { display: none; } }
      `}</style>
    </div>
  );
}
