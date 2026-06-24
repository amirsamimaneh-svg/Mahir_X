"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

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
  const [isDark, setIsDark] = useState(true);
  const { lang, setLang } = useLanguage();

  const navLinks = [
    { label: lang === "fa" ? "ویژگی‌ها" : "Features", href: "#features" },
    { label: lang === "fa" ? "چطور کار می‌کنه" : "How It Works", href: "#how-it-works" },
    { label: lang === "fa" ? "قیمت‌گذاری" : "Pricing", href: "#pricing" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  const iconBtn: React.CSSProperties = {
    width: 40, height: 40, borderRadius: 10,
    background: "var(--surface)", border: "1px solid var(--border)",
    color: "var(--text2)", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
    transition: "all 0.15s",
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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              style={{ ...iconBtn, fontWeight: 700, fontSize: 12, letterSpacing: "0.02em" }}
              title="تغییر زبان / Change Language"
            >
              {lang === "en" ? "FA" : "EN"}
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={iconBtn} title={isDark ? "حالت روز" : "حالت شب"}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link href="/auth/login" className="btn-ghost nav-desktop" style={{ padding: "9px 18px", fontSize: 14 }}>
              {lang === "fa" ? "ورود" : "Log In"}
            </Link>
            <Link href="/auth/register" className="btn-neon nav-desktop" style={{ padding: "9px 18px", fontSize: 14 }}>
              {lang === "fa" ? "شروع رایگان" : "Get Started"}
            </Link>
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
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button onClick={() => setLang(lang === "en" ? "fa" : "en")} style={{ ...iconBtn, flex: 1, fontSize: 12, fontWeight: 700 }}>
                  {lang === "en" ? "فارسی" : "English"}
                </button>
                <button onClick={toggleTheme} style={{ ...iconBtn, flex: 1 }}>
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/auth/login" className="btn-ghost" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                  {lang === "fa" ? "ورود" : "Log In"}
                </Link>
                <Link href="/auth/register" className="btn-neon" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                  {lang === "fa" ? "شروع رایگان" : "Get Started Free"}
                </Link>
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
