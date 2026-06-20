/**
 * print() sends text to the screen. Shows a call with a quoted string flowing
 * to console output, contrasting strings (quoted) vs numbers (unquoted).
 *
 * Used in the "Hello World and print()" section.
 */
export default function PyPrintDiagram() {
  const W = 700, H = 250;
  return (
    <div className="my-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto" role="img" aria-label="The print function sends text to the screen. Strings go inside quotes; numbers do not. The call print quote Hello quote outputs Hello to the console.">
        <rect x="0" y="0" width={W} height={H} fill="#f8fafc" className="dark:fill-gray-900" />
        <text x="30" y="34" fontSize="14" fontWeight="700" fill="#0f172a" className="dark:fill-gray-100">print() puts text on the screen</text>

        {/* code */}
        <rect x="40" y="70" width="290" height="110" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" className="dark:fill-gray-950 dark:stroke-gray-700" />
        <text x="58" y="100" fontSize="13" fontFamily="monospace" fill="#93c5fd">print(<tspan fill="#fdba74">"Hello"</tspan>)</text>
        <text x="58" y="128" fontSize="13" fontFamily="monospace" fill="#93c5fd">print(<tspan fill="#86efac">42</tspan>)</text>
        <text x="58" y="160" fontSize="10" fontFamily="monospace" fill="#94a3b8">"..." = string · 42 = number</text>

        {/* arrow */}
        <line x1="330" y1="125" x2="400" y2="125" stroke="#64748b" strokeWidth="2.5" markerEnd="url(#pp-a)" />
        <text x="365" y="115" textAnchor="middle" fontSize="10" fill="#64748b" className="dark:fill-gray-400">runs</text>

        {/* console */}
        <rect x="410" y="70" width="250" height="110" rx="10" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" className="dark:fill-gray-800 dark:stroke-green-400" />
        <text x="426" y="92" fontSize="11" fontWeight="700" fill="#15803d" className="dark:fill-green-300">Console output</text>
        <text x="426" y="124" fontSize="13" fontFamily="monospace" fill="#0f172a" className="dark:fill-gray-100">Hello</text>
        <text x="426" y="150" fontSize="13" fontFamily="monospace" fill="#0f172a" className="dark:fill-gray-100">42</text>

        <text x="40" y="212" fontSize="11" fontStyle="italic" fill="#64748b" className="dark:fill-gray-400">Quotes are part of the code, not the output.</text>
        <defs><marker id="pp-a" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#64748b" /></marker></defs>
      </svg>
    </div>
  );
}
