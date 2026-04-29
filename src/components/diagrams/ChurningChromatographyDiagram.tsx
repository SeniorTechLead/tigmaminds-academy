export default function ChurningChromatographyDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="Paper chromatography showing ink separating into component dyes as solvent rises up the paper strip">
        <style>{`
          .chr-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .chr-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .chr-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="400" height="300" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="200" y="24" textAnchor="middle" className="chr-title fill-gray-700 dark:fill-gray-200">Paper Chromatography</text>

        {/* Beaker */}
        <path d="M 100 260 Q 100 280, 120 280 L 280 280 Q 300 280, 300 260 L 300 220 L 100 220 Z" className="fill-blue-50 dark:fill-blue-900/30 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Solvent level */}
        <rect x="101" y="240" width="198" height="39" rx="0" className="fill-blue-200 dark:fill-blue-700/40" />
        <text x="310" y="255" className="chr-small fill-blue-500 dark:fill-blue-400">Solvent</text>

        {/* Paper strip */}
        <rect x="185" y="50" width="30" height="225" rx="2" className="fill-gray-100 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-500" strokeWidth="1" />

        {/* Original ink spot */}
        <circle cx="200" cy="230" r="6" className="fill-gray-800 dark:fill-gray-200" />
        <text x="140" y="233" textAnchor="end" className="chr-small fill-gray-500 dark:fill-gray-400">Original ink</text>

        {/* Separated bands */}
        <ellipse cx="200" cy="195" rx="10" ry="5" className="fill-blue-500" opacity="0.8" />
        <text x="140" y="198" textAnchor="end" className="chr-small fill-blue-500">Blue dye (Rf=0.3)</text>

        <ellipse cx="200" cy="160" rx="10" ry="5" className="fill-red-500" opacity="0.8" />
        <text x="140" y="163" textAnchor="end" className="chr-small fill-red-500">Red dye (Rf=0.5)</text>

        <ellipse cx="200" cy="120" rx="10" ry="5" className="fill-yellow-400" opacity="0.8" />
        <text x="140" y="123" textAnchor="end" className="chr-small fill-yellow-500">Yellow dye (Rf=0.7)</text>

        {/* Solvent front */}
        <line x1="185" y1="90" x2="215" y2="90" className="stroke-blue-400" strokeWidth="1" strokeDasharray="3 2" />
        <text x="230" y="93" className="chr-small fill-blue-500 dark:fill-blue-400">Solvent front</text>

        {/* Upward arrow */}
        <line x1="170" y1="250" x2="170" y2="90" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" markerEnd="url(#chr-arrow)" />
        <text x="160" y="170" textAnchor="end" className="chr-small fill-gray-500 dark:fill-gray-400" transform="rotate(-90, 160, 170)">Solvent rises</text>

        <text x="200" y="293" textAnchor="middle" className="chr-small fill-gray-400 dark:fill-gray-500">Each dye travels at a different rate based on affinity</text>

        <defs>
          <marker id="chr-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
