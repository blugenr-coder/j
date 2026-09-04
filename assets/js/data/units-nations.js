/* National history strands, and the last few gaps a coverage probe found.

   Eighty-eight standard curriculum terms were searched against the library.
   Eight found nothing, and most of them were one missing strand: British
   school history — Anglo-Saxons, Vikings, Tudors, Victorians — which is a
   third of the primary and lower-secondary history curriculum in England and
   was absent entirely. The American strand was thin for the same reason.

   The rest were single missing ideas: standard deviation, radioactivity, and
   two grammar terms that appear on English mark schemes and nowhere else. */

export const NATION_UNITS = {
  history: [
    {
      name: 'Anglo-Saxons and Vikings', from: 'Grade 3', to: 'Grade 8',
      facts: [
        ['an Anglo-Saxon', 'a settler from northern Europe who came to Britain after the Romans left'],
        ['a Viking', 'a raider, trader and settler from Scandinavia'],
        ['a longship', 'the fast shallow ship the Vikings sailed'],
        ['a raid', 'a sudden attack to seize goods'],
        ['Lindisfarne', 'the monastery raided in 793, often taken as the start of the Viking age'],
        ['a monastery', 'a religious community, and a target because of its wealth'],
        ['Danelaw', 'the part of England under Viking law'],
        ['a thegn', 'a landholding noble in Anglo-Saxon society'],
        ['a ceorl', 'a free farmer in Anglo-Saxon society'],
        ['a witan', 'the council that advised an Anglo-Saxon king'],
        ['Alfred the Great', 'the king of Wessex who resisted the Vikings and promoted learning'],
        ['Sutton Hoo', 'the ship burial that revealed Anglo-Saxon craftsmanship'],
        ['a rune', 'a letter of the Anglo-Saxon and Norse alphabet'],
        ['a saga', 'a Norse story of heroes and families'],
        ['a longhouse', 'the long single-roomed building a Viking family lived in'],
        ['a hoard', 'a buried collection of valuables'],
        ['a chronicle', 'a year-by-year written record of events'],
        ['the Anglo-Saxon Chronicle', 'the record kept in monasteries, a main source for the period'],
        ['1066', 'the year of the Norman conquest, which ended Anglo-Saxon rule'],
        ['a settlement name', 'a place name ending such as -by or -thorpe, showing Viking settlement']
      ],
      truths: [
        'The Vikings settled and farmed in Britain as well as raiding it.',
        'Place names ending in -by or -thorpe show where Vikings settled.',
        'The Anglo-Saxon Chronicle was written by monks, which shapes what it records.',
        'Sutton Hoo showed that Anglo-Saxon craftsmanship was far finer than had been assumed.',
        'Alfred the Great ruled Wessex, not the whole of England.'
      ],
      myths: [
        'Viking helmets had horns on them.',
        'The Vikings only ever raided and never settled.',
        'The Anglo-Saxon period was a dark age with no art or learning.',
        'Alfred the Great was king of all England.',
        'Everything we know about the Vikings comes from their own writing.'
      ],
      sequences: [
        ['Britain after the Romans', [
          'Roman soldiers withdraw from Britain',
          'Anglo-Saxon peoples settle and form kingdoms',
          'Viking raids begin, including Lindisfarne in 793',
          'Vikings settle and the Danelaw is established',
          'Alfred and his successors push back and unify much of England',
          'The Norman conquest of 1066 ends Anglo-Saxon rule'
        ]]
      ],
      applications: [
        ['A village is called Grimsby. What does the ending suggest?', 'a settlement name'],
        ['Monks record events year by year in a monastery. What are they writing?', 'a chronicle'],
        ['A buried ship full of treasure is excavated in Suffolk. What site is this?', 'Sutton Hoo'],
        ['A king asks his council of nobles for advice. What is the council?', 'a witan'],
        ['A shallow, fast ship carries raiders up a river. What is it?', 'a longship']
      ]
    },
    {
      name: 'The Tudors', from: 'Grade 4', to: 'Grade 9',
      facts: [
        ['the Tudor dynasty', 'the royal family that ruled England from 1485 to 1603'],
        ['Henry VII', 'the first Tudor king, who won at Bosworth'],
        ['Henry VIII', 'the king who broke with Rome and had six wives'],
        ['Edward VI', 'the young Protestant king who followed Henry VIII'],
        ['Mary I', 'the queen who tried to restore Catholicism'],
        ['Elizabeth I', 'the queen who ruled for forty-five years and settled the religious question'],
        ['the Reformation', 'the break with the Catholic Church'],
        ['the Church of England', 'the church established with the monarch at its head'],
        ['the dissolution of the monasteries', 'the closure of monasteries and seizure of their wealth'],
        ['a Protestant', 'someone who broke with the authority of the Pope'],
        ['a Catholic', 'someone who remained loyal to the Pope'],
        ['the Spanish Armada', 'the fleet sent against England in 1588'],
        ['an heir', 'the person who would inherit the throne'],
        ['a portrait', 'a painting used to project royal power'],
        ['propaganda', 'images and words used to shape how a ruler is seen'],
        ['the Globe', 'the London theatre where Shakespeare’s plays were performed'],
        ['a groundling', 'someone who stood in the yard to watch a play'],
        ['exploration', 'the voyages that expanded English trade and territory'],
        ['the poor law', 'the system for dealing with poverty'],
        ['a source', 'something from the time that tells us about it']
      ],
      truths: [
        'Henry VIII broke with Rome partly to secure a male heir.',
        'The dissolution of the monasteries transferred enormous wealth to the crown.',
        'Elizabeth I used portraits deliberately to project power.',
        'The Spanish Armada was defeated by weather as well as by English ships.',
        'The Tudor period saw both Protestant and Catholic monarchs in quick succession.'
      ],
      myths: [
        'Henry VIII executed all six of his wives.',
        'Everyone in England became Protestant the moment Henry broke with Rome.',
        'The Armada was destroyed entirely in battle.',
        'Elizabeth I had no serious rivals for the throne.',
        'Tudor portraits are accurate photographs of what people looked like.'
      ],
      applications: [
        ['Monastic land and wealth pass to the crown in the 1530s. What event is this?', 'the dissolution of the monasteries'],
        ['A queen is painted covered in symbols of power and purity. What is the painting doing?', 'propaganda'],
        ['A fleet is sent against England in 1588. What is it?', 'the Spanish Armada'],
        ['A theatregoer pays a penny to stand in the yard. What are they called?', 'a groundling'],
        ['A king’s main worry is who will inherit the throne. What is he seeking?', 'an heir']
      ]
    },
    {
      name: 'Victorian Britain', from: 'Grade 4', to: 'Grade 9',
      facts: [
        ['the Victorian era', 'the reign of Queen Victoria, 1837 to 1901'],
        ['Queen Victoria', 'the monarch the period is named after'],
        ['the British Empire', 'the territories Britain ruled across the world'],
        ['a workhouse', 'the institution where the destitute were housed and made to work'],
        ['a mill', 'a factory for spinning or weaving'],
        ['a chimney sweep', 'a child employed to climb and clean chimneys'],
        ['the Factory Acts', 'the laws limiting hours and ages of work'],
        ['a reformer', 'someone campaigning to improve conditions'],
        ['Lord Shaftesbury', 'the reformer associated with limiting child labour'],
        ['a slum', 'overcrowded housing with poor sanitation'],
        ['cholera', 'the water-borne disease that swept Victorian cities'],
        ['John Snow', 'the doctor who traced cholera to a contaminated water pump'],
        ['the Great Exhibition', 'the 1851 display of industrial achievement'],
        ['the railway', 'the transport that reshaped Victorian life'],
        ['a philanthropist', 'a wealthy person who funded schools, housing or hospitals'],
        ['compulsory education', 'the requirement that children attend school'],
        ['a ragged school', 'a free school for the poorest children'],
        ['the census', 'the ten-yearly count of the population'],
        ['a servant', 'the largest category of employment for Victorian women'],
        ['sanitation', 'the removal of waste and supply of clean water']
      ],
      truths: [
        'John Snow traced a cholera outbreak to a single contaminated water pump.',
        'Child labour was restricted gradually by a series of Factory Acts.',
        'Education did not become compulsory in Britain until late in the period.',
        'The census is one of the richest sources for how Victorians lived.',
        'Domestic service employed more Victorian women than any factory.'
      ],
      myths: [
        'Victorian Britain was wealthy for everyone.',
        'Child labour was banned at the start of Victoria’s reign.',
        'Cholera was caused by bad smells in the air.',
        'All Victorian children went to school.',
        'The Great Exhibition was a small local event.'
      ],
      applications: [
        ['Cases of a disease cluster around one water pump in Soho. Who investigated?', 'John Snow'],
        ['A destitute family is housed and set to work in return. Where are they?', 'a workhouse'],
        ['A wealthy factory owner funds a school and housing for workers. What is he?', 'a philanthropist'],
        ['A ten-yearly record lists every household. What is it?', 'the census'],
        ['A law limits the hours a child may work in a factory. What kind of law?', 'the Factory Acts']
      ]
    },
    {
      name: 'Founding the United States', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['a colony', 'a settlement ruled by a distant country'],
        ['the thirteen colonies', 'the British colonies that became the first states'],
        ['taxation without representation', 'the grievance that colonists were taxed with no say in Parliament'],
        ['the Stamp Act', 'the tax on printed materials that provoked protest'],
        ['the Boston Tea Party', 'the 1773 protest in which tea was thrown into the harbour'],
        ['the Declaration of Independence', 'the 1776 statement that the colonies were free states'],
        ['the American Revolution', 'the war that separated the colonies from Britain'],
        ['a patriot', 'a colonist who supported independence'],
        ['a loyalist', 'a colonist who stayed loyal to Britain'],
        ['George Washington', 'the commander of the Continental Army and first president'],
        ['the Constitution', 'the document setting out how the United States is governed'],
        ['the Bill of Rights', 'the first ten amendments, protecting individual freedoms'],
        ['an amendment', 'a change or addition to the Constitution'],
        ['federalism', 'the division of power between national and state government'],
        ['the separation of powers', 'the division into legislative, executive and judicial branches'],
        ['checks and balances', 'the ways each branch limits the others'],
        ['Congress', 'the legislative branch, made of the Senate and the House'],
        ['the Supreme Court', 'the highest court, which interprets the Constitution'],
        ['a veto', 'the president’s power to reject a bill'],
        ['ratification', 'the approval that made the Constitution binding']
      ],
      truths: [
        'The Declaration of Independence announced separation; the Constitution came eleven years later.',
        'Checks and balances let each branch limit the other two.',
        'The Bill of Rights is the first ten amendments to the Constitution.',
        'Not all colonists supported independence — loyalists opposed it.',
        'Federalism divides power between the national government and the states.'
      ],
      myths: [
        'The Declaration of Independence and the Constitution are the same document.',
        'Every colonist supported the revolution.',
        'The Constitution has never been changed.',
        'The president can pass laws directly.',
        'The Supreme Court writes the laws it applies.'
      ],
      sequences: [
        ['From colony to constitution', [
          'Britain taxes the colonies to pay for war debts',
          'Colonists protest that they are taxed without representation',
          'Protest turns to open conflict in 1775',
          'The Declaration of Independence is adopted in 1776',
          'The war ends and the colonies become independent states',
          'The Constitution is written and ratified, creating a federal government'
        ]]
      ],
      applications: [
        ['A president rejects a bill passed by Congress. What has been used?', 'a veto'],
        ['Power is shared between Washington and the individual states. What is this?', 'federalism'],
        ['The first ten amendments protect freedom of speech and religion. What are they?', 'the Bill of Rights'],
        ['A colonist argues the colonies should stay British. What are they?', 'a loyalist'],
        ['Colonists throw tea into a harbour in protest at a tax. What event is this?', 'the Boston Tea Party']
      ]
    },
    {
      name: 'The United States in the Nineteenth Century', from: 'Grade 5', to: 'College',
      facts: [
        ['westward expansion', 'the movement of settlers across the continent'],
        ['the frontier', 'the moving edge of settlement'],
        ['manifest destiny', 'the belief that expansion across the continent was justified'],
        ['the Oregon Trail', 'the overland route west used by settlers'],
        ['a homestead', 'land granted to a settler who farmed it'],
        ['displacement', 'the forced removal of Native American nations from their lands'],
        ['the Trail of Tears', 'the forced removal of the Cherokee and other nations'],
        ['a treaty', 'an agreement between governments, many of them broken'],
        ['slavery', 'the system of forced, unpaid labour that the southern economy relied on'],
        ['an abolitionist', 'someone who campaigned to end slavery'],
        ['Frederick Douglass', 'the formerly enslaved writer and campaigner'],
        ['Harriet Tubman', 'the conductor on the Underground Railroad'],
        ['the Underground Railroad', 'the network that helped enslaved people escape'],
        ['the Civil War', 'the 1861–65 war between the Union and the Confederacy'],
        ['the Union', 'the northern states'],
        ['the Confederacy', 'the southern states that seceded'],
        ['secession', 'the act of leaving the United States'],
        ['the Emancipation Proclamation', 'the 1863 order declaring enslaved people in rebel states free'],
        ['Reconstruction', 'the period of rebuilding and reform after the war'],
        ['the Thirteenth Amendment', 'the amendment that abolished slavery'],
        ['segregation', 'the legal separation of people by race that followed'],
        ['industrialisation', 'the growth of factories and railways after the war']
      ],
      truths: [
        'The Thirteenth Amendment abolished slavery; the Emancipation Proclamation had applied only to rebel states.',
        'Westward expansion depended on displacing Native American nations from their lands.',
        'Reconstruction was followed by decades of legal segregation.',
        'The Underground Railroad was a network of people and safe houses, not a railway.',
        'Many treaties with Native American nations were broken by the United States government.'
      ],
      myths: [
        'The Emancipation Proclamation freed every enslaved person immediately.',
        'The Underground Railroad was an actual railway running underground.',
        'The land settlers moved onto was empty.',
        'Slavery ended and equality followed at once.',
        'The Civil War was fought over states’ rights with no connection to slavery.'
      ],
      applications: [
        ['A network of safe houses helps people escape north. What is it?', 'the Underground Railroad'],
        ['Southern states leave the Union in 1861. What is that act?', 'secession'],
        ['An amendment ends slavery throughout the country. Which one?', 'the Thirteenth Amendment'],
        ['Cherokee families are forced west, and thousands die. What is this called?', 'the Trail of Tears'],
        ['A campaigner writes and speaks to end slavery. What are they?', 'an abolitionist']
      ]
    }
  ],

  statistics: [
    {
      name: 'Spread, Distributions and Standard Deviation', from: 'Grade 10', to: 'College',
      facts: [
        ['the mean', 'the total divided by how many values there are'],
        ['the median', 'the middle value in order'],
        ['the mode', 'the most common value'],
        ['the range', 'the largest value minus the smallest'],
        ['the interquartile range', 'the spread of the middle half of the data'],
        ['a quartile', 'a value splitting ordered data into quarters'],
        ['standard deviation', 'a measure of how far values typically sit from the mean'],
        ['variance', 'the square of the standard deviation'],
        ['a deviation', 'the difference between one value and the mean'],
        ['a box plot', 'the diagram showing median, quartiles and extremes'],
        ['a normal distribution', 'the symmetric bell-shaped spread many measurements follow'],
        ['a skewed distribution', 'a spread with a longer tail on one side'],
        ['an outlier', 'a value far away from the rest'],
        ['a cumulative frequency graph', 'the graph used to estimate the median and quartiles'],
        ['a histogram', 'the chart for continuous grouped data, with touching bars'],
        ['frequency density', 'frequency divided by class width, plotted on a histogram'],
        ['a sample', 'the group actually measured'],
        ['a population', 'the whole group being studied'],
        ['sampling', 'choosing the group to measure'],
        ['a stratified sample', 'a sample taking proportional numbers from each group'],
        ['spread', 'how widely the values are scattered'],
        ['a measure of central tendency', 'an average: mean, median or mode']
      ],
      truths: [
        'Standard deviation measures spread; the mean measures where the centre is.',
        'Two data sets can share a mean and have completely different spreads.',
        'The interquartile range ignores the extremes, so it is not distorted by outliers.',
        'On a histogram it is the area of a bar, not its height, that shows frequency.',
        'A stratified sample takes numbers from each group in proportion to its size.',
        'In a normal distribution about two thirds of values lie within one standard deviation of the mean.'
      ],
      myths: [
        'A larger mean always means a larger spread.',
        'Standard deviation and the range measure the same thing.',
        'On a histogram the height of a bar gives the frequency.',
        'The interquartile range is affected by outliers as much as the range is.',
        'Every set of measurements follows a normal distribution.',
        'A bigger sample is automatically a better sample.'
      ],
      applications: [
        ['Two classes have the same average mark but very different results. What differs?', 'standard deviation'],
        ['A single very high value pulls the average up. What is that value?', 'an outlier'],
        ['A sample takes 30% from a group that is 30% of the population. What kind of sample?', 'a stratified sample'],
        ['A chart of continuous data has bars of different widths. What is plotted vertically?', 'frequency density'],
        ['A diagram shows the median, both quartiles and the extremes. What is it?', 'a box plot']
      ]
    }
  ],

  physics: [
    {
      name: 'Radioactivity and Nuclear Physics', from: 'Grade 10', to: 'College',
      figures: ['atom-carbon'],
      facts: [
        ['radioactivity', 'the random emission of radiation from unstable nuclei'],
        ['an unstable nucleus', 'a nucleus that decays because its particles are not balanced'],
        ['alpha radiation', 'a helium nucleus, stopped by paper'],
        ['beta radiation', 'a fast electron, stopped by a few millimetres of aluminium'],
        ['gamma radiation', 'an electromagnetic wave, reduced by thick lead'],
        ['ionising radiation', 'radiation with enough energy to knock electrons off atoms'],
        ['half-life', 'the time for half the unstable nuclei in a sample to decay'],
        ['activity', 'the number of decays per second, measured in becquerels'],
        ['a Geiger counter', 'the instrument that detects radiation'],
        ['background radiation', 'the low-level radiation always present around us'],
        ['a radioactive isotope', 'a form of an element with an unstable nucleus'],
        ['carbon dating', 'using the decay of carbon-14 to date organic remains'],
        ['contamination', 'radioactive material getting onto or into something'],
        ['irradiation', 'being exposed to radiation without becoming radioactive'],
        ['nuclear fission', 'splitting a large nucleus, releasing energy'],
        ['nuclear fusion', 'joining small nuclei, releasing energy'],
        ['a chain reaction', 'fission neutrons causing further fissions'],
        ['a control rod', 'the rod that absorbs neutrons to control a reactor'],
        ['a moderator', 'the material that slows neutrons in a reactor'],
        ['nuclear waste', 'the radioactive material left after fission'],
        ['a tracer', 'a radioactive substance used to follow a process in the body']
      ],
      truths: [
        'Radioactive decay is random: you cannot predict which nucleus decays next.',
        'Alpha is stopped by paper, beta by aluminium and gamma is reduced by lead.',
        'Irradiation does not make an object radioactive; contamination does.',
        'A half-life is the time for half the nuclei to decay, whatever the starting amount.',
        'The Sun is powered by fusion, not fission.',
        'Alpha is the most ionising and the least penetrating.'
      ],
      myths: [
        'An irradiated object becomes radioactive itself.',
        'Half-life means the sample is completely gone after two half-lives.',
        'Gamma radiation is the most ionising.',
        'Nuclear power stations run on fusion.',
        'Radioactive decay can be predicted for an individual nucleus.',
        'Background radiation is entirely man-made.'
      ],
      applications: [
        ['Radiation is stopped by a sheet of paper. Which kind is it?', 'alpha radiation'],
        ['A sample falls to a quarter of its activity in 40 years. What is the half-life?', 'half-life'],
        ['A patient is given a substance that can be tracked through the body. What is it?', 'a tracer'],
        ['Neutrons from one split nucleus cause further splits. What is this?', 'a chain reaction'],
        ['Radioactive dust settles on clothing. What has happened?', 'contamination']
      ]
    }
  ],

  grammar: [
    {
      name: 'Advanced Grammar and Mark Scheme Terms', from: 'Grade 5', to: 'College',
      facts: [
        ['a fronted adverbial', 'an adverbial phrase placed at the start, followed by a comma'],
        ['an adverbial', 'a word or phrase saying how, when or where'],
        ['the subjunctive', 'the form used for wishes and hypotheticals, as in "if I were"'],
        ['a relative clause', 'a clause beginning who, which or that, describing a noun'],
        ['a relative pronoun', 'who, which, that or whose, introducing a relative clause'],
        ['an embedded clause', 'a clause dropped into the middle of a sentence between commas'],
        ['a subordinate clause', 'a clause that cannot stand alone'],
        ['a main clause', 'a clause that makes sense on its own'],
        ['a modal verb', 'a verb such as could, should or must, showing possibility or obligation'],
        ['a determiner', 'a word before a noun, such as the, a or those'],
        ['an expanded noun phrase', 'a noun with words added to describe it'],
        ['the active voice', 'the form where the subject does the action'],
        ['the passive voice', 'the form where the subject receives the action'],
        ['a semicolon', 'the mark joining two closely related main clauses'],
        ['a colon', 'the mark introducing a list or an explanation'],
        ['parenthesis', 'an aside marked off by brackets, dashes or commas'],
        ['a dash', 'the mark used to set off an aside sharply'],
        ['cohesion', 'the way sentences and paragraphs link together'],
        ['a synonym', 'a word with nearly the same meaning'],
        ['an antonym', 'a word with the opposite meaning'],
        ['formality', 'how formal the language of a piece is']
      ],
      truths: [
        'A fronted adverbial goes at the start of a sentence and is followed by a comma.',
        'The subjunctive gives "If I were you", not "If I was you", in formal writing.',
        'A relative clause begins with a relative pronoun and describes a noun.',
        'An embedded clause sits inside a sentence, marked off at both ends.',
        'The passive voice moves the doer out of the subject position and can drop it entirely.',
        'A semicolon joins two main clauses; a colon introduces what follows.'
      ],
      myths: [
        'A fronted adverbial is any word at the start of a sentence.',
        'The subjunctive is an old form no longer used in English.',
        'A relative clause can stand on its own as a sentence.',
        'The passive voice is a grammatical error.',
        'A semicolon and a colon do the same job.',
        'Any phrase in brackets is a subordinate clause.'
      ],
      applications: [
        ['"Later that evening, the lights went out." What is the opening phrase?', 'a fronted adverbial'],
        ['"If I were in charge, things would change." Which form is "were"?', 'the subjunctive'],
        ['"The book, which was torn, lay open." What is the middle part?', 'an embedded clause'],
        ['"The window was broken." The doer is not named. Which voice?', 'the passive voice'],
        ['"You must finish this." Which kind of verb is "must"?', 'a modal verb']
      ]
    }
  ]
};
