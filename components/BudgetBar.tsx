"use client";

import { BudgetSummary } from "../lib/budget";

interface BudgetBarProps {
  summary: BudgetSummary;
}

export default function BudgetBar({ summary }: BudgetBarProps) {
  const { totalCost, budget, percentUsed, isOverBudget } = summary;

  const isWarning = percentUsed >= 90;
  
  let barColor = "bg-neat-500";
  if (isOverBudget) {
    barColor = "bg-red-500";
  } else if (isWarning) {
    barColor = "bg-orange-500";
  }

  let textColor = "text-neat-600";
  if (isOverBudget) {
    textColor = "text-red-600";
  } else if (isWarning) {
    textColor = "text-orange-600";
  }

  let badgeBg = "bg-neat-50";
  if (isOverBudget) {
    badgeBg = "bg-red-50";
  } else if (isWarning) {
    badgeBg = "bg-orange-50";
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-gray-800">${totalCost.toFixed(2)}</span>
          <span className="text-sm text-gray-500 font-medium">of ${budget.toFixed(2)}</span>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${badgeBg} ${textColor}`}>
          {isOverBudget ? "Over budget" : "On track"}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>
    </div>
  );
}
