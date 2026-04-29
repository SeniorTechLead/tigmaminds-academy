import { useState } from "react";

export default function TangentLineDiagram() {
  const [xPos, setXPos] = useState(1.5);
  const [secDist, setSecDist] = useState(1.5);

  /* Coordinate system mapping */
  const xMin = -2.5, xMax = 3, yMin = -1, yMax = 7;
  const vw = 440, vh = 400;
  const padL = 40, padR = 20, padT = 20, padB = 40;
  const plotW = vw - padL - padR;
  const plotH = vh - padT - padB;

  const toSvgX = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => padT + ((yMax - y) / (yMax - yMin)) * plotH;

  /* f(x) = x² */
  const f = (x: number) => x * x;
  const fPrime = (x: number) => 2 * x;

  /* Build curve path */
  const curvePoints: string[] = [];
  for (let x = xMin; x <= xMax; x += 0.05) {
    const y = f(x);
    if (y >= yMin && y <= yMax) {
      curvePoints.push(`${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
  }
  const curvePath = "M " + curvePoints.join(" L ");

  /* Point on the curve */
  const px = xPos;
  const py = f(px);
  const slope = fPrime(px);

  /* Tangent line: y - py = slope * (x - px) → draw from xMin to xMax clipped */
  const tangentY = (x: number) => py + slope * (x - px);
  const tX1 = xMin, tX2 = xMax;
  const tY1 = tangentY(tX1), tY2 = tangentY(tX2);

  /* Secant line: from (px, py) to (px + secDist, f(px + secDist)) */
  const sx2 = px + secDist;
  const sy2 = f(sx2);
  const secantSlope = secDist !== 0 ? (sy2 - py) / secDist : slope;
  /* Extend secant line across the plot */
  const secantY = (x: number) => py + secantSlope * (x - px);
  const sLineX1 = xMin, sLineX2 = xMax;

  /* Axis tick values */
  const xTicks = [-2, -1, 0, 1, 2, 3].filter((v) => v >= xMin && v <= xMax);
  const yTicks = [0, 1, 2, 3, 4, 5, 6].filter((v) => v >= yMin && v <= yMax);

  return (
    <div className="my-4">
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        className="w-full max-w-2xl mx-auto"
        role="img"
        aria-label={`Tangent and secant lines on y=x² at x=${px.toFixed(1)}`}
      >
        {/* Grid lines */}
        {xTicks.map((v) => (
          <line
            key={`gx-${v}`}
            x1={toSvgX(v)}
            y1={padT}
            x2={toSvgX(v)}
            y2={vh - padB}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="0.5"
          />
        ))}
        {yTicks.map((v) => (
          <line
            key={`gy-${v}`}
            x1={padL}
            y1={toSvgY(v)}
            x2={vw - padR}
            y2={toSvgY(v)}
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="0.5"
          />
        ))}

        {/* Axes */}
        <line x1={toSvgX(xMin)} y1={toSvgY(0)} x2={toSvgX(xMax)} y2={toSvgY(0)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <line x1={toSvgX(0)} y1={toSvgY(yMin)} x2={toSvgX(0)} y2={toSvgY(yMax)} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />

        {/* Axis tick labels */}
        {xTicks.map((v) => (
          <text key={`xt-${v}`} x={toSvgX(v)} y={toSvgY(0) + 14} textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-gray-400">{v}</text>
        ))}
        {yTicks.filter((v) => v !== 0).map((v) => (
          <text key={`yt-${v}`} x={toSvgX(0) - 8} y={toSvgY(v) + 4} textAnchor="end" fontSize="10" className="fill-gray-500 dark:fill-gray-400">{v}</text>
        ))}

        {/* Axis labels */}
        <text x={vw - padR + 4} y={toSvgY(0) + 4} fontSize="12" className="fill-gray-500 dark:fill-gray-400">x</text>
        <text x={toSvgX(0) + 6} y={padT - 4} fontSize="12" className="fill-gray-500 dark:fill-gray-400">y</text>

        {/* Clip for lines */}
        <defs>
          <clipPath id="tl-plot-area">
            <rect x={padL} y={padT} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* Secant line (draw first, behind tangent) */}
        <line
          x1={toSvgX(sLineX1)}
          y1={toSvgY(secantY(sLineX1))}
          x2={toSvgX(sLineX2)}
          y2={toSvgY(secantY(sLineX2))}
          className="stroke-orange-400 dark:stroke-orange-500"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          clipPath="url(#tl-plot-area)"
        />

        {/* Tangent line */}
        <line
          x1={toSvgX(tX1)}
          y1={toSvgY(tY1)}
          x2={toSvgX(tX2)}
          y2={toSvgY(tY2)}
          className="stroke-red-500 dark:stroke-red-400"
          strokeWidth="2"
          clipPath="url(#tl-plot-area)"
        />

        {/* Curve y = x² */}
        <path
          d={curvePath}
          className="fill-none stroke-blue-500 dark:stroke-blue-400"
          strokeWidth="2.5"
          clipPath="url(#tl-plot-area)"
        />

        {/* Curve label */}
        <text
          x={toSvgX(2.2)}
          y={toSvgY(f(2.2)) - 8}
          fontSize="12"
          fontWeight="bold"
          className="fill-blue-600 dark:fill-blue-300"
        >
          y = x²
        </text>

        {/* Second point (secant) */}
        {secDist > 0.05 && (
          <>
            <circle cx={toSvgX(sx2)} cy={toSvgY(sy2)} r="4" className="fill-orange-500 dark:fill-orange-400" />
            <text
              x={toSvgX(sx2) + 8}
              y={toSvgY(sy2) - 8}
              fontSize="10"
              className="fill-orange-600 dark:fill-orange-400"
            >
              Q
            </text>
          </>
        )}

        {/* Main point on curve */}
        <circle cx={toSvgX(px)} cy={toSvgY(py)} r="5" className="fill-emerald-500 dark:fill-emerald-400" />
        <text
          x={toSvgX(px) - 10}
          y={toSvgY(py) - 10}
          fontSize="11"
          fontWeight="bold"
          className="fill-emerald-700 dark:fill-emerald-300"
        >
          P
        </text>

        {/* Legend */}
        <line x1={padL + 10} y1={vh - 14} x2={padL + 30} y2={vh - 14} className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" />
        <text x={padL + 34} y={vh - 10} fontSize="10" className="fill-gray-600 dark:fill-gray-400">
          Tangent (slope = {slope.toFixed(2)})
        </text>
        <line x1={padL + 190} y1={vh - 14} x2={padL + 210} y2={vh - 14} className="stroke-orange-400 dark:stroke-orange-500" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x={padL + 214} y={vh - 10} fontSize="10" className="fill-gray-600 dark:fill-gray-400">
          Secant (slope = {secantSlope.toFixed(2)})
        </text>
      </svg>

      {/* Controls */}
      <div className="mt-3 space-y-2 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 w-28 shrink-0">
            Point x = {xPos.toFixed(1)}
          </label>
          <input
            type="range"
            min="-2"
            max="2.5"
            step="0.1"
            value={xPos}
            onChange={(e) => setXPos(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 w-28 shrink-0">
            Secant gap = {secDist.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.05"
            max="2"
            step="0.05"
            value={secDist}
            onChange={(e) => setSecDist(parseFloat(e.target.value))}
            className="flex-1 accent-orange-500"
          />
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
        f'({xPos.toFixed(1)}) = {slope.toFixed(2)}
        {" | "}
        As Q approaches P, secant slope ({secantSlope.toFixed(2)}) approaches tangent slope ({slope.toFixed(2)})
      </p>
    </div>
  );
}
