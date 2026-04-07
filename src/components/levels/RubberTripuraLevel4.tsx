import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RubberTripuraLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Rubber formulation database',
      concept: `A rubber formulation is a recipe — specifying the type and amount of every ingredient:
- **Base polymer**: NR, SBR, or blends
- **Vulcanising agent**: sulphur (1-30 phr)
- **Accelerators**: speed up vulcanisation (MBTS, CBS)
- **Fillers**: reinforce (carbon black, silica) or reduce cost (clay, chalk)
- **Plasticisers**: soften (oils, waxes)
- **Antioxidants**: prevent ageing

Amounts are in **phr** (parts per hundred rubber) — a standard unit in the rubber industry.

A database of formulations lets engineers:
- Compare recipes for different applications
- Track which formulations passed/failed quality tests
- Optimise by querying for desired property ranges

📚 *We will create a formulation database in SQLite and populate it with realistic rubber recipes.*`,
      analogy: 'A rubber formulation is like a cooking recipe. The base polymer is the flour, sulphur is the yeast, fillers are bulk ingredients, and accelerators are the baking powder. Small changes in the recipe create very different final products.',
      storyConnection: 'Tripura\'s rubber goes into thousands of different products, each requiring a different formulation. A database connecting rubber grade to optimal formulation helps manufacturers get the best value from Tripura\'s natural rubber.',
      checkQuestion: 'If a formulation uses 100 phr NR, 5 phr sulphur, 50 phr carbon black, and 10 phr oil, what percentage of the final product is actual rubber?',
      checkAnswer: 'Total = 100 + 5 + 50 + 10 = 165 phr. Rubber fraction = 100/165 = 60.6%. Only about 60% of a tyre is rubber — the rest is fillers, sulphur, and processing aids.',
      codeIntro: 'Create a rubber formulation database with recipes for different applications.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE formulations (
    id INTEGER PRIMARY KEY, name TEXT, application TEXT,
    polymer_type TEXT, polymer_phr REAL
);
CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formulation_id INTEGER REFERENCES formulations(id),
    ingredient TEXT, category TEXT, amount_phr REAL
);
CREATE TABLE test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formulation_id INTEGER REFERENCES formulations(id),
    property TEXT, value REAL, unit TEXT, pass INTEGER
);
''')

# Formulations
formulations = [
    (1, 'Tyre Tread', 'Automotive tyres', 'NR/SBR blend', 100),
    (2, 'Surgical Glove', 'Medical gloves', 'NR', 100),
    (3, 'Engine Mount', 'Vibration damping', 'NR', 100),
    (4, 'Shoe Sole', 'Footwear', 'SBR', 100),
    (5, 'Conveyor Belt', 'Industrial', 'NR/BR blend', 100),
    (6, 'Seal/Gasket', 'Fluid sealing', 'Nitrile', 100),
]
cur.executemany('INSERT INTO formulations VALUES (?,?,?,?,?)', formulations)

# Ingredients for each formulation
ingredients_data = [
    # Tyre tread
    (1, 'Sulphur', 'vulcaniser', 2.5), (1, 'CBS accelerator', 'accelerator', 1.5),
    (1, 'Carbon black N330', 'filler', 55), (1, 'Process oil', 'plasticiser', 10),
    (1, 'ZnO', 'activator', 5), (1, 'Stearic acid', 'activator', 2),
    (1, 'Antioxidant 6PPD', 'antioxidant', 2),
    # Surgical glove
    (2, 'Sulphur', 'vulcaniser', 1.0), (2, 'ZDEC accelerator', 'accelerator', 0.8),
    (2, 'ZnO', 'activator', 1), (2, 'Antioxidant', 'antioxidant', 0.5),
    # Engine mount
    (3, 'Sulphur', 'vulcaniser', 2.0), (3, 'MBTS accelerator', 'accelerator', 1.0),
    (3, 'Carbon black N660', 'filler', 40), (3, 'Process oil', 'plasticiser', 5),
    (3, 'ZnO', 'activator', 5), (3, 'Stearic acid', 'activator', 1),
    # Shoe sole
    (4, 'Sulphur', 'vulcaniser', 2.0), (4, 'CBS accelerator', 'accelerator', 1.2),
    (4, 'Silica', 'filler', 35), (4, 'Silane coupling', 'additive', 3),
    (4, 'ZnO', 'activator', 3), (4, 'Wax', 'antiozonant', 1.5),
    # Conveyor belt
    (5, 'Sulphur', 'vulcaniser', 2.8), (5, 'MBTS accelerator', 'accelerator', 1.0),
    (5, 'Carbon black N550', 'filler', 50), (5, 'Process oil', 'plasticiser', 8),
    (5, 'ZnO', 'activator', 5),
    # Seal
    (6, 'Sulphur', 'vulcaniser', 1.5), (6, 'TMTD accelerator', 'accelerator', 1.0),
    (6, 'Carbon black N770', 'filler', 30), (6, 'DOP plasticiser', 'plasticiser', 15),
]
cur.executemany('INSERT INTO ingredients (formulation_id, ingredient, category, amount_phr) VALUES (?,?,?,?)',
                ingredients_data)

# Test results
test_data = [
    (1, 'tensile_strength', 22, 'MPa', 1), (1, 'elongation', 450, '%', 1),
    (1, 'hardness', 65, 'Shore A', 1), (1, 'abrasion_loss', 80, 'mm³', 1),
    (2, 'tensile_strength', 28, 'MPa', 1), (2, 'elongation', 750, '%', 1),
    (2, 'hardness', 30, 'Shore A', 1), (2, 'protein_content', 0.1, 'mg/g', 1),
    (3, 'tensile_strength', 18, 'MPa', 1), (3, 'elongation', 500, '%', 1),
    (3, 'hardness', 50, 'Shore A', 1), (3, 'damping', 0.15, 'tan_delta', 1),
    (4, 'tensile_strength', 15, 'MPa', 1), (4, 'abrasion_loss', 60, 'mm³', 1),
    (5, 'tensile_strength', 20, 'MPa', 1), (5, 'tear_strength', 45, 'kN/m', 1),
    (6, 'oil_swell', 5, '%', 1), (6, 'hardness', 60, 'Shore A', 1),
]
cur.executemany('INSERT INTO test_results (formulation_id, property, value, unit, pass) VALUES (?,?,?,?,?)', test_data)
db.commit()

# Display
print("RUBBER FORMULATION DATABASE")
print("=" * 65)
for f in cur.execute('SELECT * FROM formulations'):
    print(f"\\n[{f[0]}] {f[1]} ({f[3]})")
    print(f"    Application: {f[2]}")
    total_phr = f[4]
    for ing in cur.execute('SELECT ingredient, category, amount_phr FROM ingredients WHERE formulation_id=? ORDER BY amount_phr DESC', (f[0],)):
        total_phr += ing[2]
        print(f"    + {ing[0]:<25s} ({ing[1]:<12s}): {ing[2]:>5.1f} phr")
    print(f"    Total: {total_phr:.0f} phr | Rubber content: {100/total_phr*100:.0f}%")`,
      challenge: 'Write a query to find which formulation has the highest filler content (total phr of filler category). Why do some applications need more filler than others?',
      successHint: 'A formulation database is the backbone of rubber product development. Every tyre, glove, and seal starts as a recipe in a database like this.',
    },
    {
      title: 'Property prediction from formulation',
      concept: `Given a formulation, can we **predict** the resulting properties without actually making and testing the rubber? This is the holy grail of materials science.

Empirical models relate formulation to properties:
- **Tensile strength** ≈ base_strength × (1 + 0.01 × filler_phr) × cure_factor
- **Hardness** ≈ base_hardness + 0.5 × filler_phr + 2 × sulphur_phr
- **Elongation** ≈ base_elongation / (1 + 0.005 × filler_phr) × (1 + 0.1 × oil_phr)

These are simplified — real models use machine learning trained on thousands of test results. But even simple models save time and money by narrowing the search space.

📚 *We will build prediction models, compare them against test data, and identify the best formulation for a target application.*`,
      analogy: 'A experienced chef can predict how a dish will taste from its ingredients. These prediction models do the same for rubber — estimating final properties from the recipe without having to cook (vulcanise) every batch.',
      storyConnection: 'For Tripura\'s rubber industry, prediction models mean fewer failed batches, less wasted rubber, and faster development of new products. A farmer\'s rubber reaches the right product faster.',
      checkQuestion: 'If adding 10 phr of carbon black increases hardness by 5 Shore A, how much carbon black is needed to go from 40 to 65 Shore A?',
      checkAnswer: 'Need 25 Shore A increase. At 5 per 10 phr, need 25/5 × 10 = 50 phr of carbon black. This is a typical amount for tyre rubber — about one-third of the total compound by weight.',
      codeIntro: 'Build property prediction models and find optimal formulations.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE formulations (id INTEGER PRIMARY KEY, name TEXT, polymer TEXT);
CREATE TABLE ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER, name TEXT, category TEXT, phr REAL);
CREATE TABLE predictions (id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER, property TEXT, predicted REAL, unit TEXT);
''')

