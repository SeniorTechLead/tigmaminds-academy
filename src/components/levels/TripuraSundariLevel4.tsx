import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TripuraSundariLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Geological database — stratigraphic records',
      concept: `A geological database stores rock layer data from boreholes, outcrops, and surveys. For Tripura's geology, we need:

- **formations**: rock unit name, age, type, thickness range
- **boreholes**: location, depth, what was found at each depth
- **structures**: folds, faults, their orientations and dimensions
- **hazards**: earthquake history, landslide zones, flood risk

This is the standard format used by the Geological Survey of India (GSI) for regional mapping.

📚 *We will create a geological database in SQLite and populate it with Tripura's stratigraphy.*`,
      analogy: 'A geological database is like a medical scan — it reveals what is hidden beneath the surface. Just as an MRI shows layers of tissue, the database shows layers of rock, their properties, and their history.',
      storyConnection: 'The Geological Survey of India has mapped Tripura extensively. Our database models their data, making it queryable for applications like building site assessment, water well placement, and heritage conservation at Tripura Sundari Temple.',
      checkQuestion: 'Why are boreholes essential for geological databases?',
      checkAnswer: 'Surface outcrops only show what is exposed by erosion. Boreholes reveal the complete sequence of rocks at depth — their order, thickness, and properties. Without boreholes, subsurface geology is guesswork.',
      codeIntro: 'Create a geological database for the Tripura Sundari Temple region.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE formations (
    id INTEGER PRIMARY KEY, name TEXT, age_mya_start REAL,
    age_mya_end REAL, rock_type TEXT, avg_thickness_m REAL,
    density_kg_m3 REAL, porosity_pct REAL
);
CREATE TABLE boreholes (
    id INTEGER PRIMARY KEY, name TEXT, lat REAL, lon REAL,
    total_depth_m REAL, year_drilled INTEGER
);
CREATE TABLE borehole_layers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    borehole_id INTEGER, formation_id INTEGER,
    top_m REAL, bottom_m REAL, notes TEXT
);
CREATE TABLE structures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, name TEXT, strike_deg REAL,
    dip_deg REAL, wavelength_km REAL, amplitude_m REAL
);
CREATE TABLE seismic_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT, magnitude REAL, depth_km REAL,
    lat REAL, lon REAL, distance_to_temple_km REAL
);
''')

# Formations
formations = [
    (1, 'Alluvium', 0, 0.01, 'sand/clay', 5, 1800, 30),
    (2, 'Dupitila', 0.01, 2, 'sandstone', 50, 2300, 20),
    (3, 'Tipam', 2, 10, 'sandstone', 80, 2400, 15),
    (4, 'Bhuban', 10, 20, 'shale/siltstone', 200, 2500, 10),
    (5, 'Barail', 20, 35, 'sandstone/shale', 500, 2550, 8),
    (6, 'Disang', 35, 65, 'shale', 1000, 2600, 5),
]
cur.executemany('INSERT INTO formations VALUES (?,?,?,?,?,?,?,?)', formations)

# Boreholes
boreholes = [
    (1, 'BH-TS-01', 23.516, 91.254, 150, 2020),
    (2, 'BH-TS-02', 23.520, 91.260, 300, 2021),
    (3, 'BH-TS-03', 23.510, 91.248, 500, 2019),
]
cur.executemany('INSERT INTO boreholes VALUES (?,?,?,?,?,?)', boreholes)

# Borehole layers (what was found at each depth)
layers = [
    (1, 1, 0, 3, 'Lateritic soil'), (1, 2, 3, 45, 'Medium-grained sandstone'),
    (1, 3, 45, 150, 'Coarse sandstone with clay bands'),
    (2, 1, 0, 5, 'Alluvial clay'), (2, 2, 5, 60, 'Friable sandstone'),
    (2, 3, 60, 180, 'Hard sandstone'), (2, 4, 180, 300, 'Shale with siltstone'),
    (3, 1, 0, 2, 'Topsoil'), (3, 2, 2, 55, 'Dupitila sandstone'),
    (3, 3, 55, 140, 'Tipam sandstone'), (3, 4, 140, 350, 'Bhuban shale'),
    (3, 5, 350, 500, 'Barail sandstone'),
]
cur.executemany('INSERT INTO borehole_layers (borehole_id,formation_id,top_m,bottom_m,notes) VALUES (?,?,?,?,?)', layers)

# Structures
structures = [
    ('anticline', 'Raghunandan Hill', 10, 30, 12, 300),
    ('anticline', 'Baramura Range', 15, 35, 15, 450),
    ('syncline', 'Agartala Valley', 10, 30, 12, 250),
    ('fault', 'Sylhet Fault', 45, 60, 0, 0),
]
cur.executemany('INSERT INTO structures (type,name,strike_deg,dip_deg,wavelength_km,amplitude_m) VALUES (?,?,?,?,?,?)', structures)

# Seismic events
quakes = [
    ('2017-01-03', 5.7, 32, 24.0, 92.0, 120),
    ('2018-06-12', 4.5, 15, 23.8, 91.5, 30),
    ('2021-04-28', 6.0, 25, 26.7, 92.4, 350),
    ('2023-11-08', 4.2, 10, 23.6, 91.3, 15),
    ('2024-03-15', 3.8, 8, 23.5, 91.2, 10),
]
cur.executemany('INSERT INTO seismic_events (date,magnitude,depth_km,lat,lon,distance_to_temple_km) VALUES (?,?,?,?,?,?)', quakes)
db.commit()

# Reports
print("GEOLOGICAL DATABASE — TRIPURA SUNDARI REGION")
print("=" * 65)

print("\nSTRATIGRAPHIC COLUMN")
print("-" * 65)
for f in cur.execute('SELECT name, age_mya_start, age_mya_end, rock_type, avg_thickness_m FROM formations ORDER BY age_mya_start'):
    print(f"  {f[0]:15s} | {f[1]:>5.2f}-{f[2]:>5.1f} Mya | {f[3]:15s} | {f[4]:>5.0f}m")

print(f"\nBOREHOLES: {cur.execute('SELECT COUNT(*) FROM boreholes').fetchone()[0]}")
for b in cur.execute('SELECT name, total_depth_m, year_drilled FROM boreholes'):
    n_layers = cur.execute('SELECT COUNT(*) FROM borehole_layers WHERE borehole_id=(SELECT id FROM boreholes WHERE name=?)', (b[0],)).fetchone()[0]
    print(f"  {b[0]}: {b[1]:.0f}m deep ({b[2]}), {n_layers} layers logged")

print(f"\nSTRUCTURES: {cur.execute('SELECT COUNT(*) FROM structures').fetchone()[0]}")
for s in cur.execute('SELECT type, name, wavelength_km, amplitude_m FROM structures'):
    if s[2] > 0:
        print(f"  {s[0]:10s}: {s[1]:20s} (λ={s[2]:.0f}km, A={s[3]:.0f}m)")
    else:
        print(f"  {s[0]:10s}: {s[1]:20s}")

print(f"\nSEISMIC EVENTS: {cur.execute('SELECT COUNT(*) FROM seismic_events').fetchone()[0]}")
max_q = cur.execute('SELECT date, magnitude, distance_to_temple_km FROM seismic_events ORDER BY magnitude DESC LIMIT 1').fetchone()
print(f"  Largest: M{max_q[1]} on {max_q[0]} ({max_q[2]:.0f}km from temple)")`,
      challenge: 'Add a groundwater table to the database (depth to water at each borehole, varies seasonally). Query which boreholes have shallow water tables that could affect temple foundations.',
      successHint: 'Geological databases are the foundation of modern earth science. From water supply to earthquake hazard to construction planning, every decision starts with querying the data.',
    },
    {
      title: 'Geological cross-section reconstruction from boreholes',
      concept: `Given borehole data at different locations, we can **interpolate** to reconstruct the geological cross-section between them.

The process:
1. Extract layer depths from each borehole
2. Correlate formations across boreholes (matching rock types)
3. Interpolate layer boundaries between boreholes
4. Account for folding (anticline/syncline geometry)

This reconstruction reveals the 3D structure of the subsurface — essential for:
- Finding water-bearing layers
- Assessing foundation conditions
- Identifying earthquake-prone faults
- Locating resources

📚 *We will query borehole data from our database and interpolate a cross-section.*`,
      analogy: 'Reconstructing subsurface geology from boreholes is like guessing what a cake looks like inside from a few toothpick samples. Each toothpick shows the layers at one point. By connecting the dots, you reconstruct the full internal structure.',
      storyConnection: 'The Archaeological Survey of India needed to understand the ground beneath Tripura Sundari Temple for conservation work. Borehole data allowed them to reconstruct the subsurface and assess foundation stability.',
      checkQuestion: 'If borehole A shows sandstone at 50m depth and borehole B (2 km away) shows the same sandstone at 30m, what does this tell us?',
      checkAnswer: 'The sandstone layer dips (tilts) between the two boreholes. The dip angle = arctan((50-30)/2000) ≈ 0.57°. This gentle dip is consistent with being on the limb of an anticline — exactly the geometry of Tripura\'s fold belt.',
      codeIntro: 'Reconstruct a geological cross-section from borehole data stored in our database.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE boreholes (id INTEGER PRIMARY KEY, name TEXT, x_km REAL, depth_m REAL);
CREATE TABLE layers (id INTEGER PRIMARY KEY AUTOINCREMENT,
    bh_id INTEGER, formation TEXT, top_m REAL, bottom_m REAL, color TEXT);
''')

