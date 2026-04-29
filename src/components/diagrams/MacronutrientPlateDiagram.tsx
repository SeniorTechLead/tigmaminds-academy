'use client';
import { useState } from 'react';

type MealType = 'assamese' | 'balanced' | 'athlete';

interface MacroSlice {
  label: string;
  pct: number;
  kcalPerG: number;
  color: string;
  darkColor: string;
}

const MEALS: Record<MealType, { name: string; slices: MacroSlice[] }> = {
  assamese: {
    name: 'Assamese Meal',
    slices: [
      { label: 'Carbs (rice, pithas)', pct: 70, kcalPerG: 4, color: '#f59e0b', darkColor: '#d97706' },
      { label: 'Protein (dal, fish)', pct: 15, kcalPerG: 4, color: '#ef4444', darkColor: '#dc2626' },
      { label: 'Fat (mustard oil)', pct: 15, kcalPerG: 9, color: '#22c55e', darkColor: '#16a34a' },
    ],
  },
  balanced: {
    name: 'Balanced Meal',
    slices: [
      { label: 'Carbohydrates', pct: 50, kcalPerG: 4, color: '#f59e0b', darkColor: '#d97706' },
      { label: 'Protein', pct: 25, kcalPerG: 4, color: '#ef4444', darkColor: '#dc2626' },
      { label: 'Fat', pct: 25, kcalPerG: 9, color: '#22c55e', darkColor: '#16a34a' },
    ],
  },
  athlete: {
    name: "Athlete's Meal",
    slices: [
      { label: 'Carbohydrates', pct: 55, kcalPerG: 4, color: '#f59e0b', darkColor: '#d97706' },
      { label: 'Protein', pct: 30, kcalPerG: 4, color: '#ef4444', darkColor: '#dc2626' },
      { label: 'Fat', pct: 15, kcalPerG: 9, color: '#22c55e', darkColor: '#16a34a' },
    ],
  },
};

const MEAL_KEYS: MealType[] = ['assamese', 'balanced', 'athlete'];

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pieSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCart(cx, cy, r, startAngle);
  const e = polarToCart(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

export default function MacronutrientPlateDiagram() {
  const [meal, setMeal] = useState<MealType>('assamese');
  const data = MEALS[meal];
  const cx = 160, cy = 150, r = 100;

  let cumAngle = 0;
  const slicesWithAngles = data.slices.map((s) => {
    const start = cumAngle;
    const sweep = (s.pct / 100) * 360;
    cumAngle += sweep;
    return { ...s, startAngle: start, endAngle: start + sweep };
  });

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <div className="flex flex-wrap gap-1 mb-3 justify-center">
        {MEAL_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setMeal(k)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              meal === k
                ? 'bg-amber-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {MEALS[k].name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 320 310" className="w-full h-auto" role="img" aria-label={`Macronutrient plate for ${data.name}`}>
        <rect width="320" height="310" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="160" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          {data.name}
        </text>

        {/* Plate rim */}
        <circle cx={cx} cy={cy} r={r + 8} fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="3" />

        {/* Pie slices */}
        {slicesWithAngles.map((s, i) => {
          const mid = polarToCart(cx, cy, r * 0.6, (s.startAngle + s.endAngle) / 2);
          return (
            <g key={i}>
              <path
                d={pieSlicePath(cx, cy, r, s.startAngle, s.endAngle)}
                fill={s.color}
                className="dark:opacity-80"
                stroke="#fff"
                strokeWidth="2"
              />
              <text x={mid.x} y={mid.y - 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                {s.pct}%
              </text>
              <text x={mid.x} y={mid.y + 9} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="500">
                {s.kcalPerG} kcal/g
              </text>
            </g>
          );
        })}

        {/* Legend */}
        {data.slices.map((s, i) => {
          const ly = 268 + i * 14;
          return (
            <g key={i}>
              <rect x={50} y={ly - 8} width={10} height={10} rx={2} fill={s.color} />
              <text x={66} y={ly} className="fill-gray-600 dark:fill-gray-300" fontSize="10">
                {s.label} — {s.pct}% ({s.kcalPerG} kcal/g)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
