import { useState } from "react";

const elements = [
  { z: 1, name: "Hydrogen", shells: [1] },
  { z: 2, name: "Helium", shells: [2] },
  { z: 3, name: "Lithium", shells: [2, 1] },
  { z: 4, name: "Beryllium", shells: [2, 2] },
  { z: 5, name: "Boron", shells: [2, 3] },
  { z: 6, name: "Carbon", shells: [2, 4] },
  { z: 7, name: "Nitrogen", shells: [2, 5] },
  { z: 8, name: "Oxygen", shells: [2, 6] },
  { z: 9, name: "Fluorine", shells: [2, 7] },
  { z: 10, name: "Neon", shells: [2, 8] },
  { z: 11, name: "Sodium", shells: [2, 8, 1] },
  { z: 12, name: "Magnesium", shells: [2, 8, 2] },
  { z: 13, name: "Aluminium", shells: [2, 8, 3] },
  { z: 14, name: "Silicon", shells: [2, 8, 4] },
  { z: 15, name: "Phosphorus", shells: [2, 8, 5] },
  { z: 16, name: "Sulfur", shells: [2, 8, 6] },
  { z: 17, name: "Chlorine", shells: [2, 8, 7] },
  { z: 18, name: "Argon", shells: [2, 8, 8] },
  { z: 19, name: "Potassium", shells: [2, 8, 8, 1] },
  { z: 20, name: "Calcium", shells: [2, 8, 8, 2] },
];

const shellRadii = [50, 85, 120, 155];
const shellLabels = ["K", "L", "M", "N"];
const cx = 200;
const cy = 200;

export default function ElectronShellDiagram() {
  const [selected, setSelected] = useState(0);
  const el = elements[selected];

  return (
    <div className="my-4">
      {/* Element selector buttons */}
      <div className="flex flex-wrap gap-1 justify-center mb-3 max-w-2xl mx-auto">
        {elements.map((e, i) => (
          <button
            key={e.z}
            onClick={() => setSelected(i)}
            className={`w-8 h-8 text-xs rounded font-semibold transition-colors ${
              i === selected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900"
            }`}
          >
            {e.z}
          </button>
        ))}
      </div>

      <svg
        viewBox="0 0 420 426"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label={`Electron shell diagram for ${el.name}`}
      >
        {/* Shell circles */}
        {el.shells.map((_, i) => (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={shellRadii[i]}
              fill="none"
              className="stroke-gray-300 dark:stroke-gray-600"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text
              x={cx + shellRadii[i] + 4}
              y={cy - 4}
              fontSize="10"
              className="fill-gray-400 dark:fill-gray-500"
            >
              {shellLabels[i]}
            </text>
          </g>
        ))}

        {/* Nucleus */}
        <circle cx={cx} cy={cy} r="22" className="fill-red-400 dark:fill-red-500" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          className="fill-white"
        >
          {el.z}p
        </text>
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          fontSize="10"
          className="fill-red-100"
        >
          {el.z <= 2 ? el.z - 1 + (el.z === 1 ? 0 : 0) : el.z <= 10 ? el.z : Math.round(el.z * 1.2) - el.z}n
        </text>

        {/* Electrons on each shell */}
        {el.shells.map((count, shellIdx) => {
          const r = shellRadii[shellIdx];
          return Array.from({ length: count }).map((_, eIdx) => {
            const angle = (2 * Math.PI * eIdx) / count - Math.PI / 2;
            const ex = cx + r * Math.cos(angle);
            const ey = cy + r * Math.sin(angle);
            return (
              <circle
                key={`${shellIdx}-${eIdx}`}
                cx={ex}
                cy={ey}
                r="5"
                className="fill-blue-500 dark:fill-blue-400"
              />
            );
          });
        })}

        {/* Element label */}
        <text
          x={cx}
          y={380}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          className="fill-gray-700 dark:fill-gray-200"
        >
          {el.name}
        </text>
        <text
          x={cx}
          y={395}
          textAnchor="middle"
          fontSize="11"
          className="fill-gray-500 dark:fill-gray-400"
        >
          Atomic number: {el.z} | Shells: {el.shells.join("-")}
        </text>
      </svg>
    </div>
  );
}
