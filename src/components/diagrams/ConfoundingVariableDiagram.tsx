'use client';
import { useState } from 'react';

/**
 * Visualizes "correlation ≠ causation" with confounding variables.
 * Shows the spurious correlation and reveals the hidden third variable.
 */

type Scenario = 'icecream' | 'shoes' | 'firefighters';

const SCENARIOS: Record<Scenario, {
  label: string;
  varA: string; varB: string; confounder: string;
  emojiA: string; emojiB: string; emojiC: string;
  correlation: string;
  explanation: string;
}> = {
  icecream: {
    label: '🍦 Ice cream & drowning',
    varA: 'Ice cream sales', varB: 'Drowning deaths', confounder: 'Summer heat',
    emojiA: '🍦', emojiB: '🏊‍♂️', emojiC: '☀️',
    correlation: 'r ≈ +0.8',
    explanation: 'Ice cream doesn\'t cause drowning! Both rise in summer — more people swim AND buy ice cream when it\'s hot. The sun is the real culprit.',
  },
  shoes: {
    label: '👟 Shoe size & reading',
    varA: 'Shoe size', varB: 'Reading ability', confounder: 'Age',
    emojiA: '👟', emojiB: '📚', emojiC: '👶→🧑',
    correlation: 'r ≈ +0.7',
    explanation: 'Wearing bigger shoes won\'t make you read faster! Older children have both bigger feet AND better reading skills. Age is what actually drives both.',
  },
  firefighters: {
    label: '🚒 Firefighters & damage',
    varA: 'Firefighters sent', varB: 'Fire damage ($)', confounder: 'Fire severity',
    emojiA: '🚒', emojiB: '💰', emojiC: '🔥',
    correlation: 'r ≈ +0.9',
    explanation: 'Sending fewer firefighters won\'t reduce damage — that\'s backwards! Bigger fires attract more firefighters AND cause more damage. The fire\'s size drives both numbers.',
  },
};

export default function ConfoundingVariableDiagram() {
  const [scenario, setScenario] = useState<Scenario>('icecream');
  const [reveal, setReveal] = useState(false);

  const s = SCENARIOS[scenario];
  const W = 560, H = 280;

  // Positions for the 3 nodes
  const aX = 110, aY = 200;
  const bX = 450, bY = 200;
  const cX = 280, cY = 70;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SCENARIOS) as Scenario[]).map(k => (
          <button key={k} onClick={() => { setScenario(k); setReveal(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${scenario === k ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {SCENARIOS[k].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Arrow markers */}
        <defs>
          <marker id="arrG" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#22c55e" />
          </marker>
          <marker id="arrR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#ef4444" />
          </marker>
        </defs>

        {/* Spurious correlation arrow A → B (always shown, crossed out when revealed) */}
        <line x1={aX + 70} y1={aY} x2={bX - 70} y2={bY} stroke={reveal ? '#d1d5db' : '#ef4444'} strokeWidth="2.5" strokeDasharray={reveal ? '6,5' : undefined} markerEnd={reveal ? undefined : 'url(#arrR)'} />
        {!reveal && (
          <text x={(aX + bX) / 2} y={aY + 24} fontSize="14" fill="#ef4444" textAnchor="middle" fontWeight="700">{s.correlation} — but why?</text>
        )}
        {reveal && (
          <>
            {/* X mark on the spurious arrow */}
            <text x={(aX + bX) / 2} y={aY - 6} fontSize="24" fill="#ef4444" textAnchor="middle" fontWeight="900">✗</text>
            <text x={(aX + bX) / 2} y={aY + 24} fontSize="13" fill="#9ca3af" textAnchor="middle" fontWeight="600">NOT causation</text>
          </>
        )}

        {/* Confounding variable (revealed) */}
        {reveal && (
          <>
            {/* Confounder node */}
            <rect x={cX - 90} y={cY - 30} width={180} height={60} rx="12" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2" />
            <text x={cX} y={cY - 4} fontSize="22" textAnchor="middle">{s.emojiC}</text>
            <text x={cX} y={cY + 18} fontSize="13" fill="#f59e0b" textAnchor="middle" fontWeight="700">{s.confounder}</text>

            {/* Arrows from confounder to A and B */}
            <line x1={cX - 60} y1={cY + 24} x2={aX + 30} y2={aY - 26} stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#arrG)" />
            <line x1={cX + 60} y1={cY + 24} x2={bX - 30} y2={bY - 26} stroke="#22c55e" strokeWidth="2.5" markerEnd="url(#arrG)" />

            <text x={cX - 80} y={(cY + aY) / 2 + 5} fontSize="11" fill="#22c55e" textAnchor="middle" fontWeight="700">causes ↑</text>
            <text x={cX + 80} y={(cY + bY) / 2 + 5} fontSize="11" fill="#22c55e" textAnchor="middle" fontWeight="700">causes ↑</text>
          </>
        )}

        {/* Variable A node */}
        <rect x={aX - 75} y={aY - 30} width={150} height={60} rx="12" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={aX} y={aY - 6} fontSize="22" textAnchor="middle">{s.emojiA}</text>
        <text x={aX} y={aY + 18} fontSize="12" fill="#3b82f6" textAnchor="middle" fontWeight="700">{s.varA}</text>

        {/* Variable B node */}
        <rect x={bX - 75} y={bY - 30} width={150} height={60} rx="12" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={bX} y={bY - 6} fontSize="22" textAnchor="middle">{s.emojiB}</text>
        <text x={bX} y={bY + 18} fontSize="12" fill="#3b82f6" textAnchor="middle" fontWeight="700">{s.varB}</text>
      </svg>

      <button onClick={() => setReveal(!reveal)}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${reveal ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
        {reveal ? 'Hide confounding variable' : 'Reveal: why are they correlated?'}
      </button>

      {reveal && (
        <div className="text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5 border border-amber-200 dark:border-amber-800">
          {s.explanation}
        </div>
      )}

      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">These are classic statistics textbook examples used to teach the difference between correlation and causation.</p>
    </div>
  );
}
