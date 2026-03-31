export default function LibraryAppOutputDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="Mockup of the community library web app with search bar and book cards">
        <rect width="780" height="420" rx="10" className="fill-white dark:fill-slate-950" />
        {/* Browser chrome */}
        <rect x="40" y="20" width="700" height="380" rx="8" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
        <rect x="40" y="20" width="700" height="32" rx="8" fill="#f3f4f6" className="dark:fill-slate-800" />
        <circle cx="60" cy="36" r="5" fill="#ef4444" />
        <circle cx="78" cy="36" r="5" fill="#f59e0b" />
        <circle cx="96" cy="36" r="5" fill="#22c55e" />
        <rect x="160" y="28" width="420" height="16" rx="4" className="fill-gray-200 dark:fill-slate-700" />
        <text x="370" y="41" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">bhalukpara-library.app</text>

        {/* App header */}
        <rect x="40" y="52" width="700" height="40" fill="#7c3aed" />
        <text x="80" y="78" fontSize="16" fontWeight="700" fill="#fff">📚 Bhalukpara Pustok Ghor</text>
        <rect x="540" y="62" width="180" height="22" rx="11" fill="#fff" opacity="0.2" />
        <text x="630" y="77" textAnchor="middle" fontSize="11" fill="#fff" opacity="0.8">Search books...</text>

        {/* Stats bar */}
        <rect x="40" y="92" width="700" height="28" className="fill-gray-50 dark:fill-slate-900" />
        {[
          { label: '523 books', x: 150 },
          { label: '47 readers', x: 330 },
          { label: '12 borrowed today', x: 540 },
        ].map((s, i) => (
          <text key={i} x={s.x} y={110} textAnchor="middle" fontSize="11" className="fill-gray-600 dark:fill-slate-400">{s.label}</text>
        ))}

        {/* Book grid */}
        {[
          { title: 'Folktales of Assam', author: 'Lakshminath B.', genre: 'Folklore', status: 'Available', statusColor: '#10b981' },
          { title: 'Science Class 8', author: 'NCERT', genre: 'Textbook', status: 'Borrowed', statusColor: '#f59e0b' },
          { title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fiction', status: 'Available', statusColor: '#10b981' },
          { title: 'Assamese Recipes', author: 'Bonti Das', genre: 'Cooking', status: 'Overdue', statusColor: '#ef4444' },
        ].map((book, i) => (
          <g key={i} transform={`translate(${60 + (i % 4) * 170}, 130)`}>
            <rect width="155" height="200" rx="6" className="fill-gray-50 dark:fill-slate-800" stroke="#e5e7eb" strokeWidth="1" />
            {/* Book cover placeholder */}
            <rect x="15" y="10" width="125" height="90" rx="4" fill={['#8b5cf6', '#3b82f6', '#ef4444', '#f59e0b'][i]} opacity="0.15" />
            <text x="77" y="60" textAnchor="middle" fontSize="28">{['📖', '🔬', '🧙', '🍳'][i]}</text>
            <text x="77" y="118" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-gray-800 dark:fill-slate-200">{book.title}</text>
            <text x="77" y="134" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">{book.author}</text>
            <rect x="30" y="142" width="95" height="16" rx="3" fill={book.statusColor} opacity="0.15" />
            <text x="77" y="154" textAnchor="middle" fontSize="10" fontWeight="600" fill={book.statusColor}>{book.status}</text>
            <rect x="20" y="168" width="115" height="22" rx="4" fill="#7c3aed" />
            <text x="77" y="183" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff">{book.status === 'Available' ? 'Borrow' : 'Details'}</text>
          </g>
        ))}

        {/* Footer hint */}
        <rect x="40" y="355" width="700" height="45" className="fill-gray-50 dark:fill-slate-900" />
        <text x="390" y="380" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">
          Your Level 4 project: build this app with HTML, CSS, JavaScript, and a real database
        </text>
        <text x="390" y="395" textAnchor="middle" fontSize="10" className="fill-gray-400 dark:fill-slate-500">
          Every feature above maps to a concept from Level 0-3
        </text>
      </svg>
    </div>
  );
}
