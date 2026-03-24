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
};

export function getLevelComponents(slug: string): LevelComponents {
  return registry[slug] || {};
}
