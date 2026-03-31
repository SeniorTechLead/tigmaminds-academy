export default function SeedBankDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 440" className="w-full max-w-lg mx-auto" role="img" aria-label="Seed bank storage: from collection to cryogenic preservation at Svalbard">
        <rect width="520" height="440" rx="12" className="fill-slate-900" />

        <text x="260" y="28" textAnchor="middle" className="fill-cyan-400" fontSize="14" fontWeight="bold">Inside a Seed Bank</text>

        {/* Svalbard mountain cross-section */}
        <polygon points="110,180 260,50 410,180" className="fill-slate-700" />
        <polygon points="140,180 260,70 380,180" className="fill-slate-600" />

        {/* Snow cap */}
        <polygon points="220,75 260,50 300,75 280,72 260,60 240,72" className="fill-white/30" />

        {/* Tunnel entrance */}
        <rect x="230" y="145" width="60" height="35" rx="4" className="fill-slate-800 stroke-cyan-500" strokeWidth="1.5" />
        <text x="260" y="166" textAnchor="middle" className="fill-cyan-400" fontSize="10">Entrance</text>

        {/* Underground vault chambers */}
        <rect x="140" y="195" width="240" height="80" rx="8" className="fill-slate-800 stroke-cyan-600" strokeWidth="1" />

        {/* Three vault rooms */}
        {[{ x: 160, label: 'Vault 1' }, { x: 240, label: 'Vault 2' }, { x: 320, label: 'Vault 3' }].map((v, i) => (
          <g key={i}>
            <rect x={v.x} y={205} width="55" height="55" rx="4" className="fill-blue-900/60 stroke-blue-500" strokeWidth="1" />
            <text x={v.x + 27} y={220} textAnchor="middle" className="fill-blue-300" fontSize="8">{v.label}</text>
            {/* Shelves with seed boxes */}
            {[0, 1, 2].map(row => (
              <g key={row}>
                <rect x={v.x + 5} y={225 + row * 10} width="45" height="8" rx="1" className="fill-amber-800/50" />
                {[0, 1, 2, 3].map(box => (
                  <rect key={box} x={v.x + 7 + box * 11} y={226 + row * 10} width="9" height="6" rx="1" className="fill-amber-600/60 stroke-amber-500" strokeWidth="0.5" />
                ))}
              </g>
            ))}
          </g>
        ))}

        {/* Temperature label */}
        <rect x="160" y="280" width="200" height="22" rx="4" className="fill-blue-900/50" />
        <text x="260" y="295" textAnchor="middle" className="fill-blue-300" fontSize="11" fontWeight="bold">−18°C — Deep Freeze Storage</text>

        {/* Location label */}
        <text x="260" y="320" textAnchor="middle" className="fill-slate-400" fontSize="10">Svalbard, Norway — 78°N latitude, inside permafrost mountain</text>

        {/* Storage process flow at bottom */}
        <text x="260" y="348" textAnchor="middle" className="fill-cyan-400" fontSize="12" fontWeight="bold">How Seeds Are Preserved</text>

        {/* Step 1: Collect */}
        <rect x="15" y="362" width="90" height="55" rx="6" className="fill-emerald-900/40 stroke-emerald-600" strokeWidth="1" />
        <text x="60" y="380" textAnchor="middle" className="fill-emerald-400" fontSize="10" fontWeight="bold">1. Collect</text>
        <text x="60" y="393" textAnchor="middle" className="fill-emerald-300" fontSize="8">Seeds from</text>
        <text x="60" y="404" textAnchor="middle" className="fill-emerald-300" fontSize="8">50+ plants</text>

        {/* Arrow */}
        <line x1="108" y1="389" x2="125" y2="389" className="stroke-cyan-500" strokeWidth="1.5" markerEnd="url(#seedArrow)" />

        {/* Step 2: Clean & Test */}
        <rect x="128" y="362" width="90" height="55" rx="6" className="fill-amber-900/40 stroke-amber-600" strokeWidth="1" />
        <text x="173" y="380" textAnchor="middle" className="fill-amber-400" fontSize="10" fontWeight="bold">2. Clean & Test</text>
        <text x="173" y="393" textAnchor="middle" className="fill-amber-300" fontSize="8">Germination</text>
        <text x="173" y="404" textAnchor="middle" className="fill-amber-300" fontSize="8">test: ≥85%</text>

        {/* Arrow */}
        <line x1="221" y1="389" x2="238" y2="389" className="stroke-cyan-500" strokeWidth="1.5" markerEnd="url(#seedArrow)" />

        {/* Step 3: Dry */}
        <rect x="241" y="362" width="90" height="55" rx="6" className="fill-orange-900/40 stroke-orange-600" strokeWidth="1" />
        <text x="286" y="380" textAnchor="middle" className="fill-orange-400" fontSize="10" fontWeight="bold">3. Dry</text>
        <text x="286" y="393" textAnchor="middle" className="fill-orange-300" fontSize="8">Reduce moisture</text>
        <text x="286" y="404" textAnchor="middle" className="fill-orange-300" fontSize="8">to 3–7%</text>

        {/* Arrow */}
        <line x1="334" y1="389" x2="351" y2="389" className="stroke-cyan-500" strokeWidth="1.5" markerEnd="url(#seedArrow)" />

        {/* Step 4: Seal & Freeze */}
        <rect x="354" y="362" width="90" height="55" rx="6" className="fill-blue-900/40 stroke-blue-600" strokeWidth="1" />
        <text x="399" y="380" textAnchor="middle" className="fill-blue-400" fontSize="10" fontWeight="bold">4. Seal</text>
        <text x="399" y="393" textAnchor="middle" className="fill-blue-300" fontSize="8">Airtight foil</text>
        <text x="399" y="404" textAnchor="middle" className="fill-blue-300" fontSize="8">packets</text>

        {/* Arrow */}
        <line x1="447" y1="389" x2="457" y2="389" className="stroke-cyan-500" strokeWidth="1.5" markerEnd="url(#seedArrow)" />

        {/* Step 5: Store */}
        <rect x="460" y="362" width="50" height="55" rx="6" className="fill-cyan-900/40 stroke-cyan-600" strokeWidth="1" />
        <text x="485" y="380" textAnchor="middle" className="fill-cyan-400" fontSize="10" fontWeight="bold">5. Freeze</text>
        <text x="485" y="395" textAnchor="middle" className="fill-cyan-300" fontSize="10">−18°C</text>

        {/* Harrington's Rule */}
        <rect x="100" y="425" width="320" height="14" rx="3" className="fill-amber-900/30" />
        <text x="260" y="435" textAnchor="middle" className="fill-amber-300" fontSize="10">Harrington’s Rule: −5°C = 2× lifespan; −1% moisture = 2× lifespan</text>

        <defs>
          <marker id="seedArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" className="fill-cyan-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
