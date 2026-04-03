import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CoconutJackfruitLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Phylogenetics — building the tree of life from DNA',
      concept: `**Phylogenetics** reconstructs evolutionary relationships by comparing DNA sequences. The more similar two organisms' DNA, the more recently they shared a common ancestor.

Methods for building phylogenetic trees:
- **Distance-based** (UPGMA, Neighbor-Joining): calculate pairwise genetic distances, then cluster
- **Maximum Parsimony**: find the tree that requires the fewest evolutionary changes
- **Maximum Likelihood**: find the tree most likely to produce the observed sequences given a model of evolution
- **Bayesian**: combine likelihood with prior information using probability theory

For coconut and jackfruit: molecular clock analysis suggests they diverged ~100 million years ago during the Cretaceous period — when dinosaurs still roamed. Their common ancestor was a simple flowering plant.

Phylogenetic trees are used in medicine (tracking virus evolution, like COVID variants), agriculture (finding wild relatives for crop improvement), and forensics (matching DNA evidence).`,
      analogy: 'Building a phylogenetic tree is like reconstructing a family tree from photographs when you have no records. You compare faces (DNA sequences), group people who look alike (cluster similar sequences), and infer who is related to whom. The more features two people share, the more closely related they probably are.',
      storyConnection: 'The coconut and jackfruit are on different branches of the tree of life — separated by 100 million years of independent evolution. The coconut\'s "dream" of becoming a jackfruit would require reversing all those divergent mutations — a journey back through deep evolutionary time.',
      checkQuestion: 'If we sequence a gene from a coconut, jackfruit, and banana, and find that coconut-banana are 80% similar while coconut-jackfruit are 60% similar, what does this tell us about their evolutionary relationships?',
      checkAnswer: 'Coconut and banana are more closely related (both monocots, in fact). They shared a common ancestor more recently than coconut and jackfruit. The phylogenetic tree would show coconut and banana on neighboring branches, with jackfruit on a more distant branch. This matches botanical classification: coconuts and bananas are both monocots; jackfruit is a dicot.',
      codeIntro: 'Build a simple phylogenetic tree from DNA distance data using UPGMA.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified UPGMA tree building
# Distance matrix (% difference in a conserved gene)
species = ['Coconut', 'Date palm', 'Banana', 'Jackfruit', 'Fig', 'Rice']
n = len(species)

# Pairwise genetic distances (% difference)
distances = np.array([
    [0, 15, 25, 45, 47, 30],   # Coconut
    [15, 0, 28, 48, 50, 32],   # Date palm
    [25, 28, 0, 42, 44, 20],   # Banana
    [45, 48, 42, 0, 12, 50],   # Jackfruit
    [47, 50, 44, 12, 0, 52],   # Fig
    [30, 32, 20, 50, 52, 0],   # Rice
])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Distance matrix heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(distances, cmap='YlOrRd_r', vmin=0, vmax=55)
ax1.set_xticks(range(n))
ax1.set_yticks(range(n))
ax1.set_xticklabels(species, color='white', fontsize=8, rotation=45, ha='right')
ax1.set_yticklabels(species, color='white', fontsize=8)
ax1.set_title('Genetic Distance Matrix (%)', color='white', fontsize=12)
for i in range(n):
    for j in range(n):
        ax1.text(j, i, f'{distances[i,j]:.0f}', ha='center', va='center',
                color='white' if distances[i,j] > 30 else 'black', fontsize=9)
plt.colorbar(im, ax=ax1, shrink=0.8)

# Manually constructed tree (matching the distances)
ax2.set_facecolor('#111827')

# Tree layout
leaves = {
    'Coconut': (0, 1), 'Date palm': (0, 2),
    'Banana': (0, 4), 'Rice': (0, 5),
    'Jackfruit': (0, 7), 'Fig': (0, 8),
}
nodes = {
    'Palm ancestor': (7.5, 1.5),
    'Monocot A': (15, 3),
    'Moraceae': (6, 7.5),
    'Dicot-Mono split': (25, 5),
    'Root': (30, 4.5),
}

