import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KanglaFortLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fort engineering database — storing structure data in SQL',
      concept: `Real engineering projects generate massive amounts of data: soil samples, water levels, structural measurements, maintenance records. A **relational database** using **SQLite** organises this data into tables that can be queried efficiently.

For the Kangla Fort, we need tables for:
- **sections** — segments of the moat with their dimensions
- **soil_samples** — composition data from different locations
- **water_levels** — daily depth measurements
- **maintenance** — repair history

SQL (Structured Query Language) lets us ask questions like:
- "Which sections have the shallowest depth?"
- "When was the last time each section was repaired?"
- "What is the average soil clay content near the weakest sections?"

\`sqlite3\` is built into Python and runs entirely in memory — perfect for learning.`,
      analogy: 'A database is like a filing cabinet with labelled drawers. Each drawer (table) holds one type of document (records). You can quickly find any document by looking in the right drawer and reading the label — instead of digging through a pile of unsorted papers.',
      storyConnection: 'The Meitei kingdom maintained records of the Kangla Fort for centuries — dimensions, repairs, flood events. A modern database lets us do the same thing, but with instant search and analysis capabilities.',
      checkQuestion: 'Why use a database instead of just storing data in Python lists?',
      checkAnswer: 'Lists work for small data, but databases handle millions of records efficiently. They support complex queries (JOIN, GROUP BY, WHERE), prevent duplicate data through normalization, and persist data to disk. A list of 100,000 water level readings would be slow to search; a database indexes it for instant lookups.',
      codeIntro: 'Create a Kangla Fort engineering database with multiple related tables.',
      code: `import sqlite3

# Create in-memory database
db = sqlite3.connect(':memory:')
cursor = db.cursor()

# Create tables
cursor.executescript('''
CREATE TABLE sections (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    length_m REAL,
    width_m REAL,
    depth_m REAL,
    bank_slope_deg REAL
);

CREATE TABLE soil_samples (
    id INTEGER PRIMARY KEY,
    section_id INTEGER REFERENCES sections(id),
    sand_pct REAL, silt_pct REAL, clay_pct REAL, gravel_pct REAL,
    sample_date TEXT
);

CREATE TABLE water_levels (
    id INTEGER PRIMARY KEY,
    section_id INTEGER REFERENCES sections(id),
    depth_m REAL,
    measurement_date TEXT
);
''')

# Insert section data
sections = [
    ('North Gate', 320, 14, 2.8, 35),
    ('East Wall', 410, 16, 3.2, 40),
    ('South Gate', 290, 13, 2.5, 30),
    ('West Wall', 380, 15, 3.0, 38),
    ('NE Corner', 180, 12, 2.2, 32),
]
cursor.executemany('INSERT INTO sections (name,length_m,width_m,depth_m,bank_slope_deg) VALUES (?,?,?,?,?)', sections)

# Insert soil samples
soils = [
    (1, 35, 30, 20, 15, '1750-03-15'), (1, 38, 28, 22, 12, '1750-06-10'),
    (2, 30, 35, 25, 10, '1750-03-20'), (2, 32, 33, 24, 11, '1750-06-15'),
    (3, 45, 25, 15, 15, '1750-04-01'), (3, 50, 22, 13, 15, '1750-06-20'),
    (4, 33, 32, 22, 13, '1750-04-10'), (5, 40, 28, 18, 14, '1750-04-15'),
]
cursor.executemany('INSERT INTO soil_samples (section_id,sand_pct,silt_pct,clay_pct,gravel_pct,sample_date) VALUES (?,?,?,?,?,?)', soils)

# Query: section summary with soil data
print("=== Kangla Fort Moat Engineering Database ===\
")
cursor.execute('''
    SELECT s.name, s.length_m, s.width_m, s.depth_m,
           ROUND(AVG(ss.clay_pct), 1) as avg_clay,
           ROUND(s.length_m * s.width_m * s.depth_m, 0) as volume
    FROM sections s
    LEFT JOIN soil_samples ss ON s.id = ss.section_id
    GROUP BY s.id
    ORDER BY volume DESC
''')
print(f"{'Section':<14} {'Length':>6} {'Width':>6} {'Depth':>6} {'Clay%':>6} {'Volume':>8}")
print("-" * 52)
for row in cursor.fetchall():
    print(f"{row[0]:<14} {row[1]:>5.0f}m {row[2]:>5.0f}m {row[3]:>5.1f}m {row[4]:>5.1f}% {row[5]:>7.0f}m³")

# Find weakest section
cursor.execute('''
    SELECT name, depth_m, bank_slope_deg FROM sections
    ORDER BY depth_m ASC LIMIT 1
''')
weak = cursor.fetchone()
print(f"\
Weakest section: {weak[0]} (only {weak[1]}m deep, slope {weak[2]}°)")

db.close()`,
      challenge: 'Add a water_levels table with monthly readings for each section. Write a query to find the section with the lowest minimum water level — that is the most vulnerable point.',
      successHint: 'You just built a relational database for engineering data management. This is how real infrastructure projects track their assets — from ancient forts to modern bridges.',
    },
    {
      title: 'Sluice gate control algorithm — automated water management',
      concept: `Modern water management uses **algorithms** to decide when to open and close gates. We can design a control algorithm for the Kangla Fort moat that:

1. Reads current water levels from sensors (our database)
2. Checks weather forecasts (predicted rainfall)
3. Decides gate actions based on rules
4. Logs all decisions for review

This is a **rule-based control system** — the ancestor of modern PID controllers and AI-based systems. We store the rules, sensor readings, and decisions in SQLite for full traceability.`,
      analogy: 'An automated sluice gate controller is like a thermostat for your house. The thermostat reads the temperature (sensor), compares it to your desired range (rules), and turns heating on/off (actuator). Our system reads water levels, compares to safe ranges, and opens/closes gates.',
      storyConnection: 'The Kangla Fort had human gate operators who made these decisions based on experience. Our algorithm encodes their knowledge into software — making the same decisions they would, but consistently and without fatigue.',
      checkQuestion: 'Why log every gate decision in a database instead of just executing it?',
      checkAnswer: 'Logging creates an audit trail. If the moat overflows, engineers can review the decision log to find what went wrong. Was the rule incorrect? Was the sensor faulty? Without logs, debugging is impossible. This principle applies to all automated systems — from water management to financial trading.',
      codeIntro: 'Build an automated sluice gate controller with decision logging in SQLite.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE gate_config (
    id INTEGER PRIMARY KEY,
    gate_name TEXT, section_id INTEGER,
    min_level REAL, max_level REAL, target_level REAL
);
CREATE TABLE sensor_readings (
    id INTEGER PRIMARY KEY, gate_id INTEGER,
    water_level REAL, rainfall_mm REAL, timestamp TEXT
);
CREATE TABLE gate_decisions (
    id INTEGER PRIMARY KEY, gate_id INTEGER,
    action TEXT, reason TEXT, timestamp TEXT
);
INSERT INTO gate_config VALUES (1, 'North Sluice', 1, 2.0, 3.5, 2.8);
INSERT INTO gate_config VALUES (2, 'South Sluice', 3, 2.0, 3.5, 2.8);
INSERT INTO gate_config VALUES (3, 'East Overflow', 2, 2.0, 3.5, 2.8);
''')

def control_gate(gate_id, water_level, rainfall_forecast, timestamp):
    """Rule-based gate control algorithm"""
    c.execute('SELECT gate_name, min_level, max_level, target_level FROM gate_config WHERE id=?', (gate_id,))
    name, min_l, max_l, target = c.fetchone()

    # Store sensor reading
    c.execute('INSERT INTO sensor_readings (gate_id, water_level, rainfall_mm, timestamp) VALUES (?,?,?,?)',
              (gate_id, water_level, rainfall_forecast, timestamp))

    # Decision logic
    if water_level > max_l:
        action, reason = 'OPEN_FULL', f'Level {water_level:.1f}m exceeds max {max_l}m — emergency drain'
    elif water_level > max_l - 0.3 and rainfall_forecast > 20:
        action, reason = 'OPEN_HALF', f'Level {water_level:.1f}m near max and {rainfall_forecast}mm rain forecast — preventive drain'
    elif water_level < min_l:
        action, reason = 'CLOSE', f'Level {water_level:.1f}m below min {min_l}m — retain water'
    elif water_level < target and rainfall_forecast < 5:
        action, reason = 'CLOSE', f'Level {water_level:.1f}m below target {target}m, no rain expected'
    else:
        action, reason = 'HOLD', f'Level {water_level:.1f}m in safe range'

    c.execute('INSERT INTO gate_decisions (gate_id, action, reason, timestamp) VALUES (?,?,?,?)',
              (gate_id, action, reason, timestamp))
    return name, action, reason

# Simulate a week of monsoon conditions
np.random.seed(42)
print("=== Kangla Fort Automated Gate Control ===\
")
print(f"{'Day':>4} {'Gate':<16} {'Level':>6} {'Rain':>6} {'Action':<12} {'Reason'}")
print("-" * 85)

for day in range(1, 8):
    for gate_id in [1, 2, 3]:
        level = 2.5 + np.random.normal(0, 0.4) + (0.3 if day in [3,4,5] else -0.1)
        rain = max(0, np.random.normal(15 if day in [3,4,5] else 3, 5))
        ts = f'1750-07-{day:02d}'
        name, action, reason = control_gate(gate_id, level, rain, ts)
        if action != 'HOLD':
            print(f"  {day:>2}  {name:<16} {level:>5.1f}m {rain:>5.0f}mm {action:<12} {reason}")

# Summary
c.execute('SELECT action, COUNT(*) FROM gate_decisions GROUP BY action ORDER BY COUNT(*) DESC')
print("\
--- Decision Summary ---")
for action, count in c.fetchall():
    print(f"  {action}: {count} decisions")

db.close()`,
      challenge: 'Add a new rule: if three consecutive readings show rising water levels AND rain > 30mm, trigger an "ALERT" action. This requires looking at historical readings in the database.',
      successHint: 'You just built a rule-based control system with full audit logging. This is the foundation of SCADA systems that manage water infrastructure worldwide.',
    },
    {
      title: 'Structural health monitoring — detecting moat deterioration',
      concept: `Over centuries, a moat deteriorates: banks erode, sediment fills the bottom, sluice gates rust. A **structural health monitoring** system tracks measurements over time and uses algorithms to detect problems before they become catastrophic.

Key metrics to monitor:
- **Bank angle** — if it decreases, the bank is eroding
- **Effective depth** — sediment reduces the usable depth
- **Seepage rate** — increasing seepage means the clay lining is failing
- **Gate flow capacity** — corrosion reduces gate efficiency

We use **moving averages** and **threshold alerts** to detect trends in the data. A single bad reading might be noise, but a consistent downward trend is a real problem.`,
      analogy: 'Structural health monitoring is like regular health checkups for a building. Just as a doctor tracks your blood pressure over years to spot trends, engineers track a structure\'s vital signs over decades. A single measurement means little — the trend tells the story.',
      storyConnection: 'The Kangla Fort survived for nearly 2,000 years because the Meitei maintained it. They inspected the moat, repaired banks, dredged sediment, and replaced gates. Our monitoring system automates the inspection process.',
      checkQuestion: 'If the effective depth of a moat section decreases by 2cm per year due to sediment, how long before a 3m-deep section becomes only 2m deep (crossable)?',
      checkAnswer: '(3.0 - 2.0) / 0.02 = 50 years. This is why regular dredging is essential. Without maintenance, the moat loses 1m of depth in 50 years — going from impassable to dangerous. The monitoring system would flag this trend decades before it becomes critical.',
      codeIntro: 'Build a structural health monitoring system that detects moat deterioration from sensor data.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE monitoring (
    id INTEGER PRIMARY KEY,
    section TEXT, metric TEXT,
    value REAL, year INTEGER
);
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY,
    section TEXT, metric TEXT,
    alert_type TEXT, message TEXT, year INTEGER
);
''')

