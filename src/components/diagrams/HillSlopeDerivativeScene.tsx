/**
 * Tara walks up a hill. At any point along the path, the *slope* of the
 * hill at that exact spot is the derivative. Steep on the way up, flat at
 * the top, downward after. Visual: hill profile with slope arrows at
 * different points.
 *
 * Used in the Derivatives section.
 */
import Tara from './people/Tara';

export default function HillSlopeDerivativeScene() {
  const W = 760, H = 380;
  const groundY = 320;

  // Hill curve: y = 200 - 6 * (x - 380)^2 / 200, clamped
  // Approximate by quadratic from (160, 320) up to (380, 130) down to (600, 320)
  const hillY = (x: number) => {
    const dx = x - 380;
    return Math.max(140, 320 - (190 - dx * dx / 250));
  };

  // Three sample points along the hill
  const samples = [
    { x: 220, label: 'climbing', slopeMark: 'positive', tilt: -25 },
    { x: 380, label: 'top', slopeMark: 'zero', tilt: 0 },
    { x: 540, label: 'descending', slopeMark: 'negative', tilt: 25 },
  ];

  // Build the hill path
  const hillPoints: string[] = [];
  for (let x = 160; x <= 600; x += 4) {
    hillPoints.push(`${x},${hillY(x)}`);
  }
  hillPoints.unshift(`160,${groundY}`);
  hillPoints.push(`600,${groundY}`);

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara walks up a hill: the derivative is the slope at each point — steep climb, flat at top, downward descent">

        <defs>
          <linearGradient id="sky-hd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-hd)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#a16207" opacity="0.4" className="dark:fill-amber-900" />

        {/* Caption */}
        <rect x="20" y="14" width="290" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          The slope at every point of the hill
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          That&apos;s the derivative.
        </text>

        {/* Hill */}
        <polygon points={hillPoints.join(' ')} fill="#65a30d" stroke="#3f6212" strokeWidth="2" className="dark:fill-green-800" />
        {/* Grass detail */}
        {[200, 280, 360, 440, 520].map((gx, i) => (
          <line key={i} x1={gx} y1={hillY(gx)} x2={gx + 2} y2={hillY(gx) - 8} stroke="#3f6212" strokeWidth="1" />
        ))}

        {/* Tangent lines (slopes) at each sample */}
        {samples.map((s, i) => {
          const y = hillY(s.x);
          const tilt = s.tilt;
          const len = 50;
          const ar = (tilt * Math.PI) / 180;
          const x1 = s.x - len * Math.cos(ar);
          const y1 = y - len * Math.sin(ar);
          const x2 = s.x + len * Math.cos(ar);
          const y2 = y + len * Math.sin(ar);
          const colour = tilt < 0 ? '#16a34a' : tilt > 0 ? '#dc2626' : '#f59e0b';
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth="3" strokeLinecap="round" />
              <circle cx={s.x} cy={y} r="5" fill="white" stroke={colour} strokeWidth="2" />
              {/* Slope label */}
              <rect x={s.x - 38} y={y - 56} width="76" height="22" rx="11"
                fill="white" stroke={colour} strokeWidth="1.2" className="dark:fill-gray-800" />
              <text x={s.x} y={y - 41} textAnchor="middle" fontSize="10" fontWeight="700" fill={colour}>
                slope {s.slopeMark}
              </text>
            </g>
          );
        })}

        {/* Tara at the bottom of the hill */}
        <Tara x={120} y={groundY} scale={0.85} pose="lookingUp" />

        {/* Bottom annotation panel */}
        <rect x={W / 2 - 250} y={H - 32} width="500" height="26" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Derivative f&apos;(x): the slope of f at each x. <tspan fill="#16a34a">+ on the way up</tspan>, <tspan fill="#f59e0b">0 at the peak</tspan>, <tspan fill="#dc2626">− on the way down</tspan>.
        </text>
      </svg>
    </div>
  );
}
