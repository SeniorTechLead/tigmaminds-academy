/**
 * AlgebraBalanceScaleDiagram — Al-Khwarizmi’s insight: an equation is a balance.
 * Interactive: step through solving 2x + 5 = 13 by keeping the scale balanced.
 */
import { useState } from 'react';

const STEPS = [
  { label: 'Start: 2x + 5 = 13', left: { xCount: 2, ones: 5 }, right: { xCount: 0, ones: 13 }, hint: null },
  { label: 'Subtract 5 from both sides', left: { xCount: 2, ones: 0 }, right: { xCount: 0, ones: 8 }, hint: '2x + 5 − 5 = 13 − 5  →  2x = 8' },
  { label: 'Divide both sides by 2', left: { xCount: 1, ones: 0 }, right: { xCount: 0, ones: 4 }, hint: '2x ÷ 2 = 8 ÷ 2  →  x = 4' },
] as const;

function Block({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <>
      <rect x={x} y={y} width={22} height={22} rx="3" className={`${color} stroke-gray-600 dark:stroke-gray-300`} strokeWidth="1" />
      <text x={x + 11} y={y + 15} textAnchor="middle" fontSize="11" fontWeight="bold" className="fill-gray-800 dark:fill-gray-100">{text}</text>
    </>
  );
}

export default function AlgebraBalanceScaleDiagram() {
  const [step, setStep] = useState(0);
  const cur = STEPS[step];

  const cx = 200, beamY = 110;
  const leftCx = 100, rightCx = 300;

  const renderBlocks = (panCx: number, baseY: number, xCount: number, ones: number) => {
    const blocks: JSX.Element[] = [];
    let idx = 0;
    const total = xCount + ones;
    const cols = Math.min(total, 5);
    const startX = panCx - (cols * 24) / 2;
    for (let i = 0; i < xCount; i++) {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      blocks.push(<Block key={`x-${i}`} x={startX + col * 24} y={baseY - 28 - row * 26} text="x" color="fill-blue-300 dark:fill-blue-600" />);
      idx++;
    }
    for (let i = 0; i < ones; i++) {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      blocks.push(<Block key={`o-${i}`} x={startX + col * 24} y={baseY - 28 - row * 26} text="1" color="fill-amber-200 dark:fill-amber-600" />);
      idx++;
    }
    return blocks;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Balance scale showing equation solving step by step">
        <rect width="400" height="260" className="fill-white dark:fill-slate-950" rx="8" />
        <text x="200" y="22" textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">Al-Jabr: Keep the Balance</text>

        {/* Fulcrum triangle */}
        <polygon points={`${cx},200 ${cx - 18},230 ${cx + 18},230`} className="fill-gray-400 dark:fill-gray-500" />
        {/* Beam */}
        <line x1={leftCx - 60} y1={beamY} x2={rightCx + 60} y2={beamY} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="3" />
        {/* Stand */}
        <line x1={cx} y1={beamY} x2={cx} y2={200} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="2" />

        {/* Pans */}
        <line x1={leftCx} y1={beamY} x2={leftCx} y2={beamY + 20} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <rect x={leftCx - 55} y={beamY + 20} width={110} height={10} rx="2" className="fill-gray-300 dark:fill-gray-600" />
        <line x1={rightCx} y1={beamY} x2={rightCx} y2={beamY + 20} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <rect x={rightCx - 55} y={beamY + 20} width={110} height={10} rx="2" className="fill-gray-300 dark:fill-gray-600" />

        {/* Blocks */}
        {renderBlocks(leftCx, beamY + 20, cur.left.xCount, cur.left.ones)}
        {renderBlocks(rightCx, beamY + 20, cur.right.xCount, cur.right.ones)}

        {/* Label */}
        <text x="200" y="248" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="600">{cur.label}</text>

        {/* Hint */}
        {cur.hint && <text x="200" y="55" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11">{cur.hint}</text>}

        {/* = sign */}
        <text x="200" y={beamY + 35} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="18" fontWeight="bold">=</text>
      </svg>

      <div className="flex justify-center gap-2 mt-2">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            Step {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
