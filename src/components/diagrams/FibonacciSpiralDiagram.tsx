const FibonacciSpiralDiagram = () => {
  // Fibonacci rectangles layout — built from bottom-left, growing outward
  // Numbers: 1, 1, 2, 3, 5, 8, 13
  // Scale factor to fit nicely
  const s = 12;

  // Rectangle positions (x, y, w, h) computed manually for the classic spiral layout
  // Starting with the two 1x1 squares and building out
  const rects: { x: number; y: number; w: number; h: number; n: number }[] = [
    { x: 5 * s, y: 5 * s, w: 1 * s, h: 1 * s, n: 1 },
    { x: 5 * s, y: 4 * s, w: 1 * s, h: 1 * s, n: 1 },
    { x: 3 * s, y: 4 * s, w: 2 * s, h: 2 * s, n: 2 },
    { x: 3 * s, y: 1 * s, w: 3 * s, h: 3 * s, n: 3 },
    { x: 6 * s, y: 1 * s, w: 5 * s, h: 5 * s, n: 5 },
    { x: 3 * s, y: 6 * s, w: 8 * s, h: 8 * s, n: 8 },
  ];

  // Offset the entire fibonacci group
  const ox = 15;
  const oy = 40;

  // The spiral path — quarter-circle arcs through each square
  // Each arc: from corner to corner of the square, curving through the center
  const spiralPath = [
    `M ${ox + 6 * s} ${oy + 6 * s}`,
    `A ${1 * s} ${1 * s} 0 0 1 ${ox + 5 * s} ${oy + 5 * s}`,
    `A ${1 * s} ${1 * s} 0 0 1 ${ox + 5 * s} ${oy + 4 * s}`,
    `A ${2 * s} ${2 * s} 0 0 1 ${ox + 3 * s} ${oy + 6 * s}`,
    `A ${3 * s} ${3 * s} 0 0 1 ${ox + 6 * s} ${oy + 1 * s}`,
    `A ${5 * s} ${5 * s} 0 0 1 ${ox + 11 * s} ${oy + 6 * s}`,
    `A ${8 * s} ${8 * s} 0 0 1 ${ox + 3 * s} ${oy + 14 * s}`,
  ].join(' ');

  // Total approximate length of the spiral path for animation
  const spiralLength = 580;

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 500 350"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Fibonacci spiral with golden ratio and nature examples"
      >
        <style>{`
          @keyframes drawSpiral {
            0% {
              stroke-dashoffset: ${spiralLength};
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .spiral-line {
            stroke-dasharray: ${spiralLength};
            stroke-dashoffset: ${spiralLength};
            animation: drawSpiral 3s ease-out forwards;
          }
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
          }
          .num-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
        `}</style>

        {/* Background */}
        <rect width="500" height="350" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Fibonacci rectangles */}
        {rects.map((r, i) => (
          <g key={i}>
            <rect
              x={ox + r.x} y={oy + r.y}
              width={r.w} height={r.h}
              className="fill-amber-50 dark:fill-amber-950 stroke-slate-400 dark:stroke-slate-500"
              strokeWidth="1" opacity="0.7"
            />
            <text
              x={ox + r.x + r.w / 2}
              y={oy + r.y + r.h / 2 + 4}
              textAnchor="middle"
              className="num-text fill-amber-700 dark:fill-amber-400"
            >
              {r.n}
            </text>
          </g>
        ))}

        {/* The big 13 rectangle (outer) */}
        <rect
          x={ox + (-10) * s} y={oy + 1 * s}
          width={13 * s} height={13 * s}
          className="fill-none stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="1" strokeDasharray="4 3"
        />
        <text
          x={ox + (-10) * s + 6.5 * s}
          y={oy + 1 * s + 6.5 * s + 4}
          textAnchor="middle"
          className="num-text fill-amber-600 dark:fill-amber-500"
          style={{ fontSize: '14px' }}
        >
          13
        </text>

        {/* Spiral curve */}
        <path
          d={spiralPath}
          fill="none"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="spiral-line dark:stroke-amber-400"
        />

        {/* -------- Right side: Nature examples -------- */}
        {/* Sunflower */}
        <g transform="translate(340, 60)">
          <text x="40" y="-8" textAnchor="middle"
            className="title-text fill-slate-700 dark:fill-slate-200">
            Sunflower
          </text>
          {/* Center */}
          <circle cx="40" cy="28" r="18"
            className="fill-amber-600 dark:fill-amber-700" />
          <circle cx="40" cy="28" r="12"
            className="fill-amber-800 dark:fill-amber-900" />
          {/* Spiral seed arcs — clockwise */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const r1 = 6;
            const r2 = 16;
            return (
              <line key={i}
                x1={40 + Math.cos(angle) * r1} y1={28 + Math.sin(angle) * r1}
                x2={40 + Math.cos(angle + 0.3) * r2} y2={28 + Math.sin(angle + 0.3) * r2}
                className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="0.8" />
            );
          })}
          {/* Petals */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <ellipse key={i}
                cx={40 + Math.cos(angle) * 26}
                cy={28 + Math.sin(angle) * 26}
                rx="6" ry="3"
                transform={`rotate(${i * 30}, ${40 + Math.cos(angle) * 26}, ${28 + Math.sin(angle) * 26})`}
                className="fill-yellow-400 dark:fill-yellow-600" opacity="0.7" />
            );
          })}
        </g>

        {/* Nautilus shell */}
        <g transform="translate(340, 155)">
          <text x="40" y="-8" textAnchor="middle"
            className="title-text fill-slate-700 dark:fill-slate-200">
            Nautilus
          </text>
          {/* Shell outline — a series of arcs forming a spiral */}
          <path
            d={`M 56 35
              A 4 4 0 0 1 52 31
              A 6 6 0 0 1 52 25
              A 10 10 0 0 1 42 15
              A 16 16 0 0 1 26 31
              A 22 22 0 0 1 48 47
              A 28 28 0 0 1 62 25`}
            fill="none"
            className="stroke-amber-600 dark:stroke-amber-400"
            strokeWidth="2" strokeLinecap="round"
          />
          {/* Chamber lines */}
          <path d="M 52 31 Q 48 28 46 22" fill="none"
            className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
          <path d="M 46 22 Q 38 20 32 26" fill="none"
            className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
          <path d="M 32 26 Q 30 35 36 42" fill="none"
            className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="1" />
        </g>

        {/* Pinecone top view */}
        <g transform="translate(340, 248)">
          <text x="40" y="-8" textAnchor="middle"
            className="title-text fill-slate-700 dark:fill-slate-200">
            Pinecone
          </text>
          {/* Center */}
          <circle cx="40" cy="26" r="4"
            className="fill-amber-800 dark:fill-amber-700" />
          {/* Spiral pattern — two sets of spirals */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a1 = (i * 45 * Math.PI) / 180;
            return (
              <ellipse key={`p1-${i}`}
                cx={40 + Math.cos(a1) * 10}
                cy={26 + Math.sin(a1) * 10}
                rx="4" ry="6"
                transform={`rotate(${i * 45 + 20}, ${40 + Math.cos(a1) * 10}, ${26 + Math.sin(a1) * 10})`}
                className="fill-amber-700 dark:fill-amber-600" opacity="0.6"
                stroke="#92400e" strokeWidth="0.5" />
            );
          })}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
            const a2 = (i * 27.7 * Math.PI) / 180;
            return (
              <ellipse key={`p2-${i}`}
                cx={40 + Math.cos(a2) * 20}
                cy={26 + Math.sin(a2) * 20}
                rx="5" ry="7"
                transform={`rotate(${i * 27.7 + 10}, ${40 + Math.cos(a2) * 20}, ${26 + Math.sin(a2) * 20})`}
                className="fill-amber-600 dark:fill-amber-700" opacity="0.5"
                stroke="#92400e" strokeWidth="0.5" />
            );
          })}
        </g>

        {/* Connecting bracket / arrow from spiral to nature */}
        <line x1="290" y1="175" x2="320" y2="175"
          className="stroke-amber-500 dark:stroke-amber-400"
          strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Bottom label — the sequence */}
        <text x="250" y="338" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300">
          1, 1, 2, 3, 5, 8, 13, 21... each number = sum of the previous two
        </text>
      </svg>
    </div>
  );
};

export default FibonacciSpiralDiagram;
