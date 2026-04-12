import { useState } from 'react';
import { BookOpen, ChevronRight, CheckCircle, Circle, Database, Sparkles } from 'lucide-react';
import SqlPlayground from '../components/SqlPlayground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBasicsProgress } from '../contexts/BasicsProgressContext';
import {
  SelectWhereDiagram, OrderByDiagram, GroupByDiagram,
  JoinDiagram, SubqueryDiagram, MutateDiagram,
} from '../components/diagrams/SqlBasicsDiagrams';

const lessons = [
  {
    title: 'Your first query — asking the database a question',
    concept: `Every SQL query starts with a question: "Show me this data." The most basic command is **SELECT** — it tells the database what columns you want. **FROM** tells it which table to look in. **WHERE** filters the rows.

\`\`\`
SELECT name, age FROM elephants WHERE park = 'Kaziranga';
\`\`\`

This reads almost like English: "Select the name and age from the elephants table where the park is Kaziranga." That readability is what makes SQL powerful — you describe *what* you want, not *how* to get it.

Use \`SELECT *\` to get all columns. Use \`WHERE\` with comparisons like \`=\`, \`>\`, \`<\`, \`!=\`, and combine conditions with \`AND\` / \`OR\`. Text values go in single quotes: \`'Kaziranga'\`. Numbers do not need quotes.`,
    analogy: 'A SELECT query is like asking a librarian a question. "Show me all books (SELECT *) from the fiction shelf (FROM books) where the author is Ruskin Bond (WHERE author = \'Ruskin Bond\')." The librarian knows where everything is — you just describe what you want.',
    storyConnection: 'In "The Girl Who Spoke to Elephants," Tara tracked elephants across Kaziranga National Park. Every time a ranger spots an elephant, they log it in a database: name, age, weight, park. Your first SQL query retrieves that data — the same way a real wildlife database works.',
    starterCode: `-- See all elephants in the database
SELECT * FROM elephants;

-- Try this next: filter by park
-- SELECT name, age, weight_kg FROM elephants WHERE park_id = 1;`,
    challenge: 'Write a query that finds all elephants weighing more than 4000 kg. Then write another that finds elephants whose name starts with a specific letter (hint: use the LIKE operator with a wildcard %).',
    successHint: 'You just queried a database. Every website you use — from Instagram to Google Maps — runs SQL queries like this behind the scenes, thousands of times per second.',
  },
  {
    title: 'Sorting and limiting — finding the top and bottom',
    concept: `**ORDER BY** sorts your results. Add **ASC** for ascending (smallest first) or **DESC** for descending (largest first). The default is ASC.

\`\`\`
SELECT name, weight_kg FROM elephants ORDER BY weight_kg DESC;
\`\`\`

**LIMIT** restricts how many rows you get back. Combined with ORDER BY, it answers questions like "What are the top 3?" or "What is the single heaviest?"

\`\`\`
SELECT name, weight_kg FROM elephants ORDER BY weight_kg DESC LIMIT 3;
\`\`\`

You can sort by multiple columns: \`ORDER BY park_id ASC, weight_kg DESC\` sorts by park first, then by weight within each park. This layered sorting is essential when you have thousands of records and need to find patterns.`,
    analogy: 'ORDER BY is like sorting a deck of cards. You can arrange them by number (ascending) or reverse (descending). LIMIT is like saying "just show me the top 3 cards." Together, they let you quickly find the biggest, smallest, newest, or oldest of anything.',
    storyConnection: 'Rangers in Kaziranga need quick answers: "Which elephant is the heaviest?" "What are the 3 most recent sightings?" They cannot scroll through thousands of records. ORDER BY and LIMIT turn a wall of data into a focused answer.',
    starterCode: `-- Find the heaviest elephant
SELECT name, weight_kg FROM elephants ORDER BY weight_kg DESC LIMIT 1;

-- The 3 most recent sightings
SELECT * FROM sightings ORDER BY sighted_at DESC LIMIT 3;

-- Sort elephants by age, oldest first
SELECT name, age, weight_kg FROM elephants ORDER BY age DESC;`,
    challenge: 'Find the 5 youngest elephants. Then find the lightest elephant in the database. Finally, sort all sightings by date in ascending order (oldest first) and limit to the first 10.',
    successHint: 'ORDER BY and LIMIT are the bread and butter of data exploration. "Top 10 songs," "most recent posts," "highest scores" — they all use this exact pattern.',
  },
  {
    title: 'Counting and grouping — summarizing data',
    concept: `**Aggregate functions** crunch many rows into a single value:
- \`COUNT(*)\` — how many rows?
- \`SUM(column)\` — total of all values
- \`AVG(column)\` — average
- \`MIN(column)\` / \`MAX(column)\` — smallest / largest

\`\`\`
SELECT COUNT(*) FROM elephants;
SELECT AVG(weight_kg) FROM elephants;
\`\`\`

**GROUP BY** splits rows into groups and runs the aggregate on each group separately:

\`\`\`
SELECT park_id, COUNT(*) FROM elephants GROUP BY park_id;
\`\`\`

This gives you one row per park, with the count of elephants in each. **HAVING** filters groups (like WHERE, but for groups):

\`\`\`
SELECT park_id, COUNT(*) as total FROM elephants GROUP BY park_id HAVING total > 2;
\`\`\``,
    analogy: 'GROUP BY is like sorting students into houses, then counting each house. Instead of listing every student, you get "Gryffindor: 45, Slytherin: 40, Ravenclaw: 42, Hufflepuff: 38." One summary row per group — that is the power of GROUP BY.',
    storyConnection: 'A wildlife researcher studying Kaziranga does not care about individual elephant records — they need the big picture. "How many elephants per park?" "What is the average weight?" "Which park has the most sightings?" GROUP BY transforms raw logs into the summaries that drive conservation decisions.',
    starterCode: `-- Count all elephants
SELECT COUNT(*) as total_elephants FROM elephants;

-- Average weight
SELECT ROUND(AVG(weight_kg), 1) as avg_weight FROM elephants;

-- Count elephants per park
SELECT park_id, COUNT(*) as elephant_count
FROM elephants
GROUP BY park_id;

-- Parks with more than 2 elephants
SELECT park_id, COUNT(*) as elephant_count
FROM elephants
GROUP BY park_id
HAVING elephant_count > 2;`,
    challenge: 'Find the heaviest elephant in each park (use MAX with GROUP BY). Then calculate the total weight of all elephants combined. Finally, find the average age of elephants, rounded to one decimal place.',
    successHint: 'Aggregation is how raw data becomes insight. Every dashboard, report, and analytics tool runs GROUP BY queries behind the scenes. You now speak the language of data analysis.',
  },
  {
    title: 'Joining tables — connecting related data',
    concept: `Real databases split data across multiple tables to avoid repetition. The **elephants** table has a \`park_id\`, and the **parks** table has the park details. A **JOIN** connects them.

**INNER JOIN** returns only rows that match in both tables:

\`\`\`
SELECT elephants.name, parks.name as park_name
FROM elephants
INNER JOIN parks ON elephants.park_id = parks.id;
\`\`\`

**LEFT JOIN** returns all rows from the left table, even if there is no match on the right (unmatched columns get NULL):

\`\`\`
SELECT parks.name, elephants.name
FROM parks
LEFT JOIN elephants ON parks.id = elephants.park_id;
\`\`\`

The \`ON\` clause specifies which columns link the tables. Think of it as the "key" that unlocks the connection. Table aliases (\`e\` for elephants, \`p\` for parks) keep queries short and readable.`,
    analogy: 'A JOIN is like matching student IDs to their exam scores. The students table has names and IDs. The scores table has IDs and marks. JOIN connects them by ID so you can see "Ravi scored 85" instead of two disconnected lists. The ID column is the bridge.',
    storyConnection: 'When Tara tracks an elephant sighting, the database records the elephant ID, location, and date. But the elephant\'s name and age live in a different table. To build a useful sighting report — "Lakshmi (age 35) was spotted near the river on March 12" — you need to JOIN the sightings table with the elephants table. This is how real wildlife tracking databases work.',
    starterCode: `-- Connect elephants to their park names
SELECT e.name as elephant, e.age, p.name as park
FROM elephants e
INNER JOIN parks p ON e.park_id = p.id;

-- Show all sightings with elephant names
SELECT e.name as elephant, s.sighted_at, s.health_status
FROM sightings s
INNER JOIN elephants e ON s.elephant_id = e.id
ORDER BY s.sighted_at DESC;

-- LEFT JOIN: show all parks, even those with no elephants
SELECT p.name as park, e.name as elephant
FROM parks p
LEFT JOIN elephants e ON p.id = e.park_id;`,
    challenge: 'Write a query that joins all three tables: show the elephant name, park name, and sighting date for every sighting. Then use a LEFT JOIN to find parks that have zero elephant sightings (look for NULL values).',
    successHint: 'JOINs are the heart of relational databases. Without them, data would be trapped in isolated tables. With them, you can answer questions that span the entire database.',
  },
  {
    title: 'Filtering with subqueries — queries inside queries',
    concept: `A **subquery** is a SELECT inside another SELECT. It lets you filter based on the results of a separate query.

**WHERE IN (SELECT ...)** checks if a value is in a list produced by another query:

\`\`\`
SELECT name FROM elephants
WHERE id IN (SELECT elephant_id FROM sightings WHERE health_status = 'healthy');
\`\`\`

This first finds all elephant IDs with healthy sightings, then returns the names of those elephants. You could do this with a JOIN too, but subqueries are sometimes clearer.

**EXISTS** checks whether a subquery returns any rows at all:

\`\`\`
SELECT name FROM elephants e
WHERE EXISTS (SELECT 1 FROM sightings s WHERE s.elephant_id = e.id);
\`\`\`

This returns elephants that have at least one sighting. The subquery is **correlated** — it references the outer query's table (\`e.id\`), so it runs once per elephant.`,
    analogy: 'A subquery is like a two-step question. "Which students passed?" is one query. "Show me the names of students who passed" wraps that answer inside a bigger question. You first get the list of passing IDs, then use it to look up the names.',
    storyConnection: 'A park manager asks: "Which elephants have been sighted in more than one park?" This cannot be answered with a simple WHERE clause — you need to first count sightings per elephant, then filter. That is a subquery: one query finds the elephants with multiple sightings, and the outer query retrieves their details.',
    starterCode: `-- Elephants that have at least one sighting
SELECT name, age FROM elephants
WHERE id IN (SELECT DISTINCT elephant_id FROM sightings);

-- Elephants with NO sightings (never spotted)
SELECT name, age FROM elephants
WHERE id NOT IN (SELECT DISTINCT elephant_id FROM sightings);

-- Elephants heavier than the average weight
SELECT name, weight_kg FROM elephants
WHERE weight_kg > (SELECT AVG(weight_kg) FROM elephants);`,
    challenge: 'Write a subquery to find elephants that have been sighted more than once (hint: use GROUP BY and HAVING inside the subquery). Then find the park that has the most elephants using a subquery.',
    successHint: 'Subqueries let you compose simple questions into complex ones. Real-world SQL queries often nest 2-3 levels deep. You now have the skill to build queries that answer multi-step questions.',
  },
  {
    title: 'Creating and modifying — changing the database',
    concept: `So far, we have only read data. Now let us write.

**INSERT** adds new rows:
\`\`\`
INSERT INTO elephants (name, age, weight_kg, park_id)
VALUES ('Ganesha', 8, 2800, 1);
\`\`\`

**UPDATE** changes existing rows (always use WHERE or you will update every row!):
\`\`\`
UPDATE elephants SET weight_kg = 2900 WHERE name = 'Ganesha';
\`\`\`

**DELETE** removes rows (again, always use WHERE):
\`\`\`
DELETE FROM elephants WHERE name = 'Ganesha';
\`\`\`

**CREATE TABLE** builds a new table from scratch:
\`\`\`
CREATE TABLE rangers (id INTEGER PRIMARY KEY, name TEXT, park_id INTEGER);
\`\`\`

These are called **DML** (Data Manipulation Language) and **DDL** (Data Definition Language) commands. SELECT reads; INSERT/UPDATE/DELETE modify; CREATE/DROP define structure.`,
    analogy: 'If SELECT is reading a book, INSERT is writing a new page, UPDATE is correcting a typo, and DELETE is tearing out a page. CREATE TABLE is binding a brand new empty notebook. Each operation changes the book permanently — there is no automatic undo.',
    storyConnection: 'When a new elephant calf is born in Kaziranga, rangers add it to the database with INSERT. When they weigh an elephant during a health check, they UPDATE the record. If a record was entered by mistake, they DELETE it. And when the park starts tracking a new type of data — say, river water levels — they CREATE a new TABLE. These are the everyday operations of wildlife database management.',
    starterCode: `-- First, see what we have
SELECT * FROM elephants;

-- Add a new elephant
INSERT INTO elephants (name, age, weight_kg, park_id)
VALUES ('Ganesha', 8, 2800, 1);

-- Verify the insert
SELECT * FROM elephants WHERE name = 'Ganesha';

-- Update the weight after a health check
UPDATE elephants SET weight_kg = 2950 WHERE name = 'Ganesha';

-- Create a new table for ranger patrols
CREATE TABLE IF NOT EXISTS patrols (
  id INTEGER PRIMARY KEY,
  ranger_name TEXT NOT NULL,
  park_id INTEGER,
  patrol_date TEXT,
  elephants_seen INTEGER DEFAULT 0
);

-- Insert a patrol record
INSERT INTO patrols (ranger_name, park_id, patrol_date, elephants_seen)
VALUES ('Tara', 1, '2025-03-15', 4);

SELECT * FROM patrols;`,
    challenge: 'Insert 3 more patrol records for different rangers and dates. Then write an UPDATE to increase elephants_seen by 2 for Tara\'s patrol. Finally, write a query that JOINs patrols with parks to show the park name alongside each patrol.',
    successHint: 'You now have the complete SQL toolkit: read (SELECT), create (INSERT/CREATE), update (UPDATE), and delete (DELETE). These four operations are the foundation of every application that stores data — from social media to banking to wildlife conservation.',
  },
];

