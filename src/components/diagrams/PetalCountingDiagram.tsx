/**
 * Tara examines five flowers with petal counts that follow Fibonacci:
 * 3 (lily), 5 (buttercup), 8 (delphinium), 13 (marigold), 21 (daisy).
 * Each flower drawn with the right number of petals.
 *
 * Used in the Fibonacci section as a "go count for yourself" visual.
 */
import Tara from './people/Tara';

export default function PetalCountingDiagram() {
  const W = 760, H = 420;
  const groundY = 340;

  const flowers = [
    { name: 'Lily',      petals: 3,  color: '#f97316', x: 230 },
    { name: 'Buttercup', petals: 5,  color: '#facc15', x: 350 },
    { name: 'Delphinium',petals: 8,  color: '#a855f7', x: 470 },
    { name: 'Marigold',  petals: 13, color: '#f59e0b', x: 590 },
    { name: 'Daisy',     petals: 21, color: '#fef3c7', x: 700 },
  ];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Five flowers with Fibonacci petal counts: 3, 5, 8, 13, 21">

        <defs>
          <linearGradient id="sky-pc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dbeafe" />
            <stop offset="1" stopColor="#fef9c3" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-pc)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Count the petals
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Almost every flower has a Fibonacci number of petals.
        </text>

        {/* Tara on left */}
        <Tara x={100} y={groundY} scale={1.1} pose="pointing" />

        {/* Each flower */}
        {flowers.map((f, i) => {
          const fcx = f.x;
          const fcy = 200;
          const stemTop = fcy + 30;
          const petalLen = f.petals > 13 ? 18 : f.petals > 5 ? 22 : 26;
          const petalRx = f.petals > 13 ? 4 : 6;
          return (
            <g key={f.name}>
              {/* Stem */}
              <line x1={fcx} y1={stemTop} x2={fcx} y2={groundY} stroke="#16a34a" strokeWidth="2.5" className="dark:stroke-green-600" />
              {/* Leaf */}
              <ellipse cx={fcx - 8} cy={(stemTop + groundY) / 2} rx="10" ry="5"
                fill="#22c55e" stroke="#14532d" strokeWidth="0.8"
                transform={`rotate(-25, ${fcx - 8}, ${(stemTop + groundY) / 2})`} className="dark:fill-green-600" />
              {/* Petals */}
              {Array.from({ length: f.petals }).map((_, k) => {
                const angle = (k * 360) / f.petals;
                const ar = (angle * Math.PI) / 180;
                const px = fcx + petalLen * Math.cos(ar - Math.PI / 2);
                const py = fcy + petalLen * Math.sin(ar - Math.PI / 2);
                return (
                  <ellipse key={k} cx={px} cy={py} rx={petalRx} ry={petalLen * 0.55}
                    fill={f.color} stroke="#a16207" strokeWidth="0.6"
                    transform={`rotate(${angle}, ${px}, ${py})`} />
                );
              })}
              {/* Centre */}
              <circle cx={fcx} cy={fcy} r={f.petals > 13 ? 8 : 7} fill="#7c2d12" stroke="#451a03" strokeWidth="0.8" />
              {/* Petal-count badge */}
              <circle cx={fcx} cy={fcy} r={f.petals > 13 ? 7 : 6} fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
              <text x={fcx} y={fcy + 4} textAnchor="middle" fontSize={f.petals > 13 ? 9 : 10} fontWeight="700" fill="#92400e">{f.petals}</text>
              {/* Name below */}
              <text x={fcx} y={groundY + 18} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b" className="dark:fill-gray-100">{f.name}</text>
              <text x={fcx} y={groundY + 34} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">
                {f.petals} petals
              </text>
            </g>
          );
        })}

        {/* Footer Fibonacci sequence — pushed below the flower-name labels */}
        <rect x={W / 2 - 240} y={H - 28} width="480" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 13} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Fibonacci: 1, 1, 2, <tspan fill="#f97316">3</tspan>, <tspan fill="#facc15">5</tspan>, <tspan fill="#a855f7">8</tspan>, <tspan fill="#f59e0b">13</tspan>, <tspan fill="#92400e">21</tspan>, 34, 55, ...
        </text>
      </svg>
    </div>
  );
}
