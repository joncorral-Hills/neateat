export type MealType = "breakfast" | "lunch" | "dinner";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner"];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export type DietaryTag =
  | "Vegetarian"
  | "Vegan"
  | "Pescatarian"
  | "Gluten-Free"
  | "Dairy-Free"
  | "Low Calorie"
  | "High Protein"
  | "Quick"
  | "Healthy Comfort"
  | "Budget Friendly";

export type MealTypeTag = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type GroceryCategory =
  | "Produce"
  | "Protein"
  | "Dairy"
  | "Grains & Pasta"
  | "Pantry"
  | "Spices"
  | "Frozen"
  | "Other";

export const GROCERY_CATEGORIES: GroceryCategory[] = [
  "Produce",
  "Protein",
  "Dairy",
  "Grains & Pasta",
  "Pantry",
  "Spices",
  "Frozen",
  "Other",
];

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tags: (DietaryTag | MealTypeTag)[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimatedCost: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface MealSlotData {
  recipeId: string | null;
  servings: number;
}

export interface WeekPlan {
  weekStart: string;
  meals: Record<DayOfWeek, Record<MealType, MealSlotData>>;
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  checked: boolean;
  fromRecipes: string[];
}

export interface AppState {
  currentWeek: string;
  weekPlans: Record<string, WeekPlan>;
  weeklyBudget: number;
  checkedGroceryItems: string[];
}
