/* Environment & Sustainability, Philosophy & Religion, and Study Skills.

   Three subjects that had a handful of units between them, all of them broad.
   A student revising for a religious studies paper revises "Islam: Beliefs and
   Practices", not "religion"; a geography student revises "Deforestation and
   Land Use". Named that way, they can also be found that way. */

export const IDEAS_UNITS = {
  /* =============================== environment =============================== */
  climate: [
    {
      name: 'The Greenhouse Effect and the Evidence for Climate Change', from: 'Grade 7', to: 'College',
      figures: ['water-cycle'],
      facts: [
        ['the greenhouse effect', 'the trapping of outgoing heat by gases in the atmosphere'],
        ['a greenhouse gas', 'a gas that absorbs and re-emits infrared radiation'],
        ['carbon dioxide', 'the greenhouse gas released mainly by burning fossil fuels'],
        ['methane', 'the greenhouse gas released by livestock, waste and gas leaks'],
        ['nitrous oxide', 'the greenhouse gas released largely by fertiliser use'],
        ['water vapour', 'the most abundant greenhouse gas, which amplifies warming'],
        ['the enhanced greenhouse effect', 'the extra warming caused by human emissions'],
        ['global warming', 'the rise in average global surface temperature'],
        ['climate change', 'the wider change in weather patterns that warming brings'],
        ['an ice core', 'a drilled cylinder of ice recording past atmosphere'],
        ['a proxy record', 'an indirect record of past climate, such as tree rings'],
        ['a tree ring', 'an annual growth ring used to reconstruct past conditions'],
        ['sea level rise', 'the increase caused by melting ice and thermal expansion'],
        ['thermal expansion', 'the increase in volume of water as it warms'],
        ['ocean acidification', 'the fall in ocean pH as it absorbs carbon dioxide'],
        ['a feedback loop', 'a change that amplifies or dampens itself'],
        ['albedo', 'how much sunlight a surface reflects'],
        ['a carbon sink', 'something that absorbs more carbon than it releases'],
        ['mitigation', 'action that reduces emissions'],
        ['adaptation', 'action that reduces the harm warming causes']
      ],
      truths: [
        'The greenhouse effect is natural; the enhanced greenhouse effect is the human addition.',
        'Ice cores record both past temperature and past atmospheric composition.',
        'Melting sea ice does not raise sea level; melting land ice does.',
        'Thermal expansion contributes to sea level rise alongside melting ice.',
        'Losing reflective ice lowers albedo, which is a feedback that amplifies warming.'
      ],
      myths: [
        'Without the greenhouse effect the Earth would be comfortable.',
        'Melting Arctic sea ice is the main cause of sea level rise.',
        'A cold winter disproves global warming.',
        'Carbon dioxide is the only greenhouse gas that matters.',
        'Weather and climate are the same measurement over the same period.'
      ],
      applications: [
        ['Which greenhouse gas comes mainly from burning fossil fuels?', 'carbon dioxide'],
        ['Does melting sea ice raise sea level?', 'no'],
        ['The increase in water volume as it warms is called what?', 'thermal expansion'],
        ['A drilled cylinder of ice recording past atmosphere is called what?', 'an ice core'],
        ['Reducing emissions is mitigation or adaptation?', 'mitigation']
      ]
    },
    {
      name: 'Carbon Footprints and Life Cycle Assessment', from: 'Grade 8', to: 'College',
      facts: [
        ['a carbon footprint', 'the total greenhouse gas emitted by an activity or product'],
        ['a life cycle assessment', 'the accounting of impact from raw material to disposal'],
        ['cradle to grave', 'an assessment covering the whole life of a product'],
        ['cradle to cradle', 'a design where the product becomes material for the next one'],
        ['embodied carbon', 'the emissions produced in making something'],
        ['operational carbon', 'the emissions produced by using something'],
        ['a carbon equivalent', 'other gases expressed as the carbon dioxide with the same effect'],
        ['a scope one emission', 'emissions released directly by an organisation'],
        ['a scope two emission', 'emissions from the energy an organisation buys'],
        ['a scope three emission', 'emissions elsewhere in the supply chain'],
        ['a supply chain', 'the chain of suppliers behind a finished product'],
        ['food miles', 'the distance food travels, one factor among several'],
        ['a carbon offset', 'a payment intended to cancel emissions elsewhere'],
        ['greenwashing', 'presenting something as greener than it is'],
        ['a rebound effect', 'efficiency savings lost because the activity increases'],
        ['recycling', 'reprocessing material into new products'],
        ['reuse', 'using something again in its existing form'],
        ['a durable good', 'a product designed to last'],
        ['planned obsolescence', 'designing a product to be replaced sooner'],
        ['a net zero target', 'a commitment to balance emissions with removals']
      ],
      truths: [
        'Most of a product’s impact is often decided at the design stage.',
        'Food miles are one factor and frequently not the largest one.',
        'Reuse usually beats recycling, because recycling still costs energy.',
        'Scope three emissions are often the largest share and the hardest to measure.',
        'An efficiency gain can be cancelled by a rebound effect.'
      ],
      myths: [
        'Recycling a product cancels the impact of making it.',
        'Locally grown always means lower emissions.',
        'An offset removes the emission as if it had not happened.',
        'A product with green packaging has a small footprint.',
        'Only the manufacturing stage matters.'
      ],
      applications: [
        ['Emissions produced in making something are called what?', 'embodied carbon'],
        ['Emissions elsewhere in the supply chain are which scope?', 'scope three'],
        ['Presenting something as greener than it is called what?', 'greenwashing'],
        ['Efficiency savings lost because use increases is called what?', 'the rebound effect'],
        ['An assessment covering the whole life of a product is called what?', 'cradle to grave']
      ]
    },
    {
      name: 'Air Pollution and Its Effects', from: 'Grade 7', to: 'College',
      facts: [
        ['a pollutant', 'a substance released that causes harm'],
        ['particulate matter', 'tiny solid particles suspended in air'],
        ['PM2.5', 'particles under 2.5 micrometres, small enough to reach the lungs deeply'],
        ['nitrogen dioxide', 'the pollutant produced mainly by vehicle engines'],
        ['sulphur dioxide', 'the pollutant released by burning sulphur-containing fuels'],
        ['carbon monoxide', 'the toxic gas produced by incomplete combustion'],
        ['ground-level ozone', 'the pollutant formed by sunlight acting on other pollutants'],
        ['acid rain', 'rain made acidic by dissolved sulphur and nitrogen oxides'],
        ['smog', 'visible air pollution over a settlement'],
        ['a temperature inversion', 'warm air trapping polluted air near the ground'],
        ['incomplete combustion', 'burning without enough oxygen, producing soot and carbon monoxide'],
        ['a catalytic converter', 'the device that converts exhaust gases to less harmful ones'],
        ['a particulate filter', 'the device that traps soot in an exhaust'],
        ['an emission standard', 'the legal limit on what a vehicle or plant may release'],
        ['a clean air zone', 'an area where the most polluting vehicles are restricted'],
        ['indoor air pollution', 'pollution from cooking, heating and materials inside buildings'],
        ['a respiratory illness', 'a condition of the airways worsened by polluted air'],
        ['an air quality index', 'the scale reporting how polluted the air currently is'],
        ['a monitoring station', 'the site where air quality is measured'],
        ['a scrubber', 'the equipment removing pollutants from an industrial exhaust']
      ],
      truths: [
        'PM2.5 is dangerous because it penetrates deep into the lungs.',
        'A temperature inversion traps pollution near the ground and makes smog worse.',
        'Catalytic converters reduce some pollutants but not carbon dioxide.',
        'Indoor air pollution causes a large share of global deaths from air pollution.',
        'Acid rain damages ecosystems far from where the pollution was released.'
      ],
      myths: [
        'Air pollution is only an outdoor problem.',
        'A catalytic converter makes a car emission free.',
        'Air you cannot see or smell is clean.',
        'Acid rain only affects the area that produced the pollution.',
        'Ozone is always beneficial wherever it is found.'
      ],
      applications: [
        ['Which pollutant comes mainly from vehicle engines?', 'nitrogen dioxide'],
        ['Which particles are small enough to reach deep into the lungs?', 'PM2.5'],
        ['Warm air trapping pollution near the ground is called what?', 'a temperature inversion'],
        ['Which toxic gas comes from incomplete combustion?', 'carbon monoxide'],
        ['Which device converts exhaust gases to less harmful ones?', 'a catalytic converter']
      ]
    }
  ],
  conservation: [
    {
      name: 'Biodiversity, Extinction and Conservation', from: 'Grade 7', to: 'College',
      facts: [
        ['biodiversity', 'the variety of life in a place, at every level'],
        ['a species', 'a group whose members can breed and produce fertile offspring'],
        ['an ecosystem', 'a community of living things and their physical surroundings'],
        ['a habitat', 'the place a species lives'],
        ['a keystone species', 'a species whose removal changes an ecosystem out of proportion'],
        ['an endemic species', 'a species found nowhere else'],
        ['an invasive species', 'an introduced species that spreads and displaces natives'],
        ['an endangered species', 'a species at high risk of extinction'],
        ['extinction', 'the permanent loss of a species'],
        ['habitat fragmentation', 'the breaking of a habitat into isolated patches'],
        ['a wildlife corridor', 'a strip of habitat connecting fragmented areas'],
        ['a protected area', 'land or sea managed to conserve what lives there'],
        ['a national park', 'a protected area open to the public'],
        ['a seed bank', 'a store of seeds kept against future loss'],
        ['a captive breeding programme', 'breeding in captivity to support a wild population'],
        ['a reintroduction', 'returning a species to a place it once lived'],
        ['rewilding', 'restoring natural processes to land, often with key species'],
        ['a monoculture', 'a single crop or species grown over a large area'],
        ['ecosystem services', 'the benefits people get from working ecosystems'],
        ['the IUCN Red List', 'the international assessment of species’ extinction risk']
      ],
      truths: [
        'Habitat loss is the largest single driver of extinction.',
        'A keystone species has an effect far larger than its abundance suggests.',
        'Wildlife corridors reduce the isolation caused by fragmentation.',
        'Captive breeding supports wild populations but cannot replace habitat.',
        'Invasive species are a problem because of displacement, not because they are foreign in themselves.'
      ],
      myths: [
        'Conservation means leaving land completely untouched.',
        'A species can be saved by captive breeding alone.',
        'Biodiversity means simply the number of species.',
        'Every introduced species becomes invasive.',
        'Extinction is a natural process, so recent extinctions need no explanation.'
      ],
      applications: [
        ['A species found nowhere else is called what?', 'endemic'],
        ['A strip of habitat connecting fragmented areas is called what?', 'a wildlife corridor'],
        ['Which international list assesses extinction risk?', 'the IUCN Red List'],
        ['What is the largest single driver of extinction?', 'habitat loss'],
        ['A species whose removal changes an ecosystem out of proportion is called what?', 'a keystone species']
      ]
    },
    {
      name: 'Deforestation, Land Use and Restoration', from: 'Grade 7', to: 'College',
      facts: [
        ['deforestation', 'the permanent removal of forest'],
        ['a tropical rainforest', 'the dense forest of the equatorial belt'],
        ['a canopy', 'the layer formed by the tops of the tallest trees'],
        ['an emergent layer', 'the tallest trees rising above the canopy'],
        ['the understorey', 'the layer of smaller trees below the canopy'],
        ['nutrient cycling', 'the rapid recycling of nutrients through a forest floor'],
        ['slash and burn', 'clearing land by cutting and burning vegetation'],
        ['subsistence farming', 'farming to feed a household rather than for sale'],
        ['commercial logging', 'the felling of trees for sale'],
        ['cattle ranching', 'the rearing of cattle on cleared land'],
        ['a cash crop', 'a crop grown for sale, such as palm oil or soy'],
        ['soil erosion', 'the loss of topsoil once cover is removed'],
        ['leaching', 'the washing of nutrients out of soil by rain'],
        ['desertification', 'the degradation of dry land into desert'],
        ['afforestation', 'planting trees where there was no forest'],
        ['reforestation', 'replanting forest where it has been lost'],
        ['selective logging', 'felling chosen trees rather than clearing an area'],
        ['agroforestry', 'growing crops and trees together on the same land'],
        ['a debt for nature swap', 'the cancelling of debt in exchange for conservation'],
        ['sustainable yield', 'a rate of harvest a resource can support indefinitely']
      ],
      truths: [
        'Rainforest soils are often thin, because nutrients are held in the vegetation.',
        'Removing cover leads to erosion and leaching within a few seasons.',
        'Selective logging leaves forest structure largely intact; clear felling does not.',
        'Agroforestry allows land to produce food and keep tree cover at once.',
        'Cleared rainforest is difficult to farm for long without added fertiliser.'
      ],
      myths: [
        'Rainforest soil is the richest soil in the world.',
        'Planting any tree anywhere restores a lost forest.',
        'Deforestation is caused by subsistence farmers alone.',
        'A cleared rainforest regrows fully within a few years.',
        'Reforestation and afforestation mean the same thing.'
      ],
      applications: [
        ['Planting trees where there was no forest is called what?', 'afforestation'],
        ['Growing crops and trees on the same land is called what?', 'agroforestry'],
        ['The washing of nutrients out of soil is called what?', 'leaching'],
        ['Where are most rainforest nutrients held?', 'in the vegetation'],
        ['A rate of harvest a resource can support indefinitely is called what?', 'sustainable yield']
      ]
    },
    {
      name: 'Plastics, Waste and the Circular Economy', from: 'Grade 6', to: 'College',
      facts: [
        ['a polymer', 'a long molecule built from repeating units'],
        ['a monomer', 'the small unit a polymer is built from'],
        ['a thermoplastic', 'a plastic that can be melted and reshaped'],
        ['a thermosetting plastic', 'a plastic that sets permanently and cannot be remelted'],
        ['biodegradable', 'able to be broken down by living organisms'],
        ['a microplastic', 'a plastic fragment under five millimetres across'],
        ['landfill', 'the burial of waste in the ground'],
        ['incineration', 'the burning of waste, sometimes to generate energy'],
        ['leachate', 'the liquid draining from a landfill'],
        ['a linear economy', 'take, make, use, throw away'],
        ['a circular economy', 'a system designed to keep materials in use'],
        ['closed loop recycling', 'recycling a material into the same product again'],
        ['downcycling', 'recycling into a lower-value product'],
        ['contamination', 'the wrong material spoiling a recycling stream'],
        ['a deposit return scheme', 'a refundable charge that brings containers back'],
        ['extended producer responsibility', 'making the maker pay for disposal'],
        ['a single-use item', 'a product designed to be used once'],
        ['a bioplastic', 'a plastic made from biological material'],
        ['a waste hierarchy', 'the order: prevent, reuse, recycle, recover, dispose'],
        ['ocean gyre', 'the circular current system that concentrates floating debris']
      ],
      truths: [
        'The waste hierarchy puts prevention above recycling.',
        'Bioplastic does not automatically mean biodegradable.',
        'Contamination can send a whole batch of recycling to landfill.',
        'Thermoplastics can be remelted; thermosetting plastics cannot.',
        'Microplastics form as larger plastic breaks up, and are found throughout food chains.'
      ],
      myths: [
        'All plastics can be recycled indefinitely.',
        'Biodegradable plastic breaks down in any conditions.',
        'Recycling is the top priority in the waste hierarchy.',
        'Burning waste has no environmental cost if energy is recovered.',
        'A plastic labelled with a recycling symbol will certainly be recycled.'
      ],
      applications: [
        ['What sits above recycling in the waste hierarchy?', 'reuse'],
        ['A plastic that can be melted and reshaped is called what?', 'a thermoplastic'],
        ['Recycling into a lower-value product is called what?', 'downcycling'],
        ['Making the maker pay for disposal is called what?', 'extended producer responsibility'],
        ['A plastic fragment under five millimetres is called what?', 'a microplastic']
      ]
    },
    {
      name: 'Fresh Water, Scarcity and Management', from: 'Grade 7', to: 'College',
      facts: [
        ['fresh water', 'water with little dissolved salt, usable for drinking and farming'],
        ['an aquifer', 'a body of rock holding groundwater'],
        ['groundwater', 'water held underground in rock and soil'],
        ['a water table', 'the upper level of saturated ground'],
        ['abstraction', 'the taking of water from a source'],
        ['over-abstraction', 'taking water faster than it is replaced'],
        ['a reservoir', 'a stored body of water held behind a dam'],
        ['a catchment', 'the area of land draining to one river'],
        ['water stress', 'the condition where demand approaches available supply'],
        ['water scarcity', 'the condition where demand exceeds available supply'],
        ['physical scarcity', 'scarcity because there is not enough water'],
        ['economic scarcity', 'scarcity because the means to supply it are missing'],
        ['desalination', 'the removal of salt from sea water'],
        ['greywater', 'used water from sinks and washing, reusable for some purposes'],
        ['drip irrigation', 'watering crops slowly at the root'],
        ['a water footprint', 'the total water used to produce a good'],
        ['virtual water', 'the water embedded in a traded product'],
        ['a transboundary river', 'a river crossing more than one country'],
        ['a treatment works', 'the plant that makes water safe to drink'],
        ['a leakage rate', 'the share of supplied water lost from pipes']
      ],
      truths: [
        'Most of the world’s water is salt water, and most fresh water is frozen or underground.',
        'Physical and economic scarcity are different problems with different solutions.',
        'Drip irrigation uses far less water than flood irrigation for the same crop.',
        'Over-abstraction lowers the water table and can let salt water in near coasts.',
        'Most of a country’s water use is agricultural, not domestic.'
      ],
      myths: [
        'Water scarcity is only about rainfall.',
        'Domestic taps and showers are where most water is used.',
        'Desalination is a cheap solution available everywhere.',
        'Groundwater is replaced as fast as it is pumped.',
        'A river inside one country can be managed without regard to its neighbours.'
      ],
      applications: [
        ['A body of rock holding groundwater is called what?', 'an aquifer'],
        ['Scarcity because the means to supply water are missing is which kind?', 'economic scarcity'],
        ['The water embedded in a traded product is called what?', 'virtual water'],
        ['Which irrigation method delivers water slowly at the root?', 'drip irrigation'],
        ['Taking water faster than it is replaced is called what?', 'over-abstraction']
      ]
    },
    {
      name: 'Food Systems and Sustainable Farming', from: 'Grade 7', to: 'College',
      facts: [
        ['a food system', 'everything involved in producing, moving and eating food'],
        ['intensive farming', 'farming for high yield per unit of land'],
        ['extensive farming', 'farming over a large area with lower inputs'],
        ['a yield', 'the amount produced per unit of land'],
        ['a fertiliser', 'a substance added to soil to supply nutrients'],
        ['a pesticide', 'a chemical used to control pests'],
        ['eutrophication', 'the nutrient enrichment of water that strips it of oxygen'],
        ['an algal bloom', 'the rapid growth of algae following nutrient enrichment'],
        ['crop rotation', 'growing different crops in sequence on the same land'],
        ['a legume', 'a plant whose root nodules fix nitrogen'],
        ['nitrogen fixation', 'the conversion of atmospheric nitrogen into usable compounds'],
        ['organic farming', 'farming without synthetic fertiliser or pesticide'],
        ['a trophic level', 'a step in a food chain'],
        ['energy transfer efficiency', 'the share of energy passing to the next trophic level'],
        ['food security', 'reliable access to enough safe and nutritious food'],
        ['food waste', 'edible food that is produced and not eaten'],
        ['a supply chain', 'the route food takes from farm to plate'],
        ['a subsidy', 'a government payment supporting production'],
        ['precision agriculture', 'using data to apply inputs exactly where needed'],
        ['a cover crop', 'a crop grown to protect and improve soil rather than to sell']
      ],
      truths: [
        'Only a small share of energy passes from one trophic level to the next.',
        'Eating lower down the food chain feeds more people from the same land.',
        'Fertiliser running into water causes eutrophication and oxygen loss.',
        'Legumes fix nitrogen, which is why rotations include them.',
        'A large share of food produced is never eaten.'
      ],
      myths: [
        'Organic farming uses no pest control at all.',
        'Higher yields always mean a better system overall.',
        'Food insecurity is caused only by not producing enough food.',
        'Crop rotation is an old practice with no modern justification.',
        'Energy passes from one trophic level to the next with little loss.'
      ],
      applications: [
        ['Which plants fix nitrogen through root nodules?', 'legumes'],
        ['Nutrient enrichment that strips water of oxygen is called what?', 'eutrophication'],
        ['A crop grown to improve soil rather than to sell is called what?', 'a cover crop'],
        ['Using data to apply inputs exactly where needed is called what?', 'precision agriculture'],
        ['Roughly what share of energy passes to the next trophic level?', 'about a tenth']
      ]
    }
  ],
  /* =============================== philosophy ================================ */
  philosophy: [
    {
      name: 'Ethics: Utilitarianism, Duty and Virtue', from: 'Grade 9', to: 'College',
      facts: [
        ['ethics', 'the study of what makes an action right or wrong'],
        ['normative ethics', 'the study of how one ought to act'],
        ['metaethics', 'the study of what moral claims mean'],
        ['applied ethics', 'the study of particular moral questions'],
        ['consequentialism', 'the view that consequences determine rightness'],
        ['utilitarianism', 'the view that the right act maximises overall wellbeing'],
        ['Jeremy Bentham', 'the founder of classical utilitarianism'],
        ['John Stuart Mill', 'the utilitarian who distinguished higher and lower pleasures'],
        ['the hedonic calculus', 'Bentham’s method of weighing pleasure and pain'],
        ['act utilitarianism', 'judging each act by its own consequences'],
        ['rule utilitarianism', 'judging acts by rules that generally maximise wellbeing'],
        ['deontology', 'the view that some acts are right or wrong in themselves'],
        ['Immanuel Kant', 'the philosopher of duty and the categorical imperative'],
        ['the categorical imperative', 'the rule that a maxim must be universalisable'],
        ['a maxim', 'the principle on which one acts'],
        ['treating people as ends', 'Kant’s requirement never to use a person merely as a means'],
        ['virtue ethics', 'the view that ethics is about character rather than acts or rules'],
        ['Aristotle', 'the philosopher of virtue and the golden mean'],
        ['the golden mean', 'the virtue lying between excess and deficiency'],
        ['eudaimonia', 'flourishing, the aim of a well-lived life']
      ],
      truths: [
        'Consequentialism judges by outcomes; deontology judges by the act itself.',
        'Kant’s categorical imperative tests whether a maxim could be willed universally.',
        'Virtue ethics asks what a good person would do, not which rule applies.',
        'Rule utilitarianism was developed partly to answer objections to act utilitarianism.',
        'Mill distinguished higher from lower pleasures; Bentham did not.'
      ],
      myths: [
        'Utilitarianism means doing whatever makes you personally happy.',
        'Kant’s ethics is just the golden rule under a longer name.',
        'Virtue ethics gives no guidance on what to do.',
        'Every ethical theory reaches the same conclusion in practice.',
        'Consequentialism and deontology differ only in wording.'
      ],
      applications: [
        ['Which theory judges an act purely by its consequences?', 'consequentialism'],
        ['Whose test asks whether a maxim can be universalised?', 'Kant'],
        ['The virtue between excess and deficiency is called what?', 'the golden mean'],
        ['Who distinguished higher from lower pleasures?', 'John Stuart Mill'],
        ['Which theory centres on character rather than acts?', 'virtue ethics']
      ]
    },
    {
      name: 'Arguments For and Against the Existence of God', from: 'Grade 9', to: 'College',
      facts: [
        ['theism', 'belief that God exists'],
        ['atheism', 'belief that God does not exist'],
        ['agnosticism', 'the position that the question cannot be settled'],
        ['the cosmological argument', 'the argument from the existence of the universe to a first cause'],
        ['a first cause', 'the uncaused cause the cosmological argument concludes to'],
        ['the kalam argument', 'the version arguing that whatever begins to exist has a cause'],
        ['the teleological argument', 'the argument from apparent design in nature'],
        ['Paley’s watch', 'the analogy comparing nature to a found watch'],
        ['the ontological argument', 'the argument from the concept of God alone'],
        ['Anselm', 'the philosopher who first set out the ontological argument'],
        ['a priori', 'knowable independently of experience'],
        ['a posteriori', 'knowable only through experience'],
        ['the problem of evil', 'the difficulty of reconciling suffering with an all-good God'],
        ['natural evil', 'suffering not caused by human action'],
        ['moral evil', 'suffering caused by human choices'],
        ['a theodicy', 'an attempted answer to the problem of evil'],
        ['the free will defence', 'the theodicy appealing to the value of genuine choice'],
        ['omnipotence', 'being all-powerful'],
        ['omniscience', 'being all-knowing'],
        ['omnibenevolence', 'being all-good']
      ],
      truths: [
        'The ontological argument is a priori; the cosmological and teleological arguments are a posteriori.',
        'The problem of evil is an argument against a God who is all-powerful and all-good together.',
        'The free will defence addresses moral evil more directly than natural evil.',
        'Hume argued the design analogy is weak because the universe is not clearly like a machine.',
        'Agnosticism is a claim about knowledge, not a halfway belief.'
      ],
      myths: [
        'The cosmological and ontological arguments are two versions of one argument.',
        'Agnosticism means having no opinion at all.',
        'The problem of evil disproves the existence of any god whatsoever.',
        'A priori and a posteriori mean before and after in time.',
        'Paley’s argument depends on the watch being a real object he found.'
      ],
      applications: [
        ['Which argument reasons from the concept of God alone?', 'the ontological argument'],
        ['Suffering caused by human choices is which kind of evil?', 'moral evil'],
        ['Whose watch analogy supports the design argument?', 'Paley'],
        ['An attempted answer to the problem of evil is called what?', 'a theodicy'],
        ['Is the cosmological argument a priori or a posteriori?', 'a posteriori']
      ]
    },
    {
      name: 'Knowledge: What Counts as Knowing', from: 'Grade 10', to: 'College',
      facts: [
        ['epistemology', 'the study of knowledge'],
        ['a proposition', 'a statement that can be true or false'],
        ['justified true belief', 'the traditional three-part definition of knowledge'],
        ['a Gettier case', 'a counterexample where justified true belief is not knowledge'],
        ['empiricism', 'the view that knowledge comes from experience'],
        ['rationalism', 'the view that reason is a source of knowledge independent of experience'],
        ['a priori knowledge', 'knowledge independent of experience'],
        ['a posteriori knowledge', 'knowledge derived from experience'],
        ['scepticism', 'doubt about whether knowledge is possible'],
        ['Descartes’ method of doubt', 'the systematic rejection of anything that can be doubted'],
        ['the cogito', 'Descartes’ conclusion that thinking proves his own existence'],
        ['tabula rasa', 'Locke’s image of the mind as a blank slate'],
        ['innate ideas', 'ideas held to be present before any experience'],
        ['induction', 'reasoning from particular cases to a general rule'],
        ['deduction', 'reasoning from premises to a conclusion that must follow'],
        ['the problem of induction', 'Hume’s point that past regularity does not guarantee the future'],
        ['falsifiability', 'Popper’s criterion that a claim must be capable of being shown false'],
        ['a paradigm', 'Kuhn’s term for the framework a science works within'],
        ['testimony', 'knowledge acquired from what others tell us'],
        ['reliabilism', 'the view that a belief is knowledge if produced by a reliable process']
      ],
      truths: [
        'Gettier cases show justified true belief can fall short of knowledge.',
        'Deduction guarantees its conclusion if the premises are true; induction does not.',
        'Popper held that science advances by attempted falsification, not confirmation.',
        'Empiricism and rationalism differ on the source of knowledge, not on its value.',
        'Most of what any person knows comes through testimony.'
      ],
      myths: [
        'Knowledge is simply strong belief.',
        'Induction can be made logically certain with enough cases.',
        'Descartes concluded that nothing at all can be known.',
        'A theory is scientific because it explains everything it is applied to.',
        'A priori means known before birth.'
      ],
      applications: [
        ['The traditional three-part definition of knowledge is called what?', 'justified true belief'],
        ['Whose criterion is falsifiability?', 'Popper'],
        ['Reasoning from particular cases to a general rule is called what?', 'induction'],
        ['Whose image is the mind as a blank slate?', 'Locke'],
        ['A counterexample to justified true belief is called what?', 'a Gettier case']
      ]
    },
    {
      name: 'Free Will, Determinism and Responsibility', from: 'Grade 10', to: 'College',
      facts: [
        ['free will', 'the capacity to choose otherwise than one did'],
        ['determinism', 'the view that every event is fixed by prior causes'],
        ['hard determinism', 'the view that determinism is true and free will is therefore an illusion'],
        ['libertarianism in philosophy', 'the view that some choices are genuinely free and undetermined'],
        ['compatibilism', 'the view that free will and determinism can both be true'],
        ['a causal chain', 'the sequence of causes leading to an event'],
        ['moral responsibility', 'being properly praised or blamed for an action'],
        ['an excuse', 'a reason that reduces blame without denying the act'],
        ['coercion', 'being forced to act by another'],
        ['an internal cause', 'a cause arising from the agent’s own character or desires'],
        ['an external cause', 'a cause arising outside the agent'],
        ['fatalism', 'the view that outcomes are fixed whatever anyone does'],
        ['predictability', 'whether an event can be forecast from prior states'],
        ['indeterminacy', 'the absence of a fixed determination of an outcome'],
        ['a reactive attitude', 'a response such as resentment or gratitude that presupposes responsibility'],
        ['retribution', 'punishment as deserved return for wrongdoing'],
        ['deterrence', 'punishment aimed at preventing future offences'],
        ['rehabilitation', 'punishment aimed at changing the offender'],
        ['an agent', 'the one who acts'],
        ['an intention', 'what an agent is trying to bring about']
      ],
      truths: [
        'Compatibilism holds that acting freely means acting from one’s own reasons without coercion.',
        'Fatalism and determinism are different views, often confused.',
        'Hard determinism denies moral responsibility in the retributive sense.',
        'Randomness on its own does not deliver free will; an undetermined act is not thereby a chosen one.',
        'Different theories of punishment survive different answers to the free will question.'
      ],
      myths: [
        'Determinism means nothing anyone does makes any difference.',
        'Compatibilism is a refusal to take a position.',
        'If our choices have causes, no one can ever be blamed for anything.',
        'Free will requires that our actions be random.',
        'Determinism and predictability are the same claim.'
      ],
      applications: [
        ['Which view holds that free will and determinism can both be true?', 'compatibilism'],
        ['Punishment as deserved return for wrongdoing is called what?', 'retribution'],
        ['The view that outcomes are fixed whatever anyone does is called what?', 'fatalism'],
        ['Being forced to act by another is called what?', 'coercion'],
        ['Which view says determinism is true and free will is an illusion?', 'hard determinism']
      ]
    }
  ],
  religions: [
    {
      name: 'Christianity: Beliefs and Practices', from: 'Grade 6', to: 'College',
      facts: [
        ['the Trinity', 'the belief in one God as Father, Son and Holy Spirit'],
        ['the Incarnation', 'the belief that God became human in Jesus'],
        ['the Crucifixion', 'the death of Jesus by execution on a cross'],
        ['the Resurrection', 'the belief that Jesus rose from the dead'],
        ['the Ascension', 'the belief that Jesus returned to the Father'],
        ['salvation', 'being saved from sin and its consequences'],
        ['atonement', 'the reconciling of humanity and God'],
        ['grace', 'unearned favour given by God'],
        ['the Bible', 'the Christian scripture, in two testaments'],
        ['the Gospels', 'the four accounts of the life of Jesus'],
        ['a sacrament', 'an outward sign of an inward grace'],
        ['baptism', 'the sacrament of entry into the Church'],
        ['the Eucharist', 'the sacrament of bread and wine, also called communion'],
        ['a denomination', 'a distinct Christian tradition or church body'],
        ['Catholicism', 'the tradition centred on the Church of Rome'],
        ['Orthodoxy', 'the Eastern Christian tradition'],
        ['Protestantism', 'the traditions arising from the Reformation'],
        ['prayer', 'communication with God, alone or in company'],
        ['a pilgrimage', 'a journey made to a place of religious significance'],
        ['the Lord’s Prayer', 'the prayer taught by Jesus in the Gospels']
      ],
      truths: [
        'Christians believe in one God understood as three persons.',
        'The Gospels are four accounts, not one.',
        'Denominations differ on practice and authority while sharing core beliefs.',
        'Easter, not Christmas, is the central festival of the Christian year.',
        'Baptism marks entry into the Church in most traditions.'
      ],
      myths: [
        'The Trinity means Christians believe in three gods.',
        'All Christian denominations practise the sacraments identically.',
        'The Old Testament is a Christian rather than a shared text.',
        'Christmas is the most important Christian festival.',
        'The Bible was written in one language at one time.'
      ],
      applications: [
        ['How many Gospels are there?', '4'],
        ['Which sacrament marks entry into the Church?', 'baptism'],
        ['Which belief holds that God became human in Jesus?', 'the Incarnation'],
        ['Which festival is central to the Christian year?', 'Easter'],
        ['The sacrament of bread and wine is called what?', 'the Eucharist']
      ]
    },
    {
      name: 'Islam: Beliefs and Practices', from: 'Grade 6', to: 'College',
      facts: [
        ['tawhid', 'the belief in the absolute oneness of God'],
        ['Allah', 'the Arabic word for God'],
        ['the Qur’an', 'the Islamic scripture, believed revealed to Muhammad'],
        ['the Prophet Muhammad', 'the final prophet in Islamic belief'],
        ['a prophet', 'a messenger sent by God'],
        ['the Five Pillars', 'the five duties of Sunni Muslim practice'],
        ['the shahadah', 'the declaration of faith'],
        ['salah', 'the five daily prayers'],
        ['zakat', 'the obligatory giving of a share of wealth'],
        ['sawm', 'the fast during the month of Ramadan'],
        ['the Hajj', 'the pilgrimage to Mecca'],
        ['the qiblah', 'the direction of prayer, towards the Kaaba'],
        ['the Kaaba', 'the building at the centre of the Great Mosque in Mecca'],
        ['a mosque', 'a Muslim place of worship'],
        ['an imam', 'the person leading prayer'],
        ['the Sunnah', 'the example and practice of the Prophet'],
        ['a hadith', 'a recorded saying or action of the Prophet'],
        ['Sunni Islam', 'the larger of the two main branches'],
        ['Shi’a Islam', 'the branch holding that leadership passed through the Prophet’s family'],
        ['halal', 'that which is permitted']
      ],
      truths: [
        'Tawhid, the oneness of God, is the central belief of Islam.',
        'The Five Pillars are shahadah, salah, zakat, sawm and Hajj.',
        'Ramadan is a month, and the fast runs from dawn to sunset each day of it.',
        'The Hajj is obligatory once in a lifetime for those able to make it.',
        'Sunni and Shi’a differ principally over the succession of leadership.'
      ],
      myths: [
        'Allah is a different god from the God of Judaism and Christianity.',
        'Ramadan is a single day of fasting.',
        'Every Muslim must make the Hajj regardless of health or means.',
        'The imam holds a priestly office comparable to ordination.',
        'The Five Pillars are optional recommendations.'
      ],
      applications: [
        ['How many Pillars are there in Sunni practice?', '5'],
        ['The declaration of faith is called what?', 'the shahadah'],
        ['The direction of prayer is called what?', 'the qiblah'],
        ['Which pillar is the fast of Ramadan?', 'sawm'],
        ['A recorded saying of the Prophet is called what?', 'a hadith']
      ]
    },
    {
      name: 'Judaism: Beliefs and Practices', from: 'Grade 6', to: 'College',
      facts: [
        ['the Torah', 'the first five books of the Hebrew scriptures'],
        ['the Tenakh', 'the complete Hebrew Bible'],
        ['the Talmud', 'the collected rabbinic commentary and law'],
        ['a covenant', 'the binding agreement between God and the Jewish people'],
        ['Abraham', 'the patriarch with whom the covenant begins'],
        ['Moses', 'the prophet who received the law at Sinai'],
        ['the mitzvot', 'the commandments'],
        ['a synagogue', 'a Jewish place of worship and study'],
        ['a rabbi', 'a teacher of Jewish law'],
        ['Shabbat', 'the weekly day of rest from Friday evening to Saturday night'],
        ['kosher', 'food prepared according to Jewish dietary law'],
        ['a bar mitzvah', 'the coming of age ceremony for a boy'],
        ['a bat mitzvah', 'the coming of age ceremony for a girl'],
        ['Pesach', 'Passover, remembering the exodus from Egypt'],
        ['the seder', 'the ordered Passover meal'],
        ['Yom Kippur', 'the day of atonement'],
        ['Rosh Hashanah', 'the Jewish new year'],
        ['Orthodox Judaism', 'the tradition maintaining the fullest observance of the law'],
        ['Reform Judaism', 'the tradition adapting practice to changed circumstances'],
        ['the Shema', 'the central declaration that God is one']
      ],
      truths: [
        'The Torah is the first five books; the Tenakh is the whole Hebrew Bible.',
        'Shabbat runs from Friday evening to nightfall on Saturday.',
        'The seder is the ordered meal at which the exodus is retold.',
        'Orthodox and Reform traditions differ on how the law applies today.',
        'The Shema declares the oneness of God.'
      ],
      myths: [
        'The Torah and the Talmud are the same text.',
        'Kosher simply means blessed by a rabbi.',
        'Shabbat begins on Saturday morning.',
        'Judaism has a single central authority for all Jews.',
        'Bar and bat mitzvah are the same ceremony under two names.'
      ],
      applications: [
        ['The first five books of the Hebrew scriptures are called what?', 'the Torah'],
        ['Which festival remembers the exodus from Egypt?', 'Pesach'],
        ['The ordered Passover meal is called what?', 'the seder'],
        ['The day of atonement is called what?', 'Yom Kippur'],
        ['Which declaration states that God is one?', 'the Shema']
      ]
    },
    {
      name: 'Hinduism and Buddhism: Beliefs and Practices', from: 'Grade 6', to: 'College',
      facts: [
        ['Brahman', 'the ultimate reality in Hindu thought'],
        ['atman', 'the self or soul'],
        ['dharma', 'duty, the right way of living'],
        ['karma', 'the principle that actions have consequences'],
        ['samsara', 'the cycle of birth, death and rebirth'],
        ['moksha', 'liberation from the cycle of rebirth'],
        ['the Vedas', 'the oldest Hindu scriptures'],
        ['the Bhagavad Gita', 'the dialogue on duty within the Mahabharata'],
        ['puja', 'the act of Hindu worship'],
        ['a mandir', 'a Hindu temple'],
        ['the Buddha', 'Siddhartha Gautama, the awakened one'],
        ['the Four Noble Truths', 'the Buddhist analysis of suffering and its ending'],
        ['dukkha', 'suffering or unsatisfactoriness'],
        ['the Eightfold Path', 'the Buddhist way of practice'],
        ['nirvana', 'the ending of craving and of the cycle of rebirth'],
        ['meditation', 'the disciplined training of attention'],
        ['the sangha', 'the Buddhist community'],
        ['the dhamma', 'the Buddha’s teaching'],
        ['Theravada', 'the Buddhist tradition of South and South-East Asia'],
        ['Mahayana', 'the Buddhist tradition of East Asia']
      ],
      truths: [
        'Both traditions use karma and rebirth, but understand the self very differently.',
        'The Four Noble Truths set out suffering, its cause, its ending and the path.',
        'Buddhism denies a permanent self, where Hindu thought speaks of atman.',
        'Moksha and nirvana both name a release from the cycle of rebirth.',
        'Theravada and Mahayana differ in scripture, practice and geography.'
      ],
      myths: [
        'Buddhism is a branch of Hinduism.',
        'Karma means fate.',
        'Nirvana means a paradise you go to after death.',
        'Hinduism has one founder and one scripture.',
        'Meditation is simply relaxation.'
      ],
      applications: [
        ['The cycle of birth, death and rebirth is called what?', 'samsara'],
        ['How many Noble Truths are there?', '4'],
        ['The Buddhist community is called what?', 'the sangha'],
        ['Liberation from rebirth in Hindu thought is called what?', 'moksha'],
        ['Which scripture is the dialogue on duty within the Mahabharata?', 'the Bhagavad Gita']
      ]
    },
    {
      name: 'Sikhism: Beliefs and Practices', from: 'Grade 6', to: 'College',
      facts: [
        ['Ik Onkar', 'the declaration that there is one God'],
        ['Guru Nanak', 'the founder of the Sikh tradition'],
        ['a Guru', 'a teacher; in Sikhism, one of the ten human Gurus'],
        ['the Guru Granth Sahib', 'the Sikh scripture, treated as the living Guru'],
        ['a gurdwara', 'a Sikh place of worship'],
        ['the langar', 'the free kitchen serving all comers equally'],
        ['sewa', 'selfless service to others'],
        ['the Khalsa', 'the community of initiated Sikhs founded in 1699'],
        ['Guru Gobind Singh', 'the tenth Guru, who founded the Khalsa'],
        ['the Five Ks', 'the five articles of faith worn by initiated Sikhs'],
        ['kesh', 'uncut hair'],
        ['kangha', 'the wooden comb'],
        ['kara', 'the steel bracelet'],
        ['kachera', 'the cotton undergarment'],
        ['kirpan', 'the ceremonial sword'],
        ['Vaisakhi', 'the festival marking the founding of the Khalsa'],
        ['equality', 'the principle that all people are equal before God'],
        ['a granthi', 'the person who reads and cares for the scripture'],
        ['kirtan', 'the singing of scripture'],
        ['Waheguru', 'a Sikh name for God']
      ],
      truths: [
        'Sikhs believe in one God, expressed in Ik Onkar.',
        'The Guru Granth Sahib is treated as the living Guru after the tenth human Guru.',
        'The langar serves everybody equally, whatever their background.',
        'The Khalsa was founded by Guru Gobind Singh in 1699.',
        'The Five Ks are worn by initiated Sikhs, not by every Sikh.'
      ],
      myths: [
        'Sikhism is a blend of Hinduism and Islam.',
        'There have been eleven human Gurus.',
        'The langar is only for members of the gurdwara.',
        'The kirpan is carried as a weapon.',
        'Every Sikh wears all Five Ks.'
      ],
      applications: [
        ['Who founded the Sikh tradition?', 'Guru Nanak'],
        ['The free kitchen at a gurdwara is called what?', 'the langar'],
        ['Which festival marks the founding of the Khalsa?', 'Vaisakhi'],
        ['The Sikh scripture is called what?', 'the Guru Granth Sahib'],
        ['Selfless service to others is called what?', 'sewa']
      ]
    }
  ],
  /* ================================== study ================================== */
  notes: [
    {
      name: 'Cornell Notes and Mind Mapping', from: 'Grade 6', to: 'College',
      facts: [
        ['the Cornell method', 'a page split into cue, notes and summary'],
        ['a cue column', 'the narrow left column holding questions and keywords'],
        ['a note column', 'the wide column holding notes taken during the lesson'],
        ['a summary line', 'the bottom strip summarising the page in your own words'],
        ['a mind map', 'a branching diagram radiating from a central idea'],
        ['a central node', 'the idea a mind map starts from'],
        ['a branch', 'one main line of a mind map'],
        ['a sub-branch', 'a division of a branch into detail'],
        ['linear notes', 'notes written down the page in order'],
        ['an abbreviation', 'a shortened form used to write faster'],
        ['a symbol', 'a mark standing for a recurring word'],
        ['paraphrasing', 'putting an idea into your own words'],
        ['a heading', 'the label showing what a section covers'],
        ['a highlight', 'a marked line, used sparingly to signal importance'],
        ['a margin note', 'a comment written alongside the main notes'],
        ['a review pass', 'the rereading done soon after a lesson'],
        ['a knowledge organiser', 'a one-page summary of a whole topic'],
        ['a flow diagram', 'a diagram showing a process step by step'],
        ['a comparison table', 'a table setting two things side by side'],
        ['active recall', 'testing yourself rather than rereading']
      ],
      truths: [
        'Notes in your own words are remembered better than copied ones.',
        'The Cornell cue column turns a page of notes into a set of questions.',
        'Highlighting everything is the same as highlighting nothing.',
        'A mind map suits linked ideas; a table suits comparisons.',
        'A short review soon after a lesson saves far more time later.'
      ],
      myths: [
        'Good notes are the ones that record the most words.',
        'Copying the board is the same as taking notes.',
        'Notes only need to be read again the night before the exam.',
        'One note-taking method suits every subject.',
        'Neat handwriting is what makes notes effective.'
      ],
      sequences: [
        ['Using the Cornell method', [
          'Rule the page into a narrow cue column, a wide note column and a bottom strip',
          'Take notes in the wide column during the lesson',
          'Soon afterwards, write questions and keywords in the cue column',
          'Cover the notes and answer the cue questions from memory',
          'Write a summary of the page in your own words in the bottom strip'
        ]]
      ],
      applications: [
        ['Which column of a Cornell page holds the questions?', 'the cue column'],
        ['Putting an idea into your own words is called what?', 'paraphrasing'],
        ['Which format suits comparing two things directly?', 'a comparison table'],
        ['Testing yourself rather than rereading is called what?', 'active recall'],
        ['What goes in the bottom strip of a Cornell page?', 'a summary in your own words']
      ]
    }
  ],
  revision: [
    {
      name: 'Spaced Retrieval and Flashcards', from: 'Grade 6', to: 'College',
      facts: [
        ['retrieval practice', 'recalling material from memory rather than rereading it'],
        ['spacing', 'spreading study over time rather than massing it'],
        ['massed practice', 'studying everything in one long block'],
        ['cramming', 'massed practice immediately before an exam'],
        ['interleaving', 'mixing topics within a study session'],
        ['blocking', 'studying one topic at a time to completion'],
        ['a flashcard', 'a card with a prompt on one side and an answer on the other'],
        ['a spaced repetition system', 'a schedule that revisits cards as they are about to be forgotten'],
        ['a retrieval cue', 'the prompt that triggers recall'],
        ['the forgetting curve', 'the fall in recall over time without review'],
        ['the testing effect', 'the finding that being tested improves later recall'],
        ['fluency', 'the feeling of ease that makes rereading feel productive'],
        ['a desirable difficulty', 'a difficulty that makes learning slower but more durable'],
        ['elaboration', 'explaining how and why something works'],
        ['dual coding', 'combining words with a diagram'],
        ['self-explanation', 'talking yourself through a worked example'],
        ['a past paper', 'a previous exam used for practice'],
        ['a mark scheme', 'the document showing how marks are awarded'],
        ['a revision timetable', 'a plan allocating topics to sessions'],
        ['a topic checklist', 'the list used to track what has and has not been revised']
      ],
      truths: [
        'Testing yourself is a study method, not just a way of measuring study.',
        'Spacing the same total time over more sessions produces better retention.',
        'Rereading feels effective because it feels fluent, not because it works well.',
        'Interleaving is harder during practice and better at the test.',
        'A mark scheme shows what an answer needs, and is worth reading before writing one.'
      ],
      myths: [
        'Rereading notes is the most efficient way to revise.',
        'If revision feels easy, it is going well.',
        'Cramming the night before is as good as spaced study.',
        'Flashcards only work for vocabulary.',
        'Highlighting a textbook counts as active revision.'
      ],
      applications: [
        ['Recalling from memory rather than rereading is called what?', 'retrieval practice'],
        ['Mixing topics within a session is called what?', 'interleaving'],
        ['The fall in recall over time without review is called what?', 'the forgetting curve'],
        ['Combining words with a diagram is called what?', 'dual coding'],
        ['Which document shows how marks are awarded?', 'the mark scheme']
      ]
    }
  ],
  exams: [
    {
      name: 'Command Words and Reading the Question', from: 'Grade 6', to: 'College',
      facts: [
        ['a command word', 'the verb telling you what an exam answer must do'],
        ['state', 'give a short factual answer with no explanation'],
        ['describe', 'say what something is like, without explaining why'],
        ['explain', 'give reasons or causes, usually with because'],
        ['compare', 'set out similarities and differences together'],
        ['contrast', 'set out differences'],
        ['evaluate', 'weigh strengths and weaknesses and reach a judgement'],
        ['justify', 'give reasons supporting a stated position'],
        ['analyse', 'break something down and show how the parts relate'],
        ['calculate', 'work out a numerical answer, showing method'],
        ['suggest', 'apply knowledge to an unfamiliar situation'],
        ['a mark allocation', 'the number of marks showing how much is wanted'],
        ['a mark scheme', 'the document showing what earns each mark'],
        ['a level of response', 'a banded mark scheme judging the whole answer'],
        ['a stem', 'the part of the question giving context'],
        ['a resource', 'a source, table or graph a question refers to'],
        ['a distractor', 'a wrong option written to look plausible'],
        ['a key term', 'a word in the question that must be addressed'],
        ['a scaffold', 'a structure such as point, evidence, explain'],
        ['a time allocation', 'the minutes an answer is worth, set by its marks']
      ],
      truths: [
        'The command word decides the shape of the answer, not just its topic.',
        'A four-mark question wants four creditworthy points, or two developed ones.',
        'Describe asks what; explain asks why.',
        'Evaluate requires a judgement, not just a list of both sides.',
        'Time should be allocated by marks, not by how interesting a question is.'
      ],
      myths: [
        'Writing more always gains more marks.',
        'Describe and explain mean the same thing.',
        'Marks are awarded for effort rather than for content.',
        'Reading the question twice is wasted time.',
        'Every question in a paper is worth the same amount of time.'
      ],
      applications: [
        ['Which command word asks for reasons or causes?', 'explain'],
        ['Which command word asks for a judgement?', 'evaluate'],
        ['A wrong option written to look plausible is called what?', 'a distractor'],
        ['How should exam time be allocated?', 'by marks'],
        ['Which command word asks you to apply knowledge to a new situation?', 'suggest']
      ]
    },
    {
      name: 'Planning Timed Essays and Managing Exam Nerves', from: 'Grade 8', to: 'College',
      facts: [
        ['a plan', 'the brief outline written before an essay is started'],
        ['a thesis', 'the position an essay argues'],
        ['a topic sentence', 'the sentence opening a paragraph with its point'],
        ['a paragraph structure', 'the pattern of point, evidence and explanation'],
        ['a linking phrase', 'a phrase connecting one paragraph to the next'],
        ['a conclusion', 'the paragraph that answers the question directly'],
        ['a timing plan', 'the division of the exam into planned minutes'],
        ['a reading period', 'the time spent reading before writing begins'],
        ['a checking period', 'the minutes reserved at the end for corrections'],
        ['exam anxiety', 'the worry that interferes with performance in an exam'],
        ['arousal', 'the level of physiological activation'],
        ['optimal arousal', 'the level of alertness at which performance is best'],
        ['a breathing technique', 'slow controlled breathing used to lower arousal'],
        ['a grounding technique', 'a method of returning attention to the present'],
        ['catastrophising', 'imagining the worst possible outcome as certain'],
        ['a coping statement', 'a prepared sentence used to steady thinking'],
        ['sleep before an exam', 'the rest that protects memory and attention'],
        ['a revision plateau', 'the stage where progress stops feeling visible'],
        ['a first line', 'the opening sentence that gets writing started'],
        ['a fallback', 'the plan for what to do if a question looks impossible']
      ],
      truths: [
        'Some arousal improves performance; too much and too little both harm it.',
        'A five-minute plan usually earns back more than five minutes of writing.',
        'The conclusion should answer the question, not summarise the essay.',
        'Sleep before an exam protects recall better than a late extra hour of revision.',
        'Starting with the question you can answer is a legitimate strategy.'
      ],
      myths: [
        'Feeling nervous means you are unprepared.',
        'Planning wastes time that could be spent writing.',
        'The best strategy is always to answer questions in order.',
        'Staying up to revise is worth losing sleep for.',
        'A blank moment means the knowledge is gone.'
      ],
      applications: [
        ['What should a conclusion do?', 'answer the question'],
        ['The level of alertness at which performance is best is called what?', 'optimal arousal'],
        ['Imagining the worst outcome as certain is called what?', 'catastrophising'],
        ['What opens a paragraph with its point?', 'the topic sentence'],
        ['What should be reserved at the end of an exam?', 'a checking period']
      ]
    }
  ]
};
