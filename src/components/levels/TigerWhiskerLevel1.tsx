import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TigerWhiskerLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Sensory systems overview — how animals sense the world',
      concept: `In "The Tiger's Whisker," a young girl plucks a whisker from a tiger to make a healing potion. She must earn the tiger's trust over months by bringing food closer each night. But that tiger knew she was there long before it could see her — through its **whiskers**.

Animals experience the world through **sensory systems** — biological instruments that detect stimuli (light, sound, touch, chemicals, temperature) and convert them into electrical signals the brain can understand.

The five classical senses (sight, hearing, touch, smell, taste) are just the beginning. Animals also detect:
- **Magnetic fields** (migratory birds)
- **Electric fields** (sharks, platypus)
- **Infrared radiation** (pit vipers)
- **Ultrasound** (bats, dolphins)
- **Water pressure changes** (fish lateral line)

Each sense evolved because it gave the animal an advantage in its specific environment.`,
      analogy: 'Sensory systems are like different types of antennae on a building. A TV antenna picks up radio waves, a satellite dish catches microwave signals, a weather vane detects wind. Each is a specialised detector for one type of information. Animals are buildings covered in dozens of different antennae.',
      storyConnection: 'The tiger in the story could sense the girl approaching each night even in total darkness. Its whiskers detected air currents, vibrations, and nearby objects. The girl needed patience and trust; the tiger relied on sensory systems far more sophisticated than human touch.',
      checkQuestion: 'Why do cats have whiskers on their legs and above their eyes, not just on their muzzle?',
      checkAnswer: 'Different whisker locations detect different things. Muzzle whiskers map nearby objects and gauge gap widths. Leg whiskers (carpal vibrissae) detect ground texture and prey movement. Eyebrow whiskers trigger a protective blink reflex. It is a distributed sensor network, not a single instrument.',
      codeIntro: 'Compare the sensory ranges of different animals across five senses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sensory capability scores (0-10) for different animals
categories = ['Vision', 'Hearing', 'Touch', 'Smell', 'Taste']
N = len(categories)

animals = {
    'Tiger': [7, 6, 9, 8, 4],
    'Human': [8, 5, 5, 3, 7],
    'Eagle': [10, 4, 3, 3, 2],
    'Dog': [4, 7, 4, 10, 3],
    'Star-nosed mole': [1, 3, 10, 6, 5],
}
colors = {'Tiger': '#f59e0b', 'Human': '#3b82f6', 'Eagle': '#ef4444', 'Dog': '#22c55e', 'Star-nosed mole': '#a855f7'}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for name, values in animals.items():
    values_plot = values + values[:1]
    ax.plot(angles, values_plot, 'o-', linewidth=2, label=name, color=colors[name])
    ax.fill(angles, values_plot, alpha=0.08, color=colors[name])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=10)
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax.tick_params(colors='gray')
ax.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_title('Sensory Capability Profiles', color='white', fontsize=14, pad=20)

plt.tight_layout()
plt.show()

print("Key observations:")
print("  Tiger: top-tier touch (whiskers) and smell")
print("  Eagle: unmatched vision, weak everything else")
print("  Dog: smell champion")
print("  Star-nosed mole: touch specialist (22 tentacles)")
print("  Human: balanced but not best at anything")`,
      challenge: 'Add a bat to the chart. Bats have poor vision (2), superb hearing (10), moderate touch (5), decent smell (6), and low taste (2). How does their profile compare to the tiger?',
      successHint: 'Every animal is optimised for its ecological niche. There is no "best" sensory system — only the best one for a particular environment and lifestyle.',
    },
    {
      title: 'Mechanoreception — feeling forces',
      concept: `Touch isn't one sense — it's a family of senses all based on **mechanoreception**: detecting mechanical forces (pressure, vibration, stretch, flow).

Your skin alone has four types of mechanoreceptors:
- **Merkel cells**: sustained pressure, fine texture (reading Braille)
- **Meissner corpuscles**: light touch, flutter (feeling a feather)
- **Pacinian corpuscles**: deep vibration (feeling a phone buzz in your pocket)
- **Ruffini endings**: skin stretch (sensing finger position)

