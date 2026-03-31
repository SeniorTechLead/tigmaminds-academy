import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

// ─── Gate evaluation ───────────────────────────────────────
type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

function evalGate(type: GateType, a: number, b: number): number {
  switch (type) {
    case 'AND':  return a & b;
    case 'OR':   return a | b;
    case 'NOT':  return a ? 0 : 1;
    case 'NAND': return (a & b) ? 0 : 1;
    case 'NOR':  return (a | b) ? 0 : 1;
    case 'XOR':  return a ^ b;
    case 'XNOR': return (a ^ b) ? 0 : 1;
  }
}

function gateExpr(type: GateType): string {
  switch (type) {
    case 'AND':  return 'A \u00B7 B';
    case 'OR':   return 'A + B';
    case 'NOT':  return '\u00ACA';
    case 'NAND': return '\u00AC(A \u00B7 B)';
    case 'NOR':  return '\u00AC(A + B)';
    case 'XOR':  return 'A \u2295 B';
    case 'XNOR': return '\u00AC(A \u2295 B)';
  }
}

function truthRows(type: GateType): [number, number, number][] {
  if (type === 'NOT') return [[0, 0, 1], [1, 0, 0]];
  return [
    [0, 0, evalGate(type, 0, 0)],
    [0, 1, evalGate(type, 0, 1)],
    [1, 0, evalGate(type, 1, 0)],
    [1, 1, evalGate(type, 1, 1)],
  ];
}

