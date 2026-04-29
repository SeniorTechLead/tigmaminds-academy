export default function StarBlackbodyDiagram() {
  /* Simplified blackbody curves at 3 temperatures */
  const curve3000 = 'M60,195 Q100,185 140,150 Q180,120 220,108 Q260,105 300,115 Q340,130 380,148 Q420,162 450,172';
  const curve5500 = 'M60,200 Q100,180 140,120 Q180,80 210,72 Q240,70 270,78 Q310,95 350,120 Q390,145 450,168';
  const curve10000 = 'M60,190 Q80,150 100,95 Q120,62 145,52 Q170,48 200,58 Q240,78 280,105 Q320,130 380,155 Q440,172 450,175';

  return (
    <svg viewBox="0 0 570 328" className="w-full max-w-2xl mx-auto my-4" role="img" aria-label="Blackbody radiation curves at different temperatures showing Planck's law">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Blackbody Radiation Curves</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Hotter objects peak at shorter (bluer) wavelengths</text>

      {/* Axes */}
      <line x1="55" y1="50" x2="55" y2="210" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />
      <line x1="55" y1="210" x2="470" y2="210" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" />

      {/* Y label */}
      <text x="20" y="130" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9" transform="rotate(-90 20 130)">Intensity →</text>

      {/* X label */}
      <text x="260" y="228" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Wavelength →</text>

      {/* Spectrum color background */}
      <defs>
        <linearGradient id="specBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
          <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.1" />
          <stop offset="40%" stopColor="#22c55e" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#eab308" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#f97316" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="56" y="50" width="414" height="160" fill="url(#specBg)" />

      {/* Spectrum labels at bottom */}
      <text x="80" y="222" fill="#7c3aed" fontSize="7">UV</text>
      <text x="140" y="222" fill="#3b82f6" fontSize="7">Blue</text>
      <text x="220" y="222" fill="#22c55e" fontSize="7">Green</text>
      <text x="300" y="222" fill="#eab308" fontSize="7">Yellow</text>
      <text x="380" y="222" fill="#ef4444" fontSize="7">Red</text>
      <text x="440" y="222" className="fill-gray-400 dark:fill-slate-500" fontSize="7">IR</text>

      {/* 3000K curve (red star) */}
      <path d={curve3000} fill="none" stroke="#f87171" strokeWidth="2.5" opacity={0.8} />
      <circle cx="270" cy="105" r="3" fill="#f87171" />
      <text x="330" y="100" fill="#f87171" fontSize="10" fontWeight="600">3,000K (red star)</text>
      <line x1="270" y1="108" x2="270" y2="210" stroke="#f87171" strokeWidth="0.5" strokeDasharray="3,3" opacity={0.3} />
      <text x="270" y="205" textAnchor="middle" fill="#f87171" fontSize="7">peak</text>

      {/* 5500K curve (Sun) */}
      <path d={curve5500} fill="none" stroke="#fbbf24" strokeWidth="2.5" opacity={0.8} />
      <circle cx="210" cy="72" r="3" fill="#fbbf24" />
      <text x="280" y="67" fill="#fbbf24" fontSize="10" fontWeight="600">5,500K (Sun)</text>
      <line x1="210" y1="75" x2="210" y2="210" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3,3" opacity={0.3} />
      <text x="210" y="205" textAnchor="middle" fill="#fbbf24" fontSize="7">peak</text>

      {/* 10000K curve (blue star) */}
      <path d={curve10000} fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity={0.8} />
      <circle cx="145" cy="52" r="3" fill="#60a5fa" />
      <text x="175" y="48" fill="#60a5fa" fontSize="10" fontWeight="600">10,000K (blue star)</text>
      <line x1="145" y1="55" x2="145" y2="210" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3,3" opacity={0.3} />
      <text x="145" y="205" textAnchor="middle" fill="#60a5fa" fontSize="7">peak</text>

      {/* Planck's Law box */}
      <rect x="90" y="245" width="340" height="42" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="260" y="262" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">Planck's Law of Blackbody Radiation</text>
      <text x="260" y="278" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Hotter = more total light AND peak shifts to shorter wavelengths</text>
    </svg>
  );
}
