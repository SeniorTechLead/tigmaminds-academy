import { useState, useEffect } from 'react';

export default function CircuitDiagram() {
  const [dotPos, setDotPos] = useState(0);

  // Animate electron dots around the circuit
  useEffect(() => {
    const interval = setInterval(() => {
      setDotPos(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Circuit path: Arduino pin → resistor → LED → GND, forming a loop
  // Simplified as a rectangle with components labeled
  const w = 500, h = 280;
  const top = 60, bottom = 220, left = 80, right = 420;

  // Electron dot positions along the circuit path
  const pathLength = 2 * (right - left) + 2 * (bottom - top);
  const t = (dotPos / 100) * pathLength;

  const getDotPosition = (dist: number) => {
    const topLen = right - left;
    const rightLen = bottom - top;
    const bottomLen = right - left;

    if (dist < topLen) return { x: left + dist, y: top };
    dist -= topLen;
    if (dist < rightLen) return { x: right, y: top + dist };
    dist -= rightLen;
    if (dist < bottomLen) return { x: right - dist, y: bottom };
    dist -= bottomLen;
    return { x: left, y: bottom - dist };
  };

  const dots = [0, 25, 50, 75].map(offset => getDotPosition((t + offset * pathLength / 100) % pathLength));

  return (
    <div className="my-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-2xl mx-auto" role="img" aria-label="LED circuit diagram">
        {/* Circuit path */}
        <rect x={left} y={top} width={right - left} height={bottom - top}
          fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" rx="8" />

        {/* Arduino pin label (top-left) */}
        <rect x={left - 10} y={top - 15} width={80} height={30} rx="6" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-400" strokeWidth="1" />
        <text x={left + 30} y={top + 5} textAnchor="middle" className="fill-blue-700 dark:fill-blue-300" fontSize="11" fontWeight="600">Pin 9 (5V)</text>

        {/* Resistor (top wire) */}
        <rect x={190} y={top - 12} width={80} height={24} rx="4" className="fill-amber-100 dark:fill-amber-900/30 stroke-amber-500" strokeWidth="1.5" />
        <text x={230} y={top + 5} textAnchor="middle" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="600">220 Ω</text>

        {/* LED (right side) */}
        <polygon points={`${right - 5},${120} ${right + 5},${120} ${right},${155}`} className="fill-emerald-400 dark:fill-emerald-500" />
        <line x1={right - 8} y1={155} x2={right + 8} y2={155} className="stroke-emerald-600" strokeWidth="2" />
        <text x={right + 25} y={140} className="fill-emerald-700 dark:fill-emerald-300" fontSize="10" fontWeight="600">LED</text>
        <text x={right + 25} y={153} className="fill-gray-500 dark:fill-gray-400" fontSize="9">~2V drop</text>

        {/* GND label (bottom-left) */}
        <rect x={left - 10} y={bottom - 15} width={60} height={30} rx="6" className="fill-gray-200 dark:fill-gray-700 stroke-gray-400" strokeWidth="1" />
        <text x={left + 20} y={bottom + 5} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">GND</text>

        {/* Current direction arrow */}
        <text x={left + 150} y={bottom + 5} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          ← current flows this way (conventional)
        </text>

        {/* Animated electron dots */}
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r="4" className="fill-sky-500 dark:fill-sky-400" opacity={0.8}>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
          </circle>
        ))}

        {/* Voltage annotations */}
        <text x={250} y={top + 35} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          5V from Arduino → 3V across resistor → 2V across LED → 0V at GND
        </text>
      </svg>
    </div>
  );
}
