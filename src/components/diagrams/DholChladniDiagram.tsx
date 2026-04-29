export default function DholChladniDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img"
        aria-label="Chladni vibration mode patterns on a circular drum membrane showing fundamental and higher modes">
        <style>{`
          .label { font-family: system-ui, sans-serif; font-size: 12px; }
          .title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .small { font-family: system-ui, sans-serif; font-size: 10px; }
          @keyframes vibrate { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
          .vib { animation: vibrate 1.5s ease-in-out infinite; }
        `}</style>
        <rect width="620" height="380" rx="8" className="fill-white dark:fill-slate-900" />
        <text x="310" y="28" textAnchor="middle" className="title fill-red-700 dark:fill-red-300">
          Drum Vibration Modes — Chladni Patterns
        </text>
        <text x="310" y="48" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">
          Nodal lines (still points) where sand collects on a vibrating membrane
        </text>

        {/* Mode (0,1): Fundamental */}
        <g>
          <circle cx="105" cy="130" r="55" fill="#fef3c7" stroke="#d97706" strokeWidth="2" className="dark:fill-amber-900/20 dark:stroke-amber-600 vib" />
          <text x="105" y="135" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">whole</text>
          <text x="105" y="148" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">surface</text>
          <text x="105" y="200" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Mode (0,1)</text>
          <text x="105" y="215" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Fundamental</text>
          <text x="105" y="230" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">Deepest tone</text>
        </g>

        {/* Mode (1,1): One diametric node */}
        <g>
          <circle cx="260" cy="130" r="55" fill="none" stroke="#d97706" strokeWidth="2" className="dark:stroke-amber-600" />
          <line x1="260" y1="75" x2="260" y2="185" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
          <circle cx="235" cy="130" r="0" />
          <text x="233" y="130" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">+</text>
          <text x="287" y="130" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">−</text>
          <text x="260" y="200" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Mode (1,1)</text>
          <text x="260" y="215" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">1 diametric node</text>
          <text x="260" y="230" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">Halves vibrate opposite</text>
        </g>

        {/* Mode (0,2): One circular node */}
        <g>
          <circle cx="415" cy="130" r="55" fill="none" stroke="#d97706" strokeWidth="2" className="dark:stroke-amber-600" />
          <circle cx="415" cy="130" r="30" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
          <text x="415" y="128" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">+</text>
          <text x="415" y="170" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">−</text>
          <text x="415" y="200" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Mode (0,2)</text>
          <text x="415" y="215" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">1 circular node</text>
          <text x="415" y="230" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">Center and edge opposite</text>
        </g>

        {/* Mode (2,1): Two diametric nodes */}
        <g>
          <circle cx="560" cy="130" r="55" fill="none" stroke="#d97706" strokeWidth="2" className="dark:stroke-amber-600" />
          <line x1="521" y1="85" x2="599" y2="175" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
          <line x1="599" y1="85" x2="521" y2="175" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,3" />
          <text x="560" y="110" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">+</text>
          <text x="535" y="145" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">−</text>
          <text x="585" y="145" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">−</text>
          <text x="560" y="170" textAnchor="middle" className="small fill-blue-600 dark:fill-blue-400">+</text>
          <text x="560" y="200" textAnchor="middle" className="label fill-slate-700 dark:fill-slate-300" fontWeight="600">Mode (2,1)</text>
          <text x="560" y="215" textAnchor="middle" className="small fill-slate-500 dark:fill-slate-400">2 diametric nodes</text>
          <text x="560" y="230" textAnchor="middle" className="small fill-red-500 dark:fill-red-400">4 zones, alternating</text>
        </g>

        {/* Explanation box */}
        <rect x="40" y="250" width="540" height="55" rx="6" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1" className="dark:fill-amber-900/15 dark:stroke-amber-700" />
        <text x="310" y="270" textAnchor="middle" className="small fill-amber-700 dark:fill-amber-400" fontWeight="600">Red dashed lines = nodal lines (no vibration, where sand collects)</text>
        <text x="310" y="286" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">+ and − regions vibrate in opposite directions. Higher modes = higher pitch.</text>
        <text x="310" y="298" textAnchor="middle" className="small fill-slate-600 dark:fill-slate-400">Striking the center excites (0,1). Striking the edge excites higher modes.</text>

        {/* Dhol connection */}
        <rect x="40" y="315" width="540" height="50" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" className="dark:fill-slate-800 dark:stroke-slate-700" />
        <text x="310" y="335" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">Dhol connection: The bass head (larger) produces low fundamentals;</text>
        <text x="310" y="350" textAnchor="middle" className="small fill-red-600 dark:fill-red-400" fontWeight="600">the treble head (smaller, tighter) produces bright higher-mode tones</text>
      </svg>
    </div>
  );
}
