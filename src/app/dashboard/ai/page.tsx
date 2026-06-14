"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignals } from "@/contexts/signal-context";

/* ── Types ── */
interface Message { role: "user" | "assistant"; content: string; }
interface UserProfile { style: string; risk: string; }
interface ParsedSection { title: string; content: string; }

const STYLES = ["Scalper", "Day Trader", "Swing Trader", "Investor"];
const RISKS  = ["Conservative", "Moderate", "Aggressive"];

const ASSETS = [
  { symbol: "BTC",  name: "Bitcoin",   icon: "₿", price: "$66,842", change: "+2.4%" },
  { symbol: "ETH",  name: "Ethereum",  icon: "Ξ", price: "$3,481",  change: "+1.8%" },
  { symbol: "SOL",  name: "Solana",    icon: "◎", price: "$174.2",  change: "+4.1%" },
  { symbol: "BNB",  name: "BNB",       icon: "⬡", price: "$618",    change: "-0.6%" },
  { symbol: "ADA",  name: "Cardano",   icon: "₳", price: "$0.495",  change: "-1.2%" },
  { symbol: "AVAX", name: "Avalanche", icon: "▲", price: "$38.5",   change: "+3.3%" },
];

function getTemplates(asset: string) {
  return [
    { icon: "📊", text: `Analyze ${asset}/USDT for the next 24 hours` },
    { icon: "🎯", text: `Give me a swing trade setup for ${asset}` },
    { icon: "⚡", text: `Scalping opportunity on ${asset} right now?` },
    { icon: "🐋", text: `What are whales doing with ${asset}?` },
    { icon: "📈", text: `Key support and resistance levels for ${asset}` },
    { icon: "⚠️", text: `Risk assessment: should I hold ${asset} now?` },
  ];
}

/* ── Parse structured AI output ── */
function parseOutput(text: string): { prefix: string; sections: ParsedSection[] } {
  const regex = /\[([^\]]+)\]\s*\n/g;
  const matches: { title: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    matches.push({ title: m[1], start: m.index, end: m.index + m[0].length });
  }
  if (matches.length === 0) return { prefix: text, sections: [] };
  const prefix = text.slice(0, matches[0].start).trim();
  const sections = matches.map((match, i) => ({
    title: match.title,
    content: text.slice(match.end, i < matches.length - 1 ? matches[i + 1].start : text.length).trim(),
  }));
  return { prefix, sections };
}

/* ── Extract trading signal from AI response ── */
function extractSignal(aiText: string, userMsg: string) {
  const { sections } = parseOutput(aiText);
  if (sections.length === 0) return null;

  const get = (key: string) => sections.find(s => s.title.toLowerCase().includes(key.toLowerCase()))?.content?.trim() || "";

  const entry = get("entry zone");
  const sl    = get("stop loss");
  const tp    = get("take profit");
  if (!entry || !sl || !tp) return null;

  const trendText = get("market trend");
  const confText  = get("confidence");
  const reasoning = get("reasoning");

  const assetRx = /\b(BTC|ETH|SOL|BNB|ADA|AVAX|LINK|DOT|MATIC|ARB|OP|DOGE|XRP|TON|SUI|APT)\b/i;
  const assetMatch = userMsg.match(assetRx);
  const asset = (assetMatch ? assetMatch[1].toUpperCase() : "CRYPTO") + "/USDT";

  const type: "LONG" | "SHORT" = /bearish|short|downtrend|sell/i.test(trendText) ? "SHORT" : "LONG";

  const confMatch = confText.match(/(\d+)/);
  const confidence = confMatch ? parseInt(confMatch[1]) : 75;

  const summary = (reasoning.split(".")[0] || `${type} signal for ${asset}`).slice(0, 120);

  return { asset, type, entry, sl, tp: tp.split("\n")[0], confidence, summary };
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.09em", ...style }}>
      {children}
    </div>
  );
}

