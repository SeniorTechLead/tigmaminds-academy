const SearchIndexDiagram = () => {
  const words = [
    { word: 'river', y: 52, docs: [0, 2] },
    { word: 'fish', y: 92, docs: [0, 1, 3] },
    { word: 'bridge', y: 132, docs: [1, 2] },
    { word: 'monsoon', y: 172, docs: [2, 3] },
    { word: 'boat', y: 212, docs: [0, 3] },
  ];

  const docs = [
    { id: 'Doc A', y: 62 },
    { id: 'Doc B', y: 112 },
    { id: 'Doc C', y: 162 },
    { id: 'Doc D', y: 212 },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <svg
        viewBox="0 0 520 280"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Inverted index diagram showing words mapping to document lists"
      >
        <style>{`
          .label-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
          }
          .title-text {
            font-family: system-ui, sans-serif;
            font-size: 13px;
            font-weight: 600;
          }
          .word-text {
            font-family: ui-monospace, monospace;
            font-size: 12px;
            font-weight: 500;
          }
          .doc-text {
            font-family: system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
          }
        `}</style>

        {/* Background */}
        <rect width="500" height="260" rx="8"
          className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />

        {/* Title */}
        <text x="250" y="28" textAnchor="middle"
          className="title-text fill-slate-800 dark:fill-slate-100">
          Inverted Index (Search Engine)
        </text>

        {/* Column headers */}
        <text x="100" y="42" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">Terms</text>
        <text x="400" y="42" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400">Documents</text>

        {/* Word boxes */}
        {words.map((w) => (
          <g key={w.word}>
            <rect x="40" y={w.y - 14} width="120" height="26" rx="4"
              fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
            <text x="100" y={w.y + 1} textAnchor="middle"
              className="word-text" fill="#7c3aed">{`"${w.word}"`}</text>
          </g>
        ))}

        {/* Document boxes */}
        {docs.map((d, i) => (
          <g key={d.id}>
            <rect x="360" y={d.y - 14} width="80" height="26" rx="4"
              fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="400" y={d.y + 1} textAnchor="middle"
              className="doc-text" fill="#2563eb">{d.id}</text>
          </g>
        ))}

        {/* Mapping lines */}
        {words.map((w) =>
          w.docs.map((dIdx) => (
            <line
              key={`${w.word}-${dIdx}`}
              x1="160" y1={w.y}
              x2="360" y2={docs[dIdx].y}
              stroke="#94a3b8" strokeWidth="1" opacity="0.5"
            />
          ))
        )}

        {/* Arrow decoration on lines */}
        <defs>
          <marker id="idx-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Bottom note */}
        <text x="250" y="248" textAnchor="middle"
          className="label-text fill-slate-500 dark:fill-slate-400" style={{ fontSize: '10px', fontStyle: 'italic' }}>
          Each term points to all documents containing it — like a reverse phone book
        </text>
      </svg>
    </div>
  );
};

export default SearchIndexDiagram;
