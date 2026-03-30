const KiteLiftDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how a kite generates lift from wind and angle of attack"
      >
        <style>{`
          @keyframes windFlow {
            0% { transform: translateX(0); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(80px); opacity: 0; }
          }
          .wind-particle {
            animation: windFlow 2s linear infinite;
          }
          .wind-p2 { animation-delay: 0.5s; }
          .wind-p3 { animation-delay: 1s; }
          .wind-p4 { animation-delay: 1.5s; }
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
          <marker id="kl-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="kl-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
          </marker>
          <marker id="kl-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80" />
          </marker>
          <marker id="kl-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
          <marker id="kl-arrow-white" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-700 dark:fill-slate-200" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="480" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          How a Kite Generates Lift
        </text>

        {/* === MAIN DIAGRAM: Kite cross-section with forces === */}
        {/* Sky background */}
        <rect x="30" y="40" width="540" height="260" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.5" />

        {/* Wind arrows (animated) */}
        {[0,1,2,3].map((i) => (
          <g key={i}>
            <line x1={60} y1={120 + i * 40} x2={120} y2={120 + i * 40}
              stroke="#60a5fa" strokeWidth="2" markerEnd="url(#kl-arrow-blue)"
              className={`wind-particle ${i > 0 ? `wind-p${i + 1}` : ''}`}
              opacity="0.7" />
          </g>
        ))}
        <text x="50" y="108" className="label-text fill-blue-500 dark:fill-blue-400" fontWeight="600">
          WIND
        </text>

        {/* Kite body (tilted rectangle) */}
        <g transform="translate(280, 170) rotate(-20)">
          {/* Kite surface */}
          <rect x="-70" y="-4" width="140" height="8" rx="2"
            className="fill-amber-400 dark:fill-amber-500" stroke="#d97706" strokeWidth="1.5" />

          {/* Angle of attack arc */}
          <path d="M 70 0 A 40 40 0 0 1 66 14" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="82" y="12" className="label-text fill-red-500 dark:fill-red-400" fontSize="9">
            angle of
          </text>
          <text x="82" y="22" className="label-text fill-red-500 dark:fill-red-400" fontSize="9">
            attack
          </text>
        </g>

        {/* Horizontal wind direction reference line */}
        <line x1="200" y1="170" x2="400" y2="170"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />

        {/* LIFT arrow (up) */}
        <line x1="280" y1="170" x2="280" y2="80"
          stroke="#4ade80" strokeWidth="3" markerEnd="url(#kl-arrow-green)" />
        <text x="260" y="74" className="section-title fill-green-500 dark:fill-green-400">
          LIFT
        </text>

        {/* DRAG arrow (right, in wind direction) */}
        <line x1="280" y1="170" x2="380" y2="170"
          stroke="#f87171" strokeWidth="3" markerEnd="url(#kl-arrow-red)" />
        <text x="384" y="174" className="section-title fill-red-500 dark:fill-red-400">
          DRAG
        </text>

        {/* WEIGHT arrow (down) */}
        <line x1="280" y1="170" x2="280" y2="240"
          stroke="#fbbf24" strokeWidth="3" markerEnd="url(#kl-arrow-amber)" />
        <text x="260" y="256" className="section-title fill-amber-500 dark:fill-amber-400">
          WEIGHT
        </text>

        {/* STRING / TENSION arrow (down-left) */}
        <line x1="280" y1="170" x2="210" y2="260"
          className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" strokeDasharray="6 3" />
        <text x="190" y="272" className="label-text fill-slate-500 dark:fill-slate-400" fontWeight="600">
          STRING TENSION
        </text>

        {/* Air deflection arrows below kite */}
        <path d="M 230 180 Q 260 200 310 195" fill="none" stroke="#60a5fa" strokeWidth="1.5"
          markerEnd="url(#kl-arrow-blue)" opacity="0.6" />
        <text x="310" y="210" className="fact-text fill-blue-400 dark:fill-blue-300">
          Air deflected downward
        </text>

        {/* Low pressure label above */}
        <rect x="230" y="130" width="100" height="18" rx="3"
          className="fill-green-100 dark:fill-green-900" opacity="0.6" />
        <text x="280" y="143" textAnchor="middle"
          className="fact-text fill-green-600 dark:fill-green-400" fontWeight="600">
          LOW PRESSURE
        </text>

        {/* High pressure label below */}
        <rect x="230" y="185" width="100" height="18" rx="3"
          className="fill-red-100 dark:fill-red-900" opacity="0.6" />
        <text x="280" y="198" textAnchor="middle"
          className="fact-text fill-red-600 dark:fill-red-400" fontWeight="600">
          HIGH PRESSURE
        </text>

        {/* === BOTTOM: Explanation boxes === */}
        {/* Newton explanation */}
        <rect x="30" y="320" width="260" height="70" rx="6"
          className="fill-blue-50 dark:fill-blue-950 stroke-blue-200 dark:stroke-blue-800" strokeWidth="1" />
        <text x="40" y="338" className="section-title fill-blue-600 dark:fill-blue-400">
          Newton’s View
        </text>
        <text x="40" y="354" className="fact-text fill-slate-600 dark:fill-slate-300">
          The tilted kite pushes air downward.
        </text>
        <text x="40" y="367" className="fact-text fill-slate-600 dark:fill-slate-300">
          By Newton’s 3rd law, the air pushes
        </text>
        <text x="40" y="380" className="fact-text fill-slate-600 dark:fill-slate-300">
          the kite upward. Action = reaction.
        </text>

        {/* Bernoulli explanation */}
        <rect x="310" y="320" width="260" height="70" rx="6"
          className="fill-green-50 dark:fill-green-950 stroke-green-200 dark:stroke-green-800" strokeWidth="1" />
        <text x="320" y="338" className="section-title fill-green-600 dark:fill-green-400">
          Bernoulli’s View
        </text>
        <text x="320" y="354" className="fact-text fill-slate-600 dark:fill-slate-300">
          Air speeds up over the top surface.
        </text>
        <text x="320" y="367" className="fact-text fill-slate-600 dark:fill-slate-300">
          Faster air = lower pressure above.
        </text>
        <text x="320" y="380" className="fact-text fill-slate-600 dark:fill-slate-300">
          Pressure difference pushes kite up.
        </text>

        {/* Key insight */}
        <rect x="30" y="405" width="540" height="60" rx="6"
          className="fill-amber-50 dark:fill-amber-950 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="300" y="425" textAnchor="middle"
          className="section-title fill-amber-700 dark:fill-amber-300">
          Both views describe the SAME physics
        </text>
        <text x="300" y="442" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          The kite deflects air AND creates a pressure difference — two descriptions of one process.
        </text>
        <text x="300" y="455" textAnchor="middle"
          className="fact-text fill-slate-600 dark:fill-slate-300">
          No wind = no airflow = no lift. The wind is the kite’s engine.
        </text>
      </svg>
    </div>
  );
};

export default KiteLiftDiagram;
