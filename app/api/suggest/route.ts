import { NextResponse } from "next/server";
import { recipes } from "@/lib/recipes";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emptySlots = [], budget = 0, existingMeals = [] } = body;
    
    // Fallback logic for when there's no API key or AI fails
    const fallback = () => {
      const used = new Set(existingMeals);
      const suggestions = emptySlots.map((slot: any) => {
        const available = recipes.filter(r => !used.has(r.id));
        const pool = available.length > 0 ? available : recipes;
        const randomRecipe = pool[Math.floor(Math.random() * pool.length)];
        used.add(randomRecipe.id);
        return {
          day: slot.day,
          mealType: slot.mealType,
          recipeId: randomRecipe.id,
        };
      });
      return NextResponse.json({ suggestions });
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fallback();
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      
      const recipeContext = recipes.map(r => `ID: ${r.id}, Name: ${r.name}, Cost: $${r.estimatedCost}, Tags: ${r.tags.join(', ')}`).join('\n');
      
      const prompt = `You are a meal planning assistant. Suggest budget-friendly meals.
We have a budget of $${budget}. The following meals are already planned: ${existingMeals.join(', ')}.
We need to fill the following empty slots: ${JSON.stringify(emptySlots)}.
Here are the available recipes:
${recipeContext}

Return ONLY a JSON object with a "suggestions" array. Each suggestion should have: "day" (string), "mealType" (string), and "recipeId" (string). Make sure recipeId is picked from the available recipes.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a meal planning assistant. Suggest budget-friendly meals.",
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text;
      if (!text) return fallback();
      
      const json = JSON.parse(text);
      return NextResponse.json({ suggestions: json.suggestions || [] });
    } catch (e) {
      console.error("AI suggestion error:", e);
      return fallback();
    }
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
