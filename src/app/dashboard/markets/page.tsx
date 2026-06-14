"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  sparkline_in_7d: { price: number[] } | null;
  circulating_supply: number;
}

type SortKey = "market_cap_rank" | "current_price" | "price_change_percentage_1h_in_currency" | "price_change_percentage_24h_in_currency" | "price_change_percentage_7d_in_currency" | "market_cap" | "total_volume";
type SortDir = "asc" | "desc";

/* ── Helpers ── */
function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (n >= 1)    return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(6)}`;
}

function PctCell({ v }: { v: number | null }) {
  if (v === null || isNaN(v)) return <span style={{ color: "var(--text3)" }}>—</span>;
  const pos = v >= 0;
  return (
    <span style={{ color: pos ? "var(--bull)" : "var(--bear)", fontWeight: 700 }}>
      {pos ? "+" : ""}{v.toFixed(2)}%
    </span>
  );
}

/* ── Sparkline ── */
function Sparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  if (!prices || prices.length < 2) return <div style={{ width: 80, height: 32 }} />;
  const pts = prices.filter((_, i) => i % Math.ceil(prices.length / 40) === 0).slice(-40);
  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const W = 80, H = 32;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W);
  const ys = pts.map(p => H - ((p - min) / range) * (H - 4) - 2);
  const d    = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fill = d + ` L${W},${H} L0,${H} Z`;
  const color = positive ? "var(--bull)" : "var(--bear)";
  return (
    <svg width={W} height={H}>
      <defs>
        <linearGradient id={`sp-${positive ? "b" : "r"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sp-${positive ? "b" : "r"})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Server-side proxy (keeps API key secret, adds caching) ── */
const API_URL = "/api/markets";

