export default function BellHarmonicsDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 560 380"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing standing waves and harmonics in a bell"
      >
        <style>{`
          .bh-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .bh-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .bh-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .bh-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="560" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" className="bh-title fill-gray-700 dark:fill-gray-200">
          Standing Waves & Harmonics
        </text>

        {/* Fundamental (1st harmonic) */}
        <text x="30" y="62" className="bh-bold fill-amber-600 dark:fill-amber-400">
          1st Harmonic
        </text>
        <text x="30" y="76" className="bh-small fill-gray-500 dark:fill-gray-400">
          Fundamental • f₁
        </text>

        {/* Fixed ends (nodes) */}
        <circle cx="120" cy="80" r="4" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="440" cy="80" r="4" className="fill-gray-600 dark:fill-gray-300" />
        <line x1="120" y1="80" x2="440" y2="80"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />

        {/* Half sine wave */}
        <path d="M 120 80 Q 200 30 280 80 Q 360 130 440 80"
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" />
        <path d="M 120 80 Q 200 130 280 80 Q 360 30 440 80"
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

        <text x="120" y="105" textAnchor="middle" className="bh-small fill-red-500 dark:fill-red-400">
          Node
        </text>
        <text x="440" y="105" textAnchor="middle" className="bh-small fill-red-500 dark:fill-red-400">
          Node
        </text>
        <text x="280" y="50" textAnchor="middle" className="bh-small fill-blue-500 dark:fill-blue-400">
          Antinode
        </text>

        <text x="490" y="76" className="bh-small fill-amber-600 dark:fill-amber-400">
          f₁ = 200 Hz
        </text>

        {/* 2nd Harmonic */}
        <text x="30" y="148" className="bh-bold fill-blue-600 dark:fill-blue-400">
          2nd Harmonic
        </text>
        <text x="30" y="162" className="bh-small fill-gray-500 dark:fill-gray-400">
          1st overtone • 2f₁
        </text>

        <circle cx="120" cy="165" r="4" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="280" cy="165" r="4" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="440" cy="165" r="4" className="fill-gray-600 dark:fill-gray-300" />
        <line x1="120" y1="165" x2="440" y2="165"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />

        <path d="M 120 165 Q 160 130 200 165 Q 240 200 280 165"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />
        <path d="M 280 165 Q 320 130 360 165 Q 400 200 440 165"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5" />

        <text x="280" y="190" textAnchor="middle" className="bh-small fill-red-500 dark:fill-red-400">
          Node
        </text>

        <text x="490" y="162" className="bh-small fill-blue-600 dark:fill-blue-400">
          f₂ = 400 Hz
        </text>

        {/* 3rd Harmonic */}
        <text x="30" y="228" className="bh-bold fill-emerald-600 dark:fill-emerald-400">
          3rd Harmonic
        </text>
        <text x="30" y="242" className="bh-small fill-gray-500 dark:fill-gray-400">
          2nd overtone • 3f₁
        </text>

        <circle cx="120" cy="245" r="3" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="227" cy="245" r="3" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="333" cy="245" r="3" className="fill-gray-600 dark:fill-gray-300" />
        <circle cx="440" cy="245" r="3" className="fill-gray-600 dark:fill-gray-300" />
        <line x1="120" y1="245" x2="440" y2="245"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />

        <path d="M 120 245 Q 147 220 173 245 Q 200 270 227 245 Q 253 220 280 245 Q 307 270 333 245 Q 360 220 387 245 Q 413 270 440 245"
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2.5" />

        <text x="490" y="242" className="bh-small fill-emerald-600 dark:fill-emerald-400">
          f₃ = 600 Hz
        </text>

        {/* Key insight box */}
        <rect x="30" y="280" width="500" height="60" rx="6"
          className="fill-violet-50 dark:fill-violet-900/30 stroke-violet-300 dark:stroke-violet-600" strokeWidth="1" />
        <text x="280" y="300" textAnchor="middle" className="bh-bold fill-violet-700 dark:fill-violet-300">
          Why bells sound rich, not like a beep
        </text>
        <text x="280" y="316" textAnchor="middle" className="bh-small fill-violet-600 dark:fill-violet-400">
          A bell vibrates at ALL harmonics simultaneously. The mix of f₁ + f₂ + f₃ + ...
        </text>
        <text x="280" y="330" textAnchor="middle" className="bh-small fill-violet-600 dark:fill-violet-400">
          creates the bell’s unique timbre — the quality that makes it sound like a bell, not a flute.
        </text>

        {/* Bottom */}
        <text x="280" y="370" textAnchor="middle" className="bh-small fill-gray-500 dark:fill-gray-400">
          Nodes = points that don’t move • Antinodes = points of maximum vibration
        </text>
      </svg>
    </div>
  );
}
