const CloudFormationDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how clouds form through evaporation, rising air, cooling to dew point, and condensation on nuclei"
      >
        <style>{`
          @keyframes rise-bubble {
            0% { transform: translateY(0); opacity: 0.7; }
            50% { opacity: 1; }
            100% { transform: translateY(-80px); opacity: 0; }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .rise-1 { animation: rise-bubble 3s ease-out infinite; }
          .rise-2 { animation: rise-bubble 3s ease-out 1s infinite; }
          .rise-3 { animation: rise-bubble 3s ease-out 2s infinite; }
          .glow { animation: pulse-glow 2.5s ease-in-out infinite; }
          .label-text { font-family: system-ui, sans-serif; font-size: 10px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .step-text { font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600; }
        `}</style>

        {/* Background */}
        <rect width="600" height="440" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          How Clouds Form — From Evaporation to Condensation
        </text>

        {/* Sky gradient (light to dark blue going up) */}
        <defs>
          <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#87CEEB" />
          </linearGradient>
        </defs>
        <rect x="20" y="40" width="560" height="280" rx="6" fill="url(#cf-sky)" opacity="0.25" />

        {/* Temperature scale on right */}
        <text x="565" y="58" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400" fontSize="8">-10&#176;C</text>
        <text x="565" y="138" textAnchor="middle" className="label-text fill-blue-500 dark:fill-blue-400" fontSize="8">5&#176;C</text>
        <text x="565" y="218" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400" fontSize="8">15&#176;C</text>
        <text x="565" y="298" textAnchor="middle" className="label-text fill-orange-600 dark:fill-orange-400" fontSize="8">25&#176;C</text>
        <line x1="555" y1="50" x2="555" y2="310" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3,3" />

        {/* Ground / water surface */}
        <rect x="20" y="320" width="560" height="100" rx="6"
          className="fill-blue-200 dark:fill-blue-900" opacity="0.5" />
        <path d="M 20 330 Q 80 320 140 330 Q 200 340 260 330 Q 320 320 380 330 Q 440 340 500 330 Q 540 325 580 330"
          fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" />

        {/* Sun */}
        <circle cx="530" cy="60" r="20" className="fill-yellow-400 dark:fill-yellow-500" opacity="0.8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`sun-${angle}`}
              x1={530 + Math.cos(rad) * 23} y1={60 + Math.sin(rad) * 23}
              x2={530 + Math.cos(rad) * 30} y2={60 + Math.sin(rad) * 30}
              className="stroke-yellow-400 dark:stroke-yellow-500" strokeWidth="1.5" />
          );
        })}

        {/* STEP 1: Evaporation arrows from water */}
        <defs>
          <marker id="cf-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Rising water vapor bubbles */}
        <circle cx="100" cy="310" r="4" className="fill-blue-400 dark:fill-blue-500 rise-1" opacity="0.7" />
        <circle cx="150" cy="300" r="3" className="fill-blue-300 dark:fill-blue-400 rise-2" opacity="0.7" />
        <circle cx="200" cy="305" r="3.5" className="fill-blue-400 dark:fill-blue-500 rise-3" opacity="0.7" />

        {/* Evaporation arrows */}
        <line x1="100" y1="320" x2="100" y2="270" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" markerEnd="url(#cf-arrow)" strokeDasharray="4,3" />
        <line x1="200" y1="320" x2="200" y2="270" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" markerEnd="url(#cf-arrow)" strokeDasharray="4,3" />

        {/* STEP 1 Label */}
        <rect x="30" y="338" width="150" height="46" rx="6"
          className="fill-blue-100 dark:fill-blue-900" opacity="0.85" stroke="#3b82f6" strokeWidth="1" />
        <text x="105" y="354" textAnchor="middle" className="step-text fill-blue-700 dark:fill-blue-300">1. Evaporation</text>
        <text x="105" y="368" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">Sun heats water surface</text>
        <text x="105" y="380" textAnchor="middle" className="label-text fill-blue-600 dark:fill-blue-400">H&#8322;O molecules escape as vapor</text>

        {/* STEP 2: Rising & cooling */}
        <rect x="200" y="200" width="140" height="46" rx="6"
          className="fill-green-100 dark:fill-green-900" opacity="0.85" stroke="#22c55e" strokeWidth="1" />
        <text x="270" y="216" textAnchor="middle" className="step-text fill-green-700 dark:fill-green-300">2. Air Rises & Cools</text>
        <text x="270" y="230" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">~6.5&#176;C per 1,000 m altitude</text>
        <text x="270" y="242" textAnchor="middle" className="label-text fill-green-600 dark:fill-green-400">(lapse rate)</text>

        {/* Upward arrow */}
        <defs>
          <marker id="cf-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>
        <line x1="270" y1="270" x2="270" y2="248" className="stroke-green-500 dark:stroke-green-400" strokeWidth="2" markerEnd="url(#cf-arrow-green)" />

        {/* STEP 3: Dew point reached — condensation nuclei */}
        <rect x="60" y="100" width="180" height="56" rx="6"
          className="fill-purple-100 dark:fill-purple-900" opacity="0.85" stroke="#a855f7" strokeWidth="1" />
        <text x="150" y="118" textAnchor="middle" className="step-text fill-purple-700 dark:fill-purple-300">3. Dew Point Reached</text>
        <text x="150" y="132" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">Vapor condenses on tiny particles</text>
        <text x="150" y="144" textAnchor="middle" className="label-text fill-purple-600 dark:fill-purple-400">(dust, pollen, salt = nuclei)</text>

        {/* Condensation nuclei dots */}
        {[130, 140, 150, 160, 170].map((cx, i) => (
          <g key={`nucleus-${i}`}>
            <circle cx={cx} cy={75} r="2" className="fill-gray-500 dark:fill-gray-400" />
            <circle cx={cx} cy={75} r="5" className="stroke-blue-400 dark:stroke-blue-500 glow" fill="none" strokeWidth="1" />
          </g>
        ))}

        {/* STEP 4: Cloud forms */}
        <rect x="350" y="100" width="170" height="46" rx="6"
          className="fill-gray-100 dark:fill-gray-800" opacity="0.85" stroke="#6b7280" strokeWidth="1" />
        <text x="435" y="118" textAnchor="middle" className="step-text fill-gray-700 dark:fill-gray-300">4. Cloud Forms!</text>
        <text x="435" y="132" textAnchor="middle" className="label-text fill-gray-600 dark:fill-gray-400">Billions of tiny droplets</text>
        <text x="435" y="142" textAnchor="middle" className="label-text fill-gray-600 dark:fill-gray-400">(~10 microns each)</text>

        {/* Cloud shape */}
        <ellipse cx="430" cy="65" rx="60" ry="20" className="fill-gray-300 dark:fill-gray-600" opacity="0.7" />
        <ellipse cx="400" cy="58" rx="35" ry="18" className="fill-gray-200 dark:fill-gray-500" opacity="0.7" />
        <ellipse cx="460" cy="58" rx="40" ry="16" className="fill-gray-200 dark:fill-gray-500" opacity="0.7" />
        <ellipse cx="430" cy="50" rx="45" ry="15" className="fill-white dark:fill-gray-400" opacity="0.6" />

        {/* Connecting arrows */}
        <defs>
          <marker id="cf-arrow-purple" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
          </marker>
          <marker id="cf-arrow-gray" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
          </marker>
        </defs>
        <path d="M 270 200 Q 230 160 220 156" fill="none" className="stroke-purple-400 dark:stroke-purple-500" strokeWidth="1.5" markerEnd="url(#cf-arrow-purple)" />
        <path d="M 240 120 L 350 115" fill="none" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#cf-arrow-gray)" />

        {/* Key insight box at bottom */}
        <rect x="200" y="388" width="380" height="42" rx="6"
          className="fill-amber-50 dark:fill-amber-900/30" stroke="#f59e0b" strokeWidth="1" />
        <text x="390" y="406" textAnchor="middle"
          className="label-text fill-amber-700 dark:fill-amber-300" fontWeight="600">
          Key: Without condensation nuclei, clouds cannot form
        </text>
        <text x="390" y="420" textAnchor="middle"
          className="label-text fill-amber-600 dark:fill-amber-400">
          even at 100% humidity. Clean air = no clouds!
        </text>
      </svg>
    </div>
  );
};

export default CloudFormationDiagram;