/* ── Fallback mock data ── */
const MOCK: Coin[] = [
  { id:"bitcoin",    symbol:"btc",  name:"Bitcoin",       image:"", current_price:66842,  market_cap:1314000000000, market_cap_rank:1,  total_volume:38200000000,  price_change_percentage_1h_in_currency:0.31,  price_change_percentage_24h_in_currency:2.4,   price_change_percentage_7d_in_currency:8.2,   circulating_supply:19700000,  sparkline_in_7d:{price:Array.from({length:168},(_,i)=>60000+Math.sin(i*0.15)*4000+i*40)} },
  { id:"ethereum",   symbol:"eth",  name:"Ethereum",      image:"", current_price:3481,   market_cap:418000000000,  market_cap_rank:2,  total_volume:18900000000,  price_change_percentage_1h_in_currency:-0.12, price_change_percentage_24h_in_currency:1.8,   price_change_percentage_7d_in_currency:5.1,   circulating_supply:120200000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>3100+Math.sin(i*0.18)*200+i*2.2)} },
  { id:"binancecoin",symbol:"bnb",  name:"BNB",           image:"", current_price:618,    market_cap:90000000000,   market_cap_rank:3,  total_volume:2100000000,   price_change_percentage_1h_in_currency:-0.41, price_change_percentage_24h_in_currency:-0.6,  price_change_percentage_7d_in_currency:3.2,   circulating_supply:145000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>590+Math.sin(i*0.12)*20+i*0.17)} },
  { id:"solana",     symbol:"sol",  name:"Solana",        image:"", current_price:174.2,  market_cap:81000000000,   market_cap_rank:4,  total_volume:4800000000,   price_change_percentage_1h_in_currency:0.82,  price_change_percentage_24h_in_currency:4.1,   price_change_percentage_7d_in_currency:12.4,  circulating_supply:464000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>148+Math.sin(i*0.22)*14+i*0.16)} },
  { id:"ripple",     symbol:"xrp",  name:"XRP",           image:"", current_price:0.612,  market_cap:35000000000,   market_cap_rank:5,  total_volume:2200000000,   price_change_percentage_1h_in_currency:0.12,  price_change_percentage_24h_in_currency:1.2,   price_change_percentage_7d_in_currency:-2.1,  circulating_supply:57000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.62+Math.sin(i*0.19)*0.04-i*0.0003)} },
  { id:"cardano",    symbol:"ada",  name:"Cardano",       image:"", current_price:0.495,  market_cap:17500000000,   market_cap_rank:6,  total_volume:620000000,    price_change_percentage_1h_in_currency:-0.22, price_change_percentage_24h_in_currency:-1.2,  price_change_percentage_7d_in_currency:-4.3,  circulating_supply:35000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.53+Math.sin(i*0.21)*0.03-i*0.0002)} },
  { id:"avalanche",  symbol:"avax", name:"Avalanche",     image:"", current_price:38.5,   market_cap:15800000000,   market_cap_rank:7,  total_volume:820000000,    price_change_percentage_1h_in_currency:0.55,  price_change_percentage_24h_in_currency:3.3,   price_change_percentage_7d_in_currency:9.8,   circulating_supply:410000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>33+Math.sin(i*0.24)*3+i*0.033)} },
  { id:"chainlink",  symbol:"link", name:"Chainlink",     image:"", current_price:14.1,   market_cap:8800000000,    market_cap_rank:8,  total_volume:480000000,    price_change_percentage_1h_in_currency:0.31,  price_change_percentage_24h_in_currency:2.8,   price_change_percentage_7d_in_currency:6.2,   circulating_supply:620000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>12.8+Math.sin(i*0.17)*0.8+i*0.008)} },
  { id:"polkadot",   symbol:"dot",  name:"Polkadot",      image:"", current_price:8.42,   market_cap:11200000000,   market_cap_rank:9,  total_volume:380000000,    price_change_percentage_1h_in_currency:-0.08, price_change_percentage_24h_in_currency:0.9,   price_change_percentage_7d_in_currency:2.1,   circulating_supply:1330000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>8.1+Math.sin(i*0.13)*0.4+i*0.002)} },
  { id:"toncoin",    symbol:"ton",  name:"Toncoin",       image:"", current_price:6.84,   market_cap:17200000000,   market_cap_rank:10, total_volume:310000000,    price_change_percentage_1h_in_currency:0.44,  price_change_percentage_24h_in_currency:2.1,   price_change_percentage_7d_in_currency:7.4,   circulating_supply:2500000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>6.2+Math.sin(i*0.19)*0.4+i*0.004)} },
  { id:"shiba-inu",  symbol:"shib", name:"Shiba Inu",     image:"", current_price:0.0000248,market_cap:14600000000, market_cap_rank:11, total_volume:780000000,    price_change_percentage_1h_in_currency:0.72,  price_change_percentage_24h_in_currency:3.8,   price_change_percentage_7d_in_currency:14.2,  circulating_supply:589000000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.0000208+Math.sin(i*0.3)*0.000002+i*0.00000002)} },
  { id:"dogecoin",   symbol:"doge", name:"Dogecoin",      image:"", current_price:0.168,  market_cap:24200000000,   market_cap_rank:12, total_volume:2100000000,   price_change_percentage_1h_in_currency:0.18,  price_change_percentage_24h_in_currency:1.6,   price_change_percentage_7d_in_currency:5.9,   circulating_supply:143000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.152+Math.sin(i*0.2)*0.01+i*0.0001)} },
  { id:"polygon",    symbol:"matic",name:"Polygon",       image:"", current_price:0.892,  market_cap:8200000000,    market_cap_rank:13, total_volume:520000000,    price_change_percentage_1h_in_currency:-0.31, price_change_percentage_24h_in_currency:-0.8,  price_change_percentage_7d_in_currency:1.4,   circulating_supply:9200000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.87+Math.sin(i*0.16)*0.04-i*0.0001)} },
  { id:"uniswap",    symbol:"uni",  name:"Uniswap",       image:"", current_price:10.84,  market_cap:8100000000,    market_cap_rank:14, total_volume:290000000,    price_change_percentage_1h_in_currency:0.21,  price_change_percentage_24h_in_currency:1.9,   price_change_percentage_7d_in_currency:4.8,   circulating_supply:750000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>10.1+Math.sin(i*0.23)*0.5+i*0.005)} },
  { id:"litecoin",   symbol:"ltc",  name:"Litecoin",      image:"", current_price:84.2,   market_cap:6300000000,    market_cap_rank:15, total_volume:480000000,    price_change_percentage_1h_in_currency:0.09,  price_change_percentage_24h_in_currency:1.1,   price_change_percentage_7d_in_currency:3.2,   circulating_supply:74000000,  sparkline_in_7d:{price:Array.from({length:168},(_,i)=>80+Math.sin(i*0.14)*3+i*0.025)} },
  { id:"arbitrum",   symbol:"arb",  name:"Arbitrum",      image:"", current_price:1.24,   market_cap:4900000000,    market_cap_rank:16, total_volume:310000000,    price_change_percentage_1h_in_currency:0.44,  price_change_percentage_24h_in_currency:3.1,   price_change_percentage_7d_in_currency:11.2,  circulating_supply:3900000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>1.08+Math.sin(i*0.26)*0.08+i*0.001)} },
  { id:"optimism",   symbol:"op",   name:"Optimism",      image:"", current_price:2.48,   market_cap:3100000000,    market_cap_rank:17, total_volume:210000000,    price_change_percentage_1h_in_currency:0.62,  price_change_percentage_24h_in_currency:4.2,   price_change_percentage_7d_in_currency:13.8,  circulating_supply:1250000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>2.1+Math.sin(i*0.28)*0.15+i*0.0022)} },
  { id:"sui",        symbol:"sui",  name:"Sui",           image:"", current_price:3.82,   market_cap:9800000000,    market_cap_rank:18, total_volume:840000000,    price_change_percentage_1h_in_currency:1.12,  price_change_percentage_24h_in_currency:6.8,   price_change_percentage_7d_in_currency:22.4,  circulating_supply:2560000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>2.8+Math.sin(i*0.3)*0.3+i*0.006)} },
  { id:"aptos",      symbol:"apt",  name:"Aptos",         image:"", current_price:9.14,   market_cap:4200000000,    market_cap_rank:19, total_volume:380000000,    price_change_percentage_1h_in_currency:0.88,  price_change_percentage_24h_in_currency:5.1,   price_change_percentage_7d_in_currency:15.6,  circulating_supply:459000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>7.6+Math.sin(i*0.27)*0.6+i*0.009)} },
  { id:"near",       symbol:"near", name:"NEAR Protocol",  image:"", current_price:6.28,  market_cap:7400000000,    market_cap_rank:20, total_volume:420000000,    price_change_percentage_1h_in_currency:0.34,  price_change_percentage_24h_in_currency:2.4,   price_change_percentage_7d_in_currency:8.1,   circulating_supply:1180000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>5.7+Math.sin(i*0.22)*0.35+i*0.0036)} },
  { id:"stellar",    symbol:"xlm",  name:"Stellar",       image:"", current_price:0.128,  market_cap:3600000000,    market_cap_rank:21, total_volume:180000000,    price_change_percentage_1h_in_currency:-0.15, price_change_percentage_24h_in_currency:0.6,   price_change_percentage_7d_in_currency:-1.2,  circulating_supply:28000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.127+Math.sin(i*0.18)*0.006+i*0.000005)} },
  { id:"injective",  symbol:"inj",  name:"Injective",     image:"", current_price:28.4,   market_cap:2600000000,    market_cap_rank:22, total_volume:290000000,    price_change_percentage_1h_in_currency:1.24,  price_change_percentage_24h_in_currency:7.2,   price_change_percentage_7d_in_currency:19.4,  circulating_supply:91000000,  sparkline_in_7d:{price:Array.from({length:168},(_,i)=>22+Math.sin(i*0.31)*2.5+i*0.038)} },
  { id:"cosmos",     symbol:"atom", name:"Cosmos Hub",    image:"", current_price:9.84,   market_cap:3800000000,    market_cap_rank:23, total_volume:220000000,    price_change_percentage_1h_in_currency:0.18,  price_change_percentage_24h_in_currency:1.4,   price_change_percentage_7d_in_currency:3.8,   circulating_supply:387000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>9.2+Math.sin(i*0.2)*0.5+i*0.004)} },
  { id:"filecoin",   symbol:"fil",  name:"Filecoin",      image:"", current_price:6.14,   market_cap:3200000000,    market_cap_rank:24, total_volume:210000000,    price_change_percentage_1h_in_currency:-0.42, price_change_percentage_24h_in_currency:-1.8,  price_change_percentage_7d_in_currency:-5.2,  circulating_supply:520000000, sparkline_in_7d:{price:Array.from({length:168},(_,i)=>6.8+Math.sin(i*0.16)*0.4-i*0.004)} },
  { id:"hedera",     symbol:"hbar", name:"Hedera",        image:"", current_price:0.0984, market_cap:3900000000,    market_cap_rank:25, total_volume:140000000,    price_change_percentage_1h_in_currency:0.22,  price_change_percentage_24h_in_currency:1.8,   price_change_percentage_7d_in_currency:6.4,   circulating_supply:39000000000,sparkline_in_7d:{price:Array.from({length:168},(_,i)=>0.088+Math.sin(i*0.25)*0.006+i*0.000063)} },
];

