import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, BookOpen, Wrench, Lightbulb, Gamepad2, Clock, Target, Package, ListChecks } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getLessonBySlug, lessons } from '../data/lessons';
import ElephantPlayground from '../components/ElephantPlayground';
import CodePlayground from '../components/CodePlayground';

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? getLessonBySlug(slug) : undefined;

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">This lesson doesn't exist yet.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = lesson.stem.icon;
  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img src={lesson.illustration} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/60" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Lessons
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${lesson.stem.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">Story → Lesson</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{lesson.story.title}</h1>
          <p className="text-xl text-white/85 max-w-2xl">{lesson.story.tagline}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${lesson.stem.color} text-white text-sm font-semibold`}>
              → {lesson.stem.title}
            </span>
            <span className="text-white/60 text-sm">
              {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Both Tracks'}
            </span>
          </div>
        </div>
      </section>

      {/* Lesson Overview (structured lessons only) */}
      {lesson.lesson && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
                  <p className="text-gray-900 dark:text-white font-medium">{lesson.lesson.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Track</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Both Tracks'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prerequisites</p>
                  <p className="text-gray-900 dark:text-white font-medium">None</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Materials</p>
                  <p className="text-gray-900 dark:text-white font-medium">{lesson.lesson.materials.length} items needed</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Learning Objectives */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" /> Learning Objectives
                </h3>
                <ul className="space-y-3">
                  {lesson.lesson.objectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials List */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" /> Materials List
                </h3>
                <ul className="space-y-2">
                  {lesson.lesson.materials.map((mat) => (
                    <li key={mat} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prerequisites */}
            {lesson.lesson.prerequisites.length > 0 && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Prerequisites</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.lesson.prerequisites.join(' • ')}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Story</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-white">
            {lesson.story.content.split('\n\n').map((paragraph, i) => (
              <p key={i} dangerouslySetInnerHTML={{
                __html: paragraph
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>')
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Playground (if available) */}
      {lesson.playground && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Gamepad2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Try It Yourself</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Before we get to the science — experience it. Rongpharpi learned to read elephant vibrations through the ground. Can you?
            </p>
            {lesson.playground === 'elephant' && (
              <>
                <ElephantPlayground />

                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Now Build the Classifier</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You just classified elephant sounds by ear. Now do it with code. The Python playground below has numpy and matplotlib pre-installed — generate signals, visualize them as spectrograms, and build a simple classifier.
                  </p>
                  <CodePlayground
                    title="Elephant Sound Classifier"
                    packages={['numpy', 'matplotlib']}
                    description="Write Python to analyze and classify elephant rumble patterns. Press Run (⌘↵) to execute."
                    steps={[
                      { title: 'Generate signals', hint: 'Use numpy to create sine waves at different frequencies' },
                      { title: 'Visualize', hint: 'Plot the waveform with matplotlib' },
                      { title: 'Spectrogram', hint: 'Use plt.specgram() to see frequency over time' },
                      { title: 'Classify', hint: 'Write a function that detects the dominant frequency' },
                    ]}
                    starterCode={`import numpy as np
import matplotlib.pyplot as plt

# === Step 1: Generate elephant rumble signals ===
# Real elephants rumble at 8-25 Hz (infrasonic)
# We'll simulate 3 moods at audible frequencies

sample_rate = 8000  # samples per second
duration = 3        # seconds
t = np.linspace(0, duration, sample_rate * duration)

# Calm: low frequency, slow pulsing
calm = np.sin(2 * np.pi * 80 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.5 * t))

# Nervous: higher frequency, rapid pulsing
nervous = np.sin(2 * np.pi * 110 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t))

# Danger: low boom then frantic hammering
boom = np.exp(-t * 3) * np.sin(2 * np.pi * 40 * t)
hammering = np.sin(2 * np.pi * 55 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 8 * t))
danger = boom + hammering * (1 - np.exp(-t * 3))

# === Step 2: Plot the waveforms ===
fig, axes = plt.subplots(3, 1, figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')

for ax, signal, label, color in [
    (axes[0], calm, 'Calm & Feeding', '#22c55e'),
    (axes[1], nervous, 'Nervous & Alert', '#f59e0b'),
    (axes[2], danger, 'Danger — Run!', '#ef4444'),
]:
    ax.plot(t[:2000], signal[:2000], color=color, linewidth=0.8)
    ax.set_ylabel(label, color='white', fontsize=9)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.spines['bottom'].set_color('gray')
    ax.spines['left'].set_color('gray')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

axes[2].set_xlabel('Time (seconds)', color='white')
plt.suptitle('Elephant Rumble Patterns', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print("✓ Generated 3 rumble patterns")
print(f"  Sample rate: {sample_rate} Hz")
print(f"  Duration: {duration}s each")
print(f"  Calm: 80 Hz base, 0.5 Hz pulse")
print(f"  Nervous: 110 Hz base, 3 Hz pulse")
print(f"  Danger: 40 Hz boom + 55 Hz @ 8 Hz pulse")
print()
print("🎯 Next: Try changing the frequencies and re-running!")
print("   What happens if you increase the pulse rate?")
`}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* STEM Connection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Science Behind the Story</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl">{lesson.stem.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What You'll Learn</h3>
              <ul className="space-y-3">
                {lesson.stem.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 text-${lesson.stem.color.includes('emerald') ? 'emerald' : lesson.stem.color.includes('amber') ? 'amber' : lesson.stem.color.includes('sky') ? 'sky' : lesson.stem.color.includes('violet') ? 'violet' : lesson.stem.color.includes('rose') ? 'rose' : 'yellow'}-500`} />
                    <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real World */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Real-World Applications</h3>
              <ul className="space-y-4">
                {lesson.stem.realWorld.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Project */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Project</h2>
          </div>

          <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-t-4 border-gradient`} style={{ borderImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) 1` }}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.stem.project.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{lesson.stem.project.description}</p>

            <div className="space-y-4">
              {lesson.stem.project.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${lesson.stem.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build This?</h2>
          <p className="text-lg text-white/90 mb-8">
            This lesson is part of our {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Bootcamp and School Program'}. Apply now and start building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/students"
              className="inline-flex items-center justify-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
            >
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-all"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Prev/Next Navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {prevLesson ? (
            <Link to={`/lessons/${prevLesson.slug}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{prevLesson.story.title}</span>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link to={`/lessons/${nextLesson.slug}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <span className="text-sm font-medium">{nextLesson.story.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </section>

      <Footer />
    </div>
  );
}
