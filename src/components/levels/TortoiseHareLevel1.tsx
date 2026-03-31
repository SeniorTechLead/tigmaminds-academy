import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TortoiseHareLevel1() {
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
      title: 'Speed vs Velocity — what does it mean to be fast?',
      concept: `In the grasslands of Pobitora, the hare bolted ahead while the tortoise crawled steadily. The hare was clearly faster — but what does "faster" actually mean in physics?

**Speed** is how much distance you cover per unit time: speed = distance / time. It's always positive — it doesn't care about direction.

**Velocity** is speed with a direction: 5 m/s *north*. It can be negative (going backwards relative to your chosen direction).

Key difference:
- If the hare runs 100m forward and 100m back, its total distance is 200m but its **displacement** is 0. Its average speed is high, but its average velocity is zero.
- The tortoise walks 100m forward and stays there. Lower speed, but its velocity is consistently positive.

The tortoise won the race because **average velocity toward the finish line** is what matters — not peak speed.`,
      analogy: 'Speed is like the odometer in a car — it just counts total distance traveled. Velocity is like a GPS arrow — it tells you how fast you are getting closer to your destination. You can drive fast in circles (high speed, zero velocity toward your goal) or drive slowly in a straight line (low speed, high effective velocity).',
      storyConnection: 'The hare sprinted, napped, sprinted, wandered — high speed but erratic direction. The tortoise plodded straight to the finish — low speed but perfect velocity alignment. In Pobitora, the one-horned rhinos are like tortoises: slow but purposeful, always moving toward water and grazing grounds.',
      checkQuestion: 'A cheetah runs 500m chasing a gazelle in a zigzag pattern, ending up 300m from where it started. What is its average speed vs. average displacement?',
      checkAnswer: 'Average speed uses total distance: 500m / time. Displacement is only 300m (straight line from start to end). If the chase took 30 seconds, average speed = 16.7 m/s but average velocity magnitude = 10 m/s. The zigzagging "wasted" 200m of running.',
      codeIntro: 'Simulate the tortoise and hare race, comparing speed and velocity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Race parameters
total_time = 60  # seconds
t = np.linspace(0, total_time, 1000)

# Tortoise: constant speed, straight line
tortoise_speed = 0.5  # m/s
tortoise_pos = tortoise_speed * t

# Hare: fast bursts with naps
hare_pos = np.zeros_like(t)
hare_speed_val = 5.0  # m/s when running
for i in range(1, len(t)):
    dt = t[i] - t[i-1]
    phase = t[i] % 20  # 20-second cycles
    if phase < 5:  # sprint for 5s
        hare_pos[i] = hare_pos[i-1] + hare_speed_val * dt
    else:  # nap for 15s
        hare_pos[i] = hare_pos[i-1]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Position vs time
ax1.set_facecolor('#111827')
ax1.plot(t, tortoise_pos, color='#22c55e', linewidth=2, label='Tortoise (steady)')
ax1.plot(t, hare_pos, color='#ef4444', linewidth=2, label='Hare (burst + nap)')
ax1.set_ylabel('Position (m)', color='white')
ax1.set_title('The Pobitora Race: Position vs Time', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Instantaneous speed
tortoise_v = np.gradient(tortoise_pos, t)
hare_v = np.gradient(hare_pos, t)

ax2.set_facecolor('#111827')
ax2.plot(t, tortoise_v, color='#22c55e', linewidth=2, label='Tortoise speed')
ax2.plot(t, hare_v, color='#ef4444', linewidth=2, label='Hare speed')
ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Speed (m/s)', color='white')
ax2.set_title('Instantaneous Speed', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Tortoise: constant {tortoise_speed} m/s, final position = {tortoise_pos[-1]:.1f}m")
print(f"Hare: {hare_speed_val} m/s in bursts, final position = {hare_pos[-1]:.1f}m")
print(f"Winner: {'Tortoise' if tortoise_pos[-1] > hare_pos[-1] else 'Hare'}!")`,
      challenge: 'Change the hare\'s nap time from 15s to 10s (sprint 5s, nap 10s). Does the hare win now? What\'s the minimum nap time for the tortoise to still win?',
      successHint: 'Consistency beats bursts when rest periods are too long. This principle applies to studying, exercise, and even stock market investing — steady compounding beats sporadic windfalls.',
    },
    {
      title: 'Acceleration — speeding up and slowing down',
      concept: `Speed tells you how fast you're going. **Acceleration** tells you how fast your speed is changing.

**Acceleration = change in velocity / change in time** (a = Δv / Δt)

Units: meters per second per second (m/s²). Read it as: "each second, velocity changes by this many m/s."

Positive acceleration = speeding up (hare starting to sprint)
Negative acceleration (deceleration) = slowing down (hare stopping)
Zero acceleration = constant speed (tortoise plodding)

Real examples:
- Cheetah: 0 to 100 km/h in 3 seconds → acceleration ≈ 9.3 m/s² (close to gravity!)
- Indian one-horned rhino: 0 to 55 km/h in about 5 seconds → ≈ 3 m/s²
- Tortoise: barely accelerates — it's at top speed almost instantly because top speed is so low`,
      analogy: 'If speed is how fast you are scrolling through a page, acceleration is how quickly you flick your finger. A gentle flick = low acceleration, slow scroll. A hard flick = high acceleration, fast scroll. Once your finger lifts off, the scroll decelerates (friction slows it down).',
      storyConnection: 'At Pobitora, the hare exploded off the starting line — massive acceleration. But acceleration costs energy. The hare burned through its reserves and had to stop. The tortoise never accelerated hard, so it never needed to stop. In the wild, rhinos use burst acceleration only when threatened — they can\'t sustain it.',
      checkQuestion: 'A car goes from 0 to 60 km/h in 10 seconds. A bicycle goes from 0 to 20 km/h in 4 seconds. Which has greater acceleration?',
      checkAnswer: 'Car: 60 km/h ÷ 10s = 6 km/h/s = 1.67 m/s². Bicycle: 20 km/h ÷ 4s = 5 km/h/s = 1.39 m/s². The car has slightly greater acceleration. But it feels close because the bicycle reaches its modest top speed quite quickly.',
      codeIntro: 'Visualize acceleration profiles of different animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 10, 500)  # 10 seconds

# Animal speed profiles (using tanh for realistic acceleration curves)
# v(t) = v_max * tanh(a * t) where a controls acceleration sharpness
animals = {
    'Cheetah': {'v_max': 30, 'a': 1.2, 'color': '#f59e0b'},
    'Hare': {'v_max': 20, 'a': 0.8, 'color': '#ef4444'},
    'Rhino': {'v_max': 15, 'a': 0.5, 'color': '#8b5cf6'},
    'Tortoise': {'v_max': 0.3, 'a': 2.0, 'color': '#22c55e'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

for name, props in animals.items():
    v = props['v_max'] * np.tanh(props['a'] * t)
    accel = np.gradient(v, t)

    ax1.set_facecolor('#111827')
    ax1.plot(t, v, color=props['color'], linewidth=2, label=f"{name} ({props['v_max']} m/s)")

    ax2.set_facecolor('#111827')
    ax2.plot(t, accel, color=props['color'], linewidth=2, label=name)

ax1.set_ylabel('Speed (m/s)', color='white')
ax1.set_title('Animal Speed Build-up', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Acceleration (m/s\²)', color='white')
ax2.set_title('Acceleration (highest at start, then drops to zero)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Peak accelerations:")
for name, props in animals.items():
    peak_a = props['v_max'] * props['a']
    print(f"  {name}: {peak_a:.1f} m/s\² (reaches {props['v_max']} m/s)")
print()
print("Gravity = 9.8 m/s\²")
print("A cheetah accelerates at ~36 m/s\² peak — nearly 4x gravity!")`,
      challenge: 'Add an elephant to the chart (v_max=11 m/s, a=0.3). How does its acceleration compare to the cheetah? Why might elephants have lower acceleration despite being stronger?',
      successHint: 'Acceleration requires force, and force = mass x acceleration (Newton\'s second law). Heavy animals need enormous force to accelerate quickly. That\'s why small animals often have better acceleration than large ones.',
    },
    {
      title: 'Distance-time graphs — reading the story of motion',
      concept: `A **distance-time graph** is like a storybook for motion. Every race, every journey, every chase has a shape on this graph.

How to read them:
- **Steep line** = fast (covering lots of distance in little time)
- **Flat line** = stopped (time passes but distance doesn't change)
- **Straight line** = constant speed
- **Curve getting steeper** = accelerating
- **Curve getting flatter** = decelerating

The **slope** of the line at any point IS the speed at that moment. Steeper = faster.

The tortoise's graph is a straight line (constant speed). The hare's graph is a series of steep lines (sprinting) and flat lines (napping). Where the tortoise's line crosses above the hare's line — that's the moment the tortoise takes the lead.`,
      analogy: 'A distance-time graph is like a bank statement for motion. Deposits (moving forward) make the line go up. No deposits (resting) keep it flat. The "interest rate" is your speed. The tortoise has a low but steady deposit rate. The hare makes big deposits then stops — and falls behind.',
      storyConnection: 'If you plotted the Pobitora race on paper, you would see the hare\'s line shoot up then go flat, shoot up then go flat — a staircase pattern. The tortoise\'s line rises steadily like a gentle ramp. Where the ramp overtakes the staircase is the dramatic moment of the story.',
      checkQuestion: 'On a distance-time graph, what does it mean if the line goes downward?',
      checkAnswer: 'It means the object is moving back toward the starting point — the distance from the start is decreasing. The hare wandering back to taunt the tortoise would show as a dip in the graph. Note: on a position-time graph this makes sense; on a pure distance graph (total distance traveled), the line can never go down.',
      codeIntro: 'Create distance-time graphs for different race scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 100, 1000)

# Scenario 1: Classic race
tortoise1 = 0.3 * t  # constant 0.3 m/s

hare1 = np.zeros_like(t)
for i in range(1, len(t)):
    dt = t[i] - t[i-1]
    if t[i] < 10: hare1[i] = hare1[i-1] + 3.0 * dt
    elif t[i] < 80: hare1[i] = hare1[i-1]  # nap
    else: hare1[i] = hare1[i-1] + 3.0 * dt  # wakes up too late

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')
titles = ['Classic: Hare naps too long', 'Modified: Short nap', 'Modified: Hare gets lost']

# Scenario 2: Short nap
hare2 = np.zeros_like(t)
for i in range(1, len(t)):
    dt = t[i] - t[i-1]
    if t[i] < 10: hare2[i] = hare2[i-1] + 3.0 * dt
    elif t[i] < 30: hare2[i] = hare2[i-1]  # short nap
    else: hare2[i] = hare2[i-1] + 3.0 * dt

# Scenario 3: Hare gets lost (goes backward)
hare3 = np.zeros_like(t)
for i in range(1, len(t)):
    dt = t[i] - t[i-1]
    if t[i] < 10: hare3[i] = hare3[i-1] + 3.0 * dt
    elif t[i] < 30: hare3[i] = hare3[i-1] - 1.0 * dt  # wrong direction!
    elif t[i] < 40: hare3[i] = hare3[i-1]  # confused, stops
    else: hare3[i] = hare3[i-1] + 3.0 * dt  # figures it out

all_hares = [hare1, hare2, hare3]
for idx, ax in enumerate(axes):
    ax.set_facecolor('#111827')
    ax.plot(t, tortoise1, color='#22c55e', linewidth=2, label='Tortoise')
    ax.plot(t, all_hares[idx], color='#ef4444', linewidth=2, label='Hare')
    ax.set_xlabel('Time (s)', color='white')
    ax.set_ylabel('Distance (m)', color='white')
    ax.set_title(titles[idx], color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='gray')
    ax.set_ylim(-5, 40)

plt.tight_layout()
plt.show()

print("Reading the graphs:")
print("  Scenario 1: Hare naps 70s. Tortoise wins easily.")
print("  Scenario 2: Hare naps 20s. Hare wins — short rest, still fast.")
print("  Scenario 3: Hare goes backward (gets lost), then recovers.")
print()
print("The graph tells the ENTIRE story of the race without words.")`,
      challenge: 'Create a scenario where the tortoise and hare tie — they reach the same distance at exactly the same time. What nap duration creates a tie?',
      successHint: 'Distance-time graphs are used everywhere: GPS tracking of animals in Kaziranga, flight path analysis, stock price charts (price vs time). Learning to read them is learning to read the story of any changing quantity.',
    },
    {
      title: 'Animal speeds — the range of motion in nature',
      concept: `Animals move at wildly different speeds, and each speed is an adaptation to survival:

**Fastest land animals:**
- Cheetah: 120 km/h (33 m/s) — sprint predator
- Pronghorn: 98 km/h — endurance runner
- Indian wild ass (Rann of Kutch): 70 km/h

**Animals of Assam:**
- One-horned rhino: 55 km/h — surprising for their size!
- Asian elephant: 40 km/h in short bursts
- Hoolock gibbon: 55 km/h swinging through trees
- Indian star tortoise: 0.3 km/h (0.08 m/s)

**In water:**
- Gangetic river dolphin: 27 km/h
- Sailfish: 110 km/h

Speed is a trade-off. Fast animals sacrifice endurance (cheetah overheats in 30 seconds). Slow animals sacrifice escape ability but gain energy efficiency (tortoise can walk for hours on minimal food).`,
      analogy: 'Animal speed classes are like vehicle types. The cheetah is a Formula 1 car — insane top speed, burns fuel in minutes. The tortoise is an electric scooter — slow but can go all day on one charge. The rhino is a pickup truck — not the fastest, but try stopping one.',
      storyConnection: 'In Pobitora Wildlife Sanctuary, you can actually see this speed spectrum in one place: rhinos grazing slowly (tortoise mode), then charging at 55 km/h if disturbed (hare mode). The sanctuary is proof that both strategies — slow and steady, fast and explosive — coexist in the same ecosystem.',
      checkQuestion: 'A cheetah can run 120 km/h but only for about 30 seconds. A wolf can run 60 km/h for several minutes. In a 5 km chase, who wins?',
      checkAnswer: 'The wolf. A cheetah covers about 1 km in 30 seconds at top speed, then overheats and must stop. The wolf at 60 km/h covers 5 km in 5 minutes. This is why wolves (and early humans) hunt by endurance — they outlast faster prey.',
      codeIntro: 'Compare animal speeds across different species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Animal speeds (km/h) and endurance (seconds at top speed)
animals = {
    'Cheetah': {'speed': 120, 'endurance': 30, 'color': '#f59e0b'},
    'Pronghorn': {'speed': 98, 'endurance': 240, 'color': '#ef4444'},
    'Rhino': {'speed': 55, 'endurance': 60, 'color': '#8b5cf6'},
    'Elephant': {'speed': 40, 'endurance': 120, 'color': '#6b7280'},
    'Hare': {'speed': 72, 'endurance': 45, 'color': '#ec4899'},
    'Gibbon': {'speed': 55, 'endurance': 90, 'color': '#14b8a6'},
    'Wolf': {'speed': 60, 'endurance': 600, 'color': '#3b82f6'},
    'Tortoise': {'speed': 0.3, 'endurance': 36000, 'color': '#22c55e'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Bar chart of speeds
names = list(animals.keys())
speeds = [a['speed'] for a in animals.values()]
colors = [a['color'] for a in animals.values()]

ax1.set_facecolor('#111827')
bars = ax1.barh(names, speeds, color=colors)
ax1.set_xlabel('Top speed (km/h)', color='white')
ax1.set_title('Top Speeds', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, spd in zip(bars, speeds):
    ax1.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{spd} km/h', va='center', color='white', fontsize=9)

# Speed x endurance = max distance at top speed
ax2.set_facecolor('#111827')
for name, props in animals.items():
    dist = props['speed'] * props['endurance'] / 3600  # km
    ax2.scatter(props['speed'], props['endurance'], s=dist*50+50,
                color=props['color'], alpha=0.7, edgecolors='white', linewidth=0.5)
    ax2.annotate(f"{name}\\n({dist:.1f}km)", xy=(props['speed'], props['endurance']),
                 xytext=(5, 5), textcoords='offset points', color=props['color'], fontsize=8)

ax2.set_xlabel('Top speed (km/h)', color='white')
ax2.set_ylabel('Endurance at top speed (s)', color='white')
ax2.set_title('Speed vs Endurance (bubble = max distance)', color='white', fontsize=11)
ax2.set_yscale('log')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Max distance at top speed:")
for name, props in animals.items():
    dist = props['speed'] * props['endurance'] / 3600
    print(f"  {name}: {dist:.1f} km ({props['speed']} km/h x {props['endurance']}s)")`,
      challenge: 'Add a human to both charts. Usain Bolt: 44.7 km/h for ~10 seconds. Marathon runner: 20 km/h for ~7500 seconds. Humans are unique — moderate speed but incredible endurance.',
      successHint: 'The speed-endurance trade-off is fundamental to ecology. Predators and prey evolve along this spectrum, and understanding it helps wildlife managers design corridors and reserves in places like Kaziranga.',
    },
    {
      title: 'Biomechanics of running — how bodies move',
      concept: `Why is a cheetah fast and a tortoise slow? The answer lies in **biomechanics** — the physics of how bodies move.

**Key factors in running speed:**
1. **Stride length**: how far each step covers (cheetah: 7m per stride!)
2. **Stride frequency**: how many steps per second (hummingbird legs: 15 steps/s)
3. **Speed = stride length x stride frequency**

**Why tortoises are slow:**
- Short legs relative to body → short stride length
- Heavy shell → high mass to move → low stride frequency
- Shell provides protection instead of speed (different survival strategy)

**Why cheetahs are fast:**
- Flexible spine acts as a spring, adding ~3m to each stride
- Lightweight build (only 50 kg for a large cat)
- Semi-retractable claws for grip (like running spikes)
- Large nasal passages for oxygen intake at speed

**Energy cost**: moving faster requires exponentially more energy. Doubling your speed roughly quadruples the energy cost (due to air resistance and muscle physics).`,
      analogy: 'Running biomechanics is like a bicycle gear system. Stride length is like gear size (big gear = more distance per pedal rotation). Stride frequency is pedaling speed. To go fast, you need both a big gear AND fast pedaling. A tortoise is stuck in first gear with slow pedaling. A cheetah has the biggest gear and fastest pedaling in the animal kingdom.',
      storyConnection: 'The hare of Pobitora had long hind legs — spring-loaded for explosive speed. The tortoise had short, sturdy legs designed for carrying a heavy shell over rough terrain. Neither design is "wrong." The hare is built for escape; the tortoise is built for endurance and protection. In Kaziranga, the rhino combines both: armored AND fast.',
      checkQuestion: 'Why do long-legged animals tend to be faster? And why aren\'t spider legs (which are very long relative to body size) associated with great speed?',
      checkAnswer: 'Longer legs increase stride length, which directly increases speed. But speed also needs muscle power to swing those legs quickly. Spiders have long legs but use hydraulic pressure (not muscles) to extend them, which is slower. Also, at small scales, air resistance relative to body weight is much higher, limiting speed.',
      codeIntro: 'Model how stride length and frequency combine to determine speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stride length (m) and frequency (strides/s) for various animals
animals = {
    'Tortoise': {'length': 0.05, 'freq': 1.5, 'color': '#22c55e'},
    'Human walk': {'length': 0.75, 'freq': 2.0, 'color': '#3b82f6'},
    'Human sprint': {'length': 2.5, 'freq': 4.5, 'color': '#6366f1'},
    'Hare': {'length': 1.5, 'freq': 4.0, 'color': '#ef4444'},
    'Horse gallop': {'length': 7.0, 'freq': 2.3, 'color': '#8b5cf6'},
    'Cheetah': {'length': 7.0, 'freq': 3.5, 'color': '#f59e0b'},
}

fig, ax = plt.subplots(figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Plot each animal
for name, props in animals.items():
    speed = props['length'] * props['freq']
    ax.scatter(props['length'], props['freq'], s=speed*30+50,
               color=props['color'], alpha=0.8, edgecolors='white', linewidth=1)
    ax.annotate(f"{name}\\n{speed:.1f} m/s", xy=(props['length'], props['freq']),
                xytext=(10, 5), textcoords='offset points', color=props['color'], fontsize=9)

# Add iso-speed lines
for speed in [0.5, 2, 5, 10, 20, 30]:
    lengths = np.linspace(0.01, 8, 100)
    freqs = speed / lengths
    mask = (freqs > 0) & (freqs < 6)
    ax.plot(lengths[mask], freqs[mask], '--', color='gray', alpha=0.3, linewidth=1)
    valid = np.where(mask)[0]
    if len(valid) > 0:
        idx = valid[len(valid)//2]
        ax.text(lengths[idx], freqs[idx], f'{speed} m/s', color='gray', fontsize=7, alpha=0.6)

ax.set_xlabel('Stride length (m)', color='white')
ax.set_ylabel('Stride frequency (strides/s)', color='white')
ax.set_title('Speed = Stride Length \× Stride Frequency', color='white', fontsize=13)
ax.tick_params(colors='gray')
ax.set_xlim(0, 8)
ax.set_ylim(0, 6)

plt.tight_layout()
plt.show()

print("Speed = stride length x frequency:")
for name, props in animals.items():
    speed = props['length'] * props['freq']
    print(f"  {name}: {props['length']}m x {props['freq']}/s = {speed:.1f} m/s ({speed*3.6:.0f} km/h)")`,
      challenge: 'A T. rex had a stride length of ~4m. What stride frequency would it need to outrun a human sprinter (11 m/s)? Is that physically plausible for a 7-ton animal?',
      successHint: 'Biomechanics is where biology meets physics and engineering. Understanding stride mechanics has applications in robotics (designing walking robots), sports science, and prosthetic limb design.',
    },
    {
      title: 'Terminal velocity — the ultimate speed limit',
      concept: `Every falling or running object eventually reaches a maximum speed called **terminal velocity** — the point where the force pushing it forward equals the resistance pushing back.

**For falling objects:**
Gravity pulls down. Air resistance pushes up. When they balance → terminal velocity.
- Skydiver: ~55 m/s (200 km/h)
- Ant: ~1.5 m/s (they survive any fall!)
- Raindrop: ~9 m/s

**For running animals:**
Muscle force propels forward. Air resistance + ground friction push back. When they balance → top speed.
- Smaller animals reach terminal running speed quickly (low mass, low inertia)
- Larger animals take longer (more mass to accelerate)

**The key equation:** Air resistance = ½ × ρ × v² × C_d × A
- ρ = air density, v = speed, C_d = drag coefficient, A = frontal area
- Resistance increases with the SQUARE of velocity — doubling speed quadruples drag!

This is why the hare can't just "try harder" to go faster — air resistance sets a hard ceiling.`,
      analogy: 'Terminal velocity is like trying to push through a crowd. At first, the crowd is thin and you walk fast. As you go faster, you bump into more people (more air molecules). Eventually, no matter how hard you push, the crowd pushes back equally. You\'ve hit your terminal velocity through the crowd.',
      storyConnection: 'If the Pobitora hare jumped off a cliff (not recommended), it would reach about 30 m/s terminal velocity. The tortoise, tucked in its shell, would be more aerodynamic and might fall faster! In parachute terms, the tortoise shell IS the parachute for the hare — but reversed. Size, shape, and mass all determine terminal velocity.',
      checkQuestion: 'An ant can fall from any height and survive. A mouse can survive a fall of several stories. A horse dies from a fall of two stories. Why does fall survival decrease with body size?',
      checkAnswer: 'Terminal velocity increases with mass (more weight) but increases less with area (surface scales as length²; mass scales as length³). Bigger animals hit the ground faster AND have more kinetic energy to absorb. An ant has so much surface area relative to its mass that air resistance slows it to a gentle landing.',
      codeIntro: 'Simulate terminal velocity for different falling objects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate falling with air resistance
# F_net = mg - 0.5*rho*v^2*Cd*A
# a = g - (0.5*rho*Cd*A/m)*v^2

g = 9.81  # m/s^2
rho = 1.225  # air density kg/m^3

objects = {
    'Ant': {'mass': 0.001, 'area': 0.00001, 'Cd': 1.2, 'color': '#22c55e'},
    'Hare': {'mass': 3.0, 'area': 0.03, 'Cd': 0.5, 'color': '#ef4444'},
    'Tortoise (in shell)': {'mass': 5.0, 'area': 0.04, 'Cd': 0.4, 'color': '#f59e0b'},
    'Human': {'mass': 70, 'area': 0.7, 'Cd': 1.0, 'color': '#3b82f6'},
}

dt = 0.01
t_max = 15
t = np.arange(0, t_max, dt)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

for name, props in objects.items():
    m, A, Cd = props['mass'], props['area'], props['Cd']
    k = 0.5 * rho * Cd * A / m  # drag coefficient
    v_terminal = np.sqrt(g / k)

    v = np.zeros_like(t)
    dist = np.zeros_like(t)
    for i in range(1, len(t)):
        a = g - k * v[i-1]**2
        v[i] = v[i-1] + a * dt
        dist[i] = dist[i-1] + v[i] * dt

    ax1.set_facecolor('#111827')
    ax1.plot(t, v, color=props['color'], linewidth=2, label=f"{name} (Vt={v_terminal:.1f} m/s)")
    ax1.axhline(v_terminal, color=props['color'], linestyle=':', alpha=0.3)

    ax2.set_facecolor('#111827')
    ax2.plot(t, dist, color=props['color'], linewidth=2, label=name)

ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Speed (m/s)', color='white')
ax1.set_title('Falling Speed (approaching terminal velocity)', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Distance fallen (m)', color='white')
ax2.set_title('Distance Fallen', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Terminal velocities:")
for name, props in objects.items():
    k = 0.5 * rho * props['Cd'] * props['area'] / props['mass']
    vt = np.sqrt(g / k)
    print(f"  {name}: {vt:.1f} m/s ({vt*3.6:.0f} km/h)")
print()
print("The ant barely reaches 1.5 m/s — it can fall from space and survive!")
print("The human hits ~55 m/s without a parachute — hence why we invented them.")`,
      challenge: 'Add a "parachute human" with the same mass (70kg) but area = 30 m² and Cd = 1.5. What\'s the new terminal velocity? That\'s why parachutes save lives!',
      successHint: 'Terminal velocity explains why ants survive falls, why raindrops don\'t kill us, and why skydivers need parachutes. The v² in the drag equation is one of the most important relationships in all of physics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Speed, Acceleration & Biomechanics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for physics simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}