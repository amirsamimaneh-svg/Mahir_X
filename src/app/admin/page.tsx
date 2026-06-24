"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, getUsers, logout, approveUser, setUserRole, type User } from "@/lib/auth";

const NAV = [
  { id: "trading", icon: "⚡", label: "اتاق ترید" },
  { id: "signals", icon: "🎯", label: "سیگنال‌ها" },
  { id: "overview", icon: "📊", label: "داشبورد" },
  { id: "users", icon: "👥", label: "کاربران" },
  { id: "settings", icon: "⚙️", label: "تنظیمات" },
];

const SIGNAL_POOL = [
  { id: 1,  coin: "BTC/USDT",  type: "BUY",  entry: "۶۷٬۴۳۲", entryRaw: 67432, tp: "۷۱٬۲۰۰", sl: "۶۵٬۸۰۰", conf: 94, tf: "۱ ساعته",  risk: "کم",    category: "اسپات" },
  { id: 2,  coin: "ETH/USDT",  type: "SELL", entry: "۳٬۵۲۱",   entryRaw: 3521,  tp: "۳٬۲۰۰",  sl: "۳٬۶۵۰",  conf: 87, tf: "۴ ساعته",  risk: "متوسط", category: "فیوچرز" },
  { id: 3,  coin: "SOL/USDT",  type: "BUY",  entry: "۱۷۸.۵",   entryRaw: 178.5, tp: "۱۹۵",    sl: "۱۶۸",    conf: 91, tf: "۱ ساعته",  risk: "کم",    category: "اسپات" },
  { id: 4,  coin: "BNB/USDT",  type: "BUY",  entry: "۶۱۲",     entryRaw: 612,   tp: "۶۴۵",    sl: "۵۹۵",    conf: 82, tf: "۱۵ دقیقه", risk: "زیاد",   category: "فیوچرز" },
  { id: 5,  coin: "XRP/USDT",  type: "SELL", entry: "۰.۶۲۲",   entryRaw: 0.622, tp: "۰.۵۸",   sl: "۰.۶۴۵",  conf: 79, tf: "۴ ساعته",  risk: "متوسط", category: "اسپات" },
  { id: 6,  coin: "AVAX/USDT", type: "BUY",  entry: "۳۸.۷",    entryRaw: 38.7,  tp: "۴۲.۵",   sl: "۳۶.۲",   conf: 88, tf: "۱ ساعته",  risk: "کم",    category: "اسپات" },
  { id: 7,  coin: "LINK/USDT", type: "BUY",  entry: "۱۴.۳",    entryRaw: 14.3,  tp: "۱۶.۵",   sl: "۱۳.۲",   conf: 85, tf: "۴ ساعته",  risk: "متوسط", category: "اسپات" },
  { id: 8,  coin: "DOT/USDT",  type: "SELL", entry: "۸.۱۲",    entryRaw: 8.12,  tp: "۷.۱",    sl: "۸.۶",    conf: 76, tf: "۱ روزه",   risk: "متوسط", category: "فیوچرز" },
];

const CANDLES = [
  { o:60,c:75,h:80,l:55,bull:true },{ o:75,c:70,h:82,l:65,bull:false },
  { o:70,c:85,h:90,l:68,bull:true },{ o:85,c:78,h:92,l:74,bull:false },
  { o:78,c:95,h:98,l:76,bull:true },{ o:95,c:88,h:100,l:84,bull:false },
  { o:88,c:105,h:110,l:86,bull:true },{ o:105,c:115,h:118,l:102,bull:true },
  { o:115,c:108,h:120,l:104,bull:false },{ o:108,c:125,h:130,l:106,bull:true },
  { o:125,c:118,h:132,l:115,bull:false },{ o:118,c:138,h:142,l:116,bull:true },
  { o:138,c:145,h:150,l:134,bull:true },{ o:145,c:135,h:152,l:130,bull:false },
  { o:135,c:155,h:160,l:132,bull:true },{ o:155,c:162,h:168,l:150,bull:true },
  { o:162,c:158,h:170,l:154,bull:false },{ o:158,c:172,h:176,l:155,bull:true },
  { o:172,c:165,h:178,l:162,bull:false },{ o:165,c:180,h:185,l:163,bull:true },
  { o:180,c:175,h:188,l:172,bull:false },{ o:175,c:190,h:195,l:173,bull:true },
];

