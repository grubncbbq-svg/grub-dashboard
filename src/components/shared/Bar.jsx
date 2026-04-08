import { C } from "../../lib/theme.js";

export default function Bar({ label, value, pct, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 12, color: C.dim }}>{label}</span>
        <span style={{ fontSize: 12, color: C.white }}>{value}</span>
      </div>
      <div
        style={{
          height: 6,
          background: C.bg,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              color || `linear-gradient(90deg, ${C.accent}, ${C.accentDim})`,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}
