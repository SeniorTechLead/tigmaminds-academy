export default function ReverberationDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 667 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Comparison of a single distinct echo versus reverberation with many overlapping reflections">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="340" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-purple-700 dark:fill-purple-300">
          Echo vs Reverberation
        </text>

        {/* LEFT: Echo */}
        <rect x="30" y="45" width="270" height="140" rx="6" fill="#faf5ff" stroke="#c084fc" strokeWidth="1" className="dark:fill-purple-900/10 dark:stroke-purple-800" />
        <text x="165" y="65" textAnchor="middle" className="label fill-purple-600 dark:fill-purple-400" fontWeight="700">Echo</text>
        <text x="165" y="82" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Single clear reflection, &gt;100 ms delay</text>

        {/* Sound amplitude over time - echo */}
        <line x1="50" y1="150" x2="280" y2="150" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-slate-500" />
        {/* Original sound burst */}
        <rect x="60" y="110" width="20" height="40" rx="2" fill="#8b5cf6" opacity="0.8" />
        <text x="70" y="105" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400">original</text>
        {/* Silence gap */}
        <text x="140" y="145" textAnchor="middle" className="small fill-slate-400 dark:fill-slate-500">silence</text>
        {/* Echo */}
        <rect x="195" y="120" width="20" height="30" rx="2" fill="#8b5cf6" opacity="0.5" />
        <text x="205" y="115" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-400">echo</text>
        {/* Time axis */}
        <text x="70" y="168" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">0 ms</text>
        <text x="205" y="168" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">&gt;100 ms</text>

        {/* RIGHT: Reverberation */}
        <rect x="320" y="45" width="270" height="140" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/10 dark:stroke-blue-800" />
        <text x="455" y="65" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="700">Reverberation</text>
        <text x="455" y="82" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Many overlapping reflections, &lt;100 ms</text>

        {/* Sound amplitude over time - reverb */}
        <line x1="340" y1="150" x2="570" y2="150" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-slate-500" />
        {/* Original sound burst */}
        <rect x="350" y="110" width="20" height="40" rx="2" fill="#3b82f6" opacity="0.8" />
        {/* Decaying reflections */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <rect key={i} x={380 + i * 22} y={115 + i * 3} width={14 - i} height={35 - i * 4} rx="1"
            fill="#3b82f6" opacity={0.6 - i * 0.06} />
        ))}
        <text x="350" y="168" className="small fill-slate-500 dark:fill-slate-400">0</text>
        <text x="530" y="168" className="small fill-slate-500 dark:fill-slate-400">fades over 0.5–2 s</text>

        {/* Room diagrams */}
        <text x="165" y="208" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Where echoes happen:</text>
        {/* Canyon */}
        <rect x="50" y="218" width="230" height="55" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" className="dark:fill-emerald-900/10" />
        {/* Two cliff faces */}
        <rect x="65" y="228" width="8" height="35" fill="#94a3b8" rx="1" className="dark:fill-slate-500" />
        <rect x="255" y="228" width="8" height="35" fill="#94a3b8" rx="1" className="dark:fill-slate-500" />
        <line x1="80" y1="245" x2="250" y2="245" stroke="#8b5cf6" strokeWidth="1" markerEnd="url(#rv-arr)" />
        <line x1="250" y1="250" x2="80" y2="250" stroke="#ec4899" strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#rv-arr-back)" />
        <text x="165" y="270" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Canyon, cliff, large building wall</text>

        <text x="455" y="208" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Where reverb happens:</text>
        {/* Room with multiple bounces */}
        <rect x="340" y="218" width="230" height="55" rx="4" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/10" />
        <rect x="345" y="223" width="220" height="45" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1" className="dark:stroke-slate-600" />
        {/* Multiple bounce lines */}
        <polyline points="370,245 420,230 470,250 520,235 540,248" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        <polyline points="370,248 410,258 460,235 510,252 540,240" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
        <text x="455" y="270" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Concert halls, bathrooms, stairwells</text>

        {/* Minimum distance */}
        <rect x="40" y="288" width="540" height="42" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="306" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Minimum distance for a distinct echo: ~17 metres</text>
        <text x="310" y="322" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Sound needs ≥100 ms round-trip delay. At 343 m/s: 343 × 0.1 / 2 = 17.15 m</text>

        <defs>
          <marker id="rv-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
          <marker id="rv-arr-back" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 10 0 L 0 5 L 10 10 z" fill="#ec4899" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
