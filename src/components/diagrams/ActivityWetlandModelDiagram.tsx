export default function ActivityWetlandModelDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 380" className="w-full max-w-2xl mx-auto" role="img" aria-label="Activity diagram showing how to build a mini floating island model with a bowl of water and sponges">
        <rect width="560" height="380" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="280" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Activity: Build a Mini Phumdi</text>
        <text x="280" y="44" textAnchor="middle" fontSize="10" fill="#fcd34d" opacity="0.7">Model a floating island in a bowl of water</text>

        {/* Step 1: Bowl with water */}
        <g>
          <text x="100" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#60a5fa">Step 1</text>
          <text x="100" y="95" textAnchor="middle" fontSize="8" fill="#93c5fd">Fill a large bowl</text>
          <text x="100" y="107" textAnchor="middle" fontSize="8" fill="#93c5fd">with water</text>

          {/* Bowl */}
          <ellipse cx="100" cy="180" rx="70" ry="20" fill="#1e3a5f" opacity="0.5" />
          <path d="M30,155 Q30,185 100,200 Q170,185 170,155" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <ellipse cx="100" cy="155" rx="70" ry="15" fill="none" stroke="#60a5fa" strokeWidth="2" />
          {/* Water */}
          <ellipse cx="100" cy="168" rx="60" ry="10" fill="#3b82f6" opacity="0.3" />
        </g>

        {/* Step 2: Sponge + soil + grass */}
        <g>
          <text x="290" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#22c55e">Step 2</text>
          <text x="290" y="95" textAnchor="middle" fontSize="8" fill="#4ade80">Layer: sponge + soil</text>
          <text x="290" y="107" textAnchor="middle" fontSize="8" fill="#4ade80">+ grass clippings</text>

          {/* Sponge layers */}
          <rect x="250" y="130" width="80" height="15" rx="3" fill="#fbbf24" opacity="0.4" />
          <text x="290" y="141" textAnchor="middle" fontSize="7" fill="#fcd34d">Sponge</text>

          <rect x="250" y="148" width="80" height="12" rx="2" fill="#78350f" opacity="0.5" />
          <text x="290" y="158" textAnchor="middle" fontSize="7" fill="#d4a373">Soil</text>

          <rect x="250" y="163" width="80" height="10" rx="2" fill="#166534" opacity="0.5" />
          <text x="290" y="171" textAnchor="middle" fontSize="7" fill="#4ade80">Grass</text>

          {/* More sponge */}
          <rect x="250" y="176" width="80" height="12" rx="3" fill="#fbbf24" opacity="0.3" />
          <text x="290" y="185" textAnchor="middle" fontSize="7" fill="#fcd34d">Sponge</text>

          {/* Arrow to combine */}
          <path d="M290,195 L290,210" stroke="white" strokeWidth="1.5" markerEnd="url(#actArrow)" />

          {/* Combined phumdi model */}
          <rect x="255" y="215" width="70" height="30" rx="6" fill="#5b4020" opacity="0.7" stroke="#92400e" strokeWidth="1" />
          {[265, 280, 295, 310].map((x, i) => (
            <line key={i} x1={x} y1={215} x2={x - 2} y2={200 - (i % 2) * 3} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </g>

        {/* Step 3: Float it */}
        <g>
          <text x="470" y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f59e0b">Step 3</text>
          <text x="470" y="95" textAnchor="middle" fontSize="8" fill="#fcd34d">Float on water &</text>
          <text x="470" y="107" textAnchor="middle" fontSize="8" fill="#fcd34d">test with coins</text>

          {/* Bowl with floating phumdi */}
          <ellipse cx="470" cy="190" rx="70" ry="20" fill="#1e3a5f" opacity="0.5" />
          <path d="M400,165 Q400,195 470,210 Q540,195 540,165" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <ellipse cx="470" cy="165" rx="70" ry="15" fill="none" stroke="#60a5fa" strokeWidth="2" />
          {/* Water */}
          <ellipse cx="470" cy="175" rx="60" ry="10" fill="#3b82f6" opacity="0.3" />
          {/* Floating phumdi */}
          <rect x="445" y="168" width="50" height="16" rx="4" fill="#5b4020" opacity="0.7" />
          {[455, 468, 480].map((x, i) => (
            <line key={i} x1={x} y1={168} x2={x} y2={158} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
          ))}
          {/* Coin */}
          <circle cx="470" cy="172" r="5" fill="#fbbf24" opacity="0.6" stroke="#d97706" strokeWidth="0.5" />
          <text x="470" y="175" textAnchor="middle" fontSize="5" fill="#92400e">1</text>
        </g>

        {/* Questions to investigate */}
        <rect x="30" y="270" width="500" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" opacity="0.5" />
        <text x="280" y="292" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Investigate:</text>
        <text x="50" y="310" fontSize="9" fill="#d1d5db">1. How many coins (= deer weight) can your phumdi hold before sinking?</text>
        <text x="50" y="326" fontSize="9" fill="#d1d5db">2. Add more water (= dam raising level). Does the phumdi still float the same?</text>
        <text x="50" y="342" fontSize="9" fill="#d1d5db">3. Remove some sponge layers (= phumdi thinning). How does capacity change?</text>
        <text x="50" y="358" fontSize="9" fill="#d1d5db">4. That is carrying capacity: the maximum load before the system fails.</text>

        <defs>
          <marker id="actArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="white" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
