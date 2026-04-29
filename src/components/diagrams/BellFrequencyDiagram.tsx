export default function BellFrequencyDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <svg
        viewBox="0 0 560 360"
        className="w-full h-auto"
        role="img"
        aria-label="Diagram comparing frequency, wavelength, and amplitude of different bells"
      >
        <style>{`
          .bf-title { font-family: system-ui, sans-serif; font-size: 14px; font-weight: 600; }
          .bf-label { font-family: system-ui, sans-serif; font-size: 11px; }
          .bf-small { font-family: system-ui, sans-serif; font-size: 10px; }
          .bf-bold { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600; }
        `}</style>

        <rect width="560" height="360" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        <text x="280" y="26" textAnchor="middle" className="bf-title fill-gray-700 dark:fill-gray-200">
          Frequency, Wavelength & Amplitude
        </text>

        {/* === Row 1: Low frequency (large bell) === */}
        <text x="30" y="62" className="bf-bold fill-amber-600 dark:fill-amber-400">
          Large Bell
        </text>
        <text x="30" y="76" className="bf-small fill-gray-500 dark:fill-gray-400">
          Low pitch • Long λ
        </text>

        {/* Low frequency wave: 2 cycles */}
        <path
          d="M 130 90 Q 165 50 200 90 Q 235 130 270 90 Q 305 50 340 90 Q 375 130 410 90"
          fill="none" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="2.5" />
        <line x1="130" y1="90" x2="530" y2="90"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />

        {/* Wavelength marker */}
        <line x1="130" y1="108" x2="270" y2="108"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <line x1="130" y1="104" x2="130" y2="112"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <line x1="270" y1="104" x2="270" y2="112"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <text x="200" y="122" textAnchor="middle" className="bf-small fill-emerald-600 dark:fill-emerald-400">
          λ = long
        </text>

        <text x="440" y="75" className="bf-small fill-amber-600 dark:fill-amber-400">
          f = 200 Hz
        </text>
        <text x="440" y="90" className="bf-small fill-gray-500 dark:fill-gray-400">
          Deep, low rumble
        </text>

        {/* === Row 2: High frequency (small bell) === */}
        <text x="30" y="165" className="bf-bold fill-blue-600 dark:fill-blue-400">
          Small Bell
        </text>
        <text x="30" y="179" className="bf-small fill-gray-500 dark:fill-gray-400">
          High pitch • Short λ
        </text>

        {/* High frequency wave: 5 cycles */}
        <path
          d="M 130 190 Q 145 160 160 190 Q 175 220 190 190 Q 205 160 220 190 Q 235 220 250 190 Q 265 160 280 190 Q 295 220 310 190 Q 325 160 340 190 Q 355 220 370 190 Q 385 160 400 190 Q 415 220 430 190"
          fill="none" className="stroke-blue-500 dark:stroke-blue-400" strokeWidth="2" />
        <line x1="130" y1="190" x2="530" y2="190"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />

        {/* Wavelength marker */}
        <line x1="130" y1="208" x2="190" y2="208"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <line x1="130" y1="204" x2="130" y2="212"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <line x1="190" y1="204" x2="190" y2="212"
          className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="1" />
        <text x="160" y="222" textAnchor="middle" className="bf-small fill-emerald-600 dark:fill-emerald-400">
          λ = short
        </text>

        <text x="440" y="175" className="bf-small fill-blue-600 dark:fill-blue-400">
          f = 800 Hz
        </text>
        <text x="440" y="190" className="bf-small fill-gray-500 dark:fill-gray-400">
          Bright, high ring
        </text>

        {/* === Row 3: Amplitude comparison === */}
        <text x="30" y="265" className="bf-bold fill-red-600 dark:fill-red-400">
          Amplitude
        </text>
        <text x="30" y="279" className="bf-small fill-gray-500 dark:fill-gray-400">
          Loudness
        </text>

        {/* Loud wave (large amplitude) */}
        <path
          d="M 130 290 Q 155 240 180 290 Q 205 340 230 290"
          fill="none" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2.5" />
        <line x1="130" y1="290" x2="330" y2="290"
          className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="0.5" strokeDasharray="4 3" />
        {/* Amplitude arrow */}
        <line x1="155" y1="290" x2="155" y2="252"
          className="stroke-red-500 dark:stroke-red-400" strokeWidth="1" strokeDasharray="3 2" />
        <text x="158" y="268" className="bf-small fill-red-500 dark:fill-red-400">
          Loud
        </text>

        {/* Quiet wave (small amplitude) */}
        <path
          d="M 280 290 Q 295 272 310 290 Q 325 308 340 290"
          fill="none" className="stroke-red-400 dark:stroke-red-300" strokeWidth="1.5" />
        {/* Amplitude arrow */}
        <line x1="295" y1="290" x2="295" y2="277"
          className="stroke-red-400 dark:stroke-red-300" strokeWidth="1" strokeDasharray="3 2" />
        <text x="298" y="285" className="bf-small fill-red-400 dark:fill-red-300">
          Quiet
        </text>

        {/* Equation box */}
        <rect x="380" y="255" width="165" height="55" rx="6"
          className="fill-violet-50 dark:fill-violet-900/30 stroke-violet-300 dark:stroke-violet-600" strokeWidth="1" />
        <text x="462" y="274" textAnchor="middle" className="bf-bold fill-violet-700 dark:fill-violet-300">
          v = f × λ
        </text>
        <text x="462" y="289" textAnchor="middle" className="bf-small fill-violet-600 dark:fill-violet-400">
          speed = frequency × wavelength
        </text>
        <text x="462" y="303" textAnchor="middle" className="bf-small fill-gray-500 dark:fill-gray-400">
          Sound speed in air ≈ 343 m/s
        </text>

        {/* Bottom summary */}
        <text x="280" y="352" textAnchor="middle" className="bf-small fill-gray-500 dark:fill-gray-400">
          Bigger bells vibrate slower (low f, long λ) • Harder strike = larger amplitude = louder sound
        </text>
      </svg>
    </div>
  );
}
