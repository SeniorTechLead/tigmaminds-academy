export default function HoliTeaConnectionDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 440"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tea gardens and Holi colors share the same chemistry: polyphenols, pH-dependent color changes, and mordant binding"
      >
        <rect width="700" height="440" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="350" y="32" textAnchor="middle" fontSize="15" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          Tea Gardens &amp; Holi: Same Chemistry, Different Uses
        </text>

        {/* Tea side */}
        <rect x="40" y="55" width="300" height="170" rx="10" className="fill-emerald-50 dark:fill-emerald-950/20 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
        <text x="190" y="78" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-300">{'\u2615'} Tea Chemistry</text>

        {[
          'Catechins (polyphenols) = color molecules',
          'Oxidation changes green \u2192 brown/red',
          'pH of soil affects plant chemistry',
          'Tannins bind to metal ions (iron = black)',
          'CTC process controls oxidation rate',
        ].map((text, i) => (
          <text key={i} x="65" y={102 + i * 20} fontSize="10" className="fill-gray-600 dark:fill-slate-400">\u2022 {text}</text>
        ))}

        {/* Holi side */}
        <rect x="360" y="55" width="300" height="170" rx="10" className="fill-rose-50 dark:fill-rose-950/20 stroke-rose-300 dark:stroke-rose-700" strokeWidth="1.5" />
        <text x="510" y="78" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-rose-700 dark:fill-rose-300">{'\ud83c\udfa8'} Holi Color Chemistry</text>

        {[
          'Anthocyanins/curcumin = color molecules',
          'pH changes yellow \u2192 red (turmeric)',
          'Acid/base controls dye behavior',
          'Mordants bind dye to fabric (alum, iron)',
          'Extraction method controls color intensity',
        ].map((text, i) => (
          <text key={i} x="385" y={102 + i * 20} fontSize="10" className="fill-gray-600 dark:fill-slate-400">\u2022 {text}</text>
        ))}

        {/* Shared principles - center bridge */}
        <rect x="130" y="240" width="440" height="130" rx="10" className="fill-fuchsia-50 dark:fill-fuchsia-950/20 stroke-fuchsia-300 dark:stroke-fuchsia-700" strokeWidth="1.5" />
        <text x="350" y="262" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-fuchsia-700 dark:fill-fuchsia-300">
          Shared Chemistry Principles
        </text>

        {[
          { icon: '\ud83e\uddea', title: 'Polyphenol molecules', desc: 'Both tea and Holi colors are based on plant polyphenols' },
          { icon: '\u2696\ufe0f', title: 'pH-dependent color change', desc: 'Hydrogen ion concentration alters molecular structure \u2192 new color' },
          { icon: '\ud83d\udd17', title: 'Metal ion binding', desc: 'Mordants (tea tannin + iron = ink; alum + dye = fast color)' },
          { icon: '\ud83d\udd2c', title: 'Conjugated double bonds', desc: 'The more conjugation, the longer the wavelength absorbed' },
        ].map(({ icon, title, desc }, i) => (
          <g key={title}>
            <text x="150" y={284 + i * 24} fontSize="12">{icon}</text>
            <text x="170" y={284 + i * 24} fontSize="10" fontWeight="600" className="fill-gray-700 dark:fill-slate-300">{title}</text>
            <text x="320" y={284 + i * 24} fontSize="9" className="fill-gray-500 dark:fill-slate-400">\u2014 {desc}</text>
          </g>
        ))}

        {/* Bottom insight */}
        <rect x="60" y="390" width="580" height="40" rx="8" className="fill-fuchsia-50 dark:fill-fuchsia-950/30 stroke-fuchsia-200 dark:stroke-fuchsia-800" strokeWidth="1" />
        <text x="350" y="408" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-fuchsia-700 dark:fill-fuchsia-300">
          The tea worker celebrating Holi uses the same chemistry at work and at play
        </text>
        <text x="350" y="424" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
          Curcumin, anthocyanins, catechins \u2014 all plant polyphenols, all color molecules, all pH-sensitive
        </text>
      </svg>
    </div>
  );
}
