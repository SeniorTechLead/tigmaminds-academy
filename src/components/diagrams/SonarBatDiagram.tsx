export default function SonarBatDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 380" className="w-full h-auto" role="img"
        aria-label="Diagram showing a bat using echolocation to detect an insect in darkness">
        <defs>
          <marker id="sb-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
          </marker>
          <marker id="sb-arr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>

        <rect width="520" height="380" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        {/* Stars for night sky */}
        {[
          [40, 30], [120, 45], [200, 20], [310, 35], [420, 25], [480, 50],
          [70, 70], [260, 55], [370, 60], [450, 40],
        ].map(([x, y], i) => (
          <circle key={`star-${i}`} cx={x} cy={y} r={1} fill="white" opacity={0.4 + Math.random() * 0.4} />
        ))}

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          How Bats Hunt in Total Darkness
        </text>

        {/* Bat body */}
        <g transform="translate(80, 160)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="18" ry="12" fill="#4b5563" stroke="#9ca3af" strokeWidth="1" />
          {/* Head */}
          <circle cx="20" cy="-5" r="10" fill="#4b5563" stroke="#9ca3af" strokeWidth="1" />
          {/* Ears */}
          <path d="M 15,-14 L 18,-26 L 24,-14" fill="#4b5563" stroke="#9ca3af" strokeWidth="1" />
          <path d="M 22,-14 L 26,-26 L 30,-14" fill="#4b5563" stroke="#9ca3af" strokeWidth="1" />
          {/* Eyes */}
          <circle cx="24" cy="-7" r="2" fill="#fbbf24" />
          {/* Wings */}
          <path d="M -5,-5 Q -40,-40 -35,10 Q -20,5 -5,5" fill="#374151" stroke="#6b7280" strokeWidth="1" />
          <path d="M -5,5 Q -40,40 -35,-10 Q -20,-5 -5,-5" fill="#374151" stroke="#6b7280" strokeWidth="1" opacity="0.7" />
          {/* Mouth emitting sound */}
          <circle cx="30" cy="-2" r="2" fill="#fbbf24" />
        </g>

        {/* Outgoing ultrasound pulses — expanding arcs */}
        {[0, 1, 2, 3, 4].map(i => (
          <path key={`pulse-${i}`}
            d={`M ${140 + i * 50},${130 - i * 8} A ${20 + i * 10},${30 + i * 10} 0 0,1 ${140 + i * 50},${180 + i * 8}`}
            fill="none" stroke="#fbbf24" strokeWidth={2 - i * 0.3} opacity={0.9 - i * 0.15} />
        ))}

        <text x="280" y="120" fontSize="11" fontWeight="bold" fill="#fbbf24">Ultrasound pulses</text>
        <text x="280" y="135" fontSize="10" fill="#fbbf24">(20,000 - 200,000 Hz)</text>
        <text x="280" y="150" fontSize="10" fill="#94a3b8">Too high-pitched for humans to hear</text>

        {/* Moth / insect target */}
        <g transform="translate(410, 155)">
          <ellipse cx="0" cy="0" rx="6" ry="4" fill="#a78bfa" />
          <path d="M -5,-3 Q -15,-15 -5,-8" fill="none" stroke="#a78bfa" strokeWidth="1" />
          <path d="M 5,-3 Q 15,-15 5,-8" fill="none" stroke="#a78bfa" strokeWidth="1" />
          <path d="M -5,3 Q -15,15 -5,8" fill="none" stroke="#a78bfa" strokeWidth="1" />
          <path d="M 5,3 Q 15,15 5,8" fill="none" stroke="#a78bfa" strokeWidth="1" />
        </g>
        <text x="410" y="180" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#a78bfa">Moth</text>

        {/* Echo returning — dashed arcs */}
        {[0, 1, 2].map(i => (
          <path key={`echo-${i}`}
            d={`M ${380 - i * 60},${140 - i * 5} A ${15 + i * 8},${25 + i * 8} 0 0,0 ${380 - i * 60},${175 + i * 5}`}
            fill="none" stroke="#3b82f6" strokeWidth={1.5 - i * 0.3} strokeDasharray="5,3" opacity={0.8 - i * 0.15} />
        ))}

        <text x="280" y="205" fontSize="11" fontWeight="bold" fill="#3b82f6">Echo returns</text>

        {/* Process steps at bottom */}
        <rect x="20" y="240" width="480" height="125" rx="8" fill="none" stroke="#475569" strokeWidth="1" />

        {/* Step 1 */}
        <circle cx="80" cy="270" r="16" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="1" />
        <text x="80" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fbbf24">1</text>
        <text x="80" y="296" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Emit</text>
        <text x="80" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">Bat sends</text>
        <text x="80" y="321" textAnchor="middle" fontSize="10" fill="#94a3b8">ultrasound</text>
        <text x="80" y="333" textAnchor="middle" fontSize="10" fill="#94a3b8">pulses</text>

        {/* Arrow */}
        <text x="145" y="274" textAnchor="middle" fontSize="16" fill="#475569">{'→'}</text>

        {/* Step 2 */}
        <circle cx="210" cy="270" r="16" fill="#a78bfa" opacity="0.2" stroke="#a78bfa" strokeWidth="1" />
        <text x="210" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#a78bfa">2</text>
        <text x="210" y="296" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Bounce</text>
        <text x="210" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">Sound hits</text>
        <text x="210" y="321" textAnchor="middle" fontSize="10" fill="#94a3b8">the moth and</text>
        <text x="210" y="333" textAnchor="middle" fontSize="10" fill="#94a3b8">reflects back</text>

        {/* Arrow */}
        <text x="275" y="274" textAnchor="middle" fontSize="16" fill="#475569">{'→'}</text>

        {/* Step 3 */}
        <circle cx="340" cy="270" r="16" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
        <text x="340" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#3b82f6">3</text>
        <text x="340" y="296" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Listen</text>
        <text x="340" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">Bat's huge ears</text>
        <text x="340" y="321" textAnchor="middle" fontSize="10" fill="#94a3b8">catch the faint</text>
        <text x="340" y="333" textAnchor="middle" fontSize="10" fill="#94a3b8">returning echo</text>

        {/* Arrow */}
        <text x="405" y="274" textAnchor="middle" fontSize="16" fill="#475569">{'→'}</text>

        {/* Step 4 */}
        <circle cx="460" cy="270" r="16" fill="#10b981" opacity="0.2" stroke="#10b981" strokeWidth="1" />
        <text x="460" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981">4</text>
        <text x="460" y="296" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e2e8f0">Strike</text>
        <text x="460" y="309" textAnchor="middle" fontSize="10" fill="#94a3b8">Brain calculates</text>
        <text x="460" y="321" textAnchor="middle" fontSize="10" fill="#94a3b8">distance and</text>
        <text x="460" y="333" textAnchor="middle" fontSize="10" fill="#94a3b8">intercepts prey</text>
      </svg>
    </div>
  );
}
