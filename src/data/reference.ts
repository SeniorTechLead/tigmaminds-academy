// ============================================================
// REFERENCE DATA MODEL
//
// Types, categories, and the combined references array.
// Actual entries live in sub-files (reference-coding.ts, etc.)
// and are re-exported from here.
// ============================================================

// ─── Types ───────────────────────────────────────────────────

export type ReferenceCategory =
  | 'language' | 'data-science' | 'database' | 'electronics' | 'math' | 'ai'
  | 'physics' | 'biology' | 'chemistry' | 'geography'
  | 'ecology' | 'earth-science'
  | 'economics' | 'engineering' | 'music-arts';

export interface InteractiveConfig {
  type: 'matching' | 'true-false' | 'slider' | 'did-you-know' | 'tone-player' | 'interval-player' | 'beat-machine' | 'harmonics-explorer' | 'gaussian-explorer' | 'contour-explainer' | 'logic-gate-simulator' | 'sql-playground';
  props: Record<string, unknown>;
}

export interface ReferenceSection {
  id?: string;                // unique section identifier (e.g., 'py-strings', 'algo-binary-search')
  title: string;
  beginnerContent: string;           // Level 0 — analogies, try-this, zero jargon
  intermediateContent?: string;      // Level 1 — formulas, calculations, code snippets
  advancedContent?: string;          // Level 2 — derivations, research, edge cases
  code?: string;
  diagram?: string;           // key into DiagramRegistry
  interactive?: InteractiveConfig;
}

export interface ReferenceGuide {
  slug: string;
  title: string;
  category: ReferenceCategory;
  icon: string;
  tagline: string;
  understand: ReferenceSection[];    // no-code, visual
  build?: ReferenceSection[];        // code + technical (optional for science entries)
  relatedStories?: string[];
}

// ─── Category metadata ───────────────────────────────────────

export type CategoryGroup = 'coding' | 'science';

export interface CategoryMeta {
  key: ReferenceCategory;
  label: string;
  icon: string;
  color: string;
  group: CategoryGroup;
}

export const REFERENCE_CATEGORIES: CategoryMeta[] = [
  // Science
  {
    key: 'physics',
    label: 'Physics',
    icon: '⚡',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'science',
  },
  {
    key: 'chemistry',
    label: 'Chemistry',
    icon: '⚗️',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    group: 'science',
  },
  {
    key: 'biology',
    label: 'Biology',
    icon: '🧬',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    group: 'science',
  },
  {
    key: 'ecology',
    label: 'Ecology',
    icon: '🌿',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    group: 'science',
  },
  {
    key: 'earth-science',
    label: 'Earth Science',
    icon: '🌍',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    group: 'science',
  },
  {
    key: 'geography',
    label: 'Geography',
    icon: '🗺️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'science',
  },
  {
    key: 'economics',
    label: 'Economics',
    icon: '📈',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    group: 'science',
  },
  {
    key: 'engineering',
    label: 'Engineering',
    icon: '🔧',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    group: 'science',
  },
  {
    key: 'music-arts',
    label: 'Music & Arts',
    icon: '🎵',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    group: 'science',
  },

  // Math & Computing
  {
    key: 'math',
    label: 'Mathematics',
    icon: '📐',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    group: 'coding',
  },
  {
    key: 'language',
    label: 'Programming',
    icon: '💻',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    group: 'coding',
  },
  {
    key: 'data-science',
    label: 'Data Science',
    icon: '📊',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'coding',
  },
  {
    key: 'database',
    label: 'Databases & SQL',
    icon: '🗄️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'coding',
  },
  {
    key: 'ai',
    label: 'AI & ML',
    icon: '🤖',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    group: 'coding',
  },
  {
    key: 'electronics',
    label: 'Electronics',
    icon: '⚙️',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    group: 'coding',
  },
];

// ─── Combined references array ───────────────────────────────

import { codingReferences } from './reference-coding';
import { scienceReferences } from './reference-science';

export const references: ReferenceGuide[] = [
  ...scienceReferences,
  ...codingReferences,
];
// cache-bust 1774467249
