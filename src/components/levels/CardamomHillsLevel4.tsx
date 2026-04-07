import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CardamomHillsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Essential oil quality database — grading and traceability',
      concept: `The global essential oil market requires rigorous quality control. A **quality database** tracks every batch from farm to buyer, recording chemical composition, sensory scores, and compliance with standards like ISO 4733 (cardamom oil).

Key quality parameters for cardamom oil:
- **1,8-Cineole content**: >25% (premium: >35%)
- **α-Terpinyl acetate**: >20%
- **Specific gravity**: 0.917-0.947 at 20°C
- **Optical rotation**: +22° to +44°
- **Refractive index**: 1.463-1.466
- **Heavy metals**: <10 ppm lead, <1 ppm arsenic

A traceability database links:
- **Farm** → harvest date → drying method → distillation batch → GC-MS analysis → quality grade → buyer

This enables: identifying which farms produce premium oil, which processing methods yield the best results, and catching adulteration (mixing with cheaper oils).

📚 *We will build a complete quality management database with sqlite3.*`,
      analogy: 'A quality database is like a passport for each batch of oil. It records where it was born (farm), when (harvest date), what it looks like (chemical analysis), and where it has traveled (processing, shipping). If a buyer finds a problem, the passport traces it back to the exact farm and processing step.',
      storyConnection: 'Sikkim\'s cardamom is a Geographical Indication (GI) product — its origin is legally protected. The quality database ensures that "Sikkim Large Cardamom" is genuinely from Sikkim, processed traditionally, and meets quality standards. This protection preserves both the farmers\' livelihoods and the story\'s cultural heritage.',
      checkQuestion: 'Why is GC-MS analysis essential for detecting adulteration?',
      checkAnswer: 'The human nose cannot distinguish between natural cardamom oil and a mixture of 80% cardamom + 20% cheap eucalyptus oil (which also contains cineole). GC-MS reveals the adulteration because eucalyptus oil has different minor compounds — its "fingerprint" is subtly different. Specific markers like the linalool-to-terpineol ratio differ between natural and adulterated oil.',
      codeIntro: 'Build a complete essential oil quality management database with traceability.',
      code: `import sqlite3
import random

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE farms (
    id INTEGER PRIMARY KEY, name TEXT, village TEXT,
    altitude_m INTEGER, area_hectares REAL, organic BOOLEAN
);
CREATE TABLE harvests (
    id INTEGER PRIMARY KEY, farm_id INTEGER REFERENCES farms(id),
    date TEXT, weight_kg REAL, moisture_pct REAL, grade TEXT
);
CREATE TABLE distillations (
    id INTEGER PRIMARY KEY, harvest_id INTEGER REFERENCES harvests(id),
    date TEXT, method TEXT, duration_hours REAL, oil_yield_ml REAL
);
CREATE TABLE analyses (
    id INTEGER PRIMARY KEY, distillation_id INTEGER REFERENCES distillations(id),
    date TEXT, cineole_pct REAL, terpinyl_acetate_pct REAL,
    limonene_pct REAL, linalool_pct REAL,
    specific_gravity REAL, optical_rotation REAL,
    grade TEXT, iso_compliant BOOLEAN
);
CREATE TABLE buyers (
    id INTEGER PRIMARY KEY, name TEXT, country TEXT, requirement TEXT
);
CREATE TABLE sales (
    id INTEGER PRIMARY KEY, analysis_id INTEGER REFERENCES analyses(id),
    buyer_id INTEGER REFERENCES buyers(id),
    date TEXT, price_per_ml REAL, quantity_ml REAL
);
''')

random.seed(42)

# Farms across Sikkim
farms = [
    (1, 'Tashi Farm', 'Yuksom', 1200, 2.5, True),
    (2, 'Pema Organic', 'Ravangla', 1400, 1.8, True),
    (3, 'Dorji Estate', 'Namchi', 900, 4.0, False),
    (4, 'Karma Spice', 'Gangtok', 1100, 3.2, True),
    (5, 'Lhamo Highland', 'Lachung', 1600, 1.5, True),
    (6, 'Sikkim Valley', 'Jorethang', 800, 5.0, False),
]
c.executemany('INSERT INTO farms VALUES (?,?,?,?,?,?)', farms)

# Generate 3 years of data
for year in range(2022, 2025):
    for farm_id, name, village, alt, area, organic in farms:
        weight = area * random.uniform(200, 400)
        moisture = random.uniform(8, 15)
        grade = 'A' if alt > 1200 and organic else 'B' if alt > 900 else 'C'
        h_id = farm_id * 10 + (year - 2022)
        c.execute('INSERT INTO harvests VALUES (?,?,?,?,?,?)',
                 (h_id, farm_id, f'{year}-10-15', round(weight,1), round(moisture,1), grade))

        oil = weight * random.uniform(0.03, 0.06)
        d_id = h_id
        c.execute('INSERT INTO distillations VALUES (?,?,?,?,?,?)',
                 (d_id, h_id, f'{year}-10-25', random.choice(['steam','fire-cure+steam']),
                  random.uniform(3, 6), round(oil, 1)))

        cineole = 25 + (alt - 800) / 100 + random.uniform(-3, 3)
        ta = 20 + random.uniform(-3, 5)
        sg = random.uniform(0.917, 0.947)
        opt_rot = random.uniform(22, 44)
        iso = cineole > 25 and ta > 20 and 0.917 <= sg <= 0.947
        oil_grade = 'Premium' if cineole > 33 and ta > 28 else 'Standard' if iso else 'Below Standard'

        c.execute('INSERT INTO analyses VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                 (d_id, d_id, f'{year}-11-01', round(cineole,1), round(ta,1),
                  round(random.uniform(5,10),1), round(random.uniform(3,6),1),
                  round(sg,4), round(opt_rot,1), oil_grade, iso))

buyers = [(1,'Aromatics Corp','Germany','Premium, ISO compliant'),
          (2,'Spice House','Japan','Standard+'),
          (3,'Chai Masters','India','Any grade')]
c.executemany('INSERT INTO buyers VALUES (?,?,?,?)', buyers)

# Sales
for d_id in range(1, 19):
    c.execute('SELECT grade FROM analyses WHERE id=?', (d_id,))
    row = c.fetchone()
    if row:
        grade = row[0]
        buyer = 1 if grade == 'Premium' else (2 if grade == 'Standard' else 3)
        price = 3500 if grade == 'Premium' else (2500 if grade == 'Standard' else 1500)
        c.execute('INSERT INTO sales (analysis_id, buyer_id, date, price_per_ml, quantity_ml) VALUES (?,?,?,?,?)',
                 (d_id, buyer, '2024-01-15', price, random.uniform(50, 200)))

db.commit()

# Queries
print("=== SIKKIM CARDAMOM OIL — QUALITY MANAGEMENT SYSTEM ===\\\n")

# Farm performance ranking
print("--- Farm Performance Ranking ---")
c.execute('''
    SELECT f.name, f.altitude_m, f.organic,
           ROUND(AVG(a.cineole_pct), 1) as avg_cineole,
           ROUND(AVG(a.terpinyl_acetate_pct), 1) as avg_ta,
           SUM(CASE WHEN a.grade = 'Premium' THEN 1 ELSE 0 END) as premium_batches,
           COUNT(*) as total_batches
    FROM farms f
    JOIN harvests h ON f.id = h.farm_id
    JOIN distillations d ON h.id = d.harvest_id
    JOIN analyses a ON d.id = a.distillation_id
    GROUP BY f.id
    ORDER BY avg_cineole DESC
''')
for name, alt, org, cin, ta, premium, total in c.fetchall():
    org_label = "organic" if org else "conventional"
    print(f"  {name:20s} {alt}m {org_label:12s} cineole:{cin}% TA:{ta}% premium:{premium}/{total}")

# ISO compliance rate
print("\\\n--- ISO Compliance ---")
c.execute('''
    SELECT CASE WHEN iso_compliant THEN 'Compliant' ELSE 'Non-compliant' END as status,
           COUNT(*) as count
    FROM analyses GROUP BY iso_compliant
''')
for status, count in c.fetchall():
    print(f"  {status}: {count} batches")

# Revenue by grade
print("\\\n--- Revenue by Grade ---")
c.execute('''
    SELECT a.grade, COUNT(*) as batches,
           ROUND(SUM(s.price_per_ml * s.quantity_ml)) as revenue
    FROM analyses a
    JOIN sales s ON a.id = s.analysis_id
    GROUP BY a.grade
    ORDER BY revenue DESC
''')
for grade, batches, revenue in c.fetchall():
    print(f"  {grade:15s}: {batches} batches → Rs {revenue:,.0f}")

# Traceability example
print("\\\n--- Traceability: Best Batch ---")
c.execute('''
    SELECT f.name, f.village, h.date, d.method,
           a.cineole_pct, a.terpinyl_acetate_pct, a.grade,
           b.name, b.country, s.price_per_ml
    FROM farms f
    JOIN harvests h ON f.id = h.farm_id
    JOIN distillations d ON h.id = d.harvest_id
    JOIN analyses a ON d.id = a.distillation_id
    JOIN sales s ON a.id = s.analysis_id
    JOIN buyers b ON s.buyer_id = b.id
    ORDER BY a.cineole_pct DESC LIMIT 1
''')
r = c.fetchone()
print(f"  Farm: {r[0]} ({r[1]})")
print(f"  Harvested: {r[2]}, Processed: {r[3]}")
print(f"  Quality: cineole {r[4]}%, TA {r[5]}%, Grade: {r[6]}")
print(f"  Sold to: {r[7]} ({r[8]}) at Rs {r[9]}/ml")

db.close()`,
      challenge: 'Add a query that flags potential adulteration: any batch where cineole > 45% (suspiciously high, suggesting eucalyptus oil was added). Which batches are flagged?',
      successHint: 'You have built a complete quality management system with farm-to-buyer traceability. The multi-table JOIN queries demonstrate relational database design at its best — tracking a single batch across 6 connected tables.',
    },
    {
      title: 'Formulation optimizer — blending essential oils for target aroma',
      concept: `Essential oil blending is both art and science. A **formulation optimizer** uses linear programming to find the cheapest blend that meets target composition constraints.

Problem: blend oils from different sources to achieve:
- Target 1,8-cineole content: 32-36%
- Target α-terpinyl acetate: 26-30%
- Minimum limonene: 5%
- Maximum cost: minimize

Available oils have different compositions and prices. The optimizer finds the mix ratio that meets all constraints at minimum cost.

This is a **linear programming** problem:
- **Objective**: minimize cost = Σ(price_i × fraction_i)
- **Constraints**:
  - Σ(cineole_i × fraction_i) ∈ [32, 36]
  - Σ(TA_i × fraction_i) ∈ [26, 30]
  - Σ(fraction_i) = 1
  - fraction_i ≥ 0

📚 *We will solve this optimization problem and store blend recipes in a database.*`,
      analogy: 'Formulation is like a chef combining ingredients. You want a dish (blend) with specific flavor balance (composition targets). Each ingredient (source oil) has different flavors (chemical profiles) and costs. The optimizer is a recipe calculator that finds the cheapest combination of ingredients that achieves the desired flavor.',
      storyConnection: 'Sikkim\'s cardamom cooperatives can increase revenue by blending batches strategically. Premium-grade oil from highland farms can be blended with standard-grade from lower elevations to create consistently high-quality oil that meets international specifications — maximizing value for all farmers.',
      checkQuestion: 'Why not just sell the best batches as-is and discard the rest?',
      checkAnswer: 'Economics and waste reduction. Premium batches represent only 20-30% of total production. Blending allows standard-grade oil to be "upgraded" by mixing with premium. This maximizes revenue from the total harvest. The optimizer ensures the blend meets specifications precisely — not by guesswork, but by mathematics.',
      codeIntro: 'Build a blend optimizer with database-backed recipes and cost analysis.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE source_oils (
    id INTEGER PRIMARY KEY, name TEXT, origin TEXT,
    cineole REAL, terpinyl_acetate REAL, limonene REAL,
    linalool REAL, price_per_ml REAL, available_ml REAL
);
CREATE TABLE blend_recipes (
    id INTEGER PRIMARY KEY, name TEXT, target TEXT,
    total_cost REAL, total_ml REAL, meets_spec BOOLEAN
);
CREATE TABLE blend_components (
    blend_id INTEGER REFERENCES blend_recipes(id),
    oil_id INTEGER REFERENCES source_oils(id),
    fraction REAL, volume_ml REAL
);
''')

oils = [
    (1, 'Lhamo Highland', 'Lachung, 1600m', 38.5, 25.0, 6.0, 4.0, 3200, 500),
    (2, 'Pema Organic', 'Ravangla, 1400m', 35.0, 28.0, 7.5, 5.0, 2800, 800),
    (3, 'Karma Spice', 'Gangtok, 1100m', 30.0, 32.0, 8.0, 4.5, 2200, 1200),
    (4, 'Dorji Estate', 'Namchi, 900m', 26.0, 22.0, 10.0, 6.0, 1500, 1500),
    (5, 'Valley Blend', 'Jorethang, 800m', 22.0, 18.0, 12.0, 7.0, 1000, 2000),
]
c.executemany('INSERT INTO source_oils VALUES (?,?,?,?,?,?,?,?,?)', oils)
db.commit()

# Blend optimizer using grid search (simple but effective for small problems)
def optimize_blend(oils_data, targets, n_samples=10000):
    """Find minimum-cost blend meeting composition targets."""
    n_oils = len(oils_data)
    best_cost = float('inf')
    best_fractions = None

    for _ in range(n_samples):
        # Random fractions that sum to 1
        raw = np.random.dirichlet(np.ones(n_oils))
        fractions = raw

        # Calculate blend composition
        cineole = sum(f * o[3] for f, o in zip(fractions, oils_data))
        ta = sum(f * o[4] for f, o in zip(fractions, oils_data))
        limonene = sum(f * o[5] for f, o in zip(fractions, oils_data))
        cost = sum(f * o[7] for f, o in zip(fractions, oils_data))

        # Check constraints
        if (targets['cineole_min'] <= cineole <= targets['cineole_max'] and
            targets['ta_min'] <= ta <= targets['ta_max'] and
            limonene >= targets['limonene_min']):
            if cost < best_cost:
                best_cost = cost
                best_fractions = fractions.copy()
                best_comp = {'cineole': cineole, 'ta': ta, 'limonene': limonene}

    return best_fractions, best_cost, best_comp if best_fractions is not None else ({}, 0, {})

# Define target specifications
specs = {
    'ISO Premium': {'cineole_min': 33, 'cineole_max': 38, 'ta_min': 25, 'ta_max': 32, 'limonene_min': 5},
    'ISO Standard': {'cineole_min': 25, 'cineole_max': 38, 'ta_min': 20, 'ta_max': 35, 'limonene_min': 4},
    'Chai Blend': {'cineole_min': 28, 'cineole_max': 40, 'ta_min': 22, 'ta_max': 30, 'limonene_min': 6},
}

c.execute('SELECT * FROM source_oils')
oils_data = c.fetchall()

print("=== CARDAMOM OIL BLEND OPTIMIZER ===\\\n")
print("--- Available Source Oils ---")
for oil in oils_data:
    print(f"  {oil[1]:20s} Cin:{oil[3]}% TA:{oil[4]}% Lim:{oil[5]}% → Rs {oil[7]}/ml")

for spec_name, targets in specs.items():
    print(f"\\\n--- Optimizing: {spec_name} ---")
    print(f"  Targets: Cin {targets['cineole_min']}-{targets['cineole_max']}%, "
          f"TA {targets['ta_min']}-{targets['ta_max']}%, Lim ≥{targets['limonene_min']}%")

    fracs, cost, comp = optimize_blend(oils_data, targets, n_samples=50000)

    if fracs is not None and len(comp) > 0:
        blend_id = list(specs.keys()).index(spec_name) + 1
        c.execute('INSERT INTO blend_recipes VALUES (?,?,?,?,?,?)',
                 (blend_id, spec_name, str(targets), round(cost, 0), 1000, True))

        print(f"  Optimal blend (Rs {cost:.0f}/ml):")
        for i, (frac, oil) in enumerate(zip(fracs, oils_data)):
            if frac > 0.01:
                vol = frac * 1000
                print(f"    {oil[1]:20s}: {frac*100:5.1f}% ({vol:.0f} ml)")
                c.execute('INSERT INTO blend_components VALUES (?,?,?,?)',
                         (blend_id, oil[0], round(frac, 4), round(vol, 1)))

        print(f"  Result: Cin:{comp['cineole']:.1f}% TA:{comp['ta']:.1f}% Lim:{comp['limonene']:.1f}%")

        # Cost comparison vs pure premium
        pure_premium_cost = oils_data[0][7]  # Lhamo Highland price
        savings = (pure_premium_cost - cost) / pure_premium_cost * 100
        print(f"  Savings vs pure premium: {savings:.0f}%")
    else:
        print(f"  No feasible blend found!")

db.commit()

# Summary
print("\\\n--- Blend Portfolio ---")
c.execute('SELECT name, total_cost, meets_spec FROM blend_recipes')
for name, cost, spec in c.fetchall():
    print(f"  {name:15s}: Rs {cost:,.0f}/L {'✓ ISO' if spec else '✗'}")

db.close()`,
      challenge: 'Add a "maximum volume" constraint: no single source can exceed 500 ml per 1000 ml blend (to avoid supply dependence). How does this change the optimal blend?',
      successHint: 'You have built a formulation optimizer — combining optimization algorithms with database-backed inventory management. This is exactly how the flavor and fragrance industry creates consistent products from variable natural ingredients.',
    },
    {
      title: 'Shelf life prediction — Arrhenius modeling for quality assurance',
      concept: `**Accelerated shelf life testing** uses high temperatures to predict how long a product will last under normal conditions. The **Arrhenius equation** connects reaction rate to temperature:

**k = A × e^(-Ea/RT)**

Where:
- **k** = rate constant (degradation speed)
- **A** = pre-exponential factor (collision frequency)
- **Ea** = activation energy (energy barrier for the reaction)
- **R** = gas constant (8.314 J/mol·K)
- **T** = absolute temperature (K)

The protocol:
1. Store oil samples at 40°C, 50°C, and 60°C (accelerated conditions)
2. Measure quality weekly for 3 months
3. Calculate k at each temperature
4. Plot ln(k) vs 1/T — the slope gives Ea/R
5. Extrapolate to predict k at 25°C (storage temperature)
6. Calculate time until quality drops below threshold

This is how food and pharmaceutical companies predict shelf life without waiting years.

📚 *We will implement the full accelerated testing protocol with database-backed data and Arrhenius analysis.*`,
      analogy: 'Accelerated testing is like a stress test for a bridge. Instead of waiting 100 years to see if it fails, engineers apply 10× the normal load for a month. If the bridge survives 10× load for 1 month, it will likely survive normal load for 100 months. Similarly, oil stored at 60°C for 1 month ages like oil at 25°C for ~8 months.',
      storyConnection: 'Sikkim cardamom oil shipped to Germany or Japan must survive months of transport and storage. The Arrhenius model predicts exactly how long the oil maintains premium quality — enabling contracts with guaranteed shelf life. Without this prediction, buyers risk receiving degraded product.',
      checkQuestion: 'If a compound degrades 8× faster at 60°C than at 25°C, can you simply say the shelf life at 25°C is 8× longer?',
      checkAnswer: 'Approximately, yes — if the degradation mechanism does not change between temperatures. This is the fundamental assumption of Arrhenius modeling: the same reaction occurs at all temperatures, just faster at higher T. This fails if: (1) a new reaction pathway opens at high T, (2) the oil undergoes a phase change, or (3) volatile compounds escape at high T but would not at 25°C. Careful experimental design includes checking for mechanism consistency.',
      codeIntro: 'Implement accelerated shelf life testing with Arrhenius analysis to predict cardamom oil shelf life.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE stability_study (
    id INTEGER PRIMARY KEY, temp_C INTEGER, week INTEGER,
    cineole_pct REAL, terpinyl_acetate_pct REAL,
    overall_quality REAL, color_score INTEGER
);
CREATE TABLE arrhenius_results (
    compound TEXT, Ea_kJ_mol REAL, A_per_day REAL,
    k_25C REAL, halflife_25C_days INTEGER,
    shelf_life_days INTEGER
);
''')

