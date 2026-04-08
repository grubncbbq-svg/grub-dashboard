import { useState } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { fmt, fmtD } from "../../lib/format.js";
import { PURCHASES } from "../../data/purchases.js";
import KPICard from "../shared/KPICard.jsx";

export default function PurchasesTab() {
  const [v, setV] = useState("overview");
  const P = PURCHASES;
  const mx = Math.max(...P.byVendor.map((x) => x.R));
  const mxM = Math.max(...P.byMonth.map((x) => x.v));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <KPICard
          label="Restaurant Food"
          value={fmtD(P.restaurant)}
          ac={C.green}
          sub={`${((P.restaurant / P.total) * 100).toFixed(0)}% of spend`}
        />
        <KPICard
          label="Home/Personal"
          value={fmtD(P.home)}
          ac={C.red}
          sub={`${((P.home / P.total) * 100).toFixed(0)}%`}
        />
        <KPICard
          label="Supplies"
          value={fmtD(P.supply)}
          ac={C.blue}
          sub={`${((P.supply / P.total) * 100).toFixed(0)}%`}
        />
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {["overview", "vendors", "top items"].map((x) => (
          <button
            key={x}
            onClick={() => setV(x)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              background: v === x ? C.accent + "33" : "transparent",
              color: v === x ? C.white : C.dim,
              fontWeight: v === x ? 700 : 400,
              textTransform: "capitalize",
            }}
          >
            {x}
          </button>
        ))}
      </div>

      {v === "overview" && (
        <>
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
              Monthly Restaurant Food Spend
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 130,
              }}
            >
              {P.byMonth.map((m, i) => (
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
                  <span style={{ fontSize: 9, color: C.white }}>
                    {fmt(m.v)}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 48,
                      borderRadius: 4,
                      height: `${(m.v / mxM) * 100}px`,
                      background: `linear-gradient(180deg, ${C.green}, #1B5E20)`,
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
                marginBottom: 12,
              }}
            >
              Spend Split
            </div>
            <div
              style={{
                display: "flex",
                gap: 3,
                height: 22,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: `${(P.restaurant / P.total) * 100}%`,
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Food {((P.restaurant / P.total) * 100).toFixed(0)}%
              </div>
              <div
                style={{
                  width: `${(P.supply / P.total) * 100}%`,
                  background: C.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Supply
              </div>
              <div
                style={{
                  width: `${(P.home / P.total) * 100}%`,
                  background: C.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Home
              </div>
            </div>
            <div
              style={{ fontSize: 13, color: C.dim, textAlign: "center" }}
            >
              Total:{" "}
              <span style={{ color: C.white, fontWeight: 700 }}>
                {fmtD(P.total)}
              </span>
            </div>
          </div>
        </>
      )}

      {v === "vendors" && (
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
            Restaurant Spend by Vendor
          </div>
          {P.byVendor.map((vn, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ fontSize: 13, color: C.white, fontWeight: 600 }}
                >
                  {vn.name}
                </span>
                <span
                  style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}
                >
                  {fmt(vn.R)}
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: C.bg,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(vn.R / mx) * 100}%`,
                    background: `linear-gradient(90deg, ${C.accent}, ${C.accentDim})`,
                    borderRadius: 4,
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>
                Total incl home+supply: {fmt(vn.total)}
              </div>
            </div>
          ))}
        </div>
      )}

      {v === "top items" && (
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
            Top Restaurant Purchases
          </div>
          {P.topItems.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom:
                  i < P.topItems.length - 1
                    ? `1px solid ${C.border}`
                    : "none",
              }}
            >
              <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>
                {t.name}
              </div>
              <div
                style={{ fontSize: 16, fontWeight: 700, color: C.accent }}
              >
                {fmt(t.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
