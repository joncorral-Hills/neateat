import { WeekPlan, DAYS, MEAL_TYPES } from "./types";
import { getRecipeById } from "./recipes";

export interface BudgetSummary {
  totalCost: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
  mealCount: number;
  costPerMeal: number;
}

export function calculateBudget(plan: WeekPlan, budget: number): BudgetSummary {
  let totalCost = 0;
  let mealCount = 0;

  for (const day of DAYS) {
    for (const meal of MEAL_TYPES) {
      const slot = plan.meals[day][meal];
      if (!slot.recipeId) continue;

      const recipe = getRecipeById(slot.recipeId);
      if (!recipe) continue;

      totalCost += recipe.estimatedCost * slot.servings;
      mealCount++;
    }
  }

  totalCost = Math.round(totalCost * 100) / 100;

  return {
    totalCost,
    budget,
    remaining: Math.round((budget - totalCost) * 100) / 100,
    percentUsed: budget > 0 ? Math.min((totalCost / budget) * 100, 100) : 0,
    isOverBudget: totalCost > budget,
    mealCount,
    costPerMeal: mealCount > 0 ? Math.round((totalCost / mealCount) * 100) / 100 : 0,
  };
}
