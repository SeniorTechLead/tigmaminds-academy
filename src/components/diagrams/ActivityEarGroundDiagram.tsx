export default function ActivityEarGroundDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 389"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Ear to ground experiment: lie flat and feel footsteps through the floor to guess distance"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .result { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          @keyframes vibrate {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-1px); }
            75% { transform: translateY(1px); }
          }
          @keyframes pulse {
            0% { opacity: 0.7; r: 3; }
            50% { opacity: 0.2; r: 8; }
            100% { opacity: 0; r: 12; }
          }
          .vib1 { animation: vibrate 0.15s ease-in-out infinite; }
          .vib2 { animation: vibrate 0.15s ease-in-out infinite 0.05s; }
        `}</style>

        {/* Background */}
        <rect width="600" height="350" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Hear Footsteps Through the Floor
        </text>

        {/* --- Room divider (wall) --- */}
        <rect x="365" y="42" width="12" height="210" className="fill-gray-400 dark:fill-slate-500" />
        <text x="371" y="55" textAnchor="middle" className="small fill-slate-300">Wall</text>

        {/* --- Floor --- */}
        <rect x="20" y="252" width="560" height="25" fill="#92400e" opacity="0.5" />
        {/* Floor boards */}
        {[20, 90, 160, 230, 300, 370, 440, 510].map(x => (
          <line key={x} x1={x} y1="252" x2={x} y2="277" stroke="#78350f" strokeWidth="0.5" opacity="0.5" />
        ))}
        <line x1="20" y1="252" x2="580" y2="252" stroke="#a16207" strokeWidth="2" />
        <line x1="20" y1="277" x2="580" y2="277" stroke="#78350f" strokeWidth="1" />

        {/* --- Person lying flat (left room) --- */}
        <g transform="translate(180, 220)">
          {/* Body lying flat */}
          <line x1="-80" y1="20" x2="60" y2="20" stroke="#64748b" strokeWidth="4" />
          {/* Head with ear to floor */}
          <circle cx="-90" cy="15" r="12" fill="#d4a574" />
          {/* Ear pressed to floor — emphasized */}
          <ellipse cx="-95" cy="22" rx="5" ry="3" fill="#c4956a" />
          {/* Eye */}
          <circle cx="-86" cy="12" r="2" className="fill-gray-100 dark:fill-slate-800" />
          {/* Arm forward */}
          <line x1="-60" y1="20" x2="-70" y2="8" stroke="#64748b" strokeWidth="3" />
          <line x1="20" y1="20" x2="30" y2="8" stroke="#64748b" strokeWidth="3" />
          {/* Legs */}
          <line x1="60" y1="20" x2="80" y2="25" stroke="#64748b" strokeWidth="3" />
          <line x1="60" y1="20" x2="78" y2="15" stroke="#64748b" strokeWidth="3" />
          {/* Feet */}
          <circle cx="80" cy="25" r="3" fill="#475569" />
          <circle cx="78" cy="15" r="3" fill="#475569" />
        </g>

        {/* Ear label */}
        <line x1="85" y1="235" x2="60" y2="215" stroke="#f59e0b" strokeWidth="1" />
        <text x="50" y="210" textAnchor="middle" className="label fill-amber-400">Ear pressed</text>
        <text x="50" y="222" textAnchor="middle" className="label fill-amber-400">to floor</text>

        {/* --- Walking person (right room) --- */}
        <g transform="translate(480, 150)">
          {/* Head */}
          <circle cx="0" cy="0" r="10" fill="#d4a574" />
          {/* Body */}
          <line x1="0" y1="10" x2="0" y2="55" stroke="#64748b" strokeWidth="3" />
          {/* Arms swinging */}
          <line x1="0" y1="20" x2="-15" y2="40" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="20" x2="12" y2="38" stroke="#64748b" strokeWidth="2.5" />
          {/* Legs walking */}
          <line x1="0" y1="55" x2="-12" y2="85" stroke="#64748b" strokeWidth="2.5" />
          <line x1="0" y1="55" x2="10" y2="82" stroke="#64748b" strokeWidth="2.5" />
          {/* Feet */}
          <ellipse cx="-12" cy="88" rx="6" ry="3" fill="#475569" />
          <ellipse cx="10" cy="85" rx="6" ry="3" fill="#475569" />
        </g>

        {/* Foot impact point */}
        <circle cx="468" cy="252" r="3" fill="#f59e0b" opacity="0.7" />
        <circle cx="468" cy="252" r="6" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
        <circle cx="468" cy="252" r="10" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />

        {/* Foot stomp label */}
        <text x="468" y="248" textAnchor="middle" className="small fill-amber-400">STOMP</text>

        {/* --- Vibration waves through floor --- */}
        {/* Wave lines traveling through the floor */}
        {[400, 350, 300, 250, 200, 150].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 258 Q ${x - 5} 262 ${x - 10} 258 Q ${x - 15} 254 ${x - 20} 258`}
              fill="none" stroke="#f59e0b" strokeWidth={1.5 - i * 0.15}
              opacity={0.8 - i * 0.1} />
          </g>
        ))}

        {/* Wave arrow showing direction */}
        <line x1="420" y1="270" x2="160" y2="270" stroke="#f59e0b" strokeWidth="1"
          strokeDasharray="4,3" />
        <polygon points="155,270 165,266 165,274" fill="#f59e0b" />
        <text x="290" y="285" textAnchor="middle" className="label fill-amber-300">
          Vibrations travel through floor
        </text>

        {/* Sound speed comparison */}
        <rect x="30" y="295" width="250" height="48" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="155" y="313" textAnchor="middle" className="small fill-slate-400">
          Sound in wood: ~3,800 m/s
        </text>
        <text x="155" y="326" textAnchor="middle" className="small fill-slate-400">
          Sound in air: ~343 m/s
        </text>
        <text x="155" y="339" textAnchor="middle" className="small fill-green-400">
          Floor carries sound 11x faster than air!
        </text>

        {/* Challenge box */}
        <rect x="310" y="295" width="270" height="48" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="445" y="313" textAnchor="middle" className="result fill-cyan-300">
          Challenge:
        </text>
        <text x="445" y="328" textAnchor="middle" className="small fill-slate-400">
          Feel the footsteps → guess the distance
        </text>
        <text x="445" y="340" textAnchor="middle" className="small fill-slate-400">
          Closer steps feel stronger, farther feel fainter
        </text>

        {/* Room labels */}
        <text x="190" y="60" textAnchor="middle" className="label fill-slate-400">Your room</text>
        <text x="480" y="60" textAnchor="middle" className="label fill-slate-400">Next room</text>

        {/* Distance markers */}
        <line x1="100" y1="247" x2="100" y2="252" stroke="#94a3b8" strokeWidth="1" />
        <line x1="200" y1="247" x2="200" y2="252" stroke="#94a3b8" strokeWidth="1" />
        <line x1="300" y1="247" x2="300" y2="252" stroke="#94a3b8" strokeWidth="1" />
        <line x1="468" y1="247" x2="468" y2="252" stroke="#94a3b8" strokeWidth="1" />
      </svg>
    </div>
  );
}
