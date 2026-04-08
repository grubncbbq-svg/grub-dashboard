import { C, cardStyle } from "../../lib/theme.js";
import { fmt } from "../../lib/format.js";
import { SALES_2025, SALES_Q1_2026, TENDERS_2025, MONTHLY_EST } from "../../data/sales.js";
import KPICard from "../shared/KPICard.jsx";
import Bar from "../shared/Bar.jsx";

export default function OverviewTab() {
  const mx = Math.max(...MONTHLY_EST.map((m) => m.v));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <KPICard
          label="Q1 '26 Net"
          value={fmt(SALES_Q1_2026.net)}
          sub={`${fmt(SALES_Q1_2026.monthly_avg)}/mo`}
        />
        <KPICard
          label="2025 Full Year"
          value={fmt(SALES_2025.net)}
          sub={`${fmt(Math.round(SALES_2025.net / 5))}/mo`}
        />
        <KPICard label="YoY Growth" value="~5x" ac={C.green} />
      </div>

      <div style={cardStyle}>
        <div
          style={{
            fontSize: 12,
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 16,
          }}
        >
          Monthly Sales
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 130,
          }}
        >
          {MONTHLY_EST.map((m, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 9, color: C.white }}>{fmt(m.v)}</span>
              <div
                style={{
                  width: "100%",
                  maxWidth: 40,
                  borderRadius: 4,
                  height: `${(m.v / mx) * 100}px`,
                  background: m.proj
                    ? `repeating-linear-gradient(45deg, ${C.accentDim}, ${C.accentDim} 2px, transparent 2px, transparent 6px)`
                    : `linear-gradient(180deg, ${C.accent}, ${C.accentDim})`,
                  border: m.proj ? `1px dashed ${C.accent}` : "none",
                }}
              />
              <span style={{ fontSize: 9, color: C.dim }}>{m.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            fontSize: 12,
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 16,
          }}
        >
          2025 Payment Mix
        </div>
        {TENDERS_2025.map((t, i) => (
          <Bar key={i} label={t.name} value={fmt(t.amount)} pct={t.pct} />
        ))}
      </div>
    </div>
  );
}
