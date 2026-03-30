export default function StarLightPollutionMapDiagram() {
  return (
    <svg viewBox="0 0 550 345" className="w-full max-w-lg mx-auto my-4" role="img" aria-label="Light pollution zones from city center to pristine dark sky at Ziro Valley">
      <rect width="520" height="300" rx="12" className="fill-white dark:fill-slate-950" />

      <text x="260" y="28" textAnchor="middle" className="fill-gray-700 dark:fill-slate-200" fontSize="14" fontWeight="700">Light Pollution Zones</text>
      <text x="260" y="46" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="11">From city center to pristine dark sky</text>

      {/* Concentric zones (top-down view) */}
      {/* Outer dark zone */}
      <circle cx="200" cy="170" r="120" fill="#020617" />
      {/* Rural */}
      <circle cx="200" cy="170" r="90" className="fill-white dark:fill-slate-950" />
      {/* Suburban */}
      <circle cx="200" cy="170" r="65" fill="#1c1917" />
      {/* Urban */}
      <circle cx="200" cy="170" r="42" fill="#422006" />
      {/* City center */}
      <circle cx="200" cy="170" r="22" fill="#78350f" />
      {/* Glow */}
      <circle cx="200" cy="170" r="22" fill="#fbbf24" opacity={0.2} />

      {/* Zone labels */}
      <text x="200" y="174" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="600">City</text>
      <text x="200" y="133" textAnchor="middle" fill="#f59e0b" fontSize="8">Suburbs</text>
      <text x="200" y="100" textAnchor="middle" fill="#d97706" fontSize="8">Rural</text>
      <text x="200" y="65" textAnchor="middle" fill="#22c55e" fontSize="8">Dark sky</text>

      {/* Stars in outer zone */}
      {Array.from({ length: 25 }).map((_, i) => {
        const angle = (i / 25) * Math.PI * 2;
        const r = 100 + (i % 3) * 10;
        const cx = 200 + Math.cos(angle) * r;
        const cy = 170 + Math.sin(angle) * r;
        if (cy < 55 || cy > 285) return null;
        return <circle key={i} cx={cx} cy={cy} r="1" fill="#fef3c7" opacity={0.6} />;
      })}

      {/* Light dome effect above */}
      <path d="M160,80 Q200,30 240,80" fill="#fbbf24" opacity={0.05} stroke="#fbbf24" strokeWidth="0.5" opacity={0.15} />

      {/* Ziro Valley marker */}
      <g>
        <circle cx="420" cy="90" r="25" fill="#020617" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Many stars */}
        {[[-10,-8],[5,-12],[12,3],[-5,8],[8,12],[-12,0],[-3,-15],[15,-5],[0,0],[-8,13],[10,-10],[3,15]].map(([dx,dy], i) => (
          <circle key={i} cx={420 + dx} cy={90 + dy} r="1.2" fill="#fef3c7" opacity={0.8} />
        ))}
        <text x="420" y="125" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">Ziro Valley</text>
        <text x="420" y="137" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Bortle 1-2</text>
        <text x="420" y="149" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">~7500 stars</text>
      </g>

      {/* City sky comparison */}
      <g>
        <circle cx="420" cy="210" r="25" fill="#422006" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3,2" />
        {/* Few stars */}
        {[[-5,-5],[8,3],[0,10]].map(([dx,dy], i) => (
          <circle key={i} cx={420 + dx} cy={210 + dy} r="1.5" fill="#fef3c7" opacity={0.5} />
        ))}
        <text x="420" y="245" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600">Guwahati</text>
        <text x="420" y="257" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">Bortle 7-8</text>
        <text x="420" y="269" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="8">~50 stars</text>
      </g>

      {/* Scale */}
      <text x="200" y="295" textAnchor="middle" className="fill-gray-500 dark:fill-slate-400" fontSize="9">Light spreads outward from cities in all directions</text>
    </svg>
  );
}
