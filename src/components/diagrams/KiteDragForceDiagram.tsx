const KiteDragForceDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing drag vs lift forces on a kite and the role of the tail as stabilizer"
      >
        <style>{`
          @keyframes tailSway {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-3deg); }
            100% { transform: rotate(0deg); }
          }
          .tail-sway {
            transform-origin: 165px 240px;
            animation: tailSway 3s ease-in-out infinite;
          }
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
        `}</style>

        <defs>
          <marker id="kd-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80" />
          </marker>
          <marker id="kd-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
          </marker>
          <marker id="kd-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="520" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          The Tug of War: Drag vs Lift
        </text>

        {/* === LEFT: Kite with tail (stable) === */}
        <rect x="20" y="40" width="270" height="240" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.5" />
        <text x="155" y="58" textAnchor="middle"
          className="section-title fill-green-600 dark:fill-green-400">
          WITH TAIL — Stable
        </text>

        {/* Kite diamond shape */}
        <polygon points="155,80 195,160 155,240 115,160"
          className="fill-amber-300 dark:fill-amber-500" stroke="#d97706" strokeWidth="1.5" />
        <line x1="115" y1="160" x2="195" y2="160" stroke="#92400e" strokeWidth="1" opacity="0.5" />
        <line x1="155" y1="80" x2="155" y2="240" stroke="#92400e" strokeWidth="1" opacity="0.5" />

        {/* Tail (animated sway) */}
        <g className="tail-sway">
          <polyline points="155,240 148,260 162,275 145,290 158,305 150,320"
            fill="none" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Lift arrow */}
        <line x1="155" y1="160" x2="155" y2="95"
          stroke="#4ade80" strokeWidth="2.5" markerEnd="url(#kd-arrow-green)" />
        <text x="168" y="100" className="label-text fill-green-500 dark:fill-green-400" fontWeight="600">
          Lift
        </text>

        {/* Drag arrow */}
        <line x1="155" y1="160" x2="220" y2="160"
          stroke="#f87171" strokeWidth="2.5" markerEnd="url(#kd-arrow-red)" />
        <text x="224" y="164" className="label-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Drag
        </text>

        {/* Tail drag label */}
        <line x1="150" y1="310" x2="190" y2="310"
          stroke="#e879f9" strokeWidth="1.5" markerEnd="url(#kd-arrow-red)" />
        <text x="132" y="340" className="fact-text fill-purple-500 dark:fill-purple-400">
          Tail adds drag
        </text>
        <text x="132" y="352" className="fact-text fill-purple-500 dark:fill-purple-400">
          behind the kite
        </text>

        {/* === RIGHT: Kite without tail (unstable) === */}
        <rect x="310" y="40" width="270" height="240" rx="6"
          className="fill-red-50 dark:fill-red-950" opacity="0.5" />
        <text x="445" y="58" textAnchor="middle"
          className="section-title fill-red-600 dark:fill-red-400">
          WITHOUT TAIL — Unstable
        </text>

        {/* Kite diamond shape (tilted / spinning) */}
        <g transform="translate(445, 160) rotate(25)">
          <polygon points="0,-80 40,0 0,80 -40,0"
            className="fill-amber-300 dark:fill-amber-500" stroke="#d97706" strokeWidth="1.5" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#92400e" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="-80" x2="0" y2="80" stroke="#92400e" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Spin arrows */}
        <path d="M 480 110 A 40 40 0 0 1 490 140" fill="none" stroke="#f87171" strokeWidth="2"
          markerEnd="url(#kd-arrow-red)" />
        <path d="M 410 210 A 40 40 0 0 1 400 180" fill="none" stroke="#f87171" strokeWidth="2"
          markerEnd="url(#kd-arrow-red)" />
        <text x="494" y="120" className="label-text fill-red-500 dark:fill-red-400" fontWeight="600">
          Spins!
        </text>

        {/* === BOTTOM: Force balance explanation === */}
        {/* String angle diagram */}
        <rect x="20" y="370" width="270" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="155" y="390" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          String Angle Reveals the Balance
        </text>

        {/* Ground line */}
        <line x1="80" y1="480" x2="200" y2="480"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />

        {/* Person */}
        <circle cx="90" cy="465" r="5" className="fill-slate-400 dark:fill-slate-500" />
        <line x1="90" y1="470" x2="90" y2="480"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* String at 45 degrees */}
        <line x1="90" y1="465" x2="160" y2="410"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />

        {/* Kite dot */}
        <circle cx="160" cy="410" r="4" className="fill-amber-400 dark:fill-amber-500" />

        {/* Angle arc */}
        <path d="M 90 450 A 20 20 0 0 1 103 440" fill="none"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="100" y="448" className="fact-text fill-slate-500 dark:fill-slate-400">
          45°
        </text>

        {/* Labels */}
        <text x="60" y="420" className="fact-text fill-slate-600 dark:fill-slate-300">
          45° string = equal lift &amp; drag
        </text>
        <text x="60" y="433" className="fact-text fill-slate-600 dark:fill-slate-300">
          Steep string = more lift than drag
        </text>
        <text x="60" y="446" className="fact-text fill-slate-600 dark:fill-slate-300">
          (efficient kite flies nearly overhead)
        </text>

        {/* Drag equation box */}
        <rect x="310" y="370" width="270" height="130" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
        <text x="445" y="390" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Why Drag Grows So Fast
        </text>
        <text x="445" y="412" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600" fontSize="13">
          F = ½pv²C&#8208;A
        </text>
        <text x="320" y="432" className="fact-text fill-slate-600 dark:fill-slate-300">
          v² means: double the wind speed
        </text>
        <text x="320" y="445" className="fact-text fill-slate-600 dark:fill-slate-300">
          → FOUR times the drag force.
        </text>
        <text x="320" y="462" className="fact-text fill-slate-600 dark:fill-slate-300">
          This is why kites rip apart in gusts,
        </text>
        <text x="320" y="475" className="fact-text fill-slate-600 dark:fill-slate-300">
          and why Biren’s flexible bamboo survived.
        </text>
        <text x="320" y="492" className="fact-text fill-amber-600 dark:fill-amber-400" fontWeight="600">
          The tail absorbs gust energy as drag.
        </text>
      </svg>
    </div>
  );
};

export default KiteDragForceDiagram;
