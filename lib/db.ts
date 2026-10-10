"use client";

import { AppState, DAYS, MEAL_TYPES, WeekPlan, MealSlotData } from "./types";

const STORAGE_KEY = "neateat-state";

function createEmptyWeekPlan(weekStart: string): WeekPlan {
  const meals: any = {};
  for (const day of DAYS) {
    meals[day] = {};
    for (const meal of MEAL_TYPES) {
      meals[day][meal] = { recipeId: null, servings: 1 } as MealSlotData;
    }
  }
  return { weekStart, meals };
}

function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonday(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatLocalDate(d);
}

function getDefaultState(): AppState {
  const currentWeek = getMonday();
  return {
    currentWeek,
    weekPlans: {
      [currentWeek]: createEmptyWeekPlan(currentWeek),
    },
    weeklyBudget: 75,
    checkedGroceryItems: [],
  };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw) as AppState;
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getCurrentWeekStart(): string {
  return getMonday();
}

export function getWeekPlan(state: AppState, weekStart: string): WeekPlan {
  if (!state.weekPlans[weekStart]) {
    state.weekPlans[weekStart] = createEmptyWeekPlan(weekStart);
  }
  return state.weekPlans[weekStart];
}

export function getNextWeek(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() + 7);
  return formatLocalDate(d);
}

export function getPrevWeek(weekStart: string): string {
  const d = new Date(weekStart + "T00:00:00");
  d.setDate(d.getDate() - 7);
  return formatLocalDate(d);
}

export function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}
