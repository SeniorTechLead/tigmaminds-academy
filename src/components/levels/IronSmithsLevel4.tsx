import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IronSmithsLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Alloy composition database',
      concept: `A materials database stores compositions, processing parameters, and resulting properties for thousands of alloy variants. The schema links:

- **alloys**: composition (element percentages), processing route
- **properties**: measured mechanical, thermal, and chemical properties
- **heat_treatments**: temperature profiles (heating rate, hold time, cooling method)
- **tests**: individual test results with measurement uncertainty

This is a **materials informatics** database — the foundation of modern data-driven materials design. Instead of trial-and-error, engineers query the database: "Find me an alloy with yield strength > 800 MPa, corrosion resistance > 0.7, and cost < $5/kg."

📚 *SQL's WHERE clause with multiple conditions filters data precisely. Combining JOIN, WHERE, and ORDER BY creates powerful material selection queries.*`,
      analogy: 'A materials database is like a cookbook index on steroids. Instead of searching by ingredient (element), you can search by result: "Show me all recipes (alloys) that produce a dish (material) that is crunchy (hard), not too dry (ductile enough), and uses cheap ingredients." The database knows every recipe ever tried and every result ever measured.',
      storyConnection: 'The Lushai smiths\' knowledge was an oral database — recipes passed from master to apprentice. "Use charcoal from sal wood, heat until cherry red, quench in cold river water." Modern materials databases digitize this knowledge, making it searchable, shareable, and extensible. The traditional knowledge is no less valid — just stored differently.',
      checkQuestion: 'Why is a relational database better than a spreadsheet for materials data?',
      checkAnswer: 'Spreadsheets cannot enforce relationships (e.g., every test must link to a valid alloy), handle many-to-many relationships (one alloy can have many tests; one test method applies to many alloys), or efficiently query across large datasets. A database with proper schema ensures data integrity and enables complex queries.',
      codeIntro: 'Build a comprehensive alloy database with composition, processing, and property tracking.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE alloys (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    carbon_pct REAL, chromium_pct REAL, nickel_pct REAL,
    manganese_pct REAL, silicon_pct REAL,
    category TEXT, cost_per_kg REAL
);

CREATE TABLE heat_treatments (
    id INTEGER PRIMARY KEY,
    alloy_id INTEGER REFERENCES alloys(id),
    austenitize_temp INTEGER, hold_min INTEGER,
    cooling_method TEXT, temper_temp INTEGER
);