function Section({ title, content }: ParsedSection) {
  const t = title.toLowerCase();

  if (t.includes("market trend")) {
    const bull = /bullish/i.test(content);
    const bear = /bearish/i.test(content);
    const color = bull ? "var(--bull)" : bear ? "var(--bear)" : "#F59E0B";
    const bg    = bull ? "var(--bull-dim)" : bear ? "var(--bear-dim)" : "rgba(245,158,11,0.1)";
    const icon  = bull ? "▲" : bear ? "▼" : "→";
    return (
      <div style={{ marginBottom: 12 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bg, border: `1px solid ${color}`, borderRadius: 10, padding: "8px 16px", marginTop: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color }}>{icon}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{content}</span>
        </div>
      </div>
    );
  }

  if (t.includes("key levels")) {
    const lines = content.split("\n").filter(Boolean);
    return (
      <div style={{ marginBottom: 12 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {lines.map((line, i) => {
            const isSupport = /support/i.test(line);
            const isResist  = /resist/i.test(line);
            return (
              <div key={i} style={{
                flex: 1, minWidth: 130, background: "var(--surface3)", borderRadius: 10, padding: "8px 12px",
                border: `1px solid ${isResist ? "rgba(255,77,79,0.2)" : isSupport ? "rgba(0,200,150,0.2)" : "var(--border)"}`,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: isResist ? "var(--bear)" : isSupport ? "var(--bull)" : "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  {isResist ? "Resistance" : isSupport ? "Support" : "Level"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>
                  {line.replace(/^(support|resistance):\s*/i, "").trim()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (t === "entry zone" || t === "stop loss" || t === "take profit") {
    const isEntry = t === "entry zone";
    const isSL    = t === "stop loss";
    const color   = isEntry ? "var(--accent)" : isSL ? "var(--bear)" : "var(--bull)";
    const label   = isEntry ? "Entry Zone" : isSL ? "Stop Loss" : "Take Profit";
    return (
      <div style={{ flex: 1, minWidth: 130 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color }}>{content}</div>
      </div>
    );
  }

  if (t.includes("confidence")) {
    const pct = parseInt(content.match(/(\d+)/)?.[1] || "0", 10);
    const color = pct >= 75 ? "var(--bull)" : pct >= 50 ? "var(--accent)" : "var(--bear)";
    return (
      <div style={{ marginBottom: 12 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1, height: 7, background: "var(--surface3)", borderRadius: 4, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: color, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, color, minWidth: 46 }}>{pct}%</span>
        </div>
      </div>
    );
  }

  if (t.includes("risk level")) {
    const isHigh = /high/i.test(content);
    const isLow  = /low/i.test(content);
    const color  = isHigh ? "var(--bear)" : isLow ? "var(--bull)" : "#F59E0B";
    const bg     = isHigh ? "var(--bear-dim)" : isLow ? "var(--bull-dim)" : "rgba(245,158,11,0.1)";
    const dots   = isHigh ? 3 : isLow ? 1 : 2;
    return (
      <div style={{ marginBottom: 12 }}>
        <SectionLabel>{title}</SectionLabel>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 6, background: bg, border: `1px solid ${color}`, borderRadius: 8, padding: "5px 12px" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3].map(n => <div key={n} style={{ width: 5, height: 14, borderRadius: 3, background: n <= dots ? color : "var(--border2)" }} />)}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{content}</span>
        </div>
      </div>
    );
  }

  if (t.includes("personal insight")) {
    return (
      <div style={{ marginBottom: 12, background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.3)", borderRadius: 12, padding: "12px 14px" }}>
        <SectionLabel style={{ color: "var(--brand-light)" }}>👤 {title}</SectionLabel>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, marginTop: 5, whiteSpace: "pre-wrap" }}>{content}</p>
      </div>
    );
  }

  if (t.includes("scenario")) {
    const isPrimary = /primary|1/i.test(title);
    return (
      <div style={{ marginBottom: 12, background: "var(--surface3)", border: "1px solid var(--border2)", borderRadius: 12, padding: "12px 14px" }}>
        <SectionLabel style={{ color: isPrimary ? "var(--accent)" : "var(--text3)" }}>
          {isPrimary ? "🎯" : "⚡"} {title}
        </SectionLabel>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginTop: 5, whiteSpace: "pre-wrap" }}>{content}</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <SectionLabel>{title}</SectionLabel>
      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginTop: 5, whiteSpace: "pre-wrap" }}>{content}</p>
    </div>
  );
}

function AIMessage({ content, onSignalSaved }: { content: string; onSignalSaved?: boolean }) {
  const { prefix, sections } = parseOutput(content);
  if (sections.length === 0) {
    return <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</div>;
  }

  const tradeKeys = ["entry zone", "stop loss", "take profit"];
  const rendered: React.ReactNode[] = [];
  let tradeGroup: ParsedSection[] = [];

  function flushTradeGroup() {
    if (tradeGroup.length === 0) return;
    rendered.push(
      <div key={`trade-${rendered.length}`} style={{ marginBottom: 14 }}>
        <SectionLabel>Trade Setup</SectionLabel>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8, background: "var(--surface3)", border: "1px solid var(--border2)", borderRadius: 12, padding: "12px 14px" }}>
          {tradeGroup.map(s => <Section key={s.title} {...s} />)}
        </div>
      </div>
    );
    tradeGroup = [];
  }

  sections.forEach((s, i) => {
    if (tradeKeys.includes(s.title.toLowerCase())) {
      tradeGroup.push(s);
    } else {
      flushTradeGroup();
      rendered.push(<Section key={`${s.title}-${i}`} {...s} />);
    }
  });
  flushTradeGroup();

  return (
    <div>
      {prefix && <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 14, whiteSpace: "pre-wrap" }}>{prefix}</p>}
      {rendered}
      {onSignalSaved && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
          padding: "5px 10px", borderRadius: 8,
          background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)",
          color: "var(--bull)", fontSize: 11, fontWeight: 700,
        }}>
          ⚡ Signal saved to Signals page
        </div>
      )}
    </div>
  );
}

