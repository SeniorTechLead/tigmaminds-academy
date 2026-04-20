import { useState, useEffect } from 'react';

// ── Watch Recursion Unfold ───────────────────────────────────
// Animated fibonacci(n) call tree. User picks n; tree expands
// showing every recursive call made. Highlights the explosive
// cost of naive recursion (2^n calls for fib(n)). Compare with
// memoized version (linear).

interface TreeNode {
  n: number;
  children: TreeNode[];
  x: number;
  y: number;
  phase: number; // 0 = unvisited, 1 = expanding, 2 = returning
  value?: number;
}

function buildTree(n: number, depth = 0, x = 0, xRange = 1): TreeNode {
  const node: TreeNode = { n, children: [], x, y: depth, phase: 0 };
  if (n < 2) return node;
  const half = xRange / 2;
  node.children = [
    buildTree(n - 1, depth + 1, x - half / 2, half),
    buildTree(n - 2, depth + 1, x + half / 2, half),
  ];
  return node;
}

function countNodes(t: TreeNode): number {
  return 1 + t.children.reduce((s, c) => s + countNodes(c), 0);
}

function flattenTree(t: TreeNode): TreeNode[] {
  const out: TreeNode[] = [t];
  for (const c of t.children) out.push(...flattenTree(c));
  return out;
}

// DFS order list for animation stepping
function dfsOrder(t: TreeNode, order: { node: TreeNode; enter: boolean }[] = []): { node: TreeNode; enter: boolean }[] {
  order.push({ node: t, enter: true });
  for (const c of t.children) dfsOrder(c, order);
  order.push({ node: t, enter: false });
  return order;
}

function computeFib(n: number): number {
  if (n < 2) return n;
  return computeFib(n - 1) + computeFib(n - 2);
}

export default function RecursionTreeDiagram() {
  const [n, setN] = useState(4);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  const tree = buildTree(n);
  const nodes = flattenTree(tree);
  const order = dfsOrder(tree);
  const totalCalls = countNodes(tree);

  useEffect(() => {
    setStep(0);
  }, [n]);

  useEffect(() => {
    if (!auto || paused) return;
    if (step >= order.length) return;
    const id = setTimeout(() => setStep(s => s + 1), 400);
    return () => clearTimeout(id);
  }, [auto, paused, step, order.length]);

  // Apply step to nodes: each node has phase 0 (not yet), 1 (entering/expanding), 2 (returned)
  const nodePhase = new Map<TreeNode, number>();
  nodes.forEach(node => nodePhase.set(node, 0));
  for (let i = 0; i < step && i < order.length; i++) {
    const { node, enter } = order[i];
    nodePhase.set(node, enter ? 1 : 2);
  }

  const W = 600, H = 340;

  // Calculate positions: center horizontally, depth = y
  const maxDepth = n;
  const leafCount = Math.pow(2, maxDepth);
  const spacing = (W - 40) / Math.max(leafCount, 1);

  // Reposition tree with proper layout (simple: assign x based on in-order traversal of leaves)
  function layoutTree(t: TreeNode, left: number, right: number, depth: number) {
    t.x = (left + right) / 2;
    t.y = 30 + depth * 60;
    if (t.children.length === 0) return;
    const mid = (left + right) / 2;
    layoutTree(t.children[0], left, mid, depth + 1);
    layoutTree(t.children[1], mid, right, depth + 1);
  }
  layoutTree(tree, 20, W - 20, 0);

  const completedNodes = Array.from(nodePhase.entries()).filter(([, p]) => p > 0).length;

  return (
    <div className="bg-gradient-to-b from-amber-50 via-slate-50 to-rose-50 dark:from-amber-950 dark:via-slate-950 dark:to-rose-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Watch Recursion Unfold
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {completedNodes}/{totalCalls} calls
          </span>
          <button
            onClick={() => { setAuto(false); setStep(s => Math.max(0, s - 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setAuto(!auto)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              auto
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {auto ? 'Auto ●' : 'Manual'}
          </button>
          <button
            onClick={() => { setAuto(false); setStep(s => Math.min(order.length, s + 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Next →
          </button>
          <button
            onClick={() => setStep(0)}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Reset
          </button>
          {auto && (
            <button
              onClick={() => setPaused(!paused)}
              className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
            >
              {paused ? '▶' : '⏸'}
            </button>
          )}
        </div>
      </div>

      {/* n selector */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">fib(</span>
        {[3, 4, 5, 6].map(v => (
          <button key={v}
            onClick={() => setN(v)}
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded transition ${
              n === v
                ? 'bg-amber-500 text-white'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}>
            {v}
          </button>
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400">)</span>
        <span className="text-xs text-gray-500 ml-4">
          = {computeFib(n)} · <strong>{totalCalls}</strong> total calls (!)
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl mx-auto" role="img"
        aria-label="Animated fibonacci recursion tree">

        {/* Edges */}
        {nodes.flatMap(node =>
          node.children.map((child, i) => (
            <line key={`${node.n}-${node.x}-${i}`}
              x1={node.x} y1={node.y}
              x2={child.x} y2={child.y}
              stroke={nodePhase.get(child)! > 0 ? '#f59e0b' : '#cbd5e1'}
              className={nodePhase.get(child)! > 0 ? '' : 'dark:stroke-gray-600'}
              strokeWidth="2"
              opacity={nodePhase.get(child)! > 0 ? 0.8 : 0.3} />
          ))
        )}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const phase = nodePhase.get(node)!;
          const value = node.n < 2 ? node.n : computeFib(node.n);
          return (
            <g key={`n-${node.x}-${node.y}-${i}`}>
              <circle cx={node.x} cy={node.y} r="20"
                fill={phase === 0 ? '#e2e8f0' : phase === 1 ? '#fde68a' : '#86efac'}
                className={phase === 0 ? 'dark:fill-gray-700' : ''}
                stroke={phase === 1 ? '#f59e0b' : phase === 2 ? '#10b981' : '#94a3b8'}
                strokeWidth="2"
                opacity={phase === 0 ? 0.5 : 1}
                style={phase === 1 ? { filter: 'drop-shadow(0 0 6px #fbbf24)' } : undefined} />
              <text x={node.x} y={node.y - 2} textAnchor="middle"
                className={phase === 0 ? 'fill-gray-400 dark:fill-gray-500' : 'fill-gray-800 dark:fill-gray-100'}
                fontSize="10" fontWeight="bold">
                fib({node.n})
              </text>
              {phase === 2 && (
                <text x={node.x} y={node.y + 9} textAnchor="middle"
                  className="fill-emerald-700 dark:fill-emerald-300" fontSize="9" fontWeight="bold">
                  = {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 text-xs text-gray-700 dark:text-gray-300 text-center">
        <span className="text-rose-700 dark:text-rose-300 font-semibold">Notice the explosion:</span>{' '}
        fib(4) = 9 calls. fib(5) = 15. fib(6) = 25. fib(30) = over <strong>2.7 million</strong> calls.
        Same subproblems computed again and again. <br />
        <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Memoization</span> caches each result — fib(n) becomes just n calls.
      </div>
    </div>
  );
}