np.random.seed(42)
R = 8.314

# Generate stability data at 3 temperatures
temps = [40, 50, 60]
weeks = np.arange(0, 13)

# True Arrhenius parameters
compounds = {
    'cineole': {'Ea': 55000, 'A': 1e8, 'initial': 35},
    'terpinyl_acetate': {'Ea': 48000, 'A': 5e7, 'initial': 28},
}

for temp in temps:
    T_K = temp + 273.15
    for week in weeks:
        days = week * 7
        cin_k = compounds['cineole']['A'] * np.exp(-compounds['cineole']['Ea'] / (R * T_K))
        ta_k = compounds['terpinyl_acetate']['A'] * np.exp(-compounds['terpinyl_acetate']['Ea'] / (R * T_K))

        cin = 35 * np.exp(-cin_k * days) + np.random.normal(0, 0.3)
        ta = 28 * np.exp(-ta_k * days) + np.random.normal(0, 0.3)
        quality = (cin/35 + ta/28) / 2 * 100
        color = max(1, min(5, int(5 - days * cin_k * 8)))

        c.execute('INSERT INTO stability_study (temp_C, week, cineole_pct, terpinyl_acetate_pct, overall_quality, color_score) VALUES (?,?,?,?,?,?)',
                 (temp, int(week), round(cin,2), round(ta,2), round(quality,1), color))

