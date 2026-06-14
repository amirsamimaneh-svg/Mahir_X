import { NextResponse } from "next/server";

const BASE = "https://api.coingecko.com/api/v3/coins/markets";
const PARAMS =
  "vs_currency=usd&order=market_cap_desc&per_page=100&page=1" +
  "&sparkline=true&price_change_percentage=1h%2C24h%2C7d";

/* Simple in-memory cache: refresh every 30 s */
let cache: { data: unknown; ts: number } | null = null;

export async function GET() {
  /* Serve cache if fresh */
  if (cache && Date.now() - cache.ts < 30_000) {
    return NextResponse.json(cache.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  const apiKey = process.env.COINGECKO_API_KEY ?? "";
  const headers: Record<string, string> = {
    "Accept": "application/json",
  };
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  try {
    const res = await fetch(`${BASE}?${PARAMS}`, {
      headers,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `CoinGecko returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    cache = { data, ts: Date.now() };
    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 502 }
    );
  }
}
