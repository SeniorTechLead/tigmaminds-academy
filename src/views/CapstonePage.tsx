import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Trophy, Clock, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons } from '../data/lessons';
import { getLevelComponents } from '../components/levels';

/* ── Extract capstone projects from all lessons that have Level 4 ── */
function getCapstoneProjects() {
  return lessons
    .filter(l => {
      const comps = getLevelComponents(l.slug);
      return !!comps.Level4;
    })
    .map(l => ({
      slug: l.slug,
      storyTitle: l.story.title,
      stemTitle: l.stem.title,
      projectTitle: l.stem.project.title,
      projectDescription: l.stem.project.description,
      steps: l.stem.project.steps,
      color: l.stem.color,
      icon: l.stem.icon,
      subjects: l.subjects || [],
      skillTags: l.skillTags || [],
      estimatedHours: l.estimatedHours || 12,
      tradition: l.tradition,
      complexity: rateComplexity(l.stem.project.steps, l.stem.project.description, l.skillTags || [], l.estimatedHours || 12),
      technologies: detectTechnologies(l.toolSkills || [], l.skillTags || []),
    }));
}

/* ── Categorize projects by what the student builds, not the underlying physics ── */
const PROJECT_CATEGORIES: { key: string; label: string; icon: string; desc: string; keywords: string[] }[] = [
  { key: 'simulator', label: 'Simulators & Models', icon: '🔬', desc: 'Build computational models of real-world systems', keywords: ['simulator', 'simulation', 'model', 'simulate'] },
  { key: 'analyzer', label: 'Data Analysis Tools', icon: '📊', desc: 'Analyze real data and extract insights', keywords: ['analyzer', 'analysis', 'calculator', 'estimator', 'predictor'] },
  { key: 'optimizer', label: 'Optimizers & Planners', icon: '🎯', desc: 'Find the best solution in a complex design space', keywords: ['optimizer', 'planner', 'design', 'optimis'] },
  { key: 'engine', label: 'Search & Knowledge Systems', icon: '🔍', desc: 'Build systems that organize and retrieve information', keywords: ['search', 'knowledge', 'graph', 'network', 'index', 'catalog'] },
  { key: 'hardware', label: 'Hardware & Engineering', icon: '🔧', desc: 'Design physical systems — ships, bridges, buildings', keywords: ['ship', 'bridge', 'flight', 'structural', 'arch', 'canal', 'lock', 'aqueduct'] },
];

/* ── Capstone complexity — what prior skills the project requires ── */
type Complexity = 'Foundational' | 'Applied' | 'Research-grade';

function rateComplexity(steps: string[], desc: string, skillTags: { skill: string }[], hours: number): Complexity {
  let score = 0;

  // Step count (more steps = more complex integration)
  score += steps.length;

  // Estimated hours
  if (hours >= 14) score += 3;
  else if (hours >= 12) score += 1;

  // Skills that require prior experience
  const researchSkills = ['Machine Learning', 'Computer Vision', 'Reinforcement Learning', 'Natural Language', 'Algorithms'];
  if (skillTags.some(t => researchSkills.includes(t.skill))) score += 4;

  // Keywords indicating research-grade complexity
  const text = (desc + ' ' + steps.join(' ')).toLowerCase();
  const researchKeywords = ['monte carlo', 'finite element', 'differential', 'fourier', 'bayesian',
    'stochastic', 'eigenvalue', 'neural', 'machine learning', 'multi-objective', 'pareto',
    'kalman', 'markov', 'optimization', 'pde'];
  const foundationalKeywords = ['basic', 'simple', 'introduction', 'first', 'define', 'calculate',
    'density', 'compare', 'list', 'dictionary'];

  score += researchKeywords.filter(k => text.includes(k)).length * 2;
  score -= foundationalKeywords.filter(k => text.includes(k)).length;

  if (score >= 10) return 'Research-grade';
  if (score >= 6) return 'Applied';
  return 'Foundational';
}