const SYMBOL_ICONS: Record<string, string> = {
  btc:"₿", eth:"Ξ", bnb:"⬡", sol:"◎", xrp:"✕", ada:"₳", avax:"▲",
  link:"⬡", dot:"●", ton:"◈", shib:"🐕", doge:"Ð", matic:"⬡", uni:"🦄",
  ltc:"Ł", arb:"◎", op:"🔴", sui:"◈", apt:"▲", near:"◎", xlm:"★",
  inj:"◈", atom:"⚛", fil:"◈", hbar:"ℏ",
};

export default function MarketsPage() {
  const [coins, setCoins]         = useState<Coin[]>(MOCK);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<SortKey>("market_cap_rank");
  const [sortDir, setSortDir]     = useState<SortDir>("asc");
  const [page, setPage]           = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCoins = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data?.error ?? "Not an array");
      setCoins(data as Coin[]);
      setError(false);
      setLastUpdate(new Date());
    } catch {
      if (!silent) {
        setCoins(MOCK);
        setError(true);
      }
      if (!lastUpdate) setLastUpdate(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lastUpdate]);

  useEffect(() => {
    fetchCoins();
    intervalRef.current = setInterval(() => fetchCoins(true), 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []); // eslint-disable-line

  /* Derived list */
  const filtered = coins
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const perPage  = 25;
  const pageList = filtered.slice(0, page * perPage);
  const hasMore  = pageList.length < filtered.length;

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "market_cap_rank" ? "asc" : "desc"); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span style={{ color: "var(--text3)", fontSize: 9 }}>↕</span>;
    return <span style={{ color: "var(--accent)", fontSize: 9 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  /* Market summary stats */
  const totalMcap    = coins.reduce((s, c) => s + c.market_cap, 0);
  const totalVolume  = coins.reduce((s, c) => s + c.total_volume, 0);
  const btc          = coins.find(c => c.id === "bitcoin");
  const btcDominance = btc ? ((btc.market_cap / totalMcap) * 100).toFixed(1) : "—";
  const gainers      = coins.filter(c => (c.price_change_percentage_24h_in_currency ?? 0) > 0).length;

  return (
    <div style={{ padding: "24px 28px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Markets</h1>
            {refreshing && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: "var(--accent-dim)", color: "var(--accent)", letterSpacing: "0.05em" }}>
                ↻ Refreshing
              </span>
            )}
            {!error && !loading && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
                background: "rgba(0,200,150,0.12)", border: "1px solid rgba(0,200,150,0.3)", color: "var(--bull)",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>● LIVE</span>
            )}
            {error && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
                ⚠ Demo data
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>
            {filtered.length} assets · Auto-refresh 30s
            {lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search coin..."
              className="input-field"
              style={{ width: 200, paddingLeft: 32, fontSize: 13 }}
            />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 13 }}>🔍</span>
          </div>
          <button
            onClick={() => fetchCoins()}
            style={{
              padding: "9px 14px", borderRadius: 10, border: "1.5px solid var(--border)",
              background: "var(--surface2)", color: "var(--text2)", cursor: "pointer", fontSize: 13, fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
          >↻</button>
        </div>
      </div>

      {/* ── Market stats bar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Total Market Cap",  value: fmt(totalMcap),   color: "var(--text)"   },
          { label: "24h Volume",        value: fmt(totalVolume),  color: "var(--text)"   },
          { label: "BTC Dominance",     value: `${btcDominance}%`, color: "var(--accent)" },
          { label: "24h Gainers",       value: `${gainers} / ${coins.length}`, color: "var(--bull)" },
          { label: "BTC Price",         value: btc ? fmtPrice(btc.current_price) : "—", color: "var(--text)" },
          { label: "BTC 24h",           value: btc ? `${(btc.price_change_percentage_24h_in_currency ?? 0) >= 0 ? "+" : ""}${(btc.price_change_percentage_24h_in_currency ?? 0).toFixed(2)}%` : "—", color: (btc?.price_change_percentage_24h_in_currency ?? 0) >= 0 ? "var(--bull)" : "var(--bear)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px" }}
          >
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>{stat.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, letterSpacing: "-0.02em" }}>{loading && !coins.length ? "—" : stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ width: 48, cursor: "pointer" }} onClick={() => toggleSort("market_cap_rank")}>
                  # <SortIcon k="market_cap_rank" />
                </th>
                <th>Coin</th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("current_price")}>
                  Price <SortIcon k="current_price" />
                </th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_1h_in_currency")}>
                  1H <SortIcon k="price_change_percentage_1h_in_currency" />
                </th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_24h_in_currency")}>
                  24H <SortIcon k="price_change_percentage_24h_in_currency" />
                </th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("price_change_percentage_7d_in_currency")}>
                  7D <SortIcon k="price_change_percentage_7d_in_currency" />
                </th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("market_cap")}>
                  Market Cap <SortIcon k="market_cap" />
                </th>
                <th style={{ cursor: "pointer", textAlign: "right" }} onClick={() => toggleSort("total_volume")}>
                  Volume 24H <SortIcon k="total_volume" />
                </th>
                <th style={{ textAlign: "right" }}>7D Chart</th>
              </tr>
            </thead>
            <tbody>
              {loading && !coins.length ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j}><div style={{ height: 14, background: "var(--surface3)", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} /></td>
                    ))}
                  </tr>
                ))
              ) : (
                pageList.map((coin, i) => {
                  const pos24 = (coin.price_change_percentage_24h_in_currency ?? 0) >= 0;
                  const icon  = SYMBOL_ICONS[coin.symbol] ?? coin.symbol.slice(0, 2).toUpperCase();
                  return (
                    <motion.tr
                      key={coin.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.015, 0.3) }}
                    >
                      {/* Rank */}
                      <td style={{ color: "var(--text3)", fontWeight: 600, fontSize: 12 }}>{coin.market_cap_rank}</td>

                      {/* Coin */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                            background: pos24 ? "rgba(0,200,150,0.12)" : "rgba(255,77,79,0.08)",
                            border: `1px solid ${pos24 ? "rgba(0,200,150,0.2)" : "rgba(255,77,79,0.15)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 800, overflow: "hidden",
                          }}>
                            {coin.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={coin.image} alt={coin.symbol} width={24} height={24} style={{ borderRadius: "50%" }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <span style={{ color: pos24 ? "var(--bull)" : "var(--bear)" }}>{icon}</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{coin.name}</div>
                            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600 }}>{coin.symbol}</div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ textAlign: "right", fontWeight: 800, fontSize: 13, color: "var(--text)" }}>
                        {fmtPrice(coin.current_price)}
                      </td>

                      {/* 1H */}
                      <td style={{ textAlign: "right", fontSize: 12 }}>
                        <PctCell v={coin.price_change_percentage_1h_in_currency} />
                      </td>

                      {/* 24H */}
                      <td style={{ textAlign: "right", fontSize: 13 }}>
                        <PctCell v={coin.price_change_percentage_24h_in_currency} />
                      </td>

                      {/* 7D */}
                      <td style={{ textAlign: "right", fontSize: 12 }}>
                        <PctCell v={coin.price_change_percentage_7d_in_currency} />
                      </td>

                      {/* Market Cap */}
                      <td style={{ textAlign: "right", fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>
                        {fmt(coin.market_cap)}
                      </td>

                      {/* Volume */}
                      <td style={{ textAlign: "right", fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>
                        {fmt(coin.total_volume)}
                      </td>

                      {/* Sparkline */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Sparkline
                            prices={coin.sparkline_in_7d?.price ?? []}
                            positive={pos24}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMore && (
          <div style={{ padding: "16px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
            <button
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: "9px 28px", borderRadius: 10, border: "1.5px solid var(--border)",
                background: "var(--surface2)", color: "var(--text2)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; }}
            >
              Load more · {filtered.length - pageList.length} remaining
            </button>
          </div>
        )}
      </div>

      {search && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>No results for &quot;{search}&quot;</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
