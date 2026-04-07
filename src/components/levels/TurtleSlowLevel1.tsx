import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TurtleSlowLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The shell — evolution\'s greatest defensive innovation',
      concept: `The turtle in the story moves slowly, and the other animals laugh. But that slowness comes with a trade-off: the turtle carries a **shell** — one of the most successful defensive structures in evolutionary history.

A turtle's shell is not a separate structure the animal wears. It's part of its **skeleton**. The shell is made of about 60 bones fused together, including the ribcage and spine. The outer layer is covered in **scutes** (keratin plates — the same protein as your fingernails).

Two parts:
- **Carapace**: the top dome
- **Plastron**: the flat bottom

The shell represents an evolutionary trade-off: turtles sacrificed speed and flexibility for near-total protection. This strategy has worked for **220 million years** — turtles predate dinosaurs and have outlived them.

No other vertebrate has evolved a shell like this. It's a unique solution to a universal problem: how to survive when predators are faster than you.`,
      analogy: 'A turtle\'s shell is like medieval plate armor. Knights in full armor moved slowly and couldn\'t run, but they were nearly invulnerable to swords and arrows. They traded mobility for protection — exactly like the turtle. And just as armor evolved from leather to chain mail to plate, turtle shells evolved over millions of years from simple rib expansions to full bony domes.',
      storyConnection: 'The story\'s turtle is mocked for being slow. But in evolutionary terms, the turtle is the most successful animal in the story — its body plan has survived 220 million years, longer than almost any other vertebrate design. Speed is one survival strategy; armor is another. The turtle chose armor.',
      checkQuestion: 'If the shell is fused to the spine and ribs, can a turtle leave its shell?',
      checkAnswer: 'No. The shell IS the turtle\'s ribcage and spine. Asking a turtle to leave its shell is like asking you to leave your ribcage. Cartoons showing turtles stepping out of their shells are biologically impossible. The shell grows with the turtle from birth.',
      codeIntro: 'Compare survival strategies: speed vs. armor across different animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

animals = ['Cheetah', 'Rabbit', 'Deer', 'Turtle', 'Armadillo', 'Pangolin', 'Hedgehog', 'Porcupine']
speed = [120, 72, 80, 0.5, 48, 5, 12, 3]  # km/h
armor = [1, 1, 1, 9, 8, 10, 7, 8]  # 1-10 scale
lifespan = [12, 9, 20, 150, 15, 20, 7, 18]  # years (approximate max)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Speed vs Armor trade-off
ax1.set_facecolor('#111827')
colors = ['#ef4444' if s > 40 else '#f59e0b' if s > 10 else '#22c55e' for s in speed]
for i, (s, a, name) in enumerate(zip(speed, armor, animals)):
    ax1.scatter(s, a, c=colors[i], s=200, zorder=5, edgecolors='white', linewidth=0.5)
    ax1.annotate(name, xy=(s, a), xytext=(s+3, a+0.3), color='white', fontsize=9)

