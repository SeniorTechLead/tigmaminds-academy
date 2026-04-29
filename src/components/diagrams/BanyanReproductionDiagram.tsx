export default function BanyanReproductionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 530 428" className="w-full max-w-2xl mx-auto" role="img" aria-label="Banyan reproduction cycle: fig fruit to bird dispersal to epiphyte growth to strangler takeover">
        <rect width="500" height="400" rx="12" className="fill-white dark:fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Banyan Reproduction: The Strangler Cycle</text>

        {/* === STEP 1: Fig fruit (top-left) === */}
        <g>
          <rect x="20" y="55" width="110" height="90" rx="8" className="fill-green-900" opacity="0.4" />
          {/* Fig fruit */}
          <circle cx="75" cy="85" r="12" className="fill-green-500" />
          <circle cx="75" cy="85" r="8" className="fill-green-400" />
          <path d="M 75,73 L 75,68" className="stroke-green-700" strokeWidth="1.5" />
          <text x="75" y="115" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">1. Fig ripens</text>
          <text x="75" y="128" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">~750 tiny seeds</text>
          <text x="75" y="138" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">inside each fig</text>
        </g>

        {/* Arrow 1→2 */}
        <path d="M 130,90 Q 155,80 175,85" className="stroke-green-400" strokeWidth="1.5" fill="none" markerEnd="url(#reproArrow)" />

        {/* === STEP 2: Bird eats fig (top-center) === */}
        <g>
          <rect x="175" y="55" width="110" height="90" rx="8" className="fill-green-900" opacity="0.4" />
          {/* Bird */}
          <ellipse cx="230" cy="82" rx="12" ry="8" className="fill-amber-500" />
          <circle cx="220" cy="77" r="5" className="fill-amber-400" />
          <line x1="215" y1="77" x2="210" y2="78" className="stroke-amber-600" strokeWidth="1.5" />
          {/* Fig in beak */}
          <circle cx="212" cy="78" r="3" className="fill-green-500" />
          <text x="230" y="115" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">2. Bird eats fig</text>
          <text x="230" y="128" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Seeds survive</text>
          <text x="230" y="138" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">digestion</text>
        </g>

        {/* Arrow 2→3 */}
        <path d="M 285,90 Q 310,80 330,85" className="stroke-green-400" strokeWidth="1.5" fill="none" markerEnd="url(#reproArrow)" />

        {/* === STEP 3: Seed deposited on host (top-right) === */}
        <g>
          <rect x="330" y="55" width="140" height="90" rx="8" className="fill-green-900" opacity="0.4" />
          {/* Host tree branch */}
          <line x1="350" y1="90" x2="450" y2="85" className="stroke-amber-700" strokeWidth="4" />
          {/* Bird droppings with seed */}
          <circle cx="400" cy="82" r="3" className="fill-gray-500 dark:fill-slate-400" />
          <circle cx="400" cy="82" r="1.5" className="fill-green-400" />
          <text x="400" y="115" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">3. Seed lands</text>
          <text x="400" y="128" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">on host tree branch</text>
          <text x="400" y="138" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">via bird droppings</text>
        </g>

        {/* Arrow 3→4 */}
        <path d="M 400,148 Q 400,165 400,178" className="stroke-amber-400" strokeWidth="1.5" fill="none" markerEnd="url(#reproArrowAmber)" />

        {/* === STEP 4: Grows as epiphyte (middle-right) === */}
        <g>
          <rect x="330" y="178" width="140" height="90" rx="8" className="fill-amber-900" opacity="0.3" />
          {/* Host trunk */}
          <rect x="390" y="195" width="10" height="55" rx="2" className="fill-amber-700" />
          {/* Small banyan growing on branch */}
          <ellipse cx="395" cy="195" rx="15" ry="10" className="fill-green-500" opacity="0.6" />
          {/* Small root starting down */}
          <line x1="395" y1="205" x2="395" y2="245" className="stroke-amber-500" strokeWidth="1" strokeDasharray="2,2" />
          <text x="400" y="275" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">4. Grows as epiphyte</text>
          <text x="400" y="288" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">sends roots downward</text>
        </g>

        {/* Arrow 4→5 */}
        <path d="M 330,235 Q 310,240 290,240" className="stroke-amber-400" strokeWidth="1.5" fill="none" markerEnd="url(#reproArrowAmber)" />

        {/* === STEP 5: Aerial roots reach ground (middle-center) === */}
        <g>
          <rect x="155" y="178" width="135" height="110" rx="8" className="fill-amber-900" opacity="0.3" />
          {/* Host trunk being wrapped */}
          <rect x="215" y="195" width="12" height="70" rx="2" className="fill-slate-600" opacity="0.5" />
          {/* Banyan roots wrapping */}
          <path d="M 210,200 Q 200,220 218,240 Q 205,255 215,265" className="stroke-amber-500" strokeWidth="2" fill="none" />
          <path d="M 230,200 Q 240,220 222,240 Q 235,255 225,265" className="stroke-amber-500" strokeWidth="2" fill="none" />
          {/* Banyan canopy growing */}
          <ellipse cx="222" cy="195" rx="30" ry="15" className="fill-green-600" opacity="0.6" />
          <text x="222" y="298" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">5. Roots wrap host</text>
          <text x="222" y="311" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">roots thicken, encircle</text>
        </g>

        {/* Arrow 5→6 */}
        <path d="M 155,240 Q 130,240 110,240" className="stroke-amber-400" strokeWidth="1.5" fill="none" markerEnd="url(#reproArrowAmber)" />

        {/* === STEP 6: Host dies, banyan stands alone (middle-left) === */}
        <g>
          <rect x="15" y="178" width="130" height="140" rx="8" className="fill-amber-900" opacity="0.3" />
          {/* Large banyan (hollow center where host was) */}
          <rect x="60" y="210" width="25" height="70" rx="3" className="fill-amber-700" />
          {/* Hollow center */}
          <rect x="67" y="220" width="11" height="50" rx="2" className="fill-gray-100 dark:fill-slate-800" />
          {/* Wide canopy */}
          <ellipse cx="72" cy="200" rx="45" ry="25" className="fill-green-600" opacity="0.7" />
          {/* Aerial roots */}
          <line x1="40" y1="210" x2="35" y2="280" className="stroke-amber-600" strokeWidth="2" />
          <line x1="105" y1="210" x2="110" y2="280" className="stroke-amber-600" strokeWidth="2" />
          <text x="80" y="298" textAnchor="middle" className="fill-amber-300" fontSize="9" fontWeight="bold">6. Host dies</text>
          <text x="80" y="311" textAnchor="middle" className="fill-green-300" fontSize="7">Banyan stands alone</text>
          <text x="80" y="323" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">hollow trunk remains</text>
        </g>

        {/* Bottom summary */}
        <rect x="50" y="345" width="400" height="45" rx="8" className="fill-green-900" opacity="0.5" />
        <text x="250" y="362" textAnchor="middle" className="fill-green-300" fontSize="9" fontWeight="bold">This process takes 50-100 years from seed to independent tree</text>
        <text x="250" y="378" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">The &quot;strangler fig&quot; strategy is why banyans can grow in forests with no gap in the canopy</text>

        <defs>
          <marker id="reproArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-green-400" />
          </marker>
          <marker id="reproArrowAmber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" className="fill-amber-400" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
