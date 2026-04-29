export default function HornbillCallDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 400" className="w-full max-w-2xl mx-auto" role="img" aria-label="Diagram showing hornbill vocal communication: syrinx produces sound, casque amplifies it, and calls carry through the forest">
        <rect width="520" height="400" rx="12" className="fill-slate-900" />
        <text x="260" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#fbbf24">Communication Without Words</text>

        {/* Sound production pathway: syrinx -> casque -> forest */}
        {/* Step 1: Syrinx */}
        <g transform="translate(80, 130)">
          <rect x="-55" y="-35" width="110" height="75" rx="10" className="fill-slate-800" stroke="#818cf8" strokeWidth="1.5" />
          <text x="0" y="-18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#818cf8">1. Syrinx</text>
          <text x="0" y="-4" textAnchor="middle" fontSize="8" className="fill-slate-400">Voice organ at base</text>
          <text x="0" y="8" textAnchor="middle" fontSize="8" className="fill-slate-400">of windpipe produces</text>
          <text x="0" y="20" textAnchor="middle" fontSize="8" className="fill-slate-400">vibrations in air</text>
          {/* Mini sound wave */}
          <path d="M -25,30 Q -20,25 -15,30 Q -10,35 -5,30 Q 0,25 5,30 Q 10,35 15,30 Q 20,25 25,30" fill="none" stroke="#818cf8" strokeWidth="1.5" />
        </g>

        {/* Arrow 1->2 */}
        <line x1="135" y1="130" x2="175" y2="130" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />

        {/* Step 2: Casque amplifies */}
        <g transform="translate(260, 130)">
          <rect x="-70" y="-35" width="140" height="75" rx="10" className="fill-slate-800" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="0" y="-18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">2. Casque Resonator</text>
          <text x="0" y="-4" textAnchor="middle" fontSize="8" className="fill-slate-400">Hollow interior amplifies</text>
          <text x="0" y="8" textAnchor="middle" fontSize="8" className="fill-slate-400">sound like a megaphone.</text>
          <text x="0" y="20" textAnchor="middle" fontSize="8" className="fill-slate-400">Adds booming quality.</text>
          {/* Bigger sound wave */}
          <path d="M -35,30 Q -27,20 -19,30 Q -11,40 -3,30 Q 5,20 13,30 Q 21,40 29,30 Q 37,20 45,30" fill="none" stroke="#f59e0b" strokeWidth="2" />
        </g>

        {/* Arrow 2->3 */}
        <line x1="330" y1="130" x2="370" y2="130" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowY)" />

        {/* Step 3: Forest carry */}
        <g transform="translate(440, 130)">
          <rect x="-55" y="-35" width="110" height="75" rx="10" className="fill-slate-800" stroke="#34d399" strokeWidth="1.5" />
          <text x="0" y="-18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">3. Forest Reach</text>
          <text x="0" y="-4" textAnchor="middle" fontSize="8" className="fill-slate-400">Low-frequency calls</text>
          <text x="0" y="8" textAnchor="middle" fontSize="8" className="fill-slate-400">carry 2–4 km through</text>
          <text x="0" y="20" textAnchor="middle" fontSize="8" className="fill-slate-400">dense canopy</text>
          {/* Expanding arcs */}
          <path d="M 25,28 Q 30,25 25,35" fill="none" stroke="#34d399" strokeWidth="1.5" />
          <path d="M 32,23 Q 38,25 32,40" fill="none" stroke="#34d399" strokeWidth="1.5" />
          <path d="M 39,18 Q 46,25 39,45" fill="none" stroke="#34d399" strokeWidth="1.5" />
        </g>

        <defs>
          <marker id="arrowY" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0,0 L 8,3 L 0,6 Z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Call types section */}
        <text x="260" y="220" textAnchor="middle" fontSize="13" fontWeight="bold" className="fill-gray-700 dark:fill-slate-200">What Hornbills Say</text>

        {/* Call type cards */}
        {/* Territory */}
        <g transform="translate(30, 240)">
          <rect width="145" height="90" rx="8" className="fill-slate-800" stroke="#ef4444" strokeWidth="1" />
          <text x="72" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Territory Call</text>
          <text x="72" y="32" textAnchor="middle" fontSize="8" className="fill-slate-400">“This forest is mine”</text>
          {/* Waveform: loud, repeating */}
          <g transform="translate(15, 50)">
            <path d="M 0,15 L 10,-5 L 12,15 L 22,-8 L 24,15 L 34,-5 L 36,15 L 46,-8 L 48,15 L 58,-5 L 60,15 L 70,-8 L 72,15 L 82,-5 L 84,15 L 94,-8 L 96,15 L 106,-5 L 108,15" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          </g>
          <text x="72" y="82" textAnchor="middle" fontSize="8" fill="#ef4444">Loud, repetitive booming</text>
        </g>

        {/* Mating */}
        <g transform="translate(188, 240)">
          <rect width="145" height="90" rx="8" className="fill-slate-800" stroke="#ec4899" strokeWidth="1" />
          <text x="72" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ec4899">Mating Display</text>
          <text x="72" y="32" textAnchor="middle" fontSize="8" className="fill-slate-400">“I am strong and healthy”</text>
          {/* Waveform: melodic, varied */}
          <g transform="translate(15, 50)">
            <path d="M 0,15 Q 15,-10 30,15 Q 45,35 60,10 Q 70,-5 80,15 Q 90,25 100,5 L 110,15" fill="none" stroke="#ec4899" strokeWidth="1.5" />
          </g>
          <text x="72" y="82" textAnchor="middle" fontSize="8" fill="#ec4899">Complex, melodic duets</text>
        </g>

        {/* Alarm */}
        <g transform="translate(346, 240)">
          <rect width="145" height="90" rx="8" className="fill-slate-800" stroke="#f97316" strokeWidth="1" />
          <text x="72" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316">Alarm Call</text>
          <text x="72" y="32" textAnchor="middle" fontSize="8" className="fill-slate-400">“Danger! Predator!”</text>
          {/* Waveform: sharp, staccato */}
          <g transform="translate(15, 50)">
            <path d="M 0,15 L 5,-10 L 10,15 M 20,15 L 25,-10 L 30,15 M 40,15 L 45,-10 L 50,15 M 60,15 L 65,-10 L 70,15 M 80,15 L 85,-10 L 90,15 M 100,15 L 105,-10 L 110,15" fill="none" stroke="#f97316" strokeWidth="1.5" />
          </g>
          <text x="72" y="82" textAnchor="middle" fontSize="8" fill="#f97316">Sharp, short bursts</text>
        </g>

        {/* Wing noise */}
        <g transform="translate(30, 350)">
          <rect width="460" height="35" rx="8" className="fill-slate-800" />
          <text x="230" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">Bonus: Wing Noise</text>
          <text x="230" y="26" textAnchor="middle" fontSize="9" className="fill-slate-400">Hornbills lack flight-feather dampers. Their wingbeats produce a loud “whooshing” audible 800 m away — an unintentional announcement.</text>
        </g>
      </svg>
    </div>
  );
}
