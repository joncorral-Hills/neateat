#!/bin/bash
# Deploy the meal-planner skill to Allie's Hermes VM
# Usage: ./deploy.sh
#
# Prerequisites:
#   - SSH key at ~/.ssh/id_ed25519
#   - Allie VM accessible at 208.122.8.11:22222

set -e

SSH_HOST="208.122.8.11"
SSH_PORT="22222"
SSH_USER="root"
SSH_KEY="$HOME/.ssh/id_ed25519"
SKILL_DIR="$HOME/.hermes/skills/meal-planner"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

SSH_CMD="ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -p $SSH_PORT -i $SSH_KEY $SSH_USER@$SSH_HOST"
SCP_CMD="scp -o StrictHostKeyChecking=no -P $SSH_PORT -i $SSH_KEY"

echo "🍽️  Deploying meal-planner skill to Allie VM..."

# 1. Create skill directory
echo "📁 Creating skill directory..."
$SSH_CMD "mkdir -p $SKILL_DIR"

# 2. Upload files
echo "📤 Uploading SKILL.md..."
$SCP_CMD "$SCRIPT_DIR/SKILL.md" "$SSH_USER@$SSH_HOST:$SKILL_DIR/SKILL.md"

echo "📤 Uploading engine.py..."
$SCP_CMD "$SCRIPT_DIR/engine.py" "$SSH_USER@$SSH_HOST:$SKILL_DIR/engine.py"

echo "📤 Uploading recipes.json..."
$SCP_CMD "$SCRIPT_DIR/recipes.json" "$SSH_USER@$SSH_HOST:$SKILL_DIR/recipes.json"

# 3. Make engine executable
$SSH_CMD "chmod +x $SKILL_DIR/engine.py"

# 4. Test
echo "🧪 Testing engine on VM..."
$SSH_CMD "cd $SKILL_DIR && python3 engine.py list | head -5"

echo ""
echo "✅ Deployed! Next steps:"
echo "   1. Register skill in Notion SKILLS database"
echo "   2. Save meal_preferences and meal_planner_config to Notion MEMORY"
echo "   3. Create MEAL_PLANS Notion database"
echo "   4. Test: message Allie 'plan my meals'"
