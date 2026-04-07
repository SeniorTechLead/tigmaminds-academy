import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PrayerFlagsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Weathering database — tracking degradation across sites',
      concept: `A systematic weathering study deploys identical test samples at multiple sites and measures degradation over time. A **weathering database** stores these measurements for analysis.

Schema for outdoor weathering study:
- **sites**: id, name, altitude, latitude, longitude, environment_type
- **samples**: id, site_id, material, dye_type, installation_date
- **measurements**: id, sample_id, date, color_delta_e, tensile_strength_mpa, weight_loss_pct, visual_score
- **weather_data**: site_id, date, uv_dose_kj, rainfall_mm, temp_min, temp_max, wind_avg_kmh

The key metric for color change is **ΔE** (Delta E) — the color difference in CIELAB color space:
**ΔE = sqrt((ΔL*)² + (Δa*)² + (Δb*)²)**

Where L* = lightness, a* = red-green, b* = yellow-blue.
- ΔE < 1: imperceptible
- ΔE 1-2: barely noticeable
- ΔE 2-5: noticeable
- ΔE > 5: obvious change

📚 *We will build the complete weathering database and analyze multi-site data.*`,
      analogy: 'A weathering database is like a clinical trial for fabrics. Each "patient" (sample) is exposed to different conditions (sites). Regular "check-ups" (measurements) track health decline. The database lets us compare treatments (materials, dyes) and environments (altitude, monsoon vs. dry) to find the most durable combination.',
      storyConnection: 'Understanding which materials last longest at which sites enables informed choices about prayer flag placement. Flags at exposed high passes could use more durable materials, while flags in sheltered monastery courtyards can use traditional materials — preserving tradition where possible and adapting where necessary.',
      checkQuestion: 'Why use ΔE instead of just measuring individual color coordinates?',
      checkAnswer: 'ΔE combines all three color dimensions (lightness, red-green, yellow-blue) into a single number that correlates with human perception. A flag might lose lightness (faded) without much hue shift, or shift from green toward yellow (dye-specific). ΔE captures both types of change in one metric, making comparisons easy. It is the standard in textile colorimetry worldwide.',
      codeIntro: 'Build a weathering study database and analyze degradation across Sikkim sites.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE sites (
    id INTEGER PRIMARY KEY, name TEXT, altitude_m INTEGER,
    latitude REAL, environment TEXT
);
CREATE TABLE samples (
    id INTEGER PRIMARY KEY, site_id INTEGER, material TEXT,
    dye_type TEXT, color TEXT, install_date TEXT
);
CREATE TABLE measurements (
    id INTEGER PRIMARY KEY, sample_id INTEGER, date TEXT,
    months_exposed INTEGER, delta_e REAL,
    tensile_strength_mpa REAL, weight_loss_pct REAL,
    visual_score INTEGER CHECK(visual_score BETWEEN 1 AND 10)
);
CREATE TABLE weather_monthly (
    site_id INTEGER, month TEXT,
    uv_dose_kj REAL, rainfall_mm REAL,
    temp_min REAL, temp_max REAL, wind_avg REAL
);
''')

np.random.seed(42)

sites = [
    (1, 'Rumtek Monastery', 1550, 27.28, 'sheltered courtyard'),
    (2, 'Pelling Ridge', 2150, 27.30, 'exposed ridge'),
    (3, 'Dzongri Camp', 4020, 27.38, 'high altitude exposed'),
    (4, 'Goecha La Pass', 4940, 27.36, 'extreme high pass'),
]
c.executemany('INSERT INTO sites VALUES (?,?,?,?,?)', sites)

materials = [('cotton', 'natural'), ('cotton', 'synthetic'), ('polyester', 'synthetic')]
flag_colors = ['blue', 'red', 'yellow', 'green']

sid = 0
for site_id in range(1, 5):
    for mat, dye in materials:
        for color in flag_colors:
            sid += 1
            c.execute('INSERT INTO samples VALUES (?,?,?,?,?,?)',
                     (sid, site_id, mat, dye, color, '2023-04-01'))

            # Generate 18 months of measurements
            for month in range(0, 19, 3):
                alt_factor = sites[site_id-1][2] / 1550
                shelter_factor = 0.6 if 'sheltered' in sites[site_id-1][4] else 1.0

                # Color fading (ΔE)
                base_k = {'blue': 0.06, 'red': 0.09, 'yellow': 0.14, 'green': 0.11}[color]
                dye_factor = 0.5 if dye == 'synthetic' else 1.0
                mat_factor = 0.7 if mat == 'polyester' else 1.0
                k = base_k * alt_factor * shelter_factor * dye_factor * mat_factor
                de = 50 * (1 - np.exp(-k * month)) + np.random.normal(0, 1.5)
                de = max(0, de)

                # Tensile strength
                strength = 350 * mat_factor * np.exp(-0.04 * alt_factor * month) + np.random.normal(0, 15)
                strength = max(20, strength)

                weight_loss = 2 * alt_factor * month / 18 + np.random.normal(0, 0.3)
                visual = max(1, min(10, int(10 - de / 6)))

                c.execute('INSERT INTO measurements (sample_id, date, months_exposed, delta_e, tensile_strength_mpa, weight_loss_pct, visual_score) VALUES (?,?,?,?,?,?,?)',
                         (sid, f'2023-{(4+month-1)%12+1:02d}-01', month, round(de,1), round(strength,0), round(max(0,weight_loss),1), visual))

db.commit()

# Analysis queries
print("=== PRAYER FLAG WEATHERING STUDY — SIKKIM ===\\n")

# Site comparison
print("--- Average ΔE at 12 Months by Site ---")
c.execute('''
    SELECT s.name, s.altitude_m, ROUND(AVG(m.delta_e), 1), ROUND(AVG(m.tensile_strength_mpa), 0)
    FROM sites s
    JOIN samples sa ON s.id = sa.site_id
    JOIN measurements m ON sa.id = m.sample_id
    WHERE m.months_exposed = 12
    GROUP BY s.id ORDER BY AVG(m.delta_e) DESC
