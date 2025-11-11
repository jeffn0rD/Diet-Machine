import { useState } from 'react';

interface ShoppingListProps {
  weekPlan: any;
  getMealById: (id: string) => any;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ShoppingList({ weekPlan, getMealById }: ShoppingListProps) {
  const [showList, setShowList] = useState(false);

  const generateShoppingList = () => {
    const ingredientMap = new Map<string, { amount: number; unit: string; category: string }>();

    DAYS.forEach(day => {
      const dayPlan = weekPlan[day];
      [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...dayPlan.snacks]
        .filter(Boolean)
        .forEach(mealId => {
          const meal = getMealById(mealId!);
          if (meal && meal.ingredients) {
            meal.ingredients.forEach((ing: any) => {
              const key = ing.name.toLowerCase();
              if (ingredientMap.has(key)) {
                const existing = ingredientMap.get(key)!;
                existing.amount += ing.amount;
              } else {
                ingredientMap.set(key, {
                  amount: ing.amount,
                  unit: ing.unit,
                  category: getCategoryForIngredient(ing.name)
                });
              }
            });
          }
        });
    });

    // Group by category
    const categorized: { [key: string]: Array<{ name: string; amount: number; unit: string }> } = {};
    
    ingredientMap.forEach((value, name) => {
      if (!categorized[value.category]) {
        categorized[value.category] = [];
      }
      categorized[value.category].push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: Math.ceil(value.amount * 10) / 10, // Round up to 1 decimal
        unit: value.unit
      });
    });

    return categorized;
  };

  const getCategoryForIngredient = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('egg') || lower.includes('chicken') || lower.includes('pork') || 
        lower.includes('turkey') || lower.includes('beef')) return '🥚 Proteins';
    if (lower.includes('cheese') || lower.includes('yogurt') || lower.includes('cottage')) return '🥛 Dairy';
    if (lower.includes('bean') || lower.includes('lentil') || lower.includes('chickpea')) return '🥫 Canned Goods';
    if (lower.includes('rice') || lower.includes('oat') || lower.includes('tortilla') || 
        lower.includes('bread')) return '🌾 Grains';
    if (lower.includes('banana') || lower.includes('apple') || lower.includes('berry')) return '🍎 Fruits';
    if (lower.includes('spinach') || lower.includes('tomato') || lower.includes('onion') || 
        lower.includes('garlic') || lower.includes('vegetable')) return '🥬 Vegetables';
    if (lower.includes('oil') || lower.includes('butter') || lower.includes('peanut butter')) return '🥜 Fats & Oils';
    return '📦 Other';
  };

  const shoppingList = generateShoppingList();
  const categories = Object.keys(shoppingList).sort();

  const exportToText = () => {
    let text = '🛒 WEEKLY SHOPPING LIST\n\n';
    categories.forEach(category => {
      text += `${category}\n`;
      text += '─'.repeat(40) + '\n';
      shoppingList[category].forEach(item => {
        text += `☐ ${item.name} - ${item.amount} ${item.unit}\n`;
      });
      text += '\n';
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Shopping List</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowList(!showList)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            {showList ? 'Hide' : 'Show'} List
          </button>
          {showList && (
            <button
              onClick={exportToText}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
            >
              📥 Export
            </button>
          )}
        </div>
      </div>

      {showList && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {categories.map(category => (
            <div key={category}>
              <h4 className="font-semibold text-lg mb-2 text-gray-700">{category}</h4>
              <ul className="space-y-1 ml-4">
                {shoppingList[category].map((item, index) => (
                  <li key={index} className="text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>
                        {item.name} - <span className="font-medium">{item.amount} {item.unit}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {!showList && (
        <p className="text-gray-500 text-center py-4">
          Click "Show List" to view your weekly shopping list
        </p>
      )}
    </div>
  );
}