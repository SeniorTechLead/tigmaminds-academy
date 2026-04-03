import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LittleChefLevel1() {
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
      title: 'States of matter in cooking — solid, liquid, gas, and beyond',
      concept: `In "The Little Chef of Jorhat," a young cook transforms simple ingredients into extraordinary dishes. Every cooking technique involves changing the **state of matter** — and understanding those transitions is the foundation of food science.

**State changes in the kitchen:**
- **Melting** (solid → liquid): butter melting in a pan (32°C), chocolate tempering
- **Boiling** (liquid → gas): water to steam at 100°C (at sea level)
- **Evaporation** (liquid → gas below boiling): reducing a sauce, drying herbs
- **Solidification** (liquid → solid): setting a jelly, freezing ice cream
- **Sublimation** (solid → gas): freeze-drying food, frost disappearing from freezer
- **Denaturation** (special): proteins unfolding when heated (egg white turning opaque)

**Key cooking temperatures:**
- 0°C: water freezes / ice melts
- 62°C: egg white proteins begin denaturing
- 100°C: water boils (the ceiling for wet cooking)
- 140°C: sugar caramelisation begins
- 154°C: Maillard reaction accelerates (browning)
- 180°C: typical deep-frying temperature
- 250°C+: pizza oven, bread crust formation

The reason 100°C is so important: as long as water is present and liquid, the temperature cannot exceed 100°C (at standard pressure). This is why boiled food is soft and steamed food is moist — but roasted food develops a crust once the surface water evaporates.`,
      analogy: 'Cooking states of matter are like a crowded dance floor. At low temperature (slow music), molecules barely move (solid). As the music speeds up (heating), they jostle more freely (liquid). Crank the music to maximum, and they fly off the dance floor entirely (gas). A cook controls the music to get exactly the behaviour they want.',
      storyConnection: 'The little chef in the story knows intuitively that butter must melt before flour can be coated, that rice must absorb boiling water, and that spices release flavour when heated in oil above water\'s boiling point. Every step in a recipe is a controlled state change — the cook is a chemist who measures with their senses instead of instruments.',
      checkQuestion: 'Why does food cook faster in a pressure cooker?',
      checkAnswer: 'A pressure cooker increases the air pressure above the water. Higher pressure raises water\'s boiling point — from 100°C at 1 atm to about 121°C at 2 atm. The higher temperature cooks food faster (chemical reaction rates roughly double for every 10°C increase). A pressure cooker is a device for raising the boiling point of water.',
      codeIntro: 'Map the key cooking temperatures and the state changes that happen at each.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Temperature scale with cooking events
events = [
    (-18, 'Freezer storage', '#60a5fa'),
    (0, 'Ice melts / water freezes', '#3b82f6'),
    (40, 'Butter melts', '#f59e0b'),
    (62, 'Egg whites set', '#fbbf24'),
    (70, 'Collagen → gelatin', '#f97316'),
    (100, 'Water boils', '#ef4444'),
    (121, 'Pressure cooker', '#dc2626'),
    (140, 'Sugar caramelises', '#a855f7'),
    (154, 'Maillard reaction', '#7c3aed'),
    (180, 'Deep frying', '#ec4899'),
    (250, 'Pizza oven', '#f43f5e'),
    (300, 'Tandoor/charring', '#be123c'),
]

ax1.set_facecolor('#111827')
temps = [e[0] for e in events]
labels = [e[1] for e in events]
colors = [e[2] for e in events]

ax1.barh(range(len(events)), temps, color=colors, height=0.6, alpha=0.8)
ax1.set_yticks(range(len(events)))
ax1.set_yticklabels(labels, color='white', fontsize=9)
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_title('Key Cooking Temperatures', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.axvline(100, color='white', linestyle='--', alpha=0.3)
ax1.text(102, 0, '← Water ceiling', color='gray', fontsize=8)
ax1.invert_yaxis()

# Water phase diagram (simplified)
ax2.set_facecolor('#111827')
pressure = np.logspace(-3, 2, 200)  # atm

# Boiling curve (Clausius-Clapeyron approximation)
T_boil = 100 + 30 * np.log(pressure)  # simplified

# Melting curve (nearly vertical for water)
T_melt = 0 - 0.01 * (pressure - 1)  # water is unusual: melting point drops with pressure

ax2.plot(T_boil, pressure, color='#ef4444', linewidth=2, label='Boiling curve')
ax2.plot(T_melt, pressure, color='#3b82f6', linewidth=2, label='Melting curve')

# Mark cooking scenarios
cooking = [
    (100, 1, 'Normal boiling'),
    (121, 2, 'Pressure cooker'),
    (70, 0.3, 'Vacuum cooking\n(sous vide)'),
]
for temp, p, name in cooking:
    ax2.plot(temp, p, 'o', color='#f59e0b', markersize=10)
    ax2.annotate(name, (temp, p), xytext=(10, 5), textcoords='offset points',
                 color='#f59e0b', fontsize=9)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Pressure (atm)', color='white')
ax2.set_title('Water Phase Diagram (Cooking Applications)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.set_yscale('log')
ax2.set_xlim(-50, 200)
ax2.tick_params(colors='gray')

# Label regions
ax2.text(50, 0.1, 'ICE', color='#60a5fa', fontsize=12, fontweight='bold', alpha=0.5)
ax2.text(50, 3, 'LIQUID\nWATER', color='#3b82f6', fontsize=12, fontweight='bold', alpha=0.5)
ax2.text(150, 0.3, 'STEAM', color='#ef4444', fontsize=12, fontweight='bold', alpha=0.5)

plt.tight_layout()
plt.show()

print("The 100°C ceiling in cooking:")
print("  Wet cooking (boiling, steaming, braising): max 100°C")
print("  Pressure cooking: ~121°C (2 atm)")
print("  Dry cooking (frying, roasting): 150-300°C")
print("  The crust forms when surface water evaporates,")
print("  allowing temperature to exceed 100°C → browning reactions")`,
      challenge: 'At high altitude (e.g., 3000m in Arunachal Pradesh), atmospheric pressure drops to ~0.7 atm. What is the boiling point of water there? How does this affect cooking times for rice and dal?',
      successHint: 'Every cooking technique is a controlled state change. The cook who understands phase transitions has a scientific framework for the entire kitchen — from freezing ice cream to charring tandoori chicken.',
    },
    {
      title: 'Boiling and melting points — why different foods cook differently',
      concept: `Different substances change state at different temperatures because of the strength of their **intermolecular bonds**:

**Water (H2O)**: boils at 100°C. Hydrogen bonds between molecules are moderately strong.

**Cooking oils**: smoke point 180-250°C. Longer carbon chains have stronger van der Waals forces → higher boiling points. This is why oil can get much hotter than water.

**Sugar (sucrose)**: melts at 186°C, then decomposes (caramelisation). The large molecule has many hydrogen bonds.

**Salt (NaCl)**: melts at 801°C. Ionic bonds are extremely strong. Salt dissolves in water but doesn't melt in any kitchen.

**Butter**: melts at 32-35°C (just below body temperature, which is why it "melts in your mouth"). It's a mixture of fats with different melting points.

**Chocolate**: melts at 34°C (cocoa butter crystals). Tempering chocolate means controlling which crystal form dominates — different crystal forms melt at different temperatures.

**Why boiling point elevation matters in cooking:**
- Adding salt to water raises the boiling point by ~0.5°C per tablespoon of salt per litre — barely enough to matter for cooking speed, but it does change seasoning
- Sugar solutions boil at higher temperatures: candy making uses this (soft ball at 112°C, hard crack at 154°C)`,
      analogy: 'Different melting points are like different strength magnets holding objects to a metal wall. Weak magnets (butter) release at a gentle pull (32°C). Moderate magnets (water) need a firm pull (100°C). Powerful magnets (salt) need extreme force (801°C). The "pull" is thermal energy — heating provides the force to break molecular bonds.',
      storyConnection: 'The little chef knows that ghee (clarified butter) can handle higher heat than plain butter because removing the milk solids raises the smoke point from 175°C to 250°C. This traditional knowledge is pure food chemistry: the milk proteins burn at lower temperatures than the fat molecules.',
      checkQuestion: 'Why does oil splatter violently when water drops into hot oil?',
      checkAnswer: 'Water boils at 100°C but the oil is at 180°C+. When a water drop enters hot oil, it instantly converts to steam, expanding ~1,700 times in volume. This explosive expansion throws oil droplets into the air. It is essentially a tiny steam explosion. This is why you never add water to a grease fire — it would create a massive steam explosion, spreading burning oil everywhere.',
      codeIntro: 'Compare boiling points, melting points, and smoke points of common cooking substances.',
      code: `import numpy as np
import matplotlib.pyplot as plt

substances = [
    ('Water', 0, 100, None, '#3b82f6'),
    ('Butter', 32, 175, 175, '#f59e0b'),
    ('Ghee', 32, 250, 250, '#fbbf24'),
    ('Olive oil', -6, 191, 191, '#22c55e'),
    ('Coconut oil', 24, 177, 177, '#10b981'),
    ('Sugar', 186, 186, None, '#a855f7'),
    ('Salt', 801, 1413, None, '#ef4444'),
    ('Chocolate', 34, None, None, '#92400e'),
]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Melting and boiling points
ax1.set_facecolor('#111827')
names = [s[0] for s in substances]
melting = [s[1] for s in substances]
boiling = [s[2] if s[2] else 0 for s in substances]
smoke = [s[3] if s[3] else 0 for s in substances]
colors = [s[4] for s in substances]

y_pos = range(len(substances))
ax1.barh(y_pos, melting, height=0.3, color=colors, alpha=0.5, label='Melting point')
for i, (name, mp, bp, sp, color) in enumerate(substances):
    ax1.plot(mp, i, 'o', color=color, markersize=8)
    if bp:
        ax1.plot(bp, i, 's', color=color, markersize=8)
        ax1.plot([mp, bp], [i, i], color=color, linewidth=2, alpha=0.5)
    ax1.text(-30, i, name, ha='right', va='center', color=color, fontsize=10)

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_title('Melting Points (circles) and Boiling/Smoke Points (squares)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_yticks([])
ax1.axvline(100, color='white', linestyle=':', alpha=0.2)
ax1.axvline(180, color='#f59e0b', linestyle=':', alpha=0.2)
ax1.text(100, -0.5, 'Water boils', color='gray', fontsize=8, ha='center')
ax1.text(180, -0.5, 'Frying temp', color='#f59e0b', fontsize=8, ha='center')

# Sugar candy stages
ax2.set_facecolor('#111827')
candy_stages = [
    ('Thread', 110, 112, '#fef3c7'),
    ('Soft ball', 112, 116, '#fde68a'),
    ('Firm ball', 118, 120, '#fcd34d'),
    ('Hard ball', 121, 130, '#fbbf24'),
    ('Soft crack', 132, 143, '#f59e0b'),
    ('Hard crack', 146, 154, '#f97316'),
    ('Caramel', 160, 177, '#ea580c'),
    ('Burnt', 177, 200, '#7f1d1d'),
]

for i, (name, t_low, t_high, color) in enumerate(candy_stages):
    ax2.barh(i, t_high - t_low, left=t_low, height=0.6, color=color, alpha=0.8)
    ax2.text(t_low - 2, i, name, ha='right', va='center', color='white', fontsize=9)
    ax2.text((t_low + t_high)/2, i, f'{t_low}-{t_high}°C', ha='center', va='center',
             color='black' if color in ['#fef3c7', '#fde68a', '#fcd34d'] else 'white', fontsize=8)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_title('Sugar Candy Stages (boiling point elevation)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_yticks([])
ax2.set_xlim(100, 210)
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print("Why candy stages exist:")
print("  As sugar solution boils, water evaporates")
print("  → sugar concentration increases")
print("  → boiling point rises")
print("  → less water remains when cooled = harder candy")
print()
print("  Thread (110°C): ~80% sugar → syrupy")
print("  Hard ball (125°C): ~92% sugar → toffee")
print("  Hard crack (150°C): ~99% sugar → lollipop")
print("  Caramel (160°C): sugar molecules break apart (pyrolysis)")`,
      challenge: 'Plot the boiling point of a sugar solution as a function of sugar concentration (0-100%). The relationship is: T_boil = 100 + 0.52 * C/(100-C) where C is percentage sugar. Verify this matches the candy stages.',
      successHint: 'Boiling points and melting points are determined by molecular bonds. Understanding these temperatures gives you precise control over every cooking process — from tempering chocolate to making caramel.',
    },
    {
      title: 'Acids and bases in food — the pH of flavour',
      concept: `Every food has a **pH** — a measure of how acidic or basic (alkaline) it is. pH profoundly affects flavour, texture, colour, and safety.

**The pH scale:** 0 (extremely acidic) to 14 (extremely basic). 7 is neutral.

**Acidic foods (pH < 7):**
- Lemon juice: pH 2.0 (citric acid)
- Vinegar: pH 2.4 (acetic acid)
- Tomato: pH 4.0
- Coffee: pH 5.0
- Most fruits: pH 3-5

**Neutral foods (pH ~7):**
- Pure water: pH 7.0
- Milk: pH 6.5-6.8
- Rice: pH 6.0-6.7

**Basic/alkaline foods (pH > 7):**
- Egg white: pH 9.0
- Baking soda solution: pH 8.5
- Khar (Assamese alkali from banana peel ash): pH ~10

**pH in cooking:**
- Acid tenderises meat (marinades with lemon, vinegar, yogurt)
- Acid prevents browning (lemon juice on cut apples)
- Alkali softens vegetables (baking soda in cooking water makes beans softer)
- pH determines colour: red cabbage is red in acid, blue in neutral, green in alkali
- pH < 4.6 inhibits Clostridium botulinum (food safety threshold for canning)`,
      analogy: 'pH is like a volume knob for sourness. All the way left (pH 0): battery acid, dangerously sour. Middle position (pH 7): neutral water, no taste. All the way right (pH 14): drain cleaner, dangerously bitter/soapy. Cooking lives in the range pH 2-10, with most foods in the mildly acidic zone (pH 3-6).',
      storyConnection: 'The little chef uses khar — an alkaline solution made from sun-dried banana peel ash, a signature ingredient of Assamese cuisine. Khar has a pH around 10 and transforms vegetables: it softens cell walls (alkali breaks down pectin), changes colour (greens become brighter), and adds a distinctive flavour. It is chemistry passed down through generations.',
      checkQuestion: 'Ceviche "cooks" raw fish by soaking it in lime juice. Is this real cooking?',
      checkAnswer: 'Yes and no. The acid (pH ~2) denatures the fish proteins — unfolding them and changing the texture from translucent to opaque, just like heat does. But acid denaturation doesn\'t kill bacteria the way heat does. The fish looks and feels "cooked" but may still contain parasites. This is why sushi-grade fish (previously frozen to kill parasites) is recommended for ceviche.',
      codeIntro: 'Map the pH of common foods and demonstrate how pH affects chemical reactions in cooking.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# pH scale with foods
foods = [
    ('Lemon juice', 2.0, '#fbbf24'),
    ('Vinegar', 2.4, '#f59e0b'),
    ('Assam tea (black)', 3.5, '#92400e'),
    ('Tomato', 4.0, '#ef4444'),
    ('Coffee', 5.0, '#7c2d12'),
    ('Rice', 6.3, '#fefce8'),
    ('Milk', 6.7, '#f5f5f4'),
    ('Pure water', 7.0, '#60a5fa'),
    ('Egg white', 9.0, '#fef9c3'),
    ('Khar (banana ash)', 10.0, '#a3e635'),
    ('Baking soda', 8.5, '#f5f5f4'),
]

ax1.set_facecolor('#111827')

# pH gradient background
for pH in np.arange(0, 14, 0.1):
    if pH < 7:
        color_val = plt.cm.RdYlGn(pH / 14)
    else:
        color_val = plt.cm.RdYlGn(pH / 14)
    ax1.axhspan(pH, pH + 0.1, alpha=0.1, color=color_val)

for name, pH, color in foods:
    ax1.plot(0.5, pH, 'o', color=color, markersize=12, zorder=5)
    ax1.text(0.7, pH, f'{name} (pH {pH})', va='center', color='white', fontsize=10)

ax1.set_ylim(0, 14)
ax1.set_xlim(0, 3)
ax1.set_ylabel('pH', color='white', fontsize=12)
ax1.set_title('pH of Common Foods', color='white', fontsize=13)
ax1.axhline(7, color='white', linestyle='--', alpha=0.3)
ax1.axhline(4.6, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(2.5, 7.2, 'Neutral', color='white', fontsize=9, ha='center')
ax1.text(2.5, 4.3, 'Safety threshold\n(botulism)', color='#ef4444', fontsize=8, ha='center')
ax1.text(2.5, 2, 'ACIDIC', color='#ef4444', fontsize=11, ha='center', alpha=0.5)
ax1.text(2.5, 11, 'ALKALINE', color='#3b82f6', fontsize=11, ha='center', alpha=0.5)
ax1.set_xticks([])
ax1.tick_params(colors='gray')

# Red cabbage colour change (natural pH indicator)
ax2.set_facecolor('#111827')
pH_range = np.linspace(1, 13, 200)

# Simulate anthocyanin colour at different pH
# Red (pH<3) → purple (pH 5-6) → blue (pH 7-8) → green (pH 9-11) → yellow (pH>12)
r_channel = np.where(pH_range < 4, 0.8, np.where(pH_range < 7, 0.5 * (7-pH_range)/3, 0.1))
g_channel = np.where(pH_range < 7, 0.1, np.where(pH_range < 11, 0.3 + 0.5*(pH_range-7)/4, 0.7))
b_channel = np.where(pH_range < 4, 0.2, np.where(pH_range < 9, 0.3 + 0.5*(pH_range-4)/5, 0.2))

for i in range(len(pH_range)-1):
    ax2.axvspan(pH_range[i], pH_range[i+1], color=(r_channel[i], g_channel[i], b_channel[i]), alpha=0.8)

# Mark food additions
additions = [
    (2.5, 'Add lemon\njuice', '#fbbf24'),
    (5.5, 'Natural\ncabbage', '#a855f7'),
    (8.5, 'Add baking\nsoda', '#3b82f6'),
    (10, 'Add khar', '#22c55e'),
]
for pH, label, color in additions:
    ax2.axvline(pH, color=color, linestyle='--', linewidth=2, alpha=0.7)
    ax2.text(pH, 0.9, label, ha='center', color=color, fontsize=9,
             transform=ax2.get_xaxis_transform())

ax2.set_xlabel('pH', color='white')
ax2.set_title('Red Cabbage: Natural pH Indicator', color='white', fontsize=12)
ax2.set_yticks([])
ax2.tick_params(colors='gray')
ax2.set_xlim(1, 13)

plt.tight_layout()
plt.show()

print("pH in Assamese cooking:")
print("  Khar (pH ~10): softens vegetables, adds unique flavour")
print("  Ou tenga / lemon (pH ~2): souring agent for fish curry")
print("  Fermented bamboo shoot (pH ~4): preserved by acidity")
print("  Yogurt (pH ~4.5): tenderises meat in marinades")
print()
print("The pH 4.6 rule: below this, botulism bacteria cannot grow.")
print("This is why pickles, jams, and fermented foods are safe at room temp.")`,
      challenge: 'Design a pH indicator experiment using red cabbage juice. Add lemon, baking soda, khar, milk, and tea to separate cups of cabbage water. Predict the colour of each before running the simulation.',
      successHint: 'pH is the hidden variable in every recipe. Understanding acid-base chemistry explains why marinades work, why cakes rise, why chutneys keep, and why the little chef\'s khar dishes have that distinctive Assamese character.',
    },
    {
      title: 'Emulsions — mayonnaise, dosa batter, and the science of mixing',
      concept: `Oil and water don't mix — unless you make an **emulsion**. An emulsion is a stable mixture of two immiscible liquids, held together by an **emulsifier**.

**Types of emulsions:**
- **Oil-in-water (O/W)**: oil droplets suspended in water. Examples: milk, mayonnaise, salad dressing
- **Water-in-oil (W/O)**: water droplets suspended in oil. Examples: butter, margarine, chocolate

**How emulsifiers work:**
Emulsifier molecules have two ends:
- **Hydrophilic head**: loves water (polar)
- **Hydrophobic tail**: loves oil (nonpolar)
They sit at the oil-water interface, with one end in each liquid, preventing the droplets from merging.

**Kitchen emulsifiers:**
- **Egg yolk lecithin**: mayonnaise, hollandaise, cakes
- **Casein (milk protein)**: cream, cheese sauces
- **Mustard**: contains emulsifying compounds
- **Fermentation products**: dosa batter — lactic acid bacteria produce compounds that stabilise the batter's airy structure

**Dosa batter science:**
The fermented rice-urad dal batter is a complex emulsion-foam hybrid. Fermentation produces CO2 (bubbles), lactic acid (sour flavour), and bacterial polysaccharides (emulsifiers). The urad dal protein acts as a surfactant, stabilising air bubbles. This is why dosa batter must ferment — unfermented batter makes flat, dense crepes instead of crispy dosas.`,
      analogy: 'An emulsifier is like a bilingual translator at a dinner party where half the guests speak French (water) and half speak Japanese (oil). Without the translator, the two groups ignore each other (separate). The translator has one ear in each conversation, keeping everyone connected. Remove the translator, and the groups split apart again (emulsion breaks).',
      storyConnection: 'The little chef makes perfect dosa every time. The secret is properly fermented batter — where bacteria have done the chemistry of creating natural emulsifiers. Too little fermentation: flat dosa. Too much: sour and collapsed. The chef judges readiness by sight, smell, and texture — reading the chemistry without knowing the chemistry.',
      checkQuestion: 'Why does mayonnaise "break" (separate into oil and watery liquid) if you add oil too fast?',
      checkAnswer: 'Mayonnaise is an oil-in-water emulsion. When making it, you must add oil SLOWLY so each drop gets coated with lecithin from the egg yolk before the next drop arrives. If you add oil too fast, there isn\'t enough time for the emulsifier to coat all the new droplets. Uncoated droplets merge (coalescence), and the emulsion collapses back into separate oil and water layers.',
      codeIntro: 'Simulate emulsion formation: oil droplet size distribution under different mixing speeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Simulate oil droplet formation during emulsification
def simulate_emulsion(n_droplets, mixing_energy, emulsifier_conc):
    """Simulate droplet size distribution"""
    # Higher mixing energy → smaller droplets
    mean_size = 100 / (mixing_energy + 1)  # micrometres
    # Higher emulsifier → more stable (narrower distribution)
    std_size = mean_size * (1 / (emulsifier_conc + 0.5))
    sizes = np.random.lognormal(np.log(mean_size), np.log(1 + std_size/mean_size), n_droplets)
    return np.clip(sizes, 0.1, 500)

# Scenario 1: Gentle mixing, no emulsifier (unstable)
ax = axes[0, 0]
ax.set_facecolor('#111827')
sizes = simulate_emulsion(1000, 1, 0.1)
ax.hist(sizes, bins=50, color='#ef4444', alpha=0.7, edgecolor='none')
ax.set_title(f'Gentle mixing, little emulsifier\nMean: {np.mean(sizes):.0f}μm (UNSTABLE)', color='#ef4444', fontsize=10)
ax.set_xlabel('Droplet size (μm)', color='white', fontsize=8)
ax.tick_params(colors='gray')

# Scenario 2: Vigorous mixing, no emulsifier
ax = axes[0, 1]
ax.set_facecolor('#111827')
sizes = simulate_emulsion(1000, 10, 0.1)
ax.hist(sizes, bins=50, color='#f59e0b', alpha=0.7, edgecolor='none')
ax.set_title(f'Vigorous mixing, little emulsifier\nMean: {np.mean(sizes):.0f}μm (unstable)', color='#f59e0b', fontsize=10)
ax.set_xlabel('Droplet size (μm)', color='white', fontsize=8)
ax.tick_params(colors='gray')

# Scenario 3: Gentle mixing, with emulsifier (egg yolk)
ax = axes[1, 0]
ax.set_facecolor('#111827')
sizes = simulate_emulsion(1000, 1, 2)
ax.hist(sizes, bins=50, color='#3b82f6', alpha=0.7, edgecolor='none')
ax.set_title(f'Gentle mixing + egg yolk\nMean: {np.mean(sizes):.0f}μm (moderate)', color='#3b82f6', fontsize=10)
ax.set_xlabel('Droplet size (μm)', color='white', fontsize=8)
ax.tick_params(colors='gray')

# Scenario 4: Vigorous mixing + emulsifier (mayonnaise)
ax = axes[1, 1]
ax.set_facecolor('#111827')
sizes = simulate_emulsion(1000, 10, 2)
ax.hist(sizes, bins=50, color='#22c55e', alpha=0.7, edgecolor='none')
ax.set_title(f'Vigorous mixing + egg yolk\nMean: {np.mean(sizes):.0f}μm (STABLE mayo!)', color='#22c55e', fontsize=10)
ax.set_xlabel('Droplet size (μm)', color='white', fontsize=8)
ax.tick_params(colors='gray')

plt.suptitle('Emulsion Droplet Size: Effect of Mixing and Emulsifier', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print("Emulsion stability rules:")
print("  Smaller droplets = more stable (less buoyancy, more surface area)")
print("  More emulsifier = more stable (better coating)")
print("  Vigorous mixing = smaller droplets")
print()
print("Perfect mayonnaise: small uniform droplets (~1-10μm)")
print("  = vigorous whisking + plenty of egg yolk lecithin")
print()
print("Dosa batter: fermentation produces natural emulsifiers")
print("  that stabilise the gas bubbles from CO2 production")
print("  → crispy, airy texture instead of flat, dense crepe")`,
      challenge: 'Simulate what happens when an emulsion "breaks": start with small uniform droplets, then allow them to merge over time (coalescence). Plot the droplet size distribution at different time points. This is why old mayonnaise separates.',
      successHint: 'Emulsions are everywhere in cooking: milk, butter, cream sauces, salad dressings, ice cream, dosa batter. Understanding the science lets you rescue a broken sauce, make stable vinaigrettes, and appreciate why fermented batters work.',
    },
    {
      title: 'Yeast and CO2 — the biochemistry of bread and fermentation',
      concept: `Yeast (Saccharomyces cerevisiae) is a single-celled fungus that has been humanity's partner for 10,000+ years. It converts sugar into CO2 and alcohol through **fermentation**:

**C6H12O6 → 2 C2H5OH + 2 CO2**
(glucose → ethanol + carbon dioxide)

**In bread:** CO2 gets trapped in gluten (protein network), creating bubbles that expand the dough. Alcohol evaporates during baking. The gluten network sets in the oven heat, creating the bread's structure.

**In dosa/idli:** lactic acid bacteria AND wild yeast ferment the batter. CO2 creates the airy texture. Lactic acid provides the sour flavour and acts as a preservative. No gluten needed — urad dal proteins form the structural network.

**Fermentation rate depends on:**
- **Temperature**: yeast is most active at 25-35°C. Below 10°C: dormant. Above 45°C: dead.
- **Sugar**: more sugar → more CO2 (up to a point — too much sugar inhibits yeast through osmotic stress)
- **pH**: yeast prefers pH 4-5 (slightly acidic)
- **Time**: longer fermentation = more flavour compounds (slow fermentation produces better bread)

**Yeast also produces:**
- Flavour compounds (esters, aldehydes) — the smell of fresh bread
- B vitamins (yeast is nutritious)
- Glutathione (an antioxidant)`,
      analogy: 'Yeast cells are like tiny factories. They eat sugar (fuel), produce CO2 (exhaust) and alcohol (waste product). The factory runs faster when warm (25-35°C) and shuts down when cold (below 10°C) or overheated (above 45°C). Each factory is microscopic, but trillions of them working together can inflate a loaf of bread.',
      storyConnection: 'The little chef\'s grandmother taught him to set dosa batter "where the afternoon sun warms the floor." This is intuitive temperature control: Assam\'s afternoon warmth (28-33°C) is perfect for fermentation. Too hot (direct sun) kills the yeast. Too cold (overnight in winter) slows it. The ideal spot is empirical knowledge matching scientific optima.',
      checkQuestion: 'Sourdough bread uses wild yeast (from the air and flour) instead of commercial yeast. Why does sourdough have more complex flavour?',
      checkAnswer: 'Wild yeast (Kazachstania, Candida species) ferments more slowly and produces different flavour compounds than commercial Saccharomyces. Additionally, sourdough contains lactobacillus bacteria that produce lactic and acetic acids, adding sourness and depth. The slow fermentation (12-24 hours vs. 1-2 hours for commercial yeast) allows more time for flavour compounds to develop. Speed and diversity of microorganisms are the keys.',
      codeIntro: 'Model yeast fermentation rate as a function of temperature and sugar concentration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Fermentation rate vs temperature
temp = np.linspace(0, 55, 200)
# Bell-shaped curve: peak at 32°C
rate_temp = np.exp(-((temp - 32)**2) / (2 * 8**2))
# Drop to zero above 45°C (yeast death)
rate_temp *= np.where(temp > 45, np.exp(-2 * (temp - 45)), 1)
rate_temp *= np.where(temp < 5, temp / 5, 1)

ax1.set_facecolor('#111827')
ax1.plot(temp, rate_temp, color='#f59e0b', linewidth=2)
ax1.fill_between(temp, rate_temp, alpha=0.15, color='#f59e0b')

# Mark key temperatures
markers = [
    (4, 'Fridge\n(dormant)', '#3b82f6'),
    (22, 'Room temp\n(slow rise)', '#22c55e'),
    (32, 'Optimal\n(fast rise)', '#f59e0b'),
    (45, 'Death\nzone', '#ef4444'),
]
for t_mark, label, color in markers:
    idx = np.argmin(np.abs(temp - t_mark))
    ax1.plot(t_mark, rate_temp[idx], 'o', color=color, markersize=10)
    ax1.annotate(label, (t_mark, rate_temp[idx]),
                 xytext=(0, 15), textcoords='offset points', ha='center',
                 color=color, fontsize=9)

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Relative fermentation rate', color='white')
ax1.set_title('Yeast Activity vs Temperature', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# CO2 production over time at different temperatures
ax2.set_facecolor('#111827')
hours = np.linspace(0, 12, 200)

temps_sim = [10, 22, 32, 40]
temp_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for t_sim, color in zip(temps_sim, temp_colors):
    rate = np.exp(-((t_sim - 32)**2) / (2 * 8**2))
    if t_sim > 45:
        rate = 0
    # CO2 accumulation: logistic curve (sugar runs out)
    max_co2 = 100  # arbitrary units
    co2 = max_co2 * (1 - np.exp(-rate * 0.5 * hours))
    ax2.plot(hours, co2, color=color, linewidth=2, label=f'{t_sim}°C')

# Dosa readiness threshold
ax2.axhline(60, color='white', linestyle='--', alpha=0.3)
ax2.text(11, 62, 'Dosa-ready', color='white', fontsize=9, ha='right')

ax2.set_xlabel('Hours of fermentation', color='white')
ax2.set_ylabel('CO₂ produced (a.u.)', color='white')
ax2.set_title('CO₂ Production: Dosa Batter Fermentation', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fermentation in Assamese cooking:")
print("  Dosa batter (32°C): ready in 8-12 hours")
print("  Dosa batter (22°C): ready in 16-24 hours")
print("  Dosa batter (10°C): barely ferments (fridge = pause button)")
print()
print("The 'afternoon sun spot' trick:")
print("  Assam afternoon temperature: ~28-33°C")
print("  This is the optimal range for yeast!")
print("  Traditional knowledge = applied microbiology")`,
      challenge: 'Model what happens if you add too much sugar (osmotic stress). Above ~20% sugar concentration, water leaves the yeast cells through osmosis, slowing fermentation. This is why very sweet doughs rise slowly.',
      successHint: 'Fermentation is humanity\'s oldest biotechnology. From bread to beer to dosa to kombucha, we have been partnering with yeast and bacteria for millennia. The little chef\'s knowledge is continuous with 10,000 years of human biochemical engineering.',
    },
    {
      title: 'Flavour chemistry — why food tastes the way it does',
      concept: `Flavour is not just taste. It is a combination of **five senses**: taste (tongue), smell (nose), touch (mouthfeel), temperature, and even sound (crunch). Flavour chemistry studies the molecules responsible.

**The five basic tastes:**
- **Sweet**: sugars, some amino acids, some proteins → energy detection
- **Sour**: acids (H+ ions) → spoilage warning
- **Salty**: sodium chloride and similar → mineral detection
- **Bitter**: alkaloids, tannins → toxin warning
- **Umami**: glutamate, nucleotides → protein detection

**Smell (aroma) — the dominant component of flavour:**
- Humans can distinguish ~10,000 different odours
- Aroma compounds are volatile (evaporate easily, reach the nose)
- Coffee has ~1,000 identified aroma compounds
- Fresh bread: ~540 aroma compounds
- A single food can contain hundreds of volatiles

**The Maillard reaction (browning):**
The most important flavour reaction in cooking: amino acids + sugars + heat → thousands of complex flavour and colour compounds. Occurs above ~140°C. Responsible for:
- Bread crust colour and flavour
- Seared meat aroma
- Roasted coffee
- Toasted spices
- Caramelised onions (partially Maillard, partially caramelisation)

Without the Maillard reaction, food would be bland and pale.`,
      analogy: 'Flavour perception is like a movie. Taste is the dialogue (5 channels). Aroma is the visuals (10,000 channels). Mouthfeel is the soundtrack (texture). Temperature is the lighting. All channels combine in the brain to create the "movie" of flavour. Block one channel (hold your nose — no aroma) and the movie becomes a silent film.',
      storyConnection: 'The little chef of Jorhat is known for his spice mastery. When he tempers spices in hot oil (tadka), he is performing Maillard reactions and releasing volatile aroma compounds simultaneously. The sizzle of cumin in oil at 180°C triggers hundreds of chemical reactions in seconds, transforming raw spice molecules into complex flavour compounds.',
      checkQuestion: 'Why does food taste bland when you have a cold?',
      checkAnswer: 'A cold blocks your nasal passages, preventing aroma compounds from reaching your olfactory receptors. Since ~80% of flavour perception comes from smell (retronasal olfaction — aromas traveling from mouth to nose while chewing), blocking the nose eliminates most of the flavour information. The five basic tastes (sweet, sour, salty, bitter, umami) still work, but without the aroma, food is one-dimensional.',
      codeIntro: 'Map the flavour compounds in common Assamese ingredients and show how cooking transforms them.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Flavour profile radar chart for Assamese spices
categories = ['Sweet', 'Sour', 'Bitter', 'Umami', 'Pungent', 'Aromatic']
N = len(categories)

spices = {
    'Black mustard seed': [1, 1, 3, 2, 8, 5],
    'Panch phoran': [2, 0, 2, 1, 5, 8],
    'Bhut jolokia': [1, 0, 1, 1, 10, 3],
    'Khar': [0, 0, 3, 4, 1, 2],
    'Ou tenga (elephant apple)': [2, 9, 2, 1, 0, 3],
}
spice_colors = {
    'Black mustard seed': '#f59e0b',
    'Panch phoran': '#22c55e',
    'Bhut jolokia': '#ef4444',
    'Khar': '#a855f7',
    'Ou tenga (elephant apple)': '#3b82f6',
}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

ax1 = plt.subplot(121, polar=True)
ax1.set_facecolor('#111827')
fig.patch.set_facecolor('#1f2937')

for name, values in spices.items():
    values_plot = values + values[:1]
    ax1.plot(angles, values_plot, 'o-', linewidth=2, label=name, color=spice_colors[name])
    ax1.fill(angles, values_plot, alpha=0.05, color=spice_colors[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=9)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 5, 8])
ax1.set_yticklabels(['2', '5', '8'], color='gray', fontsize=7)
ax1.set_title('Assamese Spice Flavour Profiles', color='white', fontsize=12, pad=20)
ax1.legend(loc='upper left', bbox_to_anchor=(-0.3, 1.15), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=7)

# Maillard reaction: compounds produced vs temperature
ax2 = plt.subplot(122)
ax2.set_facecolor('#111827')

temp = np.linspace(100, 250, 200)

# Different compound classes produced at different temperatures
compounds = {
    'Furanones (caramel)': {'onset': 140, 'peak': 170, 'color': '#f59e0b'},
    'Pyrazines (roasty)': {'onset': 150, 'peak': 180, 'color': '#ef4444'},
    'Thiazoles (meaty)': {'onset': 130, 'peak': 160, 'color': '#22c55e'},
    'Melanoidins (colour)': {'onset': 140, 'peak': 200, 'color': '#a855f7'},
    'Acrylamide (toxic)': {'onset': 170, 'peak': 220, 'color': '#6b7280'},
}

for name, props in compounds.items():
    onset = props['onset']
    peak = props['peak']
    color = props['color']
    amount = np.where(temp < onset, 0,
                       np.exp(-((temp - peak)**2) / (2 * 20**2)) * (1 - np.exp(-0.1 * (temp - onset))))
    amount = np.clip(amount, 0, 1)
    ax2.plot(temp, amount, color=color, linewidth=2, label=name)
    ax2.fill_between(temp, amount, alpha=0.1, color=color)

ax2.axvline(154, color='white', linestyle=':', alpha=0.3)
ax2.text(156, 0.95, 'Maillard\nonset', color='white', fontsize=8)
ax2.axvline(200, color='#ef4444', linestyle=':', alpha=0.3)
ax2.text(202, 0.95, 'Burning\nrisk', color='#ef4444', fontsize=8)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Relative amount produced', color='white')
ax2.set_title('Maillard Reaction Products vs Temperature', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Flavour chemistry in the kitchen:")
print("  140-160°C: golden brown, sweet-caramel notes")
print("  160-180°C: deep brown, roasty-nutty compounds")
print("  180-200°C: dark brown, complex savoury flavours")
print("  >200°C: charring, bitter compounds, potential toxins")
print()
print("The Maillard reaction is why searing, roasting, and frying")
print("produce flavours that boiling never can.")
print("Water keeps temperature at 100°C — too low for Maillard.")
print("This is the fundamental difference between wet and dry cooking.")`,
      challenge: 'Create a flavour profile for a complete Assamese dish (e.g., fish tenga with ou tenga). Map how each ingredient contributes to the five tastes and aroma. How do the ingredients complement each other?',
      successHint: 'From states of matter to pH to emulsions to fermentation to flavour chemistry, you now have a scientific framework for the entire kitchen. The little chef of Jorhat works intuitively; now you understand the science behind every step. Level 2 takes you into molecular gastronomy — where science and cooking merge into a new art.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Food Chemistry & Cooking Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for food science simulations. Click to start.</p>
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
