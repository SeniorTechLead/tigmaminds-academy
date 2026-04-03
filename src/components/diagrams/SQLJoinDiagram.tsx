/**
 * Interactive SQL JOIN diagram.
 * Shows two mini-tables (elephants + sightings) and highlights
 * which rows appear in each join type using color and opacity.
 */
import { useState } from 'react';

type JoinType = 'inner' | 'left' | 'right' | 'full';

const elephants = [
  { id: 1, name: 'Ranga' },
  { id: 2, name: 'Mohini' },
  { id: 3, name: 'Gaja' },
  { id: 4, name: 'Tara' },    // no sightings
];

const sightings = [
  { id: 1, elephant_id: 1, location: 'Kaziranga East' },
  { id: 2, elephant_id: 1, location: 'Kaziranga Central' },
  { id: 3, elephant_id: 2, location: 'Manas NP' },
  { id: 4, elephant_id: 5, location: 'Unknown Zone' },  // orphan FK
];

const joinInfo: Record<JoinType, { label: string; desc: string; sql: string }> = {
  inner: {
    label: 'INNER JOIN',
    desc: 'Only matching rows from both tables',
    sql: 'SELECT e.name, s.location FROM elephants e INNER JOIN sightings s ON e.id = s.elephant_id',
  },
  left: {
    label: 'LEFT JOIN',
    desc: 'All elephants + matching sightings (NULL if none)',
    sql: 'SELECT e.name, s.location FROM elephants e LEFT JOIN sightings s ON e.id = s.elephant_id',
  },
  right: {
    label: 'RIGHT JOIN',
    desc: 'All sightings + matching elephants (NULL if none)',
    sql: 'SELECT e.name, s.location FROM elephants e RIGHT JOIN sightings s ON e.id = s.elephant_id',
  },
  full: {
    label: 'FULL OUTER JOIN',
    desc: 'All rows from both tables, NULLs where no match',
    sql: 'SELECT e.name, s.location FROM elephants e FULL OUTER JOIN sightings s ON e.id = s.elephant_id',
  },
};

function getResults(join: JoinType) {
  const rows: { name: string | null; location: string | null; fromLeft: boolean; fromRight: boolean }[] = [];

  if (join === 'inner') {
    for (const s of sightings) {
      const e = elephants.find(el => el.id === s.elephant_id);
      if (e) rows.push({ name: e.name, location: s.location, fromLeft: true, fromRight: true });
    }
  } else if (join === 'left') {
    for (const e of elephants) {
      const matches = sightings.filter(s => s.elephant_id === e.id);
      if (matches.length === 0) {
        rows.push({ name: e.name, location: null, fromLeft: true, fromRight: false });
      } else {
        for (const s of matches) {
          rows.push({ name: e.name, location: s.location, fromLeft: true, fromRight: true });
        }
      }
    }
  } else if (join === 'right') {
    for (const s of sightings) {
      const e = elephants.find(el => el.id === s.elephant_id);
      rows.push({
        name: e ? e.name : null,
        location: s.location,
        fromLeft: !!e,
        fromRight: true,
      });
    }
  } else {
    // full
    const matchedSightingIds = new Set<number>();
    for (const e of elephants) {
      const matches = sightings.filter(s => s.elephant_id === e.id);
      if (matches.length === 0) {
        rows.push({ name: e.name, location: null, fromLeft: true, fromRight: false });
      } else {
        for (const s of matches) {
          rows.push({ name: e.name, location: s.location, fromLeft: true, fromRight: true });
          matchedSightingIds.add(s.id);
        }
      }
    }
    for (const s of sightings) {
      if (!matchedSightingIds.has(s.id)) {
        rows.push({ name: null, location: s.location, fromLeft: false, fromRight: true });
      }
    }
  }
  return rows;
}

