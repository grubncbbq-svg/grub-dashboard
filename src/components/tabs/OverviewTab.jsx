import { useEffect, useState } from "react";
import { C, cardStyle } from "../../lib/theme.js";
import { fmt, fmtD } from "../../lib/format.js";
import { SALES_2025, TENDERS_2025, MONTHLY_EST } from "../../data/sales.js";
import {
  getDailySales,
  getDailyTenders,
  getLastSync,
  triggerCloverSync,
} from "../../lib/supabase.js";
import KPICard from "../shared/KPICard.jsx";
import Bar from "../shared/Bar.jsx";

function rollupByMonth(dailySales) {
  const map = new Map(); // 'YYYY-MM' → total
  for (const row of dailySales) {
    const ym = row.date.slice(0, 7);
    map.set(ym, (map.get(ym) || 0) + parseFloat(row.net_sales || 0));
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, v]) => {
      const [, m] = ym.split("-");
      const monthName = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(m, 10)];
      return { m: monthName, v };
    });
}

function rollupTenders(rows) {
  const map = new Map();
  let total = 0;
  for (const r of rows) {
    const amt = parseFloat(r.amount || 0);
    map.set(r.tender_name, (map.get(r.tender_name) || 0) + amt);
    total += amt;
  }
  return [...map.entries()]
    .map(([name, amount]) => ({
      name,
      amount,
      pct: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export default function OverviewTab() {
  const [dailySales, setDailySales] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  async function load() {
    try {
      const [sales, tnd, sync] = await Promise.all([
        getDailySales(180),
        getDailyTenders(180),
        getLastSync(),
      ]);
      setDailySales(sales);
      setTenders(tnd);
      setLastSync(sync);
    } catch (err) {
      console.error("Failed to load overview data:", err);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const result = await triggerCloverSync();
      setSyncMsg(`Synced ${result.ordersProcessed} orders across ${result.daysSynced} days`);
      await load();
    } catch (err) {
      setSyncMsg(`Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  }

  // Use live data if we have it, otherwise fall back to seed values
  const hasLiveData = dailySales.length > 0;
  const monthly = hasLiveData ? rollupByMonth(dailySales) : MONTHLY_EST;
  const liveTenders = hasLiveData && tenders.length > 0 ? rollupTenders(tenders) : TENDERS_2025;

  // Compute KPIs from live data when available
  const totalLive = dailySales.reduce((s, d) => s + parseFloat(d.net_sales || 0), 0);
  const today = new Date();
  const thisMonth = today.toISOString().slice(0, 7);
  const mtd = dailySales
    .filter((d) => d.date.startsWith(thisMonth))
    .reduce((s, d) => s + parseFloat(d.net_sales || 0), 0);
  const last30 = dailySales
    .filter((d) => {
      const dt = new Date(d.date);
      return (today - dt) / (24 * 60 * 60 * 1000) <= 30;
    })
    .reduce((s, d) => s + parseFloat(d.net_sales || 0), 0);

  const lastSyncText = lastSync
    ? `Last synced ${new Date(lastSync.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
    : "Never synced — tap Sync Now";

  const mx = Math.max(...monthly.map((m) => m.v), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Sync status + button */}
      <div style={{ ...cardStyle, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>Clover Sync</div>
          <div style={{ fontSize: 12, color: C.text, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {syncMsg || lastSyncText}
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: syncing ? C.bg : C.accent,
            color: syncing ? C.dim : "#0C0A07",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            cursor: syncing ? "default" : "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {hasLiveData ? (
          <>
            <KPICard label="MTD Net Sales" value={fmt(mtd)} sub="This month" />
            <KPICard label="Last 30 Days" value={fmt(last30)} sub="Rolling window" />
            <KPICard label="180-Day Total" value={fmt(totalLive)} ac={C.green} />
          </>
        ) : (
          <>
            <KPICard label="2025 Full Year" value={fmt(SALES_2025.net)} sub="Pre-Clover sync" />
            <KPICard label="Status" value="No data" sub="Tap Sync Now to pull from Clover" ac={C.dim} />
            <KPICard label="YoY" value="~5x" ac={C.green} sub="vs 2025" />
          </>
        )}
      </div>

      {/* Monthly Sales */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
          {hasLiveData ? "Monthly Net Sales (Live)" : "Monthly Sales (Estimate)"}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130 }}>
          {monthly.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
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

      {/* Payment Mix */}
      <div style={cardStyle}>
        <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
          {hasLiveData ? "Payment Mix (Live)" : "2025 Payment Mix"}
        </div>
        {liveTenders.map((t, i) => (
          <Bar key={i} label={t.name} value={fmt(t.amount)} pct={t.pct} />
        ))}
      </div>
    </div>
  );
}
