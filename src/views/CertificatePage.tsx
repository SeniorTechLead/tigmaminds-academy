import { useRef, useState } from 'react';
import Link from 'next/link';
import { Award, Download, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProgress } from '../contexts/ProgressContext';
import { lessonsMeta } from '../data/lessons-meta';
import { SUBJECTS } from '../data/lesson-constants';
import type { Subject } from '../data/lesson-types';

export default function CertificatePage() {
  const { studentName, setStudentName, progress, getCompletedCount } = useProgress();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const completedStories = Object.entries(progress)
    .filter(([_, p]) => p.level1Complete && p.level2Complete)
    .map(([slug]) => lessonsMeta.find(l => l.slug === slug))
    .filter(Boolean);

  const subjectCompletions = SUBJECTS.map(s => ({
    ...s,
    completed: completedStories.filter(l => l?.subjects?.includes(s.key)).length,
    total: lessonsMeta.filter(l => l.subjects?.includes(s.key)).length,
  })).filter(s => s.completed > 0);

  const totalCompleted = getCompletedCount();
  const totalHours = totalCompleted * 12; // 12h per story (L1+L2)

  const handleDownload = () => {
    if (!certRef.current) return;
    // Use browser print for now
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
      <head><title>TigmaMinds Academy Certificate</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f4; }
        @media print { body { background: white; } }
      </style>
      </head>
      <body>${certRef.current.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/lessons" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Award className="w-10 h-10 text-amber-500" />
            Your Certificate
          </h1>

          {totalCompleted === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete at least one story (Level 1 + Level 2) to earn your certificate.
              </p>
              <Link href="/lessons" className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors">
                Start Learning
              </Link>
            </div>
          ) : (
            <>
              {/* Name input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your name (for the certificate)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full max-w-md px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Certificate preview */}
              <div ref={certRef} className="bg-white border-4 border-amber-400 rounded-2xl p-12 shadow-xl mb-8" style={{ maxWidth: '800px' }}>
                <div className="text-center">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white font-extrabold text-sm">TMA</span>
                      </div>
                      <div className="text-left">
                        <span className="text-xl font-bold text-gray-900">TigmaMinds</span>
                        <span className="block text-[9px] text-gray-500 tracking-[0.52em] uppercase font-medium">Academy</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Certificate of Achievement</p>

                  <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {studentName || 'Your Name Here'}
                  </h2>

                  <p className="text-gray-600 mb-6">
                    has successfully completed
                  </p>

                  <div className="bg-amber-50 rounded-xl p-6 mb-6 inline-block">
                    <p className="text-3xl font-bold text-amber-700">{totalCompleted} Stories</p>
                    <p className="text-sm text-amber-600">{totalHours} hours of interactive STEM learning</p>
                  </div>

                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    through the TigmaMinds Academy story-driven curriculum, covering{' '}
                    {subjectCompletions.map(s => s.key).join(', ')}.
                  </p>

                  {/* Subjects completed */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {subjectCompletions.map(s => (
                      <span key={s.key} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {s.icon} {s.key}: {s.completed}/{s.total}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-sm text-gray-500">
                    Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">tigmaminds.academy — Story-Driven STEM Education</p>
                  </div>
                </div>
              </div>

              {/* Download button */}
              <button
                onClick={handleDownload}
                disabled={!studentName}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
              {!studentName && (
                <p className="text-sm text-gray-500 mt-2">Enter your name above to enable download.</p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
