'use client';
import { useState } from 'react';

const ACTIVITY_LEVELS = [
  { label: 'Sedentary', factor: 1.2 },
  { label: 'Light', factor: 1.375 },
  { label: 'Moderate', factor: 1.55 },
  { label: 'Active', factor: 1.725 },
  { label: 'Very Active', factor: 1.9 },
];

const BMR = 1500; // kcal baseline
const TEF = 0.1; // thermic effect of food as fraction of intake
const INTAKE = 2200; // kcal food intake

export default function EnergyBalanceDiagram() {
  const [actIdx, setActIdx] = useState(2);
  const act = ACTIVITY_LEVELS[actIdx];
  const totalOut = Math.round(BMR * act.factor);
  const bmrOut = BMR;
  const activityOut = Math.round(BMR * (act.factor - 1) - INTAKE * TEF);
  const tefOut = Math.round(INTAKE * TEF);
  const balance = INTAKE - totalOut;

  // Scale beam tilt: max ±12 degrees
  const tiltDeg = Math.max(-12, Math.min(12, (balance / 300) * 12));

  const W = 440, H = 300;
  const pivotX = W / 2, pivotY = 170;
  const beamLen = 160;

  const rad = (tiltDeg * Math.PI) / 180;
  const lx = pivotX - beamLen * Math.cos(rad);
  const ly = pivotY - beamLen * Math.sin(rad) * -1;
  const rx = pivotX + beamLen * Math.cos(rad);
  const ry = pivotY + beamLen * Math.sin(rad) * -1;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Activity:</label>
        <input
          type="range"
          min={0}
          max={4}
          value={actIdx}
          onChange={(e) => setActIdx(Number(e.target.value))}
          className="w-40 accent-blue-600"
          aria-label="Activity level slider"
        />
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 w-20">{act.label}</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Energy balance scale diagram">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <text x={W / 2} y={20} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Energy Balance
        </text>

        {/* Equation */}
        <text x={W / 2} y={40} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Energy In − Energy Out = Balance ({balance > 0 ? '+' : ''}{balance} kcal)
        </text>

        {/* Triangle base */}
        <polygon points={`${pivotX},${pivotY} ${pivotX - 12},${pivotY + 25} ${pivotX + 12},${pivotY + 25}`} className="fill-gray-400 dark:fill-gray-500" />

        {/* Beam */}
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#64748b" strokeWidth="4" strokeLinecap="round" />

        {/* Left pan — Energy In */}
        <line x1={lx} y1={ly} x2={lx} y2={ly + 30} stroke="#64748b" strokeWidth="1.5" />
        <rect x={lx - 50} y={ly + 30} width={100} height={50} rx={6} className="fill-amber-100 dark:fill-amber-900/40" stroke="#f59e0b" strokeWidth="1.5" />
        <text x={lx} y={ly + 47} textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="700">Energy In</text>
        <text x={lx} y={ly + 60} textAnchor="middle" fill="#92400e" fontSize="9">{INTAKE} kcal</text>
        <text x={lx} y={ly + 72} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">Food &amp; drinks</text>

        {/* Right pan — Energy Out */}
        <line x1={rx} y1={ry} x2={rx} y2={ry + 30} stroke="#64748b" strokeWidth="1.5" />
        <rect x={rx - 55} y={ry + 30} width={110} height={72} rx={6} className="fill-blue-100 dark:fill-blue-900/40" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={rx} y={ry + 45} textAnchor="middle" fill="#2563eb" fontSize="10" fontWeight="700">Energy Out</text>
        <text x={rx} y={ry + 57} textAnchor="middle" fill="#1e40af" fontSize="9">{totalOut} kcal total</text>
        <text x={rx - 40} y={ry + 70} className="fill-gray-500 dark:fill-gray-400" fontSize="8">BMR: {bmrOut}</text>
        <text x={rx - 40} y={ry + 80} className="fill-gray-500 dark:fill-gray-400" fontSize="8">Activity: {activityOut}</text>
        <text x={rx - 40} y={ry + 90} className="fill-gray-500 dark:fill-gray-400" fontSize="8">TEF: {tefOut}</text>

        {/* Balance indicator */}
        <text x={W / 2} y={H - 20} textAnchor="middle" fontSize="11" fontWeight="600"
          className={balance > 50 ? 'fill-red-500' : balance < -50 ? 'fill-blue-500' : 'fill-green-600'}>
          {balance > 50 ? '⚠ Surplus → weight gain' : balance < -50 ? '⚠ Deficit → weight loss' : '✓ Roughly balanced'}
        </text>
      </svg>
    </div>
  );
}
