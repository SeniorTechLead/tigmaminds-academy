export default function ElephantPerceptronDiagram() {
  // Layout
  const inputX = 80;
  const neuronX = 300;
  const outputX = 480;
  const midY = 130;
  const inputSpacing = 70;
  const input1Y = midY - inputSpacing / 2;
  const input2Y = midY + inputSpacing / 2;

  return (
    <svg
      viewBox="0 0 630 362"
      className="w-full max-w-2xl mx-auto my-4"
      role="img"
      aria-label="Perceptron diagram: two inputs with weights feed into a summation neuron that outputs elephant or bird classification"
    >
      {/* Dark background */}
      <rect width="600" height="340" rx="8" className="fill-slate-900" />

      {/* Title */}
      <text x="300" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="13" fontWeight="700">
        The Perceptron: Simplest Neural Network
      </text>

      {/* ── INPUT NODES ── */}
      {/* Input 1 */}
      <circle cx={inputX} cy={input1Y} r="28" className="fill-white dark:fill-slate-950" stroke="#22c55e" strokeWidth="1.5" />
      <text x={inputX} y={input1Y - 6} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">
        x&#x2081;
      </text>
      <text x={inputX} y={input1Y + 8} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">
        (centroid)
      </text>

      {/* Input 2 */}
      <circle cx={inputX} cy={input2Y} r="28" className="fill-white dark:fill-slate-950" stroke="#22c55e" strokeWidth="1.5" />
      <text x={inputX} y={input2Y - 6} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">
        x&#x2082;
      </text>
      <text x={inputX} y={input2Y + 8} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">
        (ZCR)
      </text>

      {/* ── ARROWS: inputs → neuron ── */}
      {/* Arrow 1 */}
      <line
        x1={inputX + 30}
        y1={input1Y}
        x2={neuronX - 36}
        y2={midY - 8}
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <polygon
        points={`${neuronX - 38},${midY - 12} ${neuronX - 32},${midY - 8} ${neuronX - 38},${midY - 4}`}
        className="fill-gray-400 dark:fill-slate-500"
      />

      {/* Weight label w₁ */}
      <rect x="162" y={input1Y - 22} width="36" height="18" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
      <text x="180" y={input1Y - 9} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700">
        w&#x2081;
      </text>

      {/* Arrow 2 */}
      <line
        x1={inputX + 30}
        y1={input2Y}
        x2={neuronX - 36}
        y2={midY + 8}
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <polygon
        points={`${neuronX - 38},${midY + 4} ${neuronX - 32},${midY + 8} ${neuronX - 38},${midY + 12}`}
        className="fill-gray-400 dark:fill-slate-500"
      />

      {/* Weight label w₂ */}
      <rect x="162" y={input2Y + 4} width="36" height="18" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1" />
      <text x="180" y={input2Y + 17} textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="700">
        w&#x2082;
      </text>

      {/* ── NEURON (summation) ── */}
      <circle cx={neuronX} cy={midY} r="34" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="2" />
      <text x={neuronX} y={midY + 6} textAnchor="middle" fill="#fbbf24" fontSize="22" fontWeight="700">
        &#x03A3;
      </text>

      {/* Bias label */}
      <text x={neuronX + 2} y={midY - 40} textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">
        + b
      </text>
      <line x1={neuronX} y1={midY - 34} x2={neuronX} y2={midY - 38} stroke="#94a3b8" strokeWidth="1" />

      {/* ── ARROW: neuron → output ── */}
      <line x1={neuronX + 36} y1={midY} x2={outputX - 50} y2={midY} stroke="#64748b" strokeWidth="1.5" />
      <polygon points={`${outputX - 52},${midY - 4} ${outputX - 46},${midY} ${outputX - 52},${midY + 4}`} className="fill-gray-400 dark:fill-slate-500" />

      {/* ── OUTPUT BOX ── */}
      <rect x={outputX - 44} y={midY - 22} width="100" height="44" rx="6" className="fill-white dark:fill-slate-950" stroke="#22c55e" strokeWidth="1.5" />
      <text x={outputX + 6} y={midY - 4} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">
        elephant
      </text>
      <text x={outputX + 6} y={midY + 10} textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="600">
        or bird?
      </text>

      {/* ── THRESHOLD DIAGRAM below ── */}
      <rect x="100" y="210" width="400" height="60" rx="6" className="fill-white dark:fill-slate-950" stroke="#334155" strokeWidth="0.5" />

      {/* Threshold explanation */}
      <text x="300" y="228" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">
        If weighted sum {'>'} threshold →
        <tspan fill="#22c55e" fontWeight="700"> ELEPHANT</tspan>
      </text>
      <text x="300" y="246" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="10" fontWeight="600">
        else →
        <tspan fill="#f59e0b" fontWeight="700"> BIRD</tspan>
      </text>

      {/* Visual threshold bar */}
      <rect x="160" y="254" width="280" height="6" rx="3" className="fill-gray-100 dark:fill-slate-800" />
      <rect x="160" y="254" width="168" height="6" rx="3" fill="#22c55e" opacity="0.5" />
      <rect x="328" y="254" width="112" height="6" rx="3" fill="#f59e0b" opacity="0.5" />
      <line x1="328" y1="252" x2="328" y2="262" stroke="#f8fafc" strokeWidth="2" />
      <text x="328" y="268" textAnchor="middle" className="fill-gray-600 dark:fill-slate-300" fontSize="7">
        threshold
      </text>

      {/* ── Bottom summary ── */}
      <text x="300" y="312" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11" fontWeight="600">
        A perceptron learns by adjusting its weights to reduce errors
      </text>
    </svg>
  );
}
