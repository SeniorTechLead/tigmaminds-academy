import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import HanumanTectonicDiagram from '../diagrams/HanumanTectonicDiagram';
import HanumanAltitudeZonesDiagram from '../diagrams/HanumanAltitudeZonesDiagram';
import EarthLayersDiagram from '../diagrams/EarthLayersDiagram';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';
import HanumanDichotomousKeyDiagram from '../diagrams/HanumanDichotomousKeyDiagram';

export default function HanumanMountainLevel1() {
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
      title: 'How mountains are born — tectonic plates in Python',
      concept: `Hanuman flew to the Himalayas to find the Sanjeevani herb. But why are the Himalayas there at all? The answer lies beneath your feet.

The Earth's outer shell is not one solid piece — it is cracked into about 15 giant slabs called **tectonic plates**. These plates float on a layer of hot, semi-fluid rock called the **mantle**, and they move very slowly — a few centimetres per year.

About 50 million years ago, the **Indian Plate** collided with the **Eurasian Plate**. Neither plate could sink easily, so the rock crumpled upward like a rug pushed against a wall. That crumpled rock became the **Himalayas** — and the collision is still happening. The Himalayas grow about 1 cm taller every year.

The code below models how plate speed and time produce mountain height. Variables store the numbers; multiplication gives the result.`,
      analogy: 'Place two books flat on a table and push them toward each other. The edges crumple and rise upward. That is exactly what happened when India crashed into Asia — except the "books" are continental plates thousands of kilometres across, and the "crumple" is the tallest mountain range on Earth.',
      storyConnection: 'Hanuman flew north to the Himalayas — the tallest mountains on Earth. They exist because two tectonic plates have been colliding for 50 million years. The mountain Hanuman lifted was born from this collision, pushed up grain by grain over geological time.',
      checkQuestion: 'If the Indian Plate moves at 5 cm/year and has been colliding for 50 million years, how far has India traveled?',
      checkAnswer: '5 cm/year x 50,000,000 years = 250,000,000 cm = 2,500 km. That is roughly the distance from Sri Lanka to the current collision zone. India was once an island near Madagascar and drifted north across an ancient ocean.',
      codeIntro: 'Model tectonic plate collision and mountain growth over millions of years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Plate movement rate
plate_speed_cm_yr = 5.0  # Indian Plate speed
collision_start_mya = 50  # million years ago

# Mountain growth (simplified model)
years = np.linspace(0, collision_start_mya, 200)
# Height grows as sqrt of time (rapid at first, slowing)
height_m = 300 * np.sqrt(years)

fig, ax = plt.subplots(figsize=(8, 5))
ax.fill_between(years, 0, height_m, alpha=0.3, color='sienna')
ax.plot(years, height_m, color='sienna', linewidth=2)

# Mark Everest height
ax.axhline(y=8849, color='cyan', linestyle='--', alpha=0.7)
ax.text(25, 9000, 'Mt Everest: 8,849 m', color='cyan',
        fontsize=10, ha='center')

ax.set_xlabel('Millions of years since collision')
ax.set_ylabel('Approximate mountain height (m)')
ax.set_title('Himalayan Growth Over Geological Time')
ax.grid(alpha=0.2)
plt.show()

print(f"Plate speed: {plate_speed_cm_yr} cm/year")
print(f"Distance traveled: {plate_speed_cm_yr * collision_start_mya * 1e6 / 1e5:.0f} km")
print(f"The Himalayas are STILL growing ~1 cm/year.")`,
      challenge: 'Add a second line showing the Alps (formed ~35 million years ago, max height 4,808 m). How does the growth curve compare?',
      successHint: 'You just modelled geological time with simple math. Variables and numpy let you simulate processes that take millions of years in a fraction of a second.',
    },
    {
      title: 'Temperature and altitude — the lapse rate',
      concept: `As Hanuman flew higher into the Himalayas, the air got colder. This is not a coincidence — it is physics.

The atmosphere cools at a predictable rate called the **lapse rate**: approximately **6.5°C for every 1,000 metres** of altitude gain. At sea level, the temperature might be 30°C. At 3,000 m, it is about 10.5°C. At 5,000 m, it is below freezing.

Why? Higher altitude means lower air pressure, because there is less atmosphere above you pressing down. When air pressure drops, air expands. When air expands, it cools. This is called **adiabatic cooling** — the air loses heat not because something cold touched it, but because it expanded.

This temperature gradient is why the Himalayas have distinct vegetation zones — tropical forest at the base, ice and snow at the top.`,
      analogy: 'Think of a bicycle pump. When you pump air in, the pump gets warm (compression heats air). Now imagine the reverse: when air rises and the pressure drops, the air expands and cools down. Mountains force air upward, so mountains are cold at the top.',
      storyConnection: 'The Sanjeevani herb grows only at high altitude, where temperatures are freezing, UV radiation is intense, and the air is thin. These extreme conditions are why the herb is so rare — and why Hanuman had to go to the Himalayas specifically.',
      checkQuestion: 'If the base of a mountain is at 25°C and the peak is at 6,000 m, what is the approximate temperature at the peak?',
      checkAnswer: '25°C - (6.5 × 6) = 25 - 39 = -14°C. Well below freezing. This is why Himalayan peaks are covered in snow year-round — the lapse rate guarantees sub-zero temperatures above about 4,500 m in summer.',
      codeIntro: 'Plot temperature vs altitude and mark the vegetation zones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

lapse_rate = 6.5  # degrees C per 1000 m
base_temp = 30    # sea level temp in C
altitudes = np.linspace(0, 9000, 200)
temps = base_temp - (lapse_rate / 1000) * altitudes

fig, ax = plt.subplots(figsize=(6, 7))
ax.plot(temps, altitudes, 'c-', linewidth=2.5)

# Vegetation zones
zones = [
    (0, 1000, 'Tropical', '#228B22'),
    (1000, 2000, 'Subtropical', '#32CD32'),
    (2000, 3500, 'Temperate', '#90EE90'),
    (3500, 4500, 'Subalpine', '#DEB887'),
    (4500, 5500, 'Alpine', '#F0E68C'),
    (5500, 9000, 'Snow/Ice', '#E0E0E0'),
]
for lo, hi, name, color in zones:
    ax.axhspan(lo, hi, alpha=0.2, color=color)
    ax.text(max(temps) - 2, (lo + hi) / 2, name,
            fontsize=9, va='center', color='white')

ax.axhline(y=8849, color='gold', linestyle=':', alpha=0.8)
ax.text(-5, 8900, 'Everest', color='gold', fontsize=9)
ax.set_xlabel('Temperature (°C)')
ax.set_ylabel('Altitude (m)')
ax.set_title('Temperature Drops with Altitude')
ax.grid(alpha=0.15)
plt.show()

print(f"Lapse rate: {lapse_rate}°C per 1000 m")
print(f"At 5000 m: {base_temp - lapse_rate * 5:.1f}°C")
print(f"At Everest: {base_temp - lapse_rate * 8.849:.1f}°C")`,
      challenge: 'Add a second line showing how air pressure changes with altitude. Use the barometric formula: P = 101325 * (1 - 0.0000226 * altitude)^5.26. You will need a twin x-axis (ax2 = ax.twiny()).',
      successHint: 'The lapse rate is one of the most reliable patterns in atmospheric science. You can now predict temperature at any altitude — the same physics that determines where Himalayan plants grow.',
    },
    {
      title: 'Air pressure and oxygen — why altitude is hard',
      concept: `At sea level, the atmosphere presses down with a force of **101,325 Pascals** (1 atmosphere). This pressure exists because the column of air above you has weight.

As you climb higher, there is less air above you, so the pressure drops. At 5,500 m (the altitude of Everest base camp), pressure is roughly **half** of sea level. The air molecules are the same — 21% oxygen, 78% nitrogen — but they are spread farther apart. Each breath contains fewer oxygen molecules.

Your body responds to this in stages. First, your heart rate increases to pump blood faster. Over days, your body produces more **red blood cells** to carry oxygen more efficiently. This is **acclimatisation**. People who live at high altitude (like Sherpas) have genetic adaptations that make their bodies more efficient at using limited oxygen.

Plants face the same challenge. At high altitude, there is less CO2 for photosynthesis, more UV radiation, and extreme cold. Only specialised plants survive.`,
      analogy: 'Imagine a jar filled with marbles. At the bottom, marbles are packed tight — lots of marbles per scoop. At the top, they are spread out — fewer per scoop. The marbles are air molecules, and a "scoop" is one breath. Same jar, same marbles, but less per breath as you go up.',
      storyConnection: 'Hanuman needed supernatural strength to fly to the Himalayas. At those altitudes, even breathing is difficult. The Sanjeevani herb evolved in conditions that would kill most plants — extreme UV, low CO2, freezing temperatures. These stresses are also why the herb developed powerful chemical compounds.',
      checkQuestion: 'If air pressure at sea level is 101,325 Pa and drops to about 50% at 5,500 m, roughly how much oxygen is in each breath at 5,500 m compared to sea level?',
      checkAnswer: 'About 50%. The percentage of oxygen in air stays the same (21%), but since total air pressure is halved, the "partial pressure" of oxygen is halved too. 21% of 50% = about 10.5% effective oxygen. This is why climbers above 8,000 m call it the "death zone."',
      codeIntro: 'Model air pressure and oxygen partial pressure vs altitude.',
      code: `import numpy as np
import matplotlib.pyplot as plt

alt = np.linspace(0, 9000, 200)

# Barometric formula (simplified)
P_sea = 101325  # Pa at sea level
P = P_sea * (1 - 2.26e-5 * alt) ** 5.26

# Oxygen partial pressure (21% of total)
O2_partial = 0.21 * P

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

ax1.plot(P / 1000, alt, 'b-', linewidth=2)
ax1.set_xlabel('Pressure (kPa)')
ax1.set_ylabel('Altitude (m)')
ax1.set_title('Air Pressure vs Altitude')
ax1.axhline(5500, color='orange', ls='--', alpha=0.7)
ax1.text(60, 5700, 'Base Camp', color='orange', fontsize=9)
ax1.grid(alpha=0.2)

ax2.plot(O2_partial / 1000, alt, 'r-', linewidth=2)
ax2.set_xlabel('O₂ Partial Pressure (kPa)')
ax2.set_title('Available Oxygen vs Altitude')
ax2.axhline(8000, color='red', ls='--', alpha=0.7)
ax2.text(8, 8200, 'Death Zone', color='red', fontsize=9)
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

print(f"Sea level O₂: {0.21 * P_sea / 1000:.1f} kPa")
print(f"At 5500 m:    {0.21 * P_sea * (1 - 2.26e-5*5500)**5.26 / 1000:.1f} kPa")
print(f"At 8849 m:    {0.21 * P_sea * (1 - 2.26e-5*8849)**5.26 / 1000:.1f} kPa")`,
      challenge: 'Add a horizontal shaded zone from 8,000-9,000 m labeled "Death Zone" where O2 partial pressure drops below 7 kPa. Use ax2.axhspan().',
      successHint: 'Pressure and oxygen drop predictably with altitude. The barometric formula lets you calculate conditions anywhere on Earth — or on any planet with an atmosphere.',
    },
    {
      title: 'Why rare herbs grow only at certain heights',
      concept: `Different plants need different conditions. A mango tree thrives in tropical heat. A pine tree prefers cool mountains. A tiny alpine herb survives where nothing else can.

This is because altitude creates distinct **vegetation zones**, like floors in a building. Each zone has its own temperature range, UV intensity, and available moisture. A plant adapted to one zone usually cannot survive in another.

At the highest zones (4,000-5,500 m), conditions are brutal: freezing nights, intense UV (thinner air filters less sunlight), thin soil, and fierce wind. Plants here are small, low to the ground, and slow-growing. Many produce **secondary metabolites** — chemical compounds that protect against UV damage, cold stress, or herbivores.

These secondary metabolites are exactly what makes high-altitude plants medicinally interesting. The harsh environment forces plants to produce powerful chemistry.`,
      analogy: 'A building has different environments on each floor. The ground floor is warm and busy (tropical forest). Upper floors get colder and windier (alpine meadow). The rooftop is exposed to blazing sun and howling wind — only the toughest potted plant survives up there. Mountains work the same way.',
      storyConnection: 'The Sanjeevani herb could not grow in a valley or a tropical forest — it needed the extreme conditions of the high Himalayas. Harsh altitude stress forced the plant to produce the very compounds that gave it miraculous healing power. This is real science: many powerful medicines come from stressed plants.',
      checkQuestion: 'Why would a tropical plant die if transplanted to 4,500 m altitude?',
      checkAnswer: 'Multiple lethal factors: temperature below freezing (tropical plants have no frost tolerance), UV radiation 2-3x stronger (damages unprotected cells), air pressure ~60% of sea level (less CO2 for photosynthesis), thin rocky soil (no nutrients). Tropical plants evolved for warm, moist, sheltered conditions — the opposite of alpine.',
      codeIntro: 'Map which plant types survive at each altitude zone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

zones = {
    'Tropical': (0, 1000, 15, '#228B22'),
    'Subtropical': (1000, 2000, 12, '#32CD32'),
    'Temperate': (2000, 3500, 8, '#90EE90'),
    'Subalpine': (3500, 4500, 4, '#DEB887'),
    'Alpine': (4500, 5500, 2, '#DAA520'),
    'Nival/Snow': (5500, 9000, 0, '#C0C0C0'),
}

fig, ax = plt.subplots(figsize=(8, 6))
for name, (lo, hi, species, color) in zones.items():
    ax.barh(name, hi - lo, left=lo, color=color, alpha=0.7,
            edgecolor='white', linewidth=1.5)
    ax.text(lo + (hi - lo) / 2, name,
            f'{species} spp.', ha='center', va='center',
            fontsize=10, fontweight='bold', color='#1a1a1a')

ax.set_xlabel('Altitude (m)')
ax.set_title('Plant Species Richness by Altitude Zone')
ax.grid(axis='x', alpha=0.2)
plt.tight_layout()
plt.show()

print("Species diversity DECREASES with altitude.")
print("But chemical complexity INCREASES —")
print("stressed plants produce more defensive compounds.")
print("This is why Himalayan herbs are medicinally potent.")`,
      challenge: 'Add a second subplot showing UV intensity increasing with altitude (UV_index = 3 + altitude/1000 * 1.5). Overlay it with species count decreasing. What pattern do you see?',
      successHint: 'The relationship between altitude, stress, and plant chemistry is the scientific foundation of the Sanjeevani story. Extreme environments produce extreme adaptations.',
    },
    {
      title: 'Identifying plants — building a dichotomous key',
      concept: `Hanuman needed to find one specific herb on an entire mountain. How do botanists identify plants? They use a **dichotomous key** — a series of yes/no questions that narrow down the possibilities step by step.

"Dichotomous" means "dividing into two." At each step, you observe one feature and choose between two options:
- Leaves simple or compound?
- Leaf edge smooth or toothed?
- Flowers present or absent?

Each answer sends you down a different branch until you reach a single species.

This is the same logic as a **binary search** in computer science — cutting the possibilities in half at each step. With 1,000 possible species, a well-designed key can identify any one of them in about 10 questions (since 2^10 = 1,024).`,
      analogy: 'Think of the game "20 Questions." Is it alive? Yes. Is it an animal? No. Does it have flowers? Yes. Are the flowers yellow? No. Each question eliminates half the remaining possibilities. A dichotomous key is 20 Questions for plants — structured and reliable.',
      storyConnection: 'Hanuman could not identify the Sanjeevani herb by sight, so he lifted the entire mountain. A trained botanist with a dichotomous key could have walked to the right altitude zone, observed leaf shape, flower color, and growth habit, and identified the exact plant. Knowledge replaces brute force.',
      checkQuestion: 'If you have 512 possible plant species, what is the minimum number of yes/no questions needed to identify any one of them?',
      checkAnswer: '9 questions. 2^9 = 512. Each question halves the possibilities: 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1. This is the power of binary search — logarithmic efficiency.',
      codeIntro: 'Build a simple dichotomous key for Himalayan medicinal plants.',
      code: `# A simple dichotomous key as nested dictionaries
key = {
    "question": "Leaves simple or compound?",
    "simple": {
        "question": "Leaf edge smooth or toothed?",
        "smooth": {"result": "Tulsi (Ocimum sanctum)",
                   "use": "Anti-inflammatory, adaptogen"},
        "toothed": {"result": "Neem (Azadirachta indica)",
                    "use": "Antibacterial, antifungal"},
    },
    "compound": {
        "question": "Flowers yellow or purple?",
        "yellow": {"result": "Turmeric (Curcuma longa)",
                   "use": "Antioxidant, anti-inflammatory"},
        "purple": {"result": "Aconite (Aconitum spp.)",
                   "use": "Toxic — used in tiny doses only"},
    },
}

def identify(node, depth=0):
    indent = "  " * depth
    if "result" in node:
        print(f"{indent}>>> IDENTIFIED: {node['result']}")
        print(f"{indent}    Medicinal use: {node['use']}")
        return
    print(f"{indent}Q: {node['question']}")
    for answer, child in node.items():
        if answer == "question":
            continue
        print(f"{indent}  If '{answer}':")
        identify(child, depth + 2)

print("=== Himalayan Plant Dichotomous Key ===\\n")
identify(key)
print("\\nWith 2 questions, we distinguish 4 species.")
print("Add more branches to handle 8, 16, 32+ species.")`,
      challenge: 'Add a third level of questions. For example, under "Tulsi", add: "Stem square or round?" (square → Holy Basil, round → Sweet Basil). How many species can your expanded key handle?',
      successHint: 'A dichotomous key is both a botanical tool and a data structure — a binary tree. The same logic that identifies plants also powers search algorithms, decision trees in machine learning, and diagnostic flowcharts in medicine.',
    },
    {
      title: 'From plant to medicine — extraction basics',
      concept: `The Sanjeevani herb had healing power. But HOW does a plant heal? The answer: **secondary metabolites** — chemical compounds that plants produce for defense.

Plants cannot run away from predators, so they fight with chemistry. They produce bitter alkaloids (caffeine, morphine), aromatic terpenes (menthol, camphor), and colourful flavonoids (the yellow in turmeric). Many of these compounds happen to affect human biology too.

To turn a plant into a medicine, scientists follow a pipeline:
1. **Collect** — identify and harvest the right species
2. **Extract** — crush the plant, dissolve in a solvent (water, alcohol, or ethanol)
3. **Purify** — use chromatography to isolate the active compound
4. **Test** — lab tests, then animal studies, then human clinical trials
5. **Manufacture** — produce the pure compound as a pill or injection

This pipeline turned willow bark into aspirin, the poppy into morphine, and a Chinese herb into artemisinin (the malaria drug that saved millions).`,
      analogy: 'Making medicine from a plant is like making orange juice. You start with the whole fruit (collection). Squeeze it (extraction). Filter out the pulp (purification). Check it tastes right (testing). Bottle it (manufacturing). The "juice" is the active compound; the "pulp" is everything else in the plant.',
      storyConnection: 'The Sanjeevani herb contained compounds that could revive the fallen warrior Lakshmana. In the story, the whole herb was used. In modern science, we would extract, purify, and identify the specific molecule responsible — then synthesise it in a lab so we never need to harvest the plant again.',
      checkQuestion: 'Why can we not just eat the whole plant instead of extracting the active compound?',
      checkAnswer: 'Three reasons. First, the active compound may be present in tiny amounts — you might need kilograms of plant for one dose. Second, other compounds in the plant might be toxic or cause side effects. Third, we need precise dosing — too little does nothing, too much is dangerous. Purification gives us control.',
      codeIntro: 'Model a simple extraction process — dissolving compounds at different rates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulating extraction: compound dissolves over time
time_min = np.linspace(0, 60, 200)

# Different compounds extract at different rates
compounds = {
    'Active ingredient': {'rate': 0.08, 'max': 95, 'color': '#2ecc71'},
    'Tannins': {'rate': 0.05, 'max': 80, 'color': '#e74c3c'},
    'Chlorophyll': {'rate': 0.12, 'max': 60, 'color': '#27ae60'},
    'Wax/fiber': {'rate': 0.02, 'max': 30, 'color': '#95a5a6'},
}

fig, ax = plt.subplots(figsize=(8, 5))
for name, data in compounds.items():
    conc = data['max'] * (1 - np.exp(-data['rate'] * time_min))
    ax.plot(time_min, conc, linewidth=2, color=data['color'],
            label=name)

ax.set_xlabel('Extraction Time (minutes)')
ax.set_ylabel('Concentration in Solvent (%)')
ax.set_title('Extraction Curves: Different Compounds')
ax.legend(fontsize=9)
ax.grid(alpha=0.2)
ax.axvline(x=30, color='gold', linestyle='--', alpha=0.7)
ax.text(31, 50, 'Optimal\\ntime', color='gold', fontsize=9)
plt.show()

print("Each compound dissolves at a different rate.")
print("The goal: extract the active ingredient")
print("while minimising unwanted compounds.")
print("Timing matters — just like brewing tea!")`,
      challenge: 'Add a vertical line at the time when the active ingredient reaches 90% extraction. Calculate this time using the formula: t = -ln(1 - 0.9) / rate. Print the optimal extraction time.',
      successHint: 'You just modelled the first step of drug discovery: extraction kinetics. Every medicine that comes from a plant begins with understanding how fast the active compound dissolves — the same math that describes tea brewing, coffee extraction, and chemical processing.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geology basics, altitude science, and plant identification</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geology and botany modelling. Click to start.</p>
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
            diagram={[HanumanTectonicDiagram, HanumanAltitudeZonesDiagram, EarthLayersDiagram, AltitudeProfileDiagram, HanumanDichotomousKeyDiagram, HanumanMedicineDiagram][i] ? createElement([HanumanTectonicDiagram, HanumanAltitudeZonesDiagram, EarthLayersDiagram, AltitudeProfileDiagram, HanumanDichotomousKeyDiagram, HanumanMedicineDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
