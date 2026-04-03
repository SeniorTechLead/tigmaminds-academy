import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TortoiseHareLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Project Design: Animal Race Simulator',
      concept: `Your capstone project builds a **physics-based race simulator** that models speed, acceleration, stamina, and rest behaviour for different animals, then determines which animal wins at different race distances. This is not a toy problem. Wildlife biologists use exactly these movement models to predict home ranges, migration success, and predator-prey outcomes.

Every animal has a characteristic **locomotion profile** defined by measurable quantities. **Top speed** is the maximum velocity an animal can sustain briefly. **Acceleration** determines how quickly it reaches top speed (F = ma, so smaller animals with proportionally more muscle often accelerate faster). **Stamina** is the duration an animal can maintain near-top speed before fatigue forces it to slow down. **Recovery rate** controls how quickly stamina replenishes during rest or slow movement. **Cruise speed** is the sustainable velocity for long-distance travel, typically 30-50% of top speed.

The simulator pipeline has four stages. First, **data assembly**: collecting real biomechanical measurements for 6-8 species. Second, **physics engine**: a time-stepping simulation where each animal accelerates, cruises, fatigues, and recovers according to its profile. Third, **race execution**: running the race across different distances from 100 m to 50 km. Fourth, **analysis**: determining crossover distances where slow-but-enduring animals overtake fast-but-fragile ones. The final output is a position-vs-time chart showing exactly when and why the tortoise beats the hare.`,
      analogy: 'Designing this simulator is like planning a Formula 1 race strategy. The team does not just ask "which car is fastest?" They model acceleration out of corners, tyre degradation over laps, fuel load effects, and pit stop timing. The fastest car on one lap might lose a long race because its tyres degrade faster. Our animals are the cars, stamina is tyre life, and rest stops are pit stops.',
      storyConnection: 'In the Pobitora story, Khargosh the hare was undeniably faster in a sprint, but lost because he got lost in elephant grass and stuck in mud. Our simulator captures a cleaner version of this trade-off: pure biomechanics without luck. The hare\'s speed advantage decays with distance because its stamina runs out, while Kaaso the turtle just keeps plodding. We will find the exact distance where the tortoise overtakes the hare.',
      checkQuestion: 'A cheetah can hit 108 km/h but only for about 15 seconds. A wildebeest tops out at 80 km/h but can sustain it for minutes. At roughly what distance does the wildebeest start to gain on the cheetah?',
      checkAnswer: 'The cheetah covers about 108 * (15/3600) = 0.45 km in its sprint window. After that it must stop and pant. The wildebeest at 80 km/h covers 0.45 km in about 20 seconds and is still going strong. So the crossover begins around 400-500 metres. Beyond that distance, the wildebeest pulls ahead steadily. This sprint-vs-endurance crossover is the central phenomenon our simulator will capture.',
      codeIntro: 'Build the animal database with real biomechanical parameters and visualize how their locomotion profiles differ.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Animal Locomotion Database ---
# Each animal: top_speed (m/s), acceleration (m/s^2), stamina (seconds at top speed),
#              recovery_rate (stamina fraction recovered per second of rest),
#              cruise_speed (m/s), name, color
animals = {
    'Hare': {
        'top_speed': 20.0,      # ~72 km/h
        'acceleration': 8.0,    # explosive start
        'stamina': 45,          # tires quickly
        'recovery_rate': 0.008, # slow recovery
        'cruise_speed': 5.0,    # walks slowly when tired
        'color': '#22c55e',
    },
    'Tortoise': {
        'top_speed': 0.28,      # ~1 km/h
        'acceleration': 0.1,
        'stamina': 99999,       # essentially infinite
        'recovery_rate': 1.0,
        'cruise_speed': 0.22,   # steady pace
        'color': '#f59e0b',
    },
    'Rhino': {
        'top_speed': 12.5,      # ~45 km/h
        'acceleration': 3.0,    # heavy but powerful
        'stamina': 30,          # short burst
        'recovery_rate': 0.005,
        'cruise_speed': 3.0,
        'color': '#6b7280',
    },
    'Deer': {
        'top_speed': 17.0,      # ~61 km/h
        'acceleration': 6.0,
        'stamina': 120,         # good endurance
        'recovery_rate': 0.012,
        'cruise_speed': 6.0,
        'color': '#a855f7',
    },
    'Elephant': {
        'top_speed': 11.0,      # ~40 km/h
        'acceleration': 2.0,
        'stamina': 60,
        'recovery_rate': 0.003,
        'cruise_speed': 2.5,    # slow but tireless walk
        'color': '#3b82f6',
    },
    'Wild Dog': {
        'top_speed': 16.0,      # ~58 km/h
        'acceleration': 5.0,
        'stamina': 600,         # legendary endurance hunters
        'recovery_rate': 0.02,
        'cruise_speed': 8.0,    # can jog for hours
        'color': '#ef4444',
    },
}

# --- Visualize profiles ---
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Animal Locomotion Profiles — Pobitora Race Contestants',
             color='white', fontsize=14, fontweight='bold')

names = list(animals.keys())
colors = [animals[n]['color'] for n in names]

# Plot 1: Top speed comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
speeds = [animals[n]['top_speed'] * 3.6 for n in names]  # convert to km/h
bars = ax.barh(names, speeds, color=colors, edgecolor='none')
for bar, s in zip(bars, speeds):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'{s:.0f} km/h', va='center', color='white', fontsize=10)
ax.set_xlabel('Top speed (km/h)', color='white')
ax.set_title('Sprint Speed', color='white', fontsize=11)

# Plot 2: Stamina comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
staminas = [min(animals[n]['stamina'], 700) for n in names]
bars = ax.barh(names, staminas, color=colors, edgecolor='none')
for bar, n in zip(bars, names):
    s = animals[n]['stamina']
    label = f'{s}s' if s < 1000 else 'unlimited'
    ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
            label, va='center', color='white', fontsize=10)
ax.set_xlabel('Stamina (seconds at top speed)', color='white')
ax.set_title('Endurance', color='white', fontsize=11)

# Plot 3: Speed x Stamina product (sprint distance)
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
sprint_dist = [animals[n]['top_speed'] * min(animals[n]['stamina'], 700) for n in names]
bars = ax.barh(names, sprint_dist, color=colors, edgecolor='none')
for bar, d in zip(bars, sprint_dist):
    ax.text(bar.get_width() + 10, bar.get_y() + bar.get_height()/2,
            f'{d:.0f}m', va='center', color='white', fontsize=10)
ax.set_xlabel('Sprint distance (m)', color='white')
ax.set_title('Speed x Stamina', color='white', fontsize=11)

# Plot 4: Acceleration time to top speed
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
t_to_top = [animals[n]['top_speed'] / animals[n]['acceleration'] for n in names]
bars = ax.barh(names, t_to_top, color=colors, edgecolor='none')
for bar, t in zip(bars, t_to_top):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'{t:.1f}s', va='center', color='white', fontsize=10)
ax.set_xlabel('Time to top speed (s)', color='white')
ax.set_title('Acceleration', color='white', fontsize=11)

# Plot 5: Cruise speed (long distance rate)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
cruise = [animals[n]['cruise_speed'] * 3.6 for n in names]
bars = ax.barh(names, cruise, color=colors, edgecolor='none')
for bar, c in zip(bars, cruise):
    ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height()/2,
            f'{c:.1f} km/h', va='center', color='white', fontsize=10)
ax.set_xlabel('Cruise speed (km/h)', color='white')
ax.set_title('Sustainable Pace', color='white', fontsize=11)

