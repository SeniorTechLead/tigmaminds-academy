import type { Problem } from '../playground-problems';

const topicModules: Record<string, () => Promise<{ problems: Problem[] }>> = {
  'arduino-analog': () => import('./arduino-analog'),
  'arduino-digital': () => import('./arduino-digital'),
  'arduino-projects': () => import('./arduino-projects'),
  'arduino-sensors': () => import('./arduino-sensors'),
  'arduino-serial': () => import('./arduino-serial'),
  'arduino-timing': () => import('./arduino-timing'),
  'classes': () => import('./classes'),
  'css-layout': () => import('./css-layout'),
  'css-styling': () => import('./css-styling'),
  'data': () => import('./data'),
  'dictionaries': () => import('./dictionaries'),
  'error-handling': () => import('./error-handling'),
  'functions': () => import('./functions'),
  'html-animation': () => import('./html-animation'),
  'html-forms': () => import('./html-forms'),
  'html-responsive': () => import('./html-responsive'),
  'html-structure': () => import('./html-structure'),
  'js-dom': () => import('./js-dom'),
  'js-events': () => import('./js-events'),
  'lists': () => import('./lists'),
  'loops': () => import('./loops'),
  'math': () => import('./math'),
  'recursion': () => import('./recursion'),
  'sorting': () => import('./sorting'),
  'sql-aggregate': () => import('./sql-aggregate'),
  'sql-joins': () => import('./sql-joins'),
  'sql-modify': () => import('./sql-modify'),
  'sql-select': () => import('./sql-select'),
  'sql-subqueries': () => import('./sql-subqueries'),
  'strings': () => import('./strings'),
  'ts-arrays': () => import('./ts-arrays'),
  'ts-classes': () => import('./ts-classes'),
  'ts-enums': () => import('./ts-enums'),
  'ts-functions': () => import('./ts-functions'),
  'ts-generics': () => import('./ts-generics'),
  'ts-interfaces': () => import('./ts-interfaces'),
  'ts-unions': () => import('./ts-unions'),
  'ts-variables': () => import('./ts-variables'),
  'tuples-sets': () => import('./tuples-sets'),
};

export async function loadProblemsByTopic(topic: string): Promise<Problem[]> {
  const loader = topicModules[topic];
  if (!loader) return [];
  const mod = await loader();
  return mod.problems;
}

export async function loadProblem(slug: string, topic: string): Promise<Problem | null> {
  const problems = await loadProblemsByTopic(topic);
  return problems.find(p => p.slug === slug) || null;
}
