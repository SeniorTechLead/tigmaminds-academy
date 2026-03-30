export default function PopUrbanizationDiagram() {
  return (
    <div className="w-full max-w-lg mx-auto my-4">
      <svg viewBox="0 0 520 360" className="w-full h-auto" role="img"
        aria-label="Diagram showing rural to urban migration flow and urbanization trends">
        <rect width="520" height="360" rx="8" className="fill-slate-950 dark:fill-slate-950 stroke-slate-700" strokeWidth="1" />

        <text x="260" y="26" textAnchor="middle" fontSize="14" fontWeight="600" fill="#e2e8f0">
          Urbanization: Rural to Urban Migration
        </text>

        {/* Rural scene */}
        <rect x="20" y="50" width="170" height="170" rx="8" fill="none" stroke="#34d399" strokeWidth="1.5" />
        <rect x="20" y="50" width="170" height="24" rx="8 8 0 0" fill="#166534" opacity="0.3" />
        <text x="105" y="67" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6ee7b7">Rural</text>

        {/* Rural elements */}
        <rect x="55" y="120" width="18" height="20" rx="2" fill="#713f12" opacity="0.5" />
        <polygon points="48,120 64,105 80,120" fill="#854d0e" opacity="0.5" />
        <rect x="105" y="125" width="16" height="15" rx="2" fill="#713f12" opacity="0.5" />
        <polygon points="100,125 113,112 126,125" fill="#854d0e" opacity="0.5" />
        {/* Trees */}
        <circle cx="150" cy="118" r="10" fill="#22c55e" opacity="0.4" />
        <line x1="150" y1="128" x2="150" y2="140" stroke="#713f12" strokeWidth="2" />
        <circle cx="40" cy="122" r="8" fill="#22c55e" opacity="0.4" />
        <line x1="40" y1="130" x2="40" y2="140" stroke="#713f12" strokeWidth="2" />
        {/* Fields */}
        <rect x="30" y="150" width="150" height="25" rx="3" fill="#166534" opacity="0.2" />
        <text x="105" y="166" textAnchor="middle" fontSize="10" fill="#6ee7b7">Farmland</text>

        <text x="105" y="195" textAnchor="middle" fontSize="10" fill="#94a3b8">Limited jobs</text>
        <text x="105" y="208" textAnchor="middle" fontSize="10" fill="#94a3b8">Fewer schools/hospitals</text>

        {/* Arrow flow */}
        <g transform="translate(200, 95)">
          <line x1="0" y1="40" x2="100" y2="40" stroke="#fbbf24" strokeWidth="2.5" markerEnd="url(#urbArrow)" />
          <text x="50" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Migration</text>
          <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#fde68a">Push: poverty, lack of opportunity</text>
          <text x="50" y="74" textAnchor="middle" fontSize="10" fill="#fde68a">Pull: jobs, education, services</text>
        </g>

        {/* Urban scene */}
        <rect x="315" y="50" width="185" height="170" rx="8" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="315" y="50" width="185" height="24" rx="8 8 0 0" fill="#1e40af" opacity="0.3" />
        <text x="407" y="67" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#93c5fd">Urban</text>

        {/* Buildings */}
        <rect x="335" y="100" width="20" height="55" rx="2" fill="#475569" opacity="0.6" />
        <rect x="337" y="105" width="4" height="4" fill="#fbbf24" opacity="0.5" />
        <rect x="343" y="105" width="4" height="4" fill="#fbbf24" opacity="0.5" />
        <rect x="337" y="115" width="4" height="4" fill="#fbbf24" opacity="0.5" />
        <rect x="343" y="115" width="4" height="4" fill="#fbbf24" opacity="0.5" />
        <rect x="337" y="125" width="4" height="4" fill="#fbbf24" opacity="0.5" />
        <rect x="343" y="125" width="4" height="4" fill="#fbbf24" opacity="0.5" />

        <rect x="365" y="85" width="25" height="70" rx="2" fill="#64748b" opacity="0.6" />
        <rect x="367" y="90" width="5" height="4" fill="#60a5fa" opacity="0.4" />
        <rect x="375" y="90" width="5" height="4" fill="#60a5fa" opacity="0.4" />
        <rect x="367" y="100" width="5" height="4" fill="#60a5fa" opacity="0.4" />
        <rect x="375" y="100" width="5" height="4" fill="#60a5fa" opacity="0.4" />

        <rect x="400" y="110" width="22" height="45" rx="2" fill="#475569" opacity="0.6" />
        <rect x="430" y="95" width="28" height="60" rx="2" fill="#64748b" opacity="0.6" />
        <rect x="468" y="120" width="18" height="35" rx="2" fill="#475569" opacity="0.5" />

        {/* Road */}
        <rect x="325" y="155" width="165" height="10" rx="2" fill="#374151" opacity="0.4" />
        <line x1="330" y1="160" x2="485" y2="160" stroke="#fbbf24" strokeWidth="1" strokeDasharray="8,6" />

        <text x="407" y="185" textAnchor="middle" fontSize="10" fill="#94a3b8">Jobs, education, healthcare</text>
        <text x="407" y="198" textAnchor="middle" fontSize="10" fill="#94a3b8">But: congestion, pollution, floods</text>

        {/* Stats bar */}
        <rect x="20" y="235" width="480" height="50" rx="6" fill="none" stroke="#475569" strokeWidth="1" />
        <text x="260" y="253" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e2e8f0">Global Urbanization Trend</text>

        {/* Progress bars */}
        <text x="50" y="274" fontSize="10" fill="#94a3b8">1950:</text>
        <rect x="85" y="266" width="120" height="12" rx="3" fill="#1e293b" />
        <rect x="85" y="266" width="36" height="12" rx="3" fill="#34d399" opacity="0.6" />
        <text x="130" y="275" fontSize="10" fill="#6ee7b7">30%</text>

        <text x="255" y="274" fontSize="10" fill="#94a3b8">2024:</text>
        <rect x="290" y="266" width="120" height="12" rx="3" fill="#1e293b" />
        <rect x="290" y="266" width="66" height="12" rx="3" fill="#60a5fa" opacity="0.6" />
        <text x="365" y="275" fontSize="10" fill="#93c5fd">55%</text>

        <text x="430" y="274" fontSize="10" fill="#94a3b8">2050:</text>
        <rect x="460" y="266" width="30" height="12" rx="3" fill="#1e293b" />
        <text x="475" y="275" fontSize="10" fill="#fbbf24">68%</text>

        {/* Guwahati callout */}
        <rect x="20" y="295" width="480" height="55" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" />
        <text x="260" y="315" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">Guwahati: NE India's Urbanization Story</text>
        <text x="260" y="332" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Population: 300,000 (1991) to 1.1 million (2021) | One of India's fastest-growing cities
        </text>
        <text x="260" y="346" textAnchor="middle" fontSize="10" fill="#94a3b8">
          Growth brings jobs and services but also congestion, flooding, and waste challenges
        </text>

        <defs>
          <marker id="urbArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <path d="M 0 0 L 10 3.5 L 0 7" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
