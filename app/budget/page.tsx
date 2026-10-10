"use client";

import { useEffect, useState } from "react";
import { AppState, DAYS, MEAL_TYPES, MealType, DayOfWeek } from "@/lib/types";
import { loadState, saveState, getWeekPlan } from "@/lib/db";
import { calculateBudget } from "@/lib/budget";
import { getRecipeById } from "@/lib/recipes";
import BudgetBar from "@/components/BudgetBar";
import { DollarSign, TrendingDown, UtensilsCrossed, PiggyBank, Save } from "lucide-react";

interface MealBreakdown {
  id: string;
  name: string;
  day: DayOfWeek;
  mealType: MealType;
  servings: number;
  cost: number;
}

export default function BudgetPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [budgetInput, setBudgetInput] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setBudgetInput(s.weeklyBudget.toString());
  }, []);

  if (!state) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const plan = getWeekPlan(state, state.currentWeek);
  const budgetVal = parseFloat(budgetInput) || 0;
  const summary = calculateBudget(plan, budgetVal);

  const breakdowns: MealBreakdown[] = [];
  for (const day of DAYS) {
    for (const meal of MEAL_TYPES) {
      const slot = plan.meals[day][meal];
      if (slot.recipeId) {
        const recipe = getRecipeById(slot.recipeId);
        if (recipe) {
          breakdowns.push({
            id: `${day}-${meal}`,
            name: recipe.name,
            day,
            mealType: meal,
            servings: slot.servings,
            cost: recipe.estimatedCost * slot.servings
          });
        }
      }
    }
  }

  breakdowns.sort((a, b) => b.cost - a.cost);

  const handleSaveBudget = () => {
    const newState = { ...state, weeklyBudget: budgetVal };
    setState(newState);
    saveState(newState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Budget</h1>
        <p className="text-slate-500 mt-1">Keep your grocery spending on track</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weekly Budget Goal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="block w-full pl-8 pr-12 py-2 border-slate-200 rounded-lg focus:ring-neat-500 focus:border-neat-500 shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveBudget}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-neat-600 text-white rounded-lg hover:bg-neat-700 font-medium transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? "Saved!" : "Save Budget"}</span>
              </button>
            </div>

            <div className="mb-8">
              <BudgetBar summary={summary} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Total Cost</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ${summary.totalCost.toFixed(2)}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${summary.isOverBudget ? 'bg-red-50 border-red-100' : 'bg-neat-50 border-neat-100'}`}>
                <div className={`flex items-center gap-2 mb-1 ${summary.isOverBudget ? 'text-red-600' : 'text-neat-600'}`}>
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Remaining</span>
                </div>
                <div className={`text-2xl font-bold ${summary.isOverBudget ? 'text-red-700' : 'text-neat-700'}`}>
                  ${summary.remaining.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Meals</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {summary.mealCount}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <PiggyBank className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Avg/Meal</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  ${summary.costPerMeal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Meal Cost Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Meal</th>
                    <th className="px-6 py-3 font-medium">Timing</th>
                    <th className="px-6 py-3 font-medium">Servings</th>
                    <th className="px-6 py-3 font-medium text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdowns.length > 0 ? (
                    breakdowns.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{b.name}</td>
                        <td className="px-6 py-4 text-slate-500 capitalize">{b.day} {b.mealType}</td>
                        <td className="px-6 py-4 text-slate-500">{b.servings}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 text-right">${b.cost.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No meals planned yet. Add meals to see your cost breakdown.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 sticky top-8">
            <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
              <span>💡</span> Budget Tips
            </h3>
            <ul className="space-y-4 text-amber-800 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-amber-500">1.</span>
                <span>Plan meals around ingredients you already have in your pantry or freezer to reduce your weekly shopping list.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-amber-500">2.</span>
                <span>Incorporate vegetarian meals like beans and lentils a few times a week. They are highly nutritious and very cost-effective.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-amber-500">3.</span>
                <span>Buy seasonal produce. Fruits and vegetables that are in season are usually cheaper and taste better.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-amber-500">4.</span>
                <span>Cook once, eat twice. Make larger portions for dinner and save the leftovers for lunch the next day to stretch your budget.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
