/**
 * Build-time search index generator.
 * Reads all guide files from src/data/reference/ and extracts searchable text.
 * Output: src/data/reference-search-index.json
 *
 * Run: node scripts/build-search-index.mjs
 * Automatically runs via "prebuild" in package.json.
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REFERENCE_DIR = join(__dirname, '..', 'src', 'data', 'reference');
const OUTPUT = join(__dirname, '..', 'src', 'data', 'reference-search-index.json');

function stripMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[diagram:[^\]]+\]/g, '')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buildIndex() {
  const files = (await readdir(REFERENCE_DIR)).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  const index = [];

  for (const file of files) {
    const slug = file.replace('.ts', '');
    const content = await readFile(join(REFERENCE_DIR, file), 'utf-8');

    // Extract metadata
    const titleMatch = content.match(/title:\s*'([^']+)'/);
    const categoryMatch = content.match(/category:\s*'([^']+)'/);
    const iconMatch = content.match(/icon:\s*'([^']+)'/);
    const taglineMatch = content.match(/tagline:\s*(?:'([^']*)'|`([^`]*)`)/);

    const title = titleMatch?.[1] || slug;
    const category = categoryMatch?.[1] || '';
    const icon = iconMatch?.[1] || '';
    const tagline = taglineMatch?.[1] || taglineMatch?.[2] || '';

    // Extract ALL quoted strings (the actual content)
    const textParts = [];
    const stringRegex = /'((?:[^'\\]|\\.)*)'/g;
    let match;
    while ((match = stringRegex.exec(content)) !== null) {
      const s = match[1];
      // Skip short technical strings (import paths, prop names, etc.)
      if (s.length < 10) continue;
      // Skip things that look like code/imports
      if (s.startsWith('./') || s.startsWith('../') || s.startsWith('http')) continue;
      textParts.push(stripMarkdown(s));
    }

    // Deduplicate and join, cap at 8KB per guide
    const searchText = [...new Set([title, tagline, ...textParts])]
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .slice(0, 8000);

    index.push({ slug, title, category, icon, tagline, searchText });
  }

  await writeFile(OUTPUT, JSON.stringify(index));
  const sizeKB = (JSON.stringify(index).length / 1024).toFixed(0);
  console.log(`Search index built: ${index.length} guides, ${sizeKB}KB`);
}

buildIndex().catch(err => {
  console.error('Failed to build search index:', err);
  process.exit(1);
});
