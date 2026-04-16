import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NeermahalLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Database design — a structural inspection system',
      concept: `Real engineering projects generate mountains of data: inspection dates, crack measurements, water levels, pile conditions. A **relational database** organises this data so it can be queried and analysed.

For Neermahal, we need tables for:
- **elements**: each structural element (wall, column, pile, floor slab)
- **inspections**: each inspection event (date, inspector, conditions)
- **measurements**: individual readings (crack width, settlement, corrosion depth)

Tables are linked by **foreign keys** — an inspection references an element, a measurement references an inspection.

**SQL** (Structured Query Language) lets us insert data, query it, and compute summaries.

📚 *We will use Python's built-in \`sqlite3\` module to create a database, define tables, insert data, and run analytical queries.*`,
      analogy: 'A database is like a filing cabinet with labelled folders (tables), each containing forms (rows) with specific fields (columns). The labels connect folders — an inspection form references which structural element it describes, just as a medical test references which patient it belongs to.',
      storyConnection: 'The Archaeological Survey of India maintains Neermahal. Without a systematic database, inspection records get lost, trends go unnoticed, and deterioration is discovered too late. A digital inspection system could save the palace.',
      checkQuestion: 'Why use a relational database instead of a spreadsheet for structural inspections?',
      checkAnswer: 'Spreadsheets become unwieldy with thousands of records, cannot enforce data integrity (e.g., preventing an inspection referencing a nonexistent element), and make it hard to query across multiple related datasets. A database handles all of this naturally.',
      codeIntro: 'Create a structural inspection database for Neermahal using SQLite.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

# Create tables
cur.executescript('''
CREATE TABLE elements (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT,
    year_built INTEGER
);

CREATE TABLE inspections (
    id INTEGER PRIMARY KEY,
    element_id INTEGER REFERENCES elements(id),
    date TEXT NOT NULL,
    inspector TEXT,
    water_level_m REAL
);

CREATE TABLE measurements (
    id INTEGER PRIMARY KEY,
    inspection_id INTEGER REFERENCES inspections(id),
    metric TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT
);
''')

# Insert structural elements
elements = [
    (1, 'North Wall',     'wall',   'north wing',   1930),
    (2, 'South Wall',     'wall',   'south wing',   1930),
    (3, 'Main Column A',  'column', 'central hall',  1930),
    (4, 'Main Column B',  'column', 'central hall',  1930),
    (5, 'Pile Group N1',  'pile',   'north foundation', 1930),
    (6, 'Pile Group S1',  'pile',   'south foundation', 1930),
    (7, 'Roof Slab',      'slab',   'main roof',    1930),
    (8, 'Entrance Arch',  'arch',   'east entrance', 1930),
]
cur.executemany('INSERT INTO elements VALUES (?,?,?,?,?)', elements)

# Insert inspections
inspections = [
    (1, 1, '2024-02-15', 'Dr. Roy',    1.8),
    (2, 1, '2024-08-20', 'Dr. Roy',    4.5),
    (3, 3, '2024-02-15', 'Eng. Das',   1.8),
    (4, 3, '2024-08-20', 'Eng. Das',   4.5),
    (5, 5, '2024-02-15', 'Dr. Barua',  1.8),
    (6, 5, '2024-08-20', 'Dr. Barua',  4.5),
]
cur.executemany('INSERT INTO inspections VALUES (?,?,?,?,?)', inspections)

# Insert measurements
measurements = [
    (1, 1, 'crack_width', 2.1, 'mm'),
    (2, 2, 'crack_width', 3.8, 'mm'),
    (3, 3, 'spalling_depth', 5.0, 'mm'),
    (4, 4, 'spalling_depth', 8.2, 'mm'),
    (5, 5, 'settlement', 42.0, 'mm'),
    (6, 6, 'settlement', 43.5, 'mm'),
    (7, 1, 'surface_erosion', 1.2, 'mm'),
    (8, 2, 'surface_erosion', 2.8, 'mm'),
]
cur.executemany('INSERT INTO measurements VALUES (?,?,?,?,?)', measurements)
db.commit()

