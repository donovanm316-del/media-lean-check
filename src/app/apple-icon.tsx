import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#18181b",
        }}
      >
        <div
          style={{
            width: 124,
            height: 34,
            borderRadius: 999,
            background: "linear-gradient(90deg, #3b82f6 0%, #a1a1aa 50%, #ef4444 100%)",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 74,
              width: 22,
              height: 56,
              borderRadius: 999,
              background: "#fafafa",
              boxShadow: "0 0 0 6px #18181b",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
