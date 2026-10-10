"use client";

import { useEffect, useState } from "react";
import { AppState } from "@/lib/types";
import { loadState, saveState, getWeekPlan, getNextWeek, getPrevWeek, formatWeekRange } from "@/lib/db";
import { buildGroceryList } from "@/lib/grocery";
import GroceryList from "@/components/GroceryList";
import { Printer, ChevronLeft, ChevronRight } from "lucide-react";

export default function GroceryListPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setSelectedWeek(s.currentWeek);
  }, []);

  if (!state || !selectedWeek) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const plan = getWeekPlan(state, selectedWeek);
  const baseItems = buildGroceryList(plan);
  
  // Merge checked state
  const items = baseItems.map(item => ({
    ...item,
    checked: state.checkedGroceryItems.includes(item.name)
  }));

  const handleToggleItem = (name: string) => {
    const newChecked = state.checkedGroceryItems.includes(name)
      ? state.checkedGroceryItems.filter(i => i !== name)
      : [...state.checkedGroceryItems, name];
      
    const newState = { ...state, checkedGroceryItems: newChecked };
    setState(newState);
    saveState(newState);
  };

  const handleClearChecked = () => {
    const newState = { ...state, checkedGroceryItems: [] };
    setState(newState);
    saveState(newState);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grocery List</h1>
          <p className="text-slate-500 mt-1">Everything you need for the week</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>

      <div className="flex items-center justify-between bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-8 max-w-sm mx-auto sm:mx-0">
        <button
          onClick={() => setSelectedWeek(getPrevWeek(selectedWeek))}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-700">
          {formatWeekRange(selectedWeek)}
        </span>
        <button
          onClick={() => setSelectedWeek(getNextWeek(selectedWeek))}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <GroceryList 
        items={items} 
        onToggleItem={handleToggleItem} 
        onClearChecked={handleClearChecked} 
      />
    </div>
  );
}
