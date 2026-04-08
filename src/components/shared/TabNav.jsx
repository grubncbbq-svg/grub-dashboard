import { C } from "../../lib/theme.js";

const TABS = [
  { id: "overview", label: "Overview", icon: "\u{1F4CA}" },
  { id: "foodcost", label: "Food Cost", icon: "\u{1F3AF}" },
  { id: "purchases", label: "Purchases", icon: "\u{1F9FE}" },
  { id: "recipes", label: "Recipes", icon: "\u{1F356}" },
  { id: "calendar", label: "Calendar", icon: "\u{1F4C5}" },
  { id: "expenses", label: "Expenses", icon: "\u{1F4B0}" },
];

export default function TabNav({ active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: `1px solid ${C.border}`,
        background: C.card,
        overflowX: "auto",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            flex: 1,
            padding: "11px 6px",
            background: active === t.id ? C.bg : "transparent",
            borderBottom:
              active === t.id
                ? `2px solid ${C.accent}`
                : "2px solid transparent",
            color: active === t.id ? C.white : C.dim,
            fontWeight: active === t.id ? 700 : 400,
            fontSize: 11,
            cursor: "pointer",
            border: "none",
            borderBottomStyle: "solid",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 13 }}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
