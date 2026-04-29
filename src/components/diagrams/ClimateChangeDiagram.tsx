export default function ClimateChangeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 540 420" className="w-full h-auto" role="img"
        aria-label="Animated greenhouse effect: sun rays, trapped heat, CO2 accumulation, rising temperature, shrinking ice">
        <style>{`
          @keyframes sunRayDown {
            0% { transform: translateY(-20px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(60px); opacity: 0.3; }
          }
          @keyframes heatBounce {
            0% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(-30px); opacity: 0.9; }
            100% { transform: translateY(0); opacity: 0.3; }
          }
          @keyframes heatTrapped {
            0% { transform: translateY(0); opacity: 0; }
            20% { opacity: 0.9; }
            50% { transform: translateY(25px); opacity: 0.8; }
            80% { opacity: 0.6; }
            100% { transform: translateY(50px); opacity: 0; }
          }
          @keyframes heatEscape {
            0% { transform: translateY(0); opacity: 0.7; }
            100% { transform: translateY(-50px); opacity: 0; }
          }
          @keyframes co2Appear {
            0% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 0.5; transform: scale(1); }
          }
          @keyframes co2Float {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-3px) translateX(2px); }
            50% { transform: translateY(0) translateX(-2px); }
            75% { transform: translateY(3px) translateX(1px); }
            100% { transform: translateY(0) translateX(0); }
          }
          @keyframes tempRise {
            0% { height: 10; y: 335; }
            100% { height: 65; y: 280; }
          }
          @keyframes iceShri {
            0% { transform: scaleX(1); }
            100% { transform: scaleX(0.4); }
          }
          @keyframes sunPulse {
            0%, 100% { r: 24; opacity: 0.85; }
            50% { r: 27; opacity: 1; }
          }
          @keyframes rayGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .sun-pulse { animation: sunPulse 3s ease-in-out infinite; }
          .ray-down1 { animation: sunRayDown 2.5s linear infinite; }
          .ray-down2 { animation: sunRayDown 2.5s linear 0.5s infinite; }
          .ray-down3 { animation: sunRayDown 2.5s linear 1s infinite; }
          .ray-down4 { animation: sunRayDown 2.5s linear 1.5s infinite; }
          .ray-down5 { animation: sunRayDown 2.5s linear 2s infinite; }
          .heat-up1 { animation: heatBounce 2s ease-in-out infinite; }
          .heat-up2 { animation: heatBounce 2s ease-in-out 0.5s infinite; }
          .heat-up3 { animation: heatBounce 2s ease-in-out 1s infinite; }
          .heat-trapped1 { animation: heatTrapped 3s ease-in-out infinite; }
          .heat-trapped2 { animation: heatTrapped 3s ease-in-out 0.8s infinite; }
          .heat-trapped3 { animation: heatTrapped 3s ease-in-out 1.6s infinite; }
          .heat-escape1 { animation: heatEscape 2s ease-out infinite; }
          .heat-escape2 { animation: heatEscape 2s ease-out 1s infinite; }
          .co2-1 { animation: co2Appear 4s ease-out forwards, co2Float 5s ease-in-out 4s infinite; }
          .co2-2 { animation: co2Appear 4s ease-out 1s forwards, co2Float 5s ease-in-out 5s infinite; }
          .co2-3 { animation: co2Appear 4s ease-out 2s forwards, co2Float 5s ease-in-out 6s infinite; }
          .co2-4 { animation: co2Appear 4s ease-out 3s forwards, co2Float 5s ease-in-out 7s infinite; }
          .co2-5 { animation: co2Appear 4s ease-out 4s forwards, co2Float 5s ease-in-out 8s infinite; }
          .co2-6 { animation: co2Appear 4s ease-out 5s forwards, co2Float 5s ease-in-out 9s infinite; }
          .temp-bar { animation: tempRise 8s ease-out forwards; }
          .ice-left { animation: iceShri 10s ease-out forwards; transform-origin: 160px 200px; }
          .ice-right { animation: iceShri 10s ease-out forwards; transform-origin: 480px 200px; }
          .ray-glow { animation: rayGlow 2s ease-in-out infinite; }
        `}</style>

        <rect width="540" height="420" rx="8" className="fill-slate-950" />

        <text x="270" y="24" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          Climate Change: The Enhanced Greenhouse Effect
        </text>

        {/* ===== GREENHOUSE EFFECT SCENE ===== */}

        {/* Sun */}
        <circle cx="70" cy="60" r="24" fill="#fbbf24" className="sun-pulse" />
        <text x="70" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#451a03">Sun</text>
        {/* Sun rays */}
        <line x1="90" y1="50" x2="105" y2="45" stroke="#fbbf24" strokeWidth="1.5" className="ray-glow" />
        <line x1="94" y1="60" x2="110" y2="58" stroke="#fbbf24" strokeWidth="1.5" className="ray-glow" />
        <line x1="90" y1="72" x2="105" y2="78" stroke="#fbbf24" strokeWidth="1.5" className="ray-glow" />

        {/* Incoming solar rays — animated downward */}
        <line x1="120" y1="55" x2="200" y2="130" stroke="#fbbf24" strokeWidth="2" className="ray-down1" />
        <line x1="130" y1="50" x2="250" y2="130" stroke="#fbbf24" strokeWidth="2" className="ray-down2" />
        <line x1="140" y1="60" x2="300" y2="130" stroke="#fbbf24" strokeWidth="2" className="ray-down3" />
        <line x1="125" y1="65" x2="350" y2="130" stroke="#fbbf24" strokeWidth="2" className="ray-down4" />
        <line x1="135" y1="72" x2="400" y2="130" stroke="#fbbf24" strokeWidth="2" className="ray-down5" />

        <text x="155" y="88" fontSize="10" fill="#fbbf24">Solar energy</text>

        {/* Atmosphere / greenhouse gas layer */}
        <rect x="150" y="122" width="370" height="38" rx="4" fill="#7c3aed" opacity="0.12" />
        <rect x="150" y="122" width="370" height="38" rx="4" fill="none" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="4,3" />
        <text x="335" y="138" textAnchor="middle" fontSize="10" fill="#a78bfa">Atmosphere (CO2, CH4, N2O)</text>
        <text x="335" y="152" textAnchor="middle" fontSize="10" fill="#a78bfa">420+ ppm CO2 (was 280 pre-industrial)</text>

        {/* CO2 molecules accumulating — animated appearance */}
        <g className="co2-1"><circle cx="190" cy="135" r="4" fill="#a78bfa" opacity="0" /><text x="190" y="138" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>
        <g className="co2-2"><circle cx="240" cy="142" r="4" fill="#a78bfa" opacity="0" /><text x="240" y="145" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>
        <g className="co2-3"><circle cx="300" cy="130" r="4" fill="#a78bfa" opacity="0" /><text x="300" y="133" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>
        <g className="co2-4"><circle cx="360" cy="145" r="4" fill="#a78bfa" opacity="0" /><text x="360" y="148" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>
        <g className="co2-5"><circle cx="420" cy="132" r="4" fill="#a78bfa" opacity="0" /><text x="420" y="135" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>
        <g className="co2-6"><circle cx="470" cy="140" r="4" fill="#a78bfa" opacity="0" /><text x="470" y="143" textAnchor="middle" fontSize="7" fill="#e9d5ff">CO2</text></g>

        {/* Earth surface */}
        <rect x="150" y="175" width="370" height="35" rx="4" fill="#166534" opacity="0.3" />
        <text x="335" y="196" textAnchor="middle" fontSize="10" fill="#4ade80">Earth's surface absorbs and re-emits heat</text>

        {/* Ice caps — shrinking */}
        <g className="ice-left">
          <polygon points="150,175 175,165 200,175" fill="#bfdbfe" opacity="0.8" />
          <polygon points="155,175 170,168 185,175" fill="#e0f2fe" opacity="0.9" />
        </g>
        <g className="ice-right">
          <polygon points="470,175 495,165 520,175" fill="#bfdbfe" opacity="0.8" />
          <polygon points="475,175 490,168 505,175" fill="#e0f2fe" opacity="0.9" />
        </g>

        {/* Heat radiation going UP from Earth surface */}
        <line x1="230" y1="175" x2="230" y2="160" stroke="#f87171" strokeWidth="2" className="heat-up1" />
        <line x1="310" y1="175" x2="310" y2="160" stroke="#f87171" strokeWidth="2" className="heat-up2" />
        <line x1="390" y1="175" x2="390" y2="160" stroke="#f87171" strokeWidth="2" className="heat-up3" />

        {/* Some heat escapes through atmosphere */}
        <line x1="250" y1="122" x2="242" y2="80" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" className="heat-escape1" />
        <line x1="450" y1="122" x2="445" y2="80" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" className="heat-escape2" />
        <text x="210" y="78" fontSize="10" fill="#fca5a5">Some escapes</text>

        {/* Trapped heat bouncing back DOWN to Earth */}
        <line x1="320" y1="140" x2="340" y2="172" stroke="#f87171" strokeWidth="2" className="heat-trapped1" />
        <line x1="370" y1="140" x2="400" y2="172" stroke="#f87171" strokeWidth="2" className="heat-trapped2" />
        <line x1="270" y1="140" x2="290" y2="172" stroke="#f87171" strokeWidth="2" className="heat-trapped3" />

        <text x="470" y="115" fontSize="10" fontWeight="bold" fill="#f87171">Greenhouse</text>
        <text x="470" y="127" fontSize="10" fontWeight="bold" fill="#f87171">gases trap</text>
        <text x="470" y="139" fontSize="10" fontWeight="bold" fill="#f87171">heat ↓</text>

        {/* More CO2 = more trapping label */}
        <text x="160" y="115" fontSize="10" fill="#c4b5fd">More CO2 =</text>
        <text x="160" y="127" fontSize="10" fill="#c4b5fd">thicker blanket</text>

        {/* ===== TEMPERATURE TREND GRAPH ===== */}
        <rect x="30" y="230" width="480" height="175" rx="6" fill="none" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="270" y="250" textAnchor="middle" fontSize="12" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">
          Global Temperature Anomaly (1880-2024)
        </text>

        {/* Axes */}
        <line x1="80" y1="265" x2="80" y2="385" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="80" y1="345" x2="480" y2="345" className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,4" />
        <text x="75" y="280" textAnchor="end" fontSize="10" fill="#fca5a5">+1.2 °C</text>
        <text x="75" y="348" textAnchor="end" fontSize="10" className="fill-gray-400 dark:fill-slate-500">0 °C</text>
        <text x="75" y="385" textAnchor="end" fontSize="10" fill="#93c5fd">-0.4 °C</text>

        {/* Year labels */}
        <text x="90" y="398" fontSize="10" className="fill-gray-400 dark:fill-slate-500">1880</text>
        <text x="210" y="398" fontSize="10" className="fill-gray-400 dark:fill-slate-500">1940</text>
        <text x="340" y="398" fontSize="10" className="fill-gray-400 dark:fill-slate-500">1980</text>
        <text x="450" y="398" fontSize="10" className="fill-gray-400 dark:fill-slate-500">2024</text>

        {/* Temperature line — self-drawing */}
        <polyline
          points="90,360 110,363 130,356 150,362 170,355 190,352 210,349 230,346 250,344 270,340 290,334 310,328 330,322 350,312 370,306 390,296 410,288 430,280 450,274 470,268"
          fill="none" stroke="#f87171" strokeWidth="2.5"
          strokeDasharray="600" strokeDashoffset="600"
        >
          <animate attributeName="stroke-dashoffset" from="600" to="0" dur="6s" fill="freeze" />
        </polyline>

        {/* Shaded area under the rising part */}
        <path d="M 270,340 L 290,334 310,328 330,322 350,312 370,306 390,296 410,288 430,280 450,274 470,268 470,345 270,345 Z"
          fill="#f87171" opacity="0.1" />

        {/* Animated temperature bar on right side */}
        <rect x="482" y="335" width="16" height="10" rx="2" fill="#f87171" className="temp-bar" />
        <text x="490" y="275" textAnchor="middle" fontSize="8" fill="#fca5a5">T</text>

        {/* Paris target */}
        <line x1="80" y1="296" x2="480" y2="296" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
        <text x="480" y="292" textAnchor="end" fontSize="10" fill="#fbbf24">1.5 °C Paris target</text>

        {/* Highlight recent acceleration */}
        <rect x="350" y="256" width="120" height="18" rx="3" fill="#991b1b" opacity="0.3" />
        <text x="410" y="268" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fca5a5">Accelerating</text>
      </svg>
    </div>
  );
}