# Generate 50 years of monitoring data with realistic deterioration
np.random.seed(42)
sections = ['North Gate', 'East Wall', 'South Gate']
years = range(1750, 1800)

for section in sections:
    base_depth = {'North Gate': 2.8, 'East Wall': 3.2, 'South Gate': 2.5}[section]
    sediment_rate = {'North Gate': 0.015, 'East Wall': 0.02, 'South Gate': 0.025}[section]

    for yr in years:
        age = yr - 1750
        # Depth decreases with sediment
        depth = base_depth - sediment_rate * age + np.random.normal(0, 0.05)
        # Bank angle decreases with erosion
        angle = 35 - 0.1 * age + np.random.normal(0, 1)
        # Seepage increases over time
        seepage = 0.5 + 0.02 * age + np.random.normal(0, 0.1)

        c.execute('INSERT INTO monitoring (section,metric,value,year) VALUES (?,?,?,?)', (section, 'depth', depth, yr))
        c.execute('INSERT INTO monitoring (section,metric,value,year) VALUES (?,?,?,?)', (section, 'bank_angle', angle, yr))
        c.execute('INSERT INTO monitoring (section,metric,value,year) VALUES (?,?,?,?)', (section, 'seepage_rate', seepage, yr))

# Alert detection: 5-year moving average trends
def detect_alerts(section, metric, threshold_rate, direction='decrease'):
    c.execute('''
        SELECT year, AVG(value) as avg_val
        FROM monitoring WHERE section=? AND metric=?
        GROUP BY year ORDER BY year
    ''', (section, metric))
    rows = c.fetchall()
    for i in range(5, len(rows)):
        recent_avg = np.mean([r[1] for r in rows[i-5:i]])
        older_avg = np.mean([r[1] for r in rows[i-10:i-5]]) if i >= 10 else recent_avg
        rate = (recent_avg - older_avg) / 5
        if (direction == 'decrease' and rate < -threshold_rate) or \
           (direction == 'increase' and rate > threshold_rate):
            msg = f"{metric} changing at {rate:.3f}/yr (threshold: {threshold_rate})"
            c.execute('INSERT INTO alerts (section,metric,alert_type,message,year) VALUES (?,?,?,?,?)',
                      (section, metric, 'WARNING', msg, rows[i][0]))

