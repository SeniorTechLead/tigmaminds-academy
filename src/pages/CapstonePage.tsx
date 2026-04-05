import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Trophy, Clock, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, DISCIPLINES } from '../data/lessons';
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
    }));
}

export default function CapstonePage() {
  const projects = getCapstoneProjects();

  // Group by discipline
  const byDiscipline = new Map<string, typeof projects>();
  for (const p of projects) {
    const primary = p.skillTags.find(t => t.discipline !== 'Programming')?.discipline || 'Programming';
    if (!byDiscipline.has(primary)) byDiscipline.set(primary, []);
    byDiscipline.get(primary)!.push(p);
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
              <span>{byDiscipline.size} disciplines</span>
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

      {/* Projects by discipline */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {[...byDiscipline.entries()].map(([discipline, disciplineProjects]) => {
            const discInfo = DISCIPLINES.find(d => d.key === discipline);
            return (
              <div key={discipline} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{discInfo?.icon || '🔬'}</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{discipline}</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({disciplineProjects.length} projects)</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {disciplineProjects.map(project => {
                    const Icon = project.icon;
                    return (
                      <Link
                        key={project.slug}
                        to={`/lessons/${project.slug}`}
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
                              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
                                {project.storyTitle}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
                            {project.projectDescription}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.skillTags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                {tag.skill}
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
            );
          })}
        </div>
      </section>

      {/* What you'll demonstrate */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Skills every project demonstrates</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { skill: 'Python Programming', desc: 'Classes, functions, NumPy, data analysis' },
              { skill: 'System Design', desc: 'Architecture before code — plan, then build' },
              { skill: 'Scientific Modeling', desc: 'Translate real-world physics into code' },
              { skill: 'Technical Writing', desc: 'Document your work for employers and peers' },
              { skill: 'Data Visualization', desc: 'Matplotlib charts that tell a story' },
              { skill: 'Monte Carlo Methods', desc: 'Random sampling, statistical inference' },
              { skill: 'Optimization', desc: 'Find the best solution in a large search space' },
              { skill: 'Problem Decomposition', desc: 'Break complex systems into manageable parts' },
            ].map(item => (
              <div key={item.skill} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-left">
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.skill}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
