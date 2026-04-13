import type { LucideIcon } from 'lucide-react';

// Legacy flat types — kept for backward compatibility during migration
export type Skill = 'Python' | 'Web Development' | 'Arduino & Electronics' | 'Data Visualization' | 'Data Analysis' | 'Machine Learning' | 'Scientific Modeling' | 'SQL & Databases';
export type Track = 'Programming' | 'AI & Data' | 'Robotics & Electronics' | 'Web Development' | 'Science & Lab';

// Hierarchical skill taxonomy (see docs/skill-taxonomy.md)
export type Discipline = 'Programming' | 'Data Science' | 'AI & Machine Learning' | 'Scientific Modeling' | 'Electronics & Hardware';

export interface SkillTag {
  discipline: Discipline;                 // Level 1: what field
  skill: string;                          // Level 2: what you learn to do
  tools?: string[];                       // Level 3: what technology you use
  application?: string;                   // Level 4: what domain (optional)
}
export type Subject =
  | 'Biology'
  | 'Physics'
  | 'Chemistry'
  | 'Computer Science'
  | 'Engineering'
  | 'Mathematics'
  | 'Geography'
  | 'Ecology'
  | 'Economics'
  | 'Music & Arts'
  | 'Materials Science'
  | 'Environmental Science'
  | 'Agriculture'
  | 'Zoology'
  | 'Botany'
  | 'Conservation'
  | 'Neuroscience'
  | 'Meteorology'
  | 'Geology'
  | 'Astronomy'
  | 'Health & Medicine'
  | 'Marine Science'
  | 'History'
  | 'Robotics';

export type Tradition = 'Northeast India' | 'Hindu' | 'Buddhist' | 'Christian' | 'Islamic' | 'World History' | 'Bengali' | 'Telugu' | 'Tamil';

export interface LessonOrigin {
  state?: string;      // e.g. 'Assam', 'West Bengal', 'Tamil Nadu', 'Telangana'
  country?: string;    // e.g. 'India', 'Egypt', 'Greece'
  religion?: string;   // e.g. 'Hindu', 'Buddhist', 'Christian', 'Islamic'
  label: string;       // display label: 'Assam', 'West Bengal', 'World History'
}

const TRADITION_TO_ORIGIN: Record<Tradition, LessonOrigin> = {
  'Northeast India': { state: 'Assam', country: 'India', label: 'Assam' },
  'Hindu': { country: 'India', religion: 'Hindu', label: 'Hinduism' },
  'Buddhist': { country: 'India', religion: 'Buddhist', label: 'Buddhism' },
  'Christian': { religion: 'Christian', label: 'Christianity' },
  'Islamic': { religion: 'Islamic', label: 'Islam' },
  'World History': { label: 'World History' },
  'Bengali': { state: 'West Bengal', country: 'India', label: 'West Bengal' },
  'Telugu': { country: 'India', label: 'South India' },  // fallback only — stories should use per-lesson origin
  'Tamil': { state: 'Tamil Nadu', country: 'India', label: 'Tamil Nadu' },
};

