export default function LibraryDatabaseDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 540" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Database tables for a library showing books, borrowers, and loans with relationships">
        <rect width="780" height="540" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0891b2">Database Tables: How a Library Organizes Data</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Each table stores one type of thing — relationships connect them</text>

        {/* BOOKS TABLE */}
        <g transform="translate(30, 80)">
          <rect width="230" height="210" rx="8" fill="#ecfeff" stroke="#06b6d4" strokeWidth="2" className="dark:fill-cyan-950/30" />
          <rect width="230" height="32" rx="8" fill="#06b6d4" />
          <text x="115" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">Books</text>
          {[
            ['book_id', '1', 'Primary Key'],
            ['title', 'Folktales of Assam', ''],
            ['author', 'Lakshminath B.', ''],
            ['genre', 'Folklore', ''],
            ['available', 'true', ''],
          ].map(([field, val, note], i) => (
            <g key={i} transform={`translate(0, ${38 + i * 34})`}>
              <line x1="10" y1="30" x2="220" y2="30" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
              <text x="15" y="20" fontSize="11" fontWeight="600" fill="#06b6d4">{field}</text>
              <text x="130" y="20" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{val}</text>
              {note && <text x="210" y="20" textAnchor="end" fontSize="10" fill="#f59e0b">{note}</text>}
            </g>
          ))}
        </g>

        {/* BORROWERS TABLE */}
        <g transform="translate(540, 80)">
          <rect width="210" height="176" rx="8" fill="#fdf4ff" stroke="#a855f7" strokeWidth="2" className="dark:fill-purple-950/30" />
          <rect width="210" height="32" rx="8" fill="#a855f7" />
          <text x="105" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">Borrowers</text>
          {[
            ['borrower_id', '42', 'Primary Key'],
            ['name', 'Rina', ''],
            ['village', 'Bhalukpara', ''],
            ['join_date', '2024-03-15', ''],
          ].map(([field, val, note], i) => (
            <g key={i} transform={`translate(0, ${38 + i * 34})`}>
              <line x1="10" y1="30" x2="200" y2="30" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
              <text x="15" y="20" fontSize="11" fontWeight="600" fill="#a855f7">{field}</text>
              <text x="120" y="20" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{val}</text>
              {note && <text x="195" y="20" textAnchor="end" fontSize="10" fill="#f59e0b">{note}</text>}
            </g>
          ))}
        </g>

        {/* LOANS TABLE */}
        <g transform="translate(260, 330)">
          <rect width="260" height="190" rx="8" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" className="dark:fill-green-950/30" />
          <rect width="260" height="32" rx="8" fill="#22c55e" />
          <text x="130" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">Loans (connects both!)</text>
          {[
            ['loan_id', '207', ''],
            ['book_id', '1', 'Foreign Key →'],
            ['borrower_id', '42', 'Foreign Key →'],
            ['borrow_date', '2024-06-01', ''],
            ['return_date', 'null', 'Not returned yet'],
          ].map(([field, val, note], i) => (
            <g key={i} transform={`translate(0, ${38 + i * 30})`}>
              <line x1="10" y1="26" x2="250" y2="26" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
              <text x="15" y="18" fontSize="11" fontWeight="600" fill="#22c55e">{field}</text>
              <text x="120" y="18" fontSize="11" className="fill-gray-600 dark:fill-slate-300">{val}</text>
              {note && <text x="245" y="18" textAnchor="end" fontSize="10" fill="#f59e0b">{note}</text>}
            </g>
          ))}
        </g>

        {/* Relationship arrows */}
        {/* Books -> Loans */}
        <path d="M 145 290 L 145 325 L 310 330" fill="none" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowCyan)" />
        {/* Borrowers -> Loans */}
        <path d="M 645 256 L 645 400 L 520 400" fill="none" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowPurple)" />

        <defs>
          <marker id="arrowCyan" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6" fill="#06b6d4" />
          </marker>
          <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
            <path d="M8,0 L0,3 L8,6" fill="#a855f7" />
          </marker>
        </defs>

        {/* Labels on arrows */}
        <text x="180" y="316" fontSize="10" fontWeight="600" fill="#06b6d4">book_id links here</text>
        <text x="545" y="340" fontSize="10" fontWeight="600" fill="#a855f7">borrower_id links here</text>

        {/* Key insight */}
        <rect x="30" y="310" width="210" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" />
        <text x="135" y="328" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">One table per "thing".</text>
        <text x="135" y="344" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">Relationships connect them.</text>
      </svg>
    </div>
  );
}
