import { useState, useEffect } from 'react';
import mealsData from '../data/meals.json';
import MacroChart from './MacroChart';
import ShoppingList from './ShoppingList';

interface Meal {
  id: string;
  name: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  cost: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

interface WeekPlan {
  [day: string]: {
    breakfast: string | null;
    lunch: string | null;
    dinner: string | null;
    snacks: string[];
  };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner() {
  const [userSettings, setUserSettings] = useState({
    protein: 150,
    carbs: 300,
    fat: 80,
    calories: 2700,
    weeklyBudget: 100
  });

  const [weekPlan, setWeekPlan] = useState<WeekPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weekPlan');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { breakfast: null, lunch: null, dinner: null, snacks: [] }
    }), {});
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showMealSelector, setShowMealSelector] = useState<{
    show: boolean;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | null;
  }>({ show: false, mealType: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('weekPlan', JSON.stringify(weekPlan));
    }
  }, [weekPlan]);

  useEffect(() => {
    // Load user settings
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        setUserSettings(JSON.parse(saved));
      }
    }
  }, []);

  const allMeals = [
    ...mealsData.breakfasts,
    ...mealsData.lunches,
    ...mealsData.dinners,
    ...mealsData.snacks
  ];

  const getMealById = (id: string): Meal | undefined => {
    return allMeals.find(m => m.id === id);
  };

  const selectMeal = (mealId: string) => {
    if (!showMealSelector.mealType) return;

    setWeekPlan(prev => {
      const newPlan = { ...prev };
      if (showMealSelector.mealType === 'snacks') {
        newPlan[selectedDay].snacks = [...newPlan[selectedDay].snacks, mealId];
      } else {
        newPlan[selectedDay][showMealSelector.mealType] = mealId;
      }
      return newPlan;
    });
    setShowMealSelector({ show: false, mealType: null });
  };

  const removeMeal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index?: number) => {
    setWeekPlan(prev => {
      const newPlan = { ...prev };
      if (mealType === 'snacks' && index !== undefined) {
        newPlan[selectedDay].snacks = newPlan[selectedDay].snacks.filter((_, i) => i !== index);
      } else if (mealType !== 'snacks') {
        newPlan[selectedDay][mealType] = null;
      }
      return newPlan;
    });
  };

  const calculateDailyTotals = (day: string) => {
    const dayPlan = weekPlan[day];
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0, cost: 0 };

    [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...dayPlan.snacks]
      .filter(Boolean)
      .forEach(mealId => {
        const meal = getMealById(mealId!);
        if (meal) {
          totals.protein += meal.protein;
          totals.fat += meal.fat;
          totals.carbs += meal.carbs;
          totals.calories += meal.calories;
          totals.cost += meal.cost;
        }
      });

    return totals;
  };

  const calculateWeeklyTotals = () => {
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0, cost: 0 };
    DAYS.forEach(day => {
      const dayTotals = calculateDailyTotals(day);
      totals.protein += dayTotals.protein;
      totals.fat += dayTotals.fat;
      totals.carbs += dayTotals.carbs;
      totals.calories += dayTotals.calories;
      totals.cost += dayTotals.cost;
    });
    return totals;
  };

  const getMealsForType = (type: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    switch (type) {
      case 'breakfast': return mealsData.breakfasts;
      case 'lunch': return mealsData.lunches;
      case 'dinner': return mealsData.dinners;
      case 'snacks': return mealsData.snacks;
    }
  };

  const isDayComplete = (day: string) => {
    const dayPlan = weekPlan[day];
    return !!(dayPlan.breakfast && dayPlan.lunch && dayPlan.dinner);
  };

  const dailyTotals = calculateDailyTotals(selectedDay);
  const weeklyTotals = calculateWeeklyTotals();

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => {
            const isComplete = isDayComplete(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-lg font-semibold transition relative ${
                  selectedDay === day
                    ? 'bg-green-600 text-white'
                    : isComplete
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
                {isComplete && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
                {!isComplete && selectedDay !== day && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Plan */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedDay}'s Meals</h2>
            
            {/* Breakfast */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">🍳 Breakfast</h3>
                <button
                  onClick={() => setShowMealSelector({ show: true, mealType: 'breakfast' })}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  + Add
                </button>
              </div>
              {weekPlan[selectedDay].breakfast ? (
                <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <a 
                         href={`/meals?search=${encodeURIComponent(getMealById(weekPlan[selectedDay].breakfast!)?.name || '')}`}
                         className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                         title="View meal details"
                       >
                         {getMealById(weekPlan[selectedDay].breakfast!)?.name}
                       </a>
                    <p className="text-sm text-gray-600">
                      {getMealById(weekPlan[selectedDay].breakfast!)?.protein}g protein | 
                      ${getMealById(weekPlan[selectedDay].breakfast!)?.cost.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal('breakfast')}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 italic">No meal selected</p>
              )}
            </div>

            {/* Lunch */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">🥙 Lunch</h3>
                <button
                  onClick={() => setShowMealSelector({ show: true, mealType: 'lunch' })}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  + Add
                </button>
              </div>
              {weekPlan[selectedDay].lunch ? (
                <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <a 
                         href={`/meals?search=${encodeURIComponent(getMealById(weekPlan[selectedDay].lunch!)?.name || '')}`}
                         className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                         title="View meal details"
                       >
                         {getMealById(weekPlan[selectedDay].lunch!)?.name}
                       </a>
                    <p className="text-sm text-gray-600">
                      {getMealById(weekPlan[selectedDay].lunch!)?.protein}g protein | 
                      ${getMealById(weekPlan[selectedDay].lunch!)?.cost.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal('lunch')}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 italic">No meal selected</p>
              )}
            </div>

            {/* Dinner */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">🍽️ Dinner</h3>
                <button
                  onClick={() => setShowMealSelector({ show: true, mealType: 'dinner' })}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  + Add
                </button>
              </div>
              {weekPlan[selectedDay].dinner ? (
                <div className="bg-purple-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <a 
                         href={`/meals?search=${encodeURIComponent(getMealById(weekPlan[selectedDay].dinner!)?.name || '')}`}
                         className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                         title="View meal details"
                       >
                         {getMealById(weekPlan[selectedDay].dinner!)?.name}
                       </a>
                    <p className="text-sm text-gray-600">
                      {getMealById(weekPlan[selectedDay].dinner!)?.protein}g protein | 
                      ${getMealById(weekPlan[selectedDay].dinner!)?.cost.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal('dinner')}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 italic">No meal selected</p>
              )}
            </div>

            {/* Snacks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">🥜 Snacks</h3>
                <button
                  onClick={() => setShowMealSelector({ show: true, mealType: 'snacks' })}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  + Add
                </button>
              </div>
              {weekPlan[selectedDay].snacks.length > 0 ? (
                <div className="space-y-2">
                  {weekPlan[selectedDay].snacks.map((snackId, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <a 
                             href={`/meals?search=${encodeURIComponent(getMealById(snackId)?.name || '')}`}
                             className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                             title="View meal details"
                           >
                             {getMealById(snackId)?.name}
                           </a>
                        <p className="text-sm text-gray-600">
                          {getMealById(snackId)?.protein}g protein | 
                          ${getMealById(snackId)?.cost.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMeal('snacks', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No snacks selected</p>
              )}
            </div>
          </div>

          {/* Daily Totals */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Daily Totals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-green-100">Protein</p>
                <p className="text-2xl font-bold">
                  {dailyTotals.protein.toFixed(1)}g / {userSettings.protein}g
                </p>
                <div className="w-full bg-green-900 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((dailyTotals.protein / userSettings.protein) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-green-100">Calories</p>
                <p className="text-2xl font-bold">
                  {dailyTotals.calories.toFixed(0)} / {userSettings.calories}
                </p>
                <div className="w-full bg-blue-900 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((dailyTotals.calories / userSettings.calories) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-green-100">Fat</p>
                <p className="text-2xl font-bold">
                  {dailyTotals.fat.toFixed(1)}g / {userSettings.fat}g
                </p>
                <div className="w-full bg-green-900 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((dailyTotals.fat / userSettings.fat) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-green-100">Carbs</p>
                <p className="text-2xl font-bold">
                  {dailyTotals.carbs.toFixed(1)}g / {userSettings.carbs}g
                </p>
                <div className="w-full bg-blue-900 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((dailyTotals.carbs / userSettings.carbs) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-green-100">Daily Cost</p>
                <p className="text-2xl font-bold">
                  ${dailyTotals.cost.toFixed(2)} / ${(userSettings.weeklyBudget / 7).toFixed(2)}
                </p>
                <div className="w-full bg-green-900 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min((dailyTotals.cost / (userSettings.weeklyBudget / 7)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Shopping List */}
        <div className="space-y-4">
          <MacroChart weekPlan={weekPlan} getMealById={getMealById} />
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Weekly Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Protein:</span>
                <span className="font-semibold">{weeklyTotals.protein.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Calories:</span>
                <span className="font-semibold">{weeklyTotals.calories.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Cost:</span>
                <span className="font-semibold text-green-600">${weeklyTotals.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Daily Protein:</span>
                <span className="font-semibold">{(weeklyTotals.protein / 7).toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Daily Calories:</span>
                <span className="font-semibold">{(weeklyTotals.calories / 7).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <ShoppingList weekPlan={weekPlan} getMealById={getMealById} />
        </div>
      </div>

      {/* Meal Selector Modal */}
      {showMealSelector.show && showMealSelector.mealType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Select {showMealSelector.mealType.charAt(0).toUpperCase() + showMealSelector.mealType.slice(1)}
              </h2>
              <button
                onClick={() => setShowMealSelector({ show: false, mealType: null })}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-4">
              {getMealsForType(showMealSelector.mealType).map((meal: any) => (
                <div
                  key={meal.id}
                  onClick={() => selectMeal(meal.id)}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 cursor-pointer transition"
                >
                  <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Protein:</span>
                      <span className="font-semibold ml-1">{meal.protein}g</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Calories:</span>
                      <span className="font-semibold ml-1">{meal.calories}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Cost:</span>
                      <span className="font-semibold ml-1 text-green-600">${meal.cost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prep:</span>
                      <span className="font-semibold ml-1">{meal.prepTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}