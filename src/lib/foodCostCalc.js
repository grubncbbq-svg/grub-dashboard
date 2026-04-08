import { PRICE_BOOK } from "../data/priceBook.js";
import { COST_CARDS } from "../data/costCards.js";
import { MENU_ITEMS } from "../data/menu.js";

/**
 * Look up the current price per unit for an ingredient from the Price Book.
 * Returns null if the ingredient isn't in the book yet.
 */
export function getIngredientPrice(ingredientName) {
  const entry = PRICE_BOOK.find(
    (p) => p.name.toLowerCase() === ingredientName.toLowerCase()
  );
  return entry ? entry.price : null;
}

/**
 * Calculate the total food cost (in dollars) for a single cost card.
 * Returns null if any ingredient is missing from the Price Book.
 *
 * Formula per component:
 *   (rawAmount / (yieldPct / 100)) * pricePerUnit
 */
export function calcDishCost(costCard) {
  let total = 0;
  for (const comp of costCard.components) {
    const unitPrice = getIngredientPrice(comp.ingredient);
    if (unitPrice === null) return null; // can't calculate without price
    const yieldMultiplier = (comp.yieldPct || 100) / 100;
    total += (comp.rawAmount / yieldMultiplier) * unitPrice;
  }
  return total;
}

/**
 * Calculate food cost percentage for a dish.
 * Returns null if cost can't be calculated.
 */
export function calcFoodCostPct(menuItemName) {
  const card = COST_CARDS.find((c) => c.menuItem === menuItemName);
  if (!card) return null;

  const item = MENU_ITEMS.find((m) => m.name === menuItemName);
  if (!item) return null;

  const cost = calcDishCost(card);
  if (cost === null) return null;

  return (cost / item.price) * 100;
}

/**
 * Get food cost data for all menu items.
 * Returns enriched menu items with calculated foodCostPct.
 */
export function getAllFoodCosts() {
  return MENU_ITEMS.map((item) => ({
    ...item,
    foodCostPct: calcFoodCostPct(item.name),
  }));
}