const W=900, H=320, PAD=16;
const minV=55, maxV=200, range=maxV-minV;
function toY(v: number) { return H - PAD - ((v - minV) / range) * (H - PAD * 2); }

interface Signal { id: number; coin: string; type: string; entry: string; entryRaw: number; tp: string; sl: string; conf: number; tf: string; risk: string; category: string; }
interface Toast { id: number; signal: Signal; }

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState("trading");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTf, setSelectedTf] = useState("۱H");
  const [selectedCoin, setSelectedCoin] = useState("BTC/USDT");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [filterType, setFilterType] = useState("همه");
  const [filterRisk, setFilterRisk] = useState("همه");

  const showToast = useCallback((signal: Signal) => {
    const id = Date.now();
    setToasts(prev => [...prev.slice(-2), { id, signal }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
    if (notifEnabled && "Notification" in window && Notification.permission === "granted") {
      new Notification(`سیگنال جدید: ${signal.coin}`, {
        body: `${signal.type === "BUY" ? "🟢 خرید" : "🔴 فروش"} | ورود: $${signal.entryRaw} | اطمینان: ${signal.conf}%`,
        icon: "/favicon.ico",
      });
    }
  }, [notifEnabled]);

  useEffect(() => {
    const cur = getCurrentUser();
    if (!cur) { router.push("/auth/login"); return; }
    if (cur.role !== "admin") { router.push("/dashboard"); return; }
    setUser(cur);
    setUsers(getUsers());

    const interval = setInterval(() => {
      const sig = SIGNAL_POOL[Math.floor(Math.random() * SIGNAL_POOL.length)];
      showToast(sig);
    }, 15000);
    return () => clearInterval(interval);
  }, [router, showToast]);

  const requestNotif = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifEnabled(perm === "granted");
    }
  };

  const handleApprove = (id: string) => { approveUser(id); setUsers(getUsers()); };
  const handleRole = (id: string, role: "admin" | "user") => { setUserRole(id, role); setUsers(getUsers()); };
  const handleLogout = () => { logout(); router.push("/"); };

  const filteredSignals = SIGNAL_POOL.filter(s => {
    if (filterType !== "همه" && s.type !== filterType) return false;
    if (filterRisk !== "همه" && s.risk !== filterRisk) return false;
    return true;
  });

  if (!user) return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:"var(--text2)" }}>در حال بارگذاری...</div>
    </div>
  );

  const cardStyle = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, overflow: "hidden" as const,
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", direction:"rtl" }}>

      {/* Signal Toasts */}
      <div style={{ position:"fixed", top:20, left:20, zIndex:1000, display:"flex", flexDirection:"column", gap:10 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity:0, x:-40, scale:0.9 }}
              animate={{ opacity:1, x:0, scale:1 }}
              exit={{ opacity:0, x:-40, scale:0.9 }}
              transition={{ duration:0.3 }}
              style={{
                background: t.signal.type==="BUY" ? "linear-gradient(135deg,rgba(0,200,150,0.18),rgba(0,200,150,0.06))" : "linear-gradient(135deg,rgba(255,77,79,0.18),rgba(255,77,79,0.06))",
                border: `1px solid ${t.signal.type==="BUY" ? "rgba(0,200,150,0.4)" : "rgba(255,77,79,0.4)"}`,
                borderRadius:14, padding:"14px 18px", minWidth:260,
                backdropFilter:"blur(20px)", boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
              }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>{t.signal.type==="BUY" ? "🟢" : "🔴"}</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>سیگنال جدید</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>هوش مصنوعی MahirX</div>
                </div>
                <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
                  style={{ marginRight:"auto", background:"none", border:"none", color:"var(--text3)", cursor:"pointer", fontSize:16 }}>×</button>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:"var(--text)" }}>{t.signal.coin}</div>
                  <div style={{ fontSize:12, color:"var(--text2)", marginTop:2 }}>ورود: ${t.signal.entryRaw}</div>
                </div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:2 }}>اطمینان AI</div>
                  <div style={{ fontWeight:800, fontSize:18, color: t.signal.type==="BUY" ? "var(--bull)" : "var(--bear)" }}>{t.signal.conf}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 230 : 68, flexShrink:0,
        background:"var(--surface)", borderLeft:"1px solid var(--border)",
        display:"flex", flexDirection:"column", transition:"width 0.25s ease",
        overflow:"hidden", position:"sticky", top:0, height:"100vh",
      }}>
        <div style={{ padding:"18px 14px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:"linear-gradient(135deg,var(--brand) 0%,var(--neon) 100%)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, fontSize:16, color:"#070B14",
          }}>X</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"var(--text)" }}>
                Mahir<span style={{ color:"var(--neon)" }}>X</span>
              </div>
              <div style={{ fontSize:10, color:"var(--brand-light)", background:"var(--brand-glow)", padding:"1px 6px", borderRadius:4, display:"inline-block", marginTop:2 }}>
                پنل ادمین
              </div>
            </div>
          )}
        </div>

        <nav style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:3 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"11px 10px", borderRadius:10, border:"none",
              background: tab===n.id ? "var(--brand-glow)" : "transparent",
              color: tab===n.id ? "var(--brand-light)" : "var(--text2)",
              cursor:"pointer", fontWeight: tab===n.id ? 700 : 400,
              fontSize:13, transition:"all 0.15s", textAlign:"right" as const,
              outline: tab===n.id ? "1px solid rgba(108,92,231,0.3)" : "none",
              fontFamily:"Vazirmatn,sans-serif",
            }}>
              <span style={{ fontSize:17, flexShrink:0 }}>{n.icon}</span>
              {sidebarOpen && <span>{n.label}</span>}
              {sidebarOpen && tab===n.id && <span style={{ marginRight:"auto", width:6, height:6, borderRadius:"50%", background:"var(--brand-light)", flexShrink:0 }} />}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div style={{ padding:"12px 14px", borderTop:"1px solid var(--border)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--surface2)", borderRadius:10 }}>
              <div style={{
                width:34, height:34, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,var(--brand),var(--neon))",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:800, color:"#070B14",
              }}>{user.name[0]?.toUpperCase()}</div>
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
                <div style={{ fontSize:10, color:"var(--brand-light)" }}>مدیر ارشد</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              marginTop:8, width:"100%", padding:"9px", borderRadius:9, border:"none",
              background:"rgba(255,77,79,0.1)", color:"var(--bear)", cursor:"pointer",
              fontSize:13, fontWeight:600, fontFamily:"Vazirmatn,sans-serif",
            }}>خروج از حساب</button>
          </div>
        )}
        {!sidebarOpen && (
          <div style={{ padding:8, borderTop:"1px solid var(--border)" }}>
            <button onClick={handleLogout} style={{
              width:"100%", padding:10, borderRadius:9, border:"none",
              background:"rgba(255,77,79,0.1)", color:"var(--bear)", cursor:"pointer", fontSize:16,
            }}>🚪</button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* Topbar */}
        <header style={{
          height:64, background:"var(--surface)", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 20px", flexShrink:0, gap:12,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{
              background:"var(--surface2)", border:"1px solid var(--border)",
              color:"var(--text2)", width:36, height:36, borderRadius:9,
              cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
            }}>☰</button>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>
                {NAV.find(n => n.id===tab)?.label}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Notif toggle */}
            <button onClick={requestNotif} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"7px 12px", borderRadius:9,
              background: notifEnabled ? "rgba(0,200,150,0.12)" : "var(--surface2)",
              border: `1px solid ${notifEnabled ? "rgba(0,200,150,0.3)" : "var(--border)"}`,
              color: notifEnabled ? "var(--bull)" : "var(--text3)",
              cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"Vazirmatn,sans-serif",
            }}>
              🔔 {notifEnabled ? "نوتیف فعال" : "فعال‌سازی اعلان"}
            </button>

            <span className="badge">
              <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--bull)", animation:"pulse-dot 2s ease-in-out infinite" }} />
              آنلاین
            </span>

            <Link href="/" style={{
              padding:"7px 14px", borderRadius:9, border:"1px solid var(--border)",
              color:"var(--text2)", fontSize:12, textDecoration:"none", fontFamily:"Vazirmatn,sans-serif",
            }}>← سایت</Link>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflow:"auto", padding:20 }}>

          {/* ════ TRADING ROOM ════ */}
          {tab==="trading" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Header row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>اتاق ترید حرفه‌ای</div>
                  <div style={{ fontSize:13, color:"var(--text3)", marginTop:3 }}>تحلیل لحظه‌ای با هوش مصنوعی چندعاملی</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {["BTC","ETH","SOL","BNB","AVAX"].map(c => (
                    <button key={c} onClick={() => setSelectedCoin(c+"/USDT")} style={{
                      padding:"7px 14px", borderRadius:9, border:"none", fontSize:13, fontWeight:700,
                      background: selectedCoin===c+"/USDT" ? "var(--brand)" : "var(--surface2)",
                      color: selectedCoin===c+"/USDT" ? "#fff" : "var(--text2)",
                      cursor:"pointer", fontFamily:"Vazirmatn,sans-serif", transition:"all 0.15s",
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
                {/* Main Chart */}
                <div style={{ ...cardStyle }}>
                  {/* Chart header */}
                  <div style={{
                    padding:"14px 18px", borderBottom:"1px solid var(--border)",
                    display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{
                        width:36, height:36, borderRadius:9,
                        background:"linear-gradient(135deg,rgba(247,147,26,0.2),rgba(247,147,26,0.08))",
                        border:"1px solid rgba(247,147,26,0.3)",
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                      }}>₿</div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:16, color:"var(--text)" }}>{selectedCoin}</div>
                        <div style={{ fontSize:11, color:"var(--text3)" }}>بایننس اسپات</div>
                      </div>
                      <div>
                        <div style={{ fontWeight:800, fontSize:22, color:"var(--bull)", fontFamily:"monospace", direction:"ltr" }}>$67,432.00</div>
                        <div style={{ fontSize:12, color:"var(--bull)", fontWeight:600 }}>▲ +۲.۴٪ امروز</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {["۱m","۵m","۱۵m","۱H","۴H","۱D","۱W"].map(tf => (
                        <button key={tf} onClick={() => setSelectedTf(tf)} style={{
                          padding:"5px 10px", borderRadius:7, fontSize:11, fontWeight:700,
                          background: selectedTf===tf ? "var(--brand)" : "var(--surface3)",
                          color: selectedTf===tf ? "#fff" : "var(--text3)",
                          border:"none", cursor:"pointer", fontFamily:"Vazirmatn,sans-serif",
                        }}>{tf}</button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div style={{ padding:"16px 16px 8px" }}>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display:"block" }}>
                      <defs>
                        <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.15"/>
                          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Grid */}
                      {[0.2,0.4,0.6,0.8].map(r => (
                        <g key={r}>
                          <line x1={PAD} y1={H*r} x2={W-PAD} y2={H*r} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,6"/>
                          <text x={W-PAD-4} y={H*r-4} fill="var(--text3)" fontSize="10" textAnchor="end" fontFamily="monospace">
                            ${Math.round(minV + range*(1-r)).toLocaleString()}
                          </text>
                        </g>
                      ))}
                      {/* Candles */}
                      {CANDLES.map((c, i) => {
                        const cw = (W-PAD*2)/CANDLES.length;
                        const x = PAD+i*cw+cw*0.1;
                        const cWidth = cw*0.8;
                        const top = toY(Math.max(c.o,c.c));
                        const bot = toY(Math.min(c.o,c.c));
                        const ch = Math.max(bot-top,2);
                        const color = c.bull ? "var(--bull)" : "var(--bear)";
                        const midX = x+cWidth/2;
                        return (
                          <g key={i}>
                            <line x1={midX} y1={toY(c.h)} x2={midX} y2={toY(c.l)} stroke={color} strokeWidth="1.5"/>
                            <rect x={x} y={top} width={cWidth} height={ch} fill={color} rx="2"
                              style={{ filter: c.bull ? "drop-shadow(0 0 4px rgba(0,200,150,0.3))" : "drop-shadow(0 0 4px rgba(255,77,79,0.3))" }}/>
                          </g>
                        );
                      })}
                      {/* BUY signal */}
                      <g>
                        <polygon points={`${W-70},${toY(185)} ${W-82},${toY(177)} ${W-58},${toY(177)}`} fill="var(--bull)"/>
                        <rect x={W-95} y={toY(172)} width={50} height={16} rx={4} fill="rgba(0,200,150,0.9)"/>
                        <text x={W-70} y={toY(162)} textAnchor="middle" fill="white" fontSize="9" fontWeight="800">خرید</text>
                      </g>
                    </svg>
                    {/* Volume */}
                    <svg viewBox={`0 0 ${W} 48`} width="100%" height={48} style={{ display:"block", marginTop:2 }}>
                      {CANDLES.map((c,i) => {
                        const cw=(W-PAD*2)/CANDLES.length;
                        const x=PAD+i*cw+cw*0.1;
                        const vol = 15+((i*7+13)%25);
                        return <rect key={i} x={x} y={48-vol} width={cw*0.8} height={vol}
                          fill={c.bull ? "rgba(0,200,150,0.35)" : "rgba(255,77,79,0.35)"} rx="1"/>;
                      })}
                    </svg>
                  </div>

                  {/* Market stats row */}
                  <div style={{ display:"flex", gap:0, borderTop:"1px solid var(--border)" }}>
                    {[
                      { l:"بالاترین ۲۴H", v:"$68,920" },
                      { l:"پایین‌ترین ۲۴H", v:"$65,100" },
                      { l:"حجم ۲۴H", v:"$28.4B" },
                      { l:"تغییر ۷ روزه", v:"+8.2%" },
                      { l:"سرمایه بازار", v:"$1.32T" },
                    ].map((s,i) => (
                      <div key={i} style={{
                        flex:1, padding:"10px 14px", borderLeft: i>0 ? "1px solid var(--border)" : "none",
                        textAlign:"center",
                      }}>
                        <div style={{ fontSize:10, color:"var(--text3)", marginBottom:3, fontFamily:"Vazirmatn,sans-serif" }}>{s.l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"monospace", direction:"ltr" }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel */}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {/* AI Signal Card */}
                  <div style={{
                    background:"linear-gradient(135deg,rgba(0,200,150,0.1),rgba(0,200,150,0.03))",
                    border:"1px solid rgba(0,200,150,0.35)", borderRadius:14, padding:16,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ fontSize:12, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>سیگنال هوش مصنوعی</div>
                      <span style={{
                        fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:6,
                        background:"var(--bull-dim)", color:"var(--bull)",
                        border:"1px solid rgba(0,200,150,0.3)", fontFamily:"Vazirmatn,sans-serif",
                      }}>🟢 خرید</span>
                    </div>
                    <div style={{ fontSize:28, fontWeight:800, color:"var(--bull)", marginBottom:4, fontFamily:"monospace", direction:"ltr" }}>$67,432</div>
                    <div style={{ fontSize:12, color:"var(--text3)", marginBottom:14, fontFamily:"Vazirmatn,sans-serif" }}>قیمت ورود پیشنهادی</div>
                    {[
                      { l:"هدف اول", v:"$69,500", c:"var(--bull)", icon:"🎯" },
                      { l:"هدف دوم", v:"$71,200", c:"var(--bull)", icon:"🎯" },
                      { l:"حد ضرر", v:"$65,800", c:"var(--bear)", icon:"🛡️" },
                    ].map(r => (
                      <div key={r.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, padding:"6px 10px", background:"rgba(255,255,255,0.04)", borderRadius:7 }}>
                        <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>{r.icon} {r.l}</span>
                        <span style={{ fontWeight:700, color:r.c, fontFamily:"monospace", fontSize:13, direction:"ltr" }}>{r.v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:11, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>اطمینان هوش مصنوعی</span>
                        <span style={{ fontSize:13, fontWeight:800, color:"var(--brand-light)" }}>۹۴٪</span>
                      </div>
                      <div style={{ height:8, background:"var(--surface3)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:"94%", height:"100%", background:"linear-gradient(90deg,var(--brand),var(--bull))", borderRadius:4 }}/>
                      </div>
                    </div>
                  </div>

                  {/* Trade buttons */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <button style={{
                      padding:"12px", borderRadius:10, border:"none", fontWeight:800, fontSize:14,
                      background:"linear-gradient(135deg,var(--bull),#00A87A)", color:"#fff",
                      cursor:"pointer", fontFamily:"Vazirmatn,sans-serif",
                      boxShadow:"0 4px 16px rgba(0,200,150,0.3)",
                    }}>🟢 خرید</button>
                    <button style={{
                      padding:"12px", borderRadius:10, border:"none", fontWeight:800, fontSize:14,
                      background:"linear-gradient(135deg,var(--bear),#CC3333)", color:"#fff",
                      cursor:"pointer", fontFamily:"Vazirmatn,sans-serif",
                      boxShadow:"0 4px 16px rgba(255,77,79,0.3)",
                    }}>🔴 فروش</button>
                  </div>

                  {/* Quick stats */}
                  <div style={{ ...cardStyle, padding:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)", marginBottom:10, fontFamily:"Vazirmatn,sans-serif" }}>آمار سریع</div>
                    {[
                      { l:"نسبت ریسک/پاداش", v:"۱:۲.۸" },
                      { l:"دقت سیگنال", v:"۹۴.۲٪" },
                      { l:"تایم‌فریم", v:"۱ ساعته" },
                      { l:"دسته‌بندی", v:"اسپات" },
                    ].map(r => (
                      <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                        <span style={{ color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>{r.l}</span>
                        <span style={{ fontWeight:700, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════ SIGNALS ════ */}
          {tab==="signals" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>مرکز سیگنال‌ها</div>
                  <div style={{ fontSize:13, color:"var(--text3)", marginTop:3 }}>سیگنال‌های لحظه‌ای هوش مصنوعی چندعاملی</div>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {["همه","BUY","SELL"].map(f => (
                    <button key={f} onClick={() => setFilterType(f)} style={{
                      padding:"7px 14px", borderRadius:9, border:"none", fontSize:12, fontWeight:700,
                      background: filterType===f ? "var(--brand)" : "var(--surface2)",
                      color: filterType===f ? "#fff" : "var(--text2)",
                      cursor:"pointer", fontFamily:"Vazirmatn,sans-serif",
                    }}>{f==="BUY" ? "🟢 خرید" : f==="SELL" ? "🔴 فروش" : f}</button>
                  ))}
                  {["همه","کم","متوسط","زیاد"].map(f => (
                    <button key={f} onClick={() => setFilterRisk(f)} style={{
                      padding:"7px 14px", borderRadius:9, border:"none", fontSize:12, fontWeight:700,
                      background: filterRisk===f ? "var(--accent)" : "var(--surface2)",
                      color: filterRisk===f ? "#070B14" : "var(--text2)",
                      cursor:"pointer", fontFamily:"Vazirmatn,sans-serif",
                    }}>ریسک: {f}</button>
                  ))}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:14 }}>
                {filteredSignals.map((sig, idx) => (
                  <motion.div key={sig.id}
                    initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:idx*0.05 }}
                    style={{
                      background:"var(--surface)", borderRadius:16, overflow:"hidden",
                      border:`1px solid ${sig.type==="BUY" ? "rgba(0,200,150,0.25)" : "rgba(255,77,79,0.25)"}`,
                    }}>
                    {/* Card header */}
                    <div style={{
                      padding:"12px 16px",
                      background: sig.type==="BUY" ? "linear-gradient(135deg,rgba(0,200,150,0.1),transparent)" : "linear-gradient(135deg,rgba(255,77,79,0.1),transparent)",
                      borderBottom:"1px solid var(--border)",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{
                          width:36, height:36, borderRadius:9, fontSize:16,
                          background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center",
                        }}>{sig.type==="BUY" ? "🟢" : "🔴"}</div>
                        <div>
                          <div style={{ fontWeight:800, fontSize:15, color:"var(--text)" }}>{sig.coin}</div>
                          <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>{sig.category} · {sig.tf}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"left" }}>
                        <div style={{
                          fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:6,
                          background: sig.type==="BUY" ? "var(--bull-dim)" : "var(--bear-dim)",
                          color: sig.type==="BUY" ? "var(--bull)" : "var(--bear)",
                          fontFamily:"Vazirmatn,sans-serif",
                        }}>{sig.type==="BUY" ? "خرید" : "فروش"}</div>
                        <div style={{
                          marginTop:4, fontSize:10, padding:"2px 8px", borderRadius:5,
                          background: sig.risk==="کم" ? "rgba(0,200,150,0.1)" : sig.risk==="زیاد" ? "rgba(255,77,79,0.1)" : "rgba(136,150,176,0.1)",
                          color: sig.risk==="کم" ? "var(--bull)" : sig.risk==="زیاد" ? "var(--bear)" : "var(--text2)",
                          textAlign:"center", fontFamily:"Vazirmatn,sans-serif",
                        }}>ریسک {sig.risk}</div>
                      </div>
                    </div>

                    <div style={{ padding:"14px 16px" }}>
                      {[
                        { l:"💰 قیمت ورود", v:sig.entry, c:"var(--text)" },
                        { l:"🎯 هدف سود", v:sig.tp, c:"var(--bull)" },
                        { l:"🛡️ حد ضرر", v:sig.sl, c:"var(--bear)" },
                      ].map(r => (
                        <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, alignItems:"center" }}>
                          <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>{r.l}</span>
                          <span style={{ fontWeight:800, color:r.c, fontFamily:"monospace", fontSize:14, direction:"ltr" }}>${r.v}</span>
                        </div>
                      ))}

                      <div style={{ marginTop:12, padding:"10px 12px", background:"var(--surface2)", borderRadius:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                          <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"Vazirmatn,sans-serif" }}>🤖 اطمینان هوش مصنوعی</span>
                          <span style={{ fontWeight:800, fontSize:16, color:"var(--brand-light)" }}>{sig.conf}٪</span>
                        </div>
                        <div style={{ height:6, background:"var(--surface3)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{
                            width:`${sig.conf}%`, height:"100%", borderRadius:3,
                            background: sig.conf>=90 ? "linear-gradient(90deg,var(--brand),var(--bull))" : "linear-gradient(90deg,var(--brand),var(--accent))",
                          }}/>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ════ OVERVIEW ════ */}
          {tab==="overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>داشبورد مدیریت</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
                {[
                  { l:"کل سیگنال‌ها", v:"۱٬۲۸۴", icon:"🎯", c:"var(--brand-light)", sub:"+۱۲٪ این هفته" },
                  { l:"دقت سیگنال", v:"۹۴.۲٪", icon:"✅", c:"var(--bull)", sub:"+۲.۱٪ بهتر شده" },
                  { l:"کاربران فعال", v:users.filter(u=>u.approved).length.toString(), icon:"👥", c:"var(--accent)", sub:"" },
                  { l:"در انتظار تأیید", v:users.filter(u=>!u.approved).length.toString(), icon:"⏳", c:"var(--bear)", sub:"" },
                ].map(s => (
                  <div key={s.l} style={{ ...cardStyle, padding:18 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:8, fontFamily:"Vazirmatn,sans-serif" }}>{s.l}</div>
                        <div style={{ fontSize:28, fontWeight:800, color:s.c, fontFamily:"Vazirmatn,sans-serif" }}>{s.v}</div>
                        {s.sub && <div style={{ fontSize:11, color:"var(--bull)", marginTop:5, fontFamily:"Vazirmatn,sans-serif" }}>{s.sub}</div>}
                      </div>
                      <div style={{ fontSize:28 }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ USERS ════ */}
          {tab==="users" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>مدیریت کاربران</div>
              <div style={{ ...cardStyle }}>
                <table className="data-table" style={{ direction:"rtl" }}>
                  <thead>
                    <tr>
                      <th style={{ fontFamily:"Vazirmatn,sans-serif" }}>نام</th>
                      <th style={{ fontFamily:"Vazirmatn,sans-serif" }}>ایمیل</th>
                      <th style={{ fontFamily:"Vazirmatn,sans-serif" }}>نقش</th>
                      <th style={{ fontFamily:"Vazirmatn,sans-serif" }}>وضعیت</th>
                      <th style={{ fontFamily:"Vazirmatn,sans-serif" }}>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{
                              width:32, height:32, borderRadius:"50%",
                              background:"linear-gradient(135deg,var(--brand),var(--neon))",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:13, fontWeight:800, color:"#070B14", flexShrink:0,
                            }}>{u.name[0]?.toUpperCase()}</div>
                            <span style={{ fontWeight:600, color:"var(--text)", fontFamily:"Vazirmatn,sans-serif" }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color:"var(--text2)", fontSize:13, direction:"ltr" }}>{u.email}</td>
                        <td>
                          <span style={{
                            fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6,
                            background: u.role==="admin" ? "var(--brand-glow)" : "rgba(136,150,176,0.1)",
                            color: u.role==="admin" ? "var(--brand-light)" : "var(--text2)",
                            fontFamily:"Vazirmatn,sans-serif",
                          }}>{u.role==="admin" ? "ادمین" : "کاربر"}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6,
                            background: u.approved ? "var(--bull-dim)" : "var(--bear-dim)",
                            color: u.approved ? "var(--bull)" : "var(--bear)",
                            fontFamily:"Vazirmatn,sans-serif",
                          }}>{u.approved ? "✅ فعال" : "⏳ در انتظار"}</span>
                        </td>
                        <td>
                          <div style={{ display:"flex", gap:6 }}>
                            {!u.approved && (
                              <button onClick={() => handleApprove(u.id)} style={{
                                padding:"5px 12px", borderRadius:7, border:"none", fontSize:11,
                                background:"var(--bull-dim)", color:"var(--bull)", cursor:"pointer",
                                fontWeight:700, fontFamily:"Vazirmatn,sans-serif",
                              }}>تأیید</button>
                            )}
                            {u.id!==user.id && (
                              <button onClick={() => handleRole(u.id, u.role==="admin" ? "user" : "admin")} style={{
                                padding:"5px 12px", borderRadius:7, border:"none", fontSize:11,
                                background:"var(--brand-glow)", color:"var(--brand-light)", cursor:"pointer",
                                fontWeight:700, fontFamily:"Vazirmatn,sans-serif",
                              }}>{u.role==="admin" ? "کاربر" : "ادمین"}</button>
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

          {/* ════ SETTINGS ════ */}
          {tab==="settings" && (
            <div style={{ maxWidth:500 }}>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginBottom:20, fontFamily:"Vazirmatn,sans-serif" }}>تنظیمات</div>
              <div style={{ ...cardStyle, padding:20, display:"flex", flexDirection:"column", gap:14 }}>
                <div>
                  <label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:6, fontFamily:"Vazirmatn,sans-serif" }}>نام</label>
                  <input className="input-field" defaultValue={user.name} readOnly/>
                </div>
                <div>
                  <label style={{ fontSize:12, color:"var(--text3)", display:"block", marginBottom:6, fontFamily:"Vazirmatn,sans-serif" }}>ایمیل</label>
                  <input className="input-field" defaultValue={user.email} readOnly style={{ direction:"ltr" }}/>
                </div>
                <button onClick={handleLogout} className="btn-neon" style={{ justifyContent:"center", fontFamily:"Vazirmatn,sans-serif" }}>
                  خروج از حساب
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
