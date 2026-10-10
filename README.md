# 🍃 NeatEat

A personal budgeting meal planner. Plan a week of meals on a simple grid, browse recipes, build your grocery list automatically, and keep spending on budget.

Built as a personal clone of [NeatEat](https://www.neateat.app/) using reverse engineering to understand the original app's architecture and data model.

## Features

- **📅 Weekly Meal Grid** — 7 days × 3 meals, click to add from the recipe library
- **📚 Recipe Library** — 22 budget-friendly recipes with macros, ingredients, and step-by-step instructions
- **🛒 Auto Grocery List** — Ingredients aggregated across all planned meals, grouped by store category
- **💰 Budget Tracker** — Set a weekly target, track spending per meal, see cost breakdowns
- **🤖 AI Suggestions** — Gemini-powered meal suggestions for empty slots (optional)
- **💾 Local Persistence** — All data saved in localStorage, no account needed

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| AI | Google Gemini (optional) |
| Storage | localStorage |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### AI Suggestions (Optional)

Set a Gemini API key to enable AI-powered meal suggestions:

```bash
echo "GEMINI_API_KEY=your-key-here" > .env.local
```

Without the key, the suggest endpoint falls back to random recipe picks.

## Project Structure

```
app/
├── page.tsx              # Weekly meal grid (main view)
├── recipes/page.tsx      # Recipe library with search & filters
├── recipes/[id]/page.tsx # Individual recipe detail
├── grocery-list/page.tsx # Auto-generated shopping list
├── budget/page.tsx       # Budget tracker & meal cost breakdown
└── api/suggest/route.ts  # AI meal suggestion endpoint

components/               # Reusable UI components
lib/                      # Types, recipe data, state management, business logic
```

## License

Personal project. Not affiliated with NeatEat.
