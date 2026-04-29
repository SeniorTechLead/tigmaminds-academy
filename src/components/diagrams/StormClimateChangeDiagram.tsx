const StormClimateChangeDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 456"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing climate change impact on cyclones with warmer sea surface temperatures leading to stronger storms"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; }
          .era-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="cc-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="cc-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Climate Change and Cyclone Intensity
        </text>

        {/* Causal chain: Warmer SST → More fuel → Stronger cyclones */}
        <rect x="30" y="48" width="150" height="48" rx="8"
          className="fill-red-100 dark:fill-red-900" opacity="0.7"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="105" y="68" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">Warmer SST</text>
        <text x="105" y="82" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">+1.5–2°C by 2050</text>

        <line x1="185" y1="72" x2="218" y2="72"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#cc-arrow)" />

        <rect x="225" y="48" width="150" height="48" rx="8"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.7"
          stroke="#f59e0b" strokeWidth="1.5" />
        <text x="300" y="68" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">More evaporation</text>
        <text x="300" y="82" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">= more fuel for storms</text>

        <line x1="380" y1="72" x2="418" y2="72"
          stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#cc-arrow)" />

        <rect x="425" y="48" width="150" height="48" rx="8"
          className="fill-red-200 dark:fill-red-800" opacity="0.7"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="500" y="68" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">Stronger cyclones</text>
        <text x="500" y="82" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">Higher peak intensity</text>

        {/* Before/After comparison */}
        {/* LEFT: 1980s */}
        <rect x="30" y="115" width="255" height="220" rx="8"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.6"
          stroke="#3b82f6" strokeWidth="1.5" />
        <text x="157" y="138" textAnchor="middle"
          className="era-text fill-blue-700 dark:fill-blue-300">1980s</text>

        {/* Ocean */}
        <rect x="45" y="230" width="225" height="40" rx="4"
          className="fill-blue-300 dark:fill-blue-700" opacity="0.5" />
        <text x="157" y="255" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300">SST: ~27°C</text>

        {/* Smaller cyclone */}
        <circle cx="157" cy="190" r="35"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2" />
        <path d="M 157 190 Q 140 175 150 160 Q 165 150 175 165 Q 180 180 170 190 Q 157 195 150 185"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <circle cx="157" cy="190" r="6"
          className="fill-blue-500 dark:fill-blue-400" />

        {/* Category label */}
        <rect x="80" y="150" width="55" height="22" rx="4"
          className="fill-amber-200 dark:fill-amber-800" />
        <text x="107" y="165" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">Cat 3</text>

        <text x="157" y="285" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Average peak: Category 3
        </text>
        <text x="157" y="299" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Wind: ~180 km/h
        </text>
        <text x="157" y="313" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Fewer intense storms per decade
        </text>

        {/* RIGHT: 2050s */}
        <rect x="315" y="115" width="255" height="220" rx="8"
          className="fill-red-50 dark:fill-red-950" opacity="0.6"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="442" y="138" textAnchor="middle"
          className="era-text fill-red-700 dark:fill-red-300">2050s (projected)</text>

        {/* Warmer ocean */}
        <rect x="330" y="230" width="225" height="40" rx="4"
          className="fill-red-300 dark:fill-red-700" opacity="0.5" />
        <text x="442" y="255" textAnchor="middle"
          className="label-text fill-red-700 dark:fill-red-300">SST: ~29°C</text>

        {/* Larger cyclone */}
        <circle cx="442" cy="185" r="50"
          fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" />
        <circle cx="442" cy="185" r="35"
          fill="none" className="stroke-red-300 dark:stroke-red-600" strokeWidth="1.5" />
        <path d="M 442 185 Q 418 165 432 142 Q 452 128 468 148 Q 478 170 462 188 Q 442 198 428 182"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />
        <circle cx="442" cy="185" r="8"
          className="fill-red-500 dark:fill-red-400" />

        {/* Category label */}
        <rect x="375" y="145" width="55" height="22" rx="4"
          className="fill-red-300 dark:fill-red-700" />
        <text x="402" y="160" textAnchor="middle"
          className="step-text fill-red-800 dark:fill-red-200">Cat 4</text>

        <text x="442" y="285" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Average peak: Category 4
        </text>
        <text x="442" y="299" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Wind: ~220 km/h
        </text>
        <text x="442" y="313" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          More rapid intensification events
        </text>

        {/* Rising temperature arrow between */}
        <line x1="300" y1="310" x2="300" y2="135"
          stroke="#ef4444" strokeWidth="3" markerEnd="url(#cc-arrow)" />
        <text x="300" y="330" textAnchor="middle"
          className="step-text fill-red-600 dark:fill-red-400">↑ Temperature</text>

        {/* Key insight */}
        <rect x="60" y="350" width="480" height="30" rx="6"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7" />
        <text x="300" y="370" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Not necessarily more cyclones — but the ones that form can become much stronger, much faster
        </text>

        {/* Bottom caption */}
        <rect x="60" y="390" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="406" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Warmer oceans mean more energy for cyclones — preparation matters more than ever
        </text>
      </svg>
    </div>
  );
};

export default StormClimateChangeDiagram;
