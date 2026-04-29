/**
 * Tara holds two measuring cups: 2 cups of rice flour and 1 cup of jaggery.
 * The 2:1 ratio is the recipe for pitha — Assamese rice cake.
 * Visual: Tara on the left, two stacks (flour 2-cups, jaggery 1-cup) labelled,
 * and the ratio "2 : 1" between them.
 *
 * Used to open the Ratios section.
 */
import Tara from './people/Tara';

export default function PithaRatioDiagram() {
  const W = 720, H = 360;
  const groundY = 320;

  // Cup positions
  const flourX = 320;
  const jaggeryX = 540;
  const cupW = 70, cupH = 80;

  // Cup with measurement marks
  const Cup = ({ x, fillColour, label, contents, count }: { x: number; fillColour: string; label: string; contents: string; count: number }) => {
    const cupTop = groundY - cupH * count - 8;
    return (
      <g>
        {/* Stack 'count' cups vertically */}
        {Array.from({ length: count }).map((_, i) => {
          const yTop = groundY - cupH * (i + 1) - 6;
          return (
            <g key={i}>
              {/* Cup body — trapezoid (wider at top) */}
              <path
                d={`M ${x - cupW / 2 - 4} ${yTop} L ${x + cupW / 2 + 4} ${yTop} L ${x + cupW / 2} ${yTop + cupH - 4} L ${x - cupW / 2} ${yTop + cupH - 4} Z`}
                fill="white" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-700 dark:stroke-gray-400" />
              {/* Contents inside cup */}
              <rect x={x - cupW / 2 + 2} y={yTop + 8} width={cupW - 4} height={cupH - 14} fill={fillColour} stroke="#854d0e" strokeWidth="0.6" opacity="0.85" />
              {/* Cup rim highlight */}
              <ellipse cx={x} cy={yTop + 4} rx={cupW / 2 + 2} ry="3" fill="white" stroke="#475569" strokeWidth="1.5" className="dark:fill-gray-700 dark:stroke-gray-400" />
              {/* Cup count number */}
              <circle cx={x + cupW / 2 + 14} cy={yTop + cupH / 2 - 2} r="11" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
              <text x={x + cupW / 2 + 14} y={yTop + cupH / 2 + 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">{i + 1}</text>
            </g>
          );
        })}

        {/* Label below cup stack */}
        <text x={x} y={groundY + 20} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">{label}</text>
        <text x={x} y={groundY + 36} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">{contents}</text>
      </g>
    );
  };

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara's pitha recipe: 2 cups flour to 1 cup jaggery, a 2 to 1 ratio">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Counter / table top */}
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />
        <line x1="0" y1={groundY} x2={W} y2={groundY} stroke="#854d0e" strokeWidth="1.5" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara's pitha recipe
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          2 cups of rice flour for every 1 cup of jaggery.
        </text>

        {/* Tara */}
        <Tara x={120} y={groundY} scale={1.15} pose="pointing" />

        {/* Two cup stacks: flour (2 cups) and jaggery (1 cup) */}
        <Cup x={flourX} fillColour="#fef3c7" label="Flour" contents="2 cups" count={2} />
        <Cup x={jaggeryX} fillColour="#92400e" label="Jaggery" contents="1 cup" count={1} />

        {/* Big ratio label between them */}
        <rect x={(flourX + jaggeryX) / 2 - 50} y={groundY - 100} width="100" height="50" rx="12"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={(flourX + jaggeryX) / 2} y={groundY - 70} textAnchor="middle" fontSize="22" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          2 : 1
        </text>
        <text x={(flourX + jaggeryX) / 2} y={groundY - 110} textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569" className="dark:fill-gray-300">
          ratio
        </text>

        {/* Connecting lines from cups to ratio */}
        <line x1={flourX + 40} y1={groundY - 130} x2={(flourX + jaggeryX) / 2 - 50} y2={groundY - 80}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1={jaggeryX - 40} y1={groundY - 70} x2={(flourX + jaggeryX) / 2 + 50} y2={groundY - 80}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      </svg>
    </div>
  );
}
