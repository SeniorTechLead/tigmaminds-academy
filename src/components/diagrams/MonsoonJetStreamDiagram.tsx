const MonsoonJetStreamDiagram = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing jet streams, the Tibetan Plateau effect, and their role in steering the monsoon"
      >
        <style>{`
          @keyframes jetFlow {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes thermalRise {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50% { opacity: 0.7; transform: translateY(-4px); }
          }
          .jet-flow {
            animation: jetFlow 1.2s linear infinite;
          }
          .thermal-rise {
            animation: thermalRise 2.5s ease-in-out infinite;
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
        `}</style>

        <defs>
          <marker id="mjet-arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
          </marker>
          <marker id="mjet-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="mjet-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <linearGradient id="mjet-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="620" height="500" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="310" y="22" textAnchor="middle"
          className="title-text fill-slate-700 dark:fill-slate-200">
          Jet Streams — Rivers of Air at 10 km Altitude
        </text>

        {/* ===== CROSS-SECTION VIEW ===== */}
        <rect x="20" y="35" width="580" height="240" rx="6" fill="url(#mjet-sky)" opacity="0.3" />

        {/* Altitude scale */}
        <text x="30" y="52" className="small-text fill-slate-500 dark:fill-slate-400">
          15 km
        </text>
        <text x="30" y="100" className="small-text fill-slate-500 dark:fill-slate-400">
          10 km
        </text>
        <text x="30" y="160" className="small-text fill-slate-500 dark:fill-slate-400">
          5 km
        </text>
        <text x="30" y="235" className="small-text fill-slate-500 dark:fill-slate-400">
          Surface
        </text>
        <line x1="50" y1="42" x2="50" y2="240" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Ground line */}
        <line x1="55" y1="240" x2="595" y2="240" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1" />

        {/* Tibetan Plateau - elevated landmass */}
        <path d="M 230 240 L 240 170 L 280 155 L 320 148 L 360 152 L 400 158 L 430 170 L 440 240 Z"
          className="fill-amber-300 dark:fill-amber-700" opacity="0.7" stroke="#d97706" strokeWidth="1.5" />
        <text x="335" y="200" textAnchor="middle"
          className="section-title fill-amber-900 dark:fill-amber-200">
          Tibetan Plateau
        </text>
        <text x="335" y="215" textAnchor="middle"
          className="small-text fill-amber-800 dark:fill-amber-300">
          4,500 m avg elevation
        </text>
        <text x="335" y="228" textAnchor="middle"
          className="small-text fill-amber-800 dark:fill-amber-300">
          “Elevated furnace” in summer
        </text>

        {/* Thermal rising from plateau */}
        <path d="M 300 148 Q 295 120, 300 95" fill="none" stroke="#ef4444" strokeWidth="1.5" className="thermal-rise"
          markerEnd="url(#mjet-arrow-red)" />
        <path d="M 340 145 Q 345 115, 340 88" fill="none" stroke="#ef4444" strokeWidth="1.5" className="thermal-rise"
          markerEnd="url(#mjet-arrow-red)" />
        <path d="M 370 150 Q 375 120, 370 92" fill="none" stroke="#ef4444" strokeWidth="1.5" className="thermal-rise"
          markerEnd="url(#mjet-arrow-red)" />
        <text x="395" y="110" className="small-text fill-red-500 dark:fill-red-400">
          Hot air rises from
        </text>
        <text x="395" y="122" className="small-text fill-red-500 dark:fill-red-400">
          heated plateau
        </text>

        {/* Subtropical Jet Stream (winter position - south of Himalayas) */}
        <path d="M 60 100 Q 150 95, 220 100 Q 280 105, 330 98 Q 400 88, 500 92 Q 560 95, 595 90"
          fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="10 5" className="jet-flow" />
        <rect x="80" y="68" width="130" height="28" rx="3"
          className="fill-cyan-900/70 dark:fill-cyan-900/70" />
        <text x="145" y="80" textAnchor="middle"
          className="label-text fill-cyan-200" fontWeight="600">
          Subtropical Jet Stream
        </text>
        <text x="145" y="92" textAnchor="middle"
          className="small-text fill-cyan-300">
          200–300 km/h, 10–12 km up
        </text>

        {/* Himalayan barrier */}
        <path d="M 220 240 L 228 182 L 232 190 L 238 175 L 245 185"
          fill="none" stroke="#64748b" strokeWidth="2" />
        <text x="190" y="180" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          Himalayas
        </text>

        {/* India (south of Himalayas) */}
        <rect x="100" y="240" width="120" height="30" rx="3"
          className="fill-emerald-200 dark:fill-emerald-800" opacity="0.5" />
        <text x="160" y="258" textAnchor="middle"
          className="small-text fill-emerald-700 dark:fill-emerald-300">
          India
        </text>

        {/* ===== BOTTOM SECTION: How jet streams control monsoon ===== */}
        <rect x="20" y="290" width="580" height="195" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

        <text x="310" y="310" textAnchor="middle"
          className="section-title fill-slate-700 dark:fill-slate-200">
          How Jet Streams Control the Monsoon’s On/Off Switch
        </text>

        {/* Winter box */}
        <rect x="35" y="325" width="265" height="80" rx="4"
          className="fill-blue-50 dark:fill-blue-900/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="167" y="342" textAnchor="middle"
          className="label-text fill-blue-700 dark:fill-blue-300" fontWeight="600">
          Winter: Jet SOUTH of Himalayas
        </text>
        <text x="167" y="358" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          Subtropical jet sits over northern India.
        </text>
        <text x="167" y="372" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          It brings dry, cold air from Central Asia.
        </text>
        <text x="167" y="386" textAnchor="middle"
          className="small-text fill-blue-600 dark:fill-blue-400">
          Blocks moist ocean air from moving north.
        </text>
        <text x="167" y="400" textAnchor="middle"
          className="value-text fill-blue-700 dark:fill-blue-300" fontSize="10">
          MONSOON = OFF
        </text>

        {/* Arrow between */}
        <line x1="310" y1="345" x2="310" y2="395" stroke="#6366f1" strokeWidth="2"
          markerEnd="url(#mjet-arrow-cyan)" />
        <text x="310" y="370" textAnchor="middle"
          className="small-text fill-indigo-600 dark:fill-indigo-400" fontWeight="600">
          Jet shifts
        </text>

        {/* Summer box */}
        <rect x="325" y="325" width="265" height="80" rx="4"
          className="fill-red-50 dark:fill-red-900/30 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="457" y="342" textAnchor="middle"
          className="label-text fill-red-700 dark:fill-red-300" fontWeight="600">
          Summer: Jet NORTH of Himalayas
        </text>
        <text x="457" y="358" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          Tibet heats up → disrupts jet.
        </text>
        <text x="457" y="372" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          Jet jumps north of Himalayas.
        </text>
        <text x="457" y="386" textAnchor="middle"
          className="small-text fill-red-600 dark:fill-red-400">
          Removes the “block” → moist air floods in.
        </text>
        <text x="457" y="400" textAnchor="middle"
          className="value-text fill-red-700 dark:fill-red-300" fontSize="10">
          MONSOON = ON
        </text>

        {/* Key insight */}
        <rect x="35" y="415" width="555" height="55" rx="4"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="310" y="432" textAnchor="middle"
          className="label-text fill-amber-800 dark:fill-amber-200" fontWeight="600">
          Tibet’s role: The Tibetan Plateau (4,500 m) acts as an “elevated furnace.”
        </text>
        <text x="310" y="446" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          In summer, its surface absorbs solar energy and heats the air at 5 km altitude directly —
        </text>
        <text x="310" y="458" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          strengthening the upper-level high-pressure system that pulls the jet stream northward and locks the monsoon “on.”
        </text>
        <text x="310" y="470" textAnchor="middle"
          className="small-text fill-amber-700 dark:fill-amber-300">
          Without Tibet, climate models show India’s monsoon would be 40% weaker.
        </text>
      </svg>
    </div>
  );
};

export default MonsoonJetStreamDiagram;
