import { useState, useEffect } from 'react';
import IngredientEditor from './IngredientEditor';
import ingredientsData from '../data/ingredients.json';

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
  bulkPricing?: Array<{
    size: string;
    price: number;
    unit: string;
    store: string;
  }>;
  preferredSize?: string;
}

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load from localStorage or use default data
    if (typeof window !== 'undefined') {
      const savedIngredients = localStorage.getItem('customIngredients');
      
      if (savedIngredients) {
        setIngredients([...ingredientsData.ingredients, ...JSON.parse(savedIngredients)]);
      } else {
        setIngredients(ingredientsData.ingredients);
      }

      // Check for search parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    } else {
      setIngredients(ingredientsData.ingredients);
    }
  }, []);

  const handleSaveIngredient = () => {
    // Reload ingredients after save
    if (typeof window !== 'undefined') {
      const savedIngredients = localStorage.getItem('customIngredients');
      if (savedIngredients) {
        setIngredients([...ingredientsData.ingredients, ...JSON.parse(savedIngredients)]);
      }
    }
    setShowAddIngredient(false);
    setEditingIngredientId(null);
  };

  const handleDeleteIngredient = (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    
    const customIngredients = ingredients.filter(i => i.id.startsWith('custom-') && i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('customIngredients', JSON.stringify(customIngredients));
    }
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(ingredients.map(i => i.category)));

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ingredients List */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map(ing => (
            <div key={ing.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{ing.name}</h3>
                {ing.id.startsWith('custom-') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingIngredientId(ing.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteIngredient(ing.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mb-3">
                {ing.category}
              </span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-semibold ml-1">{ing.protein}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Carbs:</span>
                  <span className="font-semibold ml-1">{ing.carbs}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Fat:</span>
                  <span className="font-semibold ml-1">{ing.fat}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-semibold ml-1">{ing.calories}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <span className="text-green-600 font-bold">${ing.price.toFixed(2)}</span>
                <span className="text-gray-500 text-sm ml-1">/ {ing.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No ingredients found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Ingredient Modal */}
      {(showAddIngredient || editingIngredientId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <IngredientEditor
              ingredientId={editingIngredientId || undefined}
              onSave={handleSaveIngredient}
              onCancel={() => {
                setShowAddIngredient(false);
                setEditingIngredientId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}