export default function RainbowRaindropDiagram() {
  const cx = 250;
  const cy = 170;
  const r = 85;

  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
        Inside a Raindrop — How a Rainbow Forms
      </p>
      <svg viewBox="0 0 680 380" className="w-full max-w-xl mx-auto">
        {/* Raindrop */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(100,180,255,0.08)" stroke="rgba(100,180,255,0.4)" strokeWidth={2.5} />
        <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Raindrop</text>

        {/* Step 1: White light enters */}
        <line x1="40" y1="130" x2={cx - r + 12} y2="138" stroke="white" strokeWidth={3} opacity={0.7} />
        <text x="40" y="118" fontSize="11" fill="white">White light →</text>

        <circle cx={cx - r + 12} cy={138} r={4} fill="#fbbf24" />

        {/* Step 1 label */}
        <rect x="10" y="35" width="140" height="38" rx="6" fill="rgba(251,191,36,0.12)" />
        <text x="80" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">1. Refraction</text>
        <text x="80" y="66" textAnchor="middle" fontSize="10" fill="#d4a017">Light bends on entry</text>

        {/* Refracted rays inside — splitting into colors */}
        {[
          { dy: 0, color: '#ef4444', w: 2 },
          { dy: -1, color: '#f97316', w: 1.5 },
          { dy: -2, color: '#eab308', w: 1.5 },
          { dy: -3, color: '#22c55e', w: 1.5 },
          { dy: -4, color: '#3b82f6', w: 1.5 },
          { dy: -5, color: '#8b5cf6', w: 1.2 },
        ].map((ray, i) => (
          <line key={`in-${i}`}
            x1={cx - r + 14} y1={138 + ray.dy}
            x2={cx + 25 - i * 5} y2={cy + r - 25 + i * 3}
            stroke={ray.color} strokeWidth={ray.w} opacity={0.6}
          />
        ))}

        {/* Step 2: Reflection at back */}
        <circle cx={cx + 15} cy={cy + r - 18} r={4} fill="rgba(255,255,255,0.5)" />

        <rect x="370" y="220" width="145" height="38" rx="6" fill="rgba(255,255,255,0.08)" />
        <text x="442" y="237" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">2. Reflection</text>
        <text x="442" y="251" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Bounces off back wall</text>

        {/* Reflected rays back */}
        {[
          { sx: 22, sy: -25, ex: -30, ey: 30, color: '#ef4444', w: 2 },
          { sx: 17, sy: -20, ex: -36, ey: 27, color: '#f97316', w: 1.5 },
          { sx: 12, sy: -15, ex: -42, ey: 24, color: '#eab308', w: 1.5 },
          { sx: 7, sy: -12, ex: -46, ey: 21, color: '#22c55e', w: 1.5 },
          { sx: 2, sy: -8, ex: -52, ey: 18, color: '#3b82f6', w: 1.5 },
          { sx: -3, sy: -5, ex: -56, ey: 15, color: '#8b5cf6', w: 1.2 },
        ].map((ray, i) => (
          <line key={`ref-${i}`}
            x1={cx + ray.sx} y1={cy + r + ray.sy}
            x2={cx + ray.ex} y2={cy - r + ray.ey}
            stroke={ray.color} strokeWidth={ray.w} opacity={0.5}
          />
        ))}

        {/* Step 3: Exit refraction */}
        <circle cx={cx - 36} cy={cy - r + 27} r={4} fill="#fbbf24" />

        <rect x="10" y="240" width="160" height="38" rx="6" fill="rgba(251,191,36,0.12)" />
        <text x="90" y="257" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">3. Refraction (exit)</text>
        <text x="90" y="271" textAnchor="middle" fontSize="10" fill="#d4a017">Colours spread apart more</text>

        {/* Exiting colored rays */}
        {[
          { ex: 480, ey: 42, color: '#ef4444', w: 2.5 },
          { ex: 485, ey: 60, color: '#f97316', w: 2 },
          { ex: 490, ey: 78, color: '#eab308', w: 2 },
          { ex: 495, ey: 96, color: '#22c55e', w: 2 },
          { ex: 498, ey: 114, color: '#3b82f6', w: 2 },
          { ex: 500, ey: 132, color: '#8b5cf6', w: 1.8 },
        ].map((ray, i) => (
          <line key={`out-${i}`}
            x1={cx - 38 - i * 3} y1={cy - r + 25 + i * 2}
            x2={ray.ex} y2={ray.ey}
            stroke={ray.color} strokeWidth={ray.w} opacity={0.7}
          />
        ))}

        {/* Color labels — well spaced */}
        <text x="510" y="46" fontSize="12" fontWeight="600" fill="#ef4444">Red (42°)</text>
        <text x="515" y="64" fontSize="11" fill="#f97316">Orange</text>
        <text x="518" y="82" fontSize="11" fill="#eab308">Yellow</text>
        <text x="522" y="100" fontSize="11" fill="#22c55e">Green</text>
        <text x="525" y="118" fontSize="11" fill="#3b82f6">Blue</text>
        <text x="528" y="138" fontSize="12" fontWeight="600" fill="#8b5cf6">Violet (40°)</text>

        {/* Summary */}
        <rect x="100" y="310" width="480" height="48" rx="8" fill="rgba(251,191,36,0.08)" />
        <text x="340" y="332" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fbbf24">
          Refract → Reflect → Refract = white light splits into a rainbow
        </text>
        <text x="340" y="349" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Each colour exits at a slightly different angle — red at 42°, violet at 40°
        </text>
      </svg>
    </div>
  );
}
