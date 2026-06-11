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
      { date: "2026-06-01", price: 4.97 },  // 4.25lb + 5.35lb @ $4.97 — stable
      { date: "2026-06-08", price: 4.97 },  // 5.19lb + 5.27lb @ $4.97 — stable
    ],
    updated: "2026-06-08",
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
    name: "Beef Short Rib",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 6.78,
    history: [
      { date: "2026-05-26", price: 6.78 }, // BF Sab Chuck Short Rib R/W 13.97lb @ $6.78
    ],
    updated: "2026-05-26",
    notes: "Boneless chuck short rib — confirm menu use",
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
      { date: "2026-05-13", price: 5.27 }, // Slight decrease from $5.29 (exact weight unreadable on receipt)
      { date: "2026-05-26", price: 5.81 }, // $132.87 / 22.87lb — notable jump
      { date: "2026-06-07", price: 5.90 }, // $219.36 / 37.18lb — still climbing (+12% since early May)
    ],
    updated: "2026-06-07",
    notes: "PRICE TREND WATCH: $5.27 → $5.81 → $5.90 over 4 weeks. Pressure on Pastrami margin.",
  },
  {
    name: "Pork Belly",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 3.54,
    history: [
      { date: "2026-03-16", price: 3.73 }, // $46.92 / 12.58lb
      { date: "2026-04-20", price: 3.48 }, // $43.26 / 12.43lb (Pork Belly S/On 23.88lb @$3.48/lb — likely 2 packs)
      { date: "2026-05-13", price: 3.54 }, // $48.44 / 13.7lb
      { date: "2026-06-07", price: 3.32 }, // $47.14 / 14.2lb — down
    ],
    updated: "2026-06-07",
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
      { date: "2026-05-25", price: 2.50 },  // 4 units $18.77+$17.83+$18.59+$19.28 = $74.47 (~29.8lb @ $2.50)
    ],
    updated: "2026-05-25",
    notes: "Each unit = 2 breasts attached to keel/breast plate. Regular: $2.50/lb. VIC sale: $1.99/lb.",
  },
  {
    name: "Chicken Breast",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 1.59,
    history: [
      { date: "2026-04-27", price: 2.88 }, // Sam's $17.40 / 6.04lb
      { date: "2026-05-13", price: 1.88 }, // RD case 40lb @ $75.20
      { date: "2026-06-07", price: 1.59 }, // RD case 40lb @ $63.60 — down again
    ],
    updated: "2026-06-07",
    notes: "Restaurant Depot case pricing — well below Sam's",
  },
  {
    name: "Chicken Thighs",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 2.30,
    history: [
      { date: "2026-05-18", price: 3.48 }, // Sam's B/S Thighs 4.7lb + 5.02lb @ $3.48
      { date: "2026-05-13", price: 2.30 }, // RD case 40lb @ $92.00
      { date: "2026-05-26", price: 2.22 }, // RD case 40lb @ $88.80 — slight drop
    ],
    updated: "2026-05-26",
    notes: "Boneless/skinless thighs — RD case pricing",
  },
  {
    name: "Sliced Bacon",
    vendor: "Sam's Club",
    unit: "lb",
    price: 4.18,
    history: [
      { date: "2026-05-15", price: 4.28 }, // MM Bacon 3lb @ $12.83
      { date: "2026-06-03", price: 4.18 }, // Smithfield Bacon 3lb @ $12.54
    ],
    updated: "2026-06-03",
    notes: "Member's Mark sliced bacon — backup when house-smoked pork belly isn't ready, also for biscuit & gravy special",
  },
  {
    name: "Breakfast Sausage",
    vendor: "Sam's Club",
    unit: "lb",
    price: 3.67,
    history: [
      { date: "2026-05-15", price: 3.67 }, // Sausage 2lb pack @ $7.34
      { date: "2026-06-03", price: 3.67 }, // Sausage 2lb pack @ $7.34 — stable
    ],
    updated: "2026-06-03",
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
  {
    name: "Apple Bourbon Cake",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 23.99,
    history: [
      { date: "2026-05-28", price: 23.99 },
    ],
    updated: "2026-05-28",
    notes: "Special dessert — no cost card needed (finished product)",
  },
  {
    name: "Chocolate Chunk Brownies",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 3.71,
    history: [
      { date: "2026-04-09", price: 3.71 }, // $22.26 / 6
      { date: "2026-05-30", price: 3.71 }, // $22.26 / 6
    ],
    updated: "2026-05-30",
    notes: "Special dessert — no cost card needed (finished product)",
  },

  {
    name: "Strong Arm Delivery Fee",
    vendor: "Strong Arm Baking",
    unit: "each",
    price: 12.00,
    history: [
      { date: "2026-06-04", price: 12.00 }, // First appearance on packing slip
      { date: "2026-06-06", price: 12.00 },
      { date: "2026-06-09", price: 12.00 },
      { date: "2026-06-11", price: 12.00 }, // Confirmed on every June delivery
    ],
    updated: "2026-06-11",
    notes: "NEW as of June 2026 — $12/delivery. On a typical $60-73 order this adds ~16-20% to effective bread cost. Factor into bread unit costs or consolidate deliveries.",
  },

  // ── Produce ────────────────────────────────────────────────────────────────
  {
    name: "Sweet Peppers",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 2.61,
    history: [
      { date: "2026-02-09", price: 1.83 }, // Red Pepper Bag 5lb @ $9.14
      { date: "2026-04-27", price: 2.97 }, // Bag Pepper Orange 5lb @ $14.85
      { date: "2026-05-06", price: 3.52 }, // Orange Pepper 5lb @ $17.59
      { date: "2026-05-13", price: 3.82 }, // Red Pepper 5lb @ $19.09
      { date: "2026-05-26", price: 3.70 }, // Red Pepper 5lb @ $18.50
      { date: "2026-06-07", price: 2.61 }, // Red Pepper 5lb @ $13.07 — big drop
    ],
    updated: "2026-06-07",
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
    name: "Yellow Onion",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.52,
    history: [
      { date: "2026-06-07", price: 0.52 }, // Onion Ylw Jumbo 50lb @ $25.98
    ],
    updated: "2026-06-07",
    notes: "50lb jumbo case — confirm whether this replaces Sweet Onion in some recipes",
  },
  {
    name: "Red Onion",
    vendor: "Sam's Club",
    unit: "lb",
    price: 1.99,
    history: [
      { date: "2026-06-01", price: 1.99 }, // Sam's $5.96 — assumed 3lb bag
    ],
    updated: "2026-06-01",
    notes: "Used for pickled red onions on the menu. Bag weight assumed 3lb — confirm.",
  },
  {
    name: "Sweet Potato",
    vendor: "Sam's Club",
    unit: "lb",
    price: 1.64,
    history: [
      { date: "2026-05-27", price: 1.64 }, // Org Sweet Potato $4.92 — assumed 3lb pack
      { date: "2026-06-01", price: 1.64 }, // confirmed stable
    ],
    updated: "2026-06-01",
    notes: "Used for sweet potato cinnamon roll. Pack weight assumed 3lb — confirm.",
  },
  {
    name: "Artichokes",
    vendor: "Sam's Club",
    unit: "oz",
    price: 0.421,
    history: [
      { date: "2026-06-01", price: 0.421 }, // Jarred, 530g (18.69oz) drained @ $7.86
    ],
    updated: "2026-06-01",
    notes: "Jarred product, 530g drained weight per jar. For Veggie Lovers sandwich. Price is per oz drained.",
  },
  {
    name: "Mini Cucumber",
    vendor: "Restaurant Depot",
    unit: "each",
    price: 0.298,
    history: [
      { date: "2026-05-26", price: 0.298 }, // RD 16ct bag @ $4.77 × 2 = $9.54
    ],
    updated: "2026-05-26",
    notes: "Used for House Pickles (pastrami sandwich). 16ct bag from RD.",
  },
  {
    name: "Avocado",
    vendor: "Restaurant Depot",
    unit: "each",
    price: 1.43,
    history: [
      { date: "2026-04-06", price: 0.55 }, // Sam's $4.37 / 8ct est (likely misread, switched to RD)
      { date: "2026-03-16", price: 1.09 }, // RD 8ct PB @ $8.68
      { date: "2026-04-14", price: 1.09 }, // RD 8ct @ $8.68
      { date: "2026-04-20", price: 1.11 }, // RD 8ct @ $8.84
      { date: "2026-04-27", price: 1.10 }, // RD 8ct PB @ $8.82
      { date: "2026-05-06", price: 1.62 }, // RD 8ct PB @ $12.94
      { date: "2026-05-13", price: 1.23 }, // RD 8ct PB @ $9.87
    ],
    updated: "2026-05-13",
    notes: "Price fluctuates — using ~$1.43/each as working average per David. RD 8ct PB format.",
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
    price: 7.74,
    history: [
      { date: "2025-11-15", price: 7.50 }, // Crumble 2lb @ $14.99
      { date: "2026-02-09", price: 7.50 },
      { date: "2026-04-20", price: 7.92 }, // Crumbs 2lb @ $15.84
      { date: "2026-04-27", price: 4.71 }, // Chevrai 10.5oz @ $4.71 (small format)
      { date: "2026-05-06", price: 8.03 }, // Crumb 2lb @ $16.05
      { date: "2026-05-13", price: 8.03 }, // Crumb 2lb @ $16.05 (×2 packs)
      { date: "2026-06-07", price: 7.74 }, // Crumb 2lb @ $15.47
    ],
    updated: "2026-06-07",
  },
  {
    name: "Romaine Hearts",
    vendor: "Restaurant Depot",
    unit: "each",
    price: 1.33,
    history: [
      { date: "2026-05-06", price: 1.33 }, // 6ct pack @ $7.99 → $1.33/heart
    ],
    updated: "2026-05-06",
    notes: "6ct pack at RD",
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
    price: 0.93,
    history: [
      { date: "2026-02-02", price: 0.59 }, // 25lb @ $14.65
      { date: "2026-04-27", price: 0.98 }, // 25lb @ $24.40
      { date: "2026-06-07", price: 0.93 }, // 25lb @ $23.21
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
      { date: "2026-05-23", price: 1.99 }, // Parsley bunch @ $1.99
      { date: "2026-06-01", price: 1.99 }, // Parsley bunch @ $1.99 (stable)
    ],
    updated: "2026-06-01",
  },
  {
    name: "Yellow Potato",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.47,
    history: [
      { date: "2026-02-09", price: 0.40 }, // "Yellow Potato" @ $20.02 (80ct case)
      { date: "2026-05-06", price: 0.41 }, // Potato 80ct @ $20.25 (assumed 50lb case)
      { date: "2026-06-07", price: 0.47 }, // Potato 80ct @ $23.26 (assumed 50lb case)
    ],
    updated: "2026-06-07",
    notes: "80ct case from RD at ~$20/case. Assuming 50lb per case.",
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
    price: 0.103,
    history: [
      { date: "2026-02-02", price: 0.110 }, // Mayo Ex Hvy Ken 4gal @ $56.42 / 512oz
      { date: "2026-04-14", price: 0.109 }, // $55.82 / 512oz
      { date: "2026-05-13", price: 0.109 }, // $55.82 / 512oz (confirmed stable)
      { date: "2026-06-07", price: 0.103 }, // $52.83 / 512oz
    ],
    updated: "2026-06-07",
  },
  {
    name: "Heavy Cream",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.145,
    history: [
      { date: "2025-10-30", price: 0.054 }, // Sam's MK Heavy Cream $7.22 / ~133oz est (half gallon)
      { date: "2026-06-07", price: 0.145 }, // RD Cream JF 40% UHT 32oz @ $4.65
    ],
    updated: "2026-06-07",
    notes: "RD 40% UHT 32oz format — pricier per oz than Sam's half-gallon but currently what's purchased",
  },
  {
    name: "Unsalted Butter",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 2.96,
    history: [
      { date: "2026-04-17", price: 5.48 }, // Sam's $10.96 / 2lb
      { date: "2026-05-06", price: 2.90 }, // RD BTR Unslt SLD JF 1lb @ $2.90 (×2)
      { date: "2026-05-13", price: 3.06 }, // RD BTR Unslt SLD JF 1lb @ $3.06
      { date: "2026-05-26", price: 2.96 }, // RD BTR Unslt SLD JF 1lb @ $2.96 (×3)
      { date: "2026-06-07", price: 2.94 }, // RD BTR Unslt SLD JF 1lb @ $2.94 (×5)
    ],
    updated: "2026-06-07",
    notes: "Restaurant Depot — much cheaper than Sam's",
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
    price: 0.027,
    history: [
      { date: "2026-04-27", price: 0.036 }, // $3.42 / ~96oz est (3qt)
      { date: "2026-05-15", price: 0.030 }, // $2.92 / ~96oz est
      { date: "2026-06-03", price: 0.032 }, // $3.06 / ~96oz est
      { date: "2026-06-08", price: 0.027 }, // $2.63 / ~96oz est
    ],
    updated: "2026-06-08",
  },
  {
    name: "Cream Cheese",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.139,
    history: [
      { date: "2026-04-17", price: 0.202 }, // Sam's Philly 32oz @ $6.47
      { date: "2026-05-13", price: 0.139 }, // RD Cream Loaf JF 3lb @ $6.66 = 48oz
      { date: "2026-05-26", price: 0.154 }, // RD Cream Loaf JF 3lb @ $7.37 = 48oz
      { date: "2026-06-07", price: 0.139 }, // RD Cream Loaf JF 3lb @ $6.68 = 48oz
    ],
    updated: "2026-06-07",
    notes: "Restaurant Depot Cream Loaf JF — used for cake/dessert frosting",
  },
  {
    name: "Parmesan Wedge",
    vendor: "Sam's Club",
    unit: "lb",
    price: 6.58,
    history: [
      { date: "2026-05-18", price: 6.58 }, // ParmWedge 1.78lb @ $6.58/lb
      { date: "2026-06-01", price: 6.58 }, // 1.57lb @ $6.58 — stable
    ],
    updated: "2026-06-01",
  },
  {
    name: "Parmigiano Reggiano",
    vendor: "Sam's Club",
    unit: "lb",
    price: 16.87,
    history: [
      { date: "2026-06-03", price: 16.87 }, // Parm Reg Wedge 1.29lb @ $16.87
    ],
    updated: "2026-06-03",
    notes: "Premium import — 2.5× the standard Parmesan Wedge. Confirm which menu items use which.",
  },
  {
    name: "Peeled Garlic",
    vendor: "Sam's Club",
    unit: "lb",
    price: 3.82,
    history: [
      { date: "2026-06-03", price: 3.82 }, // $11.47 — assumed 3lb jar
    ],
    updated: "2026-06-03",
    notes: "Assumed 3lb jar — confirm",
  },
  {
    name: "Steelhead Trout",
    vendor: "Sam's Club",
    unit: "lb",
    price: 9.76,
    history: [
      { date: "2026-06-03", price: 9.76 }, // 2.58lb @ $9.76 = $25.18
    ],
    updated: "2026-06-03",
    notes: "NEW — confirm menu use (special?). Highest per-lb protein in the book.",
  },
  {
    name: "Vegetable Oil",
    vendor: "Sam's Club",
    unit: "each",
    price: 12.88,
    history: [
      { date: "2026-06-03", price: 12.88 }, // MM PurVeg Oil — confirm jug size for per-oz
    ],
    updated: "2026-06-03",
    notes: "Confirm jug size to compute per-oz",
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
    notes: "Estimate stands — ketchup now confirmed at $0.104/oz (Heinz #10 can). When batch recipe shared, recalc with: Mayo $0.109/oz + Heinz $0.104/oz + House Pickles $0.090/oz + Red Onion + Lemon.",
  },
  {
    name: "Heinz Ketchup",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.104,
    history: [
      { date: "2026-05-26", price: 0.104 }, // #10 can ~109oz @ $11.36
    ],
    updated: "2026-05-26",
    notes: "Heinz #10 can (~109oz). For 1,000 Island dressing.",
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
  {
    name: "Dijon Mustard",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.550,
    history: [
      { date: "2026-05-06", price: 0.550 }, // French Dijon 50oz @ $27.52
    ],
    updated: "2026-05-06",
    notes: "French brand 50oz jar — used in Caesar dressing and several aiolis",
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
    name: "Bread Flour",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.42,
    history: [
      { date: "2026-05-26", price: 0.42 }, // Sir Galahad 50lb @ $21.16
    ],
    updated: "2026-05-26",
    notes: "King Arthur Sir Galahad — confirm if same flour used for biscuits / breading",
  },
  {
    name: "00 Pizza Flour",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 0.45,
    history: [
      { date: "2026-06-07", price: 0.45 }, // 00 Pizzeria 12.5kg (27.56lb) @ $12.49
    ],
    updated: "2026-06-07",
    notes: "Confirm menu use — pizza special? flatbread?",
  },
  {
    name: "Black Pepper",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 8.35,
    history: [
      { date: "2026-06-07", price: 8.35 }, // SP Black Pep Cafe 5lb @ $41.75
    ],
    updated: "2026-06-07",
    notes: "Café grind 5lb — pastrami rub + general use",
  },
  {
    name: "Ground Cinnamon",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 11.62,
    history: [
      { date: "2026-06-07", price: 11.62 }, // SP Cinnamon Grnd CQ 1lb
    ],
    updated: "2026-06-07",
    notes: "For sweet potato cinnamon roll",
  },
  {
    name: "Mustard Seed",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.36,
    history: [
      { date: "2026-06-07", price: 0.36 }, // SP Mustard Seed CQ 19oz @ $6.84
    ],
    updated: "2026-06-07",
    notes: "For pickling spice / pastrami cure",
  },
  {
    name: "Apple Cider Vinegar",
    vendor: "Restaurant Depot",
    unit: "oz",
    price: 0.046,
    history: [
      { date: "2026-04-20", price: 0.043 }, // Sysco 1gal @ $43.85 (assumed case)
      { date: "2026-05-26", price: 0.046 }, // RD 1gal @ $5.95 / 128oz
      { date: "2026-06-07", price: 0.045 }, // RD case 6×1gal @ $34.94 = $5.82/gal
    ],
    updated: "2026-06-07",
    notes: "Restaurant Depot — comparable price, easier sourcing",
  },
  {
    name: "Pecan Halves",
    vendor: "Restaurant Depot",
    unit: "lb",
    price: 8.49,
    history: [
      { date: "2026-04-17", price: 9.99 }, // Sam's $14.98 / 1.5lb est
      { date: "2026-05-26", price: 8.49 }, // RD CQ Nut Pecan Hlvs 3lb @ $25.48
    ],
    updated: "2026-05-26",
    notes: "Switched to Restaurant Depot — cheaper than Sam's ($9.99 → $8.49/lb)",
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
  {
    name: "Baking Powder",
    vendor: "Harris Teeter",
    unit: "each",
    price: 3.79,
    history: [
      { date: "2026-05-23", price: 3.79 },
    ],
    updated: "2026-05-23",
    notes: "Single can — for biscuits / batter. Confirm size for per-oz calc.",
  },
  {
    name: "Buttermilk",
    vendor: "Harris Teeter",
    unit: "each",
    price: 2.79,
    history: [
      { date: "2026-05-23", price: 2.79 }, // Charlie's Buttermilk
    ],
    updated: "2026-05-23",
    notes: "Charlie's brand — for biscuits. Confirm bottle size.",
  },

  // ── HT herbs / produce (restaurant) ───────────────────────────────────────
  {
    name: "Dill",
    vendor: "Harris Teeter",
    unit: "each",
    price: 2.99,
    history: [
      { date: "2026-06-01", price: 2.99 }, // Bunch Dill
    ],
    updated: "2026-06-01",
    notes: "Bunch — for pickling brine and garnish",
  },
  {
    name: "Yellow Corn",
    vendor: "Harris Teeter",
    unit: "each",
    price: 1.00,
    history: [
      { date: "2026-05-29", price: 1.00 }, // PC $0.99/lb / fresh corn ear — estimate
    ],
    updated: "2026-05-29",
    notes: "Restaurant use — confirm menu application and per-ear/per-lb basis",
  },
  {
    name: "Yellow Grits",
    vendor: "Harris Teeter",
    unit: "lb",
    price: 2.79,
    history: [
      { date: "2026-05-29", price: 2.79 }, // WT Yellow Grits @ $2.79/lb
    ],
    updated: "2026-05-29",
    notes: "Restaurant use — confirm menu application",
  },
  {
    name: "Asian Pears",
    vendor: "Harris Teeter",
    unit: "lb",
    price: 4.99,
    history: [
      { date: "2026-05-23", price: 4.99 }, // 1.19lb @ $4.99/lb = $5.94
    ],
    updated: "2026-05-23",
  },
  {
    name: "Bosc Pears",
    vendor: "Harris Teeter",
    unit: "lb",
    price: 2.93,
    history: [
      { date: "2026-01-05", price: 2.79 }, // 0.94lb @ $2.79/lb est
      { date: "2026-05-29", price: 2.93 }, // 1.20lb @ $2.93/lb
      { date: "2026-06-01", price: 0.99 }, // 1.21lb @ $0.99/lb (sale)
    ],
    updated: "2026-06-01",
  },

  // ── Resale (finished products sold as-is on the menu) ─────────────────────
  {
    name: "IBC Root Beer",
    vendor: "Restaurant Depot",
    unit: "each",
    price: 1.03,
    history: [
      { date: "2026-05-26", price: 1.03 }, // 24-pack @ $24.77
    ],
    updated: "2026-05-26",
    notes: "Menu resale — 12oz bottle. Confirm menu price for margin tracking.",
  },
  {
    name: "Cape Cod Chips",
    vendor: "Sam's Club",
    unit: "each",
    price: 0.499,
    history: [
      { date: "2026-06-01", price: 0.499 }, // Variety pack 30ct @ $14.98
    ],
    updated: "2026-06-01",
    notes: "Menu resale — single-serve bag. Confirm menu price for margin tracking.",
  },
  {
    name: "GP Tea",
    vendor: "Sam's Club",
    unit: "each",
    price: 0.943,
    history: [
      { date: "2026-05-23", price: 0.943 }, // 18-pack @ $16.98
    ],
    updated: "2026-05-23",
    notes: "Menu resale — bottled tea. Confirm menu price for margin tracking.",
  },
];
