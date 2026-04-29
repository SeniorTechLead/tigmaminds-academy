'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * Geometric distribution visualization with a bus stop metaphor.
 * Shows people waiting, trials ticking by, and the bus arriving on trial k.
 * Adjustable probability p, with PMF bar chart and simulation.
 */

const P_VALUES = [0.1, 0.2, 0.3, 0.5];

function geomPMF(k: number, p: number): number {
  return Math.pow(1 - p, k - 1) * p;
}

export default function GeometricDistDiagram() {
  const [p, setP] = useState(0.1);
  const [simulating, setSimulating] = useState(false);
  const [trial, setTrial] = useState(0);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meanWait = 1 / p;
  const maxK = Math.min(Math.ceil(3 / p), 30);

  // Simulation
  useEffect(() => {
    if (!simulating || success) return;
    timerRef.current = setTimeout(() => {
      const hit = Math.random() < p;
      setHistory(prev => [...prev, hit]);
      setTrial(t => t + 1);
      if (hit) setSuccess(true);
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [simulating, trial, success, p]);

  const reset = () => {
    setSimulating(false);
    setTrial(0);
    setSuccess(false);
    setHistory([]);
  };

  const W = 460, H = 280;
  const mx = 30, mr = 20;

  // PMF bar chart area
  const chartY = 130, chartH = 100;
  const barW = Math.min(20, (W - mx - mr - 10) / maxK);

  const sx = (k: number) => mx + (k - 0.5) * barW;

  // Max PMF for scaling
  const maxPMF = p; // PMF is highest at k=1

  return (
    <div className="space-y-2">
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">P(bus each minute):</span>
        {P_VALUES.map(pv => (
          <button key={pv} onClick={() => { setP(pv); reset(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${p === pv ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {(pv * 100).toFixed(0)}%
          </button>
        ))}
        <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button onClick={() => { reset(); setTimeout(() => setSimulating(true), 50); }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors">
          {simulating ? 'Restart' : 'Simulate'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Bus stop scene */}
        <text x={mx} y={16} fontSize="9" fill="#6b7280" fontWeight="600">Bus Stop — waiting for the bus (p = {(p * 100).toFixed(0)}% each minute)</text>

        {/* Timeline of trials */}
        <line x1={mx} y1={50} x2={W - mr} y2={50} stroke="#d1d5db" strokeWidth="1" />

        {/* Trial circles */}
        {history.map((hit, i) => {
          const cx = mx + 15 + i * Math.min(22, (W - mx - mr - 30) / Math.max(history.length, 10));
          return (
            <g key={i}>
              <circle cx={cx} cy={50} r="8"
                fill={hit ? '#22c55e' : '#fee2e2'}
                stroke={hit ? '#16a34a' : '#fca5a5'}
                strokeWidth="1.5" />
              <text x={cx} y={53} fontSize="7" textAnchor="middle" fontWeight="700"
                fill={hit ? '#15803d' : '#dc2626'}>
                {hit ? '🚌' : '✗'}
              </text>
              <text x={cx} y={68} fontSize="7" fill="#9ca3af" textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}

        {/* Waiting people (before simulation or during) */}
        {!success && (
          <g>
            {[0, 1, 2].map(i => (
              <text key={i} x={W - mr - 50 + i * 18} y={50} fontSize="16" textAnchor="middle">🧑</text>
            ))}
            {simulating && <text x={W - mr - 50} y={68} fontSize="8" fill="#f59e0b" textAnchor="middle">Waiting...</text>}
          </g>
        )}

        {/* Success message */}
        {success && (
          <g>
            <text x={W - mr - 30} y={48} fontSize="14" textAnchor="middle">🚌</text>
            <text x={W - mr - 30} y={68} fontSize="9" fill="#22c55e" textAnchor="middle" fontWeight="700">
              Arrived at trial {trial}!
            </text>
          </g>
        )}

        {/* Probability formula */}
        <text x={mx} y={95} fontSize="9" fill="#6b7280">
          P(first success on trial k) = (1−{p})^(k−1) × {p}
        </text>
        <text x={mx} y={110} fontSize="9" fill="#3b82f6" fontWeight="600">
          Mean wait = 1/p = 1/{p} = {meanWait.toFixed(1)} trials
        </text>

        {/* PMF bar chart */}
        <line x1={mx} y1={chartY + chartH} x2={W - mr} y2={chartY + chartH} stroke="#d1d5db" strokeWidth="1" />

        {Array.from({ length: maxK }, (_, i) => i + 1).map(k => {
          const prob = geomPMF(k, p);
          const barH = (prob / maxPMF) * chartH * 0.9;
          const x = sx(k);
          const isHighlighted = success && k === trial;

          return (
            <g key={k}>
              <rect x={x - barW * 0.35} y={chartY + chartH - barH} width={barW * 0.7} height={barH}
                fill={isHighlighted ? '#22c55e' : '#3b82f6'}
                fillOpacity={isHighlighted ? 0.8 : 0.5}
                stroke={isHighlighted ? '#16a34a' : '#3b82f6'}
                strokeWidth={isHighlighted ? 2 : 0.5}
                rx="1" />
              {k <= 10 && (
                <text x={x} y={chartY + chartH + 12} fontSize="7" fill="#9ca3af" textAnchor="middle">{k}</text>
              )}
              {/* Show probability for first few */}
              {k <= 5 && (
                <text x={x} y={chartY + chartH - barH - 3} fontSize="7" fill="#3b82f6" textAnchor="middle">
                  {(prob * 100).toFixed(1)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Mean marker */}
        <line x1={sx(meanWait)} y1={chartY} x2={sx(meanWait)} y2={chartY + chartH} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x={sx(meanWait)} y={chartY - 4} fontSize="8" fill="#dc2626" textAnchor="middle" fontWeight="600">mean = {meanWait.toFixed(1)}</text>

        {/* X axis label */}
        <text x={(mx + W - mr) / 2} y={chartY + chartH + 24} fontSize="9" fill="#6b7280" textAnchor="middle">Trial number (k)</text>
      </svg>

      <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
        {!simulating && !success && `With p = ${(p * 100).toFixed(0)}%, you wait on average ${meanWait.toFixed(0)} minutes for the bus. The probability drops geometrically — each minute without a bus, it gets rarer to still be waiting that long.`}
        {simulating && !success && `Minute ${trial}... still waiting. Each minute has a ${(p * 100).toFixed(0)}% chance of the bus arriving.`}
        {success && `The bus arrived on minute ${trial}! The expected wait was ${meanWait.toFixed(0)} minutes. ${trial < meanWait ? 'Lucky — arrived early!' : trial > meanWait * 1.5 ? 'Unlucky — had to wait longer than average.' : 'Close to the expected wait time.'}`}
      </div>
    </div>
  );
}
