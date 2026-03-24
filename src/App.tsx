import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const MentorsPage = lazy(() => import('./pages/MentorsPage'));
const InstructorsPage = lazy(() => import('./pages/InstructorsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const CookiePage = lazy(() => import('./pages/CookiePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/cookies" element={<CookiePage />} />
          <Route path="/lessons/:slug" element={<LessonPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
