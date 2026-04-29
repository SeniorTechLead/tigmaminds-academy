const StormWindPressureDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 650 417"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing wind flows from high pressure to low pressure areas"
      >
        <style>{`
          @keyframes flowRight {
            0% { opacity: 0; transform: translateX(-10px); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateX(10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .flow-arrow { animation: flowRight 1.8s ease-in-out infinite; }
          .flow-d1 { animation-delay: 0s; }
          .flow-d2 { animation-delay: 0.4s; }
          .flow-d3 { animation-delay: 0.8s; }
          .flow-d4 { animation-delay: 1.2s; }
          .heat-pulse { animation: pulse 2s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        <defs>
          <marker id="swp-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="swp-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          What Causes Wind?
        </text>

        {/* HIGH pressure area — left */}
        <circle cx="140" cy="130" r="55"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.6"
          stroke="#3b82f6" strokeWidth="2" />
        <text x="140" y="100" textAnchor="middle"
          className="fill-blue-600 dark:fill-blue-300" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          H
        </text>
        <text x="140" y="118" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-300" fontWeight="600">
          HIGH Pressure
        </text>

        {/* Dense air molecules — many dots in H area */}
        {[
          [110, 135], [125, 145], [140, 138], [155, 148], [170, 135],
          [115, 155], [130, 160], [150, 158], [165, 152], [120, 142],
          [145, 165], [160, 165], [133, 150], [148, 142], [105, 148],
          [175, 145], [125, 170], [155, 170], [138, 132], [162, 160],
        ].map(([x, y], i) => (
          <circle key={`hd-${i}`} cx={x} cy={y} r="2.5"
            className="fill-blue-400 dark:fill-blue-500" opacity="0.7" />
        ))}
        <text x="140" y="190" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          Dense, packed air
        </text>

        {/* LOW pressure area — right */}
        <circle cx="460" cy="130" r="55"
          className="fill-red-100 dark:fill-red-900" opacity="0.6"
          stroke="#ef4444" strokeWidth="2" />
        <text x="460" y="100" textAnchor="middle"
          className="fill-red-500 dark:fill-red-400" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>
          L
        </text>
        <text x="460" y="118" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400" fontWeight="600">
          LOW Pressure
        </text>

        {/* Sparse air molecules — few dots in L area */}
        {[
          [440, 140], [460, 155], [480, 142], [450, 165], [470, 160],
          [435, 158], [475, 150],
        ].map(([x, y], i) => (
          <circle key={`ld-${i}`} cx={x} cy={y} r="2.5"
            className="fill-red-400 dark:fill-red-500" opacity="0.7" />
        ))}
        <text x="460" y="190" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          Thin, spread-out air
        </text>

        {/* Wind arrows flowing from H to L */}
        {[
          { y: 110, d: 'flow-d1' },
          { y: 130, d: 'flow-d2' },
          { y: 150, d: 'flow-d3' },
        ].map(({ y, d }) => (
          <line key={`wa-${y}`} x1="210" y1={y} x2="390" y2={y}
            stroke="#f59e0b" strokeWidth="2.5"
            markerEnd="url(#swp-arrow)"
            className={`flow-arrow ${d}`} />
        ))}

        {/* Wind label */}
        <rect x="268" y="80" width="64" height="22" rx="4"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="95" textAnchor="middle"
          className="title-text fill-amber-600 dark:fill-amber-300">
          WIND
        </text>

        {/* Divider */}
        <line x1="40" y1="215" x2="560" y2="215"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Bottom explanation */}
        <rect x="50" y="228" width="500" height="28" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="247" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Wind = air flowing from high pressure to low pressure
        </text>

        {/* Thermometer + sun heating explanation */}
        {/* Thermometer icon */}
        <rect x="78" y="275" width="8" height="30" rx="3"
          className="fill-red-400 dark:fill-red-500" />
        <circle cx="82" cy="310" r="7"
          className="fill-red-500 dark:fill-red-400" />
        <rect x="79" y="282" width="6" height="12" rx="2"
          className="fill-red-300 dark:fill-red-400" />

        {/* Sun icon */}
        <circle cx="82" cy="340" r="10"
          className="fill-yellow-400 dark:fill-yellow-500 heat-pulse" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 82 + Math.cos(rad) * 13;
          const y1 = 340 + Math.sin(rad) * 13;
          const x2 = 82 + Math.cos(rad) * 17;
          const y2 = 340 + Math.sin(rad) * 17;
          return (
            <line key={`ray-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-yellow-400 dark:stroke-yellow-500 heat-pulse" strokeWidth="1.5" />
          );
        })}

        {/* Explanation steps */}
        <text x="110" y="290" className="label-text fill-slate-600 dark:fill-slate-300">
          1. Sun heats the ground unevenly
        </text>
        <text x="110" y="310" className="label-text fill-slate-600 dark:fill-slate-300">
          2. Warm air is lighter — it rises
        </text>
        <text x="110" y="330" className="label-text fill-slate-600 dark:fill-slate-300">
          3. Rising air leaves behind low pressure
        </text>
        <text x="110" y="350" className="label-text fill-slate-600 dark:fill-slate-300">
          4. Surrounding high-pressure air rushes in = wind!
        </text>

        {/* Rising air arrow on right side */}
        <line x1="520" y1="340" x2="520" y2="280"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#swp-arrow-red)" />
        <text x="520" y="355" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          Warm air
        </text>
        <text x="520" y="367" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400">
          rises
        </text>
      </svg>
    </div>
  );
};

export default StormWindPressureDiagram;
