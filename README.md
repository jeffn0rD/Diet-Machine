# 🥗 Diet Machine - High-Protein Budget Meal Planner

A dynamic, interactive web application for planning high-protein, budget-friendly meals. Built with Astro, React, and Tailwind CSS.

![Diet Machine](https://img.shields.io/badge/Protein-150g%2B-green)
![Budget](https://img.shields.io/badge/Budget-%2495--100%2Fweek-blue)
![Meals](https://img.shields.io/badge/Meals-60%2B%20Options-purple)

## 🎯 Features

### 📅 Dynamic Meal Planner
- **Weekly Planning**: Select meals for each day of the week
- **Real-time Calculations**: Instant nutritional breakdown and cost tracking
- **Flexible Selection**: Mix and match from 60+ meal options
- **Local Storage**: Your meal plans are saved automatically

### 🛒 Smart Shopping Lists
- **Auto-Generated**: Creates shopping lists from your meal plan
- **Categorized**: Organized by store sections (Proteins, Produce, Dairy, etc.)
- **Quantities Calculated**: Automatically sums ingredient amounts
- **Exportable**: Download as text file for easy shopping

### 📊 Nutritional Tracking
- **Visual Charts**: Bar charts showing daily protein, carbs, fat, and calories
- **Weekly Summary**: Track averages and totals across the week
- **Goal Monitoring**: See if you're hitting 150g+ daily protein target
- **Cost Tracking**: Monitor daily and weekly spending

### 🍽️ Meal Browser
- **60+ Options**: Browse breakfasts, lunches, dinners, and snacks
- **Detailed Info**: View macros, ingredients, prep time, and cost
- **Search & Filter**: Find meals by name, category, or tags
- **Recipe Details**: Full ingredient lists and instructions

### ✏️ Custom Content
- **Add Ingredients**: Create custom ingredients with nutritional data
- **Create Meals**: Build your own meals from available ingredients
- **Auto-Calculate**: Macros and costs calculated automatically
- **Persistent Storage**: Custom content saved in browser

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jeffn0rD/Diet-Machine.git
cd Diet-Machine
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:4321
```

### Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
Diet-Machine/
├── src/
│   ├── components/          # React components
│   │   ├── MealPlanner.tsx      # Weekly meal planning interface
│   │   ├── MealBrowser.tsx      # Browse and search meals
│   │   ├── IngredientManager.tsx # Manage ingredients and custom meals
│   │   ├── MacroChart.tsx       # Nutritional charts
│   │   └── ShoppingList.tsx     # Shopping list generator
│   ├── data/                # JSON data files
│   │   ├── meals.json           # 60+ meal options
│   │   └── ingredients.json     # Ingredient database
│   ├── layouts/             # Astro layouts
│   │   └── Layout.astro         # Main layout with navigation
│   ├── pages/               # Astro pages
│   │   ├── index.astro          # Home page
│   │   ├── planner.astro        # Meal planner page
│   │   ├── meals.astro          # Meal browser page
│   │   └── ingredients.astro    # Ingredient manager page
│   └── styles/              # Global styles
│       └── global.css           # Tailwind CSS
├── docs/                    # Documentation
│   ├── enhanced_meal_plan.pdf   # Printable meal plan
│   ├── expanded_meals.md        # Detailed meal options
│   ├── enhanced_grocery_list.md # Shopping guide
│   └── README.md                # Original project summary
├── public/                  # Static assets
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 🎨 Technology Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[React](https://react.dev/)** - UI components
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Recharts](https://recharts.org/)** - Data visualization
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📊 Data Structure

### Meals (`src/data/meals.json`)
```json
{
  "breakfasts": [...],
  "lunches": [...],
  "dinners": [...],
  "snacks": [...]
}
```

Each meal includes:
- `id`: Unique identifier
- `name`: Meal name
- `description`: Brief description
- `protein`, `fat`, `carbs`, `calories`: Nutritional info
- `cost`: Price per serving
- `prepTime`: Preparation time in minutes
- `ingredients`: Array of ingredients with amounts
- `instructions`: Cooking instructions
- `tags`: Categories (e.g., "batch-friendly", "budget")

### Ingredients (`src/data/ingredients.json`)
```json
{
  "ingredients": [...]
}
```

Each ingredient includes:
- `id`: Unique identifier
- `name`: Ingredient name
- `category`: Type (protein, dairy, carbs, etc.)
- `protein`, `fat`, `carbs`, `calories`: Per unit
- `price`: Cost per unit
- `unit`: Measurement unit
- `store`: Store name (default: walmart)
- `zipcode`: Location (default: 05855)

## 🔧 Customization

### Adding New Meals

1. **Via UI**: Use the Ingredient Manager page to create custom meals
2. **Via JSON**: Edit `src/data/meals.json` directly

### Adding New Ingredients

1. **Via UI**: Use the Ingredient Manager page
2. **Via JSON**: Edit `src/data/ingredients.json` directly

### Updating Prices

Prices can be updated in `src/data/ingredients.json`. A price scraper script is planned for automatic updates.

## 🌐 Deployment

### Cloudflare Pages

1. **Connect Repository**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repository

2. **Configure Build**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 20

3. **Deploy**
   - Cloudflare will automatically build and deploy
   - Get a `*.pages.dev` URL

### Other Platforms

The built site is static and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📖 Usage Guide

### Planning Your Week

1. Navigate to the **Meal Planner** page
2. Select a day of the week
3. Click "+ Add" for each meal type
4. Choose meals from the modal
5. View daily and weekly totals
6. Generate shopping list

### Browsing Meals

1. Navigate to the **Browse Meals** page
2. Use search or category filters
3. Click any meal for detailed information
4. View ingredients, instructions, and macros

### Managing Ingredients

1. Navigate to the **Ingredients** page
2. Search or filter ingredients
3. Click "+ Add Ingredient" to create custom items
4. Click "Custom Meals" tab to create meals

### Creating Custom Meals

1. Go to Ingredients page → Custom Meals tab
2. Click "+ Create Meal"
3. Fill in meal details
4. Add ingredients with amounts
5. Macros and cost calculated automatically

## 💡 Tips & Best Practices

### Meal Planning
- Start with 3-4 core meals you're comfortable with
- Use batch-friendly meals for efficiency
- Mix high-cost and low-cost meals to stay on budget
- Aim for 150g+ protein daily

### Shopping
- Generate shopping list before grocery trip
- Check for sales on proteins (chicken, pork)
- Buy in bulk when possible
- Use the export feature for easy reference

### Meal Prep
- Batch cook on Sundays (2-3 hours)
- Freeze burritos and pre-cooked proteins
- Hard-boil eggs for the week
- Portion snacks in advance

## 🛣️ Roadmap

### Planned Features
- [ ] Walmart price scraper (auto-update prices)
- [ ] Meal plan templates (save and load plans)
- [ ] Nutrition goals customization
- [ ] Recipe scaling (adjust serving sizes)
- [ ] Print-friendly meal plan view
- [ ] Mobile app version
- [ ] Meal prep schedule generator
- [ ] Grocery list sharing
- [ ] Barcode scanner for ingredients
- [ ] Integration with grocery delivery services

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Meal plan data based on USDA FoodData Central
- Pricing data from Walmart (Newport, VT - ZIP 05855)
- Built with the amazing Astro framework
- Charts powered by Recharts

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the original meal plan PDF

## 📚 Additional Resources

- [Original Meal Plan PDF](./docs/enhanced_meal_plan.pdf) - Printable version
- [Expanded Meals Guide](./docs/expanded_meals.md) - All 60+ meal options
- [Shopping List Guide](./docs/enhanced_grocery_list.md) - Detailed shopping info
- [Project Summary](./docs/README.md) - Original project documentation

---

**Built with ❤️ for healthy, budget-conscious eating**

**Target User**: 180lb male, strength training, Newport VT  
**Daily Goals**: 150g+ protein, ~2,700 calories  
**Weekly Budget**: $95-100  
**Meal Options**: 60+ choices