import { useState, useEffect } from 'react';

/**
 * Animated BFS vs DFS comparison on a small graph.
 * Shows nodes lighting up in BFS (layer-by-layer) vs DFS (deep-first) order.
 */
export default function BFSDFSDiagram() {
  const [mode, setMode] = useState<'bfs' | 'dfs'>('bfs');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Graph layout: A-B, A-C, B-D, B-E, C-F, C-G
  const nodes: { id: string; x: number; y: number }[] = [
    { id: 'A', x: 180, y: 30 },
    { id: 'B', x: 100, y: 90 },
    { id: 'C', x: 260, y: 90 },
    { id: 'D', x: 60, y: 155 },
    { id: 'E', x: 140, y: 155 },
    { id: 'F', x: 220, y: 155 },
    { id: 'G', x: 300, y: 155 },
  ];

  const edges: [string, string][] = [
    ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G'],
  ];

  // BFS order: A, B, C, D, E, F, G (level by level)
  const bfsOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  // DFS order: A, B, D, E, C, F, G (deep first)
  const dfsOrder = ['A', 'B', 'D', 'E', 'C', 'F', 'G'];

  const order = mode === 'bfs' ? bfsOrder : dfsOrder;
  const maxStep = order.length - 1;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= maxStep) { setPlaying(false); return maxStep; }
        return s + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [playing, maxStep]);

  const visited = new Set(order.slice(0, step + 1));
  const currentNode = order[step];

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const r = 18;

  const bfsColors = ['fill-blue-500', 'fill-blue-400', 'fill-blue-400', 'fill-blue-300', 'fill-blue-300', 'fill-blue-300', 'fill-blue-300'];
  const dfsColors = ['fill-orange-500', 'fill-orange-400', 'fill-orange-300', 'fill-orange-300', 'fill-orange-400', 'fill-orange-300', 'fill-orange-300'];

  return (
    <svg viewBox="0 0 370 260" className="w-full max-w-xl mx-auto" role="img" aria-label="BFS vs DFS graph traversal animation">
      {/* Title */}
      <text x="185" y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        {mode === 'bfs' ? 'BFS: Breadth-First (Layer by Layer)' : 'DFS: Depth-First (Go Deep First)'}
      </text>

      {/* Edges */}
      {edges.map(([a, b]) => {
        const na = nodeMap[a], nb = nodeMap[b];
        const bothVisited = visited.has(a) && visited.has(b);
        return (
          <line key={`${a}-${b}`}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            className={bothVisited ? (mode === 'bfs' ? 'stroke-blue-400 dark:stroke-blue-500' : 'stroke-orange-400 dark:stroke-orange-500') : 'stroke-gray-300 dark:stroke-gray-600'}
            strokeWidth={bothVisited ? 2.5 : 1.5} />
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isVisited = visited.has(n.id);
        const isCurrent = n.id === currentNode;
        const visitIdx = order.indexOf(n.id);
        const colors = mode === 'bfs' ? bfsColors : dfsColors;

        return (
          <g key={n.id}>
            {/* Pulse ring for current node */}
            {isCurrent && (
              <circle cx={n.x} cy={n.y} r={r + 4}
                className={mode === 'bfs' ? 'stroke-blue-400 dark:stroke-blue-500' : 'stroke-orange-400 dark:stroke-orange-500'}
                fill="none" strokeWidth="2" opacity="0.5" />
            )}
            <circle cx={n.x} cy={n.y} r={r}
              className={
                isVisited ? `${colors[visitIdx]} ${isCurrent ? 'stroke-white dark:stroke-gray-900' : (mode === 'bfs' ? 'stroke-blue-600 dark:stroke-blue-300' : 'stroke-orange-600 dark:stroke-orange-300')}` :
                'fill-gray-200 dark:fill-gray-700 stroke-gray-400 dark:stroke-gray-500'
              }
              strokeWidth={isCurrent ? 3 : 1.5} />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
              className={isVisited ? 'fill-white' : 'fill-gray-600 dark:fill-gray-400'}
              fontSize="13" fontWeight="700">
              {n.id}
            </text>
            {/* Visit order number */}
            {isVisited && (
              <text x={n.x + r + 4} y={n.y - r + 4}
                className={mode === 'bfs' ? 'fill-blue-600 dark:fill-blue-400' : 'fill-orange-600 dark:fill-orange-400'}
                fontSize="9" fontWeight="700">
                {visitIdx + 1}
              </text>
            )}
          </g>
        );
      })}

      {/* Visit order label */}
      <text x="185" y="192" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">
        Order: {order.slice(0, step + 1).join(' → ')}{step < maxStep ? ' → ...' : ''}
      </text>

      {/* Mode toggle */}
      <g transform="translate(95, 206)">
        <rect x="0" y="0" width="50" height="20" rx="4"
              className={mode === 'bfs' ? 'fill-blue-200 dark:fill-blue-800 stroke-blue-400' : 'fill-gray-200 dark:fill-gray-700 stroke-gray-400'} strokeWidth="1"
              onClick={() => { setMode('bfs'); setStep(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="25" y="14" textAnchor="middle" className={mode === 'bfs' ? 'fill-blue-800 dark:fill-blue-200 pointer-events-none' : 'fill-gray-500 dark:fill-gray-400 pointer-events-none'} fontSize="9" fontWeight="700">BFS</text>

        <rect x="56" y="0" width="50" height="20" rx="4"
              className={mode === 'dfs' ? 'fill-orange-200 dark:fill-orange-800 stroke-orange-400' : 'fill-gray-200 dark:fill-gray-700 stroke-gray-400'} strokeWidth="1"
              onClick={() => { setMode('dfs'); setStep(0); setPlaying(false); }} style={{ cursor: 'pointer' }} />
        <text x="81" y="14" textAnchor="middle" className={mode === 'dfs' ? 'fill-orange-800 dark:fill-orange-200 pointer-events-none' : 'fill-gray-500 dark:fill-gray-400 pointer-events-none'} fontSize="9" fontWeight="700">DFS</text>

        <rect x="118" y="0" width="50" height="20" rx="4"
              className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="1"
              onClick={() => { if (step >= maxStep) setStep(0); setPlaying(!playing); }} style={{ cursor: 'pointer' }} />
        <text x="143" y="14" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 pointer-events-none" fontSize="9" fontWeight="700">
          {playing ? '⏸' : '▶ Play'}
        </text>
      </g>

      {/* Explanation at bottom */}
      <text x="185" y="245" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        {mode === 'bfs' ? 'BFS uses a queue — visits all neighbors before going deeper' : 'DFS uses a stack — goes as deep as possible before backtracking'}
      </text>
    </svg>
  );
}
