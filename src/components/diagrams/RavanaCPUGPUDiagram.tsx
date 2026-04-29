export default function RavanaCPUGPUDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 519 400"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="CPU versus GPU architecture: CPU has few powerful cores, GPU has thousands of small cores"
      >
        <rect width="500" height="400" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="250" y="28" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="14" fontWeight="600" className="fill-slate-800 dark:fill-slate-100">
          CPU vs GPU — One Brain vs Many Heads
        </text>

        {/* CPU side */}
        <rect x="20" y="45" width="210" height="180" rx="8"
          className="fill-blue-50 dark:fill-blue-950/40 stroke-blue-400 dark:stroke-blue-600" strokeWidth="1.5" />
        <text x="125" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" className="fill-blue-600 dark:fill-blue-300">CPU (Central Processing Unit)</text>
        <text x="125" y="80" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">4-16 powerful cores</text>

        {/* CPU cores — few, large */}
        {[0, 1, 2, 3].map((i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const cx = 80 + col * 90;
          const cy = 120 + row * 55;
          return (
            <g key={i}>
              <rect x={cx - 30} y={cy - 20} width="60" height="40" rx="6"
                className="fill-blue-400 dark:fill-blue-600 stroke-blue-600 dark:stroke-blue-400" strokeWidth="1.5" />
              <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="system-ui, sans-serif"
                fontSize="10" fill="white" fontWeight="600">Core {i + 1}</text>
            </g>
          );
        })}

        {/* CPU description */}
        <text x="125" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-blue-600 dark:fill-blue-300">Few cores, each very fast</text>

        {/* GPU side */}
        <rect x="265" y="45" width="215" height="180" rx="8"
          className="fill-green-50 dark:fill-green-950/40 stroke-green-400 dark:stroke-green-600" strokeWidth="1.5" />
        <text x="372" y="65" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="12" fontWeight="700" className="fill-green-600 dark:fill-green-300">GPU (Graphics Processing Unit)</text>
        <text x="372" y="80" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">Thousands of tiny cores</text>

        {/* GPU cores — many, small */}
        {Array.from({ length: 80 }, (_, i) => {
          const cols = 10;
          const row = Math.floor(i / cols);
          const col = i % cols;
          return (
            <rect key={i}
              x={280 + col * 18} y={90 + row * 14}
              width="14" height="10" rx="2"
              className="fill-green-400 dark:fill-green-600" opacity="0.8" />
          );
        })}
        <text x="372" y="215" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-green-600 dark:fill-green-300">Thousands of cores, each slower — but together: massive</text>

        {/* Analogy section */}
        <rect x="20" y="240" width="460" height="65" rx="8"
          className="fill-amber-50 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" strokeWidth="1" />
        <text x="250" y="260" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-200">
          The Ravana Analogy
        </text>
        <text x="250" y="278" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          CPU = a single brilliant scholar who handles tasks one by one
        </text>
        <text x="250" y="293" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" className="fill-slate-600 dark:fill-slate-300">
          GPU = Ravana's ten heads, each handling part of the problem simultaneously
        </text>

        {/* Use cases */}
        <rect x="20" y="320" width="210" height="60" rx="6"
          className="fill-blue-50 dark:fill-blue-950/30 stroke-blue-300 dark:stroke-blue-700" strokeWidth="1" />
        <text x="125" y="340" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-blue-600 dark:fill-blue-300">CPU is best for:</text>
        <text x="125" y="356" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">Complex logic, decisions, OS tasks</text>
        <text x="125" y="369" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">One hard problem at a time</text>

        <rect x="265" y="320" width="215" height="60" rx="6"
          className="fill-green-50 dark:fill-green-950/30 stroke-green-300 dark:stroke-green-700" strokeWidth="1" />
        <text x="372" y="340" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="10" fontWeight="600" className="fill-green-600 dark:fill-green-300">GPU is best for:</text>
        <text x="372" y="356" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">Graphics, AI training, simulations</text>
        <text x="372" y="369" textAnchor="middle" fontFamily="system-ui, sans-serif"
          fontSize="9" className="fill-slate-500 dark:fill-slate-400">Millions of small tasks at once</text>
      </svg>
    </div>
  );
}
