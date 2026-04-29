'use client';
import { useState } from 'react';

interface Scenario {
  label: string;
  pA: number;
  pB: number;
  pAB: number;
}

const PRESETS: Scenario[] = [
  { label: 'Rain & Umbrella', pA: 0.3, pB: 0.4, pAB: 0.2 },
  { label: 'Smoke & Fire', pA: 0.1, pB: 0.05, pAB: 0.04 },
];

type ShowMode = 'P(A|B)' | 'P(B|A)' | 'P(A∩B)' | 'P(A∪B)';
const MODES: ShowMode[] = ['P(A|B)', 'P(B|A)', 'P(A∩B)', 'P(A∪B)'];

export default function ConditionalProbDiagram() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [custom, setCustom] = useState<Scenario>({ label: 'Custom', pA: 0.5, pB: 0.4, pAB: 0.2 });
  const [mode, setMode] = useState<ShowMode>('P(A|B)');

  const isCustom = scenarioIdx === 2;
  const scenario = isCustom ? custom : PRESETS[scenarioIdx];
  const { pA, pB, pAB } = scenario;

  // Derived values
  const pAGivenB = pB > 0 ? pAB / pB : 0;
  const pBGivenA = pA > 0 ? pAB / pA : 0;
  const pAUnionB = pA + pB - pAB;

  const computedValue =
    mode === 'P(A|B)' ? pAGivenB :
    mode === 'P(B|A)' ? pBGivenA :
    mode === 'P(A∩B)' ? pAB :
    pAUnionB;

  const formulaText =
    mode === 'P(A|B)' ? `P(A|B) = P(A∩B)/P(B) = ${pAB.toFixed(2)}/${pB.toFixed(2)} = ${pAGivenB.toFixed(3)}` :
    mode === 'P(B|A)' ? `P(B|A) = P(A∩B)/P(A) = ${pAB.toFixed(2)}/${pA.toFixed(2)} = ${pBGivenA.toFixed(3)}` :
    mode === 'P(A∩B)' ? `P(A∩B) = ${pAB.toFixed(3)}` :
    `P(A∪B) = P(A)+P(B)-P(A∩B) = ${pA.toFixed(2)}+${pB.toFixed(2)}-${pAB.toFixed(2)} = ${pAUnionB.toFixed(3)}`;

  const svgW = 400;
  const svgH = 260;

  // Circle sizing proportional to probability (radius ~ sqrt for area)
  const maxR = 70;
  const rA = Math.max(20, maxR * Math.sqrt(pA));
  const rB = Math.max(20, maxR * Math.sqrt(pB));

  // Position circles so they overlap proportionally to pAB
  const cxA = svgW / 2 - 30;
  const cxB = svgW / 2 + 30;
  const cyA = svgH / 2 + 10;
  const cyB = svgH / 2 + 10;

  // Determine opacity for each region based on mode
  // A-only, B-only, A∩B
  const dimOpacity = 0.12;
  const brightOpacity = 0.55;

  let opacityAOnly = brightOpacity;
  let opacityBOnly = brightOpacity;
  let opacityAB = brightOpacity;

  if (mode === 'P(A|B)') {
    // Show B circle, highlight A∩B within it; dim A-only
    opacityAOnly = dimOpacity;
    opacityBOnly = 0.3;
    opacityAB = 0.8;
  } else if (mode === 'P(B|A)') {
    // Show A circle, highlight A∩B within it; dim B-only
    opacityBOnly = dimOpacity;
    opacityAOnly = 0.3;
    opacityAB = 0.8;
  } else if (mode === 'P(A∩B)') {
    opacityAOnly = dimOpacity;
    opacityBOnly = dimOpacity;
    opacityAB = 0.8;
  } else {
    // P(A∪B) — show everything
    opacityAOnly = brightOpacity;
    opacityBOnly = brightOpacity;
    opacityAB = brightOpacity;
  }

  const clampSlider = (field: 'pA' | 'pB' | 'pAB', val: number) => {
    const next = { ...custom, [field]: val };
    // Ensure pAB <= min(pA, pB)
    if (next.pAB > Math.min(next.pA, next.pB)) {
      next.pAB = Math.min(next.pA, next.pB);
    }
    setCustom(next);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Scenario selector */}
      <div className="flex justify-center gap-2 mb-1 flex-wrap">
        {[...PRESETS.map((p) => p.label), 'Custom'].map((label, i) => (
          <button
            key={i}
            onClick={() => setScenarioIdx(i)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              i === scenarioIdx
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Custom sliders */}
      {isCustom && (
        <div className="flex gap-4 justify-center mb-2 text-xs text-gray-600 dark:text-gray-300">
          <label className="flex flex-col items-center">
            P(A)={custom.pA.toFixed(2)}
            <input type="range" min="0.01" max="0.99" step="0.01" value={custom.pA} onChange={(e) => clampSlider('pA', +e.target.value)} className="w-20" />
          </label>
          <label className="flex flex-col items-center">
            P(B)={custom.pB.toFixed(2)}
            <input type="range" min="0.01" max="0.99" step="0.01" value={custom.pB} onChange={(e) => clampSlider('pB', +e.target.value)} className="w-20" />
          </label>
          <label className="flex flex-col items-center">
            P(A∩B)={custom.pAB.toFixed(2)}
            <input type="range" min="0" max={Math.min(custom.pA, custom.pB).toFixed(2)} step="0.01" value={custom.pAB} onChange={(e) => clampSlider('pAB', +e.target.value)} className="w-20" />
          </label>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-2 flex-wrap">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              m === mode
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Conditional probability Venn diagram">
        <rect width={svgW} height={svgH} className="fill-white dark:fill-slate-950" rx="8" />
        <text x={svgW / 2} y={18} textAnchor="middle" className="fill-gray-900 dark:fill-slate-50" fontSize="13" fontWeight="bold">
          Conditional Probability
        </text>

        {/* Sample space rectangle */}
        <rect x={30} y={30} width={svgW - 60} height={svgH - 60} rx="6" fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4 2" />
        <text x={38} y={44} className="fill-gray-400 dark:fill-gray-500" fontSize="8">S</text>

        {/* Use clip paths for the intersection highlighting */}
        <defs>
          <clipPath id="clipA">
            <circle cx={cxA} cy={cyA} r={rA} />
          </clipPath>
          <clipPath id="clipB">
            <circle cx={cxB} cy={cyB} r={rB} />
          </clipPath>
        </defs>

        {/* Circle A (full) */}
        <circle cx={cxA} cy={cyA} r={rA} fill="#3b82f6" opacity={opacityAOnly} />
        {/* Circle B (full) */}
        <circle cx={cxB} cy={cyB} r={rB} fill="#f59e0b" opacity={opacityBOnly} />

        {/* Intersection: draw circle B clipped to A */}
        <circle cx={cxB} cy={cyB} r={rB} fill="#ef4444" opacity={opacityAB} clipPath="url(#clipA)" />

        {/* Circle outlines */}
        <circle cx={cxA} cy={cyA} r={rA} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx={cxB} cy={cyB} r={rB} fill="none" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Labels */}
        <text x={cxA - rA / 2 - 8} y={cyA - 4} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="12" fontWeight="bold">A</text>
        <text x={cxA - rA / 2 - 8} y={cyA + 10} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="8">{pA.toFixed(2)}</text>

        <text x={cxB + rB / 2 + 8} y={cyB - 4} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="bold">B</text>
        <text x={cxB + rB / 2 + 8} y={cyB + 10} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="8">{pB.toFixed(2)}</text>

        {/* Intersection label */}
        <text x={(cxA + cxB) / 2} y={cyA - 2} textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="9" fontWeight="bold">A∩B</text>
        <text x={(cxA + cxB) / 2} y={cyA + 10} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="8">{pAB.toFixed(2)}</text>

        {/* Formula box */}
        <rect x={20} y={svgH - 54} width={svgW - 40} height={40} rx="5" className="fill-indigo-50 dark:fill-indigo-900/40 stroke-indigo-300 dark:stroke-indigo-600" strokeWidth="1" />
        <text x={svgW / 2} y={svgH - 34} textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="10" fontWeight="bold">
          {formulaText}
        </text>
        {/* Bayes' theorem for conditional modes */}
        {(mode === 'P(A|B)' || mode === 'P(B|A)') && (
          <text x={svgW / 2} y={svgH - 20} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="8">
            Bayes: P(A|B) = P(B|A)·P(A)/P(B) = {pBGivenA.toFixed(3)}·{pA.toFixed(2)}/{pB.toFixed(2)} = {pAGivenB.toFixed(3)}
          </text>
        )}
      </svg>

      {/* Description */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center space-y-1">
        <p>
          <span className="font-semibold">{mode} = {computedValue.toFixed(3)}</span>
          {mode === 'P(A|B)' && ' — probability of A given that B has occurred'}
          {mode === 'P(B|A)' && ' — probability of B given that A has occurred'}
          {mode === 'P(A∩B)' && ' — probability that both A and B occur'}
          {mode === 'P(A∪B)' && ' — probability that at least one of A or B occurs'}
        </p>
        {(mode === 'P(A|B)' || mode === 'P(B|A)') && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            The dimmed regions are excluded — we condition on the highlighted circle
          </p>
        )}
      </div>
    </div>
  );
}
