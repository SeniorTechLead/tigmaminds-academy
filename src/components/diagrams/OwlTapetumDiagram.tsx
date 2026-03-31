export default function OwlTapetumDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg
        viewBox="0 0 700 380"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Tapetum lucidum: a reflective layer behind the retina that bounces light back through photoreceptors for a second chance at detection, causing eye shine"
      >
        <rect width="700" height="380" rx="10" className="fill-white dark:fill-slate-950" />

        <text x="350" y="30" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-400">
          Tapetum Lucidum: The Eye Shine Secret
        </text>

        {/* Eye cross-section */}
        <g transform="translate(180, 200)">
          {/* Eyeball outline */}
          <ellipse cx="0" cy="0" rx="120" ry="100" className="fill-gray-100 dark:fill-gray-900/30" stroke="#6b7280" strokeWidth="1.5" />

          {/* Lens */}
          <ellipse cx="-60" cy="0" rx="25" ry="40" className="fill-blue-100 dark:fill-blue-900/20" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="-60" y="5" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-blue-700 dark:fill-blue-300">Lens</text>

          {/* Retina */}
          <path d="M40,-80 Q100,-60 110,0 Q100,60 40,80" fill="none" stroke="#16a34a" strokeWidth="4" />
          <text x="85" y="-75" fontSize="10" fontWeight="600" className="fill-green-700 dark:fill-green-300">Retina</text>
          <text x="85" y="-62" fontSize="9" className="fill-green-600 dark:fill-green-400">(rod cells)</text>

          {/* Tapetum behind retina */}
          <path d="M50,-75 Q110,-55 120,0 Q110,55 50,75" fill="#fbbf24" opacity="0.3" stroke="#f59e0b" strokeWidth="2" />
          <text x="115" y="80" fontSize="10" fontWeight="700" className="fill-amber-600 dark:fill-amber-400">Tapetum</text>
          <text x="115" y="93" fontSize="9" className="fill-amber-500 dark:fill-amber-400">lucidum</text>

          {/* Incoming light ray */}
          <line x1="-140" y1="-10" x2="80" y2="-10" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
          {/* Bounced ray */}
          <line x1="80" y1="-10" x2="80" y2="10" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" strokeDasharray="4 2" />
          <line x1="80" y1="10" x2="-140" y2="10" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 2" />

          {/* Labels on light */}
          <text x="-80" y="-20" fontSize="10" fontWeight="600" className="fill-amber-600 dark:fill-amber-400">Light in \u2192</text>
          <text x="-80" y="25" fontSize="10" className="fill-amber-500 dark:fill-amber-400">\u2190 Reflected back</text>

          {/* First pass label */}
          <text x="30" y="-25" fontSize="9" className="fill-green-600 dark:fill-green-400">1st pass</text>
          <text x="30" y="28" fontSize="9" className="fill-green-600 dark:fill-green-400">2nd pass</text>

          {/* Pupil */}
          <ellipse cx="-90" cy="0" rx="12" ry="30" fill="#1e1b4b" />
        </g>

        {/* Right panel: explanation */}
        <g transform="translate(380, 60)">
          <rect width="280" height="260" rx="8" className="fill-amber-50 dark:fill-amber-950/20" stroke="#f59e0b" strokeWidth="1" />
          <text x="140" y="24" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">How It Works</text>

          <g transform="translate(15, 40)">
            <text x="0" y="0" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">1. Light enters the eye</text>
            <text x="0" y="20" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">2. Passes through retina (rods detect some)</text>
            <text x="0" y="40" fontSize="11" fontWeight="600" className="fill-amber-700 dark:fill-amber-300">3. Hits tapetum \u2192 REFLECTED back</text>
            <text x="0" y="60" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">4. Passes through retina AGAIN</text>
            <text x="0" y="80" fontSize="11" fontWeight="600" className="fill-emerald-700 dark:fill-emerald-300">= Double chance to detect each photon</text>
          </g>

          {/* Eye shine explanation */}
          <g transform="translate(15, 145)">
            <rect width="250" height="50" rx="6" className="fill-indigo-100 dark:fill-indigo-900/20" stroke="#6366f1" strokeWidth="1" />
            <text x="125" y="18" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-indigo-700 dark:fill-indigo-300">Why eyes \u201cglow\u201d at night</text>
            <text x="125" y="36" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Some reflected light escapes back out</text>
            <text x="125" y="48" textAnchor="middle" fontSize="10" className="fill-gray-600 dark:fill-gray-400">through the pupil \u2192 eye shine in photos!</text>
          </g>

          {/* Animals with tapetum */}
          <text x="15" y="218" fontSize="11" fontWeight="600" className="fill-gray-700 dark:fill-gray-300">Animals with tapetum:</text>
          <text x="15" y="236" fontSize="10" className="fill-gray-600 dark:fill-gray-400">Cats, dogs, deer, owls, crocodiles</text>
          <text x="15" y="250" fontSize="10" fontWeight="600" className="fill-red-600 dark:fill-red-400">Humans lack a tapetum \u2192 no eye shine</text>
        </g>

        {/* Bottom */}
        <rect x="50" y="348" width="600" height="24" rx="6" className="fill-indigo-50 dark:fill-indigo-950/30" stroke="#6366f1" strokeWidth="1" />
        <text x="350" y="365" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-indigo-800 dark:fill-indigo-200">
          The tapetum effectively doubles the light available to the retina \u2014 essential for hunting by starlight
        </text>
      </svg>
    </div>
  );
}
