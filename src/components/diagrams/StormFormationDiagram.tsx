const StormFormationDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 660 464"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Circular diagram showing the four steps of cyclone formation as a self-strengthening cycle"
      >
        <style>{`
          @keyframes rotate-slow {
            0% { transform-origin: 300px 200px; transform: rotate(0deg); }
            100% { transform-origin: 300px 200px; transform: rotate(360deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .cycle-glow { animation: pulse-glow 3s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
          .caption-text { font-family: system-ui, sans-serif; font-size: 11px; }
        `}</style>

        <defs>
          <marker id="sf-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          How a Cyclone Forms — The Self-Strengthening Cycle
        </text>

        {/* Central glow ring */}
        <circle cx="300" cy="210" r="115"
          className="stroke-amber-400 dark:stroke-amber-500 cycle-glow" fill="none"
          strokeWidth="2" strokeDasharray="6,4" />

        {/* Center label */}
        <rect x="242" y="195" width="116" height="32" rx="8"
          className="fill-amber-100 dark:fill-amber-900" opacity="0.8" />
        <text x="300" y="210" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="700">
          Self-strengthening
        </text>
        <text x="300" y="222" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="700">
          cycle
        </text>

        {/* ---- STEP 1: Top — Warm ocean ---- */}
        <rect x="220" y="48" width="160" height="52" rx="10"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.7"
          stroke="#3b82f6" strokeWidth="1.5" />
        {/* Sun icon */}
        <circle cx="240" cy="68" r="8"
          className="fill-yellow-400 dark:fill-yellow-500" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`s1-${angle}`}
              x1={240 + Math.cos(rad) * 10} y1={68 + Math.sin(rad) * 10}
              x2={240 + Math.cos(rad) * 13} y2={68 + Math.sin(rad) * 13}
              className="stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1.5" />
          );
        })}
        {/* Water wave */}
        <path d="M 233 82 Q 240 78 247 82 Q 254 86 261 82"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />
        <circle cx="245" cy="68" r="0" />
        <text x="300" y="68" textAnchor="middle"
          className="step-text fill-blue-700 dark:fill-blue-300">
          1. Warm ocean
        </text>
        <text x="300" y="82" textAnchor="middle"
          className="label-text fill-blue-600 dark:fill-blue-400">
          (&gt;26.5°C surface water)
        </text>

        {/* ---- STEP 2: Right — Evaporation ---- */}
        <rect x="420" y="150" width="160" height="52" rx="10"
          className="fill-sky-100 dark:fill-sky-900" opacity="0.7"
          stroke="#0ea5e9" strokeWidth="1.5" />
        {/* Upward arrows icon */}
        {[442, 452, 462].map((x, i) => (
          <line key={`up-${i}`} x1={x} y1={185} x2={x} y2={163}
            className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="1.5" />
        ))}
        {[442, 452, 462].map((x, i) => (
          <path key={`upt-${i}`} d={`M ${x - 3} ${168} L ${x} ${162} L ${x + 3} ${168}`}
            fill="none" className="stroke-sky-400 dark:stroke-sky-500" strokeWidth="1.5" />
        ))}
        <text x="530" y="174" textAnchor="middle"
          className="step-text fill-sky-700 dark:fill-sky-300">
          2. Evaporation
        </text>
        <text x="530" y="188" textAnchor="middle"
          className="label-text fill-sky-600 dark:fill-sky-400">
          Moist air rises
        </text>

        {/* ---- STEP 3: Bottom — Condensation ---- */}
        <rect x="220" y="318" width="160" height="52" rx="10"
          className="fill-gray-100 dark:fill-gray-800" opacity="0.7"
          stroke="#6b7280" strokeWidth="1.5" />
        {/* Cloud icon */}
        <ellipse cx="248" cy="338" rx="14" ry="9"
          className="fill-gray-300 dark:fill-gray-600" />
        <ellipse cx="260" cy="335" rx="10" ry="7"
          className="fill-gray-300 dark:fill-gray-600" />
        <ellipse cx="254" cy="342" rx="16" ry="7"
          className="fill-gray-400 dark:fill-gray-500" />
        <text x="320" y="340" textAnchor="middle"
          className="step-text fill-gray-700 dark:fill-gray-200">
          3. Condensation
        </text>
        <text x="320" y="354" textAnchor="middle"
          className="label-text fill-gray-600 dark:fill-gray-400">
          Clouds form + heat released
        </text>

        {/* ---- STEP 4: Left — Feedback loop ---- */}
        <rect x="20" y="150" width="160" height="52" rx="10"
          className="fill-red-100 dark:fill-red-900" opacity="0.7"
          stroke="#ef4444" strokeWidth="1.5" />
        {/* Spiral arrow icon */}
        <path d="M 42 182 Q 32 172 38 162 Q 44 152 54 158"
          fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M 52 155 L 54 158 L 50 159" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <text x="115" y="174" textAnchor="middle"
          className="step-text fill-red-600 dark:fill-red-400">
          4. Heat makes air
        </text>
        <text x="115" y="188" textAnchor="middle"
          className="label-text fill-red-600 dark:fill-red-400">
          rise faster → pulls more moisture
        </text>

        {/* ---- Connecting arrows (clockwise) ---- */}
        {/* Step 1 (top) → Step 2 (right) */}
        <path d="M 380 80 Q 430 100 435 148"
          fill="none" stroke="#f59e0b" strokeWidth="2.5"
          markerEnd="url(#sf-arrow)" />

        {/* Step 2 (right) → Step 3 (bottom) */}
        <path d="M 490 204 Q 470 280 380 325"
          fill="none" stroke="#f59e0b" strokeWidth="2.5"
          markerEnd="url(#sf-arrow)" />

        {/* Step 3 (bottom) → Step 4 (left) */}
        <path d="M 220 345 Q 150 330 120 204"
          fill="none" stroke="#f59e0b" strokeWidth="2.5"
          markerEnd="url(#sf-arrow)" />

        {/* Step 4 (left) → Step 1 (top) */}
        <path d="M 110 148 Q 130 100 218 74"
          fill="none" stroke="#f59e0b" strokeWidth="2.5"
          markerEnd="url(#sf-arrow)" />

        {/* Bottom caption */}
        <rect x="70" y="395" width="460" height="28" rx="6"
          className="fill-amber-50 dark:fill-amber-950" opacity="0.7" />
        <text x="300" y="414" textAnchor="middle"
          className="caption-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          This is why cyclones grow — each step feeds the next
        </text>
      </svg>
    </div>
  );
};

export default StormFormationDiagram;
