export default function SineWaveDiagram() {
  // Generate sine wave points
  const points80 = Array.from({ length: 200 }, (_, i) => {
    const t = i / 200;
    const y = Math.sin(2 * Math.PI * 3 * t); // 3 visible cycles
    return { x: 40 + i * 2.6, y: 80 - y * 35 };
  });

  const points200 = Array.from({ length: 200 }, (_, i) => {
    const t = i / 200;
    const y = Math.sin(2 * Math.PI * 8 * t); // 8 visible cycles
    return { x: 40 + i * 2.6, y: 190 - y * 35 };
  });

  const pathStr = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox="0 0 600 280" className="w-full max-w-xl mx-auto my-6" role="img" aria-label="Annotated sine wave showing frequency, amplitude, and period">

      {/* === Low frequency wave === */}
      <text x="300" y="18" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="11" fontWeight="600">
        Same time, different frequencies
      </text>

      {/* Axis */}
      <line x1="40" y1="80" x2="560" y2="80" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,4" />
      <text x="30" y="84" textAnchor="end" className="fill-gray-400" fontSize="9">0</text>

      {/* Wave */}
      <path d={pathStr(points80)} fill="none" className="stroke-emerald-500" strokeWidth="2.5" />

      {/* Amplitude annotation */}
      <line x1="128" y1="45" x2="128" y2="80" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
      <line x1="128" y1="80" x2="128" y2="115" className="stroke-amber-500" strokeWidth="1.5" markerEnd="url(#arrowDown)" />
      <text x="145" y="55" className="fill-amber-600 dark:fill-amber-400" fontSize="10" fontWeight="600">amplitude</text>

      {/* One cycle bracket */}
      <line x1="40" y1="125" x2="213" y2="125" className="stroke-sky-500" strokeWidth="1.5" />
      <line x1="40" y1="120" x2="40" y2="130" className="stroke-sky-500" strokeWidth="1.5" />
      <line x1="213" y1="120" x2="213" y2="130" className="stroke-sky-500" strokeWidth="1.5" />
      <text x="127" y="138" textAnchor="middle" className="fill-sky-600 dark:fill-sky-400" fontSize="10" fontWeight="600">1 cycle = 1 period</text>

      {/* Label */}
      <text x="560" y="72" textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="700">80 Hz</text>
      <text x="560" y="84" textAnchor="end" className="fill-gray-400" fontSize="9">3 cycles shown</text>

      {/* === High frequency wave === */}
      <line x1="40" y1="190" x2="560" y2="190" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="1" strokeDasharray="4,4" />

      <path d={pathStr(points200)} fill="none" className="stroke-rose-500" strokeWidth="2.5" />

      {/* Label */}
      <text x="560" y="182" textAnchor="end" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontWeight="700">200 Hz</text>
      <text x="560" y="194" textAnchor="end" className="fill-gray-400" fontSize="9">8 cycles shown</text>

      {/* Summary */}
      <text x="300" y="245" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11">
        Higher frequency = more cycles per second = tighter wave
      </text>
      <text x="300" y="262" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        80 Hz = calm elephant | 200 Hz = way above elephant range
      </text>

      {/* Arrow marker */}
      <defs>
        <marker id="arrowDown" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,0 L5,10 Z" className="fill-amber-500" />
        </marker>
      </defs>
    </svg>
  );
}
