import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'human-body-systems',
  title: 'Human Body Systems',
  category: 'biology',
  icon: '🫀',
  tagline:
    'How your heart pumps, lungs breathe, and brain thinks — the engineering inside you.',
  relatedStories: ['tigers-whisker', 'honey-hunters-lesson', 'red-panda-mask'],
  understand: [
    // ── Section 1: The Circulatory System ─────────────────────
    {
      title: 'The Circulatory System',
      diagram: 'HeartDiagram',
      beginnerContent:
        'Right now, while you\'re reading this, your heart is pumping. It will do this **3 billion times** over your life without a single break — no maintenance, no battery change, no pause for sleep. Press two fingers against the side of your neck. Feel that? Every thump is the most reliable machine in your body firing again.\n\n' +
        'Watch the diagram above. See that red blob pumping in rhythm, and the particles flowing in and out? That\'s your heart — roughly the size of your fist, but not one pump. **Two pumps, fused together.** The right side (your left as you look at it) sends "used" blood to the lungs to pick up oxygen. The left side (stronger, thicker-walled) pumps that refreshed blood to everything else — toes, fingertips, brain, kidneys.\n\n' +
        '| Chamber | What it does | Think of it as... |\n' +
        '|---------|--------------|-------------------|\n' +
        '| **Right atrium** | Catches used blood coming back from the body | Inbox |\n' +
        '| **Right ventricle** | Pumps it to the lungs for cleaning | Short-haul truck |\n' +
        '| **Left atrium** | Catches clean blood returning from the lungs | Returns tray |\n' +
        '| **Left ventricle** | Pumps it out to the entire body | Long-haul truck (3× thicker walls) |\n\n' +
        '**Here\'s a number that should astonish you:** if you laid every blood vessel in your body end to end, they\'d stretch **100,000 kilometres** — enough to wrap around the Earth 2.5 times. Most of that length is in **capillaries** so narrow that red blood cells have to squeeze through single file. That\'s where the real work happens: oxygen and nutrients slip out to your tissues, waste seeps in.\n\n' +
        'Every heartbeat sends a pressure wave down your arteries — that\'s your pulse. And the "lub-dub" you hear through a stethoscope? That\'s the sound of valves snapping shut. **Lub** when the valves between atria and ventricles close; **dub** when the exit valves snap. They\'re one-way doors making sure blood never flows backwards.\n\n' +
        'Your entire blood supply (about 5 litres) completes a full circuit through your body **once every minute** at rest. During a sprint, that rate jumps six-fold.',
      intermediateContent:
        '**Cardiac output — how much blood your heart pumps:**\n\n' +
        '| Parameter | Symbol | At rest | During exercise |\n' +
        '|-----------|--------|---------|------------------|\n' +
        '| Heart rate | HR | 72 bpm | 180 bpm |\n' +
        '| Stroke volume | SV | 70 mL | 170 mL |\n' +
        '| **Cardiac output** | CO = HR × SV | **5.04 L/min** | **30.6 L/min** |\n\n' +
        '**Worked example:** At rest, your heart pumps ~5 litres per minute. Your body contains about 5 litres of blood, so **your entire blood supply completes a full circuit once per minute**. During a sprint, cardiac output rises 6×.\n\n' +
        '**Blood pressure** = Cardiac Output × Total Peripheral Resistance (TPR)\n\n' +
        '| Measurement | Value | What it means |\n' +
        '|-------------|-------|---------------|\n' +
        '| Systolic | 120 mmHg | Pressure during a heartbeat (squeeze) |\n' +
        '| Diastolic | 80 mmHg | Pressure between heartbeats (rest) |\n' +
        '| Written as | 120/80 | Normal, healthy blood pressure |\n\n' +
        '**The heart\'s electrical system:**\n\n' +
        '| Structure | Role | Timing |\n' +
        '|-----------|------|--------|\n' +
        '| SA node (pacemaker) | Generates the impulse | Sets rhythm at ~72/min |\n' +
        '| AV node | Delays signal briefly | ~0.1 s — lets atria finish emptying |\n' +
        '| Bundle of His | Carries signal down the septum | Directs to ventricles |\n' +
        '| Purkinje fibres | Spread signal across ventricles | Triggers ventricular contraction |\n\n' +
        'An **ECG** records this sequence: the **P wave** = atrial depolarisation, **QRS complex** = ventricular depolarisation, **T wave** = ventricular repolarisation.\n\n' +
        '**Why is the left ventricle ~3× thicker than the right?** The left side must generate ~120 mmHg to push blood through the entire body. The right side only needs ~25 mmHg for the short trip to the lungs.',
      advancedContent:
        '**The Frank-Starling law** — the heart\'s built-in self-regulation:\n\n' +
        'When more blood fills the ventricle (increased preload), the cardiac muscle fibres stretch further, optimising actin-myosin overlap and generating a stronger contraction. This means the heart automatically matches its output to venous return — no neural input needed.\n\n' +
        '| Factor | Effect on stroke volume | Mechanism |\n' +
        '|--------|------------------------|------------|\n' +
        '| ↑ Preload (venous return) | ↑ SV | Frank-Starling — stretch → stronger contraction |\n' +
        '| ↑ Afterload (arterial resistance) | ↓ SV | Heart must push against higher pressure |\n' +
        '| ↑ Contractility (sympathetic) | ↑ SV | Noradrenaline → more Ca²⁺ release → stronger contraction |\n\n' +
        '**At the cellular level**, cardiac muscle has unique features:\n\n' +
        '| Feature | Description | Why it matters |\n' +
        '|---------|-------------|----------------|\n' +
        '| Intercalated discs | Gap junctions between cells | Rapid electrical coupling — heart acts as a syncytium |\n' +
        '| T-tubules at Z-lines | (vs A-I junctions in skeletal muscle) | Ensures synchronous Ca²⁺ release |\n' +
        '| Long refractory period | ~250 ms (vs ~2 ms in skeletal muscle) | Prevents tetanus — the heart MUST relax between beats |\n' +
        '| CICR | Ca²⁺-induced Ca²⁺ release from SR | L-type Ca²⁺ current triggers massive SR release |\n\n' +
        '**Heart failure** involves impaired SERCA2a (SR calcium pump) and elevated phospholamban inhibition, reducing diastolic calcium reuptake → incomplete relaxation → reduced filling → reduced output.\n\n' +
        '**Modern intervention:** Left Ventricular Assist Devices (LVADs) — continuous-flow pumps implanted in end-stage heart failure — achieve >80% two-year survival. Patients with LVADs often have no palpable pulse because the pump delivers continuous (not pulsatile) flow.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each heart structure to its role',
          pairs: [
            ['SA node', 'Natural pacemaker — generates electrical impulse at ~72 beats/min'],
            ['Left ventricle', 'Most muscular chamber — pumps oxygenated blood to the entire body'],
            ['Pulmonary artery', 'Carries deoxygenated blood from the right ventricle to the lungs'],
            ['Capillaries', 'Thinnest vessels — where gas and nutrient exchange actually happens'],
            ['Valves', 'One-way doors — prevent blood from flowing backwards'],
          ],
        },
      },
    },

    // ── Section 2: The Respiratory System ─────────────────────
    {
      title: 'The Respiratory System',
      diagram: 'LungsDiagram',
      beginnerContent:
        'Breathe in. You just moved half a litre of air through your nose, down your throat, past your vocal cords, through your windpipe, into branching tubes that keep splitting until they\'re thinner than hair. At the end of each tube sits a tiny air sac. **You have 300 million of these sacs.** Unfold and flatten them and they\'d cover a tennis court — all stuffed inside your chest.\n\n' +
        'Watch the diagram. See the diaphragm flattening downward when you inhale, pulling the lungs larger like a bellows? That\'s the trick. Lungs don\'t suck air in themselves — they\'re just elastic bags. The diaphragm (the dome-shaped muscle beneath them) contracts downward, creating low pressure inside the chest, and air rushes in to fill the vacuum. No different from sucking liquid up a straw.\n\n' +
        '| Structure | What happens | Clever detail |\n' +
        '|-----------|--------------|---------------|\n' +
        '| **Nose** | Warms, moistens, filters air | Hairs and mucus catch dust and pathogens |\n' +
        '| **Trachea** | Rigid tube to the lungs | C-shaped cartilage rings — won\'t collapse even when you bend |\n' +
        '| **Bronchi → Bronchioles** | Tree of branching tubes | Splits 23 times before reaching the alveoli |\n' +
        '| **Alveoli** (~300 million) | Tiny air sacs, wall 1 cell thick | Wrapped in capillaries — O₂ diffuses across instantly |\n\n' +
        'When oxygen reaches an alveolus, it dissolves into the wet lining, crosses a barrier **one cell thick**, enters your blood, and snaps onto **haemoglobin** — a protein in red blood cells that grabs four O₂ molecules at a time. Meanwhile CO₂ goes the other way, out of the blood and into the alveolus, ready to be exhaled.\n\n' +
        'Nobody pushes these gases across. They diffuse — **high concentration to low concentration**, automatic and effortless, like the smell of food drifting from the kitchen to the living room.\n\n' +
        'At rest, you take 12-20 breaths per minute. During a sprint up Umananda hill or through Kaziranga on foot, that jumps to 40+. Both your rate *and* depth scale up — you exchange **150 litres of air per minute** at peak effort, 15× your resting rate.',
      intermediateContent:
        '**Gas exchange follows Fick\'s law of diffusion:**\n\n' +
        '`Rate = (D × A × ΔP) / T`\n\n' +
        '| Variable | Meaning | Value at the alveoli |\n' +
        '|----------|---------|---------------------|\n' +
        '| D | Diffusion coefficient | Higher for CO₂ (20× more soluble) |\n' +
        '| A | Surface area | ~70 m² |\n' +
        '| ΔP | Partial pressure difference | O₂: 104 − 40 = **64 mmHg** |\n' +
        '| | | CO₂: 46 − 40 = **6 mmHg** |\n' +
        '| T | Membrane thickness | ~0.5 μm |\n\n' +
        '**Why does CO₂ still leave efficiently with only 6 mmHg difference?** Because CO₂ is 20× more soluble in the alveolar fluid than O₂ — its higher diffusion coefficient more than compensates for the small pressure gradient.\n\n' +
        '**Lung volumes — measured by spirometry:**\n\n' +
        '| Volume | Definition | Typical (adult male) |\n' +
        '|--------|-----------|---------------------|\n' +
        '| Tidal volume (TV) | Normal breath | ~500 mL |\n' +
        '| Inspiratory reserve | Extra you *can* inhale | ~3,000 mL |\n' +
        '| Expiratory reserve | Extra you *can* exhale | ~1,100 mL |\n' +
        '| Residual volume | Always stays in lungs | ~1,200 mL |\n' +
        '| **Vital capacity** | TV + both reserves | ~4,800 mL |\n' +
        '| **Total lung capacity** | VC + residual | ~6,000 mL |\n\n' +
        '**Worked example — minute ventilation:**\n\n' +
        'Minute ventilation = tidal volume × respiratory rate\n' +
        '= 500 mL × 14 breaths/min = **7,000 mL/min = 7 L/min** at rest.\n\n' +
        'During exercise: 2,000 mL × 35 breaths/min = **70 L/min** — a 10× increase.',
      advancedContent:
        '**Haemoglobin\'s oxygen dissociation curve — a masterpiece of molecular design:**\n\n' +
        'Haemoglobin (Hb) has 4 subunits (2α, 2β), each carrying one haem group. Oxygen binding is **cooperative**: as each subunit binds O₂, the remaining subunits become more eager to bind — producing a **sigmoidal (S-shaped) curve** rather than a simple linear one.\n\n' +
        '| PO₂ (mmHg) | Location | Hb saturation | O₂ released |\n' +
        '|-------------|----------|---------------|-------------|\n' +
        '| 100 | Lungs | ~98% | — (loading) |\n' +
        '| 40 | Resting tissue | ~75% | ~25% of O₂ |\n' +
        '| 20 | Exercising muscle | ~25% | ~75% of O₂ |\n\n' +
        'The **Hill coefficient** n ≈ 2.8 quantifies cooperativity (1 = none, 4 = maximum). The T-state (tense, low affinity) → R-state (relaxed, high affinity) conformational shift was described by Perutz (1970 Nobel Prize).\n\n' +
        '**Factors that shift the curve:**\n\n' +
        '| Factor | Direction | Effect | Clinical relevance |\n' +
        '|--------|-----------|--------|--------------------|\n' +
        '| ↑ CO₂ / ↓ pH (Bohr effect) | Right shift | More O₂ released to tissues | Active muscles are acidic — they get more O₂ |\n' +
        '| ↑ Temperature | Right shift | More O₂ released | Exercising muscles are hot |\n' +
        '| ↑ 2,3-BPG | Right shift | More O₂ released | Increases at high altitude — acclimation over days |\n' +
        '| Fetal haemoglobin (HbF) | Left shift | Binds O₂ more tightly | Pulls O₂ from maternal blood across the placenta |\n' +
        '| CO poisoning | Left shift | O₂ locked on, not released | CO binds Hb 250× stronger than O₂ — lethal |\n\n' +
        '**High-altitude populations** in places like the Himalayas show genetic adaptations: Tibetans carry EPAS1 variants (from Denisovan introgression) that blunt the erythropoietin response, avoiding the dangerous polycythaemia (excess red blood cells → thick blood → stroke risk) that lowlanders develop at altitude.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'CO₂ needs a larger pressure gradient than O₂ to cross the alveolar membrane.', answer: false, explanation: 'CO₂ only needs 6 mmHg (vs 64 for O₂) because it is 20× more soluble in the alveolar fluid.' },
            { text: 'Your lungs can never be completely emptied of air.', answer: true, explanation: 'About 1,200 mL of residual volume always remains — the lungs never fully deflate, which keeps the alveoli from collapsing.' },
            { text: 'During exercise, minute ventilation can increase 10-fold.', answer: true, explanation: 'Both breathing rate and tidal volume increase — from ~7 L/min at rest to ~70 L/min during heavy exercise.' },
            { text: 'The diaphragm pushes air out of the lungs when it contracts.', answer: false, explanation: 'When the diaphragm contracts it flattens and PULLS air IN by expanding the chest cavity and lowering pressure. Exhaling happens when it relaxes.' },
          ],
        },
      },
    },

    // ── Section 3: The Digestive System ───────────────────────
    {
      title: 'The Digestive System',
      diagram: 'DigestiveSystemDiagram',
      beginnerContent:
        'Eat a plate of *bhaat-maas* right now and the journey takes **24-48 hours**. That food travels **9 metres** of tubing inside you — uncoiled, the small intestine alone is longer than a school bus. Watch the orange dot in the diagram above, slowly traveling from mouth to exit. That\'s your lunch.\n\n' +
        'Here\'s what should startle you: the inside of your small intestine is covered in millions of finger-like projections called **villi**, and each villus is covered in even smaller projections called **microvilli**. Folds upon folds. If you could flatten all of them, the absorptive surface would be **250 square metres** — the size of a tennis court. All stuffed into 7 metres of tubing in your belly.\n\n' +
        '| Stop | Time spent | What\'s happening | Why it\'s clever |\n' +
        '|------|-----------|-------------------|----------------|\n' +
        '| **Mouth** | 1 min | Teeth crush; saliva starts breaking starch | Amylase begins digestion before you even swallow |\n' +
        '| **Esophagus** | 10 sec | Peristalsis — muscular waves push food down | Works even if you\'re upside down |\n' +
        '| **Stomach** | 2-6 hours | Hydrochloric acid at pH 1.5 (dissolves metal) + pepsin shred proteins | Kills 99.9% of bacteria you swallowed |\n' +
        '| **Small intestine** | 4-6 hours | Pancreatic enzymes + bile finish the job; **90% of nutrients absorbed here** | 7m coiled into 30cm of space |\n' +
        '| **Large intestine** | 12-36 hours | Water reclaimed; gut bacteria ferment fibre | 100 trillion microbes working for you |\n\n' +
        '**Behind the scenes — organs that don\'t touch the food but do most of the work:**\n\n' +
        '| Organ | Secret job |\n' +
        '|-------|-----------|\n' +
        '| **Pancreas** | Dumps enzymes AND bicarbonate into the intestine — neutralizes stomach acid in seconds |\n' +
        '| **Liver** | Makes **bile** (a detergent) that breaks fat globules into tiny droplets so enzymes can work |\n' +
        '| **Gallbladder** | Concentrates bile up to 10× and squirts it on demand when you eat fat |\n\n' +
        'Your stomach acid is pH 1.5 — strong enough to corrode zinc. So why doesn\'t it digest *you*? The stomach wall secretes a thick layer of alkaline mucus that neutralizes acid right at the surface. Your stomach lining is also completely replaced every 3-5 days. When this defense fails (often from *H. pylori* bacteria or too much NSAID use), you get an **ulcer** — a literal hole in your stomach.',
      intermediateContent:
        '**Enzyme specificity — the lock-and-key model:**\n\n' +
        'Each digestive enzyme has an active site shaped to fit only specific molecules:\n\n' +
        '| Enzyme | Source | pH optimum | Substrate → Product |\n' +
        '|--------|--------|-----------|---------------------|\n' +
        '| Salivary amylase | Saliva | ~7 | Starch → maltose |\n' +
        '| Pepsin | Stomach | ~2 | Proteins → peptides (cuts at hydrophobic residues) |\n' +
        '| Trypsin | Pancreas | ~8 | Proteins → peptides (cuts at Arg, Lys) |\n' +
        '| Pancreatic lipase | Pancreas | ~8 | Triglycerides → fatty acids + glycerol |\n' +
        '| Lactase | Brush border | ~6 | Lactose → glucose + galactose |\n\n' +
        '**Worked example — Michaelis-Menten kinetics:**\n\n' +
        'Enzyme reaction rate: `v = V_max × [S] / (K_m + [S])`\n\n' +
        'Pepsin digesting haemoglobin: K_m ≈ 0.01 mM (very tight binding). At [S] = 0.01 mM:\n' +
        'v = V_max × 0.01 / (0.01 + 0.01) = V_max × 0.5 → half-maximal speed.\n' +
        'At [S] = 0.1 mM: v = V_max × 0.1 / (0.01 + 0.1) = V_max × 0.91 → nearly full speed.\n' +
        'A low K_m means the enzyme works efficiently even at low substrate concentrations.\n\n' +
        '**Daily digestive secretions:**\n\n' +
        '| Secretion | Volume per day | Key contents |\n' +
        '|-----------|---------------|--------------|\n' +
        '| Saliva | ~1 L | Amylase, lysozyme, mucus |\n' +
        '| Gastric juice | ~2 L | HCl, pepsin, mucus |\n' +
        '| Bile | ~0.5 L | Bile salts, cholesterol |\n' +
        '| Pancreatic juice | ~1.5 L | Enzymes, bicarbonate |\n' +
        '| Intestinal juice | ~2 L | Brush border enzymes, mucus |\n' +
        '| **Total** | **~7 L** | Nearly all reabsorbed |\n\n' +
        '**Lactose intolerance** occurs when lactase production drops after childhood (~65% of humans worldwide, very common in South and East Asia). Undigested lactose reaches the colon where bacteria ferment it → gas, bloating, diarrhoea.',
      advancedContent:
        '**The gut microbiome — your "virtual organ":**\n\n' +
        'Your large intestine hosts ~38 trillion bacteria (~1,000 species) — roughly equal to the number of human cells in your body.\n\n' +
        '| Function | Mechanism | Impact |\n' +
        '|----------|-----------|--------|\n' +
        '| Energy harvest | Ferment dietary fibre → SCFAs | Butyrate fuels colonocytes (~70% of their energy) |\n' +
        '| Vitamin synthesis | Bacterial metabolism | Vitamins K and B12 |\n' +
        '| Immune training | Interact with gut-associated lymphoid tissue | ~70% of immune cells are in the gut |\n' +
        '| Pathogen resistance | Competitive exclusion | Beneficial bacteria crowd out harmful species |\n\n' +
        '**Short-chain fatty acids (SCFAs):**\n\n' +
        '| SCFA | Major producer | Systemic effect |\n' +
        '|------|---------------|----------------|\n' +
        '| Acetate | Many species | Substrate for lipogenesis, appetite regulation |\n' +
        '| Propionate | Bacteroidetes | Gluconeogenesis in liver, anti-inflammatory |\n' +
        '| Butyrate | Firmicutes (e.g., Faecalibacterium) | Primary fuel for colonocytes, histone acetylation (epigenetic regulation) |\n\n' +
        '**The gut-brain axis:** ~100 million neurons in the enteric nervous system communicate bidirectionally with the brain via the vagus nerve. Gut bacteria produce ~95% of the body\'s serotonin (via enterochromaffin cells) and directly synthesise GABA, dopamine, and noradrenaline. Dysbiosis (microbiome imbalance) is associated with IBD, obesity, type 2 diabetes, and depression.\n\n' +
        '**Faecal microbiota transplantation (FMT)** cures ~90% of recurrent *Clostridioides difficile* infections — one of the most dramatic examples of microbiome-based therapy.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each digestive organ to its primary function',
          pairs: [
            ['Stomach', 'Acid bath (pH 1.5–3.5) — denatures proteins, kills bacteria'],
            ['Pancreas', 'Enzyme factory — trypsin, lipase, amylase + bicarbonate'],
            ['Liver', 'Produces bile — emulsifies fats like dishwashing liquid'],
            ['Small intestine', 'Main absorption site — 250 m² of villi surface area'],
            ['Large intestine', 'Water reabsorption + home to 38 trillion gut bacteria'],
          ],
        },
      },
    },

    // ── Section 4: The Nervous System ─────────────────────────
    {
      title: 'The Nervous System',
      diagram: 'NeuronDiagram',
      beginnerContent:
        'Click the neuron in the diagram. Watch that yellow spark race along the axon — that\'s an **action potential**. A single thought. Right now, your brain is firing about **85 billion of these** — one in each neuron — sometimes 200 times per second. That\'s trillions of sparks per second, all coordinated, all of them you.\n\n' +
        'Here\'s what\'s happening. A neuron has a voltage across its membrane — resting at -70 millivolts (inside negative, outside positive). When something stimulates it, voltage-gated channels snap open, sodium rushes in, voltage flips to +40 mV, then back down. That flip travels down the axon like a wave of falling dominoes. **At up to 120 metres per second.**\n\n' +
        'But the speed trick is wild: the axon isn\'t naked wire. It\'s wrapped in **myelin** — fatty insulation segments with tiny gaps called **Nodes of Ranvier**. Watch the diagram carefully — the spark doesn\'t crawl through the myelin; it **jumps from gap to gap**. That\'s saltatory conduction (from Latin *saltus*, "to leap"). A fish nerve without myelin fires at 2 m/s. Your myelinated nerves fire 60× faster.\n\n' +
        '| Neuron part | Job | Why it\'s designed this way |\n' +
        '|-------------|-----|---------------------------|\n' +
        '| **Dendrites** | Receive signals from thousands of other neurons | Tree-like branching = maximum input surface |\n' +
        '| **Soma (cell body)** | Integrates all inputs, decides whether to fire | Threshold at -55 mV: pass it, fire; below it, silent |\n' +
        '| **Axon** | Carries signal up to 1 metre (sciatic nerve!) | Single long wire — no branching losses |\n' +
        '| **Myelin sheath** | Insulation + speed boost | Wrapped by Schwann cells, 100+ layers thick |\n' +
        '| **Synapse** | Hands off to the next neuron | 20 nm gap — bridged by chemical neurotransmitters |\n\n' +
        'When the spark reaches the synapse, the electrical signal becomes chemical. Vesicles dump **neurotransmitters** (dopamine, serotonin, acetylcholine, GABA) into the tiny gap. They drift across, bind to receptors on the next neuron, and — if enough of them arrive — the next neuron fires. **This is how drugs work.** Caffeine blocks the "stop firing" signal. Alcohol ramps up GABA (the inhibitor). SSRIs keep serotonin hanging around longer.\n\n' +
        '**Your brain in numbers:** 86 billion neurons. 100 trillion synaptic connections. Consumes 20% of your daily calories despite being 2% of your body weight. Can store (by some estimates) 2.5 petabytes — enough for 3 million hours of TV.\n\n' +
        '**The fastest trick: reflex arcs.** When you touch a hot *tawa*, you pull your hand back in ~50 milliseconds — **before the pain signal even reaches your brain**. The spinal cord processes the danger and commands your muscles directly. Your brain finds out a split second later, when the "OW!" finally arrives.',
      intermediateContent:
        '**The action potential — step by step:**\n\n' +
        '| Stage | Voltage | What happens |\n' +
        '|-------|---------|-------------|\n' +
        '| Resting | −70 mV | Na⁺/K⁺ pumps maintain charge difference (3 Na⁺ out, 2 K⁺ in per cycle) |\n' +
        '| Threshold | −55 mV | Stimulus reaches threshold — all-or-nothing |\n' +
        '| Depolarisation | +30 mV | Voltage-gated Na⁺ channels open → Na⁺ floods in (~0.5 ms) |\n' +
        '| Repolarisation | → −70 mV | Na⁺ channels close, K⁺ channels open → K⁺ flows out |\n' +
        '| Hyperpolarisation | −80 mV | Brief overshoot — refractory period (~2 ms) |\n\n' +
        'The **all-or-nothing principle**: once threshold is reached, the action potential fires at full strength regardless of how strong the stimulus was. Stronger stimuli don\'t make bigger signals — they increase the **firing frequency** (more action potentials per second).\n\n' +
        '**Saltatory conduction** in myelinated neurons: the signal "jumps" between gaps in the myelin (Nodes of Ranvier, spaced ~1 mm apart). This achieves **120 m/s** vs ~2 m/s in unmyelinated fibres — a 60× speedup.\n\n' +
        '**Synapse mechanics:**\n\n' +
        '| Step | Event | Key molecules |\n' +
        '|------|-------|---------------|\n' +
        '| 1 | Action potential arrives at axon terminal | — |\n' +
        '| 2 | Ca²⁺ channels open → Ca²⁺ floods in | Ca²⁺ |\n' +
        '| 3 | Vesicles fuse with membrane (via SNARE proteins) | Synaptobrevin, syntaxin, SNAP-25 |\n' +
        '| 4 | ~5,000 neurotransmitter molecules released per vesicle | Acetylcholine, dopamine, etc. |\n' +
        '| 5 | Neurotransmitter binds receptor on next neuron | Excitatory or inhibitory |\n' +
        '| 6 | Neurotransmitter removed (reuptake, enzyme breakdown) | Acetylcholinesterase, MAO |\n\n' +
        '**Botulinum toxin (Botox)** blocks SNARE proteins, preventing vesicle fusion → no neurotransmitter release → paralysis. In tiny doses, this is used cosmetically to relax facial muscles.',
      advancedContent:
        '**Long-term potentiation (LTP) — how synapses learn:**\n\n' +
        'LTP is the persistent strengthening of synapses based on recent activity patterns — the leading cellular model of learning and memory.\n\n' +
        '| Phase | Mechanism | Duration |\n' +
        '|-------|-----------|----------|\n' +
        '| **Early LTP** | Existing AMPA receptors phosphorylated + new AMPA receptors inserted | Minutes to hours |\n' +
        '| **Late LTP** | CREB-mediated gene transcription → new protein synthesis → structural changes | Hours to years |\n\n' +
        '**The NMDA receptor as a coincidence detector:**\n\n' +
        '| Requirement | Why |\n' +
        '|-------------|-----|\n' +
        '| Glutamate must be bound | Presynaptic neuron fired |\n' +
        '| Postsynaptic membrane must be depolarised | Postsynaptic neuron was already active |\n' +
        '| Both must happen simultaneously | Mg²⁺ block is only removed by depolarisation |\n\n' +
        'This makes NMDA receptors detect when two neurons fire together — the molecular basis of Hebb\'s rule: "neurons that fire together wire together." Ca²⁺ influx through NMDA receptors activates **CaMKII**, which phosphorylates AMPA receptors and triggers their insertion into the postsynaptic membrane.\n\n' +
        '**Optogenetics** (Deisseroth, 2005) uses channelrhodopsins (light-activated ion channels from algae) genetically expressed in specific neuron populations. Researchers can activate or silence individual circuits with millisecond precision using fibre-optic light — identifying specific neuronal populations controlling fear, reward, aggression, and social behaviour.\n\n' +
        '**Clinical link:** Multiple sclerosis (MS) is an autoimmune disease where the immune system attacks myelin sheaths. As myelin degrades, saltatory conduction fails → signals slow or stop → progressive neurological symptoms (vision loss, weakness, coordination problems).',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'Your brain uses 20% of your body\'s energy but makes up only 2% of your weight — it is the most energy-hungry organ per gram.',
            'The fastest nerve signals travel at 120 m/s — that\'s 432 km/h, faster than a bullet train.',
            'You have roughly 100 trillion synaptic connections — more than the number of stars in the Milky Way galaxy.',
            'A reflex arc through the spinal cord takes only ~50 milliseconds — 5× faster than a blink.',
            'The giant squid has axons up to 1 mm thick (vs 0.02 mm in humans) — Hodgkin and Huxley used them to discover how action potentials work, winning the 1963 Nobel Prize.',
          ],
        },
      },
    },

    // ── Section 5: Skeleton and Muscles ───────────────────────
    {
      title: 'Skeleton and Muscles',
      diagram: 'SkeletonMuscleDiagram',
      beginnerContent:
        'Here\'s something you\'ve probably never thought about: **muscles can only pull. They cannot push.** Every movement you make — bending an elbow, turning your head, curling a finger — happens because one muscle shortens while its partner gets out of the way.\n\n' +
        'Watch the diagram. When the bicep contracts (bulges, shortens), the forearm swings up. At the same moment, the tricep on the other side *relaxes* (goes slack, lets itself be stretched). To straighten your arm, the tricep takes over — it contracts, pulls the forearm back down, and the bicep goes slack. **Antagonistic pairs.** Every joint in your body has them. Without the partner letting go, nothing moves.\n\n' +
        'This is why you can\'t "flex" your bicep *and* your tricep at the same time with equal force — they\'re wired to oppose each other. Try it: focus on flexing your bicep hard while keeping your tricep just as tight. Your arm locks in place. Neither muscle wins.\n\n' +
        '**Bones are not dead scaffolding.** They\'re composite material — 65% hydroxyapatite (calcium-phosphate crystal, the "stone") and 35% collagen fibres (the "rebar"). This combo gives bone a **strength-to-weight ratio better than steel**. And they\'re alive: specialized cells (osteoblasts) build new bone, others (osteoclasts) tear it down. Your entire skeleton gets replaced every 7-10 years.\n\n' +
        '| Bone\'s secret job | What it does |\n' +
        '|-------------------|--------------|\n' +
        '| **Support** | Keeps you upright against gravity |\n' +
        '| **Protection** | Skull shields brain, ribs shield heart/lungs, vertebrae shield spinal cord |\n' +
        '| **Movement** | Levers for muscles to pull against |\n' +
        '| **Blood cell factory** | Red marrow in femur, pelvis, sternum makes **200 billion blood cells per day** |\n' +
        '| **Mineral bank** | Stores 99% of your body\'s calcium; releases it when blood levels drop |\n\n' +
        '**Why are babies floppy?** They\'re born with about **270 bones** — many are still soft cartilage. As you grow, bones fuse together. Adults have **206 bones**. The skull alone goes from 44 pieces in a fetus to 22 in an adult.\n\n' +
        'Joints are where the engineering gets clever:\n\n' +
        '| Joint | Movement | Example | Like a... |\n' +
        '|-------|----------|---------|-----------|\n' +
        '| **Ball-and-socket** | All directions | Hip, shoulder | Joystick |\n' +
        '| **Hinge** | Back and forth only | Elbow, knee | Door hinge |\n' +
        '| **Pivot** | Rotation | Top of neck (atlas-axis) | Swivel chair — this is how you shake your head "no" |\n' +
        '| **Gliding** | Slide across each other | Wrist, ankle bones | Drawer on runners |\n\n' +
        'When you grip a knife to cut *bhaat* fish — or type on a keyboard — your forearm has about **20 muscles** all pulling on tendons that run through your wrist and attach to finger bones. The precision is staggering: eye muscles have just 10 muscle fibres per nerve cell (for laser-sharp control), while your quadriceps have 2,000 fibres per nerve (for raw power). Precision vs. strength, baked into the wiring.',
      intermediateContent:
        '**Bone — a remarkable composite material:**\n\n' +
        '| Component | Percentage | What it provides | Analogy |\n' +
        '|-----------|-----------|------------------|----------|\n' +
        '| Inorganic (hydroxyapatite, Ca₁₀(PO₄)₆(OH)₂) | 65% | Compressive strength (hardness) | The stone in reinforced concrete |\n' +
        '| Organic (collagen fibres) | 35% | Tensile strength (flexibility) | The steel rebar |\n\n' +
        'This composite gives bone a **strength-to-weight ratio better than steel or concrete**.\n\n' +
        '**Wolff\'s Law** — bone remodels in response to stress:\n\n' +
        '| Scenario | Bone response | Mechanism |\n' +
        '|----------|---------------|------------|\n' +
        '| Weight-bearing exercise | Bone gets denser and stronger | Osteoblasts build new bone |\n' +
        '| Bed rest or microgravity | Bone weakens (1–2% loss/month in space) | Osteoclasts resorb more than osteoblasts build |\n' +
        '| Fracture healing | Callus forms, then remodels | Osteocytes detect strain via fluid flow |\n\n' +
        '**Muscle contraction — the sliding filament model:**\n\n' +
        '| Step | Event | Energy source |\n' +
        '|------|-------|---------------|\n' +
        '| 1 | Ca²⁺ released from sarcoplasmic reticulum | Nerve signal triggers release |\n' +
        '| 2 | Ca²⁺ binds troponin → tropomyosin shifts → exposes actin binding sites | — |\n' +
        '| 3 | Myosin head binds actin (cross-bridge) | — |\n' +
        '| 4 | Power stroke — myosin pivots 45°, pulling actin ~10 nm | 1 ATP per cycle |\n' +
        '| 5 | ATP binds myosin → releases actin → myosin re-cocks | 1 ATP |\n' +
        '| 6 | Cycle repeats ~5 times per second | — |\n\n' +
        '**Motor units** control precision:\n\n' +
        '| Muscle | Fibres per motor neuron | Why |\n' +
        '|--------|------------------------|-----|\n' +
        '| Eye muscles | ~10 | Extremely fine control needed |\n' +
        '| Hand muscles | ~100 | Moderate precision |\n' +
        '| Quadriceps (thigh) | ~2,000 | Raw power, not precision |',
      advancedContent:
        '**Hill\'s force-velocity equation:**\n\n' +
        '`(P + a)(v + b) = (P₀ + a) × b`\n\n' +
        'where P = load, v = shortening velocity, P₀ = maximum isometric force, a and b are constants.\n\n' +
        '| Condition | Load (P) | Velocity (v) | Example |\n' +
        '|-----------|----------|-------------|----------|\n' +
        '| Maximum velocity | 0 (no load) | v_max | Throwing a punch with no weight |\n' +
        '| Maximum force | P₀ (immovable) | 0 | Pushing against a wall |\n' +
        '| Optimal power | ~0.3 × P₀ | ~0.3 × v_max | Cycling uphill at moderate resistance |\n\n' +
        '**Muscle fibre types:**\n\n' +
        '| Property | Type I (slow-twitch) | Type IIa (fast oxidative) | Type IIx (fast glycolytic) |\n' +
        '|----------|---------------------|--------------------------|---------------------------|\n' +
        '| Contraction speed | Slow | Fast | Fastest |\n' +
        '| Fatigue resistance | High | Moderate | Low |\n' +
        '| Energy source | Aerobic (oxidative) | Mixed | Anaerobic (glycolytic) |\n' +
        '| Myoglobin content | High (red) | Moderate | Low (white) |\n' +
        '| Mitochondria | Many | Many | Few |\n' +
        '| Typical role | Posture, endurance | Middle-distance running | Sprinting, jumping |\n\n' +
        'Fibre-type distribution is ~50/50 in most people, but elite athletes differ dramatically: marathon runners may have >80% Type I in the soleus; sprinters may have >70% Type IIx in the vastus lateralis.\n\n' +
        '**Titin — the largest known protein:**\n\n' +
        '| Property | Value |\n' +
        '|----------|-------|\n' +
        '| Amino acids | 34,350 |\n' +
        '| Molecular weight | ~3.7 MDa |\n' +
        '| Length | Half the sarcomere (Z-disc to M-line) |\n' +
        '| Function | Molecular spring — PEVK domain and Ig repeats unfold under stretch |\n\n' +
        'Titin generates **passive tension** that prevents over-extension and contributes to the Frank-Starling mechanism in cardiac muscle (connecting the skeletal and cardiac systems at the molecular level).',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Babies have fewer bones than adults.', answer: false, explanation: 'Babies are born with about 270 bones. Many fuse together during growth, leaving 206 in adults.' },
            { text: 'Muscles can both push and pull bones.', answer: false, explanation: 'Muscles can only PULL (contract). This is why they work in antagonistic pairs — one pulls in one direction, the other pulls in the opposite direction.' },
            { text: 'Astronauts lose bone mass in space.', answer: true, explanation: 'Without gravity loading the bones, osteoclasts resorb more bone than osteoblasts build — about 1–2% bone loss per month in microgravity (Wolff\'s Law in reverse).' },
            { text: 'Bone has a better strength-to-weight ratio than steel.', answer: true, explanation: 'The composite of hard hydroxyapatite crystals (65%) and flexible collagen fibres (35%) gives bone superior strength-to-weight ratio compared to steel or concrete.' },
          ],
        },
      },
    },
  ],
};
