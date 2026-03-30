const CoriolisEffectDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 546"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram explaining the Coriolis effect and why cyclones spin"
      >
        <style>{`
          @keyframes spinArrow {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          .spin-pulse {
            animation: spinArrow 2s ease-in-out infinite;
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
          <marker id="cor-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="cor-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
          </marker>
          <marker id="cor-arrow-white" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-700 dark:fill-slate-200" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="520" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* ===== TOP SECTION: Earth from above North Pole ===== */}
        <text x="300" y="24" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Earth viewed from above the North Pole
        </text>

        {/* Earth circle */}
        <circle cx="300" cy="80" r="48"
          className="fill-blue-500 dark:fill-blue-700" opacity="0.3"
          stroke="#60a5fa" strokeWidth="2" />
        {/* Simple continent hints */}
        <ellipse cx="290" cy="68" rx="14" ry="10"
          className="fill-green-400 dark:fill-green-600" opacity="0.5" />
        <ellipse cx="315" cy="85" rx="10" ry="8"
          className="fill-green-400 dark:fill-green-600" opacity="0.5" />

        {/* N pole dot */}
        <circle cx="300" cy="80" r="3" className="fill-white dark:fill-slate-200" />
        <text x="300" y="76" textAnchor="middle"
          className="label-text fill-white dark:fill-slate-200" fontSize="8" fontWeight="600">
          N
        </text>

        {/* Counterclockwise rotation arrow — arc around the Earth */}
        <path d="M 340 48 A 45 45 0 1 0 265 55" fill="none"
          stroke="#60a5fa" strokeWidth="2.5"
          markerEnd="url(#cor-arrow-blue)"
          className="spin-pulse" />
        <text x="370" y="46" textAnchor="start"
          className="label-text fill-blue-400 dark:fill-blue-300">
          Earth spins
        </text>
        <text x="370" y="57" textAnchor="start"
          className="label-text fill-blue-400 dark:fill-blue-300">
          counterclockwise
        </text>

        {/* Divider */}
        <line x1="40" y1="135" x2="560" y2="135"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />

        {/* ===== MIDDLE: Two side-by-side panels ===== */}

        {/* LEFT PANEL: Without rotation */}
        <rect x="20" y="145" width="270" height="200" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-600" strokeWidth="1" />

        <text x="155" y="165" textAnchor="middle"
          className="section-title fill-slate-600 dark:fill-slate-300">
          Without rotation
        </text>

        {/* Low pressure center */}
        <circle cx="155" cy="255" r="14"
          className="fill-red-400 dark:fill-red-600" opacity="0.3"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="155" y="258" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400" fontSize="8" fontWeight="600">
          LOW
        </text>

        {/* Straight inward arrows from all 8 directions */}
        {/* Top */}
        <line x1="155" y1="185" x2="155" y2="237"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Bottom */}
        <line x1="155" y1="325" x2="155" y2="273"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Left */}
        <line x1="70" y1="255" x2="137" y2="255"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Right */}
        <line x1="240" y1="255" x2="173" y2="255"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Top-left */}
        <line x1="95" y1="195" x2="143" y2="243"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Top-right */}
        <line x1="215" y1="195" x2="167" y2="243"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Bottom-left */}
        <line x1="95" y1="315" x2="143" y2="267"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        {/* Bottom-right */}
        <line x1="215" y1="315" x2="167" y2="267"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />

        <text x="155" y="340" textAnchor="middle"
          className="label-text fill-blue-500 dark:fill-blue-400">
          Air rushes straight in
        </text>

        {/* RIGHT PANEL: With Earth's rotation */}
        <rect x="310" y="145" width="270" height="200" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-600" strokeWidth="1" />

        <text x="445" y="165" textAnchor="middle"
          className="section-title fill-amber-600 dark:fill-amber-300">
          With Earth's rotation
        </text>

        {/* Low pressure center */}
        <circle cx="445" cy="255" r="14"
          className="fill-red-400 dark:fill-red-600" opacity="0.3"
          stroke="#ef4444" strokeWidth="1.5" />
        <text x="445" y="258" textAnchor="middle"
          className="label-text fill-red-500 dark:fill-red-400" fontSize="8" fontWeight="600">
          LOW
        </text>

        {/* Curved arrows deflected to the right, creating counterclockwise spiral */}
        {/* From top — curves right */}
        <path d="M 445 185 Q 470 215 457 237" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From bottom — curves right (left from its perspective) */}
        <path d="M 445 325 Q 420 295 433 273" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From left — curves right (downward) */}
        <path d="M 360 255 Q 395 235 431 247" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From right — curves right (upward) */}
        <path d="M 530 255 Q 495 275 459 263" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From top-left — curves right */}
        <path d="M 385 195 Q 420 210 443 241" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From top-right — curves right */}
        <path d="M 505 195 Q 490 225 461 244" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From bottom-left — curves right */}
        <path d="M 385 315 Q 400 285 429 266" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />
        {/* From bottom-right — curves right */}
        <path d="M 505 315 Q 470 290 447 269" fill="none"
          stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#cor-arrow-amber)"
          className="spin-pulse" />

        {/* Counterclockwise spiral hint in center */}
        <path d="M 456 242 A 18 18 0 1 0 434 242" fill="none"
          stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />

        <text x="445" y="340" textAnchor="middle"
          className="label-text fill-amber-500 dark:fill-amber-400">
          Coriolis deflects to the right
        </text>
        <text x="445" y="352" textAnchor="middle"
          className="label-text fill-amber-500 dark:fill-amber-400">
          → counterclockwise spiral
        </text>

        {/* Divider */}
        <line x1="40" y1="370" x2="560" y2="370"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4 3" />

        {/* ===== BOTTOM SECTION: Hemisphere summary ===== */}
        <text x="300" y="392" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          How it works in each hemisphere
        </text>

        {/* Northern Hemisphere */}
        <circle cx="105" cy="440" r="20"
          className="fill-blue-500 dark:fill-blue-700" opacity="0.2"
          stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M 115 427 A 18 18 0 1 0 95 427" fill="none"
          stroke="#60a5fa" strokeWidth="2" markerEnd="url(#cor-arrow-blue)" />
        <text x="105" y="443" textAnchor="middle"
          className="label-text fill-white dark:fill-slate-200" fontSize="7">
          CCW
        </text>
        <text x="170" y="435" textAnchor="start"
          className="section-title fill-blue-500 dark:fill-blue-400">
          Northern Hemisphere
        </text>
        <text x="170" y="449" textAnchor="start"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Counterclockwise spin
        </text>

        {/* Southern Hemisphere */}
        <circle cx="105" cy="480" r="20"
          className="fill-amber-500 dark:fill-amber-700" opacity="0.2"
          stroke="#fbbf24" strokeWidth="1.5" />
        <path d="M 95 467 A 18 18 0 1 0 115 467" fill="none"
          stroke="#fbbf24" strokeWidth="2" markerEnd="url(#cor-arrow-amber)" />
        <text x="105" y="483" textAnchor="middle"
          className="label-text fill-white dark:fill-slate-200" fontSize="7">
          CW
        </text>
        <text x="170" y="476" textAnchor="start"
          className="section-title fill-amber-500 dark:fill-amber-400">
          Southern Hemisphere
        </text>
        <text x="170" y="490" textAnchor="start"
          className="label-text fill-slate-500 dark:fill-slate-400">
          Clockwise spin
        </text>

        {/* Equator note */}
        <line x1="370" y1="460" x2="560" y2="460"
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
        <text x="465" y="454" textAnchor="middle"
          className="label-text fill-red-400 dark:fill-red-400" fontSize="8">
          EQUATOR
        </text>
        <text x="465" y="476" textAnchor="middle"
          className="fact-text fill-slate-500 dark:fill-slate-400">
          No deflection at the equator
        </text>
        <text x="465" y="490" textAnchor="middle"
          className="fact-text fill-slate-500 dark:fill-slate-400">
          → cyclones cannot form here
        </text>
      </svg>
    </div>
  );
};

export default CoriolisEffectDiagram;
