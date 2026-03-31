export default function PixelGridDiagram() {
  const pixels = [
    ['#4ade80','#4ade80','#4ade80','#a3e635','#a3e635','#fbbf24','#92400e','#92400e'],
    ['#4ade80','#22c55e','#22c55e','#a3e635','#fbbf24','#fbbf24','#92400e','#78350f'],
    ['#22c55e','#22c55e','#16a34a','#fbbf24','#fbbf24','#92400e','#78350f','#78350f'],
    ['#22c55e','#16a34a','#fbbf24','#fbbf24','#92400e','#92400e','#78350f','#451a03'],
    ['#16a34a','#fbbf24','#fbbf24','#92400e','#92400e','#78350f','#451a03','#451a03'],
    ['#fbbf24','#fbbf24','#92400e','#92400e','#78350f','#78350f','#451a03','#451a03'],
  ];
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="How computers see images as a grid of pixels with RGB values">
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f43f5e">How Computers "See": Pixels and RGB</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">A camera image is just a grid of tiny colored squares — each one is a pixel</text>

        {/* Left side: "What you see" - field image */}
        <text x="170" y="85" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">What you see</text>
        <rect x="40" y="95" width="260" height="180" rx="6" stroke="#d1d5db" strokeWidth="1" fill="none" />
        {/* Stylized paddy field scene */}
        <rect x="40" y="95" width="260" height="90" fill="#7dd3fc" /> {/* sky */}
        <rect x="40" y="185" width="260" height="90" fill="#4ade80" /> {/* field */}
        <text x="170" y="150" textAnchor="middle" fontSize="24">🌾</text>
        <text x="120" y="230" textAnchor="middle" fontSize="18">🌱</text>
        <text x="200" y="220" textAnchor="middle" fontSize="18">🌱</text>

        {/* Arrow */}
        <text x="330" y="180" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-500 dark:fill-slate-400">zoom in →</text>

        {/* Right side: pixel grid */}
        <text x="560" y="85" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">What the computer sees</text>
        <g transform="translate(400, 95)">
          {pixels.map((row, r) =>
            row.map((color, c) => (
              <g key={`${r}-${c}`}>
                <rect x={c * 40} y={r * 30} width="39" height="29" fill={color} stroke="#fff" strokeWidth="0.5" />
              </g>
            ))
          )}
          {/* Grid overlay */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="180" stroke="#fff" strokeWidth="0.5" opacity="0.5" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 30} x2="320" y2={i * 30} stroke="#fff" strokeWidth="0.5" opacity="0.5" />
          ))}
        </g>

        {/* Zoom into one pixel with RGB */}
        <rect x="60" y="305" width="300" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#d1d5db" strokeWidth="1" />
        <text x="210" y="328" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">One pixel = three numbers (RGB)</text>

        <rect x="80" y="340" width="50" height="30" rx="4" fill="#22c55e" />
        <text x="105" y="360" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Pixel</text>

        <text x="155" y="355" fontSize="11" className="fill-gray-600 dark:fill-slate-300">=</text>

        <g transform="translate(170, 340)">
          <rect width="44" height="30" rx="4" fill="#ef4444" opacity="0.3" stroke="#ef4444" strokeWidth="1" />
          <text x="22" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#ef4444">R</text>
          <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">34</text>
        </g>
        <g transform="translate(222, 340)">
          <rect width="44" height="30" rx="4" fill="#22c55e" opacity="0.3" stroke="#22c55e" strokeWidth="1" />
          <text x="22" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#22c55e">G</text>
          <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#22c55e">197</text>
        </g>
        <g transform="translate(274, 340)">
          <rect width="44" height="30" rx="4" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
          <text x="22" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#3b82f6">B</text>
          <text x="22" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#3b82f6">94</text>
        </g>

        <text x="210" y="398" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Low red + high green + low blue = green leaf</text>
        <text x="210" y="416" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">High red + low green + low blue = brown soil (sick plant?)</text>
        <text x="210" y="434" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f43f5e">This is how a drone detects crop health from color!</text>

        {/* Right bottom: key */}
        <rect x="400" y="305" width="340" height="140" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="570" y="328" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-700 dark:fill-slate-200">Scale of seeing</text>
        {[
          { label: 'Your eye', val: 'Sees green field', y: 348 },
          { label: 'Camera', val: '12 million pixels', y: 370 },
          { label: 'Each pixel', val: '3 numbers (R, G, B)', y: 392 },
          { label: 'Computer', val: '36 million numbers!', y: 414 },
        ].map((row, i) => (
          <g key={i}>
            <text x="420" y={row.y} fontSize="11" fontWeight="600" fill="#f43f5e">{row.label}</text>
            <text x="530" y={row.y} fontSize="11" className="fill-gray-600 dark:fill-slate-300">{row.val}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
