const EvaporativeCoolingDiagram = () => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 440 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Evaporative cooling diagram showing a badgir wind tower cross-section with temperature labels"
      >
        <style>{`
          @keyframes airDown {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          .air-flow { animation: airDown 1.5s linear infinite; stroke-dasharray: 8 8; }
          .label-text { font-family: system-ui, sans-serif; font-size: 11px; }
          .title-text { font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; }
          .small-text { font-family: system-ui, sans-serif; font-size: 9px; }
          .temp-text { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; }
        `}</style>

        <defs>
          <marker id="cool-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="cool-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="420" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="210" y="24" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Evaporative Cooling — Badgir (Wind Tower)
        </text>

        {/* Sky area */}
        <rect x="20" y="35" width="380" height="50" rx="4"
          fill="#fef3c7" opacity="0.4" />
        <text x="55" y="55" className="small-text fill-amber-600 dark:fill-amber-400">
          Hot dry air
        </text>

        {/* Hot wind arrow entering tower top */}
        <line x1="60" y1="60" x2="140" y2="60"
          stroke="#ef4444" strokeWidth="2" markerEnd="url(#cool-arrow-red)" />
        <text x="80" y="50" className="temp-text fill-red-500">40°C</text>

        {/* Tower structure */}
        <rect x="145" y="45" width="60" height="180" rx="0"
          className="fill-amber-100 dark:fill-amber-900 stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" />

        {/* Tower top opening */}
        <rect x="140" y="40" width="70" height="10" rx="2"
          className="fill-amber-300 dark:fill-amber-700 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />

        {/* Tower label */}
        <text x="175" y="65" textAnchor="middle" className="small-text fill-amber-800 dark:fill-amber-200">
          Badgir
        </text>
        <text x="175" y="77" textAnchor="middle" className="small-text fill-amber-800 dark:fill-amber-200">
          (wind tower)
        </text>

        {/* Air flowing down inside tower */}
        <path d="M 165 85 L 165 130" fill="none" stroke="#f97316" strokeWidth="2" className="air-flow" />
        <path d="M 185 85 L 185 130" fill="none" stroke="#f97316" strokeWidth="2" className="air-flow" />

        {/* Wet surface zone */}
        <rect x="150" y="135" width="50" height="25"
          fill="#3b82f6" opacity="0.25" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
        <text x="220" y="148" className="small-text fill-blue-600 dark:fill-blue-400">
          Wet pads / water
        </text>
        <text x="220" y="160" className="small-text fill-blue-500 dark:fill-blue-400">
          (evaporation zone)
        </text>

        {/* Temperature mid-point */}
        <text x="130" y="152" textAnchor="end" className="temp-text fill-orange-500">34°C</text>

        {/* Cooled air flowing down */}
        <path d="M 165 165 L 165 220" fill="none" stroke="#3b82f6" strokeWidth="2" className="air-flow" />
        <path d="M 185 165 L 185 220" fill="none" stroke="#3b82f6" strokeWidth="2" className="air-flow" />

        {/* Room */}
        <rect x="60" y="225" width="300" height="90" rx="4"
          className="fill-sky-50 dark:fill-sky-950 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
        <text x="210" y="250" textAnchor="middle"
          className="label-text fill-slate-600 dark:fill-slate-300" fontWeight="600">
          Interior Room
        </text>

        {/* Cool air spreading in room */}
        <line x1="165" y1="230" x2="110" y2="260" stroke="#3b82f6" strokeWidth="1.5"
          className="air-flow" markerEnd="url(#cool-arrow-blue)" />
        <line x1="185" y1="230" x2="260" y2="260" stroke="#3b82f6" strokeWidth="1.5"
          className="air-flow" markerEnd="url(#cool-arrow-blue)" />

        {/* Room temperature */}
        <text x="210" y="275" textAnchor="middle" className="temp-text fill-blue-600">28°C</text>
        <text x="210" y="290" textAnchor="middle" className="small-text fill-blue-500 dark:fill-blue-400">
          Cooled air descends into room
        </text>

        {/* Ground / floor */}
        <line x1="60" y1="315" x2="360" y2="315"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Process summary */}
        <text x="210" y="338" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontStyle: 'italic' }}>
          Water evaporation absorbs heat energy, cooling the passing air
        </text>
        <text x="210" y="353" textAnchor="middle"
          className="small-text fill-slate-500 dark:fill-slate-400">
          No electricity needed — passive cooling used for thousands of years
        </text>
      </svg>
    </div>
  );
};

export default EvaporativeCoolingDiagram;