for section in sections:
    detect_alerts(section, 'depth', 0.015, 'decrease')
    detect_alerts(section, 'seepage_rate', 0.015, 'increase')

# Report
print("=== Kangla Fort Structural Health Report ===\
")
c.execute('''
    SELECT section, metric,
           MIN(value) as min_val, MAX(value) as max_val,
           ROUND(AVG(CASE WHEN year >= 1795 THEN value END), 2) as recent_avg
    FROM monitoring GROUP BY section, metric ORDER BY section, metric
''')
print(f"{'Section':<14} {'Metric':<14} {'Min':>6} {'Max':>6} {'Recent':>7}")
print("-" * 50)
for row in c.fetchall():
    print(f"{row[0]:<14} {row[1]:<14} {row[2]:>5.2f} {row[3]:>5.2f} {row[4]:>6.2f}")

c.execute('SELECT section, COUNT(*) as alerts FROM alerts GROUP BY section ORDER BY alerts DESC')
print("\
--- Alert Count by Section ---")
for row in c.fetchall():
    print(f"  {row[0]}: {row[1]} alerts")

c.execute('SELECT section, message, year FROM alerts ORDER BY year DESC LIMIT 5')
print("\
--- Most Recent Alerts ---")
for row in c.fetchall():
    print(f"  [{row[2]}] {row[0]}: {row[1]}")

