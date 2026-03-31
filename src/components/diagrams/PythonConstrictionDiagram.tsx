export default function PythonConstrictionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Constriction mechanics: python coils stop blood flow rather than crushing bones"
      >
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
          Constriction Mechanics: Squeeze, Don{"\u2019"}t Crush
        </text>

        {/* Left: the coil */}
        <g transform="translate(230, 120)">
          <text x="0" y="-15" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            How Constriction Works
          </text>

          {/* Prey body (cross-section circle) */}
          <circle cx="0" cy="60" r="40" fill="#d4d4d8" opacity="0.3" className="dark:fill-slate-700" />
          <text x="0" y="55" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">prey</text>
          <text x="0" y="68" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">(cross-section)</text>

          {/* Python coil around prey */}
          <circle cx="0" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="12" opacity="0.4" />
          <circle cx="0" cy="60" r="50" fill="none" stroke="#4d7c0f" strokeWidth="2" />

          {/* Pressure arrows pointing inward */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const rad = (angle * Math.PI) / 180;
            const x1 = Math.cos(rad) * 65;
            const y1 = Math.sin(rad) * 65 + 60;
            const x2 = Math.cos(rad) * 48;
            const y2 = Math.sin(rad) * 48 + 60;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#constrict-arr)" />
            );
          })}
          <defs>
            <marker id="constrict-arr" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <path d="M 0,0 L 6,2.5 L 0,5 Z" fill="#ef4444" />
            </marker>
          </defs>
          <text x="0" y="135" textAnchor="middle" fontSize="11" className="fill-red-500 dark:fill-red-400">
            even pressure all around
          </text>

          {/* Heart indicator inside */}
          <g transform="translate(0, 50)">
            <path d="M 0,-8 Q -6,-15 -10,-8 Q -10,-2 0,6 Q 10,-2 10,-8 Q 6,-15 0,-8 Z" fill="#ef4444" opacity="0.5" />
          </g>
        </g>

        {/* Right: the process steps */}
        <g transform="translate(550, 75)">
          <text x="0" y="0" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
            Step by Step
          </text>

          {[
            { step: '1', text: 'Strike and grab with jaws', detail: 'Backward-curving teeth grip prey' },
            { step: '2', text: 'Rapidly coil around body', detail: '2-3 loops in under 1 second' },
            { step: '3', text: 'Sense heartbeat through coils', detail: 'Pressure sensors detect each beat' },
            { step: '4', text: 'Tighten with each exhale', detail: 'Prey exhales \u2192 python tightens \u2192 can\u2019t inhale' },
            { step: '5', text: 'Blood flow stops \u2192 unconscious', detail: 'Circulatory arrest in ~20 seconds' },
            { step: '6', text: 'Release when heartbeat stops', detail: 'Python knows prey is dead' },
          ].map((item, i) => (
            <g key={i} transform={`translate(0, ${25 + i * 35})`}>
              <circle cx="-130" cy="0" r="12" fill="#22c55e" opacity="0.2" />
              <text x="-130" y="4" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-green-600 dark:fill-green-400">{item.step}</text>
              <text x="-110" y="-2" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">{item.text}</text>
              <text x="-110" y="14" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{item.detail}</text>
            </g>
          ))}
        </g>

        {/* Key insight */}
        <g transform="translate(390, 325)">
          <rect x="-330" y="0" width="660" height="65" rx="8" className="fill-emerald-50 dark:fill-emerald-950" opacity="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">
            Key Insight: Pressure, Not Force
          </text>
          <text x="0" y="42" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            A python exerts about 1.5 PSI of pressure {"\u2014"} less than a firm handshake
          </text>
          <text x="0" y="58" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-300">
            But applied continuously around the entire body, it stops venous blood return to the heart
          </text>
        </g>

        <text x="390" y="408" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-600">
          Pythons are precision instruments {"\u2014"} they sense heartbeats and apply just enough pressure to stop circulation
        </text>
      </svg>
    </div>
  );
}
