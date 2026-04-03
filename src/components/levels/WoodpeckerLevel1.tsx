import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import WoodpeckerImpactDiagram from '../diagrams/WoodpeckerImpactDiagram';
import WoodpeckerSkullLayersDiagram from '../diagrams/WoodpeckerSkullLayersDiagram';
import WoodpeckerHyoidDiagram from '../diagrams/WoodpeckerHyoidDiagram';
import WoodpeckerSpongyBoneDiagram from '../diagrams/WoodpeckerSpongyBoneDiagram';
import WoodpeckerBrainFitDiagram from '../diagrams/WoodpeckerBrainFitDiagram';
import WoodpeckerHelmetDiagram from '../diagrams/WoodpeckerHelmetDiagram';

export default function WoodpeckerLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Impact force — what happens when beak meets bark',
      concept: `A woodpecker drums on a tree trunk up to 20 times per second. Each strike delivers an impact force that would give most animals a concussion. But the woodpecker is perfectly fine. Why?

To understand this, we need to start with **impact force** — the force generated when two objects collide. Impact force depends on three things:
- **Mass** of the moving object (the woodpecker's head, ~2 grams)
- **Velocity** at the moment of impact (~7 m/s)
- **Stopping time** — how quickly the head decelerates (shorter time = higher force)

The formula: **F = m * v / t** (this is a simplified version of Newton's second law for collisions)

A human head hitting a dashboard at 50 km/h experiences about 100g of deceleration, enough to cause traumatic brain injury. A woodpecker experiences up to **1,200g** with every single peck — and does it 12,000 times a day.`,
      analogy: 'Imagine punching a wall with a bare fist vs. a boxing glove. The wall exerts the same force back on you (Newton\'s third law), but the glove spreads the impact over a longer time. The woodpecker\'s skull is like having a perfectly engineered boxing glove built into its head.',
      storyConnection: 'In "The Woodpecker\'s Drum," the bird hammers out rhythms on hollow trees, communicating across the forest. Each drum roll is hundreds of impacts. The story celebrates the sound; the science reveals the extraordinary engineering that makes it survivable.',
      checkQuestion: 'If a woodpecker strikes a tree 20 times per second at 7 m/s, and each strike lasts about 1 millisecond, what is the deceleration in g-forces? (Use F = m*v/t, then convert to g where 1g = 9.8 m/s^2)',
      checkAnswer: 'Deceleration = v/t = 7 / 0.001 = 7,000 m/s^2. In g-forces: 7,000 / 9.8 = ~714g. Real measurements show peaks up to 1,200g because the beak doesn\'t decelerate uniformly. Even at 714g, this is more than 7 times the threshold for human concussion (~100g).',
      codeIntro: 'Calculate and visualize the impact forces during a woodpecker strike.',
      code: `import numpy as np

# Woodpecker strike parameters
mass = 0.002  # head mass in kg (~2 grams)
velocity = 7.0  # m/s at impact
strike_duration = 0.001  # 1 millisecond

# Time during a single strike
t = np.linspace(0, strike_duration, 500)

# Deceleration profile (sinusoidal approximation)
decel = (velocity / strike_duration) * np.sin(np.pi * t / strike_duration)
force = mass * decel


peak_g = velocity / strike_duration / 9.8
print(f"Peak deceleration: {peak_g:.0f}g")
print(f"Human concussion threshold: ~100g")
print(f"Woodpecker exceeds human threshold by: {peak_g/100:.1f}x")
print(f"Peak force: {mass * velocity / strike_duration:.2f} N")
print(f"Strikes per day: ~12,000")`,
      challenge: 'Change the strike duration from 1 ms to 2 ms (a softer wood). How does the peak g-force change? What if the woodpecker hit concrete (0.1 ms)?',
      successHint: 'Impact force is inversely proportional to stopping time. This single insight explains everything from car crumple zones to airbags to why you bend your knees when landing a jump.',
    },
    {
      title: 'Deceleration — the real danger in a collision',
      concept: `Here's a counterintuitive fact: speed doesn't kill. **Deceleration** kills. A fighter pilot traveling at Mach 2 is perfectly safe. It's only when they stop suddenly that damage occurs.

**Deceleration** is the rate at which velocity decreases: **a = (v_final - v_initial) / time**

When a woodpecker's beak hits a tree:
- Initial velocity: ~7 m/s
- Final velocity: 0 m/s
- Time to stop: ~0.5-1 millisecond
- Deceleration: 7,000-14,000 m/s^2 (700-1,400g)

For comparison:
- Gentle braking in a car: ~0.3g
- Emergency braking: ~1g
- Roller coaster: 3-5g
- Fighter jet maneuver: 9g
- Human concussion: ~100g
- Woodpecker peck: ~1,200g

The g-force scale spans four orders of magnitude from comfortable to lethal. The woodpecker operates at forces that would liquefy a human brain.`,
      analogy: 'Deceleration is like the difference between stepping off a curb and jumping off a building. In both cases you fall — but the curb gives you a tiny deceleration, while the ground from 10 stories gives you a massive one. The fall doesn\'t hurt; the sudden stop does.',
      storyConnection: 'The woodpecker in our story drums out complex rhythms — fast pecks, slow pecks, pauses. Each variation changes the impact speed and therefore the deceleration. Even the bird instinctively adjusts its force depending on whether it\'s drumming for communication or drilling for insects.',
      checkQuestion: 'An astronaut re-entering Earth\'s atmosphere experiences about 4g of deceleration. A woodpecker experiences 1,200g. How many times more deceleration does the woodpecker endure?',
      checkAnswer: '1,200 / 4 = 300 times more. And the astronaut needs a specially designed capsule, a heat shield, and physical training to survive 4g. The woodpecker does 300x that using nothing but evolved anatomy, 12,000 times a day.',
      codeIntro: 'Compare deceleration across different scenarios on a logarithmic scale.',
      code: `import numpy as np

# Deceleration scenarios (in g-forces)
scenarios = [
    ('Gentle braking', 0.3, '#22c55e'),
    ('Emergency brake', 1.0, '#22c55e'),
    ('Roller coaster', 5.0, '#3b82f6'),
    ('Fighter jet (9g)', 9.0, '#3b82f6'),
    ('Space re-entry', 4.0, '#3b82f6'),
    ('Car crash (seatbelt)', 30, '#f59e0b'),
    ('Human concussion', 100, '#ef4444'),
    ('NFL helmet hit', 150, '#ef4444'),
    ('Woodpecker peck', 1200, '#a855f7'),
]

names = [s[0] for s in scenarios]
values = [s[1] for s in scenarios]
colors = [s[2] for s in scenarios]


print("Key insight: the woodpecker operates at 12x the human concussion threshold.")
print("It does this ~12,000 times per day, for years, without brain damage.")
print()
print("The difference is NOT toughness — it's ENGINEERING.")
print("The woodpecker's skull is designed to manage deceleration.")`,
      challenge: 'Add more scenarios: a baseball hitting a bat (~30,000g), a bullet hitting a wall (~1,000,000g). You\'ll need to extend the x-axis. At what point does even the strongest material fail?',
      successHint: 'The logarithmic scale reveals that deceleration spans an enormous range. Understanding where different events fall on this scale is the first step toward designing protection systems.',
    },
    {
      title: 'Shock absorption — nature\'s crumple zone',
      concept: `The woodpecker survives 1,200g impacts because of **shock absorption** — converting kinetic energy into other forms before it reaches the brain. There are several mechanisms:

1. **Energy conversion**: kinetic energy → heat, sound, deformation
2. **Force distribution**: spreading the impact over a larger area
3. **Time extension**: making the collision last longer (reducing peak force)
4. **Elastic deformation**: absorbing energy in a spring-like material, then releasing it

Nature uses all four. So do engineers:
- **Car crumple zones**: convert kinetic energy into deformation (1 + 3)
- **Running shoes**: elastic deformation in the foam (4)
- **Bubble wrap**: trapped air compresses and extends impact time (3)
- **Helmets**: crush on impact, distributing and absorbing force (1 + 2 + 3)

The key equation: **Energy = Force x Distance**. If you can increase the distance over which a collision happens, you reduce the force. This is why you bend your knees when jumping down.`,
      analogy: 'Imagine catching a raw egg. If you hold your hands rigid, the egg breaks (short stopping distance, high force). If you let your hands move backward as you catch it (long stopping distance, low force), the egg survives. The woodpecker\'s skull is like catching an egg with perfectly soft hands — 12,000 times a day.',
      storyConnection: 'The woodpecker drums on dead wood, live wood, even metal sometimes — each material has different hardness. The bird\'s built-in shock absorbers work regardless of the surface. In the story, the drum echoes through the forest; in reality, much of the impact energy is being absorbed silently inside the skull.',
      checkQuestion: 'If a car crumple zone adds 0.5 meters of deformation distance during a crash, and the car was traveling at 60 km/h, how much does this reduce the peak force compared to a rigid car (0.01 m deformation)?',
      checkAnswer: 'Force is inversely proportional to distance (for the same energy). With crumple zone: distance = 0.5m. Without: distance = 0.01m. Ratio: 0.5/0.01 = 50. The crumple zone reduces peak force by 50x. This is why modern cars are designed to crumple — a destroyed car with a living driver is better than an intact car with a dead one.',
      codeIntro: 'Simulate how different stopping distances affect impact force.',
      code: `import numpy as np

# Impact energy is constant: E = 0.5 * m * v^2
# Force * distance = Energy, so F = E / d

mass = 0.002  # woodpecker head mass (kg)
velocity = 7.0  # m/s
energy = 0.5 * mass * velocity ** 2

# Stopping distances from 0.1mm to 10mm
distances = np.linspace(0.0001, 0.01, 500)  # in meters
forces = energy / distances
g_forces = forces / (mass * 9.8)


print(f"Impact energy per strike: {energy*1000:.2f} mJ")
print(f"At 12,000 strikes/day: {energy * 12000:.1f} J total")
print()
print("The woodpecker skull absorbs ~70% of impact energy")
print("through multiple mechanisms working together.")
print("No single mechanism is sufficient — it's the COMBINATION.")`,
      challenge: 'Model a scenario where a cyclist hits a curb at 20 km/h. Compare the g-forces with a rigid helmet (2mm deformation) vs. a modern helmet (30mm deformation). How many g does each produce?',
      successHint: 'Shock absorption is about converting dangerous kinetic energy into harmless heat and deformation. The woodpecker is nature\'s masterclass in this engineering principle.',
    },
    {
      title: 'Woodpecker skull anatomy — the engineering inside',
      concept: `The woodpecker's skull has at least four specialized features that protect its brain:

1. **Spongy bone (trabecular bone)**: The skull has a layer of porous, spongy bone — especially at the back — that compresses on impact, absorbing energy like a foam cushion. It then springs back.

2. **Hyoid bone**: A long, flexible bone that wraps around the entire skull like a seatbelt. It starts at the beak, goes under the jaw, around the back of the skull, and over the top to the right nostril. This bone distributes impact forces around the skull instead of channeling them into the brain.

3. **Thick skull with unequal beak-brain alignment**: The upper beak is slightly longer than the lower, and the brain sits above the point of impact, not directly behind it. Forces are directed below and around the brain.

4. **Minimal cerebrospinal fluid**: Unlike humans, woodpeckers have very little fluid around the brain. Their brain fits tightly in the skull, preventing it from sloshing around (which causes concussions in humans).

Together these features form an integrated shock management system — no single feature is sufficient alone.`,
      analogy: 'Think of the skull as a high-tech shipping box. The spongy bone is the foam packing peanuts. The hyoid bone is the strapping tape wrapped around the outside. The tight brain fit is like vacuum-sealing the product so it can\'t rattle. And the offset alignment is like placing the fragile item off-center, away from where the box is most likely to be dropped.',
      storyConnection: 'The woodpecker in our story drums tirelessly — dawn to dusk. Each drum roll is a burst of impacts that would destroy an unprotected brain. The story presents drumming as the bird\'s voice; biology reveals it as the output of an extraordinary skull architecture refined over 25 million years of evolution.',
      checkQuestion: 'Humans get concussions because the brain moves inside the skull and hits the inner wall. Why doesn\'t this happen to woodpeckers?',
      checkAnswer: 'Two reasons: (1) The woodpecker\'s brain fits very tightly in its skull cavity with minimal cerebrospinal fluid, so there\'s almost no room for the brain to move. (2) The hyoid bone distributes forces around the skull rather than transmitting them through it. In humans, the brain floats in fluid, which normally protects it but allows dangerous movement during sudden deceleration.',
      codeIntro: 'Visualize the force distribution pathways in a woodpecker skull vs. a human skull.',
      code: `import numpy as np

# Model force transmission through different skull structures
# Simulate a 1D shock wave passing through layers

time = np.linspace(0, 10, 1000)  # milliseconds

# Input force pulse (the impact)
input_pulse = np.exp(-((time - 2) ** 2) / 0.3) * 1200  # peak 1200g

# Human skull: minimal absorption, force reaches brain almost unchanged
human_damping = 0.15
human_brain_force = np.exp(-((time - 2.5) ** 2) / 0.5) * 1200 * (1 - human_damping)

# Woodpecker skull: multiple absorption layers
# Layer 1: Spongy bone absorbs ~30%
after_spongy = np.exp(-((time - 3) ** 2) / 0.8) * 1200 * 0.7
# Layer 2: Hyoid distributes ~40% of remaining
after_hyoid = np.exp(-((time - 3.5) ** 2) / 1.2) * 1200 * 0.7 * 0.6
# Layer 3: Tight fit prevents sloshing, reduces peak by ~30%
brain_force = np.exp(-((time - 4) ** 2) / 1.8) * 1200 * 0.7 * 0.6 * 0.7


peak_human = max(human_brain_force)
peak_woodpecker = max(brain_force)
print(f"Impact force: 1200g")
print(f"Human brain experiences: {peak_human:.0f}g (concussion!)")
print(f"Woodpecker brain experiences: {peak_woodpecker:.0f}g (safe)")
print(f"Reduction factor: {1200/peak_woodpecker:.1f}x")
print()
print("The three-layer system reduces force by:")
print(f"  Spongy bone: 30% absorbed")
print(f"  Hyoid bone: 40% of remainder distributed")
print(f"  Tight brain fit: 30% of remainder dampened")
print(f"  Total reduction: {(1 - 0.7*0.6*0.7)*100:.0f}%")`,
      challenge: 'What if the spongy bone absorbed 50% instead of 30%? How much would the final brain force decrease? Experiment with different absorption percentages for each layer.',
      successHint: 'Layered protection is more effective than a single thick barrier. This principle applies to woodpecker skulls, modern helmets, earthquake-resistant buildings, and cybersecurity (defense in depth).',
    },
    {
      title: 'G-forces — measuring the violence of acceleration',
      concept: `We measure acceleration relative to Earth's gravity. Standing on the ground, you experience **1g** (9.8 m/s^2). This is your baseline.

**G-force** is not actually a force — it's a measurement of acceleration. When we say something experiences "10g," we mean it's accelerating at 10 times the rate of gravity (98 m/s^2).

The human body can tolerate different g-forces depending on:
- **Direction**: You can handle more g-force pushing you into your seat (eyeballs-in) than pulling blood from your brain (eyeballs-out)
- **Duration**: Brief spikes are more survivable than sustained forces
- **Training**: Fighter pilots train to handle 9g using breathing techniques and g-suits

Thresholds:
- 1g: normal (standing, walking)
- 3-5g: roller coasters, tight turns
- 6-9g: fighter jets, astronauts at launch
- 20-50g: survivable car crashes (with restraints)
- 100g+: brain damage begins in humans
- 1,200g: a woodpecker, every single peck

The woodpecker is the g-force champion of the animal kingdom.`,
      analogy: 'G-force is like a universal stress test number. Just as Richter scale tells you "how violent" an earthquake is regardless of where it hits, g-force tells you "how violent" an acceleration is regardless of what\'s experiencing it. The number 100g means "dangerous to human brains" just as 7.0 on the Richter scale means "dangerous to buildings."',
      storyConnection: 'When the woodpecker drums its message across the forest, each tap is a 1,200g event. The rhythm we hear — rat-tat-tat-tat — is a sequence of impacts that would each be a medical emergency for a human. Nature\'s telegraph operator is also nature\'s most extreme athlete.',
      checkQuestion: 'A Formula 1 driver experiences about 5g in a fast corner. How many times per day would they need to do that to match a woodpecker\'s daily impact count? And at what g-force?',
      checkAnswer: 'A woodpecker pecks ~12,000 times per day at ~1,200g. An F1 driver at 5g would need 12,000 exposures just to match the count — but at 240x lower g-force. To match both count AND intensity, a human would need 12,000 exposures at 1,200g per day. No human body could survive even one.',
      codeIntro: 'Map the g-force spectrum across nature and technology.',
      code: `import numpy as np

# G-force spectrum
events = [
    ('Standing still', 1, 'continuous', '#22c55e'),
    ('Car acceleration', 0.5, '10s', '#22c55e'),
    ('Roller coaster', 4, '2s', '#3b82f6'),
    ('Space shuttle launch', 3, '8min', '#3b82f6'),
    ('Fighter jet turn', 9, '30s', '#3b82f6'),
    ('Sneeze', 3, '0.1s', '#f59e0b'),
    ('Car crash (belted)', 30, '0.1s', '#f59e0b'),
    ('Concussion threshold', 100, '0.01s', '#ef4444'),
    ('Football helmet hit', 150, '0.01s', '#ef4444'),
    ('Woodpecker peck', 1200, '0.001s', '#a855f7'),
    ('Mantis shrimp punch', 10400, '0.001s', '#a855f7'),
    ('Bullet fired', 100000, '0.001s', '#6b7280'),
]

names = [e[0] for e in events]
g_vals = [e[1] for e in events]
durations = [e[2] for e in events]
colors = [e[3] for e in events]


print("Notice the LOG scale — each grid line is 10x more.")
print()
print("The woodpecker at 1,200g is:")
print(f"  {1200/100:.0f}x the human concussion threshold")
print(f"  {1200/9:.0f}x what fighter pilots experience")
print(f"  {1200/4:.0f}x a roller coaster")
print()
print("But it's still 9x LESS than a mantis shrimp punch (10,400g).")
print("Biology produces forces far beyond anything human tech routinely handles.")`,
      challenge: 'Research the g-forces in other animal behaviors: a flea jumping, a click beetle launching itself, a falcon pulling out of a dive. Add them to the chart. Where do they fall?',
      successHint: 'The g-force spectrum gives you a universal language for comparing impacts across every domain — from sports medicine to car safety to space travel to animal biomechanics.',
    },
    {
      title: 'Biomimicry — stealing ideas from the woodpecker',
      concept: `**Biomimicry** is the practice of copying nature's designs to solve human engineering problems. The woodpecker skull has inspired real products and research:

1. **Helmets**: Researchers have designed helmets with layered absorption systems inspired by the spongy bone + hyoid bone arrangement. Some cycling helmets now use multi-density foam layers that mimic trabecular bone.

2. **Black boxes (flight recorders)**: Aircraft black boxes must survive impacts of 3,400g. Engineers at UC Berkeley studied woodpecker skulls and designed a shock-absorbing enclosure using close-packed steel spheres (mimicking spongy bone) and rubber layers (mimicking the hyoid). Their prototype survived 60,000g.

3. **Spacecraft shielding**: Micrometeorites hit spacecraft at extreme velocities. Multi-layer shielding inspired by the woodpecker skull distributes impact energy across layers.

4. **Construction hard hats**: WASP (Woodpecker-inspired Absorbing Structure for Protection) hard hats use a corrugated layer sandwiched between shells, mimicking spongy bone.

Biomimicry isn't just copying — it's understanding the **principle** behind nature's solution and applying it to a different problem.`,
      analogy: 'Biomimicry is like translating a book from one language to another. The original "book" is the woodpecker skull, written in the "language" of bone, cartilage, and muscle. The engineer "translates" it into steel, foam, and rubber. The story (absorb shock through layered systems) is the same; only the materials change.',
      storyConnection: 'The woodpecker\'s drum in our story is a sound of the forest — timeless, natural. But that natural sound encodes millions of years of evolutionary engineering. Biomimicry is humanity listening to that drum and learning from it. The best human designs often turn out to be re-inventions of nature\'s originals.',
      checkQuestion: 'Velcro was invented after a Swiss engineer noticed burrs sticking to his dog\'s fur. The lotus effect inspired self-cleaning surfaces. What other natural designs have been copied by engineers?',
      checkAnswer: 'Many examples: shark skin → drag-reducing swimsuits and ship hulls; kingfisher beak → Shinkansen bullet train nose (reduced sonic boom); gecko feet → reusable adhesives; termite mounds → passive building ventilation; spider silk → strong, lightweight fibers; butterfly wings → iridescent displays without pigment. Nature has a 3.8 billion year R&D head start.',
      codeIntro: 'Compare the shock absorption of a woodpecker-inspired multi-layer helmet vs. a traditional single-layer helmet.',
      code: `import numpy as np

# Simulate impact absorption: single layer vs multi-layer (woodpecker-inspired)
time = np.linspace(0, 20, 1000)  # milliseconds

# Input: head hits surface at speed
impact = np.exp(-((time - 3) ** 2) / 0.5) * 500  # 500g impact pulse

# Traditional helmet: single foam layer
# Reduces peak by ~60%, shifts time slightly
trad_absorption = 0.40
trad_output = np.exp(-((time - 4) ** 2) / 1.0) * 500 * (1 - trad_absorption)

# Bio-inspired helmet: 3 absorption layers
# Layer 1: outer shell (distributes over area) -20%
layer1 = np.exp(-((time - 4.5) ** 2) / 1.2) * 500 * 0.80
# Layer 2: corrugated layer (like spongy bone) -40% of remaining
layer2 = np.exp(-((time - 5.5) ** 2) / 1.8) * 500 * 0.80 * 0.60
# Layer 3: inner liner (tight fit, distributes) -30% of remaining
bio_output = np.exp(-((time - 6.5) ** 2) / 2.5) * 500 * 0.80 * 0.60 * 0.70


trad_peak = max(trad_output)
bio_peak = max(bio_output)
print(f"Raw impact: 500g")
print(f"Traditional helmet: {trad_peak:.0f}g ({(1-trad_peak/500)*100:.0f}% reduction)")
print(f"Bio-inspired helmet: {bio_peak:.0f}g ({(1-bio_peak/500)*100:.0f}% reduction)")
print()
print(f"Traditional: {'ABOVE' if trad_peak > 100 else 'below'} concussion threshold")
print(f"Bio-inspired: {'ABOVE' if bio_peak > 100 else 'below'} concussion threshold")
print()
print("Key bio-inspired features:")
print("  1. Hard outer shell (beak tip) — distributes impact area")
print("  2. Corrugated middle layer (spongy bone) — crushes to absorb energy")
print("  3. Tight inner fit (minimal CSF) — prevents brain movement")
print()
print("Biomimicry: 3.8 billion years of R&D, free to copy.")`,
      challenge: 'The UC Berkeley black box prototype survived 60,000g. If you scaled the woodpecker skull design to protect a human brain at that level, how many layers would you need? Assume each layer reduces force by 40%.',
      successHint: 'From impact force to deceleration to shock absorption to skull anatomy to g-forces to biomimicry — you\'ve traced a complete engineering story from nature to human application. Level 2 goes deeper into the physics and engineering of impact protection.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior physics or biology experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biomechanics simulations. Click to start.</p>
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
            diagram={[WoodpeckerImpactDiagram, WoodpeckerSkullLayersDiagram, WoodpeckerHyoidDiagram, WoodpeckerSpongyBoneDiagram, WoodpeckerBrainFitDiagram, WoodpeckerHelmetDiagram][i] ? createElement([WoodpeckerImpactDiagram, WoodpeckerSkullLayersDiagram, WoodpeckerHyoidDiagram, WoodpeckerSpongyBoneDiagram, WoodpeckerBrainFitDiagram, WoodpeckerHelmetDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}