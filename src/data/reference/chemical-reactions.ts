import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'chemical-reactions',
  title: 'Chemical Reactions',
  category: 'chemistry',
  icon: '⚗️',
  tagline:
    'Atoms rearrange, bonds break and form — the transformations that cook food and rust iron.',
  relatedStories: ['grandmothers-pitha', 'little-chef', 'firewalker', 'first-rice'],
  understand: [
    // ── Section 1: What Is a Chemical Reaction? ───────────────
    {
      title: 'What Is a Chemical Reaction?',
      beginnerContent:
        'Imagine you have a box of LEGO bricks snapped together as a car. You pull it apart and rebuild the same bricks into a helicopter. **No bricks were added or destroyed** — they just rearranged. That is exactly what happens in a chemical reaction: atoms are the bricks, and reactions snap them into new arrangements.\n\n' +
        'A **chemical reaction** transforms one or more substances (the **reactants**) into different substances (the **products**) by breaking old bonds and forming new ones.\n\n' +
        '| Feature | Physical change | Chemical change |\n' +
        '|---------|----------------|----------------|\n' +
        '| Identity | Substance stays the same | New substance formed |\n' +
        '| Reversibility | Usually easy to reverse | Often hard to reverse |\n' +
        '| Energy | Small energy change | Significant energy change |\n' +
        '| Example | Ice melting to water | Wood burning to ash and CO₂ |\n' +
        '| Example (Assam) | Grinding rice into flour | Fermenting rice into *apong* (rice beer) |\n\n' +
        'When you ferment rice to make *apong*, yeasts convert glucose (C₆H₁₂O₆) into ethanol (C₂H₅OH) and carbon dioxide (CO₂). The sweet taste disappears, alcohol appears, and CO₂ bubbles give the brew its fizz. **New substances with new properties** — that is the hallmark of a chemical reaction.\n\n' +
        '**How do you know a reaction happened?** Look for these clues:\n\n' +
        '| Sign | What it means | Everyday example |\n' +
        '|------|--------------|------------------|\n' +
        '| **Colour change** | New compound absorbs light differently | Copper turning green (patina) |\n' +
        '| **Gas produced** | A gaseous product forms | Dough rising (yeast releases CO₂) |\n' +
        '| **Precipitate** | An insoluble solid forms from two solutions | Lemon juice curdling milk |\n' +
        '| **Temperature change** | Energy released or absorbed | Hand warmers getting hot |\n' +
        '| **Light or sound** | Energy emitted dramatically | Fireworks exploding |\n\n' +
        '**Quick check:** When you dissolve sugar in water, is that a chemical or physical change?\n\n' +
        '*Physical — the sugar molecules are still C₁₂H₂₂O₁₁, just surrounded by water. You can evaporate the water and get the sugar back. No new substance was created.*\n\n' +
        '**The golden rule:** Atoms are never created or destroyed in a chemical reaction. This is the **law of conservation of mass**, established by Antoine Lavoisier in 1789. Every atom that goes in must come out — just rearranged into new molecules.',
      intermediateContent:
        '**Classifying reactions by what happens to electrons:**\n\n' +
        'Beyond the five basic types (covered in Section 3), chemists classify reactions by electron transfer:\n\n' +
        '| Category | What happens | Example |\n' +
        '|----------|-------------|--------|\n' +
        '| **Oxidation** | A substance *loses* electrons (or gains oxygen) | Fe → Fe²⁺ + 2e⁻ |\n' +
        '| **Reduction** | A substance *gains* electrons (or loses oxygen) | Cu²⁺ + 2e⁻ → Cu |\n' +
        '| **Redox** | Both happen simultaneously | Zn + Cu²⁺ → Zn²⁺ + Cu |\n' +
        '| **Acid-base** | Proton (H⁺) transfer | HCl + NaOH → NaCl + H₂O |\n\n' +
        'Remember: **OIL RIG** — Oxidation Is Loss, Reduction Is Gain (of electrons).\n\n' +
        '**Worked example — identifying a redox reaction:**\n\n' +
        'Rusting of iron: 4Fe + 3O₂ → 2Fe₂O₃\n\n' +
        '- Iron goes from oxidation state 0 to +3 → **oxidised** (lost electrons)\n' +
        '- Oxygen goes from 0 to −2 → **reduced** (gained electrons)\n' +
        '- This is a **redox reaction** — the iron bridges of the Brahmaputra valley corrode through exactly this process.\n\n' +
        '**Collision theory** explains *why* reactions happen: molecules must collide with (1) sufficient energy (≥ activation energy Eₐ) and (2) correct orientation. Only a tiny fraction of collisions are "effective." Increasing temperature, concentration, or surface area increases the fraction of effective collisions.',
      advancedContent:
        '**Reaction mechanisms — the step-by-step reality:**\n\n' +
        'Most reactions don\'t happen in a single step. They proceed through a series of **elementary steps**, each involving just 1–3 molecules.\n\n' +
        '| Concept | Definition | Why it matters |\n' +
        '|---------|-----------|---------------|\n' +
        '| **Elementary step** | A single molecular event | Each has its own rate law |\n' +
        '| **Intermediate** | Species produced in one step, consumed in another | Doesn\'t appear in overall equation |\n' +
        '| **Rate-determining step** | The slowest elementary step | Controls the overall reaction rate |\n' +
        '| **Molecularity** | Number of molecules in one elementary step | Unimolecular, bimolecular, termolecular |\n\n' +
        '**Example mechanism — decomposition of ozone:**\n\n' +
        'Overall: 2O₃ → 3O₂\n\n' +
        'Step 1 (fast): O₃ → O₂ + O (unimolecular)\n' +
        'Step 2 (slow): O₃ + O → 2O₂ (bimolecular — rate-determining)\n\n' +
        'Rate law from mechanism: rate = k[O₃][O]. The intermediate O doesn\'t appear in the overall equation but is critical to the mechanism.\n\n' +
        '**Transition state theory** (Eyring equation): k = (k_B T / h) · e^(−ΔG‡/RT), where ΔG‡ is the Gibbs free energy of activation. This links macroscopic rate constants to the microscopic energy landscape of molecular collisions.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Chemical or physical change?',
          pairs: [
            ['Burning wood', 'Chemical — new substances (CO₂, H₂O, ash) are formed'],
            ['Melting ice', 'Physical — H₂O remains H₂O, only state changes'],
            ['Fermenting rice into apong', 'Chemical — glucose becomes ethanol and CO₂'],
            ['Dissolving salt in water', 'Physical — NaCl dissociates but no new substance forms'],
            ['Rusting iron', 'Chemical — iron and oxygen form iron oxide (Fe₂O₃)'],
            ['Boiling tea', 'Physical — water evaporates, tea compounds remain'],
          ],
        },
      },
    },

    // ── Section 2: Balancing Chemical Equations ───────────────
    {
      title: 'Balancing Chemical Equations',
      diagram: 'BalancingEquationDiagram',
      beginnerContent:
        'A chemical equation is a shorthand recipe. Reactants go on the left of the arrow (→), products on the right. But like any recipe, the quantities must balance — you can\'t start with 6 eggs and end with 8.\n\n' +
        '**The problem:** H₂ + O₂ → H₂O looks right, but count the atoms:\n\n' +
        '| Element | Left side | Right side | Balanced? |\n' +
        '|---------|----------|------------|----------|\n' +
        '| Hydrogen | 2 | 2 | Yes |\n' +
        '| Oxygen | 2 | 1 | **No** |\n\n' +
        'We need to fix this without changing any chemical formula (never change subscripts — that changes the substance). Instead, we adjust **coefficients** (the numbers in front).\n\n' +
        '**Step-by-step method:**\n\n' +
        '1. Write the unbalanced equation with correct formulae\n' +
        '2. Count atoms of each element on both sides\n' +
        '3. Adjust coefficients, starting with the most complex molecule\n' +
        '4. Check every element balances\n' +
        '5. Reduce to the lowest whole-number ratio\n\n' +
        '**Worked example — burning hydrogen:**\n\n' +
        '| Step | Equation | H atoms | O atoms |\n' +
        '|------|---------|---------|--------|\n' +
        '| Unbalanced | H₂ + O₂ → H₂O | 2 = 2 ✓ | 2 ≠ 1 ✗ |\n' +
        '| Put 2 before H₂O | H₂ + O₂ → 2H₂O | 2 ≠ 4 ✗ | 2 = 2 ✓ |\n' +
        '| Put 2 before H₂ | **2H₂ + O₂ → 2H₂O** | **4 = 4 ✓** | **2 = 2 ✓** |\n\n' +
        '**Analogy:** Balancing equations is like balancing a see-saw. If one side is heavier (more atoms), you add weight (coefficients) to the other side until both sides match.\n\n' +
        '**Worked example — combustion of methane (natural gas):**\n\n' +
        '| Step | Equation | C | H | O |\n' +
        '|------|---------|---|---|---|\n' +
        '| Start | CH₄ + O₂ → CO₂ + H₂O | 1=1 ✓ | 4≠2 ✗ | 2≠3 ✗ |\n' +
        '| Fix H: put 2 before H₂O | CH₄ + O₂ → CO₂ + 2H₂O | 1=1 ✓ | 4=4 ✓ | 2≠4 ✗ |\n' +
        '| Fix O: put 2 before O₂ | **CH₄ + 2O₂ → CO₂ + 2H₂O** | **1=1 ✓** | **4=4 ✓** | **4=4 ✓** |\n\n' +
        'This balanced equation tells you that 1 molecule of methane needs exactly 2 molecules of oxygen. Scale up to moles: 16 g of methane needs 64 g of oxygen. This is practical knowledge for designing efficient *chulhas* (cookstoves) used across rural Assam.',
      intermediateContent:
        '**Balancing harder equations — the algebraic method:**\n\n' +
        'For complex equations, assign variables to each coefficient and solve.\n\n' +
        '**Example:** Balance Fe₂O₃ + CO → Fe + CO₂\n\n' +
        'Assign: aFe₂O₃ + bCO → cFe + dCO₂\n\n' +
        '| Element | Equation |\n' +
        '|---------|----------|\n' +
        '| Fe | 2a = c |\n' +
        '| O | 3a + b = 2d |\n' +
        '| C | b = d |\n\n' +
        'Set a = 1: c = 2, b = d. From O: 3 + b = 2b → b = 3, d = 3.\n\n' +
        'Result: **Fe₂O₃ + 3CO → 2Fe + 3CO₂**\n\n' +
        'This is the reaction inside a blast furnace — carbon monoxide reduces iron ore to pure iron.\n\n' +
        '**Ionic equations** show only the species that actually change. For AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq):\n\n' +
        '| Type | Equation |\n' +
        '|------|----------|\n' +
        '| Full molecular | AgNO₃ + NaCl → AgCl + NaNO₃ |\n' +
        '| Full ionic | Ag⁺ + NO₃⁻ + Na⁺ + Cl⁻ → AgCl(s) + Na⁺ + NO₃⁻ |\n' +
        '| Net ionic | **Ag⁺ + Cl⁻ → AgCl(s)** |\n\n' +
        'Na⁺ and NO₃⁻ are **spectator ions** — they appear on both sides unchanged.',
      advancedContent:
        '**Balancing redox equations using half-reactions:**\n\n' +
        '1. Split into oxidation and reduction half-reactions\n' +
        '2. Balance atoms (non-O, non-H first, then O with H₂O, then H with H⁺)\n' +
        '3. Balance charge with electrons\n' +
        '4. Equalise electrons in both half-reactions\n' +
        '5. Add and cancel\n\n' +
        '**Worked example:** Balance MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic solution)\n\n' +
        '| Half-reaction | Steps | Result |\n' +
        '|---------------|-------|--------|\n' +
        '| Reduction | MnO₄⁻ → Mn²⁺ | MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O |\n' +
        '| Oxidation | Fe²⁺ → Fe³⁺ | Fe²⁺ → Fe³⁺ + e⁻ |\n' +
        '| Multiply oxidation ×5 | | 5Fe²⁺ → 5Fe³⁺ + 5e⁻ |\n' +
        '| **Add** | | **MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺** |\n\n' +
        'Check: Mn (1=1), O (4=4), H (8=8), Fe (5=5), charge: (−1+8+10)=+17 = (+2+0+15)=+17 ✓\n\n' +
        'This permanganate titration is a standard analytical technique — the deep purple MnO₄⁻ turns colourless at the endpoint, providing a built-in indicator.',
    },

    // ── Section 3: Types of Reactions ─────────────────────────
    {
      title: 'Types of Reactions',
      diagram: 'ReactionTypesDiagram',
      beginnerContent:
        'Chemical reactions can be classified into five major types. Think of them as five "storylines" that atoms follow.\n\n' +
        '| Type | Pattern | Analogy | Example |\n' +
        '|------|---------|---------|--------|\n' +
        '| **Synthesis** | A + B → AB | Two people marry | 2Na + Cl₂ → 2NaCl |\n' +
        '| **Decomposition** | AB → A + B | A couple divorces | CaCO₃ → CaO + CO₂ |\n' +
        '| **Single replacement** | A + BC → AC + B | A rival steals a partner | Zn + CuSO₄ → ZnSO₄ + Cu |\n' +
        '| **Double replacement** | AB + CD → AD + CB | Two couples swap partners | AgNO₃ + NaCl → AgCl + NaNO₃ |\n' +
        '| **Combustion** | Fuel + O₂ → CO₂ + H₂O | Burning anything | CH₄ + 2O₂ → CO₂ + 2H₂O |\n\n' +
        '**Synthesis** — building up. When iron is exposed to oxygen and moisture in the humid Brahmaputra valley, they combine: 4Fe + 3O₂ → 2Fe₂O₃ (rust). This is why bridges and railway lines in Assam need constant anti-corrosion treatment.\n\n' +
        '**Decomposition** — breaking apart. Heating limestone (calcium carbonate) breaks it down: CaCO₃ → CaO + CO₂. Quicklime (CaO) is used in traditional construction across Northeast India and in *paan* (betel nut preparation).\n\n' +
        '**Single replacement** — a bully displaces a weaker element. Drop zinc into blue copper sulfate solution: Zn + CuSO₄ → ZnSO₄ + Cu. The solution turns colourless as reddish copper metal deposits out. Zinc is more reactive than copper — it wins the competition.\n\n' +
        '**The reactivity series** predicts who wins:\n\n' +
        '| Most reactive → | | | | Least reactive |\n' +
        '|---|---|---|---|---|\n' +
        '| K, Na, Ca, Mg, Al | Zn, Fe | Ni, Sn, Pb | **H** | Cu, Ag, Au, Pt |\n' +
        '| React with cold water | React with steam/acid | React with acid only | Reference | Don\'t react with acid |\n\n' +
        'Any metal higher in the series can displace a lower metal from its compound.\n\n' +
        '**Double replacement** — two compounds swap ions. Mix silver nitrate and sodium chloride solutions: AgNO₃ + NaCl → AgCl↓ + NaNO₃. The white precipitate of silver chloride drops to the bottom.\n\n' +
        '**Combustion** — the fire reaction. The traditional *meji* (bonfire) lit during Assam\'s Magh Bihu festival is combustion on a grand scale — dry bamboo, hay, and thatch react with oxygen: C₆H₁₀O₅ + 6O₂ → 6CO₂ + 5H₂O + energy (heat and light).\n\n' +
        '**Complete vs incomplete combustion:**\n\n' +
        '| Condition | Products | Flame colour | Danger |\n' +
        '|-----------|---------|-------------|--------|\n' +
        '| Plenty of O₂ (complete) | CO₂ + H₂O | Blue | None |\n' +
        '| Limited O₂ (incomplete) | CO + H₂O + soot | Yellow/orange | **CO is toxic** |\n\n' +
        'A well-adjusted gas flame burns blue. A yellow, sooty flame means incomplete combustion — dangerous in enclosed kitchens.',
      intermediateContent:
        '**Predicting products — a systematic approach:**\n\n' +
        '| Given | Steps to predict products |\n' +
        '|-------|-------------------------|\n' +
        '| Metal + nonmetal | → Ionic compound (use charges to write formula) |\n' +
        '| Metal + acid | → Salt + H₂ (if metal is above H in reactivity series) |\n' +
        '| Acid + base | → Salt + water (neutralisation) |\n' +
        '| Metal carbonate + acid | → Salt + H₂O + CO₂ |\n' +
        '| Hydrocarbon + O₂ | → CO₂ + H₂O (complete combustion) |\n\n' +
        '**Worked example — what happens when you add hydrochloric acid to sodium carbonate?**\n\n' +
        'Pattern: Metal carbonate + acid → salt + water + CO₂\n\n' +
        'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑\n\n' +
        'The fizzing (CO₂ gas) is the classic "acid test" used to identify carbonates in rocks and minerals.\n\n' +
        '**Precipitation reactions and solubility rules:**\n\n' +
        '| Ion | Soluble? | Exception |\n' +
        '|-----|----------|----------|\n' +
        '| Na⁺, K⁺, NH₄⁺ | **Always** soluble | None |\n' +
        '| NO₃⁻ | **Always** soluble | None |\n' +
        '| Cl⁻ | Usually soluble | AgCl, PbCl₂ are insoluble |\n' +
        '| SO₄²⁻ | Usually soluble | BaSO₄, PbSO₄ are insoluble |\n' +
        '| OH⁻ | Usually insoluble | NaOH, KOH, Ca(OH)₂ are soluble |\n' +
        '| CO₃²⁻ | Usually insoluble | Na₂CO₃, K₂CO₃ are soluble |',
      advancedContent:
        '**Thermite reaction — extreme single replacement:**\n\n' +
        '2Al + Fe₂O₃ → Al₂O₃ + 2Fe (ΔH = −851 kJ/mol)\n\n' +
        'Aluminium is so reactive it displaces iron from its oxide, releasing enough heat (>2500°C) to melt the iron produced. This reaction is used to weld railway tracks — including on the Northeast Frontier Railway lines across Assam.\n\n' +
        '**Disproportionation** — a species is simultaneously oxidised and reduced:\n\n' +
        '2H₂O₂ → 2H₂O + O₂\n\n' +
        'The oxygen in H₂O₂ (oxidation state −1) is split: some goes to −2 (in H₂O, reduced) and some goes to 0 (in O₂, oxidised). This is how hydrogen peroxide decomposes — the bubbles you see when you pour it on a wound are O₂.\n\n' +
        '**Comproportionation** — the reverse: two different oxidation states of the same element combine into one intermediate state.\n\n' +
        'These nuances matter in electrochemistry, biochemistry, and industrial synthesis.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Classify each reaction by type',
          pairs: [
            ['2Mg + O₂ → 2MgO', 'Synthesis — two substances combine into one'],
            ['2H₂O → 2H₂ + O₂', 'Decomposition — one substance breaks into two'],
            ['Fe + CuSO₄ → FeSO₄ + Cu', 'Single replacement — iron displaces copper'],
            ['BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl', 'Double replacement — ions swap partners'],
            ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'Combustion — fuel burns in oxygen'],
          ],
        },
      },
    },

    // ── Section 4: Energy in Reactions ─────────────────────────
    {
      title: 'Energy in Reactions',
      diagram: 'EnergyProfileDiagram',
      beginnerContent:
        'Every chemical reaction involves an energy tug-of-war. **Breaking bonds costs energy** (like pulling apart magnets). **Forming bonds releases energy** (like magnets snapping together). The winner of this tug-of-war determines whether the reaction heats up or cools down.\n\n' +
        '| Reaction type | Bond energy balance | Temperature effect | Symbol |\n' +
        '|---------------|--------------------|--------------------|--------|\n' +
        '| **Exothermic** | Energy released > energy absorbed | Surroundings get **warmer** | ΔH is **negative** |\n' +
        '| **Endothermic** | Energy absorbed > energy released | Surroundings get **cooler** | ΔH is **positive** |\n\n' +
        '**Exothermic examples — reactions that release heat:**\n\n' +
        '| Reaction | ΔH (kJ/mol) | Where you see it |\n' +
        '|----------|-------------|------------------|\n' +
        '| Burning methane: CH₄ + 2O₂ → CO₂ + 2H₂O | −890 | Gas stove cooking rice |\n' +
        '| Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O | −2803 | Your body staying warm |\n' +
        '| Neutralisation: HCl + NaOH → NaCl + H₂O | −57 | Antacid relieving acidity |\n' +
        '| Rusting: 4Fe + 3O₂ → 2Fe₂O₃ | −1648 | Bridges corroding in Assam\'s humidity |\n\n' +
        '**Endothermic examples — reactions that absorb heat:**\n\n' +
        '| Reaction | ΔH (kJ/mol) | Where you see it |\n' +
        '|----------|-------------|------------------|\n' +
        '| Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ | +2803 | Tea gardens of Assam capturing sunlight |\n' +
        '| Dissolving NH₄NO₃ in water | +26 | Instant cold packs |\n' +
        '| Thermal decomposition: CaCO₃ → CaO + CO₂ | +178 | Lime kilns in NE India |\n\n' +
        '**Activation energy (Eₐ)** — the "push to start."\n\n' +
        'Even exothermic reactions need a small energy kick to begin. Think of a boulder on a hilltop — you push it over the edge (activation energy), and then it rolls downhill on its own (energy released). A match provides the activation energy to ignite paper; once burning, the paper releases enough energy to keep going.\n\n' +
        '**Try the diagram above** — toggle between exothermic and endothermic profiles to see how the energy levels differ.',
      intermediateContent:
        '**Calculating energy changes from bond energies:**\n\n' +
        'ΔH = Σ(bonds broken) − Σ(bonds formed)\n\n' +
        '**Worked example — combustion of methane:**\n\n' +
        '| Bonds broken (reactants) | Bond energy (kJ/mol) | Count | Total |\n' +
        '|--------------------------|---------------------|-------|-------|\n' +
        '| C−H in CH₄ | 413 | 4 | 1652 |\n' +
        '| O=O in O₂ | 498 | 2 | 996 |\n' +
        '| **Total energy in** | | | **2648** |\n\n' +
        '| Bonds formed (products) | Bond energy (kJ/mol) | Count | Total |\n' +
        '|-------------------------|---------------------|-------|-------|\n' +
        '| C=O in CO₂ | 804 | 2 | 1608 |\n' +
        '| O−H in H₂O | 463 | 4 | 1852 |\n' +
        '| **Total energy out** | | | **3460** |\n\n' +
        'ΔH = 2648 − 3460 = **−812 kJ/mol** (exothermic)\n\n' +
        'The actual value is −890 kJ/mol — bond energy calculations are approximate because they use average values.\n\n' +
        '**Hess\'s Law:** The total enthalpy change is the same regardless of the route taken. If you can\'t measure a reaction directly, you can calculate it from other known reactions.\n\n' +
        '| Law | Statement |\n' +
        '|-----|-----------|\n' +
        '| Hess\'s Law | ΔH(overall) = ΔH₁ + ΔH₂ + ... (for any route) |\n' +
        '| Standard enthalpy of formation | ΔH°f = energy to form 1 mol of compound from elements in standard states |\n' +
        '| Using formation enthalpies | ΔH°rxn = Σ ΔH°f(products) − Σ ΔH°f(reactants) |',
      advancedContent:
        '**Gibbs free energy — will a reaction happen spontaneously?**\n\n' +
        'Enthalpy alone doesn\'t decide. You also need **entropy** (S) — the disorder of the system.\n\n' +
        '**ΔG = ΔH − TΔS**\n\n' +
        '| ΔH | ΔS | ΔG | Spontaneous? |\n' +
        '|-----|-----|-----|-------------|\n' +
        '| − (exothermic) | + (more disorder) | Always − | **Yes, at all temperatures** |\n' +
        '| − (exothermic) | − (less disorder) | − at low T | Only at **low temperatures** |\n' +
        '| + (endothermic) | + (more disorder) | − at high T | Only at **high temperatures** |\n' +
        '| + (endothermic) | − (less disorder) | Always + | **Never spontaneous** |\n\n' +
        '**Worked example:** Decomposition of CaCO₃: ΔH = +178 kJ/mol, ΔS = +161 J/(mol·K)\n\n' +
        'ΔG = 0 when T = ΔH/ΔS = 178,000/161 = **1106 K (833°C)**\n\n' +
        'Below 833°C, ΔG > 0 (non-spontaneous). Above 833°C, ΔG < 0 (spontaneous). This is exactly why lime kilns must operate at high temperatures.\n\n' +
        '**Coupling reactions:** Non-spontaneous reactions can be driven by coupling them to spontaneous ones. ATP hydrolysis (ΔG = −30.5 kJ/mol) drives hundreds of otherwise non-spontaneous biosynthetic reactions in your cells.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Exothermic or endothermic?',
          pairs: [
            ['Burning wood in a meji bonfire', 'Exothermic — releases heat and light (ΔH < 0)'],
            ['Photosynthesis in tea plants', 'Endothermic — absorbs sunlight to build glucose (ΔH > 0)'],
            ['Dissolving ammonium nitrate (cold pack)', 'Endothermic — absorbs heat, feels cold (ΔH > 0)'],
            ['Neutralising stomach acid with antacid', 'Exothermic — releases heat (ΔH < 0)'],
            ['Cooking rice (starch gelatinisation)', 'Endothermic — requires continuous heat input (ΔH > 0)'],
          ],
        },
      },
    },

    // ── Section 5: Stoichiometry ──────────────────────────────
    {
      title: 'Stoichiometry — Balancing and Calculating',
      beginnerContent:
        'Stoichiometry is the **recipe maths** of chemistry. Just as a recipe says "2 cups flour + 3 eggs → 12 pancakes," a balanced equation says "1 mol CH₄ + 2 mol O₂ → 1 mol CO₂ + 2 mol H₂O."\n\n' +
        'The word comes from Greek: *stoicheion* (element) + *metron* (measure). It answers the question: **how much of each substance do I need, and how much will I get?**\n\n' +
        '**The mole** — the chemist\'s counting unit:\n\n' +
        '| Unit | Counts | How many |\n' +
        '|------|--------|----------|\n' +
        '| A pair | Shoes, socks | 2 |\n' +
        '| A dozen | Eggs, bananas | 12 |\n' +
        '| A **mole** | Atoms, molecules | 6.022 × 10²³ |\n\n' +
        'Why such a huge number? Because atoms are incredibly tiny. One mole of any substance contains Avogadro\'s number (6.022 × 10²³) of particles — and the mass of one mole in grams equals the substance\'s **molar mass** (from the periodic table).\n\n' +
        '| Substance | Formula | Molar mass | 1 mole looks like... |\n' +
        '|-----------|---------|-----------|---------------------|\n' +
        '| Water | H₂O | 18 g/mol | About 1 tablespoon |\n' +
        '| Carbon dioxide | CO₂ | 44 g/mol | 22.4 L of gas at STP |\n' +
        '| Iron | Fe | 56 g/mol | A small nail |\n' +
        '| Table salt | NaCl | 58.5 g/mol | ~4 tablespoons |\n\n' +
        '**The stoichiometric workflow:**\n\n' +
        '1. **Write** the balanced equation\n' +
        '2. **Convert** given mass to moles (divide by molar mass)\n' +
        '3. **Use** mole ratios from the equation\n' +
        '4. **Convert** moles back to grams (multiply by molar mass)\n\n' +
        '**Worked example:** How many grams of CO₂ are produced by burning 32 g of methane?\n\n' +
        '| Step | Calculation | Result |\n' +
        '|------|------------|--------|\n' +
        '| Balanced equation | CH₄ + 2O₂ → CO₂ + 2H₂O | Ratio CH₄:CO₂ = 1:1 |\n' +
        '| Mass → moles | 32 g ÷ 16 g/mol | 2 mol CH₄ |\n' +
        '| Mole ratio | 2 mol CH₄ × (1 mol CO₂ / 1 mol CH₄) | 2 mol CO₂ |\n' +
        '| Moles → mass | 2 mol × 44 g/mol | **88 g CO₂** |\n\n' +
        'Check: 32 g CH₄ + 128 g O₂ = 88 g CO₂ + 72 g H₂O → 160 g in = 160 g out ✓ (conservation of mass)\n\n' +
        '**Why this matters:** A single LPG cylinder (14.2 kg) produces about 42 kg of CO₂ when fully burned. Stoichiometry lets you calculate the carbon footprint of cooking every meal.',
      intermediateContent:
        '**The limiting reagent — the sandwich analogy:**\n\n' +
        'If you have 10 slices of bread and 3 slices of cheese, you can only make 3 sandwiches. Cheese is the **limiting reagent** — it runs out first. Bread is in **excess** — 4 slices left over.\n\n' +
        '**Worked example:** You have 32 g of CH₄ and 80 g of O₂. How much CO₂ forms?\n\n' +
        '| Step | CH₄ | O₂ |\n' +
        '|------|------|-----|\n' +
        '| Given mass | 32 g | 80 g |\n' +
        '| Moles | 32/16 = 2 mol | 80/32 = 2.5 mol |\n' +
        '| Moles needed (from equation) | 2 mol needs 4 mol O₂ | 2.5 mol needs 1.25 mol CH₄ |\n' +
        '| Available? | Have 2.5 < 4 → **O₂ is limiting** | Have 2 > 1.25 → CH₄ in excess |\n\n' +
        'O₂ limits: 2.5 mol O₂ × (1 mol CO₂ / 2 mol O₂) = 1.25 mol CO₂ = **55 g CO₂**\n\n' +
        'CH₄ left over: 2 − 1.25 = 0.75 mol = 12 g unreacted.\n\n' +
        '**Percent yield** — real life vs theory:\n\n' +
        '| Term | Formula | Meaning |\n' +
        '|------|---------|--------|\n' +
        '| Theoretical yield | From stoichiometry | Maximum possible product |\n' +
        '| Actual yield | Measured in lab | What you actually get |\n' +
        '| **Percent yield** | (actual / theoretical) × 100% | Efficiency of the reaction |\n\n' +
        '**Worked example:** A student burns 16 g of CH₄ and collects 38 g of CO₂ (theoretical: 44 g).\n\n' +
        'Percent yield = (38/44) × 100% = **86.4%** — some CO₂ escaped or some methane didn\'t fully combust.',
      advancedContent:
        '**Multi-step synthesis and atom economy:**\n\n' +
        'In multi-step synthesis, overall yield = product of individual step yields:\n\n' +
        '| Steps | Yield per step | Overall yield |\n' +
        '|-------|---------------|---------------|\n' +
        '| 2 | 90% | 0.9² = 81% |\n' +
        '| 3 | 90% | 0.9³ = 72.9% |\n' +
        '| 5 | 80% | 0.8⁵ = **32.8%** |\n' +
        '| 10 | 80% | 0.8¹⁰ = **10.7%** |\n\n' +
        'This is why pharmaceutical synthesis targets the fewest steps possible.\n\n' +
        '**Atom economy** (Trost, 1991) measures how much of the reactant mass ends up in the desired product:\n\n' +
        'Atom economy = (mass of desired product / total mass of all products) × 100%\n\n' +
        '| Reaction | Atom economy | Verdict |\n' +
        '|----------|-------------|--------|\n' +
        '| H₂ + Cl₂ → 2HCl | 100% | Perfect — everything is useful |\n' +
        '| CH₃Br + NaOH → CH₃OH + NaBr | 32/126 = 25.4% | Poor — NaBr is waste |\n\n' +
        'High atom economy is a key principle of **green chemistry** — fewer waste by-products, less environmental impact.\n\n' +
        '**Gas stoichiometry:** At STP (0°C, 1 atm), 1 mol of any ideal gas occupies **22.4 L**. So for gases, volume ratios equal mole ratios directly. At the tea factories of upper Assam, knowing gas volumes helps calculate how much fuel is needed to fire the drying ovens.',
      interactive: {
        type: 'python-playground' as const,
        props: {
          starterCode: '# Stoichiometry calculator\n# CH4 + 2O2 -> CO2 + 2H2O\n\n# Molar masses (g/mol)\nM_CH4 = 16\nM_O2 = 32\nM_CO2 = 44\nM_H2O = 18\n\n# Given masses (try changing these!)\nmass_CH4 = 32  # grams\nmass_O2 = 80   # grams\n\n# Convert to moles\nmol_CH4 = mass_CH4 / M_CH4\nmol_O2 = mass_O2 / M_O2\n\nprint(f"Moles CH4: {mol_CH4}")\nprint(f"Moles O2:  {mol_O2}")\n\n# Find limiting reagent (need 2 mol O2 per 1 mol CH4)\nO2_needed = mol_CH4 * 2\nCH4_needed = mol_O2 / 2\n\nif O2_needed > mol_O2:\n    print(f"\\nO2 is LIMITING (need {O2_needed} mol, have {mol_O2})")\n    mol_CO2 = mol_O2 / 2\n    mol_H2O = mol_O2\nelse:\n    print(f"\\nCH4 is LIMITING (need {CH4_needed} mol, have {mol_CH4})")\n    mol_CO2 = mol_CH4\n    mol_H2O = mol_CH4 * 2\n\nprint(f"\\nProducts:")\nprint(f"  CO2: {mol_CO2} mol = {mol_CO2 * M_CO2} g")\nprint(f"  H2O: {mol_H2O} mol = {mol_H2O * M_H2O} g")\nprint(f"\\nMass check: {mass_CH4} + {mass_O2} = {mass_CH4 + mass_O2} g in")\nprint(f"            {mol_CO2*M_CO2} + {mol_H2O*M_H2O} = {mol_CO2*M_CO2 + mol_H2O*M_H2O} g out")',
          title: 'Try it — Stoichiometry Calculator',
        },
      },
    },

    // ── Section 6: Catalysts and Reaction Rate ────────────────
    {
      title: 'Catalysts and Reaction Rate',
      beginnerContent:
        'A **catalyst** is like a shortcut through a mountain. Instead of climbing over the peak (high activation energy), you go through a tunnel (lower activation energy). You still start and end at the same places — the catalyst just makes the journey faster.\n\n' +
        '| Without catalyst | With catalyst |\n' +
        '|-----------------|---------------|\n' +
        '| High activation energy barrier | Lower activation energy barrier |\n' +
        '| Slow reaction | Fast reaction |\n' +
        '| Same products, same energy change | Same products, same energy change |\n\n' +
        'Key point: catalysts are **not consumed** — they participate in the mechanism but are regenerated at the end, ready for another cycle.\n\n' +
        '**Famous catalysts:**\n\n' +
        '| Catalyst | Reaction | Impact |\n' +
        '|----------|---------|--------|\n' +
        '| Iron (+ KOH) | Haber process: N₂ + 3H₂ → 2NH₃ | Makes fertiliser for rice paddies of the Brahmaputra valley |\n' +
        '| Platinum, palladium, rhodium | Catalytic converter in cars | Converts toxic CO, NOₓ into harmless CO₂, N₂ |\n' +
        '| Vanadium pentoxide (V₂O₅) | Contact process: 2SO₂ + O₂ → 2SO₃ | Makes sulfuric acid (most produced chemical) |\n' +
        '| **Enzymes** | Every reaction in your body | Speed up reactions by factors of 10⁶ to 10¹² |\n\n' +
        '**Enzymes** are nature\'s catalysts — proteins with precisely shaped **active sites** that bind specific molecules (substrates) like a lock and key.\n\n' +
        '| Enzyme | Substrate | Product | Where |\n' +
        '|--------|-----------|---------|-------|\n' +
        '| Amylase | Starch | Sugars (maltose) | Your saliva |\n' +
        '| Lactase | Lactose (milk sugar) | Glucose + galactose | Small intestine |\n' +
        '| Zymase (in yeast) | Glucose | Ethanol + CO₂ | Fermenting *apong* and bread |\n' +
        '| Pepsin | Proteins | Peptides | Stomach (pH 1.5–2) |\n\n' +
        '**Beyond catalysts — four factors that affect reaction rate:**\n\n' +
        '| Factor | Effect | Analogy |\n' +
        '|--------|--------|--------|\n' +
        '| **Temperature ↑** | Molecules move faster → more and harder collisions | People running in a crowd bump more |\n' +
        '| **Concentration ↑** | More molecules per volume → more collisions | More people in a room → more bumping |\n' +
        '| **Surface area ↑** | More exposed surface → more contact points | Powdered sugar dissolves faster than a cube |\n' +
        '| **Catalyst added** | Lower activation energy → more collisions succeed | A tunnel through the mountain |\n\n' +
        '**Quick check:** Why does a lump of sugar dissolve slowly in tea, but powdered sugar dissolves almost instantly?\n\n' +
        '*Same substance, same reaction — but powdered sugar has vastly more surface area exposed to the tea. More contact points = faster dissolving.*',
      intermediateContent:
        '**Rate laws and reaction order:**\n\n' +
        'The **rate law** expresses how rate depends on concentration:\n\n' +
        'rate = k[A]ᵐ[B]ⁿ\n\n' +
        'where k is the rate constant, and m, n are the **reaction orders** (determined experimentally, NOT from the balanced equation).\n\n' +
        '| Order | Rate law | How rate changes when [A] doubles | Graph: [A] vs time |\n' +
        '|-------|---------|----------------------------------|-------------------|\n' +
        '| Zero | rate = k | No change | Linear decrease |\n' +
        '| First | rate = k[A] | Doubles | Exponential decay |\n' +
        '| Second | rate = k[A]² | Quadruples | 1/[A] is linear |\n\n' +
        '**Half-life** — the time for half the reactant to be consumed:\n\n' +
        '| Order | Half-life formula | Depends on [A]₀? |\n' +
        '|-------|------------------|------------------|\n' +
        '| Zero | t½ = [A]₀ / (2k) | Yes — shorter at lower concentrations |\n' +
        '| First | t½ = ln 2 / k = 0.693/k | **No** — constant regardless of amount |\n' +
        '| Second | t½ = 1 / (k[A]₀) | Yes — longer at lower concentrations |\n\n' +
        '**The Arrhenius equation** quantifies the temperature dependence:\n\n' +
        'k = A · e^(−Eₐ/RT)\n\n' +
        'A = frequency factor, Eₐ = activation energy, R = 8.314 J/(mol·K), T = temperature in Kelvin.\n\n' +
        '**Rule of thumb:** For many reactions, a 10°C increase roughly **doubles** the rate (because the exponential term is very sensitive to temperature).',
      advancedContent:
        '**Enzyme kinetics — the Michaelis-Menten model:**\n\n' +
        'v = V_max[S] / (K_m + [S])\n\n' +
        '| Parameter | Meaning | Interpretation |\n' +
        '|-----------|---------|---------------|\n' +
        '| v | Reaction velocity | Rate at a given [S] |\n' +
        '| V_max | Maximum velocity | All enzyme active sites saturated |\n' +
        '| K_m | Michaelis constant | [S] at which v = V_max/2 |\n' +
        '| Low K_m | High substrate affinity | Enzyme binds substrate tightly |\n' +
        '| High K_m | Low substrate affinity | Enzyme needs lots of substrate |\n\n' +
        '**Enzyme inhibition types:**\n\n' +
        '| Type | Binds to | Effect on V_max | Effect on K_m |\n' +
        '|------|---------|----------------|---------------|\n' +
        '| **Competitive** | Active site | Unchanged | Increases (appears weaker) |\n' +
        '| **Non-competitive** | Allosteric site | Decreases | Unchanged |\n' +
        '| **Uncompetitive** | ES complex only | Decreases | Decreases |\n\n' +
        'Many drugs work as enzyme inhibitors: aspirin inhibits cyclooxygenase (COX), statins inhibit HMG-CoA reductase (cholesterol synthesis), and HIV protease inhibitors block the viral enzyme that processes viral proteins.\n\n' +
        '**Industrial catalysis — the Haber process optimised:**\n\n' +
        'N₂ + 3H₂ ⇌ 2NH₃ (ΔH = −92 kJ/mol)\n\n' +
        '| Factor | Le Châtelier prediction | Practical choice | Why |\n' +
        '|--------|------------------------|-----------------|-----|\n' +
        '| Temperature | Low T favours products | 450°C | Below this, reaction is too slow even with catalyst |\n' +
        '| Pressure | High P favours products (fewer moles) | 200 atm | Higher is better but equipment cost limits it |\n' +
        '| Catalyst | No effect on equilibrium position | Iron + KOH promoter | Makes 450°C viable instead of needing >1000°C |\n' +
        '| Yield | | ~15% per pass | Unreacted gases recycled; overall ~98% conversion |',
    },
  ],
};
