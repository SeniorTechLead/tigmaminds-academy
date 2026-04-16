import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BodhiTreeLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone: Plant growth simulator — auxin transport and cell elongation model',
      concept: `In Level 1-3 you learned plant reproduction, DNA, hormones, grafting, tissue culture, CRISPR, and conservation genetics. Now you build the complete Plant Growth Simulator: a computational model of how auxin controls plant development.

The simulator pipeline:
1. **1D cell array**: model a stem as a column of cells, each with auxin concentration, cell length, and differentiation state
2. **Auxin transport**: polar auxin transport (PAT) moves auxin from cell to cell, creating gradients
3. **Acid growth**: each cell's elongation rate depends on local auxin concentration
4. **Differentiation**: cells at high-auxin positions become roots; low-auxin become shoots
5. **Environmental response**: simulate phototropism (light causes auxin redistribution)

This model captures the essential physics of plant growth — the same physics that allows cuttings to root, shoots to bend toward light, and the Bodhi Tree to grow for millennia.`,
      analogy: 'Building the plant growth simulator is like building a city traffic model. Auxin is the traffic; cells are the roads; transporters (PIN proteins) are the traffic signals. By setting the signals, you control the flow — directing growth where you want it, just as traffic engineers direct vehicles through a city.',
      storyConnection: 'The Plant Growth Simulator models the exact molecular events that occurred when the Bodhi Tree cutting was planted in Sri Lanka: auxin accumulated at the cut end, triggered root formation through the acid growth mechanism, and established a new root system. Every step of the simulation mirrors what happened 2,300 years ago in Anuradhapura.',
      checkQuestion: 'Why is a 1D model (column of cells) a reasonable starting point for simulating plant stem growth?',
      checkAnswer: 'A stem is approximately cylindrical, and the most important growth processes (cell elongation, auxin transport) happen primarily along the stem axis. Radial growth and branching can be added later as extensions. Starting with 1D captures the essential physics — auxin gradient formation, polar transport, and differential elongation — without the computational complexity of a 3D model. Most published plant growth models start in 1D for this reason.',
      codeIntro: 'Build the foundation: a 1D array of cells with auxin transport and concentration-dependent growth.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE: Plant Growth Simulator
# Stage 1: 1D Cell Array with Auxin Transport
# ============================================================

class PlantCell:
    def __init__(self, position, cell_type='stem'):
        self.position = position
        self.cell_type = cell_type
        self.length = 10.0        # micrometers
        self.auxin = 0.0          # concentration (arbitrary units)
        self.growth_rate = 0.0    # um/hour
        self.age = 0              # hours

class PlantStem:
    def __init__(self, n_cells=50):
        self.cells = [PlantCell(i) for i in range(n_cells)]
        self.n_cells = n_cells
        self.hour = 0
        # Auxin source at the top (shoot tip)
        self.cells[0].auxin = 10.0
        self.cells[0].cell_type = 'meristem'

    def transport_auxin(self, dt=1.0):
        """Polar auxin transport: moves auxin downward (basipetal)."""
        transport_rate = 0.3  # fraction transported per hour
        diffusion_rate = 0.05  # passive diffusion

        new_auxin = [c.auxin for c in self.cells]

        for i in range(self.n_cells):
            # Polar transport (downward)
            if i < self.n_cells - 1:
                polar_flux = self.cells[i].auxin * transport_rate * dt
                new_auxin[i] -= polar_flux
                new_auxin[i + 1] += polar_flux

            # Diffusion (both directions)
            if i > 0:
                diff = (self.cells[i-1].auxin - self.cells[i].auxin) * diffusion_rate * dt
                new_auxin[i] += diff
            if i < self.n_cells - 1:
                diff = (self.cells[i+1].auxin - self.cells[i].auxin) * diffusion_rate * dt
                new_auxin[i] += diff

            # Degradation
            new_auxin[i] *= (1 - 0.02 * dt)

        # Replenish source
        new_auxin[0] = max(new_auxin[0], 8.0)

        for i, c in enumerate(self.cells):
            c.auxin = max(0, new_auxin[i])

    def grow_cells(self, dt=1.0):
        """Acid growth: auxin drives cell elongation."""
        for cell in self.cells:
            # Optimal auxin for stem growth: ~1-3 units
            if cell.cell_type in ['stem', 'meristem']:
                rate = 0.5 * cell.auxin * np.exp(-0.3 * cell.auxin)  # bell curve
            else:
                rate = 0.1  # differentiated cells grow slowly
            cell.growth_rate = rate
            cell.length += rate * dt
            cell.age += dt

    def step(self, dt=1.0):
        self.hour += dt
        self.transport_auxin(dt)
        self.grow_cells(dt)

