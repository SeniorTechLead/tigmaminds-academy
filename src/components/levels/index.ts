import { lazy, ComponentType } from 'react';

// Registry of level components per story slug
// Each story can have Level 1 (Explorer) and Level 2 (Builder) components
// Level 3 (Engineer) is a placeholder for now

interface LevelComponents {
  Level1?: ComponentType;
  Level2?: ComponentType;
}

const registry: Record<string, LevelComponents> = {
  'girl-who-spoke-to-elephants': {
    Level1: lazy(() => import('../ElephantLevel1')),
    Level2: lazy(() => import('../ElephantLevel2')),
  },
  'dragonfly-and-the-paddy-field': {
    Level1: lazy(() => import('./DragonflyLevel1')),
    Level2: lazy(() => import('./DragonflyLevel2')),
  },
  'boy-who-built-a-library': {
    Level1: lazy(() => import('./LibraryLevel1')),
    Level2: lazy(() => import('./LibraryLevel2')),
  },
  'firefly-festival-of-majuli': {
    Level1: lazy(() => import('./FireflyLevel1')),
    Level2: lazy(() => import('./FireflyLevel2')),
  },
  'river-dolphins-secret': {
    Level1: lazy(() => import('./DolphinLevel1')),
    Level2: lazy(() => import('./DolphinLevel2')),
  },
  'why-the-muga-silk-is-golden': {
    Level1: lazy(() => import('./MugaSilkLevel1')),
    Level2: lazy(() => import('./MugaSilkLevel2')),
  },
};

export function getLevelComponents(slug: string): LevelComponents {
  return registry[slug] || {};
}
