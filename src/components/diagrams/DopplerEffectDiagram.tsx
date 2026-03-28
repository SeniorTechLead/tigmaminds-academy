import { useState } from "react";

export default function DopplerEffectDiagram() {
  const [moving, setMoving] = useState(false);

  const cx = 260;
  const cy = 140;
  const wavefronts = 6;
  const baseRadius = 22;
  const radiusStep = 28;

  // When moving, each wavefront center shifts right proportionally to its age
  // Older (larger) wavefronts were emitted when the source was further left
  const offsetPerWave = moving ? 12 : 0;

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      {/* Toggle button */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setMoving((m) => !m)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            bg-cyan-600 hover:bg-cyan-700 text-white
            dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-gray-900"
        >
          {moving ? "Moving right →" : "Stationary"}
        </button>
      </div>

      <svg
        viewBox="0 0 520 280"
        className="w-full"
        role="img"
        aria-label="Doppler effect diagram showing wavefront compression and stretching"
      >
        {/* Background */}
        <rect width="520" height="280" fill="none" />

        {/* Wavefronts — drawn back-to-front (largest first) */}
        {Array.from({ length: wavefronts }, (_, i) => {
          const waveIndex = wavefronts - 1 - i; // oldest wave first
          const r = baseRadius + (waveIndex + 1) * radiusStep;
          // Older wavefronts shift more (emitted when source was further left)
          const shift = -waveIndex * offsetPerWave;
          return (
            <circle
              key={waveIndex}
              cx={cx + shift}
              cy={cy}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              opacity={0.55 - waveIndex * 0.06}
              className="text-cyan-500 dark:text-cyan-400"
              style={{ transition: "cx 0.6s ease, r 0.3s ease" }}
            />
          );
        })}

        {/* Source — simple ambulance rectangle */}
        <g>
          <rect
            x={cx - 16}
            y={cy - 10}
            width={32}
            height={20}
            rx={4}
            className="fill-red-500 dark:fill-red-400"
          />
          {/* Cross on ambulance */}
          <line
            x1={cx}
            y1={cy - 6}
            x2={cx}
            y2={cy + 6}
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <line
            x1={cx - 6}
            y1={cy}
            x2={cx + 6}
            y2={cy}
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Wheels */}
          <circle cx={cx - 9} cy={cy + 12} r={3.5} className="fill-gray-700 dark:fill-gray-300" />
          <circle cx={cx + 9} cy={cy + 12} r={3.5} className="fill-gray-700 dark:fill-gray-300" />
        </g>

        {/* Direction arrow when moving */}
        {moving && (
          <g className="text-gray-600 dark:text-gray-400">
            <line
              x1={cx + 22}
              y1={cy - 22}
              x2={cx + 44}
              y2={cy - 22}
              stroke="currentColor"
              strokeWidth={1.5}
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="5"
                refX="5"
                refY="2.5"
                orient="auto"
              >
                <polygon points="0 0, 6 2.5, 0 5" fill="currentColor" />
              </marker>
            </defs>
          </g>
        )}

        {/* Left observer */}
        <g>
          {/* Head */}
          <circle cx={52} cy={cy - 10} r={8} className="fill-amber-500 dark:fill-amber-400" />
          {/* Body */}
          <line
            x1={52}
            y1={cy - 2}
            x2={52}
            y2={cy + 18}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          {/* Arms */}
          <line
            x1={42}
            y1={cy + 6}
            x2={62}
            y2={cy + 6}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          {/* Legs */}
          <line
            x1={52}
            y1={cy + 18}
            x2={44}
            y2={cy + 30}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          <line
            x1={52}
            y1={cy + 18}
            x2={60}
            y2={cy + 30}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
        </g>

        {/* Right observer */}
        <g>
          <circle cx={468} cy={cy - 10} r={8} className="fill-amber-500 dark:fill-amber-400" />
          <line
            x1={468}
            y1={cy - 2}
            x2={468}
            y2={cy + 18}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          <line
            x1={458}
            y1={cy + 6}
            x2={478}
            y2={cy + 6}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          <line
            x1={468}
            y1={cy + 18}
            x2={460}
            y2={cy + 30}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
          <line
            x1={468}
            y1={cy + 18}
            x2={476}
            y2={cy + 30}
            stroke="currentColor"
            strokeWidth={2}
            className="text-gray-700 dark:text-gray-300"
          />
        </g>

        {/* Observer labels */}
        {moving ? (
          <>
            <text
              x={52}
              y={cy + 48}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              className="fill-orange-600 dark:fill-orange-400"
            >
              Lower pitch
            </text>
            <text
              x={52}
              y={cy + 60}
              textAnchor="middle"
              fontSize={10}
              className="fill-gray-500 dark:fill-gray-400"
            >
              (stretched)
            </text>
            <text
              x={468}
              y={cy + 48}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              className="fill-blue-600 dark:fill-blue-400"
            >
              Higher pitch
            </text>
            <text
              x={468}
              y={cy + 60}
              textAnchor="middle"
              fontSize={10}
              className="fill-gray-500 dark:fill-gray-400"
            >
              (compressed)
            </text>
          </>
        ) : (
          <>
            <text
              x={52}
              y={cy + 50}
              textAnchor="middle"
              fontSize={11}
              className="fill-gray-500 dark:fill-gray-400"
            >
              Observer
            </text>
            <text
              x={468}
              y={cy + 50}
              textAnchor="middle"
              fontSize={11}
              className="fill-gray-500 dark:fill-gray-400"
            >
              Observer
            </text>
          </>
        )}

        {/* Title */}
        <text
          x={260}
          y={22}
          textAnchor="middle"
          fontSize={14}
          fontWeight={700}
          className="fill-gray-800 dark:fill-gray-100"
        >
          Doppler Effect
        </text>

        {/* State label */}
        <text
          x={260}
          y={38}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-500 dark:fill-gray-400"
        >
          {moving ? "Source moving right — wavefronts shift" : "Source stationary — equal spacing"}
        </text>

        {/* Formula */}
        <text
          x={260}
          y={265}
          textAnchor="middle"
          fontSize={11}
          fontFamily="serif"
          className="fill-gray-700 dark:fill-gray-300"
        >
          {"f"}
          <tspan fontSize={8} dy={3}>
            obs
          </tspan>
          <tspan dy={-3}>{" = f"}</tspan>
          <tspan fontSize={8} dy={3}>
            src
          </tspan>
          <tspan dy={-3}>{" \u00D7 (v \u00B1 v"}</tspan>
          <tspan fontSize={8} dy={3}>
            obs
          </tspan>
          <tspan dy={-3}>{") / (v \u2213 v"}</tspan>
          <tspan fontSize={8} dy={3}>
            src
          </tspan>
          <tspan dy={-3}>{")"}</tspan>
        </text>
      </svg>
    </div>
  );
}
