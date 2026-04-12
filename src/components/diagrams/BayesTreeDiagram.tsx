'use client';
import { useState } from 'react';

/**
 * Bayes' Theorem Medical Test — probability tree with natural frequencies.
 * Population = 1000. Toggle between Round 1 (prior 0.1%) and Round 2 (prior 9%).
 */

interface RoundData {
  label: string;
  prior: number;
  population: number;
  diseaseCount: number;
  noDisease: number;
  truePos: number;
  falseNeg: number;
  falsePos: number;
  trueNeg: number;
  totalPos: number;
  posterior: number;
}

function computeRound(prior: number): RoundData {
  const population = 1000;
  const diseaseCount = population * prior;
  const noDisease = population - diseaseCount;
  const sensitivity = 0.99;
  const falsePositiveRate = 0.01;
  const truePos = diseaseCount * sensitivity;
  const falseNeg = diseaseCount * (1 - sensitivity);
  const falsePos = noDisease * falsePositiveRate;
  const trueNeg = noDisease * (1 - falsePositiveRate);
  const totalPos = truePos + falsePos;
  const posterior = truePos / totalPos;
  return {
    label: `Prior: ${(prior * 100).toFixed(1)}%`,
    prior, population, diseaseCount, noDisease,
    truePos, falseNeg, falsePos, trueNeg,
    totalPos, posterior,
  };
}

const ROUND1 = computeRound(0.001);
const ROUND2 = computeRound(0.09);

