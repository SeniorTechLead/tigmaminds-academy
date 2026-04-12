import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square, RotateCcw, Cpu, Maximize2, Minimize2, GripHorizontal } from 'lucide-react';

interface ArduinoPlaygroundProps {
  starterCode: string;
  title?: string;
  ledCount?: number;
  description?: string;
  robotMode?: boolean;
  sonarMode?: boolean;
}

interface LedState {
  pin: number;
  brightness: number;
}

interface RobotState {
  x: number;
  y: number;
  angle: number; // radians, 0 = right, pi/2 = down
  leftSpeed: number;
  rightSpeed: number;
  leftDir: number; // 1 = forward, 0 = reverse
  rightDir: number;
  trail: { x: number; y: number }[];
  collided: boolean;
  sensorDist: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ARENA_SIZE = 300;
const ROBOT_W = 15;
const ROBOT_H = 20;
const OBSTACLES: Obstacle[] = [
  { x: 80, y: 40, w: 40, h: 30 },
  { x: 200, y: 100, w: 30, h: 60 },
  { x: 60, y: 200, w: 50, h: 25 },
  { x: 180, y: 220, w: 35, h: 40 },
];

function computeSensorDistance(rx: number, ry: number, angle: number, obstacles: Obstacle[]): number {
  // Cast a ray from robot center in facing direction, find nearest obstacle hit
  const maxDist = 200;
  const steps = 100;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  for (let s = 1; s <= steps; s++) {
    const dist = (s / steps) * maxDist;
    const px = rx + dx * dist;
    const py = ry + dy * dist;
    // Check arena bounds
    if (px < 0 || px >= ARENA_SIZE || py < 0 || py >= ARENA_SIZE) return dist;
    // Check obstacles
    for (const ob of obstacles) {
      if (px >= ob.x && px <= ob.x + ob.w && py >= ob.y && py <= ob.y + ob.h) {
        return dist;
      }
    }
  }
  return maxDist;
}

function checkCollision(rx: number, ry: number, obstacles: Obstacle[]): boolean {
  // Simple point-in-rect for robot center + small radius
  const r = 8;
  if (rx - r < 0 || rx + r >= ARENA_SIZE || ry - r < 0 || ry + r >= ARENA_SIZE) return true;
  for (const ob of obstacles) {
    if (rx + r > ob.x && rx - r < ob.x + ob.w && ry + r > ob.y && ry - r < ob.y + ob.h) {
      return true;
    }
  }
  return false;
}

/* ── Tiny Arduino-C interpreter ──
   Handles: int variables, arrays, for/if/else, arithmetic expressions,
   analogWrite, digitalWrite, pinMode, Serial.print/println, delay, millis, random,
   tone, noTone, analogRead, pulseIn.
   NOT a full C parser — but enough for the lesson code. */

interface UserFunc { params: string[]; bodyTokens: string[] }
type Env = { vars: Record<string, number>; arrays: Record<string, number[]>; funcs: Record<string, UserFunc> };

function createInterpreter(
  ledCount: number,
  onLed: (leds: LedState[]) => void,
  onSerial: (text: string) => void,
  onTone: (frequency: number, duration: number) => void,
  onMotor: (pin: number, value: number, isAnalog: boolean) => void,
  getAnalogRead: (pin: number) => number,
  getPulseIn: (pin: number, value: number) => number,
  signal: AbortSignal,
) {
  const leds: LedState[] = Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 }));
  const serialBuf: string[] = [];
  let tickMs = 0;

  function flushLeds() { onLed(leds.map(l => ({ ...l }))); }
  function serialOut(s: string, newline = false) {
    if (serialBuf.length === 0 || serialBuf[serialBuf.length - 1].endsWith('\n')) {
      serialBuf.push(s + (newline ? '\n' : ''));
    } else {
      serialBuf[serialBuf.length - 1] += s + (newline ? '\n' : '');
    }
    onSerial(serialBuf.join(''));
  }

  // ── Tokenizer ──
  function tokenize(code: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < code.length) {
      // Skip whitespace
      if (/\s/.test(code[i])) { i++; continue; }
      // Line comment
      if (code[i] === '/' && code[i + 1] === '/') {
        while (i < code.length && code[i] !== '\n') i++;
        continue;
      }
      // Block comment
      if (code[i] === '/' && code[i + 1] === '*') {
        i += 2;
        while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      // String literal
      if (code[i] === '"') {
        let s = '"';
        i++;
        while (i < code.length && code[i] !== '"') {
          if (code[i] === '\\') { s += code[i++]; }
          s += code[i++];
        }
        s += '"';
        i++;
        tokens.push(s);
        continue;
      }
      // Multi-char operators
      if (code.slice(i, i + 2) === '++') { tokens.push('++'); i += 2; continue; }
      if (code.slice(i, i + 2) === '--') { tokens.push('--'); i += 2; continue; }
      if (code.slice(i, i + 2) === '+=') { tokens.push('+='); i += 2; continue; }
      if (code.slice(i, i + 2) === '-=') { tokens.push('-='); i += 2; continue; }
      if (code.slice(i, i + 2) === '*=') { tokens.push('*='); i += 2; continue; }
      if (code.slice(i, i + 2) === '/=') { tokens.push('/='); i += 2; continue; }
      if (code.slice(i, i + 2) === '%=') { tokens.push('%='); i += 2; continue; }
      if (code.slice(i, i + 2) === '==') { tokens.push('=='); i += 2; continue; }
      if (code.slice(i, i + 2) === '!=') { tokens.push('!='); i += 2; continue; }
      if (code.slice(i, i + 2) === '<=') { tokens.push('<='); i += 2; continue; }
      if (code.slice(i, i + 2) === '>=') { tokens.push('>='); i += 2; continue; }
      if (code.slice(i, i + 2) === '&&') { tokens.push('&&'); i += 2; continue; }
      if (code.slice(i, i + 2) === '||') { tokens.push('||'); i += 2; continue; }
      // Preprocessor directives — skip the line
      if (code[i] === '#') {
        while (i < code.length && code[i] !== '\n') i++;
        continue;
      }
      // Identifier or keyword
      if (/[a-zA-Z_]/.test(code[i])) {
        let s = '';
        while (i < code.length && /[a-zA-Z0-9_.]/.test(code[i])) s += code[i++];
        tokens.push(s);
        continue;
      }
      // Number
      if (/[0-9]/.test(code[i])) {
        let s = '';
        while (i < code.length && /[0-9.]/.test(code[i])) s += code[i++];
        tokens.push(s);
        continue;
      }
      // Single-char
      tokens.push(code[i]);
      i++;
    }
    return tokens;
  }

  // ── Expression evaluator ──
  function evalExpr(tokens: string[], pos: { i: number }, env: Env, minPrec = 0): number {
    let left = evalUnary(tokens, pos, env);

    while (pos.i < tokens.length) {
      // Ternary operator: expr ? trueExpr : falseExpr
      if (tokens[pos.i] === '?') {
        pos.i++; // skip ?
        const trueVal = evalExpr(tokens, pos, env);
        if (tokens[pos.i] === ':') pos.i++; // skip :
        const falseVal = evalExpr(tokens, pos, env);
        left = left ? trueVal : falseVal;
        continue;
      }
      const op = tokens[pos.i];
      const prec = opPrec(op);
      if (prec < 0 || prec < minPrec) break;
      pos.i++;
      const right = evalExpr(tokens, pos, env, prec + 1);
      left = applyOp(op, left, right);
    }
    return left;
  }

  function opPrec(op: string): number {
    if (op === '||') return 1;
    if (op === '&&') return 2;
    if (op === '==' || op === '!=') return 3;
    if (op === '<' || op === '>' || op === '<=' || op === '>=') return 4;
    if (op === '+' || op === '-') return 5;
    if (op === '*' || op === '/' || op === '%') return 6;
    return -1;
  }

  function applyOp(op: string, a: number, b: number): number {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? Math.trunc(a / b) : 0;
      case '%': return b !== 0 ? a % b : 0;
      case '==': return a === b ? 1 : 0;
      case '!=': return a !== b ? 1 : 0;
      case '<': return a < b ? 1 : 0;
      case '>': return a > b ? 1 : 0;
      case '<=': return a <= b ? 1 : 0;
      case '>=': return a >= b ? 1 : 0;
      case '&&': return (a && b) ? 1 : 0;
      case '||': return (a || b) ? 1 : 0;
      default: return 0;
    }
  }

  function evalUnary(tokens: string[], pos: { i: number }, env: Env): number {
    const t = tokens[pos.i];
    // Unary minus
    if (t === '-') { pos.i++; return -evalUnary(tokens, pos, env); }
    if (t === '!') { pos.i++; return evalUnary(tokens, pos, env) ? 0 : 1; }
    // Parenthesized
    if (t === '(') {
      pos.i++;
      const v = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return v;
    }
    // Number literal
    if (/^[0-9]/.test(t)) { pos.i++; return parseFloat(t); }
    // HIGH/LOW
    if (t === 'HIGH') { pos.i++; return 1; }
    if (t === 'LOW') { pos.i++; return 0; }
    if (t === 'OUTPUT') { pos.i++; return 1; }
    if (t === 'INPUT') { pos.i++; return 0; }
    if (t === 'INPUT_PULLUP') { pos.i++; return 2; }
    if (/^A\d$/.test(t)) { pos.i++; return 14 + parseInt(t[1]); }
    // Built-in functions
    if (t === 'random' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const a = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ',') pos.i++;
      const b = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return a + Math.floor(Math.random() * (b - a));
    }
    if (t === 'millis' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      if (tokens[pos.i] === ')') pos.i++;
      return tickMs;
    }
    if (t === 'abs' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const v = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return Math.abs(v);
    }
    if (t === 'min' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const a = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ',') pos.i++;
      const b = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return Math.min(a, b);
    }
    if (t === 'max' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const a = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ',') pos.i++;
      const b = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return Math.max(a, b);
    }
    if (t === 'constrain' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const v = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ',') pos.i++;
      const lo = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ',') pos.i++;
      const hi = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return Math.max(lo, Math.min(hi, v));
    }
    if (t === 'analogRead' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const pin = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ')') pos.i++;
      return getAnalogRead(pin);
    }
    if (t === 'digitalRead' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      return Math.random() > 0.5 ? 1 : 0;
    }
    if (t === 'pulseIn' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const pin = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ',') pos.i++;
      const val = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ')') pos.i++;
      return getPulseIn(pin, val);
    }
    if (t === 'map' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const args: number[] = [];
      for (let a = 0; a < 5; a++) {
        args.push(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ',') pos.i++;
      }
      if (tokens[pos.i] === ')') pos.i++;
      const [val, inMin, inMax, outMin, outMax] = args;
      return Math.trunc(outMin + (val - inMin) * (outMax - outMin) / (inMax - inMin));
    }
    // User-defined function call in expression context
    if (/^[a-zA-Z_]/.test(t) && tokens[pos.i + 1] === '(' && env.funcs[t]) {
      pos.i++; // skip name
      pos.i++; // skip (
      const args: number[] = [];
      while (pos.i < tokens.length && tokens[pos.i] !== ')') {
        args.push(Math.trunc(evalExpr(tokens, pos, env)));
        if (tokens[pos.i] === ',') pos.i++;
      }
      if (tokens[pos.i] === ')') pos.i++;
      return callUserFunc(t, args, env);
    }
    // Variable or array
    if (/^[a-zA-Z_]/.test(t)) {
      pos.i++;
      // Array access: name[expr]
      if (tokens[pos.i] === '[') {
        pos.i++;
        const idx = Math.trunc(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ']') pos.i++;
        const arr = env.arrays[t];
        if (arr && idx >= 0 && idx < arr.length) return arr[idx];
        return 0;
      }
      // Post-increment/decrement
      if (tokens[pos.i] === '++') { pos.i++; const v = env.vars[t] || 0; env.vars[t] = v + 1; return v; }
      if (tokens[pos.i] === '--') { pos.i++; const v = env.vars[t] || 0; env.vars[t] = v - 1; return v; }
      return env.vars[t] ?? 0;
    }
    pos.i++;
    return 0;
  }

  // ── Statement executor ──
  // Returns: 'delay' with ms value, or null
  async function execBlock(tokens: string[], pos: { i: number }, env: Env): Promise<void> {
    // Expect '{' ... '}'
    if (tokens[pos.i] === '{') pos.i++;
    while (pos.i < tokens.length && tokens[pos.i] !== '}') {
      if (signal.aborted) return;
      await execStatement(tokens, pos, env);
    }
    if (tokens[pos.i] === '}') pos.i++;
  }

  async function execStatement(tokens: string[], pos: { i: number }, env: Env): Promise<void> {
    if (pos.i >= tokens.length || signal.aborted) return;
    const t = tokens[pos.i];

    // Skip type keywords
    if (t === 'void' || t === 'const' || t === 'unsigned' || t === 'long' || t === 'float' || t === 'double' || t === 'byte') {
      pos.i++;
      return execStatement(tokens, pos, env);
    }

    // Variable declaration: int name = expr; or int name[] = {..};
    if (t === 'int' || t === 'char') {
      pos.i++;
      const name = tokens[pos.i]; pos.i++;
      // Array declaration
      if (tokens[pos.i] === '[') {
        pos.i++; // skip [
        if (tokens[pos.i] === ']') { pos.i++; } else {
          // skip size
          evalExpr(tokens, pos, env);
          if (tokens[pos.i] === ']') pos.i++;
        }
        if (tokens[pos.i] === '=') {
          pos.i++;
          if (tokens[pos.i] === '{') {
            pos.i++;
            const vals: number[] = [];
            while (pos.i < tokens.length && tokens[pos.i] !== '}') {
              vals.push(Math.trunc(evalExpr(tokens, pos, env)));
              if (tokens[pos.i] === ',') pos.i++;
            }
            if (tokens[pos.i] === '}') pos.i++;
            env.arrays[name] = vals;
          }
        } else {
          // Uninitialized array with size — create zeros
          env.arrays[name] = [];
        }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
      // Scalar declaration
      if (tokens[pos.i] === '=') {
        pos.i++;
        env.vars[name] = Math.trunc(evalExpr(tokens, pos, env));
      } else {
        env.vars[name] = 0;
      }
      // Handle multiple declarations: int a = 1, b = 2;
      while (tokens[pos.i] === ',') {
        pos.i++;
        const n2 = tokens[pos.i]; pos.i++;
        if (tokens[pos.i] === '=') {
          pos.i++;
          env.vars[n2] = Math.trunc(evalExpr(tokens, pos, env));
        } else {
          env.vars[n2] = 0;
        }
      }
      if (tokens[pos.i] === ';') pos.i++;
      return;
    }

    // For loop: for (init; cond; step) { body }
    if (t === 'for') {
      pos.i++; // skip 'for'
      if (tokens[pos.i] === '(') pos.i++;
      // init
      await execStatement(tokens, pos, env);
      // Save position for condition check
      const condStart = pos.i;
      let loopCount = 0;
      while (loopCount < 500 && !signal.aborted) {
        // Evaluate condition
        pos.i = condStart;
        const cond = evalExpr(tokens, pos, env);
        if (tokens[pos.i] === ';') pos.i++;
        const stepStart = pos.i;
        // Skip step expr to find body
        let parenD = 0;
        while (pos.i < tokens.length) {
          if (tokens[pos.i] === '(') parenD++;
          else if (tokens[pos.i] === ')') {
            if (parenD === 0) { pos.i++; break; }
            parenD--;
          }
          pos.i++;
        }
        const bodyStart = pos.i;

        if (!cond) {
          // Skip body
          if (tokens[pos.i] === '{') {
            let depth = 0;
            do {
              if (tokens[pos.i] === '{') depth++;
              if (tokens[pos.i] === '}') depth--;
              pos.i++;
            } while (depth > 0 && pos.i < tokens.length);
          } else {
            // Single statement — skip to ;
            while (pos.i < tokens.length && tokens[pos.i] !== ';') pos.i++;
            if (tokens[pos.i] === ';') pos.i++;
          }
          break;
        }

        // Execute body
        pos.i = bodyStart;
        if (tokens[pos.i] === '{') {
          await execBlock(tokens, pos, env);
        } else {
          await execStatement(tokens, pos, env);
        }
        const afterBody = pos.i;

        // Execute step
        pos.i = stepStart;
        // Parse step expression (simplified: handle i++, i--, i += expr, assignment)
        execStepExpr(tokens, pos, env);
        // Skip to after ')'
        while (pos.i < tokens.length && tokens[pos.i] !== ')') pos.i++;
        if (tokens[pos.i] === ')') pos.i++;

        loopCount++;
      }
      return;
    }

    // While loop
    if (t === 'while') {
      pos.i++; // skip 'while'
      if (tokens[pos.i] === '(') pos.i++;
      const condStart = pos.i;
      let loopCount = 0;
      while (loopCount < 500 && !signal.aborted) {
        pos.i = condStart;
        const cond = evalExpr(tokens, pos, env);
        if (tokens[pos.i] === ')') pos.i++;
        const bodyStart = pos.i;
        if (!cond) {
          skipBlock(tokens, pos);
          break;
        }
        pos.i = bodyStart;
        if (tokens[pos.i] === '{') {
          await execBlock(tokens, pos, env);
        } else {
          await execStatement(tokens, pos, env);
        }
        loopCount++;
      }
      return;
    }

    // If/else
    if (t === 'if') {
      pos.i++; // skip 'if'
      if (tokens[pos.i] === '(') pos.i++;
      const cond = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;

      if (cond) {
        if (tokens[pos.i] === '{') {
          await execBlock(tokens, pos, env);
        } else {
          await execStatement(tokens, pos, env);
        }
        // Skip else if present
        if (tokens[pos.i] === 'else') {
          pos.i++;
          skipBlock(tokens, pos);
        }
      } else {
        // Skip if body
        skipBlock(tokens, pos);
        // Execute else if present
        if (tokens[pos.i] === 'else') {
          pos.i++;
          if (tokens[pos.i] === 'if') {
            await execStatement(tokens, pos, env); // else if
          } else if (tokens[pos.i] === '{') {
            await execBlock(tokens, pos, env);
          } else {
            await execStatement(tokens, pos, env);
          }
        }
      }
      return;
    }

    // Built-in calls
    if (t === 'analogWrite' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const pin = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ',') pos.i++;
      let val = Math.trunc(evalExpr(tokens, pos, env));
      if (val < 0) val = 0;
      if (val > 255) val = 255;
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      // Notify motor callback for robot mode
      onMotor(pin, val, true);
      const idx = leds.findIndex(l => l.pin === pin);
      if (idx >= 0) { leds[idx].brightness = val; flushLeds(); }
      return;
    }

    if (t === 'digitalWrite' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const pin = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ',') pos.i++;
      const val = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      // Notify motor callback for robot mode
      onMotor(pin, val, false);
      const idx = leds.findIndex(l => l.pin === pin);
      if (idx >= 0) { leds[idx].brightness = val ? 255 : 0; flushLeds(); }
      return;
    }

    if (t === 'pinMode' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      evalExpr(tokens, pos, env); // pin
      if (tokens[pos.i] === ',') pos.i++;
      evalExpr(tokens, pos, env); // mode
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      return;
    }

    // tone(pin, frequency) or tone(pin, frequency, duration)
    if (t === 'tone' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      evalExpr(tokens, pos, env); // pin (ignored, we just play the tone)
      if (tokens[pos.i] === ',') pos.i++;
      const freq = Math.trunc(evalExpr(tokens, pos, env));
      let dur = 0;
      if (tokens[pos.i] === ',') {
        pos.i++;
        dur = Math.trunc(evalExpr(tokens, pos, env));
      }
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      onTone(freq, dur);
      return;
    }

    // noTone(pin)
    if (t === 'noTone' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      evalExpr(tokens, pos, env); // pin (ignored)
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      onTone(0, 0);
      return;
    }

    if (t === 'delay' && tokens[pos.i + 1] === '(') {
      pos.i += 2;
      const ms = Math.trunc(evalExpr(tokens, pos, env));
      if (tokens[pos.i] === ')') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      tickMs += ms;
      await new Promise(r => setTimeout(r, Math.min(ms, 500) / 4));
      return;
    }

    // Serial.print / Serial.println
    if (t === 'Serial.print' || t === 'Serial.println' || t === 'Serial.begin') {
      const method = t.split('.')[1];
      pos.i++;
      if (method === 'begin') {
        // Skip Serial.begin(baud);
        if (tokens[pos.i] === '(') { let d = 1; pos.i++; while (d > 0 && pos.i < tokens.length) { if (tokens[pos.i] === '(') d++; if (tokens[pos.i] === ')') d--; pos.i++; } }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
      if (tokens[pos.i] === '(') {
        pos.i++;
        if (tokens[pos.i] === ')') {
          // println() with no args
          pos.i++;
          serialOut('', method === 'println');
        } else if (tokens[pos.i]?.startsWith('"')) {
          const s = tokens[pos.i].slice(1, -1);
          pos.i++;
          if (tokens[pos.i] === ')') pos.i++;
          serialOut(s, method === 'println');
        } else {
          const v = evalExpr(tokens, pos, env);
          if (tokens[pos.i] === ')') pos.i++;
          serialOut(String(Math.trunc(v)), method === 'println');
        }
      }
      if (tokens[pos.i] === ';') pos.i++;
      return;
    }

    // Assignment: name = expr; or name[expr] = expr; or name op= expr;
    if (/^[a-zA-Z_]/.test(t) && pos.i + 1 < tokens.length) {
      const name = t;
      pos.i++;

      // Array element assignment
      if (tokens[pos.i] === '[') {
        pos.i++;
        const idx = Math.trunc(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ']') pos.i++;
        const op = tokens[pos.i]; pos.i++;
        if (!env.arrays[name]) env.arrays[name] = [];
        const arr = env.arrays[name];
        while (arr.length <= idx) arr.push(0);
        if (op === '=') {
          arr[idx] = Math.trunc(evalExpr(tokens, pos, env));
        } else if (op === '+=') {
          arr[idx] += Math.trunc(evalExpr(tokens, pos, env));
        } else if (op === '-=') {
          arr[idx] -= Math.trunc(evalExpr(tokens, pos, env));
        }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }

      const op = tokens[pos.i];
      if (op === '=') {
        pos.i++;
        env.vars[name] = Math.trunc(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
      if (op === '+=') { pos.i++; env.vars[name] = (env.vars[name] || 0) + Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '-=') { pos.i++; env.vars[name] = (env.vars[name] || 0) - Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '*=') { pos.i++; env.vars[name] = (env.vars[name] || 0) * Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '/=') { pos.i++; const d = Math.trunc(evalExpr(tokens, pos, env)); env.vars[name] = d ? Math.trunc((env.vars[name] || 0) / d) : 0; if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '%=') { pos.i++; const d = Math.trunc(evalExpr(tokens, pos, env)); env.vars[name] = d ? (env.vars[name] || 0) % d : 0; if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '++') { pos.i++; env.vars[name] = (env.vars[name] || 0) + 1; if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '--') { pos.i++; env.vars[name] = (env.vars[name] || 0) - 1; if (tokens[pos.i] === ';') pos.i++; return; }

      // Function call: name(args)
      if (op === '(') {
        if (env.funcs[name]) {
          pos.i++; // skip (
          const args: number[] = [];
          while (pos.i < tokens.length && tokens[pos.i] !== ')') {
            args.push(Math.trunc(evalExpr(tokens, pos, env)));
            if (tokens[pos.i] === ',') pos.i++;
          }
          if (tokens[pos.i] === ')') pos.i++;
          callUserFunc(name, args, env);
        } else {
          // Unknown function — skip past closing paren
          let depth = 1; pos.i++;
          while (pos.i < tokens.length && depth > 0) {
            if (tokens[pos.i] === '(') depth++;
            if (tokens[pos.i] === ')') depth--;
            pos.i++;
          }
        }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }

      // Unknown — skip to semicolon
      while (pos.i < tokens.length && tokens[pos.i] !== ';' && tokens[pos.i] !== '}') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
      return;
    }

    // Skip semicolons and braces
    if (t === ';' || t === '{' || t === '}') { pos.i++; return; }

    // Unknown — skip to next semicolon
    while (pos.i < tokens.length && tokens[pos.i] !== ';' && tokens[pos.i] !== '}') pos.i++;
    if (tokens[pos.i] === ';') pos.i++;
  }

  function execStepExpr(tokens: string[], pos: { i: number }, env: Env) {
    // Handle: i++, i--, i += expr, name = expr
    if (pos.i >= tokens.length) return;
    const name = tokens[pos.i];
    if (!/^[a-zA-Z_]/.test(name)) return;
    pos.i++;
    const op = tokens[pos.i];
    if (op === '++') { pos.i++; env.vars[name] = (env.vars[name] || 0) + 1; return; }
    if (op === '--') { pos.i++; env.vars[name] = (env.vars[name] || 0) - 1; return; }
    if (op === '+=') { pos.i++; env.vars[name] = (env.vars[name] || 0) + Math.trunc(evalExpr(tokens, pos, env)); return; }
    if (op === '-=') { pos.i++; env.vars[name] = (env.vars[name] || 0) - Math.trunc(evalExpr(tokens, pos, env)); return; }
    if (op === '=') { pos.i++; env.vars[name] = Math.trunc(evalExpr(tokens, pos, env)); return; }
  }

  function skipBlock(tokens: string[], pos: { i: number }) {
    if (tokens[pos.i] === '{') {
      let depth = 0;
      do {
        if (tokens[pos.i] === '{') depth++;
        if (tokens[pos.i] === '}') depth--;
        pos.i++;
      } while (depth > 0 && pos.i < tokens.length);
    } else {
      // Single statement
      while (pos.i < tokens.length && tokens[pos.i] !== ';') pos.i++;
      if (tokens[pos.i] === ';') pos.i++;
    }
  }

  // ── User-defined function call (synchronous — no delay support inside) ──
  function callUserFunc(name: string, args: number[], env: Env): number {
    const func = env.funcs[name];
    if (!func) return 0;
    // Create local scope with copies of parent vars + arrays
    const localEnv: Env = {
      vars: { ...env.vars },
      arrays: Object.fromEntries(Object.entries(env.arrays).map(([k, v]) => [k, [...v]])),
      funcs: env.funcs,
    };
    // Bind parameters
    for (let i = 0; i < func.params.length; i++) {
      localEnv.vars[func.params[i]] = args[i] ?? 0;
    }
    // Execute body tokens synchronously, looking for return
    const pos = { i: 0 };
    const bodyTokens = func.bodyTokens;
    if (bodyTokens[0] === '{') pos.i = 1;
    let returnVal = 0;
    while (pos.i < bodyTokens.length - 1) {
      // Check for return statement
      if (bodyTokens[pos.i] === 'return') {
        pos.i++;
        if (bodyTokens[pos.i] !== ';') {
          returnVal = Math.trunc(evalExpr(bodyTokens, pos, localEnv));
        }
        break;
      }
      // Execute statement synchronously (skip delay/analogWrite inside functions for simplicity)
      execStatementSync(bodyTokens, pos, localEnv);
    }
    return returnVal;
  }

  // Synchronous statement executor for function bodies (no async/delay)
  function execStatementSync(tokens: string[], pos: { i: number }, env: Env) {
    if (pos.i >= tokens.length) return;
    const t = tokens[pos.i];
    if (t === ';' || t === '{' || t === '}') { pos.i++; return; }
    if (t === 'void' || t === 'const' || t === 'unsigned' || t === 'long' || t === 'float' || t === 'double' || t === 'byte') {
      pos.i++; return execStatementSync(tokens, pos, env);
    }
    if (t === 'int' || t === 'char') {
      pos.i++;
      const name = tokens[pos.i]; pos.i++;
      if (tokens[pos.i] === '[') {
        pos.i++;
        if (tokens[pos.i] === ']') pos.i++; else { evalExpr(tokens, pos, env); if (tokens[pos.i] === ']') pos.i++; }
        if (tokens[pos.i] === '=') {
          pos.i++;
          if (tokens[pos.i] === '{') {
            pos.i++;
            const vals: number[] = [];
            while (pos.i < tokens.length && tokens[pos.i] !== '}') {
              vals.push(Math.trunc(evalExpr(tokens, pos, env)));
              if (tokens[pos.i] === ',') pos.i++;
            }
            if (tokens[pos.i] === '}') pos.i++;
            env.arrays[name] = vals;
          }
        }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
      if (tokens[pos.i] === '=') { pos.i++; env.vars[name] = Math.trunc(evalExpr(tokens, pos, env)); }
      else { env.vars[name] = 0; }
      if (tokens[pos.i] === ';') pos.i++;
      return;
    }
    if (t === 'if') {
      pos.i++;
      if (tokens[pos.i] === '(') pos.i++;
      const cond = evalExpr(tokens, pos, env);
      if (tokens[pos.i] === ')') pos.i++;
      if (cond) {
        if (tokens[pos.i] === '{') {
          pos.i++;
          while (pos.i < tokens.length && tokens[pos.i] !== '}') execStatementSync(tokens, pos, env);
          if (tokens[pos.i] === '}') pos.i++;
        } else { execStatementSync(tokens, pos, env); }
        if (tokens[pos.i] === 'else') { pos.i++; skipBlock(tokens, pos); }
      } else {
        skipBlock(tokens, pos);
        if (tokens[pos.i] === 'else') {
          pos.i++;
          if (tokens[pos.i] === '{') {
            pos.i++;
            while (pos.i < tokens.length && tokens[pos.i] !== '}') execStatementSync(tokens, pos, env);
            if (tokens[pos.i] === '}') pos.i++;
          } else { execStatementSync(tokens, pos, env); }
        }
      }
      return;
    }
    if (t === 'for') {
      pos.i++;
      if (tokens[pos.i] === '(') pos.i++;
      execStatementSync(tokens, pos, env);
      const condStart = pos.i;
      let loops = 0;
      while (loops < 500) {
        pos.i = condStart;
        const cond = evalExpr(tokens, pos, env);
        if (tokens[pos.i] === ';') pos.i++;
        const stepStart = pos.i;
        let pd = 0;
        while (pos.i < tokens.length) {
          if (tokens[pos.i] === '(') pd++;
          else if (tokens[pos.i] === ')') { if (pd === 0) { pos.i++; break; } pd--; }
          pos.i++;
        }
        const bodyStart = pos.i;
        if (!cond) { skipBlock(tokens, pos); break; }
        pos.i = bodyStart;
        if (tokens[pos.i] === '{') {
          pos.i++;
          while (pos.i < tokens.length && tokens[pos.i] !== '}') execStatementSync(tokens, pos, env);
          if (tokens[pos.i] === '}') pos.i++;
        } else { execStatementSync(tokens, pos, env); }
        pos.i = stepStart;
        execStepExpr(tokens, pos, env);
        while (pos.i < tokens.length && tokens[pos.i] !== ')') pos.i++;
        if (tokens[pos.i] === ')') pos.i++;
        loops++;
      }
      return;
    }
    if (t === 'return') { pos.i++; return; } // handled by caller
    // Assignment / function call
    if (/^[a-zA-Z_]/.test(t)) {
      const name = t; pos.i++;
      if (tokens[pos.i] === '[') {
        pos.i++;
        const idx = Math.trunc(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ']') pos.i++;
        const op = tokens[pos.i]; pos.i++;
        if (!env.arrays[name]) env.arrays[name] = [];
        const arr = env.arrays[name];
        while (arr.length <= idx) arr.push(0);
        if (op === '=') arr[idx] = Math.trunc(evalExpr(tokens, pos, env));
        else if (op === '+=') arr[idx] += Math.trunc(evalExpr(tokens, pos, env));
        else if (op === '-=') arr[idx] -= Math.trunc(evalExpr(tokens, pos, env));
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
      const op = tokens[pos.i];
      if (op === '=') { pos.i++; env.vars[name] = Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '+=') { pos.i++; env.vars[name] = (env.vars[name] || 0) + Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '-=') { pos.i++; env.vars[name] = (env.vars[name] || 0) - Math.trunc(evalExpr(tokens, pos, env)); if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '++') { pos.i++; env.vars[name] = (env.vars[name] || 0) + 1; if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '--') { pos.i++; env.vars[name] = (env.vars[name] || 0) - 1; if (tokens[pos.i] === ';') pos.i++; return; }
      if (op === '(') {
        let depth = 1; pos.i++;
        while (pos.i < tokens.length && depth > 0) { if (tokens[pos.i] === '(') depth++; if (tokens[pos.i] === ')') depth--; pos.i++; }
        if (tokens[pos.i] === ';') pos.i++;
        return;
      }
    }
    while (pos.i < tokens.length && tokens[pos.i] !== ';' && tokens[pos.i] !== '}') pos.i++;
    if (tokens[pos.i] === ';') pos.i++;
  }

  // ── Main run ──
  async function run(code: string) {
    const tokens = tokenize(code);
    const env: Env = { vars: {}, arrays: {}, funcs: {} };

    // Find and collect global declarations (before setup/loop)
    const pos = { i: 0 };

    // First pass: find function boundaries
    let setupStart = -1, setupEnd = -1, loopStart = -1, loopEnd = -1;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === 'void' && tokens[i + 1] === 'setup' && tokens[i + 2] === '(' && tokens[i + 3] === ')') {
        setupStart = i + 4; // skip to '{'
        if (tokens[setupStart] === '{') {
          let depth = 0;
          let j = setupStart;
          do { if (tokens[j] === '{') depth++; if (tokens[j] === '}') depth--; j++; } while (depth > 0 && j < tokens.length);
          setupEnd = j;
        }
      }
      if (tokens[i] === 'void' && tokens[i + 1] === 'loop' && tokens[i + 2] === '(' && tokens[i + 3] === ')') {
        loopStart = i + 4;
        if (tokens[loopStart] === '{') {
          let depth = 0;
          let j = loopStart;
          do { if (tokens[j] === '{') depth++; if (tokens[j] === '}') depth--; j++; } while (depth > 0 && j < tokens.length);
          loopEnd = j;
        }
      }
    }

    // Execute global declarations
    pos.i = 0;
    while (pos.i < tokens.length && !signal.aborted) {
      if (pos.i === setupStart - 4 || pos.i === loopStart - 4) {
        // Skip function body
        const end = pos.i === setupStart - 4 ? setupEnd : loopEnd;
        pos.i = end;
        continue;
      }
      // Detect user-defined function definitions and store them
      if ((tokens[pos.i] === 'void' || tokens[pos.i] === 'int') && /^[a-zA-Z_]/.test(tokens[pos.i + 1] || '')) {
        const retType = tokens[pos.i];
        const fname = tokens[pos.i + 1];
        if (tokens[pos.i + 2] === '(' && fname !== 'setup' && fname !== 'loop') {
          // Parse parameter list
          let j = pos.i + 3;
          const params: string[] = [];
          while (j < tokens.length && tokens[j] !== ')') {
            // Skip type keywords
            if (tokens[j] === 'int' || tokens[j] === 'float' || tokens[j] === 'char' || tokens[j] === 'byte' || tokens[j] === 'long') { j++; continue; }
            if (tokens[j] === ',') { j++; continue; }
            if (/^[a-zA-Z_]/.test(tokens[j])) { params.push(tokens[j]); }
            j++;
          }
          if (tokens[j] === ')') j++;
          // Extract body tokens
          if (tokens[j] === '{') {
            const bodyStart = j;
            let depth = 0;
            do { if (tokens[j] === '{') depth++; if (tokens[j] === '}') depth--; j++; } while (depth > 0 && j < tokens.length);
            env.funcs[fname] = { params, bodyTokens: tokens.slice(bodyStart, j) };
          }
          pos.i = j;
          continue;
        }
      }
      if (pos.i >= tokens.length) break;
      await execStatement(tokens, pos, env);
    }

    // Execute setup()
    if (setupStart >= 0 && setupEnd > 0) {
      const setupTokens = tokens.slice(setupStart, setupEnd);
      const sp = { i: 0 };
      if (setupTokens[0] === '{') sp.i = 1;
      while (sp.i < setupTokens.length - 1 && !signal.aborted) {
        await execStatement(setupTokens, sp, env);
      }
    }

    // Execute loop() — max 30 iterations
    if (loopStart >= 0 && loopEnd > 0) {
      const loopTokens = tokens.slice(loopStart, loopEnd);
      for (let iter = 0; iter < 30 && !signal.aborted; iter++) {
        const lp = { i: 0 };
        if (loopTokens[0] === '{') lp.i = 1;
        while (lp.i < loopTokens.length - 1 && !signal.aborted) {
          await execStatement(loopTokens, lp, env);
        }
      }
    }
  }

  return { run };
}

// ── Robot Arena SVG component ──
function RobotArena({ robot }: { robot: RobotState }) {
  const sensorColor = robot.sensorDist > 80 ? '#22c55e' : robot.sensorDist > 40 ? '#eab308' : '#ef4444';
  const sensorConeLen = Math.min(robot.sensorDist, 100);
  const coneHalfAngle = 0.35; // ~20 degrees

  // Sensor cone points
  const cx = robot.x;
  const cy = robot.y;
  const ang = robot.angle;
  const p1x = cx + Math.cos(ang - coneHalfAngle) * sensorConeLen;
  const p1y = cy + Math.sin(ang - coneHalfAngle) * sensorConeLen;
  const p2x = cx + Math.cos(ang + coneHalfAngle) * sensorConeLen;
  const p2y = cy + Math.sin(ang + coneHalfAngle) * sensorConeLen;

  // Robot body corners (rotated rectangle)
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const hw = ROBOT_W / 2;
  const hh = ROBOT_H / 2;
  // Rectangle corners relative to center, then rotated
  // The robot faces along its angle, so "forward" = +angle direction
  // We orient the long axis (H) along the forward direction
  const corners = [
    { x: -hh, y: -hw },
    { x: -hh, y: hw },
    { x: hh, y: hw },
    { x: hh, y: -hw },
  ].map(c => ({
    x: cx + c.x * cos - c.y * sin,
    y: cy + c.x * sin + c.y * cos,
  }));

  // Nose triangle (front of robot)
  const noseTip = { x: cx + (hh + 6) * cos, y: cy + (hh + 6) * sin };
  const noseL = { x: cx + hh * cos - 5 * sin, y: cy + hh * sin + 5 * cos };
  const noseR = { x: cx + hh * cos + 5 * sin, y: cy + hh * sin - 5 * cos };

  return (
    <svg width={ARENA_SIZE} height={ARENA_SIZE} className="mx-auto" style={{ background: '#374151', borderRadius: 8 }}>
      {/* Grid lines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <line x1={(i + 1) * (ARENA_SIZE / 7)} y1={0} x2={(i + 1) * (ARENA_SIZE / 7)} y2={ARENA_SIZE} stroke="#4b5563" strokeWidth={0.5} />
          <line x1={0} y1={(i + 1) * (ARENA_SIZE / 7)} x2={ARENA_SIZE} y2={(i + 1) * (ARENA_SIZE / 7)} stroke="#4b5563" strokeWidth={0.5} />
        </g>
      ))}

      {/* Obstacles */}
      {OBSTACLES.map((ob, i) => (
        <rect key={i} x={ob.x} y={ob.y} width={ob.w} height={ob.h} fill="#6b7280" stroke="#9ca3af" strokeWidth={1} rx={2} />
      ))}

      {/* Trail */}
      {robot.trail.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={1.5} fill={`rgba(56, 189, 248, ${0.15 + (i / robot.trail.length) * 0.4})`} />
      ))}

      {/* Sensor cone */}
      <polygon
        points={`${cx},${cy} ${p1x},${p1y} ${p2x},${p2y}`}
        fill={sensorColor}
        fillOpacity={0.15}
        stroke={sensorColor}
        strokeWidth={0.5}
        strokeOpacity={0.4}
      />

      {/* Robot body */}
      <polygon
        points={corners.map(c => `${c.x},${c.y}`).join(' ')}
        fill={robot.collided ? '#ef4444' : '#3b82f6'}
        stroke={robot.collided ? '#fca5a5' : '#93c5fd'}
        strokeWidth={1.5}
      >
        {robot.collided && (
          <animate attributeName="fill" values="#ef4444;#fca5a5;#ef4444" dur="0.4s" repeatCount="indefinite" />
        )}
      </polygon>

      {/* Nose direction indicator */}
      <polygon
        points={`${noseTip.x},${noseTip.y} ${noseL.x},${noseL.y} ${noseR.x},${noseR.y}`}
        fill={robot.collided ? '#fca5a5' : '#60a5fa'}
      />

      {/* Collision flash */}
      {robot.collided && (
        <rect x={0} y={0} width={ARENA_SIZE} height={ARENA_SIZE} fill="#ef4444" fillOpacity={0.08} rx={8}>
          <animate attributeName="fill-opacity" values="0.08;0.02;0.08" dur="0.6s" repeatCount="indefinite" />
        </rect>
      )}

      {/* Sensor distance label */}
      <text x={ARENA_SIZE - 5} y={15} textAnchor="end" fill="#9ca3af" fontSize={10} fontFamily="monospace">
        Sensor: {Math.round(robot.sensorDist)}cm
      </text>
    </svg>
  );
}

