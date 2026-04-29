export default function ActivityVortexDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 630 424"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Vortex in a bowl experiment: stir water with finger to create a cyclone-like vortex"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          .step { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinning { animation: spin 3s linear infinite; transform-origin: 420px 200px; }
        `}</style>

        {/* Background */}
        <rect width="600" height="380" rx="8" className="fill-slate-900" />

        {/* Title */}
        <text x="300" y="28" textAnchor="middle" className="title fill-amber-300">
          Try This: Make a Vortex in a Bowl
        </text>

        {/* --- Step 1: Stir (left side) --- */}
        <text x="150" y="60" textAnchor="middle" className="step fill-blue-400">Step 1: Stir</text>

        {/* Bowl side view */}
        <path d="M 50 180 Q 50 290 150 290 Q 250 290 250 180"
          fill="none" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Bowl base */}
        <ellipse cx="150" cy="290" rx="100" ry="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Water fill */}
        <path d="M 55 185 Q 55 280 150 280 Q 245 280 245 185 Z"
          fill="#1e40af" opacity="0.3" />
        {/* Water surface */}
        <ellipse cx="150" cy="185" rx="95" ry="18" fill="#3b82f6" opacity="0.3" />

        {/* Finger stirring */}
        <g transform="translate(150, 140)">
          {/* Finger */}
          <rect x="-6" y="-60" width="12" height="65" rx="6" fill="#d4a574" />
          <ellipse cx="0" cy="5" rx="6" ry="4" fill="#c4956a" />
          {/* Fingernail */}
          <ellipse cx="0" cy="-58" rx="5" ry="3" fill="#e8c9a8" />
        </g>

        {/* Circular motion arrows around finger */}
        <path d="M 115 185 Q 115 165 150 165" fill="none" stroke="#60a5fa" strokeWidth="1.5"
          strokeDasharray="4,2" />
        <path d="M 150 165 Q 185 165 185 185" fill="none" stroke="#60a5fa" strokeWidth="1.5"
          strokeDasharray="4,2" />
        <polygon points="185,185 181,178 189,178" fill="#60a5fa" />

        {/* Circular arrow */}
        <path d="M 185 205 Q 185 220 150 220" fill="none" stroke="#60a5fa" strokeWidth="1.5"
          strokeDasharray="4,2" />
        <path d="M 150 220 Q 115 220 115 205" fill="none" stroke="#60a5fa" strokeWidth="1.5"
          strokeDasharray="4,2" />
        <polygon points="115,205 119,212 111,212" fill="#60a5fa" />

        <text x="150" y="315" textAnchor="middle" className="label fill-slate-400">
          Stir fast in circles
        </text>

        {/* Arrow between steps */}
        <line x1="270" y1="200" x2="310" y2="200" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="315,200 305,195 305,205" className="fill-gray-500 dark:fill-slate-400" />
        <text x="292" y="190" textAnchor="middle" className="small fill-slate-500">lift</text>
        <text x="292" y="218" textAnchor="middle" className="small fill-slate-500">finger</text>

        {/* --- Step 2: Vortex forms (right side) --- */}
        <text x="420" y="60" textAnchor="middle" className="step fill-green-400">Step 2: Vortex!</text>

        {/* Bowl side view */}
        <path d="M 320 180 Q 320 290 420 290 Q 520 290 520 180"
          fill="none" stroke="#94a3b8" strokeWidth="2.5" />
        <ellipse cx="420" cy="290" rx="100" ry="10" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Water fill — with vortex dip */}
        <path d="M 325 185 Q 325 280 420 280 Q 515 280 515 185 Z"
          fill="#1e40af" opacity="0.3" />

        {/* Water surface with vortex depression */}
        <path d="M 325 185 Q 350 175 380 180 Q 400 195 420 215 Q 440 195 460 180 Q 490 175 515 185"
          fill="#1e40af" opacity="0.25" />
        <path d="M 325 185 Q 350 175 380 180 Q 400 195 420 215 Q 440 195 460 180 Q 490 175 515 185"
          fill="none" stroke="#60a5fa" strokeWidth="1.5" />

        {/* Spiral water lines */}
        <path d="M 380 190 Q 395 190 400 200 Q 405 210 420 210"
          fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.6" />
        <path d="M 460 190 Q 445 190 440 200 Q 435 210 420 210"
          fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.6" />
        <path d="M 390 220 Q 400 225 410 230 Q 415 240 420 245"
          fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
        <path d="M 450 220 Q 440 225 430 230 Q 425 240 420 245"
          fill="none" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />

        {/* Food coloring spiraling in */}
        <path d="M 350 185 Q 370 195 390 205 Q 405 215 415 225"
          fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
        <path d="M 490 185 Q 470 195 450 205 Q 435 215 425 225"
          fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.7" />

        {/* Food coloring drops on edge */}
        <circle cx="348" cy="183" r="4" fill="#ef4444" opacity="0.8" />
        <circle cx="492" cy="183" r="4" fill="#22c55e" opacity="0.8" />

        {/* Labels */}
        <line x1="348" y1="175" x2="348" y2="100" stroke="#ef4444" strokeWidth="0.8" />
        <text x="348" y="95" textAnchor="middle" className="small fill-red-400">Red food</text>
        <text x="348" y="105" textAnchor="middle" className="small fill-red-400">coloring</text>

        <line x1="492" y1="175" x2="492" y2="100" stroke="#22c55e" strokeWidth="0.8" />
        <text x="492" y="95" textAnchor="middle" className="small fill-green-400">Green food</text>
        <text x="492" y="105" textAnchor="middle" className="small fill-green-400">coloring</text>

        {/* Eye label */}
        <line x1="420" y1="215" x2="420" y2="130" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="3,2" />
        <text x="420" y="125" textAnchor="middle" className="label fill-amber-400">Vortex eye</text>
        <text x="420" y="137" textAnchor="middle" className="small fill-amber-300">center dips down</text>

        <text x="420" y="315" textAnchor="middle" className="label fill-slate-400">
          Watch the spiral form
        </text>

        {/* Bottom instruction */}
        <rect x="140" y="338" width="320" height="30" rx="4" className="fill-gray-100 dark:fill-slate-800" />
        <text x="300" y="358" textAnchor="middle" className="label fill-cyan-300">
          Stir fast, lift finger → vortex = cyclone eye
        </text>

        {/* Materials list */}
        <text x="40" y="350" className="small fill-slate-500">You need:</text>
        <text x="40" y="362" className="small fill-slate-500">Bowl, water,</text>
        <text x="40" y="374" className="small fill-slate-500">food coloring</text>
      </svg>
    </div>
  );
}
