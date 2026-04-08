import { useState } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { RECIPES, RECIPE_CATEGORIES } from "../../data/recipes.js";

const catColors = {
  "Cures & Brines": "#5B8C5A",
  "Rubs & Seasonings": "#C0392B",
  Sauces: "#2980B9",
  Sides: "#8E44AD",
  Baked: "#D4A054",
};

export default function RecipesTab() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState("");

  const fl = RECIPES.filter(
    (r) =>
      (cat === "All" || r.cat === cat) &&
      (!q ||
        r.name.toLowerCase().includes(q.toLowerCase()) ||
        r.ing.some(([x]) => x.toLowerCase().includes(q.toLowerCase())))
  );

  if (open) {
    const r = open;
    const co = catColors[r.cat] || C.accent;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <button
          onClick={() => setOpen(null)}
          style={{
            background: "none",
            border: "none",
            color: C.accent,
            cursor: "pointer",
            fontSize: 13,
            textAlign: "left",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: C.white,
              fontFamily: "'Playfair Display', serif",
              marginBottom: 4,
            }}
          >
            {r.name}
          </div>
          <span
            style={{
              fontSize: 10,
              padding: "3px 10px",
              borderRadius: 20,
              background: co + "22",
              color: co,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {r.cat}
          </span>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${C.border}`,
              marginTop: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: C.red,
                padding: "10px 16px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Ingredient
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textAlign: "right",
                }}
              >
                Amount
              </span>
            </div>
            {r.ing.map(([ig, am], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  padding: "10px 16px",
                  background: i % 2 === 0 ? C.card : C.bg,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontSize: 13, color: C.white }}>{ig}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: C.accent,
                    textAlign: "right",
                    fontWeight: 600,
                  }}
                >
                  {am}
                </span>
              </div>
            ))}
          </div>
          {r.notes && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: C.bg,
                borderRadius: 8,
                borderLeft: `3px solid ${C.accent}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.dim,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Notes
              </div>
              <div style={{ fontSize: 13, color: C.text }}>{r.notes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <input
        type="text"
        placeholder="Search recipes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "10px 14px",
          color: C.white,
          fontSize: 14,
          outline: "none",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["All", ...RECIPE_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              background: cat === c ? C.accent : C.card,
              color: cat === c ? "#0C0A07" : C.dim,
              border: `1px solid ${cat === c ? C.accent : C.border}`,
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: cat === c ? 700 : 400,
              fontFamily: "inherit",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 10,
        }}
      >
        {fl.map((r, i) => {
          const co = catColors[r.cat] || C.accent;
          return (
            <div
              key={i}
              onClick={() => setOpen(r)}
              style={{
                ...cardStyle,
                cursor: "pointer",
                padding: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 4,
                  height: "100%",
                  background: co,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.white,
                  marginBottom: 4,
                }}
              >
                {r.name}
              </div>
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: co + "22",
                  color: co,
                  textTransform: "uppercase",
                }}
              >
                {r.cat}
              </span>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 6 }}>
                {r.ing.length} ingredients
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