CREATE TABLE properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    treatment_id INTEGER REFERENCES heat_treatments(id),
    yield_strength REAL, uts REAL, elongation REAL,
    hardness_hv REAL, toughness_j REAL, corrosion_rate REAL
);
''')

# Populate with realistic steel data
alloys = [
    (1, 'AISI 1020', 0.20, 0, 0, 0.8, 0.2, 'mild', 0.8),
    (2, 'AISI 1045', 0.45, 0, 0, 0.7, 0.2, 'medium_carbon', 0.9),
    (3, 'AISI 1080', 0.80, 0, 0, 0.8, 0.2, 'high_carbon', 1.0),
    (4, 'AISI 4140', 0.40, 1.0, 0, 0.9, 0.2, 'alloy', 1.5),
    (5, 'AISI 304', 0.08, 18.0, 8.0, 2.0, 0.75, 'stainless', 3.5),
    (6, 'AISI D2', 1.50, 12.0, 0, 0.3, 0.3, 'tool', 5.0),
    (7, 'AISI W1', 1.00, 0, 0, 0.3, 0.2, 'tool', 2.0),
    (8, 'Lushai Iron', 0.35, 0, 0, 0.1, 0.5, 'traditional', 0.5),
]
c.executemany('INSERT INTO alloys VALUES (?,?,?,?,?,?,?,?,?)', alloys)

# Generate heat treatments and properties
treatments = [
    ('annealed', 850, 60, 'furnace_cool', 0),
    ('normalized', 870, 30, 'air_cool', 0),
    ('quenched', 850, 30, 'water_quench', 0),
    ('Q&T_low', 850, 30, 'oil_quench', 200),
    ('Q&T_high', 850, 30, 'oil_quench', 500),
]

tid = 1
for alloy in alloys:
    aid = alloy[0]
    C = alloy[2]
    Cr = alloy[3]

    for name, aust, hold, cool, temper in treatments:
        c.execute('INSERT INTO heat_treatments VALUES (?,?,?,?,?,?)',
                  (tid, aid, aust, hold, cool, temper))

        # Calculate approximate properties
        base_ys = 200 + 600 * C + 50 * Cr
        if 'quench' in cool:
            ys = base_ys * 2.5 * (1 - temper/1000)
            elong = max(2, 30 - 25 * C * (1 - temper/800))
            hv = 200 + 800 * C * (1 - temper/1000)
        elif cool == 'air_cool':
            ys = base_ys * 1.3
            elong = max(10, 35 - 20 * C)
            hv = 150 + 300 * C
        else:
            ys = base_ys
            elong = max(15, 40 - 20 * C)
            hv = 100 + 200 * C

        uts = ys * 1.3
        tough = max(5, 100 - hv * 0.1)
        corr = 0.3 - 0.015 * Cr + random.gauss(0, 0.02)

        c.execute('INSERT INTO properties (treatment_id, yield_strength, uts, elongation, hardness_hv, toughness_j, corrosion_rate) VALUES (?,?,?,?,?,?,?)',
                  (tid, round(ys), round(uts), round(elong,1), round(hv), round(tough,1), round(max(corr, 0.01), 3)))
        tid += 1

conn.commit()

print("ALLOY DATABASE — QUERY RESULTS")
print("=" * 70)

# Query: Best alloy for a blade (high hardness + adequate toughness)
print("\\\nBest blade steel (HV > 500, toughness > 15J):")
print(f"{'Alloy':<15} {'Treatment':<15} {'HV':>5} {'Tough':>6} {'YS':>6} {'Cost':>5}")
print("-" * 55)
for row in c.execute('''
    SELECT a.name, h.cooling_method, p.hardness_hv, p.toughness_j, p.yield_strength, a.cost_per_kg
    FROM properties p
    JOIN heat_treatments h ON p.treatment_id = h.id
    JOIN alloys a ON h.alloy_id = a.id
    WHERE p.hardness_hv > 500 AND p.toughness_j > 15
    ORDER BY p.hardness_hv DESC LIMIT 5
'''):
    print(f"{row[0]:<15} {row[1]:<15} {row[2]:>5.0f} {row[3]:>6.1f} {row[4]:>6.0f} \${row[5]:.1f}")

# Compare Lushai iron to modern steels
print("\\\nLushai Iron vs Modern Steels (quenched):")
for row in c.execute('''
    SELECT a.name, p.hardness_hv, p.yield_strength, p.elongation, a.cost_per_kg
    FROM properties p JOIN heat_treatments h ON p.treatment_id=h.id JOIN alloys a ON h.alloy_id=a.id
    WHERE h.cooling_method = 'water_quench'
    ORDER BY a.cost_per_kg
'''):
    print(f"  {row[0]:<15}: HV={row[1]:.0f}, YS={row[2]:.0f} MPa, Elong={row[3]:.1f}%, \${row[4]:.1f}/kg")

conn.close()`,
      challenge: 'Add a "material selection" query: find the cheapest alloy that meets ALL of these requirements simultaneously: yield strength > 600 MPa, elongation > 10%, and corrosion rate < 0.1 mm/year. What is the optimal heat treatment?',
      successHint: 'You built a materials informatics database — the same technology used by aerospace companies, automotive manufacturers, and research labs to design new materials. Data-driven materials selection is faster and more reliable than trial-and-error.',
    },
    {
      title: 'Heat treatment optimizer',
      concept: `Given an alloy composition, what is the optimal heat treatment? This is an **optimization problem**:

**Objective**: maximize a combined score (e.g., 0.5×hardness + 0.3×toughness + 0.2×corrosion_resistance)
**Variables**: austenitizing temperature, hold time, cooling method, tempering temperature
**Constraints**: temperature limits, time limits, equipment availability

We solve this by:
1. Defining a **fitness function** that scores any heat treatment
2. Using **grid search** to evaluate many combinations
3. Storing results in a database for analysis

This is a simplified version of how modern materials design works — computational optimization replacing trial-and-error.

📚 *Grid search evaluates all combinations of discrete parameter values. While not the most efficient optimization method, it is thorough and easy to parallelize.*`,
      analogy: 'Heat treatment optimization is like finding the perfect baking recipe. Temperature too low → underbaked (soft iron). Too high → burnt (grain growth). Time too short → raw inside (incomplete transformation). Too long → dry and brittle. The optimizer systematically tries every combination of temperature and time to find the sweet spot.',
      storyConnection: 'A Lushai master smith might spend decades perfecting heat treatment for a specific blade type. The optimizer does the same exploration in seconds — but it cannot replace the smith\'s intuition about edge geometry, handle balance, and aesthetic beauty. Computation complements craftsmanship.',
      checkQuestion: 'Why is grid search practical for heat treatment but not for alloy composition optimization?',
      checkAnswer: 'Heat treatment has ~4 parameters with ~10 levels each = 10,000 combinations (tractable). Alloy composition has 20+ elements each with continuous ranges = effectively infinite combinations. For high-dimensional spaces, you need smarter methods: genetic algorithms, Bayesian optimization, or machine learning.',
      codeIntro: 'Build a grid search optimizer for heat treatment parameters.',
      code: `import sqlite3
import random

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE optimization_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aust_temp INTEGER, hold_min INTEGER,
    cooling TEXT, temper_temp INTEGER,
    hardness REAL, toughness REAL, corr_resist REAL,
    fitness REAL
);
''')

