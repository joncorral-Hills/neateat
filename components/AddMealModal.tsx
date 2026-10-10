"use client";

import { useState, useEffect } from "react";
import { Search, X, Clock, DollarSign } from "lucide-react";
import { recipes, searchRecipes } from "../lib/recipes";
import { MealType, Recipe } from "../lib/types";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipeId: string) => void;
  mealType?: MealType;
}

const TAGS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Vegetarian",
  "Vegan",
  "Quick",
  "High Protein",
  "Budget Friendly",
];

export default function AddMealModal({ isOpen, onClose, onSelect, mealType }: AddMealModalProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mealType) {
        setActiveTag(mealType.charAt(0).toUpperCase() + mealType.slice(1));
      } else {
        setActiveTag(null);
      }
      setQuery("");
    }
  }, [isOpen, mealType]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let filteredRecipes = query ? searchRecipes(query) : recipes;
  if (activeTag) {
    filteredRecipes = filteredRecipes.filter((r) => r.tags.includes(activeTag as any));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Select a Meal {mealType ? `for ${mealType}` : ""}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, or tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neat-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTag === tag
                    ? "bg-neat-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No recipes found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelect(recipe.id)}
                  className="flex flex-col text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-neat-300 transition-all group"
                >
                  <div className="text-4xl mb-3">{recipe.emoji}</div>
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-neat-600 transition-colors">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {recipe.prepTime + recipe.cookTime}m
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      {recipe.estimatedCost.toFixed(2)}/srv
                    </div>
                    <div>
                      {recipe.calories} cal
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
