import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'python',
  title: 'Python',
  category: 'language',
  icon: '🐍',
  tagline: 'The friendly language that reads like English',
  relatedStories: ['girl-who-spoke-to-elephants', 'dragonfly-and-the-paddy-field', 'why-the-muga-silk-is-golden', 'boy-who-talked-to-clouds'],

  understand: [
    {
      title: 'What Is a Program?',
      beginnerContent:
        'A program is a set of instructions that tells a computer what to do, step by step. ' +
        'Think of it like a recipe: ingredients (data) and steps (instructions), and the computer ' +
        'follows them in order. A simple recipe has three moves: take something in (eat the list ' +
        'of ingredients), do something with it (chop, mix, cook), then give back a result ' +
        '(the finished dish). Every program, from a calculator to a self-driving car, does the ' +
        'same three things: **input → processing → output**. That\'s it. Everything else is detail.',
      intermediateContent:
        'Zoom in on those three moves. Consider a program to calculate elephant BMI:\n\n' +
        '```python\nweight = float(input("Weight in kg: "))   # INPUT\nheight = float(input("Height in m: "))    # INPUT\nbmi = weight / height**2                  # PROCESSING\nprint(f"BMI: {bmi:.1f}")                  # OUTPUT\n```\n\n' +
        'Four lines. Two inputs captured into `weight` and `height`. One line of processing (the division). One line of output. Every program you\'ll ever write is this pattern, scaled up. A web browser? Input is keystrokes and mouse clicks; processing is rendering HTML; output is pixels on the screen. A neural network? Input is training data; processing is millions of matrix multiplications; output is a prediction. **The variables between steps (like `weight`, `height`, `bmi`) are the program\'s temporary memory — the cook\'s bowls and plates between recipe steps.**',
      advancedContent:
        'Beneath your recipe-like Python code, the computer doesn\'t see words. It sees binary: sequences of 1s and 0s called **machine code**, loaded into memory, one instruction at a time. The CPU executes these with the **fetch-decode-execute cycle**: fetch the next instruction from memory, decode what it means (ADD? MOVE? COMPARE?), execute it. Your quad-core laptop runs this cycle **billions of times per second**, per core.\n\n' +
        'Python adds two layers of translation. When you run `python script.py`: (1) the Python interpreter compiles your source into **bytecode** (stored in `.pyc` files — portable, lower-level but not machine code yet); (2) the **Python Virtual Machine (PVM)** reads that bytecode one instruction at a time and runs it. This interpretation step is why Python is slower than compiled languages like C or Rust — for every single operation in your code, the PVM is doing extra lookup work. But it\'s also why Python feels so fast to *develop* in: you skip the multi-minute compile step and run instantly. **Just-in-time (JIT) compilers** like PyPy get the best of both: watch the bytecode, notice which functions run often, compile those to machine code on the fly. 10-100× speedups on compute-heavy workloads.',
    },
    {
      title: 'How Computers Follow Instructions',
      beginnerContent:
        'Computers are ridiculously fast but completely literal. Tell a human "go buy milk" and ' +
        'they figure out the details — which shop, how much, which brand. A computer can\'t do ' +
        'that. It needs every micro-step: stand up, turn left, walk 12 steps, open the door, look ' +
        'for the word "MILK"... A program is just that list, written down. Python is special because ' +
        'you can write these instructions in words that look almost like English — `if temperature > 35: warn("hot")` — and Python handles translating it into the zillions of tiny steps the computer needs. ' +
        'You focus on *what* you want; Python handles *how*.',
      intermediateContent:
        'So what does "literal" actually look like when Python runs your code? **It runs top to bottom, one line at a time, exactly as written** — no jumping ahead, no guessing what you meant. Walk through this:\n\n' +
        '```python\nx = 5          # 1\ny = x + 3      # 2\nx = y * 2      # 3\nprint(x, y)    # 4\n```\n\n' +
        'Line 1: `x` is 5. Line 2: Python looks up `x` (finds 5), adds 3, stores the result in `y`. Now `y` is 8. Line 3: Python looks up `y` (finds 8), multiplies by 2, stores in `x`. **`x` is now 16. But `y` is still 8.** Line 4 prints: `16 8`.\n\n' +
        'A common confusion: "but didn\'t I change x in line 3? Doesn\'t that update y, which depended on x?" No. Python doesn\'t remember where values came from. Line 2 grabbed the value 5 out of `x` and used it once. After that, `y` has no connection to `x`. **Assignments always evaluate the right side completely first, THEN assign to the left.** This is the rule — there\'s no magic "oh I see what you meant."',
      advancedContent:
        'If Python follows your instructions literally, what *is* a variable to Python? Not a box containing a value — a **name that points to an object in memory**. This is called **reference semantics**, and it has a surprising consequence:\n\n' +
        '```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)    # [1, 2, 3, 4]  ← a changed too!\n```\n\n' +
        'Why? Because `b = a` didn\'t copy the list. It made `b` point to the *same list object* as `a`. One object; two names. Modify through either name and the change is visible from both.\n\n' +
        'This matters because Python has two kinds of objects: **mutable** (lists, dicts, sets — you can modify them in place) and **immutable** (ints, strings, tuples — you can\'t). With immutables, the trap doesn\'t arise, because there\'s no "modify in place" to share. With mutables, you need `b = a.copy()` or `b = a[:]` to get an independent copy.\n\n' +
        'Python also uses **dynamic typing** — a variable can hold an int one moment and a string the next. The type is attached to the *value*, not the variable. Combined with reference semantics, this means Python pushes responsibility onto the programmer: you\'re the one who needs to know whether you\'re sharing a reference or copying. The language trusts you — which is freeing, and also where most subtle Python bugs come from.',
    },
    {
      title: 'Variables Are Labeled Boxes',
      beginnerContent:
        'Watch the program step through in the diagram above. Each line runs in order; the boxes ' +
        'on the right fill in as variables get assigned. When line 3 reassigns `x`, notice that `y` ' +
        'stays put — the boxes are independent once they\'re set.\n\n' +
        'A variable is a named container that holds a value. Imagine a row of boxes with labels ' +
        'on the front. One is labeled `name` and holds the text `"Priya"`. Another is labeled ' +
        '`age` and holds the number `14`. You can look inside a box, change what\'s in it, or use ' +
        'its contents in a calculation. That\'s the whole idea — a labeled box the computer ' +
        'remembers for you.\n\n' +
        'In Python, you make one like this: `age = 14`. Read it: "age is 14." Python creates the ' +
        'box, puts 14 inside, and sticks the label `age` on it. From now on, wherever you write ' +
        '`age` in your code, Python looks up the box and reads the value.',
      intermediateContent:
        'Good variable names make code readable. The box analogy is only useful if the label ' +
        'actually tells you what\'s inside. Python conventions:\n\n' +
        '- **`snake_case`** for regular variables and functions: `elephant_weight`, `calculate_bmi`\n' +
        '- **`UPPER_CASE`** for constants — things that never change: `MAX_SPEED = 299_792_458`\n' +
        '- **`PascalCase`** for classes (you\'ll meet these later): `ElephantTracker`\n\n' +
        'Names must start with a letter or underscore, can\'t contain spaces or special characters, ' +
        'and can\'t be Python keywords (`if`, `for`, `class`, etc.). `1st_name` is illegal; ' +
        '`first_name` is fine.\n\n' +
        'Python optionally lets you **annotate** a variable with its expected type: ' +
        '`weight: float = 4500.0` says "this box is supposed to hold a decimal number." Python ' +
        'doesn\'t enforce this at runtime, but tools like `mypy` check it statically and catch ' +
        'bugs like assigning a string to a box you\'d declared as a number. The label isn\'t just a ' +
        'name — it can tell you what shape of thing lives inside.',
      advancedContent:
        'Here\'s where the "labeled box" analogy breaks down. In Python, a variable isn\'t really a ' +
        'box. It\'s a **name that points to an object in memory**. The object lives somewhere in ' +
        'the heap; the variable is just a label hanging off it. Surprising consequences follow:\n\n' +
        '```python\na = 42\nprint(id(a))   # e.g. 140234567890 — the memory address of the object 42\n```\n\n' +
        'Python **interns** small immutable objects for efficiency. Integers from -5 to 256 are ' +
        'pre-allocated once at startup. So:\n\n' +
        '```python\na = 256\nb = 256\nprint(a is b)   # True — both names point to the SAME object\n\na = 257\nb = 257\nprint(a is b)   # False (usually) — separate objects with equal value\n```\n\n' +
        'The `is` operator checks **identity** (same object in memory). The `==` operator checks ' +
        '**equality** (same value). For small integers they happen to agree; for larger values or ' +
        'mutable objects they often don\'t. Most bugs from confusing these come from the habit of ' +
        'using `is` when you meant `==`. Rule of thumb: **use `==` for values, use `is` only for ' +
        '`None`, `True`, `False`** (where there\'s only one instance ever).\n\n' +
        'When the last name pointing to an object disappears, Python\'s **garbage collector** ' +
        'reclaims the memory. No manual allocation, no manual freeing — one of the reasons Python ' +
        'is easy to write and slightly slower to run than languages where you manage memory by hand.',
      diagram: 'VariablesDiagram',
    },
    {
      title: 'Making Decisions (If / Else)',
      beginnerContent:
        'Programs often need to choose between actions. A fork in a trail: if it\'s raining, take ' +
        'the sheltered path; otherwise, take the scenic route. In Python:\n\n' +
        '```python\nif temperature > 35:\n    print("Heat alert — stay hydrated")\nelse:\n    print("Temperature is fine")\n```\n\n' +
        'The computer checks the condition, picks one branch, runs it, skips the other. ' +
        'For more than two possibilities, chain with `elif` (short for "else if"):\n\n' +
        '```python\nif temperature > 35:\n    print("Hot")\nelif temperature > 25:\n    print("Warm")\nelif temperature > 15:\n    print("Cool")\nelse:\n    print("Cold")\n```\n\n' +
        'Only **one** branch runs — the first one whose condition is true. Everything else is ' +
        'skipped. That\'s all if/elif/else is: a ladder of conditions, and the first true rung wins.',
      intermediateContent:
        'The condition inside `if` doesn\'t have to be one comparison. Python lets you combine ' +
        'conditions for more expressive decisions:\n\n' +
        '- **Chained comparisons:** `if 18 <= age < 65:` reads like math and means exactly that — age is at least 18 AND strictly less than 65.\n' +
        '- **`and`** — both must be true: `if is_raining and has_umbrella:`\n' +
        '- **`or`** — at least one must be true: `if is_holiday or is_weekend:`\n' +
        '- **`not`** — flips true and false: `if not logged_in:`\n\n' +
        'Python evaluates these with a clever shortcut called **short-circuit evaluation**. In ' +
        '`if x != 0 and 10/x > 2:`, Python checks `x != 0` first. If x IS zero, Python stops right ' +
        'there — it never tries to divide by zero, even though the division is written in the code. ' +
        'Same with `or`: if the first part is true, the second part is never evaluated.\n\n' +
        'And if you just need a quick one-line choice, Python has a **ternary expression**:\n\n' +
        '```python\nresult = "adult" if age >= 18 else "minor"\n```\n\n' +
        'One last subtlety: Python\'s `if` doesn\'t only take True/False. It has a concept of ' +
        '**truthiness** — `0`, `""` (empty string), `[]` (empty list), `{}` (empty dict), `None`, ' +
        '`False` are all "falsy." Everything else is "truthy." So `if my_list:` checks "is the list ' +
        'non-empty?" — idiomatic and readable once you\'re used to it.',
      advancedContent:
        'For decision trees that are more complex than a handful of `elif` branches, Python 3.10 ' +
        'introduced **structural pattern matching** with `match/case`. Instead of comparing ' +
        'values, you match *shapes*:\n\n' +
        '```python\nmatch command:\n    case "quit":\n        exit()\n    case ["move", x, y]:\n        move_to(int(x), int(y))\n    case {"type": "click", "x": x, "y": y}:\n        handle_click(x, y)\n    case _:\n        print("unknown command")\n```\n\n' +
        'This isn\'t just a prettier switch statement. Each `case` can **destructure** lists, ' +
        'dicts, tuples, even custom classes — pulling named values out of the matched shape and ' +
        'binding them to variables in one step. The `_` is a wildcard that matches anything.\n\n' +
        '**Guard clauses** add conditions to a pattern:\n\n' +
        '```python\nmatch point:\n    case (x, y) if x == y:\n        print("on the diagonal")\n    case (x, y) if x * y < 0:\n        print("one axis is negative")\n```\n\n' +
        'Python compiles match statements into efficient decision trees — often faster than the ' +
        'equivalent `if/elif` chain when there are many cases. This pattern-matching style came ' +
        'to Python from functional languages (Haskell, OCaml, Erlang) where it\'s the primary ' +
        'control flow. If you find yourself writing a 10-branch `elif` chain that all dispatches ' +
        'on the shape of some data, `match` is almost always the cleaner choice.',
    },
    {
      title: 'Repeating Things (Loops)',
      beginnerContent:
        'Loops let you repeat an action without writing it out every time. Imagine you have ' +
        '100 exam papers to stamp "RECEIVED". Instead of writing the stamping instruction 100 ' +
        'times, you say "for each paper in the stack, stamp it". Python\'s `for` loop does ' +
        'exactly this. A `while` loop keeps going until a condition changes — like stirring a ' +
        'pot *while* the sauce is still lumpy.',
      intermediateContent:
        'Loop patterns to master: **accumulator** (`total = 0; for x in data: total += x`), **counter** (`count = 0; for x in data: if x > threshold: count += 1`), **search** (`for x in data: if condition: result = x; break`), **transform** (`new = [f(x) for x in data]`), **filter** (`kept = [x for x in data if condition]`). Enumerate gives index + value: `for i, name in enumerate(animals): print(f"{i}: {name}")`. Zip pairs elements: `for name, weight in zip(names, weights): print(f"{name}: {weight}kg")`.',
      advancedContent:
        'Generator expressions produce values lazily (one at a time, without storing the entire sequence in memory): `sum(x**2 for x in range(1_000_000))` uses constant memory regardless of the range size, while `sum([x**2 for x in range(1_000_000)])` creates a million-element list first. The `yield` keyword creates generator functions: `def fibonacci(): a, b = 0, 1; while True: yield a; a, b = b, a + b`. Iterators and generators implement the **iterator protocol** (`__iter__` and `__next__` methods) — the same protocol that `for` loops use internally. Understanding generators is essential for processing large datasets that do not fit in memory.',
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
      beginnerContent:
        'A computer reads your program from top to bottom, one line at a time, like reading a ' +
        'book. It finishes the current line completely before moving to the next. This is called ' +
        '**sequential execution**.\n\n' +
        '```python\nmood = "calm"      # 1. store the word\nprint(mood)        # 2. print it\n```\n\n' +
        'Flip the order:\n\n' +
        '```python\nprint(mood)        # ERROR: mood isn\'t defined yet\nmood = "calm"\n```\n\n' +
        'Python explodes with a `NameError` on line 1 because it hasn\'t seen `mood` yet. Line 2 ' +
        'never runs — Python halts at the first error. **Order matters in every program.** Step ' +
        'must happen before the step that depends on it. A camera must capture a photo *before* ' +
        'a classifier can analyze it. A classifier must produce a result *before* an alert can be ' +
        'sent. Programs are recipes; recipes have an order.',
      intermediateContent:
        'Sequential execution gets more interesting when functions enter the picture. When Python ' +
        'hits a function call, it doesn\'t just "move to the next line" — it pauses the current ' +
        'line, jumps into the function, runs it to completion, then comes back to the paused line ' +
        'with the function\'s return value. To keep track, Python uses a structure called the ' +
        '**call stack**.\n\n' +
        '```python\ndef analyze(data):\n    return sorted(data)[0]   # calls sorted(), returns minimum\n\ndef main():\n    result = analyze([3, 1, 2])\n    print(result)\n\nmain()\n```\n\n' +
        'Walk through it. Python reads `main()` — pushes `main` onto the stack. Inside main, ' +
        '`analyze([3, 1, 2])` is called — `analyze` goes on top. Inside analyze, `sorted(data)` ' +
        'runs — `sorted` goes on top. `sorted` finishes, returns `[1, 2, 3]`, pops off. Back in ' +
        'analyze: `[0]` gets the first element, returns `1`. Analyze pops off. Back in main: ' +
        'prints `1`. Main pops off. Done.\n\n' +
        'When something goes wrong, Python prints the **traceback** — the state of the stack at ' +
        'the moment of the error. **Read tracebacks bottom-to-top**: the last line is where the ' +
        'error actually happened; the lines above show who called who to get there. This is the ' +
        'single most valuable debugging skill — most errors are obvious once you read the traceback ' +
        'calmly. And `RecursionError: maximum recursion depth exceeded` means the stack grew past ' +
        'Python\'s limit (1,000 frames by default) — almost always a recursive function missing ' +
        'its base case.',
      advancedContent:
        'Sequential execution is simple — but sometimes you need the program to do more than one ' +
        'thing at a time. Download 100 web pages without waiting for each one to finish sequentially. ' +
        'Process video frames while also reading audio. Keep a UI responsive while a long calculation ' +
        'runs. These need **concurrency**, and Python gives you three models:\n\n' +
        '**1. `threading`** — multiple threads, each running their own sequence. But Python has a ' +
        '**Global Interpreter Lock (GIL)** that ensures only one thread executes Python bytecode at ' +
        'a time. So threading doesn\'t speed up CPU-bound work on a multi-core machine — but it *does* ' +
        'help with I/O-bound work (downloads, file reads), because the GIL is released while a thread ' +
        'waits on I/O.\n\n' +
        '**2. `multiprocessing`** — spawn separate Python processes, each with its own GIL. Real ' +
        'parallelism on multi-core CPUs. Use this for CPU-bound work (image processing, ML training).\n\n' +
        '**3. `asyncio`** — cooperative multitasking in a single thread. Functions marked `async` ' +
        'can `await` slow operations, and while they wait, the event loop runs other tasks:\n\n' +
        '```python\nasync def fetch(url):\n    response = await session.get(url)\n    return response.text()\n```\n\n' +
        'One thread handles thousands of simultaneous network connections by interleaving them ' +
        'whenever one is waiting on I/O. No GIL fight — just one thread, taking turns efficiently.\n\n' +
        '**The rule of thumb:** CPU-bound work → multiprocessing. I/O-bound work → asyncio or ' +
        'threading. If in doubt, start sequential — only reach for concurrency when you actually ' +
        'have a bottleneck. Concurrent code is dramatically harder to reason about.',
    },
    {
      title: 'Debugging — Finding and Fixing Mistakes',
      beginnerContent:
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
      intermediateContent:
        'Beyond print debugging, Python offers `pdb` (Python Debugger): insert `breakpoint()` in your code to pause execution and inspect variables interactively. Commands: `n` (next line), `s` (step into function), `c` (continue), `p variable` (print value), `l` (list code around current line). `assert` statements catch assumptions: `assert weight > 0, f"Invalid weight: {weight}"` raises AssertionError with a message if the condition fails. Try/except blocks handle expected errors gracefully: `try: value = int(input("Enter number: ")) except ValueError: print("That\'s not a number!")`.',
      advancedContent:
        'Professional debugging tools include IDE debuggers (VSCode, PyCharm) with breakpoints, watch expressions, and call stack visualization. **Logging** (`import logging; logging.debug("weight=%s", weight)`) is superior to print statements because you can set levels (DEBUG, INFO, WARNING, ERROR), direct output to files, and disable all debug messages with one setting change. **Unit testing** (`import unittest` or `pytest`) writes automated tests that verify each function works correctly — running hundreds of tests in seconds catches regressions before they reach users. Test-driven development (TDD) writes tests BEFORE code, ensuring every feature is testable by design.',
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
      beginnerContent:
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
      id: 'py-variables',
      title: 'Variables and Types',
      beginnerContent:
        'Variables store values. Python figures out the type automatically — you never declare types like in Java or C.\n\n' +
        '**Core types:** `int` (whole numbers), `float` (decimals), `str` (text), `bool` (True/False), `None` (nothing).\n\n' +
        '**Type conversion:** `int()` truncates decimals, `float()` adds .0, `str()` turns anything to text, `bool()` checks truthiness.\n\n' +
        '**The `math` module** provides mathematical functions beyond basic arithmetic.',
      code: `name = "Priya"          # str (text)
age = 14                # int (whole number)
height = 1.62           # float (decimal)
loves_coding = True     # bool (True or False)
nothing = None          # NoneType (absence of value)

# Check types
print(type(name))       # <class 'str'>
print(type(age))        # <class 'int'>

# ── Type conversion ──
age_text = str(age)     # "14"
pi_approx = int(3.14)  # 3 (truncates, doesn't round!)
whole = float(5)        # 5.0
is_valid = bool(42)     # True (any non-zero = True)
is_empty = bool(0)      # False (0, "", [], None = False)

# ── Rounding and abs ──
print(round(3.14159, 2))  # 3.14 (round to 2 decimals)
print(round(2.5))          # 2 (banker's rounding!)
print(abs(-42))            # 42 (absolute value)

# ── The math module ──
import math
print(math.pi)             # 3.141592653589793
print(math.sqrt(16))       # 4.0
print(math.ceil(3.1))      # 4 (round up)
print(math.floor(3.9))     # 3 (round down)
print(math.hypot(3, 4))    # 5.0 (distance formula)

# ── Integer division and modulo ──
print(17 // 5)   # 3 (integer division — drops remainder)
print(17 % 5)    # 2 (modulo — the remainder itself)
print(2 ** 10)   # 1024 (power/exponent)

# ── Checking types safely ──
x = 42
print(isinstance(x, int))        # True
print(isinstance(x, (int, float)))  # True (either type)
print(isinstance("hi", str))     # True`,
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try it: create your own variables\nname = "your name here"\nage = 14\nprint(f"Hi, I am {name} and I am {age} years old")\nprint(f"Next year I will be {age + 1}")\nprint(f"Type of name: {type(name).__name__}")\nprint(f"Type of age: {type(age).__name__}")', title: 'Try it — Variables' } },
    },
    {
      id: 'py-strings',
      title: 'Strings',
      diagram: 'StringSlicingDiagram',
      beginnerContent:
        'Try the slicer above. Drag the `start` and `stop` sliders — watch which letters light up. ' +
        'Push `step` negative to reverse the slice. This is what string indexing *is* in Python.\n\n' +
        'Strings are sequences of characters. Every character has a position number (index), starting from 0. ' +
        'Negative indices count from the end: -1 is the last character, -2 is second-to-last.\n\n' +
        '**Slicing** extracts a portion of a string using `s[start:stop:step]`:\n' +
        '- `start` — where to begin (included). Default: 0.\n' +
        '- `stop` — where to end (excluded). Default: end of string.\n' +
        '- `step` — how many positions to skip. Default: 1. Use -1 to reverse.\n\n' +
        'Strings are **immutable** — you cannot change individual characters. Every operation returns a new string.',
      code: `name = "KAZIRANGA"

# ── Indexing ──
print(name[0])       # K  (first character)
print(name[-1])      # A  (last character)
print(name[-3])      # N  (third from end)

# ── Slicing: s[start:stop] ──
print(name[0:5])     # KAZIR  (chars 0,1,2,3,4)
print(name[5:])      # ANGA   (from 5 to end)
print(name[:4])      # KAZI   (from start to 3)

# ── Step parameter: s[start:stop:step] ──
print(name[::2])     # KZRNA  (every 2nd character)
print(name[::-1])    # AGNARIZAK  (reversed!)
print(name[1::2])    # AIAG   (odd-indexed characters)

# ── Common string methods ──
greeting = "Hello, Assam!"
print(greeting.upper())          # HELLO, ASSAM!
print(greeting.lower())          # hello, assam!
print(greeting.replace("Assam", "World"))  # Hello, World!

# Checking content
print("Assam" in greeting)       # True
print(greeting.startswith("He")) # True
print("hello".isalpha())         # True (only letters)
print("abc123".isalnum())        # True (letters or digits)

# Splitting and joining
words = "elephant dolphin rhino".split(" ")
print(words)                     # ['elephant', 'dolphin', 'rhino']
print(" + ".join(words))         # elephant + dolphin + rhino

# Stripping whitespace
messy = "  data  "
print(messy.strip())             # "data"

# f-strings — the modern way to format
animal = "elephant"
count = 3
print(f"We spotted {count} {animal}s today!")
print(f"Name reversed: {name[::-1]}")`,
    },
    {
      id: 'py-lists',
      title: 'Lists',
      beginnerContent:
        'Lists hold ordered collections enclosed in square brackets `[]`. They can contain any type — numbers, strings, ' +
        'even other lists. Lists are **mutable**: you can add, remove, and change items after creation.\n\n' +
        '**Key operations:** indexing (`[0]`, `[-1]`), slicing (`[1:3]`), membership (`in`), length (`len()`), ' +
        'sorting (`sort()` mutates, `sorted()` returns new list), and filtering.\n\n' +
        'Lists support the same slice syntax as strings: `list[start:stop:step]`.',
      code: `# ── Creating and accessing ──
animals = ["elephant", "dolphin", "tiger", "rhino"]

print(animals[0])      # elephant (first)
print(animals[-1])     # rhino (last)
print(animals[1:3])    # ['dolphin', 'tiger'] (slice)

# ── Adding items ──
animals.append("leopard")       # add to end
animals.insert(1, "pangolin")   # insert at position 1
print(animals)

# ── Removing items ──
animals.remove("tiger")         # remove by value
last = animals.pop()            # remove and return last item
print(last)                     # leopard
del animals[0]                  # remove by index

# ── Sorting ──
numbers = [42, 7, 23, 1, 99]
numbers.sort()                  # mutates the original list
print(numbers)                  # [1, 7, 23, 42, 99]

# sorted() returns a NEW list (original unchanged)
original = [42, 7, 23]
ordered = sorted(original)
print(original)                 # [42, 7, 23] (unchanged!)
print(ordered)                  # [7, 23, 42]

# Sort descending
print(sorted(numbers, reverse=True))  # [99, 42, 23, 7, 1]

# ── Useful patterns ──
print(len(animals))             # length
print("dolphin" in animals)     # membership test: True/False
print(animals.count("dolphin")) # how many times it appears
print(animals.index("dolphin")) # position of first occurrence

# ── Filtering with list comprehension ──
weights = [4500, 280, 3200, 60, 5100]
heavy = [w for w in weights if w > 1000]
print(heavy)  # [4500, 3200, 5100]

# ── Reversing ──
print(animals[::-1])            # reversed (new list)
animals.reverse()               # reverse in-place

# ── Min, Max, Sum ──
scores = [85, 92, 78, 95, 88]
print(min(scores))   # 78
print(max(scores))   # 95
print(sum(scores))   # 438`,
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try it: make a list and explore it\nfruits = ["mango", "banana", "apple", "guava"]\nprint("All fruits:", fruits)\nprint("First:", fruits[0])\nprint("Last:", fruits[-1])\n\nfruits.append("papaya")\nprint("After append:", fruits)\nprint("Count:", len(fruits))\n\n# Try sorting\nfruits.sort()\nprint("Sorted:", fruits)', title: 'Try it — Lists' } },
    },
    {
      id: 'py-conditionals',
      title: 'If / Elif / Else',
      beginnerContent:
        'Branching lets your program make decisions based on conditions. Python uses indentation (4 spaces) to define code blocks.\n\n' +
        '**Operators:** `==` equals, `!=` not equal, `<` `>` `<=` `>=` comparisons, `in` membership, `not` negation.\n' +
        '**Combine:** `and` (both true), `or` (either true), `not` (flip).\n' +
        '**Chained:** Python allows `10 <= age <= 18` — no need for `age >= 10 and age <= 18`.',
      code: `temperature = 38

# ── Basic if/elif/else ──
if temperature > 40:
  print("Dangerous heat — stay indoors")
elif temperature > 30:
  print("Hot day — drink water")
elif temperature > 20:
  print("Pleasant weather")
else:
  print("Bring a jacket")

# ── Combine conditions ──
age = 14
has_ticket = True
if age >= 12 and has_ticket:
  print("Welcome to the show!")

# ── Chained comparisons ──
score = 85
if 80 <= score <= 100:
  print("Excellent!")   # cleaner than: score >= 80 and score <= 100

# ── Membership testing with 'in' ──
animal = "dolphin"
endangered = ["tiger", "rhino", "pangolin"]
if animal in endangered:
  print(f"{animal} is endangered!")
else:
  print(f"{animal} is not on the list")

# ── Ternary expression (one-line if) ──
status = "adult" if age >= 18 else "minor"
print(status)  # "minor"

# ── Guard clause pattern ──
def classify(magnitude):
  if magnitude < 0:
      return "invalid"    # guard: handle bad input first
  if magnitude < 2:
      return "micro"
  if magnitude < 4:
      return "minor"
  if magnitude < 6:
      return "moderate"
  return "major"          # no need for else — earlier returns handle it

print(classify(5.5))  # "moderate"`,
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try it: change the temperature and see what happens\ntemperature = 28\n\nif temperature > 35:\n    print("Too hot!")\nelif temperature > 25:\n    print("Warm and pleasant")\nelif temperature > 15:\n    print("Cool")\nelse:\n    print("Cold!")\n\n# Try changing temperature to 40, 10, or -5', title: 'Try it — Conditionals' } },
    },
    {
      id: 'py-loops',
      title: 'Loops',
      beginnerContent:
        '`for` loops iterate over any sequence (list, string, range). `while` loops repeat until a condition is false.\n\n' +
        '**Key patterns:**\n' +
        '- `enumerate()` — loop with both index and value\n' +
        '- `zip()` — loop over two lists in parallel\n' +
        '- `break` — exit the loop early\n' +
        '- `continue` — skip to the next iteration\n' +
        '- Accumulator pattern — build up a result across iterations (sum, max, count)\n' +
        '- Tracking state — keep a running variable (current streak, best-so-far)',
      code: `# ── For loop basics ──
colors = ["red", "green", "blue"]
for color in colors:
  print(f"I like {color}")

# range(start, stop, step)
for i in range(0, 10, 2):    # 0, 2, 4, 6, 8
  print(i, end=" ")
print()

# ── enumerate() — get index AND value ──
animals = ["elephant", "dolphin", "rhino"]
for i, animal in enumerate(animals):
  print(f"{i}: {animal}")
# 0: elephant
# 1: dolphin
# 2: rhino

# ── zip() — loop over two lists together ──
names = ["Ranga", "Mohini", "Kavi"]
ages = [25, 18, 30]
for name, age in zip(names, ages):
  print(f"{name} is {age} years old")

# ── While loop ──
count = 10
while count > 0:
  print(count, end=" ")
  count -= 1
print("Launch!")

# ── break and continue ──
# break: exit the loop entirely
for n in range(100):
  if n > 0 and n % 7 == 0:
      print(f"First multiple of 7: {n}")  # 7
      break

# continue: skip this iteration, go to next
for n in range(10):
  if n % 2 == 0:
      continue  # skip even numbers
  print(n, end=" ")  # 1 3 5 7 9
print()

# ── Accumulator pattern — track a running total ──
readings = [23.5, 24.1, 22.8, 25.0, 23.2]
total = 0
for r in readings:
  total += r
average = total / len(readings)
print(f"Average: {average:.1f}")  # 23.7

# ── Find max in one pass ──
speeds = [120, 85, 200, 95, 180]
max_speed = speeds[0]
max_index = 0
for i, s in enumerate(speeds):
  if s > max_speed:
      max_speed = s
      max_index = i
print(f"Max: {max_speed} at index {max_index}")  # 200 at 2

# ── Streak tracking ──
growth = [2, 3, 0, 1, 4, 5, 0, 1]
current_streak = 0
longest_streak = 0
for g in growth:
  if g > 0:
      current_streak += 1
      longest_streak = max(longest_streak, current_streak)
  else:
      current_streak = 0
print(f"Longest growth streak: {longest_streak}")  # 3`,
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try it: loops in action\nanimals = ["elephant", "tiger", "rhino", "deer"]\n\n# for loop\nfor animal in animals:\n    print(f"I saw a {animal}!")\n\nprint()\n\n# range loop\ntotal = 0\nfor i in range(1, 11):\n    total += i\nprint(f"Sum of 1 to 10 = {total}")', title: 'Try it — Loops' } },
    },
    {
      id: 'py-functions',
      title: 'Functions',
      beginnerContent:
        'Functions group reusable logic. They take parameters and return results. Use `def` to define, and `return` to send back a value.\n\n' +
        '**Key concepts:**\n' +
        '- **Default parameters** — provide fallback values: `def f(x, y=10)`\n' +
        '- **Multiple return values** — return a tuple: `return a, b`\n' +
        '- **Type hints** — document expected types: `def f(x: int) -> str`\n' +
        '- **Docstrings** — explain what the function does, right after `def`\n' +
        '- **isinstance()** — check if a value is the right type before using it\n' +
        '- **Generators** — functions that `yield` values one at a time instead of returning a list',
      code: `# ── Basic function ──
def greet(name):
  """Return a friendly greeting."""
  return f"Namaste, {name}!"

print(greet("Priya"))   # Namaste, Priya!

# ── Default parameters ──
def power(base, exp=2):
  return base ** exp

print(power(5))      # 25 (uses default exp=2)
print(power(2, 10))  # 1024

# ── Multiple return values (returns a tuple) ──
def min_max(numbers):
  return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 8, 2])
print(lo, hi)  # 1 8

# ── Type hints — document expected types ──
def distance(p1: tuple, p2: tuple) -> float:
  """Euclidean distance between two 2D points."""
  dx = p2[0] - p1[0]
  dy = p2[1] - p1[1]
  return (dx**2 + dy**2) ** 0.5

print(distance((0, 0), (3, 4)))  # 5.0

# ── Input validation with isinstance() ──
def reverse_name(name):
  """Reverse a string safely. Returns '' for non-strings."""
  if not isinstance(name, str):
      return ""
  return name[::-1]

print(reverse_name("Ranga"))  # agnaR
print(reverse_name(123))      # "" (not a string)
print(reverse_name(None))     # "" (not a string)

# ── Guard clauses — handle edge cases first ──
def safe_average(numbers):
  """Average of a list, or None if empty."""
  if not numbers:
      return None
  return sum(numbers) / len(numbers)

print(safe_average([10, 20, 30]))  # 20.0
print(safe_average([]))             # None

# ── Generators — yield values one at a time ──
def fibonacci(n):
  """Yield the first n Fibonacci numbers."""
  a, b = 0, 1
  for _ in range(n):
      yield a
      a, b = b, a + b

# Generators are lazy — they produce values on demand
for num in fibonacci(8):
  print(num, end=" ")  # 0 1 1 2 3 5 8 13
print()

# Convert generator to list
fib_list = list(fibonacci(5))
print(fib_list)  # [0, 1, 1, 2, 3]

# ── Lambda — small one-line functions ──
double = lambda x: x * 2
print(double(7))  # 14

# Useful with sorted()
animals = [("elephant", 4500), ("dolphin", 150), ("rhino", 2200)]
by_weight = sorted(animals, key=lambda a: a[1])
print(by_weight[0])  # ('dolphin', 150)`,
      interactive: { type: 'python-playground' as const, props: { starterCode: '# Try it: write and call your own function\ndef greet(name, times=1):\n    for _ in range(times):\n        print(f"Hello, {name}!")\n\ngreet("Tara")\ngreet("Kavitha", 3)\n\n# Now write a function that calculates area\ndef area_circle(radius):\n    return 3.14159 * radius ** 2\n\nprint(f"Area of radius 5: {area_circle(5):.2f}")', title: 'Try it — Functions' } },
    },
    {
      id: 'py-dicts',
      title: 'Dictionaries',
      diagram: 'DictCounterDiagram',
      beginnerContent:
        'Play with the counter above. Add words and watch how the dictionary keeps a running tally — each key (the word) points to a value (how many times it appeared). **That\'s all a dictionary is: a set of labeled slots.**\n\n' +
        'Dictionaries map **keys** to **values**. Keys must be immutable (strings, numbers, tuples). Values can be anything.\n\n' +
        '**Key methods:**\n' +
        '- `d[key]` — get value (raises KeyError if missing)\n' +
        '- `d.get(key, default)` — get value safely (returns default if missing)\n' +
        '- `d.items()` — loop through key-value pairs\n' +
        '- `d.keys()`, `d.values()` — get all keys or values\n\n' +
        '**collections module** provides specialized dict types:\n' +
        '- `Counter` — count occurrences automatically\n' +
        '- `defaultdict` — auto-create missing keys with a default value',
      code: `# ── Creating and accessing ──
elephant = {
  "name": "Ranga",
  "age": 25,
  "location": "Kaziranga"
}

print(elephant["name"])         # Ranga

# .get() is safe — returns default if key missing
print(elephant.get("weight", "unknown"))  # unknown
# vs elephant["weight"] would crash with KeyError

# ── Adding, updating, deleting ──
elephant["weight"] = 4500       # add new key
elephant["age"] = 26            # update existing
del elephant["location"]        # delete a key

# ── Looping ──
for key, value in elephant.items():
  print(f"{key}: {value}")

# Just keys or just values
print(list(elephant.keys()))    # ['name', 'age', 'weight']

# ── Counting with a dict ──
sky = "RROOYYRP"
counts = {}
for char in sky:
  counts[char] = counts.get(char, 0) + 1
print(counts)  # {'R': 2, 'O': 2, 'Y': 2, 'P': 1}

# ── collections.Counter — does counting for you ──
from collections import Counter
sky_counts = Counter("RROOYYRP")
print(sky_counts)               # Counter({'R': 2, 'O': 2, 'Y': 2, 'P': 1})
print(sky_counts.most_common(2))  # [('R', 2), ('O', 2)]

# ── collections.defaultdict — auto-create missing keys ──
from collections import defaultdict
grouped = defaultdict(list)     # missing keys get empty list
sightings = [("Dendrobium", "Kaziranga"), ("Vanda", "Manas"), ("Dendrobium", "Majuli")]
for species, location in sightings:
  grouped[species].append(location)
print(dict(grouped))
# {'Dendrobium': ['Kaziranga', 'Majuli'], 'Vanda': ['Manas']}

# ── Dictionary comprehension ──
squares = {n: n**2 for n in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Filter a dict
big_squares = {k: v for k, v in squares.items() if v > 10}
print(big_squares)  # {4: 16, 5: 25}

# ── Sets — unordered collection of unique values ──
animals = {"elephant", "dolphin", "elephant", "rhino"}
print(animals)  # {'elephant', 'dolphin', 'rhino'} (no duplicates)

# Set operations
set_a = {1, 2, 3, 4}
set_b = {3, 4, 5, 6}
print(set_a & set_b)   # {3, 4}  intersection
print(set_a | set_b)   # {1, 2, 3, 4, 5, 6}  union
print(set_a - set_b)   # {1, 2}  difference

# Deduplicate a list
names = ["Ranga", "Mohini", "Ranga", "Kavi", "Mohini"]
unique = sorted(set(names))
print(unique)  # ['Kavi', 'Mohini', 'Ranga']

# ── Tuples — immutable sequences ──
point = (3, 4)
x, y = point          # unpacking
print(f"x={x}, y={y}")

# Tuples as dict keys (lists can't be keys)
grid = {(0, 0): "start", (3, 4): "end"}
print(grid[(3, 4)])    # end`,
    },
    {
      id: 'py-comprehensions',
      title: 'List Comprehensions — One-Line Loops',
      beginnerContent:
        'A list comprehension builds a new list in one line: `[expression for item in iterable]`.\n\n' +
        '**Add a filter:** `[x for x in items if condition]`\n' +
        '**Generator expression:** Same syntax with `()` instead of `[]` — produces values lazily (one at a time, saving memory).\n' +
        '**Dict/set comprehensions:** `{k: v for ...}` and `{x for ...}`.',
      code: `# ── List comprehension basics ──
doubled = [x * 2 for x in range(10)]
print(doubled)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Filter: keep only heavy animals
weights = [4500, 280, 3200, 60, 5100]
heavy = [w for w in weights if w > 1000]
print(heavy)  # [4500, 3200, 5100]

# Transform + filter in one go
names = ["Ranga", "Mo", "Kaziranga", "Kavi"]
long_upper = [n.upper() for n in names if len(n) > 3]
print(long_upper)  # ['RANGA', 'KAZIRANGA', 'KAVI']

# ── Nested: flatten a list of lists ──
sightings = [[1, 3], [0, 2], [5, 1]]
flat = [count for day in sightings for count in day]
print(flat)  # [1, 3, 0, 2, 5, 1]

# ── Generator expressions — lazy, memory efficient ──
# Use () instead of [] — values computed one at a time
total = sum(w for w in weights if w > 1000)
print(total)  # 12900

# Count items matching a condition
count = sum(1 for w in weights if w > 1000)
print(count)  # 3

# Check if any/all match
print(any(w > 5000 for w in weights))  # True
print(all(w > 0 for w in weights))     # True

# ── Dict comprehension ──
squares = {n: n**2 for n in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Invert a dictionary
inverted = {v: k for k, v in squares.items()}
print(inverted)  # {1: 1, 4: 2, 9: 3, 16: 4, 25: 5}

# ── Set comprehension (unique values) ──
words = ["hello", "world", "hello", "python"]
lengths = {len(w) for w in words}
print(lengths)  # {5, 6}

# ── zip() in comprehensions ──
names = ["Ranga", "Mohini", "Kavi"]
ages = [25, 18, 30]
profiles = {name: age for name, age in zip(names, ages)}
print(profiles)  # {'Ranga': 25, 'Mohini': 18, 'Kavi': 30}`,
    },
    {
      id: 'py-files',
      title: 'Working with Files',
      beginnerContent:
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
    {
      id: 'py-errors',
      title: 'Error Handling — try / except',
      beginnerContent:
        'Watch the flow diagram above. When an error happens inside a `try` block, execution jumps immediately to the matching `except` block — it doesn\'t crash, and it doesn\'t continue normally. That\'s the whole mechanism in one picture.\n\n' +
        'Errors happen. `try/except` catches them so your program doesn\u2019t crash.\n\n' +
        '**Common errors:** `ValueError` (wrong value), `TypeError` (wrong type), `KeyError` (missing dict key), ' +
        '`IndexError` (list index out of range), `ZeroDivisionError`.\n\n' +
        '**Best practice:** Catch specific errors, not bare `except:`. Validate input at boundaries, trust internal code.',
      code: `# ── Basic try/except ──
try:
  number = int("hello")       # this will fail
except ValueError:
  print("That's not a number!")  # catches it gracefully

# ── Catch specific errors ──
def safe_divide(a, b):
  try:
      return round(a / b, 2)
  except ZeroDivisionError:
      return None
  except TypeError:
      return None

print(safe_divide(10, 3))    # 3.33
print(safe_divide(10, 0))    # None
print(safe_divide(10, "x"))  # None

# ── Multiple except + else + finally ──
def read_config(filename):
  try:
      with open(filename) as f:
          data = f.read()
  except FileNotFoundError:
      print(f"{filename} not found — using defaults")
      data = "default=true"
  except PermissionError:
      print(f"No permission to read {filename}")
      data = ""
  else:
      print(f"Loaded {filename} successfully")  # runs if NO error
  finally:
      print("Config loading complete")  # ALWAYS runs
  return data

# ── Raising errors ──
def set_age(age):
  if not isinstance(age, int):
      raise TypeError(f"age must be int, got {type(age).__name__}")
  if age < 0 or age > 150:
      raise ValueError(f"age must be 0-150, got {age}")
  return age

try:
  set_age(-5)
except ValueError as e:
  print(f"Error: {e}")  # Error: age must be 0-150, got -5

# ── The LBYL vs EAFP debate ──
# LBYL (Look Before You Leap):
if "name" in elephant:
  print(elephant["name"])

# EAFP (Easier to Ask Forgiveness — Pythonic):
try:
  print(elephant["name"])
except KeyError:
  print("no name")`,
      diagram: 'ErrorFlowDiagram',
    },
    {
      id: 'py-bisect',
      title: 'The bisect Module — Binary Search Built In',
      beginnerContent:
        'Python\u2019s `bisect` module provides efficient binary search for sorted lists. ' +
        'Instead of writing your own binary search, use `bisect_left()` and `bisect_right()` to find insertion points in O(log n).\n\n' +
        '**Use cases:** finding closest values, counting items in a range, classifying values by thresholds.',
      code: `import bisect

# ── bisect_left: where would target go? ──
data = [10, 20, 30, 40, 50, 60, 70, 80, 90]

# Find insertion point for 35
pos = bisect.bisect_left(data, 35)
print(pos)  # 3 (would go between 30 and 40)

# Check if a value exists (binary search!)
def binary_search(sorted_list, target):
  pos = bisect.bisect_left(sorted_list, target)
  if pos < len(sorted_list) and sorted_list[pos] == target:
      return pos  # found at this index
  return -1       # not found

print(binary_search(data, 50))   # 4
print(binary_search(data, 55))   # -1

# ── Find closest value ──
def find_closest(sorted_list, target):
  pos = bisect.bisect_left(sorted_list, target)
  if pos == 0:
      return sorted_list[0]
  if pos == len(sorted_list):
      return sorted_list[-1]
  before = sorted_list[pos - 1]
  after = sorted_list[pos]
  return before if (target - before) <= (after - target) else after

temps = [0, 1000, 2000, 3000, 4000, 5000]
print(find_closest(temps, 1800))  # 2000
print(find_closest(temps, 1200))  # 1000

# ── Count items in a range [lo, hi] ──
def count_in_range(sorted_list, lo, hi):
  left = bisect.bisect_left(sorted_list, lo)
  right = bisect.bisect_right(sorted_list, hi)
  return right - left

scores = [55, 62, 70, 75, 80, 85, 90, 95]
print(count_in_range(scores, 70, 90))  # 4 (70, 75, 80, 85, 90... wait)
# bisect_right(90) = 7, bisect_left(70) = 2 → 7-2 = 5 ✓

# ── Classify with thresholds ──
def richter_class(magnitude):
  thresholds = [2, 4, 5, 6, 7]
  labels = ["micro", "minor", "light", "moderate", "strong", "major"]
  return labels[bisect.bisect_right(thresholds, magnitude)]

print(richter_class(1.5))  # micro
print(richter_class(5.5))  # moderate
print(richter_class(7.2))  # major

# ── insort: insert and keep sorted ──
scores = [60, 70, 80, 90]
bisect.insort(scores, 75)
print(scores)  # [60, 70, 75, 80, 90] — inserted in right place`,
    },
    {
      id: 'py-itertools',
      title: 'The itertools Module — Power Tools for Iteration',
      beginnerContent:
        '`itertools` provides building blocks for efficient iteration. All functions return lazy iterators (memory-efficient).\n\n' +
        '**Key functions:**\n' +
        '- `cycle()` — repeat a sequence forever\n' +
        '- `chain()` — join multiple iterables into one\n' +
        '- `product()` — all combinations (like nested loops)\n' +
        '- `combinations()` / `permutations()` — choose items\n' +
        '- `islice()` — slice an iterator (like list slicing but lazy)',
      code: `from itertools import cycle, chain, product, combinations, islice, accumulate

# ── cycle: repeat forever ──
colors = cycle(["red", "green", "blue"])
# Take first 7 from the infinite cycle
first_7 = [next(colors) for _ in range(7)]
print(first_7)
# ['red', 'green', 'blue', 'red', 'green', 'blue', 'red']

# Round-robin assignment
gardens = ["A", "B", "C", "D", "E"]
workers = ["W1", "W2"]
assignments = dict(zip(gardens, cycle(workers)))
print(assignments)
# {'A': 'W1', 'B': 'W2', 'C': 'W1', 'D': 'W2', 'E': 'W1'}

# ── chain: join iterables ──
list1 = [1, 2, 3]
list2 = [4, 5, 6]
list3 = [7, 8, 9]
print(list(chain(list1, list2, list3)))
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# ── product: all combinations (like nested loops) ──
rows = range(2)
cols = range(3)
grid = list(product(rows, cols))
print(grid)
# [(0,0), (0,1), (0,2), (1,0), (1,1), (1,2)]

# ── combinations: choose k items ──
animals = ["elephant", "dolphin", "rhino", "tiger"]
pairs = list(combinations(animals, 2))
print(pairs)
# [('elephant','dolphin'), ('elephant','rhino'), ...]
print(f"{len(pairs)} pairs from {len(animals)} animals")  # 6

# ── islice: slice an iterator ──
# Useful for taking first N items from any iterator
from itertools import count  # infinite counter
first_10_evens = list(islice(count(0, 2), 10))
print(first_10_evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# ── accumulate: running totals ──
daily_rain = [5, 10, 3, 8, 2]
cumulative = list(accumulate(daily_rain))
print(cumulative)  # [5, 15, 18, 26, 28]

# ── Repeat a pattern to fill a length ──
pattern = [1, 2, 3]
total_length = 7
filled = list(islice(cycle(pattern), total_length))
print(filled)  # [1, 2, 3, 1, 2, 3, 1]`,
    },
    {
      id: 'py-tuples-sets',
      title: 'Tuples & Sets',
      beginnerContent:
        'Compare the two side by side in the diagram above. A **tuple** is an ordered sequence — positions matter, duplicates allowed, can\'t be changed after creation. A **set** is an unordered collection — no duplicates, ultra-fast membership checks, can\'t hold mutable items. Different shapes for different jobs.\n\n' +
        '**Tuples** are immutable sequences — once created, they cannot be changed. Create them with parentheses `()` or just commas. They\'re perfect for fixed data like coordinates, RGB colors, or database records.\n\n' +
        '**Tuple unpacking** lets you assign multiple variables at once: `lat, lon = (26.14, 91.74)`. This works in for-loops too.\n\n' +
        '**Named tuples** from `collections` give each position a name, making code more readable than raw index access.\n\n' +
        '**Sets** hold unique values only — duplicates are automatically removed. Create them with `{}` or `set()`. They\'re backed by hash tables, making membership testing (`x in my_set`) blazingly fast — O(1) vs O(n) for lists.\n\n' +
        '**Set operations** mirror mathematical set theory: `|` union, `&` intersection, `-` difference, `^` symmetric difference.\n\n' +
        '**When to use what:** Tuples for fixed data and dict keys (they\'re hashable). Lists for mutable collections. Sets for membership testing and deduplication.',
      code: `# ── Tuples: immutable sequences ──
elephant_pos = (26.14, 91.74)  # latitude, longitude
# elephant_pos[0] = 27.0  # ERROR! Tuples can't be changed.

# Create without parentheses — commas make the tuple
species = "Asian elephant", "Indian rhino", "Bengal tiger"
print(type(species))  # <class 'tuple'>

# ── Tuple unpacking ──
lat, lon = elephant_pos
print(f"Latitude: {lat}, Longitude: {lon}")

# Swap variables — Python's elegant trick
a, b = 10, 20
a, b = b, a  # now a=20, b=10

# Unpack in a loop
sightings = [("Ranga", 5), ("Mohini", 3), ("Gaja", 8)]
for name, count in sightings:
  print(f"{name}: {count} sightings")

# ── Named tuples: readable tuple access ──
from collections import namedtuple
Animal = namedtuple("Animal", ["name", "species", "weight"])
ranga = Animal("Ranga", "Asian elephant", 4500)
print(ranga.name)      # "Ranga" (much clearer than ranga[0])
print(ranga.weight)    # 4500

# ── Sets: unique values only ──
river_species = {"dolphin", "turtle", "catfish", "dolphin", "turtle"}
print(river_species)  # {'dolphin', 'turtle', 'catfish'} — no duplicates!
print(len(river_species))  # 3

# Add and remove
river_species.add("otter")
river_species.discard("catfish")  # safe — no error if missing

# ── Set operations ──
kaziranga = {"elephant", "rhino", "tiger", "buffalo"}
manas = {"elephant", "rhino", "langur", "pygmy hog"}

# Union: all species in either park
all_species = kaziranga | manas
print(all_species)  # {'elephant', 'rhino', 'tiger', 'buffalo', 'langur', 'pygmy hog'}

# Intersection: species in both parks
shared = kaziranga & manas
print(shared)  # {'elephant', 'rhino'}

# Difference: only in Kaziranga
only_kaziranga = kaziranga - manas
print(only_kaziranga)  # {'tiger', 'buffalo'}

# Symmetric difference: in one but not both
unique_to_each = kaziranga ^ manas
print(unique_to_each)  # {'tiger', 'buffalo', 'langur', 'pygmy hog'}

# ── Fast membership testing ──
endangered = {"rhino", "pygmy hog", "tiger", "dolphin", "vulture"}
animal = "rhino"
print(animal in endangered)  # True — O(1) lookup!

# ── Deduplication while preserving order ──
sighting_log = ["elephant", "rhino", "elephant", "tiger", "rhino", "elephant"]
unique_ordered = list(dict.fromkeys(sighting_log))
print(unique_ordered)  # ['elephant', 'rhino', 'tiger']

# ── Tuples as dict keys (sets can't be keys!) ──
grid_data = {}
grid_data[(0, 0)] = "forest"
grid_data[(0, 1)] = "river"
grid_data[(1, 0)] = "grassland"
print(grid_data[(0, 1)])  # "river"

# ── Frozenset: an immutable set (can be a dict key) ──
habitat = frozenset(["forest", "grassland"])
print("forest" in habitat)  # True`,
      diagram: 'TupleSetDiagram',
    },
    {
      id: 'py-classes',
      title: 'Classes — Building Your Own Types',
      beginnerContent:
        'Click **+ Create instance** in the diagram above. Notice how the class on the left stays unchanged, but each click spawns a new independent object on the right — same shape, different data. That\'s the entire concept: one blueprint, many objects.\n\n' +
        'A **class** is a blueprint for creating objects. An **instance** is a specific object built from that blueprint. Think of it like a "species card" template (the class) vs. a card filled out for a specific elephant (the instance).\n\n' +
        '`__init__` is the constructor — it runs when you create a new instance and sets up its data. `self` refers to the specific instance being created or used.\n\n' +
        '**Instance variables** (set via `self.name = ...`) belong to each object individually. **Methods** are functions defined inside the class that operate on the instance\'s data.\n\n' +
        '`__str__` controls what `print()` shows. `__repr__` controls what the REPL shows (aim for a string that could recreate the object).\n\n' +
        '**Inheritance** lets one class extend another, reusing code. The child class gets all parent methods and can override or add new ones.\n\n' +
        '**When to use classes vs dicts:** Use dicts for simple key-value data. Use classes when the data has behavior (methods), validation, or relationships. If you\'re passing the same group of variables to many functions, that group probably wants to be a class.',
      code: `# ── Basic class: a blueprint ──
class ElephantTracker:
  """Tracks sightings of an individual elephant."""

  def __init__(self, name, species="Asian"):
      self.name = name
      self.species = species
      self.sightings = []  # starts empty

  def record_sighting(self, location, date):
      """Add a new sighting record."""
      self.sightings.append({"location": location, "date": date})

  def total_sightings(self):
      """How many times this elephant has been seen."""
      return len(self.sightings)

  def __str__(self):
      return f"{self.name} ({self.species}) — {self.total_sightings()} sightings"

  def __repr__(self):
      return f"ElephantTracker('{self.name}', '{self.species}')"

# Create instances
ranga = ElephantTracker("Ranga")
mohini = ElephantTracker("Mohini")

# Use methods
ranga.record_sighting("Kaziranga East", "2026-01-15")
ranga.record_sighting("Kaziranga Central", "2026-02-20")
mohini.record_sighting("Manas NP", "2026-01-22")

print(ranga)          # Ranga (Asian) — 2 sightings
print(repr(mohini))   # ElephantTracker('Mohini', 'Asian')
print(ranga.total_sightings())  # 2

# ── Class with validation ──
class Lesson:
  VALID_LEVELS = (0, 1, 2, 3)

  def __init__(self, title, story, level=0):
      if level not in self.VALID_LEVELS:
          raise ValueError(f"Level must be one of {self.VALID_LEVELS}")
      self.title = title
      self.story = story
      self.level = level
      self.completed = False

  def complete(self):
      self.completed = True

  def __str__(self):
      status = "done" if self.completed else "in progress"
      return f"L{self.level}: {self.title} [{status}]"

lesson = Lesson("AI & Wildlife Tracking", "The Girl Who Spoke to Elephants", level=1)
print(lesson)  # L1: AI & Wildlife Tracking [in progress]
lesson.complete()
print(lesson)  # L1: AI & Wildlife Tracking [done]

# ── Inheritance: extending a class ──
class Animal:
  """Base class for all tracked animals."""
  def __init__(self, name, species):
      self.name = name
      self.species = species

  def describe(self):
      return f"{self.name} the {self.species}"

class Elephant(Animal):
  """An elephant with herd tracking."""
  def __init__(self, name, herd=None):
      super().__init__(name, "Asian elephant")  # call parent __init__
      self.herd = herd

  def describe(self):
      base = super().describe()  # reuse parent method
      if self.herd:
          return f"{base} (herd: {self.herd})"
      return base

class Dolphin(Animal):
  def __init__(self, name, river):
      super().__init__(name, "Gangetic dolphin")
      self.river = river

gaja = Elephant("Gaja", herd="Kaziranga East")
print(gaja.describe())  # Gaja the Asian elephant (herd: Kaziranga East)

susu = Dolphin("Susu", river="Brahmaputra")
print(susu.describe())  # Susu the Gangetic dolphin

# They share the Animal interface
animals = [gaja, susu]
for a in animals:
  print(isinstance(a, Animal))  # True for both`,
      diagram: 'ClassBlueprintDiagram',
    },
    {
      id: 'py-scope',
      title: 'Scope — Where Variables Live',
      beginnerContent:
        'Every variable in Python lives in a **scope** — a region of code where that name is valid. Understanding scope prevents bugs where variables seem to "disappear" or hold unexpected values.\n\n' +
        'Python uses the **LEGB rule** to look up names: **L**ocal (inside the current function) → **E**nclosing (inside any outer function) → **G**lobal (module level) → **B**uilt-in (Python\'s own names like `print`, `len`).\n\n' +
        'A **closure** is a function that remembers variables from its enclosing scope, even after that scope has finished executing. This is the foundation of function factories and decorators.\n\n' +
        '**Why avoid global variables:** They create hidden dependencies between functions, make testing harder, and cause subtle bugs when two functions modify the same global. Instead, pass data as arguments and return results.\n\n' +
        '**Function factories** are functions that return new functions, each with its own enclosed state — powerful for creating specialized versions of a general function.',
      code: `# ── Local vs Global scope ──
species = "elephant"  # global variable

def track_animal():
  species = "dolphin"  # local variable — shadows the global
  print(species)        # "dolphin"

track_animal()
print(species)  # "elephant" — global unchanged!

# ── LEGB rule in action ──
habitat = "forest"           # Global

def outer():
  habitat = "wetland"      # Enclosing
  def inner():
      habitat = "river"    # Local
      print(habitat)       # "river" (found at Local level)
  inner()
  print(habitat)           # "wetland" (Enclosing, unchanged)

outer()
print(habitat)               # "forest" (Global, unchanged)

# ── Closures: functions that remember ──
def make_tracker(animal_name):
  """Returns a function that tracks sightings for one animal."""
  sightings = []  # this lives in the enclosing scope

  def record(location):
      sightings.append(location)  # closure captures 'sightings'
      return f"{animal_name}: {len(sightings)} sightings"

  return record

track_ranga = make_tracker("Ranga")
track_mohini = make_tracker("Mohini")

print(track_ranga("Kaziranga"))   # Ranga: 1 sightings
print(track_ranga("Manas"))       # Ranga: 2 sightings
print(track_mohini("Pobitora"))   # Mohini: 1 sightings
# Each function has its OWN sightings list!

# ── Function factory: specialized functions ──
def make_converter(factor, unit):
  """Create a unit converter function."""
  def convert(value):
      return f"{value * factor:.2f} {unit}"
  return convert

km_to_miles = make_converter(0.621371, "miles")
kg_to_pounds = make_converter(2.20462, "lbs")
celsius_to_f = make_converter(1.8, "°F offset")  # simplified

print(km_to_miles(100))    # "62.14 miles"
print(kg_to_pounds(4500))  # "9920.79 lbs" (one elephant!)

# ── Why globals are bad — the bug ──
count = 0  # global

def add_sighting_bad():
  global count    # modifying global — fragile!
  count += 1

def add_sighting_good(current_count):
  return current_count + 1  # pure function — no side effects

# The good version is testable, predictable, safe
result = add_sighting_good(0)
result = add_sighting_good(result)
print(result)  # 2

# ── Score tracker with closure (practical example) ──
def create_scorer():
  scores = []
  def add(score):
      scores.append(score)
      avg = sum(scores) / len(scores)
      return f"Added {score}, average: {avg:.1f}, total: {len(scores)}"
  def get_scores():
      return scores.copy()  # return copy so caller can't mutate
  return add, get_scores

add_score, get_scores = create_scorer()
print(add_score(85))   # Added 85, average: 85.0, total: 1
print(add_score(92))   # Added 92, average: 88.5, total: 2
print(get_scores())    # [85, 92]`,
    },
    {
      id: 'py-formatting',
      title: 'String Formatting — f-strings and Beyond',
      beginnerContent:
        '**f-strings** (formatted string literals, Python 3.6+) are the modern way to embed expressions in strings. Prefix with `f` and put expressions in `{curly braces}`.\n\n' +
        '**Format specs** after a colon control appearance: `:.2f` for 2 decimal places, `:>20` for right-alignment in 20 chars, `:,` for thousands separators, `:<10` for left-alignment, `:^15` for center.\n\n' +
        '**Multiline f-strings** work with triple quotes — great for generating reports and formatted output.\n\n' +
        'The older **`.format()`** method uses `{}` placeholders filled by `.format(args)`. It\'s still useful for reusable templates where the template string is defined separately from the data.\n\n' +
        '**When to use which:** f-strings for most cases (readable, fast). `.format()` for reusable templates. `%` formatting is legacy — avoid in new code.',
      code: `# ── Basic f-strings ──
elephant = "Ranga"
weight = 4500
print(f"Tracking {elephant}, weight: {weight}kg")
# Tracking Ranga, weight: 4500kg

# Expressions inside braces
sightings = [3, 7, 2, 5]
print(f"Total sightings: {sum(sightings)}")     # Total sightings: 17
print(f"Average: {sum(sightings)/len(sightings):.1f}")  # Average: 4.2

# ── Number formatting ──
distance = 1234567.891
print(f"Distance: {distance:,.2f} meters")  # Distance: 1,234,567.89 meters
print(f"Rounded: {distance:.0f}")           # Rounded: 1234568
print(f"Scientific: {distance:.2e}")        # Scientific: 1.23e+06

population = 42
print(f"Count: {population:05d}")  # Count: 00042 (zero-padded)

# ── Alignment and padding ──
animals = [("Elephant", 4500), ("Dolphin", 85), ("Rhino", 2200)]

print(f"{'Animal':<15} {'Weight (kg)':>12}")
print("-" * 28)
for name, wt in animals:
  print(f"{name:<15} {wt:>12,}")

# Output:
# Animal           Weight (kg)
# ----------------------------
# Elephant                4,500
# Dolphin                    85
# Rhino                  2,200

# ── Multiline f-strings ──
species = "Asian elephant"
location = "Kaziranga National Park"
count = 2413
status = "Endangered"

report = f"""
╔══════════════════════════════════╗
║  Wildlife Report                 ║
╠══════════════════════════════════╣
║  Species:  {species:<22}║
║  Location: {location:<22}║
║  Count:    {count:<22,}║
║  Status:   {status:<22}║
╚══════════════════════════════════╝
"""
print(report)

# ── Formatting types quick reference ──
val = 42.5678
print(f"{val:.2f}")    # 42.57    — 2 decimal places
print(f"{val:10.2f}")  # "     42.57" — right-aligned in 10 chars
print(f"{val:<10.2f}") # "42.57     " — left-aligned
print(f"{val:^10.2f}") # "  42.57   " — centered

pct = 0.8567
print(f"{pct:.1%}")    # 85.7%    — percentage format

# ── .format() for reusable templates ──
template = "The {animal} was spotted at {location} on {date}."

# Same template, different data
print(template.format(animal="elephant", location="Kaziranga", date="Jan 15"))
print(template.format(animal="dolphin", location="Brahmaputra", date="Feb 20"))

# Positional arguments
print("Coordinates: ({0}, {1})".format(26.14, 91.74))

# ── Debugging with f-strings (Python 3.8+) ──
x = 42
name = "Ranga"
print(f"{x = }")        # x = 42
print(f"{name = }")     # name = 'Ranga'
print(f"{len(name) = }")  # len(name) = 5`,
    },
    {
      id: 'py-math',
      title: 'Math & Numbers — Beyond Arithmetic',
      beginnerContent:
        'Try the calculator above — switch between functions (`sqrt`, `log`, `sin`, `cos`...) and slide the input. Watch how each one maps input to output. Python\'s `math` module gives you a toolbox of these mathematical functions, ready to call by name.\n\n' +
        'Python\'s built-in `math` module provides essential mathematical functions: rounding, powers, roots, logarithms, trigonometry, and constants like `math.pi` and `math.e`.\n\n' +
        '**Rounding family:** `math.floor(x)` always rounds down, `math.ceil(x)` always rounds up, `round(x)` rounds to nearest (with banker\'s rounding for .5). `round(x, n)` rounds to n decimal places.\n\n' +
        '**Powers & roots:** `x ** n` for integer powers, `math.sqrt(x)` for square roots, `math.pow(x, n)` for float powers. `math.log(x, base)` for logarithms.\n\n' +
        '**The `statistics` module** (standard library) provides `mean()`, `median()`, `stdev()`, `mode()` — safer than writing your own because they handle edge cases.\n\n' +
        '**Integer division:** `//` gives the integer quotient (floor division), `%` gives the remainder (modulo). Together: `divmod(17, 5)` returns `(3, 2)` meaning 17 = 5×3 + 2.',
      code: `import math
import statistics

# ── Rounding ──
x = 3.7
print(math.floor(x))   # 3  (always down)
print(math.ceil(x))    # 4  (always up)
print(round(x))        # 4  (nearest)
print(round(3.14159, 2))  # 3.14  (2 decimal places)

# Banker's rounding for .5 (round to even)
print(round(2.5))  # 2  (not 3!)
print(round(3.5))  # 4

# ── Powers, roots, logs ──
print(2 ** 10)           # 1024 (integer power)
print(math.sqrt(144))    # 12.0
print(math.pow(2, 0.5))  # 1.4142... (same as sqrt(2))

print(math.log(1000, 10))  # 3.0 (10^3 = 1000)
print(math.log2(256))      # 8.0 (2^8 = 256)

# ── Absolute value and sign ──
print(abs(-42))          # 42
print(math.copysign(5, -1))  # -5.0 (copy sign)

# ── Integer division & modulo ──
print(17 // 5)   # 3  (quotient)
print(17 % 5)    # 2  (remainder)
q, r = divmod(17, 5)
print(f"17 = 5 × {q} + {r}")  # 17 = 5 × 3 + 2

# ── Constants ──
print(math.pi)   # 3.141592653589793
print(math.e)    # 2.718281828459045
print(math.inf)  # infinity (useful for min/max init)

# ── Statistics module ──
weights = [4500, 3800, 5200, 4100, 3200]

print(statistics.mean(weights))    # 4160.0
print(statistics.median(weights))  # 4100
print(statistics.stdev(weights))   # 756.6... (sample std dev)

# Percentile-like: quantiles (Python 3.8+)
print(statistics.quantiles(weights, n=4))
# [3500.0, 4100.0, 4850.0] — quartile boundaries

# ── Useful patterns ──
# Clamp a value to a range
value = 150
clamped = max(0, min(value, 100))  # 100

# Check if float is "close enough" (avoid ==)
a = 0.1 + 0.2
print(a == 0.3)                # False! (floating point)
print(math.isclose(a, 0.3))   # True (within tolerance)`,
      diagram: 'MathModuleDiagram',
    },
    {
      id: 'py-data',
      title: 'Data Processing — Filter, Transform, Aggregate',
      beginnerContent:
        'Watch the pipeline above. Raw data goes in one end; it flows through filter → transform → aggregate, getting smaller and more refined at each stage. This is the shape of nearly every data analysis you\'ll ever write — in Python, in SQL, in pandas, in spreadsheets. Once you see the pattern, you see it everywhere.\n\n' +
        'Data processing follows a pipeline pattern: **raw data → filter → transform → aggregate → result**. Python\'s built-in tools make each step clean and composable.\n\n' +
        '**Filtering** selects items that match a condition. Use list comprehensions with `if`: `[x for x in data if x > 0]`. For complex filters, `filter(fn, data)` works too.\n\n' +
        '**Transforming** (mapping) applies a function to each item: `[fn(x) for x in data]` or `map(fn, data)`. Extract fields, convert types, compute derived values.\n\n' +
        '**Aggregating** reduces a collection to a single value: `sum()`, `min()`, `max()`, `len()`, or custom reductions with `functools.reduce()`. The `statistics` module handles mean, median, stdev.\n\n' +
        '**Grouping** organizes items by a key. Use `collections.defaultdict(list)` or `itertools.groupby()` (requires sorted input). Pattern: loop over items, append to group dict.\n\n' +
        '**Chaining** these steps is the core of data analysis. Each step is small and testable. This is the same pattern used by pandas, SQL, and every data tool.',
      code: `from collections import defaultdict
import statistics

# ── Sample data: elephant sightings ──
sightings = [
  {"name": "Ranga", "weight": 4500, "park": "Kaziranga"},
  {"name": "Mohini", "weight": 3800, "park": "Manas"},
  {"name": "Gaja", "weight": 5200, "park": "Kaziranga"},
  {"name": "Tara", "weight": 4100, "park": "Kaziranga"},
  {"name": "Bala", "weight": 3200, "park": "Manas"},
]

# ── Step 1: Filter ──
kaziranga = [s for s in sightings if s["park"] == "Kaziranga"]
print(len(kaziranga))  # 3

# ── Step 2: Transform (extract weights) ──
weights = [s["weight"] for s in kaziranga]
print(weights)  # [4500, 5200, 4100]

# ── Step 3: Aggregate ──
avg_weight = statistics.mean(weights)
print(f"Average: {avg_weight:.0f} kg")  # Average: 4600 kg

# ── Grouping by key ──
by_park = defaultdict(list)
for s in sightings:
  by_park[s["park"]].append(s["name"])

for park, names in by_park.items():
  print(f"{park}: {', '.join(names)}")
# Kaziranga: Ranga, Gaja, Tara
# Manas: Mohini, Bala

# ── Moving average (sliding window) ──
def moving_average(data, window):
  """Smooth noisy data with a sliding window."""
  result = []
  for i in range(len(data) - window + 1):
      chunk = data[i:i + window]
      result.append(sum(chunk) / window)
  return result

readings = [10, 12, 11, 15, 14, 20, 18, 22]
smoothed = moving_average(readings, 3)
print(smoothed)  # [11.0, 12.67, 13.33, 16.33, 17.33, 20.0]

# ── Percentile ──
def percentile(data, p):
  """Simple percentile calculation."""
  sorted_data = sorted(data)
  k = (len(sorted_data) - 1) * (p / 100)
  f = int(k)
  c = f + 1 if f + 1 < len(sorted_data) else f
  return sorted_data[f] + (k - f) * (sorted_data[c] - sorted_data[f])

all_weights = [s["weight"] for s in sightings]
print(f"25th percentile: {percentile(all_weights, 25)}")  # 3500.0
print(f"75th percentile: {percentile(all_weights, 75)}")  # 4800.0

# ── Chained pipeline (one expression) ──
result = statistics.mean(
  s["weight"]
  for s in sightings
  if s["park"] == "Kaziranga"
)
print(f"Kaziranga avg: {result:.0f} kg")  # 4600 kg`,
      diagram: 'DataPipelineDiagram',
    },
  ],
};
