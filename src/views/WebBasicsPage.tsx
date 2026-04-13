import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, CheckCircle, Circle, Code2, Sparkles } from 'lucide-react';
import HtmlPlayground from '../components/HtmlPlayground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBasicsProgress } from '../contexts/BasicsProgressContext';
import { useAuth } from '../contexts/AuthContext';
import SignUpGate from '../components/SignUpGate';

const FREE_LESSONS = 3;
import { HTMLTagsDiagram, HTMLStructureDiagram, CSSBoxModelDiagram, FlexboxDiagram, DOMManipulationDiagram, EventListenerDiagram, ComponentDiagram, TodoDataFlowDiagram } from '../components/diagrams/WebBasicsDiagrams';

const lessons = [
  {
    title: 'Your first webpage — HTML tags',
    concept: `Every webpage you have ever visited is built from **HTML** — HyperText Markup Language. It is not a programming language; it is a **markup** language, meaning it describes the *structure* of content. Think of it like labeling boxes: this box is a heading, this box is a paragraph, this box is a list.

HTML uses **tags** — words wrapped in angle brackets. Most tags come in pairs: an opening tag \`<h1>\` and a closing tag \`</h1>\`. Everything between them is the content that tag describes. The browser reads these tags and knows how to display the content.

Every HTML document has the same skeleton: \`<html>\` wraps everything, \`<head>\` holds metadata (title, styles), and \`<body>\` holds the visible content. The \`<!DOCTYPE html>\` at the top tells the browser "this is modern HTML." Once you understand this skeleton, you can build any webpage.`,
    analogy: 'HTML tags are like the section signs in a newspaper. The editor does not just dump text on a page — they label each piece: "HEADLINE," "SUBHEADING," "BODY TEXT," "CAPTION." The layout team reads those labels and formats accordingly. HTML tags are those labels, and the browser is the layout team.',
    storyConnection: 'In "The Boy Who Built a Library," Arjun wanted to organize books so anyone could find them. A webpage works the same way — headings, paragraphs, and sections organize information so visitors can read and navigate. HTML is the shelving system of the web.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My First Webpage</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my very first webpage.</p>
  <p>I built this with HTML — just text and tags!</p>

  <!-- This is a comment. The browser ignores it. -->
  <!-- Try changing the text above and watch the preview update. -->

  <h2>What I will learn</h2>
  <p>
    I am going to learn HTML, CSS, and JavaScript.
    By the end, I will build a real interactive app.
  </p>
</body>
</html>`,
    challenge: 'Change the heading to your own name. Add a third paragraph introducing yourself — your favorite subject, where you are from, and what you want to build.',
    successHint: 'You just built a webpage. Every site on the internet — Google, Wikipedia, YouTube — starts with exactly this structure: DOCTYPE, html, head, body.',
  },
  {
    title: 'Adding structure — headings, lists, links, images',
    concept: `A real webpage needs more than paragraphs. HTML gives you building blocks to organize any kind of content. **Headings** (\`<h1>\` through \`<h6>\`) create a hierarchy — h1 is the main title, h2 is a section, h3 is a subsection. Screen readers and search engines use this hierarchy to understand your page.

**Lists** come in two flavors: \`<ul>\` (unordered — bullet points) and \`<ol>\` (ordered — numbered). Each item inside is wrapped in \`<li>\`. Lists are everywhere on the web: navigation menus, ingredient lists, step-by-step instructions.

**Links** use the \`<a>\` tag with an \`href\` attribute: \`<a href="https://example.com">Click here</a>\`. The href is the destination, and the text between the tags is what the user sees and clicks. **Images** use a self-closing \`<img>\` tag: \`<img src="url" alt="description">\`. The \`alt\` text is essential for accessibility — it describes the image for people who cannot see it.`,
    analogy: 'Think of a webpage like a well-organized bookshelf. Headings are the shelf labels ("Fiction," "Science," "History"). Lists are the books lined up in order. Links are bookmarks that jump you to another shelf or another library entirely. Images are the illustrations pinned to the shelf.',
    storyConnection: 'When Arjun built his library in "The Boy Who Built a Library," he did not just pile books on the floor. He created categories, labeled shelves, and made a card catalog so people could find what they needed. HTML structure does the same thing for information on the web.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Assam Wildlife Guide</title>
</head>
<body>
  <h1>Wildlife of Assam</h1>
  <p>A beginner's guide to the incredible animals of Northeast India.</p>

  <h2>Mammals</h2>
  <ul>
    <li>One-horned rhinoceros</li>
    <li>Asian elephant</li>
    <li>Hoolock gibbon</li>
    <li>Gangetic river dolphin</li>
  </ul>

  <h2>Birds</h2>
  <ol>
    <li>Greater adjutant stork</li>
    <li>White-winged wood duck</li>
    <li>Bengal florican</li>
  </ol>

  <h2>Learn More</h2>
  <p>
    Visit <a href="https://kaziranga.assam.gov.in" target="_blank">Kaziranga National Park</a>
    to see these animals in the wild.
  </p>

  <h3>Photo</h3>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Indian_Rhinoceros.jpg/320px-Indian_Rhinoceros.jpg"
    alt="One-horned rhinoceros in Kaziranga"
    width="320"
  />
  <p><em>The one-horned rhino, symbol of Assam.</em></p>
</body>
</html>`,
    challenge: 'Add a "Reptiles" section with at least 3 species in an unordered list. Add a link to a Wikipedia article about one of the species. Bonus: add an image of your favorite animal.',
    successHint: 'You now know the five most-used HTML elements: headings, paragraphs, lists, links, and images. These cover 90% of the content on the web.',
  },
  {
    title: 'CSS basics — making it look good',
    concept: `HTML defines the structure of a page, but **CSS** (Cascading Style Sheets) controls how it *looks*. Without CSS, every webpage would be black text on a white background in Times New Roman. CSS lets you change colors, fonts, spacing, sizes, and layout.

You write CSS rules inside a \`<style>\` tag in the \`<head>\`. Each rule has a **selector** (what to style) and **declarations** (how to style it):

\`\`\`
h1 {
  color: #2563eb;
  font-size: 32px;
}
\`\`\`

This says: "Find every h1, make the text blue, and set the size to 32 pixels." Key properties to know: \`color\` (text color), \`background-color\`, \`font-size\`, \`font-family\`, \`margin\` (space outside an element), \`padding\` (space inside an element), \`border\`.

CSS uses **the box model**: every element is a box with content, padding, border, and margin — like a picture in a frame with a mat. Understanding this model is the key to controlling layout.`,
    analogy: 'If HTML is the skeleton of a building — walls, floors, rooms — then CSS is the interior design. Same floor plan, completely different feel depending on the paint colors, furniture, and lighting. CSS is the paint and furniture of the web.',
    storyConnection: 'Arjun\'s library in "The Boy Who Built a Library" was not just organized — it was inviting. Colorful labels, comfortable seating, good lighting. CSS does the same for a webpage: it takes raw structure and makes it something people want to spend time with.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Styled Wildlife Guide</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, serif;
      background-color: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      line-height: 1.6;
    }

    /* Headings */
    h1 {
      color: #34d399;
      font-size: 28px;
      margin-bottom: 8px;
    }

    h2 {
      color: #60a5fa;
      font-size: 20px;
      margin-top: 24px;
      margin-bottom: 8px;
      border-bottom: 2px solid #1e3a5f;
      padding-bottom: 4px;
    }

    /* Paragraphs */
    p {
      margin-bottom: 12px;
      color: #94a3b8;
    }

    /* Lists */
    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      padding: 8px 12px;
      margin-bottom: 4px;
      background-color: #1e293b;
      border-left: 3px solid #34d399;
      border-radius: 4px;
    }

    /* Links */
    a {
      color: #f59e0b;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Image styling */
    img {
      border-radius: 8px;
      margin-top: 12px;
      border: 2px solid #1e3a5f;
    }
  </style>
</head>
<body>
  <h1>Wildlife of Assam</h1>
  <p>A guide styled with CSS — same HTML, completely different look.</p>

  <h2>Key Species</h2>
  <ul>
    <li>One-horned rhinoceros — Kaziranga</li>
    <li>Asian elephant — Manas National Park</li>
    <li>Hoolock gibbon — Hollongapar Forest</li>
    <li>River dolphin — Brahmaputra River</li>
  </ul>

  <h2>Conservation Status</h2>
  <p>
    Several species in Assam are <strong>critically endangered</strong>.
    Learn more at <a href="#">Assam Wildlife Division</a>.
  </p>

  <p>
    Try changing the colors above. Replace <code>#34d399</code> with
    <code>#f472b6</code> (pink) or <code>#facc15</code> (yellow) and
    watch the page transform.
  </p>
</body>
</html>`,
    challenge: 'Change the background to a light theme (white background, dark text). Change the list item border color to blue. Add a hover effect on list items that changes their background color when you mouse over them (hint: use ul li:hover).',
    successHint: 'You just styled a complete webpage. The dark theme you see here is the same approach used by this platform, VS Code, and GitHub dark mode — all CSS.',
  },
  {
    title: 'CSS layout — flexbox and cards',
    concept: `The hardest part of CSS is not colors or fonts — it is **layout**. How do you put things side by side? How do you center something? Before flexbox, this was painful. Now it is simple.

**Flexbox** is a layout mode you activate with \`display: flex\`. The container becomes a flex container, and its children become flex items that line up in a row (or column). Key properties:

- \`justify-content\`: controls horizontal spacing (center, space-between, space-around)
- \`align-items\`: controls vertical alignment (center, flex-start, flex-end)
- \`gap\`: adds space between items
- \`flex-wrap: wrap\`: allows items to wrap to the next line

With just these four properties, you can build card grids, navigation bars, centered hero sections, and responsive layouts. Flexbox is the single most important CSS skill for modern web development.`,
    analogy: 'Flexbox is like arranging photos on a bulletin board. Without flexbox, you are taping each photo at exact coordinates. With flexbox, you tell the board: "spread these photos evenly across the row with equal gaps." The board figures out the math. You describe the intent, CSS handles the details.',
    storyConnection: 'A library catalog is not just a list — it is a grid of cards showing book covers, titles, and descriptions. In "The Boy Who Built a Library," Arjun needed this kind of layout to help visitors browse. Flexbox is how you build it on the web.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Story Cards</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
    }

    h1 {
      text-align: center;
      color: #34d399;
      margin-bottom: 24px;
    }

    /* The flex container — this is the magic */
    .card-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
    }

    /* Each card */
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 20px;
      width: 220px;
      transition: transform 0.2s, border-color 0.2s;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: #34d399;
    }

    .card h3 {
      color: #f59e0b;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .card p {
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.5;
    }

    .card .tag {
      display: inline-block;
      margin-top: 12px;
      padding: 2px 10px;
      background: #34d399;
      color: #0f172a;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }

    /* Centered footer */
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      padding: 16px;
      color: #64748b;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <h1>TigmaMinds Stories</h1>

  <div class="card-grid">
    <div class="card">
      <h3>The Girl Who Spoke to Elephants</h3>
      <p>AI-powered wildlife tracking in Kaziranga.</p>
      <span class="tag">AI</span>
    </div>

    <div class="card">
      <h3>The Firefly Festival of Majuli</h3>
      <p>LEDs, circuits, and bioluminescence.</p>
      <span class="tag">Electronics</span>
    </div>

    <div class="card">
      <h3>Why the Muga Silk Is Golden</h3>
      <p>Biology and materials science of silk.</p>
      <span class="tag">Biology</span>
    </div>

    <div class="card">
      <h3>The River Dolphin's Secret</h3>
      <p>Sonar sensors and Arduino programming.</p>
      <span class="tag">Hardware</span>
    </div>

    <div class="card">
      <h3>The Boy Who Built a Library</h3>
      <p>Web development and databases.</p>
      <span class="tag">Web Dev</span>
    </div>

    <div class="card">
      <h3>The Dragonfly and the Paddy Field</h3>
      <p>Drones and computer vision.</p>
      <span class="tag">Robotics</span>
    </div>
  </div>

  <div class="footer">
    Built with flexbox — try resizing the preview to see cards reflow!
  </div>
</body>
</html>`,
    challenge: 'Add a "Level" indicator to each card (Level 0, Level 1, etc.) with a different colored tag. Make the cards wider on hover (width change with transition). Add a header bar at the top using flexbox with a logo on the left and a nav link on the right.',
    successHint: 'You just built a responsive card grid with hover effects. This layout pattern powers Netflix thumbnails, app stores, and dashboard UIs everywhere.',
  },
  {
    title: 'JavaScript basics — making pages think',
    concept: `HTML builds structure. CSS adds style. **JavaScript** adds **behavior** — it makes pages interactive, dynamic, and smart. JavaScript runs inside a \`<script>\` tag and can read, modify, or create any element on the page.

**Variables** store data: \`let count = 0;\` or \`const name = "Arjun";\`. Use \`let\` for values that change, \`const\` for values that stay the same. **console.log()** prints to the browser console (like Python's print). **alert()** shows a popup.

The most important JavaScript skill is **talking to the HTML page**. \`document.getElementById("myBox")\` grabs an element by its id attribute. Once you have the element, you can read or change it:

\`\`\`
const heading = document.getElementById("title");
heading.textContent = "New Title!";
heading.style.color = "red";
\`\`\`

This is called **DOM manipulation** — the DOM (Document Object Model) is the browser's live representation of your HTML. JavaScript lets you reach in and change it.`,
    analogy: 'If HTML is the set of a theater play and CSS is the costumes and lighting, then JavaScript is the actors. The set and costumes are static — they sit there looking nice. But the actors bring the play to life: they move, speak, react to the audience. JavaScript is what makes a webpage come alive.',
    storyConnection: 'In "The Boy Who Built a Library," the catalog was not just a printed list — visitors could search it, filter by genre, and check availability. That interactivity requires JavaScript. Without it, a library website is just a static poster.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Basics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
    }
    h1 { color: #34d399; margin-bottom: 16px; }
    .output {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
      font-family: monospace;
      min-height: 120px;
      white-space: pre-line;
    }
    .demo-box {
      display: inline-block;
      padding: 16px 24px;
      background: #1e293b;
      border: 2px solid #334155;
      border-radius: 8px;
      margin: 8px 0;
      font-size: 18px;
      transition: all 0.3s;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: white;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <h1>JavaScript Basics</h1>

  <h3 style="color: #60a5fa;">1. Variables and Output</h3>
  <div id="output1" class="output">Click the button to run the code...</div>
  <button onclick="runVariables()">Run Variables Demo</button>

  <h3 style="color: #60a5fa; margin-top: 20px;">2. Changing the Page</h3>
  <div id="demoBox" class="demo-box">I am a box. Click the button to change me!</div>
  <br/>
  <button onclick="changeBox()">Transform Box</button>
  <button onclick="resetBox()">Reset</button>

  <h3 style="color: #60a5fa; margin-top: 20px;">3. Calculations</h3>
  <div id="output2" class="output">Click to see math in action...</div>
  <button onclick="runCalculation()">Calculate</button>

  <script>
    // --- 1. Variables ---
    function runVariables() {
      const name = "Arjun";
      let age = 14;
      let booksRead = 127;
      const libraryName = "Majuli Community Library";

      const output = document.getElementById("output1");
      output.textContent =
        "Name: " + name + "\\n" +
        "Age: " + age + "\\n" +
        "Books read: " + booksRead + "\\n" +
        "Library: " + libraryName + "\\n\\n" +
        "Next year, age will be: " + (age + 1) + "\\n" +
        "Reading goal: " + (booksRead + 50) + " books";
    }

    // --- 2. DOM manipulation ---
    function changeBox() {
      const box = document.getElementById("demoBox");
      box.textContent = "I have been transformed by JavaScript!";
      box.style.background = "#34d399";
      box.style.color = "#0f172a";
      box.style.borderColor = "#059669";
      box.style.fontWeight = "bold";
      box.style.transform = "scale(1.1)";
    }

    function resetBox() {
      const box = document.getElementById("demoBox");
      box.textContent = "I am a box. Click the button to change me!";
      box.style.background = "#1e293b";
      box.style.color = "#e2e8f0";
      box.style.borderColor = "#334155";
      box.style.fontWeight = "normal";
      box.style.transform = "scale(1)";
    }

    // --- 3. Math ---
    function runCalculation() {
      const books = [42, 38, 55, 29, 61, 44, 50, 33, 47, 56, 39, 52];
      const months = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];

      let total = 0;
      let best = 0;
      let bestMonth = "";

      for (let i = 0; i < books.length; i++) {
        total += books[i];
        if (books[i] > best) {
          best = books[i];
          bestMonth = months[i];
        }
      }

      const avg = (total / books.length).toFixed(1);
      const output = document.getElementById("output2");
      output.textContent =
        "Monthly books borrowed:\\n" +
        months.map((m, i) => "  " + m + ": " + books[i]).join("\\n") +
        "\\n\\nTotal: " + total +
        "\\nAverage: " + avg + " per month" +
        "\\nBusiest month: " + bestMonth + " (" + best + " books)";
    }
  </script>
</body>
</html>`,
    challenge: 'Add a fourth section: a "greeting generator" that combines a random name from a list with a random greeting ("Hello," "Welcome," "Good morning") and displays it in a new output div. Use Math.random() and Math.floor().',
    successHint: 'You just wrote JavaScript that reads variables, does math, loops through data, and changes the page in real time. This is the foundation of every web application.',
  },
  {
    title: 'Responding to clicks — event handling',
    concept: `A webpage that only runs code once is not very useful. Real web apps **respond to user actions**: clicks, key presses, mouse movements, form submissions. These actions are called **events**, and you handle them with **event listeners**.

There are two ways to respond to events. The simple way is inline: \`<button onclick="doSomething()">\`. The better way is \`addEventListener\`, which keeps your HTML and JavaScript separate:

\`\`\`
const btn = document.getElementById("myBtn");
btn.addEventListener("click", function() {
  // this code runs when the button is clicked
});
\`\`\`

You can listen for many events: "click", "mouseover", "mouseout", "keydown", "input" (typing in a text field). Inside the handler, you can change any element on the page — update text, toggle visibility, change colors, add or remove CSS classes.

**Template literals** make building dynamic strings easy: \`\`Hello, \${name}!\`\` — the \`\${}\` inserts the variable's value.`,
    analogy: 'Event listeners are like motion-sensor lights. The light does not stay on all the time — it waits. When someone walks by (the event), the sensor detects it and triggers the light (the handler). Your code waits quietly until the user does something, then springs into action.',
    storyConnection: 'A library catalog needs to respond to searches, clicks on book cards, filter selections, and form submissions. Every interactive feature in "The Boy Who Built a Library" is powered by event listeners — the invisible wiring that connects user actions to page updates.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Event Handling</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
    }
    h1 { color: #34d399; margin-bottom: 20px; }
    h3 { color: #60a5fa; margin: 20px 0 8px; }

    .color-box {
      width: 200px;
      height: 200px;
      background: #334155;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      margin: 8px 0;
    }

    input[type="text"] {
      padding: 8px 12px;
      border: 1px solid #334155;
      border-radius: 6px;
      background: #1e293b;
      color: #e2e8f0;
      font-size: 16px;
      width: 280px;
    }

    .live-preview {
      margin-top: 8px;
      padding: 12px;
      background: #1e293b;
      border-radius: 8px;
      min-height: 40px;
      font-size: 18px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #2563eb;
      color: white;
      cursor: pointer;
      font-size: 14px;
      margin: 4px;
    }
    button:hover { background: #1d4ed8; }

    .counter-display {
      font-size: 48px;
      font-weight: bold;
      color: #f59e0b;
      text-align: center;
      padding: 16px;
    }

    .emoji-trail {
      min-height: 60px;
      padding: 12px;
      background: #1e293b;
      border-radius: 8px;
      font-size: 24px;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <h1>Responding to Clicks</h1>

  <h3>1. Click to Change Color</h3>
  <div id="colorBox" class="color-box">Click me!</div>

  <h3>2. Live Text Preview</h3>
  <input type="text" id="nameInput" placeholder="Type your name..." />
  <div id="livePreview" class="live-preview">Hello, ___!</div>

  <h3>3. Counter</h3>
  <div id="counterDisplay" class="counter-display">0</div>
  <div style="text-align: center;">
    <button id="decrementBtn">- 1</button>
    <button id="resetBtn">Reset</button>
    <button id="incrementBtn">+ 1</button>
  </div>

  <h3>4. Click Trail</h3>
  <p style="color: #94a3b8; font-size: 13px;">Click the box below to leave a trail</p>
  <div id="trail" class="emoji-trail">Click here...</div>

  <script>
    // --- 1. Color changer ---
    const colors = ["#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7","#ec4899"];
    let colorIndex = 0;

    const colorBox = document.getElementById("colorBox");
    colorBox.addEventListener("click", function() {
      colorIndex = (colorIndex + 1) % colors.length;
      colorBox.style.background = colors[colorIndex];
      colorBox.textContent = "Color #" + (colorIndex + 1) + " of " + colors.length;
    });

    // --- 2. Live input preview ---
    const nameInput = document.getElementById("nameInput");
    const livePreview = document.getElementById("livePreview");

    nameInput.addEventListener("input", function() {
      const name = nameInput.value.trim();
      if (name) {
        livePreview.textContent = "Hello, " + name + "! Welcome to the library.";
        livePreview.style.color = "#34d399";
      } else {
        livePreview.textContent = "Hello, ___!";
        livePreview.style.color = "#e2e8f0";
      }
    });

    // --- 3. Counter with three buttons ---
    let count = 0;
    const display = document.getElementById("counterDisplay");

    document.getElementById("incrementBtn").addEventListener("click", function() {
      count++;
      display.textContent = count;
      display.style.color = count > 0 ? "#22c55e" : count < 0 ? "#ef4444" : "#f59e0b";
    });

    document.getElementById("decrementBtn").addEventListener("click", function() {
      count--;
      display.textContent = count;
      display.style.color = count > 0 ? "#22c55e" : count < 0 ? "#ef4444" : "#f59e0b";
    });

    document.getElementById("resetBtn").addEventListener("click", function() {
      count = 0;
      display.textContent = "0";
      display.style.color = "#f59e0b";
    });

    // --- 4. Click trail ---
    const emojis = ["📚","🐘","🌳","🦋","🔬","🎨","🗺️","⚡"];
    const trail = document.getElementById("trail");

    trail.addEventListener("click", function() {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      if (trail.textContent === "Click here...") {
        trail.textContent = emoji;
      } else {
        trail.textContent += " " + emoji;
      }
    });
  </script>
</body>
</html>`,
    challenge: 'Add a "double-click to clear" feature on the emoji trail. Add a mouseover event on the color box that shows "Hover!" and a mouseout event that shows "Click me!" again. Bonus: make the counter display a different emoji at every multiple of 5.',
    successHint: 'Event handling is the core of interactive web development. Every button, form, dropdown, and drag-and-drop feature you have ever used is powered by event listeners exactly like the ones you just wrote.',
  },
  {
    title: 'Building a component — HTML + CSS + JS together',
    concept: `So far you have learned the three languages of the web separately. Now it is time to **combine them** into a real component — a self-contained piece of UI that has structure (HTML), style (CSS), and behavior (JavaScript) working together.

A **component** is a reusable building block. Think of a card that flips when clicked: the front shows a question, the back shows the answer. It needs HTML (two sides of the card), CSS (positioning, the flip animation, hover glow), and JavaScript (click handler to toggle the flip state).

Professional web developers think in components. A navigation bar is a component. A search box is a component. A notification popup is a component. Each one is designed once and reused everywhere. The key insight is that **the three languages are not separate skills — they are three parts of one skill**.`,
    analogy: 'A component is like a LEGO brick. Each brick has a shape (HTML), a color (CSS), and sometimes a moving part like a hinge or wheel (JavaScript). You build complex structures by snapping simple, self-contained bricks together. No one builds a LEGO castle from raw plastic — they use pre-designed pieces.',
    storyConnection: 'Arjun\'s library in "The Boy Who Built a Library" had book cards — each showing a cover, title, author, and a "check out" button. That is a component: the same card structure repeated for every book, each with its own data and click behavior.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>Flashcard Component</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      min-height: 100vh;
    }
    h1 { color: #34d399; text-align: center; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #94a3b8; margin-bottom: 24px; font-size: 14px; }

    /* Card grid */
    .card-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
    }

    /* Flip card container */
    .flip-card {
      width: 220px;
      height: 160px;
      perspective: 1000px;
      cursor: pointer;
    }

    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .flip-card.flipped .flip-card-inner {
      transform: rotateY(180deg);
    }

    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .flip-card-front {
      background: linear-gradient(135deg, #1e293b, #334155);
      border: 1px solid #475569;
    }

    .flip-card-front:hover {
      border-color: #34d399;
      box-shadow: 0 0 20px rgba(52, 211, 153, 0.1);
    }

    .flip-card-back {
      background: linear-gradient(135deg, #064e3b, #065f46);
      border: 1px solid #34d399;
      transform: rotateY(180deg);
    }

    .card-question {
      font-size: 14px;
      color: #f59e0b;
      font-weight: 600;
    }

    .card-hint {
      font-size: 11px;
      color: #64748b;
      margin-top: 8px;
    }

    .card-answer {
      font-size: 14px;
      color: #d1fae5;
    }

    .card-detail {
      font-size: 11px;
      color: #6ee7b7;
      margin-top: 8px;
    }

    /* Score bar */
    .score-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
      padding: 12px;
      background: #1e293b;
      border-radius: 8px;
    }

    .score-bar span { font-size: 14px; }
    .score-bar button {
      padding: 6px 16px;
      border: none;
      border-radius: 6px;
      background: #ef4444;
      color: white;
      cursor: pointer;
      font-size: 13px;
    }
    .score-bar button:hover { background: #dc2626; }
  </style>
</head>
<body>
  <h1>Wildlife Flashcards</h1>
  <p class="subtitle">Click a card to flip it. How many can you get right?</p>

  <div class="card-grid" id="cardGrid"></div>

  <div class="score-bar">
    <span>Flipped: <strong id="flipped">0</strong> / <span id="total">0</span></span>
    <button id="resetBtn">Reset All</button>
  </div>

  <script>
    const flashcards = [
      { q: "What is the one-horned rhino's main habitat in Assam?", a: "Kaziranga National Park", detail: "Home to 2/3 of the world's population" },
      { q: "Which Assamese silk is known for its golden color?", a: "Muga silk", detail: "Produced only in Assam, from the Antheraea assamensis moth" },
      { q: "What river island is the largest in the world?", a: "Majuli", detail: "Located in the Brahmaputra River, ~352 sq km" },
      { q: "What type of gibbon is found in Assam?", a: "Western hoolock gibbon", detail: "India's only ape species" },
      { q: "Which dolphin lives in the Brahmaputra?", a: "Gangetic river dolphin", detail: "Nearly blind — navigates by echolocation" },
      { q: "What festival celebrates Assamese New Year?", a: "Rongali Bihu", detail: "Celebrated in mid-April during spring" },
    ];

    const grid = document.getElementById("cardGrid");
    const flippedDisplay = document.getElementById("flipped");
    const totalDisplay = document.getElementById("total");
    let flippedCount = 0;

    totalDisplay.textContent = flashcards.length;

    // Build cards dynamically with JavaScript
    flashcards.forEach(function(card, index) {
      const div = document.createElement("div");
      div.className = "flip-card";
      div.innerHTML =
        '<div class="flip-card-inner">' +
          '<div class="flip-card-front">' +
            '<div class="card-question">' + card.q + '</div>' +
            '<div class="card-hint">Click to reveal</div>' +
          '</div>' +
          '<div class="flip-card-back">' +
            '<div class="card-answer">' + card.a + '</div>' +
            '<div class="card-detail">' + card.detail + '</div>' +
          '</div>' +
        '</div>';

      div.addEventListener("click", function() {
        const isFlipped = div.classList.contains("flipped");
        if (!isFlipped) {
          div.classList.add("flipped");
          flippedCount++;
        } else {
          div.classList.remove("flipped");
          flippedCount--;
        }
        flippedDisplay.textContent = flippedCount;
      });

      grid.appendChild(div);
    });

    // Reset button
    document.getElementById("resetBtn").addEventListener("click", function() {
      document.querySelectorAll(".flip-card").forEach(function(card) {
        card.classList.remove("flipped");
      });
      flippedCount = 0;
      flippedDisplay.textContent = "0";
    });
  </script>
</body>
</html>`,
    challenge: 'Add a "shuffle" button that randomizes the card order. Add a visual indicator (green border) on cards that have been flipped at least once. Track how many cards have been viewed at least once vs. total, and show a congratulations message when all are flipped.',
    successHint: 'You just built a complete interactive component from scratch: data-driven HTML, CSS animations, JavaScript event handling, and dynamic DOM manipulation. This is real web development.',
  },
  {
    title: 'Your first mini-app — a todo list',
    concept: `Everything you have learned comes together here. A **todo list** is the classic first app because it uses every fundamental skill: rendering a list of items (HTML), styling them (CSS), adding items (events + DOM manipulation), marking them done (state management), and deleting them (removing DOM nodes).

The key concept is **state** — the data your app tracks. For a todo list, the state is an array of items. Every user action (add, toggle, delete) modifies the state, and then the page re-renders to match. This pattern — **state changes trigger UI updates** — is the foundation of every modern web framework (React, Vue, Svelte).

You will also learn **event.preventDefault()**, which stops a form from refreshing the page when submitted. Without it, every form submission would reload the page and lose your todos. This is one of those small but critical details that separates working apps from broken ones.`,
    analogy: 'A todo app is like a library checkout system. The librarian has a list of borrowed books (state). When someone returns a book, it gets crossed off (toggled). When someone borrows a new one, it gets added. The display board in the lobby always reflects the current list. Your app works the same way: state changes, display updates.',
    storyConnection: 'In "The Boy Who Built a Library," Arjun needed a system to track which books were available, which were borrowed, and who had them. A todo list is the simplest version of that system — and it teaches every concept you need to build the real thing in Level 1.',
    starterCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Todo App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .app {
      width: 100%;
      max-width: 480px;
    }

    h1 {
      color: #34d399;
      text-align: center;
      margin-bottom: 4px;
      font-size: 24px;
    }

    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 13px;
      margin-bottom: 20px;
    }

    /* Input form */
    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .input-row input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #334155;
      border-radius: 8px;
      background: #1e293b;
      color: #e2e8f0;
      font-size: 15px;
      outline: none;
    }

    .input-row input:focus {
      border-color: #34d399;
    }

    .input-row button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: #34d399;
      color: #0f172a;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
    }

    .input-row button:hover {
      background: #2dd4a6;
    }

    /* Filter bar */
    .filter-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .filter-bar button {
      flex: 1;
      padding: 6px;
      border: 1px solid #334155;
      border-radius: 6px;
      background: transparent;
      color: #94a3b8;
      font-size: 13px;
      cursor: pointer;
    }

    .filter-bar button.active {
      background: #334155;
      color: #e2e8f0;
      border-color: #34d399;
    }

    /* Todo items */
    .todo-list {
      list-style: none;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      margin-bottom: 6px;
      transition: all 0.2s;
    }

    .todo-item:hover {
      border-color: #475569;
    }

    .todo-item.done {
      opacity: 0.5;
    }

    .todo-item.done .todo-text {
      text-decoration: line-through;
      color: #64748b;
    }

    .todo-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #475569;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 12px;
    }

    .todo-item.done .todo-checkbox {
      background: #34d399;
      border-color: #34d399;
      color: #0f172a;
    }

    .todo-text {
      flex: 1;
      font-size: 15px;
    }

    .todo-delete {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .todo-item:hover .todo-delete {
      opacity: 1;
    }

    .todo-delete:hover {
      color: #ef4444;
    }

    /* Stats */
    .stats {
      margin-top: 16px;
      padding: 12px;
      background: #1e293b;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #94a3b8;
    }

    .stats strong {
      color: #34d399;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #475569;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="app">
    <h1>Library Task Tracker</h1>
    <p class="subtitle">Built with HTML, CSS, and JavaScript</p>

    <form id="todoForm" class="input-row">
      <input type="text" id="todoInput" placeholder="Add a task..." autocomplete="off" />
      <button type="submit">Add</button>
    </form>

    <div class="filter-bar">
      <button class="active" data-filter="all">All</button>
      <button data-filter="active">Active</button>
      <button data-filter="done">Done</button>
    </div>

    <ul id="todoList" class="todo-list"></ul>

    <div id="stats" class="stats">
      <span><strong id="activeCount">0</strong> tasks remaining</span>
      <span><strong id="doneCount">0</strong> completed</span>
    </div>
  </div>

  <script>
    // --- State ---
    let todos = [
      { id: 1, text: "Catalog new book donations", done: false },
      { id: 2, text: "Fix the reading lamp in corner B", done: false },
      { id: 3, text: "Update the library website", done: true },
      { id: 4, text: "Organize children's section", done: false },
    ];
    let nextId = 5;
    let filter = "all";

    // --- DOM References ---
    const form = document.getElementById("todoForm");
    const input = document.getElementById("todoInput");
    const list = document.getElementById("todoList");
    const activeCount = document.getElementById("activeCount");
    const doneCount = document.getElementById("doneCount");

    // --- Render function: state -> UI ---
    function render() {
      list.innerHTML = "";

      const filtered = todos.filter(function(t) {
        if (filter === "active") return !t.done;
        if (filter === "done") return t.done;
        return true;
      });

      if (filtered.length === 0) {
        list.innerHTML = '<li class="empty-state">No tasks here.</li>';
      } else {
        filtered.forEach(function(todo) {
          const li = document.createElement("li");
          li.className = "todo-item" + (todo.done ? " done" : "");

          const checkbox = document.createElement("div");
          checkbox.className = "todo-checkbox";
          checkbox.textContent = todo.done ? "\\u2713" : "";
          checkbox.addEventListener("click", function() {
            todo.done = !todo.done;
            render();
          });

          const text = document.createElement("span");
          text.className = "todo-text";
          text.textContent = todo.text;

          const del = document.createElement("button");
          del.className = "todo-delete";
          del.textContent = "\\u00d7";
          del.addEventListener("click", function() {
            todos = todos.filter(function(t) { return t.id !== todo.id; });
            render();
          });

          li.appendChild(checkbox);
          li.appendChild(text);
          li.appendChild(del);
          list.appendChild(li);
        });
      }

      // Update stats
      const active = todos.filter(function(t) { return !t.done; }).length;
      const done = todos.filter(function(t) { return t.done; }).length;
      activeCount.textContent = active;
      doneCount.textContent = done;
    }

    // --- Add todo ---
    form.addEventListener("submit", function(e) {
      e.preventDefault(); // Stop page reload!
      const text = input.value.trim();
      if (!text) return;
      todos.push({ id: nextId++, text: text, done: false });
      input.value = "";
      render();
    });

    // --- Filter buttons ---
    document.querySelectorAll(".filter-bar button").forEach(function(btn) {
      btn.addEventListener("click", function() {
        filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".filter-bar button").forEach(function(b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        render();
      });
    });

    // --- Initial render ---
    render();
  </script>
</body>
</html>`,
    challenge: 'Add an "edit" feature: double-click a task to turn it into an input field, press Enter to save. Add localStorage persistence so tasks survive page refresh (hint: JSON.stringify and JSON.parse). Add a "Clear completed" button that removes all done tasks.',
    successHint: 'You just built a complete web application with state management, event handling, dynamic rendering, and filtering. This is the exact pattern used by React, Vue, and every modern web framework — you learned it from scratch.',
  },
];

const COURSE_SLUG = 'web-basics' as const;

export default function WebBasicsPage() {
  const { markLessonComplete, isLessonComplete, getCompletedCount, isCourseComplete } = useBasicsProgress();
  const { user } = useAuth();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const completedCount = getCompletedCount(COURSE_SLUG);
  const courseComplete = isCourseComplete(COURSE_SLUG, lessons.length);

  // Auto-expand lesson from URL hash (e.g. #lesson-3)
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#lesson-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1]);
      setExpandedLesson(idx);
      setTimeout(() => document.getElementById(`lesson-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 flex-1 w-full">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Code2 className="w-4 h-4" /> Prerequisite Course
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Web Basics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never built a webpage? Start here. 8 lessons that take you from zero to building
            your first interactive web app — using examples from the stories you will explore.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 8 lessons</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> No experience needed</span>
            <span className="flex items-center gap-1"><Code2 className="w-4 h-4" /> Runs in your browser</span>
          </div>
        </div>

        {/* Progress overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{completedCount} / {lessons.length} lessons complete</span>
            {courseComplete && <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Course complete!</span>}
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / lessons.length) * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-10">
          {lessons.map((lesson, i) => {
            const done = isLessonComplete(COURSE_SLUG, i);
            return (
              <button
                key={i}
                onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all
                  ${expandedLesson === i
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : done
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-400/50'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
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
            <div key={i} id={`lesson-${i}`}>
              {/* Lesson header — always visible */}
              <button
                onClick={() => {
                  const opening = expandedLesson !== i;
                  setExpandedLesson(opening ? i : null);
                  if (opening) {
                    setTimeout(() => document.getElementById(`lesson-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }
                }}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center gap-4
                  ${expandedLesson === i
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                    : done
                      ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0
                  ${expandedLesson === i
                    ? 'bg-blue-600 text-white'
                    : done
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${expandedLesson === i ? 'text-blue-700 dark:text-blue-300' : done ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                    {lesson.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.analogy}</p>
                </div>
                {done && expandedLesson !== i && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">Complete</span>}
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedLesson === i ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded lesson content */}
              {expandedLesson === i && (
                <div className={`mt-4 ml-2 space-y-6 relative ${!user && i >= FREE_LESSONS ? 'max-h-[400px] overflow-hidden' : ''}`}>
                  {!user && i >= FREE_LESSONS && (
                    <div className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-950 dark:via-gray-950/95">
                      <div className="pb-8 w-full max-w-md mx-auto">
                        <SignUpGate message={`Sign up free to unlock lesson ${i + 1} and all remaining lessons`} returnTo={`/learn/web-basics#lesson-${i}`} />
                      </div>
                    </div>
                  )}
                  {/* Concept */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Lesson {i + 1}: {lesson.title}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {lesson.concept}
                    </div>
                  </div>

                  {/* Interactive diagram — visualizes the concept */}
                  {i === 0 && <HTMLTagsDiagram />}
                  {i === 1 && <HTMLStructureDiagram />}
                  {i === 2 && <CSSBoxModelDiagram />}
                  {i === 3 && <FlexboxDiagram />}
                  {i === 4 && <DOMManipulationDiagram />}
                  {i === 5 && <EventListenerDiagram />}
                  {i === 6 && <ComponentDiagram />}
                  {i === 7 && <TodoDataFlowDiagram />}

                  {/* Analogy */}
                  <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Analogy</p>
                    <p className="text-sm text-amber-900 dark:text-amber-200">{lesson.analogy}</p>
                  </div>

                  {/* Story connection */}
                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-1">Story Connection</p>
                    <p className="text-sm text-purple-900 dark:text-purple-200">{lesson.storyConnection}</p>
                  </div>

                  {/* Playground */}
                  <HtmlPlayground
                    starterCode={lesson.starterCode}
                    title={`Lesson ${i + 1}: ${lesson.title}`}
                  />

                  {/* Challenge */}
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Challenge</p>
                    <p className="text-sm text-blue-900 dark:text-blue-200">{lesson.challenge}</p>
                  </div>

                  {/* Success hint */}
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-5 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">When You Succeed</p>
                    <p className="text-sm text-green-900 dark:text-green-200">{lesson.successHint}</p>
                  </div>

                  {/* Mark Complete button */}
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    {done ? (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Lesson complete</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => markLessonComplete(COURSE_SLUG, i)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    )}
                    {i < lessons.length - 1 && (
                      <button
                        onClick={() => { if (!done) markLessonComplete(COURSE_SLUG, i); setExpandedLesson(i + 1); }}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 text-center">
          <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for Level 1</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            After completing these 8 lessons, you have the HTML, CSS, and JavaScript skills to start
            Level 1 of the web development story.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/lessons/boy-who-built-a-library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-400 transition-colors"
            >
              The Boy Who Built a Library <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
