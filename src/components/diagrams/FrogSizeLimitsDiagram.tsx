const FrogSizeLimitsDiagram = () => {
  const creatures = [
    { name: 'Dust mite', size: '0.3 mm', x: 55, w: 3, h: 2, color: '#94a3b8', note: 'Invertebrate' },
    { name: 'Ant', size: '2 mm', x: 130, w: 6, h: 4, color: '#f59e0b', note: 'Exoskeleton' },
    { name: 'Paedophryne\namauensis', size: '7.7 mm', x: 220, w: 14, h: 10, color: '#22c55e', note: 'Smallest vertebrate' },
    { name: 'Thumbnail\nfrog (NE India)', size: '~12 mm', x: 320, w: 20, h: 14, color: '#10b981', note: 'Namdapha species' },
    { name: 'Common\ntree frog', size: '~40 mm', x: 430, w: 44, h: 30, color: '#3b82f6', note: 'Typical frog' },
    { name: 'Goliath\nfrog', size: '320 mm', x: 550, w: 80, h: 55, color: '#8b5cf6', note: 'Largest frog' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <svg
        viewBox="0 0 640 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Size comparison of the smallest vertebrate frog to the largest frog, showing physical limits of smallness"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .heading { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .tiny { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="640" height="520" rx="12"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="320" y="28" textAnchor="middle" className="title fill-slate-800 dark:fill-slate-100">
          How Small Can Life Get?
        </text>

        {/* Key insight box */}
        <rect x="40" y="42" width="560" height="48" rx="6"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1" />
        <text x="320" y="60" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300">
          Vertebrates hit a size floor around 7–8 mm. Below that, eyes can’t form images,
        </text>
        <text x="320" y="74" textAnchor="middle" className="small fill-emerald-700 dark:fill-emerald-300">
          brains can’t hold enough neurons, and water loss through skin becomes unmanageable.
        </text>

        {/* Size scale */}
        <text x="320" y="108" textAnchor="middle" className="heading fill-slate-700 dark:fill-slate-300">
          Creature Size Comparison (proportional silhouettes)
        </text>

        {/* Baseline */}
        <line x1="30" y1="250" x2="610" y2="250"
          className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="4,3" />

        {/* Creatures */}
        {creatures.map((c, i) => {
          const bodyY = 250 - c.h;
          return (
            <g key={i}>
              {/* Body (ellipse) */}
              <ellipse cx={c.x} cy={250 - c.h / 2} rx={c.w / 2} ry={c.h / 2}
                fill={c.color} opacity="0.5" stroke={c.color} strokeWidth="1.5" />

              {/* Size label above */}
              <text x={c.x} y={bodyY - 14} textAnchor="middle"
                className="label" fill={c.color} fontWeight="600">{c.size}</text>

              {/* Name below */}
              {c.name.split('\n').map((line, li) => (
                <text key={li} x={c.x} y={260 + li * 13} textAnchor="middle"
                  className="small fill-slate-600 dark:fill-slate-300">{line}</text>
              ))}

              {/* Note */}
              <text x={c.x} y={260 + c.name.split('\n').length * 13 + 4} textAnchor="middle"
                className="tiny fill-slate-400 dark:fill-slate-500">{c.note}</text>
            </g>
          );
        })}

        {/* Minimum vertebrate line */}
        <line x1="175" y1="120" x2="175" y2="295" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="177" y="135" className="tiny fill-red-500 dark:fill-red-400">
          ← Vertebrate size limit (~7 mm)
        </text>

        {/* One-rupee coin reference */}
        <circle cx="320" cy="340" r="30" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" />
        <text x="320" y="336" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">₹1</text>
        <text x="320" y="348" textAnchor="middle" className="tiny fill-amber-600 dark:fill-amber-400">25 mm</text>

        {/* Show frog on coin */}
        <ellipse cx="310" cy="332" rx="7" ry="5" fill="#22c55e" opacity="0.7" stroke="#22c55e" strokeWidth="1" />
        <text x="320" y="388" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          The smallest frog fits on a ₹1 coin with room to spare
        </text>

        {/* Three limit factors */}
        <rect x="30" y="408" width="185" height="50" rx="6"
          className="fill-red-50 dark:fill-red-900/20 stroke-red-300 dark:stroke-red-700" strokeWidth="1" />
        <text x="122" y="425" textAnchor="middle" className="small fill-red-600 dark:fill-red-300" fontWeight="600">
          Limit 1: Eyes
        </text>
        <text x="122" y="440" textAnchor="middle" className="tiny fill-red-600 dark:fill-red-300">
          Retina needs minimum photoreceptors
        </text>
        <text x="122" y="452" textAnchor="middle" className="tiny fill-red-600 dark:fill-red-300">
          to form a usable image
        </text>

        <rect x="228" y="408" width="185" height="50" rx="6"
          className="fill-orange-50 dark:fill-orange-900/20 stroke-orange-300 dark:stroke-orange-700" strokeWidth="1" />
        <text x="320" y="425" textAnchor="middle" className="small fill-orange-600 dark:fill-orange-300" fontWeight="600">
          Limit 2: Brain
        </text>
        <text x="320" y="440" textAnchor="middle" className="tiny fill-orange-600 dark:fill-orange-300">
          ~14,000 neurons minimum for basic
        </text>
        <text x="320" y="452" textAnchor="middle" className="tiny fill-orange-600 dark:fill-orange-300">
          sensing, movement, and feeding
        </text>

        <rect x="426" y="408" width="185" height="50" rx="6"
          className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="518" y="425" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-300" fontWeight="600">
          Limit 3: Water loss
        </text>
        <text x="518" y="440" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          High SA:V ratio = rapid desiccation
        </text>
        <text x="518" y="452" textAnchor="middle" className="tiny fill-blue-600 dark:fill-blue-300">
          Must live in constantly moist habitat
        </text>

        {/* Surface tension note */}
        <rect x="100" y="472" width="440" height="36" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="320" y="487" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          At tiny scales, surface tension becomes a major force — a raindrop hitting
        </text>
        <text x="320" y="500" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-300">
          a 7 mm frog is like a water balloon hitting you. Gravity matters less; stickiness matters more.
        </text>
      </svg>
    </div>
  );
};

export default FrogSizeLimitsDiagram;