# 5 boreholes along a cross-section
bhs = [(1,'BH1',0,200), (2,'BH2',5,350), (3,'BH3',10,500), (4,'BH4',15,350), (5,'BH5',20,200)]
cur.executemany('INSERT INTO boreholes VALUES (?,?,?,?)', bhs)

# Layer data (reflecting an anticline centred at BH3)
layer_data = [
    # BH1 (syncline flank)
    (1,'Alluvium',0,5,'#DEB887'), (1,'Dupitila',5,55,'#DAA520'),
    (1,'Tipam',55,140,'#CD853F'), (1,'Bhuban',140,200,'#696969'),
    # BH2 (anticline limb)
    (2,'Alluvium',0,3,'#DEB887'), (2,'Dupitila',3,40,'#DAA520'),
    (2,'Tipam',40,110,'#CD853F'), (2,'Bhuban',110,250,'#696969'), (2,'Barail',250,350,'#A0522D'),
    # BH3 (anticline crest - temple site)
    (3,'Alluvium',0,2,'#DEB887'), (3,'Dupitila',2,30,'#DAA520'),
    (3,'Tipam',30,90,'#CD853F'), (3,'Bhuban',90,220,'#696969'),
    (3,'Barail',220,380,'#A0522D'), (3,'Disang',380,500,'#4A4A4A'),
    # BH4 (anticline limb)
    (4,'Alluvium',0,4,'#DEB887'), (4,'Dupitila',4,45,'#DAA520'),
    (4,'Tipam',45,120,'#CD853F'), (4,'Bhuban',120,260,'#696969'), (4,'Barail',260,350,'#A0522D'),
    # BH5 (syncline flank)
    (5,'Alluvium',0,6,'#DEB887'), (5,'Dupitila',6,60,'#DAA520'),
    (5,'Tipam',60,150,'#CD853F'), (5,'Bhuban',150,200,'#696969'),
]
cur.executemany('INSERT INTO layers (bh_id,formation,top_m,bottom_m,color) VALUES (?,?,?,?,?)', layer_data)
db.commit()

