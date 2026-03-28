// ============================================================
// CODING REFERENCE ENTRIES
//
// Each entry has:
//   understand — conceptual, no-code sections for beginners
//   build      — technical sections with code examples
//
// Priority entries (full content): Python, Machine Learning,
// Signal Processing, Circuits Basics.
// Others: understand + 2-3 essential build sections.
// ============================================================

import type { ReferenceGuide } from './reference';

export const codingReferences: ReferenceGuide[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. PYTHON (priority — full content)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'python',
    title: 'Python',
    category: 'language',
    icon: '🐍',
    tagline: 'The friendly language that reads like English',
    relatedStories: ['girl-who-spoke-to-elephants', 'dragonfly-and-the-paddy-field', 'why-the-muga-silk-is-golden', 'boy-who-talked-to-clouds'],

    understand: [
      {
        title: 'What Is a Program?',
        content:
          'A program is a set of instructions that tells a computer what to do, step by step. ' +
          'Think of it like a recipe: you list ingredients (data) and steps (instructions), and ' +
          'the computer follows them in order. When Priya wrote code to track elephants, her ' +
          'program was really just a recipe — take a photo, look for an elephant shape, write ' +
          'down where it was.',
      },
      {
        title: 'How Computers Follow Instructions',
        content:
          'Computers are incredibly fast but completely literal. If you tell a person "go to the ' +
          'shop and buy milk", they figure out the details. A computer needs every micro-step: ' +
          'stand up, turn left, walk 12 steps, open the door... Python lets you write those ' +
          'instructions in words that look almost like English, so you can focus on *what* you ' +
          'want to happen rather than every tiny detail.',
      },
      {
        title: 'Variables Are Labeled Boxes',
        content:
          'A variable is a named container that holds a value. Imagine you have a row of boxes, ' +
          'each with a label on the front. One box is labeled "name" and inside it is the text ' +
          '"Priya". Another is labeled "age" and holds the number 14. You can peek inside a box, ' +
          'change what\'s in it, or use its contents in a calculation. That\'s all a variable is — ' +
          'a labeled box the computer remembers for you.',
        diagram: 'VariablesDiagram',
      },
      {
        title: 'Making Decisions (If / Else)',
        content:
          'Programs often need to choose between actions. Think of a fork in a trail: if it\'s ' +
          'raining, take the sheltered path; otherwise, take the scenic route. In Python this ' +
          'looks like `if temperature > 35: warn("heat alert")`. The computer checks the ' +
          'condition and picks one branch. You can chain conditions with `elif` (else-if) to ' +
          'handle many possibilities, like choosing clothing for different weather.',
        diagram: 'FlowchartDiagram',
      },
      {
        title: 'Repeating Things (Loops)',
        content:
          'Loops let you repeat an action without writing it out every time. Imagine you have ' +
          '100 exam papers to stamp "RECEIVED". Instead of writing the stamping instruction 100 ' +
          'times, you say "for each paper in the stack, stamp it". Python\'s `for` loop does ' +
          'exactly this. A `while` loop keeps going until a condition changes — like stirring a ' +
          'pot *while* the sauce is still lumpy.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the programming concept to its everyday analogy',
            pairs: [
              ['Variable', 'A labeled box that holds a value'],
              ['If / Else', 'A fork in a trail'],
              ['For loop', 'Stamping every paper in a stack'],
              ['Function', 'A recipe you can reuse by name'],
              ['List', 'A numbered shopping list'],
            ],
          },
        },
      },
      {
        title: 'How a Program Runs — Line by Line',
        content:
          'A computer reads your program from top to bottom, one line at a time, like reading ' +
          'a book. It finishes the current line completely before moving to the next. This is ' +
          'called *sequential execution*. If you write `mood = "calm"` and then `print(mood)`, ' +
          'the computer stores the word first, then prints it. But if you flip the order — ' +
          '`print(mood)` before `mood = "calm"` — you get a NameError because the computer ' +
          'hasn\'t seen `mood` yet. Order matters in every program. In Priya\'s elephant ' +
          'monitoring code, the camera must capture a photo *before* the classifier can analyze ' +
          'it, and the classifier must produce a result *before* the alert can be sent. Each ' +
          'step depends on the one before it, just like following a recipe in the right order.',
        diagram: 'FlowchartDiagram',
      },
      {
        title: 'Debugging — Finding and Fixing Mistakes',
        content:
          'Every programmer makes mistakes — they are called bugs, and finding them is called ' +
          'debugging. Python gives you helpful error messages if you learn to read them. A ' +
          '`NameError: name \'elphant\' is not defined` means you misspelled a variable name. ' +
          'A `TypeError: can\'t multiply sequence by non-int` means you tried math on text. ' +
          'An `IndentationError` means your spaces are inconsistent — Python uses indentation ' +
          'to know which lines belong together. The simplest debugging technique is *print ' +
          'debugging*: add `print()` statements at key points to see what values your variables ' +
          'hold. For example, if your elephant classifier keeps saying "unknown", add ' +
          '`print(f"weight={weight}, height={height}")` right before the decision to check ' +
          'whether the data looks right. Most bugs turn out to be small — a missing colon, ' +
          'a wrong variable name, or an off-by-one error in a loop.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'A NameError means you used a variable that does not exist yet.', answer: true, explanation: 'Python raises NameError when it encounters a name it has not seen — usually a typo or using a variable before assigning it.' },
              { text: 'Python ignores the order of lines and runs them in whatever order is fastest.', answer: false, explanation: 'Python executes line by line, top to bottom. Order matters — a variable must be created before it is used.' },
              { text: 'An IndentationError means your spaces or tabs are inconsistent.', answer: true, explanation: 'Python uses indentation to group code blocks, so mismatched spaces cause IndentationError.' },
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Hello World and print()',
        content:
          'Every Python journey starts with `print()`. It sends text to the screen. ' +
          'Strings go inside quotes; numbers don\'t need them.',
        code: `# Your first program
print("Hello, world!")
print("My name is Priya")

# Print numbers and expressions
print(42)
print(3 + 7)        # 10
print("Age:", 14)    # you can mix types with commas`,
      },
      {
        title: 'Variables and Types',
        content:
          'Variables store values. Python figures out the type automatically. ' +
          'The main types are `int` (whole numbers), `float` (decimals), `str` (text), and `bool` (True/False).',
        code: `name = "Priya"          # str
age = 14                # int
height = 1.62           # float
loves_coding = True     # bool

# Check a type
print(type(name))       # <class 'str'>

# Convert between types
age_text = str(age)     # "14"
pi_approx = int(3.14)  # 3 (truncates)`,
      },
      {
        title: 'Strings',
        content:
          'Strings are sequences of characters. You can slice them, join them, search them, and format them.',
        code: `greeting = "Hello, Assam!"

# Length
print(len(greeting))        # 13

# Indexing and slicing
print(greeting[0])           # H
print(greeting[7:12])        # Assam

# Useful methods
print(greeting.upper())      # HELLO, ASSAM!
print(greeting.replace("Assam", "World"))

# f-strings (formatted strings) — the modern way
animal = "elephant"
count = 3
print(f"We spotted {count} {animal}s today!")`,
      },
      {
        title: 'Lists',
        content:
          'Lists hold ordered collections. They can contain any type and you can add, remove, or change items.',
        code: `# Create a list
animals = ["elephant", "dolphin", "tiger"]

# Access by index (0-based)
print(animals[0])    # elephant
print(animals[-1])   # tiger (last item)

# Add and remove
animals.append("rhino")
animals.remove("tiger")
print(animals)       # ['elephant', 'dolphin', 'rhino']

# Useful operations
print(len(animals))          # 3
print("dolphin" in animals)  # True
animals.sort()               # alphabetical order

# List comprehension — build a new list in one line
lengths = [len(a) for a in animals]
print(lengths)  # [7, 8, 5]`,
      },
      {
        title: 'If / Elif / Else',
        content:
          'Branching lets your program make decisions. Indentation (4 spaces) defines the blocks.',
        code: `temperature = 38

if temperature > 40:
    print("Dangerous heat — stay indoors")
elif temperature > 30:
    print("Hot day — drink water")
elif temperature > 20:
    print("Pleasant weather")
else:
    print("Bring a jacket")

# Combine conditions with and / or
age = 14
has_ticket = True
if age >= 12 and has_ticket:
    print("Welcome to the show!")`,
      },
      {
        title: 'Loops',
        content:
          '`for` loops iterate over sequences. `while` loops repeat until a condition is false.',
        code: `# For loop over a list
colors = ["red", "green", "blue"]
for color in colors:
    print(f"I like {color}")

# range() generates numbers
for i in range(5):       # 0, 1, 2, 3, 4
    print(i, end=" ")

# While loop
count = 10
while count > 0:
    print(count, end=" ")
    count -= 1
print("Launch!")

# break and continue
for n in range(100):
    if n % 7 == 0 and n > 0:
        print(f"First multiple of 7 above 0: {n}")
        break`,
      },
      {
        title: 'Functions',
        content:
          'Functions group reusable logic. They take parameters and return results.',
        code: `def greet(name):
    """Return a friendly greeting."""
    return f"Namaste, {name}!"

print(greet("Priya"))   # Namaste, Priya!

# Default parameters
def power(base, exp=2):
    return base ** exp

print(power(5))      # 25
print(power(2, 10))  # 1024

# Multiple return values
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 8, 2])
print(lo, hi)  # 1 8`,
      },
      {
        title: 'Dictionaries',
        content:
          'Dictionaries map keys to values — like a real dictionary maps words to definitions.',
        code: `# Create a dictionary
elephant = {
    "name": "Ranga",
    "age": 25,
    "location": "Kaziranga"
}

# Access values
print(elephant["name"])        # Ranga
print(elephant.get("weight", "unknown"))  # unknown (safe access)

# Add / update
elephant["weight"] = 4500
elephant["age"] = 26

# Loop through
for key, value in elephant.items():
    print(f"{key}: {value}")

# Dictionary comprehension
squares = {n: n**2 for n in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`,
      },
      {
        title: 'List Comprehensions — One-Line Loops',
        content:
          'A list comprehension builds a new list by applying an expression to every item in a sequence, ' +
          'all in one line. The syntax is `[expression for item in iterable]`. You can add a condition ' +
          'to filter items with `[expression for item in iterable if condition]`.',
        code: `# Double every number from 0 to 9
doubled = [x * 2 for x in range(10)]
print(doubled)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Filter: keep only calm moods from a list
moods = ["calm", "agitated", "calm", "playful", "agitated"]
calm_only = [m for m in moods if m == "calm"]
print(calm_only)  # ['calm', 'calm']

# Transform and filter in one go
weights = [4500, 3200, 280, 4800, 60, 5100]
heavy = [w for w in weights if w > 3000]
print(f"Heavy animals: {heavy}")  # [4500, 3200, 4800, 5100]

# Nested: flatten a list of lists
sightings = [[1, 3], [0, 2], [5, 1]]
flat = [count for day in sightings for count in day]
print(flat)  # [1, 3, 0, 2, 5, 1]`,
      },
      {
        title: 'Working with Files',
        content:
          'Real data lives in files. Python makes it easy to read and write text files and CSVs. ' +
          'Use `with open(...)` to ensure files are properly closed after use.',
        code: `import csv

# --- Reading a text file ---
with open("notes.txt", "r") as f:
    contents = f.read()
    print(contents)

# --- Reading a CSV of elephant data ---
with open("elephant_data.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = row["name"]
        weight = float(row["weight_kg"])
        print(f"{name} weighs {weight} kg")

# --- Writing results to a file ---
results = [
    {"name": "Ranga", "status": "healthy"},
    {"name": "Mohini", "status": "needs checkup"},
]

with open("report.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "status"])
    writer.writeheader()
    for r in results:
        writer.writerow(r)
    print("Report saved to report.csv")

# --- Counting lines in a large file ---
with open("elephant_data.csv", "r") as f:
    line_count = sum(1 for line in f)
    print(f"Total rows: {line_count - 1}")  # minus header`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. HTML / CSS / JS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'html-css-js',
    title: 'HTML / CSS / JavaScript',
    category: 'language',
    icon: '🌐',
    tagline: 'The three languages every website is built with',
    relatedStories: ['boy-who-built-a-library'],

    understand: [
      {
        title: 'What the Web Actually Is',
        content:
          'When you visit a website, your browser (Chrome, Firefox, Safari) sends a request to a ' +
          'server somewhere in the world. The server sends back files — HTML, CSS, and JavaScript. ' +
          'Your browser reads these files and *renders* the page you see. Every website you have ever ' +
          'visited — Google, YouTube, Wikipedia — is built from these same three languages. The browser ' +
          'is like a kitchen: HTML is the ingredients list, CSS is the plating instructions, and ' +
          'JavaScript is the cooking process that transforms everything into the final dish.',
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
        content:
          'HTML (HyperText Markup Language) defines *what* is on the page. It uses tags — words in ' +
          'angle brackets — to label content. `<h1>` says "this is a main heading." `<p>` says "this ' +
          'is a paragraph." `<img>` places an image. `<a href="...">` creates a clickable link. ' +
          'Tags usually come in pairs: `<p>Hello</p>` — the opening tag, the content, and the closing ' +
          'tag. The browser reads these tags from top to bottom and lays out the page accordingly. ' +
          'HTML does not control colors, fonts, or animations — that is CSS\'s job. HTML only says ' +
          '"there is a heading here, a paragraph here, an image here." Think of it as the blueprint ' +
          'of a house: it shows where the rooms and doors are, but not what color the walls are.',
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
        content:
          'CSS (Cascading Style Sheets) controls *how* things look. It uses rules that target HTML ' +
          'elements and apply visual properties. The rule `h1 { color: blue; font-size: 24px; }` ' +
          'makes all main headings blue and 24 pixels tall. You can target elements by tag name (h1), ' +
          'by class name (.card), or by ID (#header). CSS handles colors, fonts, spacing (margin and ' +
          'padding), layout (flexbox and grid), borders, shadows, and even animations. The "cascading" ' +
          'part means that multiple rules can apply to the same element, and the most specific rule ' +
          'wins. CSS is what makes the difference between a plain white page of text and a beautiful, ' +
          'professional website.',
        diagram: 'CSSBoxModelDiagram',
      },
      {
        title: 'JavaScript — The Behavior',
        content:
          'JavaScript makes pages *interactive*. Without it, a website is like a printed poster — you ' +
          'can look at it but not interact with it. JavaScript lets you respond to button clicks, ' +
          'validate form inputs, show/hide content, load new data without refreshing the page, create ' +
          'animations, and build entire applications. When you type in a search box and see suggestions ' +
          'appearing — that is JavaScript. When you scroll and a navigation bar sticks to the top — ' +
          'JavaScript. When you click "Add to Cart" and the cart count updates — JavaScript. It is ' +
          'the only programming language that runs directly in the browser, which is why it has become ' +
          'the most widely used language in the world.',
        diagram: 'FlowchartDiagram',
      },
      {
        title: 'How the Three Work Together',
        content:
          'Think of building a car. HTML is the frame and body panels — the structure that defines ' +
          'where the seats, dashboard, and wheels go. CSS is the paint job, upholstery, and trim — ' +
          'everything that makes it look good. JavaScript is the engine, steering, and electronics — ' +
          'everything that makes it *do* things. You can have HTML without CSS (an ugly but functional ' +
          'page) or without JavaScript (a static page), but a real website uses all three. In practice, ' +
          'HTML goes in `.html` files, CSS goes in `.css` files (linked from the HTML), and JavaScript ' +
          'goes in `.js` files (also linked from the HTML). Keeping them separate makes your code ' +
          'organized and easier to maintain.',
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
        content:
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
        title: 'Responsive Design — One Page, Every Screen',
        content:
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
      },
    ],

    build: [
      {
        title: 'A Complete HTML Page',
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ARDUINO LANGUAGE
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'arduino-language',
    title: 'Arduino Language',
    category: 'language',
    icon: '🔌',
    tagline: 'C++ for microcontrollers — talk to the physical world',
    relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret', 'bridge-that-grew'],

    understand: [
      {
        title: 'What Is Arduino?',
        content:
          'Arduino is a small, inexpensive computer on a single board — about the size of a credit ' +
          'card. Unlike your laptop, it does not have a screen, keyboard, or operating system. Instead, ' +
          'it has *pins* — metal connectors that link to the physical world. Some pins read sensors ' +
          '(temperature, light, distance, sound). Others control actuators (LEDs, motors, speakers, ' +
          'relays). You write a program on your laptop in a language based on C++, upload it to the ' +
          'board through a USB cable, and the board runs that program forever until you unplug it. ' +
          'Arduino is used in robots, weather stations, home automation, art installations, and ' +
          'thousands of student projects around the world.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the Arduino concept to its description',
            pairs: [
              ['Pin', 'A metal connector that links Arduino to sensors or LEDs'],
              ['Sketch', 'The name for an Arduino program'],
              ['USB cable', 'Connects Arduino to your laptop for uploading code'],
              ['Sensor', 'A component that reads the physical world (light, temperature)'],
              ['Actuator', 'A component that affects the physical world (LED, motor, speaker)'],
            ],
          },
        },
      },
      {
        title: 'The setup() and loop() Mental Model',
        content:
          'Every Arduino program (called a "sketch") has exactly two required functions. `setup()` ' +
          'runs once when the board powers on or resets — use it to configure pins and start serial ' +
          'communication. Think of it as setting the table before dinner. `loop()` runs over and over, ' +
          'thousands of times per second, for as long as the board has power. Think of it as the ' +
          'heartbeat of your project — read sensors, make decisions, control outputs, repeat. If you ' +
          'want something to happen once (play a startup sound), put it in setup(). If you want ' +
          'something to happen continuously (check if a button is pressed), put it in loop().',
        diagram: 'CircuitDiagram',
      },
      {
        title: 'Digital vs Analog — Two Ways to Talk',
        content:
          'Digital pins deal in absolutes: HIGH (5V, on) or LOW (0V, off). They are perfect for ' +
          'buttons (pressed or not), LEDs (on or off), and switches. Analog pins deal in ranges: ' +
          'analogRead() returns a value from 0 to 1023, representing voltage from 0V to 5V. This ' +
          'lets you read sensors that give continuous values — how bright is the light (0=dark, ' +
          '1023=blinding), how hot is the room, how far away is the object. There is also a trick ' +
          'called PWM (Pulse Width Modulation) that lets digital pins *simulate* analog output by ' +
          'flickering on and off so fast that an LED appears dimmed or a motor runs at half speed. ' +
          'PWM pins are marked with a ~ symbol on the board.',
        diagram: 'OhmsLawDiagram',
      },
      {
        title: 'Sensors — How Arduino Reads the World',
        content:
          'A sensor converts a physical quantity into an electrical signal. A light sensor (photoresistor) ' +
          'changes its resistance based on brightness — more light means lower resistance, which changes ' +
          'the voltage Arduino reads. A temperature sensor (like the TMP36) outputs a voltage proportional ' +
          'to temperature — 0.5V at 0°C, 0.75V at 25°C. An ultrasonic distance sensor sends out a ' +
          'sound pulse and times the echo — farther objects take longer to echo back. A PIR (passive ' +
          'infrared) sensor detects body heat and outputs HIGH when someone walks by. Each sensor ' +
          'connects to an Arduino pin, and your code reads the value and decides what to do with it — ' +
          'that is the core pattern of every Arduino project.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'analogRead() returns a value from 0 to 1023.', answer: true, explanation: 'The Arduino ADC is 10-bit, so it maps 0-5V to the integer range 0-1023.' },
              { text: 'A PIR sensor detects light levels in a room.', answer: false, explanation: 'PIR (passive infrared) sensors detect body heat and motion, not light. A photoresistor detects light.' },
              { text: 'An ultrasonic sensor measures distance by timing a sound echo.', answer: true, explanation: 'It sends a high-frequency pulse, then measures how long the echo takes to return. Farther objects produce longer echo times.' },
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Blink an LED — The Hello World',
        content:
          'The simplest Arduino project: turn the built-in LED on and off. This teaches you setup(), loop(), and digital output.',
        code: `// Every Arduino sketch needs setup() and loop()

void setup() {
  // Run once: configure pin 13 (built-in LED) as output
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Blink sketch started!");
}

void loop() {
  // Run forever: blink the LED
  digitalWrite(LED_BUILTIN, HIGH);   // LED on (5V)
  Serial.println("ON");
  delay(1000);                        // wait 1 second (1000 ms)

  digitalWrite(LED_BUILTIN, LOW);    // LED off (0V)
  Serial.println("OFF");
  delay(1000);
}

// To change the blink speed, change the delay values.
// delay(100) = 10 blinks per second (fast strobe)
// delay(2000) = very slow, relaxed blink`,
      },
      {
        title: 'Read a Sensor and Print Values',
        content:
          'Read an analog sensor (like a light sensor or potentiometer) and print the value to the serial monitor for debugging.',
        code: `const int sensorPin = A0;   // analog input pin

void setup() {
  Serial.begin(9600);
  Serial.println("Sensor reader ready.");
  Serial.println("Open Serial Monitor to see values.");
}

void loop() {
  int raw = analogRead(sensorPin);  // 0 to 1023

  // Convert to voltage (5V reference)
  float voltage = raw * 5.0 / 1023.0;

  // For a TMP36 temperature sensor: voltage to Celsius
  float tempC = (voltage - 0.5) * 100.0;

  Serial.print("Raw: ");
  Serial.print(raw);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.print("V | Temp: ");
  Serial.print(tempC, 1);
  Serial.println("°C");

  delay(500);  // read twice per second
}`,
      },
      {
        title: 'Sensor + LED: A Reactive Project',
        content:
          'Combine reading a sensor with controlling an output — the fundamental pattern of every Arduino project.',
        code: `const int sensorPin = A0;   // light sensor
const int ledPin = 9;       // LED with resistor (PWM pin)
const int buzzerPin = 8;    // optional buzzer

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(sensorPin);

  // Map light level to LED brightness (inverted: darker = brighter LED)
  int brightness = map(light, 0, 1023, 255, 0);
  analogWrite(ledPin, brightness);  // PWM output

  // Three-level response
  if (light < 200) {
    // Very dark — LED bright + alarm
    Serial.println("DARK — Night mode, LED bright");
    tone(buzzerPin, 1000, 100);  // short beep
  } else if (light < 600) {
    // Medium — LED dimmed, no alarm
    Serial.println("MEDIUM — Dusk mode");
    noTone(buzzerPin);
  } else {
    // Bright — LED off
    Serial.println("BRIGHT — Day mode, LED off");
    noTone(buzzerPin);
  }

  delay(200);
}`,
      },
      {
        title: 'Multiple Sensors and Outputs',
        content:
          'A more advanced sketch that reads two sensors and controls multiple outputs with different logic.',
        code: `// Weather station: temperature + light sensor
// Outputs: LED indicator + serial dashboard

const int tempPin = A0;     // TMP36 temperature sensor
const int lightPin = A1;    // photoresistor
const int redLED = 11;      // red LED (hot warning)
const int greenLED = 10;    // green LED (comfortable)
const int blueLED = 9;      // blue LED (cold warning)

void setup() {
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Weather Station v1.0");
  Serial.println("Temp(C) | Light | Status");
  Serial.println("--------|-------|-------");
}

float readTempC(int pin) {
  int raw = analogRead(pin);
  float voltage = raw * 5.0 / 1023.0;
  return (voltage - 0.5) * 100.0;
}

void setColor(bool r, bool g, bool b) {
  digitalWrite(redLED, r);
  digitalWrite(greenLED, g);
  digitalWrite(blueLED, b);
}

void loop() {
  float tempC = readTempC(tempPin);
  int light = analogRead(lightPin);
  const char* status;

  if (tempC > 35) {
    setColor(HIGH, LOW, LOW);   // red = hot
    status = "HOT!";
  } else if (tempC > 20) {
    setColor(LOW, HIGH, LOW);   // green = comfortable
    status = "OK";
  } else {
    setColor(LOW, LOW, HIGH);   // blue = cold
    status = "COLD";
  }

  Serial.print(tempC, 1);
  Serial.print("    | ");
  Serial.print(light);
  Serial.print("  | ");
  Serial.println(status);

  delay(1000);
}`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. NUMPY
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'numpy',
    title: 'NumPy',
    category: 'data-science',
    icon: '🔢',
    tagline: 'Fast math on arrays of numbers',
    relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'how-majuli-island-was-born', 'why-the-muga-silk-is-golden'],

    understand: [
      {
        title: 'Why Arrays Matter',
        content:
          'Imagine you have 1,000 temperature readings and you want to convert all of them from ' +
          'Celsius to Fahrenheit. With a plain Python list, you would write a loop that visits each ' +
          'value one by one — 1,000 trips. NumPy does the same conversion in a single operation ' +
          'on the whole array at once, often 50-100x faster. The secret is that NumPy stores numbers ' +
          'in a tightly packed block of memory (like seats in a cinema row), so the processor can ' +
          'blast through them without stopping to look up each one. This speed difference does not ' +
          'matter for 10 numbers, but it is essential for millions — which is what real data science, ' +
          'machine learning, and image processing involve.',
        diagram: 'NumPyRulerDiagram',
      },
      {
        title: 'The Speed Difference — Lists vs Arrays',
        content:
          'A Python list is like a drawer of labeled envelopes — each envelope can hold any type of ' +
          'object, so the computer has to open each one individually. A NumPy array is like a sheet ' +
          'of graph paper where every cell holds the same type of number. Because the computer knows ' +
          'exactly where each number is and that they are all the same type, it can process them in ' +
          'bulk using special CPU instructions (SIMD). For 1 million additions, a Python list loop ' +
          'might take 200 milliseconds; NumPy does it in 2 milliseconds. This is not a minor ' +
          'optimization — it is the difference between a program that feels instant and one that ' +
          'makes you wait.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'A NumPy array stores all elements as the same data type, which makes it faster than a Python list.', answer: true, explanation: 'Uniform type means the CPU can process elements in bulk using SIMD instructions, avoiding per-element type checks.' },
              { text: 'For 10 numbers, NumPy is significantly faster than a regular Python list.', answer: false, explanation: 'NumPy has startup overhead. For tiny arrays the speed difference is negligible. The gains appear with thousands or millions of elements.' },
            ],
          },
        },
      },
      {
        title: 'Creating Arrays — From Lists and From Scratch',
        content:
          'You can create a NumPy array from any Python list: np.array([1, 2, 3]). But NumPy also ' +
          'has helper functions to generate common arrays without typing every value. np.zeros(100) ' +
          'gives you 100 zeros. np.ones((3, 4)) gives a 3-by-4 grid of ones. np.arange(0, 10, 0.5) ' +
          'counts from 0 to 10 in steps of 0.5 — like Python\'s range() but for decimals. ' +
          'np.linspace(0, 1, 50) gives 50 evenly spaced points from 0 to 1, which is perfect for ' +
          'plotting smooth curves. np.random.randn(1000) gives 1,000 random numbers from a bell ' +
          'curve — useful for simulations.',
      },
      {
        title: 'Math on Entire Arrays — No Loops Needed',
        content:
          'The most powerful idea in NumPy is *vectorized operations*: math applies to every element ' +
          'at once. If `a = np.array([1, 2, 3])`, then `a * 2` gives `[2, 4, 6]` — no loop required. ' +
          'You can add arrays together (`a + b` adds element by element), compare them (`a > 2` gives ' +
          '`[False, False, True]`), and even apply functions like `np.sqrt(a)` to every element. ' +
          'This is not just faster — it is also easier to read. Compare `[x**2 for x in my_list]` ' +
          'with `my_array ** 2`. The NumPy version is shorter and clearer about what it does.',
      },
      {
        title: 'Filtering Data — Boolean Indexing',
        content:
          'One of NumPy\'s most useful tricks is filtering with boolean arrays. If `temps` is an ' +
          'array of temperatures, then `temps > 30` gives you an array of True/False values — True ' +
          'where the temperature exceeds 30. You can use this as a filter: `temps[temps > 30]` returns ' +
          'only the hot days. You can combine conditions: `temps[(temps > 25) & (temps < 35)]` returns ' +
          'temperatures between 25 and 35. This replaces multi-line loops with a single, readable ' +
          'expression. Data scientists use this constantly to select subsets of data for analysis.',
      },
      {
        title: 'Real-World Data Shapes',
        content:
          'A 1D array is a row of numbers (a single measurement over time). A 2D array is a grid ' +
          '(rows and columns) like a spreadsheet — each row might be a student, each column a subject. ' +
          'A 3D array adds depth: a color image is rows x columns x 3 (red, green, blue channels). ' +
          'A video is a 4D array: frames x rows x columns x channels. NumPy handles all of these ' +
          'with the same tools. The `.shape` attribute tells you the dimensions: (1000,) for 1D, ' +
          '(480, 640, 3) for an image. Thinking in shapes is the key to working with real data.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the NumPy function to what it does',
            pairs: [
              ['np.array([1,2,3])', 'Create an array from a Python list'],
              ['np.zeros(100)', 'Create an array of 100 zeros'],
              ['np.linspace(0, 1, 50)', 'Create 50 evenly spaced values from 0 to 1'],
              ['np.mean(a)', 'Calculate the average of all values'],
              ['a[a > 5]', 'Filter to keep only values greater than 5'],
              ['a.reshape(3, 4)', 'Rearrange into a 3-row, 4-column grid'],
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Creating Arrays',
        content:
          'Arrays can be created from lists, or generated with helper functions for common patterns.',
        code: `import numpy as np

# From a Python list
temps = np.array([28.1, 30.5, 27.3, 32.0, 29.4])
print(temps)        # [28.1 30.5 27.3 32.  29.4]
print(temps.dtype)  # float64

# Generated arrays
zeros = np.zeros(5)              # [0. 0. 0. 0. 0.]
ones = np.ones((3, 4))           # 3x4 grid of 1s
rng = np.arange(0, 10, 0.5)     # 0.0, 0.5, 1.0, ... 9.5
lin = np.linspace(0, 1, 5)      # [0.   0.25 0.5  0.75 1.  ]
ints = np.arange(1, 11)          # [1, 2, 3, ..., 10]

# Random arrays
normal = np.random.randn(1000)           # 1000 values from bell curve
uniform = np.random.uniform(0, 100, 50)  # 50 values between 0 and 100

# Check shape and size
print(temps.shape)   # (5,)     — 1D, 5 elements
print(ones.shape)    # (3, 4)   — 2D, 3 rows x 4 columns
print(ones.size)     # 12       — total element count`,
      },
      {
        title: 'Vectorized Math — No Loops',
        content:
          'Operations apply element-by-element. This is the core superpower of NumPy.',
        code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])