# Query: all elements and their types
print("STRUCTURAL ELEMENTS")
print("=" * 50)
for row in cur.execute('SELECT id, name, type, location FROM elements'):
    print(f"  [{row[0]}] {row[1]:20s} | {row[2]:6s} | {row[3]}")

print(f"\
Total elements: {cur.execute('SELECT COUNT(*) FROM elements').fetchone()[0]}")
print(f"Total inspections: {cur.execute('SELECT COUNT(*) FROM inspections').fetchone()[0]}")
print(f"Total measurements: {cur.execute('SELECT COUNT(*) FROM measurements').fetchone()[0]}")`,
      challenge: 'Add 4 more elements (east wall, west wall, floor slab, staircase) and create inspection records for each. Query to find which element has the most inspections.',
      successHint: 'A well-designed database schema mirrors the real-world relationships between objects. Elements contain inspections, which contain measurements — a natural hierarchy.',
    },
    {
      title: 'Querying deterioration trends',
      concept: `The real power of a database is **analytical queries** — finding patterns that would be invisible in raw data.

Key SQL techniques:
- **JOIN**: combine data from multiple tables
- **GROUP BY**: aggregate measurements by element, type, or time period
- **HAVING**: filter aggregated results
- **Subqueries**: nest queries inside queries

For structural health, we want to answer:
- Which elements deteriorated most between inspections?
- Is monsoon damage worse than dry-season damage?
- Which element types need the most urgent attention?

