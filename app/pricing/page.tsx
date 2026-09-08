'use client';

import { Suspense } from 'react';
import PricingPage from '../../src/views/PricingPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PricingPage />
    </Suspense>
  );
}
