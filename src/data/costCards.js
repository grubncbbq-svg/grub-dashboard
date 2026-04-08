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
  // Placeholder — example structure:
  // {
  //   menuItem: "Pastrami",          // must match MENU_ITEMS[].name
  //   components: [
  //     { ingredient: "Corned Beef Raw", rawAmount: 4, unit: "oz", yieldPct: 65 },
  //     { ingredient: "La Farm Sourdough", rawAmount: 2, unit: "slice", yieldPct: 100 },
  //     { ingredient: "Sauerkraut", rawAmount: 1, unit: "oz", yieldPct: 100 },
  //     { ingredient: "Caramelized Onions", rawAmount: 0.5, unit: "oz", yieldPct: 100 },
  //     { ingredient: "Dill Pickles", rawAmount: 0.5, unit: "oz", yieldPct: 100 },
  //     { ingredient: "1000 Island Dressing", rawAmount: 1, unit: "oz", yieldPct: 100 },
  //   ],
  //   notes: "Yield on corned beef brisket ~65% after smoking and trim",
  // },
];
