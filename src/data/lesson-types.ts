import type { LucideIcon } from 'lucide-react';

export type Skill = 'Python' | 'HTML/CSS' | 'JavaScript' | 'Arduino' | 'NumPy' | 'Matplotlib' | 'Data Analysis' | 'Machine Learning' | 'Circuit Design' | 'Lab Skills';
export type Track = 'Programming' | 'AI & Data' | 'Robotics & Electronics' | 'Web Development' | 'Science & Lab';
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
  | 'Music & Arts';

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
