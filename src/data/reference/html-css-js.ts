import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'html-css-js',
  title: 'HTML / CSS / JavaScript',
  category: 'language',
  icon: '🌐',
  tagline: 'The three languages every website is built with',
  relatedStories: ['boy-who-built-a-library'],

  understand: [
    {
      title: 'What the Web Actually Is',
      beginnerContent:
        'When you visit a website, your browser (Chrome, Firefox, Safari) sends a request to a ' +
        'server somewhere in the world. The server sends back files — HTML, CSS, and JavaScript. ' +
        'Your browser reads these files and *renders* the page you see. Every website you have ever ' +
        'visited — Google, YouTube, Wikipedia — is built from these same three languages. The browser ' +
        'is like a kitchen: HTML is the ingredients list, CSS is the plating instructions, and ' +
        'JavaScript is the cooking process that transforms everything into the final dish.',
      intermediateContent:
        'The HTTP request/response cycle: your browser sends `GET /index.html HTTP/1.1` → the server responds with `HTTP/1.1 200 OK` and the HTML content. Status codes: 200=OK, 301=moved permanently, 404=not found, 500=server error. Chrome DevTools (F12) → Network tab shows every request, its size, and load time. A typical web page makes 50-100 requests (HTML, CSS, JS, images, fonts, analytics). **HTTPS** encrypts this traffic using TLS — the padlock icon means a man-in-the-middle cannot read your data. HTTP/2 multiplexes multiple requests over a single connection, and HTTP/3 uses QUIC (over UDP) for even faster connections.',
      advancedContent:
        'The **Document Object Model (DOM)** is a tree representation of the HTML that the browser constructs. JavaScript manipulates this tree: `document.getElementById("title").textContent = "New Title"` changes visible text without reloading the page. Modern frameworks (React, Vue, Svelte) use a **virtual DOM** — a lightweight JavaScript copy of the real DOM — to compute the minimal set of changes needed, then batch-apply them. This diffing algorithm (O(n) heuristic instead of O(n³) exact tree comparison) is what makes single-page applications feel fast. Web Components (Custom Elements, Shadow DOM, Templates) bring component-based architecture to vanilla HTML, reducing framework dependency.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each web technology to its role',
          pairs: [
            ['HTML', 'Defines the structure and content of the page'],
            ['CSS', 'Controls colors, fonts, spacing, and layout'],
            ['JavaScript', 'Makes the page interactive and dynamic'],
            ['Browser', 'Reads HTML/CSS/JS files and renders the page'],
            ['Server', 'Stores and sends website files when requested'],
          ],
        },
      },
    },
    {
      title: 'HTML — The Structure',
      beginnerContent:
        'HTML (HyperText Markup Language) defines *what* is on the page. It uses tags — words in ' +
        'angle brackets — to label content. `<h1>` says "this is a main heading." `<p>` says "this ' +
        'is a paragraph." `<img>` places an image. `<a href="...">` creates a clickable link. ' +
        'Tags usually come in pairs: `<p>Hello</p>` — the opening tag, the content, and the closing ' +
        'tag. The browser reads these tags from top to bottom and lays out the page accordingly. ' +
        'HTML does not control colors, fonts, or animations — that is CSS\'s job. HTML only says ' +
        '"there is a heading here, a paragraph here, an image here." Think of it as the blueprint ' +
        'of a house: it shows where the rooms and doors are, but not what color the walls are.',
      intermediateContent:
        'Semantic HTML elements convey meaning: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>. Screen readers rely on semantic elements to navigate. Forms: <form>, <input type="email" required>, <select>, <textarea>. The required and pattern attributes provide client-side validation. Tables use <table>, <thead>, <tbody>, <tr>, <th>, <td> — never for page layout. The <template> and <slot> elements enable Web Components — reusable custom HTML elements with encapsulated styles.',
      advancedContent:
        'Web accessibility (a11y) ensures websites work for everyone. WCAG 2.1 requires: text alternatives (alt attributes), keyboard navigability, color contrast (4.5:1 minimum), proper heading hierarchy. ARIA attributes (role, aria-label, aria-expanded) add semantics for complex widgets. India\'s Rights of Persons with Disabilities Act 2016 mandates accessibility. Progressive Enhancement builds a working base experience in HTML, then layers CSS and JavaScript on top — ensuring the site works even if scripts fail to load or assistive technology strips styling.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'HTML tags usually come in pairs, like <p> and </p>.', answer: true, explanation: 'Most HTML elements have an opening and closing tag. A few self-closing tags like <img> and <br> are exceptions.' },
            { text: 'HTML controls the colors and fonts on a web page.', answer: false, explanation: 'That is CSS\'s job. HTML only defines the structure and content — headings, paragraphs, images, links.' },
            { text: 'The <a> tag creates a clickable link to another page.', answer: true, explanation: 'The anchor tag <a href="..."> creates hyperlinks, the foundation of web navigation.' },
          ],
        },
      },
    },
    {
      title: 'CSS — The Style',
      beginnerContent:
        'CSS (Cascading Style Sheets) controls *how* things look. It uses rules that target HTML ' +
        'elements and apply visual properties. The rule `h1 { color: blue; font-size: 24px; }` ' +
        'makes all main headings blue and 24 pixels tall. You can target elements by tag name (h1), ' +
        'by class name (.card), or by ID (#header). CSS handles colors, fonts, spacing (margin and ' +
        'padding), layout (flexbox and grid), borders, shadows, and even animations. The "cascading" ' +
        'part means that multiple rules can apply to the same element, and the most specific rule ' +
        'wins. CSS is what makes the difference between a plain white page of text and a beautiful, ' +
        'professional website.',
      intermediateContent:
        'The CSS box model: content → padding → border → margin. box-sizing: border-box includes padding and border in width. Flexbox: display: flex; justify-content: space-between; align-items: center. Grid: display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem. Media queries for responsive design: @media (max-width: 768px) { .sidebar { display: none; } }. CSS transitions: transition: all 0.3s ease adds smooth animations to property changes.',
      advancedContent:
        'Modern CSS features: container queries (@container) style based on parent size, :has() selects parents based on children, CSS layers (@layer) control cascade ordering. CSS Custom Properties (--color: #2563eb) enable theming. The cascade resolves by specificity: inline (1000) > IDs (100) > classes (10) > elements (1). PostCSS and Tailwind CSS represent different approaches to CSS architecture — utility-first (small, composable classes) vs component-based (BEM methodology). CSS Houdini APIs let developers extend CSS with custom properties, layouts, and paint worklets.',
      diagram: 'CSSBoxModelDiagram',
    },
    {
      title: 'JavaScript — The Behavior',
      beginnerContent:
        'JavaScript makes pages *interactive*. Without it, a website is like a printed poster — you ' +
        'can look at it but not interact with it. JavaScript lets you respond to button clicks, ' +
        'validate form inputs, show/hide content, load new data without refreshing the page, create ' +
        'animations, and build entire applications. When you type in a search box and see suggestions ' +
        'appearing — that is JavaScript. When you scroll and a navigation bar sticks to the top — ' +
        'JavaScript. When you click "Add to Cart" and the cart count updates — JavaScript. It is ' +
        'the only programming language that runs directly in the browser, which is why it has become ' +
        'the most widely used language in the world.',
      intermediateContent:
        'Core concepts: variables (let, const), functions (arrow: (a,b) => a+b), arrays ([1,2,3].map(x => x*2)), objects ({name: "Ranga", age: 25}). DOM: document.querySelector(".btn").addEventListener("click", handler). Template literals: `Hello ${name}`. Async: fetch("/api").then(r => r.json()). Error handling: try { risky() } catch(e) { console.error(e) }. The console object: .log(), .error(), .table(), .time()/.timeEnd() for debugging.',
      advancedContent:
        'ES6+ features: destructuring ({name, age} = obj), spread ([...arr1, ...arr2]), optional chaining (obj?.prop), nullish coalescing (val ?? default). The event loop: microtasks (Promises) run before macrotasks (setTimeout). Closures capture variables from outer scope — enabling private state and factory functions. Prototypal inheritance differs from classical OOP: objects inherit directly from other objects via the prototype chain. TypeScript adds static type checking: function add(a: number, b: number): number — catching type errors at compile time rather than runtime.',
    },
    {
      title: 'How the Three Work Together',
      beginnerContent:
        'Think of building a car. HTML is the frame and body panels — the structure that defines ' +
        'where the seats, dashboard, and wheels go. CSS is the paint job, upholstery, and trim — ' +
        'everything that makes it look good. JavaScript is the engine, steering, and electronics — ' +
        'everything that makes it *do* things. You can have HTML without CSS (an ugly but functional ' +
        'page) or without JavaScript (a static page), but a real website uses all three. In practice, ' +
        'HTML goes in `.html` files, CSS goes in `.css` files (linked from the HTML), and JavaScript ' +
        'goes in `.js` files (also linked from the HTML). Keeping them separate makes your code ' +
        'organized and easier to maintain.',
      intermediateContent:
        'DevTools inspection: right-click any element → Inspect to see its HTML, applied CSS rules, computed styles, and JavaScript event listeners. The Elements panel shows the live DOM (which may differ from the source HTML after JavaScript modifies it). The Console panel lets you run JavaScript interactively: document.querySelectorAll("p").length counts all paragraphs. The Network tab shows every resource loaded, its size, and timing — essential for diagnosing slow pages.',
      advancedContent:
        'The browser rendering pipeline: Parse HTML → build DOM tree → parse CSS → build CSSOM → merge into Render Tree → Layout (calculate positions) → Paint (fill pixels) → Composite (layer and display). Reflow (recalculating layout) is expensive; repaint (changing colors) is cheaper. JavaScript that reads layout properties (offsetHeight) then writes styles forces synchronous reflow — a performance antipattern called "layout thrashing." RequestAnimationFrame batches visual updates at 60fps. Web Workers run JavaScript in background threads for CPU-intensive tasks without blocking the UI.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match the file type to what it contains',
          pairs: [
            ['.html', 'Structure: headings, paragraphs, images, links'],
            ['.css', 'Style: colors, fonts, spacing, layout rules'],
            ['.js', 'Behavior: click handlers, form validation, data loading'],
            ['<head>', 'Metadata, title, and links to CSS/JS files'],
            ['<body>', 'Visible content the user sees on the page'],
          ],
        },
      },
    },
    {
      title: 'The DOM — Your Page as a Tree',
      beginnerContent:
        'When the browser reads your HTML, it does not just display text on screen. It builds an ' +
        'invisible data structure called the DOM (Document Object Model) — a tree where every HTML ' +
        'element becomes a node. The `<html>` element is the root. It has two children: `<head>` and ' +
        '`<body>`. Inside `<body>`, a `<div>` might contain an `<h1>` and a `<ul>`, and the `<ul>` ' +
        'contains several `<li>` nodes. Think of the library catalog from the Library story: the ' +
        'whole catalog is the root, categories like "Fiction" and "Science" are branches, and ' +
        'individual books are leaves. JavaScript manipulates this tree to change what you see. ' +
        '`document.querySelector("h1")` finds a node. `node.textContent = "New Title"` changes it. ' +
        '`document.createElement("li")` creates a new node, and `parent.appendChild(child)` attaches ' +
        'it. Every dynamic update on a webpage — adding a search result, removing an item from a cart, ' +
        'highlighting a word — is really just adding, removing, or changing nodes in this tree.',
      intermediateContent:
        'DOM manipulation methods: document.createElement("div") creates an element; parent.appendChild(child) adds it to the page; element.remove() deletes it. Event delegation: instead of adding listeners to 100 list items, add one to the parent: ul.addEventListener("click", e => { if(e.target.tagName === "LI") handle(e.target) }). This uses event bubbling — events propagate up the DOM tree from the target to the root. Forms: form.addEventListener("submit", e => { e.preventDefault(); const data = new FormData(form); }).',
      advancedContent:
        'Shadow DOM encapsulates a component\'s internal structure and styles, preventing external CSS from affecting it and internal styles from leaking out. This is the foundation of Web Components: class MyWidget extends HTMLElement { constructor() { super(); this.attachShadow({mode: "open"}); } }. Virtual DOM (React, Vue) keeps a lightweight JavaScript representation and diffs it against the previous version, computing the minimal set of real DOM mutations. Svelte eliminates the virtual DOM entirely by compiling components to surgical DOM updates at build time — often faster than virtual DOM diffing.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'The DOM is a tree structure where every HTML element is a node.', answer: true, explanation: 'The browser parses HTML into a tree of nodes. The <html> element is the root, with <head> and <body> as children.' },
            { text: 'JavaScript cannot change the DOM after the page has loaded.', answer: false, explanation: 'JavaScript can add, remove, and modify DOM nodes at any time, which is how dynamic pages work.' },
            { text: 'document.querySelector() finds a DOM node matching a CSS selector.', answer: true, explanation: 'It uses the same selectors as CSS — tag names, .classes, and #ids — to locate elements in the tree.' },
          ],
        },
      },
    },
    {
      id: 'html-responsive',
      title: 'Responsive Design — One Page, Every Screen',
      beginnerContent:
        'People visit websites from phones, tablets, laptops, and giant monitors. Responsive design ' +
        'means your page looks good on all of them without building separate sites. The key tools are ' +
        '*media queries*, *flexbox*, and *mobile-first thinking*. A media query like ' +
        '`@media (min-width: 768px) { ... }` applies styles only when the screen is wide enough. ' +
        'Flexbox (`display: flex`) lets items in a row wrap to a new line when space runs out. ' +
        'Mobile-first means you write CSS for small screens by default, then add media queries for ' +
        'larger screens. Think about the library website from the Library story: on a phone, book ' +
        'cards should stack in a single column so you can scroll through them easily. On a laptop, ' +
        'the same cards should spread into a grid of three or four columns to use the wider space. ' +
        'The HTML stays the same — only the CSS rules change. The `<meta name="viewport">` tag in ' +
        'your HTML head tells the browser to use the device\'s actual width instead of pretending to ' +
        'be a desktop, which is essential for any responsive page.',
      intermediateContent:
        'Mobile-first design: start with the smallest screen layout, then add complexity for larger screens using min-width media queries: @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }. The viewport meta tag (<meta name="viewport" content="width=device-width, initial-scale=1">) prevents mobile browsers from zooming out. Relative units: rem (relative to root font size), em (relative to parent), vw/vh (viewport width/height), % (parent size). Touch targets should be at least 44×44 CSS pixels for accessibility.',
      advancedContent:
        'Container queries (@container) enable components to adapt based on their parent\'s size rather than the viewport — crucial for reusable components that may appear in sidebars or main content areas. The CSS clamp() function (font-size: clamp(1rem, 2.5vw, 2rem)) creates fluid typography that scales smoothly between breakpoints. The :has() selector enables parent styling based on children (:has(> img) styles containers that contain images). These modern CSS features reduce JavaScript dependency for responsive behavior.',
    },
  ],

  build: [
    {
      title: 'A Complete HTML Page',
      beginnerContent:
        'Every HTML file follows this structure. The `<!DOCTYPE html>` tells the browser which version ' +
        'of HTML to use. The `<head>` holds metadata; the `<body>` holds visible content.',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Wildlife of Assam</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
<header>
  <h1>Wildlife of Kaziranga</h1>
  <nav>
    <a href="#animals">Animals</a>
    <a href="#about">About</a>
  </nav>
</header>

<main id="animals">
  <h2>One-Horned Rhino</h2>
  <img src="rhino.jpg" alt="Indian one-horned rhinoceros" />
  <p>Kaziranga is home to <strong>two-thirds</strong> of the
     world's one-horned rhinos.</p>

  <ul>
    <li>Weight: up to 2,200 kg</li>
    <li>Diet: grasses, fruit, leaves</li>
    <li>Status: Vulnerable</li>
  </ul>
</main>

<footer id="about">
  <p>&copy; 2025 TigmaMinds Academy</p>
</footer>

<script src="app.js"></script>
</body>
</html>`,
    },
    {
      title: 'Styling with CSS',
      beginnerContent:
        'CSS rules select HTML elements and apply visual properties. Use classes for reusable styles and flexbox for layout.',
      code: `/* style.css */

/* Reset and base styles */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
font-family: system-ui, sans-serif;
background: #f7fafc;
color: #2d3748;
line-height: 1.6;
}

/* Header with flexbox layout */
header {
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 32px;
background: #2b6cb0;
color: white;
}

header a {
color: white;
text-decoration: none;
margin-left: 16px;
}
header a:hover { text-decoration: underline; }

/* Card component — reusable with the .card class */
.card {
background: white;
border-radius: 8px;
padding: 24px;
margin: 16px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
transition: transform 0.2s;
}
.card:hover { transform: translateY(-2px); }

/* Responsive: stack vertically on small screens */
@media (max-width: 600px) {
header { flex-direction: column; gap: 8px; }
.card { margin: 8px; }
}`,
    },
    {
      title: 'Interactive JavaScript',
      beginnerContent:
        'JavaScript lets you react to user actions, update the page, and communicate with servers — all without reloading.',
      code: `// app.js

// --- 1. Respond to a button click ---
const btn = document.querySelector("#searchBtn");
const input = document.querySelector("#searchInput");
const results = document.querySelector("#results");

btn.addEventListener("click", () => {
const query = input.value.trim().toLowerCase();
if (!query) {
  results.textContent = "Please enter a search term.";
  return;
}
results.textContent = \`Searching for "\${query}"...\`;
// In a real app, you'd fetch results from a server here
});

// --- 2. Toggle visibility ---
document.querySelector("#toggleInfo").addEventListener("click", () => {
const info = document.querySelector("#extraInfo");
info.classList.toggle("hidden");
// .hidden { display: none; } in your CSS
});

// --- 3. Fetch data from an API ---
async function loadAnimals() {
try {
  const response = await fetch("https://api.example.com/animals");
  const animals = await response.json();

  const list = document.querySelector("#animalList");
  list.innerHTML = "";  // clear old content

  animals.forEach(animal => {
    const li = document.createElement("li");
    li.textContent = \`\${animal.name} — \${animal.status}\`;
    list.appendChild(li);
  });
} catch (error) {
  console.error("Failed to load animals:", error);
}
}

// Load data when the page is ready
document.addEventListener("DOMContentLoaded", loadAnimals);`,
    },
    {
      title: 'Putting It All Together: A Mini App',
      beginnerContent:
        'A complete mini-application that combines HTML structure, CSS styling, and JavaScript behavior into one working page.',
      code: `<!-- Save as index.html and open in a browser -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Animal Counter</title>
<style>
  body { font-family: sans-serif; text-align: center; padding: 40px; background: #edf2f7; }
  h1 { color: #2d3748; }
  .counter { font-size: 64px; font-weight: bold; color: #2b6cb0; margin: 20px 0; }
  button {
    padding: 12px 24px; margin: 4px;
    font-size: 18px; border: none; border-radius: 8px;
    cursor: pointer; color: white;
  }
  .add { background: #38a169; }
  .sub { background: #e53e3e; }
  .reset { background: #718096; }
  button:hover { opacity: 0.9; transform: scale(1.05); }
  #log { margin-top: 20px; color: #718096; font-size: 14px; }
</style>
</head>
<body>
<h1>Animal Sightings Today</h1>
<div class="counter" id="count">0</div>
<button class="add" id="addBtn">+ Spotted one!</button>
<button class="sub" id="subBtn">- Oops, miscount</button>
<button class="reset" id="resetBtn">Reset</button>
<p id="log"></p>

<script>
  let count = 0;
  const display = document.getElementById("count");
  const log = document.getElementById("log");

  function update(change) {
    count = Math.max(0, count + change);
    display.textContent = count;
    const time = new Date().toLocaleTimeString();
    log.textContent = \`Last update: \${time} (total: \${count})\`;
  }

  document.getElementById("addBtn").addEventListener("click", () => update(1));
  document.getElementById("subBtn").addEventListener("click", () => update(-1));
  document.getElementById("resetBtn").addEventListener("click", () => { count = 0; update(0); });
</script>
</body>
</html>`,
    },
    {
      title: 'Building a Search Feature',
      beginnerContent:
        'A real-time search box is one of the most useful features on any website. This complete ' +
        'example filters a list of books as the user types — the core feature of the library from ' +
        'the Library story. It uses an input event listener, array filtering, and DOM manipulation.',
      code: `<!-- Save as search.html and open in a browser -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Library Search</title>
<style>
  body {
    font-family: system-ui, sans-serif;
    max-width: 600px;
    margin: 40px auto;
    padding: 0 16px;
    background: #f7fafc;
    color: #2d3748;
  }
  h1 { color: #2b6cb0; }
  #searchBox {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #cbd5e0;
    border-radius: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;
  }
  #searchBox:focus {
    outline: none;
    border-color: #2b6cb0;
  }
  .book-item {
    background: white;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .book-title { font-weight: bold; }
  .book-author { color: #718096; font-size: 14px; }
  #count { color: #718096; margin-bottom: 12px; }
  .no-results { color: #e53e3e; font-style: italic; }
</style>
</head>
<body>
<h1>Library Catalog</h1>
<input type="text" id="searchBox"
       placeholder="Search by title or author..." />
<p id="count"></p>
<div id="bookList"></div>

<script>
  // Book data — in a real app this might come from an API
  const books = [
    { title: "The River Dolphin's Secret", author: "Priya Sharma" },
    { title: "Wings Over Kaziranga", author: "Arjun Bora" },
    { title: "The Girl Who Spoke to Elephants", author: "Meera Das" },
    { title: "Golden Threads of Muga Silk", author: "Ananya Kalita" },
    { title: "Firefly Festival of Majuli", author: "Rishi Hazarika" },
    { title: "The Boy Who Built a Library", author: "Kabir Nath" },
    { title: "Dragonfly and the Paddy Field", author: "Tara Gogoi" },
    { title: "Songs of the Brahmaputra", author: "Dev Choudhury" },
  ];

  const searchBox = document.getElementById("searchBox");
  const bookList = document.getElementById("bookList");
  const countEl = document.getElementById("count");

  function renderBooks(filtered) {
    bookList.innerHTML = "";
    countEl.textContent = \`Showing \${filtered.length} of \${books.length} books\`;

    if (filtered.length === 0) {
      bookList.innerHTML = '<p class="no-results">No books found.</p>';
      return;
    }

    filtered.forEach(book => {
      const div = document.createElement("div");
      div.className = "book-item";
      div.innerHTML = \`
        <div class="book-title">\${book.title}</div>
        <div class="book-author">by \${book.author}</div>
      \`;
      bookList.appendChild(div);
    });
  }

  function handleSearch() {
    const query = searchBox.value.trim().toLowerCase();
    if (!query) {
      renderBooks(books);
      return;
    }
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
    renderBooks(filtered);
  }

  // Filter on every keystroke for real-time results
  searchBox.addEventListener("input", handleSearch);

  // Show all books on initial load
  renderBooks(books);
</script>
</body>
</html>`,
    },
    {
      id: 'html-dom',
      title: 'The DOM — Selecting & Changing Elements',
      beginnerContent:
        'The **DOM (Document Object Model)** is the browser\'s live representation of your HTML page as a tree of objects. JavaScript can read and change any part of it.\n\n' +
        '**Selecting elements:**\n' +
        '- `document.getElementById("myId")` — find one element by its id\n' +
        '- `document.querySelector(".myClass")` — find the first element matching a CSS selector\n' +
        '- `document.querySelectorAll("p")` — find ALL matching elements (returns a NodeList)\n\n' +
        '**Changing elements:**\n' +
        '- `el.textContent = "new text"` — change the text inside\n' +
        '- `el.innerHTML = "<strong>bold</strong>"` — change the HTML inside\n' +
        '- `el.style.color = "red"` — change a CSS property\n' +
        '- `el.classList.add("active")` — add a CSS class\n' +
        '- `el.setAttribute("href", "/new-link")` — change an attribute\n\n' +
        '**Creating elements:**\n' +
        '- `document.createElement("div")` — create a new element\n' +
        '- `parent.appendChild(newEl)` — add it to the page\n' +
        '- `el.remove()` — remove an element\n\n' +
        '**Check yourself:** What\'s the difference between `textContent` and `innerHTML`? (Answer: textContent sets plain text — HTML tags are displayed as text. innerHTML parses HTML tags.)',
      code: `<!-- DOM Manipulation -->
<div id="app">
<h2 id="title">Original Title</h2>
<p class="message">Hello world</p>
<ul id="list"></ul>
<button id="btn">Click Me</button>
</div>

<script>
// Select elements
const title = document.getElementById("title");
const message = document.querySelector(".message");
const list = document.getElementById("list");

// Change text and style
title.textContent = "Updated Title";
title.style.color = "#d97706";
message.innerHTML = "This is <strong>bold</strong> and <em>italic</em>";

// Create and add elements
const items = ["Ranga", "Mohini", "Gaja"];
items.forEach(name => {
  const li = document.createElement("li");
  li.textContent = name;
  li.style.padding = "4px 0";
  list.appendChild(li);
});

// Add/remove classes
title.classList.add("highlight");
</script>

<style>
#app { font-family: sans-serif; padding: 16px; }
.highlight { background: #fef3c7; padding: 4px 8px; border-radius: 4px; }
li { list-style: none; }
</style>`,
      interactive: { type: 'html-playground', props: { starterCode: '<h2 id="title">Change Me</h2>\n<p id="msg">Original message</p>\n<button onclick="document.getElementById(\'title\').textContent = \'Changed!\'; document.getElementById(\'msg\').style.color = \'blue\';">Click</button>', title: 'Try DOM Manipulation' } },
    },
    {
      id: 'html-events',
      title: 'Events — Responding to User Actions',
      beginnerContent:
        'An **event** is something the user does: click a button, type in an input, hover over an image, submit a form. JavaScript lets you run code when events happen.\n\n' +
        '**Adding event listeners:**\n' +
        '```\nconst btn = document.getElementById("myBtn");\nbtn.addEventListener("click", function() {\n  alert("Button clicked!");\n});\n```\n\n' +
        '**Common events:**\n' +
        '- `click` — user clicks an element\n' +
        '- `input` — user types in a text field\n' +
        '- `submit` — user submits a form\n' +
        '- `mouseover` / `mouseout` — hover in / out\n' +
        '- `keydown` — user presses a key\n' +
        '- `load` — page finished loading\n\n' +
        '**The event object** — every listener receives an event object with details:\n' +
        '```\ninput.addEventListener("input", function(event) {\n  console.log(event.target.value);  // what the user typed\n});\n```\n\n' +
        '**`event.preventDefault()`** — stops the default behavior (e.g., stops a form from reloading the page).',
      code: `<!-- Events Demo -->
<div id="app" style="font-family: sans-serif; padding: 16px;">
<h3>Event Examples</h3>

<!-- Click event -->
<button id="clickBtn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
  Click me
</button>
<p id="clickResult" style="color: #6b7280;"></p>

<!-- Input event (live typing) -->
<input id="nameInput" type="text" placeholder="Type your name..."
  style="margin-top: 12px; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; width: 200px;" />
<p id="greeting" style="color: #059669; font-weight: bold;"></p>

<!-- Hover event -->
<div id="hoverBox" style="margin-top: 12px; width: 150px; height: 60px; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
  Hover me
</div>
</div>

<script>
let clicks = 0;

document.getElementById("clickBtn").addEventListener("click", () => {
  clicks++;
  document.getElementById("clickResult").textContent = "Clicked " + clicks + " time(s)";
});

document.getElementById("nameInput").addEventListener("input", (e) => {
  const name = e.target.value;
  document.getElementById("greeting").textContent = name ? "Hello, " + name + "!" : "";
});

const box = document.getElementById("hoverBox");
box.addEventListener("mouseover", () => {
  box.style.background = "#3b82f6";
  box.style.color = "white";
  box.textContent = "Hovering!";
});
box.addEventListener("mouseout", () => {
  box.style.background = "#e5e7eb";
  box.style.color = "black";
  box.textContent = "Hover me";
});
</script>`,
      interactive: { type: 'html-playground', props: { starterCode: '<button id="btn" style="padding:8px 16px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;">Count: 0</button>\n<script>\nlet n = 0;\ndocument.getElementById("btn").addEventListener("click", () => {\n  n++;\n  document.getElementById("btn").textContent = "Count: " + n;\n});\n</script>', title: 'Try Events' } },
    },
    {
      id: 'html-forms',
      title: 'Forms — Collecting User Input',
      beginnerContent:
        'Forms collect data from users: text fields, dropdowns, checkboxes, radio buttons.\n\n' +
        '**Basic form:**\n' +
        '```\n<form id="myForm">\n  <input type="text" name="name" placeholder="Your name" />\n  <button type="submit">Submit</button>\n</form>\n```\n\n' +
        '**Input types:** `text`, `number`, `email`, `password`, `date`, `checkbox`, `radio`, `select`\n\n' +
        '**Reading form values:**\n' +
        '```\nconst form = document.getElementById("myForm");\nform.addEventListener("submit", (e) => {\n  e.preventDefault();  // Stop page reload\n  const name = form.elements.name.value;\n  console.log("Submitted:", name);\n});\n```\n\n' +
        '**`e.preventDefault()`** is critical — without it, the form submission reloads the page and you lose all your JavaScript state.\n\n' +
        '**Validation:** HTML has built-in validation: `required`, `minlength="3"`, `type="email"` (enforces email format), `min="0"` for numbers.',
      code: `<!-- Form Demo -->
<div style="font-family: sans-serif; padding: 16px; max-width: 400px;">
<h3>Elephant Registration</h3>
<form id="regForm" style="display: flex; flex-direction: column; gap: 8px;">
  <input type="text" name="name" placeholder="Elephant name" required
    style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;" />
  <input type="number" name="weight" placeholder="Weight (kg)" min="1000" required
    style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;" />
  <select name="park" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 6px;">
    <option value="">Select park...</option>
    <option value="Kaziranga">Kaziranga</option>
    <option value="Manas">Manas</option>
    <option value="Nameri">Nameri</option>
  </select>
  <label style="display: flex; align-items: center; gap: 6px;">
    <input type="checkbox" name="endangered" /> Endangered species
  </label>
  <button type="submit"
    style="padding: 10px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
    Register
  </button>
</form>
<div id="output" style="margin-top: 12px; padding: 12px; background: #f0fdf4; border-radius: 8px; display: none;"></div>
</div>

<script>
document.getElementById("regForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.elements.name.value,
    weight: Number(form.elements.weight.value),
    park: form.elements.park.value,
    endangered: form.elements.endangered.checked,
  };
  const output = document.getElementById("output");
  output.style.display = "block";
  output.innerHTML = "<strong>Registered!</strong><br>" +
    data.name + " (" + data.weight + "kg) at " + data.park +
    (data.endangered ? " — <em>endangered</em>" : "");
});
</script>`,
      interactive: { type: 'html-playground', props: { starterCode: '<form id="f" style="font-family:sans-serif; padding:16px;">\n  <input type="text" id="name" placeholder="Your name" style="padding:6px; border:1px solid #ccc; border-radius:4px;" />\n  <button type="submit" style="padding:6px 12px; background:#059669; color:white; border:none; border-radius:4px; cursor:pointer;">Say Hi</button>\n  <p id="out"></p>\n</form>\n<script>\ndocument.getElementById("f").addEventListener("submit", e => {\n  e.preventDefault();\n  document.getElementById("out").textContent = "Hello, " + document.getElementById("name").value + "!";\n});\n</script>', title: 'Try Forms' } },
    },
    {
      id: 'html-flexbox',
      title: 'Flexbox — Layout Made Simple',
      beginnerContent:
        'Before flexbox, laying out elements side by side required hacks (floats, tables). Flexbox makes it one line: `display: flex`.\n\n' +
        '**Key properties on the container (parent):**\n' +
        '- `display: flex` — children line up in a row\n' +
        '- `flex-direction: column` — stack vertically instead\n' +
        '- `justify-content: center` — center horizontally (or space-between, space-around)\n' +
        '- `align-items: center` — center vertically\n' +
        '- `gap: 12px` — space between children\n' +
        '- `flex-wrap: wrap` — wrap to next line if too wide\n\n' +
        '**Key properties on the children:**\n' +
        '- `flex: 1` — grow to fill available space equally\n' +
        '- `flex: 2` — grow twice as much as `flex: 1` siblings\n\n' +
        '**Check yourself:** What does `justify-content: space-between` do? (Answer: puts the first item at the start, last at the end, and distributes remaining space equally between items.)',
      code: `<!-- Flexbox Layout -->
<style>
.container { display: flex; gap: 12px; padding: 16px; font-family: sans-serif; }
.card {
  flex: 1;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
}
.card h3 { margin: 0 0 8px; color: #1e293b; }
.card p { margin: 0; color: #64748b; font-size: 14px; }

/* Center content vertically */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: #dbeafe;
  border-radius: 8px;
  margin-top: 12px;
  font-weight: bold;
  color: #1e40af;
}

/* Responsive: stack on small screens */
@media (max-width: 500px) {
  .container { flex-direction: column; }
}
</style>

<div class="container">
<div class="card">
  <h3>Ranga</h3>
  <p>4500 kg</p>
  <p>Kaziranga</p>
</div>
<div class="card">
  <h3>Mohini</h3>
  <p>3800 kg</p>
  <p>Manas</p>
</div>
<div class="card">
  <h3>Gaja</h3>
  <p>5200 kg</p>
  <p>Kaziranga</p>
</div>
</div>

<div class="centered">I'm perfectly centered!</div>`,
      interactive: { type: 'html-playground', props: { starterCode: '<style>\n  .row { display: flex; gap: 10px; padding: 10px; }\n  .box { flex: 1; padding: 20px; background: #dbeafe; border-radius: 8px; text-align: center; font-family: sans-serif; }\n</style>\n<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>', title: 'Try Flexbox' } },
    },
    {
      id: 'html-grid',
      title: 'CSS Grid — Two-Dimensional Layout',
      beginnerContent:
        'Flexbox is one-dimensional (row OR column). **CSS Grid** is two-dimensional — rows AND columns at the same time.\n\n' +
        '**Basic grid:**\n' +
        '```\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */\n  gap: 12px;\n}\n```\n\n' +
        '`1fr` means "1 fraction of available space." `1fr 2fr` = two columns, second twice as wide.\n\n' +
        '**Named areas:**\n' +
        '```\ngrid-template-areas:\n  "header header"\n  "sidebar content"\n  "footer footer";\n```\n\n' +
        '**When to use Flexbox vs Grid:**\n' +
        '- **Flexbox** — one direction (nav bar, card row, vertical stack)\n' +
        '- **Grid** — two directions (page layout, image gallery, dashboard)',
      code: `<!-- CSS Grid Layout -->
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
  font-family: sans-serif;
}
.grid-item {
  padding: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  text-align: center;
}
/* Span 2 columns */
.wide { grid-column: span 2; background: #dbeafe; border-color: #93c5fd; }
/* Span 2 rows */
.tall { grid-row: span 2; background: #fef3c7; border-color: #fcd34d; }

/* Page layout with named areas */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 200px 1fr;
  gap: 8px;
  margin-top: 16px;
  padding: 16px;
}
.page > div {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}
.page .header { grid-area: header; background: #1e293b; color: white; }
.page .sidebar { grid-area: sidebar; background: #e2e8f0; }
.page .content { grid-area: content; background: #f1f5f9; min-height: 80px; }
.page .footer { grid-area: footer; background: #1e293b; color: white; }
</style>

<div class="grid">
<div class="grid-item">1</div>
<div class="grid-item wide">2 (spans 2 cols)</div>
<div class="grid-item tall">3 (spans 2 rows)</div>
<div class="grid-item">4</div>
<div class="grid-item">5</div>
</div>

<div class="page">
<div class="header">Header</div>
<div class="sidebar">Sidebar</div>
<div class="content">Main Content</div>
<div class="footer">Footer</div>
</div>`,
      interactive: { type: 'html-playground', props: { starterCode: '<style>\n  .grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 8px;\n    padding: 12px;\n    font-family: sans-serif;\n  }\n  .cell {\n    padding: 20px;\n    background: #dbeafe;\n    border-radius: 8px;\n    text-align: center;\n  }\n</style>\n<div class="grid">\n  <div class="cell">A</div>\n  <div class="cell">B</div>\n  <div class="cell">C</div>\n  <div class="cell">D</div>\n  <div class="cell">E</div>\n  <div class="cell">F</div>\n</div>', title: 'Try CSS Grid' } },
    },
    {
      id: 'html-ts-dom',
      title: 'TypeScript + DOM — Type-Safe Web Pages',
      beginnerContent:
        'When you use TypeScript to manipulate the DOM, you get type safety for every element access. The browser\'s built-in types tell TypeScript what properties and methods each element has.\n\n' +
        '**The problem with plain JavaScript:**\n' +
        '`const input = document.getElementById("name");`\n' +
        '`input.value; // JavaScript: works at runtime, maybe crashes`\n\n' +
        '**TypeScript catches the issue:**\n' +
        '`const input = document.getElementById("name");`\n' +
        '`input.value; // Error: .value doesn\'t exist on HTMLElement`\n\n' +
        'Why? `getElementById` returns `HTMLElement | null` — a generic element. Only `HTMLInputElement` has `.value`. You need to narrow the type:\n\n' +
        '```\nconst input = document.getElementById("name") as HTMLInputElement;\ninput.value; // OK — TypeScript knows it\'s an input\n```\n\n' +
        'Or safer:\n' +
        '```\nconst input = document.querySelector<HTMLInputElement>("#name");\nif (input) {\n  input.value; // OK — null check + type narrowing\n}\n```\n\n' +
        '**Common DOM types:** `HTMLInputElement`, `HTMLButtonElement`, `HTMLSelectElement`, `HTMLFormElement`, `HTMLDivElement`, `HTMLImageElement`.',
      intermediateContent:
        '**Typed event handlers:**\n\n' +
        '```\nconst btn = document.querySelector<HTMLButtonElement>("#submit");\nbtn?.addEventListener("click", (e: MouseEvent) => {\n  e.preventDefault();\n  // e.target is EventTarget, need to narrow:\n  const target = e.target as HTMLButtonElement;\n  target.disabled = true;\n});\n\nconst input = document.querySelector<HTMLInputElement>("#search");\ninput?.addEventListener("input", (e: Event) => {\n  const value = (e.target as HTMLInputElement).value;\n  console.log("Searching:", value);\n});\n```\n\n' +
        '**Form data with TypeScript:**\n\n' +
        '```\ninterface FormData {\n  name: string;\n  weight: number;\n  park: string;\n}\n\nfunction getFormData(form: HTMLFormElement): FormData {\n  return {\n    name: (form.elements.namedItem("name") as HTMLInputElement).value,\n    weight: Number((form.elements.namedItem("weight") as HTMLInputElement).value),\n    park: (form.elements.namedItem("park") as HTMLSelectElement).value,\n  };\n}\n```',
      code: `// TypeScript + DOM (run this in the TS playground)
// Note: DOM APIs need a browser — this demonstrates the types

// querySelector with generic type parameter
// const input = document.querySelector<HTMLInputElement>("#name");
// if (input) {
//   input.value = "Ranga";  // TS knows .value exists
//   input.focus();           // TS knows .focus() exists
// }

// Type-safe event handler
interface ElephantForm {
name: string;
weight: number;
park: "Kaziranga" | "Manas" | "Nameri";
}

function validateForm(data: ElephantForm): string[] {
const errors: string[] = [];
if (data.name.length < 2) errors.push("Name too short");
if (data.weight < 1000 || data.weight > 8000) errors.push("Weight out of range");
return errors;
}

// Test the validation logic (no DOM needed)
const testData: ElephantForm = { name: "Ranga", weight: 4500, park: "Kaziranga" };
const errors = validateForm(testData);
console.log("Valid:", errors.length === 0);
console.log("Errors:", errors);

const badData: ElephantForm = { name: "R", weight: 500, park: "Manas" };
const badErrors = validateForm(badData);
console.log("Bad data errors:", badErrors);`,
      interactive: { type: 'ts-playground', props: { starterCode: '// TypeScript form validation\ninterface ElephantForm {\n  name: string;\n  weight: number;\n  park: "Kaziranga" | "Manas" | "Nameri";\n}\n\nfunction validate(data: ElephantForm): string[] {\n  const errors: string[] = [];\n  if (data.name.length < 2) errors.push("Name too short");\n  if (data.weight < 1000) errors.push("Too light");\n  return errors;\n}\n\nconsole.log(validate({ name: "Ranga", weight: 4500, park: "Kaziranga" }));\nconsole.log(validate({ name: "R", weight: 500, park: "Manas" }));', title: 'Try TypeScript + DOM Types' } },
    },
  ],
};
