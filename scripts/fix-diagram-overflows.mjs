#!/usr/bin/env node
/**
 * Auto-widen viewBox on diagrams with right-side overflows.
 *
 * For each file flagged by check-diagram-overflows, compute the max overflow
 * amount and extend the viewBox width by (overflow + 10px padding). Cap at
 * +160 to avoid grossly distorting aspect ratios; anything bigger needs manual.
 *
 * Similar logic for y-overflow (extend viewBox height), though that's rarer.
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIAGRAMS = join(__dirname, '..', 'src', 'components', 'diagrams');
const CHAR_W = 0.55;
const PAD = 10;
const MAX_GROW = 160;

function findOverflows(src, vw, vh, vx, vy) {
  const maxX = vx + vw;
  const maxY = vy + vh;
  let rightOverflow = 0;
  let bottomOverflow = 0;

  const transformedRanges = [];
  const gRe = /<g\s+[^>]*?transform=/g;
  let gm;
  while ((gm = gRe.exec(src)) !== null) {
    const closeIdx = src.indexOf('</g>', gm.index);
    if (closeIdx > gm.index) transformedRanges.push([gm.index, closeIdx]);
  }
  const insideTransform = (idx) => transformedRanges.some(([a, b]) => idx >= a && idx <= b);

  const rectRe = /<rect\s+[^>]*?x=["']?(-?\d+(?:\.\d+)?)["']?\s+[^>]*?y=["']?(-?\d+(?:\.\d+)?)["']?\s+[^>]*?width=["']?(\d+(?:\.\d+)?)["']?\s+[^>]*?height=["']?(\d+(?:\.\d+)?)["']?/g;
  let m;
  while ((m = rectRe.exec(src)) !== null) {
    if (insideTransform(m.index)) continue;
    const x = +m[1], y = +m[2], w = +m[3], h = +m[4];
    if (x + w > maxX) rightOverflow = Math.max(rightOverflow, x + w - maxX);
    if (y + h > maxY) bottomOverflow = Math.max(bottomOverflow, y + h - maxY);
  }

  const textRe = /<text\s+([^>]*?)>([^<]*)<\/text>/g;
  while ((m = textRe.exec(src)) !== null) {
    if (insideTransform(m.index)) continue;
    const [, attrs, rawContent] = m;
    const content = rawContent.trim();
    if (!content || content.includes('{')) continue;

    const xMatch = attrs.match(/\bx=["']?(-?\d+(?:\.\d+)?)["']?/);
    const yMatch = attrs.match(/\by=["']?(-?\d+(?:\.\d+)?)["']?/);
    const fsMatch = attrs.match(/fontSize=["']?(\d+(?:\.\d+)?)["']?/);
    const anchorMatch = attrs.match(/textAnchor=["'](\w+)["']/);
    if (!xMatch || !yMatch) continue;

    const x = +xMatch[1];
    const y = +yMatch[1];
    const fs = fsMatch ? +fsMatch[1] : 10;
    const anchor = anchorMatch ? anchorMatch[1] : 'start';
    const visibleChars = [...content].length;
    const widthPx = visibleChars * fs * CHAR_W;
    let right;
    if (anchor === 'middle') right = x + widthPx / 2;
    else if (anchor === 'end') right = x;
    else right = x + widthPx;

    if (right > maxX) rightOverflow = Math.max(rightOverflow, right - maxX);
    if (y > maxY) bottomOverflow = Math.max(bottomOverflow, y - maxY);
  }

  return { rightOverflow, bottomOverflow };
}

function readViewBox(src) {
  const literal = src.match(/viewBox=["'`]\s*([\d.\s-]+)["'`]/);
  if (literal) {
    const parts = literal[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4) {
      return { kind: 'literal', match: literal[0], parts };
    }
  }
  // viewBox={`0 0 ${W} ${H}`}
  const tmpl = src.match(/viewBox=\{`0 0 \$\{(\w+)\} \$\{(\w+)\}`\}/);
  if (tmpl) {
    const [, wVar, hVar] = tmpl;
    const wDecl = src.match(new RegExp(`(const ${wVar}\\s*=\\s*)(\\d+)`));
    const hDecl = src.match(new RegExp(`(const ${hVar}\\s*=\\s*)(\\d+)`));
    if (wDecl && hDecl) {
      return {
        kind: 'template',
        wDeclMatch: wDecl[0],
        wDeclPrefix: wDecl[1],
        wVal: +wDecl[2],
        hDeclMatch: hDecl[0],
        hDeclPrefix: hDecl[1],
        hVal: +hDecl[2],
        wVar, hVar,
      };
    }
  }
  return null;
}

async function fixFile(file) {
  const src = await readFile(file, 'utf-8');
  const vb = readViewBox(src);
  if (!vb) return { file: basename(file), status: 'no-viewbox' };

  let vx = 0, vy = 0, vw, vh;
  if (vb.kind === 'literal') {
    [vx, vy, vw, vh] = vb.parts;
  } else {
    vw = vb.wVal; vh = vb.hVal;
  }

  const { rightOverflow, bottomOverflow } = findOverflows(src, vw, vh, vx, vy);
  if (rightOverflow <= 0 && bottomOverflow <= 0) {
    return { file: basename(file), status: 'clean' };
  }

  const growW = rightOverflow > 0 ? Math.ceil(rightOverflow + PAD) : 0;
  const growH = bottomOverflow > 0 ? Math.ceil(bottomOverflow + PAD) : 0;

  if (growW > MAX_GROW || growH > MAX_GROW) {
    return { file: basename(file), status: 'needs-manual', growW, growH };
  }

  let newSrc;
  if (vb.kind === 'literal') {
    const newVB = `viewBox="${vx} ${vy} ${vw + growW} ${vh + growH}"`;
    newSrc = src.replace(vb.match, newVB);
  } else {
    newSrc = src;
    if (growW) {
      newSrc = newSrc.replace(vb.wDeclMatch, `${vb.wDeclPrefix}${vb.wVal + growW}`);
    }
    if (growH) {
      newSrc = newSrc.replace(vb.hDeclMatch, `${vb.hDeclPrefix}${vb.hVal + growH}`);
    }
  }

  await writeFile(file, newSrc);
  return { file: basename(file), status: 'fixed', growW, growH };
}

async function main() {
  const onlyList = process.argv.slice(2);
  const files = (await readdir(DIAGRAMS)).filter(f => f.endsWith('.tsx'));
  const targetFiles = onlyList.length > 0
    ? files.filter(f => onlyList.some(n => f.includes(n)))
    : files;

  const results = [];
  for (const f of targetFiles) {
    const r = await fixFile(join(DIAGRAMS, f));
    results.push(r);
  }

  const fixed = results.filter(r => r.status === 'fixed');
  const manual = results.filter(r => r.status === 'needs-manual');
  console.log(`Fixed: ${fixed.length}`);
  for (const r of fixed) console.log(`  ${r.file} +${r.growW}w +${r.growH}h`);
  if (manual.length) {
    console.log(`\nNeeds manual (overflow > ${MAX_GROW}):`);
    for (const r of manual) console.log(`  ${r.file} wants +${r.growW}w +${r.growH}h`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
