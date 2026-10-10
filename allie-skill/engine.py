#!/usr/bin/env python3
"""
Meal planner engine for Allie.
Provides recipe lookup, meal plan generation, grocery list building, and budget calculation.

Usage:
  python3 engine.py list                          # List all recipes
  python3 engine.py search <query>                # Search recipes
  python3 engine.py plan <budget> [preferences]   # Generate a week plan
  python3 engine.py grocery <plan_json>            # Build grocery list from plan
  python3 engine.py budget <plan_json> <budget>    # Calculate budget
  python3 engine.py export                         # Export recipes.json
"""

import json
import sys
import random
from pathlib import Path
from typing import Optional

RECIPES_PATH = Path(__file__).parent / "recipes.json"

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
MEALS = ["breakfast", "lunch", "dinner"]
GROCERY_CATEGORIES = [
    "Produce", "Protein", "Dairy", "Grains & Pasta",
    "Pantry", "Canned & Dry", "Oils & Condiments", "Spices", "Frozen",
]

# Family serving multiplier: 2 adults + 2 children ≈ 3 adult-equivalent servings
# Children eat roughly half an adult portion on average
FAMILY_ADULT_EQUIVALENT = 3


def load_recipes() -> list[dict]:
    with open(RECIPES_PATH) as f:
        return json.load(f)


def search_recipes(query: str) -> list[dict]:
    q = query.lower()
    recipes = load_recipes()
    return [
        r for r in recipes
        if q in r["name"].lower()
        or q in r["description"].lower()
        or any(q in t.lower() for t in r["tags"])
    ]


def generate_plan(budget: float, preferences: Optional[dict] = None) -> dict:
    """Generate a full weekly meal plan within budget."""
    recipes = load_recipes()
    prefs = preferences or {}

    breakfast_recipes = [r for r in recipes if "Breakfast" in r["tags"]]
    lunch_recipes = [r for r in recipes if "Lunch" in r["tags"]]
    dinner_recipes = [r for r in recipes if "Dinner" in r["tags"]]

    # Apply dietary filters
    dislikes = [d.lower() for d in prefs.get("dislikes", [])]
    for pool in [breakfast_recipes, lunch_recipes, dinner_recipes]:
        pool[:] = [r for r in pool if not any(d in r["name"].lower() for d in dislikes)]

    if prefs.get("high_protein"):
        for pool in [lunch_recipes, dinner_recipes]:
            pool.sort(key=lambda r: r.get("macros", {}).get("protein", r.get("calories", 0)), reverse=True)

    servings = prefs.get("servings", 4)
    plan = {}
    total_cost = 0
    used_dinner_ids: set[str] = set()

    for day in DAYS:
        plan[day] = {}
        is_weekend = day in ("saturday", "sunday")
        max_prep = prefs.get("weekend_prep", 999) if is_weekend else prefs.get("weekday_prep", 60)

        for meal in MEALS:
            if meal == "breakfast":
                pool = breakfast_recipes
            elif meal == "lunch":
                pool = lunch_recipes
            else:
                pool = [r for r in dinner_recipes if r["id"] not in used_dinner_ids]
                if not pool:
                    pool = dinner_recipes

            candidates = [r for r in pool if (r["prepTime"] + r["cookTime"]) <= max_prep]
            if not candidates:
                candidates = pool

            # Budget-aware: prefer cheaper when tight
            remaining = budget - total_cost
            meals_left = sum(1 for d in DAYS[DAYS.index(day):] for m in MEALS) - MEALS.index(meal)
            if meals_left > 0 and remaining / meals_left < 8.0:
                candidates.sort(key=lambda r: r["estimatedCost"])

            recipe = random.choice(candidates[:5]) if len(candidates) > 5 else random.choice(candidates)
            plan[day][meal] = {"recipeId": recipe["id"], "servings": servings}
            total_cost += recipe["estimatedCost"] * servings

            if meal == "dinner":
                used_dinner_ids.add(recipe["id"])

    return {"plan": plan, "totalCost": round(total_cost, 2)}


def build_grocery_list(plan: dict) -> list[dict]:
    """Aggregate ingredients from a meal plan."""
    recipes = {r["id"]: r for r in load_recipes()}
    items: dict[str, dict] = {}

    for day in DAYS:
        for meal in MEALS:
            slot = plan.get(day, {}).get(meal)
            if not slot or not slot.get("recipeId"):
                continue
            recipe = recipes.get(slot["recipeId"])
            if not recipe:
                continue
            multiplier = slot.get("servings", 2) / recipe["servings"]

            for ing in recipe["ingredients"]:
                key = f"{ing['name'].lower()}|{ing['unit']}"
                if key in items:
                    items[key]["quantity"] += ing["quantity"] * multiplier
                    if recipe["name"] not in items[key]["fromRecipes"]:
                        items[key]["fromRecipes"].append(recipe["name"])
                else:
                    items[key] = {
                        "name": ing["name"],
                        "quantity": round(ing["quantity"] * multiplier, 2),
                        "unit": ing["unit"],
                        "category": ing["category"],
                        "fromRecipes": [recipe["name"]],
                    }

    return sorted(
        items.values(),
        key=lambda x: (
            GROCERY_CATEGORIES.index(x["category"]) if x["category"] in GROCERY_CATEGORIES else 99,
            x["name"],
        ),
    )


