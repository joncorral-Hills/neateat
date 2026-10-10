"use client";

import { useState } from "react";
import { GroceryItem, GroceryCategory } from "@/lib/types";
import { groupByCategory, formatQuantity } from "@/lib/grocery";
import { ShoppingBasket, Check, ChevronDown, ChevronRight } from "lucide-react";

interface GroceryListProps {
  items: GroceryItem[];
  onToggleItem: (name: string) => void;
  onClearChecked: () => void;
}

export default function GroceryList({ items, onToggleItem, onClearChecked }: GroceryListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-neat-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBasket className="w-8 h-8 text-neat-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Your list is empty</h3>
        <p className="text-slate-500 max-w-sm">
          Plan some meals for the week to automatically generate your grocery list.
        </p>
      </div>
    );
  }

  const grouped = groupByCategory(items);
  const categories = Object.keys(grouped) as GroceryCategory[];
  
  // Stats
  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  
  // Find total meals (unique recipes)
  const uniqueRecipes = new Set<string>();
  items.forEach(item => {
    item.fromRecipes.forEach(recipe => uniqueRecipes.add(recipe));
  });
  
  const toggleCollapse = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <p className="text-sm font-medium text-slate-500">List Summary</p>
          <p className="text-slate-900 font-semibold">
            {totalCount} items from {uniqueRecipes.size} meals
          </p>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={onClearChecked}
            className="text-sm px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Clear checked ({checkedCount})
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {categories.map((cat) => {
          const catItems = grouped[cat];
          if (catItems.length === 0) return null;

          const isCollapsed = collapsed[cat];

          return (
            <div key={cat} className="border-b border-slate-100 last:border-0">
              <button
                onClick={() => toggleCollapse(cat)}
                className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                  <h3 className="font-semibold text-slate-700">{cat}</h3>
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {catItems.length}
                </span>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-slate-100">
                  {catItems.map((item, idx) => {
                    return (
                      <div
                        key={`${item.name}-${idx}`}
                        className={`flex items-start gap-3 p-4 transition-all ${
                          item.checked ? "opacity-50" : ""
                        }`}
                      >
                        <button
                          onClick={() => onToggleItem(item.name)}
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            item.checked
                              ? "bg-neat-500 border-neat-500 text-white"
                              : "border-slate-300 text-transparent hover:border-neat-400"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline gap-2">
                            <span
                              className={`font-medium text-slate-900 ${
                                item.checked ? "line-through" : ""
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                              {formatQuantity(item.quantity, item.unit)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.fromRecipes.map((recipe, rIdx) => (
                              <span
                                key={rIdx}
                                className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500"
                              >
                                {recipe}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
