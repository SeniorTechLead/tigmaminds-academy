export default function ActivityBirdWatchDiagram() {
  return (
    <div className="my-4">
      <svg viewBox="0 0 520 360" className="w-full max-w-lg mx-auto" role="img" aria-label="Bird-watching observation sheet: a table for recording bird species, location, behavior, and time">
        <rect width="520" height="360" rx="12" className="fill-slate-900" />
        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fbbf24">Bird-Watching Observation Sheet</text>
        <text x="260" y="42" textAnchor="middle" fontSize="10" className="fill-slate-400">Sit quietly for 30 minutes. Record every bird you see or hear.</text>

        {/* Table header */}
        <g transform="translate(20, 60)">
          <rect width="480" height="28" rx="4" fill="#1e3a5f" />
          <text x="40" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Time</text>
          <text x="130" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Bird</text>
          <text x="240" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Where?</text>
          <text x="350" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">What is it doing?</text>
          <text x="450" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#93c5fd">Call?</text>

          {/* Divider lines */}
          <line x1="80" y1="0" x2="80" y2="28" stroke="#475569" strokeWidth="1" />
          <line x1="180" y1="0" x2="180" y2="28" stroke="#475569" strokeWidth="1" />
          <line x1="300" y1="0" x2="300" y2="28" stroke="#475569" strokeWidth="1" />
          <line x1="410" y1="0" x2="410" y2="28" stroke="#475569" strokeWidth="1" />
        </g>

        {/* Example row */}
        <g transform="translate(20, 88)">
          <rect width="480" height="26" rx="2" className="fill-slate-800" opacity="0.6" />
          <text x="40" y="17" textAnchor="middle" fontSize="9" fill="#fbbf24">7:15 AM</text>
          <text x="130" y="17" textAnchor="middle" fontSize="9" fill="#fbbf24">Crow</text>
          <text x="240" y="17" textAnchor="middle" fontSize="9" fill="#fbbf24">Rooftop</text>
          <text x="350" y="17" textAnchor="middle" fontSize="9" fill="#fbbf24">Calling loudly</text>
          <text x="450" y="17" textAnchor="middle" fontSize="9" fill="#fbbf24">Caw-caw</text>
          <line x1="80" y1="0" x2="80" y2="26" stroke="#334155" strokeWidth="1" />
          <line x1="180" y1="0" x2="180" y2="26" stroke="#334155" strokeWidth="1" />
          <line x1="300" y1="0" x2="300" y2="26" stroke="#334155" strokeWidth="1" />
          <line x1="410" y1="0" x2="410" y2="26" stroke="#334155" strokeWidth="1" />
          <text x="492" y="17" fontSize="8" fill="#94a3b8">← example</text>
        </g>

        {/* Empty rows */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} transform={`translate(20, ${114 + i * 24})`}>
            <rect width="480" height="24" rx="2" fill="none" stroke="#334155" strokeWidth="1" />
            <line x1="80" y1="0" x2="80" y2="24" stroke="#334155" strokeWidth="1" />
            <line x1="180" y1="0" x2="180" y2="24" stroke="#334155" strokeWidth="1" />
            <line x1="300" y1="0" x2="300" y2="24" stroke="#334155" strokeWidth="1" />
            <line x1="410" y1="0" x2="410" y2="24" stroke="#334155" strokeWidth="1" />
          </g>
        ))}

        {/* Tips at the bottom */}
        <g transform="translate(20, 295)">
          <rect width="235" height="50" rx="8" className="fill-slate-800" />
          <text x="117" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34d399">Tips</text>
          <text x="117" y="30" textAnchor="middle" fontSize="8" className="fill-slate-400">Stay still. Birds notice movement.</text>
          <text x="117" y="42" textAnchor="middle" fontSize="8" className="fill-slate-400">Listen first — you’ll hear more than you see.</text>
        </g>

        <g transform="translate(265, 295)">
          <rect width="235" height="50" rx="8" className="fill-slate-800" />
          <text x="117" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f59e0b">After 30 Minutes, Ask</text>
          <text x="117" y="30" textAnchor="middle" fontSize="8" className="fill-slate-400">Which bird was most common?</text>
          <text x="117" y="42" textAnchor="middle" fontSize="8" className="fill-slate-400">Which spent the most time calling? Why?</text>
        </g>
      </svg>
    </div>
  );
}
