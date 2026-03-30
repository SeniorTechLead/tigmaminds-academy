export default function StarConservationDiagram() {
  return (
    <svg viewBox="0 0 546 346" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Dark sky conservation showing shielded vs unshielded lights and full-cutoff fixtures">
      <rect width="520" height="310" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Dark Sky Conservation</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">Small changes in lighting = big changes in star visibility</text>

      {/* BAD: Unshielded light (left) */}
      <rect x="20" y="58" width="230" height="155" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#f87171" strokeWidth="1.5" />
      <text x="135" y="76" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="700">Unshielded (Bad)</text>

      {/* Light fixture - unshielded */}
      <rect x="125" y="125" width="20" height="8" fill="#475569" />
      <circle cx="135" cy="140" r="8" fill="#fbbf24" opacity={0.8} />
      {/* Light going everywhere */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={angle} x1={135 + Math.cos(rad) * 10} y1={140 + Math.sin(rad) * 10} x2={135 + Math.cos(rad) * 40} y2={140 + Math.sin(rad) * 40} stroke="#fbbf24" strokeWidth="1" opacity={0.3} />
        );
      })}
      {/* Glow dome */}
      <ellipse cx="135" cy="100" rx="60" ry="30" fill="#fbbf24" opacity={0.06} />

      <text x="135" y="180" textAnchor="middle" fill="#f87171" fontSize="8">Light goes UP into sky</text>
      <text x="135" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Wasted energy, blinds stars</text>

      {/* Ground */}
      <line x1="40" y1="170" x2="230" y2="170" stroke="#334155" strokeWidth="1" />

      {/* Wasted % */}
      <text x="135" y="207" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="600">~60% light wasted upward</text>

      {/* GOOD: Shielded light (right) */}
      <rect x="270" y="58" width="230" height="155" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#22c55e" strokeWidth="1.5" />
      <text x="385" y="76" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="700">Full Cutoff (Good)</text>

      {/* Light fixture - shielded */}
      <rect x="375" y="125" width="20" height="8" fill="#475569" />
      <rect x="370" y="125" width="30" height="5" className="fill-gray-400 dark:fill-slate-500" rx="1" />
      <circle cx="385" cy="140" r="6" fill="#fbbf24" opacity={0.6} />
      {/* Light only going down */}
      {[210, 230, 250, 270, 290, 310, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={angle} x1={385 + Math.cos(rad) * 8} y1={140 + Math.sin(rad) * 8} x2={385 + Math.cos(rad) * 35} y2={140 + Math.sin(rad) * 35} stroke="#fbbf24" strokeWidth="1" opacity={0.3} />
        );
      })}

      <text x="385" y="180" textAnchor="middle" fill="#22c55e" fontSize="8">Light directed DOWN only</text>
      <text x="385" y="192" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="7">Efficient, protects dark sky</text>

      {/* Ground */}
      <line x1="290" y1="170" x2="480" y2="170" stroke="#334155" strokeWidth="1" />

      {/* Stars visible above good fixture */}
      {[[300,65],[330,70],[360,62],[410,68],[440,60],[470,72],[350,85],[400,90]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fef3c7" opacity={0.6} />
      ))}

      <text x="385" y="207" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">100% light where needed</text>

      {/* IDA Certification */}
      <rect x="30" y="222" width="460" height="38" rx="8" className="fill-gray-100 dark:fill-slate-800" stroke="#60a5fa" strokeWidth="1" />
      <text x="260" y="238" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="700">International Dark-Sky Association (IDA)</text>
      <text x="260" y="252" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Certifies communities, parks, and reserves that protect night skies</text>

      {/* Action items */}
      <rect x="30" y="268" width="460" height="34" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#334155" strokeWidth="1" />
      <text x="45" y="282" fill="#fbbf24" fontSize="9" fontWeight="600">What you can do:</text>
      <text x="145" y="282" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Use warm LEDs (2700K) | Shield all outdoor lights | Turn off when not needed</text>
      <text x="260" y="296" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">Help keep Ziro Valley's skies dark for future stargazers!</text>
    </svg>
  );
}
