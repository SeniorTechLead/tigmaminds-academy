import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import RavanaParallelDiagram from '../diagrams/RavanaParallelDiagram';
import RavanaCPUGPUDiagram from '../diagrams/RavanaCPUGPUDiagram';

export default function RavanaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Task scheduler — assigning jobs to Ravana\'s heads',
      concept: `In this capstone level, you will build a **multi-threaded task scheduler** — a program that intelligently assigns jobs to multiple workers (Ravana's heads) and tracks their progress.

A task scheduler must solve three problems:
1. **Assignment**: which worker gets which task? (round-robin, shortest-queue, or priority-based)
2. **Balancing**: keep all workers equally busy (no idle heads while others are overloaded)
3. **Completion**: track progress and collect results as tasks finish

The simplest strategy is **round-robin**: assign task 1 to head 1, task 2 to head 2, ..., task 10 to head 10, task 11 back to head 1, and so on. It is fair but ignores task size — a head assigned a long task falls behind while others idle.

A better strategy is **shortest-queue**: always assign the next task to the head with the least total work remaining. This naturally balances the load.`,
      analogy: 'A restaurant with 10 waiters (Ravana\'s heads). Round-robin: assign each new table to the next waiter in sequence. Simple but unfair if some tables order 10 courses and others order 1. Shortest-queue: assign each new table to the waiter with the fewest current tables. Fairer and faster overall.',
      storyConnection: 'Ravana\'s challenge was not just having ten heads — it was coordinating them. In battle, he needed to allocate heads to tasks: one head monitoring the western flank, two heads managing magic defenses, one head directing the aerial forces. The task scheduler is the central intelligence that made Ravana\'s parallel architecture effective.',
      checkQuestion: 'You have 3 heads and 6 tasks with durations [5, 2, 8, 1, 4, 3]. Using shortest-queue assignment, which head gets which tasks?',
      checkAnswer: 'Assign task 1 (5) to head 1. Head loads: [5, 0, 0]. Assign task 2 (2) to head 2 (shortest). Loads: [5, 2, 0]. Assign task 3 (8) to head 3. Loads: [5, 2, 8]. Assign task 4 (1) to head 2. Loads: [5, 3, 8]. Assign task 5 (4) to head 2. Loads: [5, 7, 8]. Assign task 6 (3) to head 1. Loads: [8, 7, 8]. Max time: 8. Much better than round-robin which might give [5+1, 2+4, 8+3] = [6, 6, 11], taking 11 units.',
      codeIntro: 'Build a task scheduler with round-robin and shortest-queue strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Ravana's Task Scheduler ===
np.random.seed(42)

class TaskScheduler:
    def __init__(self, num_heads, strategy='shortest_queue'):
        self.num_heads = num_heads
        self.strategy = strategy
        self.queues = [[] for _ in range(num_heads)]
        self.loads = [0.0] * num_heads
        self.rr_index = 0

    def assign(self, task_name, duration):
        if self.strategy == 'round_robin':
            head = self.rr_index % self.num_heads
            self.rr_index += 1
        else:  # shortest_queue
            head = self.loads.index(min(self.loads))

        self.queues[head].append((task_name, duration))
        self.loads[head] += duration
        return head

    def total_time(self):
        return max(self.loads)

    def display(self):
        for i in range(self.num_heads):
            tasks = ', '.join(f'{t[0]}({t[1]:.1f}s)' for t in self.queues[i])
            print(f"  Head {i+1} [{self.loads[i]:5.1f}s]: {tasks}")

# Generate random tasks
tasks = [(f"T{i+1}", np.random.uniform(0.5, 5.0)) for i in range(15)]

print("=== Tasks ===")
for name, dur in tasks:
    print(f"  {name}: {dur:.1f}s")

for strategy in ['round_robin', 'shortest_queue']:
    sched = TaskScheduler(num_heads=5, strategy=strategy)
    for name, dur in tasks:
        sched.assign(name, dur)
    print(f"\\n=== {strategy.upper()} (5 heads) ===")
    sched.display()
    print(f"  Total time: {sched.total_time():.1f}s")

