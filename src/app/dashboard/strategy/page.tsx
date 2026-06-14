"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PRESETS = [
  {
    name: "Golden Cross",
    desc: "MA50 crosses above MA200 → Long entry with ATR-based stop.",
    tags: ["Trend", "Swing"],
    winRate: "68%",
    rr: "2.4",
    signals: 147,
    color: "var(--bull)",
  },
  {
    name: "RSI Reversal",
    desc: "RSI <30 (oversold) + volume spike → Contrarian long. RSI >70 → Short.",
    tags: ["Momentum", "Scalp"],
    winRate: "61%",
    rr: "1.9",
    signals: 312,
    color: "var(--accent)",
  },
  {
    name: "Breakout + Volume",
    desc: "Price breaks 20-period high/low with 2× avg volume → Momentum entry.",
    tags: ["Breakout", "Day"],
    winRate: "58%",
    rr: "2.1",
    signals: 89,
    color: "var(--brand-light)",
  },
  {
    name: "Whale Accumulation",
    desc: "On-chain whale wallet inflows >$10M in 24h + bullish RSI divergence.",
    tags: ["On-Chain", "Swing"],
    winRate: "74%",
    rr: "3.2",
    signals: 28,
    color: "var(--bull)",
  },
];

const BLOCK_TYPES = [
  { id: "entry",     label: "Entry Condition", icon: "→", color: "var(--accent)",      desc: "When to open a position" },
  { id: "exit",      label: "Exit Condition",  icon: "←", color: "var(--bull)",        desc: "When to close for profit" },
  { id: "stop",      label: "Stop Loss",       icon: "✗", color: "var(--bear)",        desc: "Risk management exit" },
  { id: "indicator", label: "Indicator",       icon: "≈", color: "var(--brand-light)", desc: "RSI, MACD, MA, BB…" },
  { id: "filter",    label: "Market Filter",   icon: "⊡", color: "#F59E0B",            desc: "Trend / Volume filter" },
];

type Block = { id: string; type: string; label: string; icon: string; color: string; x: number; y: number };

let blockIdCounter = 0;