# Plot 6: Summary text
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
text = "Race Simulator Blueprint\\n" + "=" * 30 + "\\n\\n"
text += "6 contestants defined with:\\n"
text += "  - Top speed\\n  - Acceleration\\n"
text += "  - Stamina duration\\n  - Recovery rate\\n"
text += "  - Cruise speed\\n\\n"
text += "Key insight: The 'best' animal\\n"
text += "depends entirely on race distance.\\n"
text += "Short race = speed wins.\\n"
text += "Long race = endurance wins.\\n\\n"
text += "Next: build the physics engine\\n"
text += "that simulates second-by-second\\n"
text += "movement for each contestant."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Animal database built: 6 species with full locomotion profiles.")
print(f"Fastest sprinter: {max(names, key=lambda n: animals[n]['top_speed'])} "
      f"at {max(animals[n]['top_speed'] for n in names) * 3.6:.0f} km/h")
print(f"Best endurance: {max(names, key=lambda n: animals[n]['cruise_speed'])} "
      f"at {max(animals[n]['cruise_speed'] for n in names) * 3.6:.0f} km/h cruise")
print("Next: build the second-by-second physics engine.")`,
      challenge: 'Add two more animals: a Cheetah (top speed 30 m/s, stamina 15 seconds, acceleration 10 m/s^2) and a Monitor Lizard (top speed 4 m/s, stamina 20 seconds, cruise 1.5 m/s). How does the cheetah compare on the speed-times-stamina product?',
      successHint: 'The database reveals why "fastest" is a misleading label. The hare is 70x faster than the tortoise in a sprint, but the wild dog covers more ground per hour because it never has to stop. Race distance determines the winner.',
    },
    {
      title: 'Physics Engine: Acceleration, Fatigue, and Recovery',
      concept: `The heart of the simulator is a **time-stepping physics engine** that updates each animal's state every second. At each time step, the engine must answer: is this animal sprinting, cruising, or resting? The answer depends on its current **stamina level**, a resource that depletes during high-speed running and replenishes during slow movement or rest.

The physics model has three states. In the **sprint state**, the animal accelerates toward top speed at its characteristic acceleration rate, and stamina drains at 1 unit per second. In the **cruise state**, the animal moves at its sustainable cruise speed with zero stamina drain (cruise speed is slow enough to be metabolically sustainable). In the **rest state**, the animal stops entirely and stamina recovers at its recovery rate.

The transition rules encode biomechanical reality. An animal sprints while stamina is above zero and it has not yet covered the race distance. When stamina reaches zero, it must switch to cruising. A smarter strategy would include voluntary rest stops to recover stamina for another sprint burst, but we start with the simplest model: sprint until empty, then cruise.

The position update uses basic kinematics. If the animal is accelerating: v(t+dt) = min(v(t) + a*dt, top_speed). Position updates as: x(t+dt) = x(t) + v(t)*dt + 0.5*a*dt^2. During cruise: v = cruise_speed, x increases linearly. This is Newton's laws applied to animal locomotion.`,
      analogy: 'The physics engine is like a flight simulator. A flight simulator does not "know" where the plane will be in 10 minutes. It computes forces and accelerations at each tiny time step, and the trajectory emerges from physics. Our race simulator does the same: we do not predict the winner, we simulate the physics and let the result emerge.',
      storyConnection: 'When Khargosh sprinted ahead in the Pobitora race, he was in the "sprint state" with stamina draining every second. When he got lost in the elephant grass, his stamina hit zero and he transitioned to confused wandering. Kaaso the tortoise was in "cruise state" the entire race, slow but never needing to stop. Our engine formalizes exactly this dynamic.',
      checkQuestion: 'If an animal with top speed 20 m/s, acceleration 8 m/s^2, and stamina 45 seconds starts from rest, how far does it travel before stamina runs out? Assume it reaches top speed and then maintains it.',
      checkAnswer: 'Time to reach top speed: 20/8 = 2.5 seconds. Distance during acceleration: 0.5 * 8 * 2.5^2 = 25 m. Remaining stamina time at top speed: 45 - 2.5 = 42.5 seconds. Distance at top speed: 20 * 42.5 = 850 m. Total sprint distance: 25 + 850 = 875 m. After that the hare must slow to cruise speed.',
      codeIntro: 'Build the time-stepping physics engine and run a single race to visualize the movement dynamics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Animal data (from Lesson 1) ---
animals = {
    'Hare': {'top_speed': 20.0, 'acceleration': 8.0, 'stamina': 45,
             'recovery_rate': 0.008, 'cruise_speed': 5.0, 'color': '#22c55e'},
    'Tortoise': {'top_speed': 0.28, 'acceleration': 0.1, 'stamina': 99999,
                 'recovery_rate': 1.0, 'cruise_speed': 0.22, 'color': '#f59e0b'},
    'Rhino': {'top_speed': 12.5, 'acceleration': 3.0, 'stamina': 30,
              'recovery_rate': 0.005, 'cruise_speed': 3.0, 'color': '#6b7280'},
    'Deer': {'top_speed': 17.0, 'acceleration': 6.0, 'stamina': 120,
             'recovery_rate': 0.012, 'cruise_speed': 6.0, 'color': '#a855f7'},
    'Elephant': {'top_speed': 11.0, 'acceleration': 2.0, 'stamina': 60,
                 'recovery_rate': 0.003, 'cruise_speed': 2.5, 'color': '#3b82f6'},
    'Wild Dog': {'top_speed': 16.0, 'acceleration': 5.0, 'stamina': 600,
                 'recovery_rate': 0.02, 'cruise_speed': 8.0, 'color': '#ef4444'},
}

def simulate_race(animal_data, race_distance, dt=1.0, max_time=50000):
    """Simulate one animal's race. Returns time, position, velocity, stamina arrays."""
    a = animal_data
    times = [0.0]
    positions = [0.0]
    velocities = [0.0]
    staminas = [a['stamina']]

    t = 0.0
    x = 0.0
    v = 0.0
    stam = a['stamina']
    max_stam = a['stamina']

    while x < race_distance and t < max_time:
        t += dt

        if stam > 0:
            # Sprint: accelerate toward top speed
            v = min(v + a['acceleration'] * dt, a['top_speed'])
            stam = max(0, stam - dt)
        else:
            # Stamina depleted: cruise
            v = a['cruise_speed']
            # Recover stamina slowly while cruising
            stam = min(max_stam, stam + a['recovery_rate'] * max_stam * dt)

        x += v * dt

        times.append(t)
        positions.append(min(x, race_distance))
        velocities.append(v)
        staminas.append(stam)

        if x >= race_distance:
            break

    return {
        'time': np.array(times),
        'position': np.array(positions),
        'velocity': np.array(velocities),
        'stamina': np.array(staminas),
        'finish_time': t if x >= race_distance else max_time,
    }

# Run a 2 km race
race_dist = 2000  # metres
results = {}
for name, data in animals.items():
    results[name] = simulate_race(data, race_dist)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Race Simulation: {race_dist}m Course at Pobitora',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Position vs time (first 200 seconds, excludes tortoise timescale)
ax = axes[0, 0]
for name, r in results.items():
    if name == 'Tortoise':
        continue  # different timescale
    mask = r['time'] <= 300
    ax.plot(r['time'][mask], r['position'][mask], color=animals[name]['color'],
            linewidth=2, label=f"{name} ({r['finish_time']:.0f}s)")
