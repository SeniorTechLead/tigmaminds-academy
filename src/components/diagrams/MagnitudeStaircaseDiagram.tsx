export default function MagnitudeStaircaseDiagram() {
  const steps = [
    { mag: 6, total: '1×', label: 'Faintest visible', brightness: 1 },
    { mag: 5, total: '2.5×', label: '', brightness: 2.5 },
    { mag: 4, total: '6.3×', label: '', brightness: 6.3 },
    { mag: 3, total: '16×', label: '', brightness: 16 },
    { mag: 2, total: '40×', label: '', brightness: 40 },
    { mag: 1, total: '100×', label: 'Brightest stars', brightness: 100 },
  ];

  const w = 500;
  const h = 320;
  const stepW = 70;
  const maxStepH = 200;
  const baseY = h - 40;
  const startX = 40;

  return (
    <div className="bg-gray-950 rounded-xl p-4 my-4">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        The Magnitude Staircase — Each Step Multiplies by 2.5×
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto">
        {/* Stars background */}
        {Array.from({ length: 30 }, (_, i) => (
          <circle
            key={i}
            cx={Math.random() * w}
            cy={Math.random() * (h - 60)}
            r={Math.random() * 1.2 + 0.3}
            fill="white"
            opacity={Math.random() * 0.4 + 0.1}
          />
        ))}

        {/* Staircase steps */}
        {steps.map((step, i) => {
          const x = startX + i * stepW;
          const barH = (step.brightness / 100) * maxStepH;
          const y = baseY - barH;

          // Color: dimmer = darker amber, brighter = bright gold
          const lightness = 30 + (step.brightness / 100) * 55;
          const fill = `hsl(40, 90%, ${lightness}%)`;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={stepW - 6}
                height={barH}
                fill={fill}
                rx={4}
                opacity={0.9}
              />

              {/* Magnitude number on top */}
              <text
                x={x + (stepW - 6) / 2}
                y={y - 8}
                textAnchor="middle"
                className="text-xs font-bold"
                fill="white"
              >
                Mag {step.mag}
              </text>

              {/* Total brightness inside bar */}
              <text
                x={x + (stepW - 6) / 2}
                y={Math.max(y + 18, baseY - 14)}
                textAnchor="middle"
                className="text-xs font-bold"
                fill={lightness > 50 ? '#1a1a1a' : 'white'}
              >
                {step.total}
              </text>

              {/* ×2.5 arrow between steps */}
              {i < steps.length - 1 && (
                <text
                  x={x + stepW - 3}
                  y={baseY + 16}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#f59e0b"
                >
                  ×2.5
                </text>
              )}

              {/* Label for first and last */}
              {step.label && (
                <text
                  x={x + (stepW - 6) / 2}
                  y={baseY + 30}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#9ca3af"
                >
                  {step.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Arrow showing "brighter" direction */}
        <defs>
          <marker id="mag-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
        <line
          x1={startX - 10}
          y1={baseY - 20}
          x2={startX - 10}
          y2={baseY - maxStepH - 10}
          stroke="#f59e0b"
          strokeWidth={1.5}
          markerEnd="url(#mag-arrow)"
        />
        <text
          x={startX - 14}
          y={baseY - maxStepH / 2}
          textAnchor="middle"
          className="text-[9px] font-semibold"
          fill="#f59e0b"
          transform={`rotate(-90, ${startX - 14}, ${baseY - maxStepH / 2})`}
        >
          BRIGHTER
        </text>

        {/* Bottom annotation */}
        <text
          x={w / 2}
          y={h - 4}
          textAnchor="middle"
          className="text-[10px]"
          fill="#6b7280"
        >
          5 steps × 2.5 each = 100× total brightness difference
        </text>
      </svg>
    </div>
  );
}
