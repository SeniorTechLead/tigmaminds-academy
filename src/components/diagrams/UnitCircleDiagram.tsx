import { useState } from "react";

const ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330] as const;

export default function UnitCircleDiagram() {
  const [angle, setAngle] = useState(45);

  const cx = 200, cy = 200, r = 140;
  const rad = (angle * Math.PI) / 180;
  const px = cx + r * Math.cos(rad);
  const py = cy - r * Math.sin(rad); // SVG y-axis is flipped
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  return (
    <div className="my-4">
      <svg
        viewBox="0 0 420 420"
        className="w-full max-w-xl mx-auto"
        role="img"
        aria-label={`Unit circle showing angle ${angle}°, sin=${sinVal.toFixed(3)}, cos=${cosVal.toFixed(3)}`}
      >
        {/* Grid / axes */}
        <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* Axis labels */}
        <text x={cx + r + 24} y={cy + 4} fontSize="11" className="fill-gray-500 dark:fill-gray-400">x</text>
        <text x={cx + 4} y={cy - r - 24} fontSize="11" className="fill-gray-500 dark:fill-gray-400">y</text>

        {/* Tick marks on axes: -1, 1 */}
        <text x={cx + r} y={cy + 16} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">1</text>
        <text x={cx - r} y={cy + 16} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">-1</text>
        <text x={cx - 14} y={cy - r + 4} fontSize="10" className="fill-gray-500 dark:fill-gray-400">1</text>
        <text x={cx - 16} y={cy + r + 4} fontSize="10" className="fill-gray-500 dark:fill-gray-400">-1</text>

        {/* Quadrant labels */}
        <text x={cx + r / 2} y={cy - r / 2 - 10} textAnchor="middle" fontSize="14" fontWeight="bold" className="fill-gray-300 dark:fill-gray-600">I</text>
        <text x={cx - r / 2} y={cy - r / 2 - 10} textAnchor="middle" fontSize="14" fontWeight="bold" className="fill-gray-300 dark:fill-gray-600">II</text>
        <text x={cx - r / 2} y={cy + r / 2 + 16} textAnchor="middle" fontSize="14" fontWeight="bold" className="fill-gray-300 dark:fill-gray-600">III</text>
        <text x={cx + r / 2} y={cy + r / 2 + 16} textAnchor="middle" fontSize="14" fontWeight="bold" className="fill-gray-300 dark:fill-gray-600">IV</text>

        {/* Unit circle */}
        <circle cx={cx} cy={cy} r={r} className="fill-none stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Angle arc */}
        {angle !== 0 && (
          <path
            d={(() => {
              const arcR = 30;
              const endRad = rad;
              const ex = cx + arcR * Math.cos(endRad);
              const ey = cy - arcR * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;
              return `M ${cx + arcR},${cy} A ${arcR},${arcR} 0 ${largeArc} 0 ${ex},${ey}`;
            })()}
            className="fill-none stroke-purple-500 dark:stroke-purple-400"
            strokeWidth="1.5"
          />
        )}
        <text
          x={cx + 38 * Math.cos(rad / 2)}
          y={cy - 38 * Math.sin(rad / 2) + 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          className="fill-purple-600 dark:fill-purple-300"
        >
          {angle}°
        </text>

        {/* Radius line to point P */}
        <line x1={cx} y1={cy} x2={px} y2={py} className="stroke-gray-700 dark:stroke-gray-200" strokeWidth="2" />

        {/* Dashed line: cos projection (horizontal from P to y-axis line) */}
        <line x1={cx} y1={cy} x2={px} y2={cy} className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" strokeDasharray="4 3" />
        {/* Dashed line: sin projection (vertical from P to x-axis line) */}
        <line x1={px} y1={cy} x2={px} y2={py} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" strokeDasharray="4 3" />

        {/* cos label */}
        <text
          x={(cx + px) / 2}
          y={cy + 14}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          className="fill-blue-600 dark:fill-blue-300"
        >
          cos = {cosVal.toFixed(2)}
        </text>

        {/* sin label */}
        <text
          x={px + (cosVal >= 0 ? 12 : -12)}
          y={(cy + py) / 2 + 4}
          textAnchor={cosVal >= 0 ? "start" : "end"}
          fontSize="11"
          fontWeight="bold"
          className="fill-red-600 dark:fill-red-300"
        >
          sin = {sinVal.toFixed(2)}
        </text>

        {/* Point P */}
        <circle cx={px} cy={py} r="5" className="fill-emerald-500 dark:fill-emerald-400" />
        <text
          x={px + (cosVal >= 0 ? 10 : -10)}
          y={py + (sinVal >= 0 ? -10 : 16)}
          textAnchor={cosVal >= 0 ? "start" : "end"}
          fontSize="11"
          fontWeight="bold"
          className="fill-emerald-700 dark:fill-emerald-300"
        >
          P
        </text>

        {/* Origin label */}
        <text x={cx - 14} y={cy + 14} fontSize="10" className="fill-gray-500 dark:fill-gray-400">O</text>
      </svg>

      {/* Angle selector buttons */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-2 px-2">
        {ANGLES.map((a) => (
          <button
            key={a}
            onClick={() => setAngle(a)}
            className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
              angle === a
                ? "bg-purple-600 text-white dark:bg-purple-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {a}°
          </button>
        ))}
      </div>

      {/* Values readout */}
      <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300 font-mono">
        <span className="text-purple-600 dark:text-purple-400 font-bold">{angle}°</span>
        {" | "}
        <span className="text-blue-600 dark:text-blue-400">cos = {cosVal.toFixed(4)}</span>
        {" | "}
        <span className="text-red-600 dark:text-red-400">sin = {sinVal.toFixed(4)}</span>
      </div>
    </div>
  );
}