def calculate_budget(plan: dict, budget: float) -> dict:
    """Calculate budget summary for a meal plan."""
    recipes = {r["id"]: r for r in load_recipes()}
    total = 0
    meal_count = 0

    for day in DAYS:
        for meal in MEALS:
            slot = plan.get(day, {}).get(meal)
            if not slot or not slot.get("recipeId"):
                continue
            recipe = recipes.get(slot["recipeId"])
            if not recipe:
                continue
            total += recipe["estimatedCost"] * slot.get("servings", 2)
            meal_count += 1

    total = round(total, 2)
    return {
        "totalCost": total,
        "budget": budget,
        "remaining": round(budget - total, 2),
        "percentUsed": round(min(total / budget * 100, 100), 1) if budget > 0 else 0,
        "isOverBudget": total > budget,
        "mealCount": meal_count,
        "costPerMeal": round(total / meal_count, 2) if meal_count > 0 else 0,
    }


def format_plan_table(plan: dict) -> str:
    """Format a plan as a readable table for Telegram."""
    recipes = {r["id"]: r for r in load_recipes()}
    lines = []
    for day in DAYS:
        meals_str = []
        for meal in MEALS:
            slot = plan.get(day, {}).get(meal, {})
            rid = slot.get("recipeId")
            r = recipes.get(rid) if rid else None
            meals_str.append(f"{r['emoji']} {r['name']}" if r else "—")
        lines.append(f"| {day.capitalize()[:3]} | {' | '.join(meals_str)} |")

    header = "| Day | 🌅 Breakfast | 🌮 Lunch | 🍽️ Dinner |"
    sep = "|-----|-------------|----------|----------|"
    return f"{header}\n{sep}\n" + "\n".join(lines)


def format_grocery_list(items: list[dict]) -> str:
    """Format grocery list grouped by category."""
    by_cat: dict[str, list[dict]] = {}
    for item in items:
        by_cat.setdefault(item["category"], []).append(item)

    emoji_map = {
        "Produce": "🥬", "Protein": "🥩", "Dairy": "🧀",
        "Grains & Pasta": "🌾", "Canned & Dry": "🥫",
        "Oils & Condiments": "🫒", "Spices": "🧂",
    }

    lines = []
    for cat in GROCERY_CATEGORIES:
        if cat not in by_cat:
            continue
        lines.append(f"\n{emoji_map.get(cat, '📦')} {cat.upper()}")
        for item in by_cat[cat]:
            qty = f"{item['quantity']:.0f}" if item["quantity"] == int(item["quantity"]) else f"{item['quantity']:.1f}"
            unit_str = f" {item['unit']}" if item["unit"] else ""
            sources = ", ".join(item["fromRecipes"][:3])
            lines.append(f"☐ {item['name']} — {qty}{unit_str} (from: {sources})")
    return "\n".join(lines)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "list":
        for r in load_recipes():
            print(f"{r['emoji']} {r['id']}: {r['name']} (${r['estimatedCost']}/srv, {r['calories']} cal)")

    elif cmd == "search":
        q = " ".join(sys.argv[2:])
        for r in search_recipes(q):
            print(f"{r['emoji']} {r['id']}: {r['name']} — {r['description'][:60]}...")

    elif cmd == "plan":
        bgt = float(sys.argv[2]) if len(sys.argv) > 2 else 75.0
        prefs = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        result = generate_plan(bgt, prefs)
        print(format_plan_table(result["plan"]))
        print(f"\n💰 Estimated: ${result['totalCost']:.2f} / ${bgt:.2f} budget")

    elif cmd == "grocery":
        plan_data = json.loads(sys.argv[2])
        items = build_grocery_list(plan_data)
        print(format_grocery_list(items))

    elif cmd == "budget":
        plan_data = json.loads(sys.argv[2])
        bgt = float(sys.argv[3]) if len(sys.argv) > 3 else 75.0
        print(json.dumps(calculate_budget(plan_data, bgt), indent=2))

    elif cmd == "export":
        print(json.dumps(load_recipes(), indent=2))

    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)
