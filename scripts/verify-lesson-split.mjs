import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data');
const OUT = path.join(DATA, 'lessons');

const SOURCES = [
  { file: 'lessons.ts', exportName: 'lessons' },
  { file: 'lessons-mythology.ts', exportName: 'mythologyLessons' },
  { file: 'lessons-history.ts', exportName: 'historyLessons' },
  { file: 'lessons-regional.ts', exportName: 'regionalLessons' },
  { file: 'lessons-ne-states.ts', exportName: 'neStatesLessons' },
];

function findArray(sf, exportName) {
  let lit = null;
  const visit = (node) => {
    if (lit) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === exportName &&
            decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
          lit = decl.initializer;
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return lit;
}

function getSlug(objLit, sf) {
  for (const prop of objLit.properties) {
    if (ts.isPropertyAssignment(prop) && prop.name &&
        ((ts.isIdentifier(prop.name) && prop.name.text === 'slug') ||
         (ts.isStringLiteral(prop.name) && prop.name.text === 'slug'))) {
      if (ts.isStringLiteral(prop.initializer)) return prop.initializer.text;
    }
  }
  return null;
}

// Parse a split file and return the object literal text for its `export const lesson = {...}`.
function splitObjText(slug) {
  const file = path.join(OUT, `${slug}.ts`);
  const text = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  let obj = null;
  const visit = (node) => {
    if (obj) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'lesson' &&
            decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
          obj = decl.initializer.getText(sf);
          return;
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return obj;
}

let originalCount = 0, mismatches = 0, missing = 0;
const seen = new Set();

for (const { file, exportName } of SOURCES) {
  const full = path.join(DATA, file);
  const text = fs.readFileSync(full, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const arr = findArray(sf, exportName);
  for (const el of arr.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    const slug = getSlug(el, sf);
    originalCount++;
    seen.add(slug);
    const origText = el.getText(sf);
    const splitText = splitObjText(slug);
    if (splitText == null) {
      console.error(`MISSING split file for slug: ${slug}`);
      missing++;
      continue;
    }
    if (origText !== splitText) {
      mismatches++;
      // Show first differing char region.
      let i = 0;
      while (i < origText.length && i < splitText.length && origText[i] === splitText[i]) i++;
      console.error(`MISMATCH ${slug} at char ${i}:`);
      console.error(`  orig:  ...${JSON.stringify(origText.slice(Math.max(0, i - 30), i + 30))}`);
      console.error(`  split: ...${JSON.stringify(splitText.slice(Math.max(0, i - 30), i + 30))}`);
    }
  }
}

// Registry coverage
const reg = fs.readFileSync(path.join(OUT, 'registry.ts'), 'utf8');
const regSlugs = [...reg.matchAll(/"([^"]+)": \(\) => import/g)].map((m) => m[1]);
const regSet = new Set(regSlugs);
const notInReg = [...seen].filter((s) => !regSet.has(s));
const extraInReg = regSlugs.filter((s) => !seen.has(s));

console.log(`\n=== VERIFICATION ===`);
console.log(`Original lessons:     ${originalCount}`);
console.log(`Split files matched:  ${originalCount - mismatches - missing}`);
console.log(`Mismatches:           ${mismatches}`);
console.log(`Missing split files:  ${missing}`);
console.log(`Registry entries:     ${regSlugs.length}`);
console.log(`In data but not reg:  ${notInReg.length} ${notInReg.slice(0, 5).join(', ')}`);
console.log(`In reg but not data:  ${extraInReg.length} ${extraInReg.slice(0, 5).join(', ')}`);

if (mismatches === 0 && missing === 0 && notInReg.length === 0 && extraInReg.length === 0) {
  console.log(`\n✅ PASS: every lesson's content is byte-identical and fully registered.`);
  process.exit(0);
} else {
  console.error(`\n❌ FAIL`);
  process.exit(1);
}