# Target alloy: medium carbon steel (0.5% C, like Lushai iron)
carbon = 0.5

def predict_properties(aust_temp, hold_min, cooling, temper_temp):
    """Simplified property prediction model."""
    # Base properties from austenitizing
    if aust_temp < 750:
        hardness = 150 + 200 * carbon
        tough = 60
    elif aust_temp > 1000:
        hardness = 100 + 150 * carbon  # grain growth weakens
        tough = 40
    else:
        hardness = 200 + 500 * carbon
        tough = 50

    # Cooling method effect
    if cooling == 'water':
        hardness *= 2.2
        tough *= 0.4
    elif cooling == 'oil':
        hardness *= 1.8
        tough *= 0.6
    elif cooling == 'air':
        hardness *= 1.2
        tough *= 0.9
    else:  # furnace
        hardness *= 1.0
        tough *= 1.0

    # Hold time effect (grain growth)
    grain_factor = 1 - 0.005 * max(hold_min - 15, 0)
    hardness *= max(grain_factor, 0.7)
    tough *= max(grain_factor, 0.7)

    # Tempering effect
    if temper_temp > 0 and cooling in ['water', 'oil']:
        temper_factor = temper_temp / 700
        hardness *= (1 - 0.4 * temper_factor)
        tough *= (1 + 1.5 * temper_factor)

    corr_resist = 0.3 + random.gauss(0, 0.05)
    return max(hardness, 50), max(tough, 5), max(corr_resist, 0.05)

# Fitness function (weighted score)
def fitness(hardness, toughness, corr_resist):
    # Normalize to 0-100 scale
    h_norm = min(hardness / 10, 100)
    t_norm = min(toughness, 100)
    c_norm = min(corr_resist * 200, 100)
    return 0.5 * h_norm + 0.35 * t_norm + 0.15 * c_norm

# Grid search
aust_temps = range(750, 1050, 25)
hold_times = [5, 10, 15, 20, 30, 45, 60]
cooling_methods = ['water', 'oil', 'air', 'furnace']
temper_temps = [0, 150, 200, 300, 400, 500, 600]

total = len(aust_temps) * len(hold_times) * len(cooling_methods) * len(temper_temps)
count = 0

for at in aust_temps:
    for ht in hold_times:
        for cool in cooling_methods:
            for tt in temper_temps:
                if tt > 0 and cool in ['air', 'furnace']:
                    continue  # tempering only makes sense after quench
                h, t, cr = predict_properties(at, ht, cool, tt)
                f = fitness(h, t, cr)
                c.execute('INSERT INTO optimization_runs (aust_temp, hold_min, cooling, temper_temp, hardness, toughness, corr_resist, fitness) VALUES (?,?,?,?,?,?,?,?)',
                          (at, ht, cool, tt, round(h,1), round(t,1), round(cr,3), round(f,2)))
                count += 1

conn.commit()

