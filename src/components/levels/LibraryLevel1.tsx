import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, HelpCircle } from 'lucide-react';
import HtmlPlayground from '../HtmlPlayground';

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

function renderMd(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-violet-700 dark:text-violet-300 text-xs font-mono">$1</code>');
}

function WebMiniLesson({ lesson, number }: { lesson: WebLesson; number: number }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div id={`L1-${number}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
      {/* Concept */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{number}</span>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
        </div>
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: renderMd(lesson.concept) }} />

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

      {/* Code intro */}
      {lesson.codeIntro && (
        <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-900 dark:text-white">Now try it:</strong> {lesson.codeIntro}</p>
        </div>
      )}

      {/* HTML Playground */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <HtmlPlayground starterCode={lesson.code} title={`Lesson ${number}`} previewHeight={250} />
      </div>

      {/* Challenge */}
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

export default function LibraryLevel1() {
  const lessons: WebLesson[] = [
    {
      title: 'HTML — giving content structure',
      concept: `When Dipankar built his bamboo library, the first thing he needed was **structure**: shelves to hold books, a sign to tell people what it was, sections for different categories. Without structure, it's just a pile of books on the ground.

**HTML** (HyperText Markup Language) does the same for a web page. It defines the **structure** of content: this is a heading, this is a paragraph, this is a list of books. HTML uses **tags** — labels wrapped in angle brackets like \`<h1>\`, \`<p>\`, \`<ul>\`. Each tag tells the browser what kind of content it contains.

The most important tags:
- \`<h1>\` to \`<h6>\` — headings (h1 is biggest)
- \`<p>\` — a paragraph of text
- \`<ul>\` and \`<li>\` — an unordered list and its items
- \`<a href="...">\` — a link to another page
- \`<img src="...">\` — an image`,
      analogy: 'HTML is the skeleton of a web page — bones, not skin. It says "here is a heading, here is a paragraph, here is a list" but says nothing about colors, fonts, or layout. Just like a building\'s frame tells you where the rooms are but not what color the walls will be.',
      storyConnection: 'Dipankar\'s bamboo library had structure: a sign at the top ("Bhalukpara Pustok Ghor"), shelves divided by category, and a rule painted on the side. The sign is an `<h1>`, each shelf category is an `<h2>`, and the rule is a `<p>`. The structure came first — decoration came later.',
      checkQuestion: 'What\'s the difference between <h1> and <p>? Why not just use <p> for everything?',
      checkAnswer: 'An <h1> is a heading — it tells both the reader AND the browser "this is the most important title on the page." A <p> is a paragraph. Using the right tags matters for accessibility (screen readers), search engines (Google reads your headings), and styling (headings are styled differently by default).',
      codeIntro: 'Build the homepage of Dipankar\'s library website.',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>Bhalukpara Pustok Ghor</title>
</head>
<body>
  <h1>Bhalukpara Pustok Ghor</h1>
  <p>Take a book, bring it back, tell a friend.</p>

  <h2>Available Books</h2>
  <ul>
    <li>Assamese Folktales</li>
    <li>Science for Beginners</li>
    <li>The River Dolphin's Secret</li>
  </ul>

  <h2>How It Works</h2>
  <p>Borrow any book for up to 2 weeks. Just write your name in the notebook by the door.</p>

  <p>Built with love by <strong>Dipankar</strong> of Bhalukpara.</p>
</body>
</html>`,
      challenge: 'Add a third <h2> section called "New Arrivals" with a list of 3 books you\'d want in a village library.',
      successHint: 'You just built a real HTML page. It\'s ugly — no colors, no layout, just content with structure. CSS (next lesson) will fix that.',
    },
    {
      title: 'CSS — making it beautiful',
      concept: `Dipankar's library was functional but plain. Then Bonti helped him paint the shelves, hang curtains, and add a colorful sign. The structure didn't change — but it went from "functional" to "inviting."

**CSS** (Cascading Style Sheets) does the same for HTML. It controls how things **look**: colors, fonts, spacing, borders, backgrounds. CSS rules have two parts:
- A **selector** — which HTML element to style (e.g., \`h1\`, \`p\`, \`.classname\`)
- **Properties** — what to change (e.g., \`color: green;\`, \`font-size: 24px;\`)

CSS is written inside \`<style>\` tags or in a separate file. One CSS rule can style every matching element on the page at once.`,
      analogy: 'If HTML is the skeleton, CSS is the clothing, makeup, and accessories. The same skeleton can look completely different depending on the styling. That\'s why websites can redesign without changing content — they only change the CSS.',
      storyConnection: 'When Dipankar\'s mother stitched old cloth into curtains and his father painted the bamboo, they were writing CSS for the physical library. The structure (bamboo frame, shelves) didn\'t change — the appearance did.',
      checkQuestion: 'If you write `h1 { color: red; }` in CSS, what happens? What about `p { color: red; }` — does it also affect the h1?',
      checkAnswer: 'The first rule makes ALL <h1> elements red. The second makes ALL <p> elements red. They don\'t affect each other — each selector targets specific elements. That\'s the "cascading" part of CSS: rules flow down to matching elements.',
      codeIntro: 'Add styling to make the library page look inviting.',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>Bhalukpara Pustok Ghor</title>
  <style>
    body {
      font-family: Georgia, serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fef3c7;
      color: #422006;
    }
    h1 {
      color: #92400e;
      border-bottom: 3px solid #d97706;
      padding-bottom: 10px;
    }
    h2 {
      color: #b45309;
      margin-top: 24px;
    }
    ul {
      background: white;
      padding: 16px 32px;
      border-radius: 8px;
      border: 1px solid #fbbf24;
    }
    li {
      padding: 4px 0;
    }
    strong {
      color: #92400e;
    }
  </style>
</head>
<body>
  <h1>📚 Bhalukpara Pustok Ghor</h1>
  <p>Take a book, bring it back, tell a friend.</p>

  <h2>Available Books</h2>
  <ul>
    <li>Assamese Folktales</li>
    <li>Science for Beginners</li>
    <li>The River Dolphin's Secret</li>
  </ul>

  <h2>How It Works</h2>
  <p>Borrow any book for up to 2 weeks. Write your name in the notebook by the door.</p>

  <p>Built with love by <strong>Dipankar</strong> of Bhalukpara.</p>
</body>
</html>`,
      challenge: 'Change the background-color to #f0fdf4 (light green) and the h1 color to #166534 (dark green). The whole mood changes with two edits.',
      successHint: 'Same HTML, completely different look. That\'s the power of CSS — separate structure from presentation.',
    },
    {
      title: 'Containers and layout — organizing the page',
      concept: `A real library doesn't have books floating randomly in space. They're organized in sections, on shelves, in rows. Web pages work the same way: you wrap content in **containers** (\`<div>\` elements) and use CSS to arrange them.

The modern way to lay out web pages is **Flexbox** — a CSS system that lets you put items in a row or column and control spacing, alignment, and wrapping. The key properties:
- \`display: flex;\` — turn a container into a flex container
- \`gap: 16px;\` — space between items
- \`flex-wrap: wrap;\` — allow items to wrap to next line
- \`justify-content: center;\` — center items horizontally`,
      analogy: 'Flexbox is like arranging books on a shelf. You decide: left-to-right or top-to-bottom? How much space between them? What happens when the shelf is full — stack on a new shelf or squeeze tighter? Flexbox answers all these questions with simple properties.',
      storyConnection: 'Dipankar arranged books by color because many had lost their covers. He created a visual system — a layout — that made the library navigable even without titles. Web layout does the same: arrange content so users can find what they need at a glance.',
      checkQuestion: 'If you have 5 book cards in a flex container that\'s 600px wide, and each card is 200px, what happens?',
      checkAnswer: 'Only 3 fit per row (3 × 200 = 600). With flex-wrap: wrap, the remaining 2 wrap to a second row. Without wrap, they\'d overflow or shrink. This is responsive design — content adapts to the available space.',
      codeIntro: 'Build a book catalog with card layout using Flexbox.',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, sans-serif;
      background: #1e1b4b;
      color: white;
      padding: 24px;
    }
    h1 { text-align: center; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #a5b4fc; margin-bottom: 24px; }

    .catalog {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
    }
    .book-card {
      background: #312e81;
      border-radius: 12px;
      padding: 20px;
      width: 170px;
      border: 1px solid #4338ca;
      transition: transform 0.2s;
    }
    .book-card:hover { transform: translateY(-4px); }
    .book-card h3 { font-size: 14px; margin-bottom: 8px; color: #c7d2fe; }
    .book-card p { font-size: 12px; color: #818cf8; }
    .tag {
      display: inline-block;
      background: #4338ca;
      color: #e0e7ff;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 99px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <h1>📚 Book Catalog</h1>
  <p class="subtitle">14 regular readers and growing</p>

  <div class="catalog">
    <div class="book-card">
      <h3>Assamese Folktales</h3>
      <p>Traditional stories from the Brahmaputra valley</p>
      <span class="tag">Fiction</span>
    </div>
    <div class="book-card">
      <h3>Science for Beginners</h3>
      <p>Physics, chemistry, and biology basics</p>
      <span class="tag">Science</span>
    </div>
    <div class="book-card">
      <h3>The River Dolphin</h3>
      <p>A story about listening and understanding</p>
      <span class="tag">Fiction</span>
    </div>
    <div class="book-card">
      <h3>Math Puzzles</h3>
      <p>Brain teasers and number games</p>
      <span class="tag">Math</span>
    </div>
    <div class="book-card">
      <h3>How Things Work</h3>
      <p>Machines, electricity, and everyday science</p>
      <span class="tag">Science</span>
    </div>
  </div>
</body>
</html>`,
      challenge: 'Add a 6th book card. Notice how Flexbox automatically wraps it. Then change gap from 16px to 32px — the cards spread out.',
      successHint: 'You built a responsive card layout — the same pattern used by Netflix, Amazon, and every modern web app. Flexbox handles the math of fitting items into available space.',
    },
    {
      title: 'Interactive elements — buttons and forms',
      concept: `A library isn't just a display — people interact with it. They search for books, borrow them, leave their name. Web pages are the same: **forms** let users type information, and **buttons** let them take actions.

HTML provides form elements:
- \`<input type="text">\` — a text field
- \`<button>\` — a clickable button
- \`<select>\` — a dropdown menu
- \`<form>\` — a container that groups inputs together

**JavaScript** makes these interactive. When someone clicks a button, JavaScript runs code in response — filter a list, show a message, send data to a server. It's the third layer: HTML (structure) + CSS (style) + JavaScript (behavior).`,
      analogy: 'HTML is the building. CSS is the paint and furniture. JavaScript is the staff — the people who respond when you walk in and ask "do you have any science books?" They hear your question (event), look through the shelves (process), and hand you a book (response).',
      storyConnection: 'Dipankar kept a notebook where borrowers wrote their names. That notebook was his "form" — structured input from users. Rina, his assistant librarian, managed the notebook — she was the "JavaScript" that processed the information and kept the library running.',
      checkQuestion: 'What happens when a user types in a text input and clicks a button, if there\'s no JavaScript?',
      checkAnswer: 'Nothing visible. The HTML creates the input and button, CSS makes them look nice, but without JavaScript there\'s no logic to respond to the click. The button is like a doorbell with no wiring — it looks right but doesn\'t work.',
      codeIntro: 'Add a search box that filters the book catalog.',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #fafaf9; padding: 24px; max-width: 500px; margin: 0 auto; }
    h1 { color: #292524; margin-bottom: 16px; font-size: 22px; }
    .search-box {
      width: 100%; padding: 10px 16px; border: 2px solid #d6d3d1;
      border-radius: 8px; font-size: 14px; margin-bottom: 16px;
      outline: none;
    }
    .search-box:focus { border-color: #7c3aed; }
    .book { padding: 12px; border-bottom: 1px solid #e7e5e4; }
    .book h3 { font-size: 14px; color: #1c1917; }
    .book p { font-size: 12px; color: #78716c; margin-top: 2px; }
    .book.hidden { display: none; }
    .count { font-size: 12px; color: #a8a29e; margin-bottom: 12px; }
  </style>
</head>
<body>
  <h1>📚 Search the Library</h1>
  <input class="search-box" type="text" placeholder="Type to search books..." id="search" oninput="filterBooks()">
  <p class="count" id="count">Showing all 5 books</p>

  <div id="books">
    <div class="book" data-title="assamese folktales">
      <h3>Assamese Folktales</h3>
      <p>Traditional stories from the Brahmaputra valley</p>
    </div>
    <div class="book" data-title="science for beginners">
      <h3>Science for Beginners</h3>
      <p>Physics, chemistry, and biology basics</p>
    </div>
    <div class="book" data-title="the river dolphin">
      <h3>The River Dolphin's Secret</h3>
      <p>A story about listening and understanding</p>
    </div>
    <div class="book" data-title="math puzzles">
      <h3>Math Puzzles</h3>
      <p>Brain teasers and number games</p>
    </div>
    <div class="book" data-title="how things work">
      <h3>How Things Work</h3>
      <p>Machines, electricity, and everyday science</p>
    </div>
  </div>

  <script>
    function filterBooks() {
      const query = document.getElementById('search').value.toLowerCase();
      const books = document.querySelectorAll('.book');
      let visible = 0;

      books.forEach(book => {
        const title = book.getAttribute('data-title');
        if (title.includes(query)) {
          book.classList.remove('hidden');
          visible++;
        } else {
          book.classList.add('hidden');
        }
      });

      document.getElementById('count').textContent =
        visible === books.length ? 'Showing all ' + books.length + ' books' :
        'Showing ' + visible + ' of ' + books.length + ' books';
    }
  </script>
</body>
</html>`,
      challenge: 'Try typing "science" in the search box — only matching books should appear. Add a 6th book and make sure search works with it too.',
      successHint: 'You just built a working search feature with HTML + CSS + JavaScript. The same pattern powers every search bar on the web — Google, Amazon, your email inbox.',
    },
    {
      title: 'Data and state — the borrowing system',
      concept: `A library catalog is **data**: a list of books, each with a title, author, category, and availability status. When someone borrows a book, the data changes — the book becomes unavailable. When they return it, it's available again.

In web development, data stored in your program is called **state**. JavaScript can hold state in variables and arrays, and update the page when state changes. This is the core pattern of every web app:
1. **Store** data in JavaScript (the "model")
2. **Display** it as HTML (the "view")
3. **Update** state when the user interacts (the "controller")
4. **Re-render** the display to match the new state

This pattern — Model-View-Controller — is the foundation of React, Vue, Angular, and every modern web framework.`,
      analogy: 'State is like the whiteboard in a classroom. The teacher writes today\'s schedule (initial state). When a class is cancelled, they erase it and write the update (state change). Everyone looking at the board sees the current state. JavaScript state works the same: your data is the whiteboard, and the page is the classroom looking at it.',
      storyConnection: 'Dipankar\'s meticulous notebook — who borrowed what, when it was returned, which books were most popular — was his state management system. Every entry changed the state of the library. The code below digitizes his notebook.',
      checkQuestion: 'If a book\'s status changes from "available" to "borrowed" in JavaScript, but the HTML isn\'t updated, what does the user see?',
      checkAnswer: 'The old state — they still see "available" even though the data says "borrowed." This is a rendering bug: state and view are out of sync. Every web framework exists to solve this problem automatically.',
      codeIntro: 'Build a borrow/return system for the library.',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #fafaf9; padding: 24px; max-width: 500px; margin: 0 auto; }
    h1 { color: #292524; margin-bottom: 4px; font-size: 20px; }
    .stats { font-size: 12px; color: #a8a29e; margin-bottom: 16px; }
    .book { display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e7e5e4; border-radius: 8px; margin-bottom: 8px; }
    .book h3 { font-size: 14px; color: #1c1917; }
    .book p { font-size: 11px; color: #78716c; }
    .btn { padding: 6px 14px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600; }
    .btn-borrow { background: #7c3aed; color: white; }
    .btn-borrow:hover { background: #6d28d9; }
    .btn-return { background: #f59e0b; color: white; }
    .btn-return:hover { background: #d97706; }
    .borrowed { opacity: 0.6; }
    .log { margin-top: 16px; padding: 12px; background: #f5f5f4; border-radius: 8px; font-size: 11px; color: #57534e; max-height: 120px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>📚 Bhalukpara Library</h1>
  <p class="stats" id="stats"></p>
  <div id="catalog"></div>
  <div class="log" id="log"></div>

  <script>
    // === STATE: the data ===
    const books = [
      { id: 1, title: 'Assamese Folktales', category: 'Fiction', available: true },
      { id: 2, title: 'Science for Beginners', category: 'Science', available: true },
      { id: 3, title: 'The River Dolphin', category: 'Fiction', available: false, borrower: 'Rina' },
      { id: 4, title: 'Math Puzzles', category: 'Math', available: true },
    ];
    const logs = ['Library opened'];

    // === VIEW: render state as HTML ===
    function render() {
      const catalog = document.getElementById('catalog');
      catalog.innerHTML = books.map(book => \`
        <div class="book \{book.available ? '' : 'borrowed'}">
          <div>
            <h3>\{book.title}</h3>
            <p>\{book.available ? '✓ Available' : '📖 Borrowed by ' + book.borrower}</p>
          </div>
          \{book.available
            ? '<button class="btn btn-borrow" onclick="borrowBook(' + book.id + ')">Borrow</button>'
            : '<button class="btn btn-return" onclick="returnBook(' + book.id + ')">Return</button>'}
        </div>
      \`).join('');

      const available = books.filter(b => b.available).length;
      document.getElementById('stats').textContent =
        available + ' of ' + books.length + ' books available';

      document.getElementById('log').innerHTML =
        logs.map(l => '<div>' + l + '</div>').join('');
    }

    // === CONTROLLER: update state on user action ===
    function borrowBook(id) {
      const name = prompt('Your name:');
      if (!name) return;
      const book = books.find(b => b.id === id);
      book.available = false;
      book.borrower = name;
      logs.unshift(name + ' borrowed "' + book.title + '"');
      render();  // re-render to show new state
    }

    function returnBook(id) {
      const book = books.find(b => b.id === id);
      logs.unshift(book.borrower + ' returned "' + book.title + '"');
      book.available = true;
      book.borrower = null;
      render();
    }

    render();  // initial render
  </script>
</body>
</html>`,
      challenge: 'Click "Borrow" on a book — it asks your name and updates the state. The button changes to "Return." This is a complete CRUD app (Create/Read/Update/Delete) in 60 lines.',
      successHint: 'You just built a web application with state management. The State → Render → Update → Re-render loop is the heart of React, Vue, and every modern framework. You wrote it from scratch.',
    },
    {
      title: 'Putting it all together — the full library website',
      concept: `You now have all the building blocks:
- **HTML** for structure (headings, lists, forms)
- **CSS** for styling (colors, layout, cards)
- **JavaScript** for behavior (search, borrow/return, state management)

A real web application combines all three into a cohesive experience. The final step before Level 2 (where you'll learn React and databases) is building a complete, polished page that brings everything together.

In Level 2, you'll learn:
- **React** — a framework that automates the state → render cycle
- **Databases** — persistent storage so data survives page refresh
- **APIs** — connecting frontend to backend
- **Authentication** — user login/signup`,
      storyConnection: 'Dipankar started with an empty bamboo shelf. Over time he added organization (structure), paint and curtains (style), a borrowing notebook (state), and an assistant librarian (interactivity). Your website followed the same evolution — from bare HTML to a working application.',
      checkQuestion: 'When you refresh the page in the borrowing system above, do the borrowed books stay borrowed?',
      checkAnswer: 'No. The state is stored in JavaScript variables, which reset on page refresh. This is why real apps need databases — persistent storage that survives restarts. That\'s Level 2.',
      codeIntro: 'Build the final version: a polished library homepage with catalog, search, and borrow system.',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #f5f3ff, #ede9fe); min-height: 100vh; }
    header { background: #4c1d95; color: white; padding: 20px 24px; text-align: center; }
    header h1 { font-size: 20px; margin-bottom: 4px; }
    header p { font-size: 12px; opacity: 0.8; }
    main { max-width: 600px; margin: 0 auto; padding: 20px; }
    .search { width: 100%; padding: 10px 16px; border: 2px solid #ddd6fe; border-radius: 8px; font-size: 14px; margin-bottom: 16px; outline: none; }
    .search:focus { border-color: #7c3aed; }
    .stats { display: flex; gap: 12px; margin-bottom: 16px; }
    .stat { flex: 1; background: white; padding: 12px; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat .num { font-size: 24px; font-weight: 700; color: #6d28d9; }
    .stat .label { font-size: 10px; color: #a8a29e; text-transform: uppercase; }
    .book { display: flex; justify-content: space-between; align-items: center; background: white; padding: 14px; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .book.unavail { opacity: 0.55; }
    .book h3 { font-size: 14px; color: #1c1917; }
    .book .meta { font-size: 11px; color: #78716c; margin-top: 2px; }
    .tag { font-size: 10px; background: #ede9fe; color: #6d28d9; padding: 1px 8px; border-radius: 99px; }
    .btn { padding: 6px 14px; border: none; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 600; }
    .btn-primary { background: #7c3aed; color: white; }
    .btn-secondary { background: #fbbf24; color: #78350f; }
  </style>
</head>
<body>
  <header>
    <h1>📚 Bhalukpara Pustok Ghor</h1>
    <p>Take a book, bring it back, tell a friend</p>
  </header>
  <main>
    <div class="stats" id="stats-bar"></div>
    <input class="search" type="text" placeholder="Search books..." oninput="render()">
    <div id="catalog"></div>
  </main>

  <script>
    const books = [
      { id: 1, title: 'Assamese Folktales', cat: 'Fiction', avail: true },
      { id: 2, title: 'Science for Beginners', cat: 'Science', avail: true },
      { id: 3, title: 'The River Dolphin', cat: 'Fiction', avail: false, who: 'Rina' },
      { id: 4, title: 'Math Puzzles', cat: 'Math', avail: true },
      { id: 5, title: 'How Things Work', cat: 'Science', avail: true },
      { id: 6, title: 'Grandmother\\'s Pitha Stories', cat: 'Fiction', avail: false, who: 'Joon' },
    ];

    function render() {
      const q = document.querySelector('.search').value.toLowerCase();
      const filtered = books.filter(b => b.title.toLowerCase().includes(q));
      const avail = books.filter(b => b.avail).length;

      document.getElementById('stats-bar').innerHTML = \`
        <div class="stat"><div class="num">\{books.length}</div><div class="label">Total Books</div></div>
        <div class="stat"><div class="num">\{avail}</div><div class="label">Available</div></div>
        <div class="stat"><div class="num">\{books.length - avail}</div><div class="label">Borrowed</div></div>
      \`;

      document.getElementById('catalog').innerHTML = filtered.map(b => \`
        <div class="book \{b.avail ? '' : 'unavail'}">
          <div>
            <h3>\{b.title} <span class="tag">\{b.cat}</span></h3>
            <p class="meta">\{b.avail ? '✓ Available' : '📖 Borrowed by ' + b.who}</p>
          </div>
          \{b.avail
            ? '<button class="btn btn-primary" onclick="borrow('+b.id+')">Borrow</button>'
            : '<button class="btn btn-secondary" onclick="ret('+b.id+')">Return</button>'}
        </div>
      \`).join('');
    }

    function borrow(id) {
      const name = prompt('Your name:');
      if (!name) return;
      const b = books.find(x => x.id === id);
      b.avail = false; b.who = name;
      render();
    }

    function ret(id) {
      const b = books.find(x => x.id === id);
      b.avail = true; b.who = null;
      render();
    }

    render();
  </script>
</body>
</html>`,
      challenge: 'This is a complete web app in one file. Try borrowing a book, searching while books are borrowed, returning them. Everything updates in real-time. Next step: React and a real database.',
      successHint: 'From empty HTML to a working web application — search, state management, responsive design, real-time updates. You\'ve covered the foundations that every web developer needs. Level 2 adds frameworks and persistence.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No coding experience needed</span>
      </div>

      <div className="mb-8 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
        <p className="text-sm text-violet-800 dark:text-violet-300">
          These exercises use a <strong>live HTML playground</strong> — edit the code on the left and see the result instantly on the right. No setup needed.
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