# Compare strategies across head counts
heads_range = range(1, 11)
rr_times, sq_times = [], []
for h in heads_range:
    rr = TaskScheduler(h, 'round_robin')
    sq = TaskScheduler(h, 'shortest_queue')
    for name, dur in tasks:
        rr.assign(name, dur)
        sq.assign(name, dur)
    rr_times.append(rr.total_time())
    sq_times.append(sq.total_time())

plt.figure(figsize=(10, 5))
plt.plot(list(heads_range), rr_times, 'o-', color='#ef4444',
         linewidth=2, label='Round Robin')
plt.plot(list(heads_range), sq_times, 's-', color='#22c55e',
         linewidth=2, label='Shortest Queue')
plt.xlabel("Number of Heads", fontsize=12)
plt.ylabel("Total Time (s)", fontsize=12)
plt.title("Scheduling Strategy Comparison", fontsize=14)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout(); plt.show()`,
      challenge: 'Add a third strategy: "priority" — assign the longest remaining task to the head with the shortest queue first. Does this outperform shortest-queue? Why or why not?',
      successHint: 'Shortest-queue consistently beats round-robin because it adapts to task sizes. This is the foundation of real-world load balancers — from web servers to GPU schedulers.',
    },
    {
      title: 'Thread pool — managing a fixed number of workers',
      concept: `Creating a new thread for every task is wasteful — thread creation itself takes time and memory. A **thread pool** creates a fixed number of workers upfront and reuses them as tasks arrive.

The pattern:
1. Create N worker threads at startup
2. Tasks go into a shared **queue**
3. Each worker pulls the next task from the queue when it finishes its current task
4. When all tasks are done, shut down the pool

Python's **concurrent.futures.ThreadPoolExecutor** implements this pattern. You submit tasks and get back **Future** objects — promises that the result will be available later.

