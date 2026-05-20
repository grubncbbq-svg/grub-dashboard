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
  // ── Proteins ───────────────────────────────────────────────────────────────
  {
    name: "Beef Cheek Meat",
    vendor: "Sam's Club",
    unit: "lb",
    price: 4.97,
    history: [
      { date: "2025-10-17", price: 3.15 },  // $18.93 / ~6lb est
      { date: "2025-10-19", price: 4.23 },  // $101.68 / 24lb est (x4 packs)
      { date: "2025-10-26", price: 4.27 },  // $70.61 / ~16.5lb est (x3)
      { date: "2025-10-30", price: 4.27 },  // $85.60 / 20lb est (x3)
      { date: "2025-11-13", price: 4.43 },  // $132.94 / 30lb est (x5)
      { date: "2026-04-27", price: 4.97 },  // $35.44 / 7.13lb confirmed on receipt
    ],
    updated: "2026-04-27",
  },
  {
    name: "Chuck Roll",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 5.77,
    history: [
      { date: "2026-04-27", price: 5.77 }, // $175.98 / 30.5lb confirmed on receipt
    ],
    updated: "2026-04-27",
  },
  {
    name: "Corned Beef Raw",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 5.29,
    history: [
      { date: "2026-02-02", price: 5.29 }, // $106.01 / 20.04lb
      { date: "2026-02-09", price: 5.29 }, // $88.50 / 16.73lb
      { date: "2026-03-16", price: 4.95 }, // $84.20 / 17.01lb
      { date: "2026-04-14", price: 5.29 }, // $100.03 / ~18.9lb
      { date: "2026-04-20", price: 5.29 }, // $99.66 / 18.91lb
      { date: "2026-04-27", price: 5.29 }, // $90.04 / 17.02lb
    ],
    updated: "2026-04-27",
  },
  {
    name: "Pork Belly",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 3.48,
    history: [
      { date: "2026-03-16", price: 3.73 }, // $46.92 / 12.58lb
      { date: "2026-04-20", price: 3.48 }, // $43.26 / 12.43lb (Pork Belly S/On 23.88lb @$3.48/lb — likely 2 packs)
    ],
    updated: "2026-04-20",
  },
  {
    name: "Turkey Breast",
    vendor: "Harris Teeter",
    unit: "lb",
    price: 2.50,
    history: [
      { date: "2026-01-05", price: 12.75 }, // $63.75 / 5 units (legacy per-unit pricing)
      { date: "2026-01-16", price: 17.03 }, // $68.13 / 4 units (legacy per-unit pricing)
      { date: "2026-02-02", price: 19.65 }, // $78.58 / 4 units (legacy per-unit pricing)
      { date: "2026-04-27", price: 1.99 },  // VIC sale price — $8.52 / 4.26lb
      { date: "2026-05-12", price: 2.50 },  // Regular shelf — 4 units totaling $68.77 (~27.5lb @ $2.50/lb)
    ],
    updated: "2026-05-12",
    notes: "Each unit = 2 breasts attached to keel/breast plate. Regular: $2.50/lb. VIC sale: $1.99/lb.",
  },
  {
    name: "Chicken Breast",
    vendor: "Sam's Club",
    unit: "lb",
    price: 2.88,
    history: [
      { date: "2026-04-27", price: 2.88 }, // $17.40 / 6.04lb confirmed on receipt
    ],
    updated: "2026-04-27",
  },
  {
    name: "Chicken Thighs",
    vendor: "Sam's Club",
    unit: "lb",
    price: 3.48,
    history: [
      { date: "2026-05-18", price: 3.48 }, // B/S Thighs 4.7lb @ $3.48 + 5.02lb @ $3.48
    ],
    updated: "2026-05-18",
    notes: "Boneless/skinless thighs",
  },
  {
    name: "Sliced Bacon",
    vendor: "Sam's Club",
    unit: "lb",
    price: 4.28,
    history: [
      { date: "2026-05-15", price: 4.28 }, // MM Bacon 3lb @ $12.83
    ],
    updated: "2026-05-15",
    notes: "Member's Mark sliced bacon — backup when house-smoked pork belly isn't ready, also for biscuit & gravy special",
  },
  {
    name: "Breakfast Sausage",
    vendor: "Sam's Club",
    unit: "lb",
    price: 3.67,
    history: [
      { date: "2026-05-15", price: 3.67 }, // Sausage 2lb pack @ $7.34
    ],
    updated: "2026-05-15",
    notes: "For biscuit & gravy special",
  },

  // ── Bread ──────────────────────────────────────────────────────────────────
  {
    name: "Ciabatta Roll",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 3.94,
    history: [
      { date: "2026-02-24", price: 3.94 }, // $11.82 / 3
      { date: "2026-04-09", price: 3.94 }, // $15.76 / 4
      { date: "2026-04-11", price: 3.94 },
      { date: "2026-04-14", price: 3.94 },
      { date: "2026-04-16", price: 3.94 },
      { date: "2026-04-23", price: 3.94 },
      { date: "2026-04-25", price: 3.94 },
      { date: "2026-04-28", price: 3.94 },
      { date: "2026-05-09", price: 3.94 },
      { date: "2026-05-14", price: 3.94 },
    ],
    updated: "2026-05-14",
  },
  {
    name: "Focaccia Sheet",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 17.90,
    history: [
      { date: "2026-02-24", price: 17.90 },
      { date: "2026-04-09", price: 17.90 },
      { date: "2026-05-09", price: 17.90 },
      { date: "2026-05-14", price: 17.90 },
    ],
    updated: "2026-05-14",
  },
  {
    name: "Deli Rye Loaf",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 7.27,
    history: [
      { date: "2026-04-14", price: 7.27 }, // $43.62 / 6 loaves
      { date: "2026-04-28", price: 7.27 },
    ],
    updated: "2026-04-28",
  },
  {
    name: "Hoagie Roll",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 0.94,
    history: [
      { date: "2026-02-24", price: 0.94 }, // $11.28 / 12
      { date: "2026-05-14", price: 0.94 }, // $11.28 / 12
    ],
    updated: "2026-05-14",
  },
  {
    name: "City White Sourdough",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 5.93,
    history: [
      { date: "2026-04-09", price: 5.93 },
      { date: "2026-05-09", price: 5.93 },
      { date: "2026-05-14", price: 5.93 },
    ],
    updated: "2026-05-14",
  },
  {
    name: "Chocolate Chess Tart",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 23.93,
    history: [
      { date: "2026-05-09", price: 23.93 }, // LARGE format
    ],
    updated: "2026-05-09",
    notes: "Large format — confirm portions per tart for dessert cost card",
  },

  // ── Produce ────────────────────────────────────────────────────────────────
  {
    name: "Sweet Peppers",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 2.97,
    history: [
      { date: "2026-02-09", price: 1.83 }, // Red Pepper Bag 5lb @ $9.14
      { date: "2026-04-27", price: 2.97 }, // Bag Pepper Orange 5lb @ $14.85
    ],
    updated: "2026-04-27",
  },
  {
    name: "Sweet Onion",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.79,
    history: [
      { date: "2026-04-27", price: 0.79 }, // Onion YD/Sweet 10lb @ $7.90
    ],
    updated: "2026-04-27",
  },
  {
    name: "Avocado",
    vendor: "Sam's Club",
    unit: "each",
    price: 0.55,
    history: [
      { date: "2026-04-06", price: 0.55 }, // $4.37 / 8ct est
    ],
    updated: "2026-04-06",
  },
  {
    name: "Lemon",
    vendor: "Sam's Club",
    unit: "lb",
    price: 1.28,
    history: [
      { date: "2026-04-06", price: 1.31 }, // 3lb bag @ $3.92
      { date: "2026-05-15", price: 1.28 }, // 3lb bag @ $3.85
      { date: "2026-05-18", price: 1.28 }, // 3lb bag @ $3.85
    ],
    updated: "2026-05-18",
  },
  {
    name: "Goat Cheese",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 7.50,
    history: [
      { date: "2025-11-15", price: 7.50 }, // Crumble 2lb @ $14.99
      { date: "2026-02-09", price: 7.50 },
      { date: "2026-04-20", price: 7.92 }, // Crumbs 2lb @ $15.84
      { date: "2026-04-27", price: 4.71 }, // Chevrai 10.5oz @ $4.71 (small format)
    ],
    updated: "2026-04-20",
  },
  {
    name: "Honeycrisp Apples",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 2.70,
    history: [
      { date: "2026-02-09", price: 1.94 }, // $7.75 / 4lb est
      { date: "2026-04-20", price: 2.70 }, // $16.19 / 6lb est
    ],
    updated: "2026-04-20",
  },
  {
    name: "Green Cabbage",
    vendor: "Harris Teeter",
    unit: "lb",
    price: 0.99,
    history: [
      { date: "2026-01-05", price: 1.00 }, // 3.27lb @ $3.24
      { date: "2026-02-14", price: 0.99 }, // 4.11lb @ $4.07
    ],
    updated: "2026-02-14",
  },
  {
    name: "Beets",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.98,
    history: [
      { date: "2026-02-02", price: 0.59 }, // 25lb @ $14.65
      { date: "2026-04-27", price: 0.98 }, // 25lb @ $24.40
    ],
    updated: "2026-04-27",
  },
  {
    name: "Celery",
    vendor: "Sam's Club",
    unit: "lb",
    price: 1.70,
    history: [
      { date: "2026-02-13", price: 1.70 }, // Celery Stk 2.5# @ $4.24
    ],
    updated: "2026-02-13",
  },
  {
    name: "Parsley",
    vendor: "Harris Teeter",
    unit: "each",
    price: 1.99,
    history: [
      { date: "2026-02-14", price: 1.99 }, // Parsley bunch @ $1.99
      { date: "2026-04-27", price: 1.99 }, // Parsley bunch @ $1.99
    ],
    updated: "2026-04-27",
  },
  {
    name: "Yellow Potato",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.40,
    history: [
      { date: "2026-02-09", price: 0.40 }, // ESTIMATED — "Yellow Potato" @ $20.02, case weight not on receipt (assumed 50lb)
    ],
    updated: "2026-02-09",
    notes: "Estimated from RD receipt — confirm case weight (assumed 50lb at $20.02)",
  },
  {
    name: "Pistachios",
    vendor: "Sam's Club",
    unit: "lb",
    price: 8.99,
    history: [
      { date: "2026-04-06", price: 8.99 }, // $17.98 / 2lb est
      { date: "2026-05-15", price: 8.99 }, // $17.98 / 2lb — confirmed same product
    ],
    updated: "2026-05-15",
  },

  // ── Dairy ──────────────────────────────────────────────────────────────────
  {
    name: "Mayonnaise",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.109,
    history: [
      { date: "2026-02-02", price: 0.110 }, // Mayo Ex Hvy Ken 4gal @ $56.42 / 512oz
      { date: "2026-04-14", price: 0.109 }, // $55.82 / 512oz
    ],
    updated: "2026-04-14",
  },
  {
    name: "Heavy Cream",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.054,
    history: [
      { date: "2025-10-30", price: 0.054 }, // MK Heavy Cream $7.22 / ~133oz est (half gallon)
    ],
    updated: "2025-10-30",
  },
  {
    name: "Unsalted Butter",
    vendor: "Sam's Club",
    unit: "lb",
    price: 5.48,
    history: [
      { date: "2026-04-17", price: 5.48 }, // $10.96 / 2lb
    ],
    updated: "2026-04-17",
  },
  {
    name: "Eggs",
    vendor: "Sam's Club",
    unit: "each",
    price: 0.20,
    history: [
      { date: "2026-04-27", price: 0.19 }, // MM Eggs 24ct @ $4.67
      { date: "2026-05-15", price: 0.20 }, // MM Egg 24ct @ $4.84 (x2 packs)
    ],
    updated: "2026-05-15",
  },
  {
    name: "Whole Milk",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.030,
    history: [
      { date: "2026-04-27", price: 0.036 }, // $3.42 / ~96oz est (3qt)
      { date: "2026-05-15", price: 0.030 }, // $2.92 / ~96oz est
    ],
    updated: "2026-05-15",
  },
  {
    name: "Cream Cheese",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.202,
    history: [
      { date: "2026-04-17", price: 0.202 }, // $6.47 / 32oz
    ],
    updated: "2026-04-17",
  },
  {
    name: "Parmesan Wedge",
    vendor: "Sam's Club",
    unit: "lb",
    price: 6.58,
    history: [
      { date: "2026-05-18", price: 6.58 }, // ParmWedge 1.78lb @ $6.58/lb
    ],
    updated: "2026-05-18",
  },

  // ── Produce (continued) ────────────────────────────────────────────────────
  {
    name: "Iceberg Lettuce",
    vendor: "Sam's Club",
    unit: "each",
    price: 2.13,
    history: [
      { date: "2025-10-17", price: 3.97 }, // Lettuce 2ct @ $7.94 → $3.97/head
      { date: "2025-10-26", price: 1.99 }, // Lettuce 2ct @ $3.97 → $1.99/head
      { date: "2025-11-10", price: 1.99 }, // Lettuce 2ct @ $3.97 → $1.99/head
      { date: "2025-11-19", price: 1.83 }, // Lettuce 2ct x2 @ $7.30 → $1.83/head
      { date: "2026-04-06", price: 1.56 }, // Lettuce 2ct @ $3.12 → $1.56/head
      { date: "2026-04-21", price: 1.48 }, // Lettuce 2ct @ $2.95 → $1.48/head
      { date: "2026-04-27", price: 1.71 }, // Lettuce 2ct @ $3.42 → $1.71/head
      { date: "2026-05-15", price: 2.13 }, // Lettuce 2ct @ $4.26 → $2.13/head
    ],
    updated: "2026-05-15",
  },

  // ── Condiments ─────────────────────────────────────────────────────────────
  {
    name: "Sauerkraut",
    vendor: "Sysco",
    unit: "oz",
    price: 0.020,
    history: [
      { date: "2026-05-03", price: 0.087 }, // ESTIMATE (pre-receipt)
      { date: "2026-04-20", price: 0.020 }, // Confirmed — Sauerkraut Shredded FCY 12gal @ $30.85 / 1,536oz
    ],
    updated: "2026-04-20",
  },
  {
    name: "House Pickles",
    vendor: "House",
    unit: "oz",
    price: 0.090,
    history: [
      { date: "2026-05-03", price: 0.090 }, // ESTIMATE — cucumber ~$1.25/lb + brine cost
    ],
    updated: "2026-05-03",
    notes: "Estimated from cucumber cost — update when cucumber price confirmed",
  },
  {
    name: "1,000 Island",
    vendor: "House",
    unit: "oz",
    price: 0.094,
    history: [
      { date: "2026-05-03", price: 0.094 }, // ESTIMATE — batch: mayo+ketchup+pickle+onion+lemon / 91oz
    ],
    updated: "2026-05-03",
    notes: "Estimated — update ketchup/pickle prices when confirmed",
  },
  {
    name: "Mustard Aioli",
    vendor: "House",
    unit: "oz",
    price: 0.104,
    history: [
      { date: "2026-05-03", price: 0.104 }, // Batch: 4C mayo + ¼C lemon + ½C + 2Tbl creole mustard + herbs/onion ≈ $4.59 / 44 oz
    ],
    updated: "2026-05-03",
    notes: "House recipe — recalculate if creole mustard or mayo price changes",
  },
  {
    name: "Creole Mustard",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.134,
    history: [
      { date: "2026-02-02", price: 0.134 }, // Mustard Creole 2qt Gal @ $17.21 / 128oz
      { date: "2026-04-27", price: 0.134 }, // Mustard Creole ZTR Gal @ $17.21 / 128oz
    ],
    updated: "2026-04-27",
    notes: "Replaces Sysco Whole Grain Mustard across all recipes",
  },
  {
    name: "Worcestershire Sauce",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.235,
    history: [
      { date: "2026-05-15", price: 0.235 }, // L&P 20oz bottle, 2-pack $9.38 → $4.69/bottle / 20oz
    ],
    updated: "2026-05-15",
    notes: "Lea & Perrins 20oz bottle",
  },

  // ── Pantry ─────────────────────────────────────────────────────────────────
  {
    name: "Olive Oil",
    vendor: "Sysco",
    unit: "oz",
    price: 0.452,
    history: [
      { date: "2026-04-20", price: 0.452 }, // Corto EVOO — Oil Olive Extra Virgin 10L BIB @ $152.75 / 338oz
    ],
    updated: "2026-04-20",
    notes: "Corto brand, Sysco 10L bag-in-box",
  },
  {
    name: "Kosher Salt",
    vendor: "Sysco",
    unit: "lb",
    price: 0.40,
    history: [
      { date: "2026-04-20", price: 0.40 }, // Flake Coarse 123lb @ $49.49
    ],
    updated: "2026-04-20",
  },
  {
    name: "Brown Sugar",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.95,
    history: [
      { date: "2026-04-27", price: 0.95 }, // Lt Dom 25lb @ $23.70
    ],
    updated: "2026-04-27",
  },
  {
    name: "Apple Cider Vinegar",
    vendor: "Sysco",
    unit: "oz",
    price: 0.043,
    history: [
      { date: "2026-04-20", price: 0.043 }, // 1gal @ $43.85 / 128oz (4 units → $10.96/gal... wait, $43.85 total)
    ],
    updated: "2026-04-20",
  },
  {
    name: "Pecan Halves",
    vendor: "Sam's Club",
    unit: "lb",
    price: 9.99,
    history: [
      { date: "2026-04-17", price: 9.99 }, // $14.98 / 1.5lb est
    ],
    updated: "2026-04-17",
  },
  {
    name: "Maple Syrup",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.624,
    history: [
      { date: "2026-04-27", price: 0.624 }, // MM Org Maple Syrup $11.98 / ~32oz est
    ],
    updated: "2026-04-27",
  },
];
