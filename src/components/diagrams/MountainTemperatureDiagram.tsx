export default function MountainTemperatureDiagram() {
  const left = 90;
  const right = 560;
  const top = 25;
  const bottom = 370;
  const graphH = bottom - top;
  const maxAlt = 5500;

  const altY = (m: number) => bottom - (m / maxAlt) * graphH;
  const tempAtAlt = (m: number) => 30 - 6.5 * (m / 1000);

  /* Mountain silhouette */
  const peakX = 320;
  const mtnPoly = [
    `${left},${bottom}`,
    `${left + 30},${altY(300)}`,
    `${left + 80},${altY(1200)}`,
    `${peakX - 60},${altY(3800)}`,
    `${peakX},${altY(5000)}`,
    `${peakX + 50},${altY(4000)}`,
    `${peakX + 120},${altY(1800)}`,
    `${peakX + 180},${altY(400)}`,
    `${right - 40},${bottom}`,
  ].join(" ");

  /* Altitude ticks */
  const levels = [
    { alt: 0, temp: 30, label: "Sea level" },
    { alt: 1000, temp: 23.5, label: "1 000 m" },
    { alt: 2000, temp: 17, label: "2 000 m" },
    { alt: 3000, temp: 10.5, label: "3 000 m" },
    { alt: 4000, temp: 4, label: "4 000 m" },
    { alt: 5000, temp: -2.5, label: "5 000 m" },
  ];

  /* Snow line */
  const snowAlt = 4200;

  /* Temperature curve */
  const tempCurve: string[] = [];
  for (let m = 0; m <= 5000; m += 200) {
    const t = tempAtAlt(m);
    const x = mapRange(t, -10, 35, right - 40, right - 120);
    tempCurve.push(`${x},${altY(m)}`);
  }

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 430"
        className="w-full"
        role="img"
        aria-label="Mountain cross-section showing temperature decreasing from 30°C at the base to minus 5°C at the summit"
      >
        <rect x="0" y="0" width="600" height="410" className="fill-slate-900" rx="8" />

        {/* Mountain fill — green base fading to white top */}
        <defs>
          <linearGradient id="mtnGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#4ade80" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.5" />
          </linearGradient>
          <clipPath id="mtnClipTemp">
            <polygon points={mtnPoly} />
          </clipPath>
        </defs>

        <rect
          x={left}
          y={top}
          width={right - left}
          height={bottom - top}
          fill="url(#mtnGrad)"
          clipPath="url(#mtnClipTemp)"
        />
        <polygon
          points={mtnPoly}
          fill="none"
          className="stroke-gray-400"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Snow cap */}
        <polygon
          points={`${peakX - 40},${altY(snowAlt)} ${peakX},${altY(5000)} ${peakX + 35},${altY(snowAlt)}`}
          className="fill-white/40"
          strokeLinejoin="round"
          clipPath="url(#mtnClipTemp)"
        />

        {/* Snow line dashed */}
        <line
          x1={left}
          y1={altY(snowAlt)}
          x2={right}
          y2={altY(snowAlt)}
          className="stroke-blue-300"
          strokeWidth="1"
          strokeDasharray="5 3"
        />
        <text x={right - 5} y={altY(snowAlt) - 4} textAnchor="end" fontSize="9" className="fill-blue-300" fontWeight="600">
          Snow line ~4 200 m
        </text>

        {/* Y-axis (altitude) */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        <text
          x={14}
          y={(top + bottom) / 2}
          textAnchor="middle"
          fontSize="10"
          className="fill-gray-300"
          fontWeight="600"
          transform={`rotate(-90,14,${(top + bottom) / 2})`}
        >
          Altitude
        </text>

        {/* Altitude markers + thermometer icons */}
        {levels.map((lv, i) => (
          <g key={i}>
            <line
              x1={left - 4}
              y1={altY(lv.alt)}
              x2={left}
              y2={altY(lv.alt)}
              className="stroke-gray-400"
              strokeWidth="1"
            />
            <text
              x={left - 8}
              y={altY(lv.alt) + 3}
              textAnchor="end"
              fontSize="8"
              className="fill-gray-300"
            >
              {lv.label}
            </text>

            {/* Mini thermometer */}
            <g transform={`translate(${left + 30 + i * 12}, ${altY(lv.alt)})`}>
              <rect x="-2" y="-14" width="4" height="18" rx="2" className="fill-gray-700 stroke-gray-500" strokeWidth="0.5" />
              {/* Mercury fill — height proportional to temp */}
              <rect
                x="-1"
                y={-14 + (1 - (lv.temp + 10) / 45) * 16}
                width="2"
                height={(lv.temp + 10) / 45 * 16 + 2}
                rx="1"
                className="fill-red-400"
              />
              <circle cx="0" cy="6" r="3" className="fill-red-400" />
              <text x="6" y="2" fontSize="7" className="fill-red-300" fontWeight="600">
                {lv.temp > 0 ? `${lv.temp}°C` : `${lv.temp}°C`}
              </text>
            </g>
          </g>
        ))}

        {/* Temperature curve */}
        <polyline
          points={tempCurve.join(" ")}
          fill="none"
          className="stroke-red-400"
          strokeWidth="2"
          strokeDasharray="4 2"
        />

        {/* Lapse rate label */}
        <rect x={right - 175} y={altY(2700) - 12} width="140" height="20" rx="4" className="fill-amber-900/60" />
        <text
          x={right - 105}
          y={altY(2700) + 2}
          textAnchor="middle"
          fontSize="9"
          className="fill-amber-300"
          fontWeight="700"
        >
          6.5 °C cooler per 1 000 m
        </text>

        {/* Bottom insight label */}
        <rect x={left - 10} y={bottom + 8} width="480" height="22" rx="4" className="fill-slate-800" />
        <text x={left} y={bottom + 23} fontSize="9" className="fill-gray-300" fontWeight="600">
          Higher = thinner air = less heat trapped → mountains are cold at the top
        </text>
      </svg>
    </div>
  );
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