print(f"HEAT TREATMENT OPTIMIZER — {count} combinations tested")
print("=" * 70)

# Top 5 results
print("\\nTop 5 heat treatments:")
print(f"{'Aust°C':>7} {'Hold':>5} {'Cool':<8} {'Temper':>7} {'HV':>6} {'Tough':>6} {'Score':>6}")
print("-" * 52)
for row in c.execute('SELECT aust_temp, hold_min, cooling, temper_temp, hardness, toughness, fitness FROM optimization_runs ORDER BY fitness DESC LIMIT 5'):
    print(f"{row[0]:>7} {row[1]:>5} {row[2]:<8} {row[3]:>7} {row[4]:>6.0f} {row[5]:>6.1f} {row[6]:>6.1f}")

# Best by cooling method
print("\\nBest score by cooling method:")
for row in c.execute('SELECT cooling, MAX(fitness), AVG(fitness) FROM optimization_runs GROUP BY cooling ORDER BY 2 DESC'):
    print(f"  {row[0]:<10}: best={row[1]:.1f}, avg={row[2]:.1f}")

# Optimal for specific applications
print("\\nOptimal for blade (hardness priority):")
row = c.execute('SELECT aust_temp, hold_min, cooling, temper_temp, hardness, toughness FROM optimization_runs WHERE toughness > 20 ORDER BY hardness DESC LIMIT 1').fetchone()
print(f"  {row[0]}°C, {row[1]}min, {row[2]}, temper {row[3]}°C → HV={row[4]:.0f}, Tough={row[5]:.1f}")

conn.close()`,
      challenge: 'Change the fitness weights to prioritize toughness over hardness (for a spring application). How does the optimal treatment change? Create a Pareto front showing all non-dominated solutions (no other solution is better in ALL properties simultaneously).',
      successHint: 'You built a materials optimization system that searches thousands of parameter combinations to find the best heat treatment. This is computational materials design — replacing the centuries of trial-and-error that traditional smiths had to endure.',
    },
    {
      title: 'Smithing process simulator',
      concept: `A complete smithing simulator combines all the physics:
