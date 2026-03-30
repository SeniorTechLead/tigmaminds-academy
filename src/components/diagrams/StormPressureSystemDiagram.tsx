const StormPressureSystemDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 445"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Weather map showing high and low pressure systems with concentric isobars and wind direction arrows"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .big-label { font-family: system-ui, sans-serif; font-size: 22px; font-weight: 700; }
          .isobar-label { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <defs>
          <marker id="ps-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="ps-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          High and Low Pressure Systems on a Weather Map
        </text>

        {/* HIGH PRESSURE SYSTEM (left) */}
        {/* Concentric isobars */}
        {[90, 70, 50, 30].map((r, i) => (
          <circle key={`h-${i}`} cx="170" cy="200" r={r}
            fill="none" className="stroke-blue-300 dark:stroke-blue-600"
            strokeWidth="1.2" strokeDasharray="4,3" />
        ))}

        {/* Isobar labels */}
        <text x="170" y={200 - 92} textAnchor="middle"
          className="isobar-label fill-blue-500 dark:fill-blue-400">1020</text>
        <text x="170" y={200 - 72} textAnchor="middle"
          className="isobar-label fill-blue-500 dark:fill-blue-400">1022</text>
        <text x="170" y={200 - 52} textAnchor="middle"
          className="isobar-label fill-blue-500 dark:fill-blue-400">1024</text>
        <text x="170" y={200 - 32} textAnchor="middle"
          className="isobar-label fill-blue-500 dark:fill-blue-400">1026</text>

        {/* H label */}
        <text x="170" y="208" textAnchor="middle"
          className="big-label fill-blue-600 dark:fill-blue-400">H</text>

        {/* Clockwise wind arrows (high pressure, Northern Hemisphere - diverging clockwise) */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const r = 75;
          const cx = 170, cy = 200;
          const x1 = cx + Math.cos(rad) * (r - 15);
          const y1 = cy + Math.sin(rad) * (r - 15);
          // Clockwise tangent
          const tangentAngle = rad + Math.PI / 2;
          const x2 = x1 + Math.cos(tangentAngle) * 20;
          const y2 = y1 + Math.sin(tangentAngle) * 20;
          return (
            <line key={`hw-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#3b82f6" strokeWidth="2" markerEnd="url(#ps-blue)" />
          );
        })}

        <text x="170" y="310" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          High Pressure
        </text>
        <text x="170" y="325" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Winds spiral clockwise (NH)
        </text>
        <text x="170" y="339" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          Clear skies, stable weather
        </text>

        {/* LOW PRESSURE SYSTEM (right) */}
        {/* Concentric isobars */}
        {[90, 70, 50, 30].map((r, i) => (
          <circle key={`l-${i}`} cx="430" cy="200" r={r}
            fill="none" className="stroke-red-300 dark:stroke-red-600"
            strokeWidth="1.2" strokeDasharray="4,3" />
        ))}

        {/* Isobar labels */}
        <text x="430" y={200 - 92} textAnchor="middle"
          className="isobar-label fill-red-500 dark:fill-red-400">1004</text>
        <text x="430" y={200 - 72} textAnchor="middle"
          className="isobar-label fill-red-500 dark:fill-red-400">1002</text>
        <text x="430" y={200 - 52} textAnchor="middle"
          className="isobar-label fill-red-500 dark:fill-red-400">1000</text>
        <text x="430" y={200 - 32} textAnchor="middle"
          className="isobar-label fill-red-500 dark:fill-red-400">998</text>

        {/* L label */}
        <text x="430" y="208" textAnchor="middle"
          className="big-label fill-red-600 dark:fill-red-400">L</text>

        {/* Counter-clockwise wind arrows (low pressure, NH - converging counter-clockwise) */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const r = 75;
          const cx = 430, cy = 200;
          const x1 = cx + Math.cos(rad) * (r - 15);
          const y1 = cy + Math.sin(rad) * (r - 15);
          // Counter-clockwise tangent
          const tangentAngle = rad - Math.PI / 2;
          const x2 = x1 + Math.cos(tangentAngle) * 20;
          const y2 = y1 + Math.sin(tangentAngle) * 20;
          return (
            <line key={`lw-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ef4444" strokeWidth="2" markerEnd="url(#ps-red)" />
          );
        })}

        <text x="430" y="310" textAnchor="middle"
          className="step-text fill-red-700 dark:fill-red-300">
          Low Pressure
        </text>
        <text x="430" y="325" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Winds spiral counter-clockwise (NH)
        </text>
        <text x="430" y="339" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          Clouds, rain, storms
        </text>

        {/* Bottom caption */}
        <rect x="60" y="360" width="480" height="45" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="377" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Pressure differences drive wind — air always moves from H to L
        </text>
        <text x="300" y="395" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-300">
          Cyclones form around intense low-pressure centres
        </text>
      </svg>
    </div>
  );
};

export default StormPressureSystemDiagram;
