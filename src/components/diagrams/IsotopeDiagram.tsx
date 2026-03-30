export default function IsotopeDiagram() {
  const isotopes = [
    { name: "Protium", symbol: "¹H", protons: 1, neutrons: 0, mass: 1 },
    { name: "Deuterium", symbol: "²H", protons: 1, neutrons: 1, mass: 2 },
    { name: "Tritium", symbol: "³H", protons: 1, neutrons: 2, mass: 3 },
  ];

  const spacing = 165;
  const startX = 85;
  const cy = 95;
  const shellR = 50;

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 525 245"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label="Three hydrogen isotopes: Protium, Deuterium, Tritium"
      >
        {isotopes.map((iso, i) => {
          const cx = startX + i * spacing;
          const nucleusR = 12 + iso.neutrons * 5;

          /* Neutron and proton positions inside nucleus */
          const particles: { x: number; y: number; type: "p" | "n" }[] = [];
          particles.push({ x: cx - (iso.neutrons > 0 ? 4 : 0), y: cy, type: "p" });
          if (iso.neutrons >= 1) particles.push({ x: cx + 5, y: cy - 3, type: "n" });
          if (iso.neutrons >= 2) particles.push({ x: cx + 3, y: cy + 6, type: "n" });

          return (
            <g key={iso.name}>
              {/* Shell circle */}
              <circle cx={cx} cy={cy} r={shellR} fill="none"
                className="stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Nucleus */}
              <circle cx={cx} cy={cy} r={nucleusR}
                className="fill-gray-100 dark:fill-gray-700 stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="1" />
              {particles.map((p, j) => (
                <circle key={j} cx={p.x} cy={p.y} r="6"
                  className={p.type === "p" ? "fill-red-400 dark:fill-red-500" : "fill-gray-400 dark:fill-gray-500"} />
              ))}
              {particles.map((p, j) => (
                <text key={`t-${j}`} x={p.x} y={p.y + 3.5} textAnchor="middle"
                  fontSize="8" fontWeight="bold" className="fill-white">
                  {p.type === "p" ? "p" : "n"}
                </text>
              ))}

              {/* Electron on shell */}
              <circle cx={cx + shellR} cy={cy} r="5"
                className="fill-blue-500 dark:fill-blue-400" />
              <text x={cx + shellR} y={cy + 3} textAnchor="middle"
                fontSize="7" fontWeight="bold" className="fill-white">
                e
              </text>

              {/* Labels */}
              <text x={cx} y="165" textAnchor="middle" fontSize="13"
                fontWeight="bold" className="fill-gray-700 dark:fill-gray-200">
                {iso.name}
              </text>
              <text x={cx} y="180" textAnchor="middle" fontSize="11"
                className="fill-gray-500 dark:fill-gray-400">
                {iso.symbol} — mass {iso.mass}
              </text>
              <text x={cx} y="195" textAnchor="middle" fontSize="10"
                className="fill-gray-400 dark:fill-gray-500">
                {iso.protons}p, {iso.neutrons}n, 1e
              </text>
            </g>
          );
        })}

        {/* Title */}
        <text x="250" y="16" textAnchor="middle" fontSize="12"
          fontWeight="bold" className="fill-gray-600 dark:fill-gray-300">
          Hydrogen Isotopes
        </text>
      </svg>
    </div>
  );
}
