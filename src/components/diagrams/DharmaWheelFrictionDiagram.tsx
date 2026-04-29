export default function DharmaWheelFrictionDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 500 420"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Comparison of dragging a heavy block versus rolling it on a wheel, showing friction forces"
      >
        <defs>
          <marker id="dwf-arrow-red" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="dwf-arrow-blue" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="dwf-arrow-green" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>

        {/* Background */}
        <rect width="500" height="420" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Why Wheels Reduce Friction
        </text>

        {/* --- SCENARIO A: Dragging --- */}
        <text x="125" y="60" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-red-600 dark:fill-red-400">
          A. Dragging (sliding friction)
        </text>

        {/* Ground line */}
        <line x1="20" y1="160" x2="230" y2="160"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        {/* Ground hatching */}
        {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210].map(x => (
          <line key={`hatch-a-${x}`} x1={x} y1="160" x2={x - 10} y2="172"
            className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        ))}

        {/* Block being dragged */}
        <rect x="60" y="110" width="80" height="50" rx="3"
          className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <text x="100" y="140" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-800 dark:fill-amber-200">50 kg</text>

        {/* Pull force arrow */}
        <line x1="140" y1="135" x2="210" y2="135"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          markerEnd="url(#dwf-arrow-blue)" />
        <text x="185" y="128" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">Pull</text>

        {/* Friction arrow (opposing) */}
        <line x1="60" y1="155" x2="15" y2="155"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5"
          markerEnd="url(#dwf-arrow-red)" />
        <text x="38" y="148" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-red-500 dark:fill-red-400">Friction</text>

        {/* Contact area indicator */}
        <line x1="60" y1="165" x2="140" y2="165"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x="100" y="185" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-300">
          Large contact area
        </text>
        <text x="100" y="197" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-300">
          μ = 0.5 (sliding)
        </text>

        {/* --- SCENARIO B: Rolling --- */}
        <text x="375" y="60" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-green-600 dark:fill-green-400">
          B. Rolling (rolling friction)
        </text>

        {/* Ground line */}
        <line x1="270" y1="160" x2="480" y2="160"
          className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        {[280, 300, 320, 340, 360, 380, 400, 420, 440, 460].map(x => (
          <line key={`hatch-b-${x}`} x1={x} y1="160" x2={x - 10} y2="172"
            className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        ))}

        {/* Wheel */}
        <circle cx="375" cy="125" r="35" fill="none"
          className="stroke-slate-600 dark:stroke-slate-300" strokeWidth="2.5" />
        {/* Axle */}
        <circle cx="375" cy="125" r="5"
          className="fill-slate-500 dark:fill-slate-400" />
        {/* Spokes */}
        {[0, 45, 90, 135].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line key={`spoke-${angle}`}
              x1={375 + 5 * Math.cos(rad)} y1={125 + 5 * Math.sin(rad)}
              x2={375 + 33 * Math.cos(rad)} y2={125 + 33 * Math.sin(rad)}
              className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          );
        })}

        {/* Block on wheel */}
        <rect x="350" y="72" width="50" height="30" rx="3"
          className="fill-amber-200 dark:fill-amber-700 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
        <text x="375" y="92" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-amber-800 dark:fill-amber-200">50 kg</text>

        {/* Pull force arrow */}
        <line x1="400" y1="87" x2="455" y2="87"
          className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2.5"
          markerEnd="url(#dwf-arrow-blue)" />
        <text x="435" y="80" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-blue-500 dark:fill-blue-400">Pull</text>

        {/* Tiny friction arrow */}
        <line x1="370" y1="157" x2="350" y2="157"
          className="stroke-green-500 dark:stroke-green-400" strokeWidth="2.5"
          markerEnd="url(#dwf-arrow-green)" />
        <text x="340" y="152" textAnchor="end" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="bold" className="fill-green-500 dark:fill-green-400">Tiny friction</text>

        {/* Contact point */}
        <circle cx="375" cy="160" r="2.5" className="fill-green-500 dark:fill-green-400" />
        <text x="375" y="185" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-500 dark:fill-green-300">
          Point contact
        </text>
        <text x="375" y="197" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-green-500 dark:fill-green-300">
          μ = 0.01 (rolling)
        </text>

        {/* Comparison box */}
        <rect x="30" y="215" width="440" height="80" rx="8"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" />
        <text x="250" y="238" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-slate-700 dark:fill-slate-200">
          The Numbers
        </text>
        <text x="250" y="258" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">
          Sliding friction force: F = μ × mg = 0.5 × 50 × 9.8 = 245 N
        </text>
        <text x="250" y="276" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" className="fill-slate-600 dark:fill-slate-300">
          Rolling friction force: F = μ × mg = 0.01 × 50 × 9.8 = 4.9 N
        </text>
        <text x="250" y="290" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="bold" className="fill-green-600 dark:fill-green-400">
          The wheel reduces friction by 50×!
        </text>

        {/* Key insight */}
        <rect x="30" y="310" width="440" height="95" rx="8"
          className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1.5" />
        <text x="250" y="333" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="bold" className="fill-amber-700 dark:fill-amber-300">
          Why does this work?
        </text>
        <text x="250" y="353" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Sliding: surface atoms interlock and must be torn apart continuously.
        </text>
        <text x="250" y="368" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          Rolling: each point on the wheel lifts off the ground before it can bond.
        </text>
        <text x="250" y="383" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          The wheel converts sliding into brief contact-and-release cycles.
        </text>
        <text x="250" y="398" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-amber-600 dark:fill-amber-400">
          This insight — 5,500 years old — changed human civilization.
        </text>
      </svg>
    </div>
  );
}