export default function BayesTreeDiagram() {
  const [round, setRound] = useState<1 | 2>(1);
  const [highlighted, setHighlighted] = useState(false);
  const data = round === 1 ? ROUND1 : ROUND2;

  const W = 460, H = 280;
  const fmt = (n: number) => n < 1 ? n.toFixed(2) : n < 10 ? n.toFixed(1) : Math.round(n).toString();

  // Tree layout positions
  const rootX = 40, rootY = 60;
  const level1X = 160;
  const diseaseY = 40, noDiseaseY = 150;
  const level2X = 310;
  const tpY = 25, fnY = 60;
  const fpY = 130, tnY = 170;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex gap-2 mb-2 justify-center">
        <button
          onClick={() => { setRound(1); setHighlighted(false); }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            round === 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Round 1 (prior 0.1%)
        </button>
        <button
          onClick={() => { setRound(2); setHighlighted(false); }}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            round === 2 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Round 2 (prior 9%)
        </button>
        <button
          onClick={() => setHighlighted(h => !h)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            highlighted ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {highlighted ? 'Hide' : 'Show'} Positives
        </button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bayes theorem probability tree diagram"
      >
        <rect width={W} height={H} rx="8" className="fill-slate-900" />

        {/* Root node */}
        <circle cx={rootX} cy={rootY + 40} r="16" fill="#1e40af" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={rootX} y={rootY + 44} textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">1000</text>

        {/* Branch to Disease */}
        <line x1={rootX + 16} y1={rootY + 30} x2={level1X - 20} y2={diseaseY} stroke="#ef4444" strokeWidth="1.5" />
        <text x={(rootX + level1X) / 2 - 10} y={diseaseY - 5} fill="#ef4444" fontSize="8" fontFamily="system-ui, sans-serif">
          {(data.prior * 100).toFixed(1)}%
        </text>

        {/* Branch to No Disease */}
        <line x1={rootX + 16} y1={rootY + 50} x2={level1X - 20} y2={noDiseaseY} stroke="#22c55e" strokeWidth="1.5" />
        <text x={(rootX + level1X) / 2 - 10} y={noDiseaseY + 15} fill="#22c55e" fontSize="8" fontFamily="system-ui, sans-serif">
          {((1 - data.prior) * 100).toFixed(1)}%
        </text>

        {/* Disease node */}
        <rect x={level1X - 20} y={diseaseY - 12} width="50" height="24" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
        <text x={level1X + 5} y={diseaseY - 1} textAnchor="middle" fill="#fca5a5" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">Disease</text>
        <text x={level1X + 5} y={diseaseY + 9} textAnchor="middle" fill="#fca5a5" fontSize="7" fontFamily="system-ui, sans-serif">{fmt(data.diseaseCount)}</text>

        {/* No Disease node */}
        <rect x={level1X - 20} y={noDiseaseY - 12} width="50" height="24" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
        <text x={level1X + 5} y={noDiseaseY - 1} textAnchor="middle" fill="#86efac" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">Healthy</text>
        <text x={level1X + 5} y={noDiseaseY + 9} textAnchor="middle" fill="#86efac" fontSize="7" fontFamily="system-ui, sans-serif">{fmt(data.noDisease)}</text>

        {/* Disease → True Positive */}
        <line x1={level1X + 30} y1={diseaseY - 5} x2={level2X - 25} y2={tpY} stroke={highlighted ? '#f59e0b' : '#94a3b8'} strokeWidth={highlighted ? 2 : 1} />
        <text x={(level1X + level2X) / 2 + 5} y={tpY - 3} fill="#94a3b8" fontSize="7" fontFamily="system-ui, sans-serif">99%</text>

        {/* Disease → False Negative */}
        <line x1={level1X + 30} y1={diseaseY + 5} x2={level2X - 25} y2={fnY} stroke="#475569" strokeWidth="1" />
        <text x={(level1X + level2X) / 2 + 5} y={fnY + 10} fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">1%</text>

        {/* No Disease → False Positive */}
        <line x1={level1X + 30} y1={noDiseaseY - 5} x2={level2X - 25} y2={fpY} stroke={highlighted ? '#f59e0b' : '#94a3b8'} strokeWidth={highlighted ? 2 : 1} />
        <text x={(level1X + level2X) / 2 + 5} y={fpY - 3} fill="#94a3b8" fontSize="7" fontFamily="system-ui, sans-serif">1%</text>

        {/* No Disease → True Negative */}
        <line x1={level1X + 30} y1={noDiseaseY + 5} x2={level2X - 25} y2={tnY} stroke="#475569" strokeWidth="1" />
        <text x={(level1X + level2X) / 2 + 5} y={tnY + 10} fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">99%</text>

        {/* Leaf: True Positive */}
        <rect x={level2X - 25} y={tpY - 10} width="60" height="20" rx="3"
          fill={highlighted ? '#78350f' : '#1e293b'} stroke={highlighted ? '#f59e0b' : '#475569'} strokeWidth="1" />
        <text x={level2X + 5} y={tpY + 1} textAnchor="middle" fill={highlighted ? '#fbbf24' : '#94a3b8'} fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
          TP: {fmt(data.truePos)}
        </text>

        {/* Leaf: False Negative */}
        <rect x={level2X - 25} y={fnY - 10} width="60" height="20" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x={level2X + 5} y={fnY + 1} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">
          FN: {fmt(data.falseNeg)}
        </text>

        {/* Leaf: False Positive */}
        <rect x={level2X - 25} y={fpY - 10} width="60" height="20" rx="3"
          fill={highlighted ? '#78350f' : '#1e293b'} stroke={highlighted ? '#f59e0b' : '#475569'} strokeWidth="1" />
        <text x={level2X + 5} y={fpY + 1} textAnchor="middle" fill={highlighted ? '#fbbf24' : '#94a3b8'} fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
          FP: {fmt(data.falsePos)}
        </text>

        {/* Leaf: True Negative */}
        <rect x={level2X - 25} y={tnY - 10} width="60" height="20" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        <text x={level2X + 5} y={tnY + 1} textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="system-ui, sans-serif">
          TN: {fmt(data.trueNeg)}
        </text>

        {/* Highlighted summary */}
        {highlighted && (
          <>
            {/* Summary box */}
            <rect x={level2X + 50} y={60} width="100" height="80" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x={level2X + 100} y={77} textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
              All Test Positive
            </text>
            <text x={level2X + 100} y={92} textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="system-ui, sans-serif">
              TP: {fmt(data.truePos)} + FP: {fmt(data.falsePos)}
            </text>
            <text x={level2X + 100} y={105} textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">
              Total: {fmt(data.totalPos)}
            </text>
            <line x1={level2X + 60} y1={112} x2={level2X + 140} y2={112} stroke="#475569" strokeWidth="0.5" />
            <text x={level2X + 100} y={124} textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
              P(disease|+) = {fmt(data.truePos)}/{fmt(data.totalPos)}
            </text>
            <text x={level2X + 100} y={136} textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
              = {(data.posterior * 100).toFixed(1)}%
            </text>
          </>
        )}

        {/* Bottom description */}
        <text x={W / 2} y={H - 38} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">
          {round === 1
            ? 'With a rare disease (0.1%), most positives are false alarms.'
            : 'After one positive test (prior now 9%), a second positive is much stronger.'}
        </text>
        <text x={W / 2} y={H - 24} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif">
          Natural frequencies: out of {data.population} people, {fmt(data.diseaseCount)} have the disease.
        </text>
        <text x={W / 2} y={H - 10} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="system-ui, sans-serif">
          Sensitivity = 99%, False positive rate = 1%.
        </text>
      </svg>
    </div>
  );
}
