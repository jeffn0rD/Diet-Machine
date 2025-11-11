import { useState, useEffect } from 'react';

interface SavedMealPlan {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  weekPlan: {
    [key: string]: {
      breakfast: string | null;
      lunch: string | null;
      dinner: string | null;
      snacks: string[];
    };
  };
}

export default function MealPlanManager() {
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SavedMealPlan | null>(null);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedMealPlans');
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    }
  };

  const getCurrentWeekPlan = () => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('weeklyMealPlan');
    return saved ? JSON.parse(saved) : null;
  };

  const saveMealPlan = (overwriteId?: string) => {
    const currentPlan = getCurrentWeekPlan();
    if (!currentPlan || !planName.trim()) return;

    const now = new Date().toISOString();
    const newPlan: SavedMealPlan = {
      id: overwriteId || `plan-${Date.now()}`,
      name: planName.trim(),
      description: planDescription.trim(),
      createdAt: overwriteId ? (savedPlans.find(p => p.id === overwriteId)?.createdAt || now) : now,
      updatedAt: now,
      weekPlan: currentPlan
    };

    let updatedPlans: SavedMealPlan[];
    if (overwriteId) {
      updatedPlans = savedPlans.map(p => p.id === overwriteId ? newPlan : p);
    } else {
      updatedPlans = [...savedPlans, newPlan];
    }

    setSavedPlans(updatedPlans);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
    }

    setPlanName('');
    setPlanDescription('');
    setShowSaveDialog(false);
  };

  const loadMealPlan = (plan: SavedMealPlan) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('weeklyMealPlan', JSON.stringify(plan.weekPlan));
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('mealPlanLoaded'));
    }
    setShowLoadDialog(false);
    alert(`Loaded meal plan: ${plan.name}`);
  };

  const deleteMealPlan = (planId: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    const updatedPlans = savedPlans.filter(p => p.id !== planId);
    setSavedPlans(updatedPlans);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
    }
  };

  const duplicateMealPlan = (plan: SavedMealPlan) => {
    const now = new Date().toISOString();
    const newPlan: SavedMealPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      name: `${plan.name} (Copy)`,
      createdAt: now,
      updatedAt: now
    };

    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
    }
  };

  const exportMealPlan = (plan: SavedMealPlan) => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importMealPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as SavedMealPlan;
        imported.id = `plan-${Date.now()}`;
        imported.createdAt = new Date().toISOString();
        imported.updatedAt = new Date().toISOString();

        const updatedPlans = [...savedPlans, imported];
        setSavedPlans(updatedPlans);
        if (typeof window !== 'undefined') {
          localStorage.setItem('savedMealPlans', JSON.stringify(updatedPlans));
        }
        alert(`Imported meal plan: ${imported.name}`);
      } catch (error) {
        alert('Error importing meal plan. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition"
          >
            💾 Save Current Plan
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            📂 Load Saved Plan
          </button>
          <label className="flex-1 md:flex-none bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold transition cursor-pointer text-center">
            📥 Import Plan
            <input
              type="file"
              accept=".json"
              onChange={importMealPlan}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Saved Plans List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Saved Meal Plans ({savedPlans.length})
        </h2>

        {savedPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No saved meal plans yet</p>
            <p className="text-gray-400">Create a meal plan and save it to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlans.map(plan => (
              <div key={plan.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 transition">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{plan.name}</h3>
                {plan.description && (
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                )}
                <div className="text-xs text-gray-500 mb-4">
                  <p>Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(plan.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => loadMealPlan(plan)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPlanName(plan.name);
                      setPlanDescription(plan.description);
                      setShowSaveDialog(true);
                    }}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => duplicateMealPlan(plan)}
                    className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 transition"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => exportMealPlan(plan)}
                    className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition"
                  >
                    📤
                  </button>
                  <button
                    onClick={() => deleteMealPlan(plan.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedPlan ? '✏️ Edit Meal Plan' : '💾 Save Meal Plan'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Week 1 - Muscle Gain"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Add notes about this meal plan..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => saveMealPlan(selectedPlan?.id)}
                  disabled={!planName.trim()}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedPlan ? 'Update' : 'Save'}
                </button>
                {selectedPlan && (
                  <button
                    onClick={() => saveMealPlan()}
                    disabled={!planName.trim()}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Save as New
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSelectedPlan(null);
                    setPlanName('');
                    setPlanDescription('');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">📂 Load Meal Plan</h2>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {savedPlans.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No saved meal plans available</p>
              ) : (
                <div className="space-y-3">
                  {savedPlans.map(plan => (
                    <div
                      key={plan.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition cursor-pointer"
                      onClick={() => loadMealPlan(plan)}
                    >
                      <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Updated: {new Date(plan.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}