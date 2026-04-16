import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillHelmetLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Force and impact — what happens when a hornbill headbutts a tree?',
      concept: `The Great Hornbill (*Buceros bicornis*) of Nagaland has a massive **casque** (helmet-like structure) on its head. During territorial battles, males headbutt each other in mid-air at speeds up to 40 km/h.

**Impact force** depends on how quickly momentum changes:
**F = m × Δv / Δt**

Where:
- m = mass of the head/casque (~0.3 kg)
- Δv = change in velocity (from 11 m/s to 0)
- Δt = duration of impact

If the impact lasts 0.01 seconds: F = 0.3 × 11 / 0.01 = 330 N
If the impact lasts 0.1 seconds: F = 0.3 × 11 / 0.1 = 33 N

The casque extends the impact time, reducing peak force by 10×. This is the fundamental principle behind helmets, car crumple zones, and airbags.

📚 *In Python, **variables** store values with the = sign. We can name them descriptively: impact_force = mass * velocity / time.*`,
      analogy: 'Catching a fast cricket ball bare-handed hurts because your hand stops the ball in milliseconds (short Δt = high force). Catching with soft hands (pulling back as you catch) takes longer (long Δt = low force). The hornbill\'s casque is like catching with soft hands — it extends the impact duration, spreading the force over time.',
      storyConnection: 'In Nagaland, the hornbill is revered as a symbol of courage and resilience. The Hornbill Festival celebrates this bird. The casque is not just decoration — it is an engineering marvel that protects the bird\'s brain during high-speed aerial combat. Understanding its design teaches us about impact engineering.',
      checkQuestion: 'If the hornbill could somehow make its casque infinitely spongy (infinitely long impact time), would the impact force reach zero?',
      checkAnswer: 'Mathematically, as Δt approaches infinity, F approaches zero. In practice, the casque cannot be infinitely spongy — it would collapse completely. There is an optimal stiffness: soft enough to extend impact time significantly, but rigid enough to prevent the skull underneath from being struck. This optimal balance is exactly what evolution has achieved.',
      codeIntro: 'Calculate impact forces for hornbill headbutts at different impact durations.',
      code: `# Hornbill headbutt impact analysis

mass = 0.3    # kg (head + casque)
velocity = 11  # m/s (40 km/h)
momentum = mass * velocity

print("Great Hornbill Headbutt — Impact Force Analysis")
print(f"Head mass: {mass} kg | Impact velocity: {velocity} m/s ({velocity*3.6:.0f} km/h)")
print(f"Momentum: {momentum:.2f} kg·m/s")
print("=" * 55)

# Different impact durations
durations = [0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5]

print(f"{'Duration (ms)':>14} | {'Force (N)':>10} | {'g-force':>8} | {'Equivalent'}")
print("-" * 55)

for dt in durations:
    force = momentum / dt
    g_force = force / (mass * 9.81)

    if force > 200:
        equiv = "concussion risk"
    elif force > 50:
        equiv = "hard punch"
    elif force > 10:
        equiv = "firm tap"
    else:
        equiv = "gentle touch"

    bar = "█" * min(50, int(force / 20))
    print(f"  {dt*1000:>10.1f} ms | {force:>8.1f} N | {g_force:>6.0f} g | {equiv} {bar}")

print()
# Without casque vs with casque
dt_bare = 0.005   # 5 ms without casque
dt_casque = 0.08  # 80 ms with casque
F_bare = momentum / dt_bare
F_casque = momentum / dt_casque
reduction = (1 - F_casque / F_bare) * 100

print(f"Without casque (5 ms impact):  {F_bare:.0f} N ({F_bare/(mass*9.81):.0f} g)")
print(f"With casque (80 ms impact):    {F_casque:.1f} N ({F_casque/(mass*9.81):.0f} g)")
print(f"Force reduction: {reduction:.0f}%")
print(f"The casque reduces impact force by {F_bare/F_casque:.0f}x!")`,
      challenge: 'Calculate what happens if two hornbills collide head-on (both moving at 11 m/s toward each other). Is the impact force doubled? What is the relative velocity?',
      successHint: 'You have learned the fundamental equation of impact engineering: F = Δp/Δt. Extending impact time reduces force. This single principle explains helmets, airbags, crumple zones, and the hornbill\'s casque.',
    },
    {
      title: 'Energy absorption — where does the kinetic energy go?',
      concept: `When the hornbill\'s casque absorbs an impact, kinetic energy must be converted to other forms:

**KE = ½mv²**

For the hornbill: KE = ½ × 0.3 × 11² = 18.15 J

This energy is converted to:
1. **Elastic deformation**: casque compresses, then springs back (~40%)
2. **Plastic deformation**: permanent crushing of cellular structure (~35%)
3. **Heat**: microscopic friction between cells (~15%)
4. **Sound**: the loud crack of the impact (~10%)

A good impact absorber converts as much KE as possible into **plastic deformation** — permanent crushing that dissipates energy without bouncing. Bouncing (elastic rebound) means the energy was NOT absorbed.

📚 *Python can calculate with **expressions**: result = 0.5 * mass * velocity**2. The ** operator means "to the power of".*`,
      analogy: 'Imagine dropping an egg onto concrete vs onto a pillow. Both receive the same kinetic energy. The concrete bounces the egg (elastic — energy returned) and it shatters. The pillow crushes permanently (plastic — energy absorbed) and the egg survives. The casque is like a biological pillow that crushes in a controlled way.',
      storyConnection: 'The hornbill\'s casque evolved to absorb energy, not reflect it. A helmet that bounces the impact back would be worse than useless — the rebound forces would damage the brain. This is why modern helmets are designed to crack and deform on impact, just like the casque.',
      checkQuestion: 'Why is a helmet that cracks on impact BETTER than one that stays perfectly intact?',
      checkAnswer: 'A cracked helmet absorbed energy through plastic deformation — it used the impact energy to break its own structure, protecting your head. An intact helmet either bounced the energy back (elastic — still dangerous to the brain) or transmitted it through to the skull. This is why you must replace a helmet after any impact, even if it looks fine — it has already done its job by absorbing energy through internal micro-cracking.',
      codeIntro: 'Calculate the energy budget of a hornbill headbutt impact.',
      code: `# Energy analysis of hornbill headbutt

mass = 0.3   # kg
velocity = 11  # m/s

KE = 0.5 * mass * velocity**2

print("Hornbill Headbutt — Energy Budget")
print(f"Kinetic energy at impact: {KE:.2f} J")
print("=" * 50)

# Energy distribution in the casque
categories = [
    ("Elastic deformation (springs back)", 0.40),
    ("Plastic deformation (permanent)", 0.35),
    ("Heat (internal friction)", 0.15),
    ("Sound (crack of impact)", 0.10),
]

print(f"\
{'Energy destination':>40} | {'Joules':>6} | {'%':>4}")
print("-" * 55)

for name, fraction in categories:
    energy = KE * fraction
    bar = "█" * int(fraction * 40)
    print(f"  {name:>38} | {energy:>5.2f} | {fraction*100:>3.0f}% {bar}")

# Compare with human head impact
print("\
--- Comparison: Human motorcycle helmet ---")
human_mass = 5.0    # kg (head)
human_velocity = 8  # m/s (~30 km/h crash)
human_KE = 0.5 * human_mass * human_velocity**2

print(f"Human head KE at 30 km/h: {human_KE:.0f} J")
print(f"Hornbill casque KE:       {KE:.1f} J")
print(f"Human helmet must absorb {human_KE/KE:.0f}x more energy!")

# Energy per unit mass comparison
casque_mass = 0.05    # kg (casque alone)
helmet_mass = 0.5     # kg (motorcycle helmet padding)
casque_energy_density = KE / casque_mass
helmet_energy_density = human_KE / helmet_mass

print(f"\
Energy absorption per gram:")
print(f"  Hornbill casque: {casque_energy_density:.1f} J/kg = {casque_energy_density/1000:.2f} J/g")
print(f"  Motorcycle foam: {helmet_energy_density:.1f} J/kg = {helmet_energy_density/1000:.2f} J/g")
print(f"  The casque is {casque_energy_density/helmet_energy_density:.1f}x more efficient per gram!")`,
      challenge: 'If a hornbill headbutts 50 times during a territorial fight, what is the total energy absorbed? Assuming 35% goes to plastic deformation each time, how much cumulative damage does the casque sustain? Can it recover between fights?',
      successHint: 'You now understand energy conversion during impact. The key insight is that plastic deformation (permanent crushing) absorbs energy safely, while elastic rebound can be dangerous. This is why both the casque and modern helmets are designed to deform.',
    },
    {
      title: 'Cellular solids — the secret architecture of the casque',
      concept: `The hornbill casque is not solid bone — it is a **cellular solid**: a network of thin walls enclosing air-filled cells, similar to a honeycomb or foam.

Cellular solids have remarkable properties:
- **Lightweight**: 80-95% air by volume
- **Energy absorbing**: cells crush progressively
- **Stiff enough**: the cell walls provide structural rigidity

The **relative density** (ρ*/ρs) compares the cellular material density to the solid wall material density:

ρ*/ρs = fraction of material that is solid

For the hornbill casque: ρ*/ρs ≈ 0.15 (only 15% solid, 85% air)

The stiffness of a cellular solid scales as:
**E* / Es ≈ (ρ*/ρs)²** for open-cell foams

So at 15% density: E*/Es = 0.15² = 0.023 — only 2.3% as stiff as solid bone.

📚 *Python can format output neatly using **f-strings**: print(f"Value: {variable:.2f}") shows the variable with 2 decimal places.*`,
      analogy: 'A cellular solid is like bubble wrap. Each bubble is a tiny air cushion enclosed by a thin plastic wall. Squeeze one bubble and it pops (absorbs energy). Squeeze many and they pop sequentially (extended energy absorption). The hornbill casque has millions of microscopic "bubbles" that crush progressively during impact.',
      storyConnection: 'When Naga craftspeople make traditional hornbill-inspired headdresses, they use layered materials — not solid blocks. Instinctively, they replicate the cellular structure principle. The natural design that took millions of years to evolve is echoed in traditional craftsmanship.',
      checkQuestion: 'If the casque were solid bone instead of cellular, would it protect better or worse?',
      checkAnswer: 'Much worse, for two reasons: (1) Solid bone is too stiff — it would transmit the impact force directly to the skull without deforming. (2) Solid bone is much heavier — the hornbill would have difficulty flying with a solid casque. The cellular structure provides the perfect balance: light enough to fly, soft enough to deform, strong enough to not collapse completely. This is engineering optimization by natural selection.',
      codeIntro: 'Calculate the properties of the casque cellular structure and compare to other materials.',
      code: `# Cellular solid properties of hornbill casque

# Material properties of solid bone
rho_solid = 1900   # kg/m³ (compact bone density)
E_solid = 18e9     # Pa (Young's modulus of bone)
sigma_solid = 130e6 # Pa (compressive strength of bone)

# Casque cellular structure
relative_densities = [0.05, 0.10, 0.15, 0.20, 0.30, 0.50, 1.0]

print("Hornbill Casque — Cellular Solid Properties")
print(f"Solid bone: ρ={rho_solid} kg/m³, E={E_solid/1e9:.0f} GPa, σ={sigma_solid/1e6:.0f} MPa")
print("=" * 70)
print(f"{'ρ*/ρs':>6} | {'Density':>10} | {'Stiffness':>10} | {'Strength':>10} | {'Air %':>6} | Use")
print("-" * 70)

for rd in relative_densities:
    density = rho_solid * rd
    # Gibson-Ashby scaling laws
    stiffness = E_solid * rd**2           # open-cell foam scaling
    strength = sigma_solid * rd**1.5       # crushing strength
    air_pct = (1 - rd) * 100

    if rd <= 0.10:
        use = "ultralight foam"
    elif rd <= 0.20:
        use = "HORNBILL CASQUE"
    elif rd <= 0.35:
        use = "protective foam"
    elif rd <= 0.60:
        use = "dense foam"
    else:
        use = "solid bone"

    marker = " <--" if 0.12 <= rd <= 0.18 else ""
    print(f"  {rd:>4.2f} | {density:>7.0f} kg/m³ | {stiffness/1e6:>7.1f} MPa | {strength/1e6:>7.2f} MPa | {air_pct:>5.0f}% | {use}{marker}")

print()
# The casque sweet spot
rd_casque = 0.15
casque_density = rho_solid * rd_casque
casque_stiffness = E_solid * rd_casque**2
casque_strength = sigma_solid * rd_casque**1.5

print(f"Hornbill casque (ρ*/ρs = {rd_casque}):")
print(f"  Density: {casque_density:.0f} kg/m³ (vs {rho_solid} solid)")
print(f"  Weight saving: {(1-rd_casque)*100:.0f}%")
print(f"  Stiffness: {casque_stiffness/1e6:.1f} MPa (vs {E_solid/1e9:.0f} GPa solid)")
print(f"  Crush strength: {casque_strength/1e6:.2f} MPa")
print(f"  This is soft enough to crush on impact, yet strong enough to protect")`,
      challenge: 'The hornbill casque has a hard outer shell (solid bone) over the cellular core. Calculate the combined stiffness if the outer shell is 2 mm thick solid bone on a 15 mm cellular core. How does this sandwich structure compare to pure foam?',
      successHint: 'You have learned about cellular solids — one of the most important material architectures in nature and engineering. The Gibson-Ashby scaling laws reveal how density controls stiffness and strength in foams.',
    },
    {
      title: 'Crumple zones — from hornbill to car safety',
      concept: `The hornbill casque is a natural **crumple zone** — a region designed to deform and absorb energy during a collision, protecting the critical structure behind it.

Modern cars use the same principle:
- **Front crumple zone**: 50-60 cm of crushable steel
- **Passenger cell**: rigid, non-deforming cabin
- **Rear crumple zone**: crushable trunk area

The physics:
**E_absorbed = F × d**

Where:
- E = energy absorbed (Joules)
- F = average crush force (Newtons)
- d = crush distance (meters)

To absorb 50,000 J of kinetic energy:
- With 0.5 m crush: F = 50,000 / 0.5 = 100,000 N (dangerous)
- With 1.0 m crush: F = 50,000 / 1.0 = 50,000 N (survivable)

More crush distance = lower force = higher survival rate.

📚 *Python **comparison operators** (>, <, ==, >=, <=) return True or False. They are used in **if** statements to make decisions.*`,
      analogy: 'A crumple zone is like a bouncer at a club. The bouncer (crumple zone) absorbs the impact of an aggressive patron (crash energy) so the people inside the club (passengers/brain) are not harmed. A car without crumple zones is like a club without a bouncer — every impact goes directly to the occupants.',
      storyConnection: 'The hornbill\'s casque invented crumple-zone technology 50 million years before human engineers. The cellular bone crushes progressively from front to back, exactly like a car\'s crumple zone. Nature solved this problem long before us, and engineers are now studying the casque to improve helmet and vehicle design.',
      checkQuestion: 'Why do racing cars disintegrate spectacularly in crashes but the driver often walks away?',
      checkAnswer: 'The car is DESIGNED to disintegrate. Every piece that breaks off absorbs energy through deformation. The survival cell (cockpit) is the one piece that does NOT deform — it is surrounded by crumple zones that sacrifice themselves. A crash where nothing breaks means all the energy was transmitted to the driver. The spectacular disintegration IS the safety system working.',
      codeIntro: 'Compare the crumple zone mechanics of a hornbill casque with a motorcycle helmet and a car.',
      code: `# Crumple zone comparison: hornbill, helmet, car

print("Crumple Zone Comparison")
print("=" * 70)

systems = [
    {
        'name': 'Hornbill casque',
        'mass': 0.3,        # kg (head)
        'velocity': 11,      # m/s
        'crush_distance': 0.015,  # 15 mm
        'crush_force_limit': 50,  # N (brain tolerance)
    },
    {
        'name': 'Bicycle helmet',
        'mass': 5.0,         # kg (head)
        'velocity': 6,       # m/s (~22 km/h)
        'crush_distance': 0.025,  # 25 mm
        'crush_force_limit': 3000,  # N (skull fracture threshold)
    },
    {
        'name': 'Motorcycle helmet',
        'mass': 5.0,
        'velocity': 13,      # m/s (~47 km/h)
        'crush_distance': 0.035,
        'crush_force_limit': 5000,
    },
    {
        'name': 'Car crumple zone',
        'mass': 80,          # kg (person)
        'velocity': 14,      # m/s (50 km/h)
        'crush_distance': 0.60,
        'crush_force_limit': 15000,
    },
    {
        'name': 'F1 car survival cell',
        'mass': 80,
        'velocity': 70,      # m/s (250 km/h)
        'crush_distance': 2.0,
        'crush_force_limit': 25000,
    },
]

print(f"{'System':>22} | {'KE (J)':>8} | {'Crush':>6} | {'Avg F':>8} | {'Limit':>8} | {'Safe?':>6}")
print("-" * 70)

for s in systems:
    KE = 0.5 * s['mass'] * s['velocity']**2
    avg_force = KE / s['crush_distance']
    safe = avg_force < s['crush_force_limit']
    status = "YES" if safe else "NO"
    color_status = status

    print(f"  {s['name']:>20} | {KE:>7.0f} | {s['crush_distance']*100:>4.1f}cm | {avg_force:>7.0f}N | {s['crush_force_limit']:>7.0f}N | {color_status}")

# How much crush distance would each need for safety?
print()
print("Required crush distance for safe deceleration:")
for s in systems:
    KE = 0.5 * s['mass'] * s['velocity']**2
    d_required = KE / s['crush_force_limit']
    d_actual = s['crush_distance']
    ratio = d_actual / d_required

    status = "OK" if ratio >= 1 else f"need {d_required*100:.1f}cm"
    print(f"  {s['name']:>20}: need {d_required*100:.1f} cm, have {d_actual*100:.1f} cm → {status}")

print()
# Hornbill efficiency
casque_KE = 0.5 * 0.3 * 11**2
casque_vol = 0.015 * 0.003  # 15mm × 30cm² cross-section ≈ 45 cm³
energy_density = casque_KE / (casque_vol * 1000)  # J per cm³ × 1000
print(f"Hornbill casque energy density: {casque_KE/casque_vol:.0f} J/m³")
print("This rivals engineered foams — nature optimized this over 50 million years!")`,
      challenge: 'Design a helmet for a sport of your choice. Given the head mass (5 kg), typical impact speed, and maximum safe force (3,000 N), calculate the minimum crush distance needed. What foam density would you use?',
      successHint: 'You now understand crumple zones as energy absorbers. The hornbill casque, bicycle helmets, and F1 cars all use the same principle: sacrifice a crushable structure to protect the occupant. The math is identical across all scales.',
    },
    {
      title: 'Biomimetics — engineering inspired by the hornbill',
      concept: `**Biomimetics** (or biomimicry) is the practice of learning from nature\'s designs to solve engineering problems. The hornbill casque has inspired:

1. **Helmet design**: cellular core with rigid outer shell
2. **Building materials**: lightweight yet impact-resistant panels
3. **Vehicle armor**: layered structures that absorb blast energy
4. **Packaging**: protective foam that crushes progressively

The design principles from the casque:
- **Gradient structure**: harder outside, softer inside
- **Cellular architecture**: 85% air, 15% solid
- **Progressive crushing**: absorbs energy steadily, not all at once
- **Self-healing**: bone can repair micro-damage over time

📚 *Python **dictionaries** store key-value pairs: material = {"name": "foam", "density": 100}. Access values with material["density"].*`,
      analogy: 'Biomimetics is like an open-book exam where the textbook is nature. Engineers facing a design challenge can look at how nature solved the same problem over millions of years of evolution. The hornbill casque is one page in this enormous textbook — and the answers are remarkably good.',
      storyConnection: 'The hornbill is Nagaland\'s state bird and a cultural symbol. That this same bird\'s skull architecture is teaching engineers worldwide how to design better helmets adds a layer of scientific significance to the cultural reverence. The Naga people were right to see the hornbill as remarkable — just not for the reasons they imagined.',
      checkQuestion: 'Why can\'t engineers simply copy the casque structure exactly into a helmet?',
      checkAnswer: 'Three barriers: (1) Scale — the casque is 15 mm thick; a helmet needs 25-35 mm. Scaling up changes the mechanics. (2) Materials — bone has self-healing properties that synthetic materials lack. (3) Loading — helmets face different impact angles, speeds, and surfaces than hornbill headbutts. Biomimetics INSPIRES solutions, it does not copy them. Engineers must adapt the principles to different materials, scales, and requirements.',
      codeIntro: 'Compare nature\'s designs with human engineering solutions for impact protection.',
      code: `# Biomimetics: nature vs engineering solutions

print("Biomimetics — Nature vs Human Engineering")
print("=" * 65)

comparisons = [
    {
        'problem': 'Head protection during impact',
        'nature': {'solution': 'Hornbill casque', 'density_kg_m3': 285,
                   'energy_J_per_kg': 363, 'self_healing': True},
        'human': {'solution': 'EPS foam helmet', 'density_kg_m3': 80,
                  'energy_J_per_kg': 200, 'self_healing': False},
    },
    {
        'problem': 'Lightweight structural panel',
        'nature': {'solution': 'Woodpecker skull', 'density_kg_m3': 400,
                   'energy_J_per_kg': 250, 'self_healing': True},
        'human': {'solution': 'Aluminum honeycomb', 'density_kg_m3': 50,
                  'energy_J_per_kg': 1000, 'self_healing': False},
    },
    {
        'problem': 'Blast/impact armor',
        'nature': {'solution': 'Mantis shrimp club', 'density_kg_m3': 1800,
                   'energy_J_per_kg': 500, 'self_healing': True},
        'human': {'solution': 'Kevlar composite', 'density_kg_m3': 1440,
                  'energy_J_per_kg': 350, 'self_healing': False},
    },
    {
        'problem': 'Flexible impact absorber',
        'nature': {'solution': 'Pomelo peel', 'density_kg_m3': 300,
                   'energy_J_per_kg': 150, 'self_healing': True},
        'human': {'solution': 'D3O smart material', 'density_kg_m3': 450,
                  'energy_J_per_kg': 400, 'self_healing': False},
    },
]

for comp in comparisons:
    print(f"\
Problem: {comp['problem']}")
    print(f"  Nature:  {comp['nature']['solution']}")
    print(f"           density: {comp['nature']['density_kg_m3']} kg/m³ | "
          f"energy: {comp['nature']['energy_J_per_kg']} J/kg | "
          f"self-heal: {'Yes' if comp['nature']['self_healing'] else 'No'}")
    print(f"  Human:   {comp['human']['solution']}")
    print(f"           density: {comp['human']['density_kg_m3']} kg/m³ | "
          f"energy: {comp['human']['energy_J_per_kg']} J/kg | "
          f"self-heal: {'Yes' if comp['human']['self_healing'] else 'No'}")

    # Comparison
    energy_ratio = comp['nature']['energy_J_per_kg'] / comp['human']['energy_J_per_kg']
    if energy_ratio > 1:
        print(f"  → Nature is {energy_ratio:.1f}x more energy-efficient per kg")
    else:
        print(f"  → Human design is {1/energy_ratio:.1f}x more energy-efficient per kg")
    if comp['nature']['self_healing']:
        print(f"  → Nature has self-healing (human version must be replaced after impact)")

print()
print("Key biomimetic principle from the hornbill casque:")
print("  Gradient cellular structure — hard shell, soft core, progressive crush")
print("  This is now being adopted in next-generation helmet designs worldwide")`,
      challenge: 'Research one more natural impact-absorber (e.g., coconut shell, turtle shell, antler). Add it to the comparison dictionary with estimated properties and compare with its nearest human equivalent.',
      successHint: 'You have surveyed the field of biomimetics for impact engineering. The hornbill casque is just one example of nature\'s engineering solutions that human designers are learning from. The combination of cellular architecture, gradient structure, and self-healing remains unmatched by human technology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Impact Science Foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
