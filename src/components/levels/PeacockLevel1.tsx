import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PeacockLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Animal communication types — nature\'s languages',
      concept: `Animals communicate constantly — and in far more ways than human speech. The peacock's dance is one of the most spectacular examples, but it's just one of many communication strategies.

**Major communication channels:**
1. **Visual**: colors, patterns, displays, body posture (peacock tail, firefly flashes)
2. **Acoustic**: calls, songs, vibrations (bird song, whale calls, cricket chirps)
3. **Chemical**: pheromones, scent marks (ant trails, dog urine marking, moth attraction)
4. **Tactile**: touch, grooming, vibration (bee waggle dance, primate grooming)
5. **Electrical**: electric fields (electric eels, elephantfish)
6. **Seismic**: ground vibrations (elephant foot stomps travel 30+ km)

**Each channel has trade-offs:**
- Visual: fast, directional, but requires line of sight and daylight
- Acoustic: works in darkness, travels far, but can attract predators
- Chemical: long-lasting, works around corners, but slow and undirectable
- Tactile: intimate and precise, but requires physical contact

The peacock uses primarily visual communication — and has evolved the most elaborate visual display in the animal kingdom.`,
      analogy: 'Animal communication channels are like human messaging platforms. Visual signals are like video calls — rich information but need a clear screen. Acoustic signals are like phone calls — work without seeing each other. Chemical signals are like sending a letter — slow but persistent. Tactile signals are like a handshake — personal but requires being in the same room.',
      storyConnection: 'The story says the peacock dances to call the rain. In reality, the peacock dances to call something even more important to it: a mate. But the rain connection isn\'t entirely wrong — peacocks become more active and vocal as monsoon humidity rises. Their calls echo across the forests of Assam as barometric pressure drops before a storm.',
      checkQuestion: 'Why do birds sing at dawn (the "dawn chorus") but rarely at midday?',
      checkAnswer: 'Several reasons: (1) Sound travels farther in cool, still morning air (less turbulence). (2) It\'s too dark to forage, so singing doesn\'t cost foraging time. (3) Surviving the night proves fitness — a dawn song says "I survived another night, I\'m still here." (4) Females are deciding who to mate with in the morning. The dawn chorus is a daily audition.',
      codeIntro: 'Compare the properties of different animal communication channels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Communication channel properties radar chart
ax = fig.add_subplot(2, 2, 1, polar=True)
ax.set_facecolor('#111827')
categories = ['Speed', 'Range', 'Persistence', 'Directionality', 'Info\\ncontent', 'Night\\nuse']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

channels = {
    'Visual': [9, 5, 1, 8, 9, 2],
    'Acoustic': [8, 8, 2, 4, 7, 9],
    'Chemical': [2, 6, 9, 2, 5, 8],
    'Tactile': [9, 1, 1, 9, 6, 9],
}
colors_ch = {'Visual': '#f59e0b', 'Acoustic': '#3b82f6', 'Chemical': '#22c55e', 'Tactile': '#ef4444'}

for name, vals in channels.items():
    vals_plot = vals + vals[:1]
    ax.plot(angles, vals_plot, 'o-', linewidth=2, color=colors_ch[name], label=name)
    ax.fill(angles, vals_plot, alpha=0.05, color=colors_ch[name])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=7)
ax.set_ylim(0, 10)
ax.set_yticklabels([])
ax.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# 2. Signal range by environment
ax = axes[0, 1]
ax.set_facecolor('#111827')
environments = ['Open field', 'Forest', 'Underwater', 'Night']
visual_range = [500, 50, 30, 5]
acoustic_range = [200, 100, 1000, 200]
chemical_range = [100, 100, 50, 100]

