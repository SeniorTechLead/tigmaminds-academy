export default function GeoVolcanoDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 540 440" className="w-full max-w-xl mx-auto" role="img"
        aria-label="Animated cross-section of a volcano showing magma chamber, rising magma, gas bubbles, eruption plume, and lava flow">
        <style>{`
          @keyframes magmaPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.75; }
          }
          @keyframes magmaGlow {
            0%, 100% { opacity: 0.3; r: 55; }
            50% { opacity: 0.7; r: 65; }
          }
          @keyframes magmaRise {
            0% { transform: translateY(0); opacity: 0.7; }
            100% { transform: translateY(-180px); opacity: 0; }
          }
          @keyframes bubbleRise {
            0% { transform: translateY(0) scale(1); opacity: 0.9; }
            40% { opacity: 0.9; }
            100% { transform: translateY(-160px) scale(2.2); opacity: 0; }
          }
          @keyframes eruptParticle {
            0% { transform: translateY(0) translateX(0); opacity: 1; }
            30% { opacity: 0.9; }
            100% { transform: translateY(-70px) translateX(var(--drift)); opacity: 0; }
          }
          @keyframes ashFall {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.7; }
            100% { transform: translateY(80px) translateX(var(--ash-drift)); opacity: 0; }
          }
          @keyframes lavaCreep {
            0% { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes plumeExpand {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.12); opacity: 0.7; }
          }
          @keyframes plumeDrift {
            0% { transform: translateX(0); }
            100% { transform: translateX(30px); }
          }
          .magma-pulse { animation: magmaPulse 2.5s ease-in-out infinite; }
          .magma-glow { animation: magmaGlow 3s ease-in-out infinite; }
          .magma-rise1 { animation: magmaRise 4s ease-in infinite; }
          .magma-rise2 { animation: magmaRise 4s ease-in 1.3s infinite; }
          .magma-rise3 { animation: magmaRise 4s ease-in 2.6s infinite; }
          .bubble1 { animation: bubbleRise 3.5s ease-out infinite; }
          .bubble2 { animation: bubbleRise 3.5s ease-out 0.8s infinite; }
          .bubble3 { animation: bubbleRise 3.5s ease-out 1.6s infinite; }
          .bubble4 { animation: bubbleRise 3.5s ease-out 2.4s infinite; }
          .erupt1 { --drift: -30px; animation: eruptParticle 1.8s ease-out infinite; }
          .erupt2 { --drift: 10px; animation: eruptParticle 1.8s ease-out 0.3s infinite; }
          .erupt3 { --drift: -15px; animation: eruptParticle 1.8s ease-out 0.6s infinite; }
          .erupt4 { --drift: 25px; animation: eruptParticle 1.8s ease-out 0.9s infinite; }
          .erupt5 { --drift: -5px; animation: eruptParticle 1.8s ease-out 1.2s infinite; }
          .erupt6 { --drift: 35px; animation: eruptParticle 1.8s ease-out 1.5s infinite; }
          .ash1 { --ash-drift: 20px; animation: ashFall 4s linear infinite; }
          .ash2 { --ash-drift: 35px; animation: ashFall 4s linear 0.7s infinite; }
          .ash3 { --ash-drift: 15px; animation: ashFall 4s linear 1.4s infinite; }
          .ash4 { --ash-drift: 40px; animation: ashFall 4s linear 2.1s infinite; }
          .ash5 { --ash-drift: 25px; animation: ashFall 4s linear 2.8s infinite; }
          .ash6 { --ash-drift: 10px; animation: ashFall 4s linear 3.5s infinite; }
          .lava-flow { stroke-dasharray: 200; animation: lavaCreep 6s linear infinite; }
          .plume-breathe { animation: plumeExpand 4s ease-in-out infinite; transform-origin: 260px 42px; }
          .plume-drift { animation: plumeDrift 8s ease-in-out infinite alternate; }
        `}</style>

        {/* Title */}
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">
          Volcano Cross-Section — Pressure Cooker Underground
        </text>

        {/* Sky */}
        <rect x="0" y="28" width="540" height="92" className="fill-sky-100 dark:fill-sky-900/30" />

        {/* Animated eruption plume */}
        <g className="plume-drift">
          <g className="plume-breathe">
            <ellipse cx="260" cy="50" rx="55" ry="28" className="fill-gray-300 dark:fill-gray-500" opacity="0.6" />
            <ellipse cx="245" cy="38" rx="40" ry="20" className="fill-gray-400 dark:fill-gray-500" opacity="0.5" />
            <ellipse cx="275" cy="32" rx="30" ry="14" className="fill-gray-400 dark:fill-gray-600" opacity="0.4" />
          </g>
        </g>
        <text x="350" y="40" className="fill-gray-600 dark:fill-gray-300" fontSize="10">Ash cloud</text>

        {/* Ash particles falling from plume */}
        <circle cx="280" cy="60" r="1.5" fill="#6b7280" className="ash1" />
        <circle cx="300" cy="55" r="1" fill="#6b7280" className="ash2" />
        <circle cx="250" cy="58" r="1.2" fill="#6b7280" className="ash3" />
        <circle cx="310" cy="50" r="1" fill="#6b7280" className="ash4" />
        <circle cx="240" cy="52" r="1.5" fill="#6b7280" className="ash5" />
        <circle cx="290" cy="48" r="1" fill="#6b7280" className="ash6" />

        {/* Eruption particles shooting up from crater */}
        <circle cx="258" cy="78" r="2.5" fill="#ef4444" className="erupt1" />
        <circle cx="262" cy="76" r="2" fill="#f97316" className="erupt2" />
        <circle cx="256" cy="80" r="1.8" fill="#eab308" className="erupt3" />
        <circle cx="264" cy="77" r="2.2" fill="#ef4444" className="erupt4" />
        <circle cx="260" cy="79" r="1.5" fill="#f97316" className="erupt5" />
        <circle cx="257" cy="75" r="2" fill="#eab308" className="erupt6" />

        {/* Volcano exterior */}
        <path d="M 80,250 L 240,82 L 260,90 L 280,82 L 460,250 Z" className="fill-stone-500 dark:fill-stone-600" />

        {/* Old lava layers visible in cross-section */}
        <path d="M 140,250 Q 180,210 200,185 L 240,125 L 252,90 L 252,250 Z"
          className="fill-stone-400 dark:fill-stone-500" opacity="0.3" />
        <text x="165" y="200" className="fill-stone-700 dark:fill-stone-300" fontSize="10">Old lava</text>
        <text x="165" y="212" className="fill-stone-700 dark:fill-stone-300" fontSize="10">& ash layers</text>

        {/* Animated lava flow on slope */}
        <path d="M 312,145 Q 342,175 382,205 Q 402,220 420,240 L 430,245"
          fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" className="lava-flow" opacity="0.8" />
        <path d="M 312,145 Q 342,175 382,205 Q 402,220 420,240 L 430,245"
          fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" className="lava-flow" opacity="0.9"
          style={{ animationDelay: '0.5s' }} />
        <text x="440" y="210" className="fill-red-600 dark:fill-red-400" fontSize="10" fontWeight="bold">Lava flow</text>

        {/* Crater */}
        <ellipse cx="260" cy="85" rx="20" ry="6" fill="#b91c1c" className="magma-pulse" />
        <text x="298" y="88" className="fill-gray-700 dark:fill-gray-200" fontSize="10">Crater</text>

        {/* Ground surface */}
        <rect x="0" y="250" width="540" height="8" className="fill-green-300 dark:fill-green-700" />

        {/* Underground crust */}
        <rect x="0" y="258" width="540" height="80" className="fill-amber-100 dark:fill-amber-900/50" />
        <text x="30" y="278" className="fill-amber-700 dark:fill-amber-300" fontSize="10">Crust (rock layers)</text>

        {/* Deep rock below chamber */}
        <rect x="0" y="338" width="540" height="62" className="fill-stone-300 dark:fill-stone-700" opacity="0.4" />

        {/* Conduit (pipe) inside volcano */}
        <rect x="252" y="90" width="16" height="205" fill="#dc2626" opacity="0.5" />

        {/* Animated magma blobs rising in conduit */}
        <ellipse cx="260" cy="290" rx="6" ry="10" fill="#f97316" className="magma-rise1" opacity="0.7" />
        <ellipse cx="260" cy="290" rx="5" ry="8" fill="#ef4444" className="magma-rise2" opacity="0.6" />
        <ellipse cx="260" cy="290" rx="7" ry="9" fill="#f97316" className="magma-rise3" opacity="0.7" />

        <text x="215" y="185" className="fill-red-700 dark:fill-red-200" fontSize="10" fontWeight="bold">Conduit</text>

        {/* Gas bubbles rising in conduit — growing as pressure drops */}
        <circle cx="258" cy="260" r="2" fill="#fde047" className="bubble1" />
        <circle cx="263" cy="260" r="1.8" fill="#fde047" className="bubble2" />
        <circle cx="256" cy="260" r="2.2" fill="#fde047" className="bubble3" />
        <circle cx="265" cy="260" r="1.5" fill="#fde047" className="bubble4" />
        <text x="282" y="230" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">Gas bubbles</text>
        <text x="282" y="242" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">expand as</text>
        <text x="282" y="254" className="fill-yellow-700 dark:fill-yellow-300" fontSize="10">pressure drops</text>

        {/* Magma chamber — pulsing glow */}
        <ellipse cx="260" cy="350" rx="115" ry="48" fill="#dc2626" className="magma-pulse" />
        <ellipse cx="260" cy="350" rx="90" ry="38" fill="#f97316" opacity="0.6" />
        <ellipse cx="260" cy="350" rx="55" ry="22" fill="#facc15" className="magma-glow" />
        <text x="260" y="355" textAnchor="middle" className="fill-red-950 dark:fill-red-100" fontSize="11" fontWeight="bold">
          MAGMA CHAMBER
        </text>

        {/* Conduit connecting chamber to conduit above */}
        <path d="M 252,295 Q 250,320 250,335" fill="none" stroke="#dc2626" strokeWidth="16" opacity="0.4" />

        {/* Pressure annotation */}
        <text x="270" y="398" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Dissolved gases in magma expand as it rises — like opening a shaken fizzy drink
        </text>

        {/* Viscosity comparison */}
        <rect x="20" y="410" width="240" height="24" rx="4" className="fill-green-100 dark:fill-green-900/30" stroke="#16a34a" strokeWidth="1" />
        <text x="140" y="426" textAnchor="middle" className="fill-green-700 dark:fill-green-300" fontSize="10">
          Runny magma → gentle flow (Hawaii)
        </text>
        <rect x="280" y="410" width="240" height="24" rx="4" className="fill-red-100 dark:fill-red-900/30" stroke="#dc2626" strokeWidth="1" />
        <text x="400" y="426" textAnchor="middle" className="fill-red-700 dark:fill-red-300" fontSize="10">
          Thick magma → explosive! (St. Helens)
        </text>
      </svg>
    </div>
  );
}
