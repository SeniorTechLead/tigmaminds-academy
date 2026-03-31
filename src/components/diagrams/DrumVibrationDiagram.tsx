export default function DrumVibrationDiagram() {
  /* Generate concentric rings for vibration modes on a circular membrane */
  const membraneR = 80;

  /* Fundamental mode (0,1) - center bulges up and down */
  /* 2nd mode (1,1) - one nodal diameter across center */
  /* 3rd mode (0,2) - one nodal circle */

  return (
    <svg
      viewBox="0 0 580 340"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Animated drum membrane vibration modes showing fundamental mode with center bulging and higher harmonics with nodal lines"
    >
      <style>{`
        @keyframes dvBulge {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1, 0.85); }
        }
        @keyframes dvBulgeInv {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1, 1.15); }
        }
        .dv-fund {
          animation: dvBulge 0.8s ease-in-out infinite;
          transform-origin: 120px 165px;
        }
        @keyframes dvSplit1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes dvSplit2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .dv-half-up {
          animation: dvSplit1 0.6s ease-in-out infinite;
        }
        .dv-half-down {
          animation: dvSplit2 0.6s ease-in-out infinite;
        }
        @keyframes dvRing {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(0.92); opacity: 1; }
        }
        .dv-ring-outer {
          animation: dvRing 0.5s ease-in-out infinite;
          transform-origin: 460px 165px;
        }
        .dv-ring-inner {
          animation: dvRing 0.5s ease-in-out infinite 0.25s;
          transform-origin: 460px 165px;
        }
        @keyframes dvGlow {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 8px currentColor); }
        }
        .dv-glow { animation: dvGlow 1.2s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <rect width="580" height="340" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="290" y="24" textAnchor="middle" className="fill-gray-300" fontSize="14" fontWeight="700">
        Drum Membrane Vibration Modes
      </text>
      <text x="290" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        Like Chladni patterns on a circular membrane
      </text>

      {/* ---- MODE 1: Fundamental (0,1) ---- */}
      <g>
        <text x="120" y="68" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="600">
          Fundamental (0,1)
        </text>
        <text x="120" y="82" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Lowest pitch
        </text>

        {/* Drum rim */}
        <ellipse cx="120" cy="165" rx={membraneR} ry={membraneR * 0.35} fill="none" stroke="#92400e" strokeWidth="3" />

        {/* Vibrating membrane surface */}
        <g className="dv-fund">
          {/* Gradient fill to show displacement */}
          <defs>
            <radialGradient id="dvFundGrad">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <ellipse cx="120" cy="165" rx={membraneR - 4} ry={(membraneR - 4) * 0.35} fill="url(#dvFundGrad)" />
          {/* Center dot showing max displacement */}
          <circle cx="120" cy="165" r="5" className="fill-amber-400 dv-glow" />
        </g>

        {/* Label */}
        <text x="120" y="220" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Entire surface vibrates
        </text>
        <text x="120" y="234" textAnchor="middle" className="fill-gray-500" fontSize="10">
          together (up and down)
        </text>

        {/* Arrow showing motion */}
        <line x1="120" y1="140" x2="120" y2="125" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#dvArrow)" />
        <line x1="120" y1="190" x2="120" y2="205" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#dvArrow)" />
      </g>

      <defs>
        <marker id="dvArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill="#f59e0b" />
        </marker>
      </defs>

      {/* ---- MODE 2: First harmonic (1,1) — nodal diameter ---- */}
      <g>
        <text x="290" y="68" textAnchor="middle" className="fill-sky-400" fontSize="12" fontWeight="600">
          2nd Mode (1,1)
        </text>
        <text x="290" y="82" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Higher pitch
        </text>

        {/* Drum rim */}
        <ellipse cx="290" cy="165" rx={membraneR} ry={membraneR * 0.35} fill="none" stroke="#92400e" strokeWidth="3" />

        {/* Two halves vibrating opposite */}
        <g>
          <clipPath id="dvLeftHalf">
            <rect x="210" y="130" width="80" height="70" />
          </clipPath>
          <clipPath id="dvRightHalf">
            <rect x="290" y="130" width="80" height="70" />
          </clipPath>

          <ellipse cx="290" cy="165" rx={membraneR - 4} ry={(membraneR - 4) * 0.35}
            fill="#38bdf8" opacity="0.3" clipPath="url(#dvLeftHalf)" className="dv-half-up" />
          <ellipse cx="290" cy="165" rx={membraneR - 4} ry={(membraneR - 4) * 0.35}
            fill="#818cf8" opacity="0.3" clipPath="url(#dvRightHalf)" className="dv-half-down" />
        </g>

        {/* Nodal line (diameter) */}
        <line x1="290" y1="137" x2="290" y2="193" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
        <text x="290" y="210" textAnchor="middle" className="fill-red-400" fontSize="9" fontWeight="600">
          nodal line
        </text>

        <text x="290" y="228" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Two halves vibrate
        </text>
        <text x="290" y="242" textAnchor="middle" className="fill-gray-500" fontSize="10">
          in opposite directions
        </text>
      </g>

      {/* ---- MODE 3: (0,2) — nodal circle ---- */}
      <g>
        <text x="460" y="68" textAnchor="middle" className="fill-emerald-400" fontSize="12" fontWeight="600">
          3rd Mode (0,2)
        </text>
        <text x="460" y="82" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Even higher pitch
        </text>

        {/* Drum rim */}
        <ellipse cx="460" cy="165" rx={membraneR} ry={membraneR * 0.35} fill="none" stroke="#92400e" strokeWidth="3" />

        {/* Outer ring */}
        <g className="dv-ring-outer">
          <ellipse cx="460" cy="165" rx={membraneR - 4} ry={(membraneR - 4) * 0.35}
            fill="#34d399" opacity="0.2" />
        </g>

        {/* Inner region (opposite phase) */}
        <g className="dv-ring-inner">
          <ellipse cx="460" cy="165" rx={membraneR * 0.45} ry={membraneR * 0.45 * 0.35}
            fill="#a78bfa" opacity="0.3" />
        </g>

        {/* Nodal circle */}
        <ellipse cx="460" cy="165" rx={membraneR * 0.6} ry={membraneR * 0.6 * 0.35}
          fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
        <text x="460" y="210" textAnchor="middle" className="fill-red-400" fontSize="9" fontWeight="600">
          nodal circle
        </text>

        <text x="460" y="228" textAnchor="middle" className="fill-gray-500" fontSize="10">
          Inner and outer zones
        </text>
        <text x="460" y="242" textAnchor="middle" className="fill-gray-500" fontSize="10">
          vibrate opposite
        </text>
      </g>

      {/* Bottom note */}
      <rect x="100" y="265" width="380" height="55" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="290" y="283" textAnchor="middle" className="fill-gray-400" fontSize="10" fontWeight="600">
        Why drums sound "noisy" compared to strings
      </text>
      <text x="290" y="298" textAnchor="middle" className="fill-gray-500" fontSize="10">
        Drum harmonics are NOT integer multiples of the fundamental.
      </text>
      <text x="290" y="312" textAnchor="middle" className="fill-gray-500" fontSize="10">
        This gives drums a complex, inharmonic timbre rather than a clear tone.
      </text>
    </svg>
  );
}
