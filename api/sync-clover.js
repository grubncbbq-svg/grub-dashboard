// Vercel serverless function — POST /api/sync-clover
// Pulls orders, line items, and payments from Clover for a date range
// and writes denormalized daily summaries to Supabase.
//
// Body: { startDate?: "YYYY-MM-DD", endDate?: "YYYY-MM-DD" }
//   defaults to last 30 days if omitted

import { createClient } from "@supabase/supabase-js";

const CLOVER_BASE = "https://api.clover.com/v3";
const MID = process.env.CLOVER_MERCHANT_ID;
const TOKEN = process.env.CLOVER_API_TOKEN;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function cloverGet(path, params = {}) {
  const url = new URL(`${CLOVER_BASE}/merchants/${MID}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Clover ${res.status}: ${text}`);
  }
  return res.json();
}

// Page through all results (Clover paginates at 100 per page by default)
async function cloverGetAll(path, params = {}) {
  const all = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const data = await cloverGet(path, { ...params, limit, offset });
    const items = data.elements || [];
    all.push(...items);
    if (items.length < limit) break;
    offset += limit;
  }
  return all;
}

function isoDate(ts) {
  // Convert ms timestamp to YYYY-MM-DD in America/New_York timezone
  const d = new Date(ts);
  const opts = { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" };
  const parts = new Intl.DateTimeFormat("en-CA", opts).format(d); // en-CA gives YYYY-MM-DD
  return parts;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!MID || !TOKEN) {
    return res.status(500).json({ error: "Clover credentials not configured" });
  }

  const startTime = Date.now();

  // Default to last 30 days
  const now = new Date();
  const defaultStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startDate = req.body?.startDate || defaultStart.toISOString().split("T")[0];
  const endDate = req.body?.endDate || now.toISOString().split("T")[0];

  // Convert to ms timestamps for Clover filter (start of day → end of day)
  const startMs = new Date(`${startDate}T00:00:00-05:00`).getTime();
  const endMs = new Date(`${endDate}T23:59:59-05:00`).getTime();

  try {
    // Fetch orders with line items + payments expanded
    const orders = await cloverGetAll("/orders", {
      filter: `createdTime>=${startMs} and createdTime<=${endMs}`,
      expand: "lineItems,payments",
    });

    // Aggregate by date
    const dailyMap = new Map(); // date → { net, gross, tax, ... }
    const tenderMap = new Map(); // `${date}|${tender}` → { amount, count }
    const itemMap = new Map(); // `${date}|${item}` → { quantity, revenue, item_id }

    for (const order of orders) {
      if (order.state === "open" || !order.createdTime) continue; // skip non-paid
      const date = isoDate(order.createdTime);

      // Daily totals (Clover amounts are in cents)
      const total = (order.total || 0) / 100;
      const tax = ((order.taxAmount) || 0) / 100;

      const day = dailyMap.get(date) || {
        net_sales: 0, gross_sales: 0, tax: 0, tip: 0, refunds: 0,
        discounts: 0, order_count: 0, item_count: 0,
      };
      day.gross_sales += total;
      day.net_sales += total - tax;
      day.tax += tax;
      day.order_count += 1;

      // Line items
      const lineItems = order.lineItems?.elements || [];
      for (const li of lineItems) {
        day.item_count += 1;
        const itemName = li.name || "Unknown";
        const itemId = li.item?.id || null;
        const revenue = (li.price || 0) / 100;
        const key = `${date}|${itemName}`;
        const cur = itemMap.get(key) || { item_name: itemName, item_id: itemId, quantity: 0, revenue: 0, date };
        cur.quantity += 1;
        cur.revenue += revenue;
        itemMap.set(key, cur);
      }

      // Payments / tenders
      const payments = order.payments?.elements || [];
      for (const p of payments) {
        const tenderName = p.tender?.label || p.cardTransaction?.cardType || "Other";
        const amount = (p.amount || 0) / 100;
        const key = `${date}|${tenderName}`;
        const cur = tenderMap.get(key) || { date, tender_name: tenderName, amount: 0, txn_count: 0 };
        cur.amount += amount;
        cur.txn_count += 1;
        tenderMap.set(key, cur);
      }

      dailyMap.set(date, day);
    }

    // Bulk upsert into Supabase
    const dailyRows = [...dailyMap.entries()].map(([date, v]) => ({
      date,
      ...v,
      updated_at: new Date().toISOString(),
    }));
    if (dailyRows.length > 0) {
      const { error } = await supabase.from("daily_sales").upsert(dailyRows, { onConflict: "date" });
      if (error) throw new Error(`daily_sales upsert: ${error.message}`);
    }

    const tenderRows = [...tenderMap.values()];
    if (tenderRows.length > 0) {
      const { error } = await supabase
        .from("daily_tenders")
        .upsert(tenderRows, { onConflict: "date,tender_name" });
      if (error) throw new Error(`daily_tenders upsert: ${error.message}`);
    }

    const itemRows = [...itemMap.values()];
    if (itemRows.length > 0) {
      const { error } = await supabase
        .from("daily_item_sales")
        .upsert(itemRows, { onConflict: "date,item_name" });
      if (error) throw new Error(`daily_item_sales upsert: ${error.message}`);
    }

    const duration = Date.now() - startTime;

    // Log the sync
    await supabase.from("sync_log").insert({
      source: "clover",
      start_date: startDate,
      end_date: endDate,
      orders_synced: orders.length,
      status: "success",
      duration_ms: duration,
    });

    return res.status(200).json({
      success: true,
      ordersProcessed: orders.length,
      daysSynced: dailyRows.length,
      durationMs: duration,
      dateRange: { startDate, endDate },
    });
  } catch (err) {
    console.error("sync-clover error:", err);
    await supabase.from("sync_log").insert({
      source: "clover",
      start_date: startDate,
      end_date: endDate,
      status: "error",
      error_message: err.message,
      duration_ms: Date.now() - startTime,
    });
    return res.status(500).json({ error: err.message });
  }
}
