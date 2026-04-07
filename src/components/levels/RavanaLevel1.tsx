import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import RavanaNeuronDiagram from '../diagrams/RavanaNeuronDiagram';
import RavanaParallelDiagram from '../diagrams/RavanaParallelDiagram';
import ActivityReactionTimeDiagram from '../diagrams/ActivityReactionTimeDiagram';
import RavanaCPUGPUDiagram from '../diagrams/RavanaCPUGPUDiagram';
import RavanaNeuralNetDiagram from '../diagrams/RavanaNeuralNetDiagram';

export default function RavanaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Reaction time — measuring your brain\'s speed',
      concept: `How fast is your brain? Not in thoughts-per-minute, but in raw signal speed — the time between *seeing* something and *responding* to it.

When you catch a ball, a chain of events fires: light hits your retina, neurons in your visual cortex process the image, your motor cortex sends a "grab" command to your hand muscles, and your fingers close. The total time from "see" to "grab" is your **reaction time** — typically around **200 milliseconds** (0.2 seconds).

In the ruler-drop test, the distance the ruler falls tells you exactly how long your brain took. The formula comes straight from physics: **t = sqrt(2d / g)**, where d is the distance fallen and g is gravity (9.8 m/s²).

The code below simulates this test. You will build a reaction timer, measure it multiple times, and calculate your average.`,
      analogy: 'Think of your brain as a relay race. The baton (signal) starts at your eyes, passes to your visual processing centre, then to your decision-making centre, then to your motor cortex, then down your spinal cord to your hand. Each handoff takes time. Your reaction time is the total time for the baton to reach the finish line.',
      storyConnection: 'Ravana\'s ten heads could each process information independently. But even Ravana had reaction time — the delay between perceiving a threat and commanding his body to respond. In the final battle, Rama\'s arrows flew faster than even ten heads could react.',
      checkQuestion: 'If a ruler falls 20 cm before you catch it, what is your reaction time?',
      checkAnswer: 'Using t = sqrt(2 * 0.20 / 9.8) = sqrt(0.0408) = 0.202 seconds, or about 202 milliseconds. That is close to the human average. Athletes who train reaction drills can get below 180 ms.',
      codeIntro: 'Calculate reaction time from ruler drop distance, then simulate multiple trials.',
      code: `import numpy as np

# === Ruler-Drop Reaction Time Calculator ===
g = 9.8  # gravity in m/s^2

# Simulate 10 ruler-drop catches (distances in cm)
catches_cm = [18, 22, 15, 20, 19, 24, 17, 21, 16, 23]

# Convert to metres and calculate reaction times
catches_m = [d / 100 for d in catches_cm]
reaction_times = [np.sqrt(2 * d / g) for d in catches_m]

print("=== Your Reaction Time Results ===")
print(f"{'Trial':>6} | {'Distance':>10} | {'Time':>10}")
print("-" * 35)
for i, (d, t) in enumerate(zip(catches_cm, reaction_times)):
    print(f"{i+1:>6} | {d:>8} cm | {t*1000:>7.1f} ms")

avg_time = np.mean(reaction_times) * 1000
std_time = np.std(reaction_times) * 1000
print(f"\\\nAverage reaction time: {avg_time:.1f} ms")
print(f"Variability (std dev): {std_time:.1f} ms")
print(f"\\\nFastest: {min(reaction_times)*1000:.1f} ms")
print(f"Slowest: {max(reaction_times)*1000:.1f} ms")`,
      challenge: 'Replace the catches_cm list with your own real measurements from the ruler-drop test. Do 10 trials with your dominant hand, then 10 with your non-dominant hand. Is there a significant difference?',
      successHint: 'You just turned a physical experiment into data analysis. The sqrt(2d/g) formula connects physics (falling objects) to neuroscience (brain processing speed). Every number tells a story about your nervous system.',
    },
    {
      title: 'Neuron anatomy — the brain\'s wiring diagram',
      concept: `Your brain has about **86 billion neurons**. Each neuron has three main parts:

1. **Dendrites** — tree-like branches that receive signals from other neurons
2. **Cell body (soma)** — processes the incoming signals
3. **Axon** — a long cable that transmits the output signal to the next neuron

The axon is wrapped in **myelin sheath** — a fatty insulation that speeds up signal transmission (like plastic coating on electrical wire). Without myelin, signals travel at about 1 m/s. With myelin, they reach **120 m/s**.

At the end of the axon, the signal reaches a **synapse** — a tiny gap. The electrical signal cannot jump the gap, so the neuron releases chemical **neurotransmitters** that float across and trigger the next neuron. This electrical-to-chemical-to-electrical relay happens billions of times per second in your brain.

The code below models a chain of neurons firing in sequence and calculates the total signal delay.`,
      analogy: 'A neuron is like a row of dominoes connected by short water channels. The domino falling is the electrical signal (fast). The water flowing across the channel is the chemical neurotransmitter crossing the synapse (slower). The next domino starts falling when enough water reaches it. The total time is domino-fall time plus water-crossing time, repeated for each relay.',
      storyConnection: 'Each of Ravana\'s ten heads had its own brain. The heads needed to communicate — to coordinate strategy, share information, synchronise actions. The communication delay between heads is like synaptic delay: the more heads involved in a decision, the longer it takes. This is why parallel systems need fast interconnects.',
      checkQuestion: 'If a signal must cross 8 synapses (each with 1 ms delay) and travel along 0.5 m of axon (at 100 m/s), what is the total signal time?',
      checkAnswer: 'Synaptic delays: 8 × 1 ms = 8 ms. Axon travel: 0.5 m / 100 m/s = 5 ms. Total: 8 + 5 = 13 ms. This is the relay chain from your eye to your brain to your hand — a simplified version of reaction time.',
      codeIntro: 'Model a chain of neurons and calculate signal propagation time.',
      code: `import numpy as np

# === Neuron Chain Simulator ===
class Neuron:
    def __init__(self, axon_length_m, myelinated=True):
        self.axon_length = axon_length_m
        self.speed = 120 if myelinated else 2  # m/s
        self.synapse_delay = 0.001  # 1 millisecond

    def signal_time(self):
        """Time for signal to travel axon + cross synapse."""
        axon_time = self.axon_length / self.speed
        return axon_time + self.synapse_delay

# Build a reflex arc: eye -> brain -> hand
chain = [
    Neuron(0.02, True),   # retina to optic nerve
    Neuron(0.05, True),   # optic nerve segment
    Neuron(0.03, True),   # visual cortex processing
    Neuron(0.04, True),   # motor cortex decision
    Neuron(0.80, True),   # spinal cord to hand (long!)
]

total_time = sum(n.signal_time() for n in chain)
print("=== Signal Path: Eye to Hand ===")
for i, n in enumerate(chain):
    t = n.signal_time() * 1000
    print(f"Neuron {i+1}: axon={n.axon_length:.2f}m, "
          f"speed={n.speed}m/s, time={t:.2f}ms")

print(f"\\\nTotal signal time: {total_time*1000:.1f} ms")
print(f"(Real reaction time is ~200ms because")
print(f" there are many more neurons and processing steps)")

# What if NOT myelinated?
chain_slow = [Neuron(n.axon_length, False) for n in chain]
slow_time = sum(n.signal_time() for n in chain_slow)
print(f"\\\nWithout myelin: {slow_time*1000:.1f} ms")
print(f"Myelin speedup: {slow_time/total_time:.0f}x faster!")`,
      challenge: 'Add more neurons to the chain to model a more realistic reflex arc (10-15 neurons). How does the total time change? What happens if some neurons in the middle lose their myelin (set myelinated=False) — simulating a disease like multiple sclerosis?',
      successHint: 'You modelled the nervous system as a relay chain. Each neuron adds time (axon transit + synapse delay). Myelin makes a dramatic difference — without it, signals are 60x slower. This is why demyelinating diseases cause such severe symptoms.',
    },
    {
      title: 'Task switching — the cost of "multitasking"',
      concept: `Remember the claim that Ravana could think ten thoughts simultaneously? Your brain cannot do this — but it tries. The result is **task switching**, and it comes with a measurable **cost**.

When you switch from Task A to Task B, your brain must:
1. **Save** the current state of Task A (where you were, what you were thinking)
2. **Load** the context of Task B (recall where you left off)
3. **Restart** processing on Task B

This save-load-restart cycle takes time — typically **200-500 milliseconds** per switch. During that time, you are processing NEITHER task. The more you switch, the more time you waste on switching itself rather than actual work.

Studies show that people who "multitask" take **40% longer** to complete tasks and make **50% more errors** than people who focus on one task at a time.

The code below simulates serial (focused) vs switching (multitasking) performance.`,
      analogy: 'Imagine reading two books simultaneously by alternating pages. Read page 1 of Book A, then page 1 of Book B, then page 2 of Book A, and so on. Each time you switch, you need to remember where you were in the other book, recall the characters and plot, and re-orient yourself. The switching overhead means you finish both books much later than if you had read one completely, then the other.',
      storyConnection: 'Ravana\'s advantage was that his ten heads did NOT switch. Each head stayed on its own task permanently — one always doing music, one always doing strategy. There was no switch cost because there was no switching. This is the ideal: dedicated processors for dedicated tasks. Modern GPUs work the same way.',
      checkQuestion: 'If each task takes 5 seconds and each switch costs 0.3 seconds, how long does it take to complete 4 tasks with (a) no switching and (b) switching between each?',
      checkAnswer: '(a) No switching: 4 × 5 = 20 seconds. (b) Switching between each: 4 × 5 + 3 switches × 0.3 = 20.9 seconds. The extra 0.9 seconds is pure overhead. With 100 tasks and constant switching, the overhead adds up to 30 seconds of wasted time.',
      codeIntro: 'Simulate focused work vs task-switching and measure the cost.',
      code: `import numpy as np

# === Task Switching Simulator ===
np.random.seed(42)

num_tasks = 6
task_time = 2.0  # seconds per task (base time)
switch_cost = 0.4  # seconds lost per context switch

# Focused mode: do each task completely before starting next
focused_total = num_tasks * task_time
print("=== Focused Mode (Ravana: one head per task) ===")
for i in range(num_tasks):
    print(f"  Task {i+1}: {task_time:.1f}s")
print(f"  Total: {focused_total:.1f}s | Switches: 0")

# Switching mode: rotate through tasks, doing a bit at a time
rounds = 3  # each task needs 3 rounds to complete
switches = num_tasks * rounds - 1
switching_total = num_tasks * task_time + switches * switch_cost
print(f"\\\n=== Switching Mode (one head, multitasking) ===")
print(f"  Work time: {num_tasks * task_time:.1f}s")
print(f"  Switches: {switches}")
print(f"  Switch overhead: {switches * switch_cost:.1f}s")
print(f"  Total: {switching_total:.1f}s")

# Error rate increases with switching
error_rate_focused = 0.02   # 2% error rate
error_rate_switching = 0.05  # 5% error rate
print(f"\\\n=== Error Rates ===")
print(f"  Focused: {error_rate_focused*100:.0f}% errors")
print(f"  Switching: {error_rate_switching*100:.0f}% errors")
print(f"  Switching makes {error_rate_switching/error_rate_focused:.1f}x more errors")

overhead_pct = (switching_total - focused_total) / focused_total * 100
print(f"\\\n=> Multitasking penalty: +{overhead_pct:.0f}% time")`,
      challenge: 'Experiment with different switch_cost values (0.1, 0.5, 1.0 seconds). At what switch cost does multitasking take twice as long as focused work? Also try increasing the number of tasks to 20 — how does the overhead scale?',
      successHint: 'Task switching is not free — every switch wastes time. This is why "multitasking" is a myth for serial processors (including your brain). The optimal strategy is Ravana\'s: dedicate each processor to one task and avoid switching entirely.',
    },
    {
      title: 'Reaction time histogram — visualising brain data',
      concept: `Raw numbers are useful, but a **histogram** reveals patterns that numbers alone cannot show. A histogram groups data into bins and shows how many data points fall into each bin — giving you the **distribution** of your data.

If you test your reaction time 100 times, you will not get the same number every time. Most trials will cluster around 200 ms (the average), with a few very fast ones (~150 ms, when you were alert) and a few very slow ones (~300 ms, when you were distracted). The histogram shows this bell-shaped spread.

This is called a **normal distribution** — most values cluster near the centre, with fewer values at the extremes. Nearly everything in biology follows this pattern: height, weight, blood pressure, and reaction time.

The code below generates reaction time data and plots a histogram with statistical annotations.`,
      analogy: 'A histogram is like sorting students by height and lining them up. Most students are near the average height (the tall bar in the middle). Very few are extremely short or extremely tall (the short bars at the edges). The shape of the lineup tells you more than any single height measurement.',
      storyConnection: 'If Ravana\'s ten heads each performed the ruler-drop test, you would get ten reaction times. Plotting them as a histogram would reveal whether all heads were equally fast or whether some were quicker. In the story, the "warfare" head would likely react fastest — specialised processors are faster at their domain.',
      checkQuestion: 'If your reaction time histogram shows two peaks (one at 180 ms and one at 280 ms) instead of one, what might that mean?',
      checkAnswer: 'A two-peaked (bimodal) distribution suggests you had two distinct modes: an alert mode (180 ms) and a distracted mode (280 ms). This happens when attention wanders during testing. You were essentially switching between focused and unfocused states — a real-world demonstration of the multitasking cost.',
      codeIntro: 'Generate reaction time data and create a histogram with mean and standard deviation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Reaction Time Distribution ===
np.random.seed(7)

# Simulate 200 reaction time trials (in ms)
# Normal distribution centred at 210 ms, spread of 30 ms
reaction_times = np.random.normal(loc=210, scale=30, size=200)
reaction_times = np.clip(reaction_times, 100, 400)  # realistic bounds

mean_rt = np.mean(reaction_times)
std_rt = np.std(reaction_times)
median_rt = np.median(reaction_times)

plt.figure(figsize=(10, 5))
plt.hist(reaction_times, bins=25, color='#a78bfa', edgecolor='white',
         alpha=0.85, label='Reaction times')

# Mark statistics
plt.axvline(mean_rt, color='#ef4444', linewidth=2.5,
            linestyle='--', label=f'Mean: {mean_rt:.0f} ms')
plt.axvline(median_rt, color='#22c55e', linewidth=2,
            linestyle=':', label=f'Median: {median_rt:.0f} ms')

# Shade ±1 std dev
plt.axvspan(mean_rt - std_rt, mean_rt + std_rt,
            alpha=0.15, color='red', label=f'±1 SD: {std_rt:.0f} ms')

plt.xlabel('Reaction Time (ms)', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.title('Human Reaction Time Distribution (200 trials)', fontsize=14)
plt.legend(fontsize=10)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

print(f"Mean: {mean_rt:.1f} ms | Std Dev: {std_rt:.1f} ms")
print(f"68% of trials between {mean_rt-std_rt:.0f} and {mean_rt+std_rt:.0f} ms")
print(f"Fastest: {min(reaction_times):.0f} ms | Slowest: {max(reaction_times):.0f} ms")`,
      challenge: 'Add a second dataset for "distracted" reaction times (mean=280, std=50) and overlay it on the same histogram in a different colour. This shows the cost of divided attention. How much overlap is there between the two distributions?',
      successHint: 'A histogram transforms raw data into visual insight. You can see the average, the spread, and the shape of the distribution at a glance. This is how neuroscientists analyse brain performance data — and how you should analyse any experimental results.',
    },
    {
      title: 'Serial vs parallel — timing the difference',
      concept: `Now let's directly measure the difference between **serial** and **parallel** processing using Python.

In serial processing, you complete tasks one after another. Total time = sum of all individual task times.

In parallel processing, tasks run simultaneously. Total time = the time of the LONGEST single task (since all others finish while the longest is still running).

**Speedup** = serial time / parallel time. With 4 equal tasks on 4 processors, the ideal speedup is 4x. With 10 tasks on 10 processors, it is 10x. Ravana's 10 heads gave him a theoretical 10x speedup over a single-headed thinker.

But real-world speedup is always less than ideal because of **overhead**: time spent dividing the work, synchronising results, and communication between processors.`,
      analogy: 'You need to paint 4 walls in a room. Alone (serial), you paint wall 1, then 2, then 3, then 4 — total time is 4 hours. With 3 friends (parallel), each person takes one wall — total time is 1 hour. But you also spend 10 minutes handing out brushes and coordinating who paints which wall. Real time: 1 hour and 10 minutes. The overhead means you do not get a perfect 4x speedup.',
      storyConnection: 'Ravana\'s ten heads could each master a different domain. But in battle, the heads had to coordinate through one body. The communication bottleneck between heads — like the bus between CPU cores — limited his actual performance. Ten heads did not mean ten times the battlefield effectiveness.',
      checkQuestion: 'If 8 tasks each take 2 seconds, and you have 4 parallel processors, what is the parallel time and speedup?',
      checkAnswer: 'Serial time: 8 × 2 = 16 seconds. With 4 processors, each handles 2 tasks: 2 × 2 = 4 seconds. Speedup = 16 / 4 = 4x. Note: with 4 processors and 8 tasks, each processor does 2 tasks serially. Perfect speedup requires at least as many processors as tasks.',
      codeIntro: 'Compare serial vs parallel execution and measure speedup.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Serial vs Parallel Processing ===
np.random.seed(42)

# Simulate task durations (in seconds)
num_tasks = 10
task_durations = np.random.uniform(0.5, 2.5, num_tasks)
task_durations = np.round(task_durations, 2)

print("Task durations (seconds):")
for i, d in enumerate(task_durations):
    print(f"  Task {i+1}: {d:.2f}s")

serial_time = np.sum(task_durations)

# Parallel with varying number of processors
processors = [1, 2, 4, 5, 10]
parallel_times = []

for p in processors:
    # Distribute tasks to processors (round-robin)
    loads = [0.0] * p
    for i, d in enumerate(task_durations):
        loads[i % p] += d
    parallel_time = max(loads)
    parallel_times.append(parallel_time)

# Plot speedup
speedups = [serial_time / t for t in parallel_times]
ideal_speedups = [min(p, num_tasks) for p in processors]

plt.figure(figsize=(10, 5))
plt.plot(processors, speedups, 'o-', color='#a78bfa',
         linewidth=2.5, markersize=10, label='Actual speedup')
plt.plot(processors, ideal_speedups, '--', color='#94a3b8',
         linewidth=1.5, label='Ideal speedup')
plt.xlabel('Number of Processors (Heads)', fontsize=12)
plt.ylabel('Speedup (x)', fontsize=12)
plt.title("Ravana's Speedup: More Heads = More Speed?", fontsize=14)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.xticks(processors)
plt.tight_layout()
plt.show()

print(f"\\\nSerial time (1 head): {serial_time:.2f}s")
for p, t, s in zip(processors, parallel_times, speedups):
    print(f"{p:>2} heads: {t:.2f}s (speedup: {s:.1f}x)")`,
      challenge: 'What happens when tasks have very different durations (one is 10s, the rest are 1s)? Modify task_durations to include one very long task and see how it affects parallel speedup. This demonstrates the "straggler problem" — one slow head holds back all the others.',
      successHint: 'Serial processing is the sum of all tasks. Parallel processing is limited by the slowest task on the busiest processor. More processors help, but with diminishing returns — especially when tasks are uneven. This is Amdahl\'s Law in action.',
    },
    {
      title: 'Build a brain speed dashboard',
      concept: `Let's bring everything together into a **brain performance dashboard** — a single visualization that shows reaction time, neuron chain speed, and the effect of parallel processing all in one view.

This is how real neuroscience labs present data: multiple plots on one figure, each telling a different part of the story. A good dashboard lets you see relationships between different measurements at a glance.

You will create a 2×2 grid of plots:
1. Reaction time histogram (how fast you react)
2. Neuron chain timing (how signals propagate)
3. Serial vs parallel bar chart (how many heads help)
4. Speedup curve (diminishing returns of more processors)`,
      analogy: 'A dashboard is like the instrument panel in a car. The speedometer, fuel gauge, temperature gauge, and tachometer each tell you one thing. Together, they give you a complete picture of the car\'s state. A brain performance dashboard does the same for neural processing.',
      storyConnection: 'Ravana, the greatest scholar of his age, would have loved a dashboard for his ten heads. Which head was fastest? Which domain required the most communication between heads? Where were the bottlenecks? Modern neuroscience tools like fMRI and EEG are essentially brain dashboards — they show which regions are active and how fast they respond.',
      checkQuestion: 'If you add a 5th plot showing error rate vs number of tasks attempted simultaneously, what shape would you expect the curve to have?',
      checkAnswer: 'The error rate would increase roughly exponentially with the number of simultaneous tasks. One task: ~2% errors. Two tasks: ~5%. Three tasks: ~12%. Four tasks: ~25%. Beyond 3-4 tasks, errors skyrocket because the brain cannot maintain context for so many threads. The curve rises slowly at first, then steeply.',
      codeIntro: 'Create a 2x2 brain performance dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(12, 9))

# Plot 1: Reaction Time Histogram
rt = np.random.normal(210, 30, 150)
axes[0,0].hist(rt, bins=20, color='#a78bfa', edgecolor='white')
axes[0,0].axvline(np.mean(rt), color='red', linestyle='--', linewidth=2)
axes[0,0].set_title('Reaction Time Distribution')
axes[0,0].set_xlabel('Time (ms)'); axes[0,0].set_ylabel('Count')

# Plot 2: Signal Speed — Myelinated vs Not
neurons = range(1, 11)
myelin_time = np.cumsum([0.5 + 1.0 for _ in neurons])  # ms per step
no_myelin = np.cumsum([25 + 1.0 for _ in neurons])
axes[0,1].plot(neurons, myelin_time, 'o-', color='#22c55e',
               linewidth=2, label='Myelinated')
axes[0,1].plot(neurons, no_myelin, 's-', color='#ef4444',
               linewidth=2, label='Unmyelinated')
axes[0,1].set_title('Signal Time Through Neuron Chain')
axes[0,1].set_xlabel('Neurons in chain'); axes[0,1].set_ylabel('Total time (ms)')
axes[0,1].legend()

# Plot 3: Serial vs Parallel Bar Chart
tasks = 10
serial = tasks * 1.5  # 1.5s per task
heads = [1, 2, 5, 10]
par_times = [serial / h for h in heads]
colors = ['#94a3b8', '#60a5fa', '#a78bfa', '#f59e0b']
axes[1,0].bar([str(h) for h in heads], par_times, color=colors)
axes[1,0].set_title(f'{tasks} Tasks: Serial vs Parallel')
axes[1,0].set_xlabel("Ravana's Heads"); axes[1,0].set_ylabel('Total Time (s)')

# Plot 4: Speedup Curve
p_range = np.arange(1, 21)
ideal = p_range
real = 1 / (0.1 + 0.9 / p_range)  # Amdahl's law, 10% serial
axes[1,1].plot(p_range, ideal, '--', color='#94a3b8', label='Ideal')
axes[1,1].plot(p_range, real, 'o-', color='#f59e0b',
               markersize=4, linewidth=2, label="Amdahl's Law (10% serial)")
axes[1,1].set_title('Speedup vs Number of Processors')
axes[1,1].set_xlabel('Processors'); axes[1,1].set_ylabel('Speedup (x)')
axes[1,1].legend()

for ax in axes.flat:
    ax.grid(alpha=0.3)

plt.suptitle("Brain & Parallel Processing Dashboard", fontsize=16,
             fontweight='bold', y=1.02)
plt.tight_layout()
plt.show()

print("Dashboard complete!")
print("Key takeaway: more processors help, but diminishing returns")
print("are inevitable when ANY part of the work is serial.")`,
      challenge: 'Add a 5th subplot (change to 2x3 grid) showing error rate vs simultaneous tasks. Use an exponential curve: errors = 0.02 * exp(0.5 * num_tasks). This completes the picture of why multitasking is costly.',
      successHint: 'You built a complete neuroscience dashboard from scratch. Multiple subplots, different data types, clear labels and legends. This is how scientists communicate complex findings — and you now have the code skills to do it yourself.',
    },
  ];

  const diagrams = [ActivityReactionTimeDiagram, RavanaNeuronDiagram, RavanaParallelDiagram, null, RavanaCPUGPUDiagram, RavanaNeuralNetDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Brain basics and reaction time</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for neuroscience simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
