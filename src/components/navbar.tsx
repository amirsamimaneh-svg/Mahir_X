"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="21" y2="8" /><line x1="3" y1="16" x2="21" y2="16" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn: React.CSSProperties = {
    width: 40, height: 40, borderRadius: 10,
    background: "var(--surface)", border: "1px solid var(--border)",
    color: "var(--text2)", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        background: scrolled ? "color-mix(in srgb, var(--bg) 85%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s",
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--brand) 0%, var(--neon) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: "#070B14",
            }}>X</div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", letterSpacing: "-0.01em" }}>
              Mahir<span style={{ color: "var(--neon)" }}>X</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" className="btn-ghost nav-desktop" style={{ padding: "9px 18px", fontSize: 14 }}>Log In</Link>
            <Link href="/dashboard" className="btn-neon nav-desktop" style={{ padding: "9px 18px", fontSize: 14 }}>Get Started</Link>
            <button onClick={() => setMenuOpen(true)} className="nav-mobile" style={{ ...iconBtn, display: "none" }}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0,
                width: "min(80vw, 300px)", background: "var(--surface2)",
                borderLeft: "1px solid var(--border)", zIndex: 201,
                padding: 24, display: "flex", flexDirection: "column", gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
                  Mahir<span style={{ color: "var(--neon)" }}>X</span>
                </span>
                <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}>
                  <XIcon />
                </button>
              </div>
              {navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}
                    style={{ display: "block", fontSize: 16, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/dashboard" className="btn-ghost" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/dashboard" className="btn-neon" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Get Started Free</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
