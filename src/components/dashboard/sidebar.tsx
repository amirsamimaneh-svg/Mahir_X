"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignals } from "@/contexts/signal-context";

const navSections = [
  {
    label: "Trading",
    items: [
      { icon: "▦",  label: "Dashboard",        href: "/dashboard",            badge: false },
      { icon: "🌐", label: "Markets",           href: "/dashboard/markets",    badge: false },
      { icon: "⚡", label: "Signals",           href: "/dashboard/signals",    badge: true  },
      { icon: "🤖", label: "AI Chat",           href: "/dashboard/ai",         badge: false },
      { icon: "🐋", label: "Whale Tracker",     href: "/dashboard/whales",     badge: false },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: "💼", label: "Portfolio",         href: "/dashboard/portfolio",  badge: false },
      { icon: "🔧", label: "Strategy Builder",  href: "/dashboard/strategy",   badge: false },
      { icon: "🔄", label: "Backtesting",       href: "/dashboard/backtest",   badge: false },
      { icon: "📓", label: "Journal",           href: "/dashboard/journal",    badge: false },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: "👤", label: "Profile & AI",      href: "/dashboard/profile",    badge: false },
      { icon: "⚙️", label: "Settings",          href: "/dashboard/settings",   badge: false },
    ],
  },
];

const bottomNavItems = [
  { icon: "▦",  label: "Home",    href: "/dashboard",          badge: false },
  { icon: "🌐", label: "Markets", href: "/dashboard/markets",  badge: false },
  { icon: "⚡", label: "Signals", href: "/dashboard/signals",  badge: true  },
  { icon: "🤖", label: "AI",      href: "/dashboard/ai",       badge: false },
];

/* ── Desktop Sidebar ── */
export function Sidebar() {
  const pathname    = usePathname();
  const { unreadCount, markAllRead } = useSignals();

  return (
    <aside className="dash-sidebar">
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: "-0.02em",
          }}>X</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", letterSpacing: "-0.02em" }}>
            MAHIR<span style={{ color: "var(--accent)" }}>X</span>
          </span>
        </Link>
      </div>

      {/* Nav Sections */}
      <nav style={{ flex: 1, padding: "12px 10px", overflow: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {navSections.map(section => (
          <div key={section.label}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active      = pathname === item.href;
              const showBadge   = item.badge && unreadCount > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { if (item.badge) markAllRead(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "8px 10px", borderRadius: 8, marginBottom: 1,
                    color: active ? "#fff" : "var(--text2)",
                    background: active ? "var(--brand)" : "transparent",
                    textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 500,
                    transition: "all 0.15s",
                    boxShadow: active ? "0 2px 12px rgba(108,92,231,0.35)" : "none",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; } }}
                >
                  <span style={{ fontSize: 13, width: 16, textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                  {showBadge && (
                    <span style={{
                      marginLeft: "auto", minWidth: 18, height: 18,
                      borderRadius: 100, background: "var(--bear)",
                      color: "#fff", fontSize: 10, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 5px",
                      animation: "badge-pop 0.3s ease",
                    }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade Card */}
      <div style={{ padding: "10px 10px 14px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          padding: "12px 14px",
          background: "linear-gradient(135deg, rgba(108,92,231,0.18), rgba(0,194,255,0.08))",
          border: "1px solid rgba(108,92,231,0.3)", borderRadius: 10,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", marginBottom: 3 }}>Free Plan</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 10 }}>3 / 5 AI analyses today</div>
          <div style={{ height: 3, background: "var(--surface3)", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, var(--brand), var(--accent))", borderRadius: 2 }} />
          </div>
          <a href="/#pricing" style={{
            display: "block", textAlign: "center",
            background: "var(--brand)", color: "#fff",
            borderRadius: 7, padding: "6px 12px",
            fontSize: 11, fontWeight: 700, textDecoration: "none",
          }}>Upgrade to Pro →</a>
        </div>
      </div>

      <style>{`
        .dash-sidebar {
          width: 210px; flex-shrink: 0;
          background: var(--surface); border-right: 1px solid var(--border);
          height: 100vh; position: sticky; top: 0;
          display: flex; flex-direction: column;
        }
        @media (max-width: 768px) { .dash-sidebar { display: none; } }
        @keyframes badge-pop {
          0%   { transform: scale(0.4); }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </aside>
  );
}

/* ── Mobile Bottom Nav ── */
export function BottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { unreadCount, markAllRead } = useSignals();

  return (
    <>
      <nav className="dash-bottom-nav">
        {bottomNavItems.map(item => {
          const active    = pathname === item.href;
          const showBadge = item.badge && unreadCount > 0;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => { if (item.badge) markAllRead(); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "8px 0", flex: 1, textDecoration: "none",
                color: active ? "var(--accent)" : "var(--text3)", transition: "color 0.15s",
                position: "relative",
              }}
            >
              {active && <div style={{ position: "absolute", top: 0, width: 28, height: 2, background: "var(--accent)", borderRadius: 2 }} />}
              <div style={{ position: "relative", display: "inline-flex" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {showBadge && (
                  <span style={{
                    position: "absolute", top: -4, right: -8,
                    minWidth: 16, height: 16, borderRadius: 100,
                    background: "var(--bear)", color: "#fff",
                    fontSize: 9, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
                  }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={() => setDrawerOpen(true)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "8px 0", flex: 1, background: "none", border: "none",
          color: "var(--text3)", cursor: "pointer",
        }}>
          <span style={{ fontSize: 18 }}>⋯</span>
          <span style={{ fontSize: 10, fontWeight: 600 }}>More</span>
        </button>

        <style>{`
          .dash-bottom-nav {
            display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
            background: var(--surface); border-top: 1px solid var(--border);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
          @media (max-width: 768px) { .dash-bottom-nav { display: flex; } }
        `}</style>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 100, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 101,
                background: "var(--surface2)", borderTop: "1px solid var(--border)",
                borderRadius: "18px 18px 0 0", padding: "8px 20px 32px",
              }}
            >
              <div style={{ width: 32, height: 3, background: "var(--border2)", borderRadius: 2, margin: "10px auto 18px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, var(--brand), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#fff" }}>X</div>
                <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>MAHIR<span style={{ color: "var(--accent)" }}>X</span></span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {navSections.flatMap(s => s.items).slice(3).map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "11px 13px", borderRadius: 10,
                      background: active ? "var(--brand)" : "var(--surface3)",
                      border: `1px solid ${active ? "var(--brand)" : "var(--border)"}`,
                      color: active ? "#fff" : "var(--text2)",
                      textDecoration: "none", fontSize: 12, fontWeight: 600,
                    }}>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  );
                })}
              </div>
              <div style={{ background: "var(--brand-glow)", border: "1px solid rgba(108,92,231,0.3)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>Free · 3/5 used</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Upgrade for unlimited access</div>
                </div>
                <a href="/#pricing" style={{ background: "var(--brand)", color: "#fff", borderRadius: 7, padding: "6px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Upgrade →</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
