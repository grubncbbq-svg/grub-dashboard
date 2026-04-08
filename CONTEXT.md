# GRUB Smokehouse Dashboard — Claude Code Handoff

## Project Overview

Building a daily-use restaurant management dashboard for **GRUB Smokehouse** (Harvest Hospitality LLC), a BBQ/smokehouse in Youngsville, NC owned by David and Kristina Garrison. David uses this as a morning check-in tool before starting his day in the kitchen.

**Stack requested:** React web app, accessible on phone/tablet/desktop via browser. Host on Vercel (free tier is fine). Single-file or multi-file — dealer's choice, but must be maintainable for ongoing iteration.

**Why we're migrating:** Previously built as a single Claude.ai artifact (JSX). David was burning through message limits fast because the entire artifact was being re-processed on every turn. Moving to Claude Code so the code lives in files on disk.

---

## Business Context

- **Owner:** David Garrison (co-owner with wife Kristina)
- **EIN:** 39-3713768 (Harvest Hospitality LLC)
- **Location:** 14101 Capitol Blvd, Youngsville, NC 27596
- **Concept:** Smokehouse/BBQ, open 4-5 days/week
- **Rent:** $2,495/mo, no utility costs
- **Fixed overhead:** ~$2,945/mo (rent, insurance ~$100, Clover POS fees ~$150, bookkeeper ~$200)
- **Staffing:** No W-2 employees yet, actively hiring first prep cook/dishwasher
- **POS:** Clover
- **Website:** grubsmokehouse.com

### Sales trajectory
- 2025 full year (partial, ~5 mo operating): **$14,095.74 net** (~$1,175/mo avg)
- Q1 2026: **$15,605 net** (~$5,202/mo avg) — roughly **5x growth**
- 2025 total items sold: 1,723

### Payment mix (2025)
- Credit Card: $8,656.75 (52.5%)
- Debit Card: $6,379.61 (38.7%)
- Cash: $698.81 (4.2%)
- DoorDash: $672.64 (4.1%)
- Uber Eats: $78.14 (0.5%)

---

## Current Menu (March 2026)

### Sandwiches
| Item | Price | Description |
|---|---|---|
| Pastrami | $17.50 | House cured/smoked beef brisket, caramelized onions & sauerkraut, dill pickles, 1,000 island dressing, La Farm sourdough |
| Smoked Beef Cheek | $16.50 | Pickled peppers, caramelized onions, house aioli, ciabatta |
| Smoked Turkey Breast | $15.50 | Maple & chili glazed bacon, avocado, pickled onions, lettuce, mustard aioli, focaccia |
| Smoked Chicken Salad | $14.50 | Brined & smoked chicken, pickled onions, charred tomatoes, lettuce, lemon aioli, ciabatta |
| Veggie Lovers | $13.50 | Grilled peppers stuffed with artichoke heart & goat cheese tapenade, pickled onions, charred tomato, avocado, lettuce, aged balsamic, pistachio hummus, focaccia |

### Salads
| Item | Price | Description |
|---|---|---|
| Smoked Chicken Breast Salad | $14.50 | Apples, asian pears, pickled onions, goat cheese, candied pecans, seasonal lettuces, aged balsamic & EVOO |
| Fire Grilled Shrimp & Bacon Caesar | $16.50 | Croutons, bacon bits, parmigiano, avocado, housemade caesar |
| Smoked Chicken & Bacon Caesar | $14.50 | Same as shrimp version but w/ smoked chicken |

### Kids
- Sandwich (chicken or turkey) — $8.50
- PB&J — $7.50

### Sides
- Smoked Bacon Potato Salad — $6.00
- Apple Coleslaw — $5.00
- Beet/Goat Cheese/Pistachio — $6.00
- Chips — $1.50

### Dessert
- Sweet Potato Cinnamon Roll (browned butter frosting) — $6.00

### Drinks
- Bottled Water $3.00
- Topo Chico $3.50
- Soda $4.00
- Monster $5.00
- Apple Juice $3.50
- Chocolate Milk $3.50
- Sweet Tea $3.50

---

## Dashboard Tabs (Required Features)

The dashboard currently has **6 tabs**. Each needs to be rebuilt in the web app.

