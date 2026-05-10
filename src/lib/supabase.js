import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase env vars not set — price book will not persist.");
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ── Price Book ──────────────────────────────────────────────────────────────

export async function getPriceBook() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("price_book").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function upsertIngredientPrice({ name, vendor, unit, price }) {
  if (!supabase) return;
  const { error: pbError } = await supabase.from("price_book").upsert(
    { name, vendor, unit, price, updated_at: new Date().toISOString().split("T")[0] },
    { onConflict: "name" }
  );
  if (pbError) throw pbError;
  const { error: phError } = await supabase.from("price_history").insert({
    ingredient_name: name, price, vendor,
    recorded_date: new Date().toISOString().split("T")[0],
  });
  if (phError) throw phError;
}

// Rename an ingredient — updates both price_book and price_history so
// historical data stays attached to the new name.
export async function renamePriceBookEntry(oldName, newName) {
  if (!supabase) return;
  const trimmed = (newName || "").trim();
  if (!trimmed) throw new Error("New name cannot be empty");
  if (trimmed === oldName) return;

  // Check whether the target name already exists; if so, the caller should merge.
  const { data: existing, error: lookupErr } = await supabase
    .from("price_book")
    .select("name")
    .eq("name", trimmed)
    .maybeSingle();
  if (lookupErr) throw lookupErr;
  if (existing) {
    throw new Error(
      `An ingredient named "${trimmed}" already exists. Use Merge instead.`
    );
  }

  const { error: pbErr } = await supabase
    .from("price_book")
    .update({ name: trimmed, updated_at: new Date().toISOString().split("T")[0] })
    .eq("name", oldName);
  if (pbErr) throw pbErr;

  const { error: phErr } = await supabase
    .from("price_history")
    .update({ ingredient_name: trimmed })
    .eq("ingredient_name", oldName);
  if (phErr) throw phErr;
}

// Merge `fromName` INTO `toName`: reassigns history rows to the target,
// then deletes the source price_book row. Target keeps its current price.
export async function mergePriceBookEntries(fromName, toName) {
  if (!supabase) return;
  if (fromName === toName) throw new Error("Cannot merge an entry into itself");

  const { error: phErr } = await supabase
    .from("price_history")
    .update({ ingredient_name: toName })
    .eq("ingredient_name", fromName);
  if (phErr) throw phErr;

  const { error: delErr } = await supabase
    .from("price_book")
    .delete()
    .eq("name", fromName);
  if (delErr) throw delErr;
}

export async function deletePriceBookEntry(name) {
  if (!supabase) return;
  const { error } = await supabase.from("price_book").delete().eq("name", name);
  if (error) throw error;
}

// ── Clover Sales Data ───────────────────────────────────────────────────────

export async function getDailySales(days = 90) {
  if (!supabase) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("daily_sales").select("*")
    .gte("date", since.toISOString().split("T")[0])
    .order("date", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getDailyTenders(days = 90) {
  if (!supabase) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("daily_tenders").select("*")
    .gte("date", since.toISOString().split("T")[0]);
  if (error) throw error;
  return data || [];
}

export async function getTopItems(days = 30, limit = 10) {
  if (!supabase) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data, error } = await supabase
    .from("daily_item_sales")
    .select("item_name,quantity,revenue")
    .gte("date", since.toISOString().split("T")[0]);
  if (error) throw error;

  // Aggregate across the date range
  const map = new Map();
  for (const row of data || []) {
    const cur = map.get(row.item_name) || { name: row.item_name, quantity: 0, revenue: 0 };
    cur.quantity += row.quantity || 0;
    cur.revenue += parseFloat(row.revenue || 0);
    map.set(row.item_name, cur);
  }
  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getLastSync() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("sync_log")
    .select("*")
    .eq("source", "clover")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function triggerCloverSync({ startDate, endDate } = {}) {
  const res = await fetch("/api/sync-clover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, endDate }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Sync failed");
  }
  return res.json();
}

// ── Receipts ────────────────────────────────────────────────────────────────

export async function getReceipts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("receipts")
    .select("*, receipt_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveReceipt({ vendor, receipt_date, total, raw_text, items }) {
  if (!supabase) throw new Error("Supabase not configured");
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
  if (!supabase) return;
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
