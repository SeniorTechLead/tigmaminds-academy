export default function ActivityMilkGlassDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Milky water sunset experiment: shine a torch through milky water to see blue scattering and orange transmission"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#fde68a" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#fb923c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="scatter-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />

        {/* Title */}
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Make a Sunset in a Glass
        </text>

        {/* Materials list */}
        <text x="390" y="58" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          You need: a glass of water, a few drops of milk, and a torch
        </text>

        {/* --- Table surface --- */}
        <rect x="0" y="390" width="780" height="130" fill="#78350f" opacity="0.25" />
        <line x1="0" y1="390" x2="780" y2="390" stroke="#a16207" strokeWidth="1.5" />

        {/* --- Flashlight (left) --- */}
        <g transform="translate(80, 240)">
          <rect x="-55" y="-18" width="80" height="36" rx="5" fill="#475569" />
          <rect x="25" y="-24" width="30" height="48" rx="4" className="fill-gray-400 dark:fill-slate-500" />
          <circle cx="55" cy="0" r="22" className="fill-gray-500 dark:fill-slate-400" />
          <circle cx="55" cy="0" r="17" fill="#fef3c7" opacity="0.9" />
          <rect x="-10" y="-22" width="14" height="7" rx="2" fill="#22c55e" />
        </g>
        <text x="80" y="290" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">Torch</text>

        {/* --- Glass of milky water --- */}
        <g transform="translate(370, 150)">
          {/* Glass outline */}
          <path d="M -50 0 L -45 200 Q -45 212 0 212 Q 45 212 45 200 L 50 0"
            fill="none" stroke="#94a3b8" strokeWidth="2.5" />
          <ellipse cx="0" cy="212" rx="45" ry="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Milky water fill */}
          <path d="M -48 18 L -45 200 Q -45 208 0 208 Q 45 208 45 200 L 48 18 Z"
            fill="#e0f2fe" opacity="0.12" />

          {/* Water surface */}
          <ellipse cx="0" cy="18" rx="49" ry="10" fill="#bfdbfe" opacity="0.08"
            stroke="#93c5fd" strokeWidth="0.5" />

          {/* Milk particles */}
          {[
            [-22,45],[-12,70],[16,50],[28,80],[-16,105],[6,95],[22,120],
            [-28,140],[12,135],[-6,155],[20,165],[-20,178],[9,185],
            [-12,38],[24,62],[-30,85],[14,110],[-9,128],[27,148],[-22,170]
          ].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r="2" className="fill-gray-700 dark:fill-slate-200" opacity="0.25" />
          ))}
        </g>

        {/* --- Light beam through glass --- */}
        <polygon points="135,228 318,218 318,262 135,252"
          fill="url(#beam-grad)" opacity="0.7" />
        <polygon points="322,220 418,224 418,258 322,256"
          fill="url(#beam-grad)" opacity="0.35" />

        {/* Blue scatter glow */}
        <ellipse cx="370" cy="290" rx="80" ry="55" fill="url(#scatter-blue)" />
        <ellipse cx="370" cy="210" rx="65" ry="40" fill="url(#scatter-blue)" />

        {/* Blue scatter arrows */}
        <line x1="345" y1="260" x2="305" y2="300" stroke="#60a5fa" strokeWidth="2" opacity="0.6" />
        <line x1="395" y1="260" x2="435" y2="300" stroke="#60a5fa" strokeWidth="2" opacity="0.6" />
        <line x1="340" y1="220" x2="300" y2="195" stroke="#60a5fa" strokeWidth="2" opacity="0.6" />
        <line x1="400" y1="220" x2="440" y2="195" stroke="#60a5fa" strokeWidth="2" opacity="0.6" />

        {/* Orange/red beam exiting */}
        <polygon points="422,226 600,234 600,258 422,252"
          fill="#f97316" opacity="0.2" />
        <polygon points="422,226 600,234 600,258 422,252"
          fill="#ef4444" opacity="0.15" />

        {/* --- Side observer (sees blue) --- */}
        <g transform="translate(370, 95)">
          <circle cx="0" cy="0" r="10" fill="#d4a574" />
          <circle cx="-3" cy="-3" r="2.5" className="fill-gray-100 dark:fill-slate-800" />
          <circle cx="4" cy="-3" r="2.5" className="fill-gray-100 dark:fill-slate-800" />
          <line x1="0" y1="10" x2="0" y2="35" stroke="#64748b" strokeWidth="2.5" />
        </g>
        <text x="370" y="78" textAnchor="middle" fontSize="12" fontWeight="600" fill="#60a5fa">
          Look from the side
        </text>
        <line x1="370" y1="130" x2="370" y2="148" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

        {/* --- Behind observer (sees orange) --- */}
        <g transform="translate(660, 240)">
          <circle cx="0" cy="0" r="10" fill="#d4a574" />
          <circle cx="-5" cy="-2" r="2.5" className="fill-gray-100 dark:fill-slate-800" />
          <line x1="0" y1="10" x2="0" y2="35" stroke="#64748b" strokeWidth="2.5" />
        </g>
        <text x="660" y="205" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f97316">
          Look from behind
        </text>
        <line x1="645" y1="240" x2="605" y2="240" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />

        {/* --- Result labels --- */}
        <rect x="200" y="325" width="130" height="48" rx="6" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="265" y="348" textAnchor="middle" fontSize="14" fontWeight="700" fill="#60a5fa">BLUE</text>
        <text x="265" y="365" textAnchor="middle" fontSize="11" fill="#93c5fd">from the side</text>

        <rect x="440" y="325" width="160" height="48" rx="6" fill="#431407" stroke="#f97316" strokeWidth="1.5" />
        <text x="520" y="348" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f97316">ORANGE / RED</text>
        <text x="520" y="365" textAnchor="middle" fontSize="11" fill="#fdba74">looking through</text>

        {/* --- Bottom explanation --- */}
        <rect x="100" y="420" width="580" height="52" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="442" textAnchor="middle" fontSize="13" fontWeight="600" fill="#67e8f9">
          Same physics as sunsets — blue scatters, red passes through
        </text>
        <text x="390" y="460" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-500">
          Milk particles scatter short wavelengths just like air molecules do
        </text>

        {/* Arrow labels */}
        <text x="235" y="215" textAnchor="middle" fontSize="11" fill="#fef3c7" opacity="0.6">white light in →</text>
        <text x="540" y="220" textAnchor="middle" fontSize="11" fill="#f97316" opacity="0.6">→ only red/orange out</text>

        {/* Scatter label */}
        <text x="290" y="310" textAnchor="middle" fontSize="11" fill="#60a5fa" opacity="0.7">↙ blue scatters sideways</text>
        <text x="450" y="310" textAnchor="middle" fontSize="11" fill="#60a5fa" opacity="0.7">blue scatters sideways ↗</text>
      </svg>
    </div>
  );
}
