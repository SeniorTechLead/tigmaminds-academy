export default function PlotAnatomyDiagram() {
  // Simple sine wave for the plot
  const points = Array.from({ length: 100 }, (_, i) => {
    const t = i / 100;
    const y = Math.sin(2 * Math.PI * 3 * t);
    return { x: 80 + t * 400, y: 110 - y * 50 };
  });

  const pathStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox="0 0 600 230" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Anatomy of a plot: axes, labels, title, and data line">
      <text x="300" y="16" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        Anatomy of a plot — what plt.plot() creates
      </text>

      {/* Plot background */}
      <rect x="80" y="30" width="400" height="160" rx="4" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" />

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line key={`vgrid-${i}`} x1={80 + i * 100} y1="30" x2={80 + i * 100} y2="190" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
      ))}
      <line x1="80" y1="110" x2="480" y2="110" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4,4" />

      {/* Data line */}
      <path d={pathStr} fill="none" className="stroke-emerald-500" strokeWidth="2.5" />

      {/* Title annotation */}
      <g>
        <text x="280" y="46" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="12" fontWeight="bold">plt.title()</text>
        <line x1="280" y1="48" x2="280" y2="55" className="stroke-amber-400" strokeWidth="1" />
        <circle cx="280" cy="55" r="2" className="fill-amber-400" />
      </g>

      {/* Y-axis label */}
      <g>
        <text x="30" y="115" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600" transform="rotate(-90, 30, 115)">plt.ylabel()</text>
        <line x1="55" y1="110" x2="75" y2="110" className="stroke-amber-400" strokeWidth="1" markerEnd="url(#arrowR)" />
      </g>

      {/* X-axis label */}
      <g>
        <text x="280" y="208" textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">plt.xlabel()</text>
        <line x1="280" y1="195" x2="280" y2="200" className="stroke-amber-400" strokeWidth="1" />
      </g>

      {/* Data line annotation */}
      <g>
        <line x1="350" y1="75" x2="400" y2="55" className="stroke-amber-400" strokeWidth="1" />
        <text x="403" y="52" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">plt.plot(x, y)</text>
        <text x="403" y="64" className="fill-gray-400" fontSize="8">your data as a line</text>
      </g>

      {/* X tick values */}
      <text x="80" y="202" textAnchor="middle" className="fill-gray-400" fontSize="8">0</text>
      <text x="280" y="202" textAnchor="middle" className="fill-gray-400" fontSize="8">0.5</text>
      <text x="480" y="202" textAnchor="middle" className="fill-gray-400" fontSize="8">1.0</text>

      {/* Y tick values */}
      <text x="73" y="64" textAnchor="end" className="fill-gray-400" fontSize="8">1.0</text>
      <text x="73" y="114" textAnchor="end" className="fill-gray-400" fontSize="8">0</text>
      <text x="73" y="192" textAnchor="end" className="fill-gray-400" fontSize="8">-1.0</text>

      {/* plt.show() annotation */}
      <text x="300" y="225" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        plt.show() renders the chart — without it, nothing appears
      </text>

      <defs>
        <marker id="arrowR" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" className="fill-amber-400" />
        </marker>
      </defs>
    </svg>
  );
}
