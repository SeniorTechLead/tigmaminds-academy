const ElephantHeatTransferDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Four modes of heat transfer illustrated with elephant examples: conduction, convection, radiation, and evaporation"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes wiggle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
          .wiggle { animation: wiggle 2s ease-in-out infinite; }
          @keyframes rise { 0%{opacity:0.8;transform:translateY(0)} 100%{opacity:0;transform:translateY(-18px)} }
          .rise { animation: rise 2.5s ease-out infinite; }
        `}</style>

        <rect width="640" height="480" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          Four Ways Heat Moves — Every Mud Bath Uses All Four
        </text>

        {/* Grid: 2x2 */}
        {/* 1. CONDUCTION — top left */}
        <rect x="16" y="42" width="300" height="200" rx="8"
          className="fill-orange-50 dark:fill-orange-900/10 stroke-orange-300 dark:stroke-orange-700" strokeWidth="1" />
        <text x="166" y="62" textAnchor="middle" className="heading fill-orange-700 dark:fill-orange-400">
          ❶ Conduction — Direct Contact
        </text>

        {/* Elephant foot in mud */}
        <rect x="60" y="160" width="160" height="40" rx="4" fill="#92400e" opacity="0.4" />
        <text x="140" y="183" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400">Cool mud (25 °C)</text>
        <rect x="105" y="110" width="30" height="52" rx="3"
          className="fill-slate-400 dark:fill-slate-500 stroke-slate-500 dark:stroke-slate-400" strokeWidth="1.5" />
        <text x="120" y="105" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">Foot (36 °C)</text>

        {/* Heat arrow: foot to mud */}
        <line x1="145" y1="140" x2="175" y2="170" stroke="#ef4444" strokeWidth="2" markerEnd="url(#heat-arr)" />
        <text x="186" y="152" className="small fill-red-600 dark:fill-red-400">Heat flows</text>
        <text x="186" y="164" className="small fill-red-600 dark:fill-red-400">into mud</text>

        <text x="166" y="218" textAnchor="middle" className="small fill-orange-600 dark:fill-orange-300">
          Hot touches cold → heat conducts through contact
        </text>
        <text x="166" y="232" textAnchor="middle" className="small fill-orange-600 dark:fill-orange-300">
          Water conducts 24× better than air
        </text>

        {/* 2. CONVECTION — top right */}
        <rect x="324" y="42" width="300" height="200" rx="8"
          className="fill-blue-50 dark:fill-blue-900/10 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="474" y="62" textAnchor="middle" className="heading fill-blue-700 dark:fill-blue-400">
          ❷ Convection — Moving Fluid
        </text>

        {/* Elephant ear shape */}
        <ellipse cx="440" cy="140" rx="30" ry="45"
          fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
        <text x="440" y="100" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">Warm ear</text>

        {/* Wind arrows */}
        {[115, 135, 155, 175].map((y, i) => (
          <g key={i} className="wiggle" style={{ animationDelay: `\${i * 0.3}s` }}>
            <line x1="485" y1={y} x2="535" y2={y} stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#wind-arr)" />
          </g>
        ))}
        <text x="545" y="140" className="small fill-blue-600 dark:fill-blue-400">Wind carries</text>
        <text x="545" y="152" className="small fill-blue-600 dark:fill-blue-400">warm air away</text>

        {/* Blood vessel lines in ear */}
        {[120, 135, 150, 165].map((y, i) => (
          <line key={i} x1="415" y1={y} x2="465" y2={y} stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
        ))}

        <text x="474" y="218" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Moving air or water replaces warm layer with cool
        </text>
        <text x="474" y="232" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300">
          Ear flapping = forced convection (+100% cooling)
        </text>

        {/* 3. RADIATION — bottom left */}
        <rect x="16" y="250" width="300" height="210" rx="8"
          className="fill-purple-50 dark:fill-purple-900/10 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="166" y="270" textAnchor="middle" className="heading fill-purple-700 dark:fill-purple-400">
          ❸ Radiation — Infrared Waves
        </text>

        {/* Elephant silhouette */}
        <ellipse cx="120" cy="350" rx="50" ry="35"
          className="fill-slate-300 dark:fill-slate-600" />
        <ellipse cx="80" cy="340" rx="20" ry="25"
          className="fill-slate-300 dark:fill-slate-600" />
        <text x="120" y="353" textAnchor="middle" className="small fill-slate-700 dark:fill-slate-200">36 °C</text>

        {/* Wavy IR lines outward */}
        {[0, 30, 60, 90, 120, 150, 180].map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = 120 + 55 * Math.cos(rad);
          const y1 = 350 + 40 * Math.sin(rad);
          const x2 = 120 + 80 * Math.cos(rad);
          const y2 = 350 + 60 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
          );
        })}

        {/* Night sky label */}
        <rect x="200" y="300" width="100" height="40" rx="4"
          className="fill-slate-800 dark:fill-slate-700" />
        <text x="250" y="316" textAnchor="middle" className="small" fill="#e2e8f0">Night sky</text>
        <text x="250" y="330" textAnchor="middle" className="small" fill="#e2e8f0">~3 K (cold!)</text>

        <text x="166" y="425" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-300">
          All objects emit infrared — hotter = more radiation
        </text>
        <text x="166" y="439" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-300">
          At night, elephants radiate heat to cold sky efficiently
        </text>
        <text x="166" y="453" textAnchor="middle" className="small fill-purple-600 dark:fill-purple-300">
          Power ∝ T⁴ (Stefan-Boltzmann law)
        </text>

        {/* 4. EVAPORATION — bottom right */}
        <rect x="324" y="250" width="300" height="210" rx="8"
          className="fill-cyan-50 dark:fill-cyan-900/10 stroke-cyan-300 dark:stroke-cyan-700" strokeWidth="1" />
        <text x="474" y="270" textAnchor="middle" className="heading fill-cyan-700 dark:fill-cyan-400">
          ❹ Evaporation — Phase Change
        </text>

        {/* Mud on skin cross-section */}
        <rect x="380" y="350" width="180" height="16" rx="2"
          className="fill-slate-400 dark:fill-slate-500" />
        <text x="470" y="380" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">Elephant skin</text>
        <rect x="380" y="338" width="180" height="14" rx="2"
          fill="#92400e" opacity="0.5" />
        <text x="565" y="349" className="small fill-amber-700 dark:fill-amber-400">Mud layer</text>

        {/* Evaporation arrows */}
        {[410, 440, 470, 500, 530].map((x, i) => (
          <g key={i} className="rise" style={{ animationDelay: `\${i * 0.4}s` }}>
            <text x={x} y={330} textAnchor="middle" className="small fill-cyan-500">
              ↑
            </text>
          </g>
        ))}
        <text x="470" y="316" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-400">
          H₂O molecules escape
        </text>

        {/* Energy box */}
        <rect x="388" y="400" width="164" height="36" rx="4"
          className="fill-cyan-100 dark:fill-cyan-900/30 stroke-cyan-400 dark:stroke-cyan-600" strokeWidth="1" />
        <text x="470" y="416" textAnchor="middle" className="label fill-cyan-700 dark:fill-cyan-300" fontWeight="600">
          2,260 J per gram
        </text>
        <text x="470" y="430" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-300">
          Most powerful cooling method
        </text>

        <text x="474" y="453" textAnchor="middle" className="small fill-cyan-600 dark:fill-cyan-300">
          Mud holds water longer → hours of slow cooling
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="heat-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="wind-arr" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default ElephantHeatTransferDiagram;