# Test formulations
forms = [
    (1, 'Soft compound', 'NR'), (2, 'Medium compound', 'NR'),
    (3, 'Hard compound', 'NR'), (4, 'High-stretch', 'NR'),
    (5, 'Oil-resistant', 'NBR'), (6, 'Heat-resistant', 'EPDM'),
]
cur.executemany('INSERT INTO formulations VALUES (?,?,?)', forms)

recipes = [
    (1, 'sulphur', 'cure', 1.5), (1, 'carbon_black', 'filler', 20), (1, 'oil', 'plast', 15),
    (2, 'sulphur', 'cure', 2.5), (2, 'carbon_black', 'filler', 45), (2, 'oil', 'plast', 8),
    (3, 'sulphur', 'cure', 4.0), (3, 'carbon_black', 'filler', 70), (3, 'oil', 'plast', 3),
    (4, 'sulphur', 'cure', 1.0), (4, 'carbon_black', 'filler', 10), (4, 'oil', 'plast', 20),
    (5, 'sulphur', 'cure', 2.0), (5, 'carbon_black', 'filler', 40), (5, 'DOP', 'plast', 10),
    (6, 'peroxide', 'cure', 3.0), (6, 'silica', 'filler', 35), (6, 'oil', 'plast', 5),
]
cur.executemany('INSERT INTO ingredients (form_id,name,category,phr) VALUES (?,?,?,?)', recipes)
db.commit()

