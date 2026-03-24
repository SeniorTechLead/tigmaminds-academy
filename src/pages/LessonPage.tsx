import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, BookOpen, Wrench, Lightbulb, Gamepad2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getLessonBySlug, lessons } from '../data/lessons';
import ElephantPlayground from '../components/ElephantPlayground';

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
            {lesson.playground === 'elephant' && <ElephantPlayground />}
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
