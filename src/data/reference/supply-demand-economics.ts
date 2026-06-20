import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'supply-demand-economics',
  title: 'Supply, Demand & Market Economics',
  category: 'economics',
  icon: '📈',
  tagline: 'Why prices change, how markets work, and the invisible forces behind every transaction.',
  relatedStories: ['night-market-imphal', 'market-day-tura'],
  understand: [
    {
      title: 'Supply and Demand — The Two Forces Behind Every Price',
      diagram: 'SupplyDemandCurveDiagram',
      beginnerContent:
        'Every price you have ever paid is the result of two opposing forces pushing against each other: **demand** (what buyers want) and **supply** (what sellers offer).\n\n' +
        '**Demand** is the quantity of a good consumers are willing and able to buy at a given price. The **law of demand**: as price rises, quantity demanded falls — and vice versa.\n\n' +
        '• If Assam tea doubles in price, some buyers switch to coffee or simply drink less\n' +
        '• Plotted with price up the side and quantity along the bottom, the demand curve slopes **downward**\n\n' +
        '**Supply** is the quantity producers are willing and able to sell at a given price. The **law of supply**: as price rises, quantity supplied rises too — higher prices give producers more incentive and more revenue.\n\n' +
        '• A tea grower earning ₹300/kg will plant more bushes than one earning ₹100/kg\n' +
        '• On a graph, the supply curve slopes **upward**\n\n' +
        'Where the two curves cross is the **equilibrium point** — the price at which the quantity buyers want exactly equals the quantity sellers offer. At this price the market "clears": no surplus, no shortage.\n\n' +
        '• **Price too high** → sellers can\'t sell everything → surplus forms → price pushed down\n' +
        '• **Price too low** → buyers can\'t find enough → shortage forms → price pushed up\n\n' +
        'This self-correcting mechanism is what Adam Smith called the **"invisible hand."** Real markets are messier — sticky prices, regulations, imperfect information, and emotional decisions all cause deviations — but supply and demand remain the single most useful framework for understanding why prices are what they are.',
      intermediateContent:
        'Price elasticity of demand (PED) measures how sensitive quantity demanded is to price changes: PED = % change in quantity / % change in price. If tea price rises 10% and demand falls 5%, PED = −0.5 (inelastic — people keep buying). Necessities (rice, medicine) tend to have PED between 0 and −1; luxuries (electronics, restaurant meals) have PED < −1 (elastic). Example: Assam CTC tea has estimated PED ≈ −0.3 (very inelastic) because habitual tea drinkers treat it as essential. Revenue = price × quantity, so raising prices on inelastic goods increases total revenue — which is why governments tax inelastic goods (petrol, tobacco).',
      advancedContent:
        'General equilibrium theory (Walras, Arrow-Debreu) proves that under certain conditions, a set of prices exists that simultaneously clears ALL markets. The First Welfare Theorem states that competitive equilibrium is Pareto efficient — no one can be made better off without making someone worse off. However, efficiency does not imply equity — an economy where one person owns everything is Pareto efficient. Market failures (externalities, public goods, information asymmetry, market power) cause real markets to deviate from the theoretical ideal. Environmental pollution is the classic negative externality — the market price of goods does not include the cost of pollution, leading to overproduction. Carbon pricing (taxes or cap-and-trade) attempts to "internalize" this externality.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each economic term to its definition',
          pairs: [
            ['Demand', 'The quantity buyers are willing and able to purchase at a given price'],
            ['Supply', 'The quantity sellers are willing and able to offer at a given price'],
            ['Equilibrium price', 'The price at which quantity demanded equals quantity supplied'],
            ['Surplus', 'Excess supply when the price is above equilibrium'],
            ['Shortage', 'Excess demand when the price is below equilibrium'],
          ],
        },
      },
    },
    {
      title: 'Market Types — From Perfect Competition to Monopoly',
      diagram: 'MarketTypesSpectrumDiagram',
      beginnerContent:
        'Not all markets work the same way. Economists classify them by **how many sellers** there are, **how similar** the products are, and **how easy** it is to enter or leave. This gives four main structures, from most competitive to least:\n\n' +
        '**1. Perfect competition** — many small sellers, identical products, easy entry. No single seller can move the price.\n\n' +
        '• Weekly vegetable markets in Tura or Imphal come close — dozens of farmers sell near-identical tomatoes\n' +
        '• Charge too much and buyers just walk to the next stall, so prices stay in a narrow band\n\n' +
        '**2. Monopolistic competition** — many sellers, but *differentiated* products. Sellers compete on quality, branding, and reputation.\n\n' +
        '• Restaurants, clothing brands, handloom weavers\n' +
        '• A Muga silk weaver in Sualkuchi charges more than a generic seller because the product is seen as unique and artisanal\n\n' +
        '**3. Oligopoly** — a few large sellers dominate. Each firm\'s pricing directly affects the others.\n\n' +
        '• India\'s telecom sector: Jio, Airtel, and Vi hold the vast majority of subscribers\n' +
        '• Leads to strategic behaviour: price wars, collusion, or tacit agreement to keep prices stable\n\n' +
        '**4. Monopoly** — a single seller, no close substitutes.\n\n' +
        '• Indian Railways in long-distance rail — no competing network, so fares are set centrally\n' +
        '• Monopolists can charge more because consumers have no alternative — which is why governments regulate or break them up (antitrust law)\n\n' +
        'Market structure explains why some goods are cheap and others expensive, and why some industries are dominated by giants while others stay fragmented.',
      intermediateContent:
        'The Herfindahl-Hirschman Index (HHI) measures market concentration: sum of squared market shares. A monopoly: HHI = 10,000. Perfect competition (many equal firms): HHI → 0. India\'s telecom sector: Jio (~37%), Airtel (~33%), Vi (~22%), BSNL (~8%) → HHI ≈ 37² + 33² + 22² + 8² = 1,369 + 1,089 + 484 + 64 = **3,006** (moderately concentrated). Game theory models oligopoly behavior: in the Prisoner\'s Dilemma, two firms both cutting prices is the Nash equilibrium even though both would profit more from maintaining high prices — which is why cartels are unstable.',
      advancedContent:
        'Behavioral economics (Kahneman, Thaler) shows that real humans deviate systematically from rational economic behavior. Loss aversion means people weigh losses 2-3× more heavily than equivalent gains. The endowment effect means people overvalue what they already own. Anchoring means the first number you see biases your judgment. These biases are exploited in pricing strategies (₹999 vs ₹1,000, "was ₹2,000 now ₹1,200") and have policy implications — "nudge" theory uses choice architecture to guide better decisions without restricting freedom (e.g., making organ donation opt-out instead of opt-in doubles participation rates).',
    },
    {
      title: 'Trade and Comparative Advantage',
      diagram: 'ComparativeAdvantageDiagram',
      beginnerContent:
        'Why do regions trade instead of producing everything themselves? The answer is **comparative advantage** — one of the most powerful ideas in economics.\n\n' +
        'A region has a comparative advantage in a good if it can produce it at a lower **opportunity cost** than others. Opportunity cost is simply *what you give up* to produce something.\n\n' +
        '• **Assam** → tea: its climate, soil, and labour suit tea; those same resources would add less value making electronics\n' +
        '• **Tamil Nadu** → cars: established factories, skilled workforce, and supply chains\n\n' +
        'The surprising part: even if one region is better at producing *everything* (an absolute advantage), **both sides still gain from trade** as long as their opportunity costs differ. This is David Ricardo\'s 1817 insight, still the foundation of trade theory.\n\n' +
        'When Assam exports tea and Muga silk and imports machinery, both Assam and the manufacturing regions end up with **more total goods** than if each went it alone.\n\n' +
        'North-East India\'s trade shows this in action:\n\n' +
        '• **Exports** — tea (Assam grows 50%+ of India\'s), Muga silk (found nowhere else on Earth), Meghalaya\'s lakadong turmeric (prized for high curcumin), bamboo products\n' +
        '• **Imports** — manufactured goods, petroleum products (despite local oil — refining is the bottleneck), many food staples\n' +
        '• **Border trade** — growing with Myanmar, Bangladesh, and Bhutan via border *haats* where communities exchange goods with minimal formality\n\n' +
        'These patterns aren\'t random — they reflect each region\'s comparative advantages, shaped by geography, climate, skills, and infrastructure.',
      intermediateContent:
        'Calculating comparative advantage: if Assam can produce 100 kg tea or 50 kg electronics per worker, and Tamil Nadu can produce 60 kg tea or 80 kg electronics per worker, then Assam\'s opportunity cost of 1 kg tea = 0.5 kg electronics, while Tamil Nadu\'s = 80/60 = 1.33 kg electronics. Assam has comparative advantage in tea (lower opportunity cost). Tamil Nadu\'s opportunity cost of 1 kg electronics = 60/80 = 0.75 kg tea vs Assam\'s 50/100 = 2 kg tea. Tamil Nadu has comparative advantage in electronics. Both gain from trade when Assam exports tea and imports electronics.',
      advancedContent:
        'The Heckscher-Ohlin model predicts that countries export goods that intensively use their abundant factors of production. India, abundant in labor, exports labor-intensive goods (textiles, software services) and imports capital-intensive goods (machinery). However, the Leontief paradox showed the US (capital-abundant) exported labor-intensive goods — explained by human capital differences. Modern trade theory (Krugman, 2008 Nobel) emphasizes economies of scale and product differentiation: countries trade similar products (Germany and Japan both export cars) because consumers value variety and firms benefit from specialization. Global value chains mean a single product (iPhone) involves components from 40+ countries.',
    },
    {
      title: 'Money, Inflation, and Purchasing Power',
      diagram: 'InflationPurchasingPowerDiagram',
      beginnerContent:
        '**Money** is one of humanity\'s most important inventions. It serves three purposes:\n\n' +
        '• **Medium of exchange** — trade money for goods instead of bartering chickens for rice\n' +
        '• **Unit of account** — prices in rupees make comparison easy\n' +
        '• **Store of value** — save today, spend next month\n\n' +
        'Before money, trade needed a "double coincidence of wants": a fisherman wanting rice had to find a rice farmer who wanted fish. Money removes that problem entirely.\n\n' +
        '**Inflation** is a sustained rise in the general price level. At 6% a year, ₹100 today costs ₹106 next year and about ₹179 in ten years.\n\n' +
        'Inflation erodes **purchasing power** — how much a rupee can buy. If your salary stays at ₹30,000 while prices rise 6%, you afford less each year even though your *nominal* income is unchanged. Your **real income** (adjusted for inflation) has fallen.\n\n' +
        'Inflation has a few distinct causes:\n\n' +
        '• **Demand-pull** — too much money chasing too few goods (government prints money, or a boom puts more cash in pockets)\n' +
        '• **Cost-push** — production costs rise (diesel jumps → transporting vegetables costs more → passed to consumers)\n' +
        '• **Supply shocks** — floods destroy crops or a pandemic halts factories, causing sudden spikes\n\n' +
        'In NE India this is vivid: when monsoon flooding cuts roads to Guwahati, onions and cooking oil can spike **30–50% in days** — supply collapses while demand holds steady.\n\n' +
        'The **Reserve Bank of India** manages inflation mainly through interest rates: raising rates makes borrowing costlier, slowing spending and cooling demand-pull pressure. Inflation matters because it touches savings, wages, loan costs, and the real value of every rupee you earn.',
      intermediateContent:
        'The quantity theory of money: MV = PQ, where M = money supply, V = velocity (how often each rupee is spent), P = price level, Q = real output. If M increases faster than Q (and V is stable), P rises — inflation. The RBI targets 4% inflation (±2%) using the repo rate — the interest rate at which it lends to banks. Raising the repo rate makes borrowing expensive, reducing money supply and cooling demand. Real interest rate = nominal rate − inflation rate. A savings account at 6% nominal with 5% inflation gives only 1% real return — your purchasing power barely grows.',
      advancedContent:
        'Modern Monetary Theory (MMT) challenges orthodox economics by arguing that governments issuing their own currency cannot "run out of money" — they can always print more. The constraint is not solvency but inflation: too much spending relative to productive capacity causes prices to rise. MMT suggests using taxation (not borrowing) as the primary tool to control inflation. Central bank digital currencies (CBDCs) — digital rupees issued by the RBI — could enable precise monetary policy: negative interest rates (charging banks to hold reserves), helicopter money (direct transfers to citizens), and programmable money (that expires if unspent, forcing spending during recessions). India\'s e-rupee pilot, launched in 2022, explores these possibilities.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'If your salary doubles but prices also double, you are better off financially.', answer: false, explanation: 'Your purchasing power remains exactly the same — you can buy the same quantity of goods as before. Real income is unchanged.' },
            { text: 'In a monopoly, the single seller can charge any price they want without limit.', answer: false, explanation: 'Even a monopolist is constrained by demand — if they set the price too high, consumers will buy less or find substitutes. They maximize profit, not price.' },
            { text: 'Comparative advantage means a region should specialize in what it produces at the lowest opportunity cost.', answer: true, explanation: 'This is the core principle — even if a region is not the absolute best at anything, it benefits by specializing in the product where its relative efficiency is highest.' },
            { text: 'Flooding in Assam can cause the price of vegetables to rise in Guwahati markets.', answer: true, explanation: 'Supply disruptions reduce the quantity of goods reaching the market while demand stays the same, pushing the equilibrium price upward.' },
            { text: 'Barter economies are more efficient than money-based economies.', answer: false, explanation: 'Barter requires a double coincidence of wants and makes price comparison extremely difficult. Money dramatically reduces transaction costs.' },
          ],
        },
      },
    },
    {
      title: 'Supply Chain Economics',
      diagram: 'SupplyChainDiagram',
      beginnerContent:
        'When you buy a cotton shirt for ₹500, how much reaches the farmer who grew the cotton? Often **less than 5%**. The rest is absorbed by a chain of **intermediaries** — each adding a **markup** to cover costs and earn a profit:\n\n' +
        '• Cotton trader → spinning mill → weaving factory → garment manufacturer → brand → wholesaler → retailer\n\n' +
        'This path from raw material to final buyer is the **supply chain**.\n\n' +
        '**Why do markups compound so fast?** Each intermediary faces transport, storage, labour, rent, and risk, and adds a percentage on top of *their* purchase price:\n\n' +
        '• Five intermediaries each adding 30% → final price = 1.3⁵ = **3.71×** the original cost\n' +
        '• That\'s a 271% total markup even though each single step looks modest\n\n' +
        'The **value-to-weight ratio** decides how far a good can travel profitably:\n\n' +
        '• **Saffron** — worth more than gold by weight, so transport cost barely matters → traded globally\n' +
        '• **Sand** — cheap and heavy, so long-distance shipping is uneconomical → you buy it local\n' +
        '• **Tea** — moderate ratio → Assam tea reaches the world but competes on price with closer growers\n\n' +
        'Shorter chains mean producers keep more of the final price. India\'s **ONDC** (Open Network for Digital Commerce) and **farmer producer organizations (FPOs)** both aim to cut out intermediaries and raise farmer incomes.',
      intermediateContent:
        'The **markup multiplier** through n intermediaries with individual markups m₁, m₂, …, mₙ is: ' +
        'Final price = Base cost × (1+m₁)(1+m₂)…(1+mₙ). For uniform 25% markups through 4 stages: ' +
        'P = C × 1.25⁴ = **2.44C** (a 144% total markup). The **Herfindahl-Hirschman Index** (HHI) ' +
        'measures market concentration: HHI = Σsᵢ², where sᵢ is the market share of firm i (as a ' +
        'percentage). HHI < 1,500 = competitive; 1,500-2,500 = moderately concentrated; > 2,500 = ' +
        'highly concentrated. Transport cost as fraction of value: for rice at ₹30/kg, truck transport ' +
        'at ₹2/km/tonne over 500 km adds ₹1/kg (3.3% of value). For sand at ₹0.50/kg, the same ' +
        'transport adds 200% of value — explaining why sand markets are hyper-local.',
      advancedContent:
        'Supply chain optimization uses **linear programming** (minimize total cost subject to capacity ' +
        'and demand constraints) and **network flow models**. The **bullwhip effect** amplifies demand ' +
        'variability upstream: a 10% retail demand fluctuation can become 40% at the manufacturer — ' +
        'caused by order batching, demand signal processing, rationing, and price fluctuations (Lee et al., ' +
        '1997). **Transaction cost economics** (Coase, Williamson) explains vertical integration: firms ' +
        'absorb supply chain steps when market transaction costs (search, bargaining, enforcement) exceed ' +
        'internal coordination costs. Blockchain-based supply chain tracking provides provenance transparency, ' +
        'reducing information asymmetry and enabling premium pricing for verified origins (e.g., single-estate ' +
        'Assam tea commanding 3-5× commodity prices).',
    },
  ],
};