1. **Heating**: temperature rises in furnace (heat equation)
2. **Carbon diffusion**: carbon migrates from charcoal (Fick\'s law)
3. **Forging**: deformation refines grains (Hall-Petch)
4. **Quenching**: rapid cooling creates martensite (TTT diagram)
5. **Tempering**: controlled reheating adjusts hardness-toughness

Each step modifies the state (temperature, carbon profile, grain size, phase) that feeds into the next step. The simulator tracks all variables through the complete process.

📚 *This is a multi-physics simulation — coupling thermal, chemical, and mechanical models. Professional tools like COMSOL and Abaqus do this; we build a simplified version.*`,
      analogy: 'The smithing simulator is like a cooking simulator that tracks internal temperature, moisture content, Maillard reaction progress, and texture development simultaneously. Each step (preheating, searing, resting) changes multiple variables that all interact. The simulator predicts the final dish from the cooking sequence.',
      storyConnection: 'This simulator digitizes the Lushai smithing process. Every step the smith takes — heating duration, hammering intensity, quenching medium — has a quantifiable effect on the final blade. The simulator lets us explore "what if" questions: What if the smith used oil instead of water? What if they tempered at a lower temperature?',
      checkQuestion: 'What is the biggest simplification in our simulator compared to real smithing?',
      checkAnswer: 'We use 1D models (across blade thickness only), ignore residual stresses from quenching (which cause warping and cracking), assume uniform composition, and ignore the complex geometry of a real blade. A professional simulation would be 3D with millions of finite elements. But our 1D model captures the essential physics.',
      codeIntro: 'Build a multi-physics smithing process simulator with step-by-step tracking.',
      code: `import sqlite3
import numpy as np

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE process_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    step TEXT, duration_s REAL,
    surface_temp REAL, core_temp REAL,
    surface_carbon REAL, core_carbon REAL,
    grain_size REAL, phase TEXT,
    surface_hardness REAL
);
''')

class BladeSimulator:
    def __init__(self, thickness_mm=8, initial_carbon=0.1):
        self.nx = 20
        self.dx = thickness_mm / 1000 / self.nx
        self.T = np.ones(self.nx) * 25.0
        self.C = np.ones(self.nx) * initial_carbon
        self.grain = 30.0  # μm
        self.phase = 'ferrite'

    def heat(self, target_T, duration_s):
        alpha = 23e-6  # thermal diffusivity
        dt = 0.01
        for _ in range(int(duration_s / dt)):
            T_new = self.T.copy()
            for i in range(1, self.nx - 1):
                T_new[i] = self.T[i] + alpha * dt / self.dx**2 * (self.T[i+1] - 2*self.T[i] + self.T[i-1])
            T_new[0] = target_T  # furnace surface
            T_new[-1] = target_T
            self.T = T_new
        if np.mean(self.T) > 727:
            self.phase = 'austenite'
            self.grain *= 1.1  # grain growth

    def carburize(self, duration_s, surface_carbon=0.8):
        D = 2e-11  # diffusion coeff at ~900°C
        dt = 1.0
        for _ in range(int(duration_s / dt)):
            C_new = self.C.copy()
            for i in range(1, self.nx - 1):
                C_new[i] = self.C[i] + D * dt / self.dx**2 * (self.C[i+1] - 2*self.C[i] + self.C[i-1])
            C_new[0] = surface_carbon
            C_new[-1] = C_new[-2]
            self.C = C_new

    def forge(self, n_strikes=20):
        self.grain *= 0.6  # grain refinement
        self.grain = max(self.grain, 5)

    def quench(self, medium='water'):
        k = {'water': 0.15, 'oil': 0.03, 'air': 0.005}[medium]
        dt = 0.01
        for _ in range(int(10 / dt)):
            T_new = self.T.copy()
            alpha = 23e-6
            for i in range(1, self.nx - 1):
                T_new[i] = self.T[i] + alpha * dt / self.dx**2 * (self.T[i+1] - 2*self.T[i] + self.T[i-1])
            T_new[0] = 25; T_new[-1] = 25
            self.T = T_new
        if medium == 'water':
            self.phase = 'martensite'
        elif medium == 'oil':
            self.phase = 'bainite'
        else:
            self.phase = 'pearlite'

    def temper(self, temp, duration_s):
        self.T[:] = temp
        if self.phase == 'martensite':
            self.phase = 'tempered_martensite'

    def hardness(self, idx):
        C_pct = self.C[idx]
        if self.phase in ['martensite', 'tempered_martensite']:
            hv = 300 + 800 * C_pct
            if self.phase == 'tempered_martensite':
                hv *= 0.7
        elif self.phase == 'bainite':
            hv = 250 + 500 * C_pct
        else:
            hv = 100 + 250 * C_pct
        hv *= min(30 / self.grain, 1.5)  # Hall-Petch
        return hv

    def log_state(self, conn, step, duration):
        c = conn.cursor()
        c.execute('INSERT INTO process_log (step, duration_s, surface_temp, core_temp, surface_carbon, core_carbon, grain_size, phase, surface_hardness) VALUES (?,?,?,?,?,?,?,?,?)',
                  (step, duration, round(self.T[1],1), round(self.T[self.nx//2],1),
                   round(self.C[1],3), round(self.C[self.nx//2],3),
                   round(self.grain,1), self.phase, round(self.hardness(1),0)))

# Run the Lushai smithing process
blade = BladeSimulator(thickness_mm=8, initial_carbon=0.1)
blade.log_state(conn, 'Initial', 0)

blade.heat(900, 60)
blade.log_state(conn, 'Heat to 900°C', 60)

blade.carburize(3600, surface_carbon=0.7)
blade.log_state(conn, 'Carburize 1hr', 3600)

blade.forge(n_strikes=30)
blade.log_state(conn, 'Forge (30 strikes)', 30)

blade.heat(850, 30)
blade.log_state(conn, 'Reheat to 850°C', 30)

blade.quench('water')
blade.log_state(conn, 'Water quench', 10)

blade.temper(300, 1800)
blade.log_state(conn, 'Temper at 300°C', 1800)

conn.commit()

print("LUSHAI BLADE SMITHING — PROCESS SIMULATION")
print("=" * 80)
print(f"{'Step':<22} {'Dur(s)':>7} {'Surf T':>7} {'Core T':>7} {'Surf C%':>7} {'Core C%':>7} {'Grain':>6} {'Phase':<15} {'HV':>4}")
print("-" * 86)
for row in c.execute('SELECT * FROM process_log ORDER BY id'):
    print(f"{row[1]:<22} {row[2]:>7.0f} {row[3]:>7.1f} {row[4]:>7.1f} {row[5]:>7.3f} {row[6]:>7.3f} {row[7]:>6.1f} {row[8]:<15} {row[9]:>4.0f}")

print(f"\\\nFinal blade properties:")
print(f"  Surface: {blade.C[1]*100:.1f}% C, {blade.hardness(1):.0f} HV ({blade.phase})")
print(f"  Core:    {blade.C[blade.nx//2]*100:.1f}% C, {blade.hardness(blade.nx//2):.0f} HV")
print(f"  Grain size: {blade.grain:.1f} μm")

conn.close()`,
      challenge: 'Compare the Lushai process (water quench + temper) with a modern process (oil quench + temper at 400°C). Run both and compare surface hardness, core toughness, and grain size. Which produces a better blade?',
      successHint: 'You built a multi-physics smithing simulator that tracks temperature, carbon, grain size, and phase through every step of the process. This is computational materials engineering — the modern equivalent of the Lushai master smith\'s lifetime of accumulated knowledge.',
    },
    {
      title: 'Virtual forge — complete blade design system',
      concept: `The capstone integrates everything into a **virtual forge**: a system where you specify the desired blade properties and the optimizer finds the best combination of alloy and process.

The system:
1. Queries the alloy database for candidate compositions
2. Simulates the smithing process for each candidate
3. Evaluates the resulting properties against requirements
4. Ranks candidates by overall fitness
5. Stores all results for comparison

This is a **digital twin** of the smithing process — a computational model that mirrors the real-world process closely enough to make reliable predictions.

📚 *The final system connects databases, simulations, and optimization into one pipeline. This integration pattern is the foundation of modern engineering design.*`,
      analogy: 'The virtual forge is like a car configurator that actually simulates physics. Instead of just showing you color options, it simulates crash tests, fuel efficiency, and handling for every configuration. You specify "I want a car that handles well in rain and costs under $30k" and the system finds the best match.',
      storyConnection: 'Imagine a Lushai smith with access to this tool. Instead of spending weeks experimenting with different charcoal types and quenching methods, the smith could simulate hundreds of variants in minutes, then physically produce only the most promising ones. The tool amplifies the smith\'s expertise rather than replacing it.',
      checkQuestion: 'What is the value of a digital twin if the physical process must still be done?',
      checkAnswer: 'The digital twin reduces physical experiments by 90%+ — you simulate hundreds of variants and only build the top 5. Each physical experiment costs time, materials, and energy. The digital twin also allows "impossible" experiments: What if we had a furnace that reached 1200°C? What if we used a quenching oil at -20°C? Computation is cheap; experiments are expensive.',
      codeIntro: 'Build the complete virtual forge system: alloy selection, process simulation, and optimization.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alloy_name TEXT, carbon_pct REAL,
    aust_temp INTEGER, hold_min INTEGER,
    cool_method TEXT, temper_temp INTEGER,
    surface_hardness REAL, core_hardness REAL,
    toughness REAL, grain_size REAL,
    fitness REAL, cost_score REAL
);

CREATE TABLE requirements (
    id INTEGER PRIMARY KEY,
    application TEXT,
    min_surface_hv REAL, min_toughness REAL,
    max_grain REAL, max_cost REAL
);
''')