# Arithmetic on every element at once
print(a * 2)       # [ 2  4  6  8 10]
print(a ** 2)      # [ 1  4  9 16 25]
print(a + 10)      # [11 12 13 14 15]

# Element-wise operations between two arrays
b = np.array([10, 20, 30, 40, 50])
print(a + b)       # [11 22 33 44 55]
print(a * b)       # [ 10  40  90 160 250]

# Math functions apply to every element
print(np.sqrt(a))  # [1.   1.41 1.73 2.   2.24]
print(np.log(a))   # [0.   0.69 1.10 1.39 1.61]

# Celsius to Fahrenheit — the whole array at once
celsius = np.array([0, 20, 37, 100])
fahrenheit = celsius * 9/5 + 32
print(fahrenheit)  # [ 32.  68.  98.6 212. ]

# Compare: Python loop vs NumPy for 1 million values
# Loop:  [x * 2 for x in range(1_000_000)]  ~120ms
# NumPy: np.arange(1_000_000) * 2            ~2ms`,
      },
      {
        title: 'Statistics on Arrays',
        content:
          'NumPy has built-in functions for all common statistical operations.',
        code: `import numpy as np

scores = np.array([72, 85, 90, 68, 95, 88, 76, 82, 91, 79])

# Central tendency
print(f"Mean:   {np.mean(scores):.1f}")    # 82.6
print(f"Median: {np.median(scores):.1f}")  # 83.5

# Spread
print(f"Std:    {np.std(scores):.1f}")     # 8.5
print(f"Var:    {np.var(scores):.1f}")     # 72.4
print(f"Range:  {scores.max() - scores.min()}")  # 27

# Percentiles / quartiles
print(f"25th:   {np.percentile(scores, 25):.1f}")
print(f"75th:   {np.percentile(scores, 75):.1f}")

# Sorting and ranking
sorted_scores = np.sort(scores)
print(f"Sorted: {sorted_scores}")
print(f"Rank order: {np.argsort(scores)}")  # indices that would sort it

# Cumulative sum (running total)
print(f"Cumsum: {np.cumsum(scores)}")

# Correlation between two arrays
hours = np.array([2, 3, 1, 5, 4, 6, 3, 7, 5, 8])
r = np.corrcoef(hours, scores)[0, 1]
print(f"Correlation study hours vs scores: {r:.3f}")`,
      },
      {
        title: 'Boolean Indexing — Filtering Data',
        content:
          'Use comparisons to create boolean masks, then use those masks to select matching elements.',
        code: `import numpy as np

temps = np.array([22, 28, 35, 19, 31, 40, 27, 33, 18, 29])
days = np.array(["Mon","Tue","Wed","Thu","Fri","Sat","Sun",
                  "Mon","Tue","Wed"])

# Boolean mask: which days were hot?
hot = temps > 30
print(hot)  # [False False True False True True False True False False]

# Use the mask to filter
print(f"Hot temps: {temps[hot]}")   # [35 31 40 33]
print(f"Hot days:  {days[hot]}")    # ['Wed' 'Fri' 'Sat' 'Mon']

# Combine conditions with & (and), | (or), ~ (not)
comfortable = (temps >= 20) & (temps <= 30)
print(f"Comfortable: {temps[comfortable]}")  # [22 28 27 29]

# Count and percentage
print(f"Hot days: {hot.sum()} out of {len(temps)}")
print(f"Percentage: {hot.mean() * 100:.0f}%")

# Replace values conditionally
capped = np.where(temps > 35, 35, temps)  # cap at 35
print(f"Capped: {capped}")  # [22 28 35 19 31 35 27 33 18 29]`,
      },
      {
        title: 'Reshaping and Slicing',
        content:
          'Change the shape of data to match what your analysis needs, and select subsets with powerful slicing.',
        code: `import numpy as np

# Reshape: turn 1D into 2D
data = np.arange(12)           # [0, 1, 2, ..., 11]
grid = data.reshape(3, 4)     # 3 rows, 4 columns

print(grid)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]

# Slicing: grid[rows, cols]
print(grid[0, :])      # first row:      [0 1 2 3]
print(grid[:, 2])      # third column:   [2 6 10]
print(grid[1:, 1:3])   # rows 1-2, cols 1-2: [[5 6] [9 10]]
print(grid[-1, -1])    # bottom-right:   11

# Transpose: swap rows and columns
print(grid.T)
# [[ 0  4  8]
#  [ 1  5  9]
#  [ 2  6 10]
#  [ 3  7 11]]

# Flatten back to 1D
flat = grid.flatten()
print(flat)  # [ 0  1  2  3  4  5  6  7  8  9 10 11]

# Stack arrays together
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.vstack([a, b]))   # [[1 2 3], [4 5 6]]  — vertical
print(np.hstack([a, b]))   # [1 2 3 4 5 6]        — horizontal`,
      },
      {
        title: 'Real-World Example: Analyzing Sensor Data',
        content:
          'Putting it all together — load, clean, analyze, and summarize a dataset using NumPy.',
        code: `import numpy as np

# Simulate 30 days of temperature readings (3 sensors per day)
np.random.seed(42)
data = np.random.normal(28, 5, (30, 3))  # 30 days x 3 sensors

# Add some "bad" readings (sensor glitches)
data[5, 1] = -999   # sensor 2 glitched on day 6
data[20, 0] = 999    # sensor 1 glitched on day 21

print(f"Shape: {data.shape}")  # (30, 3)
print(f"Raw mean: {data.mean():.1f}")  # skewed by glitches

# Clean: replace extreme values with NaN
data[(data < -50) | (data > 50)] = np.nan

# nanmean ignores NaN values
print(f"Clean mean: {np.nanmean(data):.1f}")

# Per-sensor statistics (axis=0 means "along rows" → one value per column)
for i, label in enumerate(["Sensor A", "Sensor B", "Sensor C"]):
    col = data[:, i]
    print(f"{label}: mean={np.nanmean(col):.1f}, "
          f"std={np.nanstd(col):.1f}, "
          f"valid={np.count_nonzero(~np.isnan(col))}/30")

# Daily average across sensors
daily_avg = np.nanmean(data, axis=1)  # one value per row
hottest_day = np.nanargmax(daily_avg)
print(f"Hottest day: #{hottest_day + 1} ({daily_avg[hottest_day]:.1f}°C)")`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. MATPLOTLIB
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'matplotlib',
    title: 'Matplotlib',
    category: 'data-science',
    icon: '📊',
    tagline: 'Turn numbers into charts and graphs',
    relatedStories: ['girl-who-spoke-to-elephants', 'why-the-muga-silk-is-golden', 'dragonfly-and-the-paddy-field', 'boy-who-talked-to-clouds'],

    understand: [
      {
        title: 'Why Visualize Data?',
        content:
          'A table of 500 numbers is hard to interpret. Your eyes glaze over after the first few rows. ' +
          'But plot those same numbers as a line chart and you instantly see trends, spikes, and patterns. ' +
          'A famous example: Anscombe\'s Quartet is four datasets that have identical means, standard ' +
          'deviations, and correlations — but look completely different when plotted. One is a straight ' +
          'line, one is a curve, one has an outlier, and one is a vertical cluster with one stray point. ' +
          'The statistics alone cannot tell them apart, but a single glance at the charts reveals everything. ' +
          'Matplotlib is Python\'s most popular plotting library, used by scientists, data analysts, ' +
          'and engineers worldwide.',
        diagram: 'CorrelationDiagram',
      },
      {
        title: 'Chart Types and When to Use Each',
        content:
          '*Line charts* show how a value changes over time — temperature across months, stock prices ' +
          'across years. Use them when the x-axis has a natural order. *Scatter plots* show the ' +
          'relationship between two variables — study hours vs exam scores. Each dot is one data point. ' +
          '*Bar charts* compare categories — population of different animals, sales by region. Use them ' +
          'when the x-axis is labels, not numbers. *Histograms* show the distribution of a single ' +
          'variable — how many students scored between 70-80, 80-90, etc. *Pie charts* show parts of a ' +
          'whole, but most data scientists avoid them because humans are bad at comparing angles. ' +
          'Choosing the right chart type is half the battle in data visualization.',
        diagram: 'HistogramDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the chart type to when you should use it',
            pairs: [
              ['Line chart', 'Show how a value changes over time'],
              ['Scatter plot', 'Show the relationship between two variables'],
              ['Bar chart', 'Compare values across categories'],
              ['Histogram', 'Show the distribution of a single variable'],
              ['Pie chart', 'Show parts of a whole (use sparingly)'],
            ],
          },
        },
      },
      {
        title: 'Anatomy of a Plot',
        content:
          'Every Matplotlib chart has a *Figure* (the overall canvas or window) and one or more *Axes* ' +
          '(individual chart areas within the figure). Each Axes has an x-axis and y-axis with tick ' +
          'marks and labels, a title, and the actual data drawn as lines, bars, or dots. You can also ' +
          'add a *legend* (explaining what each color means), *grid lines* (making it easier to read ' +
          'values), *annotations* (arrows or text pointing to specific data points), and a *colorbar* ' +
          '(when colors represent a third variable). Understanding these parts lets you customize ' +
          'every aspect of your chart.',
        diagram: 'PlotAnatomyDiagram',
      },
      {
        title: 'Color, Design, and Readability',
        content:
          'A good chart communicates clearly. Bad design choices can confuse or even mislead. ' +
          'Use high-contrast colors (avoid light yellow on white). Use colorblind-friendly palettes — ' +
          'about 8% of men have some form of color blindness, so avoid relying solely on red/green ' +
          'differences. Label your axes with units (not just "x" and "y" — say "Temperature (°C)" ' +
          'and "Days since start"). Keep titles short and descriptive. Remove unnecessary clutter: ' +
          'if grid lines do not help, turn them off. If a legend has only one item, it is redundant. ' +
          'The goal is to make the viewer understand the data in seconds, not minutes.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'About 8% of men have some form of color blindness, so you should avoid relying only on red/green differences.', answer: true, explanation: 'Red-green color blindness is common. Use colorblind-friendly palettes and add labels or patterns alongside color.' },
              { text: 'A legend is always necessary, even when the chart shows only one data series.', answer: false, explanation: 'If there is only one series, the legend is redundant. Use the title or axis label to identify the data instead.' },
              { text: 'Axis labels should include units, like "Temperature (C)" instead of just "y".', answer: true, explanation: 'Without units, the reader cannot interpret the values. Always label axes with descriptive names and units.' },
            ],
          },
        },
      },
      {
        title: 'From Quick Plot to Publication Quality',
        content:
          'Matplotlib works at two levels. The *pyplot* interface (`plt.plot(x, y)`) is quick for ' +
          'exploration — you get a chart in one line. The *object-oriented* interface (`fig, ax = ' +
          'plt.subplots()`) gives you full control for polished charts. Start with pyplot to explore ' +
          'your data, then switch to the OO interface when you need subplots, dual axes, or custom ' +
          'layouts. You can save charts as PNG, SVG, or PDF using `plt.savefig("chart.png", dpi=150)`. ' +
          'SVG is best for the web; PDF is best for papers and reports.',
        diagram: 'PlotAnatomyDiagram',
      },
    ],

    build: [
      {
        title: 'Line and Scatter Plots',
        content:
          'The two most fundamental chart types: line plots for trends, scatter plots for relationships.',
        code: `import matplotlib.pyplot as plt
import numpy as np

# --- Line plot ---
x = np.linspace(0, 10, 50)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, color="teal", linewidth=2, label="sin(x)")
plt.plot(x, np.cos(x), color="coral", linestyle="--", label="cos(x)")
plt.xlabel("x")
plt.ylabel("y")
plt.title("Trigonometric Functions")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# --- Scatter plot with color-coded values ---
np.random.seed(42)
temps = np.random.normal(28, 3, 30)
days = np.arange(1, 31)

plt.figure(figsize=(8, 4))
scatter = plt.scatter(days, temps, c=temps, cmap="coolwarm",
                       s=80, edgecolors="black", linewidth=0.5)
plt.colorbar(scatter, label="Temperature (°C)")
plt.xlabel("Day of Month")
plt.ylabel("Temperature (°C)")
plt.title("Daily Temperatures — June")
plt.show()`,
      },
      {
        title: 'Bar Charts and Histograms',
        content:
          'Bar charts compare categories. Histograms reveal the distribution of continuous data.',
        code: `import matplotlib.pyplot as plt
import numpy as np

# --- Bar chart ---
animals = ["Elephant", "Rhino", "Tiger", "Dolphin"]
counts = [2500, 2700, 180, 800]
colors = ["#718096", "#A0522D", "#F6AD55", "#4299E1"]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

bars = ax1.bar(animals, counts, color=colors, edgecolor="black")
ax1.set_ylabel("Population estimate")
ax1.set_title("Kaziranga Wildlife Census")
# Add value labels on top of each bar
for bar, count in zip(bars, counts):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
             str(count), ha="center", fontweight="bold")

# --- Histogram ---
data = np.random.normal(25, 5, 1000)
ax2.hist(data, bins=30, edgecolor="black", alpha=0.7, color="steelblue")
ax2.axvline(np.mean(data), color="red", linestyle="--",
            label=f"Mean: {np.mean(data):.1f}°C")
ax2.set_xlabel("Temperature (°C)")
ax2.set_ylabel("Frequency")
ax2.set_title("Temperature Distribution (1000 readings)")
ax2.legend()

plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Subplots — Multiple Charts in One Figure',
        content:
          'Put multiple charts side by side for easy comparison. The object-oriented approach gives you full control.',
        code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
x = np.linspace(0, 2 * np.pi, 100)

# Top-left: line
axes[0, 0].plot(x, np.sin(x), "b-", linewidth=2)
axes[0, 0].set_title("Sine")
axes[0, 0].grid(True, alpha=0.3)

# Top-right: filled area
axes[0, 1].fill_between(x, np.cos(x), alpha=0.3, color="red")
axes[0, 1].plot(x, np.cos(x), "r-")
axes[0, 1].set_title("Cosine (filled)")

# Bottom-left: step function
axes[1, 0].step(x, np.sign(np.sin(x)), "g-", linewidth=2)
axes[1, 0].set_title("Square wave")
axes[1, 0].set_ylim(-1.5, 1.5)

# Bottom-right: multiple lines
for n in range(1, 5):
    axes[1, 1].plot(x, np.sin(n * x) / n, label=f"n={n}")
axes[1, 1].set_title("Harmonic series")
axes[1, 1].legend(fontsize=8)

for ax in axes.flat:
    ax.set_xlabel("x")
    ax.set_ylabel("y")

fig.suptitle("Four Chart Types in One Figure", fontsize=14)
plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Styling and Customization',
        content:
          'Control every visual detail: colors, fonts, annotations, and styles.',
        code: `import matplotlib.pyplot as plt
import numpy as np

# Use a built-in style
plt.style.use("seaborn-v0_8-whitegrid")

months = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]
temps = [18, 20, 25, 30, 34, 35, 33, 32, 30, 27, 22, 19]
rainfall = [10, 15, 30, 60, 120, 280, 350, 300, 200, 80, 20, 8]

fig, ax1 = plt.subplots(figsize=(10, 5))

# Temperature as a line (left y-axis)
color1 = "#E53E3E"
ax1.plot(months, temps, "o-", color=color1, linewidth=2,
         markersize=8, label="Temperature")
ax1.set_ylabel("Temperature (°C)", color=color1, fontsize=12)
ax1.tick_params(axis="y", labelcolor=color1)

# Rainfall as bars (right y-axis)
ax2 = ax1.twinx()
color2 = "#3182CE"
ax2.bar(months, rainfall, alpha=0.3, color=color2, label="Rainfall")
ax2.set_ylabel("Rainfall (mm)", color=color2, fontsize=12)
ax2.tick_params(axis="y", labelcolor=color2)

# Annotation
peak_month = months[np.argmax(rainfall)]
ax2.annotate(f"Monsoon peak\\n{max(rainfall)} mm",
             xy=(peak_month, max(rainfall)),
             xytext=(months[8], max(rainfall) - 50),
             arrowprops=dict(arrowstyle="->", color="black"),
             fontsize=10, fontweight="bold")

ax1.set_title("Guwahati Climate — Temperature & Rainfall", fontsize=14)
fig.legend(loc="upper left", bbox_to_anchor=(0.12, 0.88))
plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Saving Charts',
        content:
          'Save your charts as image files for reports, websites, or presentations.',
        code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x) * np.exp(-x / 5)

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(x, y, "b-", linewidth=2)
ax.fill_between(x, y, alpha=0.2)
ax.set_title("Damped Sine Wave")
ax.set_xlabel("Time (s)")
ax.set_ylabel("Amplitude")
ax.grid(True, alpha=0.3)

