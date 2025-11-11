import { useState, useEffect } from 'react';
import ingredientsData from '../data/ingredients.json';
import mealsData from '../data/meals.json';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  price: number;
  unit: string;
  store: string;
  zipcode: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  cost: number;
  prepTime: number;
  tags?: string[];
  freezerFriendly?: boolean;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  instructions: string;
  isCustom?: boolean;
}

interface MealEditorProps {
  mealId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function MealEditor({ mealId, onSave, onCancel }: MealEditorProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [meal, setMeal] = useState<Partial<Meal>>({
    name: '',
    description: '',
    category: 'dinner',
    prepTime: 10,
    tags: [],
    freezerFriendly: false,
    ingredients: [],
    instructions: '',
    isCustom: true
  });
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState('');
  const [showInlineIngredientForm, setShowInlineIngredientForm] = useState(false);

  useEffect(() => {
    loadIngredients();
    if (mealId) {
      loadMeal(mealId);
    }
  }, [mealId]);

  const loadIngredients = () => {
    const customIngredients = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('customIngredients') || '[]')
      : [];
    setIngredients([...ingredientsData.ingredients, ...customIngredients]);
  };

  const loadMeal = (id: string) => {
    // Load from all meal sources
    const allMeals = [
      ...mealsData.breakfasts.map(m => ({ ...m, category: 'breakfast' as const })),
      ...mealsData.lunches.map(m => ({ ...m, category: 'lunch' as const })),
      ...mealsData.dinners.map(m => ({ ...m, category: 'dinner' as const })),
      ...mealsData.snacks.map(m => ({ ...m, category: 'snack' as const }))
    ];

    // Also load custom meals
    if (typeof window !== 'undefined') {
      const customMeals = JSON.parse(localStorage.getItem('customMeals') || '[]');
      allMeals.push(...customMeals);
    }

    const foundMeal = allMeals.find(m => m.id === id);
    if (foundMeal) {
      setMeal(foundMeal);
    }
  };

  const calculateMealNutrition = () => {
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0, cost: 0 };
    
    meal.ingredients?.forEach(ing => {
      const ingredient = ingredients.find(i => i.name === ing.name);
      if (ingredient) {
        totals.protein += ingredient.protein * ing.amount;
        totals.fat += ingredient.fat * ing.amount;
        totals.carbs += ingredient.carbs * ing.amount;
        totals.calories += ingredient.calories * ing.amount;
        totals.cost += ingredient.price * ing.amount;
      }
    });

