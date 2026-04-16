'use client';
import { useState } from 'react';

const AMINO_ACIDS = ['Lys', 'Met', 'Trp', 'Thr', 'Ile', 'Leu', 'Val', 'Phe'];

// Relative scores (0–100) for limiting amino acids
const RICE_PROFILE = [45, 90, 80, 85, 90, 95, 90, 95]; // low lysine
const DAL_PROFILE = [95, 40, 70, 85, 85, 90, 85, 90]; // low methionine
const COMBINED = RICE_PROFILE.map((r, i) => Math.min(100, Math.max(r, DAL_PROFILE[i])));

const PDCAAS_RICE = 0.52;
const PDCAAS_DAL = 0.57;
const PDCAAS_COMBINED = 0.86;

export default function ProteinComplementDiagram() {
  const [combined, setCombined] = useState(false);

  const W = 460, H = 340;
  const barW = 28;
  const gap = 4;
  const groupW = barW * 2 + gap;
  const mx = 55, mt = 50, mb = 70;
  const pw = W - mx - 20;
  const ph = H - mt - mb;
  const groupGap = (pw - AMINO_ACIDS.length * groupW) / (AMINO_ACIDS.length - 1 + 0.001);

  const toY = (v: number) => mt + ph - (v / 100) * ph;
  const groupX = (i: number) => mx + i * (groupW + groupGap);

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setCombined(!combined)}
          className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
            combined
              ? 'bg-purple-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          {combined ? '✓ Combined — gaps filled!' : 'Click to combine rice + dal'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Protein complementation: rice and dal amino acid profiles">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <text x={W / 2} y={20} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Protein Complementation: Rice + Dal
        </text>

        <text x={W / 2} y={36} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Essential amino acid profiles (% of ideal)
        </text>

        {/* Y axis */}
        <line x1={mx} y1={mt} x2={mx} y2={mt + ph} stroke="#94a3b8" strokeWidth="1" />
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={mx - 4} y1={toY(v)} x2={mx} y2={toY(v)} stroke="#94a3b8" strokeWidth="1" />
            <text x={mx - 8} y={toY(v) + 3} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="8">{v}</text>
            <line x1={mx} y1={toY(v)} x2={W - 20} y2={toY(v)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" className="dark:stroke-slate-700" />
          </g>
        ))}

        {/* "Ideal" line at 100 */}
        <line x1={mx} y1={toY(100)} x2={W - 20} y2={toY(100)} stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x={W - 18} y={toY(100) + 3} className="fill-green-600 dark:fill-green-400" fontSize="7">Ideal</text>

        {/* Bars */}
        {AMINO_ACIDS.map((aa, i) => {
          const gx = groupX(i);
          const riceVal = combined ? COMBINED[i] : RICE_PROFILE[i];
          const dalVal = combined ? COMBINED[i] : DAL_PROFILE[i];
          const isRiceGap = RICE_PROFILE[i] < 60;
          const isDalGap = DAL_PROFILE[i] < 60;

          return (
            <g key={aa}>
              {/* Rice bar */}
              <rect
                x={gx}
                y={toY(riceVal)}
                width={barW}
                height={toY(0) - toY(riceVal)}
                rx={3}
                fill={combined ? '#a855f7' : '#f59e0b'}
                opacity={isRiceGap && !combined ? 0.5 : 0.85}
                className="transition-all duration-500"
              />
              {isRiceGap && !combined && (
                <text x={gx + barW / 2} y={toY(riceVal) - 4} textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="700">GAP</text>
              )}

              {/* Dal bar */}
              {!combined && (
                <rect
                  x={gx + barW + gap}
                  y={toY(dalVal)}
                  width={barW}
                  height={toY(0) - toY(dalVal)}
                  rx={3}
                  fill="#22c55e"
                  opacity={isDalGap ? 0.5 : 0.85}
                />
              )}
              {isDalGap && !combined && (
                <text x={gx + barW + gap + barW / 2} y={toY(dalVal) - 4} textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="700">GAP</text>
              )}

              {/* AA label */}
              <text x={gx + (combined ? barW / 2 : groupW / 2)} y={toY(0) + 12} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontWeight="600">
                {aa}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x={mx} y={H - 55} width={10} height={10} rx={2} fill="#f59e0b" />
        <text x={mx + 14} y={H - 47} className="fill-gray-600 dark:fill-gray-300" fontSize="9">Rice (PDCAAS {PDCAAS_RICE})</text>

        <rect x={mx + 130} y={H - 55} width={10} height={10} rx={2} fill="#22c55e" />
        <text x={mx + 144} y={H - 47} className="fill-gray-600 dark:fill-gray-300" fontSize="9">Dal (PDCAAS {PDCAAS_DAL})</text>

        <rect x={mx + 260} y={H - 55} width={10} height={10} rx={2} fill="#a855f7" />
        <text x={mx + 274} y={H - 47} className="fill-gray-600 dark:fill-gray-300" fontSize="9">Combined (PDCAAS {PDCAAS_COMBINED})</text>

        <text x={W / 2} y={H - 10} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          {combined ? 'Together, rice and dal fill each other\'s amino acid gaps!' : 'Rice lacks lysine; dal lacks methionine — combine them!'}
        </text>
      </svg>
    </div>
  );
}
