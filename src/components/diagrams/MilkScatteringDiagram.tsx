export default function MilkScatteringDiagram() {
  return (
    <div className="bg-gray-900 rounded-xl p-4 my-3">
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Milk-in-Water Scattering Experiment
      </p>
      <svg viewBox="0 0 500 243" className="w-full max-w-md mx-auto">
        {/* Table surface */}
        <rect x="20" y="170" width="400" height="8" rx="2" fill="#5c4a32" />

        {/* Glass */}
        <rect x="140" y="60" width="120" height="110" rx="4" fill="rgba(173,216,230,0.15)" stroke="rgba(200,220,240,0.4)" strokeWidth={1.5} />
        {/* Water with milk — slightly cloudy */}
        <rect x="142" y="75" width="116" height="93" rx="3" fill="rgba(200,210,220,0.2)" />
        {/* Milk particles (tiny dots) */}
        {Array.from({ length: 25 }, (_, i) => (
          <circle
            key={i}
            cx={150 + Math.random() * 100}
            cy={80 + Math.random() * 82}
            r={1.2}
            fill="rgba(255,255,255,0.3)"
          />
        ))}

        {/* Flashlight on the left */}
        <rect x="40" y="100" width="60" height="30" rx="6" fill="#555" />
        <rect x="90" y="104" width="15" height="22" rx="3" fill="#777" />
        <circle x="55" y="115" r="4" fill="#FFD700" />
        {/* Flashlight label */}
        <text x="70" y="148" textAnchor="middle" className="text-[8px]" fill="#aaa">Flashlight</text>

        {/* Light beam entering glass — white */}
        <line x1="105" y1="115" x2="142" y2="115" stroke="white" strokeWidth={3} opacity={0.7} />

        {/* Blue scattered light going UP and DOWN (sideways view) */}
        <line x1="170" y1="115" x2="170" y2="65" stroke="#4169E1" strokeWidth={1.5} opacity={0.6} />
        <line x1="190" y1="115" x2="195" y2="70" stroke="#4169E1" strokeWidth={1.2} opacity={0.5} />
        <line x1="210" y1="115" x2="205" y2="68" stroke="#4169E1" strokeWidth={1.2} opacity={0.4} />
        <line x1="180" y1="115" x2="175" y2="165" stroke="#4169E1" strokeWidth={1.2} opacity={0.4} />
        <line x1="200" y1="115" x2="210" y2="163" stroke="#4169E1" strokeWidth={1} opacity={0.3} />

        {/* Blue glow label — side view */}
        <text x="175" y="55" textAnchor="middle" className="text-[9px] font-semibold" fill="#4169E1">Blue glow</text>
        <text x="175" y="45" textAnchor="middle" className="text-[7px]" fill="#6688cc">(view from side)</text>

        {/* Orange/red light exiting right side of glass */}
        <line x1="260" y1="115" x2="320" y2="115" stroke="#FF6B35" strokeWidth={3} opacity={0.7} />
        <line x1="320" y1="115" x2="350" y2="115" stroke="#DC143C" strokeWidth={2.5} opacity={0.5} />

        {/* Eye looking from the right */}
        <ellipse cx="370" cy="115" rx="12" ry="8" fill="white" stroke="#666" strokeWidth={1} />
        <circle cx="370" cy="115" r="4" fill="#4a3728" />
        <circle cx="371" cy="114" r="1.5" fill="white" />
        <text x="370" y="140" textAnchor="middle" className="text-[8px]" fill="#aaa">Your eye</text>

        {/* Orange label */}
        <text x="310" y="105" textAnchor="middle" className="text-[9px] font-semibold" fill="#FF6B35">Orange-red</text>
        <text x="310" y="95" textAnchor="middle" className="text-[7px]" fill="#cc8855">(view from end)</text>

        {/* Eye looking from the side (top) */}
        <ellipse cx="175" cy="30" rx="8" ry="6" fill="white" stroke="#666" strokeWidth={1} />
        <circle cx="175" cy="30" r="3" fill="#4a3728" />
        <circle cx="175.5" cy="29.5" r="1" fill="white" />

        {/* Explanation at bottom */}
        <text x="220" y="193" textAnchor="middle" className="text-[8px]" fill="#888">
          Tiny milk particles scatter blue light sideways — just like air molecules scatter sunlight
        </text>
      </svg>
    </div>
  );
}
