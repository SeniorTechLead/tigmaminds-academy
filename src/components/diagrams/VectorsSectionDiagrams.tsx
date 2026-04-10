'use client';
import { Suspense, lazy } from 'react';

const BoatRiverDiagram = lazy(() => import('./BoatRiverDiagram'));
const VectorBoatDiagram = lazy(() => import('./VectorBoatDiagram'));

/**
 * Combines both vector diagrams for the Vectors — Magnitude section:
 * 1. Static boat/river right triangle (matches the explanation text)
 * 2. Interactive drag-to-explore vector addition
 */
export default function VectorsSectionDiagrams() {
  return (
    <div className="space-y-3">
      <Suspense fallback={<div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse" />}>
        <BoatRiverDiagram />
      </Suspense>
      <Suspense fallback={<div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse" />}>
        <VectorBoatDiagram />
      </Suspense>
    </div>
  );
}
