/* English and language-arts micro-units.
   Grammar is taught as discrete skills, reading as strategies, literature as
   devices and forms — so each is its own unit with its own item bank. The
   vocabulary units are built from morphology (prefix, suffix, root) because
   that is what actually transfers to unseen words. */

export const ELA_UNITS = {
  /* ================================ GRAMMAR ================================ */
  grammar: [
    {
      name: 'Parts of Speech', from: 'Grade 2', to: 'Grade 9',
      facts: [
        ['noun', 'a word naming a person, place, thing or idea'],
        ['proper noun', 'a name of a particular person or place, always capitalised'],
        ['common noun', 'a general name for a thing rather than a particular one'],
        ['verb', 'a word expressing an action or a state of being'],
        ['adjective', 'a word that describes a noun'],
        ['adverb', 'a word that describes a verb, adjective or other adverb'],
        ['pronoun', 'a word used in place of a noun'],
        ['preposition', 'a word showing position, direction or time'],
        ['conjunction', 'a word that joins words, phrases or clauses'],
        ['determiner', 'a word such as the, a or this that introduces a noun'],
        ['interjection', 'a short exclamation such as “oh” or “wow”'],
        ['abstract noun', 'a noun naming something you cannot touch, such as courage'],
        ['collective noun', 'a noun naming a group, such as flock or team'],
        ['auxiliary verb', 'a helping verb such as have, be or do']
      ],
      truths: [
        'Adverbs can describe adjectives as well as verbs.',
        'A word’s part of speech depends on how it is used in the sentence.',
        'Proper nouns are capitalised wherever they appear in a sentence.',
        'Prepositions are followed by a noun or pronoun that they relate to.'
      ],
      myths: [
        'Every word that ends in -ly is an adverb.',
        'A word always belongs to the same part of speech whatever the sentence.',
        'Adjectives describe verbs.',
        'A pronoun can never begin a sentence.'
      ]
    },
    {
      name: 'Nouns and Plurals', from: 'Grade 2', to: 'Grade 7',
      facts: [
        ['plural', 'the form of a noun meaning more than one'],
        ['singular', 'the form of a noun meaning exactly one'],
        ['irregular plural', 'a plural that does not simply add -s, such as children'],
        ['possessive', 'the form showing ownership, usually with an apostrophe'],
        ['countable noun', 'a noun that can be counted and made plural'],
        ['uncountable noun', 'a noun such as water or advice that has no plural'],
        ['compound noun', 'a noun made from two or more words joined'],
        ['apostrophe of possession', 'the mark showing that something belongs to someone'],
        ['-ies plural', 'the plural formed when a noun ends in consonant + y'],
        ['-es plural', 'the plural added after s, x, ch or sh'],
        ['proper noun', 'the name of a specific person, place or organisation'],
        ['collective noun', 'a single word naming a group of things'],
        ['gerund', 'an -ing form of a verb used as a noun'],
        ['noun phrase', 'a group of words built around a noun']
      ],
      truths: [
        'Nouns ending in a consonant plus y form plurals with -ies.',
        'Apostrophes show possession or omission, never plurals.',
        'Some nouns, such as sheep, have the same singular and plural form.',
        'Uncountable nouns take a singular verb even though they refer to a quantity.'
      ],
      myths: [
        'Every plural in English is formed by adding -s.',
        'An apostrophe is used to make a word plural.',
        'All nouns ending in -y form plurals with -ys.',
        'Every noun has both a singular and a plural form.'
      ]
    },
    {
      name: 'Verb Tenses', from: 'Grade 3', to: 'Grade 10',
      facts: [
        ['present simple', 'the tense for habits and general truths'],
        ['past simple', 'the tense for a completed action at a definite time'],
        ['future', 'the form used for what has not happened yet'],
        ['present continuous', 'the tense for an action happening now'],
        ['past continuous', 'the tense for an action in progress in the past'],
        ['present perfect', 'the tense linking a past action to the present'],
        ['past participle', 'the verb form used after have or be, such as eaten'],
        ['irregular verb', 'a verb whose past form is not made by adding -ed'],
        ['infinitive', 'the base form of a verb, usually with “to”'],
        ['modal verb', 'a verb such as can, must or should expressing possibility or duty'],
        ['active voice', 'a sentence in which the subject performs the action'],
        ['passive voice', 'a sentence in which the subject receives the action'],
        ['tense consistency', 'keeping to the same tense unless there is a reason to change'],
        ['auxiliary', 'a helping verb used to build a tense']
      ],
      truths: [
        'The present perfect connects a past event to the present moment.',
        'English has no separate future tense form; it uses will or going to.',
        'Passive voice moves the doer of the action out of the subject position.',
        'Irregular verbs must be learned individually because no rule predicts them.'
      ],
      myths: [
        'Every past tense verb is formed by adding -ed.',
        'The passive voice is always wrong and should never be used.',
        'The present continuous is used for habits and routines.',
        'English has a single future tense with its own verb ending.'
      ]
    },
    {
      name: 'Subject–Verb Agreement', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['subject', 'the person or thing that performs the verb'],
        ['agreement', 'matching the verb form to the number of the subject'],
        ['singular subject', 'a subject referring to one, taking a singular verb'],
        ['plural subject', 'a subject referring to more than one'],
        ['compound subject', 'two subjects joined by “and”, usually taking a plural verb'],
        ['collective subject', 'a group noun that may take either form depending on sense'],
        ['intervening phrase', 'words between subject and verb that do not change agreement'],
        ['indefinite pronoun', 'a word such as everyone or nobody, usually singular'],
        ['there is / there are', 'a construction where the verb agrees with what follows'],
        ['either…or', 'a pair where the verb agrees with the nearer subject'],
        ['inverted sentence', 'a sentence where the verb comes before the subject'],
        ['number', 'whether a word is singular or plural'],
        ['person', 'whether a subject is first, second or third'],
        ['concord', 'another word for grammatical agreement']
      ],
      truths: [
        'A phrase between the subject and the verb does not change the agreement.',
        'Indefinite pronouns such as everyone take a singular verb.',
        'With “either…or”, the verb agrees with the subject nearer to it.',
        'Compound subjects joined by “and” usually take a plural verb.'
      ],
      myths: [
        'The verb agrees with the noun immediately before it.',
        'Everyone and nobody take plural verbs because they refer to many people.',
        'Agreement never matters after “there”.',
        'A compound subject joined by “and” always takes a singular verb.'
      ]
    },
    {
      name: 'Punctuation', from: 'Grade 3', to: 'Grade 10',
      facts: [
        ['full stop', 'the mark ending a statement'],
        ['question mark', 'the mark ending a direct question'],
        ['exclamation mark', 'the mark used after a strong feeling or command'],
        ['comma', 'the mark separating items or marking a pause'],
        ['apostrophe', 'the mark showing possession or omitted letters'],
        ['semicolon', 'the mark joining two closely related independent clauses'],
        ['colon', 'the mark introducing a list, explanation or quotation'],
        ['quotation marks', 'the marks enclosing direct speech'],
        ['dash', 'the mark setting off an aside more sharply than a comma'],
        ['parentheses', 'the marks enclosing extra, non-essential information'],
        ['ellipsis', 'the three dots showing an omission or trailing off'],
        ['comma splice', 'the error of joining two sentences with only a comma'],
        ['Oxford comma', 'the comma placed before “and” in a list'],
        ['hyphen', 'the short mark joining words such as well-known']
      ],
      truths: [
        'A semicolon can join two independent clauses without a conjunction.',
        'A comma splice joins two complete sentences with only a comma.',
        'A colon introduces what follows; it does not join two equal clauses.',
        'Apostrophes never make a word plural.'
      ],
      myths: [
        'A comma should be placed wherever you would pause for breath.',
        'A semicolon and a colon do the same job.',
        'It’s with an apostrophe is the possessive form of it.',
        'A dash and a hyphen are the same mark.'
      ]
    },
    {
      name: 'Sentence Structure', from: 'Grade 4', to: 'Grade 11',
      facts: [
        ['simple sentence', 'a sentence with one independent clause'],
        ['compound sentence', 'two independent clauses joined by a conjunction'],
        ['complex sentence', 'an independent clause with at least one subordinate clause'],
        ['independent clause', 'a clause that could stand alone as a sentence'],
        ['subordinate clause', 'a clause that depends on the main clause'],
        ['fragment', 'a group of words punctuated as a sentence but incomplete'],
        ['run-on sentence', 'two sentences joined with no punctuation or conjunction'],
        ['phrase', 'a group of words without both a subject and a verb'],
        ['coordinating conjunction', 'a joining word such as and, but or so'],
        ['subordinating conjunction', 'a word such as because or although starting a dependent clause'],
        ['relative clause', 'a clause beginning with who, which or that'],
        ['topic sentence', 'the sentence stating the main idea of a paragraph'],
        ['parallel structure', 'using the same grammatical form for items in a list'],
        ['appositive', 'a noun phrase renaming the noun beside it']
      ],
      truths: [
        'A complex sentence has one independent and at least one subordinate clause.',
        'A fragment lacks a subject, a verb, or a complete thought.',
        'A subordinate clause cannot stand alone as a sentence.',
        'Varying sentence length is what makes writing readable.'
      ],
      myths: [
        'A long sentence is automatically a run-on.',
        'Every sentence beginning with “because” is a fragment.',
        'A compound sentence contains a subordinate clause.',
        'Short sentences are always poor writing.'
      ]
    },
    {
      name: 'Clauses and Modifiers', from: 'Grade 7', to: 'College',
      facts: [
        ['modifier', 'a word or phrase that describes another element'],
        ['dangling modifier', 'a modifier with nothing sensible in the sentence to describe'],
        ['misplaced modifier', 'a modifier sitting next to the wrong word'],
        ['restrictive clause', 'a clause essential to the meaning, taking no commas'],
        ['non-restrictive clause', 'an extra clause set off by commas'],
        ['participial phrase', 'a phrase beginning with an -ing or -ed verb form'],
        ['absolute phrase', 'a phrase modifying the whole sentence'],
        ['antecedent', 'the noun that a pronoun refers back to'],
        ['pronoun–antecedent agreement', 'matching a pronoun to the noun it replaces'],
        ['relative pronoun', 'who, whom, which or that, introducing a relative clause'],
        ['adverbial clause', 'a clause acting as an adverb, often of time or reason'],
        ['nominal clause', 'a clause acting as a noun in the sentence'],
        ['ambiguity', 'more than one possible reading of a sentence'],
        ['squinting modifier', 'a modifier that could attach to either side of it']
      ],
      truths: [
        'A dangling modifier has no word in the sentence that it can logically describe.',
        'Non-restrictive clauses are set off by commas; restrictive ones are not.',
        'A modifier should sit as close as possible to the word it modifies.',
        'A pronoun must agree with its antecedent in number.'
      ],
      myths: [
        'Restrictive and non-restrictive clauses are punctuated the same way.',
        'A dangling modifier is simply a very long phrase.',
        'Modifiers can be placed anywhere without changing meaning.',
        'Which and that are always interchangeable.'
      ]
    },
    {
      name: 'Common Errors and Usage', from: 'Grade 5', to: 'College',
      facts: [
        ['their / there / they’re', 'possessive, place, and the contraction of they are'],
        ['your / you’re', 'possessive, and the contraction of you are'],
        ['its / it’s', 'possessive, and the contraction of it is'],
        ['affect / effect', 'usually the verb, and usually the noun'],
        ['fewer / less', 'used with countable, and with uncountable, nouns'],
        ['who / whom', 'the subject form, and the object form'],
        ['then / than', 'time or sequence, and comparison'],
        ['accept / except', 'to receive, and apart from'],
        ['practice / practise', 'the noun, and the verb in British English'],
        ['lose / loose', 'to misplace, and not tight'],
        ['double negative', 'two negatives in one clause, changing the meaning'],
        ['redundancy', 'saying the same thing twice, such as “free gift”'],
        ['tautology', 'needless repetition of an idea in different words'],
        ['register', 'the level of formality a piece of writing uses']
      ],
      truths: [
        'It’s with an apostrophe always means “it is” or “it has”.',
        'Fewer is used with things you can count; less with quantities you cannot.',
        'Affect is usually the verb and effect is usually the noun.',
        'Whom is the object form of who.'
      ],
      myths: [
        'Its with an apostrophe is the possessive form.',
        'Less and fewer can be used interchangeably in every case.',
        'Effect is always a verb.',
        'Two negatives in a sentence always make the meaning stronger.'
      ]
    }
  ],

  /* ============================== VOCABULARY ============================== */
  vocabulary: [
    {
      name: 'Prefixes', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['un-', 'not, or the reverse of'],
        ['re-', 'again or back'],
        ['pre-', 'before'],
        ['post-', 'after'],
        ['sub-', 'under or below'],
        ['inter-', 'between'],
        ['trans-', 'across'],
        ['anti-', 'against'],
        ['mis-', 'wrongly'],
        ['dis-', 'not, or the opposite of'],
        ['super-', 'above or beyond'],
        ['micro-', 'very small'],
        ['bi-', 'two'],
        ['auto-', 'self'],
        ['co-', 'together with'],
        ['ex-', 'out of, or former']
      ],
      truths: [
        'A prefix goes at the start of a word and changes its meaning.',
        'Adding a prefix does not usually change the spelling of the root word.',
        'Both un- and dis- can make a word negative.',
        'Knowing prefixes lets you work out unfamiliar words.'
      ],
      myths: [
        'A prefix is added to the end of a word.',
        'Adding a prefix always changes the spelling of the root.',
        'Every word starting with “in” contains the prefix in-.',
        'Prefixes change a word’s part of speech but not its meaning.'
      ]
    },
    {
      name: 'Suffixes', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['-less', 'without'],
        ['-ful', 'full of'],
        ['-ness', 'the state or quality of'],
        ['-ment', 'the result or action of'],
        ['-tion', 'the act or state of, forming a noun'],
        ['-able', 'able to be'],
        ['-ous', 'having the quality of'],
        ['-ist', 'a person who does or believes'],
        ['-ify', 'to make or become'],
        ['-ology', 'the study of'],
        ['-ish', 'somewhat, or resembling'],
        ['-ive', 'having a tendency to'],
        ['-ance', 'the state or quality of, forming a noun'],
        ['-ly', 'in the manner of, usually forming an adverb']
      ],
      truths: [
        'A suffix often changes a word’s part of speech.',
        'Adding -ness to an adjective usually makes an abstract noun.',
        'The suffix -able means “able to be”.',
        'Some suffixes change the spelling of the root, such as happy to happiness.'
      ],
      myths: [
        'Suffixes never change the part of speech of a word.',
        'A suffix goes at the beginning of a word.',
        'Adding a suffix never changes the spelling of the root.',
        'The suffix -ology means “the love of”.'
      ]
    },
    {
      name: 'Greek and Latin Roots', from: 'Grade 5', to: 'College',
      facts: [
        ['aud', 'to hear, as in audible'],
        ['bio', 'life, as in biology'],
        ['chron', 'time, as in chronological'],
        ['dict', 'to say, as in dictate'],
        ['geo', 'earth, as in geography'],
        ['graph', 'to write, as in autograph'],
        ['hydro', 'water, as in hydroelectric'],
        ['photo', 'light, as in photograph'],
        ['port', 'to carry, as in transport'],
        ['scrib / script', 'to write, as in describe'],
        ['spect', 'to look, as in inspect'],
        ['struct', 'to build, as in construct'],
        ['tele', 'far off, as in telescope'],
        ['therm', 'heat, as in thermometer'],
        ['vis / vid', 'to see, as in visible'],
        ['phon', 'sound, as in telephone']
      ],
      truths: [
        'Most academic English vocabulary is built from Greek and Latin roots.',
        'Knowing the root “spect” helps with inspect, spectator and prospect alike.',
        'A single word can contain a prefix, a root and a suffix.',
        'Roots carry the core meaning of a word.'
      ],
      myths: [
        'Roots are only found in scientific words.',
        'Every English word has a Greek or Latin root.',
        'The root of a word is always its first syllable.',
        'Knowing roots is no help with words you have never met.'
      ]
    },
    {
      name: 'Figurative Language and Idiom', from: 'Grade 5', to: 'College',
      facts: [
        ['simile', 'a comparison using like or as'],
        ['metaphor', 'a comparison stating that one thing is another'],
        ['personification', 'giving human qualities to something not human'],
        ['hyperbole', 'deliberate exaggeration for effect'],
        ['idiom', 'a phrase whose meaning is not literal'],
        ['alliteration', 'repeating the same initial sound in nearby words'],
        ['onomatopoeia', 'a word that imitates the sound it names'],
        ['oxymoron', 'two contradictory words placed together'],
        ['euphemism', 'a mild word used in place of a blunt one'],
        ['symbolism', 'using an object to stand for an idea'],
        ['imagery', 'language appealing to the senses'],
        ['analogy', 'an extended comparison used to explain'],
        ['irony', 'a gap between what is said and what is meant'],
        ['cliché', 'an expression worn out by overuse']
      ],
      truths: [
        'A simile uses like or as; a metaphor does not.',
        'Idioms cannot be understood from the individual words alone.',
        'Hyperbole is deliberate exaggeration, not a mistake.',
        'Personification gives human qualities to non-human things.'
      ],
      myths: [
        'A metaphor uses the word “like” to make its comparison.',
        'Idioms mean exactly what their individual words say.',
        'Hyperbole is a factual error made by careless writers.',
        'Alliteration means words that rhyme.'
      ]
    },
    {
      name: 'Academic Vocabulary', from: 'Grade 7', to: 'College',
      facts: [
        ['analyse', 'to examine something in detail, part by part'],
        ['evaluate', 'to judge the value or quality of something'],
        ['synthesise', 'to combine ideas from several sources'],
        ['infer', 'to work something out from evidence rather than being told'],
        ['justify', 'to give reasons supporting a claim'],
        ['contrast', 'to set out the differences between things'],
        ['significant', 'important enough to matter to the conclusion'],
        ['criteria', 'the standards used to judge something'],
        ['hypothesis', 'a testable proposal made before evidence is gathered'],
        ['bias', 'a leaning that distorts a judgement'],
        ['objective', 'based on facts rather than feelings'],
        ['subjective', 'based on personal feeling or opinion'],
        ['implication', 'a consequence that follows without being stated'],
        ['assumption', 'something taken to be true without proof']
      ],
      truths: [
        'To evaluate is to judge; to describe is only to say what something is.',
        'An inference is drawn from evidence, not stated directly.',
        'An assumption is unproven, which is why it should be made explicit.',
        'Objective claims can be checked against evidence.'
      ],
      myths: [
        'Analyse and describe ask for the same thing.',
        'An inference is a guess with no evidence behind it.',
        'Objective and subjective mean the same thing.',
        'A hypothesis is a conclusion reached after an experiment.'
      ]
    }
  ],

  /* ================================ READING ================================ */
  reading: [
    {
      name: 'Main Idea and Summary', from: 'Grade 5', to: 'College',
      facts: [
        ['main idea', 'what a text is mostly about'],
        ['supporting detail', 'a fact or example that backs up the main idea'],
        ['summary', 'a short account keeping only what matters'],
        ['gist', 'the general sense of a passage'],
        ['topic sentence', 'the sentence that states a paragraph’s main idea'],
        ['paraphrase', 'restating something in your own words at similar length'],
        ['skimming', 'reading quickly to get the general idea'],
        ['scanning', 'reading to find one specific piece of information'],
        ['key word', 'a word carrying the important meaning in a question'],
        ['thesis', 'the central claim a whole text argues for'],
        ['relevance', 'whether a detail actually bears on the question'],
        ['redundant detail', 'information that adds nothing to the summary'],
        ['heading', 'a title that signals what a section covers'],
        ['abstract', 'a short summary placed at the start of a text']
      ],
      truths: [
        'A summary keeps the main idea and drops the examples.',
        'The main idea is not always stated in the first sentence.',
        'Paraphrasing is restating in your own words, not copying with two words changed.',
        'Skimming and scanning are different techniques for different purposes.'
      ],
      myths: [
        'The main idea is always the first sentence of a paragraph.',
        'A summary should include every detail from the original.',
        'Paraphrasing means changing a few words of the original.',
        'Skimming and scanning are two names for the same thing.'
      ]
    },
    {
      name: 'Inference and Evidence', from: 'Grade 5', to: 'College',
      facts: [
        ['inference', 'a conclusion drawn from evidence and reasoning'],
        ['explicit information', 'something the text states directly'],
        ['implicit information', 'something the text implies without stating'],
        ['evidence', 'the part of the text supporting a claim'],
        ['quotation', 'the exact words of the text, in quotation marks'],
        ['prediction', 'a reasoned guess about what will happen next'],
        ['context clue', 'nearby words that reveal an unfamiliar word’s meaning'],
        ['deduction', 'reasoning that follows necessarily from what is given'],
        ['assumption', 'something the reader supplies that the text does not say'],
        ['unreliable narrator', 'a narrator whose account cannot be fully trusted'],
        ['motive', 'the reason behind a character’s action'],
        ['connotation', 'the feeling a word carries beyond its literal meaning'],
        ['denotation', 'the literal dictionary meaning of a word'],
        ['textual support', 'the quotation or reference backing an answer']
      ],
      truths: [
        'An inference must be supported by something actually in the text.',
        'Connotation is the feeling a word carries; denotation is its dictionary meaning.',
        'Context clues can reveal the meaning of an unfamiliar word.',
        'A good answer quotes or refers to the text as evidence.'
      ],
      myths: [
        'An inference is whatever the reader personally feels about the text.',
        'Connotation and denotation mean the same thing.',
        'If the text does not state it, nothing can be concluded about it.',
        'Evidence means the reader’s own experience.'
      ]
    },
    {
      name: 'Text Structure and Features', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['chronological order', 'events presented in the order they happened'],
        ['cause and effect', 'a structure linking events to their consequences'],
        ['compare and contrast', 'a structure setting out similarities and differences'],
        ['problem and solution', 'a structure presenting a difficulty and its remedy'],
        ['description', 'a structure detailing features of a subject'],
        ['subheading', 'a smaller heading dividing a section'],
        ['caption', 'the text explaining an image'],
        ['glossary', 'an alphabetical list of terms and meanings'],
        ['index', 'the list at the back showing where topics appear'],
        ['sidebar', 'a boxed section beside the main text'],
        ['diagram', 'a drawing explaining how something works'],
        ['bullet list', 'a set of short points marked by dots'],
        ['signpost word', 'a word such as however or therefore showing direction'],
        ['topic shift', 'the point where a text moves to a new idea']
      ],
      truths: [
        'Signpost words such as “however” tell you the argument is about to turn.',
        'Text features such as headings and captions carry real information.',
        'The same content can be organised in more than one structure.',
        'An index is arranged alphabetically; a contents page follows the order of the book.'
      ],
      myths: [
        'Headings and captions are decoration and can be skipped.',
        'Every non-fiction text uses chronological order.',
        'An index and a contents page are the same thing.',
        'Signpost words carry no meaning of their own.'
      ]
    },
    {
      name: 'Purpose, Audience and Tone', from: 'Grade 6', to: 'College',
      facts: [
        ['purpose', 'the reason a text was written'],
        ['audience', 'the readers a text is aimed at'],
        ['tone', 'the writer’s attitude to the subject'],
        ['mood', 'the feeling a text creates in the reader'],
        ['formal register', 'the style used for official or academic writing'],
        ['informal register', 'the relaxed style used with people you know'],
        ['persuade', 'the purpose of changing what a reader thinks or does'],
        ['inform', 'the purpose of giving the reader facts'],
        ['entertain', 'the purpose of giving the reader pleasure'],
        ['bias', 'a one-sided presentation of a subject'],
        ['emotive language', 'wording chosen to stir feeling'],
        ['rhetorical question', 'a question asked for effect, not for an answer'],
        ['direct address', 'speaking straight to the reader as “you”'],
        ['objectivity', 'presenting a subject without personal slant']
      ],
      truths: [
        'Tone is the writer’s attitude; mood is the reader’s feeling.',
        'A text can have more than one purpose at the same time.',
        'Emotive language is a signal that a text is trying to persuade.',
        'The intended audience shapes vocabulary, length and register.'
      ],
      myths: [
        'Tone and mood are two words for the same thing.',
        'A text has exactly one purpose.',
        'Formal writing is always better than informal writing.',
        'A rhetorical question expects the reader to answer it aloud.'
      ]
    },
    {
      name: 'Comparing Texts', from: 'Grade 7', to: 'College',
      facts: [
        ['comparison', 'setting two texts side by side to find similarities'],
        ['contrast', 'setting out how two texts differ'],
        ['viewpoint', 'the position from which a writer presents a subject'],
        ['primary source', 'an account created at the time by someone involved'],
        ['secondary source', 'an account written later, drawing on primary sources'],
        ['perspective', 'the particular angle a writer takes'],
        ['corroboration', 'agreement between two independent sources'],
        ['contradiction', 'a point where two sources disagree'],
        ['provenance', 'where a source came from and who made it'],
        ['reliability', 'how far a source can be trusted'],
        ['selection', 'what a writer chooses to include or leave out'],
        ['emphasis', 'the weight a writer puts on one part of a subject'],
        ['synthesis', 'drawing several sources into one account'],
        ['cross-reference', 'a pointer from one text to related material']
      ],
      truths: [
        'Two reliable sources can still disagree about the same event.',
        'What a writer leaves out is as revealing as what they include.',
        'A primary source is not automatically more reliable than a secondary one.',
        'Corroboration between independent sources strengthens a claim.'
      ],
      myths: [
        'A primary source is always more reliable than a secondary source.',
        'If two sources disagree, one of them must be lying.',
        'Comparing texts means listing similarities only.',
        'Provenance has no bearing on how a source should be read.'
      ]
    }
  ],

  /* ================================ WRITING ================================ */
  writing: [
    {
      name: 'Paragraphs and Structure', from: 'Grade 6', to: 'College',
      facts: [
        ['topic sentence', 'the sentence stating what a paragraph is about'],
        ['supporting sentence', 'a sentence developing the paragraph’s idea'],
        ['concluding sentence', 'the sentence closing a paragraph'],
        ['cohesion', 'the way sentences link smoothly to each other'],
        ['coherence', 'whether the whole piece makes sense as a unit'],
        ['transition', 'a word or phrase moving the reader between ideas'],
        ['introduction', 'the opening that sets out what a piece will do'],
        ['conclusion', 'the ending that draws the argument together'],
        ['PEE', 'point, evidence, explanation — a paragraph pattern'],
        ['paragraph break', 'the point at which a new idea starts'],
        ['outline', 'a plan of a piece before it is written'],
        ['draft', 'an early version to be revised'],
        ['revision', 'reworking content and structure, not just spelling'],
        ['editing', 'correcting the surface features of a text']
      ],
      truths: [
        'A new paragraph signals a new idea, speaker, time or place.',
        'Revising means changing content and structure; editing means fixing errors.',
        'A conclusion should not introduce a completely new argument.',
        'Transitions make the connection between ideas explicit.'
      ],
      myths: [
        'A paragraph must always be exactly five sentences long.',
        'Editing and revising are the same stage of writing.',
        'The conclusion is the place to add your strongest new evidence.',
        'Good writers produce a finished piece in one draft.'
      ]
    },
    {
      name: 'Narrative Writing', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['plot', 'the sequence of events in a story'],
        ['exposition', 'the opening that establishes setting and characters'],
        ['rising action', 'the build-up of complications'],
        ['climax', 'the turning point of a story'],
        ['resolution', 'the tying up of the story’s events'],
        ['protagonist', 'the main character'],
        ['antagonist', 'the character or force opposing the protagonist'],
        ['first person', 'narration using “I”'],
        ['third person', 'narration using “he”, “she” or “they”'],
        ['omniscient narrator', 'a narrator who knows every character’s thoughts'],
        ['dialogue', 'the words characters speak'],
        ['flashback', 'a scene set earlier than the main action'],
        ['foreshadowing', 'a hint of what is to come'],
        ['show don’t tell', 'conveying feeling through action and detail rather than labels']
      ],
      truths: [
        'Dialogue can reveal character more efficiently than description.',
        'A flashback interrupts chronological order deliberately.',
        'A first-person narrator can only report what they know.',
        'The climax is the turning point, not necessarily the last event.'
      ],
      myths: [
        'The climax is always the final paragraph of a story.',
        'A first-person narrator knows what every character is thinking.',
        'Foreshadowing means telling the reader the ending in advance.',
        'Description is always better than dialogue.'
      ]
    },
    {
      name: 'Persuasive Writing', from: 'Grade 7', to: 'College',
      facts: [
        ['thesis', 'the central claim being argued'],
        ['counter-argument', 'the opposing case, acknowledged and answered'],
        ['rebuttal', 'the response that answers the counter-argument'],
        ['evidence', 'facts, data or examples supporting a claim'],
        ['ethos', 'persuasion through the credibility of the speaker'],
        ['pathos', 'persuasion through emotion'],
        ['logos', 'persuasion through logic and evidence'],
        ['rhetorical question', 'a question used to make a point'],
        ['rule of three', 'the pattern of grouping points in threes'],
        ['anecdote', 'a short personal story used as support'],
        ['statistic', 'a number used as evidence'],
        ['call to action', 'the closing request that the reader do something'],
        ['concession', 'admitting a point to the other side'],
        ['loaded language', 'wording chosen to prejudge the issue']
      ],
      truths: [
        'Acknowledging a counter-argument usually makes a case stronger, not weaker.',
        'Ethos, pathos and logos are three different routes to persuasion.',
        'A statistic without a source is weak evidence.',
        'A call to action tells the reader exactly what to do next.'
      ],
      myths: [
        'A persuasive essay should never mention the opposing view.',
        'Emotion is the only thing that persuades readers.',
        'Any number used in an argument counts as strong evidence.',
        'A thesis should be kept hidden until the conclusion.'
      ]
    },
    {
      name: 'Expository and Report Writing', from: 'Grade 7', to: 'College',
      facts: [
        ['exposition', 'writing that explains rather than argues'],
        ['objective tone', 'a tone that avoids personal opinion'],
        ['third person', 'the impersonal voice used in most reports'],
        ['heading', 'a label showing what a section covers'],
        ['data', 'the recorded observations or figures'],
        ['method', 'the section describing how something was done'],
        ['findings', 'the section reporting what was observed'],
        ['recommendation', 'a proposed course of action based on findings'],
        ['executive summary', 'a short overview placed at the front'],
        ['appendix', 'supporting material placed at the end'],
        ['citation', 'a reference to the source of information'],
        ['technical term', 'a precise word used in a particular field'],
        ['clarity', 'the quality of being immediately understandable'],
        ['conciseness', 'saying what is needed and no more']
      ],
      truths: [
        'A report separates what was found from what is recommended.',
        'Expository writing explains; persuasive writing argues.',
        'Technical terms should be defined the first time they are used.',
        'An executive summary is written last but read first.'
      ],
      myths: [
        'A report should read like a personal essay.',
        'Expository and persuasive writing have the same purpose.',
        'The more technical terms a report uses, the better it is.',
        'The executive summary belongs at the end of the report.'
      ]
    },
    {
      name: 'Research and Referencing', from: 'Grade 8', to: 'College',
      facts: [
        ['source', 'a text or dataset that information comes from'],
        ['citation', 'a short in-text credit to a source'],
        ['bibliography', 'the full list of sources at the end'],
        ['plagiarism', 'presenting someone else’s work as your own'],
        ['quotation', 'the exact words of a source, in quotation marks'],
        ['paraphrase', 'a source’s idea in your own words, still credited'],
        ['peer review', 'expert checking before academic publication'],
        ['credibility', 'how far a source can be trusted'],
        ['bias', 'a slant in how a source presents its subject'],
        ['primary research', 'data you gather yourself'],
        ['secondary research', 'data gathered from existing sources'],
        ['search term', 'the words used to find sources'],
        ['domain', 'the part of a web address indicating who runs the site'],
        ['cross-check', 'confirming a claim in a second independent source']
      ],
      truths: [
        'Paraphrasing still requires a citation.',
        'Peer review checks work before publication but does not guarantee it is right.',
        'A source can be accurate and still be biased in what it emphasises.',
        'Cross-checking a claim in an independent source is the basic test of reliability.'
      ],
      myths: [
        'Only direct quotations need to be cited.',
        'Anything published in a book must be true.',
        'Changing a few words means a passage no longer needs a citation.',
        'Peer review guarantees a paper is correct.'
      ]
    },
    {
      name: 'Editing and Proofreading', from: 'Grade 6', to: 'College',
      facts: [
        ['proofreading', 'the final check for errors before publication'],
        ['typo', 'a keying mistake rather than a knowledge gap'],
        ['redundancy', 'words that add nothing to the meaning'],
        ['active voice', 'a construction that usually makes writing more direct'],
        ['nominalisation', 'turning a verb into a noun, often making prose heavy'],
        ['filler phrase', 'a phrase such as “in order to” that can be cut'],
        ['consistency', 'keeping spelling, tense and formatting uniform'],
        ['style guide', 'the agreed set of conventions for a publication'],
        ['track changes', 'a tool showing what has been edited'],
        ['read aloud', 'a technique that exposes awkward sentences'],
        ['spellcheck limitation', 'the fact that a real word in the wrong place passes'],
        ['sentence variety', 'mixing sentence lengths and openings'],
        ['clarity edit', 'a change made purely so the meaning is unmistakable'],
        ['cut', 'a deletion made because the text is stronger without it']
      ],
      truths: [
        'A spellchecker cannot catch a correctly spelled word used wrongly.',
        'Reading aloud exposes awkward phrasing that the eye skips over.',
        'Proofreading comes after revising, not instead of it.',
        'Most first drafts get stronger when they get shorter.'
      ],
      myths: [
        'A spellchecker catches every kind of error.',
        'Proofreading and revising are the same task.',
        'Longer sentences always sound more sophisticated.',
        'Cutting words always weakens a piece of writing.'
      ]
    }
  ],

  /* =============================== LITERATURE =============================== */
  literature: [
    {
      name: 'Literary Devices', from: 'Grade 6', to: 'College',
      facts: [
        ['metaphor', 'a comparison stating one thing is another'],
        ['simile', 'a comparison using like or as'],
        ['symbolism', 'an object standing for a larger idea'],
        ['motif', 'an image or idea recurring through a work'],
        ['theme', 'the underlying idea a work explores'],
        ['irony', 'a gap between appearance and reality'],
        ['dramatic irony', 'when the audience knows what a character does not'],
        ['juxtaposition', 'placing two things side by side for contrast'],
        ['pathetic fallacy', 'weather or landscape reflecting a mood'],
        ['allusion', 'a reference to another work or event'],
        ['tone', 'the writer’s attitude to the subject'],
        ['imagery', 'language that appeals to the senses'],
        ['repetition', 'deliberate reuse of a word or structure for effect'],
        ['foreshadowing', 'an early hint of a later event']
      ],
      truths: [
        'Dramatic irony depends on the audience knowing more than a character.',
        'A motif recurs; a symbol stands for something.',
        'Theme is the idea a work explores, not a one-word topic.',
        'Pathetic fallacy uses the setting to mirror emotion.'
      ],
      myths: [
        'A theme and a plot summary are the same thing.',
        'Irony simply means something unlucky happening.',
        'A symbol and a motif are interchangeable terms.',
        'Imagery only ever refers to what can be seen.'
      ]
    },
    {
      name: 'Poetry Forms and Analysis', from: 'Grade 6', to: 'College',
      facts: [
        ['stanza', 'a group of lines in a poem'],
        ['rhyme scheme', 'the pattern of end rhymes, written as ABAB'],
        ['sonnet', 'a fourteen-line poem in a fixed form'],
        ['haiku', 'a three-line Japanese form of 5, 7 and 5 syllables'],
        ['free verse', 'poetry with no fixed rhyme or metre'],
        ['blank verse', 'unrhymed iambic pentameter'],
        ['iambic pentameter', 'a line of five unstressed–stressed pairs'],
        ['metre', 'the rhythmic pattern of a line'],
        ['enjambment', 'a sentence running past the end of a line'],
        ['caesura', 'a strong pause inside a line'],
        ['volta', 'the turn in argument in a sonnet'],
        ['refrain', 'a line repeated through a poem'],
        ['ballad', 'a narrative poem in short stanzas, often sung'],
        ['ode', 'a formal poem addressed to a subject']
      ],
      truths: [
        'Free verse has no fixed metre but is still deliberately shaped.',
        'Enjambment carries a sentence across a line break.',
        'Blank verse is unrhymed but does have a regular metre.',
        'A sonnet has fourteen lines.'
      ],
      myths: [
        'Free verse means the poet made no formal choices.',
        'Blank verse and free verse mean the same thing.',
        'All poetry must rhyme.',
        'A stanza and a line are the same unit.'
      ]
    },
    {
      name: 'Character and Plot', from: 'Grade 6', to: 'College',
      facts: [
        ['protagonist', 'the central character whose story we follow'],
        ['antagonist', 'the opposing character or force'],
        ['characterisation', 'the way a writer builds a character'],
        ['foil', 'a character whose contrast highlights another'],
        ['round character', 'a character with depth and contradictions'],
        ['flat character', 'a character defined by one or two traits'],
        ['character arc', 'the way a character changes across a work'],
        ['conflict', 'the struggle driving a narrative'],
        ['internal conflict', 'a struggle within a character'],
        ['external conflict', 'a struggle between a character and an outside force'],
        ['subplot', 'a secondary storyline'],
        ['climax', 'the point of greatest tension'],
        ['denouement', 'the unwinding of the plot after the climax'],
        ['setting', 'the time and place of the action']
      ],
      truths: [
        'A foil exists to highlight another character by contrast.',
        'Conflict can be internal as well as external.',
        'A flat character is not a flaw; it can be a deliberate choice.',
        'Setting can function as a force acting on the characters.'
      ],
      myths: [
        'Every story must have a villain to have a conflict.',
        'A protagonist is by definition a hero.',
        'A flat character is always a sign of weak writing.',
        'The denouement comes before the climax.'
      ]
    },
    {
      name: 'Shakespeare', from: 'Grade 7', to: 'College',
      facts: [
        ['soliloquy', 'a speech delivered by a character alone on stage'],
        ['aside', 'a remark heard by the audience but not other characters'],
        ['iambic pentameter', 'the ten-syllable line Shakespeare wrote in'],
        ['Globe Theatre', 'the London playhouse associated with his company'],
        ['tragedy', 'a play ending in the downfall of its protagonist'],
        ['comedy', 'a play ending in reconciliation, usually marriage'],
        ['history play', 'a drama based on the reigns of English kings'],
        ['tragic flaw', 'the weakness that brings about a hero’s fall'],
        ['prologue', 'the introductory speech before a play’s action'],
        ['Macbeth', 'the tragedy of a Scottish general and his ambition'],
        ['Romeo and Juliet', 'the tragedy of two lovers from feuding families'],
        ['Hamlet', 'the tragedy of a Danish prince and a delayed revenge'],
        ['A Midsummer Night’s Dream', 'the comedy of lovers, fairies and a play within a play'],
        ['dramatic irony', 'the device by which the audience knows what characters do not']
      ],
      truths: [
        'A soliloquy is spoken when a character is alone; an aside is not.',
        'Shakespeare wrote comedies, tragedies and histories.',
        'Much of Shakespeare’s verse is in iambic pentameter.',
        'Female roles were played by boys and men in the original productions.'
      ],
      myths: [
        'Shakespeare wrote only tragedies.',
        'A soliloquy is a conversation between two characters.',
        'Shakespeare’s plays were written entirely in prose.',
        'Women performed the female roles on the Elizabethan public stage.'
      ]
    },
    {
      name: 'Genre and Form', from: 'Grade 7', to: 'College',
      facts: [
        ['novel', 'an extended fictional prose narrative'],
        ['novella', 'a work of fiction shorter than a novel'],
        ['short story', 'a brief fictional narrative, usually one main effect'],
        ['drama', 'a work written to be performed'],
        ['gothic', 'a genre of dread, ruin and the uncanny'],
        ['dystopia', 'a genre imagining a society gone wrong'],
        ['bildungsroman', 'a novel following a character’s growing up'],
        ['satire', 'writing that ridicules in order to criticise'],
        ['allegory', 'a narrative whose surface stands for something else'],
        ['epistolary', 'a novel told through letters or documents'],
        ['memoir', 'a first-person account of part of a real life'],
        ['epic', 'a long narrative poem about heroic deeds'],
        ['convention', 'a feature readers expect from a genre'],
        ['subversion', 'deliberately breaking a genre expectation']
      ],
      truths: [
        'Genre conventions are expectations a writer can meet or deliberately break.',
        'A bildungsroman follows a character’s growth into maturity.',
        'Satire criticises through ridicule rather than direct argument.',
        'An allegory works on two levels at once.'
      ],
      myths: [
        'Genre rules are fixed and cannot be broken.',
        'A memoir and an autobiography cover exactly the same ground.',
        'Satire is simply comedy with no purpose.',
        'An allegory means the same as a metaphor.'
      ]
    },
    {
      name: 'Themes and Context', from: 'Grade 8', to: 'College',
      facts: [
        ['context', 'the circumstances in which a work was written or is read'],
        ['historical context', 'the events surrounding a work’s composition'],
        ['social context', 'the structure of the society a work reflects'],
        ['authorial intention', 'what the writer set out to do'],
        ['reception', 'how readers at different times have responded'],
        ['canon', 'the set of works treated as central'],
        ['interpretation', 'a supported reading of a text'],
        ['critical reading', 'reading that questions rather than accepts'],
        ['universal theme', 'an idea recognisable across times and cultures'],
        ['zeitgeist', 'the spirit of a particular period'],
        ['adaptation', 'a work remade in another medium'],
        ['intertextuality', 'the way texts refer to and shape each other'],
        ['close reading', 'detailed attention to language on the page'],
        ['thesis statement', 'the claim an essay about a text sets out to prove']
      ],
      truths: [
        'More than one supported interpretation of a text can coexist.',
        'Context shapes both how a work was written and how it is read.',
        'Close reading grounds an interpretation in the words on the page.',
        'A work’s reception can change dramatically over time.'
      ],
      myths: [
        'Every text has exactly one correct interpretation.',
        'Context is irrelevant to what a text means.',
        'An opinion about a text needs no evidence.',
        'A work’s reputation has always been what it is today.'
      ]
    }
  ],

  /* ================================ SPELLING ================================ */
  spelling: [
    {
      name: 'Spelling Patterns and Rules', from: 'Grade 1', to: 'Grade 8',
      facts: [
        ['i before e', 'the pattern that usually holds except after c'],
        ['silent e', 'the final e that lengthens the vowel before it'],
        ['doubling rule', 'doubling a final consonant before adding -ing or -ed'],
        ['drop the e', 'removing final e before a suffix beginning with a vowel'],
        ['y to i', 'changing y to i before adding a suffix'],
        ['soft c', 'the s sound c makes before e, i or y'],
        ['hard c', 'the k sound c makes before a, o or u'],
        ['digraph', 'two letters making one sound, such as sh'],
        ['trigraph', 'three letters making one sound, such as igh'],
        ['split digraph', 'a vowel and e separated by a consonant, as in cake'],
        ['schwa', 'the weak unstressed vowel sound in words like about'],
        ['syllable', 'a unit of a word containing one vowel sound'],
        ['root word', 'the base word before prefixes or suffixes are added'],
        ['mnemonic', 'a memory trick for a hard spelling']
      ],
      truths: [
        'The silent e at the end of a word usually lengthens the vowel before it.',
        'A final consonant is doubled when a short vowel comes before it.',
        'Words ending in consonant + y change y to i before most suffixes.',
        'A syllable contains exactly one vowel sound.'
      ],
      myths: [
        'The i-before-e rule has no exceptions.',
        'A silent letter can always be left out because it is not sounded.',
        'Every final consonant is doubled before -ing.',
        'A syllable is the same as a letter.'
      ]
    },
    {
      name: 'Homophones and Confusables', from: 'Grade 2', to: 'Grade 9',
      facts: [
        ['homophone', 'a word sounding like another but spelt differently'],
        ['there', 'in that place'],
        ['their', 'belonging to them'],
        ['they’re', 'the contraction of they are'],
        ['to', 'the preposition or the infinitive marker'],
        ['too', 'also, or excessively'],
        ['two', 'the number 2'],
        ['hear', 'to perceive with the ears'],
        ['here', 'in this place'],
        ['whose', 'belonging to whom'],
        ['who’s', 'the contraction of who is'],
        ['weather', 'the state of the atmosphere'],
        ['whether', 'the word introducing a choice'],
        ['homograph', 'a word spelt like another but with a different meaning']
      ],
      truths: [
        'Homophones sound the same but are spelt differently.',
        'They’re is only ever short for “they are”.',
        'Who’s is a contraction; whose shows possession.',
        'A spellchecker will not flag the wrong homophone.'
      ],
      myths: [
        'Homophones are spelt the same way as each other.',
        'Their and they’re can be used interchangeably.',
        'A spellchecker catches homophone errors.',
        'Whose is short for “who is”.'
      ]
    },
    {
      name: 'Tricky and High-Frequency Words', from: 'Grade 1', to: 'Grade 8',
      facts: [
        ['necessary', 'needed — one c, two s'],
        ['separate', 'apart — there is “a rat” in the middle'],
        ['definitely', 'certainly — from “finite”, no a'],
        ['accommodate', 'to make room for — two c, two m'],
        ['occurred', 'happened — two c, two r'],
        ['rhythm', 'a regular pattern — no standard vowel letters'],
        ['embarrass', 'to make self-conscious — two r, two s'],
        ['because', 'the word introducing a reason'],
        ['friend', 'a companion — i before e here'],
        ['beautiful', 'lovely to look at'],
        ['through', 'from one side to the other'],
        ['thought', 'the past tense of think'],
        ['believe', 'to accept as true'],
        ['conscience', 'the sense of right and wrong — science with con']
      ],
      truths: [
        'Necessary has one c and two s letters.',
        'Separate contains the letters “a rat” in the middle.',
        'Accommodate has a double c and a double m.',
        'Mnemonics work because they attach a hard spelling to something memorable.'
      ],
      myths: [
        'Necessary is spelt with two c letters.',
        'Definitely contains the word “finite” spelt with an a.',
        'Embarrass has a single r.',
        'High-frequency words are always easy to spell.'
      ]
    },
    {
      name: 'Plurals and Word Endings', from: 'Grade 2', to: 'Grade 8',
      facts: [
        ['-s plural', 'the ordinary plural ending'],
        ['-es plural', 'the plural after s, x, z, ch or sh'],
        ['-ies plural', 'the plural for nouns ending in consonant + y'],
        ['-ves plural', 'the plural for many nouns ending in f or fe'],
        ['irregular plural', 'a plural such as feet or mice with no rule'],
        ['unchanged plural', 'a noun such as sheep with the same plural form'],
        ['-ing form', 'the present participle ending'],
        ['-ed form', 'the regular past tense ending'],
        ['-tion ending', 'a common noun ending pronounced “shun”'],
        ['-sion ending', 'a noun ending after l, n, r or a vowel'],
        ['-ible / -able', 'two spellings of the same suffix meaning “able to be”'],
        ['-ent / -ant', 'two spellings of an adjective and noun ending'],
        ['-ough', 'a spelling with several different pronunciations'],
        ['-que ending', 'a French-derived ending pronounced “k”']
      ],
      truths: [
        'Nouns ending in ch, sh, s, x or z take -es in the plural.',
        'Some nouns, such as sheep and deer, do not change in the plural.',
        'The -ough spelling has several different pronunciations.',
        'Many nouns ending in f change to -ves in the plural.'
      ],
      myths: [
        'Every English plural is formed by adding -s.',
        'The -ough spelling is always pronounced the same way.',
        'Nouns ending in f always simply add -s.',
        'Irregular plurals follow a rule that is simply less common.'
      ]
    }
  ]
};