x = np.arange(len(environments))
w = 0.25
ax.bar(x - w, visual_range, w, color='#f59e0b', label='Visual')
ax.bar(x, acoustic_range, w, color='#3b82f6', label='Acoustic')
ax.bar(x + w, chemical_range, w, color='#22c55e', label='Chemical')
ax.set_xticks(x)
ax.set_xticklabels(environments, color='white')
ax.set_ylabel('Effective range (m)', color='white')
ax.set_title('Signal Range by Environment', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Animal communication examples
ax = axes[1, 0]
ax.set_facecolor('#111827')
animals = ['Peacock', 'Howler monkey', 'Ant', 'Elephant', 'Firefly', 'Whale']
primary_channel = ['Visual', 'Acoustic', 'Chemical', 'Seismic', 'Visual', 'Acoustic']
range_m = [100, 5000, 50, 30000, 200, 50000]

colors_anim = ['#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#3b82f6']
bars = ax.barh(animals, range_m, color=colors_anim)
ax.set_xlabel('Communication range (m)', color='white')
ax.set_title('Communication Range by Species', color='white', fontsize=11)
ax.set_xscale('log')
ax.tick_params(colors='gray')
for bar, r, ch in zip(bars, range_m, primary_channel):
    ax.text(r * 1.5, bar.get_y() + bar.get_height()/2, f'{ch}',
            va='center', color='white', fontsize=8)

# 4. Multi-modal communication in peacock
ax = axes[1, 1]
ax.set_facecolor('#111827')
modalities = ['Tail display', 'Wing shake', 'Head angle', 'Call ("meow")', 'Foot stomp', 'Plumage iridescence']
importance = [10, 7, 5, 8, 3, 9]
channel_type = ['Visual', 'Visual', 'Visual', 'Acoustic', 'Seismic', 'Visual']
colors_mod = ['#f59e0b' if c == 'Visual' else '#3b82f6' if c == 'Acoustic' else '#8b5cf6'
              for c in channel_type]

bars = ax.barh(modalities, importance, color=colors_mod, alpha=0.8)
ax.set_xlabel('Importance score', color='white')
ax.set_title('Peacock Multi-Modal Communication', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The peacock uses at least 6 communication signals simultaneously:")
print("  - Tail fan (visual): size, symmetry, eyespot count")
print("  - Iridescence (visual): feather quality signals health")
print("  - Wing shake (visual): vibrates tail to catch light")
print("  - Call (acoustic): 'meow' call carries 1+ km")
print("  - Foot stomp (seismic): ground vibrations")
print("  - Body posture (visual): angle toward female")
print()
print("Multi-modal signaling = harder to fake = more honest signal")`,
      challenge: 'Nocturnal animals can\'t use visual signals. Design a communication system for a nocturnal version of the peacock using only acoustic and chemical channels. What would its "display" be?',
      successHint: 'Understanding animal communication is understanding information transfer in biology. The same principles apply to human communication, network engineering, and even machine learning (signal processing).',
    },
    {
      title: 'Visual signals — the peacock\'s masterpiece',
      concept: `The peacock tail is the most elaborate visual signal in nature. Each feature encodes information:

**Eyespot count and quality:**
- Males have 100-170 eyespots on their tail feathers
- More eyespots = better nutrition = healthier male
- Eyespot symmetry indicates developmental stability (no parasites during growth)
- Females prefer males with MORE and MORE SYMMETRICAL eyespots

**Iridescence:**
- Peacock feathers aren't pigmented blue/green — they're structurally colored
- Microscopic barbule layers act as thin-film interference filters
- Slight changes in viewing angle cause dramatic color shifts
- Brighter iridescence = better feather condition = fitter male

**Train length and weight:**
- Train (tail) = 60% of body length
- Carrying this weight is a HANDICAP — it proves the male is strong enough to survive despite the burden
- This is the "handicap principle" (Zahavi, 1975): costly signals are honest because only fit males can afford them

**The display:**
- Male fans tail and vibrates at ~26 Hz (too fast for human eyes to see the flutter)
- This creates a shimmering effect — the eyespots appear to float
- Display angle is optimized for the female's viewing position`,
      analogy: 'The peacock\'s tail is like a luxury sports car. It\'s expensive, impractical, and makes you vulnerable (hard to run from predators). But THAT\'S THE POINT — only someone who can afford the cost can have one. The tail says: "I can waste resources on this ridiculous thing and STILL survive. Imagine how fit I must be." The more expensive the signal, the more honest the information.',
      storyConnection: 'When the peacock dances before the rain in the story, every eye on every tail feather is a biological certificate of health. The monsoon storms in Assam bring both opportunity (rain for nesting) and danger (flooding, predators). A male who can maintain 150 perfect eyespots through monsoon season is advertising extraordinary fitness.',
      checkQuestion: 'Scientists removed 20 eyespots from some peacock tails (by cutting feathers). These males got significantly fewer mates. But when scientists added fake eyespots (glued on), it didn\'t help. Why?',
      checkAnswer: 'Because females evaluate the ENTIRE display, not just eyespot count. The vibration pattern, the symmetry, the iridescence quality, and the overall body condition all matter. Fake eyespots don\'t shimmer correctly, aren\'t symmetrically placed, and don\'t respond naturally to the male\'s vibrations. The display is a multi-channel authentication system — you can\'t forge it by hacking one channel.',
      codeIntro: 'Analyze how eyespot number and quality relate to mating success.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a population of peacocks
n_males = 100

# Genetic quality (underlying fitness, 0-1)
quality = np.random.beta(3, 3, n_males)

# Eyespot count (correlated with quality + noise)
eyespots = (100 + 70 * quality + np.random.normal(0, 10, n_males)).astype(int)
eyespots = np.clip(eyespots, 80, 175)

# Iridescence score (correlated with quality)
iridescence = quality * 0.7 + np.random.normal(0, 0.1, n_males)
iridescence = np.clip(iridescence, 0, 1)

# Symmetry (higher quality = more symmetric)
symmetry = quality * 0.6 + 0.3 + np.random.normal(0, 0.08, n_males)
symmetry = np.clip(symmetry, 0, 1)

# Female choice: composite attractiveness score
attractiveness = 0.4 * (eyespots - 80) / 95 + 0.3 * iridescence + 0.3 * symmetry
attractiveness = np.clip(attractiveness, 0, 1)

# Mating success (proportional to attractiveness^2 — strong selection)
mating_prob = attractiveness ** 2
mating_prob /= mating_prob.sum()
matings = np.random.multinomial(200, mating_prob)  # 200 matings distributed

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Eyespots vs mating success
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(eyespots, matings, s=40, c=quality, cmap='RdYlGn', alpha=0.7, edgecolors='none')
ax.set_xlabel('Eyespot count', color='white')
ax.set_ylabel('Matings', color='white')
ax.set_title('Eyespots vs Mating Success', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Trend line
z = np.polyfit(eyespots, matings, 2)
p = np.poly1d(z)
x_trend = np.linspace(80, 175, 100)
ax.plot(x_trend, p(x_trend), '--', color='#f59e0b', linewidth=2)

# 2. Multi-trait assessment
ax = axes[0, 1]
ax.set_facecolor('#111827')
scatter = ax.scatter(iridescence, symmetry, s=matings * 10 + 10, c=eyespots,
                     cmap='YlOrRd', alpha=0.7, edgecolors='white', linewidth=0.3)
ax.set_xlabel('Iridescence score', color='white')
ax.set_ylabel('Symmetry score', color='white')
ax.set_title('Multi-Trait Female Choice (size = matings)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(scatter, ax=ax, label='Eyespots')

# 3. Handicap principle: tail length vs survival
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Longer tail = more attractive but more vulnerable
tail_lengths = np.linspace(0.5, 2.5, 100)  # meters
attractiveness_curve = 1 / (1 + np.exp(-3 * (tail_lengths - 1.5)))
survival_curve = 1 / (1 + np.exp(3 * (tail_lengths - 2.0)))
fitness = attractiveness_curve * survival_curve

ax.plot(tail_lengths, attractiveness_curve, color='#ef4444', linewidth=2, label='Attractiveness')
ax.plot(tail_lengths, survival_curve, color='#3b82f6', linewidth=2, label='Survival')
ax.plot(tail_lengths, fitness, color='#22c55e', linewidth=3, label='Net fitness')

optimal_idx = np.argmax(fitness)
ax.axvline(tail_lengths[optimal_idx], color='#f59e0b', linestyle='--', alpha=0.7)
ax.annotate(f'Optimal: {tail_lengths[optimal_idx]:.1f}m', xy=(tail_lengths[optimal_idx], fitness[optimal_idx]),
            xytext=(0.3, 0.7), color='#f59e0b', fontsize=10)

ax.set_xlabel('Tail length (m)', color='white')
ax.set_ylabel('Score (0-1)', color='white')
ax.set_title('Handicap Principle: Attractiveness vs Survival', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Selection across generations
ax = axes[1, 1]
ax.set_facecolor('#111827')
generations = 50
mean_eyespots = [np.mean(eyespots)]
pop_eyespots = eyespots.copy()

for gen in range(generations):
    # Female choice selects for more eyespots
    attract = (pop_eyespots - 80) / 95
    mating_p = attract ** 2
    mating_p = np.maximum(mating_p, 0.001)
    mating_p /= mating_p.sum()
    parents = np.random.choice(n_males, n_males, p=mating_p)
    pop_eyespots = pop_eyespots[parents] + np.random.normal(0, 3, n_males)
    # Survival selection against extreme tails
    survival_p = 1 / (1 + np.exp(0.05 * (pop_eyespots - 200)))
    alive = np.random.random(n_males) < survival_p
    if np.sum(alive) > 10:
        pop_eyespots = pop_eyespots[alive]
        pop_eyespots = np.resize(pop_eyespots, n_males)  # maintain pop size
    pop_eyespots = np.clip(pop_eyespots, 80, 200)
    mean_eyespots.append(np.mean(pop_eyespots))

ax.plot(range(len(mean_eyespots)), mean_eyespots, color='#22c55e', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean eyespot count', color='white')
ax.set_title('Sexual Selection Drives Eyespot Evolution', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Peacock display components and their information content:")
print(f"  Eyespot count ({np.mean(eyespots):.0f} avg): nutrition quality, age")
print(f"  Iridescence ({np.mean(iridescence):.2f} avg): feather condition, health")
print(f"  Symmetry ({np.mean(symmetry):.2f} avg): developmental stability")
print(f"  Correlation with mating: r = {np.corrcoef(eyespots, matings)[0,1]:.3f}")`,
      challenge: 'Add a "parasite" factor: infected males lose 20 eyespots and have lower iridescence. Run the simulation with 30% infection rate. Can females detect infected males through the display?',
      successHint: 'The peacock\'s display is a live, multi-dimensional fitness certificate. Understanding why females evolved to read it — and why males evolved to produce it — is understanding sexual selection, one of the most powerful forces in evolution.',
    },
    {
      title: 'Honest vs dishonest signals — the evolution of trust',
      concept: `If peacock eyespots attract mates, why don't peacocks "cheat" by growing fake eyespots? The answer reveals a fundamental principle of communication: **signal honesty**.

**Honest signals** are reliable indicators of quality because they're costly to produce:
- A peacock tail costs energy, increases predation risk, and requires good nutrition
- Only genuinely fit males can afford the cost → signal is honest
- This is the **handicap principle** (Amotz Zahavi, 1975)

**Dishonest signals** (cheating) exist but are kept rare:
- Hoverflies mimic wasps (look dangerous, but are harmless)
- Some orchids mimic female insects to trick male pollinators
- Anglerfishes have a "lure" that mimics prey

**Why doesn't everyone cheat?**
- If too many prey mimic being dangerous, predators stop avoiding the signal
- The signal loses its value — this is called **signal degradation**
- Natural selection maintains a balance: enough cheaters to benefit, not enough to degrade the signal

**The peacock's anti-cheating system:**
- Multiple redundant signals (eyespots + iridescence + vibration + call + body condition)
- Each signal is independently costly to fake
- Females assess the COMBINATION — like a multi-factor authentication system`,
      analogy: 'Honest signaling is like a college degree. It costs years of time and effort, so it (mostly) signals genuine knowledge. A fake degree is cheaper but risky if caught. If everyone faked degrees, degrees would become worthless, and employers would need a new signal. Nature maintains honest signaling the same way: cheaters are punished, honest signals are rewarded.',
      storyConnection: 'In the Assamese countryside, peacocks with the most magnificent tails are immediately recognizable — their display cannot be faked by a weaker male. The monsoon season in Assam is when displays peak, and the humidity that makes the dances happen is also what tests the males most severely. A tail that shimmers in the Assamese monsoon rain is the most honest signal in the forest.',
      checkQuestion: 'Coral snakes are venomous (red-yellow-black bands). King snakes are harmless but mimic the same pattern. If there were more king snakes than coral snakes, what would happen to the mimicry\'s effectiveness?',
      checkAnswer: 'Predators would learn (through non-lethal encounters with harmless king snakes) that the warning pattern is unreliable. They would start eating both species. The mimicry only works when the "honest" signalers (real coral snakes) are common enough that the cost of ignoring the signal (getting envenomated) exceeds the benefit of testing it. This is frequency-dependent selection.',
      codeIntro: 'Model the evolution of honest vs dishonest signaling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Evolutionary game: honest vs dishonest signalers
# Honest males: pay cost C to signal, get benefit B if detected by females
# Dishonest males: pay no cost, get benefit B if not detected, penalty P if detected
# Female detection accuracy depends on frequency of cheaters

n_males = 200
generations = 200
honest_cost = 0.3  # fitness cost of honest signaling
signal_benefit = 0.8  # mating benefit of appearing high-quality
detection_penalty = 0.5  # cost of being detected as a cheater

# Track proportions
honest_frac_history = []

# Initial population: 80% honest, 20% dishonest
is_honest = np.random.random(n_males) < 0.8

for gen in range(generations):
    n_honest = np.sum(is_honest)
    n_dishonest = n_males - n_honest
    honest_frac = n_honest / n_males
    honest_frac_history.append(honest_frac)

    # Female detection accuracy: better when cheaters are rare (more suspicious)
    detection_rate = 0.3 + 0.5 * (1 - honest_frac)  # 30-80% detection

    # Fitness calculation
    fitness = np.ones(n_males)
    for i in range(n_males):
        if is_honest[i]:
            fitness[i] = 1.0 - honest_cost + signal_benefit  # pay cost, get benefit
        else:
            # Dishonest: might get caught
            if np.random.random() < detection_rate:
                fitness[i] = 1.0 - detection_penalty  # caught cheating
            else:
                fitness[i] = 1.0 + signal_benefit  # free benefit (no cost paid)

    fitness = np.maximum(fitness, 0.01)
    fitness /= fitness.sum()

    # Next generation
    parents = np.random.choice(n_males, n_males, p=fitness)
    is_honest = is_honest[parents]
    # Small mutation rate
    mutation = np.random.random(n_males) < 0.02
    is_honest[mutation] = ~is_honest[mutation]

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Honest fraction over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(range(generations), honest_frac_history, color='#22c55e', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Fraction honest', color='white')
ax.set_title('Evolution of Honest Signaling', color='white', fontsize=11)
ax.axhline(0.5, color='gray', linestyle=':', alpha=0.3)
ax.tick_params(colors='gray')
ax.set_ylim(0, 1)

# 2. Payoff matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
cheater_fracs = np.linspace(0, 1, 100)
honest_payoff = np.full(100, 1.0 - honest_cost + signal_benefit)
detection_rates = 0.3 + 0.5 * cheater_fracs
cheater_payoff = (1 - detection_rates) * (1.0 + signal_benefit) + detection_rates * (1.0 - detection_penalty)

ax.plot(cheater_fracs * 100, honest_payoff, color='#22c55e', linewidth=2, label='Honest payoff')
ax.plot(cheater_fracs * 100, cheater_payoff, color='#ef4444', linewidth=2, label='Cheater payoff')

# Equilibrium point
eq_idx = np.argmin(np.abs(honest_payoff - cheater_payoff))
ax.axvline(cheater_fracs[eq_idx] * 100, color='#f59e0b', linestyle='--',
           label=f'Equilibrium ({cheater_fracs[eq_idx]*100:.0f}% cheaters)')
ax.scatter(cheater_fracs[eq_idx] * 100, honest_payoff[eq_idx], s=100, color='#f59e0b', zorder=5)

ax.set_xlabel('% cheaters in population', color='white')
ax.set_ylabel('Expected fitness', color='white')
ax.set_title('Payoff Depends on Cheater Frequency', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Multi-signal authentication
ax = axes[1, 0]
ax.set_facecolor('#111827')
n_signals = range(1, 8)
cheat_success = [0.7 ** n for n in n_signals]  # each signal reduces cheating by 30%
ax.bar([str(n) for n in n_signals], [c * 100 for c in cheat_success], color='#ef4444', alpha=0.7)
ax.set_xlabel('Number of independent signals', color='white')
ax.set_ylabel('Cheating success rate (%)', color='white')
ax.set_title('Multi-Signal Authentication', color='white', fontsize=11)
ax.tick_params(colors='gray')

for i, (n, c) in enumerate(zip(n_signals, cheat_success)):
    ax.text(i, c * 100 + 2, f'{c*100:.1f}%', ha='center', color='white', fontsize=9)

# 4. Examples of honest and dishonest signals
ax = axes[1, 1]
ax.set_facecolor('#111827')
examples = {
    'Peacock tail': ('Honest', 0.9, '#22c55e'),
    'Lion mane': ('Honest', 0.85, '#22c55e'),
    'Frog call depth': ('Honest', 0.75, '#22c55e'),
    'Hoverfly wasp mimic': ('Dishonest', 0.6, '#ef4444'),
    'Orchid insect mimic': ('Dishonest', 0.7, '#ef4444'),
    'Anglerfish lure': ('Dishonest', 0.8, '#ef4444'),
}

names = list(examples.keys())
effectivness = [v[1] for v in examples.values()]
colors_ex = [v[2] for v in examples.values()]
types = [v[0] for v in examples.values()]

bars = ax.barh(names, effectivness, color=colors_ex, alpha=0.7)
ax.set_xlabel('Signal effectiveness', color='white')
ax.set_title('Honest vs Dishonest Signals in Nature', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, t in zip(bars, types):
    ax.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
            t, va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Signal honesty equilibrium:")
print(f"  Honest signaling cost: {honest_cost}")
print(f"  Signal benefit: {signal_benefit}")
print(f"  Detection penalty: {detection_penalty}")
print(f"  Equilibrium: ~{cheater_fracs[eq_idx]*100:.0f}% cheaters")
print()
print("The peacock uses 6+ signals simultaneously")
print(f"  Probability of faking all 6: {0.7**6*100:.1f}% = almost impossible")`,
      challenge: 'Increase the detection penalty from 0.5 to 1.0 (cheaters are heavily punished). How does this change the equilibrium? What if there is no penalty at all (0)?',
      successHint: 'Honest signaling theory explains why expensive engagement rings persist, why elite university degrees are valued, and why peacock tails keep getting bigger. The same game theory governs communication in nature, economics, and human society.',
    },
    {
      title: 'Sexual selection — Darwin\'s other theory',
      concept: `Natural selection explains survival. But what explains the peacock's absurd tail — which actually REDUCES survival? **Sexual selection** — Darwin's other great theory.

**Sexual selection** occurs when individuals compete for mates. Two forms:

1. **Intrasexual selection** (male-male competition):
   - Fighting (deer antlers, elephant seals)
   - Territorial defense (songbird territories)
   - Sperm competition (internal)

2. **Intersexual selection** (female choice):
   - Display assessment (peacock tail, bowerbird nests)
   - Resource assessment (female chooses male with best territory)
   - Good genes hypothesis (ornaments signal genetic quality)

**Fisher's runaway selection:**
A positive feedback loop: females prefer long tails → long-tailed males have more sons with long tails AND more daughters who prefer long tails → tails get longer and longer → until survival costs halt the process.

**The peacock paradox resolved:**
The tail reduces survival but increases mating success. Net fitness = survival × mating success. The optimal tail is one where marginal mating benefit equals marginal survival cost.`,
      analogy: 'Sexual selection is like a hiring process with two filters. First, you must survive the resume screen (natural selection — basic competence). Then you compete in the interview (sexual selection — showing off). Some candidates invest heavily in interview skills (flashy displays) at the cost of actual productivity (survival). The job goes not to the most productive, but to the most impressive interviewer who meets the minimum competence bar.',
      storyConnection: 'Across the tea gardens and forests of Assam, the peacock\'s dance is a daily interview — and the peahens are the hiring committee. Every spread of the tail is a resume display. Every shake creates a shimmering presentation. The monsoon rains are the audition season, and only males who pass both nature\'s survival test and the female\'s beauty test will leave descendants.',
      checkQuestion: 'Male peacocks have elaborate tails. Female peahens are dull brown. Why the extreme difference?',
      checkAnswer: 'This is sexual dimorphism driven by different selection pressures. Males compete for mates through display — elaborate tails increase mating success. Females incubate eggs and raise chicks — camouflage (dull colors) increases their survival and their offspring\'s survival. Each sex is optimized for its primary reproductive challenge: males for attraction, females for survival.',
      codeIntro: 'Simulate sexual selection driving the evolution of peacock tail length.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Fisher's runaway sexual selection model
generations = 300
pop_size = 500

# Male trait: tail length (starts moderate)
male_tails = np.random.normal(50, 10, pop_size)  # cm

# Female preference: preferred tail length (starts moderate)
female_pref = np.random.normal(50, 10, pop_size)

# Track over time
mean_tail = []
mean_pref = []
variance_tail = []

for gen in range(generations):
    mean_tail.append(np.mean(male_tails))
    mean_pref.append(np.mean(female_pref))
    variance_tail.append(np.std(male_tails))

    # Natural selection on males: longer tails reduce survival
    survival_prob = 1 / (1 + np.exp(0.03 * (male_tails - 120)))  # sigmoid
    natural_survivors = np.random.random(pop_size) < survival_prob

    # If too few survive, can't continue
    surviving_males = male_tails[natural_survivors]
    if len(surviving_males) < 20:
        break

    # Sexual selection: females choose males closest to their preference
    offspring_tails = []
    offspring_prefs = []

    for i in range(pop_size):
        # Female chooses the male whose tail is closest to her preference
        # (from a random sample of 5 males — not all males visible)
        candidates = np.random.choice(surviving_males, min(5, len(surviving_males)))
        distances = np.abs(candidates - female_pref[i])
        chosen = candidates[np.argmin(distances)]

        # Offspring inherit mix of parents' genes + mutation
        new_tail = chosen + np.random.normal(0, 3)
        new_pref = female_pref[i] + np.random.normal(0, 3)

        # Preference drift: daughters of long-tailed males inherit preference for long tails
        new_pref += 0.1 * (chosen - np.mean(surviving_males))

        offspring_tails.append(new_tail)
        offspring_prefs.append(new_pref)

    male_tails = np.array(offspring_tails)
    female_pref = np.array(offspring_prefs)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Runaway process
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(range(len(mean_tail)), mean_tail, color='#3b82f6', linewidth=2, label='Mean tail length')
ax.plot(range(len(mean_pref)), mean_pref, color='#ef4444', linewidth=2, label='Mean female preference')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Tail length (cm)', color='white')
ax.set_title('Fisher\\'s Runaway: Tail & Preference Co-evolve', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Trait variance over time
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(range(len(variance_tail)), variance_tail, color='#22c55e', linewidth=2)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Tail length std dev', color='white')
ax.set_title('Variation in Tail Length', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Distribution at start vs end
ax = axes[1, 0]
ax.set_facecolor('#111827')
start_tails = np.random.normal(50, 10, pop_size)
ax.hist(start_tails, bins=30, alpha=0.6, color='#3b82f6', label='Generation 0', density=True)
ax.hist(male_tails, bins=30, alpha=0.6, color='#22c55e', label=f'Generation {len(mean_tail)}', density=True)
ax.set_xlabel('Tail length (cm)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Tail Length Distribution Shift', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Fitness landscape
ax = axes[1, 1]
ax.set_facecolor('#111827')
tails = np.linspace(20, 150, 200)
natural_fitness = 1 / (1 + np.exp(0.03 * (tails - 120)))
sexual_fitness = np.exp(-0.001 * (tails - np.mean(female_pref))**2)
total_fitness = natural_fitness * sexual_fitness

ax.plot(tails, natural_fitness, color='#ef4444', linewidth=2, label='Natural selection (survival)')
ax.plot(tails, sexual_fitness, color='#3b82f6', linewidth=2, label='Sexual selection (mating)')
ax.plot(tails, total_fitness, color='#22c55e', linewidth=3, label='Total fitness')

opt = tails[np.argmax(total_fitness)]
ax.axvline(opt, color='#f59e0b', linestyle='--', label=f'Optimal tail: {opt:.0f}cm')
ax.set_xlabel('Tail length (cm)', color='white')
ax.set_ylabel('Fitness', color='white')
ax.set_title('Fitness Landscape: Two Forces in Tension', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fisher's runaway sexual selection:")
print(f"  Starting tail: 50 cm")
print(f"  Final tail: {mean_tail[-1]:.0f} cm ({mean_tail[-1]/50:.1f}x increase)")
print(f"  Female preference co-evolved: {mean_pref[-1]:.0f} cm")
print()
print("The tail grows until natural selection stops it:")
print(f"  Optimal tail (balancing survival + mating): ~{opt:.0f} cm")
print("  This is why peacock tails are big but not infinitely big.")`,
      challenge: 'Add a "predator" that preferentially catches males with tails > 100 cm (highly visible). How does predation pressure change the equilibrium tail length?',
      successHint: 'Sexual selection is the reason males of many species are larger, more colorful, or more vocal than females. It explains 50% of evolution that natural selection alone cannot. Darwin called it "descent in relation to sex" — his second great contribution to biology.',
    },
    {
      title: 'Barometric pressure sensitivity — can peacocks predict rain?',
      concept: `The folk belief that peacocks dance before rain has a scientific basis: many animals can detect **barometric pressure** changes, and falling pressure indicates approaching rain.

**Barometric pressure basics:**
- Normal: ~1013 hPa (hectopascals) at sea level
- Before storms: pressure drops (sometimes rapidly, 10-20 hPa in hours)
- After storms: pressure rises

**How might peacocks detect pressure changes?**
1. **Inner ear sensitivity**: the semicircular canals in birds' ears are pressure-sensitive
2. **Paratympanic organ**: a unique pressure-sensing organ in birds' middle ear
3. **Behavioral sensitivity**: pressure changes cause discomfort, leading to restlessness

**Evidence:**
- Birds become restless when barometric pressure drops
- Migratory birds time departure with high-pressure systems
- Sharks and fish change depth with pressure changes
- Some humans experience headaches before storms (similar mechanism)

**The peacock rain dance connection:**
Falling pressure → increased activity and calling → dancing. The peacock isn't "predicting" rain intentionally — it's responding to physiological discomfort from pressure change. But the result looks like prediction, and it's remarkably reliable.`,
      analogy: 'Barometric pressure sensitivity is like your phone\'s weather widget — it detects changes in conditions and gives you a notification. The peacock\'s "widget" is built into its inner ear. When pressure drops (storm approaching), it gets a biological notification (restlessness) and responds (dancing, calling). It\'s not magic — it\'s a built-in weather sensor.',
      storyConnection: 'In Assam, where monsoon rains are dramatic and sudden, the peacock\'s sensitivity to pressure drops is a genuine survival advantage. Knowing rain is coming means finding shelter, adjusting foraging, and — for males — taking advantage of the increased female attention that comes with rain season. The story captures a real biological phenomenon.',
      checkQuestion: 'If peacocks can detect pressure drops, why can\'t humans reliably feel weather changes (most of us, anyway)?',
      checkAnswer: 'Some humans CAN detect pressure changes — people with joint conditions (arthritis) or migraines report increased symptoms before storms. But most humans have lost this sensitivity because we don\'t need it: we have weather forecasts, buildings, and umbrellas. Animals that must find shelter or adjust behavior in real-time have maintained and refined this ancient sense. It is a "use it or lose it" evolutionary story.',
      codeIntro: 'Analyze the relationship between barometric pressure and peacock activity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 90 days of barometric pressure and peacock activity
days = 90
hours = np.arange(days * 24) / 24  # hours as fraction of days

# Generate realistic pressure data with weather events
pressure = 1013 * np.ones(days * 24)  # hPa
# Add weather events (pressure drops)
events = [(10, 15, -12), (25, 30, -8), (40, 43, -15), (55, 60, -10), (70, 75, -18)]
for start, end, drop in events:
    for h in range(start * 24, min(end * 24, len(pressure))):
        phase = (h - start * 24) / ((end - start) * 24)
        if phase < 0.5:
            pressure[h] = 1013 + drop * 2 * phase  # dropping
        else:
            pressure[h] = 1013 + drop * 2 * (1 - phase)  # recovering

# Add noise
pressure += np.random.normal(0, 1, len(pressure))

# Rain probability (high when pressure is low)
rain_prob = np.clip((1013 - pressure) / 20, 0, 1)
rain = np.random.random(len(pressure)) < rain_prob * 0.3

# Peacock activity (responds to pressure CHANGE, not absolute pressure)
dp_dt = np.gradient(pressure)  # pressure change rate
peacock_activity = np.clip(-dp_dt * 5 + np.random.normal(0, 0.3, len(pressure)), 0, 10)
# Daytime activity only
for h in range(len(peacock_activity)):
    hour_of_day = h % 24
    if hour_of_day < 5 or hour_of_day > 20:
        peacock_activity[h] *= 0.1  # quiet at night

fig, axes = plt.subplots(3, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Pressure and rain over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, pressure, color='#3b82f6', linewidth=1)
ax.set_ylabel('Pressure (hPa)', color='white')
ax.set_title('Barometric Pressure Over 90 Days', color='white', fontsize=11)
ax.tick_params(colors='gray')
# Mark rain events
rain_hours = hours[rain]
ax.scatter(rain_hours, pressure[rain], s=2, color='#22c55e', alpha=0.5)

# 2. Peacock activity
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(hours, peacock_activity, color='#f59e0b', linewidth=0.5, alpha=0.7)
# Daily average
daily_avg = np.array([np.mean(peacock_activity[d*24:(d+1)*24]) for d in range(days)])
ax.plot(np.arange(days) + 0.5, daily_avg, color='#ef4444', linewidth=2, label='Daily average')
ax.set_ylabel('Peacock activity', color='white')
ax.set_title('Peacock Activity Level', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Pressure change vs activity (correlation)
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Downsample for clarity
hourly_dp = dp_dt[::6]
hourly_act = peacock_activity[::6]
ax.scatter(hourly_dp, hourly_act, s=10, color='#22c55e', alpha=0.3)
# Trend line
mask = np.isfinite(hourly_dp) & np.isfinite(hourly_act)
z = np.polyfit(hourly_dp[mask], hourly_act[mask], 1)
p = np.poly1d(z)
x_line = np.linspace(min(hourly_dp), max(hourly_dp), 100)
ax.plot(x_line, p(x_line), color='#ef4444', linewidth=2)
corr = np.corrcoef(hourly_dp[mask], hourly_act[mask])[0, 1]
ax.set_xlabel('Pressure change rate (hPa/h)', color='white')
ax.set_ylabel('Activity level', color='white')
ax.set_title(f'Pressure Change vs Activity (r = {corr:.3f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 4. Predictive power: activity predicts rain
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Does high activity predict rain in the next 6-12 hours?
lead_times = [3, 6, 12, 24, 48]
prediction_accuracy = []
for lead in lead_times:
    correct = 0
    total = 0
    for h in range(len(peacock_activity) - lead):
        if peacock_activity[h] > 3:  # "dancing" threshold
            total += 1
            if any(rain[h:h+lead]):
                correct += 1
    accuracy = correct / max(total, 1)
    prediction_accuracy.append(accuracy * 100)

ax.bar([str(l) + 'h' for l in lead_times], prediction_accuracy, color='#8b5cf6', alpha=0.7)
ax.set_xlabel('Prediction lead time', color='white')
ax.set_ylabel('% of dances followed by rain', color='white')
ax.set_title('Can Peacock Activity Predict Rain?', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.axhline(50, color='gray', linestyle=':', alpha=0.3, label='Chance level')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# 5. Pressure sensor comparison
ax = axes[2, 0]
ax.set_facecolor('#111827')
sensors = ['Digital barometer', 'Peacock behavior', 'Human arthritis', 'Cricket chirp rate', 'Frog calls']
accuracy_sensors = [99, 72, 55, 60, 65]
lead_h = [48, 6, 4, 2, 3]

ax.scatter(lead_h, accuracy_sensors, s=100, color=['#3b82f6', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6'],
           edgecolors='white', linewidth=1)
for name, l, a in zip(sensors, lead_h, accuracy_sensors):
    ax.annotate(name, xy=(l, a), xytext=(5, 5), textcoords='offset points', color='white', fontsize=9)
ax.set_xlabel('Lead time (hours)', color='white')
ax.set_ylabel('Accuracy (%)', color='white')
ax.set_title('Biological vs Electronic Weather Prediction', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 6. Monsoon pattern
ax = axes[2, 1]
ax.set_facecolor('#111827')
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
rainfall_assam = [15, 25, 60, 150, 280, 350, 380, 320, 250, 150, 40, 12]  # mm
peacock_display = [1, 2, 4, 6, 8, 10, 10, 9, 7, 4, 2, 1]  # activity score

ax2 = ax.twinx()
ax.bar(months, rainfall_assam, color='#3b82f6', alpha=0.4, label='Rainfall (mm)')
ax2.plot(months, peacock_display, 'o-', color='#f59e0b', linewidth=2, label='Peacock display')
ax.set_ylabel('Monthly rainfall (mm)', color='#3b82f6')
ax2.set_ylabel('Display frequency', color='#f59e0b')
ax.set_title('Assam Monsoon & Peacock Display Season', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='#f59e0b')
ax.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.legend(loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Peacock rain prediction analysis:")
print(f"  Correlation between pressure drop and activity: r = {corr:.3f}")
for l, a in zip(lead_times, prediction_accuracy):
    print(f"  Activity predicts rain within {l}h: {a:.0f}% accuracy")
print()
print("Not perfect, but significantly better than chance (50%)")
print("The folk wisdom has a genuine scientific basis!")`,
      challenge: 'Add temperature and humidity as additional predictors of peacock activity. Build a simple linear model. Does a multi-variable model predict peacock behavior better than pressure alone?',
      successHint: 'The connection between animal behavior and weather is real and measurable. Traditional ecological knowledge (like "peacocks dance before rain") often encodes genuine environmental signals. Science doesn\'t replace traditional knowledge — it explains and validates it.',
    },
    {
      title: 'Weather prediction by animals — bio-meteorology',
      concept: `Peacocks are not the only animal weather forecasters. Animals across species have evolved sensitivity to environmental changes that precede weather events.

**Known animal weather predictors:**
- **Birds**: fly lower before storms (insect prey descends with dropping pressure)
- **Ants**: seal colony entrances before rain
- **Cows**: lie down before rain (folk wisdom — weak evidence, but some)
- **Sharks**: swim to deeper water before hurricanes
- **Elephants**: detect infrasound from distant storms (can "hear" rain 100+ km away)
- **Frogs**: increase calling before rain (humidity triggers breeding behavior)
- **Bees**: return to the hive before storms

**How they sense it:**
1. **Barometric pressure** (inner ear, swim bladders in fish)
2. **Humidity** (skin sensors, antenna in insects)
3. **Infrasound** (low-frequency sounds from storms travel huge distances)
4. **Electromagnetic changes** (lightning creates electromagnetic fields detectable by some animals)
5. **Static electricity** (builds before storms; bees and spiders detect it)

**Can this be used for weather forecasting?**
Probably not better than modern meteorology. But in areas without weather infrastructure, animal behavior remains a valuable indicator — especially for short-term, local predictions.`,
      analogy: 'Animals as weather predictors are like a network of cheap, distributed sensors. Each one is imprecise and noisy, but together they create a "crowd-sourced" weather forecast. Modern weather stations are fewer, more expensive, and more accurate — but they can\'t be everywhere. In remote parts of Assam, the peacock-and-frog network is still the most locally accurate forecast available.',
      storyConnection: 'In the villages of Assam, generations of farmers have watched peacocks, frogs, and ants to plan their agricultural activities. The monsoon timing determines everything — when to plant, when to harvest, when to move livestock. The peacock\'s dance is not just entertainment; it\'s an agricultural signal. When the peacock dances in your courtyard, the rains are close.',
      checkQuestion: 'If animals are genuinely good at predicting weather, why haven\'t we built weather prediction systems based on animal behavior monitoring?',
      checkAnswer: 'Several reasons: (1) Animal behavior is variable and hard to standardize. (2) Modern weather models using satellite data, radar, and physics simulations are far more accurate for 24-48 hour forecasts. (3) Animal behavior data is hard to collect at scale. (4) The correlation is statistical, not deterministic — animals sometimes "predict" rain that doesn\'t come. BUT: for very short-term, very local prediction (next 2-6 hours), animal behavior can complement technology, especially in remote areas.',
      codeIntro: 'Analyze the accuracy of different animal weather predictors compared to technology.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 365 days of weather and animal behavior
days = 365

# True weather: random rain events
# Monsoon pattern: more rain June-September
month_rain_prob = [0.05, 0.05, 0.1, 0.2, 0.35, 0.5, 0.55, 0.5, 0.4, 0.2, 0.08, 0.05]
daily_rain_prob = np.array([month_rain_prob[int(d * 12 / 365)] for d in range(days)])
rain_actual = np.random.random(days) < daily_rain_prob

# Pressure (drops before rain)
pressure = np.ones(days) * 1013
for d in range(days):
    if d > 0:
        pressure[d] = pressure[d-1] + np.random.normal(0, 2)
    if rain_actual[d]:
        pressure[d] -= np.random.uniform(5, 15)
    pressure[d] = np.clip(pressure[d], 980, 1040)

# Animal predictions (noisy versions of truth)
def animal_predict(base_prob, sensitivity, lag=0):
    predictions = np.zeros(days, dtype=bool)
    for d in range(lag, days):
        signal = base_prob if rain_actual[d - lag] else (1 - base_prob)
        noise = np.random.normal(0, 1 - sensitivity)
        predictions[d] = (signal + noise) > 0.5
    return predictions

predictors = {
    'Peacock dance': animal_predict(0.7, 0.6, lag=0),
    'Frog chorus': animal_predict(0.75, 0.5, lag=0),
    'Ant behavior': animal_predict(0.65, 0.55, lag=1),
    'Bird flight': animal_predict(0.6, 0.5, lag=0),
    'Barometer (tech)': pressure < 1005,
    'Weather model': animal_predict(0.9, 0.8, lag=0),  # best but simulated
}

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Accuracy comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(predictors.keys())
accuracies = []
precisions = []
recalls = []

for name, pred in predictors.items():
    tp = np.sum(pred & rain_actual)
    fp = np.sum(pred & ~rain_actual)
    fn = np.sum(~pred & rain_actual)
    tn = np.sum(~pred & ~rain_actual)
    accuracy = (tp + tn) / days * 100
    precision = tp / max(tp + fp, 1) * 100
    recall = tp / max(tp + fn, 1) * 100
    accuracies.append(accuracy)
    precisions.append(precision)
    recalls.append(recall)

x = np.arange(len(names))
w = 0.25
ax.bar(x - w, accuracies, w, color='#22c55e', label='Accuracy')
ax.bar(x, precisions, w, color='#3b82f6', label='Precision')
ax.bar(x + w, recalls, w, color='#f59e0b', label='Recall')
ax.set_xticks(x)
ax.set_xticklabels(names, rotation=25, fontsize=7, color='white')
ax.set_ylabel('% score', color='white')
ax.set_title('Predictor Performance Comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Ensemble prediction
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Combine animal predictors (majority vote)
animal_preds = np.column_stack([predictors[n] for n in ['Peacock dance', 'Frog chorus', 'Ant behavior', 'Bird flight']])
ensemble_votes = np.sum(animal_preds, axis=1)
ensemble_pred = ensemble_votes >= 2  # majority

tp = np.sum(ensemble_pred & rain_actual)
fp = np.sum(ensemble_pred & ~rain_actual)
fn = np.sum(~ensemble_pred & rain_actual)
tn = np.sum(~ensemble_pred & ~rain_actual)

labels = ['True Pos.', 'False Pos.', 'False Neg.', 'True Neg.']
values = [tp, fp, fn, tn]
colors_cm = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6']
ax.bar(labels, values, color=colors_cm)
ax.set_ylabel('Count (days)', color='white')
ensemble_acc = (tp + tn) / days * 100
ax.set_title(f'Ensemble (4 animals): {ensemble_acc:.0f}% accuracy', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Monthly accuracy
ax = axes[1, 0]
ax.set_facecolor('#111827')
monthly_acc = []
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for m in range(12):
    start = int(m * 365 / 12)
    end = int((m + 1) * 365 / 12)
    correct = np.sum(ensemble_pred[start:end] == rain_actual[start:end])
    total = end - start
    monthly_acc.append(correct / total * 100)

ax.bar(month_names, monthly_acc, color='#8b5cf6', alpha=0.7)
ax.axhline(50, color='gray', linestyle=':', alpha=0.3, label='Chance')
ax.set_ylabel('Ensemble accuracy (%)', color='white')
ax.set_title('Prediction Accuracy by Month', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. How many animals needed?
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_animals_range = range(1, 11)
ensemble_accs = []
for n_anim in n_animals_range:
    # Create n_anim independent animal predictors
    all_preds = np.column_stack([animal_predict(0.65, 0.55) for _ in range(n_anim)])
    ens = np.sum(all_preds, axis=1) > (n_anim / 2)
    acc = np.sum(ens == rain_actual) / days * 100
    ensemble_accs.append(acc)

ax.plot(list(n_animals_range), ensemble_accs, 'o-', color='#22c55e', linewidth=2)
ax.axhline(accuracies[-1], color='#ef4444', linestyle='--', label=f'Weather model ({accuracies[-1]:.0f}%)')
ax.set_xlabel('Number of animal predictors', color='white')
ax.set_ylabel('Ensemble accuracy (%)', color='white')
ax.set_title('More Predictors = Better Ensemble', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Bio-meteorology results (365 days):")
print(f"  Actual rain days: {np.sum(rain_actual)}")
for name, acc, prec, rec in zip(names, accuracies, precisions, recalls):
    print(f"  {name:20s}: accuracy={acc:.0f}%, precision={prec:.0f}%, recall={rec:.0f}%")
print(f"\\n  4-animal ensemble: {ensemble_acc:.0f}% accuracy")
print(f"  Wisdom of crowds: combining imperfect predictors beats any single one")`,
      challenge: 'Weight the ensemble by each animal\'s historical accuracy instead of equal votes. Does weighted voting improve the prediction? This is exactly how ensemble machine learning models (like Random Forest) work.',
      successHint: 'Bio-meteorology connects animal behavior, atmospheric physics, and traditional knowledge. The principle that combining multiple noisy signals improves predictions is the foundation of modern ensemble methods in machine learning, weather forecasting, and even stock market analysis.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Animal Communication & Signaling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for communication and signaling simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}