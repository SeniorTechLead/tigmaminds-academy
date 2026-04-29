/**
 * Tara looks at a wall clock at 10 o'clock. "What time will it be in 5 hours?"
 * Not 15 — clocks wrap around every 12. 10 + 5 = 15 ≡ 3 (mod 12), so the
 * answer is 3 o'clock. This is modular arithmetic in disguise.
 *
 * Visual: a wall clock with hour hand at 10, an arrow sweeping through
 * 11, 12, 1, 2, 3 (5 steps forward), landing at 3.
 *
 * Used in the Modular Arithmetic section.
 */
import Tara from './people/Tara';

export default function ClockArithmeticDiagram() {
  const W = 720, H = 380;

  // Clock geometry
  const cx = 460, cy = 200;
  const r = 110;

  // Hour positions (12 o'clock at top, going clockwise)
  const hourPos = (h: number) => {
    const angle = ((h - 3) * 30 - 360) * (Math.PI / 180); // 0 hour = 3-o'clock for math, but we want 12 at top
    // Conventional: 12 at top means hour h is at angle = -90° + h*30° (clockwise)
    const ang = (-90 + h * 30) * (Math.PI / 180);
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  };

  // Hour hand pointing to 10
  const hand10 = (() => {
    const ang = (-90 + 10 * 30) * (Math.PI / 180);
    const len = r * 0.55;
    return { x: cx + len * Math.cos(ang), y: cy + len * Math.sin(ang) };
  })();

  // After-add hour hand pointing to 3
  const hand3 = (() => {
    const ang = (-90 + 3 * 30) * (Math.PI / 180);
    const len = r * 0.55;
    return { x: cx + len * Math.cos(ang), y: cy + len * Math.sin(ang) };
  })();

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="It is 10 o'clock; what time is it 5 hours later? Mod-12 arithmetic on a clock face">

        <defs>
          <linearGradient id="wall-clk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef9c3" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#wall-clk)" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Clock arithmetic is modular arithmetic
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          10 + 5 = 15 — but on a clock that wraps to 3.
        </text>

        {/* Tara on left, looking thoughtful at the clock */}
        <Tara x={120} y={350} scale={1.1} pose="thinking" />

        {/* Speech bubble above Tara's head — out of the way of the clock face */}
        <path d={`M 110 245 L 130 240 L 130 252 Z`} fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <rect x="20" y="195" width="240" height="50" rx="14" fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-700 dark:stroke-gray-500" />
        <text x="140" y="216" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          It is 10 o'clock now.
        </text>
        <text x="140" y="234" textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          What time will it be in 5 hours?
        </text>

        {/* Clock face */}
        <circle cx={cx} cy={cy} r={r + 8} fill="#1e293b" />
        <circle cx={cx} cy={cy} r={r} fill="white" stroke="#0f172a" strokeWidth="2" className="dark:fill-gray-200" />

        {/* Hour numerals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const h = i === 0 ? 12 : i;
          const p = hourPos(h);
          // Pull labels slightly toward centre
          const ang = (-90 + h * 30) * (Math.PI / 180);
          const lx = cx + (r - 18) * Math.cos(ang);
          const ly = cy + (r - 18) * Math.sin(ang);
          const isStart = h === 10;
          const isEnd = h === 3;
          return (
            <g key={h}>
              {(isStart || isEnd) && (
                <circle cx={lx} cy={ly} r="14"
                  fill={isStart ? '#dbeafe' : '#fef3c7'}
                  stroke={isStart ? '#3b82f6' : '#f59e0b'} strokeWidth="2" />
              )}
              <text x={lx} y={ly + 5} textAnchor="middle" fontSize="14" fontWeight="700"
                fill={isStart ? '#1d4ed8' : isEnd ? '#92400e' : '#0f172a'}>
                {h}
              </text>
              {/* Tick marks at each hour */}
              <line
                x1={cx + (r - 4) * Math.cos(ang)} y1={cy + (r - 4) * Math.sin(ang)}
                x2={cx + r * Math.cos(ang)} y2={cy + r * Math.sin(ang)}
                stroke="#0f172a" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Original hour hand (faded, pointing to 10) */}
        <line x1={cx} y1={cy} x2={hand10.x} y2={hand10.y}
          stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        {/* New hour hand (pointing to 3) */}
        <line x1={cx} y1={cy} x2={hand3.x} y2={hand3.y}
          stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

        {/* Arrow showing the +5 sweep, going from 10 → 11 → 12 → 1 → 2 → 3 */}
        {[11, 12, 1, 2, 3].map((h, i) => {
          const fromAng = (-90 + (h - 1) * 30) * (Math.PI / 180);
          const toAng = (-90 + h * 30) * (Math.PI / 180);
          const r2 = r + 18;
          const x1 = cx + r2 * Math.cos(fromAng);
          const y1 = cy + r2 * Math.sin(fromAng);
          const x2 = cx + r2 * Math.cos(toAng);
          const y2 = cy + r2 * Math.sin(toAng);
          const isLast = i === 4;
          return (
            <g key={h}>
              <path d={`M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2}`}
                fill="none" stroke="#16a34a" strokeWidth="2.5"
                markerEnd={isLast ? 'url(#arrowEnd-clk)' : ''} />
            </g>
          );
        })}
        <defs>
          <marker id="arrowEnd-clk" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#16a34a" />
          </marker>
        </defs>

        {/* Centre pin */}
        <circle cx={cx} cy={cy} r="5" fill="#1e293b" />

        {/* Math note below clock */}
        <rect x={cx - 130} y={H - 60} width="260" height="42" rx="8"
          fill="white" stroke="#94a3b8" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-500" />
        <text x={cx} y={H - 42} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          10 + 5 = 15 ≡ 3 (mod 12)
        </text>
        <text x={cx} y={H - 26} textAnchor="middle" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          The clock subtracts 12 if you go past it.
        </text>
      </svg>
    </div>
  );
}
