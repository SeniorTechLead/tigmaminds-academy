/**
 * Tara on a swing. Her height-vs-time traces a perfect sine wave. The swing
 * keeps the same period (back-and-forth time) regardless of amplitude.
 * Visual: swing scene on the left, sine wave plot on the right.
 *
 * Used to open the Sine Waves section.
 */
import Tara from './people/Tara';

export default function SwingPendulumScene() {
  const W = 760, H = 380;
  const groundY = 320;

  // Swing pivot
  const pivotX = 200, pivotY = 90;
  const ropeLen = 130;
  // Tara's swing angle (radians from vertical — positive = right)
  const swingAng = -25 * (Math.PI / 180); // shown leaning left at this snapshot
  const taraX = pivotX + ropeLen * Math.sin(swingAng);
  const taraY = pivotY + ropeLen * Math.cos(swingAng);

  // Sine wave on the right
  const gx0 = 410, gx1 = 720, gy0 = 80, gy1 = 280;
  const gyMid = (gy0 + gy1) / 2;
  const gAmp = (gy1 - gy0) / 2 - 16;
  const points: string[] = [];
  for (let p = 0; p <= 1; p += 0.01) {
    const x = gx0 + p * (gx1 - gx0);
    const y = gyMid - gAmp * Math.sin(p * 4 * Math.PI); // 2 cycles
    points.push(`${x},${y}`);
  }

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara on a swing — her position over time traces a sine wave">

        <defs>
          <linearGradient id="sky-sw" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-sw)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Why does a swing sway?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Her position over time is a sine wave.
        </text>

        {/* Swing frame */}
        <line x1={pivotX - 60} y1={groundY} x2={pivotX} y2={pivotY} stroke="#475569" strokeWidth="3" />
        <line x1={pivotX + 60} y1={groundY} x2={pivotX} y2={pivotY} stroke="#475569" strokeWidth="3" />
        <rect x={pivotX - 70} y={pivotY - 4} width="140" height="6" fill="#1e293b" rx="2" />

        {/* Rope */}
        <line x1={pivotX} y1={pivotY} x2={taraX} y2={taraY} stroke="#7c2d12" strokeWidth="2" />
        {/* Seat */}
        <rect x={taraX - 18} y={taraY} width="36" height="6" rx="2" fill="#7c2d12" stroke="#451a03" strokeWidth="1" />

        {/* Tara seated on swing — small */}
        <g transform={`translate(${taraX}, ${taraY})`}>
          <rect x="-9" y="-26" width="18" height="22" rx="3" fill="#f97316" stroke="#1f2937" strokeWidth="1" />
          <ellipse cx="0" cy="-32" rx="8" ry="9" fill="#d9a273" stroke="#1f2937" strokeWidth="1" />
          <path d="M -7 -34 Q -3 -42 0 -42 Q 3 -42 7 -34 Z" fill="#1f1410" stroke="#1f2937" strokeWidth="0.6" />
        </g>

        {/* Arc dotted line showing swing path */}
        <path d={`M ${pivotX - ropeLen * Math.sin(25 * Math.PI / 180)} ${pivotY + ropeLen * Math.cos(25 * Math.PI / 180)} A ${ropeLen} ${ropeLen} 0 0 1 ${pivotX + ropeLen * Math.sin(25 * Math.PI / 180)} ${pivotY + ropeLen * Math.cos(25 * Math.PI / 180)}`}
          fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />

        {/* Sine wave panel */}
        <rect x={gx0 - 14} y={gy0 - 16} width={gx1 - gx0 + 30} height={gy1 - gy0 + 50}
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" rx="6" className="dark:fill-gray-800 dark:stroke-gray-600" />
        {/* Axes */}
        <line x1={gx0 - 6} y1={gyMid} x2={gx1 + 6} y2={gyMid} stroke="#94a3b8" strokeWidth="1" />
        <line x1={gx0} y1={gy0 - 6} x2={gx0} y2={gy1 + 6} stroke="#94a3b8" strokeWidth="1" />
        {/* Wave */}
        <polyline points={points.join(' ')} fill="none" stroke="#f97316" strokeWidth="2.5" />
        <text x={gx1 + 8} y={gyMid + 4} fontSize="10" fill="#475569" className="dark:fill-gray-400">time</text>
        <text x={gx0 - 6} y={gy0 - 8} fontSize="10" fill="#475569" textAnchor="end" className="dark:fill-gray-400">position</text>

        {/* Caption above wave */}
        <text x={(gx0 + gx1) / 2} y={gy0 - 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Tara's height vs time
        </text>

        {/* Footer */}
        <rect x={W / 2 - 250} y={H - 28} width="500" height="22" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          y(t) = A sin(2πt / T) — the swing&apos;s position is the simplest sine wave in physics.
        </text>
      </svg>
    </div>
  );
}
