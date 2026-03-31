export default function LibraryHTMLStructureDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="HTML document structure showing nested tags like a tree">
        <rect width="780" height="520" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#8b5cf6">How a Web Page Is Built: HTML Tags</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Every page is a set of boxes nested inside boxes</text>

        {/* html tag - outermost */}
        <rect x="40" y="75" width="700" height="420" rx="10" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="6,3" />
        <rect x="50" y="68" width="110" height="22" rx="4" fill="#8b5cf6" />
        <text x="105" y="83" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">{'<html>'}</text>

        {/* head tag */}
        <rect x="70" y="100" width="640" height="60" rx="8" fill="#ddd6fe" opacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
        <rect x="80" y="93" width="100" height="20" rx="4" fill="#a78bfa" />
        <text x="130" y="107" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{'<head>'}</text>
        <text x="390" y="128" textAnchor="middle" fontSize="13" className="fill-gray-600 dark:fill-slate-300">Title: "Bhalukpara Library"</text>
        <text x="390" y="146" textAnchor="middle" fontSize="11" className="fill-gray-400 dark:fill-slate-500">Invisible to visitors — tells the browser the page name</text>

        {/* body tag */}
        <rect x="70" y="172" width="640" height="310" rx="8" fill="#ede9fe" opacity="0.12" stroke="#a78bfa" strokeWidth="1.5" />
        <rect x="80" y="165" width="100" height="20" rx="4" fill="#a78bfa" />
        <text x="130" y="179" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{'<body>'}</text>

        {/* h1 */}
        <rect x="100" y="195" width="580" height="40" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#c4b5fd" strokeWidth="1" />
        <text x="120" y="212" fontSize="11" fontWeight="700" fill="#7c3aed">{'<h1>'}</text>
        <text x="390" y="222" textAnchor="middle" fontSize="16" fontWeight="700" className="fill-gray-800 dark:fill-slate-200">Welcome to Bhalukpara Library</text>

        {/* p */}
        <rect x="100" y="245" width="580" height="36" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#c4b5fd" strokeWidth="1" />
        <text x="120" y="262" fontSize="11" fontWeight="700" fill="#7c3aed">{'<p>'}</text>
        <text x="390" y="270" textAnchor="middle" fontSize="12" className="fill-gray-600 dark:fill-slate-300">Take a book, bring it back, tell a friend.</text>

        {/* div with book cards */}
        <rect x="100" y="292" width="580" height="120" rx="6" fill="none" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4,2" />
        <text x="120" y="306" fontSize="11" fontWeight="700" fill="#7c3aed">{'<div> — book cards'}</text>

        {/* Three book cards */}
        {[0, 1, 2].map(i => (
          <g key={i} transform={`translate(${140 + i * 185}, 315)`}>
            <rect width="160" height="85" rx="6" className="fill-gray-50 dark:fill-slate-800" stroke="#e0e7ff" strokeWidth="1" />
            <rect y="0" width="160" height="22" rx="6" fill="#7c3aed" opacity="0.15" />
            <text x="80" y="16" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7c3aed">
              {['Folktales of Assam', 'Science Class 8', 'Harry Potter'][i]}
            </text>
            <text x="80" y="42" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">
              {['Genre: Folklore', 'Genre: Textbook', 'Genre: Fiction'][i]}
            </text>
            <rect x="30" y="55" width="100" height="20" rx="4" fill={['#10b981', '#f59e0b', '#ef4444'][i]} opacity="0.2" />
            <text x="80" y="69" textAnchor="middle" fontSize="10" fontWeight="600" fill={['#10b981', '#f59e0b', '#ef4444'][i]}>
              {['Available', 'Borrowed', 'Overdue'][i]}
            </text>
          </g>
        ))}

        {/* button */}
        <rect x="100" y="422" width="580" height="38" rx="6" className="fill-gray-100 dark:fill-slate-800" stroke="#c4b5fd" strokeWidth="1" />
        <text x="120" y="440" fontSize="11" fontWeight="700" fill="#7c3aed">{'<button>'}</text>
        <rect x="310" y="428" width="160" height="26" rx="13" fill="#8b5cf6" />
        <text x="390" y="446" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">Search Books</text>

        {/* Key insight */}
        <rect x="100" y="472" width="580" height="36" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="493" textAnchor="middle" fontSize="12" fontWeight="600" fill="#8b5cf6">
          HTML = structure. CSS = style. JavaScript = behavior. Every website uses all three.
        </text>
      </svg>
    </div>
  );
}
