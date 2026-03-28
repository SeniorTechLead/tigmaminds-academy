export default function RainbowRaindropDiagram() {
  const cx = 200;
  const cy = 130;
  const r = 65;

  return (
    <div className="bg-gray-900 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Inside a Raindrop — How a Rainbow Forms
      </p>
      <svg viewBox="0 0 440 260" className="w-full max-w-md mx-auto">
        {/* Raindrop (large circle) */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(100,180,255,0.1)" stroke="rgba(100,180,255,0.4)" strokeWidth={2} />
        <text x={cx} y={cy - r - 10} textAnchor="middle" className="text-[9px]" fill="#94a3b8">Raindrop</text>

        {/* Step 1: White light enters — refraction */}
        <line x1="40" y1="100" x2={cx - r + 10} y2="105" stroke="white" strokeWidth={2.5} opacity={0.7} />
        <text x="40" y="92" className="text-[8px]" fill="white">White light →</text>

        {/* Entry point */}
        <circle cx={cx - r + 10} cy={105} r={3} fill="#fbbf24" />

        {/* Step 1 label */}
        <rect x="10" y="30" width="100" height="28" rx="6" fill="rgba(251,191,36,0.15)" />
        <text x="60" y="43" textAnchor="middle" className="text-[8px] font-bold" fill="#fbbf24">1. Refraction</text>
        <text x="60" y="53" textAnchor="middle" className="text-[7px]" fill="#d4a017">Light bends entering</text>

        {/* Refracted rays inside drop — splitting into colors */}
        <line x1={cx - r + 12} y1={106} x2={cx + 20} y2={cy + r - 20} stroke="#ef4444" strokeWidth={1.5} opacity={0.7} />
        <line x1={cx - r + 12} y1={105} x2={cx + 15} y2={cy + r - 15} stroke="#f97316" strokeWidth={1.2} opacity={0.6} />
        <line x1={cx - r + 12} y1={104} x2={cx + 10} y2={cy + r - 10} stroke="#eab308" strokeWidth={1.2} opacity={0.6} />
        <line x1={cx - r + 12} y1={103} x2={cx + 5} y2={cy + r - 8} stroke="#22c55e" strokeWidth={1.2} opacity={0.5} />
        <line x1={cx - r + 12} y1={102} x2={cx} y2={cy + r - 5} stroke="#3b82f6" strokeWidth={1.2} opacity={0.5} />
        <line x1={cx - r + 12} y1={101} x2={cx - 5} y2={cy + r - 3} stroke="#8b5cf6" strokeWidth={1.2} opacity={0.4} />

        {/* Step 2: Reflection at back of drop */}
        <circle cx={cx + 10} cy={cy + r - 15} r={3} fill="rgba(255,255,255,0.5)" />

        <rect x="280" y="170" width="100" height="28" rx="6" fill="rgba(255,255,255,0.1)" />
        <text x="330" y="183" textAnchor="middle" className="text-[8px] font-bold" fill="white">2. Reflection</text>
        <text x="330" y="193" textAnchor="middle" className="text-[7px]" fill="#94a3b8">Bounces off back wall</text>

        {/* Reflected rays going back */}
        <line x1={cx + 18} y1={cy + r - 20} x2={cx - 25} y2={cy - r + 25} stroke="#ef4444" strokeWidth={1.5} opacity={0.7} />
        <line x1={cx + 13} y1={cy + r - 15} x2={cx - 30} y2={cy - r + 22} stroke="#f97316" strokeWidth={1.2} opacity={0.6} />
        <line x1={cx + 8} y1={cy + r - 10} x2={cx - 35} y2={cy - r + 20} stroke="#eab308" strokeWidth={1.2} opacity={0.5} />
        <line x1={cx + 3} y1={cy + r - 8} x2={cx - 38} y2={cy - r + 18} stroke="#22c55e" strokeWidth={1.2} opacity={0.5} />
        <line x1={cx - 2} y1={cy + r - 5} x2={cx - 42} y2={cy - r + 16} stroke="#3b82f6" strokeWidth={1.2} opacity={0.5} />
        <line x1={cx - 7} y1={cy + r - 3} x2={cx - 45} y2={cy - r + 14} stroke="#8b5cf6" strokeWidth={1.2} opacity={0.4} />

        {/* Step 3: Refraction exiting — colors separate further */}
        <circle cx={cx - 30} cy={cy - r + 22} r={3} fill="#fbbf24" />

        <rect x="10" y="180" width="120" height="28" rx="6" fill="rgba(251,191,36,0.15)" />
        <text x="70" y="193" textAnchor="middle" className="text-[8px] font-bold" fill="#fbbf24">3. Refraction (exit)</text>
        <text x="70" y="203" textAnchor="middle" className="text-[7px]" fill="#d4a017">Colors spread apart more</text>

        {/* Exiting colored rays — spread out */}
        <line x1={cx - 32} y1={cy - r + 24} x2="350" y2="40" stroke="#ef4444" strokeWidth={2} opacity={0.8} />
        <line x1={cx - 35} y1={cy - r + 21} x2="355" y2="52" stroke="#f97316" strokeWidth={1.8} opacity={0.7} />
        <line x1={cx - 38} y1={cy - r + 19} x2="358" y2="64" stroke="#eab308" strokeWidth={1.5} opacity={0.7} />
        <line x1={cx - 41} y1={cy - r + 17} x2="360" y2="76" stroke="#22c55e" strokeWidth={1.5} opacity={0.6} />
        <line x1={cx - 44} y1={cy - r + 15} x2="362" y2="88" stroke="#3b82f6" strokeWidth={1.5} opacity={0.6} />
        <line x1={cx - 47} y1={cy - r + 13} x2="363" y2="100" stroke="#8b5cf6" strokeWidth={1.5} opacity={0.5} />

        {/* Color labels */}
        <text x="370" y="42" className="text-[8px] font-semibold" fill="#ef4444">Red (42°)</text>
        <text x="375" y="66" className="text-[7px]" fill="#f97316">Orange</text>
        <text x="378" y="78" className="text-[7px]" fill="#eab308">Yellow</text>
        <text x="380" y="90" className="text-[7px]" fill="#22c55e">Green</text>
        <text x="382" y="102" className="text-[7px]" fill="#3b82f6">Blue</text>
        <text x="383" y="108" className="text-[8px] font-semibold" fill="#8b5cf6">Violet (40°)</text>

        {/* Summary */}
        <text x="220" y="240" textAnchor="middle" className="text-[9px]" fill="#fbbf24">
          Refract → Reflect → Refract = white light splits into a rainbow
        </text>
        <text x="220" y="253" textAnchor="middle" className="text-[8px]" fill="#94a3b8">
          Each color exits at a slightly different angle — red at 42°, violet at 40°
        </text>
      </svg>
    </div>
  );
}
