export default function SymmetryDiagram() {
  // Panel layout constants
  const panelW = 160;
  const gap = 20;
  const panelOffsets = [10, 10 + panelW + gap, 10 + 2 * (panelW + gap)];

  // Starfish arm helper
  const starfishArm = (cx: number, cy: number, angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    const tipX = cx + Math.cos(rad) * r;
    const tipY = cy + Math.sin(rad) * r;
    const leftRad = ((angle - 25) * Math.PI) / 180;
    const rightRad = ((angle + 25) * Math.PI) / 180;
    const baseR = r * 0.3;
    const lx = cx + Math.cos(leftRad) * baseR;
    const ly = cy + Math.sin(leftRad) * baseR;
    const rx = cx + Math.cos(rightRad) * baseR;
    const ry = cy + Math.sin(rightRad) * baseR;
    return `M ${cx},${cy} L ${lx},${ly} Q ${(lx + tipX) / 2 - 3},${(ly + tipY) / 2} ${tipX},${tipY} Q ${(rx + tipX) / 2 + 3},${(ry + tipY) / 2} ${rx},${ry} Z`;
  };

  // Pinwheel arm helper
  const pinwheelArm = (cx: number, cy: number, angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    const curveRad = ((angle + 40) * Math.PI) / 180;
    const tipX = cx + Math.cos(rad) * r;
    const tipY = cy + Math.sin(rad) * r;
    const cpX = cx + Math.cos(curveRad) * r * 0.7;
    const cpY = cy + Math.sin(curveRad) * r * 0.7;
    return `M ${cx},${cy} Q ${cpX},${cpY} ${tipX},${tipY}`;
  };

  const starCx = panelOffsets[1] + panelW / 2;
  const starCy = 105;
  const starR = 50;

  const pinCx = panelOffsets[2] + panelW / 2;
  const pinCy = 105;
  const pinR = 48;

  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <svg
        viewBox="0 0 560 260"
        className="w-full"
        role="img"
        aria-label="Types of symmetry in biology: bilateral, radial, and rotational"
      >
        {/* ===== Panel 1: Bilateral Symmetry (Butterfly) ===== */}
        <g>
          {/* Left wing */}
          <path
            d={`M ${panelOffsets[0] + 80},85
                C ${panelOffsets[0] + 40},55 ${panelOffsets[0] + 15},60 ${panelOffsets[0] + 20},90
                C ${panelOffsets[0] + 15},110 ${panelOffsets[0] + 35},130 ${panelOffsets[0] + 80},120 Z`}
            fill="#c4b5fd"
            stroke="#8b5cf6"
            strokeWidth="1.5"
          />
          {/* Right wing */}
          <path
            d={`M ${panelOffsets[0] + 80},85
                C ${panelOffsets[0] + 120},55 ${panelOffsets[0] + 145},60 ${panelOffsets[0] + 140},90
                C ${panelOffsets[0] + 145},110 ${panelOffsets[0] + 125},130 ${panelOffsets[0] + 80},120 Z`}
            fill="#c4b5fd"
            stroke="#8b5cf6"
            strokeWidth="1.5"
          />
          {/* Body */}
          <ellipse
            cx={panelOffsets[0] + 80}
            cy={102}
            rx={4}
            ry={22}
            fill="#7c3aed"
          />
          {/* Antennae */}
          <path
            d={`M ${panelOffsets[0] + 78},82 Q ${panelOffsets[0] + 65},60 ${panelOffsets[0] + 60},55`}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx={panelOffsets[0] + 59} cy={54} r={2} fill="#7c3aed" />
          <path
            d={`M ${panelOffsets[0] + 82},82 Q ${panelOffsets[0] + 95},60 ${panelOffsets[0] + 100},55`}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx={panelOffsets[0] + 101} cy={54} r={2} fill="#7c3aed" />
          {/* Wing markings */}
          <circle cx={panelOffsets[0] + 52} cy={92} r={8} fill="#a78bfa" opacity={0.6} />
          <circle cx={panelOffsets[0] + 108} cy={92} r={8} fill="#a78bfa" opacity={0.6} />
          {/* Dashed axis */}
          <line
            x1={panelOffsets[0] + 80}
            y1={42}
            x2={panelOffsets[0] + 80}
            y2={145}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="5,4"
          />
          {/* Title */}
          <text
            x={panelOffsets[0] + 80}
            y={170}
            textAnchor="middle"
            className="fill-gray-800 dark:fill-gray-100"
            fontSize="13"
            fontWeight="bold"
          >
            Bilateral
          </text>
          {/* Example */}
          <text
            x={panelOffsets[0] + 80}
            y={186}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize="11"
          >
            Butterfly, Human face
          </text>
        </g>

        {/* ===== Panel 2: Radial Symmetry (Starfish) ===== */}
        <g>
          {/* Five arms */}
          {[270, 342, 54, 126, 198].map((angle, i) => (
            <path
              key={i}
              d={starfishArm(starCx, starCy, angle, starR)}
              fill="#fdba74"
              stroke="#f97316"
              strokeWidth="1.2"
            />
          ))}
          {/* Center dot */}
          <circle cx={starCx} cy={starCy} r={8} fill="#fb923c" />
          {/* Small dots on arms */}
          {[270, 342, 54, 126, 198].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={`dot-${i}`}
                cx={starCx + Math.cos(rad) * starR * 0.55}
                cy={starCy + Math.sin(rad) * starR * 0.55}
                r={3}
                fill="#fed7aa"
              />
            );
          })}
          {/* Five dashed axes */}
          {[270, 342, 54, 126, 198].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const oppRad = ((angle + 180) * Math.PI) / 180;
            const lineR = starR + 12;
            return (
              <line
                key={`axis-${i}`}
                x1={starCx + Math.cos(rad) * lineR}
                y1={starCy + Math.sin(rad) * lineR}
                x2={starCx + Math.cos(oppRad) * lineR}
                y2={starCy + Math.sin(oppRad) * lineR}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4,3"
              />
            );
          })}
          {/* Title */}
          <text
            x={starCx}
            y={170}
            textAnchor="middle"
            className="fill-gray-800 dark:fill-gray-100"
            fontSize="13"
            fontWeight="bold"
          >
            Radial
          </text>
          {/* Example */}
          <text
            x={starCx}
            y={186}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize="11"
          >
            Starfish, Flower
          </text>
        </g>

        {/* ===== Panel 3: Rotational Symmetry (Pinwheel) ===== */}
        <g>
          {/* Four curved arms */}
          {[0, 90, 180, 270].map((angle, i) => (
            <path
              key={i}
              d={pinwheelArm(pinCx, pinCy, angle, pinR)}
              fill="none"
              stroke="#5eead4"
              strokeWidth="10"
              strokeLinecap="round"
              opacity={0.7 + i * 0.07}
            />
          ))}
          {/* Filled blade shapes */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad1 = (angle * Math.PI) / 180;
            const rad2 = ((angle + 40) * Math.PI) / 180;
            const tipX = pinCx + Math.cos(rad1) * pinR;
            const tipY = pinCy + Math.sin(rad1) * pinR;
            const cpX = pinCx + Math.cos(rad2) * pinR * 0.7;
            const cpY = pinCy + Math.sin(rad2) * pinR * 0.7;
            const innerRad = ((angle + 90) * Math.PI) / 180;
            const innerX = pinCx + Math.cos(innerRad) * 8;
            const innerY = pinCy + Math.sin(innerRad) * 8;
            return (
              <path
                key={`blade-${i}`}
                d={`M ${pinCx},${pinCy} Q ${cpX},${cpY} ${tipX},${tipY} L ${innerX},${innerY} Z`}
                fill="#99f6e4"
                stroke="#14b8a6"
                strokeWidth="0.8"
                opacity={0.6}
              />
            );
          })}
          {/* Center circle */}
          <circle cx={pinCx} cy={pinCy} r={6} fill="#14b8a6" />
          {/* Rotation arrow */}
          <path
            d={`M ${pinCx + 22},${pinCy - 18}
                A 28,28 0 0,1 ${pinCx + 28},${pinCy + 5}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4,3"
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
              <polygon points="0,0 6,2.5 0,5" fill="#94a3b8" />
            </marker>
          </defs>
          {/* Title */}
          <text
            x={pinCx}
            y={170}
            textAnchor="middle"
            className="fill-gray-800 dark:fill-gray-100"
            fontSize="13"
            fontWeight="bold"
          >
            Rotational
          </text>
          {/* Example */}
          <text
            x={pinCx}
            y={186}
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400"
            fontSize="11"
          >
            Pinwheel, Galaxy
          </text>
        </g>

        {/* Overall title */}
        <text
          x={280}
          y={220}
          textAnchor="middle"
          className="fill-gray-700 dark:fill-gray-200"
          fontSize="14"
          fontWeight="bold"
        >
          Types of Symmetry in Biology
        </text>
        <text
          x={280}
          y={238}
          textAnchor="middle"
          className="fill-gray-400 dark:fill-gray-500"
          fontSize="10"
        >
          Dashed lines show axes or direction of symmetry
        </text>
      </svg>
    </div>
  );
}
