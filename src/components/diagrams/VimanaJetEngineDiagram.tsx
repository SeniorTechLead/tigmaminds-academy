export default function VimanaJetEngineDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 572 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Cross-section of a turbofan jet engine showing intake, compressor, combustion, turbine, and exhaust stages"
      >
        <defs>
          <marker id="vje-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="vje-arrow-orange" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
          </marker>
          <marker id="vje-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Inside a Jet Engine (Turbofan)
        </text>

        {/* Engine outer casing */}
        <path d="M 60,120 L 60,260 C 80,280 460,280 480,260 L 480,120 C 460,100 80,100 60,120 Z"
          fill="none" className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="2" />

        {/* Section dividers */}
        <line x1="145" y1="105" x2="145" y2="275" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="235" y1="105" x2="235" y2="275" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="340" y1="105" x2="340" y2="275" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="420" y1="105" x2="420" y2="275" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* 1. INTAKE - fan blades */}
        <line x1="95" y1="130" x2="85" y2="180" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="3" strokeLinecap="round" />
        <line x1="95" y1="250" x2="85" y2="200" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="125" x2="100" y2="175" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="255" x2="100" y2="205" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="3" strokeLinecap="round" />
        {/* Intake air arrows */}
        <line x1="25" y1="170" x2="58" y2="170" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#vje-arrow-blue)" />
        <line x1="25" y1="190" x2="58" y2="190" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#vje-arrow-blue)" />
        <line x1="25" y1="210" x2="58" y2="210" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#vje-arrow-blue)" />

        {/* Section label: Intake */}
        <text x="100" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-sky-600 dark:fill-sky-300">Fan</text>

        {/* 2. COMPRESSOR - angled blades */}
        {[155, 170, 185, 200, 215].map((x, i) => (
          <g key={`comp-${i}`}>
            <line x1={x} y1={135 + i * 2} x2={x - 5} y2={190} className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2" strokeLinecap="round" />
            <line x1={x} y1={245 - i * 2} x2={x - 5} y2={195} className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
        <text x="190" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-blue-600 dark:fill-blue-300">Compressor</text>

        {/* 3. COMBUSTION chamber */}
        <rect x="245" y="145" width="85" height="90" rx="4"
          className="fill-orange-100 dark:fill-orange-900/30 stroke-orange-400 dark:stroke-orange-600" strokeWidth="1.5" />
        {/* Flame shapes */}
        <ellipse cx="270" cy="190" rx="8" ry="15" className="fill-orange-400 dark:fill-orange-500" opacity="0.7" />
        <ellipse cx="288" cy="190" rx="8" ry="18" className="fill-red-500 dark:fill-red-400" opacity="0.6" />
        <ellipse cx="306" cy="190" rx="8" ry="14" className="fill-yellow-400 dark:fill-yellow-500" opacity="0.7" />
        {/* Fuel injection */}
        <line x1="287" y1="145" x2="287" y2="125" className="stroke-orange-500" strokeWidth="2" markerEnd="url(#vje-arrow-orange)" />
        <text x="287" y="118" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-orange-600 dark:fill-orange-300">+ Fuel</text>
        <text x="287" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-orange-600 dark:fill-orange-300">Combustion</text>

        {/* 4. TURBINE */}
        {[350, 370, 390].map((x, i) => (
          <g key={`turb-${i}`}>
            <line x1={x} y1={140 + i * 3} x2={x + 5} y2={190} className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={x} y1={240 - i * 3} x2={x + 5} y2={192} className="stroke-red-400 dark:stroke-red-500" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
        <text x="380" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-red-600 dark:fill-red-300">Turbine</text>

        {/* Shaft connecting turbine to compressor */}
        <line x1="145" y1="190" x2="400" y2="190"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" strokeDasharray="6,3" />

        {/* 5. EXHAUST */}
        <line x1="482" y1="170" x2="520" y2="170" className="stroke-red-500" strokeWidth="2" markerEnd="url(#vje-arrow-red)" />
        <line x1="482" y1="190" x2="525" y2="190" className="stroke-red-500" strokeWidth="2.5" markerEnd="url(#vje-arrow-red)" />
        <line x1="482" y1="210" x2="520" y2="210" className="stroke-red-500" strokeWidth="2" markerEnd="url(#vje-arrow-red)" />
        <text x="450" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-red-600 dark:fill-red-300">Exhaust</text>

        {/* Process flow */}
        <rect x="20" y="315" width="500" height="70" rx="6"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="270" y="335" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          Suck → Squeeze → Bang → Blow
        </text>
        <text x="270" y="353" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          Fan draws air in → Compressor squeezes it → Fuel burns in compressed air → Hot gas spins turbine and exits
        </text>
        <text x="270" y="370" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontStyle="italic" className="fill-slate-500 dark:fill-slate-400">
          Newton’s 3rd law: exhaust gas pushed backward = engine pushed forward (thrust)
        </text>
      </svg>
    </div>
  );
}