db.close()`,
      challenge: 'Add a "CRITICAL" alert level when the depth drops below 2.0m in any section. How many critical alerts are generated? Which section hits critical first?',
      successHint: 'Structural health monitoring saves lives and money. You just built a system that detects slow deterioration — the kind of failure that is invisible day-to-day but catastrophic over decades.',
    },
    {
      title: 'Optimal repair scheduling — the knapsack problem',
      concept: `The fort has limited repair budget and many sections needing work. Each repair has a **cost** and a **benefit** (improved defence score). We want to maximize total benefit within the budget — this is the classic **0/1 Knapsack Problem**.

The knapsack problem is NP-hard in general, but for reasonable input sizes, **dynamic programming** solves it exactly. The key insight: for each item, we either include it or not, and we build up solutions from smaller subproblems.

The DP table: \`dp[i][w]\` = maximum benefit using first i repairs with budget w.

Recurrence:
- If repair i costs more than w: \`dp[i][w] = dp[i-1][w]\` (skip it)
- Otherwise: \`dp[i][w] = max(dp[i-1][w], dp[i-1][w-cost_i] + benefit_i)\``,
      analogy: 'The knapsack problem is like packing for a trip with weight limits. You have 10 items but can only carry 15 kg. Each item has a weight and a usefulness rating. You want to pack the most useful combination that fits. The dynamic programming approach tries all combinations efficiently — without actually checking every single one.',
      storyConnection: 'The Meitei kingdom faced this exact problem every dry season: limited workers, multiple sections needing repair. Which repairs give the most defence improvement per unit of labour? This is resource allocation — the core of all project management.',
      checkQuestion: 'Why can\'t we just sort repairs by benefit/cost ratio and pick from the top?',
      checkAnswer: 'The greedy approach (best ratio first) does not always give the optimal solution. Example: budget=10, item A costs 6 with benefit 8 (ratio 1.33), item B costs 5 with benefit 5 (ratio 1.0), item C costs 5 with benefit 5 (ratio 1.0). Greedy picks A (benefit 8, remaining budget 4, nothing else fits). Optimal picks B+C (benefit 10). Dynamic programming finds the true optimum.',
      codeIntro: 'Solve the repair scheduling problem using dynamic programming with full database tracking.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE repairs (
    id INTEGER PRIMARY KEY,
    section TEXT, description TEXT,
    cost INTEGER, benefit REAL
);
CREATE TABLE schedule (
    id INTEGER PRIMARY KEY,
    repair_id INTEGER REFERENCES repairs(id),
    budget_used INTEGER, cumulative_benefit REAL
);
''')

# Available repairs
repairs = [
    ('North Gate', 'Dredge sediment (0.5m)', 3000, 8.5),
    ('North Gate', 'Rebuild bank slope', 5000, 7.0),
    ('East Wall', 'Replace sluice gate', 8000, 9.5),
    ('East Wall', 'Clay lining repair', 4000, 6.0),
    ('South Gate', 'Deepen by 0.5m', 6000, 9.0),
    ('South Gate', 'Widen by 2m', 7000, 5.5),
    ('West Wall', 'Erosion control', 2000, 4.0),
    ('West Wall', 'Overflow channel', 4500, 7.5),
    ('NE Corner', 'Complete rebuild', 10000, 10.0),
    ('NE Corner', 'Temporary patching', 1500, 3.0),
]
for r in repairs:
    c.execute('INSERT INTO repairs (section,description,cost,benefit) VALUES (?,?,?,?)', r)

budget = 18000  # total budget in labour-units

# Dynamic programming knapsack
n = len(repairs)
# Create DP table
dp = np.zeros((n + 1, budget + 1))
for i in range(1, n + 1):
    cost = repairs[i-1][2]
    benefit = repairs[i-1][3]
    for w in range(budget + 1):
        dp[i][w] = dp[i-1][w]  # don't take item i
        if cost <= w:
            dp[i][w] = max(dp[i][w], dp[i-1][w-cost] + benefit)

# Backtrack to find selected repairs
selected = []
w = budget
for i in range(n, 0, -1):
    if dp[i][w] != dp[i-1][w]:
        selected.append(i-1)
        w -= repairs[i-1][2]

selected.reverse()
total_cost = sum(repairs[i][2] for i in selected)
total_benefit = sum(repairs[i][3] for i in selected)

# Store in schedule table
cum_benefit = 0
for idx, repair_idx in enumerate(selected):
    cum_benefit += repairs[repair_idx][3]
    c.execute('INSERT INTO schedule (repair_id, budget_used, cumulative_benefit) VALUES (?,?,?)',
              (repair_idx + 1, repairs[repair_idx][2], cum_benefit))

print(f"=== Optimal Repair Schedule (Budget: {budget:,}) ===\
")
print(f"{'#':>2} {'Section':<14} {'Description':<25} {'Cost':>7} {'Benefit':>8}")
print("-" * 60)
for idx in selected:
    r = repairs[idx]
    print(f"{idx+1:>2} {r[0]:<14} {r[1]:<25} {r[2]:>6,} {r[3]:>7.1f}")
print("-" * 60)
print(f"{'Total':<42} {total_cost:>6,} {total_benefit:>7.1f}")
print(f"\
Budget remaining: {budget - total_cost:,}")
print(f"Efficiency: {total_benefit/total_cost*1000:.1f} benefit per 1000 budget")

# Compare with greedy
greedy_order = sorted(range(n), key=lambda i: repairs[i][3]/repairs[i][2], reverse=True)
greedy_cost, greedy_benefit, greedy_picks = 0, 0, []
for i in greedy_order:
    if greedy_cost + repairs[i][2] <= budget:
        greedy_cost += repairs[i][2]
        greedy_benefit += repairs[i][3]
        greedy_picks.append(i)
print(f"\
Greedy approach: benefit={greedy_benefit:.1f}, cost={greedy_cost:,}")
print(f"DP is {((total_benefit-greedy_benefit)/greedy_benefit*100):+.1f}% better than greedy")

db.close()`,
      challenge: 'What if you increase the budget to 25,000? Does the DP solution change? At what budget level can you afford ALL repairs?',
      successHint: 'The knapsack problem appears everywhere: project management, portfolio optimization, cargo loading, even choosing which features to build in a software sprint. Dynamic programming is one of the most powerful algorithm design techniques.',
    },
    {
      title: 'Full fort simulation — integrating all systems',
      concept: `The capstone project integrates everything: database storage, hydraulic calculations, gate control, and monitoring into a single **fort management simulation**.

We simulate one year of Kangla Fort operation:
- Monthly rainfall drives water inflow
- Sluice gates respond automatically
- Sediment accumulates
- Structural health is monitored
- All data is stored in SQLite for analysis

This is how real infrastructure management works: multiple interacting systems, all tracked in a database, with algorithms making decisions based on data.`,
      analogy: 'A full fort simulation is like a flight simulator for engineers. Just as pilots practice emergency landings without crashing real planes, engineers use simulations to test how their systems handle floods, droughts, and structural failures — without risking real infrastructure.',
      storyConnection: 'The Kangla Fort operated as an integrated system for nearly two millennia. Water, earth, gates, and human decisions all worked together. This simulation captures that integration in code — showing how the pieces connect.',
      checkQuestion: 'Why is integration testing harder than testing individual components?',
      checkAnswer: 'Individual components might work perfectly alone but fail when combined. A sluice gate controller that works in isolation might conflict with the flood routing model. Integration testing reveals emergent problems — issues that only appear when systems interact. This is why real engineering projects spend more time on integration testing than unit testing.',
      codeIntro: 'Run a complete one-year simulation of Kangla Fort operations with all systems integrated.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE monthly_state (
    month INTEGER, water_level REAL, sediment_depth REAL,
    inflow REAL, outflow REAL, gate_action TEXT,
    alert TEXT
);
CREATE TABLE annual_summary (
    metric TEXT, value REAL
);
''')

