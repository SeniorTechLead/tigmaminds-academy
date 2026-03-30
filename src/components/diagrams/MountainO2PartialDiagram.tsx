export default function MountainO2PartialDiagram() {
  const left = 100;
  const right = 560;
  const top = 50;
  const bottom = 310;
  const graphW = right - left;
  const graphH = bottom - top;
  const maxAlt = 9000;

  const altX = (m: number) => left + (m / maxAlt) * graphW;

  /* Oxygen partial pressure: P_O2 = 0.209 * P_total */
  const L = 0.0065;
  const T0 = 288.15;
  const gMRL = 5.2561;
  const pTotal = (alt: number) => 1013 * Math.pow(1 - (L * alt) / T0, gMRL);
  const pO2 = (alt: number) => 0.209 * pTotal(alt);

  const maxPO2 = 220;
  const minPO2 = 50;
  const pY = (p: number) => top + ((maxPO2 - p) / (maxPO2 - minPO2)) * graphH;

  /* Hemoglobin saturation curve (simplified) */
  const spo2 = (alt: number) => {
    const po2 = pO2(alt);
    if (po2 >= 100) return 97;
    if (po2 >= 80) return 90 + (po2 - 80) * 0.35;
    if (po2 >= 60) return 75 + (po2 - 60) * 0.75;
    return 40 + (po2 - 40) * 1.75;
  };
  const satY = (s: number) => top + ((100 - s) / 70) * graphH;

  /* O2 curve points */
  const o2Pts: string[] = [];
  for (let m = 0; m <= maxAlt; m += 100) {
    o2Pts.push(`${altX(m)},${pY(pO2(m))}`);
  }

  /* Saturation curve points */
  const satPts: string[] = [];
  for (let m = 0; m <= 8000; m += 100) {
    satPts.push(`${altX(m)},${satY(spo2(m))}`);
  }

  /* Danger zone: below 100 hPa O2 partial pressure ~ above ~3500m */
  const dangerAlt = 3500;

  /* Key markers */
  const markers = [
    { alt: 0, label: "Sea level", po2: 212 },
    { alt: 2500, label: "2 500 m", po2: Math.round(pO2(2500)) },
    { alt: 5364, label: "Everest BC", po2: Math.round(pO2(5364)) },
    { alt: 8849, label: "Summit", po2: Math.round(pO2(8849)) },
  ];

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 715 433"
        className="w-full"
        role="img"
        aria-label="Graph showing oxygen partial pressure dropping from 212 hPa at sea level to about 70 hPa at Everest summit, with a danger zone below 100 hPa and hemoglobin saturation curve overlay"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="22" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Oxygen Partial Pressure & Hemoglobin Saturation
        </text>

        {/* Dalton's law label */}
        <rect x="170" y="30" width="260" height="16" rx="3" className="fill-slate-800" />
        <text x="300" y="42" textAnchor="middle" fontSize="9" className="fill-sky-300" fontWeight="600" fontFamily="serif">
          {"Dalton’s Law: P₂ = 0.209 × P"}
          <tspan fontSize="9" dy="2">total</tspan>
        </text>

        {/* Danger zone fill */}
        <rect
          x={altX(dangerAlt)}
          y={top}
          width={right - altX(dangerAlt)}
          height={graphH}
          className="fill-red-900/20"
        />
        <text x={altX(6500)} y={top + 16} textAnchor="middle" fontSize="9" className="fill-red-400" fontWeight="700">
          DANGER ZONE
        </text>
        <text x={altX(6500)} y={top + 28} textAnchor="middle" fontSize="9" className="fill-red-300">
          {"P₂ < 100 hPa"}
        </text>

        {/* Danger zone line */}
        <line x1={altX(dangerAlt)} y1={top} x2={altX(dangerAlt)} y2={bottom} className="stroke-red-500" strokeWidth="1" strokeDasharray="4 2" />

        {/* Axes */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} className="stroke-gray-500" strokeWidth="1" />

        {/* Y-axis label (left) */}
        <text
          x={16}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="9"
          className="fill-sky-300"
          fontWeight="600"
          transform={`rotate(-90,16,${(top + bottom) / 2})`}
        >
          {"P₂ (hPa)"}
        </text>

        {/* Y-axis label (right) for SpO2 */}
        <text
          x={585}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="9"
          className="fill-emerald-300"
          fontWeight="600"
          transform={`rotate(90,585,${(top + bottom) / 2})`}
        >
          SpO2 (%)
        </text>

        {/* X-axis label */}
        <text x={(left + right) / 2} y={bottom + 28} textAnchor="middle" fontSize="10" className="fill-gray-300" fontWeight="600">
          Altitude (m)
        </text>

        {/* Y-axis ticks (O2 pressure) */}
        {[75, 100, 125, 150, 175, 200].map((p) => (
          <g key={p}>
            <line x1={left - 4} y1={pY(p)} x2={left} y2={pY(p)} className="stroke-gray-500" strokeWidth="1" />
            <text x={left - 8} y={pY(p) + 3} textAnchor="end" fontSize="9" className="fill-gray-400">
              {p}
            </text>
            <line x1={left} y1={pY(p)} x2={right} y2={pY(p)} className="stroke-gray-700" strokeWidth="0.5" strokeDasharray="3 3" />
          </g>
        ))}

        {/* Right Y-axis ticks (SpO2) */}
        <line x1={right} y1={top} x2={right} y2={bottom} className="stroke-gray-600" strokeWidth="0.5" />
        {[40, 50, 60, 70, 80, 90, 97].map((s) => (
          <g key={s}>
            <line x1={right} y1={satY(s)} x2={right + 4} y2={satY(s)} className="stroke-gray-500" strokeWidth="1" />
            <text x={right + 8} y={satY(s) + 3} fontSize="9" className="fill-emerald-400">
              {s}%
            </text>
          </g>
        ))}

        {/* X-axis ticks */}
        {[0, 2000, 4000, 6000, 8000].map((m) => (
          <g key={m}>
            <line x1={altX(m)} y1={bottom} x2={altX(m)} y2={bottom + 5} className="stroke-gray-500" strokeWidth="1" />
            <text x={altX(m)} y={bottom + 16} textAnchor="middle" fontSize="8" className="fill-gray-400">
              {m.toLocaleString()}
            </text>
          </g>
        ))}

        {/* O2 curve fill */}
        <defs>
          <linearGradient id="o2Grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <polygon
          points={`${o2Pts.join(" ")} ${altX(maxAlt)},${bottom} ${left},${bottom}`}
          fill="url(#o2Grad)"
        />

        {/* O2 partial pressure curve */}
        <polyline points={o2Pts.join(" ")} fill="none" className="stroke-sky-400" strokeWidth="2.5" />

        {/* Hemoglobin saturation curve */}
        <polyline points={satPts.join(" ")} fill="none" className="stroke-emerald-400" strokeWidth="2" strokeDasharray="6 3" />

        {/* 100 hPa threshold line */}
        <line x1={left} y1={pY(100)} x2={right} y2={pY(100)} className="stroke-red-400" strokeWidth="1" strokeDasharray="4 2" />
        <text x={left + 4} y={pY(100) - 4} fontSize="9" className="fill-red-400" fontWeight="600">
          100 hPa threshold
        </text>

        {/* Key markers */}
        {markers.map((mk, i) => (
          <g key={i}>
            <circle cx={altX(mk.alt)} cy={pY(mk.po2)} r="3.5" className="fill-amber-400" />
            <text
              x={altX(mk.alt)}
              y={pY(mk.po2) + (i % 2 === 0 ? -10 : 14)}
              textAnchor="middle"
              fontSize="9"
              className="fill-amber-300"
              fontWeight="600"
            >
              {mk.label}
            </text>
            <text
              x={altX(mk.alt)}
              y={pY(mk.po2) + (i % 2 === 0 ? -2 : 23)}
              textAnchor="middle"
              fontSize="9"
              className="fill-gray-300"
            >
              {mk.po2} hPa
            </text>
          </g>
        ))}

        {/* Legend */}
        <line x1={80} y1={340} x2={100} y2={340} className="stroke-sky-400" strokeWidth="2" />
        <text x={105} y={343} fontSize="8" className="fill-sky-300">O2 partial pressure</text>
        <line x1={250} y1={340} x2={270} y2={340} className="stroke-emerald-400" strokeWidth="2" strokeDasharray="6 3" />
        <text x={275} y={343} fontSize="8" className="fill-emerald-300">Hemoglobin saturation (SpO2)</text>

        {/* Insight */}
        <rect x="60" y="355" width="480" height="36" rx="4" className="fill-slate-800" />
        <text x="80" y="370" fontSize="9" className="fill-gray-300" fontWeight="600">
          At Everest summit, each breath delivers only ~33% of sea-level oxygen.
        </text>
        <text x="80" y="383" fontSize="9" className="fill-gray-300" fontWeight="600">
          Blood oxygen saturation can drop below 50% without supplemental O2.
        </text>
      </svg>
    </div>
  );
}
