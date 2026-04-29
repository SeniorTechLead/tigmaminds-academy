'use client';
import { useState } from 'react';

type Sex = 'male' | 'female';

function harrisBenedict(weight: number, height: number, age: number, sex: Sex): number {
  if (sex === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

const ACTIVITY_MULT = [
  { label: 'Sedentary', factor: 1.2 },
  { label: 'Light exercise', factor: 1.375 },
  { label: 'Moderate', factor: 1.55 },
  { label: 'Active', factor: 1.725 },
  { label: 'Very active', factor: 1.9 },
];

export default function BMRCalculatorDiagram() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(170);
  const [sex, setSex] = useState<Sex>('male');
  const [actIdx, setActIdx] = useState(1);

  const bmr = Math.round(harrisBenedict(weight, height, age, sex));
  const act = ACTIVITY_MULT[actIdx];
  const tdee = Math.round(bmr * act.factor);
  const activityKcal = Math.round(bmr * (act.factor - 1) * 0.85);
  const tefKcal = Math.round(tdee * 0.1);

  const W = 460, H = 340;

  // Circle sizes proportional to values, max radius 70
  const maxVal = Math.max(bmr, activityKcal, tefKcal);
  const scale = 65 / maxVal;
  const bmrR = bmr * scale;
  const actR = activityKcal * scale;
  const tefR = tefKcal * scale;

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Input controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 px-1">
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
            className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Select sex"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Age: {age}</label>
          <input type="range" min={10} max={80} value={age} onChange={(e) => setAge(Number(e.target.value))} className="accent-blue-600" aria-label="Age" />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Weight: {weight} kg</label>
          <input type="range" min={30} max={150} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="accent-blue-600" aria-label="Weight in kg" />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Height: {height} cm</label>
          <input type="range" min={100} max={220} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="accent-blue-600" aria-label="Height in cm" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">Activity:</label>
        <select
          value={actIdx}
          onChange={(e) => setActIdx(Number(e.target.value))}
          className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          aria-label="Activity level"
        >
          {ACTIVITY_MULT.map((a, i) => (
            <option key={i} value={i}>{a.label} (x{a.factor})</option>
          ))}
        </select>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="BMR calculator with visual breakdown">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <text x={W / 2} y={22} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Daily Energy Expenditure Breakdown
        </text>

        {/* Formula */}
        <text x={W / 2} y={42} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Harris-Benedict: BMR = {sex === 'male' ? '88.36 + 13.40·W + 4.80·H − 5.68·A' : '447.59 + 9.25·W + 3.10·H − 4.33·A'}
        </text>

        {/* Three circles */}
        {/* BMR circle — largest, center-left */}
        <circle cx={130} cy={170} r={bmrR} fill="#3b82f6" opacity={0.2} stroke="#3b82f6" strokeWidth="2" />
        <text x={130} y={165} textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">{bmr}</text>
        <text x={130} y={180} textAnchor="middle" fill="#2563eb" fontSize="9">BMR (kcal)</text>
        <text x={130} y={195} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">~60-70% of TDEE</text>
        <text x={130} y={207} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Breathing, circulation,</text>
        <text x={130} y={217} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">cell repair at rest</text>

        {/* Activity circle */}
        <circle cx={280} cy={150} r={actR} fill="#22c55e" opacity={0.2} stroke="#22c55e" strokeWidth="2" />
        <text x={280} y={145} textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700">{activityKcal}</text>
        <text x={280} y={160} textAnchor="middle" fill="#16a34a" fontSize="9">Activity (kcal)</text>
        <text x={280} y={175} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">~15-30% of TDEE</text>

        {/* TEF circle */}
        <circle cx={380} cy={180} r={tefR} fill="#f59e0b" opacity={0.2} stroke="#f59e0b" strokeWidth="2" />
        <text x={380} y={176} textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="700">{tefKcal}</text>
        <text x={380} y={190} textAnchor="middle" fill="#d97706" fontSize="8">TEF (kcal)</text>
        <text x={380} y={204} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">~10% of intake</text>
        <text x={380} y={214} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="7">Digesting food</text>

        {/* TDEE total */}
        <rect x={100} y={H - 65} width={260} height={40} rx={8} className="fill-blue-50 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={W / 2} y={H - 42} textAnchor="middle" fill="#2563eb" fontSize="14" fontWeight="700">
          TDEE = {tdee} kcal/day
        </text>
        <text x={W / 2} y={H - 30} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Total Daily Energy Expenditure ({act.label})
        </text>

        <text x={W / 2} y={H - 8} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
          Move the sliders to see how age, weight, height, and activity affect energy needs
        </text>
      </svg>
    </div>
  );
}
