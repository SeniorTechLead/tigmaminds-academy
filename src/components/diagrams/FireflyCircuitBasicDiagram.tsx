export default function FireflyCircuitBasicDiagram() {
  const w = 520, h = 340;

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Basic LED circuit: battery to resistor to LED to ground with Ohm's Law">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">Your First Circuit: One LED, One Resistor</text>

        {/* Circuit loop */}
        <rect x="80" y="60" width="360" height="200" rx="10" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" strokeDasharray="6 3" />

        {/* Battery (top-left) */}
        <rect x="60" y="50" width="80" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="85" y1="62" x2="85" y2="78" stroke="#f59e0b" strokeWidth="3" />
        <line x1="95" y1="66" x2="95" y2="74" stroke="#f59e0b" strokeWidth="2" />
        <text x="115" y="74" fill="#fbbf24" fontSize="10" fontWeight="600">9V</text>
        <text x="100" y="48" className="fill-gray-500 dark:fill-slate-400" fontSize="9" textAnchor="middle">Battery</text>

        {/* Current arrow along top */}
        <line x1="150" y1="70" x2="220" y2="70" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#fireflyArrow)" />
        <text x="185" y="62" textAnchor="middle" fill="#4ade80" fontSize="9">current →</text>

        {/* Resistor (top-right area) */}
        <rect x="230" y="55" width="90" height="30" rx="5" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Zigzag inside resistor */}
        <polyline points="240,70 248,60 256,80 264,60 272,80 280,60 288,80 296,60 310,70" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="275" y="50" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="600">220 Ω Resistor</text>

        {/* Wire top-right to LED */}
        <line x1="320" y1="70" x2="420" y2="70" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="420" y1="70" x2="420" y2="120" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* LED (right side) */}
        <polygon points="407,120 433,120 420,155" fill="#4ade80" opacity="0.8" />
        <line x1="407" y1="155" x2="433" y2="155" stroke="#22c55e" strokeWidth="2" />
        <text x="448" y="135" fill="#4ade80" fontSize="10" fontWeight="600">LED</text>
        <text x="448" y="148" className="fill-gray-500 dark:fill-slate-400" fontSize="9">~2V drop</text>

        {/* Glow around LED */}
        <circle cx="420" cy="137" r="25" fill="#4ade80" opacity="0.08" />
        <circle cx="420" cy="137" r="16" fill="#4ade80" opacity="0.12" />

        {/* Wire LED to ground */}
        <line x1="420" y1="155" x2="420" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* Ground (bottom-right) */}
        <line x1="405" y1="260" x2="435" y2="260" stroke="#94a3b8" strokeWidth="2" />
        <line x1="410" y1="267" x2="430" y2="267" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="415" y1="274" x2="425" y2="274" stroke="#94a3b8" strokeWidth="1" />
        <text x="420" y="290" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">GND (0V)</text>

        {/* Wire ground back to battery */}
        <line x1="405" y1="260" x2="100" y2="260" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />
        <line x1="100" y1="260" x2="100" y2="90" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="2" />

        {/* Voltage labels */}
        <text x="100" y="115" fill="#fbbf24" fontSize="9" textAnchor="middle">9V</text>
        <text x="340" y="115" fill="#fbbf24" fontSize="9" textAnchor="middle">2V</text>
        <text x="100" y="240" className="fill-gray-500 dark:fill-slate-400" fontSize="9" textAnchor="middle">0V</text>

        {/* Ohm's Law box */}
        <rect x="120" y="140" width="200" height="80" rx="8" className="fill-white dark:fill-slate-950" stroke="#f59e0b" strokeWidth="1" />
        <text x="220" y="162" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="700">Ohm's Law: V = I × R</text>
        <text x="220" y="180" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Voltage across resistor = 9V − 2V = 7V</text>
        <text x="220" y="196" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Current I = 7V ÷ 220Ω ≈ 32 mA</text>
        <text x="220" y="212" textAnchor="middle" fill="#4ade80" fontSize="10">The resistor protects the LED!</text>

        {/* Arrow marker */}
        <defs>
          <marker id="fireflyArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#4ade80" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
