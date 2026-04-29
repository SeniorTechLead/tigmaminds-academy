export default function PerspectiveDiagram() {
  /* Vanishing point */
  const vpX = 290;
  const vpY = 80;

  /* Road edges converging to vanishing point */
  const roadLeftBottom = { x: 140, y: 320 };
  const roadRightBottom = { x: 440, y: 320 };

  /* Generate fence posts that get shorter and closer together as they recede */
  const fencePosts = Array.from({ length: 8 }, (_, i) => {
    const t = i / 8;
    /* Interpolate from bottom to vanishing point */
    const x = roadLeftBottom.x - 30 + t * (vpX - roadLeftBottom.x + 30);
    const baseY = roadLeftBottom.y + t * (vpY - roadLeftBottom.y);
    const height = 50 * (1 - t * 0.85);
    return { x, baseY, height, t };
  });

  /* Figure positions walking toward VP */
  const figures = [
    { t: 0.0, label: '' },
    { t: 0.3, label: '' },
    { t: 0.6, label: '' },
  ];

  return (
    <svg
      viewBox="0 0 610 370"
      className="w-full max-w-2xl mx-auto my-6"
      role="img"
      aria-label="Perspective diagram showing a road with fence posts converging to a vanishing point, with figures getting smaller as they recede"
    >
      <style>{`
        @keyframes pdWalk {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          80% { transform: translateY(-180px) translateX(30px) scale(0.2); opacity: 0.5; }
          82% { opacity: 0; }
          95% { opacity: 0; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
        }
        .pd-walker {
          animation: pdWalk 8s ease-in infinite;
          transform-origin: 200px 305px;
        }
        @keyframes pdGridPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        .pd-grid { animation: pdGridPulse 4s ease-in-out infinite; }
        @keyframes pdVPGlow {
          0%, 100% { r: 4; opacity: 0.6; }
          50% { r: 7; opacity: 1; }
        }
        .pd-vp { animation: pdVPGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <rect width="580" height="370" rx="12" className="fill-gray-900" />

      {/* Title */}
      <text x="290" y="24" textAnchor="middle" className="fill-gray-300" fontSize="14" fontWeight="700">
        One-Point Perspective
      </text>
      <text x="290" y="40" textAnchor="middle" className="fill-gray-500" fontSize="11">
        How parallel lines converge to fool the eye into seeing depth
      </text>

      {/* Sky gradient */}
      <defs>
        <linearGradient id="pdSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="pdGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="20" y="50" width="540" height="120" fill="url(#pdSky)" rx="6" />
      {/* Ground */}
      <rect x="20" y="170" width="540" height="160" fill="url(#pdGround)" />

      {/* Horizon line */}
      <line x1="20" y1="170" x2="560" y2="170" stroke="#6b7280" strokeWidth="1" strokeDasharray="6,4" />
      <text x="565" y="174" className="fill-gray-500" fontSize="9">horizon</text>

      {/* Converging grid lines */}
      <g className="pd-grid">
        {[-2, -1, 0, 1, 2].map(i => {
          const bottomX = 290 + i * 80;
          return (
            <line key={`v${i}`} x1={bottomX} y1="330" x2={vpX} y2={vpY + 90}
              stroke="#60a5fa" strokeWidth="0.5" />
          );
        })}
        {/* Horizontal lines getting closer together */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const t = i / 6;
          const y = 320 - t * 160;
          const spread = 200 * (1 - t * 0.8);
          return (
            <line key={`h${i}`} x1={vpX - spread} y1={y} x2={vpX + spread} y2={y}
              stroke="#60a5fa" strokeWidth="0.5" />
          );
        })}
      </g>

      {/* Road */}
      <path
        d={`M${roadLeftBottom.x},${roadLeftBottom.y} L${vpX},${vpY + 90} L${roadRightBottom.x},${roadRightBottom.y} Z`}
        fill="#374151"
        stroke="#6b7280"
        strokeWidth="1"
      />
      {/* Center line */}
      <line x1="290" y1="320" x2={vpX} y2={vpY + 90} stroke="#facc15" strokeWidth="1.5" strokeDasharray="8,8" />

      {/* Fence posts (left side) */}
      {fencePosts.map((post, i) => (
        <g key={`fp${i}`}>
          <line
            x1={post.x} y1={post.baseY}
            x2={post.x} y2={post.baseY - post.height}
            stroke="#92400e" strokeWidth={2 * (1 - post.t * 0.6)}
          />
          {/* Post cap */}
          <circle cx={post.x} cy={post.baseY - post.height} r={2 * (1 - post.t * 0.5)} fill="#b45309" />
          {/* Wire between posts */}
          {i < fencePosts.length - 1 && (
            <line
              x1={post.x} y1={post.baseY - post.height * 0.5}
              x2={fencePosts[i + 1].x} y2={fencePosts[i + 1].baseY - fencePosts[i + 1].height * 0.5}
              stroke="#78350f" strokeWidth="0.5"
            />
          )}
        </g>
      ))}

      {/* Vanishing point */}
      <circle cx={vpX} cy={vpY + 90} className="pd-vp" fill="#ef4444" />
      <text x={vpX + 12} y={vpY + 86} className="fill-red-400" fontSize="10" fontWeight="600">
        Vanishing Point
      </text>

      {/* Walking figure (animated) */}
      <g className="pd-walker">
        {/* Simple stick figure */}
        <circle cx="200" cy="290" r="5" className="fill-gray-700 dark:fill-slate-200" />
        <line x1="200" y1="295" x2="200" y2="310" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="200" y1="310" x2="194" y2="320" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="200" y1="310" x2="206" y2="320" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="200" y1="300" x2="193" y2="306" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="200" y1="300" x2="207" y2="306" stroke="#e2e8f0" strokeWidth="1.5" />
      </g>

      {/* Static reference figures showing size decrease */}
      {figures.map((fig, i) => {
        const t = fig.t;
        const x = 380 + t * (vpX - 380);
        const baseY = 320 + t * (vpY + 90 - 320);
        const scale = 1 - t * 0.7;
        const headR = 4 * scale;
        const bodyH = 15 * scale;
        return (
          <g key={`fig${i}`} opacity={0.5}>
            <circle cx={x} cy={baseY - bodyH - headR} r={headR} className="fill-gray-500 dark:fill-slate-400" />
            <line x1={x} y1={baseY - bodyH} x2={x} y2={baseY} stroke="#94a3b8" strokeWidth={1.5 * scale} />
          </g>
        );
      })}

      {/* Annotation: foreshortening */}
      <rect x="20" y="335" width="250" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="145" y="353" textAnchor="middle" className="fill-gray-400" fontSize="10">
        Objects shrink and converge with distance
      </text>

      {/* Annotation: key principle */}
      <rect x="310" y="335" width="250" height="28" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="435" y="353" textAnchor="middle" className="fill-gray-400" fontSize="10">
        Parallel lines meet at the vanishing point
      </text>
    </svg>
  );
}
