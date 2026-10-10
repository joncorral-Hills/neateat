import { getRecipeById } from "@/lib/recipes";
import RecipeDetail from "@/components/RecipeDetail";
import Link from "next/link";

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        <p className="text-gray-500 mb-8">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/recipes"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-neat-600 hover:bg-neat-700 transition-colors"
        >
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 relative">
      <RecipeDetail recipe={recipe} />
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 md:mt-10 md:max-w-3xl md:mx-auto">
        <Link 
          href={`/?addRecipe=${recipe.id}`}
          className="flex w-full md:w-auto items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-neat-600 hover:bg-neat-700 transition-colors"
        >
          Add to Meal Plan
        </Link>
      </div>
    </div>
  );
}
