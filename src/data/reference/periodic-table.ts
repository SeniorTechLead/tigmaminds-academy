import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'periodic-table',
  title: 'The Periodic Table',
  category: 'chemistry',
  icon: '⚗️',
  tagline:
    'The map of all matter — 118 elements organized by their deepest properties.',
  relatedStories: ['why-the-muga-silk-is-golden', 'little-potter'],
  understand: [
    {
      title: 'How the Table Is Organized',
      beginnerContent:
        'The periodic table arranges all known elements in order of increasing atomic number — from hydrogen (1) to oganesson (118) — in a grid of rows and columns. The seven horizontal rows are called periods. As you move across a period from left to right, electrons fill the same outermost shell: period 1 fills the first shell (2 elements), period 2 fills the second shell (8 elements), period 3 fills the third shell (8 elements), and so on. When a shell is complete, the next element starts a new period on the left-hand side. The 18 vertical columns are called groups. Elements in the same group have the same number of valence electrons and therefore behave in chemically similar ways — this is the core insight that makes the table so powerful.\n\nThe Russian chemist Dmitri Mendeleev published his first periodic table in 1869, arranging the 63 elements known at the time by atomic mass and grouping those with similar properties. His genius was recognising gaps in the pattern and boldly predicting that unknown elements would fill them. He predicted the properties of three missing elements — which he called eka-boron, eka-aluminium, and eka-silicon — with remarkable accuracy. When gallium was discovered in 1875 and matched his eka-aluminium predictions almost exactly, the scientific world was convinced. Mendeleev even corrected the accepted atomic masses of some elements because they did not fit the periodic pattern — and he turned out to be right.\n\nThe modern table uses atomic number (proton count) rather than atomic mass, which resolved a few inconsistencies in Mendeleev\'s arrangement. The table\'s shape reflects the underlying quantum mechanics of electron filling: the s-block (groups 1-2) on the left, the p-block (groups 13-18) on the right, the d-block (groups 3-12, the transition metals) in the middle, and the f-block (lanthanides and actinides) typically shown as two rows below the main table. This structure is not arbitrary — it emerges directly from the order in which electron orbitals fill, making the periodic table both a practical reference and a map of quantum physics.',
      intermediateContent:
        'The periodic table’s structure follows the **Aufbau principle** (electrons fill orbitals from lowest to highest energy), the **Pauli exclusion principle** (no two electrons share the same four quantum numbers), and **Hund’s rule** (electrons occupy degenerate orbitals singly before pairing). The filling order is 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p — explaining why the d-block (transition metals) appears in period 4 and the f-block (lanthanides/actinides) in period 6. **Effective nuclear charge** Z_eff = Z − σ (where σ is the shielding constant from Slater’s rules) explains periodic trends: across a period Z_eff increases (more protons, same shielding) so atoms shrink and ionisation energy rises; down a group, new shells add distance and shielding, so atoms grow and ionisation energy falls.',
      advancedContent:
        'The periodic table’s limits are being tested by superheavy element synthesis. Elements 113–118 (nihonium through oganesson) were confirmed between 2002 and 2016, created by accelerating ions into heavy-element targets in particle accelerators. Oganesson (Z = 118) exists for less than a millisecond before decaying. **Relativistic effects** become significant for heavy elements: inner electrons travel at appreciable fractions of the speed of light, contracting s- and p-orbitals and expanding d- and f-orbitals. This explains why gold is gold-coloured (a relativistic shift in electron absorption) and why mercury is liquid at room temperature (weak metallic bonding due to contracted 6s orbitals). Theoretical predictions suggest element 120 (unbinilium) might begin a g-block if synthesised, and that element 164 could be an island of relative stability among superheavy nuclei.',
      diagram: 'PeriodicTableOverviewDiagram',
    },
    {
      title: 'Reading an Element Box',
      beginnerContent:
        'Each element on the periodic table is displayed in a box containing key information. At the top is the atomic number (Z), the number of protons in the nucleus. The large letter(s) in the centre is the chemical symbol — one or two letters, always with the first capitalised: H for hydrogen, Fe for iron (from the Latin "ferrum"), Au for gold (from "aurum"). Below the symbol is the element\'s full name, and at the bottom is the atomic mass in atomic mass units (amu), which is the weighted average of all naturally occurring isotopes. Some boxes also show the electron configuration or the most common oxidation states.\n\nLet us walk through iron (Fe) as an example. Iron sits at atomic number 26, meaning every iron atom has 26 protons. Its atomic mass is 55.845 amu, reflecting a mix of four stable isotopes: iron-54 (5.8%), iron-56 (91.7%), iron-57 (2.2%), and iron-58 (0.3%). Iron is in period 4 (its outermost electrons are in the fourth shell) and group 8 (in the d-block transition metals). Its electron configuration is [Ar] 3d⁶ 4s², meaning it has the same core electrons as argon plus six electrons in the 3d subshell and two in the 4s subshell. Iron is culturally and historically significant across Northeast India — the Dimasa people and other communities of the Brahmaputra valley have practised iron smelting for centuries, and iron tools were essential to clearing the dense forests for wet rice cultivation.',
      diagram: 'ElementBoxDiagram',
    },
    {
      title: 'Metals, Nonmetals, and Metalloids',
      beginnerContent:
        'Metals make up about three-quarters of all known elements and occupy the left and centre of the periodic table. They share characteristic physical properties: shiny (lustrous) surfaces, good conductivity of heat and electricity, malleability (can be hammered into sheets), and ductility (can be drawn into wires). Chemically, metals tend to lose electrons and form positive ions (cations) during reactions. Most metals are solid at room temperature — mercury is the notable exception, existing as a silvery liquid. Iron (Fe), copper (Cu), aluminium (Al), and gold (Au) are metals you encounter daily. Northeast India has significant deposits of iron ore, and the traditional dao (a type of machete used by the Naga, Garo, and Khasi peoples) is forged from carbon steel — an alloy of iron and a small percentage of carbon.\n\nNonmetals are found in the upper right of the periodic table, separated from metals by a zigzag "staircase" line. They have the opposite properties: dull appearance, poor conductivity (they are insulators), and brittleness in the solid state. Chemically, nonmetals tend to gain electrons and form negative ions (anions) or share electrons in covalent bonds. Carbon, nitrogen, oxygen, phosphorus, and sulfur are all nonmetals essential to life. Sulfur deposits are found near volcanic hot springs in parts of Meghalaya and Nagaland, and the distinctive smell of rotten eggs near these springs is hydrogen sulfide gas (H₂S) — a sulfur compound.\n\nMetalloids (also called semimetals) sit along the staircase line and have properties intermediate between metals and nonmetals: boron (B), silicon (Si), germanium (Ge), arsenic (As), antimony (Sb), tellurium (Te), and polonium (Po). Silicon is the most industrially important metalloid — it is a semiconductor, meaning its electrical conductivity falls between that of a conductor and an insulator. This property makes it the foundation of every computer chip, solar cell, and transistor. Silicon is the second most abundant element in Earth\'s crust (after oxygen), mostly locked up in silicate minerals — the sand along Assam\'s riverbeds is largely silicon dioxide (SiO₂).',
      diagram: 'MetalNonmetalDiagram',
    },
    {
      title: 'Periodic Trends',
      beginnerContent:
        'Atomic radius — the size of an atom — follows a clear pattern on the periodic table. Moving from left to right across a period, atoms get smaller, even though they have more electrons. This seems counterintuitive until you realise that each step to the right adds one more proton to the nucleus, increasing the nuclear charge and pulling all the electrons closer in. The additional electron goes into the same outer shell, so it does not effectively shield the other outer electrons from the stronger nuclear pull. Moving down a group, atoms get larger because each period adds a new electron shell further from the nucleus. Francium (bottom-left) is the largest naturally occurring atom, while helium (top-right) is the smallest.\n\nElectronegativity measures how strongly an atom attracts shared electrons in a chemical bond. It increases from left to right across a period (stronger nuclear charge pulls on bonding electrons more tightly) and decreases down a group (outer electrons are farther from the nucleus and shielded by inner shells). Fluorine, in the top-right corner, is the most electronegative element with a value of 3.98 on the Pauling scale. Caesium and francium, in the bottom-left, are the least electronegative. When two atoms with very different electronegativities bond, the shared electrons are pulled strongly toward the more electronegative atom, creating a polar bond — or, if the difference is large enough, one atom strips the electron away entirely, forming an ionic bond.\n\nIonisation energy is the energy required to remove the outermost electron from a gaseous atom. It increases across a period (stronger nuclear charge holds electrons more tightly) and decreases down a group (outer electrons are farther away and easier to remove). Helium has the highest first ionisation energy (2372 kJ/mol), while caesium has one of the lowest (375.7 kJ/mol). These trends are all consequences of the same two competing factors: nuclear charge (number of protons pulling electrons in) and electron shielding (inner electron shells blocking outer electrons from feeling the full nuclear charge). Across a period, nuclear charge wins; down a group, shielding and distance win.',
      diagram: 'PeriodicTrendsDiagram',
    },
    {
      title: 'The Alkali Metals and Halogens',
      beginnerContent:
        'Group 1, the alkali metals — lithium, sodium, potassium, rubidium, caesium, and francium — each have a single valence electron that they lose extremely easily, making them the most reactive metals on the table. Their reactivity increases dramatically going down the group because the valence electron is progressively farther from the nucleus and easier to remove. Lithium reacts gently with water, producing hydrogen gas and lithium hydroxide. Sodium reacts vigorously, often melting into a ball that skitters across the water surface with a yellow flame. Potassium reacts violently with a lilac flame. Rubidium and caesium explode on contact with water — caesium so violently that it shatters the container. All alkali metals are soft enough to cut with a knife, have low densities (lithium, sodium, and potassium all float on water), and are never found as free elements in nature because they react with oxygen and moisture in the air within seconds.\n\nGroup 17, the halogens — fluorine, chlorine, bromine, iodine, and astatine — each need just one more electron to fill their outer shell, making them the most reactive nonmetals. Fluorine is the most reactive element of all: it reacts with virtually every other element, including noble gases xenon and krypton under extreme conditions. Chlorine is a yellow-green toxic gas used to disinfect drinking water — including municipal water supplies across Assam\'s cities. Bromine is one of only two elements that are liquid at room temperature (the other being mercury). Iodine is a purple-black solid that sublimes into a violet vapour. Iodine deficiency causes goitre (enlarged thyroid gland), which was historically common in the hilly regions of Northeast India far from the sea — this is why iodised salt is now mandatory in India, a public health measure that has dramatically reduced goitre rates.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each element to its group behaviour',
          pairs: [
            [
              'Sodium (Na)',
              'Alkali metal — reacts vigorously with water, gives yellow flame',
            ],
            [
              'Fluorine (F)',
              'Halogen — most reactive element, needs one electron to fill shell',
            ],
            [
              'Neon (Ne)',
              'Noble gas — full outer shell, almost completely unreactive',
            ],
            [
              'Iron (Fe)',
              'Transition metal — forms colored compounds, multiple oxidation states',
            ],
          ],
        },
      },
    },
  ],
};
