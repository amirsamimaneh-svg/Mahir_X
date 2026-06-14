"use client";

export function Footer() {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", paddingBlock: "48px 32px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "linear-gradient(135deg, var(--brand) 0%, var(--neon) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color: "#070B14",
              }}>X</div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>
                Mahir<span style={{ color: "var(--neon)" }}>X</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text3)", maxWidth: "26ch", lineHeight: 1.65 }}>
              AI-powered crypto intelligence for modern traders.
            </p>
          </div>

          {/* Link Groups */}
          <div style={{ display: "flex", gap: 52, flexWrap: "wrap" }}>
            {[
              { title: "Product", links: ["Features", "Pricing", "Signals", "AI Chat", "Whale Tracker"] },
              { title: "Company",  links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal",   links: ["Terms of Service", "Privacy Policy", "Disclaimer"] },
            ].map(g => (
              <div key={g.title}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>{g.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {g.links.map(l => (
                    <a
                      key={l} href="#"
                      style={{ fontSize: 14, color: "var(--text2)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
          paddingTop: 24, borderTop: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>© 2026 Mahir X. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "var(--text3)", maxWidth: "56ch", textAlign: "right" }}>
            ⚠️ This platform does not provide financial advice. Crypto trading involves substantial risk of loss.
          </p>
        </div>
      </div>
    </footer>
  );
}
