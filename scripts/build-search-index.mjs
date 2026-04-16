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

    // Extract explicit keywords array from guide
    const keywordsMatch = content.match(/keywords:\s*\[([^\]]*)\]/);
    const keywords = keywordsMatch
      ? keywordsMatch[1].match(/'([^']+)'/g)?.map(s => s.slice(1, -1)) || []
      : [];

    // Extract section titles (highest search value)
    const sectionTitles = [];
    const sectionTitleRegex = /title:\s*'([^']{10,})'/g;
    let tm;
    while ((tm = sectionTitleRegex.exec(content)) !== null) {
      sectionTitles.push(stripMarkdown(tm[1]));
    }

    // Extract bold terms — these are key concepts (**term**)
    const boldTerms = [];
    const boldRegex = /\*\*([^*]{3,80})\*\*/g;
    let bm;
    while ((bm = boldRegex.exec(content)) !== null) {
      boldTerms.push(bm[1].toLowerCase().trim());
    }

    // Extract ALL quoted strings (the body text)
    const textParts = [];
    const stringRegex = /'((?:[^'\\]|\\.)*)'/g;
    let match;
    while ((match = stringRegex.exec(content)) !== null) {
      const s = match[1];
      if (s.length < 10) continue;
      if (s.startsWith('./') || s.startsWith('../') || s.startsWith('http')) continue;
      textParts.push(stripMarkdown(s));
    }

    // Priority order: title, tagline, section titles, bold terms (always included),
    // then body text capped at 8KB
    const priority = [...new Set([title, tagline, ...keywords, ...sectionTitles, ...boldTerms])].join(' ');
    const body = [...new Set(textParts)].join(' ');
    const searchText = (priority + ' ' + body)
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
