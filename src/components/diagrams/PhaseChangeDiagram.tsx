import { useState, useEffect, useRef } from 'react';

// Temperature vs time data points for heating water from -20°C to 120°C
// Segments: Ice (-20→0), Melting (0 plateau), Water (0→100), Boiling (100 plateau), Steam (100→120)
const segments = [
  { tStart: 0, tEnd: 15, tempStart: -20, tempEnd: 0 },     // Ice heating
  { tStart: 15, tEnd: 30, tempStart: 0, tempEnd: 0 },       // Melting plateau
  { tStart: 30, tEnd: 70, tempStart: 0, tempEnd: 100 },     // Water heating
  { tStart: 70, tEnd: 85, tempStart: 100, tempEnd: 100 },   // Boiling plateau
  { tStart: 85, tEnd: 100, tempStart: 100, tempEnd: 120 },  // Steam heating
];

const plotLeft = 65, plotRight = 490, plotTop = 35, plotBottom = 240;
const plotW = plotRight - plotLeft;
const plotH = plotBottom - plotTop;

function timeToX(t: number) {
  return plotLeft + (t / 100) * plotW;
}

function tempToY(temp: number) {
  // Map -20..120 → plotBottom..plotTop
  return plotBottom - ((temp + 20) / 140) * plotH;
}

// Build the polyline path
const pathPoints = segments.flatMap(seg => [
  `${timeToX(seg.tStart).toFixed(1)},${tempToY(seg.tempStart).toFixed(1)}`,
  `${timeToX(seg.tEnd).toFixed(1)},${tempToY(seg.tempEnd).toFixed(1)}`,
]);
// Deduplicate consecutive identical points
const uniquePoints: string[] = [];
pathPoints.forEach(p => {
  if (uniquePoints[uniquePoints.length - 1] !== p) uniquePoints.push(p);
});
const polylinePath = uniquePoints.join(' ');

// Get position along curve for a progress value 0-100
function getPosition(progress: number): { x: number; y: number } {
  // Map progress to time 0-100
  const t = progress;
  for (const seg of segments) {
    if (t <= seg.tEnd) {
      const frac = (t - seg.tStart) / (seg.tEnd - seg.tStart);
      const temp = seg.tempStart + frac * (seg.tempEnd - seg.tempStart);
      return { x: timeToX(t), y: tempToY(temp) };
    }
  }
  return { x: timeToX(100), y: tempToY(120) };
}

// Region labels
const regions = [
  { label: 'Ice', x: (0 + 15) / 2, temp: -10, color: 'fill-cyan-600 dark:fill-cyan-400' },
  { label: 'Melting', x: (15 + 30) / 2, temp: -10, color: 'fill-blue-600 dark:fill-blue-400' },
  { label: 'Water', x: (30 + 70) / 2, temp: 50, color: 'fill-blue-600 dark:fill-blue-400' },
  { label: 'Boiling', x: (70 + 85) / 2, temp: 110, color: 'fill-orange-600 dark:fill-orange-400' },
  { label: 'Steam', x: (85 + 100) / 2, temp: 110, color: 'fill-red-600 dark:fill-red-400' },
];

export default function PhaseChangeDiagram() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    startTimeRef.current = performance.now() - (progress / 100) * 5000;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min((elapsed / 5000) * 100, 100);
      setProgress(p);
      if (p < 100) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing]);

  const dot = getPosition(progress);

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 330" className="w-full max-w-lg mx-auto" role="img" aria-label="Phase change diagram showing temperature plateaus during melting and boiling">
        {/* Y-axis */}
        <line x1={plotLeft} y1={plotTop - 5} x2={plotLeft} y2={plotBottom + 5} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        {/* X-axis */}
        <line x1={plotLeft - 5} y1={plotBottom} x2={plotRight + 5} y2={plotBottom} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Y-axis label */}
        <text x="18" y={(plotTop + plotBottom) / 2} textAnchor="middle" transform={`rotate(-90,18,${(plotTop + plotBottom) / 2})`} className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Temperature (°C)
        </text>

        {/* X-axis label */}
        <text x={(plotLeft + plotRight) / 2} y={plotBottom + 35} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Heat added (time) →
        </text>

        {/* Y-axis tick marks */}
        {[-20, 0, 20, 40, 60, 80, 100, 120].map(temp => (
          <g key={temp}>
            <line x1={plotLeft - 4} y1={tempToY(temp)} x2={plotLeft} y2={tempToY(temp)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" />
            <text x={plotLeft - 8} y={tempToY(temp) + 3} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="9">{temp}</text>
          </g>
        ))}

        {/* Horizontal dashed lines at 0°C and 100°C */}
        <line x1={plotLeft} y1={tempToY(0)} x2={plotRight} y2={tempToY(0)} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={plotLeft} y1={tempToY(100)} x2={plotRight} y2={tempToY(100)} className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Temperature curve */}
        <polyline points={polylinePath} fill="none" className="stroke-rose-500 dark:stroke-rose-400" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Region labels */}
        {regions.map(r => (
          <text key={r.label} x={timeToX(r.x)} y={tempToY(r.temp)} textAnchor="middle" className={r.color} fontSize="10" fontWeight="600">
            {r.label}
          </text>
        ))}

        {/* Latent heat labels */}
        {/* Fusion — bracket under melting plateau */}
        <text x={timeToX(22.5)} y={tempToY(0) + 18} textAnchor="middle" className="fill-blue-500 dark:fill-blue-400" fontSize="9" fontStyle="italic">
          Latent heat of fusion
        </text>
        {/* Vaporization — bracket above boiling plateau */}
        <text x={timeToX(77.5)} y={tempToY(100) - 10} textAnchor="middle" className="fill-orange-500 dark:fill-orange-400" fontSize="9" fontStyle="italic">
          Latent heat of vaporization
        </text>

        {/* Animated dot */}
        <circle cx={dot.x} cy={dot.y} r="5" className="fill-yellow-400 dark:fill-yellow-300 stroke-yellow-600 dark:stroke-yellow-500" strokeWidth="1.5" />

        {/* Play button */}
        <g
          className="cursor-pointer"
          onClick={() => {
            if (!playing) {
              if (progress >= 100) setProgress(0);
              setPlaying(true);
            } else {
              setPlaying(false);
            }
          }}
        >
          <rect x="220" y="262" width="80" height="26" rx="6" className="fill-indigo-500 dark:fill-indigo-600 hover:fill-indigo-600 dark:hover:fill-indigo-500" />
          <text x="260" y="280" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
            {playing ? 'Pause' : progress >= 100 ? 'Replay' : 'Play'}
          </text>
        </g>
      </svg>
    </div>
  );
}