This is exactly how Ravana's architecture worked: ten permanent heads (thread pool), tasks arriving continuously (queue), each head grabbing the next task when free.`,
      analogy: 'A taxi stand with 10 taxis (thread pool). Customers arrive and join a queue. The first available taxi takes the next customer. No new taxis are created or destroyed — the same 10 cycle continuously. This is more efficient than hailing a new taxi from scratch for every passenger.',
      storyConnection: 'Ravana did not grow a new head for each task — he had exactly ten, always. Each head was a permanent worker in his thread pool. When the warfare head finished planning one battle, it immediately started planning the next. No creation overhead, no shutdown cost — just continuous, efficient parallel processing.',
      checkQuestion: 'You have a thread pool of 3 workers and 9 tasks, each taking 2 seconds. What is the total time?',
      checkAnswer: 'Each worker handles 3 tasks serially: 3 × 2 = 6 seconds. All three workers run in parallel, so total time is 6 seconds (not 18). Speedup: 18/6 = 3x — perfectly linear because all tasks are equal duration.',
      codeIntro: 'Build a thread pool executor from scratch.',
      code: `import time
import threading
from collections import deque

# === Ravana's Thread Pool ===

class RavanaThreadPool:
    def __init__(self, num_heads):
        self.num_heads = num_heads
        self.task_queue = deque()
        self.lock = threading.Lock()
        self.results = {}
        self.active = True
        self.heads = []

        for i in range(num_heads):
            t = threading.Thread(target=self._worker, args=(i+1,),
                               daemon=True)
            self.heads.append(t)
            t.start()

    def _worker(self, head_id):
        while self.active:
            task = None
            with self.lock:
                if self.task_queue:
                    task = self.task_queue.popleft()
            if task:
                name, func, args = task
                print(f"  Head {head_id}: processing {name}")
                result = func(*args)
                with self.lock:
                    self.results[name] = result
                print(f"  Head {head_id}: completed {name} -> {result}")
            else:
                time.sleep(0.01)  # Wait for tasks

    def submit(self, name, func, *args):
        with self.lock:
            self.task_queue.append((name, func, args))

    def shutdown(self):
        while True:
            with self.lock:
                if not self.task_queue and len(self.results) >= self._total:
                    break
            time.sleep(0.05)
        self.active = False

# Define computational tasks
def compute_sum(n):
    """CPU-bound: sum numbers 1 to n."""
    return sum(range(1, n+1))

def compute_primes(limit):
    """Count primes up to limit."""
    count = 0
    for n in range(2, limit):
        if all(n % d != 0 for d in range(2, int(n**0.5)+1)):
            count += 1
    return count

# Submit tasks
tasks = [
    ("Sum-1M", compute_sum, 1000000),
    ("Sum-2M", compute_sum, 2000000),
    ("Primes-1K", compute_primes, 1000),
    ("Primes-2K", compute_primes, 2000),
    ("Sum-500K", compute_sum, 500000),
    ("Primes-500", compute_primes, 500),
]

print(f"=== Ravana's Thread Pool (5 heads, {len(tasks)} tasks) ===")
pool = RavanaThreadPool(num_heads=5)
pool._total = len(tasks)

start = time.time()
for name, func, arg in tasks:
    pool.submit(name, func, arg)

pool.shutdown()
elapsed = time.time() - start

print(f"\\n=== Results ===")
for name, result in sorted(pool.results.items()):
    print(f"  {name}: {result:,}")
print(f"\\nTotal time: {elapsed:.2f}s with 5 heads")`,
      challenge: 'Run the same tasks with 1 head, 3 heads, and 10 heads. Plot the total time vs number of heads. At what point do additional heads stop helping? (Hint: with 6 tasks, you cannot benefit from more than 6 heads.)',
      successHint: 'A thread pool is the production-grade way to manage parallel workers. It avoids the overhead of creating and destroying threads. Every web server, every database, every GPU driver uses thread pools internally.',
    },
    {
      title: 'Producer-consumer pattern — feeding Ravana\'s heads',
      concept: `In real systems, tasks do not all arrive at once — they stream in over time. The **producer-consumer pattern** handles this:

- **Producer**: generates tasks and puts them in a shared queue
- **Consumer**: takes tasks from the queue and processes them
- **Queue**: a thread-safe buffer between producer and consumer

The queue decouples production from consumption. If the producer is faster than the consumer, tasks accumulate in the queue. If the consumer is faster, it waits for new tasks. The queue acts as a shock absorber.

This pattern is everywhere: web servers (requests arrive, worker threads process them), message queues (Kafka, RabbitMQ), and even your browser (events arrive from the network, the render thread processes them).`,
      analogy: 'A sushi conveyor belt. The chef (producer) places dishes on the belt (queue). Customers (consumers) take dishes as they come by. The belt decouples the chef from the customers — the chef does not need to wait for each customer to eat before making the next dish.',
      storyConnection: 'Ravana\'s battlefield scouts (producers) continuously reported enemy movements. The reports went into a shared intelligence queue. Each of Ravana\'s heads (consumers) pulled the next report relevant to its domain. The queue ensured no report was lost even when all heads were busy.',
      checkQuestion: 'If the producer generates 10 tasks per second but consumers process only 8 per second, what happens over time?',
      checkAnswer: 'The queue grows by 2 tasks per second. After 100 seconds, 200 tasks are waiting. Eventually the system runs out of memory. This is called "backpressure" — the producer must slow down or tasks must be dropped. Real systems implement rate limiting or queue size caps.',
      codeIntro: 'Implement a producer-consumer system with a bounded queue.',
      code: `import threading
import time
from collections import deque

# === Producer-Consumer: Ravana's Intelligence Network ===

class BoundedQueue:
    def __init__(self, max_size):
        self.queue = deque()
        self.max_size = max_size
        self.lock = threading.Lock()
        self.not_empty = threading.Event()
        self.produced = 0
        self.consumed = 0

    def put(self, item):
        while True:
            with self.lock:
                if len(self.queue) < self.max_size:
                    self.queue.append(item)
                    self.produced += 1
                    self.not_empty.set()
                    return True
            time.sleep(0.01)  # Queue full, wait

    def get(self):
        while True:
            with self.lock:
                if self.queue:
                    item = self.queue.popleft()
                    self.consumed += 1
                    if not self.queue:
                        self.not_empty.clear()
                    return item
            time.sleep(0.01)  # Queue empty, wait

# Producer: scout reports from the battlefield
def scout_producer(queue, num_reports, stop_event):
    reports = ["Enemy approaching west", "Reinforcements from north",
               "Rama spotted at river", "Hanuman airborne",
               "Bridge construction update", "Arrow supply low"]
    for i in range(num_reports):
        report = f"[R{i+1}] {reports[i % len(reports)]}"
        queue.put(report)
        print(f"  Scout: sent '{report}'")
        time.sleep(0.05)
    stop_event.set()

# Consumer: Ravana's heads processing reports
def head_consumer(queue, head_id, stop_event, results):
    processed = 0
    while not stop_event.is_set() or queue.queue:
        try:
            with queue.lock:
                if not queue.queue:
                    continue
            report = queue.get()
            # Process the report
            time.sleep(0.08)  # Analysis time
            results.append((head_id, report))
            processed += 1
            print(f"  Head {head_id}: processed '{report}'")
        except:
            break
    return processed

# Run the system
queue = BoundedQueue(max_size=5)
stop_event = threading.Event()
results = []

print("=== Ravana's Intelligence Network ===")
print(f"Queue capacity: {queue.max_size}")
print(f"Scouts: 1 | Heads: 3\\n")

producer = threading.Thread(target=scout_producer,
                           args=(queue, 12, stop_event))
consumers = [threading.Thread(target=head_consumer,
             args=(queue, i+1, stop_event, results))
             for i in range(3)]

start = time.time()
producer.start()
for c in consumers: c.start()
producer.join()
time.sleep(0.5)  # Let consumers finish
for c in consumers: c.join(timeout=1)
elapsed = time.time() - start

print(f"\\n=== Summary ===")
print(f"Reports produced: {queue.produced}")
print(f"Reports consumed: {queue.consumed}")
print(f"Time: {elapsed:.2f}s")
head_counts = {}
for h, r in results:
    head_counts[h] = head_counts.get(h, 0) + 1
for h in sorted(head_counts):
    print(f"  Head {h}: processed {head_counts[h]} reports")`,
      challenge: 'Add a second producer (two scouts sending reports simultaneously). Increase num_reports to 20 each. Does the system handle the increased load? What happens if you reduce the queue max_size to 2?',
      successHint: 'Producer-consumer is one of the most important patterns in concurrent programming. It decouples the rate of production from the rate of consumption, handles bursty traffic, and keeps all workers busy. Every messaging system (Kafka, RabbitMQ, SQS) is a producer-consumer queue.',
    },
    {
      title: 'Parallel matrix multiplication — the GPU\'s core operation',
      concept: `Matrix multiplication is the single most important operation in computing. Neural networks, graphics rendering, physics simulations, and search engines all reduce to multiplying matrices.

To multiply matrices A (m×n) and B (n×p), each element of the result C[i][j] is the dot product of row i of A and column j of B. Crucially, **every element of C is independent** — C[0][0] does not depend on C[1][2]. This means all m×p output elements can be computed in parallel.

This is why GPUs dominate AI: a neural network forward pass is just a sequence of matrix multiplications, and GPUs can compute thousands of dot products simultaneously.

The code below compares serial vs parallel matrix multiplication and visualises the computation.`,
      analogy: 'Imagine a multiplication table. Each cell is the product of its row header and column header. You could fill it in one cell at a time (serial), or give each cell to a different person to compute (parallel). Since no cell depends on any other cell, they can all work simultaneously. A 10×10 table with 100 workers finishes in the time of one multiplication.',
      storyConnection: 'If Ravana needed to compute a 10×10 matrix, each of his ten heads could compute one row simultaneously — a 10x speedup over doing it serially. This is literally what a GPU does: each core computes a small part of the matrix, and thousands of cores finish the whole matrix almost instantly.',
      checkQuestion: 'A matrix multiplication of a 1000×500 matrix by a 500×800 matrix produces how many output elements? If a GPU has 5000 cores, how many elements does each core compute?',
      checkAnswer: 'Output: 1000 × 800 = 800,000 elements. Each core: 800,000 / 5000 = 160 elements. Each element requires 500 multiply-and-add operations (the dot product length). Total operations: 800,000 × 500 = 400 million — done in milliseconds on a GPU.',
      codeIntro: 'Implement and visualise matrix multiplication, then benchmark serial vs parallel.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import time

# === Matrix Multiplication: The GPU's Core Operation ===

def matmul_serial(A, B):
    """Serial matrix multiplication — one element at a time."""
    m, n = A.shape
    n2, p = B.shape
    C = np.zeros((m, p))
    for i in range(m):
        for j in range(p):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C

def matmul_numpy(A, B):
    """NumPy matrix multiplication (uses optimised BLAS)."""
    return A @ B

# Benchmark different sizes
sizes = [10, 25, 50, 100]
serial_times, numpy_times = [], []

for size in sizes:
    A = np.random.randn(size, size)
    B = np.random.randn(size, size)

    start = time.time()
    C_serial = matmul_serial(A, B)
    serial_times.append(time.time() - start)

    start = time.time()
    C_numpy = matmul_numpy(A, B)
    numpy_times.append(time.time() - start)

    # Verify correctness
    error = np.max(np.abs(C_serial - C_numpy))
    print(f"Size {size}x{size}: serial={serial_times[-1]:.4f}s, "
          f"numpy={numpy_times[-1]:.6f}s, "
          f"speedup={serial_times[-1]/max(numpy_times[-1],1e-8):.0f}x, "
          f"error={error:.2e}")

# Visualise
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

# Bar chart comparison
x_pos = np.arange(len(sizes))
axes[0].bar(x_pos - 0.15, serial_times, 0.3, color='#ef4444', label='Serial (3 loops)')
axes[0].bar(x_pos + 0.15, numpy_times, 0.3, color='#22c55e', label='NumPy (optimised)')
axes[0].set_xticks(x_pos)
axes[0].set_xticklabels([f'{s}x{s}' for s in sizes])
axes[0].set_xlabel('Matrix Size'); axes[0].set_ylabel('Time (s)')
axes[0].set_title('Serial vs Optimised Matrix Multiply')
axes[0].legend(); axes[0].set_yscale('log')
axes[0].grid(alpha=0.3, axis='y')

# Speedup curve
speedups = [s/max(n,1e-8) for s, n in zip(serial_times, numpy_times)]
axes[1].plot(sizes, speedups, 'o-', color='#a78bfa', linewidth=2.5,
             markersize=10)
axes[1].set_xlabel('Matrix Size'); axes[1].set_ylabel('Speedup (x)')
axes[1].set_title('Speedup: Optimised vs Serial')
axes[1].grid(alpha=0.3)

plt.tight_layout(); plt.show()

# Compute FLOPS
ops = [2 * s**3 for s in sizes]  # multiply-add = 2 ops
print(f"\\n{'Size':>6} {'Operations':>12} {'Serial MFLOPS':>14} {'NumPy MFLOPS':>13}")
for s, o, st, nt in zip(sizes, ops, serial_times, numpy_times):
    print(f"{s:>4}x{s:<2} {o:>12,} {o/st/1e6:>13.1f} {o/max(nt,1e-8)/1e6:>12.1f}")`,
      challenge: 'Add a "blocked" matrix multiply that divides the matrix into 4 quadrants and computes each quadrant separately. This is how GPUs actually work — they split the matrix into tiles that fit in fast local memory. Does blocking improve the serial implementation?',
      successHint: 'Matrix multiplication is O(n^3) — doubling the size increases work 8x. But it is perfectly parallelisable, which is why GPUs (with thousands of cores) outperform CPUs by orders of magnitude. NumPy\'s BLAS backend uses parallelism and memory optimization internally.',
    },
    {
      title: 'Pipeline parallelism — assembly line processing',
      concept: `So far we have seen **data parallelism** (same operation on different data). Now meet **pipeline parallelism** (different operations on the same data, in sequence).

In a pipeline, each stage processes one item and immediately passes it to the next stage while starting on a new item. Like an assembly line: station 1 bolts the frame, station 2 paints it, station 3 inspects it — all simultaneously, each working on a different car.

Pipeline throughput = 1 item per stage-time (after the pipeline fills). Latency for a single item = sum of all stage times. The pipeline does not reduce latency for ONE item, but it dramatically increases **throughput** (items per second).

CPU instruction pipelines use this: while executing instruction 1, the CPU is already decoding instruction 2 and fetching instruction 3.`,
      analogy: 'A laundry system with washer, dryer, and folder. Serial: wash load 1, dry load 1, fold load 1, THEN wash load 2... Pipeline: while load 1 dries, wash load 2. While load 1 folds and load 2 dries, wash load 3. After the first load, a new folded load comes out every wash-cycle, not every three cycles.',
      storyConnection: 'Ravana\'s heads could work as a pipeline: the scout head gathered intelligence, passed it to the strategy head for analysis, which passed it to the warfare head for planning, which passed it to the command head for execution. Each head worked simultaneously on a different report at a different stage. Maximum throughput from parallel specialisation.',
      checkQuestion: 'A 4-stage pipeline processes 100 items. Each stage takes 1 second. What is the total time?',
      checkAnswer: 'First item takes 4 seconds (4 stages × 1 second). Then one item completes every 1 second. Remaining 99 items: 99 seconds. Total: 4 + 99 = 103 seconds. Serial (no pipeline): 100 × 4 = 400 seconds. Pipeline speedup: 400/103 = 3.88x (approaches 4x for many items).',
      codeIntro: 'Build a pipeline processor and compare to serial execution.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import time

# === Pipeline Parallelism: Ravana's Assembly Line ===

class PipelineStage:
    def __init__(self, name, process_time):
        self.name = name
        self.process_time = process_time

    def process(self, item):
        time.sleep(self.process_time)
        return f"{item} -> [{self.name}]"

# Define pipeline stages (Ravana's head specialisations)
stages = [
    PipelineStage("Scout", 0.05),
    PipelineStage("Analyse", 0.08),
    PipelineStage("Plan", 0.06),
    PipelineStage("Execute", 0.04),
]

# --- Serial processing ---
items = [f"Report_{i+1}" for i in range(15)]

print("=== SERIAL Processing ===")
start = time.time()
for item in items:
    result = item
    for stage in stages:
        result = stage.process(result)
serial_time = time.time() - start
print(f"  {len(items)} items in {serial_time:.2f}s")

# --- Simulated Pipeline ---
# In a true pipeline, stages overlap. We simulate the timeline.
stage_times = [s.process_time for s in stages]
total_stage = sum(stage_times)
max_stage = max(stage_times)

# Pipeline time = first item latency + (n-1) * bottleneck stage
pipeline_time_est = total_stage + (len(items) - 1) * max_stage

print(f"\\n=== PIPELINE Processing (simulated) ===")
print(f"  Stage times: {[s.process_time for s in stages]}")
print(f"  Bottleneck: {stages[stage_times.index(max_stage)].name} "
      f"({max_stage}s)")
print(f"  First item latency: {total_stage:.2f}s")
print(f"  Throughput: 1 item every {max_stage}s")
print(f"  Total for {len(items)} items: {pipeline_time_est:.2f}s")
print(f"  Speedup: {serial_time/pipeline_time_est:.1f}x")

# Visualise pipeline timeline
fig, ax = plt.subplots(figsize=(14, 5))
colors = ['#60a5fa', '#a78bfa', '#f59e0b', '#22c55e']

for item_idx in range(min(8, len(items))):
    t_start = item_idx * max_stage  # staggered start
    for stage_idx, stage in enumerate(stages):
        start_t = t_start + sum(stage_times[:stage_idx])
        ax.barh(item_idx, stage.process_time, left=start_t, height=0.6,
                color=colors[stage_idx], alpha=0.8,
                edgecolor='white', linewidth=0.5)

ax.set_yticks(range(min(8, len(items))))
ax.set_yticklabels([f'Item {i+1}' for i in range(min(8, len(items)))])
ax.set_xlabel('Time (s)', fontsize=12)
ax.set_title('Pipeline Timeline — Stages Overlap', fontsize=14)
ax.invert_yaxis()
ax.grid(axis='x', alpha=0.3)

# Legend
for i, stage in enumerate(stages):
    ax.barh([], 0, color=colors[i], label=stage.name)
ax.legend(loc='lower right', fontsize=10)

plt.tight_layout()
plt.show()

print(f"\\nSerial: {serial_time:.2f}s")
print(f"Pipeline: ~{pipeline_time_est:.2f}s")
print(f"Speedup: {serial_time/pipeline_time_est:.1f}x "
      f"(max theoretical: {len(stages)}x)")`,
      challenge: 'What happens if the "Analyse" stage takes 0.2s (much longer than others)? The pipeline is only as fast as its slowest stage. Calculate the new throughput and speedup. How would you fix the bottleneck? (Hint: duplicate the slow stage.)',
      successHint: 'Pipeline parallelism is different from data parallelism: it speeds up throughput, not latency. CPUs use 15-20 stage pipelines to keep every transistor busy. Combined with data parallelism (multiple pipelines), you get the full power of modern processors.',
    },
    {
      title: 'Capstone — Ravana\'s Ten-Head Task Orchestrator',
      concept: `Time to bring everything together. You will build a complete **task orchestrator** that combines:

1. **Thread pool** (fixed number of heads/workers)
2. **Shortest-queue scheduling** (smart task assignment)
3. **Progress tracking** (real-time monitoring)
4. **Performance dashboard** (visualise parallel speedup)

This is a simplified version of what runs inside every cloud platform (AWS, Google Cloud, Azure) — a scheduler that assigns incoming requests to available workers, monitors their progress, and reports performance metrics.

Your orchestrator will accept tasks of different types and durations, assign them to Ravana's heads using the shortest-queue strategy, track completion, and generate a final performance report with visualisations.`,
      analogy: 'An air traffic control system. Aircraft (tasks) arrive continuously. Runways (heads/workers) are limited. The controller (orchestrator) assigns each aircraft to the shortest queue, monitors progress on radar (dashboard), and reports throughput metrics (aircraft per hour). Your orchestrator is air traffic control for computation.',
      storyConnection: 'This is Ravana at his peak: ten heads, perfectly coordinated, each pulling tasks from a shared queue, all monitored by a central intelligence. The story teaches that the architecture was brilliant — the flaw was in the objective function (what Ravana optimised for). Your orchestrator has the same architecture but can be pointed at any goal.',
      checkQuestion: 'Your orchestrator has 5 heads and receives 50 tasks over 10 seconds. Each task takes 1-3 seconds. What is the theoretical best throughput?',
      checkAnswer: 'With 5 heads, each working continuously for 10 seconds, total work capacity is 50 head-seconds. Average task is 2 seconds, so theoretical max throughput is 50/2 = 25 tasks in 10 seconds. With variable task durations and scheduling overhead, actual throughput will be slightly less.',
      codeIntro: 'Build the complete Ravana orchestrator with dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import time
import threading
from collections import deque

# === RAVANA'S TEN-HEAD ORCHESTRATOR ===
np.random.seed(42)

class RavanaOrchestrator:
    def __init__(self, num_heads):
        self.num_heads = num_heads
        self.task_queue = deque()
        self.lock = threading.Lock()
        self.head_loads = [0.0] * num_heads
        self.head_tasks = [0] * num_heads
        self.completed = []
        self.start_time = None

    def submit_batch(self, tasks):
        """Submit a list of (name, duration) tuples."""
        # Shortest-queue assignment
        for name, duration in tasks:
            head = self.head_loads.index(min(self.head_loads))
            self.head_loads[head] += duration
            self.head_tasks[head] += 1
            self.completed.append({
                'name': name, 'head': head,
                'duration': duration,
                'start': self.head_loads[head] - duration
            })

    def report(self):
        total_work = sum(self.head_loads)
        makespan = max(self.head_loads)
        serial_time = total_work
        efficiency = total_work / (makespan * self.num_heads) * 100

        print(f"\\n{'='*50}")
        print(f"  RAVANA ORCHESTRATOR — PERFORMANCE REPORT")
        print(f"{'='*50}")
        print(f"  Heads:     {self.num_heads}")
        print(f"  Tasks:     {sum(self.head_tasks)}")
        print(f"  Makespan:  {makespan:.2f}s (parallel)")
        print(f"  Serial:    {serial_time:.2f}s")
        print(f"  Speedup:   {serial_time/makespan:.2f}x")
        print(f"  Efficiency: {efficiency:.0f}%")
        print(f"\\n  Per-head breakdown:")
        for i in range(self.num_heads):
            bar = "#" * int(self.head_loads[i] * 3)
            print(f"    Head {i+1}: {self.head_tasks[i]:>2} tasks, "
                  f"{self.head_loads[i]:>5.1f}s {bar}")
        return makespan, serial_time

    def visualise(self):
        fig, axes = plt.subplots(2, 2, figsize=(13, 9))

        # 1. Gantt chart (task timeline per head)
        colors = plt.cm.Set3(np.linspace(0, 1, 12))
        for task in self.completed:
            axes[0,0].barh(task['head'], task['duration'],
                          left=task['start'], height=0.7,
                          color=colors[task['head'] % 12],
                          edgecolor='white', linewidth=0.5)
        axes[0,0].set_yticks(range(self.num_heads))
        axes[0,0].set_yticklabels([f'Head {i+1}' for i in range(self.num_heads)])
        axes[0,0].set_xlabel('Time (s)')
        axes[0,0].set_title('Task Gantt Chart')
        axes[0,0].invert_yaxis()
        axes[0,0].grid(axis='x', alpha=0.3)

        # 2. Load distribution
        axes[0,1].bar(range(1, self.num_heads+1), self.head_loads,
                     color=[colors[i % 12] for i in range(self.num_heads)])
        axes[0,1].set_xlabel('Head')
        axes[0,1].set_ylabel('Total Load (s)')
        axes[0,1].set_title('Load Balance')
        axes[0,1].grid(axis='y', alpha=0.3)

        # 3. Speedup vs head count
        total_work = sum(self.head_loads)
        head_range = range(1, 21)
        speedups = []
        for h in head_range:
            orch = RavanaOrchestrator(h)
            tasks = [(t['name'], t['duration']) for t in self.completed]
            orch.submit_batch(tasks)
            ms = max(orch.head_loads)
            speedups.append(total_work / ms)
        axes[1,0].plot(list(head_range), speedups, 'o-', color='#a78bfa',
                      linewidth=2, markersize=5, label='Actual')
        axes[1,0].plot(list(head_range), list(head_range), '--',
                      color='#94a3b8', label='Ideal')
        axes[1,0].set_xlabel('Heads')
        axes[1,0].set_ylabel('Speedup (x)')
        axes[1,0].set_title('Speedup Curve')
        axes[1,0].legend()
        axes[1,0].grid(alpha=0.3)

        # 4. Task duration distribution
        durations = [t['duration'] for t in self.completed]
        axes[1,1].hist(durations, bins=15, color='#60a5fa',
                      edgecolor='white')
        axes[1,1].axvline(np.mean(durations), color='red', linestyle='--',
                         label=f'Mean: {np.mean(durations):.1f}s')
        axes[1,1].set_xlabel('Duration (s)')
        axes[1,1].set_ylabel('Count')
        axes[1,1].set_title('Task Duration Distribution')
        axes[1,1].legend()
        axes[1,1].grid(axis='y', alpha=0.3)

        plt.suptitle("Ravana's Orchestrator — Dashboard",
                     fontsize=16, fontweight='bold', y=1.01)
        plt.tight_layout()
        plt.show()

# === Run the Orchestrator ===
print("Generating tasks...")
tasks = [(f"Task_{i+1}", np.random.exponential(1.5) + 0.3)
         for i in range(30)]

orch = RavanaOrchestrator(num_heads=10)
orch.submit_batch(tasks)
orch.report()
orch.visualise()

print("\\nOrchestrator complete!")
print("You built a parallel task scheduler with:")
print("  - Shortest-queue load balancing")
print("  - Gantt chart visualisation")
print("  - Speedup analysis")
print("  - Performance dashboard")`,
      challenge: 'Add task priorities (high=1, medium=2, low=3). High-priority tasks should be assigned first, regardless of arrival order. Modify submit_batch to sort by priority before assignment. How does priority scheduling affect load balance compared to FIFO?',
      successHint: 'You built a complete task orchestrator — the same architecture that powers cloud computing, GPU schedulers, and operating systems. You combined threading, scheduling algorithms, load balancing, and data visualisation into one cohesive system. Ravana would be proud.',
    },
  ];

  const diagrams = [RavanaParallelDiagram, null, null, RavanaCPUGPUDiagram, null, null];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Master
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: multi-threaded task scheduler</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises build production-grade parallel systems. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={diagrams[i] ? createElement(diagrams[i]!) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
