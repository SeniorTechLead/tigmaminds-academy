const TrainFrictionDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how friction and adhesion work between train wheels and rails"
      >
        <style>{`
          .tf-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .tf-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .tf-section { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
          .tf-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tf-fact { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes wheelRoll {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .tf-spin { animation: wheelRoll 4s linear infinite; transform-origin: center; }
        `}</style>

        <defs>
          <marker id="tf-arr-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
          <marker id="tf-arr-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="tf-arr-amber" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="tf-arr-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="600" height="480" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" className="tf-title fill-gray-800 dark:fill-slate-100">
          Wheel-Rail Friction: How Trains Grip the Track
        </text>

        {/* === LEFT SECTION: Wheel on rail close-up === */}
        <text x="160" y="52" textAnchor="middle" className="tf-section fill-blue-600 dark:fill-blue-400">
          Steel Wheel on Steel Rail
        </text>

        {/* Rail cross-section */}
        <rect x="40" y="180" width="240" height="12" rx="2"
          className="fill-gray-400 dark:fill-gray-500" />
        <rect x="40" y="192" width="240" height="20" rx="1"
          className="fill-gray-500 dark:fill-gray-600" />

        {/* Wheel */}
        <g transform="translate(160, 140)">
          <g className="tf-spin">
            <circle cx="0" cy="0" r="38" className="fill-gray-600 dark:fill-gray-400" opacity="0.9" />
            <circle cx="0" cy="0" r="32" className="fill-gray-500 dark:fill-gray-500" />
            <circle cx="0" cy="0" r="8" className="fill-gray-700 dark:fill-gray-300" />
            {/* Spokes */}
            <line x1="0" y1="-8" x2="0" y2="-32" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2" />
            <line x1="0" y1="8" x2="0" y2="32" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2" />
            <line x1="-8" y1="0" x2="-32" y2="0" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2" />
            <line x1="8" y1="0" x2="32" y2="0" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="2" />
          </g>
        </g>

        {/* Contact patch label */}
        <line x1="160" y1="180" x2="160" y2="230" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
        <circle cx="160" cy="180" r="3" fill="#f59e0b" />
        <text x="160" y="244" textAnchor="middle" className="tf-small fill-amber-600 dark:fill-amber-400">
          Contact patch: only
        </text>
        <text x="160" y="256" textAnchor="middle" className="tf-small fill-amber-600 dark:fill-amber-400">
          ~1 cm\u00B2 per wheel!
        </text>

        {/* Weight arrow (down) */}
        <line x1="160" y1="72" x2="160" y2="98" markerEnd="url(#tf-arr-blue)" stroke="#60a5fa" strokeWidth="2" />
        <text x="190" y="88" className="tf-small fill-blue-500 dark:fill-blue-400">Weight (W)</text>

        {/* Friction force arrow (forward) */}
        <line x1="160" y1="178" x2="90" y2="178" markerEnd="url(#tf-arr-green)" stroke="#22c55e" strokeWidth="2.5" />
        <text x="60" y="172" textAnchor="middle" className="tf-small fill-green-600 dark:fill-green-400">
          Friction
        </text>
        <text x="60" y="162" textAnchor="middle" className="tf-small fill-green-600 dark:fill-green-400">
          (grips rail)
        </text>

        {/* Driving force arrow */}
        <line x1="200" y1="140" x2="250" y2="140" markerEnd="url(#tf-arr-amber)" stroke="#f59e0b" strokeWidth="2" />
        <text x="260" y="136" className="tf-small fill-amber-600 dark:fill-amber-400">Engine</text>
        <text x="260" y="148" className="tf-small fill-amber-600 dark:fill-amber-400">torque</text>

        {/* Flange */}
        <rect x="149" y="170" width="22" height="12" rx="1"
          className="fill-gray-700 dark:fill-gray-300" opacity="0.7" />
        <line x1="155" y1="170" x2="135" y2="155" className="stroke-gray-500 dark:stroke-gray-400" strokeWidth="1" strokeDasharray="3,2" />
        <text x="105" y="155" textAnchor="middle" className="tf-small fill-gray-600 dark:fill-gray-400">Flange</text>
        <text x="105" y="166" textAnchor="middle" className="tf-small fill-gray-600 dark:fill-gray-400">(prevents</text>
        <text x="105" y="177" textAnchor="middle" className="tf-small fill-gray-600 dark:fill-gray-400">derailment)</text>

        {/* === RIGHT SECTION: Comparison chart === */}
        <text x="440" y="52" textAnchor="middle" className="tf-section fill-blue-600 dark:fill-blue-400">
          Friction Coefficient Comparison
        </text>

        {/* Bar chart */}
        {[
          { label: 'Steel on steel\n(dry rail)', value: 0.30, color: '#22c55e', y: 72 },
          { label: 'Steel on steel\n(wet rail)', value: 0.15, color: '#f59e0b', y: 120 },
          { label: 'Steel on steel\n(oily leaves)', value: 0.05, color: '#ef4444', y: 168 },
          { label: 'Rubber on\nasphalt (dry)', value: 0.70, color: '#60a5fa', y: 216 },
        ].map((item, i) => {
          const barWidth = item.value * 200;
          return (
            <g key={i}>
              <text x="350" y={item.y + 8} textAnchor="end" className="tf-small fill-gray-600 dark:fill-gray-400">
                {item.label.split('\n').map((line, j) => (
                  <tspan key={j} x="350" dy={j === 0 ? 0 : 12}>{line}</tspan>
                ))}
              </text>
              <rect x="358" y={item.y - 2} width={barWidth} height="20" rx="3" fill={item.color} opacity="0.8" />
              <text x={362 + barWidth} y={item.y + 12} className="tf-small fill-gray-700 dark:fill-gray-300">
                \u03BC = {item.value.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Divider */}
        <line x1="20" y1="278" x2="580" y2="278" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* === BOTTOM: Key insight === */}
        <text x="300" y="302" textAnchor="middle" className="tf-section fill-emerald-600 dark:fill-emerald-400">
          Why Steel-on-Steel Works for Trains
        </text>

        {/* Three boxes */}
        {[
          { x: 40, title: 'Low friction =', line2: 'high efficiency', desc: 'A 2,000-tonne freight train\nneeds only a small engine\nbecause rolling resistance is\nvery low on steel rails.', color: '#22c55e' },
          { x: 220, title: 'Just enough grip', line2: 'to not slip', desc: 'The adhesion coefficient\n(\u03BC \u2248 0.30 dry) means each\ndriving wheel can push with\n30% of its weight as force.', color: '#f59e0b' },
          { x: 400, title: 'Hard surface =', line2: 'no deformation', desc: 'Steel doesn\u2019t squash flat\nlike rubber, so the tiny\ncontact patch rolls with\nalmost zero energy loss.', color: '#60a5fa' },
        ].map((box, i) => (
          <g key={i}>
            <rect x={box.x} y="316" width="165" height="140" rx="6"
              className="fill-gray-50 dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
            <text x={box.x + 82} y="336" textAnchor="middle" className="tf-small" fill={box.color} fontWeight="600">
              {box.title}
            </text>
            <text x={box.x + 82} y="349" textAnchor="middle" className="tf-small" fill={box.color} fontWeight="600">
              {box.line2}
            </text>
            {box.desc.split('\n').map((line, j) => (
              <text key={j} x={box.x + 82} y={365 + j * 13} textAnchor="middle" className="tf-fact fill-gray-600 dark:fill-gray-400">
                {line}
              </text>
            ))}
          </g>
        ))}

      </svg>
    </div>
  );
};

export default TrainFrictionDiagram;
