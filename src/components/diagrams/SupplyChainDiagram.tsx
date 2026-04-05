const SupplyChainDiagram = () => {
  const nodes = [
    { label: 'Producer', price: '$1.00', x: 30, color: '#10b981' },
    { label: 'Trader 1', price: '$1.80', x: 140, color: '#3b82f6' },
    { label: 'Trader 2', price: '$2.50', x: 250, color: '#8b5cf6' },
    { label: 'Retailer', price: '$4.00', x: 360, color: '#f59e0b' },
    { label: 'Consumer', price: '$5.50', x: 470, color: '#ef4444' },
  ];

  const markups = [
    { label: '+$0.80', x: 95 },
    { label: '+$0.70', x: 205 },
    { label: '+$1.50', x: 315 },
    { label: '+$1.50', x: 425 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 560 260"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Supply chain diagram showing price markup at each step from producer to consumer"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .price-text {
            font-family: ui-monospace, monospace;
            font-size: 12px;
            font-weight: 700;
          }
          .markup-text {
            font-family: system-ui, sans-serif;
            font-size: 9px;
            font-weight: 600;
          }
          .node-label {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-weight: 600;
          }
          .formula-text {
            font-family: system-ui, sans-serif;
            font-size: 10px;
            font-style: italic;
          }
        `}</style>

        <defs>
          <marker id="sc-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="540" height="240" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="270" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Supply Chain — Price Markup at Each Step
        </text>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.label}>
            {/* Circle node */}
            <circle cx={node.x + 30} cy={100} r="24"
              fill={node.color} opacity="0.15"
              stroke={node.color} strokeWidth="2" />

            {/* Icon placeholder — simple shape */}
            <circle cx={node.x + 30} cy={95} r="6"
              fill={node.color} opacity="0.4" />

            {/* Node label */}
            <text x={node.x + 30} y={140} textAnchor="middle"
              className="node-label" fill={node.color}>
              {node.label}
            </text>

            {/* Price */}
            <text x={node.x + 30} y={158} textAnchor="middle"
              className="price-text" fill={node.color}>
              {node.price}
            </text>

            {/* Price bar (proportional height) */}
            {(() => {
              const barHeight = parseFloat(node.price.replace('$', '')) * 18;
              return (
                <rect
                  x={node.x + 20} y={195 - barHeight}
                  width="20" height={barHeight} rx="2"
                  fill={node.color} opacity="0.25"
                  stroke={node.color} strokeWidth="1"
                />
              );
            })()}
          </g>
        ))}

        {/* Arrows between nodes */}
        {markups.map((m, i) => (
          <g key={`arrow-${i}`}>
            <line
              x1={nodes[i].x + 54} y1={100}
              x2={nodes[i + 1].x + 6} y2={100}
              stroke="#64748b" strokeWidth="2" markerEnd="url(#sc-arrow)" />

            {/* Markup label */}
            <rect x={m.x - 16} y={72} width="38" height="16" rx="3"
              fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"
              className="dark:fill-amber-900/30 dark:stroke-amber-700" />
            <text x={m.x + 3} y={84} textAnchor="middle"
              className="markup-text fill-amber-700 dark:fill-amber-300">
              {m.label}
            </text>
          </g>
        ))}

        {/* Baseline for bars */}
        <line x1="40" y1="195" x2="510" y2="195"
          stroke="#e2e8f0" strokeWidth="1" />

        {/* Bottom note */}
        <text x="270" y="218" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400">
          Producer earns $1.00 of the $5.50 the consumer pays — 18% of final price
        </text>
        <text x="270" y="234" textAnchor="middle"
          className="formula-text fill-slate-500 dark:fill-slate-400">
          Each intermediary adds cost for transport, storage, and profit margin
        </text>
      </svg>
    </div>
  );
};

export default SupplyChainDiagram;
