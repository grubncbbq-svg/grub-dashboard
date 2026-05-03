// Vercel serverless function — POST /api/scan-receipt
// Accepts a base64-encoded receipt image, sends to Claude Vision,
// returns structured line items with auto-categorization.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Categorization rules from CONTEXT.md
const RESTAURANT_KEYWORDS = [
  "chicken breast","b/s thighs","boneless skinless","cheek meat","beef cheek",
  "brisket","pork belly","pork tenderloin","corned beef","turkey breast",
  "beef skirt","boston butt","ciabatta","focaccia","hoagie","charcoal",
  "kingsford","wood pellets","romaine","spinach","spring mix","avocado",
  "tomato","sweet pepper","lemon","onion","celery","parsley","cabbage",
  "arugula","dill","cilantro","lettuce","cucumber","beet","parmesan",
  "goat cheese","feta","cream cheese","unsalted butter","heavy cream",
  "olive oil","vinegar","flour","salt","sugar","honey","maple syrup","yeast",
  "honeycrisp","bosc pear","artichoke","pecan","sweet potato","yellow potato",
  "pistachio","chocolate chip","whole milk","coca-cola","diet coke",
  "aquafina","topo chico","cape cod chip","strong arm","sir galahad",
  "eggs","egg","mayo","mayonnaise","mustard","dijon","ketchup","soy sauce",
  "worcestershire","capers","pickle","sauerkraut","aioli",
];

const HOME_KEYWORDS = [
  "banana","blueberr","strawberr","kiwi","pom juice","oat milk","oatly",
  "beef stick","pork chop","t-bone","ground beef","yogurt","charcuterie",
  "persimmon","soap","detergent","bath tissue","listerine","neosporin",
  "hoodie","puffer","socks","gloves","boots","jbl","speaker","book",
  "magazine","wine","naan","rice noodle","vermicelli","jasmine rice",
  "pearl olive","hand warmer","smartwater","oat","granola",
];

const SUPPLY_KEYWORDS = [
  "paper towel","napkin","foam plate","chinet","cutlery","sandwich bag",
  "t-shirt bag","roll wrap","steam pan","aluminum","bowl","cup","lid",
  "film","cling wrap","cheesecloth","thermometer","timer","cambro",
  "grill brush","pastry brush","heavy duty foil","lighter","fuel surcharge",
  "sanitizer","mr clean","soap dispenser","keyston","detergent",
];

function categorize(itemName) {
  const lower = itemName.toLowerCase();
  if (SUPPLY_KEYWORDS.some((k) => lower.includes(k))) return "S";
  if (HOME_KEYWORDS.some((k) => lower.includes(k))) return "H";
  if (RESTAURANT_KEYWORDS.some((k) => lower.includes(k))) return "R";
  return "R"; // default to restaurant if unknown — David can correct
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64, mediaType = "image/jpeg" } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 is required" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: `You are processing a grocery/restaurant supply receipt for GRUB Smokehouse, a BBQ restaurant.

Extract every line item from this receipt and return a JSON object with this exact structure:
{
  "vendor": "store name",
  "date": "YYYY-MM-DD or null",
  "total": 00.00,
  "items": [
    {
      "name": "item name as written on receipt",
      "quantity": 1,
      "unit": "lb/oz/each/pk/etc",
      "unit_price": 0.00,
      "total_price": 0.00
    }
  ]
}

Rules:
- Include every line item, even non-food items
- If quantity/unit is unclear, use quantity: 1, unit: "each"
- If you can't read a price, use null
- Return ONLY the JSON object, no explanation`,
            },
          ],
        },
      ],
    });

    const raw = message.content[0].text.trim();

    // Strip markdown code fences if present
    const jsonStr = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const parsed = JSON.parse(jsonStr);

    // Auto-categorize each item
    const items = parsed.items.map((item) => ({
      ...item,
      category: categorize(item.name),
      normalized_name: null, // David will confirm/edit in the UI
    }));

    return res.status(200).json({
      vendor: parsed.vendor,
      date: parsed.date,
      total: parsed.total,
      raw_text: raw,
      items,
    });
  } catch (err) {
    console.error("scan-receipt error:", err);
    return res.status(500).json({ error: err.message });
  }
}
