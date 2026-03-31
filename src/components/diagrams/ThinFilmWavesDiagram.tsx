export default function ThinFilmWavesDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Thin-film interference showing how two reflected waves add up or cancel">
        <rect width="700" height="400" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Thin-Film Interference</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Light reflects off top and bottom of a thin layer \u2014 the two waves interfere</text>

        {/* Thin film layers */}
        <rect x="200" y="120" width="300" height="12" rx="2" fill="#93c5fd" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
        <text x="520" y="130" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Keratin layer (top surface)</text>
        <rect x="200" y="180" width="300" height="12" rx="2" fill="#93c5fd" opacity="0.4" stroke="#3b82f6" strokeWidth="1" />
        <text x="520" y="190" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Keratin layer (bottom surface)</text>

        {/* Air gap */}
        <rect x="200" y="132" width="300" height="48" fill="#e0f2fe" opacity="0.15" />
        <text x="350" y="160" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Air gap (~150\u2013200 nm)</text>

        {/* Incoming light */}
        <line x1="160" y1="70" x2="280" y2="120" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="150" y="65" fontSize="11" fontWeight="600" fill="#fbbf24">White light in</text>

        {/* Reflection 1 (top) */}
        <line x1="280" y1="120" x2="340" y2="70" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 3" />
        <text x="345" y="65" fontSize="10" fill="#3b82f6">Wave 1</text>

        {/* Light continuing through */}
        <line x1="280" y1="120" x2="320" y2="180" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />

        {/* Reflection 2 (bottom) */}
        <line x1="320" y1="180" x2="380" y2="70" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5 3" />
        <text x="385" y="65" fontSize="10" fill="#60a5fa">Wave 2</text>

        {/* Constructive interference box */}
        <rect x="60" y="230" width="270" height="130" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="195" y="255" textAnchor="middle" fontSize="12" fontWeight="700" fill="#22c55e">Constructive (waves add up)</text>
        {/* Two in-phase waves */}
        <path d="M80,290 Q110,270 140,290 Q170,310 200,290 Q230,270 260,290" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d="M80,290 Q110,270 140,290 Q170,310 200,290 Q230,270 260,290" fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.5" transform="translate(0,-2)" />
        <text x="195" y="330" textAnchor="middle" fontSize="10" fill="#22c55e">Bright blue! Path difference = whole wavelength</text>
        <text x="195" y="348" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">This is what makes the kingfisher blue</text>

        {/* Destructive interference box */}
        <rect x="370" y="230" width="270" height="130" rx="8" className="fill-red-50 dark:fill-red-900/10" stroke="#ef4444" strokeWidth="1" />
        <text x="505" y="255" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ef4444">Destructive (waves cancel)</text>
        {/* Two out-of-phase waves */}
        <path d="M390,290 Q420,270 450,290 Q480,310 510,290 Q540,270 570,290" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d="M390,290 Q420,310 450,290 Q480,270 510,290 Q540,310 570,290" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5" />
        <text x="505" y="330" textAnchor="middle" fontSize="10" fill="#ef4444">Cancelled! Path difference = half wavelength</text>
        <text x="505" y="348" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Other colors are suppressed</text>

        {/* Bottom summary */}
        <text x="350" y="385" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">The gap thickness determines which color survives \u2014 ~200 nm gaps reinforce blue light</text>
      </svg>
    </div>
  );
}
