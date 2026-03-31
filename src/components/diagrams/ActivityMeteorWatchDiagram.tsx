export default function ActivityMeteorWatchDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 560"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Meteor watch activity: how to observe shooting stars, what to record, and the best meteor showers to watch"
      >
        <defs>
          <linearGradient id="aw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c0a1a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="aw-meteor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="780" height="560" rx="10" fill="url(#aw-sky)" />

        {/* Stars */}
        {[[50,30],[150,55],[280,25],[400,48],[520,20],[650,40],[720,65],[100,90],[360,75],[580,85],[220,105],[480,95],[140,120],[600,110],[700,35],[310,60],[440,30],[80,70]].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.8 : 1} fill="#e0e7ff" opacity={0.3 + (i % 3) * 0.2} />
        ))}

        {/* Meteors in sky */}
        <line x1="200" y1="40" x2="250" y2="80" stroke="#fbbf24" strokeWidth="2" opacity="0.7" />
        <circle cx="250" cy="80" r="3" fill="#fef3c7" opacity="0.8" />

        <line x1="500" y1="30" x2="530" y2="70" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
        <circle cx="530" cy="70" r="2.5" fill="#fef3c7" opacity="0.6" />

        {/* Title */}
        <text x="390" y="150" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fcd34d">
          Try This: Meteor Watch Night
        </text>
        <text x="390" y="172" textAnchor="middle" fontSize="11" fill="#c4b5fd">
          All you need: clear sky, patience, and a notebook
        </text>

        {/* Step-by-step panels */}
        {/* Step 1 */}
        <rect x="30" y="195" width="225" height="140" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="142" y="218" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818cf8">Step 1: Prepare</text>
        <text x="142" y="238" textAnchor="middle" fontSize="10" fill="#c4b5fd">Find a dark spot away from</text>
        <text x="142" y="252" textAnchor="middle" fontSize="10" fill="#c4b5fd">street lights (garden, rooftop,</text>
        <text x="142" y="266" textAnchor="middle" fontSize="10" fill="#c4b5fd">or field). Bring a mat to lie on.</text>
        <text x="142" y="286" textAnchor="middle" fontSize="10" fill="#fde68a">Let your eyes adapt to the</text>
        <text x="142" y="300" textAnchor="middle" fontSize="10" fill="#fde68a">dark for 20 minutes. No phone!</text>
        <text x="142" y="320" textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="600">Use red light if you need a torch.</text>

        {/* Step 2 */}
        <rect x="278" y="195" width="225" height="140" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="390" y="218" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818cf8">Step 2: Observe</text>
        <text x="390" y="238" textAnchor="middle" fontSize="10" fill="#c4b5fd">Lie back and look straight up.</text>
        <text x="390" y="252" textAnchor="middle" fontSize="10" fill="#c4b5fd">Watch for 30–60 minutes. Count</text>
        <text x="390" y="266" textAnchor="middle" fontSize="10" fill="#c4b5fd">every streak of light you see.</text>
        <text x="390" y="286" textAnchor="middle" fontSize="10" fill="#fde68a">For each meteor, note:</text>
        <text x="390" y="300" textAnchor="middle" fontSize="10" fill="#fde68a">• Direction (N/S/E/W)</text>
        <text x="390" y="314" textAnchor="middle" fontSize="10" fill="#fde68a">• Brightness (faint/medium/bright)</text>
        <text x="390" y="328" textAnchor="middle" fontSize="10" fill="#fde68a">• Color (white/yellow/green)</text>

        {/* Step 3 */}
        <rect x="526" y="195" width="225" height="140" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
        <text x="638" y="218" textAnchor="middle" fontSize="12" fontWeight="700" fill="#818cf8">Step 3: Record &amp; Think</text>
        <text x="638" y="238" textAnchor="middle" fontSize="10" fill="#c4b5fd">Calculate your rate: meteors</text>
        <text x="638" y="252" textAnchor="middle" fontSize="10" fill="#c4b5fd">per hour. During a shower, you</text>
        <text x="638" y="266" textAnchor="middle" fontSize="10" fill="#c4b5fd">might see 50–120 per hour!</text>
        <text x="638" y="286" textAnchor="middle" fontSize="10" fill="#fde68a">Think about what you saw:</text>
        <text x="638" y="300" textAnchor="middle" fontSize="10" fill="#fde68a">Were they random directions,</text>
        <text x="638" y="314" textAnchor="middle" fontSize="10" fill="#fde68a">or from one area? (That area</text>
        <text x="638" y="328" textAnchor="middle" fontSize="10" fill="#fde68a">is the radiant point.)</text>

        {/* Best meteor showers */}
        <text x="390" y="370" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fcd34d">
          Major Meteor Showers Visible from India
        </text>

        {/* Table */}
        <g transform="translate(60, 385)">
          {/* Header */}
          <rect x="0" y="0" width="660" height="28" rx="4" fill="#312e81" />
          <text x="100" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e0e7ff">Shower</text>
          <text x="250" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e0e7ff">When</text>
          <text x="400" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e0e7ff">Rate/hr</text>
          <text x="560" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e0e7ff">Parent Body</text>

          {/* Rows */}
          {[
            ['Quadrantids', 'Jan 3–4', '80–120', 'Asteroid 2003 EH1', 0],
            ['Lyrids', 'Apr 21–22', '15–20', 'Comet Thatcher', 1],
            ['Perseids', 'Aug 11–13', '80–100', 'Comet Swift-Tuttle', 2],
            ['Orionids', 'Oct 20–21', '20–25', 'Comet Halley', 3],
            ['Geminids', 'Dec 13–14', '120–150', 'Asteroid Phaethon', 4],
          ].map(([name, when, rate, parent, idx]) => {
            const y = 34 + Number(idx) * 28;
            const bg = Number(idx) % 2 === 0 ? '#1e1b4b' : '#0f0b2e';
            return (
              <g key={String(idx)}>
                <rect x="0" y={y} width="660" height="28" fill={bg} />
                <text x="100" y={y + 18} textAnchor="middle" fontSize="11" fill="#c4b5fd" fontWeight="600">{String(name)}</text>
                <text x="250" y={y + 18} textAnchor="middle" fontSize="11" fill="#e0e7ff">{String(when)}</text>
                <text x="400" y={y + 18} textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="600">{String(rate)}</text>
                <text x="560" y={y + 18} textAnchor="middle" fontSize="11" fill="#93c5fd">{String(parent)}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom note */}
        <text x="390" y="545" textAnchor="middle" fontSize="11" fill="#818cf8">
          Each shower happens when Earth passes through debris left by a comet or asteroid in its orbit.
        </text>
      </svg>
    </div>
  );
}
