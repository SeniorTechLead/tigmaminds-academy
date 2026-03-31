export default function DolphinEcholocationDiagram() {
  return (
    <svg
      viewBox="0 0 640 340"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="How a Ganges river dolphin uses echolocation: clicks travel out, bounce off a fish, and return as echoes"
    >
      <defs>
        {[0, 1, 2, 3].map((i) => (
          <style key={`out-${i}`}>{`
            @keyframes dEchoOut${i} {
              0%   { opacity: 0; transform: scale(0.3); }
              20%  { opacity: 0.7; }
              60%  { opacity: 0.3; }
              100% { opacity: 0; transform: scale(1); }
            }
            .d-wave-out-${i} {
              animation: dEchoOut${i} 2.6s ease-out infinite;
              animation-delay: ${i * 0.45}s;
              transform-origin: 175px 120px;
            }
          `}</style>
        ))}
        {[0, 1, 2].map((i) => (
          <style key={`back-${i}`}>{`
            @keyframes dEchoBack${i} {
              0%   { opacity: 0; transform: scale(0.3); }
              20%  { opacity: 0.6; }
              60%  { opacity: 0.2; }
              100% { opacity: 0; transform: scale(1); }
            }
            .d-wave-back-${i} {
              animation: dEchoBack${i} 2.6s ease-out infinite;
              animation-delay: ${1.8 + i * 0.45}s;
              transform-origin: 410px 120px;
            }
          `}</style>
        ))}
        <marker id="dArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#22d3ee" />
        </marker>
        <marker id="dArrowL" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M8,0 L0,3 L8,6" fill="#c084fc" />
        </marker>
        <marker id="dTimeArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#6b7280" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="640" height="340" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="320" y="24" textAnchor="middle" className="fill-gray-400" fontSize="11" fontWeight="600">
        Seeing with Sound &mdash; How the Ganges River Dolphin Echolocates
      </text>

      {/* Murky water hint */}
      <rect x="0" y="34" width="640" height="180" rx="0" fill="#0c4a6e" opacity="0.25" />
      <text x="610" y="50" textAnchor="end" className="fill-sky-700" fontSize="9" fontStyle="italic">murky river water</text>

      {/* === Dolphin (left) === */}
      <g transform="translate(50, 80)">
        <path d="M0,40 Q12,10 60,18 Q95,5 125,22 L120,40 Q95,58 60,52 Q25,58 0,40Z" fill="#0891b2" />
        <path d="M65,18 L72,0 L82,18" fill="#0e7490" />
        <path d="M0,40 Q-8,28 -18,22 M0,40 Q-8,50 -18,55" stroke="#0891b2" strokeWidth="3" fill="none" />
        <circle cx="102" cy="26" r="2.5" className="fill-gray-100 dark:fill-slate-800" />
        <line cx="102" cy="26" x1="100" y1="25" x2="104" y2="27" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <ellipse cx="122" cy="33" rx="8" ry="5" fill="#06b6d4" opacity="0.35" />
        <text x="122" y="22" textAnchor="middle" fill="#67e8f9" fontSize="7">melon</text>
      </g>
      <text x="110" y="155" textAnchor="middle" className="fill-cyan-400" fontSize="10" fontWeight="600">
        Ganges River Dolphin
      </text>
      <text x="110" y="167" textAnchor="middle" className="fill-cyan-600" fontSize="8">
        (nearly blind &mdash; no eye lens)
      </text>

      {/* Outgoing clicks */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={`out-${i}`}
          className={`d-wave-out-${i}`}
          d={`M${200 + i * 35},${85} A${22 + i * 16},${32 + i * 12} 0 0,1 ${200 + i * 35},${155}`}
          fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0"
        />
      ))}

      {/* Fish target (right) */}
      <g transform="translate(385, 97)">
        <ellipse cx="30" cy="22" rx="28" ry="14" fill="#f59e0b" />
        <path d="M2,22 L-14,10 L-14,34Z" fill="#d97706" />
        <circle cx="48" cy="18" r="3" className="fill-gray-100 dark:fill-slate-800" />
        <path d="M25,10 L30,2 L37,10" fill="#fbbf24" opacity="0.6" />
      </g>
      <text x="415" y="148" textAnchor="middle" className="fill-amber-400" fontSize="10" fontWeight="500">
        Fish (target)
      </text>

      {/* Reflected echoes */}
      {[0, 1, 2].map((i) => (
        <path
          key={`back-${i}`}
          className={`d-wave-back-${i}`}
          d={`M${380 - i * 35},${85} A${22 + i * 16},${32 + i * 12} 0 0,0 ${380 - i * 35},${155}`}
          fill="none" stroke="#c084fc" strokeWidth="2" opacity="0"
        />
      ))}

      {/* Labels */}
      <text x="275" y="78" textAnchor="middle" fill="#67e8f9" fontSize="9">outgoing click</text>
      <line x1="240" y1="75" x2="305" y2="75" stroke="#22d3ee" strokeWidth="1" markerEnd="url(#dArrowR)" opacity="0.5" />
      <text x="310" y="175" textAnchor="middle" fill="#d8b4fe" fontSize="9">reflected echo</text>
      <line x1="345" y1="172" x2="280" y2="172" stroke="#c084fc" strokeWidth="1" markerEnd="url(#dArrowL)" opacity="0.5" />

      {/* === Key facts below === */}
      <line x1="30" y1="210" x2="610" y2="210" stroke="#374151" strokeWidth="1" />

      {/* 3-step process */}
      <circle cx="100" cy="240" r="18" fill="#164e63" stroke="#22d3ee" strokeWidth="1.5" />
      <text x="100" y="237" textAnchor="middle" fill="#22d3ee" fontSize="18" fontWeight="700">1</text>
      <text x="100" y="250" textAnchor="middle" fill="#67e8f9" fontSize="7">CLICK</text>
      <text x="100" y="272" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Phonic lips</text>
      <text x="100" y="282" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">produce click</text>

      <line x1="130" y1="240" x2="230" y2="240" stroke="#374151" strokeWidth="1.5" markerEnd="url(#dTimeArr)" />

      <circle cx="270" cy="240" r="18" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
      <text x="270" y="237" textAnchor="middle" fill="#c084fc" fontSize="18" fontWeight="700">2</text>
      <text x="270" y="250" textAnchor="middle" fill="#d8b4fe" fontSize="7">ECHO</text>
      <text x="270" y="272" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Lower jaw</text>
      <text x="270" y="282" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">receives echo</text>

      <line x1="300" y1="240" x2="400" y2="240" stroke="#374151" strokeWidth="1.5" markerEnd="url(#dTimeArr)" />

      <circle cx="440" cy="240" r="18" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
      <text x="440" y="237" textAnchor="middle" fill="#34d399" fontSize="18" fontWeight="700">3</text>
      <text x="440" y="250" textAnchor="middle" fill="#6ee7b7" fontSize="7">MAP</text>
      <text x="440" y="272" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Brain builds</text>
      <text x="440" y="282" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">sound picture</text>

      {/* Formula */}
      <rect x="140" y="300" width="360" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#374151" strokeWidth="1" />
      <text x="320" y="319" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="700" fontFamily="monospace">
        distance = (speed &#215; time) / 2
      </text>

      {/* Speed callout */}
      <text x="560" y="242" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="600">1,480 m/s</text>
      <text x="560" y="255" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">in water</text>
      <text x="560" y="272" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">vs 343 m/s</text>
      <text x="560" y="282" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">in air (4.3x)</text>
    </svg>
  );
}
