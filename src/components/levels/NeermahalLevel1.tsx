import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NeermahalLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Water pressure — why depth matters',
      concept: `**Hydrostatic pressure** is the pressure exerted by a fluid at rest due to gravity. The deeper you go, the greater the pressure.

The formula is beautifully simple: \`P = ρ × g × h\` where:
- **ρ** (rho) = density of the fluid (water ≈ 1000 kg/m³)
- **g** = acceleration due to gravity (9.81 m/s²)
- **h** = depth below the surface (metres)

At 1 metre depth, water pushes on you with about 9,810 Pascals — that is roughly 1% of atmospheric pressure. At 10 metres, it is a full extra atmosphere.

📚 *We will use Python variables and the \`print()\` function with f-strings to calculate pressures at different depths.*`,
      analogy: 'Imagine stacking books on your hand. One book is fine. Ten books feel heavy. A hundred would crush you. Water works the same way — each layer of water above you adds weight pushing down.',
      storyConnection: 'Neermahal, the water palace of Tripura, sits in the middle of Rudrasagar Lake. Its foundations must resist water pressure from every direction. The builders had to understand how pressure increases with depth to design walls that would not crack or leak.',
      checkQuestion: 'If you dive 5 metres into Rudrasagar Lake, what is the water pressure on your body (not counting atmospheric pressure)?',
      checkAnswer: 'P = ρgh = 1000 × 9.81 × 5 = 49,050 Pa ≈ 49 kPa. That is about half an atmosphere of extra pressure on top of the normal air pressure above the lake.',
      codeIntro: 'Calculate the water pressure at different depths in Rudrasagar Lake.',
      code: `# Hydrostatic pressure: P = rho * g * h
rho = 1000    # density of fresh water in kg/m^3
g = 9.81      # gravitational acceleration in m/s^2

depths = [0.5, 1, 2, 3, 5, 10]  # metres

print("Depth (m)  |  Pressure (Pa)  |  Pressure (kPa)")
print("-" * 50)

for h in depths:
    P = rho * g * h
    print(f"  {h:5.1f}     |   {P:10.1f}    |   {P/1000:6.2f}")

print()
print(f"At 10m depth, water pushes with {rho * g * 10 / 101325:.2f} extra atmospheres")`,
      challenge: 'Add sea water (density 1025 kg/m³) as a second column. How much more pressure does salt water exert at 10m compared to fresh water?',
      successHint: 'You now understand the fundamental equation of hydrostatics. Every dam, submarine, and water palace must account for this relentless increase of pressure with depth.',
    },
    {
      title: 'Buoyancy — why things float or sink',
      concept: `**Archimedes' principle** states that any object submerged in a fluid experiences an upward force (buoyancy) equal to the weight of the fluid it displaces.

If the buoyant force equals the object's weight, it **floats**. If it is less, the object **sinks**.

The buoyant force is: \`F_b = ρ_fluid × g × V_submerged\`

This is why:
- A steel ship floats (its hull encloses air, displacing more water than the steel alone would)
- A stone sinks (it is denser than water)
- A log floats partially submerged (wood density ≈ 500-700 kg/m³, less than water's 1000)

📚 *We will use \`if/else\` statements to decide whether objects float or sink based on their density.*`,
      analogy: 'When you sit in a bathtub, the water level rises. The water that "moved out of the way" is pushing back up on you. If you weigh less than that displaced water, you float. This is why you feel lighter in water — the water is literally holding you up.',
      storyConnection: 'Neermahal was built using a combination of stone, brick, and concrete — all materials denser than water. The palace does not float; it sits on pile foundations driven into the lakebed. But the builders needed to understand buoyancy to know how much the water would push against the submerged portions of the structure.',
      checkQuestion: 'A block of teak wood has density 650 kg/m³. What fraction of it will be submerged when floating in fresh water?',
      checkAnswer: 'The fraction submerged equals the ratio of object density to fluid density: 650/1000 = 0.65 or 65%. About two-thirds of the teak block sits below the waterline, one-third above.',
      codeIntro: 'Determine whether common building materials would float or sink in Rudrasagar Lake.',
      code: `# Buoyancy checker: compare material density to water
water_density = 1000  # kg/m^3

materials = {
    "Teak wood": 650,
    "Bamboo": 350,
    "Brick": 1900,
    "Concrete": 2400,
    "Sandstone": 2300,
    "Cork": 120,
    "Steel": 7850,
    "Ice": 917,
}

print("Material       | Density | Floats? | % Submerged")
print("-" * 55)

for name, density in materials.items():
    floats = density < water_density
    if floats:
        pct_sub = (density / water_density) * 100
        print(f"{name:14s} | {density:5d}   | Yes     | {pct_sub:.1f}%")
    else:
        print(f"{name:14s} | {density:5d}   | No      | 100% (sinks)")

print()
print("Neermahal uses brick and concrete — both sink.")
print("That is why it needs foundations, not a floating platform.")`,
      challenge: 'A hollow concrete cube (walls 5 cm thick, outer side 1 m) — would it float? Calculate the average density including the air inside.',
      successHint: 'Buoyancy is the reason ships work, icebergs are mostly hidden, and water palaces need foundations. Density comparison is all you need.',
    },
    {
      title: 'Pile foundations — anchoring in soft lakebed',
      concept: `**Pile foundations** are long columns driven deep into the ground to support structures where the surface soil is too soft or waterlogged.

There are two main types:
- **End-bearing piles**: driven down until they reach hard rock or dense soil, transferring load through the pile tip
- **Friction piles**: rely on friction between the pile surface and the surrounding soil along their length

The load capacity of a friction pile depends on:
- **Surface area** of the pile in contact with soil
- **Shear strength** of the soil (how strongly soil grips the pile)
- **Length** of the pile (longer = more surface area = more friction)

A typical wooden pile might support 50-200 kN (roughly 5-20 tonnes).

📚 *We will use multiplication and formatted printing to estimate how many piles Neermahal might need.*`,
      analogy: 'Push a pencil into soft clay. The deeper you push, the harder it is to pull out — that is friction. A pile foundation is the same idea: a long post pushed deep into mud, held in place by the grip of the soil around it.',
      storyConnection: 'Rudrasagar Lake has a soft, silty lakebed. You cannot just set heavy stone walls on silt — they would slowly sink. Neermahal was built on hundreds of wooden and concrete piles driven deep into the lakebed to reach firmer soil below.',
      checkQuestion: 'If a circular wooden pile has diameter 30 cm and is driven 8 m into soil with shear strength 25 kPa, what frictional load can it support?',
      checkAnswer: 'Surface area = π × d × L = π × 0.30 × 8 = 7.54 m². Friction force = area × shear strength = 7.54 × 25,000 = 188,500 N ≈ 188.5 kN ≈ 19.2 tonnes. One pile can support about 19 tonnes.',
      codeIntro: 'Estimate how many piles Neermahal needs to support its weight.',
      code: `import math

# Pile foundation calculator
pile_diameter = 0.30     # metres
pile_length = 8.0        # metres driven into soil
soil_shear = 25000       # Pa (25 kPa - soft clay)

# Friction capacity of one pile
circumference = math.pi * pile_diameter
surface_area = circumference * pile_length
pile_capacity = surface_area * soil_shear  # Newtons

print(f"One pile: diameter={pile_diameter}m, length={pile_length}m")
print(f"Surface area in contact with soil: {surface_area:.2f} m²")
print(f"Load capacity per pile: {pile_capacity:.0f} N = {pile_capacity/1000:.1f} kN")
print(f"That is about {pile_capacity/9810:.1f} tonnes per pile")
print()

# Estimate Neermahal's weight
palace_area = 50 * 30           # approx 50m x 30m footprint
floors = 2
weight_per_sqm = 8000           # N/m² (stone/concrete building)
total_weight = palace_area * floors * weight_per_sqm

piles_needed = math.ceil(total_weight / pile_capacity)
safety_factor = 2.5
piles_with_safety = math.ceil(piles_needed * safety_factor)

print(f"Estimated palace weight: {total_weight/1000:.0f} kN")
print(f"Minimum piles needed: {piles_needed}")
print(f"With safety factor {safety_factor}: {piles_with_safety} piles")`,
      challenge: 'What happens if you use wider piles (40 cm diameter)? How many fewer piles would you need? Is bigger always better?',
      successHint: 'Foundation engineering is about matching structure weight to soil capacity. Every tall building, bridge, and water palace starts with this calculation.',
    },
    {
      title: 'Force on submerged walls — the push of water',
      concept: `A wall holding back water experiences a **hydrostatic force** that increases with depth. The total force on a rectangular submerged wall is:

\`F = ½ × ρ × g × h² × w\`

where **h** is the water depth and **w** is the wall width.

Notice that force grows with **h squared** — doubling the water depth quadruples the force. This is why:
- Dam walls are thicker at the bottom
- Retaining walls lean back against the water
- Deep swimming pools have thicker walls than shallow ones

The force acts at a point **⅓ of the way up** from the bottom (not at the midpoint), because pressure is greatest at the bottom.

📚 *We will use a \`for\` loop to see how force changes as water level rises, and formatted output to build a table.*`,
      analogy: 'Hold a book against a wall with one hand — easy. Now imagine someone stacking more books against it. Each book adds pressure, and the total force grows faster than you expect. Water against a wall works the same way: double the depth, four times the force.',
      storyConnection: 'Neermahal has walls that stand in the lake year-round. During monsoon, the water level rises significantly, and the force on these walls increases dramatically. The palace had to be designed to handle the worst monsoon water levels without cracking.',
      checkQuestion: 'A wall of Neermahal is 10 m wide and the water is 3 m deep against it. What is the total hydrostatic force?',
      checkAnswer: 'F = ½ × 1000 × 9.81 × 3² × 10 = ½ × 1000 × 9.81 × 9 × 10 = 441,450 N ≈ 441 kN ≈ 45 tonnes of force pushing against that one wall section.',
      codeIntro: 'Calculate how the force on a palace wall changes as monsoon water rises.',
      code: `# Force on a submerged vertical wall
rho = 1000     # water density kg/m^3
g = 9.81       # m/s^2
wall_width = 10  # metres

print("Water depth vs Force on a 10m-wide wall")
print("=" * 45)
print(f"{'Depth (m)':>10} | {'Force (kN)':>10} | {'Force (tonnes)':>14}")
print("-" * 45)

for depth_cm in range(50, 501, 50):
    h = depth_cm / 100  # convert to metres
    force = 0.5 * rho * g * h**2 * wall_width
    print(f"{h:10.1f} | {force/1000:10.1f} | {force/9810:14.1f}")

print()
# Show the squared relationship
f_at_2m = 0.5 * rho * g * 4 * wall_width
f_at_4m = 0.5 * rho * g * 16 * wall_width
print(f"Force at 2m: {f_at_2m/1000:.1f} kN")
print(f"Force at 4m: {f_at_4m/1000:.1f} kN")
print(f"Doubling depth: force increased {f_at_4m/f_at_2m:.0f}x (h² relationship)")`,
      challenge: 'Neermahal is in a lake, so water pushes from BOTH sides. If levels differ by 0.5m between sides during monsoon flow, what net force does the wall experience?',
      successHint: 'The squared relationship between depth and force is why dams fail catastrophically when overtopped — every extra centimetre of depth adds disproportionate force.',
    },
    {
      title: 'Monsoon loading — designing for the worst case',
      concept: `Engineers design structures for the **worst-case scenario**, not the average. For Neermahal, this means:

- **Normal lake level**: 2-3 metres depth around the palace
- **Monsoon peak**: can rise to 4-5 metres
- **Extreme flood**: could reach 6+ metres

The design must handle extreme conditions with a **safety factor** — typically 1.5 to 3.0 for critical structures.

\`Design load = Expected maximum load × Safety factor\`

This means the palace must be roughly 2-3 times stronger than what the worst monsoon demands. It sounds wasteful, but it accounts for:
- Uncertainties in material strength
- Unexpected flood levels
- Degradation over time
- Wave action and dynamic forces

📚 *We will use \`max()\` and simple arithmetic to explore how safety factors protect structures.*`,
      analogy: 'If the heaviest person in your family weighs 80 kg, you would not buy a chair rated for exactly 80 kg. You would buy one rated for 150 or 200 kg — that extra margin is the safety factor. Engineers do the same for buildings, bridges, and water palaces.',
      storyConnection: 'Neermahal was built in the 1930s by King Bir Bikram Kishore Manikya. The palace has survived nearly a century of monsoons. This durability is not luck — it is engineering. The builders overdesigned every element to handle the worst conditions Tripura could throw at it.',
      checkQuestion: 'If the maximum expected monsoon force on a wall is 200 kN and you use a safety factor of 2.5, what must the wall be designed to resist?',
      checkAnswer: 'Design load = 200 × 2.5 = 500 kN. The wall must resist 500 kN even though we expect at most 200 kN. This protects against the unexpected.',
      codeIntro: 'Model how engineers choose safety factors for Neermahal under different monsoon scenarios.',
      code: `# Monsoon loading analysis for Neermahal
rho = 1000
g = 9.81
wall_width = 10  # metres

# Lake level scenarios (depth in metres)
scenarios = {
    "Dry season":       1.5,
    "Normal monsoon":   3.0,
    "Heavy monsoon":    4.5,
    "100-year flood":   6.0,
    "Extreme event":    7.5,
}

print("Scenario            | Depth | Wall Force | With SF 2.5")
print("=" * 60)

for name, depth in scenarios.items():
    force = 0.5 * rho * g * depth**2 * wall_width
    design = force * 2.5
    print(f"{name:20s} | {depth:4.1f}m | {force/1000:8.1f} kN | {design/1000:8.1f} kN")

print()
# What if we underdesign?
normal_force = 0.5 * rho * g * 3.0**2 * wall_width
extreme_force = 0.5 * rho * g * 7.5**2 * wall_width
ratio = extreme_force / normal_force
print(f"Extreme vs Normal force ratio: {ratio:.1f}x")
print(f"A wall designed for normal monsoon would need SF > {ratio:.1f}")
print(f"to survive an extreme flood. That is why SF=2.5 is common.")`,
      challenge: 'Climate change may increase extreme rainfall by 20%. Recalculate the extreme event depth as 7.5 × 1.2 = 9.0m. Does a safety factor of 2.5 still protect the palace?',
      successHint: 'Safety factors are the bridge between theory and reality. They explain why well-engineered structures survive centuries while cutting corners leads to disaster.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural Engineering & Hydrostatics</span>
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
