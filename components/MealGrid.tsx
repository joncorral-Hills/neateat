"use client";

import { WeekPlan, DAYS, MEAL_TYPES, DayOfWeek, MealType, DAY_LABELS } from "../lib/types";
import MealSlot from "./MealSlot";

interface MealGridProps {
  weekPlan: WeekPlan;
  onSlotClick: (day: DayOfWeek, mealType: MealType) => void;
  onRemoveMeal: (day: DayOfWeek, mealType: MealType) => void;
}

export default function MealGrid({ weekPlan, onSlotClick, onRemoveMeal }: MealGridProps) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="min-w-[700px] w-full">
        {/* Header Row */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr] bg-gray-50 border-b border-gray-100 p-4">
          <div className="font-semibold text-gray-400 text-sm flex items-center justify-center">Day</div>
          {MEAL_TYPES.map((type) => (
            <div key={type} className="font-semibold text-gray-600 text-center capitalize text-sm">
              {type}
            </div>
          ))}
        </div>

        {/* Days Rows */}
        <div className="divide-y divide-gray-100">
          {DAYS.map((day) => (
            <div key={day} className="grid grid-cols-[80px_1fr_1fr_1fr] p-3 gap-3 items-stretch">
              <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-gray-700">{DAY_LABELS[day]}</span>
              </div>
              
              {MEAL_TYPES.map((mealType) => {
                const slotData = weekPlan.meals[day][mealType];
                return (
                  <div key={`${day}-${mealType}`} className="h-full">
                    <MealSlot
                      recipeId={slotData.recipeId}
                      mealType={mealType}
                      onAdd={() => onSlotClick(day, mealType)}
                      onRemove={() => onRemoveMeal(day, mealType)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
