export default function LibraryAPIDiagram() {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <svg viewBox="0 0 780 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" role="img" aria-label="API as a waiter: browser sends request, API fetches from database, returns response">
        <rect width="780" height="480" rx="10" className="fill-white dark:fill-slate-950" />
        <text x="390" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f59e0b">APIs: The Waiter Between You and the Kitchen</text>
        <text x="390" y="56" textAnchor="middle" fontSize="12" className="fill-gray-500 dark:fill-slate-400">Your browser never talks to the database directly — the API carries messages</text>

        {/* Browser (customer) */}
        <g transform="translate(60, 100)">
          <rect width="180" height="200" rx="10" className="fill-gray-100 dark:fill-slate-800" stroke="#64748b" strokeWidth="2" />
          <rect width="180" height="30" rx="10" fill="#64748b" />
          <text x="90" y="21" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Your Browser</text>
          <text x="90" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Your Browser</text>
          {/* Person icon */}
          <circle cx="90" cy="75" r="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
          <text x="90" y="80" textAnchor="middle" fontSize="20">🧑</text>
          <text x="90" y="115" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-gray-600 dark:fill-slate-300">"The Customer"</text>
          <text x="90" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Asks for what you want</text>

          {/* Speech bubble */}
          <rect x="15" y="150" width="150" height="35" rx="6" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" />
          <text x="90" y="172" textAnchor="middle" fontSize="10" fontWeight="600" fill="#7c3aed">"Show me all folklore books"</text>
        </g>

        {/* API (waiter) */}
        <g transform="translate(300, 100)">
          <rect width="180" height="200" rx="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" className="dark:fill-amber-950/30" />
          <rect width="180" height="30" rx="10" fill="#f59e0b" />
          <text x="90" y="21" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">API Server</text>
          {/* Waiter icon */}
          <circle cx="90" cy="75" r="18" fill="#fef9c3" stroke="#eab308" strokeWidth="1.5" />
          <text x="90" y="80" textAnchor="middle" fontSize="20">🤵</text>
          <text x="90" y="115" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400e">"The Waiter"</text>
          <text x="90" y="135" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Takes your order to the kitchen</text>
          <text x="90" y="150" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">and brings back the dish</text>

          {/* Translates */}
          <rect x="15" y="165" width="150" height="25" rx="4" fill="#fbbf24" opacity="0.2" />
          <text x="90" y="182" textAnchor="middle" fontSize="10" fontWeight="600" fill="#b45309">GET /api/books?genre=folklore</text>
        </g>

        {/* Database (kitchen) */}
        <g transform="translate(540, 100)">
          <rect width="180" height="200" rx="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" className="dark:fill-emerald-950/30" />
          <rect width="180" height="30" rx="10" fill="#10b981" />
          <text x="90" y="21" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Database</text>
          {/* DB icon */}
          <ellipse cx="90" cy="65" rx="30" ry="12" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.5" />
          <rect x="60" y="65" width="60" height="30" fill="#a7f3d0" stroke="none" />
          <ellipse cx="90" cy="95" rx="30" ry="12" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.5" />
          <line x1="60" y1="65" x2="60" y2="95" stroke="#10b981" strokeWidth="1.5" />
          <line x1="120" y1="65" x2="120" y2="95" stroke="#10b981" strokeWidth="1.5" />
          <text x="90" y="125" textAnchor="middle" fontSize="11" fontWeight="600" fill="#065f46">"The Kitchen"</text>
          <text x="90" y="145" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">Stores all the data</text>
          <text x="90" y="160" textAnchor="middle" fontSize="10" className="fill-gray-500 dark:fill-slate-400">and prepares responses</text>

          <rect x="15" y="170" width="150" height="25" rx="4" fill="#10b981" opacity="0.15" />
          <text x="90" y="187" textAnchor="middle" fontSize="10" fontWeight="600" fill="#059669">SELECT * WHERE genre=folklore</text>
        </g>

        {/* Arrows — request */}
        <line x1="240" y1="170" x2="298" y2="170" stroke="#8b5cf6" strokeWidth="2.5" markerEnd="url(#arrowReq)" />
        <text x="269" y="158" textAnchor="middle" fontSize="10" fontWeight="600" fill="#8b5cf6">Request</text>

        <line x1="480" y1="170" x2="538" y2="170" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowApi)" />
        <text x="509" y="158" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Query</text>

        {/* Arrows — response */}
        <line x1="538" y1="240" x2="480" y2="240" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowRes)" />
        <text x="509" y="260" textAnchor="middle" fontSize="10" fontWeight="600" fill="#10b981">Data</text>

        <line x1="298" y1="240" x2="240" y2="240" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrowBack)" />
        <text x="269" y="260" textAnchor="middle" fontSize="10" fontWeight="600" fill="#f59e0b">Response</text>

        <defs>
          <marker id="arrowReq" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#8b5cf6" /></marker>
          <marker id="arrowApi" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f59e0b" /></marker>
          <marker id="arrowRes" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill="#10b981" /></marker>
          <marker id="arrowBack" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill="#f59e0b" /></marker>
        </defs>

        {/* Bottom: the flow summary */}
        <rect x="60" y="340" width="660" height="56" rx="8" className="fill-gray-100 dark:fill-slate-800" />
        <text x="390" y="362" textAnchor="middle" fontSize="13" fontWeight="600" className="fill-gray-700 dark:fill-slate-200">
          The full cycle: You click → Browser sends request → API queries database → Database returns data → API sends response → Page updates
        </text>
        <text x="390" y="384" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          This happens in less than a second — but there are always three players
        </text>

        {/* Why a waiter? */}
        <rect x="60" y="410" width="660" height="50" rx="8" fill="#fef3c7" opacity="0.3" stroke="#f59e0b" strokeWidth="1" className="dark:fill-amber-950/20" />
        <text x="390" y="432" textAnchor="middle" fontSize="12" fontWeight="600" fill="#f59e0b">
          Why not let the browser talk directly to the database?
        </text>
        <text x="390" y="450" textAnchor="middle" fontSize="11" className="fill-gray-500 dark:fill-slate-400">
          Security! The API controls who can read or change data — like a waiter who checks if the kitchen is actually open.
        </text>
      </svg>
    </div>
  );
}
