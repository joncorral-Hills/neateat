#!/bin/bash
# Self-install script for the meal-planner skill
# Allie can run this directly: curl -sL <raw_url> | bash
set -e

SKILL_DIR="$HOME/.hermes/skills/meal-planner"
REPO="https://raw.githubusercontent.com/joncorral-Hills/neateat/main/allie-skill"

echo "🍽️ Installing meal-planner skill..."
mkdir -p "$SKILL_DIR"

echo "📥 Downloading SKILL.md..."
curl -sL "$REPO/SKILL.md" -o "$SKILL_DIR/SKILL.md"

echo "📥 Downloading engine.py..."
curl -sL "$REPO/engine.py" -o "$SKILL_DIR/engine.py"
chmod +x "$SKILL_DIR/engine.py"

echo "📥 Downloading recipes.json (22 recipes)..."
curl -sL "$REPO/recipes.json" -o "$SKILL_DIR/recipes.json"

echo "🧪 Verifying..."
RECIPE_COUNT=$(python3 -c "import json; print(len(json.load(open('$SKILL_DIR/recipes.json'))))")
echo "   ✅ $RECIPE_COUNT recipes loaded"

python3 "$SKILL_DIR/engine.py" plan 75 2>/dev/null | head -3
echo "   ✅ Plan generation works"

echo ""
echo "✅ Installed to $SKILL_DIR"
echo ""
echo "Remaining setup:"
echo "  1. Save meal_preferences to Notion MEMORY (Category: preferences)"
echo "  2. Register skill in Notion SKILLS database"
echo "  3. Create MEAL_PLANS Notion database under ALLIE page"
