#!/usr/bin/env node
// One-time import of GRUB_all_receipts_FINAL.json into Supabase
// Usage: node scripts/import-receipts.js

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Env vars loaded via --env-file=.env.local flag
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // use service role for bulk insert

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Map category strings to single-letter codes
const CAT_MAP = { restaurant: "R", home: "H", supply: "S" };

// Load the receipts JSON
const data = JSON.parse(
  readFileSync("/Users/kris/Desktop/GRUB_all_receipts_FINAL.json", "utf8")
);

// Group line items by vendor + date
const groups = new Map();
for (const row of data) {
  const key = `${row.vendor}|${row.date}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

console.log(`Found ${data.length} line items across ${groups.size} receipts`);

let receiptCount = 0;
let itemCount = 0;
let priceBookCount = 0;
const errors = [];

for (const [key, items] of groups) {
  const [vendor, date] = key.split("|");
  const total = items.reduce((s, i) => s + (i.amount || 0), 0);

  // Insert receipt header
  const { data: receipt, error: rErr } = await supabase
    .from("receipts")
    .insert({
      vendor,
      receipt_date: date,
      total: Math.round(total * 100) / 100,
      status: "confirmed",
      raw_text: `Imported from GRUB_all_receipts_FINAL.json`,
    })
    .select()
    .single();

  if (rErr) {
    errors.push(`Receipt ${key}: ${rErr.message}`);
    continue;
  }

  receiptCount++;

  // Insert line items
  const lineItems = items.map((i) => ({
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
  if (iErr) {
    errors.push(`Items for ${key}: ${iErr.message}`);
  } else {
    itemCount += lineItems.length;
  }

  // Update price_book for restaurant items (use total as price, unit = "each")
  // This gives us "last seen price" for every ingredient
  const restaurantItems = items.filter((i) => i.category === "restaurant" && i.amount > 0);
  for (const ri of restaurantItems) {
    const { error: pbErr } = await supabase.from("price_book").upsert(
      {
        name: ri.item,
        vendor,
        unit: "each",
        price: ri.amount,
        updated_at: date,
      },
      { onConflict: "name" }
    );
    if (!pbErr) {
      // Also log to price_history
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

console.log("\n✓ Import complete");
console.log(`  Receipts inserted:    ${receiptCount}`);
console.log(`  Line items inserted:  ${itemCount}`);
console.log(`  Price book entries:   ${priceBookCount}`);

if (errors.length > 0) {
  console.log(`\n⚠ Errors (${errors.length}):`);
  errors.forEach((e) => console.log(`  - ${e}`));
}