np.random.seed(42)

# Monthly rainfall (mm) — Imphal pattern
rainfall = np.array([15, 28, 55, 110, 185, 260, 310, 280, 210, 120, 35, 12])
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

# Fort parameters
moat_area = 1580 * 15  # m²
water_level = 2.5       # starting level
sediment = 0.0          # accumulated sediment
gate_capacity = 0.05    # max drain rate (m/hour)
min_level, max_level, target = 2.0, 3.5, 2.8
effective_depth = 3.0

alerts_count = 0
flood_events = 0
drought_events = 0

print("=== Kangla Fort — One Year Simulation ===\
")
print(f"{'Month':>5} {'Rain':>6} {'Level':>6} {'Sed.':>5} {'Gate':>12} {'Alert'}")
print("-" * 55)

for m in range(12):
    # Calculate inflow from rain
    rain_m = rainfall[m] / 1000  # convert mm to metres
    rain_volume = rain_m * moat_area
    inflow = rain_m * 0.7  # 70% of rain reaches moat (runoff coefficient)

    # Sediment accumulation (higher in monsoon)
    sed_rate = 0.002 if rainfall[m] > 100 else 0.0005
    sediment += sed_rate

    # Gate control
    projected_level = water_level + inflow
    if projected_level > max_level:
        gate_action = 'OPEN_FULL'
        outflow = min(gate_capacity * 720, projected_level - target)  # drain to target
    elif projected_level > max_level - 0.3 and rainfall[m] > 150:
        gate_action = 'OPEN_HALF'
        outflow = min(gate_capacity * 360, projected_level - target)
    elif projected_level < min_level:
        gate_action = 'CLOSED'
        outflow = 0
    else:
        gate_action = 'NORMAL'
        outflow = max(0, (projected_level - target) * 0.3)

    # Update water level
    evaporation = 0.05 if rainfall[m] < 50 else 0.02
    water_level = water_level + inflow - outflow - evaporation
    water_level = max(0.5, min(water_level, effective_depth - sediment))

    # Alerts
    alert = ''
    if water_level > max_level - 0.2:
        alert = 'FLOOD RISK'
        flood_events += 1
        alerts_count += 1
    elif water_level < min_level + 0.2:
        alert = 'LOW WATER'
        drought_events += 1
        alerts_count += 1
    elif sediment > 0.1:
        alert = 'DREDGE NEEDED'
        alerts_count += 1

    print(f"{months[m]:>5} {rainfall[m]:>5}mm {water_level:>5.2f}m {sediment:>4.3f} {gate_action:>12} {alert}")

    c.execute('INSERT INTO monthly_state VALUES (?,?,?,?,?,?,?)',
              (m+1, water_level, sediment, inflow, outflow, gate_action, alert))

