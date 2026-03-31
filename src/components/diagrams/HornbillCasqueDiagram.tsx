export default function HornbillCasqueDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-lg mx-auto" role="img" aria-label="Cross-section of a hornbill casque showing hollow keratin structure with internal struts">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />
        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Hornbill Casque — Nature’s Hard Hat</text>

        {/* Hornbill head side view */}
        <g transform="translate(140, 200)">
          {/* Skull outline */}
          <ellipse cx="0" cy="20" rx="50" ry="40" fill="#4a3728" stroke="#a16207" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="-20" cy="8" r="10" fill="#fefce8" stroke="#854d0e" strokeWidth="1.5" />
          <circle cx="-22" cy="6" r="5" fill="#1c1917" />
          <circle cx="-23" cy="5" r="2" fill="#fefce8" />
          {/* Eye ring */}
          <circle cx="-20" cy="8" r="13" fill="none" stroke="#dc2626" strokeWidth="2" />

          {/* Bill */}
          <path d="M 30,20 Q 80,10 140,30 Q 130,38 30,35 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Bill ridge */}
          <path d="M 30,22 Q 80,14 135,31" fill="none" stroke="#a16207" strokeWidth="1" />
          {/* Bill tip */}
          <path d="M 135,30 Q 145,32 140,30" fill="#854d0e" />

          {/* Casque — outer shape */}
          <path d="M 10,-15 Q 20,-55 60,-50 Q 100,-45 110,-10 Q 100,0 60,5 Q 20,5 10,-15 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />

          {/* Casque interior — honeycomb/cellular structure */}
          <g opacity="0.6">
            {/* Internal struts showing hollow structure */}
            <line x1="25" y1="-30" x2="45" y2="-10" stroke="#78350f" strokeWidth="1" />
            <line x1="40" y1="-40" x2="60" y2="-15" stroke="#78350f" strokeWidth="1" />
            <line x1="55" y1="-42" x2="75" y2="-15" stroke="#78350f" strokeWidth="1" />
            <line x1="70" y1="-38" x2="90" y2="-12" stroke="#78350f" strokeWidth="1" />
            <line x1="25" y1="-20" x2="50" y2="-35" stroke="#78350f" strokeWidth="1" />
            <line x1="45" y1="-15" x2="70" y2="-35" stroke="#78350f" strokeWidth="1" />
            <line x1="65" y1="-12" x2="85" y2="-30" stroke="#78350f" strokeWidth="1" />
            {/* Hollow chambers */}
            <circle cx="35" cy="-28" r="6" fill="#fef3c7" opacity="0.3" />
            <circle cx="55" cy="-30" r="7" fill="#fef3c7" opacity="0.3" />
            <circle cx="75" cy="-26" r="6" fill="#fef3c7" opacity="0.3" />
            <circle cx="45" cy="-18" r="5" fill="#fef3c7" opacity="0.3" />
            <circle cx="65" cy="-18" r="5" fill="#fef3c7" opacity="0.3" />
          </g>

          {/* Feathers on head */}
          {[[-30, -5], [-35, 5], [-40, 15]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="8" ry="3" fill="#1c1917" transform={`rotate(-20, ${x}, ${y})`} />
          ))}
        </g>

        {/* Zoom-in: cross-section detail */}
        <g transform="translate(370, 120)">
          <rect x="-55" y="-25" width="110" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600"  strokeWidth="1" />
          <text x="0" y="-10" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fbbf24">Cross-Section</text>

          {/* Outer keratin shell */}
          <rect x="-40" y="5" width="80" height="90" rx="4" fill="none" stroke="#f59e0b" strokeWidth="3" />

          {/* Inner honeycomb structure */}
          {[
            [0, 25], [20, 25], [-20, 25],
            [10, 45], [-10, 45],
            [0, 65], [20, 65], [-20, 65],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <polygon
                points={`${cx},${cy - 8} ${cx + 7},${cy - 4} ${cx + 7},${cy + 4} ${cx},${cy + 8} ${cx - 7},${cy + 4} ${cx - 7},${cy - 4}`}
                fill="none"
                stroke="#d97706"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Labels */}
          <text x="0" y="88" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">Thin outer shell</text>
          <text x="0" y="97" textAnchor="middle" fontSize="7" className="fill-gray-500 dark:fill-slate-400">+ hollow honeycomb core</text>
        </g>

        {/* Leader lines and labels */}
        {/* Casque label */}
        <line x1="200" y1="150" x2="310" y2="100" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="310" y="83" fontSize="10" fontWeight="bold" fill="#fbbf24">Casque</text>
        <text x="310" y="95" fontSize="8" className="fill-slate-400">Hollow keratin + bony struts</text>

        {/* Bill label */}
        <line x1="240" y1="225" x2="320" y2="250" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <text x="325" y="248" fontSize="10" fontWeight="bold" fill="#fbbf24">Bill</text>
        <text x="325" y="260" fontSize="8" className="fill-slate-400">Keratin sheath over bone</text>

        {/* Bottom info panels */}
        <g transform="translate(20, 310)">
          <rect width="150" height="70" rx="8" className="fill-slate-800" />
          <text x="75" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Material: Keratin</text>
          <text x="75" y="30" textAnchor="middle" fontSize="8" className="fill-slate-400">Same protein as your</text>
          <text x="75" y="41" textAnchor="middle" fontSize="8" className="fill-slate-400">fingernails and hair</text>
          <text x="75" y="56" textAnchor="middle" fontSize="9" fill="#fbbf24">Lightweight yet rigid</text>
        </g>

        <g transform="translate(185, 310)">
          <rect width="150" height="70" rx="8" className="fill-slate-800" />
          <text x="75" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Structure: Hollow</text>
          <text x="75" y="30" textAnchor="middle" fontSize="8" className="fill-slate-400">Internal struts like an</text>
          <text x="75" y="41" textAnchor="middle" fontSize="8" className="fill-slate-400">airplane wing or bike helmet</text>
          <text x="75" y="56" textAnchor="middle" fontSize="9" fill="#fbbf24">Max strength, min weight</text>
        </g>

        <g transform="translate(350, 310)">
          <rect width="150" height="70" rx="8" className="fill-slate-800" />
          <text x="75" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Function</text>
          <text x="75" y="30" textAnchor="middle" fontSize="8" className="fill-slate-400">Amplifies calls (resonator)</text>
          <text x="75" y="41" textAnchor="middle" fontSize="8" className="fill-slate-400">Signals age + fitness</text>
          <text x="75" y="56" textAnchor="middle" fontSize="9" fill="#fbbf24">Natural sound chamber</text>
        </g>
      </svg>
    </div>
  );
}
