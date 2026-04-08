import { useState } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { fmt } from "../../lib/format.js";
import { EXPENSES } from "../../data/expenses.js";
import { SALES_Q1_2026 } from "../../data/sales.js";
import KPICard from "../shared/KPICard.jsx";

export default function ExpensesTab() {
  const [exp, setExp] = useState(EXPENSES);
  const tot = exp.reduce((s, e) => s + e.amount, 0);
  const net = SALES_Q1_2026.monthly_avg - tot;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <KPICard label="Monthly Fixed" value={fmt(tot)} />
        <KPICard label="Annual" value={fmt(tot * 12)} />
        <KPICard
          label="Net After Fixed"
          value={fmt(net)}
          ac={net > 0 ? C.green : C.red}
          sub="Before food cost"
        />
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
          Monthly Expenses
        </div>
        {exp.map((e, i) => {
          const p = ((e.amount / tot) * 100).toFixed(0);
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 13, color: C.white }}>
                  {e.name}
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {e.editable ? (
                    <input
                      type="number"
                      value={e.amount}
                      onChange={(ev) => {
                        const u = [...exp];
                        u[i] = {
                          ...u[i],
                          amount: Number(ev.target.value) || 0,
                        };
                        setExp(u);
                      }}
                      style={{
                        width: 70,
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        color: C.accent,
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 13,
                        textAlign: "right",
                        outline: "none",
                        fontFamily: "inherit",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 13, color: C.accent }}>
                      {fmt(e.amount)}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: C.dim }}>({p}%)</span>
                </div>
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
                    width: `${p}%`,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accentDim})`,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