# Save as PNG (good for slides and web)
fig.savefig("damped_wave.png", dpi=150, bbox_inches="tight")

# Save as SVG (scales perfectly, good for web)
fig.savefig("damped_wave.svg", bbox_inches="tight")

# Save as PDF (good for papers and print)
fig.savefig("damped_wave.pdf", bbox_inches="tight")

print("Saved: damped_wave.png, .svg, .pdf")
plt.show()`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. MACHINE LEARNING (priority — full content)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'machine-learning',
    title: 'Machine Learning',
    category: 'ai',
    icon: '🤖',
    tagline: 'Teach computers to learn from examples — not by writing rules, but by showing patterns.',
    relatedStories: ['girl-who-spoke-to-elephants', 'dragonfly-and-the-paddy-field', 'golden-deer-of-kamakhya', 'dancing-deer-of-loktak-lake', 'clouded-leopard'],

    understand: [
      {
        title: 'The Two Ways to Solve a Problem',
        content:
          'You want a computer to tell dogs apart from cats in photographs. There are two approaches.\n\n' +
          '**Approach 1 — Write the rules yourself.** You code: "If it has pointed ears AND a short snout ' +
          'AND slit pupils, it\'s a cat." But dogs can have pointed ears too. Cats can have round pupils. ' +
          'Some dogs are small and fluffy, some cats are large and sleek. Your rules need hundreds of ' +
          'exceptions, and they still fail on unusual breeds. The problem is too messy for hand-written rules.\n\n' +
          '**Approach 2 — Show examples and let the computer figure it out.** You give the computer 10,000 ' +
          'photos, each labelled "dog" or "cat." It examines all of them, finds the patterns that distinguish ' +
          'dogs from cats, and builds its own internal rules — rules too subtle and numerous for any human to ' +
          'write by hand. Then it classifies new photos it has never seen.\n\n' +
          'That second approach is **machine learning**. Instead of writing rules, you provide examples ' +
          'and the computer discovers the rules itself.\n\n' +
          '*In the Elephant story, Rongpharpi does exactly this — she learned to classify elephant moods ' +
          'not from a textbook but from hundreds of examples, matching vibrations to outcomes. In the ' +
          'Dragonfly story, a drone classifies crop health from images the same way. ML formalises the ' +
          'process both of them use.*',
        diagram: 'DogVsCatDiagram',
      },
      {
        title: 'The Postman Who Sorts by Feel',
        content:
          'Here is a simpler example that makes classification physical.\n\n' +
          'A postman in Shillong gets a pile of parcels every morning. He needs to sort them into ' +
          'three bags: the **bike pouch** (for letters), the **shoulder bag** (small packages), and the ' +
          '**truck crate** (heavy deliveries). There are no labels saying which bag — he has to decide ' +
          'by picking each one up.\n\n' +
          'He grabs a parcel. Flat, light, flexible — letter, bike pouch. Next: small, heavy, rigid — ' +
          'box, shoulder bag. Next: large, heavy — truck. He is classifying based on what he **feels**: ' +
          'weight, size, shape, flexibility. These are his **features** — measurable properties he uses ' +
          'to make a decision.\n\n' +
          'Nobody wrote him a rulebook. After sorting thousands of parcels, he just *knows*. A large ' +
          'envelope that is heavier than usual? That is the tricky case — it sits right on the boundary ' +
          'between bike pouch and shoulder bag. Sometimes he gets it wrong. Those fuzzy boundaries ' +
          'are exactly where ML classifiers struggle too.\n\n' +
          'Now imagine teaching a computer to do the postman\'s job. You give it the weight, length, ' +
          'width, and flexibility of 10,000 past parcels, each labelled with the correct bag. The ' +
          'computer finds the boundaries between the three categories in that 4-dimensional feature space — ' +
          'boundaries the postman learned by feel, but the computer learns from data.\n\n' +
          '*In the Postman of the Hills story, the postal worker navigates Meghalaya\'s steep terrain. ' +
          'Sorting parcels is the classification problem; choosing the best delivery route is the ' +
          'optimisation problem — both are core ML applications.*',
        diagram: 'PostmanSortingDiagram',
      },
      {
        title: 'How a Child Learns "Dog" — And Why It Matters',
        content:
          'A two-year-old has never read a zoology textbook. Nobody gives her a 50-page definition ' +
          'of "dog." Instead, her parents point at dogs and say "dog!", point at cats and say ' +
          '"kitty!" After dozens of examples, something remarkable happens: she sees a breed she ' +
          'has never encountered — a tiny Chihuahua, nothing like the Labrador next door — and ' +
          'confidently says "dog!"\n\n' +
          'How? She was not memorising individual dogs. She was unconsciously extracting **features** — ' +
          'floppy ears, wet nose, four legs, tail that wags when excited, barks instead of meows — and ' +
          'learning which features matter most. She figured out that colour does not matter (dogs come ' +
          'in every colour), size barely matters, but "barks" and "wags tail at people" are almost ' +
          'perfect predictors.\n\n' +
          'She was also learning **weights** — how much each feature should count. "Has fur" gets low ' +
          'weight because cats also have fur. "Barks" gets high weight because almost nothing else barks. ' +
          'She built an internal classifier — a mental model that takes features as input and outputs ' +
          '"dog" or "not dog." She did this without knowing any maths, any code, or any theory.\n\n' +
          '**Machine learning is the formalisation of exactly this process.** Instead of a child\'s brain, ' +
          'we use an algorithm. Instead of pointing and saying "dog!", we give the algorithm labelled data. ' +
          'The rest is the same: extract features, learn weights, classify new examples.',
      },
      {
        title: 'Features — The Lightbulb Moment',
        content:
          'Here is where everything clicks. When the child sees a golden retriever, her brain does not ' +
          'process the entire image at once. It breaks the animal down into **features** — measurable ' +
          'properties she can compare across animals:\n\n' +
          '• **Size**: large? small? medium?\n' +
          '• **Ears**: floppy? pointed? round?\n' +
          '• **Sound**: barks? meows? silent?\n' +
          '• **Tail**: wags at humans? stays still? bushy?\n' +
          '• **Nose**: wet? dry?\n\n' +
          'Not all features are equal. "Has four legs" is shared by dogs, cats, foxes, and stuffed ' +
          'animals — it does not help distinguish them. "Barks" is almost unique to dogs. The child ' +
          'implicitly gives each feature a **weight** — how much it should count toward the decision. ' +
          'High-weight features (barks, wags at humans) do most of the work. Low-weight features ' +
          '(has fur, four legs) are nearly useless on their own.\n\n' +
          'This is EXACTLY what a machine learning model does. You feed it features (numbers describing ' +
          'each example), and the training process automatically learns which features matter and how much. ' +
          'A model trained on elephant data might discover that **frequency** is the single most important ' +
          'feature for classifying mood — just like "barks" is the single most important feature for ' +
          'classifying dogs.\n\n' +
          'Try the interactive below — toggle features on and off and watch how the classifier\'s accuracy ' +
          'changes. Some features are nearly worthless. Others are critical. The model has to figure this ' +
          'out from examples alone.',
        diagram: 'FeatureWeightsDiagram',
      },
      {
        title: 'From Child to Computer — The Feature Vector',
        content:
          'The child processes features intuitively. A computer needs them as numbers. In the Elephant ' +
          'story, each recorded rumble becomes a **feature vector** — a list of numbers:\n\n' +
          '**[frequency = 80, pulse_rate = 0.5, amplitude = 0.7]**\n\n' +
          'That is the elephant equivalent of describing a dog as [size = large, ears = floppy, barks = yes]. ' +
          'Each rumble is a point in a space where the axes are the features. Calm rumbles cluster in one ' +
          'region of this space (low frequency, slow pulses). Nervous rumbles cluster in another (high ' +
          'frequency, fast pulses). Danger signals cluster in a third.\n\n' +
          'The model\'s job is to learn where the boundaries between these clusters lie — so that when ' +
          'a NEW rumble arrives, it can look at which cluster the new point falls in and predict the mood.',
        diagram: 'FeatureExtractionDiagram',
      },
      {
        title: 'Labels — The Teacher\'s Answer Key',
        content:
          'Features are the descriptions. **Labels** are the correct answers. When the child\'s parent ' +
          'points and says "dog!" — that is a label. In the elephant study, a wildlife expert listens ' +
          'to each recording and writes down the mood: "calm", "nervous", or "danger." That is the label.\n\n' +
          'Together, features + labels form a **training example**:\n\n' +
          '| Frequency | Pulse rate | Amplitude | **Label** |\n' +
          '|-----------|-----------|-----------|----------|\n' +
          '| 80 Hz | 0.5 | 0.7 | **calm** |\n' +
          '| 120 Hz | 2.1 | 0.9 | **nervous** |\n' +
          '| 45 Hz | 3.8 | 1.2 | **danger** |\n\n' +
          'You need many such examples — the more, the better the model learns. This is called ' +
          '**supervised learning**: the model is supervised by the labels, like a student supervised ' +
          'by a teacher who provides correct answers during practice.',
      },
      {
        title: 'Training vs Testing — Why You Hide the Exam',
        content:
          'Imagine a student who gets a perfect score on every homework assignment — because she copied ' +
          'the answer key. Has she learned anything? To find out, you give her a test with questions ' +
          'she has never seen. That is the difference between training and testing.\n\n' +
          'You split your data into two parts. The **training set** (typically 80% of your data) is what ' +
          'the model learns from. The **test set** (20%) is hidden during training and used only at the ' +
          'end to evaluate. If the model scores 95% on training data but 55% on test data, it ' +
          'memorised rather than learned — that is called **overfitting**.\n\n' +
          'The wall between training and test data is sacred. Break it (by accidentally letting the model ' +
          'see test answers) and your evaluation is worthless. This is the most common mistake in ML.',
        diagram: 'TrainTestSplitDiagram',
      },
      {
        title: 'K-Nearest Neighbors — The Simplest Classifier',
        content:
          'Now you know features, labels, and train/test splits. How does the actual classification work?\n\n' +
          'K-Nearest Neighbors is the simplest algorithm and the one you build in the Elephant story. ' +
          'When a new rumble arrives (a point in feature space), k-NN does three things:\n\n' +
          '1. **Measure distance** from the new point to every training point (using Euclidean distance — ' +
          'the straight-line distance in feature space)\n' +
          '2. **Pick the K closest** training points (the "neighbors")\n' +
          '3. **Majority vote** — if 2 of 3 neighbors are "calm", the new point is classified as "calm"\n\n' +
          'That is the entire algorithm. No equations to solve, no weights to optimise. Just: "who are ' +
          'the closest examples I have already seen, and what were they labelled?"\n\n' +
          'K is the one choice you make. K=1 means "copy the nearest example" (brittle, overfits). ' +
          'K=15 means "take a wide vote" (smoother, but might blur boundaries). The Elephant story ' +
          'lets you try different K values and see how accuracy changes.',
        diagram: 'KNNClassificationDiagram',
      },
      {
        title: 'Overfitting — When Memorising Beats Learning',
        content:
          'Back to the child learning dogs. Imagine she has only seen 3 dogs — all golden retrievers. ' +
          'She concludes: "dogs are golden." When she sees a black Labrador, she says "not a dog." ' +
          'She overfitted to her tiny training set.\n\n' +
          'ML models do the same thing. With K=1, the model memorises every single training point and ' +
          'creates a tiny "zone" around each one. Any noise in the training data (a mislabelled example, ' +
          'a sensor glitch) creates a wrong zone that misleads future predictions. The model scores ' +
          '100% on training data but poorly on test data.\n\n' +
          'The cure: more diverse training data, larger K values, and always evaluating on a test set ' +
          'the model has never seen.',
      },
      {
        title: 'Accuracy, Precision, Recall — Did It Actually Work?',
        content:
          '**Accuracy** = correct predictions / total predictions. If the model classifies 90 of 100 ' +
          'rumbles correctly, accuracy is 90%.\n\n' +
          'But accuracy can lie. If 95% of rumbles are "calm", a model that ALWAYS guesses "calm" gets ' +
          '95% accuracy — while missing every single danger signal. For elephant safety, missing a danger ' +
          'signal is catastrophic.\n\n' +
          '**Precision** (for "danger"): of everything the model CALLED danger, how many actually were? ' +
          'High precision = few false alarms.\n\n' +
          '**Recall** (for "danger"): of everything that WAS danger, how many did the model catch? ' +
          'High recall = few missed threats.\n\n' +
          'For conservation, recall on "danger" matters most. A false alarm (precision error) means rangers ' +
          'investigate nothing. A missed danger (recall error) means an elephant herd crashes into a village.',
      },
      {
        title: 'The Confusion Matrix — Where Mistakes Live',
        content:
          'A **confusion matrix** is a table showing exactly where the model gets confused. Rows are ' +
          'actual labels, columns are predicted labels. The diagonal shows correct predictions; ' +
          'off-diagonal cells show specific mistakes.\n\n' +
          'In the Elephant story, the 3×3 matrix might show that the model confuses "nervous" with ' +
          '"danger" (their frequency ranges overlap) but never confuses "calm" with "danger" (they are ' +
          'far apart in feature space). That tells you exactly what to fix — maybe add a new feature ' +
          '(duration of the rumble?) that separates nervous from danger.\n\n' +
          'This is how real ML engineers work: train → evaluate → read the confusion matrix → improve → ' +
          'repeat until the model is reliable enough for deployment.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the ML term to its meaning',
            pairs: [
              ['Features', 'Measurable properties describing each example (e.g., frequency, pulse rate)'],
              ['Labels', 'The correct answers the model learns to predict (e.g., calm, nervous, danger)'],
              ['Training set', 'The 80% of examples the model learns from'],
              ['Test set', 'The 20% of examples hidden during training — the honest exam'],
              ['Overfitting', 'Memorising training data instead of learning general patterns'],
              ['Confusion matrix', 'A table showing exactly which classes the model confuses'],
            ],
          },
        },
      },
      {
        title: 'From Elephants to Everything',
        content:
          'The pattern you just learned — features → labels → train → test → evaluate → improve — ' +
          'is the same pattern behind:\n\n' +
          '• **Image recognition**: features = pixel values, labels = "cat"/"dog"/"car". Your phone ' +
          'uses this to sort photos.\n' +
          '• **Spam filters**: features = word frequencies, labels = "spam"/"not spam". Gmail processes ' +
          'billions of emails this way.\n' +
          '• **Medical diagnosis**: features = blood test results, labels = "healthy"/"at risk". Models ' +
          'can detect cancers that human doctors miss.\n' +
          '• **Self-driving cars**: features = camera pixels + lidar distances, labels = "pedestrian"/' +
          '"bicycle"/"traffic sign". The stakes are life and death.\n' +
          '• **Wildlife conservation**: features = camera trap images, labels = species. The Elephant ' +
          'Listening Project at Cornell uses ML to monitor elephant populations across Africa.\n\n' +
          'Every one of these systems was built by someone who understood features, labels, training, ' +
          'testing, and evaluation — exactly what you are learning.',
      },
      // ── Beyond k-NN: Other Algorithms (visual) ──────────────
      {
        title: 'Decision Trees — Asking Yes/No Questions',
        content:
          'A decision tree works like 20 Questions. It asks a series of yes/no questions about ' +
          'features, and each answer narrows down the possibilities until it reaches a classification.\n\n' +
          '"Is the weight over 100 kg?" → Yes → "Does it have a trunk?" → Yes → **Elephant.**\n\n' +
          'Each question splits the data into two groups. The algorithm picks questions that ' +
          'separate classes as cleanly as possible — the most informative question goes first. ' +
          'The result is a flowchart you can follow from top to bottom.\n\n' +
          'Decision trees are powerful because they are **interpretable** — you can see exactly ' +
          'why the model made each decision. A doctor using a decision tree model can explain ' +
          'to a patient: "your blood pressure is above 140, your age is above 60, and your ' +
          'cholesterol is elevated — the model recommends further testing." Try classifying ' +
          'animals in the interactive tree below.',
        diagram: 'DecisionTreeDiagram',
      },
      {
        title: 'Linear Classifiers — Drawing a Line Between Classes',
        content:
          'The simplest classifier just draws a straight line (in 2D) or a flat plane (in higher ' +
          'dimensions) between the classes. Everything on one side is "calm," everything on the ' +
          'other is "nervous."\n\n' +
          'This works beautifully when classes are neatly separated — calm rumbles cluster in one ' +
          'corner of feature space, nervous rumbles in another, and a straight boundary between ' +
          'them captures the difference.\n\n' +
          'But some problems are not linearly separable. Imagine calm rumbles surrounded by a ring ' +
          'of nervous rumbles — no single straight line can separate them. You need a **curved ' +
          'boundary**. That is exactly what neural networks learn to draw.',
        diagram: 'LinearClassifierDiagram',
      },
      {
        title: 'Neural Networks — Learning Any Boundary',
        content:
          'A neural network is layers of simple mathematical units (neurons) connected by weighted ' +
          'links. Each neuron takes inputs, multiplies them by weights, adds them up, and passes ' +
          'the result through a function that decides whether to "fire."\n\n' +
          'The input layer receives features (frequency, pulse rate, amplitude). Hidden layers ' +
          'transform these features into increasingly abstract representations — the first hidden ' +
          'layer might detect "is the frequency high?", the second might combine that with pulse ' +
          'rate to detect "is this a nervous pattern?" The output layer produces the final ' +
          'classification.\n\n' +
          '**Training** adjusts every weight in the network to minimise errors. The network starts ' +
          'with random weights (guessing), sees an example, checks if it was right, and nudges ' +
          'weights in the direction that would have been more correct. After thousands of examples, ' +
          'the weights converge on values that classify accurately.\n\n' +
          'Tap an output node below to see which connections are strongest — which features matter ' +
          'most for each mood.',
        diagram: 'NeuralNetworkDiagram',
      },
      {
        title: 'Transformers — How Modern AI Understands Language',
        content:
          'Every AI language model you have heard of — ChatGPT, Google Translate, GitHub Copilot — ' +
          'runs on an architecture called the **transformer**, introduced in 2017.\n\n' +
          'The key innovation is **self-attention**. When processing a sentence, every word looks ' +
          'at every other word and decides how much attention to pay to each one. In the sentence ' +
          '"The elephant rumbled because **it** was nervous," the word "it" needs to figure out ' +
          'what it refers to. Through attention, "it" learns to attend strongly to "elephant" — ' +
          'not "rumbled" or "because."\n\n' +
          'This is fundamentally different from older approaches that processed words one at a time, ' +
          'left to right. Transformers process **all words simultaneously**, using attention weights ' +
          'to understand relationships between any pair of words regardless of distance.\n\n' +
          'A transformer trained on billions of sentences learns not just grammar but reasoning, ' +
          'translation, summarisation, and even code generation — all from the same architecture. ' +
          'The model you might use to chat with an AI assistant was trained this way.\n\n' +
          'Click a word below to see its attention pattern — which other words it focuses on to ' +
          'understand context.',
        diagram: 'TransformerAttentionDiagram',
      },
    ],

    build: [
      {
        title: 'Preparing Data with scikit-learn',
        content:
          'Before training, you split your data into training and testing sets, and scale features to similar ranges.',
        code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

# Example: elephant sightings with features
# [weight_kg, height_cm, footprint_cm]
X = np.array([
    [4500, 280, 45], [4200, 270, 43], [3800, 260, 40],
    [30, 60, 8], [35, 55, 7], [28, 50, 6],      # dogs
    [5, 25, 3], [4, 22, 2], [6, 28, 3],          # cats
])
y = np.array(["elephant","elephant","elephant",
              "dog","dog","dog",
              "cat","cat","cat"])

# Split: 70% train, 30% test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Scale features to mean=0, std=1
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)  # use same scaling`,
      },
      {
        title: 'K-Nearest Neighbors',
        content:
          'KNN classifies a new sample by looking at the K closest training samples and taking a majority vote.',
        code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Train
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# Predict
predictions = knn.predict(X_test)
print("Predictions:", predictions)
print("Accuracy:", accuracy_score(y_test, predictions))

# Predict a single new animal
new_animal = scaler.transform([[4000, 265, 42]])
print("New animal is a:", knn.predict(new_animal)[0])`,
      },
      {
        title: 'Decision Trees',
        content:
          'A decision tree asks yes/no questions about features, branching like a flowchart until it reaches an answer.',
        code: `from sklearn.tree import DecisionTreeClassifier, export_text

# Train
tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)

