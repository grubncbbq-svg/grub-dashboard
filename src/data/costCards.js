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
  {
    menuItem: "Pastrami",
    components: [
      // Protein — house cured & smoked corned beef brisket
      // Batch: 20.2 lb raw → 11 lb 9.3 oz cooked = 11.581 lb (57.3% yield)
      // 5.5 oz finished / 57.3% = 9.6 oz raw = 0.600 lb
      { ingredient: "Corned Beef Raw",  rawAmount: 0.600, unit: "lb",   yieldPct: 100 },
      // Bread — Strong Arm deli rye, 8 portions per loaf, 2 slices per sandwich
      { ingredient: "Deli Rye Loaf",    rawAmount: 0.125, unit: "each", yieldPct: 100 },
      // Caramelized onions — 2 oz finished; raw onion cooks down ~33%  → 6 oz raw = 0.375 lb
      { ingredient: "Sweet Onion",      rawAmount: 0.375, unit: "lb",   yieldPct: 100 },
      // Sauerkraut — 2 oz (ESTIMATED price — update from Sysco receipt)
      { ingredient: "Sauerkraut",       rawAmount: 2,     unit: "oz",   yieldPct: 100 },
      // 1,000 Island dressing — 2 oz (ESTIMATED batch cost $0.094/oz)
      { ingredient: "1,000 Island",     rawAmount: 2,     unit: "oz",   yieldPct: 100 },
      // House dill pickles — 1.5 oz topping (ESTIMATED from cucumber cost)
      { ingredient: "House Pickles",    rawAmount: 1.5,   unit: "oz",   yieldPct: 100 },
    ],
    notes: "Batch: 20.2 lb raw corned beef → 11 lb 9.3 oz finished (57.3% yield). Sauerkraut, pickles, 1K Island are estimated — update when Sysco/RD receipts confirmed.",
  },
  {
    menuItem: "Smoked Bacon Potato Salad",
    components: [
      // Potatoes — RD 80ct case (~50lb). ~6 oz per 8 oz serving; boiled skin-on ≈ no loss
      { ingredient: "Yellow Potato",         rawAmount: 0.375, unit: "lb", yieldPct: 100 },
      // House dressing — Lg batch (~48 oz) dresses 8-10 lb potatoes → ~2 oz per serving
      { ingredient: "Potato Salad Dressing", rawAmount: 2,     unit: "oz", yieldPct: 100 },
      // House-smoked pork belly bacon — 0.5 oz cooked @ 87% smoke yield → 0.575 oz raw = 0.036 lb
      { ingredient: "Pork Belly",            rawAmount: 0.036, unit: "lb", yieldPct: 100 },
    ],
    notes: "8 oz serving: ~6 oz potato + 2 oz dressing + 0.5 oz house bacon. Batch: 8-10 lb potatoes + Lg dressing ≈ 24 servings.",
  },
];
