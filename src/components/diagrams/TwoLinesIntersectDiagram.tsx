/**
 * Two trains/buses with different schedules. Each is a line on a (time, distance)
 * graph. The point where the lines cross is when and where they meet.
 *
 * Used in the Equation of a Line section.
 */
import Tara from './people/Tara';

export default function TwoLinesIntersectDiagram() {
  const W = 720, H = 380;

  // Graph area
  const gx0 = 200, gx1 = 600, gy0 = 80, gy1 = 320;
  const gw = gx1 - gx0, gh = gy1 - gy0;

  // x-axis: time (0..6 hours), y-axis: distance from Guwahati (0..600 km)
  const xMax = 6, yMax = 600;
  const X = (x: number) => gx0 + (x / xMax) * gw;
  const Y = (y: number) => gy1 - (y / yMax) * gh;

  // Line 1: Bus leaves Guwahati at 9 AM heading east at 60 km/h.
  //   distance = 60 t  (t in hours from 9 AM)
  // Line 2: Train leaves Jorhat (300 km east of Guwahati) at 9 AM heading west at 90 km/h.
  //   distance = 300 - 90 t
  // Intersection: 60t = 300 - 90t → 150t = 300 → t = 2, d = 120 km
  const line1At = (t: number) => 60 * t;
  const line2At = (t: number) => 300 - 90 * t;
  const meetT = 2, meetD = 120;

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="A bus and a train meet at the point where their distance-time lines cross">

        <rect x="0" y="0" width={W} height={H} fill="#fef9c3" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="320" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          When and where do they meet?
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          Two lines cross at the answer.
        </text>

        {/* Tara on bottom left */}
        <Tara x={100} y={350} scale={0.95} pose="thinking" />

        {/* Graph */}
        <rect x={gx0} y={gy0} width={gw} height={gh} fill="white" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />

        {/* Grid */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`gv-${i}`} x1={X(i)} y1={gy0} x2={X(i)} y2={gy1} stroke="#e5e7eb" strokeWidth="0.6" className="dark:stroke-gray-600" />
        ))}
        {[0, 100, 200, 300, 400, 500, 600].map((d, i) => (
          <line key={`gh-${i}`} x1={gx0} y1={Y(d)} x2={gx1} y2={Y(d)} stroke="#e5e7eb" strokeWidth="0.6" className="dark:stroke-gray-600" />
        ))}

        {/* Axes */}
        <line x1={gx0} y1={gy1} x2={gx1 + 14} y2={gy1} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arX-tl)" />
        <line x1={gx0} y1={gy1} x2={gx0} y2={gy0 - 14} stroke="#475569" strokeWidth="1.5" markerEnd="url(#arY-tl)" />
        <defs>
          <marker id="arX-tl" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
          <marker id="arY-tl" markerWidth="6" markerHeight="8" refX="3" refY="1" orient="auto">
            <polygon points="0 8, 3 0, 6 8" fill="#475569" />
          </marker>
        </defs>

        {/* Axis labels */}
        <text x={gx1 + 18} y={gy1 + 4} fontSize="11" fontWeight="700" fill="#475569" className="dark:fill-gray-300">time (h)</text>
        <text x={gx0 - 6} y={gy0 - 18} fontSize="11" fontWeight="700" fill="#475569" textAnchor="end" className="dark:fill-gray-300">km</text>

        {/* Tick labels */}
        {[0, 1, 2, 3, 4, 5, 6].map(t => (
          <text key={t} x={X(t)} y={gy1 + 16} textAnchor="middle" fontSize="10" fill="#475569" className="dark:fill-gray-400">{t}</text>
        ))}
        {[0, 100, 200, 300, 400, 500].map(d => (
          <text key={d} x={gx0 - 6} y={Y(d) + 4} textAnchor="end" fontSize="10" fill="#475569" className="dark:fill-gray-400">{d}</text>
        ))}

        {/* Line 1: bus, blue, going up */}
        <line x1={X(0)} y1={Y(0)} x2={X(5)} y2={Y(line1At(5))}
          stroke="#3b82f6" strokeWidth="3" />
        <text x={X(4.5)} y={Y(line1At(4.5)) - 14} fontSize="11" fontWeight="700" fill="#1d4ed8" className="dark:fill-blue-300">
          Bus: y = 60t
        </text>

        {/* Line 2: train, red, going down */}
        <line x1={X(0)} y1={Y(line2At(0))} x2={X(3)} y2={Y(line2At(3))}
          stroke="#dc2626" strokeWidth="3" />
        <text x={X(0.4)} y={Y(line2At(0.4)) - 8} fontSize="11" fontWeight="700" fill="#b91c1c" className="dark:fill-red-300">
          Train: y = 300 − 90t
        </text>

        {/* Intersection */}
        <circle cx={X(meetT)} cy={Y(meetD)} r="8" fill="#facc15" stroke="#92400e" strokeWidth="2" />
        <circle cx={X(meetT)} cy={Y(meetD)} r="14" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />

        {/* Drop lines from intersection to axes */}
        <line x1={X(meetT)} y1={Y(meetD)} x2={X(meetT)} y2={gy1} stroke="#92400e" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={X(meetT)} y1={Y(meetD)} x2={gx0} y2={Y(meetD)} stroke="#92400e" strokeWidth="1" strokeDasharray="3 3" />

        {/* Intersection annotation */}
        <rect x={X(meetT) + 14} y={Y(meetD) - 38} width="160" height="40" rx="10"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={X(meetT) + 94} y={Y(meetD) - 22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          Meet at (2, 120)
        </text>
        <text x={X(meetT) + 94} y={Y(meetD) - 8} textAnchor="middle" fontSize="10" fill="#92400e" className="dark:fill-amber-200">
          2 hours, 120 km from start
        </text>

        {/* Footer */}
        <rect x={W / 2 - 220} y={H - 26} width="440" height="20" rx="6"
          fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Solve 60t = 300 − 90t → t = 2 → y = 120. Lines cross at (2, 120).
        </text>
      </svg>
    </div>
  );
}