# See the rules it learned
print(export_text(tree, feature_names=["weight","height","footprint"]))

# Evaluate
score = tree.score(X_test, y_test)
print(f"Test accuracy: {score:.0%}")`,
      },
      {
        title: 'Evaluating a Model',
        content:
          'Accuracy alone can be misleading. A confusion matrix and classification report show per-class performance.',
        code: `from sklearn.metrics import classification_report, confusion_matrix

predictions = tree.predict(X_test)

print("Confusion Matrix:")
print(confusion_matrix(y_test, predictions))

print("\\nClassification Report:")
print(classification_report(y_test, predictions))
# Shows precision, recall, and f1-score for each class`,
      },
      {
        title: 'Training a Simple Neural Network',
        content:
          'For more complex patterns, a neural network (multi-layer perceptron) can learn non-linear boundaries.',
        code: `from sklearn.neural_network import MLPClassifier

mlp = MLPClassifier(
    hidden_layer_sizes=(16, 8),   # two hidden layers
    max_iter=500,
    random_state=42,
)
mlp.fit(X_train, y_train)

print("MLP accuracy:", mlp.score(X_test, y_test))

# Neural nets need more data and tuning, but can
# capture patterns that KNN and trees miss.`,
      },
      {
        title: 'Cross-Validation',
        content:
          'Instead of a single train/test split, cross-validation tests the model multiple times on different slices.',
        code: `from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    KNeighborsClassifier(n_neighbors=3),
    X, y, cv=3, scoring="accuracy"
)
print(f"CV scores: {scores}")
print(f"Mean: {scores.mean():.2%} ± {scores.std():.2%}")
# More reliable estimate of real-world performance`,
      },
      {
        title: 'Building a Confusion Matrix',
        content:
          'A confusion matrix is a table that shows exactly where your model gets confused. Rows ' +
          'represent the true labels, columns represent the predicted labels. Each cell tells you ' +
          'how many times a true class was predicted as another class. For our 3-class elephant ' +
          'classifier, you get a 3x3 grid: correct predictions sit on the diagonal (top-left to ' +
          'bottom-right), and off-diagonal cells reveal mistakes.',
        code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import numpy as np

# --- Setup: same data and model from earlier ---
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X = np.array([
    [4500, 280, 45], [4200, 270, 43], [3800, 260, 40],
    [4600, 285, 46], [4100, 268, 42],                   # elephants
    [30, 60, 8], [35, 55, 7], [28, 50, 6],
    [33, 58, 9], [27, 52, 7],                            # dogs
    [5, 25, 3], [4, 22, 2], [6, 28, 3],
    [5, 24, 3], [4, 23, 2],                              # cats
])
y = np.array([
    "elephant","elephant","elephant","elephant","elephant",
    "dog","dog","dog","dog","dog",
    "cat","cat","cat","cat","cat",
])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)
predictions = knn.predict(X_test)

# --- Build the confusion matrix ---
labels = ["cat", "dog", "elephant"]
cm = confusion_matrix(y_test, predictions, labels=labels)

print("Confusion Matrix:")
print(cm)
# Each row = true class, each column = predicted class
# Diagonal = correct predictions

# --- How to read the 3x3 grid ---
for i, true_label in enumerate(labels):
    for j, pred_label in enumerate(labels):
        count = cm[i][j]
        if count > 0:
            if i == j:
                print(f"  {count}x {true_label} correctly classified")
            else:
                print(f"  {count}x {true_label} misclassified as {pred_label}")

