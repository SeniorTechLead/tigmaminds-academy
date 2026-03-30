export default function WoodpeckerBioInspirationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 630 470"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Bio-inspiration: woodpecker skull inspiring helmets, packaging, and electronics shock absorbers"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 12px; }
        `}</style>

        <rect width="630" height="470" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="315" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          From Woodpecker to Engineering
        </text>

        {/* Central woodpecker */}
        <g transform="translate(255, 50)">
          <ellipse cx="60" cy="50" rx="45" ry="40" fill="#16a34a" opacity="0.3" stroke="#22c55e" strokeWidth="2" />
          <ellipse cx="60" cy="35" rx="22" ry="15" fill="#dc2626" opacity="0.7" />
          <polygon points="105,48 135,46 135,54 105,52" fill="#d97706" />
          <circle cx="82" cy="42" r="5" fill="#fef9c3" />
          <text x="60" y="105" textAnchor="middle" className="label" fill="#86efac" fontWeight="600">Woodpecker Skull</text>
        </g>

        {/* Arrows radiating out */}
        <g className="stroke-gray-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3">
          <line x1="255" y1="125" x2="130" y2="200" />
          <line x1="315" y1="150" x2="315" y2="200" />
          <line x1="375" y1="125" x2="500" y2="200" />
        </g>

        {/* Application 1: Helmets */}
        <g transform="translate(20, 205)">
          <rect x="0" y="0" width="195" height="210" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Helmet icon */}
          <g transform="translate(58, 15)">
            <path d="M10,50 Q40,-5 70,50" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <path d="M16,47 Q40,5 64,47" fill="none" stroke="#818cf8" strokeWidth="6" opacity="0.4" strokeDasharray="3 2" />
            <path d="M22,44 Q40,12 58,44" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="40" cy="42" rx="15" ry="12" className="fill-gray-900 dark:fill-slate-50" opacity="0.08" />
          </g>

          <text x="98" y="85" textAnchor="middle" className="label" fill="#38bdf8" fontWeight="600">
            Multi-Layer Helmets
          </text>
          <text x="98" y="102" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Hard shell + EPS foam +</text>
          <text x="98" y="115" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">comfort liner mirrors the</text>
          <text x="98" y="128" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">dense-spongy-dense structure</text>

          {/* Principle used */}
          <rect x="10" y="142" width="175" height="58" rx="6" className="fill-white dark:fill-slate-950" />
          <text x="98" y="161" textAnchor="middle" className="sm" fill="#fbbf24">Principles used:</text>
          <text x="98" y="176" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Sandwich layers</text>
          <text x="98" y="191" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Retention strap (hyoid)</text>
        </g>

        {/* Application 2: Packaging */}
        <g transform="translate(220, 205)">
          <rect x="0" y="0" width="195" height="210" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Package icon */}
          <g transform="translate(58, 15)">
            <rect x="0" y="5" width="50" height="40" rx="3" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <rect x="5" y="10" width="40" height="30" rx="0" fill="#f59e0b" opacity="0.15" />
            {/* Inner bubbles */}
            {[[15,20,5],[30,18,4],[22,30,5],[38,28,4]].map(([cx,cy,r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
            ))}
            <rect x="15" y="22" width="20" height="12" rx="2" fill="#22c55e" opacity="0.3" />
          </g>

          <text x="98" y="85" textAnchor="middle" className="label" fill="#f59e0b" fontWeight="600">
            Shock-Proof Packaging
          </text>
          <text x="98" y="102" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Crushable foam inserts</text>
          <text x="98" y="115" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">absorb drops just like</text>
          <text x="98" y="128" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">spongy bone absorbs pecks</text>

          <rect x="10" y="142" width="175" height="58" rx="6" className="fill-white dark:fill-slate-950" />
          <text x="98" y="161" textAnchor="middle" className="sm" fill="#fbbf24">Principles used:</text>
          <text x="98" y="176" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Energy absorption</text>
          <text x="98" y="191" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Impulse extension</text>
        </g>

        {/* Application 3: Electronics */}
        <g transform="translate(420, 205)">
          <rect x="0" y="0" width="195" height="210" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1.5" />

          {/* Circuit board icon */}
          <g transform="translate(58, 15)">
            <rect x="0" y="5" width="50" height="40" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#a78bfa" strokeWidth="1.5" />
            {/* Chip */}
            <rect x="15" y="15" width="20" height="15" rx="2" fill="#475569" stroke="#a78bfa" strokeWidth="1" />
            {/* Pins */}
            {[18, 23, 28, 33].map(x => (
              <g key={x}>
                <line x1={x} y1="15" x2={x} y2="10" stroke="#a78bfa" strokeWidth="1" />
                <line x1={x} y1="30" x2={x} y2="35" stroke="#a78bfa" strokeWidth="1" />
              </g>
            ))}
            {/* Shock mount springs */}
            <path d="M5,45 L5,55 M15,45 L15,55 M35,45 L35,55 M45,45 L45,55" stroke="#22c55e" strokeWidth="1.5" />
            <path d="M5,48 L8,50 L2,52 L5,55" fill="none" stroke="#22c55e" strokeWidth="1" />
            <path d="M45,48 L48,50 L42,52 L45,55" fill="none" stroke="#22c55e" strokeWidth="1" />
          </g>

          <text x="98" y="85" textAnchor="middle" className="label" fill="#a78bfa" fontWeight="600">
            Electronics Shock Mounts
          </text>
          <text x="98" y="102" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Vibration isolators protect</text>
          <text x="98" y="115" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">hard drives and sensors like</text>
          <text x="98" y="128" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">the hyoid protects the brain</text>

          <rect x="10" y="142" width="175" height="58" rx="6" className="fill-white dark:fill-slate-950" />
          <text x="98" y="161" textAnchor="middle" className="sm" fill="#fbbf24">Principles used:</text>
          <text x="98" y="176" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Vibration isolation</text>
          <text x="98" y="191" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">Frequency separation</text>
        </g>

        <text x="315" y="450" textAnchor="middle" className="sm fill-gray-400 dark:fill-slate-500">
          Nature solved impact protection 25 million years ago — engineers are still catching up
        </text>
      </svg>
    </div>
  );
}