const LIVE_SIGNALS = [
  { asset: "BTC", type: "LONG",  conf: 87, entry: "$66,800", tf: "4H" },
  { asset: "SOL", type: "LONG",  conf: 82, entry: "$174",    tf: "1D" },
  { asset: "BNB", type: "SHORT", conf: 74, entry: "$618",    tf: "1H" },
  { asset: "ETH", type: "LONG",  conf: 79, entry: "$3,480",  tf: "4H" },
];

export default function AIPage() {
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [showProfile, setShowProfile]     = useState(false);
  const [profile, setProfile]             = useState<UserProfile>({ style: "Swing Trader", risk: "Moderate" });
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [assetDropdown, setAssetDropdown] = useState(false);
  const [savedMsgIdx, setSavedMsgIdx]     = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const lastUserMsg = useRef("");

  const { addSignal } = useSignals();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    lastUserMsg.current = text;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setAssetDropdown(false);
    if (showProfile) setShowProfile(false);
    inputRef.current?.focus();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userProfile: profile,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let aiContent = "";
      const aiMsgIdx = newMessages.length; // index in the updated messages array
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiContent += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiContent };
          return updated;
        });
      }

      /* ── Auto-detect and save signal ── */
      const sig = extractSignal(aiContent, lastUserMsg.current);
      if (sig) {
        addSignal(sig);
        setSavedMsgIdx(aiMsgIdx);
      }

    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error getting response. Check your connection and try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const templates = getTemplates(selectedAsset.symbol);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{
          padding: "12px 20px", borderBottom: "1px solid var(--border)",
          background: "var(--surface)", flexShrink: 0,
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          {/* Asset selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setAssetDropdown(p => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 12px", borderRadius: 10,
                background: "var(--surface2)", border: "1.5px solid var(--brand)",
                color: "var(--text)", cursor: "pointer", fontSize: 14, fontWeight: 700,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 17 }}>{selectedAsset.icon}</span>
              {selectedAsset.symbol}/USDT
              <span style={{ fontSize: 11, color: selectedAsset.change.startsWith("+") ? "var(--bull)" : "var(--bear)", fontWeight: 800 }}>
                {selectedAsset.change}
              </span>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>▾</span>
            </button>

            <AnimatePresence>
              {assetDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 50,
                    background: "var(--surface2)", border: "1px solid var(--border2)",
                    borderRadius: 12, overflow: "hidden", minWidth: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}
                >
                  {ASSETS.map(asset => (
                    <button
                      key={asset.symbol}
                      onClick={() => { setSelectedAsset(asset); setAssetDropdown(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 14px",
                        background: selectedAsset.symbol === asset.symbol ? "rgba(108,92,231,0.12)" : "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        borderBottom: "1px solid var(--border)", transition: "background 0.1s", color: "var(--text)",
                      }}
                      onMouseEnter={e => { if (selectedAsset.symbol !== asset.symbol) (e.currentTarget as HTMLElement).style.background = "var(--surface3)"; }}
                      onMouseLeave={e => { if (selectedAsset.symbol !== asset.symbol) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <span style={{ fontSize: 16 }}>{asset.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{asset.symbol}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{asset.name}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{asset.price}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: asset.change.startsWith("+") ? "var(--bull)" : "var(--bear)" }}>{asset.change}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Mahir AI</div>
            <div style={{ fontSize: 11, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--bull)", display: "inline-block" }} />
              9-Step Analysis · Signals auto-saved
            </div>
          </div>

          <button
            onClick={() => setShowProfile(p => !p)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 9,
              background: "var(--surface2)", border: "1px solid var(--border2)",
              color: "var(--text2)", cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand-light)", display: "inline-block" }} />
            {profile.style} · {profile.risk}
            <span style={{ fontSize: 9 }}>▾</span>
          </button>
        </div>

        {/* Profile dropdown */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)", padding: "14px 20px", flexShrink: 0, display: "flex", gap: 28, flexWrap: "wrap" }}
            >
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Trading Style</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {STYLES.map(s => (
                    <button key={s} onClick={() => setProfile(p => ({ ...p, style: s }))} style={{
                      padding: "5px 11px", borderRadius: 7, border: "1.5px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      borderColor: profile.style === s ? "var(--brand)" : "var(--border)",
                      background: profile.style === s ? "rgba(108,92,231,0.15)" : "transparent",
                      color: profile.style === s ? "var(--brand-light)" : "var(--text2)", transition: "all 0.15s",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Risk Tolerance</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {RISKS.map(r => {
                    const col = r === "Aggressive" ? "var(--bear)" : r === "Conservative" ? "var(--bull)" : "var(--accent)";
                    return (
                      <button key={r} onClick={() => setProfile(p => ({ ...p, risk: r }))} style={{
                        padding: "5px 11px", borderRadius: 7, border: "1.5px solid", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        borderColor: profile.risk === r ? col : "var(--border)",
                        background: profile.risk === r ? `color-mix(in srgb, ${col} 12%, transparent)` : "transparent",
                        color: profile.risk === r ? col : "var(--text2)", transition: "all 0.15s",
                      }}>{r}</button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "24px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", marginBottom: 16,
                background: "linear-gradient(135deg, var(--brand), var(--accent))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>🤖</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Analyzing <span style={{ color: "var(--accent)" }}>{selectedAsset.symbol}</span>
              </h2>
              <p style={{ fontSize: 13, color: "var(--text2)", maxWidth: "40ch", marginBottom: 8, lineHeight: 1.65 }}>
                When the AI detects a trade setup, it automatically saves it to <strong style={{ color: "var(--brand-light)" }}>Signals</strong> and sends a notification.
              </p>
              <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
                {["Technical", "On-Chain", "Sentiment", "Consensus"].map(a => (
                  <span key={a} style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100,
                    background: "var(--accent-dim)", border: "1px solid rgba(0,194,255,0.2)",
                    color: "var(--accent)", letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>{a}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 9, width: "100%", maxWidth: 580 }}>
                {templates.map(t => (
                  <button
                    key={t.text}
                    onClick={() => sendMessage(t.text)}
                    style={{
                      display: "flex", alignItems: "center", gap: 9, padding: "10px 13px",
                      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 11,
                      color: "var(--text2)", cursor: "pointer", fontSize: 12, textAlign: "left", fontFamily: "inherit",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
                  >
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{t.icon}</span>
                    {t.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--brand), var(--accent))",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginTop: 3,
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: msg.role === "user" ? "72%" : "88%", minWidth: 0,
                    background: msg.role === "user" ? "var(--brand)" : "var(--surface)",
                    border: msg.role === "user" ? "none" : "1px solid var(--border)",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    padding: msg.role === "user" ? "9px 14px" : "16px 18px",
                    color: msg.role === "user" ? "#fff" : "var(--text)",
                    fontSize: 13, lineHeight: 1.7,
                  }}>
                    {msg.role === "user" ? (
                      <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</span>
                    ) : msg.content ? (
                      <AIMessage content={msg.content} onSignalSaved={savedMsgIdx === i - 1} />
                    ) : loading && i === messages.length - 1 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text3)" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[0, 1, 2].map(j => (
                            <span key={j} style={{
                              width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block",
                              animation: `pulse-dot 1.2s ease-in-out ${j * 0.2}s infinite`,
                            }} />
                          ))}
                        </div>
                        Running 9-step analysis…
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 20px 12px", background: "var(--surface)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} style={{ display: "flex", gap: 9 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask anything about ${selectedAsset.symbol}… (trade setups auto-saved to Signals)`}
              className="input-field"
              style={{ flex: 1 }}
              disabled={loading}
            />
            <button
              type="submit" disabled={loading || !input.trim()}
              style={{
                padding: "10px 18px", borderRadius: 10, border: "none", flexShrink: 0,
                background: !loading && input.trim() ? "var(--accent)" : "var(--surface3)",
                color: !loading && input.trim() ? "#070B14" : "var(--text3)",
                fontWeight: 700, fontSize: 13, fontFamily: "inherit",
                cursor: !loading && input.trim() ? "pointer" : "default", transition: "all 0.2s",
              }}
            >{loading ? "…" : "Analyze →"}</button>
          </form>
          <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 6, textAlign: "center" }}>
            {profile.style} · {profile.risk} risk · Trade setups → auto-saved to Signals · Not financial advice
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="ai-right-panel" style={{
        width: 220, flexShrink: 0, borderLeft: "1px solid var(--border)",
        background: "var(--surface)", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Signals</div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "10px" }}>
          {LIVE_SIGNALS.map((sig, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, marginBottom: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{sig.asset}</span>
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                  background: sig.type === "LONG" ? "var(--bull-dim)" : "var(--bear-dim)",
                  color: sig.type === "LONG" ? "var(--bull)" : "var(--bear)",
                }}>{sig.type}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>Entry {sig.entry} · {sig.tf}</div>
              <div style={{ height: 3, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${sig.conf}%`, borderRadius: 2,
                  background: sig.conf >= 82 ? "var(--bull)" : "linear-gradient(90deg, var(--brand), var(--accent))",
                }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3 }}>{sig.conf}% confidence</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Market</div>
          {ASSETS.slice(0, 4).map(a => (
            <div key={a.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}>{a.symbol}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: a.change.startsWith("+") ? "var(--bull)" : "var(--bear)" }}>{a.change}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ai-right-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
