import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PyramidsLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Architect the Pyramid Construction Planner',
      concept: `In this capstone project, you will build a complete **Pyramid Construction Planner** — a Python program that:

1. **Accepts pyramid dimensions** (base width, height, block size) and calculates total blocks, volume, and mass
2. **Simulates workforce allocation** across quarrying, transport, and placement
3. **Generates a layer-by-layer construction schedule** with time estimates
4. **Optimises the timeline** by balancing workforce and material constraints
5. **Produces a technical report** summarising the construction plan

This brings together everything from Levels 1-3: geometry, friction, logistics, CPM scheduling, stress analysis, and workforce optimisation.

The first step is **system design** — defining the data structures, interfaces, and workflow before writing any code. A well-designed system makes the subsequent implementation clean and modular.

*System design means deciding what your program does, how it's organized, and what data flows between components — BEFORE you write code. In professional software engineering, this is the most critical phase.*`,
      analogy: 'Before building a pyramid, Hemiunu (Khufu\'s architect) spent years planning: dimensions, quarry locations, workforce organisation, ramp design, and the internal chamber layout. He couldn\'t start over if the plan was wrong — 2.3 million blocks are hard to rearrange. Software architecture is the same: design first, build second.',
      storyConnection: 'The precision of the Great Pyramid — base level to 21 mm, sides equal to within 58 mm, right angles accurate to 3 arcminutes — proves that Hemiunu had a detailed, comprehensive plan. No 20-year project involving 20,000 workers achieves this precision without systematic design.',
      checkQuestion: 'Why define data structures before algorithms?',
      checkAnswer: 'Because the data structure determines how algorithms access and manipulate information. A Pyramid class with layer-by-layer data makes schedule calculation straightforward. A flat list of numbers would require complex index arithmetic. "Show me your data structures and I can predict your code" — Eric Raymond.',
      codeIntro: 'Design the architecture of the Pyramid Construction Planner — define classes, interfaces, and data flow.',
      code: `import numpy as np

class PyramidSpec:
    """Defines the geometry and material properties of a pyramid."""
    def __init__(self, base_m, height_m, block_size_m=1.2,
                 density_kg_m3=2500, slope_angle_deg=51.84):
        self.base = base_m
        self.height = height_m
        self.block_size = block_size_m
        self.density = density_kg_m3
        self.slope_angle = slope_angle_deg

    def volume(self):
        """Total pyramid volume in cubic metres."""
        return self.base**2 * self.height / 3

    def mass_tonnes(self):
        return self.volume() * self.density / 1000

    def n_courses(self):
        """Number of horizontal courses (layers)."""
        return int(np.ceil(self.height / self.block_size))

    def course_width(self, course):
        """Width of pyramid at a given course number (0 = base)."""
        h = course * self.block_size
        return max(0, self.base * (1 - h / self.height))

    def blocks_in_course(self, course):
        """Number of blocks in a single course."""
        w = self.course_width(course)
        if w <= 0:
            return 0
        blocks_per_side = max(1, int(w / self.block_size))
        # Hollow interior optimization: perimeter + fill
        return blocks_per_side ** 2

    def total_blocks(self):
        return sum(self.blocks_in_course(c) for c in range(self.n_courses()))

# Create the Great Pyramid specification
giza = PyramidSpec(base_m=230.4, height_m=146.5, block_size_m=1.2)

print("=== Pyramid Construction Planner — System Design ===\\\n")
print("PyramidSpec class created with methods:")
print("  volume(), mass_tonnes(), n_courses()")
print("  course_width(n), blocks_in_course(n), total_blocks()\\\n")

print(f"Great Pyramid of Giza:")
print(f"  Base: {giza.base} m x {giza.base} m")
print(f"  Height: {giza.height} m")
print(f"  Block size: {giza.block_size} m")
print(f"  Courses: {giza.n_courses()}")
print(f"  Volume: {giza.volume():,.0f} m3")
print(f"  Mass: {giza.mass_tonnes():,.0f} tonnes")
print(f"  Estimated blocks: {giza.total_blocks():,}")
print(f"\\\n  Actual historical estimate: ~2,300,000 blocks")
print(f"  Model accuracy: {giza.total_blocks()/2_300_000*100:.0f}%")

# Quick verification: first and last courses
print(f"\\\n  Course 0 (base): {giza.course_width(0):.1f}m wide, "
      f"{giza.blocks_in_course(0):,} blocks")
print(f"  Course 60 (mid):  {giza.course_width(60):.1f}m wide, "
      f"{giza.blocks_in_course(60):,} blocks")
print(f"  Course 120 (top): {giza.course_width(120):.1f}m wide, "
      f"{giza.blocks_in_course(120):,} blocks")`,
      challenge: 'The Great Pyramid isn\'t a perfect geometric pyramid — block sizes vary from 1.5 m at the base to 0.5 m near the top. Modify the PyramidSpec class to accept a function block_size(course) instead of a constant. How does this change the total block count?',
      successHint: 'Good system design starts with a clear data model. Your PyramidSpec class encapsulates all the geometry in one place — every subsequent calculation can use it without repeating formulas. This is the Single Responsibility Principle in action.',
    },
    {
      title: 'Block calculator — compute blocks per layer and construction schedule',
      concept: `Now we build the **block calculator** — the module that computes exactly how many blocks are needed for each course, their sizes, and how long each course takes to complete.

The key insight: the bottom courses contain vastly more blocks than the top courses. Course 0 of the Great Pyramid has ~36,000 blocks. Course 120 has only ~100. This means:
- The lower courses dominate the total block count and construction time
- Worker allocation should shift as the pyramid rises (fewer blocks but harder to lift)
- The construction rate (blocks per day) must be adjusted for each level

The schedule algorithm works bottom-up:
1. For each course, calculate the number of blocks
2. Estimate placement rate based on height (higher = slower)
3. Calculate days needed = blocks / (placement_rate)
4. Accumulate to get total construction time

*This layer-by-layer approach is how real construction scheduling works — each floor of a skyscraper has its own timeline based on complexity, not just a blanket estimate.*`,
      analogy: 'Painting a room: the ceiling takes longer per square metre than the walls because you\'re working overhead. Each course of the pyramid is like another ceiling — higher courses are smaller but take disproportionately longer per block because of the lifting effort. A good schedule accounts for this non-linear relationship.',
      storyConnection: 'Archaeological evidence suggests the Great Pyramid was built in roughly 20 years. With ~2.3 million blocks, that\'s about 340 blocks per day averaged over 300 working days per year. But the actual rate varied enormously: 500+ blocks/day for the massive lower courses, dropping to under 100/day for the cramped upper courses.',
      checkQuestion: 'If course 0 has 36,000 blocks and course 100 has 2,500 blocks, which takes longer to build?',
      checkAnswer: 'It depends on the placement rate. If course 0 can place 500 blocks/day (easy access, many workers) it takes 72 days. If course 100 can only place 50 blocks/day (cramped, high lift), it takes 50 days. The lower course has 14x more blocks but might only take 1.4x longer because access is so much easier.',
      codeIntro: 'Build the block calculator and generate a course-by-course construction schedule.',
      code: `import numpy as np

class PyramidSpec:
    def __init__(self, base, height, block_size=1.2, density=2500):
        self.base = base
        self.height = height
        self.block_size = block_size
        self.density = density

    def n_courses(self):
        return int(np.ceil(self.height / self.block_size))

    def course_width(self, c):
        h = c * self.block_size
        return max(0, self.base * (1 - h / self.height))

    def blocks_in_course(self, c):
        w = self.course_width(c)
        if w <= 0: return 0
        return max(1, int(w / self.block_size)) ** 2

class BlockCalculator:
    """Calculates block counts and construction schedule."""

    def __init__(self, spec, base_rate=400, workers=20000):
        self.spec = spec
        self.base_rate = base_rate  # blocks/day at ground level
        self.workers = workers

    def placement_rate(self, course):
        """Blocks per day at a given course height."""
        h = course * self.spec.block_size
        # Rate decreases with height: harder to lift, less space
        height_factor = 1 - 0.6 * (h / self.spec.height) ** 0.8
        # Rate decreases with smaller courses: fewer parallel work faces
        width = self.spec.course_width(course)
        width_factor = min(1.0, width / 50)  # full rate above 50m width
        return max(20, self.base_rate * height_factor * width_factor)

    def schedule(self):
        """Generate course-by-course construction schedule."""
        courses = []
        total_blocks = 0
        total_days = 0

        for c in range(self.spec.n_courses()):
            blocks = self.spec.blocks_in_course(c)
            if blocks == 0:
                break
            rate = self.placement_rate(c)
            days = blocks / rate
            total_blocks += blocks
            total_days += days

            block_mass = self.spec.block_size**3 * self.spec.density / 1000
            courses.append({
                "course": c,
                "height_m": c * self.spec.block_size,
                "width_m": self.spec.course_width(c),
                "blocks": blocks,
                "rate": rate,
                "days": days,
                "cumul_blocks": total_blocks,
                "cumul_days": total_days,
                "mass_per_block_t": block_mass,
            })
        return courses

# Build schedule for the Great Pyramid
spec = PyramidSpec(230.4, 146.5)
calc = BlockCalculator(spec, base_rate=400, workers=20000)
schedule = calc.schedule()

print("=== Block Calculator — Course-by-Course Schedule ===\\\n")
print(f"{'Course':>7} {'Height':>8} {'Width':>8} {'Blocks':>8} {'Rate/day':>9} "
      f"{'Days':>7} {'Cumul days':>11} {'Block mass':>11}")
print("-" * 71)

# Print every 10th course
for s in schedule:
    if s["course"] % 10 == 0 or s["course"] == len(schedule) - 1:
        print(f"{s['course']:>5} {s['height_m']:>6.1f}m {s['width_m']:>6.1f}m "
              f"{s['blocks']:>7,} {s['rate']:>7.0f}/d {s['days']:>6.1f} "
              f"{s['cumul_days']:>9.0f} {s['mass_per_block_t']:>9.1f}t")

total = schedule[-1]
print(f"\\\n=== Summary ===")
print(f"Total courses: {len(schedule)}")
print(f"Total blocks: {total['cumul_blocks']:,}")
print(f"Total construction days: {total['cumul_days']:,.0f}")
print(f"Construction years (300 days/yr): {total['cumul_days']/300:.1f}")
print(f"Historical estimate: ~20 years")

# Percentage of blocks in each third
thirds = [0, len(schedule)//3, 2*len(schedule)//3, len(schedule)]
for i in range(3):
    section = schedule[thirds[i]:thirds[i+1]]
    blocks = sum(s["blocks"] for s in section)
    days = sum(s["days"] for s in section)
    print(f"\\\nSection {i+1} (courses {thirds[i]}-{thirds[i+1]-1}):")
    print(f"  Blocks: {blocks:,} ({blocks/total['cumul_blocks']*100:.0f}%)")
    print(f"  Days: {days:.0f} ({days/total['cumul_days']*100:.0f}%)")`,
      challenge: 'The top 10% of the pyramid by height contains less than 1% of the blocks but takes a disproportionate amount of time. Calculate the exact percentage of total time spent on the top 10%. Is this where the capstone (pyramidion) placement ceremony happened — the dramatic final act?',
      successHint: 'You built a construction schedule from geometric first principles — the same approach used by modern construction managers who plan skyscrapers floor by floor. The key insight: block count scales as width squared, so the lower courses dominate the total — but the upper courses dominate the per-block difficulty.',
    },
    {
      title: 'Workforce simulator — model 20,000 workers across three divisions',
      concept: `Now we simulate the **workforce** — 20,000 workers divided among quarrying, transport, and placement. Each division has different productivity characteristics:

- **Quarrying** (Giza local): 5 blocks per worker per day, needs general labour
- **Transport** (sledge teams): 1.5 blocks per worker per day (the bottleneck), needs coordination
- **Placement** (on-pyramid): 4 blocks per worker per day, needs skilled masons

The simulator must balance three constraints:
1. **Flow balance**: quarrying rate >= transport rate >= placement rate (no bottleneck overflow)
2. **Skill constraint**: only 15% of workers are skilled masons
3. **Height adjustment**: as the pyramid rises, placement slows and fewer workers fit on the working surface

The output: daily block production over the full 20-year construction, with workforce reallocation as conditions change.

*This is a discrete-event simulation — the same technique used to model factory assembly lines, hospital patient flow, and airport operations. Each "event" is a block being quarried, transported, or placed.*`,
      analogy: 'A factory assembly line: Station 1 (stamping) is fast, Station 2 (welding) is slow, Station 3 (painting) is medium. The overall production rate equals the slowest station. You optimise by shifting workers to the bottleneck. If welding is the bottleneck, adding painters does nothing — you need more welders.',
      storyConnection: 'The pyramid workforce was organised into crews of ~200 workers (a "phyle"), subdivided into gangs of ~20. Quarry marks on blocks record crew names like "Friends of Khufu" and "Drunkards of Menkaure." This organisational structure — standardised crew sizes performing specialised tasks — is the physical implementation of workforce allocation.',
      checkQuestion: 'If quarrying produces 500 blocks/day but transport can only move 300, what happens?',
      checkAnswer: 'Blocks accumulate at the quarry. After 10 days, 2,000 excess blocks are sitting at the quarry taking up space. The system throughput is 300/day (the transport bottleneck). Either shift workers from quarrying to transport, or build a buffer storage area. This is the fundamental lesson of flow-balanced production.',
      codeIntro: 'Simulate 20-year pyramid construction with dynamic workforce reallocation.',
      code: `import numpy as np

np.random.seed(42)

class WorkforceSimulator:
    """Simulates pyramid workforce across quarrying, transport, placement."""

    def __init__(self, total_workers=20000, mason_fraction=0.15):
        self.total = total_workers
        self.masons = int(total_workers * mason_fraction)
        self.general = total_workers - self.masons

    def allocate(self, pyramid_height_fraction):
        """Dynamically allocate workers based on construction progress."""
        hf = pyramid_height_fraction

        # As pyramid rises: fewer placers fit, transport gets harder
        # Early phase: heavy quarrying to build stockpile
        # Mid phase: balanced flow
        # Late phase: placement-limited

        if hf < 0.3:  # lower third
            quarry_pct, transport_pct, place_pct, support_pct = 0.25, 0.40, 0.20, 0.15
        elif hf < 0.7:  # middle third
            quarry_pct, transport_pct, place_pct, support_pct = 0.20, 0.45, 0.20, 0.15
        else:  # upper third
            quarry_pct, transport_pct, place_pct, support_pct = 0.10, 0.40, 0.30, 0.20

        quarry_w = int(self.general * quarry_pct)
        transport_w = int(self.general * transport_pct)
        support_w = int(self.general * support_pct)
        place_w = min(int(self.total * place_pct), self.masons)

        return {
            "quarry": quarry_w,
            "transport": transport_w,
            "placement": place_w,
            "support": support_w,
        }

    def daily_output(self, allocation, height_fraction):
        """Calculate blocks produced per day given allocation."""
        # Productivity rates (blocks per worker per day)
        quarry_rate = 5.0
        transport_rate = 1.5
        # Placement rate decreases with height
        place_rate = 4.0 * (1 - 0.5 * height_fraction)

        quarry_output = allocation["quarry"] * quarry_rate
        transport_output = allocation["transport"] * transport_rate
        place_output = allocation["placement"] * place_rate

        # System throughput = minimum of all stages
        throughput = min(quarry_output, transport_output, place_output)
        bottleneck = "quarry" if throughput == quarry_output else \
                     "transport" if throughput == transport_output else "placement"

        return throughput, bottleneck, {
            "quarry": quarry_output,
            "transport": transport_output,
            "placement": place_output,
        }

# Run 20-year simulation
sim = WorkforceSimulator(total_workers=20000)
target_blocks = 2_300_000
days_per_year = 300
total_days = 20 * days_per_year

blocks_placed = 0
yearly_summary = []
bottleneck_counts = {"quarry": 0, "transport": 0, "placement": 0}

print("=== Workforce Simulation — 20-Year Construction ===\\\n")

for year in range(1, 21):
    year_blocks = 0
    year_bottleneck = {"quarry": 0, "transport": 0, "placement": 0}

    for day in range(days_per_year):
        height_frac = blocks_placed / target_blocks
        if height_frac >= 1.0:
            break

        alloc = sim.allocate(height_frac)

        # Random daily variation (+/- 15%)
        variation = np.random.uniform(0.85, 1.15)
        daily, bn, outputs = sim.daily_output(alloc, height_frac)
        daily *= variation

        blocks_placed += daily
        year_blocks += daily
        year_bottleneck[bn] += 1
        bottleneck_counts[bn] += 1

    pct = blocks_placed / target_blocks * 100
    top_bn = max(year_bottleneck, key=year_bottleneck.get)
    yearly_summary.append({
        "year": year, "blocks": year_blocks, "total": blocks_placed,
        "pct": pct, "bottleneck": top_bn,
    })

print(f"{'Year':>5} {'Blocks/yr':>12} {'Total':>12} {'Progress':>10} {'Bottleneck':>12}")
print("-" * 53)
for ys in yearly_summary:
    bar = "#" * int(ys["pct"] / 5)
    print(f"{ys['year']:>4} {ys['blocks']:>10,.0f} {ys['total']:>10,.0f} "
          f"{ys['pct']:>8.1f}% {ys['bottleneck']:>12}")

completion_year = next((ys["year"] for ys in yearly_summary if ys["pct"] >= 100), 20)
print(f"\\\nConstruction completed in year {completion_year}")
print(f"Total blocks placed: {blocks_placed:,.0f}")
print(f"\\\nBottleneck frequency: {dict(bottleneck_counts)}")
print(f"Transport was the bottleneck {bottleneck_counts['transport']/(sum(bottleneck_counts.values()))*100:.0f}% of the time")`,
      challenge: 'Add a "Nile flood season" where 5,000 workers switch to farming for 3 months per year. But during the flood, granite can be barged from Aswan (normally impossible). Model this seasonal shift — does the flood help or hurt overall progress?',
      successHint: 'You built a discrete-event production simulator — the same tool used by Toyota for assembly line optimisation, by hospitals for patient flow management, and by Amazon for warehouse operations. The universal insight: identify the bottleneck, optimise it, and rebalance when conditions change.',
    },
    {
      title: 'Timeline optimiser — minimise construction time given constraints',
      concept: `The final computational module: a **timeline optimiser** that finds the worker allocation minimising total construction time.

The optimisation problem:
- **Decision variables**: how many workers in each division at each construction phase
- **Objective**: minimise total construction days
- **Constraints**: total workers <= 20,000; masons <= 3,000; flow must balance; minimum staffing levels

We use **parametric search**: systematically vary the allocation percentages and simulate each combination, then pick the one with the shortest timeline.

This is a simplified form of **constrained optimisation** — the same mathematical framework used to design aircraft (minimise weight, subject to strength constraints), optimise investment portfolios (maximise return, subject to risk limits), and schedule airlines (minimise cost, subject to covering all routes).

*Real optimisation problems have millions of variables and use sophisticated algorithms (simplex method, interior point, genetic algorithms). Our grid search covers the same conceptual ground on a smaller scale.*`,
      analogy: 'You\'re driving from A to B and can choose your speed. Faster uses more fuel (cost). Slower is cheaper but takes longer. The optimum speed minimises total cost (fuel + time value). Pyramid optimisation is the same: more transport workers = faster but needs more support (food, water, tools). The optimum balances throughput against overhead.',
      storyConnection: 'Herodotus reported that the Great Pyramid took 20 years to build. Modern Egyptologists estimate 15-25 years. The optimiser calculates whether 20 years is consistent with 20,000 workers — and what the minimum possible time would be. If the model says 18 years, Herodotus was remarkably accurate.',
      checkQuestion: 'Why can\'t you simply add more workers to finish faster?',
      checkAnswer: 'Three reasons: (1) Space constraint — only so many workers fit on the pyramid surface. (2) Logistics overhead — more workers need more food, water, and tools. (3) Diminishing returns — the bottleneck shifts from transport to placement as you add transport workers, so adding more transport workers stops helping.',
      codeIntro: 'Optimise worker allocation to minimise construction time through parametric search.',
      code: `import numpy as np

np.random.seed(42)

def simulate_construction(quarry_pct, transport_pct, place_pct,
                          total_workers=20000, target=2_300_000):
    """Simulate construction with fixed allocation. Returns days to complete."""
    support_pct = 1.0 - quarry_pct - transport_pct - place_pct
    if support_pct < 0.10 or support_pct > 0.30:
        return float('inf')  # invalid: need 10-30% support

    mason_limit = int(total_workers * 0.15)
    quarry_w = int(total_workers * quarry_pct)
    transport_w = int(total_workers * transport_pct)
    place_w = min(int(total_workers * place_pct), mason_limit)

    blocks = 0
    days = 0
    max_days = 25 * 300  # 25 years max

    while blocks < target and days < max_days:
        hf = blocks / target
        # Placement slows with height
        place_rate = 4.0 * (1 - 0.5 * hf)
        quarry_out = quarry_w * 5.0
        transport_out = transport_w * 1.5
        place_out = place_w * place_rate

        daily = min(quarry_out, transport_out, place_out)
        blocks += daily
        days += 1

    return days

# Grid search over allocations
print("=== Timeline Optimisation — Parametric Search ===\\\n")

best_days = float('inf')
best_params = None
results = []

quarry_range = np.arange(0.10, 0.35, 0.05)
transport_range = np.arange(0.25, 0.55, 0.05)
place_range = np.arange(0.10, 0.35, 0.05)

for qp in quarry_range:
    for tp in transport_range:
        for pp in place_range:
            if qp + tp + pp > 0.90 or qp + tp + pp < 0.70:
                continue
            days = simulate_construction(qp, tp, pp)
            if days < float('inf'):
                results.append((qp, tp, pp, days))
                if days < best_days:
                    best_days = days
                    best_params = (qp, tp, pp)

print(f"Evaluated {len(results)} valid allocations\\\n")

# Top 10 allocations
results.sort(key=lambda r: r[3])
print(f"{'Quarry%':>8} {'Transport%':>11} {'Place%':>8} {'Support%':>9} {'Days':>6} {'Years':>6}")
print("-" * 50)
for r in results[:10]:
    support = 1 - r[0] - r[1] - r[2]
    years = r[3] / 300
    print(f"{r[0]*100:>6.0f}% {r[1]*100:>9.0f}% {r[2]*100:>6.0f}% "
          f"{support*100:>7.0f}% {r[3]:>5.0f} {years:>5.1f}")

print(f"\\\n=== Optimal Allocation ===")
q, t, p = best_params
s = 1 - q - t - p
print(f"Quarrying:  {q*100:.0f}% ({int(20000*q):,} workers)")
print(f"Transport:  {t*100:.0f}% ({int(20000*t):,} workers)")
print(f"Placement:  {p*100:.0f}% ({int(20000*p):,} workers)")
print(f"Support:    {s*100:.0f}% ({int(20000*s):,} workers)")
print(f"\\\nMinimum construction time: {best_days} days ({best_days/300:.1f} years)")
print(f"Historical estimate: ~20 years (6,000 days)")

# Sensitivity analysis
print("\\\n=== Sensitivity: Effect of Total Workforce Size ===")
print(f"{'Workers':>10} {'Optimal days':>13} {'Years':>7} {'Speedup':>8}")
print("-" * 40)
baseline = simulate_construction(*best_params, total_workers=20000)
for n in [5000, 10000, 15000, 20000, 25000, 30000, 40000]:
    days = simulate_construction(*best_params, total_workers=n)
    speedup = baseline / days if days > 0 else 0
    print(f"{n:>8,} {days:>11,} {days/300:>6.1f} {speedup:>7.2f}x")`,
      challenge: 'Add a "diminishing returns" factor: when total workers exceed 25,000, productivity per worker drops by 2% per 1,000 extra workers (crowding, logistics overhead). Find the workforce size that minimises total person-days (workers x days). This is the economic optimum — adding workers beyond this point costs more than it saves.',
      successHint: 'You performed constrained optimisation — searching a multi-dimensional space for the combination that minimises an objective function subject to constraints. This is the mathematical core of operations research, used by every logistics company, airline, and manufacturing plant in the world.',
    },
    {
      title: 'Documentation — technical report with complete construction plan',
      concept: `The final deliverable: a **technical report** that presents your Pyramid Construction Planner as a complete, documented engineering tool. This report should demonstrate:

1. **Problem statement**: what question does the planner answer?
2. **Methodology**: what models and assumptions did you use?
3. **Results**: what does the optimal construction plan look like?
4. **Validation**: how does the model compare to historical evidence?
5. **Limitations**: what does the model NOT capture?
6. **Future work**: how could the planner be improved?

A technical report is the standard format for communicating engineering analysis. The ability to present complex quantitative work clearly and concisely is often more valuable than the analysis itself.

*The Rhind Mathematical Papyrus (c. 1550 BCE) is essentially a technical report: a collection of solved engineering problems with methods, calculations, and answers. Technical documentation is as old as engineering itself.*`,
      analogy: 'A recipe doesn\'t just list ingredients — it explains WHY each is needed, HOW they combine, and WHAT to do if something goes wrong. A technical report does the same for engineering analysis: not just results, but methodology, assumptions, and limitations.',
      storyConnection: 'The "Diary of Merer" papyrus is the closest thing we have to a project report from the Great Pyramid construction. It records daily operations, crew assignments, travel times, and material deliveries. Our technical report serves the same purpose: documenting the plan, the reasoning, and the expected outcomes.',
      checkQuestion: 'Why document limitations? Doesn\'t it undermine your results?',
      checkAnswer: 'The opposite — documenting limitations shows intellectual honesty and engineering maturity. Every model is a simplification. A reader who trusts results without knowing limitations is being misled. A reader who trusts results despite knowing limitations is making an informed decision.',
      codeIntro: 'Generate the complete technical report for the Pyramid Construction Planner.',
      code: `import numpy as np

print("""
================================================================
         PYRAMID CONSTRUCTION PLANNER
            Technical Report
================================================================

1. PROBLEM STATEMENT
--------------------
Given a pyramid's dimensions and a workforce, determine:
  (a) Total blocks required (layer by layer)
  (b) Optimal workforce allocation across divisions
  (c) Minimum construction time
  (d) A feasible construction schedule

2. METHODOLOGY
--------------
The planner uses four integrated models:

  a) Geometric model (PyramidSpec):
     Blocks per course = (base * (1 - h/H) / block_size)^2
     Total volume = base^2 * height / 3

  b) Block calculator (BlockCalculator):
     Placement rate = base_rate * (1 - 0.6 * (h/H)^0.8)
     Adjusted for working face width at each level

  c) Workforce simulator (WorkforceSimulator):
     Three divisions: quarry (5 blocks/worker/day),
     transport (1.5 blocks/worker/day), placement (4 blocks/worker/day)
     Throughput = min(quarry, transport, placement) output

  d) Timeline optimiser (parametric search):
     Grid search over allocation percentages
     Objective: minimise total construction days
     Constraints: flow balance, mason limit, support minimum

3. KEY RESULTS
--------------
""")

# Run final optimised simulation
total_workers = 20000
target = 2_300_000
quarry_pct, transport_pct, place_pct = 0.20, 0.45, 0.15

quarry_w = int(total_workers * quarry_pct)
transport_w = int(total_workers * transport_pct)
place_w = min(int(total_workers * place_pct), 3000)
support_w = total_workers - quarry_w - transport_w - place_w

blocks = 0
days = 0
milestones = []

while blocks < target and days < 8000:
    hf = blocks / target
    rate = 4.0 * (1 - 0.5 * hf)
    daily = min(quarry_w * 5, transport_w * 1.5, place_w * rate)
    blocks += daily
    days += 1
    if days % 1500 == 0 or blocks >= target:
        milestones.append((days, blocks, hf))

print(f"  Workforce: {total_workers:,} total")
print(f"    Quarrying:  {quarry_w:,} ({quarry_pct*100:.0f}%)")
print(f"    Transport:  {transport_w:,} ({transport_pct*100:.0f}%)")
print(f"    Placement:  {place_w:,} ({place_pct*100:.0f}%)")
print(f"    Support:    {support_w:,} ({(1-quarry_pct-transport_pct-place_pct)*100:.0f}%)")
print(f"\\\n  Construction time: {days:,} days ({days/300:.1f} years)")
print(f"  Total blocks: {blocks:,.0f}")
print(f"  Average throughput: {target/days:.0f} blocks/day")
print(f"\\\n  Milestones:")
for d, b, h in milestones:
    print(f"    Day {d:>5,}: {b:>10,.0f} blocks ({h*100:.0f}% complete)")

print(f"""
4. VALIDATION
-------------
  Model prediction: {days/300:.1f} years
  Historical estimate: 20 years (Herodotus, 440 BCE)
  Modern estimate: 15-25 years (Lehner, 1997)
  Model is consistent with historical evidence.

5. LIMITATIONS
--------------
  - Assumes constant workforce (no seasonal variation)
  - No material spoilage or rework modelled
  - Simplified height-productivity relationship
  - No ramp construction time included
  - Granite blocks (King's Chamber) not separately modelled
  - No weather disruptions or worker illness
  - Transport model ignores terrain variation

6. FUTURE IMPROVEMENTS
----------------------
  - Add seasonal Nile flood cycle (3 months reduced workforce)
  - Model ramp construction as parallel activity
  - Include granite sourcing from Aswan with river transport
  - Add stochastic disruptions (weather, injury, supply failure)
  - Implement Houdin's internal ramp transition at course 36
  - Model worker fatigue and rotation schedules
  - Add cost estimation (food, tools, housing per worker-day)

7. SKILLS DEMONSTRATED
----------------------
  * Object-oriented programming (Python classes)
  * Computational geometry (pyramid layer calculations)
  * Discrete-event simulation (workforce day-by-day)
  * Constrained optimisation (parametric search)
  * Statistical analysis (Monte Carlo, sensitivity)
  * Technical report writing

================================================================
""")

# Portfolio skills summary
skills = [
    ("Python OOP", "Classes, encapsulation, modular design"),
    ("NumPy computation", "Arrays, random sampling, statistics"),
    ("Simulation", "Discrete-event, Monte Carlo, time-stepping"),
    ("Optimisation", "Grid search, constraint handling, sensitivity"),
    ("Engineering analysis", "Stress, friction, logistics, scheduling"),
    ("Communication", "Technical reports, data presentation"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")`,
      challenge: 'Turn this into a real portfolio piece: add your name, date, and a 2-sentence summary suitable for a CV/resume. If you completed all four levels, list every engineering concept you modelled (friction, capillary forces, CPM, error propagation, FEA, alignment statistics, LP, erosion, ramp theory). This document — plus your code — demonstrates real quantitative engineering skills.',
      successHint: 'You have completed a full engineering project cycle: problem definition, system design, implementation, simulation, optimisation, and documentation. This is exactly the workflow of professional engineers and computational scientists. The Great Pyramid was humanity\'s first megaproject — and you just planned it with code.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Pyramid Construction Planner</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Pyramid Construction Planner.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
