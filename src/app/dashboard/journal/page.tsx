"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const entries = [
  {
    date: "Jun 12, 2026", asset: "BTC", type: "LONG", result: "WIN",
    pnl: "+$182", entry: "$65,200", exit: "$67,150",
    notes: "Followed AI swing signal. RSI divergence on 4H was accurate. Held through minor dip at $65.8K. Good discipline.",
    lesson: "Trust the setup when confluence is high.",
    mood: "😊",
  },
  {
    date: "Jun 10, 2026", asset: "SOL", type: "LONG", result: "WIN",
    pnl: "+$98", entry: "$162", exit: "$174",
    notes: "Breakout trade. Entered on volume confirmation. Could have held longer — exited too early at TP1.",
    lesson: "Scale out: take 50% at TP1, let the rest run.",
    mood: "🙂",
  },
  {
    date: "Jun 7, 2026", asset: "ETH", type: "LONG", result: "LOSS",
    pnl: "-$45", entry: "$3,310", exit: "$3,220",
    notes: "Ignored the bearish market structure on higher timeframe. FOMO entry. Stop was hit clean.",
    lesson: "Always check HTF trend before entering. No FOMO.",
    mood: "😔",
  },
];

export default function JournalPage() {
  const [newNote, setNewNote] = useState("");

  return (
    <div style={{ padding: "24px 28px", maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Trading Journal</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Track trades, learn from mistakes, improve with AI feedback</p>
      </div>

      {/* Quick add */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>+ Quick Note</div>
        <textarea
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          placeholder="Describe your trade, emotions, or observations…"
          style={{
            width: "100%", background: "var(--surface2)", border: "1.5px solid var(--border)",
            borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--text)",
            fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 80,
            transition: "border-color 0.18s",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--brand)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button style={{
            padding: "9px 20px", borderRadius: 10, border: "none",
            background: newNote.trim() ? "var(--brand)" : "var(--surface3)",
            color: newNote.trim() ? "#fff" : "var(--text3)",
            fontSize: 13, fontWeight: 700, cursor: newNote.trim() ? "pointer" : "default",
          }}>Save Entry</button>
        </div>
      </div>

      {/* Journal entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "var(--surface)", border: `1px solid ${entry.result === "WIN" ? "rgba(0,200,150,0.2)" : entry.result === "LOSS" ? "rgba(255,77,79,0.2)" : "var(--border)"}`,
              borderRadius: 14, padding: "18px 20px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{entry.mood}</span>
                <div>
                  <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{entry.asset}/USDT</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: entry.type === "LONG" ? "var(--bull-dim)" : "var(--bear-dim)",
                      color: entry.type === "LONG" ? "var(--bull)" : "var(--bear)",
                    }}>{entry.type}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: entry.result === "WIN" ? "var(--bull-dim)" : "var(--bear-dim)",
                      color: entry.result === "WIN" ? "var(--bull)" : "var(--bear)",
                    }}>{entry.result}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{entry.date}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: entry.pnl.startsWith("+") ? "var(--bull)" : "var(--bear)" }}>{entry.pnl}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{entry.entry} → {entry.exit}</div>
              </div>
            </div>

            {/* Notes */}
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, marginBottom: 10 }}>{entry.notes}</p>

            {/* Lesson */}
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(108,92,231,0.08)", border: "1px solid rgba(108,92,231,0.2)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)" }}>💡 Lesson: </span>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{entry.lesson}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
