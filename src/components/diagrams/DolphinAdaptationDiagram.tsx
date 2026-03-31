export default function DolphinAdaptationDiagram() {
  return (
    <svg
      viewBox="0 0 640 380"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Ganges river dolphin adaptations for navigating murky water without sight"
    >
      <rect width="640" height="380" rx="12" className="fill-gray-900" />

      <text x="320" y="24" textAnchor="middle" className="fill-gray-400" fontSize="11" fontWeight="600">
        Blind but Not Lost &mdash; How the Ganges River Dolphin Navigates Murky Water
      </text>

      {/* Murky water background */}
      <rect x="20" y="38" width="600" height="200" rx="8" fill="#422006" opacity="0.2" />
      <text x="600" y="54" textAnchor="end" fill="#92400e" fontSize="8" fontStyle="italic">visibility &lt; 5 cm in silt-laden water</text>

      {/* Central dolphin */}
      <g transform="translate(220, 90)">
        <path d="M0,45 Q15,12 70,20 Q110,5 150,25 L145,45 Q110,65 70,58 Q30,65 0,45Z" fill="#0891b2" />
        <path d="M75,20 L82,2 L95,20" fill="#0e7490" />
        <path d="M0,45 Q-8,32 -20,26 M0,45 Q-8,55 -20,60" stroke="#0891b2" strokeWidth="3" fill="none" />
        {/* Tiny eye (vestigial) */}
        <circle cx="125" cy="30" r="1.5" fill="#475569" />
        <line x1="121" y1="30" x2="129" y2="30" stroke="#ef4444" strokeWidth="1.5" />
      </g>

      {/* === Adaptation callouts === */}

      {/* 1. Melon (acoustic lens) */}
      <line x1="370" y1="115" x2="440" y2="60" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="440" y="45" width="175" height="40" rx="4" fill="#164e63" stroke="#22d3ee" strokeWidth="1" />
      <text x="450" y="60" fill="#67e8f9" fontSize="9" fontWeight="600">Melon (acoustic lens)</text>
      <text x="450" y="74" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Fatty organ focuses clicks</text>
      <text x="450" y="84" className="fill-gray-500 dark:fill-slate-400" fontSize="8">into a narrow beam (~10&#176;)</text>

      {/* 2. Long snout */}
      <line x1="370" y1="133" x2="440" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="440" y="95" width="175" height="34" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
      <text x="450" y="110" fill="#fbbf24" fontSize="9" fontWeight="600">Long snout</text>
      <text x="450" y="122" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Probes riverbed sediment for prey</text>

      {/* 3. Vestigial eyes */}
      <line x1="345" y1="118" x2="440" y2="148" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="440" y="138" width="175" height="40" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
      <text x="450" y="153" fill="#fca5a5" fontSize="9" fontWeight="600">Vestigial eyes (no lens)</text>
      <text x="450" y="165" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Detect light/dark only &mdash;</text>
      <text x="450" y="175" className="fill-gray-500 dark:fill-slate-400" fontSize="8">cannot form images</text>

      {/* 4. Lower jaw */}
      <line x1="320" y1="145" x2="100" y2="180" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="20" y="170" width="175" height="40" rx="4" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
      <text x="30" y="185" fill="#d8b4fe" fontSize="9" fontWeight="600">Oil-filled lower jaw</text>
      <text x="30" y="197" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Conducts echoes to inner</text>
      <text x="30" y="207" className="fill-gray-500 dark:fill-slate-400" fontSize="8">ear &mdash; works like an antenna</text>

      {/* 5. Side-swimming */}
      <line x1="270" y1="155" x2="100" y2="130" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
      <rect x="20" y="55" width="175" height="40" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
      <text x="30" y="70" fill="#6ee7b7" fontSize="9" fontWeight="600">Swims on its side</text>
      <text x="30" y="82" className="fill-gray-500 dark:fill-slate-400" fontSize="8">One flipper trails the</text>
      <text x="30" y="92" className="fill-gray-500 dark:fill-slate-400" fontSize="8">riverbed &mdash; tactile sensing</text>

      {/* === Comparison table === */}
      <rect x="30" y="248" width="580" height="120" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="320" y="268" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10" fontWeight="600">Dolphin vs Human-Built Sonar</text>

      {/* Headers */}
      <text x="120" y="290" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="600">Feature</text>
      <text x="300" y="290" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="600">Dolphin</text>
      <text x="490" y="290" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">HC-SR04 Sensor</text>

      <line x1="50" y1="295" x2="590" y2="295" stroke="#374151" strokeWidth="0.5" />

      {[
        ['Click rate', 'Up to 100/sec', '~20/sec (typical)'],
        ['Range', '~100 m (water)', '~4 m (air)'],
        ['Resolution', 'Detect 1mm wire', '&#177;3 mm'],
        ['Power', '~30 W (brain)', '15 mA (5V)'],
      ].map(([feature, dolphin, sensor], i) => (
        <g key={i}>
          <text x="120" y={312 + i * 16} textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="8">{feature}</text>
          <text x="300" y={312 + i * 16} textAnchor="middle" fill="#7dd3fc" fontSize="8">{dolphin}</text>
          <text x="490" y={312 + i * 16} textAnchor="middle" fill="#fcd34d" fontSize="8" dangerouslySetInnerHTML={{ __html: sensor }} />
        </g>
      ))}
    </svg>
  );
}
