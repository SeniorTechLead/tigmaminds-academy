const NewtonForceDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 600 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Free-body diagram showing forces on an object with Newton's Third Law"
      >
        <style>{`
          @keyframes pulseArrow {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.15); }
          }
          .applied-force {
            animation: pulseArrow 2s ease-in-out infinite;
            transform-origin: 300px 145px;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
        `}</style>

        <defs>
          {/* Arrowhead markers */}
          <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="arrow-orange" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>
          <marker id="arrow-gray" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-600 dark:fill-slate-300" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Ground line */}
        <line x1="180" y1="195" x2="420" y2="195"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        {/* Hatch marks for ground */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <line key={i}
            x1={185 + i * 20} y1="195"
            x2={175 + i * 20} y2="205"
            className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        ))}

        {/* Object block — rhino silhouette abstracted as a rounded rectangle */}
        <rect x="260" y="135" width="80" height="60" rx="6"
          className="fill-slate-200 dark:fill-slate-700 stroke-slate-500 dark:stroke-slate-400"
          strokeWidth="2" />
        {/* Rhino horn */}
        <polygon points="340,155 355,145 342,148"
          className="fill-slate-400 dark:fill-slate-500" />
        {/* Rhino ear */}
        <ellipse cx="270" cy="135" rx="6" ry="8"
          className="fill-slate-300 dark:fill-slate-600 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1" />
        {/* Rhino eye */}
        <circle cx="330" cy="150" r="3"
          className="fill-slate-600 dark:fill-slate-300" />
        {/* Rhino legs */}
        <rect x="275" y="190" width="8" height="5" rx="1"
          className="fill-slate-400 dark:fill-slate-500" />
        <rect x="318" y="190" width="8" height="5" rx="1"
          className="fill-slate-400 dark:fill-slate-500" />

        <text x="300" y="175" textAnchor="middle"
          className="label-text fill-slate-700 dark:fill-slate-200">
          Rhino
        </text>

        {/* Gravity arrow — DOWN */}
        <line x1="300" y1="200" x2="300" y2="248"
          stroke="#ef4444" strokeWidth="3.5" markerEnd="url(#arrow-red)" />
        <text x="300" y="268" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Weight (mg)
        </text>

        {/* Normal force arrow — UP */}
        <line x1="300" y1="130" x2="300" y2="82"
          stroke="#3b82f6" strokeWidth="3.5" markerEnd="url(#arrow-blue)" />
        <text x="300" y="74" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Normal force (N)
        </text>

        {/* Applied force arrow — RIGHT (animated) */}
        <g className="applied-force">
          <line x1="345" y1="145" x2="415" y2="145"
            stroke="#22c55e" strokeWidth="3.5" markerEnd="url(#arrow-green)" />
          <text x="425" y="149" textAnchor="start"
            className="label-text fill-green-600 dark:fill-green-400">
            Applied force
          </text>
          <text x="425" y="162" textAnchor="start"
            className="label-text fill-green-600 dark:fill-green-400">
            (push)
          </text>
        </g>

        {/* Friction arrow — LEFT */}
        <line x1="255" y1="175" x2="185" y2="175"
          stroke="#f97316" strokeWidth="3.5" markerEnd="url(#arrow-orange)" />
        <text x="175" y="179" textAnchor="end"
          className="label-text fill-orange-600 dark:fill-orange-400">
          Friction
        </text>

        {/* Divider */}
        <line x1="50" y1="285" x2="550" y2="285"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 4" />

        {/* Newton's Third Law section */}
        <text x="300" y="305" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Newton's Third Law
        </text>

        {/* Left hand */}
        <g transform="translate(195, 312)">
          <rect x="0" y="0" width="30" height="18" rx="4"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          {/* Fingers */}
          <rect x="30" y="2" width="10" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
          <rect x="30" y="7" width="12" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
          <rect x="30" y="12" width="10" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        </g>

        {/* Right hand (mirrored) */}
        <g transform="translate(355, 312)">
          <rect x="20" y="0" width="30" height="18" rx="4"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
          <rect x="8" y="2" width="12" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
          <rect x="6" y="7" width="14" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
          <rect x="8" y="12" width="12" height="4" rx="2"
            className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1" />
        </g>

        {/* Action arrow (right) */}
        <line x1="250" y1="316" x2="280" y2="316"
          className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2.5" markerEnd="url(#arrow-gray)" />
        {/* Reaction arrow (left) */}
        <line x1="350" y1="326" x2="320" y2="326"
          className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2.5" markerEnd="url(#arrow-gray)" />

        <text x="300" y="344" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" style={{ fontSize: '10px' }}>
          Action = Reaction
        </text>
      </svg>
    </div>
  );
};

export default NewtonForceDiagram;
