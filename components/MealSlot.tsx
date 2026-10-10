"use client";

import { MealType } from "../lib/types";
import { getRecipeById } from "../lib/recipes";
import { Plus, X } from "lucide-react";

interface MealSlotProps {
  recipeId: string | null;
  mealType: MealType;
  onAdd: () => void;
  onRemove: () => void;
}

export default function MealSlot({ recipeId, mealType, onAdd, onRemove }: MealSlotProps) {
  const recipe = recipeId ? getRecipeById(recipeId) : null;

  if (!recipe) {
    return (
      <button
        onClick={onAdd}
        className="w-full h-full min-h-[100px] flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-neat-50 hover:border-neat-300 hover:text-neat-600 transition-colors text-gray-400 group"
      >
        <Plus className="w-6 h-6 mb-1 text-gray-300 group-hover:text-neat-400 transition-colors" />
        <span className="text-xs font-medium capitalize">{mealType}</span>
      </button>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[100px] flex flex-col p-3 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow group">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
        title="Remove meal"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      
      <div className="text-2xl mb-1">{recipe.emoji}</div>
      <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-auto line-clamp-2">
        {recipe.name}
      </h4>
      <div className="mt-2 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md self-start">
        ${recipe.estimatedCost.toFixed(2)}
      </div>
    </div>
  );
}
