const StormCoriolisDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 678 442"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Top-down view of a cyclone showing counterclockwise spiral winds caused by the Coriolis effect"
      >
        <style>{`
          @keyframes spin-ccw {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          @keyframes pulse-center {
            0%, 100% { opacity: 0.5; r: 12; }
            50% { opacity: 0.9; r: 16; }
          }
          .spin-ring {
            transform-origin: 280px 200px;
            animation: spin-ccw 12s linear infinite;
          }
          .center-pulse { animation: pulse-center 2s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        <defs>
          <marker id="sc-arrow-wind" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-sky-400 dark:fill-sky-300" />
          </marker>
          <marker id="sc-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Why Cyclones Spin — The Coriolis Effect
        </text>

        {/* Cloud bands — concentric rings to suggest storm from above */}
        <circle cx="280" cy="200" r="140"
          className="fill-gray-200 dark:fill-gray-800" opacity="0.3" />
        <circle cx="280" cy="200" r="110"
          className="fill-gray-300 dark:fill-gray-700" opacity="0.3" />
        <circle cx="280" cy="200" r="80"
          className="fill-gray-400 dark:fill-gray-600" opacity="0.3" />
        <circle cx="280" cy="200" r="50"
          className="fill-gray-500 dark:fill-gray-500" opacity="0.3" />

        {/* Eye of the storm */}
        <circle cx="280" cy="200" r="18"
          className="fill-sky-100 dark:fill-sky-900" />
        <circle cx="280" cy="200" r="12"
          className="fill-sky-50 dark:fill-sky-950 center-pulse" />

        {/* Counterclockwise spiral arrows */}
        {/* Outer spiral */}
        <path d="M 420 170 Q 410 110 340 85"
          fill="none" className="stroke-sky-400 dark:stroke-sky-300" strokeWidth="2.5"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 330 80 Q 220 70 160 140"
          fill="none" className="stroke-sky-400 dark:stroke-sky-300" strokeWidth="2.5"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 155 150 Q 130 240 180 310"
          fill="none" className="stroke-sky-400 dark:stroke-sky-300" strokeWidth="2.5"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 185 315 Q 260 355 370 300"
          fill="none" className="stroke-sky-400 dark:stroke-sky-300" strokeWidth="2.5"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 375 295 Q 420 250 420 175"
          fill="none" className="stroke-sky-400 dark:stroke-sky-300" strokeWidth="2.5"
          markerEnd="url(#sc-arrow-wind)" />

        {/* Inner spiral (tighter) */}
        <path d="M 350 155 Q 340 125 300 115"
          fill="none" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 295 112 Q 235 115 215 160"
          fill="none" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 212 168 Q 200 225 230 265"
          fill="none" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 235 270 Q 280 290 330 260"
          fill="none" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2"
          markerEnd="url(#sc-arrow-wind)" />
        <path d="M 335 255 Q 360 225 355 160"
          fill="none" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="2"
          markerEnd="url(#sc-arrow-wind)" />

        {/* CCW rotation label with curved arrow */}
        <text x="280" y="200" textAnchor="middle"
          className="label-text fill-sky-700 dark:fill-sky-300" fontWeight="600">
          Eye
        </text>

        {/* Hemisphere label */}
        <rect x="420" y="55" width="165" height="48" rx="8"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.8"
          stroke="#0ea5e9" strokeWidth="1" />
        <text x="502" y="73" textAnchor="middle"
          className="label-text fill-sky-700 dark:fill-sky-300" fontWeight="700">
          Northern Hemisphere
        </text>
        <text x="502" y="88" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">
          Counterclockwise spin
        </text>

        {/* Coriolis explanation */}
        <rect x="100" y="340" width="360" height="24" rx="6"
          className="fill-sky-50 dark:fill-sky-950" opacity="0.7" />
        <text x="280" y="357" textAnchor="middle"
          className="caption-text fill-sky-700 dark:fill-sky-300" fontWeight="600">
          Coriolis deflects winds right (NH) → they curve into a spiral
        </text>

        {/* ---- Merry-go-round analogy — bottom-right corner ---- */}
        <rect x="462" y="300" width="125" height="100" rx="8"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.8"
          stroke="#f59e0b" strokeWidth="1" />
        <text x="524" y="318" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="700">
          Analogy
        </text>
        {/* Merry-go-round circle */}
        <circle cx="500" cy="360" r="18" fill="none"
          className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" strokeDasharray="4,3" />
        {/* Seats */}
        {[0, 90, 180, 270].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <circle key={`mgr-${angle}`}
              cx={500 + Math.cos(rad) * 18} cy={360 + Math.sin(rad) * 18} r="3"
              className="fill-amber-400 dark:fill-amber-500" />
          );
        })}
        {/* Center pole */}
        <circle cx="500" cy="360" r="3"
          className="fill-amber-600 dark:fill-amber-400" />
        {/* Spin arrow */}
        <path d="M 520 354 Q 524 348 518 344" fill="none"
          stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#sc-arrow-amber)" />

        <text x="548" y="348" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '8.5px' }}>
          Throw a ball on a
        </text>
        <text x="548" y="360" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '8.5px' }}>
          spinning merry-go-
        </text>
        <text x="548" y="372" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400" style={{ fontSize: '8.5px' }}>
          round — it curves!
        </text>

        {/* Bottom caption */}
        <rect x="100" y="375" width="360" height="24" rx="6"
          className="fill-red-50 dark:fill-red-950" opacity="0.7" />
        <text x="280" y="392" textAnchor="middle"
          className="caption-text fill-red-600 dark:fill-red-400" fontWeight="600">
          No Coriolis at equator → no cyclones form there
        </text>
      </svg>
    </div>
  );
};

export default StormCoriolisDiagram;
