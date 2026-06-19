import type { Metadata } from 'next';
import lessonsMeta from '../../../src/data/lessons-meta.json';
import LessonClient from './LessonClient';

type Meta = {
  slug: string;
  storyTitle: string;
  tagline: string;
  illustration?: string;
};

const META = lessonsMeta as Meta[];

// Pre-generate a static shell per lesson so each page has its title/description
// in the server HTML (crawlers, link previews) while the body hydrates client-side.
export function generateStaticParams() {
  return META.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = META.find((l) => l.slug === slug);
  if (!lesson) {
    return { title: 'Lesson — TigmaMinds Academy' };
  }
  const title = `${lesson.storyTitle} — TigmaMinds Academy`;
  const description = lesson.tagline;
  const image = lesson.illustration ? `${lesson.illustration}?v=2` : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function Page() {
  return <LessonClient />;
}