📚 *We will write progressively complex SQL queries using JOINs, aggregation, and computed columns.*`,
      analogy: 'A database query is like asking a librarian a specific question: "Show me all books published after 2020 by authors from Tripura, sorted by rating." The librarian searches, filters, sorts, and hands you exactly what you need. SQL does the same for data.',
      storyConnection: 'The conservation team needs to prioritise limited repair funds. A query showing "North Wall crack width increased 81% during monsoon" is far more actionable than sifting through folders of hand-written notes.',
      checkQuestion: 'If a crack was 2.1 mm in February and 3.8 mm in August, what is the percentage increase?',
      checkAnswer: '(3.8 - 2.1) / 2.1 × 100 = 80.95% increase. In just 6 months of monsoon exposure, the crack nearly doubled in width. This rate of deterioration demands immediate attention.',
      codeIntro: 'Run analytical queries to identify the most deteriorated elements at Neermahal.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE elements (id INTEGER PRIMARY KEY, name TEXT, type TEXT);
CREATE TABLE inspections (id INTEGER PRIMARY KEY, element_id INTEGER, date TEXT, water_level REAL);
CREATE TABLE measurements (id INTEGER PRIMARY KEY, inspection_id INTEGER, metric TEXT, value REAL, unit TEXT);
''')

# Bulk insert
cur.executemany('INSERT INTO elements VALUES (?,?,?)', [
    (1,'North Wall','wall'), (2,'South Wall','wall'), (3,'Column A','column'),
    (4,'Column B','column'), (5,'Pile Group N','pile'), (6,'Arch East','arch'),
])
cur.executemany('INSERT INTO inspections VALUES (?,?,?,?)', [
    (1,1,'2024-02',1.8), (2,1,'2024-08',4.5), (3,2,'2024-02',1.8), (4,2,'2024-08',4.5),
    (5,3,'2024-02',1.8), (6,3,'2024-08',4.5), (7,5,'2024-02',1.8), (8,5,'2024-08',4.5),
])
cur.executemany('INSERT INTO measurements VALUES (?,?,?,?,?)', [
    (1,1,'crack_width',2.1,'mm'), (2,2,'crack_width',3.8,'mm'),
    (3,3,'crack_width',1.5,'mm'), (4,4,'crack_width',2.9,'mm'),
    (5,5,'spalling',5.0,'mm'),    (6,6,'spalling',8.2,'mm'),
    (7,7,'settlement',42.0,'mm'), (8,8,'settlement',43.5,'mm'),
])
db.commit()

# Query 1: Deterioration between dry and monsoon for each element
print("DETERIORATION ANALYSIS: Dry vs Monsoon")
print("=" * 65)
query = '''
SELECT e.name, m1.metric,
       m1.value AS dry_val, m2.value AS monsoon_val,
       ROUND((m2.value - m1.value) / m1.value * 100, 1) AS pct_change
FROM elements e
JOIN inspections i1 ON i1.element_id = e.id AND i1.date = '2024-02'
JOIN inspections i2 ON i2.element_id = e.id AND i2.date = '2024-08'
JOIN measurements m1 ON m1.inspection_id = i1.id
JOIN measurements m2 ON m2.inspection_id = i2.id AND m2.metric = m1.metric
ORDER BY pct_change DESC
'''
print(f"{'Element':<16} {'Metric':<14} {'Dry':>6} {'Monsoon':>8} {'Change':>8}")
print("-" * 65)
for row in cur.execute(query):
    print(f"{row[0]:<16} {row[1]:<14} {row[2]:>6.1f} {row[3]:>8.1f} {row[4]:>7.1f}%")

# Query 2: Average deterioration by element type
print("\
AVERAGE DETERIORATION BY TYPE")
print("-" * 40)
query2 = '''
SELECT e.type, COUNT(*) as n,
       ROUND(AVG((m2.value - m1.value) / m1.value * 100), 1) AS avg_pct
FROM elements e
JOIN inspections i1 ON i1.element_id = e.id AND i1.date = '2024-02'
JOIN inspections i2 ON i2.element_id = e.id AND i2.date = '2024-08'
JOIN measurements m1 ON m1.inspection_id = i1.id
JOIN measurements m2 ON m2.inspection_id = i2.id AND m2.metric = m1.metric
GROUP BY e.type ORDER BY avg_pct DESC
'''
for row in cur.execute(query2):
    print(f"  {row[0]:>8s}: {row[2]:>6.1f}% avg change ({row[1]} elements)")

print("\
Columns show the WORST deterioration — repair priority is clear.")`,
      challenge: 'Add a "priority" query that flags any element where deterioration exceeds 50% as "URGENT" and others as "MONITOR". Sort by priority.',
      successHint: 'SQL transforms raw inspection data into actionable intelligence. A few well-crafted queries can save a heritage structure by directing limited repair funds where they matter most.',
    },
    {
      title: 'Repair cost optimisation algorithm',
      concept: `With limited budget, conservation teams face an **optimisation problem**: which repairs give the most structural benefit per rupee spent?

This is a variant of the **knapsack problem** — one of the classic algorithms in computer science:
- You have a "knapsack" (budget) with limited capacity
- Each item (repair) has a cost and a value (structural benefit)
- You want to maximise total value without exceeding the budget

The **greedy approach** sorts by value-to-cost ratio and picks the best items first. The **dynamic programming** approach guarantees the optimal solution.

📚 *We will implement both approaches, store the results in our database, and compare their outputs.*`,
      analogy: 'You are at a buffet with a small plate (budget). Each dish (repair) takes different space (cost) and gives different satisfaction (structural benefit). The greedy strategy: fill your plate with the highest satisfaction-per-bite dishes first.',
      storyConnection: 'The government allocates a fixed annual budget for Neermahal conservation. With 8 elements needing repair and not enough money for all, the optimisation algorithm tells the conservation team exactly which repairs to prioritise.',
      checkQuestion: 'If you have 500,000 rupees and 3 repairs cost 200K, 350K, and 300K with benefits of 80, 90, and 85 points respectively, which combination maximises benefit within budget?',
      checkAnswer: 'Options within 500K: {200K+300K = 500K, benefit 165} or {200K alone = 200K, benefit 80} or {350K alone = 350K, benefit 90} or {300K alone = 300K, benefit 85}. Best: 200K + 300K for total benefit 165.',
      codeIntro: 'Implement a repair optimisation algorithm for Neermahal conservation.',
      code: `import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE repairs (
    id INTEGER PRIMARY KEY,
    element TEXT, description TEXT,
    cost_lakhs REAL, benefit_score REAL
);
CREATE TABLE repair_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT, total_cost REAL, total_benefit REAL, repairs_selected TEXT
);
''')

repairs = [
    (1, 'North Wall',  'Crack injection + waterproofing',  8.5, 85),
    (2, 'South Wall',  'Surface repair + coating',         5.2, 60),
    (3, 'Column A',    'Carbon fiber wrapping',            12.0, 92),
    (4, 'Column B',    'Concrete patching',                3.5, 45),
    (5, 'Pile Group N','Underwater grouting',              18.0, 95),
    (6, 'Arch East',   'Stone replacement + repointing',   7.0, 70),
    (7, 'Roof Slab',   'Membrane waterproofing',           6.5, 75),
    (8, 'Floor',       'Levelling + tile replacement',      4.0, 40),
]
cur.executemany('INSERT INTO repairs VALUES (?,?,?,?,?)', repairs)
db.commit()

budget = 25.0  # lakhs

# Greedy approach: sort by benefit/cost ratio
print("GREEDY APPROACH (best ratio first)")
print("=" * 60)
rows = cur.execute('SELECT * FROM repairs ORDER BY benefit_score/cost_lakhs DESC').fetchall()
greedy_cost, greedy_benefit, greedy_list = 0, 0, []
for r in rows:
    if greedy_cost + r[3] <= budget:
        greedy_cost += r[3]
        greedy_benefit += r[4]
        greedy_list.append(r[1])
        ratio = r[4] / r[3]
        print(f"  + {r[1]:14s}: {r[3]:5.1f}L, benefit={r[4]:3.0f}, ratio={ratio:.1f}")

print(f"  Total: {greedy_cost:.1f}L, Benefit: {greedy_benefit:.0f}")

# Dynamic programming (0-1 knapsack, costs in units of 0.5 lakhs)
print("\
DYNAMIC PROGRAMMING (optimal)")
print("=" * 60)
items = cur.execute('SELECT id, element, cost_lakhs, benefit_score FROM repairs').fetchall()
n = len(items)
W = int(budget * 2)  # work in 0.5-lakh units

dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    w = int(items[i-1][2] * 2)
    v = int(items[i-1][3])
    for j in range(W + 1):
        dp[i][j] = dp[i-1][j]
        if j >= w and dp[i-1][j-w] + v > dp[i][j]:
            dp[i][j] = dp[i-1][j-w] + v

# Trace back
dp_list, j = [], W
for i in range(n, 0, -1):
    if dp[i][j] != dp[i-1][j]:
        dp_list.append(items[i-1])
        j -= int(items[i-1][2] * 2)

dp_cost = sum(r[2] for r in dp_list)
dp_benefit = sum(r[3] for r in dp_list)
for r in dp_list:
    print(f"  + {r[1]:14s}: {r[2]:5.1f}L, benefit={r[3]:3.0f}")
print(f"  Total: {dp_cost:.1f}L, Benefit: {dp_benefit:.0f}")

# Compare
print(f"\
Greedy: {greedy_benefit:.0f} benefit for {greedy_cost:.1f}L")
print(f"Optimal: {dp_benefit:.0f} benefit for {dp_cost:.1f}L")
improvement = (dp_benefit - greedy_benefit) / greedy_benefit * 100
print(f"DP improves over greedy by {improvement:.1f}%")`,
      challenge: 'Add a constraint: at least one pile repair MUST be included (structural safety requirement). Modify the DP to enforce this mandatory inclusion.',
      successHint: 'Optimisation algorithms turn subjective "what should we fix first?" debates into objective, data-driven decisions. This is how engineering meets computer science.',
    },
    {
      title: 'Predicting future deterioration with regression',
      concept: `With historical measurement data, we can **predict future conditions** using regression analysis.

If crack width grows over time, fitting a model lets us answer: "When will this crack become dangerous?"

Common models:
- **Linear**: crack = a + b×years (constant growth rate)
- **Power law**: crack = a × years^b (accelerating or decelerating)
- **Exponential**: crack = a × e^{b×years} (accelerating — worst case)

We fit these models to historical data, pick the best fit (lowest error), and extrapolate to predict when intervention is needed.

📚 *We will store historical measurements in SQLite, retrieve them, fit multiple regression models using numpy, and plot predictions.*`,
      analogy: 'If a child grows 5 cm per year from age 5 to 10, you can predict their height at 15. Structural deterioration works similarly — past trends predict future conditions, letting engineers act before failure.',
      storyConnection: 'If we had been tracking Neermahal crack widths since 1990, we could predict exactly when each wall will need repair. This transforms conservation from reactive ("it broke, fix it") to proactive ("it will break in 5 years, schedule the repair now").',
      checkQuestion: 'A crack was 1 mm in 2000, 2 mm in 2010, and 4 mm in 2020. Is the growth linear, quadratic, or exponential?',
      checkAnswer: 'The crack doubled every 10 years: 1→2→4. This is exponential growth (doubling time ≈ 10 years). Linear would predict 3 mm in 2020 (not 4). Exponential prediction for 2030: 8 mm — potentially dangerous.',
      codeIntro: 'Fit deterioration models to historical data and predict when Neermahal elements need repair.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import sqlite3

db = sqlite3.connect(':memory:')
cur = db.cursor()
cur.execute('''CREATE TABLE crack_history (
    year INTEGER, element TEXT, width_mm REAL
)''')

# Historical crack data for North Wall
data = [(2000,1.0),(2004,1.3),(2008,1.8),(2012,2.4),(2016,3.2),(2020,3.8),(2024,4.6)]
for yr, w in data:
    cur.execute('INSERT INTO crack_history VALUES (?,?,?)', (yr, 'North Wall', w))
db.commit()

rows = cur.execute('SELECT year, width_mm FROM crack_history WHERE element="North Wall" ORDER BY year').fetchall()
years = np.array([r[0] for r in rows])
widths = np.array([r[1] for r in rows])
t = years - years[0]  # normalise to start at 0

# Fit models
# Linear: w = a + b*t
coeffs_lin = np.polyfit(t, widths, 1)
# Quadratic: w = a + b*t + c*t^2
coeffs_quad = np.polyfit(t, widths, 2)
# Exponential: log(w) = log(a) + b*t
coeffs_exp = np.polyfit(t, np.log(widths), 1)

t_pred = np.linspace(0, 40, 200)  # predict to 2040
w_lin = np.polyval(coeffs_lin, t_pred)
w_quad = np.polyval(coeffs_quad, t_pred)
w_exp = np.exp(np.polyval(coeffs_exp, t_pred))

# Danger threshold
danger = 8.0  # mm

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

ax.plot(years, widths, 'o', color='white', markersize=8, zorder=5, label='Measured')
ax.plot(t_pred + years[0], w_lin, '--', color='#34d399', linewidth=2, label='Linear fit')
ax.plot(t_pred + years[0], w_quad, '--', color='#f59e0b', linewidth=2, label='Quadratic fit')
ax.plot(t_pred + years[0], w_exp, '--', color='#f87171', linewidth=2, label='Exponential fit')
ax.axhline(y=danger, color='#ef4444', linewidth=2, linestyle=':', label=f'Danger ({danger} mm)')
ax.axvline(x=2024, color='#9ca3af', linewidth=1, linestyle=':', alpha=0.5)

ax.set_xlabel('Year', color='white', fontsize=12)
ax.set_ylabel('Crack Width (mm)', color='white', fontsize=12)
ax.set_title('North Wall Crack Prediction — Neermahal', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white')
ax.set_ylim(0, 12)
ax.set_xlim(1998, 2042)

plt.tight_layout()
plt.savefig('prediction.png', dpi=100, facecolor='#1f2937')
plt.show()

# When does each model predict danger?
for name, pred in [('Linear', w_lin), ('Quadratic', w_quad), ('Exponential', w_exp)]:
    danger_idx = np.where(pred >= danger)[0]
    if len(danger_idx) > 0:
        yr = t_pred[danger_idx[0]] + years[0]
        print(f"{name:12s} predicts danger ({danger}mm) in year {yr:.0f}")
    else:
        print(f"{name:12s} does not reach danger level by 2040")`,
      challenge: 'Fit the same models to a second element (South Wall) with different data. Which wall needs repair first? Store the prediction in the database.',
      successHint: 'Predictive modelling turns historical data into future actionable insights. For heritage conservation, this is the difference between saving and losing irreplaceable structures.',
    },
    {
      title: 'Full conservation management system',
      concept: `The capstone project combines everything: database design, structural physics, optimisation, and prediction into a **complete conservation management system**.

The system:
1. Stores all structural elements and their inspection history
2. Calculates current structural capacity using physics formulas
3. Predicts future deterioration using regression
4. Optimises repair scheduling within budget constraints
5. Generates a prioritised action report

This is a real-world application: similar systems are used by organisations like English Heritage, the National Trust, and UNESCO to manage thousands of heritage sites.

📚 *We will build the complete system using sqlite3, numpy, and formatted reporting — tying together every concept from Levels 1-3.*`,
      analogy: 'A conservation management system is like a doctor\'s practice management software — it tracks patients (elements), records checkups (inspections), stores test results (measurements), predicts health trends, and recommends treatments (repairs), all prioritised by urgency and budget.',
      storyConnection: 'Neermahal deserves a system like this. The palace is deteriorating, the budget is limited, and decisions must be data-driven. This capstone builds exactly the tool that could help save it.',
      checkQuestion: 'Why is it important to integrate physics calculations with database storage instead of keeping them separate?',
      checkAnswer: 'Integration ensures that structural assessments are based on actual measured data (not assumptions), predictions are automatically updated when new inspections are recorded, and repair priorities reflect both current condition and future risk. Separate systems lead to inconsistencies and missed connections.',
      codeIntro: 'Build a complete conservation management system for Neermahal.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
cur = db.cursor()

cur.executescript('''
CREATE TABLE elements (
    id INTEGER PRIMARY KEY, name TEXT, type TEXT,
    depth_m REAL, width_m REAL, capacity_kN REAL
);
CREATE TABLE inspections (
    id INTEGER PRIMARY KEY, element_id INTEGER,
    year INTEGER, crack_mm REAL, erosion_mm REAL
);
CREATE TABLE action_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    element TEXT, urgency TEXT, predicted_failure_year INTEGER,
    repair_cost_lakhs REAL, action TEXT
);
''')

# Elements with structural properties
elements = [
    (1,'North Wall','wall',4.5,10,500), (2,'South Wall','wall',4.0,12,600),
    (3,'Column A','column',0,0,300), (4,'East Arch','arch',3.0,6,250),
    (5,'Pile Group N','pile',8.0,0,800), (6,'Roof Slab','slab',0,0,400),
]
cur.executemany('INSERT INTO elements VALUES (?,?,?,?,?,?)', elements)

# Historical inspections
for eid in [1,2,3,4,5,6]:
    base_crack = [2.0, 1.5, 3.0, 1.8, 0.5, 2.5][eid-1]
    rate = [0.15, 0.10, 0.25, 0.12, 0.02, 0.18][eid-1]
    for yr in range(2010, 2025, 2):
        t = yr - 2010
        crack = base_crack + rate * t + np.random.normal(0, 0.1)
        erosion = 0.5 + 0.08 * t + np.random.normal(0, 0.05)
        cur.execute('INSERT INTO inspections (element_id,year,crack_mm,erosion_mm) VALUES (?,?,?,?)',
                    (eid, yr, round(max(0.1, crack), 2), round(max(0.1, erosion), 2)))
db.commit()

# Analysis for each element
print("NEERMAHAL CONSERVATION MANAGEMENT REPORT")
print("=" * 70)

rho, g = 1000, 9.81
danger_crack = 8.0  # mm

for elem in cur.execute('SELECT * FROM elements').fetchall():
    eid, name, etype, depth, width, capacity = elem

    # Get crack history
    rows = cur.execute('SELECT year, crack_mm FROM inspections WHERE element_id=? ORDER BY year', (eid,)).fetchall()
    years = np.array([r[0] for r in rows])
    cracks = np.array([r[1] for r in rows])

    # Linear regression for prediction
    t = years - years[0]
    coeffs = np.polyfit(t, cracks, 1)
    rate = coeffs[0]  # mm per year

    # Predict failure year
    current_crack = cracks[-1]
    if rate > 0:
        years_to_danger = (danger_crack - current_crack) / rate
        failure_year = 2024 + int(years_to_danger)
    else:
        failure_year = 9999

    # Current load (for walls)
    if depth > 0 and width > 0:
        current_force = 0.5 * rho * g * depth**2 * width / 1000  # kN
        utilisation = current_force / capacity * 100
    else:
        current_force = 0
        utilisation = current_crack / danger_crack * 100

    # Determine urgency
    if failure_year <= 2028:
        urgency = "CRITICAL"
    elif failure_year <= 2035:
        urgency = "HIGH"
    else:
        urgency = "MONITOR"

    repair_cost = round(rate * 10 + current_crack * 2, 1)

    cur.execute('INSERT INTO action_plan (element,urgency,predicted_failure_year,repair_cost_lakhs,action) VALUES (?,?,?,?,?)',
                (name, urgency, failure_year, repair_cost,
                 f"{'Immediate repair' if urgency=='CRITICAL' else 'Schedule repair' if urgency=='HIGH' else 'Continue monitoring'}"))

    print(f"\
{name} ({etype})")
    print(f"  Current crack: {current_crack:.1f} mm | Growth rate: {rate:.2f} mm/yr")
    print(f"  Predicted danger year: {failure_year} | Urgency: {urgency}")
    if depth > 0:
        print(f"  Current load: {current_force:.0f} kN / {capacity} kN ({utilisation:.0f}% utilised)")

# Final action plan
print("\
" + "=" * 70)
print("PRIORITISED ACTION PLAN")
print("=" * 70)
for row in cur.execute('SELECT element, urgency, predicted_failure_year, repair_cost_lakhs, action FROM action_plan ORDER BY predicted_failure_year'):
    print(f"  [{row[1]:8s}] {row[0]:14s} — fail by {row[2]} — cost {row[3]:5.1f}L — {row[4]}")

total = cur.execute("SELECT SUM(repair_cost_lakhs) FROM action_plan WHERE urgency IN ('CRITICAL','HIGH')").fetchone()[0]
print(f"\
Total urgent repair budget needed: {total:.1f} lakhs")`,
      challenge: 'Add a budget constraint of 30 lakhs and implement a knapsack optimiser to select the best subset of repairs. Store the optimised plan in a new table.',
      successHint: 'You have built a complete engineering management system from scratch — database, physics, prediction, and optimisation. This is exactly how real infrastructure is managed in the 21st century.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Conservation Management System</span>
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
