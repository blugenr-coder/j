/* World history and geography, named by period and place.

   A search for "spanish empire" used to find the Spanish language. Part of that
   was a parser bug, and part of it was that there was no Spanish empire unit to
   find. The same was true of the English Civil War, the Mughals, the Ottomans,
   Meiji Japan and half a dozen other things a school course covers by name.

   Each unit here is a period or a place a syllabus names, so a worksheet
   titled "The Spanish Empire" is about the Spanish empire and nothing else. */

export const WORLD_UNITS = {
  history: [
    {
      name: 'The Age of Exploration and the Spanish Empire', from: 'Grade 5', to: 'College',
      facts: [
        ['the Age of Exploration', 'the period of European voyages from the 1400s onwards'],
        ['a caravel', 'the small, manoeuvrable ship used on early Atlantic voyages'],
        ['a navigator', 'the person responsible for finding the way at sea'],
        ['an astrolabe', 'the instrument used to work out latitude from the stars'],
        ['Christopher Columbus', 'the navigator whose 1492 voyage opened Spanish contact with the Americas'],
        ['the conquistadors', 'the Spanish soldiers who conquered territories in the Americas'],
        ['Hernán Cortés', 'the conquistador who overthrew the Aztec empire'],
        ['Francisco Pizarro', 'the conquistador who overthrew the Inca empire'],
        ['the Aztec empire', 'the empire centred on Tenochtitlan, conquered in 1521'],
        ['the Inca empire', 'the Andean empire conquered in the 1530s'],
        ['Tenochtitlan', 'the Aztec capital, built on a lake'],
        ['the Columbian Exchange', 'the transfer of crops, animals and diseases between the hemispheres'],
        ['smallpox', 'the disease that killed a large share of the Indigenous population'],
        ['silver', 'the metal from Potosí that funded the Spanish crown'],
        ['the encomienda', 'the system granting Spanish settlers the labour of Indigenous people'],
        ['a colony', 'territory ruled by a distant power'],
        ['the Treaty of Tordesillas', 'the 1494 division of new territories between Spain and Portugal'],
        ['the Manila galleon', 'the trade route linking the Americas to Asia'],
        ['a viceroy', 'the crown’s representative governing a colony'],
        ['the Armada', 'the Spanish fleet defeated in 1588']
      ],
      truths: [
        'Disease killed far more Indigenous people than fighting did.',
        'The Columbian Exchange moved potatoes and maize east and horses and wheat west.',
        'Silver from the Americas paid for Spanish power in Europe.',
        'Cortés succeeded partly by allying with peoples who resented Aztec rule.',
        'The Treaty of Tordesillas divided the world between Spain and Portugal with a line on a map.'
      ],
      myths: [
        'Columbus proved the Earth was round.',
        'A few hundred Spanish soldiers defeated the Aztecs unaided.',
        'The Americas were thinly populated before Europeans arrived.',
        'The Spanish empire and the Spanish language are the same subject.',
        'European ships were far more advanced than every other seagoing tradition.'
      ],
      sequences: [
        ['The Spanish conquest of the Aztec empire', [
          'Cortés lands on the Gulf coast in 1519',
          'He gathers allies among peoples subject to the Aztecs',
          'The Spanish enter Tenochtitlan and seize Moctezuma',
          'A revolt drives the Spanish out of the city',
          'Smallpox sweeps the city',
          'Tenochtitlan falls in 1521'
        ]]
      ],
      applications: [
        ['Potatoes reach Europe and horses reach the Americas. What is this called?', 'the Columbian Exchange'],
        ['A 1494 treaty draws a line dividing new lands between two crowns. Which treaty?', 'the Treaty of Tordesillas'],
        ['Settlers are granted the labour of Indigenous people. What system is this?', 'the encomienda'],
        ['A metal mined at Potosí funds Spanish armies in Europe. What is it?', 'silver'],
        ['A fleet sent against England is scattered in 1588. What was it?', 'the Armada']
      ]
    },
    {
      name: 'The Stuarts and the English Civil War', from: 'Grade 6', to: 'College',
      facts: [
        ['the Stuarts', 'the royal family that ruled from 1603'],
        ['James I', 'the first Stuart king of England'],
        ['Charles I', 'the king executed in 1649'],
        ['the divine right of kings', 'the claim that a monarch answers only to God'],
        ['Parliament', 'the body that claimed the right to consent to taxation'],
        ['Ship Money', 'the tax Charles I raised without Parliament'],
        ['the Long Parliament', 'the Parliament that sat from 1640 and challenged the king'],
        ['a Royalist', 'a supporter of the king, also called a Cavalier'],
        ['a Parliamentarian', 'a supporter of Parliament, also called a Roundhead'],
        ['the New Model Army', 'the disciplined, professionally led parliamentary army'],
        ['Oliver Cromwell', 'the commander who became Lord Protector'],
        ['the Battle of Naseby', 'the 1645 battle that broke the Royalist cause'],
        ['the regicide', 'the execution of the king in 1649'],
        ['the Commonwealth', 'the republic that followed the execution'],
        ['the Protectorate', 'the period when Cromwell ruled as Lord Protector'],
        ['the Restoration', 'the return of the monarchy under Charles II in 1660'],
        ['the Glorious Revolution', 'the 1688 replacement of James II by William and Mary'],
        ['the Bill of Rights', 'the 1689 settlement limiting royal power'],
        ['a constitutional monarchy', 'a monarchy whose powers are limited by law'],
        ['the Gunpowder Plot', 'the 1605 attempt to blow up Parliament']
      ],
      truths: [
        'The Civil War was fought over who had the right to govern and to tax.',
        'The New Model Army was promoted on ability rather than birth, which was unusual.',
        'The monarchy was restored in 1660, eleven years after the execution.',
        'The Glorious Revolution settled that Parliament, not the crown, was supreme.',
        'Cromwell ruled as Lord Protector, not as king, though he was offered the crown.'
      ],
      myths: [
        'The English Civil War was fought between England and another country.',
        'The monarchy was abolished permanently in 1649.',
        'Cromwell made himself king.',
        'Everyone in the country took a side in the fighting.',
        'The Glorious Revolution involved a long and bloody war in England.'
      ],
      sequences: [
        ['From taxation to regicide', [
          'Charles I rules for eleven years without calling Parliament',
          'He raises Ship Money and other taxes without consent',
          'War with Scotland forces him to call Parliament in 1640',
          'Parliament demands limits on royal power and war breaks out in 1642',
          'The New Model Army wins decisively at Naseby in 1645',
          'Charles I is tried and executed in 1649'
        ]]
      ],
      applications: [
        ['A king raises a tax without calling Parliament. Which tax?', 'Ship Money'],
        ['An army promotes officers on merit rather than birth. Which army?', 'the New Model Army'],
        ['A monarch claims to answer only to God. Which idea is this?', 'the divine right of kings'],
        ['The monarchy returns in 1660. What is this called?', 'the Restoration'],
        ['A 1689 settlement limits what a monarch may do. What is it?', 'the Bill of Rights']
      ]
    },
    {
      name: 'The Ottoman Empire', from: 'Grade 7', to: 'College',
      facts: [
        ['the Ottoman Empire', 'the empire ruling from Anatolia across three continents for six centuries'],
        ['a sultan', 'the Ottoman ruler'],
        ['Constantinople', 'the Byzantine capital taken in 1453'],
        ['the fall of Constantinople', 'the 1453 conquest that ended the Byzantine Empire'],
        ['Mehmed II', 'the sultan who took Constantinople'],
        ['Suleiman the Magnificent', 'the sultan under whom the empire reached its height'],
        ['the janissaries', 'the elite infantry corps recruited and trained by the state'],
        ['the devshirme', 'the levy of boys recruited into imperial service'],
        ['the millet system', 'the arrangement giving religious communities their own courts'],
        ['a vizier', 'a senior minister'],
        ['the Topkapi Palace', 'the sultan’s residence and seat of government'],
        ['the Hagia Sophia', 'the great church converted to a mosque after 1453'],
        ['the Silk Road', 'the trade routes the empire sat astride'],
        ['the Siege of Vienna', 'the 1683 defeat that marked the limit of Ottoman expansion'],
        ['a caliph', 'the title claimed by later sultans as leader of the Muslim community'],
        ['the Tanzimat', 'the nineteenth-century reforms modernising the state'],
        ['the Young Turks', 'the movement that forced constitutional government in 1908'],
        ['a firman', 'a decree issued by the sultan'],
        ['a pasha', 'a high-ranking provincial governor'],
        ['the Dardanelles', 'the strait controlling access between the Mediterranean and Black Sea']
      ],
      truths: [
        'The Ottoman Empire lasted from about 1300 until after the First World War.',
        'The millet system let religious communities run their own courts and schools.',
        'Constantinople fell in 1453, ending the Byzantine Empire.',
        'The empire sat across the trade routes between Europe and Asia, which is part of why Europeans sought sea routes.',
        'Ottoman expansion into central Europe stopped at Vienna in 1683.'
      ],
      myths: [
        'The Ottoman Empire was a short-lived state.',
        'Non-Muslims had no legal standing at all in the empire.',
        'The empire was purely military and produced no scholarship or architecture.',
        'Constantinople fell to a European power.',
        'The empire ended in the Middle Ages.'
      ],
      applications: [
        ['A city falls in 1453 and the Byzantine Empire ends. Which city?', 'Constantinople'],
        ['Religious communities run their own courts within one empire. What system is this?', 'the millet system'],
        ['An elite infantry corps is recruited and trained by the state. Who are they?', 'the janissaries'],
        ['A failed 1683 siege marks the furthest Ottoman advance. Which siege?', 'the Siege of Vienna'],
        ['Nineteenth-century reforms modernise the Ottoman state. What are they called?', 'the Tanzimat']
      ]
    },
    {
      name: 'Imperial China and the Dynasties', from: 'Grade 6', to: 'College',
      facts: [
        ['a dynasty', 'a succession of rulers from the same family'],
        ['the Mandate of Heaven', 'the belief that heaven grants and withdraws the right to rule'],
        ['the Qin dynasty', 'the dynasty that first unified China'],
        ['Qin Shi Huang', 'the first emperor, buried with the terracotta army'],
        ['the terracotta army', 'the thousands of clay soldiers guarding the first emperor’s tomb'],
        ['the Great Wall', 'the defensive works built and rebuilt across the northern frontier'],
        ['the Han dynasty', 'the long dynasty that set the model for later Chinese states'],
        ['the Silk Road', 'the trade routes linking China with central Asia and beyond'],
        ['the Tang dynasty', 'the dynasty known for poetry, trade and cosmopolitan cities'],
        ['the Song dynasty', 'the dynasty of printing, paper money and gunpowder'],
        ['the Ming dynasty', 'the dynasty of the Forbidden City and the treasure voyages'],
        ['Zheng He', 'the admiral whose fleets reached east Africa'],
        ['the Forbidden City', 'the imperial palace complex in Beijing'],
        ['the Qing dynasty', 'the last imperial dynasty, ending in 1912'],
        ['Confucianism', 'the tradition of ethics and social order shaping Chinese government'],
        ['the civil service examination', 'the tests through which officials were selected'],
        ['a scholar-official', 'an administrator chosen by examination rather than birth'],
        ['paper', 'the Han invention that transformed record keeping'],
        ['the compass', 'the navigational invention developed in China'],
        ['printing', 'the technique developed centuries before it reached Europe']
      ],
      truths: [
        'Officials were selected by competitive examination for over a thousand years.',
        'Paper, printing, gunpowder and the compass were all developed in China first.',
        'The Mandate of Heaven was used to explain both the rise and the fall of dynasties.',
        'Zheng He’s fleets reached east Africa decades before European ships did.',
        'The Great Wall was built and rebuilt over many centuries, not all at once.'
      ],
      myths: [
        'The Great Wall was built in one go by one emperor.',
        'Chinese officials inherited their posts.',
        'China was cut off from the rest of the world throughout its history.',
        'Printing was invented in Europe.',
        'The last dynasty ended in the eighteenth century.'
      ],
      applications: [
        ['Thousands of clay soldiers guard a tomb near Xi’an. What are they?', 'the terracotta army'],
        ['A belief explains why a dynasty lost the right to rule. What is it?', 'the Mandate of Heaven'],
        ['An admiral’s fleets reach east Africa in the 1400s. Who was he?', 'Zheng He'],
        ['A post is won by passing a written test rather than by birth. What is that person?', 'a scholar-official'],
        ['Paper money and printing spread under which dynasty?', 'the Song dynasty']
      ]
    },
    {
      name: 'Mughal India and the British Raj', from: 'Grade 7', to: 'College',
      facts: [
        ['the Mughal Empire', 'the empire ruling much of the Indian subcontinent from 1526'],
        ['Babur', 'the founder of the Mughal Empire'],
        ['Akbar', 'the emperor known for religious tolerance and administrative reform'],
        ['Shah Jahan', 'the emperor who built the Taj Mahal'],
        ['the Taj Mahal', 'the mausoleum at Agra built for Mumtaz Mahal'],
        ['Aurangzeb', 'the emperor whose long wars strained the empire'],
        ['a subah', 'a Mughal province'],
        ['the East India Company', 'the trading company that became a governing power'],
        ['the Battle of Plassey', 'the 1757 victory that gave the Company control of Bengal'],
        ['Bengal', 'the wealthy province the Company took first'],
        ['the Indian Rebellion of 1857', 'the widespread rising against Company rule'],
        ['the British Raj', 'direct British crown rule from 1858 to 1947'],
        ['a viceroy', 'the crown’s representative in India'],
        ['the Indian National Congress', 'the party founded in 1885 that led the independence movement'],
        ['Mohandas Gandhi', 'the leader of mass non-violent resistance'],
        ['satyagraha', 'Gandhi’s method of non-violent resistance'],
        ['the Salt March', 'the 1930 protest against the salt tax'],
        ['partition', 'the 1947 division into India and Pakistan'],
        ['independence', 'the end of British rule in 1947'],
        ['the deindustrialisation of textiles', 'the collapse of Indian cloth production under British trade policy']
      ],
      truths: [
        'The East India Company was a trading company that acquired an army and territory.',
        'Direct crown rule began in 1858, after the rebellion of 1857.',
        'Gandhi’s satyagraha was a deliberate strategy, not simply passivity.',
        'Partition in 1947 displaced millions of people.',
        'India was a major manufacturing economy before British trade policy reshaped it.'
      ],
      myths: [
        'Britain governed India directly from the beginning.',
        'The 1857 rebellion was confined to a single regiment.',
        'Non-violent resistance meant doing nothing.',
        'The Mughal Empire and British rule were the same period.',
        'India was economically undeveloped before colonisation.'
      ],
      applications: [
        ['A trading company wins Bengal in 1757. Which battle?', 'the Battle of Plassey'],
        ['A mausoleum at Agra is built for an emperor’s wife. What is it?', 'the Taj Mahal'],
        ['A march to the sea protests against a tax on salt. What was it?', 'the Salt March'],
        ['Crown rule replaces company rule in 1858. What is that period called?', 'the British Raj'],
        ['The subcontinent is divided into two states in 1947. What is this?', 'partition']
      ]
    },
    {
      name: 'Africa: Kingdoms, Trade and Colonisation', from: 'Grade 6', to: 'College',
      facts: [
        ['the Kingdom of Mali', 'the west African empire enriched by gold and salt'],
        ['Mansa Musa', 'the Malian ruler whose pilgrimage displayed extraordinary wealth'],
        ['Timbuktu', 'the Malian city known for its scholars and libraries'],
        ['the trans-Saharan trade', 'the caravan routes crossing the desert'],
        ['gold and salt', 'the two goods that drove west African trade'],
        ['the Kingdom of Benin', 'the west African state known for its bronze plaques'],
        ['the Benin Bronzes', 'the cast plaques and sculptures taken in 1897'],
        ['Great Zimbabwe', 'the stone city of a southern African trading state'],
        ['the Swahili coast', 'the east African trading cities linked to the Indian Ocean'],
        ['the Kingdom of Aksum', 'the early Ethiopian trading power'],
        ['the transatlantic slave trade', 'the forced transportation of millions of Africans to the Americas'],
        ['the Middle Passage', 'the Atlantic crossing endured by enslaved people'],
        ['abolition', 'the ending of the slave trade and of slavery'],
        ['the Scramble for Africa', 'the rapid European partition of the continent'],
        ['the Berlin Conference', 'the 1884–85 meeting at which Europeans divided Africa'],
        ['a protectorate', 'a territory controlled but not formally annexed'],
        ['resistance', 'the many African campaigns against colonial rule'],
        ['independence', 'the wave of decolonisation from the late 1950s'],
        ['an oral history', 'a record passed on by speech rather than writing'],
        ['a griot', 'a west African keeper of history and genealogy in oral form']
      ],
      truths: [
        'Timbuktu was a centre of scholarship with substantial libraries.',
        'The Berlin Conference divided Africa between European powers with almost no African participation.',
        'African societies had written and oral records long before European contact.',
        'Great Zimbabwe was built by the region’s own inhabitants.',
        'The trans-Saharan gold trade made Mali one of the wealthiest states of its day.'
      ],
      myths: [
        'Africa had no cities, states or written records before Europeans arrived.',
        'Great Zimbabwe must have been built by outsiders.',
        'The Berlin Conference included African rulers.',
        'Oral history is simply unreliable storytelling.',
        'European colonisation of Africa was a slow process spread over centuries.'
      ],
      applications: [
        ['A ruler’s pilgrimage in 1324 spends so much gold that prices fall. Who was he?', 'Mansa Musa'],
        ['European powers divide a continent at a meeting in 1884. Which meeting?', 'the Berlin Conference'],
        ['Cast plaques are taken from a west African palace in 1897. What are they?', 'the Benin Bronzes'],
        ['Caravans carry gold north and salt south across a desert. What trade is this?', 'the trans-Saharan trade'],
        ['A specialist keeps a community’s history by memory and recitation. What is he?', 'a griot']
      ]
    },
    {
      name: 'Japan: Shogunate to Modern State', from: 'Grade 7', to: 'College',
      facts: [
        ['a shogun', 'the military ruler who governed in the emperor’s name'],
        ['a samurai', 'a member of the warrior class'],
        ['bushido', 'the code of conduct expected of a samurai'],
        ['a daimyo', 'a regional lord holding land and retainers'],
        ['the Tokugawa shogunate', 'the government that ruled Japan from 1603 to 1868'],
        ['Edo', 'the city that became Tokyo'],
        ['sakoku', 'the policy of restricted contact with the outside world'],
        ['Commodore Perry', 'the American officer whose 1853 fleet forced Japan to open ports'],
        ['the Meiji Restoration', 'the 1868 return of power to the emperor and rapid modernisation'],
        ['industrialisation', 'the rapid building of factories, railways and shipyards'],
        ['a constitution', 'the 1889 document establishing a parliament'],
        ['the Russo-Japanese War', 'the 1904–05 war Japan won, surprising European powers'],
        ['a treaty port', 'a port opened to foreign trade under an unequal treaty'],
        ['an unequal treaty', 'an agreement imposed on weaker states by stronger ones'],
        ['Zen', 'the school of Buddhism influential in Japanese culture'],
        ['a haiku', 'the short poetic form of seventeen syllables'],
        ['ukiyo-e', 'the woodblock prints of the Edo period'],
        ['the emperor', 'the hereditary head of state, often without direct power'],
        ['modernisation', 'the deliberate adoption of foreign technology and institutions']
      ],
      truths: [
        'Under the shogunate the emperor reigned while the shogun ruled.',
        'Japan industrialised extremely rapidly after 1868.',
        'Sakoku restricted foreign contact but did not end it entirely.',
        'Japan’s victory over Russia in 1905 changed how European powers saw it.',
        'The Meiji Restoration was a deliberate programme of borrowing and adaptation.'
      ],
      myths: [
        'Japan was completely sealed off from the world before 1853.',
        'The emperor held real political power throughout the shogunate.',
        'Japan modernised slowly over two centuries.',
        'Samurai were the only people who mattered in Edo society.',
        'Japan simply copied the West without adapting anything.'
      ],
      applications: [
        ['A military ruler governs while the emperor reigns. What is his title?', 'a shogun'],
        ['An American fleet arrives in 1853 and demands ports be opened. Who commanded it?', 'Commodore Perry'],
        ['Power returns to the emperor in 1868 and reform follows. What is this called?', 'the Meiji Restoration'],
        ['A policy restricts contact with foreign countries. What is it called?', 'sakoku'],
        ['Woodblock prints depict Edo city life. What are they?', 'ukiyo-e']
      ]
    },
    {
      name: 'Russia: Tsars, Revolution and the Soviet Union', from: 'Grade 8', to: 'College',
      facts: [
        ['a tsar', 'the Russian emperor'],
        ['Nicholas II', 'the last tsar, who abdicated in 1917'],
        ['serfdom', 'the system binding peasants to the land, ended in 1861'],
        ['the Duma', 'the parliament created after the 1905 revolution'],
        ['the 1905 revolution', 'the rising that forced limited reform'],
        ['the February Revolution', 'the 1917 rising that ended tsarist rule'],
        ['the October Revolution', 'the 1917 Bolshevik seizure of power'],
        ['the Bolsheviks', 'the party led by Lenin that took power'],
        ['Lenin', 'the Bolshevik leader'],
        ['a soviet', 'a workers’ and soldiers’ council'],
        ['the Russian Civil War', 'the 1918–21 conflict between Reds and Whites'],
        ['war communism', 'the emergency policy of requisition and state control'],
        ['the New Economic Policy', 'the partial return to markets after the civil war'],
        ['Stalin', 'the leader who industrialised the USSR through the Five-Year Plans'],
        ['a Five-Year Plan', 'the centrally set targets for industrial output'],
        ['collectivisation', 'the forced merging of farms into collectives'],
        ['the Great Purge', 'the campaign of arrests and executions in the 1930s'],
        ['the Cold War', 'the post-1945 confrontation with the United States'],
        ['the Iron Curtain', 'the divide between eastern and western Europe'],
        ['perestroika', 'Gorbachev’s restructuring of the Soviet economy'],
        ['glasnost', 'Gorbachev’s policy of greater openness']
      ],
      truths: [
        'There were two revolutions in 1917, not one.',
        'Serfdom was abolished in 1861, half a century before the revolution.',
        'Collectivisation caused a catastrophic famine in the early 1930s.',
        'The Five-Year Plans raised industrial output at enormous human cost.',
        'Perestroika and glasnost were intended to save the Soviet system, not end it.'
      ],
      myths: [
        'There was a single Russian revolution in 1917.',
        'The Bolsheviks had majority support when they took power.',
        'Serfdom lasted until the revolution.',
        'Collectivisation raised agricultural output immediately.',
        'Gorbachev set out to dissolve the Soviet Union.'
      ],
      sequences: [
        ['Russia from tsar to Soviet state', [
          'Defeat and hardship in the First World War',
          'The February Revolution forces the tsar to abdicate',
          'A provisional government tries to continue the war',
          'The Bolsheviks seize power in October',
          'Civil war between Reds and Whites',
          'The Soviet Union is founded in 1922'
        ]]
      ],
      applications: [
        ['Peasants are bound to the land they work. What system is this?', 'serfdom'],
        ['Farms are forcibly merged into collectives. What is this?', 'collectivisation'],
        ['Central targets are set for steel and coal output. What are they?', 'a Five-Year Plan'],
        ['A workers’ and soldiers’ council governs a city. What is it?', 'a soviet'],
        ['A policy of greater openness is announced in the 1980s. What is it?', 'glasnost']
      ]
    },
    {
      name: 'Civil Rights and Protest Movements', from: 'Grade 7', to: 'College',
      facts: [
        ['segregation', 'the legal separation of people by race'],
        ['Jim Crow laws', 'the laws enforcing segregation in the American South'],
        ['Brown v. Board of Education', 'the 1954 ruling that segregated schools were unconstitutional'],
        ['Rosa Parks', 'the activist whose arrest sparked the Montgomery bus boycott'],
        ['the Montgomery bus boycott', 'the year-long protest against segregated buses'],
        ['Martin Luther King Jr', 'the leader of the non-violent civil rights movement'],
        ['non-violent direct action', 'the strategy of protest without violence'],
        ['a sit-in', 'the protest of occupying a segregated space and refusing to leave'],
        ['the March on Washington', 'the 1963 demonstration where King spoke'],
        ['the Civil Rights Act', 'the 1964 law banning discrimination in public places and employment'],
        ['the Voting Rights Act', 'the 1965 law removing barriers to voting'],
        ['a literacy test', 'the device used to stop Black Americans registering to vote'],
        ['Malcolm X', 'the activist who argued for self-defence and Black self-determination'],
        ['the suffragettes', 'the campaigners for women’s right to vote in Britain'],
        ['suffrage', 'the right to vote'],
        ['Emmeline Pankhurst', 'the leader of the militant British suffrage movement'],
        ['apartheid', 'the system of racial separation in South Africa'],
        ['Nelson Mandela', 'the leader imprisoned for 27 years who became president'],
        ['a boycott', 'refusing to buy or use something as a protest'],
        ['civil disobedience', 'deliberately breaking a law considered unjust']
      ],
      truths: [
        'The Montgomery bus boycott lasted over a year.',
        'Literacy tests and poll taxes were used to stop Black Americans voting.',
        'Non-violent direct action was a deliberate strategy, chosen and trained for.',
        'The Civil Rights Act of 1964 and the Voting Rights Act of 1965 are different laws.',
        'Apartheid was dismantled through a combination of internal resistance and international pressure.'
      ],
      myths: [
        'Segregation ended immediately after the 1954 court ruling.',
        'The civil rights movement was led by one person.',
        'Non-violent protest meant simply waiting for change.',
        'Women were granted the vote without organised campaigning.',
        'Rosa Parks was simply too tired to move.'
      ],
      applications: [
        ['Protesters sit at a segregated lunch counter and refuse to leave. What is this?', 'a sit-in'],
        ['A 1965 law removes barriers stopping people registering to vote. Which act?', 'the Voting Rights Act'],
        ['A community refuses to use segregated buses for a year. What is this?', 'a boycott'],
        ['A law is broken deliberately because it is considered unjust. What is this?', 'civil disobedience'],
        ['A system of racial separation is enforced by law in South Africa. What is it?', 'apartheid']
      ]
    }
  ],

  geography: [
    {
      name: 'Biomes and Ecosystems of the World', from: 'Grade 5', to: 'College',
      facts: [
        ['a biome', 'a large region defined by its climate and the life it supports'],
        ['a tropical rainforest', 'a hot, wet biome with the greatest variety of species'],
        ['a savanna', 'tropical grassland with scattered trees and a dry season'],
        ['a desert', 'a biome defined by very low rainfall'],
        ['a temperate forest', 'a biome of deciduous trees with four distinct seasons'],
        ['taiga', 'the coniferous forest belt of the cold north'],
        ['tundra', 'the treeless biome with permanently frozen subsoil'],
        ['permafrost', 'ground that stays frozen all year'],
        ['a grassland', 'a biome dominated by grasses with too little rain for forest'],
        ['a coral reef', 'the marine ecosystem built by coral polyps'],
        ['biodiversity', 'the variety of life in a place'],
        ['an ecosystem', 'a community of living things together with its physical setting'],
        ['a canopy', 'the continuous layer of treetops in a rainforest'],
        ['the emergent layer', 'the tallest trees standing above the canopy'],
        ['nutrient cycling', 'the rapid return of nutrients from dead material to living plants'],
        ['adaptation', 'a feature that suits an organism to where it lives'],
        ['deforestation', 'the clearing of forest'],
        ['desertification', 'the process by which land becomes desert'],
        ['a food web', 'the interconnected feeding relationships of a community'],
        ['latitude', 'the distance north or south of the equator, which largely sets climate']
      ],
      truths: [
        'Rainforest soils are often poor, because nutrients are held in the living vegetation.',
        'A desert is defined by rainfall, not by temperature or sand.',
        'Tundra has permafrost, which is why trees cannot root there.',
        'Biomes follow latitude and altitude because both control temperature and rainfall.',
        'Coral reefs support a large share of marine species on a very small area.'
      ],
      myths: [
        'Rainforest soil is exceptionally fertile because so much grows there.',
        'All deserts are hot and sandy.',
        'The tundra has no plant life at all.',
        'Biomes are decided by which country they are in.',
        'Coral is a plant.'
      ],
      applications: [
        ['Ground stays frozen all year and trees cannot root. Which biome?', 'tundra'],
        ['A biome gets under 250mm of rain a year. Which is it?', 'a desert'],
        ['Nutrients pass quickly from fallen leaves back into growing trees. What is this?', 'nutrient cycling'],
        ['Tropical grassland with scattered trees and a marked dry season. What is it?', 'a savanna'],
        ['Land on the edge of a desert gradually becomes desert. What is this process?', 'desertification']
      ]
    },
    {
      name: 'Natural Hazards and Managing Risk', from: 'Grade 6', to: 'College',
      figures: ['volcano', 'earth-layers'],
      facts: [
        ['a natural hazard', 'a natural event with the potential to cause harm'],
        ['a natural disaster', 'a hazard that causes serious damage and loss of life'],
        ['vulnerability', 'how exposed a population is to harm from a hazard'],
        ['risk', 'the chance of harm, combining hazard and vulnerability'],
        ['a tropical cyclone', 'the intense storm known as a hurricane or typhoon'],
        ['a storm surge', 'the rise in sea level driven ashore by a storm'],
        ['a flood', 'water covering land that is normally dry'],
        ['a drought', 'a prolonged shortage of rainfall'],
        ['a wildfire', 'an uncontrolled fire in vegetation'],
        ['a landslide', 'the downslope movement of rock and soil'],
        ['an earthquake', 'the shaking caused by movement along a fault'],
        ['a tsunami', 'a wave generated by displacement of the sea floor'],
        ['prediction', 'forecasting when and where a hazard will strike'],
        ['preparation', 'planning and drills that reduce harm before an event'],
        ['mitigation', 'measures that reduce the impact of a hazard'],
        ['adaptation', 'changing how people live to cope with a hazard'],
        ['an early warning system', 'the network that alerts people before a hazard arrives'],
        ['relief', 'the immediate help provided after a disaster'],
        ['reconstruction', 'the longer-term rebuilding after a disaster'],
        ['a hazard map', 'a map showing which areas are most at risk']
      ],
      truths: [
        'The same hazard causes very different losses in different places, because vulnerability differs.',
        'Earthquakes cannot yet be predicted precisely, but their effects can be reduced.',
        'A storm surge often causes more deaths in a cyclone than the wind does.',
        'Preparation reduces deaths more reliably than prediction does.',
        'A tsunami is caused by the sea floor moving, not by wind.'
      ],
      myths: [
        'A natural hazard and a natural disaster are the same thing.',
        'Earthquakes can be predicted days in advance.',
        'Wealthy and poor countries suffer equally from the same earthquake.',
        'The wind is always the deadliest part of a hurricane.',
        'Nothing can be done to reduce the impact of a natural hazard.'
      ],
      applications: [
        ['Two earthquakes of the same size kill very different numbers of people. What differs?', 'vulnerability'],
        ['Sea level is driven ashore ahead of a hurricane. What is this?', 'a storm surge'],
        ['Sirens warn a coastal town before a wave arrives. What is that system?', 'an early warning system'],
        ['Buildings are designed to sway rather than collapse. What is this?', 'mitigation'],
        ['A map shades the areas most likely to flood. What is it?', 'a hazard map']
      ]
    },
    {
      name: 'Globalisation, Trade and Development', from: 'Grade 8', to: 'College',
      facts: [
        ['globalisation', 'the growing interconnection of economies and cultures'],
        ['a transnational corporation', 'a company operating in many countries'],
        ['outsourcing', 'moving work to another company, often abroad'],
        ['a supply chain', 'the sequence of steps bringing a product to a customer'],
        ['containerisation', 'the standard steel box that made shipping cheap'],
        ['a trade bloc', 'a group of countries trading on preferential terms'],
        ['a tariff', 'a tax on imported goods'],
        ['free trade', 'trade without tariffs or quotas'],
        ['fair trade', 'a scheme guaranteeing producers a minimum price'],
        ['a developing country', 'a country with lower average income and human development'],
        ['a developed country', 'a country with high income and human development'],
        ['an emerging economy', 'a country industrialising rapidly'],
        ['the development gap', 'the difference in living standards between countries'],
        ['aid', 'assistance given to a country, in money or in kind'],
        ['debt relief', 'the cancellation or reduction of a country’s debts'],
        ['microfinance', 'small loans to people without access to banks'],
        ['a remittance', 'money sent home by someone working abroad'],
        ['a primary product', 'a raw material such as a crop or an ore'],
        ['value added', 'the increase in worth from processing a raw material'],
        ['sustainability', 'meeting present needs without preventing future ones being met']
      ],
      truths: [
        'Containerisation cut shipping costs enough to make global supply chains viable.',
        'Countries that export mainly primary products capture little of the final value.',
        'Remittances are larger than aid for many countries.',
        'A tariff raises the price of an imported good for the buyer.',
        'Globalisation has raised incomes in some places and hollowed out industries in others.'
      ],
      myths: [
        'Globalisation benefits every country equally.',
        'Aid is the largest financial flow into developing countries.',
        'A tariff is paid by the exporting country.',
        'Exporting raw materials is the fastest route to development.',
        'Free trade and fair trade mean the same thing.'
      ],
      applications: [
        ['A standard steel box makes it cheap to move goods worldwide. What is this?', 'containerisation'],
        ['Workers abroad send money to their families at home. What is that flow?', 'a remittance'],
        ['A tax is charged on goods entering a country. What is it?', 'a tariff'],
        ['Cocoa beans are worth far less than the chocolate made from them. What has been added?', 'value added'],
        ['Small loans reach people with no access to a bank. What is this?', 'microfinance']
      ]
    }
  ]
};
