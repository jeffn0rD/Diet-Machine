import { useState, useEffect } from 'react';

interface BulkSize {
  size: string;
  unit: string;
  price: number;
  store: string;
  isPreferred: boolean;
}

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
  bulkSizes?: BulkSize[];
}

interface IngredientEditorProps {
  ingredientId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const COMMON_UNITS = [
  'oz', 'lb', 'g', 'kg',
  'cup', 'ml', 'l', 'fl oz',
  'tbsp', 'tsp',
  'whole', 'serving', 'piece',
  'can', 'package', 'container'
];

const CATEGORIES = [
  'protein', 'dairy', 'carbs', 'fruit', 'vegetable',
  'fat', 'snack', 'condiment', 'spice', 'beverage'
];

export default function IngredientEditor({ ingredientId, onSave, onCancel }: IngredientEditorProps) {
  const [ingredient, setIngredient] = useState<Partial<Ingredient>>({
    name: '',
    category: 'protein',
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
    price: 0,
    unit: 'oz',
    store: 'walmart',
    zipcode: '05855',
    bulkSizes: []
  });

  const [newBulkSize, setNewBulkSize] = useState<Partial<BulkSize>>({
    size: '',
    unit: 'oz',
    price: 0,
    store: 'walmart',
    isPreferred: false
  });

  useEffect(() => {
    if (ingredientId) {
      loadIngredient(ingredientId);
    }
  }, [ingredientId]);

  const loadIngredient = (id: string) => {
    if (typeof window === 'undefined') return;

    // Load from custom ingredients
    const customIngredients = JSON.parse(localStorage.getItem('customIngredients') || '[]');
    const found = customIngredients.find((i: Ingredient) => i.id === id);
    
    if (found) {
      setIngredient(found);
    }
  };

  const addBulkSize = () => {
    if (!newBulkSize.size || !newBulkSize.price) return;

    const bulkSize: BulkSize = {
      size: newBulkSize.size!,
      unit: newBulkSize.unit!,
      price: newBulkSize.price!,
      store: newBulkSize.store!,
      isPreferred: newBulkSize.isPreferred || false
    };

    // If this is set as preferred, unset others
    let bulkSizes = [...(ingredient.bulkSizes || [])];
    if (bulkSize.isPreferred) {
      bulkSizes = bulkSizes.map(bs => ({ ...bs, isPreferred: false }));
    }
    bulkSizes.push(bulkSize);

    setIngredient({ ...ingredient, bulkSizes });
    setNewBulkSize({
      size: '',
      unit: 'oz',
      price: 0,
      store: 'walmart',
      isPreferred: false
    });
  };

  const removeBulkSize = (index: number) => {
    const bulkSizes = ingredient.bulkSizes?.filter((_, i) => i !== index);
    setIngredient({ ...ingredient, bulkSizes });
  };

  const setPreferredBulkSize = (index: number) => {
    const bulkSizes = ingredient.bulkSizes?.map((bs, i) => ({
      ...bs,
      isPreferred: i === index
    }));
    setIngredient({ ...ingredient, bulkSizes });
  };

  const calculateUnitCostFromBulk = (bulkSize: BulkSize) => {
    // Parse size (e.g., "2lb" -> 2, "48oz" -> 48)
    const sizeMatch = bulkSize.size.match(/(\d+\.?\d*)/);
    if (!sizeMatch) return 0;

    const amount = parseFloat(sizeMatch[1]);
    const unitCost = bulkSize.price / amount;
    return Math.round(unitCost * 100) / 100;
  };

  const saveIngredient = () => {
    if (!ingredient.name) {
      alert('Please provide an ingredient name');
      return;
    }

    const completeIngredient: Ingredient = {
      id: ingredientId || `ingredient-${Date.now()}`,
      name: ingredient.name!,
      category: ingredient.category!,
      protein: ingredient.protein!,
      fat: ingredient.fat!,
      carbs: ingredient.carbs!,
      calories: ingredient.calories!,
      price: ingredient.price!,
      unit: ingredient.unit!,
      store: ingredient.store!,
      zipcode: ingredient.zipcode!,
      bulkSizes: ingredient.bulkSizes || []
    };

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const customIngredients = JSON.parse(localStorage.getItem('customIngredients') || '[]');
      
      if (ingredientId) {
        // Update existing
        const index = customIngredients.findIndex((i: Ingredient) => i.id === ingredientId);
        if (index >= 0) {
          customIngredients[index] = completeIngredient;
        } else {
          customIngredients.push(completeIngredient);
        }
      } else {
        // Add new
        customIngredients.push(completeIngredient);
      }

      localStorage.setItem('customIngredients', JSON.stringify(customIngredients));
    }

    if (onSave) onSave();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {ingredientId ? '✏️ Edit Ingredient' : '➕ Add New Ingredient'}
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
              Ingredient Name *
            </label>
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Chicken Breast"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={ingredient.category}
              onChange={(e) => setIngredient({ ...ingredient, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unit and Price */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unit *
            </label>
            <select
              value={ingredient.unit}
              onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {COMMON_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price per Unit ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={ingredient.price}
              onChange={(e) => setIngredient({ ...ingredient, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store
            </label>
            <input
              type="text"
              value={ingredient.store}
              onChange={(e) => setIngredient({ ...ingredient, store: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Protein (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={ingredient.protein}
              onChange={(e) => setIngredient({ ...ingredient, protein: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carbs (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={ingredient.carbs}
              onChange={(e) => setIngredient({ ...ingredient, carbs: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fat (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={ingredient.fat}
              onChange={(e) => setIngredient({ ...ingredient, fat: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Calories
            </label>
            <input
              type="number"
              value={ingredient.calories}
              onChange={(e) => setIngredient({ ...ingredient, calories: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Bulk Sizes Section */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 Bulk Sizes & Pricing</h3>
          
          {/* Current Bulk Sizes */}
          {ingredient.bulkSizes && ingredient.bulkSizes.length > 0 && (
            <div className="space-y-2 mb-4">
              {ingredient.bulkSizes.map((bs, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">
                      {bs.size} {bs.unit} - ${bs.price.toFixed(2)}
                      {bs.isPreferred && <span className="ml-2 text-green-600 text-sm">⭐ Preferred</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      Unit cost: ${calculateUnitCostFromBulk(bs)}/{ingredient.unit} at {bs.store}
                    </p>
                  </div>
                  {!bs.isPreferred && (
                    <button
                      onClick={() => setPreferredBulkSize(index)}
                      className="text-gray-500 hover:text-green-600 text-sm font-semibold"
                    >
                      Set Preferred
                    </button>
                  )}
                  <button
                    onClick={() => removeBulkSize(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Bulk Size */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-3">Add Bulk Purchase Option</p>
            <div className="grid md:grid-cols-5 gap-3">
              <div>
                <input
                  type="text"
                  value={newBulkSize.size}
                  onChange={(e) => setNewBulkSize({ ...newBulkSize, size: e.target.value })}
                  placeholder="e.g., 2lb, 48oz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <select
                  value={newBulkSize.unit}
                  onChange={(e) => setNewBulkSize({ ...newBulkSize, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {COMMON_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={newBulkSize.price}
                  onChange={(e) => setNewBulkSize({ ...newBulkSize, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBulkSize.isPreferred}
                    onChange={(e) => setNewBulkSize({ ...newBulkSize, isPreferred: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Preferred</span>
                </label>
              </div>
              <div>
                <button
                  onClick={addBulkSize}
                  disabled={!newBulkSize.size || !newBulkSize.price}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={saveIngredient}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            💾 {ingredientId ? 'Update Ingredient' : 'Save Ingredient'}
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