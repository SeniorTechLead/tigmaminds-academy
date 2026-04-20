import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'plant-biology',
  title: 'Plant Biology',
  category: 'botany',
  tags: ['chemistry'],
  keywords: ['photosynthesis', 'chlorophyll', 'transpiration', 'xylem', 'phloem', 'auxin', 'stomata'],
  icon: '🌱',
  tagline: 'How plants make food from sunlight, grow toward the sky, and reproduce.',
  relatedStories: ['old-banyan-trees-stories', 'tejimola-the-girl-who-became-a-plant', 'orchid-colors', 'pitcher-plant', 'bamboo-grows-fast', 'girl-grew-forest'],
  understand: [
    // ── Section 1: Photosynthesis ──────────────────────────────
    {
      title: 'Photosynthesis — The Engine of Life',
      diagram: 'PhotosynthesisDiagram',
      beginnerContent:
        'Right now, as you read this, every leaf outside your window is doing something no human factory has ever managed: **splitting water molecules apart using nothing but sunlight**. We\'ve spent billions trying to copy this trick. We can\'t. A leaf does it before breakfast.\n\n' +
        'Watch the diagram above. Those blue dots climbing up? Water, pulled from the soil through hair-thin tubes. The gray dots drifting in from the left? Carbon dioxide, slipping through tiny pores called **stomata** that open and close like mouths. And those golden sparks raining down from the sun? Photons — packets of pure energy.\n\n' +
        'Inside the leaf, in tiny green discs called **chloroplasts**, something astonishing happens. Light energy rips water molecules apart. The hydrogen atoms get welded onto CO₂ to build **glucose** — sugar, the plant\'s food. The leftover oxygen? Tossed out as waste. *Your next breath is a plant\'s trash.*\n\n' +
        '**The whole thing in one line:**\n\n' +
        '> 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n' +
        'Here\'s a number that should bother you: leaves are only about **1% efficient** at converting sunlight to sugar. Terrible, right? Except that 1% feeds every animal on Earth, including you. Your breakfast this morning — sunlight, processed through a plant, processed through a kitchen. Two steps removed from a star.\n\n' +
        '| What goes in | What comes out | Where you can see it |\n' +
        '|-------------|---------------|---------------------|\n' +
        '| CO₂ from the air | Glucose — stored in roots, fruits, seeds | A mango is concentrated sunlight |\n' +
        '| H₂O from roots | Oxygen — released through stomata | Every breath you take |\n' +
        '| Sunlight | Chemical energy locked in sugar bonds | Wood burns because it\'s releasing stored sunlight |\n\n' +
        'Bamboo grows up to 91 cm in a single day. It photosynthesises so fast that you can almost *watch* it converting sunlight into structure. A rice paddy fixes ~15 tonnes of CO₂ per hectare per year. A tea leaf is green because it\'s packed with chlorophyll — the green pigment that catches photons. The darker the leaf, the harder it\'s working.\n\n' +
        '**Think about this:** Plants need CO₂ and release O₂. Animals need O₂ and release CO₂. Neither invented this arrangement. It just emerged — a four-billion-year-old partnership between breathers and growers, each keeping the other alive.',
      intermediateContent:
        'Photosynthesis has two stages that work like a relay race — one captures energy, the other uses it.\n\n' +
        '**Stage 1: Light-dependent reactions** (thylakoid membranes)\n\n' +
        'Chlorophyll absorbs photons and uses that energy to split water (photolysis): **2H₂O → 4H⁺ + 4e⁻ + O₂**. The electrons travel along an electron transport chain:\n\n' +
        '| Step | Component | What happens |\n' +
        '|------|----------|-------------|\n' +
        '| 1 | Photosystem II (P680) | Absorbs light, splits water, releases electrons |\n' +
        '| 2 | Plastoquinone | Shuttles electrons to next complex |\n' +
        '| 3 | Cytochrome b6f | Pumps H⁺ into thylakoid lumen (builds gradient) |\n' +
        '| 4 | Photosystem I (P700) | Re-energises electrons with another photon |\n' +
        '| 5 | Ferredoxin → NADP⁺ reductase | Produces **NADPH** |\n' +
        '| 6 | ATP synthase | H⁺ gradient drives **ATP** production (chemiosmosis) |\n\n' +
        '**Stage 2: Calvin cycle** (stroma — light-independent)\n\n' +
        'The enzyme **RuBisCO** fixes CO₂ onto ribulose bisphosphate (RuBP), producing 3-phosphoglycerate (3-PGA). ATP and NADPH then reduce 3-PGA to glyceraldehyde-3-phosphate (G3P).\n\n' +
        '| Per turn of the Calvin cycle | Amount |\n' +
        '|-----------------------------|--------|\n' +
        '| CO₂ fixed | 1 molecule |\n' +
        '| ATP consumed | 3 |\n' +
        '| NADPH consumed | 2 |\n' +
        '| G3P produced | 1 (but 5 of every 6 are recycled to regenerate RuBP) |\n' +
        '| Turns needed for 1 glucose | **6** (requiring 18 ATP + 12 NADPH total) |',
      advancedContent:
        'RuBisCO is the most abundant protein on Earth (~500 million tonnes globally) yet remarkably slow — fixing only ~3 CO₂/s versus typical enzyme rates of 1,000/s. Worse, it catalyses a wasteful side reaction with O₂ called **photorespiration**, reducing efficiency by 25-30%.\n\n' +
        '**Evolutionary solutions to photorespiration:**\n\n' +
        '| Pathway | Mechanism | Examples | Efficiency gain |\n' +
        '|---------|-----------|---------|----------------|\n' +
        '| **C₃** (default) | RuBisCO fixes CO₂ directly | Rice, wheat, tea | Baseline |\n' +
        '| **C₄** | PEP carboxylase pre-fixes CO₂ in mesophyll → shuttles to bundle-sheath → high [CO₂] around RuBisCO | Maize, sugarcane, millet | +30-40% in hot climates |\n' +
        '| **CAM** | CO₂ fixed at night (stomata open), Calvin cycle by day (stomata closed) | Cacti, pineapple, orchids | Massive water savings |\n\n' +
        'Many epiphytic orchids of Meghalaya and Arunachal Pradesh use CAM photosynthesis — critical for survival in tree canopies where water is scarce between monsoons.\n\n' +
        '| Photosynthesis parameter | C₃ (rice) | C₄ (sugarcane) | CAM (orchid) |\n' +
        '|-------------------------|-----------|----------------|-------------|\n' +
        '| CO₂ compensation point (ppm) | 40-60 | 0-5 | Variable |\n' +
        '| Optimal temperature (°C) | 15-25 | 30-40 | 25-35 |\n' +
        '| Water use efficiency (g CO₂/kg H₂O) | 1-3 | 2-5 | 6-12 |\n' +
        '| Photorespiration | High (25-30%) | Negligible | Negligible |\n\n' +
        'The **C₄ Rice Project** at IRRI aims to engineer C₄ pathways into rice — potentially boosting yields by 50% and benefiting millions of rice farmers across Assam and Bangladesh.',
    },

    // ── Section 2: Roots ────────────────────────────────────────
    {
      title: 'Roots — The Hidden Half',
      diagram: 'BanyanRootsDiagram',
      beginnerContent:
        'Dig up any plant and you\'ll find a secret: the part underground is often *bigger* than the part you see. A mature oak has roots spreading 20 metres in every direction. A single rye plant — a grass, nothing special — grows **14 billion root hairs** with a combined length of 10,000 km. That\'s Guwahati to São Paulo. From one small plant.\n\n' +
        'Watch the diagram above. Those blue dots drifting through the soil? Water molecules, bumping around randomly. When one drifts near a root hair, it gets pulled in — not by suction, but by **osmosis**. The root hair\'s cell sap is saltier than the surrounding soil water, so water flows in naturally, the way a dry sponge drinks from a puddle without anyone squeezing it.\n\n' +
        'And see those purple threads branching out from the root tips? Those aren\'t roots — they\'re **fungi**. Mycorrhizal fungi form a partnership with 90% of all plants: the fungus extends the root system by 100× in exchange for a cut of the sugar. It\'s the oldest trade deal in nature, running for 450 million years.\n\n' +
        '| Root type | What it looks like | Why it\'s brilliant |\n' +
        '|-----------|-------------------|-------------------|\n' +
        '| **Tap root** | One thick root plunging straight down | Tea plants drill 3+ metres deep for water that shallow roots can\'t reach |\n' +
        '| **Fibrous roots** | A dense mat spreading sideways | Rice thrives in waterlogged paddies because its roots breathe at the surface |\n' +
        '| **Aerial roots** | Roots that grow downward *from branches* | Banyan trees send them down like pillars — one tree becomes a forest |\n' +
        '| **Living root bridges** | Trained aerial roots spanning rivers | In Meghalaya, Khasi communities guide *Ficus elastica* roots into bridges that get stronger every year for 500+ years |\n\n' +
        '**Think about this:** When a bridge engineer wants strength that improves with age, they can\'t do it. Steel corrodes, concrete cracks. But a living root bridge *heals itself, grows thicker under load, and lasts centuries*. The plant doesn\'t know it\'s a bridge. It\'s just doing what roots do — growing toward water and anchoring against gravity. The genius is in the partnership between human and plant.',
      intermediateContent:
        'Water enters root hairs by **osmosis** — moving from dilute soil solution to concentrated cell sap.\n\n' +
        '**The water potential equation:** **Ψ = Ψₛ + Ψₚ**\n\n' +
        '| Symbol | Name | Typical value | Always... |\n' +
        '|--------|------|--------------|----------|\n' +
        '| Ψ | Total water potential | −0.3 to −1.5 MPa | Moves from high to low |\n' +
        '| Ψₛ | Solute potential | Always negative | More solute = more negative |\n' +
        '| Ψₚ | Pressure potential | Usually positive (turgor) | Pushes outward |\n\n' +
        '**Worked example:** Soil Ψ = −0.3 MPa. Root hair Ψ = −0.7 MPa. Water flows from soil (higher Ψ) into the root hair (lower Ψ). The gradient of 0.4 MPa drives osmosis.\n\n' +
        'Once inside the root, water travels via two pathways:\n\n' +
        '| Pathway | Route | Speed | Control |\n' +
        '|---------|-------|-------|---------|\n' +
        '| **Apoplast** | Through cell walls (between cells) | Fast | Blocked by Casparian strip in endodermis |\n' +
        '| **Symplast** | Through cytoplasm via plasmodesmata | Slower | Fully regulated by the plant |\n\n' +
        'The **Casparian strip** is a waxy barrier of suberin in the endodermis that forces water through cell membranes — giving the plant control over which minerals enter the xylem. Root pressure (0.1–0.5 MPa) pushes water a few metres, but transpiration pull generates tensions of −1 to −2 MPa, sufficient to lift water 100+ metres.',
      advancedContent:
        '**The Cohesion-Tension Theory** explains how water reaches the top of a 115 m coast redwood without any pump.\n\n' +
        '| Principle | Physics | Value |\n' +
        '|-----------|---------|-------|\n' +
        '| **Cohesion** | H-bonds between water molecules keep the column intact | Tensile strength ≈ −30 MPa |\n' +
        '| **Tension** | Transpiration from leaves creates negative pressure | −1 to −2 MPa in tallest trees |\n' +
        '| **Adhesion** | Water sticks to xylem walls via H-bonds | Prevents column collapse |\n\n' +
        'Since the tensile strength of water (−30 MPa) far exceeds the tension needed (−2 MPa), the column holds — with a safety margin of 15×.\n\n' +
        '**Mycorrhizal networks** extend the root system dramatically:\n\n' +
        '| Type | Association | Surface area increase | Carbon cost |\n' +
        '|------|-----------|---------------------|------------|\n' +
        '| **Ectomycorrhizae** | Fungal sheath around roots (pines, oaks) | 100–1,000× | 10–30% of photosynthate |\n' +
        '| **Arbuscular mycorrhizae** | Fungal arbuscules inside root cells (80% of plants) | 10–100× | 4–20% of photosynthate |\n' +
        '| **Orchid mycorrhizae** | Fungus provides ALL carbon to seedling | Essential for germination | Reversed — fungus pays |\n\n' +
        'The orchids of Arunachal Pradesh (900+ species) depend entirely on mycorrhizal fungi for germination — orchid seeds contain zero food reserves. Without the right fungal partner in the soil, the seed cannot grow. This is why transplanting wild orchids almost always fails.\n\n' +
        'Cavitation (air embolism) can break the water column under drought stress. Plants repair cavitated vessels by refilling them with water under positive root pressure at night — a process recently visualised in real time using synchrotron X-ray imaging.',
      interactive: {
        type: 'did-you-know',
        props: {
          facts: [
            'A single rye plant can have over 14 billion root hairs with a combined length of over 10,000 km — enough to stretch from India to Brazil.',
            'Banyan trees grow aerial roots that become new trunks. One banyan tree in Kolkata (the Great Banyan) looks like a small forest but is a single organism.',
            'The living root bridges of Meghalaya are made from Ficus elastica aerial roots trained by Khasi communities — some are over 500 years old and can support 50 people at once.',
            'Some roots go deep (a wild fig in South Africa had roots measured at 120 metres below the surface) while others spread wide (a single aspen grove connected by roots can span 40 hectares).',
          ],
        },
      },
    },

    // ── Section 3: Stems and Transport ──────────────────────────
    {
      title: 'Stems and Transport',
      diagram: 'CapillaryActionDiagram',
      beginnerContent:
        'A coast redwood is 115 metres tall. Water has to travel from its roots to its topmost needles — straight up, against gravity, with no pump. How? No human engineer has built a system that can do this. The tree does it every day.\n\n' +
        'Watch the diagram. Blue dots climbing upward through the left channel — that\'s water in the **xylem**. Amber dots sinking downward through the right channel — that\'s sugar in the **phloem**. Two highways running side by side, carrying opposite cargo in opposite directions, 24 hours a day.\n\n' +
        '| System | Direction | Cargo | The clever part |\n' +
        '|--------|-----------|-------|----------------|\n' +
        '| **Xylem** | UP only | Water + minerals from soil | Dead hollow tubes — the tree builds its own plumbing and then kills the cells. The corpses become the pipes. |\n' +
        '| **Phloem** | Wherever needed | Sugar from photosynthesis | Living cells with perforated end walls — they squeeze sugar to wherever the plant is growing |\n\n' +
        'Here\'s what should astonish you: the xylem has **no pump**. Water rises because it\'s *pulled from the top*. When water evaporates from leaf stomata (transpiration), it creates a tiny vacuum. That vacuum tugs the water molecule below it, which tugs the next one, all the way down to the roots — a continuous chain of water molecules holding hands through hydrogen bonds. One chain, 115 metres long, thinner than a hair, holding together under tension that would shatter glass.\n\n' +
        'A tea bush transpires 30-40 litres per day. A sal tree in Kaziranga: over 200 litres. All pulled upward by evaporation. And here\'s the kicker — every plank of wood, every bamboo pole, every timber beam you\'ve ever touched is **dead xylem**. You\'re sitting on ancient water pipes.',
      intermediateContent:
        '**Xylem structure and flow:**\n\n' +
        'Xylem vessels are dead cells with lignified walls arranged end-to-end with perforated end plates, forming continuous tubes. Flow rate follows the **Hagen-Poiseuille equation**:\n\n' +
        '**Q = πr⁴ΔP / 8ηL**\n\n' +
        '| Variable | Meaning | Unit |\n' +
        '|----------|---------|------|\n' +
        '| Q | Flow rate | m³/s |\n' +
        '| r | Vessel radius | m |\n' +
        '| ΔP | Pressure difference | Pa |\n' +
        '| η | Viscosity of xylem sap | Pa·s (≈ 1.0 × 10⁻³) |\n' +
        '| L | Vessel length | m |\n\n' +
        '**Worked example:** Because flow scales with r⁴, a vessel twice as wide carries **2⁴ = 16× more water**. This is why angiosperms (with wide vessels) outcompete conifers (narrow tracheids) in wet tropical forests.\n\n' +
        '**Phloem transport — the Munch pressure-flow hypothesis:**\n\n' +
        '| Step | Location | What happens |\n' +
        '|------|---------|-------------|\n' +
        '| 1. Loading | Source (leaves) | Sucrose actively pumped into sieve tubes → lowers Ψ → water enters by osmosis |\n' +
        '| 2. Flow | Phloem tubes | High turgor pressure at source pushes sap toward sink |\n' +
        '| 3. Unloading | Sink (roots, fruits, growing tips) | Sucrose removed → water exits → pressure drops |\n\n' +
        '| Transport comparison | Xylem | Phloem |\n' +
        '|---------------------|-------|--------|\n' +
        '| Flow rate | 1–6 m/hour | 0.5–1.0 m/hour |\n' +
        '| Cells | Dead (vessels/tracheids) | Living (sieve tube elements) |\n' +
        '| Driving force | Transpiration pull (passive) | Osmotic pressure (active loading) |\n' +
        '| Direction | One-way (up) | Two-way |\n' +
        '| Daily volume (mature oak) | 400+ litres | 50–100 litres |',
      advancedContent:
        'The evolution of xylem vessels was a key innovation enabling angiosperms to dominate terrestrial ecosystems.\n\n' +
        '| Feature | Tracheids (conifers, ferns) | Vessel elements (angiosperms) |\n' +
        '|---------|---------------------------|------------------------------|\n' +
        '| Width | 10–25 μm | 20–500 μm |\n' +
        '| End walls | Overlapping, bordered pits | Perforated plates (open tubes) |\n' +
        '| Conductivity | Low | 4–100× higher |\n' +
        '| Cavitation risk | Low (each tracheid is isolated) | High (embolism can spread) |\n' +
        '| Evolution | Ancient (420 Mya) | Recent (130 Mya) |\n\n' +
        'The **wood density-conductivity trade-off** constrains tree design:\n\n' +
        '| Strategy | Vessel width | Conductivity | Cavitation risk | Example |\n' +
        '|----------|-------------|-------------|----------------|--------|\n' +
        '| Wet tropical | Wide (200+ μm) | High | High | Dipterocarp (NE India rainforest) |\n' +
        '| Drought-adapted | Narrow (30-50 μm) | Low | Low | Teak, sal |\n' +
        '| Bamboo (monocot) | No secondary growth | Moderate | Moderate | Bambusa balcooa (Assam bamboo) |\n\n' +
        '**Phloem loading** strategies vary: in many trees, sucrose enters passively through **polymer trapping** (sucrose diffuses into companion cells and is converted to raffinose, too large to diffuse back). In herbs, active loading via H⁺/sucrose symporters concentrates sucrose 2-3× above mesophyll levels. Research into synthetic xylem-inspired microfluidic systems aims to create passive water transport for precision agriculture — potentially relevant for Assam\'s tea irrigation.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each transport system to what it carries',
          pairs: [
            ['Xylem', 'Carries water and minerals upward from roots to leaves'],
            ['Phloem', 'Carries sugars downward from leaves to the rest of the plant'],
            ['Stomata', 'Tiny pores in leaves that release water vapour, creating transpiration pull'],
            ['Root hairs', 'Absorb water and minerals from the soil into the root'],
          ],
        },
      },
    },

    // ── Section 4: Leaves ───────────────────────────────────────
    {
      title: 'Leaves — Solar Panels of the Plant',
      diagram: 'JasmineStomataClockDiagram',
      beginnerContent:
        'Every leaf faces an impossible trade-off. To photosynthesize, it must open its pores (**stomata**) and let CO₂ in. But the instant the pores open, water starts escaping. Open too wide, the plant dries out. Stay closed, the plant starves. This is the central drama of every leaf on Earth, playing out 300 times per mm² of leaf surface.\n\n' +
        'Toggle the diagram above between day and night. Watch the guard cells — those two bean-shaped cells flanking the pore. During the day, potassium ions (K⁺) flood into the guard cells. Water follows by osmosis. The guard cells swell like two balloons pressed together — and the pore between them opens. CO₂ streams in, O₂ streams out, water vapor escapes.\n\n' +
        'At night, the process reverses. K⁺ leaves, water follows, guard cells go limp, pore snaps shut. The leaf conserves water while it waits for dawn.\n\n' +
        '**A leaf is a precision instrument.** Look at its layers:\n\n' +
        '| Layer | What it does | What happens if it fails |\n' +
        '|-------|-------------|-------------------------|\n' +
        '| **Waxy cuticle** | Waterproof seal on top surface | The leaf dries out in hours |\n' +
        '| **Palisade cells** | Tall columns packed with chloroplasts — the photosynthesis factory | No sugar production |\n' +
        '| **Spongy mesophyll** | 50% air space — gas exchange highway | CO₂ can\'t reach the chloroplasts |\n' +
        '| **Stomata** (underside) | 100–300 per mm² — each one a controlled pore | No gas exchange at all |\n\n' +
        'Why are stomata on the *underside*? Because the top surface faces the sun — maximum evaporation. Putting the pores underneath, in shade, reduces water loss by 50%.\n\n' +
        '**Leaf shapes are survival strategies:**\n\n' +
        '| Shape | Why | The trade-off |\n' +
        '|-------|-----|---------------|\n' +
        '| Banana: broad and flat | Maximum light capture | Tears easily in wind |\n' +
        '| Pine: tiny needles | Almost zero water loss | Small light-catching area |\n' +
        '| Tea: young leaves rolled inward | Saves water during dry spells | Less photosynthesis |\n' +
        '| Water lily: 2m floating disc | Captures light on a lake surface | Needs structural ribs strong enough to support a child |\n\n' +
        'Tea pluckers harvest "two leaves and a bud" — the youngest growth. Those young leaves are photosynthesizing flat-out, packed with more chloroplasts and flavour compounds than any older leaf. You\'re drinking concentrated sunlight.',
      intermediateContent:
        '**Leaf anatomy in numbers:**\n\n' +
        '| Feature | Typical value |\n' +
        '|---------|-------------|\n' +
        '| Chloroplasts per palisade cell | 50–100 |\n' +
        '| Stomata per mm² (lower surface) | 100–300 |\n' +
        '| Air space in spongy mesophyll | Up to 50% by volume |\n' +
        '| Cuticle thickness | 0.1–10 μm |\n\n' +
        '**How stomata open and close:**\n\n' +
        '| Step | What happens | Result |\n' +
        '|------|-------------|--------|\n' +
        '| 1 | Light/low CO₂ triggers K⁺ ion influx into guard cells | Solute concentration increases |\n' +
        '| 2 | Water enters guard cells by osmosis | Guard cells swell (become turgid) |\n' +
        '| 3 | Kidney-shaped guard cells bow apart | **Stomatal pore opens** |\n' +
        '| 4 | Darkness/drought triggers K⁺ efflux | Guard cells lose water, go flaccid |\n' +
        '| 5 | Guard cells collapse together | **Pore closes** |\n\n' +
        '**The transpiration trade-off:**\n\n' +
        '| Measure | Definition | C₃ plant value |\n' +
        '|---------|-----------|---------------|\n' +
        '| Transpiration ratio | g water lost per g CO₂ fixed | ~500:1 |\n' +
        '| Stomatal conductance | Rate of gas exchange | 100–400 mmol H₂O m⁻² s⁻¹ |\n' +
        '| Water-use efficiency | g dry matter per kg water | 1–3 g/kg |\n\n' +
        '**Worked example:** A rice plant with 500:1 transpiration ratio that fixes 20 g of CO₂ per day loses 500 × 20 = 10,000 g = **10 litres of water per day**. This is why rice paddies need so much water — and why Assam\'s monsoon climate is perfect for rice cultivation.',
      advancedContent:
        '**Leaf economics spectrum** — across 2,548 species worldwide, leaves fall on a universal trade-off:\n\n' +
        '| Strategy | LMA | N content | Photosynthetic rate | Lifespan | Example |\n' +
        '|----------|-----|-----------|--------------------|-----------|---------|\n' +
        '| "Live fast, die young" | Low | High | High | Short (weeks-months) | Annual herbs, rice |\n' +
        '| "Slow and steady" | High | Low | Low | Long (years) | Evergreen trees, sal, rhododendron |\n\n' +
        '**Optimal stomatal theory** (Cowan & Farquhar, 1977): stomata should maximise carbon gain for a given water loss. The marginal water cost of carbon (∂E/∂A) should remain constant throughout the day.\n\n' +
        'Modern photosynthesis models couple stomatal conductance to the **FvCB model** (Farquhar, von Caemmerer & Berry):\n\n' +
        '| Limitation | Equation | Dominant when... |\n' +
        '|-----------|----------|------------------|\n' +
        '| RuBisCO-limited | A = Vcmax × (Ci − Γ*) / (Ci + Kc(1 + O/Ko)) | Low light, low CO₂ |\n' +
        '| Electron transport-limited | A = J × (Ci − Γ*) / (4Ci + 8Γ*) | High light, high CO₂ |\n' +
        '| TPU-limited | A = 3TPU | Very high CO₂ (saturated) |\n\n' +
        '| Parameter | Symbol | Typical C₃ value (25°C) |\n' +
        '|-----------|--------|------------------------|\n' +
        '| Max carboxylation rate | Vcmax | 50–120 μmol m⁻² s⁻¹ |\n' +
        '| Max electron transport | Jmax | 80–200 μmol m⁻² s⁻¹ |\n' +
        '| CO₂ compensation point | Γ* | 42.75 μmol mol⁻¹ |\n\n' +
        'These models underpin vegetation components of global climate models used to project carbon cycle feedbacks — including predictions for how Assam\'s tea yields will shift under 2°C warming.',
    },

    // ── Section 5: Plant Growth ─────────────────────────────────
    {
      title: 'How Plants Grow — Fast and Slow',
      diagram: 'BambooMeristemDiagram',
      beginnerContent:
        'Bamboo grows 91 centimetres in a day. Put a ruler next to a bamboo shoot in the morning, come back at dinner, and it\'s taller than the ruler. No other plant comes close. How?\n\n' +
        'Watch the diagram. See that glowing tip? That\'s the **meristem** — a tiny dome of cells that do nothing but divide. One cell becomes two. Two become four. New cells stack up like bricks at a construction site. But here\'s the trick: the cells below the meristem **stretch**. Each new cell elongates 10 to 100 times its original length, inflating with water like a telescope extending. Division at the tip, elongation below. That\'s how all plants grow.\n\n' +
        '| Plant | Growth rate | The secret |\n' +
        '|-------|-----------|------------|\n' +
        '| Bamboo | **91 cm/day** | All cells pre-formed — they inflate simultaneously |\n' +
        '| Kudzu vine | 30 cm/day | Aggressive climbing growth |\n' +
        '| Sunflower | 8 cm/day | Tracks the sun as it grows (heliotropism) |\n' +
        '| Oak tree | 0.5 cm/day | Slow — but each ring of wood lasts centuries |\n\n' +
        'Bamboo isn\'t even a tree. It\'s a **grass** — the tallest, fastest-growing grass in the world. Cut it down and it regrows from the root system in a few years. Cut an oak and you wait decades.\n\n' +
        'Trees grow in two directions at once. **Primary growth** (upward) happens at the tips, where meristems add height. **Secondary growth** (outward) happens in a ring of cells called the **cambium**, which adds girth. Every year, the cambium lays down one ring of new wood. Count the rings of a fallen tree and you\'re reading its autobiography — wide rings for rainy years, narrow rings for drought.',
      intermediateContent:
        'Plant growth is orchestrated by **five major hormones** — chemical messengers that tell cells what to do:\n\n' +
        '| Hormone | Produced where | Key effects | Example |\n' +
        '|---------|--------------|-------------|------------------|\n' +
        '| **Auxin (IAA)** | Shoot tips | Cell elongation, phototropism, apical dominance | Tea bushes pruned to break apical dominance → bushier growth |\n' +
        '| **Gibberellins** | Young leaves, roots | Stem elongation, seed germination | Applied to sugarcane in Assam to increase stem length |\n' +
        '| **Cytokinins** | Root tips | Cell division, delay ageing | Keep harvested tea leaves green longer |\n' +
        '| **Abscisic acid (ABA)** | Mature leaves | Stomatal closure, dormancy | Tea plants close stomata in December dry season |\n' +
        '| **Ethylene** (gas) | Ripening fruits, stressed tissue | Fruit ripening, leaf drop | One ripe banana releases ethylene that ripens the whole bunch |\n\n' +
        '**The acid growth hypothesis** explains how auxin elongates cells:\n\n' +
        '| Step | What happens |\n' +
        '|------|-------------|\n' +
        '| 1 | Auxin binds to receptor on cell membrane |\n' +
        '| 2 | H⁺-ATPase pumps activated → cell wall acidified to pH ~4.5 |\n' +
        '| 3 | Low pH activates **expansins** — proteins that loosen H-bonds between cellulose microfibrils |\n' +
        '| 4 | Turgor pressure stretches the loosened wall irreversibly |\n' +
        '| 5 | Cell elongates — the stem grows |\n\n' +
        '**Phototropism worked example:** When light hits a stem from one side, auxin migrates to the shaded side → those cells elongate more → the stem bends toward the light. Measured auxin concentration ratio: ~2:1 (shaded:lit side).',
      advancedContent:
        '**Meristem maintenance — the WUS-CLV feedback loop:**\n\n' +
        '| Component | Location | Function |\n' +
        '|-----------|---------|----------|\n' +
        '| **WUSCHEL (WUS)** | Organising centre (deep in meristem) | Transcription factor that promotes stem cell identity |\n' +
        '| **CLV3** | Stem cells (overlying WUS) | Secreted peptide ligand |\n' +
        '| **CLV1** | Organising centre | Receptor kinase — activated by CLV3 |\n\n' +
        'WUS promotes stem cells → stem cells secrete CLV3 → CLV3 activates CLV1 → CLV1 represses WUS → fewer stem cells → less CLV3 → WUS recovers. This self-regulating loop maintains ~60 stem cells.\n\n' +
        '| Mutant | Phenotype | Explanation |\n' +
        '|--------|-----------|------------|\n' +
        '| *clv3* loss-of-function | Massively enlarged meristems, extra organs | No brake on WUS → unlimited stem cells |\n' +
        '| *wus* loss-of-function | Meristem terminates prematurely | No stem cell maintenance |\n' +
        '| *clv3* overexpression | Tiny meristems, few organs | Too much brake → WUS suppressed |\n\n' +
        '**Dendrochronology** exploits annual ring patterns for climate reconstruction. Ring width correlates with growing-season temperature and precipitation.\n\n' +
        '| Tree species | Chronology length | Region |\n' +
        '|-------------|------------------|--------|\n' +
        '| Bristlecone pine | 9,000+ years | Western USA |\n' +
        '| Teak (*Tectona grandis*) | 400+ years | South/SE Asia |\n' +
        '| *Pinus merkusii* | 200+ years | NE India, Myanmar |\n\n' +
        'Tree-ring data from NE India teak and pine has been used to reconstruct monsoon variability over centuries — showing that mega-droughts far worse than any in recorded history occurred in the 14th-15th centuries.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Bamboo is a type of tree.', answer: false, explanation: 'Bamboo is actually a grass — the tallest and fastest-growing grass in the world.' },
            { text: 'Tree rings are produced by the lateral meristem (cambium), one ring per year of growth.', answer: true, explanation: 'The cambium produces a ring of new wood each growing season, which is why you can count rings to estimate a tree\'s age.' },
            { text: 'Some bamboo species can grow up to 91 centimetres in a single day.', answer: true, explanation: 'Bamboo achieves this because all its cells elongate simultaneously, inflating with water like a pre-formed structure.' },
            { text: 'Auxin makes cells shorter.', answer: false, explanation: 'Auxin promotes cell elongation. It activates expansins that loosen cell walls, allowing turgor pressure to stretch them longer.' },
          ],
        },
      },
    },

    // ── Section 6: Pollination ──────────────────────────────────
    {
      title: 'Pollination — How Plants Reproduce',
      diagram: 'BeePollinationDiagram',
      beginnerContent:
        'A plant can\'t walk to its mate. It can\'t swipe right. It\'s rooted in place for life. So how do two flowers — possibly kilometres apart — have sex? They hire couriers.\n\n' +
        'Watch the diagram. A bee lands on Flower A, shoves its head into the nectar well, and gets **dusted with pollen** from the anthers — those pollen-tipped stalks surrounding the nectar. The bee doesn\'t care about the pollen. It came for sugar. But when it flies to Flower B, some of those grains rub off onto the **stigma** — the sticky pad at the center. Flower B has been pollinated. Neither the bee nor the flowers planned this. It just works.\n\n' +
        '| Courier | The bribe | The delivery system |\n' +
        '|---------|-----------|--------------------|\n' +
        '| **Bees** | Sweet nectar + UV guide marks on petals | Fuzzy body picks up pollen electrostatically |\n' +
        '| **Butterflies** | Nectar in deep tubes | Proboscis reaches in, head contacts anthers |\n' +
        '| **Bats** | Large pale flowers that open at night, musky scent | Face gets dusted while lapping nectar |\n' +
        '| **Wind** | Nothing — wind doesn\'t need bribing | Billions of tiny pollen grains, most wasted |\n' +
        '| **Water** | Nothing | Pollen floats on the surface to the next plant |\n\n' +
        'The economics are brutal. Wind-pollinated rice releases millions of pollen grains per panicle — most land on dirt, water, or nothing. That\'s the cost of not having a courier. Bee-pollinated flowers invest in petals, scent, and nectar instead — expensive, but precise.\n\n' +
        'And then there are the con artists. Certain orchids mimic the shape, color, and pheromone scent of a female wasp so precisely that male wasps try to mate with the flower. The wasp gets nothing. The orchid gets pollinated. 900+ orchid species in Assam alone, each with its own trick.',
      intermediateContent:
        '**What happens after pollen lands on the stigma?**\n\n' +
        '| Step | Time | What happens |\n' +
        '|------|------|-------------|\n' +
        '| 1 | 0 min | Pollen grain lands on sticky stigma |\n' +
        '| 2 | 30 min–2 hr | Pollen grain germinates a **pollen tube** |\n' +
        '| 3 | Hours | Tube grows down through the style (1–3 cm), guided by chemical signals from embryo sac |\n' +
        '| 4 | Arrival | Tube delivers two sperm nuclei to the ovule |\n' +
        '| 5 | Fertilisation | **Double fertilisation** (unique to angiosperms) |\n\n' +
        '**Double fertilisation:**\n\n' +
        '| Sperm | Fuses with | Produces | Ploidy |\n' +
        '|-------|-----------|---------|--------|\n' +
        '| Sperm 1 | Egg cell | **Zygote** (becomes embryo) | 2n (diploid) |\n' +
        '| Sperm 2 | Two polar nuclei | **Endosperm** (nourishes embryo) | 3n (triploid) |\n\n' +
        'The endosperm is what we eat in rice, wheat, and maize — it is 3n tissue designed as baby food for the plant embryo.\n\n' +
        '**Self-pollination prevention mechanisms:**\n\n' +
        '| Mechanism | How it works | Example |\n' +
        '|-----------|-------------|--------|\n' +
        '| **Self-incompatibility** | S-locus genes cause pollen rejection on own stigma | Many orchids |\n' +
        '| **Dichogamy** | Anthers and stigma mature at different times | Magnolia |\n' +
        '| **Heterostyly** | Stamens and pistils at different heights in different morphs | Primrose |\n' +
        '| **Dioecious plants** | Male and female flowers on separate plants | Holly, papaya |',
      advancedContent:
        '**Molecular basis of self-incompatibility:**\n\n' +
        'The **S-locus** contains two linked genes:\n\n' +
        '| Gene | Expressed in | Protein type |\n' +
        '|------|-------------|-------------|\n' +
        '| SCR/SP11 | Pollen coat | Small cysteine-rich peptide |\n' +
        '| SRK | Stigma surface | Receptor kinase |\n\n' +
        'When pollen and stigma carry matching S-alleles, SRK is activated → ARC1 E3 ubiquitin ligase → degradation of compatibility factors → pollen hydration and germination blocked.\n\n' +
        '| Feature | Value |\n' +
        '|---------|-------|\n' +
        '| Number of S-alleles in some species | 100+ |\n' +
        '| Maintained by | Negative frequency-dependent selection |\n' +
        '| Rare alleles advantage | Fewer mates reject them → higher fertilisation success |\n\n' +
        '**Coevolution between flowers and pollinators:**\n\n' +
        '| Case study | Flower | Pollinator | Specialisation |\n' +
        '|-----------|--------|-----------|----------------|\n' +
        '| Darwin\'s orchid | *Angraecum sesquipedale* (30 cm nectar spur) | Hawk moth *Xanthopan morganii* (30 cm proboscis) | Predicted by Darwin, confirmed decades later |\n' +
        '| Bucket orchid | *Coryanthes* spp. | Euglossine bees | Bee falls into bucket, must exit past pollinia |\n' +
        '| Fig-wasp mutualism | *Ficus* spp. (incl. NE India fig trees) | Specific fig wasp species | Each fig species has its own wasp — 80 Myr coevolution |\n' +
        '| NE India\'s *Rhododendron* | Tubular red flowers | Sunbirds, bumblebees | Key pollinator network in Eastern Himalaya |\n\n' +
        'The NE India orchid diversity hotspot (900+ species in Arunachal Pradesh alone) represents one of the richest pollination networks on Earth — many relationships still undocumented.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each pollinator to the flowers it prefers',
          pairs: [
            ['Bees', 'Bright colors (blue, yellow, purple) with sweet nectar and landing platforms'],
            ['Hummingbirds', 'Red tubular flowers with deep nectar reserves'],
            ['Bats', 'Large, pale flowers that open at night with strong scent'],
            ['Wind', 'Small, inconspicuous flowers producing huge amounts of lightweight pollen'],
          ],
        },
      },
    },

    // ── Section 7: Seed Dispersal ───────────────────────────────
    {
      title: 'Seed Dispersal — Spreading to New Places',
      diagram: 'SeedWindDispersalDiagram',
      beginnerContent:
        'A plant\'s children are its worst competitors. If every seed fell straight down, they\'d all crowd under the parent, fighting for the same patch of light and water. So plants launch, float, explode, and hitch rides to get their seeds as far away as possible.\n\n' +
        'Watch the diagram. Four strategies running simultaneously:\n\n' +
        '**Dandelion seeds** — those wispy parachutes drifting right? Each one is a masterpiece of fluid dynamics. In 2018, scientists discovered that the bristle disc creates a *separated vortex ring* — a donut of air that sits above the seed, generating drag without needing a solid wing. No human has designed anything like it. Terminal velocity: 0.3 m/s. Range in a breeze: **100+ km**.\n\n' +
        '**Maple seeds** — the spinning ones? They\'re autorotating like tiny helicopters. The asymmetric wing generates a leading-edge vortex (the same physics that keeps insects airborne). They spin at ~1,000 RPM as they descend.\n\n' +
        '**Touch-me-not pods** — the explosion in the right corner? The pod dries unevenly, building tension like a coiled spring. When it reaches breaking point, it snaps open at 4 m/s, launching seeds in every direction. Five metres in a tenth of a second.\n\n' +
        '**The bird** carrying a berry? That seed will pass through the bird\'s gut — stomach acid at pH 2 scarifies the seed coat, actually *improving* germination by 20-80%. The seed lands 5-50 km away, pre-packaged in fertilizer. The bird got a meal. The plant got a courier and a planting service.\n\n' +
        'The burdock plant\'s tiny hooks — which cling to fur and clothing — inspired Swiss engineer George de Mestral to invent **Velcro** in 1941. An orchid seed weighs 0.3 micrograms and can cross oceans on the wind. A coconut can float for months and germinate on a beach 3,000 km away. Plants can\'t move, so they made their children into projectiles, parachutes, and passengers.',
      intermediateContent:
        'Seed dispersal distance follows predictable physics.\n\n' +
        '**Wind dispersal — terminal velocity determines range:**\n\n' +
        '| Seed type | Structure | Terminal velocity | Mechanism | Range (5 m/s breeze) |\n' +
        '|-----------|----------|------------------|-----------|---------------------|\n' +
        '| Dandelion pappus | Porous bristle disc | 0.3 m/s | Separated vortex ring (discovered 2018) | 100+ km |\n' +
        '| Maple samara | Asymmetric wing | 0.9 m/s | Autorotation + leading-edge vortex | ~100 m |\n' +
        '| Orchid seed | Dust-like (no structure) | 0.04 m/s | Air resistance alone (near-neutral buoyancy) | 1,000+ km |\n' +
        '| Pine seed with wing | Winged | 1.2 m/s | Autorotation (slower than maple) | ~50 m |\n\n' +
        '**Animal dispersal — gut passage effects:**\n\n' +
        '| Factor | Typical value | Effect on seed |\n' +
        '|--------|-------------|---------------|\n' +
        '| Gut passage time | 30 min–24 hr | Determines dispersal distance |\n' +
        '| Stomach acid pH | 1.5–3.5 | Scarifies seed coat |\n' +
        '| Germination improvement | 20–80% | Acid weakens coat → faster water uptake |\n' +
        '| Elephant gut passage | 24–48 hr | Seeds deposited 5–50 km away with fertiliser |\n\n' +
        '**Worked example:** A dandelion seed (terminal velocity 0.3 m/s) released from 1 m height in still air takes 1/0.3 = 3.3 seconds to fall. In a 5 m/s wind, it travels 5 × 3.3 = 16.5 m. But updrafts can lift seeds to 1,000+ m altitude, where wind speeds reach 20–30 m/s and travel times extend to hours — explaining dispersal distances of 100+ km.',
      advancedContent:
        'Dispersal ecology connects to **metapopulation theory** and **island biogeography**.\n\n' +
        '| Model | Equation form | Key prediction |\n' +
        '|-------|-------------|----------------|\n' +
        '| Exponential kernel | P(d) ∝ e^(−d/λ) | Most seeds close, rapid falloff |\n' +
        '| 2Dt (fat-tailed) kernel | P(d) ∝ (1 + d²/u)^(−p) | Rare long-distance events shape range expansion |\n' +
        '| Clark et al. (1999) | Mixture of local + long-distance | Explains rapid post-glacial recolonisation |\n\n' +
        'Fat-tailed kernels are critical because rare long-distance dispersal events disproportionately determine species range expansion rates.\n\n' +
        '| Evidence type | Finding | Implication |\n' +
        '|-------------|---------|------------|\n' +
        '| Microsatellite parentage analysis | Bird-dispersed seeds found 100+ km from source | Long-distance dispersal is real, not theoretical |\n' +
        '| European pollen records | Post-glacial recolonisation at 100–500 m/year | Too fast for gravity/wind alone — animal vectors essential |\n' +
        '| *Hura crepitans* (sandbox tree) | Seeds launched at 70 m/s by explosive dehiscence | Elastic strain energy released catastrophically |\n\n' +
        '**NE India biogeography:** The Eastern Himalaya-NE India biodiversity hotspot has extraordinary endemism partly because the Brahmaputra valley acts as a **dispersal corridor** connecting Indo-Malayan and Palearctic floras — seeds carried by monsoon winds and migratory birds have created one of the most species-rich temperate forests on Earth.\n\n' +
        '| Dispersal vector | NE India relevance |\n' +
        '|-----------------|-------------------|\n' +
        '| Monsoon winds (June–Sept) | Carry orchid dust-seeds across the Brahmaputra valley |\n' +
        '| Migratory birds (Oct–Mar) | Transport berry seeds from SE Asia to NE India wetlands |\n' +
        '| Elephants | Megafaunal dispersal of large-seeded trees across Kaziranga–Manas corridor |\n' +
        '| Rivers (Brahmaputra) | Flood-dispersed seeds colonise new sandbars and chars annually |',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each seed dispersal method to its example',
          pairs: [
            ['Wind dispersal', 'Dandelion parachutes and maple helicopter seeds'],
            ['Water dispersal', 'Coconuts that float across oceans'],
            ['Animal ingestion', 'Berries eaten by birds, seeds deposited in droppings'],
            ['Animal attachment', 'Burdock hooks that cling to fur — the inspiration for Velcro'],
          ],
        },
      },
    },

    // ── Section 8: Plant Parts ──────────────────────────────────
    {
      title: 'Plant Parts and Their Functions',
      diagram: 'TejimolaPlantReproDiagram',
      beginnerContent:
        'Click any part of the plant in the diagram. Roots, stem, leaves, flower, fruit — each one lights up with its function. Now here\'s a question that will ruin your confidence: **what part of the plant is a potato?**\n\n' +
        'It looks like a root. It comes from underground. But it\'s a **stem**. Those "eyes" on a potato? They\'re buds. Plant one and stems sprout from them. A ginger root? Also a stem (a rhizome). An onion? It\'s **layers of modified leaves** wrapped around a tiny stem disc. A banana? Botanically, it\'s a **berry**. And the banana plant? Not a tree — a giant herb.\n\n' +
        '| What you think you\'re eating | What it actually is | The giveaway |\n' +
        '|----------------------------|--------------------|--------------|\n' +
        '| Potato = root | Underground **stem** (tuber) | Has buds ("eyes") — roots don\'t have buds |\n' +
        '| Ginger = root | Underground **stem** (rhizome) | Has segments and buds |\n' +
        '| Onion = root | Modified **leaves** | Peel the layers — each is a fleshy leaf base |\n' +
        '| Banana = fruit | A **berry** | Develops from a single ovary, flesh is the ovary wall |\n' +
        '| Rice grain = seed | A **fruit** | The husk IS the fruit wall, fused to the seed coat |\n' +
        '| Broccoli = vegetable | A cluster of **flower buds** | Leave it unpicked and it blooms yellow |\n\n' +
        'The real plant parts, honestly:\n\n' +
        '| Part | Job | What happens if you remove it |\n' +
        '|------|-----|------------------------------|\n' +
        '| **Roots** | Absorb water, anchor, store food | Plant falls over and dries out |\n' +
        '| **Stem** | Support + transport (xylem up, phloem down) | Leaves starve, roots dehydrate |\n' +
        '| **Leaves** | Photosynthesis — make all the food | Plant starves to death |\n' +
        '| **Flower** | Sex organs — produce pollen and ovules | No seeds, no next generation |\n' +
        '| **Fruit** | Protect seeds + recruit dispersers | Seeds rot on the ground |\n' +
        '| **Seed** | Baby plant + packed lunch | Species goes extinct |\n\n' +
        'Bamboo shoot (*khorisa*), banana flower (*kolphul*), fiddlehead fern (*dhekia xaak*), sesame seeds (*til*), *thekera* fruit — an Assamese kitchen is a tour of plant anatomy. Every dish is a different organ.',
      intermediateContent:
        '**Fruit classification:**\n\n' +
        'Fruits develop from the ovary wall after fertilisation. The diversity is enormous:\n\n' +
        '| Fruit type | How it forms | Structure | Example |\n' +
        '|-----------|-------------|-----------|------------------|\n' +
        '| **Drupe** (simple) | Single ovary, one seed | Fleshy outer + stony pit | Mango, olive, coconut |\n' +
        '| **Berry** (simple) | Single ovary, many seeds | Fleshy throughout | Tomato, banana, grape |\n' +
        '| **Pome** (simple) | Ovary + fleshy receptacle | Fleshy part is NOT the ovary | Apple, pear |\n' +
        '| **Aggregate** | Single flower, multiple ovaries | Cluster of small fruits | Raspberry, strawberry |\n' +
        '| **Multiple** | Cluster of many flowers | Fused fruits from many flowers | Pineapple, jackfruit |\n' +
        '| **Capsule** | Dry ovary that splits open | Releases seeds when dry | Orchid pod, cotton boll |\n\n' +
        '**Seed structure:**\n\n' +
        '| Component | Function | In rice | In mung bean |\n' +
        '|-----------|---------|--------|-------------|\n' +
        '| **Embryo** | The baby plant (radicle + plumule) | Tiny, at base of grain | Large, fills most of seed |\n' +
        '| **Endosperm** | Food reserve | Starchy — this is what we eat | Absorbed into cotyledons |\n' +
        '| **Seed coat (testa)** | Protection from damage, disease | Fused to fruit wall (husk) | Thin, green/brown skin |\n' +
        '| **Cotyledon(s)** | First "seed leaves" | 1 (monocot) | 2 (dicot) |\n\n' +
        '| Monocots (1 cotyledon) | Dicots (2 cotyledons) |\n' +
        '|----------------------|---------------------|\n' +
        '| Rice, bamboo, banana, orchid | Tea, mango, beans, mustard |\n' +
        '| Parallel leaf veins | Branching (net) leaf veins |\n' +
        '| Fibrous roots | Tap root system |\n' +
        '| Flower parts in 3s | Flower parts in 4s or 5s |',
      advancedContent:
        '**Fruit development — hormonal control:**\n\n' +
        'Fruit growth is regulated by **auxin** and **gibberellin** produced by developing seeds.\n\n' +
        '| Hormone | Source | Effect on fruit |\n' +
        '|---------|-------|----------------|\n' +
        '| Auxin | Developing seeds | Promotes cell division in ovary wall |\n' +
        '| Gibberellin | Developing seeds | Promotes cell expansion |\n' +
        '| Ethylene | Fruit tissue (ripening) | Triggers colour change, softening, sugar increase |\n\n' +
        '**Parthenocarpy** (seedless fruits): bananas result from natural hormone imbalances that trigger fruit growth without fertilisation. Seedless grapes are produced commercially via gibberellin sprays.\n\n' +
        '**The ABC model of flower development** (Coen & Meyerowitz, 1991):\n\n' +
        '| Gene class | Expression zone | Organ identity | Key genes |\n' +
        '|-----------|----------------|---------------|----------|\n' +
        '| **A alone** | Whorl 1 (outermost) | Sepals | AP1, AP2 |\n' +
        '| **A + B** | Whorl 2 | Petals | AP1 + AP3/PI |\n' +
        '| **B + C** | Whorl 3 | Stamens (male) | AP3/PI + AG |\n' +
        '| **C alone** | Whorl 4 (innermost) | Carpels (female) | AG |\n' +
        '| **E (SEPALLATA)** | All whorls | Required by all organs | SEP1-4 |\n\n' +
        '| Mutation | Predicted phenotype | Observed |\n' +
        '|---------|--------------------|---------|\n' +
        '| A loss (*ap2*) | Carpels-Stamens-Stamens-Carpels | Yes |\n' +
        '| B loss (*ap3*) | Sepals-Sepals-Carpels-Carpels | Yes |\n' +
        '| C loss (*ag*) | Sepals-Petals-Petals-Sepals (repeating) | Yes — "double flowers" |\n\n' +
        'These MADS-box transcription factors are conserved across 300 million years of angiosperm evolution. Comparative genomics of NE India orchids is revealing novel MADS-box duplications that explain the extraordinary flower diversity in the Eastern Himalaya — including the bizarre lip structures used to trap pollinators.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each plant part to its function',
          pairs: [
            ['Roots', 'Absorb water and minerals from the soil, anchor the plant'],
            ['Stem', 'Supports the plant and transports water and sugars'],
            ['Leaves', 'Capture sunlight and perform photosynthesis'],
            ['Flowers', 'Reproductive structures that produce pollen and ovules'],
            ['Fruit', 'Protects seeds and helps with seed dispersal'],
            ['Seeds', 'Contain the embryo and food store for a new plant'],
          ],
        },
      },
    },
  ]
};