# Run simulation
stem = PlantStem(n_cells=50)

print("Plant Growth Simulator — Stage 1: Auxin Transport")
print("=" * 60)
print(f"Cells: {stem.n_cells} | Auxin source: cell 0 (shoot tip)")
print()

for hour in range(48):
    stem.step(dt=1.0)

    if hour in [0, 6, 12, 24, 47]:
        print(f"Hour {hour+1}:")
        # Show auxin gradient (every 10th cell)
        positions = [0, 5, 10, 20, 30, 40, 49]
        for p in positions:
            c = stem.cells[p]
            bar = '#' * int(c.auxin * 3)
            print(f"  Cell {p:>2}: auxin={c.auxin:>5.2f} "
                  f"length={c.length:>6.1f}um {bar}")
        print()

total_length = sum(c.length for c in stem.cells)
print(f"Total stem length after 48 hours: {total_length:.0f} um ({total_length/1000:.1f} mm)")
print(f"Auxin gradient established: high at tip, low at base")`,
      challenge: 'Add a "cutting" event: at hour 24, remove the top 10 cells (simulating taking a cutting). Observe how the auxin gradient reorganizes and whether new growth occurs at the wound site.',
      successHint: 'Stage 1 is complete: you have a working model of polar auxin transport and auxin-driven cell elongation. The gradient forms naturally from a single source at the shoot tip.',
    },
    {
      title: 'Stage 2: Root formation — modeling adventitious root initiation',
      concept: `When a cutting is taken, auxin accumulates at the base (the cut end). This high auxin concentration triggers **adventitious root formation** — roots growing from tissue that would not normally produce them.

The process:
1. Polar auxin transport moves auxin toward the base
2. At the cut end, auxin cannot exit — it accumulates
3. High auxin activates root-initiation genes
4. Cells dedifferentiate, forming a callus
5. Within the callus, root primordia develop
6. Roots emerge and grow downward

Key parameters:
- **Root initiation threshold**: auxin concentration above which root genes activate
- **Callus formation time**: 3-5 days at the wound site
- **Root emergence time**: 7-21 days depending on species

