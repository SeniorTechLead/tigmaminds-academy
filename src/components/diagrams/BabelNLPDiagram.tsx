export default function BabelNLPDiagram() {
  return (
    <svg viewBox="0 0 520 380" className="w-full max-w-lg mx-auto">
      <text x="260" y="22" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">How Machine Translation Works</text>

      {/* Source sentence */}
      <rect x="30" y="45" width="200" height="35" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" rx="6" />
      <text x="130" y="67" textAnchor="middle" fill="#60a5fa" fontSize="12" fontWeight="bold">&quot;The cat sat on the mat&quot;</text>
      <text x="130" y="40" textAnchor="middle" fill="#9ca3af" fontSize="10">English input</text>

      {/* Step 1: Tokenise */}
      <line x1="130" y1="80" x2="130" y2="105" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#bnArrow)" />
      <text x="170" y="97" fill="#a78bfa" fontSize="10" fontWeight="bold">1. Tokenise</text>

      {/* Token boxes */}
      <g>
        {['The', 'cat', 'sat', 'on', 'the', 'mat'].map((word, i) => (
          <g key={i}>
            <rect x={20 + i * 40} y="110" width="36" height="22" fill="#334155" stroke="#a78bfa" strokeWidth="1" rx="3" />
            <text x={38 + i * 40} y="125" textAnchor="middle" fill="#e2e8f0" fontSize="10">{word}</text>
          </g>
        ))}
      </g>

      {/* Step 2: Embed */}
      <line x1="130" y1="137" x2="130" y2="160" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#bnArrow)" />
      <text x="170" y="155" fill="#34d399" fontSize="10" fontWeight="bold">2. Embed (numbers)</text>

      {/* Vector representations */}
      <rect x="30" y="165" width="200" height="25" fill="#1a2332" stroke="#34d399" strokeWidth="1" rx="4" />
      <text x="130" y="182" textAnchor="middle" fill="#34d399" fontSize="10">[0.23, -0.81, 0.44, ...] per word</text>

      {/* Step 3: Attention */}
      <line x1="130" y1="195" x2="130" y2="218" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#bnArrow)" />
      <text x="175" y="213" fill="#fbbf24" fontSize="10" fontWeight="bold">3. Attention</text>

      {/* Attention visualisation */}
      <rect x="30" y="223" width="200" height="35" fill="#1a2332" stroke="#fbbf24" strokeWidth="1" rx="4" />
      <text x="130" y="237" textAnchor="middle" fill="#fbbf24" fontSize="10">&quot;cat&quot; attends to &quot;sat&quot; &amp; &quot;mat&quot;</text>
      <text x="130" y="251" textAnchor="middle" fill="#9ca3af" fontSize="10">Context: what relates to what?</text>

      {/* Step 4: Decode */}
      <line x1="130" y1="263" x2="130" y2="286" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#bnArrow)" />
      <text x="175" y="280" fill="#f472b6" fontSize="10" fontWeight="bold">4. Decode</text>

      {/* Output sentence */}
      <rect x="30" y="290" width="200" height="35" fill="#1e3a3f" stroke="#34d399" strokeWidth="1.5" rx="6" />
      <text x="130" y="312" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">&quot;Le chat assis sur le tapis&quot;</text>
      <text x="130" y="340" textAnchor="middle" fill="#9ca3af" fontSize="10">French output</text>

      {/* Right side: Language tree */}
      <text x="390" y="55" textAnchor="middle" fill="#d1d5db" fontSize="11" fontWeight="bold">Language Families</text>

      {/* Root */}
      <circle cx="390" cy="80" r="4" fill="#fbbf24" />
      <text x="390" y="75" textAnchor="middle" fill="#fbbf24" fontSize="10">Proto-Indo-European</text>

      {/* Branches */}
      <line x1="390" y1="84" x2="340" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <line x1="390" y1="84" x2="440" y2="120" stroke="#94a3b8" strokeWidth="1" />

      {/* Germanic */}
      <circle cx="340" cy="125" r="3" fill="#60a5fa" />
      <text x="340" y="140" textAnchor="middle" fill="#60a5fa" fontSize="10">Germanic</text>
      <line x1="340" y1="148" x2="310" y2="175" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="340" y1="148" x2="365" y2="175" stroke="#94a3b8" strokeWidth="0.8" />
      <text x="310" y="188" textAnchor="middle" fill="#d1d5db" fontSize="10">English</text>
      <text x="365" y="188" textAnchor="middle" fill="#d1d5db" fontSize="10">German</text>

      {/* Romance */}
      <circle cx="440" cy="125" r="3" fill="#f472b6" />
      <text x="440" y="140" textAnchor="middle" fill="#f472b6" fontSize="10">Romance</text>
      <line x1="440" y1="148" x2="415" y2="175" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="440" y1="148" x2="465" y2="175" stroke="#94a3b8" strokeWidth="0.8" />
      <text x="415" y="188" textAnchor="middle" fill="#d1d5db" fontSize="10">French</text>
      <text x="465" y="188" textAnchor="middle" fill="#d1d5db" fontSize="10">Spanish</text>

      {/* Other families */}
      <text x="390" y="220" textAnchor="middle" fill="#9ca3af" fontSize="10">+ Sino-Tibetan, Afro-Asiatic,</text>
      <text x="390" y="233" textAnchor="middle" fill="#9ca3af" fontSize="10">Dravidian, Austronesian...</text>
      <text x="390" y="258" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">7,000+ languages</text>
      <text x="390" y="275" textAnchor="middle" fill="#d1d5db" fontSize="10">scattered at Babel?</text>

      {/* Key insight */}
      <rect x="290" y="300" width="210" height="45" fill="#1a2332" stroke="#475569" strokeWidth="1" rx="6" />
      <text x="395" y="318" textAnchor="middle" fill="#d1d5db" fontSize="10">Modern NLP reverses Babel:</text>
      <text x="395" y="333" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">one model, any language pair</text>

      <defs>
        <marker id="bnArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
    </svg>
  );
}
