import { useState } from 'react';

export default function EnergyBarChartDiagram() {
  const [position, setPosition] = useState(0); // 0 = top of hill, 100 = bottom

  const totalEnergy = 100;
  const pe = totalEnergy * (1 - position / 100);
  const ke = totalEnergy - pe;

  // Hill profile: a smooth curve from top-left to bottom-right
  const hillLeft = 20, hillRight = 210, hillTop = 50, hillBottom = 220;
  const hillW = hillRight - hillLeft;
  const hillH = hillBottom - hillTop;

  // Hill curve as a quadratic: y = hillTop + (x-hillLeft)^2 / hillW^2 * hillH
  const hillY = (xNorm: number) => hillTop + xNorm * xNorm * hillH;
  const hillPath = Array.from({ length: 50 }, (_, i) => {
    const t = i / 49;
    const x = hillLeft + t * hillW;
    const y = hillY(t);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // Ball position on the hill
  const ballT = position / 100;
  const ballX = hillLeft + ballT * hillW;
  const ballY = hillY(ballT) - 10; // slightly above the curve

  // Bar chart area
  const barLeft = 270, barWidth = 70, barMaxH = 160;
  const barBottom = 220, barTop = barBottom - barMaxH;

  const keBarH = (ke / totalEnergy) * barMaxH;
  const peBarH = (pe / totalEnergy) * barMaxH;

  // Slider position
  const sliderLeft = 240, sliderTop = 240, sliderWidth = 240;

  return (
    <div className="my-4">
      <svg viewBox="0 0 546 294" className="w-full max-w-lg mx-auto" role="img" aria-label="Energy bar chart showing kinetic and potential energy of a ball rolling down a hill">
        {/* Title */}
        <text x="260" y="20" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="12" fontWeight="700">
          Conservation of Energy
        </text>

        {/* === Left side: Hill cross-section === */}
        {/* Ground line */}
        <line x1={hillLeft} y1={hillBottom} x2={hillRight + 10} y2={hillBottom} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Hill fill */}
        <path
          d={`${hillPath} L${hillRight},${hillBottom} L${hillLeft},${hillBottom} Z`}
          className="fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-600 dark:stroke-emerald-500"
          strokeWidth="2"
          fill-opacity="0.6"
        />

        {/* Height reference dashed line */}
        <line x1={ballX} y1={ballY} x2={ballX} y2={hillBottom} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3,3" />
        <text x={ballX + 8} y={(ballY + hillBottom) / 2 + 4} className="fill-gray-500 dark:fill-gray-400" fontSize="9">h</text>

        {/* Ball */}
        <circle cx={ballX} cy={ballY} r="10" className="fill-orange-400 dark:fill-orange-500 stroke-orange-600 dark:stroke-orange-400" strokeWidth="1.5" />

        {/* Position labels on hill */}
        <text x={hillLeft + 5} y={hillTop - 5} className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Top</text>
        <text x={hillRight - 5} y={hillBottom + 14} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">Bottom</text>

        {/* === Right side: Stacked bar chart === */}
        {/* Bar background */}
        <rect x={barLeft} y={barTop} width={barWidth} height={barMaxH} rx="3" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

        {/* KE bar (blue, bottom) */}
        <rect x={barLeft} y={barBottom - keBarH} width={barWidth} height={keBarH} rx="2" className="fill-blue-500 dark:fill-blue-600" />

        {/* PE bar (green, on top of KE) */}
        <rect x={barLeft} y={barBottom - keBarH - peBarH} width={barWidth} height={peBarH} rx="2" className="fill-emerald-500 dark:fill-emerald-600" />

        {/* Total line */}
        <line x1={barLeft - 5} y1={barTop} x2={barLeft + barWidth + 5} y2={barTop} className="stroke-gray-600 dark:stroke-gray-300" strokeWidth="1.5" strokeDasharray="4,2" />

        {/* Labels */}
        <text x={barLeft + barWidth + 10} y={barBottom - keBarH / 2 + 4} className="fill-blue-600 dark:fill-blue-400" fontSize="10" fontWeight="600">
          KE
        </text>
        {peBarH > 10 && (
          <text x={barLeft + barWidth + 10} y={barBottom - keBarH - peBarH / 2 + 4} className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" fontWeight="600">
            PE
          </text>
        )}

        {/* Percentages inside bars */}
        {keBarH > 18 && (
          <text x={barLeft + barWidth / 2} y={barBottom - keBarH / 2 + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
            {Math.round(ke)}%
          </text>
        )}
        {peBarH > 18 && (
          <text x={barLeft + barWidth / 2} y={barBottom - keBarH - peBarH / 2 + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
            {Math.round(pe)}%
          </text>
        )}

        {/* Legend */}
        <rect x="380" y="60" width="12" height="12" rx="2" className="fill-blue-500 dark:fill-blue-600" />
        <text x="396" y="71" className="fill-gray-700 dark:fill-gray-300" fontSize="10">Kinetic Energy (motion)</text>

        <rect x="380" y="80" width="12" height="12" rx="2" className="fill-emerald-500 dark:fill-emerald-600" />
        <text x="396" y="91" className="fill-gray-700 dark:fill-gray-300" fontSize="10">Potential Energy (height)</text>

        <text x="380" y="115" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="700">
          Total = constant
        </text>

        {/* === Slider === */}
        <text x={sliderLeft} y={sliderTop + 6} className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="600">
          Move the ball:
        </text>
        <text x={sliderLeft} y={sliderTop + 22} className="fill-gray-500 dark:fill-gray-400" fontSize="10">Top</text>
        <text x={sliderLeft + sliderWidth} y={sliderTop + 22} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Bottom</text>

        {/* Slider track */}
        <rect x={sliderLeft + 30} y={sliderTop + 14} width={sliderWidth - 60} height="6" rx="3" className="fill-gray-200 dark:fill-gray-700" />

        {/* Slider filled portion */}
        <rect x={sliderLeft + 30} y={sliderTop + 14} width={(position / 100) * (sliderWidth - 60)} height="6" rx="3" className="fill-indigo-400 dark:fill-indigo-500" />

        {/* Slider thumb — interactive */}
        <circle
          cx={sliderLeft + 30 + (position / 100) * (sliderWidth - 60)}
          cy={sliderTop + 17}
          r="8"
          className="fill-indigo-500 dark:fill-indigo-400 stroke-white dark:stroke-gray-900 cursor-pointer"
          strokeWidth="2"
        />

        {/* Invisible wider hit area for the slider */}
        <rect
          x={sliderLeft + 30}
          y={sliderTop + 5}
          width={sliderWidth - 60}
          height="24"
          fill="transparent"
          className="cursor-pointer"
          onPointerDown={(e) => {
            const svg = (e.target as SVGElement).closest('svg')!;
            const pt = svg.createSVGPoint();
            const update = (clientX: number) => {
              pt.x = clientX;
              pt.y = 0;
              const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
              const raw = (svgP.x - (sliderLeft + 30)) / (sliderWidth - 60) * 100;
              setPosition(Math.max(0, Math.min(100, raw)));
            };
            update(e.clientX);

            const onMove = (ev: PointerEvent) => update(ev.clientX);
            const onUp = () => {
              window.removeEventListener('pointermove', onMove);
              window.removeEventListener('pointerup', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
          }}
        />
      </svg>
    </div>
  );
}