''')
for name, alt, de, ts in c.fetchall():
    print(f"  {name:25s} ({alt}m): ΔE={de:5.1f}  Strength={ts:4.0f} MPa")

# Material comparison
print("\\n--- Material × Dye Performance (ΔE at 12mo, all sites) ---")
c.execute('''
    SELECT sa.material, sa.dye_type, ROUND(AVG(m.delta_e), 1), COUNT(*)
    FROM samples sa JOIN measurements m ON sa.id = m.sample_id
    WHERE m.months_exposed = 12
    GROUP BY sa.material, sa.dye_type
    ORDER BY AVG(m.delta_e)
''')
for mat, dye, de, n in c.fetchall():
    print(f"  {mat:10s} + {dye:10s}: ΔE = {de:5.1f} (n={n})")

# Color stability ranking
print("\\n--- Color Stability (ΔE at 12mo, natural cotton) ---")
c.execute('''
    SELECT sa.color, ROUND(AVG(m.delta_e), 1)
    FROM samples sa JOIN measurements m ON sa.id = m.sample_id
    WHERE m.months_exposed = 12 AND sa.material = 'cotton' AND sa.dye_type = 'natural'
    GROUP BY sa.color ORDER BY AVG(m.delta_e)
''')
for color, de in c.fetchall():
    bar = "█" * int(de / 2)
    print(f"  {color:8s}: ΔE = {de:5.1f}  {bar}")

# Worst performing combination
print("\\n--- Most Degraded Sample ---")
c.execute('''
    SELECT s.name, sa.material, sa.dye_type, sa.color, m.delta_e, m.tensile_strength_mpa
    FROM measurements m
    JOIN samples sa ON m.sample_id = sa.id
    JOIN sites s ON sa.site_id = s.id
    WHERE m.months_exposed = 18
    ORDER BY m.delta_e DESC LIMIT 1
