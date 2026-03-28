export default function VirusReplicationDiagram() {
  const steps = [
    { x: 30, label: '1. Attachment', desc: 'Virus binds\nto cell' },
    { x: 140, label: '2. Injection', desc: 'DNA enters\ncell' },
    { x: 250, label: '3. Replication', desc: 'Cell copies\nviral DNA' },
    { x: 360, label: '4. Assembly', desc: 'New viruses\nassemble' },
    { x: 470, label: '5. Lysis', desc: 'Cell bursts\nopen' },
  ];

  return (
    <div className="my-4">
      <svg viewBox="0 0 540 220" className="w-full max-w-xl mx-auto" role="img" aria-label="Virus replication cycle in 5 steps: attachment, injection, replication, assembly, and lysis">
        <text x="270" y="18" textAnchor="middle" className="fill-gray-700 dark:fill-gray-200" fontSize="13" fontWeight="bold">Lytic Cycle (Virus Replication)</text>

        {/* Step 1: Attachment - virus on cell surface */}
        <g>
          <circle cx="65" cy="105" r="35" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="1.5" />
          {/* Virus particle on outside */}
          <polygon points="65,62 60,50 65,55 70,50" className="fill-red-400 dark:fill-red-500" />
          <circle cx="65" cy="62" r="5" className="fill-red-400 dark:fill-red-500 stroke-red-600" strokeWidth="1" />
          <text x="65" y="65" textAnchor="middle" className="fill-white" fontSize="10">V</text>
          <text x="65" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">1. Attach</text>
          <text x="65" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Virus binds</text>
        </g>

        {/* Arrow */}
        <line x1="105" y1="105" x2="130" y2="105" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#vrArrow)" />

        {/* Step 2: Injection */}
        <g>
          <circle cx="175" cy="105" r="35" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="1.5" />
          {/* Empty virus shell on top */}
          <circle cx="175" cy="62" r="5" fill="none" className="stroke-red-400 dark:stroke-red-500" strokeWidth="1" />
          {/* DNA line going into cell */}
          <path d="M 175,67 L 175,85" className="stroke-red-400" strokeWidth="1.5" strokeDasharray="2,1" />
          {/* DNA inside cell */}
          <path d="M 165,90 Q 175,100 185,90 Q 175,85 165,90" className="fill-red-300 dark:fill-red-500" opacity="0.6" />
          <text x="175" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">2. Inject</text>
          <text x="175" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">DNA enters</text>
        </g>

        <line x1="215" y1="105" x2="240" y2="105" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#vrArrow)" />

        {/* Step 3: Replication */}
        <g>
          <circle cx="285" cy="105" r="35" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="1.5" />
          {/* Multiple DNA copies inside */}
          {[{ x: 275, y: 95 }, { x: 285, y: 105 }, { x: 295, y: 95 }, { x: 280, y: 110 }, { x: 290, y: 112 }].map((p, i) => (
            <path key={i} d={`M ${p.x - 4},${p.y} Q ${p.x},${p.y + 5} ${p.x + 4},${p.y}`} className="stroke-red-400" strokeWidth="1.5" fill="none" />
          ))}
          <text x="285" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">3. Copy</text>
          <text x="285" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Cell replicates</text>
        </g>

        <line x1="325" y1="105" x2="350" y2="105" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#vrArrow)" />

        {/* Step 4: Assembly */}
        <g>
          <circle cx="395" cy="105" r="35" className="fill-sky-100 dark:fill-sky-900/30 stroke-sky-400" strokeWidth="1.5" />
          {/* Assembled virus particles inside */}
          {[{ x: 385, y: 95 }, { x: 400, y: 100 }, { x: 390, y: 112 }, { x: 405, y: 110 }].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" className="fill-red-400 dark:fill-red-500" />
              <polygon points={`${p.x},${p.y - 6} ${p.x - 2},${p.y - 10} ${p.x},${p.y - 8} ${p.x + 2},${p.y - 10}`} className="fill-red-300" />
            </g>
          ))}
          <text x="395" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">4. Assemble</text>
          <text x="395" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">New viruses</text>
        </g>

        <line x1="435" y1="105" x2="460" y2="105" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="1.5" markerEnd="url(#vrArrow)" />

        {/* Step 5: Lysis */}
        <g>
          {/* Broken cell */}
          <path d="M 490,75 Q 505,70 515,80 Q 520,95 518,105" className="stroke-sky-400" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
          <path d="M 518,105 Q 520,115 515,130 Q 505,140 490,135" className="stroke-sky-400" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
          <path d="M 490,135 Q 475,140 465,130 Q 460,115 462,105" className="stroke-sky-400" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
          <path d="M 462,105 Q 460,95 465,80 Q 475,70 490,75" className="stroke-sky-400" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />

          {/* Viruses escaping */}
          {[
            { x: 490, y: 60, a: -20 }, { x: 520, y: 90, a: 30 },
            { x: 510, y: 130, a: 15 }, { x: 465, y: 85, a: -25 },
            { x: 475, y: 125, a: -10 }, { x: 505, y: 115, a: 20 },
          ].map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r="3.5" className="fill-red-400 dark:fill-red-500" />
              <line x1={v.x} y1={v.y} x2={v.x + Math.cos(v.a * Math.PI / 180) * 8} y2={v.y + Math.sin(v.a * Math.PI / 180) * 8}
                className="stroke-red-300" strokeWidth="1" />
            </g>
          ))}
          <text x="490" y="155" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="600">5. Lysis</text>
          <text x="490" y="168" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Cell bursts!</text>
        </g>

        {/* Legend */}
        <circle cx="140" cy="195" r="4" className="fill-red-400 dark:fill-red-500" />
        <text x="150" y="199" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Virus</text>
        <circle cx="210" cy="195" r="6" fill="none" className="stroke-sky-400" strokeWidth="1.5" />
        <text x="222" y="199" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Host cell</text>

        <text x="270" y="215" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">Released viruses go on to infect more cells</text>

        <defs>
          <marker id="vrArrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
