/**
 * Git branching diagram — shows main branch, feature branch, and merge.
 * Visual timeline with commits as circles and branch/merge arrows.
 */
export default function GitBranchDiagram() {
  const totalW = 480;
  const totalH = 200;
  const mainY = 60;
  const branchY = 130;
  const commitR = 10;

  const mainCommits = [
    { x: 60, label: 'A', msg: 'init' },
    { x: 140, label: 'B', msg: 'add header' },
    { x: 220, label: 'C', msg: 'fix bug' },
    { x: 380, label: 'F', msg: 'merge' },
    { x: 440, label: 'G', msg: 'deploy' },
  ];

  const branchCommits = [
    { x: 220, label: 'D', msg: 'new feature' },
    { x: 310, label: 'E', msg: 'tests pass' },
  ];

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-lg mx-auto my-6" role="img" aria-label="Git branching diagram showing main and feature branch with merge">
      {/* Title */}
      <text x={totalW / 2} y="16" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="12" fontWeight="700">
        Git Branches: Create, Work, Merge
      </text>

      {/* Branch labels */}
      <text x="12" y={mainY + 4} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="700">main</text>
      <text x="12" y={branchY + 4} className="fill-violet-600 dark:fill-violet-400" fontSize="10" fontWeight="700">feature</text>

      {/* Main branch line */}
      <line x1={mainCommits[0].x} y1={mainY} x2={mainCommits[mainCommits.length - 1].x} y2={mainY}
        className="stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="3" />

      {/* Feature branch line */}
      <line x1={branchCommits[0].x} y1={branchY} x2={branchCommits[branchCommits.length - 1].x} y2={branchY}
        className="stroke-violet-400 dark:stroke-violet-500" strokeWidth="3" />

      {/* Branch-off arrow (C → D) */}
      <line x1={220} y1={mainY + commitR} x2={220} y2={branchY - commitR}
        className="stroke-violet-300 dark:stroke-violet-600" strokeWidth="2" strokeDasharray="4 3" />

      {/* Merge arrow (E → F) */}
      <line x1={branchCommits[1].x} y1={branchY - commitR} x2={mainCommits[3].x} y2={mainY + commitR}
        className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
      <text x={350} y={95} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontWeight="700">
        merge
      </text>

      {/* Main commits */}
      {mainCommits.map((c, i) => (
        <g key={c.label}>
          <circle cx={c.x} cy={mainY} r={commitR}
            className={c.label === 'F' ? 'fill-amber-400 stroke-amber-600' : 'fill-emerald-200 dark:fill-emerald-800 stroke-emerald-500'}
            strokeWidth="2" />
          <text x={c.x} y={mainY + 1} textAnchor="middle" dominantBaseline="central"
            className="fill-emerald-800 dark:fill-emerald-200" fontSize="9" fontWeight="800">
            {c.label}
          </text>
          <text x={c.x} y={mainY - 18} textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400" fontSize="7">
            {c.msg}
          </text>
        </g>
      ))}

      {/* Branch commits */}
      {branchCommits.map((c) => (
        <g key={c.label}>
          <circle cx={c.x} cy={branchY} r={commitR}
            className="fill-violet-200 dark:fill-violet-800 stroke-violet-500" strokeWidth="2" />
          <text x={c.x} y={branchY + 1} textAnchor="middle" dominantBaseline="central"
            className="fill-violet-800 dark:fill-violet-200" fontSize="9" fontWeight="800">
            {c.label}
          </text>
          <text x={c.x} y={branchY + 22} textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400" fontSize="7">
            {c.msg}
          </text>
        </g>
      ))}

      {/* Annotations */}
      <text x={220} y={branchY - 38} textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontSize="7" fontWeight="600">
        git checkout -b feature
      </text>
      <text x={380} y={mainY + 28} textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="7" fontWeight="600">
        git merge feature
      </text>

      {/* Footer */}
      <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
        Branches let you work on features without breaking main. Merge brings them together.
      </text>
    </svg>
  );
}
