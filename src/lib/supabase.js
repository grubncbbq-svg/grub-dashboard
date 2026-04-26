import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars not set — price book will not persist.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Price Book ──────────────────────────────────────────────────────────────

export async function getPriceBook() {
  const { data, error } = await supabase
    .from("price_book")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function upsertIngredientPrice({ name, vendor, unit, price }) {
  // Update price_book
  const { error: pbError } = await supabase.from("price_book").upsert(
    { name, vendor, unit, price, updated_at: new Date().toISOString().split("T")[0] },
    { onConflict: "name" }
  );
  if (pbError) throw pbError;

  // Append to price_history
  const { error: phError } = await supabase.from("price_history").insert({
    ingredient_name: name,
    price,
    vendor,
    recorded_date: new Date().toISOString().split("T")[0],
  });
  if (phError) throw phError;
}

// ── Receipts ────────────────────────────────────────────────────────────────

export async function getReceipts() {
  const { data, error } = await supabase
    .from("receipts")
    .select("*, receipt_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveReceipt({ vendor, receipt_date, total, raw_text, items }) {
  // Insert receipt header
  const { data: receipt, error: rErr } = await supabase
    .from("receipts")
    .insert({ vendor, receipt_date, total, raw_text, status: "pending" })
    .select()
    .single();
  if (rErr) throw rErr;

  // Insert line items
  const { error: iErr } = await supabase.from("receipt_items").insert(
    items.map((item) => ({ ...item, receipt_id: receipt.id }))
  );
  if (iErr) throw iErr;

  return receipt;
}

export async function confirmReceiptItems(receiptId, confirmedItems) {
  // Mark items confirmed and update price book for each R-category item
  for (const item of confirmedItems) {
    await supabase
      .from("receipt_items")
      .update({ confirmed: true, category: item.category, normalized_name: item.normalized_name })
      .eq("id", item.id);

    if (item.category === "R" && item.normalized_name && item.unit_price) {
      await upsertIngredientPrice({
        name: item.normalized_name,
        vendor: item.vendor,
        unit: item.unit,
        price: item.unit_price,
      });
    }
  }

  // Mark receipt confirmed
  await supabase
    .from("receipts")
    .update({ status: "confirmed" })
    .eq("id", receiptId);
}
