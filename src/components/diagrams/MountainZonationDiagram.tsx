export default function MountainZonationDiagram() {
  const left = 80;
  const right = 540;
  const top = 45;
  const bottom = 370;
  const maxAlt = 5500;

  const altY = (m: number) => bottom - (m / maxAlt) * (bottom - top);

  const zones = [
    { from: 0, to: 1000, label: "Tropical / broadleaf forest", species: "Sal, bamboo, ferns, elephants", fill: "#22c55e", opacity: 0.35, textClass: "fill-green-300" },
    { from: 1000, to: 2000, label: "Deciduous forest", species: "Oak, maple, rhododendron, red panda", fill: "#16a34a", opacity: 0.3, textClass: "fill-green-200" },
    { from: 2000, to: 3000, label: "Coniferous forest", species: "Pine, spruce, fir, musk deer", fill: "#15803d", opacity: 0.3, textClass: "fill-emerald-300" },
    { from: 3000, to: 4000, label: "Alpine meadow", species: "Grasses, wildflowers, yak, snow leopard", fill: "#d97706", opacity: 0.2, textClass: "fill-amber-300" },
    { from: 4000, to: 5500, label: "Rock and snow", species: "Lichen, hardy insects, snow leopard", fill: "#e2e8f0", opacity: 0.2, textClass: "fill-gray-200" },
  ];

  /* Mountain shape */
  const peakX = 310;
  const mtnPoly = [
    `${left},${bottom}`,
    `${left + 30},${altY(400)}`,
    `${left + 80},${altY(1200)}`,
    `${peakX - 80},${altY(3500)}`,
    `${peakX - 20},${altY(4800)}`,
    `${peakX},${altY(5200)}`,
    `${peakX + 30},${altY(4600)}`,
    `${peakX + 80},${altY(3200)}`,
    `${peakX + 150},${altY(1400)}`,
    `${right - 30},${altY(300)}`,
    `${right},${bottom}`,
  ].join(" ");

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 455"
        className="w-full"
        role="img"
        aria-label="Mountain showing five altitudinal zones from tropical forest at the base to rock and snow above 4000 metres"
      >
        <rect x="0" y="0" width="600" height="420" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="12" className="fill-gray-200" fontWeight="700">
          Altitudinal Zonation
        </text>

        {/* Clip to mountain */}
        <defs>
          <clipPath id="mtnClipZone">
            <polygon points={mtnPoly} />
          </clipPath>
        </defs>

        {/* Zone bands */}
        {zones.map((z, i) => (
          <rect
            key={i}
            x={left}
            y={altY(z.to)}
            width={right - left}
            height={altY(z.from) - altY(z.to)}
            fill={z.fill}
            opacity={z.opacity}
            clipPath="url(#mtnClipZone)"
          />
        ))}

        {/* Mountain outline */}
        <polygon points={mtnPoly} fill="none" className="stroke-gray-400" strokeWidth="2" strokeLinejoin="round" />

        {/* Snow cap */}
        <polygon
          points={`${peakX - 30},${altY(4400)} ${peakX},${altY(5200)} ${peakX + 40},${altY(4200)}`}
          className="fill-white/30"
          clipPath="url(#mtnClipZone)"
        />

        {/* Y-axis */}
        <line x1={left} y1={top} x2={left} y2={bottom} className="stroke-gray-500" strokeWidth="1" />
        {[0, 1000, 2000, 3000, 4000, 5000].map((a, i) => (
          <g key={i}>
            <line x1={left - 4} y1={altY(a)} x2={left} y2={altY(a)} className="stroke-gray-400" strokeWidth="1" />
            <text x={left - 8} y={altY(a) + 3} textAnchor="end" fontSize="8" className="fill-gray-500 dark:fill-gray-400">
              {a === 0 ? "0 m" : `${a / 1000}k m`}
            </text>
          </g>
        ))}

        {/* Zone labels — right side with colored bars */}
        {zones.map((z, i) => {
          const midY = (altY(z.from) + altY(z.to)) / 2;
          return (
            <g key={`label-${i}`}>
              {/* Connector */}
              <line
                x1={right + 5}
                y1={midY}
                x2={right + 15}
                y2={midY}
                className="stroke-gray-500"
                strokeWidth="1"
              />
              {/* Color swatch */}
              <rect x={right + 17} y={midY - 6} width="8" height="12" rx="2" fill={z.fill} opacity={0.7} />
              {/* Zone name */}
              <text x={right + 30} y={midY - 1} fontSize="8" className={z.textClass} fontWeight="700">
                {z.label}
              </text>
              {/* Species */}
              <text x={right + 30} y={midY + 10} fontSize="7" className="fill-gray-500 dark:fill-gray-400">
                {z.species}
              </text>
              {/* Altitude range */}
              <text x={right + 30} y={midY + 20} fontSize="6" className="fill-gray-500">
                {z.from} – {z.to} m
              </text>
            </g>
          );
        })}

        {/* Simple tree icons on mountain */}
        {/* Broadleaf trees at base */}
        {[left + 50, left + 90, left + 130, peakX + 100, peakX + 140].map((x, i) => (
          <g key={`bt-${i}`} transform={`translate(${x}, ${altY(500 + i * 80)})`}>
            <line x1="0" y1="0" x2="0" y2="8" className="stroke-green-800" strokeWidth="1.5" />
            <circle cx="0" cy="-4" r="5" className="fill-green-500/40" />
          </g>
        ))}

        {/* Conifer trees mid-level */}
        {[left + 90, peakX - 40, peakX + 60].map((x, i) => (
          <g key={`ct-${i}`} transform={`translate(${x}, ${altY(2200 + i * 200)})`}>
            <line x1="0" y1="0" x2="0" y2="8" className="stroke-green-900" strokeWidth="1.5" />
            <polygon points="0,-8 -5,2 5,2" className="fill-green-700/50" />
          </g>
        ))}

        {/* Insight */}
        <rect x="40" y="390" width="520" height="22" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="405" textAnchor="middle" fontSize="9" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">
          As altitude rises, temperature drops — each zone has unique life adapted to it
        </text>
      </svg>
    </div>
  );
}
