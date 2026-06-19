'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ProgramsPage from '../../src/views/ProgramsPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      }
    >
      <ProgramsPage />
    </Suspense>
  );
}
