import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0533 50%, #0a0a0a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              background: "linear-gradient(135deg, #a78bfa, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            ماهیر
          </span>
        </div>
        <p style={{ color: "#a3a3a3", fontSize: 32, margin: 0, textAlign: "center" }}>
          یاد بگیر، رشد کن، بدرخش
        </p>
      </div>
    ),
    { ...size }
  );
}
