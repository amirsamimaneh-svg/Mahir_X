"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getUsers, logout, approveUser, setUserRole, type User } from "@/lib/auth";

const NAV = [
  { id: "overview", icon: "📊", label: "خلاصه" },
  { id: "trading", icon: "⚡", label: "اتاق ترید" },
  { id: "signals", icon: "🎯", label: "سیگنال‌ها" },
  { id: "users", icon: "👥", label: "کاربران" },
  { id: "settings", icon: "⚙️", label: "تنظیمات" },
];

const LIVE_SIGNALS = [
  { id: 1, coin: "BTC/USDT", type: "BUY",  entry: "$67,432", tp: "$71,200", sl: "$65,800", conf: 94, tf: "1H",  time: "00:02" },
  { id: 2, coin: "ETH/USDT", type: "SELL", entry: "$3,521",  tp: "$3,200",  sl: "$3,650",  conf: 87, tf: "4H",  time: "00:05" },
  { id: 3, coin: "SOL/USDT", type: "BUY",  entry: "$178.5",  tp: "$195",    sl: "$168",    conf: 91, tf: "1H",  time: "00:08" },
  { id: 4, coin: "BNB/USDT", type: "BUY",  entry: "$612",    tp: "$645",    sl: "$595",    conf: 82, tf: "15m", time: "00:12" },
  { id: 5, coin: "XRP/USDT", type: "SELL", entry: "$0.622",  tp: "$0.580",  sl: "$0.645",  conf: 79, tf: "4H",  time: "00:18" },
  { id: 6, coin: "AVAX/USDT",type: "BUY",  entry: "$38.7",   tp: "$42.5",   sl: "$36.2",   conf: 88, tf: "1H",  time: "00:22" },
];

const CANDLES = [
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
  { o: 155, c: 162, h: 168, l: 150, bull: true },
  { o: 162, c: 158, h: 170, l: 154, bull: false },
  { o: 158, c: 172, h: 176, l: 155, bull: true },
  { o: 172, c: 165, h: 178, l: 162, bull: false },
  { o: 165, c: 180, h: 185, l: 163, bull: true },
];

