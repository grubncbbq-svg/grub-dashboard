// Price Book — master ingredient price table
// Populated as receipts are entered. Prices cascade into cost cards.
//
// Schema per entry:
//   name:       Normalized ingredient name (e.g. "Beef Cheek Meat")
//   vendor:     Where purchased
//   unit:       lb, oz, each, cup, etc.
//   price:      Most recent price per unit
//   history:    Array of { date, price } for trend tracking
//   updated:    ISO date string of last update

export const PRICE_BOOK = [
  // Placeholder — will be populated dish-by-dish from the kitchen
  // Example:
  // {
  //   name: "Corned Beef Raw",
  //   vendor: "Sam's Club",
  //   unit: "lb",
  //   price: 5.98,
  //   history: [{ date: "2026-02-15", price: 5.98 }],
  //   updated: "2026-02-15",
  // },
];
