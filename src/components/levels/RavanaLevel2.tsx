import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import RavanaCPUGPUDiagram from '../diagrams/RavanaCPUGPUDiagram';
import RavanaParallelDiagram from '../diagrams/RavanaParallelDiagram';

export default function RavanaLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'CPU architecture — fetch, decode, execute',
      concept: `Every instruction your CPU runs follows the same three-step cycle:

1. **Fetch** — read the next instruction from memory
2. **Decode** — figure out what the instruction means (add? multiply? compare?)
3. **Execute** — do the operation and store the result

A modern CPU can run through this cycle **billions** of times per second (measured in GHz — gigahertz). A 3 GHz processor runs 3 billion cycles per second.

But here is the key constraint: each core runs **one** instruction cycle at a time. A 4-core CPU can run 4 instructions simultaneously, but each core is still serial. This is the fundamental tension in computing: cores are fast but few.

The code below simulates the fetch-decode-execute cycle for a set of simple instructions.`,
      analogy: 'A CPU core is like a very fast chef reading a recipe. Step 1: read the next line (fetch). Step 2: understand what it means — "chop onions" (decode). Step 3: do it (execute). The chef can only do one step at a time but does it incredibly fast. Four cores = four chefs reading four recipes simultaneously.',
      storyConnection: 'A single one of Ravana\'s heads was like a CPU core — brilliant, focused, and serial. The power came from having ten of them. Similarly, multi-core CPUs gain power not from making one core faster (we hit physical limits) but from adding more cores.',
      checkQuestion: 'A CPU runs at 4 GHz. How many fetch-decode-execute cycles does it complete in 1 millisecond?',
      checkAnswer: '4 GHz = 4 × 10^9 cycles/second. In 1 millisecond (0.001 seconds): 4 × 10^9 × 0.001 = 4,000,000 cycles. Four million cycles in the blink of an eye. Yet a single neuron firing takes about 1 ms — your brain is slow per-operation but massively parallel.',
      codeIntro: 'Simulate the CPU fetch-decode-execute cycle.',
      code: `import numpy as np

# === CPU Fetch-Decode-Execute Simulator ===

class SimpleCPU:
    def __init__(self, clock_ghz):
        self.clock = clock_ghz * 1e9  # cycles per second
        self.registers = {"A": 0, "B": 0, "C": 0}
        self.cycle_count = 0

    def fetch(self, instruction):
        self.cycle_count += 1
        return instruction

    def decode(self, instruction):
        self.cycle_count += 1
        parts = instruction.split()
        return parts[0], parts[1:]

    def execute(self, op, args):
        self.cycle_count += 1
        if op == "LOAD":
            self.registers[args[0]] = int(args[1])
        elif op == "ADD":
            self.registers[args[0]] += self.registers[args[1]]
        elif op == "MUL":
            self.registers[args[0]] *= self.registers[args[1]]
        elif op == "PRINT":
            print(f"    Register {args[0]} = {self.registers[args[0]]}")

# Program: compute 5 * 3 + 7
program = [
    "LOAD A 5",
    "LOAD B 3",
    "MUL A B",      # A = 5 * 3 = 15
    "LOAD C 7",
    "ADD A C",      # A = 15 + 7 = 22
    "PRINT A",
]

cpu = SimpleCPU(clock_ghz=3.0)
print("=== CPU Execution (3 GHz, 1 core) ===")
for instr in program:
    raw = cpu.fetch(instr)
    op, args = cpu.decode(raw)
    cpu.execute(op, args)
    print(f"  [{cpu.cycle_count:>2} cycles] {instr}")

time_ns = cpu.cycle_count / cpu.clock * 1e9
print(f"\\nTotal cycles: {cpu.cycle_count}")
print(f"Time at 3 GHz: {time_ns:.2f} nanoseconds")
print(f"That's {time_ns/1e6:.6f} milliseconds")`,
      challenge: 'Add a SUB (subtract) instruction and write a program that computes (10 + 5) * (8 - 3). How many cycles does it take? What if you had 2 cores that could compute (10+5) and (8-3) in parallel?',
      successHint: 'Every computation your computer performs follows this fetch-decode-execute pattern. Understanding it helps you see why some algorithms are faster than others — fewer instructions = fewer cycles = less time.',
    },
    {
      title: 'Threads — running multiple tasks on one CPU',
      concept: `A **thread** is an independent sequence of instructions that a CPU core can execute. A single program can create multiple threads, and the operating system rapidly switches between them — giving the illusion that they run simultaneously.

This is called **concurrency**: tasks make progress by sharing time on the same core, like Ravana rapidly switching attention between heads. It is NOT true parallelism (that requires multiple cores), but it is still useful when tasks spend time waiting — for disk access, network responses, or user input.

Python's **threading** module lets you create threads. The key pattern:
1. Define a function for each task
2. Create a Thread object for each function
3. Start all threads
4. Wait for all threads to finish (join)

The code below creates multiple threads and shows how they interleave.`,
      analogy: 'Threads are like multiple browser tabs. Your computer does not actually run them all at the same time — it rapidly switches between them, giving each a tiny slice of CPU time. You do not notice the switching because it happens thousands of times per second. But if you open 100 tabs, everything slows down because the switching overhead accumulates.',
      storyConnection: 'Ravana\'s ten heads sharing one body is a perfect metaphor for threads sharing one CPU. Each head (thread) wants to act, but only one body (core) can move at a time. The operating system (Ravana\'s central consciousness) decides which head gets control of the body at each moment.',
      checkQuestion: 'If you have 4 threads but only 1 CPU core, do the tasks run in parallel?',
      checkAnswer: 'No — they run concurrently, not in parallel. The single core rapidly switches between the 4 threads, giving each a time slice. Total time is the same as serial (plus switch overhead), but the tasks APPEAR to make progress simultaneously. True parallelism requires multiple cores.',
      codeIntro: 'Create and run multiple threads, showing interleaved execution.',
      code: `import time

# === Threading: Ravana's Heads as Threads ===

def ravana_head(name, task, duration):
    """Simulate one of Ravana's heads working on a task."""
    print(f"  [{name}] Starting: {task}")
    # Simulate work (blocking sleep)
    steps = 3
    for step in range(steps):
        time.sleep(duration / steps)
        print(f"  [{name}] Step {step+1}/{steps}")
    print(f"  [{name}] Done: {task}")

heads = [
    ("Vedas Head", "Reciting scripture", 0.6),
    ("War Head", "Planning battle", 0.4),
    ("Music Head", "Composing raga", 0.5),
    ("Science Head", "Calculating orbits", 0.7),
]

# --- Serial execution ---
print("=== SERIAL (one head at a time) ===")
start = time.time()
for name, task, dur in heads:
    ravana_head(name, task, dur)
serial_time = time.time() - start
print(f"Serial total: {serial_time:.2f}s\\n")

# --- Threaded execution ---
import threading

print("=== THREADED (all heads at once) ===")
start = time.time()
threads = []
for name, task, dur in heads:
    t = threading.Thread(target=ravana_head, args=(name, task, dur))
    threads.append(t)
    t.start()

for t in threads:
    t.join()  # Wait for all to finish
threaded_time = time.time() - start

print(f"\\nSerial: {serial_time:.2f}s")
print(f"Threaded: {threaded_time:.2f}s")
print(f"Speedup: {serial_time/threaded_time:.1f}x")`,
      challenge: 'Add 6 more heads to make Ravana\'s full complement of 10. Give each a different task and duration. Does the speedup scale linearly? What is the speedup limited by?',
      successHint: 'Threads let multiple tasks share a CPU. In Python, the GIL (Global Interpreter Lock) limits true parallel execution for CPU-bound work, but threads are excellent for I/O-bound tasks (waiting for files, network, user input). For CPU parallelism, you need multiprocessing.',
    },
    {
      title: 'Amdahl\'s Law — the limits of parallel speedup',
      concept: `Here is a fundamental truth about parallel computing: **not everything can be parallelised**. Some parts of any task must be done in sequence — setting up, combining results, making decisions that depend on previous results.

**Amdahl's Law** quantifies this limit:

**Speedup = 1 / (S + P/N)**

Where:
- S = fraction of work that is serial (cannot be parallelised)
- P = fraction that is parallel (P = 1 - S)
- N = number of processors

If 10% of your work is serial (S = 0.1), then even with infinite processors, your maximum speedup is 1/0.1 = **10x**. The serial portion becomes the bottleneck.

This was Ravana's flaw: his ten heads could process in parallel, but his one heart was the serial bottleneck. When desire overrode reason, the serial portion dominated.`,
      analogy: 'Imagine making a cake. Measuring ingredients, mixing, and decorating can be parallelised (multiple helpers). But baking in the oven is serial — you cannot speed it up by adding more ovens (it is one cake). If baking takes 80% of the time, even 100 helpers for the other steps barely speeds up the total.',
      storyConnection: 'Ravana\'s serial bottleneck was his heart — the single point where all ten heads\' outputs had to merge into one decision. When his heart was consumed by pride, it did not matter that ten heads counselled wisdom. The serial component (the heart) limited the entire system.',
      checkQuestion: 'If 20% of a task is serial and 80% is parallel, what is the maximum speedup with (a) 4 processors and (b) 1000 processors?',
      checkAnswer: '(a) Speedup = 1 / (0.2 + 0.8/4) = 1 / (0.2 + 0.2) = 1/0.4 = 2.5x. (b) Speedup = 1 / (0.2 + 0.8/1000) = 1 / (0.2008) = 4.98x. Even 1000 processors barely beats 5x because the 20% serial fraction is the hard limit.',
      codeIntro: 'Visualise Amdahl\'s Law for different serial fractions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Amdahl's Law Visualisation ===

def amdahl_speedup(serial_fraction, num_processors):
    """Calculate speedup given serial fraction and processor count."""
    return 1 / (serial_fraction + (1 - serial_fraction) / num_processors)

processors = np.arange(1, 65)
serial_fractions = [0.0, 0.05, 0.10, 0.25, 0.50]
colors = ['#22c55e', '#60a5fa', '#a78bfa', '#f59e0b', '#ef4444']

plt.figure(figsize=(10, 6))
for s, color in zip(serial_fractions, colors):
    speedups = [amdahl_speedup(s, p) for p in processors]
    max_speedup = 1 / s if s > 0 else float('inf')
    label = f'{s*100:.0f}% serial (max {max_speedup:.0f}x)' if s > 0 else '0% serial (ideal)'
    plt.plot(processors, speedups, color=color, linewidth=2.5, label=label)

plt.xlabel('Number of Processors (Heads)', fontsize=12)
plt.ylabel('Speedup', fontsize=12)
plt.title("Amdahl's Law: The Serial Bottleneck", fontsize=14)
plt.legend(fontsize=10, loc='upper left')
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

# Ravana's case: 10 heads
print("=== Ravana's 10 Heads ===")
for s in serial_fractions[1:]:
    sp = amdahl_speedup(s, 10)
    print(f"  {s*100:.0f}% serial -> {sp:.1f}x speedup with 10 heads")
    print(f"    (theoretical max: {1/s:.1f}x)")`,
      challenge: 'Find the serial fraction at which adding more than 10 processors gives less than 1% additional speedup. Hint: compare speedup at N=10 vs N=100 for different serial fractions.',
      successHint: 'Amdahl\'s Law is the most important equation in parallel computing. It tells you: before buying more processors, reduce the serial fraction. Optimise the bottleneck first. This applies to computer systems, to teams, and — the story tells us — to ancient demon kings.',
    },
    {
      title: 'Map-reduce — parallel algorithm design',
      concept: `How do you actually design an algorithm that runs in parallel? One of the most powerful patterns is **MapReduce**:

1. **Map** — apply the same function to every element independently (parallel)
2. **Reduce** — combine all the results into a single answer (serial)

Example: sum a million numbers. **Map**: split the numbers into 10 groups and compute the sum of each group (parallel — 10 processors, each handling 100,000 numbers). **Reduce**: add the 10 partial sums together (serial — one addition chain).

Google built their entire search engine infrastructure around MapReduce. It scales to millions of computers because the Map step is embarrassingly parallel — each computer processes its chunk independently.

The code below implements MapReduce for a word frequency counter.`,
      analogy: 'Counting votes in an election. Map: each counting station counts its own ballots independently (parallel). Reduce: a central office adds up all the station totals (serial). The more stations you have, the faster the map phase. The reduce phase is always a simple sum.',
      storyConnection: 'Ravana\'s ten heads could each read a different battlefield report (map) and then report to his central consciousness (reduce) for a unified command. The map phase was parallel and fast. The reduce phase was serial and limited by one heart\'s ability to process all ten reports.',
      checkQuestion: 'You have a list of 1 million words and 100 processors. Using MapReduce, each processor counts word frequencies in its 10,000-word chunk (map). Then what?',
      checkAnswer: 'The reduce step merges 100 frequency dictionaries into one. For each word, it sums the counts across all dictionaries. This reduce step is O(total unique words × 100 processors) — still much faster than having one processor scan all 1 million words sequentially.',
      codeIntro: 'Implement a MapReduce word frequency counter.',
      code: `import numpy as np
import time

# === MapReduce: Parallel Word Counter ===

# Simulate a text corpus
words = ["rama", "ravana", "sita", "lanka", "war", "bow",
         "arrow", "bridge", "monkey", "ocean", "demon", "hero"]
np.random.seed(42)
corpus = np.random.choice(words, size=10000)

# --- MAP phase (parallelisable) ---
def map_chunk(chunk):
    """Count word frequencies in a chunk."""
    freq = {}
    for word in chunk:
        freq[word] = freq.get(word, 0) + 1
    return freq

# Split corpus into chunks (one per "head")
num_heads = 10
chunks = np.array_split(corpus, num_heads)

print(f"=== MAP Phase ({num_heads} heads) ===")
start = time.time()
partial_results = []
for i, chunk in enumerate(chunks):
    result = map_chunk(chunk)
    partial_results.append(result)
    print(f"  Head {i+1}: {len(chunk)} words -> {len(result)} unique")
map_time = time.time() - start

# --- REDUCE phase (serial) ---
def reduce_results(partials):
    """Merge all partial frequency counts."""
    total = {}
    for partial in partials:
        for word, count in partial.items():
            total[word] = total.get(word, 0) + count
    return total

print(f"\\n=== REDUCE Phase (1 heart) ===")
start = time.time()
final_counts = reduce_results(partial_results)
reduce_time = time.time() - start

print("Final word frequencies:")
for word, count in sorted(final_counts.items(), key=lambda x: -x[1]):
    bar = "#" * (count // 20)
    print(f"  {word:>8}: {count:>4} {bar}")

print(f"\\nMap time: {map_time*1000:.1f}ms")
print(f"Reduce time: {reduce_time*1000:.1f}ms")
print(f"Total: {(map_time+reduce_time)*1000:.1f}ms")`,
      challenge: 'Modify the code to find the maximum word length in each chunk (map) and then find the global maximum (reduce). Also try: compute the average word length using map (sum + count per chunk) and reduce (total sum / total count).',
      successHint: 'MapReduce separates the parallel part (map) from the serial part (reduce). Any problem that can be decomposed this way scales beautifully across processors. Google processes petabytes of data daily using this exact pattern.',
    },
    {
      title: 'Race conditions — when parallel goes wrong',
      concept: `Parallel processing is powerful but dangerous. When multiple threads access **shared data** simultaneously, you get **race conditions** — bugs that depend on timing and are nearly impossible to reproduce.

Example: two threads both try to increment a counter from 10 to 11. Thread A reads 10. Thread B also reads 10 (before A writes). Thread A writes 11. Thread B writes 11 — overwriting A's result. The counter should be 12 but is 11. One increment was lost.

The fix is a **lock** (also called a mutex): a mechanism that lets only one thread access the shared data at a time. Thread A acquires the lock, reads, increments, writes, releases the lock. Thread B must wait until the lock is free.

Locks prevent race conditions but reintroduce serialisation — the locked section runs one thread at a time. This is the fundamental tension of parallel computing: sharing data safely requires coordination that slows things down.`,
      analogy: 'Imagine two people trying to edit the same Google Doc at the exact same moment. If both type a word at the same position, one overwrites the other. Google Docs solves this with a lock-like mechanism — it queues conflicting edits and applies them in order. The result is correct but slightly delayed.',
      storyConnection: 'Ravana\'s ten heads shared one body — the ultimate shared resource. If two heads tried to move the same arm in different directions simultaneously, the result would be chaos (a race condition). Ravana needed internal coordination — a lock — to ensure only one head controlled each limb at a time.',
      checkQuestion: 'Two threads both execute "balance = balance + 100" on a shared bank account (starting balance: 500). Without a lock, what could go wrong?',
      checkAnswer: 'Thread A reads 500. Thread B reads 500 (before A writes). Thread A writes 600. Thread B writes 600 (overwriting A\'s result). The balance should be 700 (two deposits of 100) but ends up at 600. One deposit was lost. This is why bank systems use locks (transactions) to prevent concurrent modification.',
      codeIntro: 'Demonstrate a race condition and fix it with a lock.',
      code: `import threading
import time

# === Race Condition Demo ===

# Shared counter (Ravana's shared heart)
counter = 0
NUM_INCREMENTS = 100000

# --- WITHOUT lock (race condition!) ---
def increment_unsafe():
    global counter
    for _ in range(NUM_INCREMENTS):
        counter += 1  # NOT atomic: read, add, write

counter = 0
threads = [threading.Thread(target=increment_unsafe) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

expected = 4 * NUM_INCREMENTS
print(f"=== WITHOUT Lock ===")
print(f"Expected: {expected:,}")
print(f"Actual:   {counter:,}")
print(f"Lost:     {expected - counter:,} increments!")
print(f"Error:    {(expected-counter)/expected*100:.1f}%")

# --- WITH lock (thread-safe) ---
counter = 0
lock = threading.Lock()

def increment_safe():
    global counter
    for _ in range(NUM_INCREMENTS):
        with lock:  # Only one thread at a time
            counter += 1

threads = [threading.Thread(target=increment_safe) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

print(f"\\n=== WITH Lock ===")
print(f"Expected: {expected:,}")
print(f"Actual:   {counter:,}")
print(f"Lost:     {expected - counter:,} increments")
print(f"Correct:  {'Yes!' if counter == expected else 'No'}")`,
      challenge: 'Create a "bank account" class with deposit and withdraw methods. Without locks, run 2 threads depositing 1000 times and 2 threads withdrawing 1000 times (same amounts). Show that the final balance is wrong. Add locks and verify it becomes correct.',
      successHint: 'Race conditions are among the hardest bugs in computing — they depend on timing, so they may work 99 times and fail on the 100th. Locks solve the problem but reduce parallelism. The art of parallel programming is minimising lock contention while maximising correctness.',
    },
    {
      title: 'Parallel speedup benchmark — charting real performance',
      concept: `Let's build a real benchmark that measures parallel speedup on a computationally intensive task: computing prime numbers.

Finding primes is a **CPU-bound** task — it requires pure computation with no waiting. We will split a range of numbers across multiple workers, have each worker check its portion for primes, and measure total time as we increase the number of workers.

This gives us a real speedup curve that we can compare against Amdahl's Law predictions. The gap between theoretical and actual speedup reveals the **overhead** of creating threads, splitting data, and combining results.`,
      analogy: 'Imagine ten librarians searching for a specific book. One librarian searching the whole library takes an hour. Ten librarians, each searching one floor, should take 6 minutes. But add 2 minutes for the meeting where they divide up floors and compare notes, and actual time is 8 minutes. The benchmark measures this real-world gap.',
      storyConnection: 'Ravana was the ultimate benchmark: ten heads, each a master scholar. But how much faster was he actually than a single-headed thinker? The overhead of internal coordination between heads meant he was not truly 10x faster. Our benchmark measures this same effect in code.',
      checkQuestion: 'If checking primes from 1 to 1,000,000 takes 10 seconds on 1 core, and splitting across 4 cores takes 3.2 seconds, what is the actual speedup and how does it compare to ideal?',
      checkAnswer: 'Actual speedup: 10 / 3.2 = 3.125x. Ideal speedup: 4x. Efficiency: 3.125/4 = 78%. The missing 22% is overhead: splitting the range, creating workers, combining results. This efficiency decreases as you add more cores (Amdahl\'s Law).',
      codeIntro: 'Benchmark parallel prime counting and plot speedup vs worker count.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import time

# === Parallel Prime Benchmark ===

def is_prime(n):
    if n < 2: return False
    if n < 4: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0: return False
        i += 6
    return True

def count_primes_range(start, end):
    return sum(1 for n in range(start, end) if is_prime(n))

N = 50000  # Check primes up to this number

# Simulate different worker counts
worker_counts = [1, 2, 4, 5, 10, 20]
times = []

for w in worker_counts:
    chunk_size = N // w
    start_time = time.time()
    total_primes = 0
    for i in range(w):
        lo = i * chunk_size + 1
        hi = (i + 1) * chunk_size + 1 if i < w - 1 else N + 1
        total_primes += count_primes_range(lo, hi)
    elapsed = time.time() - start_time
    times.append(elapsed)

serial_time = times[0]
speedups = [serial_time / t for t in times]

plt.figure(figsize=(10, 5))
plt.plot(worker_counts, speedups, 'o-', color='#a78bfa',
         linewidth=2.5, markersize=10, label='Measured')
plt.plot(worker_counts, worker_counts, '--', color='#94a3b8',
         linewidth=1.5, label='Ideal (linear)')

# Amdahl prediction (estimate ~5% serial overhead)
amdahl = [1 / (0.05 + 0.95/w) for w in worker_counts]
plt.plot(worker_counts, amdahl, ':', color='#f59e0b',
         linewidth=2, label="Amdahl's (5% serial)")

plt.xlabel('Workers (Heads)', fontsize=12)
plt.ylabel('Speedup (x)', fontsize=12)
plt.title(f'Prime Counting Benchmark (N={N:,})', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print(f"Primes found: {total_primes}")
print(f"\\n{'Workers':>8} {'Time':>8} {'Speedup':>8} {'Efficiency':>10}")
for w, t, s in zip(worker_counts, times, speedups):
    eff = s / w * 100
    print(f"{w:>8} {t:>7.3f}s {s:>7.1f}x {eff:>9.0f}%")`,
      challenge: 'Increase N to 200000 and rerun. Does the speedup improve (larger problem = better parallel efficiency)? This is Gustafson\'s Law — larger problems benefit more from parallelism because the serial overhead becomes proportionally smaller.',
      successHint: 'Benchmarking is how you prove parallel speedup works in practice, not just theory. You measured real times, computed real speedups, and compared against Amdahl\'s prediction. This is the methodology used by every HPC (high-performance computing) researcher.',
    },
  ];

  const diagrams = [RavanaCPUGPUDiagram, RavanaParallelDiagram, null, null, null, null];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">CPU architecture, threading, and parallel algorithms</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for parallel computing simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={diagrams[i] ? createElement(diagrams[i]!) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
