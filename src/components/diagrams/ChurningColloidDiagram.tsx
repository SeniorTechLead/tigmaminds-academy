export default function ChurningColloidDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 560 240" className="w-full h-auto" role="img" aria-label="Three types of colloids: suspension, sol, and gel with particle sizes">
        <style>{`
          .col-title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .col-label { font-family: system-ui, sans-serif; font-size: 10px; }
          .col-small { font-family: system-ui, sans-serif; font-size: 9px; }
        `}</style>

        <rect width="560" height="240" rx="8" className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="24" textAnchor="middle" className="col-title fill-gray-700 dark:fill-gray-200">Types of Colloids</text>

        {/* Suspension */}
        <rect x="20" y="45" width="160" height="130" rx="6" className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-600" strokeWidth="1" />
        <text x="100" y="62" textAnchor="middle" className="col-label fill-amber-700 dark:fill-amber-300" fontWeight="600">Suspension</text>
        {/* Large particles settling */}
        {[[60, 90], [90, 100], [120, 85], [80, 130], [110, 140], [140, 120], [70, 150], [130, 155]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={5 + (i % 3)} className="fill-amber-400 dark:fill-amber-500" opacity="0.7" />
        ))}
        <text x="100" y="185" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Particles &gt; 1000 nm</text>
        <text x="100" y="197" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Settles over time</text>
        <text x="100" y="209" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">e.g. muddy water</text>

        {/* Sol */}
        <rect x="200" y="45" width="160" height="130" rx="6" className="fill-blue-50 dark:fill-blue-900/20 stroke-blue-300 dark:stroke-blue-600" strokeWidth="1" />
        <text x="280" y="62" textAnchor="middle" className="col-label fill-blue-700 dark:fill-blue-300" fontWeight="600">Sol (Colloidal Solution)</text>
        {/* Tiny particles dispersed evenly */}
        {[[240, 85], [260, 95], [290, 80], [250, 110], [275, 120], [310, 100], [235, 135], [265, 140], [300, 130], [280, 155], [245, 160], [310, 150]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} className="fill-blue-400 dark:fill-blue-500" opacity="0.8" />
        ))}
        <text x="280" y="185" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Particles 1-1000 nm</text>
        <text x="280" y="197" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Stays suspended</text>
        <text x="280" y="209" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">e.g. milk, ink</text>

        {/* Gel */}
        <rect x="380" y="45" width="160" height="130" rx="6" className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-600" strokeWidth="1" />
        <text x="460" y="62" textAnchor="middle" className="col-label fill-purple-700 dark:fill-purple-300" fontWeight="600">Gel</text>
        {/* Network structure */}
        {[[420, 90], [460, 85], [500, 95], [410, 120], [445, 115], [480, 130], [430, 150], [470, 145], [510, 140]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3} className="fill-purple-400 dark:fill-purple-500" opacity="0.8" />
        ))}
        {/* Network lines */}
        <line x1="420" y1="90" x2="460" y2="85" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="460" y1="85" x2="500" y2="95" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="420" y1="90" x2="410" y2="120" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="460" y1="85" x2="445" y2="115" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="500" y1="95" x2="480" y2="130" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="410" y1="120" x2="445" y2="115" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="445" y1="115" x2="480" y2="130" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="410" y1="120" x2="430" y2="150" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="445" y1="115" x2="470" y2="145" className="stroke-purple-300" strokeWidth="0.8" />
        <line x1="480" y1="130" x2="510" y2="140" className="stroke-purple-300" strokeWidth="0.8" />
        <text x="460" y="185" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Solid network in liquid</text>
        <text x="460" y="197" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">Semi-solid structure</text>
        <text x="460" y="209" textAnchor="middle" className="col-small fill-gray-500 dark:fill-gray-400">e.g. jelly, butter</text>

        <text x="280" y="232" textAnchor="middle" className="col-small fill-gray-400 dark:fill-gray-500">Butter from churning is a gel — fat network trapping water</text>
      </svg>
    </div>
  );
}