leaf_colors = {'Coconut': '#22c55e', 'Date palm': '#22c55e', 'Banana': '#f59e0b',
               'Rice': '#f59e0b', 'Jackfruit': '#3b82f6', 'Fig': '#3b82f6'}

# Draw branches
connections = [
    ('Coconut', 'Palm ancestor'), ('Date palm', 'Palm ancestor'),
    ('Palm ancestor', 'Monocot A'),
    ('Banana', 'Monocot A'), ('Rice', 'Monocot A'),
    ('Jackfruit', 'Moraceae'), ('Fig', 'Moraceae'),
    ('Monocot A', 'Root'), ('Moraceae', 'Root'),
]

all_positions = {**leaves, **nodes}
for n1, n2 in connections:
    x1, y1 = all_positions[n1]
    x2, y2 = all_positions[n2]
    ax2.plot([x1, x2], [y1, y2], color='gray', linewidth=1.5, alpha=0.6)

for name, (x, y) in leaves.items():
    ax2.plot(x, y, 'o', color=leaf_colors[name], markersize=8)
    ax2.text(x - 0.5, y, name, ha='right', va='center', color=leaf_colors[name], fontsize=9)

for name, (x, y) in nodes.items():
    ax2.plot(x, y, 's', color='gray', markersize=5)
    ax2.text(x + 0.5, y + 0.3, name, color='gray', fontsize=7)

