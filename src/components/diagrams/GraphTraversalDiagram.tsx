'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Node { id: string; x: number; y: number }
interface Edge { from: string; to: string }

const NODES: Node[] = [
  { id: 'A', x: 130, y: 40 },
  { id: 'B', x: 60, y: 100 },
  { id: 'C', x: 200, y: 100 },
  { id: 'D', x: 30, y: 175 },
  { id: 'E', x: 130, y: 160 },
  { id: 'F', x: 260, y: 175 },
  { id: 'G', x: 90, y: 240 },
  { id: 'H', x: 200, y: 240 },
];

const EDGES: Edge[] = [
  { from: 'A', to: 'B' }, { from: 'A', to: 'C' },
  { from: 'B', to: 'D' }, { from: 'B', to: 'E' },
  { from: 'C', to: 'E' }, { from: 'C', to: 'F' },
  { from: 'D', to: 'G' }, { from: 'E', to: 'G' },
  { from: 'E', to: 'H' }, { from: 'F', to: 'H' },
];

function adjacency(): Record<string, string[]> {
  const adj: Record<string, string[]> = {};
  NODES.forEach(n => (adj[n.id] = []));
  EDGES.forEach(e => { adj[e.from].push(e.to); adj[e.to].push(e.from); });
  // sort neighbors for deterministic traversal
  Object.keys(adj).forEach(k => adj[k].sort());
  return adj;
}

const ADJ = adjacency();

function bfsOrder(start: string): string[] {
  const visited = new Set<string>();
  const queue = [start];
  const order: string[] = [];
  visited.add(start);
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  return order;
}

function dfsOrder(start: string): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  function dfs(node: string) {
    visited.add(node);
    order.push(node);
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) dfs(nb);
    }
  }
  dfs(start);
  return order;
}

function bfsPath(start: string, target: string): string[] | null {
  const visited = new Set<string>();
  const parent: Record<string, string | null> = {};
  const queue = [start];
  visited.add(start);
  parent[start] = null;
  while (queue.length) {
    const node = queue.shift()!;
    if (node === target) {
      const path: string[] = [];
      let cur: string | null = target;
      while (cur !== null) { path.unshift(cur); cur = parent[cur]; }
      return path;
    }
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) { visited.add(nb); parent[nb] = node; queue.push(nb); }
    }
  }
  return null;
}

// Compute BFS/DFS frontier at each step for queue/stack visualization
function bfsFrontiers(start: string): { node: string; frontier: string[] }[] {
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);
  const steps: { node: string; frontier: string[] }[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
    steps.push({ node, frontier: [...queue] });
  }
  return steps;
}

function dfsFrontiers(start: string): { node: string; frontier: string[] }[] {
  const visited = new Set<string>();
  const steps: { node: string; frontier: string[] }[] = [];
  const stack: string[] = [];
  function dfs(node: string) {
    visited.add(node);
    // push unvisited neighbors in reverse so first neighbor is on top
    const unvisitedNeighbors = ADJ[node].filter(nb => !visited.has(nb));
    stack.push(...unvisitedNeighbors.slice().reverse());
    steps.push({ node, frontier: [...stack] });
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) {
        stack.pop(); // remove from stack as we visit
        dfs(nb);
      }
    }
  }
  dfs(start);
  return steps;
}