# Prediction models
def predict_properties(form_id, cur):
    sulphur = cur.execute("SELECT COALESCE(SUM(phr),0) FROM ingredients WHERE form_id=? AND category='cure'", (form_id,)).fetchone()[0]
    filler = cur.execute("SELECT COALESCE(SUM(phr),0) FROM ingredients WHERE form_id=? AND category='filler'", (form_id,)).fetchone()[0]
    plast = cur.execute("SELECT COALESCE(SUM(phr),0) FROM ingredients WHERE form_id=? AND category='plast'", (form_id,)).fetchone()[0]
    polymer = cur.execute("SELECT polymer FROM formulations WHERE id=?", (form_id,)).fetchone()[0]

    # Base properties by polymer
    bases = {'NR': (25, 700, 35), 'NBR': (20, 500, 40), 'EPDM': (18, 550, 38)}
    base_ts, base_elong, base_hard = bases.get(polymer, (20, 600, 35))

    # Predictions
    tensile = base_ts * (1 + 0.008 * filler) * (1 + 0.05 * sulphur) / (1 + 0.01 * plast)
    elongation = base_elong / (1 + 0.006 * filler) * (1 + 0.008 * plast) / (1 + 0.08 * sulphur)
    hardness = base_hard + 0.45 * filler + 2 * sulphur - 0.3 * plast
    modulus = 0.5 + 0.03 * filler + 0.2 * sulphur

    return {
        'tensile_MPa': round(tensile, 1),
        'elongation_%': round(elongation, 0),
        'hardness_ShA': round(hardness, 0),
        'modulus_MPa': round(modulus, 2),
    }