const W = 600, H = 220, PAD = 12;
const minV = 55, maxV = 190, range = maxV - minV;
function toY(v: number) { return H - PAD - ((v - minV) / range) * (H - PAD * 2); }

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTf, setSelectedTf] = useState("1H");
  const [selectedCoin, setSelectedCoin] = useState("BTC/USDT");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const cur = getCurrentUser();
    if (!cur) { router.push("/auth/login"); return; }
    if (cur.role !== "admin") { router.push("/dashboard"); return; }
    setUser(cur);
    setUsers(getUsers());
  }, [router]);

  const handleApprove = (id: string) => {
    approveUser(id);
    setUsers(getUsers());
  };

  const handleRole = (id: string, role: "admin" | "user") => {
    setUserRole(id, role);
    setUsers(getUsers());
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--text2)", fontSize: 14 }}>در حال بارگذاری...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", fontFamily: "inherit" }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 64, flexShrink: 0,
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: "18px 16px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg, var(--brand) 0%, var(--neon) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "#070B14",
          }}>X</div>
          {sidebarOpen && (
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", whiteSpace: "nowrap" }}>
              Mahir<span style={{ color: "var(--neon)" }}>X</span>
              <span style={{ fontSize: 10, marginLeft: 6, color: "var(--brand-light)", background: "var(--brand-glow)", padding: "1px 6px", borderRadius: 4 }}>ADMIN</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 9, border: "none",
              background: tab === n.id ? "var(--brand-glow)" : "transparent",
              color: tab === n.id ? "var(--brand-light)" : "var(--text2)",
              cursor: "pointer", fontWeight: tab === n.id ? 600 : 400,
              fontSize: 13, transition: "all 0.15s", textAlign: "left" as const,
              outline: tab === n.id ? "1px solid rgba(108,92,231,0.25)" : "none",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 10px", borderRadius: 9, border: "none",
            background: "transparent", color: "var(--bear)",
            cursor: "pointer", fontSize: 13, width: "100%",
          }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{
          height: 60, background: "var(--surface)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text2)", width: 34, height: 34, borderRadius: 8,
              cursor: "pointer", fontSize: 14,
            }}>☰</button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
                {NAV.find(n => n.id === tab)?.label}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="badge">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--bull)", animation: "pulse-dot 2s ease-in-out infinite" }} />
              زنده
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 12px", background: "var(--surface2)", borderRadius: 8,
              border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--brand), var(--neon))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#070B14",
              }}>{user.name[0].toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{user.name}</div>
                <div style={{ fontSize: 10, color: "var(--brand-light)" }}>Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 20 }}>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                {[
                  { label: "کل سیگنال‌ها", value: "1,284", change: "+12%", color: "var(--brand-light)", icon: "🎯" },
                  { label: "دقت سیگنال", value: "94.2%", change: "+2.1%", color: "var(--bull)", icon: "✅" },
                  { label: "کاربران فعال", value: users.filter(u => u.approved).length.toString(), change: "", color: "var(--accent)", icon: "👥" },
                  { label: "انتظار تأیید", value: users.filter(u => !u.approved).length.toString(), change: "", color: "var(--bear)", icon: "⏳" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: 16,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                        {s.change && <div style={{ fontSize: 11, color: "var(--bull)", marginTop: 4 }}>{s.change}</div>}
                      </div>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini chart + recent signals */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>BTC/USDT</div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--bull)", fontFamily: "monospace" }}>$67,432 ▲</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
                    {[0.25, 0.5, 0.75].map(r => (
                      <line key={r} x1={PAD} y1={toY(minV + range * r)} x2={W - PAD} y2={toY(minV + range * r)}
                        stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                    ))}
                    {CANDLES.map((c, i) => {
                      const cw = (W - PAD * 2) / CANDLES.length;
                      const x = PAD + i * cw + cw * 0.15;
                      const cWidth = cw * 0.7;
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
                  </svg>
                </div>

                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                    آخرین سیگنال‌ها
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {LIVE_SIGNALS.slice(0, 5).map(sig => (
                      <div key={sig.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 10px", background: "var(--surface2)", borderRadius: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
                            background: sig.type === "BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                            color: sig.type === "BUY" ? "var(--bull)" : "var(--bear)",
                          }}>{sig.type}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{sig.coin}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{sig.entry}</div>
                          <div style={{ fontSize: 10, color: "var(--brand-light)" }}>{sig.conf}% conf</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRADING ROOM */}
          {tab === "trading" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>اتاق ترید حرفه‌ای</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["BTC/USDT","ETH/USDT","SOL/USDT","BNB/USDT"].map(c => (
                    <button key={c} onClick={() => setSelectedCoin(c)} style={{
                      padding: "6px 12px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600,
                      background: selectedCoin === c ? "var(--brand)" : "var(--surface2)",
                      color: selectedCoin === c ? "#fff" : "var(--text2)",
                      cursor: "pointer",
                    }}>{c.split("/")[0]}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
                {/* Chart */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{
                    padding: "12px 16px", borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{selectedCoin}</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "var(--bull)", fontFamily: "monospace" }}>$67,432</span>
                      <span style={{ fontSize: 12, color: "var(--bull)", fontWeight: 600 }}>▲ +2.4%</span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["1m","5m","15m","1H","4H","1D","1W"].map(tf => (
                        <button key={tf} onClick={() => setSelectedTf(tf)} style={{
                          padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: selectedTf === tf ? "var(--brand)" : "var(--surface2)",
                          color: selectedTf === tf ? "#fff" : "var(--text3)",
                          border: "none", cursor: "pointer",
                        }}>{tf}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <svg viewBox={`0 0 ${W} 280`} width="100%" height={280}>
                      {[0.2, 0.4, 0.6, 0.8].map(r => (
                        <line key={r} x1={PAD} y1={280 * r} x2={W - PAD} y2={280 * r}
                          stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                      ))}
                      {CANDLES.map((c, i) => {
                        const cw = (W - PAD * 2) / CANDLES.length;
                        const x = PAD + i * cw + cw * 0.1;
                        const cWidth = cw * 0.8;
                        const top = toY(Math.max(c.o, c.c));
                        const bot = toY(Math.min(c.o, c.c));
                        const ch = Math.max(bot - top, 2);
                        const color = c.bull ? "var(--bull)" : "var(--bear)";
                        const midX = x + cWidth / 2;
                        return (
                          <g key={i}>
                            <line x1={midX} y1={toY(c.h)} x2={midX} y2={toY(c.l)} stroke={color} strokeWidth="1.5" />
                            <rect x={x} y={top} width={cWidth} height={ch} fill={color} rx="1.5"
                              style={{ filter: c.bull ? "drop-shadow(0 0 3px rgba(0,200,150,0.4))" : "drop-shadow(0 0 3px rgba(255,77,79,0.4))" }} />
                          </g>
                        );
                      })}
                      {/* Buy signal marker */}
                      <g>
                        <polygon points={`${W-50},${toY(182)} ${W-60},${toY(175)} ${W-40},${toY(175)}`} fill="var(--bull)" />
                        <text x={W-50} y={toY(170)} textAnchor="middle" fill="var(--bull)" fontSize="10" fontWeight="700">BUY</text>
                      </g>
                    </svg>
                    {/* Volume bars */}
                    <svg viewBox={`0 0 ${W} 50`} width="100%" height={50}>
                      {CANDLES.map((c, i) => {
                        const cw = (W - PAD * 2) / CANDLES.length;
                        const x = PAD + i * cw + cw * 0.1;
                        const vol = 15 + Math.random() * 30;
                        return (
                          <rect key={i} x={x} y={50 - vol} width={cw * 0.8} height={vol}
                            fill={c.bull ? "rgba(0,200,150,0.4)" : "rgba(255,77,79,0.4)"} rx="1" />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Signal Panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Current Signal */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(0,200,150,0.12), rgba(0,200,150,0.04))",
                    border: "1px solid rgba(0,200,150,0.3)",
                    borderRadius: 14, padding: 16,
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                      سیگنال فعلی
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "var(--bull)" }}>● خرید</span>
                      <span style={{ fontSize: 24, fontWeight: 800, color: "var(--bull)" }}>94%</span>
                    </div>
                    {[
                      { l: "ورود", v: "$67,432", c: "var(--text)" },
                      { l: "هدف ۱", v: "$69,500", c: "var(--bull)" },
                      { l: "هدف ۲", v: "$71,200", c: "var(--bull)" },
                      { l: "حد ضرر", v: "$65,800", c: "var(--bear)" },
                    ].map(r => (
                      <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: "var(--text3)" }}>{r.l}</span>
                        <span style={{ fontWeight: 700, color: r.c, fontFamily: "monospace" }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>اطمینان AI</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)" }}>94%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: "94%", background: "linear-gradient(90deg, var(--brand), var(--bull))" }} />
                      </div>
                    </div>
                  </div>

                  {/* Market stats */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 10 }}>آمار بازار</div>
                    {[
                      { l: "حجم ۲۴H", v: "$28.4B" },
                      { l: "High 24H", v: "$68,920" },
                      { l: "Low 24H", v: "$65,100" },
                      { l: "سرمایه بازار", v: "$1.32T" },
                    ].map(r => (
                      <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                        <span style={{ color: "var(--text3)" }}>{r.l}</span>
                        <span style={{ fontWeight: 600, color: "var(--text)", fontFamily: "monospace" }}>{r.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button className="btn-primary" style={{ justifyContent: "center", fontSize: 13, padding: "10px" }}>
                      🟢 خرید
                    </button>
                    <button style={{
                      justifyContent: "center", fontSize: 13, padding: "10px",
                      background: "var(--bear)", color: "#fff", border: "none",
                      borderRadius: 10, cursor: "pointer", fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      🔴 فروش
                    </button>
                  </div>
                </div>
              </div>

              {/* All Signals Table */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                  سیگنال‌های زنده
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>جفت ارز</th>
                      <th>نوع</th>
                      <th>ورود</th>
                      <th>هدف</th>
                      <th>حد ضرر</th>
                      <th>اطمینان</th>
                      <th>تایم‌فریم</th>
                      <th>زمان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIVE_SIGNALS.map(sig => (
                      <tr key={sig.id}>
                        <td style={{ fontWeight: 700, color: "var(--text)" }}>{sig.coin}</td>
                        <td>
                          <span style={{
                            fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                            background: sig.type === "BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                            color: sig.type === "BUY" ? "var(--bull)" : "var(--bear)",
                          }}>{sig.type === "BUY" ? "خرید" : "فروش"}</span>
                        </td>
                        <td style={{ fontFamily: "monospace", fontWeight: 600 }}>{sig.entry}</td>
                        <td style={{ color: "var(--bull)", fontFamily: "monospace" }}>{sig.tp}</td>
                        <td style={{ color: "var(--bear)", fontFamily: "monospace" }}>{sig.sl}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: "var(--surface3)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${sig.conf}%`, background: "linear-gradient(90deg, var(--brand), var(--bull))", borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand-light)", fontFamily: "monospace" }}>{sig.conf}%</span>
                          </div>
                        </td>
                        <td><span className="badge badge-neutral" style={{ fontSize: 10 }}>{sig.tf}</span></td>
                        <td style={{ color: "var(--text3)", fontSize: 12, fontFamily: "monospace" }}>{sig.time} ago</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SIGNALS */}
          {tab === "signals" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>مدیریت سیگنال‌ها</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {LIVE_SIGNALS.map(sig => (
                  <div key={sig.id} style={{
                    background: "var(--surface)", border: `1px solid ${sig.type === "BUY" ? "rgba(0,200,150,0.25)" : "rgba(255,77,79,0.25)"}`,
                    borderRadius: 12, padding: 16,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{sig.coin}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>{sig.tf}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                          background: sig.type === "BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                          color: sig.type === "BUY" ? "var(--bull)" : "var(--bear)",
                        }}>{sig.type === "BUY" ? "خرید" : "فروش"}</span>
                      </div>
                    </div>
                    {[
                      { l: "ورود", v: sig.entry, c: "var(--text)" },
                      { l: "هدف", v: sig.tp, c: "var(--bull)" },
                      { l: "حد ضرر", v: sig.sl, c: "var(--bear)" },
                    ].map(r => (
                      <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: "var(--text3)" }}>{r.l}</span>
                        <span style={{ fontWeight: 700, color: r.c, fontFamily: "monospace" }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: "var(--text3)" }}>اطمینان AI</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-light)" }}>{sig.conf}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${sig.conf}%`, background: "linear-gradient(90deg, var(--brand), var(--accent))" }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>مدیریت کاربران</div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>نام</th>
                      <th>ایمیل</th>
                      <th>نقش</th>
                      <th>وضعیت</th>
                      <th>تاریخ ثبت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600, color: "var(--text)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: "50%",
                              background: "linear-gradient(135deg, var(--brand), var(--neon))",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 12, fontWeight: 700, color: "#070B14", flexShrink: 0,
                            }}>{u.name[0].toUpperCase()}</div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ color: "var(--text2)", fontSize: 13 }}>{u.email}</td>
                        <td>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                            background: u.role === "admin" ? "var(--brand-glow)" : "rgba(136,150,176,0.1)",
                            color: u.role === "admin" ? "var(--brand-light)" : "var(--text2)",
                            border: `1px solid ${u.role === "admin" ? "rgba(108,92,231,0.3)" : "rgba(136,150,176,0.2)"}`,
                          }}>{u.role === "admin" ? "ادمین" : "کاربر"}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                            background: u.approved ? "var(--bull-dim)" : "var(--bear-dim)",
                            color: u.approved ? "var(--bull)" : "var(--bear)",
                          }}>{u.approved ? "تأیید شده" : "در انتظار"}</span>
                        </td>
                        <td style={{ color: "var(--text3)", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString("fa-IR")}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {!u.approved && (
                              <button onClick={() => handleApprove(u.id)} style={{
                                padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11,
                                background: "var(--bull-dim)", color: "var(--bull)", cursor: "pointer", fontWeight: 600,
                              }}>تأیید</button>
                            )}
                            {u.id !== user.id && (
                              <button onClick={() => handleRole(u.id, u.role === "admin" ? "user" : "admin")} style={{
                                padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11,
                                background: "var(--brand-glow)", color: "var(--brand-light)", cursor: "pointer", fontWeight: 600,
                              }}>{u.role === "admin" ? "کاربر" : "ادمین"}</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>تنظیمات</div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>اطلاعات حساب</div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>نام</label>
                  <input className="input-field" defaultValue={user.name} readOnly />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>ایمیل</label>
                  <input className="input-field" defaultValue={user.email} readOnly />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--text3)", display: "block", marginBottom: 6 }}>نقش</label>
                  <input className="input-field" defaultValue="Admin" readOnly />
                </div>
                <button className="btn-neon" style={{ justifyContent: "center", marginTop: 4 }} onClick={handleLogout}>
                  خروج از حساب
                </button>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 16 }}>لینک‌های سریع</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link href="/" style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none" }}>← بازگشت به صفحه اصلی</Link>
                  <Link href="/dashboard" style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none" }}>→ داشبورد کاربر</Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
