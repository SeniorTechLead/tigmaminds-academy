import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'algorithms-data-structures',
  title: 'Algorithms & Data Structures',
  category: 'language',
  tags: ['math'],
  keywords: ['big O', 'binary search', 'sorting', 'hash table', 'graph', 'tree', 'recursion', 'dynamic programming', 'complexity'],
  icon: '💻',
  tagline: 'The recipes and containers of programming — how to organize data and solve problems efficiently.',

  understand: [
    {
      title: 'What Is an Algorithm?',
      beginnerContent:
        '**An algorithm is a step-by-step procedure for solving a problem.** You follow algorithms every day:\n\n' +
        '| Everyday algorithm | Steps |\n' +
        '|-------------------|-------|\n' +
        '| Making tea | Boil water → add tea leaves → wait 3 min → strain → add milk |\n' +
        '| Finding a word in a dictionary | Open to the middle → too early or too late? → jump to the right half → repeat |\n' +
        '| Getting to school | Walk to bus stop → take bus #7 → get off at 3rd stop → walk 2 blocks |\n\n' +
        'In computer science, algorithms are written precisely enough for a machine to follow.\n\n' +
        '**The key insight: different algorithms for the same problem can differ enormously in speed.**\n\n' +
        '| Task: Find "Priya" in 1,000,000 names | Steps needed |\n' +
        '|----------------------------------------|-------------|\n' +
        '| Check every name from the start (linear search) | Up to **1,000,000** |\n' +
        '| Use the dictionary trick on a sorted list (binary search) | At most **20** |\n\n' +
        'That is a 50,000× difference. Choosing the right algorithm is the difference between software that feels instant and software that freezes.',
      intermediateContent:
        '**Big O notation — how we measure algorithm speed:**\n\n' +
        '[diagram:BigOComparisonDiagram]\n\n' +
        '| Notation | Name | Example | n = 1,000,000 |\n' +
        '|----------|------|---------|---------------|\n' +
        '| O(1) | Constant | Array access by index | **Instant** |\n' +
        '| O(log n) | Logarithmic | Binary search | **20 steps** |\n' +
        '| O(n) | Linear | Scanning a list | ~1 ms |\n' +
        '| O(n log n) | Linearithmic | Merge sort | ~20 ms |\n' +
        '| O(n²) | Quadratic | Bubble sort | ~17 minutes |\n' +
        '| O(2ⁿ) | Exponential | Brute force | Heat death of universe |\n\n' +
        '**The sorting payoff:** Binary search on a sorted array of 1 billion elements finds any item in at most **30 comparisons** (log₂ 10⁹ ≈ 30). Sorting costs O(n log n) once, but every subsequent search costs only O(log n) — the investment pays for itself immediately.',
      advancedContent:
        '**The P vs NP problem — the biggest open question in computer science:**\n\n' +
        'Can every problem whose solution can be **verified** quickly also be **solved** quickly?\n\n' +
        '| If P = NP (unlikely) | Consequence |\n' +
        '|---------------------|-------------|\n' +
        '| Travelling salesman | Optimal routes computed instantly |\n' +
        '| Protein folding | Drug design becomes trivial |\n' +
        '| RSA encryption | All current cryptography breaks |\n\n' +
        'Most computer scientists believe P ≠ NP, but no proof exists. This is one of the seven **Millennium Prize Problems** ($1 million reward).\n\n' +
        '**NP-complete problems** — the hardest in NP:\n\n' +
        '- Boolean satisfiability\n' +
        '- Graph coloring\n' +
        '- Subset sum\n\n' +
        'Solving ANY one efficiently would solve ALL of them (they are all reducible to each other).\n\n' +
        '**Practical approaches when you can\'t solve optimally:**\n\n' +
        '| Approach | How it works | Trade-off |\n' +
        '|----------|-------------|----------|\n' +
        '| Heuristics | Rules of thumb that find "good enough" solutions | Fast but no guarantee of optimal |\n' +
        '| Approximation algorithms | Proven to be within X% of optimal | Slower but with guarantees |\n' +
        '| Quantum computing | Speedups for some problems (Shor\'s, Grover\'s) | Doesn\'t solve NP-complete in general |',
    },
    {
      id: 'algo-arrays',
      title: 'Arrays and Lists: Storing Ordered Data',
      beginnerContent:
        '[diagram:DataStructuresDiagram]\n\n' +
        'Before you can run algorithms on data, you need a way to organize that data. The simplest structure is an *array* (called a *list* in Python): an ordered sequence of elements, each identified by its position (called an *index*).\n\n' +
        'The array `[25, 18, 42, 7, 33]` stores five numbers. The first element is at index 0 (not 1 — most programming languages count from zero), so `arr[0]` is 25 and `arr[3]` is 7.\n\n' +
        '**Choosing the right data structure is just as important as choosing the right algorithm.** Here are the five essential structures:\n\n' +
        '| Data structure | What it\'s good at | Real-world analogy |\n' +
        '|----------------|-------------------|--------------------|\n' +
        '| **Array / List** | Fast access by position (index) | Numbered lockers — go straight to locker #7 |\n' +
        '| **Linked List** | Fast insertion / deletion in the middle | A chain of paper clips — easy to add or remove one anywhere |\n' +
        '| **Hash Map (dict)** | Instant lookup by key | A phone book — look up a name, get the number instantly |\n' +
        '| **Stack (LIFO)** | Last-in, first-out order | A stack of plates — you always take the top one |\n' +
        '| **Queue (FIFO)** | First-in, first-out order | A waiting line — first person in line is served first |\n\n' +
        '**Key trade-off:** Arrays are fast at accessing any element by index (same speed whether 10 elements or 10 million). But inserting in the middle is slow — every element after it must shift over. Linked lists solve this, but sacrifice fast random access.',
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
      intermediateContent:
        '**Array vs Linked List — the fundamental trade-off:**\n\n' +
        '| Operation | Array | Linked List |\n' +
        '|-----------|-------|------------|\n' +
        '| Access by index | **O(1)** — jump directly | O(n) — walk from start |\n' +
        '| Insert/delete at end | **O(1)** amortized | **O(1)** with tail pointer |\n' +
        '| Insert/delete in middle | O(n) — must shift elements | **O(1)** if you have a reference |\n' +
        '| Memory layout | Contiguous (cache-friendly) | Scattered (pointer overhead) |\n\n' +
        '**Rule of thumb:** Use arrays when you need fast random access. Use linked lists when you frequently insert/delete in the middle.\n\n' +
        '**Python lists** are dynamic arrays — they automatically double their capacity when full. That is why `append()` is O(1) amortized: most appends are instant, but occasionally the entire array must be copied to a larger block.',
      advancedContent:
        '**How arrays actually work in memory.** An array isn\'t magic — it\'s a single contiguous block of RAM where each slot holds one fixed-size value. `arr[5]` doesn\'t "search" for the 6th element; it computes `base_address + 5 × element_size` and jumps directly there. One multiply, one add, one memory load. That\'s why O(1) access is truly O(1) — constant time regardless of array size.\n\n' +
        '**This reveals a hidden cost:** if `arr[5]` is a string of variable length, the array can\'t hold the string *itself* — it holds a **pointer** to the string. That\'s why Python lists are slower than C arrays for numerical work: every element access is two memory fetches (pointer, then value). NumPy arrays store raw numbers contiguously, which is why they\'re 10-100× faster for arithmetic.\n\n' +
        '**Dynamic arrays — the trick Python uses.** Python lists have a fixed capacity behind the scenes, larger than what\'s visible to you. When you `append()`, Python just writes to the next free slot — O(1). But when the capacity fills up, Python allocates a new array (typically 1.5× larger), copies everything over, frees the old one — O(n) for that one operation.\n\n' +
        'Averaged across many appends, this works out to **O(1) amortized** — the expensive resize costs are spread thin across all the cheap appends. Over a million appends, only about 20 resizes happen (each doubling). Total cost: ~2 million operations, averaging 2 per append.\n\n' +
        '**Linked lists — the opposite trade-off.** Each node stores (value, next_pointer). No contiguous block needed — nodes can live anywhere in memory, connected by pointers. Insertion at a known position is O(1): update two pointers and you\'re done. But accessing `list[500]` means walking through 500 nodes, following 500 pointers — O(n), and *slow* O(n) because each pointer jump is a cache miss.\n\n' +
        'In practice, modern CPUs love arrays (predictable memory access, cache-friendly) and hate linked lists (random memory jumps, cache misses everywhere). For most workloads, even linked-list operations that are theoretically O(1) lose to dynamic array operations that are O(n) — because constant factors dominate. **This is why Python\'s `list` is a dynamic array, not a linked list, and most real code uses arrays.**',
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
      beginnerContent:
        '[diagram:BinarySearchDiagram]\n\n' +
        'Suppose you have a list of 1,000 student names and need to find "Priya."\n\n' +
        '**Linear vs Binary Search — side by side:**\n\n' +
        '| | Linear search | Binary search |\n' +
        '|---|---|---|\n' +
        '| **Strategy** | Start at the beginning, check each name one by one | Open to the middle, eliminate half each step |\n' +
        '| **Requires sorted data?** | No — works on any list | Yes — data must be sorted first |\n' +
        '| **1,000 names** | Up to 1,000 checks | At most **10** checks |\n' +
        '| **1,000,000 names** | Up to 1,000,000 checks | At most **20** checks |\n' +
        '| **Preparation needed** | None | Must sort the data first |\n\n' +
        '**The dictionary analogy:** Binary search is exactly what you do with a physical dictionary. Open to the middle — say it shows "Kavita." Since "Priya" comes after "Kavita" alphabetically, you ignore the entire first half. Repeat on the remaining half. You never start from page 1.\n\n' +
        '**The trade-off:** Linear search needs no preparation and works on any list. Binary search is vastly faster but demands sorted input. If the data changes frequently, keeping it sorted has its own cost. This is a recurring theme in computer science — every optimization has a trade-off.',
      intermediateContent:
        '**Linear vs Binary — the numbers:**\n\n' +
        '| | Linear search | Binary search |\n' +
        '|---|---|---|\n' +
        '| Requirement | Any list | **Sorted** list only |\n' +
        '| Strategy | Check each element from start | Compare with middle, eliminate half |\n' +
        '| Time | O(n) | O(log n) |\n' +
        '| 1,000 elements | Up to 1,000 checks | At most **10** checks |\n' +
        '| 1,000,000 elements | Up to 1,000,000 checks | At most **20** checks |\n' +
        '| 1,000,000,000 elements | Up to 1 billion checks | At most **30** checks |\n\n' +
        '**Binary search step by step:**\n\n' +
        '- Set `lo = 0`, `hi = length - 1`\n' +
        '- While `lo ≤ hi`:\n' +
        '- Find the middle: `mid = (lo + hi) // 2`\n' +
        '- If `arr[mid] == target` → found it!\n' +
        '- If `arr[mid] < target` → target is in the right half → `lo = mid + 1`\n' +
        '- If `arr[mid] > target` → target is in the left half → `hi = mid - 1`\n' +
        '- If `lo > hi` → target is not in the array',
      advancedContent:
        'Binary search applies far beyond sorted arrays — it works in any scenario where you can determine which half contains the answer.\n\n' +
        '**Binary search applications:**\n\n' +
        '| Application | How it uses binary search | Example |\n' +
        '|-------------|--------------------------|--------|\n' +
        '| **Binary search on answer** | Search over a range of possible answers, checking each with a feasibility function | "What is the minimum speed to arrive on time?" — binary search over speeds |\n' +
        '| **Bisection method** | Find where f(x) = 0 by halving the interval where the sign changes | Root finding in numerical analysis |\n' +
        '| **Git bisect** | Binary search through commit history to find the commit that introduced a bug | Debugging regressions in large codebases |\n' +
        '| **Interpolation search** | Estimates the target\'s position proportionally instead of always checking the midpoint | O(log log n) average for uniformly distributed data |',
    },
    {
      title: 'Sorting: Bubble Sort and Merge Sort',
      beginnerContent:
        '[diagram:SortingVisualizerDiagram]\n\n' +
        'Sorting data is one of the most common tasks in computing — search engines rank results, spreadsheets sort columns, and leaderboards order by score.\n\n' +
        '**Four sorting algorithms compared:**\n\n' +
        '| Algorithm | How it works | Speed | When to use it |\n' +
        '|-----------|-------------|-------|----------------|\n' +
        '| **Bubble sort** | Compare adjacent pairs, swap if wrong order, repeat | Very slow (10,000 items = ~100 million comparisons) | Teaching only — never in real code |\n' +
        '| **Merge sort** | Split in half, sort each half recursively, merge back | Fast (10,000 items = ~130,000 comparisons) | When you need guaranteed speed |\n' +
        '| **Quick sort** | Pick a pivot, partition around it, recurse | Fast on average, uses less memory than merge sort | General purpose, most standard libraries |\n' +
        '| **Timsort** | Hybrid of merge sort + insertion sort, optimized for real data | Fast, adapts to partially sorted data | Python\'s built-in `sort()` uses this |\n\n' +
        'The difference is dramatic: merge sort handles 10,000 items nearly **1,000 times faster** than bubble sort. The gap widens as data grows.\n\n' +
        'The key insight is not to memorize every algorithm but to understand that different approaches have wildly different performance characteristics.',
      intermediateContent:
        '**Sorting algorithms compared:**\n\n' +
        '| Algorithm | Time | Space | How it works |\n' +
        '|-----------|------|-------|--------------|\n' +
        '| Bubble sort | O(n²) | O(1) | Swap adjacent pairs, repeat until sorted |\n' +
        '| Merge sort | O(n log n) | O(n) | Split in half, sort each half, merge back |\n' +
        '| Quick sort | O(n log n) avg | O(log n) | Pick pivot, partition around it, recurse |\n' +
        '| Timsort | O(n log n) | O(n) | Python\'s built-in — hybrid of merge + insertion |\n\n' +
        '**Why the difference matters:**\n\n' +
        '| n = 1,000,000 items | Bubble sort (n²) | Merge sort (n log n) |\n' +
        '|---------------------|-------------------|-----------------------|\n' +
        '| Operations | 1,000,000,000,000 | 20,000,000 |\n' +
        '| Time at 1B ops/sec | **~17 minutes** | **~0.02 seconds** |',
      advancedContent:
        '**Why does Python use Timsort?** Real-world data isn\'t random. It\'s often mostly sorted — user clicks arriving in timestamp order, log lines coming in nearly sequentially, database rows that were inserted in some pattern. Tim Peters (a Python core developer) realized in 2002 that optimizing for random data was missing the point. He designed Timsort around a simple observation: **find runs of already-sorted data and merge them.**\n\n' +
        '**How Timsort works:**\n\n' +
        '1. Walk the list finding "runs" — consecutive elements that are already sorted (ascending OR descending, flipping the latter)\n' +
        '2. When a run is too short, extend it using insertion sort up to a `minrun` size (typically 32-64)\n' +
        '3. Push each run onto a stack; merge runs greedily to maintain certain size invariants\n' +
        '4. Use **galloping mode** during merges: when one run is much longer, jump ahead exponentially instead of comparing one-by-one\n\n' +
        'The payoff: on already-sorted data, Timsort is **O(n)** — a single pass to find one giant run, no merges needed. On random data, it degrades gracefully to O(n log n). Real workloads average much closer to O(n) than the worst case.\n\n' +
        '**The fundamental lower bound.** No comparison-based sort can beat O(n log n). The proof: sorting n items means distinguishing between n! possible orderings, and a binary comparison tree of depth d can distinguish 2^d outcomes. So d ≥ log₂(n!) ≈ n log n. Merge sort, quick sort, and Timsort all hit this bound — they\'re optimal for comparison-based sorting.\n\n' +
        '**Beating the bound with non-comparison sorts:** If you know more about your data than just how to compare two elements, you can do better.\n\n' +
        '| Algorithm | Time | Requirement |\n' +
        '|-----------|------|-------------|\n' +
        '| **Counting sort** | O(n + k) | Small range of integers (k = max value) |\n' +
        '| **Radix sort** | O(nk) | Fixed-width keys (integers, strings) |\n' +
        '| **Bucket sort** | O(n) avg | Uniformly distributed input |\n\n' +
        'Sorting 1 billion 32-bit integers? Radix sort does it in O(n × 4) — faster than any comparison sort could possibly manage. This is the trick databases use when indexing millions of integer IDs.',
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
      beginnerContent:
        '[diagram:BigOComparisonDiagram]\n\n' +
        'When computer scientists compare algorithms, they use *Big O notation* to describe how the running time grows as the input size increases. It ignores constants and focuses on the shape of the growth curve.\n\n' +
        '**The most common complexity classes:**\n\n' +
        '- *O(1)* — constant time. No matter how big the input, it takes the same time. Example: accessing an array element by index.\n' +
        '- *O(log n)* — logarithmic time. Doubling the input adds only one extra step. Example: binary search.\n' +
        '- *O(n)* — linear time. Double the input, double the time. Example: linear search.\n' +
        '- *O(n log n)* — the sweet spot for sorting. Example: merge sort.\n' +
        '- *O(n²)* — quadratic time. Double the input, quadruple the time. Example: bubble sort.\n\n' +
        '**What does this mean at scale?** (n = 1,000,000 items, at 1 billion ops/sec)\n\n' +
        '| Complexity | Steps | Wall-clock time |\n' +
        '|------------|-------|----------------|\n' +
        '| O(1) | 1 | **Instant** |\n' +
        '| O(log n) | 20 | **Instant** |\n' +
        '| O(n) | 1,000,000 | **~1 millisecond** |\n' +
        '| O(n log n) | 20,000,000 | **~20 milliseconds** |\n' +
        '| O(n²) | 1,000,000,000,000 | **~16 minutes** |\n' +
        '| O(2ⁿ) | 10^301,029 | **Heat death of universe** |\n\n' +
        'This is why choosing the right algorithm matters — it is not just academic. It determines whether your program finishes in the blink of an eye or never finishes at all.',
      intermediateContent:
        '**How to determine Big O — the cheat sheet:**\n\n' +
        '| Code pattern | Big O | Why |\n' +
        '|-------------|-------|-----|\n' +
        '| Single loop over n items | O(n) | Visit each once |\n' +
        '| Two nested loops, each over n | O(n²) | n × n iterations |\n' +
        '| Loop that halves n each step | O(log n) | Cuts problem in half repeatedly |\n' +
        '| Sorted loop + binary search inside | O(n log n) | Linear × logarithmic |\n' +
        '| Checking all subsets of n items | O(2ⁿ) | Every item is in or out |\n\n' +
        '**Simplification rules:**\n\n' +
        '- Drop constants: O(3n) → O(n)\n' +
        '- Drop lower terms: O(n² + 5n + 7) → O(n²)\n' +
        '- Multiply nested: O(n) inside O(n) → O(n²)\n' +
        '- Add sequential: O(n) then O(n) → O(n), not O(n²)',
      advancedContent:
        '**Space complexity — memory matters too:**\n\n' +
        '| Algorithm | Time | Extra space |\n' +
        '|-----------|------|------------|\n' +
        '| Merge sort | O(n log n) | O(n) — needs a copy |\n' +
        '| Quick sort | O(n log n) avg | O(log n) — stack frames |\n' +
        '| Heap sort | O(n log n) | **O(1)** — in-place |\n\n' +
        '**Amortized analysis:** Python `list.append()` is O(1) amortized — occasional O(n) resizes are spread across n operations.\n\n' +
        '**The Master Theorem** — solves divide-and-conquer recurrences:\n\n' +
        'For T(n) = aT(n/b) + O(n^d):\n\n' +
        '| Condition | Result |\n' +
        '|-----------|--------|\n' +
        '| d < log_b(a) | T = O(n^(log_b(a))) |\n' +
        '| d = log_b(a) | T = O(n^d × log n) |\n' +
        '| d > log_b(a) | T = O(n^d) |\n\n' +
        '**Merge sort example:** a=2, b=2, d=1. log₂(2) = 1 = d → middle case → T = O(n log n) ✓',
    },
    {
      title: 'Information Entropy',
      beginnerContent:
        '[diagram:EntropyDiagram]\n\n' +
        '**How do you measure surprise?** If someone tells you the sun rose this morning, that is not surprising at all. But if someone tells you it snowed in the Sahara, that is extremely surprising. Claude Shannon turned this intuition into a precise formula: *information* is the amount of surprise in a message, measured in *bits*.\n\n' +
        '**Entropy examples — more possibilities = more bits:**\n\n' +
        '| Event | Outcomes | Entropy (bits) | Intuition |\n' +
        '|-------|----------|---------------|----------|\n' +
        '| Fair coin flip | 2 (heads/tails) | **1 bit** | One yes/no question determines the result |\n' +
        '| Fair six-sided die | 6 | **2.58 bits** | More possibilities, more surprise |\n' +
        '| Fair 52-card draw | 52 | **5.7 bits** | Many options, high uncertainty |\n' +
        '| Certain event (sun rises) | 1 | **0 bits** | No surprise at all |\n\n' +
        'Shannon\'s entropy formula: **H = -\\u03A3 p\\u1D62 log\\u2082(p\\u1D62)**, where p\\u1D62 is the probability of each outcome. The negative sign makes the result positive (since log of a fraction is negative).\n\n' +
        '**Key principles:**\n\n' +
        '- When all outcomes are equally likely, entropy is **maximized** — maximum uncertainty\n' +
        '- When one outcome is certain, entropy is **zero** — no surprise\n' +
        '- Entropy measures diversity too — a biodiverse ecosystem has high entropy, a monoculture has low entropy\n' +
        '- In data compression, entropy sets the **theoretical minimum** bits needed to encode a message (Shannon\'s source coding theorem)',
      intermediateContent:
        'For a discrete random variable X with outcomes {x\\u2081, ..., x\\u2099} and probabilities {p\\u2081, ..., p\\u2099}:\n\n' +
        '**Worked examples:**\n\n' +
        '- Fair coin: H = -2(0.5 \\u00D7 log\\u2082 0.5) = **1 bit**\n' +
        '- Unfair coin (p=0.9): H = -(0.9 log\\u2082 0.9 + 0.1 log\\u2082 0.1) \\u2248 **0.47 bits** — less uncertainty because the outcome is mostly predictable\n\n' +
        '**Key information-theoretic measures:**\n\n' +
        '| Measure | Formula | What it measures |\n' +
        '|---------|---------|------------------|\n' +
        '| **Shannon entropy** | H(X) = -\\u03A3 p\\u1D62 log\\u2082(p\\u1D62) | Average surprise (uncertainty) in a distribution |\n' +
        '| **Cross-entropy** | H(p,q) = -\\u03A3 p\\u1D62 log\\u2082(q\\u1D62) | Average bits needed when using distribution q to encode data from distribution p |\n' +
        '| **KL divergence** | D(p||q) = H(p,q) - H(p) | Extra bits wasted by using the wrong distribution |\n\n' +
        'In machine learning, **cross-entropy loss** is the standard objective for classification — it penalizes confident wrong predictions heavily.',
      advancedContent:
        '**Shannon\'s core theorems:**\n\n' +
        '| Theorem | Statement | Key formula |\n' +
        '|---------|-----------|------------|\n' +
        '| **Channel capacity** | Maximum rate of error-free communication | C = max\\u209A\\u208D\\u2093\\u208E I(X;Y), where I(X;Y) = H(X) - H(X|Y) |\n' +
        '| **Binary symmetric channel** | Capacity with error probability \\u03F5 | C = 1 - H(\\u03F5) |\n' +
        '| **Noisy channel coding** | Error-free communication is possible at any rate below capacity | Requires sufficiently long codes |\n\n' +
        '**Extensions beyond discrete distributions:**\n\n' +
        '| Concept | Formula / description |\n' +
        '|---------|---------------------|\n' +
        '| **Differential entropy** | h(X) = -\\u222B f(x) log f(x) dx — extends entropy to continuous distributions |\n' +
        '| **Gaussian maximum entropy** | h(N(\\u03BC,\\u03C3\\u00B2)) = \\u00BD log\\u2082(2\\u03C0e\\u03C3\\u00B2) — the Gaussian maximizes entropy for a given variance |\n' +
        '| **Maximum entropy priors** | In Bayesian inference, encode minimal assumptions about the data |\n' +
        '| **Rate-distortion theory** | Defines the minimum bits needed for lossy compression at a given distortion level |',
    },
    {
      title: 'Priority Scheduling',
      diagram: 'PrioritySchedulerDiagram',
      beginnerContent:
        'Click "Patient arrives" a few times in the diagram above. Watch the queue reorder itself every time — the highest-priority patient always floats to the top. Now hit "Treat next" and see the most urgent case processed first, no matter who arrived when. That\'s a **priority queue** in action.\n\n' +
        'Imagine you are a doctor in an emergency room. A patient with a paper cut and a patient having a heart attack arrive at the same time. You treat the heart attack first because it has higher priority. Computers use the same idea to decide which tasks to run.\n\n' +
        'An operating system juggles dozens of programs at once: your music player, web browser, system updates, antivirus scans. Each task gets a *priority level*. The data structure that makes this efficient is a *priority queue* — it always gives you the highest-priority item in O(log n) time using a *heap*.\n\n' +
        '**Preemptive vs non-preemptive scheduling:**\n\n' +
        '| | Preemptive | Non-preemptive |\n' +
        '|---|---|---|\n' +
        '| **How it works** | High-priority tasks can interrupt running lower-priority tasks mid-execution | Tasks run to completion before the next one starts |\n' +
        '| **Advantage** | Responsive — urgent tasks get CPU immediately | Simpler — no context-switching overhead |\n' +
        '| **Risk** | More complex, context-switching overhead | One slow task blocks everything |\n' +
        '| **Example** | Music keeps playing smoothly while a large file downloads | A print job finishes before the next one starts |\n\n' +
        '> **Apollo 11 in action:** The Apollo Guidance Computer used priority scheduling during the Moon landing. When overloaded, it dropped low-priority display tasks to keep critical navigation running — saving the mission.',
      intermediateContent:
        'Common scheduling algorithms: **Fixed Priority** assigns static priorities (real-time systems, ' +
        'Apollo AGC). **Round Robin** gives each task a fixed time slice (quantum) and rotates — fair but ' +
        'no priority differentiation. **Multilevel Feedback Queue** (used in Linux/Windows) combines both: ' +
        'multiple priority queues, with tasks moving between levels based on behavior. CPU-bound tasks sink ' +
        'to lower priority; I/O-bound tasks rise. **Priority inversion** occurs when a high-priority task ' +
        'waits for a lock held by a low-priority task — the Mars Pathfinder bug in 1997 caused system resets ' +
        'until engineers uploaded a fix enabling **priority inheritance** (temporarily boosting the low-' +
        'priority task to release the lock faster).',
      advancedContent:
        '**Real-time scheduling algorithms compared:**\n\n' +
        '| Algorithm | Priority type | How it works | Schedulability bound |\n' +
        '|-----------|--------------|-------------|---------------------|\n' +
        '| **RMS** (Rate-Monotonic) | Fixed | Shorter period = higher priority | U = \\u03A3(C\\u1D62/T\\u1D62) \\u2264 n(2^(1/n) - 1), approaches ln(2) \\u2248 0.693 as n\\u2192\\u221E |\n' +
        '| **EDF** (Earliest Deadline First) | Dynamic | Task with nearest deadline runs first | U \\u2264 1.0 — optimal among dynamic-priority algorithms |\n' +
        '| **CFS** (Linux Completely Fair Scheduler) | Dynamic (fairness-based) | Red-black tree keyed by virtual runtime; smallest vruntime runs next | O(log n) scheduling decisions |\n\n' +
        '**Key properties:**\n\n' +
        '- RMS is optimal among fixed-priority preemptive algorithms for independent periodic tasks\n' +
        '- EDF achieves higher utilization than RMS (up to 100% vs ~69%)\n' +
        '- Real-time systems use **WCET** (Worst Case Execution Time) analysis to guarantee deadlines',
    },
    {
      title: 'Technology Diffusion Models',
      beginnerContent:
        '[diagram:TechDiffusionDiagram]\n\n' +
        'Why does every new technology follow the same pattern? First a handful of enthusiasts adopt it, then adoption accelerates rapidly, and finally it levels off. This traces an **S-shaped curve** — slow start, fast middle, slow finish — visible in smartphones, electricity, the printing press, and social media.\n\n' +
        '**Rogers\' five adopter categories:**\n\n' +
        '| Category | % of population | Description |\n' +
        '|----------|----------------|-------------|\n' +
        '| **Innovators** | 2.5% | Risk-takers who try anything new |\n' +
        '| **Early adopters** | 13.5% | Opinion leaders who see the potential early |\n' +
        '| **Early majority** | 34% | Pragmatists who wait for proof before adopting |\n' +
        '| **Late majority** | 34% | Skeptics who adopt only when it becomes the norm |\n' +
        '| **Laggards** | 16% | The last holdouts, adopt only when unavoidable |\n\n' +
        'The critical moment is crossing the **chasm** between early adopters and the early majority. Many technologies die here because enthusiast appeal does not translate to mainstream value.\n\n' +
        '**Network effects** accelerate the middle of the S-curve: each new telephone user makes the network more valuable for everyone, creating a positive feedback loop. The *adoption threshold* is the penetration rate at which growth becomes self-sustaining — below it, the technology might fade away.',
      intermediateContent:
        'The **Bass diffusion model** separates two forces: innovation (external influence like advertising, ' +
        'coefficient p) and imitation (internal influence like word-of-mouth, coefficient q). The adoption ' +
        'rate is f(t)/[1-F(t)] = p + qF(t), where F(t) is cumulative adoption. Typical values: p \\u2248 0.03, ' +
        'q \\u2248 0.38 for consumer electronics. When q > p (common), the curve is S-shaped with a peak at ' +
        't* = ln(q/p)/(p+q). **Metcalfe\'s Law** states network value grows as n\\u00B2 (every node can connect to ' +
        'every other), though empirical studies suggest n log n is more realistic. The **technology S-curve** ' +
        'also applies to performance: a technology improves slowly at first, then rapidly, then hits physical ' +
        'limits — at which point a disruptive technology begins its own S-curve.',
      advancedContent:
        'The Bass model\'s closed-form solution: F(t) = [1 - e^(-(p+q)t)] / [1 + (q/p)e^(-(p+q)t)], which is ' +
        'a generalized logistic function. Extensions: multi-generation models (Norton-Bass) handle successive ' +
        'product generations; spatial diffusion models add geographic spread via reaction-diffusion PDEs. ' +
        'Agent-based models simulate heterogeneous agents with varying thresholds on network graphs — ' +
        'revealing that network topology (scale-free vs small-world vs lattice) dramatically affects diffusion ' +
        'speed and final adoption. Granovetter\'s threshold model: agent i adopts when fraction of adopters ' +
        'exceeds personal threshold \\u03B8\\u1D62. The distribution of \\u03B8 values determines whether cascades occur.',
    },
    {
      title: 'Graph Theory and Network Analysis',
      beginnerContent:
        '[diagram:GraphTraversalDiagram]\n\n' +
        'Think of a social network: each person is a dot, and each friendship is a line connecting two dots. In mathematics, those dots are called **nodes** (or vertices) and the lines are **edges**. Together they form a **graph**.\n\n' +
        '**Graphs are everywhere:**\n\n' +
        '| Domain | Nodes | Edges |\n' +
        '|--------|-------|-------|\n' +
        '| Social network | People | Friendships |\n' +
        '| Road map | Cities | Roads |\n' +
        '| World Wide Web | Web pages | Hyperlinks |\n' +
        '| Brain | Neurons | Synapses |\n' +
        '| Chemistry | Atoms | Chemical bonds |\n\n' +
        'Any time you have things and relationships between those things, you have a graph.\n\n' +
        'The most famous graph problem is the **shortest path**: what is the quickest route between two nodes? Google Maps solves this billions of times daily using Dijkstra\'s algorithm, which explores outward from the starting node, always expanding the closest unvisited node first.\n\n' +
        '**Centrality — measuring node importance:**\n\n' +
        '- **Degree centrality** — a person with many friends is highly connected\n' +
        '- **Betweenness centrality** — a person who connects two otherwise separate groups is a critical bridge (removing them would disconnect the network)\n' +
        '- **PageRank** — Google\'s algorithm: a page is important if important pages link to it. This recursive definition made Google\'s search engine revolutionary.',
      intermediateContent:
        'A graph G = (V, E) has |V| vertices and |E| edges.\n\n' +
        '**Graph storage:**\n\n' +
        '- **Adjacency matrix** — O(V\\u00B2) space, O(1) edge lookup. Best for dense graphs.\n' +
        '- **Adjacency list** — O(V + E) space. Preferred for sparse graphs (most real-world networks).\n\n' +
        '**Graph algorithms compared:**\n\n' +
        '| Algorithm | Time complexity | Use case |\n' +
        '|-----------|---------------|----------|\n' +
        '| **BFS** (Breadth-First Search) | O(V + E) | Shortest path in unweighted graphs |\n' +
        '| **Dijkstra\'s** | O((V + E) log V) | Shortest path with non-negative weights (Google Maps) |\n' +
        '| **Bellman-Ford** | O(VE) | Shortest path with negative weights |\n' +
        '| **Floyd-Warshall** | O(V\\u00B3) | All-pairs shortest paths |\n\n' +
        '**Centrality formulas:**\n\n' +
        '- **Degree centrality:** C_D(v) = deg(v) / (|V| - 1)\n' +
        '- **Betweenness:** C_B(v) = \\u03A3 \\u03C3_st(v) / \\u03C3_st, summed over all pairs s,t (where \\u03C3_st is the number of shortest paths and \\u03C3_st(v) is those passing through v)',
      advancedContent:
        'Spectral graph theory analyses the eigenvalues of the graph Laplacian L = D - A (degree matrix ' +
        'minus adjacency matrix). The second-smallest eigenvalue λ₂ (algebraic connectivity) measures ' +
        'how well-connected the graph is — the Cheeger inequality relates it to the minimum cut. ' +
        'Community detection algorithms (Louvain, spectral clustering) partition graphs into densely ' +
        'connected subgroups. Random graph models — Erdős-Rényi G(n,p), Barabási-Albert preferential ' +
        'attachment, Watts-Strogatz small-world — generate networks with specific statistical properties. ' +
        'NP-hard graph problems (clique, coloring, Hamiltonian path) are approximated using heuristics ' +
        'or parameterized algorithms.',
    },
  ],

  build: [
    {
      id: 'algo-search',
      title: 'Linear and Binary Search',
      diagram: 'BinarySearchDiagram',
      beginnerContent:
        'Toggle between Linear and Binary search in the diagram above. Type a number to search for. Watch how linear crawls through element by element, while binary makes massive jumps and finds the answer in a handful of steps. Same array, dramatically different paths.\n\n' +
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
      beginnerContent:
        'Watch the bars above swap their way into order. Each comparison is shown; each swap animates. This is **bubble sort**: compare adjacent pairs, swap if wrong, repeat. Simple to understand — and excruciatingly slow for anything real.\n\n' +
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
      beginnerContent:
        'Watch the two pointers in the diagram above converge from opposite ends. They move independently based on what they see. This single idea turns many O(n²) brute-force problems into elegant O(n) solutions.\n\n' +
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
      beginnerContent:
        'Watch the window slide across the array above. Notice what happens at each step: ONE element exits the left, ONE new element enters the right. You don\'t recompute everything — you just subtract the outgoing and add the incoming. That\'s the trick that turns many O(n²) problems into O(n).\n\n' +
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
      beginnerContent:
        'Toggle BFS vs DFS in the diagram above. Watch them explore the same graph completely differently. BFS spreads outward in rings — it finds things nearby before things far away. DFS dives deep into one path, backtracks, then tries another. Same graph, same nodes, radically different paths.\n\n' +
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
      beginnerContent:
        'Watch the recursion tree above unfold. `fib(5)` calls `fib(4)` and `fib(3)`. Each of those calls two more. Nine total calls to compute fib(5). Try fib(6): **15 calls.** Try fib(10): **177 calls.** Notice the explosion — the same subproblems (like fib(2)) are computed over and over. This is the trap of naive recursion, and the reason memoization exists.\n\n' +
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
    {
      id: 'error-correction',
      title: 'Error Detection and Correction — Finding and Fixing Mistakes in Data',
      beginnerContent:
        'When you send a text message, the data travels as electrical signals, radio waves, or light pulses. Along the way, noise can flip a 0 to a 1 or vice versa. How does the receiver know if the message arrived correctly?\n\n' +
        'The simplest method is a **parity bit**. Count the number of 1s in your data. If it\'s odd, add a 1 at the end to make it even. If it\'s even, add a 0. The receiver counts the 1s and checks parity. If it\'s odd, an error occurred. Example: data = 1011001 (four 1s, even) → send 10110010. If it arrives as 10110110 (a bit flipped), the receiver counts five 1s (odd) and knows something went wrong.\n\n' +
        'Parity can **detect** a single error but cannot **correct** it — you know something is wrong, but not which bit flipped. To correct errors, you need more redundancy.\n\n' +
        '**Check yourself:** If two bits flip simultaneously, does a single parity bit detect the error? (No — two flips cancel out, keeping parity even. The error goes undetected.)',
      intermediateContent:
        'The **Hamming code** can both detect and correct single-bit errors. The idea: add multiple parity bits, each covering a different subset of data bits. When an error occurs, the pattern of parity failures (the **syndrome**) pinpoints the exact position of the bad bit.\n\n' +
        'Hamming(7,4) encodes 4 data bits into 7 bits (3 parity bits added). The overhead is 3/7 = 43%, but you gain the ability to correct any single-bit error automatically. QR codes, RAM modules (ECC memory), and satellite communication all use variants of this principle.\n\n' +
        'The **ikat weaving** of Pochampally uses a similar idea: the weaver plans the pattern as a binary grid (dye/no-dye) and the resist-tie placement must be error-free because a single misplaced tie corrupts the pattern irreversibly. Traditional weavers developed mental "checksums" — counting ties per row — that parallel parity checking.',
      advancedContent:
        '**Error correction codes compared:**\n\n' +
        '| Code | How it works | Where it\'s used |\n' +
        '|------|-------------|----------------|\n' +
        '| **Reed-Solomon** | Operates on blocks of symbols (not individual bits). RS(255,223) encodes 223 data bytes into 255 bytes, correcting up to 16 symbol errors per block | CDs, DVDs, QR codes, deep-space communication |\n' +
        '| **LDPC** (Low-Density Parity-Check) | Sparse parity-check matrix enables efficient iterative decoding. Approaches within 0.1 dB of Shannon\'s limit | 5G, Wi-Fi 6, satellite links |\n' +
        '| **Turbo codes** | Two convolutional encoders with an interleaver; iterative decoding exchanges soft information | 3G/4G mobile, deep-space probes |\n' +
        '| **Polar codes** | Channel polarization creates "perfect" and "useless" sub-channels; data sent on reliable ones only | 5G control channels |\n\n' +
        '**The math behind Reed-Solomon:** Uses **Galois field arithmetic** (GF(2\\u2078)) where addition is XOR and multiplication uses polynomial arithmetic modulo an irreducible polynomial.\n\n' +
        '**The Shannon limit** (channel capacity C = B\\u00B7log\\u2082(1 + SNR)) sets the theoretical maximum data rate for a given noise level. Modern codes (LDPC, Turbo, Polar) approach this limit within fractions of a decibel.',
    },
  ],
};