// ── Buzzer visual component ──
// ── Sonar Display ──────────────────────────────────────────

function SonarDisplay({ serialOutput }: { serialOutput: string }) {
  // Parse the last CSV line: ms,raw,filtered,zone,beep_ms
  const lines = serialOutput.trim().split('\n').filter(l => l.includes(','));
  const lastLine = lines[lines.length - 1] || '';
  const parts = lastLine.split(',');

  const raw = parseInt(parts[1]) || 0;
  const filtered = parseInt(parts[2]) || 0;
  const zone = (parts[3] || '').trim();
  const isClose = zone === 'CLOSE';
  const isMedium = zone === 'MEDIUM';
  const isFar = zone === 'FAR';

  // Build history for the radar sweep (last 30 readings)
  const history: number[] = [];
  const recentLines = lines.slice(-30);
  for (const l of recentLines) {
    const p = l.split(',');
    const f = parseInt(p[2]);
    if (!isNaN(f)) history.push(f);
  }

  const maxDist = 350;
  const W = 280, H = 160;
  const cx = W / 2, cy = H - 10;
  const maxR = 140;

  // Map distance to radius (closer = smaller radius on radar)
  const distToR = (d: number) => Math.min(maxR, (d / maxDist) * maxR);

  const zoneColor = isClose ? '#ef4444' : isMedium ? '#f59e0b' : isFar ? '#22c55e' : '#6b7280';
  const zoneLabel = isClose ? 'CLOSE' : isMedium ? 'MEDIUM' : isFar ? 'FAR' : '—';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Radar arc display */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[280px]">
        {/* Background arcs for zones */}
        <path d={`M ${cx - maxR} ${cy} A ${maxR} ${maxR} 0 0 1 ${cx + maxR} ${cy}`}
          fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2,3" />
        <path d={`M ${cx - distToR(100)} ${cy} A ${distToR(100)} ${distToR(100)} 0 0 1 ${cx + distToR(100)} ${cy}`}
          fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,3" />
        <path d={`M ${cx - distToR(30)} ${cy} A ${distToR(30)} ${distToR(30)} 0 0 1 ${cx + distToR(30)} ${cy}`}
          fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,3" />

        {/* Zone labels */}
        <text x={cx} y={cy - maxR + 14} fontSize="8" fill="#22c55e" textAnchor="middle" opacity="0.6">FAR</text>
        <text x={cx} y={cy - distToR(100) + 14} fontSize="8" fill="#f59e0b" textAnchor="middle" opacity="0.6">MED</text>
        <text x={cx} y={cy - distToR(30) + 14} fontSize="8" fill="#ef4444" textAnchor="middle" opacity="0.6">CLOSE</text>

        {/* Distance rings */}
        {[50, 100, 150, 200, 250, 300].map(d => {
          const r = distToR(d);
          return r < maxR ? (
            <g key={d}>
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
              <text x={cx + r + 3} y={cy - 2} fontSize="7" fill="#6b7280" opacity="0.5">{d}</text>
            </g>
          ) : null;
        })}

        {/* History blips (fading trail) */}
        {history.map((d, i) => {
          const r = distToR(d);
          const angle = -Math.PI / 2 + ((i - history.length / 2) / history.length) * 0.8;
          const bx = cx + r * Math.cos(angle);
          const by = cy + r * Math.sin(angle);
          const opacity = 0.1 + (i / history.length) * 0.6;
          return <circle key={i} cx={bx} cy={by} r="2" fill={zoneColor} opacity={opacity} />;
        })}

        {/* Current object blip (pulsing) */}
        {filtered > 0 && (
          <g>
            <circle cx={cx} cy={cy - distToR(filtered)} r="5" fill={zoneColor} opacity="0.8">
              <animate attributeName="r" values="4;7;4" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy={cy - distToR(filtered)} r="3" fill={zoneColor} />
          </g>
        )}

        {/* Sensor origin */}
        <circle cx={cx} cy={cy} r="4" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5" />
        <text x={cx} y={cy + 12} fontSize="7" fill="#60a5fa" textAnchor="middle">SENSOR</text>
      </svg>

      {/* Distance readout */}
      <div className="flex items-center gap-4 text-center">
        <div>
          <div className="text-2xl font-bold font-mono" style={{ color: zoneColor }}>
            {filtered > 0 ? `${filtered} cm` : '—'}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Filtered distance</div>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div>
          <div className="text-lg font-bold font-mono" style={{ color: zoneColor }}>
            {zoneLabel}
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Zone</div>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div>
          <div className="text-sm font-mono text-gray-400">{raw > 0 ? `${raw} cm` : '—'}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Raw</div>
        </div>
      </div>
    </div>
  );
}

