/* More language units.

   These are `kind: 'lexicon'` units, which the engine phrases differently:
   "How do you say “breakfast” in Spanish?" rather than "Which term matches
   this description?". `lang` names the language for those prompts.

   Vocabulary sets are grouped the way a course groups them — a topic per
   fortnight — and the grammar units cover the structures that are examined
   separately from vocabulary. The truths and myths are the errors an English
   speaker actually makes: gender guessed from the English noun, false friends,
   and word order carried over from English. */

export const LANG2_UNITS = {
  spanish: [
    {
      name: 'Spanish: Food and Eating Out', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'Spanish',
      facts: [
        ['el desayuno', 'breakfast'], ['el almuerzo', 'lunch'], ['la cena', 'dinner'],
        ['el pan', 'bread'], ['la leche', 'milk'], ['el queso', 'cheese'],
        ['la carne', 'meat'], ['el pescado', 'fish'], ['el pollo', 'chicken'],
        ['las verduras', 'vegetables'], ['la fruta', 'fruit'], ['el arroz', 'rice'],
        ['la sopa', 'soup'], ['el postre', 'dessert'], ['la cuenta', 'the bill'],
        ['el camarero', 'the waiter'], ['la carta', 'the menu'], ['tener hambre', 'to be hungry'],
        ['tener sed', 'to be thirsty'], ['probar', 'to try or taste'], ['pedir', 'to order'],
        ['delicioso', 'delicious'], ['picante', 'spicy'], ['la mesa', 'the table']
      ],
      truths: [
        'In Spanish you say you "have" hunger, not that you "are" hungry.',
        '"La carta" is the menu; "el menú" often means a set meal of the day.',
        'Nouns ending in -a are usually feminine, and nouns ending in -o usually masculine.',
        '"Pedir" means to order or ask for; "preguntar" means to ask a question.',
        'The bill is "la cuenta", and you normally have to ask for it.'
      ],
      myths: [
        'You say "soy hambre" to mean you are hungry.',
        '"La carta" means a letter and never the menu.',
        'Every Spanish noun ending in -a is feminine without exception.',
        '"Pedir" and "preguntar" are interchangeable.',
        'Spanish word order is always identical to English.'
      ]
    },
    {
      name: 'Spanish: Travel, Town and Directions', from: 'Grade 7', to: 'Grade 12',
      kind: 'lexicon', lang: 'Spanish',
      facts: [
        ['la estación', 'the station'], ['el aeropuerto', 'the airport'], ['el billete', 'the ticket'],
        ['el tren', 'the train'], ['el autobús', 'the bus'], ['el avión', 'the plane'],
        ['la calle', 'the street'], ['la plaza', 'the square'], ['el puente', 'the bridge'],
        ['la iglesia', 'the church'], ['el museo', 'the museum'], ['la tienda', 'the shop'],
        ['el mercado', 'the market'], ['el hotel', 'the hotel'], ['la llave', 'the key'],
        ['a la derecha', 'to the right'], ['a la izquierda', 'to the left'], ['todo recto', 'straight on'],
        ['cerca de', 'near to'], ['lejos de', 'far from'], ['enfrente de', 'opposite'],
        ['al lado de', 'next to'], ['perderse', 'to get lost'], ['el horario', 'the timetable']
      ],
      truths: [
        '"Derecha" means right as a direction; "derecho" can mean straight on.',
        '"El billete" is a ticket in Spain; "el boleto" is used in much of Latin America.',
        'Directions in Spanish commonly use "a la" before right and left.',
        '"Cerca de" needs the "de" before the place.',
        '"Perderse" is reflexive: you lose yourself.'
      ],
      myths: [
        '"Derecha" and "derecho" mean exactly the same thing.',
        'You can say "cerca la plaza" without "de".',
        'Every Spanish-speaking country uses the same word for a ticket.',
        '"Perderse" works without a reflexive pronoun.',
        '"Embarazada" means embarrassed.'
      ]
    },
    {
      name: 'Spanish Grammar: Present, Past and Ser vs Estar', from: 'Grade 7', to: 'College',
      kind: 'lexicon', lang: 'Spanish',
      facts: [
        ['ser', 'to be, for permanent or defining qualities'],
        ['estar', 'to be, for states, feelings and location'],
        ['hablar', 'to speak, a regular -ar verb'],
        ['comer', 'to eat, a regular -er verb'],
        ['vivir', 'to live, a regular -ir verb'],
        ['el pretérito', 'the past tense for completed actions'],
        ['el imperfecto', 'the past tense for descriptions and habits'],
        ['el presente', 'the present tense'],
        ['el futuro', 'the future tense'],
        ['un verbo irregular', 'a verb that does not follow the pattern'],
        ['tener', 'to have, irregular'],
        ['ir', 'to go, irregular'],
        ['hacer', 'to do or make, irregular'],
        ['el género', 'grammatical gender'],
        ['el artículo', 'the word for the or a'],
        ['el adjetivo', 'the adjective, which agrees with its noun'],
        ['la concordancia', 'agreement between words'],
        ['el pronombre', 'the pronoun'],
        ['reflexivo', 'reflexive, where the action returns to the subject'],
        ['la conjugación', 'the set of endings a verb takes']
      ],
      truths: [
        '"Ser" is used for defining qualities and "estar" for states and location.',
        '"Estoy cansado" means I am tired; "soy cansado" would say tiredness defines you.',
        'Spanish adjectives agree with the noun in gender and number.',
        'The preterite describes completed actions; the imperfect describes what used to happen.',
        'Regular verbs fall into three families: -ar, -er and -ir.'
      ],
      myths: [
        '"Ser" and "estar" can be used interchangeably.',
        'Spanish adjectives never change their ending.',
        'The preterite and the imperfect mean the same thing.',
        'Every Spanish verb follows one of the three regular patterns.',
        'Adjectives always come before the noun, as in English.'
      ]
    }
  ],

  french: [
    {
      name: 'French: House, Home and Daily Routine', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'French',
      facts: [
        ['la maison', 'the house'], ['l’appartement', 'the flat'], ['la chambre', 'the bedroom'],
        ['la cuisine', 'the kitchen'], ['la salle de bains', 'the bathroom'], ['le salon', 'the living room'],
        ['le jardin', 'the garden'], ['l’escalier', 'the stairs'], ['la fenêtre', 'the window'],
        ['la porte', 'the door'], ['le lit', 'the bed'], ['la table', 'the table'],
        ['se lever', 'to get up'], ['se laver', 'to wash oneself'], ['s’habiller', 'to get dressed'],
        ['se coucher', 'to go to bed'], ['prendre le petit déjeuner', 'to have breakfast'],
        ['ranger', 'to tidy'], ['faire la vaisselle', 'to do the washing up'],
        ['sortir la poubelle', 'to take the bin out'], ['tous les jours', 'every day'],
        ['d’habitude', 'usually'], ['le week-end', 'the weekend'], ['avant', 'before']
      ],
      truths: [
        'Reflexive verbs like "se lever" need a pronoun that changes with the subject.',
        '"La salle de bains" is the room with the bath, not the toilet.',
        'French uses "faire" for many chores where English uses "do" or "make".',
        'Adjectives in French usually follow the noun.',
        '"Le week-end" is borrowed from English and stays masculine.'
      ],
      myths: [
        'Reflexive pronouns stay the same for every subject.',
        'French adjectives always go before the noun as in English.',
        '"Journée" and "jour" are completely interchangeable.',
        'You can drop the reflexive pronoun if the meaning is obvious.',
        '"Librairie" means library.'
      ]
    },
    {
      name: 'French: School, Work and Future Plans', from: 'Grade 8', to: 'College',
      kind: 'lexicon', lang: 'French',
      facts: [
        ['le collège', 'lower secondary school'], ['le lycée', 'upper secondary school'],
        ['la matière', 'the school subject'], ['les maths', 'maths'], ['l’histoire', 'history'],
        ['les sciences', 'science'], ['le professeur', 'the teacher'], ['la salle de classe', 'the classroom'],
        ['les devoirs', 'homework'], ['l’emploi du temps', 'the timetable'], ['la récréation', 'break time'],
        ['la cantine', 'the canteen'], ['l’examen', 'the exam'], ['la note', 'the mark or grade'],
        ['réussir', 'to succeed or to pass'], ['échouer', 'to fail'], ['le stage', 'the work placement'],
        ['le métier', 'the trade or occupation'], ['le boulot', 'the job, informally'],
        ['gagner sa vie', 'to earn a living'], ['à l’avenir', 'in the future'],
        ['j’aimerais', 'I would like'], ['avoir l’intention de', 'to intend to']
      ],
      truths: [
        '"Le collège" is lower secondary, not a university.',
        '"La note" means the mark, not a written note.',
        '"Passer un examen" means to sit an exam, not to pass it.',
        '"Réussir" is the verb for passing an exam.',
        '"Le stage" is a work placement, not a stage in a theatre.'
      ],
      myths: [
        '"Le collège" means college in the English sense.',
        '"Passer un examen" means to pass an exam.',
        '"La note" always means a written note.',
        '"Le stage" refers to a theatre stage.',
        '"Assister à" means to assist someone.'
      ]
    },
    {
      name: 'French Grammar: Tenses and Agreement', from: 'Grade 8', to: 'College',
      kind: 'lexicon', lang: 'French',
      facts: [
        ['le présent', 'the present tense'],
        ['le passé composé', 'the past tense for completed actions'],
        ['l’imparfait', 'the past tense for description and habit'],
        ['le futur simple', 'the future tense'],
        ['le conditionnel', 'the form for would'],
        ['avoir', 'to have, the usual auxiliary'],
        ['être', 'to be, the auxiliary for movement and reflexive verbs'],
        ['le participe passé', 'the past participle'],
        ['l’accord', 'agreement of a participle or adjective'],
        ['un verbe régulier', 'a verb following the standard pattern'],
        ['un verbe irrégulier', 'a verb that does not'],
        ['le pronom', 'the pronoun'],
        ['la négation', 'the ne … pas construction'],
        ['le genre', 'grammatical gender'],
        ['le pluriel', 'the plural'],
        ['un adjectif', 'an adjective, which agrees with its noun'],
        ['un adverbe', 'an adverb, which does not agree'],
        ['la liaison', 'the sound linking a final consonant to a following vowel']
      ],
      truths: [
        'Most verbs form the passé composé with "avoir", but verbs of movement use "être".',
        'With "être", the past participle agrees with the subject.',
        'The imperfect describes what used to happen; the passé composé describes what happened once.',
        'French negation wraps the verb: "ne … pas".',
        'Adjectives agree in gender and number; adverbs do not change.'
      ],
      myths: [
        'Every verb forms the passé composé with "avoir".',
        'The past participle never changes its ending.',
        'The imperfect and the passé composé are interchangeable.',
        '"Pas" alone is enough to make a sentence negative in writing.',
        'Adverbs agree with the noun like adjectives.'
      ]
    }
  ],

  german: [
    {
      name: 'German: Free Time, Sport and Media', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'German',
      facts: [
        ['die Freizeit', 'free time'], ['der Sport', 'sport'], ['das Schwimmen', 'swimming'],
        ['der Fußball', 'football'], ['das Fahrrad', 'the bicycle'], ['die Musik', 'music'],
        ['das Buch', 'the book'], ['der Film', 'the film'], ['das Fernsehen', 'television'],
        ['die Zeitung', 'the newspaper'], ['das Handy', 'the mobile phone'], ['der Computer', 'the computer'],
        ['spielen', 'to play'], ['lesen', 'to read'], ['schwimmen', 'to swim'],
        ['fernsehen', 'to watch television'], ['treffen', 'to meet'], ['gern', 'gladly, used to say you like doing something'],
        ['lieber', 'preferably'], ['am liebsten', 'most of all'], ['jeden Tag', 'every day'],
        ['manchmal', 'sometimes'], ['nie', 'never'], ['oft', 'often']
      ],
      truths: [
        'German says "ich spiele gern Fußball" rather than using a verb for "to like".',
        'German nouns are always written with a capital letter.',
        '"Das Handy" means a mobile phone, despite looking like the English word handy.',
        '"Gern", "lieber" and "am liebsten" form a ladder of preference.',
        'The verb comes second in a normal German main clause.'
      ],
      myths: [
        'German nouns are capitalised only at the start of a sentence.',
        '"Das Handy" means something that is handy.',
        'German word order is the same as English in every sentence.',
        '"Gern" is a verb meaning to like.',
        'The gender of a German noun can be worked out from its English translation.'
      ]
    },
    {
      name: 'German Grammar: Cases and Word Order', from: 'Grade 8', to: 'College',
      kind: 'lexicon', lang: 'German',
      facts: [
        ['der Nominativ', 'the case for the subject'],
        ['der Akkusativ', 'the case for the direct object'],
        ['der Dativ', 'the case for the indirect object'],
        ['der Genitiv', 'the case showing possession'],
        ['der Artikel', 'the word for the or a'],
        ['maskulin', 'masculine gender'],
        ['feminin', 'feminine gender'],
        ['neutral', 'neuter gender'],
        ['die Wortstellung', 'word order'],
        ['das Verb an zweiter Stelle', 'the rule that the verb comes second'],
        ['ein trennbares Verb', 'a separable verb, whose prefix moves to the end'],
        ['ein Modalverb', 'a modal verb such as können or müssen'],
        ['das Perfekt', 'the spoken past tense'],
        ['das Präteritum', 'the written past tense'],
        ['das Partizip', 'the past participle'],
        ['die Präposition', 'a preposition, which governs a case'],
        ['der Plural', 'the plural form'],
        ['die Endung', 'the ending a word takes']
      ],
      truths: [
        'German has four cases, and the article changes with the case.',
        'In a main clause the verb is the second element, whatever comes first.',
        'A separable verb sends its prefix to the end of the clause.',
        'Some prepositions always take the dative and others always the accusative.',
        'The perfect tense is used in speech and the preterite more in writing.'
      ],
      myths: [
        'German word order is free because the cases show who does what.',
        'The article is the same in every case.',
        'A separable prefix stays attached to its verb.',
        'Every preposition takes the accusative.',
        'The gender of a noun follows a rule you can always apply.'
      ]
    }
  ],

  italian: [
    {
      name: 'Italian: Family, Friends and Description', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'Italian',
      facts: [
        ['la famiglia', 'the family'], ['il padre', 'the father'], ['la madre', 'the mother'],
        ['il fratello', 'the brother'], ['la sorella', 'the sister'], ['il nonno', 'the grandfather'],
        ['la nonna', 'the grandmother'], ['il figlio', 'the son'], ['la figlia', 'the daughter'],
        ['lo zio', 'the uncle'], ['la zia', 'the aunt'], ['il cugino', 'the cousin'],
        ['l’amico', 'the friend'], ['alto', 'tall'], ['basso', 'short'],
        ['simpatico', 'nice or friendly'], ['gentile', 'kind'], ['divertente', 'funny'],
        ['i capelli', 'the hair'], ['gli occhi', 'the eyes'], ['giovane', 'young'],
        ['anziano', 'elderly'], ['sposato', 'married'], ['il compleanno', 'the birthday']
      ],
      truths: [
        'Italian adjectives agree with the noun in gender and number.',
        '"Simpatico" means friendly, not sympathetic.',
        '"I capelli" is plural in Italian where English uses a singular.',
        'The article changes before certain consonant clusters: "lo zio", not "il zio".',
        'Most Italian nouns ending in -o are masculine and in -a feminine.'
      ],
      myths: [
        '"Simpatico" means sympathetic.',
        'Italian adjectives keep the same ending whatever the noun.',
        '"Capelli" is singular like the English word hair.',
        'The article "il" is used before every masculine noun.',
        '"Parenti" means parents.'
      ]
    },
    {
      name: 'Italian: Food, Shopping and Numbers', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'Italian',
      facts: [
        ['il pane', 'bread'], ['il latte', 'milk'], ['il formaggio', 'cheese'],
        ['la carne', 'meat'], ['il pesce', 'fish'], ['la verdura', 'vegetables'],
        ['la frutta', 'fruit'], ['la pasta', 'pasta'], ['il riso', 'rice'],
        ['il negozio', 'the shop'], ['il mercato', 'the market'], ['il supermercato', 'the supermarket'],
        ['quanto costa', 'how much does it cost'], ['il prezzo', 'the price'], ['i soldi', 'money'],
        ['caro', 'expensive'], ['economico', 'cheap'], ['un chilo', 'a kilo'],
        ['un etto', 'a hundred grams'], ['una bottiglia', 'a bottle'], ['un pacco', 'a packet'],
        ['vorrei', 'I would like'], ['basta così', 'that is all'], ['lo scontrino', 'the receipt']
      ],
      truths: [
        '"Un etto" is a hundred grams and is used constantly in Italian shops.',
        '"Vorrei" is the polite way to ask for something.',
        '"Economico" means cheap in price, not economical in the English sense.',
        '"Lo scontrino" is the small receipt you are expected to keep.',
        'Quantities are usually given before the item: "un chilo di mele".'
      ],
      myths: [
        '"Un etto" means one kilo.',
        '"Voglio" is the polite way to order in a shop.',
        '"Economico" describes a person who saves money.',
        'Italian shops do not use receipts.',
        '"Quanto costa" is used only for expensive things.'
      ]
    }
  ],

  mandarin: [
    {
      name: 'Mandarin: Greetings, Numbers and Family', from: 'Grade 6', to: 'Grade 12',
      kind: 'lexicon', lang: 'Mandarin',
      facts: [
        ['你好 (nǐ hǎo)', 'hello'], ['再见 (zàijiàn)', 'goodbye'], ['谢谢 (xièxie)', 'thank you'],
        ['对不起 (duìbuqǐ)', 'sorry'], ['请 (qǐng)', 'please'], ['是 (shì)', 'to be'],
        ['我 (wǒ)', 'I or me'], ['你 (nǐ)', 'you'], ['他 (tā)', 'he or him'],
        ['一 (yī)', 'one'], ['二 (èr)', 'two'], ['三 (sān)', 'three'],
        ['四 (sì)', 'four'], ['五 (wǔ)', 'five'], ['十 (shí)', 'ten'],
        ['家 (jiā)', 'family or home'], ['妈妈 (māma)', 'mother'], ['爸爸 (bàba)', 'father'],
        ['哥哥 (gēge)', 'older brother'], ['姐姐 (jiějie)', 'older sister'],
        ['朋友 (péngyou)', 'friend'], ['老师 (lǎoshī)', 'teacher'], ['学生 (xuésheng)', 'student']
      ],
      truths: [
        'Mandarin has four main tones, and the tone changes the meaning of a syllable.',
        'Pinyin is a way of writing the sounds, not a separate language.',
        'Mandarin distinguishes older and younger siblings with different words.',
        'Chinese characters represent meaning and sound together, not letters.',
        'Numbers eleven to nineteen are formed as "ten one", "ten two" and so on.'
      ],
      myths: [
        'Tones are optional if the context is clear.',
        'Pinyin is a different language from Chinese.',
        'One character always equals one English word.',
        'Mandarin has a single word for brother regardless of age.',
        'Chinese characters are pictures of the things they mean.'
      ]
    },
    {
      name: 'Mandarin: School, Time and Daily Life', from: 'Grade 7', to: 'Grade 12',
      kind: 'lexicon', lang: 'Mandarin',
      facts: [
        ['学校 (xuéxiào)', 'school'], ['教室 (jiàoshì)', 'classroom'], ['书 (shū)', 'book'],
        ['笔 (bǐ)', 'pen'], ['中文 (zhōngwén)', 'Chinese language'], ['英文 (yīngwén)', 'English language'],
        ['数学 (shùxué)', 'mathematics'], ['今天 (jīntiān)', 'today'], ['明天 (míngtiān)', 'tomorrow'],
        ['昨天 (zuótiān)', 'yesterday'], ['星期一 (xīngqīyī)', 'Monday'], ['点 (diǎn)', 'o’clock'],
        ['分 (fēn)', 'minute'], ['早上 (zǎoshang)', 'morning'], ['下午 (xiàwǔ)', 'afternoon'],
        ['晚上 (wǎnshang)', 'evening'], ['吃 (chī)', 'to eat'], ['喝 (hē)', 'to drink'],
        ['去 (qù)', 'to go'], ['看 (kàn)', 'to look or watch'], ['写 (xiě)', 'to write'],
        ['很 (hěn)', 'very'], ['不 (bù)', 'not']
      ],
      truths: [
        'Days of the week are formed from "星期" plus a number.',
        'Mandarin verbs do not change form for tense; time words do the work.',
        '"很" is often used before an adjective even where English would not say "very".',
        'Time expressions come before the verb in Mandarin.',
        'Negation with "不" goes before the verb.'
      ],
      myths: [
        'Mandarin verbs change their ending for past and future.',
        'Days of the week each have an unrelated name as in English.',
        'Time expressions go at the end of the sentence as in English.',
        '"很" always translates as "very".',
        'Word order in Mandarin is identical to English in every sentence.'
      ]
    }
  ],

  esl: [
    {
      name: 'English for Learners: Everyday Situations', from: 'Grade 4', to: 'College',
      facts: [
        ['a greeting', 'what you say when you meet someone'],
        ['an introduction', 'telling someone your name'],
        ['a request', 'asking politely for something'],
        ['an apology', 'saying sorry'],
        ['small talk', 'light conversation about ordinary things'],
        ['a formal register', 'the language used with someone you do not know well'],
        ['an informal register', 'the language used with friends'],
        ['a phrasal verb', 'a verb plus a particle, such as "give up"'],
        ['an idiom', 'a phrase whose meaning is not the sum of its words'],
        ['a false friend', 'a word that looks like one in your language but means something else'],
        ['a collocation', 'words that habitually go together, such as "make a mistake"'],
        ['a contraction', 'a shortened form such as "don’t"'],
        ['a question tag', 'the short question added to the end, as in "isn’t it?"'],
        ['intonation', 'the rise and fall of the voice'],
        ['stress', 'the syllable said with more force'],
        ['a filler', 'a word used while thinking, such as "well"'],
        ['paraphrasing', 'saying the same thing in different words'],
        ['clarifying', 'asking someone to explain again'],
        ['a homophone', 'a word that sounds like another but is spelled differently'],
        ['a synonym', 'a word with a similar meaning']
      ],
      truths: [
        'English uses "make" and "do" in fixed collocations that have to be learned.',
        'A phrasal verb often means something quite different from its parts.',
        'Register matters: what is fine with a friend may be rude to a stranger.',
        'A question tag usually reverses the polarity of the main clause.',
        'Asking someone to repeat or explain is a skill, not a failure.'
      ],
      myths: [
        'You can work out a phrasal verb from the meanings of its two words.',
        '"Make" and "do" are interchangeable.',
        'Formal English is always better English.',
        'A word that looks like one in your language means the same thing.',
        'You should never ask a speaker to repeat themselves.'
      ],
      applications: [
        ['"Give up" means to stop trying, not to give something upwards. What kind of verb is it?', 'a phrasal verb'],
        ['"Make a mistake" is correct and "do a mistake" is not. Which idea is this?', 'a collocation'],
        ['Speaking to a manager differs from speaking to a friend. What changes?', 'a formal register'],
        ['"Actually" in English does not mean "currently". What is it?', 'a false friend'],
        ['Asking "sorry, could you say that again?" is doing what?', 'clarifying']
      ]
    }
  ]
};
