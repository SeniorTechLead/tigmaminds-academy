export default function WaterCycleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 400" className="w-full max-w-2xl mx-auto" role="img" aria-label="Animated water cycle showing evaporation, condensation, precipitation, runoff, infiltration, and groundwater flow">
        <defs>
          <style>{`
            @keyframes wc-sunPulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.15); opacity: 0.85; }
            }
            @keyframes wc-rayRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes wc-evapRise {
              0% { transform: translateY(0); opacity: 0.8; }
              80% { opacity: 0.5; }
              100% { transform: translateY(-90px); opacity: 0; }
            }
            @keyframes wc-cloudGrow {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.06); }
            }
            @keyframes wc-rainFall {
              0% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(50px); opacity: 0; }
            }
            @keyframes wc-riverFlow {
              0% { stroke-dashoffset: 20; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes wc-groundSeep {
              0% { transform: translateX(0); opacity: 0.7; }
              100% { transform: translateX(-40px); opacity: 0; }
            }
            @keyframes wc-waveRoll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-30px); }
            }
            @keyframes wc-transpiRise {
              0% { transform: translateY(0); opacity: 0.7; }
              100% { transform: translateY(-30px); opacity: 0; }
            }
            .wc-sunCore { transform-origin: 58px 42px; animation: wc-sunPulse 3s ease-in-out infinite; }
            .wc-sunRays { transform-origin: 58px 42px; animation: wc-rayRotate 30s linear infinite; }
            .wc-evapP { animation: wc-evapRise 2.5s ease-out infinite; }
            .wc-evapP2 { animation: wc-evapRise 2.5s ease-out 0.6s infinite; }
            .wc-evapP3 { animation: wc-evapRise 2.5s ease-out 1.2s infinite; }
            .wc-evapP4 { animation: wc-evapRise 2.5s ease-out 1.8s infinite; }
            .wc-evapP5 { animation: wc-evapRise 2.5s ease-out 0.3s infinite; }
            .wc-evapP6 { animation: wc-evapRise 2.5s ease-out 0.9s infinite; }
            .wc-evapP7 { animation: wc-evapRise 2.5s ease-out 1.5s infinite; }
            .wc-evapP8 { animation: wc-evapRise 2.5s ease-out 2.1s infinite; }
            .wc-cloud1 { transform-origin: 250px 68px; animation: wc-cloudGrow 4s ease-in-out infinite; }
            .wc-cloud2 { transform-origin: 420px 80px; animation: wc-cloudGrow 4s ease-in-out 1s infinite; }
            .wc-rainD { animation: wc-rainFall 1s linear infinite; }
            .wc-rainD2 { animation: wc-rainFall 1s linear 0.25s infinite; }
            .wc-rainD3 { animation: wc-rainFall 1s linear 0.5s infinite; }
            .wc-rainD4 { animation: wc-rainFall 1s linear 0.75s infinite; }
            .wc-rainD5 { animation: wc-rainFall 1s linear 0.15s infinite; }
            .wc-rainD6 { animation: wc-rainFall 1s linear 0.4s infinite; }
            .wc-rainD7 { animation: wc-rainFall 1s linear 0.6s infinite; }
            .wc-rainD8 { animation: wc-rainFall 1s linear 0.85s infinite; }
            .wc-river { stroke-dasharray: 10 5; animation: wc-riverFlow 0.6s linear infinite; }
            .wc-gndP { animation: wc-groundSeep 3s linear infinite; }
            .wc-gndP2 { animation: wc-groundSeep 3s linear 0.8s infinite; }
            .wc-gndP3 { animation: wc-groundSeep 3s linear 1.6s infinite; }
            .wc-gndP4 { animation: wc-groundSeep 3s linear 2.4s infinite; }
            .wc-wave { animation: wc-waveRoll 2s linear infinite; }
            .wc-transp { animation: wc-transpiRise 2s ease-out infinite; }
            .wc-transp2 { animation: wc-transpiRise 2s ease-out 0.7s infinite; }
          `}</style>

          <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#7dd3fc] dark:[stop-color:#0c4a6e]" />
            <stop offset="100%" className="[stop-color:#e0f2fe] dark:[stop-color:#172554]" />
          </linearGradient>
          <linearGradient id="wc-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#3b82f6] dark:[stop-color:#1e3a5f]" />
            <stop offset="100%" className="[stop-color:#1d4ed8] dark:[stop-color:#0f172a]" />
          </linearGradient>
          <linearGradient id="wc-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#65a30d] dark:[stop-color:#365314]" />
            <stop offset="60%" className="[stop-color:#92400e] dark:[stop-color:#431407]" />
          </linearGradient>
          <linearGradient id="wc-mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="[stop-color:#e7e5e4] dark:[stop-color:#a8a29e]" />
            <stop offset="40%" className="[stop-color:#78716c] dark:[stop-color:#57534e]" />
            <stop offset="100%" className="[stop-color:#57534e] dark:[stop-color:#44403c]" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="600" height="240" fill="url(#wc-sky)" />

        {/* Sun with pulsing core and rotating rays */}
        <g className="wc-sunRays">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line key={a}
                x1={58 + Math.cos(r) * 28} y1={42 + Math.sin(r) * 28}
                x2={58 + Math.cos(r) * 40} y2={42 + Math.sin(r) * 40}
                stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            );
          })}
        </g>
        <circle className="wc-sunCore" cx="58" cy="42" r="22" fill="#fbbf24" />
        <circle cx="58" cy="42" r="14" fill="#fde047" />

        {/* Sun heat rays down to ocean */}
        <line x1="76" y1="58" x2="130" y2="220" stroke="#fde047" strokeWidth="1" strokeDasharray="4,6" opacity="0.5" />
        <line x1="80" y1="54" x2="170" y2="210" stroke="#fde047" strokeWidth="1" strokeDasharray="4,6" opacity="0.4" />

        {/* Ocean */}
        <rect x="0" y="240" width="220" height="160" fill="url(#wc-ocean)" />
        {/* Animated waves */}
        <g className="wc-wave" clipPath="url(#wc-oceanClip)">
          <path d="M -30,248 Q 0,238 30,248 Q 60,258 90,248 Q 120,238 150,248 Q 180,258 210,248 Q 240,238 270,248" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
          <path d="M -30,260 Q 0,250 30,260 Q 60,270 90,260 Q 120,250 150,260 Q 180,270 210,260 Q 240,250 270,260" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        </g>
        <defs><clipPath id="wc-oceanClip"><rect x="0" y="240" width="220" height="160" /></clipPath></defs>
        <text x="110" y="310" textAnchor="middle" className="fill-blue-100 dark:fill-blue-200" fontSize="13" fontWeight="bold">Ocean</text>

        {/* Evaporating particles (rising from ocean) */}
        <circle className="wc-evapP" cx="90" cy="235" r="3" fill="#93c5fd" opacity="0.8" />
        <circle className="wc-evapP2" cx="120" cy="238" r="2.5" fill="#bfdbfe" opacity="0.7" />
        <circle className="wc-evapP3" cx="150" cy="232" r="3" fill="#93c5fd" opacity="0.8" />
        <circle className="wc-evapP4" cx="105" cy="236" r="2" fill="#bfdbfe" opacity="0.7" />
        <circle className="wc-evapP5" cx="135" cy="234" r="2.5" fill="#93c5fd" opacity="0.7" />
        <circle className="wc-evapP6" cx="165" cy="237" r="2" fill="#bfdbfe" opacity="0.6" />
        <circle className="wc-evapP7" cx="80" cy="233" r="3" fill="#93c5fd" opacity="0.8" />
        <circle className="wc-evapP8" cx="180" cy="236" r="2.5" fill="#bfdbfe" opacity="0.7" />

        {/* Evaporation label */}
        <text x="95" y="185" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="bold" transform="rotate(-60,95,185)">Evaporation</text>
        <text x="135" y="180" className="fill-blue-500 dark:fill-blue-400" fontSize="10" opacity="0.8">
          <tspan>&#x2191;</tspan> <tspan>&#x2191;</tspan> <tspan>&#x2191;</tspan>
        </text>

        {/* Cloud 1 (main, grows as condensation happens) */}
        <g className="wc-cloud1">
          <ellipse cx="230" cy="72" rx="30" ry="16" className="fill-gray-200 dark:fill-gray-500" />
          <ellipse cx="250" cy="62" rx="35" ry="18" className="fill-gray-100 dark:fill-gray-400" />
          <ellipse cx="270" cy="72" rx="30" ry="14" className="fill-gray-200 dark:fill-gray-500" />
          <ellipse cx="248" cy="78" rx="38" ry="12" className="fill-gray-300 dark:fill-gray-600" />
        </g>
        <text x="250" y="48" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Condensation</text>

        {/* Cloud 2 near mountain (orographic) */}
        <g className="wc-cloud2">
          <ellipse cx="405" cy="82" rx="28" ry="14" className="fill-gray-300 dark:fill-gray-500" />
          <ellipse cx="420" cy="74" rx="30" ry="15" className="fill-gray-200 dark:fill-gray-400" />
          <ellipse cx="440" cy="82" rx="25" ry="12" className="fill-gray-300 dark:fill-gray-500" />
        </g>

        {/* Rain from cloud 1 */}
        {[228,240,252,264,237,249,261].map((x, i) => (
          <line key={`r1-${i}`}
            className={`wc-rainD${i < 4 ? (i + 1 === 1 ? '' : (i + 1).toString()) : (i).toString()}`}
            x1={x} y1={88} x2={x - 2} y2={96}
            stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        ))}

        {/* Rain from cloud 2 (orographic) */}
        {[400,412,424,436,406,418,430].map((x, i) => (
          <line key={`r2-${i}`}
            className={`wc-rainD${i < 4 ? (i + 1 === 1 ? '' : (i + 1).toString()) : (i).toString()}`}
            x1={x} y1={96} x2={x - 2} y2={104}
            stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        <text x="312" y="100" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="bold">Precipitation</text>
        <text x="470" y="74" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Orographic rain</text>

        {/* Land */}
        <rect x="220" y="250" width="380" height="150" fill="url(#wc-ground)" />

        {/* Mountain */}
        <polygon points="360,250 435,120 510,250" fill="url(#wc-mtn)" />
        <polygon points="435,120 415,155 455,155" className="fill-white dark:fill-gray-300" opacity="0.85" />
        <text x="435" y="220" textAnchor="middle" className="fill-stone-200 dark:fill-stone-300" fontSize="10" fontWeight="600">Mountain</text>

        {/* River flowing from mountain to ocean (animated) */}
        <path d="M 470,250 Q 440,270 390,278 Q 340,286 290,280 Q 255,276 220,268"
          fill="none" className="wc-river stroke-blue-400 dark:stroke-blue-500" strokeWidth="4" strokeLinecap="round" />
        <text x="330" y="272" textAnchor="middle" className="fill-blue-200 dark:fill-blue-300" fontSize="11" fontWeight="600">River</text>

        {/* Runoff label */}
        <text x="505" y="248" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="bold">Runoff</text>
        <path d="M 500,250 Q 490,258 475,254" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#wc-arw)" />

        {/* Infiltration arrows */}
        <line x1="310" y1="250" x2="310" y2="290" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="350" y1="250" x2="350" y2="295" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="330" y="310" textAnchor="middle" className="fill-blue-400 dark:fill-blue-400" fontSize="10" fontWeight="bold">Infiltration</text>

        {/* Groundwater layer */}
        <rect x="220" y="340" width="380" height="30" className="fill-blue-400/20 dark:fill-blue-600/25" />
        <text x="410" y="360" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10" fontWeight="600">Groundwater</text>

        {/* Groundwater seep particles flowing toward ocean */}
        <circle className="wc-gndP" cx="290" cy="350" r="2.5" fill="#60a5fa" />
        <circle className="wc-gndP2" cx="310" cy="355" r="2" fill="#93c5fd" />
        <circle className="wc-gndP3" cx="280" cy="358" r="2.5" fill="#60a5fa" />
        <circle className="wc-gndP4" cx="300" cy="348" r="2" fill="#93c5fd" />

        {/* Trees on land with transpiration */}
        {[265, 530].map((x) => (
          <g key={`t-${x}`}>
            <line x1={x} y1={250} x2={x} y2={232} stroke="#92400e" strokeWidth="3" />
            <circle cx={x} cy={226} r="10" className="fill-green-500 dark:fill-green-600" />
            <circle cx={x - 5} cy={222} r="7" className="fill-green-400 dark:fill-green-500" />
            <circle cx={x + 5} cy={222} r="7" className="fill-green-400 dark:fill-green-500" />
          </g>
        ))}
        {/* Transpiration vapor */}
        <circle className="wc-transp" cx="265" cy="216" r="2" fill="#86efac" opacity="0.6" />
        <circle className="wc-transp2" cx="270" cy="214" r="1.5" fill="#86efac" opacity="0.5" />
        <text x="255" y="198" className="fill-green-600 dark:fill-green-400" fontSize="9">Transpiration</text>

        {/* Arrow marker */}
        <defs>
          <marker id="wc-arw" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
