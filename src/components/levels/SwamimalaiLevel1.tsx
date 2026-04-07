import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SwamimalaiLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'States of matter — solid, liquid, gas and the energy that changes them',
      concept: `Every material around you exists in one of three common states: **solid**, **liquid**, or **gas**. What determines the state? **Temperature** — which is really a measure of how fast the atoms are vibrating.

In a solid, atoms are locked in a fixed pattern, vibrating in place. Add enough heat energy and the vibrations become so large that atoms break free of their neighbours — the solid **melts** into a liquid. Add even more energy and atoms escape the liquid surface entirely — the liquid **boils** into a gas. Each transition requires a specific temperature (melting point, boiling point) that depends on how strongly the atoms are bonded together.

In the code below, you will compare the melting and boiling points of metals used by the Swamimalai bronze casters. The enormous range — from mercury (melts at -39 degrees C) to tungsten (melts at 3422 degrees C) — reflects the different bonding strengths between metal atoms.

*A phase transition is when a material changes state. The temperature stays constant during the transition because all the incoming energy goes into breaking bonds, not raising temperature.*`,
      analogy: 'Imagine a school assembly. In "solid" mode, every student sits in an assigned seat, vibrating with boredom but staying put. In "liquid" mode (recess), students wander freely but stay on the playground. In "gas" mode (dismissal), students scatter in all directions. The "temperature" is how much energy (excitement) the students have.',
      storyConnection: 'The Swamimalai casters must heat bronze above 950 degrees C to melt it for pouring into moulds. They judge the temperature by the colour of the molten metal — dull red means barely liquid, bright orange means fully fluid. Getting the temperature wrong means the bronze will not flow into the fine details of the wax mould.',
      checkQuestion: 'If copper melts at 1085 degrees C and tin melts at 232 degrees C, which metal becomes liquid first as you heat a furnace from room temperature?',
      checkAnswer: 'Tin melts first at 232 degrees C. Copper remains solid until 1085 degrees C. This is why the casters add tin to copper — the tin melts first and flows between the copper grains, eventually dissolving the copper into a uniform liquid alloy at a temperature lower than pure copper would require.',
      codeIntro: 'Compare melting and boiling points of metals used in traditional bronze casting.',
      code: `# Phase transitions of casting metals
# Compare melting and boiling points

metals = [
    {"name": "Mercury",   "symbol": "Hg", "melt_C": -39,   "boil_C": 357},
    {"name": "Tin",       "symbol": "Sn", "melt_C": 232,   "boil_C": 2602},
    {"name": "Lead",      "symbol": "Pb", "melt_C": 327,   "boil_C": 1749},
    {"name": "Zinc",      "symbol": "Zn", "melt_C": 420,   "boil_C": 907},
    {"name": "Aluminium", "symbol": "Al", "melt_C": 660,   "boil_C": 2519},
    {"name": "Bronze",    "symbol": "Cu-Sn", "melt_C": 950, "boil_C": 2300},
    {"name": "Copper",    "symbol": "Cu", "melt_C": 1085,  "boil_C": 2562},
    {"name": "Iron",      "symbol": "Fe", "melt_C": 1538,  "boil_C": 2861},
    {"name": "Tungsten",  "symbol": "W",  "melt_C": 3422,  "boil_C": 5555},
]

print("=== Melting & Boiling Points of Metals ===")
header = "Metal            Symbol   Melt (C)  Boil (C)  Liquid Range (C)"
print(header)
print("-" * len(header))

for m in metals:
    liquid_range = m["boil_C"] - m["melt_C"]
    print(f"{m['name']:<17}{m['symbol']:<9}{m['melt_C']:>8}  {m['boil_C']:>8}  {liquid_range:>14}")

print()
print("Bronze melts at ~950 C -- lower than pure copper (1085 C).")
print("The tin lowers the melting point, making casting easier.")
print()

# Energy needed to melt 1 kg
print("=== Energy to Melt 1 kg (heat of fusion) ===")
fusion_data = [
    ("Tin", 60.6),
    ("Lead", 23.0),
    ("Copper", 205.0),
    ("Iron", 247.0),
    ("Aluminium", 397.0),
]
for name, hf in fusion_data:
    print(f"  {name:<12} {hf:>6.1f} kJ/kg")`,
      challenge: 'Add gold (melts at 1064 degrees C, boils at 2856 degrees C) to the metals list. How does its liquid range compare to copper? Why might ancient jewellers have preferred gold over copper for fine castings?',
      successHint: 'You just mapped out the phase transition landscape for casting metals. The Swamimalai casters have known these relationships intuitively for 4000 years — by colour, by feel, by the way the metal flows. You expressed the same knowledge as data.',
    },
    {
      title: 'Melting point depression — why alloys melt below their pure components',
      concept: `Pure copper melts at 1085 degrees C. Pure tin melts at 232 degrees C. But mix them together into bronze and the alloy melts at about **950 degrees C** — well below the copper melting point. This phenomenon is called **melting point depression**.

Why does this happen? In a pure metal, all atoms are identical and pack together perfectly in a crystal lattice. Adding foreign atoms (tin into copper) **disrupts the lattice** — the tin atoms do not fit perfectly, creating local strain. This strain makes it easier for the lattice to break apart, so less energy (lower temperature) is needed to melt the mixture.

In the code below, you will model how the melting point of a copper-tin mixture changes as you add more tin. The curve dips to a minimum called the **eutectic point** — the lowest melting temperature for any mixture of these two metals.

*The eutectic point is a critical concept in metallurgy. At this composition, the entire alloy melts at once rather than gradually, which makes casting much easier.*`,
      analogy: 'Imagine a perfectly stacked brick wall (pure copper lattice). Every brick fits snugly. Now replace some bricks with slightly smaller ones (tin atoms). The wall becomes uneven and wobbly — it takes less force to knock it over. Similarly, mixing tin into copper weakens the crystal structure, lowering the temperature needed to break it apart.',
      storyConnection: 'The Swamimalai casters discovered empirically that adding about 10-12 percent tin to copper gives the ideal casting bronze — low enough melting point for their charcoal furnaces, fluid enough to fill intricate moulds, and hard enough for a finished sculpture. They arrived at this ratio through generations of trial and error.',
      checkQuestion: 'If a caster has a furnace that can only reach 1000 degrees C, can they melt pure copper? What about bronze with 10 percent tin?',
      checkAnswer: 'Pure copper melts at 1085 degrees C, so the furnace cannot melt it. But bronze with 10 percent tin melts around 1000 degrees C — right at the furnace limit. Adding more tin (say 15 percent) drops the melting point further to about 960 degrees C, giving a comfortable margin. This is why bronze technology spread faster than iron — bronze is much easier to melt with primitive furnaces.',
      codeIntro: 'Model how adding tin to copper changes the alloy melting point.',
      code: `import numpy as np

# Simplified copper-tin phase diagram (liquidus curve)
# Real phase diagrams are more complex, but this captures the key idea

tin_pct = np.arange(0, 35, 0.5)  # 0% to 34% tin

def liquidus_temperature(sn_pct):
    """Approximate liquidus temperature for Cu-Sn alloy"""
    # Copper melting point minus depression from tin
    # The curve dips to a eutectic near 13.5% Sn
    cu_melt = 1085
    depression = 10.5 * sn_pct - 0.08 * sn_pct ** 2
    # Ensure we don't go below the eutectic temperature
    temp = cu_melt - depression
    return max(temp, 798)

temps = [liquidus_temperature(pct) for pct in tin_pct]

print("=== Copper-Tin Liquidus Curve ===")
print("(Temperature above which the alloy is fully liquid)")
print()
header = "Tin %    Liquidus (C)    Drop from pure Cu"
print(header)
print("-" * len(header))

for pct in [0, 2, 5, 8, 10, 12, 15, 20, 25, 30]:
    t = liquidus_temperature(pct)
    drop = 1085 - t
    marker = " <-- traditional bronze" if pct == 10 else ""
    print(f"{pct:>5.0f}%   {t:>10.0f} C   {drop:>13.0f} C{marker}")

print()
# Find the eutectic
min_temp = min(temps)
min_idx = temps.index(min_temp)
eutectic_pct = tin_pct[min_idx]
print(f"Eutectic point: ~{eutectic_pct:.1f}% tin at ~{min_temp:.0f} C")
print("At the eutectic, the alloy melts all at once (sharp transition).")
print("Away from it, melting is gradual (mushy zone).")`,
      challenge: 'Modify the code to also print the "mushy zone" width — the temperature range between where melting starts (solidus, about 798 degrees C for bronze) and where it finishes (liquidus). A narrow mushy zone means the alloy transitions quickly from solid to liquid, which is better for casting.',
      successHint: 'You just modelled a binary phase diagram — one of the most important tools in materials science. Every alloy ever designed (steel, brass, solder, titanium alloys) has its own phase diagram that metallurgists consult before choosing compositions and processing temperatures.',
    },
    {
      title: 'Heat of fusion — the hidden energy cost of melting',
      concept: `When you heat a block of copper, the temperature rises steadily — until it reaches 1085 degrees C. Then something unexpected happens: the temperature **stops rising** even though you keep adding heat. All the energy goes into breaking the bonds between atoms — converting solid to liquid — rather than raising the temperature. This hidden energy is called the **heat of fusion** (or latent heat of melting).

For copper, the heat of fusion is **205 kJ/kg** — meaning you need 205,000 joules of energy just to melt one kilogram of copper that is already at 1085 degrees C. This is on top of all the energy you spent heating it from room temperature to 1085 degrees C.

In the code below, you will calculate the total energy needed to melt bronze from room temperature. You will see that a surprising fraction of the total energy goes into the phase transition itself, not the heating.

*Latent heat is "hidden" heat — it changes the state of matter without changing the temperature. It is the energy cost of breaking the bonds that hold atoms in a crystal lattice.*`,
      analogy: 'Imagine pulling apart two magnets. While you pull, you are spending energy, but the magnets are not getting hotter — the energy goes into separating them. Once apart, they are "free" (liquid state). The energy you spent is the latent heat — it changed the arrangement (solid to liquid) without changing the temperature.',
      storyConnection: 'The Swamimalai casters must maintain their charcoal furnace at full blast for a long time even after the bronze reaches its melting point. Apprentices learn that "looking hot is not the same as being melted" — the metal can glow at the melting temperature for minutes while the latent heat is absorbed. Pulling it out too early means a partially solid pour that ruins the mould.',
      checkQuestion: 'If it takes 205 kJ to melt 1 kg of copper at its melting point, how much energy to melt 5 kg?',
      checkAnswer: '205 kJ/kg multiplied by 5 kg = 1025 kJ. That is over a million joules just for the phase transition — equivalent to the energy in about 25 grams of charcoal. And this does not include the energy needed to heat the copper from room temperature to 1085 degrees C in the first place.',
      codeIntro: 'Calculate the full energy budget for melting bronze from room temperature.',
      code: `# Energy budget for melting bronze
# Step 1: Heat from room temp to melting point
# Step 2: Supply latent heat to actually melt it

# Bronze properties (approximate for 90% Cu, 10% Sn)
specific_heat = 0.38    # kJ/(kg*C) - energy to raise 1 kg by 1 C
melting_point = 950     # degrees C
heat_of_fusion = 190    # kJ/kg (bronze, approximate)
room_temp = 25          # degrees C

masses = [0.5, 1, 2, 5, 10, 20]  # kg

print("=== Energy Budget for Melting Bronze ===")
print(f"Properties: specific heat = {specific_heat} kJ/(kg*C)")
print(f"            melting point = {melting_point} C")
print(f"            heat of fusion = {heat_of_fusion} kJ/kg")
print()

header = "Mass (kg)  Heating (kJ)  Melting (kJ)  Total (kJ)  Melt %"
print(header)
print("-" * len(header))

for mass in masses:
    # Energy to heat from room temp to melting point
    heating_energy = mass * specific_heat * (melting_point - room_temp)
    # Energy for the phase transition
    melting_energy = mass * heat_of_fusion
    # Total
    total = heating_energy + melting_energy
    melt_fraction = melting_energy / total * 100
    print(f"{mass:>7.1f}    {heating_energy:>10.1f}  {melting_energy:>10.1f}  {total:>10.1f}  {melt_fraction:>5.1f}%")

print()
print("The phase transition alone consumes about 35% of the total energy!")
print("This is why the Swamimalai casters keep the furnace roaring")
print("even after the bronze starts to glow at melting temperature.")
print()

# Charcoal required
print("=== Charcoal Required ===")
charcoal_energy = 29000  # kJ per kg of charcoal
furnace_efficiency = 0.15  # only 15% of heat reaches the metal

for mass in [1, 5, 10]:
    total = mass * specific_heat * (melting_point - room_temp) + mass * heat_of_fusion
    charcoal_kg = total / (charcoal_energy * furnace_efficiency)
    print(f"  {mass:>2} kg bronze needs ~{charcoal_kg:.1f} kg charcoal")`,
      challenge: 'Add a "superheat" step — the casters heat the bronze 50-100 degrees C above its melting point to make it flow better into the mould. Add this extra energy to the budget. What percentage of total energy goes to superheating?',
      successHint: 'You just performed a complete energy balance — one of the fundamental tools of thermodynamics. Every industrial process, from smelting to cooking to power generation, is designed around energy budgets like this one.',
    },
    {
      title: 'Cooling curves — reading a metal\'s thermal fingerprint',
      concept: `If you record the temperature of molten bronze as it cools, you get a **cooling curve** — a graph of temperature versus time. For a pure metal, the curve shows a distinct **plateau** at the melting point: the temperature drops, then holds steady while the metal solidifies (releasing latent heat), then drops again.

For an alloy like bronze, the curve is more complex. Instead of a single plateau, there is a **mushy zone** — a temperature range where the alloy is part solid, part liquid. The width of this zone depends on the alloy composition. At the eutectic composition, the mushy zone vanishes and the alloy freezes sharply like a pure metal.

In the code below, you will simulate cooling curves for pure copper, pure tin, and bronze. By comparing them, you will see how the alloy composition affects the solidification behaviour.

*Cooling curves are one of the most important diagnostic tools in metallurgy. By measuring the cooling curve of an unknown metal sample, you can identify its composition.*`,
      analogy: 'Imagine draining a bathtub with a plug. Pure metal is like a tub that drains instantly when you pull the plug — all the water leaves at once (sharp freezing point). An alloy is like a tub with a slow drain — the water level drops gradually over a range. The eutectic alloy is special: it drains as fast as a pure metal despite being a mixture.',
      storyConnection: 'Experienced Swamimalai casters can judge the quality of their bronze by watching how it solidifies. If the surface skins over quickly with a bright flash (sharp freezing), the composition is close to the eutectic. If it goes through a long mushy stage, the composition is off and the casting may have internal defects called shrinkage porosity.',
      checkQuestion: 'A cooling curve shows a plateau at 798 degrees C. What does this tell you about the alloy?',
      checkAnswer: 'A plateau at 798 degrees C indicates the alloy is near the copper-tin eutectic composition (about 13.5 percent tin). The eutectic freezes at a single temperature like a pure metal, producing the sharpest plateau. This is a desirable composition for casting because it solidifies uniformly with minimal internal defects.',
      codeIntro: 'Simulate cooling curves for pure metals and bronze alloys.',
      code: `import numpy as np

def cooling_curve(melt_temp, latent_pause, cool_rate, steps=200):
    """Simulate a cooling curve for a metal or alloy.

    latent_pause: how many time steps the plateau lasts
    cool_rate: degrees per time step during liquid/solid cooling
    """
    temps = []
    t = melt_temp + 100  # start above melting point (superheated)

    phase = "liquid"
    pause_count = 0

    for step in range(steps):
        temps.append(t)
        if phase == "liquid":
            t -= cool_rate
            if t <= melt_temp:
                t = melt_temp
                phase = "plateau"
        elif phase == "plateau":
            pause_count += 1
            # During plateau, temperature stays roughly constant
            # (latent heat released balances cooling)
            t -= cool_rate * 0.05  # very slow drop
            if pause_count >= latent_pause:
                phase = "solid"
        elif phase == "solid":
            t -= cool_rate * 0.8  # solid cools slightly slower

    return temps

# Generate cooling curves
pure_copper = cooling_curve(1085, latent_pause=30, cool_rate=5)
pure_tin = cooling_curve(232, latent_pause=25, cool_rate=3)
bronze_eutectic = cooling_curve(798, latent_pause=28, cool_rate=4.5)
bronze_90_10 = cooling_curve(1000, latent_pause=10, cool_rate=4.5)

print("=== Cooling Curves (Temperature at Selected Time Steps) ===")
print()
header = "Time    Pure Cu     Pure Sn    Eutectic   Bronze 90/10"
print(header)
print("-" * len(header))

for step in range(0, 200, 10):
    print(f"{step:>4}    {pure_copper[step]:>7.0f}     {pure_tin[step]:>5.0f}      "
          f"{bronze_eutectic[step]:>6.0f}      {bronze_90_10[step]:>6.0f}")

print()
print("Pure metals show a clear plateau at the melting point.")
print("Eutectic bronze also shows a sharp plateau (at 798 C).")
print("Non-eutectic bronze (90/10) has a shorter plateau and")
print("a gradual 'mushy zone' where solid and liquid coexist.")`,
      challenge: 'Add a cooling curve for bronze with 20 percent tin (melting starts around 900 degrees C but the mushy zone extends to 798 degrees C). Use a longer latent_pause of 40 and a higher starting melt_temp of 900. Compare how wide its mushy zone is versus the eutectic alloy.',
      successHint: 'Cooling curve analysis is used in every foundry in the world — from Swamimalai to modern automotive casting plants. The shape of the curve tells the metallurgist everything about the alloy composition and quality without needing any chemical analysis.',
    },
    {
      title: 'Lost-wax process overview — mapping the steps with code',
      concept: `The lost-wax (cire perdue) casting method used in Swamimalai has **eight major steps**: (1) sculpt the wax model, (2) coat with clay, (3) dry the mould, (4) heat to melt out the wax ("lost" wax), (5) fire the mould to harden it, (6) pour molten bronze, (7) cool and break the mould, (8) finish the surface. Each step has specific temperature requirements and timing constraints.

What makes this process remarkable is that it is essentially a **state machine** — the workpiece transitions through a defined sequence of states, and each transition requires specific conditions (temperature, time, materials). If any step fails, the entire casting is ruined because the mould can only be used once.

In the code below, you will model the lost-wax process as a sequence of steps, tracking the temperature, time, and state of the workpiece at each stage. This gives you a complete thermal profile of the entire casting process.

*A state machine is a model where a system is always in one "state" and transitions to other states when specific conditions are met. Traffic lights, vending machines, and manufacturing processes are all state machines.*`,
      analogy: 'Think of baking a cake from scratch. You cannot frost it before baking, and you cannot bake it before mixing the batter. Each step must happen in order, at the right temperature, for the right time. Skip or rush one step and the whole cake fails. Lost-wax casting is the same — a strict sequence of thermal steps.',
      storyConnection: 'In Swamimalai, the master caster coordinates teams of specialists — one for wax modelling, one for mould-making, one for furnace tending, one for finishing. The knowledge is passed from father to son over generations, and each specialist knows their step so precisely that they can judge temperature by colour and timing by instinct.',
      checkQuestion: 'Why is the wax melted out before the bronze is poured in? Why not just pour bronze directly onto wax?',
      checkAnswer: 'If bronze (950 degrees C) contacts wax directly, the wax would vaporise explosively, creating steam and gas bubbles trapped in the bronze. By melting the wax out first at a low temperature (around 200 degrees C), the mould cavity is empty and dry when the bronze enters, producing a clean casting with no gas porosity.',
      codeIntro: 'Model the complete lost-wax casting process as a thermal state machine.',
      code: `# Lost-wax casting process: step-by-step thermal model

steps = [
    {
        "name": "1. Wax sculpting",
        "temp_C": 25,
        "duration_hours": 48,
        "material_state": "Solid wax model",
        "description": "Sculpt the figure in beeswax and resin blend"
    },
    {
        "name": "2. Mould coating",
        "temp_C": 25,
        "duration_hours": 8,
        "material_state": "Wax inside clay layers",
        "description": "Apply 3-5 layers of clay-dung-rice husk mixture"
    },
    {
        "name": "3. Mould drying",
        "temp_C": 35,
        "duration_hours": 72,
        "material_state": "Clay hardening around wax",
        "description": "Sun-dry the mould for uniform moisture removal"
    },
    {
        "name": "4. Dewaxing",
        "temp_C": 200,
        "duration_hours": 2,
        "material_state": "Wax melting out of mould",
        "description": "Heat gently to melt and drain the wax"
    },
    {
        "name": "5. Mould firing",
        "temp_C": 700,
        "duration_hours": 6,
        "material_state": "Ceramic mould (empty cavity)",
        "description": "Fire to harden clay and burn off residual wax"
    },
    {
        "name": "6. Bronze pouring",
        "temp_C": 1050,
        "duration_hours": 0.1,
        "material_state": "Liquid bronze filling cavity",
        "description": "Pour superheated bronze into the hot mould"
    },
    {
        "name": "7. Cooling",
        "temp_C": 25,
        "duration_hours": 24,
        "material_state": "Bronze solidifying in mould",
        "description": "Slow cool to avoid thermal shock cracks"
    },
    {
        "name": "8. Finishing",
        "temp_C": 25,
        "duration_hours": 40,
        "material_state": "Solid bronze sculpture",
        "description": "Break mould, file, polish, apply patina"
    },
]

total_hours = sum(s["duration_hours"] for s in steps)
total_days = total_hours / 24

print("=== Lost-Wax (Cire Perdue) Casting Process ===")
print(f"Total time: {total_hours:.1f} hours ({total_days:.1f} days)")
print()

cumulative = 0
for s in steps:
    cumulative += s["duration_hours"]
    print(f"{s['name']}")
    print(f"  Temperature: {s['temp_C']} C | Duration: {s['duration_hours']}h")
    print(f"  State: {s['material_state']}")
    print(f"  {s['description']}")
    print(f"  Cumulative time: {cumulative:.1f}h ({cumulative/24:.1f} days)")
    print()

# Temperature profile summary
print("=== Thermal Profile Summary ===")
max_temp = max(s["temp_C"] for s in steps)
print(f"Peak temperature: {max_temp} C (bronze pouring)")
print(f"Heating phases: dewaxing (200 C), firing (700 C), pour (1050 C)")
print(f"Total process: {total_days:.0f} days from wax to finished bronze")`,
      challenge: 'Add a "quality gate" to each step: a pass/fail check. For example, if the dewaxing temperature is below 150 degrees C, the wax will not fully drain. If the bronze pour temperature is below 950 degrees C, the metal will not flow. Implement these checks and print warnings for any failures.',
      successHint: 'You just modelled a 4000-year-old manufacturing process as a computational state machine. Modern manufacturing (semiconductor fabrication, pharmaceutical production) uses exactly the same approach — a strict sequence of steps with defined temperatures, times, and quality gates.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Phase transitions and casting fundamentals</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model phase transitions, energy budgets, and the lost-wax casting process.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
