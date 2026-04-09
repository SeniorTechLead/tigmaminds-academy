import type { Metadata } from 'next';
import '../src/index.css';
import { Providers } from './providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'TigmaMinds Academy — Learn STEM Through Stories',
  description: 'Programming, AI, and robotics taught through illustrated stories that make science feel like an adventure.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
