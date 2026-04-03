import { useEffect } from 'react';

declare const __APP_VERSION__: string;

const CHECK_INTERVAL = 60_000;

export function useVersionCheck() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let checking = false;

    const check = async () => {
      if (checking) return;
      checking = true;
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        if (!res.ok) return;
        const { version } = await res.json();
        if (version && version !== __APP_VERSION__) {
          window.__TMA_STALE__ = true;
        }
      } catch {
        // Network error — ignore
      } finally {
        checking = false;
      }
    };

    const interval = setInterval(check, CHECK_INTERVAL);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}

declare global {
  interface Window {
    __TMA_STALE__?: boolean;
  }
}