ax.axhline(race_dist, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Position (metres)', color='white')
ax.set_title('Position vs Time (fast animals)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Velocity profiles (first 200 seconds)
ax = axes[0, 1]
for name, r in results.items():
    if name == 'Tortoise':
        continue
    mask = r['time'] <= 300
    ax.plot(r['time'][mask], r['velocity'][mask] * 3.6, color=animals[name]['color'],
            linewidth=1.5, label=name)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Speed (km/h)', color='white')
ax.set_title('Velocity Profiles', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Stamina depletion
ax = axes[0, 2]
for name, r in results.items():
    if name == 'Tortoise':
        continue
    max_stam = animals[name]['stamina']
    mask = r['time'] <= 300
    ax.plot(r['time'][mask], r['stamina'][mask] / max_stam * 100,
            color=animals[name]['color'], linewidth=1.5, label=name)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Stamina remaining (%)', color='white')
ax.set_title('Stamina Depletion', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Finish times comparison
ax = axes[1, 0]
names_sorted = sorted(results.keys(), key=lambda n: results[n]['finish_time'])
finish_times = [results[n]['finish_time'] for n in names_sorted]
bar_colors = [animals[n]['color'] for n in names_sorted]
bars = ax.barh(names_sorted, finish_times, color=bar_colors, edgecolor='none')
for bar, ft in zip(bars, finish_times):
    label = f'{ft:.0f}s' if ft < 10000 else f'{ft/3600:.1f}h'
    ax.text(bar.get_width() + max(finish_times) * 0.02,
            bar.get_y() + bar.get_height()/2,
            label, va='center', color='white', fontsize=10)
ax.set_xlabel('Finish time', color='white')
ax.set_title(f'Race Results: {race_dist}m', color='white', fontsize=11)

# Plot 5: Hare vs Wild Dog detailed comparison
ax = axes[1, 1]
for name in ['Hare', 'Wild Dog']:
    r = results[name]
    mask = r['time'] <= 250
    ax.plot(r['time'][mask], r['position'][mask], color=animals[name]['color'],
            linewidth=2.5, label=name)
ax.axhline(race_dist, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Position (m)', color='white')
ax.set_title('Hare vs Wild Dog (endurance hunter)', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = f"Physics Engine Results ({race_dist}m)\\n"
text += "=" * 35 + "\\n\\n"
for name in names_sorted:
    ft = results[name]['finish_time']
    avg_speed = race_dist / ft
    label = f'{ft:.0f}s' if ft < 10000 else f'{ft/3600:.1f}h'
    text += f"{name:12s} {label:>8}  avg {avg_speed*3.6:.1f} km/h\\n"
text += "\\nThe hare leads early but the wild\\n"
text += "dog's endurance wins at 2 km.\\n"
text += "The tortoise finishes... eventually.\\n\\n"
text += "Next: race at multiple distances\\n"
text += "to find the crossover points."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Race simulation complete: {race_dist}m course.")
print(f"Winner: {names_sorted[0]} in {results[names_sorted[0]]['finish_time']:.0f}s")
print("Physics engine working: acceleration, fatigue, cruise all modeled.")
print("Next: add terrain factors and test across multiple distances.")`,
      challenge: 'Add a "sprint-rest-sprint" strategy for the hare: sprint until stamina hits 20%, rest until 80%, then sprint again. Does this beat the current "sprint then cruise" strategy at 2 km?',
      successHint: 'The physics engine captures the fundamental trade-off: the hare is 70x faster at peak but crashes hard. The wild dog is slower but barely decelerates. At 2 km, endurance dominates. Now we need to find the exact crossover distances.',
    },
    {
      title: 'Terrain Modeling: Mud, Grass, and Elevation',
      concept: `Real races do not happen on flat, smooth surfaces. The Pobitora course crosses **elephant grass** (slows movement and causes navigation errors), **muddy patches** near the waterhole (where heavy animals sink and light animals are less affected), and **elevation changes** (uphill costs more energy). Terrain modelling turns our flat-track simulator into an ecologically realistic one.

We model terrain as a function that modifies an animal's effective speed at each position along the course. The **terrain factor** ranges from 0 to 1, where 1 means no impediment and 0.2 means the animal moves at 20% of its normal speed. Different animals are affected differently by the same terrain: a tortoise glides through mud that traps a hare (small ground pressure vs large), while tall grass barely slows a rhino that parts it with its bulk but completely confuses a small hare.

The **species-terrain interaction** is the key modelling insight. We define a **terrain vulnerability matrix**: for each animal-terrain pair, a multiplier between 0 and 1. Mud has vulnerability 0.3 for the hare (severely stuck) but 0.9 for the tortoise (flat shell slides). Tall grass has vulnerability 0.4 for the hare (lost and tangled) but 1.0 for the rhino (bulldozes through). Elevation gain costs energy proportional to body mass times gravity times height, drawn from the stamina pool.

The course is divided into segments, each with a terrain type. The simulator applies the appropriate terrain factor at each position, modifying effective speed: v_effective = v_base * terrain_factor * species_vulnerability.`,
      analogy: 'Terrain modelling is like the different surfaces in a triathlon: swimming, cycling, and running. A great swimmer might be a mediocre cyclist. The overall winner is not the person who excels at one discipline but the one who performs well across all three. Our course has "disciplines" too: flat sprint, mud traverse, and grass navigation.',
      storyConnection: 'The Pobitora story hinges on terrain. Khargosh got lost in the elephant grass (terrain vulnerability = 0.4) and stuck in the mud (terrain vulnerability = 0.3). Kaaso slid through the mud on her flat shell (terrain vulnerability = 0.9) and followed the river path to avoid the grass entirely. Our terrain model encodes exactly these differences as quantitative physics.',
      checkQuestion: 'Why should terrain vulnerability depend on the animal species rather than just the terrain type? Could we model terrain as a single speed reduction for everyone?',
      checkAnswer: 'A single speed reduction would miss critical species-specific adaptations. Mud slows a hare (high ground pressure, legs sink) but barely affects a tortoise (low ground pressure, flat shell). A universal 50% mud penalty would incorrectly predict equal slowdown for both. The species-terrain interaction matrix captures the reality that terrain is not inherently hard or easy; it is hard or easy for a particular body plan.',
      codeIntro: 'Build the terrain model with species-specific vulnerability and simulate a race on the Pobitora course.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Animal data ---
animals = {
    'Hare': {'top_speed': 20.0, 'acceleration': 8.0, 'stamina': 45,
             'recovery_rate': 0.008, 'cruise_speed': 5.0, 'color': '#22c55e'},
    'Tortoise': {'top_speed': 0.28, 'acceleration': 0.1, 'stamina': 99999,
                 'recovery_rate': 1.0, 'cruise_speed': 0.22, 'color': '#f59e0b'},
    'Rhino': {'top_speed': 12.5, 'acceleration': 3.0, 'stamina': 30,
              'recovery_rate': 0.005, 'cruise_speed': 3.0, 'color': '#6b7280'},
    'Deer': {'top_speed': 17.0, 'acceleration': 6.0, 'stamina': 120,
             'recovery_rate': 0.012, 'cruise_speed': 6.0, 'color': '#a855f7'},
    'Elephant': {'top_speed': 11.0, 'acceleration': 2.0, 'stamina': 60,
                 'recovery_rate': 0.003, 'cruise_speed': 2.5, 'color': '#3b82f6'},
    'Wild Dog': {'top_speed': 16.0, 'acceleration': 5.0, 'stamina': 600,
                 'recovery_rate': 0.02, 'cruise_speed': 8.0, 'color': '#ef4444'},
}

# --- Terrain vulnerability matrix ---
# terrain_vulnerability[animal][terrain] = speed multiplier (0-1)
terrain_vulnerability = {
    'Hare':     {'flat': 1.0, 'grass': 0.4, 'mud': 0.3, 'uphill': 0.7},
    'Tortoise': {'flat': 1.0, 'grass': 0.8, 'mud': 0.9, 'uphill': 0.5},
    'Rhino':    {'flat': 1.0, 'grass': 1.0, 'mud': 0.6, 'uphill': 0.4},
    'Deer':     {'flat': 1.0, 'grass': 0.7, 'mud': 0.5, 'uphill': 0.8},
    'Elephant': {'flat': 1.0, 'grass': 1.0, 'mud': 0.5, 'uphill': 0.3},
    'Wild Dog': {'flat': 1.0, 'grass': 0.6, 'mud': 0.7, 'uphill': 0.8},
}

# --- Define the Pobitora course (2 km) ---
# Segments: (start_m, end_m, terrain_type)
course_segments = [
    (0, 400, 'flat'),         # Open ground from the banyan tree
    (400, 800, 'grass'),      # Elephant grass section
    (800, 1200, 'flat'),      # Open savanna
    (1200, 1500, 'uphill'),   # Hill before the waterhole
    (1500, 1800, 'mud'),      # Muddy approach to waterhole
    (1800, 2000, 'flat'),     # Final stretch to waterhole
]

def get_terrain_at(position):
    for start, end, terrain in course_segments:
        if start <= position < end:
            return terrain
    return 'flat'

def simulate_terrain_race(animal_name, animal_data, race_distance=2000, dt=1.0):
    a = animal_data
    tv = terrain_vulnerability[animal_name]
    times, positions, velocities, terrains_hit = [0.0], [0.0], [0.0], ['flat']
    t, x, v, stam = 0.0, 0.0, 0.0, a['stamina']
    max_stam = a['stamina']

    while x < race_distance and t < 80000:
        t += dt
        terrain = get_terrain_at(x)
        t_factor = tv[terrain]

        if stam > 0:
            v_target = a['top_speed'] * t_factor
            v = min(v + a['acceleration'] * dt, v_target)
            stam = max(0, stam - dt)
        else:
            v = a['cruise_speed'] * t_factor
            stam = min(max_stam, stam + a['recovery_rate'] * max_stam * dt)

        x += v * dt
        times.append(t)
        positions.append(min(x, race_distance))
        velocities.append(v)
        terrains_hit.append(terrain)

        if x >= race_distance:
            break

    return {'time': np.array(times), 'position': np.array(positions),
            'velocity': np.array(velocities), 'terrains': terrains_hit,
            'finish_time': t}

# Run terrain race
terrain_results = {}
for name, data in animals.items():
    terrain_results[name] = simulate_terrain_race(name, data)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pobitora Race with Terrain: Banyan Tree to Waterhole (2 km)',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Course terrain map
ax = axes[0, 0]
terrain_colors = {'flat': '#22c55e', 'grass': '#065f46', 'mud': '#78350f', 'uphill': '#7c3aed'}
for start, end, terrain in course_segments:
    ax.barh(0, end - start, left=start, height=0.6,
            color=terrain_colors[terrain], edgecolor='none', alpha=0.8)
    ax.text((start + end) / 2, 0, terrain, ha='center', va='center',
            color='white', fontsize=10, fontweight='bold')
ax.set_xlim(0, 2000)
ax.set_yticks([])
ax.set_xlabel('Distance along course (m)', color='white')
ax.set_title('Course Profile', color='white', fontsize=11)

# Plot 2: Position vs time (fast animals, first 400s)
ax = axes[0, 1]
for name, r in terrain_results.items():
    if name == 'Tortoise':
        continue
    mask = r['time'] <= 400
    ax.plot(r['time'][mask], r['position'][mask], color=animals[name]['color'],
            linewidth=2, label=f"{name} ({r['finish_time']:.0f}s)")
# Shade terrain zones
for start, end, terrain in course_segments:
    ax.axhspan(start, end, alpha=0.08, color=terrain_colors[terrain])
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Position (m)', color='white')
ax.set_title('Position vs Time (with terrain)', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Speed through terrain (hare vs wild dog)
ax = axes[0, 2]
for name in ['Hare', 'Wild Dog']:
    r = terrain_results[name]
    mask = r['time'] <= 400
    ax.plot(r['time'][mask], np.array(r['velocity'])[mask] * 3.6,
            color=animals[name]['color'], linewidth=1.5, label=name)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Speed (km/h)', color='white')
ax.set_title('Speed Through Terrain Zones', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Terrain impact — time spent in each zone
ax = axes[1, 0]
zone_names = [f'{s[2]} ({s[0]}-{s[1]}m)' for s in course_segments]
x_pos = np.arange(len(zone_names))
width = 0.12
for i, (name, r) in enumerate(terrain_results.items()):
    if name == 'Tortoise':
        continue
    zone_times = []
    pos = r['position']
    t = r['time']
    for start, end, terrain in course_segments:
        in_zone = np.where((pos >= start) & (pos < end))[0]
        if len(in_zone) > 0:
            zone_times.append(t[in_zone[-1]] - t[in_zone[0]])
        else:
            zone_times.append(0)
    offset = (i - 2.5) * width
    ax.bar(x_pos + offset, zone_times, width, color=animals[name]['color'],
           label=name, edgecolor='none')
ax.set_xticks(x_pos)
ax.set_xticklabels([s[2] for s in course_segments], color='white', fontsize=9)
ax.set_ylabel('Time in zone (s)', color='white')
ax.set_title('Time Spent in Each Terrain Zone', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Finish time comparison (flat vs terrain)
ax = axes[1, 1]
from collections import OrderedDict
flat_results = {}
for name, data in animals.items():
    # Simulate flat race for comparison
    tv_flat = {k: 1.0 for k in ['flat', 'grass', 'mud', 'uphill']}
    a = data
    t, x, v, stam = 0.0, 0.0, 0.0, a['stamina']
    max_stam = a['stamina']
    while x < 2000 and t < 80000:
        t += 1.0
        if stam > 0:
            v = min(v + a['acceleration'], a['top_speed'])
            stam = max(0, stam - 1)
        else:
            v = a['cruise_speed']
            stam = min(max_stam, stam + a['recovery_rate'] * max_stam)
        x += v
    flat_results[name] = t

sorted_names = sorted(terrain_results.keys(),
    key=lambda n: terrain_results[n]['finish_time'])
sorted_names_no_tort = [n for n in sorted_names if n != 'Tortoise']
y_pos = np.arange(len(sorted_names_no_tort))
flat_times = [flat_results[n] for n in sorted_names_no_tort]
terr_times = [terrain_results[n]['finish_time'] for n in sorted_names_no_tort]
ax.barh(y_pos - 0.2, flat_times, 0.35, color='#3b82f6', label='Flat course')
ax.barh(y_pos + 0.2, terr_times, 0.35, color='#ef4444', label='Terrain course')
ax.set_yticks(y_pos)
ax.set_yticklabels(sorted_names_no_tort, color='white')
ax.set_xlabel('Finish time (seconds)', color='white')
ax.set_title('Flat vs Terrain Course', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
sorted_all = sorted(terrain_results.keys(),
    key=lambda n: terrain_results[n]['finish_time'])
text = "Terrain Race Results (2 km)\\n" + "=" * 32 + "\\n\\n"
for rank, name in enumerate(sorted_all, 1):
    ft = terrain_results[name]['finish_time']
    label = f'{ft:.0f}s' if ft < 3600 else f'{ft/3600:.1f}h'
    penalty = ft / flat_results[name]
    text += f"#{rank} {name:12s} {label:>8} ({penalty:.1f}x flat)\\n"
text += "\\nTerrain changes the ranking!\\n"
text += "Mud and grass penalize the hare\\n"
text += "far more than the tortoise.\\n\\n"
text += "Next: sweep race distances to\\n"
text += "find all crossover points."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Terrain model complete. The course changes everything.")
print("The hare's terrain penalty is much larger than the tortoise's.")
print("Next: systematic distance sweep to find crossover points.")`,
      challenge: 'Add a "river crossing" terrain segment where swimming ability matters. The tortoise can swim (0.8 factor), the hare cannot swim (0.1 factor, mostly thrashing), and the rhino wades through (0.7 factor). How does this affect rankings?',
      successHint: 'Terrain transforms the race from a pure speed contest into an ecological puzzle. The "best" animal depends not just on distance but on what the course looks like. This is exactly why diverse body plans persist in nature: each is optimized for different habitat structures.',
    },
    {
      title: 'Multi-Distance Analysis: Finding Crossover Points',
      concept: `The central question of the capstone is: **at what distance does each animal overtake the others?** A crossover point is a distance where two animals swap rank. Below the crossover, animal A wins; above it, animal B wins. Finding all crossover points reveals the full competitive landscape.

We answer this by running the simulator at many distances: 100 m, 200 m, 500 m, 1 km, 2 km, 5 km, 10 km, 20 km, and 50 km. At each distance, we record every animal's finish time and rank. The result is a **rank-vs-distance chart** that shows how the leaderboard shifts as the race gets longer.

The mathematical structure is revealing. At short distances, finish time is dominated by **top speed and acceleration** (kinetic energy scales as mv^2, so fast starters win). At medium distances, **stamina** becomes the bottleneck (the hare runs out of sprint capacity). At long distances, **cruise speed** dominates because all animals have long since exhausted their sprint stamina and are moving at sustainable pace. This creates a three-regime model: sprint-dominated, stamina-dominated, and endurance-dominated.

The crossover distances are not arbitrary. They emerge from the physics. The hare-to-wild-dog crossover occurs at roughly the distance where the hare's stamina runs out and it must cruise (top_speed * stamina / average_speed). The wild-dog-to-deer crossover occurs when the deer's superior cruise-to-sprint ratio pays off over very long distances.`,
      analogy: 'Multi-distance analysis is like comparing three types of vehicles. A sports car wins a drag race (short distance). A sedan wins a cross-country drive (medium distance, balanced performance). A diesel truck wins a transcontinental haul (long distance, fuel efficiency). No vehicle is "best" in absolute terms. The crossover distances are where you should switch your choice of vehicle.',
      storyConnection: 'The Pobitora race was roughly 2 km. At that distance, terrain effects and stamina matter enormously. If the race had been 50 metres, Khargosh would have won easily. If it had been 50 km, the wild dogs of the sanctuary would dominate. The story happened to pick a distance that made the tortoise competitive, but our analysis reveals the full picture.',
      checkQuestion: 'If the hare has top speed 20 m/s, stamina 45 seconds, and cruise speed 5 m/s, and the wild dog has top speed 16 m/s, stamina 600 seconds, and cruise speed 8 m/s, at roughly what distance do they tie?',
      checkAnswer: 'The hare sprints ~875 m in 45 seconds, then cruises at 5 m/s. The wild dog sprints at 16 m/s for 600 seconds, covering 9600 m before cruising. So up to about 875 m the hare leads. After that the wild dog at 16 m/s overtakes the hare at 5 m/s very quickly. The crossover is somewhere around 900-1000 m, where the hare has just exhausted its stamina and the wild dog is still sprinting past.',
      codeIntro: 'Sweep across race distances from 100 m to 50 km and map all crossover points.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Animal data and simulator ---
animals = {
    'Hare': {'top_speed': 20.0, 'acceleration': 8.0, 'stamina': 45,
             'recovery_rate': 0.008, 'cruise_speed': 5.0, 'color': '#22c55e'},
    'Tortoise': {'top_speed': 0.28, 'acceleration': 0.1, 'stamina': 99999,
                 'recovery_rate': 1.0, 'cruise_speed': 0.22, 'color': '#f59e0b'},
    'Rhino': {'top_speed': 12.5, 'acceleration': 3.0, 'stamina': 30,
              'recovery_rate': 0.005, 'cruise_speed': 3.0, 'color': '#6b7280'},
    'Deer': {'top_speed': 17.0, 'acceleration': 6.0, 'stamina': 120,
             'recovery_rate': 0.012, 'cruise_speed': 6.0, 'color': '#a855f7'},
    'Elephant': {'top_speed': 11.0, 'acceleration': 2.0, 'stamina': 60,
                 'recovery_rate': 0.003, 'cruise_speed': 2.5, 'color': '#3b82f6'},
    'Wild Dog': {'top_speed': 16.0, 'acceleration': 5.0, 'stamina': 600,
                 'recovery_rate': 0.02, 'cruise_speed': 8.0, 'color': '#ef4444'},
}

def sim_flat(animal_data, dist, dt=1.0):
    a = animal_data
    t, x, v, stam = 0.0, 0.0, 0.0, a['stamina']
    max_stam = a['stamina']
    while x < dist and t < 200000:
        t += dt
        if stam > 0:
            v = min(v + a['acceleration'] * dt, a['top_speed'])
            stam = max(0, stam - dt)
        else:
            v = a['cruise_speed']
            stam = min(max_stam, stam + a['recovery_rate'] * max_stam * dt)
        x += v * dt
        if x >= dist:
            break
    return t

# --- Multi-distance sweep ---
distances = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]
names = list(animals.keys())
finish_times = {name: [] for name in names}

print("Running multi-distance sweep...")
for dist in distances:
    for name in names:
        ft = sim_flat(animals[name], dist)
        finish_times[name].append(ft)

# Compute ranks at each distance
ranks = {name: [] for name in names}
for di in range(len(distances)):
    times_at_dist = [(name, finish_times[name][di]) for name in names]
    times_at_dist.sort(key=lambda x: x[1])
    for rank, (name, _) in enumerate(times_at_dist, 1):
        ranks[name].append(rank)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Multi-Distance Analysis: Who Wins at Every Distance?',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Finish time vs distance (log-log)
ax = axes[0, 0]
for name in names:
    ax.loglog(distances, finish_times[name], 'o-', color=animals[name]['color'],
              linewidth=2, markersize=5, label=name)
ax.set_xlabel('Race distance (m)', color='white')
ax.set_ylabel('Finish time (s)', color='white')
ax.set_title('Finish Time vs Distance', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15, color='gray')

# Plot 2: Average speed vs distance
ax = axes[0, 1]
for name in names:
    avg_speeds = [d / t * 3.6 for d, t in zip(distances, finish_times[name])]
    ax.semilogx(distances, avg_speeds, 'o-', color=animals[name]['color'],
                linewidth=2, markersize=5, label=name)
ax.set_xlabel('Race distance (m)', color='white')
ax.set_ylabel('Average speed (km/h)', color='white')
ax.set_title('Average Speed vs Distance', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15, color='gray')

# Plot 3: Rank vs distance
ax = axes[0, 2]
for name in names:
    ax.plot(range(len(distances)), ranks[name], 'o-', color=animals[name]['color'],
            linewidth=2.5, markersize=8, label=name)
ax.set_xticks(range(len(distances)))
ax.set_xticklabels([f'{d/1000:.0f}km' if d >= 1000 else f'{d}m' for d in distances],
                   color='white', fontsize=8, rotation=30)
ax.set_ylabel('Rank (1 = winner)', color='white')
ax.set_title('Rankings Shift With Distance', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_yaxis()
ax.grid(True, alpha=0.15, color='gray')

# Plot 4: Hare vs Wild Dog — crossover detail
ax = axes[1, 0]
fine_dists = np.arange(100, 5001, 100)
hare_times = [sim_flat(animals['Hare'], d) for d in fine_dists]
dog_times = [sim_flat(animals['Wild Dog'], d) for d in fine_dists]
ax.plot(fine_dists, hare_times, color=animals['Hare']['color'], linewidth=2, label='Hare')
ax.plot(fine_dists, dog_times, color=animals['Wild Dog']['color'], linewidth=2, label='Wild Dog')
# Find crossover
diff = np.array(hare_times) - np.array(dog_times)
crossover_idx = np.where(np.diff(np.sign(diff)))[0]
if len(crossover_idx) > 0:
    cx = fine_dists[crossover_idx[0]]
    ax.axvline(cx, color='#f59e0b', linestyle='--', linewidth=1.5)
    ax.annotate(f'Crossover: {cx}m', xy=(cx, hare_times[crossover_idx[0]]),
                xytext=(cx + 500, hare_times[crossover_idx[0]] * 1.5),
                color='#f59e0b', fontsize=10,
                arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Finish time (s)', color='white')
ax.set_title('Hare vs Wild Dog: Crossover', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Winner at each distance
ax = axes[1, 1]
winners = []
for di in range(len(distances)):
    best_name = min(names, key=lambda n: finish_times[n][di])
    winners.append(best_name)
winner_colors = [animals[w]['color'] for w in winners]
bars = ax.bar(range(len(distances)), [1]*len(distances), color=winner_colors, edgecolor='none')
ax.set_xticks(range(len(distances)))
ax.set_xticklabels([f'{d/1000:.0f}km' if d >= 1000 else f'{d}m' for d in distances],
                   color='white', fontsize=8, rotation=30)
ax.set_yticks([])
for i, w in enumerate(winners):
    ax.text(i, 0.5, w, ha='center', va='center', color='white',
            fontsize=10, fontweight='bold', rotation=45)
ax.set_title('Winner at Each Distance', color='white', fontsize=11)

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = "Multi-Distance Results\\n" + "=" * 30 + "\\n\\n"
text += "Distance -> Winner\\n" + "-" * 25 + "\\n"
for di, d in enumerate(distances):
    w = winners[di]
    ft = finish_times[w][di]
    label = f'{d/1000:.0f} km' if d >= 1000 else f'{d} m'
    ft_label = f'{ft:.0f}s' if ft < 3600 else f'{ft/3600:.1f}h'
    text += f"  {label:>8} : {w:12s} ({ft_label})\\n"
text += "\\nThree regimes:\\n"
text += " Short: acceleration wins\\n"
text += " Medium: stamina wins\\n"
text += " Long: cruise speed wins\\n\\n"
text += "Next: assemble the complete\\n"
text += "race simulator dashboard."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Multi-distance sweep complete.")
for di, d in enumerate(distances):
    w = winners[di]
    label = f'{d/1000:.0f} km' if d >= 1000 else f'{d} m'
    print(f"  {label}: {w} wins")
print("\\nThe tortoise never wins on a flat course (too slow).")
print("But add terrain, and the story changes completely.")`,
      challenge: 'Run the same sweep with the terrain model from Lesson 3. Does the tortoise ever beat the hare on the Pobitora course? At what distance? How does terrain shift each crossover point compared to the flat course?',
      successHint: 'The multi-distance analysis reveals the fundamental truth of the story: speed is not a single number. Every animal has a distance regime where it dominates. The "best" animal depends entirely on the race conditions, exactly as ecology predicts.',
    },
    {
      title: 'Sensitivity Analysis: What Matters Most?',
      concept: `With the simulator built, we can ask a deeper question: **which parameter matters most for winning?** Sensitivity analysis systematically varies one parameter at a time while holding the others constant, and measures how much the outcome changes.

For our race simulator, the parameters are: top speed, acceleration, stamina, recovery rate, and cruise speed. We take the hare's profile as a baseline and perturb each parameter by plus and minus 20%. If a 20% increase in stamina reduces finish time by 30% but a 20% increase in top speed reduces it by only 5%, then stamina is the more important parameter at that race distance. The **sensitivity coefficient** is the fractional change in outcome divided by the fractional change in input.

The beautiful result is that sensitivity depends on distance. At short distances, the model is most sensitive to acceleration and top speed (sprint regime). At medium distances, it becomes most sensitive to stamina (fatigue regime). At long distances, cruise speed dominates everything else (endurance regime). This confirms our three-regime model quantitatively.

Sensitivity analysis also reveals **diminishing returns**. Doubling the hare's stamina from 45 to 90 seconds helps enormously at 2 km but barely matters at 100 m. There is no point optimizing a parameter that does not matter at your target distance. This is a general engineering principle: measure sensitivity before optimizing.`,
      analogy: 'Sensitivity analysis is like a doctor running blood tests. If a patient has a fever, the doctor does not test everything at once. She checks the most likely causes first and measures how much each one explains the symptom. Our "patient" is the race outcome, and the "tests" are parameter perturbations. We find out which variable is the fever is most sensitive to.',
      storyConnection: 'If Khargosh could change one thing about himself to win the Pobitora race, what should it be? More speed? Better endurance? Our sensitivity analysis will answer this precisely. Spoiler: at 2 km, stamina improvement gives the biggest payoff. The hare does not need to be faster; it needs to last longer.',
      checkQuestion: 'If increasing the hare\'s stamina by 20% reduces its 2 km finish time by 15%, and increasing its top speed by 20% reduces finish time by 3%, what are the sensitivity coefficients and what do they tell us?',
      checkAnswer: 'Sensitivity coefficient = (fractional change in output) / (fractional change in input). For stamina: 0.15 / 0.20 = 0.75. For top speed: 0.03 / 0.20 = 0.15. Stamina has 5x higher sensitivity than top speed at 2 km. This means the hare should invest in endurance training, not sprint practice. It tells us that the binding constraint at 2 km is fatigue, not peak velocity.',
      codeIntro: 'Run parameter sensitivity analysis across multiple race distances and identify what matters most for each animal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Core simulator ---
def sim_race(top_speed, accel, stamina, recovery, cruise, dist, dt=1.0):
    t, x, v, stam = 0.0, 0.0, 0.0, stamina
    while x < dist and t < 200000:
        t += dt
        if stam > 0:
            v = min(v + accel * dt, top_speed)
            stam = max(0, stam - dt)
        else:
            v = cruise
            stam = min(stamina, stam + recovery * stamina * dt)
        x += v * dt
        if x >= dist:
            break
    return t

# --- Hare baseline ---
base = {'top_speed': 20.0, 'accel': 8.0, 'stamina': 45.0,
        'recovery': 0.008, 'cruise': 5.0}
param_names = list(base.keys())
param_labels = ['Top Speed', 'Acceleration', 'Stamina', 'Recovery Rate', 'Cruise Speed']
param_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']

# Perturbation range
perturbations = np.linspace(-0.4, 0.4, 17)  # -40% to +40%
test_distances = [200, 1000, 5000, 20000]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sensitivity Analysis: What Matters Most for the Hare?',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1-4: Sensitivity at each distance
for di, dist in enumerate(test_distances):
    ax = axes.flat[di]
    base_time = sim_race(base['top_speed'], base['accel'], base['stamina'],
                         base['recovery'], base['cruise'], dist)

    for pi, param in enumerate(param_names):
        time_changes = []
        for pert in perturbations:
            params = base.copy()
            params[param] = base[param] * (1 + pert)
            if params[param] <= 0:
                params[param] = base[param] * 0.01
            ft = sim_race(params['top_speed'], params['accel'], params['stamina'],
                         params['recovery'], params['cruise'], dist)
            time_changes.append((ft - base_time) / base_time * 100)

        ax.plot(perturbations * 100, time_changes, color=param_colors[pi],
                linewidth=2, label=param_labels[pi])

    ax.axhline(0, color='gray', linestyle=':', alpha=0.5)
    ax.axvline(0, color='gray', linestyle=':', alpha=0.5)
    d_label = f'{dist/1000:.0f} km' if dist >= 1000 else f'{dist} m'
    ax.set_title(f'Sensitivity at {d_label}', color='white', fontsize=11)
    ax.set_xlabel('Parameter change (%)', color='white', fontsize=9)
    ax.set_ylabel('Finish time change (%)', color='white', fontsize=9)
    if di == 0:
        ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Sensitivity coefficients vs distance
ax = axes[1, 1]
sweep_dists = [100, 200, 500, 1000, 2000, 5000, 10000, 20000]
sensitivities = {p: [] for p in param_names}

for dist in sweep_dists:
    base_time = sim_race(base['top_speed'], base['accel'], base['stamina'],
                         base['recovery'], base['cruise'], dist)
    for param in param_names:
        params_up = base.copy()
        params_up[param] = base[param] * 1.2
        ft_up = sim_race(params_up['top_speed'], params_up['accel'], params_up['stamina'],
                        params_up['recovery'], params_up['cruise'], dist)
        sensitivity = abs((ft_up - base_time) / base_time) / 0.2
        sensitivities[param].append(sensitivity)

for pi, param in enumerate(param_names):
    ax.semilogx(sweep_dists, sensitivities[param], 'o-', color=param_colors[pi],
                linewidth=2, markersize=5, label=param_labels[pi])
ax.set_xlabel('Race distance (m)', color='white')
ax.set_ylabel('Sensitivity coefficient', color='white')
ax.set_title('What Matters Changes With Distance', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15, color='gray')

# Plot 6: Dominant parameter at each distance
ax = axes[1, 2]
ax.axis('off')
text = "Sensitivity Summary (Hare)\\n" + "=" * 35 + "\\n\\n"
text += "What matters most at each distance:\\n"
text += "-" * 35 + "\\n"
for di, dist in enumerate(sweep_dists):
    max_param = max(param_names, key=lambda p: sensitivities[p][di])
    max_val = sensitivities[max_param][di]
    label_idx = param_names.index(max_param)
    d_label = f'{dist/1000:.0f} km' if dist >= 1000 else f'{dist} m'
    text += f"  {d_label:>8}: {param_labels[label_idx]:16s} ({max_val:.2f})\\n"

text += "\\nThree regimes confirmed:\\n"
text += " <500m:  Speed + Acceleration\\n"
text += " 1-5km:  Stamina dominates\\n"
text += " >10km:  Cruise speed is king\\n\\n"
text += "Advice for Khargosh:\\n"
text += " Train endurance, not sprinting!"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Sensitivity analysis complete.")
print("At 200m, top speed matters most (sprint regime).")
print("At 2 km, stamina matters most (fatigue regime).")
print("At 20 km, cruise speed matters most (endurance regime).")
print("Next: combine everything into the final race dashboard.")`,
      challenge: 'Run the same sensitivity analysis for the wild dog. Is its dominant parameter different from the hare\'s? At what distance does the wild dog\'s sensitivity profile change most dramatically?',
      successHint: 'Sensitivity analysis converts intuition into numbers. Everyone "knows" that endurance matters for long races, but now you know exactly how much and at exactly which distances each parameter dominates. This is how engineers make decisions: quantify trade-offs, then optimize the parameter that matters.',
    },
    {
      title: 'Race Dashboard: Complete Simulator with Comparisons',
      concept: `The final lesson integrates everything into a **complete race dashboard** that a wildlife biologist could use to explore animal movement trade-offs. The dashboard combines the animal database, the physics engine with terrain, the multi-distance analysis, and the sensitivity results into a single comprehensive visualization.

A good dashboard answers multiple questions simultaneously. Our four panels answer: (1) "Who wins this specific race?" with a position-vs-time animation chart showing the current race. (2) "How does the ranking change with distance?" with the crossover analysis showing regime transitions. (3) "What if conditions change?" with a terrain impact comparison. (4) "What should each animal improve?" with a per-animal sensitivity breakdown.

The dashboard also generates a **race report card** for each animal, summarizing its strengths, weaknesses, optimal race distance, and the single parameter improvement that would help it most. This is the deliverable: not just a simulation, but an analysis tool that produces actionable insights.

Packaging the capstone means clean code structure. The animal database, physics engine, terrain model, and analysis functions are each self-contained. The dashboard simply calls these modules and arranges the outputs. This modular design means you could swap in a new animal, a new terrain type, or a new analysis without rewriting the rest.`,
      analogy: 'The final dashboard is like the summary page of a medical checkup. The doctor does not hand you raw blood test numbers. She gives you a report: your cholesterol is high (strength: low), your blood pressure is normal (no action needed), and you should exercise more (recommendation). Our dashboard gives each animal a similar "health report" for racing ability.',
      storyConnection: 'Imagine Pobitora Wildlife Sanctuary using this dashboard to understand animal movement patterns. The park rangers could input terrain conditions and distances to predict which animals use which corridors. The tortoise\'s "victory" in the story is not a fairy tale — it is a prediction that falls out of the physics when you set the right race distance and terrain. Our simulator proves the story was scientifically plausible all along.',
      checkQuestion: 'If you wanted to extend this simulator to predict real wildlife corridor usage, what additional data would you need beyond what we have modeled?',
      checkAnswer: 'You would need: (1) actual GPS tracking data from tagged animals to calibrate the movement parameters, (2) detailed habitat maps showing vegetation density, water features, and elevation at fine resolution, (3) seasonal variation data (monsoon mud vs dry season, food availability), (4) predator-prey interaction zones that affect route choice, and (5) time-of-day activity patterns (nocturnal vs diurnal movement). Our simulator provides the physics framework; these data fill in the real-world specifics.',
      codeIntro: 'Build the complete race dashboard combining all components into a deployable analysis tool.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ====================================================
# POBITORA RACE SIMULATOR — Complete Dashboard
# ====================================================

# --- Animal Database ---
animals = {
    'Hare': {'top_speed': 20.0, 'acceleration': 8.0, 'stamina': 45,
             'recovery_rate': 0.008, 'cruise_speed': 5.0, 'color': '#22c55e',
             'weight_kg': 3.5},
    'Tortoise': {'top_speed': 0.28, 'acceleration': 0.1, 'stamina': 99999,
                 'recovery_rate': 1.0, 'cruise_speed': 0.22, 'color': '#f59e0b',
                 'weight_kg': 8.0},
    'Rhino': {'top_speed': 12.5, 'acceleration': 3.0, 'stamina': 30,
              'recovery_rate': 0.005, 'cruise_speed': 3.0, 'color': '#6b7280',
              'weight_kg': 2000},
    'Deer': {'top_speed': 17.0, 'acceleration': 6.0, 'stamina': 120,
             'recovery_rate': 0.012, 'cruise_speed': 6.0, 'color': '#a855f7',
             'weight_kg': 50},
    'Elephant': {'top_speed': 11.0, 'acceleration': 2.0, 'stamina': 60,
                 'recovery_rate': 0.003, 'cruise_speed': 2.5, 'color': '#3b82f6',
                 'weight_kg': 4000},
    'Wild Dog': {'top_speed': 16.0, 'acceleration': 5.0, 'stamina': 600,
                 'recovery_rate': 0.02, 'cruise_speed': 8.0, 'color': '#ef4444',
                 'weight_kg': 25},
}

terrain_vulnerability = {
    'Hare':     {'flat': 1.0, 'grass': 0.4, 'mud': 0.3, 'uphill': 0.7},
    'Tortoise': {'flat': 1.0, 'grass': 0.8, 'mud': 0.9, 'uphill': 0.5},
    'Rhino':    {'flat': 1.0, 'grass': 1.0, 'mud': 0.6, 'uphill': 0.4},
    'Deer':     {'flat': 1.0, 'grass': 0.7, 'mud': 0.5, 'uphill': 0.8},
    'Elephant': {'flat': 1.0, 'grass': 1.0, 'mud': 0.5, 'uphill': 0.3},
    'Wild Dog': {'flat': 1.0, 'grass': 0.6, 'mud': 0.7, 'uphill': 0.8},
}

course = [(0, 400, 'flat'), (400, 800, 'grass'), (800, 1200, 'flat'),
          (1200, 1500, 'uphill'), (1500, 1800, 'mud'), (1800, 2000, 'flat')]

def get_terrain(pos):
    for s, e, t in course:
        if s <= pos < e:
            return t
    return 'flat'

# --- Physics Engine ---
def simulate(name, dist, use_terrain=True, dt=1.0):
    a = animals[name]
    tv = terrain_vulnerability[name] if use_terrain else {k: 1.0 for k in ['flat','grass','mud','uphill']}
    times, positions, velocities = [0.0], [0.0], [0.0]
    t, x, v, stam = 0.0, 0.0, 0.0, a['stamina']
    max_stam = a['stamina']
    while x < dist and t < 200000:
        t += dt
        tf = tv[get_terrain(x)] if use_terrain else 1.0
        if stam > 0:
            v = min(v + a['acceleration'] * dt, a['top_speed'] * tf)
            stam = max(0, stam - dt)
        else:
            v = a['cruise_speed'] * tf
            stam = min(max_stam, stam + a['recovery_rate'] * max_stam * dt)
        x += v * dt
        times.append(t); positions.append(min(x, dist)); velocities.append(v)
        if x >= dist: break
    return {'time': np.array(times), 'position': np.array(positions),
            'velocity': np.array(velocities), 'finish_time': t}

# ---- RUN ALL ANALYSES ----
names = list(animals.keys())
race_dist = 2000

# 1. Terrain race
terrain_results = {n: simulate(n, race_dist, True) for n in names}
flat_results = {n: simulate(n, race_dist, False) for n in names}

# 2. Multi-distance
check_dists = [100, 500, 2000, 10000, 50000]
dist_winners = {}
for d in check_dists:
    times_d = {n: simulate(n, d, False)['finish_time'] for n in names}
    dist_winners[d] = min(names, key=lambda n: times_d[n])

# 3. Sensitivity (hare at 2 km)
base_params = {'top_speed': 20.0, 'accel': 8.0, 'stamina': 45.0,
               'recovery': 0.008, 'cruise': 5.0}
def sim_params(ts, ac, st, rc, cr, dist):
    t, x, v, stam = 0.0, 0.0, 0.0, st
    while x < dist and t < 200000:
        t += 1.0
        if stam > 0:
            v = min(v + ac, ts); stam = max(0, stam - 1)
        else:
            v = cr; stam = min(st, stam + rc * st)
        x += v
        if x >= dist: break
    return t

base_t = sim_params(20, 8, 45, 0.008, 5, 2000)
sens_labels = ['Top Speed', 'Accel', 'Stamina', 'Recovery', 'Cruise']
sens_values = []
for i, (param, val) in enumerate(base_params.items()):
    p = dict(base_params)
    p[param] = val * 1.2
    ft = sim_params(p['top_speed'], p['accel'], p['stamina'], p['recovery'], p['cruise'], 2000)
    sens_values.append(abs((ft - base_t) / base_t) / 0.2)

# ---- DASHBOARD ----
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pobitora Race Simulator — Complete Dashboard',
             color='white', fontsize=15, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: The 2 km terrain race
ax = axes[0, 0]
for name in names:
    r = terrain_results[name]
    if name == 'Tortoise':
        continue
    mask = r['time'] <= 500
    ax.plot(r['time'][mask], r['position'][mask],
            color=animals[name]['color'], linewidth=2, label=name)
for s, e, t in course:
    tc = {'flat': '#22c55e', 'grass': '#065f46', 'mud': '#78350f', 'uphill': '#7c3aed'}
    ax.axhspan(s, e, alpha=0.06, color=tc[t])
ax.axhline(race_dist, color='gray', linestyle=':', alpha=0.5)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Position (m)', color='white')
ax.set_title('2 km Terrain Race', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Winner at each distance
ax = axes[0, 1]
d_labels = [f'{d/1000:.0f}km' if d >= 1000 else f'{d}m' for d in check_dists]
w_colors = [animals[dist_winners[d]]['color'] for d in check_dists]
bars = ax.bar(range(len(check_dists)), [1]*len(check_dists), color=w_colors, edgecolor='none')
for i, d in enumerate(check_dists):
    ax.text(i, 0.5, dist_winners[d], ha='center', va='center',
            color='white', fontsize=11, fontweight='bold', rotation=45)
ax.set_xticks(range(len(check_dists)))
ax.set_xticklabels(d_labels, color='white', fontsize=10)
ax.set_yticks([])
ax.set_title('Winner at Each Distance', color='white', fontsize=11)

# Panel 3: Flat vs terrain impact
ax = axes[0, 2]
sorted_n = sorted([n for n in names if n != 'Tortoise'],
    key=lambda n: terrain_results[n]['finish_time'])
y_pos = np.arange(len(sorted_n))
ft_flat = [flat_results[n]['finish_time'] for n in sorted_n]
ft_terr = [terrain_results[n]['finish_time'] for n in sorted_n]
ax.barh(y_pos - 0.2, ft_flat, 0.35, color='#3b82f6', label='Flat', edgecolor='none')
ax.barh(y_pos + 0.2, ft_terr, 0.35, color='#ef4444', label='Terrain', edgecolor='none')
ax.set_yticks(y_pos)
ax.set_yticklabels(sorted_n, color='white')
ax.set_xlabel('Finish time (s)', color='white')
ax.set_title('Terrain Impact', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 4: Sensitivity (hare at 2 km)
ax = axes[1, 0]
s_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
bars = ax.barh(sens_labels, sens_values, color=s_colors, edgecolor='none')
for bar, sv in zip(bars, sens_values):
    ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height()/2,
            f'{sv:.2f}', va='center', color='white', fontsize=10)
ax.set_xlabel('Sensitivity coefficient', color='white')
ax.set_title('Hare Sensitivity at 2 km', color='white', fontsize=11)

# Panel 5: Speed profiles through terrain
ax = axes[1, 1]
for name in ['Hare', 'Wild Dog', 'Deer']:
    r = terrain_results[name]
    mask = r['time'] <= 400
    ax.plot(r['time'][mask], np.array(r['velocity'])[mask] * 3.6,
            color=animals[name]['color'], linewidth=1.5, label=name)
ax.set_xlabel('Time (s)', color='white')
ax.set_ylabel('Speed (km/h)', color='white')
ax.set_title('Speed Through Terrain', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 6: Race report card
ax = axes[1, 2]
ax.axis('off')
t_sorted = sorted(names, key=lambda n: terrain_results[n]['finish_time'])
text = "RACE REPORT CARD (2 km terrain)\\n"
text += "=" * 36 + "\\n\\n"
for rank, name in enumerate(t_sorted, 1):
    ft = terrain_results[name]['finish_time']
    ft_label = f'{ft:.0f}s' if ft < 3600 else f'{ft/3600:.1f}h'
    ts = animals[name]['top_speed'] * 3.6
    cs = animals[name]['cruise_speed'] * 3.6
    text += f"#{rank} {name:10s} {ft_label:>8}\\n"
    text += f"   sprint {ts:.0f} km/h, cruise {cs:.0f} km/h\\n"

text += "\\nKhargosh's lesson: stamina, not\\n"
text += "speed, wins the 2 km Pobitora race.\\n"
text += "Kaaso knew the terrain — and that\\n"
text += "knowledge beats raw speed every time."
ax.text(0.02, 0.97, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

# --- Final Summary ---
print("=" * 50)
print("POBITORA RACE SIMULATOR — CAPSTONE COMPLETE")
print("=" * 50)
print()
print("Components built:")
print("  1. Animal database (6 species, 6 parameters each)")
print("  2. Physics engine (acceleration, fatigue, recovery)")
print("  3. Terrain model (4 terrain types, species-specific)")
print("  4. Multi-distance analysis (100m to 50km)")
print("  5. Sensitivity analysis (3 distance regimes)")
print("  6. Dashboard (6-panel visualization)")
print()
winner = t_sorted[0]
print(f"2 km terrain race winner: {winner}")
print(f"  The story was right: knowing the ground")
print(f"  matters more than being fast.")`,
      challenge: 'Add a "race designer" feature: given a desired winner, compute the course layout (terrain segments) that would give that animal the best advantage. This is the inverse problem: instead of simulating a given course, optimize the course for a given outcome.',
      successHint: 'You have completed a full capstone: from biomechanical data to physics simulation to multi-variable analysis to an integrated dashboard. The tortoise-and-hare story is not a fairy tale; it is a biomechanical prediction that holds when you set the right distance and terrain. Speed, endurance, and terrain adaptation are three dimensions of a single optimization problem, and nature has explored all of them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Animal Race Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (biomechanics & metabolic science)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build a physics-based race simulator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