print("PROPERTY PREDICTIONS FROM FORMULATION")
print("=" * 75)
print(f"{'Name':<18} {'Polymer':<6} {'Tensile':>8} {'Elong%':>7} {'Hard':>5} {'Mod':>6}")
print("-" * 75)

for f in cur.execute('SELECT id, name, polymer FROM formulations'):
    props = predict_properties(f[0], cur)
    print(f"{f[1]:<18} {f[2]:<6} {props['tensile_MPa']:>7.1f} {props['elongation_%']:>6.0f} "
          f"{props['hardness_ShA']:>5.0f} {props['modulus_MPa']:>6.2f}")

    for prop, val in props.items():
        unit = prop.split('_')[1]
        cur.execute('INSERT INTO predictions (form_id,property,predicted,unit) VALUES (?,?,?,?)',
                    (f[0], prop.split('_')[0], val, unit))

db.commit()

# Find best formulation for a target
print("\\nFIND BEST FOR TARGET: hardness=60±5, elongation>400%")
print("-" * 60)
for f in cur.execute('SELECT id, name FROM formulations'):
    props = predict_properties(f[0], cur)
    if 55 <= props['hardness_ShA'] <= 65 and props['elongation_%'] > 400:
        print(f"  MATCH: {f[1]} — hardness={props['hardness_ShA']}, elong={props['elongation_%']}%")`,
      challenge: 'Add a cost column (price per phr for each ingredient) and find the cheapest formulation that meets: tensile > 18 MPa, hardness 50-70 Shore A, elongation > 400%.',
      successHint: 'Property prediction transforms rubber development from trial-and-error into intelligent design. Each formulation is a point in a multi-dimensional space — the models map this space.',
    },
    {
      title: 'Rubber blend optimisation algorithm',
      concept: `Most rubber products use **blends** of two or more polymers. Blending combines the strengths of each:
- NR + SBR: NR\'s resilience + SBR\'s abrasion resistance
- NR + BR: NR\'s strength + BR\'s low-temperature flexibility

The properties of a blend are not simply the average of the components. The relationship depends on **compatibility** and **morphology**:

For compatible blends: \`P_blend ≈ f₁P₁ + f₂P₂\` (linear rule of mixtures)
For incompatible: properties can be worse than either component alone

The optimisation problem: find the blend ratio that maximises an objective function (weighted sum of desired properties) subject to constraints (minimum requirements).

📚 *We will implement a blend optimisation algorithm using systematic search and store results in a database.*`,
      analogy: 'Blending rubber is like mixing paint colours — blue + yellow = green, but the exact shade depends on the ratio. Some combinations produce beautiful colours; others make muddy brown. The art is finding the perfect ratio.',
      storyConnection: 'Tripura\'s natural rubber is often blended with synthetic rubbers for tyre manufacturing. The optimal NR:SBR ratio for a car tyre is about 60:40 — enough NR for grip and resilience, enough SBR for wear resistance. Optimisation algorithms find this balance.',
      checkQuestion: 'If NR has tensile strength 25 MPa and SBR has 18 MPa, what is the expected tensile strength of a 70:30 NR:SBR blend?',
      checkAnswer: 'Using the rule of mixtures: 0.7 × 25 + 0.3 × 18 = 17.5 + 5.4 = 22.9 MPa. This assumes the blend is compatible — the actual value might be slightly different.',
      codeIntro: 'Optimise a rubber blend ratio for a target application using systematic search.',
      code: `import numpy as np
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE polymers (id INTEGER PRIMARY KEY, name TEXT,
    tensile REAL, elongation REAL, hardness REAL,
    abrasion REAL, resilience REAL, cost_per_kg REAL);
CREATE TABLE blend_results (id INTEGER PRIMARY KEY AUTOINCREMENT,
    nr_frac REAL, sbr_frac REAL, br_frac REAL,
    tensile REAL, elongation REAL, hardness REAL,
    abrasion REAL, resilience REAL, cost REAL, score REAL);
''')

# Polymer properties
polymers = [
    (1, 'NR',  25, 700, 40, 80, 75, 180),
    (2, 'SBR', 18, 500, 50, 60, 55, 140),
    (3, 'BR',  12, 600, 35, 45, 85, 160),
]
cur.executemany('INSERT INTO polymers VALUES (?,?,?,?,?,?,?,?)', polymers)
db.commit()

# Target: car tyre tread
# Weights for each property (higher = more important)
weights = {'tensile': 0.20, 'elongation': 0.10, 'hardness': 0.15,
           'abrasion': 0.25, 'resilience': 0.20, 'cost': 0.10}

# Constraints
constraints = {'tensile': (18, None), 'elongation': (400, None),
               'hardness': (45, 65), 'abrasion': (None, 75)}

# Fetch polymer data
nr = cur.execute('SELECT * FROM polymers WHERE name="NR"').fetchone()
sbr = cur.execute('SELECT * FROM polymers WHERE name="SBR"').fetchone()
br = cur.execute('SELECT * FROM polymers WHERE name="BR"').fetchone()

best_score = -1
best_blend = None

# Systematic search over blend ratios (10% increments)
for nr_pct in range(0, 101, 10):
    for sbr_pct in range(0, 101 - nr_pct, 10):
        br_pct = 100 - nr_pct - sbr_pct
        f_nr, f_sbr, f_br = nr_pct/100, sbr_pct/100, br_pct/100

        # Rule of mixtures with synergy correction
        props = {
            'tensile': f_nr*nr[2] + f_sbr*sbr[2] + f_br*br[2],
            'elongation': f_nr*nr[3] + f_sbr*sbr[3] + f_br*br[3],
            'hardness': f_nr*nr[4] + f_sbr*sbr[4] + f_br*br[4],
            'abrasion': f_nr*nr[5] + f_sbr*sbr[5] + f_br*br[5],
            'resilience': f_nr*nr[6] + f_sbr*sbr[6] + f_br*br[6],
            'cost': f_nr*nr[7] + f_sbr*sbr[7] + f_br*br[7],
        }

        # Check constraints
        valid = True
        for prop, (lo, hi) in constraints.items():
            if lo and props[prop] < lo: valid = False
            if hi and props[prop] > hi: valid = False

        # Score (normalise each property 0-1 and weight)
        norms = {'tensile': 25, 'elongation': 700, 'hardness': 60,
                 'abrasion': 45, 'resilience': 85, 'cost': 140}
        score = sum(weights[k] * props[k] / norms[k] for k in weights if k != 'cost')
        score -= weights['cost'] * props['cost'] / 200  # lower cost = better

        if valid:
            score *= 1.0  # bonus for meeting constraints
        else:
            score *= 0.5  # penalty

        cur.execute('INSERT INTO blend_results (nr_frac,sbr_frac,br_frac,tensile,elongation,hardness,abrasion,resilience,cost,score) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    (f_nr, f_sbr, f_br, props['tensile'], props['elongation'],
                     props['hardness'], props['abrasion'], props['resilience'],
                     props['cost'], round(score, 4)))

        if valid and score > best_score:
            best_score = score
            best_blend = (nr_pct, sbr_pct, br_pct, props, score)

db.commit()

# Results
print("TOP 5 BLEND FORMULATIONS (car tyre tread)")
print("=" * 75)
print(f"{'NR%':>4} {'SBR%':>5} {'BR%':>4} | {'Tens':>5} {'Elong':>6} {'Hard':>5} {'Abr':>4} {'Res':>4} {'₹/kg':>5} | {'Score':>6}")
print("-" * 75)
for r in cur.execute('SELECT nr_frac,sbr_frac,br_frac,tensile,elongation,hardness,abrasion,resilience,cost,score FROM blend_results ORDER BY score DESC LIMIT 5'):
    print(f"{r[0]*100:>3.0f}% {r[1]*100:>4.0f}% {r[2]*100:>3.0f}% | {r[3]:>5.1f} {r[4]:>6.0f} {r[5]:>5.0f} {r[6]:>4.0f} {r[7]:>4.0f} {r[8]:>5.0f} | {r[9]:>6.4f}")

if best_blend:
    print(f"\\nOPTIMAL: {best_blend[0]}% NR + {best_blend[1]}% SBR + {best_blend[2]}% BR")
    print(f"Score: {best_blend[4]:.4f}")`,
      challenge: 'Add a non-linear synergy term: NR+BR blends get a 10% resilience bonus (they are highly compatible). How does this change the optimal blend?',
      successHint: 'Blend optimisation is a real industrial problem. The algorithm explores hundreds of combinations to find what would take months of laboratory trial-and-error.',
    },
    {
      title: 'Rubber product lifecycle tracker',
      concept: `The final project combines everything into a **complete rubber product lifecycle system**:

1. **Formulation**: recipe design with property prediction
2. **Processing**: cure curve optimisation
3. **Testing**: quality control with pass/fail criteria
4. **Service life**: degradation modelling and warranty prediction
5. **Sustainability**: recycling potential and environmental impact

This mirrors real industrial practice at companies like Bridgestone, Michelin, and Apollo Tyres.

📚 *We will build the complete system using sqlite3, connecting all stages from raw rubber to end-of-life.*`,
      analogy: 'A product lifecycle tracker is like a medical record — it follows a rubber product from birth (formulation) through its working life (service) to retirement (recycling). Every stage generates data that informs the next generation of products.',
      storyConnection: 'This system traces Tripura\'s rubber from tree to tyre to recycling — the complete journey. Understanding the full lifecycle helps maximise the value of every kilogram of rubber that Tripura produces.',
      checkQuestion: 'Why is tracking the full lifecycle important for sustainability?',
      checkAnswer: 'Because sustainability requires understanding impacts at EVERY stage — growing (land use, water), processing (energy, chemicals), use (emissions from tyres), and end-of-life (landfill vs recycling). Optimising one stage while ignoring others can increase total environmental impact.',
      codeIntro: 'Build a complete rubber product lifecycle management system.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE products (
    id INTEGER PRIMARY KEY, name TEXT, application TEXT,
    nr_fraction REAL, production_date TEXT, status TEXT
);
CREATE TABLE quality_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER, test TEXT, value REAL,
    spec_min REAL, spec_max REAL, pass INTEGER
);
CREATE TABLE service_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER, year INTEGER,
    condition_pct REAL, event TEXT
);
CREATE TABLE sustainability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER, metric TEXT, value REAL, unit TEXT
);
''')

# Products
products = [
    (1, 'Car Tyre P205/55R16', 'Passenger tyre', 0.6, '2024-01-15', 'In service'),
    (2, 'Surgical Glove Batch T-2024', 'Medical', 1.0, '2024-03-01', 'In service'),
    (3, 'Engine Mount EM-450', 'Automotive', 0.8, '2023-06-10', 'In service'),
    (4, 'Conveyor Belt CB-12m', 'Mining', 0.7, '2022-09-20', 'In service'),
]
cur.executemany('INSERT INTO products VALUES (?,?,?,?,?,?)', products)

# Quality tests
tests = [
    (1, 'tensile_strength', 22.5, 18, None, 1), (1, 'elongation', 480, 400, None, 1),
    (1, 'hardness', 62, 55, 70, 1), (1, 'abrasion', 68, None, 80, 1),
    (2, 'tensile_strength', 28, 24, None, 1), (2, 'protein', 0.08, None, 0.2, 1),
    (2, 'sterility', 0, None, 0, 1), (2, 'elongation', 750, 600, None, 1),
    (3, 'damping', 0.15, 0.10, 0.25, 1), (3, 'compression_set', 18, None, 30, 1),
    (4, 'tear_strength', 48, 40, None, 1), (4, 'abrasion', 55, None, 70, 1),
]
cur.executemany('INSERT INTO quality_tests (product_id,test,value,spec_min,spec_max,pass) VALUES (?,?,?,?,?,?)', tests)

# Service life simulation
np.random.seed(42)
for pid in [1, 2, 3, 4]:
    condition = 100.0
    base_rate = [3.5, 15, 2.0, 4.0][pid-1]  # degradation rate per year
    for year in range(2024, 2035):
        degradation = base_rate * (1 + np.random.normal(0, 0.2))
        condition = max(0, condition - degradation)
        event = ''
        if condition < 30: event = 'REPLACE NEEDED'
        elif condition < 50: event = 'Inspection due'
        cur.execute('INSERT INTO service_log (product_id,year,condition_pct,event) VALUES (?,?,?,?)',
                    (pid, year, round(condition, 1), event))

# Sustainability metrics
sus_data = [
    (1, 'CO2_production', 35, 'kg'), (1, 'CO2_use_phase', 120, 'kg'),
    (1, 'recyclable_fraction', 80, '%'), (1, 'water_use', 200, 'L'),
    (1, 'NR_from_Tripura', 60, '%'), (1, 'lifetime_km', 60000, 'km'),
    (2, 'CO2_production', 0.5, 'kg'), (2, 'uses_before_disposal', 1, 'count'),
    (2, 'biodegradable', 90, '%'), (2, 'NR_from_Tripura', 100, '%'),
    (3, 'CO2_production', 8, 'kg'), (3, 'expected_life', 15, 'years'),
    (3, 'NR_from_Tripura', 80, '%'),
    (4, 'CO2_production', 150, 'kg'), (4, 'expected_life', 10, 'years'),
    (4, 'tonnes_carried', 50000, 'tonnes'), (4, 'NR_from_Tripura', 70, '%'),
]
cur.executemany('INSERT INTO sustainability (product_id,metric,value,unit) VALUES (?,?,?,?)', sus_data)
db.commit()

# REPORTS
print("RUBBER PRODUCT LIFECYCLE REPORT")
print("=" * 70)

for p in cur.execute('SELECT * FROM products'):
    print(f"\\n{'='*70}")
    print(f"PRODUCT: {p[1]} ({p[3]*100:.0f}% NR)")
    print(f"Application: {p[2]} | Produced: {p[4]} | Status: {p[5]}")

    # Quality
    tests = cur.execute('SELECT test, value, spec_min, spec_max, pass FROM quality_tests WHERE product_id=?', (p[0],)).fetchall()
    if tests:
        print(f"  Quality: {sum(t[4] for t in tests)}/{len(tests)} tests passed")
        for t in tests:
            spec = f"{t[2] or ''}-{t[3] or ''}"
            status = "PASS" if t[4] else "FAIL"
            print(f"    {t[0]:20s}: {t[1]:>8.2f} (spec: {spec}) [{status}]")

    # Current condition
    latest = cur.execute('SELECT year, condition_pct, event FROM service_log WHERE product_id=? ORDER BY year DESC LIMIT 1', (p[0],)).fetchone()
    if latest:
        print(f"  Condition ({latest[0]}): {latest[1]:.0f}% {'— ' + latest[2] if latest[2] else ''}")

    # Sustainability
    print(f"  Sustainability:")
    for s in cur.execute('SELECT metric, value, unit FROM sustainability WHERE product_id=?', (p[0],)):
        print(f"    {s[0]:25s}: {s[1]:>8.1f} {s[2]}")

# Summary
print(f"\\n{'='*70}")
print("FLEET SUMMARY")
total_nr = cur.execute("SELECT SUM(nr_fraction) FROM products").fetchone()[0]
print(f"Products tracked: {cur.execute('SELECT COUNT(*) FROM products').fetchone()[0]}")
print(f"Average NR content: {total_nr/4*100:.0f}%")
critical = cur.execute("SELECT COUNT(*) FROM service_log WHERE event='REPLACE NEEDED'").fetchone()[0]
print(f"Products needing replacement: {critical}")
tripura_avg = cur.execute("SELECT AVG(value) FROM sustainability WHERE metric='NR_from_Tripura'").fetchone()[0]
print(f"Average Tripura NR sourcing: {tripura_avg:.0f}%")`,
      challenge: 'Add a cost-benefit analysis: calculate the total lifetime value of each product (revenue generated minus production cost minus disposal cost). Which product has the best return?',
      successHint: 'You have built a complete product lifecycle system — from formulation through service to sustainability assessment. This is how modern materials companies manage their products, and it all started with a rubber tree in Tripura.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Rubber Product Lifecycle System</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