const COURSE_SLUG = 'sql-basics' as const;

export default function SqlBasicsPage() {
  const { markLessonComplete, isLessonComplete, getCompletedCount, isCourseComplete } = useBasicsProgress();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const completedCount = getCompletedCount(COURSE_SLUG);
  const courseComplete = isCourseComplete(COURSE_SLUG, lessons.length);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Database className="w-4 h-4" /> Prerequisite Course
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SQL Basics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never used a database before? Start here. 6 lessons that take you from zero to querying,
            joining, and modifying tables — using a wildlife tracking database from the stories you will explore.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 6 lessons</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> No experience needed</span>
            <span className="flex items-center gap-1"><Database className="w-4 h-4" /> Runs in your browser</span>
          </div>
        </div>

        {/* Progress overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{completedCount} / {lessons.length} lessons complete</span>
            {courseComplete && <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Course complete!</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-10">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
              <button
                key={i}
                onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                  ${expandedLesson === i
                    ? 'bg-emerald-600 text-white scale-110 shadow-lg'
                    : done
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/50'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                  }`}
                title={`${lesson.title}${done ? ' ✓' : ''}`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </button>
            );
          })}
        </div>

        {/* Lessons */}
        <div className="space-y-6">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
            <div key={i}>
              {/* Lesson header — always visible */}
              <button
                onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center gap-4
                  ${expandedLesson === i
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                    : done
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                  ${expandedLesson === i
                    ? 'bg-emerald-600 text-white'
                    : done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${expandedLesson === i ? 'text-emerald-700 dark:text-emerald-300' : done ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                    {lesson.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{lesson.challenge}</p>
                </div>
                {done && expandedLesson !== i && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">Complete</span>}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === i ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded lesson content */}
              {expandedLesson === i && (
                <div className="mt-4 ml-2 space-y-6">
                  {/* Interactive diagram */}
                  {[<SelectWhereDiagram />, <OrderByDiagram />, <GroupByDiagram />,
                    <JoinDiagram />, <SubqueryDiagram />, <MutateDiagram />][i]}

                  {/* Concept */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Lesson {i + 1}: {lesson.title}
                    </h3>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed">
                      {lesson.concept.split('\n\n').map((para, j) => {
                        if (para.startsWith('```')) {
                          const code = para.replace(/```\w*/g, '').trim();
                          return (
                            <pre key={j} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200">
                              {code}
                            </pre>
                          );
                        }
                        return (
                          <p key={j} className="mb-3 text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: para
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Analogy */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Analogy</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{lesson.analogy}</p>
                  </div>

                  {/* Story connection */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Story Connection</p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-200">{lesson.storyConnection}</p>
                  </div>

                  {/* SQL Playground */}
                  <SqlPlayground
                    starterCode={lesson.starterCode}
                    title={`Lesson ${i + 1}: ${lesson.title}`}
                  />

                  {/* Challenge */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Challenge</p>
                    <p className="text-sm text-blue-900 dark:text-blue-200">{lesson.challenge}</p>
                  </div>

                  {/* Success hint */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5">
                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1">When you succeed</p>
                    <p className="text-sm text-purple-900 dark:text-purple-200">{lesson.successHint}</p>
                  </div>

                  {/* Mark Complete button */}
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    {done ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Lesson complete</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => markLessonComplete(COURSE_SLUG, i)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    )}
                    {i < lessons.length - 1 && (
                      <button
                        onClick={() => { if (!done) markLessonComplete(COURSE_SLUG, i); setExpandedLesson(i + 1); }}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        Next lesson <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
          })}
        </div>

        {/* Completion CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for Level 1</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            After completing these 6 lessons, you have the SQL skills to work with real databases.
            Try applying what you learned in one of these stories:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'The Girl Who Spoke to Elephants', slug: 'girl-who-spoke-to-elephants' },
              { name: 'The River Dolphin\'s Secret', slug: 'river-dolphins-secret' },
              { name: 'The Firefly Festival of Majuli', slug: 'firefly-festival-majuli' },
            ].map(s => (
              <a
                key={s.slug}
                href={`/lessons/${s.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-400 transition-colors"
              >
                {s.name} <ChevronRight className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
