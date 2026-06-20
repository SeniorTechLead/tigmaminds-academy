/**
 * A small multi-layer perceptron: input layer → hidden layer → output layer,
 * fully connected, learning a non-linear boundary.
 *
 * Used in the "Training a Simple Neural Network" section.
 */
export default function MLNeuralNetDiagram() {
  const W = 700, H = 340;
  const layers = [
    { x: 150, n: 3, label: 'Inputs', sub: 'features', color: '#3b82f6' },
    { x: 350, n: 4, label: 'Hidden', sub: 'learns combos', color: '#8b5cf6' },
    { x: 550, n: 3, label: 'Outputs', sub: 'calm/nervous/danger', color: '#f97316' },
  ];
  const topY = 110, gap = 55;
  const nodeY = (layer) => Array.from({ length: layer.n }, (_, i) => topY + i * gap + (4 - layer.n) * gap / 2);

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A neural network with three input nodes fully connected to a four-node hidden layer, then to three output nodes for calm, nervous, and danger.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">Layers of neurons learn non-linear patterns</text>

        {/* connections */}
        {(() => {
          const lines = [];
          for (let li = 0; li < layers.length - 1; li++) {
            const a = nodeY(layers[li]), b = nodeY(layers[li + 1]);
            a.forEach((ya, i) => b.forEach((yb, j) => {
              lines.push(<line key={`${li}-${i}-${j}`} x1={layers[li].x} y1={ya} x2={layers[li + 1].x} y2={yb} stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-gray-600" />);
            }));
          }
          return lines;
        })()}

        {/* nodes + labels */}
        {layers.map((layer, li) => (
          <g key={li}>
            <text x={layer.x} y="72" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" className="dark:fill-gray-200">{layer.label}</text>
            <text x={layer.x} y="320" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">{layer.sub}</text>
            {nodeY(layer).map((y, i) => (
              <circle key={i} cx={layer.x} cy={y} r="14" fill="#ffffff" stroke={layer.color} strokeWidth="2.5" className="dark:fill-gray-800" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