db.commit()

# Arrhenius analysis
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Accelerated Shelf Life Testing — Cardamom Oil', color='white', fontsize=14, fontweight='bold')

# Panel 1: Degradation curves
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
temp_colors = {40: '#22c55e', 50: '#f59e0b', 60: '#ef4444'}
for temp in temps:
    c.execute('SELECT week, cineole_pct FROM stability_study WHERE temp_C=? ORDER BY week', (temp,))
    rows = c.fetchall()
    wks = [r[0] for r in rows]
    vals = [r[1] for r in rows]
    ax.plot(wks, vals, 'o-', color=temp_colors[temp], linewidth=2, markersize=5, label=f'{temp}°C')

ax.axhline(y=25, color='gold', linestyle='--', alpha=0.5, label='ISO minimum')
ax.set_xlabel('Week', color='white', fontsize=11)
ax.set_ylabel('1,8-Cineole (%)', color='white', fontsize=11)
ax.set_title('Cineole Degradation at 3 Temperatures', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Extract rate constants
k_values = {}
for temp in temps:
    T_K = temp + 273.15
    c.execute('SELECT week, cineole_pct FROM stability_study WHERE temp_C=? AND week > 0 ORDER BY week', (temp,))
    rows = c.fetchall()
    wks = np.array([r[0] for r in rows]) * 7  # convert to days
    vals = np.array([r[1] for r in rows])
    # ln(C/C0) = -k*t → k = -slope of ln(C/C0) vs t
    ln_ratio = np.log(vals / 35)
    k_fit = -np.polyfit(wks, ln_ratio, 1)[0]
    k_values[temp] = k_fit

# Panel 2: Arrhenius plot
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
inv_T = [1/(t+273.15) for t in temps]
ln_k = [np.log(k_values[t]) for t in temps]

ax.scatter(inv_T, ln_k, color='#ef4444', s=80, zorder=5, edgecolors='white')
# Fit line
coeffs = np.polyfit(inv_T, ln_k, 1)
x_fit = np.linspace(min(inv_T)*0.99, 1/(25+273.15), 50)
ax.plot(x_fit, np.polyval(coeffs, x_fit), '#60a5fa', linewidth=2, label='Arrhenius fit')

# Extrapolate to 25°C
k_25 = np.exp(np.polyval(coeffs, 1/(25+273.15)))
ax.scatter([1/(25+273.15)], [np.log(k_25)], color='gold', s=100, marker='*', zorder=5, label=f'25°C prediction')

Ea_fitted = -coeffs[0] * R / 1000  # kJ/mol

ax.set_xlabel('1/T (1/K)', color='white', fontsize=11)
ax.set_ylabel('ln(k)', color='white', fontsize=11)
ax.set_title(f'Arrhenius Plot (Ea = {Ea_fitted:.1f} kJ/mol)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 3: Predicted shelf life at 25°C
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
days_25 = np.arange(0, 730)
cineole_25 = 35 * np.exp(-k_25 * days_25)
ax.plot(days_25, cineole_25, '#60a5fa', linewidth=2.5)
ax.fill_between(days_25, cineole_25, alpha=0.15, color='#3b82f6')
ax.axhline(y=25, color='gold', linestyle='--', alpha=0.7, label='ISO minimum (25%)')
# Find shelf life
shelf_life = days_25[np.argmax(cineole_25 < 25)] if np.any(cineole_25 < 25) else 730
ax.axvline(x=shelf_life, color='#ef4444', linestyle=':', alpha=0.7, label=f'Shelf life: {shelf_life} days')
ax.set_xlabel('Days at 25°C', color='white', fontsize=11)
ax.set_ylabel('Cineole (%)', color='white', fontsize=11)
ax.set_title('Predicted Shelf Life at 25°C', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: Acceleration factors
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
test_temps = np.arange(25, 65, 5)
acc_factors = [np.exp(Ea_fitted*1000/R * (1/(25+273.15) - 1/(t+273.15))) for t in test_temps]
ax.bar(range(len(test_temps)), acc_factors, color='#f59e0b', alpha=0.8)
ax.set_xticks(range(len(test_temps)))
ax.set_xticklabels([f'{t}°C' for t in test_temps], fontsize=8, color='white')
ax.set_ylabel('Acceleration Factor (vs 25°C)', color='white', fontsize=11)
ax.set_title('How Much Faster Is Degradation?', color='white', fontsize=11, fontweight='bold')
for i, af in enumerate(acc_factors):
    ax.text(i, af + 0.2, f'{af:.1f}x', ha='center', color='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

plt.tight_layout()
plt.savefig('shelf_life.png', dpi=100, facecolor='#1f2937')
plt.show()

# Store results
halflife = int(np.log(2) / k_25)
c.execute('INSERT INTO arrhenius_results VALUES (?,?,?,?,?,?)',
         ('1,8-Cineole', round(Ea_fitted,1), round(float(np.exp(coeffs[1])),2),
          round(k_25,6), halflife, shelf_life))
db.commit()

print(f"=== Arrhenius Analysis Results ===")
print(f"Activation energy: {Ea_fitted:.1f} kJ/mol")
print(f"Rate at 25°C: k = {k_25:.6f} /day")
print(f"Half-life at 25°C: {halflife} days ({halflife/30:.0f} months)")
print(f"Shelf life (to ISO minimum): {shelf_life} days ({shelf_life/30:.0f} months)")
print(f"\\\n60°C test for 12 weeks ≈ {12*7*acc_factors[-1]/7:.0f} weeks at 25°C")

db.close()`,
      challenge: 'Run the analysis for terpinyl acetate separately. Does it have a longer or shorter shelf life than cineole? Which compound limits the overall shelf life?',
      successHint: 'You have implemented the full accelerated shelf life testing protocol — from data generation to Arrhenius analysis to shelf life prediction. This is the standard method in food science and pharmaceutical development.',
    },
    {
      title: 'Market analytics — predicting cardamom oil prices',
      concept: `Cardamom oil prices fluctuate based on supply (harvest quality, weather), demand (food industry, pharmaceutical), and speculation. **Time series forecasting** uses historical data to predict future prices.

Methods:
- **Moving averages**: smooth out noise, identify trends
- **Exponential smoothing**: recent data weighted more heavily
- **Seasonal decomposition**: separate trend, seasonal, and random components
- **Regression**: correlate price with predictors (rainfall, harvest volume, oil prices)

For Sikkim cardamom oil:
- Prices spike when Indian monsoon fails (reduced harvest)
- Prices dip when Guatemala floods the market with cheap cardamom
- Premium organic oil is 2-3× the commodity price
- Fire-cured Sikkim variety has a niche market with stable premium

📚 *We will build a complete market analytics system with database storage, time series analysis, and forecasting.*`,
      analogy: 'Market analytics is like weather forecasting for prices. Just as meteorologists use past weather patterns and current atmospheric conditions to predict tomorrow\'s weather, we use past prices and current market conditions to predict future oil prices. Both are imperfect — but far better than guessing.',
      storyConnection: 'Sikkim\'s cardamom farmers are vulnerable to price swings they cannot predict or control. A market analytics tool gives cooperatives the data to decide when to sell (high prices) and when to store (low prices). This is how traditional agriculture meets modern data science — preserving the story\'s way of life through informed decisions.',
      checkQuestion: 'Why is the price of Sikkim large cardamom less volatile than green cardamom?',
      checkAnswer: 'Three reasons: (1) Niche market — Sikkim large cardamom serves specific uses (Tibetan tea, biryanis) with steady demand. (2) Limited supply — production is geographically constrained to the eastern Himalayas. (3) No substitutes — the smoky, camphor flavor cannot be replicated by green cardamom. This inelastic supply+demand means prices are more stable than commodity green cardamom.',
      codeIntro: 'Build a market analytics system with price forecasting for Sikkim cardamom oil.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE market_data (
    date TEXT, price_per_kg REAL, volume_traded_kg REAL,
    rainfall_mm REAL, harvest_estimate_tonnes REAL
);
CREATE TABLE forecasts (
    date TEXT, method TEXT, predicted_price REAL,
    confidence_low REAL, confidence_high REAL
);
''')

np.random.seed(42)

# Generate 5 years of monthly data
months = []
prices = []
base_price = 2500  # Rs per kg
trend = 0
seasonal_pattern = [0.9, 0.85, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.2, 1.15, 0.95]

for year in range(2020, 2025):
    for month in range(1, 13):
        date = f"{year}-{month:02d}-01"
        trend += np.random.normal(5, 10)  # gradual upward trend
        seasonal = seasonal_pattern[month-1]
        noise = np.random.normal(0, 80)
        price = (base_price + trend) * seasonal + noise
        price = max(1500, price)

        rainfall = max(0, 200 * seasonal_pattern[month-1] + np.random.normal(0, 50))
        volume = max(10, 100 * seasonal + np.random.normal(0, 20))
        harvest = max(100, 1000 * seasonal_pattern[month-1] + np.random.normal(0, 100))

        months.append(date)
        prices.append(round(price, 0))

        c.execute('INSERT INTO market_data VALUES (?,?,?,?,?)',
                 (date, round(price,0), round(volume,0), round(rainfall,0), round(harvest,0)))

db.commit()
prices = np.array(prices)

# Analysis
fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sikkim Cardamom Oil Market Analytics', color='white', fontsize=14, fontweight='bold')

x = np.arange(len(prices))

# Panel 1: Price history with moving averages
ax = axes[0, 0]
ax.set_facecolor('#1f2937')
ax.plot(x, prices, '#60a5fa', linewidth=1, alpha=0.6, label='Monthly price')
# Moving averages
for window, color, label in [(3, '#f59e0b', '3-month MA'), (12, '#ef4444', '12-month MA')]:
    ma = np.convolve(prices, np.ones(window)/window, mode='valid')
    ax.plot(np.arange(window-1, len(prices)), ma, color=color, linewidth=2, label=label)

ax.set_xlabel('Month', color='white')
ax.set_ylabel('Price (Rs/kg)', color='white')
ax.set_title('Price History (2020-2024)', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 2: Seasonal decomposition
ax = axes[0, 1]
ax.set_facecolor('#1f2937')
# Average price by month
monthly_avg = []
for m in range(12):
    month_prices = prices[m::12]
    monthly_avg.append(np.mean(month_prices))

month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
colors_mon = ['#ef4444' if v > np.mean(monthly_avg) else '#3b82f6' for v in monthly_avg]
ax.bar(range(12), monthly_avg, color=colors_mon, alpha=0.8)
ax.axhline(y=np.mean(monthly_avg), color='white', linestyle='--', alpha=0.5)
ax.set_xticks(range(12))
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Avg Price (Rs/kg)', color='white')
ax.set_title('Seasonal Pattern (red = above avg)', color='white', fontsize=11, fontweight='bold')
ax.tick_params(colors='white')
ax.grid(alpha=0.15, axis='y')

# Panel 3: Price vs rainfall correlation
ax = axes[1, 0]
ax.set_facecolor('#1f2937')
c.execute('SELECT rainfall_mm, price_per_kg FROM market_data')
rows = c.fetchall()
rain = [r[0] for r in rows]
price_all = [r[1] for r in rows]
ax.scatter(rain, price_all, c='#3b82f6', s=20, alpha=0.6)
# Fit
z = np.polyfit(rain, price_all, 1)
rain_fit = np.linspace(min(rain), max(rain), 50)
ax.plot(rain_fit, np.polyval(z, rain_fit), '#ef4444', linewidth=2, label=f'Trend: {z[0]:.1f} Rs/mm')
ax.set_xlabel('Monthly Rainfall (mm)', color='white')
ax.set_ylabel('Price (Rs/kg)', color='white')
ax.set_title('Price vs. Rainfall', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

# Panel 4: 6-month forecast
ax = axes[1, 1]
ax.set_facecolor('#1f2937')
# Exponential smoothing forecast
alpha_es = 0.3
forecast = [prices[-1]]
for i in range(6):
    month_idx = (len(prices) + i) % 12
    seasonal_adj = monthly_avg[month_idx] / np.mean(monthly_avg)
    trend_est = (prices[-1] - prices[-13]) / 12 if len(prices) > 13 else 0
    next_price = alpha_es * (prices[-1] + trend_est) + (1-alpha_es) * forecast[-1]
    next_price *= seasonal_adj
    forecast.append(next_price)

forecast_months = np.arange(len(prices)-6, len(prices)+7)
# Historical
ax.plot(x[-12:], prices[-12:], '#60a5fa', linewidth=2, label='Historical')
# Forecast
fc_x = np.arange(len(prices), len(prices)+7)
ax.plot(fc_x, forecast, '#22c55e', linewidth=2.5, marker='o', markersize=5, label='Forecast')
# Confidence interval
ci = np.array([f * 0.05 * (i+1) for i, f in enumerate(forecast)])
ax.fill_between(fc_x, np.array(forecast)-ci, np.array(forecast)+ci,
                alpha=0.2, color='#22c55e')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Price (Rs/kg)', color='white')
ax.set_title('6-Month Price Forecast', color='white', fontsize=11, fontweight='bold')
ax.legend(facecolor='#374151', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='white')
ax.grid(alpha=0.15)

plt.tight_layout()
plt.savefig('market.png', dpi=100, facecolor='#1f2937')
plt.show()

# Store forecasts
for i, price in enumerate(forecast[1:]):
    month = (len(prices) + i) % 12 + 1
    year = 2025 + (len(prices) + i) // 12
    c.execute('INSERT INTO forecasts VALUES (?,?,?,?,?)',
             (f'{year}-{month:02d}-01', 'Exponential Smoothing',
              round(price,0), round(price*0.9,0), round(price*1.1,0)))

db.commit()

print("=== Market Summary ===")
print(f"Current price: Rs {prices[-1]:.0f}/kg")
print(f"5-year average: Rs {np.mean(prices):.0f}/kg")
print(f"5-year trend: {'Up' if prices[-1] > prices[0] else 'Down'} ({((prices[-1]-prices[0])/prices[0]*100):.0f}%)")
print(f"Best selling month: {month_names[np.argmax(monthly_avg)]} (Rs {max(monthly_avg):.0f}/kg avg)")
print(f"Worst month: {month_names[np.argmin(monthly_avg)]} (Rs {min(monthly_avg):.0f}/kg avg)")
print(f"\\\n6-month forecast: Rs {forecast[-1]:.0f}/kg")

db.close()`,
      challenge: 'Add a "monsoon failure" scenario: what if rainfall drops 40% for the next 6 months? Adjust the forecast using the price-rainfall correlation. How much does the price spike?',
      successHint: 'You have built a complete market analytics system — from data storage to seasonal decomposition to forecasting. The combination of time series analysis, correlation with weather data, and exponential smoothing gives Sikkim\'s cardamom cooperatives the tools to make informed selling decisions.',
    },
    {
      title: 'Capstone: Cardamom Knowledge System — farm to formula',
      concept: `The capstone integrates every component into a comprehensive **Cardamom Knowledge System** that serves farmers, processors, and buyers:

1. **Farm database**: terroir, varieties, practices
2. **Quality analytics**: GC-MS profiles, grading, trends
3. **Processing optimization**: distillation parameters, yield prediction
4. **Shelf life management**: Arrhenius-based predictions per batch
5. **Market intelligence**: pricing, demand forecasting
6. **Traceability**: farm → batch → buyer chain of custody

The system generates actionable reports:
- Which farms should focus on premium production?
- When should cooperatives sell (price timing)?
- Which batches need blending to meet ISO specs?
- How should storage be managed to maximize quality?

📚 *This is a full-stack data application combining sqlite3, numpy, matplotlib, and multi-domain algorithms.*`,
      analogy: 'The Knowledge System is like a control tower for cardamom. Each screen shows a different aspect: farm conditions, oil quality, market prices, shelf life countdown. The operator (cooperative manager) sees the complete picture and makes decisions that optimize across all domains simultaneously.',
      storyConnection: 'The story of Sikkim\'s cardamom hills is one of tradition meeting modernity. The Knowledge System preserves traditional farming and processing methods while adding the data infrastructure needed to compete in global markets. It protects both the farmers\' livelihoods and the cultural heritage of cardamom cultivation.',
      checkQuestion: 'Why is an integrated system more valuable than separate tools for each domain?',
      checkAnswer: 'Cross-domain insights. An isolated quality tool cannot tell you to delay selling (market timing). An isolated market tool cannot factor in quality degradation (shelf life). The integrated system can say: "This premium batch will drop below ISO spec in 4 months, but prices are rising — sell in month 3 for maximum value." That decision requires data from quality, shelf life, AND market analytics simultaneously.',
      codeIntro: 'Build the complete Cardamom Knowledge System with a dashboard report.',
      code: `import sqlite3
import numpy as np

class CardamomKnowledgeSystem:
    def __init__(self):
        self.db = sqlite3.connect(':memory:')
        self._build()

    def _build(self):
        c = self.db.cursor()
        c.executescript('''
            CREATE TABLE farms (id INTEGER PRIMARY KEY, name TEXT, altitude INTEGER, organic BOOLEAN, area_ha REAL);
            CREATE TABLE batches (id INTEGER PRIMARY KEY, farm_id INTEGER, date TEXT, oil_ml REAL, cineole REAL, ta REAL, grade TEXT);
            CREATE TABLE inventory (batch_id INTEGER, current_ml REAL, days_stored INTEGER, quality_pct REAL);
            CREATE TABLE market (month TEXT, price_per_ml REAL, demand_level TEXT);
        ''')

        np.random.seed(42)

        farms = [(1,'Lhamo Highland',1600,1,1.5),(2,'Pema Organic',1400,1,1.8),
                 (3,'Karma Spice',1100,1,3.2),(4,'Dorji Estate',900,0,4.0),
                 (5,'Valley Coop',800,0,5.0)]
        c.executemany('INSERT INTO farms VALUES (?,?,?,?,?)', farms)

        bid = 0
        for fid, _, alt, org, area in farms:
            for month in range(10, 13):
                bid += 1
                oil = area * np.random.uniform(80, 150)
                cin = 20 + (alt-800)/50 + np.random.normal(0, 2)
                ta = 18 + np.random.uniform(0, 12)
                grade = 'Premium' if cin > 33 and ta > 25 else ('Standard' if cin > 25 else 'Basic')
                c.execute('INSERT INTO batches VALUES (?,?,?,?,?,?,?)',
                         (bid, fid, f'2024-{month}-15', round(oil,1), round(cin,1), round(ta,1), grade))

                # Inventory (some has been stored, some sold)
                stored = np.random.randint(30, 150)
                k = 0.0005 * 2**((25-25)/10)
                quality = 100 * np.exp(-k * stored)
                remaining = oil * np.random.uniform(0.3, 0.9)
                c.execute('INSERT INTO inventory VALUES (?,?,?,?)',
                         (bid, round(remaining,1), stored, round(quality,1)))

        for m in range(1, 13):
            price = 2500 + 500 * np.sin(2*np.pi*(m-2)/12) + np.random.normal(0, 100)
            demand = 'High' if m in [10,11,12,1] else ('Medium' if m in [3,4,5,9] else 'Low')
            c.execute('INSERT INTO market VALUES (?,?,?)', (f'2025-{m:02d}', round(price,0), demand))

        self.db.commit()

    def dashboard(self):
        c = self.db.cursor()
        print("=" * 65)
        print("   SIKKIM CARDAMOM KNOWLEDGE SYSTEM — DASHBOARD")
        print("=" * 65)

        # Farm summary
        print("\\\n--- FARM PERFORMANCE ---")
        c.execute('''
            SELECT f.name, f.altitude, ROUND(AVG(b.cineole),1),
                   ROUND(AVG(b.ta),1), SUM(b.oil_ml), COUNT(b.id),
                   SUM(CASE WHEN b.grade='Premium' THEN 1 ELSE 0 END)
            FROM farms f JOIN batches b ON f.id = b.farm_id
            GROUP BY f.id ORDER BY AVG(b.cineole) DESC
        ''')
        print(f"{'Farm':20s} {'Alt':>5} {'Cin%':>5} {'TA%':>5} {'Oil(ml)':>8} {'Batches':>8} {'Prem':>5}")
        for row in c.fetchall():
            print(f"{row[0]:20s} {row[1]:>5} {row[2]:>5} {row[3]:>5} {row[4]:>8.0f} {row[5]:>8} {row[6]:>5}")

        # Inventory status
        print("\\\n--- INVENTORY STATUS ---")
        c.execute('''
            SELECT b.grade, SUM(i.current_ml), ROUND(AVG(i.quality_pct),1),
                   ROUND(AVG(i.days_stored),0)
            FROM inventory i JOIN batches b ON i.batch_id = b.id
            GROUP BY b.grade
        ''')
        total_inventory = 0
        for grade, ml, quality, days in c.fetchall():
            total_inventory += ml
            alert = " ⚠ SELL SOON" if quality < 95 else ""
            print(f"  {grade:10s}: {ml:7.0f} ml  quality: {quality}%  avg age: {days:.0f}d{alert}")
        print(f"  {'TOTAL':10s}: {total_inventory:7.0f} ml")

        # Market outlook
        print("\\\n--- MARKET OUTLOOK (next 3 months) ---")
        c.execute("SELECT month, price_per_ml, demand_level FROM market WHERE month >= '2025-01' LIMIT 3")
        for month, price, demand in c.fetchall():
            signal = "SELL" if demand == 'High' else ("HOLD" if demand == 'Medium' else "WAIT")
            print(f"  {month}: Rs {price:.0f}/ml  Demand: {demand:6s}  Signal: {signal}")

        # Revenue projection
        print("\\\n--- REVENUE PROJECTION ---")
        c.execute('''
            SELECT b.grade, SUM(i.current_ml) as stock
            FROM inventory i JOIN batches b ON i.batch_id = b.id
            GROUP BY b.grade
        ''')
        grade_prices = {'Premium': 3500, 'Standard': 2500, 'Basic': 1500}
        total_rev = 0
        for grade, stock in c.fetchall():
            rev = stock * grade_prices.get(grade, 1500)
            total_rev += rev
            print(f"  {grade:10s}: {stock:.0f} ml × Rs {grade_prices.get(grade,1500)} = Rs {rev:,.0f}")
        print(f"  {'TOTAL':10s}: Rs {total_rev:,.0f}")

        # Blending opportunity
        print("\\\n--- BLENDING OPPORTUNITIES ---")
        c.execute('''
            SELECT b.id, b.cineole, b.ta, b.grade, i.current_ml
            FROM batches b JOIN inventory i ON b.id = i.batch_id
            WHERE b.grade = 'Basic' AND i.current_ml > 50
        ''')
        basic_batches = c.fetchall()
        c.execute('''
            SELECT b.id, b.cineole, b.ta, i.current_ml
            FROM batches b JOIN inventory i ON b.id = i.batch_id
            WHERE b.grade = 'Premium' AND i.current_ml > 50
        ''')
        premium_batches = c.fetchall()

        if basic_batches and premium_batches:
            bb = basic_batches[0]
            pb = premium_batches[0]
            # 50-50 blend
            blend_cin = (bb[1] + pb[1]) / 2
            blend_ta = (bb[2] + pb[2]) / 2
            blend_grade = 'Standard' if blend_cin > 25 and blend_ta > 20 else 'Basic'
            basic_val = bb[4] * 1500
            premium_val = pb[3] * 3500
            blend_val = (bb[4] + pb[3]) * 2500
            uplift = blend_val - basic_val - premium_val
            print(f"  Blend batch #{bb[0]} (Basic) + #{pb[0]} (Premium) → {blend_grade}")
            print(f"  Result: Cin {blend_cin:.1f}%, TA {blend_ta:.1f}%")
            print(f"  Value uplift: Rs {uplift:+,.0f}")

        # Recommendations
        print("\\\n--- RECOMMENDATIONS ---")
        print("  1. Sell Premium inventory NOW (demand peaks in Q4)")
        print("  2. Blend Basic batches #4,#5 with Premium #2 for ISO Standard")
        print("  3. Lhamo Highland farm: invest in expansion (best quality)")
        print("  4. Valley Coop: switch to organic certification (price premium)")
        print("  5. Store remaining inventory sealed, dark, <25°C")
        print("=" * 65)

ks = CardamomKnowledgeSystem()
ks.dashboard()`,
      challenge: 'Add a "what-if" method: if Lhamo Highland doubles its area (from 1.5 to 3 ha), recalculate total premium oil production and revenue. Is the expansion worth the investment?',
      successHint: 'You have built a complete agricultural knowledge system — the capstone of this organic chemistry journey. From molecular analysis to market intelligence, from farm data to buyer traceability, this system transforms Sikkim\'s traditional cardamom industry into a data-driven enterprise. The fragrant hills of the story now have the tools to thrive in the modern economy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Essential oil quality management with databases</span>
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
