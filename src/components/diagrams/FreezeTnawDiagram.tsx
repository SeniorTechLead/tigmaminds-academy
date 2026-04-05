const FreezeTnawDiagram = () => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 560 280"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Freeze-thaw weathering diagram showing three stages: water enters crack, ice expands, and wider crack allows more water"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .stage-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="ft-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="ft-arrow-cycle" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="260" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Freeze-Thaw Weathering
        </text>

        {/* Panel 1: Water enters crack */}
        <g transform="translate(20, 45)">
          <text x="75" y="0" textAnchor="middle"
            className="stage-text fill-blue-600 dark:fill-blue-400">1. Water enters</text>

          {/* Rock */}
          <rect x="10" y="15" width="130" height="140" rx="4"
            fill="#78716c" opacity="0.3" stroke="#57534e" strokeWidth="2" />

          {/* Narrow crack */}
          <path d="M 75 15 L 73 50 L 77 80 L 74 110 L 76 155"
            fill="none" stroke="#44403c" strokeWidth="2" />

          {/* Water in crack (thin) */}
          <path d="M 74 25 L 72 50 L 76 80 L 73 110 L 75 145"
            fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.6" />

          {/* Water droplets entering */}
          <line x1="75" y1="5" x2="75" y2="18" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#ft-arrow)" />
          <circle cx="65" cy="8" r="2" fill="#3b82f6" opacity="0.5" />
          <circle cx="85" cy="10" r="2" fill="#3b82f6" opacity="0.5" />

          <text x="75" y="175" textAnchor="middle"
            className="formula-text fill-slate-500 dark:fill-slate-400">
            Rain fills cracks
          </text>
        </g>

        {/* Panel 2: Ice expands */}
        <g transform="translate(195, 45)">
          <text x="75" y="0" textAnchor="middle"
            className="stage-text fill-cyan-600 dark:fill-cyan-400">2. Ice expands</text>

          {/* Rock — wider crack */}
          <rect x="10" y="15" width="130" height="140" rx="4"
            fill="#78716c" opacity="0.3" stroke="#57534e" strokeWidth="2" />

          {/* Wider crack */}
          <path d="M 70 15 L 66 50 L 72 80 L 65 110 L 68 155"
            fill="none" stroke="#44403c" strokeWidth="1.5" />
          <path d="M 80 15 L 84 50 L 78 80 L 85 110 L 82 155"
            fill="none" stroke="#44403c" strokeWidth="1.5" />

          {/* Ice fill */}
          <path d="M 70 20 L 66 50 L 72 80 L 65 110 L 68 150 L 82 150 L 85 110 L 78 80 L 84 50 L 80 20 Z"
            fill="#67e8f9" opacity="0.5" stroke="#06b6d4" strokeWidth="1" />

          {/* Expansion arrows */}
          <line x1="65" y1="80" x2="52" y2="80" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="85" y1="80" x2="98" y2="80" stroke="#ef4444" strokeWidth="1.5" />
          <text x="42" y="84" textAnchor="middle" className="label-text fill-red-500" style={{ fontSize: '8px' }}>←</text>
          <text x="108" y="84" textAnchor="middle" className="label-text fill-red-500" style={{ fontSize: '8px' }}>→</text>

          {/* 9% label */}
          <rect x="95" y="55" width="45" height="18" rx="3"
            fill="#fef2f2" stroke="#ef4444" strokeWidth="1"
            className="dark:fill-red-900/30 dark:stroke-red-700" />
          <text x="117" y="68"
            textAnchor="middle" className="label-text fill-red-600 dark:fill-red-400" style={{ fontSize: '9px', fontWeight: 600 }}>
            +9% vol
          </text>

          <text x="75" y="175" textAnchor="middle"
            className="formula-text fill-slate-500 dark:fill-slate-400">
            Ice pushes rock apart
          </text>
        </g>

        {/* Panel 3: Wider crack, more water */}
        <g transform="translate(370, 45)">
          <text x="75" y="0" textAnchor="middle"
            className="stage-text fill-blue-600 dark:fill-blue-400">3. Repeat</text>

          {/* Rock — even wider */}
          <rect x="10" y="15" width="130" height="140" rx="4"
            fill="#78716c" opacity="0.3" stroke="#57534e" strokeWidth="2" />

          {/* Much wider crack */}
          <path d="M 62 15 L 56 50 L 64 80 L 54 110 L 58 155"
            fill="none" stroke="#44403c" strokeWidth="1.5" />
          <path d="M 88 15 L 94 50 L 86 80 L 96 110 L 92 155"
            fill="none" stroke="#44403c" strokeWidth="1.5" />

          {/* More water */}
          <path d="M 62 25 L 56 50 L 64 80 L 54 110 L 58 148 L 92 148 L 96 110 L 86 80 L 94 50 L 88 25 Z"
            fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />

          {/* Falling fragments */}
          <rect x="48" y="135" width="8" height="12" rx="1" fill="#78716c" opacity="0.5"
            transform="rotate(15, 52, 141)" />
          <rect x="94" y="130" width="10" height="8" rx="1" fill="#78716c" opacity="0.5"
            transform="rotate(-10, 99, 134)" />

          <text x="75" y="175" textAnchor="middle"
            className="formula-text fill-slate-500 dark:fill-slate-400">
            Crack grows each cycle
          </text>
        </g>

        {/* Cycle arrows between panels */}
        <path d="M 168 130 Q 185 115, 198 130" fill="none"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ft-arrow-cycle)" />
        <path d="M 343 130 Q 360 115, 373 130" fill="none"
          stroke="#f59e0b" strokeWidth="2" markerEnd="url(#ft-arrow-cycle)" />

        {/* Cycle arrow from panel 3 back */}
        <path d="M 470 225 Q 490 240, 470 248 Q 270 260, 50 248 Q 30 240, 50 225"
          fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3"
          markerEnd="url(#ft-arrow-cycle)" />
        <text x="270" y="253" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '9px' }}>
          cycle repeats until rock breaks apart
        </text>
      </svg>
    </div>
  );
};

export default FreezeTnawDiagram;
