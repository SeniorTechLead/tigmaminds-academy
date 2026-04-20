import { useState } from 'react';

// ── Drawing Cards — Tree of Outcomes ──────────────────────────
// Interactive two-draw tree. Choose a deck composition (6 red / 4
// blue by default, adjustable). Toggle between "with replacement"
// (independent) and "without replacement" (dependent). Watch the
// second-level probabilities change. Click a leaf to see its
// path probability computed.

type DrawMode = 'with' | 'without';

export default function TreeDiagramProbability() {
  const [red, setRed] = useState(6);
  const [blue, setBlue] = useState(4);
  const [mode, setMode] = useState<DrawMode>('without');
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);

  const total = red + blue;
  const pR1 = red / total;
  const pB1 = blue / total;

  // Conditional probabilities for second draw
  const pR_givenR = mode === 'with' ? red / total : (red - 1) / (total - 1);
  const pB_givenR = mode === 'with' ? blue / total : blue / (total - 1);
  const pR_givenB = mode === 'with' ? red / total : red / (total - 1);
  const pB_givenB = mode === 'with' ? blue / total : (blue - 1) / (total - 1);

  const leaves = [
    { id: 'RR', label: 'Red, Red', p: pR1 * pR_givenR, chain: `${red}/${total} × ${mode === 'with' ? red : red - 1}/${mode === 'with' ? total : total - 1}`, color: '#dc2626' },
    { id: 'RB', label: 'Red, Blue', p: pR1 * pB_givenR, chain: `${red}/${total} × ${blue}/${mode === 'with' ? total : total - 1}`, color: '#a855f7' },
    { id: 'BR', label: 'Blue, Red', p: pB1 * pR_givenB, chain: `${blue}/${total} × ${red}/${mode === 'with' ? total : total - 1}`, color: '#a855f7' },
    { id: 'BB', label: 'Blue, Blue', p: pB1 * pB_givenB, chain: `${blue}/${total} × ${mode === 'with' ? blue : blue - 1}/${mode === 'with' ? total : total - 1}`, color: '#2563eb' },
  ];

  const W = 560, H = 320;
  const rootX = 40, rootY = H / 2;
  const level1X = 220;
  const level2X = 420;

  const nodeR1 = { x: level1X, y: 90 };
  const nodeB1 = { x: level1X, y: 230 };
  const nodeRR = { x: level2X, y: 50 };
  const nodeRB = { x: level2X, y: 130 };
  const nodeBR = { x: level2X, y: 190 };
  const nodeBB = { x: level2X, y: 270 };

  const fmt = (p: number) => isNaN(p) || !isFinite(p) ? '—' : p.toFixed(3);

  return (
    <div className="bg-gradient-to-b from-red-50 via-slate-50 to-blue-50 dark:from-red-950 dark:via-slate-950 dark:to-blue-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
          Drawing Cards — Tree of Outcomes
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setMode('with')}
            className={`text-xs font-bold px-2 py-0.5 rounded transition ${
              mode === 'with' ? 'bg-emerald-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
            }`}>
            With replacement (independent)
          </button>
          <button
            onClick={() => setMode('without')}
            className={`text-xs font-bold px-2 py-0.5 rounded transition ${
              mode === 'without' ? 'bg-rose-500 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300'
            }`}>
            Without replacement (dependent)
          </button>
        </div>
      </div>

      {/* Deck configuration */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span className="text-red-600 dark:text-red-400 font-semibold">🔴 Red</span>
            <span className="font-mono font-bold">{red}</span>
          </label>
          <input type="range" min={1} max={10} value={red}
            onChange={e => setRed(+e.target.value)}
            className="w-full accent-red-500" />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">🔵 Blue</span>
            <span className="font-mono font-bold">{blue}</span>
          </label>
          <input type="range" min={1} max={10} value={blue}
            onChange={e => setBlue(+e.target.value)}
            className="w-full accent-blue-500" />
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Interactive two-draw probability tree">

        {/* Root */}
        <circle cx={rootX} cy={rootY} r={16} fill="#64748b" />
        <text x={rootX} y={rootY + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Start</text>

        {/* Level 1 edges */}
        <line x1={rootX + 14} y1={rootY} x2={nodeR1.x - 20} y2={nodeR1.y}
          stroke="#dc2626" strokeWidth="2" />
        <text x={(rootX + nodeR1.x) / 2} y={(rootY + nodeR1.y) / 2 - 5}
          textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="10" fontWeight="bold">
          {fmt(pR1)}
        </text>

        <line x1={rootX + 14} y1={rootY} x2={nodeB1.x - 20} y2={nodeB1.y}
          stroke="#2563eb" strokeWidth="2" />
        <text x={(rootX + nodeB1.x) / 2} y={(rootY + nodeB1.y) / 2 + 15}
          textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10" fontWeight="bold">
          {fmt(pB1)}
        </text>

        {/* Level 1 nodes */}
        <circle cx={nodeR1.x} cy={nodeR1.y} r={18} fill="#dc2626" />
        <text x={nodeR1.x} y={nodeR1.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">R</text>

        <circle cx={nodeB1.x} cy={nodeB1.y} r={18} fill="#2563eb" />
        <text x={nodeB1.x} y={nodeB1.y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">B</text>

        {/* Level 2 edges from R */}
        <line x1={nodeR1.x + 16} y1={nodeR1.y} x2={nodeRR.x - 16} y2={nodeRR.y}
          stroke="#dc2626" strokeWidth="1.5" />
        <text x={(nodeR1.x + nodeRR.x) / 2} y={(nodeR1.y + nodeRR.y) / 2 - 4}
          textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="10">
          {fmt(pR_givenR)}
        </text>

        <line x1={nodeR1.x + 16} y1={nodeR1.y} x2={nodeRB.x - 16} y2={nodeRB.y}
          stroke="#7c3aed" strokeWidth="1.5" />
        <text x={(nodeR1.x + nodeRB.x) / 2} y={(nodeR1.y + nodeRB.y) / 2 + 12}
          textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="10">
          {fmt(pB_givenR)}
        </text>

        {/* Level 2 edges from B */}
        <line x1={nodeB1.x + 16} y1={nodeB1.y} x2={nodeBR.x - 16} y2={nodeBR.y}
          stroke="#7c3aed" strokeWidth="1.5" />
        <text x={(nodeB1.x + nodeBR.x) / 2} y={(nodeB1.y + nodeBR.y) / 2 - 4}
          textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="10">
          {fmt(pR_givenB)}
        </text>

        <line x1={nodeB1.x + 16} y1={nodeB1.y} x2={nodeBB.x - 16} y2={nodeBB.y}
          stroke="#2563eb" strokeWidth="1.5" />
        <text x={(nodeB1.x + nodeBB.x) / 2} y={(nodeB1.y + nodeBB.y) / 2 + 14}
          textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="10">
          {fmt(pB_givenB)}
        </text>

        {/* Leaf nodes (clickable) */}
        {[
          { id: 'RR', node: nodeRR, color: '#dc2626' },
          { id: 'RB', node: nodeRB, color: '#a855f7' },
          { id: 'BR', node: nodeBR, color: '#a855f7' },
          { id: 'BB', node: nodeBB, color: '#2563eb' },
        ].map(({ id, node, color }) => {
          const leaf = leaves.find(l => l.id === id)!;
          const isSel = selectedLeaf === id;
          return (
            <g key={id} onClick={() => setSelectedLeaf(isSel ? null : id)} className="cursor-pointer">
              {isSel && (
                <circle cx={node.x} cy={node.y} r={22} fill={color} opacity="0.3" />
              )}
              <rect x={node.x - 25} y={node.y - 12} width={80} height={24} rx={4}
                fill={color} opacity={isSel ? 1 : 0.85}
                stroke={isSel ? '#1e293b' : 'none'} strokeWidth="2" />
              <text x={node.x + 15} y={node.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                {id} · {fmt(leaf.p)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selected leaf explanation */}
      {selectedLeaf && (() => {
        const leaf = leaves.find(l => l.id === selectedLeaf)!;
        return (
          <div className="mt-2 p-3 rounded-lg text-center" style={{ background: leaf.color + '20', border: `1px solid ${leaf.color}` }}>
            <div className="text-xs text-gray-700 dark:text-gray-200">
              <strong>P({leaf.label})</strong> = {leaf.chain} = <span className="font-mono font-bold" style={{ color: leaf.color }}>{fmt(leaf.p)}</span>
            </div>
          </div>
        );
      })()}

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        Multiply along each branch, then add across branches to get total probabilities. Toggle mode to see how dependent draws change things.
      </p>
    </div>
  );
}