# Reconstruct cross-section
fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

# Get unique formations
formations = ['Alluvium', 'Dupitila', 'Tipam', 'Bhuban', 'Barail', 'Disang']
colors = {'Alluvium':'#DEB887', 'Dupitila':'#DAA520', 'Tipam':'#CD853F',
          'Bhuban':'#696969', 'Barail':'#A0522D', 'Disang':'#4A4A4A'}

# For each formation, interpolate boundaries
x_fine = np.linspace(0, 20, 200)

for fm in formations:
    tops_x, tops_d = [], []
    bots_x, bots_d = [], []

    for bh in cur.execute('SELECT id, x_km FROM boreholes ORDER BY x_km'):
        layer = cur.execute('SELECT top_m, bottom_m FROM layers WHERE bh_id=? AND formation=?',
                           (bh[0], fm)).fetchone()
        if layer:
            tops_x.append(bh[1]); tops_d.append(-layer[0])
            bots_x.append(bh[1]); bots_d.append(-layer[1])

    if len(tops_x) >= 2:
        top_interp = np.interp(x_fine, tops_x, tops_d)
        bot_interp = np.interp(x_fine, bots_x, bots_d)
        ax.fill_between(x_fine, top_interp, bot_interp, color=colors[fm], alpha=0.8, label=fm)

