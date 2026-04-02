declare const __APP_VERSION__: string;

const CHECK_INTERVAL = 60_000; // check every 60 seconds

export function useVersionCheck() {
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
        // New version deployed — reload on next navigation
        window.__TMA_STALE__ = true;
      }
    } catch {
      // Network error — ignore
    } finally {
      checking = false;
    }
  };

  // Check periodically
  setInterval(check, CHECK_INTERVAL);
  // Also check on visibility change (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
}

// Extend window type
declare global {
  interface Window {
    __TMA_STALE__?: boolean;
  }
}
