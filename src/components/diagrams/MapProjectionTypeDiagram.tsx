export default function MapProjectionTypeDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 530 353"
        className="w-full"
        role="img"
        aria-label="Three projection types: Mercator cylinder, Robinson compromise, and Azimuthal circle"
      >
        <rect width="500" height="320" rx="8" className="fill-white dark:fill-slate-950" />

        <text x="250" y="28" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
          Map Projection Types
        </text>

        {/* === Mercator === */}
        <g>
          {/* Small globe */}
          <circle cx="60" cy="85" r="28" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="60" cy="85" rx="28" ry="10" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
          <line x1="60" y1="57" x2="60" y2="113" stroke="#f59e0b" strokeWidth="0.5" />

          {/* Cylinder around globe */}
          <rect x="28" y="55" width="64" height="60" rx="2" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* Arrow down */}
          <line x1="60" y1="120" x2="60" y2="145" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowProj)" />

          {/* Result: rectangle */}
          <rect x="20" y="150" width="80" height="55" rx="3" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1.2" />
          {/* Grid lines */}
          {[165, 177, 190].map((y) => (
            <line key={y} x1="22" y1={y} x2="98" y2={y} stroke="#f59e0b" strokeWidth="0.4" />
          ))}
          {[40, 60, 80].map((x) => (
            <line key={x} x1={x} y1="152" x2={x} y2="203" stroke="#f59e0b" strokeWidth="0.4" />
          ))}
          {/* Greenland exaggerated */}
          <ellipse cx="55" cy="160" rx="18" ry="8" fill="#166534" opacity="0.7" />
          <text x="55" y="163" textAnchor="middle" fontSize="6" fill="#bbf7d0" fontFamily="sans-serif">big!</text>

          <text x="60" y="225" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
            Mercator
          </text>
          <text x="60" y="238" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            Rectangle
          </text>
          <text x="60" y="250" textAnchor="middle" fontSize="9" fill="#f87171" fontFamily="sans-serif">
            Distorts poles
          </text>
        </g>

        {/* === Robinson === */}
        <g>
          {/* Small globe */}
          <circle cx="230" cy="85" r="28" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="230" cy="85" rx="28" ry="10" fill="none" stroke="#f59e0b" strokeWidth="0.5" />

          {/* Arrow down */}
          <line x1="230" y1="120" x2="230" y2="145" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowProj)" />

          {/* Result: rounded rectangle (Robinson shape) */}
          <path
            d="M185,175 Q190,150 230,148 Q270,150 275,175 Q270,205 230,207 Q190,205 185,175Z"
            className="fill-gray-100 dark:fill-slate-800"
            stroke="#3b82f6"
            strokeWidth="1.2"
          />
          {/* Grid curves */}
          <ellipse cx="230" cy="177" rx="42" ry="4" fill="none" stroke="#f59e0b" strokeWidth="0.4" />
          <line x1="230" y1="150" x2="230" y2="205" stroke="#f59e0b" strokeWidth="0.4" />
          <line x1="210" y1="152" x2="210" y2="203" stroke="#f59e0b" strokeWidth="0.3" />
          <line x1="250" y1="152" x2="250" y2="203" stroke="#f59e0b" strokeWidth="0.3" />

          <text x="230" y="225" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
            Robinson
          </text>
          <text x="230" y="238" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            Rounded
          </text>
          <text x="230" y="250" textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="sans-serif">
            Compromise
          </text>
        </g>

        {/* === Azimuthal === */}
        <g>
          {/* Small globe */}
          <circle cx="400" cy="85" r="28" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1" />
          {/* Viewing from top */}
          <ellipse cx="400" cy="72" rx="10" ry="3" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
          <circle cx="400" cy="68" r="3" fill="#f59e0b" opacity="0.5" />
          <text x="400" y="66" textAnchor="middle" fontSize="6" fill="#fbbf24" fontFamily="sans-serif">pole</text>

          {/* Arrow down */}
          <line x1="400" y1="120" x2="400" y2="145" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrowProj)" />

          {/* Result: circle */}
          <circle cx="400" cy="177" r="30" className="fill-gray-100 dark:fill-slate-800" stroke="#3b82f6" strokeWidth="1.2" />
          {/* Concentric rings */}
          {[10, 20, 28].map((r) => (
            <circle key={r} cx="400" cy="177" r={r} fill="none" stroke="#f59e0b" strokeWidth="0.4" />
          ))}
          <line x1="400" y1="148" x2="400" y2="206" stroke="#f59e0b" strokeWidth="0.4" />
          <line x1="371" y1="177" x2="429" y2="177" stroke="#f59e0b" strokeWidth="0.4" />

          <text x="400" y="225" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-gray-900 dark:fill-slate-50" fontFamily="sans-serif">
            Azimuthal
          </text>
          <text x="400" y="238" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif">
            Circle
          </text>
          <text x="400" y="250" textAnchor="middle" fontSize="9" fill="#60a5fa" fontFamily="sans-serif">
            Good for poles
          </text>
        </g>

        {/* Arrow marker */}
        <defs>
          <marker id="arrowProj" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Bottom caption */}
        <text x="250" y="285" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400" fontFamily="sans-serif" fontStyle="italic">
          Every flat map distorts something — shape, area, distance, or direction.
        </text>
        <text x="250" y="303" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500" fontFamily="sans-serif">
          The projection you choose depends on what you need the map for.
        </text>
      </svg>
    </div>
  );
}
