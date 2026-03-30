export default function AltitudeProfileDiagram() {
  /* ── Layout constants ── */
  const left = 80; // y-axis label space
  const right = 580;
  const top = 20;
  const bottom = 370;
  const graphH = bottom - top;

  /* Altitude helpers — map altitude (m) to SVG y */
  const maxAlt = 9000;
  const altY = (m: number) => bottom - (m / maxAlt) * graphH;

  /* Mountain silhouette (triangle-ish) */
  const peakX = 280;
  const mountainPoly = [
    `${left},${bottom}`,
    `${left + 40},${altY(500)}`,
    `${left + 100},${altY(2000)}`,
    `${peakX - 40},${altY(7000)}`,
    `${peakX},${altY(8586)}`,
    `${peakX + 30},${altY(7500)}`,
    `${peakX + 90},${altY(4000)}`,
    `${peakX + 140},${altY(1500)}`,
    `${peakX + 180},${altY(300)}`,
    `${right - 60},${bottom}`,
  ].join(" ");

  /* ── Altitude zones (bands) ── */
  const zones = [
    { from: 0, to: 1000, fill: "fill-green-400/40 dark:fill-green-700/30", label: "Tropical forest" },
    { from: 1000, to: 3000, fill: "fill-green-700/30 dark:fill-green-900/30", label: "Temperate forest" },
    { from: 3000, to: 4500, fill: "fill-amber-600/25 dark:fill-amber-800/25", label: "Alpine meadow" },
    { from: 4500, to: 9000, fill: "fill-white/40 dark:fill-gray-300/15", label: "Snow / ice" },
  ];

  /* ── Altitude markers ── */
  const markers = [
    { alt: 0, label: "Sea level (0 m)" },
    { alt: 50, label: "Guwahati 50 m" },
    { alt: 1500, label: "Shillong 1 500 m" },
    { alt: 3500, label: "Tawang 3 500 m" },
    { alt: 8586, label: "Kangchenjunga 8 586 m" },
  ];

  /* ── Temperature curve (lapse rate -6.5 C/km, starting 30 C) ── */
  const tempAtAlt = (m: number) => 30 - 6.5 * (m / 1000);
  const tempPoints: string[] = [];
  for (let m = 0; m <= 8586; m += 300) {
    const t = tempAtAlt(m);
    const x = mapRange(t, -35, 35, right - 100, right - 20);
    tempPoints.push(`${x},${altY(m)}`);
  }

  /* ── Pressure curve (exponential) ── */
  const pressureAtAlt = (m: number) => 1013 * Math.exp(-m / 8500);
  const pressPoints: string[] = [];
  for (let m = 0; m <= 8586; m += 300) {
    const p = pressureAtAlt(m);
    const x = mapRange(p, 300, 1100, right - 100, right - 20);
    pressPoints.push(`${x},${altY(m)}`);
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <svg
        viewBox="0 0 630 420"
        className="w-full"
        role="img"
        aria-label="Altitude profile showing how temperature, pressure, and ecology change from sea level to Kangchenjunga"
      >
        {/* ── Zone bands clipped to mountain ── */}
        <defs>
          <clipPath id="mountainClip">
            <polygon points={mountainPoly} />
          </clipPath>
        </defs>

        {zones.map((z, i) => (
          <rect
            key={i}
            x={left}
            y={altY(z.to)}
            width={right - left}
            height={altY(z.from) - altY(z.to)}
            className={z.fill}
            clipPath="url(#mountainClip)"
          />
        ))}

        {/* Mountain outline */}
        <polygon
          points={mountainPoly}
          fill="none"
          className="stroke-gray-600 dark:stroke-gray-400"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ── Zone labels (inside mountain) ── */}
        <text x={left + 60} y={altY(500)} fontSize="9" className="fill-green-800 dark:fill-green-300" fontWeight="600">
          Tropical forest
        </text>
        <text x={left + 70} y={altY(1800)} fontSize="9" className="fill-green-900 dark:fill-green-200" fontWeight="600">
          Temperate forest
        </text>
        <text x={peakX - 30} y={altY(3700)} fontSize="9" className="fill-amber-800 dark:fill-amber-300" fontWeight="600">
          Alpine meadow
        </text>
        <text x={peakX - 20} y={altY(5500)} fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          Snow / ice
        </text>

        {/* ── Treeline ── */}
        <line
          x1={left}
          y1={altY(3800)}
          x2={right - 90}
          y2={altY(3800)}
          className="stroke-amber-600 dark:stroke-amber-400"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x={right - 85}
          y={altY(3800) + 4}
          fontSize="8"
          className="fill-amber-700 dark:fill-amber-300"
          fontFamily="sans-serif"
        >
          Treeline ~3 800 m
        </text>

        {/* ── Y-axis altitude markers ── */}
        {markers.map((m, i) => (
          <g key={i}>
            <line
              x1={left - 4}
              y1={altY(m.alt)}
              x2={left}
              y2={altY(m.alt)}
              className="stroke-gray-500 dark:stroke-gray-400"
              strokeWidth="1"
            />
            <text
              x={left - 8}
              y={altY(m.alt) + 3}
              textAnchor="end"
              fontSize="8"
              className="fill-gray-600 dark:fill-gray-300"
              fontFamily="sans-serif"
            >
              {m.label}
            </text>
          </g>
        ))}

        {/* ── Temperature curve (red) ── */}
        <polyline
          points={tempPoints.join(" ")}
          fill="none"
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
        />
        {/* Temp labels */}
        <text
          x={mapRange(30, -35, 35, right - 100, right - 20)}
          y={altY(0) - 6}
          textAnchor="middle"
          fontSize="8"
          className="fill-red-600 dark:fill-red-400"
        >
          30 °C
        </text>
        <text
          x={mapRange(tempAtAlt(8586), -35, 35, right - 100, right - 20)}
          y={altY(8586) + 14}
          textAnchor="middle"
          fontSize="8"
          className="fill-red-600 dark:fill-red-400"
        >
          -26 °C
        </text>
        <text
          x={right - 60}
          y={altY(4500)}
          textAnchor="middle"
          fontSize="7"
          className="fill-red-500 dark:fill-red-400"
          fontFamily="sans-serif"
        >
          -6.5 °C / km
        </text>
        {/* Temp legend line */}
        <line x1={right - 95} y1={top + 8} x2={right - 75} y2={top + 8} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x={right - 70} y={top + 12} fontSize="9" className="fill-red-600 dark:fill-red-300">Temp</text>

        {/* ── Pressure curve (blue) ── */}
        <polyline
          points={pressPoints.join(" ")}
          fill="none"
          className="stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2"
        />
        <text
          x={mapRange(1013, 300, 1100, right - 100, right - 20)}
          y={altY(0) + 14}
          textAnchor="middle"
          fontSize="8"
          className="fill-blue-600 dark:fill-blue-400"
        >
          1 013 hPa
        </text>
        <text
          x={mapRange(pressureAtAlt(8586), 300, 1100, right - 100, right - 20) + 14}
          y={altY(8586) + 4}
          fontSize="8"
          className="fill-blue-600 dark:fill-blue-400"
        >
          {Math.round(pressureAtAlt(8586))} hPa
        </text>
        {/* Pressure legend line */}
        <line x1={right - 95} y1={top + 22} x2={right - 75} y2={top + 22} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <text x={right - 70} y={top + 26} fontSize="9" className="fill-blue-600 dark:fill-blue-300">Pressure</text>

        {/* ── Snow leopard silhouette at ~5000 m ── */}
        <g transform={`translate(${peakX + 50}, ${altY(5000)})`}>
          {/* Simplified snow leopard: body, head, tail */}
          <ellipse cx="0" cy="0" rx="12" ry="6" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="13" cy="-4" r="5" className="fill-gray-500 dark:fill-gray-400" />
          <path d="M-12,0 Q-24,8 -28,-2" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* tiny ears */}
          <circle cx="11" cy="-9" r="2" className="fill-gray-500 dark:fill-gray-400" />
          <circle cx="16" cy="-8" r="2" className="fill-gray-500 dark:fill-gray-400" />
          {/* label */}
          <text x="24" y="4" fontSize="7" className="fill-gray-600 dark:fill-gray-300" fontStyle="italic">
            Snow leopard
          </text>
        </g>

        {/* ── Tea plant at ~1500 m ── */}
        <g transform={`translate(${left + 120}, ${altY(1500)})`}>
          {/* Simple tea bush: oval canopy + stem */}
          <line x1="0" y1="0" x2="0" y2="10" className="stroke-green-800 dark:stroke-green-400" strokeWidth="2" />
          <ellipse cx="0" cy="-4" rx="10" ry="8" className="fill-green-600/60 dark:fill-green-500/40 stroke-green-700 dark:stroke-green-400" strokeWidth="1" />
          <text x="14" y="4" fontSize="7" className="fill-green-800 dark:fill-green-300" fontStyle="italic">
            Tea plant
          </text>
        </g>

        {/* ── Boiling point note ── */}
        <text
          x={left + 10}
          y={bottom + 16}
          fontSize="8"
          className="fill-gray-500 dark:fill-gray-400"
          fontFamily="sans-serif"
        >
          Boiling point of water: 100 °C at sea level → ~70 °C at summit
        </text>
      </svg>
    </div>
  );
}

/** Map a value from [inMin, inMax] to [outMin, outMax] */
function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
