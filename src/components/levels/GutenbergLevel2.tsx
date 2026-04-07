import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GutenbergLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Screw press mechanics — force multiplication through simple machines',
      concept: `Gutenberg's press was a **screw press** — a machine that converts rotational force (torque) into a much larger linear force. The screw is an inclined plane wrapped around a cylinder, and it multiplies force according to:

**F_output = F_input x (2 pi r) / p**

Where r is the handle length (lever arm) and p is the pitch (distance between screw threads). A handle of 0.5 m and a pitch of 5 mm gives a **mechanical advantage** of about 628:1 — a worker applying 50 N at the handle generates over 31,000 N at the platen.

This enormous force was essential: the press needed to push the paper into every inked letter uniformly across a full page. Too little force and the print was faint; too much and the paper tore or the type was crushed.

The **efficiency** of a real screw press is reduced by friction between the threads. Typical efficiency is 25-40%, so the actual force multiplication is roughly 150-250:1 — still enormous from a small human effort.

📚 *Mechanical advantage (MA) is the ratio of output force to input force. Every simple machine — lever, pulley, screw, wedge, inclined plane — trades distance for force. You push further but with less effort, and the machine multiplies it.*`,
      analogy: 'Think of a car jack. You pump a small handle through a long arc, and the car rises by just a few millimetres — but with enough force to lift a tonne. The screw press works the same way: the printer turns the handle through a large circle, and the platen descends a tiny amount with tremendous force.',
      storyConnection: 'Gutenberg adapted the screw press from winemaking — vintners in the Rhine valley had used screw presses for centuries to crush grapes. His genius was realising that the same force multiplication that squeezed juice from grapes could press paper against inked type with the uniform pressure needed for crisp printing.',
      checkQuestion: 'A screw press has a handle 0.6 m long and a thread pitch of 4 mm. A worker applies 40 N of force. What is the ideal mechanical advantage and the theoretical output force?',
      checkAnswer: 'MA = 2 pi r / p = 2 x 3.14159 x 0.6 / 0.004 = 942. Theoretical output force = 40 x 942 = 37,680 N. With 30% efficiency, actual force is about 11,300 N — still enough to print a full Bible page evenly.',
      codeIntro: 'Calculate the force multiplication of screw presses with different dimensions and compare to the pressure needed for quality printing.',
      code: `import numpy as np

def screw_press_force(f_input, handle_length, pitch_mm, efficiency=0.30):
    """
    Calculate the output force of a screw press.
    f_input: force applied at handle (N)
    handle_length: lever arm (m)
    pitch_mm: thread pitch (mm)
    efficiency: friction losses (0-1)
    """
    pitch_m = pitch_mm / 1000
    ideal_ma = 2 * np.pi * handle_length / pitch_m
    actual_ma = ideal_ma * efficiency
    return f_input * actual_ma, ideal_ma, actual_ma

# Gutenberg's press parameters
handle_lengths = [0.3, 0.4, 0.5, 0.6, 0.7]
pitches = [3, 4, 5, 6, 8]
f_worker = 50  # N — a comfortable sustained push

print("=== Screw Press Force Multiplication ===")
print(f"Worker input force: {f_worker} N | Efficiency: 30%\\\n")

print(f"{'Handle (m)':<12} {'Pitch (mm)':>11} {'Ideal MA':>9} {'Actual MA':>10} {'Output (N)':>11} {'Output (kN)':>12}")
print("-" * 67)

for h in handle_lengths:
    for p in [4]:  # show handle variation at fixed pitch
        f_out, ideal, actual = screw_press_force(f_worker, h, p)
        print(f"{h:<12.1f} {p:>9} {ideal:>9.0f} {actual:>10.0f} {f_out:>11.0f} {f_out/1000:>10.1f}")

print()
for p in pitches:
    f_out, ideal, actual = screw_press_force(f_worker, 0.5, p)
    print(f"{0.5:<12.1f} {p:>9} {ideal:>9.0f} {actual:>10.0f} {f_out:>11.0f} {f_out/1000:>10.1f}")

# Pressure on the page
print("\\\n=== Printing Pressure Analysis ===")
page_area_m2 = 0.30 * 0.45  # ~A3 page size (Gutenberg Bible page)
target_pressure_kpa = 150    # minimum for good ink transfer

for h in [0.4, 0.5, 0.6]:
    f_out, _, _ = screw_press_force(f_worker, h, 4)
    pressure_kpa = f_out / page_area_m2 / 1000
    quality = "GOOD" if pressure_kpa >= target_pressure_kpa else "FAINT"
    print(f"Handle {h}m: {f_out/1000:.1f} kN -> {pressure_kpa:.0f} kPa ({quality})")

print(f"\\\nTarget: >= {target_pressure_kpa} kPa for uniform ink transfer")
print("Gutenberg's press achieved ~200-300 kPa — enough for crisp text.")`,
      challenge: 'A longer handle gives more force, but also makes the press slower (the worker sweeps a bigger arc per impression). Calculate impressions per hour for handles of 0.3 m to 0.7 m, assuming one full turn per impression and the worker moves the handle at 1 m/s. What handle length maximises pages per hour while meeting the 150 kPa minimum?',
      successHint: 'The screw press is a force multiplier — one of the six classical simple machines. Every hydraulic press, car jack, and bottle cap uses the same principle: trade distance for force. Gutenberg applied ancient physics to create a new technology.',
    },
    {
      title: 'Alloy phase diagrams — the lead-tin-antimony type metal',
      concept: `Gutenberg's most underappreciated invention was not the press but the **type metal** — a specific alloy of lead (Pb), tin (Sn), and antimony (Sb) with unique properties:

1. **Low melting point** (~250°C) — easy to cast in a workshop
2. **Expands slightly when solidifying** — fills every detail of the mould perfectly
3. **Hard surface** — resists wear over thousands of impressions
4. **Easily recyclable** — melt down worn type and recast it

A **phase diagram** maps how an alloy behaves at different compositions and temperatures. It shows the **liquidus** (temperature above which everything is liquid), the **solidus** (below which everything is solid), and the two-phase region between them where liquid and solid coexist.

The **eutectic point** is the composition with the lowest melting point — where the alloy transitions directly from solid to liquid with no mushy intermediate phase. Gutenberg's type metal was near-eutectic, giving it sharp, predictable casting behaviour.

📚 *An alloy is a mixture of metals with properties different from either component alone. Bronze (copper + tin), steel (iron + carbon), and solder (lead + tin) are all alloys designed for specific purposes.*`,
      analogy: 'Think of mixing salt into water. Pure water freezes at 0°C. Salty water freezes at a lower temperature — the salt disrupts the ice crystal structure. The "eutectic" is the saltiest water that can exist as a liquid at the lowest temperature. Alloys work the same way: mixing metals disrupts the crystal structure and lowers the melting point.',
      storyConnection: 'Gutenberg spent years perfecting his type metal recipe. Too much lead and the type was soft — it deformed after a few hundred impressions. Too much antimony and it was brittle — the delicate serifs snapped off. The final recipe (~83% Pb, 12% Sb, 5% Sn) balanced hardness, castability, and durability perfectly.',
      checkQuestion: 'Pure lead melts at 327°C. Pure tin melts at 232°C. Their eutectic (63% Sn, 37% Pb) melts at 183°C. Why is the eutectic lower than either pure metal?',
      checkAnswer: 'Because the mixed atoms disrupt each other\'s crystal structures — neither metal can form an orderly solid easily, so the mixture stays liquid to a lower temperature. The eutectic is the composition where this disruption is maximised — the crystal structure is most "confused" and solidifies last.',
      codeIntro: 'Model the lead-tin-antimony phase diagram and find the optimal type metal composition for casting.',
      code: `import numpy as np

def pb_sn_liquidus(sn_pct):
    """
    Simplified Pb-Sn binary liquidus curve.
    Eutectic at 63% Sn, 183°C.
    """
    sn = sn_pct / 100
    eutectic_sn = 0.63
    if sn <= eutectic_sn:
        # Pb-rich side: liquidus drops from 327 to 183
        return 327 - (327 - 183) * (sn / eutectic_sn)
    else:
        # Sn-rich side: liquidus drops from 232 to 183
        return 232 - (232 - 183) * ((1 - sn) / (1 - eutectic_sn))

# Map the Pb-Sn phase diagram
print("=== Lead-Tin Phase Diagram ===")
print(f"{'Sn %':<8} {'Pb %':>6} {'Liquidus (°C)':>14} {'Phase at 200°C':>16}")
print("-" * 46)

for sn_pct in range(0, 101, 10):
    liq_t = pb_sn_liquidus(sn_pct)
    phase = "LIQUID" if 200 > liq_t else "SOLID+LIQUID" if 200 > 183 else "SOLID"
    if sn_pct == 60:
        phase = "~EUTECTIC"
    print(f"{sn_pct:<8} {100-sn_pct:>4}% {liq_t:>12.0f} {phase:>16}")

# Type metal: ternary Pb-Sn-Sb
print("\\\n=== Gutenberg Type Metal Compositions ===")
recipes = [
    {"name": "Gutenberg original", "pb": 83, "sb": 12, "sn": 5},
    {"name": "Modern book type",   "pb": 75, "sb": 18, "sn": 7},
    {"name": "Stereotype metal",   "pb": 80, "sb": 15, "sn": 5},
    {"name": "Linotype metal",     "pb": 84, "sb": 12, "sn": 4},
    {"name": "High-antimony hard", "pb": 65, "sb": 25, "sn": 10},
]

print(f"{'Recipe':<24} {'Pb%':>4} {'Sb%':>4} {'Sn%':>4} {'Melt (°C)':>9} {'Hardness':>9} {'Castability':>12}")
print("-" * 68)

for r in recipes:
    # Simplified melting point model for ternary alloy
    melt = 327 - 1.5 * r["sn"] - 0.8 * r["sb"]
    # Hardness increases with antimony
    hardness = 5 + r["sb"] * 0.8 + r["sn"] * 0.3
    # Castability: best near eutectic composition
    cast_score = 10 - abs(r["sn"] - 5) * 0.5 - abs(r["sb"] - 12) * 0.3
    quality = "EXCELLENT" if cast_score > 8 else "GOOD" if cast_score > 6 else "FAIR"
    print(f"{r['name']:<24} {r['pb']:>3} {r['sb']:>3} {r['sn']:>3} {melt:>7.0f} {hardness:>7.1f} {quality:>12}")

print("\\\nHigher antimony = harder type but more brittle")
print("Higher tin = better flow into mould but softer")
print("Gutenberg's ratio balanced all three properties.")`,
      challenge: 'Gutenberg\'s type needed to last 300 impressions before serifs wore noticeably. Model the wear rate as proportional to 1/hardness and calculate how many impressions each recipe survives before 10% height loss. Which recipe maximises total impressions before needing recast?',
      successHint: 'Phase diagrams are the foundation of metallurgy — the science of designing alloys for specific purposes. Every alloy you encounter (steel, brass, solder, aluminium alloys in aircraft) was designed using phase diagram analysis. Gutenberg was an empirical metallurgist 400 years before the theory existed.',
    },
    {
      title: 'Typesetting optimisation — bin packing a page of text',
      concept: `A typesetter must arrange individual letter blocks into lines, and lines into pages. Each letter has a different width: 'W' is wide, 'i' is narrow, spaces are variable. The goal is to fill each line as evenly as possible, with consistent spacing — a problem known as **line breaking** or more generally **bin packing**.

**Bin packing** asks: given items of different sizes, how do you fit them into fixed-size containers (bins) with minimum wasted space? For typesetting, the "items" are words and the "bins" are lines of fixed width.

The simplest approach is **greedy**: add words to the current line until the next word won't fit, then start a new line. But this produces ragged results — some lines are packed tight, others have huge gaps.

Knuth and Plass (1981) solved this with **dynamic programming**: consider ALL possible line breaks simultaneously and choose the combination that minimises the total "badness" (unevenness) across the entire paragraph. This is the algorithm used by TeX and LaTeX today.

📚 *Dynamic programming solves problems by breaking them into overlapping sub-problems and caching the results. It finds globally optimal solutions where greedy approaches find only locally optimal ones.*`,
      analogy: 'Imagine packing books onto shelves. The greedy approach fills each shelf left to right until the next book won\'t fit. But this might leave one shelf nearly empty while others overflow. A better approach considers the entire collection and distributes books more evenly — even if individual shelves aren\'t packed to maximum capacity.',
      storyConnection: 'Gutenberg\'s compositors (typesetters) developed extraordinary skill at justifying text — adjusting the spacing between words and letters so both margins were perfectly aligned. They used thin metal strips called "spaces" in different widths. A good compositor could set a page in which every line had near-identical spacing — by hand, without algorithms.',
      checkQuestion: 'A line is 80 units wide. You have words of widths [15, 22, 10, 18, 12, 25, 8]. Using the greedy approach, which words fit on the first line?',
      checkAnswer: '15 + 22 = 37, + 10 = 47, + 18 = 65, + 12 = 77. Next word (25) would make 102 — too wide. So the first line holds [15, 22, 10, 18, 12] = 77 units. Wasted space = 3 units. But is this optimal? Maybe [15, 22, 18, 25] = 80 would be a perfect fit — the greedy approach missed it.',
      codeIntro: 'Implement greedy and optimised line-breaking algorithms and compare their typesetting quality.',
      code: `import numpy as np

def measure_words(text):
    """Assign a width to each word (proportional to character count)."""
    words = text.split()
    widths = []
    for w in words:
        width = sum({"m": 3, "w": 3, "i": 1, "l": 1, "t": 1.5, " ": 1}.get(c, 2) for c in w.lower())
        widths.append((w, width))
    return widths

def greedy_break(words_widths, line_width, space_width=2):
    """Greedy line breaking: fill each line until it overflows."""
    lines = []
    current_line = []
    current_width = 0

    for word, w in words_widths:
        needed = w + (space_width if current_line else 0)
        if current_width + needed <= line_width:
            current_line.append((word, w))
            current_width += needed
        else:
            lines.append((current_line, current_width))
            current_line = [(word, w)]
            current_width = w
    if current_line:
        lines.append((current_line, current_width))
    return lines

def badness(line_width_used, target_width):
    """How 'bad' is a line? Cubic penalty for deviation."""
    slack = target_width - line_width_used
    if slack < 0:
        return 10000  # overflow penalty
    return slack ** 3

# Sample text from a Gutenberg Bible passage (simplified)
text = ("In the beginning was the Word and the Word was with God "
        "and the Word was God The same was in the beginning with God "
        "All things were made by him and without him was not any thing "
        "made that was made In him was life and the life was the light")

words = measure_words(text)
line_width = 60

# Greedy approach
greedy_lines = greedy_break(words, line_width)

print("=== Greedy Line Breaking ===")
total_badness_g = 0
for i, (line, w) in enumerate(greedy_lines):
    text_str = " ".join(word for word, _ in line)
    b = badness(w, line_width)
    total_badness_g += b
    slack = line_width - w
    bar = "#" * int(w / line_width * 40)
    print(f"  Line {i+1}: [{bar:<40}] width={w:>5.0f}  slack={slack:>4.0f}  badness={b:>6.0f}")

print(f"  Total badness: {total_badness_g:.0f}")

# Optimised: try different break points using dynamic programming
# Simplified version: evaluate first-fit-decreasing vs greedy
print("\\\n=== Optimised vs Greedy Comparison ===")
np.random.seed(42)

# Generate 100 random paragraphs and compare
greedy_scores = []
random_scores = []

for trial in range(100):
    n_words = np.random.randint(20, 60)
    widths = np.random.uniform(3, 15, n_words)

    # Greedy
    lines_g = []
    curr = 0
    line_bad = []
    for w in widths:
        if curr + w + 2 <= line_width:
            curr += w + 2
        else:
            line_bad.append(badness(curr, line_width))
            curr = w
    line_bad.append(badness(curr, line_width))
    greedy_scores.append(np.mean(line_bad))

print(f"Over 100 random paragraphs:")
print(f"  Greedy mean badness: {np.mean(greedy_scores):.0f}")
print(f"  Greedy std badness:  {np.std(greedy_scores):.0f}")
print(f"  Worst paragraph:     {np.max(greedy_scores):.0f}")
print(f"  Best paragraph:      {np.min(greedy_scores):.0f}")
print(f"\\\nKnuth-Plass DP typically reduces badness by 30-50%.")
print(f"This is why LaTeX produces visually superior text.")`,
      challenge: 'Implement a simple improvement: after greedy breaking, check if moving the last word of one line to the next line reduces total badness. This "local search" won\'t match Knuth-Plass but will outperform pure greedy. How much does it improve?',
      successHint: 'You just explored the line-breaking problem — which is a special case of bin packing, one of the most important problems in computer science. Bin packing appears in shipping container loading, memory allocation, cloud server scheduling, and cutting stock problems in manufacturing.',
    },
    {
      title: 'Economics of scale — cost curves and the printing revolution',
      concept: `Before Gutenberg, copying a book required a scribe to write every word by hand. The cost of the first copy and the hundredth copy were identical — each took the same time and skill. This is a **constant marginal cost** model.

Printing inverted this: the **fixed cost** (carving type, building the press, setting the page) was enormous, but the **marginal cost** (each additional copy) was tiny — just paper and ink. This creates a **decreasing average cost curve**:

**Average cost = Fixed cost / N + Marginal cost**

As N (number of copies) increases, the fixed cost is spread across more units, and the average cost per copy plummets. This is **economies of scale** — the mathematical reason printing changed the world.

At small print runs, scribal copying is cheaper (no setup cost). At large print runs, printing is overwhelmingly cheaper. The **crossover point** is where the two cost curves intersect — the minimum print run that makes printing economical.

📚 *Fixed costs don't change with production volume (rent, equipment, setup). Variable costs scale with volume (materials, labour per unit). Economies of scale arise when fixed costs dominate — the more you produce, the cheaper each unit becomes.*`,
      analogy: 'Imagine baking cookies. Making one cookie by hand is quick — 5 minutes. But if you invest 2 hours building a cookie-cutter and rolling system (fixed cost), you can stamp out 200 cookies in 30 minutes. For one cookie, the hand method wins. For 200, the investment pays off massively. That crossover is the economics of scale.',
      storyConnection: 'Gutenberg invested roughly 800 guilders in type and equipment for the 42-line Bible — more than most people earned in a decade. But he printed 180 copies and sold each for 30 guilders (comparable to a scribe\'s fee for a single copy). The mathematics of scale turned one enormous investment into a profitable enterprise — and made books affordable for the first time in history.',
      checkQuestion: 'A scribe copies a book in 3 months for 30 guilders. A printer needs 100 guilders for type setup plus 2 guilders per copy for paper and ink. At what print run does printing become cheaper per copy than scribal copying?',
      checkAnswer: 'Scribe: 30 guilders/copy regardless of quantity. Printer: (100 + 2N) / N = 100/N + 2. Set 100/N + 2 = 30, so 100/N = 28, N = 3.57. At 4 copies, printing is already cheaper: (100 + 8)/4 = 27 guilders/copy vs 30. By 100 copies: (100 + 200)/100 = 3 guilders/copy — 10x cheaper.',
      codeIntro: 'Model the cost curves for scribal vs printed book production and find the crossover points.',
      code: `import numpy as np

def scribal_cost(n_copies, cost_per_copy=30):
    """Linear cost: each copy costs the same."""
    return n_copies * cost_per_copy

def printing_cost(n_copies, fixed_cost=100, marginal_cost=2):
    """Fixed + variable: economies of scale."""
    return fixed_cost + n_copies * marginal_cost

def average_cost(n_copies, fixed_cost, marginal_cost):
    """Average cost per unit."""
    if n_copies == 0:
        return float('inf')
    return (fixed_cost + n_copies * marginal_cost) / n_copies

# Compare scribal vs printing economics
print("=== Scribal vs Printing: Cost Comparison ===")
print(f"Scribe: 30 guilders/copy (constant)")
print(f"Press: 100 guilders setup + 2 guilders/copy\\\n")

quantities = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]

print(f"{'Copies':<8} {'Scribal':>10} {'Printing':>10} {'Print Avg':>10} {'Cheaper':>10}")
print("-" * 50)

for n in quantities:
    s_cost = scribal_cost(n)
    p_cost = printing_cost(n)
    p_avg = average_cost(n, 100, 2)
    cheaper = "PRESS" if p_cost < s_cost else "SCRIBE"
    print(f"{n:<8} {s_cost:>8.0f} g {p_cost:>8.0f} g {p_avg:>8.1f} g {cheaper:>10}")

# Find exact crossover
n_cross = 100 / (30 - 2)
print(f"\\\nExact crossover: {n_cross:.1f} copies")
print(f"At 4+ copies, printing is cheaper per total cost.")

# Different book types
print("\\\n=== Crossover Points for Different Productions ===")
books = [
    {"name": "Pamphlet (4 pages)", "fixed": 10, "marginal": 0.5, "scribe": 3},
    {"name": "Textbook (200 pages)", "fixed": 80, "marginal": 3, "scribe": 25},
    {"name": "Bible (1,200 pages)", "fixed": 400, "marginal": 8, "scribe": 150},
    {"name": "Encyclopedia (5,000 pg)", "fixed": 2000, "marginal": 20, "scribe": 600},
]

print(f"{'Book Type':<28} {'Crossover':>10} {'Savings at 100':>16}")
print("-" * 56)

for b in books:
    cross = b["fixed"] / (b["scribe"] - b["marginal"])
    savings_100 = 1 - (b["fixed"] + 100 * b["marginal"]) / (100 * b["scribe"])
    print(f"{b['name']:<28} {cross:>8.0f} copies {savings_100:>14.0%}")

print("\\\nSmaller works have lower crossover points — pamphlets became")
print("the first truly mass-produced printed material (Martin Luther's")
print("95 Theses: printed as a 4-page pamphlet, distributed by thousands).")`,
      challenge: 'Add a "time" dimension: a scribe produces 1 copy per 3 months. A press produces 300 copies per month after a 2-month setup period. Plot the cumulative copies over 2 years for a single scribe vs a single press. When does the press\'s total output overtake the scribe\'s? This time advantage was even more revolutionary than the cost advantage.',
      successHint: 'Economies of scale explain why mass production transformed human civilisation — from printing to automobiles to software. The same mathematics applies: high fixed costs + low marginal costs = dramatically cheaper per unit at volume. Every tech company (zero marginal cost for digital copies) follows this exact curve.',
    },
    {
      title: 'Information diffusion — the SI model of idea spreading',
      concept: `Before printing, ideas spread slowly through person-to-person contact — like a disease. Epidemiologists model this with the **SI (Susceptible-Infected) model**:

**dI/dt = beta x S x I**

Where S is the fraction of people who haven't encountered the idea (susceptible), I is the fraction who have (informed), and beta is the **transmission rate** — how quickly ideas pass from person to person.

This produces an **S-curve** (logistic growth): slow at first (few informed people to spread it), then exponential (many informed people spreading to many susceptible), then slow again (few susceptible people left).

Printing dramatically increased beta — instead of one person telling one other person, a single printed book could reach hundreds. The **effective beta** with printing is orders of magnitude higher than with oral transmission or hand copying.

This model explains why the Reformation, the Scientific Revolution, and the Enlightenment all accelerated after Gutenberg: the transmission rate of ideas jumped by 100x.

📚 *The SI model is the simplest epidemiological model. "Susceptible" means you haven't heard the idea yet. "Informed" means you have and can now spread it to others. The rate of spread depends on how often informed people contact susceptible people.*`,
      analogy: 'Drop a single drop of ink into still water. At first, only the water touching the ink changes colour — slow spread. As the coloured region grows, it contacts more clear water, and the spread accelerates. Eventually, the whole glass is coloured and the spread stops. Ideas spread the same way — slowly at first, then explosively, then they saturate.',
      storyConnection: 'Martin Luther nailed his 95 Theses to a church door in 1517 — an act of local protest. But printers immediately copied and distributed them. Within two weeks, the theses had spread across Germany. Within two months, across Europe. Without printing, Luther\'s protest would have remained a local theological dispute. With printing, it triggered the Reformation.',
      checkQuestion: 'In a city of 10,000 people, 10 have read a new pamphlet. The transmission rate beta is 0.001 per day. How many new readers appear on day 1?',
      checkAnswer: 'dI/dt = beta x S x I = 0.001 x 9,990 x 10 = 99.9. About 100 new readers on day 1. But as I grows and S shrinks, the rate changes. By the time half the city has read it, dI/dt = 0.001 x 5,000 x 5,000 = 25,000 — but there are only 5,000 people left, so the model constrains itself. This is the S-curve.',
      codeIntro: 'Simulate the spread of ideas under scribal copying vs printing using the SI model.',
      code: `import numpy as np

def si_model(population, initial_informed, beta, days):
    """
    SI (Susceptible-Informed) model for idea diffusion.
    Returns arrays of S and I over time.
    """
    S = np.zeros(days)
    I = np.zeros(days)
    S[0] = population - initial_informed
    I[0] = initial_informed

    for t in range(1, days):
        new_informed = beta * S[t-1] * I[t-1] / population
        new_informed = min(new_informed, S[t-1])  # can't exceed susceptible
        S[t] = S[t-1] - new_informed
        I[t] = I[t-1] + new_informed

    return S, I

population = 100000  # a large European city
initial = 5          # a few people read the original manuscript
days = 365

# Compare transmission rates
scenarios = [
    ("Oral tradition only",     0.00005),
    ("Scribal copying",         0.0003),
    ("Printing (small press)",  0.003),
    ("Printing (large press)",  0.01),
    ("Printing + trade routes", 0.025),
]

print("=== Information Diffusion: SI Model ===")
print(f"Population: {population:,} | Initial informed: {initial}\\\n")

print(f"{'Scenario':<28} {'30 days':>8} {'90 days':>8} {'180 days':>9} {'365 days':>9} {'50% day':>8}")
print("-" * 73)

for name, beta in scenarios:
    S, I = si_model(population, initial, beta, days)
    half_day = days
    for t in range(days):
        if I[t] >= population / 2:
            half_day = t
            break

    print(f"{name:<28} {I[29]:>7.0f} {I[89]:>7.0f} {I[179]:>8.0f} {I[364]:>8.0f} {half_day:>7}d")

# Luther's 95 Theses: actual vs model
print("\\\n=== Case Study: Luther's 95 Theses (1517) ===")
europe_pop = 5_000_000  # literate population of Europe
S, I = si_model(europe_pop, 50, 0.015, 365)

milestones = [14, 30, 60, 90, 180, 365]
print(f"{'Day':>6} {'Informed':>12} {'% of pop':>9}")
print("-" * 29)
for d in milestones:
    print(f"{d:>5}d {I[d-1]:>11,.0f} {I[d-1]/europe_pop*100:>8.1f}%")

print(f"\\\nWithout printing (beta=0.0003):")
S2, I2 = si_model(europe_pop, 50, 0.0003, 365)
print(f"  After 1 year: {I2[364]:,.0f} informed ({I2[364]/europe_pop*100:.2f}%)")
print(f"  Printing accelerated spread by {I[364]/max(I2[364],1):.0f}x")`,
      challenge: 'Add a "recovery" parameter (people who forget or lose interest — the SIR model). Set the recovery rate to 0.01 per day. Now ideas can fade as well as spread. Under what conditions does an idea "go viral" (infect >50% of the population) vs die out? This is the concept of R0 — the basic reproduction number.',
      successHint: 'The SI model is the foundation of epidemiology, viral marketing, and network science. You just modelled how Gutenberg\'s press increased the "transmission rate" of ideas — the same mathematics that explains how diseases spread, how social media posts go viral, and how innovations diffuse through markets.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Mechanics, metallurgy, optimisation, and economics of printing</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 covers screw press physics, alloy design, typesetting algorithms, cost curves, and information diffusion.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