export default function SQLJoinDiagram() {
  const [join, setJoin] = useState<JoinType>('inner');
  const results = getResults(join);
  const info = joinInfo[join];

  const totalW = 520;
  const tableY = 72;
  const rowH = 22;
  const resultY = tableY + Math.max(elephants.length, sightings.length) * rowH + 60;
  const totalH = resultY + results.length * rowH + 50;

  // Which elephant ids are matched in current join?
  const matchedElephantIds = new Set(
    sightings.filter(s => elephants.some(e => e.id === s.elephant_id)).map(s => s.elephant_id)
  );
  const matchedSightingEIds = new Set(
    sightings.filter(s => elephants.some(e => e.id === s.elephant_id)).map(s => s.elephant_id)
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Join type selector */}
      <div className="flex justify-center gap-1 mb-3 flex-wrap">
        {(Object.keys(joinInfo) as JoinType[]).map(j => (
          <button
            key={j}
            onClick={() => setJoin(j)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              join === j
                ? 'bg-sky-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {joinInfo[j].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${totalW} ${totalH}`} className="w-full" role="img" aria-label={`SQL ${info.label} diagram`}>
        {/* Title */}
        <text x={totalW / 2} y="18" textAnchor="middle" className="fill-gray-800 dark:fill-gray-200" fontSize="13" fontWeight="700">
          {info.label}
        </text>
        <text x={totalW / 2} y="34" textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10">
          {info.desc}
        </text>
        <text x={totalW / 2} y="50" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontFamily="monospace">
          {info.sql.length > 75 ? info.sql.substring(0, 75) + '...' : info.sql}
        </text>

        {/* ── Left table: elephants ── */}
        <g transform={`translate(30, ${tableY})`}>
          {/* Header */}
          <rect x="0" y="0" width="130" height="24" rx="6"
            className="fill-sky-100 dark:fill-sky-900/40 stroke-sky-300 dark:stroke-sky-700" strokeWidth="1.5" />
          <text x="65" y="16" textAnchor="middle" className="fill-sky-800 dark:fill-sky-200" fontSize="10" fontWeight="700" fontFamily="monospace">
            elephants
          </text>
          {/* Rows */}
          {elephants.map((e, i) => {
            const y = 26 + i * rowH;
            const hasMatch = matchedElephantIds.has(e.id);
            const included = join === 'inner' ? hasMatch : (join === 'left' || join === 'full') ? true : hasMatch;
            return (
              <g key={e.id} opacity={included ? 1 : 0.3}>
                <rect x="0" y={y} width="130" height={rowH} rx="3"
                  className={included && hasMatch
                    ? 'fill-sky-50 dark:fill-sky-900/20 stroke-sky-200 dark:stroke-sky-800'
                    : included
                      ? 'fill-amber-50 dark:fill-amber-900/10 stroke-amber-200 dark:stroke-amber-800'
                      : 'fill-gray-50 dark:fill-gray-800/30 stroke-gray-200 dark:stroke-gray-700'}
                  strokeWidth="1" />
                <text x="25" y={y + 15} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="9" fontFamily="monospace" fontWeight="700">
                  {e.id}
                </text>
                <text x="80" y={y + 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
                  {e.name}
                </text>
                {!hasMatch && included && (
                  <text x="120" y={y + 15} textAnchor="middle" className="fill-amber-500" fontSize="7" fontWeight="600">
                    no match
                  </text>
                )}
              </g>
            );
          })}
          <text x="65" y={26 + elephants.length * rowH + 14} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
            id = PRIMARY KEY
          </text>
        </g>

        {/* ── Right table: sightings ── */}
        <g transform={`translate(280, ${tableY})`}>
          <rect x="0" y="0" width="200" height="24" rx="6"
            className="fill-emerald-100 dark:fill-emerald-900/40 stroke-emerald-300 dark:stroke-emerald-700" strokeWidth="1.5" />
          <text x="100" y="16" textAnchor="middle" className="fill-emerald-800 dark:fill-emerald-200" fontSize="10" fontWeight="700" fontFamily="monospace">
            sightings
          </text>
          {sightings.map((s, i) => {
            const y = 26 + i * rowH;
            const hasMatch = elephants.some(e => e.id === s.elephant_id);
            const included = join === 'inner' ? hasMatch : (join === 'right' || join === 'full') ? true : hasMatch;
            return (
              <g key={s.id} opacity={included ? 1 : 0.3}>
                <rect x="0" y={y} width="200" height={rowH} rx="3"
                  className={included && hasMatch
                    ? 'fill-emerald-50 dark:fill-emerald-900/20 stroke-emerald-200 dark:stroke-emerald-800'
                    : included
                      ? 'fill-amber-50 dark:fill-amber-900/10 stroke-amber-200 dark:stroke-amber-800'
                      : 'fill-gray-50 dark:fill-gray-800/30 stroke-gray-200 dark:stroke-gray-700'}
                  strokeWidth="1" />
                <text x="25" y={y + 15} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="9" fontFamily="monospace">
                  {s.elephant_id}
                </text>
                <text x="120" y={y + 15} textAnchor="middle" className="fill-gray-700 dark:fill-gray-300" fontSize="9" fontFamily="monospace">
                  {s.location}
                </text>
                {!hasMatch && included && (
                  <text x="185" y={y + 15} textAnchor="middle" className="fill-red-500" fontSize="7" fontWeight="600">
                    orphan
                  </text>
                )}
              </g>
            );
          })}
          <text x="100" y={26 + sightings.length * rowH + 14} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="8">
            elephant_id = FOREIGN KEY → elephants.id
          </text>
        </g>

        {/* ── Join connection lines ── */}
        {sightings.map((s, i) => {
          const e = elephants.find(el => el.id === s.elephant_id);
          if (!e) return null;
          const eIdx = elephants.indexOf(e);
          const leftY = tableY + 26 + eIdx * rowH + rowH / 2;
          const rightY = tableY + 26 + i * rowH + rowH / 2;
          return (
            <line key={s.id}
              x1={160} y1={leftY} x2={280} y2={rightY}
              className="stroke-amber-300 dark:stroke-amber-600" strokeWidth="1.5" strokeDasharray="4 2" opacity={0.6} />
          );
        })}

        {/* ── ON clause ── */}
        <text x={220} y={tableY + 26 + 2 * rowH + 4} textAnchor="middle"
          className="fill-amber-600 dark:fill-amber-400" fontSize="8" fontWeight="700" fontFamily="monospace">
          ON e.id = s.elephant_id
        </text>

        {/* ── Result table ── */}
        <g transform={`translate(80, ${resultY})`}>
          <text x="180" y="-8" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10" fontWeight="700">
            Result: {results.length} row{results.length !== 1 ? 's' : ''}
          </text>
          {/* Header */}
          <rect x="0" y="0" width="360" height="22" rx="5"
            className="fill-violet-100 dark:fill-violet-900/30 stroke-violet-300 dark:stroke-violet-700" strokeWidth="1.5" />
          <text x="90" y="15" textAnchor="middle" className="fill-violet-800 dark:fill-violet-200" fontSize="9" fontWeight="700" fontFamily="monospace">
            e.name
          </text>
          <text x="270" y="15" textAnchor="middle" className="fill-violet-800 dark:fill-violet-200" fontSize="9" fontWeight="700" fontFamily="monospace">
            s.location
          </text>
          <line x1="180" y1="0" x2="180" y2="22" className="stroke-violet-200 dark:stroke-violet-700" strokeWidth="0.5" />

          {/* Result rows */}
          {results.map((r, i) => {
            const y = 24 + i * rowH;
            return (
              <g key={i}>
                <rect x="0" y={y} width="360" height={rowH} rx="3"
                  className={i % 2 === 0 ? 'fill-white dark:fill-gray-900' : 'fill-gray-50 dark:fill-gray-800/30'} />
                <text x="90" y={y + 15} textAnchor="middle"
                  className={r.name ? 'fill-gray-700 dark:fill-gray-300' : 'fill-red-400 dark:fill-red-500'}
                  fontSize="9" fontFamily="monospace" fontWeight={r.name ? '500' : '700'}>
                  {r.name ?? 'NULL'}
                </text>
                <text x="270" y={y + 15} textAnchor="middle"
                  className={r.location ? 'fill-gray-700 dark:fill-gray-300' : 'fill-red-400 dark:fill-red-500'}
                  fontSize="9" fontFamily="monospace" fontWeight={r.location ? '500' : '700'}>
                  {r.location ?? 'NULL'}
                </text>
                <line x1="180" y1={y} x2="180" y2={y + rowH} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
              </g>
            );
          })}
        </g>

        {/* Footnote */}
        <text x={totalW / 2} y={totalH - 8} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9">
          {join === 'inner' && 'INNER JOIN drops unmatched rows from both sides.'}
          {join === 'left' && 'LEFT JOIN keeps all left rows — NULL fills in missing right data.'}
          {join === 'right' && 'RIGHT JOIN keeps all right rows — NULL fills in missing left data.'}
          {join === 'full' && 'FULL JOIN keeps everything — NULLs on both sides where no match.'}
        </text>
      </svg>
    </div>
  );
}
