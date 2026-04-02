import { useState } from 'react';
import { Lock, LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  message?: string;
  compact?: boolean;
  returnTo?: string; // override the return URL after sign-in
}

export default function SignUpGate({
  message = 'Access all 130+ lessons, quizzes, and interactive tools',
  compact = false,
  returnTo,
}: Props) {
  const { signInWithGoogle } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const effectiveReturnTo = returnTo || window.location.pathname + window.location.search;

  const handleGoogle = () => {
    setRedirecting(true);
    signInWithGoogle(effectiveReturnTo);
  };

  if (compact) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-900/20 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{message}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleGoogle} disabled={redirecting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {redirecting ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Google...</> : 'Continue with Google'}
          </button>
          <Link
            to={`/auth?returnTo=${encodeURIComponent(effectiveReturnTo)}`}
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            or sign up with email
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-[2px] rounded-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl px-8 py-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign up free to keep learning
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
            {message}
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleGoogle} disabled={redirecting}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {redirecting ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Google...</> : 'Continue with Google'}
            </button>
            <Link
              to={`/auth?returnTo=${encodeURIComponent(effectiveReturnTo)}`}
              className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              <LogIn className="w-3.5 h-3.5" />
              or sign up with email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
