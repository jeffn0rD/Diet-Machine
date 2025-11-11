# 🤖 AI Recipe Parser - Implementation Guide

## Overview
This guide explains how to use AI (ChatGPT, Claude, etc.) to parse recipes from websites or text and convert them into a JSON format that can be imported into the Diet Machine application.

---

## 🎯 Quick Start

### Step 1: Copy the Recipe Text
Copy the recipe text from any website, cookbook, or source. Include:
- Recipe name
- Ingredients list
- Instructions
- Servings (if available)
- Prep/cook time (if available)

### Step 2: Use the AI Prompt
Copy and paste the following prompt into ChatGPT, Claude, or any AI assistant, along with your recipe text:

---

## 📋 AI PROMPT FOR RECIPE PARSING

```
I need you to parse this recipe and convert it into a JSON format for my meal planning application. 

RECIPE TEXT:
[PASTE YOUR RECIPE HERE]

Please analyze the recipe and output TWO JSON structures:

1. INGREDIENTS JSON (for any ingredients not already in my database):
Create an array of ingredient objects with this structure:
{
  "ingredients": [
    {
      "id": "ingredient-name-lowercase",
      "name": "Ingredient Name",
      "category": "protein|dairy|carbs|fruit|vegetable|fat|snack|condiment|spice",
      "protein": 0.0,
      "fat": 0.0,
      "carbs": 0.0,
      "calories": 0,
      "price": 0.00,
      "unit": "oz|cup|tbsp|tsp|whole|serving|lb|g|ml",
      "store": "walmart",
      "zipcode": "05855"
    }
  ]
}

2. MEAL JSON:
Create a meal object with this structure:
{
  "id": "meal-name-lowercase",
  "name": "Meal Name",
  "description": "Brief description of the meal",
  "category": "breakfast|lunch|dinner|snack",
  "protein": 0.0,
  "fat": 0.0,
  "carbs": 0.0,
  "calories": 0,
  "cost": 0.00,
  "prepTime": 0,
  "tags": ["tag1", "tag2"],
  "ingredients": [
    {
      "name": "Ingredient Name",
      "amount": 0.0,
      "unit": "oz|cup|tbsp|tsp|whole|serving"
    }
  ],
  "instructions": "Step-by-step cooking instructions"
}

IMPORTANT INSTRUCTIONS:
1. Calculate nutritional values PER SERVING (divide total by number of servings)
2. Use USDA FoodData Central or similar database for accurate nutritional info
3. Estimate ingredient costs based on typical grocery store prices
4. Choose appropriate category based on when the meal is typically eaten
5. Add relevant tags (e.g., "high-protein", "budget-friendly", "quick", "batch-friendly")
6. Keep instructions clear and concise
7. Use standard units (oz, cup, tbsp, tsp, whole, serving)
8. For the ingredients JSON, only include ingredients that might not be in a standard database
9. Calculate total meal cost by summing ingredient costs × amounts

Please provide both JSON structures separately so I can copy and import them.
```

---

## 📊 Example Usage

### Input Recipe:
```
High-Protein Chicken Stir Fry
Serves: 4
Prep Time: 15 minutes

Ingredients:
- 1 lb chicken breast, diced
- 2 cups broccoli florets
- 1 cup bell peppers, sliced
- 2 tbsp soy sauce
- 1 tbsp olive oil
- 2 cloves garlic, minced
- 1 tsp ginger, grated

Instructions:
1. Heat olive oil in a large pan over medium-high heat
2. Add chicken and cook until golden brown, about 5-7 minutes
3. Add garlic and ginger, cook for 1 minute
4. Add broccoli and bell peppers, stir fry for 5 minutes
5. Add soy sauce and cook for 2 more minutes
6. Serve hot over rice if desired
```

### AI Output:

#### Ingredients JSON:
```json
{
  "ingredients": [
    {
      "id": "chicken-breast",
      "name": "Chicken Breast",
      "category": "protein",
      "protein": 31.0,
      "fat": 3.6,
      "carbs": 0.0,
      "calories": 165,
      "price": 0.25,
      "unit": "oz",
      "store": "walmart",
      "zipcode": "05855"
    },
    {
      "id": "broccoli",
      "name": "Broccoli",
      "category": "vegetable",
      "protein": 2.8,
      "fat": 0.4,
      "carbs": 6.6,
      "calories": 34,
      "price": 0.15,
      "unit": "cup",
      "store": "walmart",
      "zipcode": "05855"
    },
    {
      "id": "bell-pepper",
      "name": "Bell Pepper",
      "category": "vegetable",
      "protein": 1.0,
      "fat": 0.3,
      "carbs": 6.0,
      "calories": 30,
      "price": 0.20,
      "unit": "cup",
      "store": "walmart",
      "zipcode": "05855"
    }
  ]
}
```

#### Meal JSON:
```json
{
  "id": "high-protein-chicken-stir-fry",
  "name": "High-Protein Chicken Stir Fry",
  "description": "Healthy stir fry with chicken breast and fresh vegetables",
  "category": "dinner",
  "protein": 35.0,
  "fat": 8.0,
  "carbs": 12.0,
  "calories": 260,
  "cost": 3.50,
  "prepTime": 15,
  "tags": ["high-protein", "quick", "healthy", "low-carb"],
  "ingredients": [
    {
      "name": "Chicken Breast",
      "amount": 4,
      "unit": "oz"
    },
    {
      "name": "Broccoli",
      "amount": 0.5,
      "unit": "cup"
    },
    {
      "name": "Bell Pepper",
      "amount": 0.25,
      "unit": "cup"
    },
    {
      "name": "Soy Sauce",
      "amount": 0.5,
      "unit": "tbsp"
    },
    {
      "name": "Olive Oil",
      "amount": 0.25,
      "unit": "tbsp"
    },
    {
      "name": "Garlic",
      "amount": 0.5,
      "unit": "whole"
    }
  ],
  "instructions": "Heat olive oil in a large pan over medium-high heat. Add chicken and cook until golden brown, about 5-7 minutes. Add garlic and ginger, cook for 1 minute. Add broccoli and bell peppers, stir fry for 5 minutes. Add soy sauce and cook for 2 more minutes. Serve hot."
}
```