### 1. Overview Tab
- KPI cards: Q1 2026 Net Sales, 2025 Full Year, YoY Growth (~5x)
- Monthly sales trend bar chart (Aug 2025 → March 2026, with March shown as dashed/projected)
- 2025 Payment Mix bars (Credit, Debit, Cash, DoorDash, Uber Eats)

### 2. Food Cost Tab (⭐ THE KEY FEATURE — STILL TO BE BUILT OUT)
This is the priority feature. Requirements:
- **Top of tab:** Large display showing the menu-wide average food cost percentage
- **Target:** 30% (configurable)
- **Color coding:** Green ≤30%, amber 30-35%, red >35%
- **Below:** Every menu item grouped by category (Sandwiches, Salads, Kids, Sides, Dessert), each showing:
  - Dish name + selling price
  - Current food cost % in large numbers, color-coded
  - Status label (on target / watch / over)
  - Placeholder "not yet costed" for dishes without cost cards
- **Data model:** Each menu item links to a recipe cost card containing:
  - Raw ingredient list with quantities
  - Yield % (raw vs cooked/usable weight)
  - Portion size per serving
  - Linked to current ingredient prices from the Price Book (see below)
- **Auto-recalculation:** When new receipts come in and prices change, food cost % updates automatically across all dishes

### 3. Purchases Tab
- KPI cards: Restaurant Food, Home/Personal, Restaurant Supply (with $ and %)
- View toggle: Overview / Vendors / Top Items
- **Overview view:** Monthly restaurant food spend bar chart + stacked bar showing R/H/S split
- **Vendors view:** Bar chart by vendor (Sam's Club, Sysco, Coca-Cola, Restaurant Depot, Harris Teeter, Strong Arm Baking)
- **Top Items view:** Ranked list of biggest purchase categories

### 4. Recipes Tab
- Searchable recipe library (search by name or ingredient)
- Filter by category: Cures & Brines, Rubs & Seasonings, Sauces, Sides, Baked
- Grid of recipe cards → tap to view full ingredient list
- Full recipe view shows ingredients with amounts, category badge, notes

### 5. Calendar Tab
- Upcoming tax deadlines and bills
- Color-coded urgency (red ≤14 days, amber ≤30 days)
- Shows: date, form type, amount (for bills)

### 6. Expenses Tab
- KPI cards: Monthly Fixed Costs, Annual Fixed, Net After Fixed
- List of fixed monthly expenses
- Editable fields for Clover POS fees and Bookkeeper (user can update amounts)
- Percentage breakdown bars

---

## Data That Needs to Be Built Into the App

### Price Book (NEW — needs to be designed)
A master table of every ingredient purchased, linked to vendors and prices. Should track:
- Ingredient name (normalized, e.g. "Beef Cheek Meat")
- Vendor (Sam's Club, Sysco, Restaurant Depot, etc.)
- Unit (lb, oz, each, cup, etc.)
- Most recent price per unit
- Price history (so we can show if a price has gone up or down)
- Last updated date

When new receipts are uploaded/processed, the Price Book updates, which cascades into updated food cost percentages on every dish using that ingredient.

### Recipe Cost Cards (NEW — to be built dish by dish)
For each menu item:
```
{
  name: "Pastrami Sandwich",
  price: 17.50,
  components: [
    { ingredient: "Corned Beef Raw", rawAmount: 4, unit: "oz", yieldPct: 65 },
    { ingredient: "La Farm Sourdough", rawAmount: 2, unit: "slice" },
    { ingredient: "Sauerkraut", rawAmount: 1, unit: "oz" },
    { ingredient: "Caramelized Onions", rawAmount: 0.5, unit: "oz" },
    { ingredient: "Dill Pickles", rawAmount: 0.5, unit: "oz" },
    { ingredient: "1000 Island Dressing", rawAmount: 1, unit: "oz" }
  ],
  notes: "Yield on corned beef brisket ~65% after smoking and trim"
}
```

The food cost calc = sum of (rawAmount / yieldPct × pricePerUnit) for every component, divided by selling price.

### Recipes (14 already transcribed)
Bacon Brine, Bacon Cure (Large), Pastrami Rub, Pickling Liquid, 1,000 Island, Caesar Dressing, Mustard Aioli, Chicken Salad Mix, Potato Salad, Cinnamon Roll Dough, BB Frosting (Small), BB Frosting (Large), Cinnamon Sugar, Custard Base.

Full recipes with ingredients and amounts are in the existing artifact code — bring those over verbatim.

### Receipts / Purchase Data (441 line items already categorized)
Across 6 vendors covering Oct 2025 → Feb 2026:
- **Restaurant Food: $5,355.86** (~67% of spend)
- **Home/Personal: $1,503.54** (~19%)
- **Restaurant Supplies: $1,087.54** (~14%)
- **Total tracked: $7,946.94**

Top restaurant purchases by item:
1. Beef Cheeks — $1,548
2. Chicken (breast + thighs) — $892
3. Coca-Cola products — $622
4. Corned Beef/Brisket — $369
5. Turkey Breast — $283
6. Pork (belly/butt/loin) — $248
7. Olive Oil 10L — $142
8. Bread (Strong Arm) — $95

---

## Categorization Rules (for future receipt processing)

When new receipts come in, auto-categorize by keyword matching:

**Always Restaurant (R):**
- Proteins: chicken breast, B/S thighs, cheek meat, brisket, pork belly, pork tenderloin, corned beef, turkey breast, beef skirt, boston butt
- Bread: ciabatta, focaccia, hoagie, squishy white (all Strong Arm)
- Fuel: charcoal, kingsford, BBQ wood pellets
- Produce (restaurant staples): romaine, spinach, spring mix, avocado, tomato, sweet pepper, lemon, onion, celery, parsley, cabbage, arugula, dill, cilantro, lettuce, cucumber, beet
- Dairy: parmesan, goat cheese, feta, cream cheese, unsalted butter, heavy cream, MM Eggs
- Pantry: olive oil, vinegars, flour, salt, sugar, honey, maple syrup, yeast
- Specific: honeycrisp apples, bosc pears, artichokes, pecan halves, org sweet potato, yellow potato, pistachios, chocolate chips, whole milk
- Beverages: Coca-Cola, Diet Coke, Aquafina, Topo Chico, Cape Cod chips

**Always Home (H):**
- Fruit: bananas, blueberries, strawberries, mix fruit, gold kiwi, POM juice, oat milk, oatly
- Snacks: beef sticks, MG bites, KDK chewy bars, pistachios (Kristina's), skinny pop, craisins
- Personal: pork chops, t-bone steaks, angus T-bone, ground beef, yogurt, charcuterie platters, persimmon
- Cleaning/personal: soap, detergent, bath tissue, listerine, neosporin
- Clothing: hoodies, puffers, socks, gloves, boots
- Entertainment: JBL speaker, books, magazines, wine
- Other: Stonefire naan, rice noodles, vermicelli, jasmine rice, pearl olives, hand warmers, smartwater, oats

**Always Supply (S):**
- Paper goods: towels, napkins, foam plates, Chinet plates, cutlery, sandwich bags, t-shirt bags, multi-pk bags, roll wrap, steam pans
- Packaging: aluminum cases, bowls, cups, lids, film/cling wrap
- Cleaning: Keyston detergent, sanitizer, Mr Clean, soap dispensers, cheesecloth
- Equipment: thermometers, timers, Cambro containers, grill brush, pastry brush
- Other: heavy duty foil, 4pk lighters, fuel surcharges

---

## Existing Artifact Code

David needs to open his Grub project in Claude.ai, find the dashboard conversation, click the artifact, and download the JSX code. That code has:
- All the React components for all 6 tabs
- The complete recipe data (14 recipes with full ingredient lists)
- The purchase data structure
- The monthly sales estimates
- The calendar deadline list
- The expenses list

**Instruct David to paste the JSX file contents into the Claude Code project as a reference.** Claude Code should then refactor it into a proper multi-file React app structure.

---

## Suggested Project Structure

```
grub-dashboard/
├── package.json
├── README.md
├── CONTEXT.md          # This file
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── data/
│   │   ├── menu.js           # Menu items with prices
│   │   ├── recipes.js        # 14 transcribed recipes
│   │   ├── purchases.js      # Categorized receipt data
│   │   ├── priceBook.js      # NEW — ingredient prices
│   │   ├── costCards.js      # NEW — recipe cost cards per dish
│   │   ├── calendar.js       # Tax deadlines
│   │   └── expenses.js       # Fixed monthly expenses
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── OverviewTab.jsx
│   │   │   ├── FoodCostTab.jsx
│   │   │   ├── PurchasesTab.jsx
│   │   │   ├── RecipesTab.jsx
│   │   │   ├── CalendarTab.jsx
│   │   │   └── ExpensesTab.jsx
│   │   ├── shared/
│   │   │   ├── KPICard.jsx
│   │   │   ├── Bar.jsx
│   │   │   └── TabNav.jsx
│   ├── lib/
│   │   ├── foodCostCalc.js   # Core calculation engine
│   │   ├── categorize.js     # Receipt auto-categorization
│   │   └── theme.js          # Color constants (C object from artifact)
│   └── styles/
│       └── global.css
└── public/
    └── favicon.ico
```

---

## Design System

Keep the existing aesthetic from the artifact — dark smokehouse theme with amber accents.

```js
const C = {
  bg:"#0C0A07",        // deep black background
  card:"#141210",      // card background
  border:"#1E1A15",    // subtle borders
  accent:"#C8872E",    // GRUB amber (primary accent)
  accentDim:"#8B6914", // darker amber
  text:"#E8DCC8",      // primary text
  dim:"#8B7355",       // secondary text
  white:"#FAEBD7",     // headings/emphasis
  red:"#C0392B",       // GRUB red (warnings/over-budget)
  green:"#27AE60",     // on-target/positive
  blue:"#2980B9",      // supply/info
};
```

**Fonts:**
- Headings: `'Playfair Display', Georgia, serif` (elegant, characterful)
- Body: `'Crimson Pro', Georgia, serif` (refined, readable)

**Layout:**
- Mobile-first (David primarily uses it on phone/tablet)
- Max content width ~900px centered
- Tab nav at top, horizontal scroll on narrow screens
- Generous padding on cards (20px+)
- Rounded corners (12px on cards, 8px on inputs)

---

## Priority Build Order

1. **Scaffold the project** with Vite + React, set up Vercel deploy
2. **Move existing data files** (menu, recipes, purchases, calendar, expenses)
3. **Rebuild the 6 tabs** to match the existing artifact
4. **Design the Food Cost engine** — Price Book + Cost Cards + calculation logic
5. **Build receipt upload flow** — user uploads receipt image → (initially) manual entry form → Price Book updates → food costs recalc automatically
6. **Add persistence** — either localStorage for single-user or a simple backend (Supabase free tier works) if David wants data to sync across devices

---

## Open Design Questions for Claude Code

1. **Persistence strategy:** localStorage (simple, single device) vs Supabase (syncs phone/tablet/desktop but more setup)
2. **Receipt processing:** Manual entry form vs OCR integration (Claude API vision for auto-extraction)
3. **Auth:** Needed? David is sole user for now. Could defer until a second user needs access.
4. **Offline mode:** Nice-to-have — PWA with service worker would let David check the dashboard in the kitchen even without signal

---

## Ongoing Workflow (How David Will Use This)

1. **Every morning:** Opens dashboard on phone/tablet, checks Food Cost % and Calendar
2. **After grocery/vendor runs:** Snaps receipt photos, uploads via the app, prices update
3. **Cooking new dishes:** Weighs proteins raw → cooked, enters yield % for that dish's cost card
4. **Weekly:** Reviews Purchases tab to spot spend trends
5. **Monthly:** Updates Expenses tab with actual Clover/bookkeeper charges

---

## Notes for Claude Code

- David works in focused, multi-task sessions but doesn't want to rebuild tools repeatedly — make things persistent and reusable
- Prioritize readable code and clear file organization over clever abstractions
- The recipe cost card engine is the heart of this app — get that data model right first
- Don't recreate the full food cost data upfront — leave placeholders so we can add dishes one at a time when David is back in the kitchen
- The dashboard already works as a concept — this migration is about making it maintainable and efficient, not redesigning it