# --- Visual display ---
disp = ConfusionMatrixDisplay(cm, display_labels=labels)
disp.plot(cmap="Blues", values_format="d")
plt.title("Elephant Classifier — Confusion Matrix")
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=150)
plt.show()`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. SIGNAL PROCESSING (priority — full content)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'signal-processing',
    title: 'Signals & Frequencies',
    category: 'data-science',
    icon: '🌊',
    tagline: 'Understand the waves hidden in data',
    relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'river-dolphins-secret', 'bamboo-taught-wind', 'mountain-echoes'],

    understand: [
      {
        title: 'What Vibration Is',
        content:
          'Pluck a guitar string and watch it blur. It\'s vibrating — moving back and forth ' +
          'rapidly around its resting position. That back-and-forth motion creates a wave in ' +
          'the air, which your ear detects as sound. Almost everything that makes sound — a ' +
          'dhol drum, a bird\'s call, a river\'s rush — does so through vibration.',
        diagram: 'TransverseLongitudinalDiagram',
      },
      {
        title: 'Frequency = Speed of Vibration',
        content:
          'Frequency tells you how many times something vibrates per second, measured in Hertz ' +
          '(Hz). A low hum might be 100 Hz (100 vibrations per second). A high-pitched whistle ' +
          'might be 4,000 Hz. The higher the frequency, the higher the pitch you hear.',
        diagram: 'WaveEquationDiagram',
      },
      {
        title: 'Amplitude = Strength of Vibration',
        content:
          'Amplitude is how far the vibration swings from the center. A gentle whisper has tiny ' +
          'amplitude; a shout has large amplitude. On a wave diagram, amplitude is the height ' +
          'of the peaks. More amplitude means louder sound or stronger signal.',
        diagram: 'SineWaveDiagram',
      },
      {
        title: 'How Your Ear Works',
        content:
          'Your ear is a biological frequency analyzer. Sound waves enter the ear canal and hit ' +
          'the eardrum, which vibrates. Inside the cochlea (a snail-shaped organ), different ' +
          'positions respond to different frequencies — high pitches near the entrance, low ' +
          'pitches deeper inside. Your brain combines all these responses to let you hear music, ' +
          'speech, and the call of a river dolphin.',
        diagram: 'MusicalWavesDiagram',
      },
      {
        title: 'Separating Sounds — The FFT Prism',
        content:
          'A prism splits white light into a rainbow of colors. The Fast Fourier Transform (FFT) ' +
          'does the same for sound: it takes a messy, combined signal and separates it into its ' +
          'individual frequencies. This is how noise-canceling headphones know which frequencies ' +
          'to block, and how Priya\'s program could isolate an elephant\'s low-frequency rumble ' +
          'from jungle noise.',
        interactive: {
          type: 'slider',
          props: {
            component: 'FrequencySlider',
            title: 'Explore frequency and amplitude',
            description: 'Drag the sliders to see how changing frequency and amplitude affects a wave.',
          },
        },
      },
    ],

    build: [
      {
        title: 'Generating a Sine Wave',
        content:
          'A sine wave is the purest tone — a single frequency. All complex sounds are combinations of sine waves.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters
frequency = 440      # Hz (A4 note)
duration = 0.01      # seconds (show 10ms)
sample_rate = 44100  # samples per second

# Generate time array and wave
t = np.linspace(0, duration, int(sample_rate * duration))
wave = np.sin(2 * np.pi * frequency * t)

plt.plot(t * 1000, wave)  # x-axis in milliseconds
plt.xlabel("Time (ms)")
plt.ylabel("Amplitude")
plt.title(f"Sine wave at {frequency} Hz")
plt.grid(True)
plt.show()`,
      },
      {
        title: 'Combining Frequencies',
        content:
          'Real sounds are mixtures. Add sine waves of different frequencies to build complex tones.',
        code: `import numpy as np
import matplotlib.pyplot as plt

sample_rate = 44100
t = np.linspace(0, 0.01, 441)

# Three frequencies
f1, f2, f3 = 220, 440, 660  # fundamental + harmonics
wave = (np.sin(2 * np.pi * f1 * t) +
        0.5 * np.sin(2 * np.pi * f2 * t) +
        0.25 * np.sin(2 * np.pi * f3 * t))

plt.plot(t * 1000, wave)
plt.xlabel("Time (ms)")
plt.ylabel("Amplitude")
plt.title("Three frequencies combined")
plt.grid(True)
plt.show()`,
      },
      {
        title: 'The FFT — Frequency Spectrum',
        content:
          'The FFT reveals which frequencies are present in a signal and how strong each one is.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Create a signal with known frequencies
sample_rate = 44100
duration = 0.5
t = np.linspace(0, duration, int(sample_rate * duration))
signal = (np.sin(2 * np.pi * 220 * t) +
          0.5 * np.sin(2 * np.pi * 440 * t) +
          0.3 * np.sin(2 * np.pi * 880 * t))

# Compute FFT
fft_result = np.fft.fft(signal)
freqs = np.fft.fftfreq(len(signal), 1 / sample_rate)

# Plot only positive frequencies
mask = freqs >= 0
plt.plot(freqs[mask], np.abs(fft_result[mask]) / len(signal))
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.title("Frequency Spectrum (FFT)")
plt.xlim(0, 1000)
plt.grid(True)
plt.show()
# You'll see spikes at 220, 440, and 880 Hz`,
      },
      {
        title: 'Filtering a Signal',
        content:
          'A low-pass filter removes high frequencies (noise), keeping only the slow, smooth changes.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Noisy signal: 5 Hz sine + random noise
sample_rate = 1000
t = np.linspace(0, 1, sample_rate)
clean = np.sin(2 * np.pi * 5 * t)
noisy = clean + 0.5 * np.random.randn(len(t))

# Simple moving-average filter
window = 25
kernel = np.ones(window) / window
filtered = np.convolve(noisy, kernel, mode="same")

plt.figure(figsize=(10, 4))
plt.plot(t, noisy, alpha=0.4, label="Noisy")
plt.plot(t, filtered, "r-", linewidth=2, label="Filtered")
plt.plot(t, clean, "g--", label="Original")
plt.legend()
plt.title("Low-Pass Filtering (Moving Average)")
plt.xlabel("Time (s)")
plt.grid(True)
plt.show()`,
      },
      {
        title: 'Spectrogram — Frequency Over Time',
        content:
          'A spectrogram shows how frequencies change over time — essential for analyzing bird calls, speech, and music.',
        diagram: 'SpectrogramDiagram',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Chirp signal: frequency rises from 100 to 1000 Hz
sample_rate = 8000
duration = 2
t = np.linspace(0, duration, int(sample_rate * duration))
freq_start, freq_end = 100, 1000
phase = 2 * np.pi * (freq_start * t +
        (freq_end - freq_start) * t**2 / (2 * duration))
chirp = np.sin(phase)

plt.specgram(chirp, Fs=sample_rate, cmap="viridis")
plt.xlabel("Time (s)")
plt.ylabel("Frequency (Hz)")
plt.colorbar(label="Intensity (dB)")
plt.title("Spectrogram of a Chirp Signal")
plt.show()`,
      },
      {
        title: 'Sampling and Aliasing',
        content:
          'The Nyquist theorem says you must sample at least 2x the highest frequency to capture it correctly. Below that, you get aliasing — phantom frequencies.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# True signal: 50 Hz
freq = 50
t_fine = np.linspace(0, 0.1, 10000)
true_signal = np.sin(2 * np.pi * freq * t_fine)

# Good sampling: 500 Hz (10x the signal)
sr_good = 500
t_good = np.arange(0, 0.1, 1/sr_good)
s_good = np.sin(2 * np.pi * freq * t_good)

# Bad sampling: 70 Hz (below Nyquist)
sr_bad = 70
t_bad = np.arange(0, 0.1, 1/sr_bad)
s_bad = np.sin(2 * np.pi * freq * t_bad)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
ax1.plot(t_fine, true_signal, "b-", alpha=0.3)
ax1.stem(t_good, s_good, "g", markerfmt="go", basefmt=" ")
ax1.set_title(f"Good sampling ({sr_good} Hz)")

ax2.plot(t_fine, true_signal, "b-", alpha=0.3)
ax2.stem(t_bad, s_bad, "r", markerfmt="ro", basefmt=" ")
ax2.set_title(f"Aliased sampling ({sr_bad} Hz) — wrong shape!")
plt.tight_layout()
plt.show()`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. CIRCUITS BASICS (priority — full content)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'circuits-basics',
    title: 'Circuits & Electronics',
    category: 'electronics',
    icon: '⚡',
    tagline: 'The foundation of every electronic device',
    relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret', 'bridge-that-grew', 'festival-lights'],

    understand: [
      {
        title: 'What Electricity Is',
        content:
          'Everything is made of atoms, and atoms contain tiny particles called electrons. ' +
          'When electrons flow through a wire, that flow is electricity — like water flowing ' +
          'through a pipe. The wire is the pipe, the battery is the pump, and the electrons ' +
          'are the water. This flow is called *current*.',
        diagram: 'StaticElectricityDiagram',
      },
      {
        title: 'Complete Circuits — A Loop',
        content:
          'Electricity only flows in a complete loop (circuit). If there\'s a break anywhere — a ' +
          'disconnected wire, an open switch — the flow stops entirely. Think of it as a ' +
          'circular track: if you remove a section of track, the train can\'t complete the loop. ' +
          'A switch is like a drawbridge on that track — open it to stop the train, close it to ' +
          'let it through.',
        diagram: 'CircuitDiagram',
      },
      {
        title: 'Voltage, Current, and Resistance',
        content:
          'Three quantities define every circuit. *Voltage* (V) is the pressure pushing ' +
          'electrons — like water pressure in a pipe. *Current* (I, in Amps) is the flow rate — ' +
          'how many electrons pass per second. *Resistance* (R, in Ohms) is how much the wire ' +
          'or component restricts flow — like a narrow section of pipe. Ohm\'s Law ties them ' +
          'together: V = I x R. A 9V battery pushing through 100 Ohms gives 0.09 Amps (90 mA).',
        diagram: 'CircuitDiagram',
        interactive: {
          type: 'slider',
          props: {
            component: 'OhmsLawCalculator',
            title: 'Ohm\'s Law Calculator',
            description: 'Adjust voltage and resistance to see how current changes.',
          },
        },
      },
      {
        title: 'Why LEDs Need Resistors',
        content:
          'An LED (Light Emitting Diode) converts electrical energy into light, but it\'s ' +
          'delicate — too much current will burn it out instantly. A resistor limits the current ' +
          'to a safe level. For a typical LED that needs 20 mA and drops 2V, on a 5V Arduino: ' +
          'R = (5V - 2V) / 0.02A = 150 Ohms. Always use a resistor with an LED.',
        diagram: 'OhmsLawDiagram',
      },
      {
        title: 'PWM — Flickering Too Fast to See',
        content:
          'Pulse Width Modulation (PWM) switches a pin on and off thousands of times per second. ' +
          'Your eye can\'t see the flickering, so an LED appears dimmer when it\'s off half the ' +
          'time (50% duty cycle) and brighter at 100%. This trick lets a digital pin (which can ' +
          'only be fully on or fully off) simulate any brightness level — or control motor speed.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'PWM switches a pin on and off thousands of times per second to simulate analog output.', answer: true, explanation: 'At 50% duty cycle the pin is HIGH half the time, making an LED appear half-bright or a motor run at half speed.' },
              { text: 'A 25% duty cycle means the LED is on 75% of the time.', answer: false, explanation: 'A 25% duty cycle means the pin is HIGH only 25% of the time — the LED appears dim, not bright.' },
              { text: 'All Arduino pins support PWM output.', answer: false, explanation: 'Only pins marked with a ~ symbol support PWM. On an Uno, those are pins 3, 5, 6, 9, 10, and 11.' },
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Ohm\'s Law Calculations',
        content:
          'V = I x R is the fundamental equation. Rearrange it to find any unknown.',
        code: `# Ohm's Law: V = I * R

def ohms_law(V=None, I=None, R=None):
    """Given any two, calculate the third."""
    if V is None:
        return I * R
    elif I is None:
        return V / R
    elif R is None:
        return V / I

# Example: LED on a 5V Arduino
V_supply = 5.0    # volts
V_led = 2.0       # LED forward voltage
V_resistor = V_supply - V_led  # 3.0V across resistor
I_desired = 0.020  # 20 mA

R = ohms_law(V=V_resistor, I=I_desired)
print(f"Resistor needed: {R:.0f} Ω")  # 150 Ω

# Power dissipated by the resistor
P = V_resistor * I_desired
print(f"Power: {P*1000:.0f} mW")  # 60 mW`,
      },
      {
        title: 'Series and Parallel Circuits',
        content:
          'In series, resistances add up. In parallel, the total resistance decreases.',
        diagram: 'SeriesParallelCircuitDiagram',
        code: `# Series: R_total = R1 + R2 + R3
def series(*resistors):
    return sum(resistors)

# Parallel: 1/R_total = 1/R1 + 1/R2 + ...
def parallel(*resistors):
    return 1 / sum(1/r for r in resistors)

# Three 100Ω resistors in series
print(f"Series:   {series(100, 100, 100)} Ω")     # 300 Ω

# Three 100Ω resistors in parallel
print(f"Parallel: {parallel(100, 100, 100):.1f} Ω")  # 33.3 Ω

# Mixed: two 200Ω in parallel, then in series with 50Ω
r_par = parallel(200, 200)   # 100 Ω
r_total = series(r_par, 50)  # 150 Ω
print(f"Mixed:    {r_total:.0f} Ω")`,
      },
      {
        title: 'LED with Resistor (Arduino)',
        content:
          'The classic first circuit: control an LED brightness using PWM.',
        code: `// Arduino: Fade an LED using PWM
const int ledPin = 9;  // must be a PWM pin (~)

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade up
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    analogWrite(ledPin, brightness);  // PWM: 0-255
    delay(30);
  }
  // Fade down
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    analogWrite(ledPin, brightness);
    delay(30);
  }
}`,
      },
      {
        title: 'Voltage Divider',
        content:
          'Two resistors in series create a lower voltage — essential for connecting 5V sensors to 3.3V boards.',
        code: `# Voltage divider: V_out = V_in * R2 / (R1 + R2)

def voltage_divider(V_in, R1, R2):
    V_out = V_in * R2 / (R1 + R2)
    return V_out

# 5V to ~3.3V using standard resistors
V_out = voltage_divider(5.0, 1000, 2000)
print(f"V_out: {V_out:.2f} V")  # 3.33 V

# Find R2 for a target voltage
def find_R2(V_in, V_out, R1):
    return R1 * V_out / (V_in - V_out)

R2 = find_R2(5.0, 3.3, 10000)
print(f"R2 needed: {R2:.0f} Ω")  # 19412 Ω ≈ 20kΩ`,
      },
      {
        title: 'Capacitors — Storing Charge',
        content:
          'A capacitor stores energy like a small rechargeable tank. It charges and discharges following an exponential curve.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# RC circuit: capacitor charging through a resistor
R = 10_000   # 10 kΩ
C = 0.0001   # 100 µF
tau = R * C  # time constant = 1 second
V_supply = 5.0

t = np.linspace(0, 5 * tau, 500)
V_charge = V_supply * (1 - np.exp(-t / tau))
V_discharge = V_supply * np.exp(-t / tau)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

ax1.plot(t, V_charge, "b-", linewidth=2)
ax1.axhline(V_supply * 0.632, color="gray", linestyle="--",
            label=f"63.2% at τ = {tau:.1f}s")
ax1.set_title("Charging")
ax1.set_xlabel("Time (s)")
ax1.set_ylabel("Voltage (V)")
ax1.legend()
ax1.grid(True)

ax2.plot(t, V_discharge, "r-", linewidth=2)
ax2.axhline(V_supply * 0.368, color="gray", linestyle="--",
            label=f"36.8% at τ = {tau:.1f}s")
ax2.set_title("Discharging")
ax2.set_xlabel("Time (s)")
ax2.legend()
ax2.grid(True)

plt.suptitle(f"RC Circuit (R={R/1000:.0f}kΩ, C={C*1e6:.0f}µF, τ={tau:.1f}s)")
plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Reading a Circuit Schematic',
        content:
          'Common schematic symbols and how to trace current flow.',
        code: `# This section is conceptual — no runnable code.
# Common schematic symbols:
#
#   ─────  Wire (conductor)
#   ─┤├─   Capacitor
#   ─/\\/\\/─  Resistor
#   ─▶|─   LED (diode with light)
#   ─|+  -|─  Battery
#   ┤      Transistor (switch controlled by current)
#
# To read a schematic:
# 1. Find the power source (battery / USB)
# 2. Trace from + terminal through components back to -
# 3. Current flows from high voltage to low voltage
# 4. At junctions, current splits (parallel paths)
# 5. Switches break or complete the loop`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 9. ARDUINO SIMULATOR
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'arduino-simulator',
    title: 'Arduino Simulator',
    category: 'electronics',
    icon: '🖥️',
    tagline: 'Test circuits without physical hardware',
    relatedStories: ['firefly-festival-of-majuli', 'river-dolphins-secret'],

    understand: [
      {
        title: 'Why Simulate Instead of Using Real Hardware?',
        content:
          'Real Arduino boards and components cost money and take time to ship. A simulator lets ' +
          'you build virtual circuits, write code, and test everything in your browser — for free, ' +
          'instantly. You can wire an LED backwards, short-circuit a virtual battery, or accidentally ' +
          'send too much voltage to a sensor, and nothing breaks. You just click "undo" and try again. ' +
          'This makes learning much faster because you can experiment fearlessly. Professionals use ' +
          'simulators too: engineers simulate rocket circuits before building them, because testing ' +
          'on a real rocket is expensive and risky.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'In a simulator, wiring an LED backwards will physically damage your computer.', answer: false, explanation: 'Nothing physical can break in a simulator. You just click undo and try again, which is exactly why simulators are great for learning.' },
              { text: 'Professional engineers use simulators to test circuits before building the real thing.', answer: true, explanation: 'Simulation saves time and money. Testing on a real rocket or satellite is expensive, so engineers verify designs virtually first.' },
            ],
          },
        },
      },
      {
        title: 'What You See in the Simulator',
        content:
          'A typical Arduino simulator (like Wokwi or Tinkercad Circuits) shows three main areas. ' +
          'First, the *code editor* where you write your Arduino sketch — it looks just like the real ' +
          'Arduino IDE. Second, the *circuit view* where you drag and drop components (LEDs, resistors, ' +
          'sensors, wires) onto a virtual breadboard and connect them to the Arduino board. Third, the ' +
          '*serial monitor* that shows text output from your program, just like the real one. Some ' +
          'simulators also show an oscilloscope view so you can see voltage changing over time.',
        diagram: 'CircuitDiagram',
      },
      {
        title: 'Common Mistakes (and Why Simulation Helps)',
        content:
          'The most common beginner mistake is forgetting to set the pin mode — your LED does nothing ' +
          'because you never told the Arduino whether the pin is an INPUT or OUTPUT. Another common ' +
          'issue: connecting an LED without a resistor, which in real life burns it out instantly. ' +
          'In the simulator, the LED might blink red to warn you, but it will not literally catch fire. ' +
          'Other frequent errors: using the wrong pin number, forgetting Serial.begin() before printing, ' +
          'or mixing up analogRead (for sensors, returns 0-1023) with digitalRead (for buttons, ' +
          'returns HIGH or LOW). The simulator\'s serial monitor helps you debug all of these by ' +
          'printing values so you can see exactly what your code is doing.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the common Arduino mistake to the symptom',
            pairs: [
              ['Forgot pinMode()', 'LED does nothing when you write HIGH to the pin'],
              ['Missing resistor on LED', 'LED burns out (real) or shows a warning (simulator)'],
              ['Wrong pin number', 'Code runs but nothing happens on the expected component'],
              ['Forgot Serial.begin()', 'Serial.print() produces no output in the monitor'],
              ['Used digitalRead for analog sensor', 'Only get HIGH or LOW instead of a 0-1023 range'],
            ],
          },
        },
      },
      {
        title: 'From Simulation to Real Hardware',
        content:
          'Once your simulated circuit works, moving to real hardware is straightforward. Buy the ' +
          'same components you used in the simulator, wire them the same way on a real breadboard, ' +
          'and upload the same code to a real Arduino via USB. The only differences: real components ' +
          'have tolerances (a "100 ohm" resistor might actually be 98 or 102 ohms), real wires can ' +
          'come loose, and real sensors have noise. But the logic and code stay exactly the same. ' +
          'Start in simulation, finish with real hardware.',
        diagram: 'SeriesParallelCircuitDiagram',
      },
    ],

    build: [
      {
        title: 'Simulated LED Circuit',
        content:
          'The classic "Hello World" of Arduino. This blinks an LED and prints status to the serial monitor.',
        code: `// Paste into the Arduino simulator editor
// Works in Wokwi, Tinkercad Circuits, or similar

void setup() {
  pinMode(13, OUTPUT);       // built-in LED pin
  pinMode(12, OUTPUT);       // external LED pin
  Serial.begin(9600);
  Serial.println("Simulator ready!");
}

void loop() {
  // Blink built-in LED
  digitalWrite(13, HIGH);
  Serial.println("LED ON");
  delay(500);

  digitalWrite(13, LOW);
  Serial.println("LED OFF");
  delay(500);

  // Blink external LED on pin 12 (opposite pattern)
  // In the simulator: drag an LED + 220Ω resistor
  // from pin 12 to GND
  digitalWrite(12, !digitalRead(13));
}`,
      },
      {
        title: 'Simulated Sensor with Variable Input',
        content:
          'The simulator lets you drag a slider to change the value of a virtual potentiometer or sensor. ' +
          'This example maps sensor input to LED brightness and prints values for debugging.',
        code: `// Virtual potentiometer on A0 controls LED brightness on pin 9
const int potPin = A0;
const int ledPin = 9;    // must be a PWM pin (~)

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Drag the potentiometer slider!");
}

void loop() {
  int sensorValue = analogRead(potPin);  // 0-1023
  int brightness = map(sensorValue, 0, 1023, 0, 255);

  analogWrite(ledPin, brightness);  // PWM output

  // Print a simple bar graph to serial monitor
  Serial.print("Sensor: ");
  Serial.print(sensorValue);
  Serial.print(" | Brightness: ");
  Serial.print(brightness);
  Serial.print(" |");
  for (int i = 0; i < brightness / 10; i++) {
    Serial.print("█");
  }
  Serial.println();
  delay(100);
}`,
      },
      {
        title: 'Multi-Component Simulation: Traffic Light',
        content:
          'A more advanced simulation with three LEDs and timed transitions — a virtual traffic light.',
        code: `// Traffic light: Red, Yellow, Green LEDs on pins 11, 10, 9
const int RED = 11;
const int YELLOW = 10;
const int GREEN = 9;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Traffic light starting...");
}

void setLight(bool r, bool y, bool g, const char* label) {
  digitalWrite(RED, r);
  digitalWrite(YELLOW, y);
  digitalWrite(GREEN, g);
  Serial.println(label);
}

void loop() {
  setLight(LOW,  LOW, HIGH, "GREEN  - Go");
  delay(3000);

  setLight(LOW, HIGH,  LOW, "YELLOW - Slow down");
  delay(1000);

  setLight(HIGH, LOW,  LOW, "RED    - Stop");
  delay(3000);

  setLight(HIGH, HIGH, LOW, "RED+YELLOW - Get ready");
  delay(1000);
}
// In the simulator: wire 3 LEDs (with resistors) to pins 11, 10, 9`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 11. STATISTICS BASICS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'statistics-basics',
    title: 'Statistics Basics',
    category: 'data-science',
    icon: '📐',
    tagline: 'Make sense of data with numbers',
    relatedStories: ['girl-who-spoke-to-elephants', 'why-the-muga-silk-is-golden', 'boy-who-talked-to-clouds', 'dancing-deer-of-loktak-lake'],

    understand: [
      {
        title: 'What Statistics Does',
        content:
          'Statistics is the art of finding patterns in messy data. Imagine you measure the height ' +
          'of every student in your class. Just looking at 30 numbers is overwhelming. Statistics ' +
          'gives you tools to summarize those numbers into a few meaningful values: the average ' +
          'height, how spread out the values are, and whether there is a real difference between ' +
          'groups. Scientists use statistics to decide if a medicine works. Sports analysts use it ' +
          'to compare players. Weather forecasters use it to predict tomorrow\'s temperature. ' +
          'Whenever you have data and want answers, statistics is the toolkit.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'Statistics can only be used by scientists and mathematicians.', answer: false, explanation: 'Anyone who works with data uses statistics: sports analysts, weather forecasters, doctors, marketers, and students.' },
              { text: 'Statistics helps you find patterns and make decisions from messy, real-world data.', answer: true, explanation: 'That is the core purpose of statistics — summarize data, detect patterns, and support evidence-based decisions.' },
            ],
          },
        },
      },
      {
        title: 'Mean, Median, and Mode',
        content:
          'These three values each try to answer "what is a typical value?" but in different ways. ' +
          'The *mean* (average) adds everything up and divides by the count. For scores 70, 80, 80, ' +
          '90, 100, the mean is (70+80+80+90+100)/5 = 84. The *median* is the middle value when you ' +
          'sort the numbers — here it\'s 80. The *mode* is the most frequent value — also 80. ' +
          'Why have three? Because they disagree when data is lopsided. If one student scored 500 ' +
          '(maybe a different grading system), the mean would jump to 166, but the median would stay ' +
          'at 80. The median resists extreme values, which makes it more useful for things like ' +
          'household income where a few billionaires would skew the mean.',
        diagram: 'MeanMedianModeDiagram',
      },
      {
        title: 'Standard Deviation — How Spread Out?',
        content:
          'Knowing the average is not enough. Two classes can have the same average score of 80, ' +
          'but one class might have everyone between 75 and 85, while the other has scores from 40 ' +
          'to 100. Standard deviation (SD) measures this spread. A small SD means values cluster ' +
          'tightly around the mean. A large SD means they are scattered. Think of throwing darts: ' +
          'a small SD means all darts land near the bullseye; a large SD means they are all over ' +
          'the board. In the first class (75-85), SD might be about 3. In the second (40-100), ' +
          'SD might be 20. This single number tells you how much variation to expect.',
        diagram: 'StdDevDiagram',
      },
      {
        title: 'Histograms — Seeing the Shape of Data',
        content:
          'A histogram groups numbers into bins (ranges) and shows how many values fall into each bin. ' +
          'Imagine sorting 100 exam scores into bins: 0-10, 10-20, ..., 90-100. Then you draw a bar ' +
          'for each bin, where the bar height equals the count. The shape tells a story: a bell shape ' +
          'means most values are near the middle; a shape skewed to the left means most students scored ' +
          'high with a few low outliers; two peaks might mean two distinct groups. Histograms are the ' +
          'first chart a data scientist makes because they reveal the distribution — the overall ' +
          'pattern of where values tend to land.',
        diagram: 'HistogramDiagram',
      },
      {
        title: 'Outliers — The Odd Ones Out',
        content:
          'An outlier is a value that is far from the rest. In heights of 12-year-olds ' +
          '(130-160 cm), a value of 195 cm is suspicious — maybe it was measured wrong, or maybe ' +
          'that student is exceptionally tall. Outliers matter because they can distort your mean ' +
          'and make your conclusions wrong. A common rule: if a value is more than 1.5 times the ' +
          'interquartile range (IQR) beyond the quartiles, flag it as a potential outlier. Always ' +
          'investigate outliers before removing them — sometimes the outlier is the most interesting ' +
          'data point (like discovering a new species).',
        diagram: 'StdDevDiagram',
      },
      {
        title: 'Sampling — You Can\'t Measure Everyone',
        content:
          'If you want to know the average height of all 14-year-olds in India, you cannot measure ' +
          'every single one. Instead, you pick a *sample* — say, 1,000 students from different ' +
          'regions — and measure them. If your sample is chosen fairly (random sampling), the ' +
          'statistics you calculate from it will be close to the true values for the whole population. ' +
          'Bigger samples give more reliable estimates. This is why election polls survey a few ' +
          'thousand people and can still predict results for millions of voters.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'A random sample of 1,000 people can give a reliable estimate for a population of millions.', answer: true, explanation: 'If the sample is chosen randomly, the law of large numbers ensures the sample statistics will approximate the population parameters.' },
              { text: 'A bigger sample always guarantees a perfectly accurate result.', answer: false, explanation: 'Bigger samples improve reliability but never guarantee perfection. Bias in how you select the sample matters more than size.' },
            ],
          },
        },
      },
      {
        title: 'Correlation — When Two Things Move Together',
        content:
          'Correlation measures whether two variables increase or decrease together. It ranges from ' +
          '-1 to +1. A correlation of +1 means they move perfectly together (more study hours = ' +
          'higher scores). A correlation of -1 means one goes up as the other goes down (more ' +
          'screen time = lower sleep hours). A correlation near 0 means no relationship. The critical ' +
          'warning: correlation does not mean causation. Ice cream sales and drowning deaths both ' +
          'increase in summer, but ice cream does not cause drowning — hot weather causes both.',
        diagram: 'CorrelationDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the statistics term to its meaning',
            pairs: [
              ['Mean', 'The sum of all values divided by the count'],
              ['Median', 'The middle value when data is sorted'],
              ['Standard deviation', 'A measure of how spread out values are'],
              ['Outlier', 'A data point far from the rest'],
              ['Correlation', 'How strongly two variables move together (-1 to +1)'],
              ['Sample', 'A subset chosen to represent a larger population'],
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Central Tendency: Mean, Median, Mode',
        content:
          'Calculate the three measures of center and see how they differ when outliers are present.',
        code: `import numpy as np
from scipy import stats

scores = np.array([72, 85, 90, 68, 95, 88, 76, 82, 91, 79])

print("=== Normal data ===")
print(f"Mean:   {np.mean(scores):.1f}")     # 82.6
print(f"Median: {np.median(scores):.1f}")   # 83.5
print(f"Mode:   {stats.mode(scores).mode}") # most frequent value

# Now add an outlier
scores_with_outlier = np.append(scores, 200)
print("\\n=== With outlier (200) ===")
print(f"Mean:   {np.mean(scores_with_outlier):.1f}")   # jumps to 93.3
print(f"Median: {np.median(scores_with_outlier):.1f}") # stays at 85.0
# The median barely moved — that's why it's called "robust"`,
      },
      {
        title: 'Standard Deviation and Variance',
        content:
          'Standard deviation tells you how far values typically are from the mean. Variance is its square.',
        code: `import numpy as np

# Two classes with the same mean but different spread
class_a = np.array([78, 80, 82, 79, 81, 80, 83, 77, 81, 79])
class_b = np.array([55, 95, 60, 100, 70, 90, 65, 98, 75, 92])

print(f"Class A — Mean: {np.mean(class_a):.1f}, SD: {np.std(class_a):.1f}")
# Mean: 80.0, SD: 1.7 (very tight cluster)

print(f"Class B — Mean: {np.mean(class_b):.1f}, SD: {np.std(class_b):.1f}")
# Mean: 80.0, SD: 16.0 (widely spread)

# Variance is SD squared
print(f"\\nClass A variance: {np.var(class_a):.1f}")
print(f"Class B variance: {np.var(class_b):.1f}")

# The 68-95-99.7 rule for bell-shaped data:
# ~68% of values fall within 1 SD of the mean
# ~95% fall within 2 SDs
# ~99.7% fall within 3 SDs`,
      },
      {
        title: 'Histograms and Distribution Shapes',
        content:
          'Visualize how data is distributed using histograms. The shape reveals patterns words cannot.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Generate three different distributions
np.random.seed(42)
normal = np.random.normal(70, 10, 500)       # bell-shaped
skewed = np.random.exponential(20, 500) + 40  # right-skewed
bimodal = np.concatenate([
    np.random.normal(55, 5, 250),
    np.random.normal(85, 5, 250),
])  # two peaks

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

axes[0].hist(normal, bins=25, color="steelblue", edgecolor="black")
axes[0].set_title("Bell-Shaped (Normal)")
axes[0].axvline(np.mean(normal), color="red", linestyle="--", label="Mean")
axes[0].legend()

axes[1].hist(skewed, bins=25, color="coral", edgecolor="black")
axes[1].set_title("Right-Skewed")
axes[1].axvline(np.mean(skewed), color="red", linestyle="--", label="Mean")
axes[1].axvline(np.median(skewed), color="green", linestyle="--", label="Median")
axes[1].legend()

axes[2].hist(bimodal, bins=25, color="mediumpurple", edgecolor="black")
axes[2].set_title("Bimodal (Two Groups)")

plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Detecting Outliers with IQR',
        content:
          'The interquartile range method flags values that are unusually far from the middle 50% of the data.',
        code: `import numpy as np

data = np.array([12, 15, 14, 10, 13, 15, 100, 14, 11, 13, 16, 12])

q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1

lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr

print(f"Q1: {q1}, Q3: {q3}, IQR: {iqr}")
print(f"Fences: [{lower_fence:.1f}, {upper_fence:.1f}]")

outliers = data[(data < lower_fence) | (data > upper_fence)]
clean = data[(data >= lower_fence) & (data <= upper_fence)]

print(f"Outliers: {outliers}")   # [100]
print(f"Clean data: {clean}")

print(f"\\nMean with outlier:    {np.mean(data):.1f}")
print(f"Mean without outlier: {np.mean(clean):.1f}")`,
      },
      {
        title: 'Correlation and Scatter Plots',
        content:
          'Visualize the relationship between two variables and compute the correlation coefficient.',
        code: `import numpy as np
import matplotlib.pyplot as plt

# Study hours vs exam scores for 10 students
hours = np.array([2, 3, 1, 5, 4, 6, 3, 7, 5, 8])
scores = np.array([65, 70, 55, 85, 78, 90, 72, 95, 80, 98])

# Correlation coefficient
r = np.corrcoef(hours, scores)[0, 1]

# Scatter plot with trend line
plt.figure(figsize=(8, 5))
plt.scatter(hours, scores, s=80, color="steelblue", zorder=5)

# Add a best-fit line
m, b = np.polyfit(hours, scores, 1)  # slope, intercept
x_line = np.linspace(0, 9, 100)
plt.plot(x_line, m * x_line + b, "r--", label=f"Trend (r={r:.2f})")

plt.xlabel("Study Hours")
plt.ylabel("Exam Score")
plt.title("Study Hours vs Exam Scores")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print(f"Correlation: {r:.3f}")
print(f"Each extra hour ≈ +{m:.1f} points on the exam")`,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 12. SINE WAVES
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'sine-waves',
    title: 'Sine Waves',
    category: 'math',
    icon: '〰️',
    tagline: 'The building block of all waves',
    relatedStories: ['girl-who-spoke-to-elephants', 'bamboo-flute-of-nagaland', 'bamboo-taught-wind', 'dhol-drum', 'music-dimasa'],

    understand: [
      {
        title: 'The Circle Connection',
        content:
          'Imagine a point moving around a circle at a steady speed, like a seat on a Ferris wheel. ' +
          'If you only watch the seat\'s height as the wheel spins and plot it against time, you get ' +
          'a smooth, repeating S-curve — that\'s a sine wave. The radius of the wheel determines how ' +
          'tall the wave is (amplitude), and the speed of rotation determines how quickly the wave ' +
          'repeats (frequency). Every sine wave is secretly a circle viewed from the side. This is ' +
          'why trigonometry (the math of triangles and circles) is at the heart of wave science.',
        diagram: 'UnitCircleDiagram',
      },
      {
        title: 'Frequency — How Fast It Repeats',
        content:
          'Frequency tells you how many complete cycles happen in one second, measured in Hertz (Hz). ' +
          'A wave at 2 Hz completes two full up-down cycles per second. A guitar\'s low E string ' +
          'vibrates at about 82 Hz; the highest note on a piano is about 4,186 Hz. Your ears can ' +
          'hear frequencies roughly from 20 Hz to 20,000 Hz. Below 20 Hz, you feel vibrations ' +
          'rather than hear them — elephants communicate with infrasound down around 14 Hz. ' +
          'The *period* is the inverse: a 100 Hz wave has a period of 1/100 = 0.01 seconds per cycle.',
        diagram: 'SineWaveDiagram',
      },
      {
        title: 'Amplitude — How Strong the Wave Is',
        content:
          'Amplitude is the height of the wave from the center line to the peak. Think of it as ' +
          'how hard the Ferris wheel pushes the seat away from the middle. A whisper has tiny ' +
          'amplitude; a shout has large amplitude. On a graph, a wave with amplitude 3 swings from ' +
          '+3 to -3. Doubling the amplitude doubles the energy carried by the wave — which is why ' +
          'turning up the volume on a speaker uses more battery. In the formula y = A * sin(2*pi*f*t), ' +
          'A is the amplitude.',
        interactive: {
          type: 'slider',
          props: {
            component: 'FrequencySlider',
            title: 'Adjust amplitude and frequency',
            description: 'Drag the sliders to see how amplitude and frequency change a sine wave.',
          },
        },
      },
      {
        title: 'Phase — Where the Wave Starts',
        content:
          'Phase is the horizontal shift of a wave, measured in radians or degrees. Imagine two ' +
          'people on the same Ferris wheel, but one got on a quarter-turn later. They trace the same ' +
          'path at the same speed, but one is always a quarter-cycle behind — that\'s a 90-degree ' +
          '(pi/2 radian) phase difference. Phase matters when you combine waves: two identical waves ' +
          'perfectly in phase double in strength (constructive interference), but two waves exactly ' +
          'half a cycle apart (180 degrees) cancel each other to zero (destructive interference). ' +
          'Noise-canceling headphones exploit this by generating a wave with opposite phase to the noise.',
        diagram: 'InterferenceDiagram',
      },
      {
        title: 'Harmonics — The Overtone Series',
        content:
          'When a guitar string vibrates, it does not just vibrate at one frequency. It vibrates at ' +
          'its fundamental frequency (say 100 Hz) and also at 200 Hz, 300 Hz, 400 Hz, and so on — ' +
          'these are called harmonics. The fundamental gives the note its pitch; the harmonics give ' +
          'it its *timbre* (tone color). A flute and a violin playing the same note sound different ' +
          'because they have different mixes of harmonics. A pure sine wave has no harmonics at all, ' +
          'which is why it sounds plain and electronic. Real-world sounds are always combinations ' +
          'of many sine waves at harmonic frequencies.',
        diagram: 'MusicalWavesDiagram',
      },
      {
        title: 'Beats — When Close Frequencies Meet',
        content:
          'When two sine waves have slightly different frequencies, they create a pulsing effect ' +
          'called *beats*. Imagine two tuning forks at 440 Hz and 442 Hz played together. Sometimes ' +
          'their peaks align (loud), sometimes their peaks and troughs align (quiet). You hear a ' +
          '"wah-wah-wah" pulsing at 2 Hz — the difference between the two frequencies. Piano tuners ' +
          'use this effect: they adjust a string until the beats disappear, meaning the string matches ' +
          'the reference fork exactly. The beat frequency is always |f1 - f2|.',
        diagram: 'AmplitudeModDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match the sine wave concept to its meaning',
            pairs: [
              ['Frequency', 'Number of complete cycles per second (Hz)'],
              ['Amplitude', 'Height of the wave from center to peak'],
              ['Phase', 'Horizontal shift of the wave, measured in degrees or radians'],
              ['Harmonics', 'Integer multiples of the fundamental frequency'],
              ['Beat frequency', 'The difference between two close frequencies, |f1 - f2|'],
            ],
          },
        },
      },
    ],

    build: [
      {
        title: 'Anatomy of a Sine Wave',
        content:
          'The sine function has three parameters: amplitude (A), frequency (f), and phase (phi). ' +
          'The formula is y = A * sin(2*pi*f*t + phi).',
        code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)  # 1 second of time

# y = A * sin(2π * f * t + φ)
A = 1.0      # amplitude (height of peaks)
f = 3.0      # frequency (3 cycles per second)
phi = 0.0    # phase (horizontal shift in radians)

y = A * np.sin(2 * np.pi * f * t + phi)

plt.figure(figsize=(10, 4))
plt.plot(t, y, "b-", linewidth=2)

# Annotate the key features
plt.annotate("Amplitude", xy=(0.08, 1.0), fontsize=10,
             arrowprops=dict(arrowstyle="->"), xytext=(0.15, 0.7))
plt.annotate("Period = 1/f = 0.33s", xy=(0.0, 0), fontsize=10,
             xytext=(0.35, -0.7),
             arrowprops=dict(arrowstyle="<->"))

plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title(f"Sine wave: A={A}, f={f} Hz, φ={phi}")
plt.axhline(0, color="gray", linewidth=0.5)
plt.grid(True, alpha=0.3)
plt.show()`,
      },
      {
        title: 'Changing Frequency and Amplitude',
        content:
          'See how different values of A and f change the shape of the wave.',
        code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

configs = [
    (1.0, 2, "A=1, f=2 Hz (slow, normal height)"),
    (1.0, 8, "A=1, f=8 Hz (fast, normal height)"),
    (3.0, 2, "A=3, f=2 Hz (slow, tall)"),
    (0.5, 8, "A=0.5, f=8 Hz (fast, short)"),
]

for ax, (A, f, label) in zip(axes.flat, configs):
    y = A * np.sin(2 * np.pi * f * t)
    ax.plot(t, y, linewidth=2)
    ax.set_title(label)
    ax.set_ylim(-3.5, 3.5)
    ax.axhline(0, color="gray", linewidth=0.5)
    ax.grid(True, alpha=0.3)
    ax.set_xlabel("Time (s)")

plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Phase and Superposition',
        content:
          'Phase shifts waves in time. Adding waves (superposition) creates constructive or destructive interference.',
        code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 1, 1000)
f = 5  # Hz

# Three waves with different phase shifts
wave1 = np.sin(2 * np.pi * f * t)
wave2 = np.sin(2 * np.pi * f * t + np.pi / 2)   # 90° shift
wave3 = np.sin(2 * np.pi * f * t + np.pi)        # 180° shift (opposite)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))

# Show individual waves
ax1.plot(t, wave1, label="φ = 0°")
ax1.plot(t, wave2, "--", label="φ = 90°")
ax1.plot(t, wave3, ":", label="φ = 180° (opposite)")
ax1.set_title("Three Phase-Shifted Waves")
ax1.legend()
ax1.grid(True, alpha=0.3)

# Show constructive vs destructive interference
ax2.plot(t, wave1 + wave2, label="0° + 90° (constructive)", linewidth=2)
ax2.plot(t, wave1 + wave3, label="0° + 180° (cancel out!)", linewidth=2)
ax2.set_title("Superposition Results")
ax2.legend()
ax2.grid(True, alpha=0.3)
ax2.set_xlabel("Time (s)")

plt.tight_layout()
plt.show()`,
      },
      {
        title: 'Harmonics — Building Complex Tones',
        content:
          'Add harmonic frequencies together to build richer, more realistic sounds from pure sine waves.',
        code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 0.02, 1000)  # 20 ms
