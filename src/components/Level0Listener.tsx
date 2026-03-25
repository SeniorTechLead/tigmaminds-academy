import { useState } from 'react';
import { BookOpen, HelpCircle, CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Lesson } from '../data/lessons';

interface Props {
  lesson: Lesson;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

function generateQuestions(lesson: Lesson): Question[] {
  // Generate comprehension questions based on the story and STEM content
  const questions: Question[] = [
    {
      question: `What is the main STEM topic connected to "${lesson.story.title}"?`,
      options: [
        lesson.stem.title,
        'Advanced Mathematics',
        'Space Exploration',
        'Ancient Languages',
      ],
      correct: 0,
      explanation: `This story connects to ${lesson.stem.title}. ${lesson.stem.description}`,
    },
    {
      question: 'What does STEM stand for?',
      options: [
        'Science, Technology, Engineering, Mathematics',
        'Stories, Teaching, Education, Methods',
        'Systems, Tools, Experiments, Models',
        'Study, Think, Explore, Make',
      ],
      correct: 0,
      explanation: 'STEM stands for Science, Technology, Engineering, and Mathematics — the four pillars of modern education and innovation.',
    },
    {
      question: `Which learning track does this story belong to?`,
      options: [
        lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Both Tracks',
        'Music Appreciation',
        'Creative Writing',
        'Physical Education',
      ],
      correct: 0,
      explanation: `This lesson is part of the ${lesson.track === 'school' ? '12-Month School Program for grades 6-12' : lesson.track === 'bootcamp' ? '24-Week Bootcamp for career changers' : 'both the school program and bootcamp'}.`,
    },
  ];

  // Add subject-specific questions
  if (lesson.subjects?.includes('Biology')) {
    questions.push({
      question: 'Biology is the study of...',
      options: ['Living things and how they work', 'Rocks and minerals', 'Stars and planets', 'Numbers and equations'],
      correct: 0,
      explanation: 'Biology is the scientific study of living organisms — from cells to ecosystems, from bacteria to blue whales.',
    });
  }
  if (lesson.subjects?.includes('Physics')) {
    questions.push({
      question: 'Physics helps us understand...',
      options: ['How the physical world works — forces, energy, waves, matter', 'Only how to build bridges', 'Just the weather', 'Only electricity'],
      correct: 0,
      explanation: 'Physics is the fundamental science of matter, energy, and their interactions. It explains everything from why apples fall to how light travels.',
    });
  }
  if (lesson.subjects?.includes('Computer Science')) {
    questions.push({
      question: 'What does a computer scientist do?',
      options: ['Solves problems using computation and algorithms', 'Only fixes broken computers', 'Just plays video games', 'Only builds websites'],
      correct: 0,
      explanation: 'Computer science is about solving problems — using logic, algorithms, and code to automate tasks, analyze data, and build systems.',
    });
  }
  if (lesson.subjects?.includes('Engineering')) {
    questions.push({
      question: 'Engineering is the practice of...',
      options: ['Designing and building things that solve problems', 'Only driving trains', 'Just fixing machines', 'Only drawing blueprints'],
      correct: 0,
      explanation: 'Engineers design, build, and optimize solutions — from bridges to microchips, from water systems to spacecraft.',
    });
  }
  if (lesson.subjects?.includes('Chemistry')) {
    questions.push({
      question: 'Chemistry studies...',
      options: ['What substances are made of and how they interact', 'Only explosions', 'Just cooking recipes', 'Only medicines'],
      correct: 0,
      explanation: 'Chemistry is the science of matter — what things are made of at the atomic level, and how substances combine, react, and transform.',
    });
  }

  // Always add a story comprehension question
  questions.push({
    question: `Why do we start with a story before learning the science?`,
    options: [
      'Stories make abstract concepts concrete and memorable',
      'Because stories are easier than science',
      'To waste time before the real learning',
      'Stories have nothing to do with science',
    ],
    correct: 0,
    explanation: 'Research shows that narrative context improves learning retention by up to 65%. Stories create emotional connections that make abstract concepts concrete, memorable, and meaningful.',
  });

  return questions.slice(0, 5); // Max 5 questions
}

export default function Level0Listener({ lesson }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const questions = generateQuestions(lesson);
  const q = questions[currentQ];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === q.correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 0: Listener
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding needed — just read, think, and answer</span>
      </div>

      {/* Story summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-sky-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">About This Story</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {lesson.story.tagline}
        </p>
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4">
          <p className="text-sm text-sky-800 dark:text-sky-300">
            <strong>STEM Connection:</strong> This story connects to <strong>{lesson.stem.title}</strong>. {lesson.stem.description}
          </p>
        </div>
      </div>

      {/* Comprehension quiz */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-500" />
            Comprehension Check
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQ + 1} / {questions.length}
          </span>
        </div>

        <div className="p-6">
          {completed ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-sky-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {score}/{questions.length} Correct!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {score === questions.length ? 'Perfect! You understand the story and its science connection.' :
                 score >= questions.length * 0.6 ? 'Great job! You have a solid understanding.' :
                 'Good start! Read the story again to deepen your understanding.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={restart} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Try Again
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 py-3">
                  Ready for more? Try Level 1: Explorer →
                </p>
              </div>
            </div>
          ) : (
            <>
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
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}
                    >
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
                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-sky-800 dark:text-sky-300">
                    <strong>{selectedAnswer === q.correct ? '✓ Correct!' : '✗ Not quite.'}</strong> {q.explanation}
                  </p>
                </div>
              )}

              {selectedAnswer !== null && (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${
                i < currentQ ? 'bg-sky-500' : i === currentQ ? 'bg-sky-300' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
