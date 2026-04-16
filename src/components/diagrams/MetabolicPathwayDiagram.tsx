'use client';
import { useState } from 'react';

type Pathway = 'carbs' | 'fats' | 'proteins' | 'all';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  atp?: string;
  pathways: Pathway[];
  color: string;
}

interface Arrow {
  from: string;
  to: string;
  label?: string;
  pathways: Pathway[];
}

const NODES: Node[] = [
  { id: 'carbs', label: 'Carbohydrates', x: 80, y: 30, pathways: ['carbs'], color: '#f59e0b' },
  { id: 'glucose', label: 'Glucose', x: 80, y: 70, atp: '', pathways: ['carbs'], color: '#f59e0b' },
  { id: 'pyruvate', label: 'Pyruvate', x: 80, y: 115, atp: '2 ATP', pathways: ['carbs'], color: '#f59e0b' },
  { id: 'fats', label: 'Fats', x: 320, y: 30, pathways: ['fats'], color: '#22c55e' },
  { id: 'fattyacids', label: 'Fatty acids\n+ Glycerol', x: 320, y: 70, pathways: ['fats'], color: '#22c55e' },
  { id: 'betaox', label: 'β-oxidation', x: 320, y: 115, atp: '', pathways: ['fats'], color: '#22c55e' },
  { id: 'proteins', label: 'Proteins', x: 400, y: 155, pathways: ['proteins'], color: '#ef4444' },
  { id: 'aminoacids', label: 'Amino acids', x: 400, y: 195, pathways: ['proteins'], color: '#ef4444' },
  { id: 'acetylcoa', label: 'Acetyl-CoA', x: 200, y: 160, atp: '', pathways: ['carbs', 'fats', 'proteins'], color: '#8b5cf6' },
  { id: 'krebs', label: 'Krebs Cycle', x: 200, y: 210, atp: '2 ATP', pathways: ['carbs', 'fats', 'proteins'], color: '#8b5cf6' },
  { id: 'etc', label: 'Electron Transport\nChain', x: 200, y: 260, atp: '~34 ATP', pathways: ['carbs', 'fats', 'proteins'], color: '#8b5cf6' },
];

const ARROWS: Arrow[] = [
  { from: 'carbs', to: 'glucose', pathways: ['carbs'] },
  { from: 'glucose', to: 'pyruvate', label: 'Glycolysis', pathways: ['carbs'] },
  { from: 'pyruvate', to: 'acetylcoa', pathways: ['carbs'] },
  { from: 'fats', to: 'fattyacids', pathways: ['fats'] },
  { from: 'fattyacids', to: 'betaox', pathways: ['fats'] },
  { from: 'betaox', to: 'acetylcoa', pathways: ['fats'] },
  { from: 'proteins', to: 'aminoacids', pathways: ['proteins'] },
  { from: 'aminoacids', to: 'acetylcoa', label: '(various\nentry points)', pathways: ['proteins'] },
  { from: 'acetylcoa', to: 'krebs', pathways: ['carbs', 'fats', 'proteins'] },
  { from: 'krebs', to: 'etc', label: 'NADH, FADH₂', pathways: ['carbs', 'fats', 'proteins'] },
];

const PATHWAY_BTNS: { key: Pathway; label: string; color: string }[] = [
  { key: 'all', label: 'All pathways', color: 'bg-purple-600' },
  { key: 'carbs', label: 'Carbohydrates', color: 'bg-amber-500' },
  { key: 'fats', label: 'Fats', color: 'bg-green-600' },
  { key: 'proteins', label: 'Proteins', color: 'bg-red-500' },
];

export default function MetabolicPathwayDiagram() {
  const [active, setActive] = useState<Pathway>('all');

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  function isVisible(pathways: Pathway[]) {
    return active === 'all' || pathways.includes(active);
  }

  const W = 460, H = 310;

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <div className="flex flex-wrap gap-1 mb-2 justify-center">
        {PATHWAY_BTNS.map((b) => (
          <button
            key={b.key}
            onClick={() => setActive(b.key)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              active === b.key
                ? `${b.color} text-white`
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Metabolic pathway diagram showing ATP production">
        <rect width={W} height={H} rx="8" className="fill-white dark:fill-slate-900" />

        <defs>
          <marker id="mp-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Arrows */}
        {ARROWS.map((a, i) => {
          const from = nodeMap[a.from];
          const to = nodeMap[a.to];
          if (!from || !to) return null;
          const vis = isVisible(a.pathways);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={i} opacity={vis ? 1 : 0.15} className="transition-opacity duration-300">
              <line
                x1={from.x} y1={from.y + 12} x2={to.x} y2={to.y - 12}
                stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#mp-arrow)"
              />
              {a.label && (
                <text x={midX + 8} y={midY} className="fill-gray-500 dark:fill-gray-400" fontSize="7">
                  {a.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const vis = isVisible(n.pathways);
          const lines = n.label.split('\n');
          return (
            <g key={n.id} opacity={vis ? 1 : 0.15} className="transition-opacity duration-300">
              <rect
                x={n.x - 45} y={n.y - 12} width={90} height={lines.length * 12 + 8}
                rx={6} fill={n.color} opacity={0.15}
                stroke={n.color} strokeWidth="1.5"
              />
              {lines.map((line, li) => (
                <text key={li} x={n.x} y={n.y + li * 12} textAnchor="middle" fill={n.color} fontSize="9" fontWeight="600">
                  {line}
                </text>
              ))}
              {n.atp && (
                <text x={n.x + 48} y={n.y + 2} className="fill-yellow-600 dark:fill-yellow-400" fontSize="8" fontWeight="700">
                  {n.atp}
                </text>
              )}
            </g>
          );
        })}

        {/* Total ATP summary */}
        <rect x={15} y={H - 35} width={W - 30} height={28} rx={6} className="fill-purple-50 dark:fill-purple-900/30" stroke="#8b5cf6" strokeWidth="1" />
        <text x={W / 2} y={H - 16} textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="700">
          Total: 1 glucose → ~38 ATP | 1 fatty acid (C16) → ~129 ATP
        </text>
      </svg>
    </div>
  );
}
