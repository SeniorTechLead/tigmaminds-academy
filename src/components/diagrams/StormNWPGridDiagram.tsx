const StormNWPGridDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 471"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Three-dimensional view of NWP grid showing atmosphere divided into vertical columns and layers with equations propagating between boxes"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .small-text { font-family: system-ui, sans-serif; font-size: 8.5px; }
        `}</style>

        <defs>
          <marker id="nwpg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="nwpg-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          NWP Grid in 3D — Dividing the Atmosphere into Boxes
        </text>

        {/* 3D grid — isometric view */}
        {/* Ground grid (4x4) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`ground-${i}`}>
            {/* Horizontal lines (going right-back) */}
            <line
              x1={120 + i * 50} y1={300 - i * 15}
              x2={320 + i * 50} y2={200 - i * 15}
              className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0.8" opacity="0.6" />
            {/* Vertical lines (going right-front) */}
            <line
              x1={120 + i * 50} y1={300 - i * 15}
              x2={120 + i * 50 + 200} y2={300 - i * 15 - 100}
              className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0" />
          </g>
        ))}

        {/* Column lines going left-right */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`col-${i}`}
            x1={120 + i * 50} y1={300 - i * 15}
            x2={120 + 200 + i * 50} y2={300 - 100 - i * 15}
            className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0.8" opacity="0.6" />
        ))}

        {/* Draw back-to-front lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`row-${i}`}
            x1={120 + i * 50} y1={300 - i * 15}
            x2={320 + i * 50} y2={200 - i * 15}
            className="stroke-blue-300 dark:stroke-blue-600" strokeWidth="0.8" opacity="0.6" />
        ))}

        {/* Highlighted column — vertical stack of boxes */}
        {/* Column base */}
        <rect x="218" y="255" width="48" height="15" rx="2"
          className="fill-green-300 dark:fill-green-700" opacity="0.7"
          stroke="#22c55e" strokeWidth="1" />
        <text x="242" y="265" textAnchor="middle"
          className="small-text fill-green-800 dark:fill-green-200">Ground</text>

        {/* Vertical layers */}
        {[0, 1, 2, 3, 4].map((layer) => {
          const y = 240 - layer * 38;
          const opacity = 0.7 - layer * 0.08;
          const colors = [
            'fill-blue-300 dark:fill-blue-600',
            'fill-blue-200 dark:fill-blue-700',
            'fill-sky-200 dark:fill-sky-700',
            'fill-sky-100 dark:fill-sky-800',
            'fill-slate-200 dark:fill-slate-700',
          ];
          return (
            <g key={`layer-${layer}`}>
              <rect x="218" y={y} width="48" height="35" rx="3"
                className={colors[layer]} opacity={opacity}
                stroke="#3b82f6" strokeWidth="1" />
              <text x="242" y={y + 20} textAnchor="middle"
                className="small-text fill-blue-800 dark:fill-blue-200">
                L{layer + 1}
              </text>
            </g>
          );
        })}

        {/* Vertical arrow beside column */}
        <line x1="275" y1="250" x2="275" y2="75"
          className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5"
          strokeDasharray="4,3" markerEnd="url(#nwpg-arrow)" />
        <text x="285" y="160" textAnchor="start"
          className="label-text fill-amber-600 dark:fill-amber-400">
          Altitude ↑
        </text>

        {/* Label: column */}
        <line x1="242" y1="88" x2="242" y2="65"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" />
        <text x="242" y="58" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          One column
        </text>

        {/* Propagation arrows between boxes */}
        {/* Horizontal to neighbor */}
        <line x1="268" y1="170" x2="310" y2="160"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#nwpg-blue)" />
        <line x1="268" y1="135" x2="310" y2="125"
          stroke="#3b82f6" strokeWidth="2" markerEnd="url(#nwpg-blue)" />

        {/* Vertical between layers */}
        <line x1="232" y1="167" x2="232" y2="145"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#nwpg-arrow)" />
        <line x1="252" y1="130" x2="252" y2="108"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#nwpg-arrow)" />

        {/* Right side: explanation */}
        <rect x="350" y="55" width="230" height="200" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />

        <text x="465" y="78" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          How the Grid Works
        </text>

        {/* Step list */}
        {[
          { n: '1', text: 'Divide atmosphere into', text2: 'millions of 3D boxes' },
          { n: '2', text: 'Each box stores: temperature,', text2: 'pressure, wind, humidity' },
          { n: '3', text: 'Physics equations calculate', text2: 'how each box changes' },
          { n: '4', text: 'Each box sends its results', text2: 'to its neighbors →' },
        ].map((item, i) => (
          <g key={`step-${i}`}>
            <circle cx="370" cy={103 + i * 42} r="9"
              className="fill-blue-200 dark:fill-blue-800 stroke-blue-500 dark:stroke-blue-400" strokeWidth="1" />
            <text x="370" y={107 + i * 42} textAnchor="middle"
              className="small-text fill-blue-700 dark:fill-blue-300" fontWeight="700">{item.n}</text>
            <text x="385" y={100 + i * 42} textAnchor="start"
              className="label-text fill-slate-600 dark:fill-slate-300">{item.text}</text>
            <text x="385" y={113 + i * 42} textAnchor="start"
              className="label-text fill-slate-600 dark:fill-slate-300">{item.text2}</text>
          </g>
        ))}

        {/* Resolution note */}
        <rect x="350" y="270" width="230" height="50" rx="6"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.7" />
        <text x="465" y="290" textAnchor="middle"
          className="step-text fill-amber-700 dark:fill-amber-300">
          Smaller boxes = better accuracy
        </text>
        <text x="465" y="306" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          But needs much more computing power!
        </text>

        {/* Legend */}
        <rect x="50" y="340" width="500" height="50" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.6" />
        <line x1="70" y1="358" x2="95" y2="358"
          stroke="#f59e0b" strokeWidth="2" />
        <text x="102" y="362" className="label-text fill-slate-600 dark:fill-slate-300">
          Vertical exchange (between layers)
        </text>
        <line x1="70" y1="378" x2="95" y2="378"
          stroke="#3b82f6" strokeWidth="2" />
        <text x="102" y="382" className="label-text fill-slate-600 dark:fill-slate-300">
          Horizontal exchange (between neighboring columns)
        </text>

        {/* Bottom caption */}
        <rect x="60" y="405" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="421" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Every box talks to its neighbors — that is how weather moves through the model
        </text>
      </svg>
    </div>
  );
};

export default StormNWPGridDiagram;
