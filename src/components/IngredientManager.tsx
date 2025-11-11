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

interface CustomMeal {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: Array<{
    ingredientId: string;
    amount: number;
  }>;
  prepTime: number;
  instructions: string;
}

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load from localStorage or use default data
    if (typeof window !== 'undefined') {
      const savedIngredients = localStorage.getItem('customIngredients');
      const savedMeals = localStorage.getItem('customMeals');
      
      if (savedIngredients) {
        setIngredients([...ingredientsData.ingredients, ...JSON.parse(savedIngredients)]);
      } else {
        setIngredients(ingredientsData.ingredients);
      }

      if (savedMeals) {
        setCustomMeals(JSON.parse(savedMeals));
      }
    } else {
      setIngredients(ingredientsData.ingredients);
    }
  }, []);

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    category: 'protein',
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
    price: 0,
    unit: 'oz',
    store: 'walmart',
    zipcode: '05855'
  });

  const [newMeal, setNewMeal] = useState<Partial<CustomMeal>>({
    name: '',
    description: '',
    category: 'breakfast',
    ingredients: [],
    prepTime: 5,
    instructions: ''
  });

  const addIngredient = () => {
    if (!newIngredient.name) return;

    const ingredient: Ingredient = {
      id: `custom-${Date.now()}`,
      name: newIngredient.name!,
      category: newIngredient.category!,
      protein: newIngredient.protein!,
      fat: newIngredient.fat!,
      carbs: newIngredient.carbs!,
      calories: newIngredient.calories!,
      price: newIngredient.price!,
      unit: newIngredient.unit!,
      store: newIngredient.store!,
      zipcode: newIngredient.zipcode!
    };

    const customIngredients = ingredients.filter(i => i.id.startsWith('custom-'));
    customIngredients.push(ingredient);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customIngredients', JSON.stringify(customIngredients));
    }
    
    setIngredients([...ingredients, ingredient]);
    setShowAddIngredient(false);
    setNewIngredient({
      name: '',
      category: 'protein',
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0,
      price: 0,
      unit: 'oz',
      store: 'walmart',
      zipcode: '05855'
    });
  };

  const addCustomMeal = () => {
    if (!newMeal.name || !newMeal.ingredients || newMeal.ingredients.length === 0) return;

    // Calculate totals
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0, cost: 0 };
    newMeal.ingredients.forEach(ing => {
      const ingredient = ingredients.find(i => i.id === ing.ingredientId);
      if (ingredient) {
        totals.protein += ingredient.protein * ing.amount;
        totals.fat += ingredient.fat * ing.amount;
        totals.carbs += ingredient.carbs * ing.amount;
        totals.calories += ingredient.calories * ing.amount;
        totals.cost += ingredient.price * ing.amount;
      }
    });

    const meal: CustomMeal = {
      id: `custom-meal-${Date.now()}`,
      name: newMeal.name!,
      description: newMeal.description!,
      category: newMeal.category!,
      ingredients: newMeal.ingredients!,
      prepTime: newMeal.prepTime!,
      instructions: newMeal.instructions!
    };

    const updatedMeals = [...customMeals, meal];
    setCustomMeals(updatedMeals);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customMeals', JSON.stringify(updatedMeals));
    }
    
    setShowAddMeal(false);
    setNewMeal({
      name: '',
      description: '',
      category: 'breakfast',
      ingredients: [],
      prepTime: 5,
      instructions: ''
    });
  };

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(ingredients.map(i => i.category)));

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 border-b">
          <button className="px-6 py-3 font-semibold border-b-2 border-green-600 text-green-600">
            Ingredients
          </button>
          <button 
            onClick={() => window.location.href = '#custom-meals'}
            className="px-6 py-3 font-semibold text-gray-600 hover:text-green-600"
          >
            Custom Meals ({customMeals.length})
          </button>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ingredients Database</h2>
          <button
            onClick={() => setShowAddIngredient(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Protein</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Carbs</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Fat</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Calories</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredients.map(ing => (
                <tr key={ing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{ing.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {ing.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">{ing.protein}g</td>
                  <td className="px-4 py-3 text-sm text-right text-yellow-600 font-semibold">{ing.carbs}g</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-600 font-semibold">{ing.fat}g</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600 font-semibold">{ing.calories}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">${ing.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ing.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Total: {filteredIngredients.length} ingredients
        </p>
      </div>

      {/* Add Ingredient Modal */}
      {showAddIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Ingredient</h2>
              <button
                onClick={() => setShowAddIngredient(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Triscuits"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={newIngredient.category}
                    onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="protein">Protein</option>
                    <option value="dairy">Dairy</option>
                    <option value="carbs">Carbs</option>
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fat">Fat</option>
                    <option value="snack">Snack</option>
                    <option value="condiment">Condiment</option>
                    <option value="spice">Spice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                  <input
                    type="text"
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., serving, oz, cup"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredient.protein}
                    onChange={(e) => setNewIngredient({ ...newIngredient, protein: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredient.carbs}
                    onChange={(e) => setNewIngredient({ ...newIngredient, carbs: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredient.fat}
                    onChange={(e) => setNewIngredient({ ...newIngredient, fat: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={newIngredient.calories}
                    onChange={(e) => setNewIngredient({ ...newIngredient, calories: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newIngredient.price}
                  onChange={(e) => setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={addIngredient}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  Add Ingredient
                </button>
                <button
                  onClick={() => setShowAddIngredient(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Meals Section */}
      <div id="custom-meals" className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Custom Meals</h2>
          <button
            onClick={() => setShowAddMeal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Create Meal
          </button>
        </div>

        {customMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No custom meals yet</p>
            <p className="text-gray-400">Create your first custom meal to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {customMeals.map(meal => (
              <div key={meal.id} className="border-2 border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                <div className="flex gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {meal.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {meal.prepTime} min
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {meal.ingredients.length} ingredients
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create Custom Meal</h2>
              <button
                onClick={() => setShowAddMeal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Pre-Dinner Snack Platter"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your meal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={newMeal.category}
                    onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (min)</label>
                  <input
                    type="number"
                    value={newMeal.prepTime}
                    onChange={(e) => setNewMeal({ ...newMeal, prepTime: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={newMeal.instructions}
                  onChange={(e) => setNewMeal({ ...newMeal, instructions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="How to prepare this meal..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
                <div className="space-y-2 mb-3">
                  {newMeal.ingredients?.map((ing, index) => {
                    const ingredient = ingredients.find(i => i.id === ing.ingredientId);
                    return (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1">{ingredient?.name}</span>
                        <span className="text-sm text-gray-600">{ing.amount} {ingredient?.unit}</span>
                        <button
                          onClick={() => {
                            const updated = newMeal.ingredients?.filter((_, i) => i !== index);
                            setNewMeal({ ...newMeal, ingredients: updated });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-2">
                    <select
                      id="ingredient-select"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        const selectedIng = ingredients.find(i => i.id === e.target.value);
                        const unitDisplay = document.getElementById('ingredient-unit-display');
                        if (unitDisplay && selectedIng) {
                          unitDisplay.textContent = selectedIng.unit;
                        } else if (unitDisplay) {
                          unitDisplay.textContent = '';
                        }
                      }}
                    >
                      <option value="">Select ingredient...</option>
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        id="ingredient-amount"
                        placeholder="Amount"
                        className="w-32 px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <span 
                        id="ingredient-unit-display"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium"
                      ></span>
                    </div>
                    <button
                      onClick={() => {
                        const select = document.getElementById('ingredient-select') as HTMLSelectElement;
                        const amountInput = document.getElementById('ingredient-amount') as HTMLInputElement;
                        if (select.value && amountInput.value) {
                          const updated = [...(newMeal.ingredients || []), {
                            ingredientId: select.value,
                            amount: parseFloat(amountInput.value)
                          }];
                          setNewMeal({ ...newMeal, ingredients: updated });
                          select.value = '';
                          amountInput.value = '';
                          const unitDisplay = document.getElementById('ingredient-unit-display');
                          if (unitDisplay) unitDisplay.textContent = '';
                        }
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={addCustomMeal}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Create Meal
                </button>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}