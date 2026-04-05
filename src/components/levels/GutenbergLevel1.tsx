import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GutenbergLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fixed cost vs variable cost — the economics of printing',
      concept: `Before printing, copying a book cost the same whether you made 1 copy or 100 — each one required a scribe working for months. This is a **purely variable cost** system: total cost = copies × cost_per_copy.

Printing changes the equation. There's a large **fixed cost** (typesetting, proofreading, press setup) that's paid once regardless of how many copies you make. Then there's a small **variable cost** per copy (paper, ink). Total cost = **fixed + (copies × variable_per_copy)**.

The per-copy cost decreases with volume: **cost_per_copy = fixed/copies + variable**

At 1 copy, printing is more expensive than scribing. At 10, they're similar. At 100+, printing is overwhelmingly cheaper. This is a **phase transition** — the economics fundamentally change above a threshold.

📚 *Economies of scale: the more you produce, the cheaper each unit becomes (because fixed costs are spread over more units). Every factory, airline, and software company exploits this principle.*`,
      analogy: 'A pizza oven costs $50,000 to install (fixed cost). Each pizza costs $3 in ingredients (variable cost). If you sell 1 pizza, it cost $50,003. If you sell 10,000, it cost $8 per pizza. The oven cost didn\'t change — it was spread over more pizzas. This is why restaurants need volume.',
      storyConnection: 'A hand-copied Bible took a scribe 3 years and cost the equivalent of a small house. Gutenberg\'s first printed Bible took months to typeset (fixed cost), but each copy after that cost only paper and ink. At 180 copies, the per-copy cost was a fraction of the scribal cost.',
      checkQuestion: 'Fixed cost = $1,000. Variable cost = $2/copy. How many copies until the per-copy cost drops below $5?',
      checkAnswer: 'Per-copy cost = 1000/n + 2. Set this < 5: 1000/n < 3, so n > 333. You need at least 334 copies for the per-copy cost to drop below $5. At 1,000 copies: $3/copy. At 10,000 copies: $2.10/copy.',
      codeIntro: 'Compare the economics of scribing vs printing — find the break-even point.',
      code: `import numpy as np

def scribing_cost(n_copies, cost_per_copy=1000):
    """Linear cost: each copy costs the same."""
    return n_copies * cost_per_copy

def printing_cost(n_copies, fixed_cost=5000, variable_per_copy=2):
    """Fixed + variable cost."""
    return fixed_cost + n_copies * variable_per_copy

def cost_per_copy_print(n_copies, fixed_cost=5000, variable_per_copy=2):
    """Average cost per copy for printing."""
    if n_copies == 0: return float('inf')
    return (fixed_cost + n_copies * variable_per_copy) / n_copies

# Compare costs
print("=== Scribing vs Printing: Cost Comparison ===")
print(f"Scribing: $1,000 per copy (a scribe working for months)")
print(f"Printing: $5,000 setup + $2 per copy")
print()
print(f"{'Copies':>8} {'Scribing':>12} {'Printing':>12} {'Print/Copy':>12} {'Cheaper':>10}")
print("-" * 56)

for n in [1, 2, 5, 10, 20, 50, 100, 500, 1000, 10000]:
    scribe = scribing_cost(n)
    printing = printing_cost(n)
    per_copy = cost_per_copy_print(n)
    cheaper = "Scribing" if scribe < printing else "PRINTING"
    print(f"{n:>8} {scribe:>10,} {printing:>10,} {per_copy:>10.1f} {cheaper:>10}")

# Find exact break-even point
# scribing = printing → n × 1000 = 5000 + n × 2 → 998n = 5000 → n = 5.01
print(f"\\nBreak-even point: {5000 / (1000 - 2):.0f} copies")
print(f"Above this, printing is cheaper per copy.")
print(f"Below this, hire a scribe.")

# Savings at historical production levels
print(f"\\n=== Historical Context ===")
productions = [
    ("Gutenberg Bible (1455)", 180),
    ("Luther's 95 Theses (1517)", 1000),
    ("Typical 16th-century book", 500),
    ("Modern bestseller (1st printing)", 50000),
    ("Modern newspaper (daily)", 500000),
]

for name, copies in productions:
    scribe_total = scribing_cost(copies)
    print_total = printing_cost(copies)
    savings = scribe_total - print_total
    savings_pct = savings / scribe_total * 100
    per_copy = cost_per_copy_print(copies)
    print(f"  {name}: {copies:>7,} copies, per-copy: {per_copy:.2f} "
          f"(saving {savings_pct:.0f}% vs scribing)")`,
      challenge: 'A modern ebook has $0 variable cost (no paper, no ink) but the same fixed cost ($5,000 for editing, design). Calculate the per-copy cost at 100, 1,000, and 1,000,000 copies. What happens to the economics when variable cost is zero? (The per-copy cost drops to near-zero at scale — which is why ebooks and digital distribution are so transformative.)',
      successHint: 'Fixed cost vs variable cost is one of the most important concepts in economics and business. It explains why startups need scale, why software has zero marginal cost, why airlines fill seats at any price, and why Gutenberg changed the world: he converted the cost of knowledge from O(n) to O(1).',
    },
    {
      title: 'Information spread — modelling how ideas propagate through a population',
      concept: `In a scribal culture, ideas spread **linearly**: each scribe copies one book at a time, and each copy can be re-copied. The total copies grow like 1, 2, 4, 8... — slow geometric growth limited by the number of scribes.

In a print culture, ideas spread by **broadcast**: one press run produces hundreds of identical copies, each distributed to a different city. From each city, the idea spreads further. This is **exponential** growth in the number of locations reached.

The critical difference: scribal copying is **serial** (one at a time). Printing is **parallel** (many at once). The same idea reaches saturation in years instead of centuries.

We can model idea spread using a **diffusion model**: at each time step, the idea spreads from everyone who has it to a fraction of their contacts who don't. The spread rate depends on the **reproduction number** (how many new people each person exposes) and the **medium** (scroll vs book vs newspaper vs internet).

📚 *The diffusion of innovations (Rogers, 1962) follows an S-curve: slow start (innovators), rapid growth (early majority), then saturation (laggards). Printing compressed this curve from centuries to decades.*`,
      analogy: 'Compare telling a secret to one person at a time (scribing) vs announcing it on a loudspeaker (printing). The loudspeaker reaches everyone in the room simultaneously — parallel distribution. But the secret-teller can only reach one person at a time — serial distribution. Same information, vastly different spread rates.',
      storyConnection: 'Martin Luther posted his 95 Theses on October 31, 1517. Within two weeks, printed copies had reached every major German city. Without printing, his protest would have remained a local academic dispute. With printing, it became the Reformation — reshaping European civilization. The medium changed the message\'s impact by orders of magnitude.',
      checkQuestion: 'In 1500, there were about 1,000 printing presses in Europe, each producing ~500 pages per day. How many pages could be produced per day across Europe?',
      checkAnswer: '1,000 × 500 = 500,000 pages per day. At ~250 pages per book, that\'s 2,000 books per day — or 730,000 per year. Before printing: a few hundred scribes producing perhaps 500 books per year total. Printing multiplied output by about 1,500×.',
      codeIntro: 'Simulate how ideas spread through a population with and without printing technology.',
      code: `import numpy as np

np.random.seed(42)

def simulate_idea_spread(population, initial_aware, spread_rate,
                         copies_per_step, max_steps=100):
    """
    Simulate idea spread through a population.

    spread_rate: fraction of contacts who adopt the idea per step
    copies_per_step: max new copies produced per step
    """
    aware = initial_aware
    history = [aware]

    for step in range(max_steps):
        if aware >= population * 0.99:
            break

        # Each aware person exposes some contacts
        exposures = min(aware * spread_rate, copies_per_step)
        newly_aware = exposures * (1 - aware / population)  # diminishing as saturation increases
        aware = min(population, aware + newly_aware)
        history.append(aware)

    return history

population = 100000  # educated people in Europe

# Scenario 1: Scribal culture (before 1455)
scribal = simulate_idea_spread(
    population=population,
    initial_aware=1,
    spread_rate=0.5,     # 50% of contacts per step (slow, person-to-person)
    copies_per_step=5,   # max 5 new copies per time step (manual copying)
)

# Scenario 2: Print culture (after 1455)
print_culture = simulate_idea_spread(
    population=population,
    initial_aware=1,
    spread_rate=2.0,     # 200% — each copy reaches 2 new people
    copies_per_step=500, # 500 copies per print run
)

# Scenario 3: Internet (after 1995)
internet = simulate_idea_spread(
    population=population,
    initial_aware=1,
    spread_rate=5.0,     # 500% — viral sharing
    copies_per_step=10000, # essentially unlimited
)

print("=== Idea Spread: Scribal vs Print vs Internet ===")
print(f"Population: {population:,} educated people\\n")

print(f"{'Step':>5} {'Scribal':>12} {'Print':>12} {'Internet':>12}")
print("-" * 43)

max_len = max(len(scribal), len(print_culture), len(internet))
for i in range(0, min(max_len, 50), 2):
    s = scribal[i] if i < len(scribal) else scribal[-1]
    p = print_culture[i] if i < len(print_culture) else print_culture[-1]
    n = internet[i] if i < len(internet) else internet[-1]
    print(f"{i:>5} {s:>12,.0f} {p:>12,.0f} {n:>12,.0f}")

# Time to reach 50% of population
def time_to_pct(history, target_pct, population):
    target = population * target_pct / 100
    for i, v in enumerate(history):
        if v >= target:
            return i
    return len(history)

print(f"\\n=== Time to Reach 50% Awareness ===")
print(f"Scribal:  {time_to_pct(scribal, 50, population)} steps")
print(f"Print:    {time_to_pct(print_culture, 50, population)} steps")
print(f"Internet: {time_to_pct(internet, 50, population)} steps")

# Historical examples
print(f"\\n=== Historical Spread Rates ===")
events = [
    ("Copernicus (1543)", "~100 years to reach all astronomers", "Print (slowly — controversial)"),
    ("Luther's Theses (1517)", "2 weeks across Germany", "Print (rapidly — populist)"),
    ("Newton's Principia (1687)", "~10 years to reach all scientists", "Print (specialist)"),
    ("Darwin's Origin (1859)", "~5 years worldwide", "Print + telegraph"),
    ("Einstein's E=mc² (1905)", "~2 years to physics community", "Journals"),
    ("COVID information (2020)", "Hours worldwide", "Internet + social media"),
]

print(f"{'Event':<30} {'Spread Time':<35} {'Medium'}")
print("-" * 90)
for event, time, medium in events:
    print(f"{event:<30} {time:<35} {medium}")`,
      challenge: 'Add a "censorship" parameter: at each step, a censor removes 10% of newly produced copies. How does censorship affect scribal vs print spread? (Censorship is more effective against scribing because there are fewer copies to censor. Against print, 10% removal barely slows the spread.)',
      successHint: 'You modeled the diffusion of ideas — one of the most important processes in human history. The same mathematics (S-curve adoption, reproduction number, saturation) governs technology adoption (smartphones), disease spread (epidemics), and social movements. Gutenberg\'s press was the first "viral" distribution medium.',
    },
    {
      title: 'Metallurgy — why Gutenberg\'s alloy was revolutionary',
      concept: `The core technical innovation of Gutenberg\'s press was not movable type (China had that), not the press (wine and olive presses existed), and not oil-based ink (painters used it). It was the **type metal alloy**: 80% lead, 5% tin, 15% antimony.

Most metals **shrink** when they solidify — cooling from liquid to solid causes the atoms to pack more tightly, reducing volume by 2-5%. This is a disaster for type: the face of each letter would be **concave** (dished inward), creating uneven, blurry printing.

Antimony is one of very few elements that **expands** on solidification (like water forming ice). In Gutenberg\'s alloy, the antimony expansion **exactly compensated** for the lead shrinkage, producing type with a perfectly **flat, sharp printing face**.

The alloy also had a low melting point (~250°C, achievable in a simple furnace), was durable enough for thousands of impressions, and cast cleanly into molds without bubbles or voids.

📚 *Phase change: when a material transitions between solid and liquid, its volume usually changes. Most materials shrink on solidifying (atoms pack tighter). Water and antimony are notable exceptions — they expand, because their solid crystal structures are more "open" than the liquid.*`,
      analogy: 'Imagine filling a mold with melted chocolate. If the chocolate shrinks as it cools (most materials do), the surface will be concave — dipped inward. Now imagine a chocolate that expands slightly as it sets — the surface pushes out against the mold, filling every detail. That\'s antimony\'s effect in Gutenberg\'s alloy.',
      storyConnection: 'Gutenberg was a goldsmith by training. He understood metals, alloys, and casting — skills that no scribe, scholar, or printer before him possessed. It was this metallurgical knowledge that allowed him to solve the type-face problem that had defeated Chinese printers for 400 years.',
      checkQuestion: 'If lead shrinks 3.5% on solidification and antimony expands 1.0%, what ratio of antimony to lead would you need for zero net volume change?',
      checkAnswer: 'Let x be the antimony fraction. Net change = -3.5(1-x) + 1.0x = 0. -3.5 + 3.5x + x = 0. 4.5x = 3.5. x = 77.8%. But this much antimony would make the alloy too brittle. Gutenberg used 15% antimony — the net volume change is small (-3.5×0.85 + 1.0×0.15 = -2.8%), but the addition of tin and the crystal structure effects bring it closer to zero.',
      codeIntro: 'Model the thermal expansion/contraction of different alloys and find the optimal composition for type metal.',
      code: `import numpy as np

def alloy_volume_change(lead_pct, tin_pct, antimony_pct):
    """
    Calculate the net volume change on solidification.
    Lead: shrinks 3.5%
    Tin: shrinks 2.3%
    Antimony: expands 0.9%
    """
    lead_change = -3.5 * lead_pct / 100
    tin_change = -2.3 * tin_pct / 100
    antimony_change = 0.9 * antimony_pct / 100
    return lead_change + tin_change + antimony_change

def alloy_properties(lead_pct, tin_pct, antimony_pct):
    """
    Estimate alloy properties from composition.
    """
    # Melting point (approximate — real alloys are more complex)
    mp = 327 * lead_pct/100 + 232 * tin_pct/100 + 631 * antimony_pct/100
    # Eutectic effects lower the actual melting point
    mp *= 0.75  # simplified eutectic correction

    # Hardness (Brinell, approximate)
    hardness = 5 * lead_pct/100 + 10 * tin_pct/100 + 30 * antimony_pct/100

    # Durability (impressions before wearing out, relative)
    durability = 0.3 * lead_pct/100 + 0.8 * tin_pct/100 + 1.0 * antimony_pct/100

    return mp, hardness, durability

# Test Gutenberg's alloy
print("=== Type Metal Alloy Analysis ===")
print()

alloys = [
    ("Pure lead", 100, 0, 0),
    ("Lead-tin", 90, 10, 0),
    ("Gutenberg's alloy", 80, 5, 15),
    ("Modern type metal", 75, 8, 17),
    ("High-antimony", 60, 10, 30),
    ("Equal parts", 34, 33, 33),
]

print(f"{'Alloy':<22} {'Pb%':>4} {'Sn%':>4} {'Sb%':>4} {'ΔV%':>6} {'MP(°C)':>7} {'Hard':>5} {'Durability':>10}")
print("-" * 65)

for name, pb, sn, sb in alloys:
    dv = alloy_volume_change(pb, sn, sb)
    mp, hard, dur = alloy_properties(pb, sn, sb)
    print(f"{name:<22} {pb:>3} {sn:>3} {sb:>3} {dv:>+5.2f} {mp:>6.0f} {hard:>4.0f} {dur:>9.2f}")

print(f"\\nGutenberg's alloy minimises volume change (ΔV ≈ 0)")
print(f"while keeping melting point low and hardness high.")

# Optimization: find the alloy with minimum |ΔV| and acceptable properties
print(f"\\n=== Optimizing the Type Metal ===")
print(f"Finding composition with |ΔV| closest to zero...")

best_dv = 100
best_alloy = None

for pb in range(50, 95):
    for sn in range(2, 30):
        sb = 100 - pb - sn
        if sb < 2 or sb > 40:
            continue

        dv = alloy_volume_change(pb, sn, sb)
        mp, hard, dur = alloy_properties(pb, sn, sb)

        # Must meet minimum requirements
        if mp > 350 or hard < 8 or dur < 0.5:
            continue

        if abs(dv) < abs(best_dv):
            best_dv = dv
            best_alloy = (pb, sn, sb, dv, mp, hard, dur)

if best_alloy:
    pb, sn, sb, dv, mp, hard, dur = best_alloy
    print(f"Optimal: {pb}% Pb, {sn}% Sn, {sb}% Sb")
    print(f"  Volume change: {dv:+.3f}%")
    print(f"  Melting point: {mp:.0f}°C")
    print(f"  Hardness: {hard:.0f}")
    print(f"  Durability: {dur:.2f}")
    print(f"\\nCompare with Gutenberg's: 80% Pb, 5% Sn, 15% Sb")
    print(f"  His alloy is remarkably close to the mathematical optimum!")`,
      challenge: 'The code uses a simplified linear model for alloy properties. Real alloys have non-linear interactions (eutectic points where melting drops dramatically). Research the actual eutectic point of the Pb-Sn-Sb system (~240°C at the right composition) and see how it changes the optimization.',
      successHint: 'You optimized an alloy composition — the same task materials scientists perform when designing new metals, ceramics, and polymers. The method (grid search over composition space, evaluate multiple properties, find the Pareto-optimal point) is used in every materials research lab in the world.',
    },
    {
      title: 'Network effects — why printing triggered a cascade of revolutions',
      concept: `Printing didn't just make books cheaper. It created **network effects** — positive feedback loops where the technology's value increased the more people used it.

Loop 1: **More books → more literacy → more readers → more demand for books**
Loop 2: **Cheaper books → more schools → more literate people → more authors → more books**
Loop 3: **More shared knowledge → faster innovation → new ideas → more knowledge**

Each loop reinforces the others. Once printing reached a critical mass of adoption, the feedback became **self-sustaining** — it couldn't be stopped even if authorities tried (and they did try: the Catholic Church established the Index of Forbidden Books in 1559).

This is the same dynamic that makes social media, smartphones, and the internet so powerful: the technology's value grows with the number of users, creating exponential adoption.

📚 *Network effects: the value of a product increases with the number of people using it. A telephone is useless if you're the only one with one. It becomes invaluable when everyone has one. Printing followed the same logic — a book is more valuable when millions can read.*`,
      analogy: 'One fax machine is useless (who do you fax?). Two machines: slightly useful. 1,000 machines: a communication revolution. The value grows as the SQUARE of the number of users (Metcalfe\'s law: value = n²). Printing followed this pattern: each press made all other presses more valuable by expanding the reading audience.',
      storyConnection: 'Before printing, books were rare and literacy was ~10% (mostly clergy). Within 100 years of Gutenberg, thousands of presses operated across Europe, 20 million volumes had been printed, and literacy rates were rising rapidly. Luther, Copernicus, and Galileo all published in print — their ideas reached thousands simultaneously, making suppression impossible.',
      checkQuestion: 'The Catholic Church tried to ban certain books (Index Librorum Prohibitorum, 1559). Why was this less effective than banning manuscripts had been?',
      checkAnswer: 'A manuscript exists in maybe 5-10 copies, easy to locate and destroy. A printed book exists in hundreds of copies, spread across dozens of cities and countries. You\'d need to confiscate them all — an impossible task once the first print run is distributed. Printing made censorship a losing game.',
      codeIntro: 'Model the network effects of printing — feedback loops, adoption curves, and tipping points.',
      code: `import numpy as np

def adoption_with_network_effects(population, initial_adopters=10,
                                  base_adoption_rate=0.01,
                                  network_multiplier=0.5,
                                  years=100):
    """
    Model technology adoption with positive network effects.
    Adoption rate increases with the number of current adopters.
    """
    adopters = initial_adopters
    history = [adopters]

    for year in range(1, years + 1):
        # Adoption rate increases with current penetration
        penetration = adopters / population
        effective_rate = base_adoption_rate + network_multiplier * penetration

        # S-curve: slower near saturation
        new_adopters = effective_rate * adopters * (1 - penetration)
        adopters = min(population, adopters + new_adopters)
        history.append(adopters)

    return history

# European educated population
population = 5_000_000  # educated Europeans (could read)

# Without network effects (scribal culture)
scribal = adoption_with_network_effects(
    population, initial_adopters=100,
    base_adoption_rate=0.005, network_multiplier=0,
    years=200
)

# With network effects (print culture)
print_culture = adoption_with_network_effects(
    population, initial_adopters=100,
    base_adoption_rate=0.01, network_multiplier=0.8,
    years=200
)

print("=== Technology Adoption: Scribal vs Print ===")
print(f"{'Year':>6} {'Scribal readers':>16} {'Print readers':>14} {'% Print':>8}")
print("-" * 46)

for year in range(0, 200, 10):
    s = scribal[year] if year < len(scribal) else scribal[-1]
    p = print_culture[year] if year < len(print_culture) else print_culture[-1]
    print(f"{year:>6} {s:>14,.0f} {p:>12,.0f} {p/population*100:>6.1f}%")

# Tipping point
print(f"\\n=== Tipping Point Analysis ===")
for i, (p_prev, p_curr) in enumerate(zip(print_culture[:-1], print_culture[1:])):
    growth_rate = (p_curr - p_prev) / max(p_prev, 1)
    if growth_rate > 0.1 and i > 5:  # rapid growth phase
        print(f"Tipping point reached at year ~{i}: growth rate = {growth_rate*100:.0f}%/yr")
        print(f"Population at tipping point: {p_curr:,.0f} ({p_curr/population*100:.0f}%)")
        break

# Impact cascade
print(f"\\n=== The Printing Cascade ===")
cascade = [
    (0, "Gutenberg Bible (1455)", "180 copies of one book"),
    (7, "First printed almanac (1462)", "Mass-market practical information"),
    (20, "1,000+ presses across Europe (1475)", "Network effect accelerating"),
    (62, "Luther's 95 Theses (1517)", "Reformation — ideas can't be suppressed"),
    (88, "Copernicus (1543)", "Scientific Revolution begins"),
    (135, "First newspaper (1605)", "Regular information distribution"),
    (232, "Newton's Principia (1687)", "Modern science established"),
    (335, "Encyclopédie (1751-1772)", "All knowledge in one work"),
    (345, "American/French Revolutions", "Democratic ideals spread by print"),
]

print(f"{'Year':>6} {'Event':<45} {'Significance'}")
print("-" * 90)
for years_after, event, significance in cascade:
    print(f"{1455+years_after:>6} {event:<45} {significance}")

# Metcalfe's law for printing
print(f"\\n=== Metcalfe's Law Applied to Printing ===")
print(f"Value of printing network ≈ n² (n = number of literate people)")
for n in [1000, 10000, 100000, 1000000, 5000000]:
    value = n * n
    print(f"  {n:>10,} readers → network value = {value:>15,}")
print(f"  Doubling readers quadruples the network's value!")`,
      challenge: 'Add a "counter-network" — the Catholic Church\'s censorship efforts, modeled as removing 5% of new adopters per year. Does censorship slow or stop the printing cascade? At what censorship rate does it actually succeed in preventing the tipping point?',
      successHint: 'You modeled network effects and adoption curves — the same dynamics driving every technology platform: Facebook, smartphones, electric vehicles, AI. The printing press was the first technology where network effects created an unstoppable cascade. Understanding these dynamics is understanding how technology changes the world.',
    },
    {
      title: 'Typography and fonts — the mathematics of letter design',
      concept: `Each letter Gutenberg cast had to be **perfectly proportioned** — too wide and words are hard to read; too narrow and letters blend together. The spacing between letters (kerning), between words, and between lines all affect **readability**.

Modern typography uses mathematical frameworks that Gutenberg developed empirically:
- **Baseline, ascender, descender** lines define the vertical geometry of text
- **Em-width** (the width of the letter M) sets the basic proportional unit
- **Kerning pairs** adjust spacing between specific letter combinations (e.g., AV is tighter than AH)
- **Leading** (line spacing) is typically 120-145% of the font size for optimal readability

These proportions are not arbitrary — they're optimised for how the human visual system processes text. Too tight and letters merge. Too loose and the eye loses the word boundary. The sweet spots were found through centuries of typographic experimentation.

📚 *Typography is information design — organizing visual elements (letters, words, lines) to maximise comprehension speed and reading comfort. Every app, website, and document you read was designed using typographic principles.*`,
      analogy: 'Imagine spacing chairs in a classroom. Too close and students bump elbows. Too far apart and you can\'t hear the teacher. There\'s an optimal spacing that balances comfort and function. Typography does the same for letters — finding the spacing that optimises reading speed and comprehension.',
      storyConnection: 'Gutenberg\'s typeface (Textura, a blackletter Gothic style) was designed to mimic handwritten manuscripts — so that printed books would look familiar to readers used to manuscript Bibles. His attention to typographic detail was extraordinary: he used **290 different character molds** (including ligatures and abbreviations) to achieve the visual quality of handwriting.',
      checkQuestion: 'Why do long lines of text (over 80 characters) slow reading speed, even though they contain more words per line?',
      checkAnswer: 'Because the eye loses its place when jumping from the end of one line back to the start of the next — a longer jump means more errors. Optimal line length is 50-75 characters for body text. This is why newspaper columns are narrow and websites have max-width on text.',
      codeIntro: 'Model typographic spacing — calculate optimal kerning, leading, and line length for readability.',
      code: `import numpy as np

# Typographic spacing model
def readability_score(font_size_pt, line_height_ratio, chars_per_line,
                      letter_spacing_pct=0):
    """
    Estimate readability from typographic parameters.
    Returns a score from 0 (unreadable) to 100 (optimal).

    Based on empirical research:
    - Line height: optimal at 140% of font size
    - Characters per line: optimal at 55-65
    - Letter spacing: optimal at 0-2% of font size
    """
    # Line height score (peak at 1.4, drops above and below)
    lh_optimal = 1.40
    lh_score = 100 * np.exp(-((line_height_ratio - lh_optimal) / 0.15) ** 2)

    # Line length score (peak at 60 chars)
    ll_optimal = 60
    ll_score = 100 * np.exp(-((chars_per_line - ll_optimal) / 20) ** 2)

    # Letter spacing score (peak at 1%)
    ls_optimal = 1.0
    ls_score = 100 * np.exp(-((letter_spacing_pct - ls_optimal) / 3) ** 2)

    # Font size score (peak at 10-12pt for body text)
    fs_optimal = 11
    fs_score = 100 * np.exp(-((font_size_pt - fs_optimal) / 4) ** 2)

    # Combined score (geometric mean)
    score = (lh_score * ll_score * ls_score * fs_score) ** 0.25

    return score

# Test different settings
print("=== Typography Readability Calculator ===")
print()

# Line height analysis
print("=== Optimal Line Height (Leading) ===")
print(f"{'Line Height %':>14} {'Score':>8}")
print("-" * 24)
for lh_pct in [100, 110, 120, 130, 140, 150, 160, 180, 200]:
    score = readability_score(11, lh_pct/100, 60)
    bar = "█" * int(score / 5)
    print(f"{lh_pct:>12}% {score:>6.0f} {bar}")

# Line length analysis
print(f"\\n=== Optimal Line Length ===")
print(f"{'Chars/Line':>12} {'Score':>8} {'Example'}")
print("-" * 60)
examples = {20: "Narrow column", 40: "Newspaper column", 55: "Paperback book",
            65: "Wide book page", 80: "Full-width screen", 100: "Too wide",
            120: "Way too wide"}

for chars in [20, 30, 40, 50, 55, 60, 65, 70, 80, 100, 120]:
    score = readability_score(11, 1.4, chars)
    bar = "█" * int(score / 5)
    example = examples.get(chars, "")
    print(f"{chars:>10} {score:>6.0f} {bar:<20} {example}")

# Complete typography audit
print(f"\\n=== Typography Presets Comparison ===")
presets = [
    ("Gutenberg Bible", 16, 1.25, 42, 0),
    ("Modern paperback", 10, 1.45, 60, 0),
    ("New York Times", 9, 1.35, 35, 0),
    ("Scientific paper", 10, 1.20, 80, 0),
    ("iPhone text message", 14, 1.30, 30, 0),
    ("Optimal body text", 11, 1.40, 60, 1),
    ("Wall of text (bad)", 8, 1.10, 120, -2),
]

print(f"{'Preset':<22} {'Size':>5} {'LH':>6} {'CPL':>4} {'LS%':>4} {'Score':>6}")
print("-" * 49)
for name, size, lh, cpl, ls in presets:
    score = readability_score(size, lh, cpl, ls)
    print(f"{name:<22} {size:>3}pt {lh:>4.0%} {cpl:>4} {ls:>+3}% {score:>5.0f}")

# Kerning pairs
print(f"\\n=== Common Kerning Pairs ===")
kerning_pairs = [
    ("AV", -80, "A's right diagonal and V's left diagonal create a gap"),
    ("To", -60, "T's top bar creates space above the o"),
    ("WA", -50, "W and A diagonals need tightening"),
    ("LT", -40, "L's horizontal bar creates space under T"),
    ("Ty", -40, "T's top bar hovers over y"),
    ("ff", 0, "Already touching — no adjustment needed"),
    ("HH", 0, "Straight-sided letters — normal spacing"),
]

print(f"{'Pair':>6} {'Kern (units)':>12} {'Why'}")
print("-" * 70)
for pair, kern, reason in kerning_pairs:
    arrow = "←" if kern < 0 else "→" if kern > 0 else "·"
    print(f"{pair:>6} {kern:>+10} {arrow}  {reason}")

print(f"\\nTotal kerning pairs in a professional font: ~500-2,000")
print(f"Gutenberg set 290 different character molds to handle all")
print(f"letter combinations, ligatures, and abbreviations.")`,
      challenge: 'Design a "dyslexia-friendly" typography preset: research suggests larger font size (14pt+), wider line spacing (160%+), shorter line length (40-50 chars), and wider letter spacing (+5%). Calculate its readability score. Is it higher or lower than "optimal"? (The readability model may not capture accessibility needs — a good reminder that models have limits.)',
      successHint: 'You applied mathematical optimization to typography — the same approach used by every font designer, web developer, and UX designer. The principles you calculated (140% line height, 60 chars per line, 11pt font) are the industry standards taught in every design school. Gutenberg discovered them empirically; you derived them from mathematics.',
    },
    {
      title: 'From Gutenberg to Google — the information revolution continues',
      concept: `Gutenberg reduced the cost of copying from O(n) to O(1). Each subsequent information technology did the same — but faster and at larger scale.

The **telegraph** (1837): reduced the time to send a message across a continent from weeks to **seconds**. Cost: per-character.

The **telephone** (1876): added **voice** to electrical communication. Cost: per-minute.

**Radio** (1920): first **broadcast** medium — one sender, unlimited receivers. Cost: per-station, zero per-listener.

**Television** (1950): added **images** to broadcast. Cost: per-station, zero per-viewer.

The **internet** (1990): removed the distinction between sender and receiver — **everyone can publish**. Cost: near-zero for both creating and consuming.

Each transition follows the same pattern: a new technology reduces the cost of information distribution, which triggers a cascade of social changes (new industries, new political movements, new art forms). Gutenberg's press was the first link in this chain.

📚 *Shannon's information theory (1948) provides the mathematical framework: any medium can be characterized by its bandwidth (bits per second), latency (delay), and cost per bit. Each technology revolution dramatically improves one or more of these.*`,
      analogy: 'Imagine each technology as a wider pipe for information: scribing is a drinking straw (slow, expensive). Printing is a garden hose. Telegraph is a fire hose. Radio is a river. Television is a flood. The internet is an ocean. Each step increases the volume and reduces the cost per unit of information.',
      storyConnection: 'Gutenberg\'s press printed about 250 pages per day. A modern printing press produces 100,000 per hour. A web server delivers millions of page views per day. The technology has changed by a factor of a billion, but the fundamental insight — that reducing the cost of copying changes everything — is Gutenberg\'s.',
      checkQuestion: 'An ebook costs $0.00 in variable cost per copy (it\'s a digital file). What happens to the per-copy cost as copies approach infinity?',
      checkAnswer: 'It approaches zero. Per-copy cost = fixed/n + variable = fixed/n + 0. As n → ∞, per-copy cost → 0. This is why digital distribution is so powerful — the marginal cost of one more copy is essentially zero. Wikipedia, YouTube, and open-source software all exploit this property.',
      codeIntro: 'Model the evolution of information technology — cost, speed, and scale from Gutenberg to the internet.',
      code: `import numpy as np

# Information technology evolution
technologies = [
    {"name": "Oral tradition", "year": -50000, "bits_per_day": 1000,
     "cost_per_mbit": 1000000, "reach_people": 10},
    {"name": "Writing (clay)", "year": -3000, "bits_per_day": 5000,
     "cost_per_mbit": 500000, "reach_people": 100},
    {"name": "Scribal copying", "year": -300, "bits_per_day": 20000,
     "cost_per_mbit": 100000, "reach_people": 1000},
    {"name": "Gutenberg press", "year": 1455, "bits_per_day": 500000,
     "cost_per_mbit": 1000, "reach_people": 100000},
    {"name": "Steam press", "year": 1810, "bits_per_day": 5000000,
     "cost_per_mbit": 100, "reach_people": 1000000},
    {"name": "Telegraph", "year": 1837, "bits_per_day": 10000,
     "cost_per_mbit": 50000, "reach_people": 10000000},
    {"name": "Telephone", "year": 1876, "bits_per_day": 100000,
     "cost_per_mbit": 10000, "reach_people": 100000000},
    {"name": "Radio", "year": 1920, "bits_per_day": 1000000,
     "cost_per_mbit": 10, "reach_people": 500000000},
    {"name": "Television", "year": 1950, "bits_per_day": 100000000,
     "cost_per_mbit": 5, "reach_people": 2000000000},
    {"name": "Internet", "year": 1995, "bits_per_day": 10000000000,
     "cost_per_mbit": 0.001, "reach_people": 5000000000},
    {"name": "Mobile internet", "year": 2010, "bits_per_day": 100000000000,
     "cost_per_mbit": 0.0001, "reach_people": 7000000000},
]

print("=== Information Technology Evolution ===")
print(f"{'Technology':<20} {'Year':>6} {'Bits/Day':>12} {'Cost/Mbit':>12} {'Reach':>12}")
print("-" * 64)

for tech in technologies:
    bits = tech["bits_per_day"]
    if bits >= 1e9:
        bits_str = f"{bits/1e9:.0f}B"
    elif bits >= 1e6:
        bits_str = f"{bits/1e6:.0f}M"
    elif bits >= 1e3:
        bits_str = f"{bits/1e3:.0f}K"
    else:
        bits_str = f"{bits}"

    cost = tech["cost_per_mbit"]
    if cost >= 1000:
        cost_str = f"{cost/1000:.0f}K"
    elif cost >= 1:
        cost_str = f"{cost:.0f}"
    else:
        cost_str = f"{cost:.4f}"

    reach = tech["reach_people"]
    if reach >= 1e9:
        reach_str = f"{reach/1e9:.0f}B"
    elif reach >= 1e6:
        reach_str = f"{reach/1e6:.0f}M"
    else:
        reach_str = f"{reach/1e3:.0f}K"

    print(f"{tech['name']:<20} {tech['year']:>6} {bits_str:>12} {cost_str:>12} {reach_str:>12}")

# Rate of change
print(f"\\n=== Acceleration of Change ===")
for i in range(1, len(technologies)):
    prev = technologies[i-1]
    curr = technologies[i]
    years = curr["year"] - prev["year"]
    throughput_ratio = curr["bits_per_day"] / prev["bits_per_day"]
    cost_ratio = prev["cost_per_mbit"] / max(curr["cost_per_mbit"], 0.0001)

    if years > 0 and throughput_ratio > 1:
        print(f"{prev['name']:<20} → {curr['name']:<20}"
              f" ({years:>5} yrs, {throughput_ratio:>8.0f}× throughput, "
              f"{cost_ratio:>10.0f}× cheaper)")

# The Gutenberg moment repeated
print(f"\\n=== Each Technology Created Its Own Revolution ===")
revolutions = [
    ("Gutenberg press (1455)", "Reformation, Scientific Revolution, mass literacy"),
    ("Telegraph (1837)", "Real-time news, financial markets, colonial administration"),
    ("Radio (1920)", "Mass politics (Roosevelt, Hitler), entertainment industry"),
    ("Television (1950)", "Visual culture, advertising, Vietnam 'living room war'"),
    ("Internet (1995)", "E-commerce, social media, open source, remote work"),
    ("Mobile (2010)", "App economy, instant communication, surveillance capitalism"),
]

for tech, impact in revolutions:
    print(f"  {tech}")
    print(f"    → {impact}")`,
      challenge: 'AI (Large Language Models) became widely available in 2023. Where does it fit on this chart? What is its "bits per day" throughput, cost per Mbit, and potential reach? Is AI another Gutenberg-scale revolution or an incremental improvement?',
      successHint: 'You mapped 50,000 years of information technology — from oral tradition to the mobile internet — and identified the pattern: each technology revolution reduces the cost of information distribution, which triggers cascading social changes. Gutenberg was the first — but the pattern repeats every few decades, each time faster. Understanding this pattern is understanding the future.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Information economics and materials science through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model printing economics, idea diffusion, metallurgy, typography, and the information revolution.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