---

## 🔧 Importing into Diet Machine

### Method 1: Manual Import (Current)
1. Copy the JSON output from the AI
2. Save it to a file (e.g., `new-recipe.json`)
3. Use the Import functionality in Diet Machine
4. Select the JSON file
5. Review and confirm the import

### Method 2: Direct Paste (Future Feature)
1. Copy the JSON output
2. Go to "Import" section in Diet Machine
3. Paste JSON directly into text area
4. Click "Import"

---

## 📝 Tips for Best Results

### 1. Provide Complete Information
- Include all ingredients with amounts
- Specify number of servings
- Include prep and cook times
- Add any special instructions

### 2. Be Specific About Units
- Use standard measurements (cups, oz, tbsp, tsp)
- Specify if ingredients are raw or cooked
- Include preparation notes (diced, sliced, minced)

### 3. Verify Nutritional Data
- AI estimates may not be 100% accurate
- Cross-check with USDA database if needed
- Adjust values based on your specific ingredients

### 4. Cost Estimation
- AI will estimate based on typical prices
- Adjust costs based on your local prices
- Update prices using the price scraper tool

### 5. Categorization
- Choose category based on typical meal time
- Add relevant tags for easy filtering
- Use consistent naming conventions

---

## 🎨 Advanced Usage

### Batch Processing Multiple Recipes
You can process multiple recipes at once by providing them all in one prompt:

```
I have 3 recipes to parse. Please process each one and provide separate JSON outputs for each:

RECIPE 1:
[First recipe text]

RECIPE 2:
[Second recipe text]

RECIPE 3:
[Third recipe text]
```

### Customizing for Dietary Restrictions
Add specific instructions to the prompt:

```
Additional requirements:
- This is for a high-protein, low-carb diet
- Target: 150g protein, 2700 calories per day
- Budget-conscious options preferred
- Highlight protein content in tags
```

### Converting Recipe Servings
Ask the AI to adjust servings:

```
Please also provide a version scaled to 2 servings instead of 4.
Calculate all nutritional values and costs accordingly.
```

---

## 🔄 Integration with Diet Machine

### Current Workflow:
1. **Parse Recipe** → AI generates JSON
2. **Review JSON** → Verify accuracy
3. **Save to File** → Save as .json file
4. **Import** → Use Diet Machine import feature
5. **Verify** → Check meal appears correctly

### Future Enhancements:
- Direct API integration with OpenAI
- In-app recipe parser
- Automatic nutritional lookup
- Price scraping integration
- Image recognition for recipes

---

## 💡 Example Prompts for Different Scenarios

### For a Recipe from a Website:
```
I found this recipe on [website name]. Please parse it and create the JSON format:
[Paste recipe]
```

### For a Handwritten Recipe:
```
I have a handwritten recipe. I'll describe it:
- Name: [Recipe name]
- Ingredients: [List ingredients]
- Instructions: [Describe steps]
- Servings: [Number]
Please create the JSON format.
```

### For Meal Prep Recipes:
```
This is a meal prep recipe that makes multiple servings.
Please calculate per-serving nutritional values and add "batch-friendly" tag.
[Paste recipe]
```

---

## 📊 Nutritional Data Sources

The AI should reference these databases for accuracy:
- **USDA FoodData Central**: https://fdc.nal.usda.gov/
- **Nutritionix**: https://www.nutritionix.com/
- **MyFitnessPal**: https://www.myfitnesspal.com/

---

## 🚀 Future Development

### Planned Features:
1. **Direct AI Integration**
   - Built-in recipe parser
   - Real-time parsing
   - No copy-paste needed

2. **Image Recognition**
   - Upload recipe photos
   - OCR text extraction
   - Automatic parsing

3. **Web Scraping**
   - Direct URL input
   - Automatic recipe extraction
   - Popular recipe site support

4. **Nutritional API**
   - Automatic nutrient lookup
   - Real-time price checking
   - Ingredient substitutions

---

## 🆘 Troubleshooting

### Issue: AI provides inaccurate nutritional data
**Solution**: Cross-reference with USDA database and manually adjust values

### Issue: Ingredient units don't match
**Solution**: Use the unit converter tool in Diet Machine to convert

### Issue: Cost estimates are too high/low
**Solution**: Update prices manually or use the price scraper tool

### Issue: JSON format errors
**Solution**: Validate JSON using jsonlint.com before importing

---

## 📞 Support

For questions or issues:
- Check the main README.md
- Review RESEARCH_FINDINGS.md
- Update jeffs_todo.txt with questions

---

## 🎯 Summary

The AI Recipe Parser provides a fast, efficient way to add new recipes to Diet Machine:

✅ **Pros:**
- Fast recipe entry
- Accurate nutritional calculations
- Consistent formatting
- Batch processing capability

⚠️ **Considerations:**
- Verify nutritional data
- Adjust costs for local prices
- Review ingredient categorization
- Check serving calculations

**Cost:** ~$0.01-0.10 per recipe with OpenAI API (if using API integration)
**Time Saved:** ~10-15 minutes per recipe vs manual entry

---

*Last Updated: [Current Date]*
*Version: 1.0*