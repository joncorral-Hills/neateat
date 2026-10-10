"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { recipes } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

const ALL_TAGS = [
  "Breakfast", "Lunch", "Dinner", "Snack",
  "Vegetarian", "Vegan", "Pescatarian", "Gluten-Free", 
  "Dairy-Free", "Low Calorie", "High Protein", "Quick", 
  "Healthy Comfort", "Budget Friendly"
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = 
        searchQuery === "" || 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesTags = 
        activeTags.length === 0 || 
        activeTags.every(tag => recipe.tags.includes(tag as any));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTags([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Recipes</h1>
        <p className="text-lg text-gray-500">Simple, budget-friendly meals</p>
      </div>

      <div className="mb-8 space-y-6">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neat-500 focus:border-neat-500 sm:text-sm shadow-sm transition-shadow"
            placeholder="Search recipes by name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2 justify-center">
            {ALL_TAGS.map(tag => {
              const isActive = activeTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-neat-500 text-white shadow-sm" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          
          {(activeTags.length > 0 || searchQuery) && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            We couldn't find any recipes matching your current filters. Try removing some to see more results.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-neat-600 hover:bg-neat-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neat-500 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
