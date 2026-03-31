export default function LeopardCameraTrapDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 600 460"
        className="w-full"
        role="img"
        aria-label="Camera trap diagram showing PIR sensor detecting infrared radiation from a moving animal, triggering the camera shutter"
      >
        <rect x="0" y="0" width="600" height="460" className="fill-white dark:fill-slate-900" rx="8" />

        {/* Title */}
        <text x="300" y="26" textAnchor="middle" fontSize="13" className="fill-gray-200" fontWeight="700">
          Camera Trap — Photography Without a Photographer
        </text>

        {/* Forest background */}
        <rect x="10" y="38" width="580" height="370" rx="6" className="fill-emerald-950/30" />

        {/* Trees */}
        {[60, 160, 440, 540].map((tx, i) => (
          <g key={i}>
            <rect x={tx - 5} y="200" width="10" height="180" className="fill-amber-900/60" />
            <ellipse cx={tx} cy="200" rx="30" ry="40" className="fill-emerald-800/50" />
          </g>
        ))}

        {/* Camera trap on tree */}
        <g transform="translate(160, 240)">
          {/* Camera housing */}
          <rect x="-20" y="-18" width="40" height="30" rx="4" className="fill-gray-600" stroke="#9ca3af" strokeWidth="1" />
          {/* Lens */}
          <circle cx="0" cy="-3" r="8" className="fill-gray-800" stroke="#6b7280" strokeWidth="1.5" />
          <circle cx="0" cy="-3" r="4" className="fill-blue-900" />
          {/* PIR sensor */}
          <rect x="-16" y="14" width="32" height="10" rx="2" className="fill-red-900/80" stroke="#ef4444" strokeWidth="0.5" />
          <text x="0" y="22" textAnchor="middle" fontSize="7" className="fill-red-300">PIR SENSOR</text>
          {/* Infrared flash LEDs */}
          <circle cx="-14" cy="-14" r="2.5" className="fill-red-600/60" />
          <circle cx="14" cy="-14" r="2.5" className="fill-red-600/60" />
          {/* Strap */}
          <path d="M-20,-5 Q-30,-5 -30,10 L-30,30 Q-30,40 -20,40 L20,40 Q30,40 30,30 L30,10 Q30,-5 20,-5" fill="none" stroke="#78716c" strokeWidth="2" />
          <text x="0" y="-26" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-300" fontWeight="600">Camera Trap</text>
        </g>

        {/* PIR detection zone - cone */}
        <polygon
          points="160,254 340,190 380,260 380,310 340,380 160,266"
          className="fill-red-500/8"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        <text x="280" y="210" fontSize="10" className="fill-red-400" fontWeight="600">Detection zone</text>
        <text x="280" y="222" fontSize="9" className="fill-red-300/70">(PIR senses infrared)</text>

        {/* Animal (clouded leopard) entering zone */}
        <g transform="translate(330, 290)">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="28" ry="14" className="fill-amber-600/70" />
          {/* Spots */}
          {[{x:-12,y:-4},{x:0,y:5},{x:12,y:-3},{x:-6,y:6},{x:8,y:-8}].map((s,i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="5" ry="4" className="fill-amber-800/50" />
          ))}
          {/* Head */}
          <circle cx="28" cy="-4" r="9" className="fill-amber-500/70" />
          <circle cx="31" cy="-7" r="2" className="fill-yellow-300" />
          {/* Tail */}
          <path d="M-28,0 Q-45,10 -50,0" className="stroke-amber-600/70" fill="none" strokeWidth="5" strokeLinecap="round" />
          {/* Legs */}
          <rect x="-15" y="12" width="5" height="14" rx="2" className="fill-amber-600/70" />
          <rect x="5" y="12" width="5" height="14" rx="2" className="fill-amber-600/70" />
          {/* IR radiation waves from body */}
          {[0, 1, 2].map((w) => (
            <path
              key={w}
              d={`M${-35 - w * 12},${-10 + w * 3} Q${-40 - w * 12},${w * 3} ${-35 - w * 12},${10 + w * 3}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
              opacity={0.4 - w * 0.1}
            />
          ))}
        </g>

        {/* Warm body label */}
        <text x="380" y="250" fontSize="10" className="fill-red-300">Warm body emits</text>
        <text x="380" y="262" fontSize="10" className="fill-red-300">infrared radiation</text>

        {/* Trigger sequence */}
        <rect x="10" y="410" width="580" height="42" rx="4" className="fill-slate-800/80" />

        {/* Step boxes */}
        {[
          { x: 40, label: '1. Animal moves', sub: 'Body heat enters zone' },
          { x: 180, label: '2. PIR detects', sub: 'IR pattern changes' },
          { x: 320, label: '3. Camera triggers', sub: 'Shutter fires (<0.5 s)' },
          { x: 470, label: '4. Photo saved', sub: 'Timestamp + location' },
        ].map((step, i) => (
          <g key={i}>
            <text x={step.x} y="427" fontSize="10" className="fill-amber-300" fontWeight="600">{step.label}</text>
            <text x={step.x} y="440" fontSize="9" className="fill-gray-500 dark:fill-gray-400">{step.sub}</text>
            {i < 3 && (
              <text x={step.x + 120} y="432" fontSize="14" className="fill-gray-500">→</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
