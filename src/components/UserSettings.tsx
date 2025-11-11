import { useState, useEffect } from 'react';

interface UserSettings {
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyCalories: number;
  weeklyBudget: number;
}

const DEFAULT_SETTINGS: UserSettings = {
  dailyProtein: 150,
  dailyCarbs: 300,
  dailyFat: 90,
  dailyCalories: 2700,
  weeklyBudget: 100
};

export default function UserSettingsComponent() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setTempSettings(parsed);
      }
    }
  }, []);

  const handleSave = () => {
    setSettings(tempSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userSettings', JSON.stringify(tempSettings));
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const handleReset = () => {
    setTempSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Daily Targets & Budget</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
            >
              ✏️ Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
              >
                ✓ Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-semibold transition"
              >
                ✕ Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          /* Display Mode */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Daily Protein */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🥩</span>
                <h3 className="text-lg font-semibold text-red-800">Daily Protein</h3>
              </div>
              <p className="text-4xl font-bold text-red-600">{settings.dailyProtein}g</p>
              <p className="text-sm text-red-700 mt-2">Target per day</p>
            </div>

            {/* Daily Carbs */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🍞</span>
                <h3 className="text-lg font-semibold text-yellow-800">Daily Carbs</h3>
              </div>
              <p className="text-4xl font-bold text-yellow-600">{settings.dailyCarbs}g</p>
              <p className="text-sm text-yellow-700 mt-2">Target per day</p>
            </div>

            {/* Daily Fat */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🥑</span>
                <h3 className="text-lg font-semibold text-purple-800">Daily Fat</h3>
              </div>
              <p className="text-4xl font-bold text-purple-600">{settings.dailyFat}g</p>
              <p className="text-sm text-purple-700 mt-2">Target per day</p>
            </div>

            {/* Daily Calories */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <h3 className="text-lg font-semibold text-blue-800">Daily Calories</h3>
              </div>
              <p className="text-4xl font-bold text-blue-600">{settings.dailyCalories}</p>
              <p className="text-sm text-blue-700 mt-2">Target per day</p>
            </div>

            {/* Weekly Budget */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💰</span>
                <h3 className="text-lg font-semibold text-green-800">Weekly Budget</h3>
              </div>
              <p className="text-4xl font-bold text-green-600">${settings.weeklyBudget}</p>
              <p className="text-sm text-green-700 mt-2">${(settings.weeklyBudget / 7).toFixed(2)} per day</p>
            </div>

            {/* Calculated Macros */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📊</span>
                <h3 className="text-lg font-semibold text-gray-800">Macro Split</h3>
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-red-600">Protein:</span> {Math.round((settings.dailyProtein * 4 / settings.dailyCalories) * 100)}%
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-yellow-600">Carbs:</span> {Math.round((settings.dailyCarbs * 4 / settings.dailyCalories) * 100)}%
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-purple-600">Fat:</span> {Math.round((settings.dailyFat * 9 / settings.dailyCalories) * 100)}%
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Daily Protein Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🥩 Daily Protein Target (g)
                </label>
                <input
                  type="number"
                  value={tempSettings.dailyProtein}
                  onChange={(e) => setTempSettings({ ...tempSettings, dailyProtein: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 0.8-1.2g per lb body weight</p>
              </div>

              {/* Daily Carbs Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🍞 Daily Carbs Target (g)
                </label>
                <input
                  type="number"
                  value={tempSettings.dailyCarbs}
                  onChange={(e) => setTempSettings({ ...tempSettings, dailyCarbs: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg font-semibold"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Adjust based on activity level</p>
              </div>

              {/* Daily Fat Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🥑 Daily Fat Target (g)
                </label>
                <input
                  type="number"
                  value={tempSettings.dailyFat}
                  onChange={(e) => setTempSettings({ ...tempSettings, dailyFat: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 20-35% of total calories</p>
              </div>

              {/* Daily Calories Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔥 Daily Calorie Target
                </label>
                <input
                  type="number"
                  value={tempSettings.dailyCalories}
                  onChange={(e) => setTempSettings({ ...tempSettings, dailyCalories: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Based on TDEE and goals</p>
              </div>

              {/* Weekly Budget Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Weekly Budget ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tempSettings.weeklyBudget}
                  onChange={(e) => setTempSettings({ ...tempSettings, weeklyBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ${((tempSettings.weeklyBudget || 0) / 7).toFixed(2)} per day
                </p>
              </div>
            </div>

            {/* Calculated Preview */}
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Calculated Macro Split</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {Math.round((tempSettings.dailyProtein * 4 / tempSettings.dailyCalories) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-xs text-gray-500">{tempSettings.dailyProtein * 4} cal</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.round((tempSettings.dailyCarbs * 4 / tempSettings.dailyCalories) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="text-xs text-gray-500">{tempSettings.dailyCarbs * 4} cal</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((tempSettings.dailyFat * 9 / tempSettings.dailyCalories) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="text-xs text-gray-500">{tempSettings.dailyFat * 9} cal</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Total from macros: {tempSettings.dailyProtein * 4 + tempSettings.dailyCarbs * 4 + tempSettings.dailyFat * 9} calories
              </p>
            </div>

            {/* Quick Presets */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">⚡ Quick Presets</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <button
                  onClick={() => setTempSettings({
                    dailyProtein: 150,
                    dailyCarbs: 300,
                    dailyFat: 90,
                    dailyCalories: 2700,
                    weeklyBudget: 100
                  })}
                  className="bg-white p-3 rounded-lg border-2 border-blue-300 hover:bg-blue-100 transition text-left"
                >
                  <p className="font-semibold text-blue-800">Muscle Gain</p>
                  <p className="text-xs text-gray-600">150P / 300C / 90F</p>
                  <p className="text-xs text-gray-600">2,700 cal</p>
                </button>
                <button
                  onClick={() => setTempSettings({
                    dailyProtein: 180,
                    dailyCarbs: 150,
                    dailyFat: 80,
                    dailyCalories: 2100,
                    weeklyBudget: 100
                  })}
                  className="bg-white p-3 rounded-lg border-2 border-blue-300 hover:bg-blue-100 transition text-left"
                >
                  <p className="font-semibold text-blue-800">Fat Loss</p>
                  <p className="text-xs text-gray-600">180P / 150C / 80F</p>
                  <p className="text-xs text-gray-600">2,100 cal</p>
                </button>
                <button
                  onClick={() => setTempSettings({
                    dailyProtein: 160,
                    dailyCarbs: 200,
                    dailyFat: 85,
                    dailyCalories: 2400,
                    weeklyBudget: 100
                  })}
                  className="bg-white p-3 rounded-lg border-2 border-blue-300 hover:bg-blue-100 transition text-left"
                >
                  <p className="font-semibold text-blue-800">Maintenance</p>
                  <p className="text-xs text-gray-600">160P / 200C / 85F</p>
                  <p className="text-xs text-gray-600">2,400 cal</p>
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 font-semibold underline"
              >
                🔄 Reset to Default Values
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">💡 Tips for Setting Your Targets</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Protein:</strong> Aim for 0.8-1.2g per lb of body weight for muscle building</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Carbs:</strong> Adjust based on activity level (higher for intense training)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Fat:</strong> Should be 20-35% of total calories for hormone health</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Calories:</strong> Calculate your TDEE and adjust ±500 for goals</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">•</span>
            <span><strong>Budget:</strong> Track your actual spending and adjust as needed</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Export function to get current settings
export function getUserSettings(): UserSettings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return DEFAULT_SETTINGS;
}