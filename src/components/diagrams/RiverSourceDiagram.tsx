export default function RiverSourceDiagram() {
  /* Generate raindrop positions */
  const raindrops = [
    { x: 95, d: '0s' }, { x: 115, d: '0.3s' }, { x: 135, d: '0.7s' },
    { x: 155, d: '0.1s' }, { x: 175, d: '0.5s' }, { x: 195, d: '0.9s' },
    { x: 215, d: '0.2s' }, { x: 235, d: '0.6s' }, { x: 255, d: '0.4s' },
    { x: 275, d: '0.8s' }, { x: 145, d: '1.0s' }, { x: 205, d: '0.15s' },
  ];

  /* Particle positions along the stream/river paths */
  const streamParticles1 = [0, 0.2, 0.4, 0.6, 0.8];
  const streamParticles2 = [0.1, 0.3, 0.5, 0.7, 0.9];
  const tributaryParticles = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
  const riverParticles = [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88];

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 600 400" className="w-full h-auto" role="img"
        aria-label="Animated diagram showing how rivers begin: rain falls on mountains, water gathers into streams, streams merge into tributaries, and tributaries form a river">
        <style>{`
          @keyframes rs-rain {
            0% { transform: translateY(-20px); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(60px); opacity: 0; }
          }
          @keyframes rs-flow1 {
            0% { offset-distance: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { offset-distance: 100%; opacity: 0; }
          }
          @keyframes rs-spring-pulse {
            0%, 100% { r: 5; opacity: 0.7; }
            50% { r: 8; opacity: 1; }
          }
          @keyframes rs-cloud-drift {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
          }
          @keyframes rs-ripple {
            0% { r: 2; opacity: 0.8; }
            100% { r: 8; opacity: 0; }
          }
          .rs-rain { animation: rs-rain 1.4s linear infinite; }
          .rs-spring { animation: rs-spring-pulse 2s ease-in-out infinite; }
          .rs-cloud { animation: rs-cloud-drift 6s ease-in-out infinite; }
          .rs-flow { offset-rotate: 0deg; animation: rs-flow1 3s linear infinite; }
          .rs-flow-slow { offset-rotate: 0deg; animation: rs-flow1 5s linear infinite; }
          .rs-flow-river { offset-rotate: 0deg; animation: rs-flow1 4s linear infinite; }
          .rs-ripple { animation: rs-ripple 2s ease-out infinite; }
        `}</style>

        <defs>
          <marker id="rs-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#0284c7" />
          </marker>
          {/* Stream path 1 */}
          <path id="rs-stream1" d="M175,115 Q170,145 165,170 Q155,195 160,220" />
          {/* Stream path 2 */}
          <path id="rs-stream2" d="M240,130 Q235,155 228,175 Q218,200 210,220" />
          {/* Tributary path */}
          <path id="rs-trib" d="M165,225 Q180,245 200,255 Q220,262 245,268" />
          {/* Second tributary */}
          <path id="rs-trib2" d="M350,195 Q355,225 365,250 Q375,268 395,285" />
          {/* Main river */}
          <path id="rs-river" d="M250,272 Q300,285 360,292 Q420,298 480,305 Q530,312 570,318" />
        </defs>

        <rect width="600" height="400" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="300" y="26" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-gray-900 dark:fill-slate-50">
          How Rivers Begin
        </text>

        {/* Sky gradient */}
        <rect x="0" y="32" width="600" height="120" fill="#e0f2fe" opacity="0.3" rx="4" className="dark:opacity-10" />

        {/* Cloud — animated drift */}
        <g className="rs-cloud" style={{ transformOrigin: '180px 55px' }}>
          <ellipse cx="180" cy="52" rx="45" ry="18" fill="#94a3b8" opacity="0.7" />
          <ellipse cx="155" cy="58" rx="30" ry="15" fill="#94a3b8" opacity="0.6" />
          <ellipse cx="210" cy="58" rx="28" ry="14" fill="#94a3b8" opacity="0.6" />
        </g>

        {/* Raindrops falling */}
        {raindrops.map((r, i) => (
          <line key={i} x1={r.x} y1={72} x2={r.x} y2={82}
            stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"
            className="rs-rain" style={{ animationDelay: r.d }} />
        ))}

        {/* Mountain */}
        <polygon points="60,145 180,55 300,145" fill="#78716c" className="dark:fill-stone-700" />
        <polygon points="180,55 215,72 180,85" fill="#e2e8f0" opacity="0.6" />
        <text x="180" y="48" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Mountain</text>

        {/* Hill to the right */}
        <polygon points="280,190 370,145 460,190" fill="#78716c" opacity="0.5" className="dark:fill-stone-800" />

        {/* Spring source — pulsing */}
        <circle cx="175" cy="110" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" className="rs-spring" style={{ transformOrigin: '175px 110px' }} />
        <circle cx="175" cy="110" r="5" fill="none" stroke="#38bdf8" strokeWidth="0.8" className="rs-ripple" style={{ transformOrigin: '175px 110px' }} />
        <text x="200" y="108" fontSize="10" className="fill-blue-600 dark:fill-blue-400" fontWeight="600">Spring</text>

        {/* Stream paths (static background) */}
        <path d="M175,115 Q170,145 165,170 Q155,195 160,220" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <path d="M240,130 Q235,155 228,175 Q218,200 210,220" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* Stream labels */}
        <text x="132" y="172" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Stream</text>
        <text x="243" y="168" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Stream</text>

        {/* Flowing particles — Stream 1 */}
        {streamParticles1.map((off, i) => (
          <circle key={`s1-${i}`} r="2.5" fill="#38bdf8"
            className="rs-flow"
            style={{ offsetPath: `path("M175,115 Q170,145 165,170 Q155,195 160,220")`, animationDelay: `${off * 3}s` }} />
        ))}

        {/* Flowing particles — Stream 2 */}
        {streamParticles2.map((off, i) => (
          <circle key={`s2-${i}`} r="2.5" fill="#38bdf8"
            className="rs-flow"
            style={{ offsetPath: `path("M240,130 Q235,155 228,175 Q218,200 210,220")`, animationDelay: `${off * 3}s` }} />
        ))}

        {/* Confluence point 1 */}
        <circle cx="185" cy="238" r="4" fill="#0284c7" opacity="0.6" />

        {/* Tributary path (static) */}
        <path d="M165,225 Q180,245 200,255 Q220,262 245,268" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        <text x="218" y="248" fontSize="10" className="fill-blue-600 dark:fill-blue-400" fontWeight="600">Tributary</text>

        {/* Flowing particles — Tributary */}
        {tributaryParticles.map((off, i) => (
          <circle key={`t-${i}`} r="3" fill="#38bdf8"
            className="rs-flow-slow"
            style={{ offsetPath: `path("M165,225 Q180,245 200,255 Q220,262 245,268")`, animationDelay: `${off * 5}s` }} />
        ))}

        {/* Second tributary */}
        <path d="M350,195 Q355,225 365,250 Q375,268 395,285" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        <text x="370" y="218" fontSize="10" className="fill-blue-600 dark:fill-blue-400">Tributary</text>
        <circle cx="395" cy="288" r="3" fill="#0284c7" opacity="0.6" />

        {streamParticles2.map((off, i) => (
          <circle key={`t2-${i}`} r="2.5" fill="#38bdf8"
            className="rs-flow-slow"
            style={{ offsetPath: `path("M350,195 Q355,225 365,250 Q375,268 395,285")`, animationDelay: `${off * 5}s` }} />
        ))}

        {/* Main river path (static — wider) */}
        <path d="M250,272 Q300,285 360,292 Q420,298 480,305 Q530,312 570,318"
          fill="none" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" opacity="0.25" />

        {/* Flowing particles — River (larger, more) */}
        {riverParticles.map((off, i) => (
          <circle key={`r-${i}`} r="3.5" fill="#0ea5e9"
            className="rs-flow-river"
            style={{ offsetPath: `path("M250,272 Q300,285 360,292 Q420,298 480,305 Q530,312 570,318")`, animationDelay: `${off * 4}s` }} />
        ))}

        {/* River label */}
        <text x="510" y="295" fontSize="12" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">River</text>

        {/* Arrow to sea */}
        <line x1="560" y1="318" x2="590" y2="320" stroke="#0284c7" strokeWidth="2" markerEnd="url(#rs-arr)" />
        <text x="588" y="335" fontSize="10" className="fill-gray-500 dark:fill-slate-400">To sea</text>

        {/* Gentle terrain */}
        <path d="M250,330 Q400,318 560,335 L600,345 L600,400 L0,400 L0,355 Q80,345 200,340 Z"
          fill="#65a30d" opacity="0.12" />

        {/* Watershed boundary */}
        <path d="M50,155 Q180,35 320,155 Q380,200 410,200" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="330" y="170" fontSize="10" className="fill-purple-500 dark:fill-purple-400">Watershed boundary</text>

        {/* Bottom legend */}
        <text x="300" y="385" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Rainfall + springs → streams → tributaries merge → river flows to sea
        </text>
      </svg>
    </div>
  );
}