# Define application requirements
apps = [
    (1, 'Hunting knife', 500, 25, 20, 3.0),
    (2, 'Machete', 400, 40, 30, 2.0),
    (3, 'Chisel', 600, 15, 15, 4.0),
    (4, 'Sword', 550, 30, 18, 5.0),
]
c.executemany('INSERT INTO requirements VALUES (?,?,?,?,?,?)', apps)

def simulate_blade(carbon, aust_temp, hold_min, cool, temper_temp):
    """Simplified blade simulation returning properties."""
    # Grain growth during heating
    grain = 15.0  # start fine
    grain *= (1 + 0.01 * max(hold_min - 10, 0))
    grain *= (1 + 0.002 * max(aust_temp - 850, 0))

    # Base hardness from carbon
    if cool == 'water':
        surface_hv = 300 + 900 * carbon * (1 - temper_temp/1200)
        tough = max(10, 60 - 50 * carbon + 0.05 * temper_temp)
    elif cool == 'oil':
        surface_hv = 250 + 700 * carbon * (1 - temper_temp/1200)
        tough = max(15, 70 - 40 * carbon + 0.04 * temper_temp)
    else:
        surface_hv = 150 + 300 * carbon
        tough = max(25, 80 - 30 * carbon)

    core_hv = surface_hv * 0.7  # less carbon at core
    grain_bonus = min(20 / grain, 1.3)
    surface_hv *= grain_bonus
    core_hv *= grain_bonus

    return surface_hv, core_hv, tough, grain

