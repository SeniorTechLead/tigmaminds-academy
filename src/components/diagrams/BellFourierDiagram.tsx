export default function BellFourierDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 560 380"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing Fourier analysis breaking a bell sound into component frequencies"
      >
        <style>{`
          .bfo-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .bfo-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .bfo-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .bfo-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="560" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" className="bfo-title fill-gray-700 dark:fill-gray-200">
          Fourier Analysis — Decomposing a Bell’s Sound
        </text>

        {/* Left: Complex waveform */}
        <text x="145" y="52" textAnchor="middle" className="bfo-bold fill-violet-600 dark:fill-violet-400">
          What you hear
        </text>
        <text x="145" y="66" textAnchor="middle" className="bfo-small fill-gray-500 dark:fill-gray-400">
          Complex waveform
        </text>

        <rect x="30" y="75" width="230" height="100" rx="4"
          className="fill-gray-50 dark:fill-slate-800 stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

        {/* Complex wave (sum of harmonics) */}
        <line x1="40" y1="125" x2="250" y2="125"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="3 3" />
        <path
          d="M 40 125 Q 50 85 60 105 Q 70 140 80 110 Q 90 75 100 125 Q 110 165 120 145 Q 130 110 140 125 Q 150 85 160 105 Q 170 140 180 110 Q 190 75 200 125 Q 210 165 220 145 Q 230 110 240 125 Q 248 130 250 125"
          fill="none" className="stroke-violet-500 dark:stroke-violet-400" strokeWidth="2" />

        {/* Arrow: Fourier Transform */}
        <defs>
          <marker id="bfo-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
        </defs>

        <rect x="210" y="185" width="140" height="30" rx="15"
          className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-400 dark:stroke-emerald-500" strokeWidth="1.5" />
        <text x="280" y="205" textAnchor="middle" className="bfo-bold fill-emerald-700 dark:fill-emerald-300">
          Fourier Transform
        </text>
        <line x1="145" y1="180" x2="225" y2="195"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#bfo-arr)" />
        <line x1="335" y1="200" x2="390" y2="240"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#bfo-arr)" />

        {/* Right: Component sine waves */}
        <text x="415" y="52" textAnchor="middle" className="bfo-bold fill-amber-600 dark:fill-amber-400">
          Component Frequencies
        </text>

        {/* f1: slow sine */}
        <text x="310" y="80" className="bfo-small fill-amber-600 dark:fill-amber-400">
          f₁
        </text>
        <path
          d="M 325 90 Q 355 70 385 90 Q 415 110 445 90 Q 475 70 505 90"
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />

        {/* f2: medium sine */}
        <text x="310" y="115" className="bfo-small fill-blue-600 dark:fill-blue-400">
          f₂
        </text>
        <path
          d="M 325 125 Q 340 110 355 125 Q 370 140 385 125 Q 400 110 415 125 Q 430 140 445 125 Q 460 110 475 125 Q 490 140 505 125"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" />

        {/* f3: fast sine */}
        <text x="310" y="150" className="bfo-small fill-emerald-600 dark:fill-emerald-400">
          f₃
        </text>
        <path
          d="M 325 160 Q 333 150 340 160 Q 348 170 355 160 Q 363 150 370 160 Q 378 170 385 160 Q 393 150 400 160 Q 408 170 415 160 Q 423 150 430 160 Q 438 170 445 160 Q 453 150 460 160 Q 468 170 475 160 Q 483 150 490 160 Q 498 170 505 160"
          fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1.5" />

        {/* Plus signs */}
        <text x="520" y="95" className="bfo-label fill-gray-500 dark:fill-gray-400">+</text>
        <text x="520" y="130" className="bfo-label fill-gray-500 dark:fill-gray-400">+</text>
        <text x="520" y="165" className="bfo-label fill-gray-500 dark:fill-gray-400">...</text>

        {/* Bottom: Frequency spectrum (bar chart) */}
        <text x="280" y="252" textAnchor="middle" className="bfo-bold fill-gray-700 dark:fill-gray-200">
          Frequency Spectrum
        </text>

        {/* Axes */}
        <line x1="80" y1="350" x2="500" y2="350"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <line x1="80" y1="270" x2="80" y2="350"
          className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
        <text x="290" y="370" textAnchor="middle" className="bfo-small fill-gray-500 dark:fill-gray-400">
          Frequency (Hz)
        </text>
        <text x="55" y="310" textAnchor="middle" className="bfo-small fill-gray-500 dark:fill-gray-400" transform="rotate(-90 55 310)">
          Loudness
        </text>

        {/* Bars */}
        {[
          { x: 130, h: 70, label: 'f₁', sublabel: '200', color: 'fill-amber-500 dark:fill-amber-400' },
          { x: 210, h: 45, label: 'f₂', sublabel: '400', color: 'fill-blue-500 dark:fill-blue-400' },
          { x: 290, h: 30, label: 'f₃', sublabel: '600', color: 'fill-emerald-500 dark:fill-emerald-400' },
          { x: 370, h: 15, label: 'f₄', sublabel: '800', color: 'fill-red-400 dark:fill-red-300' },
          { x: 450, h: 8, label: 'f₅', sublabel: '1000', color: 'fill-purple-400 dark:fill-purple-300' },
        ].map((bar, i) => (
          <g key={i}>
            <rect x={bar.x - 18} y={350 - bar.h} width="36" height={bar.h} rx="2"
              className={bar.color} opacity="0.85" />
            <text x={bar.x} y={345 - bar.h} textAnchor="middle" className="bfo-small fill-gray-600 dark:fill-gray-300">
              {bar.label}
            </text>
            <text x={bar.x} y={364} textAnchor="middle" className="bfo-small fill-gray-500 dark:fill-gray-400">
              {bar.sublabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
