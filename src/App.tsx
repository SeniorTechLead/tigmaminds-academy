import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useVersionCheck } from './hooks/useVersionCheck';

// Retry dynamic imports once — if chunk is stale, reload the page to get fresh index.html
function lazyWithRetry(factory: () => Promise<any>) {
  return lazy(() =>
    factory().catch(() => {
      window.location.reload();
      return new Promise(() => {}); // never resolves — page is reloading
    })
  );
}

// Reload if a new version was deployed and user navigates
function VersionGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    if (window.__TMA_STALE__) {
      window.location.reload();
    }
  }, [location.pathname]);
  return <>{children}</>;
}

const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ProgramsPage = lazyWithRetry(() => import('./pages/ProgramsPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const PrivacyPage = lazyWithRetry(() => import('./pages/PrivacyPage'));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage'));
const InstructorsPage = lazyWithRetry(() => import('./pages/InstructorsPage'));
const CareersPage = lazyWithRetry(() => import('./pages/CareersPage'));
const LessonsIndexPage = lazyWithRetry(() => import('./pages/LessonsIndexPage'));
const CertificatePage = lazyWithRetry(() => import('./pages/CertificatePage'));
const LessonPlanPage = lazyWithRetry(() => import('./pages/LessonPlanPage'));
const AuthPage = lazyWithRetry(() => import('./pages/AuthPage'));
const AccountSettingsPage = lazyWithRetry(() => import('./pages/AccountSettingsPage'));
const ReferencePage = lazyWithRetry(() => import('./pages/ReferencePage'));
const LessonPage = lazyWithRetry(() => import('./pages/LessonPage'));
const PlaygroundPage = lazyWithRetry(() => import('./pages/PlaygroundPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));
const PartnerPage = lazyWithRetry(() => import('./pages/PartnerPage'));
const CapstonePage = lazyWithRetry(() => import('./pages/CapstonePage'));

function App() {
  useVersionCheck();

  return (
    <Router>
      <VersionGate>
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
          <Route path="/account" element={<AccountSettingsPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/reference/:slug" element={<ReferencePage />} />
          <Route path="/lessons/:slug" element={<LessonPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/capstones" element={<CapstonePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </VersionGate>
    </Router>
  );
}

export default App;
