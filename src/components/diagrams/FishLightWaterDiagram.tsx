export default function FishLightWaterDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 600 380" className="w-full max-w-xl mx-auto" role="img" aria-label="Diagram showing refraction, apparent depth, and total internal reflection of light in water">
        <defs>
          <marker id="flwArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-amber-500" />
          </marker>
          <marker id="flwArrowB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-blue-500" />
          </marker>
          <marker id="flwArrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" className="fill-red-500" />
          </marker>
        </defs>

        <text x="300" y="22" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="14" fontWeight="bold">Light in Water: Refraction &amp; Total Internal Reflection</text>

        {/* LEFT: Refraction and apparent depth */}
        <text x="155" y="50" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Why pools look shallower</text>

        {/* Air */}
        <rect x="30" y="60" width="250" height="70" rx="4" className="fill-sky-50 dark:fill-sky-950/30" />
        <text x="45" y="78" className="fill-gray-400 dark:fill-gray-500" fontSize="10">Air (n = 1.0)</text>

        {/* Water surface */}
        <line x1="30" y1="130" x2="280" y2="130" className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="2" />

        {/* Water */}
        <rect x="30" y="130" width="250" height="130" rx="4" className="fill-cyan-100 dark:fill-cyan-900/30" opacity="0.5" />
        <text x="45" y="150" className="fill-cyan-600 dark:fill-cyan-400" fontSize="10">Water (n = 1.33)</text>

        {/* Real fish position */}
        <text x="200" y="240" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="16">\uD83D\uDC1F</text>
        <text x="200" y="256" textAnchor="middle" className="fill-green-600 dark:fill-green-400" fontSize="10" fontWeight="bold">real fish</text>

        {/* Light ray from fish bending at surface */}
        <line x1="200" y1="230" x2="155" y2="130" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" />
        <line x1="155" y1="130" x2="120" y2="70" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2" markerEnd="url(#flwArrow)" />

        {/* Eye */}
        <circle cx="115" cy="68" r="8" className="fill-gray-200 dark:fill-gray-600" />
        <circle cx="117" cy="67" r="3" className="fill-gray-700 dark:fill-gray-300" />

        {/* Dashed line showing where brain THINKS fish is */}
        <line x1="120" y1="70" x2="185" y2="190" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="175" y="188" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="16">\uD83D\uDC1F</text>
        <text x="172" y="204" className="fill-red-500 dark:fill-red-400" fontSize="10" fontWeight="bold">apparent fish</text>

        {/* Normal line */}
        <line x1="155" y1="100" x2="155" y2="160" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3,2" />
        <text x="165" y="115" className="fill-gray-500 dark:fill-gray-400" fontSize="10">normal</text>

        {/* Angle labels */}
        <path d="M 155 118 A 12 12 0 0 0 143 130" fill="none" className="stroke-amber-500" strokeWidth="1" />
        <text x="135" y="120" className="fill-amber-600 dark:fill-amber-400" fontSize="10">θ₁</text>
        <path d="M 155 142 A 12 12 0 0 1 165 130" fill="none" className="stroke-amber-500" strokeWidth="1" />
        <text x="167" y="145" className="fill-amber-600 dark:fill-amber-400" fontSize="10">θ₂</text>

        {/* Snell's law */}
        <text x="45" y="275" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="bold">Snell’s Law:</text>
        <text x="45" y="292" className="fill-gray-600 dark:fill-gray-300" fontSize="10">n₁ sin θ₁ = n₂ sin θ₂</text>
        <text x="45" y="310" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Light bends toward normal</text>
        <text x="45" y="324" className="fill-gray-500 dark:fill-gray-400" fontSize="10">entering denser medium.</text>

        {/* RIGHT: Total Internal Reflection */}
        <text x="460" y="50" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="11" fontWeight="bold">Total internal reflection</text>

        {/* Water block */}
        <rect x="340" y="100" width="220" height="100" rx="4" className="fill-cyan-100 dark:fill-cyan-900/30" opacity="0.5" />
        <text x="355" y="118" className="fill-cyan-600 dark:fill-cyan-400" fontSize="10">Water</text>

        {/* Surface */}
        <line x1="340" y1="100" x2="560" y2="100" className="stroke-cyan-400 dark:stroke-cyan-500" strokeWidth="2" />

        {/* Air above */}
        <rect x="340" y="60" width="220" height="40" rx="4" className="fill-sky-50 dark:fill-sky-950/30" />
        <text x="355" y="78" className="fill-gray-400 dark:fill-gray-500" fontSize="10">Air</text>

        {/* Ray 1: below critical angle - escapes */}
        <line x1="380" y1="180" x2="420" y2="100" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="420" y1="100" x2="440" y2="65" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="1.5" markerEnd="url(#flwArrowB)" />
        <text x="442" y="63" className="fill-blue-600 dark:fill-blue-400" fontSize="10">escapes</text>

        {/* Ray 2: at critical angle - skims */}
        <line x1="420" y1="180" x2="470" y2="100" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="470" y1="100" x2="530" y2="100" className="stroke-green-500 dark:stroke-green-400" strokeWidth="1.5" />
        <text x="510" y="92" className="fill-green-600 dark:fill-green-400" fontSize="10">θc = 48.6°</text>

        {/* Ray 3: above critical angle - TIR */}
        <line x1="470" y1="180" x2="520" y2="100" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <line x1="520" y1="100" x2="555" y2="155" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" markerEnd="url(#flwArrowR)" />
        <text x="540" y="140" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">TIR!</text>

        {/* Normal at TIR point */}
        <line x1="520" y1="80" x2="520" y2="130" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1" strokeDasharray="3,2" />

        {/* Explanation */}
        <rect x="340" y="215" width="220" height="80" rx="6" className="fill-indigo-50 dark:fill-indigo-900/20" />
        <text x="450" y="235" textAnchor="middle" className="fill-indigo-700 dark:fill-indigo-300" fontSize="10" fontWeight="bold">Why this matters for fish:</text>
        <text x="450" y="252" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Light hitting the surface at a</text>
        <text x="450" y="266" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">shallow angle bounces back down</text>
        <text x="450" y="280" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">into the water — trapping light.</text>

        {/* Bottom summary */}
        <text x="300" y="350" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">In Umiam Lake’s clear water, these effects create the shimmering play of light on fish scales.</text>
        <text x="300" y="370" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Water’s refractive index (1.33) causes light to slow by 25% and bend at every surface it crosses.</text>
      </svg>
    </div>
  );
}
