import { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, XCircle, Sparkles, ArrowRight, Lightbulb, Globe } from 'lucide-react';
import type { Lesson } from '../data/lessons';

interface Props {
  lesson: Lesson;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ===== INTERACTIVE CONCEPT CARDS =====
function ConceptCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

// ===== MATCHING ACTIVITY =====
function MatchingActivity({ pairs, title }: { pairs: [string, string][]; title: string }) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);

  const shuffledRight = useState(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  })[0];

  const handleRightClick = (rightIndex: number) => {
    if (selectedLeft === null) return;
    const actualRight = shuffledRight[rightIndex];
    if (selectedLeft === actualRight) {
      setMatched(prev => new Set([...prev, selectedLeft]));
      setSelectedLeft(null);
      setWrongPair(null);
    } else {
      setWrongPair([selectedLeft, rightIndex]);
      setTimeout(() => setWrongPair(null), 800);
    }
  };

  const allMatched = matched.size === pairs.length;

  return (
    <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-5">
      <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-4">{title}</p>
      {allMatched ? (
        <div className="text-center py-4">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">All matched correctly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {pairs.map(([left], i) => (
              <button key={i} onClick={() => !matched.has(i) && setSelectedLeft(i)}
                disabled={matched.has(i)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                  matched.has(i) ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                  selectedLeft === i ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 ring-2 ring-sky-500' :
                  wrongPair && wrongPair[0] === i ? 'bg-red-100 text-red-700' :
                  'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800'
                }`}>
                {left}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {shuffledRight.map((actualIdx, displayIdx) => (
              <button key={displayIdx} onClick={() => handleRightClick(displayIdx)}
                disabled={matched.has(actualIdx)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                  matched.has(actualIdx) ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                  wrongPair && wrongPair[1] === displayIdx ? 'bg-red-100 text-red-700' :
                  'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-800'
                }`}>
                {pairs[actualIdx][1]}
              </button>
            ))}
          </div>
        </div>
      )}
      {!allMatched && <p className="text-xs text-sky-600 dark:text-sky-400 mt-3">Click a term on the left, then click its match on the right.</p>}
    </div>
  );
}

