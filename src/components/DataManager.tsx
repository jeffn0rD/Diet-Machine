import { useState } from 'react';

export default function DataManager() {
  const [importStatus, setImportStatus] = useState<string>('');

  const exportDatabase = () => {
    if (typeof window === 'undefined') return;

    const data = {
      customIngredients: JSON.parse(localStorage.getItem('customIngredients') || '[]'),
      customMeals: JSON.parse(localStorage.getItem('customMeals') || '[]'),
      userSettings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
      savedMealPlans: JSON.parse(localStorage.getItem('savedMealPlans') || '[]'),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diet-machine-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDatabase = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.version) {
          setImportStatus('❌ Invalid backup file format');
          return;
        }

        // Import data
        if (data.customIngredients) {
          localStorage.setItem('customIngredients', JSON.stringify(data.customIngredients));
        }
        if (data.customMeals) {
          localStorage.setItem('customMeals', JSON.stringify(data.customMeals));
        }
        if (data.userSettings) {
          localStorage.setItem('userSettings', JSON.stringify(data.userSettings));
        }
        if (data.savedMealPlans) {
          localStorage.setItem('savedMealPlans', JSON.stringify(data.savedMealPlans));
        }

        setImportStatus('✅ Database imported successfully! Refresh the page to see changes.');
        
        // Refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        setImportStatus('❌ Error importing database: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (!confirm('⚠️ This will delete ALL custom data (ingredients, meals, settings, meal plans). Are you sure?')) {
      return;
    }

    if (!confirm('⚠️ FINAL WARNING: This action cannot be undone. Continue?')) {
      return;
    }

    localStorage.removeItem('customIngredients');
    localStorage.removeItem('customMeals');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('savedMealPlans');
    localStorage.removeItem('weekPlan');

    setImportStatus('✅ All data cleared. Refreshing...');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Management</h2>
      
      <div className="space-y-4">
        {/* Export */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">Export Database</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download a backup of all your custom data (ingredients, meals, settings, meal plans)
          </p>
          <button
            onClick={exportDatabase}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            📥 Export All Data
          </button>
        </div>

        {/* Import */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold text-lg mb-2">Import Database</h3>
          <p className="text-sm text-gray-600 mb-4">
            Restore data from a backup file. This will merge with existing data.
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={importDatabase}
              className="hidden"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-center cursor-pointer"
            >
              📤 Import Data
            </label>
          </label>
          {importStatus && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              importStatus.startsWith('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {importStatus}
            </div>
          )}
        </div>

        {/* Clear Data */}
        <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
          <h3 className="font-semibold text-lg mb-2 text-red-800">Clear All Data</h3>
          <p className="text-sm text-red-600 mb-4">
            ⚠️ Permanently delete all custom data. This cannot be undone!
          </p>
          <button
            onClick={clearAllData}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
          >
            🗑️ Clear All Data
          </button>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">What's Included?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Custom ingredients</li>
            <li>• Custom meals</li>
            <li>• User settings (macro targets, budget)</li>
            <li>• Saved meal plans</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Note: Pre-existing meals and ingredients are not included in backups as they're part of the app.
          </p>
        </div>
      </div>
    </div>
  );
}