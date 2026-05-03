// Recipe Cost Cards — one per menu item
// Each card links ingredients (with quantities + yield %) to Price Book prices.
//
// Food cost calc per dish:
//   sum of (rawAmount / (yieldPct / 100) * pricePerUnit) for each component
//   then divide by selling price for the percentage.
//
// These get built one dish at a time when David is in the kitchen
// weighing proteins raw vs cooked.

export const COST_CARDS = [
  {
    menuItem: "Smoked Beef Cheek",
    components: [
      // Protein — cheek + chuck blend smoked together
      // Batch: 6.06 lb cheek + 4.30 lb chuck = 10.36 lb raw → 6.09 lb cooked (58.8% yield)
      // 5 oz finished meat per sandwich → 8.50 oz raw total (5 / 0.588)
      // Cheek share: 58.5% of raw → 4.97 oz = 0.311 lb
      // Chuck share: 41.5% of raw → 3.53 oz = 0.221 lb
      { ingredient: "Beef Cheek Meat", rawAmount: 0.311, unit: "lb", yieldPct: 100 },
      { ingredient: "Chuck Roll",      rawAmount: 0.221, unit: "lb", yieldPct: 100 },
      // Bread — Strong Arm ciabatta, 3–4 portions per roll (using 3.5 avg)
      { ingredient: "Ciabatta Roll",   rawAmount: 0.286, unit: "each", yieldPct: 100 },
      // Toppings — pickled peppers, caramelized onions, house aioli
      { ingredient: "Sweet Peppers",   rawAmount: 0.094, unit: "lb", yieldPct: 100 },
      { ingredient: "Sweet Onion",     rawAmount: 0.125, unit: "lb", yieldPct: 100 },
      { ingredient: "Mayonnaise",      rawAmount: 0.75,  unit: "oz", yieldPct: 100 },
    ],
    notes: "April 2026 batch: 6.06 lb cheek + 4.30 lb chuck → 6.09 lb cooked (58.8% yield). 5 oz finished per sandwich.",
  },
  {
    menuItem: "Smoked Turkey Breast",
    components: [
      // Protein — Shady Brook Farms bone-in breast, slow smoked to 150°F
      // Purchase: 5.96 lb whole breast @ $1.99/lb VIC = $11.86
      // Usable trimmed raw onto smoker: 3 lb 5.83 oz = 3.364 lb (56.4% trim yield)
      // Smoke yield at 150°F: ~90% (minimal shrinkage at low temp)
      // Overall yield: 50.8% — 5 oz finished → 9.84 oz raw whole breast = 0.616 lb
      { ingredient: "Turkey Breast",  rawAmount: 0.616, unit: "lb",  yieldPct: 100 },
      // Bacon — house-cured pork belly, slow smoked to 150°F (~87% yield)
      // 2 thick slices ≈ 3 oz cooked → 3.45 oz raw = 0.216 lb
      { ingredient: "Pork Belly",     rawAmount: 0.216, unit: "lb",  yieldPct: 100 },
      // Bread — Strong Arm focaccia sheet, ~21 portions per sheet
      { ingredient: "Focaccia Sheet", rawAmount: 0.048, unit: "each", yieldPct: 100 },
      // Toppings
      { ingredient: "Avocado",        rawAmount: 0.25,  unit: "each", yieldPct: 100 },
      // Pickled onions — ~1.25 oz raw sweet onion per sandwich
      { ingredient: "Sweet Onion",    rawAmount: 0.078, unit: "lb",  yieldPct: 100 },
      // Mustard Aioli — 2 oz per sandwich ($0.104/oz batch cost)
      { ingredient: "Mustard Aioli",  rawAmount: 2,     unit: "oz",  yieldPct: 100 },
      // Iceberg — ½ cup shredded, ~9 portions per head
      { ingredient: "Iceberg Lettuce", rawAmount: 0.111, unit: "each", yieldPct: 100 },
    ],
    notes: "Estimates: iceberg ½ cup (~9 portions/head), bacon 2 thick slices (3.45 oz raw pork belly @ 87% yield). Confirm weights in kitchen.",
  },
];
