const KiteShapesDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 540"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram comparing three kite shapes: diamond, delta, and box kite, with their physics tradeoffs"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 12px;
            font-weight: 600;
          }
          .section-title {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .fact-text {
            font-family: system-ui, sans-serif;
            font-size: 9.5px;
          }
          .kite-name {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 700;
          }
        `}</style>

        {/* Background */}
        <rect width="600" height="540" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Why Shape Matters — Three Classic Kite Designs
        </text>

        {/* === DIAMOND KITE === */}
        <rect x="15" y="42" width="180" height="250" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.5" />
        <text x="105" y="62" textAnchor="middle"
          className="kite-name fill-amber-700 dark:fill-amber-300">
          Diamond
        </text>

        {/* Diamond shape */}
        <polygon points="105,80 145,150 105,220 65,150"
          className="fill-amber-200 dark:fill-amber-700" stroke="#d97706" strokeWidth="2" />
        <line x1="65" y1="150" x2="145" y2="150" stroke="#92400e" strokeWidth="1" opacity="0.6" />
        <line x1="105" y1="80" x2="105" y2="220" stroke="#92400e" strokeWidth="1" opacity="0.6" />

        {/* Tail */}
        <polyline points="105,220 100,235 110,248 102,260"
          fill="none" stroke="#e879f9" strokeWidth="2" strokeLinecap="round" />

        {/* Bridle strings */}
        <line x1="105" y1="120" x2="105" y2="150" stroke="#78716c" strokeWidth="1" strokeDasharray="3 2" />

        {/* Properties */}
        <text x="25" y="280" className="fact-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          ✓ Simplest to build
        </text>
        <text x="25" y="293" className="fact-text fill-green-600 dark:fill-green-400">
          ✓ Needs tail for stability
        </text>
        <text x="25" y="306" className="fact-text fill-red-500 dark:fill-red-400">
          ✗ Less efficient lift
        </text>
        <text x="25" y="319" className="fact-text fill-blue-500 dark:fill-blue-400">
          Best for: light to moderate wind
        </text>

        {/* === DELTA KITE === */}
        <rect x="210" y="42" width="180" height="250" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.5" />
        <text x="300" y="62" textAnchor="middle"
          className="kite-name fill-sky-700 dark:fill-sky-300">
          Delta
        </text>

        {/* Delta shape (triangle with keel) */}
        <polygon points="300,80 360,200 240,200"
          className="fill-sky-200 dark:fill-sky-700" stroke="#0369a1" strokeWidth="2" />
        {/* Spreader bar */}
        <line x1="260" y1="170" x2="340" y2="170" stroke="#0369a1" strokeWidth="1.5" />
        {/* Spine */}
        <line x1="300" y1="80" x2="300" y2="200" stroke="#0369a1" strokeWidth="1" opacity="0.6" />
        {/* Keel triangle */}
        <polygon points="300,120 300,200 285,200"
          fill="#60a5fa" opacity="0.3" stroke="#60a5fa" strokeWidth="1" />
        <text x="278" y="190" className="fact-text fill-blue-500 dark:fill-blue-400" fontSize="8">
          keel
        </text>

        {/* Properties */}
        <text x="220" y="280" className="fact-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          ✓ Best lift-to-drag ratio
        </text>
        <text x="220" y="293" className="fact-text fill-green-600 dark:fill-green-400">
          ✓ Keel replaces tail
        </text>
        <text x="220" y="306" className="fact-text fill-green-600 dark:fill-green-400">
          ✓ Flies in light wind
        </text>
        <text x="220" y="319" className="fact-text fill-red-500 dark:fill-red-400">
          ✗ Struggles in strong gusts
        </text>

        {/* === BOX KITE === */}
        <rect x="405" y="42" width="180" height="250" rx="6"
          className="fill-green-50 dark:fill-green-950" opacity="0.5" />
        <text x="495" y="62" textAnchor="middle"
          className="kite-name fill-green-700 dark:fill-green-300">
          Box
        </text>

        {/* Box kite (3D rectangular frame) */}
        {/* Front face top cell */}
        <rect x="465" y="85" width="60" height="40"
          className="fill-green-200 dark:fill-green-700" stroke="#15803d" strokeWidth="1.5" />
        {/* Front face bottom cell */}
        <rect x="465" y="165" width="60" height="40"
          className="fill-green-200 dark:fill-green-700" stroke="#15803d" strokeWidth="1.5" />
        {/* Frame verticals */}
        <line x1="465" y1="85" x2="465" y2="205" stroke="#15803d" strokeWidth="1.5" />
        <line x1="525" y1="85" x2="525" y2="205" stroke="#15803d" strokeWidth="1.5" />
        {/* Depth lines (3D effect) */}
        <line x1="465" y1="85" x2="445" y2="100" stroke="#15803d" strokeWidth="1" opacity="0.5" />
        <line x1="465" y1="125" x2="445" y2="140" stroke="#15803d" strokeWidth="1" opacity="0.5" />
        <line x1="465" y1="165" x2="445" y2="180" stroke="#15803d" strokeWidth="1" opacity="0.5" />
        <line x1="465" y1="205" x2="445" y2="220" stroke="#15803d" strokeWidth="1" opacity="0.5" />
        {/* Back verticals */}
        <line x1="445" y1="100" x2="445" y2="220" stroke="#15803d" strokeWidth="1" opacity="0.5" />
        {/* Open middle section label */}
        <text x="475" y="155" className="fact-text fill-slate-400 dark:fill-slate-500" fontSize="8">
          open
        </text>

        {/* Properties */}
        <text x="415" y="280" className="fact-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          ✓ Most lift in strong wind
        </text>
        <text x="415" y="293" className="fact-text fill-green-600 dark:fill-green-400">
          ✓ No tail needed (self-stable)
        </text>
        <text x="415" y="306" className="fact-text fill-green-600 dark:fill-green-400">
          ✓ 3D shape catches wind on all sides
        </text>
        <text x="415" y="319" className="fact-text fill-red-500 dark:fill-red-400">
          ✗ Hardest to build; heavy
        </text>

        {/* === BOTTOM: Comparison and physics insight === */}
        <rect x="15" y="345" width="570" height="80" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="300" y="365" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          The Physics Trade-Off
        </text>
        <text x="300" y="385" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          More surface area = more lift, but also more drag and more weight.
        </text>
        <text x="300" y="400" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          Flat kites (diamond, delta) are light but need tails or keels for stability.
        </text>
        <text x="300" y="415" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          3D kites (box) are inherently stable but heavier — they need stronger wind to fly.
        </text>

        {/* Story connection */}
        <rect x="15" y="440" width="570" height="80" rx="6"
          className="fill-amber-50 dark:fill-amber-950 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="300" y="460" textAnchor="middle"
          className="section-title fill-amber-700 dark:fill-amber-300">
          Biren’s Diamond Kite — Why It Won
        </text>
        <text x="300" y="480" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          Bamboo frame flexed in gusts instead of breaking. Newspaper let some air through, reducing drag.
        </text>
        <text x="300" y="495" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          The dihedral angle (slight curve) gave natural stability. The plastic-bag tail absorbed gust energy.
        </text>
        <text x="300" y="510" textAnchor="middle"
          className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          He matched his design to the wind conditions — that’s engineering.
        </text>
      </svg>
    </div>
  );
};

export default KiteShapesDiagram;