// ─── Gate SVG drawing ──────────────────────────────────────
function GateSVG({ type, a, b, out, cx, cy }: { type: GateType; a: number; b: number; out: number; cx: number; cy: number }) {
  const gateStroke = 'text-gray-700 dark:text-gray-200';
  const wireStroke = 'text-gray-400 dark:text-gray-500';
  const isNot = type === 'NOT';

  const gateBody = () => {
    switch (type) {
      case 'AND':
        return <path d={`M${cx-20} ${cy-18} L${cx+2} ${cy-18} A18 18 0 0 1 ${cx+2} ${cy+18} L${cx-20} ${cy+18} Z`}
          fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />;
      case 'OR':
        return <path d={`M${cx-22} ${cy-18} Q${cx-8} ${cy} ${cx-22} ${cy+18} Q${cx+4} ${cy+18} ${cx+20} ${cy} Q${cx+4} ${cy-18} ${cx-22} ${cy-18} Z`}
          fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />;
      case 'NOT':
        return (
          <g>
            <polygon points={`${cx-18},${cy-16} ${cx+12},${cy} ${cx-18},${cy+16}`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <circle cx={cx+16} cy={cy} r={4} fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
          </g>
        );
      case 'NAND':
        return (
          <g>
            <path d={`M${cx-20} ${cy-18} L${cx+2} ${cy-18} A18 18 0 0 1 ${cx+2} ${cy+18} L${cx-20} ${cy+18} Z`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <circle cx={cx+21} cy={cy} r={4} fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
          </g>
        );
      case 'NOR':
        return (
          <g>
            <path d={`M${cx-22} ${cy-18} Q${cx-8} ${cy} ${cx-22} ${cy+18} Q${cx+4} ${cy+18} ${cx+20} ${cy} Q${cx+4} ${cy-18} ${cx-22} ${cy-18} Z`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <circle cx={cx+24} cy={cy} r={4} fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
          </g>
        );
      case 'XOR':
        return (
          <g>
            <path d={`M${cx-22} ${cy-18} Q${cx-8} ${cy} ${cx-22} ${cy+18} Q${cx+4} ${cy+18} ${cx+20} ${cy} Q${cx+4} ${cy-18} ${cx-22} ${cy-18} Z`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <path d={`M${cx-27} ${cy-18} Q${cx-13} ${cy} ${cx-27} ${cy+18}`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
          </g>
        );
      case 'XNOR':
        return (
          <g>
            <path d={`M${cx-22} ${cy-18} Q${cx-8} ${cy} ${cx-22} ${cy+18} Q${cx+4} ${cy+18} ${cx+20} ${cy} Q${cx+4} ${cy-18} ${cx-22} ${cy-18} Z`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <path d={`M${cx-27} ${cy-18} Q${cx-13} ${cy} ${cx-27} ${cy+18}`}
              fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
            <circle cx={cx+24} cy={cy} r={4} fill="none" stroke="currentColor" className={gateStroke} strokeWidth="2.5" />
          </g>
        );
    }
  };

  const outX = ['NAND','NOR','XNOR'].includes(type) ? cx+28 : type === 'NOT' ? cx+20 : cx+20;

  return (
    <g>
      {gateBody()}
      {/* Input wires */}
      {isNot ? (
        <line x1={cx-40} y1={cy} x2={cx-18} y2={cy} stroke={a ? '#eab308' : 'currentColor'} className={a ? '' : wireStroke} strokeWidth="2" />
      ) : (
        <>
          <line x1={cx-40} y1={cy-9} x2={cx-20} y2={cy-9} stroke={a ? '#eab308' : 'currentColor'} className={a ? '' : wireStroke} strokeWidth="2" />
          <line x1={cx-40} y1={cy+9} x2={cx-20} y2={cy+9} stroke={b ? '#eab308' : 'currentColor'} className={b ? '' : wireStroke} strokeWidth="2" />
        </>
      )}
      {/* Output wire */}
      <line x1={outX} y1={cy} x2={cx+46} y2={cy} stroke={out ? '#eab308' : 'currentColor'} className={out ? '' : wireStroke} strokeWidth="2" />
      {/* Output bulb */}
      <circle cx={cx+54} cy={cy} r={8}
        fill={out ? '#fde047' : 'currentColor'}
        className={out ? '' : 'text-gray-300 dark:text-gray-600'}
        stroke={out ? '#eab308' : 'currentColor'}
        strokeWidth="1.5"
      />
      {/* Labels */}
      {isNot ? (
        <text x={cx-44} y={cy+4} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="600">A</text>
      ) : (
        <>
          <text x={cx-44} y={cy-5} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="600">A</text>
          <text x={cx-44} y={cy+14} textAnchor="end" className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="600">B</text>
        </>
      )}
      <text x={cx+68} y={cy+4} className="fill-gray-600 dark:fill-gray-300" fontSize="12" fontWeight="600">Q</text>
    </g>
  );
}

// ─── Circuit presets ───────────────────────────────────────
type CircuitId = 'half-adder' | 'full-adder' | 'sr-latch' | 'mux-2to1';

interface CircuitDef {
  name: string;
  inputs: string[];
  outputs: string[];
  desc: string;
  evaluate: (ins: Record<string, number>) => Record<string, number>;
}

const CIRCUITS: Record<CircuitId, CircuitDef> = {
  'half-adder': {
    name: 'Half Adder',
    inputs: ['A', 'B'],
    outputs: ['Sum', 'Carry'],
    desc: 'Adds two 1-bit numbers. Sum = A XOR B, Carry = A AND B.',
    evaluate: (ins) => ({
      Sum: ins.A ^ ins.B,
      Carry: ins.A & ins.B,
    }),
  },
  'full-adder': {
    name: 'Full Adder',
    inputs: ['A', 'B', 'Cin'],
    outputs: ['Sum', 'Cout'],
    desc: 'Adds two bits plus carry-in. Two half adders chained together.',
    evaluate: (ins) => {
      const s1 = ins.A ^ ins.B;
      const c1 = ins.A & ins.B;
      const sum = s1 ^ ins.Cin;
      const cout = c1 | (s1 & ins.Cin);
      return { Sum: sum, Cout: cout };
    },
  },
  'sr-latch': {
    name: 'SR Latch (NOR)',
    inputs: ['S', 'R'],
    outputs: ['Q', 'Q\u0305'],
    desc: 'Set-Reset memory. S=1 sets Q=1, R=1 resets Q=0. Both 1 is invalid.',
    evaluate: (ins) => {
      if (ins.S && ins.R) return { Q: 0, 'Q\u0305': 0 }; // invalid
      if (ins.S) return { Q: 1, 'Q\u0305': 0 };
      if (ins.R) return { Q: 0, 'Q\u0305': 1 };
      return { Q: 0, 'Q\u0305': 1 }; // hold (simplified)
    },
  },
  'mux-2to1': {
    name: '2-to-1 MUX',
    inputs: ['D0', 'D1', 'Sel'],
    outputs: ['Y'],
    desc: 'Selector picks which input passes through. Sel=0 \u2192 Y=D0, Sel=1 \u2192 Y=D1.',
    evaluate: (ins) => ({
      Y: ins.Sel ? ins.D1 : ins.D0,
    }),
  },
};

// ─── Boolean expression parser ─────────────────────────────
type BoolNode = { type: 'var'; name: string }
  | { type: 'not'; child: BoolNode }
  | { type: 'and'; left: BoolNode; right: BoolNode }
  | { type: 'or'; left: BoolNode; right: BoolNode }
  | { type: 'xor'; left: BoolNode; right: BoolNode };

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const s = expr.trim();
  while (i < s.length) {
    if (s[i] === ' ') { i++; continue; }
    if (s[i] === '(' || s[i] === ')') { tokens.push(s[i]); i++; continue; }
    // Multi-char keywords
    const rest = s.slice(i).toUpperCase();
    if (rest.startsWith('AND')) { tokens.push('AND'); i += 3; continue; }
    if (rest.startsWith('OR') && (i + 2 >= s.length || /[\s()]/.test(s[i+2]))) { tokens.push('OR'); i += 2; continue; }
    if (rest.startsWith('XOR')) { tokens.push('XOR'); i += 3; continue; }
    if (rest.startsWith('NOT')) { tokens.push('NOT'); i += 3; continue; }
    // Variable name (single letter or multi-letter)
    if (/[A-Za-z]/.test(s[i])) {
      let name = '';
      while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) { name += s[i]; i++; }
      // Avoid treating keywords as variables
      const up = name.toUpperCase();
      if (['AND','OR','XOR','NOT'].includes(up)) { tokens.push(up); continue; }
      tokens.push(name);
      continue;
    }
    // Skip unrecognized
    i++;
  }
  return tokens;
}

function parseExpr(tokens: string[], pos: { i: number }): BoolNode | null {
  const left = parseOr(tokens, pos);
  return left;
}

function parseOr(tokens: string[], pos: { i: number }): BoolNode | null {
  let left = parseXor(tokens, pos);
  if (!left) return null;
  while (pos.i < tokens.length && tokens[pos.i] === 'OR') {
    pos.i++;
    const right = parseXor(tokens, pos);
    if (!right) return null;
    left = { type: 'or', left, right };
  }
  return left;
}

function parseXor(tokens: string[], pos: { i: number }): BoolNode | null {
  let left = parseAnd(tokens, pos);
  if (!left) return null;
  while (pos.i < tokens.length && tokens[pos.i] === 'XOR') {
    pos.i++;
    const right = parseAnd(tokens, pos);
    if (!right) return null;
    left = { type: 'xor', left, right };
  }
  return left;
}

function parseAnd(tokens: string[], pos: { i: number }): BoolNode | null {
  let left = parseNot(tokens, pos);
  if (!left) return null;
  while (pos.i < tokens.length && tokens[pos.i] === 'AND') {
    pos.i++;
    const right = parseNot(tokens, pos);
    if (!right) return null;
    left = { type: 'and', left, right };
  }
  return left;
}

function parseNot(tokens: string[], pos: { i: number }): BoolNode | null {
  if (pos.i < tokens.length && tokens[pos.i] === 'NOT') {
    pos.i++;
    const child = parseNot(tokens, pos);
    if (!child) return null;
    return { type: 'not', child };
  }
  return parsePrimary(tokens, pos);
}

function parsePrimary(tokens: string[], pos: { i: number }): BoolNode | null {
  if (pos.i >= tokens.length) return null;
  if (tokens[pos.i] === '(') {
    pos.i++;
    const node = parseExpr(tokens, pos);
    if (pos.i < tokens.length && tokens[pos.i] === ')') pos.i++;
    return node;
  }
  // Variable
  const name = tokens[pos.i];
  pos.i++;
  return { type: 'var', name };
}

function evalTree(node: BoolNode, vars: Record<string, number>): number {
  switch (node.type) {
    case 'var': return vars[node.name] ?? 0;
    case 'not': return evalTree(node.child, vars) ? 0 : 1;
    case 'and': return evalTree(node.left, vars) & evalTree(node.right, vars);
    case 'or':  return evalTree(node.left, vars) | evalTree(node.right, vars);
    case 'xor': return evalTree(node.left, vars) ^ evalTree(node.right, vars);
  }
}

function getVars(node: BoolNode): string[] {
  const set = new Set<string>();
  function walk(n: BoolNode) {
    if (n.type === 'var') set.add(n.name);
    else if (n.type === 'not') walk(n.child);
    else { walk(n.left); walk(n.right); }
  }
  walk(node);
  return [...set].sort();
}

function nodeToString(node: BoolNode): string {
  switch (node.type) {
    case 'var': return node.name;
    case 'not': {
      const c = nodeToString(node.child);
      return node.child.type === 'var' ? `NOT ${c}` : `NOT (${c})`;
    }
    case 'and': {
      const l = node.left.type === 'or' || node.left.type === 'xor' ? `(${nodeToString(node.left)})` : nodeToString(node.left);
      const r = node.right.type === 'or' || node.right.type === 'xor' ? `(${nodeToString(node.right)})` : nodeToString(node.right);
      return `${l} AND ${r}`;
    }
    case 'or': {
      const l = nodeToString(node.left);
      const r = nodeToString(node.right);
      return `${l} OR ${r}`;
    }
    case 'xor': {
      const l = nodeToString(node.left);
      const r = nodeToString(node.right);
      return `${l} XOR ${r}`;
    }
  }
}

function simplify(node: BoolNode): BoolNode {
  // Apply De Morgan's: NOT(A AND B) -> NOT A OR NOT B, NOT(A OR B) -> NOT A AND NOT B
  if (node.type === 'not') {
    const c = simplify(node.child);
    if (c.type === 'and') {
      return { type: 'or', left: { type: 'not', child: c.left }, right: { type: 'not', child: c.right } };
    }
    if (c.type === 'or') {
      return { type: 'and', left: { type: 'not', child: c.left }, right: { type: 'not', child: c.right } };
    }
    // Double negation
    if (c.type === 'not') return simplify(c.child);
    return { type: 'not', child: c };
  }
  if (node.type === 'and') return { type: 'and', left: simplify(node.left), right: simplify(node.right) };
  if (node.type === 'or') return { type: 'or', left: simplify(node.left), right: simplify(node.right) };
  if (node.type === 'xor') return { type: 'xor', left: simplify(node.left), right: simplify(node.right) };
  return node;
}

// ─── Toggle button component ──────────────────────────────
function ToggleBtn({ label, value, onChange }: { label: string; value: number; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        value
          ? 'bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/30'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}
    >
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </button>
  );
}

// ─── Panel 1: Single Gate Explorer ─────────────────────────
function SingleGateExplorer() {
  const [gate, setGate] = useState<GateType>('AND');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const out = evalGate(gate, a, b);
  const rows = truthRows(gate);
  const isNot = gate === 'NOT';

  return (
    <div className="space-y-4">
      {/* Gate selector */}
      <div className="flex flex-wrap gap-2">
        {(['AND','OR','NOT','NAND','NOR','XOR','XNOR'] as GateType[]).map(g => (
          <button
            key={g}
            onClick={() => setGate(g)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              gate === g
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Input toggles */}
      <div className="flex gap-3">
        <ToggleBtn label="A" value={a} onChange={() => setA(v => v ? 0 : 1)} />
        {!isNot && <ToggleBtn label="B" value={b} onChange={() => setB(v => v ? 0 : 1)} />}
      </div>

      {/* Gate SVG */}
      <svg viewBox="0 0 200 80" className="w-full max-w-xs">
        <GateSVG type={gate} a={a} b={b} out={out} cx={80} cy={40} />
      </svg>

      {/* Expression */}
      <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
        {gateExpr(gate)} = <span className={out ? 'text-yellow-500 font-bold' : 'text-gray-400 font-bold'}>{out}</span>
      </div>

      {/* Truth table */}
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-1 text-left font-semibold text-gray-900 dark:text-white">A</th>
              {!isNot && <th className="px-4 py-1 text-left font-semibold text-gray-900 dark:text-white">B</th>}
              <th className="px-4 py-1 text-left font-semibold text-gray-900 dark:text-white">Q</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isActive = isNot ? row[0] === a : (row[0] === a && row[1] === b);
              return (
                <tr key={ri} className={isActive ? 'bg-yellow-100 dark:bg-yellow-900/30 font-bold' : ''}>
                  <td className="px-4 py-1 text-gray-700 dark:text-gray-300">{row[0]}</td>
                  {!isNot && <td className="px-4 py-1 text-gray-700 dark:text-gray-300">{row[1]}</td>}
                  <td className="px-4 py-1 text-gray-700 dark:text-gray-300">{row[2]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Panel 2: Build a Circuit ──────────────────────────────
function CircuitBuilder() {
  const [circuitId, setCircuitId] = useState<CircuitId>('half-adder');
  const circuit = CIRCUITS[circuitId];
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    circuit.inputs.forEach(n => init[n] = 0);
    return init;
  });
  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>();

  const toggleInput = useCallback((name: string) => {
    setInputs(prev => ({ ...prev, [name]: prev[name] ? 0 : 1 }));
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 300);
  }, []);

  useEffect(() => {
    const init: Record<string, number> = {};
    CIRCUITS[circuitId].inputs.forEach(n => init[n] = 0);
    setInputs(init);
  }, [circuitId]);

  const outputs = circuit.evaluate(inputs);

  // Generate truth table for all input combos
  const allCombos = useMemo(() => {
    const n = circuit.inputs.length;
    const combos: Record<string, number>[][] = [];
    for (let i = 0; i < (1 << n); i++) {
      const ins: Record<string, number> = {};
      circuit.inputs.forEach((name, bit) => {
        ins[name] = (i >> (n - 1 - bit)) & 1;
      });
      const outs = circuit.evaluate(ins);
      combos.push([ins, outs]);
    }
    return combos;
  }, [circuitId, circuit]);

  return (
    <div className="space-y-4">
      {/* Circuit selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CIRCUITS) as CircuitId[]).map(id => (
          <button
            key={id}
            onClick={() => setCircuitId(id)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              circuitId === id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {CIRCUITS[id].name}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">{circuit.desc}</p>

      {/* I/O display */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Inputs */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Inputs</div>
          {circuit.inputs.map(name => (
            <ToggleBtn key={name} label={name} value={inputs[name] ?? 0} onChange={() => toggleInput(name)} />
          ))}
        </div>

        {/* Arrow with flash */}
        <div className="flex items-center">
          <div className={`w-16 h-1 rounded transition-colors duration-300 ${flash ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
          <div className={`w-0 h-0 border-l-8 border-y-4 border-y-transparent transition-colors duration-300 ${flash ? 'border-l-yellow-400' : 'border-l-gray-300 dark:border-l-gray-600'}`} />
        </div>

        {/* Outputs */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Outputs</div>
          {circuit.outputs.map(name => (
            <div key={name} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 ${
                outputs[name] ? 'bg-yellow-400 border-yellow-500 shadow-md shadow-yellow-400/40' : 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500'
              }`} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{name} = {outputs[name]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Truth table */}
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {circuit.inputs.map(n => (
                <th key={n} className="px-3 py-1 text-left font-semibold text-gray-900 dark:text-white">{n}</th>
              ))}
              {circuit.outputs.map(n => (
                <th key={n} className="px-3 py-1 text-left font-semibold text-blue-700 dark:text-blue-300">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allCombos.map(([ins, outs], ri) => {
              const isActive = circuit.inputs.every(n => ins[n] === (inputs[n] ?? 0));
              return (
                <tr key={ri} className={isActive ? 'bg-yellow-100 dark:bg-yellow-900/30 font-bold' : ''}>
                  {circuit.inputs.map(n => (
                    <td key={n} className="px-3 py-1 text-gray-700 dark:text-gray-300">{ins[n]}</td>
                  ))}
                  {circuit.outputs.map(n => (
                    <td key={n} className="px-3 py-1 text-gray-700 dark:text-gray-300">{outs[n]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Panel 3: Boolean Algebra ──────────────────────────────
function BooleanAlgebra() {
  const [expr, setExpr] = useState('A AND (B OR C)');
  const [vars, setVars] = useState<Record<string, number>>({});
  const [simplified, setSimplified] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      const tokens = tokenize(expr);
      if (tokens.length === 0) return null;
      const pos = { i: 0 };
      const tree = parseExpr(tokens, pos);
      return tree;
    } catch {
      return null;
    }
  }, [expr]);

  const varNames = useMemo(() => {
    if (!parsed) return [];
    return getVars(parsed);
  }, [parsed]);

  // Sync var state when variable names change
  useEffect(() => {
    setVars(prev => {
      const next: Record<string, number> = {};
      varNames.forEach(v => { next[v] = prev[v] ?? 0; });
      return next;
    });
    setSimplified(null);
  }, [varNames]);

  const result = parsed ? evalTree(parsed, vars) : null;

  const handleSimplify = useCallback(() => {
    if (!parsed) return;
    const s = simplify(parsed);
    setSimplified(nodeToString(s));
  }, [parsed]);

  return (
    <div className="space-y-4">
      {/* Expression input */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Boolean expression (use AND, OR, NOT, XOR, parentheses)</label>
        <input
          type="text"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="A AND (B OR C)"
        />
      </div>

      {parsed ? (
        <>
          {/* Variable toggles */}
          <div className="flex flex-wrap gap-2">
            {varNames.map(v => (
              <ToggleBtn key={v} label={v} value={vars[v] ?? 0} onChange={() => setVars(prev => ({ ...prev, [v]: prev[v] ? 0 : 1 }))} />
            ))}
          </div>

          {/* Result */}
          <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
            Result: <span className={result ? 'text-yellow-500 font-bold' : 'text-gray-400 font-bold'}>{result}</span>
          </div>

          {/* Truth table */}
          {varNames.length <= 5 && (
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    {varNames.map(v => (
                      <th key={v} className="px-3 py-1 text-left font-semibold text-gray-900 dark:text-white">{v}</th>
                    ))}
                    <th className="px-3 py-1 text-left font-semibold text-blue-700 dark:text-blue-300">Out</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 1 << varNames.length }, (_, i) => {
                    const row: Record<string, number> = {};
                    varNames.forEach((v, bit) => {
                      row[v] = (i >> (varNames.length - 1 - bit)) & 1;
                    });
                    const out = evalTree(parsed, row);
                    const isActive = varNames.every(v => row[v] === (vars[v] ?? 0));
                    return (
                      <tr key={i} className={isActive ? 'bg-yellow-100 dark:bg-yellow-900/30 font-bold' : ''}>
                        {varNames.map(v => (
                          <td key={v} className="px-3 py-1 text-gray-700 dark:text-gray-300">{row[v]}</td>
                        ))}
                        <td className="px-3 py-1 text-gray-700 dark:text-gray-300">{out}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Simplify */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimplify}
              className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
            >
              Simplify (De Morgan)
            </button>
            {simplified && (
              <span className="text-sm font-mono text-purple-600 dark:text-purple-400">{simplified}</span>
            )}
          </div>
        </>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">Enter a valid expression to begin.</p>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────
export default function LogicGateSimulator() {
  const [tab, setTab] = useState<'explore' | 'build' | 'algebra'>('explore');

  const tabs = [
    { id: 'explore' as const, label: 'Single Gate Explorer' },
    { id: 'build' as const, label: 'Build a Circuit' },
    { id: 'algebra' as const, label: 'Boolean Algebra' },
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors ${
              tab === t.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="p-4">
        {tab === 'explore' && <SingleGateExplorer />}
        {tab === 'build' && <CircuitBuilder />}
        {tab === 'algebra' && <BooleanAlgebra />}
      </div>
    </div>
  );
}
