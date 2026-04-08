import { C, cardStyle } from "../../lib/theme.js";

export default function KPICard({ label, value, sub, ac }) {
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: 130 }}>
      <div
        style={{
          fontSize: 10,
          color: C.dim,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: ac || C.accent,
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}