Each type responds to a different kind of mechanical stimulus. Together, they let you distinguish silk from sandpaper, detect a fly landing on your arm, and type without looking at the keyboard.

Whiskers work through the same principle: mechanical force bends the hair, which activates mechanoreceptors in the hair follicle.`,
      analogy: 'Think of the four mechanoreceptors as four different microphones. One records only bass (deep vibrations, Pacinian). One picks up treble (light flutter, Meissner). One is a pressure meter (Merkel). One measures stretching (Ruffini). Together, they give the brain a full "audio mix" of touch information.',
      storyConnection: 'When the girl in the story slowly reached toward the tiger each night, the tiger felt her approach through air pressure changes on its whiskers — mechanoreception in action. The whisker follicle is packed with more mechanoreceptors per square millimetre than almost any other tissue in the animal kingdom.',
      checkQuestion: 'Why can you feel a phone vibrating in your pocket but not the constant pressure of the phone sitting there?',
      checkAnswer: 'Pacinian corpuscles (vibration detectors) respond to changes in pressure, not sustained pressure. They adapt rapidly — firing when the stimulus starts and stops, but going silent in between. Merkel cells detect sustained pressure, but they are less sensitive. Your brain essentially filters out constant background stimuli.',
      codeIntro: 'Model the response of different mechanoreceptors to a sustained press.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Time in milliseconds
t = np.linspace(0, 500, 1000)

# Stimulus: sustained pressure applied at t=50, released at t=350
stimulus = np.where((t >= 50) & (t <= 350), 1.0, 0.0)

# Slowly adapting (Merkel cell) — sustained response
merkel = stimulus * np.where(t < 50, 0, np.exp(-0.001 * (t - 50)))
merkel = np.where(stimulus > 0, np.maximum(merkel, 0.4), merkel * 0.1)

# Rapidly adapting (Meissner) — responds to onset and offset
onset = np.where((t >= 50) & (t < 100), np.exp(-0.06 * (t - 50)), 0)
offset = np.where((t >= 350) & (t < 400), np.exp(-0.06 * (t - 350)), 0)
meissner = onset + offset

# Very rapidly adapting (Pacinian) — sharp spikes only
pac_onset = np.where((t >= 50) & (t < 70), np.exp(-0.15 * (t - 50)), 0)
pac_offset = np.where((t >= 350) & (t < 370), np.exp(-0.15 * (t - 350)), 0)
pacinian = pac_onset + pac_offset

fig, axes = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

labels = ['Stimulus\
(pressure)', 'Merkel cell\
(slow adapt)', 'Meissner\
(rapid adapt)', 'Pacinian\
(very rapid)']
data = [stimulus, merkel, meissner, pacinian]
colors = ['#9ca3af', '#22c55e', '#3b82f6', '#f59e0b']

for ax, label, d, c in zip(axes, labels, data, colors):
    ax.set_facecolor('#111827')
    ax.fill_between(t, d, alpha=0.3, color=c)
    ax.plot(t, d, color=c, linewidth=1.5)
    ax.set_ylabel(label, color='white', fontsize=8, rotation=0, labelpad=70, va='center')
    ax.set_ylim(-0.1, 1.3)
    ax.tick_params(colors='gray')
    ax.set_yticks([])

axes[0].set_title('Mechanoreceptor Adaptation: Response to Sustained Pressure', color='white', fontsize=12)
axes[-1].set_xlabel('Time (ms)', color='white')

plt.tight_layout()
plt.show()

print("Merkel cells: fire as long as pressure is applied (slow adapting)")
print("Meissner: fire at onset and offset only (rapid adapting)")
print("Pacinian: sharp spike at changes only (very rapid adapting)")
print()
print("This is why you stop 'feeling' your clothes after putting them on.")
print("The rapidly adapting receptors go silent once the pressure is constant.")`,
      challenge: 'Add a vibrating stimulus (oscillating between 0 and 1 at 50Hz) instead of sustained pressure. Which receptor type would fire continuously?',
      successHint: 'Adaptation in mechanoreceptors is not a bug — it is a feature. The brain needs to know about changes in the environment, not constants. A tiger needs to know when something new enters its space, not that the ground is still there.',
    },
    {
      title: 'Whisker anatomy — vibrissae up close',
      concept: `Cat whiskers are not ordinary hairs. They are called **vibrissae** (from Latin "vibrare" — to vibrate), and they are engineering marvels:

**Structure:**
- Each vibrissa is 2-3x thicker than regular fur
- The root sits in a **blood sinus** — a capsule of blood that amplifies tiny vibrations
- Up to 200 nerve endings surround each follicle (compared to ~20 for a normal hair)
- The follicle is surrounded by a ring of muscle, allowing the cat to sweep whiskers forward and back

**Arrangement:**
- Tigers have ~24 mystacial (muzzle) whiskers in 4 rows per side
- The whiskers form a grid pattern — each row and column maps to a specific brain region
- Whisker tips spread to exactly the width of the animal's body

**Function:**
- Detect air currents (approaching prey or predators)
- Measure gap width (can I fit through here?)
- Sense object texture and shape (in the dark)
- Navigate in zero-visibility conditions (underwater for otters)`,
      analogy: 'A vibrissa is like a high-precision antenna mounted on a hydraulic base (the blood sinus). The blood acts like fluid in a spirit level — tiny movements of the hair create pressure waves in the blood, amplifying the signal before it reaches the nerve endings. It is mechanical amplification, the same principle used in hydraulic brakes.',
      storyConnection: 'The girl in the story plucked a single whisker from the tiger. In real life, losing one whisker is disorienting for a cat — like losing a pixel from a camera sensor. The brain must recalibrate its spatial map. The whisker she took was a sophisticated instrument, not just a hair.',
      checkQuestion: 'Tiger whiskers span exactly the width of the tiger\'s body. Why is this useful?',
      checkAnswer: 'It lets the tiger instantly know whether it can fit through a gap. If the whiskers touch both sides of an opening, the body cannot pass. It is a real-time measurement tool that works in total darkness. This is why cats rarely get stuck in tight spaces — they measure first.',
      codeIntro: 'Visualise the arrangement and sensitivity zones of tiger whiskers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left panel: whisker arrangement on tiger muzzle
ax1.set_facecolor('#111827')
ax1.set_xlim(-6, 6)
ax1.set_ylim(-4, 4)
ax1.set_aspect('equal')

# Draw simplified muzzle (ellipse)
theta = np.linspace(0, 2*np.pi, 100)
ax1.plot(2*np.cos(theta), 1.5*np.sin(theta), color='#f59e0b', linewidth=2, alpha=0.5)
ax1.fill(2*np.cos(theta), 1.5*np.sin(theta), color='#f59e0b', alpha=0.1)

# Whisker positions: 4 rows x 6 columns on each side
rows_y = [1.0, 0.33, -0.33, -1.0]
cols_x_base = [1.8, 2.2, 2.6, 3.0, 3.5, 4.0]
whisker_lengths = [2.0, 2.5, 3.0, 3.5, 4.0, 5.0]

for side in [1, -1]:
    for ri, ry in enumerate(rows_y):
        for ci, (cx, wl) in enumerate(zip(cols_x_base, whisker_lengths)):
            angle = (ri - 1.5) * 8 + side * 15
            rad = np.radians(angle)
            x_start = side * cx * 0.5
            y_start = ry
            x_end = side * (cx * 0.5 + wl * np.cos(rad) * 0.4)
            y_end = ry + wl * np.sin(rad) * 0.15
            ax1.plot([x_start, x_end], [y_start, y_end], color='white', linewidth=1.5 - ci*0.1, alpha=0.8)
            ax1.plot(x_start, y_start, 'o', color='#ef4444', markersize=3)

ax1.set_title('Tiger Whisker Arrangement (4 rows x ~6 per side)', color='white', fontsize=11)
ax1.text(0, -3, 'Each red dot = follicle with ~200 nerve endings', color='#ef4444', ha='center', fontsize=9)
ax1.axis('off')

# Right panel: sensitivity comparison
ax2.set_facecolor('#111827')
structures = ['Regular hair', 'Fingertip', 'Lip', 'Whisker follicle', 'Whisker + sinus']
nerve_count = [5, 40, 50, 200, 400]
bar_colors = ['#6b7280', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']

bars = ax2.barh(structures, nerve_count, color=bar_colors, height=0.6)
ax2.set_xlabel('Nerve endings per unit', color='white')
ax2.set_title('Mechanoreceptor Density Comparison', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for bar, val in zip(bars, nerve_count):
    ax2.text(bar.get_width() + 8, bar.get_y() + bar.get_height()/2, f'{val}',
             va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Tiger whisker facts:")
print("  - ~24 whiskers per side (mystacial vibrissae)")
print("  - Each follicle: ~200 nerve endings")
print("  - Blood sinus amplifies signals by ~10x")
print("  - Whisker span = body width (gap measurement)")
print("  - Can detect air currents from prey movement at >2m distance")`,
      challenge: 'Modify the whisker arrangement to show what happens when one whisker is removed (like in the story). Colour the missing whisker\'s region in red to show the "blind spot" in the sensory map.',
      successHint: 'Vibrissae are among the most sensitive touch organs in the animal kingdom. Engineers study them to design better tactile sensors for robots and prosthetics.',
    },
    {
      title: 'How cats navigate in darkness',
      concept: `A tiger hunts primarily at night. Its eyes have excellent night vision (6x better than humans), but in thick vegetation or underground dens, even good eyes aren't enough. This is where whiskers become essential.

**Night navigation strategy:**
1. **Air current mapping**: whiskers detect air flowing around obstacles before the tiger reaches them — like sonar, but for airflow
2. **Texture scanning**: sweeping whiskers forward and back (at 8-12 Hz) creates a tactile image of nearby objects
3. **Whisking**: cats actively move their whiskers to "scan" the environment, much like how eyes saccade (make rapid movements) to build a visual picture
4. **Bilateral comparison**: comparing left and right whisker signals tells the brain the direction of a stimulus

The whisking cycle:
- **Protraction**: whiskers sweep forward (muscles contract)
- **Contact**: whiskers touch object, bend proportional to force
- **Retraction**: whiskers pull back, ready for next sweep
- **Processing**: brain integrates ~1000 touches per second

This happens so fast that the cat builds a real-time 3D tactile map of its surroundings.`,
      analogy: 'Whisking is like running your hand over objects in a dark room — except 24 "fingers" do it simultaneously at 12 times per second. Imagine being able to feel the shape, texture, and distance of everything within arm\'s reach, all at once, in complete darkness.',
      storyConnection: 'In the story, the girl visits the tiger each night in darkness. The tiger always knew exactly where she was, how far away, and whether she was a threat — all from whisker readings of air currents and ground vibrations. She thought she was being stealthy; the tiger was tracking her every step.',
      checkQuestion: 'Cats move their whiskers forward when approaching prey but pull them back against their face during a fight. Why?',
      checkAnswer: 'Forward whiskers act as a precision sensor to guide the killing bite to exactly the right spot on the prey\'s neck. Pulled-back whiskers protect them from damage during a fight — damaged whiskers mean degraded navigation. Cats prioritise protecting their "instruments" when the situation doesn\'t require them.',
      codeIntro: 'Simulate whisker-based object detection in darkness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Simulate cat approaching three scenarios: open gap, narrow gap, obstacle
scenarios = ['Open gap (can pass)', 'Narrow gap (tight fit)', 'Obstacle (blocked)']
gap_widths = [40, 22, 10]  # cm, tiger body width ~20cm for house cat
body_width = 20

for ax, title, gap in zip(axes, scenarios, gap_widths):
    ax.set_facecolor('#111827')
    ax.set_xlim(-25, 25)
    ax.set_ylim(-5, 30)
    ax.set_aspect('equal')

    # Draw walls (gap in the middle)
    ax.fill_between([-25, -gap/2], 15, 25, color='#4b5563', alpha=0.8)
    ax.fill_between([gap/2, 25], 15, 25, color='#4b5563', alpha=0.8)

    # Draw cat body (circle)
    cat = plt.Circle((0, 5), body_width/2, color='#f59e0b', alpha=0.3)
    ax.add_patch(cat)
    ax.plot(0, 5, 'o', color='#f59e0b', markersize=5)

    # Draw whiskers (span = body width + margin)
    whisker_span = 24  # cm total, each side 12cm
    n_whiskers = 6
    for side in [-1, 1]:
        for i in range(n_whiskers):
            angle = np.radians(30 + i * 15)
            length = 8 + i * 1.5
            x_end = side * length * np.cos(angle) * 0.8
            y_end = 5 + length * np.sin(angle) * 0.6

            # Check if whisker touches wall
            wall_x = side * gap / 2
            touches_wall = abs(x_end) >= gap / 2 and y_end >= 15

            color = '#ef4444' if touches_wall else '#22c55e'
            ax.plot([0, x_end], [5 + body_width/2 * 0.3, y_end],
                    color=color, linewidth=1.5, alpha=0.8)
            if touches_wall:
                clip_x = wall_x
                ax.plot(clip_x, y_end, 'o', color='#ef4444', markersize=4)

    decision = 'GO' if gap > body_width + 4 else ('SQUEEZE' if gap >= body_width else 'STOP')
    dec_color = '#22c55e' if decision == 'GO' else ('#f59e0b' if decision == 'SQUEEZE' else '#ef4444')
    ax.text(0, -3, f'Decision: {decision}', ha='center', color=dec_color, fontsize=11, fontweight='bold')
    ax.set_title(f'{title}\
Gap: {gap}cm', color='white', fontsize=10)
    ax.axis('off')

plt.suptitle('Whisker Gap Detection (body width = 20cm)', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print("How whisker gap detection works:")
print(f"  Body width: {body_width}cm")
print(f"  Whisker span: ~24cm (slightly wider than body)")
print()
for title, gap in zip(scenarios, gap_widths):
    status = "pass" if gap > body_width + 4 else ("tight" if gap >= body_width else "blocked")
    print(f"  {gap}cm gap: whiskers {'clear' if gap > 24 else 'touch walls'} -> {status}")`,
      challenge: 'Add a scenario where the gap is angled (not perpendicular). This requires the cat to tilt its head to measure the actual width. How would asymmetric whisker signals help?',
      successHint: 'This gap-detection system works in total darkness with zero energy cost beyond muscle movement. Engineers are designing robots with artificial whisker arrays for pipe inspection and search-and-rescue in collapsed buildings.',
    },
    {
      title: 'Sensory maps in the brain — the barrel cortex',
      concept: `Every whisker on a rodent's face maps to a specific cluster of neurons in the brain called a **barrel** (because of its barrel-like shape under a microscope). Together, these clusters form the **barrel cortex** — a brain map where the physical layout of whiskers is preserved as a neural layout.

This is called **somatotopy**: the body surface is mapped onto the brain surface. Your brain has one too — the **somatosensory homunculus** — where each body part has a corresponding brain region. Parts with more nerve endings (fingers, lips) get more brain space.

Key principles:
- **One whisker, one barrel**: each whisker has a dedicated brain column (~4000 neurons)
- **Spatial preservation**: neighbouring whiskers map to neighbouring barrels
- **Proportional representation**: more sensitive areas get more brain space
- **Plasticity**: if a whisker is lost, its barrel can be "taken over" by neighbouring barrels

This means the brain literally has a picture of the whisker pad — a neural copy of the physical sensor array.`,
      analogy: 'Imagine a keyboard where each key has its own dedicated processing chip. Press the "A" key, and chip #A activates. The chips are arranged in the same layout as the keys. If you remove a key, the neighbouring chips expand their territory to cover the gap. That is the barrel cortex.',
      storyConnection: 'When the girl plucked the tiger\'s whisker, the corresponding barrel in the tiger\'s brain gradually lost its dedicated input. Over time, the neighbouring barrels would expand to use the freed-up neurons. The tiger\'s brain would literally rewire itself — losing resolution in one spot but gaining it in adjacent ones.',
      checkQuestion: 'On a somatosensory homunculus (brain map of the body), the hands and lips are enormous but the back is tiny. Why?',
      checkAnswer: 'Brain area is proportional to receptor density, not physical size. Your fingertips have ~2,500 receptors per cm², while your back has ~10. You need fine resolution in your hands (for tool use, textures) and lips (for speech, eating) but not your back. Evolution allocates brain space based on usefulness, not body size.',
      codeIntro: 'Build a somatosensory homunculus — a map showing how much brain space each body part gets.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Body parts and their proportional somatosensory cortex representation
# Larger value = more brain area = more sensitive
body_parts = [
    'Lips', 'Fingers', 'Tongue', 'Hand palm', 'Face',
    'Foot sole', 'Toes', 'Forearm', 'Upper arm', 'Trunk',
    'Thigh', 'Lower leg', 'Neck', 'Shoulder', 'Back'
]
brain_area = [15, 14, 12, 8, 7, 5, 4, 3, 2.5, 2, 2, 2, 2.5, 2, 1.5]  # relative units
receptor_density = [50, 100, 45, 15, 30, 20, 15, 8, 5, 3, 4, 5, 8, 4, 2]  # per cm2

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Left: horizontal bar chart of brain representation
ax1.set_facecolor('#111827')
colors = plt.cm.YlOrRd(np.array(brain_area) / max(brain_area))
bars = ax1.barh(body_parts, brain_area, color=colors, height=0.7)
ax1.set_xlabel('Relative brain area in somatosensory cortex', color='white')
ax1.set_title('Somatosensory Homunculus\
(Brain space per body part)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()
for bar, val in zip(bars, brain_area):
    ax1.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
             f'{val}', va='center', color='white', fontsize=9)

# Right: scatter plot brain area vs receptor density
ax2.set_facecolor('#111827')
scatter = ax2.scatter(receptor_density, brain_area, c=brain_area,
                       cmap='YlOrRd', s=100, edgecolors='white', linewidth=0.5)
for i, part in enumerate(body_parts):
    ax2.annotate(part, (receptor_density[i], brain_area[i]),
                 xytext=(5, 5), textcoords='offset points',
                 color='white', fontsize=8)

ax2.set_xlabel('Receptor density (per cm²)', color='white')
ax2.set_ylabel('Relative brain area', color='white')
ax2.set_title('More receptors = More brain space', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Fit line
z = np.polyfit(receptor_density, brain_area, 1)
x_fit = np.linspace(0, max(receptor_density) + 10, 100)
ax2.plot(x_fit, np.polyval(z, x_fit), '--', color='#f59e0b', alpha=0.5)

plt.tight_layout()
plt.show()

print("The brain is a distorted map of the body.")
print("Fingers get 7x more brain space than the entire back.")
print("A tiger's barrel cortex: each whisker = ~4000 neurons.")
print("With 24 whiskers per side, that's ~192,000 neurons dedicated to whiskers alone.")`,
      challenge: 'Add a "tiger whisker" data point: receptor density ~200 per cm², brain area ~18 relative units. Where does it fall on the scatter plot? What does this tell you about how important whiskers are to a tiger?',
      successHint: 'The brain does not treat all body parts equally. It allocates computing power where it matters most. For a tiger, whiskers are as important as fingers are to a surgeon.',
    },
    {
      title: 'Touch technology — haptic feedback',
      concept: `Engineers have studied animal sensory systems for decades to build artificial touch. This field is called **haptics** — the science of simulating touch sensations with technology.

Current haptic technologies:
- **Vibrotactile**: small motors that vibrate (your phone)
- **Force feedback**: motors that push back (game controllers, surgical robots)
- **Electrotactile**: mild electrical pulses that simulate texture
- **Ultrasonic**: focused ultrasound creates "touchable" points in mid-air
- **Shape displays**: arrays of pins that rise and fall to create 3D surfaces

Applications:
- **Prosthetic hands**: sensors on artificial fingers send signals to remaining nerves, restoring a sense of touch
- **Surgical robots**: surgeons "feel" tissue through robotic instruments
- **VR/gaming**: haptic gloves let you feel virtual objects
- **Phones**: different vibrations for different notifications
- **Car safety**: steering wheel vibration warns of lane departure

The goal: recreate the richness of biological touch (pressure, texture, temperature, vibration) with technology.`,
      analogy: 'Current haptics vs. real touch is like a 1980s beeper vs. a modern smartphone. We can do vibrations and simple forces, but the full richness of touch — the feel of velvet, the warmth of skin, the prick of a thorn — remains far beyond our technology. Animal sensory systems are still vastly superior.',
      storyConnection: 'The tiger\'s whisker in the story was a healing ingredient because of its rarity and the trust required to obtain it. In engineering, understanding whisker mechanics has directly inspired tactile sensor designs for robots. The biological whisker is the blueprint; haptics is the engineering attempt to copy it.',
      checkQuestion: 'Why do surgeons using robotic surgery systems (like the da Vinci robot) say they miss the sense of touch most?',
      checkAnswer: 'Without haptic feedback, surgeons cannot feel how hard they are pressing on tissue. Too much force tears delicate structures; too little and the instrument slips. Experienced surgeons rely heavily on touch — feeling the difference between healthy and diseased tissue. Current surgical robots provide visual feedback but limited haptic feedback, making some tasks harder.',
      codeIntro: 'Compare human touch resolution with current haptic technology across different dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comparison: biological touch vs haptic tech
categories = ['Spatial\
resolution', 'Temporal\
resolution', 'Force\
range', 'Texture\
detection', 'Temperature\
sensing', 'Multi-point\
touch']

# Scores out of 10
bio_touch = [9, 9, 8, 9, 8, 10]  # human fingertip
phone_haptic = [1, 3, 2, 1, 0, 1]
game_controller = [2, 4, 5, 1, 0, 2]
vr_glove = [4, 5, 6, 3, 1, 5]
prosthetic = [3, 4, 4, 2, 2, 3]
tiger_whisker = [8, 10, 7, 8, 3, 9]

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

x = np.arange(len(categories))
width = 0.13

systems = [
    ('Human fingertip', bio_touch, '#22c55e'),
    ('Tiger whisker', tiger_whisker, '#f59e0b'),
    ('VR haptic glove', vr_glove, '#8b5cf6'),
    ('Game controller', game_controller, '#3b82f6'),
    ('Prosthetic hand', prosthetic, '#ec4899'),
    ('Phone vibration', phone_haptic, '#6b7280'),
]

for i, (name, scores, color) in enumerate(systems):
    offset = (i - len(systems)/2 + 0.5) * width
    bars = ax.bar(x + offset, scores, width, label=name, color=color, alpha=0.85)

ax.set_xticks(x)
ax.set_xticklabels(categories, color='white', fontsize=9)
ax.set_ylabel('Capability score (0-10)', color='white')
ax.set_title('Biological Touch vs Haptic Technology', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, ncol=3, loc='upper right')
ax.tick_params(colors='gray')
ax.set_ylim(0, 12)

plt.tight_layout()
plt.show()

print("The gap between biology and technology:")
print("  Human fingertip: can detect bumps 13 nanometres high")
print("  Best haptic device: ~1mm resolution (77,000x worse)")
print()
print("  Tiger whisker: detects air displacement of 0.001mm")
print("  Best artificial whisker sensor: ~0.1mm (100x worse)")
print()
print("Nature had 500 million years of R&D.")
print("Haptic engineering has had about 50 years.")
print("The gap is closing, but biology still leads by orders of magnitude.")`,
      challenge: 'Research one real haptic device (like the Phantom Omni or HaptX gloves) and update its scores in the chart. How does it compare to the simple categories shown here?',
      successHint: 'From whiskers to brain maps to engineered haptics, you have traced the full arc of sensory science. Level 2 takes you deeper into the neuroscience — how signals travel from whisker to brain, and how we are building brain-machine interfaces.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Animal Anatomy & Sensory Systems</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for sensory system simulations. Click to start.</p>
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
