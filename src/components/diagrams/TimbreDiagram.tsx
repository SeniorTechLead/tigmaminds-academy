export default function TimbreDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 780 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Timbre comparison: how flute, drum, and string produce different harmonic profiles at the same pitch"
      >
        <rect width="780" height="460" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="390" y="32" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-fuchsia-600 dark:fill-fuchsia-400">
          Timbre: Why Instruments Sound Different
        </text>
        <text x="390" y="54" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">
          Same note, same loudness \u2014 different harmonic mixtures
        </text>

        {/* Flute */}
        <g transform="translate(0, 75)">
          <text x="80" y="15" fontSize="13" fontWeight="700" className="fill-cyan-600 dark:fill-cyan-400">
            Bamboo Flute (muri)
          </text>
          <text x="80" y="32" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Mostly fundamental, weak harmonics \u2192 pure, clear
          </text>
          {/* Waveform */}
          <path
            d="M 80 70 Q 160 30 240 70 Q 320 110 400 70 Q 480 30 560 70 Q 640 110 700 70"
            fill="none" stroke="#06b6d4" strokeWidth="2.5"
          />
          {/* Harmonic bars */}
          <g transform="translate(80, 90)">
            <rect x="0" y={40 - 35} width="20" height="35" rx="2" fill="#06b6d4" opacity="0.7" />
            <rect x="30" y={40 - 8} width="20" height="8" rx="2" fill="#06b6d4" opacity="0.5" />
            <rect x="60" y={40 - 3} width="20" height="3" rx="2" fill="#06b6d4" opacity="0.3" />
            <text x="0" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">f</text>
            <text x="30" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">2f</text>
            <text x="60" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">3f</text>
          </g>
        </g>

        {/* Drum */}
        <g transform="translate(0, 210)">
          <text x="80" y="15" fontSize="13" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">
            Dimasa Drum (khram)
          </text>
          <text x="80" y="32" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Non-harmonic overtones \u2192 rich, complex thud
          </text>
          {/* Waveform */}
          <path
            d="M 80 70 L 120 30 L 140 85 L 180 45 L 220 75 L 280 55 L 340 70 Q 440 68 560 70 L 700 70"
            fill="none" stroke="#d97706" strokeWidth="2.5"
          />
          {/* Harmonic bars - many varied */}
          <g transform="translate(80, 90)">
            <rect x="0" y={40 - 25} width="20" height="25" rx="2" fill="#d97706" opacity="0.7" />
            <rect x="30" y={40 - 20} width="20" height="20" rx="2" fill="#d97706" opacity="0.6" />
            <rect x="60" y={40 - 15} width="20" height="15" rx="2" fill="#d97706" opacity="0.5" />
            <rect x="90" y={40 - 18} width="20" height="18" rx="2" fill="#d97706" opacity="0.4" />
            <rect x="120" y={40 - 10} width="20" height="10" rx="2" fill="#d97706" opacity="0.3" />
            <text x="0" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">f</text>
            <text x="30" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">2.3f</text>
            <text x="60" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">3.6f</text>
          </g>
        </g>

        {/* String */}
        <g transform="translate(0, 345)">
          <text x="80" y="15" fontSize="13" fontWeight="700" className="fill-emerald-600 dark:fill-emerald-400">
            Silk String
          </text>
          <text x="80" y="32" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
            Strong odd and even harmonics \u2192 rich, warm
          </text>
          {/* Waveform */}
          <path
            d="M 80 70 Q 130 20 180 70 Q 210 95 240 70 Q 270 45 300 70 Q 350 100 400 70 Q 430 40 460 70 Q 490 95 520 70 Q 570 30 620 70 Q 660 95 700 70"
            fill="none" stroke="#059669" strokeWidth="2.5"
          />
          {/* Harmonic bars */}
          <g transform="translate(80, 90)">
            <rect x="0" y={40 - 30} width="20" height="30" rx="2" fill="#059669" opacity="0.7" />
            <rect x="30" y={40 - 22} width="20" height="22" rx="2" fill="#059669" opacity="0.6" />
            <rect x="60" y={40 - 15} width="20" height="15" rx="2" fill="#059669" opacity="0.5" />
            <rect x="90" y={40 - 10} width="20" height="10" rx="2" fill="#059669" opacity="0.4" />
            <text x="0" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">f</text>
            <text x="30" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">2f</text>
            <text x="60" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">3f</text>
            <text x="90" y="52" fontSize="8" className="fill-gray-500 dark:fill-slate-400">4f</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
