// Menu items with prices — foodCost is null until cost cards are built
// foodCost = dollar cost per serving (not percentage)
export const MENU_ITEMS = [
  { name: "Pastrami", price: 17.50, foodCost: null, group: "Sandwiches" },
  { name: "Smoked Beef Cheek", price: 16.50, foodCost: null, group: "Sandwiches" },
  { name: "Smoked Turkey Breast", price: 15.50, foodCost: null, group: "Sandwiches" },
  { name: "Smoked Chicken Salad", price: 14.50, foodCost: null, group: "Sandwiches" },
  { name: "Veggie Lovers", price: 13.50, foodCost: null, group: "Sandwiches" },
  { name: "Smoked Chicken Breast Salad", price: 14.50, foodCost: null, group: "Salads" },
  { name: "Shrimp & Bacon Caesar", price: 16.50, foodCost: null, group: "Salads" },
  { name: "Chicken & Bacon Caesar", price: 14.50, foodCost: null, group: "Salads" },
  { name: "Kids Sandwich", price: 8.50, foodCost: null, group: "Kids" },
  { name: "PB&J", price: 7.50, foodCost: null, group: "Kids" },
  { name: "Smoked Bacon Potato Salad", price: 6.00, foodCost: null, group: "Sides" },
  { name: "Apple Coleslaw", price: 5.00, foodCost: null, group: "Sides" },
  { name: "Beet/Goat/Pistachio", price: 6.00, foodCost: null, group: "Sides" },
  { name: "Chips", price: 1.50, foodCost: null, group: "Sides" },
  { name: "SP Cinnamon Roll", price: 6.00, foodCost: null, group: "Dessert" },
];

export const TARGET_FC = 30; // target food cost %