# Candidate alloys
alloys = [
    ('Low carbon', 0.20, 1.0),
    ('Lushai iron', 0.35, 0.5),
    ('Medium carbon', 0.50, 0.9),
    ('High carbon', 0.80, 1.2),
    ('Spring steel', 0.60, 1.5),
]

# Grid search
count = 0
for name, carbon, cost in alloys:
    for aust in [800, 850, 900, 950]:
        for hold in [10, 20, 30]:
            for cool in ['water', 'oil', 'air']:
                temps = [0, 200, 350, 500] if cool != 'air' else [0]
                for temper in temps:
                    shv, chv, tough, grain = simulate_blade(carbon, aust, hold, cool, temper)

                    # Fitness for general blade use
                    fitness = (shv / 10) * 0.4 + tough * 0.4 + (30 / grain) * 0.2
                    cost_s = cost * (1 + temper/500 * 0.2)

                    c.execute('INSERT INTO designs (alloy_name, carbon_pct, aust_temp, hold_min, cool_method, temper_temp, surface_hardness, core_hardness, toughness, grain_size, fitness, cost_score) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                              (name, carbon, aust, hold, cool, temper,
                               round(shv,1), round(chv,1), round(tough,1), round(grain,1),
                               round(fitness,2), round(cost_s,2)))
                    count += 1

conn.commit()

print(f"VIRTUAL FORGE — {count} designs evaluated")
print("=" * 75)

# Find best design for each application
for app in apps:
    _, app_name, min_hv, min_tough, max_grain, max_cost = app
    print(f"\\\n--- {app_name} (HV>{min_hv}, Tough>{min_tough}, Grain<{max_grain}) ---")

    rows = c.execute('''
        SELECT alloy_name, aust_temp, hold_min, cool_method, temper_temp,
               surface_hardness, toughness, grain_size, fitness, cost_score
        FROM designs
        WHERE surface_hardness > ? AND toughness > ? AND grain_size < ? AND cost_score < ?
        ORDER BY fitness DESC LIMIT 3
    ''', (min_hv, min_tough, max_grain, max_cost)).fetchall()

    if rows:
        for row in rows:
            print(f"  {row[0]:<15} {row[1]}°C/{row[2]}min/{row[3]}/{row[4]}°C → "
                  f"HV={row[5]:.0f} Tough={row[6]:.0f} Grain={row[7]:.0f}μm Score={row[8]:.1f}")
    else:
        print("  No design meets all requirements — relax constraints")

# Overall best
print("\\\nOverall best designs (top 5):")
for row in c.execute('SELECT alloy_name, aust_temp, cool_method, temper_temp, surface_hardness, toughness, fitness FROM designs ORDER BY fitness DESC LIMIT 5'):
    print(f"  {row[0]:<15}: {row[1]}°C/{row[2]}/temper {row[3]}°C → HV={row[4]:.0f}, Tough={row[5]:.0f}, Score={row[6]:.1f}")

conn.close()`,
      challenge: 'Add a "Lushai constraint" mode: only allow charcoal furnace (max 1000°C), water quench, and no controlled tempering. How close can the Lushai process get to modern optimized results? This quantifies how much the traditional smiths achieved with limited technology.',
      successHint: 'You built a complete virtual forge — a digital twin of the entire blade-making process from alloy selection to final properties. This capstone demonstrates that computational engineering is not about replacing craftsmanship but about amplifying it: the Lushai smiths\' centuries of knowledge, quantified, searchable, and optimizable.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database-Driven Materials Design</span>
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
