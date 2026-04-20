import { useState } from 'react';

// ── Blueprint vs Instances ────────────────────────────────────
// Shows a Python class (the blueprint) on the left and lets the
// user spawn instances on the right by clicking. Each instance
// gets its own data (name, weight) — demonstrating that a single
// class can produce many independent objects.

interface Elephant {
  id: number;
  name: string;
  weight: number;
}

const NAMES = ['Ranga', 'Tara', 'Bali', 'Kavita', 'Gajendra', 'Meena', 'Lakshmi', 'Arjun'];
let idCounter = 0;

function makeElephant(): Elephant {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const weight = 3500 + Math.floor(Math.random() * 2500);
  return { id: idCounter++, name, weight };
}

export default function ClassBlueprintDiagram() {
  const [instances, setInstances] = useState<Elephant[]>([]);

  const spawn = () => {
    setInstances(prev => [...prev, makeElephant()].slice(-8));
  };

  const reset = () => setInstances([]);

  return (
    <div className="bg-gradient-to-b from-amber-50 via-slate-50 to-emerald-50 dark:from-amber-950 dark:via-slate-950 dark:to-emerald-950 rounded-xl p-4 my-4 ring-1 ring-gray-200 dark:ring-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Blueprint vs Instances
        </p>
        <div className="flex gap-2">
          <button
            onClick={spawn}
            className="text-xs px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow transition"
          >
            + Create instance
          </button>
          {instances.length > 0 && (
            <button
              onClick={reset}
              className="text-xs px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Class definition (blueprint) */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-xs">
          <div className="text-gray-500 mb-2 text-[10px] uppercase tracking-wider">CLASS (blueprint)</div>
          <div className="text-blue-300">class <span className="text-yellow-300">Elephant</span>:</div>
          <div className="text-gray-400 ml-4">&quot;&quot;&quot;Shape of every elephant.&quot;&quot;&quot;</div>
          <div className="text-blue-300 ml-4 mt-2">def <span className="text-green-300">__init__</span>(self, name, weight):</div>
          <div className="text-white ml-8">self.name = name</div>
          <div className="text-white ml-8">self.weight = weight</div>
          <div className="text-blue-300 ml-4 mt-2">def <span className="text-green-300">describe</span>(self):</div>
          <div className="text-white ml-8">return f<span className="text-orange-300">&quot;{'{'}self.name{'}'} ({'{'}self.weight{'}'}kg)&quot;</span></div>
        </div>

        {/* Instance zoo (right side) */}
        <div className="bg-white/60 dark:bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            INSTANCES (live objects)
          </div>
          {instances.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
              Click &quot;Create instance&quot; — each call makes a new object
            </div>
          ) : (
            <div className="space-y-2">
              {instances.map(e => (
                <div key={e.id}
                  className="flex items-center gap-3 bg-amber-100 dark:bg-amber-900/40 rounded-md p-2 ring-1 ring-amber-300 dark:ring-amber-700">
                  <span className="text-2xl">🐘</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-bold text-amber-900 dark:text-amber-200">
                      Elephant({e.name}, {e.weight}kg)
                    </div>
                    <div className="font-mono text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      id: {0x7f0000 + e.id * 48}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            One class → as many instances as you want, each with its own data.
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-700 dark:text-gray-300 text-center">
        <span className="font-semibold">The class is the cookie cutter.</span> Each instance is a separate cookie with its own flavour.
      </div>
    </div>
  );
}
