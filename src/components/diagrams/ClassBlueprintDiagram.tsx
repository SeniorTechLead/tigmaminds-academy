/**
 * Visual diagram showing class as blueprint → instances as concrete objects.
 * Left: the class template. Right: two instances with their own data.
 */
export default function ClassBlueprintDiagram() {
  const totalW = 520;
  const totalH = 280;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full max-w-xl mx-auto" role="img" aria-label="Class blueprint creating two elephant tracker instances">
      {/* Title */}
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Class → Instance
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        One blueprint, many objects
      </text>

      {/* ── CLASS (blueprint) ── */}
      <g transform="translate(20, 48)">
        {/* Dashed border = template */}
        <rect x="0" y="0" width="155" height="195" rx="12"
          className="fill-violet-50 dark:fill-violet-900/15 stroke-violet-400 dark:stroke-violet-600"
          strokeWidth="2" strokeDasharray="6 3" />

        {/* Class header */}
        <rect x="0" y="0" width="155" height="32" rx="12"
          className="fill-violet-200 dark:fill-violet-800/50 stroke-violet-400 dark:stroke-violet-600"
          strokeWidth="2" />
        <text x="78" y="21" textAnchor="middle" className="fill-violet-800 dark:fill-violet-200" fontSize="12" fontWeight="800" fontFamily="monospace">
          ElephantTracker
        </text>

        {/* Attributes section */}
        <text x="12" y="52" className="fill-violet-600 dark:fill-violet-400" fontSize="9" fontWeight="700">ATTRIBUTES</text>
        <text x="12" y="67" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">self.name</text>
        <text x="12" y="82" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">self.species</text>
        <text x="12" y="97" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">self.sightings</text>

        {/* Methods section */}
        <line x1="10" y1="108" x2="145" y2="108" className="stroke-violet-300 dark:stroke-violet-700" strokeWidth="1" />
        <text x="12" y="124" className="fill-violet-600 dark:fill-violet-400" fontSize="9" fontWeight="700">METHODS</text>
        <text x="12" y="139" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">__init__()</text>
        <text x="12" y="154" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">record_sighting()</text>
        <text x="12" y="169" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">total_sightings()</text>
        <text x="12" y="184" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontFamily="monospace">__str__()</text>

        {/* Blueprint label */}
        <text x="78" y="-8" textAnchor="middle" className="fill-violet-500 dark:fill-violet-400" fontSize="9" fontWeight="700">
          BLUEPRINT (class)
        </text>
      </g>

      {/* ── Arrows ── */}
      <g>
        {/* Arrow to instance 1 */}
        <line x1="175" y1="120" x2="220" y2="90" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <polygon points="218,86 224,90 218,94" className="fill-gray-400 dark:fill-gray-500" />
        {/* Arrow to instance 2 */}
        <line x1="175" y1="170" x2="220" y2="200" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" />
        <polygon points="218,196 224,200 218,204" className="fill-gray-400 dark:fill-gray-500" />

        <text x="198" y="145" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8" fontWeight="600" transform="rotate(-15, 198, 145)">
          creates
        </text>
      </g>

      {/* ── INSTANCE 1: Ranga ── */}
      <g transform="translate(225, 48)">
        <rect x="0" y="0" width="145" height="100" rx="10"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-400 dark:stroke-amber-600"
          strokeWidth="2" />
        <rect x="0" y="0" width="145" height="28" rx="10"
          className="fill-amber-200 dark:fill-amber-800/40 stroke-amber-400 dark:stroke-amber-600"
          strokeWidth="2" />
        <text x="72" y="18" textAnchor="middle" className="fill-amber-800 dark:fill-amber-200" fontSize="11" fontWeight="800" fontFamily="monospace">
          ranga
        </text>

        <text x="10" y="46" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          name = "Ranga"
        </text>
        <text x="10" y="60" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          species = "Asian"
        </text>
        <text x="10" y="74" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          sightings = [▪▪]
        </text>
        <text x="10" y="90" className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontWeight="600">
          2 sightings recorded
        </text>

        <text x="72" y="-8" textAnchor="middle" className="fill-amber-500 dark:fill-amber-400" fontSize="9" fontWeight="700">
          INSTANCE 1
        </text>
      </g>

      {/* ── INSTANCE 2: Mohini ── */}
      <g transform="translate(225, 164)">
        <rect x="0" y="0" width="145" height="100" rx="10"
          className="fill-sky-50 dark:fill-sky-900/20 stroke-sky-400 dark:stroke-sky-600"
          strokeWidth="2" />
        <rect x="0" y="0" width="145" height="28" rx="10"
          className="fill-sky-200 dark:fill-sky-800/40 stroke-sky-400 dark:stroke-sky-600"
          strokeWidth="2" />
        <text x="72" y="18" textAnchor="middle" className="fill-sky-800 dark:fill-sky-200" fontSize="11" fontWeight="800" fontFamily="monospace">
          mohini
        </text>

        <text x="10" y="46" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          name = "Mohini"
        </text>
        <text x="10" y="60" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          species = "Asian"
        </text>
        <text x="10" y="74" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
          sightings = [▪]
        </text>
        <text x="10" y="90" className="fill-sky-600 dark:fill-sky-400" fontSize="8" fontWeight="600">
          1 sighting recorded
        </text>

        <text x="72" y="-8" textAnchor="middle" className="fill-sky-500 dark:fill-sky-400" fontSize="9" fontWeight="700">
          INSTANCE 2
        </text>
      </g>

      {/* Key insight */}
      <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        Same methods, different data. Each instance is independent.
      </text>
    </svg>
  );
}
