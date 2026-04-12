'use client';
import { useState } from 'react';

const DARK = 'bg-gray-900 rounded-xl p-6 text-white';
const LABEL = 'text-[10px] font-bold uppercase tracking-wider text-gray-500';
const BTN = 'px-3 py-1 rounded text-xs font-bold transition-all duration-200';
const NODE = 'rounded-lg border-2 px-3 py-2 text-center font-mono text-sm transition-all duration-300 cursor-pointer';

/* ════════════════════════════════════════════
   1. HTMLTagsDiagram — Interactive HTML tree
   ════════════════════════════════════════════ */
export function HTMLTagsDiagram() {
  const tags: Record<string, { color: string; desc: string; children?: string[] }> = {
    '<html>': { color: 'border-purple-500 bg-purple-900/30 text-purple-300', desc: 'Root element — wraps everything on the page', children: ['<head>', '<body>'] },
    '<head>': { color: 'border-blue-500 bg-blue-900/30 text-blue-300', desc: 'Metadata container — title, styles, scripts (invisible to user)', children: ['<title>', '<link>'] },
    '<body>': { color: 'border-emerald-500 bg-emerald-900/30 text-emerald-300', desc: 'Visible content — everything the user sees goes here', children: ['<h1>', '<p>'] },
    '<title>': { color: 'border-sky-500 bg-sky-900/30 text-sky-300', desc: 'Page title — shown in the browser tab' },
    '<link>': { color: 'border-sky-500 bg-sky-900/30 text-sky-300', desc: 'Links external resources like CSS stylesheets' },
    '<h1>': { color: 'border-amber-500 bg-amber-900/30 text-amber-300', desc: 'Main heading — the biggest, most important title' },
    '<p>': { color: 'border-amber-500 bg-amber-900/30 text-amber-300', desc: 'Paragraph — a block of text content' },
  };
  const [sel, setSel] = useState('<html>');

  const renderNode = (tag: string, depth: number) => (
    <div key={tag} className="flex flex-col items-center">
      <button onClick={() => setSel(tag)}
        className={`${NODE} ${tags[tag].color} ${sel === tag ? 'ring-2 ring-white scale-105' : 'opacity-80 hover:opacity-100'}`}>
        {tag}
      </button>
      {tags[tag].children && (
        <div className="flex gap-3 mt-2 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-gray-600" />
          {tags[tag].children!.map(c => (
            <div key={c} className="flex flex-col items-center">
              <div className="w-px h-3 bg-gray-600" />
              {renderNode(c, depth + 1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={DARK}>
      <div className="flex items-center justify-between mb-4">
        <span className={LABEL}>HTML Document Tree</span>
        <span className="text-[10px] text-gray-600">Click any tag</span>
      </div>
      <div className="flex justify-center overflow-x-auto pb-2">{renderNode('<html>', 0)}</div>
      <div className="mt-4 bg-gray-800 rounded-lg p-3 text-center">
        <span className="font-mono text-sm text-emerald-400">{sel}</span>
        <span className="mx-2 text-gray-600">...</span>
        <span className="font-mono text-sm text-emerald-400">{sel.replace('<', '</')}</span>
        <p className="text-xs text-gray-400 mt-2">{tags[sel].desc}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   2. HTMLStructureDiagram — DOM hierarchy
   ════════════════════════════════════════════ */
export function HTMLStructureDiagram() {
  const elements = [
    { tag: 'h1', label: 'Main Heading', color: 'bg-blue-800/60 border-blue-500', size: 'text-xl font-bold', example: '<h1>Welcome to My Site</h1>' },
    { tag: 'h2', label: 'Sub Heading', color: 'bg-blue-700/40 border-blue-400', size: 'text-lg font-bold', example: '<h2>About Us</h2>' },
    { tag: 'h3', label: 'Section Heading', color: 'bg-blue-600/30 border-blue-300', size: 'text-base font-semibold', example: '<h3>Our Team</h3>' },
    { tag: 'p', label: 'Paragraph', color: 'bg-gray-700/40 border-gray-500', size: 'text-sm', example: '<p>Some text content here...</p>' },
    { tag: 'ul > li', label: 'Unordered List', color: 'bg-emerald-800/40 border-emerald-500', size: 'text-sm', example: '<ul><li>Item 1</li><li>Item 2</li></ul>' },
    { tag: 'a', label: 'Link', color: 'bg-purple-800/40 border-purple-500', size: 'text-sm underline', example: '<a href="url">Click here</a>' },
    { tag: 'img', label: 'Image', color: 'bg-amber-800/40 border-amber-500', size: 'text-sm', example: '<img src="photo.jpg" alt="desc" />' },
  ];
  const [sel, setSel] = useState(0);

  return (
    <div className={DARK}>
      <span className={LABEL}>Page Structure — Click Each Element</span>
      <div className="mt-4 space-y-2">
        {elements.map((el, i) => (
          <button key={el.tag} onClick={() => setSel(i)}
            className={`w-full text-left border-l-4 rounded-r-lg px-4 py-2 transition-all duration-300 ${el.color} ${sel === i ? 'ring-1 ring-white scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
            style={{ marginLeft: el.tag.includes('li') ? 24 : el.tag === 'h3' ? 16 : el.tag === 'h2' ? 8 : 0 }}>
            <span className={el.size}>{el.label}</span>
            <span className="ml-2 text-[10px] text-gray-400 font-mono">&lt;{el.tag}&gt;</span>
          </button>
        ))}
      </div>
      <div className="mt-4 bg-gray-800 rounded-lg p-3">
        <code className="text-xs text-emerald-400 font-mono">{elements[sel].example}</code>
        <p className="text-xs text-gray-400 mt-1">Tag <span className="text-white font-mono">&lt;{elements[sel].tag}&gt;</span> creates a {elements[sel].label.toLowerCase()}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   3. CSSBoxModelDiagram — Interactive box model
   ════════════════════════════════════════════ */
export function CSSBoxModelDiagram() {
  const [margin, setMargin] = useState(16);
  const [padding, setPadding] = useState(16);
  const [border, setBorder] = useState(4);
  const [color, setColor] = useState('#3b82f6');

  const Adj = ({ label, value, set }: { label: string; value: number; set: (v: number) => void }) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 w-14 text-right">{label}</span>
      <button onClick={() => set(Math.max(0, value - 4))} className={`${BTN} bg-gray-700 hover:bg-gray-600`}>-</button>
      <span className="text-xs font-mono w-8 text-center">{value}</span>
      <button onClick={() => set(Math.min(40, value + 4))} className={`${BTN} bg-gray-700 hover:bg-gray-600`}>+</button>
    </div>
  );

  return (
    <div className={DARK}>
      <span className={LABEL}>CSS Box Model — Adjust Values</span>
      <div className="flex flex-col md:flex-row gap-6 mt-4 items-center">
        <div className="flex-1 flex justify-center">
          <div className="bg-amber-900/30 border-2 border-dashed border-amber-500/50 transition-all duration-300 flex items-center justify-center"
            style={{ padding: margin }}>
            <div className="text-[9px] text-amber-400 absolute -mt-2 self-start">margin</div>
            <div className="bg-emerald-900/30 transition-all duration-300 flex items-center justify-center relative"
              style={{ padding: padding, borderWidth: border, borderColor: '#22c55e', borderStyle: 'solid' }}>
              <div className="text-[9px] text-emerald-400 absolute top-0.5 left-1">padding</div>
              <div className="transition-all duration-300 rounded px-4 py-3 font-bold text-sm min-w-[80px] text-center"
                style={{ backgroundColor: color + '33', color }}>
                Content
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Adj label="margin" value={margin} set={setMargin} />
          <Adj label="border" value={border} set={setBorder} />
          <Adj label="padding" value={padding} set={setPadding} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-14 text-right">color</span>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
            <span className="text-xs font-mono">{color}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-800 rounded-lg p-2 font-mono text-[11px] text-gray-300">
        <span className="text-amber-400">margin</span>: {margin}px; <span className="text-emerald-400">border</span>: {border}px solid; <span className="text-emerald-400">padding</span>: {padding}px; <span className="text-blue-400">background</span>: {color};
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   4. FlexboxDiagram — Flexbox playground
   ════════════════════════════════════════════ */
export function FlexboxDiagram() {
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [direction, setDirection] = useState('row');
  const [wrap, setWrap] = useState('nowrap');
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'];
  const justifyOpts = ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly'];
  const alignOpts = ['flex-start', 'center', 'flex-end', 'stretch'];

  const Toggle = ({ label, options, value, set }: { label: string; options: string[]; value: string; set: (v: string) => void }) => (
    <div className="flex flex-wrap items-center gap-1 mb-2">
      <span className="text-[10px] text-gray-400 w-24 shrink-0">{label}:</span>
      {options.map(o => (
        <button key={o} onClick={() => set(o)}
          className={`${BTN} ${value === o ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div className={DARK}>
      <span className={LABEL}>Flexbox Playground</span>
      <div className="mt-3">
        <Toggle label="justify-content" options={justifyOpts} value={justify} set={setJustify} />
        <Toggle label="align-items" options={alignOpts} value={align} set={setAlign} />
        <Toggle label="flex-direction" options={['row', 'column']} value={direction} set={setDirection} />
        <Toggle label="flex-wrap" options={['nowrap', 'wrap']} value={wrap} set={setWrap} />
      </div>
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-3 mt-3 min-h-[140px] transition-all duration-500 overflow-hidden"
        style={{ display: 'flex', justifyContent: justify, alignItems: align, flexDirection: direction as any, flexWrap: wrap as any }}>
        {colors.map((c, i) => (
          <div key={i} className={`${c} rounded-lg font-bold text-white text-sm flex items-center justify-center transition-all duration-500`}
            style={{ width: direction === 'column' ? '80%' : 60, height: align === 'stretch' && direction === 'row' ? undefined : 40 + i * 8, minHeight: 36, margin: 4 }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="mt-3 bg-gray-800 rounded-lg p-2 font-mono text-[11px] text-gray-300">
        display: flex; justify-content: <span className="text-blue-400">{justify}</span>; align-items: <span className="text-emerald-400">{align}</span>; flex-direction: <span className="text-amber-400">{direction}</span>; flex-wrap: <span className="text-purple-400">{wrap}</span>;
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   5. DOMManipulationDiagram — JS → DOM animated
   ════════════════════════════════════════════ */
export function DOMManipulationDiagram() {
  const actions = [
    { code: 'el.textContent = "World"', before: 'Hello', after: 'World', prop: 'text', color: undefined as string | undefined },
    { code: 'el.style.color = "lime"', before: 'World', after: 'World', prop: 'color', color: '#84cc16' },
    { code: 'el.style.fontSize = "32px"', before: 'World', after: 'World', prop: 'size', color: undefined as string | undefined },
  ];
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'arrow' | 'done'>('idle');
  const [text, setText] = useState('Hello');
  const [elColor, setElColor] = useState('white');
  const [elSize, setElSize] = useState(16);

  const run = () => {
    if (phase !== 'idle') return;
    setPhase('arrow');
    setTimeout(() => {
      const a = actions[step];
      if (a.prop === 'text') setText(a.after);
      if (a.prop === 'color') setElColor(a.color!);
      if (a.prop === 'size') setElSize(32);
      setPhase('done');
      setTimeout(() => {
        setPhase('idle');
        setStep(s => (s + 1) % actions.length);
      }, 1200);
    }, 600);
  };

  const reset = () => { setText('Hello'); setElColor('white'); setElSize(16); setStep(0); setPhase('idle'); };

  return (
    <div className={DARK}>
      <div className="flex items-center justify-between mb-4">
        <span className={LABEL}>JavaScript → DOM</span>
        <button onClick={reset} className="text-[10px] text-gray-500 hover:text-white">Reset</button>
      </div>
      <div className="flex items-center gap-4 justify-center mb-4">
        <div className="bg-gray-800 rounded-lg p-3 border border-yellow-600 min-w-[180px] text-center">
          <div className="text-[10px] text-yellow-500 mb-1">JavaScript</div>
          <code className="text-xs text-yellow-300">{actions[step].code}</code>
        </div>
        <svg width="60" height="24" className="shrink-0">
          <line x1="0" y1="12" x2="50" y2="12" stroke={phase === 'arrow' ? '#facc15' : '#374151'} strokeWidth="2" className="transition-all duration-300" />
          <polygon points="50,6 60,12 50,18" fill={phase === 'arrow' ? '#facc15' : '#374151'} className="transition-all duration-300" />
        </svg>
        <div className={`bg-gray-800 rounded-lg p-4 border min-w-[100px] text-center transition-all duration-500 ${phase === 'done' ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-gray-600'}`}>
          <div className="text-[10px] text-gray-400 mb-1">DOM Element</div>
          <span className="font-bold transition-all duration-500" style={{ color: elColor, fontSize: elSize }}>{text}</span>
        </div>
      </div>
      <div className="text-center">
        <button onClick={run} disabled={phase !== 'idle'}
          className={`${BTN} ${phase === 'idle' ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-700 text-gray-500'} px-6 py-2`}>
          {phase === 'idle' ? 'Run ▶' : phase === 'arrow' ? 'Executing...' : 'Applied!'}
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Step {step + 1}/{actions.length} — JS reaches into the page and changes elements directly</p>
    </div>
  );
}

/* ════════════════════════════════════════════
   6. EventListenerDiagram — Event flow
   ════════════════════════════════════════════ */
export function EventListenerDiagram() {
  const events = [
    { name: 'click', icon: '🖱', handler: 'Change text to "Clicked!"', result: 'Clicked!' },
    { name: 'mouseover', icon: '👆', handler: 'Change background to green', result: 'Hovered!' },
    { name: 'keydown', icon: '⌨', handler: 'Show key name', result: 'Key pressed!' },
  ];
  const [evIdx, setEvIdx] = useState(0);
  const [phase, setPhase] = useState<'waiting' | 'fired' | 'handled'>('waiting');
  const [ripple, setRipple] = useState(false);

  const fire = () => {
    if (phase !== 'waiting') return;
    setPhase('fired');
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    setTimeout(() => {
      setPhase('handled');
      setTimeout(() => setPhase('waiting'), 1500);
    }, 800);
  };

  return (
    <div className={DARK}>
      <div className="flex items-center justify-between mb-4">
        <span className={LABEL}>Event Listener Flow</span>
        <div className="flex gap-1">
          {events.map((e, i) => (
            <button key={e.name} onClick={() => { setEvIdx(i); setPhase('waiting'); }}
              className={`${BTN} ${evIdx === i ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {e.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-around gap-2 mb-3">
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">1. Register</div>
          <div className="bg-gray-800 rounded-lg p-2 text-[11px] font-mono text-purple-300 border border-purple-700">
            btn.addEventListener(&quot;{events[evIdx].name}&quot;, handler)
          </div>
        </div>
        <svg width="30" height="20"><polygon points="20,4 30,10 20,16" fill="#6b7280" /></svg>
        <div className="text-center relative">
          <div className="text-[10px] text-gray-500 mb-1">2. Trigger</div>
          <button onClick={fire}
            className={`relative overflow-hidden rounded-lg px-6 py-3 font-bold text-sm border-2 transition-all duration-300 ${
              phase === 'waiting' ? 'border-gray-600 bg-gray-800 text-gray-400 hover:border-purple-500' :
              phase === 'fired' ? 'border-yellow-500 bg-yellow-900/50 text-yellow-300 scale-105' :
              'border-emerald-500 bg-emerald-900/50 text-emerald-300'
            }`}>
            {phase === 'waiting' ? `${events[evIdx].icon} Button` : phase === 'fired' ? 'Event fired!' : events[evIdx].result}
            {ripple && <span className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-ping" />}
          </button>
        </div>
        <svg width="30" height="20"><polygon points="20,4 30,10 20,16" fill="#6b7280" /></svg>
        <div className="text-center">
          <div className="text-[10px] text-gray-500 mb-1">3. Handle</div>
          <div className={`bg-gray-800 rounded-lg p-2 text-[11px] font-mono border transition-all duration-300 ${
            phase === 'handled' ? 'border-emerald-500 text-emerald-300' : 'border-gray-700 text-gray-500'
          }`}>
            {events[evIdx].handler}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        {phase === 'waiting' ? 'Click the button to simulate the event' : phase === 'fired' ? 'Event detected! Running handler...' : 'Handler executed — DOM updated!'}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   7. ComponentDiagram — HTML + CSS + JS layers
   ════════════════════════════════════════════ */
export function ComponentDiagram() {
  const layers = [
    { name: 'HTML', label: 'Structure', color: 'border-blue-500 bg-blue-900/30 text-blue-300', code: '<button id="cta">\n  Click Me\n</button>' },
    { name: 'CSS', label: 'Style', color: 'border-pink-500 bg-pink-900/30 text-pink-300', code: '#cta {\n  background: #3b82f6;\n  border-radius: 8px;\n  padding: 12px 24px;\n}' },
    { name: 'JS', label: 'Behavior', color: 'border-yellow-500 bg-yellow-900/30 text-yellow-300', code: 'cta.addEventListener("click",\n  () => alert("Hello!")\n)' },
  ];
  const [active, setActive] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className={DARK}>
      <div className="flex items-center justify-between mb-4">
        <span className={LABEL}>One Component = Three Layers</span>
        <button onClick={() => setShowPreview(!showPreview)} className={`${BTN} bg-gray-700 text-gray-400 hover:text-white`}>
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 space-y-2">
          {layers.map((l, i) => (
            <button key={l.name} onClick={() => setActive(active === i ? null : i)}
              className={`w-full text-left rounded-lg border-2 p-3 transition-all duration-300 ${l.color} ${active === i ? 'ring-1 ring-white' : 'opacity-70 hover:opacity-100'}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{l.name}</span>
                <span className="text-[10px] opacity-60">{l.label}</span>
              </div>
              {active === i && (
                <pre className="mt-2 text-[11px] font-mono whitespace-pre-wrap opacity-90">{l.code}</pre>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <svg width="40" height="80">
            <path d="M20,0 L20,30 M10,20 L20,30 L30,20" stroke="#6b7280" strokeWidth="2" fill="none" />
            <text x="20" y="50" textAnchor="middle" fill="#6b7280" fontSize="8">CSS→HTML</text>
            <path d="M20,55 L20,75 M10,65 L20,75 L30,65" stroke="#6b7280" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {showPreview && (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 text-center">
              <div className="text-[10px] text-gray-500 mb-3">Live Preview</div>
              <div className="inline-block bg-blue-600 rounded-lg px-6 py-3 font-bold text-white text-sm cursor-pointer hover:bg-blue-500 transition-colors active:scale-95 transform">
                Click Me
              </div>
              <p className="text-[10px] text-gray-500 mt-3">HTML builds it, CSS styles it, JS makes it alive</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   8. TodoDataFlowDiagram — State → render cycle
   ════════════════════════════════════════════ */
export function TodoDataFlowDiagram() {
  const [items, setItems] = useState([
    { text: 'Buy milk', done: false },
    { text: 'Read book', done: false },
    { text: 'Code', done: false },
  ]);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const add = () => {
    if (!input.trim()) return;
    setItems(prev => [...prev, { text: input.trim(), done: false }]);
    setInput('');
    setFlash(items.length);
    setTimeout(() => setFlash(null), 600);
  };

  const toggle = (i: number) => {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, done: !it.done } : it));
    setFlash(i);
    setTimeout(() => setFlash(null), 600);
  };

  const remove = (i: number) => {
    setRemoving(i);
    setTimeout(() => {
      setItems(prev => prev.filter((_, idx) => idx !== i));
      setRemoving(null);
    }, 400);
  };

  return (
    <div className={DARK}>
      <span className={LABEL}>Todo App — State → Render → DOM</span>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1">
          <div className="text-[10px] text-gray-500 mb-1">State (data)</div>
          <div className="bg-gray-800 rounded-lg p-2 font-mono text-[11px] text-blue-300 min-h-[60px]">
            [{items.map((it, i) => `${i > 0 ? ' ' : ''}"${it.text}"${it.done ? '✓' : ''}`).join(',')}]
          </div>
        </div>
        <div className="flex items-center justify-center">
          <svg width="50" height="30">
            <text x="10" y="10" fill="#6b7280" fontSize="8">render</text>
            <line x1="5" y1="15" x2="40" y2="15" stroke="#6b7280" strokeWidth="2" />
            <polygon points="40,10 50,15 40,20" fill="#6b7280" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-gray-500 mb-1">DOM (visible list)</div>
          <div className="bg-gray-800 rounded-lg p-2 space-y-1 min-h-[60px]">
            {items.map((it, i) => (
              <div key={`${it.text}-${i}`}
                className={`flex items-center gap-2 rounded px-2 py-1 text-xs transition-all duration-300 ${
                  flash === i ? 'bg-emerald-900/50 ring-1 ring-emerald-500' : ''
                } ${removing === i ? 'opacity-0 scale-95' : 'opacity-100'}`}>
                <button onClick={() => toggle(i)}
                  className={`w-4 h-4 rounded border ${it.done ? 'bg-emerald-600 border-emerald-500' : 'border-gray-600'} flex items-center justify-center text-[10px]`}>
                  {it.done && '✓'}
                </button>
                <span className={`flex-1 ${it.done ? 'line-through text-gray-500' : 'text-white'}`}>{it.text}</span>
                <button onClick={() => remove(i)} className="text-red-500 hover:text-red-400 text-[10px]">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="New item..." className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 outline-none" />
        <button onClick={add} className={`${BTN} bg-blue-600 hover:bg-blue-500 text-white px-4`}>Add</button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Add, toggle, or delete items — watch state update and DOM re-render</p>
    </div>
  );
}
