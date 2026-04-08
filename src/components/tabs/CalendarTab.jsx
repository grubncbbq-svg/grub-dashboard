import { C, cardStyle } from "../../lib/theme.js";
import { fmt } from "../../lib/format.js";
import { DEADLINES } from "../../data/calendar.js";

export default function CalendarTab() {
  const now = new Date();
  const up = DEADLINES.map((d) => {
    const dt = new Date(d.date);
    return { ...d, dt, diff: Math.ceil((dt - now) / 86400000) };
  })
    .filter((d) => d.diff >= 0)
    .sort((a, b) => a.diff - b.diff);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: 12,
          color: C.dim,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Upcoming Deadlines
      </div>
      {up.map((d, i) => {
        const u = d.diff <= 14;
        const s = d.diff <= 30;
        return (
          <div
            key={i}
            style={{
              ...cardStyle,
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderLeft: `3px solid ${u ? C.red : s ? C.accent : C.border}`,
            }}
          >
            <div>
              <div
                style={{ fontSize: 14, color: C.white, fontWeight: 600 }}
              >
                {d.name}
              </div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>
                {d.dt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {d.form && ` · ${d.form}`}
                {d.amount && ` · ${fmt(d.amount)}`}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 20,
                background: u ? "#3D1515" : s ? "#3D2E15" : C.bg,
                color: u ? "#E74C3C" : s ? C.accent : C.dim,
              }}
            >
              {d.diff === 0 ? "TODAY" : `${d.diff}d`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
