export default function RiverSourceDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 640 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing how rivers begin: spring and rainfall collect into streams, tributaries, and finally a river"
      >
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 11px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .sm { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes rain-fall {
            0% { opacity: 0; transform: translateY(-8px); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateY(8px); }
          }
          .rain { animation: rain-fall 1.2s linear infinite; }
          .rain2 { animation: rain-fall 1.2s linear 0.4s infinite; }
          .rain3 { animation: rain-fall 1.2s linear 0.8s infinite; }
        `}</style>

        <rect width="640" height="380" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="320" y="28" textAnchor="middle" className="title fill-gray-900 dark:fill-slate-50">
          How Rivers Begin
        </text>

        {/* Mountain / high ground */}
        <polygon points="80,120 180,50 280,120" fill="#78716c" />
        <polygon points="180,50 220,65 180,80" fill="#e2e8f0" opacity="0.7" />
        <text x="180" y="44" textAnchor="middle" className="sm fill-gray-500 dark:fill-slate-400">Mountain</text>

        {/* Rain cloud */}
        <g transform="translate(120, 60)">
          <ellipse cx="30" cy="0" rx="28" ry="14" fill="#94a3b8" />
          <ellipse cx="10" cy="4" rx="18" ry="12" fill="#94a3b8" />
          <ellipse cx="50" cy="4" rx="18" ry="12" fill="#94a3b8" />
          {/* Raindrops */}
          <line x1="15" y1="16" x2="15" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain" />
          <line x1="30" y1="16" x2="30" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain2" />
          <line x1="45" y1="16" x2="45" y2="24" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="rain3" />
        </g>

        {/* Spring source */}
        <circle cx="170" cy="100" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <text x="200" y="98" className="sm fill-blue-600 dark:fill-blue-400">Spring</text>

        {/* Small streams flowing down from mountain */}
        <path d="M170,106 Q175,130 165,155 Q155,175 160,195" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <path d="M240,120 Q235,145 230,165 Q220,185 210,200" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

        {/* Stream labels */}
        <text x="135" y="155" className="sm fill-blue-600 dark:fill-blue-400">Stream</text>
        <text x="245" y="160" className="sm fill-blue-600 dark:fill-blue-400">Stream</text>

        {/* Streams merge into tributary */}
        <path d="M160,195 Q175,215 195,225 Q210,230 230,235" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        <path d="M210,200 Q215,215 225,225 Q230,230 235,235" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

        {/* Confluence point */}
        <circle cx="232" cy="235" r="4" fill="#0284c7" />
        <text x="260" y="225" className="sm fill-blue-600 dark:fill-blue-400">Tributary</text>

        {/* Tributary flows into main river */}
        <path d="M232,239 Q260,265 300,280 Q360,300 420,305 Q480,310 540,315" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />

        {/* Second tributary joining */}
        <path d="M350,200 Q360,240 370,260 Q380,275 400,290" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="400" cy="293" r="3" fill="#0284c7" />
        <text x="370" y="195" className="sm fill-blue-600 dark:fill-blue-400">Tributary</text>

        {/* Gentle terrain (lower ground) */}
        <path d="M280,320 Q400,310 540,325 L640,340 L640,380 L0,380 L0,340 Q80,340 200,330 Z" fill="#65a30d" opacity="0.2" />

        {/* River label */}
        <text x="490" y="298" className="label fill-blue-700 dark:fill-blue-300" fontWeight="600">River</text>

        {/* Arrow showing direction to sea */}
        <line x1="540" y1="315" x2="590" y2="318" stroke="#0284c7" strokeWidth="2" markerEnd="url(#river-arrow)" />
        <defs>
          <marker id="river-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#0284c7" />
          </marker>
        </defs>
        <text x="610" y="315" className="sm fill-gray-500 dark:fill-slate-400">To sea</text>

        {/* Legend / labels at bottom */}
        <g transform="translate(20, 345)">
          <text x="0" y="12" className="sm fill-gray-500 dark:fill-slate-400">
            Rainfall and springs → Streams → Tributaries merge → River
          </text>
        </g>

        {/* Watershed boundary (dashed) */}
        <path d="M60,130 Q180,20 310,130 Q370,180 400,180" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="310" y="155" className="sm fill-purple-500 dark:fill-purple-400">Watershed boundary</text>
      </svg>
    </div>
  );
}
