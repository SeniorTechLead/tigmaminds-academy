export default function MountainWindChillDiagram() {
  /* Wind chill table data: [wind km/h, actual temp, feels like] */
  const tableData = [
    { wind: 10, temps: [{ actual: 0, feels: -3 }, { actual: -10, feels: -15 }, { actual: -20, feels: -27 }] },
    { wind: 20, temps: [{ actual: 0, feels: -5 }, { actual: -10, feels: -18 }, { actual: -20, feels: -30 }] },
    { wind: 30, temps: [{ actual: 0, feels: -7 }, { actual: -10, feels: -20 }, { actual: -20, feels: -33 }] },
    { wind: 50, temps: [{ actual: 0, feels: -10 }, { actual: -10, feels: -23 }, { actual: -20, feels: -37 }] },
  ];

  const actTemps = [0, -10, -20];

  /* Color for feels-like temp */
  const feelsColor = (f: number) => {
    if (f >= -5) return "#93c5fd";
    if (f >= -15) return "#60a5fa";
    if (f >= -25) return "#818cf8";
    if (f >= -33) return "#c084fc";
    return "#f87171";
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 431"
        className="w-full"
        role="img"
        aria-label="Wind chill diagram showing how wind speed makes temperatures feel colder, with a comparison to snow leopard fur insulation"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Wind Chill: When Cold Feels Colder
        </text>

        {/* Person illustration */}
        <g transform="translate(75, 60)">
          {/* Wind lines */}
          {[0, 14, 28, 42].map((dy, i) => (
            <line key={i} x1={-45} y1={20 + dy} x2={-10} y2={20 + dy} className="stroke-sky-400" strokeWidth="1.5" markerEnd="url(#windArr)" opacity={0.5 + i * 0.12} />
          ))}
          <defs>
            <marker id="windArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 2 L 8 5 L 0 8 Z" className="fill-sky-400" />
            </marker>
          </defs>

          {/* Stick figure */}
          <circle cx="15" cy="10" r="10" fill="none" className="stroke-gray-300" strokeWidth="1.5" />
          <line x1="15" y1="20" x2="15" y2="55" className="stroke-gray-300" strokeWidth="1.5" />
          <line x1="15" y1="30" x2="-2" y2="42" className="stroke-gray-300" strokeWidth="1.5" />
          <line x1="15" y1="30" x2="32" y2="42" className="stroke-gray-300" strokeWidth="1.5" />
          <line x1="15" y1="55" x2="2" y2="72" className="stroke-gray-300" strokeWidth="1.5" />
          <line x1="15" y1="55" x2="28" y2="72" className="stroke-gray-300" strokeWidth="1.5" />

          {/* Labels */}
          <text x="15" y="90" textAnchor="middle" fontSize="9" className="fill-gray-300" fontWeight="600">
            Actual: -10 °C
          </text>
          <text x="15" y="103" textAnchor="middle" fontSize="9" className="fill-sky-300" fontWeight="700">
            Wind: 30 km/h
          </text>
          <text x="15" y="118" textAnchor="middle" fontSize="10" className="fill-red-400" fontWeight="700">
            Feels like: -20 °C
          </text>
        </g>

        {/* Wind chill table */}
        <g transform="translate(195, 55)">
          <text x="175" y="0" textAnchor="middle" fontSize="10" className="fill-gray-300" fontWeight="700">
            Wind Chill Table (°C)
          </text>

          {/* Column headers */}
          <rect x="0" y="10" width="70" height="20" rx="2" className="fill-slate-700" />
          <text x="35" y="24" textAnchor="middle" fontSize="8" className="fill-gray-300" fontWeight="600">
            Wind (km/h)
          </text>
          {actTemps.map((t, i) => (
            <g key={i}>
              <rect x={80 + i * 90} y="10" width="80" height="20" rx="2" className="fill-slate-700" />
              <text x={120 + i * 90} y="24" textAnchor="middle" fontSize="8" className="fill-gray-300" fontWeight="600">
                Actual {t} °C
              </text>
            </g>
          ))}

          {/* Data rows */}
          {tableData.map((row, ri) => (
            <g key={ri}>
              <rect x="0" y={36 + ri * 26} width="70" height="22" rx="2" className="fill-slate-800" />
              <text x="35" y={51 + ri * 26} textAnchor="middle" fontSize="9" className="fill-sky-300" fontWeight="600">
                {row.wind} km/h
              </text>
              {row.temps.map((cell, ci) => (
                <g key={ci}>
                  <rect x={80 + ci * 90} y={36 + ri * 26} width="80" height="22" rx="2" fill={feelsColor(cell.feels)} fillOpacity="0.15" />
                  <text
                    x={120 + ci * 90}
                    y={51 + ri * 26}
                    textAnchor="middle"
                    fontSize="10"
                    fill={feelsColor(cell.feels)}
                    fontWeight="700"
                  >
                    {cell.feels} °C
                  </text>
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* Snow leopard comparison */}
        <rect x="40" y="220" width="520" height="90" rx="6" className="fill-slate-800" stroke="#64748b" strokeWidth="0.5" />
        <text x="300" y="240" textAnchor="middle" fontSize="10" className="fill-amber-300" fontWeight="700">
          Snow Leopard Fur: Nature&apos;s Wind Shield
        </text>

        {/* Fur cross-section */}
        <g transform="translate(70, 250)">
          {/* Skin layer */}
          <rect x="0" y="20" width="200" height="8" rx="2" className="fill-amber-800/60" />
          <text x="100" y="44" textAnchor="middle" fontSize="7" className="fill-amber-200">Skin (37 °C)</text>

          {/* Underfur */}
          <rect x="0" y="8" width="200" height="12" rx="2" className="fill-gray-500/40" />
          <text x="100" y="16" textAnchor="middle" fontSize="6" className="fill-gray-300">Dense underfur (5 cm thick)</text>

          {/* Guard hairs */}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={i}
              x1={4 + i * 8}
              y1={8}
              x2={4 + i * 8 + (i % 2 === 0 ? 2 : -2)}
              y2={-6}
              className="stroke-gray-400"
              strokeWidth="1"
            />
          ))}
          <text x="100" y="-10" textAnchor="middle" fontSize="6" className="fill-gray-300">Guard hairs</text>
        </g>

        {/* Comparison values */}
        <g transform="translate(320, 250)">
          <text x="0" y="8" fontSize="8" className="fill-gray-300" fontWeight="600">Human at -10 °C, 30 km/h wind:</text>
          <text x="0" y="22" fontSize="9" className="fill-red-400" fontWeight="700">Feels like -20 °C (exposed skin)</text>
          <text x="0" y="38" fontSize="8" className="fill-gray-300" fontWeight="600">Snow leopard at same conditions:</text>
          <text x="0" y="52" fontSize="9" className="fill-green-400" fontWeight="700">Body stays at 37 °C (fur traps air)</text>
        </g>

        {/* Explanation */}
        <rect x="40" y="322" width="520" height="22" rx="4" className="fill-slate-800" />
        <text x="60" y="337" fontSize="9" className="fill-gray-200" fontWeight="600">
          Wind chill = 13.12 + 0.6215T - 11.37V^0.16 + 0.3965TV^0.16 (T in °C, V in km/h)
        </text>

        {/* Insight */}
        <rect x="40" y="352" width="520" height="36" rx="4" className="fill-slate-800" />
        <text x="60" y="367" fontSize="9" className="fill-gray-300" fontWeight="600">
          Wind strips heat from exposed surfaces. Snow leopard fur creates 5 cm of still air
        </text>
        <text x="60" y="381" fontSize="9" className="fill-gray-300" fontWeight="600">
          insulation -- wind cannot penetrate the dense underfur layer.
        </text>
      </svg>
    </div>
  );
}
