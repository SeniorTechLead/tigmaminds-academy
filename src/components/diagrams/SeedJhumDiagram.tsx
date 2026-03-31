export default function SeedJhumDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Jhum shifting cultivation cycle in Nagaland showing how it preserves seed diversity">
        <rect width="520" height="440" rx="12" className="fill-white dark:fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" className="fill-emerald-400" fontSize="14" fontWeight="bold">Jhum (Shifting Cultivation) — Nagaland</text>

        {/* Circular cycle layout */}
        {/* Center circle */}
        <circle cx="260" cy="215" r="35" className="fill-emerald-900/30 stroke-emerald-500" strokeWidth="1.5" />
        <text x="260" y="210" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="bold">Jhum</text>
        <text x="260" y="222" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="bold">Cycle</text>
        <text x="260" y="237" textAnchor="middle" className="fill-emerald-300" fontSize="8">8–15 years</text>

        {/* Stage 1: Select hillside (top) */}
        <g transform="translate(210, 45)">
          <rect width="100" height="65" rx="8" className="fill-green-900/40 stroke-green-500" strokeWidth="1" />
          <text x="50" y="18" textAnchor="middle" className="fill-green-400" fontSize="10" fontWeight="bold">1. Select</text>
          {/* Hill */}
          <polygon points="20,55 50,25 80,55" className="fill-green-700/60" />
          <text x="50" y="50" textAnchor="middle" className="fill-green-300" fontSize="8">forest hill</text>
        </g>
        <line x1="260" y1="110" x2="260" y2="178" className="stroke-green-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Stage 2: Clear & burn (right) */}
        <g transform="translate(385, 140)">
          <rect width="115" height="65" rx="8" className="fill-orange-900/40 stroke-orange-500" strokeWidth="1" />
          <text x="57" y="18" textAnchor="middle" className="fill-orange-400" fontSize="10" fontWeight="bold">2. Clear & Burn</text>
          {/* Fire icon */}
          <path d="M 45,50 Q 50,30 55,40 Q 60,25 57,50 Q 65,35 60,50 L 40,50 Z" className="fill-orange-500/60" />
          <text x="57" y="58" textAnchor="middle" className="fill-orange-300" fontSize="8">ash = fertilizer</text>
        </g>
        <line x1="297" y1="200" x2="383" y2="175" className="stroke-orange-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Stage 3: Plant many crops (right-bottom) */}
        <g transform="translate(385, 240)">
          <rect width="115" height="75" rx="8" className="fill-amber-900/40 stroke-amber-500" strokeWidth="1" />
          <text x="57" y="18" textAnchor="middle" className="fill-amber-400" fontSize="10" fontWeight="bold">3. Plant Mixed</text>
          {/* Different seeds */}
          <circle cx="25" cy="35" r="4" className="fill-amber-500" />
          <circle cx="40" cy="40" r="3" className="fill-red-500" />
          <circle cx="55" cy="33" r="5" className="fill-green-500" />
          <circle cx="70" cy="38" r="3.5" className="fill-yellow-500" />
          <circle cx="85" cy="35" r="4" className="fill-purple-400" />
          <text x="57" y="58" textAnchor="middle" className="fill-amber-300" fontSize="8">10–20 crops</text>
          <text x="57" y="68" textAnchor="middle" className="fill-amber-300" fontSize="8">together</text>
        </g>
        <line x1="297" y1="230" x2="383" y2="260" className="stroke-amber-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Stage 4: Harvest & save seeds (bottom) */}
        <g transform="translate(210, 330)">
          <rect width="100" height="65" rx="8" className="fill-cyan-900/40 stroke-cyan-500" strokeWidth="1" />
          <text x="50" y="18" textAnchor="middle" className="fill-cyan-400" fontSize="10" fontWeight="bold">4. Harvest</text>
          {/* Bamboo tubes */}
          <rect x="15" y="25" width="10" height="25" rx="2" className="fill-amber-700 stroke-amber-500" strokeWidth="0.5" />
          <rect x="30" y="25" width="10" height="25" rx="2" className="fill-amber-700 stroke-amber-500" strokeWidth="0.5" />
          <rect x="45" y="25" width="10" height="25" rx="2" className="fill-amber-700 stroke-amber-500" strokeWidth="0.5" />
          <rect x="60" y="25" width="10" height="25" rx="2" className="fill-amber-700 stroke-amber-500" strokeWidth="0.5" />
          <rect x="75" y="25" width="10" height="25" rx="2" className="fill-amber-700 stroke-amber-500" strokeWidth="0.5" />
          <text x="50" y="60" textAnchor="middle" className="fill-cyan-300" fontSize="8">save best seeds</text>
        </g>
        <line x1="260" y1="252" x2="260" y2="328" className="stroke-cyan-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Stage 5: Fallow & regrow (left-bottom) */}
        <g transform="translate(20, 240)">
          <rect width="115" height="75" rx="8" className="fill-emerald-900/40 stroke-emerald-500" strokeWidth="1" />
          <text x="57" y="18" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="bold">5. Fallow</text>
          {/* Trees regrowing */}
          <line x1="25" y1="60" x2="25" y2="35" className="stroke-green-600" strokeWidth="2" />
          <circle cx="25" cy="30" r="8" className="fill-green-600/60" />
          <line x1="57" y1="60" x2="57" y2="30" className="stroke-green-700" strokeWidth="2" />
          <circle cx="57" cy="25" r="10" className="fill-green-700/60" />
          <line x1="87" y1="60" x2="87" y2="38" className="stroke-green-500" strokeWidth="2" />
          <circle cx="87" cy="33" r="7" className="fill-green-500/60" />
          <text x="57" y="72" textAnchor="middle" className="fill-emerald-300" fontSize="8">forest regrows</text>
        </g>
        <line x1="223" y1="240" x2="137" y2="265" className="stroke-emerald-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Stage 6: Move to new plot (left-top) */}
        <g transform="translate(20, 140)">
          <rect width="115" height="65" rx="8" className="fill-violet-900/40 stroke-violet-500" strokeWidth="1" />
          <text x="57" y="18" textAnchor="middle" className="fill-violet-400" fontSize="10" fontWeight="bold">6. Move On</text>
          {/* Arrow to new hill */}
          <path d="M 30,45 Q 57,30 85,45" className="stroke-violet-400" strokeWidth="1.5" fill="none" markerEnd="url(#jhumArrow2)" />
          <text x="57" y="58" textAnchor="middle" className="fill-violet-300" fontSize="8">new hillside</text>
        </g>
        <line x1="137" y1="172" x2="223" y2="200" className="stroke-violet-500" strokeWidth="1" markerEnd="url(#jhumArrow)" />

        {/* Key insight box */}
        <rect x="25" y="405" width="470" height="30" rx="6" className="fill-emerald-900/30 stroke-emerald-600" strokeWidth="1" />
        <text x="260" y="418" textAnchor="middle" className="fill-emerald-300" fontSize="10">Mixed planting + seed saving = each village maintains 50–100 crop varieties</text>
        <text x="260" y="430" textAnchor="middle" className="fill-emerald-300" fontSize="10">Every variety carries unique genes for pests, drought, soil, and season</text>

        <defs>
          <marker id="jhumArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" className="fill-emerald-500" />
          </marker>
          <marker id="jhumArrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" className="fill-violet-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
