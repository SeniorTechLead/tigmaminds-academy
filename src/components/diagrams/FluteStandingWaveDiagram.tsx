export default function FluteStandingWaveDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Standing waves inside an open bamboo tube showing fundamental, 2nd harmonic, and 3rd harmonic with nodes and antinodes marked"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .formula { font-family: system-ui, sans-serif; font-size: 12px; font-style: italic; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes pulse1 { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
          .pulse { animation: pulse1 2s ease-in-out infinite; }
          .p2 { animation-delay: 0.4s; }
          .p3 { animation-delay: 0.8s; }
        `}</style>

        <rect width="600" height="480" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Standing Waves in an Open Bamboo Tube
        </text>

        {/* Legend */}
        <circle cx="40" cy="50" r="5" className="fill-emerald-500" />
        <text x="50" y="54" className="small fill-gray-600 dark:fill-slate-400">Antinode (max vibration)</text>
        <circle cx="280" cy="50" r="5" className="fill-rose-500" />
        <text x="290" y="54" className="small fill-gray-600 dark:fill-slate-400">Node (no vibration)</text>

        {/* === Fundamental (1st harmonic) === */}
        <text x="20" y="95" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">
          Fundamental (1st harmonic)
        </text>
        <text x="520" y="95" textAnchor="end" className="formula fill-purple-600 dark:fill-purple-400">
          f\u2081 = v / 2L
        </text>

        {/* Tube body */}
        <rect x="60" y="105" width="480" height="40" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
        {/* Open ends */}
        <line x1="60" y1="105" x2="60" y2="145" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="540" y1="105" x2="540" y2="145" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />

        {/* Standing wave - half wavelength */}
        <path
          d="M60,125 Q180,95 300,125 Q420,155 540,125"
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400 pulse"
          strokeWidth="2.5"
        />
        <path
          d="M60,125 Q180,155 300,125 Q420,95 540,125"
          fill="none"
          className="stroke-blue-500/40 dark:stroke-blue-400/40 pulse"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Antinodes at ends and node in middle */}
        <circle cx="60" cy="125" r="5" className="fill-emerald-500" />
        <circle cx="540" cy="125" r="5" className="fill-emerald-500" />
        <circle cx="300" cy="125" r="5" className="fill-rose-500" />
        <text x="300" y="165" textAnchor="middle" className="small fill-rose-600 dark:fill-rose-400">Node</text>
        <text x="60" y="165" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">A</text>
        <text x="540" y="165" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">A</text>

        {/* Length annotation */}
        <line x1="60" y1="175" x2="540" y2="175" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" markerEnd="url(#arrow)" markerStart="url(#arrowR)" />
        <text x="300" y="190" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">L = \u00bd\u03bb   \u2192   \u03bb = 2L</text>

        {/* === 2nd Harmonic === */}
        <text x="20" y="220" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">
          2nd harmonic
        </text>
        <text x="520" y="220" textAnchor="end" className="formula fill-purple-600 dark:fill-purple-400">
          f\u2082 = 2v / 2L = v / L
        </text>

        <rect x="60" y="230" width="480" height="40" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
        <line x1="60" y1="230" x2="60" y2="270" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="540" y1="230" x2="540" y2="270" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />

        {/* Full wavelength - 2 humps */}
        <path
          d="M60,250 Q120,225 180,250 Q240,275 300,250 Q360,225 420,250 Q480,275 540,250"
          fill="none"
          className="stroke-violet-500 dark:stroke-violet-400 pulse p2"
          strokeWidth="2.5"
        />
        <path
          d="M60,250 Q120,275 180,250 Q240,225 300,250 Q360,275 420,250 Q480,225 540,250"
          fill="none"
          className="stroke-violet-500/40 dark:stroke-violet-400/40 pulse p2"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Nodes and antinodes */}
        <circle cx="60" cy="250" r="5" className="fill-emerald-500" />
        <circle cx="180" cy="250" r="5" className="fill-rose-500" />
        <circle cx="300" cy="250" r="5" className="fill-emerald-500" />
        <circle cx="420" cy="250" r="5" className="fill-rose-500" />
        <circle cx="540" cy="250" r="5" className="fill-emerald-500" />

        <text x="180" y="285" textAnchor="middle" className="small fill-rose-600 dark:fill-rose-400">N</text>
        <text x="420" y="285" textAnchor="middle" className="small fill-rose-600 dark:fill-rose-400">N</text>

        {/* === 3rd Harmonic === */}
        <text x="20" y="315" className="label fill-gray-700 dark:fill-slate-300" fontWeight="600">
          3rd harmonic
        </text>
        <text x="520" y="315" textAnchor="end" className="formula fill-purple-600 dark:fill-purple-400">
          f\u2083 = 3v / 2L
        </text>

        <rect x="60" y="325" width="480" height="40" rx="4" className="fill-amber-100 dark:fill-amber-900/30" stroke="#b45309" strokeWidth="1.5" />
        <line x1="60" y1="325" x2="60" y2="365" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />
        <line x1="540" y1="325" x2="540" y2="365" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" strokeDasharray="4,3" />

        {/* 1.5 wavelengths - 3 humps */}
        <path
          d="M60,345 Q100,325 140,345 Q180,365 220,345 Q260,325 300,345 Q340,365 380,345 Q420,325 460,345 Q500,365 540,345"
          fill="none"
          className="stroke-teal-500 dark:stroke-teal-400 pulse p3"
          strokeWidth="2.5"
        />
        <path
          d="M60,345 Q100,365 140,345 Q180,325 220,345 Q260,365 300,345 Q340,325 380,345 Q420,365 460,345 Q500,325 540,345"
          fill="none"
          className="stroke-teal-500/40 dark:stroke-teal-400/40 pulse p3"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Nodes */}
        <circle cx="60" cy="345" r="4" className="fill-emerald-500" />
        <circle cx="140" cy="345" r="4" className="fill-rose-500" />
        <circle cx="220" cy="345" r="4" className="fill-emerald-500" />
        <circle cx="300" cy="345" r="4" className="fill-rose-500" />
        <circle cx="380" cy="345" r="4" className="fill-emerald-500" />
        <circle cx="460" cy="345" r="4" className="fill-rose-500" />
        <circle cx="540" cy="345" r="4" className="fill-emerald-500" />

        {/* Summary formula */}
        <rect x="80" y="395" width="440" height="65" rx="8" className="fill-slate-100 dark:fill-slate-800/60" />
        <text x="300" y="418" textAnchor="middle" className="label fill-gray-800 dark:fill-slate-200" fontWeight="600">
          Open tube: f\u2099 = nv / 2L   (n = 1, 2, 3, ...)
        </text>
        <text x="300" y="438" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          All harmonics present. Antinodes at both open ends.
        </text>
        <text x="300" y="454" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Example: L = 30 cm \u2192 f\u2081 = 343 / (2 \u00d7 0.30) = 572 Hz \u2248 D\u2085
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="none" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" />
          </marker>
          <marker id="arrowR" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M8,0 L0,3 L8,6" fill="none" className="stroke-gray-400 dark:stroke-slate-500" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
