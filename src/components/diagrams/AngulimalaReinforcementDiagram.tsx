export default function AngulimalaReinforcementDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg
        viewBox="0 0 520 430"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram showing reinforcement learning: an agent observes a state, takes an action, receives a reward, and updates its policy"
      >
        <defs>
          <marker id="rl-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
          <marker id="rl-arrow-g" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
          <marker id="rl-arrow-r" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
        </defs>

        <rect width="520" height="430" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          Reinforcement Learning — AI Learns Like Angulimala
        </text>

        {/* Agent box */}
        <rect x="30" y="100" width="120" height="80" rx="8"
          className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-500" strokeWidth="2" />
        <text x="90" y="135" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="700" className="fill-purple-700 dark:fill-purple-300">Agent</text>
        <text x="90" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-purple-500 dark:fill-purple-400">(decision maker)</text>

        {/* Environment box */}
        <rect x="370" y="100" width="120" height="80" rx="8"
          className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-500" strokeWidth="2" />
        <text x="430" y="135" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="13" fontWeight="700" className="fill-blue-700 dark:fill-blue-300">Environment</text>
        <text x="430" y="152" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-blue-500 dark:fill-blue-400">(the world)</text>

        {/* Action arrow: Agent -> Environment */}
        <line x1="150" y1="120" x2="365" y2="120" stroke="#8b5cf6" strokeWidth="2.5"
          markerEnd="url(#rl-arrow)" />
        <text x="260" y="112" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">Action</text>

        {/* State arrow: Environment -> Agent */}
        <line x1="370" y1="160" x2="155" y2="160" stroke="#8b5cf6" strokeWidth="2.5"
          markerEnd="url(#rl-arrow)" />
        <text x="260" y="175" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-600 dark:fill-purple-300">State + Reward</text>

        {/* Reward signal detail */}
        <line x1="260" y1="185" x2="260" y2="215" stroke="#8b5cf6" strokeWidth="1.5"
          strokeDasharray="4,3" />

        {/* Reward breakdown */}
        <rect x="140" y="220" width="240" height="65" rx="6"
          className="fill-slate-50 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="260" y="240" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-slate-700 dark:fill-slate-200">
          Reward Signal
        </text>
        <text x="200" y="260" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-emerald-600 dark:fill-emerald-400">+1 Good outcome</text>
        <text x="200" y="275" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-red-500 dark:fill-red-400">-1 Bad outcome</text>
        <text x="330" y="268" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-500 dark:fill-slate-400">Agent updates its</text>
        <text x="330" y="280" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-slate-600 dark:fill-slate-300">policy (strategy)</text>

        {/* Comparison: Brain vs AI */}
        <line x1="20" y1="300" x2="500" y2="300" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="260" y="320" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="600" className="fill-slate-700 dark:fill-slate-200">
          Brain vs AI: Same Learning Pattern
        </text>

        {/* Brain column */}
        <rect x="30" y="330" width="220" height="85" rx="6"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="140" y="350" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">Human Brain</text>
        <text x="140" y="367" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Agent = Prefrontal cortex</text>
        <text x="140" y="382" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Reward = Dopamine release</text>
        <text x="140" y="397" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Policy = Neural pathways</text>

        {/* AI column */}
        <rect x="270" y="330" width="220" height="85" rx="6"
          className="fill-purple-50 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="1" />
        <text x="380" y="350" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-purple-700 dark:fill-purple-300">AI System</text>
        <text x="380" y="367" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Agent = Neural network</text>
        <text x="380" y="382" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Reward = Numeric score</text>
        <text x="380" y="397" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">Policy = Weight values</text>
      </svg>
    </div>
  );
}
