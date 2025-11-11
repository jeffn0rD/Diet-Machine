import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MacroChartProps {
  weekPlan: any;
  getMealById: (id: string) => any;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MacroChart({ weekPlan, getMealById }: MacroChartProps) {
  const chartData = DAYS.map(day => {
    const dayPlan = weekPlan[day];
    let totals = { protein: 0, fat: 0, carbs: 0, calories: 0 };

    [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...dayPlan.snacks]
      .filter(Boolean)
      .forEach(mealId => {
        const meal = getMealById(mealId!);
        if (meal) {
          totals.protein += meal.protein;
          totals.fat += meal.fat;
          totals.carbs += meal.carbs;
          totals.calories += meal.calories;
        }
      });

    return {
      day: day.substring(0, 3),
      protein: Math.round(totals.protein),
      fat: Math.round(totals.fat),
      carbs: Math.round(totals.carbs),
      calories: Math.round(totals.calories)
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Weekly Macro Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="protein" fill="#10b981" name="Protein (g)" />
          <Bar dataKey="carbs" fill="#f59e0b" name="Carbs (g)" />
          <Bar dataKey="fat" fill="#8b5cf6" name="Fat (g)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Daily Calories</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#3b82f6" name="Calories" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}