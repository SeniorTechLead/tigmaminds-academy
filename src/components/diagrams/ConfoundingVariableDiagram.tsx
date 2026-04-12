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
  const W = 380, H = 200;

  // Positions for the 3 nodes
  const aX = 70, aY = 140;
  const bX = 310, bY = 140;
  const cX = 190, cY = 45;

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

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
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
        <line x1={aX + 45} y1={aY} x2={bX - 45} y2={bY} stroke={reveal ? '#d1d5db' : '#ef4444'} strokeWidth="2" strokeDasharray={reveal ? '4,4' : undefined} markerEnd={reveal ? undefined : 'url(#arrR)'} />
        {!reveal && (
          <text x={(aX + bX) / 2} y={aY + 18} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="600">{s.correlation} — but why?</text>
        )}
        {reveal && (
          <>
            {/* X mark on the spurious arrow */}
            <text x={(aX + bX) / 2} y={aY - 5} fontSize="18" fill="#ef4444" textAnchor="middle" fontWeight="900">✗</text>
            <text x={(aX + bX) / 2} y={aY + 18} fontSize="9" fill="#9ca3af" textAnchor="middle">NOT causation</text>
          </>
        )}

        {/* Confounding variable (revealed) */}
        {reveal && (
          <>
            {/* Confounder node */}
            <rect x={cX - 60} y={cY - 22} width={120} height={44} rx="10" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2" />
            <text x={cX} y={cY - 4} fontSize="18" textAnchor="middle">{s.emojiC}</text>
            <text x={cX} y={cY + 14} fontSize="10" fill="#f59e0b" textAnchor="middle" fontWeight="700">{s.confounder}</text>

            {/* Arrows from confounder to A and B */}
            <line x1={cX - 40} y1={cY + 16} x2={aX + 20} y2={aY - 18} stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrG)" />
            <line x1={cX + 40} y1={cY + 16} x2={bX - 20} y2={bY - 18} stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrG)" />

            <text x={cX - 55} y={(cY + aY) / 2 + 5} fontSize="8" fill="#22c55e" textAnchor="middle" fontWeight="600">causes ↑</text>
            <text x={cX + 55} y={(cY + bY) / 2 + 5} fontSize="8" fill="#22c55e" textAnchor="middle" fontWeight="600">causes ↑</text>
          </>
        )}

        {/* Variable A node */}
        <rect x={aX - 50} y={aY - 20} width={100} height={40} rx="10" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={aX} y={aY - 4} fontSize="16" textAnchor="middle">{s.emojiA}</text>
        <text x={aX} y={aY + 14} fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="600">{s.varA}</text>

        {/* Variable B node */}
        <rect x={bX - 50} y={bY - 20} width={100} height={40} rx="10" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={bX} y={bY - 4} fontSize="16" textAnchor="middle">{s.emojiB}</text>
        <text x={bX} y={bY + 14} fontSize="8" fill="#3b82f6" textAnchor="middle" fontWeight="600">{s.varB}</text>
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
