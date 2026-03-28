import { Link } from 'react-router-dom';
import { lessons } from '../../data/lessons';

interface Props {
  slugs: string[];
}

export default function StoryLinks({ slugs }: Props) {
  if (!slugs.length) return null;

  const matched = slugs
    .map((slug) => {
      const lesson = lessons.find((l) => l.slug === slug);
      if (!lesson) return null;
      return {
        slug,
        title: lesson.story.title,
        icon: lesson.stem.icon,
      };
    })
    .filter(Boolean) as { slug: string; title: string; icon: React.ComponentType<{ className?: string }> }[];

  if (!matched.length) return null;

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Related stories
      </p>
      <div className="flex flex-wrap gap-2">
        {matched.map(({ slug, title, icon: Icon }) => (
          <Link
            key={slug}
            to={`/lessons/${slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}
