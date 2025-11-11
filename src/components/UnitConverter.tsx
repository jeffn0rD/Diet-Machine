import { useState } from 'react';

interface ConversionResult {
  value: number;
  unit: string;
}

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputUnit, setInputUnit] = useState('oz');
  const [outputUnit, setOutputUnit] = useState('g');
  const [result, setResult] = useState<ConversionResult | null>(null);

  // Conversion factors (all to grams as base)
  const weightConversions: { [key: string]: number } = {
    'g': 1,
    'kg': 1000,
    'oz': 28.3495,
    'lb': 453.592,
    'mg': 0.001
  };

  // Volume conversions (all to ml as base)
  const volumeConversions: { [key: string]: number } = {
    'ml': 1,
    'l': 1000,
    'cup': 236.588,
    'fl oz': 29.5735,
    'tbsp': 14.7868,
    'tsp': 4.92892,
    'gallon': 3785.41,
    'quart': 946.353,
    'pint': 473.176
  };

  // Common ingredient volume-to-weight conversions (1 cup in grams)
  const ingredientDensities: { [key: string]: number } = {
    'flour': 120,
    'sugar': 200,
    'brown sugar': 220,
    'butter': 227,
    'milk': 240,
    'water': 240,
    'oil': 218,
    'honey': 340,
    'rice (uncooked)': 185,
    'oats': 90,
    'cocoa powder': 85,
    'powdered sugar': 120,
    'salt': 292,
    'baking powder': 220,
    'baking soda': 220
  };

  const [selectedIngredient, setSelectedIngredient] = useState('flour');

  const weightUnits = Object.keys(weightConversions);
  const volumeUnits = Object.keys(volumeConversions);
  const allUnits = [...weightUnits, ...volumeUnits];

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    let resultValue = 0;

    // Check if both units are weight
    if (weightUnits.includes(inputUnit) && weightUnits.includes(outputUnit)) {
      const grams = value * weightConversions[inputUnit];
      resultValue = grams / weightConversions[outputUnit];
    }
    // Check if both units are volume
    else if (volumeUnits.includes(inputUnit) && volumeUnits.includes(outputUnit)) {
      const ml = value * volumeConversions[inputUnit];
      resultValue = ml / volumeConversions[outputUnit];
    }
    // Volume to weight conversion (requires ingredient)
    else if (volumeUnits.includes(inputUnit) && weightUnits.includes(outputUnit)) {
      const cups = value * volumeConversions[inputUnit] / volumeConversions['cup'];
      const grams = cups * ingredientDensities[selectedIngredient];
      resultValue = grams / weightConversions[outputUnit];
    }
    // Weight to volume conversion (requires ingredient)
    else if (weightUnits.includes(inputUnit) && volumeUnits.includes(outputUnit)) {
      const grams = value * weightConversions[inputUnit];
      const cups = grams / ingredientDensities[selectedIngredient];
      resultValue = cups * volumeConversions['cup'] / volumeConversions[outputUnit];
    }

    setResult({
      value: resultValue,
      unit: outputUnit
    });
  };

  const needsIngredient = 
    (volumeUnits.includes(inputUnit) && weightUnits.includes(outputUnit)) ||
    (weightUnits.includes(inputUnit) && volumeUnits.includes(outputUnit));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Unit Converter</h2>
      
      <div className="space-y-4">
        {/* Input */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Amount"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <optgroup label="Weight">
                  {weightUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </optgroup>
                <optgroup label="Volume">
                  {volumeUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <select
              value={outputUnit}
              onChange={(e) => setOutputUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <optgroup label="Weight">
                {weightUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </optgroup>
              <optgroup label="Volume">
                {volumeUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Ingredient selector for volume-weight conversions */}
        {needsIngredient && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Select Ingredient (for volume ↔ weight conversion)
            </label>
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(ingredientDensities).map(ing => (
                <option key={ing} value={ing}>
                  {ing.charAt(0).toUpperCase() + ing.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-blue-700 mt-2">
              Note: Volume-to-weight conversions vary by ingredient density
            </p>
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={convert}
          disabled={!inputValue}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
        >
          Convert
        </button>

        {/* Result */}
        {result && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
            <p className="text-sm text-green-100 mb-2">Result</p>
            <p className="text-3xl font-bold">
              {result.value.toFixed(2)} {result.unit}
            </p>
          </div>
        )}

        {/* Quick reference */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Reference</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• 1 oz = 28.35 g</div>
            <div>• 1 lb = 453.59 g</div>
            <div>• 1 cup = 236.59 ml</div>
            <div>• 1 tbsp = 14.79 ml</div>
            <div>• 1 tsp = 4.93 ml</div>
            <div>• 1 fl oz = 29.57 ml</div>
          </div>
        </div>
      </div>
    </div>
  );
}