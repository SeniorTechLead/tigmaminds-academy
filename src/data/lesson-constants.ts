/**
 * Static config constants for lessons (subjects, disciplines, skills, tracks).
 * Extracted from lessons.ts so list-view consumers can import these without
 * pulling in the full lessons module.
 */

import type { Subject, Skill, Track, Discipline } from './lesson-types';

export const DISCIPLINES: { key: Discipline; icon: string; color: string; skills: { name: string; tools: string[] }[] }[] = [
  {
    key: 'Programming', icon: '💻',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    skills: [
      { name: 'Python', tools: ['Python 3'] },
      { name: 'Web Development', tools: ['HTML/CSS', 'JavaScript', 'TypeScript', 'React concepts'] },
      { name: 'Databases', tools: ['SQL', 'Data modeling'] },
      { name: 'Algorithms', tools: ['Sorting & searching', 'Data structures'] },
    ],
  },
  {
    key: 'Data Science', icon: '📊',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    skills: [
      { name: 'Data Analysis', tools: ['Pandas', 'NumPy', 'Statistics'] },
      { name: 'Data Visualization', tools: ['Matplotlib', 'Seaborn'] },
    ],
  },
  {
    key: 'AI & Machine Learning', icon: '🤖',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    skills: [
      { name: 'Machine Learning', tools: ['scikit-learn', 'NumPy'] },
      { name: 'Computer Vision', tools: ['OpenCV', 'NumPy'] },
      { name: 'Natural Language', tools: ['Text processing'] },
      { name: 'Reinforcement Learning', tools: ['NumPy'] },
    ],
  },
  {
    key: 'Scientific Modeling', icon: '🔬',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    skills: [
      { name: 'Physics simulation', tools: ['Mechanics', 'Optics & light', 'Acoustics & sound', 'Thermodynamics', 'Fluid dynamics'] },
      { name: 'Biological simulation', tools: ['Population dynamics', 'Genetics & evolution', 'Ecosystem modeling', 'Plant growth'] },
      { name: 'Chemical simulation', tools: ['Reactions & kinetics', 'Materials science'] },
      { name: 'Earth science simulation', tools: ['Atmospheric models', 'Geological processes', 'Hydrological models'] },
    ],
  },
  {
    key: 'Electronics & Hardware', icon: '🔧',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    skills: [
      { name: 'Arduino', tools: ['Digital I/O', 'Analog I/O', 'Serial communication'] },
      { name: 'Circuit Design', tools: ['Breadboard prototyping', 'PCB design'] },
      { name: 'Sensors', tools: ['Ultrasonic', 'Light sensors'] },
    ],
  },
];

export const SKILLS: { key: Skill; color: string }[] = [
  { key: 'Python', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { key: 'Web Development', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { key: 'Arduino & Electronics', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { key: 'Data Visualization', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { key: 'Data Analysis', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { key: 'Machine Learning', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { key: 'Scientific Modeling', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { key: 'SQL & Databases', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
];

export const TRACKS: { key: Track; color: string; icon: string; description: string }[] = [
  { key: 'Programming', color: 'bg-violet-500', icon: '💻', description: 'Python, algorithms, data structures' },
  { key: 'AI & Data', color: 'bg-rose-500', icon: '🤖', description: 'Machine learning, computer vision, data science' },
  { key: 'Robotics & Electronics', color: 'bg-teal-500', icon: '🔧', description: 'Arduino, sensors, circuits, hardware' },
  { key: 'Web Development', color: 'bg-orange-500', icon: '🌐', description: 'HTML, CSS, JavaScript, React, databases' },
  { key: 'Science & Lab', color: 'bg-emerald-500', icon: '🔬', description: 'Biology, chemistry, physics experiments' },
];

export const SUBJECTS: { key: Subject; color: string; icon: string }[] = [
  { key: 'Biology', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: '🧬' },
  { key: 'Physics', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: '⚡' },
  { key: 'Chemistry', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: '🧪' },
  { key: 'Computer Science', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: '💻' },
  { key: 'Engineering', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: '🔧' },
  { key: 'Robotics', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', icon: '🤖' },
  { key: 'Geography', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', icon: '🌍' },
  { key: 'Ecology', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: '🌿' },
  { key: 'Mathematics', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: '📐' },
  { key: 'Economics', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300', icon: '📊' },
  { key: 'Music & Arts', color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300', icon: '🎵' },
  { key: 'Materials Science', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300', icon: '🧵' },
  { key: 'Environmental Science', color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300', icon: '🌱' },
  { key: 'Agriculture', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: '🌾' },
  { key: 'Zoology', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', icon: '🐾' },
  { key: 'Botany', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', icon: '🌺' },
  { key: 'Conservation', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: '🛡️' },
  { key: 'Neuroscience', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', icon: '🧠' },
  { key: 'Meteorology', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', icon: '🌦️' },
  { key: 'Geology', color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300', icon: '🪨' },
  { key: 'Astronomy', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: '🔭' },
  { key: 'Health & Medicine', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: '🏥' },
  { key: 'Marine Science', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: '🐟' },
  { key: 'History', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: '📜' },
];
