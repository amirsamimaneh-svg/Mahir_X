"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface AISignal {
  id: string;
  asset: string;
  type: "LONG" | "SHORT";
  entry: string;
  sl: string;
  tp: string;
  confidence: number;
  summary: string;
  timestamp: number;
  read: boolean;
}

interface SignalContextType {
  signals: AISignal[];
  unreadCount: number;
  latestSignal: AISignal | null;
  addSignal: (signal: Omit<AISignal, "id" | "timestamp" | "read">) => void;
  markAllRead: () => void;
  clearLatest: () => void;
}

const SignalContext = createContext<SignalContextType>({
  signals: [],
  unreadCount: 0,
  latestSignal: null,
  addSignal: () => {},
  markAllRead: () => {},
  clearLatest: () => {},
});

const STORAGE_KEY = "mahirx_ai_signals_v1";

function load(): AISignal[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function save(signals: AISignal[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(signals.slice(0, 100))); } catch {}
}

export function SignalProvider({ children }: { children: React.ReactNode }) {
  const [signals, setSignals]           = useState<AISignal[]>([]);
  const [latestSignal, setLatestSignal] = useState<AISignal | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setSignals(load());
    }
  }, []);

  const addSignal = useCallback((data: Omit<AISignal, "id" | "timestamp" | "read">) => {
    const sig: AISignal = {
      ...data,
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      read: false,
    };

    setSignals(prev => { const updated = [sig, ...prev]; save(updated); return updated; });
    setLatestSignal(sig);

    /* Browser push notification */
    if (typeof window !== "undefined" && "Notification" in window) {
      const push = () => {
        try {
          new Notification(`🎯 ${sig.type} Signal — ${sig.asset}`, {
            body: `Entry: ${sig.entry}  |  SL: ${sig.sl}  |  TP: ${sig.tp}\n${sig.confidence}% confidence`,
            tag: sig.id,
          });
        } catch {}
      };
      if (Notification.permission === "granted") push();
      else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(p => { if (p === "granted") push(); });
      }
    }
  }, []);

  const markAllRead = useCallback(() => {
    setSignals(prev => { const u = prev.map(s => ({ ...s, read: true })); save(u); return u; });
  }, []);

  const clearLatest = useCallback(() => setLatestSignal(null), []);

  return (
    <SignalContext.Provider value={{
      signals,
      unreadCount: signals.filter(s => !s.read).length,
      latestSignal,
      addSignal,
      markAllRead,
      clearLatest,
    }}>
      {children}
    </SignalContext.Provider>
  );
}

export function useSignals() { return useContext(SignalContext); }
