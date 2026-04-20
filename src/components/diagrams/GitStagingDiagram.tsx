import { useState } from 'react';

// ── Three Zones ───────────────────────────────────────────────
// Working → Staged → Committed. Interactive: click buttons to
// move files between zones. Shows what git add and git commit
// actually do.

interface FileItem {
  name: string;
  zone: 'working' | 'staged' | 'committed';
  modified: boolean;
}

const INITIAL: FileItem[] = [
  { name: 'index.html', zone: 'committed', modified: false },
  { name: 'style.css', zone: 'committed', modified: false },
  { name: 'main.js', zone: 'committed', modified: false },
];

export default function GitStagingDiagram() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL);
  const [commits, setCommits] = useState<{ message: string; files: string[] }[]>([]);
  const [message, setMessage] = useState('Fix header spacing');

  const editFile = (name: string) => {
    setFiles(f => f.map(x => x.name === name ? { ...x, modified: true, zone: 'working' as const } : x));
  };
  const stageFile = (name: string) => {
    setFiles(f => f.map(x => x.name === name ? { ...x, zone: 'staged' as const } : x));
  };
  const unstageFile = (name: string) => {
    setFiles(f => f.map(x => x.name === name ? { ...x, zone: 'working' as const } : x));
  };
  const commit = () => {
    const staged = files.filter(f => f.zone === 'staged');
    if (staged.length === 0) return;
    setCommits(c => [{ message, files: staged.map(s => s.name) }, ...c].slice(0, 3));
    setFiles(f => f.map(x =>
      x.zone === 'staged' ? { ...x, zone: 'committed' as const, modified: false } : x
    ));
  };
  const reset = () => {
    setFiles(INITIAL);
    setCommits([]);
  };

  const working = files.filter(f => f.zone === 'working');
  const staged = files.filter(f => f.zone === 'staged');

  return (
    <div className="bg-gradient-to-b from-slate-50 via-emerald-50 to-blue-50 dark:from-slate-950 dark:via-emerald-950 dark:to-blue-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
          Three Zones · Working → Staged → Committed
        </p>
        <button
          onClick={reset}
          className="text-xs px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
        >
          Reset
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        {/* Working */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border-2 border-amber-300 dark:border-amber-800">
          <div className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-300 font-bold mb-2">
            1. Working Directory
          </div>
          <div className="space-y-1.5 mb-3">
            {files.map(f => (
              <div key={f.name} className="flex items-center justify-between text-xs font-mono">
                <span className={f.modified ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-gray-500 dark:text-gray-400'}>
                  {f.modified ? 'M' : ' '} {f.name}
                </span>
                {!f.modified && f.zone === 'committed' && (
                  <button
                    onClick={() => editFile(f.name)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 transition">
                    edit
                  </button>
                )}
              </div>
            ))}
          </div>
          {working.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold">
                git add →
              </p>
              {working.map(f => (
                <button key={f.name}
                  onClick={() => stageFile(f.name)}
                  className="text-[10px] px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white transition text-left">
                  git add {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Staged */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border-2 border-emerald-400 dark:border-emerald-700">
          <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold mb-2">
            2. Staging Area
          </div>
          {staged.length === 0 ? (
            <div className="text-xs text-gray-400 italic py-4 text-center">Nothing staged</div>
          ) : (
            <div className="space-y-1.5">
              {staged.map(f => (
                <div key={f.name} className="flex items-center justify-between text-xs font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                  <span className="text-emerald-800 dark:text-emerald-200 font-bold">A {f.name}</span>
                  <button
                    onClick={() => unstageFile(f.name)}
                    className="text-[10px] text-gray-600 dark:text-gray-400 hover:text-red-600">
                    unstage
                  </button>
                </div>
              ))}
            </div>
          )}

          {staged.length > 0 && (
            <div className="mt-3 space-y-2">
              <input type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Commit message"
                className="w-full text-xs px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" />
              <button
                onClick={commit}
                className="w-full text-xs px-2 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition">
                git commit -m &quot;{message.slice(0, 20)}{message.length > 20 ? '...' : ''}&quot;
              </button>
            </div>
          )}
        </div>

        {/* Repository */}
        <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3 border-2 border-blue-400 dark:border-blue-700">
          <div className="text-[10px] uppercase tracking-wider text-blue-700 dark:text-blue-300 font-bold mb-2">
            3. Repository · commits
          </div>
          {commits.length === 0 ? (
            <div className="text-xs text-gray-400 italic py-4 text-center">
              No new commits yet
            </div>
          ) : (
            <div className="space-y-1.5">
              {commits.map((c, i) => (
                <div key={i} className="bg-blue-50 dark:bg-blue-900/30 rounded p-2 text-xs">
                  <div className="font-mono font-bold text-blue-800 dark:text-blue-200">
                    {c.message}
                  </div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400 font-mono mt-1">
                    {c.files.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
        The staging area lets you <strong>pick which changes</strong> go into each commit — crucial for clean, atomic history.
      </p>
    </div>
  );
}
