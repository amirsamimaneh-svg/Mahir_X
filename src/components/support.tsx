"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  from: "user" | "admin";
  text: string;
  time: string;
};

const autoReplies = [
  "ممنون از پیامتون! تیم ما در اسرع وقت پاسخ می‌دن. معمولاً تا ۱ ساعت جواب میدیم 🙏",
  "پیامتون رسید! اگه فوریه می‌تونید از ایمیل hello@mahir.studio هم استفاده کنید.",
  "متشکریم که تماس گرفتید. تیم پشتیبانی ما آنلاینه و به زودی پاسخ میده ✅",
];

function getTime() {
  return new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "admin", text: "سلام! 👋 چطور می‌تونم کمکتون کنم؟", time: getTime() },
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), from: "user", text, time: getTime() };
    setMessages(m => [...m, userMsg]);

    setTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setTyping(false);

    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    const adminMsg: Message = { id: Date.now() + 1, from: "admin", text: reply, time: getTime() };
    setMessages(m => [...m, adminMsg]);

    if (!open) setUnread(u => u + 1);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: "fixed", bottom: 28, left: 28, zIndex: 500,
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--brand)", color: "#fff", border: "none",
          cursor: "pointer", boxShadow: "0 8px 32px rgba(91,45,212,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            )}
          </motion.span>
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{
                position: "absolute", top: -4, right: -4,
                width: 20, height: 20, borderRadius: "50%",
                background: "#ef4444", color: "#fff",
                fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--bg)",
              }}
            >{unread}</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", bottom: 96, left: 28, zIndex: 500,
              width: "min(360px, calc(100vw - 40px))",
              background: "var(--surface)", borderRadius: 20,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              display: "flex", flexDirection: "column",
              overflow: "hidden", maxHeight: "70vh",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              background: "var(--brand)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff",
              }}>M</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>MAHIR Support</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  آنلاین · پاسخ سریع
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "16px 16px 8px",
              display: "flex", flexDirection: "column", gap: 10,
              background: "var(--bg2)",
            }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.from === "admin" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "var(--brand)", marginLeft: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 11, color: "#fff", alignSelf: "flex-end",
                    }}>M</div>
                  )}
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{
                      padding: "10px 14px", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.from === "user" ? "var(--brand)" : "var(--surface)",
                      color: msg.from === "user" ? "#fff" : "var(--text)",
                      fontSize: 13, lineHeight: 1.5,
                      border: msg.from === "admin" ? "1px solid var(--border)" : "none",
                      boxShadow: "var(--shadow-sm)",
                      direction: "rtl",
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3, textAlign: msg.from === "user" ? "right" : "left", paddingInline: 4 }}>
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "var(--brand)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 11, color: "#fff",
                    }}>M</div>
                    <div style={{
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: "18px 18px 18px 4px", padding: "10px 16px",
                      display: "flex", gap: 4, alignItems: "center",
                    }}>
                      {[0, 1, 2].map(i => (
                        <motion.span key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text3)", display: "block" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "12px 16px", borderTop: "1px solid var(--border)",
              display: "flex", gap: 8, background: "var(--surface)",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="پیام بنویسید..."
                dir="rtl"
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 12,
                  border: "1.5px solid var(--border)", background: "var(--bg2)",
                  fontSize: 13, color: "var(--text)", outline: "none",
                  fontFamily: "inherit", transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: input.trim() ? "var(--brand)" : "var(--bg2)",
                  border: "none", cursor: input.trim() ? "pointer" : "default",
                  color: input.trim() ? "#fff" : "var(--text3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Support() {
  return <ChatWidget />;
}
