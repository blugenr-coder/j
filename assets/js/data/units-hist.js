/* History, geography and civics at scheme-of-work depth.

   Two rules govern the history banks. Periods are described in terms a course
   actually assesses — causes, consequences, sources, significance — rather than
   as a list of dates, because "when did it happen" is the least of what a
   history exam asks. And where a period is genuinely contested, the myth bank
   holds the popular misconception rather than an invented wrong answer: people
   really do believe medieval Europeans thought the Earth was flat, and the
   worksheet is more useful for saying so. */

export const HIST_UNITS = {
  history: [
    {
      name: 'Historical Skills: Sources and Interpretation', from: 'Grade 6', to: 'College',
      facts: [
        ['a primary source', 'a source created at the time by someone present'],
        ['a secondary source', 'an account written later, using primary sources'],
        ['provenance', 'who made a source, when, and why'],
        ['reliability', 'how far a source can be trusted for a given question'],
        ['utility', 'how useful a source is for a particular enquiry'],
        ['bias', 'a source’s slant, arising from its author’s position'],
        ['an interpretation', 'a historian’s considered view of the past'],
        ['corroboration', 'checking one source against another'],
        ['a contemporary account', 'a description written at the time'],
        ['hindsight', 'knowledge of what happened afterwards, which the participants lacked'],
        ['causation', 'the explanation of why something happened'],
        ['consequence', 'what followed from an event'],
        ['significance', 'why an event mattered, and to whom'],
        ['continuity', 'what stayed the same across a period'],
        ['change', 'what was different by the end of a period'],
        ['chronology', 'the order in which things happened'],
        ['an anachronism', 'something placed in the wrong period'],
        ['a source’s audience', 'who a source was made for, which shapes what it says'],
        ['omission', 'what a source leaves out'],
        ['a turning point', 'a moment after which things were substantially different']
      ],
      truths: [
        'A biased source can still be useful — it is reliable evidence of its author’s views.',
        'Provenance is who made a source, when, and why, and it shapes everything else.',
        'A primary source is not automatically more reliable than a secondary one.',
        'What a source leaves out can matter as much as what it says.',
        'Historians disagree because they weigh the same evidence differently, not because one is lying.',
        'Utility depends on the question being asked: a source can be useless for one and vital for another.'
      ],
      myths: [
        'A primary source is always more reliable than a secondary source.',
        'A biased source is worthless.',
        'Historians disagree because some of them have not read the evidence.',
        'A source written at the time must be accurate.',
        'Reliability is a fixed property of a source, whatever the question.',
        'If two sources agree, the fact is established.'
      ],
      applications: [
        ['A diary written by a soldier during the battle. What kind of source is this?', 'a primary source'],
        ['A propaganda poster is useless for facts but revealing about attitudes. Which quality is this?', 'utility'],
        ['Two independent accounts describe the same detail. What has been achieved?', 'corroboration'],
        ['A textbook shows a Roman soldier with a wristwatch. What is the error?', 'an anachronism'],
        ['Knowing how a war ended changes how its start is judged. What is this problem?', 'hindsight']
      ]
    },
    {
      name: 'Medieval Europe: Society and Power', from: 'Grade 7', to: 'Grade 12',
      facts: [
        ['feudalism', 'the system in which land was held in return for service'],
        ['a lord', 'a landholder who granted land in return for loyalty'],
        ['a vassal', 'someone who held land from a lord in return for service'],
        ['a serf', 'a peasant bound to the land they worked'],
        ['a manor', 'the estate at the centre of village life'],
        ['a knight', 'a mounted warrior holding land for military service'],
        ['chivalry', 'the code of conduct expected of a knight'],
        ['a monastery', 'a religious community and a centre of learning'],
        ['a cathedral', 'the principal church of a diocese'],
        ['the Church', 'the institution that shaped medieval law, learning and daily life'],
        ['tithes', 'the tenth of produce owed to the Church'],
        ['the Magna Carta', 'the 1215 charter limiting the English king’s power'],
        ['a guild', 'an association controlling a craft and its training'],
        ['an apprentice', 'someone learning a trade under a master'],
        ['the Black Death', 'the plague that killed a large share of Europe’s population'],
        ['the Peasants’ Revolt', 'the 1381 rising against taxation and labour restrictions'],
        ['a castle', 'a fortified residence controlling territory'],
        ['a keep', 'the strongest tower of a castle'],
        ['a siege', 'a prolonged attempt to take a fortified place'],
        ['a monarch', 'a king or queen ruling a kingdom']
      ],
      truths: [
        'Feudalism organised society around land held in return for service.',
        'The Black Death killed so many people that the survivors could demand higher wages.',
        'Magna Carta limited the king’s power rather than granting rights to ordinary people.',
        'Educated medieval Europeans knew the Earth was round.',
        'Monasteries preserved and copied texts, making them centres of learning.',
        'A guild controlled who could practise a trade and how they were trained.'
      ],
      myths: [
        'Medieval people believed the Earth was flat.',
        'Magna Carta gave rights and freedoms to ordinary peasants.',
        'The Black Death had no lasting effect on how much workers were paid.',
        'Knights fought mainly for glory rather than for land and obligation.',
        'Nobody could read or write in the Middle Ages.',
        'Castles were built for comfort rather than control.'
      ],
      applications: [
        ['A peasant is bound to the land and cannot leave without permission. What are they?', 'a serf'],
        ['Barons force a king to accept limits on his power in 1215. What is signed?', 'the Magna Carta'],
        ['A shortage of workers after 1348 pushes wages up. What caused the shortage?', 'the Black Death'],
        ['A craftsman must train for years under a master before working alone. What controls this?', 'a guild'],
        ['An army surrounds a castle and waits rather than attacking. What is this?', 'a siege']
      ]
    },
    {
      name: 'The Industrial Revolution', from: 'Grade 7', to: 'College',
      facts: [
        ['industrialisation', 'the shift from making goods by hand to making them in factories'],
        ['the factory system', 'production concentrated in one building with powered machinery'],
        ['the steam engine', 'the machine that freed factories from waterwheels'],
        ['the spinning jenny', 'the machine that let one worker spin many threads'],
        ['urbanisation', 'the movement of people from countryside to towns'],
        ['a slum', 'overcrowded housing with poor sanitation'],
        ['cholera', 'the water-borne disease that swept industrial cities'],
        ['sanitation', 'the removal of waste and provision of clean water'],
        ['child labour', 'the employment of children in factories and mines'],
        ['the Factory Acts', 'the laws that limited hours and ages of work'],
        ['a trade union', 'an organisation of workers bargaining together'],
        ['the canal network', 'the waterways that moved bulk goods before railways'],
        ['the railway', 'the transport that reshaped trade, time and travel'],
        ['coal', 'the fuel that powered the steam age'],
        ['iron', 'the material of machines, rails and bridges'],
        ['a mill', 'a factory for spinning or weaving'],
        ['the enclosure of land', 'the fencing of common land, which pushed people off the countryside'],
        ['laissez-faire', 'the belief that government should not interfere in the economy'],
        ['a reformer', 'someone campaigning to change conditions'],
        ['standard time', 'the single national time the railways made necessary']
      ],
      truths: [
        'Railways forced Britain to adopt a single standard time.',
        'Industrial cities grew faster than their sanitation, which is why cholera spread.',
        'The Factory Acts limited hours and ages of work in stages, not all at once.',
        'Enclosure pushed people off the land before the factories drew them in.',
        'Trade unions were treated as a threat and were restricted by law for decades.',
        'Steam power let factories be built where the coal and the workers were, not just beside rivers.'
      ],
      myths: [
        'The Industrial Revolution happened in a single decade.',
        'Everyone’s standard of living rose immediately.',
        'Cholera was caused by bad air rather than contaminated water.',
        'Child labour was banned as soon as factories opened.',
        'Steam engines replaced water power overnight.',
        'Trade unions were legal and accepted from the start.'
      ],
      sequences: [
        ['From countryside to factory town', [
          'Common land is enclosed and small farmers lose their living',
          'Families move to towns looking for work',
          'Factories powered by steam concentrate work in one place',
          'Towns grow faster than their water supply and drainage',
          'Disease outbreaks force the first public health laws'
        ]]
      ],
      applications: [
        ['A city’s water supply is contaminated and a disease sweeps through. Which disease?', 'cholera'],
        ['A factory can be built away from a river because of one invention. Which?', 'the steam engine'],
        ['Workers organise to bargain together for better pay. What have they formed?', 'a trade union'],
        ['Timetables force every town to keep the same clock. What was adopted?', 'standard time'],
        ['A law limits the hours a child may work in a mill. What kind of law is it?', 'the Factory Acts']
      ]
    },
    {
      name: 'The Twentieth Century: Conflict and Change', from: 'Grade 8', to: 'College',
      facts: [
        ['the First World War', 'the 1914–18 conflict fought largely in trenches'],
        ['trench warfare', 'fighting from fixed defensive lines'],
        ['the Treaty of Versailles', 'the 1919 settlement imposing terms on Germany'],
        ['reparations', 'payments demanded from a defeated country'],
        ['the Great Depression', 'the global economic collapse beginning in 1929'],
        ['fascism', 'an authoritarian, nationalist ideology hostile to democracy'],
        ['appeasement', 'the policy of conceding to an aggressor to avoid war'],
        ['the Second World War', 'the 1939–45 global conflict'],
        ['the Holocaust', 'the systematic murder of six million Jewish people by the Nazi state'],
        ['the Cold War', 'the post-1945 confrontation between the United States and the Soviet Union'],
        ['the Iron Curtain', 'the divide between eastern and western Europe'],
        ['the Marshall Plan', 'American economic aid to rebuild western Europe'],
        ['decolonisation', 'the process by which colonies became independent states'],
        ['the United Nations', 'the organisation founded in 1945 to prevent war'],
        ['the civil rights movement', 'the campaign against racial segregation and for voting rights'],
        ['the Berlin Wall', 'the barrier dividing the city from 1961 to 1989'],
        ['the arms race', 'the competitive build-up of nuclear weapons'],
        ['propaganda', 'information shaped to promote a political cause'],
        ['total war', 'a conflict mobilising a country’s whole population and economy'],
        ['a superpower', 'a state with worldwide military and economic reach']
      ],
      truths: [
        'The Treaty of Versailles imposed reparations that shaped German politics for a generation.',
        'Appeasement was a deliberate policy, chosen by governments that remembered 1914.',
        'The Cold War was fought through proxy conflicts rather than direct war between the superpowers.',
        'The First World War was not confined to Europe.',
        'Decolonisation reshaped the map of the world within about thirty years.',
        'Total war meant civilian populations and economies were part of the conflict.'
      ],
      myths: [
        'The First World War was fought only in Europe.',
        'The Second World War began the moment the Treaty of Versailles was signed.',
        'The Cold War involved direct fighting between American and Soviet armies.',
        'Appeasement was simply cowardice with no reasoning behind it.',
        'The United Nations replaced the League of Nations without any change of design.',
        'Decolonisation was a peaceful process everywhere.'
      ],
      applications: [
        ['A 1919 treaty demands payments from Germany. What are the payments called?', 'reparations'],
        ['Britain and France concede to Hitler’s demands to avoid war. What policy is this?', 'appeasement'],
        ['Two superpowers build nuclear weapons without fighting directly. What is this called?', 'the arms race'],
        ['A wall divides a city for twenty-eight years. Which wall?', 'the Berlin Wall'],
        ['Colonies across Africa and Asia become independent states. What is the process?', 'decolonisation']
      ]
    },
    {
      name: 'Ancient Civilisations', from: 'Grade 5', to: 'Grade 10',
      facts: [
        ['Mesopotamia', 'the land between the Tigris and Euphrates, where cities first grew'],
        ['cuneiform', 'the wedge-shaped writing of Mesopotamia'],
        ['a ziggurat', 'the stepped temple tower of a Mesopotamian city'],
        ['hieroglyphs', 'the picture writing of ancient Egypt'],
        ['a pharaoh', 'the ruler of ancient Egypt'],
        ['mummification', 'the Egyptian preservation of a body for the afterlife'],
        ['the Nile', 'the river whose flood made Egyptian farming possible'],
        ['irrigation', 'the channelling of water to farmland'],
        ['a city-state', 'an independent city with its own government'],
        ['democracy', 'rule by the citizens, first practised in Athens'],
        ['a philosopher', 'a thinker asking questions about knowledge and how to live'],
        ['the Roman Republic', 'the period when Rome was governed by elected officials'],
        ['the Roman Empire', 'the period when Rome was ruled by emperors'],
        ['an aqueduct', 'the structure carrying water into a Roman city'],
        ['a legion', 'the main unit of the Roman army'],
        ['the Colosseum', 'the amphitheatre at the centre of Roman public entertainment'],
        ['the Silk Road', 'the trade routes linking China with the Mediterranean'],
        ['the Indus Valley', 'the civilisation with planned cities and drainage'],
        ['an artefact', 'an object made by people, studied as evidence'],
        ['archaeology', 'the study of the past through physical remains']
      ],
      truths: [
        'Writing developed alongside cities, largely to keep records of goods.',
        'Athenian democracy excluded women, enslaved people and foreigners.',
        'The Nile’s annual flood deposited silt that made farming possible.',
        'Roman aqueducts moved water using a very slight, continuous fall.',
        'The Indus Valley cities had planned street grids and drainage.',
        'Archaeology reads objects as evidence, not just as treasure.'
      ],
      myths: [
        'Athenian democracy gave every adult a vote.',
        'The pyramids were built by enslaved people driven by whips.',
        'Ancient Egyptians wrote in an alphabet like ours.',
        'Roman aqueducts used pumps to move water uphill.',
        'The Roman Empire and the Roman Republic are two names for the same thing.',
        'Ancient civilisations had no contact with one another.'
      ],
      applications: [
        ['Wedge-shaped marks are pressed into clay tablets. What writing is this?', 'cuneiform'],
        ['A structure carries water gently downhill into a Roman city. What is it?', 'an aqueduct'],
        ['Athens governs itself with assemblies of citizens. What system is this?', 'democracy'],
        ['Trade goods move between China and the Mediterranean. Along what?', 'the Silk Road'],
        ['A river floods each year and leaves fertile silt. Which river?', 'the Nile']
      ]
    }
  ],

  geography: [
    {
      name: 'Tectonics, Earthquakes and Volcanoes', from: 'Grade 7', to: 'College',
      figures: ['earth-layers', 'volcano'],
      facts: [
        ['a tectonic plate', 'a large slab of the Earth’s crust and upper mantle'],
        ['a plate boundary', 'the place where two plates meet'],
        ['a constructive boundary', 'where plates move apart and new crust forms'],
        ['a destructive boundary', 'where an oceanic plate is forced under another'],
        ['a conservative boundary', 'where plates slide past each other'],
        ['subduction', 'the sinking of one plate beneath another'],
        ['the focus', 'the point underground where an earthquake starts'],
        ['the epicentre', 'the point on the surface directly above the focus'],
        ['a seismometer', 'the instrument that records ground movement'],
        ['the Richter scale', 'a logarithmic measure of earthquake magnitude'],
        ['magnitude', 'the energy released by an earthquake'],
        ['a tsunami', 'a wave generated by displacement of the sea floor'],
        ['magma', 'molten rock below the surface'],
        ['lava', 'molten rock that has reached the surface'],
        ['a composite volcano', 'a steep volcano built of alternating ash and lava'],
        ['a shield volcano', 'a broad, gently sloping volcano built of runny lava'],
        ['a primary effect', 'damage caused directly by the event itself'],
        ['a secondary effect', 'damage that follows, such as fire or disease'],
        ['mitigation', 'reducing the impact before an event happens'],
        ['a hazard map', 'a map showing which areas are most at risk']
      ],
      truths: [
        'The epicentre is on the surface; the focus is underground.',
        'The Richter scale is logarithmic, so each step is about thirty times the energy.',
        'Magma is underground and lava is on the surface — the same rock, a different place.',
        'Shield volcanoes are broad and gentle because their lava is runny.',
        'A tsunami is caused by the sea floor moving, not by wind.',
        'Building design and preparation reduce deaths far more than predicting the event does.'
      ],
      myths: [
        'The focus of an earthquake is on the surface.',
        'Each step on the Richter scale means twice the energy.',
        'Magma and lava are two different substances.',
        'A tsunami is a very large wind-driven wave.',
        'Earthquakes can be predicted accurately days in advance.',
        'All volcanoes have the same steep cone shape.'
      ],
      applications: [
        ['An oceanic plate is forced beneath a continental one. What is this?', 'subduction'],
        ['A quake starts 20 km underground. What is that point called?', 'the focus'],
        ['Fires break out after an earthquake ruptures gas pipes. What kind of effect is this?', 'a secondary effect'],
        ['A volcano is broad and gently sloping. What kind is it?', 'a shield volcano'],
        ['Buildings are designed to sway rather than collapse. What is this?', 'mitigation']
      ]
    },
    {
      name: 'Rivers, Coasts and Erosion', from: 'Grade 6', to: 'College',
      figures: ['river'],
      facts: [
        ['erosion', 'the wearing away and removal of material'],
        ['transportation', 'the movement of eroded material'],
        ['deposition', 'the dropping of transported material'],
        ['weathering', 'the breakdown of rock in place, without movement'],
        ['a meander', 'a bend in a river’s course'],
        ['an oxbow lake', 'the cut-off loop left when a meander is bypassed'],
        ['a floodplain', 'the flat land beside a river that floods'],
        ['a delta', 'the deposited landform where a river meets still water'],
        ['a waterfall', 'the step where a river crosses from hard rock to soft'],
        ['a v-shaped valley', 'the valley cut by a river in its upper course'],
        ['longshore drift', 'the movement of material along a coast by angled waves'],
        ['a spit', 'the ridge of deposited material extending from a coast'],
        ['a headland', 'a resistant section of coast that juts out'],
        ['a bay', 'the sheltered indentation between headlands'],
        ['a stack', 'the pillar left when the arch of a headland collapses'],
        ['hydraulic action', 'erosion by the force of water alone'],
        ['abrasion', 'erosion by material carried in the water'],
        ['attrition', 'the wearing down of the carried material itself'],
        ['a groyne', 'a barrier built to slow longshore drift'],
        ['hard engineering', 'building structures to control a river or coast'],
        ['soft engineering', 'working with natural processes rather than against them']
      ],
      truths: [
        'Weathering breaks rock down in place; erosion carries it away.',
        'An oxbow lake forms when a meander’s neck is cut through.',
        'Longshore drift moves material along the coast, not out to sea.',
        'A groyne traps sediment on one side and starves the beach beyond it.',
        'Attrition wears down the load; abrasion wears down the bank or cliff.',
        'Soft engineering works with natural processes rather than resisting them.'
      ],
      myths: [
        'Weathering and erosion are the same process.',
        'A river erodes most in its lower course.',
        'Longshore drift carries material straight out to sea.',
        'A groyne protects the whole coastline equally.',
        'Deltas form wherever a river reaches the sea.',
        'Hard engineering is always the better solution.'
      ],
      applications: [
        ['A meander loop is cut off and left as a curved lake. What is it?', 'an oxbow lake'],
        ['Pebbles knock together and become rounder as they travel. What process is this?', 'attrition'],
        ['Waves approach at an angle and shift sand along the beach. What is this?', 'longshore drift'],
        ['An arch collapses, leaving a pillar of rock in the sea. What is it?', 'a stack'],
        ['Beach material is replaced by pumping in sand instead of building a wall. Which approach?', 'soft engineering']
      ]
    },
    {
      name: 'Population, Development and Cities', from: 'Grade 8', to: 'College',
      facts: [
        ['birth rate', 'births per thousand people per year'],
        ['death rate', 'deaths per thousand people per year'],
        ['natural increase', 'the birth rate minus the death rate'],
        ['migration', 'the movement of people to live somewhere else'],
        ['a push factor', 'something that drives people away from a place'],
        ['a pull factor', 'something that attracts people to a place'],
        ['population density', 'the number of people per square kilometre'],
        ['a population pyramid', 'the graph showing age and sex structure'],
        ['the demographic transition model', 'the model of how birth and death rates change as a country develops'],
        ['an ageing population', 'a population with a rising share of older people'],
        ['life expectancy', 'the average number of years a person is expected to live'],
        ['infant mortality', 'deaths under one year per thousand live births'],
        ['GNI per capita', 'national income divided by population'],
        ['the human development index', 'the combined measure of income, education and life expectancy'],
        ['urbanisation', 'the growing share of people living in towns and cities'],
        ['a megacity', 'a city of more than ten million people'],
        ['an informal settlement', 'housing built outside legal planning, often without services'],
        ['rural-urban migration', 'movement from the countryside into cities'],
        ['sustainability', 'meeting present needs without preventing future ones being met'],
        ['a development gap', 'the difference in living standards between countries']
      ],
      truths: [
        'Natural increase is births minus deaths, before migration is counted.',
        'GNI per capita is an average and hides how income is distributed.',
        'The human development index combines income with education and life expectancy.',
        'An ageing population changes the ratio of workers to dependants.',
        'Push and pull factors usually operate together in any migration.',
        'A country can have high average income and poor health outcomes.'
      ],
      myths: [
        'Population growth is caused only by high birth rates.',
        'GNI per capita tells you how well ordinary people live.',
        'Migration is always driven by a single cause.',
        'Every city with an informal settlement is poor overall.',
        'Development means only economic growth.',
        'An ageing population is purely a problem with no upside.'
      ],
      applications: [
        ['A country’s birth rate is 18 and its death rate is 8. What is 10?', 'natural increase'],
        ['War drives people out of a region. What kind of factor is that?', 'a push factor'],
        ['A measure combines income, schooling and life expectancy. What is it?', 'the human development index'],
        ['A city passes ten million residents. What is it now?', 'a megacity'],
        ['Housing is built without planning permission or piped water. What is it?', 'an informal settlement']
      ]
    }
  ],

  civics: [
    {
      name: 'Government, Elections and Rights', from: 'Grade 7', to: 'College',
      facts: [
        ['democracy', 'a system in which power comes from the people through elections'],
        ['a constitution', 'the set of rules establishing how a country is governed'],
        ['the separation of powers', 'the division of government into legislature, executive and judiciary'],
        ['the legislature', 'the branch that makes laws'],
        ['the executive', 'the branch that carries out laws'],
        ['the judiciary', 'the branch that interprets laws'],
        ['the rule of law', 'the principle that everyone, including government, is subject to the law'],
        ['a general election', 'the vote choosing a legislature'],
        ['a constituency', 'the area represented by one elected member'],
        ['first past the post', 'the system where the candidate with most votes wins the seat'],
        ['proportional representation', 'a system allocating seats in proportion to votes'],
        ['a referendum', 'a direct vote by the electorate on a single question'],
        ['a manifesto', 'a party’s published programme before an election'],
        ['a coalition', 'a government formed by more than one party'],
        ['an opposition', 'the parties not in government'],
        ['a civil right', 'a protection an individual holds against the state'],
        ['a civic duty', 'an obligation a citizen owes the community'],
        ['suffrage', 'the right to vote'],
        ['a pressure group', 'an organisation seeking to influence policy without seeking office'],
        ['local government', 'the tier of government responsible for local services'],
        ['a bill', 'a proposed law before it is passed'],
        ['an act', 'a bill that has become law']
      ],
      truths: [
        'The separation of powers keeps the three branches able to check one another.',
        'First past the post can give a party a majority of seats on a minority of votes.',
        'A bill becomes an act only once it has completed every stage and been approved.',
        'The rule of law means government itself is subject to the law.',
        'A referendum decides one question; an election chooses representatives.',
        'A pressure group seeks influence rather than office.'
      ],
      myths: [
        'The party with the most votes always wins the most seats.',
        'A bill and an act are the same thing.',
        'The judiciary makes the laws it applies.',
        'In a democracy the majority may do anything it wishes.',
        'A referendum and a general election answer the same kind of question.',
        'Pressure groups stand candidates for election.'
      ],
      applications: [
        ['Courts strike down a government action as unlawful. Which principle is at work?', 'the rule of law'],
        ['Seats are allocated to match each party’s share of the vote. Which system is this?', 'proportional representation'],
        ['No party has a majority and two form a government together. What is this?', 'a coalition'],
        ['Voters answer a single yes-or-no question. What has been held?', 'a referendum'],
        ['A proposed law is still being debated and amended. What is it?', 'a bill']
      ]
    },
    {
      name: 'Law, Justice and the Citizen', from: 'Grade 8', to: 'College',
      facts: [
        ['criminal law', 'the law dealing with offences against society'],
        ['civil law', 'the law dealing with disputes between individuals or organisations'],
        ['the burden of proof', 'the obligation to prove a case'],
        ['beyond reasonable doubt', 'the standard of proof in a criminal trial'],
        ['the balance of probabilities', 'the standard of proof in a civil case'],
        ['the presumption of innocence', 'the principle that the accused is innocent until proven guilty'],
        ['a jury', 'the group of citizens deciding the facts in a serious trial'],
        ['a magistrate', 'a judge who hears less serious criminal cases'],
        ['a barrister', 'a lawyer who argues cases in court'],
        ['a solicitor', 'a lawyer who advises clients and prepares cases'],
        ['a defendant', 'the person accused or being sued'],
        ['a plaintiff', 'the person bringing a civil claim'],
        ['a prosecution', 'the case brought against a defendant in criminal law'],
        ['a verdict', 'the jury’s decision on the facts'],
        ['a sentence', 'the penalty imposed after a guilty verdict'],
        ['an appeal', 'a request for a higher court to review a decision'],
        ['a precedent', 'an earlier decision that guides later ones'],
        ['legal aid', 'public funding for legal representation'],
        ['restorative justice', 'an approach bringing offender and victim together'],
        ['a deterrent', 'a penalty intended to discourage others']
      ],
      truths: [
        'Criminal cases must be proved beyond reasonable doubt; civil cases on the balance of probabilities.',
        'The burden of proof in a criminal trial lies with the prosecution.',
        'A jury decides the facts; the judge decides the law and the sentence.',
        'A precedent binds later courts of the same or lower rank.',
        'An appeal reviews a decision; it is not a fresh trial of the same facts.',
        'A defendant found not guilty has not been proved innocent — the case was not proved.'
      ],
      myths: [
        'Criminal and civil cases use the same standard of proof.',
        'The defendant must prove they are innocent.',
        'The jury decides the sentence.',
        'An appeal is a completely new trial.',
        'A not-guilty verdict means the court found the defendant innocent.',
        'Every criminal case is heard by a jury.'
      ],
      applications: [
        ['A neighbour sues over a boundary. Which kind of law applies?', 'civil law'],
        ['The prosecution must convince the jury to a high standard. Which standard?', 'beyond reasonable doubt'],
        ['A higher court is asked to review a conviction. What has been lodged?', 'an appeal'],
        ['An earlier ruling on similar facts guides the judge. What is it?', 'a precedent'],
        ['Offender and victim meet to discuss the harm done. What approach is this?', 'restorative justice']
      ]
    }
  ],

  cultures: [
    {
      name: 'World Religions: Beliefs and Practice', from: 'Grade 6', to: 'College',
      facts: [
        ['monotheism', 'belief in one God'],
        ['polytheism', 'belief in many gods'],
        ['a sacred text', 'a writing a religion treats as authoritative'],
        ['a place of worship', 'a building where a community gathers to worship'],
        ['a pilgrimage', 'a journey made for religious reasons'],
        ['a festival', 'a recurring religious celebration'],
        ['a rite of passage', 'a ceremony marking a stage of life'],
        ['fasting', 'going without food for a religious purpose'],
        ['prayer', 'communication with God or the divine'],
        ['a synagogue', 'the Jewish place of worship'],
        ['a church', 'the Christian place of worship'],
        ['a mosque', 'the Muslim place of worship'],
        ['a mandir', 'the Hindu place of worship'],
        ['a gurdwara', 'the Sikh place of worship'],
        ['a vihara', 'a Buddhist monastery or temple'],
        ['the Torah', 'the Jewish sacred text'],
        ['the Bible', 'the Christian sacred text'],
        ['the Qur’an', 'the Muslim sacred text'],
        ['the Guru Granth Sahib', 'the Sikh sacred scripture'],
        ['secular', 'not connected with religion'],
        ['an atheist', 'someone who does not believe in a god'],
        ['an agnostic', 'someone who holds that it cannot be known']
      ],
      truths: [
        'Judaism, Christianity and Islam are all monotheistic.',
        'An atheist believes there is no god; an agnostic holds that it cannot be known.',
        'Within any religion there is a wide range of practice and interpretation.',
        'A place of worship serves as a community centre as well as a religious one.',
        'Fasting appears in several religions with different meanings and rules.',
        'Secular means not connected with religion, not opposed to it.'
      ],
      myths: [
        'Everyone within a religion believes and practises the same way.',
        'Atheist and agnostic mean the same thing.',
        'Secular means anti-religious.',
        'All religions have a single founder and a single text.',
        'A pilgrimage is required in every religion.',
        'Religions with many gods are simply older versions of ones with a single God.'
      ],
      applications: [
        ['A journey is made to a holy site as an act of devotion. What is it?', 'a pilgrimage'],
        ['A ceremony marks a young person entering adulthood. What is this?', 'a rite of passage'],
        ['Someone holds that the existence of God cannot be known. What are they?', 'an agnostic'],
        ['A community gathers in a gurdwara. Which religion is this?', 'the Guru Granth Sahib'],
        ['A school teaches about religions without promoting one. What kind of school is it?', 'secular']
      ]
    }
  ]
};
