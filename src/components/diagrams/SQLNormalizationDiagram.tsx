/**
 * Normalization diagram: side-by-side showing a messy denormalized table
 * vs the clean normalized tables with arrows showing how they connect.
 * Interactive toggle between the two views.
 */
import { useState } from 'react';

type View = 'messy' | 'clean';

const messyRows = [
  ['1', 'Ranga', '4500', 'Kaziranga NP', 'Assam', '2026-01-15', 'East'],
  ['2', 'Ranga', '4500', 'Kaziranga NP', 'Assam', '2026-02-20', 'Central'],
  ['3', 'Ranga', '4500', 'Manas NP', 'Assam', '2026-03-10', 'West'],
  ['4', 'Mohini', '3800', 'Manas NP', 'Assam', '2026-01-22', 'South'],
];

export default function SQLNormalizationDiagram() {
  const [view, setView] = useState<View>('messy');

  return (
    <div className="my-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-bold text-gray-900 dark:text-white">Normalization: one big table → separate linked tables</p>
      </div>

      <div className="p-5">
        {/* Toggle */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setView('messy')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              view === 'messy' ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            Before (one big table)
          </button>
          <button
            onClick={() => setView('clean')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              view === 'clean' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            After (normalized)
          </button>
        </div>

        {view === 'messy' ? <MessyView /> : <CleanView />}
      </div>
    </div>
  );
}

function MessyView() {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border-2 border-red-300 dark:border-red-700 mb-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-red-50 dark:bg-red-900/20">
              {['id', 'elephant_name', 'weight', 'park_name', 'park_state', 'date', 'location'].map(col => (
                <th key={col} className="px-2 py-1.5 text-left font-semibold text-red-800 dark:text-red-300 text-[10px] font-mono whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {messyRows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                {row.map((cell, j) => {
                  // Highlight duplicated values
                  const isDup = (j === 1 && cell === 'Ranga' && i > 0) ||
                                (j === 2 && cell === '4500' && i > 0 && i < 3) ||
                                (j === 3 && cell === 'Kaziranga NP' && i === 1) ||
                                (j === 4 && i > 0);
                  return (
                    <td key={j} className={`px-2 py-1 font-mono text-[10px] whitespace-nowrap ${isDup ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10' : 'text-gray-700 dark:text-gray-300'}`}>
                      {cell}{isDup && ' ⚠'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-red-700 dark:text-red-300 font-semibold flex items-start gap-1.5">
          <span className="mt-0.5">⚠</span>
          <span>"Ranga" and "4500" are stored 3 times. "Kaziranga NP, Assam" is stored twice. If Ranga's weight changes, you must update every row.</span>
        </p>
        <p className="text-xs text-red-700 dark:text-red-300 font-semibold flex items-start gap-1.5">
          <span className="mt-0.5">⚠</span>
          <span>Delete all Manas sightings → you lose the fact that Manas exists. A new park with zero sightings can't be added at all.</span>
        </p>
      </div>
    </div>
  );
}

function CleanView() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Elephants table */}
        <div className="overflow-x-auto rounded-lg border-2 border-sky-300 dark:border-sky-700">
          <div className="bg-sky-100 dark:bg-sky-900/30 px-2 py-1">
            <p className="text-[10px] font-bold text-sky-800 dark:text-sky-300 font-mono">elephants</p>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-sky-50 dark:bg-sky-900/10">
                <th className="px-2 py-1 text-left font-mono text-sky-700 dark:text-sky-400">id</th>
                <th className="px-2 py-1 text-left font-mono text-sky-700 dark:text-sky-400">name</th>
                <th className="px-2 py-1 text-left font-mono text-sky-700 dark:text-sky-400">weight</th>
              </tr>
            </thead>
            <tbody>
              {[['1', 'Ranga', '4500'], ['2', 'Mohini', '3800']].map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  {row.map((c, j) => <td key={j} className="px-2 py-1 font-mono text-gray-700 dark:text-gray-300">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-2 py-1 text-[9px] text-sky-600 dark:text-sky-400 font-semibold">Each elephant stored ONCE</p>
        </div>

        {/* Parks table */}
        <div className="overflow-x-auto rounded-lg border-2 border-emerald-300 dark:border-emerald-700">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1">
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 font-mono">parks</p>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-emerald-50 dark:bg-emerald-900/10">
                <th className="px-2 py-1 text-left font-mono text-emerald-700 dark:text-emerald-400">id</th>
                <th className="px-2 py-1 text-left font-mono text-emerald-700 dark:text-emerald-400">name</th>
                <th className="px-2 py-1 text-left font-mono text-emerald-700 dark:text-emerald-400">state</th>
              </tr>
            </thead>
            <tbody>
              {[['1', 'Kaziranga NP', 'Assam'], ['2', 'Manas NP', 'Assam']].map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  {row.map((c, j) => <td key={j} className="px-2 py-1 font-mono text-gray-700 dark:text-gray-300">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-2 py-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">Each park stored ONCE</p>
        </div>

        {/* Sightings table */}
        <div className="overflow-x-auto rounded-lg border-2 border-amber-300 dark:border-amber-700">
          <div className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1">
            <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300 font-mono">sightings</p>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-amber-50 dark:bg-amber-900/10">
                <th className="px-2 py-1 text-left font-mono text-amber-700 dark:text-amber-400">id</th>
                <th className="px-2 py-1 text-left font-mono text-amber-700 dark:text-amber-400">e_id</th>
                <th className="px-2 py-1 text-left font-mono text-amber-700 dark:text-amber-400">p_id</th>
                <th className="px-2 py-1 text-left font-mono text-amber-700 dark:text-amber-400">date</th>
              </tr>
            </thead>
            <tbody>
              {[['1', '1', '1', '01-15'], ['2', '1', '1', '02-20'], ['3', '1', '2', '03-10'], ['4', '2', '2', '01-22']].map((row, i) => (
                <tr key={i} className={i % 2 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  {row.map((c, j) => <td key={j} className="px-2 py-1 font-mono text-gray-700 dark:text-gray-300">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-2 py-1 text-[9px] text-amber-600 dark:text-amber-400 font-semibold">Only IDs — no duplication</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-start gap-1.5">
          <span className="mt-0.5">✅</span>
          <span>Update Ranga's weight in ONE row → every query that JOINs elephants sees it instantly.</span>
        </p>
        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-start gap-1.5">
          <span className="mt-0.5">✅</span>
          <span>Delete all Manas sightings → Manas still exists in the parks table. Add a new park with zero sightings — no problem.</span>
        </p>
      </div>
    </div>
  );
}