    return totals;
  };

  const addIngredient = () => {
    if (!selectedIngredientId || !ingredientAmount) return;

    const ingredient = ingredients.find(i => i.id === selectedIngredientId);
    if (!ingredient) return;

    const newIngredient = {
      name: ingredient.name,
      amount: parseFloat(ingredientAmount),
      unit: ingredient.unit
    };

    setMeal({
      ...meal,
      ingredients: [...(meal.ingredients || []), newIngredient]
    });

    setSelectedIngredientId('');
    setIngredientAmount('');
  };

  const removeIngredient = (index: number) => {
    setMeal({
      ...meal,
      ingredients: meal.ingredients?.filter((_, i) => i !== index)
    });
  };

  const saveMeal = () => {
    if (!meal.name || !meal.ingredients || meal.ingredients.length === 0) {
      alert('Please provide a meal name and at least one ingredient');
      return;
    }

    const nutrition = calculateMealNutrition();
    const completeMeal: Meal = {
      id: mealId || `meal-${Date.now()}`,
      name: meal.name!,
      description: meal.description || '',
      category: meal.category!,
      protein: Math.round(nutrition.protein * 10) / 10,
      fat: Math.round(nutrition.fat * 10) / 10,
      carbs: Math.round(nutrition.carbs * 10) / 10,
      calories: Math.round(nutrition.calories),
      cost: Math.round(nutrition.cost * 100) / 100,
      prepTime: meal.prepTime!,
      tags: meal.tags || [],
      freezerFriendly: meal.freezerFriendly || false,
      ingredients: meal.ingredients!,
      instructions: meal.instructions || '',
      isCustom: true
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const customMeals = JSON.parse(localStorage.getItem('customMeals') || '[]');
      
      if (mealId) {
        // Update existing
        const index = customMeals.findIndex((m: Meal) => m.id === mealId);
        if (index >= 0) {
          customMeals[index] = completeMeal;
        } else {
          customMeals.push(completeMeal);
        }
      } else {
        // Add new
        customMeals.push(completeMeal);
      }

      localStorage.setItem('customMeals', JSON.stringify(customMeals));
    }

    if (onSave) onSave();
  };

  const nutrition = calculateMealNutrition();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {mealId ? '✏️ Edit Meal' : '➕ Create New Meal'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meal Name *
            </label>
            <input
              type="text"
              value={meal.name}
              onChange={(e) => setMeal({ ...meal, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., High-Protein Chicken Bowl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={meal.category}
              onChange={(e) => setMeal({ ...meal, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={meal.description}
            onChange={(e) => setMeal({ ...meal, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            rows={2}
            placeholder="Brief description of the meal..."
          />
        </div>

        {/* Prep Time and Options */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              value={meal.prepTime}
              onChange={(e) => setMeal({ ...meal, prepTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={meal.freezerFriendly}
                onChange={(e) => setMeal({ ...meal, freezerFriendly: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-gray-700">Freezer Friendly</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={meal.tags?.join(', ')}
            onChange={(e) => setMeal({ ...meal, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="e.g., high-protein, quick, budget-friendly"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Ingredients *
          </label>
          
          {/* Current Ingredients */}
          <div className="space-y-2 mb-4">
            {meal.ingredients?.map((ing, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <span className="flex-1 font-medium">{ing.name}</span>
                <span className="text-gray-600">{ing.amount} {ing.unit}</span>
                <button
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
            {(!meal.ingredients || meal.ingredients.length === 0) && (
              <p className="text-gray-500 text-sm italic">No ingredients added yet</p>
            )}
          </div>

          {/* Add Ingredient */}
          <div className="flex gap-2">
            <select
              value={selectedIngredientId}
              onChange={(e) => {
                setSelectedIngredientId(e.target.value);
                const ing = ingredients.find(i => i.id === e.target.value);
                if (ing) {
                  // Auto-focus amount input
                  setTimeout(() => document.getElementById('ingredient-amount-input')?.focus(), 0);
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select ingredient...</option>
              {ingredients.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.name} ({ing.unit})
                </option>
              ))}
            </select>
            <div className="relative">
              <input
                id="ingredient-amount-input"
                type="number"
                step="0.1"
                value={ingredientAmount}
                onChange={(e) => setIngredientAmount(e.target.value)}
                placeholder="Amount"
                className="w-32 px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {selectedIngredientId && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  {ingredients.find(i => i.id === selectedIngredientId)?.unit}
                </span>
              )}
            </div>
            <button
              onClick={addIngredient}
              disabled={!selectedIngredientId || !ingredientAmount}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions
          </label>
          <textarea
            value={meal.instructions}
            onChange={(e) => setMeal({ ...meal, instructions: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            rows={4}
            placeholder="Step-by-step cooking instructions..."
          />
        </div>

        {/* Calculated Nutrition */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
            <h3 className="font-semibold text-gray-800 mb-4">📊 Calculated Nutrition (Per Serving)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{Math.round(nutrition.protein * 10) / 10}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{Math.round(nutrition.carbs * 10) / 10}g</p>
                <p className="text-sm text-gray-600">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{Math.round(nutrition.fat * 10) / 10}g</p>
                <p className="text-sm text-gray-600">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{Math.round(nutrition.calories)}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${(Math.round(nutrition.cost * 100) / 100).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Cost</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={saveMeal}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            💾 {mealId ? 'Update Meal' : 'Save Meal'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}