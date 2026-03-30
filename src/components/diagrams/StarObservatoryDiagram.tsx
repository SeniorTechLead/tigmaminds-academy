export default function StarObservatoryDiagram() {
  return (
    <svg viewBox="0 0 567 350" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Observatory design showing dome, mount, CCD camera and why observatories are on mountaintops">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Observatory Design</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Why observatories are on mountaintops</text>

      {/* Mountain */}
      <polygon points="80,260 220,140 360,260" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <polygon points="160,260 240,180 320,260" fill="#334155" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />

      {/* Observatory dome */}
      <rect x="200" y="145" width="80" height="25" fill="#475569" stroke="#64748b" strokeWidth="1" />
      <path d="M200,145 Q240,100 280,145" className="fill-gray-400 dark:fill-slate-500" stroke="#94a3b8" strokeWidth="1" />

      {/* Dome slit (opening) */}
      <path d="M235,105 Q240,100 250,108" className="fill-white dark:fill-slate-950" stroke="#94a3b8" strokeWidth="0.5" />

      {/* Telescope inside */}
      <line x1="240" y1="155" x2="248" y2="112" stroke="#60a5fa" strokeWidth="3" />
      <circle cx="249" cy="110" r="5" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="210" y="163" fill="#60a5fa" fontSize="7">telescope</text>

      {/* Star light entering */}
      <line x1="260" y1="55" x2="249" y2="105" stroke="#fef3c7" strokeWidth="1" opacity={0.5} strokeDasharray="3,2" />
      <circle cx="260" cy="52" r="3" fill="#fef3c7" />

      {/* Callout labels */}
      {/* Dome */}
      <line x1="280" y1="120" x2="340" y2="100" stroke="#94a3b8" strokeWidth="0.5" />
      <text x="345" y="98" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Rotating dome</text>
      <text x="345" y="109" className="fill-gray-400 dark:fill-slate-500" fontSize="8">protects from wind/weather</text>

      {/* Mount */}
      <line x1="240" y1="150" x2="170" y2="130" stroke="#94a3b8" strokeWidth="0.5" />
      <text x="100" y="128" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Equatorial mount</text>
      <text x="100" y="139" className="fill-gray-400 dark:fill-slate-500" fontSize="8">tracks stars as Earth rotates</text>

      {/* CCD */}
      <rect x="230" y="155" width="12" height="8" fill="#22c55e" rx="1" />
      <line x1="236" y1="163" x2="236" y2="175" stroke="#94a3b8" strokeWidth="0.5" />
      <line x1="236" y1="175" x2="170" y2="175" stroke="#94a3b8" strokeWidth="0.5" />
      <text x="100" y="173" fill="#22c55e" fontSize="9">CCD camera</text>
      <text x="100" y="184" className="fill-gray-400 dark:fill-slate-500" fontSize="8">digital light sensor</text>

      {/* Why mountaintop - right panel */}
      <rect x="370" y="120" width="135" height="130" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="437" y="140" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="600">Why mountains?</text>

      {['Less atmosphere above', 'Less light pollution', 'Drier air (less blur)', 'Stable temperatures', 'Above cloud layer'].map((reason, i) => (
        <g key={i}>
          <circle cx="385" cy={158 + i * 17} r="2" fill="#22c55e" />
          <text x="393" y={162 + i * 17} className="fill-gray-500 dark:fill-slate-400" fontSize="8">{reason}</text>
        </g>
      ))}

      {/* Atmosphere thickness comparison */}
      <rect x="30" y="195" width="120" height="65" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="90" y="212" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="600">Altitude matters</text>
      <text x="90" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Sea level: 100% air</text>
      <text x="90" y="242" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">2000m: ~80% air</text>
      <text x="90" y="256" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">4000m: ~60% air</text>

      {/* Ground line */}
      <line x1="0" y1="260" x2="520" y2="260" stroke="#334155" strokeWidth="1" />

      {/* Bottom note */}
      <text x="260" y="285" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="10">Famous sites: Mauna Kea (4,200m), Atacama (5,000m), Hanle, India (4,500m)</text>
      <text x="260" y="300" textAnchor="middle" fill="#22c55e" fontSize="9">Ziro Valley (1,500m) is excellent for amateur observation</text>
    </svg>
  );
}
