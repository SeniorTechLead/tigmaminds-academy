import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <p className="text-7xl font-bold text-amber-500 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link to="/lessons" className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <BookOpen className="w-4 h-4" /> Browse Lessons
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
