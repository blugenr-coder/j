/* Modern-language micro-units.
   A language course is organised by theme — greetings, family, food, travel —
   and each theme is a closed vocabulary set, which is exactly the shape this
   engine wants. Marked `kind: 'lexicon'` so the question wording asks "how do
   you say…" rather than "which term matches this description". */

const lex = (name, from, to, lang, facts, truths, myths) =>
  ({ name, from, to, kind: 'lexicon', lang, facts, truths, myths });

export const LANGUAGE_UNITS = {
  /* ================================ SPANISH ================================ */
  spanish: [
    lex('Greetings and Introductions', 'Grade 4', 'College', 'Spanish', [
      ['hola', 'hello'], ['buenos días', 'good morning'], ['buenas tardes', 'good afternoon'],
      ['buenas noches', 'good evening'], ['adiós', 'goodbye'], ['hasta luego', 'see you later'],
      ['¿cómo estás?', 'how are you?'], ['bien, gracias', 'well, thank you'],
      ['me llamo…', 'my name is…'], ['¿cómo te llamas?', 'what is your name?'],
      ['mucho gusto', 'pleased to meet you'], ['por favor', 'please'],
      ['gracias', 'thank you'], ['de nada', 'you’re welcome'],
      ['perdón', 'sorry / excuse me'], ['¿de dónde eres?', 'where are you from?']
    ], [
      'Spanish has both a formal and an informal way of saying “you”.',
      'Questions in Spanish are written with an opening inverted question mark.',
      '“Buenas noches” is used both as a greeting and as a farewell at night.',
      'Nouns and adjectives in Spanish carry grammatical gender.'
    ], [
      'Spanish uses only one word for “you” in all situations.',
      'Spanish questions never use punctuation at the start.',
      '“Mucho gusto” means “good luck”.',
      'Spanish adjectives never change their ending.'
    ]),
    lex('Family and People', 'Grade 4', 'College', 'Spanish', [
      ['la madre', 'the mother'], ['el padre', 'the father'], ['la hermana', 'the sister'],
      ['el hermano', 'the brother'], ['la abuela', 'the grandmother'], ['el abuelo', 'the grandfather'],
      ['la hija', 'the daughter'], ['el hijo', 'the son'], ['la tía', 'the aunt'], ['el tío', 'the uncle'],
      ['el primo', 'the male cousin'], ['la esposa', 'the wife'], ['el amigo', 'the male friend'],
      ['la familia', 'the family'], ['los padres', 'the parents'], ['el niño', 'the boy / child']
    ], [
      'Masculine nouns in Spanish usually take “el” and feminine nouns “la”.',
      '“Los padres” can mean “the parents”, not only “the fathers”.',
      'Adding -a often makes a family word feminine, as in hermano and hermana.',
      'Spanish plural articles are “los” and “las”.'
    ], [
      'Every Spanish noun takes the article “el”.',
      '“Los padres” can only mean a group of fathers.',
      'Spanish family words have no gendered forms.',
      'The plural article in Spanish is always “los”.'
    ]),
    lex('Numbers, Dates and Time', 'Grade 4', 'College', 'Spanish', [
      ['uno', 'one'], ['dos', 'two'], ['tres', 'three'], ['cuatro', 'four'], ['cinco', 'five'],
      ['diez', 'ten'], ['veinte', 'twenty'], ['cien', 'one hundred'],
      ['lunes', 'Monday'], ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday'],
      ['enero', 'January'], ['julio', 'July'], ['hoy', 'today'], ['mañana', 'tomorrow']
    ], [
      'Days of the week are not capitalised in Spanish.',
      'Months are not capitalised in Spanish either.',
      '“Mañana” means both “tomorrow” and “morning”.',
      'Spanish uses “y” between tens and units, as in treinta y uno.'
    ], [
      'Days of the week are capitalised in Spanish as in English.',
      '“Mañana” only ever means “morning”.',
      'Spanish numbers above twenty are always written as one word.',
      'Months in Spanish take a capital letter.'
    ]),
    lex('Food and Drink', 'Grade 5', 'College', 'Spanish', [
      ['el pan', 'the bread'], ['la leche', 'the milk'], ['el queso', 'the cheese'],
      ['la carne', 'the meat'], ['el pescado', 'the fish'], ['el pollo', 'the chicken'],
      ['la manzana', 'the apple'], ['la naranja', 'the orange'], ['el agua', 'the water'],
      ['el arroz', 'the rice'], ['la sopa', 'the soup'], ['el huevo', 'the egg'],
      ['la ensalada', 'the salad'], ['el desayuno', 'the breakfast'], ['la cena', 'the dinner'],
      ['tengo hambre', 'I am hungry']
    ], [
      'In Spanish you say “tengo hambre”, literally “I have hunger”.',
      '“El agua” takes a masculine article despite being a feminine noun.',
      '“La cena” is the evening meal.',
      'Ordering politely uses “quisiera”, meaning “I would like”.'
    ], [
      '“Tengo hambre” translates word for word as “I am hungry”.',
      '“La cena” means breakfast.',
      'Every Spanish noun beginning with a takes “la”.',
      '“Quisiera” means “I must have”.'
    ]),
    lex('School and Classroom', 'Grade 5', 'College', 'Spanish', [
      ['la escuela', 'the school'], ['el profesor', 'the male teacher'], ['la clase', 'the class'],
      ['el libro', 'the book'], ['el cuaderno', 'the notebook'], ['el bolígrafo', 'the pen'],
      ['el lápiz', 'the pencil'], ['la mochila', 'the backpack'], ['la pizarra', 'the board'],
      ['el examen', 'the exam'], ['los deberes', 'the homework'], ['la biblioteca', 'the library'],
      ['las matemáticas', 'mathematics'], ['la historia', 'history'], ['el recreo', 'break time'],
      ['aprender', 'to learn']
    ], [
      '“Los deberes” is used in the plural for homework.',
      '“La historia” means both history and story.',
      'Spanish school subjects are written without capitals.',
      '“Aprender” is a regular -er verb.'
    ], [
      '“Los deberes” is a singular noun in Spanish.',
      'Spanish subject names are capitalised.',
      '“La historia” can only mean history.',
      '“Aprender” is an irregular verb.'
    ]),
    lex('Colours, Clothes and Description', 'Grade 5', 'College', 'Spanish', [
      ['rojo', 'red'], ['azul', 'blue'], ['verde', 'green'], ['amarillo', 'yellow'],
      ['negro', 'black'], ['blanco', 'white'], ['la camisa', 'the shirt'],
      ['los pantalones', 'the trousers'], ['el vestido', 'the dress'], ['los zapatos', 'the shoes'],
      ['el abrigo', 'the coat'], ['alto', 'tall'], ['bajo', 'short'], ['grande', 'big'],
      ['pequeño', 'small'], ['llevar', 'to wear']
    ], [
      'Spanish adjectives usually come after the noun they describe.',
      'Adjectives change ending to agree with gender and number.',
      '“Azul” has the same form for masculine and feminine.',
      '“Llevar” means both to wear and to carry.'
    ], [
      'Spanish adjectives always come before the noun.',
      'Adjectives in Spanish never change their ending.',
      '“Llevar” only means “to carry”.',
      'Colour words are the only adjectives that agree with the noun.'
    ]),
    lex('Common Verbs and Everyday Phrases', 'Grade 6', 'College', 'Spanish', [
      ['ser', 'to be (permanent)'], ['estar', 'to be (state or place)'], ['tener', 'to have'],
      ['ir', 'to go'], ['hacer', 'to do or make'], ['querer', 'to want'], ['poder', 'to be able to'],
      ['hablar', 'to speak'], ['comer', 'to eat'], ['vivir', 'to live'], ['saber', 'to know a fact'],
      ['conocer', 'to know a person or place'], ['no entiendo', 'I don’t understand'],
      ['¿puedes repetir?', 'can you repeat?'], ['¿qué significa?', 'what does it mean?'],
      ['lo siento', 'I’m sorry']
    ], [
      'Spanish has two verbs for “to be”: ser and estar.',
      '“Saber” is used for facts and “conocer” for people and places.',
      'Regular Spanish verbs end in -ar, -er or -ir.',
      'The subject pronoun is often left out because the ending shows who is speaking.'
    ], [
      'Spanish has a single verb meaning “to be”.',
      '“Saber” and “conocer” are interchangeable.',
      'The subject pronoun must always be stated in Spanish.',
      'All Spanish verbs end in -ar.'
    ]),
    lex('Travel and Directions', 'Grade 6', 'College', 'Spanish', [
      ['la estación', 'the station'], ['el aeropuerto', 'the airport'], ['el billete', 'the ticket'],
      ['el tren', 'the train'], ['el autobús', 'the bus'], ['la calle', 'the street'],
      ['a la derecha', 'to the right'], ['a la izquierda', 'to the left'], ['todo recto', 'straight on'],
      ['¿dónde está…?', 'where is…?'], ['cerca', 'near'], ['lejos', 'far'],
      ['el hotel', 'the hotel'], ['la playa', 'the beach'], ['el mapa', 'the map'],
      ['perdido', 'lost']
    ], [
      '“El mapa” is masculine despite ending in -a.',
      '“¿Dónde está?” asks where something is located.',
      'Direction phrases such as “a la derecha” use the feminine article.',
      'Spanish uses “estar” rather than “ser” for location.'
    ], [
      'Every Spanish word ending in -a is feminine.',
      'Spanish uses “ser” to say where something is located.',
      '“Todo recto” means “turn around”.',
      '“Cerca” means far away.'
    ])
  ],

  /* ================================ FRENCH ================================ */
  french: [
    lex('Greetings and Introductions', 'Grade 4', 'College', 'French', [
      ['bonjour', 'hello / good morning'], ['bonsoir', 'good evening'], ['salut', 'hi'],
      ['au revoir', 'goodbye'], ['à bientôt', 'see you soon'], ['comment ça va ?', 'how are you?'],
      ['ça va bien', 'I’m fine'], ['je m’appelle…', 'my name is…'],
      ['comment tu t’appelles ?', 'what is your name?'], ['enchanté', 'pleased to meet you'],
      ['s’il vous plaît', 'please (formal)'], ['merci', 'thank you'], ['de rien', 'you’re welcome'],
      ['pardon', 'sorry / excuse me'], ['oui', 'yes'], ['non', 'no']
    ], [
      'French distinguishes “tu” for friends from “vous” for formality or plurals.',
      '“Bonsoir” replaces “bonjour” in the evening.',
      'A space is placed before a question mark in French typography.',
      'French nouns are either masculine or feminine.'
    ], [
      'French has only one word for “you”.',
      '“Bonjour” is used at all hours including late evening.',
      'French nouns have no grammatical gender.',
      '“De rien” means “nothing to do”.'
    ]),
    lex('Family and People', 'Grade 4', 'College', 'French', [
      ['la mère', 'the mother'], ['le père', 'the father'], ['la sœur', 'the sister'],
      ['le frère', 'the brother'], ['la grand-mère', 'the grandmother'], ['le grand-père', 'the grandfather'],
      ['la fille', 'the daughter / girl'], ['le fils', 'the son'], ['la tante', 'the aunt'],
      ['l’oncle', 'the uncle'], ['le cousin', 'the male cousin'], ['la famille', 'the family'],
      ['les parents', 'the parents'], ['l’ami', 'the friend'], ['le mari', 'the husband'],
      ['l’enfant', 'the child']
    ], [
      'French uses “le” for masculine and “la” for feminine nouns.',
      '“L’” replaces le or la before a vowel sound.',
      '“La fille” means both daughter and girl.',
      'The plural article in French is “les”.'
    ], [
      'French nouns all take the article “le”.',
      '“L’” is used before every noun regardless of its first letter.',
      '“La fille” can only mean “girl”.',
      'French has no plural definite article.'
    ]),
    lex('Numbers, Dates and Time', 'Grade 4', 'College', 'French', [
      ['un', 'one'], ['deux', 'two'], ['trois', 'three'], ['quatre', 'four'], ['cinq', 'five'],
      ['dix', 'ten'], ['vingt', 'twenty'], ['cent', 'one hundred'],
      ['lundi', 'Monday'], ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday'],
      ['janvier', 'January'], ['juillet', 'July'], ['aujourd’hui', 'today'], ['demain', 'tomorrow']
    ], [
      'Days and months are written without a capital letter in French.',
      'French counts seventy as “soixante-dix”, literally sixty-ten.',
      '“Aujourd’hui” means today.',
      'The French week begins on Monday, “lundi”.'
    ], [
      'French days of the week are capitalised.',
      'French has a single distinct word for seventy with no compound.',
      '“Demain” means yesterday.',
      'French months take a capital letter.'
    ]),
    lex('Food and Drink', 'Grade 5', 'College', 'French', [
      ['le pain', 'the bread'], ['le fromage', 'the cheese'], ['le lait', 'the milk'],
      ['la viande', 'the meat'], ['le poisson', 'the fish'], ['le poulet', 'the chicken'],
      ['la pomme', 'the apple'], ['l’eau', 'the water'], ['le riz', 'the rice'],
      ['la soupe', 'the soup'], ['l’œuf', 'the egg'], ['la salade', 'the salad'],
      ['le petit-déjeuner', 'the breakfast'], ['le dîner', 'the dinner'], ['j’ai faim', 'I am hungry'],
      ['l’addition', 'the bill']
    ], [
      'French says “j’ai faim”, literally “I have hunger”.',
      '“Le petit-déjeuner” is the first meal of the day.',
      '“L’addition” is what you ask for at the end of a meal.',
      'Partitive articles du, de la and des mean “some”.'
    ], [
      '“J’ai faim” translates word for word as “I am hungry”.',
      '“Le dîner” means breakfast.',
      'French has no word for “some” before a noun.',
      '“L’addition” means the menu.'
    ]),
    lex('School and Classroom', 'Grade 5', 'College', 'French', [
      ['l’école', 'the school'], ['le professeur', 'the teacher'], ['la classe', 'the class'],
      ['le livre', 'the book'], ['le cahier', 'the exercise book'], ['le stylo', 'the pen'],
      ['le crayon', 'the pencil'], ['le sac à dos', 'the backpack'], ['le tableau', 'the board'],
      ['l’examen', 'the exam'], ['les devoirs', 'the homework'], ['la bibliothèque', 'the library'],
      ['les mathématiques', 'mathematics'], ['l’histoire', 'history'], ['la récréation', 'break time'],
      ['apprendre', 'to learn']
    ], [
      '“Les devoirs” is plural in French for homework.',
      '“L’histoire” means both history and story.',
      'French school subjects are not capitalised.',
      '“Apprendre” is an irregular verb.'
    ], [
      '“Les devoirs” is a singular noun.',
      'French subject names take capital letters.',
      '“La bibliothèque” means bookshop.',
      '“Apprendre” follows the regular -re pattern exactly.'
    ]),
    lex('Colours, Clothes and Description', 'Grade 5', 'College', 'French', [
      ['rouge', 'red'], ['bleu', 'blue'], ['vert', 'green'], ['jaune', 'yellow'],
      ['noir', 'black'], ['blanc', 'white'], ['la chemise', 'the shirt'],
      ['le pantalon', 'the trousers'], ['la robe', 'the dress'], ['les chaussures', 'the shoes'],
      ['le manteau', 'the coat'], ['grand', 'tall / big'], ['petit', 'small'],
      ['joli', 'pretty'], ['porter', 'to wear'], ['nouveau', 'new']
    ], [
      'Most French adjectives follow the noun, but a small group comes before it.',
      'Adjectives agree in gender and number with the noun.',
      '“Le pantalon” is singular in French although trousers is plural in English.',
      '“Porter” means both to wear and to carry.'
    ], [
      'All French adjectives come before the noun.',
      'French adjectives never change form.',
      '“Le pantalon” is a plural noun in French.',
      '“Porter” only means “to carry”.'
    ]),
    lex('Travel and Directions', 'Grade 6', 'College', 'French', [
      ['la gare', 'the railway station'], ['l’aéroport', 'the airport'], ['le billet', 'the ticket'],
      ['le train', 'the train'], ['l’autobus', 'the bus'], ['la rue', 'the street'],
      ['à droite', 'to the right'], ['à gauche', 'to the left'], ['tout droit', 'straight on'],
      ['où est… ?', 'where is…?'], ['près de', 'near to'], ['loin de', 'far from'],
      ['l’hôtel', 'the hotel'], ['la plage', 'the beach'], ['la carte', 'the map'],
      ['perdu', 'lost']
    ], [
      '“Tout droit” means straight on, not “to the right”.',
      '“La gare” is a railway station, not a garage.',
      '“Où est…?” asks where something is.',
      'French uses “à” for direction in these phrases.'
    ], [
      '“Tout droit” means turn right.',
      '“La gare” means a car park.',
      '“Près de” means far from.',
      '“La carte” can never mean a map.'
    ])
  ],

  /* ================================= GERMAN ================================= */
  german: [
    lex('Greetings and Introductions', 'Grade 5', 'College', 'German', [
      ['hallo', 'hello'], ['guten Morgen', 'good morning'], ['guten Tag', 'good day'],
      ['guten Abend', 'good evening'], ['auf Wiedersehen', 'goodbye'], ['tschüss', 'bye'],
      ['wie geht’s?', 'how are you?'], ['mir geht’s gut', 'I’m well'],
      ['ich heiße…', 'my name is…'], ['wie heißt du?', 'what is your name?'],
      ['freut mich', 'pleased to meet you'], ['bitte', 'please / you’re welcome'],
      ['danke', 'thank you'], ['entschuldigung', 'excuse me'], ['ja', 'yes'], ['nein', 'no']
    ], [
      'All German nouns are written with a capital letter.',
      'German has three genders: der, die and das.',
      '“Bitte” means both “please” and “you’re welcome”.',
      'German distinguishes informal “du” from formal “Sie”.'
    ], [
      'German capitalises only proper nouns, as English does.',
      'German has two genders like French.',
      '“Bitte” only ever means “please”.',
      'German has one word for “you” in every situation.'
    ]),
    lex('Family and People', 'Grade 5', 'College', 'German', [
      ['die Mutter', 'the mother'], ['der Vater', 'the father'], ['die Schwester', 'the sister'],
      ['der Bruder', 'the brother'], ['die Großmutter', 'the grandmother'], ['der Großvater', 'the grandfather'],
      ['die Tochter', 'the daughter'], ['der Sohn', 'the son'], ['die Tante', 'the aunt'],
      ['der Onkel', 'the uncle'], ['die Familie', 'the family'], ['die Eltern', 'the parents'],
      ['der Freund', 'the male friend'], ['das Kind', 'the child'], ['die Frau', 'the woman / wife'],
      ['der Mann', 'the man / husband']
    ], [
      'German uses der, die and das for masculine, feminine and neuter nouns.',
      '“Das Kind” is neuter regardless of the child’s gender.',
      '“Die Eltern” is a plural noun meaning parents.',
      'German nouns always take a capital letter.'
    ], [
      'German has only masculine and feminine nouns.',
      '“Das Kind” changes gender depending on the child.',
      'German nouns are capitalised only at the start of a sentence.',
      '“Die Eltern” is singular.'
    ]),
    lex('Numbers, Dates and Time', 'Grade 5', 'College', 'German', [
      ['eins', 'one'], ['zwei', 'two'], ['drei', 'three'], ['vier', 'four'], ['fünf', 'five'],
      ['zehn', 'ten'], ['zwanzig', 'twenty'], ['hundert', 'one hundred'],
      ['Montag', 'Monday'], ['Freitag', 'Friday'], ['Samstag', 'Saturday'], ['Sonntag', 'Sunday'],
      ['Januar', 'January'], ['Juli', 'July'], ['heute', 'today'], ['morgen', 'tomorrow']
    ], [
      'German says units before tens: einundzwanzig is “one-and-twenty”.',
      'Days and months are capitalised in German because they are nouns.',
      '“Morgen” means tomorrow; “der Morgen” means the morning.',
      'German uses a 24-hour clock in timetables and formal contexts.'
    ], [
      'German says tens before units exactly as English does.',
      'German days of the week are written in lower case.',
      '“Heute” means tomorrow.',
      'German never uses the 24-hour clock.'
    ]),
    lex('Food and Drink', 'Grade 6', 'College', 'German', [
      ['das Brot', 'the bread'], ['der Käse', 'the cheese'], ['die Milch', 'the milk'],
      ['das Fleisch', 'the meat'], ['der Fisch', 'the fish'], ['das Hähnchen', 'the chicken'],
      ['der Apfel', 'the apple'], ['das Wasser', 'the water'], ['der Reis', 'the rice'],
      ['die Suppe', 'the soup'], ['das Ei', 'the egg'], ['der Salat', 'the salad'],
      ['das Frühstück', 'the breakfast'], ['das Abendessen', 'the dinner'],
      ['ich habe Hunger', 'I am hungry'], ['die Rechnung', 'the bill']
    ], [
      'German says “ich habe Hunger”, literally “I have hunger”.',
      '“Das Frühstück” is the morning meal.',
      'German compound nouns join words together into one long noun.',
      '“Die Rechnung” is what you ask for to pay.'
    ], [
      '“Ich habe Hunger” translates word for word as “I am hungry”.',
      '“Das Abendessen” means breakfast.',
      'German never joins nouns together into compounds.',
      '“Die Rechnung” means the recipe.'
    ]),
    lex('School and Classroom', 'Grade 6', 'College', 'German', [
      ['die Schule', 'the school'], ['der Lehrer', 'the male teacher'], ['die Klasse', 'the class'],
      ['das Buch', 'the book'], ['das Heft', 'the exercise book'], ['der Kugelschreiber', 'the pen'],
      ['der Bleistift', 'the pencil'], ['der Rucksack', 'the backpack'], ['die Tafel', 'the board'],
      ['die Prüfung', 'the exam'], ['die Hausaufgaben', 'the homework'],
      ['die Bibliothek', 'the library'], ['die Mathematik', 'mathematics'],
      ['die Geschichte', 'history'], ['die Pause', 'the break'], ['lernen', 'to learn']
    ], [
      '“Die Hausaufgaben” is plural, literally “house tasks”.',
      '“Die Geschichte” means both history and story.',
      '“Der Rucksack” has been borrowed into English unchanged.',
      'German verbs in the infinitive usually end in -en.'
    ], [
      '“Die Hausaufgaben” is a singular noun.',
      '“Die Geschichte” can only mean history.',
      'German infinitives end in -ar.',
      '“Die Tafel” means the table.'
    ]),
    lex('Colours, Clothes and Description', 'Grade 6', 'College', 'German', [
      ['rot', 'red'], ['blau', 'blue'], ['grün', 'green'], ['gelb', 'yellow'],
      ['schwarz', 'black'], ['weiß', 'white'], ['das Hemd', 'the shirt'],
      ['die Hose', 'the trousers'], ['das Kleid', 'the dress'], ['die Schuhe', 'the shoes'],
      ['der Mantel', 'the coat'], ['groß', 'big / tall'], ['klein', 'small'],
      ['neu', 'new'], ['alt', 'old'], ['tragen', 'to wear']
    ], [
      'German adjectives before a noun take endings that depend on case and gender.',
      '“Die Hose” is singular in German although trousers is plural in English.',
      '“Tragen” means both to wear and to carry.',
      'Adjectives used after “ist” take no ending.'
    ], [
      'German adjectives never take endings.',
      '“Die Hose” is a plural noun in German.',
      '“Tragen” only means “to carry”.',
      'Adjectives after “ist” always take an -e ending.'
    ]),
    lex('Travel and Directions', 'Grade 7', 'College', 'German', [
      ['der Bahnhof', 'the railway station'], ['der Flughafen', 'the airport'],
      ['die Fahrkarte', 'the ticket'], ['der Zug', 'the train'], ['der Bus', 'the bus'],
      ['die Straße', 'the street'], ['rechts', 'right'], ['links', 'left'],
      ['geradeaus', 'straight on'], ['wo ist… ?', 'where is…?'], ['in der Nähe', 'nearby'],
      ['weit', 'far'], ['das Hotel', 'the hotel'], ['der Strand', 'the beach'],
      ['die Karte', 'the map'], ['verloren', 'lost']
    ], [
      '“Geradeaus” means straight ahead.',
      '“Der Bahnhof” is a railway station.',
      'German uses the letter ß in words such as Straße.',
      '“Wo ist…?” asks where something is.'
    ], [
      '“Geradeaus” means turn left.',
      '“Der Bahnhof” means the harbour.',
      'German has no letter ß.',
      '“Weit” means nearby.'
    ])
  ],

  /* ================================== ESL ================================== */
  esl: [
    {
      name: 'Everyday English Phrases', from: 'Grade 4', to: 'College',
      facts: [
        ['How do you do?', 'a formal greeting on first meeting'],
        ['See you later', 'an informal goodbye'],
        ['Excuse me', 'a polite way to get attention or apologise'],
        ['I beg your pardon', 'a formal way to ask for repetition'],
        ['Could you repeat that?', 'a request to hear something again'],
        ['I’d like…', 'a polite way to order or request'],
        ['Do you mind if…?', 'a polite way to ask permission'],
        ['Never mind', 'it does not matter'],
        ['Hang on', 'wait a moment'],
        ['I’m afraid…', 'a softening phrase before bad news'],
        ['By the way', 'introducing a side remark'],
        ['As far as I know', 'to the extent of my information'],
        ['On second thoughts', 'having reconsidered'],
        ['To be honest', 'introducing a frank opinion']
      ],
      truths: [
        '“I’m afraid” softens bad news and has nothing to do with fear.',
        '“Never mind” tells someone not to worry about something.',
        'Politeness in English often comes from indirect phrasing.',
        '“Do you mind if…” asks for permission, and “no” means yes.'
      ],
      myths: [
        '“I’m afraid” always expresses fear.',
        '“Never mind” is a way of expressing anger.',
        'Direct commands are the most polite form of request in English.',
        'Answering “yes” to “Do you mind?” gives permission.'
      ]
    },
    {
      name: 'Question Forms and Answers', from: 'Grade 4', to: 'College',
      facts: [
        ['who', 'asks about a person'],
        ['what', 'asks about a thing'],
        ['where', 'asks about a place'],
        ['when', 'asks about a time'],
        ['why', 'asks about a reason'],
        ['how', 'asks about a manner or method'],
        ['how much', 'asks about an uncountable quantity'],
        ['how many', 'asks about a countable quantity'],
        ['question tag', 'a short question added to the end of a statement'],
        ['do/does', 'the auxiliary used to form present simple questions'],
        ['did', 'the auxiliary used to form past simple questions'],
        ['inversion', 'swapping subject and auxiliary to make a question'],
        ['short answer', 'a reply such as “Yes, I do”'],
        ['indirect question', 'a polite question embedded in another sentence']
      ],
      truths: [
        '“How many” is used with countable nouns and “how much” with uncountable ones.',
        'Present simple questions use do or does before the subject.',
        'Indirect questions keep normal statement word order.',
        'A question tag reverses the polarity of the statement.'
      ],
      myths: [
        '“How much” is used with countable nouns.',
        'English questions never need an auxiliary verb.',
        'Indirect questions use the same inverted order as direct ones.',
        'A question tag repeats the polarity of the statement.'
      ]
    },
    {
      name: 'Prepositions and Common Errors', from: 'Grade 5', to: 'College',
      facts: [
        ['in', 'used for enclosed spaces, months and years'],
        ['on', 'used for surfaces, days and dates'],
        ['at', 'used for points in space and clock times'],
        ['since', 'used with a point in time'],
        ['for', 'used with a length of time'],
        ['by', 'not later than a given time'],
        ['until', 'up to a given time'],
        ['during', 'throughout a period'],
        ['between', 'in the space separating two things'],
        ['among', 'surrounded by three or more'],
        ['depend on', 'the fixed preposition after depend'],
        ['interested in', 'the fixed preposition after interested'],
        ['good at', 'the fixed preposition after good'],
        ['arrive at / in', 'used with a place, never “arrive to”']
      ],
      truths: [
        '“At” is used with clock times and “on” with days.',
        '“Since” marks a point in time; “for” marks a length of time.',
        'You arrive at a building but arrive in a city.',
        'Many prepositions are fixed by the word before them and must be learned.'
      ],
      myths: [
        '“Since” and “for” are interchangeable.',
        'You can say “arrive to” a place in standard English.',
        'Prepositions can always be worked out logically.',
        '“At” is used with days of the week.'
      ]
    },
    {
      name: 'Listening and Speaking Strategies', from: 'Grade 5', to: 'College',
      facts: [
        ['gist listening', 'listening for the general idea rather than every word'],
        ['detail listening', 'listening for one specific piece of information'],
        ['clarification', 'asking someone to explain what they meant'],
        ['paraphrase check', 'repeating back to confirm you understood'],
        ['filler', 'a sound or phrase used while thinking, such as “well”'],
        ['stress', 'the emphasis placed on a syllable or word'],
        ['intonation', 'the rise and fall of the voice'],
        ['minimal pair', 'two words differing in one sound, such as ship and sheep'],
        ['connected speech', 'the way words run together in natural talk'],
        ['turn-taking', 'the way speakers hand the conversation back and forth'],
        ['register', 'the level of formality chosen for a situation'],
        ['circumlocution', 'describing around a word you cannot recall'],
        ['active listening', 'showing attention through response and question'],
        ['accent', 'the way pronunciation varies between speakers and regions']
      ],
      truths: [
        'You do not need to understand every word to follow the gist.',
        'Rising intonation at the end often signals a question.',
        'Describing around a missing word keeps a conversation going.',
        'Connected speech is why natural talk sounds faster than it is.'
      ],
      myths: [
        'You must understand every word to understand a conversation.',
        'Intonation carries no meaning in English.',
        'Asking for clarification shows that you are a poor speaker.',
        'One accent is the only correct form of English.'
      ]
    }
  ]
};
