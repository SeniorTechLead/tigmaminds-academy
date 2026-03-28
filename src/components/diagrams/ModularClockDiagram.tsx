export default function ModularClockDiagram() {
  const cx = 175, cy = 175, r = 130;
  const numbers = Array.from({ length: 12 }, (_, i) => i);

  const posForNum = (n: number) => {
    const angle = ((n - 3) * 30 * Math.PI) / 180;
    return {
      x: cx + Math.cos(angle) * (r - 20),
      y: cy + Math.sin(angle) * (r - 20),
    };
  };

  // Arc path from number 7 counting 8 steps clockwise to 3
  const traceNumbers = [7, 8, 9, 10, 11, 0, 1, 2, 3];
  const tracePoints = traceNumbers.map(n => posForNum(n));

  return (
    <div className="my-4">
      <svg viewBox="0 0 350 350" className="w-full max-w-md mx-auto" role="img" aria-label="Modular arithmetic clock showing 7 plus 8 equals 3 mod 12">
        {/* Clock face */}
        <circle cx={cx} cy={cy} r={r} fill="none" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r - 2} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="1" />

        {/* Tick marks */}
        {numbers.map(n => {
          const angle = ((n - 3) * 30 * Math.PI) / 180;
          const x1 = cx + Math.cos(angle) * (r - 5);
          const y1 = cy + Math.sin(angle) * (r - 5);
          const x2 = cx + Math.cos(angle) * r;
          const y2 = cy + Math.sin(angle) * r;
          return <line key={`t${n}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="2" />;
        })}

        {/* Numbers */}
        {numbers.map(n => {
          const pos = posForNum(n);
          const isStart = n === 7;
          const isEnd = n === 3;
          const isOnPath = traceNumbers.includes(n) && !isStart && !isEnd;
          let colorClass = "fill-gray-600 dark:fill-gray-300";
          if (isStart) colorClass = "fill-blue-600 dark:fill-blue-400";
          if (isEnd) colorClass = "fill-emerald-600 dark:fill-emerald-400";
          if (isOnPath && !isEnd) colorClass = "fill-amber-500 dark:fill-amber-400";
          return (
            <text key={n} x={pos.x} y={pos.y + 5} textAnchor="middle" className={colorClass} fontSize="16" fontWeight={isStart || isEnd ? "bold" : "normal"}>
              {n}
            </text>
          );
        })}

        {/* Highlight circle around 7 (start) */}
        {(() => { const p = posForNum(7); return <circle cx={p.x} cy={p.y} r="14" fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />; })()}
        {/* Highlight circle around 3 (end) */}
        {(() => { const p = posForNum(3); return <circle cx={p.x} cy={p.y} r="14" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" />; })()}

        {/* Trace arc from 7 to 3 (clockwise, 8 steps) */}
        {/* Using a large arc from 7 position to 3 position */}
        {(() => {
          const startAngle = (7 - 3) * 30; // degrees
          const endAngle = (3 - 3) * 30; // degrees
          const arcR = r - 42;
          const sa = (startAngle * Math.PI) / 180;
          const ea = (endAngle * Math.PI) / 180;
          const x1 = cx + Math.cos(sa) * arcR;
          const y1 = cy + Math.sin(sa) * arcR;
          const x2 = cx + Math.cos(ea) * arcR;
          const y2 = cy + Math.sin(ea) * arcR;
          return (
            <path
              d={`M ${x1},${y1} A ${arcR},${arcR} 0 1,1 ${x2},${y2}`}
              fill="none" className="stroke-red-400 dark:stroke-red-300" strokeWidth="2.5" strokeDasharray="6,3"
              markerEnd="url(#clockArrow)"
            />
          );
        })()}

        {/* Step count labels */}
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="11" fontWeight="600">+8 steps</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-red-500 dark:fill-red-400" fontSize="11">clockwise</text>

        {/* Formula */}
        <text x={cx} y={cy + r + 30} textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">
          7 + 8 = 15 = 3 (mod 12)
        </text>
        <text x={cx} y={cy + r + 48} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11">
          Start at 7, count 8 positions → land on 3
        </text>

        <defs>
          <marker id="clockArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-red-400 dark:fill-red-300" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
