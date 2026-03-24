import { Zap } from 'lucide-react';
import HtmlPlayground from '../HtmlPlayground';

export default function LibraryLevel2() {
  const lessons = [
    {
      title: 'Components — reusable building blocks',
      concept: 'In Level 1, you wrote all your HTML in one file. Real web apps have hundreds of pages. Writing everything from scratch each time would be insane. **Components** solve this: you define a piece of UI once (like a book card) and reuse it everywhere. A component is a function that returns HTML. You call it with different data (different book titles) and it produces different output — same shape, different content. This is the core idea behind React, Vue, and every modern framework.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #fafaf9; padding: 20px; max-width: 600px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 16px; color: #292524; }
  .card { background: white; border: 1px solid #e7e5e4; border-radius: 8px; padding: 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
  .card h3 { font-size: 14px; color: #1c1917; }
  .card .cat { font-size: 10px; background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 99px; }
</style>
</head>
<body>
  <h1>📚 Component-Based Catalog</h1>
  <div id="app"></div>
  <script>
    // A "component": a function that returns HTML
    function BookCard(title, category) {
      return '<div class="card"><h3>' + title + '</h3><span class="cat">' + category + '</span></div>';
    }

    // Data
    const books = [
      { title: 'Assamese Folktales', cat: 'Fiction' },
      { title: 'Science for Beginners', cat: 'Science' },
      { title: 'The River Dolphin', cat: 'Fiction' },
      { title: 'Math Puzzles', cat: 'Math' },
      { title: 'How Things Work', cat: 'Science' },
    ];

    // Render: call the component for each book
    document.getElementById('app').innerHTML =
      books.map(b => BookCard(b.title, b.cat)).join('');
  </script>
</body>
</html>`,
    },
    {
      title: 'Props — passing data to components',
      concept: 'A component without data is a static block. **Props** (properties) are the data you pass to a component to customize it. In React, props are like function arguments: `<BookCard title="Folktales" category="Fiction" />`. The component receives them and renders accordingly. Props flow one direction: parent → child. This makes data flow predictable and debuggable.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #1e1b4b; color: white; padding: 20px; max-width: 600px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 16px; }
  .card { background: #312e81; border-radius: 12px; padding: 16px; margin-bottom: 10px; border: 1px solid #4338ca; }
  .card h3 { font-size: 14px; margin-bottom: 4px; }
  .card .meta { font-size: 11px; color: #a5b4fc; }
  .avail { color: #34d399; } .unavail { color: #f87171; }
</style>
</head>
<body>
  <h1>📚 Props in Action</h1>
  <div id="app"></div>
  <script>
    // Component with multiple props
    function BookCard(props) {
      const statusClass = props.available ? 'avail' : 'unavail';
      const statusText = props.available ? '✓ Available' : '✗ Borrowed by ' + props.borrower;
      return '<div class="card">' +
        '<h3>' + props.title + '</h3>' +
        '<p class="meta">' + props.category + ' · ' +
        '<span class="' + statusClass + '">' + statusText + '</span></p>' +
        '</div>';
    }

    const books = [
      { title: 'Assamese Folktales', category: 'Fiction', available: true },
      { title: 'Science for Beginners', category: 'Science', available: false, borrower: 'Rina' },
      { title: 'The River Dolphin', category: 'Fiction', available: true },
      { title: 'Math Puzzles', category: 'Math', available: false, borrower: 'Joon' },
    ];

    document.getElementById('app').innerHTML =
      books.map(b => BookCard(b)).join('');
  </script>
</body>
</html>`,
    },
    {
      title: 'State and reactivity — UI that updates itself',
      concept: 'In Level 1, you manually called `render()` every time data changed. Real frameworks do this automatically through **reactivity**: when state changes, the UI re-renders. This is the core magic of React\'s `useState`, Vue\'s `ref`, and Svelte\'s `$:`. You declare what the UI should look like for any state, and the framework keeps them in sync.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #fafaf9; padding: 20px; max-width: 500px; margin: 0 auto; }
  h1 { font-size: 18px; margin-bottom: 12px; color: #292524; }
  .counter { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .counter span { font-size: 32px; font-weight: bold; color: #6d28d9; min-width: 40px; text-align: center; }
  button { padding: 8px 16px; border: 1px solid #d6d3d1; border-radius: 6px; background: white; cursor: pointer; font-size: 14px; }
  button:hover { background: #f5f5f4; }
  .books { margin-top: 16px; }
  .book { padding: 10px; border-bottom: 1px solid #e7e5e4; font-size: 14px; }
  .add-form { display: flex; gap: 8px; margin-top: 12px; }
  .add-form input { flex: 1; padding: 8px; border: 1px solid #d6d3d1; border-radius: 6px; font-size: 14px; }
</style>
</head>
<body>
  <h1>📚 Reactive Library</h1>
  <div class="counter">
    Books: <span id="count">0</span>
    <button onclick="addBook()">+ Add Book</button>
  </div>
  <div class="add-form">
    <input id="newBook" placeholder="Book title..." onkeydown="if(event.key==='Enter')addBook()">
  </div>
  <div class="books" id="list"></div>

  <script>
    // Reactive state
    let books = ['Assamese Folktales', 'Science for Beginners', 'The River Dolphin'];

    function render() {
      document.getElementById('count').textContent = books.length;
      document.getElementById('list').innerHTML =
        books.map((b, i) =>
          '<div class="book">' + b +
          ' <button onclick="removeBook(' + i + ')" style="float:right;font-size:11px;padding:2px 8px">Remove</button></div>'
        ).join('');
    }

    function addBook() {
      const input = document.getElementById('newBook');
      if (input.value.trim()) {
        books.push(input.value.trim());
        input.value = '';
        render(); // State changed → re-render
      }
    }

    function removeBook(i) {
      books.splice(i, 1);
      render(); // State changed → re-render
    }

    render(); // Initial render
  </script>
</body>
</html>`,
    },
    {
      title: 'Data persistence — surviving page refresh',
      concept: 'Our library loses all data when you refresh the page. Real apps need **persistence** — data that survives restarts. The simplest option is **localStorage**: a browser-native key-value store that persists across sessions. For real apps, you\'d use a database (Supabase, Firebase, PostgreSQL). localStorage is the training-wheels version — same concept, simpler API.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: #fafaf9; padding: 20px; max-width: 500px; margin: 0 auto; }
  h1 { font-size: 18px; margin-bottom: 4px; color: #292524; }
  .note { font-size: 11px; color: #a8a29e; margin-bottom: 16px; }
  .book { padding: 10px; border-bottom: 1px solid #e7e5e4; font-size: 14px; display: flex; justify-content: space-between; }
  .add { display: flex; gap: 8px; margin-bottom: 16px; }
  .add input { flex: 1; padding: 8px; border: 1px solid #d6d3d1; border-radius: 6px; }
  .add button { padding: 8px 16px; background: #6d28d9; color: white; border: none; border-radius: 6px; cursor: pointer; }
  .clear { margin-top: 12px; font-size: 11px; color: #ef4444; cursor: pointer; background: none; border: none; }
</style>
</head>
<body>
  <h1>📚 Persistent Library</h1>
  <p class="note">Data saved to localStorage — survives page refresh!</p>
  <div class="add">
    <input id="input" placeholder="Add a book..." onkeydown="if(event.key==='Enter')add()">
    <button onclick="add()">Add</button>
  </div>
  <div id="list"></div>
  <button class="clear" onclick="clearAll()">Clear all data</button>

  <script>
    // Load from localStorage (persists across refreshes)
    let books = JSON.parse(localStorage.getItem('library_books') || '["Assamese Folktales","Science for Beginners"]');

    function save() {
      localStorage.setItem('library_books', JSON.stringify(books));
    }

    function render() {
      document.getElementById('list').innerHTML =
        books.map((b, i) =>
          '<div class="book"><span>' + b + '</span>' +
          '<button onclick="remove(' + i + ')" style="font-size:11px;padding:2px 8px;border:1px solid #ddd;border-radius:4px;cursor:pointer">×</button></div>'
        ).join('');
    }

    function add() {
      const input = document.getElementById('input');
      if (input.value.trim()) {
        books.push(input.value.trim());
        input.value = '';
        save(); render();
      }
    }

    function remove(i) { books.splice(i, 1); save(); render(); }
    function clearAll() { books = []; save(); render(); }

    render();
  </script>
</body>
</html>`,
    },
    {
      title: 'API design — how frontend talks to backend',
      concept: 'A real library app has a **backend** (server + database) and a **frontend** (what users see). They communicate via an **API** (Application Programming Interface) — a set of URL endpoints that accept requests and return data. The standard pattern is **REST**: GET /books (list all), POST /books (add one), PUT /books/123 (update), DELETE /books/123 (remove). The frontend sends HTTP requests; the backend responds with JSON data.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: monospace; background: #1e1b4b; color: #e0e7ff; padding: 20px; max-width: 600px; margin: 0 auto; }
  h1 { font-size: 16px; color: #a5b4fc; margin-bottom: 16px; }
  .endpoint { background: #312e81; border-radius: 8px; padding: 14px; margin-bottom: 10px; border: 1px solid #4338ca; }
  .method { font-weight: bold; display: inline-block; width: 60px; }
  .get { color: #34d399; } .post { color: #fbbf24; } .put { color: #60a5fa; } .del { color: #f87171; }
  .path { color: #c7d2fe; }
  .desc { color: #818cf8; font-size: 12px; margin-top: 4px; }
  .response { background: #1e1b4b; border: 1px solid #4338ca; border-radius: 4px; padding: 8px; margin-top: 8px; font-size: 11px; color: #a5b4fc; white-space: pre; }
</style>
</head>
<body>
  <h1>📡 Library API Design</h1>

  <div class="endpoint">
    <span class="method get">GET</span> <span class="path">/api/books</span>
    <div class="desc">List all books</div>
    <div class="response">[
  {"id": 1, "title": "Folktales", "available": true},
  {"id": 2, "title": "Science", "available": false}
]</div>
  </div>

  <div class="endpoint">
    <span class="method post">POST</span> <span class="path">/api/books</span>
    <div class="desc">Add a new book</div>
    <div class="response">Body: {"title": "New Book", "category": "Fiction"}
Response: {"id": 3, "title": "New Book", "created": true}</div>
  </div>

  <div class="endpoint">
    <span class="method put">PUT</span> <span class="path">/api/books/2/borrow</span>
    <div class="desc">Borrow a book</div>
    <div class="response">Body: {"borrower": "Rina"}
Response: {"id": 2, "available": false, "borrower": "Rina"}</div>
  </div>

  <div class="endpoint">
    <span class="method del">DELETE</span> <span class="path">/api/books/3</span>
    <div class="desc">Remove a book</div>
    <div class="response">Response: {"deleted": true}</div>
  </div>

  <div style="margin-top:20px;font-size:12px;color:#818cf8">
    This is how every web app works: frontend sends HTTP requests,
    backend responds with JSON. React + Supabase follows this exact pattern.
  </div>
</body>
</html>`,
    },
    {
      title: 'Putting it all together — the full-stack library',
      concept: 'You now understand every layer: HTML (structure), CSS (style), JavaScript (behavior), components (reuse), state (data), persistence (survival), APIs (communication). A real full-stack app like the TigmaMinds Academy website uses React (components + state), Tailwind CSS (styling), Supabase (database + API), and Vite (build tool). The concepts are identical to what you\'ve learned — just more polished tooling around the same ideas.',
      code: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, sans-serif; background: linear-gradient(135deg,#f5f3ff,#ede9fe); min-height: 100vh; }
  header { background: #4c1d95; color: white; padding: 16px 20px; text-align: center; }
  header h1 { font-size: 18px; } header p { font-size: 11px; opacity: 0.7; }
  main { max-width: 500px; margin: 0 auto; padding: 16px; }
  .stats { display: flex; gap: 8px; margin-bottom: 12px; }
  .stat { flex:1; background:white; padding:10px; border-radius:8px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
  .stat .n { font-size:20px; font-weight:700; color:#6d28d9; } .stat .l { font-size:9px; color:#a8a29e; text-transform:uppercase; }
  .search { width:100%; padding:8px 12px; border:2px solid #ddd6fe; border-radius:8px; font-size:13px; margin-bottom:12px; outline:none; }
  .search:focus { border-color:#7c3aed; }
  .book { display:flex; justify-content:space-between; align-items:center; background:white; padding:12px; border-radius:8px; margin-bottom:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05); }
  .book h3 { font-size:13px; color:#1c1917; } .book .m { font-size:10px; color:#78716c; }
  .btn { padding:4px 12px; border:none; border-radius:6px; font-size:11px; cursor:pointer; font-weight:600; }
  .btn-p { background:#7c3aed; color:white; } .btn-s { background:#fbbf24; color:#78350f; }
</style>
</head>
<body>
  <header><h1>📚 Bhalukpara Pustok Ghor</h1><p>Full-Stack Library App</p></header>
  <main>
    <div class="stats" id="stats"></div>
    <input class="search" placeholder="Search..." oninput="render()">
    <div id="app"></div>
  </main>
  <script>
    let books = JSON.parse(localStorage.getItem('lib2') || 'null') || [
      {id:1,t:'Assamese Folktales',c:'Fiction',a:true},
      {id:2,t:'Science for Beginners',c:'Science',a:true},
      {id:3,t:'The River Dolphin',c:'Fiction',a:false,w:'Rina'},
      {id:4,t:'Math Puzzles',c:'Math',a:true},
    ];
    function save(){localStorage.setItem('lib2',JSON.stringify(books))}
    function render(){
      const q=document.querySelector('.search').value.toLowerCase();
      const f=books.filter(b=>b.t.toLowerCase().includes(q));
      const av=books.filter(b=>b.a).length;
      document.getElementById('stats').innerHTML=
        '<div class="stat"><div class="n">'+books.length+'</div><div class="l">Total</div></div>'+
        '<div class="stat"><div class="n">'+av+'</div><div class="l">Available</div></div>'+
        '<div class="stat"><div class="n">'+(books.length-av)+'</div><div class="l">Borrowed</div></div>';
      document.getElementById('app').innerHTML=f.map(b=>
        '<div class="book"><div><h3>'+b.t+'</h3><p class="m">'+(b.a?'✓ Available':'📖 '+b.w)+'</p></div>'+
        (b.a?'<button class="btn btn-p" onclick="borrow('+b.id+')">Borrow</button>':
        '<button class="btn btn-s" onclick="ret('+b.id+')">Return</button>')+'</div>'
      ).join('');
    }
    function borrow(id){const n=prompt('Name:');if(!n)return;const b=books.find(x=>x.id===id);b.a=false;b.w=n;save();render()}
    function ret(id){const b=books.find(x=>x.id===id);b.a=true;b.w=null;save();render()}
    render();
  </script>
</body>
</html>`,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" />
          Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed Level 1 (or some web dev experience)</span>
      </div>

      <div className="space-y-8">
        {lessons.map((lesson, i) => (
          <div key={i} id={`L2-${i + 1}`} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden scroll-mt-24">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.concept.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>').replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-violet-700 dark:text-violet-300 text-xs font-mono">$1</code>') }} />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <HtmlPlayground starterCode={lesson.code} title={`Lesson ${i + 1}`} previewHeight={300} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
