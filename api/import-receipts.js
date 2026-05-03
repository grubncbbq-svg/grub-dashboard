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

  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array required" });
  }

  // Group by vendor + date
  const groups = new Map();
  for (const row of items) {
    const key = `${row.vendor}|${row.date}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  let receiptCount = 0, itemCount = 0, priceBookCount = 0;
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
    if (iErr) { errors.push(`Items ${key}: ${iErr.message}`); }
    else itemCount += lineItems.length;

    // Update price_book with most recent price per ingredient
    for (const ri of rows.filter((i) => i.category === "restaurant" && i.amount > 0)) {
      const { error: pbErr } = await supabase.from("price_book").upsert(
        { name: ri.item, vendor, unit: "each", price: ri.amount, updated_at: date },
        { onConflict: "name" }
      );
      if (!pbErr) {
        await supabase.from("price_history").insert({
          ingredient_name: ri.item,
          price: ri.amount,
          vendor,
          recorded_date: date,
          receipt_id: receipt.id,
        });
        priceBookCount++;
      }
    }
  }

  return res.status(200).json({
    receipts: receiptCount,
    items: itemCount,
    priceBookEntries: priceBookCount,
    errors,
  });
}
