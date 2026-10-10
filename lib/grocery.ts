import { GroceryItem, GroceryCategory, GROCERY_CATEGORIES, WeekPlan, DAYS, MEAL_TYPES } from "./types";
import { getRecipeById } from "./recipes";

export function buildGroceryList(plan: WeekPlan): GroceryItem[] {
  const itemMap = new Map<string, GroceryItem>();

  for (const day of DAYS) {
    for (const meal of MEAL_TYPES) {
      const slot = plan.meals[day][meal];
      if (!slot.recipeId) continue;

      const recipe = getRecipeById(slot.recipeId);
      if (!recipe) continue;

      const servingMultiplier = slot.servings / recipe.servings;

      for (const ing of recipe.ingredients) {
        const key = `${ing.name.toLowerCase()}|${ing.unit}`;
        const existing = itemMap.get(key);

        if (existing) {
          existing.quantity += ing.quantity * servingMultiplier;
          if (!existing.fromRecipes.includes(recipe.name)) {
            existing.fromRecipes.push(recipe.name);
          }
        } else {
          itemMap.set(key, {
            name: ing.name,
            quantity: Math.round(ing.quantity * servingMultiplier * 100) / 100,
            unit: ing.unit,
            category: ing.category,
            checked: false,
            fromRecipes: [recipe.name],
          });
        }
      }
    }
  }

  const items = Array.from(itemMap.values());

  // Sort by grocery category order, then alphabetically within
  items.sort((a, b) => {
    const catA = GROCERY_CATEGORIES.indexOf(a.category);
    const catB = GROCERY_CATEGORIES.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return a.name.localeCompare(b.name);
  });

  return items;
}

export function groupByCategory(
  items: GroceryItem[]
): Record<GroceryCategory, GroceryItem[]> {
  const groups: Record<string, GroceryItem[]> = {};
  for (const cat of GROCERY_CATEGORIES) {
    groups[cat] = [];
  }
  for (const item of items) {
    groups[item.category].push(item);
  }
  return groups as Record<GroceryCategory, GroceryItem[]>;
}

export function formatQuantity(qty: number, unit: string): string {
  const rounded = Math.round(qty * 100) / 100;
  const display = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
  return unit ? `${display} ${unit}` : display.toString();
}
