import { useState, useEffect } from 'react';

export default function LightClockDiagram() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => (prev + 1) % 120);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  // Stationary clock: photon bounces vertically
  const stationaryX = 100;
  const mirrorTop = 60;
  const mirrorBot = 200;
  const mirrorH = mirrorBot - mirrorTop;

  // Photon position for stationary clock
  const stPhase = (tick % 60) / 60; // 0..1
  const stGoingUp = Math.floor(tick / 60) % 2 === 1;
  const stY = stGoingUp ? mirrorBot - stPhase * mirrorH : mirrorTop + stPhase * mirrorH;

  // Moving clock: photon travels diagonal path
  const movingBaseX = 320;
  const moveAmplitude = 60; // horizontal shift per bounce
  // Photon for moving clock — diagonal path
  const mvPhase = (tick % 60) / 60;
  const mvGoingUp = Math.floor(tick / 60) % 2 === 1;
  const mvY = mvGoingUp ? mirrorBot - mvPhase * mirrorH : mirrorTop + mvPhase * mirrorH;
  const mvXOffset = mvPhase * moveAmplitude;
  const mvX = mvGoingUp
    ? movingBaseX + moveAmplitude - mvXOffset
    : movingBaseX + mvXOffset;

  return (
    <div className="my-4">
      <svg viewBox="0 0 500 300" className="w-full max-w-xl mx-auto" role="img" aria-label="Light clock thought experiment for time dilation">
        {/* Title */}
        <text x="250" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          Light Clock — Time Dilation
        </text>

        {/* Divider */}
        <line x1="225" y1="30" x2="225" y2="250" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,4" />

        {/* ===== STATIONARY CLOCK (left) ===== */}
        <text x={stationaryX} y="45" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="12" fontWeight="bold">
          Stationary clock
        </text>

        {/* Top mirror */}
        <rect x={stationaryX - 30} y={mirrorTop - 5} width="60" height="6" rx="2" className="fill-gray-400 dark:fill-gray-500" />
        <text x={stationaryX + 40} y={mirrorTop} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Mirror</text>

        {/* Bottom mirror */}
        <rect x={stationaryX - 30} y={mirrorBot} width="60" height="6" rx="2" className="fill-gray-400 dark:fill-gray-500" />
        <text x={stationaryX + 40} y={mirrorBot + 5} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Mirror</text>

        {/* Photon path (vertical) */}
        <line x1={stationaryX} y1={mirrorTop} x2={stationaryX} y2={mirrorBot}
          className="stroke-yellow-300 dark:stroke-yellow-500" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />

        {/* Photon */}
        <circle cx={stationaryX} cy={stY} r="5" className="fill-yellow-400">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Distance label */}
        <line x1={stationaryX - 45} y1={mirrorTop} x2={stationaryX - 45} y2={mirrorBot}
          className="stroke-blue-400 dark:stroke-blue-500" strokeWidth="1" markerEnd="url(#lcArrowDown)" markerStart="url(#lcArrowUp)" />
        <text x={stationaryX - 55} y={(mirrorTop + mirrorBot) / 2 + 4} textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="bold"
          transform={`rotate(-90, ${stationaryX - 55}, ${(mirrorTop + mirrorBot) / 2 + 4})`}>d</text>

        {/* Time label */}
        <text x={stationaryX} y={mirrorBot + 25} textAnchor="middle" className="fill-blue-600 dark:fill-blue-300" fontSize="11" fontWeight="600">
          t = d/c
        </text>
        <text x={stationaryX} y={mirrorBot + 38} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          (short path)
        </text>

        {/* ===== MOVING CLOCK (right) ===== */}
        <text x={movingBaseX + 30} y="45" textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="12" fontWeight="bold">
          Moving clock
        </text>

        {/* Velocity arrow */}
        <line x1={movingBaseX - 15} y1="43" x2={movingBaseX + 75} y2="43" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" markerEnd="url(#lcArrowRight)" />
        <text x={movingBaseX + 30} y="40" textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="10">v →</text>

        {/* Top mirror (moving) */}
        <rect x={movingBaseX} y={mirrorTop - 5} width="60" height="6" rx="2" className="fill-gray-400 dark:fill-gray-500" />

        {/* Bottom mirror (moving) */}
        <rect x={movingBaseX} y={mirrorBot} width="60" height="6" rx="2" className="fill-gray-400 dark:fill-gray-500" />

        {/* Diagonal photon path */}
        <line x1={movingBaseX} y1={mirrorTop} x2={movingBaseX + moveAmplitude} y2={mirrorBot}
          className="stroke-yellow-300 dark:stroke-yellow-500" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
        <line x1={movingBaseX + moveAmplitude} y1={mirrorBot} x2={movingBaseX + moveAmplitude * 2} y2={mirrorTop}
          className="stroke-yellow-300 dark:stroke-yellow-500" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

        {/* Photon */}
        <circle cx={mvX} cy={mvY} r="5" className="fill-yellow-400">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Diagonal distance label */}
        <text x={movingBaseX + 20} y={(mirrorTop + mirrorBot) / 2 - 8} className="fill-red-600 dark:fill-red-300" fontSize="11" fontWeight="bold"
          transform={`rotate(65, ${movingBaseX + 20}, ${(mirrorTop + mirrorBot) / 2 - 8})`}>
          longer path!
        </text>

        {/* Time label */}
        <text x={movingBaseX + 30} y={mirrorBot + 25} textAnchor="middle" className="fill-red-600 dark:fill-red-300" fontSize="11" fontWeight="600">
          {"t' = d'/c > t"}
        </text>
        <text x={movingBaseX + 30} y={mirrorBot + 38} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          (longer path = slower tick)
        </text>

        {/* Formula at bottom */}
        <rect x="100" y="255" width="300" height="38" rx="8" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />
        <text x="250" y="272" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="11" fontWeight="bold">
          Time Dilation: t' = t / √(1 − v²/c²)
        </text>
        <text x="250" y="287" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          Moving clocks tick slower — Einstein's Special Relativity
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="lcArrowDown" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
            <polygon points="0 0, 6 0, 3 6" className="fill-blue-400 dark:fill-blue-500" />
          </marker>
          <marker id="lcArrowUp" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
            <polygon points="0 6, 6 6, 3 0" className="fill-blue-400 dark:fill-blue-500" />
          </marker>
          <marker id="lcArrowRight" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-400 dark:fill-red-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
