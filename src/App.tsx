import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const InstructorsPage = lazy(() => import('./pages/InstructorsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const LessonsIndexPage = lazy(() => import('./pages/LessonsIndexPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const LessonPlanPage = lazy(() => import('./pages/LessonPlanPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ReferencePage = lazy(() => import('./pages/ReferencePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Mentors page removed for launch — will restore with real mentor profiles */}
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/lessons" element={<LessonsIndexPage />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/plan" element={<LessonPlanPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/reference/:slug" element={<ReferencePage />} />
          <Route path="/lessons/:slug" element={<LessonPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
