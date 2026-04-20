import { useState } from 'react';

// ── REST in Action ───────────────────────────────────────────
// Click a method (GET/POST/PUT/DELETE). See a simulated request
// fly to the server, a response come back, and a table on the
// server update to reflect the change.

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Row { id: number; name: string; park: string; }

const INITIAL: Row[] = [
  { id: 1, name: 'Ranga', park: 'Kaziranga' },
  { id: 2, name: 'Tara', park: 'Manas' },
  { id: 3, name: 'Bali', park: 'Kaziranga' },
];

const METHOD_INFO: Record<Method, { color: string; desc: string; status: number; effect: string }> = {
  GET: { color: '#3b82f6', desc: 'Read data', status: 200, effect: 'Returns the current rows. No change.' },
  POST: { color: '#10b981', desc: 'Create new', status: 201, effect: 'Adds a new row with a new ID.' },
  PUT: { color: '#f59e0b', desc: 'Update existing', status: 200, effect: 'Replaces row #1 with new data.' },
  DELETE: { color: '#ef4444', desc: 'Remove', status: 204, effect: 'Removes row #1.' },
};

export default function RESTMethodsDiagram() {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const [method, setMethod] = useState<Method | null>(null);
  const [response, setResponse] = useState<string>('');

  const run = (m: Method) => {
    setMethod(m);
    const info = METHOD_INFO[m];

    setTimeout(() => {
      if (m === 'GET') {
        setResponse(JSON.stringify(rows, null, 2));
      } else if (m === 'POST') {
        const newRow = { id: rows.length + 1, name: 'Kavita', park: 'Nameri' };
        setRows(r => [...r, newRow]);
        setResponse(JSON.stringify(newRow, null, 2));
      } else if (m === 'PUT') {
        setRows(r => r.map(row => row.id === 1 ? { ...row, name: 'Ranga (renamed)', park: 'Manas' } : row));
        setResponse(JSON.stringify({ id: 1, name: 'Ranga (renamed)', park: 'Manas' }, null, 2));
      } else if (m === 'DELETE') {
        setRows(r => r.filter(row => row.id !== 1));
        setResponse('');
      }
    }, 600);
  };

  const reset = () => {
    setRows(INITIAL);
    setMethod(null);
    setResponse('');
  };

  return (
    <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 dark:from-sky-950 dark:via-slate-950 dark:to-amber-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
          REST in Action
        </p>
        <button
          onClick={reset}
          className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
        >
          Reset
        </button>
      </div>

      {/* Method buttons */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {(['GET', 'POST', 'PUT', 'DELETE'] as Method[]).map(m => (
          <button key={m}
            onClick={() => run(m)}
            className={`text-xs font-mono font-bold px-3 py-1.5 rounded transition ${
              method === m
                ? 'ring-2 text-white shadow-lg'
                : 'bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20'
            }`}
            style={method === m ? { background: METHOD_INFO[m].color } : undefined}>
            {m}
            {method === m && <span className="ml-2 text-[10px] opacity-90">→ /elephants</span>}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Request + Response */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-3 font-mono text-xs">
          <div className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">Request</div>
          {method ? (
            <div>
              <span style={{ color: METHOD_INFO[method].color }} className="font-bold">{method}</span>
              <span className="text-gray-300"> /elephants</span>
              {method === 'POST' && (
                <div className="text-gray-400 mt-1">
                  Body: <span className="text-amber-300">{'{"name":"Kavita","park":"Nameri"}'}</span>
                </div>
              )}
              {method === 'PUT' && (
                <div className="text-gray-400 mt-1">
                  Body: <span className="text-amber-300">{'{"name":"Ranga (renamed)","park":"Manas"}'}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">Click a method above...</div>
          )}

          <div className="text-gray-500 uppercase tracking-wider text-[10px] mt-3 mb-1">Response</div>
          {method ? (
            <div>
              <span className="text-emerald-400 font-bold">{METHOD_INFO[method].status}</span>
              <span className="text-gray-400 ml-2">{METHOD_INFO[method].desc}</span>
              {response && (
                <pre className="text-amber-200 mt-1 whitespace-pre-wrap text-[11px]">{response}</pre>
              )}
              {method === 'DELETE' && (
                <div className="text-gray-400 mt-1 italic text-[11px]">(No body — row removed)</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">—</div>
          )}
        </div>

        {/* Server state */}
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
          <div className="text-gray-600 dark:text-gray-400 uppercase tracking-wider text-[10px] mb-2 font-semibold">
            Server Database · elephants
          </div>
          <table className="w-full font-mono text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left p-1.5 text-slate-700 dark:text-slate-200">id</th>
                <th className="text-left p-1.5 text-slate-700 dark:text-slate-200">name</th>
                <th className="text-left p-1.5 text-slate-700 dark:text-slate-200">park</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="p-1.5 text-slate-700 dark:text-slate-300">{r.id}</td>
                  <td className="p-1.5 text-slate-800 dark:text-slate-100">{r.name}</td>
                  <td className="p-1.5 text-slate-700 dark:text-slate-300">{r.park}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={3} className="p-3 text-center text-gray-400 italic">empty</td></tr>
              )}
            </tbody>
          </table>
          {method && (
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-2 italic">
              {METHOD_INFO[method].effect}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
