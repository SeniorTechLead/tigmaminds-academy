import { useState } from 'react';

export default function AreaUnderCurveDiagram() {
  const [numRects, setNumRects] = useState(4);
  const rectOptions = [4, 8, 16, 32];

  // Graph area
  const gx = 60;
  const gy = 20;
  const gw = 340;
  const gh = 250;
  const maxX = 3;
  const maxY = 9; // 3² = 9

  const toSvgX = (x: number) => gx + (x / maxX) * gw;
  const toSvgY = (y: number) => gy + gh - (y / maxY) * gh;

  // Curve points for y = x²
  const curvePoints: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * maxX;
    const y = x * x;
    curvePoints.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  const curvePath = 'M ' + curvePoints.join(' L ');

  // Riemann rectangles (left sum)
  const dx = maxX / numRects;
  const rects = [];
  let sum = 0;
  for (let i = 0; i < numRects; i++) {
    const x = i * dx;
    const y = x * x;
    sum += y * dx;
    rects.push({ x, y, dx });
  }

  const trueArea = 9; // integral of x² from 0 to 3 = 27/3 = 9

  return (
    <div className="my-4">
      <svg viewBox="0 0 480 367" className="w-full max-w-lg mx-auto" role="img" aria-label="Area under curve with Riemann sum">
        {/* Axes */}
        <line x1={gx} y1={gy} x2={gx} y2={gy + gh} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />
        <line x1={gx} y1={gy + gh} x2={gx + gw} y2={gy + gh} className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1.5" />

        {/* Axis labels */}
        <text x={gx + gw / 2} y={gy + gh + 35} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">x</text>
        <text x={gx - 30} y={gy + gh / 2} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11"
          transform={`rotate(-90, ${gx - 30}, ${gy + gh / 2})`}>y = x²</text>

        {/* X tick marks */}
        {[0, 1, 2, 3].map(v => (
          <g key={v}>
            <line x1={toSvgX(v)} y1={gy + gh} x2={toSvgX(v)} y2={gy + gh + 5} className="stroke-gray-500" strokeWidth="1" />
            <text x={toSvgX(v)} y={gy + gh + 18} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{v}</text>
          </g>
        ))}

        {/* Y tick marks */}
        {[0, 3, 6, 9].map(v => (
          <g key={v}>
            <line x1={gx - 5} y1={toSvgY(v)} x2={gx} y2={toSvgY(v)} className="stroke-gray-500" strokeWidth="1" />
            <text x={gx - 10} y={toSvgY(v) + 4} textAnchor="end" className="fill-gray-500 dark:fill-gray-400" fontSize="10">{v}</text>
          </g>
        ))}

        {/* Riemann rectangles */}
        {rects.map((r, i) => (
          <rect key={i}
            x={toSvgX(r.x)}
            y={toSvgY(r.y)}
            width={(r.dx / maxX) * gw}
            height={(r.y / maxY) * gh}
            className="fill-blue-300 dark:fill-blue-600 stroke-blue-500 dark:stroke-blue-400"
            strokeWidth="0.5" opacity="0.6" />
        ))}

        {/* Curve */}
        <path d={curvePath} fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />

        {/* Rectangle count selector */}
        {rectOptions.map((n, i) => {
          const bx = 70 + i * 70;
          const by = 310;
          const isActive = n === numRects;
          return (
            <g key={n} className="cursor-pointer" onClick={() => setNumRects(n)}>
              <rect x={bx} y={by} width="50" height="24" rx="6"
                className={isActive ? 'fill-blue-500 dark:fill-blue-600' : 'fill-gray-200 dark:fill-gray-700 stroke-gray-400'}
                strokeWidth={isActive ? 0 : 1} />
              <text x={bx + 25} y={by + 16} textAnchor="middle"
                className={isActive ? 'fill-white' : 'fill-gray-600 dark:fill-gray-300'} fontSize="11" fontWeight="bold">
                n={n}
              </text>
            </g>
          );
        })}

        {/* Results */}
        <text x={gx + gw + 5} y={gy + 50} className="fill-gray-600 dark:fill-gray-300" fontSize="10" textAnchor="end">
          Rectangles: {numRects}
        </text>
        <text x={gx + gw + 5} y={gy + 68} className="fill-blue-600 dark:fill-blue-400" fontSize="10" textAnchor="end">
          Sum ≈ {sum.toFixed(2)}
        </text>
        <text x={gx + gw + 5} y={gy + 86} className="fill-red-600 dark:fill-red-400" fontSize="10" textAnchor="end">
          True area = {trueArea}
        </text>
        <text x={gx + gw + 5} y={gy + 104} className="fill-gray-500 dark:fill-gray-400" fontSize="10" textAnchor="end">
          Error: {(trueArea - sum).toFixed(2)}
        </text>

        {/* Label */}
        <text x={350} y={325} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          ← Click to change rectangles
        </text>
      </svg>
    </div>
  );
}
