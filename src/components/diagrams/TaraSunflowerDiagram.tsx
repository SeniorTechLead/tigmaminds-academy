/**
 * Tara holds up a sunflower and discovers two interlocking spiral families
 * in the seed head — 21 spirals one way, 34 the other. Both Fibonacci.
 *
 * Used to open the "Mathematics is the language of nature" section.
 */
import Tara from './people/Tara';

export default function TaraSunflowerDiagram() {
  const W = 720, H = 380;
  const groundY = 320;

  // Sunflower at top right
  const sCx = 480, sCy = 180;
  const seedR = 90;
  const numSeeds = 200;
  const phi = (1 + Math.sqrt(5)) / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

  // Generate seed positions in golden-angle spiral
  const seeds = Array.from({ length: numSeeds }, (_, i) => {
    const r = seedR * Math.sqrt(i / numSeeds);
    const a = i * goldenAngle;
    return { x: sCx + r * Math.cos(a), y: sCy + r * Math.sin(a), r };
  });

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="Tara holds a sunflower; the seed spirals come in Fibonacci numbers — 21 and 34">

        <defs>
          <linearGradient id="sky-sf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={groundY} fill="url(#sky-sf)" className="dark:hidden" />
        <rect x="0" y="0" width={W} height={groundY} fill="#0f172a" className="hidden dark:block" />
        <rect x="0" y={groundY} width={W} height={H - groundY} fill="#84cc16" opacity="0.6" className="dark:fill-emerald-900" />

        {/* Caption */}
        <rect x="20" y="14" width="280" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Why does this sunflower have spirals?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Count them. Both numbers are Fibonacci.
        </text>

        {/* Tara on left, looking at the sunflower */}
        <Tara x={130} y={groundY} scale={1.2} pose="lookingUp" />

        {/* Sunflower stem */}
        <path d={`M ${sCx - 4} ${groundY} L ${sCx - 4} ${sCy + seedR + 14} L ${sCx + 4} ${sCy + seedR + 14} L ${sCx + 4} ${groundY} Z`}
          fill="#16a34a" stroke="#14532d" strokeWidth="1" className="dark:fill-green-700" />

        {/* Leaf */}
        <ellipse cx={sCx - 30} cy={sCy + seedR + 60} rx="26" ry="14" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" transform={`rotate(-30, ${sCx - 30}, ${sCy + seedR + 60})`} className="dark:fill-green-600" />
        <ellipse cx={sCx + 35} cy={sCy + seedR + 90} rx="22" ry="12" fill="#16a34a" stroke="#14532d" strokeWidth="1.2" transform={`rotate(35, ${sCx + 35}, ${sCy + seedR + 90})`} className="dark:fill-green-700" />

        {/* Sunflower petals — yellow ovals around the seed head */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 360) / 24;
          const ar = (a * Math.PI) / 180;
          const px = sCx + (seedR + 26) * Math.cos(ar);
          const py = sCy + (seedR + 26) * Math.sin(ar);
          return (
            <ellipse key={i} cx={px} cy={py} rx="22" ry="9"
              fill="#facc15" stroke="#a16207" strokeWidth="1"
              transform={`rotate(${a}, ${px}, ${py})`} />
          );
        })}

        {/* Seed-head — brown disc with golden-angle seed pattern */}
        <circle cx={sCx} cy={sCy} r={seedR + 4} fill="#7c2d12" stroke="#451a03" strokeWidth="1.5" />
        {/* Seeds */}
        {seeds.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r="2.4" fill="#1c1917" />
        ))}

        {/* Two highlighted spirals — one orange (clockwise), one cyan (counter-clockwise) */}
        {/* Orange clockwise: pick every 13th seed (Fibonacci) */}
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i < numSeeds; i += 13) {
            pts.push(`${seeds[i].x},${seeds[i].y}`);
          }
          return <polyline points={pts.join(' ')} fill="none" stroke="#f97316" strokeWidth="2" opacity="0.85" />;
        })()}
        {/* Cyan counter-clockwise: every 21st seed */}
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i < numSeeds; i += 21) {
            pts.push(`${seeds[i].x},${seeds[i].y}`);
          }
          return <polyline points={pts.join(' ')} fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.85" />;
        })()}

        {/* Speech bubble from Tara — to her right */}
        <path d={`M 200 230 L 210 220 L 210 235 Z`} fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <rect x="208" y="184" width="170" height="50" rx="14" fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="293" y="204" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          21 spirals one way,
        </text>
        <text x="293" y="220" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          34 the other!
        </text>

        {/* Footer fact */}
        <rect x={W / 2 - 220} y={H - 36} width="440" height="24" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          21 and 34 are consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, <tspan fill="#06b6d4">21</tspan>, <tspan fill="#f97316">34</tspan>, 55, ...)
        </text>
      </svg>
    </div>
  );
}
