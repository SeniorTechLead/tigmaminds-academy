export default function LeopardMarkRecaptureDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 480"
        className="w-full"
        role="img"
        aria-label="Mark-recapture method diagram showing two sampling rounds and the Lincoln-Petersen formula for population estimation"
      >
        <rect x="0" y="0" width="600" height="480" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          Mark-Recapture — Counting Without Seeing Every Animal
        </text>

        {/* Round 1 - Capture */}
        <rect x="15" y="44" width="270" height="170" rx="6" className="fill-slate-800/60" />
        <text x="150" y="64" textAnchor="middle" fontSize="11" className="fill-amber-300" fontWeight="700">
          Round 1: Capture &amp; Mark
        </text>

        {/* Forest area with animals */}
        <rect x="30" y="75" width="240" height="125" rx="4" className="fill-emerald-950/40" />

        {/* 12 animals total - 4 marked (orange), 8 unmarked (gray) */}
        {[
          { x: 60, y: 100, marked: true }, { x: 110, y: 95, marked: false },
          { x: 160, y: 105, marked: true }, { x: 210, y: 90, marked: false },
          { x: 80, y: 135, marked: false }, { x: 130, y: 140, marked: true },
          { x: 180, y: 130, marked: false }, { x: 230, y: 145, marked: false },
          { x: 55, y: 170, marked: false }, { x: 105, y: 175, marked: true },
          { x: 155, y: 168, marked: false }, { x: 205, y: 172, marked: false },
        ].map((a, i) => (
          <g key={i}>
            <circle cx={a.x} cy={a.y} r="10" fill={a.marked ? '#f59e0b' : '#6b7280'} opacity="0.8" />
            {a.marked && (
              <text x={a.x} y={a.y + 4} textAnchor="middle" fontSize="8" className="fill-slate-900" fontWeight="700">M</text>
            )}
          </g>
        ))}

        <text x="150" y="210" textAnchor="middle" fontSize="10" className="fill-gray-300">
          Captured 4, marked them (M), released back
        </text>

        {/* Round 2 - Recapture */}
        <rect x="315" y="44" width="270" height="170" rx="6" className="fill-slate-800/60" />
        <text x="450" y="64" textAnchor="middle" fontSize="11" className="fill-blue-300" fontWeight="700">
          Round 2: Recapture &amp; Count
        </text>

        <rect x="330" y="75" width="240" height="125" rx="4" className="fill-emerald-950/40" />

        {/* Second sample: 6 captured, 2 are marked */}
        {[
          { x: 370, y: 100, marked: true, captured: true },
          { x: 420, y: 95, marked: false, captured: true },
          { x: 470, y: 105, marked: false, captured: true },
          { x: 520, y: 90, marked: false, captured: false },
          { x: 390, y: 135, marked: false, captured: false },
          { x: 440, y: 140, marked: true, captured: true },
          { x: 490, y: 130, marked: false, captured: true },
          { x: 540, y: 145, marked: false, captured: false },
          { x: 365, y: 170, marked: false, captured: false },
          { x: 415, y: 175, marked: false, captured: true },
          { x: 465, y: 168, marked: true, captured: false },
          { x: 515, y: 172, marked: false, captured: false },
        ].map((a, i) => (
          <g key={i}>
            <circle
              cx={a.x} cy={a.y} r="10"
              fill={a.marked ? '#f59e0b' : '#6b7280'}
              opacity={a.captured ? 0.9 : 0.3}
            />
            {a.marked && (
              <text x={a.x} y={a.y + 4} textAnchor="middle" fontSize="8" className="fill-slate-900" fontWeight="700">M</text>
            )}
            {a.captured && (
              <circle cx={a.x} cy={a.y} r="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            )}
          </g>
        ))}

        <text x="450" y="210" textAnchor="middle" fontSize="10" className="fill-gray-300">
          Recaptured 6 — found 2 with marks
        </text>

        {/* Arrow between rounds */}
        <text x="295" y="130" textAnchor="middle" fontSize="18" className="fill-gray-500">→</text>
        <text x="295" y="148" textAnchor="middle" fontSize="9" className="fill-gray-500">Wait</text>
        <text x="295" y="158" textAnchor="middle" fontSize="9" className="fill-gray-500">days</text>

        {/* Formula section */}
        <rect x="15" y="226" width="570" height="120" rx="6" className="fill-indigo-950/40" />
        <text x="300" y="248" textAnchor="middle" fontSize="12" className="fill-indigo-300" fontWeight="700">
          Lincoln–Petersen Formula
        </text>

        {/* Formula */}
        <text x="300" y="280" textAnchor="middle" fontSize="16" className="fill-white" fontWeight="700">
          N = (M × C) / R
        </text>

        {/* Variable explanations */}
        <text x="120" y="310" textAnchor="middle" fontSize="11" className="fill-amber-300">M = 4</text>
        <text x="120" y="324" textAnchor="middle" fontSize="10" className="fill-gray-400">marked in Round 1</text>

        <text x="300" y="310" textAnchor="middle" fontSize="11" className="fill-blue-300">C = 6</text>
        <text x="300" y="324" textAnchor="middle" fontSize="10" className="fill-gray-400">captured in Round 2</text>

        <text x="480" y="310" textAnchor="middle" fontSize="11" className="fill-green-300">R = 2</text>
        <text x="480" y="324" textAnchor="middle" fontSize="10" className="fill-gray-400">recaptured with marks</text>

        {/* Calculation */}
        <rect x="15" y="356" width="570" height="50" rx="6" className="fill-slate-800/60" />
        <text x="300" y="376" textAnchor="middle" fontSize="13" className="fill-white" fontWeight="600">
          N = (4 × 6) / 2 = 24 / 2 = 12 estimated leopards
        </text>
        <text x="300" y="394" textAnchor="middle" fontSize="10" className="fill-green-400">
          ✓ Matches the actual 12 animals in the forest above!
        </text>

        {/* Key insight */}
        <rect x="15" y="416" width="570" height="54" rx="6" className="fill-amber-950/30" />
        <text x="300" y="436" textAnchor="middle" fontSize="10" className="fill-amber-300" fontWeight="600">
          The Core Idea
        </text>
        <text x="300" y="452" textAnchor="middle" fontSize="10" className="fill-gray-300">
          If marked animals mix evenly, the fraction of marked in your second sample equals
        </text>
        <text x="300" y="465" textAnchor="middle" fontSize="10" className="fill-gray-300">
          the fraction of marked in the whole population. Same logic as mixing coloured beads in a jar.
        </text>
      </svg>
    </div>
  );
}
