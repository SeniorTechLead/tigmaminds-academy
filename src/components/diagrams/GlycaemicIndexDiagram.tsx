'use client';
import { useState } from 'react';

interface GIFood {
  name: string;
  gi: number;
  peak: number; // relative peak height 0-1
  peakTime: number; // minutes to peak
  color: string;
  category: 'high' | 'low';
}

const FOODS: GIFood[] = [
  { name: 'White rice', gi: 73, peak: 0.95, peakTime: 30, color: '#ef4444', category: 'high' },
  { name: 'White bread', gi: 75, peak: 0.92, peakTime: 25, color: '#f97316', category: 'high' },
  { name: 'Glucose', gi: 100, peak: 1.0, peakTime: 20, color: '#dc2626', category: 'high' },
  { name: 'Lentils (dal)', gi: 32, peak: 0.45, peakTime: 55, color: '#22c55e', category: 'low' },
  { name: 'Brown rice', gi: 50, peak: 0.55, peakTime: 50, color: '#16a34a', category: 'low' },
  { name: 'Chickpeas', gi: 28, peak: 0.40, peakTime: 60, color: '#15803d', category: 'low' },
  { name: 'Sweet potato', gi: 63, peak: 0.70, peakTime: 40, color: '#eab308', category: 'high' },
];

function glucoseCurve(food: GIFood, t: number): number {
  // t in minutes 0-120
  const tp = food.peakTime;
  const p = food.peak;
  if (t <= tp) {
    return p * Math.pow(t / tp, 1.5);
  }
  const decay = food.category === 'high' ? 0.025 : 0.012;
  return p * Math.exp(-decay * (t - tp));
}

export default function GlycaemicIndexDiagram() {
  const [highIdx, setHighIdx] = useState(0);
  const [lowIdx, setLowIdx] = useState(3);

  const highFoods = FOODS.filter((f) => f.category === 'high');
  const lowFoods = FOODS.filter((f) => f.category === 'low');
  const highFood = highFoods[highIdx];
  const lowFood = lowFoods[lowIdx - highFoods.length >= 0 ? lowIdx - highFoods.length : 0];

  const W = 460, H = 280;
  const mx = 50, mr = 20, mt = 55, mb = 40;
  const pw = W - mx - mr;
  const ph = H - mt - mb;

  const tMax = 120;
  const toX = (t: number) => mx + (t / tMax) * pw;
  const toY = (v: number) => mt + ph - v * ph;

  function curvePath(food: GIFood): string {
    const pts: string[] = [];
    for (let t = 0; t <= tMax; t += 2) {
      const v = glucoseCurve(food, t);
      pts.push(`${t === 0 ? 'M' : 'L'} ${toX(t).toFixed(1)} ${toY(v).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex flex-wrap gap-2 mb-2 justify-center items-center">
        <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">High GI:</label>
        <select
          value={highIdx}
          onChange={(e) => setHighIdx(Number(e.target.value))}
          className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          aria-label="Select high GI food"
        >
          {highFoods.map((f, i) => (
            <option key={i} value={i}>{f.name} (GI {f.gi})</option>
          ))}
        </select>
        <label className="text-xs text-slate-600 dark:text-slate-300 font-medium ml-2">Low GI:</label>
        <select
          value={lowIdx - highFoods.length < 0 ? 0 : lowIdx - highFoods.length}
          onChange={(e) => setLowIdx(Number(e.target.value))}
          className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          aria-label="Select low GI food"
        >
          {lowFoods.map((f, i) => (
            <option key={i} value={i}>{f.name} (GI {f.gi})</option>
          ))}
        </select>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Glycaemic index blood glucose curves">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <text x={W / 2} y={18} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Blood Glucose Response
        </text>

        {/* Axes */}
        <line x1={mx} y1={mt} x2={mx} y2={mt + ph} stroke="#94a3b8" strokeWidth="1" />
        <line x1={mx} y1={mt + ph} x2={mx + pw} y2={mt + ph} stroke="#94a3b8" strokeWidth="1" />

        {/* Y axis label */}
        <text x={14} y={mt + ph / 2} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" transform={`rotate(-90, 14, ${mt + ph / 2})`}>
          Blood glucose (mg/dL)
        </text>

        {/* X axis ticks */}
        {[0, 30, 60, 90, 120].map((t) => (
          <g key={t}>
            <line x1={toX(t)} y1={mt + ph} x2={toX(t)} y2={mt + ph + 4} stroke="#94a3b8" strokeWidth="1" />
            <text x={toX(t)} y={mt + ph + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{t} min</text>
          </g>
        ))}

        {/* Baseline */}
        <line x1={mx} y1={toY(0)} x2={mx + pw} y2={toY(0)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3,3" />

        {/* Insulin annotation zone */}
        <rect x={toX(highFood.peakTime - 10)} y={mt} width={toX(20) - mx} height={12} rx={3} fill="#fef3c7" className="dark:fill-yellow-900/30" />
        <text x={toX(highFood.peakTime)} y={mt + 9} textAnchor="middle" fill="#92400e" fontSize="7">
          Insulin spike
        </text>

        {/* Curves */}
        <path d={curvePath(highFood)} fill="none" stroke={highFood.color} strokeWidth="2.5" />
        <path d={curvePath(lowFood)} fill="none" stroke={lowFood.color} strokeWidth="2.5" />

        {/* Peak annotations */}
        <circle cx={toX(highFood.peakTime)} cy={toY(highFood.peak)} r={3} fill={highFood.color} />
        <text x={toX(highFood.peakTime) + 6} y={toY(highFood.peak) - 4} fill={highFood.color} fontSize="8" fontWeight="600">
          {highFood.name} (GI {highFood.gi})
        </text>

        <circle cx={toX(lowFood.peakTime)} cy={toY(lowFood.peak)} r={3} fill={lowFood.color} />
        <text x={toX(lowFood.peakTime) + 6} y={toY(lowFood.peak) - 4} fill={lowFood.color} fontSize="8" fontWeight="600">
          {lowFood.name} (GI {lowFood.gi})
        </text>

        {/* Bottom note */}
        <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          High-GI foods spike blood sugar fast; low-GI foods release energy gradually
        </text>
      </svg>
    </div>
  );
}
