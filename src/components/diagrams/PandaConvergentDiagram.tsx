export default function PandaConvergentDiagram() {
  const animals = [
    {
      name: 'Red Panda',
      family: 'Ailuridae',
      habitat: 'Himalayan forests',
      headFill: '#c2410c',
      maskFill: '#292524',
      eyeWhite: '#fafaf9',
      reason: 'Bark camouflage + glare reduction',
    },
    {
      name: 'Raccoon',
      family: 'Procyonidae',
      habitat: 'N. American forests',
      headFill: '#6b7280',
      maskFill: '#1f2937',
      eyeWhite: '#e5e7eb',
      reason: 'Night vision + glare reduction',
    },
    {
      name: 'Giant Panda',
      family: 'Ursidae (bears)',
      habitat: 'Chinese bamboo forests',
      headFill: '#fafaf9',
      maskFill: '#1c1917',
      eyeWhite: '#fafaf9',
      reason: 'Recognition + intimidation',
    },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 580 460" className="w-full max-w-xl mx-auto" role="img" aria-label="Convergent evolution: red panda, raccoon, and giant panda evolved similar facial masks independently">
        <rect width="580" height="460" rx="12" className="fill-slate-900" />

        <text x="290" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#c084fc">Convergent Evolution — Three Masks, Three Families</text>
        <text x="290" y="46" textAnchor="middle" fontSize="11" fill="#94a3b8">Similar problems → similar solutions, evolved independently</text>

        {/* Phylogenetic tree at the top */}
        <g transform="translate(100, 65)">
          {/* Common ancestor */}
          <circle cx="190" cy="10" r="6" fill="#94a3b8" />
          <text x="190" y="5" textAnchor="middle" fontSize="9" fill="#94a3b8">Common ancestor</text>
          <text x="190" y="-5" textAnchor="middle" fontSize="9" fill="#64748b">(~55 million years ago)</text>

          {/* Branches diverging */}
          <line x1="190" y1="16" x2="190" y2="35" stroke="#64748b" strokeWidth="1.5" />
          <line x1="190" y1="35" x2="50" y2="55" stroke="#64748b" strokeWidth="1.5" />
          <line x1="190" y1="35" x2="190" y2="55" stroke="#64748b" strokeWidth="1.5" />
          <line x1="190" y1="35" x2="330" y2="55" stroke="#64748b" strokeWidth="1.5" />

          {/* Branch labels */}
          <text x="50" y="70" textAnchor="middle" fontSize="10" fill="#c084fc">Ailuridae</text>
          <text x="190" y="70" textAnchor="middle" fontSize="10" fill="#c084fc">Procyonidae</text>
          <text x="330" y="70" textAnchor="middle" fontSize="10" fill="#c084fc">Ursidae</text>

          {/* X marks showing independent evolution */}
          <text x="50" y="85" textAnchor="middle" fontSize="10" fill="#fbbf24">✗ Mask evolves</text>
          <text x="190" y="85" textAnchor="middle" fontSize="10" fill="#fbbf24">✗ Mask evolves</text>
          <text x="330" y="85" textAnchor="middle" fontSize="10" fill="#fbbf24">✗ Mask evolves</text>
        </g>

        {/* Animal cards */}
        {animals.map((animal, i) => {
          const x = 15 + i * 190;
          const y = 175;
          return (
            <g key={animal.name} transform={`translate(${x}, ${y})`}>
              <rect width="175" height="260" rx="8" fill={animal.name === 'Red Panda' ? '#7c2d12' : animal.name === 'Raccoon' ? '#374151' : '#fafaf9'} opacity="0.12" />

              {/* Animal face */}
              <g transform="translate(48, 15)">
                {/* Head */}
                <circle cx="40" cy="40" r="35" fill={animal.headFill} />
                {/* Mask band */}
                <rect x="8" y="28" width="64" height="18" rx="8" fill={animal.maskFill} />
                {/* Eyes in mask */}
                <circle cx="25" cy="37" r="6" fill={animal.eyeWhite} />
                <circle cx="55" cy="37" r="6" fill={animal.eyeWhite} />
                <circle cx="26" cy="36" r="3" fill="#1c1917" />
                <circle cx="56" cy="36" r="3" fill="#1c1917" />
                {/* Nose */}
                <ellipse cx="40" cy="52" rx="5" ry="3" fill="#1c1917" />
                {/* Ears */}
                <circle cx="12" cy="12" r="10" fill={animal.headFill} />
                <circle cx="68" cy="12" r="10" fill={animal.headFill} />
              </g>

              {/* Labels */}
              <text x="88" y="105" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#e2e8f0">{animal.name}</text>
              <text x="88" y="120" textAnchor="middle" fontSize="10" fill="#c084fc">{animal.family}</text>
              <text x="88" y="137" textAnchor="middle" fontSize="10" fill="#94a3b8">{animal.habitat}</text>

              {/* Mask function */}
              <rect x="10" y="148" width="155" height="30" rx="5" fill="#c084fc" opacity="0.1" />
              <text x="88" y="167" textAnchor="middle" fontSize="10" fill="#d8b4fe">{animal.reason}</text>

              {/* Not related indicator */}
              {i < animals.length - 1 && (
                <g transform={`translate(175, 50)`}>
                  <text x="8" y="0" fontSize="16" fill="#ef4444">≠</text>
                </g>
              )}

              {/* Shared traits */}
              <text x="88" y="200" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#86efac">Shared traits:</text>
              <text x="88" y="214" textAnchor="middle" fontSize="10" fill="#d1d5db">• Dark eye patches</text>
              <text x="88" y="228" textAnchor="middle" fontSize="10" fill="#d1d5db">• Eats plants/omnivore</text>
              <text x="88" y="242" textAnchor="middle" fontSize="10" fill="#d1d5db">• Forest dweller</text>
            </g>
          );
        })}

        {/* Bottom insight */}
        <rect x="30" y="425" width="520" height="26" rx="6" fill="#c084fc" opacity="0.12" />
        <text x="290" y="443" textAnchor="middle" fontSize="11" fill="#c084fc">
          Same solution, different ancestors — proof that evolution finds similar answers to similar problems
        </text>
      </svg>
    </div>
  );
}
