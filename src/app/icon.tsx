import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 12,
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
              left: 26,
              width: 8,
              height: 20,
              borderRadius: 999,
              background: "#fafafa",
              boxShadow: "0 0 0 2px #18181b",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
