const StormTrackerPipelineDiagram = () => {
  const stages = [
    { x: 25, label: 'Satellite\nData', icon: 'sat', color: 'blue' },
    { x: 135, label: 'Track\nPrediction', icon: 'track', color: 'sky' },
    { x: 245, label: 'Intensity\nEstimate', icon: 'gauge', color: 'amber' },
    { x: 355, label: 'Surge\nCalculation', icon: 'wave', color: 'orange' },
    { x: 465, label: 'Alert\nSystem', icon: 'alert', color: 'red' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 411"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Full cyclone tracker pipeline from satellite data through track prediction, intensity estimation, surge calculation to alert system"
      >
        <style>{`
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .stage-text { font-family: system-ui, sans-serif; font-size: 10px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>

        <defs>
          <marker id="pipe-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Cyclone Tracker Pipeline — From Satellite to Alert
        </text>

        {/* Pipeline stages */}
        {stages.map((stage, i) => {
          const bgClass = `fill-${stage.color}-100 dark:fill-${stage.color}-900`;
          const borderColor = stage.color === 'blue' ? '#3b82f6' : stage.color === 'sky' ? '#0ea5e9' : stage.color === 'amber' ? '#f59e0b' : stage.color === 'orange' ? '#f97316' : '#ef4444';
          const textClass = `fill-${stage.color}-700 dark:fill-${stage.color}-300`;

          return (
            <g key={stage.icon}>
              {/* Stage box */}
              <rect x={stage.x} y="50" width="100" height="120" rx="10"
                className={bgClass} opacity="0.7"
                stroke={borderColor} strokeWidth="1.5" />

              {/* Stage number */}
              <circle cx={stage.x + 50} cy="68" r="10"
                fill={borderColor} opacity="0.8" />
              <text x={stage.x + 50} y="72" textAnchor="middle"
                className="stage-text" fill="white" fontWeight="700">
                {i + 1}
              </text>

              {/* Icons */}
              {stage.icon === 'sat' && (
                <g>
                  <rect x={stage.x + 35} y="85" width="30" height="20" rx="3"
                    fill={borderColor} opacity="0.6" />
                  <line x1={stage.x + 30} y1="95" x2={stage.x + 38} y2="95"
                    stroke={borderColor} strokeWidth="2" />
                  <line x1={stage.x + 62} y1="95" x2={stage.x + 70} y2="95"
                    stroke={borderColor} strokeWidth="2" />
                  <line x1={stage.x + 50} y1="105" x2={stage.x + 50} y2="115"
                    stroke={borderColor} strokeWidth="1.5" />
                  <circle cx={stage.x + 50} cy="118" r="3" fill={borderColor} opacity="0.6" />
                </g>
              )}
              {stage.icon === 'track' && (
                <g>
                  <path d={`M ${stage.x + 30} 115 Q ${stage.x + 45} 95 ${stage.x + 55} 100 Q ${stage.x + 65} 105 ${stage.x + 70} 88`}
                    fill="none" stroke={borderColor} strokeWidth="2" />
                  <circle cx={stage.x + 30} cy="115" r="3" fill={borderColor} />
                  <circle cx={stage.x + 70} cy="88" r="4" fill={borderColor} />
                </g>
              )}
              {stage.icon === 'gauge' && (
                <g>
                  <path d={`M ${stage.x + 30} 115 A 25 25 0 0 1 ${stage.x + 70} 115`}
                    fill="none" stroke={borderColor} strokeWidth="2" />
                  <line x1={stage.x + 50} y1="115" x2={stage.x + 62} y2="95"
                    stroke={borderColor} strokeWidth="2" />
                </g>
              )}
              {stage.icon === 'wave' && (
                <g>
                  <path d={`M ${stage.x + 25} 105 Q ${stage.x + 37} 90 ${stage.x + 50} 105 Q ${stage.x + 62} 120 ${stage.x + 75} 105`}
                    fill="none" stroke={borderColor} strokeWidth="2" />
                  <line x1={stage.x + 25} y1="115" x2={stage.x + 75} y2="115"
                    stroke={borderColor} strokeWidth="1" />
                </g>
              )}
              {stage.icon === 'alert' && (
                <g>
                  <path d={`M ${stage.x + 50} 85 L ${stage.x + 35} 118 L ${stage.x + 65} 118 Z`}
                    fill="none" stroke={borderColor} strokeWidth="2" />
                  <text x={stage.x + 50} y="114" textAnchor="middle"
                    fill={borderColor} fontWeight="700" style={{ fontSize: '14px' }}>!</text>
                </g>
              )}

              {/* Stage label */}
              {stage.label.split('\n').map((line, li) => (
                <text key={li} x={stage.x + 50} y={140 + li * 13} textAnchor="middle"
                  className={`stage-text ${textClass}`}>
                  {line}
                </text>
              ))}

              {/* Arrow to next */}
              {i < 4 && (
                <line x1={stage.x + 103} y1="110" x2={stages[i + 1].x - 3} y2="110"
                  stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#pipe-arrow)" />
              )}
            </g>
          );
        })}

        {/* Detail rows */}
        {[
          { x: 25, texts: ['INSAT-3D imagery', 'Infrared + visible', 'Every 30 minutes'] },
          { x: 135, texts: ['Past position data', 'Statistical models', 'Uncertainty cone'] },
          { x: 245, texts: ['Dvorak technique', 'Cloud patterns', 'Pressure estimate'] },
          { x: 355, texts: ['Wind + bathymetry', 'Coastal geometry', 'Inundation depth'] },
          { x: 465, texts: ['Color-coded zones', 'SMS/radio alerts', 'Evacuation orders'] },
        ].map((detail, i) => (
          <g key={`detail-${i}`}>
            <rect x={detail.x} y="185" width="100" height="60" rx="6"
              className="fill-slate-100 dark:fill-slate-800" opacity="0.6" />
            {detail.texts.map((t, j) => (
              <text key={j} x={detail.x + 50} y={200 + j * 14} textAnchor="middle"
                className="small-text fill-slate-600 dark:fill-slate-400">
                {t}
              </text>
            ))}
          </g>
        ))}

        {/* Data flow summary */}
        <rect x="40" y="260" width="520" height="70" rx="8"
          className="fill-slate-100 dark:fill-slate-800" opacity="0.7"
          stroke="#64748b" strokeWidth="1" />
        <text x="300" y="280" textAnchor="middle"
          className="step-text fill-slate-700 dark:fill-slate-200">
          Your Code Will Build Each Stage
        </text>
        <text x="300" y="298" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Stage 1-2: Track cyclone position and predict future path
        </text>
        <text x="300" y="314" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          Stage 3-5: Estimate intensity, calculate surge risk, and generate alerts
        </text>

        {/* Bottom caption */}
        <rect x="60" y="345" width="480" height="24" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="361" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Each stage transforms raw data into life-saving decisions
        </text>
      </svg>
    </div>
  );
};

export default StormTrackerPipelineDiagram;