// ===== TRUE/FALSE =====
function TrueFalse({ statement, isTrue, explanation }: { statement: string; isTrue: boolean; explanation: string }) {
  const [answer, setAnswer] = useState<boolean | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-3">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{statement}</p>
      {answer === null ? (
        <div className="flex gap-2">
          <button onClick={() => setAnswer(true)} className="flex-1 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-200 transition-colors">True</button>
          <button onClick={() => setAnswer(false)} className="flex-1 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-200 transition-colors">False</button>
        </div>
      ) : (
        <div className={`p-3 rounded-lg text-sm ${answer === isTrue ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
          <p className="font-semibold mb-1">{answer === isTrue ? '✓ Correct!' : '✗ Not quite.'} The answer is {isTrue ? 'True' : 'False'}.</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

// ===== DID YOU KNOW =====
function DidYouKnow({ facts }: { facts: string[] }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 mb-4">
      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">💡 Did You Know?</p>
      <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{facts[current]}</p>
      {facts.length > 1 && (
        <button onClick={() => setCurrent((current + 1) % facts.length)}
          className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline">
          Next fact ({current + 1}/{facts.length}) →
        </button>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function Level0Listener({ lesson }: Props) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Generate story-specific comprehension questions
  const questions: QuizQuestion[] = [
    {
      question: `What is the main STEM topic connected to "${lesson.story.title}"?`,
      options: [lesson.stem.title, 'Space Travel', 'Ancient Cooking', 'Fashion Design'],
      correct: 0,
      explanation: `This story connects to ${lesson.stem.title}. ${lesson.stem.description}`,
    },
    {
      question: 'Why do we start with a story before learning science?',
      options: [
        'Stories make abstract concepts concrete and memorable',
        'To waste time before the real learning',
        'Stories have nothing to do with science',
        'Because textbooks are boring',
      ],
      correct: 0,
      explanation: 'Research shows narrative context improves learning retention by up to 65%. Stories create emotional connections that make abstract concepts memorable.',
    },
    {
      question: `What subjects does this lesson cover?`,
      options: [
        lesson.subjects?.join(' and ') || 'Science',
        'Only Mathematics',
        'Only History',
        'Only Languages',
      ],
      correct: 0,
      explanation: `This lesson spans ${lesson.subjects?.join(', ')} — showing how real-world problems require knowledge from multiple fields.`,
    },
  ];

  // Add subject-specific questions
  if (lesson.subjects?.includes('Biology')) {
    questions.push({ question: 'What is biology?', options: ['The study of living things', 'The study of rocks', 'The study of stars', 'The study of numbers'], correct: 0, explanation: 'Biology is the scientific study of life — from microscopic cells to entire ecosystems.' });
  }
  if (lesson.subjects?.includes('Physics')) {
    questions.push({ question: 'What does physics study?', options: ['How the physical world works — forces, energy, waves', 'Only how bridges are built', 'Just the weather', 'Only electricity'], correct: 0, explanation: 'Physics explains how the universe works — from atoms to galaxies, from light to gravity.' });
  }
  if (lesson.subjects?.includes('Computer Science')) {
    questions.push({ question: 'What is computer science about?', options: ['Solving problems with logic and code', 'Only fixing computers', 'Just playing games', 'Only making websites'], correct: 0, explanation: 'Computer science is about thinking logically, designing algorithms, and building systems that solve real problems.' });
  }

  const q = questions[currentQ];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === q?.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) setCompleted(true);
    else { setCurrentQ(c => c + 1); setSelectedAnswer(null); setShowExplanation(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 0: Listener
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding needed — explore the science through the story</span>
      </div>

      {/* ===== CONCEPT EXPLORATION ===== */}
      <ConceptCard title="What You'll Discover" icon={<BookOpen className="w-6 h-6 text-sky-500" />}>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {lesson.stem.description}
        </p>
        <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
          <p className="text-sm text-sky-800 dark:text-sky-300">
            <strong>The big idea:</strong> Every story on this platform connects to real science. "{lesson.story.title}" teaches us about <strong>{lesson.stem.title}</strong> — and you don't need to write a single line of code to understand it.
          </p>
        </div>

        {/* Did you know facts — story-specific first, then real-world */}
        <DidYouKnow facts={[
          ...(lesson.level0?.facts || []),
          ...lesson.stem.realWorld,
          ...(lesson.level0?.facts?.length ? [] : [
            `${lesson.stem.title} is used in real-world applications every day.`,
            'The best scientists start by being curious — just like the characters in this story.',
          ]),
        ].slice(0, 8)
        } />
      </ConceptCard>

      {/* ===== STORY-SPECIFIC VOCABULARY ===== */}
      {lesson.level0?.vocabulary && lesson.level0.vocabulary.length > 0 && (
        <ConceptCard title={`${lesson.stem.title} — Key Terms`} icon={<Lightbulb className="w-6 h-6 text-amber-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            This story introduces important terms from {lesson.stem.title.toLowerCase()}. Match each term to its meaning:
          </p>
          <MatchingActivity
            title="Match the term to its definition"
            pairs={lesson.level0.vocabulary.slice(0, 5) as [string, string][]}
          />
        </ConceptCard>
      )}

      {/* ===== SCIENCE METHOD VOCABULARY (universal) ===== */}
      <ConceptCard title="Science Method — Key Terms" icon={<Lightbulb className="w-6 h-6 text-sky-500" />}>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Every field of science uses the same method. Match each step to its meaning:
        </p>
        <MatchingActivity
          title="Match the scientific method term to its definition"
          pairs={[
            ['Hypothesis', 'An educated guess that can be tested'],
            ['Experiment', 'A test designed to answer a question'],
            ['Data', 'Information collected from observations'],
            ['Conclusion', 'What the evidence tells us'],
          ]}
        />
      </ConceptCard>

      {/* ===== STORY-SPECIFIC TRUE/FALSE ===== */}
      {lesson.level0?.trueFalse && lesson.level0.trueFalse.length > 0 && (
        <ConceptCard title={`Test Your Knowledge — ${lesson.stem.title}`} icon={<HelpCircle className="w-6 h-6 text-violet-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            How much do you know about {lesson.stem.title.toLowerCase()}? True or false:
          </p>
          {lesson.level0.trueFalse.map((tf, i) => (
            <TrueFalse key={i} statement={tf.statement} isTrue={tf.isTrue} explanation={tf.explanation} />
          ))}
        </ConceptCard>
      )}

      {/* ===== GENERAL TRUE/FALSE (universal) ===== */}
      <ConceptCard title="Test Your Intuition — Science Basics" icon={<HelpCircle className="w-6 h-6 text-sky-500" />}>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Some general science questions — what do you already know?
        </p>
        <TrueFalse
          statement="Scientists always know the answer before they start an experiment."
          isTrue={false}
          explanation="Scientists start with a hypothesis (a guess), then test it. The whole point of an experiment is to find out something you don't already know."
        />
        <TrueFalse
          statement="You can learn science from stories and everyday observations."
          isTrue={true}
          explanation="Many scientific discoveries started with someone noticing something in nature and asking 'why?' — exactly like the characters in these stories."
        />
      </ConceptCard>

      {/* ===== REAL WORLD CONNECTIONS ===== */}
      {lesson.stem.realWorld.length > 0 && (
        <ConceptCard title="In the Real World" icon={<Globe className="w-6 h-6 text-emerald-500" />}>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            The science in this story isn't just academic — it's being used right now:
          </p>
          <div className="space-y-3">
            {lesson.stem.realWorld.map((fact, i) => (
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
              <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-3">
                <strong>Story-specific activity:</strong>
              </p>
              <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed mb-4">
                {lesson.level0.offlineActivity}
              </p>
              <div className="border-t border-rose-200 dark:border-rose-800 pt-3 mt-3">
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-2">Also try these general activities:</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-3">
              <strong>Mini-project:</strong> After reading the story, try this with just a notebook and pen:
            </p>
          )}
          <ol className="space-y-2 text-sm text-rose-700 dark:text-rose-300">
            <li className="flex items-start gap-2"><span className="font-bold">1.</span> Write down 3 things from the story that surprised you.</li>
            <li className="flex items-start gap-2"><span className="font-bold">2.</span> Draw a picture of the main concept — what does {lesson.stem.title.toLowerCase()} look like?</li>
            <li className="flex items-start gap-2"><span className="font-bold">3.</span> Find one example in your own life or neighborhood.</li>
            <li className="flex items-start gap-2"><span className="font-bold">4.</span> Explain what you learned to someone in your own words.</li>
          </ol>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-4">
            Teaching someone else is the best way to check if you truly understand.
          </p>
        </div>
      </ConceptCard>

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
              <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                Ready to start coding? Switch to Level 1: Explorer →
              </p>
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
    </div>
  );
}
