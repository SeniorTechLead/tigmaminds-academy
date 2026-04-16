'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

let knownBuildId: string | null = null;

export default function VersionCheck() {
  const pathname = usePathname();
  const checkCount = useRef(0);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/build-id', { cache: 'no-store' });
        if (!res.ok) return;
        const { buildId } = await res.json();

        if (!knownBuildId) {
          knownBuildId = buildId;
          return;
        }

        if (buildId !== knownBuildId) {
          window.location.reload();
        }
      } catch {}
    };

    // Skip the very first mount, check on subsequent navigations
    checkCount.current++;
    if (checkCount.current > 1) {
      check();
    } else {
      // Set the initial build ID
      fetch('/api/build-id', { cache: 'no-store' })
        .then(r => r.json())
        .then(({ buildId }) => { knownBuildId = buildId; })
        .catch(() => {});
    }
  }, [pathname]);

  return null;
}
