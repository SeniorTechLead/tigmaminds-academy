import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WoodpeckerLevel2() {
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
      title: 'Impulse-momentum theorem — the math of collisions',
      concept: `Level 1 introduced impact force qualitatively. Now we formalize it. The **impulse-momentum theorem** states:

**F * dt = m * dv** (force times time equals mass times change in velocity)

Or equivalently: **Impulse (J) = Change in momentum (dp)**

Where:
- **Impulse** J = F * dt (force integrated over time, units: N*s)
- **Momentum** p = m * v (mass times velocity, units: kg*m/s)

This is Newton's second law in its original, more powerful form. F = ma is just a special case when mass is constant.

For collisions, the total impulse is fixed by the initial momentum. What changes is HOW that impulse is delivered:
- Short time, high force: shattering, breaking, concussions
- Long time, low force: safe stopping, cushioned landing

The area under the force-vs-time curve is always the same. Only the shape changes.`,
      analogy: 'Think of impulse like paying a bill. You owe $1,200 (the momentum change). You can pay it all at once ($1,200 in one month — painful, like a high-force short-duration impact). Or you can spread it over 12 months ($100/month — the same total, but manageable). The woodpecker\'s skull spreads the "payment" over a longer time.',
      storyConnection: 'Every woodpecker strike delivers the same impulse — the beak has the same mass and hits at the same speed. The skull doesn\'t reduce the impulse (that\'s physically impossible). It redistributes it over time, lowering the peak force. The drum\'s rhythm is the same; the physics inside the skull transforms it.',
      checkQuestion: 'A 0.15 kg baseball hits a bat at 40 m/s and rebounds at 50 m/s. What is the impulse? If the contact time is 1 ms, what is the average force?',
      checkAnswer: 'Impulse = m * (v_final - v_initial) = 0.15 * (50 - (-40)) = 0.15 * 90 = 13.5 N*s. (Note: initial velocity is negative because it reverses direction.) Average force = J/dt = 13.5 / 0.001 = 13,500 N — about 1.5 tons of force from a bat. That\'s why baseballs deform during contact.',
      codeIntro: 'Demonstrate that different force profiles can deliver the same impulse.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Same impulse (momentum change), different force profiles
# Impulse J = m * delta_v = 0.002 * 7 = 0.014 N*s

m = 0.002  # kg (woodpecker head)
v = 7.0    # m/s
J = m * v  # impulse = 0.014 N*s

time = np.linspace(0, 5, 1000)  # ms

# Profile 1: Very short, very high force (rigid impact)
dt1 = 0.5  # ms
F1 = (J / (dt1 / 1000)) * np.exp(-((time - 1) ** 2) / (2 * (dt1/2.5)**2))
F1 = F1 / (np.trapz(F1, time / 1000)) * J  # normalize to correct impulse

# Profile 2: Medium duration (traditional helmet)
dt2 = 1.5
F2 = (J / (dt2 / 1000)) * np.exp(-((time - 1.5) ** 2) / (2 * (dt2/2.5)**2))
F2 = F2 / (np.trapz(F2, time / 1000)) * J

# Profile 3: Long duration, low force (woodpecker skull)
dt3 = 3.0
F3 = (J / (dt3 / 1000)) * np.exp(-((time - 2.5) ** 2) / (2 * (dt3/2.5)**2))
F3 = F3 / (np.trapz(F3, time / 1000)) * J

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Force profiles
ax1.set_facecolor('#111827')
ax1.plot(time, F1, color='#ef4444', linewidth=2, label=f'Rigid ({max(F1):.0f}N peak)')
ax1.plot(time, F2, color='#f59e0b', linewidth=2, label=f'Padded ({max(F2):.0f}N peak)')
ax1.plot(time, F3, color='#22c55e', linewidth=2, label=f'Bio-inspired ({max(F3):.0f}N peak)')
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Force (N)', color='white')
ax1.set_title('Same Impulse, Different Force Profiles', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Cumulative impulse (should all reach the same value)
ax2.set_facecolor('#111827')
cum1 = np.cumsum(F1) * (time[1] - time[0]) / 1000
cum2 = np.cumsum(F2) * (time[1] - time[0]) / 1000
cum3 = np.cumsum(F3) * (time[1] - time[0]) / 1000
ax2.plot(time, cum1 * 1000, color='#ef4444', linewidth=2, label='Rigid')
ax2.plot(time, cum2 * 1000, color='#f59e0b', linewidth=2, label='Padded')
ax2.plot(time, cum3 * 1000, color='#22c55e', linewidth=2, label='Bio-inspired')
ax2.axhline(J * 1000, color='white', linestyle='--', linewidth=1, label=f'Total impulse = {J*1000:.1f} mN*s')
ax2.set_xlabel('Time (ms)', color='white')
ax2.set_ylabel('Cumulative impulse (mN*s)', color='white')
ax2.set_title('All Profiles Deliver the Same Total Impulse', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Impulse = m * v = {m} * {v} = {J} N*s = {J*1000} mN*s")
print()
print("Peak forces:")
print(f"  Rigid impact:  {max(F1):.1f} N  (peak g: {max(F1)/(m*9.8):.0f}g)")
print(f"  Padded:        {max(F2):.1f} N  (peak g: {max(F2)/(m*9.8):.0f}g)")
print(f"  Bio-inspired:  {max(F3):.1f} N  (peak g: {max(F3)/(m*9.8):.0f}g)")
print()
print("The impulse is IDENTICAL. Only the peak force differs.")
print("This is the impulse-momentum theorem in action.")`,
      challenge: 'Model a car crash: 1500 kg car at 50 km/h (13.9 m/s). Compare a rigid car (10 ms stop) vs. crumple zone (100 ms stop). What are the peak forces? Convert to g-force on a 75 kg occupant.',
      successHint: 'The impulse-momentum theorem is the foundation of all impact protection engineering. You cannot reduce the impulse — but you can always reshape the force profile.',
    },
    {
      title: 'Crumple zones — controlled destruction that saves lives',
      concept: `A **crumple zone** is a region of a vehicle designed to deform in a controlled manner during a collision, extending the stopping time and reducing peak force on occupants.

Before crumple zones (pre-1950s), cars were built rigid. In a crash, the car survived intact but the occupants experienced massive deceleration. Modern cars are engineered to sacrifice the car to save the human.

Engineering principles:
- **Progressive crushing**: front structure collapses in stages, like an accordion
- **Load paths**: forces are channeled around the passenger cabin
- **Energy absorption**: kinetic energy → plastic deformation (permanent bending of metal)
- **Ride-down distance**: the distance over which the occupant decelerates

The math: For a 1500 kg car at 50 km/h:
- KE = 0.5 * 1500 * 13.9^2 = 144,675 J
- Rigid car (0.1m crush): F = 144,675 / 0.1 = 1,446,750 N (96g on a 75 kg person)
- Crumple zone (0.6m crush): F = 144,675 / 0.6 = 241,125 N (16g on a 75 kg person)

That's the difference between fatal and survivable.`,
      analogy: 'A crumple zone is like a sacrificial shield. In medieval battles, soldiers carried wooden shields that would splinter on impact — absorbing the sword\'s energy so the soldier\'s body wouldn\'t. The shield was destroyed, but the soldier lived. A crumpled car is a destroyed shield that saved a life.',
      storyConnection: 'The woodpecker\'s spongy bone IS a biological crumple zone — it compresses on impact, absorbs energy, then slowly recovers. Engineers studying this bone structure realized they could build the same principle into car frames. Nature invented the crumple zone 25 million years before Bela Barenyi patented it for Mercedes-Benz in 1951.',
      checkQuestion: 'Why can\'t we just make crumple zones infinitely long? What limits the practical crush distance?',
      checkAnswer: 'Three limits: (1) The car has a fixed length — more crumple zone means less passenger space. (2) Beyond a certain crush distance, the structure "bottoms out" and force spikes again. (3) The occupant is connected to the car via seatbelt/airbag, which has its own force limits. The optimal design balances crush distance against these constraints — typically 0.5-0.8m for modern cars.',
      codeIntro: 'Simulate a car crash with and without a crumple zone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Car crash simulation
mass = 1500  # kg
v0 = 13.9   # m/s (50 km/h)
KE = 0.5 * mass * v0 ** 2

# Case 1: Rigid car (crush distance = 0.1m)
d_rigid = 0.1
F_rigid = KE / d_rigid

# Case 2: Modern crumple zone (crush distance = 0.6m)
d_crumple = 0.6
F_crumple = KE / d_crumple

# Simulate velocity vs distance
distances = np.linspace(0, 0.7, 500)

# Rigid: constant high force over short distance
v_rigid = np.sqrt(np.maximum(v0**2 - 2 * F_rigid / mass * distances, 0))
v_rigid[distances > d_rigid] = 0

# Crumple: progressive force over longer distance
# Real crumple zones have a rising then constant force profile
force_profile = np.where(distances < 0.1, F_crumple * distances / 0.1,
                np.where(distances < d_crumple, F_crumple, 0))
# Numerically integrate for velocity
v_crumple = np.zeros_like(distances)
v_crumple[0] = v0
dt_step = distances[1] - distances[0]
for i in range(1, len(distances)):
    if v_crumple[i-1] > 0:
        decel = force_profile[i] / mass
        v_crumple[i] = max(0, np.sqrt(max(0, v_crumple[i-1]**2 - 2 * decel * dt_step)))

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Velocity vs distance
ax1.set_facecolor('#111827')
ax1.plot(distances * 100, v_rigid * 3.6, color='#ef4444', linewidth=2, label='Rigid car')
ax1.plot(distances * 100, v_crumple * 3.6, color='#22c55e', linewidth=2, label='Crumple zone')
ax1.set_xlabel('Crush distance (cm)', color='white')
ax1.set_ylabel('Speed (km/h)', color='white')
ax1.set_title('Speed vs Crush Distance', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Force comparison
ax2.set_facecolor('#111827')
labels = ['Rigid car', 'Crumple zone']
forces_kn = [F_rigid / 1000, F_crumple / 1000]
colors = ['#ef4444', '#22c55e']
bars = ax2.bar(labels, forces_kn, color=colors, width=0.5)
ax2.set_ylabel('Average force (kN)', color='white')
ax2.set_title('Peak Force Comparison', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for bar, f in zip(bars, forces_kn):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
             f'{f:.0f} kN', ha='center', color='white', fontsize=11)

# G-forces on occupant
ax3.set_facecolor('#111827')
occupant_mass = 75  # kg
g_rigid = F_rigid / (occupant_mass * 9.8)
g_crumple = F_crumple / (occupant_mass * 9.8)
bars3 = ax3.bar(labels, [g_rigid, g_crumple], color=colors, width=0.5)
ax3.axhline(80, color='#f59e0b', linestyle='--', linewidth=1, label='Survivability limit (~80g)')
ax3.set_ylabel('G-force on occupant', color='white')
ax3.set_title('Occupant G-Force', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')
for bar, g in zip(bars3, [g_rigid, g_crumple]):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
             f'{g:.0f}g', ha='center', color='white', fontsize=11)

# Energy absorption
ax4.set_facecolor('#111827')
crush_d = np.linspace(0.05, 1.0, 100)
force_for_d = KE / crush_d / 1000  # kN
g_for_d = KE / crush_d / (occupant_mass * 9.8)
ax4.plot(crush_d * 100, g_for_d, color='#3b82f6', linewidth=2)
ax4.axhline(80, color='#f59e0b', linestyle='--', linewidth=1, label='Survivability limit')
ax4.fill_between(crush_d * 100, g_for_d, 80, where=g_for_d > 80, alpha=0.15, color='#ef4444')
ax4.fill_between(crush_d * 100, g_for_d, 0, where=g_for_d <= 80, alpha=0.15, color='#22c55e')
ax4.set_xlabel('Crush distance (cm)', color='white')
ax4.set_ylabel('Occupant g-force', color='white')
ax4.set_title('Required Crush Distance for Survival', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

min_d = KE / (80 * occupant_mass * 9.8)
print(f"Kinetic energy: {KE:,.0f} J ({KE/1000:.1f} kJ)")
print(f"Rigid car ({d_rigid*100:.0f}cm crush): {g_rigid:.0f}g — FATAL")
print(f"Crumple zone ({d_crumple*100:.0f}cm crush): {g_crumple:.0f}g — survivable")
print(f"Minimum crush distance for survival: {min_d*100:.0f}cm")`,
      challenge: 'Repeat the simulation for 100 km/h (27.8 m/s). How much crush distance is needed to keep occupant g-force below 80g? Modern race cars have crashes at 200+ km/h — what engineering tricks make survival possible?',
      successHint: 'Crumple zones transformed car safety in the 20th century. The woodpecker skull shows that nature solved the same problem millions of years earlier. Understanding the physics lets you design for any impact scenario.',
    },
    {
      title: 'Helmet design — from ancient to biomimetic',
      concept: `Modern helmet design has evolved through several generations:

**Gen 1 — Hard shell only** (pre-1970s): Steel or hard plastic. Distributed force over a larger area but didn't absorb much energy. Like wearing a salad bowl.

**Gen 2 — EPS foam liner** (1970s-2010s): Expanded polystyrene (styrofoam) liner crushes on impact, absorbing energy. Single-use — once crushed, it's done. This is still most helmets today.

**Gen 3 — MIPS** (2010s): Multi-directional Impact Protection System. A low-friction liner between shell and head allows rotational sliding, reducing rotational forces that cause diffuse axonal injury (the most dangerous type of concussion).

**Gen 4 — Bio-inspired multi-layer** (emerging): Inspired by the woodpecker skull:
- Outer shell (beak) — distributes point loads
- Corrugated/cellular middle layer (spongy bone) — progressive crushing
- Shear-decoupling layer (hyoid/CSF) — reduces rotation
- Tight-fitting inner liner (tight brain cavity) — prevents movement

Each generation addressed a new failure mode, getting closer to nature's solution.`,
      analogy: 'Helmet evolution is like software updates. Version 1.0 (hard shell) stopped the obvious bugs (skull fracture). Version 2.0 (foam) fixed the performance issues (energy absorption). Version 3.0 (MIPS) addressed a subtle bug (rotation). Version 4.0 (bio-inspired) is a ground-up rewrite inspired by the best codebase in existence: evolution.',
      storyConnection: 'The woodpecker\'s "helmet" was perfected over 25 million years of evolution. Each feature — spongy bone, hyoid wrap, tight brain fit — addressed a specific failure mode. Human helmet design is converging on the same solution set, just compressed into 50 years of engineering instead of 25 million years of natural selection.',
      checkQuestion: 'Why are rotational forces more dangerous to the brain than linear (straight-line) forces?',
      checkAnswer: 'The brain is made of layers (gray matter, white matter) with different densities. Rotational acceleration causes these layers to slide against each other, shearing the axons (nerve fibers) that connect them. This is called diffuse axonal injury and is the most common cause of severe concussion and traumatic brain injury. Linear forces compress the brain; rotational forces tear it.',
      codeIntro: 'Compare the protection characteristics of different helmet generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Helmet generation comparison
# Simulate a 5 m/s impact (typical cycling crash)

time = np.linspace(0, 15, 1000)  # ms
impact_v = 5.0  # m/s
head_mass = 4.5  # kg

# Input impact pulse
J = head_mass * impact_v  # impulse

# Gen 1: Hard shell only — short, sharp force
gen1 = 800 * np.exp(-((time - 2)**2) / 0.8)
gen1 = gen1 / np.trapz(gen1, time/1000) * J

# Gen 2: EPS foam — medium duration, medium force
gen2 = 400 * np.exp(-((time - 4)**2) / 3)
gen2 = gen2 / np.trapz(gen2, time/1000) * J

# Gen 3: MIPS — similar linear but reduced rotational
gen3_linear = gen2 * 0.95  # slightly better linear
gen3_rotational = gen2 * 0.4  # much better rotational

# Gen 4: Bio-inspired — long duration, low force
gen4 = 200 * np.exp(-((time - 6)**2) / 8)
gen4 = gen4 / np.trapz(gen4, time/1000) * J

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Linear force comparison
ax1.set_facecolor('#111827')
ax1.plot(time, gen1 / (head_mass * 9.8), color='#6b7280', linewidth=2, label='Gen 1: Hard shell')
ax1.plot(time, gen2 / (head_mass * 9.8), color='#f59e0b', linewidth=2, label='Gen 2: EPS foam')
ax1.plot(time, gen4 / (head_mass * 9.8), color='#22c55e', linewidth=2, label='Gen 4: Bio-inspired')
ax1.axhline(150, color='#ef4444', linestyle='--', linewidth=1, label='Concussion risk (150g)')
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Linear acceleration (g)', color='white')
ax1.set_title('Linear Impact: Helmet Generations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Radar chart of protection features
categories = ['Linear\\nabsorption', 'Rotational\\nprotection', 'Multi-impact\\nsurvival', 'Weight', 'Ventilation', 'Cost']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

helmets = {
    'Gen 1: Hard shell': [3, 1, 8, 3, 4, 9],
    'Gen 2: EPS foam': [7, 3, 2, 7, 6, 7],
    'Gen 3: MIPS': [7, 7, 2, 6, 5, 5],
    'Gen 4: Bio-inspired': [9, 8, 6, 5, 4, 3],
}
h_colors = {'Gen 1: Hard shell': '#6b7280', 'Gen 2: EPS foam': '#f59e0b',
            'Gen 3: MIPS': '#3b82f6', 'Gen 4: Bio-inspired': '#22c55e'}

ax2 = fig.add_subplot(122, polar=True)
ax2.set_facecolor('#111827')
for name, values in helmets.items():
    values_plot = values + values[:1]
    ax2.plot(angles, values_plot, 'o-', linewidth=2, label=name, color=h_colors[name])
    ax2.fill(angles, values_plot, alpha=0.08, color=h_colors[name])

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylim(0, 10)
ax2.set_yticks([2, 4, 6, 8, 10])
ax2.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax2.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_title('Feature Comparison', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Helmet evolution summary:")
print("  Gen 1 (Hard shell): Prevents skull fracture, poor energy absorption")
print("  Gen 2 (EPS foam):   Good energy absorption, single-use, no rotation protection")
print("  Gen 3 (MIPS):       Adds rotational protection via sliding liner")
print("  Gen 4 (Bio-inspired): Multi-layer, multi-impact, closest to woodpecker skull")
print()
print("The woodpecker has had all four features for 25 million years.")`,
      challenge: 'Design a Gen 5 helmet. What additional feature would it need? Consider: active sensors, variable stiffness materials, real-time impact data transmission. Sketch its radar chart profile.',
      successHint: 'Helmet design is a case study in convergent engineering — human designers independently arrive at the same solutions evolution found. Understanding WHY each feature exists lets you innovate beyond copying.',
    },
    {
      title: 'Impact testing standards — how we certify safety',
      concept: `How do we know a helmet actually works? Through standardized **impact testing**. Major standards include:

**CPSC** (US cycling): Drop a headform with helmet from 2m onto a flat anvil. Peak acceleration must stay below 300g.

**ECE 22.06** (European motorcycle): Multiple impacts at different sites, speeds up to 8.2 m/s. Limits: 275g peak, HIC (Head Injury Criterion) < 2400.

**Snell** (voluntary, stricter): Higher impact speeds, multiple hits, penetration resistance.

**The Head Injury Criterion (HIC)** is the gold standard metric:

**HIC = max[ (t2-t1) * (1/(t2-t1) * integral(a(t)dt))^2.5 ]**

Where a(t) is the acceleration-time history. HIC captures both peak force AND duration — a brief 200g spike is less dangerous than a sustained 150g load.

Thresholds:
- HIC < 700: Low risk of serious injury
- HIC 700-1000: Moderate risk
- HIC > 1000: High risk of skull fracture or brain injury`,
      analogy: 'Impact testing standards are like exam grading rubrics. The student (helmet) takes a test (controlled impact). The rubric (standard) defines what constitutes a pass. Different tests (CPSC vs ECE vs Snell) have different rubrics — like how a driving test differs from country to country. The best helmets pass all tests with margin.',
      storyConnection: 'The woodpecker "tests" its skull protection system 12,000 times per day, every day, for its entire life — far more rigorous than any human certification test. If we tested helmets to woodpecker standards (1,200g, 12,000 reps/day), no human-made helmet would currently pass.',
      checkQuestion: 'Why does the HIC criterion use the 2.5 power exponent? What happens if you replace it with 1.0?',
      checkAnswer: 'The 2.5 exponent comes from empirical data on cadaver skull fractures. It makes HIC highly sensitive to peak acceleration — a 2x increase in peak g causes a 5.7x increase in HIC (2^2.5 = 5.66). With exponent 1.0, HIC would be just the average acceleration times duration, which doesn\'t capture the outsized danger of peak forces. The non-linear exponent reflects the non-linear way brain tissue responds to acceleration.',
      codeIntro: 'Calculate the HIC value for different impact profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Calculate HIC (Head Injury Criterion)
# HIC = max over (t1,t2) of: (t2-t1) * [1/(t2-t1) * integral(a, t1, t2)]^2.5

def calculate_hic(time_s, accel_g, max_window=0.015):
    """Calculate HIC over sliding windows up to max_window seconds."""
    dt = time_s[1] - time_s[0]
    n = len(time_s)
    max_samples = int(max_window / dt)
    hic_max = 0
    best_t1, best_t2 = 0, 0

    for i in range(n):
        for j in range(i + 1, min(i + max_samples, n)):
            t1, t2 = time_s[i], time_s[j]
            dur = t2 - t1
            if dur < 0.001:
                continue
            avg_a = np.trapz(accel_g[i:j+1], time_s[i:j+1]) / dur
            hic = dur * (abs(avg_a)) ** 2.5
            if hic > hic_max:
                hic_max = hic
                best_t1, best_t2 = t1, t2
    return hic_max, best_t1, best_t2

# Three impact profiles (same impulse, different shapes)
time = np.linspace(0, 0.02, 500)  # 20ms in seconds

# Profile A: Short, high peak (bad helmet)
a_bad = 350 * np.exp(-((time - 0.003)**2) / 0.000002)
# Profile B: Medium (decent helmet)
a_decent = 200 * np.exp(-((time - 0.005)**2) / 0.000008)
# Profile C: Extended, low peak (bio-inspired)
a_good = 120 * np.exp(-((time - 0.008)**2) / 0.00003)

profiles = [
    ('Poor helmet', a_bad, '#ef4444'),
    ('Standard helmet', a_decent, '#f59e0b'),
    ('Bio-inspired', a_good, '#22c55e'),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Force profiles
ax1.set_facecolor('#111827')
hic_values = []
for name, accel, color in profiles:
    ax1.plot(time * 1000, accel, color=color, linewidth=2, label=name)
    hic_val, t1, t2 = calculate_hic(time, accel)
    hic_values.append((name, hic_val, max(accel), color))

ax1.axhline(300, color='white', linestyle=':', linewidth=1, alpha=0.5, label='CPSC limit (300g)')
ax1.set_xlabel('Time (ms)', color='white')
ax1.set_ylabel('Acceleration (g)', color='white')
ax1.set_title('Impact Acceleration Profiles', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# HIC comparison
ax2.set_facecolor('#111827')
names = [h[0] for h in hic_values]
hics = [h[1] for h in hic_values]
bar_colors = [h[3] for h in hic_values]
bars = ax2.bar(names, hics, color=bar_colors, width=0.5)
ax2.axhline(700, color='#f59e0b', linestyle='--', linewidth=1, label='Low risk limit (700)')
ax2.axhline(1000, color='#ef4444', linestyle='--', linewidth=1, label='High risk limit (1000)')
ax2.set_ylabel('HIC value', color='white')
ax2.set_title('Head Injury Criterion (HIC)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_xticklabels(names, color='white', fontsize=9)
for bar, hic in zip(bars, hics):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
             f'{hic:.0f}', ha='center', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("HIC Analysis:")
for name, hic, peak, _ in hic_values:
    risk = "LOW" if hic < 700 else "MODERATE" if hic < 1000 else "HIGH"
    print(f"  {name}: peak={peak:.0f}g, HIC={hic:.0f} ({risk} risk)")
print()
print("Notice: the bio-inspired profile has the lowest HIC")
print("because it spreads force over time AND reduces peak g.")
print("HIC punishes high peaks disproportionately (exponent 2.5).")`,
      challenge: 'The CPSC standard only requires peak g < 300. Calculate the HIC for an impact that just barely passes CPSC (299g peak, 2ms duration). Would it pass the HIC < 700 criterion? This reveals a weakness in the CPSC standard.',
      successHint: 'Standards evolve as our understanding of injury mechanics improves. HIC is better than peak-g alone, but even HIC doesn\'t capture rotational injury. Every standard is an approximation — the quest for better metrics continues.',
    },
    {
      title: 'Finite element analysis basics — simulating impact digitally',
      concept: `**Finite Element Analysis (FEA)** is a computational method for simulating how objects respond to forces. Instead of solving one impossible equation for the entire object, FEA:

1. **Divides** the object into thousands of tiny elements (triangles, cubes)
2. **Assigns** material properties to each element (stiffness, density, strength)
3. **Applies** forces and constraints (boundary conditions)
4. **Solves** simple equations for each element
5. **Assembles** the results into a complete picture

For impact engineering, FEA lets us:
- Simulate a car crash without crashing a real car ($10,000 vs $500,000)
- Test a helmet design before manufacturing it
- Visualize stress, strain, and deformation inside materials
- Optimize designs by running thousands of variations

The woodpecker skull has been FEA-modeled by multiple research groups. The results confirmed what anatomy suggested: the spongy bone and hyoid bone are critical stress-management features.

FEA requires three things: **geometry** (the shape), **material model** (how the material behaves), and **loading** (what forces are applied).`,
      analogy: 'FEA is like understanding a crowd of people by asking each person individually. If you tried to predict how 10,000 people would move through a stadium exit at once, the group problem is impossibly complex. But if you break it into 10,000 individual decisions (each person moves toward the nearest gap), and combine all the individual answers, you get a realistic simulation of the crowd.',
      storyConnection: 'The woodpecker\'s skull was "designed" by evolution — 25 million years of trial and error. FEA lets engineers compress that process: simulate thousands of design variations in hours, test each one virtually, and converge on the best solution. FEA is evolution on a computer.',
      checkQuestion: 'If you double the number of elements in an FEA model (finer mesh), what happens to accuracy and computation time?',
      checkAnswer: 'Accuracy improves (up to a point — there are diminishing returns). But computation time increases roughly as N^2 to N^3 (depending on the solver), where N is the number of elements. Doubling elements can quadruple or octuple solve time. This is why FEA is a balance between accuracy and computational cost — fine meshes in critical areas, coarse meshes elsewhere.',
      codeIntro: 'Create a simple 2D FEA-style simulation of stress in a beam under impact.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple 2D stress visualization for a beam under impact
# This is a conceptual FEA demonstration

# Create a mesh (grid of elements)
nx, ny = 40, 10  # elements in x and y
x = np.linspace(0, 100, nx + 1)  # mm
y = np.linspace(0, 25, ny + 1)   # mm
X, Y = np.meshgrid(x[:-1] + np.diff(x)/2, y[:-1] + np.diff(y)/2)

# Simulate stress from a point impact at center-top
impact_x, impact_y = 50, 25  # impact point (center, top surface)

# Distance from impact point
dist = np.sqrt((X - impact_x)**2 + (Y - impact_y)**2)

# Stress decreases with distance (simplified Saint-Venant principle)
# In real FEA, this would be solved element-by-element
stress = 500 / (1 + (dist / 8)**2)  # MPa (simplified)

# Add material effect: spongy bone layer at top absorbs stress
spongy_layer = Y > 18  # top ~30% is spongy
stress_with_spongy = stress.copy()
stress_with_spongy[spongy_layer] *= 0.4  # spongy bone reduces transmission
stress_without = stress.copy()

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(14, 4))
fig.patch.set_facecolor('#1f2937')

# Without spongy bone
ax1.set_facecolor('#111827')
im1 = ax1.pcolormesh(x, y, stress_without, cmap='hot', shading='flat')
ax1.plot(impact_x, impact_y, 'v', color='white', markersize=12)
ax1.set_title('Rigid Bone (no spongy layer)', color='white', fontsize=10)
ax1.set_xlabel('Position (mm)', color='white')
ax1.set_ylabel('Depth (mm)', color='white')
ax1.tick_params(colors='gray')
plt.colorbar(im1, ax=ax1, label='Stress (MPa)')

# With spongy bone
ax2.set_facecolor('#111827')
im2 = ax2.pcolormesh(x, y, stress_with_spongy, cmap='hot', shading='flat',
                      vmin=0, vmax=stress_without.max())
ax2.plot(impact_x, impact_y, 'v', color='white', markersize=12)
ax2.axhline(18, color='#22c55e', linestyle='--', linewidth=1, label='Spongy bone boundary')
ax2.set_title('With Spongy Bone Layer', color='white', fontsize=10)
ax2.set_xlabel('Position (mm)', color='white')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
plt.colorbar(im2, ax=ax2, label='Stress (MPa)')

# Stress through depth (vertical line at impact point)
ax3.set_facecolor('#111827')
center_col = nx // 2
stress_depth_rigid = stress_without[:, center_col]
stress_depth_spongy = stress_with_spongy[:, center_col]
y_centers = y[:-1] + np.diff(y)/2

ax3.plot(stress_depth_rigid, y_centers, color='#ef4444', linewidth=2, label='Rigid bone')
ax3.plot(stress_depth_spongy, y_centers, color='#22c55e', linewidth=2, label='With spongy layer')
ax3.axhline(18, color='#22c55e', linestyle=':', linewidth=1, alpha=0.5)
ax3.set_xlabel('Stress at impact center (MPa)', color='white')
ax3.set_ylabel('Depth from bottom (mm)', color='white')
ax3.set_title('Stress vs Depth', color='white', fontsize=10)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

peak_rigid = stress_without.min()
brain_stress_rigid = stress_without[0, center_col]
brain_stress_spongy = stress_with_spongy[0, center_col]
print("FEA Concept Demonstration:")
print(f"  Peak stress at impact: {stress_without.max():.0f} MPa")
print(f"  Stress at brain (rigid): {brain_stress_rigid:.0f} MPa")
print(f"  Stress at brain (spongy): {brain_stress_spongy:.0f} MPa")
print(f"  Reduction from spongy bone: {(1-brain_stress_spongy/brain_stress_rigid)*100:.0f}%")
print()
print("Real FEA would use:")
print("  - Thousands of 3D tetrahedral elements")
print("  - Non-linear material models (bone, brain tissue)")
print("  - Time-stepping for dynamic impacts")
print("  - Validated against experimental data")`,
      challenge: 'Move the impact point to the edge (x=10, y=25). How does the stress pattern change? In real woodpecker impacts, the beak hits off-center — does this matter for brain safety?',
      successHint: 'FEA is the bridge between theoretical physics and practical engineering. It lets you test ideas that would be too expensive, too dangerous, or too slow to test physically. Every modern helmet, car, and building is designed with FEA.',
    },
    {
      title: 'Sports injury biomechanics — protecting the human brain',
      concept: `The intersection of woodpecker biomechanics and sports medicine is **sports injury biomechanics** — the study of how athletic impacts damage the body and how to prevent them.

Key findings from this field:

**Concussion mechanics**: A concussion occurs when the brain moves inside the skull, causing:
- Stretching and shearing of axons (nerve fibers)
- Disruption of ion channels (brain's electrical system)
- Inflammatory cascade (swelling, secondary damage)
- Symptoms: headache, confusion, memory loss, balance problems

**Cumulative damage (CTE)**: Repeated sub-concussive impacts (below the concussion threshold) accumulate damage over time. This is **Chronic Traumatic Encephalopathy** — found in football players, boxers, and soccer headers. The woodpecker DOESN'T get CTE despite massive repeated impacts, which makes its skull even more remarkable.

**Neck muscles matter**: Studies show that stronger neck muscles reduce concussion risk because they prevent the head from snapping. The woodpecker has exceptionally strong neck muscles that stabilize the head during impact.

**The 10 ms rule**: Most brain injuries occur in the first 10 milliseconds of an impact. Protection systems must activate within this window to be effective.`,
      analogy: 'The brain is like a bowl of jelly on a bus. When the bus stops suddenly, the jelly slides forward and hits the bowl. If the bus stops slowly, the jelly stays put. Concussions happen when the "bus" (skull) stops but the "jelly" (brain) keeps moving. The woodpecker\'s tight brain fit is like vacuum-sealing the jelly to the bowl — it can\'t slosh.',
      storyConnection: 'The woodpecker drums 12,000 times a day for years without CTE. Human football players develop CTE from far fewer impacts at lower g-forces. Understanding why the woodpecker is immune to cumulative brain damage could revolutionize how we protect athletes — the drum that echoes through the forest may one day echo through every sports league\'s safety protocols.',
      checkQuestion: 'A soccer player heads the ball about 6-12 times per game. Each header produces about 20-30g of acceleration. Over a 20-year career with 50 games per year, how many total headers is that? Compare to the woodpecker.',
      checkAnswer: 'At 10 headers per game, 50 games per year, 20 years: 10 * 50 * 20 = 10,000 headers at 20-30g each. A woodpecker does 12,000 pecks per day at 1,200g each. In ONE DAY, the woodpecker exceeds a soccer player\'s entire career in both count and intensity. Yet the woodpecker shows no brain damage. This is why researchers are so interested in the woodpecker skull.',
      codeIntro: 'Model cumulative brain damage from repeated impacts in humans vs. woodpeckers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cumulative brain damage model
# Simplified: damage accumulates as sum of (g-force / threshold)^n per impact
# With partial recovery between impacts

def cumulative_damage(n_impacts, g_force, threshold, recovery_rate, power=2):
    """Model cumulative damage with partial recovery."""
    damage = np.zeros(n_impacts + 1)
    for i in range(1, n_impacts + 1):
        # Add damage from this impact
        impact_damage = (g_force / threshold) ** power
        # Apply recovery from time between impacts
        damage[i] = max(0, damage[i-1] * (1 - recovery_rate) + impact_damage)
    return damage

# Scenario 1: Football player (500 impacts/season, 80g average)
football_impacts = 500
football_g = 80
football_damage = cumulative_damage(football_impacts * 15, football_g, 150, 0.001)

# Scenario 2: Soccer player (200 headers/season, 25g average)
soccer_impacts = 200
soccer_g = 25
soccer_damage = cumulative_damage(soccer_impacts * 20, soccer_g, 150, 0.002)

# Scenario 3: Woodpecker (12,000 pecks/day, 1200g)
# But with much higher threshold and recovery
woodpecker_damage = cumulative_damage(12000 * 365, 1200, 15000, 0.01)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Football career
seasons_fb = np.linspace(0, 15, len(football_damage))
ax1.set_facecolor('#111827')
ax1.plot(seasons_fb, football_damage, color='#ef4444', linewidth=2)
ax1.fill_between(seasons_fb, football_damage, alpha=0.15, color='#ef4444')
ax1.axhline(100, color='#f59e0b', linestyle='--', linewidth=1, label='CTE risk threshold')
ax1.set_xlabel('Seasons', color='white')
ax1.set_ylabel('Cumulative damage index', color='white')
ax1.set_title('Football: 500 impacts/season at 80g', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Soccer career
seasons_sc = np.linspace(0, 20, len(soccer_damage))
ax2.set_facecolor('#111827')
ax2.plot(seasons_sc, soccer_damage, color='#f59e0b', linewidth=2)
ax2.fill_between(seasons_sc, soccer_damage, alpha=0.15, color='#f59e0b')
ax2.axhline(100, color='#f59e0b', linestyle='--', linewidth=1, label='CTE risk threshold')
ax2.set_xlabel('Seasons', color='white')
ax2.set_ylabel('Cumulative damage index', color='white')
ax2.set_title('Soccer: 200 headers/season at 25g', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Woodpecker lifetime
days_wp = np.linspace(0, 365 * 8, len(woodpecker_damage))  # 8 year lifespan
ax3.set_facecolor('#111827')
ax3.plot(days_wp / 365, woodpecker_damage, color='#22c55e', linewidth=2)
ax3.fill_between(days_wp / 365, woodpecker_damage, alpha=0.15, color='#22c55e')
ax3.set_xlabel('Years', color='white')
ax3.set_ylabel('Cumulative damage index', color='white')
ax3.set_title('Woodpecker: 12,000 pecks/day at 1,200g', color='white', fontsize=11)
ax3.tick_params(colors='gray')

# Comparison bar chart
ax4.set_facecolor('#111827')
scenarios = ['Football\\n(15 seasons)', 'Soccer\\n(20 seasons)', 'Woodpecker\\n(8 years)']
final_damage = [football_damage[-1], soccer_damage[-1], woodpecker_damage[-1]]
colors = ['#ef4444', '#f59e0b', '#22c55e']
bars = ax4.bar(scenarios, final_damage, color=colors, width=0.5)
ax4.axhline(100, color='#f59e0b', linestyle='--', linewidth=1, label='CTE risk')
ax4.set_ylabel('Final damage index', color='white')
ax4.set_title('Lifetime Cumulative Damage', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
for bar, d in zip(bars, final_damage):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'{d:.0f}', ha='center', color='white', fontsize=11)

plt.tight_layout()
plt.show()

total_fb = football_impacts * 15
total_sc = soccer_impacts * 20
total_wp = 12000 * 365 * 8
print(f"Total lifetime impacts:")
print(f"  Football player: {total_fb:,} at {football_g}g avg")
print(f"  Soccer player:   {total_sc:,} at {soccer_g}g avg")
print(f"  Woodpecker:      {total_wp:,} at 1,200g avg")
print()
print("The woodpecker sustains 1000x more impacts at 15x higher g-force")
print("yet accumulates less damage. The key differences:")
print("  1. Skull absorbs 70%+ of impact energy (never reaches brain)")
print("  2. Tight brain fit prevents shearing (no axon stretching)")
print("  3. Superior neural repair mechanisms (faster recovery)")
print("  4. Straight-line impacts only (no rotation — the main CTE cause)")`,
      challenge: 'Adjust the recovery rate for the football player from 0.001 to 0.01 (better rest between impacts). How much does this reduce career damage? This models the effect of rest protocols and return-to-play guidelines.',
      successHint: 'From impulse-momentum to crumple zones to helmets to testing standards to FEA to sports biomechanics — you\'ve built a complete engineering toolkit for understanding and preventing impact injuries. The woodpecker was both the inspiration and the benchmark.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 biomechanics foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for impact engineering simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}