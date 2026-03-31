export default function EriFibroinDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 620 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Silk fibroin protein structure showing beta-sheet crystalline regions and amorphous regions"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes shimmer { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
          .shimmer { animation: shimmer 2.2s ease-in-out infinite; }
        `}</style>

        <rect width="620" height="400" rx="8" className="fill-white dark:fill-slate-900" />

        <text x="310" y="28" textAnchor="middle" className="title fill-amber-700 dark:fill-amber-300">
          Silk Fibroin — Protein Fiber Structure
        </text>

        {/* Top: fiber cross-section */}
        <text x="50" y="60" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Cross-section of a silk fiber:</text>

        {/* Outer sericin coat */}
        <ellipse cx="310" cy="105" rx="90" ry="35" fill="#9ca3af" opacity="0.3" stroke="#6b7280" strokeWidth="1" className="dark:fill-slate-600/30" />
        <text x="420" y="100" className="small fill-gray-500 dark:fill-gray-400">Sericin</text>
        <text x="420" y="112" className="small fill-gray-500 dark:fill-gray-400">(glue coat)</text>

        {/* Inner fibroin cores — two triangular shapes */}
        <ellipse cx="280" cy="105" rx="30" ry="18" fill="#d97706" opacity="0.7" stroke="#b45309" strokeWidth="1" className="shimmer" />
        <ellipse cx="340" cy="105" rx="30" ry="18" fill="#d97706" opacity="0.7" stroke="#b45309" strokeWidth="1" className="shimmer" />
        <text x="310" y="110" textAnchor="middle" className="small fill-white dark:fill-slate-100" fontWeight="600">Fibroin</text>

        {/* Middle section: Beta-sheet structure */}
        <text x="50" y="165" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Fibroin molecular structure:</text>

        {/* Beta-sheet crystalline region */}
        <rect x="80" y="180" width="200" height="100" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/20 dark:stroke-amber-600" />
        <text x="180" y="197" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Crystalline Region</text>
        <text x="180" y="210" textAnchor="middle" className="small fill-amber-600 dark:fill-amber-500">(beta-sheet)</text>

        {/* Zigzag chains for beta-sheets */}
        {[0, 1, 2, 3].map(i => (
          <polyline key={i}
            points={Array.from({length: 12}, (_, j) => `${100 + j * 15},${225 + i * 14 + (j % 2 === 0 ? 0 : 6)}`).join(' ')}
            fill="none" stroke="#d97706" strokeWidth="1.5" className="dark:stroke-amber-500"
          />
        ))}

        {/* H-bond dashes between sheets */}
        {[0, 1, 2].map(i => (
          <g key={i}>
            {[0, 1, 2, 3, 4].map(j => (
              <line key={j} x1={110 + j * 30} y1={231 + i * 14} x2={110 + j * 30} y2={237 + i * 14}
                stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,1" className="dark:stroke-blue-400" />
            ))}
          </g>
        ))}
        <text x="180" y="290" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">H-bonds hold sheets together</text>

        {/* Amorphous region */}
        <rect x="340" y="180" width="230" height="100" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" className="dark:fill-emerald-900/20 dark:stroke-emerald-600" />
        <text x="455" y="197" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-400" fontWeight="600">Amorphous Region</text>
        <text x="455" y="210" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-500">(random coils)</text>

        {/* Wavy random chains */}
        <path d="M 370 230 Q 390 218 410 235 Q 430 250 450 228 Q 470 210 490 235 Q 510 255 530 230" fill="none" stroke="#10b981" strokeWidth="1.5" className="dark:stroke-emerald-500" />
        <path d="M 380 250 Q 400 240 420 258 Q 440 270 460 248 Q 480 230 500 252 Q 520 268 540 250" fill="none" stroke="#10b981" strokeWidth="1.5" className="dark:stroke-emerald-500" />
        <text x="455" y="290" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400">Gives elasticity and flexibility</text>

        {/* Bottom: comparison box */}
        <rect x="50" y="310" width="520" height="75" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="310" y="330" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Eri vs Mulberry Silk Fibroin</text>

        <text x="80" y="350" className="small fill-slate-600 dark:fill-slate-400">Eri: More alanine → more crystalline → thermal stability to 300\u00B0C</text>
        <text x="80" y="368" className="small fill-slate-600 dark:fill-slate-400">Mulberry: More glycine → less crystalline → decomposes at 250\u00B0C</text>
        <text x="80" y="383" className="small fill-amber-600 dark:fill-amber-400" fontWeight="600">Eri silk is warmer because short spun fibers trap air pockets (like wool)</text>
      </svg>
    </div>
  );
}
