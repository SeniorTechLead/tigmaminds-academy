import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'nutrient-cycles',
  title: 'Nutrient Cycles',
  category: 'ecology',
  icon: '🌿',
  tagline: 'Carbon, nitrogen, water — the atoms that cycle endlessly through Earth\'s living systems.',
  relatedStories: ['girl-grew-forest', 'first-rice', 'kaziranga-grass'],
  understand: [
    // ── Section 1: The Water Cycle ───────────────────────────────
    {
      title: 'The Water Cycle',
      diagram: 'WaterCycleDiagram',
      beginnerContent:
        'Imagine a single drop of water. Over thousands of years, that same drop has been part of a glacier, a cloud, a river, a dinosaur\'s blood, and the cup of tea you drank this morning. Water is never created or destroyed — it just keeps moving.\n\n' +
        'The **water cycle** (hydrological cycle) has four main stages, each driven by solar energy and gravity:\n\n' +
        '| Stage | What happens | Key numbers |\n' +
        '|-------|-------------|-------------|\n' +
        '| **Evaporation** | Liquid water becomes vapor (oceans, lakes, rivers) | Oceans supply ~86% of atmospheric vapor |\n' +
        '| **Transpiration** | Plants release water through leaf pores (stomata) | A large tree releases 200–400 litres/day |\n' +
        '| **Condensation** | Vapor cools at altitude, forms cloud droplets around particles (dust, pollen, sea salt) | Clouds contain ~0.001% of Earth\'s water |\n' +
        '| **Precipitation** | Droplets coalesce and fall as rain, snow, sleet, or hail | Global average: ~1,000 mm/year over land |\n\n' +
        'Together, evaporation and transpiration are called **evapotranspiration** — the combined water loss from a landscape.\n\n' +
        'Once precipitation reaches the ground, it follows three paths:\n\n' +
        '| Path | Description | Timescale |\n' +
        '|------|------------|----------|\n' +
        '| **Surface runoff** | Flows across land into streams, rivers, and lakes | Hours to weeks |\n' +
        '| **Infiltration** | Seeps into soil to become groundwater | Days to thousands of years |\n' +
        '| **Plant uptake** | Absorbed by roots, returned to air via transpiration | Hours to days |\n\n' +
        'Some of the most extreme rainfall on Earth occurs in Meghalaya, where moisture-laden monsoon winds from the Bay of Bengal slam into the Khasi Hills. Cherrapunji and Mawsynram receive 10,000–12,000 mm per year — orographic lifting forces the air up, it cools, and water dumps out. Rain falling on Kaziranga\'s grasslands may have evaporated from the Bay of Bengal a week earlier and from a rice paddy in Thailand a month before that.\n\n' +
        '**Analogy:** Think of the water cycle as a giant distillery. The sun heats ocean water (the "still"), vapor rises and cools (the "condenser"), and pure water collects as rain (the "distillate"). Dissolved salts stay behind — which is why rain is fresh but the ocean is salty.',
      intermediateContent:
        '**Global water budget — where is all the water?**\n\n' +
        '| Reservoir | Volume (km³) | % of total | Avg. residence time |\n' +
        '|-----------|-------------|-----------|--------------------|\n' +
        '| Oceans | 1,335,000,000 | 96.5% | ~3,000 years |\n' +
        '| Glaciers & ice caps | 26,350,000 | 1.74% | ~10,000 years |\n' +
        '| Groundwater (fresh) | 10,530,000 | 0.76% | Days–10,000 years |\n' +
        '| Freshwater lakes | 91,000 | 0.007% | ~17 years |\n' +
        '| Soil moisture | 16,500 | 0.001% | 1–2 months |\n' +
        '| Atmosphere | 12,900 | 0.001% | ~10 days |\n' +
        '| Rivers | 2,120 | 0.0002% | ~2 weeks |\n\n' +
        'The global cycle moves about **505,000 km³** of water per year through evaporation and precipitation.\n\n' +
        '**Isotope tracing:** Hydrologists use ratios of heavy oxygen (¹⁸O) and heavy hydrogen (²H, deuterium) to trace water\'s journey. As air masses move poleward or upslope and cool, heavy isotopes preferentially condense out — a process called **Rayleigh distillation**. This produces a characteristic relationship:\n\n' +
        '`δ²H = 8 × δ¹⁸O + 10` (the Global Meteoric Water Line)\n\n' +
        'Deviations from this line reveal whether rain came from recycled continental moisture (transpiration adds vapor without isotopic fractionation) or direct oceanic evaporation.\n\n' +
        '**Worked example — monthly water balance (Thornthwaite method):**\n\n' +
        'For Guwahati, July: Precipitation (P) = 320 mm, Potential evapotranspiration (PET) = 140 mm.\n\n' +
        '`Water surplus = P − PET = 320 − 140 = 180 mm`\n\n' +
        'This 180 mm surplus recharges groundwater and feeds river flow. In contrast, February: P = 15 mm, PET = 60 mm → deficit of 45 mm. Plants draw on stored soil moisture, and farmers may need irrigation. The Brahmaputra basin runs surplus June–October (monsoon) and deficit December–April, driving the seasonal rhythm of agriculture and flooding.',
      advancedContent:
        '**Land-surface energy balance and climate feedbacks:**\n\n' +
        'The water cycle is tightly coupled to the energy budget of Earth\'s surface. The energy used to evaporate water is called **latent heat flux** (λE), and it represents a major pathway for cooling land surfaces.\n\n' +
        '| Component | Formula | Typical value (tropical forest) |\n' +
        '|-----------|---------|--------------------------------|\n' +
        '| Net radiation | Rn = (1−α)·Sw↓ + Lw↓ − Lw↑ | ~160 W/m² |\n' +
        '| Latent heat (evaporation) | λE | ~100 W/m² (~62%) |\n' +
        '| Sensible heat (warming air) | H | ~40 W/m² (~25%) |\n' +
        '| Ground heat flux | G | ~20 W/m² (~13%) |\n\n' +
        'The **Bowen ratio** (β = H / λE) characterizes a surface: forests have β ≈ 0.3–0.5 (most energy goes to evaporation), while deserts have β > 5 (most goes to heating air). Deforestation increases β — less evaporation, hotter surfaces, altered cloud formation.\n\n' +
        'The **Budyko framework** relates a watershed\'s long-term water balance to the aridity index (PET/P). As climate warms, evaporative demand increases faster than precipitation, shifting many regions toward water stress.\n\n' +
        '**Atmospheric rivers** — narrow corridors of concentrated water vapor flux — transport moisture from the Bay of Bengal into northeast India during active monsoon phases, delivering 20–50% of total seasonal rainfall in just a few events.\n\n' +
        '**Tracer hydrology** using tritium (³H, half-life 12.3 years) dates groundwater: water recharged before 1953 (pre-nuclear testing) has virtually no tritium, while post-1963 water has elevated levels. Many wells in the Brahmaputra floodplain draw water recharged 20–50 years ago — a sobering reminder that surface pollution today may not reach drinking water wells for decades.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Most of Earth\'s fresh water is in rivers and lakes.', answer: false, explanation: 'Most fresh water is locked in glaciers and ice caps (~69%) or underground as groundwater (~30%). Rivers and lakes hold less than 1% of fresh water.' },
            { text: 'A water molecule spends an average of about 10 days in the atmosphere before falling as precipitation.', answer: true, explanation: 'The average residence time of water in the atmosphere is roughly 10 days. It cycles fast — the atmosphere holds only 12,900 km³ at any time.' },
            { text: 'Transpiration from forests can increase regional rainfall.', answer: true, explanation: 'Forests recycle moisture back to the atmosphere via transpiration. In the Amazon, roughly half of all rainfall is recycled water from forest transpiration — deforestation reduces this "rain recycling."' },
            { text: 'Groundwater always flows faster than rivers.', answer: false, explanation: 'Groundwater typically moves centimetres to metres per day through pore spaces in rock and soil — far slower than river flow (metres per second). Some deep aquifers hold water thousands of years old.' },
          ],
        },
      },
    },

    // ── Section 2: The Carbon Cycle ──────────────────────────────
    {
      title: 'The Carbon Cycle',
      diagram: 'CarbonCycleDiagram',
      beginnerContent:
        'Carbon is the backbone of every living molecule — proteins, carbohydrates, fats, DNA. It cycles between the atmosphere, oceans, land, and living organisms through two interlocking loops.\n\n' +
        '**The fast (biological) loop** turns over carbon in years to decades:\n\n' +
        '| Process | Direction | What happens | Scale |\n' +
        '|---------|-----------|-------------|-------|\n' +
        '| **Photosynthesis** | Atmosphere → life | Plants absorb CO₂, build sugar: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ | ~120 Gt C/year |\n' +
        '| **Respiration** | Life → atmosphere | Animals and plants break down sugar, release CO₂ | ~120 Gt C/year |\n' +
        '| **Decomposition** | Dead matter → atmosphere/soil | Bacteria and fungi break down dead organisms | Weeks to years |\n' +
        '| **Ocean exchange** | Atmosphere ↔ ocean surface | CO₂ dissolves in cold water, released from warm water | ~90 Gt C/year each way |\n\n' +
        '**The slow (geological) loop** takes millions of years:\n\n' +
        '| Process | Direction | Timescale |\n' +
        '|---------|-----------|----------|\n' +
        '| Burial of organic matter → fossil fuels (coal, oil, gas) | Life → rock | Millions of years |\n' +
        '| Marine shells → limestone (CaCO₃) | Ocean → rock | Millions of years |\n' +
        '| Volcanic eruptions release CO₂ from deep rock | Rock → atmosphere | Episodic |\n' +
        '| Weathering of silicate rocks consumes CO₂ | Atmosphere → rock | Millions of years |\n\n' +
        'Think of the fast loop as cash circulating in an economy — constantly changing hands. The slow loop is like a bank vault — carbon locked away for ages.\n\n' +
        'A single planted forest illustrates the fast loop beautifully. Jadav Payeng\'s Molai forest on a sandbar in the Brahmaputra grew from bare sand to 550 hectares of dense woodland over 40 years. Each tree absorbs CO₂ and locks it into wood, leaves, and roots. A mature tropical forest stores 150–250 tonnes of carbon per hectare in above-ground biomass alone, plus a comparable amount in soil. Payeng\'s forest has sequestered an estimated 80,000–140,000 tonnes of carbon — pulled from the atmosphere and stored in living wood.',
      intermediateContent:
        '**Earth\'s carbon reservoirs — where carbon lives:**\n\n' +
        '| Reservoir | Carbon stored (Gt C) | Residence time |\n' +
        '|-----------|---------------------|---------------|\n' +
        '| Lithosphere (rocks, sediments) | ~66,000,000 | Millions of years |\n' +
        '| Ocean (dissolved inorganic + organic) | ~38,000 | Centuries–millennia |\n' +
        '| Fossil fuels (coal, oil, gas) | ~4,000 | Until humans extract them |\n' +
        '| Soils (organic carbon) | ~1,500 | Decades–centuries |\n' +
        '| Atmosphere (CO₂) | ~870 (at 420 ppm) | ~5 years (turnover) |\n' +
        '| Terrestrial vegetation | ~450 | Years–decades |\n' +
        '| Ocean surface layer | ~900 | Years–decades |\n\n' +
        '*Note: 1 Gt = 1 billion tonnes. Atmospheric CO₂ has a short residence time because molecules constantly exchange with oceans and vegetation — but the total amount keeps rising because inputs exceed removals.*\n\n' +
        '**Worked example — carbon flux calculation:**\n\n' +
        'A 1-hectare tropical forest gains biomass at 5 tonnes dry matter per hectare per year. Dry biomass is roughly 50% carbon.\n\n' +
        '`Carbon sequestered = 5 t/ha/yr × 0.50 = 2.5 t C/ha/yr`\n\n' +
        'Converting to CO₂ equivalents (multiply by 44/12, the ratio of CO₂ molecular weight to C atomic weight):\n\n' +
        '`CO₂ removed = 2.5 × (44/12) = 9.2 t CO₂/ha/yr`\n\n' +
        'For Payeng\'s 550-hectare forest: 9.2 × 550 ≈ **5,060 t CO₂/yr** — equivalent to taking about 1,100 cars off the road annually.\n\n' +
        '**The ocean\'s carbon pump:** Cold, high-latitude water absorbs more CO₂ (gases dissolve better in cold water). This CO₂-rich water sinks and flows toward the equator as deep ocean currents — the **solubility pump**. Meanwhile, marine phytoplankton fix CO₂ through photosynthesis, die, and sink — the **biological pump**. Together, oceans absorb about 2.5 Gt C/year of human emissions, but at a cost: dissolved CO₂ forms carbonic acid, lowering ocean pH from 8.2 to 8.1 since 1800 (a 26% increase in acidity).',
      advancedContent:
        '**Modelling the carbon cycle — box models and feedbacks:**\n\n' +
        'The simplest carbon cycle model treats each reservoir as a "box" with fluxes in and out:\n\n' +
        '`dC_atm/dt = F_fossil + F_respiration + F_decomposition − F_photosynthesis − F_ocean_uptake`\n\n' +
        'For the atmosphere today:\n\n' +
        '| Flux | Value (Gt C/yr) | Direction |\n' +
        '|------|----------------|----------|\n' +
        '| Fossil fuel burning | +9.5 | → atmosphere |\n' +
        '| Deforestation/land use | +1.5 | → atmosphere |\n' +
        '| Ocean uptake | −2.5 | ← atmosphere |\n' +
        '| Land sink (vegetation + soil) | −3.1 | ← atmosphere |\n' +
        '| **Net accumulation** | **+5.4** | Stays in atmosphere |\n\n' +
        'The fraction remaining in the atmosphere (~49%) is the **airborne fraction**. The rest is absorbed by oceans and land — but these sinks may weaken as temperatures rise.\n\n' +
        '**Key climate-carbon feedbacks:**\n\n' +
        '| Feedback | Mechanism | Sign |\n' +
        '|----------|-----------|------|\n' +
        '| CO₂ fertilisation | Higher CO₂ → faster photosynthesis → more uptake | Negative (stabilising) |\n' +
        '| Soil respiration | Warmer soils → faster decomposition → more CO₂ release | Positive (destabilising) |\n' +
        '| Permafrost thaw | Warming thaws frozen organic carbon → CO₂ and CH₄ release | Positive |\n' +
        '| Ocean solubility | Warmer water holds less dissolved CO₂ → weaker ocean sink | Positive |\n' +
        '| Vegetation dieback | Extreme heat/drought kills forests → carbon release | Positive |\n\n' +
        'The balance of these feedbacks determines whether Earth\'s carbon sinks will continue absorbing ~50% of human emissions or begin releasing stored carbon. Current Earth System Models (CMIP6) project that under high-emission scenarios (SSP5-8.5), the land sink weakens significantly by 2100, and the tropics may flip from carbon sink to source.\n\n' +
        '**Keeling Curve math:** Atmospheric CO₂ rises ~2.5 ppm/year. Each ppm corresponds to ~2.13 Gt C. So annual atmospheric accumulation ≈ 2.5 × 2.13 ≈ 5.3 Gt C/yr — consistent with the budget table above.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each carbon reservoir to its approximate size',
          pairs: [
            ['Atmosphere', '~870 Gt C (at 420 ppm CO₂)'],
            ['Oceans (total)', '~38,000 Gt C (dissolved inorganic + organic)'],
            ['Terrestrial vegetation', '~450 Gt C (in living plant biomass)'],
            ['Soils', '~1,500 Gt C (organic carbon in top 1 metre)'],
            ['Fossil fuels', '~4,000 Gt C (coal, oil, and natural gas reserves)'],
          ],
        },
      },
    },

    // ── Section 3: The Nitrogen Cycle ────────────────────────────
    {
      title: 'The Nitrogen Cycle',
      diagram: 'NitrogenCycleDiagram',
      beginnerContent:
        'Nitrogen makes up 78% of every breath you take, yet your body cannot use a single molecule of it directly. Atmospheric nitrogen (N₂) has a triple bond so strong that it takes extreme energy or specialised enzymes to break it.\n\n' +
        'Think of N₂ as a locked treasure chest. The nitrogen cycle is the set of keys that open it, pass the treasure around, and eventually lock it back up.\n\n' +
        '**The five key steps:**\n\n' +
        '| Step | What happens | Who does it | Product |\n' +
        '|------|-------------|------------|--------|\n' +
        '| **1. Fixation** | N₂ → NH₃ (ammonia) | *Rhizobium* in legume root nodules, *Azotobacter* in soil, lightning | Ammonia (NH₃) |\n' +
        '| **2. Nitrification** | NH₃ → NO₂⁻ → NO₃⁻ | *Nitrosomonas*, then *Nitrobacter* (aerobic soil bacteria) | Nitrate (NO₃⁻) |\n' +
        '| **3. Assimilation** | NO₃⁻ or NH₄⁺ absorbed by roots → built into amino acids, proteins, DNA | Plants, then animals that eat them | Organic nitrogen |\n' +
        '| **4. Ammonification** | Dead organisms → NH₃ | Decomposer bacteria and fungi | Ammonia returns to soil |\n' +
        '| **5. Denitrification** | NO₃⁻ → N₂ (back to atmosphere) | Anaerobic bacteria in waterlogged soil | Nitrogen gas — cycle complete |\n\n' +
        'Traditional farmers across South and Southeast Asia have long rotated legumes (beans, peas, lentils) with rice — unknowingly harnessing *Rhizobium* bacteria to replenish soil nitrogen between harvests. In northeast India, *Albizia* trees planted along field borders fix nitrogen year-round through root nodule symbiosis.\n\n' +
        'A flooded rice paddy is a complete nitrogen cycle in miniature. The waterlogged, oxygen-free mud just centimetres below the surface supports denitrifying bacteria, while the thin oxygenated surface layer supports nitrifiers. Cyanobacteria on the water surface fix atmospheric nitrogen. All five steps occur within a single field.\n\n' +
        '**Analogy:** Nitrogen fixation is like a factory converting raw ore (N₂) into usable metal (NH₃). Nitrification is the refinery (ammonia → nitrate). Assimilation is the manufacturer (nitrate → proteins). Ammonification is the recycling plant (dead organisms → ammonia again). Denitrification is shipping the scrap back to the mine (N₂ returns to the atmosphere).',
      intermediateContent:
        '**Global nitrogen budget — natural vs human:**\n\n' +
        '| Source of fixed nitrogen | Amount (Mt N/yr) | Notes |\n' +
        '|------------------------|-----------------|-------|\n' +
        '| Biological fixation (natural) | ~140 | Rhizobium, free-living bacteria, cyanobacteria |\n' +
        '| Lightning | ~5 | Enough energy to break N≡N bond |\n' +
        '| **Haber-Bosch process** | **~150** | **Industrial: N₂ + 3H₂ → 2NH₃ (high T, high P)** |\n' +
        '| Crop biological fixation | ~40 | Legume cultivation |\n' +
        '| Fossil fuel combustion (NOₓ) | ~30 | Vehicle exhaust, power plants |\n' +
        '| **Total human** | **~220** | **Exceeds all natural fixation** |\n\n' +
        'Humans now inject more reactive nitrogen into the biosphere than all natural processes combined. This is one of the most dramatic ways we have altered a global biogeochemical cycle.\n\n' +
        '**Worked example — nitrogen budget for a rice paddy:**\n\n' +
        'A farmer applies 120 kg N/ha as urea fertiliser. Where does it go?\n\n' +
        '| Fate | Fraction | Amount (kg N/ha) |\n' +
        '|------|---------|------------------|\n' +
        '| Crop uptake | ~40% | 48 |\n' +
        '| Denitrification (N₂, N₂O loss to atmosphere) | ~25% | 30 |\n' +
        '| Ammonia volatilisation (NH₃ gas loss) | ~15% | 18 |\n' +
        '| Leaching to groundwater (NO₃⁻) | ~10% | 12 |\n' +
        '| Remains in soil organic matter | ~10% | 12 |\n' +
        '| **Total** | **100%** | **120** |\n\n' +
        'Only 40% reaches the crop. The rest is lost — to the atmosphere, to waterways, or temporarily stored in soil. This poor efficiency is why nitrogen pollution is such a persistent problem: most of what we apply escapes.\n\n' +
        '**Nitrogen use efficiency (NUE):** World average is ~40%. Precision agriculture, slow-release fertilisers, and nitrification inhibitors can push NUE above 60%, reducing both pollution and farmer costs.',
      advancedContent:
        '**Nitrogenase — the enzyme that breaks the triple bond:**\n\n' +
        'The nitrogenase enzyme complex is the only biological system capable of reducing N₂ to NH₃:\n\n' +
        '`N₂ + 8H⁺ + 8e⁻ + 16ATP → 2NH₃ + H₂ + 16ADP + 16Pᵢ`\n\n' +
        '| Property | Detail |\n' +
        '|----------|--------|\n' +
        '| Metal cofactor | FeMo-cofactor (iron-molybdenum) |\n' +
        '| Oxygen sensitivity | Irreversibly destroyed by O₂ |\n' +
        '| Energy cost | 16 ATP per N₂ — the most expensive enzymatic reaction in biology |\n' +
        '| Protection strategy | Legume root nodules contain **leghemoglobin** (pink!) to scavenge O₂ |\n\n' +
        'The Haber-Bosch process mimics this reaction industrially: N₂ + 3H₂ → 2NH₃ at 400–500°C and 150–300 atm over an iron catalyst. It consumes ~1–2% of global energy and ~3–5% of natural gas production. Without it, roughly half the world\'s food production would not exist — the process feeds an estimated 4 billion people.\n\n' +
        '**Nitrogen cascade:** Unlike carbon (which returns cleanly to CO₂), a single atom of reactive nitrogen can cause a cascade of environmental impacts as it moves through different forms:\n\n' +
        '| Form | Impact |\n' +
        '|------|--------|\n' +
        '| NH₃ (ammonia) | Air pollution, fine particulate formation |\n' +
        '| NO₃⁻ (nitrate) | Groundwater contamination, "blue baby" syndrome |\n' +
        '| N₂O (nitrous oxide) | Greenhouse gas (298× CO₂ over 100 years), ozone destruction |\n' +
        '| NOₓ (nitrogen oxides) | Smog, acid rain, respiratory illness |\n' +
        '| Organic N (algal biomass) | Eutrophication, hypoxic dead zones |\n\n' +
        'One atom of fixed nitrogen may pass through *all* these forms before finally being denitrified back to N₂. This is why the **planetary boundary** for nitrogen (proposed at 62 Mt N/yr from industrial fixation) has been so dramatically exceeded — we are at ~150 Mt N/yr, nearly 2.5× the safe limit.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each nitrogen cycle step to what happens',
          pairs: [
            ['Nitrogen fixation', 'N₂ converted to NH₃ by Rhizobium bacteria or lightning'],
            ['Nitrification', 'NH₃ oxidised to NO₃⁻ by aerobic soil bacteria (Nitrosomonas, Nitrobacter)'],
            ['Assimilation', 'Plants absorb NO₃⁻ through roots, build amino acids and proteins'],
            ['Ammonification', 'Decomposers break dead organisms back into NH₃'],
            ['Denitrification', 'Anaerobic bacteria convert NO₃⁻ back to N₂ gas'],
          ],
        },
      },
    },

    // ── Section 4: Forest Carbon and Soil ────────────────────────
    {
      title: 'Forests: Living Carbon and Nutrient Banks',
      diagram: 'ForestCarbonCycleDiagram',
      beginnerContent:
        'A forest is not just trees — it is the largest land-based nutrient recycling machine on the planet. Every leaf that falls, every root that dies, every animal dropping returns carbon and nitrogen to the soil, where billions of organisms break it down and feed it back to growing plants.\n\n' +
        '**Where does a forest store its carbon?**\n\n' +
        '| Component | Carbon stored (t C/ha) | % of total | Lifespan |\n' +
        '|-----------|----------------------|-----------|----------|\n' +
        '| Above-ground biomass (trunks, branches, leaves) | 100–200 | 40–50% | Decades–centuries |\n' +
        '| Below-ground biomass (roots) | 20–50 | 10–15% | Years–decades |\n' +
        '| Soil organic carbon (top 1 m) | 100–200 | 40–50% | Years–millennia |\n' +
        '| Litter layer (dead leaves, twigs) | 5–15 | 2–5% | Months–years |\n' +
        '| Dead wood | 10–40 | 5–10% | Years–decades |\n\n' +
        '**The surprise:** Soil often holds as much carbon as the trees themselves. When a forest is cleared, both pools are lost — the trees are burned or rot, and exposed soil releases carbon as decomposition accelerates.\n\n' +
        '**Analogy:** A forest is like a savings account with two vaults. The trees are the visible vault — impressive but vulnerable to fire or logging. The soil is the hidden vault — slower to fill, slower to empty, and often larger. Good forest management protects both vaults.\n\n' +
        'In Assam\'s Kaziranga, the tall elephant grass sequesters carbon rapidly in both biomass and deep root systems. Annual flooding deposits fresh sediment rich in organic matter, building soil carbon year after year. The grassland is not just habitat for rhinos — it is a carbon bank built by the Brahmaputra.\n\n' +
        '**Quick check:** If a tropical forest stores 200 t C/ha above ground and you clear 10 hectares, roughly how many tonnes of CO₂ are released?\n\n' +
        '*Answer: 200 × 10 = 2,000 t C × (44/12) = ~7,300 t CO₂. That is just the above-ground portion — soil losses would add substantially more.*',
      intermediateContent:
        '**The nutrient recycling engine — litter decomposition:**\n\n' +
        'When leaves fall, they don\'t just vanish. Decomposition follows a predictable sequence:\n\n' +
        '| Stage | Time | What happens | Organisms |\n' +
        '|-------|------|-------------|----------|\n' +
        '| Leaching | Days | Rain washes out soluble sugars, phenolics | Physical |\n' +
        '| Fragmentation | Weeks | Invertebrates shred leaves into small pieces | Earthworms, millipedes, mites |\n' +
        '| Microbial colonisation | Weeks–months | Fungi and bacteria break down cellulose | Fungi (white rot, brown rot), bacteria |\n' +
        '| Humification | Months–years | Resistant compounds form stable humus | Slow microbial chemistry |\n\n' +
        'The rate of decomposition depends on the **C:N ratio** of the litter:\n\n' +
        '| Litter type | C:N ratio | Decomposition rate | Example |\n' +
        '|------------|----------|-------------------|--------|\n' +
        '| Legume leaves | 15:1 | Very fast (weeks) | *Albizia*, bean plants |\n' +
        '| Fresh grass | 25:1 | Fast (1–3 months) | Kaziranga elephant grass |\n' +
        '| Hardwood leaves | 50:1 | Moderate (6–12 months) | Sal, teak |\n' +
        '| Conifer needles | 80:1 | Slow (1–3 years) | Pine, spruce |\n' +
        '| Woody branches | 200:1+ | Very slow (years–decades) | Deadfall |\n\n' +
        'Why does C:N ratio matter? Soil microbes need nitrogen to build their own proteins. If litter is nitrogen-poor (high C:N), microbes must scavenge nitrogen from the surrounding soil — temporarily locking it up and making it unavailable to plants. Nitrogen-rich litter (low C:N) decomposes quickly and releases nitrogen for plant uptake.\n\n' +
        '**Worked example — litter turnover:**\n\n' +
        'A tropical forest produces 10 t/ha/yr of leaf litter. The standing litter stock on the forest floor is 5 t/ha.\n\n' +
        '`Turnover time = Stock / Input = 5 / 10 = 0.5 years`\n\n' +
        'Litter decomposes in about 6 months on average — fast recycling. In a boreal forest (cold, acidic), production might be 4 t/ha/yr but standing stock 20 t/ha → turnover time = 5 years. The thick litter layer in boreal forests is a direct consequence of slow decomposition.',
      advancedContent:
        '**Soil carbon dynamics — the two-pool model:**\n\n' +
        'Soil organic carbon exists in at least two functionally distinct pools:\n\n' +
        '| Pool | Turnover time | Stabilisation mechanism | Fraction of total |\n' +
        '|------|--------------|----------------------|------------------|\n' +
        '| **Active/labile** | Months–years | None — fresh litter, root exudates, microbial biomass | 5–15% |\n' +
        '| **Slow/passive** | Decades–millennia | Mineral association (organo-mineral complexes), physical occlusion in aggregates | 85–95% |\n\n' +
        'The RothC model (Rothamsted Carbon Model) simulates soil carbon dynamics using five compartments:\n\n' +
        '`dC/dt = Input × (DPM_fraction × k_DPM + RPM_fraction × k_RPM) − (k_BIO × C_BIO + k_HUM × C_HUM)`\n\n' +
        'Where DPM = decomposable plant material, RPM = resistant plant material, BIO = microbial biomass, HUM = humified organic matter.\n\n' +
        '**Temperature sensitivity:** Decomposition rate roughly doubles for each 10°C increase (Q₁₀ ≈ 2). This creates a dangerous climate feedback: warming accelerates soil carbon release, which further warms the climate. The ~1,500 Gt C in global soils is more than all atmospheric CO₂ and vegetation combined. If just 10% of soil carbon were released by warming:\n\n' +
        '`150 Gt C × (44/12) = 550 Gt CO₂`\n\n' +
        'For context, total human CO₂ emissions since 1750 are ~2,500 Gt CO₂. Soil carbon destabilisation is one of the most feared "tipping points" in climate science.\n\n' +
        '**Mycorrhizal networks:** Most forest trees form symbioses with mycorrhizal fungi, which extend root access to nutrients by orders of magnitude. Recent isotope-tracing studies (using ¹³C labelling) show that trees can transfer carbon to neighbouring trees through shared fungal networks — the "wood wide web." Mature trees subsidise shaded seedlings with up to 10% of their fixed carbon, a form of forest-level cooperation mediated by nutrient cycling.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Most of a forest\'s carbon is stored in the tree trunks, not the soil.', answer: false, explanation: 'Soil organic carbon often equals or exceeds above-ground biomass carbon. A tropical forest may store 100–200 t C/ha in trees AND 100–200 t C/ha in soil.' },
            { text: 'Litter with a high C:N ratio (like pine needles) decomposes faster than litter with a low C:N ratio (like legume leaves).', answer: false, explanation: 'High C:N litter decomposes slowly because microbes lack sufficient nitrogen to grow. Legume leaves (low C:N ~15:1) decompose in weeks; pine needles (C:N ~80:1) take years.' },
            { text: 'Warming soils release more CO₂, which could accelerate climate change.', answer: true, explanation: 'Decomposition approximately doubles with each 10°C rise (Q₁₀ ≈ 2). Soil holds ~1,500 Gt C globally — even a small fraction released by warming is significant.' },
            { text: 'Trees can share carbon with neighbouring trees through underground fungal networks.', answer: true, explanation: 'Mycorrhizal fungal networks (the "wood wide web") connect trees. Isotope tracing shows mature trees transfer carbon to seedlings through shared fungi.' },
          ],
        },
      },
    },

    // ── Section 5: Soil Layers and Nutrient Storage ──────────────
    {
      title: 'Soil: Where Cycles Meet',
      diagram: 'ForestSoilLayersDiagram',
      beginnerContent:
        'Soil is where the water, carbon, and nitrogen cycles intersect. It is not just "dirt" — it is one of the most complex ecosystems on Earth. A single teaspoon of healthy soil contains more microorganisms than there are humans on the planet.\n\n' +
        '**Soil forms in layers called horizons:**\n\n' +
        '| Horizon | Name | What it contains | Depth |\n' +
        '|---------|------|-----------------|-------|\n' +
        '| **O** | Organic | Fresh and decomposing litter (leaves, twigs, animal remains) | 0–5 cm |\n' +
        '| **A** | Topsoil | Dark, rich in humus — where roots, worms, and microbes concentrate | 5–30 cm |\n' +
        '| **B** | Subsoil | Lighter colour; minerals and clays washed down from above accumulate here | 30–100 cm |\n' +
        '| **C** | Parent material | Weathered rock fragments — the raw material from which soil forms | 100–200 cm |\n' +
        '| **R** | Bedrock | Unweathered solid rock | Below C |\n\n' +
        '**Analogy:** Soil horizons are like the layers of a cake. The O horizon is the frosting — thin but rich. The A horizon is the moist, flavourful layer beneath. The B horizon is the denser base. And the C horizon is the plate the cake sits on, slowly crumbling to become part of the cake itself.\n\n' +
        '**Why topsoil matters for nutrient cycling:**\n\n' +
        '| Property | Topsoil (A horizon) | Subsoil (B horizon) |\n' +
        '|----------|--------------------|-----------|\n' +
        '| Organic matter | 3–10% | <1% |\n' +
        '| Microbial density | Billions per gram | Millions per gram |\n' +
        '| Root density | Very high | Low |\n' +
        '| Nutrient availability | High (N, P, K cycling actively) | Low (nutrients locked in minerals) |\n' +
        '| Water-holding capacity | High (humus acts like a sponge) | Variable |\n\n' +
        'When topsoil erodes — through deforestation, overgrazing, or poor farming — nutrients accumulated over centuries wash away in a single monsoon season. The Brahmaputra carries enormous sediment loads (nearly 400 million tonnes per year), depositing fertile alluvial soil across its floodplain. This annual renewal is why the river valley has been farmed for millennia without the soil giving out.',
      intermediateContent:
        '**The soil nutrient triangle — N, P, K:**\n\n' +
        'Three elements limit plant growth more than any others:\n\n' +
        '| Nutrient | Chemical forms plants absorb | Role in the plant | Deficiency symptom |\n' +
        '|----------|---------------------------|------------------|-------------------|\n' +
        '| **Nitrogen (N)** | NO₃⁻, NH₄⁺ | Amino acids, proteins, chlorophyll, DNA | Yellowing of older leaves (chlorosis) |\n' +
        '| **Phosphorus (P)** | H₂PO₄⁻, HPO₄²⁻ | ATP, DNA, cell membranes, root growth | Purple/red leaves, stunted growth |\n' +
        '| **Potassium (K)** | K⁺ | Enzyme activation, water regulation, disease resistance | Brown leaf edges, weak stems |\n\n' +
        'Fertiliser bags are labelled with three numbers (e.g., 10-26-26) representing the percentage of N, P₂O₅, and K₂O by weight.\n\n' +
        '**Worked example — fertiliser calculation:**\n\n' +
        'A soil test says a rice field needs 120 kg N/ha, 60 kg P₂O₅/ha, 60 kg K₂O/ha. You have urea (46-0-0) for N and a compound fertiliser (0-26-26) for P and K.\n\n' +
        'Urea needed: `120 / 0.46 = 261 kg/ha`\n\n' +
        'Compound fertiliser needed: `60 / 0.26 = 231 kg/ha` (this also provides 231 × 0.26 = 60 kg K₂O/ha — perfect match)\n\n' +
        '**Cation Exchange Capacity (CEC):** Clay and humus particles carry negative surface charges that attract and hold positively charged nutrient ions (NH₄⁺, K⁺, Ca²⁺, Mg²⁺). This CEC acts as a nutrient "savings account" — plants make withdrawals, and decomposition makes deposits.\n\n' +
        '| Soil type | Typical CEC (meq/100g) | Nutrient-holding ability |\n' +
        '|-----------|----------------------|------------------------|\n' +
        '| Sandy soil | 3–5 | Poor — nutrients leach quickly |\n' +
        '| Loam | 10–25 | Moderate — balanced drainage and retention |\n' +
        '| Clay soil | 25–60 | High — but may hold nutrients too tightly |\n' +
        '| Humus-rich topsoil | 100–300 | Excellent — organic matter is the best nutrient sponge |\n\n' +
        'This is why adding compost (humus) improves any soil — it dramatically increases the soil\'s ability to hold and release nutrients on demand.',
      advancedContent:
        '**Soil biogeochemistry — redox chemistry in waterlogged soils:**\n\n' +
        'When soil floods (as in a rice paddy), oxygen is consumed within hours by aerobic microbes. Without O₂, anaerobic bacteria use alternative electron acceptors in a predictable sequence:\n\n' +
        '| Electron acceptor | Reduction reaction | Redox potential (Eh) | Product | Environmental effect |\n' +
        '|-------------------|-------------------|---------------------|---------|---------------------|\n' +
        '| O₂ | O₂ → H₂O | >+300 mV | Water | Normal aerobic decomposition |\n' +
        '| NO₃⁻ | NO₃⁻ → N₂, N₂O | +250 mV | N₂ gas, N₂O | **Denitrification** — nitrogen loss |\n' +
        '| Mn⁴⁺ | MnO₂ → Mn²⁺ | +200 mV | Soluble Mn | Can become toxic to plants |\n' +
        '| Fe³⁺ | Fe(OH)₃ → Fe²⁺ | +100 mV | Soluble Fe | Gives waterlogged soil grey colour |\n' +
        '| SO₄²⁻ | SO₄²⁻ → H₂S | −150 mV | Hydrogen sulfide | Rotten-egg smell, toxic to roots |\n' +
        '| CO₂ | CO₂ → CH₄ | −200 mV | **Methane** | Potent greenhouse gas (28× CO₂) |\n\n' +
        'This redox ladder explains why flooded rice paddies are a major source of both N₂O (from denitrification) and CH₄ (from methanogenesis). Together, rice paddies contribute ~10% of global methane emissions.\n\n' +
        '**Alternate wetting and drying (AWD)** — a water management technique that periodically drains paddies — interrupts the redox ladder by re-introducing oxygen. AWD can reduce methane emissions by 30–50% while saving 15–30% of irrigation water, with minimal yield loss. It works because methanogens (the CH₄-producing archaea) are strict anaerobes that die when exposed to oxygen.\n\n' +
        '**Phosphorus — the non-cycling nutrient:** Unlike carbon and nitrogen, phosphorus has no significant gaseous phase. It cycles only through rock weathering → soil → organisms → soil/water → sediment → rock (millions of years to close the loop). This makes phosphorus the ultimate limiting nutrient on geological timescales. Economically recoverable phosphate rock reserves may last only 300–400 years at current extraction rates, making phosphorus recycling (from wastewater, manure, and crop residues) a long-term food security imperative.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each soil horizon to its description',
          pairs: [
            ['O horizon', 'Surface layer of fresh and decomposing organic litter'],
            ['A horizon (topsoil)', 'Dark, humus-rich layer — most roots, worms, and microbes live here'],
            ['B horizon (subsoil)', 'Accumulation zone — minerals and clays washed down from above'],
            ['C horizon', 'Weathered parent rock fragments — raw material for soil formation'],
            ['R horizon', 'Unweathered solid bedrock beneath all soil layers'],
          ],
        },
      },
    },

    // ── Section 6: Human Disruption of Nutrient Cycles ───────────
    {
      title: 'Human Disruption of Nutrient Cycles',
      beginnerContent:
        'Humans have profoundly altered every major nutrient cycle. The scale of disruption is difficult to overstate.\n\n' +
        '**The three big disruptions at a glance:**\n\n' +
        '| Cycle | What humans changed | Scale of disruption | Key consequence |\n' +
        '|-------|--------------------|--------------------|----------------|\n' +
        '| **Carbon** | Burning fossil fuels, deforestation | +11 Gt C/yr added to atmosphere | Global warming, ocean acidification |\n' +
        '| **Nitrogen** | Haber-Bosch fertiliser, fossil fuel combustion | 220 Mt N/yr fixed (vs 145 Mt natural) | Eutrophication, dead zones, N₂O emissions |\n' +
        '| **Water** | Deforestation, dams, groundwater extraction, urbanisation | 54% of accessible runoff appropriated | Floods, droughts, aquifer depletion |\n\n' +
        '**Carbon disruption:** Burning fossil fuels releases carbon that was locked away over millions of years — in geological terms, we are running the slow carbon cycle in fast-forward. Atmospheric CO₂ has risen from 280 ppm (pre-industrial) to over 420 ppm, higher than at any point in 800,000 years. This is the primary driver of global warming.\n\n' +
        '**Nitrogen disruption:** The Haber-Bosch process (invented 1913) feeds roughly 4 billion people — but most applied nitrogen escapes into the environment. Fertiliser runoff stimulates explosive algal growth in lakes and coastal waters. When the algae die and decompose, bacteria consume all the dissolved oxygen, creating hypoxic "dead zones" where fish suffocate. The Gulf of Mexico dead zone, fed by Mississippi River fertiliser runoff, covers up to 22,000 km² in summer — the size of a small country.\n\n' +
        '**Water disruption:** Deforestation reduces transpiration and increases runoff, intensifying both floods and droughts — the same change makes *both* extremes worse. Dams alter river flow and trap sediment. Groundwater extraction depletes aquifers faster than rainfall recharges them. In the Brahmaputra catchment, deforestation upstream has intensified monsoon flooding while worsening dry-season water scarcity downstream.\n\n' +
        '**Analogy:** Imagine three bank accounts (carbon, nitrogen, water) that nature kept in careful balance over millions of years. In the last 200 years, humans have been making massive unauthorized withdrawals from some accounts and dumping excess into others — the balance sheets no longer add up.',
      intermediateContent:
        '**Tracking the damage — planetary boundaries:**\n\n' +
        'Scientists have proposed quantitative "safe limits" for human interference with Earth systems:\n\n' +
        '| Boundary | Safe limit | Current status | Assessment |\n' +
        '|----------|-----------|---------------|------------|\n' +
        '| CO₂ concentration | 350 ppm | 424 ppm (2024) | Exceeded |\n' +
        '| Nitrogen fixation | 62 Mt N/yr (industrial) | ~150 Mt N/yr | Exceeded by 2.4× |\n' +
        '| Phosphorus flow to oceans | 11 Mt P/yr | ~22 Mt P/yr | Exceeded by 2× |\n' +
        '| Freshwater use | 4,000 km³/yr | ~4,000 km³/yr | At boundary |\n' +
        '| Land-system change | 75% forest cover maintained | ~62% remaining | Exceeded |\n\n' +
        '**Worked example — eutrophication from fertiliser runoff:**\n\n' +
        'A 10,000-hectare farming region applies an average of 80 kg N/ha/yr. If 10% leaches into a nearby lake:\n\n' +
        '`Nitrogen entering lake = 10,000 ha × 80 kg/ha × 0.10 = 80,000 kg N/yr = 80 tonnes N/yr`\n\n' +
        'If the lake volume is 50 million m³:\n\n' +
        '`Concentration increase = 80,000 kg / 50,000,000 m³ = 1.6 mg/L per year`\n\n' +
        'Eutrophication threshold is typically 0.5–1.0 mg N/L. Within a single year, this lake crosses from healthy to eutrophic. In practice, some nitrogen is removed by denitrification and plant uptake, but the calculation shows how quickly the balance tips.\n\n' +
        '**Carbon maths — the remaining budget:**\n\n' +
        'To keep warming below 1.5°C, the remaining carbon budget (from 2024) is roughly 250 Gt CO₂. At current emissions of ~40 Gt CO₂/yr:\n\n' +
        '`Time remaining = 250 / 40 ≈ 6 years`\n\n' +
        'For 2°C, the budget is ~1,000 Gt CO₂ → ~25 years at current rates. Every forest planted, every emission avoided, extends the timeline.',
      advancedContent:
        '**Coupled biogeochemical modelling — why cycles interact:**\n\n' +
        'The carbon, nitrogen, and water cycles are not independent. Changes in one cascade through the others:\n\n' +
        '| Interaction | Mechanism | Consequence |\n' +
        '|-------------|-----------|-------------|\n' +
        '| N limits C uptake | Plants need nitrogen to build photosynthetic enzymes (RuBisCO) | CO₂ fertilisation effect is limited by nitrogen availability |\n' +
        '| Water limits N cycling | Nitrification requires aerobic conditions; denitrification requires anaerobic | Flooding/drainage controls whether nitrogen is retained or lost |\n' +
        '| C fuels N cycling | Denitrifying bacteria need organic carbon as an energy source | Carbon-poor soils retain more nitrate (less denitrification) |\n' +
        '| Warming accelerates all | Higher temperature → faster decomposition → more CO₂, more N₂O | Multiple positive feedbacks compound |\n\n' +
        'Earth System Models (ESMs) used in IPCC projections now couple carbon-nitrogen-water interactions. A key finding: models that include nitrogen limitation project **20–30% less carbon uptake by land ecosystems** by 2100 compared to carbon-only models. This means climate projections that ignore nitrogen overestimate the land carbon sink and *underestimate* warming.\n\n' +
        '**Stoichiometric constraints — the Redfield ratio extended to land:**\n\n' +
        'In oceans, phytoplankton maintain a remarkably consistent C:N:P ratio of 106:16:1 (the Redfield ratio). On land, ratios are more variable:\n\n' +
        '| Component | C:N:P ratio | Implication |\n' +
        '|-----------|------------|-------------|\n' +
        '| Phytoplankton | 106:16:1 | Ocean nutrient cycling benchmark |\n' +
        '| Terrestrial leaves | 500:25:1 | Much more carbon-rich, less P |\n' +
        '| Soil organic matter | 186:13:1 | Enriched in N and P relative to leaves |\n' +
        '| Soil microbes | 60:7:1 | Most nutrient-dense pool |\n\n' +
        'These ratios constrain how fast ecosystems can grow: even with unlimited CO₂ and water, a forest cannot accumulate more carbon without proportional nitrogen and phosphorus. This is why simply planting trees is not a complete climate solution — the trees need nutrients, and nutrient cycles are already strained.\n\n' +
        '**The integrated solution:** Restoring nutrient cycles requires simultaneous action across all three:\n' +
        '- **Carbon:** Reduce fossil fuel use, protect and restore forests, improve soil carbon management\n' +
        '- **Nitrogen:** Improve fertiliser efficiency (precision agriculture, slow-release formulations), recycle nitrogen from waste streams\n' +
        '- **Water:** Protect watersheds, restore wetlands (natural nutrient filters), reduce impervious surfaces\n\n' +
        'Nature does not cycle nutrients one at a time. Neither can our solutions.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'Atmospheric CO₂ is higher now than at any point in the past 800,000 years.', answer: true, explanation: 'CO₂ has risen from a pre-industrial 280 ppm to over 420 ppm, driven by fossil fuel burning and deforestation. Ice core records confirm this is unprecedented in at least 800,000 years.' },
            { text: 'Humans now fix more nitrogen artificially (via the Haber-Bosch process) than all natural processes combined.', answer: true, explanation: 'About 150 million tonnes per year artificially versus ~145 million tonnes by bacteria and lightning — a remarkable reversal of the natural balance.' },
            { text: 'Deforestation only causes droughts, not floods.', answer: false, explanation: 'Deforestation reduces transpiration and increases surface runoff, making both floods AND droughts worse. Less water is recycled through the atmosphere (drought), and more runs off the surface at once (flooding).' },
            { text: 'Fertiliser runoff causes algal blooms that can kill fish by depleting oxygen.', answer: true, explanation: 'This process is called eutrophication. Excess nutrients stimulate explosive algal growth. When the algae die and decompose, bacteria consume dissolved oxygen, suffocating fish and other aquatic life.' },
            { text: 'The carbon, nitrogen, and water cycles operate independently of each other.', answer: false, explanation: 'The cycles are deeply coupled. Nitrogen limits carbon uptake by plants, water controls whether nitrogen is retained or lost from soil, and carbon provides energy for nitrogen-cycling bacteria. Earth System Models must simulate all three together.' },
          ],
        },
      },
    },
  ],
};
