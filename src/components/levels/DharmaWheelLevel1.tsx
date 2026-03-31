import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cog } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import DharmaWheelFrictionDiagram from '../diagrams/DharmaWheelFrictionDiagram';
import DharmaTorqueDiagram from '../diagrams/DharmaTorqueDiagram';
import DharmaGyroscopeDiagram from '../diagrams/DharmaGyroscopeDiagram';
import DharmaFlywheelDiagram from '../diagrams/DharmaFlywheelDiagram';
import ActivitySpinningTopDiagram from '../diagrams/ActivitySpinningTopDiagram';

export default function DharmaWheelLevel1() {
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

  const diagrams = [DharmaWheelFrictionDiagram, DharmaTorqueDiagram, DharmaGyroscopeDiagram, DharmaFlywheelDiagram, ActivitySpinningTopDiagram, null];

  const miniLessons = [
    {
      title: 'Friction — the force that resists motion',
      concept: `Before we can understand why the wheel was revolutionary, we need to understand **friction** — the force it defeats.

Put your hand flat on a table and push it sideways. You feel resistance. That resistance is friction — it acts whenever two surfaces slide against each other. It always opposes the direction of motion.

Two types matter here:
- **Static friction**: the force you must overcome to START an object moving (higher)
- **Kinetic (sliding) friction**: the force that resists an object ALREADY moving (lower)

The friction force is calculated as: **F = μ × N**
- μ (mu) is the **coefficient of friction** — a number that depends on the two surfaces
- N is the **normal force** (usually the weight of the object: mg)

Rubber on concrete: μ ≈ 0.8 (high friction). Ice on ice: μ ≈ 0.03 (low friction).

The key insight: **rolling friction** has a much lower μ than sliding friction — typically 0.01 compared to 0.3-0.8. The wheel exploits this difference.`,
      analogy: 'Imagine dragging a heavy suitcase across an airport floor versus rolling it on wheels. The suitcase weighs the same either way. But dragging it feels ten times harder because sliding friction grips the entire bottom surface. Rolling converts that sliding into thousands of tiny "touch and lift" contacts — each one so brief that friction barely has time to grab hold.',
      storyConnection: 'The Dharma Wheel’s eight spokes represent the Noble Eightfold Path — a path of practice. But the wheel itself is a profound metaphor precisely because wheels MOVE. A wheel that cannot turn is just a circle. What makes it a wheel is its ability to overcome friction and carry weight forward. The physics of motion IS the metaphor.',
      checkQuestion: 'A 20 kg box sits on a wooden floor (μ = 0.4). How much horizontal force do you need to start it sliding?',
      checkAnswer: 'F = μ × N = μ × mg = 0.4 × 20 × 9.8 = 78.4 N. That is about 8 kg of push force. Now put it on wheels (μ = 0.01): F = 0.01 × 20 × 9.8 = 1.96 N — you could push it with one finger. The wheel reduces the force needed by 40×.',
      codeIntro: 'Compare sliding vs rolling friction for different masses.',
      code: `import numpy as np

# Friction comparison: sliding vs rolling
masses = np.array([5, 10, 20, 50, 100, 500, 1000])  # kg
g = 9.81  # m/s^2

mu_sliding = 0.5   # wood on wood
mu_rolling = 0.01  # wheel on road

print("Sliding vs Rolling Friction")
print("=" * 55)
print(f"{'Mass (kg)':>10} | {'Slide (N)':>10} | {'Roll (N)':>10} | {'Ratio':>8}")
print("-" * 55)

for m in masses:
    f_slide = mu_sliding * m * g
    f_roll = mu_rolling * m * g
    ratio = f_slide / f_roll
    print(f"{m:>10} | {f_slide:>10.1f} | {f_roll:>10.1f} | {ratio:>7.0f}x")

print()
print("Key insight: the ratio stays CONSTANT (50x) regardless of mass.")
print("A wheel helps just as much for a 5 kg load as a 1000 kg load.")
print("This is why wheels changed civilization — they scale perfectly.")`,
      challenge: 'Add a third column for ball bearings (μ = 0.001). How much force does it take to move a 10,000 kg truck on ball bearings versus dragging it?',
      successHint: 'The wheel is not just a convenience — it is a force multiplier. By converting sliding friction to rolling friction, it reduces resistance by 50× or more. Every cart, chariot, bicycle, car, and train exploits this one principle.',
    },
    {
      title: 'Torque — the rotational force',
      concept: `Linear force pushes things in straight lines. **Torque** is the rotational version — it makes things spin.

The formula is simple: **τ = F × r**
- τ (tau) is torque, measured in Newton-metres (N·m)
- F is the force applied
- r is the **lever arm** — the perpendicular distance from the pivot to where the force acts

This explains why:
- A long wrench loosens a bolt more easily than a short one (bigger r)
- You push a door at the handle, not near the hinge (bigger r)
- A bigger wheel requires less force to turn (bigger r)

The angle matters too. Maximum torque comes when the force is perpendicular to the lever arm. If you push parallel to the lever, torque is zero — you cannot open a door by pushing along its surface.

The full formula: **τ = F × r × sin(θ)**, where θ is the angle between force and lever arm. At 90°, sin(θ) = 1 (maximum). At 0°, sin(θ) = 0 (no torque).`,
      analogy: 'Torque is like leverage. Imagine opening a stuck jar lid. If you grip near the centre, you strain and nothing happens. Grip the outer edge of the lid (bigger r) and it twists open easily. Same force, bigger lever arm, more torque. A wrench is just a tool for increasing r.',
      storyConnection: 'The Dharma Wheel in the story is turned by the Teacher’s words. In physics terms, the teaching applies a force at the rim of understanding, creating torque that sets the wheel in motion. The eight spokes extend to the rim — each spoke is a lever arm. The further from the centre the force acts, the greater the torque.',
      checkQuestion: 'You apply 50 N of force at the end of a 0.3 m wrench. Your friend applies 30 N at the end of a 0.6 m wrench. Who generates more torque?',
      checkAnswer: 'You: τ = 50 × 0.3 = 15 N·m. Friend: τ = 30 × 0.6 = 18 N·m. Your friend wins despite using less force, because the longer lever arm more than compensates. This is the fundamental principle of levers — and exactly why mechanics use long wrenches for tight bolts.',
      codeIntro: 'Calculate torque for different force and lever arm combinations, and find when a wheel starts to spin.',
      code: `import numpy as np

# Torque: tau = F * r * sin(theta)
print("Torque Calculator")
print("=" * 55)

# Example 1: Varying lever arm
F = 100  # Newtons
print(f"Force = {F} N, applied at different distances:")
print(f"{'Distance (m)':>14} | {'Torque (N.m)':>14}")
print("-" * 35)
for r in [0.05, 0.1, 0.2, 0.5, 1.0, 2.0]:
    tau = F * r
    print(f"{r:>14.2f} | {tau:>14.1f}")

print()

# Example 2: The angle effect
print("Same force (100 N) and distance (0.5 m), varying angle:")
print(f"{'Angle':>10} | {'sin(angle)':>12} | {'Torque (N.m)':>14}")
print("-" * 42)
for deg in [0, 15, 30, 45, 60, 75, 90]:
    rad = np.radians(deg)
    tau = F * 0.5 * np.sin(rad)
    print(f"{deg:>8}° | {np.sin(rad):>12.3f} | {tau:>14.1f}")

print()
print("At 0°: zero torque (pushing along the lever).")
print("At 90°: maximum torque (pushing perpendicular).")
print("This is why you push a door at right angles to its surface.")`,
      challenge: 'A bicycle pedal crank is 0.17 m long. Plot the torque for one full revolution (0° to 360°) if the rider pushes downward with 80 N. When is torque maximum? When is it zero?',
      successHint: 'Torque is the bridge between linear and rotational physics. Every rotating machine — engines, turbines, wheels, gears — converts force into torque. Understanding τ = F × r × sin(θ) unlocks how all of them work.',
    },
    {
      title: 'Angular momentum — why spinning objects resist change',
      concept: `A moving object has **momentum** (p = mv) and resists changes to its motion. A spinning object has **angular momentum** (L = Iω) and resists changes to its rotation.

The formula: **L = I × ω**
- L is angular momentum (kg·m²/s)
- I is the **moment of inertia** — how mass is distributed relative to the spin axis
- ω (omega) is angular velocity (radians per second)

Moment of inertia depends on WHERE the mass is:
- Solid disc: I = ½ mr²
- Thin ring (all mass at the rim): I = mr²
- Solid sphere: I = 2/5 mr²

The key principle: **angular momentum is conserved** (unless an external torque acts). This means:
- If I decreases, ω must increase to keep L constant
- An ice skater pulls in her arms (I decreases) → she spins faster (ω increases)
- She extends her arms (I increases) → she slows down (ω decreases)

This conservation law is one of the most fundamental in physics. It governs everything from atoms to galaxies.`,
      analogy: 'Think of angular momentum like a reputation — once established, it resists change. A slowly spinning wheel is easy to stop (low L, like a new reputation). A fast, heavy wheel is extremely hard to stop or redirect (high L, like an established reputation). The only way to change angular momentum is to apply torque over time — there are no shortcuts.',
      storyConnection: 'In Buddhism, the Dharma Wheel once set in motion continues to turn through the ages. Angular momentum conservation is the physics version: once the wheel spins, it maintains its rotation unless acted upon by an external torque. The metaphor is precise — teachings persist because they have momentum, and overcoming that momentum requires sustained opposing force.',
      checkQuestion: 'A figure skater spins at 2 rev/s with arms out (I = 3.0 kg·m²). She pulls her arms in (I = 1.0 kg·m²). How fast does she spin now?',
      checkAnswer: 'Conservation: L = I₁ω₁ = I₂ω₂. So ω₂ = I₁ω₁ / I₂ = 3.0 × 2 / 1.0 = 6 rev/s. She triples her speed by reducing her moment of inertia by a factor of 3. No extra energy input — just physics. This is angular momentum conservation in action.',
      codeIntro: 'Simulate the ice skater spin-up effect and explore angular momentum conservation.',
      code: `import numpy as np

# Angular Momentum Conservation
print("Angular Momentum: L = I * omega")
print("=" * 55)

# Ice skater demonstration
I_out = 3.0    # kg.m^2 (arms extended)
I_in = 1.0     # kg.m^2 (arms pulled in)
omega_start = 2.0  # rev/s

L = I_out * omega_start  # conserved quantity
omega_end = L / I_in

print(f"Ice Skater Spin-Up")
print(f"  Arms out:  I = {I_out} kg.m^2, omega = {omega_start} rev/s")
print(f"  Angular momentum L = {L} kg.m^2/s")
print(f"  Arms in:   I = {I_in} kg.m^2, omega = {omega_end} rev/s")
print(f"  Speed increase: {omega_end/omega_start:.1f}x")
print()

# Moment of inertia comparison for different wheel designs
print("Wheel Design Comparison (mass = 2 kg, radius = 0.3 m):")
print("-" * 55)
m = 2.0
r = 0.3
designs = [
    ("Solid disc", 0.5 * m * r**2),
    ("Thin ring (rim)", m * r**2),
    ("Spoked wheel", 0.7 * m * r**2),  # approx
    ("Solid sphere", 0.4 * m * r**2),
]
omega = 10  # rad/s

for name, I in designs:
    L = I * omega
    KE = 0.5 * I * omega**2
    print(f"  {name:20s}: I = {I:.4f} kg.m^2, L = {L:.3f}, KE = {KE:.2f} J")

print()
print("Key: mass at the RIM gives the highest moment of inertia.")
print("This is why flywheels have heavy rims — maximum energy storage.")`,
      challenge: 'A collapsing gas cloud (like a forming star) shrinks from radius 1000 to radius 1. If it starts spinning at 0.001 rad/s, how fast does it spin when collapsed? (Hint: model as I = mr² and use conservation.)',
      successHint: 'Angular momentum conservation is why the universe spins. Every planet, star, galaxy, and hurricane rotates because angular momentum from the initial formation is conserved. The Dharma Wheel is a symbol of something the universe does naturally.',
    },
    {
      title: 'Gyroscopic stability — why spinning resists tilting',
      concept: `Here is something counterintuitive: a spinning wheel does not fall over, even when it should.

Hold a bicycle wheel by its axle and try to tilt it while it is spinning. You feel a strange force pushing sideways — not the direction you expected. This is the **gyroscopic effect**.

The physics:
1. Angular momentum (L) is a **vector** — it points along the spin axis
2. To change the direction of L, you need a torque
3. Gravity provides torque perpendicular to L
4. This causes L to rotate slowly around the vertical — **precession** — rather than falling

The precession rate: **Ω = mgr / L** (where r is the distance from pivot to centre of mass)

Key observations:
- Faster spin → larger L → slower precession → more stable
- As the wheel slows down, precession speeds up until the wheel eventually falls
- This is EXACTLY why bicycles are easier to balance at higher speeds

Applications: gyroscopes in planes (artificial horizon), ships (stabilisers), satellites (attitude control), smartphones (orientation sensor).`,
      analogy: 'Imagine you are carrying a full glass of water on a tray. Walking slowly, it is hard to keep steady — every bump tips the tray. Walking at a brisk pace, the tray feels more stable because your forward momentum smooths out the wobbles. A spinning gyroscope takes this to an extreme: its angular momentum is so large that gravity’s attempt to tip it just causes a gentle sideways drift (precession) instead of a fall.',
      storyConnection: 'The Dharma Wheel’s stability is its most powerful metaphor. In Buddhism, the Wheel once set spinning by the Buddha’s first sermon has continued turning for 2,500 years. Gyroscopic physics shows that a spinning wheel genuinely resists being knocked off axis — the faster it spins, the more stable it becomes. The metaphor is not poetic decoration; it is physically accurate.',
      checkQuestion: 'A toy gyroscope weighs 0.2 kg, has its centre of mass 3 cm from the pivot, and has angular momentum L = 0.5 kg·m²/s. How fast does it precess?',
      checkAnswer: 'Ω = mgr / L = 0.2 × 9.8 × 0.03 / 0.5 = 0.118 rad/s, which is about one full precession circle every 53 seconds. As the gyroscope slows (L decreases), the precession rate increases: Ω goes up as L goes down. Eventually L is so small that precession becomes wild wobbling, and the gyroscope topples.',
      codeIntro: 'Simulate gyroscopic precession and show how spin speed affects stability.',
      code: `import numpy as np

# Gyroscopic Precession Simulation
print("Gyroscopic Precession: Ω = mgr / L")
print("=" * 55)

m = 0.5    # mass (kg)
g = 9.81   # gravity (m/s^2)
r_cm = 0.05  # distance from pivot to centre of mass (m)
I = 0.002  # moment of inertia (kg.m^2)

print(f"Gyroscope: m={m} kg, r_cm={r_cm} m, I={I} kg.m^2")
print()

# Different spin speeds
print(f"{'Spin (RPM)':>12} | {'omega (rad/s)':>14} | {'L (kg.m^2/s)':>14} | {'Precession':>14}")
print("-" * 62)

for rpm in [100, 500, 1000, 3000, 5000, 10000]:
    omega = rpm * 2 * np.pi / 60  # convert RPM to rad/s
    L = I * omega
    precession = m * g * r_cm / L  # rad/s
    prec_period = 2 * np.pi / precession if precession > 0 else float('inf')
    print(f"{rpm:>12} | {omega:>14.1f} | {L:>14.4f} | {prec_period:>11.1f} s/rev")

print()
print("Faster spin = larger L = slower precession = MORE stable.")
print()

# Real-world examples
print("Real-World Gyroscopes:")
print("-" * 55)
examples = [
    ("Toy top", 200, 0.0001, 0.05, 0.01),
    ("Bicycle wheel", 300, 1.5, 0.15, 0.3),
    ("Ship stabiliser", 900, 5000, 3.0, 200),
    ("Satellite gyro", 60000, 0.1, 0.0, 0.001),
]
for name, rpm, mass, r, Iv in examples:
    omega = rpm * 2 * np.pi / 60
    Lv = Iv * omega
    if mass > 0 and r > 0 and Lv > 0:
        prec = mass * 9.81 * r / Lv
        print(f"  {name:20s}: RPM={rpm:>6}, L={Lv:>10.3f}, Precession={prec:.4f} rad/s")
    else:
        print(f"  {name:20s}: RPM={rpm:>6}, L={Lv:>10.3f}, No gravity torque in space")`,
      challenge: 'Plot precession rate vs spin speed on a log-log plot. What mathematical relationship do you see? (Hint: precession ∝ 1/ω). At what RPM does precession become too fast for the gyroscope to stay upright?',
      successHint: 'Gyroscopic stability is one of the most elegant phenomena in physics. A spinning wheel actively resists being tipped over — not through strength, but through the vector nature of angular momentum. This is why we can ride bicycles, why ships don’t roll over, and why satellites maintain their orientation in space.',
    },
    {
      title: 'Flywheels — storing energy in a spinning wheel',
      concept: `A flywheel is a heavy wheel designed to store energy as rotational kinetic energy. The formula:

**KE = ½ Iω²**

Since I = mr² for a ring, and KE depends on ω² (omega squared), doubling the spin speed **quadruples** the stored energy. This makes speed more valuable than mass for energy storage.

Modern flywheel energy storage systems (FESS):
- **Rotor**: carbon fibre composite, spinning at 20,000–60,000 RPM
- **Enclosure**: vacuum chamber to eliminate air resistance
- **Bearings**: magnetic levitation (no contact, no friction)
- **Motor/generator**: spins up to store energy, slows down to release it

Advantages over batteries:
- **Instant response** (milliseconds vs seconds)
- **Long lifespan** (decades vs 5–10 years)
- **No toxic chemicals** (unlike lithium, cobalt)
- **High power density** (lots of energy released quickly)

Disadvantages:
- **Self-discharge** (friction slowly drains energy)
- **Catastrophic failure** if the rotor breaks at high speed
- **Lower energy density** than lithium batteries per kg

Used in: Formula 1 cars (KERS), NASA satellites, power grid stabilisation, UPS systems for hospitals.`,
      analogy: 'A flywheel is like a savings account for energy. You deposit energy by spinning it up (like depositing money). You withdraw energy by letting it slow down (like withdrawing money). The heavier the wheel and the faster it spins, the more energy is "saved." Unlike a battery that slowly degrades, a flywheel in a vacuum can hold its "savings" for days with minimal loss.',
      storyConnection: 'The Dharma Wheel is not just spinning — it is storing the energy of the Buddha’s teaching and releasing it across millennia. A flywheel does the same with physical energy: store it during abundance, release it during need. The Dharma Wheel is, in a very precise sense, a flywheel of wisdom.',
      checkQuestion: 'A flywheel has I = 5 kg·m² and spins at 3000 RPM. How much energy does it store? How does this compare to a AA battery (~10,000 J)?',
      checkAnswer: 'ω = 3000 × 2π/60 = 314.2 rad/s. KE = ½ × 5 × 314.2² = 246,740 J ≈ 247 kJ. That is about 25 AA batteries worth of energy, stored in a single spinning wheel. And it can release all of it in seconds if needed.',
      codeIntro: 'Calculate flywheel energy storage and compare different wheel designs.',
      code: `import numpy as np

# Flywheel Energy Storage Calculator
print("Flywheel Energy: KE = 0.5 * I * omega^2")
print("=" * 60)

# Different flywheel designs
designs = [
    ("Potter's wheel", 10, 0.3, 60),        # mass, radius, RPM
    ("Car engine flywheel", 15, 0.15, 3000),
    ("Formula 1 KERS", 5, 0.12, 40000),
    ("Grid-scale FESS", 200, 0.5, 16000),
    ("NASA G2 flywheel", 100, 0.3, 60000),
]

print(f"{'Design':>24} | {'Mass':>6} | {'RPM':>7} | {'Energy (kJ)':>12} | {'AA equiv':>9}")
print("-" * 72)

for name, m, r, rpm in designs:
    I = 0.5 * m * r**2  # solid disc
    omega = rpm * 2 * np.pi / 60
    KE = 0.5 * I * omega**2
    aa_equiv = KE / 10000  # AA battery ~ 10 kJ
    print(f"{name:>24} | {m:>5.0f} | {rpm:>7} | {KE/1000:>12.1f} | {aa_equiv:>8.0f}")

print()

# The omega-squared effect
print("Why speed matters more than mass:")
print("-" * 50)
I_fixed = 5.0  # kg.m^2
for rpm in [1000, 2000, 4000, 8000, 16000]:
    omega = rpm * 2 * np.pi / 60
    KE = 0.5 * I_fixed * omega**2
    print(f"  {rpm:>6} RPM: {KE/1000:>8.1f} kJ  (x{(rpm/1000)**2:.0f} vs 1000 RPM)")

print()
print("Double the speed = 4x the energy.")
print("This is why modern flywheels prioritise speed over mass.")`,
      challenge: 'Calculate the maximum RPM before a steel flywheel (tensile strength 500 MPa, density 7800 kg/m³, radius 0.3 m) tears itself apart. Hint: centripetal stress = ρω²r². Why does carbon fibre allow higher RPM?',
      successHint: 'Flywheels are the oldest and newest energy storage technology. A potter’s wheel stores energy from foot-kicks to smooth out the spinning. A modern grid-scale flywheel does exactly the same thing with megawatts of electricity. The principle has not changed in 5,000 years.',
    },
    {
      title: 'Putting it all together — the complete physics of the wheel',
      concept: `You now understand four interconnected concepts:

1. **Friction reduction**: Wheels convert sliding friction (μ ≈ 0.5) to rolling friction (μ ≈ 0.01) — a 50× improvement
2. **Torque**: Force applied at the rim creates rotational acceleration (τ = F × r)
3. **Angular momentum**: Spinning wheels resist changes to their orientation (L = Iω), enabling stability
4. **Energy storage**: Flywheels store kinetic energy as KE = ½Iω², with speed mattering more than mass

These are not separate ideas — they form a complete system. A bicycle demonstrates all four:
- **Rolling friction** allows it to glide efficiently
- **Torque** from pedalling accelerates the wheels
- **Gyroscopic stability** keeps it upright at speed
- **Flywheel effect** means it keeps moving between pedal strokes

Every rotating machine in human history uses some combination of these four principles. The wheel is not one invention — it is four physics principles packaged into a single device.`,
      analogy: 'The wheel is like a Swiss Army knife of physics. Open one blade (friction reduction) and you can move heavy loads. Open another (torque) and you can transmit power. A third (angular momentum) gives stability. A fourth (energy storage) lets you save energy for later. Each blade works alone, but together they are one of the most powerful tools humanity has ever created.',
      storyConnection: 'The Dharma Wheel combines all four principles into a single symbol. It rolls forward (friction reduction), it is turned by teaching (torque), it maintains its course across centuries (angular momentum), and it stores the energy of wisdom to be released when needed (flywheel). The Buddha chose this symbol well — the physics of the wheel mirrors the mechanics of how ideas persist and spread through time.',
      checkQuestion: 'Why is a bicycle much harder to balance when it is stationary compared to when it is moving at speed?',
      checkAnswer: 'At speed, the bicycle wheels have significant angular momentum (L = Iω). This angular momentum vector points along the axle direction. Tilting the bike requires changing the direction of L, which needs torque. The larger L is (faster speed), the more torque is needed to tilt it, so it resists falling. At zero speed, L = 0, and there is no gyroscopic stability — only your balance prevents falling. Additionally, at speed, small steering corrections create centripetal forces that move the contact point back under the centre of gravity.',
      codeIntro: 'Build a complete wheel physics simulator that combines all four concepts.',
      code: `import numpy as np

# Complete Wheel Physics Simulator
print("THE COMPLETE PHYSICS OF THE WHEEL")
print("=" * 60)

# Wheel parameters
m_wheel = 2.0     # mass of wheel (kg)
r_wheel = 0.35    # radius (m)
I_wheel = 0.5 * m_wheel * r_wheel**2  # solid disc

m_load = 80       # cargo mass (kg)
g = 9.81

print(f"Wheel: {m_wheel} kg, radius {r_wheel} m")
print(f"Load: {m_load} kg")
print()

# 1. FRICTION REDUCTION
print("1. FRICTION REDUCTION")
f_drag = 0.5 * m_load * g
f_roll = 0.01 * m_load * g
print(f"   Dragging force: {f_drag:.0f} N")
print(f"   Rolling force:  {f_roll:.1f} N")
print(f"   Improvement:    {f_drag/f_roll:.0f}x")
print()

# 2. TORQUE NEEDED
# To accelerate from 0 to 5 m/s in 10 seconds
v_target = 5.0  # m/s
t_accel = 10.0  # seconds
a = v_target / t_accel  # linear acceleration
alpha = a / r_wheel     # angular acceleration
tau_needed = I_wheel * alpha + f_roll * r_wheel
print("2. TORQUE TO ACCELERATE")
print(f"   Target: 0 to {v_target} m/s in {t_accel} s")
print(f"   Angular acceleration: {alpha:.2f} rad/s^2")
print(f"   Torque needed: {tau_needed:.2f} N.m")
print()

# 3. ANGULAR MOMENTUM AT SPEED
omega_cruising = v_target / r_wheel
L = I_wheel * omega_cruising
print("3. ANGULAR MOMENTUM AT CRUISING SPEED")
print(f"   omega = {omega_cruising:.1f} rad/s")
print(f"   L = {L:.3f} kg.m^2/s")
precession_rate = m_wheel * g * r_wheel / L if L > 0 else float('inf')
print(f"   Precession rate (if tilted): {precession_rate:.2f} rad/s")
print()

# 4. ENERGY STORED
KE = 0.5 * I_wheel * omega_cruising**2
print("4. ENERGY STORED IN THE WHEEL")
print(f"   KE = {KE:.1f} J")
print(f"   This keeps the wheel spinning between pedal strokes.")
print()

# Summary
print("COMPLETE PICTURE:")
print(f"   The wheel reduces friction by {f_drag/f_roll:.0f}x,")
print(f"   needs only {tau_needed:.1f} N.m of torque to accelerate,")
print(f"   has L = {L:.3f} kg.m^2/s of stabilising angular momentum,")
print(f"   and stores {KE:.1f} J of energy as it spins.")
print()
print("Four physics principles. One device. 5,500 years of use.")`,
      challenge: 'Add air resistance (F_drag = 0.5 × ρ × C_d × A × v²) and compute the top speed where air drag equals the driving force. How does wheel size affect the maximum speed?',
      successHint: 'You have now mastered the four pillars of wheel physics. In Level 2, you will go deeper into each: rotational dynamics simulations, gyroscopic navigation systems, flywheel optimisation, and gear train design. The wheel never stops turning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cog className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Friction, torque, angular momentum, and flywheel energy</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for physics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cog className="w-5 h-5" />Load Python</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
