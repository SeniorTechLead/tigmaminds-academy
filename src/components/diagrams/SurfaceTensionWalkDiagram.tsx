export default function SurfaceTensionWalkDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Surface tension: water molecules pull on each other to create an elastic-like surface film">
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-gray-100">Surface Tension: Water\u2019s Invisible Skin</text>
        <text x="350" y="48" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Water molecules pull on their neighbours \u2014 at the surface, this creates an elastic film</text>

        {/* Water body */}
        <rect x="100" y="180" width="500" height="120" rx="4" fill="#3b82f6" opacity="0.08" />
        <line x1="100" y1="180" x2="600" y2="180" stroke="#3b82f6" strokeWidth="2" />
        <text x="610" y="184" fontSize="10" fill="#3b82f6" fontWeight="600">Surface</text>

        {/* Interior molecule \u2014 pulled in all directions */}
        <circle cx="350" cy="260" r="10" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="350" y="264" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-gray-800 dark:fill-white">H\u2082O</text>
        {/* Arrows all directions */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = 22;
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={350} y1={260} x2={350 + r * Math.cos(rad)} y2={260 + r * Math.sin(rad)} stroke="#60a5fa" strokeWidth="1" markerEnd="url(#tinyBlue)" />;
        })}
        <text x="350" y="300" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Interior: pulled equally in all directions \u2192 balanced</text>

        {/* Surface molecule \u2014 pulled sideways and down only */}
        <circle cx="200" cy="180" r="10" fill="#3b82f6" opacity="0.3" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="200" y="184" textAnchor="middle" fontSize="8" fontWeight="700" className="fill-gray-800 dark:fill-white">H\u2082O</text>
        {[135, 180, 225, 270].map(a => {
          const r = 22;
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={200} y1={180} x2={200 + r * Math.cos(rad)} y2={180 + r * Math.sin(rad)} stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#tinyBlue)" />;
        })}
        <text x="200" y="148" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Surface: only pulled sideways</text>
        <text x="200" y="161" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">and down \u2192 surface tension!</text>

        <defs><marker id="tinyBlue" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#60a5fa" /></marker></defs>

        {/* Insect walking */}
        <g transform="translate(500, 150)">
          <ellipse cx="0" cy="0" rx="15" ry="6" className="fill-gray-600 dark:fill-slate-300" opacity="0.5" />
          {/* Legs dimpling surface */}
          {[-12, -4, 4, 12].map((lx, i) => (
            <g key={i}>
              <line x1={lx} y1={6} x2={lx} y2={30} className="stroke-gray-500 dark:stroke-slate-400" strokeWidth="0.8" />
              <ellipse cx={lx} cy={30} rx="4" ry="2" fill="#3b82f6" opacity="0.2" />
            </g>
          ))}
          <text x="0" y="-14" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">Insect walks on</text>
          <text x="0" y="-3" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-slate-300">surface tension</text>
        </g>

        {/* Facts box */}
        <rect x="100" y="325" width="500" height="36" rx="6" className="fill-blue-50 dark:fill-blue-900/15" stroke="#3b82f6" strokeWidth="1" />
        <text x="350" y="342" textAnchor="middle" fontSize="11" className="fill-gray-700 dark:fill-slate-200">Water\u2019s surface tension = 72.8 mN/m at 25\u00B0C \u2014 unusually high due to hydrogen bonding</text>
        <text x="350" y="356" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">This helps lotus leaves trap air underneath for extra buoyancy</text>
      </svg>
    </div>
  );
}
