const cells: { seed: [number, number]; polygon: string; fill: string }[] = [
  {
    seed: [80, 80],
    polygon: "0,0 160,0 140,60 100,110 40,120 0,90",
    fill: "#d1fae5", // soft green
  },
  {
    seed: [250, 60],
    polygon: "160,0 340,0 320,50 280,100 200,110 140,60",
    fill: "#dbeafe", // soft blue
  },
  {
    seed: [430, 70],
    polygon: "340,0 500,0 500,110 460,130 380,110 320,50",
    fill: "#fce7f3", // soft pink
  },
  {
    seed: [70, 190],
    polygon: "0,90 40,120 100,110 120,180 80,250 0,240",
    fill: "#fef9c3", // soft yellow
  },
  {
    seed: [210, 170],
    polygon: "100,110 200,110 240,160 220,230 130,240 80,250 120,180",
    fill: "#e0e7ff", // soft lavender
  },
  {
    seed: [370, 160],
    polygon: "200,110 280,100 320,50 380,110 460,130 440,200 360,230 240,160",
    fill: "#ccfbf1", // soft teal
  },
  {
    seed: [470, 200],
    polygon: "460,130 500,110 500,260 450,270 400,240 440,200",
    fill: "#fde68a", // soft amber
  },
  {
    seed: [130, 290],
    polygon: "0,240 80,250 130,240 160,300 120,350 0,350",
    fill: "#fbcfe8", // soft rose
  },
  {
    seed: [290, 290],
    polygon: "130,240 220,230 360,230 340,300 260,340 160,300",
    fill: "#c7d2fe", // soft indigo
  },
  {
    seed: [440, 300],
    polygon: "360,230 400,240 450,270 500,260 500,350 380,350 260,340 340,300",
    fill: "#d9f99d", // soft lime
  },
];

export default function VoronoiDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-6">
      <svg viewBox="0 0 500 400" className="w-full" aria-label="Voronoi diagram showing how nature divides space">
        {/* Title label */}
        <text
          x="250"
          y="380"
          textAnchor="middle"
          fontSize="12"
          className="fill-gray-600 dark:fill-gray-300"
          fontStyle="italic"
        >
          Each cell contains all points closest to its seed
        </text>

        {/* Cell polygons */}
        {cells.map((cell, i) => (
          <polygon
            key={`cell-${i}`}
            points={cell.polygon}
            fill={cell.fill}
            stroke="#e5e7eb"
            strokeWidth={1}
            fillOpacity={0.85}
          />
        ))}

        {/* Seed dots */}
        {cells.map((cell, i) => (
          <circle
            key={`seed-${i}`}
            cx={cell.seed[0]}
            cy={cell.seed[1]}
            r={4}
            fill="#1f2937"
          />
        ))}
      </svg>

      {/* Real-world examples */}
      <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
        Giraffe skin &bull; Dragonfly wing &bull; Dried mud cracks &bull; Soap bubbles
      </p>
    </div>
  );
}
