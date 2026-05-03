import { C, cardStyle } from "../../lib/theme.js";
import { fmtD } from "../../lib/format.js";
import { TARGET_FC } from "../../data/menu.js";
import { getAllFoodCosts } from "../../lib/foodCostCalc.js";

const fcColor = (pct) =>
  pct <= TARGET_FC ? C.green : pct <= TARGET_FC + 5 ? C.accent : C.red;

export default function FoodCostTab() {
  const allItems = getAllFoodCosts();
  const calculated = allItems.filter((m) => m.foodCostPct !== null);
  const pending = allItems.filter((m) => m.foodCostPct === null);
  const avgFC =
    calculated.length > 0
      ? calculated.reduce((s, m) => s + m.foodCostPct, 0) / calculated.length
      : null;
  const groups = [...new Set(allItems.map((m) => m.group))];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top KPI */}
      <div style={{ ...cardStyle, textAlign: "center", padding: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 8,
          }}
        >
          Menu-Wide Avg Food Cost
        </div>
        {avgFC !== null ? (
          <>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: fcColor(avgFC),
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}
            >
              {avgFC.toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
              Target: {TARGET_FC}% · {calculated.length} of{" "}
              {allItems.length} dishes costed
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: C.dim,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              —
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>
              No dishes costed yet · Target: {TARGET_FC}%
            </div>
          </>
        )}
      </div>

      {/* Getting started callout */}
      {pending.length === allItems.length && (
        <div
          style={{
            ...cardStyle,
            padding: 14,
            borderLeft: `3px solid ${C.accent}`,
            background: "#1A1410",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: C.accent,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Getting Started
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
            When you're back in the kitchen, weigh your proteins raw vs cooked
            and tell me which dish you're prepping. We'll build cost cards one
            dish at a time and the percentages will populate here.
          </div>
        </div>
      )}

      {/* Dishes by group */}
      {groups.map((g) => {
        const items = allItems.filter((m) => m.group === g);
        return (
          <div key={g} style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                color: C.dim,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 14,
              }}
            >
              {g}
            </div>
            {items.map((m, i) => {
              const pct = m.foodCostPct ?? null;
              const isLast = i === items.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: isLast
                      ? "none"
                      : `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        color: C.white,
                        fontWeight: 600,
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.dim, marginTop: 2 }}
                    >
                      {fmtD(m.price)}
                      {pct !== null && ` · cost ${fmtD((pct / 100) * m.price)}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    {pct !== null ? (
                      <>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: fcColor(pct),
                            fontFamily: "'Playfair Display', serif",
                          }}
                        >
                          {pct.toFixed(1)}%
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: C.dim,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {pct <= TARGET_FC
                            ? "on target"
                            : pct <= TARGET_FC + 5
                            ? "watch"
                            : "over"}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          fontSize: 11,
                          color: C.dim,
                          fontStyle: "italic",
                        }}
                      >
                        not yet costed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
