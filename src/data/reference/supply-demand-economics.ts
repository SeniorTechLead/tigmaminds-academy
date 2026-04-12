import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'supply-demand-economics',
  title: 'Supply, Demand & Market Economics',
      diagram: 'SupplyChainDiagram',
  category: 'economics',
  icon: '📈',
  tagline: 'Why prices change, how markets work, and the invisible forces behind every transaction.',
  relatedStories: ['night-market-imphal', 'market-day-tura'],
  understand: [
    {
      title: 'Supply and Demand — The Two Forces Behind Every Price',
      diagram: 'LinearGraphDiagram',
      beginnerContent:
        '**Demand** is the quantity of a good or service that consumers are willing and able to buy at a given price. The law of demand states that, all else being equal, as the price of a good rises, the quantity demanded falls — and vice versa. This makes intuitive sense: if the price of Assam tea doubles, some buyers will switch to coffee or simply drink less tea. When plotted on a graph with price on the vertical axis and quantity on the horizontal axis, the demand curve slopes downward from left to right.\n\n**Supply** is the quantity of a good that producers are willing and able to sell at a given price. The law of supply states that as the price rises, the quantity supplied also rises — higher prices give producers more incentive (and more revenue) to produce. A tea grower earning ₹300 per kilogram is motivated to plant more tea bushes than one earning ₹100. On a graph, the supply curve slopes upward from left to right.\n\nWhere the supply and demand curves cross is the **equilibrium point** — the price at which the quantity consumers want to buy exactly equals the quantity producers want to sell. At this price the market "clears" with no surplus and no shortage. If the price is above equilibrium, sellers cannot sell everything they produce (a surplus forms, pushing the price down). If the price is below equilibrium, buyers cannot find enough to purchase (a shortage forms, pushing the price up). This self-correcting mechanism is what Adam Smith famously called the "invisible hand." Real markets are messier — sticky prices, government regulations, imperfect information, and emotional decisions all create deviations from the textbook model — but supply and demand remain the single most useful framework for understanding why prices are what they are.',
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
      beginnerContent:
        'Not all markets operate the same way. Economists classify markets by the number of sellers, the similarity of products, and the ease of entering or leaving the industry. At one extreme is **perfect competition**: many small sellers offering identical products, no single seller can influence the price, and new firms can enter freely. Weekly vegetable markets in towns like Tura or Imphal come close — dozens of farmers sell nearly identical tomatoes, and if one charges too much, buyers simply walk to the next stall. Prices converge to a narrow range because no individual seller has pricing power.\n\nAt the other extreme is a **monopoly**: a single seller controls the entire supply of a product with no close substitutes. Indian Railways is a near-monopoly in long-distance rail transport — there is no competing rail network, so the government sets fares. Monopolists can charge higher prices than competitive markets because consumers have no alternative. This is why governments often regulate monopolies or break them up (antitrust law).\n\nBetween these extremes sit **oligopolies** (a few large sellers dominate the market — think of India\'s telecom sector with Jio, Airtel, and Vi controlling the vast majority of subscribers) and **monopolistic competition** (many sellers offering differentiated products — restaurants, clothing brands, handloom weavers). In an oligopoly, each firm\'s pricing decisions directly affect the others, leading to strategic behavior: price wars, collusion, or tacit agreement to keep prices stable. In monopolistic competition, sellers differentiate through quality, branding, and local reputation — a Muga silk weaver in Sualkuchi can charge more than a generic silk seller because the product is perceived as unique and artisanal. Understanding market structure helps explain why some goods are cheap and others expensive, and why certain industries are dominated by giants while others remain fragmented.',
      intermediateContent:
        'The Herfindahl-Hirschman Index (HHI) measures market concentration: sum of squared market shares. A monopoly: HHI = 10,000. Perfect competition (many equal firms): HHI → 0. India\'s telecom sector: Jio (~37%), Airtel (~33%), Vi (~22%), BSNL (~8%) → HHI ≈ 37² + 33² + 22² + 8² = 1,369 + 1,089 + 484 + 64 = **3,006** (moderately concentrated). Game theory models oligopoly behavior: in the Prisoner\'s Dilemma, two firms both cutting prices is the Nash equilibrium even though both would profit more from maintaining high prices — which is why cartels are unstable.',
      advancedContent:
        'Behavioral economics (Kahneman, Thaler) shows that real humans deviate systematically from rational economic behavior. Loss aversion means people weigh losses 2-3× more heavily than equivalent gains. The endowment effect means people overvalue what they already own. Anchoring means the first number you see biases your judgment. These biases are exploited in pricing strategies (₹999 vs ₹1,000, "was ₹2,000 now ₹1,200") and have policy implications — "nudge" theory uses choice architecture to guide better decisions without restricting freedom (e.g., making organ donation opt-out instead of opt-in doubles participation rates).',
    },
    {
      title: 'Trade and Comparative Advantage',
      beginnerContent:
        'Why do countries — or regions — trade with each other instead of producing everything themselves? The answer lies in **comparative advantage**, one of the most powerful ideas in economics. A region has a comparative advantage in producing a good if it can produce that good at a lower **opportunity cost** than other regions. Opportunity cost is what you give up to produce something. Assam has a comparative advantage in tea production because its climate, soil, and labour force are ideally suited to tea — the same resources used for tea would produce relatively less value if redirected to, say, manufacturing electronics. Meanwhile, Tamil Nadu has a comparative advantage in automobile manufacturing because of its established factories, skilled workforce, and supply chains.\n\nEven if one region is better at producing *everything* (an absolute advantage), trade still benefits both sides as long as their opportunity costs differ. This is David Ricardo\'s key insight from 1817, and it remains the foundation of international trade theory. When Assam exports tea and Muga silk while importing machinery and electronics, both Assam and the manufacturing regions end up with more goods than if each tried to be self-sufficient.\n\nNorth-East India\'s trade patterns illustrate these principles clearly. The region exports tea (Assam produces over 50% of India\'s tea), silk (Muga silk is found nowhere else on Earth), spices (Meghalaya\'s turmeric and lakadong turmeric are prized for high curcumin content), and bamboo products. It imports manufactured goods, petroleum products (despite sitting above oil reserves — refining capacity is the bottleneck), and many food staples. International border trade with Myanmar, Bangladesh, and Bhutan is growing through border haats (markets) where local communities exchange goods with minimal formality. These patterns are not random — they reflect each region\'s comparative advantages, shaped by geography, climate, skills, and infrastructure.',
      intermediateContent:
        'Calculating comparative advantage: if Assam can produce 100 kg tea or 50 kg electronics per worker, and Tamil Nadu can produce 60 kg tea or 80 kg electronics per worker, then Assam\'s opportunity cost of 1 kg tea = 0.5 kg electronics, while Tamil Nadu\'s = 80/60 = 1.33 kg electronics. Assam has comparative advantage in tea (lower opportunity cost). Tamil Nadu\'s opportunity cost of 1 kg electronics = 60/80 = 0.75 kg tea vs Assam\'s 50/100 = 2 kg tea. Tamil Nadu has comparative advantage in electronics. Both gain from trade when Assam exports tea and imports electronics.',
      advancedContent:
        'The Heckscher-Ohlin model predicts that countries export goods that intensively use their abundant factors of production. India, abundant in labor, exports labor-intensive goods (textiles, software services) and imports capital-intensive goods (machinery). However, the Leontief paradox showed the US (capital-abundant) exported labor-intensive goods — explained by human capital differences. Modern trade theory (Krugman, 2008 Nobel) emphasizes economies of scale and product differentiation: countries trade similar products (Germany and Japan both export cars) because consumers value variety and firms benefit from specialization. Global value chains mean a single product (iPhone) involves components from 40+ countries.',
    },
    {
      title: 'Money, Inflation, and Purchasing Power',
      beginnerContent:
        '**Money** serves three fundamental purposes: it is a medium of exchange (you trade money for goods instead of bartering chickens for rice), a unit of account (prices are quoted in rupees, making comparison easy), and a store of value (you can save money today and spend it next month). Before money, trade required a "double coincidence of wants" — a fisherman who wanted rice had to find a rice farmer who wanted fish. Money eliminates this problem and is one of humanity\'s most important inventions.\n\n**Inflation** is a sustained increase in the general price level over time. If inflation is 6% per year, something that costs ₹100 today will cost ₹106 next year and roughly ₹179 in ten years. Inflation erodes **purchasing power** — the amount of goods and services a unit of money can buy. If your salary stays at ₹30,000 per month while prices rise 6% annually, you can afford fewer goods each year even though your nominal income hasn\'t changed. Your **real income** (adjusted for inflation) has fallen.\n\nInflation has multiple causes. **Demand-pull inflation** occurs when too much money chases too few goods — perhaps the government prints money to cover its deficit, or a booming economy puts more cash in people\'s pockets. **Cost-push inflation** occurs when production costs rise — if diesel prices jump, transporting vegetables from farm to market becomes more expensive, and those costs are passed to consumers. **Supply shocks** like floods destroying crops or a pandemic disrupting factories can cause sudden price spikes. In NE India, monsoon flooding regularly disrupts supply chains: when roads to Guwahati are cut off, the price of essentials like onions and cooking oil can spike 30-50% within days because supply collapses while demand remains unchanged. The Reserve Bank of India manages inflation primarily through interest rates — raising rates makes borrowing more expensive, which slows spending and investment, reducing demand-pull pressure. Understanding inflation is critical because it affects savings, wages, loan costs, and the real value of every rupee you earn.',
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
        'When you buy a cotton shirt for 500 rupees, how much of that money went to the farmer who ' +
        'grew the cotton? Surprisingly little — often less than 5%. The rest is absorbed by a long ' +
        'chain of **intermediaries**: the cotton trader, the spinning mill, the weaving factory, the ' +
        'garment manufacturer, the brand company, the wholesaler, and finally the retailer. Each one ' +
        'adds a **markup** to cover their costs and earn a profit. This chain from raw material to ' +
        'final consumer is called a **supply chain**.\n\n' +
        'Why do markups compound so dramatically? Each intermediary faces costs — transport, storage, ' +
        'labour, rent, risk — and each adds a percentage on top of their purchase price. If five ' +
        'intermediaries each add a 30% markup, the final price is 1.3⁵ = 3.71 times the original cost. ' +
        'That is a 271% total markup even though each individual step seems modest.\n\n' +
        'The **value-to-weight ratio** is crucial in supply chain economics. Saffron is worth more than ' +
        'gold by weight, so high transport costs barely matter — saffron is traded globally. Sand is ' +
        'cheap and heavy, so transporting it long distances is uneconomical — you buy local sand. Tea ' +
        'has a moderate value-to-weight ratio, which is why Assam tea reaches global markets but faces ' +
        'price competition from closer producers.\n\n' +
        'Supply chain efficiency matters enormously for farmers and producers. When intermediaries are ' +
        'reduced — through cooperatives, direct-to-consumer sales, or digital platforms — the producer ' +
        'keeps a larger share of the final price. India\'s ONDC (Open Network for Digital Commerce) and ' +
        'farmer producer organizations (FPOs) are attempts to shorten supply chains and improve farmer ' +
        'incomes.',
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