# Borehole markers
for bh in cur.execute('SELECT name, x_km, depth_m FROM boreholes'):
    ax.plot([bh[1], bh[1]], [0, -bh[2]], color='white', linewidth=1.5, linestyle='-')
    ax.plot(bh[1], 0, 'v', color='white', markersize=8)
    ax.text(bh[1], 15, bh[0], color='white', fontsize=8, ha='center')

# Temple marker
ax.plot(10, 30, '^', color='#ef4444', markersize=14, zorder=5)
ax.annotate('Tripura Sundari\\nTemple', xy=(10.5, 20), color='#ef4444', fontsize=10, fontweight='bold')

ax.set_xlabel('Distance (km)', color='white', fontsize=12)
ax.set_ylabel('Depth (m)', color='white', fontsize=12)
ax.set_title('Geological Cross-Section from Borehole Data', color='white', fontsize=14)
ax.legend(facecolor='#374151', labelcolor='white', fontsize=8, loc='lower right')
ax.set_ylim(-500, 50)

plt.tight_layout()
plt.savefig('cross_section_bh.png', dpi=100, facecolor='#1f2937')
plt.show()

print("The anticline is clearly visible — layers arch upward at BH3 (temple site).")
print("Deeper formations (Barail, Disang) are only reached by the deepest boreholes.")`,
      challenge: 'Add a water table line that follows the topography but is shallower under anticlines. Which borehole locations would make the best water wells?',
      successHint: 'Cross-section reconstruction from boreholes is the standard method for understanding subsurface geology. This technique guides everything from water supply to oil exploration to temple conservation.',
    },
    {
      title: 'Seismic risk assessment for heritage structures',
      concept: `Combining our earthquake database with structural vulnerability data lets us assess the **seismic risk** to Tripura Sundari Temple:

\`Risk = Hazard × Vulnerability × Exposure\`

- **Hazard**: probability and intensity of earthquakes (from Gutenberg-Richter)
- **Vulnerability**: how easily the structure is damaged (depends on construction type)
- **Exposure**: the value of what could be lost (cultural, economic, human)

For heritage structures, we use **fragility curves** — probability of damage vs ground shaking intensity. Different damage states:
- **None**: no visible damage
- **Slight**: hairline cracks
- **Moderate**: significant cracking
- **Severe**: partial collapse
- **Complete**: total collapse

📚 *We will build a probabilistic seismic risk model for Tripura Sundari Temple using our geological database.*`,
      analogy: 'Seismic risk assessment is like a health check for a building. You measure the "diseases" it might face (earthquakes), test how "healthy" it is (structural strength), and estimate the "treatment cost" (repair/replacement value).',
      storyConnection: 'Tripura Sundari Temple is an ASI-protected monument of national importance. A seismic risk assessment helps the ASI prioritise conservation spending and plan emergency response for this irreplaceable heritage.',
      checkQuestion: 'If a temple has a 2% annual probability of experiencing M6+ shaking and a 30% probability of "severe damage" at that intensity, what is the annual risk of severe damage?',
      checkAnswer: '0.02 × 0.30 = 0.006 = 0.6% per year. Over 50 years: 1 - (1-0.006)^50 ≈ 26% probability of severe damage. This is unacceptably high for an irreplaceable heritage structure.',
      codeIntro: 'Build a probabilistic seismic risk assessment for Tripura Sundari Temple.',
      code: `import numpy as np
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE hazard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    magnitude REAL, annual_prob REAL, pga_at_temple REAL
);
CREATE TABLE fragility (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    damage_state TEXT, median_pga REAL, beta REAL
);
CREATE TABLE risk_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario TEXT, magnitude REAL, pga REAL,
    damage_state TEXT, probability REAL, loss_pct REAL
);
''')

# Hazard model (from Gutenberg-Richter)
a, b = 5.5, 0.9
for M in np.arange(4.0, 8.5, 0.5):
    annual_rate = 10**(a - b*M) - 10**(a - b*(M+0.5))
    # PGA at temple (30 km typical distance)
    pga = 10**(0.5*M - 1.5*np.log10(30) - 0.5)
    cur.execute('INSERT INTO hazard (magnitude, annual_prob, pga_at_temple) VALUES (?,?,?)',
                (M, round(annual_rate, 6), round(pga, 4)))

# Fragility curves for stone temple (unreinforced masonry)
fragility_data = [
    ('None',     0.05, 0.3),
    ('Slight',   0.10, 0.3),
    ('Moderate',  0.20, 0.3),
    ('Severe',   0.40, 0.3),
    ('Complete', 0.80, 0.3),
]
cur.executemany('INSERT INTO fragility (damage_state, median_pga, beta) VALUES (?,?,?)', fragility_data)
db.commit()

# Compute risk
from math import log, exp, sqrt, pi, erf

def norm_cdf(x):
    return 0.5 * (1 + erf(x / sqrt(2)))

def fragility_prob(pga, median, beta):
    if pga <= 0: return 0
    return norm_cdf(log(pga / median) / beta)

loss_ratios = {'None': 0, 'Slight': 5, 'Moderate': 20, 'Severe': 50, 'Complete': 100}

print("SEISMIC RISK ASSESSMENT — TRIPURA SUNDARI TEMPLE")
print("=" * 70)

# For each hazard scenario
total_annual_loss = 0
print(f"{'Magnitude':>9} {'P(yr)':>8} {'PGA(g)':>8} | {'None':>5} {'Slight':>7} {'Mod':>5} {'Severe':>7} {'Compl':>6}")
print("-" * 70)

for h in cur.execute('SELECT magnitude, annual_prob, pga_at_temple FROM hazard ORDER BY magnitude'):
    M, prob, pga = h
    probs = {}
    for f in cur.execute('SELECT damage_state, median_pga, beta FROM fragility ORDER BY median_pga'):
        p = fragility_prob(pga, f[1], f[2])
        probs[f[0]] = p

    # Incremental probabilities
    states = ['None', 'Slight', 'Moderate', 'Severe', 'Complete']
    incremental = {}
    for i, s in enumerate(states):
        if i == len(states) - 1:
            incremental[s] = probs[s]
        else:
            incremental[s] = probs[s] - probs[states[i+1]]

    # Expected loss for this scenario
    exp_loss = sum(incremental.get(s, 0) * loss_ratios[s] for s in states)
    annual_loss = prob * exp_loss
    total_annual_loss += annual_loss

    print(f"  M{M:.1f}   {prob:>8.4f} {pga:>8.3f} | "
          f"{probs['None']:.2f}  {probs['Slight']:.2f}   {probs['Moderate']:.2f}  {probs['Severe']:.2f}   {probs['Complete']:.2f}")

    # Store
    for s in states:
        cur.execute('INSERT INTO risk_results (scenario,magnitude,pga,damage_state,probability,loss_pct) VALUES (?,?,?,?,?,?)',
                    (f'M{M:.1f}', M, pga, s, round(probs[s], 4), loss_ratios[s]))

db.commit()

print(f"\nANNUAL EXPECTED LOSS: {total_annual_loss:.2f}%")
print(f"50-YEAR CUMULATIVE LOSS: {total_annual_loss * 50:.1f}%")

# Temple value and monetary risk
temple_value_cr = 500  # crores (cultural/reconstruction value)
print(f"\nTemple cultural value: ₹{temple_value_cr} crore")
print(f"Annual risk: ₹{total_annual_loss * temple_value_cr / 100:.2f} crore/year")
print(f"50-year risk: ₹{total_annual_loss * 50 * temple_value_cr / 100:.1f} crore")

# Retrofit benefit
print(f"\nRETROFIT ANALYSIS:")
retrofit_cost = 5  # crores
risk_reduction = 0.6  # 60% reduction
saved_per_year = total_annual_loss * temple_value_cr / 100 * risk_reduction
payback = retrofit_cost / saved_per_year
print(f"  Retrofit cost: ₹{retrofit_cost} crore")
print(f"  Risk reduction: {risk_reduction*100:.0f}%")
print(f"  Annual savings: ₹{saved_per_year:.2f} crore/year")
print(f"  Payback period: {payback:.0f} years")`,
      challenge: 'Add site amplification: the temple is on hard rock (anticline), but nearby villages are on soft alluvium (syncline). Compare the risk at both locations.',
      successHint: 'Probabilistic risk assessment quantifies the earthquake threat to heritage structures. For Tripura Sundari Temple, the numbers make a compelling case for seismic retrofitting.',
    },
    {
      title: 'Complete geological survey system — the capstone',
      concept: `The capstone integrates everything into a **geological survey management system**:

1. **Stratigraphy database**: rock formations and their properties
2. **Borehole management**: subsurface data from drilling
3. **Structural analysis**: fold and fault characterisation
4. **Hazard assessment**: earthquake probability and intensity
5. **Risk analysis**: combining hazard with vulnerability
6. **Conservation planning**: prioritised actions with cost-benefit

This system mirrors what the Geological Survey of India uses for regional assessment.

📚 *We will build the complete integrated system tying together all our geological models and databases.*`,
      analogy: 'A geological survey system is like a complete medical record for a region of Earth — recording its history (stratigraphy), current condition (structures), risks (hazards), and treatment plan (conservation). Every piece connects to every other.',
      storyConnection: 'This capstone builds the tool that could protect Tripura Sundari Temple and the entire landscape of Tripura. From understanding the ancient collision that created the hills, to predicting future earthquakes, to planning conservation — it is the complete geological story of a temple site.',
      checkQuestion: 'How does integrating all these databases provide more value than keeping them separate?',
      checkAnswer: 'Integration reveals connections: borehole data explains why certain areas have higher seismic risk (soft soil). Fold geometry explains where the strongest foundations are. Erosion models predict future terrain changes. These insights only emerge when all data is connected.',
      codeIntro: 'Build a complete geological survey and conservation planning system.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE site_info (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE geology (id INTEGER PRIMARY KEY, formation TEXT, depth_m REAL,
    thickness_m REAL, rock_type TEXT, strength_mpa REAL);
