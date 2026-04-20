import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'electrochemistry',
  title: 'Electrochemistry',
  category: 'chemistry',
  tags: ['physics'],
  keywords: ['redox', 'electrode', 'electrolysis', 'galvanic cell', 'nernst equation', 'oxidation', 'reduction', 'battery'],
  icon: '⚗️',
  tagline: 'Where chemistry meets electricity — batteries, corrosion, and electroplating.',
  relatedStories: ['firefly-festival-of-majuli', 'festival-lights'],
  understand: [
    // ── Section 1: Redox Reactions ──────────────────────────────
    {
      title: 'Redox Reactions — Electron Transfer',
      diagram: 'RedoxDiagram',
      beginnerContent:
        'Electrochemistry is built on one idea: **electrons moving from one substance to another**. These are called **redox reactions** — short for reduction-oxidation.\n\n' +
        '**The analogy:** Imagine two people passing a ball. The person who *throws* the ball (loses it) is **oxidised**. The person who *catches* it (gains it) is **reduced**. The ball is an electron.\n\n' +
        'The mnemonic **OIL RIG** makes this stick:\n' +
        '- **O**xidation **I**s **L**oss (of electrons)\n' +
        '- **R**eduction **I**s **G**ain (of electrons)\n\n' +
        '**A reaction you can see:** Dip a zinc strip into blue copper sulphate solution:\n\n' +
        '| What happens | Half-reaction | Name |\n' +
        '|-------------|---------------|------|\n' +
        '| Zinc atoms lose 2 electrons each | Zn → Zn²⁺ + 2e⁻ | **Oxidation** (zinc is the "thrower") |\n' +
        '| Copper ions gain 2 electrons each | Cu²⁺ + 2e⁻ → Cu | **Reduction** (copper is the "catcher") |\n\n' +
        'You can *watch* this happen: the zinc strip becomes coated with reddish copper metal, and the blue solution gradually fades as Cu²⁺ ions are removed.\n\n' +
        '**Redox is everywhere:**\n\n' +
        '| Everyday process | What\'s oxidised | What\'s reduced |\n' +
        '|-----------------|----------------|----------------|\n' +
        '| Iron rusting | Iron (Fe → Fe³⁺) | Oxygen (O₂ → O²⁻) |\n' +
        '| Wood burning in an Assamese cooking fire | Carbon in wood | Oxygen in air |\n' +
        '| Photosynthesis in Kaziranga\'s forests | Water (H₂O) | Carbon dioxide (CO₂) |\n' +
        '| Your cells making energy (respiration) | Glucose (C₆H₁₂O₆) | Oxygen (O₂) |\n' +
        '| A battery powering your phone | Metal at the anode | Metal ion at the cathode |\n\n' +
        '**Check yourself:** When iron rusts, is iron oxidised or reduced?\n\n' +
        '*Iron is oxidised — it loses electrons to oxygen. The rust (iron oxide) is the product of iron giving up its electrons.*',
      intermediateContent:
        '**Oxidation states — the bookkeeping system:**\n\n' +
        'Oxidation states (or oxidation numbers) let you track electron transfer in any reaction. Rules:\n\n' +
        '| Rule | Example |\n' +
        '|------|--------|\n' +
        '| Elements in their natural form = 0 | Fe = 0, O₂ = 0, Zn = 0 |\n' +
        '| Oxygen is usually −2 | In H₂O: O = −2 |\n' +
        '| Hydrogen is usually +1 | In H₂O: H = +1 |\n' +
        '| Sum of oxidation states = charge on species | In SO₄²⁻: S + 4(−2) = −2, so S = +6 |\n\n' +
        '**Worked example — balancing a redox equation:**\n\n' +
        'Balance: Fe²⁺ + MnO₄⁻ → Fe³⁺ + Mn²⁺ (in acidic solution)\n\n' +
        '| Step | Action | Result |\n' +
        '|------|--------|--------|\n' +
        '| 1 | Write half-reactions | Fe²⁺ → Fe³⁺ and MnO₄⁻ → Mn²⁺ |\n' +
        '| 2 | Balance atoms (add H₂O, H⁺) | MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O |\n' +
        '| 3 | Balance electrons | Fe²⁺ → Fe³⁺ + e⁻ and MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O |\n' +
        '| 4 | Equalise electrons (×5 for Fe) | 5Fe²⁺ → 5Fe³⁺ + 5e⁻ |\n' +
        '| 5 | Add half-reactions | **5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O** |\n\n' +
        'Mn goes from +7 to +2 (gains 5e⁻ = reduced). Each Fe goes from +2 to +3 (loses 1e⁻ = oxidised). Five iron atoms supply the five electrons that one permanganate ion needs.',
      advancedContent:
        '**Electrochemical series and predicting reactions:**\n\n' +
        'The standard electrode potential (E°) measures a species\' tendency to gain electrons. The more positive E°, the stronger the oxidising agent:\n\n' +
        '| Half-reaction | E° (V) | Tendency |\n' +
        '|--------------|--------|----------|\n' +
        '| F₂ + 2e⁻ → 2F⁻ | +2.87 | Strongest oxidiser |\n' +
        '| Au³⁺ + 3e⁻ → Au | +1.50 | Gold never corrodes |\n' +
        '| Ag⁺ + e⁻ → Ag | +0.80 | Noble |\n' +
        '| Cu²⁺ + 2e⁻ → Cu | +0.34 | Moderate |\n' +
        '| 2H⁺ + 2e⁻ → H₂ | 0.00 | **Reference** |\n' +
        '| Fe²⁺ + 2e⁻ → Fe | −0.44 | Reactive |\n' +
        '| Zn²⁺ + 2e⁻ → Zn | −0.76 | More reactive |\n' +
        '| Al³⁺ + 3e⁻ → Al | −1.66 | Highly reactive |\n' +
        '| Li⁺ + e⁻ → Li | −3.04 | Strongest reducer |\n\n' +
        '**Prediction rule:** A species lower in the table (more negative E°) will reduce a species higher in the table. Zn (−0.76 V) spontaneously reduces Cu²⁺ (+0.34 V) because E°cell = E°cathode − E°anode = +0.34 − (−0.76) = **+1.10 V** (positive = spontaneous).\n\n' +
        '**Disproportionation** — a species simultaneously oxidises and reduces itself. Example: Cu⁺ in water: 2Cu⁺ → Cu²⁺ + Cu. This happens because E° for Cu⁺/Cu (+0.52 V) > E° for Cu²⁺/Cu⁺ (+0.16 V), making Cu⁺ unstable in aqueous solution.\n\n' +
        '**Latimer and Frost diagrams** provide compact summaries of an element\'s redox chemistry across multiple oxidation states — essential for understanding multi-electron transfer in transition metals like manganese (which has stable oxidation states from 0 to +7).',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each term to its meaning in electrochemistry',
          pairs: [
            ['Oxidation', 'Loss of electrons — the substance that "throws" electrons (Zn → Zn²⁺ + 2e⁻)'],
            ['Reduction', 'Gain of electrons — the substance that "catches" electrons (Cu²⁺ + 2e⁻ → Cu)'],
            ['Oxidising agent', 'The substance that gets reduced — it causes oxidation in others (Cu²⁺ in a Daniell cell)'],
            ['Reducing agent', 'The substance that gets oxidised — it causes reduction in others (Zn in a Daniell cell)'],
          ],
        },
      },
    },

    // ── Section 2: Voltaic Cells ────────────────────────────────
    {
      title: 'Voltaic Cells — Chemistry Makes Electricity',
      diagram: 'VoltaicCellDiagram',
      beginnerContent:
        'In the zinc-copper reaction above, electrons transfer directly from zinc to copper — releasing energy as heat. But what if you **separate** the two halves and force the electrons to travel through a wire? Now that energy becomes **electricity**.\n\n' +
        '**The analogy:** Imagine water flowing downhill. If water falls freely, you just get a splash. But if you channel it through a turbine, you get useful energy. A voltaic cell channels electron flow through a wire to power a device.\n\n' +
        '**Inside a Daniell cell (the classic voltaic cell):**\n\n' +
        '| Component | What it is | What it does |\n' +
        '|-----------|-----------|-------------|\n' +
        '| **Anode** (−) | Zinc strip in ZnSO₄ solution | Zinc oxidises: Zn → Zn²⁺ + 2e⁻ |\n' +
        '| **Cathode** (+) | Copper strip in CuSO₄ solution | Copper reduces: Cu²⁺ + 2e⁻ → Cu |\n' +
        '| **External wire** | Connects the two electrodes | Electrons flow from anode → cathode |\n' +
        '| **Salt bridge** | Tube of KCl or KNO₃ gel | Ions migrate to balance charge |\n\n' +
        '**Why do you need a salt bridge?** Without it, the anode solution becomes too positive (losing Zn²⁺ into solution with no balance) and the cathode solution becomes too negative (losing Cu²⁺ from solution). The salt bridge lets ions flow to maintain neutrality — without it, the cell stops in seconds.\n\n' +
        '**Voltage depends on the reactivity gap:**\n\n' +
        '| Cell combination | E° anode | E° cathode | Cell voltage |\n' +
        '|-----------------|----------|-----------|-------------|\n' +
        '| Zn / Cu | −0.76 V | +0.34 V | **1.10 V** |\n' +
        '| Zn / Ag | −0.76 V | +0.80 V | **1.56 V** |\n' +
        '| Fe / Cu | −0.44 V | +0.34 V | **0.78 V** |\n' +
        '| Li / F₂ | −3.04 V | +2.87 V | **5.91 V** |\n\n' +
        'The bigger the gap in reactivity, the higher the voltage. This is why lithium batteries are so powerful — lithium is the most reactive metal.\n\n' +
        'The tin-plated iron vessels once common in Assamese households corrode rapidly when the tin coating is scratched. Why? Iron (−0.44 V) is more reactive than tin (−0.14 V). When both are exposed to water, iron preferentially loses electrons and rusts faster than it would alone — an unwanted voltaic cell!',
      intermediateContent:
        '**Cell notation — shorthand for electrochemists:**\n\n' +
        'The Daniell cell is written: **Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)**\n\n' +
        '| Symbol | Meaning |\n' +
        '|--------|--------|\n' +
        '| Single bar `|` | Phase boundary (solid/solution) |\n' +
        '| Double bar `||` | Salt bridge |\n' +
        '| Anode on the left | Convention |\n' +
        '| Cathode on the right | Convention |\n\n' +
        '**The Nernst equation — voltage at non-standard conditions:**\n\n' +
        '`E = E° − (RT/nF) ln Q`\n\n' +
        'At 25°C: **E = E° − (0.0592/n) log Q**\n\n' +
        '| Symbol | Meaning | Value |\n' +
        '|--------|---------|-------|\n' +
        '| E | Cell voltage at actual conditions | What we calculate |\n' +
        '| E° | Standard cell voltage | From tables |\n' +
        '| R | Gas constant | 8.314 J/(mol·K) |\n' +
        '| T | Temperature | 298 K (at 25°C) |\n' +
        '| n | Electrons transferred | 2 for Daniell cell |\n' +
        '| F | Faraday\'s constant | 96,485 C/mol |\n' +
        '| Q | Reaction quotient | [products]/[reactants] |\n\n' +
        '**Worked example — Daniell cell with non-standard concentrations:**\n\n' +
        'Given: [Zn²⁺] = 0.10 M, [Cu²⁺] = 1.0 M, E° = 1.10 V, n = 2\n\n' +
        'Q = [Zn²⁺]/[Cu²⁺] = 0.10/1.0 = 0.10\n\n' +
        '`E = 1.10 − (0.0592/2) × log(0.10)`\n' +
        '`E = 1.10 − (0.0296) × (−1)`\n' +
        '`E = 1.10 + 0.030 = **1.13 V**`\n\n' +
        'The voltage *increases* when [Cu²⁺] is high and [Zn²⁺] is low — Le Chatelier\'s principle at work: the forward reaction is favoured.',
      advancedContent:
        '**Thermodynamic relationships:**\n\n' +
        'The cell voltage connects directly to thermodynamic quantities:\n\n' +
        '| Relationship | Equation | What it tells you |\n' +
        '|-------------|----------|-------------------|\n' +
        '| Gibbs free energy | ΔG° = −nFE° | Negative ΔG° = spontaneous |\n' +
        '| Equilibrium constant | ln K = nFE°/RT | Large K = reaction goes to completion |\n' +
        '| Entropy (temperature dependence) | ΔS° = nF(dE°/dT) | How voltage changes with temperature |\n\n' +
        '**Worked example — Daniell cell thermodynamics:**\n\n' +
        'E° = 1.10 V, n = 2, F = 96,485 C/mol\n\n' +
        '`ΔG° = −nFE° = −2 × 96,485 × 1.10 = −212,267 J/mol = **−212.3 kJ/mol**`\n\n' +
        '`ln K = nFE°/RT = (2 × 96,485 × 1.10)/(8.314 × 298) = 85.6`\n' +
        '`K = e^85.6 ≈ **1.6 × 10³⁷**`\n\n' +
        'This enormous K confirms what we see experimentally — the reaction goes essentially to completion.\n\n' +
        '**Concentration cells** — same electrodes, different concentrations. E° = 0 (identical electrodes), but the Nernst equation gives a non-zero voltage:\n\n' +
        '`E = −(0.0592/n) log([dilute]/[concentrated])`\n\n' +
        'This is the principle behind ion-selective electrodes (e.g., pH meters) and biological membrane potentials. The −70 mV resting potential of a neuron is essentially a concentration cell: K⁺ is more concentrated inside the cell than outside.',
    },

    // ── Section 3: Electrolysis ─────────────────────────────────
    {
      title: 'Electrolysis — Electricity Drives Chemistry',
      beginnerContent:
        'A voltaic cell converts chemical energy → electrical energy. **Electrolysis does the reverse:** it uses electrical energy to force a non-spontaneous reaction to occur.\n\n' +
        '**The analogy:** A voltaic cell is a ball rolling downhill (spontaneous). Electrolysis is pushing a ball uphill (needs energy input).\n\n' +
        '**How it works:**\n\n' +
        '| Component | What happens |\n' +
        '|-----------|-------------|\n' +
        '| **Power supply** | Pushes electrons in the "wrong" direction |\n' +
        '| **Cathode (−)** | Positive ions migrate here and are **reduced** (gain e⁻) |\n' +
        '| **Anode (+)** | Negative ions migrate here and are **oxidised** (lose e⁻) |\n' +
        '| **Electrolyte** | Liquid or molten substance containing free ions |\n\n' +
        '**Classic demonstration — electrolysis of water:**\n\n' +
        'Pass a current through water (with a drop of acid for conductivity):\n' +
        '- **Cathode:** 2H⁺ + 2e⁻ → H₂ (hydrogen gas bubbles)\n' +
        '- **Anode:** 2OH⁻ → H₂O + ½O₂ + 2e⁻ (oxygen gas bubbles)\n\n' +
        'The volume of hydrogen is always **exactly double** the volume of oxygen — a beautiful confirmation that water is H₂O.\n\n' +
        '**Industrial uses of electrolysis:**\n\n' +
        '| Application | What happens | Scale |\n' +
        '|------------|-------------|-------|\n' +
        '| **Aluminium extraction** (Hall-Héroult) | Al₂O₃ dissolved in molten cryolite, electrolysed at 960°C | 100,000–300,000 A per cell |\n' +
        '| **Chlor-alkali process** | 2NaCl + 2H₂O → Cl₂ + 2NaOH + H₂ | Produces bleach, PVC, drain cleaner |\n' +
        '| **Copper refining** | Impure copper anode → pure copper cathode | 99.99% purity |\n' +
        '| **Electroplating** | Object as cathode, plating metal dissolves from anode | Jewellery, car parts |\n\n' +
        'The brass and silver-plated items in Guwahati\'s Fancy Bazaar are finished by electroplating — the object is made the cathode, and metal ions from the anode deposit onto its surface, one atomic layer at a time.\n\n' +
        '**Check yourself:** In electrolysis, does reduction happen at the cathode or the anode?\n\n' +
        '*Always at the cathode — the same as in a voltaic cell. "Reduction at the Cathode" (both start with consonants). The difference is that in electrolysis, the cathode is negative (connected to the − terminal of the battery).*',
      intermediateContent:
        '**Faraday\'s laws of electrolysis — quantitative predictions:**\n\n' +
        '| Law | Statement | Equation |\n' +
        '|-----|----------|----------|\n' +
        '| **First** | Mass deposited ∝ total charge passed | m = (M × I × t) / (n × F) |\n' +
        '| **Second** | For the same charge, mass deposited ∝ M/n | Compare: m₁/m₂ = (M₁/n₁) / (M₂/n₂) |\n\n' +
        '| Symbol | Meaning | Units |\n' +
        '|--------|---------|-------|\n' +
        '| m | Mass deposited | grams |\n' +
        '| M | Molar mass | g/mol |\n' +
        '| I | Current | amperes (A) |\n' +
        '| t | Time | seconds (s) |\n' +
        '| n | Electrons per ion | (e.g., 2 for Cu²⁺) |\n' +
        '| F | Faraday\'s constant | 96,485 C/mol |\n\n' +
        '**Worked example — copper electroplating:**\n\n' +
        'How much copper deposits on a spoon if you pass 2.0 A for 30 minutes?\n\n' +
        '`m = (M × I × t) / (n × F)`\n' +
        '`m = (63.5 × 2.0 × 1800) / (2 × 96,485)`\n' +
        '`m = 228,600 / 192,970`\n' +
        '`m = **1.18 g** of copper`\n\n' +
        '**Worked example — aluminium extraction:**\n\n' +
        'An aluminium smelter passes 200,000 A continuously. How much aluminium is produced per hour?\n\n' +
        '`m = (27.0 × 200,000 × 3600) / (3 × 96,485)`\n' +
        '`m = 19,440,000,000 / 289,455`\n' +
        '`m = 67,136 g = **67.1 kg/hour**`\n\n' +
        'This is why aluminium smelting consumes ~5% of all electricity generated worldwide — and why aluminium was more expensive than gold before electrolysis was invented in 1886.',
      advancedContent:
        '**Overpotential — why real electrolysis needs more voltage than theory predicts:**\n\n' +
        'The thermodynamic decomposition voltage of water is 1.23 V. In practice, you need ~1.8–2.0 V. The extra voltage (overpotential, η) is consumed by:\n\n' +
        '| Source | Typical magnitude | Cause |\n' +
        '|--------|------------------|-------|\n' +
        '| **Activation overpotential** | 0.1–0.5 V | Energy barrier for electron transfer at the electrode surface |\n' +
        '| **Concentration overpotential** | 0.05–0.3 V | Ion depletion near the electrode |\n' +
        '| **Ohmic (resistance) overpotential** | 0.1–0.3 V | IR drop through the electrolyte |\n\n' +
        'The **Tafel equation** describes activation overpotential: η = a + b × log(i), where i is current density and b (Tafel slope) is typically 30–120 mV/decade. Low Tafel slope = efficient electrode kinetics.\n\n' +
        '**The Butler-Volmer equation** is the full kinetic model:\n\n' +
        '`i = i₀ [exp(αₐFη/RT) − exp(−αcFη/RT)]`\n\n' +
        'where i₀ is the exchange current density (how fast the reaction proceeds at equilibrium) and α is the charge transfer coefficient. At large overpotentials, one exponential term dominates → Tafel equation.\n\n' +
        '**Green hydrogen:** Water electrolysis powered by renewable energy is the leading pathway to carbon-free hydrogen fuel. Current PEM (proton exchange membrane) electrolysers achieve ~70% efficiency. The target: $2/kg H₂ by 2030 (currently ~$5/kg). India\'s National Green Hydrogen Mission targets 5 million tonnes/year by 2030 — with potential for NE India\'s hydropower surplus to drive local hydrogen production.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'In electrolysis, the cathode is connected to the positive terminal of the battery.', answer: false, explanation: 'The cathode is connected to the negative terminal — electrons are pushed INTO the cathode, where positive ions are reduced.' },
            { text: 'Electrolysis of water produces twice the volume of hydrogen compared to oxygen.', answer: true, explanation: 'Water is H₂O — two hydrogen atoms for every oxygen. At the cathode: 2H⁺ + 2e⁻ → H₂. At the anode: 2OH⁻ → H₂O + ½O₂ + 2e⁻. The 2:1 ratio confirms water\'s formula.' },
            { text: 'Aluminium can be extracted from its ore by heating alone, without electrolysis.', answer: false, explanation: 'Aluminium is too reactive. Its oxide (Al₂O₃) has an extremely strong ionic bond. Only electrolysis at 960°C in molten cryolite provides enough energy to reduce Al³⁺ to Al.' },
            { text: 'Doubling the current in electrolysis doubles the mass deposited in the same time.', answer: true, explanation: 'Faraday\'s first law: m = MIt/nF. Mass is directly proportional to current (I), so doubling I doubles m.' },
          ],
        },
      },
    },

    // ── Section 4: Batteries ────────────────────────────────────
    {
      title: 'Batteries — Portable Electrochemistry',
      diagram: 'BatteryCrossSectionDiagram',
      beginnerContent:
        'A battery is one or more voltaic cells packaged for practical use. Every battery has the same basic structure: an anode that wants to lose electrons, a cathode that wants to gain them, and an electrolyte that lets ions flow between them.\n\n' +
        '**Primary vs secondary batteries:**\n\n' +
        '| Type | Can recharge? | How it works | Example |\n' +
        '|------|--------------|-------------|--------|\n' +
        '| **Primary** | ❌ No | Reactants consumed irreversibly | Alkaline (AA, AAA) |\n' +
        '| **Secondary** | ✅ Yes | External voltage reverses the chemistry | Li-ion, lead-acid |\n\n' +
        '**Common battery types compared:**\n\n' +
        '| Battery | Anode | Cathode | Voltage | Energy density | Used in |\n' +
        '|---------|-------|---------|---------|---------------|--------|\n' +
        '| **Alkaline** | Zinc (Zn) | MnO₂ | 1.5 V | 150 Wh/kg | Remotes, toys, torches |\n' +
        '| **Lead-acid** | Lead (Pb) | PbO₂ | 2.1 V/cell | 35 Wh/kg | Car starter batteries |\n' +
        '| **Lithium-ion** | Graphite (LiC₆) | LiCoO₂ | 3.7 V | 250 Wh/kg | Phones, laptops, EVs |\n' +
        '| **Lithium iron phosphate** | Graphite | LiFePO₄ | 3.2 V | 170 Wh/kg | Solar storage, e-buses |\n\n' +
        '**How a lead-acid car battery works:** Six cells in series (6 × 2.1 V = 12.6 V). During discharge, both electrodes convert to lead sulphate (PbSO₄). During charging (alternator running), the external current reverses this. The sulphuric acid electrolyte gets diluted during discharge — a mechanic can test battery health with a hydrometer that measures acid density.\n\n' +
        '**How lithium-ion batteries work:** Lithium ions shuttle between graphite layers (anode) and metal oxide layers (cathode) during charge and discharge — like guests moving between two hotels. No metal lithium is present (unlike lithium metal batteries), which makes them safer.\n\n' +
        'Majuli, the world\'s largest river island, relies on solar-battery systems for off-grid power. As these lead-acid batteries age (3–5 years), disposal is a growing environmental challenge — the lead and sulphuric acid are toxic. Better battery recycling infrastructure is urgently needed across NE India.',
      intermediateContent:
        '**Battery performance metrics — what the numbers mean:**\n\n' +
        '| Metric | Unit | What it measures | Why it matters |\n' +
        '|--------|------|-----------------|----------------|\n' +
        '| **Voltage** | V | Electrical "pressure" | Higher V = fewer cells needed in series |\n' +
        '| **Capacity** | Ah | Total charge stored | 3 Ah at 1A = runs 3 hours |\n' +
        '| **Energy density** | Wh/kg | Energy per unit mass | Higher = lighter battery for same energy |\n' +
        '| **Power density** | W/kg | How fast energy can be delivered | High for car starting, low for slow discharge |\n' +
        '| **Cycle life** | cycles | Charge-discharge cycles before 80% capacity | Li-ion: 500–2000; lead-acid: 200–500 |\n' +
        '| **Self-discharge** | %/month | Charge lost sitting idle | Alkaline: ~2%; NiMH: ~30%; Li-ion: ~5% |\n\n' +
        '**Worked example — sizing a solar battery for a Majuli home:**\n\n' +
        'Daily load: 3 LED lights (10W each, 6 hours) + 1 phone charger (5W, 4 hours) + 1 fan (40W, 8 hours)\n\n' +
        '`Energy = (3×10×6) + (5×4) + (40×8) = 180 + 20 + 320 = **520 Wh/day**`\n\n' +
        'For a 12V lead-acid system with 50% depth of discharge (to preserve life):\n\n' +
        '`Capacity = 520 / (12 × 0.50) = **86.7 Ah** → use 100 Ah battery`\n\n' +
        'For 2 days of autonomy (cloudy weather backup): **200 Ah at 12V**.\n\n' +
        '**Why lithium-ion batteries degrade:**\n\n' +
        '| Degradation mechanism | What happens | Prevention |\n' +
        '|----------------------|-------------|------------|\n' +
        '| **SEI layer growth** | Solid-electrolyte interface thickens, consuming Li⁺ | Avoid high temperatures |\n' +
        '| **Lithium plating** | Li deposits as metal on anode (not intercalated) | Don\'t charge below 0°C |\n' +
        '| **Cathode cracking** | Volume changes crack oxide particles | Limit to 80% charge |\n' +
        '| **Electrolyte decomposition** | Organic solvents break down above 4.2V | Don\'t overcharge |',
      advancedContent:
        '**Nernst equation applied to batteries:**\n\n' +
        'The voltage of a battery changes with state of charge. For a lead-acid cell:\n\n' +
        'Overall: Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O\n\n' +
        '`E = E° − (RT/2F) ln([PbSO₄]²[H₂O]² / [H₂SO₄]²)`\n\n' +
        'As the battery discharges, [H₂SO₄] drops and E falls — this is why a dying car battery cranks slowly. At 25°C with E° = 2.05 V:\n\n' +
        '| State of charge | [H₂SO₄] (M) | Cell voltage (V) | Battery voltage (6 cells) |\n' +
        '|----------------|-------------|-----------------|-------------------------|\n' +
        '| 100% | 5.0 | 2.15 | 12.9 |\n' +
        '| 75% | 4.0 | 2.10 | 12.6 |\n' +
        '| 50% | 3.0 | 2.05 | 12.3 |\n' +
        '| 25% | 2.0 | 1.98 | 11.9 |\n' +
        '| Dead | 1.0 | 1.85 | 11.1 |\n\n' +
        '**Beyond lithium-ion — next-generation batteries:**\n\n' +
        '| Technology | Theoretical energy density | Status | Key challenge |\n' +
        '|-----------|--------------------------|--------|---------------|\n' +
        '| **Solid-state Li** | 400+ Wh/kg | Pilot production | Ceramic electrolyte cracking |\n' +
        '| **Lithium-sulfur** | 600 Wh/kg | Research | Polysulfide shuttling degrades capacity |\n' +
        '| **Sodium-ion** | 160 Wh/kg | Early commercial | Lower energy but abundant sodium |\n' +
        '| **Zinc-air** | 440 Wh/kg | Niche (hearing aids) | Poor rechargeability |\n' +
        '| **Aluminium-ion** | 1000+ Wh/kg | Lab stage | Cathode materials |\n\n' +
        '**Ragone plot** — the fundamental trade-off: energy density vs power density. Supercapacitors deliver power fast (10⁴ W/kg) but store little energy (~5 Wh/kg). Fuel cells store abundant energy (~1000 Wh/kg) but deliver it slowly. Lithium-ion batteries occupy the middle ground, which is why they dominate portable electronics and EVs.\n\n' +
        '**India\'s battery future:** The National Programme on Advanced Chemistry Cell (ACC) targets 50 GWh of domestic battery manufacturing by 2030. With NE India\'s hydropower surplus and proximity to rare earth deposits in Meghalaya, the region could become a hub for green battery manufacturing — turning a resource advantage into an industrial one.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each battery type to its key characteristic',
          pairs: [
            ['Alkaline (AA/AAA)', 'Primary cell — 1.5V, zinc anode, MnO₂ cathode, cannot be recharged'],
            ['Lead-acid', 'Rechargeable — 2.1V/cell, heavy (35 Wh/kg), used in car starters'],
            ['Lithium-ion', 'Rechargeable — 3.7V, high energy density (250 Wh/kg), phones and EVs'],
            ['Solid-state (future)', 'Ceramic electrolyte replaces flammable liquid — safer, higher density'],
          ],
        },
      },
    },
  ],
};
