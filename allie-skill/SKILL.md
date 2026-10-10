---
name: meal-planner
description: Weekly meal planning with budget tracking and grocery lists
triggers:
  - "plan my meals"
  - "meal plan"
  - "what should I eat"
  - "what's for dinner"
  - "grocery list"
  - "meal budget"
  - "plan this week"
  - "meal suggestions"
  - "plan next week"
  - "what should I cook"
model_tier: T2
---

# Meal Planner

Plan Jon's weekly meals from a curated recipe library, generate grocery lists,
and track spending against a weekly budget.

## Workflow

### 1. Check Preferences
Read `meal_preferences` from MEMORY. If missing, ask Jon and save.

### 2. Plan Generation
When Jon asks to plan meals:
1. Ask if he wants full-auto or pick-and-choose
2. **Full-auto**: Select 21 meals (7 days × 3) fitting budget and preferences
   - Vary proteins across days (no chicken 3 days in a row)
   - Match meal complexity to day (quick weekdays, elaborate weekends)
   - Respect dietary preferences from MEMORY
3. **Pick-and-choose**: Show categories, let Jon pick per slot

### 3. Present the Plan
Format as a clean table:

```
📅 Week of Oct 14 – Oct 20

| Day       | 🌅 Breakfast      | 🌮 Lunch            | 🍽️ Dinner           |
|-----------|-------------------|---------------------|---------------------|
| Monday    | Greek Yogurt Bowl | Chicken Quesadillas | Pasta Aglio e Olio  |
| Tuesday   | Overnight Oats    | Black Bean Soup     | Teriyaki Stir Fry   |
| ...       | ...               | ...                 | ...                 |

💰 Estimated: $62.40 / $75.00 budget
🛒 32 grocery items across 7 categories
```

### 4. Confirm & Save
- Ask Jon to confirm or swap any meals
- Once confirmed, save to Notion MEAL_PLANS database
- Mark status as `confirmed`

### 5. Grocery List
When asked, generate grouped grocery list from confirmed plan:

```
🛒 Grocery List — Week of Oct 14

🥬 PRODUCE
☐ Spinach — 6 oz (from: Pasta Aglio e Olio, Stir Fry)
☐ Bell peppers — 3 (from: Stir Fry, Quesadillas)

🥩 PROTEIN
☐ Chicken breast — 2 lbs (from: Quesadillas, Stir Fry)
...
```

### 6. Preference Learning
After each week, ask Jon:
- "Any meals you loved this week? I'll prioritize those."
- "Anything you'd skip next time?"
Update `meal_preferences` in MEMORY with likes/dislikes.

## Commands Jon Can Say

| Intent | Examples |
|--------|----------|
| Plan a week | "plan my meals", "meal plan for next week" |
| See current plan | "what's the plan this week", "what's for dinner" |
| Swap a meal | "swap Monday dinner", "change Tuesday lunch to something quick" |
| Grocery list | "grocery list", "what do I need to buy" |
| Budget check | "how much am I spending on food", "meal budget" |
| Set preference | "I don't like fish", "more vegetarian meals", "budget is $60" |
| Rate a meal | "loved the stir fry", "skip the oats next time" |

## Safety Rules
- Never exceed the weekly budget without flagging it
- Always confirm the full plan before saving
- Respect dietary restrictions absolutely
