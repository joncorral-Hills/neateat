import Link from "next/link";
import { Recipe } from "@/lib/types";
import { Clock, DollarSign, Flame } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 p-4 border border-gray-100">
        <div className="flex items-center justify-center h-32 mb-4 bg-gray-50 rounded-lg group-hover:bg-neat-50 transition-colors">
          <span className="text-6xl">{recipe.emoji}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[10px] font-medium tracking-wide uppercase rounded-full bg-gray-100 text-gray-600"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-medium tracking-wide uppercase rounded-full bg-gray-100 text-gray-600">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{recipe.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
          {recipe.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{recipe.prepTime + recipe.cookTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-gray-400" />
            <span>{recipe.calories}</span>
          </div>
          <div className="flex items-center gap-1 text-neat-600 font-medium">
            <DollarSign className="w-4 h-4" />
            <span>{recipe.estimatedCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
