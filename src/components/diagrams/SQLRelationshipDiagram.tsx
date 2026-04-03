/**
 * Database relationships diagram: one-to-many and many-to-many.
 * Shows elephants → sightings (1:N) and elephants ↔ parks via park_elephants (M:N).
 */
import { useState } from 'react';

type Tab = 'one-to-many' | 'many-to-many';

export default function SQLRelationshipDiagram() {
  const [tab, setTab] = useState<Tab>('one-to-many');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setTab('one-to-many')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'one-to-many' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          One-to-Many
        </button>
        <button
          onClick={() => setTab('many-to-many')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'many-to-many' ? 'bg-violet-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Many-to-Many
        </button>
      </div>

      {tab === 'one-to-many' ? <OneToMany /> : <ManyToMany />}
    </div>
  );
}

function OneToMany() {
  const totalW = 500;
  const totalH = 260;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="One-to-many relationship: one elephant has many sightings">
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        One-to-Many (1:N)
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        One elephant can have many sightings
      </text>

      {/* ── Elephant entity ── */}
      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="140" height="130" rx="10"
          className="fill-sky-50 dark:fill-sky-900/15 stroke-sky-400 dark:stroke-sky-600" strokeWidth="2" />
        <rect x="0" y="0" width="140" height="30" rx="10"
          className="fill-sky-200 dark:fill-sky-800/50 stroke-sky-400 dark:stroke-sky-600" strokeWidth="2" />
        <rect x="0" y="10" width="140" height="20" className="fill-sky-200 dark:fill-sky-800/50" />
        <text x="70" y="20" textAnchor="middle" className="fill-sky-800 dark:fill-sky-200" fontSize="11" fontWeight="800" fontFamily="monospace">
          elephants
        </text>
        {/* Fields */}
        {[
          { name: 'id', note: 'PK', pk: true },
          { name: 'name', note: 'TEXT', pk: false },
          { name: 'weight', note: 'REAL', pk: false },
          { name: 'species', note: 'TEXT', pk: false },
        ].map((f, i) => (
          <g key={i}>
            <text x="12" y={50 + i * 20} className={f.pk ? 'fill-amber-600 dark:fill-amber-400' : 'fill-gray-700 dark:fill-gray-300'}
              fontSize="10" fontFamily="monospace" fontWeight={f.pk ? '700' : '500'}>
              {f.pk ? '🔑 ' : '   '}{f.name}
            </text>
            <text x="128" y={50 + i * 20} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
              {f.note}
            </text>
          </g>
        ))}
      </g>

      {/* ── Sightings entity ── */}
      <g transform="translate(300, 60)">
        <rect x="0" y="0" width="160" height="150" rx="10"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="2" />
        <rect x="0" y="0" width="160" height="30" rx="10"
          className="fill-emerald-200 dark:fill-emerald-800/50 stroke-emerald-400 dark:stroke-emerald-600" strokeWidth="2" />
        <rect x="0" y="10" width="160" height="20" className="fill-emerald-200 dark:fill-emerald-800/50" />
        <text x="80" y="20" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="11" fontWeight="800" fontFamily="monospace">
          sightings
        </text>
        {[
          { name: 'id', note: 'PK', pk: true },
          { name: 'elephant_id', note: 'FK', fk: true },
          { name: 'date', note: 'DATE', pk: false },
          { name: 'location', note: 'TEXT', pk: false },
          { name: 'group_size', note: 'INT', pk: false },
        ].map((f, i) => (
          <g key={i}>
            <text x="12" y={50 + i * 20}
              className={f.pk ? 'fill-amber-600 dark:fill-amber-400' : (f as any).fk ? 'fill-violet-600 dark:fill-violet-400' : 'fill-gray-700 dark:fill-gray-300'}
              fontSize="10" fontFamily="monospace" fontWeight={f.pk || (f as any).fk ? '700' : '500'}>
              {f.pk ? '🔑 ' : (f as any).fk ? '🔗 ' : '   '}{f.name}
            </text>
            <text x="148" y={50 + i * 20} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
              {f.note}
            </text>
          </g>
        ))}
      </g>

      {/* ── Relationship line ── */}
      <line x1="180" y1="110" x2="300" y2="110"
        className="stroke-amber-400 dark:stroke-amber-500" strokeWidth="2" />
      {/* 1 side */}
      <text x="188" y="104" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="800">1</text>
      {/* N side (crow's foot) */}
      <line x1="294" y1="104" x2="300" y2="110" className="stroke-amber-400" strokeWidth="2" />
      <line x1="294" y1="116" x2="300" y2="110" className="stroke-amber-400" strokeWidth="2" />
      <text x="282" y="104" className="fill-amber-700 dark:fill-amber-300" fontSize="12" fontWeight="800">N</text>

      {/* Label */}
      <text x="240" y="130" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontWeight="600" fontFamily="monospace">
        elephant_id → elephants.id
      </text>

      {/* Explanation */}
      <text x={totalW / 2} y="228" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">
        One elephant (Ranga) can appear in many sighting records.
      </text>
      <text x={totalW / 2} y="248" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
        The foreign key (elephant_id) in sightings points back to elephants.id
      </text>
    </svg>
  );
}