# Annual summary
summaries = [
    ('Total rainfall (mm)', sum(rainfall)),
    ('Final water level (m)', water_level),
    ('Sediment accumulated (m)', sediment),
    ('Flood risk events', flood_events),
    ('Drought risk events', drought_events),
    ('Total alerts', alerts_count),
    ('Effective depth remaining (m)', effective_depth - sediment),
]
c.executemany('INSERT INTO annual_summary VALUES (?,?)', summaries)

print("\
=== Annual Summary ===")
c.execute('SELECT * FROM annual_summary')
for metric, value in c.fetchall():
    if isinstance(value, float) and value < 10:
        print(f"  {metric}: {value:.3f}")
    else:
        print(f"  {metric}: {value:.0f}")

c.execute('SELECT gate_action, COUNT(*) FROM monthly_state GROUP BY gate_action')
print("\
Gate actions:")
for action, count in c.fetchall():
    print(f"  {action}: {count} months")

db.close()`,
      challenge: 'Extend the simulation to 10 years. Track how sediment accumulates over a decade and when dredging becomes critical. Add a dredging event that resets sediment to 0 when it exceeds 0.15m.',
      successHint: 'You just built an integrated infrastructure simulation with database persistence. This is the capstone of hydraulic engineering: understanding how water, earth, time, and human decisions interact over long periods.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fort Management Systems</span>
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