function BuzzerVisual({ freq }: { freq: number }) {
  if (freq <= 0) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)' }}>
      <svg width={32} height={32} viewBox="0 0 40 40">
        <rect x={8} y={14} width={8} height={12} rx={1} fill="#a855f7" />
        <polygon points="16,14 26,8 26,32 16,26" fill="#a855f7" />
        <path d="M29,14 Q34,20 29,26" fill="none" stroke="#a855f7" strokeWidth={1.5} opacity={0.7}>
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M32,10 Q39,20 32,30" fill="none" stroke="#a855f7" strokeWidth={1.5} opacity={0.4}>
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="0.5s" repeatCount="indefinite" begin="0.15s" />
        </path>
      </svg>
      <span className="text-xs font-mono text-purple-400 font-semibold">{freq} Hz</span>
    </div>
  );
}

export default function ArduinoPlayground({
  starterCode,
  title = 'Arduino Simulator',
  ledCount = 3,
  description,
  robotMode = false,
  sonarMode = false,
}: ArduinoPlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [leds, setLeds] = useState<LedState[]>(Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 })));
  const [serialOutput, setSerialOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [buzzerFreq, setBuzzerFreq] = useState(0);
  const [robot, setRobot] = useState<RobotState>({
    x: 30, y: 150, angle: 0,
    leftSpeed: 0, rightSpeed: 0, leftDir: 1, rightDir: 1,
    trail: [], collided: false, sensorDist: 200,
  });

  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const toneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const robotRef = useRef<RobotState>(robot);

  // Keep robotRef in sync
  useEffect(() => { robotRef.current = robot; }, [robot]);

  // ── Audio helpers ──
  const stopAudio = useCallback(() => {
    if (toneTimerRef.current) { clearTimeout(toneTimerRef.current); toneTimerRef.current = null; }
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (_) { /* already stopped */ }
      oscillatorRef.current = null;
    }
    setBuzzerFreq(0);
  }, []);

  const handleTone = useCallback((frequency: number, duration: number) => {
    // Stop previous
    if (toneTimerRef.current) { clearTimeout(toneTimerRef.current); toneTimerRef.current = null; }
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch (_) { /* ok */ }
      oscillatorRef.current = null;
    }

    if (frequency <= 0) {
      setBuzzerFreq(0);
      return;
    }

    // Create audio context on first use
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Create gain node for volume control
    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = 0.15;
      gainRef.current.connect(ctx.destination);
    }

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = frequency;
    osc.connect(gainRef.current);
    osc.start();
    oscillatorRef.current = osc;
    setBuzzerFreq(frequency);

    if (duration > 0) {
      toneTimerRef.current = setTimeout(() => {
        try { osc.stop(); } catch (_) { /* ok */ }
        oscillatorRef.current = null;
        setBuzzerFreq(0);
        toneTimerRef.current = null;
      }, duration);
    }
  }, []);

  // ── Robot motor handler ──
  const handleMotor = useCallback((pin: number, value: number, isAnalog: boolean) => {
    if (!robotMode) return;
    setRobot(prev => {
      const next = { ...prev };
      if (isAnalog) {
        // analogWrite: speed
        if (pin === 5) next.leftSpeed = value;
        else if (pin === 6) next.rightSpeed = value;
      } else {
        // digitalWrite: direction
        if (pin === 7) next.leftDir = value;
        else if (pin === 8) next.rightDir = value;
      }
      // Compute movement (differential drive)
      const leftV = next.leftSpeed * (next.leftDir ? 1 : -1) / 255;
      const rightV = next.rightSpeed * (next.rightDir ? 1 : -1) / 255;
      const forward = (leftV + rightV) / 2;
      const turn = (rightV - leftV) * 0.08; // turning rate

      let newAngle = next.angle + turn;
      let newX = next.x + Math.cos(newAngle) * forward * 3;
      let newY = next.y + Math.sin(newAngle) * forward * 3;

      // Check collision
      const collided = checkCollision(newX, newY, OBSTACLES);
      if (collided && !next.collided) {
        // Stop at collision point
        next.collided = true;
        next.angle = newAngle;
      } else if (!collided) {
        next.x = newX;
        next.y = newY;
        next.angle = newAngle;
        next.collided = false;
        // Add trail point (limit trail length)
        const trail = [...next.trail, { x: newX, y: newY }];
        if (trail.length > 200) trail.shift();
        next.trail = trail;
      }

      // Update sensor distance
      next.sensorDist = computeSensorDistance(next.x, next.y, next.angle, OBSTACLES);
      return next;
    });
  }, [robotMode]);

  // ── Sensor readers for robot mode ──
  const getAnalogRead = useCallback((pin: number): number => {
    if (robotMode && (pin === 14)) { // A0 = 14
      // Map distance (0-200cm) to analog value (0-1023)
      const dist = robotRef.current.sensorDist;
      return Math.trunc((1 - dist / 200) * 1023);
    }
    // Default: random LDR-like
    return 200 + Math.floor(Math.random() * 600);
  }, [robotMode]);

  const getPulseIn = useCallback((pin: number, value: number): number => {
    if (robotMode) {
      // Simulate HC-SR04: distance_cm * 58.2 = pulse time in microseconds
      const dist = robotRef.current.sensorDist;
      return Math.trunc(dist * 58.2);
    }
    return Math.floor(Math.random() * 20000);
  }, [robotMode]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setRunning(false);
    setLeds(Array.from({ length: ledCount }, (_, i) => ({ pin: i + 2, brightness: 0 })));
    stopAudio();
  }, [ledCount, stopAudio]);

  const run = useCallback(() => {
    stop();
    // Reset robot on new run
    if (robotMode) {
      setRobot({
        x: 30, y: 150, angle: 0,
        leftSpeed: 0, rightSpeed: 0, leftDir: 1, rightDir: 1,
        trail: [], collided: false, sensorDist: 200,
      });
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setRunning(true);
    setSerialOutput('');

    const interp = createInterpreter(
      ledCount,
      (newLeds) => setLeds(newLeds),
      (text) => setSerialOutput(text),
      handleTone,
      handleMotor,
      getAnalogRead,
      getPulseIn,
      ac.signal,
    );

    interp.run(code).then(() => setRunning(false)).catch(() => setRunning(false));
  }, [code, ledCount, stop, handleTone, handleMotor, getAnalogRead, getPulseIn, robotMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [stopAudio]);

  const lineCount = code.split('\n').length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const s = ta.selectionStart, end = ta.selectionEnd;
      setCode(code.substring(0, s) + '  ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 2; }, 0);
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  };

  const [expanded, setExpanded] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.55);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded]);

  useEffect(() => {
    if (expanded) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const startX = e.clientX;
    const startRatio = splitRatio;
    const totalW = container.offsetWidth;
    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      setSplitRatio(Math.max(0.25, Math.min(0.75, startRatio + delta / totalW)));
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [splitRatio]);

  const wrapperClass = expanded
    ? 'fixed inset-0 z-50 flex flex-col bg-gray-900'
    : 'bg-gray-900 rounded-2xl overflow-hidden border border-gray-700';

  const hardwarePanel = (
    <>
      {/* Robot arena OR LED board */}
      {robotMode ? (
        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Robot Arena</p>
          <RobotArena robot={robot} />
          <div className="flex justify-between mt-2 text-xs font-mono text-gray-500">
            <span>L: {robot.leftSpeed}{robot.leftDir ? 'F' : 'R'}</span>
            <span>({Math.round(robot.x)}, {Math.round(robot.y)})</span>
            <span>R: {robot.rightSpeed}{robot.rightDir ? 'F' : 'R'}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-800/50 border-b border-gray-700">
          {/* Sonar display — shows radar, distance readout, zone */}
          {sonarMode && (
            <div className="mb-4">
              <SonarDisplay serialOutput={serialOutput} />
            </div>
          )}
          {/* LEDs + buzzer */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Breadboard</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {leds.map((led, i) => {
              // Color LEDs differently for sonar mode
              const ledColors = sonarMode
                ? ['239, 68, 68', '245, 158, 11', '34, 197, 94'] // red, yellow, green
                : ['34, 197, 94', '34, 197, 94', '34, 197, 94']; // all green
              const color = ledColors[i] || '34, 197, 94';
              return (
                <div key={i} className="text-center">
                  <div
                    className="w-8 h-12 rounded-full mx-auto transition-all duration-150"
                    style={{
                      backgroundColor: led.brightness > 0
                        ? `rgba(${color}, ${led.brightness / 255})`
                        : '#1f2937',
                      boxShadow: led.brightness > 0
                        ? `0 0 ${led.brightness / 10}px ${led.brightness / 20}px rgba(${color}, ${led.brightness / 300})`
                        : 'none',
                      border: '2px solid #374151',
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1.5 font-mono">
                    {sonarMode ? ['Close', 'Med', 'Far'][i] || `Pin ${led.pin}` : `Pin ${led.pin}`}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-center">
            <BuzzerVisual freq={buzzerFreq} />
          </div>
        </div>
      )}

      {/* Serial monitor */}
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Serial Monitor</p>
        <pre className="text-xs text-teal-400 font-mono whitespace-pre-wrap flex-1 overflow-y-auto bg-gray-950 rounded p-2">
          {serialOutput || '(waiting for output...)'}
        </pre>
      </div>
    </>
  );

  return (
    <div className={wrapperClass}>
      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-3 bg-gray-800 flex-shrink-0">
        <Cpu className="w-4 h-4 text-teal-400" />
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <span className="text-xs text-teal-400 bg-teal-900/30 px-2 py-0.5 rounded-full">Simulated</span>
        {robotMode && <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">Robot</span>}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => { setCode(starterCode); stop(); setSerialOutput(''); }}
            className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white text-xs transition-colors" title="Reset">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={running ? stop : run}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${running ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
          >
            {running ? <><Square className="w-4 h-4" />Stop</> : <><Play className="w-4 h-4" />Upload & Run</>}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            title={expanded ? 'Exit fullscreen (Esc)' : 'Expand to fullscreen'}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {expanded ? 'Exit' : 'Expand'}
          </button>
        </div>
      </div>

      {description && (
        <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex-shrink-0">
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}

      {/* Main content: code left, hardware right */}
      <div ref={containerRef} className={`flex flex-col lg:flex-row ${expanded ? 'flex-1 min-h-0' : ''}`}
        style={expanded ? {} : { height: robotMode ? 520 : 420 }}>
        {/* Code editor */}
        <div className="min-w-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-700"
          style={{ width: expanded ? `${splitRatio * 100}%` : undefined, flex: expanded ? 'none' : '1' }}>
          <div className="flex min-h-full">
            <div className="flex-shrink-0 pt-3 pb-3 pr-2 pl-3 select-none border-r border-gray-700" aria-hidden>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="leading-6 text-xs font-mono text-gray-600">{i + 1}</div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={lineCount}
                className="w-full bg-transparent text-gray-100 font-mono text-sm pl-3 pr-4 py-3 resize-none focus:outline-none leading-6"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>
        </div>

        {/* Draggable divider (only in fullscreen on desktop) */}
        {expanded && (
          <div
            onMouseDown={onDividerMouseDown}
            className="hidden lg:flex w-2 bg-gray-700 hover:bg-teal-600 cursor-col-resize items-center justify-center transition-colors group flex-shrink-0"
            title="Drag to resize"
          >
            <GripHorizontal className="w-3 h-4 text-gray-500 group-hover:text-white rotate-90" />
          </div>
        )}

        {/* Hardware panel */}
        <div className={`flex flex-col ${expanded ? 'flex-1 min-w-0' : 'w-full lg:w-80 flex-shrink-0'}`}>
          {hardwarePanel}
        </div>
      </div>
    </div>
  );
}
