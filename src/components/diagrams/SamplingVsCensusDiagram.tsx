export default function SamplingVsCensusDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Sampling vs census: why counting every individual is usually impossible and sampling is used instead">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Sampling vs Census</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">You can’t count every butterfly — so you count a sample and estimate the total</text>

        {/* LEFT: Census (impossible) */}
        <rect x="40" y="70" width="290" height="240" rx="8" className="fill-red-50 dark:fill-red-900/10" stroke="#ef4444" strokeWidth="1" />
        <text x="185" y="95" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ef4444">Census: Count Every One</text>

        {/* Many butterflies */}
        {Array.from({ length: 35 }).map((_, i) => {
          const x = 60 + (i % 7) * 36;
          const y = 110 + Math.floor(i / 7) * 32;
          return <text key={i} x={x} y={y} fontSize="14">🦋</text>;
        })}
        <text x="185" y="285" textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="600">✗ Too many, too mobile, too hidden</text>
        <text x="185" y="300" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Would need unlimited time and people</text>

        {/* RIGHT: Sampling (practical) */}
        <rect x="370" y="70" width="290" height="240" rx="8" className="fill-green-50 dark:fill-green-900/10" stroke="#22c55e" strokeWidth="1" />
        <text x="515" y="95" textAnchor="middle" fontSize="13" fontWeight="700" fill="#22c55e">Sample: Count a Subset</text>

        {/* Forest background with sample area highlighted */}
        <rect x="390" y="110" width="250" height="140" rx="4" fill="#22c55e" opacity="0.05" />
        {/* Sample quadrat */}
        <rect x="440" y="140" width="80" height="80" rx="2" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 3" />
        <text x="480" y="180" textAnchor="middle" fontSize="14">🦋</text>
        <text x="480" y="200" textAnchor="middle" fontSize="14">🦋 🦋</text>
        <text x="480" y="234" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">Sample area</text>

        {/* Scattered butterflies outside */}
        {[{x:400,y:125},{x:560,y:135},{x:580,y:200},{x:410,y:230},{x:550,y:240}].map((b, i) => (
          <text key={i} x={b.x} y={b.y} fontSize="11" opacity="0.4">🦋</text>
        ))}

        <text x="515" y="270" textAnchor="middle" fontSize="11" fill="#22c55e" fontWeight="600">✓ Count sample → estimate total</text>
        <text x="515" y="285" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Practical, repeatable, statistical</text>

        {/* Formula */}
        <rect x="150" y="325" width="400" height="36" rx="6" className="fill-amber-50 dark:fill-amber-900/15" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="343" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">If you count 12 in 10% of the area → estimate ≈ 120 total</text>
        <text x="350" y="357" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">The key: your sample must be representative (random, unbiased)</text>
      </svg>
    </div>
  );
}
