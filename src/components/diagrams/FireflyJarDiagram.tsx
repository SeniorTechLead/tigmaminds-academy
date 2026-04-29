export default function FireflyJarDiagram() {
  const w = 520, h = 400;

  // LED positions inside the jar
  const leds = [
    { x: 210, y: 130 }, { x: 260, y: 110 }, { x: 300, y: 140 },
    { x: 230, y: 170 }, { x: 280, y: 160 }, { x: 250, y: 200 },
    { x: 210, y: 220 }, { x: 290, y: 210 }, { x: 240, y: 240 },
    { x: 270, y: 250 },
  ];

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="Completed firefly jar project: glass jar with 10 LEDs and Arduino at base">
        <rect width={w} height={h} rx="12" className="fill-slate-900" />

        <text x={w / 2} y="28" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="700">The Firefly Jar Project</text>
        <text x={w / 2} y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">10 LEDs + Arduino + glass jar = firefly jar</text>

        {/* Night sky background inside area */}
        <ellipse cx="260" cy="200" rx="110" ry="150" fill="#020617" opacity="0.5" />

        {/* Glass jar outline */}
        {/* Jar lid */}
        <rect x="220" y="68" width="80" height="15" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
        {/* Jar lid threads */}
        <line x1="225" y1="75" x2="295" y2="75" stroke="#64748b" strokeWidth="0.5" />

        {/* Jar body */}
        <path d="M215,83 Q205,90 200,110 L195,270 Q195,290 220,295 L300,295 Q325,290 325,270 L320,110 Q315,90 305,83 Z" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.6" />

        {/* Glass shine */}
        <path d="M210,100 Q208,150 210,250" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.15" />
        <path d="M215,105 Q213,140 215,200" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.1" />

        {/* LEDs with glow */}
        {leds.map((led, i) => (
          <g key={i}>
            <circle cx={led.x} cy={led.y} r="14" fill="#a3e635" opacity="0.06" />
            <circle cx={led.x} cy={led.y} r="8" fill="#a3e635" opacity="0.12" />
            <circle cx={led.x} cy={led.y} r="3" fill="#a3e635" opacity="0.9" />
          </g>
        ))}

        {/* Wires inside jar going down */}
        {leds.map((led, i) => (
          <line key={i} x1={led.x} y1={led.y + 3} x2={260} y2="300" stroke="#4ade80" strokeWidth="0.4" opacity="0.3" />
        ))}

        {/* Arduino board at base */}
        <rect x="215" y="305" width="90" height="45" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="260" y="322" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="600">Arduino</text>
        <text x="260" y="335" textAnchor="middle" fill="#60a5fa" fontSize="7">Nano</text>

        {/* USB port */}
        <rect x="247" y="350" width="26" height="8" rx="2" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
        <text x="260" y="372" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">USB power</text>

        {/* Component pins on Arduino */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={222 + i * 10} y="302" width="4" height="5" rx="1" fill="#fbbf24" opacity="0.6" />
        ))}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={272 + i * 6} y="302" width="4" height="5" rx="1" fill="#fbbf24" opacity="0.6" />
        ))}

        {/* Labels with leader lines */}
        {/* LED label */}
        <line x1="310" y1="140" x2="370" y2="120" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="375" y="118" fill="#4ade80" fontSize="9">Green LEDs</text>
        <text x="375" y="130" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(5mm diffused)</text>

        {/* Wire label */}
        <line x1="230" y1="270" x2="140" y2="265" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="80" y="260" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Thin wires</text>
        <text x="80" y="272" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(30 AWG)</text>

        {/* Glass label */}
        <line x1="200" y1="180" x2="120" y2="170" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
        <text x="70" y="168" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Mason jar</text>
        <text x="70" y="180" className="fill-gray-500 dark:fill-slate-400" fontSize="8">(glass diffuses</text>
        <text x="70" y="190" className="fill-gray-500 dark:fill-slate-400" fontSize="8">the LED light)</text>

        {/* Parts list at bottom */}
        <rect x="350" y="210" width="145" height="95" rx="6" className="fill-white dark:fill-slate-950 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="422" y="228" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Parts List</text>
        <text x="360" y="244" className="fill-gray-500 dark:fill-slate-400" fontSize="8">• 10× green LEDs</text>
        <text x="360" y="257" className="fill-gray-500 dark:fill-slate-400" fontSize="8">• 10× 220Ω resistors</text>
        <text x="360" y="270" className="fill-gray-500 dark:fill-slate-400" fontSize="8">• 1× Arduino Nano</text>
        <text x="360" y="283" className="fill-gray-500 dark:fill-slate-400" fontSize="8">• 1× mason jar</text>
        <text x="360" y="296" className="fill-gray-500 dark:fill-slate-400" fontSize="8">• hookup wire</text>
      </svg>
    </div>
  );
}
