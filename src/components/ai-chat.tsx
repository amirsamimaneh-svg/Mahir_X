"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/language";
import { t } from "@/lib/translations";

type Message = { role: "user" | "assistant"; content: string };

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "14px 18px" }}>
      {[0, 1, 2].map(i => (
        <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13 }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", display: "block", opacity: 0.7 }} />
      ))}
    </div>
  );
}

export function AIChat() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { lang } = useLanguage();
  const ta = t.aiChat;

  const WELCOME = lang === "fa"
    ? "سلام! 👋 من مشاور هوشمند ماهیر هستم.\n\nپروژه یا کسب‌وکارتون رو برام توضیح بدید تا بهترین خدمات ماهیر رو بهتون معرفی کنم."
    : "Hi! 👋 I'm MAHIR's AI consultant.\n\nTell me about your project or business and I'll recommend the best MAHIR services for you.";

  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: WELCOME }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (res.status === 503) throw new Error("api_key_missing");
      if (!res.ok || !res.body) throw new Error("API error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      setLoading(false);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: assistantText }; return u; });
      }
    } catch (err) {
      setLoading(false);
      const isKeyMissing = err instanceof Error && err.message === "api_key_missing";
      setMessages(prev => [...prev, { role: "assistant", content: isKeyMissing ? ta.errorKey[lang] : ta.errorGen[lang] }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const reset = () => { setMessages([{ role: "assistant", content: WELCOME }]); setInput(""); };

  const suggestions = [ta.suggestions.s1[lang], ta.suggestions.s2[lang], ta.suggestions.s3[lang]];

  return (
    <section id="ai-chat" ref={ref} className="section-pad" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} style={{ marginBottom: 16, textAlign: "center" }}>
          <span className="badge">{ta.badge[lang]}</span>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }} className="ai-chat-grid">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display"
              style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 16 }}
            >
              {ta.h2[lang]}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.75, marginBottom: 36 }}
            >
              {ta.p[lang]}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(["f1", "f2", "f3"] as const).map((key, i) => (
                <div key={key} style={{ display: "flex", gap: 14, padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)" }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{["🎯", "💡", "🚀"][i]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{ta.features[key].title[lang]}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>{ta.features[key].desc[lang]}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.25 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", height: 520 }}
          >
            <div style={{ padding: "14px 18px", background: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>M</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{ta.header[lang]}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                    {ta.online[lang]}
                  </div>
                </div>
              </div>
              <button onClick={reset} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#fff", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
                {ta.reset[lang]}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12, background: "var(--bg2)" }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    {msg.role === "assistant" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "var(--brand)", marginLeft: 8, alignSelf: "flex-end", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>M</div>
                    )}
                    <div style={{ maxWidth: "78%" }}>
                      <div style={{ padding: "11px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "var(--brand)" : "var(--surface)", color: msg.role === "user" ? "#fff" : "var(--text)", fontSize: 13, lineHeight: 1.65, border: msg.role === "assistant" ? "1px solid var(--border)" : "none", direction: lang === "fa" ? "rtl" : "ltr", whiteSpace: "pre-wrap" }}>
                        {msg.content || (msg.role === "assistant" ? <TypingDots /> : null)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--brand)", marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>M</div>
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px" }}><TypingDots /></div>
                </motion.div>
              )}

              {messages.length === 1 && !loading && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {suggestions.map(s => (
                    <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                      style={{ background: "none", border: "1.5px solid var(--border)", borderRadius: 12, padding: "9px 14px", cursor: "pointer", textAlign: lang === "fa" ? "right" : "left", fontSize: 12, color: "var(--text2)", fontFamily: "inherit", transition: "border-color 0.2s, color 0.2s", direction: lang === "fa" ? "rtl" : "ltr" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
                    >{s} ↗</button>
                  ))}
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, background: "var(--surface)" }}>
              <textarea ref={textareaRef} rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={ta.placeholder[lang]} dir={lang === "fa" ? "rtl" : "ltr"}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--bg2)", fontSize: 13, color: "var(--text)", outline: "none", fontFamily: "inherit", resize: "none", transition: "border-color 0.2s", lineHeight: 1.5, minHeight: 40 }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button onClick={send} disabled={!input.trim() || loading}
                style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: input.trim() && !loading ? "var(--brand)" : "var(--bg2)", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", color: input.trim() && !loading ? "#fff" : "var(--text3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, color 0.2s", alignSelf: "flex-end" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media (max-width: 980px) { .ai-chat-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
