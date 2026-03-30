export default function MapSurveyDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 562 362"
        className="w-full"
        role="img"
        aria-label="Triangulation surveying: three known points with measured angles forming a triangle mesh"
      >
        <rect width="500" height="320" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Triangulation Surveying
        </text>

        {/* Ground/landscape */}
        <path d="M0,260 Q80,250 150,255 Q250,245 350,250 Q420,248 500,255 L500,280 L0,280Z" fill="#166534" stroke="#4ade80" strokeWidth="0.5" />

        {/* Primary triangle: A, B, C */}
        <polygon
          points="100,220 300,240 200,80"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Secondary triangles extending from primary */}
        <line x1="300" y1="240" x2="420" y2="160" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
        <line x1="200" y1="80" x2="420" y2="160" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
        <line x1="100" y1="220" x2="50" y2="120" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
        <line x1="200" y1="80" x2="50" y2="120" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />

        {/* Point A */}
        <circle cx="100" cy="220" r="6" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="80" y="215" textAnchor="end" fontSize="12" fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">A</text>
        {/* Angle arc at A */}
        <path d="M115,215 A20,20 0 0,0 105,203" fill="none" stroke="#fcd34d" strokeWidth="1" />
        <text x="120" y="202" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">42°</text>

        {/* Point B */}
        <circle cx="300" cy="240" r="6" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="315" y="250" fontSize="12" fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">B</text>
        {/* Angle arc at B */}
        <path d="M285,235 A20,20 0 0,0 295,222" fill="none" stroke="#fcd34d" strokeWidth="1" />
        <text x="278" y="222" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">67°</text>

        {/* Point C (hilltop) */}
        <circle cx="200" cy="80" r="6" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="200" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24" fontFamily="sans-serif">C</text>
        {/* Angle arc at C */}
        <path d="M188,92 A20,20 0 0,0 212,92" fill="none" stroke="#fcd34d" strokeWidth="1" />
        <text x="200" y="105" textAnchor="middle" fontSize="8" fill="#fcd34d" fontFamily="sans-serif">71°</text>

        {/* Extended points D, E */}
        <circle cx="420" cy="160" r="5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="432" y="158" fontSize="10" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">D</text>

        <circle cx="50" cy="120" r="5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="35" y="118" textAnchor="end" fontSize="10" fontWeight="600" fill="#60a5fa" fontFamily="sans-serif">E</text>

        {/* Baseline label */}
        <text x="200" y="245" textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="sans-serif" fontWeight="600">
          Known baseline (measured)
        </text>
        <line x1="110" y1="235" x2="290" y2="250" stroke="#34d399" strokeWidth="0.8" strokeDasharray="2 2" />

        {/* Theodolite illustration at point A */}
        <line x1="100" y1="220" x2="100" y2="250" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="95,250 105,250 100,255" className="fill-gray-500 dark:fill-slate-400" />

        {/* Right side explanation */}
        <rect x="330" y="50" width="155" height="85" rx="4" className="fill-gray-100 dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600" strokeWidth="0.5" />
        <text x="407" y="68" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fbbf24" fontFamily="sans-serif">How it works:</text>
        <text x="340" y="84" fontSize="9" fill="#d1d5db" fontFamily="sans-serif">1. Measure one baseline exactly</text>
        <text x="340" y="98" fontSize="9" fill="#d1d5db" fontFamily="sans-serif">2. Measure angles to far points</text>
        <text x="340" y="112" fontSize="9" fill="#d1d5db" fontFamily="sans-serif">3. Calculate all distances</text>
        <text x="340" y="126" fontSize="9" fill="#d1d5db" fontFamily="sans-serif">4. Extend triangle by triangle</text>

        {/* Bottom caption */}
        <text x="250" y="295" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Surveyors measured the whole world using triangles.
        </text>
        <text x="250" y="312" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          India's Great Trigonometrical Survey (1802-1871) mapped the subcontinent this way.
        </text>
      </svg>
    </div>
  );
}
