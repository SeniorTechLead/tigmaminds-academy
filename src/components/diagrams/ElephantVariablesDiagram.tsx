export default function ElephantVariablesDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 546 441" className="w-full" role="img" aria-label="An elephant sending vibrations into the ground, with three variable boxes capturing the measured values: frequency, pulse_rate, and mood">
        {/* Dark background */}
        <rect width="520" height="420" rx="12" className="fill-white dark:fill-slate-900" />

        {/* === Elephant silhouette === */}
        <g transform="translate(260, 60)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="42" ry="30" fill="#8B9D83" />
          {/* Head */}
          <ellipse cx="-38" cy="-10" rx="20" ry="18" fill="#8B9D83" />
          {/* Ear */}
          <ellipse cx="-52" cy="-8" rx="14" ry="18" fill="#7A8E72" />
          {/* Trunk */}
          <path d="M-56,-6 Q-72,8 -68,28 Q-66,34 -62,32 Q-60,28 -54,16 Q-50,6 -48,0" fill="#8B9D83" stroke="#6B7D63" strokeWidth="1" />
          {/* Eye */}
          <circle cx="-36" cy="-14" r="2" fill="#2D3A28" />
          {/* Legs */}
          <rect x="-20" y="22" width="10" height="24" rx="4" fill="#7A8E72" />
          <rect x="-6" y="22" width="10" height="24" rx="4" fill="#7A8E72" />
          <rect x="12" y="22" width="10" height="24" rx="4" fill="#8B9D83" />
          <rect x="26" y="22" width="10" height="24" rx="4" fill="#8B9D83" />
          {/* Tail */}
          <path d="M42,0 Q54,-4 50,-14" stroke="#7A8E72" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>

        {/* === Sound waves from feet into ground === */}
        <g opacity="0.5">
          <ellipse cx="260" cy="118" rx="30" ry="4" fill="none" stroke="#D4A843" strokeWidth="1.2" strokeDasharray="4 3" />
          <ellipse cx="260" cy="128" rx="50" ry="6" fill="none" stroke="#D4A843" strokeWidth="1" strokeDasharray="4 3" />
          <ellipse cx="260" cy="140" rx="72" ry="8" fill="none" stroke="#D4A843" strokeWidth="0.8" strokeDasharray="4 3" />
        </g>

        {/* === Dotted arrows from elephant down to boxes === */}
        {/* Arrow to frequency box */}
        <line x1="230" y1="150" x2="110" y2="210" stroke="#D4A843" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        <polygon points="110,210 118,206 114,214" fill="#D4A843" opacity="0.6" />

        {/* Arrow to pulse_rate box */}
        <line x1="260" y1="150" x2="260" y2="210" stroke="#D4A843" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        <polygon points="260,210 255,200 265,200" fill="#D4A843" opacity="0.6" />

        {/* Arrow to mood box */}
        <line x1="290" y1="150" x2="410" y2="210" stroke="#D4A843" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        <polygon points="410,210 402,206 406,214" fill="#D4A843" opacity="0.6" />

        {/* === Variable box 1: frequency === */}
        <g transform="translate(50, 215)">
          {/* Label above */}
          <text x="60" y="-8" textAnchor="middle" fill="#E8C872" fontSize="13" fontWeight="600" fontFamily="monospace">frequency</text>
          {/* Box */}
          <rect x="0" y="0" width="120" height="70" rx="12" fill="#2A2518" stroke="#D4A843" strokeWidth="2" />
          {/* Value */}
          <text x="60" y="40" textAnchor="middle" fill="#F5DFA0" fontSize="30" fontWeight="bold" fontFamily="monospace">80</text>
          {/* Unit below */}
          <text x="60" y="60" textAnchor="middle" fill="#9A8B5E" fontSize="11" fontFamily="monospace">Hz</text>
        </g>

        {/* === Variable box 2: pulse_rate === */}
        <g transform="translate(200, 215)">
          <text x="60" y="-8" textAnchor="middle" fill="#E8C872" fontSize="13" fontWeight="600" fontFamily="monospace">pulse_rate</text>
          <rect x="0" y="0" width="120" height="70" rx="12" fill="#2A2518" stroke="#D4A843" strokeWidth="2" />
          <text x="60" y="40" textAnchor="middle" fill="#F5DFA0" fontSize="30" fontWeight="bold" fontFamily="monospace">0.5</text>
          <text x="60" y="60" textAnchor="middle" fill="#9A8B5E" fontSize="11" fontFamily="monospace">pulses/sec</text>
        </g>

        {/* === Variable box 3: mood === */}
        <g transform="translate(350, 215)">
          <text x="60" y="-8" textAnchor="middle" fill="#E8C872" fontSize="13" fontWeight="600" fontFamily="monospace">mood</text>
          <rect x="0" y="0" width="120" height="70" rx="12" fill="#2A2518" stroke="#D4A843" strokeWidth="2" />
          <text x="60" y="42" textAnchor="middle" fill="#F5DFA0" fontSize="24" fontWeight="bold" fontFamily="monospace">"calm"</text>
        </g>

        {/* === Caption === */}
        <text x="260" y="340" textAnchor="middle" fill="#A0A8B0" fontSize="12.5" fontFamily="sans-serif">
          A variable is a name attached to a value —
        </text>
        <text x="260" y="358" textAnchor="middle" fill="#A0A8B0" fontSize="12.5" fontFamily="sans-serif">
          change the value, the name stays.
        </text>

        {/* "we measured these" annotation */}
        <text x="260" y="172" textAnchor="middle" fill="#8A9A7A" fontSize="10.5" fontStyle="italic" fontFamily="sans-serif" opacity="0.7">
          measured from the elephant's vibrations
        </text>
      </svg>
    </div>
  );
}