const COMPLEXITY_COLORS: Record<Complexity, string> = {
  'Foundational': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Applied': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Research-grade': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

const COMPLEXITY_DESCRIPTIONS: Record<Complexity, string> = {
  'Foundational': 'Needs Python basics — loops, functions, lists. Good first capstone.',
  'Applied': 'Needs NumPy, classes, and simulation skills from Levels 1-3.',
  'Research-grade': 'Needs Monte Carlo, optimization, or multi-system integration.',
};

/* ── Technology detection — what languages/tools the capstone actually uses ── */
type Technology = 'Python' | 'HTML/CSS/JS' | 'SQL' | 'Arduino' | 'TypeScript';

const TECH_COLORS: Record<Technology, string> = {
  'Python': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'HTML/CSS/JS': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'SQL': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Arduino': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'TypeScript': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
};

function detectTechnologies(toolSkills: string[], skillTags: { discipline?: string; skill?: string; tools?: string[] }[]): Technology[] {
  const techs = new Set<Technology>();

  // Always Python unless it's purely web/arduino
  techs.add('Python');

  // Check toolSkills (legacy flat tags)
  for (const skill of toolSkills) {
    if (skill === 'Web Development') { techs.add('HTML/CSS/JS'); }
    if (skill === 'Arduino & Electronics') { techs.add('Arduino'); techs.delete('Python'); }
    if (skill === 'SQL & Databases') { techs.add('SQL'); }
  }

  // Check skillTags (hierarchical)
  for (const tag of skillTags) {
    if (tag.skill === 'Web Development') {
      techs.add('HTML/CSS/JS');
      if (tag.tools?.includes('TypeScript')) techs.add('TypeScript');
    }
    if (tag.skill === 'Databases') techs.add('SQL');
    if (tag.discipline === 'Electronics & Hardware') { techs.add('Arduino'); techs.delete('Python'); }
  }

  return [...techs];
}

function categorizeProject(title: string, desc: string): string {
  const text = (title + ' ' + desc).toLowerCase();
  for (const cat of PROJECT_CATEGORIES) {
    if (cat.keywords.some(kw => text.includes(kw))) return cat.key;
  }
  return 'simulator'; // default
}

export default function CapstonePage() {
  const projects = getCapstoneProjects();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity | null>(null);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  // Tag each project with its category
  const taggedProjects = projects.map(p => ({
    ...p,
    category: categorizeProject(p.projectTitle, p.projectDescription),
  }));

  // Filter by category AND complexity AND technology
  const filtered = taggedProjects.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedComplexity && p.complexity !== selectedComplexity) return false;
    if (selectedTech && !p.technologies.includes(selectedTech)) return false;
    return true;
  });

  // Counts per category
  const categoryCounts = new Map<string, number>();
  for (const p of taggedProjects) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
  }

  // Counts per technology
  const techCounts = new Map<Technology, number>();
  for (const p of taggedProjects) {
    for (const t of p.technologies) {
      techCounts.set(t, (techCounts.get(t) || 0) + 1);
    }
  }

  // Counts per complexity
  const complexityCounts: Record<Complexity, number> = { 'Foundational': 0, 'Applied': 0, 'Research-grade': 0 };
  for (const p of taggedProjects) {
    complexityCounts[p.complexity]++;
  }

  const totalHours = projects.reduce((sum, p) => sum + p.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Trophy className="w-4 h-4" /> Level 4: Creator Projects
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Capstone Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {projects.length} production-grade projects you build from scratch. Each one starts with a story, teaches real science, and ends with working code for your portfolio.
          </p>
          <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-500" />
              <span>{projects.length} projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>{totalHours}+ hours of guided building</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span>{PROJECT_CATEGORIES.length} project types</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Capstones Matter */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/15 dark:to-indigo-900/15 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Why capstone projects matter</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">For job seekers</p>
                <p>Each project is a portfolio piece with real code, real data, and a technical report. Show employers what you can build, not just what you studied.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">For students</p>
                <p>Apply everything from Levels 1-3 in a single integrated project. System design, implementation, analysis, and documentation — the full engineering cycle.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">For career changers</p>
                <p>Prove you can build, not just learn. These projects demonstrate Python, data analysis, simulation, and technical writing — the skills employers hire for.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter pills + project grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedCategory ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
            >
              All ({projects.length})
            </button>
            {PROJECT_CATEGORIES.map(cat => {
              const count = categoryCounts.get(cat.key) || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.key ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                >
                  {cat.icon} {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Complexity filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="text-xs text-gray-400 dark:text-gray-500 self-center mr-1">Prerequisites:</span>
            {(['Foundational', 'Applied', 'Research-grade'] as Complexity[]).map(c => (
              <button
                key={c}
                onClick={() => setSelectedComplexity(selectedComplexity === c ? null : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedComplexity === c ? COMPLEXITY_COLORS[c] + ' shadow-sm ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}
                title={COMPLEXITY_DESCRIPTIONS[c]}
              >
                {c} ({complexityCounts[c]})
              </button>
            ))}
          </div>

          {/* Complexity description */}
          {selectedComplexity && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
              {COMPLEXITY_DESCRIPTIONS[selectedComplexity]}
            </p>
          )}

          {/* Technology filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="text-xs text-gray-400 dark:text-gray-500 self-center mr-1">Technology:</span>
            {(['Python', 'HTML/CSS/JS', 'SQL', 'Arduino', 'TypeScript'] as Technology[]).map(t => {
              const count = techCounts.get(t) || 0;
              if (count === 0) return null;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTech(selectedTech === t ? null : t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedTech === t ? TECH_COLORS[t] + ' shadow-sm ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          {/* Selected category description */}
          {selectedCategory && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              {PROJECT_CATEGORIES.find(c => c.key === selectedCategory)?.desc}
            </p>
          )}

          {/* Showing count */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => {
                    const Icon = project.icon;
                    return (
                      <Link
                        key={project.slug}
                        href={`/lessons/${project.slug}`}
                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                      >
                        <div className={`h-2 bg-gradient-to-r ${project.color}`} />
                        <div className="p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                                {project.projectTitle}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                  {project.storyTitle}
                                </p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${COMPLEXITY_COLORS[project.complexity]}`}>
                                  {project.complexity}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                            {project.projectDescription}
                          </p>

                          {/* Technologies + Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.map((tech, i) => (
                              <span key={`t-${i}`} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${TECH_COLORS[tech]}`}>
                                {tech}
                              </span>
                            ))}
                            {project.subjects.slice(0, 2).map((subj, i) => (
                              <span key={`s-${i}`} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {subj}
                              </span>
                            ))}
                          </div>

                          {/* Steps preview */}
                          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                            {project.steps.slice(0, 3).map((step, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="text-purple-400 font-mono">{i + 1}.</span>
                                <span className="line-clamp-1">{step}</span>
                              </div>
                            ))}
                            {project.steps.length > 3 && (
                              <div className="text-purple-500 dark:text-purple-400 font-semibold">
                                +{project.steps.length - 3} more steps
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{project.estimatedHours}h total (all levels)</span>
                            </div>
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                              Start <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
            })}
          </div>
        </div>
      </section>

      {/* Skills you'll demonstrate — linked to Reference Library */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Skills you'll demonstrate</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">Click any skill to explore it further in the Reference Library</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { skill: 'Python & NumPy', desc: 'Classes, functions, arrays, data pipelines', ref: '/library/python' },
              { skill: 'Data Analysis', desc: 'Pandas, statistics, pattern recognition', ref: '/library/statistics-basics' },
              { skill: 'Data Visualization', desc: 'Matplotlib charts, scientific figures', ref: '/library/numpy' },
              { skill: 'Algorithms', desc: 'Dijkstra, sorting, graph traversal, search', ref: '/library/algorithms-data-structures' },
              { skill: 'Databases & SQL', desc: 'Schema design, queries, indexing', ref: '/library/databases-and-sql' },
              { skill: 'Epidemiology', desc: 'SIR/SEIR models, R₀, herd immunity', ref: '/library/ecology-and-populations' },
              { skill: 'Machine Learning', desc: 'Classification, regression, Bayesian methods', ref: '/library/probability-and-combinatorics' },
              { skill: 'Network Science', desc: 'Graph theory, centrality, resilience', ref: '/library/algorithms-data-structures' },
              { skill: 'Structural Engineering', desc: 'Stress analysis, material properties, FEA', ref: '/library/structural-engineering' },
              { skill: 'Fluid Dynamics', desc: 'Bernoulli, Manning, pipe flow, buoyancy', ref: '/library/fluid-mechanics' },
              { skill: 'Thermodynamics', desc: 'Heat transfer, radiation, phase changes', ref: '/library/heat-and-thermodynamics' },
              { skill: 'Optics', desc: 'Refraction, lenses, polarisation, cameras', ref: '/library/optics-and-lenses' },
              { skill: 'Orbital Mechanics', desc: 'Hohmann transfers, rocket equation, orbits', ref: '/library/gravity-and-orbits' },
              { skill: 'Economics', desc: 'Supply chains, trade networks, cost analysis', ref: '/library/supply-demand-economics' },
              { skill: 'System Design', desc: 'Architecture before code — plan, then build', ref: '/library/engineering-design' },
              { skill: 'Technical Writing', desc: 'Reports, documentation, portfolio pieces', ref: '/library/scientific-method' },
            ].map(item => (
              <Link key={item.skill} href={item.ref}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-left hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all group">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.skill}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