We model this by adding a root-initiation module to the simulator: when auxin exceeds a threshold at the base, cells transition from 'stem' → 'callus' → 'root primordium' → 'root'. The timing matches real observations of cutting propagation.`,
      analogy: 'The cut end of a stem is like a river hitting a dam. Water (auxin) flows downward and pools behind the dam (cut surface). When the pool gets deep enough, it overflows in a new direction — roots. The dam does not stop the flow; it redirects it.',
      storyConnection: 'This is exactly what happened when the Bodhi Tree cutting was planted in Sri Lanka. Auxin flowing downward from the shoot tip hit the cut end and accumulated. Within weeks, that auxin buildup triggered root formation — the molecular event that established the Sri Maha Bodhi and preserved the lineage for 2,300 years.',
      checkQuestion: 'Rooting powder contains synthetic auxin (IBA or NAA). Why does adding MORE auxin to the cut end help roots form faster?',
      checkAnswer: 'The cutting produces auxin naturally, but it takes time for enough to accumulate at the base. Rooting powder provides an immediate high dose of auxin at the cut surface, reaching the root-initiation threshold faster. It is like filling the pool behind the dam with a fire hose instead of waiting for the river. Caution: too much auxin inhibits growth — there is an optimal dose.',
      codeIntro: 'Add root initiation to the simulator: model the cutting, auxin accumulation, and root emergence.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE Stage 2: Cutting + Root Formation
# ============================================================

class CuttingSimulator:
    def __init__(self, n_cells=30):
        self.n_cells = n_cells
        self.auxin = np.zeros(n_cells)
        self.cell_state = ['stem'] * n_cells  # stem, callus, root_primordium, root
        self.cell_length = np.full(n_cells, 10.0)
        self.hour = 0

        # Auxin source at top (shoot tip)
        self.auxin[0] = 8.0

        # Root initiation parameters
        self.callus_threshold = 3.0     # auxin level to start callus
        self.root_threshold = 5.0       # auxin level for root primordia
        self.callus_time = {}           # cell -> hours as callus

    def transport(self, dt=1.0):
        new_auxin = self.auxin.copy()
        transport_rate = 0.25
        diffusion = 0.03

        for i in range(self.n_cells):
            # Polar transport (downward)
            if i < self.n_cells - 1:
                flux = self.auxin[i] * transport_rate * dt
                new_auxin[i] -= flux
                new_auxin[i + 1] += flux
            else:
                # Base of cutting: auxin accumulates (no exit)
                pass

            # Diffusion
            if i > 0:
                new_auxin[i] += (self.auxin[i-1] - self.auxin[i]) * diffusion * dt
            if i < self.n_cells - 1:
                new_auxin[i] += (self.auxin[i+1] - self.auxin[i]) * diffusion * dt

            new_auxin[i] *= (1 - 0.01 * dt)  # degradation

        new_auxin[0] = max(new_auxin[0], 6.0)  # replenish source
        self.auxin = np.clip(new_auxin, 0, 20)

    def differentiate(self):
        for i in range(self.n_cells):
            if self.cell_state[i] == 'stem' and self.auxin[i] > self.callus_threshold:
                self.cell_state[i] = 'callus'
                self.callus_time[i] = 0

            elif self.cell_state[i] == 'callus':
                self.callus_time[i] = self.callus_time.get(i, 0) + 1
                if self.auxin[i] > self.root_threshold and self.callus_time[i] > 72:
                    self.cell_state[i] = 'root_primordium'

            elif self.cell_state[i] == 'root_primordium':
                self.callus_time[i] = self.callus_time.get(i, 0) + 1
                if self.callus_time[i] > 168:  # 7 days
                    self.cell_state[i] = 'root'

    def step(self, dt=1.0):
        self.hour += dt
        self.transport(dt)
        self.differentiate()

# Run for 21 days (504 hours)
sim = CuttingSimulator(n_cells=30)

print("Cutting Simulator — Root Formation from Auxin Accumulation")
print("=" * 60)

for hour in range(504):
    sim.step()

    if hour in [0, 24, 72, 168, 336, 503]:
        day = hour // 24
        n_callus = sim.cell_state.count('callus')
        n_primordium = sim.cell_state.count('root_primordium')
        n_root = sim.cell_state.count('root')
        base_auxin = sim.auxin[-5:].mean()

        print(f"\
Day {day} (hour {hour+1}):")
        print(f"  Base auxin (avg last 5 cells): {base_auxin:.2f}")
        print(f"  Callus cells: {n_callus} | Primordia: {n_primordium} | Roots: {n_root}")

        # Show bottom 10 cells
        for i in range(20, 30):
            state_char = {'stem': '.', 'callus': 'C', 'root_primordium': 'P', 'root': 'R'}
            print(f"    Cell {i}: [{state_char[sim.cell_state[i]]}] auxin={sim.auxin[i]:.2f}", end='')
            if i == 29:
                print(" <-- base (cut end)")
            else:
                print()

print("\
" + "=" * 60)
print("Auxin accumulates at the cut base → callus → root primordia → roots")
print("This is how every Bodhi Tree cutting established itself.")`,
      challenge: 'Add rooting powder: at hour 0, add 5.0 units of auxin to the bottom 3 cells. Compare root emergence time with and without rooting powder. By how many days does it speed up rooting?',
      successHint: 'Stage 2 captures the core mechanism of cutting propagation: auxin accumulation at the base drives root formation. This model explains why cuttings work and why rooting powder helps.',
    },
    {
      title: 'Stage 3: Phototropism — light-driven auxin redistribution',
      concept: `Plants bend toward light through **phototropism**. The mechanism:

1. **Photoreceptors** (phototropins) detect blue light on the illuminated side
2. Phototropins activate **PIN proteins** that redirect auxin transport
3. Auxin moves from the lit side to the shaded side
4. The shaded side now has MORE auxin → cells elongate faster
5. Differential elongation bends the stem toward the light

**The Cholodny-Went model** (1926): auxin redistribution, not destruction, causes bending. Total auxin remains the same; it just moves from one side to the other.

Experimental proof:
- Split a stem vertically, block auxin flow between halves → no bending
- Apply auxin to the shaded side only → stem bends toward light even in darkness
- Decapitate the tip (removing the auxin source) → no bending; reapply auxin to the stump → bending resumes

We model this by extending the 1D simulator to 2D: left and right halves of the stem, with auxin flow between them controlled by light direction.`,
      analogy: 'Phototropism is like a rowing team where one side rows harder than the other. If the port (left) side rows harder, the boat curves to starboard (right). In the plant, the shaded side "rows harder" (elongates faster) because it has more auxin, curving the stem toward the light.',
      storyConnection: 'The Bodhi Tree in Bodh Gaya grows in full sunlight, while the Sri Maha Bodhi in Anuradhapura is surrounded by temple buildings. Despite being genetically identical, they have grown into different shapes — partly due to phototropism. Each tree bent toward available light, its auxin gradients sculpting unique architecture from identical DNA.',
      checkQuestion: 'A plant in a room with a window bends toward the window. You rotate the pot 180 degrees. What happens over the next 24 hours?',
      checkAnswer: 'The plant will gradually bend back toward the window. Phototropins on the now-shaded side detect reduced light and redirect auxin flow. Within hours, the formerly lit side begins receiving more auxin and elongating faster. The stem curves back toward the light. This is a continuous feedback loop: detect light direction → redistribute auxin → grow toward light → repeat.',
      codeIntro: 'Extend the simulator to 2D: model left/right auxin redistribution driven by light direction.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE Stage 3: 2D Phototropism Model
# ============================================================

class PhototropismModel:
    def __init__(self, n_segments=20):
        self.n = n_segments
        # Each segment has left and right auxin concentrations
        self.auxin_left = np.zeros(n_segments)
        self.auxin_right = np.zeros(n_segments)
        self.auxin_left[0] = 5.0   # source at tip
        self.auxin_right[0] = 5.0
        self.angles = np.zeros(n_segments)  # bending angle at each segment
        self.hour = 0
        self.light_direction = 'right'  # light comes from the right

    def transport(self, dt=1.0):
        rate = 0.2
        new_L = self.auxin_left.copy()
        new_R = self.auxin_right.copy()

        for i in range(self.n - 1):
            # Polar transport downward
            flux_L = self.auxin_left[i] * rate * dt
            flux_R = self.auxin_right[i] * rate * dt
            new_L[i] -= flux_L; new_L[i+1] += flux_L
            new_R[i] -= flux_R; new_R[i+1] += flux_R

        # Lateral redistribution due to light
        lateral_rate = 0.15 * dt
        for i in range(self.n):
            if self.light_direction == 'right':
                # Move auxin from lit (right) to shaded (left)
                transfer = self.auxin_right[i] * lateral_rate
                new_R[i] -= transfer
                new_L[i] += transfer
            else:
                transfer = self.auxin_left[i] * lateral_rate
                new_L[i] -= transfer
                new_R[i] += transfer

        # Degradation
        new_L *= (1 - 0.02 * dt)
        new_R *= (1 - 0.02 * dt)

        # Replenish source
        new_L[0] = max(new_L[0], 4.0)
        new_R[0] = max(new_R[0], 4.0)

        self.auxin_left = np.clip(new_L, 0, 15)
        self.auxin_right = np.clip(new_R, 0, 15)

    def grow(self, dt=1.0):
        for i in range(self.n):
            # Growth rate proportional to auxin
            growth_L = 0.5 * self.auxin_left[i]
            growth_R = 0.5 * self.auxin_right[i]
            # Differential growth → bending
            diff = growth_L - growth_R
            self.angles[i] += diff * 0.1 * dt  # degrees per hour

    def step(self, dt=1.0):
        self.hour += dt
        self.transport(dt)
        self.grow(dt)

    def total_bend(self):
        return np.sum(self.angles)

# Simulate 48 hours of phototropism
model = PhototropismModel(n_segments=20)

print("Phototropism Simulation — Bending Toward Light")
print("=" * 60)
print(f"Light direction: {model.light_direction}")
print(f"Auxin redistributes from lit side to shaded side")
print()

for hour in range(48):
    model.step()

    if hour in [0, 6, 12, 24, 36, 47]:
        print(f"Hour {hour+1}:")
        print(f"  Tip auxin: L={model.auxin_left[0]:.2f} R={model.auxin_right[0]:.2f}")
        print(f"  Mid auxin: L={model.auxin_left[10]:.2f} R={model.auxin_right[10]:.2f}")
        print(f"  Total bend: {model.total_bend():.1f} degrees toward light")
        print()

# Now rotate the plant
print("--- ROTATING PLANT 180 degrees ---")
print("(Light now on the LEFT side)")
model.light_direction = 'left'

for hour in range(48, 96):
    model.step()

    if hour in [54, 72, 95]:
        print(f"Hour {hour+1}:")
        print(f"  Total bend: {model.total_bend():.1f} degrees")

print()
print("The plant bends toward light, then corrects when rotated.")
print("Auxin redistribution is the mechanism. Simple, elegant, effective.")`,
      challenge: 'Add gravitropism: a horizontal stem should bend upward due to auxin accumulating on the lower side. Model a stem laid on its side and track both phototropic and gravitropic bending simultaneously.',
      successHint: 'Stage 3 adds environmental response to the simulator. The plant is no longer a passive grower — it actively senses and responds to its environment through auxin redistribution.',
    },
    {
      title: 'Stage 4: Tissue culture simulation — from explant to plantlet',
      concept: `Combining all previous stages, we now simulate a complete tissue culture protocol:

1. **Explant** → callus (balanced auxin:cytokinin)
2. **Callus** → shoots (high cytokinin)
3. **Shoots** → rooted plantlets (high auxin)
4. **Multiplication**: each shoot tip can be sub-cultured

This integrates:
- Hormone-driven cell fate (Level 2)
- Auxin transport and root formation (Stages 1-2)
- Cell division and growth kinetics
- Somaclonal variation risk (Level 2)

The simulation tracks cell populations, hormone levels, differentiation states, and mutation accumulation across multiple subculture cycles — a complete virtual micropropagation lab.`,
      analogy: 'The tissue culture simulation is like a virtual factory blueprint. Each stage (callus, shoot, root) is a production line. Hormones are the control inputs. Cell count is the throughput. Mutation rate is the quality defect rate. By optimizing the blueprint, you maximize output while minimizing defects.',
      storyConnection: 'This simulation models how a modern tissue culture lab would propagate the Bodhi Tree. Instead of carrying a single cutting across the ocean, a lab could produce thousands of genetically identical saplings in months — each one carrying the same DNA as the tree of 528 BCE. The ancient and the modern converge.',
      checkQuestion: 'A tissue culture lab wants to produce 10,000 Bodhi Tree saplings in 6 months. What multiplication rate per cycle (4-week cycles) is needed?',
      checkAnswer: 'In 6 months there are about 6 cycles of 4 weeks each. Starting from 1 explant: 1 x r^6 = 10,000, so r = 10,000^(1/6) = approximately 4.6. A multiplication rate of 5x per cycle (common for many species) would produce 5^6 = 15,625 shoots — enough even after losses in rooting (85%) and acclimatization (80%). Actual yield: 15,625 x 0.85 x 0.80 = ~10,625 plantlets.',
      codeIntro: 'Build the complete tissue culture pipeline: explant to thousands of clones.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE Stage 4: Complete Tissue Culture Simulator
# ============================================================

class TissueCulturePipeline:
    def __init__(self):
        self.week = 0
        # Stages
        self.callus_cells = 100       # starting explant
        self.shoot_tips = 0
        self.rooting_shoots = 0
        self.plantlets = 0
        self.acclimatized = 0

        # Parameters
        self.callus_growth_rate = 1.5   # per week
        self.shoot_induction_rate = 0.1  # fraction becoming shoots per week
        self.multiplication_rate = 0.3   # new shoot tips per shoot per week
        self.rooting_success = 0.85
        self.acclimatization_success = 0.80
        self.mutation_rate = 0.001       # per subculture

        # Quality tracking
        self.total_mutations = 0
        self.variant_plants = 0

        self.history = []

    def step(self):
        self.week += 1

        # Phase 1: Callus growth (weeks 1-4)
        if self.week <= 4:
            self.callus_cells = int(self.callus_cells * self.callus_growth_rate)

        # Phase 2: Shoot induction (week 4+)
        if self.week == 4:
            self.shoot_tips = int(self.callus_cells * self.shoot_induction_rate)
            self.callus_cells = 0

        # Phase 3: Multiplication (ongoing after week 4)
        if self.week > 4 and self.shoot_tips > 0:
            new_shoots = int(self.shoot_tips * self.multiplication_rate)
            self.shoot_tips += new_shoots

            # Transfer some to rooting (every 4 weeks)
            if self.week % 4 == 0:
                transfer = int(self.shoot_tips * 0.25)
                self.rooting_shoots += transfer
                self.shoot_tips -= transfer

                # Mutation tracking
                mutations = np.random.binomial(transfer, self.mutation_rate)
                self.total_mutations += mutations
                self.variant_plants += mutations

        # Rooting (3 weeks after transfer)
        if self.week % 3 == 0 and self.rooting_shoots > 0:
            rooted = int(self.rooting_shoots * self.rooting_success)
            self.plantlets += rooted
            self.rooting_shoots = 0

        # Acclimatization (batch every 4 weeks)
        if self.week % 4 == 0 and self.plantlets > 0:
            batch = int(self.plantlets * 0.5)
            survived = int(batch * self.acclimatization_success)
            self.acclimatized += survived
            self.plantlets -= batch

        self.history.append({
            'week': self.week,
            'callus': self.callus_cells,
            'shoots': self.shoot_tips,
            'rooting': self.rooting_shoots,
            'plantlets': self.plantlets,
            'ready': self.acclimatized,
            'variants': self.variant_plants,
        })

# Run for 1 year
lab = TissueCulturePipeline()
for _ in range(52):
    lab.step()

print("Complete Tissue Culture Pipeline — Bodhi Tree Cloning")
print("=" * 65)
print(f"Starting: 1 explant (100 cells)")
print()
print(f"{'Week':>5} | {'Callus':>8} | {'Shoots':>8} | {'Rooting':>8} | "
      f"{'Plantlets':>10} | {'Ready':>8} | {'Variants':>9}")
print("-" * 70)

for entry in lab.history:
    if entry['week'] in [1, 4, 8, 12, 20, 30, 40, 52]:
        print(f"{entry['week']:>5} | {entry['callus']:>8,} | {entry['shoots']:>8,} | "
              f"{entry['rooting']:>8,} | {entry['plantlets']:>10,} | "
              f"{entry['ready']:>8,} | {entry['variants']:>9}")

final = lab.history[-1]
print()
print(f"After 52 weeks:")
print(f"  Plantlets ready for planting: {final['ready']:,}")
print(f"  Still in pipeline: {final['shoots'] + final['rooting'] + final['plantlets']:,}")
print(f"  Somaclonal variants detected: {final['variants']}")
print(f"  Variant rate: {final['variants']/(final['ready']+1)*100:.2f}%")
print()
print("From 1 tiny explant → thousands of sacred tree clones.")
print("Each one carrying DNA from the tree of 528 BCE.")`,
      challenge: 'Optimize the pipeline: experiment with different transfer rates, cycle lengths, and multiplication rates. What configuration maximizes the number of ready plantlets while keeping the variant rate below 1%?',
      successHint: 'Stage 4 brings the entire lesson together: hormone biology, cell differentiation, clonal propagation, and quality control. The tissue culture pipeline is the modern embodiment of what Sanghamitta did 2,300 years ago — preserving a genome across time and space.',
    },
    {
      title: 'Stage 5: Clone vs seed fitness — modeling diversity under stress',
      concept: `The final stage addresses the central tension of the Bodhi Tree story: is it better to clone (preserve the best) or to reproduce sexually (maintain diversity)?

We model both strategies under environmental stress:
- **Clone population**: all individuals have the same genome (like the Bodhi Tree lineage)
- **Seed population**: each individual has a unique genome (sexual reproduction)
- **Stress events**: novel diseases, drought, temperature extremes — each requiring specific resistance genes

The simulation reveals the fundamental trade-off:
- Clones thrive in STABLE environments (the proven genome works perfectly)
- Diverse populations survive CHANGING environments (some individuals resist new threats)
- The optimal strategy depends on environmental predictability

This is the lesson of the Cavendish banana, the Irish potato, and the Bodhi Tree: cloning is powerful but fragile. Diversity is messy but resilient.`,
      analogy: 'Cloning is like investing all your money in one stock. If that stock does well, you profit enormously. If it crashes, you lose everything. Diversity is like a balanced portfolio — no single investment dominates, but the portfolio survives any individual crash. The Bodhi Tree is the ultimate single-stock investment, maintained by devoted monks for 2,300 years.',
      storyConnection: 'The monks who maintain the Bodhi Tree lineage are not just gardeners — they are portfolio managers for a single genetic asset. Their devotion provides the stability that a clonal lineage requires. Without human stewardship, the Bodhi Tree monoculture would eventually face a threat it cannot survive. The story is both a celebration of cloning and a warning about its limits.',
      checkQuestion: 'If you could advise the monks maintaining the Bodhi Tree lineage, what scientific recommendation would you make to protect the lineage for the next 2,300 years?',
      checkAnswer: 'Three recommendations: (1) Maintain the clonal lineage at multiple geographically separated sites (already done — reduces catastrophic loss risk). (2) Preserve seeds from the clonal trees in a seed bank — seeds produced by open pollination carry diverse genetics that could provide disease resistance if needed. (3) Genotype all existing Bodhi Tree clones using microsatellites to verify identity and detect any that are not true clones. The combination of clonal preservation AND seed banking provides both identity preservation and genetic insurance.',
      codeIntro: 'Build the final simulation: clone fitness vs seed diversity under unpredictable environmental change.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE Stage 5: Clone vs Seed — Fitness Under Stress
# ============================================================

class Population:
    def __init__(self, name, n_individuals, n_genes=20, diversity='clone'):
        self.name = name
        self.n = n_individuals
        self.n_genes = n_genes

        if diversity == 'clone':
            # All identical
            template = np.random.binomial(1, 0.6, n_genes)
            self.genomes = np.tile(template, (n_individuals, 1))
        elif diversity == 'seed':
            # Each unique
            self.genomes = np.random.binomial(1, 0.5, (n_individuals, n_genes))
        elif diversity == 'mixed':
            # 80% clones + 20% diverse
            template = np.random.binomial(1, 0.6, n_genes)
            n_clones = int(n_individuals * 0.8)
            n_diverse = n_individuals - n_clones
            clones = np.tile(template, (n_clones, 1))
            diverse = np.random.binomial(1, 0.5, (n_diverse, n_genes))
            self.genomes = np.vstack([clones, diverse])

        self.alive = np.ones(n_individuals, dtype=bool)
        self.fitness_history = []

    def apply_stress(self, target_gene, severity):
        for i in range(self.n):
            if self.alive[i] and self.genomes[i, target_gene] == 0:
                if np.random.random() < severity:
                    self.alive[i] = False

    def survival_rate(self):
        return self.alive.sum() / self.n

# Create populations
n_pop = 5000
clone_pop = Population("Bodhi Clone (monoculture)", n_pop, diversity='clone')
seed_pop = Population("Seed-grown (diverse)", n_pop, diversity='seed')
mixed_pop = Population("Mixed (clone + seed bank)", n_pop, diversity='mixed')

# Simulate 100 years of environmental challenges
n_years = 100
n_stresses_per_year = 2

print("Clone vs Seed Fitness — 100 Years of Environmental Stress")
print("=" * 65)
print(f"Population size: {n_pop:,} each")
print(f"Genes: 20 resistance loci | Stresses: {n_stresses_per_year}/year")
print()

for year in range(n_years):
    for _ in range(n_stresses_per_year):
        target = np.random.randint(0, 20)
        severity = np.random.uniform(0.1, 0.4)

        clone_pop.apply_stress(target, severity)
        seed_pop.apply_stress(target, severity)
        mixed_pop.apply_stress(target, severity)

    if year in [0, 9, 24, 49, 74, 99]:
        print(f"Year {year+1:>3}: "
              f"Clone: {clone_pop.survival_rate():>6.1%} | "
              f"Seed: {seed_pop.survival_rate():>6.1%} | "
              f"Mixed: {mixed_pop.survival_rate():>6.1%}")

print()
print("Final survival after 100 years:")
print(f"  Monoculture (clone):  {clone_pop.survival_rate():.1%}")
print(f"  Diverse (seed-grown): {seed_pop.survival_rate():.1%}")
print(f"  Mixed strategy:       {mixed_pop.survival_rate():.1%}")
print()
if clone_pop.survival_rate() < seed_pop.survival_rate():
    print("Diversity wins over the long term.")
    print("Clones are efficient but fragile.")
else:
    print("Both strategies have trade-offs.")

print()
print("The Bodhi Tree lesson: clone what is sacred,")
print("but preserve diversity as insurance.")
print("The monks knew this intuitively.")
print("The science confirms it quantitatively.")`,
      challenge: 'Model a "CRISPR rescue" scenario: when the clone population drops below 50%, use gene editing to add resistance genes from the diverse seed population. How does this hybrid strategy compare to pure cloning, pure diversity, and the mixed approach?',
      successHint: 'The capstone is complete. You have built a plant growth simulator that captures auxin transport, root formation, phototropism, tissue culture, and the fundamental trade-off between cloning and diversity. The Bodhi Tree taught you the biology. The simulator taught you to think computationally about it.',
    },
    {
      title: 'Stage 6: Synthesis — the complete Bodhi Tree conservation plan',
      concept: `You now have all the tools to design a scientifically rigorous conservation plan for the Bodhi Tree lineage. This final stage synthesizes everything:

**Genetic verification**: Microsatellite fingerprinting of all claimed Bodhi Tree clones worldwide to confirm identity and detect impostors.

**Clonal preservation**: Tissue culture protocol optimized for Ficus religiosa — minimal subculture cycles to reduce somaclonal variation, meristem tip culture for genetic fidelity.

**Diversity insurance**: Seed collection from open-pollinated Bodhi Tree flowers. Each seed represents a unique genotype. Store in controlled conditions (seed bank) for future use.

**Disease surveillance**: Monitor for pathogens targeting Ficus religiosa. Maintain sentinel trees at multiple sites to detect threats early.

**CRISPR preparedness**: Sequence the Bodhi Tree genome. Identify resistance genes in wild Ficus species. Pre-design CRISPR constructs that could be rapidly deployed if a devastating disease emerges.

**Geographic distribution**: Maintain verified clones on multiple continents, in different climates, under different management regimes — the ultimate redundancy.

This plan combines ancient wisdom (cloning by cuttings) with modern science (genomics, tissue culture, CRISPR) — ensuring the Bodhi Tree lineage persists for another 2,300 years.`,
      analogy: 'The conservation plan is like a comprehensive backup strategy for an irreplaceable database. You keep the original (living clones), make verified copies in multiple locations (geographic distribution), store the raw data (seed bank), maintain an emergency repair toolkit (CRISPR), and run continuous virus scans (disease surveillance). No single failure can destroy the data.',
      storyConnection: 'Sanghamitta carried one cutting across one ocean 2,300 years ago. Modern science allows us to protect the lineage with orders-of-magnitude more redundancy and precision. But the core insight remains the same: what is sacred must be actively preserved. The monks taught us that. The science gives us better tools to honour that teaching.',
      checkQuestion: 'Rank the conservation plan components from most to least important for the next 50 years. Justify your ranking.',
      checkAnswer: '(1) Geographic distribution — the greatest near-term risk is a local catastrophe (fire, war, climate) destroying all trees at one site. (2) Genetic verification — you cannot protect what you have not identified. Unverified "Bodhi Trees" may not be genuine. (3) Disease surveillance — catching a threat early provides time to respond. (4) Diversity insurance (seed bank) — needed only if a disease overwhelms all clones. (5) CRISPR preparedness — the most powerful tool but the last resort. (6) Tissue culture protocol — useful for expansion but not the highest priority when living trees already exist at multiple sites.',
      codeIntro: 'Build a risk assessment model for the Bodhi Tree lineage: quantify threats and evaluate the conservation plan.',
      code: `import numpy as np

np.random.seed(42)

# ============================================================
# CAPSTONE Stage 6: Conservation Risk Assessment
# ============================================================

class ConservationPlan:
    def __init__(self):
        self.n_sites = 10           # geographic sites with clones
        self.site_alive = np.ones(10, dtype=bool)
        self.has_seed_bank = True
        self.has_crispr = True
        self.verified = 8           # 8 of 10 sites genetically verified
        self.year = 0

    def simulate_year(self):
        self.year += 1
        events = []

        # Natural disaster: 2% chance per site per year
        for i in range(self.n_sites):
            if self.site_alive[i] and np.random.random() < 0.02:
                self.site_alive[i] = False
                events.append(f"Site {i+1} destroyed by natural disaster")

        # Disease: 0.5% chance of species-wide pathogen per year
        if np.random.random() < 0.005:
            # All sites affected, but diversity provides partial protection
            if self.has_seed_bank:
                killed = np.random.randint(0, self.n_sites // 3)
                events.append(f"Disease outbreak: {killed} sites affected (seed bank provides resistance genes)")
            else:
                killed = np.random.randint(self.n_sites // 2, self.n_sites)
                events.append(f"Disease outbreak: {killed} sites affected (no seed bank!)")

            kill_indices = np.random.choice(
                np.where(self.site_alive)[0],
                min(killed, self.site_alive.sum()),
                replace=False
            )
            for idx in kill_indices:
                self.site_alive[idx] = False

        # Replanting: if a site is lost, replant from tissue culture within 2 years
        for i in range(self.n_sites):
            if not self.site_alive[i] and np.random.random() < 0.3:
                self.site_alive[i] = True
                events.append(f"Site {i+1} replanted from tissue culture")

        return events

    def lineage_alive(self):
        return self.site_alive.sum() > 0

# Run Monte Carlo: 1000 simulations of 2300 years
n_sims = 1000
years = 2300
survival_count = 0
extinction_years = []

for sim in range(n_sims):
    plan = ConservationPlan()
    survived = True

    for y in range(years):
        plan.simulate_year()
        if not plan.lineage_alive():
            survived = False
            extinction_years.append(y)
            break

    if survived:
        survival_count += 1

print("Bodhi Tree Conservation Plan — Monte Carlo Risk Assessment")
print("=" * 60)
print(f"Simulations: {n_sims:,}")
print(f"Time horizon: {years:,} years")
print(f"Sites: 10 | Seed bank: YES | CRISPR: YES")
print()
print(f"Lineage survives {years} years: {survival_count}/{n_sims} "
      f"({100*survival_count/n_sims:.1f}%)")

if extinction_years:
    print(f"When extinction occurs:")
    print(f"  Earliest: year {min(extinction_years)}")
    print(f"  Median: year {int(np.median(extinction_years))}")
    print(f"  Latest: year {max(extinction_years)}")
else:
    print("No extinctions observed in any simulation!")

print()
print("With 10 distributed sites, seed banking, and tissue culture,")
print("the Bodhi Tree lineage has a >95% chance of surviving")
print("another 2,300 years.")
print()
print("The monks preserved it through devotion.")
print("Science can preserve it through redundancy.")
print("Together: near-certainty.")`,
      challenge: 'Run the same simulation WITHOUT the seed bank and CRISPR. How does the survival rate change? What is the single most important conservation measure?',
      successHint: 'The complete conservation plan demonstrates that science and tradition are complementary, not competing. The monks\' 2,300-year devotion to the Bodhi Tree lineage is one of the greatest conservation achievements in history. Modern science provides the tools to extend that achievement into the deep future. The tree that never dies — because people ensure it never dies.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete plant growth simulator with auxin dynamics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">The capstone project uses Python for plant growth simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
