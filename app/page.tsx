"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppState, DayOfWeek, MealType, DAYS, MEAL_TYPES, WeekPlan } from "../lib/types";
import { loadState, saveState, getWeekPlan } from "../lib/db";
import { calculateBudget } from "../lib/budget";
import { getRecipeById } from "../lib/recipes";
import WeekSelector from "../components/WeekSelector";
import BudgetBar from "../components/BudgetBar";
import MealGrid from "../components/MealGrid";
import AddMealModal from "../components/AddMealModal";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<AppState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{day: DayOfWeek; mealType: MealType} | null>(null);
  const [suggesting, setSuggesting] = useState(false);

  useEffect(() => {
    setAppState(loadState());
  }, []);

  // Handle ?addRecipe=xxx from recipe detail page
  useEffect(() => {
    const addRecipeId = searchParams.get("addRecipe");
    if (addRecipeId && appState && getRecipeById(addRecipeId)) {
      setModalOpen(true);
      // Clear the search param from URL without navigation
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, appState]);

  useEffect(() => {
    if (appState) {
      saveState(appState);
    }
  }, [appState]);

  const handleWeekChange = useCallback((week: string) => {
    setAppState(prev => {
      if (!prev) return prev;
      return { ...prev, currentWeek: week };
    });
  }, []);

  const handleSlotClick = useCallback((day: DayOfWeek, mealType: MealType) => {
    setActiveSlot({ day, mealType });
    setModalOpen(true);
  }, []);

  const handleRemoveMeal = useCallback((day: DayOfWeek, mealType: MealType) => {
    setAppState(prev => {
      if (!prev) return prev;
      const updatedWeekPlans = { ...prev.weekPlans };
      const weekPlan = getWeekPlan(prev, prev.currentWeek);
      const newWeekPlan: WeekPlan = {
        ...weekPlan,
        meals: {
          ...weekPlan.meals,
          [day]: {
            ...weekPlan.meals[day],
            [mealType]: { recipeId: null, servings: 1 },
          },
        },
      };
      updatedWeekPlans[prev.currentWeek] = newWeekPlan;
      return { ...prev, weekPlans: updatedWeekPlans };
    });
  }, []);

  const handleSelectRecipe = useCallback((recipeId: string) => {
    setAppState(prev => {
      if (!prev || !activeSlot) return prev;
      const updatedWeekPlans = { ...prev.weekPlans };
      const weekPlan = getWeekPlan(prev, prev.currentWeek);
      const recipe = getRecipeById(recipeId);
      const newWeekPlan: WeekPlan = {
        ...weekPlan,
        meals: {
          ...weekPlan.meals,
          [activeSlot.day]: {
            ...weekPlan.meals[activeSlot.day],
            [activeSlot.mealType]: {
              recipeId,
              servings: recipe?.servings ?? 4,
            },
          },
        },
      };
      updatedWeekPlans[prev.currentWeek] = newWeekPlan;
      return { ...prev, weekPlans: updatedWeekPlans };
    });
    setModalOpen(false);
    setActiveSlot(null);
  }, [activeSlot]);

  const handleAutoFill = useCallback(async () => {
    if (!appState) return;
    const weekPlan = getWeekPlan(appState, appState.currentWeek);

    const emptySlots: { day: string; mealType: string }[] = [];
    const existingMeals: string[] = [];

    for (const day of DAYS) {
      for (const mt of MEAL_TYPES) {
        const slot = weekPlan.meals[day][mt];
        if (slot.recipeId) {
          existingMeals.push(slot.recipeId);
        } else {
          emptySlots.push({ day, mealType: mt });
        }
      }
    }

    if (emptySlots.length === 0) return;

    setSuggesting(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emptySlots,
          budget: appState.weeklyBudget,
          existingMeals,
        }),
      });
      const data = await res.json();

      if (data.suggestions && data.suggestions.length > 0) {
        setAppState(prev => {
          if (!prev) return prev;
          const updatedWeekPlans = { ...prev.weekPlans };
          const wp = { ...getWeekPlan(prev, prev.currentWeek) };
          const newMeals = { ...wp.meals };

          for (const s of data.suggestions) {
            const recipe = getRecipeById(s.recipeId);
            if (recipe) {
              newMeals[s.day as DayOfWeek] = {
                ...newMeals[s.day as DayOfWeek],
                [s.mealType as MealType]: {
                  recipeId: s.recipeId,
                  servings: recipe.servings,
                },
              };
            }
          }

          wp.meals = newMeals;
          updatedWeekPlans[prev.currentWeek] = wp;
          return { ...prev, weekPlans: updatedWeekPlans };
        });
      }
    } catch (e) {
      console.error("Auto-fill failed:", e);
    } finally {
      setSuggesting(false);
    }
  }, [appState]);

  if (!appState) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const currentWeekPlan = getWeekPlan(appState, appState.currentWeek);
  const budgetSummary = calculateBudget(currentWeekPlan, appState.weeklyBudget);

  const hasEmptySlots = DAYS.some(d =>
    MEAL_TYPES.some(mt => !currentWeekPlan.meals[d][mt].recipeId)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 max-w-sm">
          <WeekSelector 
            currentWeek={appState.currentWeek} 
            onWeekChange={handleWeekChange} 
          />
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="flex-1">
            <BudgetBar summary={budgetSummary} />
          </div>
          {hasEmptySlots && (
            <button
              onClick={handleAutoFill}
              disabled={suggesting}
              className="flex items-center gap-2 px-4 py-2.5 bg-neat-500 text-white font-medium rounded-xl hover:bg-neat-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {suggesting ? "Filling..." : "Auto-Fill"}
            </button>
          )}
        </div>
      </div>

      <MealGrid 
        weekPlan={currentWeekPlan} 
        onSlotClick={handleSlotClick} 
        onRemoveMeal={handleRemoveMeal} 
      />

      <AddMealModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSelect={handleSelectRecipe} 
        mealType={activeSlot?.mealType} 
      />
    </div>
  );
}
