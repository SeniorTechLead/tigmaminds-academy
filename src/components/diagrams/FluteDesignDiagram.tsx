export default function FluteDesignDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 600 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a bamboo flute showing bore shape, wall thickness, embouchure hole design, and finger hole placement with physics annotations"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .callout { font-family: system-ui, sans-serif; font-size: 10px; font-style: italic; }
        `}</style>

        <rect width="600" height="560" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Anatomy of a Bamboo Flute
        </text>
        <text x="300" y="48" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          Every design choice affects the physics of the sound
        </text>

        {/* ===== FULL FLUTE TOP VIEW ===== */}
        <text x="30" y="80" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Top view</text>

        {/* Outer tube */}
        <rect x="60" y="90" width="490" height="36" rx="18" className="fill-amber-200 dark:fill-amber-800/50" stroke="#92400e" strokeWidth="2" />
        {/* Inner bore */}
        <rect x="72" y="98" width="466" height="20" rx="10" className="fill-amber-50 dark:fill-amber-950/50" stroke="#b45309" strokeWidth="0.5" />

        {/* Cork/plug at one end */}
        <rect x="60" y="90" width="12" height="36" rx="4" className="fill-amber-700 dark:fill-amber-600" />
        <text x="66" y="86" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400">cork</text>

        {/* Embouchure hole */}
        <ellipse cx="110" cy="108" rx="10" ry="7" className="fill-amber-400 dark:fill-amber-600" stroke="#78350f" strokeWidth="1" />
        <line x1="110" y1="130" x2="110" y2="152" className="stroke-rose-500 dark:stroke-rose-400" strokeWidth="1" />
        <text x="110" y="164" textAnchor="middle" className="label fill-rose-600 dark:fill-rose-400">Embouchure</text>
        <text x="110" y="177" textAnchor="middle" className="small fill-rose-500 dark:fill-rose-300">Air splits here</text>

        {/* Finger holes */}
        {[220, 270, 320, 370, 420, 460].map((hx, i) => (
          <g key={i}>
            <circle cx={hx} cy={108} r={6} className="fill-amber-400 dark:fill-amber-600" stroke="#78350f" strokeWidth="1" />
            <text x={hx} y={142} textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">{i + 1}</text>
          </g>
        ))}
        <text x="340" y="155" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Finger holes (6)</text>

        {/* Open end */}
        <text x="556" y="86" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">open end</text>

        {/* ===== CROSS SECTION ===== */}
        <text x="30" y="210" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">Cross-section (bore shape)</text>

        {/* Cylindrical bore */}
        <g transform="translate(120, 230)">
          <rect x="0" y="0" width="120" height="70" rx="6" className="fill-slate-50 dark:fill-slate-900/50" />
          <text x="60" y="-8" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="600">Cylindrical bore</text>

          {/* Outer wall */}
          <rect x="15" y="15" width="90" height="40" rx="20" className="fill-amber-200 dark:fill-amber-800/50" stroke="#92400e" strokeWidth="1.5" />
          {/* Inner bore - uniform */}
          <rect x="25" y="22" width="70" height="26" rx="13" className="fill-amber-50 dark:fill-amber-950/50" />

          <text x="60" y="80" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">Same diameter throughout</text>
          <text x="60" y="93" textAnchor="middle" className="callout fill-blue-600 dark:fill-blue-400">Clear, pure tone</text>
        </g>

        {/* Conical bore */}
        <g transform="translate(340, 230)">
          <rect x="0" y="0" width="120" height="70" rx="6" className="fill-slate-50 dark:fill-slate-900/50" />
          <text x="60" y="-8" textAnchor="middle" className="label fill-violet-600 dark:fill-violet-400" fontWeight="600">Conical bore</text>

          {/* Tapered outer */}
          <path d="M20,40 Q20,20 35,18 L85,12 Q100,10 100,35 Q100,60 85,58 L35,52 Q20,50 20,40 Z" className="fill-amber-200 dark:fill-amber-800/50" stroke="#92400e" strokeWidth="1.5" />
          {/* Tapered inner */}
          <path d="M28,40 Q28,27 38,25 L78,19 Q88,17 88,35 Q88,53 78,51 L38,45 Q28,43 28,40 Z" className="fill-amber-50 dark:fill-amber-950/50" />

          <text x="60" y="80" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">Wider at one end</text>
          <text x="60" y="93" textAnchor="middle" className="callout fill-violet-600 dark:fill-violet-400">Richer harmonics</text>
        </g>

        {/* ===== MATERIALS COMPARISON ===== */}
        <text x="30" y="360" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">How materials affect sound</text>

        {/* Bamboo */}
        <g transform="translate(40, 375)">
          <rect x="0" y="0" width="160" height="80" rx="6" className="fill-emerald-50 dark:fill-emerald-900/20" stroke="#059669" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" className="label fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Bamboo</text>
          <text x="80" y="36" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Soft, porous walls</text>
          <text x="80" y="50" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Absorbs high frequencies</text>
          <text x="80" y="68" textAnchor="middle" className="callout fill-emerald-600 dark:fill-emerald-400">Warm, breathy tone</text>
        </g>

        {/* Metal */}
        <g transform="translate(220, 375)">
          <rect x="0" y="0" width="160" height="80" rx="6" className="fill-slate-100 dark:fill-slate-800/50" stroke="#64748b" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Metal (silver/nickel)</text>
          <text x="80" y="36" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Hard, smooth walls</text>
          <text x="80" y="50" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Reflects all frequencies</text>
          <text x="80" y="68" textAnchor="middle" className="callout fill-slate-600 dark:fill-slate-300">Bright, penetrating tone</text>
        </g>

        {/* Wood */}
        <g transform="translate(400, 375)">
          <rect x="0" y="0" width="160" height="80" rx="6" className="fill-amber-50 dark:fill-amber-900/20" stroke="#b45309" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" className="label fill-amber-700 dark:fill-amber-400" fontWeight="600">Hardwood</text>
          <text x="80" y="36" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Dense, rigid walls</text>
          <text x="80" y="50" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">Between bamboo and metal</text>
          <text x="80" y="68" textAnchor="middle" className="callout fill-amber-600 dark:fill-amber-400">Rich, focused tone</text>
        </g>

        {/* Key insight */}
        <rect x="40" y="478" width="520" height="65" rx="8" className="fill-slate-100 dark:fill-slate-800/60" />
        <text x="300" y="498" textAnchor="middle" className="label fill-gray-800 dark:fill-slate-200" fontWeight="600">
          Physics of instrument design
        </text>
        <text x="300" y="516" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Bore shape determines which harmonics are amplified. Material determines which are absorbed.
        </text>
        <text x="300" y="532" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Wall thickness, hole size, and hole placement complete the instrument’s voice.
        </text>
      </svg>
    </div>
  );
}
