/**
 * Two buses leave from the same Guwahati stop. Bus A every 12 minutes,
 * Bus B every 18 minutes. Tara's question: "If both leave at 8:00 AM,
 * when do they next leave together?" Answer: at LCM(12, 18) = 36 minutes,
 * i.e. 8:36 AM.
 *
 * Visualisation: two horizontal timelines marked with bus departures.
 * The first time their marks coincide gives the LCM.
 *
 * Used in the GCD and LCM section.
 */
import Tara from './people/Tara';

export default function TwoBusesLCMDiagram() {
  const W = 720, H = 360;

  // Timeline geometry
  const timelineLeft = 80, timelineRight = 660;
  const totalLen = timelineRight - timelineLeft;
  const maxMinutes = 40;
  const xAt = (m: number) => timelineLeft + (m / maxMinutes) * totalLen;

  // Bus A every 12, Bus B every 18
  const busA = [0, 12, 24, 36];
  const busB = [0, 18, 36];

  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="When do two buses, leaving every 12 and 18 minutes, next leave together">

        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />

        {/* Caption */}
        <rect x="20" y="14" width="380" height="48" rx="8" fill="white" opacity="0.95" stroke="#cbd5e1" strokeWidth="1" className="dark:fill-gray-800 dark:stroke-gray-600" />
        <text x="32" y="34" fontSize="13" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">
          Two buses, one stop
        </text>
        <text x="32" y="52" fontSize="11" fill="#475569" className="dark:fill-gray-300">
          When do they next leave at the same time?
        </text>

        {/* Tara at top right, looking thoughtful */}
        <Tara x={W - 100} y={130} scale={0.7} pose="thinking" />

        {/* Bus A timeline */}
        <text x={timelineLeft - 60} y={150 + 5} fontSize="13" fontWeight="700" fill="#3b82f6" className="dark:fill-blue-300">Bus A</text>
        <text x={timelineLeft - 60} y={166} fontSize="10" fill="#475569" className="dark:fill-gray-400">every 12 min</text>
        <line x1={timelineLeft} y1="150" x2={timelineRight} y2="150"
          stroke="#cbd5e1" strokeWidth="2" className="dark:stroke-gray-600" />
        {busA.map(m => {
          const isCommon = busB.includes(m);
          return (
            <g key={`A-${m}`}>
              {/* Bus icon */}
              <rect x={xAt(m) - 14} y="135" width="28" height="14" rx="3" fill={isCommon ? '#fbbf24' : '#3b82f6'} stroke="#1e293b" strokeWidth="1" />
              <rect x={xAt(m) - 12} y="137" width="6" height="5" fill="white" opacity="0.9" />
              <rect x={xAt(m) - 4} y="137" width="6" height="5" fill="white" opacity="0.9" />
              <rect x={xAt(m) + 4} y="137" width="6" height="5" fill="white" opacity="0.9" />
              <circle cx={xAt(m) - 8} cy="151" r="2" fill="#1e293b" />
              <circle cx={xAt(m) + 8} cy="151" r="2" fill="#1e293b" />
              {/* Time label below tick */}
              <line x1={xAt(m)} y1="150" x2={xAt(m)} y2="158" stroke="#475569" strokeWidth="1" />
              <text x={xAt(m)} y="172" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">{m}</text>
            </g>
          );
        })}

        {/* Bus B timeline */}
        <text x={timelineLeft - 60} y={250 + 5} fontSize="13" fontWeight="700" fill="#10b981" className="dark:fill-emerald-300">Bus B</text>
        <text x={timelineLeft - 60} y={266} fontSize="10" fill="#475569" className="dark:fill-gray-400">every 18 min</text>
        <line x1={timelineLeft} y1="250" x2={timelineRight} y2="250"
          stroke="#cbd5e1" strokeWidth="2" className="dark:stroke-gray-600" />
        {busB.map(m => {
          const isCommon = busA.includes(m);
          return (
            <g key={`B-${m}`}>
              <rect x={xAt(m) - 14} y="235" width="28" height="14" rx="3" fill={isCommon ? '#fbbf24' : '#10b981'} stroke="#1e293b" strokeWidth="1" />
              <rect x={xAt(m) - 12} y="237" width="6" height="5" fill="white" opacity="0.9" />
              <rect x={xAt(m) - 4} y="237" width="6" height="5" fill="white" opacity="0.9" />
              <rect x={xAt(m) + 4} y="237" width="6" height="5" fill="white" opacity="0.9" />
              <circle cx={xAt(m) - 8} cy="251" r="2" fill="#1e293b" />
              <circle cx={xAt(m) + 8} cy="251" r="2" fill="#1e293b" />
              <line x1={xAt(m)} y1="250" x2={xAt(m)} y2="258" stroke="#475569" strokeWidth="1" />
              <text x={xAt(m)} y="272" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e293b" className="dark:fill-gray-100">{m}</text>
            </g>
          );
        })}

        {/* Vertical "common" highlight at minute 0 and 36 */}
        {[0, 36].map(m => (
          <line key={`common-${m}`} x1={xAt(m)} y1="120" x2={xAt(m)} y2="280"
            stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
        ))}

        {/* Highlight star at LCM */}
        <circle cx={xAt(36)} cy={195} r="22" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
        <text x={xAt(36)} y={199} textAnchor="middle" fontSize="20">⭐</text>

        {/* Answer banner */}
        <rect x={W / 2 - 130} y={H - 60} width="260" height="40" rx="20"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-900/40 dark:stroke-amber-400" />
        <text x={W / 2} y={H - 40} textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e" className="dark:fill-amber-200">
          LCM(12, 18) = 36 minutes
        </text>
        <text x={W / 2} y={H - 26} textAnchor="middle" fontSize="11" fill="#92400e" className="dark:fill-amber-200">
          Both buses leave together again at 8:36 AM
        </text>

        {/* Time axis label */}
        <text x={timelineLeft - 60} y="320" fontSize="10" fill="#94a3b8" className="dark:fill-gray-500">minutes after 8:00 AM</text>
      </svg>
    </div>
  );
}
