export default function SeedGerminationDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Seed germination stages: from dormant seed to seedling, showing internal anatomy and requirements">
        <rect width="520" height="440" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" className="fill-lime-400" fontSize="14" fontWeight="bold">Germination — Waking Up a Seed</text>

        {/* SEED ANATOMY — top section */}
        <text x="100" y="55" textAnchor="middle" className="fill-amber-400" fontSize="12" fontWeight="bold">Inside a Seed</text>

        {/* Large seed cross-section */}
        <ellipse cx="100" cy="120" rx="55" ry="40" className="fill-amber-800 stroke-amber-500" strokeWidth="1.5" />
        {/* Seed coat */}
        <ellipse cx="100" cy="120" rx="55" ry="40" className="fill-none stroke-amber-400" strokeWidth="2.5" />

        {/* Embryo */}
        <ellipse cx="80" cy="118" rx="15" ry="10" className="fill-green-600" />
        <text x="80" y="122" textAnchor="middle" className="fill-green-200" fontSize="7">embryo</text>

        {/* Cotyledon (stored food) */}
        <path d="M 98,100 Q 130,105 135,120 Q 130,135 98,140 Q 105,120 98,100" className="fill-amber-600 stroke-amber-400" strokeWidth="0.5" />
        <text x="118" y="123" textAnchor="middle" className="fill-amber-200" fontSize="7">food</text>
        <text x="118" y="132" textAnchor="middle" className="fill-amber-200" fontSize="7">store</text>

        {/* Labels with lines */}
        <line x1="45" y1="110" x2="25" y2="90" className="stroke-amber-300" strokeWidth="0.8" />
        <text x="24" y="86" textAnchor="end" className="fill-amber-300" fontSize="8">Seed coat</text>
        <text x="24" y="96" textAnchor="end" className="fill-amber-300" fontSize="8">(protection)</text>

        <line x1="65" y1="115" x2="25" y2="130" className="stroke-green-300" strokeWidth="0.8" />
        <text x="24" y="128" textAnchor="end" className="fill-green-300" fontSize="8">Embryo</text>
        <text x="24" y="138" textAnchor="end" className="fill-green-300" fontSize="8">(baby plant)</text>

        <line x1="135" y1="120" x2="170" y2="105" className="stroke-amber-300" strokeWidth="0.8" />
        <text x="172" y="102" className="fill-amber-300" fontSize="8">Cotyledon</text>
        <text x="172" y="112" className="fill-amber-300" fontSize="8">(food = starch)</text>

        {/* THREE REQUIREMENTS — right side */}
        <text x="370" y="55" textAnchor="middle" className="fill-cyan-400" fontSize="12" fontWeight="bold">Three Requirements</text>

        {/* Water */}
        <rect x="280" y="68" width="60" height="45" rx="6" className="fill-blue-900/50 stroke-blue-500" strokeWidth="1" />
        <text x="310" y="86" textAnchor="middle" className="fill-blue-400" fontSize="18">💧</text>
        <text x="310" y="105" textAnchor="middle" className="fill-blue-300" fontSize="10">Water</text>

        {/* Warmth */}
        <rect x="350" y="68" width="60" height="45" rx="6" className="fill-orange-900/50 stroke-orange-500" strokeWidth="1" />
        <text x="380" y="86" textAnchor="middle" className="fill-orange-400" fontSize="18">☀</text>
        <text x="380" y="105" textAnchor="middle" className="fill-orange-300" fontSize="10">Warmth</text>

        {/* Oxygen */}
        <rect x="420" y="68" width="60" height="45" rx="6" className="fill-teal-900/50 stroke-teal-500" strokeWidth="1" />
        <text x="450" y="86" textAnchor="middle" className="fill-teal-400" fontSize="16">O₂</text>
        <text x="450" y="105" textAnchor="middle" className="fill-teal-300" fontSize="10">Oxygen</text>

        {/* Descriptions */}
        <text x="310" y="125" textAnchor="middle" className="fill-blue-300" fontSize="8">Softens coat,</text>
        <text x="310" y="135" textAnchor="middle" className="fill-blue-300" fontSize="8">activates enzymes</text>
        <text x="380" y="125" textAnchor="middle" className="fill-orange-300" fontSize="8">Speeds up</text>
        <text x="380" y="135" textAnchor="middle" className="fill-orange-300" fontSize="8">chemical reactions</text>
        <text x="450" y="125" textAnchor="middle" className="fill-teal-300" fontSize="8">Fuels cellular</text>
        <text x="450" y="135" textAnchor="middle" className="fill-teal-300" fontSize="8">respiration</text>

        {/* GERMINATION STAGES — bottom */}
        <text x="260" y="175" textAnchor="middle" className="fill-lime-400" fontSize="12" fontWeight="bold">Germination Timeline</text>

        {/* Ground line */}
        <line x1="20" y1="310" x2="500" y2="310" className="stroke-amber-800" strokeWidth="2" />
        <text x="510" y="314" className="fill-amber-700" fontSize="8">soil</text>

        {/* Stage 1: Dormant seed */}
        <g transform="translate(45, 280)">
          <ellipse cx="20" cy="25" rx="14" ry="10" className="fill-amber-700 stroke-amber-500" strokeWidth="1" />
          <text x="20" y="52" textAnchor="middle" className="fill-slate-400" fontSize="9">Dormant</text>
          <text x="20" y="63" textAnchor="middle" className="fill-slate-500" fontSize="8">Day 0</text>
        </g>

        {/* Stage 2: Water absorbed (imbibition) */}
        <g transform="translate(135, 270)">
          <ellipse cx="20" cy="30" rx="17" ry="13" className="fill-amber-600 stroke-blue-400" strokeWidth="1.5" />
          {/* Water drops */}
          <circle cx="5" cy="28" r="2" className="fill-blue-400" opacity="0.6" />
          <circle cx="35" cy="32" r="2" className="fill-blue-400" opacity="0.6" />
          <circle cx="15" cy="20" r="1.5" className="fill-blue-400" opacity="0.6" />
          <text x="20" y="57" textAnchor="middle" className="fill-blue-300" fontSize="9">Imbibition</text>
          <text x="20" y="68" textAnchor="middle" className="fill-slate-500" fontSize="8">Day 1–2</text>
        </g>

        {/* Stage 3: Radicle emerges */}
        <g transform="translate(225, 260)">
          <ellipse cx="20" cy="35" rx="15" ry="11" className="fill-amber-600" />
          {/* Root going down */}
          <path d="M 20,46 Q 18,60 20,75 Q 22,85 18,95" className="stroke-amber-100" strokeWidth="2" fill="none" />
          <text x="20" y="45" textAnchor="middle" className="fill-slate-400" fontSize="9">Radicle</text>
          <text x="20" y="77" textAnchor="middle" className="fill-slate-500" fontSize="8">Day 2–4</text>
        </g>

        {/* Stage 4: Shoot emerges */}
        <g transform="translate(315, 240)">
          <ellipse cx="20" cy="55" rx="14" ry="10" className="fill-amber-600" />
          {/* Root */}
          <path d="M 20,65 Q 18,80 22,95 Q 20,105 16,110" className="stroke-amber-100" strokeWidth="1.5" fill="none" />
          {/* Shoot going up */}
          <path d="M 20,45 Q 20,30 22,18" className="stroke-green-500" strokeWidth="2.5" fill="none" />
          <circle cx="22" cy="15" r="4" className="fill-green-500" />
          <text x="20" y="75" textAnchor="middle" className="fill-green-300" fontSize="9">Shoot</text>
          <text x="20" y="97" textAnchor="middle" className="fill-slate-500" fontSize="8">Day 4–7</text>
        </g>

        {/* Stage 5: Seedling */}
        <g transform="translate(405, 210)">
          {/* Root system */}
          <path d="M 20,95 Q 18,110 22,125 Q 20,135 16,140" className="stroke-amber-100" strokeWidth="1.5" fill="none" />
          <path d="M 20,110 Q 10,120 5,130" className="stroke-amber-100" strokeWidth="1" fill="none" />
          <path d="M 22,115 Q 30,125 35,130" className="stroke-amber-100" strokeWidth="1" fill="none" />
          {/* Stem */}
          <line x1="20" y1="95" x2="20" y2="30" className="stroke-green-600" strokeWidth="3" />
          {/* Leaves */}
          <ellipse cx="8" cy="32" rx="12" ry="5" className="fill-green-500" transform="rotate(-30, 8, 32)" />
          <ellipse cx="32" cy="28" rx="12" ry="5" className="fill-green-500" transform="rotate(30, 32, 28)" />
          <ellipse cx="14" cy="15" rx="10" ry="4" className="fill-green-400" transform="rotate(-20, 14, 15)" />
          <ellipse cx="26" cy="12" rx="10" ry="4" className="fill-green-400" transform="rotate(20, 26, 12)" />
          <text x="20" y="110" textAnchor="middle" className="fill-lime-300" fontSize="9">Seedling</text>
          <text x="20" y="123" textAnchor="middle" className="fill-slate-500" fontSize="8">Day 7–14</text>
        </g>

        {/* Timeline arrow */}
        <line x1="40" y1="395" x2="480" y2="395" className="stroke-lime-500" strokeWidth="1.5" markerEnd="url(#germArrow)" />
        <text x="260" y="415" textAnchor="middle" className="fill-lime-400" fontSize="10">Time →</text>

        {/* Dormancy note */}
        <rect x="20" y="425" width="480" height="14" rx="3" className="fill-amber-900/30" />
        <text x="260" y="436" textAnchor="middle" className="fill-amber-300" fontSize="10">Some seeds stay dormant for years — a 2,000-year-old date palm seed germinated in 2005</text>

        <defs>
          <marker id="germArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8" className="fill-lime-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
