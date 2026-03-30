export default function HydroWellDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-xl mx-auto" role="img" aria-label="Cross-section showing regular well and artesian well with water table and pressure zones">
        {/* Title */}
        <text x="260" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          How Wells Work — Water Table & Pressure
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="520" height="42" className="fill-sky-100 dark:fill-sky-900/30" />

        {/* Surface with gentle hill */}
        <path d="M 0,70 Q 130,50 260,65 Q 390,78 520,60 L 520,70 Z"
          className="fill-green-300 dark:fill-green-700" />

        {/* Soil */}
        <rect x="0" y="70" width="520" height="25" className="fill-amber-200 dark:fill-amber-800" />

        {/* Unsaturated zone */}
        <rect x="0" y="95" width="520" height="45" className="fill-amber-100 dark:fill-amber-900/50" />
        <text x="260" y="115" textAnchor="middle" className="fill-amber-600 dark:fill-amber-300" fontSize="10">
          Unsaturated zone (air + water)
        </text>

        {/* Water table — follows topography */}
        <path d="M 0,140 Q 130,125 260,138 Q 390,148 520,132" fill="none" className="stroke-blue-500" strokeWidth="2.5" strokeDasharray="8 4" />
        <text x="35" y="135" className="fill-blue-600 dark:fill-blue-300" fontSize="10" fontWeight="bold">Water Table</text>

        {/* Saturated zone (unconfined aquifer) */}
        <rect x="0" y="140" width="520" height="60" className="fill-blue-100 dark:fill-blue-900/40" />
        <text x="260" y="175" textAnchor="middle" className="fill-blue-700 dark:fill-blue-200" fontSize="10" fontWeight="bold">
          Unconfined Aquifer (saturated rock)
        </text>

        {/* Impermeable layer */}
        <rect x="0" y="200" width="520" height="20" className="fill-gray-400 dark:fill-gray-600" />
        <text x="260" y="214" textAnchor="middle" className="fill-gray-200 dark:fill-gray-200" fontSize="10">Impermeable clay layer</text>

        {/* Confined aquifer */}
        <rect x="0" y="220" width="520" height="50" className="fill-blue-200 dark:fill-blue-800/50" />
        {/* Pressure arrows */}
        <text x="80" y="245" className="fill-blue-600 dark:fill-blue-300" fontSize="10">→</text>
        <text x="160" y="250" className="fill-blue-600 dark:fill-blue-300" fontSize="10">→</text>
        <text x="340" y="245" className="fill-blue-600 dark:fill-blue-300" fontSize="10">→</text>
        <text x="420" y="250" className="fill-blue-600 dark:fill-blue-300" fontSize="10">→</text>
        <text x="260" y="250" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200" fontSize="10" fontWeight="bold">
          Confined Aquifer (under pressure)
        </text>

        {/* Bottom impermeable */}
        <rect x="0" y="270" width="520" height="20" className="fill-gray-400 dark:fill-gray-600" />
        <text x="260" y="284" textAnchor="middle" className="fill-gray-200 dark:fill-gray-200" fontSize="10">Impermeable rock</text>

        {/* === REGULAR WELL (left) === */}
        <rect x="125" y="55" width="10" height="105" className="fill-gray-500 dark:fill-gray-400" />
        <rect x="120" y="50" width="20" height="10" rx="2" className="fill-gray-600 dark:fill-gray-300" />
        {/* Pump */}
        <rect x="115" y="42" width="30" height="12" rx="3" className="fill-gray-700 dark:fill-gray-200" />
        <text x="130" y="51" textAnchor="middle" className="fill-white dark:fill-gray-800" fontSize="10">⛽</text>
        {/* Water level in well = water table */}
        <rect x="127" y="132" width="6" height="28" className="fill-blue-400 dark:fill-blue-500" opacity="0.8" />
        {/* Label */}
        <text x="130" y="38" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Regular Well</text>
        {/* Annotation arrow */}
        <line x1="145" y1="132" x2="170" y2="132" className="stroke-blue-500" strokeWidth="1" strokeDasharray="3 2" />
        <text x="172" y="129" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Water rises to</text>
        <text x="172" y="141" className="fill-blue-600 dark:fill-blue-300" fontSize="10">water table level</text>

        {/* === ARTESIAN WELL (right) === */}
        <rect x="380" y="55" width="10" height="215" className="fill-gray-500 dark:fill-gray-400" />
        <rect x="375" y="50" width="20" height="10" rx="2" className="fill-gray-600 dark:fill-gray-300" />
        {/* Water shooting up! */}
        <path d="M 383,50 Q 385,30 387,50" className="fill-blue-400 dark:fill-blue-500" />
        <path d="M 381,50 Q 385,20 389,50" fill="none" className="stroke-blue-400 dark:stroke-blue-400" strokeWidth="1.5" />
        <text x="385" y="18" textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="12">💦</text>
        {/* Water fills well from confined aquifer */}
        <rect x="382" y="50" width="6" height="220" className="fill-blue-400 dark:fill-blue-500" opacity="0.6" />
        {/* Label */}
        <text x="385" y="38" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="10" fontWeight="bold">Artesian Well</text>
        {/* Pressure annotation */}
        <line x1="400" y1="240" x2="430" y2="240" className="stroke-blue-500" strokeWidth="1" strokeDasharray="3 2" />
        <text x="432" y="237" className="fill-blue-600 dark:fill-blue-300" fontSize="10">Pressure in confined</text>
        <text x="432" y="249" className="fill-blue-600 dark:fill-blue-300" fontSize="10">aquifer pushes water</text>
        <text x="432" y="261" className="fill-blue-600 dark:fill-blue-300" fontSize="10">up — no pump needed!</text>

        {/* Explanation box */}
        <rect x="20" y="300" width="480" height="90" rx="6" className="fill-amber-50 dark:fill-amber-900/30" stroke="#d97706" strokeWidth="1" />
        <text x="260" y="318" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="bold">
          Two Types of Wells
        </text>
        <text x="140" y="338" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Regular well</text>
        <text x="140" y="352" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Taps unconfined aquifer.</text>
        <text x="140" y="366" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Water fills to water table level.</text>
        <text x="140" y="380" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Needs a pump to lift water out.</text>

        <line x1="260" y1="328" x2="260" y2="385" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        <text x="380" y="338" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Artesian well</text>
        <text x="380" y="352" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Taps confined aquifer (under pressure).</text>
        <text x="380" y="366" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Water may shoot above ground.</text>
        <text x="380" y="380" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">No pump needed — pressure does the work.</text>
      </svg>
    </div>
  );
}
