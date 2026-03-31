const MonsoonFailureDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 640 540"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how El Nino weakens the monsoon and the consequences of monsoon failure"
      >
        <style>{`
          @keyframes warmPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes droughtFade {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          .warm-pulse {
            animation: warmPulse 2s ease-in-out infinite;
          }
          .drought-pulse {
            animation: droughtFade 2.5s ease-in-out infinite;
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
          .small-text {
            font-family: system-ui, sans-serif;
            font-size: 9px;
          }
          .value-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-weight: 700;
          }
        `}</style>

        <defs>
          <marker id="mfail-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="mfail-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
          <marker id="mfail-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="620" height="520" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          When the Monsoon Fails — El Niño and Its Consequences
        </text>

        {/* ===== TOP: EL NINO MECHANISM ===== */}
        <rect x="15" y="35" width="590" height="175" rx="6"
          className="fill-red-50/50 dark:fill-red-900/10 stroke-red-200 dark:stroke-red-800" strokeWidth="1" />

        <text x="310" y="52" textAnchor="middle"
          className="section-title fill-red-700 dark:fill-red-300">
          El Niño: The Pacific Ocean’s Disruption
        </text>

        {/* Pacific Ocean simplified */}
        <rect x="30" y="62" width="560" height="55" rx="4"
          className="fill-blue-200 dark:fill-blue-900" opacity="0.4" />

        {/* Normal - cold east Pacific */}
        <rect x="40" y="68" width="120" height="42" rx="3"
          className="fill-blue-400 dark:fill-blue-600" opacity="0.6" />
        <text x="100" y="83" textAnchor="middle"
          className="small-text fill-blue-900 dark:fill-blue-200">
          NORMAL: Cold water
        </text>
        <text x="100" y="95" textAnchor="middle"
          className="small-text fill-blue-900 dark:fill-blue-200">
          (E. Pacific / Peru)
        </text>
        <text x="100" y="107" textAnchor="middle"
          className="small-text fill-blue-800 dark:fill-blue-300">
          Upwelling brings nutrients
        </text>

        {/* Arrow showing El Nino warming */}
        <line x1="165" y1="88" x2="210" y2="88" stroke="#ef4444" strokeWidth="2"
          markerEnd="url(#mfail-arrow-red)" />

        {/* El Nino - warm east Pacific */}
        <rect x="215" y="68" width="160" height="42" rx="3"
          className="fill-red-300 dark:fill-red-700 warm-pulse" opacity="0.7" />
        <text x="295" y="83" textAnchor="middle"
          className="small-text fill-red-900 dark:fill-red-200" fontWeight="600">
          EL NIÑO: Water warms
        </text>
        <text x="295" y="95" textAnchor="middle"
          className="small-text fill-red-900 dark:fill-red-200">
          +2–3°C above normal
        </text>
        <text x="295" y="107" textAnchor="middle"
          className="small-text fill-red-800 dark:fill-red-300">
          Shifts rain zone eastward
        </text>

        {/* Walker Circulation disrupted */}
        <rect x="395" y="68" width="185" height="42" rx="3"
          className="fill-amber-100 dark:fill-amber-900/40 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="487" y="83" textAnchor="middle"
          className="small-text fill-amber-800 dark:fill-amber-200" fontWeight="600">
          Walker Circulation weakens
        </text>
        <text x="487" y="95" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          Normal: rising air over India/Pacific
        </text>
        <text x="487" y="107" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          El Niño: rising air shifts to E. Pacific
        </text>

        {/* Chain of effects */}
        <text x="310" y="130" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Chain of Disruption:
        </text>

        {/* Steps */}
        <rect x="30" y="140" width="130" height="26" rx="3"
          className="fill-red-100 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="95" y="157" textAnchor="middle"
          className="small-text fill-red-700 dark:fill-red-300">
          E. Pacific warms
        </text>

        <line x1="165" y1="153" x2="185" y2="153" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mfail-arrow-red)" />

        <rect x="190" y="140" width="130" height="26" rx="3"
          className="fill-red-100 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="255" y="157" textAnchor="middle"
          className="small-text fill-red-700 dark:fill-red-300">
          Trade winds weaken
        </text>

        <line x1="325" y1="153" x2="345" y2="153" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mfail-arrow-red)" />

        <rect x="350" y="140" width="130" height="26" rx="3"
          className="fill-red-100 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="415" y="157" textAnchor="middle"
          className="small-text fill-red-700 dark:fill-red-300">
          Indian Ocean dries
        </text>

        <line x1="485" y1="153" x2="505" y2="153" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#mfail-arrow-red)" />

        <rect x="510" y="140" width="85" height="26" rx="3"
          className="fill-red-200 dark:fill-red-800/50 stroke-red-400 dark:stroke-red-600" strokeWidth="1" />
        <text x="552" y="157" textAnchor="middle"
          className="small-text fill-red-800 dark:fill-red-200" fontWeight="600">
          WEAK monsoon
        </text>

        {/* Bottom left: Monsoon fails — Drought */}
        <text x="177" y="228" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Too Little Rain: Drought
        </text>

        <rect x="30" y="235" width="295" height="130" rx="6"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />

        <rect x="40" y="245" width="100" height="50" rx="3"
          className="fill-amber-200 dark:fill-amber-800/50 drought-pulse" />
        <text x="90" y="265" textAnchor="middle"
          className="small-text fill-amber-900 dark:fill-amber-200" fontWeight="600">
          Cracked fields
        </text>
        <text x="90" y="278" textAnchor="middle"
          className="small-text fill-amber-800 dark:fill-amber-300">
          Crops wither
        </text>

        <text x="180" y="258" textAnchor="middle"
          className="label-text fill-amber-800 dark:fill-amber-200" fontWeight="600">
          El Niño years:
        </text>
        <text x="240" y="275" textAnchor="end"
          className="small-text fill-amber-700 dark:fill-amber-300">
          • 1877–78: Great Famine (5.5M+ died)
        </text>
        <text x="240" y="289" textAnchor="end"
          className="small-text fill-amber-700 dark:fill-amber-300">
          • 2002: monsoon 19% below normal
        </text>
        <text x="240" y="303" textAnchor="end"
          className="small-text fill-amber-700 dark:fill-amber-300">
          • 2009: worst drought in 37 years
        </text>
        <text x="240" y="317" textAnchor="end"
          className="small-text fill-amber-700 dark:fill-amber-300">
          • 2015: another El Niño drought
        </text>

        <text x="177" y="345" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          India’s GDP drops ~2% in drought years.
        </text>
        <text x="177" y="358" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          600M+ farmers depend on monsoon rain.
        </text>

        {/* Bottom right: Too much rain — Floods */}
        <text x="462" y="228" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          Too Much Rain: Floods
        </text>

        <rect x="325" y="235" width="275" height="130" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />

        <rect x="335" y="245" width="100" height="50" rx="3"
          className="fill-blue-200 dark:fill-blue-800/50" />
        <text x="385" y="265" textAnchor="middle"
          className="small-text fill-blue-900 dark:fill-blue-200" fontWeight="600">
          Flooded land
        </text>
        <text x="385" y="278" textAnchor="middle"
          className="small-text fill-blue-800 dark:fill-blue-300">
          Rivers overflow
        </text>

        <text x="480" y="258" textAnchor="middle"
          className="label-text fill-blue-800 dark:fill-blue-200" fontWeight="600">
          La Niña / active years:
        </text>
        <text x="540" y="275" textAnchor="end"
          className="small-text fill-blue-700 dark:fill-blue-300">
          • 2022: Assam floods, 5.5M affected
        </text>
        <text x="540" y="289" textAnchor="end"
          className="small-text fill-blue-700 dark:fill-blue-300">
          • 2020: Brahmaputra highest in 18yr
        </text>
        <text x="540" y="303" textAnchor="end"
          className="small-text fill-blue-700 dark:fill-blue-300">
          • 2017: 1/3 of Bangladesh flooded
        </text>
        <text x="540" y="317" textAnchor="end"
          className="small-text fill-blue-700 dark:fill-blue-300">
          • Climate change → more extremes
        </text>

        <text x="462" y="345" textAnchor="middle"
          className="small-text fill-blue-700 dark:fill-blue-300">
          Extreme rain events increasing 3× since 1950.
        </text>
        <text x="462" y="358" textAnchor="middle"
          className="small-text fill-blue-700 dark:fill-blue-300">
          Same total rain, but in fewer, heavier bursts.
        </text>

        {/* ===== FORECASTING ===== */}
        <rect x="30" y="380" width="560" height="126" rx="6"
          className="fill-indigo-50 dark:fill-indigo-900/20 stroke-indigo-300 dark:stroke-indigo-700" strokeWidth="1" />

        <text x="310" y="398" textAnchor="middle"
          className="section-title fill-indigo-700 dark:fill-indigo-200">
          Forecasting the Monsoon — The Hardest Weather Problem
        </text>

        <rect x="42" y="410" width="165" height="44" rx="3"
          className="fill-indigo-100 dark:fill-indigo-800/30" />
        <text x="124" y="425" textAnchor="middle"
          className="label-text fill-indigo-700 dark:fill-indigo-200" fontWeight="600">
          IMD Long-Range Forecast
        </text>
        <text x="124" y="439" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          April: predict Jun–Sep rain
        </text>
        <text x="124" y="449" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Accuracy: ±5% of actual
        </text>

        <rect x="225" y="410" width="165" height="44" rx="3"
          className="fill-indigo-100 dark:fill-indigo-800/30" />
        <text x="307" y="425" textAnchor="middle"
          className="label-text fill-indigo-700 dark:fill-indigo-200" fontWeight="600">
          Key Predictors
        </text>
        <text x="307" y="439" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Pacific SST (El Niño/La Niña)
        </text>
        <text x="307" y="449" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Snow cover, IOD, jet position
        </text>

        <rect x="408" y="410" width="170" height="44" rx="3"
          className="fill-indigo-100 dark:fill-indigo-800/30" />
        <text x="493" y="425" textAnchor="middle"
          className="label-text fill-indigo-700 dark:fill-indigo-200" fontWeight="600">
          Why It’s Hard
        </text>
        <text x="493" y="439" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Chaotic system, many variables
        </text>
        <text x="493" y="449" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Local vs regional interactions
        </text>

        <text x="310" y="478" textAnchor="middle"
          className="label-text fill-indigo-700 dark:fill-indigo-200" fontWeight="600">
          The monsoon matters more than any other weather system: 1.5 billion people depend on it for food and water.
        </text>

        <text x="310" y="496" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-300">
          Getting the forecast right — even by a few percent — can save millions of tonnes of crops and thousands of lives.
        </text>
      </svg>
    </div>
  );
};

export default MonsoonFailureDiagram;