export default function GraphTraversalDiagram() {
  const [mode, setMode] = useState<'BFS' | 'DFS'>('BFS');
  const [startNode, setStartNode] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [shortestTarget, setShortestTarget] = useState<string | null>(null);
  const [showPath, setShowPath] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const order = startNode ? (mode === 'BFS' ? bfsOrder(startNode) : dfsOrder(startNode)) : [];
  const frontiers = startNode
    ? (mode === 'BFS' ? bfsFrontiers(startNode) : dfsFrontiers(startNode))
    : [];
  const visited = new Set(order.slice(0, step));
  const current = step > 0 && step <= order.length ? order[step - 1] : null;
  const done = step >= order.length && order.length > 0;
  const frontier = step > 0 && step <= frontiers.length ? frontiers[step - 1].frontier : [];

  const pathNodes = showPath && startNode && shortestTarget
    ? bfsPath(startNode, shortestTarget) : null;
  const pathEdgeSet = new Set<string>();
  if (pathNodes) {
    for (let i = 0; i < pathNodes.length - 1; i++) {
      pathEdgeSet.add(`${pathNodes[i]}-${pathNodes[i + 1]}`);
      pathEdgeSet.add(`${pathNodes[i + 1]}-${pathNodes[i]}`);
    }
  }

  const reset = useCallback(() => {
    setStep(0);
    setAnimating(false);
    setShowPath(false);
    setShortestTarget(null);
    if (animRef.current) clearInterval(animRef.current);
  }, []);

  const handleNodeClick = (id: string) => {
    if (showPath && startNode && id !== startNode) {
      setShortestTarget(id);
      return;
    }
    reset();
    setStartNode(id);
  };

  const advance = useCallback(() => {
    setStep(s => {
      if (s >= order.length) {
        setAnimating(false);
        if (animRef.current) clearInterval(animRef.current);
        return s;
      }
      return s + 1;
    });
  }, [order.length]);

  useEffect(() => {
    if (animating && startNode) {
      animRef.current = setInterval(advance, 500);
      return () => { if (animRef.current) clearInterval(animRef.current); };
    }
  }, [animating, startNode, advance]);

  useEffect(() => {
    if (step >= order.length && order.length > 0) {
      setAnimating(false);
      if (animRef.current) clearInterval(animRef.current);
    }
  }, [step, order.length]);

  const toggleMode = () => {
    const next = mode === 'BFS' ? 'DFS' : 'BFS';
    setMode(next);
    reset();
  };

  const nodeColor = (id: string) => {
    if (pathNodes && pathNodes.includes(id)) return '#f59e0b';
    if (id === current) return mode === 'BFS' ? '#3b82f6' : '#a855f7';
    if (visited.has(id)) return mode === 'BFS' ? '#93c5fd' : '#d8b4fe';
    return '#e2e8f0';
  };

  const visitIndex = (id: string): number | null => {
    const idx = order.indexOf(id);
    return idx !== -1 && idx < step ? idx + 1 : null;
  };

  const nodeOf = (id: string) => NODES.find(n => n.id === id)!;
  const tColor = mode === 'BFS' ? '#3b82f6' : '#a855f7';

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-2 items-center justify-center">
        <button onClick={toggleMode} className="px-3 py-1 rounded text-xs font-semibold text-white" style={{ background: tColor }}>
          {mode}
        </button>
        <button onClick={() => { if (startNode && !animating) advance(); }} disabled={!startNode || animating || done}
          className="px-3 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-40">
          Step
        </button>
        <button onClick={() => { if (startNode && !done) { if (step === 0) setStep(1); setAnimating(true); } }} disabled={!startNode || done}
          className="px-3 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-40">
          Animate
        </button>
        <button onClick={reset} disabled={!startNode}
          className="px-3 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 disabled:opacity-40">
          Reset
        </button>
        {done && mode === 'BFS' && (
          <button onClick={() => { setShowPath(true); setShortestTarget(null); }}
            className="px-3 py-1 rounded text-xs font-semibold bg-amber-500 text-white">
            Shortest Path
          </button>
        )}
      </div>

      {!startNode && (
        <p className="text-center text-xs text-gray-500 dark:text-slate-400 mb-1">Click a node to start traversal</p>
      )}
      {showPath && !shortestTarget && (
        <p className="text-center text-xs text-amber-600 dark:text-amber-400 mb-1">Click a target node to show shortest BFS path</p>
      )}

      {/* Graph SVG */}
      <svg viewBox="0 0 460 280" className="w-full h-auto" role="img" aria-label="Graph traversal diagram: BFS vs DFS">
        <rect width="460" height="280" rx="8" className="fill-white dark:fill-slate-950" />
        {/* Title */}
        <text x="350" y="20" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">
          Exploring Networks: {mode}
        </text>

        {/* Edges */}
        <g transform="translate(150, 0)">
          {EDGES.map(e => {
            const a = nodeOf(e.from), b = nodeOf(e.to);
            const onPath = pathEdgeSet.has(`${e.from}-${e.to}`);
            return (
              <line key={`${e.from}-${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={onPath ? '#f59e0b' : '#94a3b8'} strokeWidth={onPath ? 3 : 1.5} opacity={onPath ? 1 : 0.5} />
            );
          })}

          {/* Nodes */}
          {NODES.map(n => {
            const isCurrent = n.id === current;
            const vIdx = visitIndex(n.id);
            return (
              <g key={n.id} onClick={() => handleNodeClick(n.id)} style={{ cursor: 'pointer' }}>
                <circle cx={n.x} cy={n.y} r={18} fill={nodeColor(n.id)}
                  stroke={isCurrent ? tColor : '#64748b'} strokeWidth={isCurrent ? 3 : 1.5}>
                  {isCurrent && (
                    <animate attributeName="r" values="18;21;18" dur="0.6s" repeatCount="indefinite" />
                  )}
                </circle>
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
                  fontSize="12" fontWeight="700" fill={visited.has(n.id) || (pathNodes && pathNodes.includes(n.id)) ? '#fff' : '#334155'}>
                  {n.id}
                </text>
                {vIdx !== null && (
                  <text x={n.x + 14} y={n.y - 14} textAnchor="middle" fontSize="9" fontWeight="700" fill={tColor}>
                    {vIdx}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Queue / Stack visualization */}
      {startNode && step > 0 && (
        <div className="mt-2 text-center">
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
            {mode === 'BFS' ? 'Queue' : 'Stack'}:{' '}
          </span>
          <span className="text-xs font-mono">
            {frontier.length > 0 ? `[ ${frontier.join(', ')} ]` : '[ empty ]'}
          </span>
          <span className="ml-3 text-xs text-gray-500 dark:text-slate-400">
            Visited: {order.slice(0, step).join(' → ')}
          </span>
        </div>
      )}

      {/* Shortest path result */}
      {pathNodes && (
        <p className="text-center text-xs mt-1 text-amber-600 dark:text-amber-400 font-semibold">
          Shortest path: {pathNodes.join(' → ')} ({pathNodes.length - 1} edge{pathNodes.length - 1 !== 1 ? 's' : ''})
        </p>
      )}

      {/* Completion message */}
      {done && !showPath && (
        <p className="text-center text-xs mt-2 px-4 text-gray-600 dark:text-slate-400 italic">
          {mode === 'BFS'
            ? 'BFS visits layer by layer (like ripples). DFS goes as deep as possible before backtracking.'
            : 'DFS goes as deep as possible before backtracking. BFS visits layer by layer (like ripples).'}
        </p>
      )}
    </div>
  );
}
