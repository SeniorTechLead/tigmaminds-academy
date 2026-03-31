export default function ColorMixerOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Output of a color mixing simulator showing additive and subtractive results side by side">
        <rect width="780" height="300" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="28" textAnchor="middle" fontSize="14" fontWeight="700" className="fill-gray-800 dark:fill-slate-100">Project Output: Color Mixing Simulator</text>
        <text x="200" y="55" textAnchor="middle" fontSize="12" fontWeight="600" fill="#3b82f6">Additive (Light)</text>
        <circle cx="165" cy="130" r="50" fill="#ef4444" fillOpacity="0.5" /><circle cx="235" cy="130" r="50" fill="#22c55e" fillOpacity="0.5" /><circle cx="200" cy="190" r="50" fill="#3b82f6" fillOpacity="0.5" />
        <text x="200" y="155" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">White</text>
        <text x="580" y="55" textAnchor="middle" fontSize="12" fontWeight="600" fill="#ec4899">Subtractive (Pigment)</text>
        <circle cx="545" cy="130" r="50" fill="#06b6d4" fillOpacity="0.5" /><circle cx="615" cy="130" r="50" fill="#ec4899" fillOpacity="0.5" /><circle cx="580" cy="190" r="50" fill="#eab308" fillOpacity="0.5" />
        <circle cx="580" cy="155" r="15" fill="#1e1b18" fillOpacity="0.7" />
        <text x="580" y="160" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="600">Black</text>
        <text x="390" y="275" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">More light = brighter (white). More pigment = darker (black). Opposite systems!</text>
      </svg>
    </div>
  );
}
