/**
 * build-playground-meta.mjs
 *
 * Reads playground-problems.ts (the monolith), extracts lightweight metadata
 * for every problem, and writes src/data/playground-meta.ts.
 *
 * Run: node scripts/build-playground-meta.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'src/data/playground-problems.ts');
const OUT = resolve(ROOT, 'src/data/playground-meta.ts');

const source = readFileSync(SRC, 'utf-8');

// Extract the problems array — it starts at "export const problems: Problem[] = ["
const arrStart = source.indexOf('export const problems: Problem[] = [');
if (arrStart === -1) {
  console.error('Could not find problems array in playground-problems.ts');
  process.exit(1);
}

// We need to parse each problem object. Since this is TS with template literals
// and nested arrays, we use a brace-matching approach rather than regex.
const code = source.slice(arrStart);

// Find all top-level objects inside the array
function extractTopLevelObjects(str) {
  // Find the opening '[' of the array
  let start = str.indexOf('[');
  if (start === -1) return [];

  const objects = [];
  let depth = 0;
  let objStart = -1;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;
  let templateDepth = 0;
  let escaped = false;

  for (let i = start + 1; i < str.length; i++) {
    const ch = str[i];

    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }

    if (inTemplate) {
      if (ch === '`') { inTemplate = false; continue; }
      if (ch === '$' && str[i + 1] === '{') { templateDepth++; }
      if (ch === '}' && templateDepth > 0) { templateDepth--; }
      continue;
    }

    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === "'" || ch === '"') { inString = true; stringChar = ch; continue; }
    if (ch === '`') { inTemplate = true; templateDepth = 0; continue; }

    // Skip line comments
    if (ch === '/' && str[i + 1] === '/') {
      const nl = str.indexOf('\n', i);
      if (nl !== -1) i = nl;
      continue;
    }

    if (ch === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart !== -1) {
        objects.push(str.slice(objStart, i + 1));
        objStart = -1;
      }
    }
  }

  return objects;
}

function extractField(obj, fieldName) {
  // Match field: 'value' or field: "value" — handles escaped quotes inside
  const reSingle = new RegExp(`${fieldName}:\\s*'((?:[^'\\\\]|\\\\.)*)'`);
  const reDouble = new RegExp(`${fieldName}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  let m = obj.match(reSingle);
  if (m) return m[1].replace(/\\'/g, "'");
  m = obj.match(reDouble);
  if (m) return m[1].replace(/\\"/g, '"');
  return null;
}

function extractNumericField(obj, fieldName) {
  const re = new RegExp(`${fieldName}:\\s*(\\d+)`);
  const m = obj.match(re);
  return m ? parseInt(m[1], 10) : null;
}

function extractDescription(obj) {
  // description can be a single-line or multi-line string with escaped quotes
  const reSingle = /description:\s*'((?:[^'\\]|\\.)*)'/;
  const reDouble = /description:\s*"((?:[^"\\]|\\.)*)"/;
  const reTemplate = /description:\s*`((?:[^`\\]|\\.)*)`/;

  let m = obj.match(reSingle);
  if (m) return m[1].replace(/\\'/g, "'").replace(/\\n/g, '\n');
  m = obj.match(reDouble);
  if (m) return m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
  m = obj.match(reTemplate);
  if (m) return m[1];
  return '';
}

// Count tiers and extract tier names from a problem object string
function extractTierInfo(obj) {
  const tierNameRe = /tierName:\s*'([^']*)'/g;
  const names = [];
  let m;
  while ((m = tierNameRe.exec(obj)) !== null) {
    names.push(m[1]);
  }
  // Also try double-quoted tierName
  const tierNameRe2 = /tierName:\s*"([^"]*)"/g;
  while ((m = tierNameRe2.exec(obj)) !== null) {
    names.push(m[1]);
  }
  return { count: names.length, names };
}

const objectStrings = extractTopLevelObjects(code);
console.log(`Found ${objectStrings.length} problem objects`);

const metas = [];

for (const obj of objectStrings) {
  const id = extractNumericField(obj, 'id');
  const slug = extractField(obj, 'slug');
  const title = extractField(obj, 'title');
  const story = extractField(obj, 'story');
  const storySlug = extractField(obj, 'storySlug');
  const description = extractDescription(obj);
  const difficulty = extractField(obj, 'difficulty');
  const topic = extractField(obj, 'topic');
  const language = extractField(obj, 'language') || 'python';
  const tierInfo = extractTierInfo(obj);

  if (id == null || !slug || !title) {
    console.warn(`Skipping malformed problem object (id=${id}, slug=${slug})`);
    continue;
  }

  metas.push({ id, slug, title, description, story, storySlug, difficulty, topic, language, tierCount: tierInfo.count, tierNames: tierInfo.names });
}

console.log(`Extracted ${metas.length} problem metas`);

// Generate the output file
const escStr = (s) => s ? s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') : '';

let out = `// Auto-generated by scripts/build-playground-meta.mjs — do not edit by hand
export interface ProblemMeta {
  id: number;
  slug: string;
  title: string;
  description: string;
  story: string;
  storySlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  language: string;
  tierCount: number;
  tierNames: string[];
}

export const problemMeta: ProblemMeta[] = [\n`;

for (const m of metas) {
  const tierNamesStr = m.tierNames.map(n => `'${escStr(n)}'`).join(', ');
  out += `  { id: ${m.id}, slug: '${escStr(m.slug)}', title: '${escStr(m.title)}', description: '${escStr(m.description)}', story: '${escStr(m.story)}', storySlug: '${escStr(m.storySlug)}', difficulty: '${m.difficulty}', topic: '${m.topic}', language: '${m.language}', tierCount: ${m.tierCount}, tierNames: [${tierNamesStr}] },\n`;
}

out += `];\n`;

writeFileSync(OUT, out, 'utf-8');
console.log(`Wrote ${OUT} (${metas.length} entries)`);
