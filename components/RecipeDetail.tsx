"use client";

import { useState } from "react";
import Link from "next/link";
import { Recipe } from "@/lib/types";
import { Clock, Users, Flame, DollarSign, ArrowLeft, ChefHat, Check } from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const totalMacros = recipe.protein + recipe.carbs + recipe.fat;
  const proteinPercent = (recipe.protein / totalMacros) * 100;
  const carbsPercent = (recipe.carbs / totalMacros) * 100;
  const fatPercent = (recipe.fat / totalMacros) * 100;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <Link href="/recipes" className="inline-flex items-center text-sm text-gray-500 hover:text-neat-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to recipes
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex items-center justify-center h-48 bg-gray-50 border-b border-gray-100">
          <span className="text-8xl transform hover:scale-110 transition-transform duration-300">{recipe.emoji}</span>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-neat-50 text-neat-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
          <p className="text-lg text-gray-600 mb-8">{recipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Clock className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-900">{recipe.prepTime + recipe.cookTime} min</span>
              <span className="text-xs text-gray-500">Total Time</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center border-l border-gray-200">
              <Users className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-sm font-medium text-gray-900">{recipe.servings}</span>
              <span className="text-xs text-gray-500">Servings</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center border-t md:border-t-0 md:border-l border-gray-200">
              <Flame className="w-6 h-6 text-orange-400 mb-1" />
              <span className="text-sm font-medium text-gray-900">{recipe.calories} kcal</span>
              <span className="text-xs text-gray-500">Per Serving</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center border-t md:border-t-0 md:border-l border-gray-200">
              <DollarSign className="w-6 h-6 text-neat-500 mb-1" />
              <span className="text-sm font-medium text-neat-600">${recipe.estimatedCost.toFixed(2)}</span>
              <span className="text-xs text-gray-500">Per Serving</span>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Macros per serving</h3>
            <div className="h-4 flex rounded-full overflow-hidden mb-2">
              <div style={{ width: `${proteinPercent}%` }} className="bg-blue-400" title={`Protein: ${recipe.protein}g`} />
              <div style={{ width: `${carbsPercent}%` }} className="bg-orange-400" title={`Carbs: ${recipe.carbs}g`} />
              <div style={{ width: `${fatPercent}%` }} className="bg-yellow-400" title={`Fat: ${recipe.fat}g`} />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> {recipe.protein}g Protein</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> {recipe.carbs}g Carbs</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> {recipe.fat}g Fat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            Ingredients
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, i) => (
                <li 
                  key={i}
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => toggleIngredient(i)}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                    checkedIngredients.has(i) 
                      ? "bg-neat-500 border-neat-500" 
                      : "border-gray-300 group-hover:border-neat-400"
                  }`}>
                    {checkedIngredients.has(i) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={`text-sm ${checkedIngredients.has(i) ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    <span className="font-semibold">{ing.quantity} {ing.unit}</span> {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-gray-400" />
            Instructions
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <ol className="space-y-8">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neat-50 text-neat-600 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