CREATE TABLE hazards (id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, severity TEXT, probability REAL, impact TEXT);
CREATE TABLE conservation_actions (id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT, priority TEXT, cost_lakhs REAL,
    risk_reduction_pct REAL, status TEXT);
CREATE TABLE monitoring (id INTEGER PRIMARY KEY AUTOINCREMENT,
    parameter TEXT, frequency TEXT, last_reading REAL, unit TEXT, threshold REAL);
''')

# Site information
site_data = [
    ('name', 'Tripura Sundari Temple'), ('location', 'Udaipur, Tripura'),
    ('coordinates', '23.516°N, 91.254°E'), ('seismic_zone', 'V (Highest)'),
    ('geological_setting', 'Anticline crest, Tipam Sandstone'),
    ('age', '~500 years (temple), ~10 Mya (rocks)'),
    ('protection', 'ASI Protected Monument'),
]
cur.executemany('INSERT INTO site_info VALUES (?,?)', site_data)

# Geology
geology = [
    (1, 'Laterite cap', 0, 3, 'weathered rock', 5),
    (2, 'Dupitila Sandstone', 3, 30, 'medium sandstone', 25),
    (3, 'Tipam Sandstone', 33, 60, 'hard sandstone', 45),
    (4, 'Bhuban Formation', 93, 130, 'shale/siltstone', 15),
    (5, 'Barail Group', 223, 280, 'sandstone/shale', 30),
]
cur.executemany('INSERT INTO geology VALUES (?,?,?,?,?,?)', geology)

# Hazards
hazards = [
    ('Earthquake', 'High', 0.02, 'Structural damage, collapse risk'),
    ('Landslide', 'Medium', 0.05, 'Slope failure on hill flanks'),
    ('Flooding', 'Low', 0.10, 'Foundation erosion from monsoon'),
    ('Weathering', 'Ongoing', 1.0, 'Gradual stone deterioration'),
    ('Subsidence', 'Low', 0.01, 'Differential settlement'),
]
cur.executemany('INSERT INTO hazards (type,severity,probability,impact) VALUES (?,?,?,?)', hazards)

# Conservation actions
actions = [
    ('Seismic retrofit (base isolation)', 'CRITICAL', 500, 60, 'Planned'),
    ('Drainage improvement', 'HIGH', 50, 20, 'In progress'),
    ('Slope stabilisation (retaining walls)', 'HIGH', 150, 30, 'Planned'),
    ('Stone consolidation treatment', 'MEDIUM', 80, 15, 'Completed'),
    ('Monitoring system installation', 'HIGH', 30, 10, 'Completed'),
    ('Emergency response plan', 'CRITICAL', 10, 5, 'In progress'),
    ('Vegetation management', 'LOW', 20, 5, 'Ongoing'),
]
cur.executemany('INSERT INTO conservation_actions (action,priority,cost_lakhs,risk_reduction_pct,status) VALUES (?,?,?,?,?)', actions)

# Monitoring
monitoring = [
    ('Ground tilt', 'Daily', 0.002, 'degrees', 0.01),
    ('Crack width (main wall)', 'Weekly', 2.3, 'mm', 5.0),
    ('Groundwater level', 'Monthly', 8.5, 'metres', 5.0),
    ('Seismic acceleration', 'Continuous', 0.01, 'g', 0.1),
    ('Rainfall', 'Daily', 5.2, 'mm', 100),
    ('Temperature (stone)', 'Hourly', 28.5, '°C', 45),
]
cur.executemany('INSERT INTO monitoring (parameter,frequency,last_reading,unit,threshold) VALUES (?,?,?,?,?)', monitoring)
db.commit()

# COMPREHENSIVE REPORT
print("GEOLOGICAL SURVEY & CONSERVATION REPORT")
print("TRIPURA SUNDARI TEMPLE, UDAIPUR, TRIPURA")
print("=" * 65)

print("\n1. SITE INFORMATION")
for r in cur.execute('SELECT key, value FROM site_info'):
    print(f"   {r[0]:25s}: {r[1]}")

print("\n2. GEOLOGICAL PROFILE")
print(f"   {'Formation':<22} {'Depth':>6} {'Thick':>6} {'Type':<18} {'σ(MPa)':>7}")
print("   " + "-" * 60)
for r in cur.execute('SELECT formation, depth_m, thickness_m, rock_type, strength_mpa FROM geology'):
    print(f"   {r[0]:<22} {r[1]:>5.0f}m {r[2]:>5.0f}m {r[3]:<18} {r[4]:>6.0f}")

print("\n3. HAZARD ASSESSMENT")
for r in cur.execute('SELECT type, severity, probability, impact FROM hazards ORDER BY probability DESC'):
    print(f"   [{r[1]:>8s}] {r[0]:<15s} P={r[2]:.2f}/yr — {r[3]}")

print("\n4. CONSERVATION PLAN")
total_cost = 0
total_risk_reduction = 0
for r in cur.execute('SELECT action, priority, cost_lakhs, risk_reduction_pct, status FROM conservation_actions ORDER BY cost_lakhs DESC'):
    total_cost += r[2]
    total_risk_reduction += r[3]
    print(f"   [{r[1]:>8s}] {r[0]:<40s} ₹{r[2]:>5.0f}L  -{r[3]}%  [{r[4]}]")
print(f"   {'TOTAL':>50s} ₹{total_cost:.0f}L  -{min(total_risk_reduction,95)}%")

print("\n5. MONITORING STATUS")
alerts = 0
for r in cur.execute('SELECT parameter, last_reading, unit, threshold FROM monitoring'):
    status = "OK" if r[1] < r[3] else "ALERT"
    if status == "ALERT": alerts += 1
    print(f"   {r[0]:<25s}: {r[1]:>8.2f} {r[2]:<8s} (limit: {r[3]}) [{status}]")
print(f"   Active alerts: {alerts}")

print("\n6. RECOMMENDATION")
critical = cur.execute("SELECT COUNT(*) FROM conservation_actions WHERE priority='CRITICAL' AND status!='Completed'").fetchone()[0]
if critical > 0:
    print(f"   {critical} CRITICAL actions pending. Immediate attention required.")
    for r in cur.execute("SELECT action, cost_lakhs FROM conservation_actions WHERE priority='CRITICAL' AND status!='Completed'"):
        print(f"   → {r[0]} (₹{r[1]:.0f} lakhs)")
else:
    print("   All critical actions completed. Continue monitoring.")`,
      challenge: 'Add a 10-year projection: model how each hazard probability changes with climate change (more rainfall = more landslides) and tectonic activity (stress accumulation = higher earthquake probability).',
      successHint: 'You have built a complete geological survey and conservation management system — the same type of tool used by the ASI, UNESCO, and geological surveys worldwide to protect irreplaceable heritage. The geology of Tripura tells the story of continents colliding, and your code preserves it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geological Survey & Conservation System</span>
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
