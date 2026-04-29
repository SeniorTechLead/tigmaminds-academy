const StormDvorakDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 685 451"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Simplified Dvorak technique showing satellite cloud pattern being analyzed through pattern matching to produce an intensity estimate"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .small-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .big-num { font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="dv-arrow" viewBox="0 0 10 10" refX="9" refY="5"
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
          Dvorak Technique — Estimating Intensity from Satellite Images
        </text>

        {/* STEP 1: Satellite Image */}
        <rect x="20" y="50" width="170" height="200" rx="8"
          className="fill-slate-800 dark:fill-slate-900" opacity="0.9"
          stroke="#3b82f6" strokeWidth="1.5" />
        <text x="105" y="70" textAnchor="middle"
          className="step-text fill-blue-400">
          1. Satellite Image
        </text>

        {/* Spiral cloud bands */}
        <circle cx="105" cy="150" r="60"
          fill="none" className="stroke-slate-600 dark:stroke-slate-700" strokeWidth="1" />
        {/* Outer spiral bands */}
        <path d="M 105 150 Q 85 120 110 100 Q 140 85 155 110 Q 165 140 145 165 Q 125 180 105 170"
          fill="none" stroke="#94a3b8" strokeWidth="3" opacity="0.7" />
        <path d="M 105 170 Q 80 165 70 140 Q 65 115 85 100 Q 100 90 120 95"
          fill="none" stroke="#cbd5e1" strokeWidth="4" opacity="0.5" />
        <path d="M 120 95 Q 150 95 160 120 Q 165 145 150 160"
          fill="none" stroke="#cbd5e1" strokeWidth="5" opacity="0.4" />
        {/* Eye */}
        <circle cx="105" cy="150" r="8"
          className="fill-slate-900 dark:fill-black" />
        <circle cx="105" cy="150" r="6"
          fill="none" stroke="#64748b" strokeWidth="1" />

        {/* CDO label */}
        <line x1="140" y1="120" x2="165" y2="95"
          stroke="#94a3b8" strokeWidth="1" />
        <text x="168" y="93" className="small-text fill-slate-400">
          Central Dense Overcast
        </text>

        {/* Eye label */}
        <line x1="105" y1="140" x2="85" y2="120"
          stroke="#94a3b8" strokeWidth="1" />
        <text x="60" y="118" textAnchor="middle" className="small-text fill-slate-400">Eye</text>

        {/* Arrow 1→2 */}
        <line x1="195" y1="150" x2="225" y2="150"
          stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#dv-arrow)" />

        {/* STEP 2: Pattern Matching */}
        <rect x="232" y="50" width="160" height="200" rx="8"
          className="fill-blue-50 dark:fill-blue-950" opacity="0.7"
          stroke="#3b82f6" strokeWidth="1.5" />
        <text x="312" y="70" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          2. Pattern Matching
        </text>

        {/* Pattern templates */}
        {[
          { y: 85, name: 'Curved band', score: 'T2.5', shape: 'M 250 100 Q 270 90 290 95 Q 310 100 315 110' },
          { y: 125, name: 'Shear pattern', score: 'T3.5', shape: 'M 250 140 Q 275 132 295 138 Q 310 145 305 155' },
          { y: 165, name: 'Eye pattern', score: 'T5.0', shape: 'M 265 180 Q 255 170 265 162 Q 280 155 290 165 Q 295 175 285 182 Q 270 186 265 180' },
          { y: 205, name: 'CDO + eye', score: 'T6.5', shape: 'M 260 220 Q 250 210 260 200 Q 275 192 290 200 Q 298 210 288 220 Q 275 226 260 220' },
        ].map((p) => (
          <g key={p.name}>
            <path d={p.shape} fill="none"
              className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2" />
            <text x="330" y={p.y + 20} textAnchor="start"
              className="small-text fill-blue-600 dark:fill-blue-400">{p.name}</text>
            <text x="380" y={p.y + 20} textAnchor="start"
              className="small-text fill-amber-600 dark:fill-amber-400" fontWeight="600">{p.score}</text>
          </g>
        ))}

        {/* Highlight matching pattern */}
        <rect x="242" y="158" width="140" height="32" rx="4"
          fill="none" className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
        <text x="382" y="178" textAnchor="start"
          className="small-text fill-amber-500 dark:fill-amber-400">← Match!</text>

        {/* Arrow 2→3 */}
        <line x1="397" y1="150" x2="425" y2="150"
          stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#dv-arrow)" />

        {/* STEP 3: Intensity Estimate */}
        <rect x="432" y="50" width="148" height="200" rx="8"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7"
          stroke="#f59e0b" strokeWidth="1.5" />
        <text x="506" y="70" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          3. Intensity Estimate
        </text>

        {/* T-number display */}
        <rect x="455" y="85" width="100" height="50" rx="8"
          className="fill-amber-200 dark:fill-amber-800" opacity="0.7" />
        <text x="505" y="105" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">Dvorak T-number</text>
        <text x="505" y="128" textAnchor="middle"
          className="big-num fill-amber-600 dark:fill-amber-400">T 5.0</text>

        {/* Conversion table */}
        <text x="506" y="155" textAnchor="middle"
          className="small-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          T → Wind Speed
        </text>

        {[
          { t: 'T2.5', w: '55 km/h', cat: 'Depression' },
          { t: 'T3.5', w: '100 km/h', cat: 'Cyclone' },
          { t: 'T5.0', w: '165 km/h', cat: 'Very Severe' },
          { t: 'T6.5', w: '230 km/h', cat: 'Super Cyclone' },
        ].map((row, i) => (
          <g key={row.t}>
            <rect x={445} y={162 + i * 20} width="120" height="17" rx="3"
              className={i === 2 ? 'fill-red-200 dark:fill-red-800' : 'fill-slate-100 dark:fill-slate-800'}
              opacity="0.6" />
            <text x={460} y={175 + i * 20}
              className="small-text fill-slate-600 dark:fill-slate-300">{row.t}</text>
            <text x={500} y={175 + i * 20}
              className="small-text fill-slate-600 dark:fill-slate-300">{row.w}</text>
            <text x={555} y={175 + i * 20} textAnchor="end"
              className="small-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '7px' }}>{row.cat}</text>
          </g>
        ))}

        {/* Bottom explanation */}
        <rect x="30" y="270" width="540" height="100" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="290" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Why Dvorak Matters
        </text>
        <text x="300" y="310" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          We cannot fly planes into every cyclone to measure wind speed directly.
        </text>
        <text x="300" y="326" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Dvorak lets us estimate intensity just by looking at cloud shapes from satellites.
        </text>
        <text x="300" y="342" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Developed by Vernon Dvorak in 1984 — still used worldwide today.
        </text>
        <text x="300" y="358" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          Your code will automate parts of this pattern-matching process!
        </text>

        {/* Bottom caption */}
        <rect x="60" y="385" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="401" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Cloud shape tells us wind speed — the Dvorak technique is pattern recognition
        </text>
      </svg>
    </div>
  );
};

export default StormDvorakDiagram;
