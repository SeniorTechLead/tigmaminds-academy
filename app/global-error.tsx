'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const isChunkError =
    error.message?.includes('Loading chunk') ||
    error.message?.includes('Failed to fetch dynamically imported module') ||
    error.message?.includes('ChunkLoadError') ||
    error.message?.includes('Loading CSS chunk');

  if (isChunkError) {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return null;
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">An unexpected error occurred.</p>
          <button
            onClick={() => reset()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
