#!/usr/bin/env node
/**
 * Static SVG overflow detector for diagram components.
 *
 * Parses each *.tsx in src/components/diagrams/, extracts the viewBox and all
 * <rect>/<text>/<line>/<circle> elements, and reports any whose declared coords
 * extend past the viewBox bounds.
 *
 * Not perfect: can't resolve dynamic JSX expressions, transforms, or computed
 * coords. But catches the common "I wrote x=334 but my viewBox is only 400 wide
 * and the text is 80px" class of bug.
 */
import { readdir, readFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIAGRAMS = join(__dirname, '..', 'src', 'components', 'diagrams');

// Approx px-per-char at SVG font size 1 unit. Actual varies by font.
const CHAR_W = 0.55;

async function check(file) {
  const src = await readFile(file, 'utf-8');
  const issues = [];

  const vbMatch = src.match(/viewBox=["'`]\s*([\d.\s-]+)["'`]/);
  if (!vbMatch) {
    const tmplMatch = src.match(/viewBox=\{`0 0 \$\{(\w+)\} \$\{(\w+)\}`\}/);
    if (tmplMatch) {
      const [_, wVar, hVar] = tmplMatch;
      const wMatch = src.match(new RegExp(`const ${wVar}\\s*=\\s*(\\d+)`));
      const hMatch = src.match(new RegExp(`const ${hVar}\\s*=\\s*(\\d+)`));
      if (!wMatch || !hMatch) return [];
      return checkAgainst(src, +wMatch[1], +hMatch[1], file);
    }
    return [];
  }

  const parts = vbMatch[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4) return [];
  const [vx, vy, vw, vh] = parts;
  return checkAgainst(src, vw, vh, file, vx, vy);
}

function checkAgainst(src, vw, vh, file, vx = 0, vy = 0) {
  const issues = [];
  const maxX = vx + vw;
  const maxY = vy + vh;

  // Build a set of byte offsets that are inside a <g transform="translate(...)"> block.
  // We don't try to resolve the transform; we just skip overflow checks on those elements
  // since their coords are relative and can't be evaluated statically.
  const transformedRanges = [];
  const gRe = /<g\s+[^>]*?transform=/g;
  let gm;
  while ((gm = gRe.exec(src)) !== null) {
    // find matching </g> — approximation: find next </g> after this open
    const closeIdx = src.indexOf('</g>', gm.index);
    if (closeIdx > gm.index) transformedRanges.push([gm.index, closeIdx]);
  }
  const insideTransform = (idx) => transformedRanges.some(([a, b]) => idx >= a && idx <= b);

  // <rect x=".." y=".." width=".." height=".."
  const rectRe = /<rect\s+[^>]*?x=["']?(-?\d+(?:\.\d+)?)["']?\s+[^>]*?y=["']?(-?\d+(?:\.\d+)?)["']?\s+[^>]*?width=["']?(\d+(?:\.\d+)?)["']?\s+[^>]*?height=["']?(\d+(?:\.\d+)?)["']?/g;
  let m;
  while ((m = rectRe.exec(src)) !== null) {
    if (insideTransform(m.index)) continue;
    const [, xs, ys, ws, hs] = m;
    const x = +xs, y = +ys, w = +ws, h = +hs;
    if (x + w > maxX + 0.5) issues.push(`  rect x=${x} w=${w} → right=${x + w} > viewBox right=${maxX}`);
    if (y + h > maxY + 0.5) issues.push(`  rect y=${y} h=${h} → bottom=${y + h} > viewBox bottom=${maxY}`);
  }

  // <text x=".." y=".." ... fontSize="N">content</text>
  const textRe = /<text\s+([^>]*?)>([^<]*)<\/text>/g;
  while ((m = textRe.exec(src)) !== null) {
    if (insideTransform(m.index)) continue;
    const [full, attrs, rawContent] = m;
    const content = rawContent.trim();
    if (!content || content.includes('{')) continue; // skip JSX expressions

    const xMatch = attrs.match(/\bx=["']?(-?\d+(?:\.\d+)?)["']?/);
    const yMatch = attrs.match(/\by=["']?(-?\d+(?:\.\d+)?)["']?/);
    const fsMatch = attrs.match(/fontSize=["']?(\d+(?:\.\d+)?)["']?/);
    const anchorMatch = attrs.match(/textAnchor=["'](\w+)["']/);
    if (!xMatch || !yMatch) continue;

    const x = +xMatch[1];
    const y = +yMatch[1];
    const fs = fsMatch ? +fsMatch[1] : 10;
    const anchor = anchorMatch ? anchorMatch[1] : 'start';

    // Count visible chars, not UTF-16 code units. Emoji ZWJ sequences and
    // surrogate pairs collapse to ~1 glyph each. Grapheme count is the closest
    // static approximation.
    const visibleChars = [...content].length;
    const widthPx = visibleChars * fs * CHAR_W;
    let left, right;
    if (anchor === 'middle') { left = x - widthPx / 2; right = x + widthPx / 2; }
    else if (anchor === 'end') { left = x - widthPx; right = x; }
    else { left = x; right = x + widthPx; }

    if (right > maxX + 2) issues.push(`  text "${content.slice(0, 40)}" at x=${x} anchor=${anchor} fs=${fs} → right≈${Math.round(right)} > viewBox right=${maxX}`);
    if (y > maxY + 2) issues.push(`  text "${content.slice(0, 40)}" at y=${y} > viewBox bottom=${maxY}`);
  }

  return issues.map(i => ({ file: basename(file), msg: i }));
}

async function checkEscapes(file) {
  // JSX text content (between > and <) shouldn't contain \uHHHH escape sequences —
  // they render as literal backslash-u-text in the browser. Unicode escapes only
  // work inside string literals (quotes or backticks), not JSX text nodes.
  const src = await readFile(file, 'utf-8');
  const issues = [];
  const textRe = /<text[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = textRe.exec(src)) !== null) {
    const inner = m.group ? m.group(1) : m[1];
    // Strip JSX expressions {...} with proper brace matching (nested braces and
    // template literals inside expressions contain } chars that a greedy regex misses).
    let stripped = '';
    let depth = 0;
    let inTemplate = false;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (depth === 0) {
        if (ch === '{') { depth = 1; continue; }
        stripped += ch;
      } else {
        if (ch === '`') inTemplate = !inTemplate;
        else if (!inTemplate) {
          if (ch === '{') depth++;
          else if (ch === '}') depth--;
        }
      }
    }
    if (/\\u[0-9a-fA-F]{4}/.test(stripped)) {
      issues.push(`  literal \\uXXXX escape in JSX text: "${stripped.slice(0, 50).trim()}..."`);
    }
  }
  return issues.map(msg => ({ file: basename(file), msg }));
}

async function main() {
  const files = (await readdir(DIAGRAMS)).filter(f => f.endsWith('.tsx'));
  const allIssues = [];
  for (const f of files) {
    const path = join(DIAGRAMS, f);
    allIssues.push(...await check(path));
    allIssues.push(...await checkEscapes(path));
  }

  const byFile = new Map();
  for (const i of allIssues) {
    if (!byFile.has(i.file)) byFile.set(i.file, []);
    byFile.get(i.file).push(i.msg);
  }

  const sorted = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
  console.log(`Scanned ${files.length} diagrams. ${byFile.size} have issues.\n`);
  for (const [file, msgs] of sorted) {
    console.log(`${file} (${msgs.length})`);
    for (const m of msgs.slice(0, 5)) console.log(m);
    if (msgs.length > 5) console.log(`  ... and ${msgs.length - 5} more`);
    console.log('');
  }
  console.log(`Total issues: ${allIssues.length}`);
  if (allIssues.length > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
