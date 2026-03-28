export default function WavelengthSpectrum() {
  // Visible light spectrum with wavelength labels and Rayleigh scattering annotation
  const colors = [
    { color: '#8B00FF', label: 'Violet', nm: '380' },
    { color: '#4B0082', label: 'Indigo', nm: '420' },
    { color: '#0000FF', label: 'Blue', nm: '470' },
    { color: '#00FF00', label: 'Green', nm: '530' },
    { color: '#FFFF00', label: 'Yellow', nm: '580' },
    { color: '#FF7F00', label: 'Orange', nm: '610' },
    { color: '#FF0000', label: 'Red', nm: '700' },
  ];

  const barWidth = 600 / colors.length;

  return (
    <div className="my-4">
      <svg viewBox="0 0 600 180" className="w-full max-w-xl mx-auto" role="img" aria-label="Visible light spectrum">
        {/* Spectrum bars */}
        {colors.map((c, i) => (
          <g key={c.label}>
            <rect x={i * barWidth} y={20} width={barWidth} height={60} fill={c.color} />
            <text x={i * barWidth + barWidth / 2} y={100} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="10" fontWeight="600">
              {c.label}
            </text>
            <text x={i * barWidth + barWidth / 2} y={115} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
              {c.nm} nm
            </text>
          </g>
        ))}

        {/* Short wavelength label */}
        <text x={barWidth / 2} y={14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Short wavelength
        </text>
        <text x={barWidth / 2} y={140} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="9" fontWeight="600">
          ← Scattered most
        </text>

        {/* Long wavelength label */}
        <text x={600 - barWidth / 2} y={14} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
          Long wavelength
        </text>
        <text x={600 - barWidth / 2} y={140} textAnchor="middle" className="fill-red-600 dark:fill-red-400" fontSize="9" fontWeight="600">
          Scattered least →
        </text>

        {/* Annotation */}
        <text x={300} y={165} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
          Blue light scatters ~10x more than red — that is why the sky is blue
        </text>
      </svg>
    </div>
  );
}