// Per-slug overrides for stories set in states other than the tradition default
const SLUG_ORIGIN_OVERRIDES: Record<string, LessonOrigin> = {
  // NE stories not in Assam
  'snow-leopards-promise': { state: 'Sikkim', country: 'India', label: 'Sikkim' },
  'map-makers-granddaughter': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'bridge-that-grew': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'monsoon-home': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'pitcher-plant': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'wild-orchids-clouds': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'postman-hills': { state: 'Meghalaya', country: 'India', label: 'Meghalaya' },
  'bamboo-flute-of-nagaland': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'seed-keeper-of-nagaland': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'the-hornbills-crown': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'dancing-deer-of-loktak-lake': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'secret-garden-loktak': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'red-panda-mask': { state: 'Arunachal Pradesh', country: 'India', label: 'Arunachal Pradesh' },
  'brave-mithun-arunachal': { state: 'Arunachal Pradesh', country: 'India', label: 'Arunachal Pradesh' },
  'how-orchid-got-colors': { state: 'Arunachal Pradesh', country: 'India', label: 'Arunachal Pradesh' },
  'stars-of-ziro': { state: 'Arunachal Pradesh', country: 'India', label: 'Arunachal Pradesh' },
  'stars-ziro-valley': { state: 'Arunachal Pradesh', country: 'India', label: 'Arunachal Pradesh' },
  // Mizoram
  'cheraw-bamboo-dance': { state: 'Mizoram', country: 'India', label: 'Mizoram' },
  'mautam-bamboo-famine': { state: 'Mizoram', country: 'India', label: 'Mizoram' },
  'iron-smiths-lushai': { state: 'Mizoram', country: 'India', label: 'Mizoram' },
  'hawk-blue-mountain': { state: 'Mizoram', country: 'India', label: 'Mizoram' },
  'orchids-phawngpui': { state: 'Mizoram', country: 'India', label: 'Mizoram' },
  // Manipur
  'kangla-fort-manipur': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'thang-ta-manipur': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'ras-lila-manipur': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'ima-keithel-market': { state: 'Manipur', country: 'India', label: 'Manipur' },
  'polo-manipur': { state: 'Manipur', country: 'India', label: 'Manipur' },
  // Tripura
  'neermahal-water-palace': { state: 'Tripura', country: 'India', label: 'Tripura' },
  'fourteen-gods-tripura': { state: 'Tripura', country: 'India', label: 'Tripura' },
  'rubber-tripura': { state: 'Tripura', country: 'India', label: 'Tripura' },
  'cane-weavers-tripura': { state: 'Tripura', country: 'India', label: 'Tripura' },
  'tripura-sundari-temple': { state: 'Tripura', country: 'India', label: 'Tripura' },
  // Nagaland
  'dzukou-valley-lily': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'stone-pulling-nagaland': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'hornbill-flight-nagaland': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  'naga-dao-metallurgy': { state: 'Nagaland', country: 'India', label: 'Nagaland' },
  // Sikkim
  'kanchenjunga-five-treasures': { state: 'Sikkim', country: 'India', label: 'Sikkim' },
  'red-panda-sikkim': { state: 'Sikkim', country: 'India', label: 'Sikkim' },
  'cardamom-hills-sikkim': { state: 'Sikkim', country: 'India', label: 'Sikkim' },
  'prayer-flags-sikkim': { state: 'Sikkim', country: 'India', label: 'Sikkim' },
};

export function getLessonOrigin(lesson: { slug?: string; tradition?: Tradition; origin?: LessonOrigin }): LessonOrigin {
  if (lesson.origin) return lesson.origin;
  if (lesson.slug && SLUG_ORIGIN_OVERRIDES[lesson.slug]) return SLUG_ORIGIN_OVERRIDES[lesson.slug];
  if (lesson.tradition) return TRADITION_TO_ORIGIN[lesson.tradition];
  return { country: 'India', label: 'India' };
}

export interface Lesson {
  id: number;
  slug: string;
  tradition?: Tradition;  // legacy — kept for backward compat
  origin?: LessonOrigin;
  story: { title: string; tagline: string; content: string };
  stem: {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    skills: string[];
    project: {
      title: string;
      description: string;
      outputDiagram?: string;
      steps: string[];
    };
  };
  illustration?: string;
  heroVideo?: string;
  track?: string;
  subjects?: Subject[];
  toolSkills?: Skill[];
  learningTracks?: Track[];
  skillTags?: SkillTag[];
  estimatedHours?: number;
  playground?: string;
  level0?: {
    concepts: { title: string; paragraphs: string[]; diagram?: string; keyIdea: string; checkYourself?: string; checkAnswer?: string }[];
    vocabulary?: [string, string][];
    trueFalse?: { statement: string; isTrue: boolean; explanation: string }[];
    facts?: string[];
    offlineActivity?: string;
    offlineActivityDiagram?: string;
    referenceLinks?: { slug: string; reason: string }[];
    nextLessons?: { slug: string; reason: string }[];
    relatedStories?: { slug: string; reason: string }[];
    codeTeaser?: string;
    quiz?: { question: string; options: string[]; answer: number }[];
  };
  [key: string]: unknown;
}
