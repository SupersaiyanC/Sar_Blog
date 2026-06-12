import { RecipeData } from '@/lib/posts';

export default function RecipeCard({ recipe }: { recipe: RecipeData }) {
  const { prepTime, cookTime, servings, ingredients, instructions } = recipe;
  const stats = [
    { label: 'Prep Time', value: prepTime },
    { label: 'Cook Time', value: cookTime },
    { label: 'Servings', value: servings },
  ].filter((stat) => stat.value);

  return (
    <div id="recipe" className="mt-12 bg-mist-50 rounded-2xl shadow-md p-8 md:p-10 scroll-mt-24">
      <h2 className="text-3xl font-serif text-mist-900 mb-6">Recipe</h2>

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl px-5 py-3 shadow-sm text-center"
            >
              <div className="text-xs uppercase tracking-wide text-sea-salt-600 font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-mist-900 font-medium">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {ingredients && ingredients.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-mist-900 mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 text-mist-700">
                  <span className="mt-2 w-2 h-2 rounded-full bg-sea-salt-400 shrink-0" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {instructions && instructions.length > 0 && (
          <div>
            <h3 className="text-xl font-serif text-mist-900 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-4 text-mist-700">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sea-salt-400 text-white text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
