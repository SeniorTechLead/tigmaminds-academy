export default function RavanaNeuralNetDiagram() {
  const layers = [
    { label: 'Input', count: 4, x: 70, color: '#60a5fa' },
    { label: 'Hidden 1', count: 6, x: 180, color: '#a78bfa' },
    { label: 'Hidden 2', count: 6, x: 290, color: '#c084fc' },
    { label: 'Output', count: 3, x: 400, color: '#34d399' },
  ];

  const getY = (count: number, i: number) => {
    const spacing = 40;
    const start = 180 - ((count - 1) * spacing) / 2;
    return start + i * spacing;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 480 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Neural network diagram with input layer, two hidden layers, and output layer connected by weighted lines"
      >
        <rect width="480" height="380" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="240" y="26" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Neural Network — How AI Mimics the Brain
        </text>

        {/* Connections between layers */}
        {layers.slice(0, -1).map((layer, li) => {
          const nextLayer = layers[li + 1];
          const lines: JSX.Element[] = [];
          for (let i = 0; i < layer.count; i++) {
            for (let j = 0; j < nextLayer.count; j++) {
              lines.push(
                <line
                  key={`${li}-${i}-${j}`}
                  x1={layer.x} y1={getY(layer.count, i)}
                  x2={nextLayer.x} y2={getY(nextLayer.count, j)}
                  stroke="#94a3b8" strokeWidth="0.6" opacity="0.4"
                />
              );
            }
          }
          return <g key={li}>{lines}</g>;
        })}

        {/* Nodes */}
        {layers.map((layer, li) => (
          <g key={li}>
            {Array.from({ length: layer.count }, (_, i) => (
              <circle key={i} cx={layer.x} cy={getY(layer.count, i)} r="12"
                fill={layer.color} opacity="0.85" stroke="white" strokeWidth="1.5" />
            ))}
            <text x={layer.x} y={getY(layer.count, layer.count - 1) + 35}
              textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize="10" fontWeight="600" className="fill-slate-600 dark:fill-slate-300">
              {layer.label}
            </text>
          </g>
        ))}

        {/* Input labels */}
        {['Eye', 'Ear', 'Touch', 'Smell'].map((s, i) => (
          <text key={i} x={40} y={getY(4, i) + 4} textAnchor="end" fontFamily="system-ui, sans-serif"
            fontSize="8" className="fill-slate-400 dark:fill-slate-500">{s}</text>
        ))}

        {/* Output labels */}
        {['Fight', 'Flee', 'Ignore'].map((s, i) => (
          <text key={i} x={430} y={getY(3, i) + 4} fontFamily="system-ui, sans-serif"
            fontSize="8" className="fill-slate-400 dark:fill-slate-500">{s}</text>
        ))}

        {/* Weight annotation */}
        <line x1="130" y1="105" x2="175" y2="85" stroke="#f59e0b" strokeWidth="2" />
        <text x="165" y="78" fontFamily="system-ui, sans-serif" fontSize="9"
          fontWeight="600" className="fill-amber-500 dark:fill-amber-400">weight = 0.7</text>
        <text x="165" y="69" fontFamily="system-ui, sans-serif" fontSize="8"
          className="fill-slate-400 dark:fill-slate-500">← each line has a weight</text>

        {/* Bottom explanation */}
        <rect x="30" y="310" width="420" height="55" rx="8"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="240" y="330" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-amber-700 dark:fill-amber-200">
          Like Ravana's Ten Heads Working Together
        </text>
        <text x="240" y="346" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-600 dark:fill-slate-300">
          Each node processes input and passes a signal forward — just like neurons.
        </text>
        <text x="240" y="359" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-600 dark:fill-slate-300">
          Training adjusts the weights — the network learns from mistakes.
        </text>
      </svg>
    </div>
  );
}