''')
r = c.fetchone()
print(f"  {r[3]} {r[1]}+{r[2]} at {r[0]}: ΔE={r[4]:.1f}, Strength={r[5]:.0f} MPa")

db.close()`,
      challenge: 'Add a query to find the "best compromise" — the material/dye combination that performs well at ALL sites (lowest maximum ΔE across sites). This is the most robust choice for universal use.',
      successHint: 'You have built a multi-factor weathering study database with realistic experimental design. The material×dye×site×color factorial structure is exactly how materials scientists design outdoor exposure studies. The SQL queries extract actionable insights from hundreds of data points.',
    },
    {
      title: 'Accelerated weathering — predicting years from weeks',
      concept: `**Accelerated weathering** uses intense artificial conditions to predict long-term outdoor performance in a fraction of the time:

- **Xenon arc lamps**: simulate solar spectrum (UV + visible)
- **Water spray**: simulate rain cycles
- **Temperature cycling**: simulate day/night
- **Intensity**: 3-10× natural sunlight

The acceleration factor relates lab time to outdoor time:
**t_outdoor = AF × t_lab**

Determining AF requires correlation studies:
1. Expose samples outdoors AND in the weathering chamber
2. Measure the same properties at intervals
3. Find the time ratio that aligns the degradation curves

Typical acceleration factors for Sikkim conditions:
- UV alone: AF ≈ 4-8× (1 week in chamber ≈ 1-2 months outdoors)
- UV + rain cycling: AF ≈ 6-10×
- Full cycle (UV + rain + freeze-thaw): AF ≈ 8-15×

The challenge: accelerated tests may change the degradation mechanism. At very high UV intensity, reactions occur that never happen naturally. Correlation must be validated.

📚 *We will implement accelerated testing correlation with database-backed analysis.*`,
      analogy: 'Accelerated weathering is like a flight simulator for fabrics. Instead of waiting years in real weather, you simulate it in hours. The simulator must be calibrated — if it runs 10× faster than real flight, 1 hour in the simulator equals 10 hours of real flying. But push it too fast (100× speed) and the physics break down, like a flight simulator where planes behave unrealistically.',
      storyConnection: 'Sikkim\'s textile research could use accelerated weathering to test new prayer flag materials in weeks instead of years. This enables rapid innovation: testing dozens of fabric and dye combinations without waiting for two monsoon seasons to see results.',
      checkQuestion: 'Why might an acceleration factor of 20× give misleading results?',
      checkAnswer: 'At 20× UV intensity, the surface temperature of the fabric rises much higher than in natural sunlight, potentially causing thermal degradation that would not occur outdoors. Also, radical chain reactions may take different pathways at high radical concentrations. The degradation mechanism changes, so the correlation with outdoor aging breaks down. Most standards (ASTM, ISO) recommend AF ≤ 8-10× for reliable results.',
      codeIntro: 'Correlate accelerated and outdoor weathering data to determine reliable acceleration factors.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE outdoor_data (
    material TEXT, dye TEXT, months REAL, delta_e REAL, tensile_pct REAL
);
CREATE TABLE lab_data (
    material TEXT, dye TEXT, hours REAL, delta_e REAL, tensile_pct REAL
);
CREATE TABLE acceleration_factors (
    material TEXT, dye TEXT, property TEXT,
    af_value REAL, r_squared REAL
);
''')

np.random.seed(42)

# Outdoor data: 18 months, measured every 3 months
materials = [('cotton', 'natural'), ('cotton', 'synthetic'), ('polyester', 'synthetic')]

for mat, dye in materials:
    # Degradation model parameters
    k_de = {'natural': 0.12, 'synthetic': 0.06}[dye] * (0.8 if mat == 'polyester' else 1.0)
    k_ts = 0.05 * (0.6 if mat == 'polyester' else 1.0)

    for month in np.arange(0, 19, 3):
        de = 50 * (1 - np.exp(-k_de * month)) + np.random.normal(0, 1)
        ts = 100 * np.exp(-k_ts * month) + np.random.normal(0, 2)
        c.execute('INSERT INTO outdoor_data VALUES (?,?,?,?,?)',
                 (mat, dye, float(month), round(max(0,de),1), round(max(10,ts),1)))

    # Lab data: same degradation compressed into hours
    # AF ~ 6-8 for Sikkim conditions
    af_true = 6.5 if dye == 'natural' else 7.5
    for hours in np.arange(0, 601, 50):
        equiv_months = hours / (30 * 24) * af_true
        de = 50 * (1 - np.exp(-k_de * equiv_months)) + np.random.normal(0, 1.5)
        ts = 100 * np.exp(-k_ts * equiv_months) + np.random.normal(0, 3)
        c.execute('INSERT INTO lab_data VALUES (?,?,?,?,?)',
                 (mat, dye, float(hours), round(max(0,de),1), round(max(10,ts),1)))

db.commit()

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Accelerated Weathering Correlation', color='white', fontsize=14, fontweight='bold')

mat_colors = {('cotton','natural'): '#ef4444', ('cotton','synthetic'): '#f59e0b', ('polyester','synthetic'): '#3b82f6'}

# Panel 1: Outdoor ΔE curves
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
for (mat, dye), color in mat_colors.items():
    c.execute('SELECT months, delta_e FROM outdoor_data WHERE material=? AND dye=? ORDER BY months', (mat, dye))
    rows = c.fetchall()
    ax.plot([r[0] for r in rows], [r[1] for r in rows], 'o-', color=color, linewidth=2, label=f'{mat}+{dye}')
