/**
 * Tara has 4 teacups in different colours and wants to arrange them on a
 * tray. How many distinct orderings? 4! = 24. Visual: a row of trays
 * showing a few permutations, with the count.
 *
 * Used in the Permutations and Combinations section.
 */
import Tara from './people/Tara';

export default function ArrangingTeacupsScene() {
  const W = 760, H = 380;
  const groundY = 320;

  // Four cup colours
  const colours = ['#dc2626', '#16a34a', '#3b82f6', '#facc15'];
  const orderings = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [1, 0, 2, 3],
    [3, 2, 1, 0],
  ];

  const Cup = ({ x, y, color }: { x: number; y: number; color: string }) => (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -10 0 L -8 16 L 8 16 L 10 0 Z" fill={color} stroke="#0f172a" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="10" ry="3" fill={color} stroke="#0f172a" strokeWidth="1" />
      <path d="M 10 4 q 6 4 0 12" fill="none" stroke="#0f172a" strokeWidth="1.5" />
    </g>
  );

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara arranges 4 teacups: 24 different orderings (4 factorial)">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          How many ways to arrange 4 cups?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Count: 4 × 3 × 2 × 1 = 24.
        </text>

        {/* Tara on left */}
        <Tara x={90} y={groundY} scale={0.9} pose="thinking" />

        {/* Show 4 example orderings on small trays */}
        {orderings.map((order, i) => {
          const trayY = 110 + i * 50;
          const trayX = 270;
          return (
            <g key={i}>
              {/* Tray */}
              <rect x={trayX - 6} y={trayY - 6} width="200" height="44" rx="3"
                fill="#854d0e" stroke="#451a03" strokeWidth="1.5" />
              <rect x={trayX} y={trayY} width="188" height="32" rx="2"
                fill="#fef3c7" stroke="#92400e" strokeWidth="1" />
              {/* Cups */}
              {order.map((c, j) => (
                <Cup key={j} x={trayX + 24 + j * 46} y={trayY + 12} color={colours[c]} />
              ))}
              {/* Number label */}
              <text x={trayX + 200} y={trayY + 22} fontSize="11" fontWeight="600" fill="#475569" className="dark:fill-gray-300">
                #{i + 1}
              </text>
            </g>
          );
        })}

        {/* "...and 20 more" */}
        <text x={370} y="320" textAnchor="middle" fontSize="13" fontWeight="700" fill="#475569" className="dark:fill-gray-300">
          ... and 20 more arrangements
        </text>

        {/* Big count panel on right */}
        <g transform="translate(540, 100)">
          <rect x="0" y="0" width="200" height="180" rx="10"
            fill="white" stroke="#f59e0b" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-amber-400" />
          <text x="100" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
            How many?
          </text>
          <line x1="14" y1="42" x2="186" y2="42" stroke="#cbd5e1" strokeWidth="0.8" />
          <text x="100" y="68" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
            1st cup: 4 choices
          </text>
          <text x="100" y="86" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
            2nd: 3 left
          </text>
          <text x="100" y="104" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
            3rd: 2 left
          </text>
          <text x="100" y="122" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
            4th: 1 left
          </text>
          <text x="100" y="148" textAnchor="middle" fontSize="14" fontWeight="700" fill="#92400e" className="dark:fill-amber-300">
            4 × 3 × 2 × 1 = 4!
          </text>
          <text x="100" y="170" textAnchor="middle" fontSize="20" fontWeight="700" fill="#dc2626">
            = 24
          </text>
        </g>

        {/* Footer */}
        <rect x={W / 2 - 240} y={H - 26} width="480" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          n! (n factorial) counts the arrangements of n distinct things in a row.
        </text>
      </svg>
    </div>
  );
}
