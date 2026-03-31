export default function BreedingSimOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Output of a selective breeding simulation showing trait distributions shifting over 20 generations">
        <rect width="780" height="300" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="28" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Project Output: Trait Shift Over 20 Generations</text>
        {/* Gen 0 distribution */}
        <text x="100" y="60" textAnchor="middle" fontSize="11" fill="#94a3b8">Gen 0</text>
        <path d="M30,250 Q60,200 100,120 Q140,200 170,250" fill="#94a3b8" fillOpacity="0.2" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Gen 10 */}
        <text x="350" y="60" textAnchor="middle" fontSize="11" fill="#f59e0b">Gen 10</text>
        <path d="M280,250 Q310,180 350,100 Q390,180 420,250" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Gen 20 */}
        <text x="600" y="60" textAnchor="middle" fontSize="11" fill="#22c55e">Gen 20</text>
        <path d="M530,250 Q560,160 600,80 Q640,160 670,250" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="1.5" />
        {/* Arrows */}
        <path d="M180,180 L270,180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#out-arr)" />
        <path d="M430,180 L520,180" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#out-arr)" />
        <line x1="30" y1="255" x2="750" y2="255" stroke="#64748b" strokeWidth="1" />
        <text x="390" y="275" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Trait Value {'\u2192'}</text>
        <text x="390" y="293" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">The entire population distribution shifts right as selection continues</text>
        <defs><marker id="out-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
