"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifs, setNotifs]       = useState({ signals: true, whales: true, portfolio: false, news: false });
  const [apiKey, setApiKey]       = useState("");
  const [showKey, setShowKey]     = useState(false);

  return (
    <div style={{ padding: "24px 28px", maxWidth: 680 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 2 }}>Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Manage notifications, API keys, and app preferences</p>
      </div>

      {/* Notifications */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Notifications</div>
        {[
          { key: "signals" as const,   label: "AI Signals",       desc: "Get notified when a new signal is generated" },
          { key: "whales" as const,    label: "Whale Alerts",     desc: "Large on-chain transfers above $50M" },
          { key: "portfolio" as const, label: "Portfolio Updates", desc: "P&L milestones and position alerts" },
          { key: "news" as const,      label: "Market News",      desc: "Breaking crypto news and announcements" },
        ].map(item => (
          <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{item.desc}</div>
            </div>
            <button
              onClick={() => setNotifs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
              style={{
                width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer", flexShrink: 0,
                background: notifs[item.key] ? "var(--brand)" : "var(--surface3)", transition: "background 0.2s", position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: notifs[item.key] ? 21 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </button>
          </div>
        ))}
      </div>

      {/* API Key */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Anthropic API Key</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>
          Add your own Anthropic API key to use the AI chat without limits. Your key is stored locally and never sent to our servers.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="input-field"
            style={{ flex: 1, fontFamily: "monospace" }}
          />
          <button
            onClick={() => setShowKey(p => !p)}
            style={{ padding: "10px 14px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13 }}
          >{showKey ? "Hide" : "Show"}</button>
          <button style={{
            padding: "10px 18px", borderRadius: 9, border: "none",
            background: apiKey.trim() ? "var(--brand)" : "var(--surface3)",
            color: apiKey.trim() ? "#fff" : "var(--text3)",
            fontSize: 13, fontWeight: 700, cursor: apiKey.trim() ? "pointer" : "default",
          }}>Save</button>
        </div>
      </div>

      {/* Appearance */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px", marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Appearance</div>
        <div style={{ display: "flex", gap: 10 }}>
          {["Dark (Default)", "Darker", "OLED Black"].map((theme, i) => (
            <button key={theme} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${i === 0 ? "var(--brand)" : "var(--border)"}`,
              background: i === 0 ? "rgba(108,92,231,0.12)" : "var(--surface2)",
              color: i === 0 ? "var(--brand-light)" : "var(--text3)",
            }}>{theme}</button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: "var(--surface)", border: "1px solid rgba(255,77,79,0.2)", borderRadius: 14, padding: "20px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--bear)", marginBottom: 4 }}>Danger Zone</div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>These actions are permanent and cannot be undone.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{
            padding: "9px 16px", borderRadius: 9, border: "1px solid var(--bear)",
            background: "var(--bear-dim)", color: "var(--bear)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Clear Chat History</button>
          <button style={{
            padding: "9px 16px", borderRadius: 9, border: "1px solid var(--bear)",
            background: "var(--bear-dim)", color: "var(--bear)", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Reset All Settings</button>
        </div>
      </div>
    </div>
  );
}