function ManyToMany() {
  const totalW = 520;
  const totalH = 280;

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label="Many-to-many relationship: elephants and parks via junction table">
      <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
        Many-to-Many (M:N)
      </text>
      <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
        An elephant visits many parks. A park has many elephants.
      </text>

      {/* ── Elephants ── */}
      <g transform="translate(20, 60)">
        <rect x="0" y="0" width="120" height="90" rx="8"
          className="fill-sky-50 dark:fill-sky-900/15 stroke-sky-400" strokeWidth="2" />
        <rect x="0" y="0" width="120" height="26" rx="8" className="fill-sky-200 dark:fill-sky-800/50 stroke-sky-400" strokeWidth="2" />
        <rect x="0" y="8" width="120" height="18" className="fill-sky-200 dark:fill-sky-800/50" />
        <text x="60" y="18" textAnchor="middle" className="fill-sky-800 dark:fill-sky-200" fontSize="10" fontWeight="800" fontFamily="monospace">
          elephants
        </text>
        <text x="10" y="44" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontFamily="monospace" fontWeight="700">🔑 id</text>
        <text x="10" y="60" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">   name</text>
        <text x="10" y="76" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">   weight</text>
      </g>

      {/* ── Junction table ── */}
      <g transform="translate(185, 60)">
        <rect x="0" y="0" width="150" height="90" rx="8"
          className="fill-violet-50 dark:fill-violet-900/15 stroke-violet-400" strokeWidth="2" />
        <rect x="0" y="0" width="150" height="26" rx="8" className="fill-violet-200 dark:fill-violet-800/50 stroke-violet-400" strokeWidth="2" />
        <rect x="0" y="8" width="150" height="18" className="fill-violet-200 dark:fill-violet-800/50" />
        <text x="75" y="18" textAnchor="middle" className="fill-violet-800 dark:fill-violet-200" fontSize="10" fontWeight="800" fontFamily="monospace">
          park_elephants
        </text>
        <text x="10" y="44" className="fill-violet-600 dark:fill-violet-400" fontSize="9" fontFamily="monospace" fontWeight="700">🔗 elephant_id</text>
        <text x="10" y="60" className="fill-violet-600 dark:fill-violet-400" fontSize="9" fontFamily="monospace" fontWeight="700">🔗 park_id</text>
        <text x="10" y="76" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">   first_seen</text>
      </g>

      {/* ── Parks ── */}
      <g transform="translate(380, 60)">
        <rect x="0" y="0" width="120" height="90" rx="8"
          className="fill-emerald-50 dark:fill-emerald-900/15 stroke-emerald-400" strokeWidth="2" />
        <rect x="0" y="0" width="120" height="26" rx="8" className="fill-emerald-200 dark:fill-emerald-800/50 stroke-emerald-400" strokeWidth="2" />
        <rect x="0" y="8" width="120" height="18" className="fill-emerald-200 dark:fill-emerald-800/50" />
        <text x="60" y="18" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="10" fontWeight="800" fontFamily="monospace">
          parks
        </text>
        <text x="10" y="44" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontFamily="monospace" fontWeight="700">🔑 id</text>
        <text x="10" y="60" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">   name</text>
        <text x="10" y="76" className="fill-gray-600 dark:fill-gray-300" fontSize="9" fontFamily="monospace">   state</text>
      </g>

      {/* ── Relationship lines ── */}
      {/* elephants → junction */}
      <line x1="140" y1="100" x2="185" y2="100" className="stroke-amber-400" strokeWidth="2" />
      <text x="146" y="94" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="800">1</text>
      <text x="176" y="94" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="800">N</text>

      {/* junction → parks */}
      <line x1="335" y1="100" x2="380" y2="100" className="stroke-amber-400" strokeWidth="2" />
      <text x="340" y="94" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="800">N</text>
      <text x="374" y="94" className="fill-amber-700 dark:fill-amber-300" fontSize="10" fontWeight="800">1</text>

      {/* Example data */}
      <g transform="translate(20, 175)">
        <text x={totalW / 2 - 20} y="0" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="700">
          Example: How it works
        </text>

        {/* Mini data */}
        {[
          { text: 'Ranga visited Kaziranga AND Manas', y: 20 },
          { text: 'Kaziranga has Ranga AND Gaja AND Tara', y: 36 },
          { text: 'The junction table stores each pairing as a row', y: 52 },
        ].map(({ text, y }) => (
          <text key={y} x={totalW / 2 - 20} y={y} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9">
            {text}
          </text>
        ))}

        {/* Mini junction table */}
        <g transform="translate(120, 62)">
          <rect x="0" y="0" width="240" height="18" rx="4" className="fill-violet-100 dark:fill-violet-900/30 stroke-violet-300" strokeWidth="1" />
          <text x="60" y="13" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="8" fontFamily="monospace" fontWeight="700">elephant_id</text>
          <text x="180" y="13" textAnchor="middle" className="fill-violet-700 dark:fill-violet-300" fontSize="8" fontFamily="monospace" fontWeight="700">park_id</text>
          {[
            ['1 (Ranga)', '1 (Kaziranga)'],
            ['1 (Ranga)', '2 (Manas)'],
            ['3 (Gaja)', '1 (Kaziranga)'],
          ].map(([eid, pid], i) => (
            <g key={i}>
              <rect x="0" y={20 + i * 16} width="240" height="16" className={i % 2 === 0 ? 'fill-white dark:fill-gray-900' : 'fill-gray-50 dark:fill-gray-800/30'} />
              <text x="60" y={32 + i * 16} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontFamily="monospace">{eid}</text>
              <text x="180" y={32 + i * 16} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="8" fontFamily="monospace">{pid}</text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
