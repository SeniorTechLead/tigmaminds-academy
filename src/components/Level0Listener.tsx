import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { BookOpen, HelpCircle, CheckCircle, XCircle, Sparkles, ArrowRight, Lightbulb, Globe, Library, Compass } from 'lucide-react';
import type { Lesson } from '../data/lessons';
import { getLessonBySlug } from '../data/lessons';
import { referenceMeta } from '../data/reference-meta';
import MatchingActivity from './interactive/MatchingActivity';
import TrueFalse from './interactive/TrueFalse';
import DidYouKnow from './interactive/DidYouKnow';
import diagramRegistry from './reference/DiagramRegistry';
import DiagramZoom from './DiagramZoom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import SignUpGate from './SignUpGate';

interface Props {
  lesson: Lesson;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

function ConceptCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0">{icon}</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white select-text cursor-text">{title}</h3>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label={expanded ? 'Collapse section' : 'Expand section'}>
          <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>
      {expanded && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

/** Render markdown-lite: **bold** and *italic* */
function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export default function Level0Listener({ lesson }: Props) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { user } = useAuth();
  const isSignedIn = !!user;
  const { recordQuizScore, recordLevelViewed } = useProgress();

  // Record that Level 0 was viewed
  useEffect(() => { recordLevelViewed(lesson.slug, 0); }, [lesson.slug]);

  const concepts = lesson.level0?.concepts;
  const realWorldFacts: string[] = (lesson.stem as any)?.realWorld ?? [];
  const hasSpecificVocab = lesson.level0?.vocabulary &&
    !lesson.level0.vocabulary.some(([term]) => term === 'Variable' || term === 'Observation');

  // Build quiz from lesson-specific content
  const [questions] = useState<QuizQuestion[]>(() => {
    const qs: QuizQuestion[] = [];
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // Helper: build a question with shuffled options
    const makeQ = (question: string, correct: string, wrongs: string[], explanation: string) => {
      const options = shuffle([correct, ...wrongs]);
      qs.push({ question, options, correct: options.indexOf(correct), explanation });
    };

    // 1. Concept-based questions — every lesson has these
    if (concepts && concepts.length > 0) {
      // For each concept, ask about its key idea
      const conceptTitles = concepts.map(c => c.title);
      concepts.forEach((concept, idx) => {
        // "Which concept is about [key idea summary]?" → pick the right concept title
        if (concepts.length >= 3) {
          const wrongTitles = conceptTitles.filter((_, i) => i !== idx).slice(0, 3);
          if (wrongTitles.length >= 2) {
            // Extract first sentence of key idea as the clue
            const clue = concept.keyIdea.split(/[.!]/)[0];
            makeQ(
              `Which topic covers this idea: "${clue}"?`,
              concept.title,
              wrongTitles,
              concept.keyIdea,
            );
          }
        }
      });

      // Ask about the first concept's key idea (true/false style)
      const firstConcept = concepts[0];
      const keyIdeaFirst = firstConcept.keyIdea.split(/[.!]/)[0];
      makeQ(
        `Is this statement correct? "${keyIdeaFirst}"`,
        'Yes, this is correct',
        ['No, this is incorrect'],
        firstConcept.keyIdea,
      );
    }

    // 2. Vocabulary-based questions (only if lesson-specific)
    if (hasSpecificVocab && lesson.level0?.vocabulary) {
      const vocab = lesson.level0.vocabulary;
      vocab.slice(0, 2).forEach(([term, definition], idx) => {
        const wrongDefs = vocab
          .filter((_, i) => i !== idx)
          .map(([, d]) => d.length > 70 ? d.slice(0, 67) + '...' : d)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const correctDef = definition.length > 70 ? definition.slice(0, 67) + '...' : definition;
        if (wrongDefs.length >= 2) {
          makeQ(`What does "${term}" mean?`, correctDef, wrongDefs, `${term}: ${definition}`);
        }
      });
    }

    // 3. True/false (only if lesson-specific)
    if (hasSpecificVocab && lesson.level0?.trueFalse) {
      lesson.level0.trueFalse.slice(0, 1).forEach((tf) => {
        qs.push({
          question: tf.statement,
          options: ['True', 'False'],
          correct: tf.isTrue ? 0 : 1,
          explanation: tf.explanation,
        });
      });
    }

    // 4. STEM connection question (always)
    makeQ(
      `What is the main STEM topic connected to "${lesson.story.title}"?`,
      lesson.stem.title,
      ['Space Travel', 'Ancient Cooking', 'Fashion Design'],
      `This story connects to ${lesson.stem.title}. ${lesson.stem.description}`,
    );

    return qs.slice(0, 5);
  });

  const q = questions[currentQ];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === q?.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setCompleted(true);
      recordQuizScore(lesson.slug, score, questions.length);
    }
    else { setCurrentQ(c => c + 1); setSelectedAnswer(null); setShowExplanation(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 0: Listener
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding needed — learn the science through the story</span>
      </div>

      {/* ===== WHAT YOU'LL DISCOVER ===== */}
      <ConceptCard title="What You'll Discover" icon={<BookOpen className="w-6 h-6 text-sky-500" />}>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {lesson.stem.description}
        </p>
        <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3">
          <p className="text-sm text-sky-800 dark:text-sky-300">
            <strong>The big idea:</strong> "{lesson.story.title}" teaches us about <strong>{lesson.stem.title}</strong> — and you don't need to write a single line of code to understand it.
          </p>
        </div>
      </ConceptCard>

      {/* ===== CONCEPT TEACHING SECTIONS ===== */}
      {concepts && concepts.length > 0 && (isSignedIn ? concepts : concepts.slice(0, 2)).map((concept, ci) => {
        const DiagramComponent = concept.diagram ? diagramRegistry[concept.diagram] : null;
        return (
          <ConceptCard
            key={ci}
            title={concept.title}
            icon={<Lightbulb className="w-6 h-6 text-amber-500" />}
          >
            <div className="space-y-4">
              {concept.paragraphs.map((p, pi) => {
                // Check if paragraph contains bullet lines (• or -)
                if (p.includes('\n') && (p.includes('•') || p.includes('- '))) {
                  const lines = p.split('\n').filter(l => l.trim());
                  const intro = lines.filter(l => !l.trim().startsWith('•') && !l.trim().startsWith('- '));
                  const bullets = lines.filter(l => l.trim().startsWith('•') || l.trim().startsWith('- '));
                  return (
                    <div key={pi}>
                      {intro.length > 0 && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(intro.join(' ')) }} />
                      )}
                      {bullets.length > 0 && (
                        <ul className="space-y-1.5 ml-1">
                          {bullets.map((b, bi) => (
                            <li key={bi} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(b.replace(/^[•\-]\s*/, '')) }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                return (
                  <p
                    key={pi}
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(p) }}
                  />
                );
              })}
            </div>
            {DiagramComponent && (
              <Suspense fallback={<div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse mt-4" />}>
                <div className="mt-4">
                  <DiagramZoom>
                    <DiagramComponent />
                  </DiagramZoom>
                </div>
              </Suspense>
            )}
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-r-lg px-4 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Key idea:</strong> {concept.keyIdea}
              </p>
            </div>
          </ConceptCard>
        );
      })}

      {/* ===== SIGN-UP GATE (after first 2 concepts for non-signed-in users) ===== */}
      {!isSignedIn && concepts && concepts.length > 2 && (
        <div className="relative">
          <SignUpGate message="Access all 130+ lessons, quizzes, interactive tools, and offline activities" />
          {/* Blurred teaser of remaining content */}
          <div className="mt-4 relative overflow-hidden" style={{ maxHeight: '100px' }}>
            <div className="pointer-events-none select-none" style={{ filter: 'blur(6px)' }}>
              {concepts.slice(2, 4).map((concept, ci) => (
                <ConceptCard
                  key={ci + 2}
                  title={concept.title}
                  icon={<Lightbulb className="w-6 h-6 text-amber-500" />}
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {concept.paragraphs[0]?.slice(0, 150)}...
                  </p>
                </ConceptCard>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-gray-900/60 dark:to-gray-900" />
          </div>
        </div>
      )}

      {/* ===== Everything below is gated for non-signed-in users ===== */}
      {!isSignedIn && (
        <>{/* Gate reached — remaining sections hidden */}</>
      )}

      {isSignedIn && <>
      {/* ===== DID YOU KNOW FACTS ===== */}
      {(lesson.level0?.facts?.length || realWorldFacts.length > 0) && (
        <ConceptCard title="Did You Know?" icon={<Sparkles className="w-6 h-6 text-amber-500" />}>
          <DidYouKnow facts={[
            ...(lesson.level0?.facts || []),
            ...realWorldFacts,
          ].slice(0, 8)} />
        </ConceptCard>
      )}

      {/* ===== VOCABULARY MATCHING ===== */}
      {hasSpecificVocab && lesson.level0?.vocabulary && (
        <ConceptCard title={`${lesson.stem.title} — Key Terms`} icon={<Lightbulb className="w-6 h-6 text-violet-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Now that you've learned the concepts, match each term to its meaning:
          </p>
          <MatchingActivity
            title="Match the term to its definition"
            pairs={lesson.level0.vocabulary.slice(0, 6) as [string, string][]}
          />
        </ConceptCard>
      )}

      {/* ===== TRUE/FALSE ===== */}
      {hasSpecificVocab && lesson.level0?.trueFalse && lesson.level0.trueFalse.length > 0 && (
        <ConceptCard title={`Test Your Understanding — ${lesson.stem.title}`} icon={<HelpCircle className="w-6 h-6 text-violet-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Based on what you just learned — true or false?
          </p>
          {lesson.level0.trueFalse.map((tf, i) => (
            <TrueFalse key={i} statement={tf.statement} isTrue={tf.isTrue} explanation={tf.explanation} />
          ))}
        </ConceptCard>
      )}

      {/* ===== REAL WORLD CONNECTIONS ===== */}
      {realWorldFacts.length > 0 && (
        <ConceptCard title="In the Real World" icon={<Globe className="w-6 h-6 text-emerald-500" />}>
          <div className="space-y-3">
            {realWorldFacts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">{fact}</p>
              </div>
            ))}
          </div>
        </ConceptCard>
      )}

      {/* ===== OFFLINE ACTIVITY ===== */}
      <ConceptCard title="Try This at Home (No Computer Needed)" icon={<Sparkles className="w-6 h-6 text-rose-500" />}>
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-5">
          {lesson.level0?.offlineActivity ? (
            <>
              <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                {lesson.level0.offlineActivity}
              </p>
              {(() => {
                const ActivityDiagram = lesson.level0?.offlineActivityDiagram ? diagramRegistry[lesson.level0.offlineActivityDiagram] : null;
                if (!ActivityDiagram) return null;
                return (
                  <Suspense fallback={<div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse mt-3" />}>
                    <div className="mt-3">
                      <DiagramZoom>
                        <ActivityDiagram />
                      </DiagramZoom>
                    </div>
                  </Suspense>
                );
              })()}
            </>
          ) : (
            <ol className="space-y-2 text-sm text-rose-700 dark:text-rose-300">
              <li className="flex items-start gap-2"><span className="font-bold">1.</span> Write down 3 things from the story that surprised you.</li>
              <li className="flex items-start gap-2"><span className="font-bold">2.</span> Draw a picture of the main concept — what does {lesson.stem.title.toLowerCase()} look like?</li>
              <li className="flex items-start gap-2"><span className="font-bold">3.</span> Find one example in your own life or neighborhood.</li>
              <li className="flex items-start gap-2"><span className="font-bold">4.</span> Explain what you learned to someone in your own words.</li>
            </ol>
          )}
        </div>
      </ConceptCard>

      {/* ===== REFERENCE LINKS ===== */}
      {lesson.level0?.referenceLinks && lesson.level0.referenceLinks.length > 0 && (
        <ConceptCard title="Go Deeper — Reference Library" icon={<Library className="w-6 h-6 text-indigo-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Want the full details? These reference guides cover the science in more depth:
          </p>
          <div className="space-y-3">
            {lesson.level0.referenceLinks.map((ref: { slug: string; reason: string }) => {
              const refGuide = referenceMeta.find(r => r.slug === ref.slug);
              if (!refGuide) return null;
              return (
                <Link
                  key={ref.slug}
                  href={`/library/${ref.slug}`}
                  target="_blank"
                  className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group"
                >
                  <span className="text-2xl flex-shrink-0">{refGuide.icon}</span>
                  <div>
                    <span className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 group-hover:underline">{refGuide.title}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ref.reason}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </ConceptCard>
      )}

      {/* ===== NEXT LESSONS ===== */}
      {lesson.level0?.nextLessons && lesson.level0.nextLessons.length > 0 && (
        <ConceptCard title="What to Learn Next" icon={<Compass className="w-6 h-6 text-emerald-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            You now understand the concepts in this lesson. These stories build on what you have learned:
          </p>
          <div className="space-y-3">
            {lesson.level0.nextLessons.map((next: { slug: string; reason: string }) => {
              const nextLesson = getLessonBySlug(next.slug);
              if (!nextLesson) return null;
              return (
                <Link
                  key={next.slug}
                  href={`/lessons/${next.slug}`}
                  target="_blank"
                  className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors group"
                >
                  <ArrowRight className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 group-hover:underline">{nextLesson.story.title}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{next.reason}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </ConceptCard>
      )}

      {/* ===== COMPREHENSION QUIZ ===== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-sky-500" />
            Comprehension Check
          </h3>
        </div>

        <div className="p-6">
          {!quizStarted ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You've explored the concepts. Now let's see what you remember!
              </p>
              <button onClick={() => setQuizStarted(true)}
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                Start Quiz ({questions.length} questions) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : completed ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{score}/{questions.length}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {score === questions.length ? 'Perfect! You\'re ready for Level 1.' :
                 score >= questions.length * 0.6 ? 'Great understanding! Level 1 will build on what you know.' :
                 'Good start! Review the concepts above, then try Level 1 when ready.'}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-4">
                Ready to start coding? Switch to Level 1: Explorer →
              </p>
              <button onClick={() => { setQuizStarted(false); setCurrentQ(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); setCompleted(false); }}
                className="text-sm text-sky-500 hover:text-sky-600 underline transition-colors">
                Retake Quiz
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-1 mb-4">
                {questions.map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i < currentQ ? 'bg-sky-500' : i === currentQ ? 'bg-sky-300' : 'bg-gray-200 dark:bg-gray-700'}`} />
                ))}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question {currentQ + 1} of {questions.length}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{q.question}</p>

              <div className="space-y-3 mb-6">
                {q.options.map((option, i) => {
                  let style = 'border-gray-200 dark:border-gray-700 hover:border-sky-400';
                  if (selectedAnswer !== null) {
                    if (i === q.correct) style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                    else if (i === selectedAnswer) style = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                    else style = 'border-gray-200 dark:border-gray-700 opacity-50';
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          selectedAnswer !== null && i === q.correct ? 'bg-emerald-500 text-white' :
                          selectedAnswer === i && i !== q.correct ? 'bg-red-500 text-white' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {selectedAnswer !== null && i === q.correct ? <CheckCircle className="w-4 h-4" /> :
                           selectedAnswer === i && i !== q.correct ? <XCircle className="w-4 h-4" /> :
                           String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <>
                  <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-sky-800 dark:text-sky-300">
                      <strong>{selectedAnswer === q.correct ? '✓ Correct!' : '✗ Not quite.'}</strong> {q.explanation}
                    </p>
                  </div>
                  <button onClick={nextQuestion} className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition-colors">
                    {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      </>}
    </div>
  );
}
