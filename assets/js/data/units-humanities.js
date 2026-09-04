/* Humanities and social science micro-units.
   History is taught as periods, geography as themes, civics as institutions —
   so that is how the worksheets are organised. Dates and names are the ones a
   standard syllabus expects a student to be able to place. */

export const HUMANITIES_UNITS = {
  /* ================================ HISTORY ================================ */
  history: [
    {
      name: 'Ancient Egypt', from: 'Grade 6', to: 'Grade 10',
      facts: [
        ['pharaoh', 'the ruler of ancient Egypt, regarded as both king and god'],
        ['hieroglyphs', 'the picture-based writing system of ancient Egypt'],
        ['Rosetta Stone', 'the inscribed slab that allowed hieroglyphs to be deciphered'],
        ['mummification', 'the preservation of a body for the afterlife'],
        ['sarcophagus', 'the stone coffin holding a mummified body'],
        ['pyramid', 'the monumental tomb built for an Old Kingdom pharaoh'],
        ['Nile', 'the river whose annual flood made Egyptian farming possible'],
        ['papyrus', 'the reed-based writing material made along the Nile'],
        ['Tutankhamun', 'the boy pharaoh whose intact tomb was found in 1922'],
        ['Cleopatra VII', 'the last active pharaoh of Egypt, died 30 BCE'],
        ['scribe', 'a trained official who could read and write'],
        ['Valley of the Kings', 'the burial ground of New Kingdom pharaohs'],
        ['Howard Carter', 'the archaeologist who opened Tutankhamun’s tomb'],
        ['shaduf', 'the lever device used to lift water for irrigation']
      ],
      truths: [
        'The Nile flooded each year, leaving fertile silt on the fields.',
        'The Rosetta Stone carried the same text in three scripts, which is why it unlocked hieroglyphs.',
        'The great pyramids were built by paid and conscripted Egyptian workers, not by enslaved foreigners.',
        'Cleopatra VII lived closer in time to the Moon landing than to the building of the Great Pyramid.'
      ],
      myths: [
        'The pyramids were built by enslaved Israelites.',
        'Hieroglyphs were an alphabet of exactly twenty-six letters.',
        'The Nile flooded unpredictably, which is why Egyptian farming failed.',
        'Tutankhamun was Egypt’s longest-reigning and most powerful pharaoh.'
      ]
    },
    {
      name: 'Ancient Greece', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['polis', 'an independent Greek city-state'],
        ['Athens', 'the polis that developed the first direct democracy'],
        ['Sparta', 'the polis organised around military training'],
        ['democracy', 'rule by the citizen body, decided in assembly'],
        ['Acropolis', 'the fortified hilltop of a Greek city, notably Athens'],
        ['Parthenon', 'the temple to Athena on the Athenian Acropolis'],
        ['Socrates', 'the philosopher who taught by questioning, executed in 399 BCE'],
        ['Plato', 'the philosopher who wrote the Republic and founded the Academy'],
        ['Aristotle', 'the philosopher who tutored Alexander and classified the sciences'],
        ['Alexander the Great', 'the Macedonian king whose empire reached India'],
        ['Peloponnesian War', 'the long war between Athens and Sparta, 431–404 BCE'],
        ['Herodotus', 'the writer often called the father of history'],
        ['hoplite', 'a heavily armed Greek foot soldier fighting in a phalanx'],
        ['Olympic Games', 'the athletic festival held at Olympia every four years']
      ],
      truths: [
        'Athenian democracy excluded women, enslaved people and foreign residents.',
        'Greece was a set of independent city-states, not a single unified country.',
        'Sparta and Athens fought the Peloponnesian War, which Sparta won.',
        'Alexander the Great was Macedonian and was taught by Aristotle.'
      ],
      myths: [
        'Every adult living in Athens could vote in the assembly.',
        'Ancient Greece was a single kingdom ruled from Athens.',
        'Athens defeated Sparta in the Peloponnesian War.',
        'Greek temples were originally plain white marble with no colour.'
      ]
    },
    {
      name: 'Ancient Rome', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['republic', 'the Roman system of elected magistrates before 27 BCE'],
        ['Senate', 'the council of leading Romans that advised and governed'],
        ['consul', 'one of two annually elected heads of the Roman Republic'],
        ['legion', 'the main unit of the Roman army, several thousand strong'],
        ['Julius Caesar', 'the general whose assassination in 44 BCE ended the Republic’s crisis'],
        ['Augustus', 'the first Roman emperor, from 27 BCE'],
        ['aqueduct', 'the engineered channel carrying water into a Roman city'],
        ['Colosseum', 'the amphitheatre in Rome opened in 80 CE'],
        ['patrician', 'a member of the old Roman aristocracy'],
        ['plebeian', 'an ordinary Roman citizen outside the aristocracy'],
        ['Pax Romana', 'the long period of relative peace across the empire'],
        ['Hadrian’s Wall', 'the fortification marking a northern frontier in Britain'],
        ['Pompeii', 'the city buried by Vesuvius in 79 CE'],
        ['Constantine', 'the emperor who legalised Christianity in the empire']
      ],
      truths: [
        'Rome was a republic for roughly five centuries before it became an empire.',
        'Roman concrete allowed domes and aqueducts on a scale not matched for centuries.',
        'Julius Caesar was never crowned emperor; Augustus was the first.',
        'The western empire fell in 476 CE while the eastern empire continued for another thousand years.'
      ],
      myths: [
        'Julius Caesar was the first Roman emperor.',
        'Rome was ruled by emperors from its foundation.',
        'The whole Roman Empire collapsed in 476 CE.',
        'Roman roads were built mainly for merchants rather than the army.'
      ]
    },
    {
      name: 'The Middle Ages', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['feudalism', 'the system exchanging land for service and loyalty'],
        ['serf', 'a peasant bound to the land they worked'],
        ['manor', 'the estate at the centre of medieval rural life'],
        ['knight', 'a mounted warrior holding land in return for service'],
        ['Domesday Book', 'the 1086 survey of landholding in England'],
        ['Magna Carta', 'the 1215 charter limiting the English king’s power'],
        ['Black Death', 'the plague that killed a third of Europe from 1347'],
        ['Crusades', 'the religious wars for control of the Holy Land'],
        ['monastery', 'the religious community that preserved learning and manuscripts'],
        ['guild', 'an association of craftsmen controlling a trade'],
        ['cathedral', 'the great church housing a bishop’s seat'],
        ['Hundred Years’ War', 'the long conflict between England and France, 1337–1453'],
        ['Charlemagne', 'the Frankish king crowned emperor in 800'],
        ['Norman Conquest', 'the 1066 invasion of England by William of Normandy']
      ],
      truths: [
        'The Black Death caused labour shortages that weakened serfdom.',
        'Magna Carta was forced on King John by rebellious barons, not granted willingly.',
        'Monasteries were centres of copying and preserving texts.',
        'Educated medieval people knew the Earth was a sphere.'
      ],
      myths: [
        'Medieval Europeans believed the Earth was flat.',
        'Magna Carta gave ordinary peasants the right to vote.',
        'The Black Death had no lasting effect on the feudal system.',
        'Nothing was written or studied in Europe between 500 and 1400.'
      ]
    },
    {
      name: 'The Renaissance', from: 'Grade 7', to: 'College',
      facts: [
        ['Renaissance', 'the rebirth of classical learning and art from the 14th century'],
        ['humanism', 'the movement placing human potential and classical texts at the centre'],
        ['Leonardo da Vinci', 'the painter and engineer of the Mona Lisa and countless notebooks'],
        ['Michelangelo', 'the sculptor of David and painter of the Sistine Chapel ceiling'],
        ['perspective', 'the technique giving depth to a flat painting'],
        ['Gutenberg', 'the printer whose movable type spread books across Europe'],
        ['Medici', 'the Florentine banking family who funded artists'],
        ['patron', 'a wealthy sponsor who paid for works of art'],
        ['Florence', 'the Italian city where the Renaissance took hold first'],
        ['Copernicus', 'the astronomer who placed the Sun at the centre of the system'],
        ['Galileo', 'the astronomer whose telescope supported the Sun-centred model'],
        ['Reformation', 'the 16th-century split that produced Protestant churches'],
        ['Martin Luther', 'the monk whose 1517 theses began the Reformation'],
        ['vernacular', 'the everyday spoken language, increasingly used in print']
      ],
      truths: [
        'The printing press made books far cheaper and ideas far harder to suppress.',
        'Renaissance artists were paid by patrons, often the Church or wealthy families.',
        'Linear perspective gave Renaissance painting its convincing depth.',
        'The Reformation was accelerated by printing in the vernacular.'
      ],
      myths: [
        'Gutenberg invented paper as well as the printing press.',
        'Renaissance artists worked alone and unfunded, purely for self-expression.',
        'The Renaissance began in England before spreading to Italy.',
        'Copernicus proved his model with a telescope.'
      ]
    },
    {
      name: 'Exploration and Empire', from: 'Grade 7', to: 'College',
      facts: [
        ['circumnavigation', 'a voyage all the way around the world'],
        ['Christopher Columbus', 'the navigator whose 1492 voyage reached the Caribbean'],
        ['Ferdinand Magellan', 'the captain whose expedition first circled the globe'],
        ['Vasco da Gama', 'the navigator who reached India by sea in 1498'],
        ['colony', 'a territory settled and controlled by a distant state'],
        ['Columbian Exchange', 'the transfer of crops, animals and disease across the Atlantic'],
        ['conquistador', 'a Spanish conqueror in the Americas'],
        ['triangular trade', 'the Atlantic trading system that carried enslaved people'],
        ['Middle Passage', 'the Atlantic crossing endured by enslaved Africans'],
        ['mercantilism', 'the policy of enriching the state through controlled trade'],
        ['caravel', 'the small manoeuvrable ship used on Atlantic voyages'],
        ['astrolabe', 'the instrument used to find latitude at sea'],
        ['Treaty of Tordesillas', 'the 1494 division of new lands between Spain and Portugal'],
        ['abolition', 'the movement to end the slave trade and slavery']
      ],
      truths: [
        'European disease killed a far larger share of Indigenous Americans than warfare did.',
        'The Columbian Exchange moved potatoes and maize to Europe and horses to the Americas.',
        'Columbus never accepted that he had reached a continent unknown to Europeans.',
        'The transatlantic slave trade forcibly transported over twelve million people.'
      ],
      myths: [
        'Columbus set out to prove the Earth was round.',
        'The Americas were largely empty before Europeans arrived.',
        'The Columbian Exchange moved goods only from Europe to the Americas.',
        'Magellan personally completed the first voyage around the world.'
      ]
    },
    {
      name: 'The Industrial Revolution', from: 'Grade 7', to: 'College',
      facts: [
        ['Industrial Revolution', 'the shift to machine production from the late 18th century'],
        ['steam engine', 'the machine that freed factories from water power'],
        ['James Watt', 'the engineer whose improvements made steam power efficient'],
        ['factory system', 'production concentrated in one building under supervision'],
        ['urbanisation', 'the rapid growth of towns as workers arrived'],
        ['spinning jenny', 'the machine that multiplied a spinner’s output of thread'],
        ['canal', 'the artificial waterway that moved heavy goods before railways'],
        ['railway', 'the transport system that transformed speed and cost of travel'],
        ['trade union', 'an organisation of workers bargaining collectively'],
        ['child labour', 'the widespread employment of children in mills and mines'],
        ['Factory Acts', 'the laws that gradually limited hours and ages of work'],
        ['cholera', 'the water-borne disease that swept crowded industrial cities'],
        ['enclosure', 'the fencing of common land that pushed families off the countryside'],
        ['mass production', 'the making of identical goods in large quantities']
      ],
      truths: [
        'Industrial cities grew faster than sanitation could be built, causing epidemics.',
        'Steam power let factories be sited away from fast-flowing rivers.',
        'Early factory work meant long hours, dangerous machines and child labour.',
        'Britain industrialised first, followed by Belgium, France, Germany and the United States.'
      ],
      myths: [
        'Factory work immediately raised the living standards of the first generation of workers.',
        'The Industrial Revolution began in the United States.',
        'Trade unions were legal and welcomed from the very beginning.',
        'Railways were built before canals and steam engines.'
      ]
    },
    {
      name: 'Revolutions: America and France', from: 'Grade 8', to: 'College',
      facts: [
        ['Declaration of Independence', 'the 1776 statement of American separation from Britain'],
        ['Boston Tea Party', 'the 1773 protest against taxed tea'],
        ['no taxation without representation', 'the slogan of American colonial protest'],
        ['George Washington', 'the commander of the Continental Army and first president'],
        ['Bastille', 'the Paris prison stormed on 14 July 1789'],
        ['Estates-General', 'the French assembly summoned in 1789 after 175 years'],
        ['Third Estate', 'the commoners, the vast majority of the French population'],
        ['Declaration of the Rights of Man', 'the 1789 French statement of universal rights'],
        ['guillotine', 'the execution device used during the Terror'],
        ['Robespierre', 'the Jacobin leader associated with the Reign of Terror'],
        ['Napoleon Bonaparte', 'the general who became emperor of the French in 1804'],
        ['constitution', 'the written framework setting out how a state is governed'],
        ['Enlightenment', 'the movement of reason and rights that shaped both revolutions'],
        ['republic', 'a state without a monarch, headed by elected officials']
      ],
      truths: [
        'Both revolutions drew on Enlightenment arguments about rights and consent.',
        'French support for the American war helped bankrupt the French monarchy.',
        'The Declaration of Independence did not end slavery in the new United States.',
        'The French Revolution passed through a republic, the Terror and then Napoleon’s empire.'
      ],
      myths: [
        'The French Revolution produced a stable democracy immediately.',
        'The American Revolution granted equal rights to everyone living in the colonies.',
        'The two revolutions had no influence on each other.',
        'Napoleon restored the French monarchy under Louis XVI.'
      ]
    },
    {
      name: 'The First World War', from: 'Grade 8', to: 'College',
      facts: [
        ['Franz Ferdinand', 'the archduke whose assassination in 1914 triggered the war'],
        ['alliance system', 'the network of treaties that pulled Europe into a general war'],
        ['trench warfare', 'the static fighting from fortified ditches on the Western Front'],
        ['no man’s land', 'the ground between opposing trenches'],
        ['Somme', 'the 1916 battle with over a million casualties'],
        ['Verdun', 'the 1916 battle fought to bleed the French army'],
        ['Gallipoli', 'the failed 1915 campaign against the Ottoman Empire'],
        ['armistice', 'the ceasefire signed on 11 November 1918'],
        ['Treaty of Versailles', 'the 1919 settlement imposing terms on Germany'],
        ['reparations', 'the payments Germany was required to make after the war'],
        ['League of Nations', 'the post-war body created to prevent future wars'],
        ['conscription', 'compulsory enlistment into the armed forces'],
        ['propaganda', 'information shaped by a state to influence opinion'],
        ['Western Front', 'the line of trenches running from the North Sea to Switzerland']
      ],
      truths: [
        'The assassination in Sarajevo was the trigger, not the underlying cause.',
        'The Treaty of Versailles required Germany to accept responsibility and pay reparations.',
        'Machine guns and artillery made attacking far costlier than defending.',
        'The United States entered the war in 1917, near its end.'
      ],
      myths: [
        'The war was caused solely by the assassination of Franz Ferdinand.',
        'The war was expected by all sides to last for years.',
        'The United States fought from the very beginning in 1914.',
        'The League of Nations included the United States as a member.'
      ]
    },
    {
      name: 'The Second World War', from: 'Grade 8', to: 'College',
      facts: [
        ['appeasement', 'the policy of conceding to Hitler’s demands to avoid war'],
        ['blitzkrieg', 'the fast combined-arms attack used by German forces'],
        ['Dunkirk', 'the 1940 evacuation of Allied troops from France'],
        ['Battle of Britain', 'the 1940 air campaign over southern England'],
        ['Pearl Harbor', 'the 1941 attack that brought the United States into the war'],
        ['Stalingrad', 'the 1942–43 battle that turned the war in the east'],
        ['D-Day', 'the 6 June 1944 Allied landings in Normandy'],
        ['Holocaust', 'the Nazi genocide of six million Jews and other groups'],
        ['Auschwitz', 'the largest Nazi extermination camp'],
        ['Enigma', 'the German cipher machine broken by Allied codebreakers'],
        ['VE Day', 'the 8 May 1945 end of the war in Europe'],
        ['Hiroshima', 'the city on which the first atomic bomb was dropped in 1945'],
        ['United Nations', 'the organisation founded in 1945 to keep the peace'],
        ['Home Front', 'the civilian war effort of rationing, evacuation and production']
      ],
      truths: [
        'The Soviet Union suffered by far the greatest number of wartime deaths.',
        'The war in Europe ended in May 1945; the war with Japan ended in September.',
        'Breaking the Enigma cipher gave the Allies a major intelligence advantage.',
        'Appeasement at Munich in 1938 did not prevent war a year later.'
      ],
      myths: [
        'The United States entered the war in Europe in 1939.',
        'The war ended everywhere on VE Day in May 1945.',
        'The Holocaust was discovered only after the war ended, with no wartime evidence.',
        'Britain fought Germany alone for the whole war.'
      ]
    },
    {
      name: 'The Cold War', from: 'Grade 9', to: 'College',
      facts: [
        ['Cold War', 'the armed rivalry between the US and USSR without direct war'],
        ['Iron Curtain', 'Churchill’s phrase for the division of Europe'],
        ['NATO', 'the western military alliance formed in 1949'],
        ['Warsaw Pact', 'the eastern military alliance formed in 1955'],
        ['Marshall Plan', 'American economic aid to rebuild western Europe'],
        ['Berlin Wall', 'the barrier dividing Berlin from 1961 to 1989'],
        ['Cuban Missile Crisis', 'the 1962 standoff over missiles in Cuba'],
        ['arms race', 'the competitive build-up of nuclear weapons'],
        ['space race', 'the competition for achievements in spaceflight'],
        ['containment', 'the American policy of limiting the spread of communism'],
        ['détente', 'the 1970s easing of tension between the superpowers'],
        ['Glasnost', 'Gorbachev’s policy of openness in the Soviet Union'],
        ['Perestroika', 'Gorbachev’s policy of economic restructuring'],
        ['Berlin Airlift', 'the 1948–49 supply of West Berlin by air']
      ],
      truths: [
        'The Cold War was fought through proxy wars, propaganda and arms build-up rather than direct combat.',
        'The Cuban Missile Crisis brought the superpowers closest to nuclear war.',
        'The Berlin Wall fell in 1989 and the Soviet Union dissolved in 1991.',
        'The Marshall Plan aimed to make western Europe prosperous and therefore resistant to communism.'
      ],
      myths: [
        'The United States and Soviet Union fought each other directly in a declared war.',
        'The Berlin Wall was built in 1945 immediately after the war.',
        'The Soviet Union collapsed because it lost a war with NATO.',
        'The Cold War ended when the Cuban Missile Crisis was resolved.'
      ]
    },
    {
      name: 'Civil Rights and Social Change', from: 'Grade 8', to: 'College',
      facts: [
        ['segregation', 'the enforced separation of people by race'],
        ['Jim Crow laws', 'the state laws enforcing segregation in the American South'],
        ['Rosa Parks', 'the activist whose 1955 arrest sparked the Montgomery bus boycott'],
        ['Martin Luther King Jr', 'the leader of nonviolent civil rights campaigning'],
        ['Brown v. Board of Education', 'the 1954 ruling that school segregation was unconstitutional'],
        ['Civil Rights Act 1964', 'the law banning discrimination in public places and employment'],
        ['Voting Rights Act 1965', 'the law removing barriers to Black voter registration'],
        ['Nelson Mandela', 'the leader imprisoned for 27 years who became South Africa’s president'],
        ['apartheid', 'the South African system of legally enforced racial separation'],
        ['suffrage', 'the right to vote'],
        ['suffragette', 'a campaigner for women’s votes using militant tactics'],
        ['boycott', 'a refusal to buy or use something as a form of protest'],
        ['civil disobedience', 'the deliberate, peaceful breaking of an unjust law'],
        ['March on Washington', 'the 1963 demonstration for jobs and freedom']
      ],
      truths: [
        'Brown v. Board of Education was decided in 1954, a decade before the Civil Rights Act.',
        'The Montgomery bus boycott lasted over a year and was economically effective.',
        'Apartheid in South Africa ended with elections in 1994.',
        'Civil disobedience means breaking a law openly and accepting the penalty.'
      ],
      myths: [
        'Segregation ended immediately once the Supreme Court ruled against it.',
        'Rosa Parks acted entirely spontaneously with no connection to any organisation.',
        'Apartheid ended in the 1960s.',
        'Women were granted the vote in every country at the same time.'
      ]
    }
  ],

  /* =============================== GEOGRAPHY =============================== */
  geography: [
    {
      name: 'Map Skills', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['latitude', 'the distance north or south of the equator, in degrees'],
        ['longitude', 'the distance east or west of the prime meridian'],
        ['equator', 'the line of 0° latitude circling the Earth'],
        ['prime meridian', 'the line of 0° longitude, running through Greenwich'],
        ['scale', 'the ratio between distance on the map and on the ground'],
        ['contour line', 'a line joining points of equal height'],
        ['grid reference', 'a set of numbers locating a square or point on a map'],
        ['key', 'the panel explaining what the symbols on a map mean'],
        ['compass rose', 'the diagram showing direction on a map'],
        ['relief', 'the shape and height of the land surface'],
        ['bearing', 'a direction given as an angle clockwise from north'],
        ['aerial photograph', 'an image taken from above, often compared with a map'],
        ['Ordnance Survey', 'the national mapping agency of Great Britain'],
        ['projection', 'the method of flattening a curved Earth onto a flat map']
      ],
      truths: [
        'Contour lines close together mean a steep slope.',
        'Latitude is given before longitude in a coordinate pair.',
        'Every flat map distorts area, shape or distance in some way.',
        'A four-figure grid reference identifies a square; a six-figure one narrows it down.'
      ],
      myths: [
        'Contour lines close together mean flat ground.',
        'The Mercator projection shows the true relative sizes of countries.',
        'Longitude is measured from the equator.',
        'A larger-scale map always covers a larger area.'
      ]
    },
    {
      name: 'Continents, Oceans and Countries', from: 'Grade 4', to: 'Grade 9',
      facts: [
        ['Asia', 'the largest continent by area and population'],
        ['Africa', 'the continent crossed by the equator and the Sahara'],
        ['Europe', 'the continent bounded by the Urals in the east'],
        ['North America', 'the continent containing Canada, the United States and Mexico'],
        ['South America', 'the continent containing the Amazon basin and the Andes'],
        ['Antarctica', 'the ice-covered continent surrounding the South Pole'],
        ['Oceania', 'the continent-region containing Australia and the Pacific islands'],
        ['Pacific Ocean', 'the largest and deepest ocean'],
        ['Atlantic Ocean', 'the ocean between the Americas and Europe and Africa'],
        ['Indian Ocean', 'the ocean bounded by Africa, Asia and Australia'],
        ['Arctic Ocean', 'the smallest and shallowest ocean'],
        ['Southern Ocean', 'the ocean encircling Antarctica'],
        ['hemisphere', 'one half of the globe, divided by the equator or a meridian'],
        ['tropics', 'the zone between the Tropic of Cancer and the Tropic of Capricorn']
      ],
      truths: [
        'The Pacific is larger than all the land on Earth put together.',
        'Russia lies in both Europe and Asia.',
        'Antarctica is a desert because it receives very little precipitation.',
        'The equator passes through Africa, South America and Asia.'
      ],
      myths: [
        'The Atlantic is the largest ocean.',
        'Australia is a country but not a continent, and Oceania does not exist.',
        'Antarctica has heavy annual rainfall.',
        'The equator passes through Europe.'
      ]
    },
    {
      name: 'Climate Zones and Biomes', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['biome', 'a large region defined by its climate, plants and animals'],
        ['tropical rainforest', 'the hot, wet biome of highest biodiversity'],
        ['savanna', 'the tropical grassland with a marked dry season'],
        ['desert', 'a biome receiving under 250 mm of precipitation a year'],
        ['temperate forest', 'the biome of deciduous trees and four distinct seasons'],
        ['taiga', 'the cold coniferous forest belt of the far north'],
        ['tundra', 'the treeless biome with permanently frozen subsoil'],
        ['permafrost', 'ground that stays frozen for two or more years'],
        ['Mediterranean climate', 'hot dry summers and mild wet winters'],
        ['monsoon', 'a seasonal reversal of wind bringing heavy rain'],
        ['canopy', 'the dense upper layer of a rainforest'],
        ['adaptation', 'a feature that suits an organism to its climate'],
        ['latitude effect', 'the way temperature falls as you move away from the equator'],
        ['continentality', 'the way places far from the sea have greater temperature extremes']
      ],
      truths: [
        'Deserts are defined by low precipitation, not by high temperature.',
        'Rainforest soils are often poor because nutrients are held in the vegetation.',
        'Tundra has permafrost, which stops deep roots and drainage.',
        'Coastal places have smaller temperature ranges than inland places at the same latitude.'
      ],
      myths: [
        'A desert must be hot to count as a desert.',
        'Rainforest soil is exceptionally fertile because so much grows there.',
        'The tundra is a hot, dry biome.',
        'Places at the same latitude always have the same climate.'
      ]
    },
    {
      name: 'Rivers, Coasts and Landforms', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['erosion', 'the wearing away and removal of rock by a moving force'],
        ['deposition', 'the laying down of transported material'],
        ['longshore drift', 'the zig-zag movement of sediment along a coast'],
        ['spit', 'the ridge of sand extending from a coastline'],
        ['headland', 'the resistant rock projecting into the sea'],
        ['bay', 'the curved inlet cut into softer rock between headlands'],
        ['stack', 'the isolated pillar left when an arch collapses'],
        ['meander', 'a sweeping bend in a river’s course'],
        ['floodplain', 'the flat valley floor covered when a river overflows'],
        ['estuary', 'the tidal mouth where a river meets the sea'],
        ['delta', 'the fan of sediment deposited at a river mouth'],
        ['groyne', 'a wooden barrier built to trap sediment on a beach'],
        ['hard engineering', 'coastal defence using built structures like sea walls'],
        ['soft engineering', 'coastal management working with natural processes']
      ],
      truths: [
        'Longshore drift moves sediment along the coast in the direction of the prevailing wind.',
        'Caves, arches, stacks and stumps form in that order on a headland.',
        'Hard engineering is expensive and often shifts erosion further along the coast.',
        'A river’s discharge usually increases downstream as tributaries join.'
      ],
      myths: [
        'Longshore drift moves sediment straight out to sea.',
        'A stack forms before the arch that produces it.',
        'Sea walls stop erosion permanently with no side effects.',
        'Rivers erode most in their lower course near the sea.'
      ]
    },
    {
      name: 'Population and Migration', from: 'Grade 7', to: 'College',
      facts: [
        ['birth rate', 'the number of live births per thousand people per year'],
        ['death rate', 'the number of deaths per thousand people per year'],
        ['natural increase', 'the birth rate minus the death rate'],
        ['population density', 'the number of people per square kilometre'],
        ['migration', 'the movement of people to live in a new place'],
        ['immigration', 'movement into a country'],
        ['emigration', 'movement out of a country'],
        ['push factor', 'a condition driving people away from a place'],
        ['pull factor', 'a condition attracting people to a place'],
        ['refugee', 'a person forced to flee across a border for their safety'],
        ['demographic transition', 'the model of changing birth and death rates as a country develops'],
        ['population pyramid', 'the graph showing age and sex structure of a population'],
        ['dependency ratio', 'the proportion of people not of working age'],
        ['ageing population', 'a population with a growing share of older people']
      ],
      truths: [
        'Death rates usually fall before birth rates during development, so population grows fast in between.',
        'A wide-based population pyramid indicates high birth rates.',
        'Most migration in the world happens within a country, not between countries.',
        'A refugee has crossed a border; an internally displaced person has not.'
      ],
      myths: [
        'Birth rates fall before death rates as a country develops.',
        'A narrow-based population pyramid indicates a high birth rate.',
        'Most migrants in the world are international rather than internal.',
        'Population density and total population mean the same thing.'
      ]
    },
    {
      name: 'Urbanisation and Settlement', from: 'Grade 7', to: 'College',
      facts: [
        ['urbanisation', 'the rising share of a population living in towns and cities'],
        ['megacity', 'a city with more than ten million inhabitants'],
        ['rural-urban migration', 'movement from the countryside to the city'],
        ['central business district', 'the commercial core of a city'],
        ['suburb', 'the largely residential zone on a city’s edge'],
        ['informal settlement', 'unplanned housing built without legal title or services'],
        ['counter-urbanisation', 'the movement of people out of cities to rural areas'],
        ['gentrification', 'the arrival of wealthier residents that raises prices in an area'],
        ['green belt', 'protected open land restricting a city’s outward growth'],
        ['brownfield site', 'previously built-on land available for redevelopment'],
        ['greenfield site', 'undeveloped land on the edge of a settlement'],
        ['urban sprawl', 'the low-density spread of a city into surrounding land'],
        ['sustainable city', 'a city designed to meet present needs without exhausting resources'],
        ['commuter', 'someone who travels regularly between home and work']
      ],
      truths: [
        'More than half the world’s people now live in urban areas.',
        'Rapid urbanisation often outpaces the building of housing and sanitation.',
        'Brownfield development reuses land but usually costs more to prepare.',
        'Gentrification can improve buildings while displacing existing residents.'
      ],
      myths: [
        'Urbanisation means cities getting physically larger in area only.',
        'Most of the world’s population still lives in rural areas.',
        'Greenfield sites are always cheaper for society overall than brownfield ones.',
        'Informal settlements are always temporary and empty within a few years.'
      ]
    },
    {
      name: 'Resources and Development', from: 'Grade 8', to: 'College',
      facts: [
        ['GDP per capita', 'the total value of goods and services divided by population'],
        ['HDI', 'a combined measure of income, education and life expectancy'],
        ['renewable resource', 'a resource replenished as fast as it is used'],
        ['non-renewable resource', 'a resource that is finite on a human timescale'],
        ['fossil fuel', 'coal, oil or gas formed from ancient organic matter'],
        ['food security', 'reliable access to enough safe and nutritious food'],
        ['water stress', 'the condition of demand for water exceeding supply'],
        ['fair trade', 'a system guaranteeing producers a minimum price'],
        ['aid', 'assistance given by one country or agency to another'],
        ['development gap', 'the difference in living standards between richer and poorer countries'],
        ['primary sector', 'the part of the economy extracting raw materials'],
        ['secondary sector', 'the part of the economy manufacturing goods'],
        ['tertiary sector', 'the part of the economy providing services'],
        ['literacy rate', 'the share of adults able to read and write']
      ],
      truths: [
        'HDI combines several indicators, so it captures more than income alone.',
        'As a country develops, employment usually shifts from the primary to the tertiary sector.',
        'Aid can help in an emergency but does not by itself close the development gap.',
        'A country can have high GDP per capita and still have poor health outcomes.'
      ],
      myths: [
        'GDP per capita alone is a complete measure of a country’s development.',
        'Development means every country follows exactly the same path.',
        'Renewable resources cannot be exhausted no matter how they are used.',
        'Employment shifts from services to farming as a country develops.'
      ]
    },
    {
      name: 'Natural Hazards', from: 'Grade 6', to: 'College',
      facts: [
        ['natural hazard', 'a natural event that threatens people or property'],
        ['tectonic hazard', 'a hazard caused by plate movement, such as an earthquake'],
        ['tropical cyclone', 'the intense low-pressure storm formed over warm oceans'],
        ['storm surge', 'the raised sea level pushed ashore by a storm'],
        ['tsunami', 'the sea wave generated by displacement of the ocean floor'],
        ['drought', 'a prolonged period of unusually low rainfall'],
        ['wildfire', 'an uncontrolled fire spreading through vegetation'],
        ['magnitude', 'a measure of the energy released by an earthquake'],
        ['vulnerability', 'how exposed and unprepared a population is'],
        ['mitigation', 'action taken to reduce the impact of a hazard'],
        ['preparedness', 'planning and drills done before a hazard strikes'],
        ['aftershock', 'a smaller quake following the main shock'],
        ['evacuation', 'the organised movement of people out of a danger zone'],
        ['hazard risk', 'the chance of being affected by a hazard']
      ],
      truths: [
        'The same magnitude earthquake causes far more deaths in a poorly prepared area.',
        'Tropical cyclones need sea surface temperatures above about 27 °C to form.',
        'Most tsunami deaths come from flooding rather than the height of a breaking wave.',
        'Preparedness and building codes reduce deaths more than prediction alone.'
      ],
      myths: [
        'Earthquake deaths depend only on the magnitude of the quake.',
        'Tropical cyclones form over cold ocean water.',
        'Modern science can reliably predict the exact date of an earthquake.',
        'A tsunami is caused by strong winds over the ocean.'
      ]
    }
  ],

  /* ================================= CIVICS ================================= */
  civics: [
    {
      name: 'Branches of Government', from: 'Grade 6', to: 'College',
      facts: [
        ['legislature', 'the branch that makes laws'],
        ['executive', 'the branch that carries out laws'],
        ['judiciary', 'the branch that interprets laws and settles disputes'],
        ['separation of powers', 'the division of government into independent branches'],
        ['checks and balances', 'the powers each branch has to limit the others'],
        ['bicameral', 'having two legislative chambers'],
        ['veto', 'the power to reject a proposed law'],
        ['cabinet', 'the group of senior ministers heading government departments'],
        ['head of state', 'the person who formally represents the country'],
        ['head of government', 'the person who leads the day-to-day running of the state'],
        ['civil service', 'the permanent staff who administer government'],
        ['bill', 'a proposed law before it is passed'],
        ['statute', 'a law that has been passed by the legislature'],
        ['judicial review', 'a court’s power to rule an action unlawful']
      ],
      truths: [
        'Separation of powers exists so that no single branch can act without limit.',
        'A bill becomes a statute only after passing the legislature and receiving assent.',
        'In some systems the head of state and head of government are different people.',
        'Courts interpret laws; they do not write them.'
      ],
      myths: [
        'The judiciary writes new laws when it disagrees with the legislature.',
        'A bill and a statute are the same thing.',
        'Every democracy has exactly the same three branches with identical powers.',
        'The head of state always runs the government day to day.'
      ]
    },
    {
      name: 'Constitutions and Rights', from: 'Grade 7', to: 'College',
      facts: [
        ['constitution', 'the framework setting out how a state is governed'],
        ['codified constitution', 'a constitution written down in a single document'],
        ['uncodified constitution', 'a constitution drawn from many sources and conventions'],
        ['bill of rights', 'a statement of the rights a government may not remove'],
        ['amendment', 'a formal change to a constitution'],
        ['rule of law', 'the principle that everyone is subject to the same law'],
        ['civil liberties', 'freedoms protected from government interference'],
        ['due process', 'the requirement that legal procedures be fair'],
        ['freedom of expression', 'the right to hold and share opinions'],
        ['equality before the law', 'the principle that the law applies to all alike'],
        ['human rights', 'rights held by every person simply for being human'],
        ['sovereignty', 'ultimate authority within a territory'],
        ['federalism', 'the sharing of power between national and regional governments'],
        ['devolution', 'the transfer of certain powers to a regional body']
      ],
      truths: [
        'The rule of law means the government itself is bound by the law.',
        'Rights are rarely absolute: most can be limited for defined reasons.',
        'Some democracies, such as the United Kingdom, have no single written constitution.',
        'Federalism divides power between levels of government by constitutional rule.'
      ],
      myths: [
        'Every democracy has a single written constitution.',
        'Freedom of expression protects all speech in every circumstance without limit.',
        'The rule of law means the government is above the law it enforces.',
        'Devolution and independence mean the same thing.'
      ]
    },
    {
      name: 'Elections and Voting', from: 'Grade 6', to: 'College',
      facts: [
        ['suffrage', 'the right to vote in elections'],
        ['constituency', 'the area represented by one elected member'],
        ['first past the post', 'the system in which the candidate with most votes wins'],
        ['proportional representation', 'a system allocating seats in proportion to votes'],
        ['turnout', 'the percentage of eligible voters who cast a ballot'],
        ['manifesto', 'the statement of what a party promises to do'],
        ['secret ballot', 'voting in private so no one can see the choice'],
        ['coalition', 'a government formed by more than one party together'],
        ['referendum', 'a vote by the whole electorate on a single question'],
        ['electorate', 'all the people entitled to vote'],
        ['candidate', 'a person standing for election'],
        ['by-election', 'an election held to fill a single vacant seat'],
        ['swing', 'the shift in support from one party to another between elections'],
        ['incumbent', 'the person currently holding the seat or office']
      ],
      truths: [
        'First past the post tends to produce single-party majorities and to under-represent small parties.',
        'Proportional representation makes coalition government more likely.',
        'A secret ballot protects voters from pressure and intimidation.',
        'Low turnout weakens the claim that a result reflects the whole electorate.'
      ],
      myths: [
        'First past the post gives each party a share of seats matching its share of votes.',
        'A referendum result is always legally binding on the government.',
        'Coalition governments are impossible under proportional representation.',
        'Turnout means the number of candidates standing in an election.'
      ]
    },
    {
      name: 'Law and the Courts', from: 'Grade 7', to: 'College',
      facts: [
        ['criminal law', 'the law dealing with offences against the state and public'],
        ['civil law', 'the law dealing with disputes between individuals or organisations'],
        ['prosecution', 'the side bringing a criminal case'],
        ['defence', 'the side representing the accused'],
        ['jury', 'the panel of citizens who decide the facts in some trials'],
        ['magistrate', 'a judge who hears less serious cases'],
        ['precedent', 'a past decision that guides later similar cases'],
        ['burden of proof', 'the duty to prove an allegation'],
        ['beyond reasonable doubt', 'the standard of proof in a criminal trial'],
        ['balance of probabilities', 'the standard of proof in a civil case'],
        ['appeal', 'a request for a higher court to review a decision'],
        ['sentence', 'the penalty imposed after a conviction'],
        ['presumption of innocence', 'the rule that the accused is innocent until proven guilty'],
        ['legal aid', 'public funding for those who cannot pay for representation']
      ],
      truths: [
        'The burden of proof in a criminal trial rests with the prosecution.',
        'Civil cases are decided on the balance of probabilities, a lower standard than criminal cases.',
        'A person found not guilty has not been proven innocent, only not proven guilty.',
        'Precedent means similar cases should be decided in similar ways.'
      ],
      myths: [
        'The accused must prove their innocence in a criminal trial.',
        'Criminal and civil cases use exactly the same standard of proof.',
        'Every criminal case is decided by a jury.',
        'A judge can ignore precedent whenever they personally disagree with it.'
      ]
    },
    {
      name: 'Local Government and Community', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['local council', 'the elected body running services in an area'],
        ['councillor', 'an elected member of a local council'],
        ['mayor', 'the elected or ceremonial head of a city or town'],
        ['local taxation', 'the charge on residents or property funding local services'],
        ['public services', 'services provided for everyone, such as libraries and refuse collection'],
        ['planning permission', 'the approval needed before certain building work'],
        ['budget', 'the plan of how money will be raised and spent'],
        ['consultation', 'the process of asking residents before making a decision'],
        ['petition', 'a signed request asking an authority to act'],
        ['volunteering', 'giving time without pay to help a community'],
        ['charity', 'an organisation set up for public benefit rather than profit'],
        ['pressure group', 'an organisation campaigning to influence policy'],
        ['ward', 'a division of a local authority area with its own councillors'],
        ['byelaw', 'a local rule made by a council for its own area']
      ],
      truths: [
        'Local councils raise some of their money locally and receive some from central government.',
        'Councillors are elected and can be voted out at the next local election.',
        'Planning decisions are usually made locally within national rules.',
        'Pressure groups try to influence decisions without seeking to form a government.'
      ],
      myths: [
        'Local councils are appointed by the national government.',
        'Local government has no power over how money in its area is spent.',
        'Pressure groups and political parties have exactly the same aim.',
        'Byelaws apply nationally once a council has passed them.'
      ]
    },
    {
      name: 'Citizenship and Global Institutions', from: 'Grade 7', to: 'College',
      facts: [
        ['citizenship', 'legal membership of a state, with rights and duties'],
        ['United Nations', 'the international body founded in 1945 to keep peace'],
        ['Security Council', 'the UN body that can authorise action, with five permanent members'],
        ['UNICEF', 'the UN agency for children'],
        ['WHO', 'the UN agency for global public health'],
        ['NGO', 'a non-governmental organisation working independently of states'],
        ['treaty', 'a formal agreement between states'],
        ['sanctions', 'restrictions imposed to pressure a state to change course'],
        ['International Court of Justice', 'the UN court settling disputes between states'],
        ['peacekeeping', 'the deployment of forces to maintain a ceasefire'],
        ['sovereign state', 'a territory with its own government and recognised borders'],
        ['globalisation', 'the growing interconnection of economies and cultures'],
        ['diplomacy', 'the conduct of relations between states by negotiation'],
        ['Universal Declaration of Human Rights', 'the 1948 statement of rights adopted by the UN']
      ],
      truths: [
        'Five permanent members of the UN Security Council can veto a resolution.',
        'The UN has no army of its own; peacekeepers are supplied by member states.',
        'NGOs are independent of governments even when they receive government funding.',
        'The Universal Declaration of Human Rights is a declaration, not a binding treaty.'
      ],
      myths: [
        'The United Nations is a world government that can overrule national laws.',
        'The UN maintains a permanent standing army of its own.',
        'Every member of the Security Council has a veto.',
        'Citizenship and residence are the same legal status.'
      ]
    }
  ],

  /* =============================== ECONOMICS =============================== */
  economics: [
    {
      name: 'Supply, Demand and Price', from: 'Grade 8', to: 'College',
      facts: [
        ['demand', 'the quantity buyers are willing and able to buy at each price'],
        ['supply', 'the quantity producers are willing to offer at each price'],
        ['equilibrium price', 'the price at which supply and demand are equal'],
        ['surplus', 'the excess when the price is above equilibrium'],
        ['shortage', 'the gap when the price is below equilibrium'],
        ['substitute good', 'a good bought instead of another'],
        ['complementary good', 'a good usually bought alongside another'],
        ['price elasticity', 'how much quantity responds to a change in price'],
        ['inferior good', 'a good bought less as incomes rise'],
        ['normal good', 'a good bought more as incomes rise'],
        ['scarcity', 'the fundamental problem of limited resources and unlimited wants'],
        ['opportunity cost', 'the value of the next best alternative given up'],
        ['market', 'any arrangement bringing buyers and sellers together'],
        ['subsidy', 'a government payment that lowers the cost of producing a good']
      ],
      truths: [
        'A price above equilibrium creates a surplus that pushes the price down.',
        'A change in price moves along a demand curve; a change in income shifts it.',
        'Opportunity cost applies to every choice, including free ones.',
        'Demand for a good with close substitutes is usually more elastic.'
      ],
      myths: [
        'A rise in the price of a good shifts its demand curve to the left.',
        'A price above equilibrium creates a shortage of the good.',
        'Something with no money price has no opportunity cost.',
        'Supply and demand only apply to physical goods, not services.'
      ]
    },
    {
      name: 'Markets, Firms and Competition', from: 'Grade 9', to: 'College',
      facts: [
        ['competition', 'rivalry between firms for customers'],
        ['monopoly', 'a market dominated by a single supplier'],
        ['oligopoly', 'a market dominated by a few large firms'],
        ['barrier to entry', 'something that makes it hard for new firms to join a market'],
        ['economies of scale', 'the fall in average cost as output grows'],
        ['fixed cost', 'a cost that does not change with output'],
        ['variable cost', 'a cost that rises with output'],
        ['revenue', 'the money a firm receives from sales'],
        ['profit', 'revenue minus total costs'],
        ['market share', 'a firm’s sales as a proportion of the market'],
        ['productivity', 'output per worker or per hour'],
        ['regulation', 'rules imposed on firms to protect consumers or competition'],
        ['break-even', 'the output at which revenue exactly covers costs'],
        ['innovation', 'the introduction of new products or methods']
      ],
      truths: [
        'Profit is what remains after all costs are deducted from revenue.',
        'Monopolies can charge more and innovate less because they face no rival.',
        'Economies of scale mean average cost falls as output rises.',
        'A firm can have rising revenue and still make a loss.'
      ],
      myths: [
        'Revenue and profit are the same thing.',
        'A firm with the highest sales must be the most profitable.',
        'Economies of scale mean total costs fall as output rises.',
        'Monopoly means having several competing suppliers.'
      ]
    },
    {
      name: 'Money, Banking and Credit', from: 'Grade 8', to: 'College',
      facts: [
        ['money', 'anything widely accepted in exchange for goods and services'],
        ['medium of exchange', 'the function of money in avoiding barter'],
        ['store of value', 'the function of money in holding purchasing power over time'],
        ['interest', 'the cost of borrowing or the reward for saving'],
        ['APR', 'the annual percentage rate showing the true cost of borrowing'],
        ['central bank', 'the institution that sets interest rates and issues currency'],
        ['commercial bank', 'a bank that takes deposits and makes loans to the public'],
        ['credit', 'money borrowed and repaid later, usually with interest'],
        ['debt', 'money owed to someone else'],
        ['collateral', 'an asset pledged to secure a loan'],
        ['mortgage', 'a long-term loan secured against property'],
        ['liquidity', 'how easily an asset can be turned into cash'],
        ['exchange rate', 'the price of one currency in terms of another'],
        ['savings account', 'an account paying interest on deposited money']
      ],
      truths: [
        'A higher APR means a loan costs more over a year.',
        'Central banks influence the economy mainly by changing interest rates.',
        'Money works as a medium of exchange, a store of value and a unit of account.',
        'Secured borrowing is cheaper because the lender can claim the collateral.'
      ],
      myths: [
        'A longer loan term always means paying less in total.',
        'Commercial banks set the national base interest rate.',
        'Cash is the only thing that counts as money in an economy.',
        'Paying only the minimum on a credit card clears the debt quickly.'
      ]
    },
    {
      name: 'Inflation, Unemployment and Growth', from: 'Grade 9', to: 'College',
      facts: [
        ['inflation', 'a sustained rise in the general price level'],
        ['deflation', 'a sustained fall in the general price level'],
        ['CPI', 'the consumer price index used to measure inflation'],
        ['real value', 'a value adjusted for the effect of inflation'],
        ['nominal value', 'a value measured in current prices, unadjusted'],
        ['unemployment rate', 'the share of the labour force without work and seeking it'],
        ['recession', 'a period of falling output, often two successive quarters'],
        ['GDP', 'the total value of goods and services produced in a country'],
        ['economic growth', 'an increase in real output over time'],
        ['cost-push inflation', 'inflation caused by rising production costs'],
        ['demand-pull inflation', 'inflation caused by demand outstripping supply'],
        ['purchasing power', 'the amount of goods a given sum of money can buy'],
        ['structural unemployment', 'unemployment caused by a mismatch of skills and jobs'],
        ['living standards', 'the material wellbeing of a population']
      ],
      truths: [
        'Inflation reduces the purchasing power of money over time.',
        'Falling inflation still means prices are rising, only more slowly.',
        'A wage rise below the inflation rate is a cut in real terms.',
        'GDP growth does not automatically mean everyone is better off.'
      ],
      myths: [
        'Falling inflation means prices are falling.',
        'A pay rise of any size always makes workers better off in real terms.',
        'Deflation is always good for an economy.',
        'Unemployment counts everyone without a job, including retired people.'
      ]
    },
    {
      name: 'Trade and Globalisation', from: 'Grade 9', to: 'College',
      facts: [
        ['import', 'a good or service bought from another country'],
        ['export', 'a good or service sold to another country'],
        ['tariff', 'a tax on imported goods'],
        ['quota', 'a limit on the quantity of a good that may be imported'],
        ['free trade', 'trade without tariffs or quotas'],
        ['protectionism', 'the use of barriers to shield domestic producers'],
        ['trade deficit', 'the excess of imports over exports'],
        ['comparative advantage', 'the ability to produce at a lower opportunity cost'],
        ['supply chain', 'the sequence of steps that brings a product to market'],
        ['multinational corporation', 'a firm operating in more than one country'],
        ['outsourcing', 'contracting work out to another firm, often abroad'],
        ['World Trade Organization', 'the body that oversees the rules of international trade'],
        ['customs union', 'a group of states applying a common external tariff'],
        ['exchange rate', 'the price at which one currency trades for another']
      ],
      truths: [
        'A tariff raises the price of imports for domestic buyers.',
        'Comparative advantage explains gains from trade even when one country is better at everything.',
        'A weaker currency makes exports cheaper abroad and imports dearer at home.',
        'Globalisation creates both winners and losers within the same country.'
      ],
      myths: [
        'A country only benefits from trade if it is better at producing the good.',
        'Tariffs are paid entirely by the exporting country.',
        'A trade deficit always means an economy is failing.',
        'A stronger currency always benefits every part of an economy.'
      ]
    },
    {
      name: 'Government and the Economy', from: 'Grade 10', to: 'College',
      facts: [
        ['fiscal policy', 'the use of government spending and taxation'],
        ['monetary policy', 'the use of interest rates and money supply'],
        ['budget deficit', 'the excess of government spending over revenue in a year'],
        ['national debt', 'the accumulated total the government owes'],
        ['progressive tax', 'a tax taking a larger share from higher incomes'],
        ['regressive tax', 'a tax taking a larger share from lower incomes'],
        ['direct tax', 'a tax on income or profit paid straight to government'],
        ['indirect tax', 'a tax on spending, collected by the seller'],
        ['public spending', 'government expenditure on services and transfers'],
        ['welfare state', 'the system of state support for those in need'],
        ['market failure', 'a situation where markets do not allocate resources efficiently'],
        ['externality', 'a cost or benefit falling on someone outside the transaction'],
        ['public good', 'a good that is non-excludable and non-rival'],
        ['austerity', 'a policy of reducing public spending to cut a deficit']
      ],
      truths: [
        'A deficit is an annual flow; the national debt is the accumulated stock.',
        'Pollution is a classic negative externality and a form of market failure.',
        'Sales taxes tend to be regressive because they take a bigger share of small incomes.',
        'Fiscal policy is set by government; monetary policy is usually set by a central bank.'
      ],
      myths: [
        'The budget deficit and the national debt are the same number.',
        'A flat sales tax affects rich and poor households equally as a share of income.',
        'Central banks decide the level of income tax.',
        'Markets always allocate resources efficiently with no exceptions.'
      ]
    },
    {
      name: 'Personal Economics and Work', from: 'Grade 8', to: 'College',
      facts: [
        ['gross pay', 'earnings before any deductions'],
        ['net pay', 'earnings after tax and other deductions'],
        ['income tax', 'the tax deducted from earnings'],
        ['minimum wage', 'the lowest hourly rate an employer may legally pay'],
        ['salary', 'a fixed annual amount paid in regular instalments'],
        ['contract', 'the agreement setting out the terms of employment'],
        ['pension', 'money saved during working life to provide income in retirement'],
        ['budget', 'a plan matching expected income to planned spending'],
        ['fixed expense', 'a regular cost that stays the same each month'],
        ['discretionary spending', 'spending on things that are wanted but not needed'],
        ['emergency fund', 'savings kept aside for unexpected costs'],
        ['insurance', 'a contract paying out if a specified loss occurs'],
        ['self-employment', 'working for oneself rather than for an employer'],
        ['payslip', 'the document showing pay and deductions']
      ],
      truths: [
        'Net pay is always lower than gross pay once deductions are made.',
        'Starting a pension earlier means contributions have longer to grow.',
        'An emergency fund is what prevents an unexpected cost becoming debt.',
        'Self-employed workers must arrange their own tax and pension contributions.'
      ],
      myths: [
        'Gross pay is the amount that arrives in a bank account.',
        'Pensions only matter once someone is close to retiring.',
        'Insurance pays out for any loss whatsoever.',
        'Budgeting is only necessary for people on low incomes.'
      ]
    }
  ],

  /* =============================== PHILOSOPHY =============================== */
  philosophy: [
    {
      name: 'Logic and Argument', from: 'Grade 9', to: 'College',
      facts: [
        ['premise', 'a statement offered in support of a conclusion'],
        ['conclusion', 'the claim an argument is trying to establish'],
        ['valid argument', 'an argument whose conclusion follows from its premises'],
        ['sound argument', 'a valid argument with true premises'],
        ['deduction', 'reasoning where true premises guarantee the conclusion'],
        ['induction', 'reasoning from particular cases to a general claim'],
        ['fallacy', 'a flaw in reasoning that makes an argument fail'],
        ['ad hominem', 'attacking the person instead of the argument'],
        ['straw man', 'misrepresenting an argument to make it easier to attack'],
        ['false dilemma', 'presenting only two options when more exist'],
        ['circular reasoning', 'assuming in the premises what you set out to prove'],
        ['slippery slope', 'claiming one step must lead to an extreme outcome'],
        ['appeal to authority', 'treating a claim as true merely because an expert said it'],
        ['counterexample', 'a case that shows a general claim to be false']
      ],
      truths: [
        'A valid argument can have a false conclusion if one of its premises is false.',
        'Soundness requires both validity and true premises.',
        'A single counterexample is enough to defeat a universal claim.',
        'Attacking the arguer rather than the argument is a fallacy even when the insult is accurate.'
      ],
      myths: [
        'Every valid argument has a true conclusion.',
        'An argument is sound whenever the conclusion sounds reasonable.',
        'Induction gives the same certainty as deduction.',
        'A fallacious argument always has a false conclusion.'
      ]
    },
    {
      name: 'Ethics and Moral Theory', from: 'Grade 9', to: 'College',
      facts: [
        ['ethics', 'the study of what makes actions right or wrong'],
        ['utilitarianism', 'the view that the right act produces the greatest overall wellbeing'],
        ['deontology', 'the view that some acts are right or wrong regardless of outcome'],
        ['virtue ethics', 'the view that ethics is about the character a person develops'],
        ['categorical imperative', 'Kant’s rule that a maxim must be universalisable'],
        ['consequentialism', 'judging actions by their results'],
        ['moral relativism', 'the view that moral truth varies between cultures'],
        ['moral absolutism', 'the view that some acts are always wrong'],
        ['golden rule', 'the principle of treating others as you would want to be treated'],
        ['autonomy', 'the capacity to decide for oneself'],
        ['justice', 'the fair distribution of benefits and burdens'],
        ['trolley problem', 'the thought experiment contrasting action and outcome'],
        ['applied ethics', 'the study of moral questions in specific fields'],
        ['moral dilemma', 'a situation in which every option violates some duty']
      ],
      truths: [
        'Utilitarianism judges an act by its consequences; deontology does not.',
        'Kant argued that a moral rule must be one you could will everyone to follow.',
        'Virtue ethics asks what kind of person to be rather than what rule to follow.',
        'Thought experiments like the trolley problem test which principle we actually hold.'
      ],
      myths: [
        'Deontology judges every act purely by how much happiness it produces.',
        'Ethics and law are the same thing, so anything legal is moral.',
        'Moral relativism is simply the claim that people sometimes disagree.',
        'Virtue ethics is a set of rules for calculating outcomes.'
      ]
    },
    {
      name: 'Knowledge and Reality', from: 'Grade 10', to: 'College',
      facts: [
        ['epistemology', 'the study of knowledge and justified belief'],
        ['metaphysics', 'the study of what fundamentally exists'],
        ['empiricism', 'the view that knowledge comes from experience'],
        ['rationalism', 'the view that reason is the main source of knowledge'],
        ['scepticism', 'the position of doubting whether knowledge is possible'],
        ['a priori', 'knowable independently of experience'],
        ['a posteriori', 'knowable only through experience'],
        ['justified true belief', 'the traditional analysis of knowledge'],
        ['Descartes', 'the philosopher of methodical doubt and “I think, therefore I am”'],
        ['Hume', 'the empiricist who questioned our justification for induction'],
        ['Plato’s cave', 'the allegory contrasting appearance and reality'],
        ['dualism', 'the view that mind and body are distinct kinds of thing'],
        ['materialism', 'the view that everything that exists is physical'],
        ['free will', 'the question of whether our choices are genuinely up to us']
      ],
      truths: [
        'Empiricists hold that experience is the ultimate source of knowledge.',
        'Descartes used doubt as a method, not as a final position.',
        'A priori knowledge is knowable without observation, such as mathematics.',
        'Scepticism challenges our justification for beliefs, not merely their truth.'
      ],
      myths: [
        'Rationalists deny that experience exists at all.',
        'Descartes concluded that nothing whatsoever can be known.',
        'A priori and a posteriori mean before and after in time.',
        'Metaphysics and epistemology are two names for the same study.'
      ]
    },
    {
      name: 'Political Philosophy', from: 'Grade 10', to: 'College',
      facts: [
        ['social contract', 'the idea that authority rests on agreement among the governed'],
        ['Thomas Hobbes', 'the philosopher who argued for a strong sovereign to escape chaos'],
        ['John Locke', 'the philosopher of natural rights and government by consent'],
        ['Rousseau', 'the philosopher of the general will'],
        ['liberty', 'freedom from interference or the capacity to act'],
        ['equality', 'the principle that people should be treated as of equal worth'],
        ['justice', 'the principle governing the fair distribution of goods'],
        ['John Rawls', 'the philosopher of the veil of ignorance'],
        ['veil of ignorance', 'the thought experiment for choosing fair principles'],
        ['authority', 'the right to be obeyed, as opposed to mere power'],
        ['legitimacy', 'the quality that makes a government’s authority rightful'],
        ['civil disobedience', 'the deliberate open breaking of a law thought unjust'],
        ['natural rights', 'rights held independently of any government'],
        ['common good', 'the shared benefit of a whole community']
      ],
      truths: [
        'Hobbes and Locke both used a social contract but reached different conclusions.',
        'Rawls asks what principles we would choose without knowing our own position.',
        'Legitimacy concerns whether power is rightful, not whether it is effective.',
        'Civil disobedience is open and accepts the legal penalty.'
      ],
      myths: [
        'Hobbes and Locke reached the same conclusions about government.',
        'Authority and power mean exactly the same thing.',
        'Rawls argued that people should choose principles knowing their own wealth.',
        'Civil disobedience means secretly evading laws you dislike.'
      ]
    }
  ],

  /* ============================ WORLD RELIGIONS ============================ */
  religions: [
    {
      name: 'Christianity', from: 'Grade 5', to: 'College',
      facts: [
        ['Bible', 'the Christian scriptures, in two testaments'],
        ['Gospel', 'one of the four accounts of the life of Jesus'],
        ['Trinity', 'the doctrine of God as Father, Son and Holy Spirit'],
        ['Easter', 'the festival of the resurrection'],
        ['Christmas', 'the festival of the birth of Jesus'],
        ['baptism', 'the rite of initiation using water'],
        ['Eucharist', 'the sharing of bread and wine in memory of the last supper'],
        ['church', 'the building and the community of Christians'],
        ['Reformation', 'the 16th-century split producing Protestant churches'],
        ['Catholicism', 'the tradition led by the Pope in Rome'],
        ['Orthodoxy', 'the eastern tradition led by patriarchs'],
        ['Lent', 'the forty-day period of preparation before Easter'],
        ['parable', 'a short story used by Jesus to teach a lesson'],
        ['Pentecost', 'the festival marking the coming of the Holy Spirit']
      ],
      truths: [
        'Christianity is the largest religion in the world by number of adherents.',
        'The Reformation divided western Christianity into Catholic and Protestant traditions.',
        'The Bible’s Old Testament overlaps substantially with the Hebrew scriptures.',
        'Easter is the central festival of the Christian year.'
      ],
      myths: [
        'All Christians belong to a single church with one leader.',
        'Christmas is the most theologically important Christian festival.',
        'The Bible was written in English originally.',
        'The Reformation happened in the eleventh century.'
      ]
    },
    {
      name: 'Islam', from: 'Grade 5', to: 'College',
      facts: [
        ['Qur’an', 'the Islamic scripture, believed revealed to Muhammad'],
        ['Muhammad', 'the prophet through whom Muslims believe the Qur’an was revealed'],
        ['Five Pillars', 'the five core practices of Islam'],
        ['Shahadah', 'the declaration of faith'],
        ['Salah', 'the five daily prayers'],
        ['Zakat', 'the obligatory giving of a share of wealth'],
        ['Sawm', 'the fast during the month of Ramadan'],
        ['Hajj', 'the pilgrimage to Mecca'],
        ['mosque', 'the Muslim place of communal prayer'],
        ['Mecca', 'the city towards which Muslims pray'],
        ['Eid al-Fitr', 'the festival marking the end of Ramadan'],
        ['imam', 'the person who leads prayer in a mosque'],
        ['Sunni', 'the largest branch of Islam'],
        ['Shia', 'the branch that traces leadership through Ali']
      ],
      truths: [
        'Muslims regard Muhammad as the final prophet, not as divine.',
        'The Five Pillars are Shahadah, Salah, Zakat, Sawm and Hajj.',
        'Ramadan is a lunar month, so it moves through the seasons each year.',
        'Hajj is required once in a lifetime of those able to make it.'
      ],
      myths: [
        'Muslims worship Muhammad as a god.',
        'Ramadan falls on the same calendar dates every year.',
        'Every Muslim must perform Hajj every year.',
        'Islam has only one branch with no internal traditions.'
      ]
    },
    {
      name: 'Judaism', from: 'Grade 5', to: 'College',
      facts: [
        ['Torah', 'the first five books of the Hebrew scriptures'],
        ['Tanakh', 'the complete Hebrew Bible'],
        ['synagogue', 'the Jewish place of worship and study'],
        ['rabbi', 'a teacher and leader of a Jewish community'],
        ['Shabbat', 'the weekly day of rest from Friday evening'],
        ['kosher', 'food prepared according to Jewish dietary law'],
        ['Passover', 'the festival remembering the exodus from Egypt'],
        ['Yom Kippur', 'the day of atonement, the most solemn day of the year'],
        ['Rosh Hashanah', 'the Jewish new year'],
        ['bar mitzvah', 'the coming-of-age ceremony for a boy'],
        ['bat mitzvah', 'the coming-of-age ceremony for a girl'],
        ['Hanukkah', 'the winter festival of lights'],
        ['covenant', 'the binding agreement between God and the Jewish people'],
        ['Ten Commandments', 'the laws given at Sinai according to the Torah']
      ],
      truths: [
        'Shabbat begins at sunset on Friday and ends at nightfall on Saturday.',
        'Yom Kippur, not Hanukkah, is the most solemn day of the Jewish year.',
        'Passover commemorates the exodus from slavery in Egypt.',
        'The Torah is the first five books of the Tanakh.'
      ],
      myths: [
        'Hanukkah is the most important festival in Judaism.',
        'Shabbat begins on Saturday morning.',
        'The Torah and the Tanakh are exactly the same set of books.',
        'Passover marks the Jewish new year.'
      ]
    },
    {
      name: 'Hinduism and Buddhism', from: 'Grade 6', to: 'College',
      facts: [
        ['dharma', 'duty, or the right way of living'],
        ['karma', 'the principle that actions have consequences'],
        ['samsara', 'the cycle of birth, death and rebirth'],
        ['moksha', 'liberation from the cycle of rebirth in Hinduism'],
        ['Vedas', 'the oldest Hindu scriptures'],
        ['Brahman', 'the ultimate reality in Hindu thought'],
        ['Diwali', 'the festival of lights'],
        ['Siddhartha Gautama', 'the prince who became the Buddha'],
        ['Four Noble Truths', 'the Buddhist analysis of suffering and its end'],
        ['Eightfold Path', 'the Buddhist path of practice'],
        ['nirvana', 'the release from suffering and rebirth in Buddhism'],
        ['meditation', 'the disciplined training of attention'],
        ['sangha', 'the Buddhist community of practitioners'],
        ['Bodhi tree', 'the tree under which the Buddha attained enlightenment']
      ],
      truths: [
        'Buddhism developed in a Hindu context and shares the ideas of karma and rebirth.',
        'The Buddha was a historical man who taught in northern India.',
        'The Four Noble Truths concern suffering, its cause, its ending and the path.',
        'Diwali is celebrated by Hindus, Sikhs and Jains, with different meanings.'
      ],
      myths: [
        'Buddhism and Hinduism are the same religion under two names.',
        'The Buddha is worshipped as the creator god of the universe.',
        'Nirvana and moksha are terms from the same single scripture.',
        'Karma means fate that cannot be affected by choice.'
      ]
    },
    {
      name: 'Sikhism and Other Traditions', from: 'Grade 6', to: 'College',
      facts: [
        ['Guru Nanak', 'the founder of Sikhism'],
        ['Guru Granth Sahib', 'the Sikh scripture, treated as the living Guru'],
        ['gurdwara', 'the Sikh place of worship'],
        ['langar', 'the free communal kitchen open to all'],
        ['Khalsa', 'the community of initiated Sikhs'],
        ['Five Ks', 'the five articles of faith worn by initiated Sikhs'],
        ['Vaisakhi', 'the festival marking the founding of the Khalsa'],
        ['sewa', 'selfless service to others'],
        ['Jainism', 'the tradition centred on non-violence to all living things'],
        ['ahimsa', 'the principle of non-violence'],
        ['Shinto', 'the indigenous tradition of Japan, centred on kami'],
        ['Taoism', 'the Chinese tradition of living in accordance with the Tao'],
        ['Confucianism', 'the Chinese tradition emphasising duty, ritual and family'],
        ['secular', 'not connected with religious belief']
      ],
      truths: [
        'The langar serves free food to anyone, regardless of background.',
        'The Guru Granth Sahib is treated as a living Guru rather than a book alone.',
        'Ahimsa is central to Jainism and important in Hinduism and Buddhism too.',
        'Sikhism began in the Punjab in the fifteenth century.'
      ],
      myths: [
        'Sikhism is a branch of Hinduism with a different name.',
        'The langar is open only to initiated Sikhs.',
        'Sikhism was founded in the twentieth century.',
        'Shinto and Taoism are the same tradition.'
      ]
    }
  ],

  /* ============================== PSYCHOLOGY ============================== */
  psychology: [
    {
      name: 'Memory', from: 'Grade 9', to: 'College',
      facts: [
        ['sensory memory', 'the very brief store holding raw sensory input'],
        ['short-term memory', 'the limited store holding information for seconds'],
        ['long-term memory', 'the store holding information indefinitely'],
        ['encoding', 'the process of converting information for storage'],
        ['retrieval', 'the process of getting information back out'],
        ['rehearsal', 'repetition that moves material into long-term memory'],
        ['chunking', 'grouping items to get more into short-term memory'],
        ['interference', 'the disruption of one memory by another'],
        ['retrieval cue', 'a prompt that helps recall stored information'],
        ['episodic memory', 'memory for personally experienced events'],
        ['semantic memory', 'memory for facts and meanings'],
        ['procedural memory', 'memory for how to perform skills'],
        ['working memory', 'the system that holds and manipulates information in use'],
        ['spacing effect', 'the finding that spread-out study beats massed study']
      ],
      truths: [
        'Short-term memory holds roughly seven items unless they are chunked.',
        'Spaced practice produces better long-term retention than cramming.',
        'Memory is reconstructive, so recall can be confidently wrong.',
        'Testing yourself is a stronger study method than rereading.'
      ],
      myths: [
        'Memory works like a video recording that plays back exactly.',
        'Cramming the night before produces the best long-term retention.',
        'Short-term memory has unlimited capacity.',
        'Confidence in a memory is a reliable guide to its accuracy.'
      ]
    },
    {
      name: 'Learning and Conditioning', from: 'Grade 9', to: 'College',
      facts: [
        ['classical conditioning', 'learning by association between two stimuli'],
        ['operant conditioning', 'learning shaped by consequences'],
        ['reinforcement', 'a consequence that makes a behaviour more likely'],
        ['punishment', 'a consequence that makes a behaviour less likely'],
        ['positive reinforcement', 'adding something desirable after a behaviour'],
        ['negative reinforcement', 'removing something unpleasant after a behaviour'],
        ['extinction', 'the fading of a learned response when it is no longer reinforced'],
        ['Pavlov', 'the researcher whose dogs demonstrated classical conditioning'],
        ['Skinner', 'the researcher who studied behaviour shaped by consequences'],
        ['social learning', 'learning by observing and imitating others'],
        ['Bandura', 'the researcher behind the Bobo doll observational learning studies'],
        ['schedule of reinforcement', 'the pattern determining when a behaviour is rewarded'],
        ['shaping', 'reinforcing successive approximations of a target behaviour'],
        ['generalisation', 'responding to stimuli similar to the conditioned one']
      ],
      truths: [
        'Negative reinforcement increases a behaviour; it is not punishment.',
        'Intermittent reinforcement makes behaviour harder to extinguish.',
        'Bandura showed children imitate behaviour they merely observe.',
        'Classical conditioning links stimuli; operant conditioning links behaviour to consequences.'
      ],
      myths: [
        'Negative reinforcement is another term for punishment.',
        'A behaviour rewarded every single time is the hardest to extinguish.',
        'Learning only happens through direct personal reward.',
        'Pavlov studied behaviour shaped by rewards and punishments.'
      ]
    },
    {
      name: 'Research Methods in Psychology', from: 'Grade 10', to: 'College',
      facts: [
        ['hypothesis', 'a testable prediction stated before data are collected'],
        ['independent variable', 'the variable the researcher changes'],
        ['dependent variable', 'the variable that is measured'],
        ['control group', 'the group not receiving the treatment'],
        ['random allocation', 'assigning participants to conditions by chance'],
        ['confounding variable', 'an uncontrolled factor that could explain the result'],
        ['correlation', 'a relationship in which two variables change together'],
        ['causation', 'a relationship in which one variable produces a change in another'],
        ['sample', 'the participants actually studied'],
        ['population', 'the wider group the sample is meant to represent'],
        ['double-blind', 'a design where neither participant nor researcher knows the condition'],
        ['placebo', 'an inactive treatment used for comparison'],
        ['informed consent', 'agreement to take part given with full knowledge'],
        ['replication', 'repeating a study to see whether the result holds']
      ],
      truths: [
        'A correlation does not on its own establish that one variable causes the other.',
        'Random allocation is what allows an experiment to support causal claims.',
        'A double-blind design controls for expectation on both sides.',
        'A result that cannot be replicated should not be treated as established.'
      ],
      myths: [
        'A strong correlation proves that one variable causes the other.',
        'A large sample removes the need for a control group.',
        'The independent variable is the one that is measured.',
        'A single striking study is enough to establish a finding.'
      ]
    },
    {
      name: 'Development and the Brain', from: 'Grade 10', to: 'College',
      facts: [
        ['neuron', 'the cell that transmits signals in the nervous system'],
        ['synapse', 'the junction where neurons communicate chemically'],
        ['neuroplasticity', 'the brain’s capacity to reorganise itself'],
        ['cerebral cortex', 'the folded outer layer responsible for higher functions'],
        ['frontal lobe', 'the region involved in planning and self-control'],
        ['hippocampus', 'the structure central to forming new memories'],
        ['amygdala', 'the structure involved in emotional responses such as fear'],
        ['attachment', 'the emotional bond between an infant and caregiver'],
        ['Piaget', 'the researcher who described stages of cognitive development'],
        ['object permanence', 'knowing an object still exists when out of sight'],
        ['critical period', 'a window in which certain learning happens most readily'],
        ['nature and nurture', 'the interaction of inheritance and environment'],
        ['adolescence', 'the developmental period of major brain reorganisation'],
        ['fMRI', 'the scanning method showing which brain regions are active']
      ],
      truths: [
        'The frontal lobe continues developing well into the twenties.',
        'The brain remains plastic throughout life, not only in childhood.',
        'Nature and nurture interact rather than competing as separate causes.',
        'The hippocampus is essential for forming new long-term memories.'
      ],
      myths: [
        'People use only ten per cent of their brains.',
        'Brain development is finished by the age of twelve.',
        'People are either purely left-brained or right-brained thinkers.',
        'Behaviour is determined entirely by genes or entirely by upbringing.'
      ]
    },
    {
      name: 'Social Psychology', from: 'Grade 10', to: 'College',
      facts: [
        ['conformity', 'changing behaviour to match a group'],
        ['obedience', 'following the instruction of an authority figure'],
        ['Asch', 'the researcher whose line studies demonstrated conformity'],
        ['Milgram', 'the researcher whose studies examined obedience to authority'],
        ['bystander effect', 'the reduced likelihood of helping when others are present'],
        ['diffusion of responsibility', 'the sense that someone else will act'],
        ['in-group', 'the group a person identifies with'],
        ['out-group', 'a group a person does not identify with'],
        ['prejudice', 'a negative attitude held towards a group'],
        ['discrimination', 'unfair treatment based on group membership'],
        ['stereotype', 'a fixed generalised belief about a group'],
        ['groupthink', 'poor decision-making caused by pressure for agreement'],
        ['social norm', 'an unwritten rule about expected behaviour'],
        ['attribution', 'the explanation a person gives for behaviour']
      ],
      truths: [
        'Conformity rises when a group is unanimous and falls when one person dissents.',
        'The bystander effect is explained partly by diffusion of responsibility.',
        'Prejudice is an attitude; discrimination is the behaviour.',
        'Ordinary people can act against their own values under authority pressure.'
      ],
      myths: [
        'Conformity is unaffected by whether the group is unanimous.',
        'Prejudice and discrimination are the same thing.',
        'People always help in an emergency if enough witnesses are present.',
        'Only unusual or cruel people obey harmful instructions.'
      ]
    }
  ],

  /* =============================== SOCIOLOGY =============================== */
  sociology: [
    {
      name: 'Socialisation and Culture', from: 'Grade 9', to: 'College',
      facts: [
        ['socialisation', 'the process of learning the norms of a society'],
        ['primary socialisation', 'early learning of norms within the family'],
        ['secondary socialisation', 'later learning through school, work and media'],
        ['norm', 'a shared expectation about how to behave'],
        ['value', 'a shared belief about what matters'],
        ['culture', 'the shared way of life of a group'],
        ['subculture', 'a group with values that differ from the mainstream'],
        ['role', 'the behaviour expected of someone in a position'],
        ['status', 'the social position a person occupies'],
        ['agent of socialisation', 'an institution that transmits norms, such as school'],
        ['cultural diversity', 'the range of cultures within a society'],
        ['ethnocentrism', 'judging another culture by the standards of your own'],
        ['identity', 'the sense of who a person is, shaped socially'],
        ['sanction', 'a reward or penalty that enforces a norm']
      ],
      truths: [
        'Norms vary between societies and change over time.',
        'The family is usually the agent of primary socialisation.',
        'Roles come with expectations that may conflict with one another.',
        'Ethnocentrism distorts comparison by treating one culture as the standard.'
      ],
      myths: [
        'Norms are fixed and identical in every society.',
        'Socialisation is finished by the end of childhood.',
        'Culture means only art, music and literature.',
        'Status and role mean exactly the same thing.'
      ]
    },
    {
      name: 'Family and Households', from: 'Grade 9', to: 'College',
      facts: [
        ['nuclear family', 'a household of two parents and their children'],
        ['extended family', 'a household including relatives beyond the nuclear core'],
        ['reconstituted family', 'a family formed when partners bring children from earlier relationships'],
        ['lone-parent family', 'a household with one parent and dependent children'],
        ['household', 'everyone living together at one address'],
        ['kinship', 'the network of relations by blood or marriage'],
        ['cohabitation', 'living together as partners without marriage'],
        ['domestic division of labour', 'the way household tasks are shared'],
        ['dual-earner household', 'a household in which both partners work for pay'],
        ['symmetrical family', 'a family in which roles are shared more equally'],
        ['life course', 'the sequence of stages a person passes through'],
        ['ageing population', 'a society with a growing proportion of older people'],
        ['childhood', 'a stage of life shaped by social expectations, not only biology'],
        ['divorce rate', 'the number of divorces relative to the married population']
      ],
      truths: [
        'Family structures vary widely across societies and over time.',
        'A household is not the same as a family.',
        'Childhood is socially constructed as well as biologically defined.',
        'Rising divorce rates reflect legal and social change as well as relationship breakdown.'
      ],
      myths: [
        'The nuclear family is the only structure that has ever been common.',
        'Household and family mean exactly the same thing.',
        'Childhood has always been understood the same way in every society.',
        'Cohabitation and marriage carry identical legal status everywhere.'
      ]
    },
    {
      name: 'Education and Social Class', from: 'Grade 10', to: 'College',
      facts: [
        ['social class', 'a grouping based on economic position and life chances'],
        ['life chances', 'the opportunities a person has for health, wealth and education'],
        ['meritocracy', 'a system where position depends on ability and effort'],
        ['cultural capital', 'the knowledge and habits that advantage some students'],
        ['hidden curriculum', 'the values learned at school outside formal lessons'],
        ['streaming', 'grouping students by measured ability'],
        ['labelling', 'the effect of teachers’ expectations on student outcomes'],
        ['self-fulfilling prophecy', 'when an expectation helps bring about its own outcome'],
        ['social mobility', 'movement between social positions across a life or generations'],
        ['attainment gap', 'the difference in results between social groups'],
        ['compensatory education', 'extra provision aimed at reducing disadvantage'],
        ['material deprivation', 'lack of the physical resources needed to succeed'],
        ['marketisation', 'the introduction of competition between schools'],
        ['correspondence principle', 'the claim that schooling mirrors the workplace']
      ],
      truths: [
        'Attainment gaps between social groups appear before school begins.',
        'Cultural capital advantages students whose home matches school expectations.',
        'Labelling can become a self-fulfilling prophecy.',
        'Social mobility is lower than the idea of pure meritocracy would predict.'
      ],
      myths: [
        'Educational outcomes depend on individual effort alone.',
        'The hidden curriculum is the part of the syllabus not yet taught.',
        'Attainment gaps first appear during secondary school.',
        'Meritocracy is an accurate description of every modern education system.'
      ]
    },
    {
      name: 'Crime and Deviance', from: 'Grade 10', to: 'College',
      facts: [
        ['crime', 'behaviour that breaks the criminal law'],
        ['deviance', 'behaviour that breaks a social norm'],
        ['social control', 'the mechanisms that keep behaviour within norms'],
        ['formal social control', 'control through law, police and courts'],
        ['informal social control', 'control through disapproval and expectation'],
        ['dark figure of crime', 'the crime that is never reported or recorded'],
        ['victim survey', 'a survey asking the public about crimes they experienced'],
        ['recidivism', 'reoffending after a conviction'],
        ['white-collar crime', 'crime committed in the course of professional work'],
        ['moral panic', 'exaggerated public alarm about a supposed threat'],
        ['stigma', 'a mark of social disgrace attached to a person'],
        ['restorative justice', 'an approach bringing offenders and victims together'],
        ['deterrence', 'the aim of preventing crime through fear of punishment'],
        ['rehabilitation', 'the aim of changing an offender’s future behaviour']
      ],
      truths: [
        'Not all deviance is criminal and not all crime is seen as deviant.',
        'Official statistics understate crime because much is never reported.',
        'Media coverage can amplify a moral panic out of proportion to the risk.',
        'Restorative justice focuses on repairing harm rather than punishment alone.'
      ],
      myths: [
        'Crime and deviance mean exactly the same thing.',
        'Official crime statistics record every offence that occurs.',
        'Harsher punishment reliably eliminates reoffending.',
        'White-collar crime causes negligible harm compared with street crime.'
      ]
    }
  ]
};