ax2.set_xlabel('Evolutionary distance →', color='white')
ax2.set_title('Phylogenetic Tree (UPGMA)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Closest pairs (by genetic distance):")
for i in range(n):
    for j in range(i+1, n):
        if distances[i,j] < 20:
            print(f"  {species[i]} - {species[j]}: {distances[i,j]:.0f}% different")
print()
print("Most distant pairs:")
for i in range(n):
    for j in range(i+1, n):
        if distances[i,j] > 45:
            print(f"  {species[i]} - {species[j]}: {distances[i,j]:.0f}% different")`,
      challenge: 'Add a seventh species (mango) that is 40% different from jackfruit and 55% different from coconut. Where does it attach to the tree? Is it closer to the fig family or the palm family?',
      successHint: 'Phylogenetics is one of the most powerful tools in modern biology — it reveals the invisible threads of ancestry connecting all life on Earth. The same methods track virus evolution (COVID variants), identify unknown species from eDNA, and guide crop improvement programs.',
    },
    {
      title: 'Epigenetics — same DNA, different expression',
      concept: `Here is a puzzle: every cell in a coconut palm has the same DNA, yet root cells are nothing like leaf cells. How? The answer is **epigenetics** — chemical modifications that control which genes are active in which cells without changing the DNA sequence.

Key epigenetic mechanisms:
- **DNA methylation**: methyl groups (CH₃) attached to DNA silence nearby genes. Like putting a sticky note on a page that says "skip this chapter."
- **Histone modification**: DNA wraps around histone proteins. Chemical tags on histones either tighten (silence) or loosen (activate) the wrapping.
- **Non-coding RNA**: small RNA molecules can target and silence specific genes.

Epigenetics explains:
- How identical twins can develop different diseases (different environmental exposures → different methylation)
- How a caterpillar and butterfly are the same organism with the same DNA but completely different bodies
- How plants adapt to drought by activating stress-response genes (without DNA mutation)

The coconut cannot change its DNA to become a jackfruit. But through epigenetics, a coconut palm growing in drought activates a different set of genes than one growing in abundant water — same DNA, different "reading" of it.`,
      analogy: 'If DNA is a library of books, epigenetics is the librarian who decides which books are on display (expressed) and which are locked in storage (silenced). The library\'s collection (DNA) never changes, but what readers can access (active genes) changes based on the librarian\'s decisions (epigenetic marks). Same library, different reading experience.',
      storyConnection: 'The coconut wanted to be a jackfruit — a different identity. But epigenetics shows that identity is not just about what genes you have; it is about which ones you use. The coconut already has ~30,000 genes. It uses different subsets in roots, leaves, flowers, and fruits. Identity is as much about expression as content.',
      checkQuestion: 'A coconut palm in Assam (monsoon climate) and one in Rajasthan (desert) have the same DNA but look different — the Rajasthan palm is shorter with thicker leaves. Is this evolution or epigenetics?',
      checkAnswer: 'Epigenetics (and some phenotypic plasticity). The desert palm activates drought-response genes and suppresses growth genes — same DNA, different reading. If you took seeds from the Rajasthan palm and grew them in Assam, the offspring would grow like Assam palms (the epigenetic changes are partly reversible). Evolution would require genetic changes accumulated over many generations.',
      codeIntro: 'Simulate how epigenetic marks change gene expression across different tissue types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Gene expression in different coconut palm tissues
# Same genome, different expression patterns

genes = ['Photosynthesis', 'Root growth', 'Flowering', 'Fruit dev.',
         'Stress response', 'Cell division', 'Water transport', 'Sugar storage',
         'Lignin (wood)', 'Chlorophyll']
n_genes = len(genes)

# Expression levels (0-10) in different tissues
tissues = {
    'Leaf': [9, 0.5, 0.5, 0.5, 3, 4, 5, 2, 1, 9],
    'Root': [0.5, 9, 0.5, 0.5, 4, 6, 8, 1, 3, 0.5],
    'Flower': [2, 0.5, 9, 7, 2, 5, 3, 3, 1, 2],
    'Fruit': [1, 0.5, 2, 9, 2, 3, 4, 8, 5, 1],
    'Trunk': [0.5, 1, 0.5, 0.5, 3, 2, 7, 2, 9, 0.5],
}

# Methylation levels (inversely correlated with expression)
methylation = {tissue: [10 - e + np.random.normal(0, 0.5) for e in exp]
               for tissue, exp in tissues.items()}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Expression heatmap
ax1.set_facecolor('#111827')
exp_matrix = np.array(list(tissues.values()))
im = ax1.imshow(exp_matrix, cmap='YlGn', vmin=0, vmax=10, aspect='auto')
ax1.set_xticks(range(n_genes))
ax1.set_yticks(range(len(tissues)))
ax1.set_xticklabels(genes, color='white', fontsize=7, rotation=45, ha='right')
ax1.set_yticklabels(list(tissues.keys()), color='white', fontsize=9)
ax1.set_title('Gene Expression by Tissue\\n(same DNA, different reading)', color='white', fontsize=11)
plt.colorbar(im, ax=ax1, shrink=0.8, label='Expression level')

for i in range(len(tissues)):
    for j in range(n_genes):
        ax1.text(j, i, f'{exp_matrix[i,j]:.0f}', ha='center', va='center',
                color='white' if exp_matrix[i,j] > 5 else 'gray', fontsize=8)

# Methylation vs expression for one gene
ax2.set_facecolor('#111827')
gene_idx = 0  # Photosynthesis gene
for tissue, exp in tissues.items():
    meth = methylation[tissue][gene_idx]
    color = {'Leaf': '#22c55e', 'Root': '#854d0e', 'Flower': '#f59e0b',
             'Fruit': '#ef4444', 'Trunk': '#6b7280'}[tissue]
    ax2.scatter(meth, exp[gene_idx], c=color, s=100, zorder=5)
    ax2.annotate(tissue, xy=(meth, exp[gene_idx]), xytext=(5, 5),
                textcoords='offset points', color=color, fontsize=10)

# Trend line
all_meth = [methylation[t][gene_idx] for t in tissues]
all_exp = [tissues[t][gene_idx] for t in tissues]
z = np.polyfit(all_meth, all_exp, 1)
x_line = np.linspace(0, 10, 50)
ax2.plot(x_line, z[0] * x_line + z[1], '--', color='gray', alpha=0.5)

ax2.set_xlabel('DNA methylation level', color='white')
ax2.set_ylabel('Gene expression level', color='white')
ax2.set_title('Photosynthesis Gene: Methylation Silences Expression', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Same genome, different expression:")
for gene_i, gene in enumerate(genes):
    values = [tissues[t][gene_i] for t in tissues]
    highest_tissue = list(tissues.keys())[np.argmax(values)]
    print(f"  {gene}: highest in {highest_tissue} ({max(values):.0f}/10)")`,
      challenge: 'Stress (drought, heat) can change epigenetic marks. Add a "Drought stress" condition where stress-response genes increase from 3→8, photosynthesis drops from 9→5, and growth genes drop. Plot the before/after.',
      successHint: 'Epigenetics is one of the most exciting frontiers of biology. It explains how environment shapes organisms without changing their DNA, how diseases develop differently in identical twins, and why a coconut leaf is nothing like a coconut root — despite having the same genome.',
    },
    {
      title: 'Convergent evolution — different species, similar solutions',
      concept: `The coconut wanted to be a jackfruit, but there is a biological phenomenon where unrelated species evolve similar traits independently: **convergent evolution**.

Examples:
- **Wings**: birds, bats, and insects all evolved flight independently. Different mechanisms (feathers, membranes, chitin), same function.
- **Eyes**: evolved independently 40+ times. Octopus eyes and human eyes are strikingly similar but evolved from different ancestors.
- **Cacti and euphorbias**: look identical (desert plants with spiny, succulent stems) but are from different families on different continents.

For coconut and jackfruit:
- Both evolved large fruits with fleshy edible parts — convergent
- But through different mechanisms: coconut\'s flesh is endosperm (seed tissue); jackfruit\'s flesh is perianth (modified flower parts)
- Both evolved to attract animal dispersers — convergent selection pressure, different anatomical solutions

Convergent evolution is powerful evidence that natural selection is not random — it independently arrives at similar solutions to similar problems. If you need to disperse seeds using animals, sweet flesh will evolve, regardless of your starting anatomy.`,
      analogy: 'Convergent evolution is like two students solving the same math problem independently and getting the same answer by different methods. The problem (environmental challenge) is the same; the methods (evolutionary pathways) are different; the answer (adaptation) converges. Nature does not copy — it independently discovers the same solutions.',
      storyConnection: 'The coconut cannot become a jackfruit, but evolution found ways to make them similar where it matters: both are large, nutritious, and attract dispersers. The coconut does not need to BE a jackfruit — it already solved the same problems in its own way. Convergent evolution is the proof.',
      checkQuestion: 'Dolphins (mammals) and sharks (fish) have very similar body shapes despite being separated by 400 million years of evolution. Why?',
      checkAnswer: 'Both face the same physical constraint: moving efficiently through water. The streamlined, torpedo-shaped body minimizes drag at cruising speeds. This is dictated by physics (hydrodynamics), not by genes. Any animal that needs to swim fast in the ocean will converge on a similar shape — whether it breathes air or water, has bones or cartilage, is warm-blooded or cold-blooded.',
      codeIntro: 'Quantify convergent evolution by comparing trait similarity between related and unrelated species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Trait comparison: convergent vs divergent evolution
# Compare physical traits between pairs of species

traits = ['Body shape', 'Size', 'Fruit/food\\ntype', 'Dispersal\\nmethod', 'Leaf\\nshape', 'Habitat']

# Trait similarity scores (0-10, 10=identical)
# Related species (should be similar due to shared ancestry)
related_pairs = {
    'Coconut vs\\nDate palm': [5, 7, 6, 7, 9, 8],     # Both palms
    'Jackfruit vs\\nFig': [3, 2, 4, 8, 5, 7],          # Same family
    'Tiger vs\\nLion': [8, 9, 9, 8, 9, 6],              # Same genus
}

# Convergent species (similar traits, unrelated)
convergent_pairs = {
    'Coconut vs\\nJackfruit': [2, 3, 7, 6, 1, 5],      # Both large tropical fruits
    'Cactus vs\\nEuphorbia': [9, 7, 3, 3, 9, 9],        # Desert adaptation
    'Dolphin vs\\nShark': [9, 6, 5, 3, 0, 9],            # Aquatic body plan
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Related species comparison
ax1.set_facecolor('#111827')
x = np.arange(len(traits))
width = 0.25
colors_r = ['#22c55e', '#3b82f6', '#f59e0b']
for i, (pair, scores) in enumerate(related_pairs.items()):
    ax1.bar(x + i*width, scores, width, label=pair, color=colors_r[i], alpha=0.8)

ax1.set_xticks(x + width)
ax1.set_xticklabels(traits, color='white', fontsize=8)
ax1.set_ylabel('Trait similarity (0-10)', color='white')
ax1.set_title('Related Species: Similar by Ancestry', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 11)

# Convergent species comparison
ax2.set_facecolor('#111827')
colors_c = ['#ef4444', '#a855f7', '#f59e0b']
for i, (pair, scores) in enumerate(convergent_pairs.items()):
    ax2.bar(x + i*width, scores, width, label=pair, color=colors_c[i], alpha=0.8)

ax2.set_xticks(x + width)
ax2.set_xticklabels(traits, color='white', fontsize=8)
ax2.set_ylabel('Trait similarity (0-10)', color='white')
ax2.set_title('Convergent Species: Similar by Selection Pressure', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 11)

plt.tight_layout()
plt.show()

print("Key insight: convergent species are similar in FUNCTIONAL traits")
print("(body shape, habitat) but different in STRUCTURAL traits (leaf, dispersal)")
print()
print("Related species are similar in both — because they inherited")
print("the same structures AND face similar selection pressures.")
print()
print("Convergent evolution proves that natural selection is")
print("the driving force — not chance, not design, but adaptation.")`,
      challenge: 'Find another example of convergent evolution in plants. Compare a cactus (Americas) with a euphorbia (Africa). List traits that converged and traits that differ. Why did both evolve spines?',
      successHint: 'Convergent evolution is one of the strongest pieces of evidence for natural selection. When unrelated species independently evolve the same trait, it means the trait is a solution to a real physical or ecological problem — not an accident.',
    },
    {
      title: 'Horizontal gene transfer — when species share genes across the tree of life',
      concept: `Usually, genes pass vertically — parent to offspring. But in some cases, genes move **horizontally** between unrelated species. This is called **horizontal gene transfer (HGT)**.

HGT mechanisms:
- **Bacteria to bacteria**: common via plasmids, transformation, transduction. This is how antibiotic resistance spreads.
- **Bacteria to plant**: Agrobacterium naturally transfers genes into plant cells. This is exploited for genetic engineering.
- **Virus to host**: viral DNA integrates into host genomes. ~8% of the human genome is viral DNA!
- **Parasite to host**: parasitic plants can transfer genes to their hosts (and vice versa).

For the coconut-jackfruit story: sweet potato naturally contains Agrobacterium genes that integrated into its genome thousands of years ago. It is a "natural GMO." The boundary between species is not as absolute as we thought.

HGT challenges the traditional "tree of life" model. For bacteria, the tree is more like a **web** — genes flow freely between species. For plants and animals, HGT is rarer but does occur, especially mediated by viruses and parasites.`,
      analogy: 'HGT is like open-source software. Instead of building every feature from scratch (vertical inheritance), organisms can "download" useful code (genes) from other organisms. Bacteria are the ultimate open-source community — they freely share genetic code across species boundaries. Plants and animals are more proprietary, but even they occasionally "borrow" code.',
      storyConnection: 'The coconut\'s dream of gaining jackfruit traits is not as impossible as it seems — in nature, genes do cross species boundaries through HGT. Sweet potato is a plant that naturally acquired bacterial genes. If it happened once, it can happen again. The walls between species are real but not impenetrable.',
      checkQuestion: '8% of the human genome comes from ancient viral infections. Are we part virus?',
      checkAnswer: 'In a sense, yes. Ancient retroviruses infected our ancestors and integrated their DNA into the genome. Most of these viral genes are now non-functional (junk DNA), but some have been "domesticated" — repurposed for host functions. The syncytin gene, essential for placenta formation in mammals, came from a retrovirus. Without this viral gene, human pregnancy as we know it would not exist.',
      codeIntro: 'Visualize horizontal gene transfer as a network rather than a simple tree.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Tree of life with horizontal gene transfer events
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Traditional tree (vertical only)
ax1.set_facecolor('#111827')
tree_positions = {
    'Common ancestor': (5, 0),
    'Plants': (2, 3), 'Animals': (5, 3), 'Fungi': (8, 3),
    'Coconut': (1, 6), 'Jackfruit': (3, 6),
    'Human': (4.5, 6), 'Fish': (5.5, 6),
    'Mushroom': (7.5, 6), 'Yeast': (8.5, 6),
}
vertical_edges = [
    ('Common ancestor', 'Plants'), ('Common ancestor', 'Animals'), ('Common ancestor', 'Fungi'),
    ('Plants', 'Coconut'), ('Plants', 'Jackfruit'),
    ('Animals', 'Human'), ('Animals', 'Fish'),
    ('Fungi', 'Mushroom'), ('Fungi', 'Yeast'),
]

for n1, n2 in vertical_edges:
    x1, y1 = tree_positions[n1]
    x2, y2 = tree_positions[n2]
    ax1.plot([x1, x2], [y1, y2], color='gray', linewidth=1.5)

for name, (x, y) in tree_positions.items():
    color = '#22c55e' if 'Coconut' in name or 'Jackfruit' in name or name == 'Plants' else \
            '#3b82f6' if name in ['Human', 'Fish', 'Animals'] else \
            '#f59e0b' if name in ['Mushroom', 'Yeast', 'Fungi'] else 'gray'
    ax1.plot(x, y, 'o', color=color, markersize=8)
    ax1.text(x, y + 0.4, name, ha='center', color=color, fontsize=8)

ax1.set_title('Traditional Tree of Life\\n(vertical inheritance only)', color='white', fontsize=11)
ax1.set_xlim(-0.5, 10)
ax1.set_ylim(-1, 7.5)
ax1.axis('off')

# Web of life (with HGT events)
ax2.set_facecolor('#111827')

# Same tree
for n1, n2 in vertical_edges:
    x1, y1 = tree_positions[n1]
    x2, y2 = tree_positions[n2]
    ax2.plot([x1, x2], [y1, y2], color='gray', linewidth=1.5)

for name, (x, y) in tree_positions.items():
    color = '#22c55e' if 'Coconut' in name or 'Jackfruit' in name or name == 'Plants' else \
            '#3b82f6' if name in ['Human', 'Fish', 'Animals'] else \
            '#f59e0b' if name in ['Mushroom', 'Yeast', 'Fungi'] else 'gray'
    ax2.plot(x, y, 'o', color=color, markersize=8)
    ax2.text(x, y + 0.4, name, ha='center', color=color, fontsize=8)

# HGT events (horizontal connections)
hgt_events = [
    ('Yeast', 'Coconut', 'Fungal genes\\nin plants'),
    ('Fish', 'Coconut', 'Viral-mediated\\ntransfer'),
    ('Mushroom', 'Human', 'Mitochondrial\\ngene transfer'),
]

for src, tgt, label in hgt_events:
    x1, y1 = tree_positions[src]
    x2, y2 = tree_positions[tgt]
    ax2.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color='#ef4444',
                               connectionstyle='arc3,rad=0.3', linewidth=1.5, linestyle='--'))
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax2.text(mx, my + 0.5, label, ha='center', color='#ef4444', fontsize=7)

ax2.set_title('Web of Life\\n(with horizontal gene transfer)', color='white', fontsize=11)
ax2.set_xlim(-0.5, 10)
ax2.set_ylim(-1, 7.5)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Horizontal gene transfer events in nature:")
print("  Agrobacterium → Sweet potato (natural GMO)")
print("  Retroviruses → Mammals (8% of human genome)")
print("  Parasitic plants → Host plants (gene exchange)")
print("  Bacteria → Bacteria (antibiotic resistance spread)")
print()
print("The tree of life is really a WEB of life.")
print("Genes do not always flow vertically from parent to child.")`,
      challenge: 'If horizontal gene transfer were as common in plants as in bacteria, what would happen to the species concept? Could a coconut eventually acquire jackfruit genes naturally?',
      successHint: 'HGT challenges our neat categories of species and ancestry. Life is messier than any tree diagram suggests. The coconut and jackfruit are separate species, but the boundary between species is more permeable than we once believed.',
    },
    {
      title: 'Genome-wide association studies — finding the genes behind traits',
      concept: `How do you find which genes control fruit size, sweetness, or disease resistance? **Genome-wide association studies (GWAS)** scan the entire genome for statistical associations between genetic variants and traits.

GWAS workflow:
1. Collect many individuals (hundreds to thousands)
2. Genotype each at millions of DNA positions (SNPs — single nucleotide polymorphisms)
3. Measure the trait of interest (e.g., fruit weight)
4. For each SNP, test: do individuals with variant A have larger fruit than those with variant B?
5. Identify SNPs with statistically significant associations

The **Manhattan plot** is the signature GWAS visualization — each dot is a SNP, x-axis is chromosome position, y-axis is statistical significance. Significant SNPs spike above a threshold line like skyscrapers in Manhattan.

GWAS has identified genes controlling:
- Coconut: oil content, dwarf phenotype, disease resistance
- Jackfruit: fruit weight, flesh sweetness, seed count
- Rice: grain size, drought tolerance, disease resistance
- Human: height (controlled by >10,000 SNPs!), disease susceptibility

Most complex traits are **polygenic** — controlled by many genes with small effects. This is why selective breeding works gradually, not in sudden jumps.`,
      analogy: 'GWAS is like finding which ingredients make a cake sweet by testing thousands of recipes. You measure sweetness in 1,000 cakes, check which ingredients vary between sweet and less-sweet cakes, and identify the key ingredients (genes). The twist: most cakes are sweet because of many ingredients working together (polygenic), not just one.',
      storyConnection: 'What genes make a coconut a coconut and a jackfruit a jackfruit? GWAS can answer this. By comparing the genomes of hundreds of coconut varieties, we can find the specific DNA positions that control size, shape, oil content, and taste. The coconut\'s identity is not one gene — it is a symphony of thousands.',
      checkQuestion: 'Human height is controlled by over 10,000 genetic variants, each with a tiny effect. Why does this make height so hard to predict from DNA alone?',
      checkAnswer: 'With 10,000+ contributing variants, each explaining only 0.01-0.1% of height variation, the prediction error accumulates. Even knowing all variants, the environmental component (nutrition, disease, stress) adds ~20% of variation that genetics cannot predict. Current DNA-based height predictions are accurate to about ±5 cm — useful for forensics but not for precise prediction. This is true for most complex traits.',
      codeIntro: 'Simulate a GWAS and create a Manhattan plot for fruit weight in coconut varieties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate GWAS for coconut fruit weight
n_individuals = 500
n_snps = 5000
n_chromosomes = 16  # coconut has 16 chromosome pairs

# Assign SNPs to chromosomes
snp_chromosomes = np.random.randint(1, n_chromosomes + 1, n_snps)
snp_positions = np.random.uniform(0, 100, n_snps)  # position on chromosome

# Genotypes (0, 1, or 2 copies of minor allele)
genotypes = np.random.binomial(2, 0.3, (n_individuals, n_snps))

# True causal SNPs (10 SNPs actually affect fruit weight)
causal_snps = np.random.choice(n_snps, 10, replace=False)
effect_sizes = np.random.normal(0, 2, 10)

# Fruit weight = sum of causal effects + noise
fruit_weight = 1200  # base weight in grams
for i, snp in enumerate(causal_snps):
    fruit_weight = fruit_weight + genotypes[:, snp] * effect_sizes[i] * 30
fruit_weight += np.random.normal(0, 100, n_individuals)  # environmental noise

# GWAS: test each SNP
p_values = np.zeros(n_snps)
for snp in range(n_snps):
    geno = genotypes[:, snp]
    # Simple correlation test
    if np.std(geno) > 0:
        corr = np.corrcoef(geno, fruit_weight)[0, 1]
        # Convert to approximate p-value
        t_stat = corr * np.sqrt(n_individuals - 2) / np.sqrt(1 - corr**2)
        # Use normal approximation
        p_values[snp] = 2 * (1 - min(0.9999, abs(t_stat) / 10))
    else:
        p_values[snp] = 1.0

neg_log_p = -np.log10(p_values + 1e-15)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Manhattan plot
ax1.set_facecolor('#111827')
chrom_colors = ['#22c55e', '#3b82f6'] * 8

cumulative_pos = np.zeros(n_snps)
chrom_ticks = []
offset = 0
for chrom in range(1, n_chromosomes + 1):
    mask = snp_chromosomes == chrom
    positions = snp_positions[mask] + offset
    cumulative_pos[mask] = positions
    color = chrom_colors[chrom - 1]
    ax1.scatter(positions, neg_log_p[mask], c=color, s=5, alpha=0.5)
    chrom_ticks.append(offset + 50)
    offset += 110

# Mark significant SNPs
sig_threshold = -np.log10(0.05 / n_snps)  # Bonferroni correction
ax1.axhline(sig_threshold, color='#ef4444', linestyle='--', linewidth=1, label='Significance threshold')

# Mark causal SNPs
for snp in causal_snps:
    ax1.scatter(cumulative_pos[snp], neg_log_p[snp], c='#f59e0b', s=50,
               marker='*', zorder=5, edgecolors='white', linewidth=0.5)

ax1.set_xticks(chrom_ticks)
ax1.set_xticklabels([str(i) for i in range(1, n_chromosomes + 1)], color='white', fontsize=8)
ax1.set_xlabel('Chromosome', color='white')
ax1.set_ylabel('-log₁₀(p-value)', color='white')
ax1.set_title('Manhattan Plot: GWAS for Coconut Fruit Weight', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Effect size distribution
ax2.set_facecolor('#111827')
all_effects = np.zeros(n_snps)
for i, snp in enumerate(causal_snps):
    all_effects[snp] = effect_sizes[i]

ax2.bar(range(10), sorted(effect_sizes, reverse=True), color='#f59e0b', alpha=0.8)
ax2.set_xlabel('Causal variant (ranked)', color='white')
ax2.set_ylabel('Effect size (grams per allele)', color='white')
ax2.set_title('Effect Sizes of True Causal Variants', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.axhline(0, color='gray', linestyle='-', alpha=0.3)

plt.tight_layout()
plt.show()

detected = np.sum(neg_log_p[causal_snps] > sig_threshold)
print(f"True causal SNPs: {len(causal_snps)}")
print(f"Detected by GWAS: {detected}")
print(f"False positives: {np.sum(neg_log_p > sig_threshold) - detected}")
print()
print("GWAS power depends on:")
print("  - Sample size (more individuals = more power)")
print("  - Effect size (larger effects = easier to detect)")
print("  - Allele frequency (common variants easier to detect)")`,
      challenge: 'Increase the sample size from 500 to 2000 individuals. How many more causal SNPs are detected? This demonstrates why large biobanks are essential for GWAS.',
      successHint: 'GWAS is the workhorse of modern genetics — from identifying disease risk genes in humans to finding drought tolerance genes in crops. The coconut\'s genome holds secrets about oil quality, disease resistance, and yield that GWAS can unlock.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 genetics foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced genetics analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
