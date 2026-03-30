export default function BanyanMonitoringDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 585 453" className="w-full max-w-lg mx-auto" role="img" aria-label="Tree monitoring system showing sensors like dendrometers and sap flow meters, data logging, and satellite comparison">
        <rect width="500" height="420" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Tree Monitoring System</text>
        <text x="250" y="44" textAnchor="middle" className="fill-slate-400" fontSize="10">From manual measurement to automated monitoring</text>

        {/* === LEFT: The Tree with Sensors === */}

        {/* Tree */}
        <rect x="80" y="160" width="30" height="130" rx="5" className="fill-amber-700" />
        <ellipse cx="95" cy="140" rx="65" ry="50" className="fill-green-600" opacity="0.6" />

        {/* Ground */}
        <line x1="20" y1="290" x2="210" y2="290" className="stroke-amber-800" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Roots */}
        <path d="M 80,290 Q 50,305 20,315" className="stroke-amber-700" strokeWidth="2" fill="none" />
        <path d="M 110,290 Q 140,305 180,315" className="stroke-amber-700" strokeWidth="2" fill="none" />

        {/* === SENSOR 1: Dendrometer (on trunk) === */}
        <rect x="110" y="200" width="20" height="12" rx="2" className="fill-blue-500" />
        <line x1="130" y1="206" x2="170" y2="190" className="stroke-blue-400" strokeWidth="1" />
        <rect x="170" y="178" width="85" height="28" rx="4" className="fill-blue-900" opacity="0.7" />
        <text x="212" y="192" textAnchor="middle" className="fill-blue-300" fontSize="8" fontWeight="bold">Dendrometer</text>
        <text x="212" y="203" textAnchor="middle" className="fill-slate-400" fontSize="7">Measures growth ± 0.01mm</text>

        {/* === SENSOR 2: Sap flow meter (on trunk) === */}
        <rect x="72" y="230" width="8" height="15" rx="1" className="fill-green-400" />
        <line x1="72" y1="237" x2="30" y2="237" className="stroke-green-400" strokeWidth="1" />
        <rect x="5" y="225" width="68" height="28" rx="4" className="fill-green-900" opacity="0.7" />
        <text x="39" y="239" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Sap flow</text>
        <text x="39" y="250" textAnchor="middle" className="fill-slate-400" fontSize="7">Litres / hour</text>

        {/* === SENSOR 3: Weather station (above canopy) === */}
        <line x1="95" y1="90" x2="95" y2="70" className="stroke-slate-400" strokeWidth="1.5" />
        <rect x="85" y="60" width="20" height="12" rx="2" className="fill-amber-500" />
        {/* Wind vane */}
        <line x1="95" y1="60" x2="105" y2="55" className="stroke-slate-300" strokeWidth="1" />
        <line x1="95" y1="68" x2="95" y2="58" className="stroke-slate-300" strokeWidth="1" />
        <text x="130" y="63" className="fill-amber-300" fontSize="8" fontWeight="bold">Weather station</text>
        <text x="130" y="73" className="fill-slate-400" fontSize="7">Temp, humidity, wind, rain</text>

        {/* === SENSOR 4: Soil moisture (at roots) === */}
        <circle cx="50" cy="310" r="5" className="fill-blue-400" />
        <line x1="50" y1="315" x2="50" y2="330" className="stroke-blue-400" strokeWidth="1" />
        <text x="50" y="345" textAnchor="middle" className="fill-blue-300" fontSize="8" fontWeight="bold">Soil moisture</text>
        <text x="50" y="356" textAnchor="middle" className="fill-slate-400" fontSize="7">probe at 3 depths</text>

        {/* === CENTER: Data Logger === */}
        <rect x="185" y="100" width="80" height="50" rx="6" className="fill-slate-700" />
        <rect x="190" y="105" width="70" height="30" rx="3" className="fill-slate-800" />
        {/* Screen lines */}
        {[112, 118, 124].map((y, i) => (
          <line key={i} x1="195" y1={y} x2={230 - i * 5} y2={y} className="stroke-green-400" strokeWidth="1" opacity="0.6" />
        ))}
        <text x="225" y="145" textAnchor="middle" className="fill-slate-300" fontSize="8" fontWeight="bold">Data Logger</text>
        <text x="225" y="157" textAnchor="middle" className="fill-slate-500" fontSize="7">records every 15 min</text>

        {/* Wires from sensors to logger */}
        <path d="M 130,200 Q 160,160 190,130" className="stroke-slate-600" strokeWidth="1" fill="none" strokeDasharray="3,2" />
        <path d="M 80,230 Q 130,180 190,125" className="stroke-slate-600" strokeWidth="1" fill="none" strokeDasharray="3,2" />
        <path d="M 105,70 Q 150,90 190,110" className="stroke-slate-600" strokeWidth="1" fill="none" strokeDasharray="3,2" />

        {/* === RIGHT: Data Pipeline === */}

        {/* WiFi/cellular transmission */}
        <line x1="265" y1="125" x2="310" y2="115" className="stroke-amber-400" strokeWidth="1.5" markerEnd="url(#monArrow)" />
        {/* Signal waves */}
        <path d="M 280,110 Q 285,105 290,110" className="stroke-amber-400" strokeWidth="1" fill="none" />
        <path d="M 275,105 Q 282,97 290,105" className="stroke-amber-400" strokeWidth="1" fill="none" />

        {/* Cloud/server */}
        <rect x="310" y="95" width="80" height="40" rx="8" className="fill-slate-700" />
        <text x="350" y="115" textAnchor="middle" className="fill-slate-300" fontSize="8" fontWeight="bold">Cloud</text>
        <text x="350" y="128" textAnchor="middle" className="fill-slate-500" fontSize="7">Storage + API</text>

        {/* Arrow to dashboard */}
        <line x1="350" y1="135" x2="350" y2="160" className="stroke-green-400" strokeWidth="1.5" markerEnd="url(#monArrowGreen)" />

        {/* Dashboard */}
        <rect x="300" y="165" width="100" height="65" rx="6" className="fill-slate-700" />
        <rect x="305" y="170" width="90" height="40" rx="3" className="fill-slate-800" />
        {/* Mini chart */}
        <polyline points="310,200 320,195 330,198 340,185 350,190 360,180 370,188 380,175 390,183" className="stroke-green-400" strokeWidth="1" fill="none" />
        <text x="350" y="225" textAnchor="middle" className="fill-green-300" fontSize="8" fontWeight="bold">Dashboard</text>

        {/* Arrow to satellite comparison */}
        <line x1="400" y1="197" x2="420" y2="197" className="stroke-amber-400" strokeWidth="1.5" markerEnd="url(#monArrow)" />

        {/* Satellite */}
        <rect x="420" y="170" width="70" height="55" rx="6" className="fill-slate-700" />
        {/* Satellite icon */}
        <rect x="445" y="180" width="15" height="8" rx="1" className="fill-amber-500" />
        <line x1="440" y1="184" x2="445" y2="184" className="stroke-amber-400" strokeWidth="1.5" />
        <line x1="460" y1="184" x2="465" y2="184" className="stroke-amber-400" strokeWidth="1.5" />
        <text x="455" y="203" textAnchor="middle" className="fill-amber-300" fontSize="7" fontWeight="bold">Satellite</text>
        <text x="455" y="213" textAnchor="middle" className="fill-slate-400" fontSize="7">NDVI, canopy</text>
        <text x="455" y="222" textAnchor="middle" className="fill-slate-400" fontSize="7">from above</text>

        {/* === BOTTOM: Evolution timeline === */}
        <rect x="30" y="365" width="440" height="45" rx="8" className="fill-slate-800" />

        {/* Manual */}
        <circle cx="80" cy="385" r="4" className="fill-amber-600" />
        <text x="80" y="398" textAnchor="middle" className="fill-amber-400" fontSize="7" fontWeight="bold">Manual</text>
        <text x="80" y="407" textAnchor="middle" className="fill-slate-500" fontSize="6">tape + notebook</text>

        <line x1="105" y1="385" x2="155" y2="385" className="stroke-slate-600" strokeWidth="1" markerEnd="url(#monArrowSlate)" />

        {/* Data logger */}
        <circle cx="180" cy="385" r="4" className="fill-green-500" />
        <text x="180" y="398" textAnchor="middle" className="fill-green-400" fontSize="7" fontWeight="bold">Sensors</text>
        <text x="180" y="407" textAnchor="middle" className="fill-slate-500" fontSize="6">continuous data</text>

        <line x1="205" y1="385" x2="255" y2="385" className="stroke-slate-600" strokeWidth="1" markerEnd="url(#monArrowSlate)" />

        {/* IoT */}
        <circle cx="280" cy="385" r="4" className="fill-blue-400" />
        <text x="280" y="398" textAnchor="middle" className="fill-blue-300" fontSize="7" fontWeight="bold">IoT Network</text>
        <text x="280" y="407" textAnchor="middle" className="fill-slate-500" fontSize="6">wireless real-time</text>

        <line x1="305" y1="385" x2="355" y2="385" className="stroke-slate-600" strokeWidth="1" markerEnd="url(#monArrowSlate)" />

        {/* AI */}
        <circle cx="380" cy="385" r="4" className="fill-amber-400" />
        <text x="380" y="398" textAnchor="middle" className="fill-amber-300" fontSize="7" fontWeight="bold">AI + Satellite</text>
        <text x="380" y="407" textAnchor="middle" className="fill-slate-500" fontSize="6">global forest watch</text>

        {/* Bottom label */}
        <text x="250" y="350" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">From manual measurement to automated monitoring</text>

        <defs>
          <marker id="monArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-amber-400" />
          </marker>
          <marker id="monArrowGreen" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-green-400" />
          </marker>
          <marker id="monArrowSlate" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-slate-600" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