fundamental = 220  # Hz (A3 note)

# Pure sine — just the fundamental
pure = np.sin(2 * np.pi * fundamental * t)

# Add harmonics (each quieter than the last)
rich = (1.0 * np.sin(2 * np.pi * 1 * fundamental * t) +   # 1st harmonic
        0.5 * np.sin(2 * np.pi * 2 * fundamental * t) +   # 2nd harmonic
        0.3 * np.sin(2 * np.pi * 3 * fundamental * t) +   # 3rd
        0.15 * np.sin(2 * np.pi * 4 * fundamental * t) +  # 4th
        0.1 * np.sin(2 * np.pi * 5 * fundamental * t))    # 5th

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))

ax1.plot(t * 1000, pure)
ax1.set_title("Pure Sine Wave (fundamental only)")
ax1.set_ylabel("Amplitude")
ax1.grid(True, alpha=0.3)

ax2.plot(t * 1000, rich, color="darkorange")
ax2.set_title("With 5 Harmonics (richer sound)")
ax2.set_xlabel("Time (ms)")
ax2.set_ylabel("Amplitude")
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
# The rich wave has a more complex shape — that's timbre!`,
      },
      {
        title: 'Beat Frequencies',
        content:
          'When two close frequencies play together, you hear a pulsing rhythm called beats.',
        code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 2, 10000)  # 2 seconds

