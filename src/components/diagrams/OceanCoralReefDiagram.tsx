export default function OceanCoralReefDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing coral reef structure with polyps, zooxanthellae, and reef zones">
        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Coral Reefs: Underwater Cities
        </text>

        {/* Sunlight */}
        <line x1="260" y1="38" x2="260" y2="70" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />
        <line x1="200" y1="38" x2="220" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />
        <line x1="320" y1="38" x2="300" y2="70" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" />
        <text x="260" y="50" textAnchor="middle" fontSize="10" fill="#fbbf24">Sunlight (essential)</text>

        {/* Water */}
        <rect x="10" y="60" width="500" height="230" rx="4" fill="#0c4a6e" opacity="0.3" />

        {/* Reef crest */}
        <path d="M 60 240 Q 100 180, 160 170 Q 200 165, 240 175 Q 280 180, 320 168 Q 360 160, 400 175 Q 440 185, 470 210"
          fill="#ca8a04" opacity="0.6" stroke="#a16207" strokeWidth="1.5" />

        {/* Coral branches */}
        {/* Branching coral */}
        <line x1="140" y1="170" x2="130" y2="140" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />
        <line x1="130" y1="140" x2="120" y2="120" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        <line x1="130" y1="140" x2="145" y2="118" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        <text x="133" y="112" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f9a8d4">Branching coral</text>

        {/* Brain coral */}
        <ellipse cx="250" cy="165" rx="22" ry="14" fill="#a3e635" opacity="0.7" stroke="#65a30d" strokeWidth="1" />
        <path d="M 235 162 Q 245 158, 255 162 Q 262 166, 265 162" fill="none" stroke="#4d7c0f" strokeWidth="1" />
        <path d="M 238 168 Q 248 164, 258 168" fill="none" stroke="#4d7c0f" strokeWidth="1" />
        <text x="250" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#bef264">Brain coral</text>

        {/* Table coral */}
        <line x1="370" y1="175" x2="370" y2="155" stroke="#fb923c" strokeWidth="3" />
        <line x1="345" y1="155" x2="395" y2="155" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
        <text x="370" y="148" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fdba74">Table coral</text>

        {/* Fish */}
        <text x="185" y="130" fontSize="14">&#x1F41F;</text>
        <text x="310" y="120" fontSize="12">&#x1F420;</text>
        <text x="420" y="140" fontSize="11">&#x1F41F;</text>

        {/* Sea turtle */}
        <text x="80" y="110" fontSize="16">&#x1F422;</text>

        {/* Reef base / limestone */}
        <rect x="60" y="240" width="410" height="50" rx="4" fill="#78716c" opacity="0.5" />
        <text x="265" y="262" textAnchor="middle" fontSize="10" fill="#d6d3d1">Limestone skeleton (calcium carbonate)</text>
        <text x="265" y="276" textAnchor="middle" fontSize="10" fill="#a8a29e">Built by generations of coral polyps</text>

        {/* Zoomed polyp section */}
        <rect x="15" y="295" width="240" height="75" rx="6" fill="none" stroke="#f472b6" strokeWidth="1" />
        <text x="135" y="312" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f9a8d4">Coral Polyp (zoomed)</text>
        {/* Polyp body */}
        <rect x="80" y="320" width="20" height="25" rx="4" fill="#fda4af" opacity="0.6" />
        {/* Tentacles */}
        <line x1="82" y1="320" x2="75" y2="308" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="87" y1="320" x2="84" y2="306" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="93" y1="320" x2="96" y2="306" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="98" y1="320" x2="105" y2="308" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
        {/* Zooxanthellae dots */}
        <circle cx="86" cy="332" r="3" fill="#84cc16" />
        <circle cx="94" cy="328" r="3" fill="#84cc16" />
        <circle cx="90" cy="338" r="3" fill="#84cc16" />
        <text x="135" y="330" fontSize="10" fill="#bef264">Zooxanthellae (algae) live</text>
        <text x="135" y="342" fontSize="10" fill="#bef264">inside coral tissue</text>
        <text x="135" y="356" fontSize="10" fill="#fbbf24">Algae photosynthesise = 90% of coral's energy</text>

        {/* Bleaching info */}
        <rect x="270" y="295" width="235" height="75" rx="6" fill="none" stroke="#f87171" strokeWidth="1" />
        <text x="387" y="312" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fca5a5">Coral Bleaching</text>
        <text x="387" y="328" textAnchor="middle" fontSize="10" fill="#94a3b8">Water warms +1-2 degrees C</text>
        <text x="387" y="342" textAnchor="middle" fontSize="10" fill="#94a3b8">Coral expels zooxanthellae</text>
        <text x="387" y="356" textAnchor="middle" fontSize="10" fill="#94a3b8">Turns white, starves, dies</text>
        <text x="387" y="370" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f87171">50% of reefs lost since 1950s</text>
      </svg>
    </div>
  );
}
