import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          background: "#36626c",
          color: "#ffffff",
          fontSize: 160,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        MS
      </div>
    ),
    { ...size }
  );
}
