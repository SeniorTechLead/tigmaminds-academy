import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import HtmlPlayground from '../HtmlPlayground';
import { renderMarkdown } from '../MiniLesson';

interface WebLesson {
  title: string;
  concept: string;
  analogy?: string;
  storyConnection?: string;
  checkQuestion?: string;
  checkAnswer?: string;
  codeIntro?: string;
  code: string;
  challenge?: string;
  successHint?: string;
}


function WebMiniLesson({ lesson, number }: { lesson: WebLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L3-{number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.concept) }} />

        {lesson.analogy && (
          <div className="bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed"><strong>Think of it this way:</strong> {lesson.analogy}</p>
          </div>
        )}
        {lesson.storyConnection && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg px-4 py-3 mb-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed"><strong>In the story:</strong> {lesson.storyConnection}</p>
          </div>
        )}
        {lesson.checkQuestion && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-2">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Before you code — think about this:</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">{lesson.checkQuestion}</p>
                {lesson.checkAnswer && (
                  <button onClick={() => setShowAnswer(!showAnswer)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showAnswer ? 'Hide answer' : 'Show answer'}
                  </button>
                )}
                {showAnswer && lesson.checkAnswer && (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">{lesson.checkAnswer}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {lesson.codeIntro && (
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Now try it:</strong> {lesson.codeIntro}</p>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700">
        <HtmlPlayground starterCode={lesson.code} title={`Lesson ${number}`} previewHeight={250} />
      </div>

      {lesson.challenge && (
        <div className="px-6 py-3 bg-violet-50 dark:bg-violet-900/20 border-t border-violet-200 dark:border-violet-800">
          <p className="text-sm text-violet-800 dark:text-violet-300"><strong>Experiment:</strong> {lesson.challenge}</p>
        </div>
      )}
      {lesson.successHint && (
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-300"><CheckCircle className="w-4 h-4 inline mr-1" />{lesson.successHint}</p>
        </div>
      )}
    </div>
  );
}

export default function LibraryLevel3() {
  const lessons: WebLesson[] = [
    {
      title: 'React concepts — components as functions',
      concept: `Modern web apps aren't built as single monolithic HTML files. They're built from **components** — small, reusable, self-contained pieces of UI that compose together like LEGO bricks. React popularized this pattern, but the idea is universal.

A React component is just a **function that returns HTML** (technically JSX). Instead of writing one giant page, you write small functions: \`Header()\`, \`BookCard(book)\`, \`SearchBar()\`. Each manages its own markup and behavior. The framework calls these functions and assembles the result into a page.

**Why this matters:**
- **Reusability** — write \`BookCard\` once, render it 500 times with different data
- **Isolation** — a bug in \`SearchBar\` can't corrupt \`BookCard\`
- **Declarative UI** — you describe WHAT you want ("show a list of books"), not HOW to update the DOM step by step

The **Virtual DOM** is React's optimization trick: instead of touching the real DOM (which is slow), React builds a lightweight copy in memory, diffs it against the previous copy, and applies only the minimal changes. You never call \`document.createElement\` — React does it for you, efficiently.`,
      analogy: 'Dipankar\'s library has sections: fiction shelf, reference shelf, children\'s corner, check-out desk. Each section is a "component" — self-contained, with its own purpose, its own layout. If you rearrange the fiction shelf, the reference section is unaffected. Components work the same way: independent pieces that compose into a whole.',
      storyConnection: 'Dipankar didn\'t build one massive unorganized room. He created distinct sections — each with a clear purpose, each maintainable on its own. When he added a new section for science books, he didn\'t need to rebuild the whole library. That\'s component architecture.',
      checkQuestion: 'In vanilla JS, to add a new book card you\'d write: createElement, set className, set innerHTML, appendChild. In React you\'d write: <BookCard title="..." author="..." />. Which approach scales better when you have 500 books?',
      checkAnswer: 'React\'s declarative approach scales massively better. You map over an array: books.map(b => <BookCard {...b} />). The framework handles DOM creation, updates, and cleanup. In vanilla JS, you\'d write manual DOM manipulation 500 times — and handle every edge case of adding, removing, and reordering elements yourself.',
      codeIntro: 'Build a component system using vanilla JS functions that return HTML — the core idea behind React, without the framework.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }

  .library { max-width: 600px; margin: 0 auto; }
  .header { background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: white; padding: 16px 20px; border-radius: 12px 12px 0 0; }
  .header h1 { font-size: 18px; margin-bottom: 4px; }
  .header p { font-size: 12px; opacity: 0.85; }

  .book-grid { display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; padding: 16px; background: white; border-radius: 0 0 12px 12px;
    border: 1px solid #e2e8f0; border-top: none; }

  .book-card { border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 12px; transition: box-shadow 0.2s; cursor: pointer; }
  .book-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .book-card h3 { font-size: 13px; color: #1e293b; margin-bottom: 4px; }
  .book-card .author { font-size: 11px; color: #64748b; }
  .book-card .genre { display: inline-block; font-size: 10px;
    background: #ede9fe; color: #7c3aed; padding: 2px 8px;
    border-radius: 99px; margin-top: 8px; }

  .stats { display: flex; gap: 12px; margin-top: 12px; padding: 0 16px; }
  .stat { background: white; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 10px; flex: 1; text-align: center; }
  .stat .num { font-size: 20px; font-weight: 700; color: #7c3aed; }
  .stat .label { font-size: 10px; color: #64748b; }
</style>
</head>
<body>
<div id="app"></div>

<script>
// COMPONENT PATTERN: functions that return HTML strings
// This is the core idea behind React — UI as function of data

// Data (this would come from a database in production)
const books = [
  { title: "The River Dolphin's Secret", author: "Nabajit Sharma", genre: "Adventure" },
  { title: "Firefly Festival", author: "Joon Borah", genre: "Fantasy" },
  { title: "Muga Silk Is Golden", author: "Priya Kalita", genre: "Science" },
  { title: "Girl Who Spoke to Elephants", author: "Lena Das", genre: "Wildlife" },
  { title: "BrahmaNet", author: "Ankit Hazarika", genre: "Tech" },
  { title: "Dragonfly & Paddy Field", author: "Rumi Phukan", genre: "Nature" },
];

// COMPONENT 1: Header — a pure function of props
function Header(props) {
  return '<div class="header">' +
      '<h1>' + props.title + '</h1>' +
      '<p>' + props.subtitle + '</p>' +
    '</div>';
}

// COMPONENT 2: BookCard — renders one book
function BookCard(book) {
  return '<div class="book-card" onclick="alert(\\'Opening: ' + book.title + '\\')">' +
      '<h3>' + book.title + '</h3>' +
      '<div class="author">' + book.author + '</div>' +
      '<span class="genre">' + book.genre + '</span>' +
    '</div>';
}

// COMPONENT 3: Stats — derived from data
function Stats(books) {
  const genres = [...new Set(books.map(b => b.genre))];
  return '<div class="stats">' +
      '<div class="stat"><div class="num">' + books.length + '</div><div class="label">Books</div></div>' +
      '<div class="stat"><div class="num">' + genres.length + '</div><div class="label">Genres</div></div>' +
      '<div class="stat"><div class="num">' + (books.length * 42) + '</div><div class="label">Pages</div></div>' +
    '</div>';
}

// COMPOSITION: assemble components into a page
// React does this with JSX; we do it with template literals
function App() {
  return '<div class="library">' +
      Header({ title: "Dipankar's Digital Library", subtitle: books.length + ' books — component-driven UI' }) +
      '<div class="book-grid">' +
        books.map(book => BookCard(book)).join('') +
      '</div>' +
      Stats(books) +
    '</div>';
}

// RENDER: mount the app (React does this with ReactDOM.render)
document.getElementById('app').innerHTML = App();

// KEY INSIGHT: When data changes, just call App() again.
// React's Virtual DOM makes this efficient by diffing
// the old and new output, only touching what changed.
</script>
</body>
</html>`,
      challenge: 'Add a new component function called SearchBar() that takes a placeholder string and returns an input element. Insert it between Header and the book grid. Then filter the books array to only show books matching the search term.',
      successHint: 'You just built a component architecture from scratch. React, Vue, and Svelte all work on this principle: UI = f(data). Components are functions, data flows down, and the framework handles the DOM.',
    },
    {
      title: 'State management — reactivity from scratch',
      concept: `Components render data. But what happens when data **changes**? A user types in a search box, clicks a filter, adds a book to their reading list. The UI needs to **react** to these changes — hence the name React.

**State** is data that changes over time. React's \`useState\` hook gives a component a value and a setter function: \`const [count, setCount] = useState(0)\`. When you call \`setCount(1)\`, React re-renders ONLY the components that depend on \`count\`.

Under the hood, this is a **publish-subscribe** pattern:
1. State changes (publish)
2. Subscribers (components using that state) get notified
3. They re-render with the new value

For complex apps, you need patterns beyond local state:
- **Reducers** — centralize state updates: \`dispatch({ type: 'ADD_BOOK', payload: book })\` instead of scattered setters
- **Context** — share state across distant components without passing props through every level (prop drilling)
- **Immutability** — never mutate state directly; always create new objects, so React can detect changes via reference comparison`,
      analogy: 'A library checkout system is state management. The "state" is which books are checked out and to whom. When someone borrows a book, the state updates. The display board (UI) shows the current state. A reducer is the checkout desk — all changes go through one place with clear rules (borrow, return, renew). Context is the PA system — announcements heard everywhere without passing notes room to room.',
      storyConnection: 'Dipankar needed a system to track who borrowed which books. At first, he kept a single notebook (local state). But as the library grew, he needed a central register (reducer) and a way for any section to check availability without walking to the desk (context). His information architecture evolved with scale — just like state management in apps.',
      checkQuestion: 'You have a todo app with 100 items. A user marks item #47 as done. In vanilla JS, how do you update the UI? In React? Which is less error-prone?',
      checkAnswer: 'Vanilla JS: find the DOM element for item #47, toggle its class, update a counter somewhere else, maybe re-sort... you track every side effect manually. React: call setTodos(todos.map(t => t.id === 47 ? {...t, done: true} : t)). React diffs and updates only item #47\'s DOM node. Declarative wins because you describe the end state, not the transition steps.',
      codeIntro: 'Build a reactive state system from scratch — useState, reducers, and reactivity, all in plain JavaScript.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }
  .app { max-width: 500px; margin: 0 auto; }
  h2 { font-size: 16px; color: #1e293b; margin-bottom: 12px; }
  .section { background: white; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 16px; margin-bottom: 16px; }
  .section h3 { font-size: 13px; color: #7c3aed; margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: 0.5px; }
  button { background: #7c3aed; color: white; border: none; border-radius: 6px;
    padding: 6px 14px; cursor: pointer; font-size: 12px; margin: 3px; }
  button:hover { background: #6d28d9; }
  button.secondary { background: #e2e8f0; color: #475569; }
  button.secondary:hover { background: #cbd5e1; }
  .output { background: #f1f5f9; border-radius: 8px; padding: 10px;
    font-family: monospace; font-size: 12px; color: #334155;
    margin-top: 8px; white-space: pre-wrap; min-height: 40px; }
  .book-item { display: flex; align-items: center; gap: 8px; padding: 6px 0;
    border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .book-item.checked-out { opacity: 0.5; text-decoration: line-through; }
  .log { font-size: 11px; color: #64748b; line-height: 1.6; }
</style>
</head>
<body>
<div class="app">
  <h2>State Management Patterns</h2>

  <!-- Section 1: useState equivalent -->
  <div class="section">
    <h3>1. useState — local reactive state</h3>
    <div id="counter-app"></div>
  </div>

  <!-- Section 2: Reducer pattern -->
  <div class="section">
    <h3>2. useReducer — centralized state logic</h3>
    <div id="library-app"></div>
  </div>

  <!-- Section 3: Pub/Sub (Context equivalent) -->
  <div class="section">
    <h3>3. Context — shared state without prop drilling</h3>
    <div id="theme-app"></div>
  </div>
</div>

<script>
// ============================================
// PATTERN 1: useState — reactive local state
// ============================================
function createState(initialValue, renderFn) {
  let value = initialValue;
  const setState = (newValue) => {
    // Immutability: if function passed, call with current value
    value = typeof newValue === 'function' ? newValue(value) : newValue;
    renderFn(); // Re-render on state change (React does this automatically)
  };
  const getState = () => value;
  return [getState, setState];
}

// Counter using our useState
const [getCount, setCount] = createState(0, renderCounter);

function renderCounter() {
  document.getElementById('counter-app').innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;">' +
      '<button onclick="setCount(c => c - 1)">-</button>' +
      '<span style="font-size:24px;font-weight:700;min-width:40px;text-align:center;">' +
        getCount() +
      '</span>' +
      '<button onclick="setCount(c => c + 1)">+</button>' +
      '<button class="secondary" onclick="setCount(0)">Reset</button>' +
    '</div>' +
    '<div class="output">State: { count: ' + getCount() + ' }\
' +
    'React equivalent: const [count, setCount] = useState(0);</div>';
}

// ============================================
// PATTERN 2: Reducer — all state changes go through one function
// ============================================
const initialLibrary = {
  books: [
    { id: 1, title: "Dolphin's Secret", available: true },
    { id: 2, title: "Firefly Festival", available: true },
    { id: 3, title: "Muga Silk", available: true },
  ],
  log: [],
};

// The reducer: a pure function (state, action) => newState
function libraryReducer(state, action) {
  switch (action.type) {
    case 'CHECKOUT':
      return {
        ...state,  // spread = immutable update
        books: state.books.map(b =>
          b.id === action.id ? { ...b, available: false } : b
        ),
        log: [...state.log, 'Checked out: ' + action.title],
      };
    case 'RETURN':
      return {
        ...state,
        books: state.books.map(b =>
          b.id === action.id ? { ...b, available: true } : b
        ),
        log: [...state.log, 'Returned: ' + action.title],
      };
    case 'ADD_BOOK':
      const newId = Math.max(...state.books.map(b => b.id)) + 1;
      return {
        ...state,
        books: [...state.books, { id: newId, title: action.title, available: true }],
        log: [...state.log, 'Added: ' + action.title],
      };
    default:
      return state;
  }
}

const [getLibrary, setLibrary] = createState(initialLibrary, renderLibrary);

function dispatch(action) {
  setLibrary(state => libraryReducer(state, action));
}

function renderLibrary() {
  const state = getLibrary();
  const available = state.books.filter(b => b.available).length;
  document.getElementById('library-app').innerHTML =
    '<div>' + state.books.map(function(b) {
      return '<div class="book-item ' + (b.available ? '' : 'checked-out') + '">' +
        '<span style="flex:1">' + b.title + '</span>' +
        (b.available
          ? '<button onclick="dispatch({type:\\'CHECKOUT\\',id:' + b.id + ',title:\\'' + b.title + '\\'})">Borrow</button>'
          : '<button class="secondary" onclick="dispatch({type:\\'RETURN\\',id:' + b.id + ',title:\\'' + b.title + '\\'})">Return</button>'
        ) +
      '</div>';
    }).join('') +
    '</div>' +
    '<div style="margin-top:8px;font-size:12px;color:#64748b;">' +
      available + '/' + state.books.length + ' available' +
    '</div>' +
    '<div class="output">' + (state.log.length ? state.log.join('\
') : 'No actions yet — borrow a book!') + '</div>';
}

// ============================================
// PATTERN 3: Context — global shared state
// ============================================
const subscribers = new Set();

function createContext(initialValue) {
  let value = initialValue;
  return {
    get: () => value,
    set: (newVal) => {
      value = newVal;
      subscribers.forEach(fn => fn()); // notify ALL subscribers
    },
    subscribe: (fn) => { subscribers.add(fn); return () => subscribers.delete(fn); },
  };
}

const ThemeContext = createContext('light');

function renderTheme() {
  const theme = ThemeContext.get();
  const bg = theme === 'dark' ? '#1e293b' : '#ffffff';
  const fg = theme === 'dark' ? '#e2e8f0' : '#1e293b';
  document.getElementById('theme-app').innerHTML =
    '<div style="display:flex;gap:8px;margin-bottom:8px;">' +
      '<button onclick="ThemeContext.set(\\'light\\')">Light</button>' +
      '<button onclick="ThemeContext.set(\\'dark\\')">Dark</button>' +
      '<button onclick="ThemeContext.set(\\'sepia\\')">Sepia</button>' +
    '</div>' +
    '<div style="background:' + bg + ';color:' + fg + ';padding:12px;border-radius:8px;font-size:13px;' +
      'border:1px solid #e2e8f0;transition:all 0.3s;">' +
      '<strong>Preview:</strong> This panel reads from ThemeContext.' +
      '<br/>Any component can subscribe — no prop drilling needed.' +
      '<br/>Current theme: <strong>' + theme + '</strong>' +
    '</div>' +
    '<div class="output">Context value: "' + theme + '"\
' +
    'Any deeply nested component can call ThemeContext.get()\
' +
    'without receiving it as a prop through every parent.</div>';
}

ThemeContext.subscribe(renderTheme);

// Initial renders
renderCounter();
renderLibrary();
renderTheme();
</script>
</body>
</html>`,
      challenge: 'Add a fourth pattern section: implement a simple "store" that combines state, reducer, and context. Give it a subscribe method and a dispatch method. This is essentially what Redux does.',
      successHint: 'You built useState, useReducer, and useContext from scratch in ~80 lines of plain JavaScript. These three patterns handle 90% of state management in production React apps. The frameworks add optimization and ergonomics, but the core logic is exactly what you just wrote.',
    },
    {
      title: 'Database design — normalized tables and relationships',
      concept: `A library without a catalog is just a pile of books. A website without a database is just static HTML. **Database design** is deciding how to organize your data so it's fast to query, easy to update, and impossible to corrupt.

The key principle is **normalization** — don't repeat yourself. Instead of storing the author's full biography on every book record, store authors in a separate table and link them by ID. This means:
- Update the author's bio in ONE place, and all books reflect the change
- No risk of inconsistent data (one book says "born 1980", another says "born 1981")
- Less storage, faster writes

**Relationships** between tables:
- **One-to-many**: One author writes many books. \`books.author_id\` references \`authors.id\`
- **Many-to-many**: Books can have multiple genres, genres contain multiple books. Requires a junction table: \`book_genres(book_id, genre_id)\`
- **One-to-one**: One user has one profile. Could be the same table, but separation keeps things clean

**SQL** (Structured Query Language) is how you talk to the database:
- \`SELECT * FROM books WHERE genre = 'Science'\` — read
- \`INSERT INTO books (title, author_id) VALUES ('...', 3)\` — create
- \`JOIN\` — combine data from multiple tables in one query`,
      analogy: 'Normalization is like using a card catalog. Instead of writing the full author biography on every book\'s cover, you have one author card that all books reference. Change the author card once — done everywhere. Without normalization, you\'d update the biography on every single book individually.',
      storyConnection: 'Dipankar\'s physical catalog had cards for books, cards for authors, and cards for borrowers — three separate "tables" linked by ID numbers on each card. When an author published a new book, Dipankar added one book card and linked it to the existing author card. That\'s a normalized one-to-many relationship.',
      checkQuestion: 'You store books with author name directly: { title: "Dolphin", author: "Nabajit Sharma" }. The author changes their display name. How many records do you need to update?',
      checkAnswer: 'Every single book by that author. If they wrote 50 books, that\'s 50 updates. In a normalized schema with a separate authors table, it\'s exactly 1 update. This is why normalization matters: single source of truth eliminates cascading updates and inconsistency risks.',
      codeIntro: 'Build an in-memory relational database with normalized tables, foreign keys, and JOIN queries — all in JavaScript.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }
  .app { max-width: 600px; margin: 0 auto; }
  h2 { font-size: 16px; color: #1e293b; margin-bottom: 12px; }
  .tables { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .table-card { background: white; border: 1px solid #e2e8f0;
    border-radius: 10px; overflow: hidden; }
  .table-card.full-width { grid-column: 1 / -1; }
  .table-name { background: #7c3aed; color: white; padding: 8px 12px;
    font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f8fafc; padding: 6px 8px; text-align: left;
    color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
  td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  .fk { color: #7c3aed; font-weight: 600; }
  .query-section { background: white; border: 1px solid #e2e8f0;
    border-radius: 10px; padding: 16px; margin-bottom: 12px; }
  .query-section h3 { font-size: 13px; color: #7c3aed; margin-bottom: 8px; }
  .sql { background: #1e293b; color: #a5f3fc; padding: 10px; border-radius: 6px;
    font-family: monospace; font-size: 11px; margin-bottom: 10px; white-space: pre; overflow-x: auto; }
  .result { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;
    padding: 10px; font-size: 11px; }
  button { background: #7c3aed; color: white; border: none; border-radius: 6px;
    padding: 6px 14px; cursor: pointer; font-size: 12px; margin: 3px; }
  #query-output { margin-top: 10px; }
</style>
</head>
<body>
<div class="app">
  <h2>Normalized Database: Dipankar's Library</h2>

  <div class="tables">
    <div class="table-card">
      <div class="table-name">authors</div>
      <table>
        <tr><th>id</th><th>name</th><th>village</th></tr>
        <tr><td>1</td><td>Nabajit Sharma</td><td>Majuli</td></tr>
        <tr><td>2</td><td>Priya Kalita</td><td>Sualkuchi</td></tr>
        <tr><td>3</td><td>Joon Borah</td><td>Jorhat</td></tr>
      </table>
    </div>
    <div class="table-card">
      <div class="table-name">genres</div>
      <table>
        <tr><th>id</th><th>name</th></tr>
        <tr><td>1</td><td>Adventure</td></tr>
        <tr><td>2</td><td>Science</td></tr>
        <tr><td>3</td><td>Fantasy</td></tr>
        <tr><td>4</td><td>Wildlife</td></tr>
      </table>
    </div>
    <div class="table-card full-width">
      <div class="table-name">books</div>
      <table>
        <tr><th>id</th><th>title</th><th>author_id (FK)</th><th>year</th></tr>
        <tr><td>1</td><td>River Dolphin's Secret</td><td class="fk">1</td><td>2023</td></tr>
        <tr><td>2</td><td>Muga Silk Is Golden</td><td class="fk">2</td><td>2023</td></tr>
        <tr><td>3</td><td>Firefly Festival</td><td class="fk">3</td><td>2024</td></tr>
        <tr><td>4</td><td>The Sonar Cave</td><td class="fk">1</td><td>2024</td></tr>
      </table>
    </div>
    <div class="table-card full-width">
      <div class="table-name">book_genres (junction table — many-to-many)</div>
      <table>
        <tr><th>book_id (FK)</th><th>genre_id (FK)</th></tr>
        <tr><td class="fk">1</td><td class="fk">1</td></tr>
        <tr><td class="fk">1</td><td class="fk">4</td></tr>
        <tr><td class="fk">2</td><td class="fk">2</td></tr>
        <tr><td class="fk">3</td><td class="fk">3</td></tr>
        <tr><td class="fk">4</td><td class="fk">1</td></tr>
        <tr><td class="fk">4</td><td class="fk">2</td></tr>
      </table>
    </div>
  </div>

  <div class="query-section">
    <h3>Run SQL Queries (simulated)</h3>
    <button onclick="runQuery('all_books')">SELECT all books + authors</button>
    <button onclick="runQuery('by_author')">Books by Nabajit</button>
    <button onclick="runQuery('with_genres')">Books with genres (JOIN)</button>
    <button onclick="runQuery('genre_count')">Genre counts (GROUP BY)</button>
    <div id="query-output"></div>
  </div>
</div>

<script>
// In-memory "database" — normalized tables
const db = {
  authors: [
    { id: 1, name: "Nabajit Sharma", village: "Majuli" },
    { id: 2, name: "Priya Kalita", village: "Sualkuchi" },
    { id: 3, name: "Joon Borah", village: "Jorhat" },
  ],
  books: [
    { id: 1, title: "River Dolphin's Secret", author_id: 1, year: 2023 },
    { id: 2, title: "Muga Silk Is Golden", author_id: 2, year: 2023 },
    { id: 3, title: "Firefly Festival", author_id: 3, year: 2024 },
    { id: 4, title: "The Sonar Cave", author_id: 1, year: 2024 },
  ],
  genres: [
    { id: 1, name: "Adventure" }, { id: 2, name: "Science" },
    { id: 3, name: "Fantasy" }, { id: 4, name: "Wildlife" },
  ],
  book_genres: [
    { book_id: 1, genre_id: 1 }, { book_id: 1, genre_id: 4 },
    { book_id: 2, genre_id: 2 }, { book_id: 3, genre_id: 3 },
    { book_id: 4, genre_id: 1 }, { book_id: 4, genre_id: 2 },
  ],
};

// SQL-like query functions
function innerJoin(left, right, leftKey, rightKey) {
  return left.flatMap(l =>
    right.filter(r => l[leftKey] === r[rightKey]).map(r => ({ ...l, ...r }))
  );
}

function runQuery(type) {
  let sql, result;

  switch (type) {
    case 'all_books':
      sql = "SELECT books.title, authors.name AS author\
FROM books\
INNER JOIN authors ON books.author_id = authors.id";
      result = innerJoin(db.books, db.authors, 'author_id', 'id')
        .map(function(r) { return '  ' + r.title + ' — by ' + r.name; }).join('\
');
      break;

    case 'by_author':
      sql = "SELECT title, year FROM books\
WHERE author_id = 1  -- Nabajit Sharma";
      result = db.books.filter(b => b.author_id === 1)
        .map(function(b) { return '  ' + b.title + ' (' + b.year + ')'; }).join('\
');
      break;

    case 'with_genres':
      sql = "SELECT books.title, genres.name AS genre\
FROM books\
JOIN book_genres ON books.id = book_genres.book_id\
JOIN genres ON book_genres.genre_id = genres.id";
      result = db.book_genres.map(bg => {
        const book = db.books.find(b => b.id === bg.book_id);
        const genre = db.genres.find(g => g.id === bg.genre_id);
        return '  ' + book.title + ' → ' + genre.name;
      }).join('\
');
      break;

    case 'genre_count':
      sql = "SELECT genres.name, COUNT(*) AS book_count\
FROM book_genres\
JOIN genres ON book_genres.genre_id = genres.id\
GROUP BY genres.name";
      const counts = {};
      db.book_genres.forEach(bg => {
        const g = db.genres.find(g => g.id === bg.genre_id).name;
        counts[g] = (counts[g] || 0) + 1;
      });
      result = Object.entries(counts).map(function(e) { return '  ' + e[0] + ': ' + e[1] + ' book(s)'; }).join('\
');
      break;
  }

  document.getElementById('query-output').innerHTML =
    '<div class="sql">' + sql + '</div>' +
    '<div class="result"><strong>Result (' + result.split('\
').length + ' rows):</strong>\
' + result + '</div>';
}
</script>
</body>
</html>`,
      challenge: 'Add a "borrowers" table and a "checkouts" table (borrower_id, book_id, checkout_date, return_date). Write a query that shows currently checked-out books with borrower names. This is how a real library management system works.',
      successHint: 'You just implemented a relational database with foreign keys, JOIN queries, and GROUP BY aggregation — all in plain JavaScript objects. PostgreSQL, MySQL, and SQLite do the same thing, just faster and on disk instead of memory.',
    },
    {
      title: 'REST API patterns — the language between frontend and backend',
      concept: `Your frontend (the HTML/JS you've been writing) and your backend (the database server) need a common language. **REST** (Representational State Transfer) defines that language.

A REST API is a set of **endpoints** — URLs that accept specific **HTTP methods** and return structured data:
- \`GET /api/books\` — list all books (READ)
- \`GET /api/books/3\` — get book with id=3 (READ one)
- \`POST /api/books\` — create a new book (CREATE), data in request body
- \`PUT /api/books/3\` — update book 3 (UPDATE), full replacement
- \`PATCH /api/books/3\` — partial update (change just the title)
- \`DELETE /api/books/3\` — remove book 3 (DELETE)

These map to **CRUD** operations on the database. The HTTP method tells the server WHAT to do; the URL tells it WHICH resource; the body tells it WITH WHAT data.

**Status codes** tell the client what happened:
- \`200\` — success
- \`201\` — created (after POST)
- \`400\` — bad request (your fault — invalid data)
- \`401\` — unauthorized (not logged in)
- \`404\` — not found
- \`500\` — server error (our fault)

**JSON** is the standard format for request and response bodies. The entire modern web runs on REST + JSON.`,
      analogy: 'REST is like a restaurant. The menu (API documentation) lists what you can order. You don\'t walk into the kitchen — you give the waiter (HTTP request) your order (method + endpoint + data). The kitchen (server) processes it and returns your meal (response with status code). GET = "What do you have?" POST = "I\'d like to order this." DELETE = "Cancel my order."',
      storyConnection: 'Dipankar\'s library had a strict checkout process: fill out a request slip (the request body), give it to the librarian (the server), who checks the catalog (database), and either hands you the book (200 OK) or tells you it\'s checked out (409 Conflict). A REST API formalizes exactly this kind of structured interaction.',
      checkQuestion: 'A client sends: POST /api/books with body { "title": "New Book" } but forgets the required "author_id" field. What status code should the server return?',
      checkAnswer: '400 Bad Request — the client sent invalid data (missing required field). The response body should explain what\'s wrong: { "error": "author_id is required" }. Never return 500 for client mistakes — that\'s reserved for actual server failures. Clear error messages are part of good API design.',
      codeIntro: 'Build a mock REST API server entirely in the browser — with proper HTTP methods, status codes, and JSON responses.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }
  .app { max-width: 600px; margin: 0 auto; }
  h2 { font-size: 16px; color: #1e293b; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #64748b; margin-bottom: 16px; }
  .endpoint-list { display: grid; gap: 6px; margin-bottom: 16px; }
  .endpoint { display: flex; align-items: center; gap: 8px; background: white;
    border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px;
    cursor: pointer; transition: all 0.15s; }
  .endpoint:hover { border-color: #7c3aed; background: #faf5ff; }
  .method { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;
    min-width: 48px; text-align: center; }
  .method.get { background: #dcfce7; color: #166534; }
  .method.post { background: #dbeafe; color: #1e40af; }
  .method.put { background: #fef3c7; color: #92400e; }
  .method.delete { background: #fecdd3; color: #9f1239; }
  .path { font-family: monospace; font-size: 12px; color: #334155; flex: 1; }
  .desc { font-size: 11px; color: #94a3b8; }
  .response-panel { background: white; border: 1px solid #e2e8f0;
    border-radius: 10px; overflow: hidden; }
  .req-header { background: #1e293b; color: #94a3b8; padding: 10px 14px;
    font-family: monospace; font-size: 11px; }
  .req-header .method-label { color: #a5f3fc; font-weight: 700; }
  .req-header .url { color: #fde68a; }
  .req-header .status { float: right; }
  .req-header .status.ok { color: #86efac; }
  .req-header .status.err { color: #fca5a5; }
  .res-body { padding: 12px; font-family: monospace; font-size: 11px;
    color: #334155; white-space: pre-wrap; max-height: 200px; overflow-y: auto;
    background: #f8fafc; }
</style>
</head>
<body>
<div class="app">
  <h2>REST API: Library Service</h2>
  <p class="subtitle">Click an endpoint to see the request/response cycle</p>

  <div class="endpoint-list">
    <div class="endpoint" onclick="callAPI('GET', '/api/books')">
      <span class="method get">GET</span>
      <span class="path">/api/books</span>
      <span class="desc">List all</span>
    </div>
    <div class="endpoint" onclick="callAPI('GET', '/api/books/1')">
      <span class="method get">GET</span>
      <span class="path">/api/books/1</span>
      <span class="desc">Get one</span>
    </div>
    <div class="endpoint" onclick="callAPI('POST', '/api/books', {title:'Brahmaputra Tales',author_id:2})">
      <span class="method post">POST</span>
      <span class="path">/api/books</span>
      <span class="desc">Create</span>
    </div>
    <div class="endpoint" onclick="callAPI('PUT', '/api/books/1', {title:'River Dolphin Updated',author_id:1,year:2025})">
      <span class="method put">PUT</span>
      <span class="path">/api/books/1</span>
      <span class="desc">Update</span>
    </div>
    <div class="endpoint" onclick="callAPI('DELETE', '/api/books/3')">
      <span class="method delete">DELETE</span>
      <span class="path">/api/books/3</span>
      <span class="desc">Delete</span>
    </div>
    <div class="endpoint" onclick="callAPI('GET', '/api/books/999')">
      <span class="method get">GET</span>
      <span class="path">/api/books/999</span>
      <span class="desc">404 test</span>
    </div>
    <div class="endpoint" onclick="callAPI('POST', '/api/books', {title:'Oops'})">
      <span class="method post">POST</span>
      <span class="path">/api/books</span>
      <span class="desc">400 test (missing field)</span>
    </div>
  </div>

  <div class="response-panel">
    <div class="req-header" id="req-display">
      <span class="method-label">GET</span> <span class="url">/api/books</span>
      <span class="status ok" id="status-display">Click an endpoint above</span>
    </div>
    <div class="res-body" id="res-body">{ "message": "Select an API endpoint to test" }</div>
  </div>
</div>

<script>
// Mock database
let books = [
  { id: 1, title: "River Dolphin's Secret", author_id: 1, year: 2023 },
  { id: 2, title: "Muga Silk Is Golden", author_id: 2, year: 2023 },
  { id: 3, title: "Firefly Festival", author_id: 3, year: 2024 },
];
let nextId = 4;

// Mock REST API server — routes + handlers
function handleRequest(method, path, body) {
  // Route matching
  const listMatch = path === '/api/books';
  const itemMatch = path.match(/^\\/api\\/books\\/(\\d+)$/);

  // GET /api/books — list all
  if (method === 'GET' && listMatch) {
    return { status: 200, body: books };
  }

  // GET /api/books/:id — get one
  if (method === 'GET' && itemMatch) {
    const book = books.find(b => b.id === parseInt(itemMatch[1]));
    if (!book) return { status: 404, body: { error: "Book not found" } };
    return { status: 200, body: book };
  }

  // POST /api/books — create
  if (method === 'POST' && listMatch) {
    if (!body || !body.title || !body.author_id) {
      return { status: 400, body: { error: "Missing required fields: title, author_id" } };
    }
    const newBook = { id: nextId++, ...body, year: body.year || 2025 };
    books.push(newBook);
    return { status: 201, body: newBook };
  }

  // PUT /api/books/:id — full update
  if (method === 'PUT' && itemMatch) {
    const idx = books.findIndex(b => b.id === parseInt(itemMatch[1]));
    if (idx === -1) return { status: 404, body: { error: "Book not found" } };
    books[idx] = { id: books[idx].id, ...body };
    return { status: 200, body: books[idx] };
  }

  // DELETE /api/books/:id
  if (method === 'DELETE' && itemMatch) {
    const idx = books.findIndex(b => b.id === parseInt(itemMatch[1]));
    if (idx === -1) return { status: 404, body: { error: "Book not found" } };
    const deleted = books.splice(idx, 1)[0];
    return { status: 200, body: { deleted: deleted.title } };
  }

  return { status: 404, body: { error: "Route not found" } };
}

function callAPI(method, path, body) {
  const response = handleRequest(method, path, body);
  const isOk = response.status < 400;
  const statusText = {200:'OK',201:'Created',400:'Bad Request',404:'Not Found'}[response.status];

  document.getElementById('req-display').innerHTML =
    '<span class="method-label">' + method + '</span> <span class="url">' + path + '</span>' +
    (body ? '\
Body: ' + JSON.stringify(body) : '') +
    '<span class="status ' + (isOk ? 'ok' : 'err') + '" id="status-display">' + response.status + ' ' + statusText + '</span>';

  document.getElementById('res-body').textContent = JSON.stringify(response.body, null, 2);
}
</script>
</body>
</html>`,
      challenge: 'Add PATCH support — partial updates where only the fields in the request body are changed (unlike PUT which replaces the entire record). Then add a search endpoint: GET /api/books?search=dolphin that filters books by title.',
      successHint: 'You just built a REST API server in the browser. Real servers (Express, Django, Rails) do exactly the same thing: match routes, validate input, query the database, return JSON with status codes. The pattern is identical.',
    },
    {
      title: 'Authentication — securing the library',
      concept: `Dipankar's library is open to everyone for reading. But only registered members can borrow books, and only Dipankar can add or remove books. This is **authentication** (who are you?) and **authorization** (what can you do?).

**How authentication works on the web:**

1. **Password hashing** — NEVER store passwords in plain text. Hash them with bcrypt or Argon2: \`hash("password123")\` produces \`$2b$10$X7z...\` — a one-way transformation. To verify a login, hash the submitted password and compare hashes. Even if the database leaks, attackers can't reverse the hashes.

2. **Sessions** — after login, the server creates a session ID (random token), stores it in a database, and sends it as a cookie. Every subsequent request includes this cookie, so the server knows you're logged in. Logout = delete the session.

3. **JWT (JSON Web Tokens)** — alternative to sessions. After login, the server signs a token containing \`{user_id: 5, role: "member", exp: ...}\` with a secret key. The client stores this token and sends it in the \`Authorization\` header. The server verifies the signature — no database lookup needed. Trade-off: can't easily revoke a JWT before it expires.

4. **Authorization** — middleware that checks: "Is this user allowed to perform this action?" A member can borrow books; an admin can add/delete books. This is role-based access control (RBAC).`,
      analogy: 'A library card system: you register (create an account with hashed password), get a card with a unique ID (session token / JWT), show the card when borrowing (Authorization header), and the librarian checks your card\'s permissions (authorization middleware). Losing your card doesn\'t reveal your personal details — like a hash doesn\'t reveal the password.',
      storyConnection: 'When Dipankar\'s library grew, he couldn\'t personally know every borrower. He needed a system: membership cards (tokens), a register of who can borrow what (authorization), and a way to issue and revoke cards (session management). Trust at scale requires authentication.',
      checkQuestion: 'A user\'s password is "assam2024". The bcrypt hash stored in the database is "$2b$10$xK9z...". An attacker steals the database. Can they recover the password?',
      checkAnswer: 'Not directly — bcrypt is a one-way function. But they can try brute-force: hash common passwords and compare. "assam2024" is weak and would fall to a dictionary attack in hours. Strong passwords (16+ chars, random) would take centuries. This is why password complexity matters AND why you use slow hash functions (bcrypt, not MD5) — to make each guess expensive.',
      codeIntro: 'Build a complete authentication system: registration, login, session management, and protected routes — all client-side to see the mechanics.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }
  .app { max-width: 500px; margin: 0 auto; }
  h2 { font-size: 16px; color: #1e293b; margin-bottom: 12px; }
  .panel { background: white; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 16px; margin-bottom: 12px; }
  .panel h3 { font-size: 13px; color: #7c3aed; margin-bottom: 10px;
    text-transform: uppercase; letter-spacing: 0.5px; }
  input { width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0;
    border-radius: 6px; font-size: 13px; margin-bottom: 8px; }
  input:focus { outline: none; border-color: #7c3aed; }
  button { background: #7c3aed; color: white; border: none; border-radius: 6px;
    padding: 8px 16px; cursor: pointer; font-size: 12px; font-weight: 600; }
  button:hover { background: #6d28d9; }
  button.danger { background: #ef4444; }
  button.secondary { background: #e2e8f0; color: #475569; }
  .log { background: #1e293b; color: #a5f3fc; border-radius: 8px;
    padding: 12px; font-family: monospace; font-size: 11px;
    white-space: pre-wrap; max-height: 150px; overflow-y: auto; margin-top: 10px; }
  .status { padding: 8px 12px; border-radius: 8px; font-size: 12px;
    margin-bottom: 10px; }
  .status.auth { background: #dcfce7; color: #166534; }
  .status.unauth { background: #fef2f2; color: #991b1b; }
  .role-badge { display: inline-block; padding: 2px 8px; border-radius: 99px;
    font-size: 10px; font-weight: 600; }
  .role-badge.admin { background: #fef3c7; color: #92400e; }
  .role-badge.member { background: #dbeafe; color: #1e40af; }
</style>
</head>
<body>
<div class="app">
  <h2>Authentication System</h2>
  <div id="status-bar"></div>
  <div id="auth-ui"></div>
  <div class="panel">
    <h3>Security Log</h3>
    <div class="log" id="security-log">System initialized. No active session.</div>
  </div>
</div>

<script>
// =============================================
// MOCK AUTH SYSTEM — demonstrates real concepts
// =============================================

// "Database" of users
const usersDB = [];
let sessions = {};  // sessionId -> userId
let currentSession = null;

// Simple hash simulation (real systems use bcrypt)
// We XOR and base64 to show the concept — NOT cryptographically secure
function mockHash(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash + password.charCodeAt(i)) | 0;
  }
  return '$mock$' + Math.abs(hash).toString(36) + '$' + password.length;
}

function mockVerify(password, hash) {
  return mockHash(password) === hash;
}

// Generate session token
function generateToken() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// JWT-like token (simplified)
function createJWT(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 3600000 }));
  const sig = btoa('signed_with_secret');  // Real JWT uses HMAC-SHA256
  return header + '.' + body + '.' + sig;
}

function log(msg) {
  const el = document.getElementById('security-log');
  const time = new Date().toLocaleTimeString();
  el.textContent += '\
[' + time + '] ' + msg;
  el.scrollTop = el.scrollHeight;
}

function render() {
  const user = currentSession ? usersDB.find(u => u.id === sessions[currentSession]) : null;

  document.getElementById('status-bar').innerHTML = user
    ? '<div class="status auth">' +
        'Logged in as <strong>' + user.username + '</strong> ' +
        '<span class="role-badge ' + user.role + '">' + user.role + '</span>' +
        '&nbsp; Token: <code style="font-size:10px">' + currentSession.slice(0,20) + '...</code>' +
       '</div>'
    : '<div class="status unauth">Not authenticated — register or log in</div>';

  if (user) {
    // Protected dashboard
    document.getElementById('auth-ui').innerHTML =
      '<div class="panel">' +
        '<h3>Dashboard (Protected Route)</h3>' +
        '<p style="font-size:13px;color:#334155;margin-bottom:8px;">' +
          'Welcome, <strong>' + user.username + '</strong>! ' +
          'Role: <span class="role-badge ' + user.role + '">' + user.role + '</span>' +
        '</p>' +
        '<p style="font-size:12px;color:#64748b;margin-bottom:12px;">' +
          (user.role === 'admin'
            ? 'You can: borrow books, add books, delete books, manage users'
            : 'You can: borrow books, leave reviews') +
        '</p>' +
        '<button onclick="testProtectedAction(\\'borrow\\')">Borrow Book</button>' +
        '<button onclick="testProtectedAction(\\'add\\')" ' + (user.role !== 'admin' ? 'style="opacity:0.5"' : '') + '>Add Book (admin)</button>' +
        '<button onclick="testProtectedAction(\\'delete\\')" ' + (user.role !== 'admin' ? 'style="opacity:0.5"' : '') + '>Delete Book (admin)</button>' +
        '<br/><br/>' +
        '<button class="danger" onclick="logout()">Logout</button>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Token Details</h3>' +
        '<p style="font-size:11px;color:#64748b;margin-bottom:6px;">Session token stored as HTTP-only cookie:</p>' +
        '<code style="font-size:10px;word-break:break-all;color:#334155;">' + currentSession + '</code>' +
        '<p style="font-size:11px;color:#64748b;margin-top:8px;">JWT equivalent:</p>' +
        '<code style="font-size:10px;word-break:break-all;color:#334155;">' + createJWT({user_id: user.id, role: user.role}) + '</code>' +
      '</div>';
  } else {
    document.getElementById('auth-ui').innerHTML =
      '<div class="panel">' +
        '<h3>Register</h3>' +
        '<input id="reg-user" placeholder="Username" />' +
        '<input id="reg-pass" type="password" placeholder="Password (min 8 chars)" />' +
        '<select id="reg-role" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:8px;font-size:13px;">' +
          '<option value="member">Member</option>' +
          '<option value="admin">Admin (librarian)</option>' +
        '</select>' +
        '<button onclick="register()">Register</button>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Login</h3>' +
        '<input id="login-user" placeholder="Username" />' +
        '<input id="login-pass" type="password" placeholder="Password" />' +
        '<button onclick="login()">Login</button>' +
      '</div>';
  }
}

function register() {
  const username = document.getElementById('reg-user').value.trim();
  const password = document.getElementById('reg-pass').value;
  const role = document.getElementById('reg-role').value;

  if (!username || !password) { log('ERROR: Username and password required'); return; }
  if (password.length < 8) { log('ERROR: Password must be 8+ characters'); return; }
  if (usersDB.find(u => u.username === username)) { log('ERROR: Username taken'); return; }

  const hashedPassword = mockHash(password);
  const user = { id: usersDB.length + 1, username, password: hashedPassword, role };
  usersDB.push(user);

  log('REGISTER: Created user "' + username + '" (role: ' + role + ')');
  log('  Plain password: "' + password + '"');
  log('  Stored hash: "' + hashedPassword + '"');
  log('  The server NEVER stores the plain password');
  render();
}

function login() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const user = usersDB.find(u => u.username === username);

  if (!user) { log('LOGIN FAILED: User "' + username + '" not found (401)'); return; }

  const hashMatch = mockVerify(password, user.password);
  log('LOGIN ATTEMPT: "' + username + '"');
  log('  Submitted password hash: "' + mockHash(password) + '"');
  log('  Stored hash:            "' + user.password + '"');
  log('  Match: ' + hashMatch);

  if (!hashMatch) { log('  RESULT: 401 Unauthorized — wrong password'); return; }

  const token = generateToken();
  sessions[token] = user.id;
  currentSession = token;

  log('  RESULT: 200 OK — session created');
  log('  Token: ' + token);
  render();
}

function logout() {
  log('LOGOUT: Session ' + currentSession.slice(0,15) + '... destroyed');
  delete sessions[currentSession];
  currentSession = null;
  render();
}

function testProtectedAction(action) {
  const user = usersDB.find(u => u.id === sessions[currentSession]);
  if (action === 'borrow') {
    log('ACTION: ' + user.username + ' borrowed a book (200 OK)');
  } else if (user.role === 'admin') {
    log('ACTION: Admin ' + user.username + ' performed "' + action + '" (200 OK)');
  } else {
    log('ACTION DENIED: ' + user.username + ' tried "' + action + '" — role "' + user.role + '" insufficient (403 Forbidden)');
  }
}

render();
</script>
</body>
</html>`,
      challenge: 'Add a "password reset" flow: generate a random token, store it with an expiry time, and validate it when the user submits a new password. This is how "forgot password" emails work — the link contains a time-limited token.',
      successHint: 'You built registration, login, sessions, JWT concepts, password hashing, and role-based authorization. Real auth systems (Auth0, Supabase Auth, Passport.js) do the same thing with production-grade security — bcrypt instead of our mock hash, HTTP-only cookies, CSRF protection, rate limiting.',
    },
    {
      title: 'Deployment — from localhost to the world',
      concept: `Your app works on localhost. Now it needs to reach users. **Deployment** is the process of taking your code from a development machine to production servers that are fast, reliable, and secure.

**The build process:**
Your development code (JSX, TypeScript, SCSS) can't run in browsers directly. A bundler (Vite, Webpack) transforms it:
1. **Transpile** — convert JSX/TS to plain JS
2. **Bundle** — combine hundreds of files into a few optimized bundles
3. **Minify** — remove whitespace, shorten variables: \`calculateTotal\` becomes \`a\`
4. **Tree-shake** — remove unused code (imported a library but only used 1 function? Ship only that function)
5. **Output** — a \`dist/\` folder with \`index.html\`, \`main.abc123.js\`, \`style.def456.css\`

**CDN (Content Delivery Network):**
Your bundled files are uploaded to servers worldwide (Cloudflare, AWS CloudFront). A user in Assam gets files from a server in Mumbai (50ms), not Virginia (300ms). The hash in filenames (\`abc123\`) enables **cache busting** — browsers cache aggressively, but a new build gets a new hash, forcing a fresh download.

**CI/CD (Continuous Integration / Continuous Deployment):**
Automate everything: push code to GitHub → CI server runs tests → if tests pass → build → deploy to CDN. No manual uploads, no "it works on my machine." Every deploy is reproducible.
- **GitHub Actions** — CI/CD built into GitHub
- **Vercel / Netlify** — auto-deploy on every git push
- **Docker** — package your app + dependencies in a container that runs identically everywhere`,
      analogy: 'Building a physical library vs. opening it to the public. Development is construction — messy, tools everywhere, scaffolding up. The build step is finishing: paint, clean up, remove scaffolding. CDN is putting up road signs from every direction so visitors can find you quickly. CI/CD is having an automatic crew that inspects every change, fixes up the building, and opens the doors — no manual work needed.',
      storyConnection: 'Dipankar built his library in his backyard (localhost). But for the whole village to use it, he needed a real location (deployment), good roads (CDN), and a system to keep it maintained as he added new books (CI/CD). The jump from prototype to public is the hardest part — and the most important.',
      checkQuestion: 'Your production bundle is 2.5MB. Users on slow 3G connections (500KB/s) would wait 5 seconds for it to load. How would you reduce this?',
      checkAnswer: 'Code splitting: load only the code needed for the current page, lazy-load the rest. Tree shaking: remove unused library code. Compression: gzip/brotli reduces JS by ~70%. Image optimization: WebP instead of PNG. Together these can cut 2.5MB to under 500KB — a 1-second load. Performance is a feature.',
      codeIntro: 'Simulate a complete CI/CD pipeline: build, test, deploy — with a visual pipeline dashboard.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; background: #f8fafc; padding: 20px; }
  .app { max-width: 600px; margin: 0 auto; }
  h2 { font-size: 16px; color: #1e293b; margin-bottom: 4px; }
  .sub { font-size: 12px; color: #64748b; margin-bottom: 16px; }

  .pipeline { background: white; border: 1px solid #e2e8f0; border-radius: 12px;
    padding: 16px; margin-bottom: 16px; }
  .pipeline h3 { font-size: 13px; color: #7c3aed; margin-bottom: 12px; }
  .stage { display: flex; align-items: center; gap: 10px; padding: 8px;
    border-radius: 8px; margin-bottom: 6px; font-size: 12px; }
  .stage.pending { background: #f8fafc; color: #94a3b8; }
  .stage.running { background: #eff6ff; color: #1d4ed8; }
  .stage.success { background: #f0fdf4; color: #166534; }
  .stage.failed { background: #fef2f2; color: #991b1b; }
  .stage-icon { width: 24px; height: 24px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .pending .stage-icon { background: #e2e8f0; }
  .running .stage-icon { background: #bfdbfe; animation: pulse 1s infinite; }
  .success .stage-icon { background: #bbf7d0; }
  .failed .stage-icon { background: #fecdd3; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .stage-name { flex: 1; font-weight: 500; }
  .stage-time { font-family: monospace; font-size: 11px; }

  .build-output { background: #1e293b; color: #a5f3fc; border-radius: 8px;
    padding: 12px; font-family: monospace; font-size: 11px;
    white-space: pre-wrap; max-height: 180px; overflow-y: auto; margin-bottom: 12px; }
  .deploy-info { background: white; border: 1px solid #e2e8f0;
    border-radius: 12px; padding: 16px; }
  .deploy-info h3 { font-size: 13px; color: #7c3aed; margin-bottom: 10px; }
  .metric { display: flex; justify-content: space-between; padding: 6px 0;
    border-bottom: 1px solid #f1f5f9; font-size: 12px; }
  .metric .label { color: #64748b; }
  .metric .value { font-weight: 600; color: #1e293b; font-family: monospace; }
  button { background: #7c3aed; color: white; border: none; border-radius: 6px;
    padding: 10px 20px; cursor: pointer; font-size: 13px; font-weight: 600;
    display: block; width: 100%; margin-bottom: 16px; }
  button:hover { background: #6d28d9; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
</head>
<body>
<div class="app">
  <h2>CI/CD Pipeline: Dipankar's Library App</h2>
  <p class="sub">Push to main branch triggers automatic build & deploy</p>

  <button id="deploy-btn" onclick="startPipeline()">git push origin main</button>

  <div class="pipeline">
    <h3>Pipeline Stages</h3>
    <div id="stages"></div>
  </div>

  <div class="build-output" id="build-log">Waiting for push...</div>

  <div class="deploy-info" id="deploy-info" style="display:none;">
    <h3>Deployment Result</h3>
    <div id="deploy-metrics"></div>
  </div>
</div>

<script>
const stages = [
  { name: 'Checkout code', icon: '1', time: '2s' },
  { name: 'Install dependencies (npm ci)', icon: '2', time: '8s' },
  { name: 'Lint & type check', icon: '3', time: '3s' },
  { name: 'Run test suite (47 tests)', icon: '4', time: '6s' },
  { name: 'Build (vite build)', icon: '5', time: '4s' },
  { name: 'Deploy to CDN', icon: '6', time: '5s' },
];

const buildLogs = [
  // Stage 0: Checkout
  ['> git clone --depth 1 https://github.com/dipankar/library-app',
   '  Cloning into /tmp/build-7a3f...',
   '  HEAD is now at e4a1b2c "Add search feature"'],
  // Stage 1: Install
  ['> npm ci --prefer-offline',
   '  Installing 847 packages...',
   '  added 847 packages in 8.2s',
   '  node_modules: 142MB (dev) -> 23MB (prod)'],
  // Stage 2: Lint
  ['> npx tsc --noEmit && npx eslint src/',
   '  TypeScript: 0 errors in 34 files',
   '  ESLint: 0 warnings, 0 errors',
   '  All clear.'],
  // Stage 3: Test
  ['> npx vitest run --coverage',
   '  PASS src/components/BookCard.test.tsx (4 tests)',
   '  PASS src/api/books.test.ts (12 tests)',
   '  PASS src/auth/login.test.ts (8 tests)',
   '  PASS src/utils/search.test.ts (6 tests)',
   '  PASS src/db/queries.test.ts (17 tests)',
   '  Tests: 47 passed, 0 failed',
   '  Coverage: 91.3% statements, 87.2% branches'],
  // Stage 4: Build
  ['> npx vite build',
   '  vite v5.2.0 building for production...',
   '  transforming (127 modules)...',
   '  rendering chunks...',
   '  dist/index.html              0.45 kB',
   '  dist/assets/main.a3f8b2.js   142.3 kB (gzip: 46.1 kB)',
   '  dist/assets/vendor.e7c4d1.js  89.7 kB (gzip: 31.2 kB)',
   '  dist/assets/style.f2a9c3.css  12.4 kB (gzip: 3.8 kB)',
   '  Total: 244.9 kB (gzip: 81.1 kB)'],
  // Stage 5: Deploy
  ['> Uploading to CDN (Cloudflare Pages)...',
   '  Uploading 4 files...',
   '  Purging cache for dipankar-library.pages.dev',
   '  Setting headers: Cache-Control: max-age=31536000',
   '  Deploy complete!',
   '',
   '  URL: https://dipankar-library.pages.dev',
   '  Commit: e4a1b2c',
   '  Build time: 28s total'],
];

let running = false;

function renderStages(currentStage, stageState) {
  document.getElementById('stages').innerHTML = stages.map(function(s, i) {
    var state = 'pending';
    if (i < currentStage) state = 'success';
    else if (i === currentStage) state = stageState || 'running';
    var icon = state === 'success' ? '&#10003;' : state === 'running' ? '&#9654;' : s.icon;
    var time = i <= currentStage ? s.time : '';
    return '<div class="stage ' + state + '">' +
      '<div class="stage-icon">' + icon + '</div>' +
      '<span class="stage-name">' + s.name + '</span>' +
      '<span class="stage-time">' + time + '</span>' +
    '</div>';
  }).join('');
}

async function startPipeline() {
  if (running) return;
  running = true;
  document.getElementById('deploy-btn').disabled = true;
  document.getElementById('deploy-info').style.display = 'none';
  const logEl = document.getElementById('build-log');
  logEl.textContent = '';

  for (let i = 0; i < stages.length; i++) {
    renderStages(i, 'running');
    logEl.textContent += '\
--- ' + stages[i].name.toUpperCase() + ' ---\
';

    for (const line of buildLogs[i]) {
      await new Promise(r => setTimeout(r, 150));
      logEl.textContent += line + '\
';
      logEl.scrollTop = logEl.scrollHeight;
    }

    await new Promise(r => setTimeout(r, 300));
    renderStages(i + 1);
  }

  // Show deploy metrics
  document.getElementById('deploy-info').style.display = 'block';
  document.getElementById('deploy-metrics').innerHTML = [
    ['URL', 'dipankar-library.pages.dev'],
    ['Status', '200 OK (live)'],
    ['Bundle size', '244.9 kB (81.1 kB gzipped)'],
    ['Lighthouse score', '97 / 100'],
    ['TTFB (Mumbai)', '23ms'],
    ['TTFB (Guwahati)', '41ms'],
    ['TTFB (New York)', '89ms'],
    ['Cache', 'immutable (1 year, hash-busted)'],
    ['Pipeline time', '28s total'],
    ['Commit', 'e4a1b2c "Add search feature"'],
  ].map(function(e) { return '<div class="metric"><span class="label">' + e[0] + '</span><span class="value">' + e[1] + '</span></div>'; }).join('');

  running = false;
  document.getElementById('deploy-btn').disabled = false;
  document.getElementById('deploy-btn').textContent = 'Deploy again';
}

renderStages(-1);
</script>
</body>
</html>`,
      challenge: 'Add a "rollback" button that simulates reverting to the previous deployment. In production, this is usually: deploy the previous git commit, or switch the CDN to serve the previous build artifact. Fast rollbacks are critical when a deploy introduces a bug.',
      successHint: 'You just simulated the entire journey from git push to production: CI/CD pipeline, build optimization, CDN deployment, and performance metrics. This is how every professional web application ships — automated, tested, and fast. From a bamboo library in a village to a globally deployed web app.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 3: Full-Stack Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build production-grade web applications</span>
      </div>

      <div className="mb-8 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
        <p className="text-sm text-violet-800 dark:text-violet-300">
          These exercises build complete systems in live HTML/CSS/JS playgrounds. Each lesson implements a real engineering concept — component architecture, state management, databases, APIs, auth, and deployment — that powers every modern web application.
        </p>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <WebMiniLesson key={i} lesson={lesson} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
