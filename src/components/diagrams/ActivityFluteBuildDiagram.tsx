export default function ActivityFluteBuildDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Step-by-step guide to building a simple pan flute from 5 drinking straws, showing cut lengths, sealed ends, and the relationship between straw length and musical pitch"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
          .note { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="600" height="520" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          Build a Straw Pan Flute
        </text>
        <text x="300" y="48" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
          5 straws, tape, scissors \u2014 discover the physics of pitch
        </text>

        {/* Step 1: Cut straws */}
        <g transform="translate(30, 65)">
          <rect x="0" y="0" width="250" height="170" rx="6" className="fill-blue-50 dark:fill-blue-900/15" />
          <text x="15" y="22" className="step fill-blue-600 dark:fill-blue-400">Step 1: Cut</text>

          {/* 5 straws at different lengths */}
          {[
            { len: 120, cm: '12 cm', color: '#ef4444' },
            { len: 100, cm: '10 cm', color: '#f59e0b' },
            { len: 80, cm: '8 cm', color: '#22c55e' },
            { len: 60, cm: '6 cm', color: '#3b82f6' },
            { len: 40, cm: '4 cm', color: '#8b5cf6' },
          ].map((s, i) => (
            <g key={i}>
              <rect
                x={30 + i * 40}
                y={145 - s.len}
                width={16}
                height={s.len}
                rx="3"
                fill={s.color}
                opacity={0.7}
              />
              <text
                x={38 + i * 40}
                y={155}
                textAnchor="middle"
                className="small fill-gray-600 dark:fill-slate-400"
              >
                {s.cm}
              </text>
            </g>
          ))}

          <text x="125" y="170" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
            Cut 5 straws to these lengths
          </text>
        </g>

        {/* Step 2: Seal */}
        <g transform="translate(310, 65)">
          <rect x="0" y="0" width="260" height="170" rx="6" className="fill-emerald-50 dark:fill-emerald-900/15" />
          <text x="15" y="22" className="step fill-emerald-600 dark:fill-emerald-400">Step 2: Seal one end</text>

          {/* A straw with sealed bottom */}
          <rect x="100" y="40" width="20" height="90" rx="3" className="fill-rose-400/70" />
          {/* Tape seal at bottom */}
          <rect x="94" y="125" width="32" height="10" rx="2" className="fill-gray-400 dark:fill-gray-500" />
          <text x="110" y="148" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">tape / clay</text>

          {/* Arrow pointing to sealed end */}
          <line x1="140" y1="130" x2="130" y2="130" className="stroke-emerald-500" strokeWidth="1.5" markerEnd="url(#fbArrow)" />
          <text x="145" y="134" className="small fill-emerald-600 dark:fill-emerald-400">sealed</text>

          {/* Arrow pointing to open end */}
          <line x1="140" y1="45" x2="130" y2="45" className="stroke-blue-500" strokeWidth="1.5" markerEnd="url(#fbArrow)" />
          <text x="145" y="49" className="small fill-blue-600 dark:fill-blue-400">blow here</text>

          <text x="130" y="170" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
            Closed tube: f = v / 4L
          </text>
        </g>

        {/* Step 3: Assemble */}
        <g transform="translate(30, 255)">
          <rect x="0" y="0" width="250" height="150" rx="6" className="fill-amber-50 dark:fill-amber-900/15" />
          <text x="15" y="22" className="step fill-amber-600 dark:fill-amber-400">Step 3: Tape together</text>

          {/* Pan flute assembled - straws side by side, tops aligned */}
          {[
            { len: 100, color: '#ef4444' },
            { len: 84, color: '#f59e0b' },
            { len: 67, color: '#22c55e' },
            { len: 50, color: '#3b82f6' },
            { len: 34, color: '#8b5cf6' },
          ].map((s, i) => (
            <g key={i}>
              <rect
                x={60 + i * 28}
                y={35}
                width={16}
                height={s.len}
                rx="3"
                fill={s.color}
                opacity={0.7}
              />
              {/* Seal at bottom */}
              <rect x={58 + i * 28} y={35 + s.len - 2} width={20} height={5} rx="1" className="fill-gray-400/60" />
            </g>
          ))}

          {/* Tape wrapping */}
          <rect x="56" y="55" width={5 * 28 + 8} height="8" rx="2" className="fill-gray-300/50 dark:fill-gray-600/50" stroke="#9ca3af" strokeWidth="0.5" />
          <rect x="56" y="85" width={5 * 28 + 8} height="8" rx="2" className="fill-gray-300/50 dark:fill-gray-600/50" stroke="#9ca3af" strokeWidth="0.5" />

          <text x="125" y="148" textAnchor="middle" className="small fill-gray-500 dark:fill-slate-400">
            Align tops, tape at 2 points
          </text>
        </g>

        {/* Step 4: Play and measure */}
        <g transform="translate(310, 255)">
          <rect x="0" y="0" width="260" height="150" rx="6" className="fill-violet-50 dark:fill-violet-900/15" />
          <text x="15" y="22" className="step fill-violet-600 dark:fill-violet-400">Step 4: Test predictions</text>

          {/* Table of predictions */}
          <text x="15" y="45" className="small fill-gray-700 dark:fill-slate-300" fontWeight="600">Length</text>
          <text x="85" y="45" className="small fill-gray-700 dark:fill-slate-300" fontWeight="600">Predicted f</text>
          <text x="180" y="45" className="small fill-gray-700 dark:fill-slate-300" fontWeight="600">Pitch</text>

          {[
            { l: '12 cm', f: '715 Hz', p: 'lowest' },
            { l: '10 cm', f: '858 Hz', p: '\u2191' },
            { l: '8 cm', f: '1072 Hz', p: '\u2191' },
            { l: '6 cm', f: '1429 Hz', p: '\u2191' },
            { l: '4 cm', f: '2144 Hz', p: 'highest' },
          ].map((row, i) => (
            <g key={i}>
              <text x="15" y={62 + i * 16} className="small fill-gray-600 dark:fill-slate-400">{row.l}</text>
              <text x="85" y={62 + i * 16} className="small fill-gray-600 dark:fill-slate-400">{row.f}</text>
              <text x="180" y={62 + i * 16} className="small fill-gray-600 dark:fill-slate-400">{row.p}</text>
            </g>
          ))}

          <text x="130" y="148" textAnchor="middle" className="small fill-violet-600 dark:fill-violet-400">
            f = v / 4L (closed tube, v = 343 m/s)
          </text>
        </g>

        {/* Key insight */}
        <rect x="40" y="425" width="520" height="80" rx="8" className="fill-slate-100 dark:fill-slate-800/60" />
        <text x="300" y="448" textAnchor="middle" className="label fill-gray-800 dark:fill-slate-200" fontWeight="600">
          What to observe
        </text>
        <text x="300" y="466" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Blow gently across each straw\u2019s open top. Shorter straw = higher pitch.
        </text>
        <text x="300" y="482" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          The 4 cm straw should sound roughly 3\u00d7 higher than the 12 cm straw.
        </text>
        <text x="300" y="498" textAnchor="middle" className="small fill-gray-600 dark:fill-slate-400">
          Halving the length doubles the frequency \u2014 that\u2019s one octave up.
        </text>

        <defs>
          <marker id="fbArrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <path d="M0,0 L6,2.5 L0,5" fill="none" className="stroke-gray-500 dark:stroke-slate-400" strokeWidth="1" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
