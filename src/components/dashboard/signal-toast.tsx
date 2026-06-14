"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignals } from "@/contexts/signal-context";
import Link from "next/link";

export function SignalToast() {
  const { latestSignal, clearLatest } = useSignals();

  /* Auto-dismiss after 6 s */
  useEffect(() => {
    if (!latestSignal) return;
    const t = setTimeout(clearLatest, 6000);
    return () => clearTimeout(t);
  }, [latestSignal, clearLatest]);

  return (
    <AnimatePresence>
      {latestSignal && (
        <motion.div
          key={latestSignal.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          style={{
            position: "fixed", bottom: 80, right: 20, zIndex: 200,
            background: "var(--surface2)", border: `1.5px solid ${latestSignal.type === "LONG" ? "var(--bull)" : "var(--bear)"}`,
            borderRadius: 14, padding: "14px 16px", minWidth: 280, maxWidth: 340,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${latestSignal.type === "LONG" ? "rgba(0,200,150,0.15)" : "rgba(255,77,79,0.15)"}`,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: latestSignal.type === "LONG" ? "var(--bull-dim)" : "var(--bear-dim)",
                border: `1px solid ${latestSignal.type === "LONG" ? "rgba(0,200,150,0.3)" : "rgba(255,77,79,0.3)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>
                {latestSignal.type === "LONG" ? "▲" : "▼"}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em" }}>
                  {latestSignal.asset}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: latestSignal.type === "LONG" ? "var(--bull)" : "var(--bear)",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  🤖 AI Signal · {latestSignal.type}
                </div>
              </div>
            </div>
            <button
              onClick={clearLatest}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 16, lineHeight: 1, padding: 0 }}
            >×</button>
          </div>

          {/* Levels */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {[
              { label: "Entry", value: latestSignal.entry, color: "var(--accent)" },
              { label: "SL",    value: latestSignal.sl,    color: "var(--bear)"   },
              { label: "TP",    value: latestSignal.tp,    color: "var(--bull)"   },
            ].map(item => (
              <div key={item.label} style={{ background: "var(--surface3)", borderRadius: 8, padding: "7px 8px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Confidence bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 4, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${latestSignal.confidence}%` }}
                transition={{ duration: 0.8 }}
                style={{
                  height: "100%", borderRadius: 2,
                  background: latestSignal.confidence >= 80 ? "var(--bull)" : "linear-gradient(90deg,var(--brand),var(--accent))",
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: latestSignal.confidence >= 80 ? "var(--bull)" : "var(--accent)" }}>
              {latestSignal.confidence}%
            </span>
          </div>

          {/* CTA */}
          <Link
            href="/dashboard/signals"
            onClick={clearLatest}
            style={{
              display: "block", textAlign: "center",
              padding: "8px", borderRadius: 9,
              background: latestSignal.type === "LONG" ? "rgba(0,200,150,0.15)" : "rgba(255,77,79,0.12)",
              border: `1px solid ${latestSignal.type === "LONG" ? "rgba(0,200,150,0.3)" : "rgba(255,77,79,0.3)"}`,
              color: latestSignal.type === "LONG" ? "var(--bull)" : "var(--bear)",
              fontSize: 12, fontWeight: 700, textDecoration: "none",
            }}
          >
            View in Signals →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
