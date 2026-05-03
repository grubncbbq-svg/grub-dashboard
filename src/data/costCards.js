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
];
