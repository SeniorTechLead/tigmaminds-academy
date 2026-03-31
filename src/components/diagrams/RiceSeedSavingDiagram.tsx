export default function RiceSeedSavingDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 620 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Comparison of traditional seed saving versus hybrid seeds showing genetic diversity trade-offs">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
        `}</style>
        <rect width="620" height="360" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-green-700 dark:fill-green-300">
          Seed Saving vs Hybrid Seeds
        </text>

        {/* Divider */}
        <line x1="310" y1="45" x2="310" y2="340" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6,4" className="dark:stroke-slate-700" />

        {/* LEFT: Seed Saving */}
        <text x="155" y="58" textAnchor="middle" className="label fill-emerald-600 dark:fill-emerald-400" fontWeight="700">Traditional Seed Saving</text>

        {/* Cycle diagram */}
        <circle cx="155" cy="140" r="55" fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="4,3" className="dark:stroke-emerald-700" />

        <g>
          <text x="155" y="80" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Plant</text>
          <text x="220" y="145" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Harvest</text>
          <text x="155" y="210" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Save best seeds</text>
          <text x="85" y="145" textAnchor="middle" className="small fill-green-700 dark:fill-green-400" fontWeight="600">Replant</text>
        </g>

        {/* Arrows around the cycle */}
        <path d="M 180 85 Q 210 100 215 125" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#seed-arr)" />
        <path d="M 215 165 Q 210 190 180 200" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#seed-arr)" />
        <path d="M 130 200 Q 100 190 95 165" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#seed-arr)" />
        <path d="M 95 125 Q 100 100 130 85" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#seed-arr)" />

        {/* Benefits */}
        <rect x="30" y="225" width="250" height="110" rx="6" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" className="dark:fill-emerald-900/10 dark:stroke-emerald-800" />
        <text x="155" y="245" textAnchor="middle" className="small fill-emerald-600 dark:fill-emerald-400" fontWeight="600">Advantages</text>
        <text x="45" y="262" className="small fill-slate-600 dark:fill-slate-400">\u2713 Free — farmer keeps own seeds</text>
        <text x="45" y="278" className="small fill-slate-600 dark:fill-slate-400">\u2713 Adapted to local conditions over time</text>
        <text x="45" y="294" className="small fill-slate-600 dark:fill-slate-400">\u2713 Maintains genetic diversity</text>
        <text x="45" y="310" className="small fill-slate-600 dark:fill-slate-400">\u2713 Independence from seed companies</text>
        <text x="45" y="326" className="small fill-amber-600 dark:fill-amber-400">\u2717 Lower yield than hybrids</text>

        {/* RIGHT: Hybrid Seeds */}
        <text x="465" y="58" textAnchor="middle" className="label fill-blue-600 dark:fill-blue-400" fontWeight="700">Hybrid / HYV Seeds</text>

        {/* Linear flow — no cycle */}
        <rect x="370" y="80" width="80" height="30" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/20" />
        <text x="410" y="100" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-400">Buy seeds</text>

        <line x1="450" y1="95" x2="470" y2="95" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#seed-arr-b)" />

        <rect x="470" y="80" width="80" height="30" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/20" />
        <text x="510" y="100" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-400">Plant</text>

        <line x1="510" y1="110" x2="510" y2="125" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#seed-arr-b-d)" />

        <rect x="470" y="125" width="80" height="30" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/20" />
        <text x="510" y="145" textAnchor="middle" className="small fill-blue-700 dark:fill-blue-400">Harvest</text>

        <line x1="510" y1="155" x2="510" y2="170" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#seed-arr-b-d)" />

        <rect x="440" y="170" width="140" height="30" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" className="dark:fill-red-900/15" />
        <text x="510" y="190" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Seeds don't breed true!</text>

        <line x1="510" y1="200" x2="410" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
        <text x="440" y="215" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">Must buy again each year</text>

        {/* Disadvantages */}
        <rect x="340" y="225" width="250" height="110" rx="6" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" className="dark:fill-blue-900/10 dark:stroke-blue-800" />
        <text x="465" y="245" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400" fontWeight="600">Trade-offs</text>
        <text x="355" y="262" className="small fill-slate-600 dark:fill-slate-400">\u2713 Higher yields (2\u20134\u00D7 traditional)</text>
        <text x="355" y="278" className="small fill-slate-600 dark:fill-slate-400">\u2713 Uniform crop for market</text>
        <text x="355" y="294" className="small fill-amber-600 dark:fill-amber-400">\u2717 Expensive: must buy every season</text>
        <text x="355" y="310" className="small fill-amber-600 dark:fill-amber-400">\u2717 Needs fertilizer, pesticide, irrigation</text>
        <text x="355" y="326" className="small fill-amber-600 dark:fill-amber-400">\u2717 Narrows genetic diversity</text>

        <defs>
          <marker id="seed-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
          </marker>
          <marker id="seed-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="seed-arr-b-d" viewBox="0 0 10 10" refX="5" refY="9" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 5 10 L 10 0 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
