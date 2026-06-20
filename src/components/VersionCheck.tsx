'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

let knownBuildId: string | null = null;

/**
 * Auto-reloads live users when a new build is deployed, so nobody is stuck on a
 * stale bundle (and nobody has to clear their cache). Detects a new deploy three
 * ways: on a polling interval, when the tab regains focus, and on in-app
 * navigation. On change, reloads once.
 */
export default function VersionCheck() {
  const pathname = usePathname();
  const reloadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBuildId = async (): Promise<string | null> => {
      try {
        const res = await fetch('/api/build-id', { cache: 'no-store' });
        if (!res.ok) return null;
        const { buildId } = await res.json();
        return buildId ?? null;
      } catch {
        return null;
      }
    };

    const check = async () => {
      if (cancelled || reloadedRef.current) return;
      const buildId = await fetchBuildId();
      if (!buildId || cancelled) return;
      if (!knownBuildId) {
        knownBuildId = buildId; // first observation — establish baseline
        return;
      }
      if (buildId !== knownBuildId) {
        reloadedRef.current = true;
        window.location.reload();
      }
    };

    // 1) Establish baseline / check immediately on mount.
    check();

    // 2) Poll periodically so an idle open page still picks up a new deploy.
    const interval = setInterval(check, 60_000);

    // 3) Check when the user returns to the tab (cheap, catches deploys during idle).
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pathname]);

  return null;
}
