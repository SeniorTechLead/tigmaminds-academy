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
        goDeeper:
          'Programs are built from four fundamental operations: **input** (getting data from the user, a file, or a sensor), **processing** (performing calculations and making decisions), **output** (displaying results or sending data), and **storage** (saving data for later). Every program, from a simple calculator to an AI system, is a combination of these four. A Python program to calculate elephant BMI: `weight = float(input("Weight in kg: "))`, `height = float(input("Height in m: "))`, `bmi = weight / height**2`, `print(f"BMI: {bmi:.1f}")`. This uses all four: input → processing → output, with variables providing temporary storage.',
        advanced:
          'At the hardware level, a program is a sequence of binary instructions (machine code) stored in memory. The CPU fetches each instruction, decodes it, and executes it — the fetch-decode-execute cycle, billions of times per second. Python is an **interpreted** language: the Python interpreter reads your source code, converts it to bytecode (.pyc files), and executes that bytecode on the Python Virtual Machine (PVM). This is slower than compiled languages (C, Rust) but much faster to develop with. **Just-in-time (JIT)** compilers like PyPy compile frequently-executed bytecode to machine code at runtime, achieving 10-100× speedups for computational workloads.',
      },
      {
        title: 'How Computers Follow Instructions',
        content:
          'Computers are incredibly fast but completely literal. If you tell a person "go to the ' +
          'shop and buy milk", they figure out the details. A computer needs every micro-step: ' +
          'stand up, turn left, walk 12 steps, open the door... Python lets you write those ' +
          'instructions in words that look almost like English, so you can focus on *what* you ' +
          'want to happen rather than every tiny detail.',
        goDeeper:
          'Tracing code execution manually is a crucial debugging skill. For this code: `x = 5`, `y = x + 3`, `x = y * 2`, `print(x, y)` — trace step by step: after line 1, x=5. After line 2, y=8. After line 3, x=16 (x is reassigned, y unchanged). Output: **16 8**. Common mistake: thinking `x = y * 2` also changes y. Variables store values independently after assignment — changing x does not retroactively change y. Python evaluates the right side completely before assigning to the left side.',
        advanced:
          'Python uses **dynamic typing** (variables can change type at runtime) and **reference semantics** (variables are names pointing to objects in memory, not boxes containing values). When you write `a = [1, 2, 3]` and `b = a`, both names point to the SAME list object. Modifying `b.append(4)` also changes a, because they reference the same object. Use `b = a.copy()` or `b = a[:]` for an independent copy. This distinction between mutable objects (lists, dicts, sets) and immutable objects (ints, strings, tuples) is essential for avoiding subtle bugs in larger programs.',
      },
      {
        title: 'Variables Are Labeled Boxes',
        content:
          'A variable is a named container that holds a value. Imagine you have a row of boxes, ' +
          'each with a label on the front. One box is labeled "name" and inside it is the text ' +
          '"Priya". Another is labeled "age" and holds the number 14. You can peek inside a box, ' +
          'change what\'s in it, or use its contents in a calculation. That\'s all a variable is — ' +
          'a labeled box the computer remembers for you.',
        goDeeper:
          'Variable naming conventions in Python: use `snake_case` for variables and functions (`elephant_weight`, `calculate_bmi`), `UPPER_CASE` for constants (`MAX_SPEED = 299792458`), and `PascalCase` for classes (`ElephantTracker`). Names must start with a letter or underscore, cannot contain spaces or special characters, and cannot be Python keywords (`if`, `for`, `class`, etc.). Type annotations document expected types: `weight: float = 4500.0`, `name: str = "Ranga"`. While Python does not enforce these types at runtime, tools like mypy check them statically, catching bugs before the code runs.',
        advanced:
          'Python\'s memory model uses **reference counting** and **garbage collection**. Each object has a reference count — when it reaches zero, the memory is freed. The `id()` function shows an object\'s memory address: `x = 42; print(id(x))` → something like 140234567890. Python **interns** small integers (-5 to 256) and short strings, meaning `a = 256; b = 256; a is b` returns True (same object), but `a = 257; b = 257; a is b` may return False (different objects with equal values). The `is` operator checks identity (same object), while `==` checks equality (same value) — a critical distinction when debugging.',
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
        goDeeper:
          'Chained comparisons in Python: `18 <= age < 65` is equivalent to `age >= 18 and age < 65` but more readable. Boolean operators: `and` (both true), `or` (at least one true), `not` (inverts). Short-circuit evaluation: `if x != 0 and 10/x > 2` is safe because Python stops evaluating after `x != 0` is False, never dividing by zero. The ternary expression `result = "adult" if age >= 18 else "minor"` is a one-line if/else. Truthy/falsy values: `0`, `""`, `[]`, `None`, `False` are falsy; everything else is truthy.',
        advanced:
          'Pattern matching (Python 3.10+) uses `match/case` for structural pattern matching: `match command: case "quit": exit()`, `case ["move", x, y]: move_to(int(x), int(y))`, `case _: print("unknown")`. This is more powerful than if/elif chains for complex decision trees. Guard clauses (`case x if x > 0:`) add conditions to patterns. Under the hood, Python compiles match statements into efficient decision trees. In functional programming languages (Haskell, Erlang), pattern matching is the primary control flow mechanism — Python\'s adoption reflects the convergence of programming paradigms.',
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
        goDeeper:
          'Loop patterns to master: **accumulator** (`total = 0; for x in data: total += x`), **counter** (`count = 0; for x in data: if x > threshold: count += 1`), **search** (`for x in data: if condition: result = x; break`), **transform** (`new = [f(x) for x in data]`), **filter** (`kept = [x for x in data if condition]`). Enumerate gives index + value: `for i, name in enumerate(animals): print(f"{i}: {name}")`. Zip pairs elements: `for name, weight in zip(names, weights): print(f"{name}: {weight}kg")`.',
        advanced:
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
        goDeeper:
          'The call stack tracks function execution. When `main()` calls `analyze()` which calls `sort()`, the stack is [main → analyze → sort]. When sort finishes, execution returns to analyze. A `RecursionError: maximum recursion depth exceeded` means the stack grew too deep — usually from a recursive function missing its base case. Python\'s default limit is 1,000 frames. Stack traces (tracebacks) read bottom-to-top: the last line is where the error occurred, and each line above shows the caller. Learning to read tracebacks is the single most valuable debugging skill.',
        advanced:
          'Python\'s Global Interpreter Lock (GIL) means only one thread executes Python bytecode at a time — even on multi-core CPUs. For CPU-bound work, use `multiprocessing` (separate processes with separate GILs) instead of `threading`. For I/O-bound work (network requests, file reads), `threading` or `asyncio` (cooperative multitasking) works well because the GIL is released during I/O waits. The `asyncio` event loop uses `async/await` syntax: `async def fetch(url): response = await session.get(url)`. Understanding concurrency models — threading, multiprocessing, and async — is essential for building responsive, high-performance Python applications.',
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
        goDeeper:
          'Beyond print debugging, Python offers `pdb` (Python Debugger): insert `breakpoint()` in your code to pause execution and inspect variables interactively. Commands: `n` (next line), `s` (step into function), `c` (continue), `p variable` (print value), `l` (list code around current line). `assert` statements catch assumptions: `assert weight > 0, f"Invalid weight: {weight}"` raises AssertionError with a message if the condition fails. Try/except blocks handle expected errors gracefully: `try: value = int(input("Enter number: ")) except ValueError: print("That\'s not a number!")`.',
        advanced:
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
        id: 'py-variables',
        title: 'Variables and Types',
        content:
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
      },
      {
        id: 'py-strings',
        title: 'Strings',
        diagram: 'StringSlicingDiagram',
        content:
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
        content:
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
      },
      {
        id: 'py-conditionals',
        title: 'If / Elif / Else',
        content:
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
      },
      {
        id: 'py-loops',
        title: 'Loops',
        content:
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
      },
      {
        id: 'py-functions',
        title: 'Functions',
        content:
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
      },
      {
        id: 'py-dicts',
        title: 'Dictionaries',
        diagram: 'DictCounterDiagram',
        content:
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
        content:
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
      {
        id: 'py-errors',
        title: 'Error Handling — try / except',
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
        content:
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
        goDeeper:
          'The HTTP request/response cycle: your browser sends `GET /index.html HTTP/1.1` → the server responds with `HTTP/1.1 200 OK` and the HTML content. Status codes: 200=OK, 301=moved permanently, 404=not found, 500=server error. Chrome DevTools (F12) → Network tab shows every request, its size, and load time. A typical web page makes 50-100 requests (HTML, CSS, JS, images, fonts, analytics). **HTTPS** encrypts this traffic using TLS — the padlock icon means a man-in-the-middle cannot read your data. HTTP/2 multiplexes multiple requests over a single connection, and HTTP/3 uses QUIC (over UDP) for even faster connections.',
        advanced:
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
        content:
          'HTML (HyperText Markup Language) defines *what* is on the page. It uses tags — words in ' +
          'angle brackets — to label content. `<h1>` says "this is a main heading." `<p>` says "this ' +
          'is a paragraph." `<img>` places an image. `<a href="...">` creates a clickable link. ' +
          'Tags usually come in pairs: `<p>Hello</p>` — the opening tag, the content, and the closing ' +
          'tag. The browser reads these tags from top to bottom and lays out the page accordingly. ' +
          'HTML does not control colors, fonts, or animations — that is CSS\'s job. HTML only says ' +
          '"there is a heading here, a paragraph here, an image here." Think of it as the blueprint ' +
          'of a house: it shows where the rooms and doors are, but not what color the walls are.',
        goDeeper:
          'Semantic HTML elements convey meaning: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>. Screen readers rely on semantic elements to navigate. Forms: <form>, <input type="email" required>, <select>, <textarea>. The required and pattern attributes provide client-side validation. Tables use <table>, <thead>, <tbody>, <tr>, <th>, <td> — never for page layout. The <template> and <slot> elements enable Web Components — reusable custom HTML elements with encapsulated styles.',
        advanced:
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
        content:
          'CSS (Cascading Style Sheets) controls *how* things look. It uses rules that target HTML ' +
          'elements and apply visual properties. The rule `h1 { color: blue; font-size: 24px; }` ' +
          'makes all main headings blue and 24 pixels tall. You can target elements by tag name (h1), ' +
          'by class name (.card), or by ID (#header). CSS handles colors, fonts, spacing (margin and ' +
          'padding), layout (flexbox and grid), borders, shadows, and even animations. The "cascading" ' +
          'part means that multiple rules can apply to the same element, and the most specific rule ' +
          'wins. CSS is what makes the difference between a plain white page of text and a beautiful, ' +
          'professional website.',
        goDeeper:
          'The CSS box model: content → padding → border → margin. box-sizing: border-box includes padding and border in width. Flexbox: display: flex; justify-content: space-between; align-items: center. Grid: display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem. Media queries for responsive design: @media (max-width: 768px) { .sidebar { display: none; } }. CSS transitions: transition: all 0.3s ease adds smooth animations to property changes.',
        advanced:
          'Modern CSS features: container queries (@container) style based on parent size, :has() selects parents based on children, CSS layers (@layer) control cascade ordering. CSS Custom Properties (--color: #2563eb) enable theming. The cascade resolves by specificity: inline (1000) > IDs (100) > classes (10) > elements (1). PostCSS and Tailwind CSS represent different approaches to CSS architecture — utility-first (small, composable classes) vs component-based (BEM methodology). CSS Houdini APIs let developers extend CSS with custom properties, layouts, and paint worklets.',
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
        goDeeper:
          'Core concepts: variables (let, const), functions (arrow: (a,b) => a+b), arrays ([1,2,3].map(x => x*2)), objects ({name: "Ranga", age: 25}). DOM: document.querySelector(".btn").addEventListener("click", handler). Template literals: `Hello ${name}`. Async: fetch("/api").then(r => r.json()). Error handling: try { risky() } catch(e) { console.error(e) }. The console object: .log(), .error(), .table(), .time()/.timeEnd() for debugging.',
        advanced:
          'ES6+ features: destructuring ({name, age} = obj), spread ([...arr1, ...arr2]), optional chaining (obj?.prop), nullish coalescing (val ?? default). The event loop: microtasks (Promises) run before macrotasks (setTimeout). Closures capture variables from outer scope — enabling private state and factory functions. Prototypal inheritance differs from classical OOP: objects inherit directly from other objects via the prototype chain. TypeScript adds static type checking: function add(a: number, b: number): number — catching type errors at compile time rather than runtime.',
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
        goDeeper:
          'DevTools inspection: right-click any element → Inspect to see its HTML, applied CSS rules, computed styles, and JavaScript event listeners. The Elements panel shows the live DOM (which may differ from the source HTML after JavaScript modifies it). The Console panel lets you run JavaScript interactively: document.querySelectorAll("p").length counts all paragraphs. The Network tab shows every resource loaded, its size, and timing — essential for diagnosing slow pages.',
        advanced:
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
        goDeeper:
          'DOM manipulation methods: document.createElement("div") creates an element; parent.appendChild(child) adds it to the page; element.remove() deletes it. Event delegation: instead of adding listeners to 100 list items, add one to the parent: ul.addEventListener("click", e => { if(e.target.tagName === "LI") handle(e.target) }). This uses event bubbling — events propagate up the DOM tree from the target to the root. Forms: form.addEventListener("submit", e => { e.preventDefault(); const data = new FormData(form); }).',
        advanced:
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
        goDeeper:
          'Mobile-first design: start with the smallest screen layout, then add complexity for larger screens using min-width media queries: @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }. The viewport meta tag (<meta name="viewport" content="width=device-width, initial-scale=1">) prevents mobile browsers from zooming out. Relative units: rem (relative to root font size), em (relative to parent), vw/vh (viewport width/height), % (parent size). Touch targets should be at least 44×44 CSS pixels for accessibility.',
        advanced:
          'Container queries (@container) enable components to adapt based on their parent\'s size rather than the viewport — crucial for reusable components that may appear in sidebars or main content areas. The CSS clamp() function (font-size: clamp(1rem, 2.5vw, 2rem)) creates fluid typography that scales smoothly between breakpoints. The :has() selector enables parent styling based on children (:has(> img) styles containers that contain images). These modern CSS features reduce JavaScript dependency for responsive behavior.',
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
        goDeeper:
          'An Arduino Uno uses the ATmega328P: 16 MHz clock, 32 KB flash (program), 2 KB SRAM (variables), 1 KB EEPROM (persistent). Compare to your phone: ~2 GHz (125× faster), 4-8 GB RAM (2 million × more). Yet Arduino excels at real-time hardware control — no OS overhead. analogRead(A0) returns 0-1023 (10-bit, 0-5V) in ~100 μs. analogWrite(pin, 0-255) uses PWM at ~490 Hz. Digital pins source/sink up to 20 mA — enough for an LED but not a motor (use a transistor or motor driver).',
        advanced:
          'The Arduino ecosystem spans 8-bit AVR (Uno, Nano) to 32-bit ARM (Due, Teensy 4.x at 600 MHz), RISC-V, and ESP32 (dual-core 240 MHz with WiFi/Bluetooth). Real-time operating systems (FreeRTOS on ESP32) enable multitasking. Direct register manipulation (PORTB |= (1 << PB5)) switches pins in ~62 ns vs ~4 μs for digitalWrite. Interrupts (attachInterrupt) respond within microseconds for encoder reading and communication protocols. The PlatformIO ecosystem provides cross-platform builds, unit testing, and library management for professional embedded development.',
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
        goDeeper:
          'The Arduino program structure: setup() runs once at power-on, loop() runs repeatedly. Essential functions: pinMode(pin, OUTPUT/INPUT/INPUT_PULLUP), digitalWrite(pin, HIGH/LOW), digitalRead(pin), analogRead(pin) → 0-1023, analogWrite(pin, 0-255), Serial.begin(9600), Serial.println(value), delay(ms), millis() (time since boot). A temperature logger: void loop() { int raw = analogRead(A0); float tempC = (raw * 5.0 / 1024.0 - 0.5) * 100; Serial.println(tempC); delay(1000); }.',
        advanced:
          'Non-blocking programming replaces delay() with millis() timing: if (millis() - lastRead > 1000) { lastRead = millis(); readSensor(); }. This handles multiple tasks simultaneously. **State machines** organize complex behavior: define states (IDLE, READING, ALERTING), transitions (IDLE→READING on timer), and actions for each state. This pattern scales from simple projects to industrial controllers. Watchdog timers (WDT) automatically reset the microcontroller if code hangs — essential for unattended deployments like weather stations and wildlife monitoring sensors.',
        diagram: 'SetupLoopDiagram',
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
        goDeeper:
          'Digital signals have two states: HIGH (5V on Arduino Uno) and LOW (0V). Like a light switch — on or off. Analog signals vary continuously between 0V and 5V. The Arduino reads analog with analogRead() returning 0-1023 (10-bit ADC: 2^10 = 1024 levels). Resolution: 5V/1024 ≈ 4.88 mV per step. analogWrite() uses PWM (Pulse Width Modulation) — rapidly switching between HIGH and LOW. duty cycle 50% = average 2.5V, 75% = 3.75V. LEDs dimmed this way flicker at ~490 Hz — too fast for your eye to see, so it looks like smooth dimming.',
        advanced:
          'ADC conversion time on the Arduino Uno is ~100 μs (10,000 samples/second max). For faster sampling, configure the ADC prescaler: ADCSRA = (ADCSRA & 0xF8) | 0x04 sets prescaler to 16, achieving ~77 kHz sampling at reduced accuracy. External ADCs (ADS1115: 16-bit, MCP3008: 10-bit SPI) provide better resolution and speed. DAC (Digital-to-Analog Converter) output is not available on the Uno — use PWM with an RC low-pass filter (R=10kΩ, C=100nF, cutoff ~159 Hz) to smooth the PWM into a true analog voltage for audio or control applications.',
        diagram: 'DigitalAnalogDiagram',
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
        goDeeper:
          'Common sensors and their interfaces: **Temperature** (LM35: analog, 10mV/°C; DHT22: digital, temp+humidity), **Light** (LDR: analog voltage divider; BH1750: I2C digital lux meter), **Distance** (HC-SR04 ultrasonic: trigger pulse, measure echo time; distance = time × 343/2 m/s), **Motion** (PIR: digital HIGH when motion detected), **Accelerometer** (MPU6050: I2C, 3-axis acceleration + gyroscope). Sensor readings are noisy — averaging 10 readings smooths the signal: total = 0; for(int i=0; i<10; i++) total += analogRead(A0); avg = total/10.',
        advanced:
          'I2C (Inter-Integrated Circuit) connects multiple sensors on just 2 wires (SDA, SCL). Each device has a unique 7-bit address (0x00-0x7F). The Wire library handles communication: Wire.beginTransmission(addr); Wire.write(reg); Wire.endTransmission(); Wire.requestFrom(addr, bytes). SPI (Serial Peripheral Interface) uses 4 wires but is faster (up to 10 MHz vs I2C\'s 400 kHz). Sensor fusion algorithms (complementary filter, Kalman filter) combine accelerometer and gyroscope data to get accurate orientation — essential for drone stabilization, robot balancing, and motion tracking.',
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
        goDeeper:
          'NumPy arrays vs Python lists: np.arange(1_000_000).sum() runs **50-100× faster** than sum(range(1_000_000)) because NumPy uses compiled C loops on contiguous memory. Array creation: np.zeros((3,4)), np.ones(5), np.linspace(0, 2*np.pi, 100), np.random.randn(1000). Array attributes: a.shape, a.dtype, a.ndim, a.size. Reshaping: np.arange(12).reshape(3,4). Broadcasting: a * 2 doubles every element; a + np.array([1,2,3,4]) adds to every row.',
        advanced:
          'NumPy\'s vectorized operations replace Python loops with C-compiled array expressions. Matrix operations: A @ B (multiply), np.linalg.inv(A), np.linalg.eig(A), np.linalg.svd(A). np.fft.fft(signal) computes the FFT. Memory layout (row-major vs column-major) affects cache performance — iterating the wrong axis can be 10× slower. Advanced indexing: a[a > threshold] (boolean mask), a[indices] (fancy indexing), np.where(condition, x, y). Structured arrays store heterogeneous data (names, weights, coordinates) in contiguous memory for efficient processing.',
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
        goDeeper:
          'NumPy achieves 50-100× speed over Python lists through: (1) contiguous memory layout (no pointer chasing), (2) compiled C/Fortran inner loops (no Python interpreter overhead), (3) SIMD instructions (Single Instruction Multiple Data — process 4-8 numbers simultaneously). Benchmark: squaring 1 million numbers — Python list: ~150ms, NumPy: ~1.5ms. The speedup increases with array size because the fixed overhead of calling NumPy becomes negligible. Memory efficiency: a Python list of 1M integers uses ~28 MB (each int is a 28-byte object), while a NumPy int64 array uses ~8 MB (raw 8-byte values in contiguous memory).',
        advanced:
          'NumPy delegates heavy computation to optimized libraries: BLAS (Basic Linear Algebra Subprograms) for matrix multiplication, LAPACK for eigenvalues and decompositions. These libraries use cache-blocking (processing data in chunks that fit in CPU cache), loop unrolling, and architecture-specific SIMD instructions. Intel\'s MKL and OpenBLAS provide multithreaded implementations. np.dot(A, B) for 1000×1000 matrices runs in ~20ms using these optimized kernels — a naive Python triple loop would take ~3 hours. Understanding this stack matters when debugging performance: if NumPy is slow, check whether you\'re accidentally creating Python loops instead of vectorized operations.',
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
        goDeeper:
          'Array creation patterns: np.zeros((rows, cols)) for initialized arrays, np.empty((rows, cols)) for uninitialized (faster but contains garbage), np.full((3,3), 7) for a specific value, np.eye(n) for identity matrix, np.diag([1,2,3]) for diagonal matrix. Random: np.random.seed(42) for reproducibility, np.random.randint(0, 100, size=(5,5)) for integers, np.random.normal(mean, std, size) for Gaussian. Structured arrays: dt = np.dtype([("name", "U20"), ("weight", "f4")]); data = np.array([("Ranga", 4500)], dtype=dt) — named fields like a database row.',
        advanced:
          'Memory layout: np.array([[1,2],[3,4]], order="C") stores rows contiguously (C order), while order="F" stores columns contiguously (Fortran order). Iterating along the contiguous axis is 3-10× faster due to CPU cache behavior. np.ascontiguousarray() converts layout. Views vs copies: slicing creates a view (shared memory): b = a[::2] modifies a. np.copy() creates an independent copy. Check with np.shares_memory(a, b). Memory-mapped files (np.memmap) work with datasets larger than RAM — the OS pages data in/out of memory transparently.',
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
        goDeeper:
          'Element-wise operations: a + b, a * b, a ** 2, np.sqrt(a), np.sin(a) all operate on every element without loops. Comparison: a > 5 returns a boolean array. Aggregation: a.sum(), a.mean(), a.max(), a.min(), a.std() — add axis= parameter for row/column operations: a.sum(axis=0) sums each column, axis=1 sums each row. Universal functions (ufuncs) like np.add, np.multiply accept an out= parameter for in-place operation, avoiding temporary array allocation.',
        advanced:
          'Broadcasting rules: when operating on arrays of different shapes, NumPy automatically expands dimensions. Rules: (1) prepend 1s to the shorter shape, (2) dimensions of size 1 stretch to match the other. Example: (3,4) + (4,) → (3,4) + (1,4) → (3,4) — each row gets the (4,) array added. (3,1) + (1,4) → (3,4) — outer product-like behavior. Broadcasting avoids creating large temporary arrays: centering data (a - a.mean(axis=0)) broadcasts the mean across all rows without copying. Einstein summation (np.einsum("ij,jk->ik", A, B)) provides a powerful notation for complex tensor operations.',
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
        goDeeper:
          'Statistical operations: weights = np.array([4500, 3200, 4800, 5100, 3800]). Mean: np.mean(weights) = **4280**. Median: np.median(weights) = 4500. Std dev: np.std(weights) ≈ 716. Percentiles: np.percentile(weights, 75) = 4800. Sorting: np.sort(weights). Argmax: np.argmax(weights) = 3 (index of 5100). Boolean indexing: heavy = weights[weights > 4000] → [4500, 4800, 5100]. These operations run on entire arrays without Python loops.',
        advanced:
          'Real-world data analysis: loading CSV with np.genfromtxt("data.csv", delimiter=",", skip_header=1). Handling missing values: np.nanmean(data) ignores NaN. Linear regression via least squares: β = (XᵀX)⁻¹Xᵀy, computed as np.linalg.lstsq(X, y). Image processing: a grayscale image is a 2D array; image[100:200, 50:150] crops; np.mean(image, axis=0) averages along rows. Memory-mapped arrays (np.memmap) handle datasets larger than RAM by mapping file contents directly to memory.',
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
        goDeeper:
          'Data dimensionality: 1D array = time series or sensor readings, 2D = spreadsheet/table or grayscale image, 3D = color image (height × width × channels) or time series of 2D frames, 4D = batch of images (batch × height × width × channels). Reshape without copying: a.reshape(3, -1) infers the second dimension. Transpose: a.T swaps axes. Stacking: np.vstack((a, b)) vertical, np.hstack horizontal, np.concatenate along any axis. The shape attribute is your most-used diagnostic tool — print(data.shape) should be your first debugging step.',
        advanced:
          'The NumPy → Pandas → scikit-learn pipeline: NumPy arrays hold the numerical data, Pandas DataFrames add labeled columns and handle missing values (NaN), scikit-learn models accept NumPy arrays or DataFrames for training. Image data flows: file → PIL/OpenCV → np.array → normalize to 0-1 → reshape for model. Audio: file → scipy.io.wavfile → np.array → FFT/spectrogram → feature extraction. Geospatial: rasterio reads GeoTIFF satellite images as NumPy arrays with coordinate metadata. Understanding how data flows between these libraries is as important as knowing any single library.',
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
        goDeeper:
          'Pearson correlation r measures linear association: r = Σ[(xᵢ-x̄)(yᵢ-ȳ)] / √[Σ(xᵢ-x̄)² × Σ(yᵢ-ȳ)²]. r = +1 (perfect positive), r = 0 (no linear relationship), r = -1 (perfect negative). Example: elephant height vs weight r ≈ 0.85 (strong positive). **Correlation ≠ causation**: ice cream sales and drowning deaths are correlated (both increase in summer) but ice cream doesn\'t cause drowning — the confounding variable is temperature. Always ask: is there a plausible mechanism? Could a third variable explain both?',
        advanced:
          'Spearman rank correlation measures monotonic (not necessarily linear) association — based on the ranks of values rather than the values themselves. It is robust to outliers and works for non-linear relationships. In research, partial correlation controls for confounding variables: the partial correlation between ice cream and drowning, controlling for temperature, is near zero. Multiple regression separates the contributions of several predictors simultaneously. Granger causality tests whether past values of X improve predictions of Y beyond what past values of Y alone provide — a temporal (not true causal) test used in economics and neuroscience.',
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
        goDeeper:
          'Anscombe\'s quartet: four datasets with identical statistical summaries (mean, variance, correlation, regression line) but completely different visual patterns — one linear, one curved, one with an outlier, one vertical cluster. Without plotting, you would think they are identical. The data literacy principle: **always plot your data before computing statistics**. Matplotlib\'s `plt.scatter(x, y)` takes seconds and can reveal patterns, outliers, and non-linearities that summary statistics hide. Box plots (`plt.boxplot(data)`) show median, quartiles, and outliers in one compact visualization.',
        advanced:
          'Edward Tufte\'s principles of graphical excellence: maximize the data-ink ratio (remove chartjunk — unnecessary gridlines, 3D effects, decorative elements), show the data above all else, and avoid distorting what the data say. The **lie factor** = (size of effect shown in graphic) / (size of effect in data) — it should be close to 1. Common distortions: truncated y-axes that exaggerate small changes, 3D pie charts where perspective distorts proportions, and dual y-axes that imply false correlations. Choosing the right chart type: use line charts for time series, scatter plots for relationships, bar charts for comparisons, and histograms for distributions.',
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
        goDeeper:
          'Essential plot types: plt.plot(x, y) (line), plt.scatter(x, y, c=colors, s=sizes), plt.bar(categories, values), plt.hist(data, bins=30), plt.imshow(matrix, cmap="viridis"). Multi-panel: fig, axes = plt.subplots(2, 2, figsize=(10, 8)). Always label axes: ax.set_xlabel("Distance (km)"), ax.set_ylabel("Count"), ax.set_title("Elephant Sightings"). Save with plt.savefig("plot.png", dpi=150, bbox_inches="tight"). Use plt.tight_layout() to prevent overlapping labels.',
        advanced:
          'Publication-quality figures: set font sizes (plt.rcParams["font.size"] = 12), use colorblind-friendly palettes (viridis, cividis), add error bars (ax.errorbar(x, y, yerr=errors)). **Seaborn** provides statistical visualization: sns.heatmap(corr, annot=True), sns.violinplot(x="species", y="weight", data=df), sns.pairplot(df). For interactive exploration, **Plotly** creates zoomable, hoverable charts. **Altair** uses a declarative grammar of graphics. Each library has strengths: matplotlib for full control, seaborn for statistics, plotly for interactivity, altair for rapid exploration.',
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
        goDeeper:
          'Every matplotlib figure has a hierarchy: **Figure** (the canvas) → **Axes** (a single plot within the figure) → plot elements (lines, markers, text, legends). The object-oriented interface: fig, ax = plt.subplots(). ax.plot(x, y) adds a line. ax.set_xlabel(), ax.set_ylabel(), ax.set_title() label it. ax.legend() shows a key. ax.set_xlim(0, 100), ax.set_ylim(0, 50) control axis ranges. fig.savefig("plot.png", dpi=150) saves. The difference: plt.plot() is the quick "state-based" interface; ax.plot() is the explicit OO interface — use OO for anything beyond a quick look.',
        advanced:
          'Customization layers: rcParams set global defaults (plt.rcParams["font.family"] = "serif"), style sheets (plt.style.use("ggplot")) apply themed presets, and per-element kwargs override everything. Axes positioning: fig.add_axes([left, bottom, width, height]) for arbitrary placement (values 0-1 relative to figure). GridSpec provides flexible multi-panel layouts: gs = fig.add_gridspec(3, 3); ax1 = fig.add_subplot(gs[0, :]); ax2 = fig.add_subplot(gs[1:, 0]). Animation: FuncAnimation(fig, update, frames=100) creates animated plots — useful for real-time sensor data visualization.',
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
        goDeeper:
          'Color palettes: sequential (light→dark for ordered data: "viridis", "plasma"), diverging (two-color gradient for data with a meaningful center: "coolwarm", "RdBu"), qualitative (distinct colors for categories: "Set2", "tab10"). **Colorblind-safe**: viridis, cividis (avoid red-green). Set color with c= or color= parameter. Marker styles: "o" (circle), "s" (square), "^" (triangle), "+" (plus). Line styles: "-" (solid), "--" (dashed), ":" (dotted). Alpha transparency (alpha=0.5) helps with overlapping data points in scatter plots.',
        advanced:
          'Effective data visualization follows principles: (1) data-ink ratio — maximize information per pixel, minimize decoration; (2) small multiples — repeated similar charts for comparison (use plt.subplots with shared axes); (3) annotation — ax.annotate("Peak", xy=(x, y), arrowprops=dict(arrowstyle="->")) draws attention to key features. Color perception: luminance (brightness) should encode the quantitative dimension because it is perceived linearly, while hue (color) should encode categories. Tools like ColorBrewer (colorbrewer2.org) provide tested palettes. Always include a colorbar for colormapped plots (plt.colorbar()).',
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
        goDeeper:
          'Publication workflow: (1) fig, ax = plt.subplots(figsize=(6, 4)) for journal-width figure, (2) set font: plt.rcParams.update({"font.size": 11, "font.family": "serif"}), (3) use LaTeX labels: ax.set_xlabel(r"Temperature ($^\\circ$C)"), (4) add error bars: ax.errorbar(x, y, yerr=err, fmt="o", capsize=3), (5) tight_layout() prevents clipping, (6) save as vector: fig.savefig("fig.pdf") for journals or fig.savefig("fig.svg") for web. PDF/SVG scale perfectly at any size; use PNG (dpi=300) only when vector is not supported.',
        advanced:
          'Reproducible figures: save the plotting script alongside the figure so colleagues can modify it. Matplotlib backends: "Agg" (non-interactive, for scripts/servers), "TkAgg" (interactive window), "WebAgg" (browser-based). Jupyter integration: %matplotlib inline for static, %matplotlib widget for interactive. For interactive dashboards, consider Dash (Plotly), Streamlit, or Panel — they wrap matplotlib/plotly in web apps with sliders, dropdowns, and real-time updates. Publishing: many journals accept matplotlib figures directly; Nature and Science have specific style guides that can be encoded as matplotlib style sheets.',
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
        goDeeper:
          'The ML pipeline: (1) Collect data → (2) Clean/preprocess → (3) Split train/test (80/20) → (4) Choose model → (5) Train → (6) Evaluate → (7) Tune hyperparameters → (8) Deploy. **Overfitting**: model memorizes training data but fails on new data. Signs: high training accuracy, low test accuracy. Remedies: more data, simpler model, regularization, dropout. **Underfitting**: model too simple. The learning curve (plot accuracy vs training set size) diagnoses which problem you have.',
        advanced:
          'The **bias-variance tradeoff**: bias = error from oversimplifying, variance = error from over-sensitivity to training data. Total error = bias² + variance + irreducible noise. A linear model has high bias but low variance. A deep neural network has low bias but high variance. **Regularization** (L1/L2 penalties) and **ensemble methods** (random forests average many trees) navigate this tradeoff. The No Free Lunch theorem proves no single algorithm is best for all problems — domain knowledge guides model selection.',
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
        goDeeper:
          'Classification assigns items to categories: spam/not-spam, cat/dog, elephant/rhino. Regression predicts continuous values: temperature tomorrow, elephant weight from height. The difference matters because they use different loss functions: classification minimizes misclassification rate (or cross-entropy), regression minimizes squared error. A classifier\'s output is a category label (or probability per category); a regressor\'s output is a number. Some algorithms (decision trees, neural networks) can do both.',
        advanced:
          'The relationship between classification and function approximation: a classifier learns a decision boundary — a surface in feature space that separates classes. A linear classifier\'s boundary is a hyperplane (line in 2D, plane in 3D). A decision tree\'s boundary is a set of axis-aligned rectangular regions. A neural network\'s boundary can be arbitrarily complex. The universal approximation theorem states that a neural network with one hidden layer can approximate any continuous function — but it says nothing about how large the layer must be or how to find the right weights.',
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
        goDeeper:
          'Supervised learning provides labeled examples: (input, correct_output) pairs. The model adjusts its internal parameters to minimize the difference between its predictions and the correct outputs. This is analogous to a teacher showing flashcards with pictures (inputs) and names (labels). With enough examples, the model generalizes — it correctly labels inputs it has never seen before. The critical question is: did it learn the concept, or just memorize the examples?',
        advanced:
          'Unsupervised learning finds structure without labels: clustering groups similar items (k-means, DBSCAN), dimensionality reduction finds compact representations (PCA, t-SNE), and anomaly detection identifies outliers. Self-supervised learning creates its own labels from data structure — BERT masks random words and predicts them, learning language representation. Contrastive learning (SimCLR) learns image features by maximizing agreement between different augmentations of the same image. These methods are essential when labeled data is scarce or expensive.',
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
        goDeeper:
          'Feature engineering transforms raw data into model inputs. For elephant tracking: GPS → distance_to_water, vegetation_density, time_of_day, season. **One-hot encoding**: species=["Asian","African"] → [1,0] or [0,1]. Feature scaling: StandardScaler (mean=0, std=1) or MinMaxScaler (0-1). Gradient descent: w_new = w_old - lr × ∂loss/∂w. Learning rate too high → diverges; too low → slow. Feature selection removes irrelevant inputs that add noise without improving predictions.',
        advanced:
          'Transfer learning reuses pretrained models: ResNet on ImageNet can be fine-tuned for elephant ID with ~500 images. **SHAP values** provide game-theory-based explanations for individual predictions. **Bayesian optimization** efficiently searches hyperparameter space. Neural Architecture Search (NAS) uses ML to design ML architectures. The feature importance hierarchy often reveals surprises — in wildlife tracking, time-of-day may matter more than GPS location because animal behavior follows circadian patterns. Domain expertise combined with automated feature selection produces the best models.',
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
        goDeeper:
          'A feature vector is a list of numbers describing an observation. For an elephant: [weight_kg, height_m, tusk_length_cm, ear_area_m2, age_years] = [4500, 2.8, 60, 1.2, 25]. Each number is a dimension in feature space — this elephant is a point in 5D space. Similar elephants are nearby points; different species are far apart. Feature engineering chooses which measurements matter: tusk_length distinguishes Asian from African elephants, but tail_length probably does not. Good features make classification easy; poor features make it impossible regardless of the algorithm.',
        advanced:
          'Feature spaces can be visualized using dimensionality reduction. PCA (Principal Component Analysis) projects high-dimensional data onto the 2-3 directions of maximum variance. t-SNE and UMAP create 2D maps that preserve local neighborhoods — similar points stay close. These visualizations reveal cluster structure, outliers, and class overlap before training any model. In deep learning, the network learns its own features: early layers detect edges and textures, middle layers detect parts (ears, trunks), and final layers detect whole objects — automatically constructing a feature hierarchy from raw pixels.',
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
        goDeeper:
          'In supervised learning, each training example has a **label** — the correct answer the model should learn to predict. For classification: labels are categories (elephant, rhino, deer). For regression: labels are numbers (weight: 4500 kg). Labels can be hard to obtain: labeling 10,000 camera trap images requires human experts to examine each one. **Active learning** selects the most informative unlabeled examples for human annotation, reducing labeling effort by 50-80%. **Weak supervision** uses heuristic labeling functions (if image is near water AND large body → probably elephant) to generate approximate labels at scale.',
        advanced:
          'Label quality directly impacts model quality — "garbage in, garbage out." Inter-annotator agreement (Cohen\'s kappa) measures labeling consistency between humans. For ambiguous tasks (sentiment analysis, medical diagnosis), even expert humans disagree ~10-20% of the time — this sets an upper bound on model accuracy. **Label noise** (incorrect labels in training data) degrades performance; noise-robust loss functions (symmetric cross-entropy, generalized cross-entropy) and co-teaching (two models filter each other\'s noisy labels) help. **Semi-supervised learning** leverages large amounts of unlabeled data alongside small labeled sets — FixMatch achieves near-supervised accuracy with only 7 labeled images per class on CIFAR-10.',
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
        goDeeper:
          'The train-test split prevents self-deception. If you evaluate on the same data you trained on, a model that memorized everything scores 100% — but fails on new data. The standard split: 80% train, 20% test. Never let the model see test data during training. **Cross-validation** (k-fold): divide data into k parts, train on k-1, test on 1, rotate k times. Average the k scores for a robust estimate. 5-fold or 10-fold is standard. Stratified splits ensure each fold has the same class proportions as the full dataset.',
        advanced:
          'Data leakage occurs when information from the test set contaminates training — invalidating results. Common sources: (1) normalizing before splitting (the mean/std includes test data), (2) feature selection on the full dataset, (3) duplicate data points in both sets. Always split first, then preprocess. Time series data requires chronological splits (train on past, test on future) — random splits leak future information. In production, model monitoring detects **data drift** (input distribution changes) and **concept drift** (the relationship between inputs and outputs changes) — triggering retraining when performance degrades.',
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
        goDeeper:
          'KNN algorithm: for a new data point, (1) compute distance to all training points, (2) find the k closest, (3) majority vote determines the class. Distance metric matters: Euclidean (straight line), Manhattan (city blocks), cosine (angle between vectors — common for text). k=1 is noisy (single neighbor decides), k=too large includes distant irrelevant points. Typical: k=5 or k=√n. Feature scaling is critical: if weight is 3000-5000 and height is 1-3, distance is dominated by weight. Standardize first.',
        advanced:
          'KNN is a "lazy learner" — it stores all training data and computes at prediction time (no training phase). This makes prediction slow for large datasets: O(nd) per query for n training points in d dimensions. KD-trees and ball trees speed this to O(d·log n) for low-dimensional data but degrade in high dimensions. For very large datasets, approximate nearest neighbor methods (Annoy, FAISS, ScaNN) trade exact results for massive speedups — enabling billion-scale similarity search for recommendation engines and image retrieval systems.',
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
        goDeeper:
          'Overfitting signs: training accuracy is high but test accuracy is much lower — the gap between them indicates the degree of overfitting. A model that achieves 99% training accuracy but only 60% test accuracy has memorized the training data. Remedies: (1) more training data, (2) simpler model (fewer parameters), (3) regularization (add a penalty for large weights), (4) dropout (randomly disable neurons during training), (5) early stopping (stop training when validation loss starts increasing).',
        advanced:
          'The bias-variance decomposition: Expected Error = Bias² + Variance + Irreducible Noise. High bias (underfitting): model is too simple — increase complexity, add features, train longer. High variance (overfitting): model is too sensitive to training data — get more data, simplify, regularize. Learning curves plot performance vs training set size: if train and test curves converge at high error → high bias; if they stay far apart → high variance. Ensemble methods (bagging reduces variance, boosting reduces bias) systematically address these issues.',
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
        goDeeper:
          'For binary classification (elephant/not-elephant): **Accuracy** = (TP + TN) / total — misleading when classes are imbalanced (99% "not elephant" in camera traps → always predicting "not elephant" gives 99% accuracy). **Precision** = TP / (TP + FP) — of all predicted elephants, how many were real? **Recall** = TP / (TP + FN) — of all real elephants, how many did we detect? **F1 score** = 2 × (Precision × Recall) / (Precision + Recall) — harmonic mean balancing both. For conservation: high recall is critical (missing a real elephant is worse than a false alarm).',
        advanced:
          'The **ROC curve** plots True Positive Rate (recall) vs False Positive Rate at every classification threshold. AUC (Area Under the ROC Curve) summarizes: AUC = 1.0 is perfect, 0.5 is random guessing. The **precision-recall curve** is more informative for imbalanced datasets. At each threshold, different precision-recall tradeoffs are available — choosing the threshold is a business decision. In medical screening: high recall (catch all disease cases) even at the cost of lower precision (more false positives requiring follow-up tests). In spam filtering: high precision (never lose real email) with acceptable recall.',
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
        goDeeper:
          'A confusion matrix is a table where rows represent actual classes and columns represent predicted classes. For 3 classes (elephant, rhino, deer), a 3×3 matrix shows counts for each actual→predicted combination. The diagonal shows correct predictions; off-diagonal elements show specific error patterns. If the model often confuses elephants with rhinos (high count in elephant-row, rhino-column), that reveals which classes need better features. Normalize rows to get per-class accuracy rates.',
        advanced:
          'Multi-class metrics extend binary concepts: macro-average computes metric per class then averages (treats all classes equally), micro-average pools all predictions (dominated by the majority class), weighted average accounts for class sizes. Cohen\'s kappa adjusts for chance agreement — important when classes are imbalanced. In multi-label classification (an image can contain both elephant AND rhino), each sample can have multiple correct labels — the Hamming loss measures the fraction of labels that are incorrect.',
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
        goDeeper:
          'ML applications across domains: **Computer Vision** — image classification, object detection, face recognition, medical imaging (detecting tumors in X-rays). **Natural Language Processing** — translation, sentiment analysis, chatbots, text summarization. **Audio** — speech recognition, music recommendation, species identification from calls. **Tabular data** — fraud detection, credit scoring, weather prediction. **Robotics** — navigation, grasping, autonomous driving. The same fundamental algorithms (neural networks, trees, SVMs) adapt to all these domains through appropriate feature engineering and architecture choices.',
        advanced:
          'The ML deployment cycle: (1) offline training on historical data, (2) model validation on held-out test set, (3) A/B testing against the current system with real users, (4) gradual rollout with monitoring, (5) continuous retraining as new data arrives. **MLOps** tools (MLflow, Weights & Biases, Kubeflow) track experiments, version models, and automate deployment. Edge deployment (running models on devices like phones, drones, or Arduino-class hardware) uses model compression: quantization (32-bit → 8-bit weights), pruning (removing unimportant connections), and knowledge distillation (training a small "student" model to mimic a large "teacher").',
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
        goDeeper:
          'A decision tree asks a sequence of binary questions to classify data. At each node, it picks the feature and threshold that best separates the classes. "Best" is measured by information gain (decrease in entropy) or Gini impurity. For elephant classification: "Is weight > 4000 kg?" → Yes branch: "Is ear area > 1.5 m²?" → African. Trees are interpretable — you can follow the decision path for any prediction. But single trees overfit easily — deep trees memorize training data.',
        advanced:
          'Random forests and gradient boosting overcome single-tree weaknesses. **Random Forest**: train many trees on random subsets of data and features, then majority-vote. Reduces variance while maintaining low bias. **Gradient Boosting** (XGBoost, LightGBM): train trees sequentially, each correcting the errors of the previous ensemble. Often the top performer on tabular data. Feature importance: count how often each feature is used for splitting (or measure the total impurity reduction). SHAP values provide theoretically grounded feature importance that satisfies uniqueness, symmetry, and additivity axioms.',
        diagram: 'DecisionTreeDiagram',
      },
      {
        title: 'The Gaussian Distribution — The Shape of Uncertainty',
        content:
          'When you measure anything natural — heights of students, sensor readings from elephants, ' +
          'temperatures across a week — and plot how often each value occurs, the shape almost always ' +
          'looks like a bell. Most values cluster near the average, and extreme values are rare.\n\n' +
          'This "bell curve" is the **Gaussian (normal) distribution**, and it is the single most ' +
          'important shape in all of statistics and machine learning. Two numbers fully describe it: ' +
          'the **mean** (μ, the center) and the **standard deviation** (σ, the spread).\n\n' +
          'With two variables (say, frequency and amplitude of elephant rumbles), the Gaussian becomes ' +
          'a 3D hill viewed from above as contour ellipses. If the variables are **correlated** (high ' +
          'frequency tends to come with high amplitude), the ellipses tilt. Understanding this shape ' +
          'is essential — almost every ML algorithm assumes or builds on Gaussian distributions.',
        goDeeper:
          'The univariate Gaussian PDF is f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²). The key insight: 68% of data falls within ±1σ of the mean, 95% within ±2σ, and 99.7% within ±3σ (the "68-95-99.7 rule"). For two variables, the bivariate Gaussian introduces a **correlation coefficient** ρ that controls how the ellipse tilts. When ρ=0, variables are independent and the contours are axis-aligned. The covariance matrix Σ encodes both the spread (σ values) and the correlation (ρ). Its eigenvectors are the principal axes of the ellipse — the "natural" directions of the data.',
        advanced:
          'The multivariate Gaussian in k dimensions: f(x) = (2π)^(-k/2) |Σ|^(-1/2) exp(-½(x-μ)ᵀΣ⁻¹(x-μ)). The quadratic form (x-μ)ᵀΣ⁻¹(x-μ) is the **Mahalanobis distance** squared — a distance metric that accounts for correlation and scale. Points at equal Mahalanobis distance form ellipsoids. The precision matrix Σ⁻¹ appears in Gaussian Naive Bayes, Gaussian Mixture Models, and the loss functions of many deep learning systems. PCA is equivalent to rotating coordinates to diagonalize Σ — the eigenvectors become the new axes and the eigenvalues the variance along each.',
        interactive: { type: 'gaussian-explorer' as const, props: {} },
      },
      {
        title: 'Contour Plots — Seeing Probability from Above',
        content:
          'A contour plot is what you get when you look straight down at a 3D surface. If you have ever ' +
          'used a hiking trail map with elevation lines, you already understand contour plots.\n\n' +
          'In ML, the "mountain" is a probability distribution. The peak is where data points are most ' +
          'likely to appear. The contour lines mark equal-probability boundaries — like elevation rings ' +
          'on a mountain. When a classifier says "95% confident," it means the data point falls inside ' +
          'the innermost contour ring of its predicted class.\n\n' +
          'The shape of the contour tells you about the data: circular contours mean two features are ' +
          'independent. Tilted ellipses mean they are correlated. A narrow ellipse along one axis means ' +
          'most of the variation is in that direction — which is exactly what PCA finds.',
        goDeeper:
          'Decision boundaries in Gaussian classifiers follow from equating the log-likelihoods of two classes: log p(x|class A) = log p(x|class B). For equal covariance matrices, this simplifies to a **linear boundary** (LDA). For unequal covariances, the boundary becomes **quadratic** (QDA) — a curve that follows the shape of the contours. Gaussian Mixture Models allow each class to have multiple Gaussian components, creating complex multi-modal decision regions.',
        advanced:
          'The information geometry viewpoint: the space of Gaussian distributions forms a Riemannian manifold where the Fisher information matrix defines the metric. The KL divergence between two Gaussians: KL(p||q) = ½[tr(Σq⁻¹Σp) + (μq-μp)ᵀΣq⁻¹(μq-μp) - k + ln(|Σq|/|Σp|)]. Contour plot visualization is the primary diagnostic tool for variational inference, where the approximate posterior (often a Gaussian) is compared against the true posterior. In normalizing flows, a simple Gaussian is warped through invertible transformations — the contour plot evolves from circles to arbitrarily complex shapes.',
        interactive: { type: 'contour-explainer' as const, props: {} },
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
        goDeeper:
          'A linear classifier draws a straight boundary: w₁x₁ + w₂x₂ + b = 0. Points on one side are class A, the other side class B. The weights w₁, w₂ determine the boundary\'s angle; the bias b shifts it. Logistic regression uses the sigmoid function σ(z) = 1/(1+e^(-z)) to convert the linear score to a probability: P(class=1) = σ(w·x + b). Training minimizes cross-entropy loss: L = -Σ[y·log(ŷ) + (1-y)·log(1-ŷ)]. Linear classifiers are fast, interpretable, and work well when classes are linearly separable.',
        advanced:
          'Support Vector Machines (SVM) find the maximum-margin hyperplane — the boundary with the largest gap between classes. Support vectors are the closest points to the boundary. The **kernel trick** maps data to higher dimensions where linear separation is possible: the RBF kernel K(x,y) = exp(-γ||x-y||²) effectively creates infinite-dimensional features without computing them explicitly. SVMs remain competitive for small-to-medium datasets with clear margins. For high-dimensional data (text classification), linear SVMs are surprisingly effective because the curse of dimensionality makes most data approximately linearly separable.',
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
        goDeeper:
          'A neural network chains layers of linear transformations with nonlinear activations. Layer output: y = activation(W·x + b). Common activations: ReLU (max(0, x) — simple, fast, standard), sigmoid (squashes to 0-1, used for output probabilities), softmax (multi-class probabilities). A 2-layer network: input → hidden layer (64 neurons, ReLU) → output layer (num_classes, softmax). Training uses backpropagation: compute loss, propagate gradients backward through all layers, update weights via gradient descent.',
        advanced:
          'Deep learning architectures: **CNNs** (Convolutional Neural Networks) apply learned filters to detect spatial features — dominant for images. **RNNs/LSTMs** process sequential data (text, time series) by maintaining hidden state. **Transformers** use self-attention to process entire sequences in parallel — GPT, BERT, and all modern LLMs are transformers. **GANs** (Generative Adversarial Networks) generate realistic images by training two networks against each other. **Diffusion models** (DALL-E, Stable Diffusion) generate images by learning to reverse a noise-adding process. Each architecture matches the structure of specific data types.',
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
        goDeeper:
          'Transformers process input through self-attention: each token attends to every other token, computing a weighted sum where weights reflect relevance. Attention(Q,K,V) = softmax(QKᵀ/√d)V, where Q (queries), K (keys), V (values) are learned projections of the input. Multi-head attention runs several attention functions in parallel, capturing different types of relationships. The transformer architecture: input embedding → positional encoding → N × (multi-head attention + feed-forward network + layer normalization) → output.',
        advanced:
          'Scaling laws: transformer performance improves predictably with model size, dataset size, and compute budget — following power laws. GPT-4 has ~1.7 trillion parameters trained on trillions of tokens. Emergent abilities appear at scale: chain-of-thought reasoning, in-context learning, and instruction following emerge in large models but are absent in small ones. Fine-tuning adapts pretrained models: RLHF (Reinforcement Learning from Human Feedback) aligns language models with human preferences. LoRA (Low-Rank Adaptation) fine-tunes models efficiently by training only small rank-decomposition matrices, reducing GPU memory by 10×.',
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
        goDeeper:
          'A signal is any quantity that varies over time or space: sound pressure, voltage, temperature, stock prices. **Analog signals** are continuous; **digital signals** are sampled at discrete steps. The Nyquist theorem: to represent a signal with max frequency f_max, sample at ≥ 2f_max Hz. Human hearing: ~20 kHz, so CD audio uses 44.1 kHz. Sampling below Nyquist causes **aliasing** — high frequencies masquerade as low ones, like wagon wheels appearing to spin backward in film.',
        advanced:
          'The **Fourier Transform** converts signals from time to frequency domain: X(f) = ∫x(t)e^(-2πift) dt. The FFT computes the DFT in O(N log N) — for N=1,000,000, a 50,000× speedup. The power spectrum |X(f)|² shows which frequencies dominate. The spectrogram (Short-Time FT) shows how frequency content evolves over time — essential for speech recognition, music analysis, and earthquake seismology. The uncertainty principle (ΔtΔf ≥ 1/4π) means you cannot have perfect time AND frequency resolution simultaneously.',
        diagram: 'TransverseLongitudinalDiagram',
      },
      {
        title: 'Frequency = Speed of Vibration',
        content:
          'Frequency tells you how many times something vibrates per second, measured in Hertz ' +
          '(Hz). A low hum might be 100 Hz (100 vibrations per second). A high-pitched whistle ' +
          'might be 4,000 Hz. The higher the frequency, the higher the pitch you hear.',
        goDeeper:
          'Frequency f (Hz) = cycles per second. A guitar string vibrating 440 times per second = 440 Hz = note A4. Period T = 1/f: T(440 Hz) = 2.27 ms. Human hearing range: ~20 Hz (deep bass rumble) to ~20,000 Hz (highest hiss). The frequency of a vibrating string: f = (1/2L)√(T/μ), where L = length, T = tension, μ = mass per unit length. Shorter string → higher pitch (frets on a guitar), tighter → higher (tuning pegs), thicker → lower (bass strings). This formula connects physics to music.',
        advanced:
          'The harmonic series of a vibrating string: f₁ (fundamental), 2f₁ (octave), 3f₁ (perfect fifth above octave), 4f₁ (second octave), 5f₁ (major third), etc. These harmonics determine timbre — why a violin and flute playing the same note sound different (different harmonic amplitudes). The Fourier series decomposes any periodic waveform into its harmonic components. Non-linear systems generate new frequencies: a distorted guitar creates harmonics and intermodulation products (sum and difference frequencies), enriching the sound spectrum.',
        diagram: 'WaveEquationDiagram',
      },
      {
        title: 'Amplitude = Strength of Vibration',
        content:
          'Amplitude is how far the vibration swings from the center. A gentle whisper has tiny ' +
          'amplitude; a shout has large amplitude. On a wave diagram, amplitude is the height ' +
          'of the peaks. More amplitude means louder sound or stronger signal.',
        goDeeper:
          'Bit depth determines amplitude resolution: 8-bit = 256 levels, 16-bit = 65,536 (CD), 24-bit = 16.7 million (pro audio). SNR from quantization: SNR ≈ 6.02n + 1.76 dB. 16-bit: SNR ≈ 98 dB. ADC specs: resolution (bits), sample rate (Hz), input range (Volts). Arduino\'s ADC: 10-bit at up to 10 kHz — adequate for slow signals (temperature, light) but not audio. For audio capture, use an external I2S ADC module (e.g., INMP441 MEMS microphone) with 24-bit resolution at 44.1 kHz.',
        advanced:
          'Delta-sigma (ΔΣ) ADCs use 1-bit quantization at MHz rates, then noise-shaping pushes quantization noise to high frequencies where a digital filter removes it — achieving 24-bit effective resolution cheaply. This powers modern audio interfaces and digital scales. The Gabor limit (signal processing\'s uncertainty principle) states ΔtΔf ≥ 1/(4π) — you cannot localize both time and frequency perfectly. Wavelets (Daubechies, Morlet) provide multi-resolution analysis that adapts time-frequency tradeoff to the signal — better than fixed-window FFT for transient events like drum hits, seismic waves, and neural spikes.',
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
        goDeeper:
          'Sound enters the ear canal, vibrates the eardrum, which moves three tiny bones (hammer, anvil, stirrup) that amplify vibrations 20× and transmit them to the cochlea. The cochlea is a fluid-filled spiral with ~16,000 hair cells along the basilar membrane. Different positions respond to different frequencies: the base (narrow, stiff) responds to high frequencies, the apex (wide, flexible) to low. When hair cells bend, they generate electrical signals sent to the brain. This frequency-to-position mapping is the basis of place theory of pitch perception.',
        advanced:
          'The cochlea performs a real-time Fourier transform mechanically — separating complex sounds into frequency components along the basilar membrane. Each hair cell has ~100 stereocilia that open mechanically-gated ion channels when deflected. Outer hair cells amplify weak signals through electromotility (they physically change length in response to voltage), providing 40-60 dB of cochlear gain. This "cochlear amplifier" gives the ear its remarkable dynamic range (0-120 dB, a factor of 10⁶ in amplitude). Noise-induced hearing loss permanently damages hair cells (they don\'t regenerate in humans), starting with the high-frequency region — which is why hearing loss typically begins with difficulty hearing consonants.',
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
        goDeeper:
          'The FFT (Fast Fourier Transform) decomposes a signal into its frequency components — like a prism splitting white light into colors. Input: N samples of the signal. Output: N/2 frequency bins, each showing how much energy is at that frequency. The frequency resolution = sample_rate / N. With 44,100 Hz sample rate and N=1024: resolution ≈ 43 Hz per bin. To detect a 440 Hz tone, look at bin 440/43 ≈ bin 10. In Python: spectrum = np.abs(np.fft.rfft(signal)); frequencies = np.fft.rfftfreq(len(signal), 1/sample_rate).',
        advanced:
          'Window functions (Hanning, Hamming, Blackman) are multiplied with the signal before FFT to reduce spectral leakage — the smearing of sharp frequency peaks caused by analyzing a finite-length segment. Without windowing, a pure 440 Hz tone appears spread across multiple bins. With a Hanning window, the peak is sharp but the main lobe is wider. The tradeoff: narrower main lobe → better frequency resolution but higher sidelobes. The Short-Time Fourier Transform (STFT) applies windowed FFTs at overlapping positions along the signal, producing a spectrogram — a time-frequency representation essential for speech, music, and vibration analysis.',
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
        goDeeper:
          'Electricity is the flow of electrons through a conductor. **Voltage** (V) is the "pressure" pushing electrons — like water pressure in a pipe. **Current** (I, in Amperes) is the flow rate — how many electrons pass per second. **Resistance** (R, in Ohms) opposes flow — like a narrow pipe. Ohm\'s Law: V = I × R. A 9V battery with a 1kΩ resistor: I = 9/1000 = 9 mA. Power: P = V × I = 9 × 0.009 = 0.081 W. An AA battery can supply about 1.5V at up to 500 mA for a few hours.',
        advanced:
          'At the atomic level, electrons in metals are delocalized (shared across the crystal lattice) and drift under applied voltage. The drift velocity is surprisingly slow (~0.1 mm/s for typical current), but the electric field propagates at near light speed — which is why a light switch works instantly. Semiconductors (silicon, germanium) have controllable conductivity: doping with phosphorus (extra electrons → n-type) or boron (missing electrons → p-type) creates the building blocks of transistors. A MOSFET transistor acts as a voltage-controlled switch — the basis of all modern digital electronics, with chips containing billions of transistors.',
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
        goDeeper:
          'Current flows only in complete circuits — a closed loop from battery positive terminal, through the components, back to negative. An open switch breaks the loop; current stops everywhere instantly. Short circuit: a low-resistance path directly connecting battery terminals — enormous current flows, the wire heats up, and the battery may be damaged. Always include a load (resistor, LED, motor) in the circuit. Circuit diagrams use standard symbols: battery (long/short parallel lines), resistor (zigzag), LED (triangle with arrows), switch (gap with a lever).',
        advanced:
          'Kirchhoff\'s laws solve complex circuits. **KVL** (Voltage Law): voltages around any closed loop sum to zero — energy is conserved. Walk around a loop: battery gives +9V, resistor drops -5V, LED drops -2V, second resistor drops -2V → 9 - 5 - 2 - 2 = 0 ✓. **KCL** (Current Law): currents entering a node equal currents leaving — charge is conserved. At a junction: 10 mA in = 6 mA branch + 4 mA branch. These two laws, plus Ohm\'s Law, can solve any circuit. Mesh analysis (applying KVL to independent loops) and nodal analysis (applying KCL to nodes) are systematic methods for circuits with many components.',
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
        goDeeper:
          'Ohm\'s Law: **V = IR**. A 220Ω resistor with 5V across it draws I = 5/220 = 22.7 mA. Power: P = VI = I²R = V²/R. That resistor dissipates P = 5²/220 = 0.114 W — a 1/4W resistor is sufficient. For an LED: forward voltage ~2V, desired current ~20 mA. Series resistor R = (5V − 2V)/0.02A = **150Ω**. Resistor color code: brown-black-brown = 100Ω, red-violet-red = 2,700Ω = 2.7 kΩ. Kirchhoff\'s Voltage Law: voltages around a closed loop sum to zero. Kirchhoff\'s Current Law: currents entering a node equal currents leaving.',
        advanced:
          'Real circuit analysis uses Thévenin\'s theorem: any linear circuit with two terminals can be replaced by a single voltage source V_th in series with a resistance R_th. To find V_th: open-circuit the terminals and measure voltage. To find R_th: set all independent sources to zero (voltage sources → short, current sources → open) and measure resistance. This simplifies complex networks to a single equivalent circuit — essential for impedance matching, where maximum power transfer occurs when load resistance equals source resistance. Superposition applies to linear circuits: the response to multiple sources equals the sum of responses to each source individually.',
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
        goDeeper:
          'An LED (Light Emitting Diode) has a fixed forward voltage drop (red: ~2V, green: ~2.2V, blue/white: ~3.3V) and no internal current limiting. Without a resistor, current is limited only by wire and battery resistance — far too much, destroying the LED instantly. The series resistor limits current to a safe level (typically 10-20 mA). Formula: R = (V_supply - V_LED) / I_desired. For a red LED on 5V at 15 mA: R = (5 - 2) / 0.015 = **200Ω** (use standard 220Ω). Brightness is proportional to current up to the rated maximum.',
        advanced:
          'LEDs are semiconductor devices: when current flows through the p-n junction, electrons recombine with holes, releasing energy as photons. The photon wavelength (color) depends on the bandgap energy of the semiconductor material: GaP (green, 2.26 eV), GaAsP (red/yellow), InGaN (blue/UV, 2.6-3.4 eV). White LEDs use a blue InGaN chip coated with yellow phosphor — the combination appears white. LED efficiency (lumens/watt) has improved dramatically: from 1 lm/W (1960s) to 200+ lm/W (current), surpassing incandescent (15 lm/W) and fluorescent (100 lm/W). OLEDs (organic LEDs) use thin organic films and can be made flexible — enabling foldable screens.',
        diagram: 'OhmsLawDiagram',
      },
      {
        title: 'PWM — Flickering Too Fast to See',
        content:
          'Pulse Width Modulation (PWM) switches a pin on and off thousands of times per second. ' +
          'Your eye can\'t see the flickering, so an LED appears dimmer when it\'s off half the ' +
          'time (50% duty cycle) and brighter at 100%. This trick lets a digital pin (which can ' +
          'only be fully on or fully off) simulate any brightness level — or control motor speed.',
        goDeeper:
          'PWM (Pulse Width Modulation) switches a digital pin between HIGH and LOW very rapidly. The duty cycle (% of time HIGH) determines the average voltage. 50% duty → average 2.5V (on a 5V Arduino). analogWrite(pin, 127) = 50% duty (127/255). At 490 Hz, each cycle is ~2 ms — your eye sees only the average brightness. PWM controls LED brightness (analogWrite(3, 64) = dim), motor speed (via a transistor), and servo position (servo angle ∝ pulse width between 1-2 ms). It does NOT produce true analog voltage — use an RC filter to smooth if needed.',
        advanced:
          'PWM resolution: Arduino\'s 8-bit PWM gives 256 brightness levels — usually enough. ESP32 offers 16-bit PWM (65,536 levels) for smoother fading. PWM frequency selection: too low → visible flicker in LEDs, audible whine in motors; too high → switching losses in transistors. For RGB LED color mixing, use 3 PWM channels: analogWrite(redPin, r); analogWrite(greenPin, g); analogWrite(bluePin, b); where r,g,b are 0-255. This is the same principle as screen pixels — additive color mixing from three independently controlled light sources.',
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
        goDeeper:
          'Series resistors: R_total = R₁ + R₂ + R₃. Three 100Ω resistors in series: R = **300Ω**. Parallel resistors: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Three 100Ω in parallel: R = **33.3Ω**. For just two parallel resistors: R = R₁R₂/(R₁+R₂). Voltage divider: V_out = V_in × R₂/(R₁+R₂). With R₁=1kΩ, R₂=2kΩ, V_in=9V: V_out = 9 × 2/3 = **6V**. Current divider: I₁ = I_total × R₂/(R₁+R₂). These formulas are the building blocks of all circuit analysis.',
        advanced:
          'Capacitors and inductors add frequency-dependent behavior. A capacitor\'s impedance Z_C = 1/(2πfC) decreases with frequency — it blocks DC but passes AC (used in coupling and filtering). An inductor\'s impedance Z_L = 2πfL increases with frequency — it passes DC but blocks AC (used in power supply filtering). An RC low-pass filter (resistor in series, capacitor to ground) has cutoff frequency f_c = 1/(2πRC). For R=10kΩ, C=100nF: f_c = 1/(2π×10⁴×10⁻⁷) = **159 Hz** — it passes bass frequencies and blocks treble. LC resonant circuits combine at f_r = 1/(2π√(LC)), enabling radio tuning — the exact frequency selection principle behind every radio, TV, and WiFi receiver.',
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
        goDeeper:
          'Tinkercad (free, browser-based) simulates Arduino circuits: drag components, wire them, write code, and run. The simulator shows real-time voltage, current, and pin states. Starter projects: (1) Blink LED with variable delay, (2) Potentiometer → LED brightness via PWM, (3) Temperature sensor → serial monitor, (4) Ultrasonic distance → LED bar graph. Simulation catches wiring errors, logic bugs, and timing issues without risking hardware.',
        advanced:
          'Professional embedded development uses hardware-in-the-loop (HIL) simulation: microcontroller runs real firmware while sensors are simulated. This tests edge cases (sensor reads -40°C, GPS drops) that are hard to reproduce physically. PlatformIO supports unit testing on simulated hardware. For complex systems (drones, robots), Software-in-the-Loop (SIL) simulates both hardware and firmware. Continuous integration pipelines run automated tests on every commit, catching regressions before they reach physical devices.',
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
        goDeeper:
          'Building in simulation: (1) Draw a schematic, (2) Calculate component values (R = (V_supply - V_LED)/I_LED), (3) Wire in simulator, (4) Write code, (5) Test and debug. Traffic light project: 3 LEDs with 220Ω resistors on pins 2, 3, 4. Code sequences through green-yellow-red with appropriate delays. Add a pedestrian button: if(digitalRead(7) == LOW) { pedestrianSequence(); }. The simulator\'s serial monitor displays debug output just like real hardware.',
        advanced:
          'Moving from simulation to real hardware introduces: component tolerances (a "100Ω" resistor might be 95-105Ω), wire resistance, breadboard contact resistance (~0.1Ω), and electromagnetic interference (EMI). Decoupling capacitors (100nF ceramic near IC power pins) filter noise. Pull-up/pull-down resistors (10kΩ) ensure defined input states. Power supply considerations: USB provides 5V/500mA, but motors and LED strips need external power. Level shifting is needed when interfacing 5V Arduino with 3.3V sensors — a voltage divider or dedicated level shifter IC prevents damage.',
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
        goDeeper:
          'Top simulator-catchable mistakes: (1) Forgetting a resistor with an LED — in simulation, the virtual LED shows "burned out." (2) Wrong pin mode — writing to a pin set as INPUT does nothing. (3) Reversed LED polarity — the long leg (anode) goes to positive. (4) Missing ground connection — circuit is not complete, nothing works. (5) analogRead on a digital-only pin — returns meaningless values. (6) Using delay() in a time-sensitive loop — blocks all other code. The serial monitor is your best debugging tool: Serial.println(analogRead(A0)) confirms the sensor is wired correctly.',
        advanced:
          'Debugging embedded systems differs from desktop programming: no debugger breakpoints on basic Arduino (the ATmega328P lacks hardware debug support). Serial.println() is the primary debugging tool. Timing issues: millis() overflow after ~50 days (use unsigned long subtraction, which handles overflow correctly). Memory issues: 2KB SRAM fills fast with strings — use F() macro for string literals: Serial.println(F("This stays in flash")). Stack overflow from deep recursion crashes silently. On ESP32 and ARM-based boards, JTAG debugging with breakpoints and variable inspection is available through hardware debug probes.',
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
        goDeeper:
          'Transitioning checklist: (1) Double-check component values (resistors, capacitors) against schematic. (2) Check power supply: USB provides 5V/500mA — motors need external power. (3) Test each component individually before combining. (4) Use a multimeter: voltage mode checks supply, resistance mode checks connections, continuity mode finds broken wires (beep = connected). (5) Start with the simplest version that proves the concept works, then add complexity. (6) Secure connections: breadboard prototypes → soldered perfboard → custom PCB for permanent projects.',
        advanced:
          'PCB (Printed Circuit Board) design moves projects from prototype to product. KiCad (free, open-source) handles schematic capture and board layout. Design rules: trace width determines current capacity (0.25 mm for signals, 1+ mm for power), copper clearance prevents short circuits, ground planes reduce noise. Fabrication services (JLCPCB, PCBWay) produce 5 boards for ~$2-5 with 5-day turnaround. Surface-mount components (SMD) are smaller than through-hole but require a soldering iron with a fine tip or a reflow oven. Assembly houses can populate boards automatically for larger quantities.',
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
        goDeeper:
          'Descriptive statistics: **center** (mean, median, mode) and **spread** (range, IQR, variance, std dev). For elephant weights [3200, 3800, 4500, 4800, 5100]: mean = 4280, median = 4500, range = 1900, IQR = 1000, σ ≈ 716. The median is more robust to outliers — adding a 10,000 kg outlier shifts mean to 5233 but median only to 4650. **Correlation** (r = -1 to +1) measures linear association but NOT causation: ice cream sales and drownings both rise in summer, but ice cream doesn\'t cause drowning.',
        advanced:
          'Inferential statistics draws conclusions about populations from samples. The **Central Limit Theorem**: sample means are approximately normal regardless of population distribution, with SE = σ/√n. A 95% confidence interval: x̄ ± 1.96 × SE. The p-value is the probability of observing your result if the null hypothesis were true. The **replication crisis** showed many p < 0.05 results fail to replicate — leading to calls for pre-registration, larger samples, effect sizes, and Bayesian methods. Always report confidence intervals alongside p-values.',
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
        goDeeper:
          'Weighted mean accounts for unequal importance: if three exams are weighted 20%, 30%, 50% with scores 75, 80, 90: weighted mean = 0.20(75) + 0.30(80) + 0.50(90) = 15 + 24 + 45 = **84** (vs simple mean of 81.7). The geometric mean is appropriate for multiplicative quantities: investment returns of +20%, −10%, +15% over 3 years → geometric mean = (1.20 × 0.90 × 1.15)^(1/3) − 1 = (1.242)^(1/3) − 1 ≈ **7.5%** per year. The harmonic mean applies to rates: driving 60 km at 40 km/h and 60 km at 60 km/h → harmonic mean speed = 2/(1/40 + 1/60) = **48 km/h** (not 50).',
        advanced:
          'The **empirical rule** (68-95-99.7 rule) for normal distributions: ~68% of data falls within 1σ of the mean, ~95% within 2σ, ~99.7% within 3σ. If elephant weights are normally distributed with μ=4280 kg, σ=716 kg, then 95% of elephants weigh between 4280 ± 2(716) = 2848 to 5712 kg. Z-scores standardize any normal distribution: z = (x − μ)/σ. An elephant weighing 5700 kg has z = (5700−4280)/716 = 1.98, meaning it is heavier than ~97.6% of the population (from the z-table). Skewed distributions (income, city sizes) are better described by the median and IQR, or by log-transforming to achieve approximate normality.',
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
        goDeeper:
          'Variance = average of squared deviations from the mean: σ² = Σ(xᵢ - x̄)² / n. Standard deviation σ = √(variance) — in the same units as the data. For weights [3200, 3800, 4500, 4800, 5100], mean = 4280: deviations = [-1080, -480, 220, 520, 820], squared = [1166400, 230400, 48400, 270400, 672400], mean of squares = 477600, σ = √477600 ≈ **691 kg**. Small σ means data clusters tightly around the mean; large σ means wide spread. Rule of thumb: ~68% of data falls within ±1σ of the mean for normal distributions.',
        advanced:
          'Population σ divides by n; sample standard deviation s divides by n-1 (Bessel\'s correction) because a sample underestimates variability. The coefficient of variation (CV = σ/μ × 100%) allows comparing spread across different scales: elephant weights (σ=700, μ=4300, CV=16%) vs mouse weights (σ=3, μ=25, CV=12%) — mice are relatively less variable. In quality control, Six Sigma means the process spread is so tight that defects occur only at 6 standard deviations from the mean — 3.4 defects per million. The Chebyshev inequality (≥ 1-1/k² of data within k standard deviations) holds for ANY distribution, not just normal.',
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
        goDeeper:
          'A histogram groups data into bins (ranges) and counts how many values fall in each bin. More bins = more detail but noisier; fewer bins = smoother but lose detail. Sturges\' rule: bins ≈ 1 + 3.322 × log₂(n). For n=100: ~8 bins. Distribution shapes: **symmetric** (bell-shaped normal), **right-skewed** (long tail to the right — income, house prices), **left-skewed** (long tail to the left — age at death in developed countries), **bimodal** (two peaks — mixed populations). Always check the histogram before computing mean/std — a bimodal distribution\'s mean falls between the peaks where few data points actually exist.',
        advanced:
          'Kernel Density Estimation (KDE) produces a smooth continuous estimate of the probability distribution, avoiding the arbitrary binning of histograms. Each data point is replaced by a small "kernel" (usually Gaussian), and the sum of all kernels creates the density curve. Bandwidth selection controls smoothness: too narrow → noisy, too wide → oversmoothed. The Q-Q plot (quantile-quantile) compares your data distribution against a theoretical one (usually normal): if the points follow a straight line, the data is approximately normal. Departures from the line reveal skewness, heavy tails, or outliers — more informative than any single test statistic.',
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
        goDeeper:
          'An outlier is a data point far from the others. Detection methods: **IQR method** — compute Q1 (25th percentile), Q3 (75th), IQR = Q3 - Q1. Points below Q1 - 1.5×IQR or above Q3 + 1.5×IQR are outliers. For elephant weights: Q1=3800, Q3=4800, IQR=1000. Outlier thresholds: below 2300 or above 6300. **Z-score method**: |z| > 3 (more than 3 standard deviations from mean) flags outliers. Always investigate before removing — outliers might be errors (sensor malfunction) or genuine discoveries (unusually large elephant).',
        advanced:
          'Robust statistics are less sensitive to outliers: the median (vs mean), the MAD (Median Absolute Deviation, vs standard deviation), and the trimmed mean (discard top/bottom 5% before averaging). In machine learning, outlier detection algorithms (Isolation Forest, Local Outlier Factor, DBSCAN) identify anomalous points in multi-dimensional data — used for fraud detection, network intrusion detection, and quality control. The Mahalanobis distance accounts for correlations between features, identifying multivariate outliers that appear normal when each feature is examined individually.',
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
        goDeeper:
          'Sampling methods: **random sampling** gives every member an equal chance. **Stratified sampling** divides into subgroups and samples each proportionally. **Systematic sampling** selects every kth member. Margin of error for proportions: MoE ≈ 1/√n for 95% confidence. A poll of n=1000 has MoE ≈ ±3.2%. To halve the margin, quadruple the sample. **Convenience sampling** (surveying whoever is easiest to reach) introduces bias. **Cluster sampling** randomly selects groups (villages, schools) then surveys everyone within — practical when populations are geographically dispersed.',
        advanced:
          'Selection bias occurs when samples do not represent the population. Survivorship bias analyzes only "survivors" — studying only successful startups overestimates success factors. The Literary Digest poll (1936) predicted Landon over Roosevelt because its sample skewed wealthy (telephone/car owners). Statistical power = P(detecting a real effect) = 1 - β. For α=0.05 and medium effect, you need n≈64 per group. Underpowered studies produce unreliable results. **Bootstrap resampling** (randomly sampling with replacement from your data, thousands of times) estimates confidence intervals without assumptions about the population distribution.',
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
        goDeeper:
          'Pearson r measures linear association: r = +1 (perfect positive line), 0 (no linear pattern), -1 (perfect negative). Compute from paired data: r = Σ[(xᵢ-x̄)(yᵢ-ȳ)] / √[Σ(xᵢ-x̄)² × Σ(yᵢ-ȳ)²]. **Correlation ≠ causation**: ice cream sales and drowning deaths correlate (confounding variable: temperature). r² (coefficient of determination) tells you what fraction of variation in y is explained by x: r = 0.9 means r² = 0.81, so 81% of the variation is explained. Always visualize with a scatter plot — non-linear relationships, outliers, and clusters can hide behind a single number.',
        advanced:
          'Spearman rank correlation measures monotonic (not just linear) association using ranks instead of values — robust to outliers. Kendall\'s tau is another rank-based measure, preferred for small samples. Partial correlation controls for confounding: the partial correlation between ice cream and drowning, controlling for temperature, is near zero. In practice, multiple regression (y = b₀ + b₁x₁ + b₂x₂ + ...) separates the contributions of multiple predictors. Granger causality tests whether past X values improve predictions of Y — a temporal (not true causal) test used in economics and neuroscience.',
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
      {
        title: 'Contour Plots — Reading 3D Data on a Flat Page',
        content:
          'A contour plot is a top-down view of a 3D surface — exactly like a topographic hiking map. ' +
          'If you can read elevation lines on a trail map, you already know how to read a statistical ' +
          'contour plot. Close-together lines mean a steep slope (values change rapidly). Far-apart ' +
          'lines mean a gentle slope. In statistics, the "mountain" is a probability distribution: ' +
          'the peak is where data is most likely, the edges are where data is rare. When two variables ' +
          'are correlated, the contour circles stretch into tilted ellipses — the tilt IS the correlation.',
        goDeeper:
          'A contour line connects all points at the same value of a function f(x,y). For a bivariate Gaussian, contour lines are ellipses defined by (x-μ)ᵀΣ⁻¹(x-μ) = c for constant c. The **eigenvalues** of the covariance matrix Σ determine the lengths of the ellipse axes, and the **eigenvectors** determine the tilt angle. When ρ=0, the eigenvalues are σₓ² and σᵧ² and the axes are aligned with x and y. When ρ≠0, the major axis tilts at angle θ = ½ arctan(2ρσₓσᵧ/(σₓ²-σᵧ²)). The Mahalanobis distance from the center to any contour line determines the probability enclosed within that contour.',
        advanced:
          'In higher dimensions, contour "lines" become contour **surfaces** (hyperellipsoids). Gaussian Mixture Models (GMMs) combine multiple Gaussians, each with its own mean, covariance, and weight — the resulting contour plot shows multiple overlapping elliptical regions. The EM algorithm iteratively refines these parameters. In Bayesian inference, posterior contour plots reveal parameter uncertainty: the 95% **credible region** (the contour enclosing 95% of the posterior mass) is the Bayesian analog of a confidence interval. Kernel Density Estimation produces non-parametric contour plots from raw data — useful when the true distribution is not Gaussian.',
        interactive: { type: 'contour-explainer' as const, props: {} },
      },
    ],

    build: [
      {
        id: 'stats-central',
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
        id: 'stats-stddev',
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
        id: 'stats-histograms',
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
        id: 'stats-outliers',
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
        id: 'stats-correlation',
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
        goDeeper:
          'A sine wave y = A sin(2πft + φ) has amplitude A, frequency f (Hz), and phase φ (radians). Period T = 1/f. Angular frequency ω = 2πf. For 440 Hz (middle A): T = 2.27 ms, ω = 2764.6 rad/s. Wavelength λ = v/f: sound at 440 Hz in air (343 m/s): λ = 0.78 m. Light at 5×10¹⁴ Hz: λ = 600 nm (orange). The unit circle connection: sin(θ) = y-coordinate of a point moving around a unit circle at constant angular velocity ω — the projection of circular motion onto a straight line is a sine wave.',
        advanced:
          'Sine waves are eigenfunctions of linear time-invariant (LTI) systems: input sine → output sine of same frequency, changed only in amplitude and phase. This is why Fourier analysis works — decompose any signal into sines, process each independently. The Hilbert transform produces the analytic signal z(t) = x(t) + iH{x(t)}, whose magnitude is the envelope and whose phase derivative is the instantaneous frequency. Applications: AM radio demodulation, vibration analysis, and the mathematical basis of signal processing in MRI, radar, and telecommunications.',
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
        goDeeper:
          'Musical intervals are frequency ratios: octave = 2:1, fifth = 3:2, fourth = 4:3. Equal temperament: 12 semitones, each 2^(1/12) ≈ 1.0595. Note formula: f = 440 × 2^((n-69)/12) for MIDI note n. Middle C (n=60): f ≈ **261.6 Hz**. The mel scale models human pitch perception (roughly logarithmic). Cent = 1/100 of a semitone: 1200 cents per octave. Tuning systems (Pythagorean, just intonation, equal temperament) make different tradeoffs between pure intervals and transposability.',
        advanced:
          'Pitch perception uses place coding (basilar membrane location) above ~4 kHz and temporal coding (neural firing sync) below. The **missing fundamental**: hearing 200, 300, 400 Hz → brain perceives 100 Hz (absent). Autocorrelation pitch detection finds the period at which a signal matches its delayed copy. Absolute pitch (the ability to name any note without a reference) affects ~1 in 10,000 people and appears to require both genetic predisposition and early musical training. The cochlear implant — which directly stimulates auditory neurons with electrode arrays — must encode frequency information for pitch perception, a major challenge in implant design.',
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
        goDeeper:
          'Amplitude A is the peak value of the wave — half the distance from trough to crest. For sound, amplitude determines loudness; for light, it determines brightness; for a pendulum, it is the maximum displacement. The energy carried by a wave is proportional to A² — doubling the amplitude quadruples the energy. Decibels (dB) measure loudness on a logarithmic scale: dB = 20 × log₁₀(A/A_ref). Doubling the amplitude adds ~6 dB. The human hearing range spans ~120 dB — from a pin drop (0 dB) to a jet engine (120 dB), a factor of 10⁶ in amplitude.',
        advanced:
          'RMS (Root Mean Square) amplitude is the standard measure for AC signals: A_rms = A_peak / √2 for a sine wave. India\'s 230V mains supply has V_peak ≈ 325V but V_rms = 230V — the RMS value matches the equivalent DC power. For complex waveforms, Parseval\'s theorem states that total power equals the sum of power at each frequency: ΣA²ₙ in the time domain equals Σ|X(f)|² in the frequency domain. This connects amplitude analysis to spectral analysis — the power at each frequency contributes to the total signal power.',
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
        goDeeper:
          'Phase φ shifts a sine wave in time: y = sin(2πft + φ). φ = 0 starts at zero crossing (rising). φ = π/2 starts at the peak (= cosine). φ = π starts at zero (falling). φ = 3π/2 starts at the trough. Two waves at the same frequency with different phases: Δφ = 0 → perfectly in sync (constructive interference, double amplitude). Δφ = π → perfectly opposite (destructive interference, cancel out). Phase difference is measured in degrees or radians: 90° = π/2 rad, 180° = π rad.',
        advanced:
          'In electronics, phase relationships are critical for AC circuit analysis. A capacitor\'s current leads its voltage by 90° (π/2); an inductor\'s current lags by 90°. This is represented using complex impedance: Z_C = 1/(jωC), Z_L = jωL, where j = √(-1). Phasor diagrams show amplitude as length and phase as angle. In stereophonic audio, phase differences between left and right channels create the perception of sound source location. Noise-canceling headphones detect ambient sound, invert its phase (add π), and play the result — the two waves destructively interfere, reducing ambient noise by 20-30 dB.',
        diagram: 'PhaseDiagram',
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
        goDeeper:
          'A musical note is not a single frequency but a fundamental plus harmonics. A violin A4 (440 Hz) contains harmonics at 880, 1320, 1760, 2200 Hz — integer multiples of the fundamental. The relative amplitudes of harmonics determine timbre (tone color): a flute has weak harmonics (nearly pure sine), while a trumpet has strong upper harmonics (bright, brassy). Fourier analysis decomposes any periodic waveform into its harmonic components. A square wave = fundamental + 1/3 × 3rd harmonic + 1/5 × 5th + 1/7 × 7th + ... (only odd harmonics).',
        advanced:
          'Inharmonicity occurs when overtones deviate from integer multiples — piano strings exhibit this because their stiffness causes higher modes to vibrate slightly faster than integer multiples. This is why pianos use "stretch tuning" (octaves slightly wider than 2:1). Bells have strongly inharmonic partials, which is why they produce a complex, clangorous sound. Synthesizers recreate any timbre by additively combining sine waves (additive synthesis) or starting with a harmonically rich waveform and filtering out unwanted harmonics (subtractive synthesis). FM synthesis (Yamaha DX7) creates complex spectra by modulating the frequency of one sine wave with another — generating sidebands at non-integer frequency ratios.',
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
        goDeeper:
          'When two sine waves of slightly different frequencies (f₁ and f₂) combine, the result pulsates at the **beat frequency** = |f₁ - f₂|. Example: 440 Hz + 442 Hz → you hear 441 Hz (average) with 2 beats per second (2 Hz pulsation). Musicians use beats to tune instruments: play two notes that should be identical, listen for beats, adjust until beats disappear (frequencies match). The mathematical explanation: sin(2πf₁t) + sin(2πf₂t) = 2cos(2π(f₁-f₂)t/2) × sin(2π(f₁+f₂)t/2) — the product of a slow envelope and a fast carrier.',
        advanced:
          'Beat frequencies have practical applications beyond tuning. In radio engineering, heterodyning mixes a signal with a local oscillator to shift frequencies: the beat frequency (difference) moves a high-frequency radio signal down to an audible or processable range — this is how AM radios, spectrum analyzers, and radar receivers work. Binaural beats (slightly different frequencies in each ear) create a perceived beat in the brain — studied (with mixed scientific evidence) for effects on meditation and focus. In acoustics, room modes create standing wave beats when reflections interfere, causing certain frequencies to be louder or quieter at specific locations.',
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
        goDeeper:
          'Git tracks changes, not files. Each commit stores a snapshot plus metadata (author, timestamp, message, parent). The SHA-1 hash uniquely identifies each commit. Key commands: git init, git add file.py, git commit -m "message", git log --oneline, git diff, git status. The staging area lets you commit selectively: change 5 files, stage 2, commit those 2 — the rest remain uncommitted. The .gitignore file prevents tracking generated files (node_modules/, __pycache__/, .env).',
        advanced:
          'Git\'s data model is a **directed acyclic graph (DAG)** of commits. Branches are lightweight pointers — creating one is O(1). Merges create two-parent commits. Rebasing replays commits onto a new base for linear history. The reflog records every HEAD movement, enabling recovery of "lost" commits. Git\'s content-addressable storage deduplicates identical files across commits. Pack files compress similar objects together, making repositories 10-50× smaller than storing full copies. The three-tree architecture (HEAD, index, working directory) enables Git\'s powerful staging workflow.',
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
        goDeeper:
          'The three areas: **Working Directory** (your files), **Staging Area** (index — selected changes for next commit), **Repository** (committed history). Workflow: edit files → git add file.py (stage) → git commit -m "message" (save). git diff shows unstaged changes; git diff --staged shows staged changes. git log --oneline --graph shows branch history graphically. Undo: git restore file.py discards working changes; git restore --staged file.py unstages. **Commits should be atomic** — each commit represents one logical change with a clear message.',
        advanced:
          'Git internals: a commit object contains a tree (snapshot of all files), parent pointer(s), author, and message. A tree object maps filenames to blob objects (file contents). Blobs are content-addressed — identical file contents are stored once regardless of filename. git cat-file -p <hash> inspects any object. The .git directory contains: objects/ (blobs, trees, commits), refs/ (branch pointers), HEAD (current branch pointer), index (staging area). Understanding these internals helps debug unusual situations: detached HEAD, lost commits, corrupted repositories.',
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
        goDeeper:
          'Branch workflow: git branch feature-xyz (create), git switch feature-xyz (switch), make changes, commit, then git switch main; git merge feature-xyz. Merge conflicts occur when both branches modify the same lines — manually edit, then git add and commit. **Git flow**: main (production), develop (integration), feature/*, release/*, hotfix/*. Simpler: **trunk-based development** — short-lived branches merged frequently. GitHub/GitLab pull requests enable code review before merging.',
        advanced:
          'Advanced Git: **interactive rebase** (git rebase -i HEAD~5) reorders, squashes, edits, or drops commits. **Cherry-pick** (git cherry-pick abc123) applies a specific commit. **Bisect** (git bisect start/bad/good) binary-searches through history to find bug-introducing commits in O(log n) steps. **Submodules** manage repository dependencies. **Git hooks** run scripts before/after events (pre-commit: lint code, pre-push: run tests). **Git LFS** handles large binaries by storing pointers in the repo and actual files on a separate server.',
        diagram: 'GitBranchDiagram',
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
        goDeeper:
          'Remotes are copies of the repository on another machine (GitHub, GitLab, Bitbucket). git clone url downloads the entire history. git remote -v shows configured remotes. git push origin main uploads local commits. git pull origin main downloads and merges remote changes. git fetch downloads without merging (safer — inspect first with git log origin/main). **Forks** (GitHub) create your own copy of someone else\'s repository. **Pull Requests** propose merging your branch into the original — the standard collaboration mechanism in open source.',
        advanced:
          'Distributed version control means every clone has the complete history — no central server is required for local operations (commit, branch, merge, log). This enables offline work, fast operations, and resilience. GitHub Actions (CI/CD) runs automated tests on every push: on: push → jobs: test → steps: checkout, setup-python, pip install, pytest. Protected branches require passing tests and approving reviews before merging. SSH keys (ssh-keygen, add public key to GitHub) replace password authentication for push/pull operations — more secure and more convenient.',
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
        goDeeper:
          'PR workflow: (1) Fork/clone the repo, (2) Create a feature branch: git switch -c feature-name, (3) Make changes, commit with clear messages, (4) Push: git push origin feature-name, (5) Open PR on GitHub with description, (6) Address review comments, push updates, (7) Maintainer merges. **Code review** catches bugs, improves design, and shares knowledge. Good PR practice: small, focused changes (not giant PRs); descriptive title and body; link to relevant issue; include tests.',
        advanced:
          'Advanced collaboration: **Conventional Commits** standardize messages (feat:, fix:, docs:, refactor:) enabling automated changelog generation. **Semantic Versioning** (MAJOR.MINOR.PATCH) communicates compatibility: breaking change → major bump, new feature → minor, bug fix → patch. **Monorepos** (Google, Meta) keep all code in one repository, using build tools (Bazel, Nx) to manage dependencies between projects. **Git hooks** automate quality checks: pre-commit runs linters, commit-msg validates format, pre-push runs tests. Husky (Node.js) and pre-commit (Python) manage hook installation across teams.',
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
    category: 'database',
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
        goDeeper:
          'A relational database organizes data into **tables** (rows and columns). Each row is a record; each column is a field with a specific data type (INTEGER, TEXT, REAL, DATETIME). The **primary key** uniquely identifies each row (e.g., elephant_id). **Foreign keys** link tables: a sightings table might have elephant_id referencing the elephants table. Core SQL: `SELECT name, weight FROM elephants WHERE weight > 4000 ORDER BY weight DESC` retrieves heavy elephants sorted by weight. `INSERT INTO elephants (name, weight) VALUES ("Ranga", 4500)` adds a record. `UPDATE elephants SET weight = 4600 WHERE name = "Ranga"` modifies one.',
        advanced:
          'Database normalization reduces redundancy: **1NF** (no repeating groups), **2NF** (every non-key column depends on the whole primary key), **3NF** (no transitive dependencies — every non-key column depends ONLY on the key). Example: instead of storing elephant_name in every sighting record, store elephant_id (foreign key) and look up the name from the elephants table. **Indexing** (B-tree structures on frequently queried columns) speeds lookups from O(n) to O(log n). **ACID properties** (Atomicity, Consistency, Isolation, Durability) guarantee that transactions either complete fully or not at all — essential for financial systems. NoSQL databases (MongoDB, Redis) trade ACID guarantees for horizontal scalability, handling millions of requests/second for web applications.',
        interactive: {
          type: 'true-false',
          props: {
            statements: [
              { text: 'A database is just a fancy name for a spreadsheet.', answer: false, explanation: 'Databases are purpose-built software that can handle millions of records, enforce data rules, and support many users at once — far beyond what spreadsheets can do.' },
              { text: 'In a relational database, data is organized into tables with rows and columns.', answer: true, explanation: 'Tables (with columns for categories and rows for records) are the fundamental structure of relational databases.' },
            ],
          },
        },
        diagram: 'SQLTableDiagram',
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
        goDeeper:
          'JOIN combines tables: SELECT e.name, s.date FROM elephants e JOIN sightings s ON e.id = s.elephant_id WHERE s.date > "2024-01-01". Aggregates: SELECT location, COUNT(*), AVG(group_size) FROM sightings GROUP BY location HAVING COUNT(*) > 10. Subqueries: SELECT name FROM elephants WHERE id IN (SELECT elephant_id FROM sightings WHERE location = "Kaziranga"). Window functions: RANK() OVER (ORDER BY weight DESC) adds ranking without collapsing rows.',
        advanced:
          'Query optimization: the planner chooses table scan, index scan, or hash join. EXPLAIN ANALYZE shows execution plans. Create indexes on filtered/joined columns. Avoid SELECT * — fetch only needed columns. Database normalization (1NF, 2NF, 3NF) reduces redundancy but increases JOIN complexity. **Denormalization** (storing computed aggregates) speeds reads at the cost of write complexity. Modern databases use cost-based optimizers that estimate row counts and choose the cheapest plan. Connection pooling (PgBouncer, SQLAlchemy) reuses database connections to avoid the overhead of establishing new ones for every query.',
        diagram: 'SQLQueryFlowDiagram',
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
        goDeeper:
          'WHERE clauses filter rows: WHERE weight > 4000, WHERE name LIKE "R%", WHERE location IN ("Kaziranga", "Manas"), WHERE date BETWEEN "2024-01-01" AND "2024-12-31". AND/OR combine conditions: WHERE weight > 4000 AND location = "Kaziranga". ORDER BY sorts results: ORDER BY weight DESC (heaviest first), ORDER BY name ASC (alphabetical). LIMIT restricts output: LIMIT 10 returns the first 10 rows. Combined: SELECT name, weight FROM elephants WHERE weight > 3500 ORDER BY weight DESC LIMIT 5 — top 5 heaviest elephants over 3500 kg.',
        advanced:
          'Query performance depends on whether indexes exist for filtered columns. Without an index, the database performs a full table scan (checking every row). With a B-tree index on the weight column, WHERE weight > 4000 jumps directly to the relevant portion — O(log n) vs O(n). Composite indexes (CREATE INDEX ON sightings(location, date)) optimize queries filtering on multiple columns. The EXPLAIN command shows the query plan: Sequential Scan (slow) vs Index Scan (fast). Trade-off: indexes speed up reads but slow down writes (every INSERT/UPDATE must update the index).',
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
        goDeeper:
          'JOIN types: **INNER JOIN** returns only matching rows from both tables. **LEFT JOIN** returns all rows from the left table, with NULLs where no right-table match exists. **RIGHT JOIN** is the mirror. **FULL OUTER JOIN** returns all rows from both tables. Example: SELECT e.name, COUNT(s.id) FROM elephants e LEFT JOIN sightings s ON e.id = s.elephant_id GROUP BY e.name — shows every elephant, even those with zero sightings (which INNER JOIN would omit). Self-joins compare rows within the same table: find elephant pairs of similar weight.',
        advanced:
          'Joins can be expensive for large tables. Nested loop join is O(n×m) — the database checks every combination. Hash join builds a hash table on the smaller table, then probes with the larger — O(n+m). Sort-merge join sorts both tables by the join key, then merges — O(n log n + m log m). The query planner chooses based on table sizes and available indexes. Denormalization (storing redundant data to avoid joins) is common in read-heavy applications: a sightings table might include elephant_name directly, avoiding a join for every query at the cost of update complexity. This tradeoff between normalization and performance is a core database design decision.',
        diagram: 'SQLJoinDiagram',
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
        goDeeper:
          'INSERT adds rows: INSERT INTO elephants (name, weight, location) VALUES ("Mohini", 3800, "Kaziranga"). UPDATE modifies: UPDATE elephants SET weight = 3900 WHERE name = "Mohini". DELETE removes: DELETE FROM sightings WHERE date < "2020-01-01". **Transactions** group operations atomically: BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT; — either both updates happen or neither does (ACID atomicity). CREATE TABLE defines schema: CREATE TABLE elephants (id INTEGER PRIMARY KEY, name TEXT NOT NULL, weight REAL CHECK(weight > 0)).',
        advanced:
          'Schema migrations manage database changes over time: ALTER TABLE elephants ADD COLUMN last_seen DATE; Tools like Alembic (Python/SQLAlchemy) or Flyway (Java) version-control schema changes, applying them in order across development, staging, and production databases. Soft deletes (SET deleted_at = NOW() instead of DELETE) preserve data for audit trails. Triggers automatically execute code on events: CREATE TRIGGER log_update AFTER UPDATE ON elephants — useful for audit logging and maintaining derived data. Stored procedures run complex server-side logic, reducing network round-trips for multi-step operations.',
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

    build: [
      {
        id: 'sql-select',
        title: 'SELECT — Reading Data',
        content:
          '`SELECT` is the most common SQL statement. It reads data from one or more tables.\n\n' +
          '**Basic pattern:** `SELECT columns FROM table WHERE condition ORDER BY column LIMIT n;`\n\n' +
          '**SELECT *:** returns all columns — convenient for exploration, but in production always name the columns you need (faster, clearer).\n\n' +
          '**WHERE operators:** `=`, `!=`, `<`, `>`, `<=`, `>=`, `BETWEEN ... AND ...`, `IN (...)`, `LIKE` (pattern matching with `%` and `_` wildcards), `IS NULL` / `IS NOT NULL`.\n\n' +
          '**Combining conditions:** `AND` (both must be true), `OR` (either), `NOT` (invert). Use parentheses to group: `WHERE (park = "Kaziranga" OR park = "Manas") AND weight > 4000`.\n\n' +
          '**DISTINCT:** `SELECT DISTINCT park FROM elephants` returns each park name only once — removes duplicate rows from the result.',
        code: `-- All elephants
SELECT * FROM elephants;

-- Specific columns
SELECT name, weight FROM elephants;

-- Filter with WHERE
SELECT name, weight
FROM elephants
WHERE weight > 4000;

-- Multiple conditions
SELECT name, weight, park
FROM elephants
WHERE park = 'Kaziranga' AND weight > 4000;

-- Pattern matching
SELECT name FROM elephants
WHERE name LIKE 'R%';     -- starts with R
-- WHERE name LIKE '%a';  -- ends with a
-- WHERE name LIKE '_a%'; -- second letter is a

-- IN: match any value in a list
SELECT name, park FROM elephants
WHERE park IN ('Kaziranga', 'Manas');

-- BETWEEN: range (inclusive)
SELECT name, weight FROM elephants
WHERE weight BETWEEN 3500 AND 5000;

-- NULL checks
SELECT name FROM elephants
WHERE last_seen IS NULL;  -- never seen

-- Sort + limit
SELECT name, weight
FROM elephants
ORDER BY weight DESC   -- heaviest first
LIMIT 5;               -- top 5 only

-- Unique values
SELECT DISTINCT park FROM elephants;
-- Returns: Kaziranga, Manas (no duplicates)

-- Aliases make output readable
SELECT name AS elephant_name,
       weight AS weight_kg,
       weight * 2.2 AS weight_lbs
FROM elephants;`,
        diagram: 'SQLQueryFlowDiagram',
      },
      {
        id: 'sql-aggregate',
        title: 'Aggregates & GROUP BY',
        content:
          '**Aggregate functions** collapse multiple rows into a single value: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.\n\n' +
          '**GROUP BY** splits rows into groups and applies aggregates to each group separately. `SELECT park, COUNT(*) FROM elephants GROUP BY park` gives the count per park.\n\n' +
          '**HAVING** filters groups (like WHERE, but runs after GROUP BY). `HAVING COUNT(*) > 2` keeps only groups with more than 2 rows.\n\n' +
          '**Execution order matters:** FROM → WHERE (filter rows) → GROUP BY (form groups) → HAVING (filter groups) → SELECT (compute output) → ORDER BY → LIMIT. This is why you can\'t use an alias from SELECT in WHERE — WHERE runs first.\n\n' +
          '**COUNT(*) vs COUNT(column):** `COUNT(*)` counts all rows including NULLs. `COUNT(column)` skips rows where that column is NULL.',
        code: `-- Count all elephants
SELECT COUNT(*) AS total FROM elephants;
-- total: 5

-- Count per park
SELECT park, COUNT(*) AS num_elephants
FROM elephants
GROUP BY park;
-- Kaziranga | 3
-- Manas     | 2

-- Average weight per park
SELECT park,
       COUNT(*) AS count,
       ROUND(AVG(weight), 1) AS avg_weight,
       MIN(weight) AS lightest,
       MAX(weight) AS heaviest
FROM elephants
GROUP BY park;

-- HAVING: filter groups (not rows!)
SELECT park, AVG(weight) AS avg_w
FROM elephants
GROUP BY park
HAVING AVG(weight) > 4000;
-- Only Kaziranga (avg 4600) — Manas (avg 3500) excluded

-- SUM: total weight across all elephants
SELECT SUM(weight) AS total_weight FROM elephants;

-- Count sightings per elephant, sorted
SELECT e.name, COUNT(s.id) AS sighting_count
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
GROUP BY e.name
ORDER BY sighting_count DESC;

-- Combining WHERE and GROUP BY
-- WHERE filters rows BEFORE grouping
SELECT park, AVG(weight) AS avg_weight
FROM elephants
WHERE species = 'Asian'    -- filter first
GROUP BY park              -- then group
HAVING COUNT(*) >= 2       -- then filter groups
ORDER BY avg_weight DESC;  -- then sort`,
        diagram: 'SQLAggregateDiagram',
      },
      {
        id: 'sql-joins',
        title: 'Joins — Combining Tables',
        content:
          '**JOIN** combines rows from two or more tables based on a related column (usually a foreign key).\n\n' +
          '**INNER JOIN:** Returns only rows where both tables have a match. If an elephant has no sightings, it won\'t appear. If a sighting references a deleted elephant, it won\'t appear.\n\n' +
          '**LEFT JOIN:** All rows from the left table + matching rows from the right. If no match, right-side columns are NULL. Perfect for "show all elephants, even those never sighted."\n\n' +
          '**RIGHT JOIN:** Mirror of LEFT JOIN. All rows from the right table.\n\n' +
          '**FULL OUTER JOIN:** All rows from both tables. NULLs fill in wherever there\'s no match on either side.\n\n' +
          '**Table aliases** (`elephants e`, `sightings s`) keep queries short. Always qualify ambiguous column names: `e.id` vs `s.id`.',
        code: `-- Setup: two related tables
-- elephants: id, name, weight, park
-- sightings: id, elephant_id, date, location

-- INNER JOIN: only elephants WITH sightings
SELECT e.name, s.date, s.location
FROM elephants e
INNER JOIN sightings s ON e.id = s.elephant_id;

-- LEFT JOIN: ALL elephants, sightings if they exist
SELECT e.name, s.date, s.location
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id;
-- Tara | NULL | NULL  (she has no sightings)

-- Find elephants with ZERO sightings
SELECT e.name
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
WHERE s.id IS NULL;

-- Count sightings per elephant (including zero)
SELECT e.name, COUNT(s.id) AS num_sightings
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
GROUP BY e.name
ORDER BY num_sightings DESC;

-- Join THREE tables
SELECT e.name, s.date, p.name AS park_name
FROM elephants e
JOIN sightings s ON e.id = s.elephant_id
JOIN parks p ON s.park_id = p.id
WHERE s.date >= '2025-01-01';

-- Self-join: find elephant pairs with similar weight
SELECT a.name, b.name, ABS(a.weight - b.weight) AS diff
FROM elephants a
JOIN elephants b ON a.id < b.id
WHERE ABS(a.weight - b.weight) < 500;`,
        diagram: 'SQLJoinDiagram',
      },
      {
        id: 'sql-relationships',
        title: 'Relationships & Foreign Keys',
        content:
          'Tables relate to each other through **foreign keys** — a column in one table that references the primary key of another.\n\n' +
          '**One-to-Many (1:N):** One elephant has many sightings. The sightings table has `elephant_id` pointing to `elephants.id`. This is the most common relationship.\n\n' +
          '**Many-to-Many (M:N):** An elephant visits many parks, and a park has many elephants. This requires a **junction table** (also called a bridge or linking table) with two foreign keys: `park_elephants(elephant_id, park_id)`.\n\n' +
          '**One-to-One (1:1):** Rare — one elephant has one GPS collar. Usually just extra columns on the same table.\n\n' +
          '**Referential integrity:** `FOREIGN KEY` constraints prevent orphan records. You can\'t insert a sighting for elephant_id=99 if no elephant with id=99 exists. `ON DELETE CASCADE` automatically removes sightings when an elephant is deleted.',
        code: `-- One-to-Many: elephants → sightings
CREATE TABLE elephants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    weight REAL CHECK(weight > 0),
    species TEXT DEFAULT 'Asian'
);

CREATE TABLE sightings (
    id INTEGER PRIMARY KEY,
    elephant_id INTEGER NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    group_size INTEGER DEFAULT 1,
    FOREIGN KEY (elephant_id)
        REFERENCES elephants(id)
        ON DELETE CASCADE  -- delete sightings if elephant removed
);

-- Many-to-Many: elephants ↔ parks (via junction table)
CREATE TABLE parks (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT
);

CREATE TABLE park_elephants (
    elephant_id INTEGER,
    park_id INTEGER,
    first_seen DATE,
    PRIMARY KEY (elephant_id, park_id),  -- composite PK
    FOREIGN KEY (elephant_id) REFERENCES elephants(id),
    FOREIGN KEY (park_id) REFERENCES parks(id)
);

-- Insert with relationships
INSERT INTO elephants (id, name, weight) VALUES (1, 'Ranga', 4500);
INSERT INTO parks (id, name, state) VALUES (1, 'Kaziranga', 'Assam');
INSERT INTO park_elephants (elephant_id, park_id, first_seen)
    VALUES (1, 1, '2020-03-15');

-- Query through the junction table
SELECT e.name, p.name AS park, pe.first_seen
FROM elephants e
JOIN park_elephants pe ON e.id = pe.elephant_id
JOIN parks p ON pe.park_id = p.id;`,
        diagram: 'SQLRelationshipDiagram',
      },
      {
        id: 'sql-create-modify',
        title: 'CREATE, INSERT, UPDATE, DELETE',
        content:
          '**DDL (Data Definition Language):** `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE` — define and change the structure.\n\n' +
          '**DML (Data Manipulation Language):** `INSERT`, `UPDATE`, `DELETE` — add, change, and remove data.\n\n' +
          '**Constraints** enforce data rules: `PRIMARY KEY` (unique identifier), `NOT NULL` (required), `UNIQUE` (no duplicates), `CHECK` (value rules), `DEFAULT` (auto-fill), `FOREIGN KEY` (must reference existing row).\n\n' +
          '**Transactions** (`BEGIN`, `COMMIT`, `ROLLBACK`) group operations atomically — all succeed or all fail. Essential for operations like transferring funds between accounts.\n\n' +
          '**Safety tip:** Always use WHERE with UPDATE and DELETE. `DELETE FROM elephants;` (no WHERE) deletes every row. Test with SELECT first: if `SELECT * FROM elephants WHERE id = 3` returns the right row, then `DELETE FROM elephants WHERE id = 3` is safe.',
        code: `-- CREATE TABLE with constraints
CREATE TABLE elephants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    weight REAL CHECK(weight > 0),
    species TEXT DEFAULT 'Asian',
    park TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERT: add rows
INSERT INTO elephants (name, weight, park)
VALUES ('Ranga', 4500, 'Kaziranga');

-- Insert multiple rows
INSERT INTO elephants (name, weight, park) VALUES
    ('Mohini', 3800, 'Manas'),
    ('Gaja', 5200, 'Kaziranga'),
    ('Tara', 4100, 'Kaziranga');

-- UPDATE: modify existing rows (always use WHERE!)
UPDATE elephants
SET weight = 4600, park = 'Kaziranga Central'
WHERE name = 'Ranga';

-- DELETE: remove rows (always use WHERE!)
DELETE FROM elephants WHERE name = 'Tara';

-- Safety: test with SELECT first
SELECT * FROM elephants WHERE weight < 3000;
-- If that looks right, then:
-- DELETE FROM elephants WHERE weight < 3000;

-- ALTER TABLE: change structure
ALTER TABLE elephants ADD COLUMN last_seen DATE;

-- Transactions: all or nothing
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;
-- If anything fails between BEGIN and COMMIT,
-- ROLLBACK undoes everything

-- DROP TABLE: delete entire table (irreversible!)
-- DROP TABLE elephants;  -- be very careful!`,
        diagram: 'SQLTableDiagram',
      },
      {
        id: 'sql-subqueries',
        title: 'Subqueries & Advanced Patterns',
        content:
          'A **subquery** is a SELECT inside another query. It lets you use the result of one query as input to another.\n\n' +
          '**WHERE subqueries:** `WHERE id IN (SELECT ...)` filters rows based on another query\'s results. `WHERE weight > (SELECT AVG(weight) FROM elephants)` compares against a computed value.\n\n' +
          '**FROM subqueries:** Use a query result as a temporary table: `SELECT * FROM (SELECT ...) AS temp`.\n\n' +
          '**EXISTS:** `WHERE EXISTS (SELECT 1 FROM sightings WHERE ...)` returns true if the subquery has any results. Often faster than `IN` for large datasets.\n\n' +
          '**Common Table Expressions (CTEs):** `WITH name AS (SELECT ...) SELECT ... FROM name` — like naming a subquery. Cleaner, reusable, and can be recursive.\n\n' +
          '**Window functions:** `ROW_NUMBER()`, `RANK()`, `SUM() OVER (...)` compute values across rows without collapsing them (unlike GROUP BY). Essential for rankings, running totals, and moving averages.',
        code: `-- Subquery in WHERE: elephants heavier than average
SELECT name, weight
FROM elephants
WHERE weight > (SELECT AVG(weight) FROM elephants);

-- Subquery with IN: elephants seen in Kaziranga
SELECT name FROM elephants
WHERE id IN (
    SELECT elephant_id FROM sightings
    WHERE location = 'Kaziranga East'
);

-- EXISTS: elephants that HAVE been sighted
SELECT name FROM elephants e
WHERE EXISTS (
    SELECT 1 FROM sightings s
    WHERE s.elephant_id = e.id
);

-- CTE (Common Table Expression): named subquery
WITH heavy AS (
    SELECT name, weight, park
    FROM elephants
    WHERE weight > 4000
)
SELECT park, COUNT(*) AS heavy_count
FROM heavy
GROUP BY park;

-- Multiple CTEs
WITH
    kaz AS (SELECT * FROM elephants WHERE park = 'Kaziranga'),
    sighting_counts AS (
        SELECT elephant_id, COUNT(*) AS cnt
        FROM sightings GROUP BY elephant_id
    )
SELECT k.name, COALESCE(sc.cnt, 0) AS times_seen
FROM kaz k
LEFT JOIN sighting_counts sc ON k.id = sc.elephant_id;

-- Window function: rank elephants by weight
SELECT name, weight,
       RANK() OVER (ORDER BY weight DESC) AS weight_rank
FROM elephants;

-- Running total (cumulative sum)
SELECT date, group_size,
       SUM(group_size) OVER (ORDER BY date) AS cumulative
FROM sightings;

-- Partition: rank within each park
SELECT name, park, weight,
       ROW_NUMBER() OVER (
           PARTITION BY park
           ORDER BY weight DESC
       ) AS rank_in_park
FROM elephants;`,
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
        goDeeper:
          'The internet is a network of networks. Your device → router → ISP → internet backbone → destination server. Data travels as packets: each packet has a source IP, destination IP, and payload. TCP breaks data into ordered packets and ensures delivery (retransmits lost packets). UDP sends without guarantees (faster, used for video streaming and gaming). DNS translates domain names (google.com) to IP addresses (142.250.80.46). HTTP is the protocol web browsers use: a request (GET /page.html) produces a response (200 OK + content).',
        advanced:
          'The OSI model describes 7 layers of networking: Physical (cables, radio) → Data Link (Ethernet frames, MAC addresses) → Network (IP packets, routing) → Transport (TCP/UDP, ports) → Session → Presentation → Application (HTTP, SMTP, DNS). In practice, the TCP/IP model collapses these to 4 layers. Content Delivery Networks (CDNs) cache content at servers worldwide — when you access a website, the CDN serves content from the nearest edge server. HTTPS uses TLS encryption: the server presents a certificate (verified by a Certificate Authority), a secure session key is negotiated, and all subsequent data is encrypted. Certificate Transparency logs make it detectable when fake certificates are issued.',
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
        goDeeper:
          'A REST API uses HTTP methods: **GET** (read data), **POST** (create new data), **PUT** (update existing data), **DELETE** (remove data). Example: `GET /api/elephants` returns a JSON list of elephants. `POST /api/elephants` with body `{"name": "Ranga", "weight": 4500}` creates a new record. `GET /api/elephants/42` returns elephant #42. Response includes a status code: 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error). Python: `response = requests.get("https://api.example.com/elephants"); data = response.json()`.',
        advanced:
          'API authentication protects resources: **API keys** (simple tokens in headers), **OAuth 2.0** (delegation protocol — "log in with Google" uses OAuth), **JWT** (JSON Web Tokens — self-contained signed tokens encoding user identity). Rate limiting prevents abuse: APIs typically allow 60-1000 requests/minute per key. **GraphQL** (Facebook, 2015) is an alternative to REST: clients specify exactly which fields they need in a query, reducing over-fetching. **WebSocket** provides full-duplex, persistent connections for real-time data (chat, live dashboards, IoT sensor streams). **gRPC** (Google) uses protocol buffers for high-performance, strongly-typed API communication between microservices.',
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
        goDeeper:
          'Python requests library: resp = requests.get(url, params={"species": "asian"}, headers={"Authorization": "Bearer token"}). Check: resp.status_code, resp.raise_for_status(). Parse: data = resp.json(). POST: requests.post(url, json={"name": "Ranga"}). Handle errors: try/except requests.Timeout. **Pagination**: follow next_url links or increment page parameter. Rate limiting: respect Retry-After headers and implement exponential backoff for 429 (Too Many Requests) responses.',
        advanced:
          'Building APIs with FastAPI: @app.get("/elephants/{id}") async def get_elephant(id: int): return db.find(id). Auto-generates OpenAPI docs. **Middleware** adds CORS, logging, auth. Docker packages the API portably. **GraphQL** lets clients specify exactly which fields they need, reducing over-fetching. **WebSocket** provides real-time bidirectional communication. **gRPC** uses protocol buffers for high-performance inter-service communication. API versioning (/api/v1/, /api/v2/) maintains backward compatibility as the API evolves.',
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
        goDeeper:
          'Building a weather dashboard: (1) Get an API key from OpenWeatherMap. (2) Request: requests.get(f"https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid={key}&units=metric"). (3) Parse: data["main"]["temp"], data["weather"][0]["description"]. (4) Display or store. **Error handling**: check status codes, handle network timeouts, validate response format. **Caching**: save API responses locally to avoid hitting rate limits — store the result with a timestamp and reuse if less than 10 minutes old.',
        advanced:
          'API design principles: use nouns for resources (/elephants, /sightings), HTTP verbs for actions (GET=read, POST=create, PUT=update, DELETE=remove), consistent error format ({"error": "message", "code": 404}), pagination (page=2&per_page=20), and versioning (/api/v1/). HATEOAS (Hypermedia as the Engine of Application State) includes links in responses: {"next": "/elephants?page=3"}, allowing clients to discover available actions. API documentation (Swagger/OpenAPI) auto-generates interactive docs where developers can try endpoints directly in the browser.',
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
        goDeeper:
          'Algorithm efficiency is measured by **Big O notation**: O(1) = constant time (array access), O(log n) = logarithmic (binary search), O(n) = linear (scanning a list), O(n log n) = linearithmic (merge sort), O(n²) = quadratic (bubble sort), O(2ⁿ) = exponential (brute force). For n=1,000,000: O(n) takes ~1 ms, O(n log n) ~20 ms, O(n²) ~17 minutes, O(2ⁿ) → heat death of the universe. Binary search on a sorted array of 1 billion elements finds any item in at most **30 comparisons** (log₂ 10⁹ ≈ 30). This is why sorting data first (O(n log n) one-time cost) pays off with repeated O(log n) searches.',
        advanced:
          'The P vs NP problem asks whether every problem whose solution can be verified quickly (in polynomial time) can also be solved quickly. If P = NP, then problems like the travelling salesman, protein folding, and breaking RSA encryption would have efficient algorithms — transforming science, medicine, and rendering current cryptography useless. Most computer scientists believe P ≠ NP, but no proof exists. This is one of the seven Millennium Prize Problems ($1 million reward). **NP-complete** problems (Boolean satisfiability, graph coloring, subset sum) are the hardest in NP — solving any one efficiently would solve all of them. Practical approaches: heuristics, approximation algorithms, and quantum computing (which offers speedups for some problems but does not solve NP-complete problems in general).',
        diagram: 'FlowchartDiagram',
      },
      {
        id: 'algo-arrays',
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
        code: `from collections import deque

# ── Stack: Last-In, First-Out (LIFO) ──
# Use a regular list — append() and pop() are O(1)
stack = []
stack.append("page1")   # push
stack.append("page2")
stack.append("page3")
print(stack)             # ['page1', 'page2', 'page3']
last = stack.pop()       # pop — removes and returns last
print(last)              # 'page3' (most recent)
print(stack)             # ['page1', 'page2']

# Real use: bracket matching, undo history, DFS

# ── Queue: First-In, First-Out (FIFO) ──
# Use deque — append() and popleft() are both O(1)
queue = deque()
queue.append("task1")    # enqueue
queue.append("task2")
queue.append("task3")
first = queue.popleft()  # dequeue — removes and returns first
print(first)             # 'task1' (oldest)
print(queue)             # deque(['task2', 'task3'])

# Real use: BFS, print queue, task scheduling

# ── deque as a sliding window ──
window = deque(maxlen=3)  # auto-evicts oldest when full
for val in [10, 20, 30, 40, 50]:
    window.append(val)
    print(list(window))
# [10]
# [10, 20]
# [10, 20, 30]
# [20, 30, 40]  ← 10 auto-evicted
# [30, 40, 50]  ← 20 auto-evicted

# ── When to use what ──
# List:  access by index, append/pop at end
# Deque: fast append/pop at BOTH ends
# Dict:  lookup by key, counting, grouping
# Set:   membership testing, deduplication`,
        goDeeper:
          'An array stores elements in contiguous memory. Access by index: O(1) — jump directly to position. Insert/delete at the end: O(1) amortized. Insert/delete in the middle: O(n) — must shift all subsequent elements. Python lists are dynamic arrays that automatically resize (doubling capacity when full). A linked list stores each element with a pointer to the next: insert/delete anywhere is O(1) if you have a reference to the position, but access by index is O(n) — you must walk from the start. Arrays for random access; linked lists for frequent insertion/deletion.',
        advanced:
          'Hash maps (Python dict, JavaScript Object/Map) combine arrays with hash functions for O(1) average lookup by key. The hash function maps keys to array indices; collisions (two keys mapping to the same index) are handled by chaining (linked lists at each index) or open addressing (probing for the next empty slot). Load factor (items/slots) affects performance: Python dicts resize when ~2/3 full. Stacks (LIFO: push/pop) and queues (FIFO: enqueue/dequeue) are abstract data types implementable with arrays or linked lists. Stacks handle function calls, undo operations, and expression parsing; queues handle print jobs, BFS, and message passing.',
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
        goDeeper:
          'Linear search: check each element from start to end. O(n) — works on any list. Binary search: for sorted data only. Compare with the middle element; if target is smaller, search the left half; if larger, search the right half. Each step halves the search space: O(log n). For 1 billion elements: linear search checks up to 10⁹ items; binary search checks at most log₂(10⁹) ≈ **30 items**. Implementation: lo, hi = 0, len(arr)-1; while lo <= hi: mid = (lo+hi)//2; if arr[mid] == target: return mid; elif arr[mid] < target: lo = mid+1; else: hi = mid-1.',
        advanced:
          'Binary search applies beyond sorted arrays: any scenario where you can determine which half contains the answer. **Binary search on answer**: "What is the minimum speed to arrive on time?" — binary search over possible speeds, checking each with a feasibility function. **Bisection method** (root finding): find where f(x) = 0 by repeatedly halving the interval where the sign changes. Git bisect uses binary search through commit history. Interpolation search improves on binary search for uniformly distributed data: instead of always checking the midpoint, it estimates the target\'s position proportionally — achieving O(log log n) average case.',
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
        goDeeper:
          'Sorting compared: **Bubble sort** O(n²) — swap adjacent pairs, repeat. **Merge sort** O(n log n) — divide, sort halves, merge; uses O(n) memory. **Quick sort** O(n log n) average — pick pivot, partition, recurse; fastest in practice. Python\'s sorted() uses **Timsort** — optimized for real-world data with partial ordering. For 1M items: bubble sort ≈ 17 min, merge sort ≈ 0.02 sec. Binary search on sorted data: O(log n) — finds any item in 1 billion elements in **30 steps**.',
        advanced:
          'Advanced data structures: **hash tables** (Python dict) give O(1) average lookup via hash functions. **BSTs** maintain sorted order with O(log n) operations. **Heaps** provide O(1) min/max — used in priority queues, Dijkstra\'s algorithm, and OS schedulers. **Graphs** model networks: BFS (shortest unweighted paths), Dijkstra (weighted), A* (heuristic). **Dynamic programming** solves optimization by caching subproblem results — the Fibonacci sequence computed naively is O(2ⁿ) but with memoization is O(n). DP is the key technique for coding interview problems and real-world optimization.',
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
        goDeeper:
          'Big O describes how time grows with input size n: O(1) constant (array access, hash lookup), O(log n) logarithmic (binary search), O(n) linear (scan entire list), O(n log n) linearithmic (merge sort, Python sorted()), O(n²) quadratic (nested loops, bubble sort), O(2ⁿ) exponential (brute force subset enumeration). To find Big O: count nested loops. One loop over n → O(n). Two nested loops each over n → O(n²). A loop that halves n each iteration → O(log n). Drop constants and lower terms: O(3n² + 5n + 7) = O(n²).',
        advanced:
          'Space complexity measures memory usage: merge sort uses O(n) extra space; quicksort uses O(log n) stack space. In-place algorithms (heapsort) use O(1) extra space. Amortized analysis: Python list.append() is O(1) amortized — occasional O(n) resize is spread across n operations. The Master Theorem solves divide-and-conquer recurrences: T(n) = aT(n/b) + O(n^d). If d < log_b(a): T = O(n^(log_b(a))); if d = log_b(a): T = O(n^d log n); if d > log_b(a): T = O(n^d). For merge sort: a=2, b=2, d=1, log₂2 = 1 = d → T = O(n log n). This theorem covers most recursive algorithm analyses.',
      },
    ],

    build: [
      {
        id: 'algo-search',
        title: 'Linear and Binary Search',
        diagram: 'BinarySearchDiagram',
        content:
          'Linear search checks every element one by one — O(n). Binary search halves the search space each step — O(log n), but the data must be sorted.\n\n' +
          'Binary search is the reason looking up a word in a dictionary is fast: you open to the middle, check if your word comes before or after, and repeat on the correct half.',
        code: `# ── Linear search — check every element ──
def linear_search(items, target):
    """Return index of target, or -1 if not found."""
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1

names = ["Ranga", "Mohini", "Kavi", "Priya"]
print(linear_search(names, "Kavi"))    # 2
print(linear_search(names, "Arjun"))   # -1

# ── Binary search — halve the search space each step ──
def binary_search(sorted_list, target):
    """Return index of target in a sorted list, or -1."""
    left, right = 0, len(sorted_list) - 1
    while left <= right:
        mid = (left + right) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1   # target is in right half
        else:
            right = mid - 1  # target is in left half
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(numbers, 23))   # 5
print(binary_search(numbers, 50))   # -1

# ── Find closest value (not exact match) ──
def find_closest(sorted_list, target):
    """Find the value closest to target in a sorted list."""
    if not sorted_list:
        return None
    left, right = 0, len(sorted_list) - 1
    while left < right:
        mid = (left + right) // 2
        if sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid
    # Check neighbors
    best = left
    if left > 0 and abs(sorted_list[left-1] - target) < abs(sorted_list[left] - target):
        best = left - 1
    return sorted_list[best]

temps = [0, 1000, 2000, 3000, 4000]
print(find_closest(temps, 1500))  # 1000 or 2000`,
      },
      {
        id: 'algo-sorting',
        title: 'Sorting Algorithms',
        diagram: 'BubbleSortDiagram',
        content:
          'Sorting puts elements in order. Python\'s built-in `sorted()` uses Timsort (O(n log n)), but understanding simpler algorithms teaches you how sorting works.\n\n' +
          '**Bubble sort** — repeatedly swap adjacent out-of-order pairs. Simple but slow: O(n\u00B2).\n' +
          '**Insertion sort** — build the sorted portion one element at a time. Fast on nearly-sorted data.\n' +
          '**When to use what:** For small lists or educational purposes, write your own. For real code, use `sorted()` or `.sort()`.',
        code: `# ── Bubble sort — swap adjacent elements ──
def bubble_sort(items):
    """Sort a list using bubble sort. Returns new sorted list."""
    arr = items[:]  # don't mutate the input
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # already sorted — stop early
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
# [11, 12, 22, 25, 34, 64, 90]

# ── Insertion sort — insert each element into its place ──
def insertion_sort(items):
    """Sort using insertion sort. Returns new sorted list."""
    arr = items[:]
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

print(insertion_sort([5, 2, 8, 1, 9]))
# [1, 2, 5, 8, 9]

# ── Python's built-in sort — use this in real code ──
animals = [("elephant", 4500), ("dolphin", 150), ("rhino", 2200)]

# Sort by weight (second element)
by_weight = sorted(animals, key=lambda a: a[1])
print(by_weight)
# [('dolphin', 150), ('rhino', 2200), ('elephant', 4500)]

# Sort descending
by_weight_desc = sorted(animals, key=lambda a: a[1], reverse=True)
print(by_weight_desc[0])  # ('elephant', 4500)`,
      },
      {
        id: 'algo-two-pointer',
        title: 'Two-Pointer Technique',
        diagram: 'TwoPointerDiagram',
        content:
          'The two-pointer technique uses two indices that move through a list from opposite ends (or at different speeds). ' +
          'It solves many problems in O(n) that would otherwise need O(n\u00B2).\n\n' +
          '**Common uses:**\n' +
          '- Palindrome checking (compare from both ends)\n' +
          '- Reversing a list in-place\n' +
          '- Finding pairs that sum to a target\n' +
          '- Checking symmetry',
        code: `# ── Palindrome check with two pointers ──
def is_palindrome(text):
    """Check if text reads the same forwards and backwards.
    Case-insensitive, ignoring non-alphanumeric characters."""
    left, right = 0, len(text) - 1
    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not text[left].isalnum():
            left += 1
        # Skip non-alphanumeric from right
        while left < right and not text[right].isalnum():
            right -= 1
        if text[left].lower() != text[right].lower():
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("Race Car"))              # True
print(is_palindrome("A man a plan a canal Panama"))  # True
print(is_palindrome("hello"))                  # False

# ── Reverse a list in-place ──
def reverse_in_place(items):
    """Reverse a list using two pointers — O(1) extra space."""
    left, right = 0, len(items) - 1
    while left < right:
        items[left], items[right] = items[right], items[left]
        left += 1
        right -= 1
    return items

data = [1, 2, 3, 4, 5]
print(reverse_in_place(data))  # [5, 4, 3, 2, 1]

# ── Check symmetry with tolerance ──
def is_symmetric(profile, tolerance=0):
    """Check if a list is symmetric (palindrome) within tolerance."""
    left, right = 0, len(profile) - 1
    while left < right:
        if abs(profile[left] - profile[right]) > tolerance:
            return False
        left += 1
        right -= 1
    return True

print(is_symmetric([5, 8, 10, 8, 5]))       # True
print(is_symmetric([5, 8, 10, 8.1, 4.9], 0.2))  # True`,
      },
      {
        id: 'algo-sliding-window',
        title: 'Sliding Window',
        diagram: 'SlidingWindowDiagram',
        content:
          'The sliding window technique processes a fixed-size window that moves across a list. Instead of recalculating everything ' +
          'for each position, you update the result by subtracting what left the window and adding what entered.\n\n' +
          'This reduces O(n \u00D7 k) brute force to O(n), where k is the window size.',
        code: `# ── Moving average with sliding window ──
def moving_average(data, window):
    """Calculate moving average in O(n) — not O(n*k)."""
    if not data or window <= 0 or window > len(data):
        return []

    # Calculate sum of first window
    window_sum = sum(data[:window])
    result = [round(window_sum / window, 1)]

    # Slide: subtract left, add right
    for i in range(window, len(data)):
        window_sum += data[i] - data[i - window]
        result.append(round(window_sum / window, 1))

    return result

rainfall = [10, 20, 30, 40, 50]
print(moving_average(rainfall, 3))  # [20.0, 30.0, 40.0]

# ── Maximum sum subarray of size k ──
def max_sum_subarray(nums, k):
    """Find the maximum sum of any k consecutive elements."""
    if len(nums) < k:
        return None
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))  # 9 (5+1+3)

# ── Longest streak of positive values ──
def longest_positive_streak(data):
    """Find the longest consecutive streak of positive numbers."""
    current = 0
    longest = 0
    for value in data:
        if value > 0:
            current += 1
            longest = max(longest, current)
        else:
            current = 0
    return longest

growth = [2, 3, 0, 1, 4, 5, 0, 1]
print(longest_positive_streak(growth))  # 3`,
      },
      {
        id: 'algo-bfs-dfs',
        title: 'BFS and DFS — Graph Traversal',
        diagram: 'BFSDFSDiagram',
        content:
          'Graphs model connections: villages connected by bridges, cells in a grid, nodes in a network. ' +
          'Two fundamental ways to explore a graph:\n\n' +
          '**BFS (Breadth-First Search)** — explore all neighbors first, then their neighbors. Uses a queue. ' +
          'Finds the shortest path in unweighted graphs.\n\n' +
          '**DFS (Depth-First Search)** — go as deep as possible before backtracking. Uses a stack (or recursion). ' +
          'Good for exploring all paths, counting connected components.',
        code: `from collections import deque

# ── BFS — explore layer by layer ──
def bfs(graph, start):
    """Visit all reachable nodes using BFS."""
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

village_graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}
print(bfs(village_graph, "A"))  # ['A', 'B', 'C', 'D']

# ── Count islands in a grid (DFS) ──
def count_islands(grid):
    """Count connected components of 1s in a 2D grid."""
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    visited = set()
    count = 0

    def dfs(r, c):
        if (r, c) in visited or r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != 1:
            return
        visited.add((r, c))
        dfs(r+1, c)  # down
        dfs(r-1, c)  # up
        dfs(r, c+1)  # right
        dfs(r, c-1)  # left

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 and (r, c) not in visited:
                dfs(r, c)
                count += 1
    return count

river = [
    [1, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
]
print(count_islands(river))  # 3

# ── Shortest path with BFS (unweighted) ──
def shortest_path(graph, start, end):
    """BFS shortest path — returns distance or -1."""
    if start == end:
        return 0
    visited = {start}
    queue = deque([(start, 0)])
    while queue:
        node, dist = queue.popleft()
        for neighbor in graph.get(node, []):
            if neighbor == end:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1

print(shortest_path(village_graph, "A", "D"))  # 2`,
      },
      {
        id: 'algo-recursion',
        title: 'Recursion',
        diagram: 'RecursionTreeDiagram',
        content:
          'A recursive function calls itself with a smaller version of the problem. Every recursive function needs:\n\n' +
          '1. **Base case** — the simplest version that returns directly (stops the recursion)\n' +
          '2. **Recursive case** — breaks the problem down and calls itself\n\n' +
          'Think of it like Russian nesting dolls: each doll contains a smaller doll, until you reach the tiniest one.',
        code: `# ── Tree depth — classic recursion ──
def tree_depth(tree):
    """Find the maximum depth of a nested dictionary.
    {} has depth 0. {"a": {"b": {}}} has depth 2."""
    if not isinstance(tree, dict) or not tree:
        return 0
    return 1 + max(tree_depth(v) for v in tree.values())

print(tree_depth({}))                             # 0
print(tree_depth({"a": {"b": {"c": {}}}}))        # 3
print(tree_depth({"left": {}, "right": {"x": {}}}))  # 2

# ── Factorial ──
def factorial(n):
    """n! = n * (n-1) * ... * 1. Base case: 0! = 1."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120 (5 * 4 * 3 * 2 * 1)

# ── Flatten nested lists ──
def flatten(nested):
    """Flatten a list that may contain other lists."""
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))  # recurse
        else:
            result.append(item)
    return result

print(flatten([1, [2, 3], [4, [5, 6]]]))
# [1, 2, 3, 4, 5, 6]

# ── When NOT to recurse ──
# Fibonacci is the classic example of BAD recursion
# (exponential time without memoization)

# GOOD: iterative Fibonacci
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fibonacci(10))  # 55`,
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
        goDeeper:
          'The CIA triad: **Confidentiality**, **Integrity**, **Availability**. Common attacks: phishing (91% of breaches), SQL injection, XSS (injecting scripts), MITM (intercepting traffic). Defense: input validation, parameterized queries, HTTPS, CSP headers, MFA. Password strength: entropy = log₂(pool^length). A random 12-character password from 95 printable ASCII characters: entropy = 12 × log₂(95) ≈ 79 bits — would take ~10¹⁶ years to brute force at 10 billion guesses/second.',
        advanced:
          'The OWASP Top 10 lists critical risks: Broken Access Control, Cryptographic Failures, Injection, Insecure Design. **Zero-trust** verifies every request. India\'s CERT-In mandates 6-hour breach reporting. MFA types ranked by security: hardware key (FIDO2) > authenticator app (TOTP) > SMS (vulnerable to SIM swap). OAuth 2.0 enables "Sign in with Google" without sharing passwords. JWTs (JSON Web Tokens) carry signed claims — but must be validated server-side and have short expiration to limit damage from theft.',
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
        goDeeper:
          'Symmetric encryption (AES-256): same key for encrypt/decrypt. 14 rounds of substitution and mixing on 128-bit blocks. Brute-forcing 2²⁵⁶ keys: impossible. Asymmetric (RSA): public key encrypts, private decrypts. Password hashing: bcrypt/argon2 use deliberately slow functions (100ms+) with unique salts. HTTPS uses TLS: asymmetric encryption exchanges a symmetric session key, then symmetric encrypts the actual data (faster). The padlock icon in your browser means this handshake succeeded.',
        advanced:
          'Post-quantum cryptography: NIST selected CRYSTALS-Kyber (lattice-based key exchange) and Dilithium (signatures). **Homomorphic encryption** computes on encrypted data — enabling privacy-preserving analytics. **Zero-knowledge proofs** prove knowledge without revealing it (used in crypto privacy, potential for age verification). End-to-end encryption (Signal protocol, WhatsApp) ensures only sender and receiver can read messages — even the service provider cannot decrypt. Forward secrecy generates unique session keys so past communications remain secure even if long-term keys are later compromised.',
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
        goDeeper:
          'Phishing emails mimic legitimate senders — check the actual sender address (not display name), hover over links before clicking, be suspicious of urgency ("Your account will be closed in 24 hours!"). **Malware** types: virus (attaches to programs, requires user action), worm (self-propagating across networks), trojan (disguised as legitimate software), ransomware (encrypts files, demands payment). Defense: keep software updated (patches fix known vulnerabilities), use antivirus, don\'t download from untrusted sources, enable automatic updates.',
        advanced:
          'Social engineering exploits human psychology rather than technical vulnerabilities. **Pretexting** (creating a fake scenario to extract information), **baiting** (leaving infected USB drives in parking lots), **tailgating** (following authorized personnel through secure doors), and **vishing** (phone phishing) all bypass technical defenses. Defense requires security awareness training — organizations that conduct regular simulated phishing exercises reduce click rates from ~30% to ~5%. The weakest link in any security system is usually human behavior, which is why security culture matters more than technology alone.',
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
        goDeeper:
          'Password best practices: use a password manager (Bitwarden, 1Password), generate unique 16+ character passwords for each site, enable 2FA everywhere (authenticator app > SMS). Personal data hygiene: minimize information shared on social media (birthdate, mother\'s maiden name — common security questions), use privacy-focused search engines and browsers, review app permissions regularly. Network safety: avoid public WiFi for sensitive transactions (or use a VPN), verify HTTPS before entering credentials, log out of shared computers.',
        advanced:
          'Threat modeling identifies what you need to protect, from whom, and the consequences of failure. For a student: protect social media accounts (reputation), email (password resets), and school accounts (grades). For a developer: protect source code (IP theft), API keys (unauthorized access), and user data (legal liability). Defense in depth layers multiple protections: strong passwords + 2FA + encrypted storage + regular backups + network monitoring. The principle of least privilege grants only the minimum access needed — don\'t run everyday tasks as administrator, don\'t give apps permissions they don\'t need.',
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

  // ─────────────────────────────────────────────────────────────
  // LOGIC GATES & BOOLEAN ALGEBRA
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'logic-gates',
    title: 'Logic Gates & Boolean Algebra',
    category: 'electronics',
    icon: '⚡',
    tagline: 'The building blocks of every computer — from simple switches to complex circuits.',
    relatedStories: ['girl-who-spoke-to-elephants'],

    understand: [
      {
        title: 'Switches — Where It All Begins',
        content:
          'A light switch is the simplest computer you already own. Flip it up — the light is ON (1). ' +
          'Flip it down — the light is OFF (0). That is one **bit** of information: a single yes-or-no, ' +
          'on-or-off, true-or-false choice. Everything a computer does — playing music, sending messages, ' +
          'running games — boils down to billions of these tiny on/off decisions happening incredibly fast.\n\n' +
          'Why only two states? Because it is far easier to build reliable electronic circuits that distinguish ' +
          'between "electricity flowing" and "no electricity flowing" than to recognize many different voltage levels. ' +
          'This two-state system is called **binary**, and the digits 0 and 1 are called **binary digits** (bits). ' +
          'Eight bits make a **byte**, enough to represent a single letter or a number up to 255.',
        goDeeper:
          'Binary (base-2) works exactly like decimal (base-10), but with only two digits. In decimal, 237 means ' +
          '2×100 + 3×10 + 7×1. In binary, 1101 means 1×8 + 1×4 + 0×2 + 1×1 = 13. ' +
          'To convert decimal to binary, repeatedly divide by 2 and read the remainders bottom-to-top. ' +
          'Hexadecimal (base-16) is a shorthand: each hex digit (0–9, A–F) represents exactly 4 bits. ' +
          'So the binary number 1010 1111 becomes AF in hex. Programmers use hex because it is compact yet maps ' +
          'directly to binary — every color code like #FF6600 is really 24 bits of red, green, and blue.',
        advanced:
          'At the transistor level, a switch is a MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor). ' +
          'When voltage is applied to the gate terminal, the channel between source and drain becomes conductive — ' +
          'the switch is "on." Modern processors use complementary pairs (CMOS): an nMOS transistor pulls the ' +
          'output low (0) while a pMOS pulls it high (1). This complementary design means current only flows ' +
          'during switching, dramatically reducing power consumption. A single transistor in a modern chip is ' +
          'about 5 nanometers wide — roughly 10 atoms across. A human hair is 80,000 nm wide.',
      },
      {
        title: 'AND Gate — Both Must Be True',
        content:
          'Imagine a bank vault that needs **two keys** turned at the same time to open. If only one person shows ' +
          'up, the vault stays locked. Both must be present. That is exactly how an AND gate works: the output is 1 ' +
          '(true) **only** when input A **and** input B are both 1.\n\n' +
          'Truth table:\n\n' +
          '| A | B | Output |\n' +
          '| --- | --- | --- |\n' +
          '| 0 | 0 | 0 |\n' +
          '| 0 | 1 | 0 |\n' +
          '| 1 | 0 | 0 |\n' +
          '| 1 | 1 | 1 |\n\n' +
          'In everyday life, AND logic appears everywhere: a car starts only if the key is in **and** the brake ' +
          'is pressed. A microwave runs only if the door is closed **and** the start button is pressed.',
        goDeeper:
          'In Boolean algebra, AND is written as multiplication: A · B or simply AB. This is because the ' +
          'multiplication table for 0 and 1 matches the AND truth table: 0×0=0, 0×1=0, 1×0=0, 1×1=1. ' +
          'AND has useful algebraic properties: **identity** (A · 1 = A), **null** (A · 0 = 0), ' +
          '**idempotent** (A · A = A), **commutative** (A · B = B · A), and **associative** ' +
          '((A · B) · C = A · (B · C)). These let you simplify complex expressions.',
        advanced:
          'A CMOS AND gate is built by cascading a NAND gate (2 pMOS in parallel + 2 nMOS in series) followed by ' +
          'an inverter. The NAND+NOT combination uses 6 transistors. In practice, NAND gates are the fundamental ' +
          'building block in CMOS logic because they are faster and use fewer transistors than direct AND implementations. ' +
          'AND gates with more than 2 inputs exist: a 3-input AND (A · B · C) outputs 1 only when all three ' +
          'inputs are 1. In Verilog: `assign out = a & b;`. In VHDL: `out <= a AND b;`.',
        diagram: 'LogicGateSymbolsDiagram',
      },
      {
        title: 'OR Gate — At Least One Must Be True',
        content:
          'Picture a house with **two doorbells** — one at the front door, one at the back. If someone presses ' +
          'either bell (or both), the chime rings. That is an OR gate: the output is 1 when input A **or** input B ' +
          '(or both) is 1. The only time the output is 0 is when both inputs are 0 — nobody is ringing.\n\n' +
          'Truth table:\n\n' +
          '| A | B | Output |\n' +
          '| --- | --- | --- |\n' +
          '| 0 | 0 | 0 |\n' +
          '| 0 | 1 | 1 |\n' +
          '| 1 | 0 | 1 |\n' +
          '| 1 | 1 | 1 |\n\n' +
          'A smoke alarm that triggers from smoke **or** heat uses OR logic. A phone that unlocks with fingerprint ' +
          '**or** face recognition is another OR example.',
        goDeeper:
          'In Boolean algebra, OR is written as addition: A + B. The "addition" table for bits: 0+0=0, 0+1=1, 1+0=1, 1+1=1 ' +
          '(not 2 — there is no 2 in Boolean). Properties: **identity** (A + 0 = A), **null** (A + 1 = 1), ' +
          '**idempotent** (A + A = A), **commutative**, and **associative**. The **distributive law** connects AND and OR: ' +
          'A · (B + C) = A·B + A·C (just like regular algebra). The **absorption law** simplifies: ' +
          'A + A·B = A (if A is true, the whole thing is true regardless of B).',
        advanced:
          'A CMOS OR gate uses a NOR gate followed by an inverter (4+2 = 6 transistors). Like AND, OR gates in ' +
          'real chips are usually built from NOR + NOT. The **inclusive OR** (standard OR) differs from **exclusive OR** (XOR): ' +
          'inclusive OR includes the case where both inputs are 1. In natural language, "or" is often exclusive ' +
          '("soup or salad" — you pick one), but in digital logic, OR is always inclusive unless explicitly XOR.',
      },
      {
        title: 'NOT Gate — The Inverter',
        content:
          'The NOT gate is the simplest gate of all — it has just one input and flips it. Give it a 0, you get 1. ' +
          'Give it a 1, you get 0. Think of it as **opposite day**: whatever you say, the NOT gate says the opposite.\n\n' +
          'Truth table:\n\n' +
          '| A | Output |\n' +
          '| --- | --- |\n' +
          '| 0 | 1 |\n' +
          '| 1 | 0 |\n\n' +
          'NOT is incredibly useful. A "door open" sensor outputs 1 when the door is open. But the alarm system needs ' +
          'to know when the door is **not** open (closed). A NOT gate converts the signal: NOT(open) = closed.',
        goDeeper:
          'NOT is written with an overbar: ¬A or A̅ (A-bar). Key properties: **involution** (NOT NOT A = A — ' +
          'flipping twice gets you back), **complement** (A · ¬A = 0, A + ¬A = 1 — something ' +
          'cannot be both true and false, and must be one or the other). In circuits, the NOT gate is drawn as a ' +
          'triangle pointing right with a small circle (bubble) at the output. That bubble is the universal symbol ' +
          'for inversion — you will see it on NAND, NOR, and XNOR gates too.',
        advanced:
          'A CMOS inverter is the simplest CMOS circuit: one pMOS transistor connected to V_DD (power) and one nMOS ' +
          'connected to ground. When input is high, nMOS conducts (output pulled low). When input is low, pMOS conducts ' +
          '(output pulled high). The inverter is the basis of all CMOS logic. Its **voltage transfer characteristic** ' +
          '(VTC) curve shows a sharp transition between high and low output — the steeper the curve, the better ' +
          'the noise margin. Fan-out (how many gates one inverter can drive) is limited by capacitive loading.',
      },
      {
        title: 'NAND and NOR — The Universal Gates',
        content:
          'NAND means "NOT AND" — it does an AND, then flips the result. NOR means "NOT OR." These might seem ' +
          'like minor variations, but they have a superpower: **any logic circuit can be built using only NAND gates** ' +
          '(or only NOR gates). That is why they are called **universal gates**.\n\n' +
          'NAND truth table (opposite of AND):\n\n' +
          '| A | B | Output |\n' +
          '| --- | --- | --- |\n' +
          '| 0 | 0 | 1 |\n' +
          '| 0 | 1 | 1 |\n' +
          '| 1 | 0 | 1 |\n' +
          '| 1 | 1 | 0 |\n\n' +
          'Why is this useful? Chip manufacturers can mass-produce billions of identical NAND gates, then wire them ' +
          'differently to create any circuit they need. One building block, infinite possibilities.',
        goDeeper:
          'To build NOT from NAND: connect both inputs to the same signal. NAND(A, A) = NOT(A · A) = NOT(A). ' +
          'To build AND from NAND: NAND then NOT, which is NAND followed by another NAND-as-NOT. To build OR from ' +
          'NAND: NOT each input first, then NAND the results. This follows from **De Morgan\'s theorem**: ' +
          '¬(A · B) = ¬A + ¬B. Similarly, NOR is universal: NOT from NOR(A, A), OR from ' +
          'NOR-then-NOR-as-NOT, AND from NOT-each-then-NOR.',
        advanced:
          'NAND-only design is not just theoretical — it is standard practice in VLSI. The 7400 series TTL ' +
          'chip (quad 2-input NAND) was the workhorse of early digital design. Modern FPGA look-up tables (LUTs) ' +
          'can implement any Boolean function of N inputs, effectively acting as programmable universal gates. ' +
          'In NAND flash memory (used in SSDs and USB drives), the name comes from the NAND gate structure used ' +
          'to connect floating-gate transistors in series, enabling high-density storage.',
      },
      {
        title: 'XOR — The Odd One Out',
        content:
          'Imagine a hallway light controlled by **two switches**, one at each end. If both switches are in the same ' +
          'position (both up or both down), the light is off. If they differ (one up, one down), the light is on. ' +
          'That is XOR — **exclusive OR**. The output is 1 when the inputs are **different**.\n\n' +
          'Truth table:\n\n' +
          '| A | B | Output |\n' +
          '| --- | --- | --- |\n' +
          '| 0 | 0 | 0 |\n' +
          '| 0 | 1 | 1 |\n' +
          '| 1 | 0 | 1 |\n' +
          '| 1 | 1 | 0 |\n\n' +
          'XOR is crucial in computers because it is the heart of binary addition (more on that next) and is also ' +
          'used in error detection, encryption, and graphics.',
        goDeeper:
          'XOR is written as A ⊕ B. It can be expressed using basic gates: A ⊕ B = (A · ¬B) + (¬A · B). ' +
          'Useful XOR properties: **self-inverse** (A ⊕ A = 0), **identity** (A ⊕ 0 = A), ' +
          '**complementary** (A ⊕ 1 = ¬A). The self-inverse property is why XOR is used in encryption: ' +
          'if you XOR a message with a key to encrypt, XOR-ing the ciphertext with the same key decrypts it. ' +
          'XNOR (the complement of XOR) outputs 1 when inputs are the **same** — it is an equality detector.',
        advanced:
          'XOR has deep connections to modular arithmetic: A ⊕ B is addition modulo 2. The parity of a binary ' +
          'number (odd or even number of 1s) equals the XOR of all its bits. This is the basis of **parity check** ' +
          'error detection: append a bit so the total number of 1s is always even. If any single bit flips during ' +
          'transmission, the parity changes and the error is detected. **Hamming codes** extend this idea to not ' +
          'just detect but also correct single-bit errors using multiple parity bits at specific positions.',
      },
      {
        title: 'Combining Gates — Building an Adder',
        content:
          'Now the magic begins: by connecting gates together, we can build circuits that **do math**. The simplest ' +
          'is the **half adder**, which adds two single-bit numbers (0+0, 0+1, 1+0, or 1+1).\n\n' +
          'It uses just two gates:\n' +
          '• An **XOR gate** produces the **sum** bit (because 0+0=0, 0+1=1, 1+0=1, 1+1=0 with a carry)\n' +
          '• An **AND gate** produces the **carry** bit (because only 1+1 generates a carry of 1)\n\n' +
          'Two half adders plus an OR gate make a **full adder** that also handles a carry-in from a previous ' +
          'column. Chain eight full adders together and you get an 8-bit adder that can add numbers up to 255. ' +
          'This is the core of the ALU (Arithmetic Logic Unit) inside every processor.',
        goDeeper:
          'A **ripple-carry adder** chains N full adders, with each carry-out feeding the next carry-in. It is ' +
          'simple but slow: the carry must "ripple" through all N stages. For a 64-bit add, the worst case requires ' +
          'the carry to propagate through all 64 stages. A **carry-lookahead adder** (CLA) computes carries in ' +
          'parallel using **generate** (G = A · B) and **propagate** (P = A ⊕ B) signals: C_i = G_i + P_i · C_{i-1}. ' +
          'This reduces addition time from O(N) to O(log N) gate delays.',
        advanced:
          'Modern CPUs use a hierarchy of adder architectures. Carry-select adders compute both the carry=0 and carry=1 ' +
          'results simultaneously, then multiplex the correct one when the actual carry arrives. Kogge-Stone and ' +
          'Brent-Kung adders are parallel-prefix adder topologies that optimize for speed and area in VLSI. ' +
          'Multiplication is implemented using arrays of full adders (Wallace tree or Dadda tree multipliers) that ' +
          'reduce partial products in parallel. Division uses iterative algorithms like SRT (Sweeney-Robertson-Tocher).',
        diagram: 'LogicHalfAdderDiagram',
        interactive: {
          type: 'logic-gate-simulator' as const,
          props: {},
        },
      },
      {
        title: 'From Gates to Processors',
        content:
          'A modern smartphone processor contains **billions** of transistors, each acting as a tiny switch. ' +
          'Groups of transistors form gates. Groups of gates form adders, multiplexers, and memory cells. These ' +
          'combine into an ALU (does math), registers (tiny fast storage), and a control unit (directs traffic). ' +
          'Together they make a CPU — the brain of the computer.\n\n' +
          'In 1965, Gordon Moore observed that the number of transistors on a chip doubles roughly every two years ' +
          '— **Moore\'s Law**. The first microprocessor (Intel 4004, 1971) had 2,300 transistors. A modern ' +
          'Apple M3 chip has over 25 billion. Yet every one of those billions of transistors is still just a switch, ' +
          'and every circuit is still built from the same AND, OR, NOT gates you just learned.\n\n' +
          'Everything is binary. Everything is gates. That is the profound simplicity at the heart of all computing.',
        goDeeper:
          'A CPU executes the **fetch-decode-execute cycle** billions of times per second. Fetch: read the next ' +
          'instruction from memory. Decode: figure out what operation it specifies (add? compare? branch?). Execute: ' +
          'perform the operation in the ALU. Modern CPUs use **pipelining** (overlapping stages of different ' +
          'instructions), **superscalar execution** (multiple ALUs working in parallel), and **branch prediction** ' +
          '(guessing which way an if-statement will go to avoid stalling the pipeline). Clock speeds are measured ' +
          'in GHz — a 3 GHz CPU completes 3 billion cycles per second.',
        advanced:
          'Moore\'s Law is approaching physical limits as transistors shrink to atomic scales. Below ~3 nm, ' +
          'quantum tunneling causes electrons to leak through barriers, increasing power consumption and errors. ' +
          'The industry is responding with **3D stacking** (building upward instead of shrinking laterally), ' +
          '**chiplet architectures** (connecting multiple smaller dies), and exploring **new computing paradigms**: ' +
          'quantum computing (using superposition and entanglement for exponential parallelism on specific problems), ' +
          'neuromorphic computing (hardware that mimics neural networks), and optical computing (using photons ' +
          'instead of electrons). Gate-level design today uses Hardware Description Languages (Verilog, VHDL) and ' +
          'synthesis tools that automatically convert high-level descriptions into optimized gate-level netlists, ' +
          'then map them to specific transistor layouts on silicon. A **Karnaugh map** (K-map) is a visual method ' +
          'for simplifying Boolean expressions: group adjacent 1s in a truth table grid to find minimal ' +
          'sum-of-products or product-of-sums forms, reducing gate count and propagation delay.',
        diagram: 'LogicProcessorDiagram',
      },
    ],
  },
];
// cache-bust 1774467249
