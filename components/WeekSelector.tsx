"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange, getNextWeek, getPrevWeek, getCurrentWeekStart } from "../lib/db";

interface WeekSelectorProps {
  currentWeek: string;
  onWeekChange: (week: string) => void;
}

export default function WeekSelector({ currentWeek, onWeekChange }: WeekSelectorProps) {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onWeekChange(getPrevWeek(currentWeek))}
          className="p-2 text-gray-500 hover:text-neat-600 hover:bg-neat-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800 text-lg w-40 text-center">
          {formatWeekRange(currentWeek)}
        </span>
        <button
          onClick={() => onWeekChange(getNextWeek(currentWeek))}
          className="p-2 text-gray-500 hover:text-neat-600 hover:bg-neat-50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={() => onWeekChange(getCurrentWeekStart())}
        className="px-4 py-2 text-sm font-medium text-neat-600 bg-neat-50 rounded-lg hover:bg-neat-100 transition-colors"
      >
        Today
      </button>
    </div>
  );
}
