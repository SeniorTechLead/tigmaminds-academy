export default function WoodpeckerHyoidDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 399"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Hyoid bone wrapping around the woodpecker skull like a seatbelt"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes trace { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:0} }
          .hyoid-trace { stroke-dasharray: 400; animation: trace 3s ease-in-out infinite; }
        `}</style>

        <rect width="600" height="380" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="30" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          The Hyoid Bone: Nature's Seatbelt
        </text>

        {/* Woodpecker skull - side view */}
        <g transform="translate(150, 50)">
          {/* Skull outline */}
          <ellipse cx="120" cy="120" rx="90" ry="100" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="2.5" />

          {/* Brain area */}
          <ellipse cx="110" cy="110" rx="55" ry="60" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1" />
          <text x="110" y="115" textAnchor="middle" className="label" fill="#86efac">Brain</text>

          {/* Eye */}
          <circle cx="165" cy="95" r="10" className="fill-white dark:fill-slate-950" stroke="#f8fafc" strokeWidth="1.5" />
          <circle cx="167" cy="93" r="3" className="fill-gray-900 dark:fill-slate-50" />

          {/* Beak */}
          <polygon points="210,115 310,110 310,125 210,125" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />

          {/* Red crest */}
          <path d="M70,30 Q120,5 170,30 Q140,50 90,50 Z" fill="#dc2626" opacity="0.85" />

          {/* HYOID BONE - the star of the show */}
          {/* Starts at base of beak, wraps under jaw, around back, over top */}
          <path
            d="M210,120 C200,140 160,165 120,170 C70,175 30,150 20,120 C10,80 15,40 40,25 C70,8 110,8 140,20"
            fill="none" stroke="#dc2626" strokeWidth="4" className="hyoid-trace"
          />
          {/* Static hyoid for visibility */}
          <path
            d="M210,120 C200,140 160,165 120,170 C70,175 30,150 20,120 C10,80 15,40 40,25 C70,8 110,8 140,20"
            fill="none" stroke="#dc2626" strokeWidth="4" opacity="0.3"
          />

          {/* Hyoid label with arrow */}
          <line x1="-20" y1="120" x2="15" y2="120" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 2" />
        </g>

        {/* Label for hyoid */}
        <text x="100" y="168" textAnchor="middle" className="label" fill="#fca5a5" fontWeight="600">Hyoid bone</text>
        <text x="100" y="182" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">wraps 270 around skull</text>

        {/* Seatbelt analogy - bottom section */}
        <line x1="50" y1="280" x2="550" y2="280" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" />

        <text x="300" y="300" textAnchor="middle" className="label fill-gray-500 dark:fill-slate-400">
          Analogy: Just like a seatbelt
        </text>

        {/* Car seatbelt mini diagram */}
        <g transform="translate(120, 310)">
          {/* Person */}
          <circle cx="40" cy="15" r="12" fill="#475569" />
          <rect x="30" y="27" width="20" height="30" rx="4" fill="#475569" />
          {/* Seatbelt */}
          <line x1="18" y1="20" x2="50" y2="55" stroke="#dc2626" strokeWidth="3" />
          <text x="40" y="75" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Seatbelt holds</text>
          <text x="40" y="86" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">body in place</text>
        </g>

        {/* Equals sign */}
        <text x="280" y="345" textAnchor="middle" className="title fill-gray-400 dark:fill-slate-500">=</text>

        {/* Hyoid mini */}
        <g transform="translate(350, 310)">
          <ellipse cx="50" cy="25" rx="30" ry="28" className="fill-gray-100 dark:fill-slate-800" stroke="#d97706" strokeWidth="1.5" />
          <path d="M80,22 C75,45 30,55 20,35 C10,15 20,5 40,8" fill="none" stroke="#dc2626" strokeWidth="3" />
          <circle cx="50" cy="20" r="12" fill="#22c55e" opacity="0.2" />
          <text x="50" y="75" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Hyoid holds</text>
          <text x="50" y="86" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">brain in place</text>
        </g>
      </svg>
    </div>
  );
}