ax.set_xlabel('Months (outdoor)', color='white')
ax.set_ylabel('ΔE', color='white')
ax.set_title('Outdoor Exposure', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Lab ΔE curves
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
for (mat, dye), color in mat_colors.items():
    c.execute('SELECT hours, delta_e FROM lab_data WHERE material=? AND dye=? ORDER BY hours', (mat, dye))
    rows = c.fetchall()
    ax.plot([r[0] for r in rows], [r[1] for r in rows], 'o-', color=color, linewidth=2, label=f'{mat}+{dye}')
ax.set_xlabel('Hours (lab)', color='white')
ax.set_ylabel('ΔE', color='white')
ax.set_title('Accelerated Lab Exposure', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Correlation and AF determination
ax = axes[1, 0]
ax.set_facecolor('#1f2937')

for (mat, dye), color in mat_colors.items():
    c.execute('SELECT months, delta_e FROM outdoor_data WHERE material=? AND dye=?', (mat, dye))
    outdoor = {r[0]: r[1] for r in c.fetchall()}
    c.execute('SELECT hours, delta_e FROM lab_data WHERE material=? AND dye=?', (mat, dye))
    lab = {r[0]: r[1] for r in c.fetchall()}

    # Find AF by matching ΔE values
    # For each outdoor ΔE, find the lab hours that give the same ΔE
    outdoor_months = sorted([m for m in outdoor.keys() if m > 0])
    lab_hours_list = sorted(lab.keys())
    lab_de_list = [lab[h] for h in lab_hours_list]

    matched_pairs = []
    for m in outdoor_months:
        target_de = outdoor[m]
        # Interpolate lab hours for this ΔE
        for j in range(len(lab_de_list)-1):
            if lab_de_list[j] <= target_de <= lab_de_list[j+1]:
                frac = (target_de - lab_de_list[j]) / max(0.01, lab_de_list[j+1] - lab_de_list[j])
                lab_h = lab_hours_list[j] + frac * (lab_hours_list[j+1] - lab_hours_list[j])
                matched_pairs.append((m, lab_h))
                break

    if matched_pairs:
        outdoor_m = [p[0] for p in matched_pairs]
        lab_h = [p[1] for p in matched_pairs]
        ax.scatter(outdoor_m, lab_h, color=color, s=50, zorder=5)

        if len(outdoor_m) > 1:
            af = np.polyfit(outdoor_m, [h/(m*24*30) for m, h in matched_pairs], 0)[0]
            af = np.mean([h/(m*24*30) for m, h in matched_pairs if m > 0])
            ax.plot(outdoor_m, [m*24*30*af for m in outdoor_m], color=color, linewidth=1.5,
                    linestyle='--', label=f'{mat}+{dye}: AF={1/af:.1f}')

            c.execute('INSERT INTO acceleration_factors VALUES (?,?,?,?,?)',
                     (mat, dye, 'delta_e', round(1/af, 1), 0.95))

ax.set_xlabel('Outdoor Months', color='white')
ax.set_ylabel('Equivalent Lab Hours', color='white')
ax.set_title('Outdoor-Lab Correlation', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Acceleration factors
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
c.execute('SELECT material, dye, af_value FROM acceleration_factors')
results = c.fetchall()
if results:
    names = [f'{r[0]}+{r[1]}' for r in results]
    afs = [r[2] for r in results]
    bars = ax.barh(names, afs, color=[mat_colors.get((r[0],r[1]),'#888') for r in results], alpha=0.8)
    for bar, af in zip(bars, afs):
        ax.text(bar.get_width()+0.1, bar.get_y()+bar.get_height()/2, f'{af:.1f}×', va='center', color='white')
    ax.set_xlabel('Acceleration Factor', color='white')
    ax.set_title('Determined Acceleration Factors', color='white', fontsize=12, fontweight='bold')
    ax.tick_params(colors='white')
    ax.grid(alpha=0.15, axis='x')

plt.tight_layout()
plt.savefig('accelerated.png', dpi=100, facecolor='#1f2937')
plt.show()

print("=== Acceleration Factors ===")
c.execute('SELECT material, dye, af_value FROM acceleration_factors')
for mat, dye, af in c.fetchall():
    print(f"  {mat}+{dye}: {af:.1f}× (1 week lab ≈ {af/4:.1f} months outdoor)")

db.close()`,
      challenge: 'If you need to predict 5-year outdoor performance, how many lab hours are needed for each material? Is this feasible in a standard 8-hour workday schedule?',
      successHint: 'You have implemented accelerated weathering correlation — the standard method for validating lab tests against real outdoor exposure. The acceleration factors enable rapid material screening: testing 20 fabric combinations in weeks instead of years.',
    },
    {
      title: 'Textile lifecycle analysis — environmental impact of prayer flags',
      concept: `Every prayer flag has an environmental footprint — from raw material to disposal. A **lifecycle analysis (LCA)** quantifies this impact:

1. **Raw materials**: cotton farming (water, pesticides, land) or polyester (petroleum, energy)
2. **Dyeing**: water consumption, chemical waste, energy
3. **Transport**: fuel for shipping from manufacturer to Sikkim
4. **Use phase**: no direct impact (passive hanging)
5. **End of life**: biodegradation (cotton) or microplastic pollution (polyester)

Key metrics:
- **Carbon footprint** (kg CO₂ equivalent)
- **Water footprint** (liters per flag)
- **Chemical waste** (grams of toxic chemicals)
- **Biodegradation time** (months for cotton, centuries for polyester)
- **Microplastic generation** (grams for synthetic flags)

The dilemma: synthetic flags last 3× longer (fewer replacements) but create microplastic waste. Cotton flags biodegrade but require 3× more production cycles for the same service life.

📚 *We will build a complete LCA database comparing materials across all lifecycle stages.*`,
      analogy: 'A lifecycle analysis is like a cradle-to-grave biography for a product. It tracks every resource consumed and every waste produced, from birth (raw materials) to death (disposal). Just as a person\'s carbon footprint includes food, transport, and housing over a lifetime, a prayer flag\'s footprint includes cotton farming, dyeing, and decomposition.',
      storyConnection: 'The prayer flag tradition is inherently sustainable — flags are made from natural materials and biodegrade naturally. But modernization brings synthetic options that last longer but create pollution. The LCA helps Sikkim\'s monasteries make environmentally informed choices that honor both tradition and the planet.',
      checkQuestion: 'If a polyester flag lasts 3× longer than cotton but never biodegrades, which is more sustainable over 10 years?',
      checkAnswer: 'It depends on which impact you weight most heavily. Cotton: 10 flags over 10 years = more farming, dyeing, transport — but zero persistent waste. Polyester: 3-4 flags = less production impact — but each leaves microplastic fragments in the mountain environment forever. For a pristine Himalayan ecosystem, the persistent microplastic may be more damaging than the higher production impact of cotton. There is no simple answer — it depends on values and context.',
      codeIntro: 'Build a lifecycle analysis database comparing cotton and synthetic prayer flag options.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE materials (
    name TEXT PRIMARY KEY, type TEXT, source TEXT,
    co2_per_kg REAL, water_per_kg REAL, energy_per_kg REAL,
    biodegradation_months INTEGER, microplastic_risk TEXT
);
CREATE TABLE dyeing (
    dye_type TEXT, color TEXT, water_liters REAL,
    chemical_waste_g REAL, co2_kg REAL, toxicity TEXT
);
CREATE TABLE lifecycle (
    scenario TEXT, material TEXT, dye TEXT,
    lifetime_months REAL, flags_per_10yr INTEGER,
    total_co2 REAL, total_water REAL,
    total_chemical_waste REAL, end_of_life_impact TEXT
);
''')

# Material data
materials = [
    ('Organic cotton', 'natural', 'Sikkim farms', 5.5, 8000, 15, 6, 'none'),
    ('Conventional cotton', 'natural', 'Gujarat mills', 8.0, 12000, 20, 8, 'none'),
    ('Polyester', 'synthetic', 'Petroleum-based', 12.0, 2000, 60, 999, 'high'),
    ('Recycled polyester', 'synthetic', 'Recycled bottles', 5.0, 1500, 35, 999, 'moderate'),
    ('Hemp', 'natural', 'NE India', 3.5, 3000, 10, 4, 'none'),
]
c.executemany('INSERT INTO materials VALUES (?,?,?,?,?,?,?,?)', materials)

# Dyeing data
dyeing_data = [
    ('natural', 'blue', 50, 5, 0.2, 'low'),
    ('natural', 'red', 40, 8, 0.15, 'low'),
    ('natural', 'yellow', 20, 2, 0.1, 'very low'),
    ('natural', 'green', 60, 10, 0.25, 'low'),
    ('synthetic', 'blue', 100, 25, 0.8, 'moderate'),
    ('synthetic', 'red', 90, 30, 0.7, 'moderate'),
    ('synthetic', 'yellow', 80, 20, 0.6, 'moderate'),
    ('synthetic', 'green', 110, 35, 0.9, 'moderate'),
]
c.executemany('INSERT INTO dyeing VALUES (?,?,?,?,?,?)', dyeing_data)

# Lifecycle scenarios
flag_weight_g = 30  # weight of one flag

scenarios = [
    # (scenario, material, dye, lifetime_months)
    ('Traditional', 'Organic cotton', 'natural', 8),
    ('Standard cotton', 'Conventional cotton', 'natural', 10),
    ('Synthetic durable', 'Polyester', 'synthetic', 24),
    ('Eco synthetic', 'Recycled polyester', 'synthetic', 20),
    ('Hemp traditional', 'Hemp', 'natural', 12),
]

for scenario, mat, dye, lifetime in scenarios:
    flags_10yr = int(np.ceil(120 / lifetime))

    c.execute('SELECT co2_per_kg, water_per_kg FROM materials WHERE name=?', (mat,))
    mat_data = c.fetchone()

    c.execute('SELECT AVG(water_liters), AVG(chemical_waste_g), AVG(co2_kg) FROM dyeing WHERE dye_type=?', (dye,))
    dye_data = c.fetchone()

    total_co2 = flags_10yr * (mat_data[0] * flag_weight_g/1000 + dye_data[2]) + flags_10yr * 0.1  # transport
    total_water = flags_10yr * (mat_data[1] * flag_weight_g/1000 + dye_data[0])
    total_chem = flags_10yr * dye_data[1]
    eol = 'biodegrades' if dye == 'natural' and 'cotton' in mat.lower() or 'hemp' in mat.lower() else 'microplastic fragments'

    c.execute('INSERT INTO lifecycle VALUES (?,?,?,?,?,?,?,?,?)',
             (scenario, mat, dye, lifetime, flags_10yr, round(total_co2,2), round(total_water,0), round(total_chem,0), eol))

db.commit()

# Analysis
print("=== PRAYER FLAG LIFECYCLE ANALYSIS (10-year basis) ===\\n")
print(f"{'Scenario':20s} {'Material':20s} {'Life':>5} {'Flags':>6} {'CO₂(kg)':>8} {'Water(L)':>9} {'Chem(g)':>8} {'End-of-Life'}")
print("-" * 100)

c.execute('SELECT * FROM lifecycle ORDER BY total_co2')
for row in c.fetchall():
    print(f"{row[0]:20s} {row[1]:20s} {row[3]:>4.0f}m {row[4]:>6} {row[5]:>8.1f} {row[6]:>9.0f} {row[7]:>8.0f} {row[8]}")

# Scoring
print("\\n=== SUSTAINABILITY SCORING (lower = better) ===\\n")
c.execute('SELECT scenario, total_co2, total_water, total_chemical_waste, end_of_life_impact FROM lifecycle')
rows = c.fetchall()

for row in rows:
    scenario, co2, water, chem, eol = row
    # Normalize each metric (0-100 scale, 100 = worst)
    co2_score = co2 / 3 * 100  # assuming max ~3 kg
    water_score = water / 500 * 100  # assuming max ~500 L
    chem_score = chem / 200 * 100  # assuming max ~200 g
    eol_score = 0 if 'biodegrades' in eol else 80

    total_score = (co2_score + water_score + chem_score + eol_score) / 4

    bar = "█" * int(total_score / 5) + "░" * (20 - int(total_score / 5))
    print(f"  {scenario:20s} [{bar}] {total_score:.0f}/100")
    print(f"    CO₂:{co2_score:.0f} Water:{water_score:.0f} Chem:{chem_score:.0f} EoL:{eol_score:.0f}")

print("\\n--- RECOMMENDATION ---")
print("Hemp with natural dyes: lowest overall impact")
print("  + Biodegrades naturally (aligns with prayer flag tradition)")
print("  + Low water and chemical use")
print("  + Can be grown locally in Sikkim")
print("  - Slightly shorter lifetime than polyester")
print("  - Requires more frequent replacement")

db.close()`,
      challenge: 'Add a "transport distance" factor: Sikkim-grown hemp has 0 km transport, Gujarat cotton has 3,000 km, and polyester has 5,000 km. How does transport change the CO₂ ranking?',
      successHint: 'You have built a complete lifecycle analysis with multi-criteria scoring. The LCA reveals that the most durable option (polyester) is not the most sustainable when end-of-life impacts are considered. This is a fundamental insight in environmental engineering — durability alone does not equal sustainability.',
    },
    {
      title: 'Smart materials — designing the prayer flag of the future',
      concept: `Can materials science create a prayer flag that is both traditional and durable? **Smart textile design** applies engineering principles to optimize for multiple constraints:

**Design objectives**:
1. Maintain traditional appearance (natural colors, cotton texture)
2. Extend lifetime 2-3× (reduce waste and replacement frequency)
3. Biodegrade fully at end of life (no microplastics)
4. Use locally available or sustainable materials
5. Keep costs within 50% of traditional flags

**Engineering solutions**:
- **UV stabilizers (HALS)**: add 0.5% hindered amine light stabilizer to dye bath — extends color life 3×
- **Water repellent treatment**: fluorine-free wax coating — reduces hydrolysis 40%
- **Reinforced edges**: doubled fabric at stress concentrations — delays tearing
- **Mordant optimization**: alum + tannin mordanting improves dye-fiber bonding, increasing lightfastness by 1-2 BWS grades
- **Hemp-cotton blend**: 30% hemp improves strength while maintaining softness

📚 *We will build an optimization algorithm that selects the best combination of treatments for maximum performance.*`,
      analogy: 'Designing a better prayer flag is like tuning a racing car. You cannot just add more horsepower (UV stabilizer) — you also need better tires (reinforced edges), aerodynamics (water repellent), and fuel efficiency (biodegradability). The best car wins on the combination, not any single factor. Our optimizer finds the best combination.',
      storyConnection: 'This capstone bridges ancient tradition and modern science. The prayer flag is a sacred object — but it is also a textile product subject to physics and chemistry. By understanding the degradation mechanisms, we can engineer better flags that honor tradition while lasting longer and creating less waste. Science serves culture.',
      checkQuestion: 'Why not just use the maximum amount of every treatment?',
      checkAnswer: 'Three reasons: (1) Cost — each treatment adds expense. The total must stay affordable. (2) Compatibility — some treatments interfere with each other. UV stabilizers may react with certain mordants. Water repellent may prevent dye uptake. (3) Tradition — the flag must look and feel like a traditional prayer flag. Over-engineering destroys the cultural authenticity that gives it meaning.',
      codeIntro: 'Build a multi-objective optimization system for prayer flag design.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE treatments (
    name TEXT, category TEXT, cost_pct REAL,
    color_life_factor REAL, strength_factor REAL,
    water_resist REAL, biodegradable BOOLEAN,
    traditional_score REAL
);
CREATE TABLE designs (
    id INTEGER PRIMARY KEY, name TEXT,
    treatments TEXT, total_cost_pct REAL,
    predicted_lifetime_months REAL,
    color_life_months REAL, strength_life_months REAL,
    biodegradable BOOLEAN, tradition_score REAL,
    overall_score REAL
);
''')

treatments = [
    ('No treatment', 'base', 0, 1.0, 1.0, 0, 1, 10),
    ('HALS UV stabilizer', 'chemical', 15, 2.8, 1.2, 0, 1, 7),
    ('Wax water repellent', 'coating', 10, 1.3, 1.1, 0.4, 1, 8),
    ('Alum mordant (improved)', 'dyeing', 5, 1.8, 1.0, 0, 1, 9),
    ('Tannin mordant', 'dyeing', 5, 1.5, 1.05, 0.1, 1, 10),
    ('Reinforced edges', 'construction', 20, 1.0, 1.8, 0, 1, 9),
    ('Hemp blend (30%)', 'material', 10, 1.1, 1.5, 0.15, 1, 8),
    ('Polyester blend (20%)', 'material', 8, 1.2, 1.6, 0.2, 0, 5),
    ('Nano-TiO2 coating', 'coating', 25, 0.8, 1.0, 0.3, 1, 4),  # self-cleaning but reduces dye
]
c.executemany('INSERT INTO treatments VALUES (?,?,?,?,?,?,?,?)', treatments)
db.commit()

# Design optimization: try combinations
def evaluate_design(treatment_list):
    """Evaluate a combination of treatments."""
    total_cost = 0
    color_factor = 1.0
    strength_factor = 1.0
    water_resist = 0
    biodeg = True
    tradition = 10

    for t_name in treatment_list:
        c.execute('SELECT * FROM treatments WHERE name=?', (t_name,))
        row = c.fetchone()
        if row:
            total_cost += row[2]
            color_factor *= row[3]
            strength_factor *= row[4]
            water_resist = max(water_resist, row[5])
            if not row[6]:
                biodeg = False
            tradition = min(tradition, row[7])

    # Base lifetimes
    base_color = 8  # months
    base_strength = 14  # months

    # Water resistance reduces hydrolysis → improves both
    hydro_factor = 1 + 0.5 * water_resist

    color_life = base_color * color_factor * hydro_factor
    strength_life = base_strength * strength_factor * hydro_factor

    # Overall lifetime is the minimum
    lifetime = min(color_life, strength_life)

    # Overall score (weighted)
    score = (
        lifetime / 30 * 40 +           # longevity (40%)
        tradition * 3 +                 # tradition (30%)
        (1 if biodeg else 0) * 15 +     # biodegradability (15%)
        max(0, (50 - total_cost)/50) * 15  # cost-effectiveness (15%)
    )

    return {
        'cost': total_cost, 'color_life': color_life,
        'strength_life': strength_life, 'lifetime': lifetime,
        'biodeg': biodeg, 'tradition': tradition, 'score': score
    }

# Test all promising combinations
designs = [
    ('Traditional (baseline)', ['No treatment']),
    ('Improved mordant only', ['Alum mordant (improved)', 'Tannin mordant']),
    ('UV protected', ['HALS UV stabilizer']),
    ('Full natural protection', ['HALS UV stabilizer', 'Wax water repellent', 'Alum mordant (improved)']),
    ('Hemp reinforced', ['Hemp blend (30%)', 'Reinforced edges', 'Tannin mordant']),
    ('Maximum durability', ['HALS UV stabilizer', 'Wax water repellent', 'Reinforced edges', 'Hemp blend (30%)']),
    ('Synthetic modern', ['Polyester blend (20%)', 'HALS UV stabilizer', 'Reinforced edges']),
    ('Balanced optimal', ['HALS UV stabilizer', 'Alum mordant (improved)', 'Hemp blend (30%)']),
]

print("=== PRAYER FLAG DESIGN OPTIMIZATION ===\\n")
print(f"{'Design':30s} {'Cost%':>6} {'Color':>7} {'Str':>7} {'Life':>6} {'Bio':>5} {'Trad':>5} {'Score':>7}")
print("-" * 80)

all_results = []
for name, treatments in designs:
    r = evaluate_design(treatments)
    all_results.append((name, r))
    bio = "yes" if r['biodeg'] else "NO"
    print(f"{name:30s} {r['cost']:>5.0f}% {r['color_life']:>6.1f}m {r['strength_life']:>6.1f}m {r['lifetime']:>5.1f}m {bio:>5} {r['tradition']:>5.0f} {r['score']:>6.1f}")

    c.execute('INSERT INTO designs (name, treatments, total_cost_pct, predicted_lifetime_months, color_life_months, strength_life_months, biodegradable, tradition_score, overall_score) VALUES (?,?,?,?,?,?,?,?,?)',
             (name, '+'.join(treatments), r['cost'], r['lifetime'], r['color_life'], r['strength_life'], r['biodeg'], r['tradition'], r['score']))

db.commit()

# Plot
fig, axes = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Score comparison
ax = axes[0]
ax.set_facecolor('#1f2937')
names = [r[0][:20] for r in all_results]
scores = [r[1]['score'] for r in all_results]
lifetimes_plot = [r[1]['lifetime'] for r in all_results]
colors = ['#22c55e' if r[1]['biodeg'] else '#ef4444' for r in all_results]

bars = ax.barh(range(len(names)), scores, color=colors, alpha=0.8)
ax.set_yticks(range(len(names)))
ax.set_yticklabels(names, fontsize=8, color='white')
ax.set_xlabel('Overall Score', color='white', fontsize=11)
ax.set_title('Design Comparison (green=biodegradable)', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='x')

# Panel 2: Pareto front (lifetime vs tradition)
ax = axes[1]
ax.set_facecolor('#1f2937')
for name, r in all_results:
    marker = 'o' if r['biodeg'] else 's'
    ax.scatter(r['lifetime'], r['tradition'], s=r['score']*3,
              c='#22c55e' if r['biodeg'] else '#ef4444',
              marker=marker, alpha=0.8, edgecolors='white', linewidth=0.5)
    ax.annotate(name[:15], (r['lifetime']+0.3, r['tradition']+0.1),
               color='white', fontsize=7)

ax.set_xlabel('Predicted Lifetime (months)', color='white', fontsize=11)
ax.set_ylabel('Tradition Score (1-10)', color='white', fontsize=11)
ax.set_title('Pareto Front: Durability vs. Tradition', color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('optimization.png', dpi=100, facecolor='#1f2937')
plt.show()

# Winner
best = max(all_results, key=lambda x: x[1]['score'])
print(f"\\n=== RECOMMENDED DESIGN: {best[0]} ===")
print(f"Score: {best[1]['score']:.1f}")
print(f"Predicted lifetime: {best[1]['lifetime']:.1f} months")
print(f"Cost increase: {best[1]['cost']:.0f}%")
print(f"Biodegradable: {'Yes' if best[1]['biodeg'] else 'No'}")
print(f"Tradition score: {best[1]['tradition']}/10")

db.close()`,
      challenge: 'Add a "Pareto optimization" that finds all non-dominated designs (no design is better in ALL criteria simultaneously). How many designs are on the Pareto front?',
      successHint: 'You have built a complete materials design optimization system — the capstone of this textile science journey. The multi-objective optimization balances competing goals (durability, tradition, sustainability, cost) exactly as a real materials engineer would approach the problem. The Pareto front visualization shows that there is no single "best" design — only trade-offs. The choice depends on values, and now Sikkim\'s communities have the data to make that choice wisely.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Textile engineering with databases and optimization</span>
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
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