f1 = 440    # Hz (A4 note)
f2 = 444    # Hz (slightly sharp)

wave1 = np.sin(2 * np.pi * f1 * t)
wave2 = np.sin(2 * np.pi * f2 * t)
combined = wave1 + wave2

# The envelope (what your ear perceives)
beat_freq = abs(f2 - f1)  # 4 Hz
envelope = 2 * np.cos(2 * np.pi * beat_freq / 2 * t)

plt.figure(figsize=(12, 4))
plt.plot(t, combined, alpha=0.5, label="Combined signal")
plt.plot(t, envelope, "r-", linewidth=2, label=f"Beat envelope ({beat_freq} Hz)")
plt.plot(t, -envelope, "r-", linewidth=2)
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.title(f"Beat frequency: |{f1} - {f2}| = {beat_freq} Hz")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
# You'll see 4 pulses per second — the wah-wah-wah sound`,
      },
    ],
  },

  // Variables & Types entry removed — fully covered by the Python entry's
  // "Variables Are Labeled Boxes" (understand) and "Variables and Types" (build) sections.

  // ─────────────────────────────────────────────────────────────
  // 12. GIT & VERSION CONTROL
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'git-version-control',
    title: 'Git & Version Control',
    category: 'language',
    icon: '💻',
    tagline: 'Track every change, collaborate without chaos, and never lose your work again.',

    understand: [
      {
        title: 'What Is Version Control?',
        content:
          'Imagine you are writing an essay and you save a new copy every time you make major changes: ' +
          'essay_v1.docx, essay_v2.docx, essay_final.docx, essay_final_FINAL.docx. Within a week you ' +
          'have a dozen files and no idea which one has the paragraph you deleted yesterday. Version ' +
          'control solves this by keeping a single file but recording every change as a snapshot in time. ' +
          'You can scroll back through history, see exactly what changed, who changed it, and why.\n\n' +
          'This matters enormously when multiple people work on the same project. Without version control, ' +
          'two developers editing the same file will overwrite each other\'s work. With it, the system ' +
          'tracks both sets of changes and helps merge them together. Every professional software team in ' +
          'the world uses version control — it is as fundamental to coding as saving a document is to ' +
          'writing. Git is the most popular version control system by far, created in 2005 by Linus ' +
          'Torvalds (who also created Linux).',
      },
      {
        title: 'Git Basics: init, add, commit, status, log',
        content:
          'Git works in three stages. First, you make changes to files in your *working directory* — this ' +
          'is just your normal folder. Second, you *stage* the changes you want to save using `git add`. ' +
          'Staging is like placing items on a conveyor belt: you choose exactly which changes to include. ' +
          'Third, you *commit* those staged changes with `git commit -m "your message"`, which takes a ' +
          'permanent snapshot.\n\n' +
          'The command `git init` creates a new repository (repo) in your folder — it tells Git to start ' +
          'tracking changes here. `git status` shows you what has changed since the last commit: which ' +
          'files are modified, which are staged, and which are new. `git log` shows the history of all ' +
          'commits, newest first, with the author, date, and message for each. Think of the log as a ' +
          'detailed diary of every save point in your project. These five commands — init, add, commit, ' +
          'status, and log — are the foundation of everything else in Git.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each Git command to what it does',
            pairs: [
              ['git init', 'Create a new repository and start tracking changes'],
              ['git add', 'Stage changes for the next commit'],
              ['git commit', 'Save a permanent snapshot of staged changes'],
              ['git status', 'Show which files have changed since the last commit'],
              ['git log', 'Display the history of all commits'],
            ],
          },
        },
      },
      {
        title: 'Branches: Creating, Switching, and Merging',
        content:
          'A branch is a parallel copy of your project where you can experiment without affecting the main ' +
          'version. Imagine a tree: the trunk is your main code, and each branch grows in its own ' +
          'direction. You might create a branch called "add-dark-mode" to try a new feature. If it works ' +
          'out, you merge the branch back into the trunk. If it doesn\'t, you delete the branch and the ' +
          'main code is untouched.\n\n' +
          'You create a branch with `git branch feature-name` and switch to it with `git checkout feature-name` ' +
          '(or the newer `git switch feature-name`). While on that branch, all your commits only affect ' +
          'that branch. When you are ready, you switch back to the main branch and run `git merge feature-name` ' +
          'to bring the changes in. The default branch is usually called `main` (older repos use `master`). ' +
          'Branches are lightweight in Git — they are just pointers to a commit, not full copies of files — ' +
          'so creating hundreds of branches costs almost nothing. Professional teams create a new branch for ' +
          'every bug fix and every feature, keeping the main branch always stable and deployable.',
        diagram: 'DecisionTreeDiagram',
      },
      {
        title: 'Remote Repositories: push, pull, clone, and GitHub',
        content:
          'So far, everything has been on your own computer. A *remote repository* is a copy of your repo ' +
          'stored on a server — most commonly on GitHub, GitLab, or Bitbucket. This serves two purposes: ' +
          'backup (your code survives even if your laptop dies) and collaboration (others can access the ' +
          'same repo).\n\n' +
          '`git clone URL` downloads a remote repo to your computer, including its full history. ' +
          '`git push` uploads your local commits to the remote. `git pull` downloads new commits from the ' +
          'remote and merges them into your local copy. Think of push and pull like syncing a shared ' +
          'document: push sends your latest edits to the cloud, pull downloads everyone else\'s edits.\n\n' +
          'GitHub is the most popular hosting platform for Git repositories. It adds a web interface where ' +
          'you can browse code, read commit history, file issues (bug reports), and manage pull requests. ' +
          'Over 100 million developers use GitHub, and most open-source projects live there — from Linux ' +
          'to Python to React.',
      },
      {
        title: 'Collaboration Workflow: Pull Requests and Code Review',
        content:
          'In a team, you rarely push directly to the main branch. Instead, you create a branch, make your ' +
          'changes, push that branch to the remote, and open a *pull request* (PR). A pull request is a ' +
          'formal proposal that says "I\'d like to merge these changes into main — please review them." ' +
          'Teammates read your code, leave comments, suggest improvements, and eventually approve the PR. ' +
          'Then the branch gets merged.\n\n' +
          'Sometimes two people edit the same line of the same file on different branches. When you try to ' +
          'merge, Git reports a *merge conflict*: it cannot decide which version to keep, so it marks the ' +
          'conflicting lines and asks you to choose. This sounds scary but is usually straightforward — ' +
          'you open the file, see both versions side by side, pick the correct one (or combine them), and ' +
          'commit the resolution. Code review and pull requests are not just about catching bugs; they ' +
          'spread knowledge across the team so everyone understands the codebase, and they create a written ' +
          'record of *why* changes were made — invaluable when debugging six months later.',
        diagram: 'FlowchartDiagram',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'You should always push your changes directly to the main branch.', answer: false, explanation: 'In professional workflows, you push to a feature branch and open a pull request so teammates can review before merging to main.' },
              { text: 'A merge conflict means Git cannot automatically combine two sets of changes to the same lines.', answer: true, explanation: 'When two branches edit the same line, Git marks the conflict and asks you to resolve it manually.' },
              { text: 'Git stores a complete copy of every file in every branch, using lots of disk space.', answer: false, explanation: 'Git branches are lightweight pointers to commits. Git uses snapshots and compression, so branches cost almost no extra space.' },
              { text: 'Pull requests create a written record of why changes were made, which helps future debugging.', answer: true, explanation: 'The PR description, review comments, and linked issues form a paper trail that is invaluable months later.' },
            ],
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 13. DATABASES & SQL
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'databases-and-sql',
    title: 'Databases & SQL',
    category: 'data-science',
    icon: '📊',
    tagline: 'Store, query, and organize data — the foundation of every app, website, and AI system.',

    understand: [
      {
        title: 'What Is a Database?',
        content:
          'A database is an organized collection of data stored so that it can be easily accessed, searched, ' +
          'and updated. You might wonder: why not just use a spreadsheet or a text file? For small amounts ' +
          'of data, those work fine. But imagine an online store with 10 million products, 50 million ' +
          'customers, and billions of past orders. A spreadsheet would grind to a halt. A database engine ' +
          'is built to handle this scale while keeping queries fast — often answering in milliseconds.\n\n' +
          'Most databases organize data into *tables*. A table looks like a spreadsheet: it has *columns* ' +
          '(the categories of information, like name, email, age) and *rows* (each individual record, like ' +
          'one customer). A "students" table might have columns for roll_number, name, class, and marks. ' +
          'Each student is one row. Tables can relate to each other — a "marks" table can reference the ' +
          '"students" table by roll number — which is why these are called *relational databases*. This ' +
          'structure avoids duplication: you store each student\'s name once, and every table that needs ' +
          'it just points to the right row.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'A database is just a fancy name for a spreadsheet.', answer: false, explanation: 'Databases are purpose-built software that can handle millions of records, enforce data rules, and support many users at once — far beyond what spreadsheets can do.' },
              { text: 'In a relational database, data is organized into tables with rows and columns.', answer: true, explanation: 'Tables (with columns for categories and rows for records) are the fundamental structure of relational databases.' },
            ],
          },
        },
      },
      {
        title: 'SQL Basics: SELECT, FROM, WHERE',
        content:
          'SQL (Structured Query Language, often pronounced "sequel") is the language you use to talk to a ' +
          'relational database. The most common operation is reading data, and the basic pattern is:\n\n' +
          '`SELECT column1, column2 FROM table_name WHERE condition;`\n\n' +
          'For example, `SELECT name, marks FROM students WHERE class = 10;` asks: "Give me the name and ' +
          'marks of every student in class 10." `SELECT *` means "all columns." If you leave out the WHERE ' +
          'clause, you get every row in the table.\n\n' +
          'SQL is declarative — you describe *what* data you want, not *how* to get it. The database engine ' +
          'figures out the fastest way to find it. This is different from languages like Python, where you ' +
          'write step-by-step instructions. SQL was designed in the 1970s and is still the standard today. ' +
          'Almost every app you use — Instagram, Google, Zomato, banking apps — runs SQL queries behind ' +
          'the scenes every time you tap a button.',
      },
      {
        title: 'Filtering and Sorting: ORDER BY, LIMIT, LIKE, AND/OR',
        content:
          'Real-world queries almost always need more than a simple WHERE. `ORDER BY` sorts your results: ' +
          '`SELECT name, marks FROM students ORDER BY marks DESC;` returns students ranked from highest ' +
          'to lowest marks. Add `LIMIT 5` to get only the top five. These two clauses together are how ' +
          'leaderboards and "top 10" lists work in every app.\n\n' +
          '`LIKE` lets you search for patterns in text. `SELECT name FROM students WHERE name LIKE \'A%\';` ' +
          'finds all students whose name starts with "A". The `%` symbol means "anything can follow." ' +
          'You can combine conditions with `AND` and `OR`: `WHERE class = 10 AND marks > 80` finds ' +
          'high-scoring students in class 10, while `WHERE class = 10 OR class = 12` finds students in ' +
          'either class. These operators let you express surprisingly complex questions in a single readable ' +
          'sentence — no loops, no if-statements, just a clear description of the data you want.',
        diagram: 'PostmanSortingDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each SQL clause to its purpose',
            pairs: [
              ['ORDER BY', 'Sort results by a column'],
              ['LIMIT', 'Restrict the number of rows returned'],
              ['LIKE', 'Search for text patterns using wildcards'],
              ['AND', 'Require multiple conditions to be true'],
              ['WHERE', 'Filter rows that match a condition'],
            ],
          },
        },
      },
      {
        title: 'Joins: Combining Tables',
        content:
          'The real power of relational databases comes from *joins* — combining data from two or more tables ' +
          'in a single query. Suppose you have a "students" table (roll_number, name, class) and a "marks" ' +
          'table (roll_number, subject, score). To see each student\'s name alongside their scores, you ' +
          'write:\n\n' +
          '`SELECT students.name, marks.subject, marks.score FROM students JOIN marks ON students.roll_number = marks.roll_number;`\n\n' +
          'The `JOIN ... ON` clause tells the database which column connects the two tables. This is a ' +
          '*one-to-many* relationship: one student has many marks rows (one per subject). Without joins, ' +
          'you would have to repeat the student\'s name, class, and address in every single marks row — ' +
          'wasteful and error-prone.\n\n' +
          'There are several types of joins. An *INNER JOIN* (the default) returns only rows where both ' +
          'tables have a match. A *LEFT JOIN* returns all rows from the left table even if there is no ' +
          'match in the right table — useful for finding students who have not submitted any marks yet. ' +
          'Understanding joins is the key to working with any real database, because real-world data is ' +
          'almost always split across multiple related tables.',
      },
      {
        title: 'Creating and Modifying Data',
        content:
          'Reading data is only half the story. `INSERT INTO students (name, class) VALUES (\'Ananya\', 10);` ' +
          'adds a new row. `UPDATE students SET class = 11 WHERE name = \'Ananya\';` changes existing data. ' +
          '`DELETE FROM students WHERE roll_number = 42;` removes a row. And `CREATE TABLE` defines a brand ' +
          'new table with its columns and types:\n\n' +
          '`CREATE TABLE students (roll_number INTEGER PRIMARY KEY, name TEXT NOT NULL, class INTEGER, marks REAL);`\n\n' +
          'The `PRIMARY KEY` constraint ensures each roll number is unique — the database will refuse to ' +
          'insert a duplicate. `NOT NULL` means the name column must always have a value. These constraints ' +
          'act as safety rails, preventing bad data from entering the system. In real applications, you also ' +
          'define *foreign keys* that link one table to another, so the database enforces the relationships ' +
          'automatically.\n\n' +
          'One critical concept is the *transaction*: a group of operations that either all succeed or all ' +
          'fail. If you are transferring money from one bank account to another, you need the debit and ' +
          'credit to happen together — a crash in between would lose money. Databases guarantee this ' +
          'atomicity, which is why banks, airlines, and hospitals trust them with critical data.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'DELETE FROM students; (with no WHERE clause) will delete every row in the table.', answer: true, explanation: 'Without a WHERE clause, DELETE applies to all rows. This is why production databases have backups and access controls.' },
              { text: 'A PRIMARY KEY column can contain duplicate values.', answer: false, explanation: 'A primary key must be unique for every row — the database will reject any insert that duplicates an existing key.' },
              { text: 'Transactions ensure that a group of database operations either all succeed or all fail.', answer: true, explanation: 'This "all or nothing" property (called atomicity) prevents data corruption during failures.' },
            ],
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 14. APIS & HOW THE WEB WORKS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'apis-and-web',
    title: 'APIs & How the Web Works',
    category: 'language',
    icon: '💻',
    tagline: 'How apps talk to each other — from weather data to social media to your favorite games.',

    understand: [
      {
        title: 'How the Internet Works',
        content:
          'When you type "google.com" into your browser and press Enter, a chain of events happens in ' +
          'milliseconds. First, your computer asks a *DNS server* (like a phone book for the internet) ' +
          'to translate "google.com" into an IP address — a numerical address like 142.250.190.78. Then ' +
          'your browser sends an *HTTP request* to that address, asking for the homepage. Google\'s server ' +
          'receives the request, builds the page, and sends back an *HTTP response* containing HTML, CSS, ' +
          'and JavaScript. Your browser renders all of that into the page you see.\n\n' +
          'This is the *client-server* model: your browser is the client (it asks for things), and Google\'s ' +
          'computer is the server (it provides things). HTTP (HyperText Transfer Protocol) is the language ' +
          'they speak. Every URL has a structure: `https://` means use encrypted HTTP, `www.example.com` is ' +
          'the domain name, and `/about` is the path to a specific page. Understanding this flow — DNS ' +
          'lookup, HTTP request, server processing, HTTP response, browser rendering — is the foundation ' +
          'for understanding everything else about web development and APIs.',
        diagram: 'FlowchartDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each web concept to its role',
            pairs: [
              ['DNS', 'Translates domain names into IP addresses'],
              ['HTTP', 'The protocol browsers and servers use to communicate'],
              ['Client', 'The browser or app that sends requests'],
              ['Server', 'The computer that receives requests and sends responses'],
              ['URL', 'The address that identifies a specific page or resource'],
            ],
          },
        },
      },
      {
        title: 'What Is an API?',
        content:
          'An API (Application Programming Interface) is a way for two pieces of software to talk to each ' +
          'other. The classic analogy is a restaurant: you (the client) sit at a table and want food from ' +
          'the kitchen (the server). You do not walk into the kitchen yourself — that would be messy and ' +
          'dangerous. Instead, a waiter (the API) takes your order, brings it to the kitchen, and returns ' +
          'with your food. The waiter defines the *interface* — you can order anything on the menu, but ' +
          'nothing else.\n\n' +
          'In software, APIs work the same way. When a weather app on your phone shows tomorrow\'s forecast, ' +
          'it does not have its own weather satellites. It sends a request to a weather API (like ' +
          'OpenWeatherMap), which returns the data in a structured format. The app then displays it. APIs ' +
          'let developers build on top of existing services without reinventing them. Google Maps has an ' +
          'API that Uber uses for directions. Stripe has an API that online stores use for payments. ' +
          'Almost every modern app is a patchwork of API calls to different services, all stitched together ' +
          'into a seamless user experience.\n\n' +
          'APIs have rules, documented in their API reference: which URLs (called *endpoints*) you can ' +
          'call, what data you must send, and what data you will get back. Following these rules is like ' +
          'ordering from the menu — you get reliable, predictable results.',
      },
      {
        title: 'REST APIs: GET, POST, PUT, DELETE, and JSON',
        content:
          'REST (Representational State Transfer) is the most common style of API on the web. It uses ' +
          'standard HTTP methods as verbs: *GET* retrieves data (like viewing a profile), *POST* creates ' +
          'new data (like submitting a form), *PUT* updates existing data (like editing your bio), and ' +
          '*DELETE* removes data (like deleting a post). A REST API endpoint looks like a URL: ' +
          '`GET https://api.example.com/students/42` might return the data for student number 42.\n\n' +
          'The data format is almost always *JSON* (JavaScript Object Notation), which looks like this: ' +
          '`{"name": "Ananya", "class": 10, "marks": [85, 92, 78]}`. JSON is human-readable, lightweight, ' +
          'and supported by every programming language. When you call a REST API, you send a request with ' +
          'optional JSON data (for POST/PUT), and you receive a response with a status code (200 means ' +
          'success, 404 means not found, 500 means server error) and a JSON body containing the data.\n\n' +
          'The beauty of REST is its simplicity and universality. Whether the server is written in Python, ' +
          'Java, Go, or Rust, the client does not care — it just sends HTTP requests and reads JSON ' +
          'responses. This separation is why the frontend (what you see) and backend (the server logic) ' +
          'can be built by completely different teams in completely different languages.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each HTTP method to its purpose',
            pairs: [
              ['GET', 'Retrieve data without changing anything'],
              ['POST', 'Create a new resource'],
              ['PUT', 'Update an existing resource'],
              ['DELETE', 'Remove a resource'],
            ],
          },
        },
      },
      {
        title: 'Using APIs in Practice',
        content:
          'Let us walk through a real example. OpenWeatherMap provides a free weather API. To get the ' +
          'current weather in Guwahati, you send a GET request to:\n\n' +
          '`https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid=YOUR_API_KEY`\n\n' +
          'Notice the `appid` parameter — this is your *API key*, a unique token that identifies you. ' +
          'Most APIs require authentication so they can track usage and prevent abuse. You sign up on ' +
          'their website, get a key, and include it in every request. The response comes back as JSON: ' +
          'temperature, humidity, wind speed, weather description, and more. Your app parses this JSON ' +
          'and displays it in a friendly UI.\n\n' +
          'APIs also have *rate limits* — rules about how many requests you can make per minute or per day. ' +
          'A free tier might allow 60 requests per minute; exceeding that returns a 429 ("Too Many ' +
          'Requests") error. This prevents one user from overloading the server. Professional apps handle ' +
          'this by caching responses (storing them temporarily so you do not re-fetch the same data) and ' +
          'implementing retry logic with exponential backoff (wait 1 second, then 2, then 4, etc.).\n\n' +
          'Understanding APIs unlocks an enormous world of data and services. You can pull stock prices, ' +
          'translate text, send SMS messages, generate AI images, and process payments — all by calling ' +
          'the right API with the right parameters. Modern software development is largely about choosing ' +
          'which APIs to use and wiring them together intelligently.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'An API key is used to identify and authenticate the caller making requests.', answer: true, explanation: 'API keys let the service track who is making requests, enforce rate limits, and bill for usage.' },
              { text: 'Rate limits exist to punish free-tier users.', answer: false, explanation: 'Rate limits protect the server from being overwhelmed. They apply to all users, including paying ones, just at different thresholds.' },
              { text: 'You need to know what programming language the server is written in before you can call its API.', answer: false, explanation: 'That is the whole point of APIs — they use standard HTTP and JSON, so the client and server can use completely different languages.' },
            ],
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 15. ALGORITHMS & DATA STRUCTURES
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'algorithms-data-structures',
    title: 'Algorithms & Data Structures',
    category: 'language',
    icon: '💻',
    tagline: 'The recipes and containers of programming — how to organize data and solve problems efficiently.',

    understand: [
      {
        title: 'What Is an Algorithm?',
        content:
          'An algorithm is a step-by-step procedure for solving a problem. You follow algorithms every ' +
          'day without calling them that. A recipe for making tea is an algorithm: boil water, add tea ' +
          'leaves, wait 3 minutes, strain, add milk. Directions to school are an algorithm. The process ' +
          'you use to find a word in a dictionary is an algorithm (and a very efficient one — you do not ' +
          'start at page 1 and read every entry).\n\n' +
          'In computer science, algorithms are written precisely enough for a machine to follow. The ' +
          'interesting part is that there are often many algorithms to solve the same problem, and they ' +
          'can differ enormously in speed. Searching for a name in an unsorted list of 1 million entries ' +
          'might take 1 million steps with one algorithm and only 20 steps with another. Choosing the ' +
          'right algorithm is often the difference between software that feels instant and software that ' +
          'freezes for minutes. That is why algorithms are a core subject in computer science — they are ' +
          'the recipes that determine how fast and how well your program works.',
        diagram: 'FlowchartDiagram',
      },
      {
        title: 'Arrays and Lists: Storing Ordered Data',
        content:
          'Before you can run algorithms on data, you need a way to organize that data. The simplest ' +
          'structure is an *array* (called a *list* in Python): an ordered sequence of elements, each ' +
          'identified by its position (called an *index*). The array `[25, 18, 42, 7, 33]` stores five ' +
          'numbers. The first element is at index 0 (not 1 — most programming languages count from zero), ' +
          'so `arr[0]` is 25 and `arr[3]` is 7.\n\n' +
          'Arrays are fast at accessing any element by index — it takes the same time whether the array ' +
          'has 10 elements or 10 million. But inserting an element in the middle is slow because every ' +
          'element after it must shift over to make room. Other data structures solve this: a *linked list* ' +
          'makes insertion fast but access slow, a *hash map* (dictionary in Python) gives instant lookup ' +
          'by key, and a *stack* enforces last-in-first-out order (like a stack of plates). Choosing the ' +
          'right data structure for the job is just as important as choosing the right algorithm — they ' +
          'go hand in hand.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each data structure to its strength',
            pairs: [
              ['Array / List', 'Fast access by index position'],
              ['Linked List', 'Fast insertion and deletion in the middle'],
              ['Hash Map / Dictionary', 'Instant lookup by key'],
              ['Stack', 'Last-in, first-out order (like undo history)'],
              ['Queue', 'First-in, first-out order (like a waiting line)'],
            ],
          },
        },
      },
      {
        title: 'Searching: Linear vs Binary Search',
        content:
          'Suppose you have a list of 1,000 student names and need to find "Priya." The simplest approach ' +
          'is *linear search*: start at the beginning and check each name one by one. On average, you will ' +
          'check 500 names before finding Priya, and in the worst case, all 1,000. This is fine for small ' +
          'lists but painfully slow for large ones.\n\n' +
          'If the list is *sorted alphabetically*, you can do far better with *binary search*. Open the ' +
          'list to the middle — say it shows "Kavita." Since "Priya" comes after "Kavita" alphabetically, ' +
          'you ignore the entire first half and look at the middle of the remaining half. Each step ' +
          'eliminates half the remaining options. For 1,000 names, binary search needs at most 10 checks ' +
          '(because 2^10 = 1,024). For 1 million names, it needs only 20 checks. This is the same ' +
          'strategy you instinctively use with a physical dictionary — you never start from page 1.\n\n' +
          'The catch is that binary search requires sorted data. If the data changes frequently, keeping ' +
          'it sorted has its own cost. This is a recurring theme in computer science: every optimization ' +
          'has a trade-off. Linear search works on any list (sorted or not) and needs no preparation. ' +
          'Binary search is vastly faster but demands sorted input.',
      },
      {
        title: 'Sorting: Bubble Sort and Merge Sort',
        content:
          'Sorting data is one of the most common tasks in computing — search engines rank results, ' +
          'spreadsheets sort columns, and leaderboards order by score. *Bubble sort* is the simplest ' +
          'sorting algorithm: compare adjacent pairs and swap them if they are in the wrong order, then ' +
          'repeat until no swaps are needed. It is easy to understand but very slow for large lists — ' +
          'sorting 10,000 items takes roughly 100 million comparisons.\n\n' +
          '*Merge sort* uses a clever divide-and-conquer strategy. Split the list in half, sort each half ' +
          '(by splitting again, recursively), then merge the two sorted halves together. Merging two ' +
          'sorted lists is easy: compare the first element of each and take the smaller one, repeat. ' +
          'Merge sort handles 10,000 items in roughly 130,000 comparisons — nearly 1,000 times faster ' +
          'than bubble sort. The difference becomes even more dramatic as data grows.\n\n' +
          'There are dozens of sorting algorithms, each with different strengths. *Quick sort* is fast ' +
          'on average and uses less memory than merge sort. *Counting sort* is blazingly fast when values ' +
          'are small integers. Python\'s built-in `sort()` uses *Timsort*, a hybrid algorithm designed ' +
          'for real-world data. The key insight is not to memorize every algorithm but to understand that ' +
          'different approaches have wildly different performance characteristics.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'Bubble sort is the fastest general-purpose sorting algorithm.', answer: false, explanation: 'Bubble sort is one of the slowest. It is used for teaching, not for real applications. Merge sort, quick sort, and Timsort are far faster.' },
              { text: 'Merge sort works by repeatedly splitting the list in half, sorting each half, and merging them back together.', answer: true, explanation: 'This divide-and-conquer approach is what makes merge sort efficient — each split halves the problem size.' },
              { text: 'Python\'s built-in sort() function uses an algorithm called Timsort.', answer: true, explanation: 'Timsort was invented by Tim Peters in 2002 specifically for Python. It combines merge sort and insertion sort for excellent real-world performance.' },
            ],
          },
        },
      },
      {
        title: 'Big O Notation: Why Speed Matters',
        content:
          'When computer scientists compare algorithms, they use *Big O notation* to describe how the ' +
          'running time grows as the input size increases. It ignores constants and focuses on the shape ' +
          'of the growth curve. The most common classes are:\n\n' +
          '- *O(1)* — constant time. No matter how big the input, it takes the same time. Example: ' +
          'accessing an array element by index.\n' +
          '- *O(log n)* — logarithmic time. Doubling the input adds only one extra step. Example: binary ' +
          'search.\n' +
          '- *O(n)* — linear time. Double the input, double the time. Example: linear search.\n' +
          '- *O(n log n)* — the sweet spot for sorting. Example: merge sort.\n' +
          '- *O(n²)* — quadratic time. Double the input, quadruple the time. Example: bubble sort.\n\n' +
          'To make this concrete: for a list of 1 million items, an O(n) algorithm takes about 1 million ' +
          'steps, an O(n log n) algorithm takes about 20 million steps, and an O(n²) algorithm takes ' +
          '1 trillion steps. At 1 billion operations per second, that is 1 millisecond vs 20 milliseconds ' +
          'vs 16 minutes. The gap only widens with more data. This is why choosing the right algorithm ' +
          'matters — it is not just academic; it determines whether your program finishes in the blink ' +
          'of an eye or never finishes at all.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 16. CYBERSECURITY BASICS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'cybersecurity-basics',
    title: 'Cybersecurity Basics',
    category: 'electronics',
    icon: '⚙️',
    tagline: 'Passwords, encryption, and staying safe online — the digital self-defense every student needs.',

    understand: [
      {
        title: 'Passwords and Authentication',
        content:
          'Your password is the front door to your digital life — email, social media, bank accounts, ' +
          'school portals. Yet the most commonly used passwords worldwide are still "123456" and ' +
          '"password." These can be cracked in less than a second by a computer trying billions of ' +
          'combinations. A strong password is long (at least 12 characters), unpredictable, and unique ' +
          'to each account. A passphrase like "mango-bicycle-monsoon-telescope" is both strong and ' +
          'memorable because its length makes it astronomically hard to guess.\n\n' +
          'But even the best password can be stolen through a data breach (when hackers steal a company\'s ' +
          'database of passwords). That is why *two-factor authentication* (2FA) is essential. With 2FA, ' +
          'logging in requires something you *know* (your password) plus something you *have* (a code ' +
          'from your phone or a hardware key). Even if someone steals your password, they cannot get in ' +
          'without the second factor.\n\n' +
          'A *password manager* (like Bitwarden or 1Password) generates and stores a unique, random ' +
          'password for every account. You remember one master password; the manager handles the rest. ' +
          'This eliminates the temptation to reuse passwords — which is dangerous because if one site ' +
          'gets breached, attackers try that same email-password combination on every other site. Using ' +
          'a password manager with 2FA enabled is the single most impactful thing you can do for your ' +
          'digital security.',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each security concept to its description',
            pairs: [
              ['Two-factor authentication', 'Requires both a password and a second verification step'],
              ['Password manager', 'Generates and stores unique passwords for every account'],
              ['Passphrase', 'A long, memorable password made of multiple words'],
              ['Data breach', 'When hackers steal a company\'s database of user credentials'],
              ['Password reuse', 'Using the same password across multiple sites (dangerous)'],
            ],
          },
        },
      },
      {
        title: 'Encryption: Keeping Secrets Secret',
        content:
          'Encryption transforms readable data (called *plaintext*) into scrambled gibberish ' +
          '(*ciphertext*) that only someone with the right key can unscramble. The simplest historical ' +
          'example is the *Caesar cipher*: shift every letter by a fixed number. With a shift of 3, ' +
          '"HELLO" becomes "KHOOR." This is trivially easy to break today, but the principle is the ' +
          'same as modern encryption — just with vastly more complex math.\n\n' +
          '*Symmetric encryption* uses the same key to encrypt and decrypt. It is fast and used for ' +
          'large data, but you need a way to share the key securely. *Asymmetric encryption* (public-key ' +
          'cryptography) uses a pair of keys: a public key that anyone can use to encrypt a message, and ' +
          'a private key that only you have to decrypt it. Imagine a mailbox with a slot — anyone can ' +
          'drop a letter in (public key), but only you have the key to open it (private key).\n\n' +
          'When you visit a website with "https://" in the URL, your browser and the server perform a ' +
          'handshake using asymmetric encryption to agree on a shared symmetric key, then use that fast ' +
          'symmetric key for the rest of the session. This is why HTTPS is so important: without it, ' +
          'anyone on the same network (like public WiFi) can read everything you send and receive — ' +
          'passwords, messages, credit card numbers, everything. Look for the padlock icon in your ' +
          'browser to confirm a site uses HTTPS.',
      },
      {
        title: 'Common Threats: Phishing, Malware, and Social Engineering',
        content:
          '*Phishing* is the most common cyberattack, and it targets humans, not computers. You receive ' +
          'an email or message that looks legitimate — perhaps from your bank, school, or a popular ' +
          'service — asking you to click a link and enter your login credentials. The link leads to a ' +
          'fake website that looks identical to the real one. Once you type your password, the attacker ' +
          'has it. Phishing works because it exploits trust and urgency ("Your account will be locked ' +
          'in 24 hours!"). Always check the actual URL before entering credentials, and be suspicious ' +
          'of any message that pressures you to act immediately.\n\n' +
          '*Malware* (malicious software) includes viruses, ransomware, and spyware. Ransomware encrypts ' +
          'all your files and demands payment to unlock them — hospitals and city governments have been ' +
          'paralyzed by ransomware attacks. Malware usually enters through email attachments, pirated ' +
          'software, or compromised websites. Keeping your operating system and apps updated is one of ' +
          'the best defenses, because updates patch the security holes that malware exploits.\n\n' +
          '*Social engineering* is the broader category: manipulating people into giving up confidential ' +
          'information. It might be a phone call from someone pretending to be IT support asking for your ' +
          'password, or a USB drive labeled "Employee Salaries" left in a parking lot (curiosity makes ' +
          'people plug it in, and it installs malware). The common thread is that attackers exploit human ' +
          'psychology — trust, fear, curiosity, helpfulness — rather than technical vulnerabilities.',
        diagram: 'FlowchartDiagram',
        interactive: {
          type: 'matching',
          props: {
            title: 'Match each threat to the correct defense',
            pairs: [
              ['Phishing email', 'Check the actual URL before clicking or entering credentials'],
              ['Ransomware', 'Keep regular backups and update your software'],
              ['Social engineering call', 'Verify the caller\'s identity through an official channel'],
              ['Malware from downloads', 'Only install software from trusted, official sources'],
            ],
          },
        },
      },
      {
        title: 'Staying Safe Online',
        content:
          'Public WiFi at cafes, airports, and hotels is convenient but risky. On an unsecured network, ' +
          'anyone nearby can potentially intercept your traffic. If the site does not use HTTPS, they can ' +
          'read everything. Even with HTTPS, attackers can see which websites you visit. A *VPN* (Virtual ' +
          'Private Network) encrypts all your traffic between your device and the VPN server, creating a ' +
          'secure tunnel even on untrusted networks. If you regularly use public WiFi, a reputable VPN ' +
          'is a worthwhile investment.\n\n' +
          'Software updates are not just about new features — they often fix security vulnerabilities. ' +
          'When a company discovers a flaw, they release a patch. Attackers know this too, and they race ' +
          'to exploit the flaw before people update. Delaying updates is like leaving your door unlocked ' +
          'after the locksmith told you the lock is broken. Enable automatic updates on your phone, ' +
          'computer, and apps.\n\n' +
          'Finally, be thoughtful about your *privacy settings*. Social media platforms default to sharing ' +
          'as much as possible — your location, your contacts, your browsing habits — because that data ' +
          'is valuable for advertising. Review the privacy settings on every app and platform you use. ' +
          'Turn off location sharing unless an app genuinely needs it. Limit who can see your posts and ' +
          'profile information. Think of personal data as currency: do not hand it out for free unless ' +
          'you understand the trade-off.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'Public WiFi is completely safe as long as you have a strong password on your account.', answer: false, explanation: 'A strong password protects your account, but on public WiFi, unencrypted traffic can still be intercepted. Use HTTPS and a VPN for protection.' },
              { text: 'Software updates often contain important security patches, not just new features.', answer: true, explanation: 'Many updates fix vulnerabilities that attackers are actively trying to exploit. Delaying updates leaves you exposed.' },
              { text: 'A VPN encrypts your internet traffic, protecting it even on untrusted networks.', answer: true, explanation: 'A VPN creates an encrypted tunnel between your device and the VPN server, preventing eavesdropping on the local network.' },
              { text: 'If a website has a padlock icon in the browser, it is guaranteed to be trustworthy and safe.', answer: false, explanation: 'The padlock means the connection is encrypted (HTTPS), but it does not verify the site\'s trustworthiness. Phishing sites can have HTTPS too.' },
            ],
          },
        },
      },
    ],
  },
];
// cache-bust 1774467249
