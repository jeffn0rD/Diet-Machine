import { useState } from 'react';
import mealsData from '../data/meals.json';

export default function MealBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'breakfasts' | 'lunches' | 'dinners' | 'snacks'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  const allMeals = [
    ...mealsData.breakfasts.map(m => ({ ...m, category: 'Breakfast' })),
    ...mealsData.lunches.map(m => ({ ...m, category: 'Lunch' })),
    ...mealsData.dinners.map(m => ({ ...m, category: 'Dinner' })),
    ...mealsData.snacks.map(m => ({ ...m, category: 'Snack' }))
  ];

  const filteredMeals = allMeals.filter(meal => {
    const matchesCategory = selectedCategory === 'all' || 
      meal.category.toLowerCase() === selectedCategory.replace('s', '');
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'breakfasts', 'lunches', 'dinners', 'snacks'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map(meal => (
          <div
            key={meal.id}
            onClick={() => setSelectedMeal(meal)}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                {meal.category}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{meal.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 p-2 rounded">
                <p className="text-xs text-gray-600">Protein</p>
                <p className="text-lg font-bold text-red-600">{meal.protein}g</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Calories</p>
                <p className="text-lg font-bold text-blue-600">{meal.calories}</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <p className="text-xs text-gray-600">Carbs</p>
                <p className="text-lg font-bold text-yellow-600">{meal.carbs}g</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs text-gray-600">Fat</p>
                <p className="text-lg font-bold text-purple-600">{meal.fat}g</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-green-600 font-bold text-lg">${meal.cost.toFixed(2)}</span>
              <span className="text-gray-500 text-sm">⏱️ {meal.prepTime} min</span>
            </div>

            {meal.tags && meal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {meal.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No meals found matching your criteria</p>
        </div>
      )}

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedMeal.name}</h2>
              <button
                onClick={() => setSelectedMeal(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600">{selectedMeal.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Protein</p>
                  <p className="text-2xl font-bold text-red-600">{selectedMeal.protein}g</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedMeal.carbs}g</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Fat</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedMeal.fat}g</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Calories</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedMeal.calories}</p>
                </div>
              </div>

              {selectedMeal.ingredients && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                  <ul className="space-y-2">
                    {selectedMeal.ingredients.map((ing: any, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-600">•</span>
                        <span>{ing.amount} {ing.unit} {ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMeal.instructions && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMeal.instructions}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Cost per serving</p>
                  <p className="text-2xl font-bold text-green-600">${selectedMeal.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prep time</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedMeal.prepTime} min</p>
                </div>
              </div>

              {selectedMeal.tags && selectedMeal.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeal.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}