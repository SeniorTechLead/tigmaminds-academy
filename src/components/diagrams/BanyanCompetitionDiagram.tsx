export default function BanyanCompetitionDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 560 443" className="w-full max-w-lg mx-auto" role="img" aria-label="Forest canopy layers showing competition for light: emergent, canopy, understory, forest floor, and the banyan's spreading strategy">
        <rect width="500" height="420" rx="12" className="fill-slate-900" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" className="fill-amber-400" fontSize="14" fontWeight="bold">Competition for Light</text>
        <text x="250" y="44" textAnchor="middle" className="fill-slate-400" fontSize="10">Forest canopy layers &amp; the banyan&apos;s strategy</text>

        {/* Sun and light rays */}
        <circle cx="250" cy="65" r="15" className="fill-yellow-400" />
        {[0, 30, 60, 90, 120, 150, 180].map(angle => {
          const rad = ((angle + 180) * Math.PI) / 180;
          return (
            <line key={angle}
              x1={250 + Math.cos(rad) * 20} y1={65 + Math.sin(rad) * 20}
              x2={250 + Math.cos(rad) * 30} y2={65 + Math.sin(rad) * 30}
              className="stroke-yellow-400" strokeWidth="1.5" strokeLinecap="round" />
          );
        })}

        {/* Light arrows going down, diminishing */}
        <line x1="150" y1="80" x2="150" y2="110" className="stroke-yellow-400" strokeWidth="2" opacity="0.9" />
        <line x1="250" y1="80" x2="250" y2="110" className="stroke-yellow-400" strokeWidth="2" opacity="0.9" />
        <line x1="350" y1="80" x2="350" y2="110" className="stroke-yellow-400" strokeWidth="2" opacity="0.9" />
        <text x="430" y="95" className="fill-yellow-400" fontSize="8">100% light</text>

        {/* === LAYER 1: Emergent (top) === */}
        <rect x="30" y="108" width="440" height="50" rx="0" className="fill-green-900" opacity="0.25" />
        {/* Tall emergent tree */}
        <rect x="340" y="98" width="8" height="60" className="fill-amber-700" />
        <ellipse cx="344" cy="95" rx="25" ry="18" className="fill-green-500" opacity="0.7" />
        <text x="40" y="128" className="fill-green-300" fontSize="10" fontWeight="bold">Emergent</text>
        <text x="40" y="142" className="fill-slate-400" fontSize="8">40-50 m — tallest trees</text>

        {/* Light reaching canopy */}
        <line x1="150" y1="110" x2="150" y2="160" className="stroke-yellow-400" strokeWidth="1.5" opacity="0.6" />
        <line x1="250" y1="110" x2="250" y2="160" className="stroke-yellow-400" strokeWidth="1.5" opacity="0.6" />
        <text x="430" y="145" className="fill-yellow-300" fontSize="8" opacity="0.7">50% light</text>

        {/* === LAYER 2: Canopy === */}
        <rect x="30" y="158" width="440" height="60" rx="0" className="fill-green-900" opacity="0.35" />
        {/* Banyan canopy - WIDE spreading */}
        <ellipse cx="200" cy="175" rx="90" ry="25" className="fill-green-600" opacity="0.7" />
        <rect x="196" y="175" width="8" height="80" className="fill-amber-700" />
        {/* Other canopy trees */}
        <ellipse cx="380" cy="180" rx="35" ry="20" className="fill-green-700" opacity="0.6" />
        <rect x="378" y="180" width="5" height="60" className="fill-amber-800" />
        <text x="40" y="182" className="fill-green-300" fontSize="10" fontWeight="bold">Canopy</text>
        <text x="40" y="196" className="fill-slate-400" fontSize="8">25-35 m — most light captured</text>

        {/* Banyan strategy callout */}
        <line x1="250" y1="168" x2="320" y2="152" className="stroke-amber-400" strokeWidth="1" />
        <text x="322" y="155" className="fill-amber-300" fontSize="8" fontWeight="bold">Banyan spreads WIDE</text>

        {/* Light reaching understory */}
        <line x1="150" y1="160" x2="150" y2="220" className="stroke-yellow-400" strokeWidth="1" opacity="0.3" strokeDasharray="3,3" />
        <text x="430" y="205" className="fill-yellow-200" fontSize="8" opacity="0.5">5% light</text>

        {/* === LAYER 3: Understory === */}
        <rect x="30" y="218" width="440" height="55" rx="0" className="fill-green-900" opacity="0.45" />
        {/* Small trees */}
        <rect x="100" y="230" width="4" height="40" className="fill-amber-800" />
        <ellipse cx="102" cy="228" rx="15" ry="10" className="fill-green-800" opacity="0.6" />
        <rect x="300" y="235" width="4" height="35" className="fill-amber-800" />
        <ellipse cx="302" cy="233" rx="12" ry="8" className="fill-green-800" opacity="0.6" />
        {/* Banyan aerial roots dropping down */}
        <line x1="140" y1="190" x2="135" y2="270" className="stroke-amber-600" strokeWidth="2" />
        <line x1="260" y1="190" x2="265" y2="270" className="stroke-amber-600" strokeWidth="2" />
        <text x="40" y="242" className="fill-green-300" fontSize="10" fontWeight="bold">Understory</text>
        <text x="40" y="256" className="fill-slate-400" fontSize="8">5-25 m — shade-tolerant</text>

        {/* Light reaching floor */}
        <text x="430" y="262" className="fill-yellow-200" fontSize="8" opacity="0.3">1% light</text>

        {/* === LAYER 4: Forest Floor === */}
        <rect x="30" y="273" width="440" height="55" rx="0" className="fill-green-900" opacity="0.55" />
        {/* Ferns and seedlings */}
        {[80, 160, 240, 360, 420].map((x, i) => (
          <path key={i} d={`M ${x},325 Q ${x - 5},315 ${x - 10},325 M ${x},325 Q ${x + 5},315 ${x + 10},325`} className="stroke-green-600" strokeWidth="1" fill="none" />
        ))}
        <text x="40" y="295" className="fill-green-300" fontSize="10" fontWeight="bold">Forest Floor</text>
        <text x="40" y="309" className="fill-slate-400" fontSize="8">0-5 m — very little light</text>

        {/* Ground */}
        <line x1="30" y1="328" x2="470" y2="328" className="stroke-amber-800" strokeWidth="1.5" />

        {/* Banyan strategy box */}
        <rect x="50" y="345" width="400" height="60" rx="8" className="fill-green-900" opacity="0.5" />
        <text x="250" y="363" textAnchor="middle" className="fill-amber-300" fontSize="10" fontWeight="bold">The Banyan&apos;s Strategy</text>
        <text x="250" y="378" textAnchor="middle" className="fill-green-300" fontSize="9">Instead of growing taller, the banyan spreads horizontally</text>
        <text x="250" y="393" textAnchor="middle" className="fill-slate-400" fontSize="8">Aerial roots become new trunks, letting the canopy expand outward indefinitely</text>
      </svg>
    </div>
  );
}
