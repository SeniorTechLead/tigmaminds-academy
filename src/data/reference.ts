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
  | 'economics' | 'engineering' | 'music-arts'
  | 'zoology' | 'botany' | 'neuroscience' | 'materials-science'
  | 'meteorology' | 'geology' | 'astronomy' | 'marine-science'
  | 'conservation' | 'health-medicine' | 'agriculture';

export interface InteractiveConfig {
  type: 'matching' | 'true-false' | 'slider' | 'did-you-know' | 'tone-player' | 'interval-player' | 'beat-machine' | 'harmonics-explorer' | 'gaussian-explorer' | 'contour-explainer' | 'logic-gate-simulator' | 'sql-playground' | 'ts-playground' | 'html-playground' | 'python-playground';
  props: Record<string, unknown>;
}

// ─── Practice Problems ─────────────────────────────────────

export interface PracticeProblemStep {
  label: string;        // "Step 1: Find the mean"
  content: string;      // Markdown — rendered with bold/code/tables
}

export type ProblemVisualType =
  | { kind: 'dice'; count: number; values?: number[] }
  | { kind: 'coins'; count: number; heads?: number }
  | { kind: 'cards'; drawn: string[] }                         // e.g. ["A♠","K♥","3♦"]
  | { kind: 'bar-chart'; labels: string[]; values: number[]; highlight?: number }
  | { kind: 'waiting'; avgMinutes: number; markTime?: number } // animated queue/timeline
  | { kind: 'scatter'; points: [number, number][]; showLine?: boolean }
  | { kind: 'distribution'; type: 'normal' | 'binomial' | 'poisson' | 'exponential' | 'chi-squared'; params: Record<string, number>; markX?: number; shadeFrom?: number; shadeTo?: number };

export interface PracticeProblem {
  id: string;
  difficulty: 1 | 2 | 3;
  question: string;                    // Markdown
  hint?: string;
  steps: PracticeProblemStep[];        // step-by-step hand solution
  answer: string;                      // display-friendly final answer
  visual?: ProblemVisualType;
  code?: string;                       // Python starter code (for code practice variant)
  codeSolution?: string;               // Python solution (revealed on request)
}

export interface PracticeSet {
  title: string;                       // "Practice — Mean, Median, Mode"
  problems: PracticeProblem[];
}

// ─── Reference Section ─────────────────────────────────────

export interface ReferenceSection {
  id?: string;                // unique section identifier (e.g., 'py-strings', 'algo-binary-search')
  title: string;
  beginnerContent: string;           // Level 0 — analogies, try-this, zero jargon
  intermediateContent?: string;      // Level 1 — formulas, calculations, code snippets
  advancedContent?: string;          // Level 2 — derivations, research, edge cases
  code?: string;
  diagram?: string;           // key into DiagramRegistry
  interactive?: InteractiveConfig;
  practice?: PracticeSet;            // optional practice problems (accessed via button, not inline)
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
  {
    key: 'zoology',
    label: 'Zoology',
    icon: '🐾',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    group: 'science',
  },
  {
    key: 'botany',
    label: 'Botany',
    icon: '🌺',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    group: 'science',
  },
  {
    key: 'neuroscience',
    label: 'Neuroscience',
    icon: '🧠',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    group: 'science',
  },
  {
    key: 'materials-science',
    label: 'Materials Science',
    icon: '🧵',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    group: 'science',
  },
  {
    key: 'meteorology',
    label: 'Meteorology',
    icon: '🌦️',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    group: 'science',
  },
  {
    key: 'geology',
    label: 'Geology',
    icon: '🪨',
    color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300',
    group: 'science',
  },
  {
    key: 'astronomy',
    label: 'Astronomy',
    icon: '🔭',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    group: 'science',
  },
  {
    key: 'marine-science',
    label: 'Marine Science',
    icon: '🐟',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    group: 'science',
  },
  {
    key: 'conservation',
    label: 'Conservation',
    icon: '🛡️',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    group: 'science',
  },
  {
    key: 'health-medicine',
    label: 'Health & Medicine',
    icon: '🏥',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    group: 'science',
  },
  {
    key: 'agriculture',
    label: 'Agriculture',
    icon: '🌾',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
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
