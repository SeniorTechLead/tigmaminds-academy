'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AuthPage from '../../src/views/AuthPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      }
    >
      <AuthPage />
    </Suspense>
  );
}
