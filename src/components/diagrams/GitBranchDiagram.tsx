import { useState, useEffect } from 'react';

// ── Branches and Merges ──────────────────────────────────────
// Step-through Git history. Commits appear on main → branch
// diverges → commits on feature branch → merge back. Shows
// how branches are just pointers to commits.

interface Commit {
  id: string;
  x: number;
  y: number;
  branch: 'main' | 'feature';
  parents: string[];
  message: string;
}

const STEPS: { commits: Commit[]; label: string; head: string; featureHead?: string }[] = [
  {
    label: 'Start — main has 2 commits',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
    ],
    head: 'b2',
  },
  {
    label: 'git switch -c feature-auth — new branch, same commit',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
    ],
    head: 'b2',
    featureHead: 'b2',
  },
  {
    label: 'New commit on feature branch → it diverges',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
      { id: 'c3', x: 220, y: 60, branch: 'feature', parents: ['b2'], message: 'Add login form' },
    ],
    head: 'b2',
    featureHead: 'c3',
  },
  {
    label: 'Meanwhile, another commit on main',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
      { id: 'c3', x: 220, y: 60, branch: 'feature', parents: ['b2'], message: 'Add login form' },
      { id: 'd4', x: 220, y: 100, branch: 'main', parents: ['b2'], message: 'Fix typo' },
    ],
    head: 'd4',
    featureHead: 'c3',
  },
  {
    label: 'Another commit on feature — parallel development',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
      { id: 'c3', x: 220, y: 60, branch: 'feature', parents: ['b2'], message: 'Add login form' },
      { id: 'd4', x: 220, y: 100, branch: 'main', parents: ['b2'], message: 'Fix typo' },
      { id: 'e5', x: 290, y: 60, branch: 'feature', parents: ['c3'], message: 'Hash password' },
    ],
    head: 'd4',
    featureHead: 'e5',
  },
  {
    label: 'git merge feature-auth — branches rejoin as one commit',
    commits: [
      { id: 'a1', x: 80, y: 100, branch: 'main', parents: [], message: 'Initial commit' },
      { id: 'b2', x: 150, y: 100, branch: 'main', parents: ['a1'], message: 'Add README' },
      { id: 'c3', x: 220, y: 60, branch: 'feature', parents: ['b2'], message: 'Add login form' },
      { id: 'd4', x: 220, y: 100, branch: 'main', parents: ['b2'], message: 'Fix typo' },
      { id: 'e5', x: 290, y: 60, branch: 'feature', parents: ['c3'], message: 'Hash password' },
      { id: 'f6', x: 360, y: 100, branch: 'main', parents: ['d4', 'e5'], message: 'Merge feature-auth' },
    ],
    head: 'f6',
    featureHead: 'e5',
  },
];

export default function GitBranchDiagram() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!auto || paused) return;
    const id = setTimeout(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 1800);
    return () => clearTimeout(id);
  }, [auto, paused, step]);

  const current = STEPS[step];
  const W = 440, H = 190;

  return (
    <div className="bg-gradient-to-b from-orange-50 via-slate-50 to-blue-50 dark:from-orange-950 dark:via-slate-950 dark:to-blue-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
          Branches and Merges
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Step {step + 1}/{STEPS.length}</span>
          <button
            onClick={() => { setAuto(false); setStep(s => Math.max(0, s - 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setAuto(a => !a)}
            className={`text-xs px-2 py-0.5 rounded transition ${
              auto
                ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/50'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
          >
            {auto ? 'Auto ●' : 'Manual'}
          </button>
          <button
            onClick={() => { setAuto(false); setStep(s => Math.min(STEPS.length - 1, s + 1)); }}
            className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
          >
            Next →
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

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated git branch — commits forming a tree, branches diverging and merging">

        {/* Branch labels */}
        <text x={30} y={65} className="fill-violet-700 dark:fill-violet-300" fontSize="10" fontWeight="bold">feature-auth</text>
        <text x={30} y={105} className="fill-sky-700 dark:fill-sky-300" fontSize="10" fontWeight="bold">main</text>

        {/* Edges (parent → child) */}
        {current.commits.map(commit =>
          commit.parents.map(parentId => {
            const parent = current.commits.find(c => c.id === parentId);
            if (!parent) return null;
            return (
              <line key={`${parentId}-${commit.id}`}
                x1={parent.x} y1={parent.y} x2={commit.x} y2={commit.y}
                stroke={commit.branch === 'feature' ? '#a78bfa' : '#38bdf8'}
                strokeWidth="2.5" />
            );
          })
        )}

        {/* Commit nodes */}
        {current.commits.map(commit => {
          const isHead = commit.id === current.head;
          const isFeatureHead = commit.id === current.featureHead;
          const color = commit.branch === 'feature' ? '#8b5cf6' : '#0ea5e9';
          return (
            <g key={commit.id}>
              {(isHead || isFeatureHead) && (
                <circle cx={commit.x} cy={commit.y} r="14" fill={color} opacity="0.25" />
              )}
              <circle cx={commit.x} cy={commit.y} r="10"
                fill={color} stroke="#1e293b" strokeWidth="1.5" />
              <text x={commit.x} y={commit.y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                {commit.id}
              </text>
              {/* Branch pointer labels */}
              {isHead && (
                <g>
                  <rect x={commit.x - 28} y={commit.y + 14} width={56} height={14} rx={3}
                    fill="#0ea5e9" />
                  <text x={commit.x} y={commit.y + 24} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                    main
                  </text>
                </g>
              )}
              {isFeatureHead && (
                <g>
                  <rect x={commit.x - 40} y={commit.y - 28} width={80} height={14} rx={3}
                    fill="#8b5cf6" />
                  <text x={commit.x} y={commit.y - 18} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                    feature-auth
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg p-2.5 text-center">
        <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
          {current.label}
        </p>
      </div>
    </div>
  );
}
