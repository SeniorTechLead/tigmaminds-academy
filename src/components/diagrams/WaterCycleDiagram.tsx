export default function WaterCycleDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 620 378" className="w-full max-w-2xl mx-auto" role="img" aria-label="Water cycle diagram showing evaporation, condensation, precipitation, runoff, and infiltration">
        <defs>
          <marker id="wc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-blue-500 dark:fill-blue-400" />
          </marker>
          <marker id="wc-arrow-gray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-gray-500 dark:fill-gray-400" />
          </marker>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" className="dark:stop-color-blue-900" />
            <stop offset="100%" stopColor="#e0f2fe" className="dark:stop-color-blue-950" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width="540" height="220" className="fill-sky-100 dark:fill-sky-950" rx="4" />

        {/* Ocean */}
        <rect x="0" y="220" width="220" height="130" className="fill-blue-400 dark:fill-blue-700" />
        <path d="M 0,235 Q 30,225 60,235 Q 90,245 120,235 Q 150,225 180,235 Q 210,245 220,235" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1" />
        <path d="M 0,255 Q 30,245 60,255 Q 90,265 120,255 Q 150,245 180,255 Q 210,265 220,255" fill="none" className="stroke-blue-300 dark:stroke-blue-500" strokeWidth="1" />
        <text x="110" y="290" textAnchor="middle" className="fill-blue-100 dark:fill-blue-200" fontSize="12" fontWeight="bold">Ocean</text>

        {/* Land / ground */}
        <rect x="220" y="240" width="320" height="110" className="fill-green-700 dark:fill-green-800" rx="0" />
        {/* Ground surface line */}
        <path d="M 220,240 L 540,240" className="stroke-green-600 dark:stroke-green-700" strokeWidth="1" />

        {/* Mountain (causes orographic rain) */}
        <polygon points="350,240 420,130 490,240" className="fill-stone-500 dark:fill-stone-600" />
        <polygon points="420,130 400,160 440,160" className="fill-white dark:fill-gray-300" />
        <text x="420" y="210" textAnchor="middle" className="fill-stone-300 dark:fill-stone-200" fontSize="10" fontWeight="600">Mountain</text>

        {/* River flowing to ocean */}
        <path d="M 450,240 Q 420,260 380,270 Q 340,280 300,275 Q 260,270 220,265" fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="3" />
        <text x="320" y="265" textAnchor="middle" className="fill-blue-200 dark:fill-blue-300" fontSize="10">River</text>

        {/* Sun (top left) */}
        <circle cx="60" cy="40" r="28" className="fill-yellow-400" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`sun-${angle}`}
              x1={60 + Math.cos(rad) * 32} y1={40 + Math.sin(rad) * 32}
              x2={60 + Math.cos(rad) * 42} y2={40 + Math.sin(rad) * 42}
              className="stroke-yellow-400" strokeWidth="2" strokeLinecap="round" />
          );
        })}
        <text x="60" y="44" textAnchor="middle" className="fill-yellow-800" fontSize="10" fontWeight="bold">Sun</text>

        {/* Sunrays heating ocean */}
        <line x1="80" y1="60" x2="120" y2="210" className="stroke-yellow-400" strokeWidth="1" strokeDasharray="5,4" opacity="0.6" />
        <line x1="88" y1="55" x2="160" y2="210" className="stroke-yellow-400" strokeWidth="1" strokeDasharray="5,4" opacity="0.6" />

        {/* --- Water cycle arrows and labels --- */}

        {/* 1. Evaporation (ocean → up) */}
        <path d="M 130,220 Q 120,160 160,100" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#wc-arrow)">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
        </path>
        <text x="105" y="165" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="bold">Evaporation</text>

        {/* Wavy vapor lines */}
        <path d="M 140,190 Q 145,183 150,190" fill="none" className="stroke-blue-300 dark:stroke-blue-400" strokeWidth="1" opacity="0.7" />
        <path d="M 160,185 Q 165,178 170,185" fill="none" className="stroke-blue-300 dark:stroke-blue-400" strokeWidth="1" opacity="0.7" />

        {/* 2. Condensation — clouds */}
        <g>
          <ellipse cx="260" cy="55" rx="40" ry="18" className="fill-gray-200 dark:fill-gray-500" />
          <ellipse cx="240" cy="50" rx="25" ry="15" className="fill-gray-300 dark:fill-gray-600" />
          <ellipse cx="280" cy="48" rx="28" ry="16" className="fill-gray-200 dark:fill-gray-500" />
          <text x="260" y="40" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Condensation</text>
        </g>

        {/* Cloud near mountain (orographic) */}
        <g>
          <ellipse cx="380" cy="105" rx="30" ry="14" className="fill-gray-300 dark:fill-gray-500" />
          <ellipse cx="365" cy="100" rx="20" ry="12" className="fill-gray-200 dark:fill-gray-400" />
          <ellipse cx="395" cy="100" rx="22" ry="12" className="fill-gray-300 dark:fill-gray-500" />
        </g>

        {/* Arrow from evaporation to clouds */}
        <path d="M 170,95 Q 200,70 230,60" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#wc-arrow)" />

        {/* 3. Precipitation (rain from clouds) */}
        {[250, 260, 270, 370, 380, 390].map(x => (
          <g key={`rain-${x}`}>
            <line x1={x} y1={x < 300 ? 72 : 118} x2={x - 3} y2={x < 300 ? 90 : 136}
              className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="y1" values={x < 300 ? "72;82;72" : "118;128;118"} dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values={x < 300 ? "90;100;90" : "136;146;136"} dur="0.8s" repeatCount="indefinite" />
            </line>
          </g>
        ))}
        <text x="295" y="95" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="bold">Precipitation</text>

        {/* Orographic rain label */}
        <text x="415" y="95" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Orographic</text>
        <text x="415" y="106" className="fill-blue-600 dark:fill-blue-300" fontSize="10">rain</text>

        {/* 4. Runoff arrow (surface water flowing to river) */}
        <path d="M 480,240 Q 470,250 450,245" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#wc-arrow)" />
        <text x="490" y="238" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="bold">Runoff</text>

        {/* 5. Infiltration (water going underground) */}
        <path d="M 300,240 L 300,280" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#wc-arrow)" />
        <text x="280" y="300" className="fill-blue-300 dark:fill-blue-400" fontSize="10" fontWeight="bold">Infiltration</text>

        {/* Underground water layer */}
        <rect x="220" y="310" width="320" height="25" className="fill-blue-300 dark:fill-blue-600" opacity="0.3" />
        <text x="380" y="328" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="10">Groundwater</text>

        {/* Groundwater arrow flowing toward ocean */}
        <path d="M 260,320 Q 240,330 220,310" fill="none" className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#wc-arrow)" />

        {/* River arrow to ocean */}
        <path d="M 230,260 L 220,260" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" markerEnd="url(#wc-arrow)" />

        {/* Trees on land */}
        {[260, 510].map(x => (
          <g key={`tree-${x}`}>
            <line x1={x} y1={240} x2={x} y2={225} className="stroke-amber-700 dark:stroke-amber-600" strokeWidth="2" />
            <circle cx={x} cy={220} r="8" className="fill-green-500 dark:fill-green-600" />
          </g>
        ))}

        {/* Transpiration from trees */}
        <path d="M 260,212 Q 255,195 265,180" fill="none" className="stroke-green-400 dark:stroke-green-500" strokeWidth="1" strokeDasharray="3,3" />
        <text x="240" y="182" className="fill-green-600 dark:fill-green-400" fontSize="9">Transpiration</text>
      </svg>
    </div>
  );
}