export default function StrategyPage() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "b0", type: "indicator", label: "RSI(14)", icon: "≈", color: "var(--brand-light)", x: 80,  y: 60  },
    { id: "b1", type: "entry",     label: "RSI < 30 → LONG", icon: "→", color: "var(--accent)",      x: 80,  y: 160 },
    { id: "b2", type: "stop",      label: "ATR × 1.5 Stop",  icon: "✗", color: "var(--bear)",        x: 280, y: 160 },
    { id: "b3", type: "exit",      label: "TP: 2× Risk",     icon: "←", color: "var(--bull)",        x: 480, y: 160 },
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activePreset, setActivePreset] = useState<number | null>(null);

  function addBlock(type: typeof BLOCK_TYPES[0]) {
    blockIdCounter++;
    setBlocks(prev => [...prev, {
      id: `b${blockIdCounter}`,
      type: type.id,
      label: type.label,
      icon: type.icon,
      color: type.color,
      x: 80 + (prev.length % 4) * 140,
      y: 60 + Math.floor(prev.length / 4) * 90,
    }]);
  }

  function removeBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div style={{ padding: "24px 28px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Strategy Builder</h1>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Drag and connect blocks to build your trading strategy. AI will backtest it automatically.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            padding: "9px 18px", borderRadius: 10, border: "1.5px solid var(--border)",
            background: "var(--surface2)", color: "var(--text2)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>⟲ Reset</button>
          <button style={{
            padding: "9px 20px", borderRadius: 10, border: "none",
            background: "var(--brand)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(108,92,231,0.4)",
          }}>▶ Backtest Strategy</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* ── Left panel: block palette + presets ── */}
        <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Block palette */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Add Block</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {BLOCK_TYPES.map(bt => (
                <button
                  key={bt.id}
                  onClick={() => addBlock(bt)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    color: "var(--text2)", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = bt.color; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
                >
                  <span style={{ fontSize: 16, color: bt.color, width: 20, textAlign: "center" }}>{bt.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{bt.label}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{bt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preset strategies */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Presets</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PRESETS.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setActivePreset(activePreset === i ? null : i)}
                  style={{
                    padding: "10px 12px", borderRadius: 10, textAlign: "left",
                    border: `1.5px solid ${activePreset === i ? p.color : "var(--border)"}`,
                    background: activePreset === i ? `color-mix(in srgb, ${p.color} 10%, transparent)` : "var(--surface2)",
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: activePreset === i ? p.color : "var(--text)", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "var(--surface3)", color: "var(--text3)" }}>{tag}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Canvas ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Preset detail */}
          {activePreset !== null && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
                padding: "16px 20px", marginBottom: 14,
                display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{PRESETS[activePreset].name}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>{PRESETS[activePreset].desc}</div>
              </div>
              {[
                { label: "Win Rate",  value: PRESETS[activePreset].winRate,                                              color: "var(--bull)" },
                { label: "Avg R/R",  value: `${PRESETS[activePreset].rr}x`,                                             color: "var(--accent)" },
                { label: "Signals",  value: `${PRESETS[activePreset].signals}`,                                          color: "var(--text)" },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center", minWidth: 70 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{stat.label}</div>
                </div>
              ))}
              <button
                onClick={() => setActivePreset(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 18 }}
              >✕</button>
            </motion.div>
          )}

          {/* Canvas area */}
          <div
            style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
              position: "relative", height: 420, overflow: "hidden",
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            onMouseMove={e => {
              if (!dragging) return;
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const x = e.clientX - rect.left - dragOffset.x;
              const y = e.clientY - rect.top - dragOffset.y;
              setBlocks(prev => prev.map(b => b.id === dragging ? { ...b, x: Math.max(0, x), y: Math.max(0, y) } : b));
            }}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
          >
            {/* Connection lines (decorative) */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              {blocks.length >= 2 && blocks.slice(0, -1).map((b, i) => {
                const next = blocks[i + 1];
                const x1 = b.x + 60, y1 = b.y + 24;
                const x2 = next.x, y2 = next.y + 24;
                return (
                  <path
                    key={`conn-${i}`}
                    d={`M${x1},${y1} C${x1 + 40},${y1} ${x2 - 40},${y2} ${x2},${y2}`}
                    fill="none" stroke="var(--border2)" strokeWidth="1.5" strokeDasharray="4 3"
                  />
                );
              })}
            </svg>

            {/* Blocks */}
            {blocks.map(block => (
              <div
                key={block.id}
                onMouseDown={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const canvasRect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
                  setDragging(block.id);
                  setDragOffset({ x: e.clientX - (canvasRect.left + block.x), y: e.clientY - (canvasRect.top + block.y) });
                  e.preventDefault();
                }}
                style={{
                  position: "absolute", left: block.x, top: block.y,
                  padding: "9px 13px", borderRadius: 10,
                  background: "var(--surface2)", border: `2px solid ${block.color}`,
                  cursor: "grab", userSelect: "none", minWidth: 130,
                  boxShadow: dragging === block.id ? "0 8px 24px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
                  transition: dragging === block.id ? "none" : "box-shadow 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, color: block.color }}>{block.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: block.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {BLOCK_TYPES.find(bt => bt.id === block.type)?.label || block.type}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{block.label}</div>
                <button
                  onClick={e => { e.stopPropagation(); removeBlock(block.id); }}
                  style={{
                    position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%",
                    background: "var(--surface3)", border: "none", cursor: "pointer",
                    color: "var(--text3)", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
              </div>
            ))}

            {blocks.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 32 }}>⊡</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Add blocks from the left panel</div>
                <div style={{ fontSize: 12 }}>or choose a preset strategy</div>
              </div>
            )}
          </div>

          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, textAlign: "center" }}>
            Drag blocks to position them · Click ✕ to remove · Press "Backtest Strategy" to analyze
          </p>
        </div>
      </div>
    </div>
  );
}
