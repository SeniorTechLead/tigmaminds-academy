export default function WoodpeckerTongueDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Woodpecker tongue wrapping around skull, twice the beak length, with barbed tip"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes extend { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(1.15)} }
          .tongue-ext { animation: extend 2s ease-in-out infinite; transform-origin: 340px 170px; }
        `}</style>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          The Incredible Woodpecker Tongue
        </text>

        {/* Main skull side view */}
        <g transform="translate(100, 50)">
          {/* Skull */}
          <ellipse cx="130" cy="130" rx="100" ry="110" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="2.5" />

          {/* Red crest */}
          <path d="M50,30 Q130,0 200,35 Q170,55 70,55 Z" fill="#dc2626" opacity="0.8" />

          {/* Eye */}
          <circle cx="185" cy="100" r="12" className="fill-white dark:fill-slate-950" stroke="#f8fafc" strokeWidth="1.5" />
          <circle cx="188" cy="97" r="4" className="fill-gray-900 dark:fill-slate-50" />

          {/* Beak */}
          <polygon points="225,125 340,118 340,138 225,135" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />

          {/* TONGUE PATH - the star */}
          {/* Tongue starts at beak tip, goes back through beak, under skull, around back, over top, anchors at right nostril */}
          <path
            d="M340,128 L225,128 C210,128 200,135 190,145 C170,170 130,185 90,180 C50,175 25,150 20,120 C15,85 20,50 45,35 C70,20 100,18 130,22 C155,25 175,35 185,50"
            fill="none" stroke="#f472b6" strokeWidth="4" opacity="0.8"
          />

          {/* Tongue route labels */}
          <circle cx="340" cy="128" r="4" fill="#f472b6" />
          <circle cx="185" cy="50" r="4" fill="#f472b6" />

          {/* Brain (tongue wraps around it) */}
          <ellipse cx="120" cy="120" rx="58" ry="62" fill="#22c55e" opacity="0.12" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2" />
          <text x="120" y="125" textAnchor="middle" className="sm" fill="#86efac">Brain</text>
        </g>

        {/* Barbed tip detail */}
        <g transform="translate(400, 80)">
          <rect x="0" y="0" width="170" height="100" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#f472b6" strokeWidth="1" />
          <text x="85" y="18" textAnchor="middle" className="label" fill="#f472b6" fontWeight="600">Barbed Tip (zoomed)</text>

          {/* Tongue tip */}
          <line x1="30" y1="55" x2="140" y2="55" stroke="#f472b6" strokeWidth="3" />
          {/* Barbs */}
          {[50, 65, 80, 95, 110, 125].map(x => (
            <g key={x}>
              <line x1={x} y1="55" x2={x - 5} y2="42" stroke="#f472b6" strokeWidth="1.5" />
              <line x1={x} y1="55" x2={x - 5} y2="68" stroke="#f472b6" strokeWidth="1.5" />
            </g>
          ))}
          <text x="85" y="88" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Backward-facing barbs</text>
          <text x="85" y="98" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">grip insects in tree holes</text>
        </g>

        {/* Length comparison */}
        <g transform="translate(50, 290)">
          <text x="250" y="0" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400" fontWeight="600">Length Comparison</text>

          {/* Beak length */}
          <rect x="50" y="15" width="100" height="16" rx="4" fill="#d97706" opacity="0.7" />
          <text x="160" y="27" className="sm" fill="#fbbf24">Beak: ~4 cm</text>

          {/* Tongue length */}
          <rect x="50" y="40" width="200" height="16" rx="4" fill="#f472b6" opacity="0.7" />
          <text x="260" y="52" className="sm" fill="#f9a8d4">Tongue: ~10 cm (2.5x beak)</text>

          {/* Bracket */}
          <line x1="50" y1="65" x2="250" y2="65" stroke="#f472b6" strokeWidth="1" />
          <line x1="50" y1="60" x2="50" y2="70" stroke="#f472b6" strokeWidth="1" />
          <line x1="250" y1="60" x2="250" y2="70" stroke="#f472b6" strokeWidth="1" />

          {/* Facts */}
          <text x="250" y="88" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            The tongue wraps around the entire skull when retracted
          </text>
          <text x="250" y="102" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">
            Acts as additional shock absorber during pecking
          </text>
        </g>
      </svg>
    </div>
  );
}
