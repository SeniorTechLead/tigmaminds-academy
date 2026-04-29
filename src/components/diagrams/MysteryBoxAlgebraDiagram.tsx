/**
 * Tara holds two boxes. One has a number — say "5". The other has a letter,
 * "x" — its contents are unknown. The point: a variable is just a "mystery
 * box" — a placeholder waiting to be filled with a number.
 *
 * Used to open the Variables and Expressions section.
 */
import Tara from './people/Tara';

export default function MysteryBoxAlgebraDiagram() {
  const W = 720, H = 380;
  const groundY = 320;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara compares a known-number box with an unknown variable box labeled x">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two boxes, one mystery
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          A variable is a box waiting to be filled.
        </text>

        {/* Tara on left */}
        <Tara x={120} y={groundY} scale={1.0} pose="pointing" />

        {/* KNOWN box */}
        <g transform="translate(280, 200)">
          {/* Box body */}
          <rect x="0" y="0" width="100" height="90" rx="6" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="2" className="dark:fill-blue-900/40" />
          {/* Lid */}
          <rect x="-4" y="-8" width="108" height="14" rx="3" fill="#7dd3fc" stroke="#0c4a6e" strokeWidth="2" />
          {/* Big number */}
          <text x="50" y="56" textAnchor="middle" fontSize="42" fontWeight="700" fill="#0c4a6e" className="dark:fill-blue-200">5</text>
          {/* Label below */}
          <text x="50" y="116" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">A known number</text>
          <text x="50" y="132" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">"It is 5."</text>
        </g>

        {/* UNKNOWN box (variable x) */}
        <g transform="translate(480, 200)">
          {/* Box body — with "?" pattern */}
          <rect x="0" y="0" width="100" height="90" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="2" className="dark:fill-amber-900/40" />
          {/* Lid — with sparkles to suggest mystery */}
          <rect x="-4" y="-8" width="108" height="14" rx="3" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          {/* Big "x" */}
          <text x="50" y="60" textAnchor="middle" fontSize="48" fontWeight="700" fill="#92400e" fontStyle="italic" className="dark:fill-amber-200">x</text>
          {/* Question marks scattered */}
          <text x="20" y="30" fontSize="14" fill="#dc2626" opacity="0.6">?</text>
          <text x="78" y="40" fontSize="14" fill="#dc2626" opacity="0.6">?</text>
          <text x="14" y="80" fontSize="14" fill="#dc2626" opacity="0.6">?</text>
          {/* Label below */}
          <text x="50" y="116" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">An unknown number</text>
          <text x="50" y="132" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">"It could be anything."</text>
        </g>

        {/* Speech bubble from Tara */}
        <path d={`M 200 230 L 220 220 L 220 235 Z`} fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <rect x="216" y="180" width="58" height="44" rx="14" fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="245" y="198" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">If x is</text>
        <text x="245" y="214" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">a number...</text>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 30} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          ...then 3x + 2 means: triple it, add 2. One rule, infinitely many answers.
        </text>
      </svg>
    </div>
  );
}
