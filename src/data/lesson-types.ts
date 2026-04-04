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
  | 'Marine Science';

export type Tradition = 'Northeast India' | 'Hindu' | 'Buddhist' | 'Christian' | 'Islamic';

export interface Lesson {
  id: number;
  slug: string;
  tradition?: Tradition;
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
    codeTeaser?: string;
    quiz?: { question: string; options: string[]; answer: number }[];
  };
  [key: string]: unknown;
}