ax1.set_xlabel('Top speed (km/h)', color='white')
ax1.set_ylabel('Armor rating (1-10)', color='white')
ax1.set_title('The Speed-Armor Trade-off', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Add trade-off line
x_line = np.linspace(0, 130, 100)
y_line = 10 - 9 * (x_line / 130) ** 0.5
ax1.plot(x_line, y_line, '--', color='gray', alpha=0.4, label='Trade-off frontier')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Lifespan comparison
ax2.set_facecolor('#111827')
sorted_idx = np.argsort(lifespan)
ax2.barh([animals[i] for i in sorted_idx], [lifespan[i] for i in sorted_idx],
         color=[colors[i] for i in sorted_idx], height=0.6)
ax2.set_xlabel('Maximum lifespan (years)', color='white')
ax2.set_title('Who Outlives Whom?', color='white', fontsize=13)
ax2.tick_params(colors='gray')
for i, idx in enumerate(sorted_idx):
    ax2.text(lifespan[idx] + 2, i, f'{lifespan[idx]}y', va='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("The speed-armor trade-off:")
print("  Fast animals (cheetah, rabbit): minimal armor, short lifespan")
print("  Armored animals (turtle, pangolin): slow, but incredibly long-lived")
print()
print("The turtle wins the long game:")
print(f"  Turtle lifespan: up to {max(lifespan)} years")
print(f"  Cheetah lifespan: {lifespan[0]} years")
print("  Slow and steady doesn't just win the race — it outlives the race.")`,
      challenge: 'Add humans to the chart. We have almost no natural armor (1/10) and moderate speed (45 km/h). Yet our lifespan is ~80 years. What\'s our secret survival strategy? (Hint: it\'s not physical.)',
      successHint: 'Evolution doesn\'t optimize for speed. It optimizes for survival. The turtle\'s slow, armored strategy has outlasted the dinosaurs, the saber-tooth tiger, and millions of "faster" species. Sometimes the best offense is an impenetrable defense.',
    },
    {
      title: 'Body plan trade-offs — you can\'t have everything',
      concept: `Every animal body is a set of **trade-offs**. You can't maximize every trait simultaneously because resources (energy, materials, genes) are limited. This is the **principle of allocation**.

Key trade-offs:
- **Speed vs. Endurance**: cheetahs sprint at 120 km/h but overheat in 30 seconds. Wolves run at 50 km/h but sustain it for hours.
- **Size vs. Agility**: elephants are nearly invulnerable but can't climb trees. Squirrels climb anything but are vulnerable to hawks.
- **Brain vs. Body**: human brains consume 20% of our energy. That energy can't go to muscles.
- **Reproduction vs. Longevity**: mice produce 10 litters per year but live 2 years. Elephants have one calf every 4-5 years but live 60+ years.

These aren't choices animals "make." Natural selection produces these trade-offs over millions of years. A mutation that improves one trait often weakens another — and the combination that survives best in a given environment wins.`,
      analogy: 'Body plan trade-offs are like a video game character creator with a fixed number of stat points. You can put points into strength, speed, defense, intelligence, or health — but the total is capped. A tank character (turtle) maxes defense. A rogue (cheetah) maxes speed. A mage (human) maxes intelligence. No one can max everything.',
      storyConnection: 'The story contrasts the turtle\'s slowness with the hare\'s speed — presenting them as opposites. But evolution shows they\'re both optimal designs for different survival strategies. The hare invests in speed to escape predators. The turtle invests in armor to ignore them. Neither is "better" — they\'re different solutions to the same problem.',
      checkQuestion: 'Why don\'t any animals evolve to be both extremely fast AND heavily armored?',
      checkAnswer: 'Physics prevents it. Armor adds mass, and moving mass requires energy proportional to mass × speed². Doubling armor weight while maintaining speed requires 2× the energy per stride. The metabolic cost is unsustainable. Additionally, heavy armor limits joint flexibility needed for fast running. There\'s a hard physical constraint, not just evolutionary laziness.',
      codeIntro: 'Model the energy cost of different body plans using the trade-off principle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy budget model: each animal has 100 "energy units" to allocate
# across speed, armor, brain, reproduction, and sensory systems

animals_data = {
    'Turtle':    {'speed': 5,  'armor': 40, 'brain': 10, 'repro': 15, 'senses': 10, 'reserve': 20},
    'Cheetah':   {'speed': 45, 'armor': 3,  'brain': 12, 'repro': 15, 'senses': 15, 'reserve': 10},
    'Human':     {'speed': 15, 'armor': 2,  'brain': 35, 'repro': 8,  'senses': 15, 'reserve': 25},
    'Mouse':     {'speed': 20, 'armor': 2,  'brain': 8,  'repro': 40, 'senses': 20, 'reserve': 10},
    'Elephant':  {'speed': 15, 'armor': 15, 'brain': 20, 'repro': 10, 'senses': 15, 'reserve': 25},
    'Owl':       {'speed': 25, 'armor': 2,  'brain': 15, 'repro': 13, 'senses': 35, 'reserve': 10},
}

categories = ['speed', 'armor', 'brain', 'repro', 'senses', 'reserve']
cat_labels = ['Speed', 'Armor', 'Brain', 'Reproduction', 'Senses', 'Energy\\\nreserve']
n = len(categories)

fig, axes = plt.subplots(2, 3, figsize=(15, 10), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
colors_animals = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899']

angles = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
angles += angles[:1]

for ax, (name, data), color in zip(axes.flat, animals_data.items(), colors_animals):
    ax.set_facecolor('#111827')
    values = [data[c] for c in categories]
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2, color=color)
    ax.fill(angles, values, alpha=0.2, color=color)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(cat_labels, color='white', fontsize=7)
    ax.set_ylim(0, 45)
    ax.set_title(name, color=color, fontsize=12, pad=15)
    ax.tick_params(colors='gray')
    ax.set_yticks([10, 20, 30, 40])
    ax.set_yticklabels(['10', '20', '30', '40'], color='gray', fontsize=6)

plt.tight_layout()
plt.show()

print("Every animal has ~100 energy units to allocate.")
print("No animal can max out every stat:")
for name, data in animals_data.items():
    total = sum(data.values())
    top_stat = max(data, key=data.get)
    print(f"  {name}: total={total}, strongest trait={top_stat} ({data[top_stat]})")`,
      challenge: 'Design a fictional "super-predator" with speed=40, armor=30, brain=30, repro=20, senses=30. Total=150. Why can\'t this animal exist? What physical constraints prevent it?',
      successHint: 'Trade-offs are not limitations — they\'re the engine of biodiversity. Every species is an experiment in resource allocation, and the diversity of solutions is what makes ecosystems resilient.',
    },
    {
      title: 'Metabolic rate — the speed of living',
      concept: `The turtle is slow in every way — not just movement, but **metabolism**. Metabolic rate is the speed at which an organism converts food into energy. It determines:
- How much food an animal needs
- How fast it moves, thinks, and grows
- How long it lives

**Kleiber's Law**: metabolic rate scales with body mass to the 3/4 power.
**Metabolic rate = 70 × mass^0.75** (in kcal/day, mass in kg)

But turtles break this law. Their metabolic rate is even lower than predicted for their size — about 50-70% of the expected value. This is because they're **ectotherms** (cold-blooded): they don't burn calories to maintain body temperature.

The consequences:
- A 100kg turtle needs about **1/10th** the food of a 100kg mammal
- Lower metabolism = slower aging = longer lifespan
- Lower metabolism = less oxygen needed = can hold breath longer (some turtles: 7+ hours!)`,
      analogy: 'Metabolic rate is like the RPM of a car engine. A sports car (mouse) revs at 7,000 RPM — fast, powerful, but burns fuel quickly and wears out the engine sooner. A diesel truck (turtle) idles at 1,500 RPM — slow, steady, sips fuel, and the engine lasts for decades. Both are valid designs; they just optimize for different things.',
      storyConnection: 'The turtle in the story seems lazy and slow compared to the other animals. But its low metabolic rate is actually a survival superpower. While the hare burns through energy sprinting and needs to eat constantly, the turtle can go weeks without food. In a drought or famine, the turtle survives while the hare starves.',
      checkQuestion: 'Hummingbirds have the highest metabolic rate of any animal. They must eat every 10-15 minutes during the day. What happens to them at night?',
      checkAnswer: 'Hummingbirds enter **torpor** — a mini-hibernation where their metabolic rate drops by 95% and body temperature falls from 40°C to near ambient. Without torpor, they would starve to death overnight. It\'s an emergency shutdown to survive the metabolic gap. Turtles don\'t need this trick — their baseline metabolism is already in "power-saving mode."',
      codeIntro: 'Plot Kleiber\'s Law and see where turtles fall compared to mammals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kleiber's Law: BMR = 70 * mass^0.75 (mammals)
mass = np.logspace(-2, 4, 100)  # 0.01 kg to 10,000 kg
bmr_mammal = 70 * mass ** 0.75

# Reptile metabolic rate (about 10x lower)
bmr_reptile = 10 * mass ** 0.75

# Specific animals
animals = {
    'Mouse':         {'mass': 0.03, 'bmr': 3.5, 'type': 'mammal'},
    'Rabbit':        {'mass': 2, 'bmr': 120, 'type': 'mammal'},
    'Human':         {'mass': 70, 'bmr': 1800, 'type': 'mammal'},
    'Elephant':      {'mass': 5000, 'bmr': 50000, 'type': 'mammal'},
    'Box turtle':    {'mass': 0.5, 'bmr': 5, 'type': 'reptile'},
    'Giant tortoise':{'mass': 200, 'bmr': 120, 'type': 'reptile'},
    'Crocodile':     {'mass': 400, 'bmr': 300, 'type': 'reptile'},
    'Hummingbird':   {'mass': 0.005, 'bmr': 7, 'type': 'mammal'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Kleiber's Law plot
ax1.set_facecolor('#111827')
ax1.loglog(mass, bmr_mammal, color='#ef4444', linewidth=2, label='Mammal prediction')
ax1.loglog(mass, bmr_reptile, color='#22c55e', linewidth=2, label='Reptile prediction')

for name, data in animals.items():
    color = '#ef4444' if data['type'] == 'mammal' else '#22c55e'
    marker = 'o' if data['type'] == 'mammal' else 's'
    ax1.loglog(data['mass'], data['bmr'], marker, color=color, markersize=10, zorder=5)
    ax1.annotate(name, xy=(data['mass'], data['bmr']),
                 xytext=(data['mass']*1.5, data['bmr']*1.5),
                 color='white', fontsize=8)

ax1.set_xlabel('Body mass (kg, log scale)', color='white')
ax1.set_ylabel('Metabolic rate (kcal/day, log scale)', color='white')
ax1.set_title("Kleiber's Law: Size vs. Metabolism", color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Lifespan vs metabolic rate per gram
ax2.set_facecolor('#111827')
lifespans = {'Mouse': 2, 'Rabbit': 9, 'Human': 80, 'Elephant': 65,
             'Box turtle': 50, 'Giant tortoise': 175, 'Crocodile': 70, 'Hummingbird': 5}
bmr_per_gram = {name: data['bmr']/(data['mass']*1000) for name, data in animals.items()}

for name in animals:
    color = '#ef4444' if animals[name]['type'] == 'mammal' else '#22c55e'
    ax2.scatter(bmr_per_gram[name], lifespans[name], c=color, s=150, zorder=5, edgecolors='white')
    ax2.annotate(name, xy=(bmr_per_gram[name], lifespans[name]),
                 xytext=(bmr_per_gram[name]*1.1, lifespans[name]+5),
                 color='white', fontsize=8)

ax2.set_xlabel('Metabolic rate per gram (kcal/day/g)', color='white')
ax2.set_ylabel('Maximum lifespan (years)', color='white')
ax2.set_title('Burn Fast, Die Young', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xscale('log')

plt.tight_layout()
plt.show()

print("Kleiber's Law: BMR = 70 * mass^0.75 (mammals)")
print("Reptiles: about 10x lower metabolic rate than mammals of same size")
print()
print("Giant tortoise: 200 kg, BMR = 120 kcal/day, lifespan = 175 years")
print("Human: 70 kg, BMR = 1800 kcal/day, lifespan = 80 years")
print("The tortoise eats 1/15th the calories and lives twice as long.")`,
      challenge: 'Calculate how many total calories a mouse burns in its 2-year lifetime vs. a giant tortoise in its 175-year lifetime. Which burns more total energy? What does this tell you about the "rate of living" hypothesis?',
      successHint: 'The relationship between metabolism and lifespan is one of biology\'s most consistent patterns. Slow metabolism = slow aging = long life. The turtle\'s "slowness" is actually a longevity strategy that has worked for 220 million years.',
    },
    {
      title: 'Convergent evolution — when different species find the same solution',
      concept: `The turtle\'s shell is unique among vertebrates. But shells and armor have evolved independently many times in different lineages. This is **convergent evolution** — when unrelated organisms evolve similar traits because they face similar challenges.

Shell-like structures evolved in:
- **Turtles** (reptiles): bony shell fused to skeleton, 220 million years ago
- **Armadillos** (mammals): bony plates (osteoderms) under skin, 55 million years ago
- **Pangolins** (mammals): overlapping keratin scales, 80 million years ago
- **Glyptodonts** (extinct mammals): massive dome shells, 5 million years ago
- **Ankylosaurs** (extinct dinosaurs): bony armor plates, 130 million years ago

None of these are closely related. They independently "discovered" that armor beats speed in their specific environments.

Convergent evolution is powerful evidence for natural selection: the same environmental pressure (predation) produces the same solution (armor) in completely different lineages.`,
      analogy: 'Convergent evolution is like different engineers in different countries independently inventing the wheel. They didn\'t copy each other — they all faced the same problem (moving heavy things) and arrived at the same solution (round rolling surface). The laws of physics constrain the solution space, just as the laws of biology constrain evolutionary solutions.',
      storyConnection: 'The turtle in the story is unique in its village of animals. But zoom out to the whole animal kingdom, and you find many "turtles" — animals that independently evolved the same slow-and-armored strategy. The story\'s lesson (slow and steady wins) isn\'t just a fable — it\'s a pattern that evolution has discovered again and again.',
      checkQuestion: 'Dolphins and sharks look remarkably similar (streamlined body, dorsal fin, flippers). Are they related?',
      checkAnswer: 'Not at all. Dolphins are mammals (warm-blooded, breathe air, give live birth). Sharks are fish (cold-blooded, breathe water, lay eggs). They diverged over 400 million years ago. Their similar body shape is convergent evolution: the laws of fluid dynamics dictate that the optimal shape for fast swimming is the same regardless of whether you\'re a fish or a mammal.',
      codeIntro: 'Map convergent evolution events on a timeline and phylogenetic tree.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Armored animals: independent evolution events
armored = {
    'Ankylosaur': {'evolved_mya': 130, 'extinct_mya': 66, 'group': 'Dinosaur', 'armor_type': 'Osteoderms'},
    'Turtle': {'evolved_mya': 220, 'extinct_mya': 0, 'group': 'Reptile', 'armor_type': 'Shell (bone)'},
    'Glyptodont': {'evolved_mya': 5, 'extinct_mya': 0.01, 'group': 'Mammal', 'armor_type': 'Dome shell'},
    'Armadillo': {'evolved_mya': 55, 'extinct_mya': 0, 'group': 'Mammal', 'armor_type': 'Bony bands'},
    'Pangolin': {'evolved_mya': 80, 'extinct_mya': 0, 'group': 'Mammal', 'armor_type': 'Keratin scales'},
    'Horseshoe crab': {'evolved_mya': 450, 'extinct_mya': 0, 'group': 'Arthropod', 'armor_type': 'Exoskeleton'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Timeline: when armor evolved
ax1.set_facecolor('#111827')
group_colors = {'Dinosaur': '#ef4444', 'Reptile': '#22c55e', 'Mammal': '#3b82f6', 'Arthropod': '#f59e0b'}
for i, (name, data) in enumerate(armored.items()):
    start = data['evolved_mya']
    end = data['extinct_mya']
    color = group_colors[data['group']]
    ax1.barh(i, start - end, left=end, color=color, height=0.6, alpha=0.8)
    ax1.text(start + 5, i, f"{name} ({data['armor_type']})", va='center', color='white', fontsize=9)

ax1.set_xlabel('Million years ago', color='white')
ax1.set_title('Armor Evolved Independently at Least 6 Times', color='white', fontsize=13)
ax1.set_yticks(range(len(armored)))
ax1.set_yticklabels(['' for _ in armored])
ax1.tick_params(colors='gray')
ax1.invert_xaxis()

# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor=c, label=g) for g, c in group_colors.items()]
ax1.legend(handles=legend_elements, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')

# Convergent traits comparison
ax2.set_facecolor('#111827')
traits = ['Body coverage\\\n(%)', 'Flexibility', 'Weight\\\n(relative)', 'Regrowth\\\nability']
turtle_traits = [95, 2, 8, 1]
armadillo_traits = [70, 7, 5, 1]
pangolin_traits = [80, 8, 4, 6]

x = np.arange(len(traits))
width = 0.25
ax2.bar(x - width, turtle_traits, width, color='#22c55e', label='Turtle')
ax2.bar(x, armadillo_traits, width, color='#3b82f6', label='Armadillo')
ax2.bar(x + width, pangolin_traits, width, color='#f59e0b', label='Pangolin')

ax2.set_xticks(x)
ax2.set_xticklabels(traits, color='gray')
ax2.set_ylabel('Score (1-10)', color='white')
ax2.set_title('Same Solution, Different Implementations', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Convergent evolution of armor:")
print("  6+ independent inventions across 450 million years")
print("  Different materials (bone, keratin, chitin)")
print("  Different designs (dome, bands, scales, shell)")
print("  Same function: protection from predators")
print()
print("If the same solution evolves independently multiple times,")
print("it's strong evidence that natural selection is predictable —")
print("the same problems produce the same solutions.")`,
      challenge: 'Research convergent evolution of flight (birds, bats, insects, pterosaurs). Create a similar timeline. How many times has flight evolved independently? What constraints do they all share?',
      successHint: 'Convergent evolution is one of the strongest arguments for natural selection. It shows that evolution isn\'t random — it\'s constrained by physics and ecology to produce predictable solutions to recurring problems.',
    },
    {
      title: 'Ectothermy vs. endothermy — two strategies for body temperature',
      concept: `Turtles are **ectotherms** ("cold-blooded") — they rely on external heat sources (sun, warm ground) to regulate body temperature. Mammals and birds are **endotherms** ("warm-blooded") — they generate internal heat by burning calories.

Neither is superior. Each is a trade-off:

**Ectothermy (turtle strategy):**
- Pro: needs 1/10th the food of a same-size endotherm
- Pro: can survive long periods without eating
- Con: sluggish in cold weather, can't be active at night in cold climates
- Con: limited to warmer habitats (no turtles in the Arctic)

**Endothermy (mammal strategy):**
- Pro: active at any temperature, any time of day
- Pro: faster muscle response, faster thinking
- Con: must eat constantly (shrew: eats its body weight daily)
- Con: starvation risk if food becomes scarce

The choice between these strategies profoundly shapes an animal's entire life: where it can live, when it's active, how much it eats, and how long it lives.`,
      analogy: 'Ectothermy is like a solar-powered house. Free energy from the sun, but it only works when the sun is shining. Endothermy is like a gas-heated house. Works anytime, anywhere, but you need a constant fuel supply. In a sunny climate, solar is brilliant. In a cold climate, you need gas. Neither is universally better.',
      storyConnection: 'The turtle in the story is most active during the warm afternoon and retreats in the evening. This isn\'t laziness — it\'s thermoregulation. The turtle literally can\'t move fast when it\'s cold because its muscles depend on external warmth. The other animals (birds, mammals) stay active regardless of temperature because they generate their own heat.',
      checkQuestion: 'Dinosaurs were traditionally classified as ectotherms (like modern reptiles). Recent evidence suggests many were actually endotherms or "mesotherms." What evidence would support this?',
      checkAnswer: 'Multiple lines: (1) Growth rings in bones show rapid growth rates (endotherm-like). (2) Isotope analysis of bones suggests maintained body temperature. (3) Many dinosaurs lived in polar regions (too cold for ectotherms). (4) Predator-prey ratios in fossil assemblages match endotherm ecosystems (few predators per prey). (5) Erect posture requires sustained muscle activity (hard for ectotherms). Modern birds are direct descendants of dinosaurs — and they\'re endotherms.',
      codeIntro: 'Model body temperature regulation in ectotherms vs. endotherms across a 24-hour cycle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.linspace(0, 24, 500)

# Environmental temperature (peaks at noon)
env_temp = 20 + 10 * np.sin((hours - 6) * np.pi / 12)
env_temp = np.clip(env_temp, 10, 30)

# Endotherm: maintains ~37°C regardless
endo_temp = 37 + np.random.normal(0, 0.3, len(hours))

# Ectotherm: tracks environment with lag
ecto_temp = np.zeros_like(hours)
ecto_temp[0] = env_temp[0]
thermal_inertia = 0.05  # how fast body temp follows environment
for i in range(1, len(hours)):
    dt = hours[i] - hours[i-1]
    ecto_temp[i] = ecto_temp[i-1] + thermal_inertia * (env_temp[i] - ecto_temp[i-1]) * dt * 10

# Activity capacity (% of max) as function of body temp
def activity(temp):
    # Optimal at 30-37°C, drops steeply below 20°C
    return np.clip((temp - 10) / 25, 0, 1) * 100

endo_activity = activity(endo_temp)
ecto_activity = activity(ecto_temp)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Temperature
ax1.set_facecolor('#111827')
ax1.plot(hours, env_temp, '--', color='gray', linewidth=1, label='Environment')
ax1.plot(hours, endo_temp, color='#ef4444', linewidth=2, label='Endotherm (mammal)')
ax1.plot(hours, ecto_temp, color='#22c55e', linewidth=2, label='Ectotherm (turtle)')
ax1.set_ylabel('Body temperature (°C)', color='white')
ax1.set_title('Body Temperature Over 24 Hours', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Add day/night shading
ax1.axvspan(0, 6, alpha=0.1, color='gray')
ax1.axvspan(18, 24, alpha=0.1, color='gray')
ax1.text(3, 35, 'Night', color='gray', fontsize=10, ha='center')
ax1.text(12, 35, 'Day', color='#f59e0b', fontsize=10, ha='center')
ax1.text(21, 35, 'Night', color='gray', fontsize=10, ha='center')

# Activity
ax2.set_facecolor('#111827')
ax2.fill_between(hours, endo_activity, alpha=0.3, color='#ef4444')
ax2.fill_between(hours, ecto_activity, alpha=0.3, color='#22c55e')
ax2.plot(hours, endo_activity, color='#ef4444', linewidth=2, label='Endotherm activity')
ax2.plot(hours, ecto_activity, color='#22c55e', linewidth=2, label='Ectotherm activity')
ax2.set_xlabel('Hour of day', color='white')
ax2.set_ylabel('Activity capacity (%)', color='white')
ax2.set_title('Who Can Be Active When?', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.axvspan(0, 6, alpha=0.1, color='gray')
ax2.axvspan(18, 24, alpha=0.1, color='gray')

plt.tight_layout()
plt.show()

print("Endotherm (mammal): 37°C constant, 100% activity capacity 24/7")
print("Ectotherm (turtle): tracks environment, activity drops at night")
print()
print("But the endotherm pays 10x more in food costs!")
print("In a stable warm environment, ectothermy is more efficient.")
print("In a variable/cold environment, endothermy wins.")`,
      challenge: 'Model a cold day: drop the peak environmental temperature from 30°C to 15°C. How does this affect the turtle\'s activity window? At what temperature does the turtle become completely immobile?',
      successHint: 'The ectotherm/endotherm divide shapes everything about an animal\'s life — when it\'s active, where it can live, how much it eats, and how long it lives. The turtle\'s "laziness" is thermodynamics, not personality.',
    },
    {
      title: 'Allometry — how size changes everything',
      concept: `**Allometry** is the study of how biological traits scale with body size. It's one of the most powerful predictive frameworks in biology.

Key scaling laws:
- **Heart rate ∝ mass^(-0.25)**: small animals have faster hearts. Mouse: 600 bpm. Elephant: 30 bpm.
- **Lifespan ∝ mass^(0.25)**: larger animals live longer. Mouse: 2 years. Elephant: 65 years.
- **Total heartbeats ≈ 1.5 billion**: remarkably, most mammals get about the same number of heartbeats in a lifetime. The mouse just uses them up faster.
- **Leg bone diameter ∝ mass^(0.375)**: bones must get proportionally thicker as animals get bigger (the square-cube law)

The turtle violates several of these predictions:
- Lives much longer than predicted for its size
- Heart rate is lower than predicted
- Total heartbeats far exceed 1.5 billion

This makes turtles biological outliers — their low metabolic rate bends the scaling rules.`,
      analogy: 'Allometry is like the engineering principle that you can\'t just scale up a model. A matchstick bridge works at 10cm but collapses at 10m. The forces scale with volume (cube of size) but structural strength scales with cross-section (square of size). This is why ants can carry 50× their weight but elephants can barely carry their own. Biology has the same constraints.',
      storyConnection: 'The story\'s turtle is small but mighty. Allometry explains why: at small sizes, the square-cube law means an animal is stronger relative to its weight. A tiny turtle can retract into its shell effortlessly, but a giant tortoise struggles to even walk. Size changes everything — it\'s not just "more of the same."',
      checkQuestion: 'If you scaled a mouse up to elephant size, keeping all proportions the same, what would happen?',
      checkAnswer: 'It would collapse and die instantly. Its legs would snap — bone strength scales with cross-section area (length²) but weight scales with volume (length³). A mouse scaled up 100× in length would be 100² = 10,000× stronger in bones but 100³ = 1,000,000× heavier. The bones would support only 1% of the weight needed. This is why elephants have proportionally much thicker legs than mice.',
      codeIntro: 'Plot allometric scaling laws and find where turtles break the rules.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Allometric data: mass (kg), heart rate (bpm), lifespan (years)
mammals = {
    'Mouse':      {'mass': 0.03, 'hr': 600, 'lifespan': 2},
    'Rat':        {'mass': 0.3, 'hr': 350, 'lifespan': 3},
    'Rabbit':     {'mass': 2, 'hr': 200, 'lifespan': 9},
    'Cat':        {'mass': 4, 'hr': 150, 'lifespan': 15},
    'Dog':        {'mass': 20, 'hr': 100, 'lifespan': 13},
    'Human':      {'mass': 70, 'hr': 72, 'lifespan': 80},
    'Horse':      {'mass': 500, 'hr': 38, 'lifespan': 30},
    'Elephant':   {'mass': 5000, 'hr': 30, 'lifespan': 65},
}

turtles = {
    'Box turtle':      {'mass': 0.5, 'hr': 25, 'lifespan': 50},
    'Giant tortoise':  {'mass': 200, 'hr': 10, 'lifespan': 175},
    'Sea turtle':      {'mass': 150, 'hr': 15, 'lifespan': 80},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Heart rate vs mass
ax1.set_facecolor('#111827')
mass_line = np.logspace(-2, 4, 100)
hr_predicted = 240 * mass_line ** (-0.25)

ax1.loglog(mass_line, hr_predicted, '--', color='gray', alpha=0.5, label='Predicted (mammals)')
for name, d in mammals.items():
    ax1.loglog(d['mass'], d['hr'], 'o', color='#ef4444', markersize=8)
    ax1.annotate(name, xy=(d['mass'], d['hr']), xytext=(d['mass']*1.5, d['hr']*1.1), color='white', fontsize=7)
for name, d in turtles.items():
    ax1.loglog(d['mass'], d['hr'], 's', color='#22c55e', markersize=10, zorder=5)
    ax1.annotate(name, xy=(d['mass'], d['hr']), xytext=(d['mass']*1.5, d['hr']*0.7), color='#22c55e', fontsize=8)

ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Heart rate (bpm)', color='white')
ax1.set_title('Heart Rate Scaling: Turtles Break the Rules', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Total lifetime heartbeats
ax2.set_facecolor('#111827')
all_animals = {**mammals, **turtles}
names = list(all_animals.keys())
heartbeats = []
colors_hb = []
for name, d in all_animals.items():
    total_hb = d['hr'] * 60 * 24 * 365 * d['lifespan']
    heartbeats.append(total_hb / 1e9)  # in billions
    colors_hb.append('#22c55e' if name in turtles else '#ef4444')

sorted_idx = np.argsort(heartbeats)
ax2.barh([names[i] for i in sorted_idx], [heartbeats[i] for i in sorted_idx],
         color=[colors_hb[i] for i in sorted_idx], height=0.6)
ax2.axvline(1.5, color='#f59e0b', linestyle='--', linewidth=2, label='~1.5B heartbeats (mammal average)')
ax2.set_xlabel('Total lifetime heartbeats (billions)', color='white')
ax2.set_title('Total Heartbeats in a Lifetime', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Most mammals get ~1.5 billion heartbeats in a lifetime.")
print("The mouse uses them in 2 years. The elephant in 65 years.")
print()
for name, d in turtles.items():
    total = d['hr'] * 60 * 24 * 365 * d['lifespan'] / 1e9
    print(f"  {name}: {total:.1f} billion heartbeats ({d['lifespan']} years)")
print()
print("Turtles SHATTER the mammal pattern — low heart rate + long life")
print("= many more total heartbeats. Their slow metabolism defies the 'rule.'")`,
      challenge: 'Calculate the total lifetime heartbeats for a hummingbird (HR=1200 bpm, lifespan=5 years). Does it follow the 1.5 billion rule? Now calculate for a Greenland shark (HR=5 bpm, lifespan=400 years). What pattern emerges?',
      successHint: 'Allometry reveals that biology is governed by mathematical scaling laws. The turtle doesn\'t just break one rule — it bends all of them. Understanding why tells us deep truths about the relationship between metabolism, time, and life itself.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Evolution & Body Plan Trade-offs</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
