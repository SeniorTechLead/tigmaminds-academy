export default function ActivityDigBoxDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Mini archaeological dig activity: layer objects in a shoebox and excavate with a spoon">
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">Try This: Shoebox Archaeology</text>
        <text x="350" y="52" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">You need: a shoebox, sand, soil, small objects, a spoon, a paintbrush</text>

        {/* Shoebox cross-section */}
        <rect x="150" y="80" width="400" height="250" rx="4" fill="none" stroke="#a16207" strokeWidth="3" />

        {/* Layers */}
        <rect x="152" y="250" width="396" height="78" fill="#a78bfa" opacity="0.25" />
        <text x="350" y="296" textAnchor="middle" fontSize="12" fontWeight="500" className="fill-gray-700 dark:fill-slate-200">Layer 3: pebbles + \u201Cancient\u201D object</text>

        <rect x="152" y="185" width="396" height="65" fill="#fb923c" opacity="0.25" />
        <text x="350" y="222" textAnchor="middle" fontSize="12" fontWeight="500" className="fill-gray-700 dark:fill-slate-200">Layer 2: soil + \u201Cmedieval\u201D object</text>

        <rect x="152" y="120" width="396" height="65" fill="#a3e635" opacity="0.25" />
        <text x="350" y="158" textAnchor="middle" fontSize="12" fontWeight="500" className="fill-gray-700 dark:fill-slate-200">Layer 1: sand + \u201Cmodern\u201D object</text>

        {/* Top label */}
        <text x="350" y="100" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">\u2191 surface (newest)</text>

        {/* Steps */}
        {[
          { n: '1', text: 'Fill shoebox with three layers, burying one object per layer' },
          { n: '2', text: 'Have a friend excavate with a spoon, recording each find\u2019s layer' },
          { n: '3', text: 'Did deeper objects match your \u201Coldest\u201D labels? That\u2019s stratigraphy!' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={120} cy={355 + i * 26} r="10" fill="#f59e0b" opacity="0.2" />
            <text x={120} y={359 + i * 26} textAnchor="middle" fontSize="11" fontWeight="700" fill="#f59e0b">{s.n}</text>
            <text x={140} y={359 + i * 26} fontSize="12" className="fill-gray-700 dark:fill-slate-200">{s.text}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
