export default function RainColorVividDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram explaining why colors look more vivid after rain: clean air, wet surface reflection, diffuse sky light"
      >
        <rect width="780" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">
          Why Rain Makes Colors More Vivid
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Three physics reasons Bansara&apos;s rain paintings looked so alive
        </text>

        {/* Reason 1 */}
        <rect x="30" y="75" width="230" height="220" rx="10" className="fill-white dark:fill-slate-900" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="60" cy="100" r="16" fill="#3b82f6" fillOpacity="0.2" />
        <text x="60" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#3b82f6">1</text>
        <text x="80" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Clean air</text>

        {/* Dust particles before rain */}
        <text x="145" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Before rain:</text>
        <rect x="50" y="140" width="190" height="40" rx="4" fill="#94a3b8" fillOpacity="0.15" />
        {[70, 90, 120, 150, 170, 200].map((x, i) => (
          <circle key={i} cx={x} cy={155 + (i % 2) * 8} r={2 + i % 3} fill="#94a3b8" fillOpacity="0.5" />
        ))}
        <text x="145" y="198" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">After rain:</text>
        <rect x="50" y="208" width="190" height="40" rx="4" fill="#60a5fa" fillOpacity="0.08" />
        <text x="145" y="232" textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="600">
          Dust washed out!
        </text>
        <text x="145" y="268" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Less haze = light travels
        </text>
        <text x="145" y="282" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          without scattering {'\u2192'} truer colors
        </text>

        {/* Reason 2 */}
        <rect x="280" y="75" width="230" height="220" rx="10" className="fill-white dark:fill-slate-900" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="310" cy="100" r="16" fill="#22c55e" fillOpacity="0.2" />
        <text x="310" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#22c55e">2</text>
        <text x="335" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Wet surfaces</text>

        {/* Dry leaf vs wet leaf */}
        <text x="395" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Dry surface:</text>
        <rect x="310" y="140" width="170" height="35" rx="4" fill="#22c55e" fillOpacity="0.2" />
        {/* Scattered light arrows */}
        {[330, 360, 390, 420, 450].map((x, i) => (
          <line key={i} x1={x} y1="140" x2={x + (i - 2) * 8} y2="118" stroke="#94a3b8" strokeWidth="1" opacity="0.4" />
        ))}
        <text x="395" y="192" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Wet surface:</text>
        <rect x="310" y="202" width="170" height="35" rx="4" fill="#22c55e" fillOpacity="0.5" />
        {/* Water film */}
        <rect x="310" y="199" width="170" height="5" rx="2" fill="#60a5fa" fillOpacity="0.3" />
        {/* Specular reflection */}
        <line x1="395" y1="199" x2="395" y2="178" stroke="#fbbf24" strokeWidth="1.5" />

        <text x="395" y="258" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Water film fills surface bumps
        </text>
        <text x="395" y="272" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          {'\u2192'} less random scattering
        </text>
        <text x="395" y="286" textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="600">
          {'\u2192'} deeper, richer color
        </text>

        {/* Reason 3 */}
        <rect x="530" y="75" width="220" height="220" rx="10" className="fill-white dark:fill-slate-900" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="560" cy="100" r="16" fill="#f97316" fillOpacity="0.2" />
        <text x="560" y="106" textAnchor="middle" fontSize="14" fontWeight="700" fill="#f97316">3</text>
        <text x="585" y="106" fontSize="12" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Soft, even light</text>

        {/* Sun vs clouds */}
        <text x="640" y="130" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Direct sun:</text>
        <circle cx="640" cy="155" r="18" fill="#fbbf24" fillOpacity="0.5" />
        <text x="640" y="160" textAnchor="middle" fontSize="16">{'\u2600\uFE0F'}</text>
        <text x="640" y="185" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">harsh shadows</text>

        <text x="640" y="205" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Overcast:</text>
        <rect x="600" y="215" width="80" height="30" rx="10" fill="#94a3b8" fillOpacity="0.2" />
        <text x="640" y="235" textAnchor="middle" fontSize="16">{'\u2601\uFE0F'}</text>
        <text x="640" y="260" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">soft, diffuse light</text>
        <text x="640" y="276" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="600">
          colors glow evenly
        </text>

        {/* Summary */}
        <rect x="60" y="320" width="660" height="100" rx="10" fill="#ec4899" fillOpacity="0.06" stroke="#ec4899" strokeWidth="1" />
        <text x="390" y="345" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ec4899">
          Bansara Was Right: Rain Reveals Hidden Colors
        </text>
        <text x="390" y="368" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-pink-300">
          Clean air lets light through without distortion. Wet surfaces absorb light more deeply.
        </text>
        <text x="390" y="386" textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-pink-300">
          Overcast skies remove harsh shadows so you see true color everywhere.
        </text>
        <text x="390" y="405" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ec4899">
          Photographers call this the "golden hour of color" {'\u2014'} right after rain stops.
        </text>
      </svg>
    </div>
  );
}
