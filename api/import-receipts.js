// Temporary one-time import endpoint — remove after use
// POST /api/import-receipts  body: { items: [...] }

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const CAT_MAP = { restaurant: "R", home: "H", supply: "S" };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { items, priceBookOnly } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array required" });
  }

  // ── Price book only mode (for re-runs) ──────────────────────────────────────
  if (priceBookOnly) {
    return await importPriceBook(items, res);
  }

  // Group by vendor + date
  const groups = new Map();
  for (const row of items) {
    const key = `${row.vendor}|${row.date}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  let receiptCount = 0, itemCount = 0;
  const errors = [];

  for (const [key, rows] of groups) {
    const [vendor, date] = key.split("|");
    const total = rows.reduce((s, i) => s + (i.amount || 0), 0);

    const { data: receipt, error: rErr } = await supabase
      .from("receipts")
      .insert({
        vendor,
        receipt_date: date,
        total: Math.round(total * 100) / 100,
        status: "confirmed",
        raw_text: "Bulk import from GRUB_all_receipts_FINAL.json",
      })
      .select()
      .single();

    if (rErr) { errors.push(`Receipt ${key}: ${rErr.message}`); continue; }
    receiptCount++;

    const lineItems = rows.map((i) => ({
      receipt_id: receipt.id,
      name: i.item,
      normalized_name: i.item,
      quantity: 1,
      unit: "each",
      unit_price: null,
      total_price: i.amount,
      category: CAT_MAP[i.category] || "R",
      confirmed: true,
    }));

    const { error: iErr } = await supabase.from("receipt_items").insert(lineItems);
    if (iErr) errors.push(`Items ${key}: ${iErr.message}`);
    else itemCount += lineItems.length;
  }

  // Now populate price book
  const { priceBookEntries, priceHistoryEntries } = await importPriceBookData(items);

  return res.status(200).json({
    receipts: receiptCount,
    items: itemCount,
    priceBookEntries,
    priceHistoryEntries,
    errors,
  });
}

async function importPriceBook(items, res) {
  const { priceBookEntries, priceHistoryEntries, errors } = await importPriceBookData(items);
  return res.status(200).json({ priceBookEntries, priceHistoryEntries, errors });
}

async function importPriceBookData(items) {
  // Sort by date ascending so later entries overwrite earlier ones
  const sorted = [...items]
    .filter((i) => i.category === "restaurant" && i.amount > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Keep latest price per ingredient name
  const latestByName = new Map();
  for (const i of sorted) {
    latestByName.set(i.item, i);
  }

  // Also collect full history (all restaurant purchases)
  const history = sorted.map((i) => ({
    ingredient_name: i.item,
    price: i.amount,
    vendor: i.vendor,
    recorded_date: i.date,
  }));

  const errors = [];

  // Insert price_book rows (one per unique ingredient name — latest price wins)
  const priceBookRows = [...latestByName.values()].map((i) => ({
    name: i.item,
    vendor: i.vendor,
    unit: "each",
    price: i.amount,
    updated_at: i.date,
  }));

  // Insert in batches of 50
  let priceBookEntries = 0;
  for (let i = 0; i < priceBookRows.length; i += 50) {
    const batch = priceBookRows.slice(i, i + 50);
    const { error } = await supabase.from("price_book").insert(batch);
    if (error) errors.push(`price_book batch ${i}: ${error.message}`);
    else priceBookEntries += batch.length;
  }

  // Insert price_history in batches of 100
  let priceHistoryEntries = 0;
  for (let i = 0; i < history.length; i += 100) {
    const batch = history.slice(i, i + 100);
    const { error } = await supabase.from("price_history").insert(batch);
    if (error) errors.push(`price_history batch ${i}: ${error.message}`);
    else priceHistoryEntries += batch.length;
  }

  return { priceBookEntries, priceHistoryEntries, errors };
}
